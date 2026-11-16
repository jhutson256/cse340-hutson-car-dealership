import { getSortedCars } from '../../models/home/home.js';

const homePage = async (req, res, next) => {
    try {
        const validSortOptions = [
            'newest',
            'oldest',
            'priceLow',
            'priceHigh',
            'mileageLow',
            'mileageHigh',
            'year',
            'make'
        ];

        const sortBy = validSortOptions.includes(req.query.sort)
            ? req.query.sort
            : 'newest';

        const carList = await getSortedCars(sortBy);

        res.render('home', {
            title: 'Vehicle Inventory',
            cars: carList,
            currentSort: sortBy
        });

    } catch (error) {
        next(error);
    }
};


export { homePage };