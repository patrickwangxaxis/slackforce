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
	//res.json(message);
	let auth = require("./slack-salesforce-auth"),
    force = require("./force");
	
	
	//**********************************************************
	let slackUserId = req.body.user_id,
        oauthObj = auth.getOAuthObject(slackUserId),
        subject = "test subject",
        description = "test description",
		caseId = "500e000000B9NaaAAF";
        
    force.update(oauthObj, "Case",
        {
            id : caseId,
			subject: "update test1" + Date.now()
            
        })
        .then(data => {
            let fields = [];
            fields.push({title: "Subject", value: subject, short:false});
            fields.push({title: "Open in Salesforce:", value: oauthObj.instance_url + "/" + id, short:false});
            let message = {
                text: "A case has been updated:",
                attachments: [
                    {color: "#F2CF5B", fields: fields
					 
			
					}
                ]
            };
			console.log('----slack user is ' + slackUserId);
            res.json(message);
			
			 
        })
        .catch((error) => {
            if (error.code == 401) {
                res.send(`Visit this URL to login to Salesforce: https://${req.hostname}/login/` + slackUserId);

            } else {
                res.send("An error as occurred" +error.message);
            }
        });
	//*********************************************************
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