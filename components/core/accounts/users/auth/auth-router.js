const express = require('express');
const router = express.Router();
const Users = require('../user-model.js');
const IpAuth = require('./ip-auth-model.js')

//Used for password authentication & passing back the json web token
const bcrypt = require('bcryptjs') //hashing the password
const owasp = require('../../../../../config/passwordConfig') //setting minimum restrictions on passwords
const jwt = require('jsonwebtoken')

//Used to send the verfiy & forgotten password emails
const nodeMailer = require('nodemailer')
const verifyEmailTemplate = require('../emailTemplates/verify-email-template')
const forgotPasswordTemplate = require('../emailTemplates/forgotten-password-template')

//Auth middleware
const authenticate = require('../../restricted-middleware.js')


const userKindsInfo = require('../userKinds/user_kinds-model')

//Table of Contents
//-----------------
// Register
// Verify
// Login
// Forgotten password request
// Forgotten password reset
// Edit account
// Logout

//---------------------------------------------
//  REGISTER
//POST /users/auth/register
//Takes in a json object of user information, cleans it, checks it validity, creates the user, and sends a registration email.
//---------------------------------------------
router.post('/register', async (req, res) => {
  //make sure we remove all malicious attempts to falsely set privelages, roles, etc.
  //let userData = cleanAndSetInput(req.body);
  let userData = req.body

  //Test the password's strength and start to keep track of errors
  var pwStrength = owasp.test(userData.password);
  let errors = pwStrength.errors
  
  var regex = /^[A-Za-z0-9]+$/
  var isValid = regex.test(userData.username);
  if(!isValid) { errors.push("Username can only contain letters & numbers, no spaces or symbols.")}

  //See if the username/email is taken, and add to errors if true.
  var userSearch = await Users.findUser(userData.user_email, userData.username)
  if (userSearch && userSearch.user_id) {
    if (userSearch.username.toLowerCase() === userData.username.toLowerCase()) { errors.push("That username is taken.") }
    if (userSearch.user_email.toLowerCase() === userData.user_email.toLowerCase()) { errors.push("That email is taken.") }
  }

  if (errors.length === 0) {
    userData.password = bcrypt.hashSync(userData.password, 10)
    const user = await Users.add(userData)

    const userInfo = await createUserKindInfo(user)

    user.userInfo = userInfo

    const user_hash = registerEmail(user)
    res.status(201).json({
      message: "User registered. Please check your email for confirmation.",
      user, //should be removed in prod
      user_hash //should be removed in prod

    })

  } else {
    res.status(400).json({ message: "Could not complete registration", error: pwStrength.errors })
  }

});


//---------------------------------------------
//  VERIFY
//GET /users/auth/verify/:user_id/:user_hash
//Takes in a json object of user information, cleans it, checks it validity, creates the user, and sends a registration email.
//---------------------------------------------
router.get("/verify/:user_id/:user_hash", async (req, res) => {
  const { user_hash, user_id } = req.params
  const user = await Users.findById(user_id)

  //Check the user_hash from the email vs. the username
  if (checkRegistrationHash(user, user_hash)) {
    Users.verify(user_id)
      .then(response => res.json({ messge: "Thank you. Please log in." }))
      .catch(err => { res.status(500).json({ message: 'Failed.' }) })
  } else {
    res.send("Unkwown Error (no user found)")
  }
})


//---------------------------------------------
//  REQUEST FORGOTTEN PASSWORD
//GET /users/auth/forgottenPassword/:username_or_email
//Takes a username/email, makes the changes to the record, and sends an email.
//---------------------------------------------
router.get("/forgottenPassword/:usernameEmail", async (req, res) => {
  const { usernameEmail } = req.params

  const user = await resetPassword(usernameEmail)

  forgotPasswordEmail(user)

  //Return a false success even if user doesn't exist
  res.json({ message: "Success! Please check your email." })
})


