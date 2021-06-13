import supertest from "supertest";
import { ExpressServer } from "../../server";
import { DbServices } from "../../services";
import controllers from "../../controllers";

const expressServer = new ExpressServer();
expressServer.addControllers(controllers);

beforeAll(async (done) => {
  const db = await DbServices.initDb();
  const query = await db.dropCollection("cachedatas");
  Promise.all([db, query]).then(done());
});

afterAll((done) => {
  done();
});

describe("CacheData API Endpoints Operations", () => {
  test("GET /api/cache/:key : valid payload, 200", async (done) => {
    await supertest(expressServer.app)
      .get("/api/cache/123")
      .expect(200)
      .end((err: any, res: any) => {
        if (err) {
          done(err);
        } else {
          const actual = res.body.message;
          const expected = "Cache data retrieved successfully!";

          expect(actual).toEqual(expected);
          done();
        }
      });
  });

  test("GET /api/cache : valid payload, 200", async (done) => {
    await supertest(expressServer.app)
      .get("/api/cache")
      .expect(200)
      .end((err: any, res: any) => {
        if (err) {
          done(err);
        } else {
          const actual = res.body.data;
          const expected = ["123"];

          expect(actual).toEqual(expected);
          done();
        }
      });
  });

  test("DELETE /api/cache/:key : valid payload, 200", async (done) => {
    await supertest(expressServer.app)
      .delete("/api/cache/123")
      .expect(200)
      .end((err: any, res: any) => {
        if (err) {
          done(err);
        } else {
          const actual = res.body.message;
          const expected = "Cache data deleted successfully!";

          expect(actual).toEqual(expected);
          done();
        }
      });
  });

  test("DELETE /api/cache : valid payload, 404", async (done) => {
    await supertest(expressServer.app)
      .delete("/api/cache/123")
      .expect(404)
      .end((err: any, res: any) => {
        if (err) {
          done(err);
        } else {
          const actual = res.body.message;
          const expected = "Cache key doesn't exist!";

          expect(actual).toEqual(expected);
          done();
        }
      });
  });

  test("POST /api/cache : valid payload, 201", async (done) => {
    await supertest(expressServer.app)
      .post("/api/cache/123")
      .send({
        value: "123456789",
      })
      .expect(201)
      .expect("Content-Type", "application/json; charset=utf-8")
      .end((err: any, res: any) => {
        if (err) {
          done(err);
        } else {
          const actual = res.body.message;
          const expected = "Cache data has been added successfully!";

          expect(actual).toEqual(expected);
          done();
        }
      });
  });

  test("POST /api/cache : valid payload, 200", async (done) => {
    await supertest(expressServer.app)
      .post("/api/cache/123")
      .send({
        value: "987456321",
      })
      .expect(200)
      .expect("Content-Type", "application/json; charset=utf-8")
      .end((err: any, res: any) => {
        if (err) {
          done(err);
        } else {
          const actual = res.body.message;
          const expected = "Cache data has been updated successfully!";

          expect(actual).toEqual(expected);
          done();
        }
      });
  });

  test("DELETE /api/cache : valid payload, 200", async (done) => {
    await supertest(expressServer.app)
      .delete("/api/cache")
      .expect(200)
      .end((err: any, res: any) => {
        if (err) {
          done(err);
        } else {
          const actual = res.body.message;
          const expected = "Cache'd data deleted  successfully!";

          expect(actual).toEqual(expected);
          done();
        }
      });
  });

  test("DELETE /api/cache : valid payload, 200", async (done) => {
    await supertest(expressServer.app)
      .delete("/api/cache")
      .expect(200)
      .end((err: any, res: any) => {
        if (err) {
          done(err);
        } else {
          const actual = res.body.message;
          const expected = "Cache'd data deleted  successfully!";

          expect(actual).toEqual(expected);
          done();
        }
      });
  });
});
