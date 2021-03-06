const mongoose = require('mongoose')
const Question = require("../models/question")
const questionBank = require('../question')

//get all the questions, answer choices, right answer, and rationales
//send to the front end/vuex store

module.exports = {

    insertQuestions: async(req,res, next)=>{
        try{
            //Add collections
            for(let [index,value] of Object.entries(Object.values(questionBank))){
                
                const questions = Object.values(value);
               // console.log("Here are the stupid questions", questions.length);

               
                await Question.insertMany(questions);
             

                res.status(200).json({
                    message: "Questions have been successfully saved",
                    request:{
                        message: "To successfully view the questions, visit the link below",
                        type: "GET",
                        link: "http://localhost:3000/questions"
                    }
                });
            }
        }catch(error){
            res.status(500).json({
                message: "There has been an error saving questions",
                error
            })
        }        
    },

    
    getQuestions: async(req,res, next)=>{
        try{
            for(let [index,value] of Object.entries(Object.values(questionBank))){
                
                const questions = Object.values(value);
                console.log("Here are the stupid questions", questions.length);                              
               
                res.status(200).json({
                    // qIndex,
                   
                    questions,
                    
                    message: "Questions have been successfully saved",
                    request:{
                        message: "To successfully view the questions, visit the link below",
                        type: "GET",
                        link: "http://localhost:3000/questions"
                    }
                });
            }
        }catch(error){
            res.status(500).json({
                message: "There has been an error saving questions",
                error
            })
        }
    },
    //get 10 or 70 questions
    getTest: async(req, res, next)=>{
        try{

            const num = req.params.num;
            //1. get all the questions from the database
            const allQuestions = await Question.find({});

            let numOfQs = 0;
            const questions = [];
            const qIndexes = [];
            //2. create an array of random indexes
            while(numOfQs<num){
                const qIndex = (Math.floor(Math.random()*724));
                //indexes need to be unique
                if(!qIndexes.includes(qIndex)){
                    qIndexes.unshift(qIndex);                 
                }
                
                numOfQs++;
                
            }      

            //3. use the array of random indexes as keys to the questions selected from the database
        
            for(const index of qIndexes){
                const question = allQuestions[index];
                questions.unshift(question);                    
            }
            
            /**
             * 4. the questions array has answers in an object form
                  to grade, answers must be in an array - see gradeQuiz method below
                  gradeQuiz should be a method in the Vue template
             */
            let answerArray = [];
            for(let queIndex = 0; queIndex<questions.length; queIndex++  ){
                answerArray.push(questions[queIndex]["answer"]);
            }

            //return the answerArray and all questions values to the view
            res.status(200).json({                
                answerArray,
                //message: "These are 10 NAC questions for practice",
                //questions,
               
                objQuestion: questions.map(singleQuestion=>{
            
                    return{  
                        answer:singleQuestion.answer,                       
                        question: singleQuestion.question,
                        choices: singleQuestion.choices,
                        rationale: singleQuestion.rationale
                    }
                })
            }) 
                    
            
        }catch(error){
            res.status(500).json({
                error
            })
        }
    },

   
    gradeQuiz: async(req, res, next)=>{
        try{

          
            const {userAnswers}= req.value.body;
            const answers = [0, 3, 3];

            let score = 0;

            for(let index = 0; index < userAnswers.length; index++){
                (answers[index]===userAnswers[index])? score++: score;
                console.log(score);   
            }   

            res.status(200).json({
               // questions,
                score: score/userAnswers.length
            })
        }catch(error){

        }
        
    }
}