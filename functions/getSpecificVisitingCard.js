const axios = require("axios");

exports.handler = async function (event, context) {
    try {
        const eventBody = JSON.parse(event.body);
        const fileName = eventBody.file_name;
        const folderName = eventBody.folder_name;
        const config = {
            method: 'get',
            url: process.env.GITHUB_URL + '/js/' + folderName + '/' + fileName,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/vnd.github.v3+json'
            }
        }

        return {
            statusCode: 200,
            body: JSON.stringify({
                data: await axios(config).then((response) => {
                    return response.data;
                }).catch((error) => {
                    return error;
                }),
            }),
        };
    } catch (error) {
        return {
            statusCode: 404,
            body: JSON.stringify({
                msg: error.message,
            }),
        };
    }
};
