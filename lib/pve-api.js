const { PveAuth } = require("./auth/pve-auth");

module.exports = function (uname, pwd, realm, host, verboseLevel) {
	const pveLog = require("./utils/logging")(verboseLevel);
	const pveCurl = require("./pve-curl")(verboseLevel);

	const pveAuth = new PveAuth({
		uname: uname,
		pwd: pwd,
		realm: realm,
		host: host,
		verboseLevel: verboseLevel,
	});

	const pveStorageApi = require("./pve-storage-api")(
		uname,
		pwd,
		realm,
		host,
		verboseLevel
	);
	const pvePoolsApi = require("./pve-pools-api")(
		uname,
		pwd,
		realm,
		host,
		verboseLevel
	);
	const pveNodesApi = require("./pve-nodes-api")(
		uname,
		pwd,
		realm,
		host,
		verboseLevel
	);
	const pveAccessApi = require("./pve-access-api")(
		uname,
		pwd,
		realm,
		host,
		verboseLevel
	);

	// Initializing PveAuth class for all sub-modules
	pveStorageApi.SetAuthenticator(pveAuth);
	pvePoolsApi.SetAuthenticator(pveAuth);
	pveNodesApi.SetAuthenticator(pveAuth);
	pveAccessApi.SetAuthenticator(pveAuth);

	let Module = {
		SetSslVerifyPeer: (sslVerifyPeer) => {
			pveLog.Info(`SSL Verify Peer set to ${sslVerifyPeer}`);
			pveCurl.PveCurl.SetSslVerifyPeer(sslVerifyPeer);
		},

		SetSslVerifyHost: (sslVerifyHost) => {
			pveLog.Info(`SSL Verify Host set to ${sslVerifyHost}`);
			pveCurl.PveCurl.SetSslVerifyHost(sslVerifyHost);
		},

		Access: pveAccessApi,

		Cluster: null,

		Nodes: pveNodesApi,

		Pools: pvePoolsApi,

		Storage: pveStorageApi,

		Version: {
			Get: async function () {
				return await pveCurl.PveCurl.Get(
					`${pveAuth.GetEndpoint()}/version`,
					"",
					"",
					{ PVEAuthCookie: pveAuth.GetAuthCookie() }
				);
			},
		},
	};

	return Module;
};
