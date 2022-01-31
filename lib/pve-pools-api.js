// Logging Library
const winston = require("winston");

module.exports = function (uname, pwd, realm, host, verboseLevel) {
	const pve_utils = require("./pve-curl")(verboseLevel);

	const logging = require("./utils/logging")(verboseLevel);

	const pveAuth = require("./pve-auth")(uname, pwd, realm, host);

	let Module = {
		SetSslVerifyPeer: (sslVerifyPeer) => {
			logging.Info(`SSL Verify Peer set to ${sslVerifyPeer}`);
			pve_utils.PveCurl.SetSslVerifyPeer(sslVerifyPeer);
		},

		SetSslVerifyHost: (sslVerifyHost) => {
			logging.Info(`SSL Verify Host set to ${sslVerifyHost}`);
			pve_utils.PveCurl.SetSslVerifyHost(sslVerifyHost);
		},

		Get: async function (poolid) {
			await pveAuth.GenerateTicket();

			var reqBody = {
				poolid: poolid,
			};

			return await pve_utils.PveCurl.Get(
				`${pveAuthInfo.endpoint}/pools`,
				reqBody,
				{},
				{ PVEAuthCookie: pveAuth.GetAuthCookie() }
			);
		},

		Post: async function (params) {
			await pveAuth.GenerateTicket();

			var reqBody = params;

			return await pve_utils.PveCurl.Post(
				`${pveAuthInfo.endpoint}/pools`,
				reqBody,
				{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
				{ PVEAuthCookie: pveAuth.GetAuthCookie() }
			);
		},

		PoolID: function (poolid) {
			return {
				Get: async function () {
					await pveAuth.GenerateTicket();

					return await pve_utils.PveCurl.Get(
						`${pveAuthInfo.endpoint}/pools/${poolid}`,
						{},
						{},
						{ PVEAuthCookie: pveAuth.GetAuthCookie() }
					);
				},

				Put: async function (params) {
					await pveAuth.GenerateTicket();

					return await pve_utils.PveCurl.Put(
						`${pveAuthInfo.endpoint}/pools/${poolid}`,
						params,
						{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
						{ PVEAuthCookie: pveAuth.GetAuthCookie() }
					);
				},

				Delete: async function (params) {
					await pveAuth.GenerateTicket();

					return await pve_utils.PveCurl.Delete(
						`${pveAuthInfo.endpoint}/pools/${poolid}`,
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