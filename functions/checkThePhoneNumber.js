const axios = require("axios");
exports.handler = async function (event, context) {
    try {
        let response = JSON.parse(event.body);
        var config = {
            method: 'get',
            url: 'https://api.github.com/repos/misusonu18/digital-visiting-card-js/contents/js/phone_number.json',
            headers: {
                'Authorization': 'Bearer ' + process.env.TOKEN,
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