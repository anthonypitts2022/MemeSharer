const { addColors, createLogger, format, transports } = require("winston");
const morgan = require("morgan");
const fs = require("fs");
const path = require("path");
const rootPath = require("app-root-path");
const logDir = rootPath + "/log";
const env = process.env.NODE_ENV || "development";

// Create the log directory if it does not exist
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

// Set the log file
const logPaths = {
  app: path.join(logDir, "app.log"),
  http: path.join(logDir, "http.log")
};


// Set custom level logging
const myCustomLevels = {
  levels: {
    error: 0,
    warn: 1,
    access: 2,
    silly: 3,
    info: 4,
    debug: 5
  },
  colors: {
    error: "red",
    warn: "yellow",
    access: "green",
    silly: "grey",
    info: "blue",
    debug: "magenta"
  }
};

// Enable the ability to add colors
addColors(myCustomLevels.colors);

// Sets the formats
const defaultFormat = format.combine(
  format.timestamp({
    format: "YYYY-MM-DD HH:mm:ss"
  }),
  format.simple(),
  format.colorize(),
  format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
);

const logger = createLogger({
  levels: myCustomLevels.levels,
  format: defaultFormat,
  // You can also comment out the line above and uncomment the line below for JSON format
  // format: format.json(),
  transports: [
    // If the environment is set to development then log to console
    // If it's not then log to the file
    env == "development"
      ? new transports.Console({
          level: "debug",
          format: defaultFormat
        })
      : new transports.File({
          level: "info",
          filename: logPaths.app,
          format: defaultFormat
        })
  ]
});

const httpLog = app => {
  // create a write stream (in append mode)
  //Make sure the file with read write access (chmod 777 specially for linux)
  const accessLogStream = fs.createWriteStream(logPaths.http, { flags: "a" });

  // setup the logger
  app.use(morgan("combined", { stream: accessLogStream }));
};
module.exports = { logger, httpLog };
