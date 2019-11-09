const express = require('express');

const Users = require('./user-model.js');

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const nodeMailer = require('nodemailer')
const secrets = require('../../config/secrets.js');

const {user_restricted, mod_restricted, admin_restricted} = require('./restricted-middleware.js')

const router = express.Router();

router.post('/register', (req, res) => {
  const userData = req.body;
  userData.user_role = 1
  delete userData.user_id
  delete userData.user_verified

  userData.password = bcrypt.hashSync(userData.password, 10)

  //generate another hash from username to send in "verify" getThumbnail
  const user_hash = bcrypt.hashSync(userData.username, 2)


  Users.add(userData)
  .then(user => {
    if(user.user_id) {
      const link = `https://grimwire.netlify.com/users/verify/${user.user_id}/${encodeURIComponent(user_hash)}` //This should be a front end link
      const text = `Here is the link you should copy & paste into your browser: ${link}`
      const html = `<a href="${link}">Click Here</a> to verify your account.`
      sendEmail(user, "Please register your Grimwire account", text, html)
      res.status(201).json({message: "User registered. Please check your email for confirmation.", user, user_hash})
    }
    else {res.status(500).json(user)};
  })
  .catch (err => {
    res.status(500).json({ message: 'Failed to create new user' });
  });
});

router.get("/verify/:user_id/:user_hash", async (req, res) => {
  const {user_hash, user_id} = req.params
  const user = await Users.findById(user_id)
  if( user && bcrypt.compareSync(user.username, user_hash) ) {
    Users.update({user_verified: true}, user_id)
    .then(response => res.json({messge: "Thank you. Please log in.", response}))
    .catch(err => { res.status(500).json({ message: 'Failed.' }) })
  } else {
    res.send("Unkwown Error (no user found)")
  }
})

router.get("/forgottenPassword/:username", async (req, res) => {
  const {username} = req.params

  const user = await Users.findByUsername(username)
  const user_hash = bcrypt.hashSync(user.username, 2)

  if(user) {
    const link = `https://grimwire.netlify.com/users/resetPassword/${username}/${encodeURIComponent(user_hash)}` //This should be a front end link
    const text = `Here is the link you should copy & paste into your browser: ${link}`
    const html = `<a href="${link}">Click Here</a> to reset your password.`
    sendEmail(user, "Your forgotten password link,", text, html)
  }

  //Return a false success even if user doesn't exist
  res.json({message: "Success! Please check your email."})
})

router.put("/resetPassword/:username/:user_hash", async (req, res) => {
  const {user_hash, username} = req.params
  const {password} = req.body

  const user = await Users.findByUsername(username)

  const hashedPassword = bcrypt.hashSync(password, 10)

  if( user && bcrypt.compareSync(username, user_hash) ) {
    const updatedUser = await Users.update({password: hashedPassword}, user.user_id)
    res.json({message: "All set.", updatedUser})
  } else {
    res.send("Unkwown Error.")
  }

})

router.post('/login', (req, res) => {
  let {username, password} = req.body

  Users.findByUsername(username)
  .then(user => {
    if(user && bcrypt.compareSync(password, user.password) && user.user_verified){
      const token = generateToken(user)
      res.status(200).json({message: "Welcome!", token: token, user: user})
    } else {
      res.status(500).json({message: "Invalid Credentials."})
    }
  })
  .catch(error => {
    res.status(500).json({message: "Invalid Credentials."})
  })
});



router.delete('/logout', user_restricted, (req, res) => {
  res.status(200).json({message: "Logged out!"})
});





function generateToken(user) {
  const payload = {
    subject: user.id, // sub in payload is what the token is about
    user: user
  };

  const options = {
    expiresIn: '1d', // show other available options in the library's documentation
  };

  // extract the secret away so it can be required and used where needed
  return jwt.sign(payload, process.env.JWT_SECRET, options); // this method is synchronous
}

module.exports = router;


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
