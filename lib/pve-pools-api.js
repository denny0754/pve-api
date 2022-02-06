const { PveAuth } = require("./auth/pve-auth");

module.exports = function (uname, pwd, realm, host, verboseLevel) {
	const pveCurl = require("./pve-curl")(verboseLevel);
	const pveLog = require("./utils/logging")(verboseLevel);	

	var pveAuth = null;

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
	} else {
		pveAuth = new PveAuth({
			uname: uname,
			pwd: pwd,
			realm: realm,
			host: host,
			verboseLevel: verboseLevel,
		});	
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

		Get: async function (poolid) {
			var reqBody = {
				poolid: poolid,
			};

			return await pve_utils.PveCurl.Get(
				`${pveAuth.GetEndpoint()}/pools`,
				reqBody,
				{},
				{ PVEAuthCookie: pveAuth.GetAuthCookie() }
			);
		},

		Post: async function (params) {
			var reqBody = params;

			return await pve_utils.PveCurl.Post(
				`${pveAuth.GetEndpoint()}/pools`,
				reqBody,
				{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
				{ PVEAuthCookie: pveAuth.GetAuthCookie() }
			);
		},

		PoolID: function (poolid) {
			return {
				Get: async function () {
					return await pve_utils.PveCurl.Get(
						`${pveAuth.GetEndpoint()}/pools/${poolid}`,
						{},
						{},
						{ PVEAuthCookie: pveAuth.GetAuthCookie() }
					);
				},

				Put: async function (params) {
					return await pve_utils.PveCurl.Put(
						`${pveAuth.GetEndpoint()}/pools/${poolid}`,
						params,
						{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
						{ PVEAuthCookie: pveAuth.GetAuthCookie() }
					);
				},

				Delete: async function (params) {
					return await pve_utils.PveCurl.Delete(
						`${pveAuth.GetEndpoint()}/pools/${poolid}`,
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
