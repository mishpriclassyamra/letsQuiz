// index.test.js

const request = require('supertest');
const fs = require('fs');

// ---- helpers --------------------------------------------------------------

//dummy quiz payload
const quizPayload = {
  id: 'quiz‑1',
  title: 'Node Basics',
  questions: [
    {
      id: 'q1',
      text: 'Which method starts an Express server?',
      options: ['listen()', 'createServer()', 'start()', 'run()'],
      correctOption: 'listen()'
    },
    {
      id: 'q2',
      text: 'Which middleware parses JSON?',
      options: ['bodyParser.json()', 'express.json()', 'json()', 'parseJson()'],
      correctOption: 'express.json()'
    }
  ]
};

// dummy user
const userId = 'u123';

// ---- jest setup -------------------------------------------------

jest.spyOn(console, 'log').mockImplementation(() => {});

jest.spyOn(fs, 'writeFile').mockImplementation((_, __, cb) => cb(null));

//FRESH app instance - for each test so - the in‑memory
 // `Quizzies` array and `results` object start empty every time.

let app;
beforeEach(() => {
  jest.resetModules();
  app = require('./index'); 
});

afterAll(() => {
  jest.restoreAllMocks();
});

// ---- TESTS ----------------------------------------------------------------

describe('POST /quizes', () => {
  it('creates a quiz (201) with valid payload', async () => {
    const res = await request(app).post('/quizes').send(quizPayload);

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe('Quiz created successfully');
    expect(res.body.questionObjects).toHaveLength(2);
  });

  it('returns 400 for invalid body', async () => {
    const res = await request(app).post('/quizes').send({ foo: 'bar' });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/Invalid quiz format/);
  });
});

describe('GET /getQuiz/:id', () => {
  it('returns quiz without answers', async () => {
    // First create quiz
    await request(app).post('/quizes').send(quizPayload);

    // Now fetch it
    const res = await request(app).get(`/getQuiz/${quizPayload.id}`);

    expect(res.statusCode).toBe(201);
    expect(res.body.questions[0]).not.toHaveProperty('correctOption');
    expect(res.body.questions).toHaveLength(2);
  });

  it('404 when quiz missing', async () => {
    const res = await request(app).get('/getQuiz/nope');
    expect(res.statusCode).toBe(404);
  });
});

describe('POST /submit/:quizId/answer', () => {
  beforeEach(async () => {
    // ensure quiz exists
    await request(app).post('/quizes').send(quizPayload);
  });

  const makeBody = (opts = {}) => ({
    user_id: userId,
    question_id: 'q1',
    selected_option: 'listen()',
    ...opts
  });

  it('records correct answer (201, is_correct=true)', async () => {
    const res = await request(app)
      .post(`/submit/${quizPayload.id}/answer`)
      .send(makeBody());

    expect(res.statusCode).toBe(201);
    expect(res.body.is_correct).toBe(true);
    expect(res.body.correct_answer).toBeNull();
  });

  it('records wrong answer (is_correct=false, returns correct_answer)', async () => {
    const res = await request(app)
      .post(`/submit/${quizPayload.id}/answer`)
      .send(makeBody({ selected_option: 'run()' }));

    expect(res.statusCode).toBe(201);
    expect(res.body.is_correct).toBe(false);
    expect(res.body.correct_answer).toBe('listen()');
  });

  it('404 when question missing', async () => {
    const res = await request(app)
      .post(`/submit/${quizPayload.id}/answer`)
      .send({ ...makeBody(), question_id: 'does-not-exist' });

    expect(res.statusCode).toBe(404);
  });
});

describe('GET /quizzes/:quizId/results/:userId', () => {
  it('returns user result after answers submitted', async () => {
    // Create quiz & submit 2 answers
    await request(app).post('/quizes').send(quizPayload);
    await request(app)
      .post(`/submit/${quizPayload.id}/answer`)
      .send({
        user_id: userId,
        question_id: 'q1',
        selected_option: 'listen()' // correct
      });
    await request(app)
      .post(`/submit/${quizPayload.id}/answer`)
      .send({
        user_id: userId,
        question_id: 'q2',
        selected_option: 'bodyParser.json()' // wrong
      });

    const res = await request(app).get(
      `/quizzes/${quizPayload.id}/results/${userId}`
    );

    expect(res.statusCode).toBe(200);
    expect(res.body.score).toBe(1);
    expect(res.body.answers).toHaveLength(2);
  });

  it('404 when result absent', async () => {
    const res = await request(app).get(
      `/quizzes/unknownQuiz/results/${userId}`
    );
    expect(res.statusCode).toBe(404);
  });
});
