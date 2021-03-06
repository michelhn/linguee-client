const axios = require("axios-https-proxy-fix");
const iconv = require("iconv-lite");
const langs = require("./utils/langs");
const endpoint = require("./utils/endpoint");
const ExtractorsFactory = require("./extractors/ExtractorsFactory");

const linguee = (function () {
  return {
    translate(term, fromLang, toLang, proxy) {
      try {
        const url = endpoint.createSearchUrl(term, fromLang, toLang);

        return new Promise((resolve, reject) => {

          axios
            .get(url,
              { 
                responseType: "arraybuffer",
                proxy: proxy
              }
            )
            .then(response => {
              const responseCharset = response.headers['content-type'].match(/.+charset="(?<charset>.*)"$/).groups.charset;

              const data = iconv.decode(
                Buffer.from(response.data),
                iconv.encodingExists(responseCharset) ? responseCharset : "utf-8"
              );

              try {
                const extractor = ExtractorsFactory.create("linguee");
                const $ = cheerio.load(
                  `<div id="extractor-wrapper">${data}</div>`
                );

                const result = extractor.run($("#extractor-wrapper"));

                result.from = langs.get(fromLang).code;
                result.to = langs.get(toLang).code;

                return resolve(result);
              } catch (error) {
                reject(error);
              }
            })
            .catch(error => {
              reject(error);
            });
        });
      } catch (error) {
        return Promise.reject(error);
      }
    },
    langs: langs
  };
})();

module.exports = linguee;
