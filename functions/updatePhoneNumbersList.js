const axios = require("axios");
const base64 = require("base-64");

exports.handler = async function (event, context) {
    try {
        const response = JSON.parse(event.body);
        const responseData = response.data;
        const sha = response.sha;
        const data = JSON.stringify({
            "message": "update the phone number list...",
            "content": base64.encode(JSON.stringify(responseData)),
            "sha": sha
        });

        const config = {
            method: 'put',
            url: 'https://api.github.com/repos/misusonu18/digital-visiting-card-js/contents/js/phone_numbers.json',
            headers: {
                'Authorization': 'Bearer ' + process.env.TOKEN,
                'Content-Type': 'application/json',
            },
            data: data
        }

        let responseMessage;

        await axios(config)
            .then(function (testResponse) {
                responseMessage = testResponse;
            })
            .catch(function (error) {
                responseMessage = error;
            });

        return {
            statusCode: 201,
            body: JSON.stringify({
                msg: (responseMessage.data.content.name == 'phone_number.json') ? "Successfull File Updated" : "Something Went Wrong",
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