"use strict";

let auth = require("./slack-salesforce-auth"),
    force = require("./force"),
    SEARCH_CASE_TOKEN = process.env.SLACK_SEARCH_CASE_TOKEN;

exports.execute = (req, res) => {
	res.status(200).end() // best practice to respond with empty 200 status code
	console.log('----place 1 ');
    var reqBody = req.body
	console.log('----place 2 ');
    var responseURL = reqBody.response_url
	console.log('----place 3 ');
    if (reqBody.token != "qAuoAiwY3kSaSC076U3EfkNr"){
		console.log('----place 4 ');
        res.status(403).end("Access forbidden")
    }else{
        
		console.log('----place 5 ');
		var message = {
            "text": "This is your first interactive message",
            "attachments": [
                {
                    "text": "Building buttons is easy right?",
                    "fallback": "Shame... buttons aren't supported in this land",
                    "callback_id": "button_tutorial",
                    "color": "#3AA3E3",
                    "attachment_type": "default",
                    "actions": [
                        {
                            "name": "yes",
                            "text": "yes",
                            "type": "button",
                            "value": "yes"
                        },
                        {
                            "name": "no",
                            "text": "no",
                            "type": "button",
                            "value": "no"
                        },
                        {
                            "name": "maybe",
                            "text": "maybe",
                            "type": "button",
                            "value": "maybe",
                            "style": "danger"
                        }
                    ]
                }
            ]
        }
        sendMessageToSlackResponseURL(responseURL, message)
    }
};

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
