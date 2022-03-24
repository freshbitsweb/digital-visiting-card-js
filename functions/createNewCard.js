const axios = require("axios");
const base64 = require("base-64");

exports.handler = async function (event, context) {
    try {
        const date = new Date();
        const time = date.getTime();
        const response = JSON.parse(event.body);
        const responseData = response.data;
        const folderName = response.folder_name ? response.folder_name : 'common';
        const data = JSON.stringify({
            "message": "created the file...",
            "content": base64.encode(JSON.stringify(responseData)),
        });

        const name = (responseData.first_name).replace(" ", "_");
        const fileName = name + time + ".json";

        const config = {
            method: 'put',
            url: 'https://api.github.com/repos/misusonu18/digital-visiting-card-js/contents/js/' + folderName + '/' + fileName,
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
                msg: (responseMessage.data.content.name == fileName) ? "Successfull File Created" : "Something Went Wrong",
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