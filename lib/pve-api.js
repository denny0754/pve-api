module.exports = function (uname, pwd, realm, host, verboseLevel) {
	const pve_utils = require("./pve-curl")(verboseLevel);
	const _pveStorageApi = require("./pve-storage-api")(
		uname,
		pwd,
		realm,
		host,
		verboseLevel
	);
	const _pvePoolsApi = require("./pve-pools-api")(
		uname,
		pwd,
		realm,
		host,
		verboseLevel
	);
	const _pveNodesApi = require("./pve-nodes-api")(
		uname,
		pwd,
		realm,
		host,
		verboseLevel
	);
	const _pveAccessApi = require("./pve-access-api")(
		uname,
		pwd,
		realm,
		host,
		verboseLevel
	);

	const logging = require("./utils/logging")(verboseLevel);

	let Module = {
		SetSslVerifyPeer: (sslVerifyPeer) => {
			logging.Info(`SSL Verify Peer set to ${sslVerifyPeer}`);
			pve_utils.PveCurl.SetSslVerifyPeer(sslVerifyPeer);
		},

		SetSslVerifyHost: (sslVerifyHost) => {
			logging.Info(`SSL Verify Host set to ${sslVerifyHost}`);
			pve_utils.PveCurl.SetSslVerifyHost(sslVerifyHost);
		},

		Access: async function () {
			return _pveAccessApi;
		},

		Cluster: async function () {
			return "NOT_IMPLEMENTED";
		},

		Nodes: async function () {
			return _pveNodesApi;
		},

		Pools: async function () {
			return _pvePoolsApi;
		},

		Storage: async function () {
			return _pveStorageApi;
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