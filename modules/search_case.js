"use strict";

let auth = require("./slack-salesforce-auth"),
    force = require("./force"),
    SEARCH_CASE_TOKEN = process.env.SLACK_SEARCH_CASE_TOKEN;

exports.execute = (req, res) => {

    if (req.body.token != SEARCH_CASE_TOKEN) {
        res.send("Invalid token");
        return;
    }

    let slackUserId = req.body.user_id,
        oauthObj = auth.getOAuthObject(slackUserId),
        q = "SELECT Id, casenumber, ownerid, Owner.name, subject FROM Case WHERE subject LIKE '%" + req.body.text + "%' LIMIT 20";

    force.query(oauthObj, q)
        .then(data => {
            let caseResults = JSON.parse(data).records;
            if (caseResults && caseResults.length>0) {
                let attachments = [];
                caseResults.forEach(function(c) {
                    let fields = [];
                    fields.push({title: "Case Number", value: c.casenumber, short:true});
                    fields.push({title: "Owner", value: c.ownerid, short:true});
                    fields.push({title: "Subject", value: c.subject, short:true});
                    fields.push({title: "Open in Salesforce:", value: oauthObj.instance_url + "/" + c.Id, short:false});
                    attachments.push({color: "#A094ED", fields: fields});
                });
                res.json({text: "Cases matching '" + req.body.text + "':", attachments: attachments});
            } else {
                res.send("No records");
            }
        })
        .catch(error => {
            if (error.code == 401) {
                res.send(`Visit this URL to login to Salesforce: https://${req.hostname}/login/` + slackUserId);
            } else {
                res.send("An error as occurred");
				console.log('---error message is ' + error.message);
            }
        });
};