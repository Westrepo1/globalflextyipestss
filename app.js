const express = require('express');
const mongoose  = require('mongoose');
// const connectMongo = require('connect-mongo');
const fileUpload = require('express-fileupload')
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');
const { requireAuth, checkUser } = require('./server/authMiddleware/authMiddleware');


const app = express();
const PORT = 7000 || process.env.PORT;

//middlewares
app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
// use file-upload // to import pictures to our website but we required it first above
app.use(fileUpload());
app.use(methodOverride('_method'));

// globalf3@globalflextyipests.com
// set view engine
app.set('view engine', 'ejs');

//DB config
const db ='mongodb+srv://pius1:pius123@webdevelopment.xav1dsx.mongodb.net/globalflextyipests';
// connect to mongodb
mongoose.connect(db)
.then(()=>{
    console.log('MongoDB Connected')
})
.catch(err =>{console.log(err)})




app.get('*', checkUser);
app.use('/', require('./server/Route/indexRoute'));
app.use('/', requireAuth, require('./server/Route/userRoute'));
app.use('/', requireAuth, require('./server/Route/adminRoute'));

app.listen(PORT, console.log(`Server running on  ${PORT}`));


 

