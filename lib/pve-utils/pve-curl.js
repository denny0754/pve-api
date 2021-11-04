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

    let _MakeRequest = (reqUrl, reqMethod, reqBody, reqHeader, reqCookie) => {
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
                // return new Promise((resolve, reject) => {
                //     const curlReq = new Curl();

                //     curlReq.setOpt(Curl.option.URL, reqUrl);

                //     curlReq.setOpt(Curl.option.SSL_VERIFYHOST, _sslVerification.sslVerifyHost);
                //     curlReq.setOpt(Curl.option.SSL_VERIFYPEER, _sslVerification.sslVerifyPeer);

                //     var sReqBody = null;
                //     var sReqHeader = null;
                //     var sReqCookie = null;

                //     if (typeof (reqBody) !== 'string') {
                //         sReqBody = queryString.stringify(reqBody);
                //     } else {
                //         sReqBody = reqBody;
                //     }

                //     if (typeof (reqHeader) !== 'string') {
                //         sReqHeader = queryString.stringify(reqBody);
                //     } else {
                //         sReqHeader = reqBody;
                //     }

                //     if (typeof (reqCookie) !== 'string') {
                //         sReqCookie = queryString.stringify(reqCookie);
                //     } else {
                //         sReqCookie = reqCookie;
                //     }

                //     if (sReqBody.length > 2) {
                //         curlReq.setOpt(Curl.option.POSTFIELDS, sReqBody);
                //     }

                //     if (sReqHeader.length > 2) {
                //         curlReq.setOpt(Curl.option.HEADER, sReqHeader);
                //     }

                //     if (sReqCookie.length > 2) {
                //         curlReq.setOpt(Curl.option.COOKIE, sReqCookie);
                //     }

                //     curlReq.on('end', (statusCode, body, header) => {
                //         curlReq.close();
                //         resolve({
                //             statusCode: statusCode,
                //             body: body,
                //             header: header,
                //             error: null,
                //             errorCode: null
                //         });
                //     });

                //     curlReq.on('error', (error, errorCode) => {
                //         curlReq.close();
                //         resolve({
                //             statusCode: null,
                //             body: null,
                //             header: null,
                //             error: error,
                //             errorCode: errorCode
                //         });
                //     });

                //     curlReq.perform();
                // });
            },

            Post: async function (reqUrl, reqBody, reqHeader, reqCookie) {
                return await _MakeRequest(reqUrl, 'POST', reqBody, reqHeader, reqCookie);

                // return new Promise((resolve, reject) => {
                //     const curlReq = new Curl();

                //     curlReq.setOpt(Curl.option.URL, reqUrl);

                //     curlReq.setOpt(Curl.option.SSL_VERIFYHOST, _sslVerification.sslVerifyHost);
                //     curlReq.setOpt(Curl.option.SSL_VERIFYPEER, _sslVerification.sslVerifyPeer);

                //     var sReqBody = null;
                //     var sReqHeader = null;
                //     var sReqCookie = null;

                //     if (typeof (reqBody) !== 'string') {
                //         sReqBody = queryString.stringify(reqBody);
                //     } else {
                //         sReqBody = reqBody;
                //     }

                //     if (typeof (reqHeader) !== 'string') {
                //         sReqHeader = queryString.stringify(reqBody);
                //     } else {
                //         sReqHeader = reqBody;
                //     }

                //     if (typeof (reqCookie) !== 'string') {
                //         sReqCookie = queryString.stringify(reqCookie);
                //     } else {
                //         sReqCookie = reqCookie;
                //     }

                //     if (sReqBody.length > 2) {
                //         curlReq.setOpt(Curl.option.POSTFIELDS, sReqBody);
                //     }

                //     if (sReqHeader.length > 2) {
                //         curlReq.setOpt(Curl.option.HEADER, sReqHeader);
                //     }

                //     if (sReqCookie.length > 2) {
                //         curlReq.setOpt(Curl.option.COOKIE, sReqCookie);
                //     }

                //     curlReq.on('end', (statusCode, body, header) => {
                //         curlReq.close();
                //         resolve({
                //             statusCode: statusCode,
                //             body: body,
                //             header: header,
                //             error: null,
                //             errorCode: null
                //         });
                //     });

                //     curlReq.on('error', (error, errorCode) => {
                //         curlReq.close();
                //         resolve({
                //             statusCode: null,
                //             body: null,
                //             header: null,
                //             error: error,
                //             errorCode: errorCode
                //         });
                //     });

                //     curlReq.perform();
                // });
            }
        }
    };

    return Module;
};