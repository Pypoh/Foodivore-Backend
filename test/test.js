const mongoose = require("mongoose");
const chai = require("chai");
const chaiHttp = require("chai-http");
const should = chai.should();
const server = require("../server");

const verifyToken = require("../app/middlewares/auth.jwt");
const jwt = require("jsonwebtoken");
const config = require("../app/config/auth.config.js");
const db = require("../app/models");
const { assert } = require("chai");
const User = db.user;
const Role = db.role;

chai.should();
chai.use(chaiHttp);

describe("JWT Test", () => {
  describe("JWT Decode Valid Token", () => {
    it("It should return registered user id", (done) => {
      const validUserId = "608c29cbdb21be4540f9755f";
      const validToken =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwOGMyOWNiZGIyMWJlNDU0MGY5NzU1ZiIsImlhdCI6MTYyNDU0NzY0MSwiZXhwIjoxNjI0NjM0MDQxfQ.PW8VoRKkAiq4AogBaww1KFAdyCkaqQ4BUM6bRpWg2zo";
      chai
        .request(server)
        .post("/api/auth/token")
        .set('x-access-token', validToken)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property('userId').eql(validUserId)
          done();
        });
    });
  });

describe("JWT Decode Invalid Token", () => {
  it("It should return invalid token message", (done) => {
    const validMessage = "Unauthorized!";
    const invalidToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwOGMyOWNiZGIyMWJasijASDiajhasLDjhdASKJG:OAFJAf6MTYyNDU0NzY0MSwiZXhwIjoxNjI0NjM0MDQxfQ.PW8VoRKkAiq4AogBaww1KFAdyCkaqQ4BUM6bRpWg2zo";
    chai
      .request(server)
      .post("/api/auth/token")
      .set('x-access-token', invalidToken)
      .end((err, res) => {
        res.should.have.status(401);
        res.body.should.be.a("object");
        res.body.should.have.property('message').eql(validMessage)
        done();
      });
  });
});

describe("JWT Decode Empty Token", () => {
  it("It should return registered user id", (done) => {
    const validMessage = "No token provided!";
    const emptyToken ="";
    chai
      .request(server)
      .post("/api/auth/token")
      .set('x-access-token', emptyToken)
      .end((err, res) => {
        res.should.have.status(403);
        res.body.should.be.a("object");
        res.body.should.have.property('message').eql(validMessage)
        done();
      });
  });
});



});


