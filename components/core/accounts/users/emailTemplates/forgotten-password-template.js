const forgotPasswordEmail = (link) => {
    return `<div style="width:100%;text-align:center,font-family:Gothic">
    <h2>Your Password Reset</h2>
    <h4>Please Click this Link To Reset Your Password:</h4>
    
    <p><a href=${link}>Reset</a></p>
    
    <hr />
    <p><i>If  you did not request this email, please ignore. It was most likely a typo. 
        If you continue to recieve emails from this address, please reply to this email.</i></p>
   
</div>`
}

module.exports = forgotPasswordEmail