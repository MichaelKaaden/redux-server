import * as chai from "chai";
import chaiHttp = require("chai-http");
import * as mocha from "mocha";

import app from "../../src/app";

chai.use(chaiHttp);
const expect = chai.expect;

// let app: express.Application;
// beforeEach('load app', () => {
//     app = require("../app").default;
// });

describe("Counters controller", () => {
    it("should not fail", (done) => {
        chai.request(app)
            .get("/counters")
            .end((err, response) => {
                expect(err).to.be.null;
                done();
            });
    });

    it("should return status 200", (done) => {
        chai.request(app)
            .get("/counters")
            .end((err, response) => {
                expect(response).to.have.status(200);
                done();
            });
    });

    it("GET should return JSON", (done) => {
        chai.request(app)
            .get("/counters")
            .end((err, response) => {
                expect(response).to.be.json;
                done();
            });
    });

    it("should use UTF-8", (done) => {
        chai.request(app)
            .get("/counters")
            .end((err, response) => {
                // this isn't defined in the Response type, so I'll use any instead
                const specialResponse: any = response;
                expect(specialResponse.charset).to.be.equal("utf-8");
                expect(specialResponse.headers["content-type"]).to.contain("utf-8");
                done();
            });
    });

    it("GET should return an object", (done) => {
        chai.request(app)
            .get("/counters")
            .end((err, response) => {
                expect(response.body).to.be.an("object");
                done();
            });
    });

    it("GET should return a message", (done) => {
        chai.request(app)
            .get("/counters")
            .end((err, response) => {
                expect(response.body.message).to.equal("okay");
                done();
            });
    });

    it("GET should initially return an empty counters array", (done) => {
        chai.request(app)
            .get("/counters")
            .end((err, response) => {
                expect(response.body.data.counters).to.deep.equal([]);
                done();
            });
    });
});
