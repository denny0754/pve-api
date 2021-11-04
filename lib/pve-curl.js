const { Curl, curly } = require('node-libcurl');
// Stringify Utility
const queryString = require('node:querystring');
// Logging Library
const winston = require('winston');

const _logger = winston.createLogger({
    transports: [new winston.transports.Console({
        level: 'debug',
        format: winston.format.combine(winston.format.colorize(), winston.format.simple())
    })]
});

module.exports = function (verboseLevel) {

    var _loggerLevel = 'error';

    // Logging levels defined as of `RFC5424`
    // emerg: 0,  alert: 1,  crit: 2,  error: 3, 
    // warning: 4, notice: 5, info: 6, debug: 7
    switch (parseInt(verboseLevel)) {
        case 0: { _loggerLevel = 'error'; break; }
        case 1: { _loggerLevel = 'warning'; break; }
        case 2: { _loggerLevel = 'info'; break; }
        case 3: { _loggerLevel = 'debug'; break; }
        default: { _loggerLevel = 'error'; break; }
    }

    const _logger = winston.createLogger({
        levels: winston.config.syslog.levels,
        transports: [new winston.transports.Console({
            level: _loggerLevel,
            format: winston.format.combine(winston.format.colorize(), winston.format.simple())
        })]
    });

    if (verboseLevel === 'undefined' || verboseLevel === null || verboseLevel < 0) {
        _logger.pause();
    }

    let _GetFullEndpointUrl = (endpoint, route) => {
        if (route.startsWith('/')) {
            return `${endpoint}${route}`;
        } else {
            return `${endpoint}/${route}`;
        }
    };

    var _sslVerification = {
        sslVerifyHost: false,
        sslVerifyPeer: false
    };

    let _MakeRequest = (reqUrl, reqMethod, reqBody, reqHeader, reqCookie) => {
        _logger.debug(`Creating new request for: ${reqMethod} ${reqUrl}`);
        return new Promise((resolve, reject) => {
            const curlReq = new Curl();

            curlReq.setOpt(Curl.option.URL, reqUrl);

            curlReq.setOpt(Curl.option.SSL_VERIFYHOST, _sslVerification.sslVerifyHost);
            curlReq.setOpt(Curl.option.SSL_VERIFYPEER, _sslVerification.sslVerifyPeer);

            curlReq.setOpt(Curl.option.CUSTOMREQUEST, reqMethod)

            var sReqBody = null;
            var sReqHeader = null;
            var sReqCookie = null;

            if (typeof (reqBody) !== 'string') {
                sReqBody = queryString.stringify(reqBody);
            } else {
                sReqBody = reqBody;
            }

            if (typeof (reqHeader) !== 'string') {
                sReqHeader = queryString.stringify(reqBody);
            } else {
                sReqHeader = reqBody;
            }

            if (typeof (reqCookie) !== 'string') {
                sReqCookie = queryString.stringify(reqCookie);
            } else {
                sReqCookie = reqCookie;
            }

            if (sReqBody.length > 2) {
                curlReq.setOpt(Curl.option.POSTFIELDS, sReqBody);
            }

            if (sReqHeader.length > 2) {
                curlReq.setOpt(Curl.option.HEADER, sReqHeader);
            }

            if (sReqCookie.length > 2) {
                curlReq.setOpt(Curl.option.COOKIE, sReqCookie);
            }

            curlReq.on('end', (statusCode, body, header) => {
                curlReq.close();
                resolve({
                    statusCode: statusCode,
                    body: body,
                    header: header,
                    error: null,
                    errorCode: null
                });
            });

            curlReq.on('error', (error, errorCode) => {
                curlReq.close();
                resolve({
                    statusCode: null,
                    body: null,
                    header: null,
                    error: error,
                    errorCode: errorCode
                });
            });

            curlReq.perform();
        });
    };

    let Module = {

        PveCurl: {

            SetSslVerifyPeer: (sslVerifyPeer) => {
                _sslVerification.sslVerifyPeer = sslVerifyPeer;
            },

            SetSslVerifyHost: (sslVerifyHost) => {
                _sslVerification.sslVerifyHost = sslVerifyHost;
            },

            Get: async function (reqUrl, reqBody, reqHeader, reqCookie) {
                return await _MakeRequest(reqUrl, 'GET', reqBody, reqHeader, reqCookie);
            },

            Post: async function (reqUrl, reqBody, reqHeader, reqCookie) {
                return await _MakeRequest(reqUrl, 'POST', reqBody, reqHeader, reqCookie);
            },

            Put: async function(reqUrl, reqBody, reqHeader, reqCookie) {
                return await _MakeRequest(reqUrl, 'PUT', reqBody, reqHeader, reqCookie);
            },

            Delete: async function(reqUrl, reqBody, reqHeader, reqCookie) {
                return await _MakeRequest(reqUrl, 'DELETE', reqBody, reqHeader, reqCookie);
            }
        }
    };

    return Module;
};