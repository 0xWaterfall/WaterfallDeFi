const API_TOKEN = "818b37ffb0fe8996dbe47ed9bffe9f7b";
const APP_ID = 457651;
const exec = require("child_process").exec;

let outputPath = "public/i18n";
const outputArgIndex = process.argv.findIndex((arg) => arg === "-o");
if (outputArgIndex !== -1) {
  outputPath = process.argv[outputArgIndex + 1];
}

(async () => {
  try {
    await new Promise((resolve, reject) =>
      exec(`mkdir -p public/i18n && mkdir -p i18n/download`, (err) => {
        if (err) return reject(err);
        resolve();
      })
    );

    const result = await new Promise((resolve, reject) => {
      exec(
        `curl -X POST https://api.poeditor.com/v2/languages/list -d api_token="${API_TOKEN}" -d id="${APP_ID}"`,
        (err, stdout) => {
          const response = JSON.parse(stdout);

          if (err) return reject(err);

          if (response.response.status === "fail")
            return reject(response.response.message);

          resolve(response.result);
        }
      );
    });

    const locales = result.languages.map(({ code }) => code);

    await new Promise((resolve, reject) =>
      exec(
        `echo '${JSON.stringify(locales)}' > public/i18n/languages.json`,
        (err, stdout) => {
          if (err) return reject(err);
          console.log("🚀🚀🚀 Dowload languages successfully");
          resolve();
        }
      )
    );

    const downloadConf = await Promise.all(
      locales.map((locale) => {
        return new Promise((resolve, reject) => {
          exec(
            `curl -X POST https://api.poeditor.com/v2/projects/export -d api_token="${API_TOKEN}" -d id="${APP_ID}" -d language="${locale}" -d type="po"`,
            (err, stdout) => {
              if (err) return reject(err);

              resolve({ ...JSON.parse(stdout).result, locale });
            }
          );
        });
      })
    );

    await Promise.all(
      downloadConf.map(({url,locale}) => {
        return new Promise((resolve, reject) => {
          exec(
            `curl ${url} --output i18n/download/${locale}.po`,
            (err, stdout) => {
              if (err) return reject(err);

              console.log(`🚀🚀🚀 Dowload ${locale} successfully`);
              resolve();
            }
          );
        });
      })
    );

    await new Promise((resolve, reject) =>
      exec(
        `react-intl-po po2json 'i18n/download/*.po' -m 'i18n/**/*.json' -o '${outputPath}'`,
        (err, stdout) => {
          if (err) return reject(err);
          resolve();
        }
      )
    );
  } catch (error) {
    console.error(error);
  }
})();
