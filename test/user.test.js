const request = require('supertest')
const app = require('../app')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
let token = ''
let UserId
let accessToken = ''
let username = ''

const { sequelize } = require('../models')
const decodeToken = require('../helpers/decodeToken')
const { queryInterface } = sequelize

beforeAll(done => {
    const salt = bcrypt.genSaltSync(8);
    const hash = bcrypt.hashSync('hihaha', salt);
    queryInterface.bulkInsert(
        'Users',
        [
            { 
            email: 'hiha@example.com',
            password: hash,
            username: 'hiha77',
            createdAt: new Date(),
            updatedAt: new Date(),
            }
        ],
        { returning: true },
    )
    .then(user => {
        // console.log(user);
        UserId = user[0].id
        token = jwt.sign({
            id: user[0].id,
            email: user[0].email,
            username: user[0].username
        }, 'hiha')
        username = user[0].username
        // console.log(token, 'di test')
        done()
    })
    .catch(err => {
        done(err)
    })
}) 


afterAll((done) => {
    queryInterface.bulkDelete('Users')
        .then(response => {
            done()
        })
        .catch(err => {
            done(err)
        })
})

describe('Register User POST /register', () => {
  describe('Register Success', () => {
    test('Response with data', done => {
      request(app)
      .post('/register')
      .send({email: "test@mail.com", password: 'testing', username: 'tester' })
      .end((err, res) => {
        const { body, status} = res
        if(err){
          return done(err)
        }
        expect(status).toBe(201)
        expect(body).toHaveProperty('email', 'test@mail.com')
        expect(body).toHaveProperty('password', 'testing')
        done()
      })
    })
  }),
  describe('Register Error', () => {
    test('cant create user because email has been used', done => {
      request(app)
      .post('/register')
      .send({email: "test@mail.com", password: '123456', username: 'admin1' })
      .end((err, res) => {
        const { body, status} = res
        if(err){
          return done(err)
        }
        expect(status).toBe(400)
        expect(body).toHaveProperty('message', 'Sorry, someone else has registered this email')
        done()
      })
    })
  }),
  describe('Register Error', () => {
    test('cant create user because password length < 6', done => {
      request(app)
      .post('/register')
      .send({email: "testing@mail.com", password: 'tes', username: 'admin' })
      .end((err, res) => {
        const { body, status} = res

        if(err){
          return done(err)
        }
        expect(status).toBe(400)
        expect(body).toHaveProperty('message', 'Password length must be at least 6')
        done()
      })
    })
  }),
  describe('Register Error', () => {
    test('cant create user because username has been used', done => {
      request(app)
      .post('/register')
      .send({email: "tes@mail.com", password: '123456', username: 'tester' })
      .end((err, res) => {
        const { body, status} = res
        if(err){
          return done(err)
        }
        expect(status).toBe(400)
        expect(body).toHaveProperty('message', 'Sorry, someone else has registered this username')
        done()
      })
    })
  }),
  describe('Register Error', () => {
    test('cant create user because email format incorrect', done => {
      request(app)
      .post('/register')
      .send({email: "tesmail.com", password: '123456', username: 'ogy' })
      .end((err, res) => {
        const { body, status} = res
        if(err){
          return done(err)
        }
        expect(status).toBe(400)
        expect(body).toHaveProperty('message', 'Please input the correct email format')
        done()
      })
    })
  }),
  describe('Register Error', () => {
    test('cant create user because email is empty', done => {
      request(app)
      .post('/register')
      .send({password: '123456', username: 'ogy1' })
      .end((err, res) => {
        const { body, status} = res
        if(err){
          return done(err)
        }
        expect(status).toBe(400)
        expect(body).toHaveProperty('message', 'User.email cannot be null')
        done()
      })
    })
  }),
  describe('Register Error', () => {
    test('cant create user because password is empty', done => {
      request(app)
      .post('/register')
      .send({email: "tes2@mail.com", username: 'ogy2' })
      .end((err, res) => {
        const { body, status} = res
        if(err){
          return done(err)
        }
        expect(status).toBe(400)
        expect(body).toHaveProperty('message', 'User.password cannot be null')
        done()
      })
    })
  }),
  describe('Register Error', () => {
    test('cant create user because username is empty', done => {
      request(app)
      .post('/register')
      .send({email: "tes2@mail.com", password: 123456})
      .end((err, res) => {
        const { body, status} = res
        if(err){
          return done(err)
        }
        expect(status).toBe(400)
        expect(body).toHaveProperty('message', 'User.username cannot be null')
        done()
      })
    })
  })
})

