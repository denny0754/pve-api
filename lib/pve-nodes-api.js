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
			logging.Info(`SSL Verify Host set to ${sslVerifyHost}`);
			pveCurl.PveCurl.SetSslVerifyHost(sslVerifyHost);
		},

		SetAuthenticator: (authenticator) => {
			pveAuth = authenticator;
		},

		Get: async function () {
			return await pveCurl.PveCurl.Get(
				`${pveAuth.GetEndpoint()}/nodes`,
				{},
				{},
				{ PVEAuthCookie: pveAuth.GetAuthCookie() }
			);
		},

		Node: function (node) {
			return {
				Get: async function () {
					return await pveCurl.PveCurl.Get(
						`${pveAuth.GetEndpoint()}/nodes/${node}`,
						{},
						{},
						{ PVEAuthCookie: pveAuth.GetAuthCookie() }
					);
				},

				Apt: {
					Get: async function () {
						return await pveCurl.PveCurl.Get(
							`${pveAuth.GetEndpoint()}/nodes/${node}/apt`,
							{},
							{},
							{ PVEAuthCookie: pveAuth.GetAuthCookie() }
						);
					},

					ChangeLog: {
						Get: async function (params) {
							return await pveCurl.PveCurl.Get(
								`${pveAuth.GetEndpoint()}/nodes/${node}/apt/changelog`,
								params,
								{},
								{ PVEAuthCookie: pveAuth.GetAuthCookie() }
							);
						},
					},
					Repositories: {
						Get: async function () {
							return await pveCurl.PveCurl.Get(
								`${pveAuth.GetEndpoint()}/nodes/${node}/apt/repositories`,
								{},
								{},
								{ PVEAuthCookie: pveAuth.GetAuthCookie() }
							);
						},

						Post: async function (params) {
							return await pveCurl.PveCurl.Post(
								`${pveAuth.GetEndpoint()}/nodes/${node}/apt/repositories`,
								params,
								{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
								{ PVEAuthCookie: pveAuth.GetAuthCookie() }
							);
						},

						Put: async function (params) {
							return await pveCurl.PveCurl.Put(
								`${pveAuth.GetEndpoint()}/nodes/${node}/apt/repositories`,
								params,
								{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
								{ PVEAuthCookie: pveAuth.GetAuthCookie() }
							);
						},
					},

					Update: {
						Get: async function () {
							return await pveCurl.PveCurl.Get(
								`${pveAuth.GetEndpoint()}/nodes/${node}/apt/update`,
								{},
								{},
								{ PVEAuthCookie: pveAuth.GetAuthCookie() }
							);
						},

						Post: async function (params) {
							return await pveCurl.PveCurl.Post(
								`${pveAuth.GetEndpoint()}/nodes/${node}/apt/update`,
								params,
								{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
								{ PVEAuthCookie: pveAuth.GetAuthCookie() }
							);
						},
					},
					Version: {
						Get: async function () {
							return await pveCurl.PveCurl.Get(
								`${pveAuth.GetEndpoint()}/nodes/${node}/apt/version`,
								{},
								{},
								{ PVEAuthCookie: pveAuth.GetAuthCookie() }
							);
						},
					},
				},

				Capabilities: {
					Get: async function () {
						return await pveCurl.PveCurl.Get(
							`${pveAuth.GetEndpoint()}/nodes/${node}/capabilities`,
							{},
							{},
							{ PVEAuthCookie: pveAuth.GetAuthCookie() }
						);
					},

					Qemu: {
						Get: async function () {
							return await pveCurl.PveCurl.Get(
								`${pveAuth.GetEndpoint()}/nodes/${node}/capabilities/qemu`,
								{},
								{},
								{ PVEAuthCookie: pveAuth.GetAuthCookie() }
							);
						},

						Cpu: {
							Get: async function () {
								return await pveCurl.PveCurl.Get(
									`${pveAuth.GetEndpoint()}/nodes/${node}/capabilities/qemu/cpu`,
									{},
									{},
									{ PVEAuthCookie: pveAuth.GetAuthCookie() }
								);
							},
						},
						Machines: {
							Get: async function () {
								return await pveCurl.PveCurl.Get(
									`${pveAuth.GetEndpoint()}/nodes/${node}/capabilities/qemu/machines`,
									{},
									{},
									{ PVEAuthCookie: pveAuth.GetAuthCookie() }
								);
							},
						},
					},
				},

				Ceph: {
					Get: async function () {
						return await pveCurl.PveCurl.Get(
							`${pveAuth.GetEndpoint()}/nodes/${node}/ceph`,
							{},
							{},
							{ PVEAuthCookie: pveAuth.GetAuthCookie() }
						);
					},
					Fs: {
						Get: async function () {
							return await pveCurl.PveCurl.Get(
								`${pveAuth.GetEndpoint()}/nodes/${node}/ceph/fs`,
								{},
								{},
								{ PVEAuthCookie: pveAuth.GetAuthCookie() }
							);
						},

						Name: function (name) {
							return {
								Post: async function (params) {
									return await pveCurl.PveCurl.Post(
										`${pveAuth.GetEndpoint()}/nodes/${node}/ceph/${name}`,
										params,
										{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
										{ PVEAuthCookie: pveAuth.GetAuthCookie() }
									);
								},
							};
						},
					},

					Mds: {
						Get: async function () {
							return await pveCurl.PveCurl.Get(
								`${pveAuth.GetEndpoint()}/nodes/${node}/ceph/mds`,
								{},
								{},
								{ PVEAuthCookie: pveAuth.GetAuthCookie() }
							);
						},

						Name: function (name) {
							return {
								Post: async function (params) {
									return await pveCurl.PveCurl.Get(
										`${pveAuth.GetEndpoint()}/nodes/${node}/ceph/mds/${name}`,
										params,
										{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
										{ PVEAuthCookie: pveAuth.GetAuthCookie() }
									);
								},

								Delete: async function (params) {
									return await pveCurl.PveCurl.Get(
										`${pveAuth.GetEndpoint()}/nodes/${node}/ceph/mds/${name}`,
										params,
										{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
										{ PVEAuthCookie: pveAuth.GetAuthCookie() }
									);
								},
							};
						},
					},

					Mgr: {
						Get: async function () {
							return await pveCurl.PveCurl.Get(
								`${pveAuth.GetEndpoint()}/nodes/${node}/ceph/mgr`,
								{},
								{},
								{ PVEAuthCookie: pveAuth.GetAuthCookie() }
							);
						},
						Id: function (id) {
							return {
								Post: async function (params) {
									return await pveCurl.PveCurl.Get(
										`${pveAuth.GetEndpoint()}/nodes/${node}/ceph/mgr/${id}`,
										params,
										{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
										{ PVEAuthCookie: pveAuth.GetAuthCookie() }
									);
								},
								Delete: async function (params) {
									return await pveCurl.PveCurl.Get(
										`${pveAuth.GetEndpoint()}/nodes/${node}/ceph/mgr/${id}`,
										params,
										{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
										{ PVEAuthCookie: pveAuth.GetAuthCookie() }
									);
								},
							};
						},
					},

					Mon: {
						Get: async function () {
							return await pveCurl.PveCurl.Get(
								`${pveAuth.GetEndpoint()}/nodes/${node}/ceph/mon`,
								{},
								{},
								{ PVEAuthCookie: pveAuth.GetAuthCookie() }
							);
						},

						MonID: async function (monid) {
							return {
								Post: async function (params) {
									return await pveCurl.PveCurl.Get(
										`${pveAuth.GetEndpoint()}/nodes/${node}/ceph/mon/${monid}`,
										params,
										{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
										{ PVEAuthCookie: pveAuth.GetAuthCookie() }
									);
								},

								Delete: async function (params) {
									return await pveCurl.PveCurl.Get(
										`${pveAuth.GetEndpoint()}/nodes/${node}/ceph/mon/${monid}`,
										params,
										{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
										{ PVEAuthCookie: pveAuth.GetAuthCookie() }
									);
								},
							};
						},
					},

					Osd: {
						Get: async function () {
							return await pveCurl.PveCurl.Get(
								`${pveAuth.GetEndpoint()}/nodes/${node}/ceph/osd`,
								{},
								{},
								{ PVEAuthCookie: pveAuth.GetAuthCookie() }
							);
						},

						Post: async function (params) {
							return await pveCurl.PveCurl.Post(
								`${pveAuth.GetEndpoint()}/nodes/${node}/ceph/osd`,
								params,
								{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
								{ PVEAuthCookie: pveAuth.GetAuthCookie() }
							);
						},

						OsdID: function (osdid) {
							return {
								Delete: async function (params) {
									return await pveCurl.PveCurl.Get(
										`${pveAuth.GetEndpoint()}/nodes/${node}/ceph/osd/${osdid}`,
										params,
										{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
										{ PVEAuthCookie: pveAuth.GetAuthCookie() }
									);
								},
								In: {
									Post: async function (params) {
										return await pveCurl.PveCurl.Post(
											`${pveAuth.GetEndpoint()}/nodes/${node}/ceph/osd/${osdid}/in`,
											params,
											{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
											{ PVEAuthCookie: pveAuth.GetAuthCookie() }
										);
									},
								},
								Out: {
									Post: async function (params) {
										return await pveCurl.PveCurl.Post(
											`${pveAuth.GetEndpoint()}/nodes/${node}/ceph/osd/${osdid}/out`,
											params,
											{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
											{ PVEAuthCookie: pveAuth.GetAuthCookie() }
										);
									},
								},
								Scrub: {
									Post: async function (params) {
										return await pveCurl.PveCurl.Post(
											`${pveAuth.GetEndpoint()}/nodes/${node}/ceph/osd/${osdid}/scrub`,
											params,
											{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
											{ PVEAuthCookie: pveAuth.GetAuthCookie() }
										);
									},
								},
							};
						},
					},

					Pools: {
						Get: async function () {
							return await pveCurl.PveCurl.Get(
								`${pveAuth.GetEndpoint()}/nodes/${node}/ceph/pools`,
								{},
								{},
								{ PVEAuthCookie: pveAuth.GetAuthCookie() }
							);
						},

						Post: async function (params) {
							return await pveCurl.PveCurl.Post(
								`${pveAuth.GetEndpoint()}/nodes/${node}/ceph/pools`,
								params,
								{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
								{ PVEAuthCookie: pveAuth.GetAuthCookie() }
							);
						},

						Name: function (name) {
							return {
								Get: async function (params) {
									return await pveCurl.PveCurl.Get(
										`${pveAuth.GetEndpoint()}/nodes/${node}/ceph/pools/${name}`,
										params,
										{},
										{ PVEAuthCookie: pveAuth.GetAuthCookie() }
									);
								},

								Put: async function (params) {
									return await pveCurl.PveCurl.Put(
										`${pveAuth.GetEndpoint()}/nodes/${node}/ceph/pools/${name}`,
										params,
										{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
										{ PVEAuthCookie: pveAuth.GetAuthCookie() }
									);
								},

								Delete: async function (params) {
									return await pveCurl.PveCurl.Delete(
										`${pveAuth.GetEndpoint()}/nodes/${node}/ceph/pools/${name}`,
										params,
										{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
										{ PVEAuthCookie: pveAuth.GetAuthCookie() }
									);
								},
							};
						},
					},

					Config: {
						Get: async function () {
							return await pveCurl.PveCurl.Get(
								`${pveAuth.GetEndpoint()}/nodes/${node}/ceph/config`,
								{},
								{},
								{ PVEAuthCookie: pveAuth.GetAuthCookie() }
							);
						},
					},

					ConfigDb: {
						Get: async function () {
							return await pveCurl.PveCurl.Get(
								`${pveAuth.GetEndpoint()}/nodes/${node}/ceph/configdb`,
								{},
								{},
								{ PVEAuthCookie: pveAuth.GetAuthCookie() }
							);
						},
					},

					Crush: {
						Get: async function () {
							return await pveCurl.PveCurl.Get(
								`${pveAuth.GetEndpoint()}/nodes/${node}/ceph/crush`,
								{},
								{},
								{ PVEAuthCookie: pveAuth.GetAuthCookie() }
							);
						},
					},

					Init: {
						Post: async function () {
							return await pveCurl.PveCurl.Get(
								`${pveAuth.GetEndpoint()}/nodes/${node}/ceph/init`,
								{},
								{},
								{ PVEAuthCookie: pveAuth.GetAuthCookie() }
							);
						},
					},

					Log: {
						Get: async function () {
							return await pveCurl.PveCurl.Get(
								`${pveAuth.GetEndpoint()}/nodes/${node}/ceph/log`,
								{},
								{},
								{ PVEAuthCookie: pveAuth.GetAuthCookie() }
							);
						},
					},

					Restart: {
						Post: async function (params) {
							return await pveCurl.PveCurl.Get(
								`${pveAuth.GetEndpoint()}/nodes/${node}/ceph/config`,
								params,
								{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
								{ PVEAuthCookie: pveAuth.GetAuthCookie() }
							);
						},
					},

					Rules: {
						Get: async function () {
							return await pveCurl.PveCurl.Get(
								`${pveAuth.GetEndpoint()}/nodes/${node}/ceph/rules`,
								{},
								{},
								{ PVEAuthCookie: pveAuth.GetAuthCookie() }
							);
						},
					},

					Start: {
						Post: async function (params) {
							return await pveCurl.PveCurl.Get(
								`${pveAuth.GetEndpoint()}/nodes/${node}/ceph/start`,
								params,
								{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
								{ PVEAuthCookie: pveAuth.GetAuthCookie() }
							);
						},
					},

					Status: {
						Get: async function () {
							return await pveCurl.PveCurl.Get(
								`${pveAuth.GetEndpoint()}/nodes/${node}/ceph/status`,
								{},
								{},
								{ PVEAuthCookie: pveAuth.GetAuthCookie() }
							);
						},
					},

					Stop: {
						Post: async function (params) {
							return await pveCurl.PveCurl.Get(
								`${pveAuth.GetEndpoint()}/nodes/${node}/ceph/stop`,
								params,
								{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
								{ PVEAuthCookie: pveAuth.GetAuthCookie() }
							);
						},
					},
				},

				Certificates: {
					Get: async function () {
						return await pveCurl.PveCurl.Get(
							`${pveAuth.GetEndpoint()}/nodes/${node}/certificates`,
							{},
							{},
							{ PVEAuthCookie: pveAuth.GetAuthCookie() }
						);
					},

					Acme: {
						Get: async function () {
							return await pveCurl.PveCurl.Get(
								`${pveAuth.GetEndpoint()}/nodes/${node}/certificates/acme`,
								{},
								{},
								{ PVEAuthCookie: pveAuth.GetAuthCookie() }
							);
						},

						Certificate: {
							Post: async function (params) {
								return await pveCurl.PveCurl.Post(
									`${pveAuth.GetEndpoint()}/nodes/${node}/certificates/acme/certificate`,
									params,
									{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
									{ PVEAuthCookie: pveAuth.GetAuthCookie() }
								);
							},

							Put: async function (params) {
								return await pveCurl.PveCurl.Put(
									`${pveAuth.GetEndpoint()}/nodes/${node}/certificates/acme/certificate`,
									params,
									{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
									{ PVEAuthCookie: pveAuth.GetAuthCookie() }
								);
							},

							Delete: async function () {
								return await pveCurl.PveCurl.Delete(
									`${pveAuth.GetEndpoint()}/nodes/${node}/certificates/acme/certificate`,
									{},
									{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
									{ PVEAuthCookie: pveAuth.GetAuthCookie() }
								);
							},
						},
					},

					Custom: {
						Post: async function (params) {
							return await pveCurl.PveCurl.Post(
								`${pveAuth.GetEndpoint()}/nodes/${node}/certificates/custom`,
								params,
								{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
								{ PVEAuthCookie: pveAuth.GetAuthCookie() }
							);
						},

						Delete: async function (params) {
							return await pveCurl.PveCurl.Delete(
								`${pveAuth.GetEndpoint()}/nodes/${node}/certificates/custom`,
								params,
								{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
								{ PVEAuthCookie: pveAuth.GetAuthCookie() }
							);
						},
					},

					Info: {
						Get: async function () {
							return await pveCurl.PveCurl.Get(
								`${pveAuth.GetEndpoint()}/nodes/${node}/certificates/info`,
								{},
								{},
								{ PVEAuthCookie: pveAuth.GetAuthCookie() }
							);
						},
					},
				},

				Disks: {
					Get: async function () {
						return await pveCurl.PveCurl.Get(
							`${pveAuth.GetEndpoint()}/nodes/${node}/disks`,
							{},
							{},
							{ PVEAuthCookie: pveAuth.GetAuthCookie() }
						);
					},

					Zfs: {
						Get: async function () {
							return await pveCurl.PveCurl.Get(
								`${pveAuth.GetEndpoint()}/nodes/${node}/disks/zfs`,
								{},
								{},
								{ PVEAuthCookie: pveAuth.GetAuthCookie() }
							);
						},

						Post: async function (params) {
							return await pveCurl.PveCurl.Post(
								`${pveAuth.GetEndpoint()}/nodes/${node}/disks/zfs`,
								params,
								{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
								{ PVEAuthCookie: pveAuth.GetAuthCookie() }
							);
						},

						Name: function (name) {
							return {
								Get: async function () {
									return await pveCurl.PveCurl.Get(
										`${pveAuth.GetEndpoint()}/nodes/${node}/disks/zfs/${name}`,
										{},
										{},
										{ PVEAuthCookie: pveAuth.GetAuthCookie() }
									);
								},
							};
						},
					},

					Directory: {
						Get: async function () {
							return await pveCurl.PveCurl.Get(
								`${pveAuth.GetEndpoint()}/nodes/${node}/disks/directory`,
								{},
								{},
								{ PVEAuthCookie: pveAuth.GetAuthCookie() }
							);
						},

						Post: async function (params) {
							return await pveCurl.PveCurl.Post(
								`${pveAuth.GetEndpoint()}/nodes/${node}/disks/directory`,
								params,
								{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
								{ PVEAuthCookie: pveAuth.GetAuthCookie() }
							);
						},
					},

					InitGpt: {
						Post: async function (params) {
							return await pveCurl.PveCurl.Post(
								`${pveAuth.GetEndpoint()}/nodes/${node}/disks/initgpt`,
								params,
								{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
								{ PVEAuthCookie: pveAuth.GetAuthCookie() }
							);
						},
					},

					List: {
						Get: async function (params) {
							return await pveCurl.PveCurl.Get(
								`${pveAuth.GetEndpoint()}/nodes/${node}/disks/list`,
								params,
								{},
								{ PVEAuthCookie: pveAuth.GetAuthCookie() }
							);
						},
					},

					Lvm: {
						Get: async function () {
							return await pveCurl.PveCurl.Get(
								`${pveAuth.GetEndpoint()}/nodes/${node}/disks/lvm`,
								{},
								{},
								{ PVEAuthCookie: pveAuth.GetAuthCookie() }
							);
						},

						Post: async function (params) {
							return await pveCurl.PveCurl.Post(
								`${pveAuth.GetEndpoint()}/nodes/${node}/disks/lvm`,
								params,
								{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
								{ PVEAuthCookie: pveAuth.GetAuthCookie() }
							);
						},
					},

					LvmThin: {
						Get: async function () {
							return await pveCurl.PveCurl.Get(
								`${pveAuth.GetEndpoint()}/nodes/${node}/disks/lvmthin`,
								{},
								{},
								{ PVEAuthCookie: pveAuth.GetAuthCookie() }
							);
						},

						Post: async function (params) {
							return await pveCurl.PveCurl.Post(
								`${pveAuth.GetEndpoint()}/nodes/${node}/disks/lvmthin`,
								params,
								{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
								{ PVEAuthCookie: pveAuth.GetAuthCookie() }
							);
						},
					},

					Smart: {
						Get: async function (params) {
							return await pveCurl.PveCurl.Get(
								`${pveAuth.GetEndpoint()}/nodes/${node}/disks/smart`,
								params,
								{},
								{ PVEAuthCookie: pveAuth.GetAuthCookie() }
							);
						},
					},

					WipeDisk: {
						Put: async function () {
							return await pveCurl.PveCurl.Put(
								`${pveAuth.GetEndpoint()}/nodes/${node}/disks/wipedisk`,
								params,
								{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
								{ PVEAuthCookie: pveAuth.GetAuthCookie() }
							);
						},
					},
				},

				Firewall: {
					Get: async function () {
						return await pveCurl.PveCurl.Get(
							`${pveAuth.GetEndpoint()}/nodes/${node}/firewall`,
							{},
							{},
							{ PVEAuthCookie: pveAuth.GetAuthCookie() }
						);
					},

					Rules: {
						Get: async function () {
							return await pveCurl.PveCurl.Get(
								`${pveAuth.GetEndpoint()}/nodes/${node}/firewall/rules`,
								{},
								{},
								{ PVEAuthCookie: pveAuth.GetAuthCookie() }
							);
						},

						Post: async function (params) {
							return await pveCurl.PveCurl.Post(
								`${pveAuth.GetEndpoint()}/nodes/${node}/firewall/rules`,
								params,
								{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
								{ PVEAuthCookie: pveAuth.GetAuthCookie() }
							);
						},

						Pos: function (pos) {
							return {
								Get: async function () {
									return await pveCurl.PveCurl.Get(
										`${pveAuth.GetEndpoint()}/nodes/${node}/firewall/rules/${pos}`,
										{},
										{},
										{ PVEAuthCookie: pveAuth.GetAuthCookie() }
									);
								},

								Put: async function (params) {
									return await pveCurl.PveCurl.Put(
										`${pveAuth.GetEndpoint()}/nodes/${node}/firewall/rules/${pos}`,
										{ params },
										{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
										{ PVEAuthCookie: pveAuth.GetAuthCookie() }
									);
								},

								Delete: async function (params) {
									return await pveCurl.PveCurl.Delete(
										`${pveAuth.GetEndpoint()}/nodes/${node}/firewall/rules/${pos}`,
										{ params },
										{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
										{ PVEAuthCookie: pveAuth.GetAuthCookie() }
									);
								},
							};
						},
					},

					Log: {
						Get: async function () {
							return await pveCurl.PveCurl.Get(
								`${pveAuth.GetEndpoint()}/nodes/${node}/firewall/log`,
								{},
								{},
								{ PVEAuthCookie: pveAuth.GetAuthCookie() }
							);
						},
					},

					Options: {
						Get: async function () {
							return await pveCurl.PveCurl.Get(
								`${pveAuth.GetEndpoint()}/nodes/${node}/firewall/options`,
								{},
								{},
								{ PVEAuthCookie: pveAuth.GetAuthCookie() }
							);
						},

						Put: async function (params) {
							return await pveCurl.PveCurl.Put(
								`${pveAuth.GetEndpoint()}/nodes/${node}/firewall/options`,
								{ params },
								{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
								{ PVEAuthCookie: pveAuth.GetAuthCookie() }
							);
						},
					},
				},

				Hardware: {
					Get: async function () {
						return await pveCurl.PveCurl.Get(
							`${pveAuth.GetEndpoint()}/nodes/${node}/hardware`,
							{},
							{},
							{ PVEAuthCookie: pveAuth.GetAuthCookie() }
						);
					},

					Pci: {
						Get: async function () {
							return await pveCurl.PveCurl.Get(
								`${pveAuth.GetEndpoint()}/nodes/${node}/hardware/pci`,
								{},
								{},
								{ PVEAuthCookie: pveAuth.GetAuthCookie() }
							);
						},

						PciID: function (pciid) {
							return {
								Get: async function () {
									return await pveCurl.PveCurl.Get(
										`${pveAuthInfo.apiTicket.endpoint}/nodes/${node}/hardware/pci/${pciid}`,
										{},
										{},
										{ PVEAuthCookie: pveAuth.GetAuthCookie() }
									);
								},

								Mdev: {
									Get: async function () {
										return await pveCurl.PveCurl.Get(
											`${pveAuthInfo.apiTicket.endpoint}/nodes/${node}/hardware/pci/${pciid}`,
											{},
											{},
											{ PVEAuthCookie: pveAuth.GetAuthCookie() }
										);
									},
								},
							};
						},
					},

					Usb: {
						Get: async function () {
							return pveCurl.PveCurl.Get(
								`${pveAuthInfo.apiTicket.endpoint}/nodes/${node}/hardware/usb`,
								{},
								{},
								{ PVEAuthCookie: pveAuth.GetAuthCookie() }
							);
						},
					},
				},

				Lxc: {
					Get: async function () {
						return await pveCurl.PveCurl.Get(
							`${pveAuth.GetEndpoint()}/nodes/${node}/lxc`,
							{},
							{},
							{ PVEAuthCookie: pveAuth.GetAuthCookie() }
						);
					},

					Post: async function (params) {
						return await pveCurl.PveCurl.Post(
							`${pveAuth.GetEndpoint()}/nodes/${node}/lxc`,
							params,
							{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
							{ PVEAuthCookie: pveAuth.GetAuthCookie() }
						);
					},

					Vmid: function (vmid) {
						return {
							Get: async function () {
								return await pveCurl.PveCurl.Get(
									`${pveAuth.GetEndpoint()}/nodes/${node}/lxc/${vmid}`,
									{},
									{},
									{ PVEAuthCookie: pveAuth.GetAuthCookie() }
								);
							},

							Delete: async function (params) {
								return await pveCurl.PveCurl.Delete(
									`${pveAuth.GetEndpoint()}/nodes/${node}/lxc/${vmid}`,
									params,
									{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
									{ PVEAuthCookie: pveAuth.GetAuthCookie() }
								);
							},

							Firewall: {
								Get: async function () {
									return await pveCurl.PveCurl.Get(
										`${pveAuth.GetEndpoint()}/nodes/${node}/lxc/${vmid}/firewall`,
										{},
										{},
										{ PVEAuthCookie: pveAuth.GetAuthCookie() }
									);
								},

								Aliases: {
									Get: async function () {
										return await pveCurl.PveCurl.Get(
											`${pveAuth.GetEndpoint()}/nodes/${node}/lxc/${vmid}/firewall/aliases`,
											{},
											{},
											{ PVEAuthCookie: pveAuth.GetAuthCookie() }
										);
									},

									Post: async function (params) {
										return await pveCurl.PveCurl.Post(
											`${pveAuth.GetEndpoint()}/nodes/${node}/lxc/${vmid}/firewall/aliases`,
											params,
											{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
											{
												PVEAuthCookie:
													pveAuthInfo.apiTicket.csrfPreventionToken,
											}
										);
									},

									Name: function (name) {
										return {
											Get: async function () {
												return await pveCurl.PveCurl.Get(
													`${pveAuth.GetEndpoint()}/nodes/${node}/lxc/${vmid}/firewall/aliases/${name}`,
													{},
													{},
													{ PVEAuthCookie: pveAuth.GetAuthCookie() }
												);
											},

											Put: async function (params) {
												return await pveCurl.PveCurl.Put(
													`${pveAuth.GetEndpoint()}/nodes/${node}/lxc/${vmid}/firewall/aliases/${name}`,
													params,
													{
														CSRFPreventionToken:
															pveAuth.GetCsrfPreventionToken(),
													},
													{ PVEAuthCookie: pveAuth.GetAuthCookie() }
												);
											},

											Delete: async function (params) {
												return await pveCurl.PveCurl.Delete(
													`${pveAuth.GetEndpoint()}/nodes/${node}/lxc/${vmid}/firewall/aliases/${name}`,
													params,
													{
														CSRFPreventionToken:
															pveAuth.GetCsrfPreventionToken(),
													},
													{ PVEAuthCookie: pveAuth.GetAuthCookie() }
												);
											},
										};
									},
								},

								IpSet: {
									Get: async function () {
										return await pveCurl.PveCurl.Get(
											`${pveAuth.GetEndpoint()}/nodes/${node}/lxc/${vmid}/firewall/ipset`,
											{},
											{},
											{ PVEAuthCookie: pveAuth.GetAuthCookie() }
										);
									},

									Post: async function (params) {
										return await pveCurl.PveCurl.Post(
											`${pveAuth.GetEndpoint()}/nodes/${node}/lxc/${vmid}/firewall/ipset`,
											params,
											{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
											{ PVEAuthCookie: pveAuth.GetAuthCookie() }
										);
									},

									Name: function (name) {
										return {
											Get: async function () {
												return await pveCurl.PveCurl.Get(
													`${pveAuth.GetEndpoint()}/nodes/${node}/lxc/${vmid}/firewall/ipset/name`,
													{},
													{},
													{ PVEAuthCookie: pveAuth.GetAuthCookie() }
												);
											},

											Post: async function (params) {
												return await pveCurl.PveCurl.Post(
													`${pveAuth.GetEndpoint()}/nodes/${node}/lxc/${vmid}/firewall/ipset/name`,
													params,
													{
														CSRFPreventionToken:
															pveAuth.GetCsrfPreventionToken(),
													},
													{ PVEAuthCookie: pveAuth.GetAuthCookie() }
												);
											},

											Delete: async function () {
												return await pveCurl.PveCurl.Delete(
													`${pveAuth.GetEndpoint()}/nodes/${node}/lxc/${vmid}/firewall/ipset/name`,
													{},
													{
														CSRFPreventionToken:
															pveAuth.GetCsrfPreventionToken(),
													},
													{ PVEAuthCookie: pveAuth.GetAuthCookie() }
												);
											},

											Cidr: function (cidr) {
												return {
													Get: async function () {
														return await pveCurl.PveCurl.Get(
															`${pveAuth.GetEndpoint()}/nodes/${node}/lxc/${vmid}/firewall/ipset/name/${cidr}`,
															{},
															{},
															{ PVEAuthCookie: pveAuth.GetAuthCookie() }
														);
													},

													Put: async function (params) {
														return await pveCurl.PveCurl.Put(
															`${pveAuth.GetEndpoint()}/nodes/${node}/lxc/${vmid}/firewall/ipset/name/${cidr}`,
															params,
															{
																CSRFPreventionToken:
																	pveAuthInfo.apiTicket.csrfPreventionToken,
															},
															{ PVEAuthCookie: pveAuth.GetAuthCookie() }
														);
													},

													Delete: async function (params) {
														return await pveCurl.PveCurl.Delete(
															`${pveAuth.GetEndpoint()}/nodes/${node}/lxc/${vmid}/firewall/ipset/name/${cidr}`,
															params,
															{
																CSRFPreventionToken:
																	pveAuthInfo.apiTicket.csrfPreventionToken,
															},
															{ PVEAuthCookie: pveAuth.GetAuthCookie() }
														);
													},
												};
											},
										};
									},
								},

								Rules: {
									Get: async function () {
										return await pveCurl.PveCurl.Get(
											`${pveAuth.GetEndpoint()}/nodes/${node}/lxc/${vmid}/firewall/rules`,
											{},
											{},
											{ PVEAuthCookie: pveAuth.GetAuthCookie() }
										);
									},

									Post: async function (params) {
										return await pveCurl.PveCurl.Post(
											`${pveAuth.GetEndpoint()}/nodes/${node}/lxc/${vmid}/firewall/rules`,
											params,
											{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
											{ PVEAuthCookie: pveAuth.GetAuthCookie() }
										);
									},

									Pos: function (pos) {
										return {
											Get: async function () {
												return await pveCurl.PveCurl.Get(
													`${pveAuth.GetEndpoint()}/nodes/${node}/lxc/${vmid}/firewall/rules/${pos}`,
													{},
													{},
													{ PVEAuthCookie: pveAuth.GetAuthCookie() }
												);
											},

											Put: async function (params) {
												return await pveCurl.PveCurl.Put(
													`${pveAuth.GetEndpoint()}/nodes/${node}/lxc/${vmid}/firewall/rules/${pos}`,
													params,
													{
														CSRFPreventionToken:
															pveAuth.GetCsrfPreventionToken(),
													},
													{ PVEAuthCookie: pveAuth.GetAuthCookie() }
												);
											},

											Delete: async function (params) {
												return await pveCurl.PveCurl.Delete(
													`${pveAuth.GetEndpoint()}/nodes/${node}/lxc/${vmid}/firewall/rules/${pos}`,
													params,
													{
														CSRFPreventionToken:
															pveAuth.GetCsrfPreventionToken(),
													},
													{ PVEAuthCookie: pveAuth.GetAuthCookie() }
												);
											},
										};
									},
								},

								Log: {
									Get: async function (params) {
										return await pveCurl.PveCurl.Get(
											`${pveAuth.GetEndpoint()}/nodes/${node}/lxc/${vmid}/firewall/log`,
											params,
											{},
											{ PVEAuthCookie: pveAuth.GetAuthCookie() }
										);
									},
								},

								Options: {
									Get: async function () {
										return await pveCurl.PveCurl.Get(
											`${pveAuth.GetEndpoint()}/nodes/${node}/lxc/${vmid}/firewall/options`,
											{},
											{},
											{ PVEAuthCookie: pveAuth.GetAuthCookie() }
										);
									},

									Put: async function (params) {
										return await pveCurl.PveCurl.Get(
											`${pveAuth.GetEndpoint()}/nodes/${node}/lxc/${vmid}/firewall/options`,
											params,
											{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
											{ PVEAuthCookie: pveAuth.GetAuthCookie() }
										);
									},
								},

								Refs: {
									Get: async function (params) {
										return await pveCurl.PveCurl.Get(
											`${pveAuth.GetEndpoint()}/nodes/${node}/lxc/${vmid}/firewall/refs`,
											params,
											{},
											{ PVEAuthCookie: pveAuth.GetAuthCookie() }
										);
									},
								},
							},

							SnapShot: {
								Get: async function () {
									return await pveCurl.PveCurl.Get(
										`${pveAuth.GetEndpoint()}/nodes/${node}/lxc/${vmid}/snapshot`,
										{},
										{},
										{ PVEAuthCookie: pveAuth.GetAuthCookie() }
									);
								},

								Post: async function (params) {
									return await pveCurl.PveCurl.Post(
										`${pveAuth.GetEndpoint()}/nodes/${node}/lxc/${vmid}/snapshot`,
										params,
										{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
										{ PVEAuthCookie: pveAuth.GetAuthCookie() }
									);
								},

								SnapName: function (snapname) {
									return {
										Get: async function () {
											return await pveCurl.PveCurl.Get(
												`${pveAuth.GetEndpoint()}/nodes/${node}/lxc/${vmid}/snapshot/${snapname}`,
												{},
												{},
												{ PVEAuthCookie: pveAuth.GetAuthCookie() }
											);
										},

										Delete: async function (params) {
											return await pveCurl.PveCurl.Delete(
												`${pveAuth.GetEndpoint()}/nodes/${node}/lxc/${vmid}/snapshot/${snapname}`,
												params,
												{
													CSRFPreventionToken: pveAuth.GetCsrfPreventionToken(),
												},
												{ PVEAuthCookie: pveAuth.GetAuthCookie() }
											);
										},

										Config: {
											Get: async function () {
												return await pveCurl.PveCurl.Get(
													`${pveAuth.GetEndpoint()}/nodes/${node}/lxc/${vmid}/snapshot/${snapname}/config`,
													{},
													{},
													{ PVEAuthCookie: pveAuth.GetAuthCookie() }
												);
											},

											Put: async function (params) {
												return await pveCurl.PveCurl.Put(
													`${pveAuth.GetEndpoint()}/nodes/${node}/lxc/${vmid}/snapshot/${snapname}/config`,
													params,
													{
														CSRFPreventionToken:
															pveAuth.GetCsrfPreventionToken(),
													},
													{ PVEAuthCookie: pveAuth.GetAuthCookie() }
												);
											},
										},

										Rollback: {
											Post: async function (params) {
												return await pveCurl.PveCurl.Post(
													`${pveAuth.GetEndpoint()}/nodes/${node}/lxc/${vmid}/snapshot/${snapname}/rollback`,
													{},
													{
														CSRFPreventionToken:
															pveAuth.GetCsrfPreventionToken(),
													},
													{ PVEAuthCookie: pveAuth.GetAuthCookie() }
												);
											},
										},
									};
								},
							},

							Status: {
								Get: async function () {
									return await pveCurl.PveCurl.Get(
										`${pveAuth.GetEndpoint()}/nodes/${node}/lxc/${vmid}/status`,
										{},
										{},
										{ PVEAuthCookie: pveAuth.GetAuthCookie() }
									);
								},

								Current: {
									Get: async function () {
										return await pveCurl.PveCurl.Get(
											`${pveAuth.GetEndpoint()}/nodes/${node}/lxc/${vmid}/status/current`,
											{},
											{},
											{ PVEAuthCookie: pveAuth.GetAuthCookie() }
										);
									},
								},

								Reboot: {
									Post: async function (params) {
										return await pveCurl.PveCurl.Post(
											`${pveAuth.GetEndpoint()}/nodes/${node}/lxc/${vmid}/status/reboot`,
											params,
											{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
											{ PVEAuthCookie: pveAuth.GetAuthCookie() }
										);
									},
								},

								Resume: {
									Post: async function () {
										return await pveCurl.PveCurl.Post(
											`${pveAuth.GetEndpoint()}/nodes/${node}/lxc/${vmid}/status/resume`,
											{},
											{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
											{ PVEAuthCookie: pveAuth.GetAuthCookie() }
										);
									},
								},

								Shutdown: {
									Post: async function (params) {
										return await pveCurl.PveCurl.Post(
											`${pveAuth.GetEndpoint()}/nodes/${node}/lxc/${vmid}/status/shutdown`,
											params,
											{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
											{ PVEAuthCookie: pveAuth.GetAuthCookie() }
										);
									},
								},

								Start: {
									Post: async function (params) {
										return await pveCurl.PveCurl.Post(
											`${pveAuth.GetEndpoint()}/nodes/${node}/lxc/${vmid}/status/start`,
											params,
											{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
											{ PVEAuthCookie: pveAuth.GetAuthCookie() }
										);
									},
								},

								Stop: {
									Post: async function (params) {
										return await pveCurl.PveCurl.Post(
											`${pveAuth.GetEndpoint()}/nodes/${node}/lxc/${vmid}/status/stop`,
											params,
											{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
											{ PVEAuthCookie: pveAuth.GetAuthCookie() }
										);
									},
								},

								Suspend: {
									Post: async function () {
										return await pveCurl.PveCurl.Post(
											`${pveAuth.GetEndpoint()}/nodes/${node}/lxc/${vmid}/status/suspend`,
											{},
											{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
											{ PVEAuthCookie: pveAuth.GetAuthCookie() }
										);
									},
								},
							},

							Clone: {
								Post: async function (params) {
									return await pveCurl.PveCurl.Post(
										`${pveAuth.GetEndpoint()}/nodes/${node}/lxc/${vmid}/clone`,
										params,
										{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
										{ PVEAuthCookie: pveAuth.GetAuthCookie() }
									);
								},
							},

							Config: {
								Get: async function (params) {
									return await pveCurl.PveCurl.Get(
										`${pveAuth.GetEndpoint()}/nodes/${node}/lxc/${vmid}/config`,
										params,
										{},
										{ PVEAuthCookie: pveAuth.GetAuthCookie() }
									);
								},

								Put: async function (params) {
									return await pveCurl.PveCurl.Put(
										`${pveAuth.GetEndpoint()}/nodes/${node}/lxc/${vmid}/config`,
										params,
										{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
										{ PVEAuthCookie: pveAuth.GetAuthCookie() }
									);
								},
							},

							Feature: {
								Get: async function (params) {
									return await pveCurl.PveCurl.Get(
										`${pveAuth.GetEndpoint()}/nodes/${node}/lxc/${vmid}/feature`,
										params,
										{},
										{ PVEAuthCookie: pveAuth.GetAuthCookie() }
									);
								},
							},

							Migrate: {
								Post: async function (params) {
									return await pveCurl.PveCurl.Post(
										`${pveAuth.GetEndpoint()}/nodes/${node}/lxc/${vmid}/migrate`,
										params,
										{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
										{ PVEAuthCookie: pveAuth.GetAuthCookie() }
									);
								},
							},

							MoveVolume: {
								Post: function (params) {
									return await pveCurl.PveCurl.Post(
										`${pveAuth.GetEndpoint()}/nodes/${node}/lxc/${vmid}/move_volume`,
										params,
										{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
										{ PVEAuthCookie: pveAuth.GetAuthCookie() }
									);
								},
							},

							Pending: {
								Get: async function () {
									return await pveCurl.PveCurl.Get(
										`${pveAuth.GetEndpoint()}/nodes/${node}/lxc/${vmid}/pending`,
										{},
										{},
										{ PVEAuthCookie: pveAuth.GetAuthCookie() }
									);
								},
							},

							Resize: {
								Put: async function (params) {
									return await pveCurl.PveCurl.Put(
										`${pveAuth.GetEndpoint()}/nodes/${node}/lxc/${vmid}/resize`,
										params,
										{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
										{ PVEAuthCookie: pveAuth.GetAuthCookie() }
									);
								},
							},

							Rrd: {
								Get: async function (params) {
									return await pveCurl.PveCurl.Get(
										`${pveAuth.GetEndpoint()}/nodes/${node}/lxc/${vmid}/rrd`,
										params,
										{},
										{ PVEAuthCookie: pveAuth.GetAuthCookie() }
									);
								},
							},

							RrdData: {
								Get: async function (params) {
									return await pveCurl.PveCurl.Get(
										`${pveAuth.GetEndpoint()}/nodes/${node}/lxc/${vmid}/rrd`,
										params,
										{},
										{ PVEAuthCookie: pveAuth.GetAuthCookie() }
									);
								},
							},

							SpiceProxy: {
								Post: async function (params) {
									return await pveCurl.PveCurl.Post(
										`${pveAuth.GetEndpoint()}/nodes/${node}/lxc/${vmid}/spiceproxy`,
										params,
										{ CSRFPreventionToken: pveAuthInfo.apiTicket.ticket },
										{ PVEAuthCookie: pveAuth.GetAuthCookie() }
									);
								},
							},

							Template: {
								Post: async function () {
									return await pveCurl.PveCurl.Post(
										`${pveAuth.GetEndpoint()}/nodes/${node}/lxc/${vmid}/template`,
										{},
										{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
										{ PVEAuthCookie: pveAuth.GetAuthCookie() }
									);
								},
							},

							TermProxy: {
								Post: async function () {
									return await pveCurl.PveCurl.Post(
										`${pveAuth.GetEndpoint()}/nodes/${node}/lxc/${vmid}/termproxy`,
										{},
										{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
										{ PVEAuthCookie: pveAuth.GetAuthCookie() }
									);
								},
							},

							VncProxy: {
								Post: async function (params) {
									return await pveCurl.PveCurl.Post(
										`${pveAuth.GetEndpoint()}/nodes/${node}/lxc/${vmid}/vncproxy`,
										params,
										{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
										{ PVEAuthCookie: pveAuth.GetAuthCookie() }
									);
								},
							},

							VncWebSocket: {
								Get: async function (params) {
									return await pveCurl.PveCurl.Get(
										`${pveAuth.GetEndpoint()}/nodes/${node}/lxc/${vmid}/vncwebsocket`,
										params,
										{},
										{ PVEAuthCookie: pveAuth.GetAuthCookie() }
									);
								},
							},
						};
					},
				},

				Network: {
					Get: async function (params) {
						return await pveCurl.PveCurl.Get(
							`${pveAuth.GetEndpoint()}/nodes/${node}/network`,
							params,
							{},
							{ PVEAuthCookie: pveAuth.GetAuthCookie() }
						);
					},

					Post: async function (params) {
						return await pveCurl.PveCurl.Post(
							`${pveAuth.GetEndpoint()}/nodes/${node}/network`,
							params,
							{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
							{ PVEAuthCookie: pveAuth.GetAuthCookie() }
						);
					},

					Put: async function () {
						return await pveCurl.PveCurl.Put(
							`${pveAuth.GetEndpoint()}/nodes/${node}/network`,
							{},
							{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
							{ PVEAuthCookie: pveAuth.GetAuthCookie() }
						);
					},

					Delete: async function () {
						return await pveCurl.PveCurl.Delete(
							`${pveAuth.GetEndpoint()}/nodes/${node}/network`,
							{},
							{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
							{ PVEAuthCookie: pveAuth.GetAuthCookie() }
						);
					},

					IFace: function (iface) {
						return {
							Get: async function () {
								return await pveCurl.PveCurl.Get(
									`${pveAuth.GetEndpoint()}/nodes/${node}/network/${iface}`,
									{},
									{},
									{ PVEAuthCookie: pveAuth.GetAuthCookie() }
								);
							},

							Put: async function (params) {
								return await pveCurl.PveCurl.Put(
									`${pveAuth.GetEndpoint()}/nodes/${node}/network/${iface}`,
									{},
									{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
									{ PVEAuthCookie: pveAuth.GetAuthCookie() }
								);
							},

							Delete: async function () {
								return await pveCurl.PveCurl.Put(
									`${pveAuth.GetEndpoint()}/nodes/${node}/network/${iface}`,
									{},
									{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
									{ PVEAuthCookie: pveAuth.GetAuthCookie() }
								);
							},
						};
					},
				},

				Qemu: {
					Get: async function (params) {
						return await pveCurl.PveCurl.Get(
							`${pveAuth.GetEndpoint()}/nodes/${node}/qemu`,
							params,
							{},
							{ PVEAuthCookie: pveAuth.GetAuthCookie() }
						);
					},

					Post: async function (params) {
						return await pveCurl.PveCurl.Post(
							`${pveAuth.GetEndpoint()}/nodes/${node}/qemu`,
							params,
							{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
							{ PVEAuthCookie: pveAuth.GetAuthCookie() }
						);
					},

					Vmid: function (vmid) {
						return {
							Get: async function () {
								return await pveCurl.PveCurl.Get(
									`${pveAuth.GetEndpoint()}/nodes/${node}/qemu/${vmid}`,
									{},
									{},
									{ PVEAuthCookie: pveAuth.GetAuthCookie() }
								);
							},

							Delete: async function (params) {
								return await pveCurl.PveCurl.Delete(
									`${pveAuth.GetEndpoint()}/nodes/${node}/qemu/${vmid}`,
									params,
									{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
									{ PVEAuthCookie: pveAuth.GetAuthCookie() }
								);
							},

							Agent: {
								Get: async function () {
									return await pveCurl.PveCurl.Get(
										`${pveAuth.GetEndpoint()}/nodes/${node}/qemu/${vmid}/agent`,
										{},
										{},
										{ PVEAuthCookie: pveAuth.GetAuthCookie() }
									);
								},

								Post: async function (params) {
									return await pveCurl.PveCurl.Post(
										`${pveAuth.GetEndpoint()}/nodes/${node}/qemu/${vmid}/agent`,
										params,
										{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
										{ PVEAuthCookie: pveAuth.GetAuthCookie() }
									);
								},

								Exec: {
									Post: async function (params) {
										return await pveCurl.PveCurl.Post(
											`${pveAuth.GetEndpoint()}/nodes/${node}/qemu/${vmid}/agent/exec`,
											params,
											{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
											{ PVEAuthCookie: pveAuth.GetAuthCookie() }
										);
									},
								},

								ExecStatus: {
									Get: async function (params) {
										return await pveCurl.PveCurl.Get(
											`${pveAuth.GetEndpoint()}/nodes/${node}/qemu/${vmid}/agent/exec-status`,
											params,
											{},
											{ PVEAuthCookie: pveAuth.GetAuthCookie() }
										);
									},
								},

								FileRead: {
									Get: async function (params) {
										return await pveCurl.PveCurl.Get(
											`${pveAuth.GetEndpoint()}/nodes/${node}/qemu/${vmid}/agent/file-read`,
											params,
											{},
											{ PVEAuthCookie: pveAuth.GetAuthCookie() }
										);
									},
								},

								FileWrite: {
									Post: async function (params) {
										return await pveCurl.PveCurl.Post(
											`${pveAuth.GetEndpoint()}/nodes/${node}/qemu/${vmid}/agent/file-write`,
											params,
											{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
											{ PVEAuthCookie: pveAuth.GetAuthCookie() }
										);
									},
								},

								FsFreezeFreeze: {
									Post: async function () {
										return await pveCurl.PveCurl.Post(
											`${pveAuth.GetEndpoint()}/nodes/${node}/qemu/${vmid}/agent/fsfreeze-freeze`,
											{},
											{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
											{ PVEAuthCookie: pveAuth.GetAuthCookie() }
										);
									},
								},

								FsFreezeStatus: {
									Post: async function () {
										return await pveCurl.PveCurl.Post(
											`${pveAuth.GetEndpoint()}/nodes/${node}/qemu/${vmid}/agent/fsfreeze-status`,
											{},
											{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
											{ PVEAuthCookie: pveAuth.GetAuthCookie() }
										);
									},
								},

								FsFreezeThaw: {
									Post: async function () {
										return await pveCurl.PveCurl.Post(
											`${pveAuth.GetEndpoint()}/nodes/${node}/qemu/${vmid}/agent/fsfreeze-thaw`,
											{},
											{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
											{ PVEAuthCookie: pveAuth.GetAuthCookie() }
										);
									},
								},

								FsTrim: {
									Post: async function (params) {
										return await pveCurl.PveCurl.Post(
											`${pveAuth.GetEndpoint()}/nodes/${node}/qemu/${vmid}/agent/fstrim`,
											params,
											{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
											{ PVEAuthCookie: pveAuth.GetAuthCookie() }
										);
									},
								},

								GetFsInfo: {
									Get: async function () {
										return await pveCurl.PveCurl.Get(
											`${pveAuth.GetEndpoint()}/nodes/${node}/qemu/${vmid}/agent/get-fsinfo`,
											{},
											{},
											{ PVEAuthCookie: pveAuth.GetAuthCookie() }
										);
									},
								},

								GetHostName: {
									Get: async function () {
										return await pveCurl.PveCurl.Get(
											`${pveAuth.GetEndpoint()}/nodes/${node}/qemu/${vmid}/agent/get-host-name`,
											{},
											{},
											{ PVEAuthCookie: pveAuth.GetAuthCookie() }
										);
									},
								},

								GetMemoryBlockInfo: {
									Get: async function () {
										return await pveCurl.PveCurl.Get(
											`${pveAuth.GetEndpoint()}/nodes/${node}/qemu/${vmid}/agent/get-memory-block-info`,
											{},
											{},
											{ PVEAuthCookie: pveAuth.GetAuthCookie() }
										);
									},
								},

								GetMemoryBlocks: {
									Get: async function () {
										return await pveCurl.PveCurl.Get(
											`${pveAuth.GetEndpoint()}/nodes/${node}/qemu/${vmid}/agent/get-memory-blocks`,
											{},
											{},
											{ PVEAuthCookie: pveAuth.GetAuthCookie() }
										);
									},
								},

								GetOsInfo: {
									Get: async function () {
										return await pveCurl.PveCurl.Get(
											`${pveAuth.GetEndpoint()}/nodes/${node}/qemu/${vmid}/agent/get-osinfo`,
											{},
											{},
											{ PVEAuthCookie: pveAuth.GetAuthCookie() }
										);
									},
								},

								GetTime: {
									Get: async function () {
										return await pveCurl.PveCurl.Get(
											`${pveAuth.GetEndpoint()}/nodes/${node}/qemu/${vmid}/agent/get-time`,
											{},
											{},
											{ PVEAuthCookie: pveAuth.GetAuthCookie() }
										);
									},
								},

								GetTimezone: {
									Get: async function () {
										return await pveCurl.PveCurl.Get(
											`${pveAuth.GetEndpoint()}/nodes/${node}/qemu/${vmid}/agent/get-timezone`,
											{},
											{},
											{ PVEAuthCookie: pveAuth.GetAuthCookie() }
										);
									},
								},

								GetUsers: {
									Get: async function () {
										return await pveCurl.PveCurl.Get(
											`${pveAuth.GetEndpoint()}/nodes/${node}/qemu/${vmid}/agent/get-users`,
											{},
											{},
											{ PVEAuthCookie: pveAuth.GetAuthCookie() }
										);
									},
								},

								GetVCpus: {
									Get: async function () {
										return await pveCurl.PveCurl.Get(
											`${pveAuth.GetEndpoint()}/nodes/${node}/qemu/${vmid}/agent/get-vcpus`,
											{},
											{},
											{ PVEAuthCookie: pveAuth.GetAuthCookie() }
										);
									},
								},

								Info: {
									Get: async function () {
										return await pveCurl.PveCurl.Get(
											`${pveAuth.GetEndpoint()}/nodes/${node}/qemu/${vmid}/agent/info`,
											{},
											{},
											{ PVEAuthCookie: pveAuth.GetAuthCookie() }
										);
									},
								},

								NetworkGetInterfaces: {
									Get: async function () {
										return await pveCurl.PveCurl.Get(
											`${pveAuth.GetEndpoint()}/nodes/${node}/qemu/${vmid}/agent/network-get-interfaces`,
											{},
											{},
											{ PVEAuthCookie: pveAuth.GetAuthCookie() }
										);
									},
								},

								Ping: {
									Post: async function () {
										return await pveCurl.PveCurl.Post(
											`${pveAuth.GetEndpoint()}/nodes/${node}/qemu/${vmid}/agent/ping`,
											{},
											{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
											{ PVEAuthCookie: pveAuth.GetAuthCookie() }
										);
									},
								},

								SetUserPassword: {
									Post: async function (params) {
										return await pveCurl.PveCurl.Post(
											`${pveAuth.GetEndpoint()}/nodes/${node}/qemu/${vmid}/agent/set-user-password`,
											params,
											{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
											{ PVEAuthCookie: pveAuth.GetAuthCookie() }
										);
									},
								},

								Shutdown: {
									Post: async function () {
										return await pveCurl.PveCurl.Post(
											`${pveAuth.GetEndpoint()}/nodes/${node}/qemu/${vmid}/agent/shutdown`,
											{},
											{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
											{ PVEAuthCookie: pveAuth.GetAuthCookie() }
										);
									},
								},

								SuspendDisk: {
									Post: async function () {
										return await pveCurl.PveCurl.Post(
											`${pveAuth.GetEndpoint()}/nodes/${node}/qemu/${vmid}/agent/suspend-disk`,
											{},
											{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
											{ PVEAuthCookie: pveAuth.GetAuthCookie() }
										);
									},
								},

								SuspendHybrid: {
									Post: async function () {
										return await pveCurl.PveCurl.Post(
											`${pveAuth.GetEndpoint()}/nodes/${node}/qemu/${vmid}/agent/suspend-hybrid`,
											{},
											{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
											{ PVEAuthCookie: pveAuth.GetAuthCookie() }
										);
									},
								},

								SuspendRam: {
									Post: async function () {
										return await pveCurl.PveCurl.Post(
											`${pveAuth.GetEndpoint()}/nodes/${node}/qemu/${vmid}/agent/suspend-ram`,
											{},
											{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
											{ PVEAuthCookie: pveAuth.GetAuthCookie() }
										);
									},
								},
							},

							CloudInit: {
								Dump: {
									Get: async function (params) {
										return await pveCurl.PveCurl.Get(
											`${pveAuth.GetEndpoint()}/nodes/${node}/qemu/${vmid}/cloudinit/dump`,
											params,
											{},
											{ PVEAuthCookie: pveAuth.GetAuthCookie() }
										);
									},
								},
							},

							Firewall: {
								Get: async function () {
									return await pveCurl.PveCurl.Get(
										`${pveAuth.GetEndpoint()}/nodes/${node}/qemu/${vmid}/firewall`,
										{},
										{},
										{ PVEAuthCookie: pveAuth.GetAuthCookie() }
									);
								},

								Aliases: {
									Get: async function () {
										return await pveCurl.PveCurl.Get(
											`${pveAuth.GetEndpoint()}/nodes/${node}/qemu/${vmid}/firewall/aliases`,
											{},
											{},
											{ PVEAuthCookie: pveAuth.GetAuthCookie() }
										);
									},

									Post: async function (params) {
										return await pveCurl.PveCurl.Post(
											`${pveAuth.GetEndpoint()}/nodes/${node}/qemu/${vmid}/firewall/aliases`,
											params,
											{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
											{
												PVEAuthCookie:
													pveAuthInfo.apiTicket.csrfPreventionToken,
											}
										);
									},

									Name: function (name) {
										return {
											Get: async function () {
												return await pveCurl.PveCurl.Get(
													`${pveAuth.GetEndpoint()}/nodes/${node}/qemu/${vmid}/firewall/aliases/${name}`,
													{},
													{},
													{ PVEAuthCookie: pveAuth.GetAuthCookie() }
												);
											},

											Put: async function (params) {
												return await pveCurl.PveCurl.Put(
													`${pveAuth.GetEndpoint()}/nodes/${node}/qemu/${vmid}/firewall/aliases/${name}`,
													params,
													{
														CSRFPreventionToken:
															pveAuth.GetCsrfPreventionToken(),
													},
													{ PVEAuthCookie: pveAuth.GetAuthCookie() }
												);
											},

											Delete: async function (params) {
												return await pveCurl.PveCurl.Delete(
													`${pveAuth.GetEndpoint()}/nodes/${node}/qemu/${vmid}/firewall/aliases/${name}`,
													params,
													{
														CSRFPreventionToken:
															pveAuth.GetCsrfPreventionToken(),
													},
													{ PVEAuthCookie: pveAuth.GetAuthCookie() }
												);
											},
										};
									},
								},

								IpSet: {
									Get: async function () {
										return await pveCurl.PveCurl.Get(
											`${pveAuth.GetEndpoint()}/nodes/${node}/qemu/${vmid}/firewall/ipset`,
											{},
											{},
											{ PVEAuthCookie: pveAuth.GetAuthCookie() }
										);
									},

									Post: async function (params) {
										return await pveCurl.PveCurl.Post(
											`${pveAuth.GetEndpoint()}/nodes/${node}/qemu/${vmid}/firewall/ipset`,
											params,
											{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
											{ PVEAuthCookie: pveAuth.GetAuthCookie() }
										);
									},

									Name: function (name) {
										return {
											Get: async function () {
												return await pveCurl.PveCurl.Get(
													`${pveAuth.GetEndpoint()}/nodes/${node}/qemu/${vmid}/firewall/ipset/name`,
													{},
													{},
													{ PVEAuthCookie: pveAuth.GetAuthCookie() }
												);
											},

											Post: async function (params) {
												return await pveCurl.PveCurl.Post(
													`${pveAuth.GetEndpoint()}/nodes/${node}/qemu/${vmid}/firewall/ipset/name`,
													params,
													{
														CSRFPreventionToken:
															pveAuth.GetCsrfPreventionToken(),
													},
													{ PVEAuthCookie: pveAuth.GetAuthCookie() }
												);
											},

											Delete: async function () {
												return await pveCurl.PveCurl.Delete(
													`${pveAuth.GetEndpoint()}/nodes/${node}/qemu/${vmid}/firewall/ipset/name`,
													{},
													{
														CSRFPreventionToken:
															pveAuth.GetCsrfPreventionToken(),
													},
													{ PVEAuthCookie: pveAuth.GetAuthCookie() }
												);
											},

											Cidr: function (cidr) {
												return {
													Get: async function () {
														return await pveCurl.PveCurl.Get(
															`${pveAuth.GetEndpoint()}/nodes/${node}/qemu/${vmid}/firewall/ipset/name/${cidr}`,
															{},
															{},
															{ PVEAuthCookie: pveAuth.GetAuthCookie() }
														);
													},

													Put: async function (params) {
														return await pveCurl.PveCurl.Put(
															`${pveAuth.GetEndpoint()}/nodes/${node}/qemu/${vmid}/firewall/ipset/name/${cidr}`,
															params,
															{
																CSRFPreventionToken:
																	pveAuthInfo.apiTicket.csrfPreventionToken,
															},
															{ PVEAuthCookie: pveAuth.GetAuthCookie() }
														);
													},

													Delete: async function (params) {
														return await pveCurl.PveCurl.Delete(
															`${pveAuth.GetEndpoint()}/nodes/${node}/qemu/${vmid}/firewall/ipset/name/${cidr}`,
															params,
															{
																CSRFPreventionToken:
																	pveAuthInfo.apiTicket.csrfPreventionToken,
															},
															{ PVEAuthCookie: pveAuth.GetAuthCookie() }
														);
													},
												};
											},
										};
									},
								},

								Rules: {
									Get: async function () {
										return await pveCurl.PveCurl.Get(
											`${pveAuth.GetEndpoint()}/nodes/${node}/qemu/${vmid}/firewall/rules`,
											{},
											{},
											{ PVEAuthCookie: pveAuth.GetAuthCookie() }
										);
									},

									Post: async function (params) {
										return await pveCurl.PveCurl.Post(
											`${pveAuth.GetEndpoint()}/nodes/${node}/qemu/${vmid}/firewall/rules`,
											params,
											{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
											{ PVEAuthCookie: pveAuth.GetAuthCookie() }
										);
									},

									Pos: function (pos) {
										return {
											Get: async function () {
												return await pveCurl.PveCurl.Get(
													`${pveAuth.GetEndpoint()}/nodes/${node}/qemu/${vmid}/firewall/rules/${pos}`,
													{},
													{},
													{ PVEAuthCookie: pveAuth.GetAuthCookie() }
												);
											},

											Put: async function (params) {
												return await pveCurl.PveCurl.Put(
													`${pveAuth.GetEndpoint()}/nodes/${node}/qemu/${vmid}/firewall/rules/${pos}`,
													params,
													{
														CSRFPreventionToken:
															pveAuth.GetCsrfPreventionToken(),
													},
													{ PVEAuthCookie: pveAuth.GetAuthCookie() }
												);
											},

											Delete: async function (params) {
												return await pveCurl.PveCurl.Delete(
													`${pveAuth.GetEndpoint()}/nodes/${node}/qemu/${vmid}/firewall/rules/${pos}`,
													params,
													{
														CSRFPreventionToken:
															pveAuth.GetCsrfPreventionToken(),
													},
													{ PVEAuthCookie: pveAuth.GetAuthCookie() }
												);
											},
										};
									},
								},

								Log: {
									Get: async function (params) {
										return await pveCurl.PveCurl.Get(
											`${pveAuth.GetEndpoint()}/nodes/${node}/qemu/${vmid}/firewall/log`,
											params,
											{},
											{ PVEAuthCookie: pveAuth.GetAuthCookie() }
										);
									},
								},

								Options: {
									Get: async function () {
										return await pveCurl.PveCurl.Get(
											`${pveAuth.GetEndpoint()}/nodes/${node}/qemu/${vmid}/firewall/options`,
											{},
											{},
											{ PVEAuthCookie: pveAuth.GetAuthCookie() }
										);
									},

									Put: async function (params) {
										return await pveCurl.PveCurl.Get(
											`${pveAuth.GetEndpoint()}/nodes/${node}/qemu/${vmid}/firewall/options`,
											params,
											{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
											{ PVEAuthCookie: pveAuth.GetAuthCookie() }
										);
									},
								},

								Refs: {
									Get: async function (params) {
										return await pveCurl.PveCurl.Get(
											`${pveAuth.GetEndpoint()}/nodes/${node}/qemu/${vmid}/firewall/refs`,
											params,
											{},
											{ PVEAuthCookie: pveAuth.GetAuthCookie() }
										);
									},
								},
							},

							SnapShot: {
								Get: async function () {
									return await pveCurl.PveCurl.Get(
										`${pveAuth.GetEndpoint()}/nodes/${node}/qemu/${vmid}/snapshot`,
										{},
										{},
										{ PVEAuthCookie: pveAuth.GetAuthCookie() }
									);
								},

								Post: async function (params) {
									return await pveCurl.PveCurl.Post(
										`${pveAuth.GetEndpoint()}/nodes/${node}/qemu/${vmid}/snapshot`,
										params,
										{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
										{ PVEAuthCookie: pveAuth.GetAuthCookie() }
									);
								},

								SnapName: function (snapname) {
									return {
										Get: async function () {
											return await pveCurl.PveCurl.Get(
												`${pveAuth.GetEndpoint()}/nodes/${node}/qemu/${vmid}/snapshot/${snapname}`,
												{},
												{},
												{ PVEAuthCookie: pveAuth.GetAuthCookie() }
											);
										},

										Delete: async function (params) {
											return await pveCurl.PveCurl.Delete(
												`${pveAuth.GetEndpoint()}/nodes/${node}/qemu/${vmid}/snapshot/${snapname}`,
												params,
												{
													CSRFPreventionToken: pveAuth.GetCsrfPreventionToken(),
												},
												{ PVEAuthCookie: pveAuth.GetAuthCookie() }
											);
										},

										Config: {
											Get: async function () {
												return await pveCurl.PveCurl.Get(
													`${pveAuth.GetEndpoint()}/nodes/${node}/qemu/${vmid}/snapshot/${snapname}/config`,
													{},
													{},
													{ PVEAuthCookie: pveAuth.GetAuthCookie() }
												);
											},

											Put: async function (params) {
												return await pveCurl.PveCurl.Put(
													`${pveAuth.GetEndpoint()}/nodes/${node}/qemu/${vmid}/snapshot/${snapname}/config`,
													params,
													{
														CSRFPreventionToken:
															pveAuth.GetCsrfPreventionToken(),
													},
													{ PVEAuthCookie: pveAuth.GetAuthCookie() }
												);
											},
										},

										Rollback: {
											Post: async function (params) {
												return await pveCurl.PveCurl.Post(
													`${pveAuth.GetEndpoint()}/nodes/${node}/qemu/${vmid}/snapshot/${snapname}/rollback`,
													{},
													{
														CSRFPreventionToken:
															pveAuth.GetCsrfPreventionToken(),
													},
													{ PVEAuthCookie: pveAuth.GetAuthCookie() }
												);
											},
										},
									};
								},
							},

							Status: {
								Get: async function () {
									return await pveCurl.PveCurl.Get(
										`${pveAuth.GetEndpoint()}/nodes/${node}/qemu/${vmid}/status`,
										{},
										{},
										{ PVEAuthCookie: pveAuth.GetAuthCookie() }
									);
								},

								Current: {
									Get: async function () {
										return await pveCurl.PveCurl.Get(
											`${pveAuth.GetEndpoint()}/nodes/${node}/qemu/${vmid}/status/current`,
											{},
											{},
											{ PVEAuthCookie: pveAuth.GetAuthCookie() }
										);
									},
								},

								Reboot: {
									Post: async function (params) {
										return await pveCurl.PveCurl.Post(
											`${pveAuth.GetEndpoint()}/nodes/${node}/qemu/${vmid}/status/reboot`,
											params,
											{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
											{ PVEAuthCookie: pveAuth.GetAuthCookie() }
										);
									},
								},

								Reset: {
									Post: async function (params) {
										return await pveCurl.PveCurl.Post(
											`${pveAuth.GetEndpoint()}/nodes/${node}/qemu/${vmid}/status/reset`,
											params,
											{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
											{ PVEAuthCookie: pveAuth.GetAuthCookie() }
										);
									},
								},

								Resume: {
									Post: async function () {
										return await pveCurl.PveCurl.Post(
											`${pveAuth.GetEndpoint()}/nodes/${node}/qemu/${vmid}/status/resume`,
											{},
											{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
											{ PVEAuthCookie: pveAuth.GetAuthCookie() }
										);
									},
								},

								Shutdown: {
									Post: async function (params) {
										return await pveCurl.PveCurl.Post(
											`${pveAuth.GetEndpoint()}/nodes/${node}/qemu/${vmid}/status/shutdown`,
											params,
											{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
											{ PVEAuthCookie: pveAuth.GetAuthCookie() }
										);
									},
								},

								Start: {
									Post: async function (params) {
										return await pveCurl.PveCurl.Post(
											`${pveAuth.GetEndpoint()}/nodes/${node}/qemu/${vmid}/status/start`,
											params,
											{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
											{ PVEAuthCookie: pveAuth.GetAuthCookie() }
										);
									},
								},

								Stop: {
									Post: async function (params) {
										return await pveCurl.PveCurl.Post(
											`${pveAuth.GetEndpoint()}/nodes/${node}/qemu/${vmid}/status/stop`,
											params,
											{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
											{ PVEAuthCookie: pveAuth.GetAuthCookie() }
										);
									},
								},

								Suspend: {
									Post: async function () {
										return await pveCurl.PveCurl.Post(
											`${pveAuth.GetEndpoint()}/nodes/${node}/qemu/${vmid}/status/suspend`,
											{},
											{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
											{ PVEAuthCookie: pveAuth.GetAuthCookie() }
										);
									},
								},
							},

							Clone: {
								Post: async function (params) {
									return await pveCurl.PveCurl.Post(
										`${pveAuth.GetEndpoint()}/nodes/${node}/qemu/${vmid}/clone`,
										params,
										{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
										{ PVEAuthCookie: pveAuth.GetAuthCookie() }
									);
								},
							},

							Config: {
								Get: async function (params) {
									return await pveCurl.PveCurl.Get(
										`${pveAuth.GetEndpoint()}/nodes/${node}/qemu/${vmid}/config`,
										params,
										{},
										{ PVEAuthCookie: pveAuth.GetAuthCookie() }
									);
								},

								Post: async function (params) {
									return await pveCurl.PveCurl.Post(
										`${pveAuth.GetEndpoint()}/nodes/${node}/qemu/${vmid}/config`,
										params,
										{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
										{ PVEAuthCookie: pveAuth.GetAuthCookie() }
									);
								},

								Put: async function (params) {
									return await pveCurl.PveCurl.Put(
										`${pveAuth.GetEndpoint()}/nodes/${node}/qemu/${vmid}/config`,
										params,
										{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
										{ PVEAuthCookie: pveAuth.GetAuthCookie() }
									);
								},
							},

							Feature: {
								Get: async function (params) {
									return await pveCurl.PveCurl.Get(
										`${pveAuth.GetEndpoint()}/nodes/${node}/qemu/${vmid}/feature`,
										params,
										{},
										{ PVEAuthCookie: pveAuth.GetAuthCookie() }
									);
								},
							},

							Migrate: {
								Get: async function (params) {
									return await pveCurl.PveCurl.Get(
										`${pveAuth.GetEndpoint()}/nodes/${node}/qemu/${vmid}/migrate`,
										params,
										{},
										{ PVEAuthCookie: pveAuth.GetAuthCookie() }
									);
								},

								Post: async function (params) {
									return await pveCurl.PveCurl.Post(
										`${pveAuth.GetEndpoint()}/nodes/${node}/qemu/${vmid}/migrate`,
										params,
										{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
										{ PVEAuthCookie: pveAuth.GetAuthCookie() }
									);
								},
							},

							Monitor: {
								Post: async function (params) {
									return await pveCurl.PveCurl.Post(
										`${pveAuth.GetEndpoint()}/nodes/${node}/qemu/${vmid}/monitor`,
										params,
										{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
										{ PVEAuthCookie: pveAuth.GetAuthCookie() }
									);
								},
							},

							MoveDisk: {
								Post: function () {
									return await pveCurl.PveCurl.Post(
										`${pveAuth.GetEndpoint()}/nodes/${node}/${vmid}/move_disk`,
										{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
										{ PVEAuthCookie: pveAuth.GetAuthCookie() }
									);
								},
							},

							Pending: {
								Get: async function () {
									return await pveCurl.PveCurl.Get(
										`${pveAuth.GetEndpoint()}/nodes/${node}/qemu/${vmid}/pending`,
										{},
										{},
										{ PVEAuthCookie: pveAuth.GetAuthCookie() }
									);
								},
							},

							Resize: {
								Put: async function (params) {
									return await pveCurl.PveCurl.Put(
										`${pveAuth.GetEndpoint()}/nodes/${node}/qemu/${vmid}/resize`,
										params,
										{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
										{ PVEAuthCookie: pveAuth.GetAuthCookie() }
									);
								},
							},

							Rrd: {
								Get: async function (params) {
									return await pveCurl.PveCurl.Get(
										`${pveAuth.GetEndpoint()}/nodes/${node}/qemu/${vmid}/rrd`,
										params,
										{},
										{ PVEAuthCookie: pveAuth.GetAuthCookie() }
									);
								},
							},

							RrdData: {
								Get: async function (params) {
									return await pveCurl.PveCurl.Get(
										`${pveAuth.GetEndpoint()}/nodes/${node}/qemu/${vmid}/rrd`,
										params,
										{},
										{ PVEAuthCookie: pveAuth.GetAuthCookie() }
									);
								},
							},

							SendKey: {
								Put: async function (params) {
									return await pveCurl.PveCurl.Put(
										`${pveAuth.GetEndpoint()}/nodes/${node}/qemu/${vmid}/sendlink`,
										params,
										{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
										{ PVEAuthCookie: pveAuth.GetAuthCookie() }
									);
								},
							},

							SpiceProxy: {
								Post: async function (params) {
									return await pveCurl.PveCurl.Post(
										`${pveAuth.GetEndpoint()}/nodes/${node}/qemu/${vmid}/spiceproxy`,
										params,
										{ CSRFPreventionToken: pveAuthInfo.apiTicket.ticket },
										{ PVEAuthCookie: pveAuth.GetAuthCookie() }
									);
								},
							},

							Template: {
								Post: async function () {
									return await pveCurl.PveCurl.Post(
										`${pveAuth.GetEndpoint()}/nodes/${node}/qemu/${vmid}/template`,
										{},
										{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
										{ PVEAuthCookie: pveAuth.GetAuthCookie() }
									);
								},
							},

							TermProxy: {
								Post: async function () {
									return await pveCurl.PveCurl.Post(
										`${pveAuth.GetEndpoint()}/nodes/${node}/qemu/${vmid}/termproxy`,
										{},
										{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
										{ PVEAuthCookie: pveAuth.GetAuthCookie() }
									);
								},
							},

							Unlink: {
								Put: async function (params) {
									return await pveCurl.PveCurl.Put(
										`${pveAuth.GetEndpoint()}/nodes/${node}/qemu/${vmid}/unlink`,
										params,
										{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
										{ PVEAuthCookie: pveAuth.GetAuthCookie() }
									);
								},
							},

							VncProxy: {
								Post: async function (params) {
									return await pveCurl.PveCurl.Post(
										`${pveAuth.GetEndpoint()}/nodes/${node}/qemu/${vmid}/vncproxy`,
										params,
										{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
										{ PVEAuthCookie: pveAuth.GetAuthCookie() }
									);
								},
							},

							VncWebSocket: {
								Get: async function (params) {
									return await pveCurl.PveCurl.Get(
										`${pveAuth.GetEndpoint()}/nodes/${node}/qemu/${vmid}/vncwebsocket`,
										params,
										{},
										{ PVEAuthCookie: pveAuth.GetAuthCookie() }
									);
								},
							},
						};
					},
				},

				Replication: {
					Get: async function (params) {
						return await pveCurl.PveCurl.Get(
							`${pveAuth.GetEndpoint()}/nodes/${node}/replication`,
							params,
							{},
							{ PVEAuthCookie: pveAuth.GetAuthCookie() }
						);
					},

					Id: function (id) {
						return {
							Get: async function () {
								return await pveCurl.PveCurl.Get(
									`${pveAuth.GetEndpoint()}/nodes/${node}/replication/${id}`,
									{},
									{},
									{ PVEAuthCookie: pveAuth.GetAuthCookie() }
								);
							},

							Log: {
								Get: async function (params) {
									return await pveCurl.PveCurl.Get(
										`${pveAuth.GetEndpoint()}/nodes/${node}/replication/${id}/log`,
										params,
										{},
										{ PVEAuthCookie: pveAuth.GetAuthCookie() }
									);
								},
							},

							ScheduleNow: {
								Post: async function (params) {
									return await pveCurl.PveCurl.Post(
										`${pveAuth.GetEndpoint()}/nodes/${node}/replication/${id}/schedule_now`,
										{},
										{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
										{ PVEAuthCookie: pveAuth.GetAuthCookie() }
									);
								},
							},

							Status: {
								Get: async function () {
									return await pveCurl.PveCurl.Get(
										`${pveAuth.GetEndpoint()}/nodes/${node}/replication/${id}/status`,
										{},
										{},
										{ PVEAuthCookie: pveAuth.GetAuthCookie() }
									);
								},
							},
						};
					},
				},

				Scan: {
					Get: async function () {
						return await pveCurl.PveCurl.Get(
							`${pveAuth.GetEndpoint()}/nodes/${node}/scan`,
							{},
							{},
							{ PVEAuthCookie: pveAuth.GetAuthCookie() }
						);
					},

					Cifs: {
						Get: async function (params) {
							return await pveCurl.PveCurl.Get(
								`${pveAuth.GetEndpoint()}/nodes/${node}/scan/cifs`,
								params,
								{},
								{ PVEAuthCookie: pveAuth.GetAuthCookie() }
							);
						},
					},

					GlusterFS: {
						Get: async function (params) {
							return await pveCurl.PveCurl.Get(
								`${pveAuth.GetEndpoint()}/nodes/${node}/scan/glusterfs`,
								params,
								{},
								{ PVEAuthCookie: pveAuth.GetAuthCookie() }
							);
						},
					},

					Iscsi: {
						Get: async function (params) {
							return await pveCurl.PveCurl.Get(
								`${pveAuth.GetEndpoint()}/nodes/${node}/scan/iscsi`,
								params,
								{},
								{ PVEAuthCookie: pveAuth.GetAuthCookie() }
							);
						},
					},

					Lvm: {
						Get: async function () {
							return await pveCurl.PveCurl.Get(
								`${pveAuth.GetEndpoint()}/nodes/${node}/scan/lvm`,
								{},
								{},
								{ PVEAuthCookie: pveAuth.GetAuthCookie() }
							);
						},
					},

					LvmThin: {
						Get: async function (params) {
							return await pveCurl.PveCurl.Get(
								`${pveAuth.GetEndpoint()}/nodes/${node}/scan/lvmthin`,
								params,
								{},
								{ PVEAuthCookie: pveAuth.GetAuthCookie() }
							);
						},
					},

					Nfs: {
						Get: async function (params) {
							return await pveCurl.PveCurl.Get(
								`${pveAuth.GetEndpoint()}/nodes/${node}/scan/nfs`,
								params,
								{},
								{ PVEAuthCookie: pveAuth.GetAuthCookie() }
							);
						},
					},

					Pbs: {
						Get: async function (params) {
							return await pveCurl.PveCurl.Get(
								`${pveAuth.GetEndpoint()}/nodes/${node}/scan/pbs`,
								params,
								{},
								{ PVEAuthCookie: pveAuth.GetAuthCookie() }
							);
						},
					},

					Zfs: {
						Get: async function () {
							return await pveCurl.PveCurl.Get(
								`${pveAuth.GetEndpoint()}/nodes/${node}/scan/zfs`,
								{},
								{},
								{ PVEAuthCookie: pveAuth.GetAuthCookie() }
							);
						},
					},
				},

				Sdn: {
					Get: async function () {
						return await pveCurl.PveCurl.Get(
							`${pveAuth.GetEndpoint()}/nodes/${node}/sdn`,
							{},
							{},
							{ PVEAuthCookie: pveAuth.GetAuthCookie() }
						);
					},

					Zones: {
						Get: async function () {
							return await pveCurl.PveCurl.Get(
								`${pveAuth.GetEndpoint()}/nodes/${node}/sdn/zones`,
								{},
								{},
								{ PVEAuthCookie: pveAuth.GetAuthCookie() }
							);
						},

						Zone: function (zone) {
							return {
								Get: async function () {
									return await pveCurl.PveCurl.Get(
										`${pveAuth.GetEndpoint()}/nodes/${node}/sdn/zones/${zone}`,
										{},
										{},
										{ PVEAuthCookie: pveAuth.GetAuthCookie() }
									);
								},

								Content: {
									Get: async function () {
										return await pveCurl.PveCurl.Get(
											`${pveAuth.GetEndpoint()}/nodes/${node}/sdn/zones/${zone}/content`,
											{},
											{},
											{ PVEAuthCookie: pveAuth.GetAuthCookie() }
										);
									},
								},
							};
						},
					},
				},

				Services: {
					Get: async function () {
						return await pveCurl.PveCurl.Get(
							`${pveAuth.GetEndpoint()}/nodes/${node}/services`,
							{},
							{},
							{ PVEAuthCookie: pveAuth.GetAuthCookie() }
						);
					},

					Service: function (service) {
						return {
							Get: async function () {
								return await pveCurl.PveCurl.Get(
									`${pveAuth.GetEndpoint()}/nodes/${node}/services/${service}`,
									{},
									{},
									{ PVEAuthCookie: pveAuth.GetAuthCookie() }
								);
							},

							Reload: {
								Post: async function () {
									return await pveCurl.PveCurl.Post(
										`${pveAuth.GetEndpoint()}/nodes/${node}/services/${service}/reload`,
										{},
										{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
										{ PVEAuthCookie: pveAuth.GetAuthCookie() }
									);
								},
							},

							Restart: {
								Post: async function () {
									return await pveCurl.PveCurl.Post(
										`${pveAuth.GetEndpoint()}/nodes/${node}/services/${service}/restart`,
										{},
										{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
										{ PVEAuthCookie: pveAuth.GetAuthCookie() }
									);
								},
							},

							Start: {
								Post: async function () {
									return await pveCurl.PveCurl.Post(
										`${pveAuth.GetEndpoint()}/nodes/${node}/services/${service}/start`,
										{},
										{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
										{ PVEAuthCookie: pveAuth.GetAuthCookie() }
									);
								},
							},

							State: {
								Get: async function () {
									return await pveCurl.PveCurl.Get(
										`${pveAuth.GetEndpoint()}/nodes/${node}/services/${service}/state`,
										{},
										{},
										{ PVEAuthCookie: pveAuth.GetAuthCookie() }
									);
								},
							},

							Stop: {
								Post: async function () {
									return await pveCurl.PveCurl.Post(
										`${pveAuth.GetEndpoint()}/nodes/${node}/services/${service}/stop`,
										{},
										{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
										{ PVEAuthCookie: pveAuth.GetAuthCookie() }
									);
								},
							},
						};
					},
				},

				Storage: {
					Get: async function (params) {
						return await pveCurl.PveCurl.Get(
							`${pveAuth.GetEndpoint()}/nodes/${node}/storage`,
							params,
							{},
							{ PVEAuthCookie: pveAuth.GetAuthCookie() }
						);
					},

					Storage: function (storage) {
						return {
							Get: async function () {
								return await pveCurl.PveCurl.Get(
									`${pveAuth.GetEndpoint()}/nodes/${node}/storage/${storage}`,
									{},
									{},
									{ PVEAuthCookie: pveAuth.GetAuthCookie() }
								);
							},

							Content: {
								Get: async function (params) {
									return await pveCurl.PveCurl.Get(
										`${pveAuth.GetEndpoint()}/nodes/${node}/storage/${storage}/content`,
										params,
										{},
										{ PVEAuthCookie: pveAuth.GetAuthCookie() }
									);
								},

								Post: async function (params) {
									return await pveCurl.PveCurl.Post(
										`${pveAuth.GetEndpoint()}/nodes/${node}/storage/${storage}/content`,
										params,
										{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
										{ PVEAuthCookie: pveAuth.GetAuthCookie() }
									);
								},

								Volume: function (volume) {
									return {
										Get: async function () {
											return await pveCurl.PveCurl.Get(
												`${pveAuth.GetEndpoint()}/nodes/${node}/storage/${storage}/content/${volume}`,
												{},
												{},
												{ PVEAuthCookie: pveAuth.GetAuthCookie() }
											);
										},

										Post: async function (params) {
											return await pveCurl.PveCurl.Post(
												`${pveAuth.GetEndpoint()}/nodes/${node}/storage/${storage}/content/${volume}`,
												params,
												{
													CSRFPreventionToken: pveAuth.GetCsrfPreventionToken(),
												},
												{ PVEAuthCookie: pveAuth.GetAuthCookie() }
											);
										},

										Put: async function (params) {
											return await pveCurl.PveCurl.Put(
												`${pveAuth.GetEndpoint()}/nodes/${node}/storage/${storage}/content/${volume}`,
												params,
												{
													CSRFPreventionToken: pveAuth.GetCsrfPreventionToken(),
												},
												{ PVEAuthCookie: pveAuth.GetAuthCookie() }
											);
										},

										Delete: async function (params) {
											return await pveCurl.PveCurl.Delete(
												`${pveAuth.GetEndpoint()}/nodes/${node}/storage/${storage}/content/${volume}`,
												params,
												{
													CSRFPreventionToken: pveAuth.GetCsrfPreventionToken(),
												},
												{ PVEAuthCookie: pveAuth.GetAuthCookie() }
											);
										},
									};
								},
							},

							FileRestore: {
								Post: async function (params) {
									return await pveCurl.PveCurl.Post(
										`${pveAuth.GetEndpoint()}/nodes/${node}/storage/${storage}/file-restore`,
										params,
										{ CSRFPreventionToken: pveAuthInfo.apiTicket.ticket },
										{ PVEAuthCookie: pveAuth.GetAuthCookie() }
									);
								},

								Download: {
									Get: async function (volume) {
										return await pveCurl.PveCurl.Get(
											`${pveAuth.GetEndpoint()}/nodes/${node}/storage/${storage}/file-restore/download`,
											params,
											{},
											{ PVEAuthCookie: pveAuth.GetAuthCookie() }
										);
									},
								},
								List: {
									Get: async function () {
										return await pveCurl.PveCurl.Get(
											`${pveAuth.GetEndpoint()}/nodes/${node}/storage/${storage}/file-restore/list`,
											params,
											{},
											{ PVEAuthCookie: pveAuth.GetAuthCookie() }
										);
									},
								},
							},

							DownloadUrl: {
								Post: async function (params) {
									return await pveCurl.PveCurl.Post(
										`${pveAuth.GetEndpoint()}/nodes/${node}/storage/${storage}/download-url`,
										params,
										{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
										{ PVEAuthCookie: pveAuth.GetAuthCookie() }
									);
								},
							},

							PruneBackups: {
								Get: async function (params) {
									return await pveCurl.PveCurl.Get(
										`${pveAuth.GetEndpoint()}/nodes/${node}/storage/${storage}/prunebackups`,
										params,
										{},
										{ PVEAuthCookie: pveAuth.GetAuthCookie() }
									);
								},

								Delete: async function (params) {
									return await pveCurl.PveCurl.Delete(
										`${pveAuth.GetEndpoint()}/nodes/${node}/storage/${storage}/prunebackups`,
										params,
										{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
										{ PVEAuthCookie: pveAuth.GetAuthCookie() }
									);
								},
							},

							Rrd: {
								Get: async function (params) {
									return await pveCurl.PveCurl.Get(
										`${pveAuth.GetEndpoint()}/nodes/${node}/storage/${storage}/rrd`,
										params,
										{},
										{ PVEAuthCookie: pveAuth.GetAuthCookie() }
									);
								},
							},

							RrdData: {
								Get: async function (params) {
									return await pveCurl.PveCurl.Get(
										`${pveAuth.GetEndpoint()}/nodes/${node}/storage/${storage}/rrddata`,
										params,
										{},
										{ PVEAuthCookie: pveAuth.GetAuthCookie() }
									);
								},
							},

							Status: {
								Get: async function () {
									return await pveCurl.PveCurl.Get(
										`${pveAuth.GetEndpoint()}/nodes/${node}/storage/${storage}/status`,
										params,
										{},
										{ PVEAuthCookie: pveAuth.GetAuthCookie() }
									);
								},
							},

							Upload: {
								Post: async function (params) {
									return await pveCurl.PveCurl.Post(
										`${pveAuth.GetEndpoint()}/nodes/${node}/storage/${storage}/upload`,
										params,
										{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
										{ PVEAuthCookie: pveAuth.GetAuthCookie() }
									);
								},
							},
						};
					},
				},

				Tasks: {
					Get: async function (params) {
						return await pveCurl.PveCurl.Get(
							`${pveAuth.GetEndpoint()}/nodes/${node}/tasks`,
							params,
							{},
							{ PVEAuthCookie: pveAuth.GetAuthCookie() }
						);
					},

					Upid: function (upid) {
						return {
							Get: async function () {
								return await pveCurl.PveCurl.Get(
									`${pveAuth.GetEndpoint()}/nodes/${node}/tasks/${upid}`,
									{},
									{},
									{ PVEAuthCookie: pveAuth.GetAuthCookie() }
								);
							},

							Delete: async function () {
								return await pveCurl.PveCurl.Delete(
									`${pveAuth.GetEndpoint()}/nodes/${node}/tasks/${upid}`,
									{},
									{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
									{ PVEAuthCookie: pveAuth.GetAuthCookie() }
								);
							},

							Log: {
								Get: async function (params) {
									return await pveCurl.PveCurl.Get(
										`${pveAuth.GetEndpoint()}/nodes/${node}/tasks/${upid}/log`,
										params,
										{},
										{ PVEAuthCookie: pveAuth.GetAuthCookie() }
									);
								},
							},

							Status: {
								Get: async function (params) {
									return await pveCurl.PveCurl.Get(
										`${pveAuth.GetEndpoint()}/nodes/${node}/tasks/${upid}/status`,
										params,
										{},
										{ PVEAuthCookie: pveAuth.GetAuthCookie() }
									);
								},
							},
						};
					},
				},

				VZDump: {
					Post: async function (params) {
						return await pveCurl.PveCurl.Post(
							`${pveAuth.GetEndpoint()}/nodes/${node}/vzdump`,
							params,
							{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
							{ PVEAuthCookie: pveAuth.GetAuthCookie() }
						);
					},

					Defaults: {
						Get: async function (params) {
							return await pveCurl.PveCurl.Get(
								`${pveAuth.GetEndpoint()}/nodes/${node}/vzdump/defaults`,
								params,
								{},
								{ PVEAuthCookie: pveAuth.GetAuthCookie() }
							);
						},
					},

					ExtractConfig: {
						Get: async function (params) {
							return await pveCurl.PveCurl.Get(
								`${pveAuth.GetEndpoint()}/nodes/${node}/vzdump/extraconfig`,
								params,
								{},
								{ PVEAuthCookie: pveAuth.GetAuthCookie() }
							);
						},
					},
				},

				AplInfo: {
					Get: async function () {
						return await pveCurl.PveCurl.Get(
							`${pveAuth.GetEndpoint()}/nodes/${node}/aplinfo`,
							{},
							{},
							{ PVEAuthCookie: pveAuth.GetAuthCookie() }
						);
					},

					Post: async function (params) {
						return await pveCurl.PveCurl.Post(
							`${pveAuth.GetEndpoint()}/nodes/${node}/aplinfo`,
							params,
							{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
							{ PVEAuthCookie: pveAuth.GetAuthCookie() }
						);
					},
				},

				Config: {
					Get: async function (params) {
						return await pveCurl.PveCurl.Get(
							`${pveAuth.GetEndpoint()}/nodes/${node}/config`,
							params,
							{},
							{ PVEAuthCookie: pveAuth.GetAuthCookie() }
						);
					},

					Put: async function (params) {
						return await pveCurl.PveCurl.Put(
							`${pveAuth.GetEndpoint()}/nodes/${node}/config`,
							params,
							{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
							{ PVEAuthCookie: pveAuth.GetAuthCookie() }
						);
					},
				},

				Dns: {
					Get: async function () {
						return await pveCurl.PveCurl.Get(
							`${pveAuth.GetEndpoint()}/nodes/${node}/dns`,
							{},
							{},
							{ PVEAuthCookie: pveAuth.GetAuthCookie() }
						);
					},

					Put: async function (params) {
						return await pveCurl.PveCurl.Put(
							`${pveAuth.GetEndpoint()}/nodes/${node}/dns`,
							params,
							{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
							{ PVEAuthCookie: pveAuth.GetAuthCookie() }
						);
					},
				},

				Execute: {
					Get: async function () {
						return await pveCurl.PveCurl.Get(
							`${pveAuth.GetEndpoint()}/nodes/${node}/execute`,
							{},
							{},
							{ PVEAuthCookie: pveAuth.GetAuthCookie() }
						);
					},

					Put: async function (params) {
						return await pveCurl.PveCurl.Put(
							`${pveAuth.GetEndpoint()}/nodes/${node}/execute`,
							params,
							{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
							{ PVEAuthCookie: pveAuth.GetAuthCookie() }
						);
					},
				},

				Hosts: {
					Get: async function () {
						return await pveCurl.PveCurl.Get(
							`${pveAuth.GetEndpoint()}/nodes/${node}/hosts`,
							{},
							{},
							{ PVEAuthCookie: pveAuth.GetAuthCookie() }
						);
					},

					Post: async function (params) {
						return await pveCurl.PveCurl.Post(
							`${pveAuth.GetEndpoint()}/nodes/${node}/hosts`,
							params,
							{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
							{ PVEAuthCookie: pveAuth.GetAuthCookie() }
						);
					},
				},

				Journal: {
					Get: async function (params) {
						return await pveCurl.PveCurl.Get(
							`${pveAuth.GetEndpoint()}/nodes/${node}/journal`,
							params,
							{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
							{ PVEAuthCookie: pveAuth.GetAuthCookie() }
						);
					},
				},

				MigrateAll: {
					Post: async function (params) {
						return await pveCurl.PveCurl.Post(
							`${pveAuth.GetEndpoint()}/nodes/${node}/migrateall`,
							params,
							{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
							{ PVEAuthCookie: pveAuth.GetAuthCookie() }
						);
					},
				},

				NetStat: {
					Get: async function () {
						return await pveCurl.PveCurl.Get(
							`${pveAuth.GetEndpoint()}/nodes/${node}/netstat`,
							{},
							{},
							{ PVEAuthCookie: pveAuth.GetAuthCookie() }
						);
					},
				},

				Report: {
					Get: async function () {
						return await pveCurl.PveCurl.Get(
							`${pveAuth.GetEndpoint()}/nodes/${node}/report`,
							{},
							{},
							{ PVEAuthCookie: pveAuth.GetAuthCookie() }
						);
					},
				},

				Rrd: {
					Get: async function (params) {
						return await pveCurl.PveCurl.Get(
							`${pveAuth.GetEndpoint()}/nodes/${node}/rrd`,
							params,
							{},
							{ PVEAuthCookie: pveAuth.GetAuthCookie() }
						);
					},
				},

				RrdData: {
					Get: async function (params) {
						return await pveCurl.PveCurl.Get(
							`${pveAuth.GetEndpoint()}/nodes/${node}/rrddata`,
							params,
							{},
							{ PVEAuthCookie: pveAuth.GetAuthCookie() }
						);
					},
				},

				SpiceShell: {
					Post: async function (params) {
						return await pveCurl.PveCurl.Post(
							`${pveAuth.GetEndpoint()}/nodes/${node}/spiceshell`,
							params,
							{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
							{ PVEAuthCookie: pveAuth.GetAuthCookie() }
						);
					},
				},

				StartAll: {
					Post: async function (params) {
						return await pveCurl.PveCurl.Post(
							`${pveAuth.GetEndpoint()}/nodes/${node}/startall`,
							params,
							{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
							{ PVEAuthCookie: pveAuth.GetAuthCookie() }
						);
					},
				},

				Status: {
					Get: async function () {
						return await pveCurl.PveCurl.Get(
							`${pveAuth.GetEndpoint()}/nodes/${node}/status`,
							{},
							{},
							{ PVEAuthCookie: pveAuth.GetAuthCookie() }
						);
					},

					Post: async function (params) {
						return await pveCurl.PveCurl.Post(
							`${pveAuth.GetEndpoint()}/nodes/${node}/status`,
							params,
							{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
							{ PVEAuthCookie: pveAuth.GetAuthCookie() }
						);
					},
				},

				StopAll: {
					Post: async function (params) {
						return await pveCurl.PveCurl.Post(
							`${pveAuth.GetEndpoint()}/nodes/${node}/stopall`,
							params,
							{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
							{ PVEAuthCookie: pveAuth.GetAuthCookie() }
						);
					},
				},

				Subscription: {
					Get: async function () {
						return await pveCurl.PveCurl.Get(
							`${pveAuth.GetEndpoint()}/nodes/${node}/subscription`,
							{},
							{},
							{ PVEAuthCookie: pveAuth.GetAuthCookie() }
						);
					},

					Post: async function (params) {
						return await pveCurl.PveCurl.Post(
							`${pveAuth.GetEndpoint()}/nodes/${node}/subscription`,
							params,
							{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
							{ PVEAuthCookie: pveAuth.GetAuthCookie() }
						);
					},

					Put: async function (params) {
						return await pveCurl.PveCurl.Put(
							`${pveAuth.GetEndpoint()}/nodes/${node}/subscription`,
							params,
							{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
							{ PVEAuthCookie: pveAuth.GetAuthCookie() }
						);
					},

					Delete: async function () {
						return await pveCurl.PveCurl.Delete(
							`${pveAuth.GetEndpoint()}/nodes/${node}/subscription`,
							params,
							{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
							{ PVEAuthCookie: pveAuth.GetAuthCookie() }
						);
					},
				},

				SysLog: {
					Get: async function () {
						return await pveCurl.PveCurl.Get(
							`${pveAuth.GetEndpoint()}/nodes/${node}/syslog`,
							params,
							{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
							{ PVEAuthCookie: pveAuth.GetAuthCookie() }
						);
					},
				},

				TermProxy: {
					Post: async function (params) {
						return await pveCurl.PveCurl.Post(
							`${pveAuth.GetEndpoint()}/nodes/${node}/termproxy`,
							params,
							{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
							{ PVEAuthCookie: pveAuth.GetAuthCookie() }
						);
					},
				},
				Time: {
					Get: async function () {
						return await pveCurl.PveCurl.Get(
							`${pveAuth.GetEndpoint()}/nodes/${node}/time`,
							{},
							{},
							{ PVEAuthCookie: pveAuth.GetAuthCookie() }
						);
					},

					Put: async function (params) {
						return await pveCurl.PveCurl.Put(
							`${pveAuth.GetEndpoint()}/nodes/${node}/time`,
							params,
							{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
							{ PVEAuthCookie: pveAuth.GetAuthCookie() }
						);
					},
				},
				Version: {
					Get: async function () {
						return await pveCurl.PveCurl.Get(
							`${pveAuth.GetEndpoint()}/nodes/${node}/version`,
							{},
							{},
							{ PVEAuthCookie: pveAuth.GetAuthCookie() }
						);
					},
				},

				VncShell: {
					Post: async function (params) {
						return await pveCurl.PveCurl.Post(
							`${pveAuth.GetEndpoint()}/nodes/${node}/vncshell`,
							params,
							{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
							{ PVEAuthCookie: pveAuth.GetAuthCookie() }
						);
					},
				},

				VncWebSocket: {
					Get: async function () {
						return await pveCurl.PveCurl.Get(
							`${pveAuth.GetEndpoint()}/nodes/${node}/vncwebsocket`,
							{},
							{},
							{ PVEAuthCookie: pveAuth.GetAuthCookie() }
						);
					},
				},

				WakeOnLan: {
					Post: async function () {
						return await pveCurl.PveCurl.Post(
							`${pveAuth.GetEndpoint()}/nodes/${node}/wakeonlan`,
							{},
							{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
							{ PVEAuthCookie: pveAuth.GetAuthCookie() }
						);
					},
				},
			};
		},
	};

	return Module;
};
