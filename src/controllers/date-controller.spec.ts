import * as chai from "chai";
import chaiHttp = require("chai-http");
import * as jwt from "jwt-simple";

import app from "../../src/app";
import { AppConfiguration } from "../config/app-configuration";

chai.use(chaiHttp);
const expect = chai.expect;

describe("Date controller", () => {
    const configuration = new AppConfiguration();
    const fakeUser = {
        email: "nelly@the-joneses.com",
        id: 1,
        name: "Nelly Jones",
        password: "Asdf1234!",
    };
    const token = jwt.encode(fakeUser, configuration.secret);
    const authHeader: string = `JWT ${token}`;

    it("is authenticated", (done) => {
        chai.request(app)
            .get("/date")
            .end((err, response) => {
                expect(response).to.be.status(401);
                done();
            });
    });

    it("rejects wrong token", (done) => {
        chai.request(app)
            .get("/date")
            .set("Authorization", "foo")
            .end((err, response) => {
                expect(response).to.be.status(401);
                done();
            });
    });

    it("works with token", (done) => {
        chai.request(app)
            .get("/date")
            .set("Authorization", authHeader)
            .end((err, response) => {
                expect(response).to.be.status(200);
                done();
            });
    });
});
