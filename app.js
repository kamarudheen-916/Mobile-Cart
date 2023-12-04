const express = require('express');
const path = require('path');
const userRouter = require('./routes/user');
const adminRouter = require('./routes/admin');
const session = require('express-session');
// const logger = require('morgan');
const cors = require('cors');
const passport = require('passport');
const nocache = require('nocache');
const morgan = require('morgan');
const passportSetup = require('./passport-google/passport'); 
const googlelogin_Passport_setup = require('./passport-google/passport_login')
const flash = require('connect-flash');
const authRoute = require('./routes/auth');

require('dotenv').config();

const PORT = process.env.PORT || 7001;
const app = express();

app.use(
  session({
    secret: 'it is secret key',
    resave: false,
    saveUninitialized: true,
    // cookie: { maxAge: 600000 }
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(
  cors({
    origin: 'http://localhost:3000',
    methods: 'GET, POST, PUT, DELETE',
    credentials: true
  })
);


app.set('view engine', 'ejs');
app.use(nocache());

app.use(flash());


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/static',express.static(path.join(__dirname,'/public')))
// app.use(logger());
app.use(morgan('tiny'));

app.use('/auth', authRoute);
app.use('/', userRouter);
app.use('/', adminRouter);


app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});
