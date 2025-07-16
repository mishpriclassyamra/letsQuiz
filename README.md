# Quiz App REST API

### Setup Instructions

```bash
# Clone the repo
$ git clone <your-repo-url>
$ cd quiz-app

# Install dependencies
$ npm install

# Run locally
$ npm run dev

# Run tests
$ npm test

# Run with Docker
$ docker-compose up --build
```

### API Endpoints

| Method | Endpoint                            | Description                    |
|--------|--------------------------------------|--------------------------------|
| POST   | /quizzes                             | Create a new quiz              |
| GET    | /quizzes/:id                         | Get quiz without answers       |
| POST   | /quizzes/:quizId/answer              | Submit answer, get feedback    |
| GET    | /quizzes/:quizId/results/:userId     | Get user score + answer stats  |

### Tech Stack
- Node.js
- Express.js
- Jest + Supertest
- Docker & docker-compose

## Known Issues & Limitations
-  In-memory data: Quizzes and results are stored in-memory (sampleData.js and results object), so data is lost on restart.
- No DB or persistent store: For demo only. Not production-ready,Data resets when server restarts
- Jest test file (index.test.js) expects quiz structure to match expected format (correctOption, etc.)



### 1. Clone the Repo
git clone https://github.com/your-username/quiz-api.git
cd quiz-api

Following are the working curls for each request

## 1 Create quiz

curl --location 'http://localhost:3000/quizes' \
--header 'Content-Type: application/json' \
--data '  {
    "id": "5",
    "title": "Test your English",
    "questions": [
      {
        "id": "q1",
        "text": "which one is vowel?",
        "options": ["a", "b", "c", "d"],
        "correctOption": "a"
      },
      {
        "id": "q2",
        "text": "find consonant.",
        "options": ["a", "b", "i", "o"],
        "correctOption": "b"
      }
    ]
  }'

  ## 2 get Quiz set as per id
  curl --location --request GET 'http://localhost:3000/getQuiz/2' \
--header 'Content-Type: application/json' \
--data '  {
    "id": "2",
    "title": "Java programming",
    "questions": [
      {
        "id": "q1",
        "text": "Which keyword declares a integer variable?",
        "options": ["int", "char", "float", "string"],
        "correctOption": "int"
      },
      {
        "id": "q2",
        "text": "Which symbol is used for comments?",
        "options": ["//", "<!--", "#", "/*"],
        "correctOption": "//"
      }
    ]
  }'

  ## 3 Submit answers

  curl --location 'http://localhost:3000/submit/1/answer' \
--header 'Content-Type: application/json' \
--data '{
  "user_id": "user123",
  "question_id": "q1",
  "selected_option": "int"
}
'

## 4 Fetch results

curl --location 'http://localhost:3000/submit/1/answer' \
--header 'Content-Type: application/json' \
--data '{
  "user_id": "user123",
  "question_id": "q1",
  "selected_option": "int"
}
'