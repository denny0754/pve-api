const { Curl, curly } = require("node-libcurl");

// Stringify Utility
const queryString = require("node:querystring");

module.exports = function (verboseLevel) {

	const logging = require("./utils/logging")(verboseLevel);

	let _GetFullEndpointUrl = (endpoint, route) => {
		if (route.startsWith("/")) {
			return `${endpoint}${route}`;
		} else {
			return `${endpoint}/${route}`;
		}
	};

	var sslVerification = {
		host: false,
		peer: false
	};

	var REQUEST_TYPE = {
		GET: "GET",
		POST: "POST",
		PUT: "PUT",
		DELETE: "DELETE",
	};

	let _MakeRequest = (reqUrl, reqMethod, reqBody, reqHeader, reqCookie) => {
		logging.Debug(`${reqMethod}: ${reqUrl}`);
		return new Promise((resolve, reject) => {
			const curlReq = new Curl();

			curlReq.setOpt(Curl.option.URL, reqUrl);

			curlReq.setOpt(
				Curl.option.SSL_VERIFYHOST,
				sslVerification.host
			);

			curlReq.setOpt(
				Curl.option.SSL_VERIFYPEER,
				sslVerification.peer
			);

			curlReq.setOpt(Curl.option.CUSTOMREQUEST, reqMethod);

			var sReqBody = null;
			var sReqHeader = null;
			var sReqCookie = null;

			if (typeof reqBody !== "string") {
				sReqBody = queryString.stringify(reqBody);
			} else {
				sReqBody = reqBody;
			}

			if (typeof reqHeader !== "string") {
				sReqHeader = queryString.stringify(reqBody);
			} else {
				sReqHeader = reqBody;
			}

			if (typeof reqCookie !== "string") {
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

			curlReq.on("end", (statusCode, body, header) => {
				curlReq.close();
				resolve({
					statusCode: statusCode,
					body: body,
					header: header,
					error: null,
					errorCode: null,
				});
			});

			curlReq.on("error", (error, errorCode) => {
				curlReq.close();
				resolve({
					statusCode: null,
					body: null,
					header: null,
					error: error,
					errorCode: errorCode,
				});
			});

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
				return await _MakeRequest(
					reqUrl,
					REQUEST_TYPE.GET,
					reqBody,
					reqHeader,
					reqCookie
				);
			},

			Post: async function (reqUrl, reqBody, reqHeader, reqCookie) {
				return await _MakeRequest(
					reqUrl,
					REQUEST_TYPE.POST,
					reqBody,
					reqHeader,
					reqCookie
				);
			},

			Put: async function (reqUrl, reqBody, reqHeader, reqCookie) {
				return await _MakeRequest(
					reqUrl,
					REQUEST_TYPE.PUT,
					reqBody,
					reqHeader,
					reqCookie
				);
			},

			Delete: async function (reqUrl, reqBody, reqHeader, reqCookie) {
				return await _MakeRequest(
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
