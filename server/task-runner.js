const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/budgetapp');
const Profile = require('../models/profile.js');

const moment = require('moment');
moment().format();

const updateUserData = function(){
    Profile.find()
    .then((users)=>{
        updatedRemaining = users.map((user)=>{
            return parseFloat(user.remainingAmount + user.budget).toFixed(2);
        })
        const updatedUser = users.map((user,i)=>{
            return  Object.assign(user,{
                remainingAmount: updatedRemaining[i]
            })
        });
        updatedUser.save((err, doc)=>{
            if(err){
              res
              .send(err)
              .status(500)
            }else{
              res
              .status(200)
              .send(doc)
            }
        })
    })
}

exports.timer=()=>{
    setInterval(function(){ 
        const currentDay = moment().isoWeekday();
        const currentHour = moment().hour();
        const currentMinute = moment().minute();
        const currentSecond = moment().second();
        const timeRightNow = `${currentHour}:${currentMinute}:${currentSecond}`
        if(timeRightNow === '00:00:00' && currentDay === 7){
            updateUserData()
        }
    }, 1000)
}