//---------------------------------------------
//  RESET FORGOTTEN PASSWORD
//PUT /users/auth/resetPassword/:username_or_email/:user_hash
//Takes a 
//---------------------------------------------
router.put("/resetPassword/:username/:user_hash", async (req, res) => {
  const { user_hash, username } = req.params
  const { password } = req.body

  var pwStrength = owasp.test(password);

  if (pwStrength.errors.length === 0) {
    const user = await setPassword(username, password, user_hash)
    res.json({ message: "All set.", user })
  } else {
    res.status(400).json({ message: "Please check your password", error: pwStrength.errors })
  }
})

//---------------------------------------------
//  LOGIN
//PUT /users/auth/resetPassword/:username_or_email/:user_hash
//Takes a 
//---------------------------------------------
router.post('/login', check_ip_ban, (req, res) => {
  let { username, password } = req.body
  console.log("IP BAN?", username, password)

  Users.findUser(username)
    .then(user => {
      console.log(user.password, user.user_verified)
      if (user && bcrypt.compareSync(password, user.password) && user.user_verified) {
        const token = generateToken(user)
        delete user.password
        res.status(200).json({ message: "Welcome!", token: token, user: user })
      } else {
        res.status(500).json({ message: "Invalid Credentials." })
      }
    })
    .catch(error => {
      res.status(500).json({ message: "Invalid Credentials." })
    })
});


//---------------------------------------------
//  EDIT ACCOUNT
//PUT /users/auth/edit
//Takes a 
//---------------------------------------------
router.put('/edit', authenticate.user_restricted, async (req, res) => {
  const changes = req.body;
  const user = req.decodedToken.user;
  const id = user.user_id
  //delete changes['user_role']
  delete changes['user_id']
  delete changes['user_verified']

  let errors = []
  let usernameSearch = false
  let emailSearch = false

  if (changes.password && changes.password != "") {
    var pwStrength = owasp.test(changes.password);
    errors = [...errors, ...pwStrength.errors]
    changes.password = bcrypt.hashSync(changes.password, 10)
  } else {
    delete changes.password
  }

  if (changes.username && (changes.username != user.username)) {
    var regex = /^[A-Za-z0-9]+$/
    var isValid = regex.test(changes.username);
    if(!isValid) { errors.push("Username can only contain letters & numbers, no spaces or symbols.")}
    usernameSearch = await Users.findByUsername(changes.username)
    if (usernameSearch) { errors.push("That username is taken.") }
  }

  if (changes.user_email && (changes.user_email != user.user_email)) {
    emailSearch = await Users.findByEmail(changes.user_email)
    if (emailSearch) { errors.push("THat email is taken.") }
  }

  if (errors.length === 0) {
    Users.update(changes, id)
      .then(updatedUser => {
        res.json(updatedUser);
      });
  } else {
    res.status(400).json({ message: 'Could not update user', error: errors });
  }
});

router.put('/edit/info', authenticate.user_restricted, (req, res) => {
  const infoData = req.body;
  const user = req.decodedToken.user;
  const id = user.user_id
  
  const UserKindDb = userKindsInfo(user.user_kind)

  UserKindDb.updateByUserId(infoData, id)
    .then(updateInfo => {
      user.info = updateInfo
      res.json( user ) ;
    })
    .catch(err => {
      res.status(500).json({ message: 'Failed to update the users information' });
    });

});


//---------------------------------------------
//  LOGOUT
//PUT /users/auth/resetPassword/:username_or_email/:user_hash
//Takes a 
//---------------------------------------------
router.delete('/logout', authenticate.user_restricted, (req, res) => {
  res.status(200).json({ message: "Logged out!" })
});


module.exports = router;

async function createUserKindInfo(user) {
  const UserKindDb = userKindsInfo(user.user_kind)
  const userInfo = await UserKindDb.add({foreign_user_id: user.user_id})
  return userInfo
}


//---------------------------------------------
//  PRIVATE FUNCTIONS
//---------------------------------------------

//IP Related

//Sees if the current ip has a ban against it.
async function check_ip_ban(req, res, next) {
  const check = await IpAuth.processIp(getUserIP(req))
  if (check) { next() } else { res.status(400).json({ message: "Invalid Credentials." }) }
}

