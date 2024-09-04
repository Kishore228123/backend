const cors=require('cors');
const express=require('express');
const bodyparser=require('body-parser');
const app=express();
const mongoose=require('mongoose');
require('dotenv').config();
app.use(express.json());
app.use(cors());
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:false}));

const mongoconn= async () => {
try{
const mongoconnect= await mongoose.connect(process.env.MONGO_URI,
    {useNewUrlParser: true,
    useUnifiedTopology: true,}
);
console.log("mongo connected");
}
catch(e){
    console.error(e);
}
}
mongoconn();
// mongoose.set('debug', true);

const productSchema= new mongoose.Schema({
        id:String,
        imgl:String,
        name:String,
        quantity:Number,
        price:Number,
        description:String,
        nutrient:Array,
})

const userLoginSchema = new mongoose.Schema({
    name:String,
    email:String,
    password:String,
    contact:String,
    cart:Array
})
const userModel = mongoose.model("DataSet1",productSchema);
const userLoginModel= mongoose.model("userDetails",userLoginSchema);


app.put('/:email',async (req,res) =>{
    try {
        const email = decodeURIComponent(req.params.email);

        // Find the user by email and update the cart field
        const updatedUser = await userLoginModel.findOneAndUpdate(
            { email: email },
            { $set: { cart: req.body.cart } },
            { new: true } // Return the updated document
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(updatedUser);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
})

app.post('/',async (req,res) =>{

    // const newData={
    //    id:req.body.id,
    //    imgl:req.body.imgl,
    //    name:req.body.name,
    //     quantity:req.body.quantity,
    //     price:req.body.price,
    //     description:req.body.description,
    //     nutrient:req.body.nutrient
    // }

    const userLoginFormat = {
        name:req.body.name,
        email:req.body.email,
        password:req.body.password,
        contact:req.body.contact,
        cart:req.body.cart
    }
    const { name, email, contact, cart } = req.body;
    
    if (!name || !email || !contact) {
        return res.status(400).json({ message: 'Name, email, and contact are required.' });
    }

    // const userLoginFormat = { name, email, contact, cart };

    try{
        const newItem=new userLoginModel(userLoginFormat);
        await newItem.save();
        res.status(201).json(newItem);

    }
    catch(e){
        console.error('error in saving data',e);
    }
})

// {
//     id:30,
//     imgl:"img1",
//     name:"rice5",
//      quantity:1,
//      price:120,
//      description:"this is rice",
//      nutrient:[
//          {vitamins:"b1"},
//          {mineral:'iron'}
//      ],
//  }
app.get('/',async (req,res) =>{
    
    try {
        const users = await userModel.find({});
        const userLogins= await userLoginModel.find({});
        res.json({
            users:users,
            userLogins:userLogins
        });
      } catch (err) {
        console.error(err);
        res.status(500).send('Error retrieving data');
      }
})

app.listen(8000,()=>{
    console.log("The App is running");
})
