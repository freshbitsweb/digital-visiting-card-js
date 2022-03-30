const axios = require("axios");
const base64 = require("base-64");

exports.handler = async function (event, context) {
    try {
        const eventBody = JSON.parse(event.body);
        const phoneNumberData = eventBody.data;
        const sha = eventBody.sha;
        const data = JSON.stringify({
            "message": "update the phone number list...",
            "content": base64.encode(JSON.stringify(phoneNumberData)),
            "sha": sha
        });

        const config = {
            method: 'put',
            url: process.env.GITHUB_URL + '/js/validate_phone_numbers.json',
            headers: {
                'Authorization': 'Bearer ' + process.env.TOKEN,
                'Content-Type': 'application/json',
            },
            data: data
        }

        let responseMessage;

        await axios(config)
            .then(function (response) {
                responseMessage = response;
            })
            .catch(function (error) {
                responseMessage = error;
            });

        return {
            statusCode: 201,
            body: JSON.stringify({
                msg: (responseMessage.data.content.name == 'validate_phone_numbers.json') ?
                    "Successfully Phone Number Lists Updated" :
                    "Something Went Wrong",
            }),
        };
    } catch (err) {
        return {
            statusCode: 404,
            body: JSON.stringify({
                msg: err.message,
            }),
        };
    }
};