//Gets the current IP of the user
const getUserIP = (req) => {
  var ipAddr = req.headers["x-forwarded-for"];
  if (ipAddr) {
    var list = ipAddr.split(",");
    ipAddr = list[list.length - 1];
  } else {
    ipAddr = req.connection.remoteAddress;
  }
  //During development, this will return "::1", for localhost. Set to a valid ip instead.
  return ipAddr === "::1" ? "161.185.160.93" : ipAddr;
}

//JSON Web Token

//Returns a nice JSON token with the user object attached.
function generateToken(user) {
  const payload = {
    subject: user.id, // sub in payload is what the token is about
    user: user
  };

  const options = {
    expiresIn: '30d', // show other available options in the library's documentation
  };

  // extract the secret away so it can be required and used where needed
  return jwt.sign(payload, process.env.JWT_SECRET, options); // this method is synchronous
}


//Cleaning the input so that bad things arene't set

function cleanInput(userData) {
  //Clean all the things the user could maliciously set
  delete userData.user_role
  delete userData.user_kind
  delete userData.user_id
  delete userData.user_verified
  return userData
}

function cleanAndSetInput(userData) {
  userData = cleanInput(userData)
  userData.user_role = 1
  userData.user_kind = 'end_user'
  return userData
}

//All about the emails

function registerEmail(user) {
  //generate another hash from username to send in "verify" getThumbnail
  const user_hash = registrationHash(user)
  const link = `https://grimwire.netlify.com/users/verify/${user.user_id}/${encodeURIComponent(user_hash)}` //This should be a front end link
  const text = `Thank you for registering for Grimwire. You can copy & paste this link to complete the verification process: ${link}`
  const html = verifyEmailTemplate(link)
  sendEmail(user, "Thank You For Registering With GrimWire", text, html)
  return user_hash
}

function forgotPasswordEmail(user) {
  const user_hash = forgotPasswordHash(user)
  const link = `https://grimwire.netlify.com/users/resetPassword/${user.username}/${encodeURIComponent(user_hash)}` //This should be a front end link
  const text = `You can copy and past this link into your browser to reset your password: ${link}`
  const html = forgotPasswordTemplate(link)
  sendEmail(user, "Your forgotten password link,", text, html)
}

const sendEmail = (user, subject, text, html) => {
  let transporter = nodeMailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: 'grimwirecontact@gmail.com',
      pass: 'Gr!mw!re'
    }
  });
  let mailOptions = {
    to: user.user_email,
    subject: subject,
    text: text,
    html: html
  };

  transporter.sendMail(mailOptions, (error, info) => { return error ? false : true });

}

//Functions to easily set & check the hashes used.

function registrationHash(user) {
  return bcrypt.hashSync(user.username, 2)
}

function checkRegistrationHash(user, user_hash) {
  return user && bcrypt.compareSync(user.username, user_hash)
}

function forgotPasswordHash(user) {
  return bcrypt.hashSync(user.username + reset_time, 2)
}

function checkForgotPasswordHash(user, user_hash) {
  return bcrypt.compareSync(user.username + user.forgotten_password_reset_time, user_hash)
}

//Quick helper function to grab the current time and set it as the reset time.
async function resetPassword(usernameEmail) {
  const user = await Users.findUser(usernameEmail)

  const reset_time = Date.now()

  user = await Users.update({ forgotten_password_reset_time: reset_time }, user.user_id)

  return user
}

async function setPassword(username, password, user_hash) {
  let user = await Users.findUser(username)
  const hashedPassword = bcrypt.hashSync(password, 10)
  const oneDayAfter = checkResetTime(user)
  const hashCheck = checkForgotPasswordHash(user, user_hash)

  if (user && oneDayAfter && hashCheck) {
    const updatedUser = await Users.updatePassword(hashPassword, id)
    return updatedUser
  } else {
    return false
  }

}

function checkResetTime(user) {
  return user.forgotten_password_reset_time < Date.now() &&
    Date.now() < user.forgotten_password_reset_time + 1000 * 60 * 60 * 24
}