import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('carrental.db');

export const initDatabase = () => {
    try {
        db.execSync(`
      PRAGMA journal_mode = WAL;
      
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT,
        email TEXT UNIQUE,
        password TEXT, -- Storing plaintext for local testing simplicity
        phone TEXT,
        profilePhotoUrl TEXT,
        licenseStatus TEXT,
        averageRating REAL,
        totalRentals INTEGER,
        userType TEXT,
        agencyName TEXT,
        createdAt TEXT
      );

      CREATE TABLE IF NOT EXISTS agencies (
        id TEXT PRIMARY KEY,
        name TEXT,
        description TEXT,
        locationLat REAL,
        locationLng REAL,
        address TEXT,
        logoUrl TEXT,
        rating REAL,
        totalReviews INTEGER,
        minPrice REAL,
        createdAt TEXT
      );

      CREATE TABLE IF NOT EXISTS vehicles (
        id TEXT PRIMARY KEY,
        agencyId TEXT,
        make TEXT,
        model TEXT,
        year INTEGER,
        category TEXT,
        pricePerDay REAL,
        imageUrl TEXT,
        transmission TEXT,
        fuelType TEXT,
        seats INTEGER,
        rating REAL,
        totalTrips INTEGER,
        isAvailable INTEGER, -- 1 for true, 0 for false
        features TEXT, -- JSON string
        images TEXT, -- JSON string
        locationLat REAL,
        locationLng REAL,
        address TEXT,
        createdAt TEXT,
        FOREIGN KEY (agencyId) REFERENCES agencies(id)
      );

      CREATE TABLE IF NOT EXISTS bookings (
        id TEXT PRIMARY KEY,
        userId TEXT,
        vehicleId TEXT,
        agencyId TEXT,
        startDate TEXT,
        endDate TEXT,
        deliveryType TEXT,
        deliveryAddress TEXT,
        totalPrice REAL,
        status TEXT,
        createdAt TEXT,
        FOREIGN KEY (userId) REFERENCES users(id),
        FOREIGN KEY (vehicleId) REFERENCES vehicles(id),
        FOREIGN KEY (agencyId) REFERENCES agencies(id)
      );

      CREATE TABLE IF NOT EXISTS reviews (
        id TEXT PRIMARY KEY,
        userId TEXT,
        agencyId TEXT,
        vehicleId TEXT,
        rating REAL,
        comment TEXT,
        createdAt TEXT,
        FOREIGN KEY (userId) REFERENCES users(id),
        FOREIGN KEY (agencyId) REFERENCES agencies(id)
      );
    `);

        // Check if we need to seed data
        const result = db.getFirstSync<{ count: number }>('SELECT count(*) as count FROM agencies');
        if (result && result.count === 0) {
            console.log('Seeding database with mock data...');
            seedDatabase();
        }

        console.log('Database initialized successfully');
    } catch (error) {
        console.error('Error initializing database:', error);
    }
};

const seedDatabase = () => {
    // Agencies
    const agencies = [
        {
            id: '1', name: 'Premium Cars', description: 'Luxury car rentals', locationLat: 34.020882, locationLng: -6.841650,
            address: 'Rabat Agdal', logoUrl: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200',
            rating: 4.8, totalReviews: 120, minPrice: 500, createdAt: new Date().toISOString()
        },
        {
            id: '2', name: 'City Drive', description: 'Affordable city cars', locationLat: 33.573110, locationLng: -7.589843,
            address: 'Casablanca Maarif', logoUrl: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=200',
            rating: 4.5, totalReviews: 85, minPrice: 300, createdAt: new Date().toISOString()
        }
    ];

    agencies.forEach(a => {
        db.runSync(
            `INSERT INTO agencies (id, name, description, locationLat, locationLng, address, logoUrl, rating, totalReviews, minPrice, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [a.id, a.name, a.description, a.locationLat, a.locationLng, a.address, a.logoUrl, a.rating, a.totalReviews, a.minPrice, a.createdAt]
        );
    });

    // Vehicles
    const vehicles = [
        { id: 'v1', agencyId: '1', make: 'Mercedes', model: 'C-Class', year: 2023, category: 'Luxury', pricePerDay: 1200, imageUrl: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800', transmission: 'Automatic', fuelType: 'Diesel', seats: 5, rating: 4.9, totalTrips: 45, isAvailable: 1, features: JSON.stringify(["GPS", "Leather Seats"]), images: JSON.stringify([]), locationLat: 34.020882, locationLng: -6.841650, address: 'Rabat Agdal', createdAt: new Date().toISOString() },
        { id: 'v2', agencyId: '1', make: 'BMW', model: '3 Series', year: 2023, category: 'Luxury', pricePerDay: 1300, imageUrl: 'https://images.unsplash.com/photo-1555215695-3004980adade?w=800', transmission: 'Automatic', fuelType: 'Petrol', seats: 5, rating: 4.8, totalTrips: 32, isAvailable: 1, features: JSON.stringify(["Sunroof", "Bluetooth"]), images: JSON.stringify([]), locationLat: 34.020882, locationLng: -6.841650, address: 'Rabat Agdal', createdAt: new Date().toISOString() },
        { id: 'v3', agencyId: '2', make: 'Renault', model: 'Clio 5', year: 2024, category: 'Economy', pricePerDay: 350, imageUrl: 'https://images.unsplash.com/photo-1621007947382-bb3c3968e3bb?w=800', transmission: 'Manual', fuelType: 'Diesel', seats: 5, rating: 4.6, totalTrips: 89, isAvailable: 1, features: JSON.stringify(["Bluetooth", "AC"]), images: JSON.stringify([]), locationLat: 33.573110, locationLng: -7.589843, address: 'Casablanca Maarif', createdAt: new Date().toISOString() },
        { id: 'v4', agencyId: '2', make: 'Dacia', model: 'Logan', year: 2023, category: 'Economy', pricePerDay: 300, imageUrl: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800', transmission: 'Manual', fuelType: 'Diesel', seats: 5, rating: 4.4, totalTrips: 120, isAvailable: 1, features: JSON.stringify(["AC"]), images: JSON.stringify([]), locationLat: 33.573110, locationLng: -7.589843, address: 'Casablanca Maarif', createdAt: new Date().toISOString() }
    ];

    vehicles.forEach(v => {
        db.runSync(
            `INSERT INTO vehicles (id, agencyId, make, model, year, category, pricePerDay, imageUrl, transmission, fuelType, seats, rating, totalTrips, isAvailable, features, images, locationLat, locationLng, address, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [v.id, v.agencyId, v.make, v.model, v.year, v.category, v.pricePerDay, v.imageUrl, v.transmission, v.fuelType, v.seats, v.rating, v.totalTrips, v.isAvailable, v.features, v.images, v.locationLat, v.locationLng, v.address, v.createdAt]
        );
    });
};

export default db;
