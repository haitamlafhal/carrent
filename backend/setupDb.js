const db = require('./db');

const setupDatabase = async () => {
    try {
        console.log('Initializing database...');

        // Create Tables
        await db.query(`
            CREATE TABLE IF NOT EXISTS users (
                id VARCHAR(255) PRIMARY KEY,
                name VARCHAR(255),
                email VARCHAR(255) UNIQUE,
                password VARCHAR(255),
                phone VARCHAR(50),
                profile_photo_url TEXT,
                license_status VARCHAR(50),
                average_rating DECIMAL(3, 2),
                total_rentals INTEGER,
                user_type VARCHAR(50),
                agency_name VARCHAR(255),
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        `);

        await db.query(`
            CREATE TABLE IF NOT EXISTS agencies (
                id VARCHAR(255) PRIMARY KEY,
                name VARCHAR(255),
                description TEXT,
                location_lat DECIMAL(10, 8),
                location_lng DECIMAL(11, 8),
                address VARCHAR(255),
                logo_url TEXT,
                rating DECIMAL(3, 2),
                total_reviews INTEGER,
                min_price DECIMAL(10, 2),
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        `);

        await db.query(`
            CREATE TABLE IF NOT EXISTS vehicles (
                id VARCHAR(255) PRIMARY KEY,
                agency_id VARCHAR(255) REFERENCES agencies(id),
                make VARCHAR(100),
                model VARCHAR(100),
                year INTEGER,
                category VARCHAR(50),
                price_per_day DECIMAL(10, 2),
                image_url TEXT,
                transmission VARCHAR(50),
                fuel_type VARCHAR(50),
                seats INTEGER,
                rating DECIMAL(3, 2),
                total_trips INTEGER,
                is_available BOOLEAN DEFAULT TRUE,
                features JSONB,
                images JSONB,
                location_lat DECIMAL(10, 8),
                location_lng DECIMAL(11, 8),
                address VARCHAR(255),
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        `);

        await db.query(`
            CREATE TABLE IF NOT EXISTS bookings (
                id VARCHAR(255) PRIMARY KEY,
                user_id VARCHAR(255) REFERENCES users(id),
                vehicle_id VARCHAR(255) REFERENCES vehicles(id),
                agency_id VARCHAR(255) REFERENCES agencies(id),
                start_date TIMESTAMP WITH TIME ZONE,
                end_date TIMESTAMP WITH TIME ZONE,
                delivery_type VARCHAR(50),
                delivery_address TEXT,
                total_price DECIMAL(10, 2),
                status VARCHAR(50),
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        `);

        await db.query(`
            CREATE TABLE IF NOT EXISTS reviews (
                id VARCHAR(255) PRIMARY KEY,
                user_id VARCHAR(255) REFERENCES users(id),
                agency_id VARCHAR(255) REFERENCES agencies(id),
                vehicle_id VARCHAR(255) REFERENCES vehicles(id),
                rating DECIMAL(3, 2),
                comment TEXT,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        `);

        console.log('Tables created successfully.');

        // Seed Data
        const { rows } = await db.query('SELECT COUNT(*) FROM agencies');
        if (parseInt(rows[0].count) === 0) {
            console.log('Seeding data...');

            // Agencies
            const agencies = [
                ['1', 'Premium Cars', 'Luxury car rentals', 34.020882, -6.841650, 'Rabat Agdal', 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200', 4.8, 120, 500],
                ['2', 'City Drive', 'Affordable city cars', 33.573110, -7.589843, 'Casablanca Maarif', 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=200', 4.5, 85, 300]
            ];

            for (const agency of agencies) {
                await db.query(
                    `INSERT INTO agencies (id, name, description, location_lat, location_lng, address, logo_url, rating, total_reviews, min_price) 
                     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
                    agency
                );
            }

            // Vehicles
            const vehicles = [
                ['v1', '1', 'Mercedes', 'C-Class', 2023, 'Luxury', 1200, 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800', 'Automatic', 'Diesel', 5, 4.9, 45, true, JSON.stringify(["GPS", "Leather Seats"]), JSON.stringify([]), 34.020882, -6.841650, 'Rabat Agdal'],
                ['v2', '1', 'BMW', '3 Series', 2023, 'Luxury', 1300, 'https://images.unsplash.com/photo-1555215695-3004980adade?w=800', 'Automatic', 'Petrol', 5, 4.8, 32, true, JSON.stringify(["Sunroof", "Bluetooth"]), JSON.stringify([]), 34.020882, -6.841650, 'Rabat Agdal'],
                ['v3', '2', 'Renault', 'Clio 5', 2024, 'Economy', 350, 'https://images.unsplash.com/photo-1621007947382-bb3c3968e3bb?w=800', 'Manual', 'Diesel', 5, 4.6, 89, true, JSON.stringify(["Bluetooth", "AC"]), JSON.stringify([]), 33.573110, -7.589843, 'Casablanca Maarif'],
                ['v4', '2', 'Dacia', 'Logan', 2023, 'Economy', 300, 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800', 'Manual', 'Diesel', 5, 4.4, 120, true, JSON.stringify(["AC"]), JSON.stringify([]), 33.573110, -7.589843, 'Casablanca Maarif']
            ];

            for (const vehicle of vehicles) {
                await db.query(
                    `INSERT INTO vehicles (id, agency_id, make, model, year, category, price_per_day, image_url, transmission, fuel_type, seats, rating, total_trips, is_available, features, images, location_lat, location_lng, address) 
                     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)`,
                    vehicle
                );
            }
            console.log('Seeding complete.');
        } else {
            console.log('Database already seeded.');
        }

        process.exit(0);
    } catch (err) {
        console.error('Error setting up database:', err);
        process.exit(1);
    }
};

setupDatabase();
