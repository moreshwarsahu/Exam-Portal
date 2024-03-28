const express = require("express")
const app = express()

const PORT = process.env.PORT

require('dotenv').config();

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





const body = {
    school_id: "12345",
        name: "Pradeep",
        fathers_name: "Moreshwar",
        contact_no: "7489495506",
        student_id: "12345",
        password: "abc@123"

}

app.post('/api/students', async (req, res) => {
    try {
      // Extract data from the request body
    //   const { school_id, name, fathers_name, dob, contact_no, student_id, password } = req.body;
    const { school_id, name, fathers_name, contact_no, student_id, password } = body;
      // Create a new student document
      const newStudent = new StudentInfo({
        school_id,
        name,
        fathers_name,
        contact_no,
        student_id,
        password
      });
  
      // Save the new student document to the database
      await newStudent.save();
  
      res.status(201).json({ message: 'Student added successfully', student: newStudent });
    } catch (error) {
      console.error('Error adding student:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });




app.listen(PORT, ()=>{
    console.log('port is running')
})