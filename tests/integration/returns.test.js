const { Rental } = require('../../models/rental');
const mongoose = require('mongoose');
const request = require('supertest');
const { User } = require('../../models/user');
const { exceptions } = require('winston');
const moment = require('moment');
const { Movie } = require('../../models/movie');

describe('/api/returns', () => {
    let server;
    let customerId, movieId;
    let rental;
    let token;
    let movie;

    const exec = () => {
        return request(server)
            .post('/api/returns')
            .set('x-auth-token', token)
            .send({ customerId, movieId });
    };

    beforeEach(async () => { 
        server = require('../../index'); 

        customerId = mongoose.Types.ObjectId();
        movieId = mongoose.Types.ObjectId();
        token = new User().generateAuthToken();

        movie = new Movie({
            _id: movieId,
            title: '12345',
            dailyRentalRate: 2,
            genre: { name: '12345' },
            numberInStock: 10
        })

        await movie.save();

        rental = new Rental({
            customer: {
                _id: customerId,
                name: "12345",
                phone: '12345'
            },
            movie: {
                _id: movieId,
                title: 'finding nemo',
                dailyRentalRate: 2,
            }
        });
        await rental.save();
    });

    afterEach(async () => { 
        await server.close(); 
        await Rental.remove({}); 
        await Movie.remove({});
    });

    it('should work!', async () => {
        const result = await Rental.findById(rental._id);
        expect(result).not.toBeNull();
    });

    it('should return 401 if client is not logged in', async () => {
        token = '';

        const result = await exec();

        expect(result.status).toBe(401);
    });

    it('should return 400 if customerID is not provided', async () => {
        customerId = '';

        const result = await exec();

        expect(result.status).toBe(400);
    });

    it('should return 404 if no rental is found for this customer/movie', async () => {
        await Rental.remove({});

        const res = await exec();

        expect(res.status).toBe(404);
    });

    it('should return 400 if no rental is already processed', async () => {
        rental.dateReturned = new Date();
        await rental.save();

        const res = await exec();

        expect(res.status).toBe(400);
    });

    it('should return 200 if the request is valid', async () => {
        const res = await exec();

        expect(res.status).toBe(200);
    });

    it('should set the returnDate if input is valid', async () => {
        const res = await exec();

        const rentalInDb = await Rental.findById(rental._id);

        const diff = new Date() - rentalInDb.dateReturned;

        //expect(rentalInDb.dateReturned).toBeDefined();
        expect(diff).toBeLessThan(10 * 1000);
    });

    it('should return the correct rental fee', async () => {
        rental.rentalFee = 0;
        await rental.save();

        rental.dateOut = moment().add(-7, 'days').toDate();
        await rental.save();

        const res = await exec();

        const rentalInDb = await Rental.findById(rental._id);
        expect(rentalInDb.rentalFee).toBe(14);
    });

    it('should increase the movie stock', async () => {
        const res = await exec();

        const movieInDb = await Movie.findById(movie._id);
        expect(movieInDb.numberInStock).toBe(11);
    });

    it('should return the rental', async () => {
        const res = await exec();

        const rentalInDb = await Rental.findById;
        expect(Object.keys(res.body)).toEqual(
            expect.arrayContaining(['dateOut', 'dateReturned', 'rentalFee', 'customer', 'movie'])
        );
    });

});