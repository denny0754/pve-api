const { Curl, curly } = require('node-libcurl');
// Stringify Utility
const queryString = require('node:querystring');
// Logging Library
const winston = require('winston');

module.exports = function (uname, pwd, realm, host) {

    const logger = winston.createLogger({
        transports: [new winston.transports.Console({
            level: 'debug',
            format: winston.format.combine(winston.format.colorize(), winston.format.simple())
        })]
    });

    // Authentication Info
    var pveAuthInfo = {};
    pveAuthInfo.username = uname;
    pveAuthInfo.password = pwd;
    pveAuthInfo.realm = realm;
    pveAuthInfo.host = host;
    pveAuthInfo.accessTicket = {
        token: '',
        pveAuth: '',
        timeStamp: 0
    };
    pveAuthInfo.endpoint = `https://${pveAuthInfo.host}:8006/api2/json`;


    let CurlReq = {

        Get: async function (url, data, verifyHost, verifyPeer) {
            const curlInstance = new Curl();

            curlInstance.setOpt(Curl.option.SSL_VERIFYHOST, verifyHost);
            curlInstance.setOpt(Curl.option.SSL_VERIFYPEER, verifyPeer);

            curlInstance.setOpt(Curl.option.URL, url);
            curlInstance.setOpt(Curl.option.CUSTOMREQUEST, 'GET');

            curlInstance.setOpt(Curl.option.POSTFIELDS, queryString.stringify(data));

            logger.debug(queryString.stringify(data));

            return new Promise((resolve, reject) => {
                try {
                    curlInstance.on('end', function (statusCode, body, header) {
                        this.close();
                        resolve({ statusCode: statusCode, body: body, header: header });
                    });

                    curlInstance.on('error', function (error, errorCode) {
                        this.close();
                        resolve({ error: error, errorCode: errorCode });
                    });

                    curlInstance.perform();
                } catch (e) {
                    reject(e);
                }
            })
        },

        Post: function (url, data, verifyHost, verifyPeer) {
            const curlInstance = new Curl();

            curlInstance.setOpt(Curl.option.SSL_VERIFYHOST, verifyHost);
            curlInstance.setOpt(Curl.option.SSL_VERIFYPEER, verifyPeer);

            curlInstance.setOpt(Curl.option.URL, url);
            curlInstance.setOpt(Curl.option.POST, true);

            curlInstance.setOpt(Curl.option.POSTFIELDS, queryString.stringify(data));

            curlInstance.setOpt(Curl.option.VERBOSE, false);

            return new Promise(
                (resolve, reject) => {
                    try {
                        curlInstance.on('end', function (statusCode, body, header) {
                            this.close();
                            resolve({ statusCode: statusCode, body: JSON.parse(body), header: header });
                        });

                        curlInstance.on('error', function (error, errorCode) {
                            this.close();
                            resolve({ error: error, errorCode: errorCode });
                        });

                        curlInstance.perform();

                    } catch (e) {
                        reject(e);
                    }
                }
            );
        }
    };

    let Module = {
        GenerateTicket: async function () {

            return new Promise(async (resolve, reject) => {

                if (pveAuthInfo.accessTicket.timeStamp === 0 || pveAuthInfo.accessTicket.timeStamp + 7200 > new Date().getTime()) {
                    var postUrl = `${pveAuthInfo.endpoint}/access/ticket`;
                    var postData = {
                        username: `${pveAuthInfo.username}@${pveAuthInfo.realm}`,
                        password: pveAuthInfo.password
                    };
                    var response = await CurlReq.Post(postUrl, postData);

                    if (response.statusCode === 200) {
                        pveAuthInfo.accessTicket.token = response.body.data.ticket;
                        pveAuthInfo.accessTicket.pveAuth = response.body.data.CSRFPreventionToken;
                        pveAuthInfo.accessTicket.timeStamp = new Date().getTime();
                        console.log(pveAuthInfo);
                        resolve({ statusCode: response.statusCode })
                    } else {
                        resolve(response);
                    }
                }
            });
        },

        GetContainerStatus: async function (node, vmid) {
            await this.GenerateTicket();

            var postUrl = `${pveAuthInfo.endpoint}/nodes/${node}/lxc/${vmid}/status/current`;
            var postData = {
                PVEAuthCookie: pveAuthInfo.accessTicket.token,
            };
            var response = await CurlReq.Get(postUrl, postData);
            console.log(response);
        }
    };

    return Module;
}