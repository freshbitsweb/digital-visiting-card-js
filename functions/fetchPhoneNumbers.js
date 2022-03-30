
const axios = require("axios");
exports.handler = async function (event, context) {
    try {
        const config = {
            method: 'get',
            url: process.env.GITHUB_URL + '/js/validate_phone_numbers.json',
            headers: {
                'Content-Type': 'application/json'
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
    } catch (err) {
        return {
            statusCode: 404,
            body: JSON.stringify({
                msg: err.message,
            }),
        };
    }
};
