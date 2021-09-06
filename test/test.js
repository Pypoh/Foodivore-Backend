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
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwOGMyOWNiZGIyMWJlNDU0MGY5NzU1ZiIsImlhdCI6MTYzMDU5OTg1MywiZXhwIjoxNjMwNjg2MjUzfQ.lI0Bk_35eOs0YTlFVqkJXD4ALD2WeOtSuFqZIBWZPHo";
      chai
        .request(server)
        .post("/api/auth/token")
        .set("x-access-token", validToken)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("userId").eql(validUserId);
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
        .set("x-access-token", invalidToken)
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.a("object");
          res.body.should.have.property("message").eql(validMessage);
          done();
        });
    });
  });

  describe("JWT Decode Empty Token", () => {
    it("It should return error message", (done) => {
      const validMessage = "No token provided!";
      const emptyToken = "";
      chai
        .request(server)
        .post("/api/auth/token")
        .set("x-access-token", emptyToken)
        .end((err, res) => {
          res.should.have.status(403);
          res.body.should.be.a("object");
          res.body.should.have.property("message").eql(validMessage);
          done();
        });
    });
  });
});

describe("CRUD Test", () => {
  describe("CRUD Insert Article", () => {
    it("It should return the data that have been sent including user id", (done) => {
      const recordObject = {
        consumedAt: "Makan Siang",
        ingredient: [
          {
            ingredient: "60e005223dda0d3af8cb9c3f",
            count: 1,
          },
          {
            ingredient: "60e00de23dda0d3af8cb9c43",
            count: 1,
          },
          {
            ingredient: "60e31159894ed93ea0a636ba",
            count: 1,
          },
          {
            ingredient: "60e01a263dda0d3af8cb9c4c",
            count: 1,
          },
          {
            ingredient: "60e015e53dda0d3af8cb9c47",
            count: 1,
          },
        ],
      };

      const validToken =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwOGMyOWNiZGIyMWJlNDU0MGY5NzU1ZiIsImlhdCI6MTYzMDU5OTg1MywiZXhwIjoxNjMwNjg2MjUzfQ.lI0Bk_35eOs0YTlFVqkJXD4ALD2WeOtSuFqZIBWZPHo";
      chai
        .request(server)
        .post("/api/user/record")
        .set("x-access-token", validToken)
        .send(recordObject)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have
            .property("message")
            .eql("Record was inserted successfully.");
          done();
        });
    });
  });

  describe("CRUD Insert without 1 required params", () => {
    it("It should return error message with params warning", (done) => {
      const recordObject = {
        consumedAt: "Makan Siang",
        ingredient: [
        ],
      };
      const validToken =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwOGMyOWNiZGIyMWJlNDU0MGY5NzU1ZiIsImlhdCI6MTYzMDU5OTg1MywiZXhwIjoxNjMwNjg2MjUzfQ.lI0Bk_35eOs0YTlFVqkJXD4ALD2WeOtSuFqZIBWZPHo";
      chai
        .request(server)
        .post("/api/user/record")
        .set("x-access-token", validToken)
        .send(recordObject)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a("object");
          res.body.should.have.property("message").eql("No Ingredients inserted, please add at least one.");
          done();
        });
    });
  });

  describe("CRUD Insert Article", () => {
    it("It should return message with No Token warning", (done) => {
      const recordObject = {
        consumedAt: "Makan Siang",
        ingredient: [
          {
            ingredient: "60e005223dda0d3af8cb9c3f",
            count: 1,
          },
          {
            ingredient: "60e00de23dda0d3af8cb9c43",
            count: 1,
          },
          {
            ingredient: "60e31159894ed93ea0a636ba",
            count: 1,
          },
          {
            ingredient: "60e01a263dda0d3af8cb9c4c",
            count: 1,
          },
          {
            ingredient: "60e015e53dda0d3af8cb9c47",
            count: 1,
          },
        ],
      };

      chai
        .request(server)
        .post("/api/user/record")
        .send(recordObject)
        .end((err, res) => {
          res.should.have.status(403);
          res.body.should.be.a("object");
          res.body.should.have.property("message").eql("No token provided!");
          done();
        });
    });
  });

  describe("CRUD Insert Article", () => {
    it("It should return message with error", (done) => {
      const recordObject = {
        consumedAt: "",
        ingredient: [
          {
            ingredient: "60e005223dda0d3af8cb9c3f",
            count: 1,
          },
          {
            ingredient: "60e00de23dda0d3af8cb9c43",
            count: 1,
          },
          {
            ingredient: "60e31159894ed93ea0a636ba",
            count: 1,
          },
          {
            ingredient: "60e01a263dda0d3af8cb9c4c",
            count: 1,
          },
          {
            ingredient: "60e015e53dda0d3af8cb9c47",
            count: 1,
          },
        ],
      };

      const validToken =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwOGMyOWNiZGIyMWJlNDU0MGY5NzU1ZiIsImlhdCI6MTYzMDU5OTg1MywiZXhwIjoxNjMwNjg2MjUzfQ.lI0Bk_35eOs0YTlFVqkJXD4ALD2WeOtSuFqZIBWZPHo";
      chai
        .request(server)
        .post("/api/user/record")
        .set("x-access-token", validToken)
        .send(recordObject)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a("object");
          res.body.should.have.property("message").eql("Schedule can not be empty!");
          done();
        });
    });
  });
});
