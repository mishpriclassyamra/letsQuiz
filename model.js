class Question {
  constructor(id, text, options, correctOption) {
    this.id = id;
    this.text = text;
    this.options = [options];
    this.correct_option = correctOption;
  }
}

class Answer {
  constructor(questionId, selectedOption, isCorrect) {
    this.question_id = questionId;
    this.selected_option = selectedOption;
    this.is_correct = isCorrect;
  }
}

class Quiz {
  constructor(id, title, questions = []) {
    this.id = id;
    this.title = title;
    this.questions = questions; // Array of Question objects
  }
}

class Result {
  constructor(quizId, userId, score, answers = []) {
    this.quiz_id = quizId;
    this.user_id = userId;
    this.score = score;
    this.answers = answers; // Array of Answer objects
  }
}

module.exports = {
  Question,
  Quiz,
  Result,
  Answer,
};
