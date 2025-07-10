// sampleData.js
let Quizzies = [
{
    id: "1",
    title: "Javascript programming",
    questions: [
      {
        id: "q1",
        text: "Which keyword declares a variable?",
        options: ["var", "function", "return", "class"],
        correctOption: "var"
      },
      {
        id: "q2",
        text: "Which symbol is used for comments?",
        options: ["//", "<!--", "#", "/*"],
        correctOption: "//"
      }
    ]
  },
{
    id: "2",
    title: "Java programming",
    questions: [
      {
        id: "q1",
        text: "Which keyword declares a integer variable?",
        options: ["int", "char", "float", "string"],
        correctOption: "int"
      },
      {
        id: "q2",
        text: "Which symbol is used for comments?",
        options: ["//", "<!--", "#", "/*"],
        correctOption: "//"
      }
    ]
  },
{
    id: "3",
    title: "Test your Maths",
    questions: [
      {
        id: "q1",
        text: "sum of 2+4",
        options: ["2", "4", "6", "8"],
        correctOption: "6"
      },
      {
        id: "q2",
        text: "Product of 5x6",
        options: ["10", "30", "20", "35"],
        correctOption: "30"
      },
      {
        id: "q3",
        text: "Divide of 18/6",
        options: ["3", "2", "5", "6"],
        correctOption: "3"
      },
      {
        id: "q4",
        text: "Subtract 25-10",
        options: ["15", "2", "5", "6"],
        correctOption: "15"
      }
    ]
  }
];

module.exports = { Quizzies };
