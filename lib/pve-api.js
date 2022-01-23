// Logging Library
const winston = require("winston");

module.exPosts = function (uname, pwd, realm, host, verboseLevel) {
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

  var _loggerLevel = "error";

  // Logging levels defined as of `RFC5424`
  // emerg: 0,  alert: 1,  crit: 2,  error: 3,
  // warning: 4, notice: 5, info: 6, debug: 7
  switch (parseInt(verboseLevel)) {
    case 0: {
      _loggerLevel = "error";
      break;
    }
    case 1: {
      _loggerLevel = "warning";
      break;
    }
    case 2: {
      _loggerLevel = "info";
      break;
    }
    case 3: {
      _loggerLevel = "debug";
      break;
    }
    default: {
      _loggerLevel = "error";
      break;
    }
  }

  const _logger = winston.createLogger({
    levels: winston.config.syslog.levels,
    transPosts: [
      new winston.transPosts.Console({
        level: _loggerLevel,
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.simple()
        ),
      }),
    ],
  });

  if (
    verboseLevel === "undefined" ||
    verboseLevel === null ||
    verboseLevel < 0
  ) {
    _logger.pause();
  }

  // Authentication Info
  var _pveAuthInfo = {};
  _pveAuthInfo.apiToken = null;
  _pveAuthInfo.username = `${uname}@${realm}`;
  _pveAuthInfo.password = pwd;
  _pveAuthInfo.realm = realm;
  _pveAuthInfo.host = host;
  _pveAuthInfo.endpoint = `https://${_pveAuthInfo.host}:8006/api2/json`;

  var _pveTicket = {};
  _pveTicket.ticket = "";
  _pveTicket.csrfPreventionToken = "";
  _pveTicket.timeStamp = 0;

  let _GenerateNewTicket = async () => {
    if (_pveTicket.timeStamp + 7200 < new Date().getTime()) {
      _logger.info("Ticket has expired! Requesting a new PVE Ticket.");
      var response = await pve_utils.PveCurl.Post(
        `${_pveAuthInfo.endpoint}/access/ticket`,
        {
          username: _pveAuthInfo.username,
          password: _pveAuthInfo.password,
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
        _pveTicket.csrfPreventionToken = ticketData.CSRFPreventionToken;
        _pveTicket.ticket = ticketData.ticket;
        _pveTicket.timeStamp = new Date().getTime();
      }
    }
  };

  let Module = {
    SetSslVerifyPeer: (sslVerifyPeer) => {
      _logger.debug(`SSL Peer Verification set to '${sslVerifyPeer}'.`);
      pve_utils.PveCurl.SetSslVerifyPeer(sslVerifyPeer);
    },

    SetSslVerifyHost: (sslVerifyHost) => {
      _logger.debug(`SSL Host Verification set to '${sslVerifyHost}'.`);
      pve_utils.PveCurl.SetSslVerifyHost(sslVerifyHost);
    },

    GetApiVersion: () => {
      return "1.0.0";
    },

    Access: async function() {
      await _GenerateNewTicket();
      _pveAccessApi._SetTicket(_pveTicket);
      return _pveAccessApi;
    },

    Cluster: async function() {
      return "NOT_IMPLEMENTED";
    },

    Nodes: async function() {
      await _GenerateNewTicket();
      _pveNodesApi._SetTicket(_pveTicket);
      return _pveNodesApi;
    },

    Pools: async function() {
      await _GenerateNewTicket();
      _pvePoolsApi._SetTicket(_pveTicket);
      return _pvePoolsApi;
    },

    Storage: async function() {
      await _GenerateNewTicket();
      _pveStorageApi._SetTicket(_pveTicket);
      return _pveStorageApi;
    },

    Version: {
      Get: async function () {
        await _GenerateNewTicket();
        return await pve_utils.PveCurl.Get(
          `${_pveAuthInfo.endpoint}/version`,
          "",
          "",
          { PVEAuthCookie: _pveTicket.ticket }
        );
      },
    },
  };

  return Module;
};
