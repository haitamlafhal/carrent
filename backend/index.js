const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Helper to convert snake_case keys to camelCase
const toCamelCase = (o) => {
    if (o === null || typeof o !== 'object') return o;
    if (Array.isArray(o)) return o.map(toCamelCase);
    const newO = {};
    for (const k in o) {
        const newK = k.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
        newO[newK] = toCamelCase(o[k]);
    }
    return newO;
};

// --- Auth Routes ---
app.post('/auth/register', async (req, res) => {
    const { name, email, password, userType, agencyName } = req.body;
    try {
        const id = Date.now().toString(); // matching frontend ID logic
        const createdAt = new Date().toISOString();

        // Check if email exists
        const userCheck = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userCheck.rows.length > 0) {
            return res.status(400).json({ code: 'auth/email-already-in-use', message: 'Email already in use' });
        }

        // If manager and agencyName provided, ensure agency exists
        if (userType === 'manager' && agencyName) {
            const agencyCheck = await db.query('SELECT * FROM agencies WHERE name = $1', [agencyName]);
            if (agencyCheck.rows.length === 0) {
                const agencyId = Date.now().toString() + '_agency';
                await db.query(`
                    INSERT INTO agencies (id, name, description, address, location_lat, location_lng, rating, total_reviews, min_price, created_at)
                    VALUES ($1, $2, $3, $4, 34.020882, -6.841650, 0, 0, 0, $5)
                `, [agencyId, agencyName, 'New Agency', 'Morocco', createdAt]);
                console.log(`Created new agency: ${agencyName} (${agencyId})`);
            }
        }

        await db.query(
            `INSERT INTO users (id, name, email, password, user_type, agency_name, created_at, license_status, average_rating, total_rentals)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'pending', 0, 0)`,
            [id, name, email, password, userType, agencyName || null, createdAt]
        );

        const newUser = await db.query('SELECT * FROM users WHERE id = $1', [id]);
        res.json(toCamelCase(newUser.rows[0]));
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Registration failed' });
    }
});

app.post('/auth/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const result = await db.query('SELECT * FROM users WHERE email = $1 AND password = $2', [email, password]);
        if (result.rows.length === 0) {
            return res.status(401).json({ code: 'auth/invalid-credential', message: 'Invalid credentials' });
        }
        res.json(toCamelCase(result.rows[0]));
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Login failed' });
    }
});

