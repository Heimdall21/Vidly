//const { describe } = require('joi');
const request = require('supertest');
const { Genre } = require('../../models/genre');
const { User } = require('../../models/user');

let server;

describe('/api/genres', () => {
    beforeEach(() => { server = require('../../index'); })
    afterEach(async () => { 
        await server.close(); 
        await Genre.remove({});
        
    });

    describe('GET /', () => {
        it('should return all genres!', async () => {
            await Genre.collection.insertMany([
                 { name: 'genre1' },
                 { name: 'genre2' },
                 { name: 'genre3' },
            ]);
            const res = await request(server).get('/api/genres');
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(3);
            expect(res.body.some(g => g.name === 'genre1')).toBeTruthy();
            expect(res.body.some(g => g.name === 'genre2')).toBeTruthy();
            expect(res.body.some(g => g.name === 'genre3')).toBeTruthy();

        });
    });

    describe('GET /:id', () => {
        it('should return a genre if valid id is passed', async () => {
            const genre = new Genre({ name: 'genre1' });
            await genre.save();

            const res = await request(server).get('/api/genres/' + genre._id);

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('name', genre.name);
        });

        it('should return 404 if invalid id is passed', async () => {
            const res = await request(server).get('/api/genres/' + '1');

            expect(res.status).toBe(404);
        });
    });

    describe('POST /', () => {

        let token;
        let name;

        const exec = async () => {
            return await request(server)
                .post('/api/genres')
                .set('x-auth-token', token)
                .send({ 
                    name: name
                });
        }

        beforeEach(() => {
            token = new User().generateAuthToken();
            name = 'genre1';
        })

        it('should return 401 if client is not logged in', async () => {
            // TODO
            token = ''
            const res = await exec();       // should get rid of ".set"

            expect(res.status).toBe(401)
        });

        it('should return 400 if genre is less than 5 characters', async () => {
            // generate authentication token and then
            name = "1234";
            const res = await exec();
            
            expect(res.status).toBe(400);
        });

        // a genre should not be more than 50 characters
        it('should return 400 if genre is more than 50 characters', async () => {
            name = new Array(52).join('a');

            const res = await exec();
            
            expect(res.status).toBe(400);

        });

        it('should save the genre if it is valid', async () => {
            // TODO
            await exec();
            
            const genre = await Genre.find({ name: name});

            expect(genre).not.toBeNull();
        });


        it('should return the genre if it is valid', async () => {
            const res = await exec();

            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('name', 'genre1');
        });
    });
});



