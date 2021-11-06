// Logging Library
const winston = require('winston');

module.exports = function (uname, pwd, realm, host, verboseLevel) {

    const pve_utils = require('./pve-curl')(verboseLevel);
    const _pveStorageApi = require('./pve-storage-api')(uname, pwd, realm, host, verboseLevel);
    const _pvePoolsApi = require('./pve-pools-api')(uname, pwd, realm, host, verboseLevel);
    const _pveNodesApi = require('./pve-nodes-api')(uname, pwd, realm, host, verboseLevel);

    var _loggerLevel = 'error';

    // Logging levels defined as of `RFC5424`
    // emerg: 0,  alert: 1,  crit: 2,  error: 3, 
    // warning: 4, notice: 5, info: 6, debug: 7
    switch (parseInt(verboseLevel)) {
        case 0: { _loggerLevel = 'error'; break; }
        case 1: { _loggerLevel = 'warning'; break; }
        case 2: { _loggerLevel = 'info'; break; }
        case 3: { _loggerLevel = 'debug'; break; }
        default: { _loggerLevel = 'error'; break; }
    }

    const _logger = winston.createLogger({
        levels: winston.config.syslog.levels,
        transports: [new winston.transports.Console({
            level: _loggerLevel,
            format: winston.format.combine(winston.format.colorize(), winston.format.simple())
        })]
    });

    if (verboseLevel === 'undefined' || verboseLevel === null || verboseLevel < 0) {
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
    _pveTicket.ticket = '';
    _pveTicket.csrfPreventionToken = '';
    _pveTicket.timeStamp = 0;

    let _GenerateNewTicket = async () => {
        if (_pveTicket.timeStamp + 7200 < new Date().getTime()) {
            _logger.info('Ticket has expired! Requesting a new PVE Ticket.');
            var response = await pve_utils.PveCurl.Post(
                `${_pveAuthInfo.endpoint}/access/ticket`,
                {
                    username: _pveAuthInfo.username,
                    password: _pveAuthInfo.password
                },
                "",
                ""
            );

            if (response.error !== null) {
                _logger.crit(`Err${response.errorCode}: ${response.error}`);
            } else {
                var resBody = null;

                if (response.body !== 'undefined' && response.body !== null) {
                    var body = response.body;
                    if (typeof (body) === 'string') {
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

        GetApiVersion: () => { return '1.0.0'; },

        Access: {
            Domains: function () {
                return {
                    Get: function () { },

                    Post: function () { },

                    Realm: function (realm) {
                        return {
                            Get: function () { },
                            Put: function () { },
                            Delete: function () { },
                            Sync: function () { },
                        };
                    }
                }
            },

            Groups: function () {
                return {
                    Get: function () { },
                    Post: function () { },
                    GroupID: function (groupid) {
                        return {
                            Get: function () { },
                            Post: function () { },
                            Delete: function () { }
                        }
                    }
                }
            },

            OpenID: function () {
                return {
                    Get: function () { },
                    AuthUrl: {
                        Post: function () { }
                    },
                    Login: {
                        Post: function () { }
                    }
                }
            },

            Roles: function () {
                return {
                    Get: function () { },
                    Post: function () { },

                    RoleID: function (roleid) {
                        return {
                            Get: function () { },
                            Put: function () { },
                            Post: function () { }
                        }
                    }
                }
            },

            Users: function () {
                return {
                    Get: function () { },
                    Post: function () { },
                    UserID: function (userid) {
                        return {
                            Get: function () { },
                            Post: function () { },
                            Delete: function () { },
                            Token: function () {
                                return {
                                    Get: function () { },
                                    TokenID: {
                                        Get: function () { },
                                        Post: function () { },
                                        Put: function () { },
                                        Delete: function () { }
                                    }
                                }
                            },
                            Tfa: {
                                Get: function () { }
                            }
                        }
                    }
                }
            },

            Acl: {
                Get: function () { },
                Put: function () { }
            },
            Password: {
                Put: function () { }
            },
            Permissions: {
                Get: function () { }
            },
            Tfa: {
                Post: function () { },
                Put: function () { }
            },
            Ticket: {
                Get: function () { },
                Post: function () { }
            }
        },

        Cluster: {
            Acme: function () {
                return {
                    Get: function () { },
                    Account: {
                        Get: function () { },
                        Post: function () { },
                        Name: function (name) {
                            return {
                                Get: function () { },
                                Put: function () { },
                                Delete: function () { }
                            }
                        }
                    },

                    Plugins: {
                        Get: function () { },
                        Post: function () { },
                        Id: function (id) {
                            return {
                                Get: function () { },
                                Put: function () { },
                                Delete: function () { }
                            }
                        }
                    },

                    ChallengeSchema: {
                        Get: function () { }
                    },
                    Directories: {
                        Get: function () { }
                    },
                    Tos: {
                        Get: function () { }
                    }
                }
            },

            Backup: function () {
                return {
                    Get: function () { },
                    Post: function () { },
                    Id: function (id) {
                        return {
                            Get: function () { },
                            Put: function () { },
                            Delete: function () { },
                            IncludedVolumes: {
                                Get: function () { }
                            }
                        }
                    }
                }
            },

            BackupInfo: function () {
                return {
                    Get: function () { },
                    NotBackedUp: {
                        Get: function () { }
                    }
                }
            },

            Ceph: {
                Flags: {
                    Get: function () { },
                    Put: function () { },
                    Flag: function (flag) {
                        return {
                            Get: function () { },
                            Put: function () { }
                        }
                    }
                },
                Metadata: {
                    Get: function () { }
                },
                Status: {
                    Get: function () { }
                }
            },

            Config: {
                Get: function () { },
                Post: function () { },
                Nodes: {
                    Get: function () { },
                    Node: function (node) {
                        return {
                            Post: function () { },
                            Delete: function () { }
                        }
                    }
                },
                ApiVersion: {
                    Get: function () { }
                },
                Join: {
                    Get: function () { },
                    Post: function () { }
                },
                QDevice: {
                    Get: function () { }
                },
                Totem: {
                    Get: function () { }
                }
            },

            Firewall: {
                Get: function () { },
                Aliases: {
                    Get: function () { },
                    Post: function () { },
                    Name: function (name) {
                        return {
                            Get: function () { },
                            Put: function () { },
                            Delete: function () { }
                        }
                    }
                },
                Groups: {
                    Get: function () { },
                    Post: function () { },
                    Group: function (group) {
                        return {
                            Get: function () { },
                            Post: function () { },
                            Delete: function () { },
                            Pos: function (pos) {
                                return {
                                    Get: function () { },
                                    Put: function () { },
                                    Delete: function () { }
                                }
                            }
                        }
                    }
                },

                IpSet: {
                    Get: function () { },
                    Post: function () { },
                    Name: function (name) {
                        return {
                            Get: function () { },
                            Post: function () { },
                            Delete: function () { },
                            Cidr: function (cidr) {
                                return {
                                    Get: function () { },
                                    Put: function () { },
                                    Delete: function () { }
                                }
                            }
                        }
                    }
                },

                Rules: {
                    Get: function () { },
                    Post: function () { },
                    Pos: function (pos) {
                        return {
                            Get: function () { },
                            Put: function () { },
                            Delete: function () { }
                        }
                    }
                },

                Macros: {
                    Get: function () { }
                },

                Options: {
                    Get: function () { },
                    Put: function () { }
                },

                Refs: {
                    Get: function () { }
                }
            },

            Ha: {
                Groups: {
                    Get: function () { },
                    Post: function () { },
                    Group: function (group) {
                        return {
                            Get: function () { },
                            Put: function () { },
                            Delete: function () { }
                        }
                    }
                },

                Resources: {
                    Get: function () { },
                    Post: function () { },
                    Sid: function (sid) {
                        return {
                            Get: function () { },
                            Put: function () { },
                            Delete: function () { },
                            Migrate: function () { },
                            Relocate: function () { }
                        }
                    }
                },

                Status: {
                    Get: function () { },
                    Current: function () { },
                    ManagerStatus: function () { }
                }
            },

            Metrics: {
                Get: function () { },
                Server: {
                    Get: function () { },
                    Id: function (id) {
                        return {
                            Get: function () { },
                            Post: function () { },
                            Put: function () { },
                            Delete: function () { }
                        }
                    }
                }
            },

            Replication: {
                Get: function () { },
                Post: function () { },
                Id: function (id) {
                    return {
                        Get: function () { },
                        Put: function () { },
                        Delete: function () { }
                    }
                }
            },

            Sdn: {
                Get: function () { },
                Put: function () { },
                Controllers: {
                    Get: function () { },
                    Post: function () { },
                    Controller: function (controller) {
                        return {
                            Get: function () { },
                            Put: function () { },
                            Delete: function () { }
                        }
                    }
                },

                Dns: {
                    Get: function () { },
                    Post: function () { },
                    Dns: function (dns) {
                        return {
                            Get: function () { },
                            Put: function () { },
                            Delete: function () { }
                        }
                    }
                },
                Ipams: {
                    Get: function () { },
                    Post: function () { },
                    Ipam: function (ipam) {
                        return {
                            Get: function () { },
                            Put: function () { },
                            Delete: function () { }
                        }
                    }
                },
                VNets: {
                    Get: function () { },
                    Post: function () { },
                    VNet: function (vnet) {
                        return {
                            Get: function () { },
                            Put: function () { },
                            Delete: function () { },
                            Subnets: {
                                Get: function () { },
                                Post: function () { },
                                Subnet: function (subnet) {
                                    return {
                                        Get: function () { },
                                        Put: function () { },
                                        Delete: function () { }
                                    }
                                }
                            }
                        }
                    }
                },
                Zones: {
                    Get: function () { },
                    Post: function () { },
                    Zone: function (zone) {
                        return {
                            Get: function () { },
                            Put: function () { },
                            Delete: function () { }
                        }
                    }
                },

                Log: {
                    Get: function () { }
                },
                NextId: {
                    Get: function () { }
                },
                Options: {
                    Get: function () { },
                    Put: function () { }
                },
                Resources: {
                    Get: function () { }
                },
                Status: {
                    Get: function () { }
                },
                Tasks: {
                    Get: function () { }
                }
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
                            }
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
                                return await _pveNodesApi.Node(node).Apt.Repositories.Post(params);
                            },

                            Put: async function (params) {
                                await _GenerateNewTicket();
                                _pveNodesApi._SetTicket(_pveTicket);
                                return await _pveNodesApi.Node(node).Apt.Repositories.Put(params);
                            }
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
                            }
                        },
                        Version: {
                            Get: function () {
                                await _GenerateNewTicket();
                                _pveNodesApi._SetTicket(_pveTicket);
                                return await _pveNodesApi.Node(node).Apt.Version.Get();
                            }
                        }
                    },

                    Capabilities: {
                        Get: function () { },
                        Qemu: {
                            Get: function () { },
                            Cpu: {
                                Get: function () { }
                            },
                            Machines: {
                                Get: function () { }
                            }
                        }
                    },

                    Ceph: {
                        Get: function () { },
                        Fs: {
                            Get: function () { },
                            Name: function (name) {
                                return {
                                    Post: function () { }
                                }
                            }
                        },

                        Mds: {
                            Get: function () { },
                            Name: function (name) {
                                return {
                                    Post: function () { },
                                    Delete: function () { }
                                }
                            }
                        },

                        Mgr: {
                            Get: function () { },
                            Id: function (id) {
                                return {
                                    Post: function () { },
                                    Delete: function () { }
                                }
                            }
                        },

                        Mon: {
                            Get: function () { },
                            MonID: function (monid) {
                                return {
                                    Post: function () { },
                                    Delete: function () { }
                                }
                            }
                        },

                        Osd: {
                            Get: function () { },
                            OsdID: function (osdid) {
                                return {
                                    Delete: function () { },
                                    In: {
                                        Post: function () { }
                                    },
                                    Out: {
                                        Post: function () { }
                                    },
                                    Scrub: {
                                        Post: function () { }
                                    }
                                }
                            }
                        },

                        Pools: {
                            Get: function () { },
                            Post: function () { },
                            Name: function (name) {
                                return {
                                    Get: function () { },
                                    Put: function () { },
                                    Delete: function () { }
                                }
                            }
                        },

                        Config: {
                            Get: function () { }
                        },

                        ConfigDb: {
                            Get: function () { }
                        },

                        Crush: {
                            Get: function () { }
                        },

                        Init: {
                            Post: function () { }
                        },

                        Log: {
                            Get: function () { }
                        },

                        Restart: {
                            Post: function () { }
                        },

                        Rules: {
                            Get: function () { }
                        },

                        Start: {
                            Post: function () { }
                        },

                        Status: {
                            Get: function () { }
                        },

                        Stop: {
                            Post: function () { }
                        }
                    },

                    Certificates: {
                        Get: function () { },
                        Acme: {
                            Get: function () { },
                            Certificate: {
                                Post: function () { },
                                Put: function () { },
                                Delete: function () { }
                            }
                        },

                        Custom: {
                            Post: function () { },
                            Delete: function () { }
                        },

                        Info: {
                            Get: function () { }
                        }
                    },

                    Disks: {
                        Get: function () { },

                        Zfs: {
                            Get: function () { },
                            Post: function () { },
                            Name: function (name) {
                                return {
                                    Get: function () { }
                                }
                            }
                        },

                        Directory: {
                            Get: function () { },
                            Post: function () { }
                        },

                        InitGpt: {
                            Post: function () { }
                        },

                        List: {
                            Get: function () { }
                        },

                        Lvm: {
                            Get: function () { },
                            Post: function () { }
                        },

                        LvmThin: {
                            Get: function () { },
                            Post: function () { }
                        },

                        Smart: {
                            Get: function () { }
                        },

                        WipeDisk: {
                            Put: function () { }
                        }
                    },

                    Firewall: {
                        Get: function () { },

                        Rules: {
                            Get: function () { },
                            Post: function () { },
                            Pos: function (pos) {
                                return {
                                    Get: function () { },
                                    Put: function () { },
                                    Delete: function () { }
                                }
                            }
                        },

                        Log: {
                            Get: function () { }
                        },

                        Options: {
                            Get: function () { },
                            Put: function () { }
                        }
                    },

                    Hardware: {
                        Get: function () { },

                        Pci: {
                            Get: function () { },
                            PciID: function (pciid) {
                                return {
                                    Get: function () { },
                                    Mdev: {
                                        Get: function () { }
                                    }
                                }
                            }
                        },

                        Usb: {
                            Get: function () { }
                        }
                    },

                    Lxc: {
                        Get: function () { },
                        Post: function () { },

                        Vmid: function (vmid) {
                            return {

                                Get: function () { },

                                Delete: function () { },

                                Agent: {
                                    Get: function () { },

                                    Post: function () { },

                                    Exec: {
                                        Post: function () { }
                                    },

                                    ExecStatus: {
                                        Get: function () { }
                                    },

                                    FileRead: {
                                        Get: function () { }
                                    },

                                    FileWrite: {
                                        Post: function () { }
                                    },

                                    FsFreezeFreeze: {
                                        Post: function () { }
                                    },

                                    FsFreezeStatus: {
                                        Post: function () { }
                                    },

                                    FsFreezeThaw: {
                                        Post: function () { }
                                    },

                                    FsTrim: {
                                        Post: function () { }
                                    },

                                    GetFsInfo: {
                                        Get: function () { }
                                    },

                                    GetHostName: {
                                        Get: function () { }
                                    },

                                    GetMemoryBlockInfo: {
                                        Get: function () { }
                                    },

                                    GetMemoryBlocks: {
                                        Get: function () { }
                                    },

                                    GetOsInfo: {
                                        Get: function () { }
                                    },

                                    GetTime: {
                                        Get: function () { }
                                    },

                                    GetTimezone: {
                                        Get: function () { }
                                    },

                                    GetUsers: {
                                        Get: function () { }
                                    },

                                    GetVCpus: {
                                        Get: function () { }
                                    },

                                    Info: {
                                        Get: function () { }
                                    },

                                    NetworkGetInterfaces: {
                                        Get: function () { }
                                    },

                                    Ping: {
                                        Post: function () { }
                                    },

                                    SetUserPassword: {
                                        Post: function () { }
                                    },

                                    Shutdown: {
                                        Post: function () { }
                                    },

                                    SuspendDisk: {
                                        Post: function () { }
                                    },

                                    SuspendHybrid: {
                                        Post: function () { }
                                    },

                                    SuspendRam: {
                                        Post: function () { }
                                    }
                                },

                                CloudInit: {
                                    Dump: {
                                        Get: function () { }
                                    }
                                },

                                Firewall: {
                                    Get: function () { },
                                    Aliases: {
                                        Get: function () { },
                                        Post: function () { },
                                        Name: function (name) {
                                            return {
                                                Get: function () { },
                                                Put: function () { },
                                                Delete: function () { }
                                            }
                                        }
                                    },

                                    IpSet: {
                                        Get: function () { },
                                        Post: function () { },
                                        Name: function (name) {
                                            return {
                                                Get: function () { },
                                                Post: function () { },
                                                Delete: function () { },
                                                Cidr: function (cidr) {
                                                    return {
                                                        Get: function () { },
                                                        Put: function () { },
                                                        Delete: function () { }
                                                    }
                                                }
                                            }
                                        }
                                    },

                                    Rules: {
                                        Get: function () { },
                                        Post: function () { },
                                        Pos: function (pos) {
                                            return {
                                                Get: function () { },
                                                Put: function () { },
                                                Delete: function () { }
                                            }
                                        }
                                    },

                                    Log: {
                                        Get: function () { }
                                    },

                                    Options: {
                                        Get: function () { },
                                        Put: function () { }
                                    },

                                    Refs: {
                                        Get: function () { }
                                    }
                                },

                                SnapShot: {
                                    Get: function () { },
                                    Post: function () { },
                                    SnapName: function (snapname) {
                                        return {
                                            Get: function () { },
                                            Delete: function () { },
                                            Config: {
                                                Get: function () { },
                                                Put: function () { }
                                            },

                                            Rollback: {
                                                Post: function () { }
                                            }
                                        }
                                    }
                                },

                                Status: {
                                    Get: function () { },

                                    Current: {
                                        Get: function () { }
                                    },

                                    Reboot: {
                                        Post: function () { }
                                    },

                                    Reset: {
                                        Post: function () { }
                                    },

                                    Resume: {
                                        Post: function () { }
                                    },

                                    Shutdown: {
                                        Post: function () { }
                                    },

                                    Start: {
                                        Post: function () { }
                                    },

                                    Stop: {
                                        Post: function () { }
                                    },

                                    Suspend: {
                                        Post: function () { }
                                    }
                                },

                                Clone: {
                                    Post: function () { }
                                },

                                Config: {
                                    Get: function () { },
                                    Post: function () { },
                                    Put: function () { }
                                },

                                Feature: {
                                    Get: function () { }
                                },

                                Migrate: {
                                    Get: function () { },
                                    Post: function () { }
                                },

                                Monitor: {
                                    Post: function () { }
                                },

                                MoveDisk: {
                                    MoveDisk: function () { }
                                },

                                Pending: {
                                    Get: function () { }
                                },

                                Resize: {
                                    Put: function () { }
                                },

                                Rrd: {
                                    Get: function () { }
                                },

                                RrdData: {
                                    Get: function () { }
                                },

                                SendKey: {
                                    Put: function () { }
                                },

                                SpiceProxy: {
                                    Post: function () { }
                                },

                                Template: {
                                    Post: function () { }
                                },

                                TermProxy: {
                                    Post: function () { }
                                },

                                Unlink: {
                                    Put: function () { }
                                },

                                VncProxy: {
                                    Post: function () { }
                                },

                                VncWebSocket: {
                                    Get: function () { }
                                }
                            }
                        }
                    },

                    Network: {
                        Get: function () { },
                        Post: function () { },
                        Put: function () { },
                        Delete: function () { },
                        IFace: function (iface) {
                            return {
                                Get: function () { },
                                Put: function () { },
                                Delete: function () { }
                            }
                        }
                    },

                    Qemu: {
                        Get: function () { },
                        Post: function () { },

                        Vmid: function (vmid) {
                            return {

                                Get: function () { },

                                Delete: function () { },

                                Agent: {
                                    Get: function () { },

                                    Post: function () { },

                                    Exec: {
                                        Post: function () { }
                                    },

                                    ExecStatus: {
                                        Get: function () { }
                                    },

                                    FileRead: {
                                        Get: function () { }
                                    },

                                    FileWrite: {
                                        Post: function () { }
                                    },

                                    FsFreezeFreeze: {
                                        Post: function () { }
                                    },

                                    FsFreezeStatus: {
                                        Post: function () { }
                                    },

                                    FsFreezeThaw: {
                                        Post: function () { }
                                    },

                                    FsTrim: {
                                        Post: function () { }
                                    },

                                    GetFsInfo: {
                                        Get: function () { }
                                    },

                                    GetHostName: {
                                        Get: function () { }
                                    },

                                    GetMemoryBlockInfo: {
                                        Get: function () { }
                                    },

                                    GetMemoryBlocks: {
                                        Get: function () { }
                                    },

                                    GetOsInfo: {
                                        Get: function () { }
                                    },

                                    GetTime: {
                                        Get: function () { }
                                    },

                                    GetTimezone: {
                                        Get: function () { }
                                    },

                                    GetUsers: {
                                        Get: function () { }
                                    },

                                    GetVCpus: {
                                        Get: function () { }
                                    },

                                    Info: {
                                        Get: function () { }
                                    },

                                    NetworkGetInterfaces: {
                                        Get: function () { }
                                    },

                                    Ping: {
                                        Post: function () { }
                                    },

                                    SetUserPassword: {
                                        Post: function () { }
                                    },

                                    Shutdown: {
                                        Post: function () { }
                                    },

                                    SuspendDisk: {
                                        Post: function () { }
                                    },

                                    SuspendHybrid: {
                                        Post: function () { }
                                    },

                                    SuspendRam: {
                                        Post: function () { }
                                    }
                                },

                                CloudInit: {
                                    Dump: {
                                        Get: function () { }
                                    }
                                },

                                Firewall: {
                                    Get: function () { },
                                    Aliases: {
                                        Get: function () { },
                                        Post: function () { },
                                        Name: function (name) {
                                            return {
                                                Get: function () { },
                                                Put: function () { },
                                                Delete: function () { }
                                            }
                                        }
                                    },

                                    IpSet: {
                                        Get: function () { },
                                        Post: function () { },
                                        Name: function (name) {
                                            return {
                                                Get: function () { },
                                                Post: function () { },
                                                Delete: function () { },
                                                Cidr: function (cidr) {
                                                    return {
                                                        Get: function () { },
                                                        Put: function () { },
                                                        Delete: function () { }
                                                    }
                                                }
                                            }
                                        }
                                    },

                                    Rules: {
                                        Get: function () { },
                                        Post: function () { },
                                        Pos: function (pos) {
                                            return {
                                                Get: function () { },
                                                Put: function () { },
                                                Delete: function () { }
                                            }
                                        }
                                    },

                                    Log: {
                                        Get: function () { }
                                    },

                                    Options: {
                                        Get: function () { },
                                        Put: function () { }
                                    },

                                    Refs: {
                                        Get: function () { }
                                    }
                                },

                                SnapShot: {
                                    Get: function () { },
                                    Post: function () { },
                                    SnapName: function (snapname) {
                                        return {
                                            Get: function () { },
                                            Delete: function () { },
                                            Config: {
                                                Get: function () { },
                                                Put: function () { }
                                            },

                                            Rollback: {
                                                Post: function () { }
                                            }
                                        }
                                    }
                                },

                                Status: {
                                    Get: function () { },

                                    Current: {
                                        Get: function () { }
                                    },

                                    Reboot: {
                                        Post: function () { }
                                    },

                                    Reset: {
                                        Post: function () { }
                                    },

                                    Resume: {
                                        Post: function () { }
                                    },

                                    Shutdown: {
                                        Post: function () { }
                                    },

                                    Start: {
                                        Post: function () { }
                                    },

                                    Stop: {
                                        Post: function () { }
                                    },

                                    Suspend: {
                                        Post: function () { }
                                    }
                                },

                                Clone: {
                                    Post: function () { }
                                },

                                Config: {
                                    Get: function () { },
                                    Post: function () { },
                                    Put: function () { }
                                },

                                Feature: {
                                    Get: function () { }
                                },

                                Migrate: {
                                    Get: function () { },
                                    Post: function () { }
                                },

                                Monitor: {
                                    Post: function () { }
                                },

                                MoveDisk: {
                                    MoveDisk: function () { }
                                },

                                Pending: {
                                    Get: function () { }
                                },

                                Resize: {
                                    Put: function () { }
                                },

                                Rrd: {
                                    Get: function () { }
                                },

                                RrdData: {
                                    Get: function () { }
                                },

                                SendKey: {
                                    Put: function () { }
                                },

                                SpiceProxy: {
                                    Post: function () { }
                                },

                                Template: {
                                    Post: function () { }
                                },

                                TermProxy: {
                                    Post: function () { }
                                },

                                Unlink: {
                                    Put: function () { }
                                },

                                VncProxy: {
                                    Post: function () { }
                                },

                                VncWebSocket: {
                                    Get: function () { }
                                }
                            }
                        }
                    },

                    Replication: {
                        Get: function () { },

                        Id: function (id) {
                            return {
                                Get: function () { },
                                Log: {
                                    Get: function () { }
                                },

                                ScheduleNow: {
                                    Post: function () { }
                                },

                                Status: {
                                    Get: function () { }
                                }
                            }
                        }
                    },

                    Scan: {
                        Get: function () { },
                        Cifs: {
                            Get: function () { }
                        },

                        GlusterFS: {
                            Get: function () { }
                        },

                        Iscsi: {
                            Get: function () { }
                        },

                        Lvm: {
                            Get: function () { }
                        },

                        LvmThin: {
                            Get: function () { }
                        },

                        Nfs: {
                            Get: function () { }
                        },

                        Pbs: {
                            Get: function () { }
                        },

                        Zfs: {
                            Get: function () { }
                        }
                    },

                    Sdn: {
                        Get: function () { },
                        Zones: {
                            Get: function () { },
                            Zone: function (zone) {
                                return {
                                    Get: function () { },
                                    Content: {
                                        Get: function () { }
                                    }
                                }
                            }
                        }
                    },

                    Services: {
                        Get: function () { },
                        Service: function (service) {
                            return {
                                Get: function () { },
                                Reload: {
                                    Post: function () { }
                                },

                                Restart: {
                                    Post: function () { }
                                },

                                Start: {
                                    Post: function () { }
                                },

                                State: {
                                    Get: function () { }
                                },

                                Stop: {
                                    Post: function () { }
                                }
                            }
                        }
                    },

                    Storage: {
                        Get: function () { },
                        Storage: function (storage) {
                            return {
                                Get: function () { },
                                Content: {
                                    Get: function () { },
                                    Post: function () { },
                                    Volume: function (volume) {
                                        return {
                                            Get: function () { },
                                            Post: function () { },
                                            Put: function () { },
                                            Delete: function () { }
                                        }
                                    }
                                },

                                FileRestore: {
                                    Download: {
                                        Get: function () { }
                                    },
                                    List: {
                                        Get: function () { }
                                    }
                                },

                                DownloadUrl: {
                                    Post: function () { }
                                },

                                PruneBackups: {
                                    Get: function () { },
                                    Delete: function () { }
                                },

                                Rrd: {
                                    Get: function () { }
                                },

                                RrdData: {
                                    Get: function () { }
                                },

                                Status: {
                                    Get: function () { }
                                },

                                Upload: {
                                    Post: function () { }
                                }
                            }
                        }
                    },

                    Tasks: {
                        Get: function () { },
                        Upid: function (upid) {
                            return {
                                Get: function () { },
                                Delete: function () { },
                                Log: {
                                    Get: function () { }
                                },
                                Status: {
                                    Get: function () { }
                                }
                            }
                        }
                    },

                    VZDump: {
                        Post: function () { },
                        Defaults: {
                            Get: function () { }
                        },
                        ExtractConfig: {
                            Get: function () { }
                        }
                    },

                    AplInfo: {
                        Get: function () { },
                        Post: function () { }
                    },

                    Config: {
                        Get: function () { },
                        Put: function () { }
                    },
                    Dns: {
                        Get: function () { },
                        Put: function () { }
                    },
                    Execute: {
                        Get: function () { },
                        Put: function () { }
                    },
                    Hosts: {
                        Get: function () { },
                        Post: function () { }
                    },
                    Journal: {
                        Get: function () { }
                    },
                    MigrateAll: {
                        Post: function () { }
                    },
                    NetStat: {
                        Get: function () { }
                    },
                    Report: {
                        Get: function () { }
                    },
                    Rrd: {
                        Get: function () { }
                    },
                    RrdData: {
                        Get: function () { }
                    },
                    SpiceShell: {
                        Post: function () { }
                    },
                    StartAll: {
                        Post: function () { }
                    },
                    Status: {
                        Get: function () { },
                        Post: function () { }
                    },
                    StopAll: {
                        Post: function () { }
                    },
                    Subscription: {
                        Get: function () { },
                        Post: function () { },
                        Put: function () { },
                        Delete: function () { }
                    },
                    SysLog: {
                        Get: function () { }
                    },
                    TermProxy: {
                        Post: function () { }
                    },
                    Time: {
                        Get: function () { },
                        Put: function () { }
                    },
                    Version: {
                        Get: function () { }
                    },
                    VncShell: {
                        Post: function () { }
                    },
                    VncWebSocket: {
                        Get: function () { }
                    },
                    WakeOnLan: {
                        Post: function () { }
                    },
                }
            }
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
                return await _pvePoolsApi.Post(params)
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
                    }
                }
            }
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
                    }
                }
            }
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
            }
        },
    };

    return Module;
}