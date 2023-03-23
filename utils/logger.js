const {
    createLogger,
    format,
    transports
} = require('winston');
const {
    combine,
    timestamp,
    prettyPrint
} = format;

const logger = createLogger({
    level: 'info',
    format: combine(
        timestamp({
            format: 'DD-MM-YYY HH:mm:ss'
        }),
        prettyPrint()
    ),
    transports: [
        new transports.File({
            filename: 'utils/logs/errors.log',
            level: 'error'
        }), // Write all logs with importance level of `error` or less to `error.log`
        new transports.File({
            filename: 'utils/logs/combined.log',
        }), // Write all logs with importance level of `info` or less to `combined.log`
    ]
});

module.exports = logger;