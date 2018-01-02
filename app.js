const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const passport = require('passport');
const bodyParser = require('body-parser');
const session = require('express-session');
const ObjectId = require('mongodb').ObjectId;
//these are my models!
const ExpenseItem = require('./models/item.js');
const Profile = require('./models/profile.js');

mongoose.connect(process.env.MONGODB_SERVER);
// app.listen(process.env.PORT);

// app.use(bodyParser.json())
// mongoose.connect('mongodb://localhost/budgetapp');

//user auth stuff
app.use(bodyParser.json());
passport.use(Profile.createStrategy());
passport.serializeUser(Profile.serializeUser()); 
passport.deserializeUser(Profile.deserializeUser());
app.use(session({ secret: process.env.COOKIE_SECRET, resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

//my task runner 
// const timer = require('./server/task-runner.js');
// timer.timer();


// This serves all files placed in the /public
// directory (where gulp will build all React code)
app.use(express.static('public'));

// Also serve everything from our assets directory (static
// assets that you want to manually include)
app.use(express.static('assets'));

// Include your own logic here (so it has precedence over the wildcard
// route below)

//login existing users
app.post('/api/login', passport.authenticate('local'), (req,res)=>{
  res.send(req.user)
})

//register new users
// app.post('/api/signup', (req,res,next)=>{
//   const newUser = new Profile({
//     name:req.body.name,
//     email: req.body.email
//   });

//   Profile.register(newUser, req.body.password, (err, user)=>{
//     if(err){
//       res.send(err);
//     }else{
//       console.log('registration successful')
//       // res.send(user);
//       // console.log(user);
//       next();
//     }
//   })
// });

const signUpUser = (req, res, next) => {
  const email = req.body.email;
  const name = req.body.name
  const user = new Profile({ email: email, name: name });
  Profile.register(user, req.body.password, (err, user) => {
    if (err) {
      res.send(err);
    } else {
      next();
    }
  })
}
const sendUser = (req, res) => {
  res.send(req.user);
}

app.post('/api/signup', signUpUser, passport.authenticate("local"), sendUser)

//log out a user
app.get('/api/logout', (req, res)=>{
  req.logout();
  res.json('User logged out.')
})


//check if a user is logged in
app.get('/api/me', (req, res) => {
  if (req.user) {
    res.status(200).send(req.user)
  } else {
    res.status(401).json({ message: "Unauthorized."});
  }
});

app.get('/api/userprofiles', (req, res) => {
  if (req.user) {
    Profile.findOne({ _id: req.user._id }).then((user)=>{   
        res.status(200).send(user); 
     })
     .catch((err)=>{
       res.status(400).send(err);
     }); 
  } else {
    res.send({message:'no user'});
  }
});



  app.put('/api/userprofiles/:id', (req, res)=>{
   const id = req.params.id
   const userInfo = req.body;

   //all the user monetary information 
   const rent = parseFloat(userInfo.rent / 4);
   const income = parseFloat(userInfo.income);
   const recurring = parseFloat(userInfo.recurring);
   const savings = parseFloat(userInfo.savings); 
   const budgetMath = income - (rent + recurring + savings);
   const budgetMathTwo = parseFloat(budgetMath).toFixed(2);
   const remaining = {remainingAmount : budgetMathTwo}
   const budget = {budget : budgetMathTwo} 
   const calculatedUser = Object.assign(userInfo.user, budget, remaining)
   console.log(calculatedUser);
   const userProfile = Profile.findById(id, (err, doc)=>{
     if(err){
       res.status(404).send(err);
     }else{
       const updatedUser = Object.assign(doc, calculatedUser);
    
       updatedUser.save((err, doc)=>{
        if(err){
          res.status(500).send(err)
        }else{
          res.status(200).send(doc)
        }
       });
     }
   })


  }); 


//gets all the user's expense items
app.get('/api/expensesitems',(req,res)=>{
  const startDate = req.query.startDate;
  const endDate = req.query.endDate;

  const id = req.query.userId; 
  // console.log(id)
  // const userId = req.query.id;
  
  const today= new Date();
  const d = new Date();  
    const getLastSunday = () => {
    var t = new Date(today);
    t.setDate(t.getDate() - t.getDay());
    const dd= t.getDate();
    const mm = t.getMonth() +1
    const yy = t.getFullYear();
    return `${yy}-${mm}-${dd}`;
  }
  const lastSunday = getLastSunday();
  // console.log(lastSunday);
  // querys the expense items by a date range if the dates are provided
  if(startDate && endDate){
    ExpenseItem.find({ 
      date: {$gte:new Date(startDate), $lte: new Date(endDate)},
      userId:ObjectId(id),   
    })
    .then((doc)=>{
      res.status(200).send(doc);
    }).catch((err)=>{
      res.status(400).send(err);
    });

  //otherwise just get them all - starting on the last sunday 
  }else{
    ExpenseItem.find({
      date: {$gte: new Date(lastSunday)},
      userId:ObjectId(id),
    }).then((docs)=>{
      res.status(200).send(docs);
    })
    .catch((err)=>{
      res.status(400).send(err);
    });
  }

});



//this removes items...duh 
app.delete('/api/expensesitems/:id',(req,res)=>{
  const itemId = req.params.id;
  // const userId = req.query.userId;
  let itemCost;
  let userId;
 ExpenseItem.findById(itemId)
    .then(item =>{
        // console.log(item);
        itemCost = item.cost;
        userId = item.userId;
        item.remove();
      })
    .then(()=>{
      // console.log('whatever');
        Profile.findById(userId, (err, user)=>{
        if(err){
          res
          .status(500)
          .send(err)
        }else{
          // console.log('sending back user data', user);
          // console.log(user, itemCost)
          const newRemaining = user.remainingAmount + itemCost;
          const newRemainingTwo = parseFloat(newRemaining).toFixed(2);
          // console.log(newRemaining);
          const updatedUser = Object.assign(user,{
            remainingAmount: newRemainingTwo,
          })
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
        }
      })
    }).catch((err)=>{
      res.status(400).send(err);
    })
});

app.post('/api/expensesitems',(req,res)=>{
//make a new instance of the expense item model
// console.log(req.body)
  const itemModel = new ExpenseItem();
  const costToDeduct = req.body.cost;
//make a new item that's assigned to  
  const expenseItem = Object.assign(itemModel, req.body);
  const id = req.body.userId;
  expenseItem.save()
  
  .then((doc)=>{
    // res.status(200).send(doc);
    //find the user by id 
    //update their remaining amount minus the amount sent in the req
    Profile.findById(id, (err, user)=>{
      if(err){
        res
        .status(500)
        .send(err)
      }else{
       
        const newRemaining = user.remainingAmount - costToDeduct;
        const newRemainingTwo = parseFloat(newRemaining).toFixed(2)        
        const updatedUser = Object.assign(user,{
          remainingAmount: newRemainingTwo,
        })
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
      }
    })
  }).catch((err)=>{
    res.status(400).send(err);
  })
});



// This route serves your index.html file (which
// initializes React)
// app.get('*', function(req, res, next) {
//   res.sendFile(path.join(__dirname,'index.html'));
// });

// // Start your server, and listen on port 8080.
// app.listen(8080, function() {
//   console.log("App is now listening on port 8080!");
// })

app.get('*', function(req, res, next) {
  res.sendFile(path.join(__dirname,'index.html'));
});


app.listen(process.env.PORT, function() {
  console.log(`App is now listening on port ${process.env.PORT}`);
})