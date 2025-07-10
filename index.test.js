const request = require("supertest");
const app = require("./index");

describe("Quiz API Integration Test", () => {

  it("GET /quizzes/1 should return quiz without correct answers", async () => {
    const res = await request(app).get("/quizzes/1");

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("title");
    expect(res.body.questions[0]).not.toHaveProperty("correct_option");
  });

  it("POST /submit/1/answer should store and return answer result", async () => {
    const res = await request(app)
      .post("/submit/1/answer")
      .send({
        user_id: "user_test",
        question_id: "q1",
        selected_option: 0
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("is_correct");
  });

  it("GET /quizzes/1/results/user_test should return result with score", async () => {
    const res = await request(app).get("/quizzes/1/results/user_test");

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("score");
    expect(Array.isArray(res.body.answers)).toBe(true);
  });

});
