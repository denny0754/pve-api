const winston = require("winston");

module.exports = function (level) {
	var _loggerLevel = "error";
	
	// Logging levels defined as of `RFC5424`
	// emerg: 0,  alert: 1,  crit: 2,  error: 3,
	// warning: 4, notice: 5, info: 6, debug: 7
	// Set `level` to 0 if not defined
	if(level === null) {
		level = 0;
	}

	switch (parseInt(level)) {
		case 0: {
			_loggerLevel = "error";
			break;
		}
		case 1: {
			_loggerLevel = "warning";
			break;
		}
		case 2: {
			_loggerLevel = "info";
			break;
		}
		case 3: {
			_loggerLevel = "debug";
			break;
		}
		default: {
			_loggerLevel = "error";
			break;
		}
	}

	const _logger = winston.createLogger({
		levels: winston.config.syslog.levels,
		transports: [
			new winston.transports.Console({
				level: _loggerLevel,
				format: winston.format.combine(
					winston.format.colorize(),
					winston.format.simple()
				),
			}),
		],
	});

	if (level === "undefined" || level === null || level < 0) {
		_logger.pause();
	}

	var _Module = {
		Log: function(level, message) {
			_logger.log(level, message);
		},

		Critical: function(message) {
			_logger.crit(message)
		},

		Error: function(message) {
			_logger.error(message);
		},

		Warning: function(message) {
			_logger.warn(message);
		},

		Info: function(message) {
			_logger.info(message);
		},

		Debug: function(message) {
			_logger.debug(message);
		}
	};

	return _Module;
};
