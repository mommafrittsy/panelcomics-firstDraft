const router = require('express').Router(),
      crypto_str = require('crypto-random-string'),
      multer = require('multer')(),
      passport = require('passport'),
      User = require('../models/user'),
      baseURL = 'https://panel-v2.herokuapp.com/',
      panelRates = {
        limits: {
          free:{comics:1, data:5000000000},
          plus:{comics:5, data:15000000000},
          premium:{comics:20, data:50000000000}
        },
        transaction:{
          free:0.15,
          plus:0.08,
          premium:0.04
        }
      };

router.post('/email/check', multer.fields(['email']), (req, res)=>{
  if(req.body.email){
    User.findOne({email:req.body.email})
    .exec((err, foundUser)=>{
      if(err){
        res.status(400).send(err);
      } else if(foundUser != null){
        res.status(200).send({status:false});
      } else {
        res.status(200).send({status:true});
      }
    });
  } else {
    res.status(400).send({message:'No email received.'});
  }
});
router.post('/login', multer.fields(['email', 'password']), (req, res)=>{
  User.findOne({email:req.body.email})
  .exec((err, foundUser)=>{
    if(err){
      res.status(400).send(err);
    } else if(foundUser == null){
      res.status(400).send({message:'Email or password is incorrect.'});
    } else {
      passport.authenticate('local')(req, res, ()=>{
        if(req.get('Referer') != baseURL || req.get('Referer') != `${baseURL}pricing`){
          res.status(200).send({url:req.get('Referer')});
        } else {
          res.status(200).send({url:`${baseURL}dashboard`});
        }
      });
    }
  });
});
router.post('/signup', multer.fields(['email', 'password', 'catch', 'level', ]), (req, res)=>{
  if(req.body.catch){
    res.status(400).send({messages:'Bots are not allowed here.'});
  } else if (!req.body.email || !req.body.password) {
    res.status(400).send({message:'Email or password not provided.'});
  } else if (req.body.password.toLowerCase() === req.body.password || /[0-9]/.test(req.body.password) == false || req.body.password.length < 8) {
    res.status(400).send({message:"Your password does not meet the requirements."});
  } else {
    User.findOne({email: req.body.email})
    .exec((err, conflictUser)=>{
      if(err){
        res.status(400).send(err);
      } else if(conflictUser != null){
        res.status(400).send({message: 'That email is already in use.'});
      } else {
        let userObj = {
              email: req.body.email,
              login: {
                tFA: false,
                ips: [req.ip],
                mostRecent: Date.now(),
                registered: Date.now(),
                verified: false
              },
              publicID: crypto_str({length: 10}),
              subscriptionLevel: {
                limits: {comics: 1, data: 0},
                panelFee: 0.15,
                period: 'monthly',
                subType: 'free',
              }
            };
        User.register(userObj, req.body.password, (err, newUser)=>{
          if(err){
            res.status(400).send(err);
          } else {
            passport.authenticate('local')(req, res, ()=>{
              let result = {
                auth: req.isAuthenticated(),
                user: req.user,
                url: `${baseURL}dashboard`
              };
              res.status(200).send(result);
            });
          } 
        });
      }
    });
  }
});
module.exports = router;