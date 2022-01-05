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

    Access: {
      Domains: {
        Get: async function () {
          await _GenerateNewTicket();
          _pveAccessApi._SetTicket(_pveTicket);
          return await _pveAccessApi.Domains.Get();
        },

        Post: async function (params) {
          await _GenerateNewTicket();
          _pveAccessApi._SetTicket(_pveTicket);
          return await _pveAccessApi.Domains.Post(params);
        },

        Realm: function (realm) {
          return {
            Get: async function () {
              await _GenerateNewTicket();
              _pveAccessApi._SetTicket(_pveTicket);
              return await _pveAccessApi.Domains.Realm(realm).Get();
            },

            Put: async function (params) {
              await _GenerateNewTicket();
              _pveAccessApi._SetTicket(_pveTicket);
              return await _pveAccessApi.Domains.Realm(realm).Put(params);
            },

            Delete: async function () {
              await _GenerateNewTicket();
              _pveAccessApi._SetTicket(_pveTicket);
              return await _pveAccessApi.Domains.Realm(realm).Delete();
            },

            Sync: {
              Post: async function (params) {
                await _GenerateNewTicket();
                _pveAccessApi._SetTicket(_pveTicket);
                return await _pveAccessApi.Domains.Realm(realm).Sync.Post(
                  params
                );
              },
            },
          };
        },
      },

      Groups: {
        Get: async function () {
          await _GenerateNewTicket();
          _pveAccessApi._SetTicket(_pveTicket);
          return await _pveAccessApi.Groups.Get();
        },

        Post: async function (params) {
          await _GenerateNewTicket();
          _pveAccessApi._SetTicket(_pveTicket);
          return await _pveAccessApi.Groups.Post(params);
        },

        GroupID: function (groupid) {
          return {
            Get: async function () {
              await _GenerateNewTicket();
              _pveAccessApi._SetTicket(_pveTicket);
              return await _pveAccessApi.Groups.GroupID(groupid).Get();
            },

            Put: async function (params) {
              await _GenerateNewTicket();
              _pveAccessApi._SetTicket(_pveTicket);
              return await _pveAccessApi.Groups.GroupID(groupid).Put(params);
            },

            Delete: async function () {
              await _GenerateNewTicket();
              _pveAccessApi._SetTicket(_pveTicket);
              return await _pveAccessApi.Groups.GroupID(groupid).Delete();
            },
          };
        },
      },

      OpenID: {
        Get: async function () {
          await _GenerateNewTicket();
          _pveAccessApi._SetTicket(_pveTicket);
          return await _pveAccessApi.OpenID.Get();
        },

        AuthUrl: {
          Post: async function (params) {
            await _GenerateNewTicket();
            _pveAccessApi._SetTicket(_pveTicket);
            return await _pveAccessApi.OpenID.AuthUrl.Post(params);
          },
        },
        Login: {
          Post: async function (params) {
            await _GenerateNewTicket();
            _pveAccessApi._SetTicket(_pveTicket);
            return await _pveAccessApi.OpenID.Login.Post(params);
          },
        },
      },

      Roles: {
        Get: async function () {
          await _GenerateNewTicket();
          _pveAccessApi._SetTicket(_pveTicket);
          return await _pveAccessApi.Roles.Get();
        },

        Post: async function (params) {
          await _GenerateNewTicket();
          _pveAccessApi._SetTicket(_pveTicket);
          return await _pveAccessApi.Roles.Post(params);
        },

        RoleID: function (roleid) {
          return {
            Get: async function () {
              await _GenerateNewTicket();
              _pveAccessApi._SetTicket(_pveTicket);
              return await _pveAccessApi.Roles.RoleID(roleid).Get();
            },

            Put: async function (params) {
              await _GenerateNewTicket();
              _pveAccessApi._SetTicket(_pveTicket);
              return await _pveAccessApi.Roles.RoleID(roleid).Put(params);
            },

            Delete: async function () {
              await _GenerateNewTicket();
              _pveAccessApi._SetTicket(_pveTicket);
              return await _pveAccessApi.Roles.RoleID(roleid).Delete();
            },
          };
        },
      },

      Users: {
        Get: async function (params) {
          await _GenerateNewTicket();
          _pveAccessApi._SetTicket(_pveTicket);
          return await _pveAccessApi.Users.Get(params);
        },

        Post: async function (params) {
          await _GenerateNewTicket();
          _pveAccessApi._SetTicket(_pveTicket);
          return await _pveAccessApi.Users.Post(params);
        },

        UserID: function (userid) {
          return {
            Get: async function () {
              await _GenerateNewTicket();
              _pveAccessApi._SetTicket(_pveTicket);
              return await _pveAccessApi.Users.UserID(userid).Get();
            },

            Put: async function (params) {
              await _GenerateNewTicket();
              _pveAccessApi._SetTicket(_pveTicket);
              return await _pveAccessApi.Users.UserID(userid).Put(params);
            },

            Delete: async function () {
              await _GenerateNewTicket();
              _pveAccessApi._SetTicket(_pveTicket);
              return await _pveAccessApi.Users.UserID(userid).Delete();
            },

            Token: function () {
              return {
                Get: async function () {
                  await _GenerateNewTicket();
                  _pveAccessApi._SetTicket(_pveTicket);
                  return await _pveAccessApi.Users.UserID(userid).Token.Get();
                },

                TokenID: function (tokenid) {
                  return {
                    Get: async function () {
                      await _GenerateNewTicket();
                      _pveAccessApi._SetTicket(_pveTicket);
                      return await _pveAccessApi.Users.UserID(userid)
                        .Token.TokenID(tokenid)
                        .Get();
                    },

                    Post: async function (params) {
                      await _GenerateNewTicket();
                      _pveAccessApi._SetTicket(_pveTicket);
                      return await _pveAccessApi.Users.UserID(userid)
                        .Token.TokenID(tokenid)
                        .Post(params);
                    },

                    Put: async function (params) {
                      await _GenerateNewTicket();
                      _pveAccessApi._SetTicket(_pveTicket);
                      return await _pveAccessApi.Users.UserID(userid)
                        .Token.TokenID(tokenid)
                        .Put(params);
                    },

                    Delete: async function () {
                      await _GenerateNewTicket();
                      _pveAccessApi._SetTicket(_pveTicket);
                      return await _pveAccessApi.Users.UserID(userid)
                        .Token.TokenID(tokenid)
                        .Delete();
                    },
                  };
                },
              };
            },
            Tfa: {
              Get: async function (params) {
                await _GenerateNewTicket();
                _pveAccessApi._SetTicket(_pveTicket);
                return await _pveAccessApi.Users.UserID(userid).Tfa.Get(params);
              },
            },
          };
        },
      },

      Tfa: {
        Get: async function () {
          await _GenerateNewTicket();
          _pveAccessApi._SetTicket(_pveTicket);
          return await _pveAccessApi.Tfa.Get();
        },

        Post: async function (params) {
          await _GenerateNewTicket();
          _pveAccessApi._SetTicket(_pveTicket);
          return await _pveAccessApi.Tfa.Post(params);
        },

        UserID: function (userid) {
          return {
            Get: async function () {
              await _GenerateNewTicket();
              _pveAccessApi._SetTicket(_pveTicket);
              return await _pveAccessApi.Tfa.UserID(userid).Get();
            },

            Post: async function (params) {
              return await _pveAccessApi.Tfa.UserID(userid).Post(params);
            },

            Id: function (id) {
              return {
                Get: async function () {
                  await _GenerateNewTicket();
                  _pveAccessApi._SetTicket(_pveTicket);
                  return await _pveAccessApi.Tfa.UserID(userid).Id(id).Get();
                },

                Put: async function (params) {
                  await _GenerateNewTicket();
                  _pveAccessApi._SetTicket(_pveTicket);
                  return await _pveAccessApi.Tfa.UserID(userid)
                    .Id(id)
                    .Put(params);
                },

                Delete: async function (params) {
                  await _GenerateNewTicket();
                  _pveAccessApi._SetTicket(_pveTicket);
                  return await _pveAccessApi.Tfa.UserID(userid)
                    .Id(id)
                    .Delete(params);
                },
              };
            },
          };
        },
      },

      Acl: {
        Get: async function () {
          await _GenerateNewTicket();
          _pveAccessApi._SetTicket(_pveTicket);
          return await _pveAccessApi.Acl.Get();
        },
        Put: async function (params) {
          await _GenerateNewTicket();
          _pveAccessApi._SetTicket(_pveTicket);
          return await _pveAccessApi.Acl.Put(params);
        },
      },
      Password: {
        Put: async function (params) {
          await _GenerateNewTicket();
          _pveAccessApi._SetTicket(_pveTicket);
          return await _pveAccessApi.Password.Put(params);
        },
      },
      Permissions: {
        Get: async function (params) {
          await _GenerateNewTicket();
          _pveAccessApi._SetTicket(_pveTicket);
          return await _pveAccessApi.Permissions.Get(params);
        },
      },
      Ticket: {
        Get: async function () {
          await _GenerateNewTicket();
          _pveAccessApi._SetTicket(_pveTicket);
          return await _pveAccessApi.Ticket.Get();
        },
        Post: async function (params) {
          await _GenerateNewTicket();
          _pveAccessApi._SetTicket(_pveTicket);
          return await _pveAccessApi.Ticket.Post(params);
        },
      },
    },

    Cluster: {
      Acme: function () {
        return {
          Get: async function () {},
          Account: {
            Get: async function () {},
            Post: async function () {},
            Name: function (name) {
              return {
                Get: async function () {},
                Put: async function () {},
                Delete: async function () {},
              };
            },
          },

          Plugins: {
            Get: async function () {},
            Post: async function () {},
            Id: function (id) {
              return {
                Get: async function () {},
                Put: async function () {},
                Delete: async function () {},
              };
            },
          },

          ChallengeSchema: {
            Get: async function () {},
          },
          Directories: {
            Get: async function () {},
          },
          Tos: {
            Get: async function () {},
          },
        };
      },

      Backup: function () {
        return {
          Get: async function () {},
          Post: async function () {},
          Id: function (id) {
            return {
              Get: async function () {},
              Put: async function () {},
              Delete: async function () {},
              IncludedVolumes: {
                Get: async function () {},
              },
            };
          },
        };
      },

      BackupInfo: function () {
        return {
          Get: async function () {},
          NotBackedUp: {
            Get: async function () {},
          },
        };
      },

      Ceph: {
        Flags: {
          Get: async function () {},
          Put: async function () {},
          Flag: function (flag) {
            return {
              Get: async function () {},
              Put: async function () {},
            };
          },
        },
        Metadata: {
          Get: async function () {},
        },
        Status: {
          Get: async function () {},
        },
      },

      Config: {
        Get: async function () {},
        Post: async function () {},
        Nodes: {
          Get: async function () {},
          Node: function (node) {
            return {
              Post: async function () {},
              Delete: async function () {},
            };
          },
        },
        ApiVersion: {
          Get: async function () {},
        },
        Join: {
          Get: async function () {},
          Post: async function () {},
        },
        QDevice: {
          Get: async function () {},
        },
        Totem: {
          Get: async function () {},
        },
      },

      Firewall: {
        Get: async function () {},
        Aliases: {
          Get: async function () {},
          Post: async function () {},
          Name: function (name) {
            return {
              Get: async function () {},
              Put: async function () {},
              Delete: async function () {},
            };
          },
        },
        Groups: {
          Get: async function () {},
          Post: async function () {},
          Group: function (group) {
            return {
              Get: async function () {},
              Post: async function () {},
              Delete: async function () {},
              Pos: function (pos) {
                return {
                  Get: async function () {},
                  Put: async function () {},
                  Delete: async function () {},
                };
              },
            };
          },
        },

        IpSet: {
          Get: async function () {},
          Post: async function () {},
          Name: function (name) {
            return {
              Get: async function () {},
              Post: async function () {},
              Delete: async function () {},
              Cidr: function (cidr) {
                return {
                  Get: async function () {},
                  Put: async function () {},
                  Delete: async function () {},
                };
              },
            };
          },
        },

        Rules: {
          Get: async function () {},
          Post: async function () {},
          Pos: function (pos) {
            return {
              Get: async function () {},
              Put: async function () {},
              Delete: async function () {},
            };
          },
        },

        Macros: {
          Get: async function () {},
        },

        Options: {
          Get: async function () {},
          Put: async function () {},
        },

        Refs: {
          Get: async function () {},
        },
      },

      Ha: {
        Groups: {
          Get: async function () {},
          Post: async function () {},
          Group: function (group) {
            return {
              Get: async function () {},
              Put: async function () {},
              Delete: async function () {},
            };
          },
        },

        Resources: {
          Get: async function () {},
          Post: async function () {},
          Sid: function (sid) {
            return {
              Get: async function () {},
              Put: async function () {},
              Delete: async function () {},
              Migrate: function () {},
              Relocate: function () {},
            };
          },
        },

        Status: {
          Get: async function () {},
          Current: function () {},
          ManagerStatus: function () {},
        },
      },

      Metrics: {
        Get: async function () {},
        Server: {
          Get: async function () {},
          Id: function (id) {
            return {
              Get: async function () {},
              Post: async function () {},
              Put: async function () {},
              Delete: async function () {},
            };
          },
        },
      },

      Replication: {
        Get: async function () {},
        Post: async function () {},
        Id: function (id) {
          return {
            Get: async function () {},
            Put: async function () {},
            Delete: async function () {},
          };
        },
      },

      Sdn: {
        Get: async function () {},
        Put: async function () {},
        Controllers: {
          Get: async function () {},
          Post: async function () {},
          Controller: function (controller) {
            return {
              Get: async function () {},
              Put: async function () {},
              Delete: async function () {},
            };
          },
        },

        Dns: {
          Get: async function () {},
          Post: async function () {},
          Dns: function (dns) {
            return {
              Get: async function () {},
              Put: async function () {},
              Delete: async function () {},
            };
          },
        },
        Ipams: {
          Get: async function () {},
          Post: async function () {},
          Ipam: function (ipam) {
            return {
              Get: async function () {},
              Put: async function () {},
              Delete: async function () {},
            };
          },
        },
        VNets: {
          Get: async function () {},
          Post: async function () {},
          VNet: function (vnet) {
            return {
              Get: async function () {},
              Put: async function () {},
              Delete: async function () {},
              Subnets: {
                Get: async function () {},
                Post: async function () {},
                Subnet: function (subnet) {
                  return {
                    Get: async function () {},
                    Put: async function () {},
                    Delete: async function () {},
                  };
                },
              },
            };
          },
        },
        Zones: {
          Get: async function () {},
          Post: async function () {},
          Zone: function (zone) {
            return {
              Get: async function () {},
              Put: async function () {},
              Delete: async function () {},
            };
          },
        },

        Log: {
          Get: async function () {},
        },
        NextId: {
          Get: async function () {},
        },
        Options: {
          Get: async function () {},
          Put: async function () {},
        },
        Resources: {
          Get: async function () {},
        },
        Status: {
          Get: async function () {},
        },
        Tasks: {
          Get: async function () {},
        },
      },
    },

    Nodes: {
      Get: async function () {
        await _GenerateNewTicket();
        _pveNodesApi._SetTicket(_pveTicket);
        return await _pveNodesApi.Get();
      },

      Node: function (node) {
        return {
          Get: async function () {
            await _GenerateNewTicket();
            _pveNodesApi._SetTicket(_pveTicket);
            return await _pveNodesApi.Node(node).Get();
          },

          Apt: {
            Get: async function () {
              await _GenerateNewTicket();
              _pveNodesApi._SetTicket(_pveTicket);
              return await _pveNodesApi.Node(node).Apt.Get();
            },

            ChangeLog: {
              Get: async function () {
                await _GenerateNewTicket();
                _pveNodesApi._SetTicket(_pveTicket);
                return await _pveNodesApi.Node(node).Apt.ChangeLog.Get();
              },
            },
            Repositories: {
              Get: async function () {
                await _GenerateNewTicket();
                _pveNodesApi._SetTicket(_pveTicket);
                return await _pveNodesApi.Node(node).Apt.Repositories.Get();
              },

              Post: async function (params) {
                await _GenerateNewTicket();
                _pveNodesApi._SetTicket(_pveTicket);
                return await _pveNodesApi
                  .Node(node)
                  .Apt.Repositories.Post(params);
              },

              Put: async function (params) {
                await _GenerateNewTicket();
                _pveNodesApi._SetTicket(_pveTicket);
                return await _pveNodesApi
                  .Node(node)
                  .Apt.Repositories.Put(params);
              },
            },
            Update: {
              Get: async function () {
                await _GenerateNewTicket();
                _pveNodesApi._SetTicket(_pveTicket);
                return await _pveNodesApi.Node(node).Apt.Update.Get();
              },
              Post: async function (params) {
                await _GenerateNewTicket();
                _pveNodesApi._SetTicket(_pveTicket);
                return await _pveNodesApi.Node(node).Apt.Update.Post(params);
              },
            },
            Version: {
              Get: async function () {
                await _GenerateNewTicket();
                _pveNodesApi._SetTicket(_pveTicket);
                return await _pveNodesApi.Node(node).Apt.Version.Get();
              },
            },
          },

          Capabilities: {
            Get: async function () {
              await _GenerateNewTicket();
              _pveNodesApi._SetTicket(_pveTicket);
              return await _pveNodesApi.Node(node).Capabilities.Get();
            },
            Qemu: {
              Get: async function () {
                await _GenerateNewTicket();
                _pveNodesApi._SetTicket(_pveTicket);
                return await _pveNodesApi.Node(node).Capabilities.Qemu.Get();
              },
              Cpu: {
                Get: async function () {
                  await _GenerateNewTicket();
                  _pveNodesApi._SetTicket(_pveTicket);
                  return await _pveNodesApi
                    .Node(node)
                    .Capabilities.Qemu.Cpu.Get();
                },
              },
              Machines: {
                Get: async function () {
                  await _GenerateNewTicket();
                  _pveNodesApi._SetTicket(_pveTicket);
                  return await _pveNodesApi
                    .Node(node)
                    .Capabilities.Qemu.Machines.Get();
                },
              },
            },
          },

          Ceph: {
            Get: async function () {
              await _GenerateNewTicket();
              _pveNodesApi._SetTicket(_pveTicket);
              return await _pveNodesApi.Node(node).Ceph.Get();
            },

            Fs: {
              Get: async function () {
                await _GenerateNewTicket();
                _pveNodesApi._SetTicket(_pveTicket);
                return await _pveNodesApi.Node(node).Ceph.Fs.Get();
              },

              Name: function (name) {
                return {
                  Post: async function (params) {
                    await _GenerateNewTicket();
                    _pveNodesApi._SetTicket(_pveTicket);
                    return await _pveNodesApi
                      .Node(node)
                      .Ceph.Fs.Name(name)
                      .Post(params);
                  },
                };
              },
            },

            Mds: {
              Get: async function () {
                await _GenerateNewTicket();
                _pveNodesApi._SetTicket(_pveTicket);
                return await _pveNodesApi.Node(node).Ceph.Mds.Get();
              },

              Name: function (name) {
                return {
                  Post: async function (params) {
                    await _GenerateNewTicket();
                    _pveNodesApi._SetTicket(_pveTicket);
                    return await _pveNodesApi
                      .Node(node)
                      .Ceph.Mds.Name(name)
                      .Post(params);
                  },

                  Delete: async function (params) {
                    await _GenerateNewTicket();
                    _pveNodesApi._SetTicket(_pveTicket);
                    return await _pveNodesApi
                      .Node(node)
                      .Ceph.Mds.Name(name)
                      .Delete(params);
                  },
                };
              },
            },

            Mgr: {
              Get: async function () {
                await _GenerateNewTicket();
                _pveNodesApi._SetTicket(_pveTicket);
                return await _pveNodesApi.Node(node).Ceph.Mgr.Get();
              },

              Id: function (id) {
                return {
                  Post: async function (params) {
                    await _GenerateNewTicket();
                    _pveNodesApi._SetTicket(_pveTicket);
                    return await _pveNodesApi
                      .Node(node)
                      .Ceph.Mgr.Id(id)
                      .Post(params);
                  },

                  Delete: async function (params) {
                    await _GenerateNewTicket();
                    _pveNodesApi._SetTicket(_pveTicket);
                    return await _pveNodesApi
                      .Node(node)
                      .Ceph.Mgr.Id(id)
                      .Delete(params);
                  },
                };
              },
            },

            Mon: {
              Get: async function () {
                await _GenerateNewTicket();
                _pveNodesApi._SetTicket(_pveTicket);
                return await _pveNodesApi.Node(node).Ceph.Mon.Get();
              },

              MonID: function (monid) {
                return {
                  Post: async function (params) {
                    await _GenerateNewTicket();
                    _pveNodesApi._SetTicket(_pveTicket);
                    return await _pveNodesApi
                      .Node(node)
                      .Ceph.Mon.MonID(monid)
                      .Post(params);
                  },

                  Delete: async function (params) {
                    await _GenerateNewTicket();
                    _pveNodesApi._SetTicket(_pveTicket);
                    return await _pveNodesApi
                      .Node(node)
                      .Ceph.Mon.MonID(monid)
                      .Delete(params);
                  },
                };
              },
            },

            Osd: {
              Get: async function () {
                await _GenerateNewTicket();
                _pveNodesApi._SetTicket(_pveTicket);
                return await _pveNodesApi.Node(node).Ceph.Osd.Get();
              },
              OsdID: function (osdid) {
                return {
                  Delete: async function (params) {
                    await _GenerateNewTicket();
                    _pveNodesApi._SetTicket(_pveTicket);
                    return await _pveNodesApi
                      .Node(node)
                      .Ceph.Osd.OsdID(osdid)
                      .Delete(params);
                  },
                  In: {
                    Post: async function (params) {
                      await _GenerateNewTicket();
                      _pveNodesApi._SetTicket(_pveTicket);
                      return await _pveNodesApi
                        .Node(node)
                        .Ceph.Osd.OsdID(osdid)
                        .In.Post(params);
                    },
                  },
                  Out: {
                    Post: async function (params) {
                      await _GenerateNewTicket();
                      _pveNodesApi._SetTicket(_pveTicket);
                      return await _pveNodesApi
                        .Node(node)
                        .Ceph.Osd.OsdID(osdid)
                        .Out.Post(params);
                    },
                  },
                  Scrub: {
                    Post: async function (params) {
                      await _GenerateNewTicket();
                      _pveNodesApi._SetTicket(_pveTicket);
                      return await _pveNodesApi
                        .Node(node)
                        .Ceph.Osd.OsdID(osdid)
                        .Scrub.Post(params);
                    },
                  },
                };
              },
            },

            Pools: {
              Get: async function () {
                await _GenerateNewTicket();
                _pveNodesApi._SetTicket(_pveTicket);
                return await _pveNodesApi.Node(node).Ceph.Pools.Get();
              },

              Post: async function (params) {
                await _GenerateNewTicket();
                _pveNodesApi._SetTicket(_pveTicket);
                return await _pveNodesApi.Node(node).Ceph.Pools.Post(params);
              },

              Name: function (name) {
                return {
                  Get: async function (params) {
                    await _GenerateNewTicket();
                    _pveNodesApi._SetTicket(_pveTicket);
                    return await _pveNodesApi
                      .Node(node)
                      .Ceph.Pools.Name(name)
                      .Get(params);
                  },

                  Put: async function (params) {
                    await _GenerateNewTicket();
                    _pveNodesApi._SetTicket(_pveTicket);
                    return await _pveNodesApi
                      .Node(node)
                      .Ceph.Pools.Name(name)
                      .Put(params);
                  },

                  Delete: async function (params) {
                    await _GenerateNewTicket();
                    _pveNodesApi._SetTicket(_pveTicket);
                    return await _pveNodesApi
                      .Node(node)
                      .Ceph.Pools.Name(name)
                      .Delete(params);
                  },
                };
              },
            },

            Config: {
              Get: async function () {
                await _GenerateNewTicket();
                _pveNodesApi._SetTicket(_pveTicket);
                return await _pveNodesApi.Node(node).Ceph.Config.Get();
              },
            },

            ConfigDb: {
              Get: async function () {
                await _GenerateNewTicket();
                _pveNodesApi._SetTicket(_pveTicket);
                return await _pveNodesApi.Node(node).Ceph.ConfigDb.Get();
              },
            },

            Crush: {
              Get: async function () {
                await _GenerateNewTicket();
                _pveNodesApi._SetTicket(_pveTicket);
                return await _pveNodesApi.Node(node).Ceph.Crush.Get();
              },
            },

            Init: {
              Post: async function () {
                await _GenerateNewTicket();
                _pveNodesApi._SetTicket(_pveTicket);
                return await _pveNodesApi.Node(node).Ceph.Init.Post();
              },
            },

            Log: {
              Get: async function () {
                await _GenerateNewTicket();
                _pveNodesApi._SetTicket(_pveTicket);
                return await _pveNodesApi.Node(node).Ceph.Log.Get();
              },
            },

            Restart: {
              Post: async function (params) {
                await _GenerateNewTicket();
                _pveNodesApi._SetTicket(_pveTicket);
                return await _pveNodesApi.Node(node).Ceph.Restart.Post(params);
              },
            },

            Rules: {
              Get: async function () {
                await _GenerateNewTicket();
                _pveNodesApi._SetTicket(_pveTicket);
                return await _pveNodesApi.Node(node).Ceph.Rules.Get();
              },
            },

            Start: {
              Post: async function (params) {
                await _GenerateNewTicket();
                _pveNodesApi._SetTicket(_pveTicket);
                return await _pveNodesApi.Node(node).Ceph.Start.Post(params);
              },
            },

            Status: {
              Get: async function () {
                await _GenerateNewTicket();
                _pveNodesApi._SetTicket(_pveTicket);
                return _pveNodesApi.Node(node).Ceph.Status.Get();
              },
            },

            Stop: {
              Post: async function (params) {
                await _GenerateNewTicket();
                _pveNodesApi._SetTicket(_pveTicket);
                return await _pveNodesApi.Node(node).Ceph.Stop.Post(params);
              },
            },
          },

          Certificates: {
            Get: async function () {
              await _GenerateNewTicket();
              _pveNodesApi._SetTicket(_pveTicket);
              return await _pveNodesApi.Node(node).Certificates.Get();
            },
            Acme: {
              Get: async function () {
                await _GenerateNewTicket();
                _pveNodesApi._SetTicket(_pveTicket);
                return await _pveNodesApi.Node(node).Certificates.Acme.Get();
              },
              Certificate: {
                Post: async function (params) {
                  await _GenerateNewTicket();
                  _pveNodesApi._SetTicket(_pveTicket);
                  return await _pveNodesApi
                    .Node(node)
                    .Certificates.Acme.Certificate.Post(params);
                },
                Put: async function (params) {
                  await _GenerateNewTicket();
                  _pveNodesApi._SetTicket(_pveTicket);
                  return await _pveNodesApi
                    .Node(node)
                    .Certificates.Acme.Certificate.Put(params);
                },
                Delete: async function () {
                  await _GenerateNewTicket();
                  _pveNodesApi._SetTicket(_pveTicket);
                  return await _pveNodesApi
                    .Node(node)
                    .Certificates.Acme.Certificate.Delete();
                },
              },
            },

            Custom: {
              Post: async function (params) {
                await _GenerateNewTicket();
                _pveNodesApi._SetTicket(_pveTicket);
                return await _pveNodesApi
                  .Node(node)
                  .Certificates.Custom.Post(params);
              },
              Delete: async function (params) {
                await _GenerateNewTicket();
                _pveNodesApi._SetTicket(_pveTicket);
                return await _pveNodesApi
                  .Node(node)
                  .Certificates.Custom.Delete(params);
              },
            },

            Info: {
              Get: async function () {
                await _GenerateNewTicket();
                _pveNodesApi._SetTicket(_pveTicket);
                return await _pveNodesApi.Node(node).Certificates.Info.Get();
              },
            },
          },

          Disks: {
            Get: async function () {
              await _GenerateNewTicket();
              _pveNodesApi._SetTicket(_pveTicket);
              return await _pveNodesApi.Node(node).Disks.Get();
            },

            Zfs: {
              Get: async function () {
                await _GenerateNewTicket();
                _pveNodesApi._SetTicket(_pveTicket);
                return await _pveNodesApi.Node(node).Disks.Zfs.Get();
              },
              Post: async function (params) {
                await _GenerateNewTicket();
                _pveNodesApi._SetTicket(_pveTicket);
                return await _pveNodesApi.Node(node).Disks.Zfs.Post(params);
              },
              Name: function (name) {
                return {
                  Get: async function () {
                    await _GenerateNewTicket();
                    _pveNodesApi._SetTicket(_pveTicket);
                    return await _pveNodesApi
                      .Node(node)
                      .Disks.Zfs.Name(name)
                      .Get();
                  },
                };
              },
            },

            Directory: {
              Get: async function () {
                await _GenerateNewTicket();
                _pveNodesApi._SetTicket(_pveTicket);
                return await _pveNodesApi.Node(node).Disks.Directory.Get();
              },
              Post: async function (params) {
                await _GenerateNewTicket();
                _pveNodesApi._SetTicket(_pveTicket);
                return await _pveNodesApi
                  .Node(node)
                  .Disks.Directory.Post(params);
              },
            },

            InitGpt: {
              Post: async function (params) {
                await _GenerateNewTicket();
                _pveNodesApi._SetTicket(_pveTicket);
                return await _pveNodesApi.Node(node).Disks.InitGpt.Post(params);
              },
            },

            List: {
              Get: async function (params) {
                await _GenerateNewTicket();
                _pveNodesApi._SetTicket(_pveTicket);
                return await _pveNodesApi.Node(node).Disks.List.Get(params);
              },
            },

            Lvm: {
              Get: async function () {
                await _GenerateNewTicket();
                _pveNodesApi._SetTicket(_pveTicket);
                return await _pveNodesApi.Node(node).Disks.Lvm.Get();
              },

              Post: async function (params) {
                await _GenerateNewTicket();
                _pveNodesApi._SetTicket(_pveTicket);
                return await _pveNodesApi.Node(node).Disks.Lvm.Post(params);
              },
            },

            LvmThin: {
              Get: async function () {
                await _GenerateNewTicket();
                _pveNodesApi._SetTicket(_pveTicket);
                return await _pveNodesApi.Node(node).Disks.LvmThin.Get();
              },

              Post: async function (params) {
                await _GenerateNewTicket();
                _pveNodesApi._SetTicket(_pveTicket);
                return await _pveNodesApi.Node(node).Disks.LvmThin.Post(params);
              },
            },

            Smart: {
              Get: async function (params) {
                await _GenerateNewTicket();
                _pveNodesApi._SetTicket(_pveTicket);
                return await _pveNodesApi.Node(node).Disks.Smart.Get(params);
              },
            },

            WipeDisk: {
              Put: async function () {
                await _GenerateNewTicket();
                _pveNodesApi._SetTicket(_pveTicket);
                return await _pveNodesApi.Node(node).Disks.WipeDisk.Put();
              },
            },
          },

          Firewall: {
            Get: async function () {
              await _GenerateNewTicket();
              _pveNodesApi._SetTicket(_pveTicket);
              return await _pveNodesApi.Node(node).Firewall.Get();
            },

            Rules: {
              Get: async function () {
                await _GenerateNewTicket();
                _pveNodesApi._SetTicket(_pveTicket);
                return await _pveNodesApi.Node(node).Firewall.Rules.Get();
              },
              Post: async function (params) {
                await _GenerateNewTicket();
                _pveNodesApi._SetTicket(_pveTicket);
                return await _pveNodesApi.Node(node).Firewall.Rules.Post(params);
              },
              Pos: function (pos) {
                return {
                  Get: async function () {
                    await _GenerateNewTicket();
                    _pveNodesApi._SetTicket(_pveTicket);
                    return await _pveNodesApi.Node(node).Firewall.Rules.Pos(pos).Get();
                  },
                  Put: async function (params) {
                    await _GenerateNewTicket();
                    _pveNodesApi._SetTicket(_pveTicket);
                    return await _pveNodesApi.Node(node).Firewall.Rules.Pos(pos).Put(params);
                  },
                  Delete: async function (params) {
                    await _GenerateNewTicket();
                    _pveNodesApi._SetTicket(_pveTicket);
                    return await _pveNodesApi.Node(node).Firewall.Rules.Pos(pos).Delete(params);
                  },
                };
              },
            },

            Log: {
              Get: async function () {
                await _GenerateNewTicket();
                _pveNodesApi._SetTicket(_pveTicket);
                return await _pveNodesApi.Node(node).Firewall.Log.Get();
              },
            },

            Options: {
              Get: async function () {
                await _GenerateNewTicket();
                _pveNodesApi._SetTicket(_pveTicket);
                return await _pveNodesApi.Node(node).Firewall.Options.Get();
              },
              Put: async function (params) {
                await _GenerateNewTicket();
                _pveNodesApi._SetTicket(_pveTicket);
                return await _pveNodesApi.Node(node).Firewall.Options.Put(params);
              },
            },
          },

          Hardware: {
            Get: async function () {
              await _GenerateNewTicket();
              _pveNodesApi._SetTicket(_pveTicket);
              return await _pveNodesApi.Node(node).Hardware.Get();
            },

            Pci: {
              Get: async function () {
                await _GenerateNewTicket();
                _pveNodesApi._SetTicket(_pveTicket);
                return await _pveNodesApi.Node(node).Hardware.Pci.Get();
              },
              PciID: function (pciid) {
                return {
                  Get: async function () {
                    await _GenerateNewTicket();
                    _pveNodesApi._SetTicket(_pveTicket);
                    return await _pveNodesApi.Node(node).Hardware.Pci.PciID(pciid).Get();
                  },
                  Mdev: {
                    Get: async function () {
                      await _GenerateNewTicket();
                      _pveNodesApi._SetTicket(_pveTicket);
                      return await _pveNodesApi.Node(node).Hardware.Pci.PciID(pciid).Mdev.Get();
                    },
                  },
                };
              },
            },

            Usb: {
              Get: async function () {
                await _GenerateNewTicket();
                _pveNodesApi._SetTicket(_pveTicket);
                return await _pveNodesApi.Node(node).Hardware.Usb.Get();
              },
            },
          },

          Lxc: {
            Get: async function () {
              await _GenerateNewTicket();
              _pveNodesApi._SetTicket(_pveTicket);
              return await _pveNodesApi.Node(node).Lxc.Get();
            },
            Post: async function (params) {
              await _GenerateNewTicket();
              _pveNodesApi._SetTicket(_pveTicket);
              return await _pveNodesApi.Node(node).Lxc.Post(params);
            },

            Vmid: function (vmid) {
              return {
                Get: async function () {
                  await _GenerateNewTicket();
                  _pveNodesApi._SetTicket(_pveTicket);
                  return await _pveNodesApi.Node(node).Lxc.Vmid(vmid).Get();
                },

                Delete: async function (params) {
                  await _GenerateNewTicket();
                  _pveNodesApi._SetTicket(_pveTicket);
                  return await _pveNodesApi.Node(node).Lxc.Vmid(vmid).Delete(params);
                },

                Firewall: {
                  Get: async function () {
                    await _GenerateNewTicket();
                    _pveNodesApi._SetTicket(_pveTicket);
                    return await _pveNodesApi.Node(node).Lxc.Vmid(vmid).Firewall.Get();
                  },
                  Aliases: {
                    Get: async function () {
                      await _GenerateNewTicket();
                      _pveNodesApi._SetTicket(_pveTicket);
                      return await _pveNodesApi.Node(node).Lxc.Vmid(vmid).Firewall.Aliases.Get();
                    },
                    Post: async function (params) {
                      await _GenerateNewTicket();
                      _pveNodesApi._SetTicket(_pveTicket);
                      return await _pveNodesApi.Node(node).Lxc.Vmid(vmid).Firewall.Aliases.Post(params);
                    },
                    Name: function (name) {
                      return {
                        Get: async function () {
                          await _GenerateNewTicket();
                          _pveNodesApi._SetTicket(_pveTicket);
                          return await _pveNodesApi.Node(node).Lxc.Vmid(vmid).Firewall.Aliases.Name(name).Get();
                        },
                        Put: async function (params) {
                          await _GenerateNewTicket();
                          _pveNodesApi._SetTicket(_pveTicket);
                          return await _pveNodesApi.Node(node).Lxc.Vmid(vmid).Firewall.Aliases.Name(name).Put(params);
                        },
                        Delete: async function (params) {
                          await _GenerateNewTicket();
                          _pveNodesApi._SetTicket(_pveTicket);
                          return await _pveNodesApi.Node(node).Lxc.Vmid(vmid).Firewall.Aliases.Name(name).Delete(params);
                        },
                      };
                    },
                  },

                  IpSet: {
                    Get: async function () {
                      await _GenerateNewTicket();
                      _pveNodesApi._SetTicket(_pveTicket);
                      return await _pveNodesApi.Node(node).Lxc.Vmid(vmid).Firewall.IpSet.Get();
                    },
                    Post: async function (params) {
                      await _GenerateNewTicket();
                      _pveNodesApi._SetTicket(_pveTicket);
                      return await _pveNodesApi.Node(node).Lxc.Vmid(vmid).Firewall.IpSet.Post(params);
                    },
                    Name: function (name) {
                      return {
                        Get: async function () {
                          await _GenerateNewTicket();
                          _pveNodesApi._SetTicket(_pveTicket);
                          return await _pveNodesApi.Node(node).Lxc.Vmid(vmid).Firewall.IpSet.Name(name).Get();
                        },
                        Post: async function (params) {
                          await _GenerateNewTicket();
                          _pveNodesApi._SetTicket(_pveTicket);
                          return await _pveNodesApi.Node(node).Lxc.Vmid(vmid).Firewall.IpSet.Name(name).Post(params);
                        },
                        Delete: async function () {
                          await _GenerateNewTicket();
                          _pveNodesApi._SetTicket(_pveTicket);
                          return await _pveNodesApi.Node(node).Lxc.Vmid(vmid).Firewall.IpSet.Name(name).Delete();
                        },
                        Cidr: function (cidr) {
                          return {
                            Get: async function () {
                              await _GenerateNewTicket();
                              _pveNodesApi._SetTicket(_pveTicket);
                              return await _pveNodesApi.Node(node).Lxc.Vmid(vmid).Firewall.IpSet.Name(name).Cidr(cidr).Get();
                            },
                            Put: async function (params) {
                              await _GenerateNewTicket();
                              _pveNodesApi._SetTicket(_pveTicket);
                              return await _pveNodesApi.Node(node).Lxc.Vmid(vmid).Firewall.IpSet.Name(name).Cidr(cidr).Put(params);
                            },
                            Delete: async function (params) {
                              await _GenerateNewTicket();
                              _pveNodesApi._SetTicket(_pveTicket);
                              return await _pveNodesApi.Node(node).Lxc.Vmid(vmid).Firewall.IpSet.Name(name).Cidr(cidr).Delete(params);
                            },
                          };
                        },
                      };
                    },
                  },

                  Rules: {
                    Get: async function () {
                      await _GenerateNewTicket();
                      _pveNodesApi._SetTicket(_pveTicket);
                      return await _pveNodesApi.Node(node).Lxc.Vmid(vmid).Firewall.Rules.Get();
                    },
                    Post: async function (params) {
                      await _GenerateNewTicket();
                      _pveNodesApi._SetTicket(_pveTicket);
                      return await _pveNodesApi.Node(node).Lxc.Vmid(vmid).Firewall.Rules.Post(params);
                    },
                    Pos: function (pos) {
                      return {
                        Get: async function () {
                          await _GenerateNewTicket();
                          _pveNodesApi._SetTicket(_pveTicket);
                          return await _pveNodesApi.Node(node).Lxc.Vmid(vmid).Firewall.Rules.Pos(pos).Get();
                        },
                        Put: async function (params) {
                          await _GenerateNewTicket();
                          _pveNodesApi._SetTicket(_pveTicket);
                          return await _pveNodesApi.Node(node).Lxc.Vmid(vmid).Firewall.Rules.Pos(pos).Put(params);
                        },
                        Delete: async function (params) {
                          await _GenerateNewTicket();
                          _pveNodesApi._SetTicket(_pveTicket);
                          return await _pveNodesApi.Node(node).Lxc.Vmid(vmid).Firewall.Rules.Pos(pos).Delete(params);
                        },
                      };
                    },
                  },

                  Log: {
                    Get: async function () {},
                  },

                  Options: {
                    Get: async function () {},
                    Put: async function () {},
                  },

                  Refs: {
                    Get: async function () {},
                  },
                },

                SnapShot: {
                  Get: async function () {},
                  Post: async function () {},
                  SnapName: function (snapname) {
                    return {
                      Get: async function () {},
                      Delete: async function () {},
                      Config: {
                        Get: async function () {},
                        Put: async function () {},
                      },

                      Rollback: {
                        Post: async function () {},
                      },
                    };
                  },
                },

                Status: {
                  Get: async function () {},

                  Current: {
                    Get: async function () {},
                  },

                  Reboot: {
                    Post: async function () {},
                  },

                  Reset: {
                    Post: async function () {},
                  },

                  Resume: {
                    Post: async function () {},
                  },

                  Shutdown: {
                    Post: async function () {},
                  },

                  Start: {
                    Post: async function () {},
                  },

                  Stop: {
                    Post: async function () {},
                  },

                  Suspend: {
                    Post: async function () {},
                  },
                },

                Clone: {
                  Post: async function () {},
                },

                Config: {
                  Get: async function () {},
                  Post: async function () {},
                  Put: async function () {},
                },

                Feature: {
                  Get: async function () {},
                },

                Migrate: {
                  Get: async function () {},
                  Post: async function () {},
                },

                Monitor: {
                  Post: async function () {},
                },

                MoveDisk: {
                  MoveDisk: function () {},
                },

                Pending: {
                  Get: async function () {},
                },

                Resize: {
                  Put: async function () {},
                },

                Rrd: {
                  Get: async function () {},
                },

                RrdData: {
                  Get: async function () {},
                },

                SendKey: {
                  Put: async function () {},
                },

                SpiceProxy: {
                  Post: async function () {},
                },

                Template: {
                  Post: async function () {},
                },

                TermProxy: {
                  Post: async function () {},
                },

                Unlink: {
                  Put: async function () {},
                },

                VncProxy: {
                  Post: async function () {},
                },

                VncWebSocket: {
                  Get: async function () {},
                },
              };
            },
          },

          Network: {
            Get: async function () {},
            Post: async function () {},
            Put: async function () {},
            Delete: async function () {},
            IFace: function (iface) {
              return {
                Get: async function () {},
                Put: async function () {},
                Delete: async function () {},
              };
            },
          },

          Qemu: {
            Get: async function () {},
            Post: async function () {},

            Vmid: function (vmid) {
              return {
                Get: async function () {},

                Delete: async function () {},

                Agent: {
                  Get: async function () {},

                  Post: async function () {},

                  Exec: {
                    Post: async function () {},
                  },

                  ExecStatus: {
                    Get: async function () {},
                  },

                  FileRead: {
                    Get: async function () {},
                  },

                  FileWrite: {
                    Post: async function () {},
                  },

                  FsFreezeFreeze: {
                    Post: async function () {},
                  },

                  FsFreezeStatus: {
                    Post: async function () {},
                  },

                  FsFreezeThaw: {
                    Post: async function () {},
                  },

                  FsTrim: {
                    Post: async function () {},
                  },

                  GetFsInfo: {
                    Get: async function () {},
                  },

                  GetHostName: {
                    Get: async function () {},
                  },

                  GetMemoryBlockInfo: {
                    Get: async function () {},
                  },

                  GetMemoryBlocks: {
                    Get: async function () {},
                  },

                  GetOsInfo: {
                    Get: async function () {},
                  },

                  GetTime: {
                    Get: async function () {},
                  },

                  GetTimezone: {
                    Get: async function () {},
                  },

                  GetUsers: {
                    Get: async function () {},
                  },

                  GetVCpus: {
                    Get: async function () {},
                  },

                  Info: {
                    Get: async function () {},
                  },

                  NetworkGetInterfaces: {
                    Get: async function () {},
                  },

                  Ping: {
                    Post: async function () {},
                  },

                  SetUserPassword: {
                    Post: async function () {},
                  },

                  Shutdown: {
                    Post: async function () {},
                  },

                  SuspendDisk: {
                    Post: async function () {},
                  },

                  SuspendHybrid: {
                    Post: async function () {},
                  },

                  SuspendRam: {
                    Post: async function () {},
                  },
                },

                CloudInit: {
                  Dump: {
                    Get: async function () {},
                  },
                },

                Firewall: {
                  Get: async function () {},
                  Aliases: {
                    Get: async function () {},
                    Post: async function () {},
                    Name: function (name) {
                      return {
                        Get: async function () {},
                        Put: async function () {},
                        Delete: async function () {},
                      };
                    },
                  },

                  IpSet: {
                    Get: async function () {},
                    Post: async function () {},
                    Name: function (name) {
                      return {
                        Get: async function () {},
                        Post: async function () {},
                        Delete: async function () {},
                        Cidr: function (cidr) {
                          return {
                            Get: async function () {},
                            Put: async function () {},
                            Delete: async function () {},
                          };
                        },
                      };
                    },
                  },

                  Rules: {
                    Get: async function () {},
                    Post: async function () {},
                    Pos: function (pos) {
                      return {
                        Get: async function () {},
                        Put: async function () {},
                        Delete: async function () {},
                      };
                    },
                  },

                  Log: {
                    Get: async function () {},
                  },

                  Options: {
                    Get: async function () {},
                    Put: async function () {},
                  },

                  Refs: {
                    Get: async function () {},
                  },
                },

                SnapShot: {
                  Get: async function () {},
                  Post: async function () {},
                  SnapName: function (snapname) {
                    return {
                      Get: async function () {},
                      Delete: async function () {},
                      Config: {
                        Get: async function () {},
                        Put: async function () {},
                      },

                      Rollback: {
                        Post: async function () {},
                      },
                    };
                  },
                },

                Status: {
                  Get: async function () {},

                  Current: {
                    Get: async function () {},
                  },

                  Reboot: {
                    Post: async function () {},
                  },

                  Reset: {
                    Post: async function () {},
                  },

                  Resume: {
                    Post: async function () {},
                  },

                  Shutdown: {
                    Post: async function () {},
                  },

                  Start: {
                    Post: async function () {},
                  },

                  Stop: {
                    Post: async function () {},
                  },

                  Suspend: {
                    Post: async function () {},
                  },
                },

                Clone: {
                  Post: async function () {},
                },

                Config: {
                  Get: async function () {},
                  Post: async function () {},
                  Put: async function () {},
                },

                Feature: {
                  Get: async function () {},
                },

                Migrate: {
                  Get: async function () {},
                  Post: async function () {},
                },

                Monitor: {
                  Post: async function () {},
                },

                MoveDisk: {
                  MoveDisk: function () {},
                },

                Pending: {
                  Get: async function () {},
                },

                Resize: {
                  Put: async function () {},
                },

                Rrd: {
                  Get: async function () {},
                },

                RrdData: {
                  Get: async function () {},
                },

                SendKey: {
                  Put: async function () {},
                },

                SpiceProxy: {
                  Post: async function () {},
                },

                Template: {
                  Post: async function () {},
                },

                TermProxy: {
                  Post: async function () {},
                },

                Unlink: {
                  Put: async function () {},
                },

                VncProxy: {
                  Post: async function () {},
                },

                VncWebSocket: {
                  Get: async function () {},
                },
              };
            },
          },

          Replication: {
            Get: async function () {},

            Id: function (id) {
              return {
                Get: async function () {},
                Log: {
                  Get: async function () {},
                },

                ScheduleNow: {
                  Post: async function () {},
                },

                Status: {
                  Get: async function () {},
                },
              };
            },
          },

          Scan: {
            Get: async function () {},
            Cifs: {
              Get: async function () {},
            },

            GlusterFS: {
              Get: async function () {},
            },

            Iscsi: {
              Get: async function () {},
            },

            Lvm: {
              Get: async function () {},
            },

            LvmThin: {
              Get: async function () {},
            },

            Nfs: {
              Get: async function () {},
            },

            Pbs: {
              Get: async function () {},
            },

            Zfs: {
              Get: async function () {},
            },
          },

          Sdn: {
            Get: async function () {},
            Zones: {
              Get: async function () {},
              Zone: function (zone) {
                return {
                  Get: async function () {},
                  Content: {
                    Get: async function () {},
                  },
                };
              },
            },
          },

          Services: {
            Get: async function () {},
            Service: function (service) {
              return {
                Get: async function () {},
                Reload: {
                  Post: async function () {},
                },

                Restart: {
                  Post: async function () {},
                },

                Start: {
                  Post: async function () {},
                },

                State: {
                  Get: async function () {},
                },

                Stop: {
                  Post: async function () {},
                },
              };
            },
          },

          Storage: {
            Get: async function () {},
            Storage: function (storage) {
              return {
                Get: async function () {},
                Content: {
                  Get: async function () {},
                  Post: async function () {},
                  Volume: function (volume) {
                    return {
                      Get: async function () {},
                      Post: async function () {},
                      Put: async function () {},
                      Delete: async function () {},
                    };
                  },
                },

                FileRestore: {
                  Download: {
                    Get: async function () {},
                  },
                  List: {
                    Get: async function () {},
                  },
                },

                DownloadUrl: {
                  Post: async function () {},
                },

                PruneBackups: {
                  Get: async function () {},
                  Delete: async function () {},
                },

                Rrd: {
                  Get: async function () {},
                },

                RrdData: {
                  Get: async function () {},
                },

                Status: {
                  Get: async function () {},
                },

                Upload: {
                  Post: async function () {},
                },
              };
            },
          },

          Tasks: {
            Get: async function () {},
            Upid: function (upid) {
              return {
                Get: async function () {},
                Delete: async function () {},
                Log: {
                  Get: async function () {},
                },
                Status: {
                  Get: async function () {},
                },
              };
            },
          },

          VZDump: {
            Post: async function () {},
            Defaults: {
              Get: async function () {},
            },
            ExtractConfig: {
              Get: async function () {},
            },
          },

          AplInfo: {
            Get: async function () {},
            Post: async function () {},
          },

          Config: {
            Get: async function () {},
            Put: async function () {},
          },
          Dns: {
            Get: async function () {},
            Put: async function () {},
          },
          Execute: {
            Get: async function () {},
            Put: async function () {},
          },
          Hosts: {
            Get: async function () {},
            Post: async function () {},
          },
          Journal: {
            Get: async function () {},
          },
          MigrateAll: {
            Post: async function () {},
          },
          NetStat: {
            Get: async function () {},
          },
          RePost: {
            Get: async function () {},
          },
          Rrd: {
            Get: async function () {},
          },
          RrdData: {
            Get: async function () {},
          },
          SpiceShell: {
            Post: async function () {},
          },
          StartAll: {
            Post: async function () {},
          },
          Status: {
            Get: async function () {},
            Post: async function () {},
          },
          StopAll: {
            Post: async function () {},
          },
          Subscription: {
            Get: async function () {},
            Post: async function () {},
            Put: async function () {},
            Delete: async function () {},
          },
          SysLog: {
            Get: async function () {},
          },
          TermProxy: {
            Post: async function () {},
          },
          Time: {
            Get: async function () {},
            Put: async function () {},
          },
          Version: {
            Get: async function () {},
          },
          VncShell: {
            Post: async function () {},
          },
          VncWebSocket: {
            Get: async function () {},
          },
          WakeOnLan: {
            Post: async function () {},
          },
        };
      },
    },

    Pools: {
      Get: async function () {
        await _GenerateNewTicket();
        _pvePoolsApi._SetTicket(_pveTicket);
        return await _pvePoolsApi.Get();
      },

      Post: async function (params) {
        await _GenerateNewTicket();
        _pvePoolsApi._SetTicket(_pveTicket);
        return await _pvePoolsApi.Post(params);
      },
      PoolID: function (poolid) {
        return {
          Get: async function () {
            await _GenerateNewTicket();
            _pvePoolsApi._SetTicket(_pveTicket);
            return await _pvePoolsApi.PoolID(poolid).Get();
          },
          Put: async function (params) {
            await _GenerateNewTicket();
            _pvePoolsApi._SetTicket(_pveTicket);
            return await _pvePoolsApi.PoolID(poolid).Put(params);
          },
          Delete: async function (params) {
            await _GenerateNewTicket();
            _pvePoolsApi._SetTicket(_pveTicket);
            return await _pvePoolsApi.PoolID(poolid).Put(params);
          },
        };
      },
    },

    Storage: {
      // Storage index
      Get: async function (storageType) {
        await _GenerateNewTicket();
        _pveStorageApi._SetTicket(_pveTicket);
        return await _pveStorageApi.Get(storageType);
      },

      Post: async function (params) {
        await _GenerateNewTicket();
        _pveStorageApi._SetTicket(_pveTicket);
        return await _pveStorageApi.Post(params);
      },

      Storage: function (storage) {
        return {
          Get: async function () {
            await _GenerateNewTicket();
            _pveStorageApi._SetTicket(_pveTicket);
            return await _pveStorageApi.Storage(storage).Get();
          },

          Put: async function (params) {
            await _GenerateNewTicket();
            _pveStorageApi._SetTicket(_pveTicket);
            return await _pveStorageApi.Storage(storage).Put(params);
          },

          Delete: async function (params) {
            await _GenerateNewTicket();
            _pveStorageApi._SetTicket(_pveTicket);
            return await _pveStorageApi.Storage(storage).Delete(params);
          },
        };
      },
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