// --- Data Routes ---
app.get('/agencies', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM agencies');
        res.json(toCamelCase(result.rows)); // Return all, let frontend filter distance
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/vehicles', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM vehicles');
        res.json(toCamelCase(result.rows));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/agencies/:id/vehicles', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM vehicles WHERE agency_id = $1', [req.params.id]);
        res.json(toCamelCase(result.rows));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/agencies/:id/reviews', async (req, res) => {
    try {
        // Join with users to get reviewer name
        const result = await db.query(`
      SELECT r.*, u.name as user_name 
      FROM reviews r 
      LEFT JOIN users u ON r.user_id = u.id 
      WHERE r.agency_id = $1
    `, [req.params.id]);

        const reviews = result.rows.map(row => ({
            ...toCamelCase(row),
            user: { name: row.user_name }
        }));
        res.json(reviews);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/bookings/my', async (req, res) => {
    const { userId } = req.query;
    try {
        const result = await db.query(`
      SELECT b.*, 
             v.make, v.model, v.image_url,
             a.name as agency_name, a.logo_url as agency_logo_url
      FROM bookings b
      JOIN vehicles v ON b.vehicle_id = v.id
      JOIN agencies a ON b.agency_id = a.id
      WHERE b.user_id = $1
      ORDER BY b.created_at DESC
    `, [userId]);

        // Format to match expected frontend structure (nested objects)
        const bookings = result.rows.map(row => {
            const b = toCamelCase(row);
            return {
                ...b,
                vehicle: {
                    id: b.vehicleId,
                    make: b.make,
                    model: b.model,
                    imageUrl: b.imageUrl
                },
                agency: {
                    id: b.agencyId,
                    name: b.agencyName,
                    logoUrl: b.agencyLogoUrl
                }
            };
        });

        res.json(bookings);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

app.get('/bookings/agency/:agencyId', async (req, res) => {
    try {
        const result = await db.query(`
      SELECT b.*, 
             v.make, v.model, v.image_url,
             u.name as user_name, u.profile_photo_url as user_photo, u.average_rating as user_rating
      FROM bookings b
      JOIN vehicles v ON b.vehicle_id = v.id
      JOIN users u ON b.user_id = u.id
      WHERE b.agency_id = $1
      ORDER BY b.created_at DESC
    `, [req.params.agencyId]);

        const bookings = result.rows.map(row => {
            const b = toCamelCase(row);
            return {
                ...b,
                vehicle: {
                    id: b.vehicleId,
                    make: b.make,
                    model: b.model,
                    imageUrl: b.imageUrl
                },
                user: {
                    id: b.userId,
                    name: b.userName,
                    profilePhotoUrl: b.userPhoto,
                    averageRating: b.userRating
                }
            };
        });

        res.json(bookings);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/bookings', async (req, res) => {
    const booking = req.body;
    try {
        const id = Date.now().toString();
        const createdAt = new Date().toISOString();

        await db.query(
            `INSERT INTO bookings (id, user_id, vehicle_id, agency_id, start_date, end_date, delivery_type, delivery_address, total_price, status, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
            [id, booking.userId, booking.vehicleId, booking.agencyId, booking.startDate, booking.endDate, booking.deliveryType, booking.deliveryAddress, booking.totalPrice, 'pending', createdAt]
        );

        res.json({ id, status: 'pending' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

app.post('/vehicles', async (req, res) => {
    const vehicle = req.body;
    try {
        const id = Date.now().toString() + '_v'; // unique id
        const createdAt = new Date().toISOString();

        // 1. Get Agency Location
        const agencyRes = await db.query('SELECT location_lat, location_lng, address FROM agencies WHERE id = $1', [vehicle.agencyId]);
        const agencyLoc = agencyRes.rows[0] || { location_lat: 34.020882, location_lng: -6.841650, address: 'Morocco' };

        // 2. Insert Vehicle
        await db.query(
            `INSERT INTO vehicles (
                id, agency_id, make, model, year, category, price_per_day, image_url,
                transmission, fuel_type, seats, rating, total_trips, is_available,
                features, images, location_lat, location_lng, address, created_at
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, 0, 0, true, $12, $13, $14, $15, $16, $17)`,
            [
                id,
                vehicle.agencyId,
                vehicle.make,
                vehicle.model,
                parseInt(vehicle.year) || 2024,
                vehicle.category || 'compact',
                parseFloat(vehicle.pricePerDay),
                vehicle.imageUrl || null,
                vehicle.transmission || 'automatic',
                vehicle.fuelType || 'petrol',
                parseInt(vehicle.seats) || 5,
                JSON.stringify(vehicle.features || []), // features
                JSON.stringify(vehicle.images || []), // images
                agencyLoc.location_lat,
                agencyLoc.location_lng,
                agencyLoc.address,
                createdAt
            ]
        );

        res.json({ id, status: 'success' });
    } catch (err) {
        console.error('Error creating vehicle:', err);
        res.status(500).json({ error: err.message });
    }
});

app.put('/vehicles/:id', async (req, res) => {
    const { id } = req.params;
    const v = req.body;
    try {
        // Dynamic update query construction
        const updates = [];
        const values = [];
        let idx = 1;

        if (v.make) { updates.push(`make = $${idx++}`); values.push(v.make); }
        if (v.model) { updates.push(`model = $${idx++}`); values.push(v.model); }
        if (v.year) { updates.push(`year = $${idx++}`); values.push(parseInt(v.year)); }
        if (v.category) { updates.push(`category = $${idx++}`); values.push(v.category); }
        if (v.pricePerDay) { updates.push(`price_per_day = $${idx++}`); values.push(parseFloat(v.pricePerDay)); }
        if (v.imageUrl) { updates.push(`image_url = $${idx++}`); values.push(v.imageUrl); }
        if (v.transmission) { updates.push(`transmission = $${idx++}`); values.push(v.transmission); }
        if (v.fuelType) { updates.push(`fuel_type = $${idx++}`); values.push(v.fuelType); }
        if (v.seats) { updates.push(`seats = $${idx++}`); values.push(parseInt(v.seats)); }
        if (v.isAvailable !== undefined) { updates.push(`is_available = $${idx++}`); values.push(v.isAvailable); }
        if (v.features) { updates.push(`features = $${idx++}`); values.push(JSON.stringify(v.features)); }
        if (v.images) { updates.push(`images = $${idx++}`); values.push(JSON.stringify(v.images)); }

        if (updates.length === 0) return res.json({ message: 'No changes' });

        values.push(id);
        const query = `UPDATE vehicles SET ${updates.join(', ')} WHERE id = $${idx}`;

        await db.query(query, values);
        res.json({ success: true });
    } catch (err) {
        console.error('Error updating vehicle:', err);
        res.status(500).json({ error: err.message });
    }
});

app.delete('/vehicles/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM vehicles WHERE id = $1', [req.params.id]);
        res.json({ success: true });
    } catch (err) {
        console.error('Error deleting vehicle:', err);
        res.status(500).json({ error: err.message });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
