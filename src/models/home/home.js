import db from '../db.js';

const getCar = async (identifier, identifierType = 'id') => {
    const whereClause = identifierType === 'slug' ? 'c.slug = $1' : 'c.id = $1';

    const query = `
        SELECT
            c.id,
            c.vin,
            c.stock_number,
            c.slug,
            c.year,
            c.make,
            c.model,
            c.trim,
            c.condition,
            c.vehicle_type,
            c.body_style,
            c.price,
            c.original_msrp,
            c.mileage,
            c.exterior_color,
            c.interior_color,
            c.interior_material,
            c.transmission,
            c.drivetrain,
            c.fuel_type,
            c.engine,
            c.horsepower,
            c.torque_lb_ft,
            c.mpg_city,
            c.mpg_highway,
            c.mpg_combined,
            c.battery_range_miles,
            c.seating_capacity,
            c.doors,
            c.description,
            c.highlights,
            c.features,
            c.specifications,
            c.condition_report,
            c.warranty,
            c.availability_status,
            c.location,
            c.image_urls,
            c.created_at,
            c.updated_at
        FROM cars c
        WHERE ${whereClause}
    `;

    const result = await db.query(query, [identifier]);

    if (result.rows.length === 0) return {};

    const car = result.rows[0];

    return {
        id: car.id,
        vin: car.vin,
        stockNumber: car.stock_number,
        slug: car.slug,

        // Basic vehicle information
        year: car.year,
        make: car.make,
        model: car.model,
        trim: car.trim,
        name: `${car.year} ${car.make} ${car.model} ${car.trim}`,
        condition: car.condition,
        vehicleType: car.vehicle_type,
        bodyStyle: car.body_style,

        // Pricing and mileage
        price: Number(car.price),
        originalMsrp: car.original_msrp
            ? Number(car.original_msrp)
            : null,
        mileage: car.mileage,

        // Appearance
        exteriorColor: car.exterior_color,
        interiorColor: car.interior_color,
        interiorMaterial: car.interior_material,

        // Performance
        transmission: car.transmission,
        drivetrain: car.drivetrain,
        fuelType: car.fuel_type,
        engine: car.engine,
        horsepower: car.horsepower,
        torque: car.torque_lb_ft,

        // Fuel efficiency
        mpgCity: car.mpg_city,
        mpgHighway: car.mpg_highway,
        mpgCombined: car.mpg_combined,
        batteryRange: car.battery_range_miles,

        // Capacity
        seatingCapacity: car.seating_capacity,
        doors: car.doors,

        // Detailed information
        description: car.description,
        highlights: car.highlights,
        features: car.features,
        specifications: car.specifications,
        conditionReport: car.condition_report,
        warranty: car.warranty,

        // Inventory
        availabilityStatus: car.availability_status,
        location: car.location,

        // Images
        images: car.image_urls,

        // Timestamps
        createdAt: car.created_at,
        updatedAt: car.updated_at
    };
};

const getSortedCars = async (sortBy = 'newest') => {

    const orderByOptions = {
        newest: 'c.created_at DESC',
        oldest: 'c.created_at ASC',
        priceLow: 'c.price ASC',
        priceHigh: 'c.price DESC',
        mileageLow: 'c.mileage ASC',
        mileageHigh: 'c.mileage DESC',
        year: 'c.year DESC',
        make: 'c.make ASC, c.model ASC'
    };

    const orderByClause =
        orderByOptions[sortBy] || orderByOptions.newest;

    const query = `
        SELECT
            c.id,
            c.slug,
            c.year,
            c.make,
            c.model,
            c.trim,
            c.condition,
            c.price,
            c.mileage,
            c.transmission,
            c.fuel_type,
            c.image_urls,
            c.availability_status
        FROM cars c
        WHERE c.availability_status = 'Available'
        ORDER BY ${orderByClause}
    `;

    const result = await db.query(query);

    return result.rows.map(car => ({
        id: car.id,
        slug: car.slug,
        year: car.year,
        make: car.make,
        model: car.model,
        trim: car.trim,
        condition: car.condition,
        price: Number(car.price),
        mileage: car.mileage,
        transmission: car.transmission,
        fuelType: car.fuel_type,
        imageUrl: car.image_urls?.[0] || '/images/default-car.jpg'
    }));
};

const getCarsByCondition = async (condition, sortBy = 'newest') => {

    const orderByOptions = {
        newest: 'c.year DESC',
        priceLow: 'c.price ASC',
        priceHigh: 'c.price DESC',
        mileageLow: 'c.mileage ASC',
        mileageHigh: 'c.mileage DESC'
    };

    const orderByClause =
        orderByOptions[sortBy] || orderByOptions.newest;

    const query = `
        SELECT *
        FROM cars c
        WHERE c.condition = $1
        AND c.availability_status = 'Available'
        ORDER BY ${orderByClause}
    `;

    const result = await db.query(query, [condition]);

    return result.rows.map(car => ({
        id: car.id,
        slug: car.slug,
        name: `${car.year} ${car.make} ${car.model} ${car.trim}`,
        year: car.year,
        make: car.make,
        model: car.model,
        trim: car.trim,
        price: Number(car.price),
        mileage: car.mileage,
        bodyStyle: car.body_style,
        image: car.image_urls?.[0] || '/images/default-car.jpg'
    }));
};

const getCarById = (carId) => getCar(carId, 'id');

const getCarBySlug = (carSlug) => getCar(carSlug, 'slug');

export {
    getCarById,
    getCarBySlug,
    getSortedCars,
    getCarsByCondition
};