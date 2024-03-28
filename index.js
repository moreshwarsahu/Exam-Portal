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

//post
// app.post('/api/personal-details', async (req, res) => {
//     try {
//       const { name, phone_no, email } = req.body;
  
//       // Create a new instance of the PersonalDetail model
//       const newPersonalDetail = new PersonalDetail({
//         name,
//         phone_no,
//         email,
//       });
  
//       // Save the new personal detail to the database
//       await newPersonalDetail.save();
  
//       res.status(201).json({ message: 'Personal details saved successfully' });
//     } catch (error) {
//       console.error('Error saving personal details:', error);
//       res.status(500).json({ message: 'Internal Server Error' });
//     }
//   });





app.listen(PORT, ()=>{
    console.log('port is running')
})