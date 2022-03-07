const axios = require("axios");
const btoa = require("btoa");

exports.handler = async function (event, context) {
	try {
		const { identity, user } = context.clientContext;
		var bearer = 'Bearer ' + identity.token
		console.log(event.body);
		console.log(JSON.parse(event.body));
		const d = new Date();
		let time = d.getTime();
		var data1 = JSON.parse(event.body);
		var data = JSON.stringify({
			"message": "created the file...",
			"content": btoa('hola'),
		});

		// let name = (data1.first_name).replace(" ", "_");
		let name = "hello";
		let fileName = name + time + ".json";

		var config = {
			method: 'put',
			url: 'https://api.github.com/repos/misusonu18/digital-visiting-card-js/contents/js/json/' + fileName,
			headers: {
				'Authorization': bearer,
				'Content-Type': 'application/json'
			},
			data: data
		}

		return {
			statusCode: 201,
			body: JSON.stringify({
				msg: await axios(config).then((res) => {
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
