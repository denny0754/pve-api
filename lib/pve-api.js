const { PveAuth } = require("./auth/pve-auth");

module.exports = function (uname, pwd, realm, host, verboseLevel) {
	const pveLog = require("./utils/logging")(verboseLevel);
	const pveCurl = require("./pve-curl")(verboseLevel);	

	var pveAuth = new PveAuth({
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

	let Module = {
		SetSslVerifyPeer: (sslVerifyPeer) => {
			pveLog.Info(`SSL Verify Peer set to ${sslVerifyPeer}`);
			pveCurl.PveCurl.SetSslVerifyPeer(sslVerifyPeer);
		},

		SetSslVerifyHost: (sslVerifyHost) => {
			pveLog.Info(`SSL Verify Host set to ${sslVerifyHost}`);
			pveCurl.PveCurl.SetSslVerifyHost(sslVerifyHost);
		},

		Access: async function () {
			return pveAccessApi;
		},

		Cluster: async function () {
			throw new Error("`/cluster` path not implemented.");
		},

		Nodes: async function () {
			return pveNodesApi;
		},

		Pools: async function () {
			return pvePoolsApi;
		},

		Storage: async function () {
			return pveStorageApi;
		},

		// Version: {
		// 	Get: async function () {
		// 		await _GenerateNewTicket();
		// 		return await pve_utils.PveCurl.Get(
		// 			`${pveAuthInfo.endpoint}/version`,
		// 			"",
		// 			"",
		// 			{ PVEAuthCookie: pveAuthInfo.apiTicket.ticket }
		// 		);
		// 	},
		// },
	};

	return Module;
};
