const { expect } = require("chai");
const chai = require("chai");
const chaiHttp = require("chai-http");
const app  = require("../src/server").app;
const { describe, it } = require("mocha");
const { setUpDummyData } = require("../src/dummy");

// Config chai
chai.use(chaiHttp);
chai.should();

describe("Players API", () => {
  describe("GET /players", () => { 
    const id = setUpDummyData();
    it("should get all players record", done => {
      chai.request(app)
        .get('/players')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.data.should.be.a('array');
          done();
        });
    });

    it("should get a single player record", done => {
      const id = setUpDummyData();

      chai.request(app)
      .get(`/players/${id}`)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.data.should.be.a('object');
        done();
      });
    });

    it("should not get a single player record with invalid id", done => {
      chai.request(app)
      .get(`/players/dummy_invalide_id`)
      .end((err, res) => {
        res.should.have.status(200);
        expect(res.body.status).to.be.a('string', 'error');
        expect(res.body.data).to.be.undefined;
        done();
      });
    });
  });
  describe("POST /players", () => { 
    it("should create a single player record", done => {
      chai.request(app)
      .post(`/players`)
      .send({
        "name": "Gragas",
        "email": "666@lol.com",
        "phone": "555",
        "gender": "Male"
      })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.data.should.be.a('object');
        done();
      });
    });

    it("should not create a single player record withou user name", done => {
      chai.request(app)
      .post(`/players`)
      .send({
        "email": "666@lol.com",
        "phone": "555",
        "gender": "Male"
      })
      .end((err, res) => {
        res.should.have.status(200);
        expect(res.body.status).to.be.a('string', 'error');
        expect(res.body.data).to.be.undefined;
        done();
      });
    });
  });

  describe("PUT /players/{id}", () => { 
    it("should update a single player record info", done => {
      const id = setUpDummyData();

      chai.request(app)
      .put(`/players/${id}`)
      .send({
        "name": "Gragas",
        "email": "666@lol.com",
        "phone": "555",
        "gender": "Male"
      })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.data.should.be.a('object');
        done();
      });
    });

    it("should not update a single player record with invalid id", done => {
      chai.request(app)
      .put(`/players/dummy_invalid`)
      .send({
        "name": "Gragas",
        "email": "666@lol.com",
        "phone": "555",
        "gender": "Male"
      })
      .end((err, res) => {
        res.should.have.status(200);
        expect(res.body.status).to.be.a('string', 'error');
        expect(res.body.data).to.be.undefined;
        done();
      });
    });

    it("should update a single player record without username", done => {
      const id = setUpDummyData();

      chai.request(app)
      .put(`/players/${id}`)
      .send({
        "email": "666@lol.com",
        "phone": "555",
        "gender": "Male"
      })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.data.should.be.a('object');
        done();
      });
    });

  });
  describe("DELETE /players/{id}", () => { 
    it("should delete a single player record", done => {
      const id = setUpDummyData();
      chai.request(app)
      .delete(`/players/${id}`)
      .end((err, res) => {
        res.should.have.status(200);
        expect(res.body.message).to.be.a('string', 'Player deleted');
        done();
      });
    });

    it("should not delete a single player record with invalid id", done => {
      chai.request(app)
      .delete(`/players/dummy_invalid`)
      .end((err, res) => {
        res.should.have.status(200);
        expect(res.body.status).to.be.a('string', 'error');
        done();
      });
    });
  });
});