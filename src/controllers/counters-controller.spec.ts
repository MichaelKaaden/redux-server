import * as chai from "chai";
import chaiHttp = require("chai-http");

import app from "../../src/app";
import { Counter } from "../models/counter";

chai.use(chaiHttp);
const expect = chai.expect;

// let app: express.Application;
// beforeEach('load app', () => {
//     app = require("../app").default;
// });

/* tslint:disable:no-unused-expression */

/*
 * I seem to be unable to reset the Counters controller to an
 * empty state on each test. That's because the controller is
 * initialized in the App module. As it returns itself by default,
 * I'm unable to return the Counters controller instance there,
 * too. And thanks to strict type checking, I can't add the
 * controller to the app to be retrieved here.
 */
describe("Counters controller", () => {
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

    it("PUT should set counter 5", (done) => {
        chai.request(app)
            .put("/counters/5")
            .send({count: 4711})
            .end((err, response) => {
                expect(err).to.be.null;
                expect(response).to.have.status(200);
                expect(response).to.be.json;
                const counter = response.body.data.counter;
                expect(counter.index).to.equal(5);
                expect(counter.value).to.equal(4711);
                chai.request(app)
                    .get("/counters")
                    .end((e, r) => {
                        expect(e).to.be.null;
                        expect(r.body.data.counters.length).to.equal(1);
                        expect(r.body.data.counters[0]).to.deep.equal(new Counter(5, 4711));
                        done();
                    });
            });
    });

    it("PUT should additionally set counter 0 and return the counters sorted by index", (done) => {
        chai.request(app)
            .put("/counters/0")
            .send({count: 42})
            .end((err, response) => {
                expect(err).to.be.null;
                expect(response).to.have.status(200);
                expect(response).to.be.json;
                const counter = response.body.data.counter;
                expect(counter.index).to.equal(0);
                expect(counter.value).to.equal(42);
                chai.request(app)
                    .get("/counters")
                    .end((e, r) => {
                        expect(e).to.be.null;
                        expect(r.body.data.counters.length).to.equal(2);
                        expect(r.body.data.counters[0]).to.deep.equal(new Counter(0, 42));
                        expect(r.body.data.counters[1]).to.deep.equal(new Counter(5, 4711));
                        done();
                    });
            });
    });

    it("PUT should update counter 5", (done) => {
        chai.request(app)
            .put("/counters/5")
            .send({count: 47})
            .end((err, response) => {
                expect(err).to.be.null;
                expect(response).to.have.status(200);
                expect(response).to.be.json;
                const counter = response.body.data.counter;
                expect(counter.index).to.equal(5);
                expect(counter.value).to.equal(47);
                chai.request(app)
                    .get("/counters")
                    .end((e, r) => {
                        expect(e).to.be.null;
                        expect(r.body.data.counters.length).to.equal(2);
                        expect(r.body.data.counters[0]).to.deep.equal(new Counter(0, 42));
                        expect(r.body.data.counters[1]).to.deep.equal(new Counter(5, 47));
                        done();
                    });
            });
    });

    it("GET should return an counter not yet set with default value and add it to the counters list", (done) => {
        chai.request(app)
            .get("/counters/1")
            .end((err, response) => {
                expect(err).to.be.null;
                expect(response).to.have.status(200);
                expect(response).to.be.json;
                const counter = response.body.data.counter;
                expect(counter.index).to.equal(1);
                expect(counter.value).to.equal(0);
                chai.request(app)
                    .get("/counters")
                    .end((e, r) => {
                        expect(e).to.be.null;
                        expect(r.body.data.counters.length).to.equal(3);
                        expect(r.body.data.counters[0]).to.deep.equal(new Counter(0, 42));
                        expect(r.body.data.counters[1]).to.deep.equal(new Counter(1, 0));
                        expect(r.body.data.counters[2]).to.deep.equal(new Counter(5, 47));
                        done();
                    });
            });
    });

    it("Increment should increment counter 1 by 1", (done) => {
        chai.request(app)
            .put("/counters/1/increment")
            .end((err, response) => {
                expect(err).to.be.null;
                expect(response).to.have.status(200);
                expect(response).to.be.json;
                const counter = response.body.data.counter;
                expect(counter.index).to.equal(1);
                expect(counter.value).to.equal(1);
                chai.request(app)
                    .get("/counters")
                    .end((e, r) => {
                        expect(e).to.be.null;
                        expect(r.body.data.counters.length).to.equal(3);
                        expect(r.body.data.counters[0]).to.deep.equal(new Counter(0, 42));
                        expect(r.body.data.counters[1]).to.deep.equal(new Counter(1, 1));
                        expect(r.body.data.counters[2]).to.deep.equal(new Counter(5, 47));
                        done();
                    });
            });
    });

    it("Increment should increment counter 1 by 3", (done) => {
        chai.request(app)
            .put("/counters/1/increment")
            .send({by: 3})
            .end((err, response) => {
                expect(err).to.be.null;
                expect(response).to.have.status(200);
                expect(response).to.be.json;
                const counter = response.body.data.counter;
                expect(counter.index).to.equal(1);
                expect(counter.value).to.equal(4);
                chai.request(app)
                    .get("/counters")
                    .end((e, r) => {
                        expect(e).to.be.null;
                        expect(r.body.data.counters.length).to.equal(3);
                        expect(r.body.data.counters[0]).to.deep.equal(new Counter(0, 42));
                        expect(r.body.data.counters[1]).to.deep.equal(new Counter(1, 4));
                        expect(r.body.data.counters[2]).to.deep.equal(new Counter(5, 47));
                        done();
                    });
            });
    });

    it("Decrement should decrement counter 1 by 1", (done) => {
        chai.request(app)
            .put("/counters/1/decrement")
            .end((err, response) => {
                expect(err).to.be.null;
                expect(response).to.have.status(200);
                expect(response).to.be.json;
                const counter = response.body.data.counter;
                expect(counter.index).to.equal(1);
                expect(counter.value).to.equal(3);
                chai.request(app)
                    .get("/counters")
                    .end((e, r) => {
                        expect(e).to.be.null;
                        expect(r.body.data.counters.length).to.equal(3);
                        expect(r.body.data.counters[0]).to.deep.equal(new Counter(0, 42));
                        expect(r.body.data.counters[1]).to.deep.equal(new Counter(1, 3));
                        expect(r.body.data.counters[2]).to.deep.equal(new Counter(5, 47));
                        done();
                    });
            });
    });

    it("Decrement should decrement counter 1 by 3", (done) => {
        chai.request(app)
            .put("/counters/1/decrement")
            .send({by: 3})
            .end((err, response) => {
                expect(err).to.be.null;
                expect(response).to.have.status(200);
                expect(response).to.be.json;
                const counter = response.body.data.counter;
                expect(counter.index).to.equal(1);
                expect(counter.value).to.equal(0);
                chai.request(app)
                    .get("/counters")
                    .end((e, r) => {
                        expect(e).to.be.null;
                        expect(r.body.data.counters.length).to.equal(3);
                        expect(r.body.data.counters[0]).to.deep.equal(new Counter(0, 42));
                        expect(r.body.data.counters[1]).to.deep.equal(new Counter(1, 0));
                        expect(r.body.data.counters[2]).to.deep.equal(new Counter(5, 47));
                        done();
                    });
            });
    });

    it("Increment should add a counter to the counter list", (done) => {
        chai.request(app)
            .put("/counters/2/increment")
            .send({by: 2})
            .end((err, response) => {
                expect(err).to.be.null;
                expect(response).to.have.status(200);
                expect(response).to.be.json;
                const counter = response.body.data.counter;
                expect(counter.index).to.equal(2);
                expect(counter.value).to.equal(2);
                chai.request(app)
                    .get("/counters")
                    .end((e, r) => {
                        expect(e).to.be.null;
                        expect(r.body.data.counters.length).to.equal(4);
                        expect(r.body.data.counters[0]).to.deep.equal(new Counter(0, 42));
                        expect(r.body.data.counters[1]).to.deep.equal(new Counter(1, 0));
                        expect(r.body.data.counters[2]).to.deep.equal(new Counter(2, 2));
                        expect(r.body.data.counters[3]).to.deep.equal(new Counter(5, 47));
                        done();
                    });
            });
    });

    it("Decrement should add a counter to the counter list", (done) => {
        chai.request(app)
            .put("/counters/3/decrement")
            .send({by: 9})
            .end((err, response) => {
                expect(err).to.be.null;
                expect(response).to.have.status(200);
                expect(response).to.be.json;
                const counter = response.body.data.counter;
                expect(counter.index).to.equal(3);
                expect(counter.value).to.equal(-9);
                chai.request(app)
                    .get("/counters")
                    .end((e, r) => {
                        expect(e).to.be.null;
                        expect(r.body.data.counters.length).to.equal(5);
                        expect(r.body.data.counters[0]).to.deep.equal(new Counter(0, 42));
                        expect(r.body.data.counters[1]).to.deep.equal(new Counter(1, 0));
                        expect(r.body.data.counters[2]).to.deep.equal(new Counter(2, 2));
                        expect(r.body.data.counters[3]).to.deep.equal(new Counter(3, -9));
                        expect(r.body.data.counters[4]).to.deep.equal(new Counter(5, 47));
                        done();
                    });
            });
    });
});
