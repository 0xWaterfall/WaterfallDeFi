const fs = require("fs");

(async () => {
  try {
    const messagesJson = fs.readFileSync("i18n/messages.json", "utf-8");

    if (messagesJson) {
      const messages = JSON.parse(messagesJson);
      const arr = Object.keys(messages).map((p) => ({
        id: p,
        defaultMessage: messages[p]
      }));
      fs.writeFileSync("i18n/messages.json", JSON.stringify(arr), (err) => {
        if (err) throw new Error(err);

        console.log("🚀🚀🚀 Transform successfully");
      });
    }
  } catch (error) {
    console.log(error);
  }
})();
