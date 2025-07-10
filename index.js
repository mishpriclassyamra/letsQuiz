const express = require('express');
const bodyParser = require('body-parser');
const { Question, Quiz, Answer, Result } = require("./model");
const {Quizzies} = require('./sampleData');
var fs = require("fs");

const app = express();
app.use(bodyParser.json());
const PORT = process.env.PORT || 3000;

let results = {};

//Create quiz
app.post("/quizes", (req, res) => {
  try {
    const { id, title, questions } = req.body;
    if (!id || !title || !Array.isArray(questions)) {
      return res.status(400).json({ error: "Invalid quiz format" });
    }

    const questionObjects = [];

    console.log("Inserting quiz set!!");

    for (var i = 0; i < questions.length; i++) {
      let q = questions[i];
      const { id: qid, text, options, correctOption } = q;

      if (!id || !text || !Array.isArray(options) || options.length != 4 || !correctOption) {
        throw new Error(`Invalid question format for id ${id}`);
      }

      if (!options.includes(correctOption)) {
        throw new Error(`Correct option not found among listed 4 options for ${id}`);
      }

      const questionObj = new Question(qid, text, options, correctOption);
      questionObjects.push(questionObj);
    }

    Quizzies.push({ id, title, questions: questionObjects });
    fs.writeFile("sampleData.js",
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

//get quiz by id
app.get("/getQuiz/:id", (req, res) => {

  try {
    //find set of quiz based on id from sampledata    
    const quiz = Quizzies.find(q => q.id === req.params.id);

    //no quiz set found!! 
    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

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
    console.log(`ERROR: ${err}`)
    return res.status(500).json({ error: "Failed to return set of questions!!" })
  }

})

//submit answer

app.post("/submit/:quizId/answer", (req, res) => {
  try {
    const { quizId } = req.params;
    const { user_id, question_id, selected_option } = req.body;

    // Validate quiz
    const quiz = Quizzies[quizId];
    if (!quiz) {
      return res.status(404).json({ error: "Quiz Not Found!!" });
    }

    // Validate input
    if (!user_id || !question_id || !selected_option) {
      return res.status(400).json({ error: "Invalid request" });
    }

    // Find the question
    const question = quiz.questions.find(q => q.id === question_id);
    if (!question) {
      return res.status(404).json({ error: "Question not found" });
    }

    const is_correct = question.correctOption === selected_option;

    // Initialize quiz entry in results if missing
    if (!results[quizId]) {
      results[quizId] = {};
    }

    // Initialize user entry in results if missing
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

    // Update score if correct
    if (is_correct) {
      results[quizId][user_id].score++;
    }

    // Respond with result
    return res.status(201).json({
      is_correct,
      correct_answer: is_correct ? null : question.correctOption
    });

  } catch (error) {
    console.error(`ERROR: ${error}`);
    return res.status(500).json({ error: "Failed to return correct answer!!" });
  }
});

//results
app.get('/quizzes/:quizId/results/:userId', (req, res) => {
  const { quizId, userId } = req.params;
  const userResult = results[quizId]?.[userId];
  if (!userResult) return res.status(404).json({ error: 'Result not found' });
  res.json(userResult);
});

module.exports = app;

// 👇 Only listen if not in test mode
if (require.main === module) {
  app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
}

app.listen(PORT, () => {
  console.log("Server is started");
});