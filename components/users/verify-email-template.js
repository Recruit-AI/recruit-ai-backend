const verifyEmailTemplate = (link) => {
    return `<div style="width:100%;text-align:center,font-family:Gothic">
    <h2>Thank You For Registering</h2>
    <h1>GrimWire</h1>
    <h4>Please Click the Link Below To Continue Verification:</h4>
    
    <p><a href=${link}>Verify Here</a></p>
    
    <hr />
    <p><i>If  you did not request this email, please ignore. It was most likely a typo. 
        If you continue to recieve emails from this address, please reply to this email.</i></p>
   
</div>`
}

module.exports = verifyEmailTemplate