const request = require('supertest')
const { app } = require('./index')

const { db } = require('./db')

jest.mock('./db', () => {
    return {
        db: {
            get: jest.fn(),
            all: jest.fn(),
            run: jest.fn(),
        },
    }
})

beforeEach(() => {
    jest.clearAllMocks()
})

describe('GET /movies', () => {
    // it('Should return movies', async () => {
    //     const response = await request(app).get('/movies')
    //     expect(response.status).toBe(200)
    //     expect(response.body.length).toBeGreaterThan(0)
    // })
})

describe('GET /movies/:movieId', () => {
    it('Should return one movie', async () => {
        db.get.mockImplementation((query, params, callback) => {
            callback(null, {
                id: 1,
                title: 'The Dark Knight',
                director: 'Christopher Nolan',
                year: 2008,
                rating: 5,
            })
        })
        const response = await request(app).get('/movies/1')

        expect(response.status).toBe(200)

        expect(response.body).toStrictEqual({
            id: 1,
            title: 'The Dark Knight',
            director: 'Christopher Nolan',
            year: 2008,
            rating: 5,
        })
    })

    it('Should return 500 if error', async () => {
        db.get.mockImplementation((query, params, callback) => {
            callback(new Error(), null)
        })
        const response = await request(app).get('/movies/1')
        expect(response.status).toBe(500)
    })
})

describe('POST /movies', () => {
    // it('Should create a movie and return 201', async () => {
    //     const response = await request(app).post('/movies').send({
    //         title: 'Dune',
    //         director: 'Denis Villeneuve',
    //         year: 2021,
    //         rating: 4.5,
    //     })

    //     expect(response.status).toBe(201)

    //     expect(response.text).toBe('Created')
    // })

    it('Should return 400 if rating is not between 0 and 5', async () => {
        const response = await request(app).post('/movies').send({
            title: 'Dune',
            director: 'Denis Villeneuve',
            year: 2021,
            rating: 12,
        })

        expect(response.status).toBe(400)

        expect(response.text).toBe('Rating must be between 0 and 5')
    })

    it('If data is not complete', async () => {
        const response = await request(app).post('/movies').send({
            title: 'Dune',
            director: 'Denis Villeneuve',
            year: 2021,
        })

        expect(response.status).toBe(400)

        expect(response.text).toBe('Bad Request')
    })
})

// describe('DELETE /movies/:movieId', () => {
//     it('Should delete one movie', async () => {
//         const response = await request(app).delete('/movies/1')
//         expect(response.status).toBe(204)
//     })
// })
