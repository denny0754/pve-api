const { Curl, curly } = require("node-libcurl");

// Stringify Utility
const queryString = require("node:querystring");

module.exports = function (verboseLevel) {

	const logging = require("./utils/logging")(verboseLevel);

	var options = {
		sslVerifyHost: false,
		sslVerifyPeer: false
	};

	const REQUEST_TYPE = {
		GET: "GET",
		POST: "POST",
		PUT: "PUT",
		DELETE: "DELETE"
	};

	let CreateNewRequest = (reqUrl, reqMethod, reqBody, reqHeader, reqCookie) => {
		logging.Debug(`${reqMethod}: ${reqUrl}`);
		return new Promise((resolve, reject) => {
			const curlReq = new Curl();

			// API URL
			curlReq.setOpt(Curl.option.URL, reqUrl);

			// SSL Host Verification
			curlReq.setOpt(Curl.option.SSL_VERIFYHOST, options.sslVerifyHost);

			// SSL Peer Verification
			curlReq.setOpt(Curl.option.SSL_VERIFYPEER, options.sslVerifyPeer);

			// Request Method
			curlReq.setOpt(Curl.option.CUSTOMREQUEST, reqMethod);

			// Stringify request data(Body, Header and Cookie)
			var sReqBody = (typeof reqBody !== "string") ? queryString.stringify(reqBody) : reqBody;
			var sReqHeader = (typeof reqHeader !== "string") ? queryString.stringify(reqHeader) : reqHeader;
			var sReqCookie = (typeof reqCookie !== "string") ? queryString.stringify(reqCookie) : reqCookie;

			// Set Post fields/data
			curlReq.setOpt(Curl.option.POSTFIELDS, sReqBody);

			// Header fields/data
			curlReq.setOpt(Curl.option.HEADER, sReqHeader);

			// Cookie fields/data
			curlReq.setOpt(Curl.option.COOKIE, sReqCookie);

			// On request success
			curlReq.on("end", (statusCode, body, header) => {
				curlReq.close();
				resolve({
					statusCode: statusCode,
					body: body,
					header: header,
					error: null,
					errorCode: null
				});
			});

			// On request failure/error
			curlReq.on("error", (error, errorCode) => {
				curlReq.close();
				resolve({
					statusCode: null,
					body: null,
					header: null,
					error: error,
					errorCode: errorCode
				});
			});

			// Committing the request
			curlReq.perform();
		});
	};

	let Module = {
		PveCurl: {
			SetSslVerifyPeer: (sslVerifyPeer) => {
				sslVerification.peer = sslVerifyPeer;
			},

			SetSslVerifyHost: (sslVerifyHost) => {
				sslVerification.host = sslVerifyHost;
			},

			Get: async function (reqUrl, reqBody, reqHeader, reqCookie) {
				return await CreateNewRequest(
					reqUrl,
					REQUEST_TYPE.GET,
					reqBody,
					reqHeader,
					reqCookie
				);
			},

			Post: async function (reqUrl, reqBody, reqHeader, reqCookie) {
				return await CreateNewRequest(
					reqUrl,
					REQUEST_TYPE.POST,
					reqBody,
					reqHeader,
					reqCookie
				);
			},

			Put: async function (reqUrl, reqBody, reqHeader, reqCookie) {
				return await CreateNewRequest(
					reqUrl,
					REQUEST_TYPE.PUT,
					reqBody,
					reqHeader,
					reqCookie
				);
			},

			Delete: async function (reqUrl, reqBody, reqHeader, reqCookie) {
				return await CreateNewRequest(
					reqUrl,
					REQUEST_TYPE.DELETE,
					reqBody,
					reqHeader,
					reqCookie
				);
			},
		},
	};

	return Module;
};
