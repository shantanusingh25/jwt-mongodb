const fs = require('fs').promises; // ✅ use promise-based fs
const path = require('path');
const os = require('os');
const colors = require('colors');

const dbLogFilePath = path.join(__dirname, '/../logs/db.log.txt');
async function dbLog(filepath, message) {
    const hostname = os.hostname();
    const platform = os.platform();
    const date = new Date().toISOString();
    
    const logMessage = `${date} - ${message} - Hostname: ${hostname} - Platform: ${platform}\n`;
    

    try {
        await fs.appendFile(filepath, logMessage); // ✅ promise-based
        console.log(`DB Log: ${logMessage}`.green.bold.underline);
    } catch (error) {
        console.error(`Error writing to log file: ${error.message}`.bgWhite.red.bold.underline);
    }
}

module.exports = { dbLog, dbLogFilePath };