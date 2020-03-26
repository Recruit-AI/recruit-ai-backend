
var twilio = require('twilio');
const twilioPhoneNumber = "+14797774407"


function sendMessage(text, user_display_name, phone) {
    var client = new twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);
  
    return client.messages.create({
      body: text + " -" + user_display_name, //The message with the coach's name appended 
      to: '+1' + phone,  //The athletes number
      from: twilioPhoneNumber //Our twilio phone #
    })
  }

  
  module.exports = {sendMessage}
