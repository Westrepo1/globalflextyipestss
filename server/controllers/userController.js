const User = require('../Model/User');
const Deposit = require('../Model/depositSchema');
const Widthdraw = require('../Model/widthdrawSchema');
const Trade = require("../Model/livetradingSchema");
const Upgrade = require("../Model/upgradeSchema");
const Verify = require("../Model/verifySchema");
const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");


// handle errors
const handleErrors = (err) => {
    console.log(err.message, err.code);
    let errors = { email: '', password: '', };
  
    // duplicate email error
    if (err.code === 11000) {
      errors.email = 'that email is already registered';
      return errors;
    }
  
    // validation errors
    if (err.message.includes('user validation failed')) {
      // console.log(err);
      Object.values(err.errors).forEach(({ properties }) => {
        // console.log(val);
        // console.log(properties);
        errors[properties.path] = properties.message;
      });
    }
  
    return errors;
  }

  const maxAge = 3 * 24 * 60 * 60;
  const createToken = (id) => {
    return jwt.sign({ id }, 'piuscandothis', {
      expiresIn: maxAge
    });
  };








module.exports.homePage = (req, res)=>{
res.render("index")
}

module.exports.aboutPage = (req, res)=>{
    res.render("about")
    }
    


    module.exports.contactPage = (req, res)=>{
        res.render("contact")
   }
        
   module.exports.affliatePage = (req, res)=>{
    res.render("affiliate_program")
    }
    
    module.exports.startguidePage = (req, res)=>{
        res.render("start_guide")
    }

     module.exports.licensePage = (req, res)=>{
        res.render("license")
   }
        
   module.exports.faqPage = (req, res)=>{
    res.render("faqs")
    }
    
    module.exports.termsPage = (req, res)=>{
        res.render("terms")
    }

    module.exports.registerPage = (req, res)=>{
        res.render("register")
    }

    module.exports.loginAdmin = (req, res) =>{
        res.render('loginAdmin');
    }
    

      
      


module.exports.register_post = async (req, res) =>{
    const {fullname, email,account, country, gender,tel,currency, password, } = req.body;
    try {
        const user = await User.create({fullname, email,account, country, gender,tel,currency, password});
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.status(201).json({ user: user._id });

        // if(user){
        //   sendEmail(req.body.fullname,req.body.email, req.body.password)
        // }else{
        //   console.log(error);
        // }
      }
        catch(err) {
            const errors = handleErrors(err);
            res.status(400).json({ errors });
          }
    
}

module.exports.loginPage = (req, res)=>{
    res.render("login")
}


  module.exports.login_post = async(req, res) =>{
    const { email, password } = req.body;

    try {
      const user = await User.login(email, password);
      const token = createToken(user._id);
      res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
      res.status(200).json({ user: user._id });

        // if(user){
        //   loginEmail(req.body.email)
        // }else{
        //   console.log(error);
        // }
    } 
    catch (err) {
      const errors = handleErrors(err);
      res.status(400).json({ errors });
    }
}

module.exports.dashboardPage = async(req, res) =>{
  res.render('dashboard');
}

module.exports.navbarPage = async(req, res)=>{
    res.render("navbarPage")
    }

module.exports.verifyPage = async(req, res)=>{
    res.render("verify")
}



module.exports.verifyPage_post = async(req, res)=>{
    // const { email, username,fullname,city,gender,dateofBirth,marital,age,address,image} =req.body
    let theImage;
    let uploadPath;
    let newImageName;

    if(!req.files || Object.keys(req.files).length === 0){
        console.log('no files to upload')
    }else{
            theImage = req.files.image;
            newImageName = theImage.name;
            uploadPath = require('path').resolve('./') + '/Public/IMG_UPLOADS' + newImageName

            theImage.mv(uploadPath, function(err){
                if(err){
                    console.log(err)
                }
           })

    }
    try{
        const verification = new Verify({
            email: req.body.email,
             username: req.body.username,
             fullname: req.body.fullname,
             city: req.body.city,
             gender: req.body.gender,
             dateofBirth: req.body.dateofBirth,
             marital: req.body.marital,
             age: req.body.age,
             address: req.body.address,
             image: newImageName
        })
        verification.save()
        const id = req.params.id;
        const user = await User.findById(id);
        user.verified.push(verification);
        // await User.findById(id).populate("verify")
        await user.save();

        // if(user){
        //     verifyEmail(req.body.fullname)
        //     res.redirect("/dashboard")   
        // }else{
        //     console.log(error)
        // }
    }catch(error){
        console.log(error)
    }

}


module.exports.accountPage = async(req, res) =>{
//   const id = req.params.id
//   const user = await User.findById(id);
  res.render('account')
}

module.exports.editProfilePage = async(req, res)=>{
    res.render("editProfile")
}

module.exports.transactionPage = async(req, res)=>{
    res.render("transactions")
}


