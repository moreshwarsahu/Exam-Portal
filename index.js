const express = require("express")
const app = express()
const bcrypt = require('bcrypt');
var cors = require('cors')

require('dotenv').config();

const PORT = process.env.PORT;


require('./db_connections/conn.js')


//schema;
// const personal_detail = require("./schema/personal_detail.js")
const admin_info = require("./schema/admin_info.js")
const question_bank = require("./schema/question_bank.js")
const school_details = require("./schema/school_details.js")
const student_info = require("./schema/student_info.js")
const question_paper=require("./schema/question_paper.js");
const mailer = require("./db_connections/mailer.js");

//middlwares
app.use(cors())


app.use(express.json());


//routing

app.get('/',(req,res)=>{
    res.send ("port is running")
})

// app.post('/api/mail/testing', (req, res)=>{
//     try {
//         const {email} = req.body;
     
//         mailer(email)
//         res.status(201).json({ message: 'mail sent successfully'});

//     }catch (error) {
//         console.error('Error sending mail:', error);
//         res.status(500).json({ message: 'Internal Server Error' });
//       }
// })

app.get('/users',(req,res)=>{
res.send('get your user data here')

})

//****************************student details****************************// 

app.post('/post/student_info', async (req, res) => {
    try {
      const { school_id, student_name, class: class_ , fathers_name, dob, contact_no, student_id, password } = req.body;

      const hashedPassword = await bcrypt.hash(password, 10);

      const newStudent = new student_info({
        school_id,
        student_name,
        class: class_ ,
        fathers_name,
        dob,
        contact_no,
        student_id,
        password: hashedPassword
      });

      await newStudent.save();
  
      res.status(201).json({ message: 'Student added successfully', student: newStudent });
    } catch (error) {
      console.error('Error adding student:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });

  //************************************student login *************************//

  app.post('/login/student', async (req, res) => {
    try {
      const { student_id, password } = req.body;

      const student = await student_info.findOne({ student_id });
  
      if (!student) {
       
        return res.status(401).json({ message: 'Invalid ID or Password' });
      }
  
      const passwordMatch = await bcrypt.compare(password, student.password);
      if (!passwordMatch) {
        return res.status(401).json({ message: 'Invalid ID or Password' });
      }
  
      // res.status(200).json({ school_id, student_id, class: class_ , message: 'Login successful' });
      res.status(200).json({
        school_id: student.school_id, 
        student_id: student.student_id, 
        class: student.class, 
        message: 'Login successful'
    });
    } catch (error) {
      console.error('Error during student login:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  


//**********************shhool details post********************************//


app.post('/post/school_details', async (req, res) => {
  try {
    const { school_id, name, address, spoc_name, spoc_id, spoc_password, spoc_contact, email } = req.body;

    const hashedPassword = await bcrypt.hash(spoc_password, 10); 

    const newSchool = new school_details({
      school_id,
      name,
      address,
      spoc_name,
      spoc_id,
      spoc_password: hashedPassword, 
      spoc_contact,
      email
    });
    
    await newSchool.save();
    mailer(email, spoc_id, spoc_password);
    res.status(201).json({ message: 'School details added successfully', data: newSchool });
  } catch (error) {
    console.error('Error adding school details:', error);
    res.status(500).json({ message: 'Internal Server Error', error });
  }
});

app.get('/search/school_details', async (req, res) => {
  try {
    const { query: searchString } = req.query;

    const regexPattern = new RegExp(searchString, 'i'); 


    const query = {
      $or: [
        { school_id: regexPattern },
        { name: regexPattern }
      ]
    };

    
    const details = await school_details.find(query);

    res.status(200).json({ status: 'success', status_code: 200, message: 'Search successful', data: details });
  } catch (error) {
    console.error('Error during question search:', error);
    res.status(500).json({ status: 'failure', status_code: 500, message: 'Internal Server Error' });
  }
});

app.get('/spoc_details', async (req, res) => {
  try {
       const { spoc_id } = req.query;
 
       const schoolDetails = await school_details.findOne({ spoc_id }, '-spoc_password -createdAt -updatedAt');
 
       if (!schoolDetails) {
           return res.status(404).json({ message: 'School details not found for the given SPOC ID' });
       }
       res.status(200).json({ status: 'success', status_code: 200, message: 'School details fetched successfully', data: schoolDetails });
  } catch (error) {
       console.error('Error fetching school details:', error);
       res.status(500).json({ status: 'failure', status_code: 500, message: 'Internal Server Error' });
  }
 });

  //******************************************spoc login**************************// 


  app.post('/spoc_login', async (req, res) => {
    try {
      const { school_id, spoc_id, spoc_password } = req.body;
  
      
      const user = await school_details.findOne({ spoc_id });
  
      if (!user) {
      
        return res.status(401).json({ message: 'Invalid spoc_id or password' });
      }

      const passwordMatch = await bcrypt.compare(spoc_password, user.spoc_password);
      if (!passwordMatch) {
       
        return res.status(401).json({ message: 'Invalid spoc_id or password' });
      }
  
      res.status(200).json({ school_id, spoc_id, message: 'Login successful' });
    } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  

//**********************Question Bank**************************//
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
  
      res.status(200).json({ status:'success', status_code:200, message: 'Question added successfully', data: newQuestion });
    } catch (error) {
      console.error('Error adding question:', error);
      res.status(500).json({ status:'failure', status_code:500, message: 'Internal Server Error', error });
    }
  });


  app.get('/search/question_bank', async (req, res) => {
    try {
      const { query: searchString } = req.query;
  
      const regexPattern = new RegExp(searchString, 'i'); 
  

      const query = {
        $or: [
          { subject: regexPattern },
          { topic: regexPattern }
        ]
      };
  
      
      const questions = await question_bank.find(query);
  
      res.status(200).json({ status: 'success', status_code: 200, message: 'Search successful', data: questions });
    } catch (error) {
      console.error('Error during question search:', error);
      res.status(500).json({ status: 'failure', status_code: 500, message: 'Internal Server Error' });
    }
  });


  app.get('/get/question_bank', async (req, res) => {
    try {
      
      const questions = await question_bank.find();
      res.status(200).json({status: 'success', status_code: 200, message:'questions fetched successfully', data: questions});
    } catch (error) {
      console.error('Error fetching questions:', error);
      res.status(500).json({status:'failure', status_code: 500, message: 'Internal Server Error' });
    }
  });

  app.get('/question_popup', async (req, res) => {
    try {
        const { id } = req.query;

        const question = await question_bank.findById(id);

        if (!question) {
            return res.status(404).json({ status: 'failure', status_code: 404, message: 'Question not found' });
        }

        res.status(200).json({ status: 'success', status_code: 200, message: 'Question fetched successfully', data: question });
    } catch (error) {
        console.error('Error fetching question:', error);
        res.status(500).json({ status: 'failure', status_code: 500, message: 'Internal Server Error' });
    }
});

  app.delete('/delete_question', async (req, res) => {
    try {
       const { id } = req.query;
   
       const result = await question_bank.findByIdAndDelete(id);
   
       if (!result) {
         return res.status(404).json({ message: 'No question found with the given ID' });
       }
   
       res.status(200).json({ message: 'Question deleted successfully', data: result });
    } catch (error) {
       console.error('Error deleting question:', error);
       res.status(500).json({ message: 'Internal Server Error', error });
    }
   });

//************************************Question Paper creation****************************************************//

app.post('/question-papers', async (req, res) => {
  try {
    
    const { question_id, school_id, test_name, duration, total_marks, class: class_ } = req.body;

    const newQuestionPaper = new question_paper({
      question_id,
      school_id,
      test_name,
      duration,
      total_marks,
      class: class_ 
    });

    await newQuestionPaper.save();

    
    res.status(200).json({ message: 'Question paper created successfully', questionPaper: newQuestionPaper, school_id });
  } catch (error) {
  
    console.error('Error creating question paper:', error);
    res.status(500).json({ error: 'Internal server error'});
  }
});


app.get('/fetch_questions', async (req, res) => {
  try {
    
     const { school_id } = req.query;
 
     const questionPapers = await question_paper.find({ school_id });
     const questionIds = questionPapers.map(paper => paper.question_id);
 
     const allQuestionIds = [].concat(...questionIds);

     const questions = await question_bank.find({
       _id: { $in: allQuestionIds }
     });
 
     res.status(200).json({ status: 'success', status_code: 200, message: 'Questions fetched successfully', data: questions, school_id });
  } catch (error) {
     console.error('Error fetching questions by SPOC ID:', error);
     res.status(500).json({ status: 'failure', status_code: 500, message: 'Internal Server Error' });
  }
 });

 app.get('/fetch_questions_by_id', async (req, res) => {
  try {
     
     // Extract the ObjectID of the question paper from the query parameters
     const { questionPaperId } = req.query;
 
     // Validate the ObjectID format
     if (!mongoose.Types.ObjectId.isValid(questionPaperId)) {
         return res.status(400).json({ status: 'failure', status_code: 400, message: 'Invalid question paper ID' });
     }
 
     // Find the question paper by its ObjectID
     const questionPaper = await question_paper.findById(questionPaperId);
 
     if (!questionPaper) {
         return res.status(404).json({ status: 'failure', status_code: 404, message: 'Question paper not found' });
     }
 
     // Extract the question IDs from the question paper
     const questionIds = questionPaper.question_id;
 
     // Find the questions by their IDs
     const questions = await question_bank.find({
       _id: { $in: questionIds }
     });
 
     res.status(200).json({
       status: 'success',
       status_code: 200,
       message: 'Questions fetched successfully',
       data: questions,
       questionPaperId // Include the ObjectID of the question paper in the response
     });
  } catch (error) {
     console.error('Error fetching questions by question paper ID:', error);
     res.status(500).json({ status: 'failure', status_code: 500, message: 'Internal Server Error' });
  }
 });


 app.get('/exam_details', async (req, res) => {
  try {
     const { school_id } = req.query;
 
     const questionPapers = await question_paper.find({ school_id });
 
     const filteredQuestionPapers = questionPapers.map(paper => {
       const { question_id, ...rest } = paper.toObject();
       return rest;
     });
 
     res.status(200).json({ status: 'success', status_code: 200, message: 'Question papers fetched successfully', school_id, data: filteredQuestionPapers });
  } catch (error) {
     console.error('Error fetching question papers:', error);
     res.status(500).json({ status: 'failure', status_code: 500, message: 'Internal Server Error' });
  }
 });
//*********************************************Admin****************************************************************// 
app.post('/create_admin', async (req, res) => {
  try {
      const { name, u_id, password, contact_no } = req.body;

      const existingAdmin = await admin_info.findOne({ u_id });
      if (existingAdmin) {
          return res.status(400).json({ message: 'Admin user with this ID already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newAdmin = new admin_info({
          name,
          u_id,
          password: hashedPassword, 
          contact_no
      });

      await newAdmin.save();

      res.status(200).json({ message: 'Admin user created successfully', admin: newAdmin });
  } catch (error) {
      console.error('Error creating admin user:', error);
      res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.post('/admin_login', async (req, res) => {
  try {
      const { u_id, password } = req.body;

      const admin = await admin_info.findOne({ u_id });
      const data = [{name: admin.name, id: admin.u_id, contact: admin.contact_no}]
      if (!admin) {
          return res.status(401).json({ message: 'Invalid admin ID or password' });
      }

      const passwordMatch = await bcrypt.compare(password, admin.password);

      if (!passwordMatch) {
          return res.status(401).json({ message: 'Invalid admin ID or password' });
      }

      res.status(200).json({ message: 'Login successful', data });
  } catch (error) {
      console.error('Error during admin login:', error);
      res.status(500).json({ message: 'Internal Server Error' });
  }
});



app.listen(PORT, ()=>{
    console.log('port is running'+PORT)
})
