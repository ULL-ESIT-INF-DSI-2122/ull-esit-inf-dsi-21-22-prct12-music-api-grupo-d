import { chai_, expect, url } from "./0-initVar.spec";

describe("Playlist API Tests", () => {
  it("POST Playlist", (done) => {
    chai_
      .request(url)
      .post("/song")
      .send({
        name: "Name Test 2",
        author: "Author Test 2",
        duration: 250,
        genres: ["pop", "jazz"],
        single: true,
        reproductions: 15482,
      })
      .end((_: any, res: any) => {
        expect(res).to.have.status(201);
        chai_
          .request(url)
          .post("/playlist")
          .send({
            name: "Playlist Test 1",
            songs: [res.body._id],
          })
          .end((_: any, res_: any) => {
            expect(res_).to.have.status(201);
            expect(res_.body.name).to.eql("Playlist Test 1")
            expect(res_.body.songs).to.eql([res.body._id])
            done()
          });
      });
  });

  it("Get All Playlist", (done) => {
    chai_
      .request(url)
      .get("/playlist")
      .end((_: any, res: any) => {
        expect(res).to.have.status(200);
        expect(res.body[0].name).to.eql("Playlist Test 1")
        done()
      });
  });

  it("Get One Playlist", (done) => {
    chai_
      .request(url)
      .get("/playlist")
      .query({ name: "Playlist Test 1"})
      .end((_: any, res: any) => {
        expect(res).to.have.status(200);
        expect(res.body[0].name).to.eql("Playlist Test 1")
        done()
      });
  });

  it("GET Playlist By Id", (done) => {
    chai_
      .request(url)
      .get("/playlist")
      .query({ name: "Playlist Test 1" })
      .end((_: any, res: any) => {
        expect(res).to.have.status(200);
        const id = res.body[0]._id
        chai_
          .request(url)
          .get(`/playlist/${id}`)
          .end((_: any, res: any) => {
            expect(res).to.have.status(200);
            expect(res.body.name).to.eql('Playlist Test 1')
            expect(res.body.songs[0].name).to.eql("Name Test 2")
            done();
          });
      });
  });

  it("PUT Artist", (done) => {
    chai_
      .request(url)
      .get("/playlist")
      .query({ name: "Playlist Test 1" })
      .end((_: any, res: any) => {
        expect(res).to.have.status(200);
        const id = res.body[0]._id
        chai_
          .request(url)
          .put(`/playlist/${id}`)
          .send({songs: []})
          .end((_: any, res: any) => {
            expect(res).to.have.status(200);
            expect(res.body.name).to.eql('Playlist Test 1')
            expect(res.body.songs).to.eql([])
            done();
          });
      });
  });

  it("DELETE Artist", (done) => {
    chai_
      .request(url)
      .get("/playlist")
      .query({ name: "Playlist Test 1" })
      .end((_: any, res: any) => {
        expect(res).to.have.status(200);
        const id = res.body[0]._id
        chai_
          .request(url)
          .delete(`/playlist/${id}`)
          .end((_: any, res: any) => {
            expect(res).to.have.status(200);
            expect(res.body.name).to.eql('Playlist Test 1')
            expect(res.body.songs).to.eql([])
            done();
          });
      });
  });

});
