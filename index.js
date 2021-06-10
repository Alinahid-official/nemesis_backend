const express = require('express')
const app = express();
const cors=require('cors');
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
app.use(cors());
app.use(bodyParser.json())
const jwt = require('jsonwebtoken');

var iuserSchema = mongoose.Schema({

    email: {
      type: String,
      require: true
    },
    password:{
      type: String,
      require: true
    }
  
  });
const Iuser = mongoose.model("Iuser", iuserSchema);

var adduserSchema = mongoose.Schema({
    username: {
        type: String,
        require: true
      },
      mobile: {
        type: String,
        require: true
      },
    email: {
      type: String,
      require: true
    },
    address:{
      type: String,
      require: true
    }
  
  });
const AddUser = mongoose.model("Adduser", adduserSchema);

app.post('/checkEmail',(req,res)=>{
    const {email} =req.body;
    Iuser.findOne({email:email},(err,user)=>{
        if(!user){
           res.json({email:false})
        }else(res.json({email:true}))
    })
})
app.post('/checkPassword',(req,res)=>{
    const {email, password} = req.body;
    Iuser.findOne({email:email},(err,user)=>{
        if(user.password!=password){
            res.json({password:false})
        }else{
            res.json({password:true})
        }
    })

})
 
app.post('/signIn',(req,res)=>{
    const {email} = req.body;
    Iuser.findOne({email:email},(err,user)=>{
        if(user){
            const payload = {email:email};
                jwt.sign(payload, 'secret', {
                    expiresIn: 300
                }, (err, token) => {
                     if(err) console.error('There is some error in token', err);
                     else {
                         res.json({
                             type:'success',
                             token: `Bearer ${token}`,
                             msg:'Login Succes'
                         });
                     }
                });
            }
        
    })

})

app.post('/addUser',(req,res)=>{
    let adduser = req.body;
    const user = new AddUser(adduser)
    user.save(err=>{
        if(err)console.log(err)
        else{
            res.status(200).json({
                type:'success',
                msg:'upload sucess'
            })
        }
    })
})

app.get('/userlist',(req,res)=>{

    AddUser.find({},(err,users)=>{
        if(users){
            res.status(200).json({users})
        }else res.status(400).json({msg:'no user'})
    })
})
app.post('/deleteuser',(req,res)=>{
    const {id} =req.body;
    AddUser.findByIdAndRemove(id,err=>{
        if(err)console.log(err)
        else res.status(200).json({type:'sucess', msg:'successfully deleted'})
    })
})

const port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log(`Server is running at ${port}`)
})
mongoose.connect('mongodb+srv://dps:dps@123@cluster0.harcc.mongodb.net/Cluster0?retryWrites=true&w=majority',{
    useNewUrlParser:true,
    useCreateIndex :true
})