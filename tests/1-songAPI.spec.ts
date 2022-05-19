import { chai_, expect, url } from "./0-initVar.spec";

describe("Song API Tests", () => {
  it("POST Song", (done) => {
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
        expect(res.body.name).to.eql('Name Test 1')
        expect(res.body.author).to.eql('Author Test 1')
        expect(res.body.duration).to.eql('00:03:10')
        expect(res.body.genres).to.eql(["pop", "jazz"])
        expect(res.body.single).to.eql(true)
        expect(res.body.reproductions).to.eql(15482)
        done();
      });
  });

  it("GET All Songs", (done) => {
    chai_
      .request(url)
      .get("/song")
      .end((_: any, res: any) => {
        expect(res).to.have.status(200);
        expect(res.body[0].name).to.eql('Name Test 1')
        expect(res.body[0].author).to.eql('Author Test 1')
        expect(res.body[0].duration).to.eql('00:03:10')
        expect(res.body[0].genres).to.eql(["pop", "jazz"])
        expect(res.body[0].single).to.eql(true)
        expect(res.body[0].reproductions).to.eql(15482)
        done();
      });
  });

  it("GET One Song", (done) => {
    chai_
      .request(url)
      .get("/song")
      .query({ name: "Name Test 1" })
      .end((_: any, res: any) => {
        expect(res).to.have.status(200);
        expect(res.body[0].name).to.eql('Name Test 1')
        expect(res.body[0].author).to.eql('Author Test 1')
        expect(res.body[0].duration).to.eql('00:03:10')
        expect(res.body[0].genres).to.eql(["pop", "jazz"])
        expect(res.body[0].single).to.eql(true)
        expect(res.body[0].reproductions).to.eql(15482)
        done();
      });
  });

  it("GET Song By Id", (done) => {
    chai_
      .request(url)
      .get("/song")
      .query({ name: "Name Test 1" })
      .end((_: any, res: any) => {
        expect(res).to.have.status(200);
        const id = res.body[0]._id
        chai_
          .request(url)
          .get(`/song/${id}`)
          .end((_: any, res: any) => {
            expect(res).to.have.status(200);
            expect(res.body.name).to.eql('Name Test 1')
            expect(res.body.author).to.eql('Author Test 1')
            expect(res.body.duration).to.eql('00:03:10')
            expect(res.body.genres).to.eql(["pop", "jazz"])
            expect(res.body.single).to.eql(true)
            expect(res.body.reproductions).to.eql(15482)
            done();
          });
      });
  });

  it("PUT Song", (done) => {
    chai_
      .request(url)
      .get("/song")
      .query({ name: "Name Test 1" })
      .end((_: any, res: any) => {
        expect(res).to.have.status(200);
        const id = res.body[0]._id
        chai_
          .request(url)
          .put(`/song/${id}`)
          .query({ name: "Name Test 1" })
          .send({
            reproductions: 514454,
          })
          .end((_: any, res: any) => {
            expect(res).to.have.status(200);
            expect(res.body.name).to.eql('Name Test 1')
            expect(res.body.author).to.eql('Author Test 1')
            expect(res.body.duration).to.eql('00:03:10')
            expect(res.body.genres).to.eql(["pop", "jazz"])
            expect(res.body.single).to.eql(true)
            expect(res.body.reproductions).to.eql(514454)
            done();
          });
      });
  });

  it("DELETE Song", (done) => {
    chai_
      .request(url)
      .get("/song")
      .query({ name: "Name Test 1" })
      .end((_: any, res: any) => {
        expect(res).to.have.status(200);
        const id = res.body[0]._id
        chai_
          .request(url)
          .delete(`/song/${id}`)
          .query({ name: "Name Test 1" })
          .end((_: any, res: any) => {
            expect(res).to.have.status(200);
            expect(res.body.name).to.eql('Name Test 1')
            expect(res.body.author).to.eql('Author Test 1')
            expect(res.body.duration).to.eql('00:03:10')
            expect(res.body.genres).to.eql(["pop", "jazz"])
            expect(res.body.single).to.eql(true)
            expect(res.body.reproductions).to.eql(514454)
            done();
          });
      });
  });
});
