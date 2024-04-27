const express = require("express")
const app = express()

require('dotenv').config();

const PORT = process.env.PORT;


require('./db_connections/conn.js')


//schema;
// const personal_detail = require("./schema/personal_detail.js")
const admin_info = require("./schema/admin_info.js")
const question_bank = require("./schema/question_bank.js")
const school_details = require("./schema/school_details.js")
const student_info = require("./schema/student_info.js")

//middlwares
app.use(express.json());



//routing

app.get('/',(req,res)=>{
    res.send ("port is running")
})

app.get('/users',(req,res)=>{
res.send('get your user data here')

})



app.post('/post/students_info', async (req, res) => {
    try {
      const { school_id, student_name, fathers_name, dob, contact_no, student_id, password } = req.body;
      const newStudent = new student_info({
        school_id,
        student_name,
        fathers_name,
        dob,
        contact_no,
        student_id,
        password
      });

      await newStudent.save();
  
      res.status(201).json({ message: 'Student added successfully', student: newStudent });
    } catch (error) {
      console.error('Error adding student:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });




  app.post('/post/school_details', async (req, res) => {
    try {
      const { school_id, name, address, spoc_name, spoc_id, spoc_password, spoc_contact, email } = req.body;
 
      const newSchool = new school_details({
        school_id,
        name,
        address,
        spoc_name,
        spoc_id,
        spoc_password,
        spoc_contact,
        email
      });

      await newSchool.save();
  
      res.status(201).json({ message: 'School details added successfully', data: newSchool });
    } catch (error) {
      console.error('Error adding school details:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });



  app.post('/post/question_bank', async (req, res) => {
    try {
      const { subject, question, answer, options, topic, difficulty_level } = req.body;
  
      
      const newQuestion = new question_bank({
        subject,
        question,
        answer,
        options,
        topic,
        difficulty_level
      });
  
     
      await newQuestion.save();
  
      res.status(200).json({ message: 'Question added successfully', data: newQuestion });
    } catch (error) {
      console.error('Error adding question:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  
  app.get('/get/question_bank', async (req, res) => {
    try {
      
      const questions = await question_bank.find();
      res.status(200).json({status: 'success', status_code: 200, message:'questions fetched successfully', data: questions});
    } catch (error) {
      console.error('Error fetching questions:', error);
      res.status(500).json({ststus:'failure', status_code: 500, message: 'Internal Server Error' });
    }
  });



app.listen(PORT, ()=>{
    console.log('port is running'+PORT)
})