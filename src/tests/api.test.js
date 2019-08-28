import chai from "chai";
import chaiHttp from "chai-http";
import app from "../../index";
// Configure chai
chai.use(chaiHttp);
chai.should();
describe("routes : users", () => {
  describe("GET /users", () => {
    // Test to get all students record
    it("should get all users record", done => {
      chai
        .request(app)
        .get("/users")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("json");
          done();
        });
    });
  });
});
