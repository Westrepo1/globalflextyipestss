const mongoose = require('mongoose');
const  validator  = require('validator');
// const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({

    fullname:{
        type: String,
    },
    tel:{
        type: String,
    },
    email:{
        type: String,
        unique: true,
        lowercase: true,
        required: validator.isEmail['Please enter an email']
        // required:  [isEmail, 'Please enter an email']
    },
  
    country:{
        type: String
    },
    gender:{
        type: String
    },
    account:{
        type: String
    },
    password:{
        type: String,
    },
    session:{
        type: String,
        default:"0/0"
    },

    image:{
        type: String,
    }, 
    balance:{
        type: String,
        default: "$0.00"
    },
    available:{
        type: String,
        default: "$0.00"
    },
    bonus:{
        type: String,
        default: "$0.00"
    },
    widthdrawBalance:{
        type: String,
        default: "$0.00"
    },
    profit:{
        type: String,
        default: "$0.00"
    },
    totalDeposit:{
        type: String,
        default: "0"
    },

    totalWidthdraw:{
        type: String,
        default: "0"
    },
    verifiedStatus:{
        type: String,
        default: 'Account not yet Verified!'
    },
    livetrades: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'livetrade'
    },
    upgrades: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'upgrade'
    },
    verified:{
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'verify'
    },
   
    deposits:{
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'deposit'
    },

    widthdraws:{
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'widthdraw'
    },
    role:{
        type: Number,
        default: 0
    }
},{timestamps: true})

// static method to login user
userSchema.statics.login = async function(email, password) {
    const user = await this.findOne({ email });
    if (user) {
      const auth = await (password, user.password);
      if (auth) {
        return user;
      }
      throw Error('incorrect password');
    }
    throw Error('incorrect email');
  };
  

const User = mongoose.model('user', userSchema)

module.exports = User;
