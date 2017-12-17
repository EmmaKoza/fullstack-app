const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
    date: {
        type: Date,
        required:true,
    },
    item:{
        type: String,
        required:true,
    },
    cost: {
        type:Number,
        min:0.01,
        required:true,
    },
    notes: {
        type:String,
        required:false,
    },
    category: {
        type:String,
        required:true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'Profile'
    },
});

module.exports = mongoose.model("ExpenseItem", ItemSchema)