export let chai_ = require("chai");
export let chaiHttp = require("chai-http");
export const expect = chai_.expect;

chai_.use(chaiHttp);
export const url = "http://localhost:5000";

describe("Reset DataBase", () => {
  it("", (done) => {
    chai_
      .request(url)
      .get("/reset")
      .end((_: any, res: any) => {
        expect(res).to.have.status(200);
        expect(res.body.message).to.eql("Reset OK");
        done();
      });
  });
});
