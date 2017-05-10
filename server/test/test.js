const chai = require('chai');
const chaiHttp = require('chai-http');
const passwordHash = require('password-hash');
chai.use(chaiHttp)

const User = require('../models/user');
const should = chai.should()
const server = require('../app')

describe('User CRUD testing', ()=>{
  var newUser_id = ''

  //masukin data dummy
  beforeEach((done)=>{
    var newUser = new User({
      username: 'gamgam',
      password: passwordHash.generate('gamgam'),
      email: 'gam@gmail.com',
      role: 'admin'
    })

    newUser.save((err, user)=>{
      newUser_id = user._id
      done()
    })
  })

  afterEach((done)=>{
    User.remove({},(err)=>{
      done()
    })
  })

  describe('Get - User', ()=>{
    it('Should get User', (done)=>{
      chai.request(server)
      .get('/users')
      .end((err,result)=>{
        result.should.have.status(200)
        result.body.should.be.a('array')
        result.body[0].password.should.not.equal('gamgam')
        done()
      })
    })
  })

  //with method POST
  describe('Post - create User', ()=>{
    it('should add a user', (done)=>{
      chai.request(server)
      .post('/users')
      .end((err, result)=>{
        console.log('post', result.status);
        // result.should.have.status(200)
        // result.body.should.be.a('object')
        done()
      })
    })
  })

  //describe with method PUT
  describe('PUT - edit User', () => {
    it('should update specific field in the user', (done) => {
      chai.request(server)
      .patch('/users/'+newUser_id)
      .send({
        username: "please not 500"
      })
      .end( (err, result) => {
        result.should.have.status(200)
        result.body.should.be.an('object')
        result.body.username.should.equal("please not 500")

        done()
      })

    });
  });

  //describe for delete
  describe('DELETE - delete user', () => {
    it('should delete a user', (done) => {
      chai.request(server)
      .delete('/users/' + newUser_id)
      .end( (err, result) => {
        // console.log('delete***', result);
        result.should.have.status(200)
        result.body.should.be.an('object')
        result.body.message.should.equal("has been delete")
        done()
      })
    });
  });


})