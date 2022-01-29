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

	var pveAuthInfo = {
		apiToken: null,
		username: `${uname}@${realm}`,
		password: pwd,
		realm: realm,
		host: host,
		endpoint: `https://${host}:8006/api2/json`,

		apiTicket: {
			ticket: "",
			csrfPreventionToken: "",
			timeStamp: 0
		}
	};

	let _GenerateNewTicket = async () => {
		if (pveAuthInfo.apiTicket.timeStamp + 7200 < new Date().getTime()) {
			var response = await pve_utils.PveCurl.Post(
				`${pveAuthInfo.endpoint}/access/ticket`,
				{
					username: pveAuthInfo.username,
					password: pveAuthInfo.password,
				},
				"",
				""
			);

			if (response.error !== null) {
				_logger.crit(`Err${response.errorCode}: ${response.error}`);
			} else {
				var resBody = null;

				if (response.body !== "undefined" && response.body !== null) {
					var body = response.body;
					if (typeof body === "string") {
						resBody = JSON.parse(body);
					} else {
						resBody = body;
					}
				}
				var ticketData = resBody.data;
				pveAuthInfo.apiTicket.csrfPreventionToken = ticketData.CSRFPreventionToken;
				pveAuthInfo.apiTicket.ticket = ticketData.ticket;
				pveAuthInfo.apiTicket.timeStamp = new Date().getTime();
				logging.Info(`New ticket generated. Next ticket generation in ${7200 - (-1 * Math.floor((pveAuthInfo.apiTicket.timeStamp + 7200 - new Date().getTime()) / 1000))}`);
			}
		}
	};

	let Module = {
		SetSslVerifyPeer: (sslVerifyPeer) => {
			logging.Info(`SSL Verify Peer set to ${sslVerifyPeer}`);
			pve_utils.PveCurl.SetSslVerifyPeer(sslVerifyPeer);
		},

		SetSslVerifyHost: (sslVerifyHost) => {
			logging.Info(`SSL Verify Host set to ${sslVerifyHost}`);
			pve_utils.PveCurl.SetSslVerifyHost(sslVerifyHost);
		},

		GetApiVersion: () => {
			return "1.0.0";
		},

		Access: async function () {
			await _GenerateNewTicket();
			_pveAccessApi._SetTicket(pveAuthInfo.apiTicket);
			return _pveAccessApi;
		},

		Cluster: async function () {
			return "NOT_IMPLEMENTED";
		},

		Nodes: async function () {
			await _GenerateNewTicket();
			_pveNodesApi._SetTicket(pveAuthInfo.apiTicket);
			return _pveNodesApi;
		},

		Pools: async function () {
			await _GenerateNewTicket();
			_pvePoolsApi._SetTicket(pveAuthInfo.apiTicket);
			return _pvePoolsApi;
		},

		Storage: async function () {
			await _GenerateNewTicket();
			_pveStorageApi._SetTicket(pveAuthInfo.apiTicket);
			return _pveStorageApi;
		},

		Version: {
			Get: async function () {
				await _GenerateNewTicket();
				return await pve_utils.PveCurl.Get(
					`${pveAuthInfo.endpoint}/version`,
					"",
					"",
					{ PVEAuthCookie: pveAuthInfo.apiTicket.ticket }
				);
			},
		},
	};

	return Module;
};