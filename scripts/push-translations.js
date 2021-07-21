const API_TOKEN = "818b37ffb0fe8996dbe47ed9bffe9f7b";
const APP_ID = 457651;
const exec = require("child_process").exec;

(async () => {
  try {
    await new Promise((resolve, reject) => {
      exec(
        `
        curl -X POST https://api.poeditor.com/v2/projects/upload \
             -F api_token="${API_TOKEN}" \
             -F id="${APP_ID}" \
             -F language="en" \
             -F updating="terms_translations" \
             -F file=@"i18n/messages.pot" \
             -F tags="{\"obsolete\":\"removed-strings\"}"
        `,
        (err, stdout) => {
          if (err) return reject(err);

          const response = JSON.parse(stdout);

          if (response.response.status === "fail") {
            return reject(response.response.message);
          }
          if (response.response.status === "success") {
            console.log("🚀🚀🚀 Push i18n file successfully");
          }

          resolve(response.result);
        }
      );
    });
  } catch (error) {
    console.error(error);
  }
})();
