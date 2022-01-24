const rp = require("request-promise");

function getCurrenciesListFromCMC(params) {
  return new Promise((resolve, reject) => {
    const requestOptions = {
      method: "GET",
      uri: process.env.CMC_BASE_URL + "cryptocurrency/listings/latest",
      qs: {
        start: params.start,
        limit: params.limit,
        convert: params.convert,
      },
      headers: {
        "X-CMC_PRO_API_KEY": process.env.CMC_API_KEY,
      },
      json: true,
      gzip: true,
    };

    rp(requestOptions)
      .then((response) => {
        resolve(response);
      })
      .catch((err) => {
        reject(err.message);
      });
  });
}

module.exports = getCurrenciesListFromCMC;
