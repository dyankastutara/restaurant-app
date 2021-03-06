const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp)

const Food = require('../models/food');
const should = chai.should()
const server = require('../app')

describe('testing CRUD for Food', ()=>{
  var newFood_id = ''

  //masukin data dummy
  beforeEach((done)=>{
    var newFood = new Food({
      menu: 'Eat',
      name: 'Mozarella with Beef Bacon',
      description: 'Salah satu makanan favorite yang ada di eatlah dengan topping mozarella dan daging sapi yang di panggang',
      price: '200.000',
      vote_up: 0
    })

    newFood.save((err, food)=>{
      // console.log(food);
      newFood_id = food._id
      done()
    })
  })

  afterEach((done)=>{
    Food.remove({},(err)=>{
      done()
    })
  })

  //get data all Food
  describe('Get - all Foods', ()=>{
    it('should get all food', (done)=>{
      chai.request(server)
      .get('/foods')
      .end((err, result)=>{
        result.should.have.status(200)
        result.body.should.be.a('array')
        result.body.length.should.equal(1)

        done()
      })
    })
  })

  //create data with POST
  describe('Post - create Food', ()=>{
    it('should add a food', (done)=>{
      chai.request(server)
      .post('/foods')
      .end((err, result)=>{
        result.should.have.status(200)
        result.body.should.be.a('object')

        done()
      })
    })
  })

  //Update data Food
  describe('PUT - create Food', ()=>{
    it('should update a food', (done)=>{
      chai.request(server)
      .put('/foods/'+newFood_id)
      .send({
        name: 'Keju berlapis Mozarella'
      })
      .end((err, result)=>{
        result.should.have.status(200)
        result.body.should.be.a('object')
        result.body.message.should.not.equal('not been update')

        done()
      })
    })
  })

  //delete data Food
  describe('delete - Food', ()=>{
    it('should remove a food', (done)=>{
      chai.request(server)
      .delete('/foods/'+newFood_id)
      .end((err, result)=>{
        result.should.have.status(200)
        result.body.should.be.a('object')
        result.body.message.should.equal('has been delete')

        done()
      })
    })
  })
})