import express from 'express';
import bodyParser from 'body-parser';

const app = express();
app.use(bodyParser.json());
const PORT = process.env.PORT || 3000;

interface Question {
  id: string;
  text: string;
  options: string[];
  correct_option: number;
}

//Create quiz
app.post('/quizzies',(req,res) => {
    try {


        
    } catch (err) {
        console.log(`Error : ${err}`)
        res.status(500).json({error:"Failed to create quiz!!"})
    }
})