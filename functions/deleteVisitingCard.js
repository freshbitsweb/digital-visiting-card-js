const axios = require("axios");
const base64 = require("base-64");

exports.handler = async function (event, context) {
    try {
        const eventBody = JSON.parse(event.body);
        const folderName = eventBody.folder_name;
        const fileName = eventBody.file_name;
        const sha = eventBody.sha;
        const data = JSON.stringify({
            "message": "delete the file",
            "sha": sha
        });

        const config = {
            method: 'delete',
            url: process.env.GITHUB_URL + '/js/' + folderName + '/' + fileName,
            headers: {
                'Authorization': 'Bearer ' + process.env.TOKEN,
                'Content-Type': 'application/json',
                'Accept': 'application/vnd.github.v3+json'
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
                msg: (responseMessage.status === 200) ? "Successfully File Deleted" : "Something Went Wrong",
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