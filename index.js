const express = require('express');
const bodyParser = require('body-parser');
const { Question, Quiz, Answer, Result } = require("./model");
const { Quizzies } = require('./sampleData');
const fs = require("fs");

const app = express();
app.use(bodyParser.json()); // Parse incoming JSON requests
const PORT = process.env.PORT || 3000;

let results = {}; // In-memory storage for user results

// Create a new quiz
app.post("/quizes", (req, res) => {
  try {
    const { id, title, questions } = req.body;

    // Basic validation
    if (!id || !title || !Array.isArray(questions)) {
      return res.status(400).json({ error: "Invalid quiz format" });
    }

    const questionObjects = [];

    console.log("Inserting quiz set!!");

    // Loop through all questions to validate and create Question objects
    for (let i = 0; i < questions.length; i++) {
      let q = questions[i];
      const { id: qid, text, options, correctOption } = q;

      // Validate each question
      if (!qid || !text || !Array.isArray(options) || options.length !== 4 || !correctOption) {
        throw new Error(`Invalid question format for id ${qid}`);
      }

      // Check if correctOption exists in options
      if (!options.includes(correctOption)) {
        throw new Error(`Correct option not found among listed 4 options for ${qid}`);
      }

      const questionObj = new Question(qid, text, options, correctOption);
      questionObjects.push(questionObj);
    }

    // Push new quiz to the in-memory array
    Quizzies.push({ id, title, questions: questionObjects });

    // Persist updated quiz data to sampleData.js file
    fs.writeFile(
      "sampleData.js",
      JSON.stringify(Quizzies, null, 2),
      (err) => {
        if (err) {
          console.error("Failed to write file:", err);
        } else {
          console.log("Quiz saved to file!");
        }
      }
    );

    return res.status(201).json({ message: "Quiz created successfully", questionObjects });
  } catch (err) {
    console.log(`Error : ${err}`);
    res.status(500).json({ error: "Failed to create quiz!!" });
  }
});

// Get quiz by ID (without correct options)
app.get("/getQuiz/:id", (req, res) => {
  try {
    // Find quiz by ID
    const quiz = Quizzies.find(q => q.id === req.params.id);

    // If not found
    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    // Return questions without correct answers
    const questions = quiz.questions.map(q => ({
      id: q.id,
      text: q.text,
      options: q.options
    }));

    return res.status(201).json({
      id: quiz.id,
      title: quiz.title,
      questions
    });

  } catch (err) {
    console.log(`ERROR: ${err}`);
    return res.status(500).json({ error: "Failed to return set of questions!!" });
  }
});

// Submit answer for a quiz question
app.post("/submit/:quizId/answer", (req, res) => {
  try {
    const { quizId } = req.params;
    const { user_id, question_id, selected_option } = req.body;

    // Find the quiz
    const quiz = Quizzies[quizId];
    if (!quiz) {
      return res.status(404).json({ error: "Quiz Not Found!!" });
    }

    // Validate input
    if (!user_id || !question_id || !selected_option) {
      return res.status(400).json({ error: "Invalid request" });
    }

    // Find the question by ID
    const question = quiz.questions.find(q => q.id === question_id);
    if (!question) {
      return res.status(404).json({ error: "Question not found" });
    }

    // Check if answer is correct
    const is_correct = question.correctOption === selected_option;

    // Initialize results[quizId] if not present
    if (!results[quizId]) {
      results[quizId] = {};
    }

    // Initialize results[quizId][user_id] if not present
    if (!results[quizId][user_id]) {
      results[quizId][user_id] = {
        quiz_id: quizId,
        user_id,
        score: 0,
        answers: []
      };
    }

    // Store answer
    results[quizId][user_id].answers.push({
      question_id,
      selected_option,
      is_correct
    });

    // Increment score if correct
    if (is_correct) {
      results[quizId][user_id].score++;
    }

    // Respond with answer result
    return res.status(201).json({
      is_correct,
      correct_answer: is_correct ? null : question.correctOption
    });

  } catch (error) {
    console.error(`ERROR: ${error}`);
    return res.status(500).json({ error: "Failed to return correct answer!!" });
  }
});

// Get result for a user for a specific quiz
app.get('/quizzes/:quizId/results/:userId', (req, res) => {
  const { quizId, userId } = req.params;

  // Check if user result exists
  const userResult = results[quizId]?.[userId];
  if (!userResult) return res.status(404).json({ error: 'Result not found' });

  res.json(userResult);
});

module.exports = app;

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
