"use strict";

 

exports.execute = (req, res) => {
	//res.status(200).end() // best practice to respond with 200 status
    var actionJSONPayload = JSON.parse(req.body.payload) // parse URL-encoded payload JSON string
	console.log('---selected value is '+ actionJSONPayload.actions[0].name);
    let message = {
        "text": actionJSONPayload.user.name+" clicked: "+actionJSONPayload.actions[0].value,
        "replace_original": false
    }
	console.log('----in button_action, before res.json(message) ');
    console.log('---message is ' + message);
	res.json(message);
};
/*
function sendMessageToSlackResponseURL(responseURL, JSONmessage){
    var postOptions = {
        uri: responseURL,
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        json: JSONmessage
    }
    request(postOptions, (error, response, body) => {
        if (error){
            // handle errors as you see fit
        }
    })
}
*/