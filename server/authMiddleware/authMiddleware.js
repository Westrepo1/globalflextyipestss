
const jwt = require('jsonwebtoken');
const User = require('../Model/User')




const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;

  // check json web token exists & is verified
  if (token) {
    jwt.verify(token, 'piuscandothis', (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        res.redirect('/login');
      } else {
        console.log(decodedToken);
        next();
      }
    });
  } else {
    res.redirect('/login');
  }
};

// check current user
const checkUser = (req, res, next) => {
  
    const token = req.cookies.jwt;
    if (token) {
      jwt.verify(token, 'piuscandothis', async (err, decodedToken) => {
        if (err) {
          res.locals.user = null;
          next();
        } else {
          let user = await User.findById(decodedToken.id);
          res.locals.user = user;
          next();
        }
      });
    } else {
      res.locals.user = null;
      next();
    }
  };


  //admin acceess
 const isAdmin = async (req, res, next) => {
  let errors = [];
  try {
    const user = await User.findById(req.user._id);
    if (user.role !== 1) {
      errors.push({msg: "Unauthourized access"})
    } else {
      next();
    }
  } catch (error) {
   console.log(error);
  }
};

module.exports = {requireAuth,checkUser, isAdmin };