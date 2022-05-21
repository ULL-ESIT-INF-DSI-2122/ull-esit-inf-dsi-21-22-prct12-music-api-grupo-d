import { chai_, expect, url } from "./0-initVar.spec";

describe("Artist API Tests", () => {
  it("POST Artist", (done) => {
    chai_
      .request(url)
      .post("/song")
      .send({
        name: "Name Test 1",
        author: "Author Test 1",
        duration: 250,
        genres: ["pop", "jazz"],
        single: true,
        reproductions: 15482,
      })
      .end((_: any, res: any) => {
        expect(res).to.have.status(201);
        chai_
          .request(url)
          .post("/artist")
          .send({
            name: "Artist Test 1",
            songs: [res.body._id],
          })
          .end((_: any, res_: any) => {
            expect(res_).to.have.status(201);
            expect(res_.body.name).to.eql("Artist Test 1");
            expect(res_.body.songs).to.eql([res.body._id]);
            done();
          });
      });
  });

  it("GET Artists", (done) => {
    chai_
      .request(url)
      .get("/artist")
      .end((_: any, res: any) => {
        expect(res).to.have.status(200);
        expect(res.body[0].name).to.eql("Artist Test 1");
        done();
      });
  });

  it("GET Artist By Name", (done) => {
    chai_
      .request(url)
      .get("/artist")
      .query({ name: "Artist Test 1" })
      .end((_: any, res: any) => {
        expect(res).to.have.status(200);
        expect(res.body[0].name).to.eql("Artist Test 1");
        done();
      });
  });

  it("PUT Artist", (done) => {
    chai_
      .request(url)
      .put("/artist")
      .query({ name: "Artist Test 1" })
      .send({ songs: [] })
      .end((_: any, res: any) => {
        expect(res).to.have.status(200);
        expect(res.body.name).to.eql("Artist Test 1");
        expect(res.body.songs).to.eql([]);
        done();
      });
  });

  it("DELETE Artist", (done) => {
    chai_
      .request(url)
      .delete("/artist")
      .query({ name: "Artist Test 1" })
      .end((_: any, res: any) => {
        expect(res).to.have.status(200);
        expect(res.body.name).to.eql("Artist Test 1");
        expect(res.body.songs).to.eql([]);
        done();
      });
  });
});
