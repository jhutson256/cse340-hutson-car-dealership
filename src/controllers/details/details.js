import { getCarBySlug } from '../../models/home/home.js';

const carDetailPage = async (req, res, next) => {
    try {
        const carSlug = req.params.carSlug;
        const car = await getCarBySlug(carSlug);

        if (!car || Object.keys(car).length === 0) {
            const err = new Error(`Vehicle ${carSlug} not found`);
            err.status = 404;
            return next(err);
        }

        res.render('cars/details', {
            title: `${car.year} ${car.make} ${car.model}`,
            car
        });

    } catch (error) {
        next(error);
    }
};

export { carDetailPage };