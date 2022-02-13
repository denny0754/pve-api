const { PveAuth } = require("./auth/pve-auth");

module.exports = function (uname, pwd, realm, host, verboseLevel) {
	const pveCurl = require("./pve-curl")(verboseLevel);
	const pveLog = require("./utils/logging")(verboseLevel);	

	var pveAuth = new PveAuth({
		uname: uname,
		pwd: pwd,
		realm: realm,
		host: host,
		verboseLevel: verboseLevel
	});

	if (
		typeof uname === "undefined" ||
		uname === null ||
		typeof pwd === null ||
		pwd === null ||
		typeof realm === "undefined" ||
		realm === null ||
		typeof host === "undefined" ||
		host === null
	) {
		pveAuth = null;
	}
	
	if(pveAuth === null) {
		throw new Error("Authentication failure: some properties are missing");
	}

	let Module = {
		SetSslVerifyPeer: (sslVerifyPeer) => {
			pveLog.Info(`SSL Verify Peer set to ${sslVerifyPeer}`);
			pveCurl.PveCurl.SetSslVerifyPeer(sslVerifyPeer);
		},

		SetSslVerifyHost: (sslVerifyHost) => {
			pveLog.Info(`SSL Verify Host set to ${sslVerifyHost}`);
			pveCurl.PveCurl.SetSslVerifyHost(sslVerifyHost);
		},

		SetAuthenticator: (authenticator) => {
			pveAuth = authenticator;
		},

		Get: async function (storageType) {
			var reqBody = {};
			if (storageType !== "") {
				reqBody = { type: storageType };
			}
			return await pveCurl.PveCurl.Get(
				`${pveAuth.GetEndpoint()}/storage`,
				reqBody,
				{},
				{ PVEAuthCookie: pveAuth.GetAuthCookie() }
			);
		},

		Post: async function (params) {
			var reqBody = params;

			return await pveCurl.PveCurl.Post(
				`${pveAuth.GetEndpoint()}/storage`,
				reqBody,
				{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
				{ PVEAuthCookie: pveAuth.GetAuthCookie() }
			);
		},

		Storage: function (storage) {
			return {
				Get: async function () {
					return await pveCurl.PveCurl.Get(
						`${pveAuth.GetEndpoint()}/storage/${storage}`,
						{},
						{},
						{ PVEAuthCookie: pveAuth.GetAuthCookie() }
					);
				},

				Put: async function (params) {
					return await pveCurl.PveCurl.Put(
						`${pveAuth.GetEndpoint()}/storage/${storage}`,
						params,
						{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
						{ PVEAuthCookie: pveAuth.GetAuthCookie() }
					);
				},

				Delete: async function (params) {
					return await pveCurl.PveCurl.Delete(
						`${pveAuth.GetEndpoint()}/storage/${storage}`,
						params,
						{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
						{ PVEAuthCookie: pveAuth.GetAuthCookie() }
					);
				},
			};
		},
	};

	return Module;
};
