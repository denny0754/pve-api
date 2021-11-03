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

module.exports = function () {
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

    //TODO: adapt this function so that it can be used by all request methods(GET, POST, PUT & DELETE).
    let _MakeRequest = (reqMethod, reqUrl, reqHeader, reqBody, reqCookie) => {
        return new Promise((resolve, reject) => {
            try {
                const curlReq = new Curl();

                // Full endpoint URL => https://${host}:8006/api2/json/${route}
                curlReq.setOpt(Curl.option.URL, reqUrl);

                // SSL Verifications
                curlReq.setOpt(Curl.option.SSL_VERIFYHOST, _sslVerification.sslVerifyHost);
                curlReq.setOpt(Curl.option.SSL_VERIFYPEER, _sslVerification.sslVerifyPeer);

                // Request Method
                // Supported Method: GET, POST, PUT, DELETE
                curlReq.setOpt(Curl.option.CUSTOMREQUEST, reqMethod);

                curlReq.setOpt(Curl.option.COOKIE, queryString.stringify(reqCookie));

                curlReq.setOpt(Curl.option.POSTFIELDS, queryString.stringify(reqBody));

                curlReq.setOpt(Curl.option.HEADER, queryString.stringify(reqHeader));

                curlReq.on('end', (statusCode, body, header) => {
                    resolve({
                        statusCode: statusCode,
                        body: body,
                        header: header,
                        error: null,
                        errorCode: null
                    });
                });

                curlReq.on('error', (error, errorCode) => {
                    resolve({
                        statusCode: null,
                        body: null,
                        header: null,
                        error: error,
                        errorCode: errorCode
                    });
                });

                curlReq.perform();

            } catch (err) {
                resolve({
                    statusCode: null,
                    body: null,
                    header: null,
                    error: err,
                    errorCode: 1
                })
            };
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

            Get: function (route, auth, ticket, body, header) {
                header.CSRFPreventionToken = ticket.csrfPreventionToken;

                body.username = auth.username;
                body.password = auth.password;

                var cookie = {
                    PVEAuthCookie: ticket.ticket
                };

                return _MakeRequest('GET', _GetFullEndpointUrl(auth.endpoint, route), header, body, cookie);
            },

            Post: function (route, auth, ticket, body, header) {
                header.CSRFPreventionToken = ticket.csrfPreventionToken;
                if (body === null) {
                    body = {};
                }

                if (ticket.csrfPreventionToken === '') {
                    body.username = auth.username;
                    body.password = auth.password;
                }

                var cookie = {
                    PVEAuthCookie: ticket.ticket
                };

                return _MakeRequest('POST', _GetFullEndpointUrl(auth.endpoint, route), header, body, cookie);
            },
        }
    };

    return Module;
};