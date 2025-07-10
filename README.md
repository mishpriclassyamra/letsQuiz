# letsQuiz
## 🚀 How to Run Locally

### 🔹 1. Clone the Repo
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