const axios = require("axios");
const base64 = require("base-64");

exports.handler = async function (event, context) {
    try {
        const eventBody = JSON.parse(event.body);
        const cardDetails = eventBody.data;
        const folderName = eventBody.folder_name;
        const fileName = eventBody.file_name;
        const data = JSON.stringify({
            "message": "created the file...",
            "content": base64.encode(JSON.stringify(cardDetails)),
        });

        const config = {
            method: 'put',
            url: process.env.GITHUB_URL + '/js/' + folderName + '/' + fileName,
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
                msg: (responseMessage.data.content.name == fileName) ? "Card created successfully" : "Something Went Wrong",
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