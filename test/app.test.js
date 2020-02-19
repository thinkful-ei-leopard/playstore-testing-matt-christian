const { expect } = require('chai')
const supertest = require('supertest')
const app = require('../src/app')

describe('GET /apps', () => {
    it('should return 200 and a JSON array of apps', () => {
        return supertest(app)
            .get('/apps')
            .expect(200)
            .expect('Content-Type', /json/)
            .then(res => {
                expect(res.body).to.be.an('array')
                expect(res.body).to.have.lengthOf.at.least(1)
                expect(res.body[0]).to.include.all.keys(
                    'App', 'Rating', 'Genres'
                )
            })
    })
        

    it('should return 400 if `sort` is invalid', () => {
        return supertest(app)
        .get('/apps')
        .query({ sort: 'MISTAKE' })
        .expect(400, 'Sort must be by rating or app.');
    })

    const validSorts = ['Rating', 'App'];
    validSorts.forEach(validSort => {
        it(`should return array of apps sorted by ${validSort}`, () => {
            return supertest(app)
            .get('/apps')
            .query({ sort: validSort })
            .expect(200)
            .expect('Content-Type', /json/)
            .then(res => {
                expect(res.body).to.be.an('array');
                let i = 0, sorted = true;
                while (sorted && i < res.body.length -1) { 
                    sorted = sorted && res.body[i][validSort] <= res.body[i + 1][validSort];
                    i++
                }
                expect(sorted).to.be.true;
            })
            
        })
    })

    it('should return 400 if `genres` is invalid', () => {
        return supertest(app)
        .get('/apps')
        .query({ genres: 'MISTAKE' })
        .expect(400);
    })

    const validGenres = ['Action', 'Puzzle', 'Strategy', 'Casual', 'Arcade', 'Card'];
    validGenres.forEach(validGenre => {
        it(`should return an array of apps filtered by ${validGenre}`, () => {
            return supertest(app)
                .get('/apps')
                .query({ genres: validGenre })
                .expect(200)
                .then(res => {
                    expect(res.body).to.be.an('array');
                    const app= res.body[0];
                    expect(app.Genres).to.include(validGenre);
                })
        })
    })
})