module.exports.livePage = async(req, res)=>{
    res.render("live")
}
module.exports.livePage_post = async(req, res)=>{
    // const {type,currencypair, lotsize, entryPrice, stopLoss,  takeProfit, action} = req.body
    try {
        const liveTrade = new Trade({
            type: req.body.type,
            currencypair: req.body.currencypair, 
            lotsize: req.body.lotsize,
             entryPrice: req.body.entryPrice,
             stopLoss: req.body.stopLoss,
             takeProfit: req.body.takeProfit,
             action:req.body.action
        })
        liveTrade.save()
        const id = req.params.id;
        const user = await User.findById( id);
        user.livetrades.push(liveTrade)
        await user.save();

        res.render("liveHistory", {user})
       
    } catch (error) {
        console.log(error)
    }
}

module.exports.tradingHistory = async(req, res)=>{
    const id = req.params.id
    const user = await User.findById(id).populate("livetrades")
    res.render("liveHistory",{user})
  }
  

module.exports.upgradePage = async(req, res)=>{
    res.render("accountUpgrade")
}


  
  module.exports.upgradePage_post = async(req, res)=>{
      // const {amount, method,image} = req.body
      let theImage;
      let uploadPath;
      let newImageName;
  
      if(!req.files || Object.keys(req.files).length === 0){
          console.log('no files to upload')
      }else{
              theImage = req.files.image;
              newImageName = theImage.name;
              uploadPath = require('path').resolve('./') + '/Public/IMG_UPLOADS' + newImageName
  
              theImage.mv(uploadPath, function(err){
                  if(err){
                      console.log(err)
                  }
              })
  
      }
      try {
          const upgrade = new Upgrade({
              amount: req.body.amount,
               method: req.body.method,
               image: newImageName
          })
          upgrade.save()
          const id = req.params.id;
          const user = await User.findById( id);
           user.upgrades.push(upgrade)
          //  await User.findById(id).populate("upgrades")
          await user.save();
  
          // if(user){
          //     upgradeEmail(req.body.amount, req.body.method)
              // req.flash('success_msg', 'your upgrade under review')
              res.redirect("/dashboard")
          // }else{
          //       console.log(error);
          //     }
      } catch (error) {
          console.log(error)
      }
  }
  

module.exports.depositPage = async(req, res) =>{
    res.render("fundAccount")
}

module.exports.widthdrawPage = async(req, res)=>{
    res.render("widthdrawFunds")
}



  
  
  module.exports.depositPage_post = async(req, res) =>{
      // const {type, amount, status, image, narration} = req.body
      let theImage;
      let uploadPath;
      let newImageName;
  
      if(!req.files || Object.keys(req.files).length === 0){
          console.log('no files to upload')
      }else{
              theImage = req.files.image;
              newImageName = theImage.name;
              uploadPath = require('path').resolve('./') + '/Public/IMG_UPLOADS' + newImageName
  
              theImage.mv(uploadPath, function(err){
                  if(err){
                      console.log(err)
                  }
              })
  
      }
      try {
          const deposit = new Deposit({
              type: req.body.type,
              amount: req.body.amount,
              status: req.body.status,
               image: newImageName,
              narration: req.body.narration
          })
          deposit.save()
          const id = req.params.id;
          const user = await User.findById( id);
          user.deposits.push(deposit);
          await user.save();
  
          res.render("depositHistory",{user})
          // if(user){
          //     depositEmail(req.body.type, req.body.amount, req.body.narration)
          // }else{
          //     console.log(error)
          // }
      } catch (error) {
          console.log(error)
      }
    
  }
  
  module.exports.depositHistory = async(req, res) =>{
    try {
      const id = req.params.id
  const user = await User.findById(id).populate("deposits")
    res.render('depositHistory', { user});
    } catch (error) {
      console.log(error)
    }
}

   

    module.exports.widthdrawPage_post = async(req, res) =>{
      const { amount, type, status, narration} = req.body
      const id  = req.params.id
    try {
      const user = await User.findById(id);
      if (!user) {
        req.flash('message', 'User not found!')
              // return res.status(404).json({ error: 'User not found' });
           }

           if (user.balance === 0 || user.balance < amount) {
                  req.flash('messages', 'Insufficient balance!')
            }
            const widthdraw = new Widthdraw({
                  amount: req.body.amount,
                  type: req.body.type,
                  status: req.body.status,
                  narration: req.body.narration
                 });
            // Proceed with withdrawal
            user.balance -= amount;
             user.widthdraws.push(widthdraw)
            await user.save();
            res.render("widthdrawHistory",{user})
            // if(user){
            //      widthdrawEmail(req.body.amount,req.body.type, req.body.narration )
            //    }else{
            //       console.log(error)
            //     }
    } catch (error) {
      console.log(error)
    }

  }

  module.exports.widthdrawHistory = async(req, res) =>{
    const id = req.params.id
      const user = await User.findById(id).populate("widthdraws")
       res.render('widthdrawHistory', { user})
  }
  

module.exports.logout_get = (req, res) => {
  res.cookie('jwt', '', { maxAge: 1 });
  res.redirect('/');
}




