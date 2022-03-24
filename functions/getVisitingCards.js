const axios = require("axios");
exports.handler = async function (event, context) {
    try {
        const response = JSON.parse(event.body);
        const folderName = response.folder_name ? response.folder_name : 'common';
        const config = {
            method: 'get',
            url: 'https://api.github.com/repos/misusonu18/digital-visiting-card-js/contents/js/' + folderName + '/',
            headers: {
                'Content-Type': 'application/json'
            }
        }

        return {
            statusCode: 200,
            body: JSON.stringify({
                data: await axios(config).then((res) => {
                    return res.data;
                }).catch((err) => {
                    return err;
                }),
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