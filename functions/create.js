const axios = require("axios");
exports.handler = async function (event, context) {
  try {
    var data = event.body;
    axios
      .put(
        "https://api.github.com/repos/misusonu18/digital-visiting-card-js/contents/js",
        JSON.stringify(data)
      )
      .then(function (res) {
        console.log(res);
      });

    return {
      statusCode: 200,
      body: JSON.stringify({
        msg: "Completed Successfully",
      }),
    };
  } catch (err) {
    console.log(err.message);

    return {
      statusCode: 500,
      body: JSON.stringify({
        msg: err.message,
      }),
    };
  }
};
