const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type:String,
      
    },
    email: {
        type:String,
    },
    income: {
        type:Number,
        default: 0,
    
    },
    savings:{
        type:Number,
        default: 0,
     
    },
    rent: {
        type:Number,
        default: 0,
   
    },
    recurring:{
        type:Number,
        default: 0,

    },
    budget: {
        type:Number,
        default: 0,
    
    },
    remainingAmount:{ 
        type: Number, 
        default: 0,
    },
    resetData:{
        type:Date,
    },
    //relationship between expense items

}, { collection: 'userprofiles' });


userSchema.plugin(passportLocalMongoose,{usernameField:'email'});

module.exports = mongoose.model("Profile", userSchema)

