const axios = require("axios");
const base64 = require("base-64");

exports.handler = async function (event, context) {
    try {
        let response = JSON.parse(event.body);
        var folderName = response.folder_name;
        var fileName = response.file_name;
        var sha = response.sha;
        var data = JSON.stringify({
            "message": "delete the file",
            "sha": sha
        });

        var config = {
            method: 'delete',
            url: 'https://api.github.com/repos/misusonu18/digital-visiting-card-js/contents/js/' + folderName + '/' + fileName,
            headers: {
                'Authorization': 'Bearer ' + process.env.TOKEN,
                'Content-Type': 'application/json',
            },
            data: data
        }

        var responseMessage;

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
                msg: (responseMessage.status === 200) ? "Successfull File Deleted" : "Something Went Wrong",
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