describe('login User POST /login', () => {
    describe('Success login User', () => {
        test('response with access token', done => {
            request(app)
            .post('/login')
            .send({
                username: 'hiha77',
                password: 'hihaha'
        })
            .end((err, res) => {
                const {body, status} = res
                // console.log(res.body, 'isi res test')
                if (err) {
                    return done(err)
                }
                accessToken = body.access_token
                expect(status).toBe(200)
                expect(body).toHaveProperty('access_token')
                done()
            })
        })
        test('decode access token', done => {
            request(app)
            .post('/login')
            .send({
                username: 'hiha77',
                password: 'hihaha'
        })
            .end((err, res) => {
                const {body, status} = res
                // console.log(res.body, 'isi res test')
                if (err) {
                    return done(err)
                }
                let decodedToken = decodeToken(body.access_token, 'hiha')
                expect(decodedToken).toHaveProperty('username', 'hiha77')
                done()
            })
        })
    }),
    describe('Failed User login', () => {
        test('wrong username', done => {
            request(app)
            .post('/login')
            .send({
                username: 'hiha88',
                password: 'hihaha'
        })
            .end((err, res) => {
                const {body, status} = res
                if (err) {
                    return done(err)
                }
                expect(status).toBe(404)
                expect(body).toHaveProperty('message', 'username or password seems to be wrong')
                done()
            })
        }),

        test('wrong password', done => {
            request(app)
            .post('/login')
            .send({
                username: 'hiha77',
                password: 'hahaha'
        })
            .end((err, res) => {
                const {body, status} = res
                if (err) {
                    return done(err)
                }
                expect(status).toBe(404)
                expect(body).toHaveProperty('message','username or password seems to be wrong')
                done()
            })
        }),

        test('username cant be empty', done => {
            request(app)
            .post('/login')
            .send({
                username: '',
                password: 'hihaha'
        })
            .end((err, res) => {
                const {body, status} = res
                if (err) {
                    return done(err)
                }
                expect(status).toBe(400)
                expect(body).toHaveProperty('message','username or password cannot be empty')
                done()
            })
        }),

        test('password cant be empty', done => {
            request(app)
            .post('/login')
            .send({
                username: 'hiha77',
                password: ''
        })
            .end((err, res) => {
                const {body, status} = res
                if (err) {
                    return done(err)
                }
                expect(status).toBe(400)
                expect(body).toHaveProperty('message','username or password cannot be empty')
                done()
            })
        })
    })
})

describe('Post Win', () => {
  describe('Success Post Win', () => {
    test('Response on Posting Win Match', done => {
      request(app)
      .post('/win')
      .set({username})
      .end((err, res) => {
        if (err) {
          return done(err)
        }
        const {body, status} = res
        expect(status).toBe(200)
        expect(body).toHaveProperty('matchCount')
        done()
      })
    })
  })
})

describe('Post Lose', () => {
  describe('Success Post Lose', () => {
    test('Response on Posting Lose Match', done => {
      request(app)
      .post('/lose')
      .set({username})
      .end((err, res) => {
        if (err) {
          return done(err)
        }
        const {body, status} = res
        expect(status).toBe(200)
        expect(body).toHaveProperty('matchCount')
        done()
      })
    })
  })
})

describe('Get Leaderboard', () => {
  describe('Success Fetch Leaderboard', () => {
    test('Response on get leaderboard', done => {
      request(app)
      .get('/leaderboard')
      .end((err, res) => {
        if (err) {
          return done(err)
        }
        const {body, status} = res
        // console.log(body, 'INI RESSSSSSSSS')
        expect(status).toBe(200)
        expect(body).toHaveLength(2)
        expect(body[0]).toHaveProperty('winRate')
        done()
      })
    })
  })
})
