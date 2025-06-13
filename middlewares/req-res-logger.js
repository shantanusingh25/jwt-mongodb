const fs = require("fs");
const os = require("os");
const colors = require("colors");

const requestLogger = (filepath) => {
  return (req, res, next) => {
    const startTime = Date.now();

    res.on("finish", () => {
      const duration = Date.now() - startTime;

      const logEntry = `
==============================================
🕒 Time:       ${new Date().toISOString()}
🌐 IP:         ${req.ip}
🔗 URL:        ${req.originalUrl}
📬 Method:     ${req.method}
🧾 Headers:    ${JSON.stringify(req.headers, null, 2)}
📦 Body:       ${JSON.stringify(req.body, null, 2)}
💻 OS:         ${os.platform()} | Host: ${os.hostname()}
📱 User-Agent: ${req.headers["user-agent"]}
🔑 User:       ${req.user ? req.user.id || req.user._id : "Unauthenticated"}
📤 Status:     ${res.statusCode}
⏱️ Duration:   ${duration} ms
==============================================
`;

      // Append log entry to file
      fs.appendFile(filepath, logEntry, (err) => {
        if (err) {
          console.error("Logging error:".bgWhite.red.bold, err.message);
        }
      });

      // Optional: console log
      console.log("✅ Request Logger middleware triggered".green.bold);
    });

    next();
  };
};

module.exports = requestLogger;
