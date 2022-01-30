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

		Get: async function () {
			await pveAuth.GenerateTicket();
			return await pve_utils.PveCurl.Get(
				`${pveAuthInfo.endpoint}/nodes`,
				{},
				{},
				{ PVEAuthCookie: pveAuth.GetAuthCookie() }
			);
		},

		Node: function (node) {
			return {
				Get: async function () {
					await pveAuth.GenerateTicket();
					return await pve_utils.PveCurl.Get(
						`${pveAuthInfo.endpoint}/nodes/${node}`,
						{},
						{},
						{ PVEAuthCookie: pveAuth.GetAuthCookie() }
					);
				},

				Apt: {
					Get: async function () {
						await pveAuth.GenerateTicket();
						return await pve_utils.PveCurl.Get(
							`${pveAuthInfo.endpoint}/nodes/${node}/apt`,
							{},
							{},
							{ PVEAuthCookie: pveAuth.GetAuthCookie() }
						);
					},

					ChangeLog: {
						Get: async function (params) {
							await pveAuth.GenerateTicket();
							return await pve_utils.PveCurl.Get(
								`${pveAuthInfo.endpoint}/nodes/${node}/apt/changelog`,
								params,
								{},
								{ PVEAuthCookie: pveAuth.GetAuthCookie() }
							);
						},
					},
					Repositories: {
						Get: async function () {
							await pveAuth.GenerateTicket();
							return await pve_utils.PveCurl.Get(
								`${pveAuthInfo.endpoint}/nodes/${node}/apt/repositories`,
								{},
								{},
								{ PVEAuthCookie: pveAuth.GetAuthCookie() }
							);
						},

						Post: async function (params) {
							await pveAuth.GenerateTicket();
							return await pve_utils.PveCurl.Post(
								`${pveAuthInfo.endpoint}/nodes/${node}/apt/repositories`,
								params,
								{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
								{ PVEAuthCookie: pveAuth.GetAuthCookie() }
							);
						},

						Put: async function (params) {
							await pveAuth.GenerateTicket();
							return await pve_utils.PveCurl.Put(
								`${pveAuthInfo.endpoint}/nodes/${node}/apt/repositories`,
								params,
								{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
								{ PVEAuthCookie: pveAuth.GetAuthCookie() }
							);
						},
					},

					Update: {
						Get: async function () {
							await pveAuth.GenerateTicket();
							return await pve_utils.PveCurl.Get(
								`${pveAuthInfo.endpoint}/nodes/${node}/apt/update`,
								{},
								{},
								{ PVEAuthCookie: pveAuth.GetAuthCookie() }
							);
						},

						Post: async function (params) {
							await pveAuth.GenerateTicket();
							return await pve_utils.PveCurl.Post(
								`${pveAuthInfo.endpoint}/nodes/${node}/apt/update`,
								params,
								{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
								{ PVEAuthCookie: pveAuth.GetAuthCookie() }
							);
						},
					},
					Version: {
						Get: async function () {
							await pveAuth.GenerateTicket();
							return await pve_utils.PveCurl.Get(
								`${pveAuthInfo.endpoint}/nodes/${node}/apt/version`,
								{},
								{},
								{ PVEAuthCookie: pveAuth.GetAuthCookie() }
							);
						},
					},
				},

				Capabilities: {
					Get: async function () {
						await pveAuth.GenerateTicket();
						return await pve_utils.PveCurl.Get(
							`${pveAuthInfo.endpoint}/nodes/${node}/capabilities`,
							{},
							{},
							{ PVEAuthCookie: pveAuth.GetAuthCookie() }
						);
					},

					Qemu: {
						Get: async function () {
							await pveAuth.GenerateTicket();
							return await pve_utils.PveCurl.Get(
								`${pveAuthInfo.endpoint}/nodes/${node}/capabilities/qemu`,
								{},
								{},
								{ PVEAuthCookie: pveAuth.GetAuthCookie() }
							);
						},

						Cpu: {
							Get: async function () {
								await pveAuth.GenerateTicket();
								return await pve_utils.PveCurl.Get(
									`${pveAuthInfo.endpoint}/nodes/${node}/capabilities/qemu/cpu`,
									{},
									{},
									{ PVEAuthCookie: pveAuth.GetAuthCookie() }
								);
							},
						},
						Machines: {
							Get: async function () {
								await pveAuth.GenerateTicket();
								return await pve_utils.PveCurl.Get(
									`${pveAuthInfo.endpoint}/nodes/${node}/capabilities/qemu/machines`,
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
						await pveAuth.GenerateTicket();
						return await pve_utils.PveCurl.Get(
							`${pveAuthInfo.endpoint}/nodes/${node}/ceph`,
							{},
							{},
							{ PVEAuthCookie: pveAuth.GetAuthCookie() }
						);
					},
					Fs: {
						Get: async function () {
							await pveAuth.GenerateTicket();
							return await pve_utils.PveCurl.Get(
								`${pveAuthInfo.endpoint}/nodes/${node}/ceph/fs`,
								{},
								{},
								{ PVEAuthCookie: pveAuth.GetAuthCookie() }
							);
						},

						Name: function (name) {
							return {
								Post: async function (params) {
									await pveAuth.GenerateTicket();
									return await pve_utils.PveCurl.Post(
										`${pveAuthInfo.endpoint}/nodes/${node}/ceph/${name}`,
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
							await pveAuth.GenerateTicket();
							return await pve_utils.PveCurl.Get(
								`${pveAuthInfo.endpoint}/nodes/${node}/ceph/mds`,
								{},
								{},
								{ PVEAuthCookie: pveAuth.GetAuthCookie() }
							);
						},

						Name: function (name) {
							return {
								Post: async function (params) {
									await pveAuth.GenerateTicket();
									return await pve_utils.PveCurl.Get(
										`${pveAuthInfo.endpoint}/nodes/${node}/ceph/mds/${name}`,
										params,
										{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
										{ PVEAuthCookie: pveAuth.GetAuthCookie() }
									);
								},

								Delete: async function (params) {
									await pveAuth.GenerateTicket();
									return await pve_utils.PveCurl.Get(
										`${pveAuthInfo.endpoint}/nodes/${node}/ceph/mds/${name}`,
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
							await pveAuth.GenerateTicket();
							return await pve_utils.PveCurl.Get(
								`${pveAuthInfo.endpoint}/nodes/${node}/ceph/mgr`,
								{},
								{},
								{ PVEAuthCookie: pveAuth.GetAuthCookie() }
							);
						},
						Id: function (id) {
							return {
								Post: async function (params) {
									await pveAuth.GenerateTicket();
									return await pve_utils.PveCurl.Get(
										`${pveAuthInfo.endpoint}/nodes/${node}/ceph/mgr/${id}`,
										params,
										{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
										{ PVEAuthCookie: pveAuth.GetAuthCookie() }
									);
								},
								Delete: async function (params) {
									await pveAuth.GenerateTicket();
									return await pve_utils.PveCurl.Get(
										`${pveAuthInfo.endpoint}/nodes/${node}/ceph/mgr/${id}`,
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
							await pveAuth.GenerateTicket();
							return await pve_utils.PveCurl.Get(
								`${pveAuthInfo.endpoint}/nodes/${node}/ceph/mon`,
								{},
								{},
								{ PVEAuthCookie: pveAuth.GetAuthCookie() }
							);
						},

						MonID: async function (monid) {
							return {
								Post: async function (params) {
									await pveAuth.GenerateTicket();
									return await pve_utils.PveCurl.Get(
										`${pveAuthInfo.endpoint}/nodes/${node}/ceph/mon/${monid}`,
										params,
										{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
										{ PVEAuthCookie: pveAuth.GetAuthCookie() }
									);
								},

								Delete: async function (params) {
									await pveAuth.GenerateTicket();
									return await pve_utils.PveCurl.Get(
										`${pveAuthInfo.endpoint}/nodes/${node}/ceph/mon/${monid}`,
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
							await pveAuth.GenerateTicket();
							return await pve_utils.PveCurl.Get(
								`${pveAuthInfo.endpoint}/nodes/${node}/ceph/osd`,
								{},
								{},
								{ PVEAuthCookie: pveAuth.GetAuthCookie() }
							);
						},

						Post: async function (params) {
							await pveAuth.GenerateTicket();
							return await pve_utils.PveCurl.Post(
								`${pveAuthInfo.endpoint}/nodes/${node}/ceph/osd`,
								params,
								{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
								{ PVEAuthCookie: pveAuth.GetAuthCookie() }
							);
						},

						OsdID: function (osdid) {
							return {
								Delete: async function (params) {
									await pveAuth.GenerateTicket();
									return await pve_utils.PveCurl.Get(
										`${pveAuthInfo.endpoint}/nodes/${node}/ceph/osd/${osdid}`,
										params,
										{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
										{ PVEAuthCookie: pveAuth.GetAuthCookie() }
									);
								},
								In: {
									Post: async function (params) {
										await pveAuth.GenerateTicket();
										return await pve_utils.PveCurl.Post(
											`${pveAuthInfo.endpoint}/nodes/${node}/ceph/osd/${osdid}/in`,
											params,
											{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
											{ PVEAuthCookie: pveAuth.GetAuthCookie() }
										);
									},
								},
								Out: {
									Post: async function (params) {
										await pveAuth.GenerateTicket();
										return await pve_utils.PveCurl.Post(
											`${pveAuthInfo.endpoint}/nodes/${node}/ceph/osd/${osdid}/out`,
											params,
											{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
											{ PVEAuthCookie: pveAuth.GetAuthCookie() }
										);
									},
								},
								Scrub: {
									Post: async function (params) {
										await pveAuth.GenerateTicket();
										return await pve_utils.PveCurl.Post(
											`${pveAuthInfo.endpoint}/nodes/${node}/ceph/osd/${osdid}/scrub`,
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
							await pveAuth.GenerateTicket();
							return await pve_utils.PveCurl.Get(
								`${pveAuthInfo.endpoint}/nodes/${node}/ceph/pools`,
								{},
								{},
								{ PVEAuthCookie: pveAuth.GetAuthCookie() }
							);
						},

						Post: async function (params) {
							await pveAuth.GenerateTicket();
							return await pve_utils.PveCurl.Post(
								`${pveAuthInfo.endpoint}/nodes/${node}/ceph/pools`,
								params,
								{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
								{ PVEAuthCookie: pveAuth.GetAuthCookie() }
							);
						},

						Name: function (name) {
							return {
								Get: async function (params) {
									await pveAuth.GenerateTicket();
									return await pve_utils.PveCurl.Get(
										`${pveAuthInfo.endpoint}/nodes/${node}/ceph/pools/${name}`,
										params,
										{},
										{ PVEAuthCookie: pveAuth.GetAuthCookie() }
									);
								},

								Put: async function (params) {
									await pveAuth.GenerateTicket();
									return await pve_utils.PveCurl.Put(
										`${pveAuthInfo.endpoint}/nodes/${node}/ceph/pools/${name}`,
										params,
										{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
										{ PVEAuthCookie: pveAuth.GetAuthCookie() }
									);
								},

								Delete: async function (params) {
									await pveAuth.GenerateTicket();
									return await pve_utils.PveCurl.Delete(
										`${pveAuthInfo.endpoint}/nodes/${node}/ceph/pools/${name}`,
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
							await pveAuth.GenerateTicket();
							return await pve_utils.PveCurl.Get(
								`${pveAuthInfo.endpoint}/nodes/${node}/ceph/config`,
								{},
								{},
								{ PVEAuthCookie: pveAuth.GetAuthCookie() }
							);
						},
					},

					ConfigDb: {
						Get: async function () {
							await pveAuth.GenerateTicket();
							return await pve_utils.PveCurl.Get(
								`${pveAuthInfo.endpoint}/nodes/${node}/ceph/configdb`,
								{},
								{},
								{ PVEAuthCookie: pveAuth.GetAuthCookie() }
							);
						},
					},

					Crush: {
						Get: async function () {
							await pveAuth.GenerateTicket();
							return await pve_utils.PveCurl.Get(
								`${pveAuthInfo.endpoint}/nodes/${node}/ceph/crush`,
								{},
								{},
								{ PVEAuthCookie: pveAuth.GetAuthCookie() }
							);
						},
					},

					Init: {
						Post: async function () {
							await pveAuth.GenerateTicket();
							return await pve_utils.PveCurl.Get(
								`${pveAuthInfo.endpoint}/nodes/${node}/ceph/init`,
								{},
								{},
								{ PVEAuthCookie: pveAuth.GetAuthCookie() }
							);
						},
					},

					Log: {
						Get: async function () {
							await pveAuth.GenerateTicket();
							return await pve_utils.PveCurl.Get(
								`${pveAuthInfo.endpoint}/nodes/${node}/ceph/log`,
								{},
								{},
								{ PVEAuthCookie: pveAuth.GetAuthCookie() }
							);
						},
					},

					Restart: {
						Post: async function (params) {
							await pveAuth.GenerateTicket();
							return await pve_utils.PveCurl.Get(
								`${pveAuthInfo.endpoint}/nodes/${node}/ceph/config`,
								params,
								{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
								{ PVEAuthCookie: pveAuth.GetAuthCookie() }
							);
						},
					},

					Rules: {
						Get: async function () {
							await pveAuth.GenerateTicket();
							return await pve_utils.PveCurl.Get(
								`${pveAuthInfo.endpoint}/nodes/${node}/ceph/rules`,
								{},
								{},
								{ PVEAuthCookie: pveAuth.GetAuthCookie() }
							);
						},
					},

					Start: {
						Post: async function (params) {
							await pveAuth.GenerateTicket();
							return await pve_utils.PveCurl.Get(
								`${pveAuthInfo.endpoint}/nodes/${node}/ceph/start`,
								params,
								{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
								{ PVEAuthCookie: pveAuth.GetAuthCookie() }
							);
						},
					},

					Status: {
						Get: async function () {
							await pveAuth.GenerateTicket();
							return await pve_utils.PveCurl.Get(
								`${pveAuthInfo.endpoint}/nodes/${node}/ceph/status`,
								{},
								{},
								{ PVEAuthCookie: pveAuth.GetAuthCookie() }
							);
						},
					},

					Stop: {
						Post: async function (params) {
							await pveAuth.GenerateTicket();
							return await pve_utils.PveCurl.Get(
								`${pveAuthInfo.endpoint}/nodes/${node}/ceph/stop`,
								params,
								{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
								{ PVEAuthCookie: pveAuth.GetAuthCookie() }
							);
						},
					},
				},

				Certificates: {
					Get: async function () {
						await pveAuth.GenerateTicket();
						return await pve_utils.PveCurl.Get(
							`${pveAuthInfo.endpoint}/nodes/${node}/certificates`,
							{},
							{},
							{ PVEAuthCookie: pveAuth.GetAuthCookie() }
						);
					},

					Acme: {
						Get: async function () {
							await pveAuth.GenerateTicket();
							return await pve_utils.PveCurl.Get(
								`${pveAuthInfo.endpoint}/nodes/${node}/certificates/acme`,
								{},
								{},
								{ PVEAuthCookie: pveAuth.GetAuthCookie() }
							);
						},

						Certificate: {
							Post: async function (params) {
								await pveAuth.GenerateTicket();
								return await pve_utils.PveCurl.Post(
									`${pveAuthInfo.endpoint}/nodes/${node}/certificates/acme/certificate`,
									params,
									{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
									{ PVEAuthCookie: pveAuth.GetAuthCookie() }
								);
							},

							Put: async function (params) {
								await pveAuth.GenerateTicket();
								return await pve_utils.PveCurl.Put(
									`${pveAuthInfo.endpoint}/nodes/${node}/certificates/acme/certificate`,
									params,
									{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
									{ PVEAuthCookie: pveAuth.GetAuthCookie() }
								);
							},

							Delete: async function () {
								await pveAuth.GenerateTicket();
								return await pve_utils.PveCurl.Delete(
									`${pveAuthInfo.endpoint}/nodes/${node}/certificates/acme/certificate`,
									{},
									{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
									{ PVEAuthCookie: pveAuth.GetAuthCookie() }
								);
							},
						},
					},

					Custom: {
						Post: async function (params) {
							await pveAuth.GenerateTicket();
							return await pve_utils.PveCurl.Post(
								`${pveAuthInfo.endpoint}/nodes/${node}/certificates/custom`,
								params,
								{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
								{ PVEAuthCookie: pveAuth.GetAuthCookie() }
							);
						},

						Delete: async function (params) {
							await pveAuth.GenerateTicket();
							return await pve_utils.PveCurl.Delete(
								`${pveAuthInfo.endpoint}/nodes/${node}/certificates/custom`,
								params,
								{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
								{ PVEAuthCookie: pveAuth.GetAuthCookie() }
							);
						},
					},

					Info: {
						Get: async function () {
							await pveAuth.GenerateTicket();
							return await pve_utils.PveCurl.Get(
								`${pveAuthInfo.endpoint}/nodes/${node}/certificates/info`,
								{},
								{},
								{ PVEAuthCookie: pveAuth.GetAuthCookie() }
							);
						},
					},
				},

				Disks: {
					Get: async function () {
						await pveAuth.GenerateTicket();
						return await pve_utils.PveCurl.Get(
							`${pveAuthInfo.endpoint}/nodes/${node}/disks`,
							{},
							{},
							{ PVEAuthCookie: pveAuth.GetAuthCookie() }
						);
					},

					Zfs: {
						Get: async function () {
							await pveAuth.GenerateTicket();
							return await pve_utils.PveCurl.Get(
								`${pveAuthInfo.endpoint}/nodes/${node}/disks/zfs`,
								{},
								{},
								{ PVEAuthCookie: pveAuth.GetAuthCookie() }
							);
						},

						Post: async function (params) {
							await pveAuth.GenerateTicket();
							return await pve_utils.PveCurl.Post(
								`${pveAuthInfo.endpoint}/nodes/${node}/disks/zfs`,
								params,
								{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
								{ PVEAuthCookie: pveAuth.GetAuthCookie() }
							);
						},

						Name: function (name) {
							return {
								Get: async function () {
									await pveAuth.GenerateTicket();
									return await pve_utils.PveCurl.Get(
										`${pveAuthInfo.endpoint}/nodes/${node}/disks/zfs/${name}`,
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
							await pveAuth.GenerateTicket();
							return await pve_utils.PveCurl.Get(
								`${pveAuthInfo.endpoint}/nodes/${node}/disks/directory`,
								{},
								{},
								{ PVEAuthCookie: pveAuth.GetAuthCookie() }
							);
						},

						Post: async function (params) {
							await pveAuth.GenerateTicket();
							return await pve_utils.PveCurl.Post(
								`${pveAuthInfo.endpoint}/nodes/${node}/disks/directory`,
								params,
								{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
								{ PVEAuthCookie: pveAuth.GetAuthCookie() }
							);
						},
					},

					InitGpt: {
						Post: async function (params) {
							await pveAuth.GenerateTicket();
							return await pve_utils.PveCurl.Post(
								`${pveAuthInfo.endpoint}/nodes/${node}/disks/initgpt`,
								params,
								{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
								{ PVEAuthCookie: pveAuth.GetAuthCookie() }
							);
						},
					},

					List: {
						Get: async function (params) {
							await pveAuth.GenerateTicket();
							return await pve_utils.PveCurl.Get(
								`${pveAuthInfo.endpoint}/nodes/${node}/disks/list`,
								params,
								{},
								{ PVEAuthCookie: pveAuth.GetAuthCookie() }
							);
						},
					},

					Lvm: {
						Get: async function () {
							await pveAuth.GenerateTicket();
							return await pve_utils.PveCurl.Get(
								`${pveAuthInfo.endpoint}/nodes/${node}/disks/lvm`,
								{},
								{},
								{ PVEAuthCookie: pveAuth.GetAuthCookie() }
							);
						},

						Post: async function (params) {
							await pveAuth.GenerateTicket();
							return await pve_utils.PveCurl.Post(
								`${pveAuthInfo.endpoint}/nodes/${node}/disks/lvm`,
								params,
								{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
								{ PVEAuthCookie: pveAuth.GetAuthCookie() }
							);
						},
					},

					LvmThin: {
						Get: async function () {
							await pveAuth.GenerateTicket();
							return await pve_utils.PveCurl.Get(
								`${pveAuthInfo.endpoint}/nodes/${node}/disks/lvmthin`,
								{},
								{},
								{ PVEAuthCookie: pveAuth.GetAuthCookie() }
							);
						},

						Post: async function (params) {
							await pveAuth.GenerateTicket();
							return await pve_utils.PveCurl.Post(
								`${pveAuthInfo.endpoint}/nodes/${node}/disks/lvmthin`,
								params,
								{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
								{ PVEAuthCookie: pveAuth.GetAuthCookie() }
							);
						},
					},

					Smart: {
						Get: async function (params) {
							await pveAuth.GenerateTicket();
							return await pve_utils.PveCurl.Get(
								`${pveAuthInfo.endpoint}/nodes/${node}/disks/smart`,
								params,
								{},
								{ PVEAuthCookie: pveAuth.GetAuthCookie() }
							);
						},
					},

					WipeDisk: {
						Put: async function () {
							await pveAuth.GenerateTicket();
							return await pve_utils.PveCurl.Put(
								`${pveAuthInfo.endpoint}/nodes/${node}/disks/wipedisk`,
								params,
								{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
								{ PVEAuthCookie: pveAuth.GetAuthCookie() }
							);
						},
					},
				},

				Firewall: {
					Get: async function () {
						await pveAuth.GenerateTicket();
						return await pve_utils.PveCurl.Get(
							`${pveAuthInfo.endpoint}/nodes/${node}/firewall`,
							{},
							{},
							{ PVEAuthCookie: pveAuth.GetAuthCookie() }
						);
					},

					Rules: {
						Get: async function () {
							await pveAuth.GenerateTicket();
							return await pve_utils.PveCurl.Get(
								`${pveAuthInfo.endpoint}/nodes/${node}/firewall/rules`,
								{},
								{},
								{ PVEAuthCookie: pveAuth.GetAuthCookie() }
							);
						},

						Post: async function (params) {
							await pveAuth.GenerateTicket();
							return await pve_utils.PveCurl.Post(
								`${pveAuthInfo.endpoint}/nodes/${node}/firewall/rules`,
								params,
								{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
								{ PVEAuthCookie: pveAuth.GetAuthCookie() }
							);
						},

						Pos: function (pos) {
							return {
								Get: async function () {
									await pveAuth.GenerateTicket();
									return await pve_utils.PveCurl.Get(
										`${pveAuthInfo.endpoint}/nodes/${node}/firewall/rules/${pos}`,
										{},
										{},
										{ PVEAuthCookie: pveAuth.GetAuthCookie() }
									);
								},

								Put: async function (params) {
									await pveAuth.GenerateTicket();
									return await pve_utils.PveCurl.Put(
										`${pveAuthInfo.endpoint}/nodes/${node}/firewall/rules/${pos}`,
										{ params },
										{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
										{ PVEAuthCookie: pveAuth.GetAuthCookie() }
									);
								},

								Delete: async function (params) {
									await pveAuth.GenerateTicket();
									return await pve_utils.PveCurl.Delete(
										`${pveAuthInfo.endpoint}/nodes/${node}/firewall/rules/${pos}`,
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
							await pveAuth.GenerateTicket();
							return await pve_utils.PveCurl.Get(
								`${pveAuthInfo.endpoint}/nodes/${node}/firewall/log`,
								{},
								{},
								{ PVEAuthCookie: pveAuth.GetAuthCookie() }
							);
						},
					},

					Options: {
						Get: async function () {
							await pveAuth.GenerateTicket();
							return await pve_utils.PveCurl.Get(
								`${pveAuthInfo.endpoint}/nodes/${node}/firewall/options`,
								{},
								{},
								{ PVEAuthCookie: pveAuth.GetAuthCookie() }
							);
						},

						Put: async function (params) {
							await pveAuth.GenerateTicket();
							return await pve_utils.PveCurl.Put(
								`${pveAuthInfo.endpoint}/nodes/${node}/firewall/options`,
								{ params },
								{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
								{ PVEAuthCookie: pveAuth.GetAuthCookie() }
							);
						},
					},
				},

				Hardware: {
					Get: async function () {
						await pveAuth.GenerateTicket();
						return await pve_utils.PveCurl.Get(
							`${pveAuthInfo.endpoint}/nodes/${node}/hardware`,
							{},
							{},
							{ PVEAuthCookie: pveAuth.GetAuthCookie() }
						);
					},

					Pci: {
						Get: async function () {
							await pveAuth.GenerateTicket();
							return await pve_utils.PveCurl.Get(
								`${pveAuthInfo.endpoint}/nodes/${node}/hardware/pci`,
								{},
								{},
								{ PVEAuthCookie: pveAuth.GetAuthCookie() }
							);
						},

						PciID: function (pciid) {
							return {
								Get: async function () {
									await pveAuth.GenerateTicket();
									return await pve_utils.PveCurl.Get(
										`${pveAuthInfo.apiTicket.endpoint}/nodes/${node}/hardware/pci/${pciid}`,
										{},
										{},
										{ PVEAuthCookie: pveAuth.GetAuthCookie() }
									);
								},

								Mdev: {
									Get: async function () {
										await pveAuth.GenerateTicket();
										return await pve_utils.PveCurl.Get(
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
							await pveAuth.GenerateTicket();
							return pve_utils.PveCurl.Get(
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
						await pveAuth.GenerateTicket();
						return await pve_utils.PveCurl.Get(
							`${pveAuthInfo.endpoint}/nodes/${node}/lxc`,
							{},
							{},
							{ PVEAuthCookie: pveAuth.GetAuthCookie() }
						);
					},

					Post: async function (params) {
						await pveAuth.GenerateTicket();
						return await pve_utils.PveCurl.Post(
							`${pveAuthInfo.endpoint}/nodes/${node}/lxc`,
							params,
							{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
							{ PVEAuthCookie: pveAuth.GetAuthCookie() }
						);
					},

					Vmid: function (vmid) {
						return {
							Get: async function () {
								await pveAuth.GenerateTicket();
								return await pve_utils.PveCurl.Get(
									`${pveAuthInfo.endpoint}/nodes/${node}/lxc/${vmid}`,
									{},
									{},
									{ PVEAuthCookie: pveAuth.GetAuthCookie() }
								);
							},

							Delete: async function (params) {
								await pveAuth.GenerateTicket();
								return await pve_utils.PveCurl.Delete(
									`${pveAuthInfo.endpoint}/nodes/${node}/lxc/${vmid}`,
									params,
									{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
									{ PVEAuthCookie: pveAuth.GetAuthCookie() }
								);
							},

							Firewall: {
								Get: async function () {
									await pveAuth.GenerateTicket();
									return await pve_utils.PveCurl.Get(
										`${pveAuthInfo.endpoint}/nodes/${node}/lxc/${vmid}/firewall`,
										{},
										{},
										{ PVEAuthCookie: pveAuth.GetAuthCookie() }
									);
								},

								Aliases: {
									Get: async function () {
										await pveAuth.GenerateTicket();
										return await pve_utils.PveCurl.Get(
											`${pveAuthInfo.endpoint}/nodes/${node}/lxc/${vmid}/firewall/aliases`,
											{},
											{},
											{ PVEAuthCookie: pveAuth.GetAuthCookie() }
										);
									},

									Post: async function (params) {
										await pveAuth.GenerateTicket();
										return await pve_utils.PveCurl.Post(
											`${pveAuthInfo.endpoint}/nodes/${node}/lxc/${vmid}/firewall/aliases`,
											params,
											{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
											{ PVEAuthCookie: pveAuthInfo.apiTicket.csrfPreventionToken }
										);
									},

									Name: function (name) {
										return {
											Get: async function () {
												await pveAuth.GenerateTicket();
												return await pve_utils.PveCurl.Get(
													`${pveAuthInfo.endpoint}/nodes/${node}/lxc/${vmid}/firewall/aliases/${name}`,
													{},
													{},
													{ PVEAuthCookie: pveAuth.GetAuthCookie() }
												);
											},

											Put: async function (params) {
												await pveAuth.GenerateTicket();
												return await pve_utils.PveCurl.Put(
													`${pveAuthInfo.endpoint}/nodes/${node}/lxc/${vmid}/firewall/aliases/${name}`,
													params,
													{
														CSRFPreventionToken: pveAuth.GetCsrfPreventionToken(),
													},
													{ PVEAuthCookie: pveAuth.GetAuthCookie() }
												);
											},

											Delete: async function (params) {
												await pveAuth.GenerateTicket();
												return await pve_utils.PveCurl.Delete(
													`${pveAuthInfo.endpoint}/nodes/${node}/lxc/${vmid}/firewall/aliases/${name}`,
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

								IpSet: {
									Get: async function () {
										await pveAuth.GenerateTicket();
										return await pve_utils.PveCurl.Get(
											`${pveAuthInfo.endpoint}/nodes/${node}/lxc/${vmid}/firewall/ipset`,
											{},
											{},
											{ PVEAuthCookie: pveAuth.GetAuthCookie() }
										);
									},

									Post: async function (params) {
										await pveAuth.GenerateTicket();
										return await pve_utils.PveCurl.Post(
											`${pveAuthInfo.endpoint}/nodes/${node}/lxc/${vmid}/firewall/ipset`,
											params,
											{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
											{ PVEAuthCookie: pveAuth.GetAuthCookie() }
										);
									},

									Name: function (name) {
										return {
											Get: async function () {
												await pveAuth.GenerateTicket();
												return await pve_utils.PveCurl.Get(
													`${pveAuthInfo.endpoint}/nodes/${node}/lxc/${vmid}/firewall/ipset/name`,
													{},
													{},
													{ PVEAuthCookie: pveAuth.GetAuthCookie() }
												);
											},

											Post: async function (params) {
												await pveAuth.GenerateTicket();
												return await pve_utils.PveCurl.Post(
													`${pveAuthInfo.endpoint}/nodes/${node}/lxc/${vmid}/firewall/ipset/name`,
													params,
													{
														CSRFPreventionToken: pveAuth.GetCsrfPreventionToken(),
													},
													{ PVEAuthCookie: pveAuth.GetAuthCookie() }
												);
											},

											Delete: async function () {
												await pveAuth.GenerateTicket();
												return await pve_utils.PveCurl.Delete(
													`${pveAuthInfo.endpoint}/nodes/${node}/lxc/${vmid}/firewall/ipset/name`,
													{},
													{
														CSRFPreventionToken: pveAuth.GetCsrfPreventionToken(),
													},
													{ PVEAuthCookie: pveAuth.GetAuthCookie() }
												);
											},

											Cidr: function (cidr) {
												return {
													Get: async function () {
														await pveAuth.GenerateTicket();
														return await pve_utils.PveCurl.Get(
															`${pveAuthInfo.endpoint}/nodes/${node}/lxc/${vmid}/firewall/ipset/name/${cidr}`,
															{},
															{},
															{ PVEAuthCookie: pveAuth.GetAuthCookie() }
														);
													},

													Put: async function (params) {
														await pveAuth.GenerateTicket();
														return await pve_utils.PveCurl.Put(
															`${pveAuthInfo.endpoint}/nodes/${node}/lxc/${vmid}/firewall/ipset/name/${cidr}`,
															params,
															{
																CSRFPreventionToken:
																	pveAuthInfo.apiTicket.csrfPreventionToken,
															},
															{ PVEAuthCookie: pveAuth.GetAuthCookie() }
														);
													},

													Delete: async function (params) {
														await pveAuth.GenerateTicket();
														return await pve_utils.PveCurl.Delete(
															`${pveAuthInfo.endpoint}/nodes/${node}/lxc/${vmid}/firewall/ipset/name/${cidr}`,
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
										await pveAuth.GenerateTicket();
										return await pve_utils.PveCurl.Get(
											`${pveAuthInfo.endpoint}/nodes/${node}/lxc/${vmid}/firewall/rules`,
											{},
											{},
											{ PVEAuthCookie: pveAuth.GetAuthCookie() }
										);
									},

									Post: async function (params) {
										await pveAuth.GenerateTicket();
										return await pve_utils.PveCurl.Post(
											`${pveAuthInfo.endpoint}/nodes/${node}/lxc/${vmid}/firewall/rules`,
											params,
											{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
											{ PVEAuthCookie: pveAuth.GetAuthCookie() }
										);
									},

									Pos: function (pos) {
										return {
											Get: async function () {
												await pveAuth.GenerateTicket();
												return await pve_utils.PveCurl.Get(
													`${pveAuthInfo.endpoint}/nodes/${node}/lxc/${vmid}/firewall/rules/${pos}`,
													{},
													{},
													{ PVEAuthCookie: pveAuth.GetAuthCookie() }
												);
											},

											Put: async function (params) {
												await pveAuth.GenerateTicket();
												return await pve_utils.PveCurl.Put(
													`${pveAuthInfo.endpoint}/nodes/${node}/lxc/${vmid}/firewall/rules/${pos}`,
													params,
													{
														CSRFPreventionToken: pveAuth.GetCsrfPreventionToken(),
													},
													{ PVEAuthCookie: pveAuth.GetAuthCookie() }
												);
											},

											Delete: async function (params) {
												await pveAuth.GenerateTicket();
												return await pve_utils.PveCurl.Delete(
													`${pveAuthInfo.endpoint}/nodes/${node}/lxc/${vmid}/firewall/rules/${pos}`,
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

								Log: {
									Get: async function (params) {
										await pveAuth.GenerateTicket();
										return await pve_utils.PveCurl.Get(
											`${pveAuthInfo.endpoint}/nodes/${node}/lxc/${vmid}/firewall/log`,
											params,
											{},
											{ PVEAuthCookie: pveAuth.GetAuthCookie() }
										);
									},
								},

								Options: {
									Get: async function () {
										await pveAuth.GenerateTicket();
										return await pve_utils.PveCurl.Get(
											`${pveAuthInfo.endpoint}/nodes/${node}/lxc/${vmid}/firewall/options`,
											{},
											{},
											{ PVEAuthCookie: pveAuth.GetAuthCookie() }
										);
									},

									Put: async function (params) {
										await pveAuth.GenerateTicket();
										return await pve_utils.PveCurl.Get(
											`${pveAuthInfo.endpoint}/nodes/${node}/lxc/${vmid}/firewall/options`,
											params,
											{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
											{ PVEAuthCookie: pveAuth.GetAuthCookie() }
										);
									},
								},

								Refs: {
									Get: async function (params) {
										await pveAuth.GenerateTicket();
										return await pve_utils.PveCurl.Get(
											`${pveAuthInfo.endpoint}/nodes/${node}/lxc/${vmid}/firewall/refs`,
											params,
											{},
											{ PVEAuthCookie: pveAuth.GetAuthCookie() }
										);
									},
								},
							},

							SnapShot: {
								Get: async function () {
									await pveAuth.GenerateTicket();
									return await pve_utils.PveCurl.Get(
										`${pveAuthInfo.endpoint}/nodes/${node}/lxc/${vmid}/snapshot`,
										{},
										{},
										{ PVEAuthCookie: pveAuth.GetAuthCookie() }
									);
								},

								Post: async function (params) {
									await pveAuth.GenerateTicket();
									return await pve_utils.PveCurl.Post(
										`${pveAuthInfo.endpoint}/nodes/${node}/lxc/${vmid}/snapshot`,
										params,
										{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
										{ PVEAuthCookie: pveAuth.GetAuthCookie() }
									);
								},

								SnapName: function (snapname) {
									return {
										Get: async function () {
											await pveAuth.GenerateTicket();
											return await pve_utils.PveCurl.Get(
												`${pveAuthInfo.endpoint}/nodes/${node}/lxc/${vmid}/snapshot/${snapname}`,
												{},
												{},
												{ PVEAuthCookie: pveAuth.GetAuthCookie() }
											);
										},

										Delete: async function (params) {
											await pveAuth.GenerateTicket();
											return await pve_utils.PveCurl.Delete(
												`${pveAuthInfo.endpoint}/nodes/${node}/lxc/${vmid}/snapshot/${snapname}`,
												params,
												{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
												{ PVEAuthCookie: pveAuth.GetAuthCookie() }
											);
										},

										Config: {
											Get: async function () {
												await pveAuth.GenerateTicket();
												return await pve_utils.PveCurl.Get(
													`${pveAuthInfo.endpoint}/nodes/${node}/lxc/${vmid}/snapshot/${snapname}/config`,
													{},
													{},
													{ PVEAuthCookie: pveAuth.GetAuthCookie() }
												);
											},

											Put: async function (params) {
												await pveAuth.GenerateTicket();
												return await pve_utils.PveCurl.Put(
													`${pveAuthInfo.endpoint}/nodes/${node}/lxc/${vmid}/snapshot/${snapname}/config`,
													params,
													{
														CSRFPreventionToken: pveAuth.GetCsrfPreventionToken(),
													},
													{ PVEAuthCookie: pveAuth.GetAuthCookie() }
												);
											},
										},

										Rollback: {
											Post: async function (params) {
												await pveAuth.GenerateTicket();
												return await pve_utils.PveCurl.Post(
													`${pveAuthInfo.endpoint}/nodes/${node}/lxc/${vmid}/snapshot/${snapname}/rollback`,
													{},
													{
														CSRFPreventionToken: pveAuth.GetCsrfPreventionToken(),
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
									await pveAuth.GenerateTicket();
									return await pve_utils.PveCurl.Get(
										`${pveAuthInfo.endpoint}/nodes/${node}/lxc/${vmid}/status`,
										{},
										{},
										{ PVEAuthCookie: pveAuth.GetAuthCookie() }
									);
								},

								Current: {
									Get: async function () {
										await pveAuth.GenerateTicket();
										return await pve_utils.PveCurl.Get(
											`${pveAuthInfo.endpoint}/nodes/${node}/lxc/${vmid}/status/current`,
											{},
											{},
											{ PVEAuthCookie: pveAuth.GetAuthCookie() }
										);
									},
								},

								Reboot: {
									Post: async function (params) {
										await pveAuth.GenerateTicket();
										return await pve_utils.PveCurl.Post(
											`${pveAuthInfo.endpoint}/nodes/${node}/lxc/${vmid}/status/reboot`,
											params,
											{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
											{ PVEAuthCookie: pveAuth.GetAuthCookie() }
										);
									},
								},

								Resume: {
									Post: async function () {
										await pveAuth.GenerateTicket();
										return await pve_utils.PveCurl.Post(
											`${pveAuthInfo.endpoint}/nodes/${node}/lxc/${vmid}/status/resume`,
											{},
											{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
											{ PVEAuthCookie: pveAuth.GetAuthCookie() }
										);
									},
								},

								Shutdown: {
									Post: async function (params) {
										await pveAuth.GenerateTicket();
										return await pve_utils.PveCurl.Post(
											`${pveAuthInfo.endpoint}/nodes/${node}/lxc/${vmid}/status/shutdown`,
											params,
											{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
											{ PVEAuthCookie: pveAuth.GetAuthCookie() }
										);
									},
								},

								Start: {
									Post: async function (params) {
										await pveAuth.GenerateTicket();
										return await pve_utils.PveCurl.Post(
											`${pveAuthInfo.endpoint}/nodes/${node}/lxc/${vmid}/status/start`,
											params,
											{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
											{ PVEAuthCookie: pveAuth.GetAuthCookie() }
										);
									},
								},

								Stop: {
									Post: async function (params) {
										await pveAuth.GenerateTicket();
										return await pve_utils.PveCurl.Post(
											`${pveAuthInfo.endpoint}/nodes/${node}/lxc/${vmid}/status/stop`,
											params,
											{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
											{ PVEAuthCookie: pveAuth.GetAuthCookie() }
										);
									},
								},

								Suspend: {
									Post: async function () {
										await pveAuth.GenerateTicket();
										return await pve_utils.PveCurl.Post(
											`${pveAuthInfo.endpoint}/nodes/${node}/lxc/${vmid}/status/suspend`,
											{},
											{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
											{ PVEAuthCookie: pveAuth.GetAuthCookie() }
										);
									},
								},
							},

							Clone: {
								Post: async function (params) {
									await pveAuth.GenerateTicket();
									return await pve_utils.PveCurl.Post(
										`${pveAuthInfo.endpoint}/nodes/${node}/lxc/${vmid}/clone`,
										params,
										{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
										{ PVEAuthCookie: pveAuth.GetAuthCookie() }
									);
								},
							},

							Config: {
								Get: async function (params) {
									await pveAuth.GenerateTicket();
									return await pve_utils.PveCurl.Get(
										`${pveAuthInfo.endpoint}/nodes/${node}/lxc/${vmid}/config`,
										params,
										{},
										{ PVEAuthCookie: pveAuth.GetAuthCookie() }
									);
								},

								Put: async function (params) {
									await pveAuth.GenerateTicket();
									return await pve_utils.PveCurl.Put(
										`${pveAuthInfo.endpoint}/nodes/${node}/lxc/${vmid}/config`,
										params,
										{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
										{ PVEAuthCookie: pveAuth.GetAuthCookie() }
									);
								},
							},

							Feature: {
								Get: async function (params) {
									await pveAuth.GenerateTicket();
									return await pve_utils.PveCurl.Get(
										`${pveAuthInfo.endpoint}/nodes/${node}/lxc/${vmid}/feature`,
										params,
										{},
										{ PVEAuthCookie: pveAuth.GetAuthCookie() }
									);
								},
							},

							Migrate: {
								Post: async function (params) {
									await pveAuth.GenerateTicket();
									return await pve_utils.PveCurl.Post(
										`${pveAuthInfo.endpoint}/nodes/${node}/lxc/${vmid}/migrate`,
										params,
										{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
										{ PVEAuthCookie: pveAuth.GetAuthCookie() }
									);
								},
							},

							MoveVolume: {
								Post: function (params) {
									await pveAuth.GenerateTicket();
									return await pve_utils.PveCurl.Post(
										`${pveAuthInfo.endpoint}/nodes/${node}/lxc/${vmid}/move_volume`,
										params,
										{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
										{ PVEAuthCookie: pveAuth.GetAuthCookie() }
									);
								},
							},

							Pending: {
								Get: async function () {
									await pveAuth.GenerateTicket();
									return await pve_utils.PveCurl.Get(
										`${pveAuthInfo.endpoint}/nodes/${node}/lxc/${vmid}/pending`,
										{},
										{},
										{ PVEAuthCookie: pveAuth.GetAuthCookie() }
									);
								},
							},

							Resize: {
								Put: async function (params) {
									await pveAuth.GenerateTicket();
									return await pve_utils.PveCurl.Put(
										`${pveAuthInfo.endpoint}/nodes/${node}/lxc/${vmid}/resize`,
										params,
										{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
										{ PVEAuthCookie: pveAuth.GetAuthCookie() }
									);
								},
							},

							Rrd: {
								Get: async function (params) {
									await pveAuth.GenerateTicket();
									return await pve_utils.PveCurl.Get(
										`${pveAuthInfo.endpoint}/nodes/${node}/lxc/${vmid}/rrd`,
										params,
										{},
										{ PVEAuthCookie: pveAuth.GetAuthCookie() }
									);
								},
							},

							RrdData: {
								Get: async function (params) {
									await pveAuth.GenerateTicket();
									return await pve_utils.PveCurl.Get(
										`${pveAuthInfo.endpoint}/nodes/${node}/lxc/${vmid}/rrd`,
										params,
										{},
										{ PVEAuthCookie: pveAuth.GetAuthCookie() }
									);
								},
							},

							SpiceProxy: {
								Post: async function (params) {
									await pveAuth.GenerateTicket();
									return await pve_utils.PveCurl.Post(
										`${pveAuthInfo.endpoint}/nodes/${node}/lxc/${vmid}/spiceproxy`,
										params,
										{ CSRFPreventionToken: pveAuthInfo.apiTicket.ticket },
										{ PVEAuthCookie: pveAuth.GetAuthCookie() }
									);
								},
							},

							Template: {
								Post: async function () {
									await pveAuth.GenerateTicket();
									return await pve_utils.PveCurl.Post(
										`${pveAuthInfo.endpoint}/nodes/${node}/lxc/${vmid}/template`,
										{},
										{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
										{ PVEAuthCookie: pveAuth.GetAuthCookie() }
									);
								},
							},

							TermProxy: {
								Post: async function () {
									await pveAuth.GenerateTicket();
									return await pve_utils.PveCurl.Post(
										`${pveAuthInfo.endpoint}/nodes/${node}/lxc/${vmid}/termproxy`,
										{},
										{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
										{ PVEAuthCookie: pveAuth.GetAuthCookie() }
									);
								},
							},

							VncProxy: {
								Post: async function (params) {
									await pveAuth.GenerateTicket();
									return await pve_utils.PveCurl.Post(
										`${pveAuthInfo.endpoint}/nodes/${node}/lxc/${vmid}/vncproxy`,
										params,
										{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
										{ PVEAuthCookie: pveAuth.GetAuthCookie() }
									);
								},
							},

							VncWebSocket: {
								Get: async function (params) {
									await pveAuth.GenerateTicket();
									return await pve_utils.PveCurl.Get(
										`${pveAuthInfo.endpoint}/nodes/${node}/lxc/${vmid}/vncwebsocket`,
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
						await pveAuth.GenerateTicket();
						return await pve_utils.PveCurl.Get(
							`${pveAuthInfo.endpoint}/nodes/${node}/network`,
							params,
							{},
							{ PVEAuthCookie: pveAuth.GetAuthCookie() }
						);
					},

					Post: async function (params) {
						await pveAuth.GenerateTicket();
						return await pve_utils.PveCurl.Post(
							`${pveAuthInfo.endpoint}/nodes/${node}/network`,
							params,
							{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
							{ PVEAuthCookie: pveAuth.GetAuthCookie() }
						);
					},

					Put: async function () {
						await pveAuth.GenerateTicket();
						return await pve_utils.PveCurl.Put(
							`${pveAuthInfo.endpoint}/nodes/${node}/network`,
							{},
							{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
							{ PVEAuthCookie: pveAuth.GetAuthCookie() }
						);
					},

					Delete: async function () {
						await pveAuth.GenerateTicket();
						return await pve_utils.PveCurl.Delete(
							`${pveAuthInfo.endpoint}/nodes/${node}/network`,
							{},
							{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
							{ PVEAuthCookie: pveAuth.GetAuthCookie() }
						);
					},

					IFace: function (iface) {
						return {
							Get: async function () {
								await pveAuth.GenerateTicket();
								return await pve_utils.PveCurl.Get(
									`${pveAuthInfo.endpoint}/nodes/${node}/network/${iface}`,
									{},
									{},
									{ PVEAuthCookie: pveAuth.GetAuthCookie() }
								);
							},

							Put: async function (params) {
								await pveAuth.GenerateTicket();
								return await pve_utils.PveCurl.Put(
									`${pveAuthInfo.endpoint}/nodes/${node}/network/${iface}`,
									{},
									{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
									{ PVEAuthCookie: pveAuth.GetAuthCookie() }
								);
							},

							Delete: async function () {
								await pveAuth.GenerateTicket();
								return await pve_utils.PveCurl.Put(
									`${pveAuthInfo.endpoint}/nodes/${node}/network/${iface}`,
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
						await pveAuth.GenerateTicket();
						return await pve_utils.PveCurl.Get(
							`${pveAuthInfo.endpoint}/nodes/${node}/qemu`,
							params,
							{},
							{ PVEAuthCookie: pveAuth.GetAuthCookie() }
						);
					},

					Post: async function (params) {
						await pveAuth.GenerateTicket();
						return await pve_utils.PveCurl.Post(
							`${pveAuthInfo.endpoint}/nodes/${node}/qemu`,
							params,
							{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
							{ PVEAuthCookie: pveAuth.GetAuthCookie() }
						);
					},

					Vmid: function (vmid) {
						return {
							Get: async function () {
								await pveAuth.GenerateTicket();
								return await pve_utils.PveCurl.Get(
									`${pveAuthInfo.endpoint}/nodes/${node}/qemu/${vmid}`,
									{},
									{},
									{ PVEAuthCookie: pveAuth.GetAuthCookie() }
								);
							},

							Delete: async function (params) {
								await pveAuth.GenerateTicket();
								return await pve_utils.PveCurl.Delete(
									`${pveAuthInfo.endpoint}/nodes/${node}/qemu/${vmid}`,
									params,
									{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
									{ PVEAuthCookie: pveAuth.GetAuthCookie() }
								);
							},

							Agent: {
								Get: async function () {
									await pveAuth.GenerateTicket();
									return await pve_utils.PveCurl.Get(
										`${pveAuthInfo.endpoint}/nodes/${node}/qemu/${vmid}/agent`,
										{},
										{},
										{ PVEAuthCookie: pveAuth.GetAuthCookie() }
									);
								},

								Post: async function (params) {
									await pveAuth.GenerateTicket();
									return await pve_utils.PveCurl.Post(
										`${pveAuthInfo.endpoint}/nodes/${node}/qemu/${vmid}/agent`,
										params,
										{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
										{ PVEAuthCookie: pveAuth.GetAuthCookie() }
									);
								},

								Exec: {
									Post: async function (params) {
										await pveAuth.GenerateTicket();
										return await pve_utils.PveCurl.Post(
											`${pveAuthInfo.endpoint}/nodes/${node}/qemu/${vmid}/agent/exec`,
											params,
											{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
											{ PVEAuthCookie: pveAuth.GetAuthCookie() }
										);
									},
								},

								ExecStatus: {
									Get: async function (params) {
										await pveAuth.GenerateTicket();
										return await pve_utils.PveCurl.Get(
											`${pveAuthInfo.endpoint}/nodes/${node}/qemu/${vmid}/agent/exec-status`,
											params,
											{},
											{ PVEAuthCookie: pveAuth.GetAuthCookie() }
										);
									},
								},

								FileRead: {
									Get: async function (params) {
										await pveAuth.GenerateTicket();
										return await pve_utils.PveCurl.Get(
											`${pveAuthInfo.endpoint}/nodes/${node}/qemu/${vmid}/agent/file-read`,
											params,
											{},
											{ PVEAuthCookie: pveAuth.GetAuthCookie() }
										);
									},
								},

								FileWrite: {
									Post: async function (params) {
										await pveAuth.GenerateTicket();
										return await pve_utils.PveCurl.Post(
											`${pveAuthInfo.endpoint}/nodes/${node}/qemu/${vmid}/agent/file-write`,
											params,
											{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
											{ PVEAuthCookie: pveAuth.GetAuthCookie() }
										);
									},
								},

								FsFreezeFreeze: {
									Post: async function () {
										await pveAuth.GenerateTicket();
										return await pve_utils.PveCurl.Post(
											`${pveAuthInfo.endpoint}/nodes/${node}/qemu/${vmid}/agent/fsfreeze-freeze`,
											{},
											{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
											{ PVEAuthCookie: pveAuth.GetAuthCookie() }
										);
									},
								},

								FsFreezeStatus: {
									Post: async function () {
										await pveAuth.GenerateTicket();
										return await pve_utils.PveCurl.Post(
											`${pveAuthInfo.endpoint}/nodes/${node}/qemu/${vmid}/agent/fsfreeze-status`,
											{},
											{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
											{ PVEAuthCookie: pveAuth.GetAuthCookie() }
										);
									},
								},

								FsFreezeThaw: {
									Post: async function () {
										await pveAuth.GenerateTicket();
										return await pve_utils.PveCurl.Post(
											`${pveAuthInfo.endpoint}/nodes/${node}/qemu/${vmid}/agent/fsfreeze-thaw`,
											{},
											{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
											{ PVEAuthCookie: pveAuth.GetAuthCookie() }
										);
									},
								},

								FsTrim: {
									Post: async function (params) {
										await pveAuth.GenerateTicket();
										return await pve_utils.PveCurl.Post(
											`${pveAuthInfo.endpoint}/nodes/${node}/qemu/${vmid}/agent/fstrim`,
											params,
											{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
											{ PVEAuthCookie: pveAuth.GetAuthCookie() }
										);
									},
								},

								GetFsInfo: {
									Get: async function () {
										await pveAuth.GenerateTicket();
										return await pve_utils.PveCurl.Get(
											`${pveAuthInfo.endpoint}/nodes/${node}/qemu/${vmid}/agent/get-fsinfo`,
											{},
											{},
											{ PVEAuthCookie: pveAuth.GetAuthCookie() }
										);
									},
								},

								GetHostName: {
									Get: async function () {
										await pveAuth.GenerateTicket();
										return await pve_utils.PveCurl.Get(
											`${pveAuthInfo.endpoint}/nodes/${node}/qemu/${vmid}/agent/get-host-name`,
											{},
											{},
											{ PVEAuthCookie: pveAuth.GetAuthCookie() }
										);
									},
								},

								GetMemoryBlockInfo: {
									Get: async function () {
										await pveAuth.GenerateTicket();
										return await pve_utils.PveCurl.Get(
											`${pveAuthInfo.endpoint}/nodes/${node}/qemu/${vmid}/agent/get-memory-block-info`,
											{},
											{},
											{ PVEAuthCookie: pveAuth.GetAuthCookie() }
										);
									},
								},

								GetMemoryBlocks: {
									Get: async function () {
										await pveAuth.GenerateTicket();
										return await pve_utils.PveCurl.Get(
											`${pveAuthInfo.endpoint}/nodes/${node}/qemu/${vmid}/agent/get-memory-blocks`,
											{},
											{},
											{ PVEAuthCookie: pveAuth.GetAuthCookie() }
										);
									},
								},

								GetOsInfo: {
									Get: async function () {
										await pveAuth.GenerateTicket();
										return await pve_utils.PveCurl.Get(
											`${pveAuthInfo.endpoint}/nodes/${node}/qemu/${vmid}/agent/get-osinfo`,
											{},
											{},
											{ PVEAuthCookie: pveAuth.GetAuthCookie() }
										);
									},
								},

								GetTime: {
									Get: async function () {
										await pveAuth.GenerateTicket();
										return await pve_utils.PveCurl.Get(
											`${pveAuthInfo.endpoint}/nodes/${node}/qemu/${vmid}/agent/get-time`,
											{},
											{},
											{ PVEAuthCookie: pveAuth.GetAuthCookie() }
										);
									},
								},

								GetTimezone: {
									Get: async function () {
										await pveAuth.GenerateTicket();
										return await pve_utils.PveCurl.Get(
											`${pveAuthInfo.endpoint}/nodes/${node}/qemu/${vmid}/agent/get-timezone`,
											{},
											{},
											{ PVEAuthCookie: pveAuth.GetAuthCookie() }
										);
									},
								},

								GetUsers: {
									Get: async function () {
										await pveAuth.GenerateTicket();
										return await pve_utils.PveCurl.Get(
											`${pveAuthInfo.endpoint}/nodes/${node}/qemu/${vmid}/agent/get-users`,
											{},
											{},
											{ PVEAuthCookie: pveAuth.GetAuthCookie() }
										);
									},
								},

								GetVCpus: {
									Get: async function () {
										await pveAuth.GenerateTicket();
										return await pve_utils.PveCurl.Get(
											`${pveAuthInfo.endpoint}/nodes/${node}/qemu/${vmid}/agent/get-vcpus`,
											{},
											{},
											{ PVEAuthCookie: pveAuth.GetAuthCookie() }
										);
									},
								},

								Info: {
									Get: async function () {
										await pveAuth.GenerateTicket();
										return await pve_utils.PveCurl.Get(
											`${pveAuthInfo.endpoint}/nodes/${node}/qemu/${vmid}/agent/info`,
											{},
											{},
											{ PVEAuthCookie: pveAuth.GetAuthCookie() }
										);
									},
								},

								NetworkGetInterfaces: {
									Get: async function () {
										await pveAuth.GenerateTicket();
										return await pve_utils.PveCurl.Get(
											`${pveAuthInfo.endpoint}/nodes/${node}/qemu/${vmid}/agent/network-get-interfaces`,
											{},
											{},
											{ PVEAuthCookie: pveAuth.GetAuthCookie() }
										);
									},
								},

								Ping: {
									Post: async function () {
										await pveAuth.GenerateTicket();
										return await pve_utils.PveCurl.Post(
											`${pveAuthInfo.endpoint}/nodes/${node}/qemu/${vmid}/agent/ping`,
											{},
											{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
											{ PVEAuthCookie: pveAuth.GetAuthCookie() }
										);
									},
								},

								SetUserPassword: {
									Post: async function (params) {
										await pveAuth.GenerateTicket();
										return await pve_utils.PveCurl.Post(
											`${pveAuthInfo.endpoint}/nodes/${node}/qemu/${vmid}/agent/set-user-password`,
											params,
											{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
											{ PVEAuthCookie: pveAuth.GetAuthCookie() }
										);
									},
								},

								Shutdown: {
									Post: async function () {
										await pveAuth.GenerateTicket();
										return await pve_utils.PveCurl.Post(
											`${pveAuthInfo.endpoint}/nodes/${node}/qemu/${vmid}/agent/shutdown`,
											{},
											{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
											{ PVEAuthCookie: pveAuth.GetAuthCookie() }
										);
									},
								},

								SuspendDisk: {
									Post: async function () {
										await pveAuth.GenerateTicket();
										return await pve_utils.PveCurl.Post(
											`${pveAuthInfo.endpoint}/nodes/${node}/qemu/${vmid}/agent/suspend-disk`,
											{},
											{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
											{ PVEAuthCookie: pveAuth.GetAuthCookie() }
										);
									},
								},

								SuspendHybrid: {
									Post: async function () {
										await pveAuth.GenerateTicket();
										return await pve_utils.PveCurl.Post(
											`${pveAuthInfo.endpoint}/nodes/${node}/qemu/${vmid}/agent/suspend-hybrid`,
											{},
											{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
											{ PVEAuthCookie: pveAuth.GetAuthCookie() }
										);
									},
								},

								SuspendRam: {
									Post: async function () {
										await pveAuth.GenerateTicket();
										return await pve_utils.PveCurl.Post(
											`${pveAuthInfo.endpoint}/nodes/${node}/qemu/${vmid}/agent/suspend-ram`,
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
										await pveAuth.GenerateTicket();
										return await pve_utils.PveCurl.Get(
											`${pveAuthInfo.endpoint}/nodes/${node}/qemu/${vmid}/cloudinit/dump`,
											params,
											{},
											{ PVEAuthCookie: pveAuth.GetAuthCookie() }
										);
									},
								},
							},

							Firewall: {
								Get: async function () {
									await pveAuth.GenerateTicket();
									return await pve_utils.PveCurl.Get(
										`${pveAuthInfo.endpoint}/nodes/${node}/qemu/${vmid}/firewall`,
										{},
										{},
										{ PVEAuthCookie: pveAuth.GetAuthCookie() }
									);
								},

								Aliases: {
									Get: async function () {
										await pveAuth.GenerateTicket();
										return await pve_utils.PveCurl.Get(
											`${pveAuthInfo.endpoint}/nodes/${node}/qemu/${vmid}/firewall/aliases`,
											{},
											{},
											{ PVEAuthCookie: pveAuth.GetAuthCookie() }
										);
									},

									Post: async function (params) {
										await pveAuth.GenerateTicket();
										return await pve_utils.PveCurl.Post(
											`${pveAuthInfo.endpoint}/nodes/${node}/qemu/${vmid}/firewall/aliases`,
											params,
											{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
											{ PVEAuthCookie: pveAuthInfo.apiTicket.csrfPreventionToken }
										);
									},

									Name: function (name) {
										return {
											Get: async function () {
												await pveAuth.GenerateTicket();
												return await pve_utils.PveCurl.Get(
													`${pveAuthInfo.endpoint}/nodes/${node}/qemu/${vmid}/firewall/aliases/${name}`,
													{},
													{},
													{ PVEAuthCookie: pveAuth.GetAuthCookie() }
												);
											},

											Put: async function (params) {
												await pveAuth.GenerateTicket();
												return await pve_utils.PveCurl.Put(
													`${pveAuthInfo.endpoint}/nodes/${node}/qemu/${vmid}/firewall/aliases/${name}`,
													params,
													{
														CSRFPreventionToken: pveAuth.GetCsrfPreventionToken(),
													},
													{ PVEAuthCookie: pveAuth.GetAuthCookie() }
												);
											},

											Delete: async function (params) {
												await pveAuth.GenerateTicket();
												return await pve_utils.PveCurl.Delete(
													`${pveAuthInfo.endpoint}/nodes/${node}/qemu/${vmid}/firewall/aliases/${name}`,
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

								IpSet: {
									Get: async function () {
										await pveAuth.GenerateTicket();
										return await pve_utils.PveCurl.Get(
											`${pveAuthInfo.endpoint}/nodes/${node}/qemu/${vmid}/firewall/ipset`,
											{},
											{},
											{ PVEAuthCookie: pveAuth.GetAuthCookie() }
										);
									},

									Post: async function (params) {
										await pveAuth.GenerateTicket();
										return await pve_utils.PveCurl.Post(
											`${pveAuthInfo.endpoint}/nodes/${node}/qemu/${vmid}/firewall/ipset`,
											params,
											{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
											{ PVEAuthCookie: pveAuth.GetAuthCookie() }
										);
									},

									Name: function (name) {
										return {
											Get: async function () {
												await pveAuth.GenerateTicket();
												return await pve_utils.PveCurl.Get(
													`${pveAuthInfo.endpoint}/nodes/${node}/qemu/${vmid}/firewall/ipset/name`,
													{},
													{},
													{ PVEAuthCookie: pveAuth.GetAuthCookie() }
												);
											},

											Post: async function (params) {
												await pveAuth.GenerateTicket();
												return await pve_utils.PveCurl.Post(
													`${pveAuthInfo.endpoint}/nodes/${node}/qemu/${vmid}/firewall/ipset/name`,
													params,
													{
														CSRFPreventionToken: pveAuth.GetCsrfPreventionToken(),
													},
													{ PVEAuthCookie: pveAuth.GetAuthCookie() }
												);
											},

											Delete: async function () {
												await pveAuth.GenerateTicket();
												return await pve_utils.PveCurl.Delete(
													`${pveAuthInfo.endpoint}/nodes/${node}/qemu/${vmid}/firewall/ipset/name`,
													{},
													{
														CSRFPreventionToken: pveAuth.GetCsrfPreventionToken(),
													},
													{ PVEAuthCookie: pveAuth.GetAuthCookie() }
												);
											},

											Cidr: function (cidr) {
												return {
													Get: async function () {
														await pveAuth.GenerateTicket();
														return await pve_utils.PveCurl.Get(
															`${pveAuthInfo.endpoint}/nodes/${node}/qemu/${vmid}/firewall/ipset/name/${cidr}`,
															{},
															{},
															{ PVEAuthCookie: pveAuth.GetAuthCookie() }
														);
													},

													Put: async function (params) {
														await pveAuth.GenerateTicket();
														return await pve_utils.PveCurl.Put(
															`${pveAuthInfo.endpoint}/nodes/${node}/qemu/${vmid}/firewall/ipset/name/${cidr}`,
															params,
															{
																CSRFPreventionToken:
																	pveAuthInfo.apiTicket.csrfPreventionToken,
															},
															{ PVEAuthCookie: pveAuth.GetAuthCookie() }
														);
													},

													Delete: async function (params) {
														await pveAuth.GenerateTicket();
														return await pve_utils.PveCurl.Delete(
															`${pveAuthInfo.endpoint}/nodes/${node}/qemu/${vmid}/firewall/ipset/name/${cidr}`,
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
										await pveAuth.GenerateTicket();
										return await pve_utils.PveCurl.Get(
											`${pveAuthInfo.endpoint}/nodes/${node}/qemu/${vmid}/firewall/rules`,
											{},
											{},
											{ PVEAuthCookie: pveAuth.GetAuthCookie() }
										);
									},

									Post: async function (params) {
										await pveAuth.GenerateTicket();
										return await pve_utils.PveCurl.Post(
											`${pveAuthInfo.endpoint}/nodes/${node}/qemu/${vmid}/firewall/rules`,
											params,
											{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
											{ PVEAuthCookie: pveAuth.GetAuthCookie() }
										);
									},

									Pos: function (pos) {
										return {
											Get: async function () {
												await pveAuth.GenerateTicket();
												return await pve_utils.PveCurl.Get(
													`${pveAuthInfo.endpoint}/nodes/${node}/qemu/${vmid}/firewall/rules/${pos}`,
													{},
													{},
													{ PVEAuthCookie: pveAuth.GetAuthCookie() }
												);
											},

											Put: async function (params) {
												await pveAuth.GenerateTicket();
												return await pve_utils.PveCurl.Put(
													`${pveAuthInfo.endpoint}/nodes/${node}/qemu/${vmid}/firewall/rules/${pos}`,
													params,
													{
														CSRFPreventionToken: pveAuth.GetCsrfPreventionToken(),
													},
													{ PVEAuthCookie: pveAuth.GetAuthCookie() }
												);
											},

											Delete: async function (params) {
												await pveAuth.GenerateTicket();
												return await pve_utils.PveCurl.Delete(
													`${pveAuthInfo.endpoint}/nodes/${node}/qemu/${vmid}/firewall/rules/${pos}`,
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

								Log: {
									Get: async function (params) {
										await pveAuth.GenerateTicket();
										return await pve_utils.PveCurl.Get(
											`${pveAuthInfo.endpoint}/nodes/${node}/qemu/${vmid}/firewall/log`,
											params,
											{},
											{ PVEAuthCookie: pveAuth.GetAuthCookie() }
										);
									},
								},

								Options: {
									Get: async function () {
										await pveAuth.GenerateTicket();
										return await pve_utils.PveCurl.Get(
											`${pveAuthInfo.endpoint}/nodes/${node}/qemu/${vmid}/firewall/options`,
											{},
											{},
											{ PVEAuthCookie: pveAuth.GetAuthCookie() }
										);
									},

									Put: async function (params) {
										await pveAuth.GenerateTicket();
										return await pve_utils.PveCurl.Get(
											`${pveAuthInfo.endpoint}/nodes/${node}/qemu/${vmid}/firewall/options`,
											params,
											{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
											{ PVEAuthCookie: pveAuth.GetAuthCookie() }
										);
									},
								},

								Refs: {
									Get: async function (params) {
										await pveAuth.GenerateTicket();
										return await pve_utils.PveCurl.Get(
											`${pveAuthInfo.endpoint}/nodes/${node}/qemu/${vmid}/firewall/refs`,
											params,
											{},
											{ PVEAuthCookie: pveAuth.GetAuthCookie() }
										);
									},
								},
							},

							SnapShot: {
								Get: async function () {
									await pveAuth.GenerateTicket();
									return await pve_utils.PveCurl.Get(
										`${pveAuthInfo.endpoint}/nodes/${node}/qemu/${vmid}/snapshot`,
										{},
										{},
										{ PVEAuthCookie: pveAuth.GetAuthCookie() }
									);
								},

								Post: async function (params) {
									await pveAuth.GenerateTicket();
									return await pve_utils.PveCurl.Post(
										`${pveAuthInfo.endpoint}/nodes/${node}/qemu/${vmid}/snapshot`,
										params,
										{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
										{ PVEAuthCookie: pveAuth.GetAuthCookie() }
									);
								},

								SnapName: function (snapname) {
									return {
										Get: async function () {
											await pveAuth.GenerateTicket();
											return await pve_utils.PveCurl.Get(
												`${pveAuthInfo.endpoint}/nodes/${node}/qemu/${vmid}/snapshot/${snapname}`,
												{},
												{},
												{ PVEAuthCookie: pveAuth.GetAuthCookie() }
											);
										},

										Delete: async function (params) {
											await pveAuth.GenerateTicket();
											return await pve_utils.PveCurl.Delete(
												`${pveAuthInfo.endpoint}/nodes/${node}/qemu/${vmid}/snapshot/${snapname}`,
												params,
												{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
												{ PVEAuthCookie: pveAuth.GetAuthCookie() }
											);
										},

										Config: {
											Get: async function () {
												await pveAuth.GenerateTicket();
												return await pve_utils.PveCurl.Get(
													`${pveAuthInfo.endpoint}/nodes/${node}/qemu/${vmid}/snapshot/${snapname}/config`,
													{},
													{},
													{ PVEAuthCookie: pveAuth.GetAuthCookie() }
												);
											},

											Put: async function (params) {
												await pveAuth.GenerateTicket();
												return await pve_utils.PveCurl.Put(
													`${pveAuthInfo.endpoint}/nodes/${node}/qemu/${vmid}/snapshot/${snapname}/config`,
													params,
													{
														CSRFPreventionToken: pveAuth.GetCsrfPreventionToken(),
													},
													{ PVEAuthCookie: pveAuth.GetAuthCookie() }
												);
											},
										},

										Rollback: {
											Post: async function (params) {
												await pveAuth.GenerateTicket();
												return await pve_utils.PveCurl.Post(
													`${pveAuthInfo.endpoint}/nodes/${node}/qemu/${vmid}/snapshot/${snapname}/rollback`,
													{},
													{
														CSRFPreventionToken: pveAuth.GetCsrfPreventionToken(),
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
									await pveAuth.GenerateTicket();
									return await pve_utils.PveCurl.Get(
										`${pveAuthInfo.endpoint}/nodes/${node}/qemu/${vmid}/status`,
										{},
										{},
										{ PVEAuthCookie: pveAuth.GetAuthCookie() }
									);
								},

								Current: {
									Get: async function () {
										await pveAuth.GenerateTicket();
										return await pve_utils.PveCurl.Get(
											`${pveAuthInfo.endpoint}/nodes/${node}/qemu/${vmid}/status/current`,
											{},
											{},
											{ PVEAuthCookie: pveAuth.GetAuthCookie() }
										);
									},
								},

								Reboot: {
									Post: async function (params) {
										await pveAuth.GenerateTicket();
										return await pve_utils.PveCurl.Post(
											`${pveAuthInfo.endpoint}/nodes/${node}/qemu/${vmid}/status/reboot`,
											params,
											{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
											{ PVEAuthCookie: pveAuth.GetAuthCookie() }
										);
									},
								},

								Reset: {
									Post: async function (params) {
										await pveAuth.GenerateTicket();
										return await pve_utils.PveCurl.Post(
											`${pveAuthInfo.endpoint}/nodes/${node}/qemu/${vmid}/status/reset`,
											params,
											{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
											{ PVEAuthCookie: pveAuth.GetAuthCookie() }
										);
									},
								},

								Resume: {
									Post: async function () {
										await pveAuth.GenerateTicket();
										return await pve_utils.PveCurl.Post(
											`${pveAuthInfo.endpoint}/nodes/${node}/qemu/${vmid}/status/resume`,
											{},
											{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
											{ PVEAuthCookie: pveAuth.GetAuthCookie() }
										);
									},
								},

								Shutdown: {
									Post: async function (params) {
										await pveAuth.GenerateTicket();
										return await pve_utils.PveCurl.Post(
											`${pveAuthInfo.endpoint}/nodes/${node}/qemu/${vmid}/status/shutdown`,
											params,
											{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
											{ PVEAuthCookie: pveAuth.GetAuthCookie() }
										);
									},
								},

								Start: {
									Post: async function (params) {
										await pveAuth.GenerateTicket();
										return await pve_utils.PveCurl.Post(
											`${pveAuthInfo.endpoint}/nodes/${node}/qemu/${vmid}/status/start`,
											params,
											{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
											{ PVEAuthCookie: pveAuth.GetAuthCookie() }
										);
									},
								},

								Stop: {
									Post: async function (params) {
										await pveAuth.GenerateTicket();
										return await pve_utils.PveCurl.Post(
											`${pveAuthInfo.endpoint}/nodes/${node}/qemu/${vmid}/status/stop`,
											params,
											{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
											{ PVEAuthCookie: pveAuth.GetAuthCookie() }
										);
									},
								},

								Suspend: {
									Post: async function () {
										await pveAuth.GenerateTicket();
										return await pve_utils.PveCurl.Post(
											`${pveAuthInfo.endpoint}/nodes/${node}/qemu/${vmid}/status/suspend`,
											{},
											{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
											{ PVEAuthCookie: pveAuth.GetAuthCookie() }
										);
									},
								},
							},

							Clone: {
								Post: async function (params) {
									await pveAuth.GenerateTicket();
									return await pve_utils.PveCurl.Post(
										`${pveAuthInfo.endpoint}/nodes/${node}/qemu/${vmid}/clone`,
										params,
										{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
										{ PVEAuthCookie: pveAuth.GetAuthCookie() }
									);
								},
							},

							Config: {
								Get: async function (params) {
									await pveAuth.GenerateTicket();
									return await pve_utils.PveCurl.Get(
										`${pveAuthInfo.endpoint}/nodes/${node}/qemu/${vmid}/config`,
										params,
										{},
										{ PVEAuthCookie: pveAuth.GetAuthCookie() }
									);
								},

								Post: async function (params) {
									await pveAuth.GenerateTicket();
									return await pve_utils.PveCurl.Post(
										`${pveAuthInfo.endpoint}/nodes/${node}/qemu/${vmid}/config`,
										params,
										{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
										{ PVEAuthCookie: pveAuth.GetAuthCookie() }
									);
								},

								Put: async function (params) {
									await pveAuth.GenerateTicket();
									return await pve_utils.PveCurl.Put(
										`${pveAuthInfo.endpoint}/nodes/${node}/qemu/${vmid}/config`,
										params,
										{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
										{ PVEAuthCookie: pveAuth.GetAuthCookie() }
									);
								},
							},

							Feature: {
								Get: async function (params) {
									await pveAuth.GenerateTicket();
									return await pve_utils.PveCurl.Get(
										`${pveAuthInfo.endpoint}/nodes/${node}/qemu/${vmid}/feature`,
										params,
										{},
										{ PVEAuthCookie: pveAuth.GetAuthCookie() }
									);
								},
							},

							Migrate: {
								Get: async function (params) {
									await pveAuth.GenerateTicket();
									return await pve_utils.PveCurl.Get(
										`${pveAuthInfo.endpoint}/nodes/${node}/qemu/${vmid}/migrate`,
										params,
										{},
										{ PVEAuthCookie: pveAuth.GetAuthCookie() }
									);
								},

								Post: async function (params) {
									await pveAuth.GenerateTicket();
									return await pve_utils.PveCurl.Post(
										`${pveAuthInfo.endpoint}/nodes/${node}/qemu/${vmid}/migrate`,
										params,
										{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
										{ PVEAuthCookie: pveAuth.GetAuthCookie() }
									);
								},
							},

							Monitor: {
								Post: async function (params) {
									await pveAuth.GenerateTicket();
									return await pve_utils.PveCurl.Post(
										`${pveAuthInfo.endpoint}/nodes/${node}/qemu/${vmid}/monitor`,
										params,
										{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
										{ PVEAuthCookie: pveAuth.GetAuthCookie() }
									);
								},
							},

							MoveDisk: {
								Post: function () {
									await pveAuth.GenerateTicket();
									return await pve_utils.PveCurl.Post(
										`${pveAuthInfo.endpoint}/nodes/${node}/${vmid}/move_disk`,
										{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
										{ PVEAuthCookie: pveAuth.GetAuthCookie() }
									);
								},
							},

							Pending: {
								Get: async function () {
									await pveAuth.GenerateTicket();
									return await pve_utils.PveCurl.Get(
										`${pveAuthInfo.endpoint}/nodes/${node}/qemu/${vmid}/pending`,
										{},
										{},
										{ PVEAuthCookie: pveAuth.GetAuthCookie() }
									);
								},
							},

							Resize: {
								Put: async function (params) {
									await pveAuth.GenerateTicket();
									return await pve_utils.PveCurl.Put(
										`${pveAuthInfo.endpoint}/nodes/${node}/qemu/${vmid}/resize`,
										params,
										{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
										{ PVEAuthCookie: pveAuth.GetAuthCookie() }
									);
								},
							},

							Rrd: {
								Get: async function (params) {
									await pveAuth.GenerateTicket();
									return await pve_utils.PveCurl.Get(
										`${pveAuthInfo.endpoint}/nodes/${node}/qemu/${vmid}/rrd`,
										params,
										{},
										{ PVEAuthCookie: pveAuth.GetAuthCookie() }
									);
								},
							},

							RrdData: {
								Get: async function (params) {
									await pveAuth.GenerateTicket();
									return await pve_utils.PveCurl.Get(
										`${pveAuthInfo.endpoint}/nodes/${node}/qemu/${vmid}/rrd`,
										params,
										{},
										{ PVEAuthCookie: pveAuth.GetAuthCookie() }
									);
								},
							},

							SendKey: {
								Put: async function (params) {
									await pveAuth.GenerateTicket();
									return await pve_utils.PveCurl.Put(
										`${pveAuthInfo.endpoint}/nodes/${node}/qemu/${vmid}/sendlink`,
										params,
										{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
										{ PVEAuthCookie: pveAuth.GetAuthCookie() }
									);
								},
							},

							SpiceProxy: {
								Post: async function (params) {
									await pveAuth.GenerateTicket();
									return await pve_utils.PveCurl.Post(
										`${pveAuthInfo.endpoint}/nodes/${node}/qemu/${vmid}/spiceproxy`,
										params,
										{ CSRFPreventionToken: pveAuthInfo.apiTicket.ticket },
										{ PVEAuthCookie: pveAuth.GetAuthCookie() }
									);
								},
							},

							Template: {
								Post: async function () {
									await pveAuth.GenerateTicket();
									return await pve_utils.PveCurl.Post(
										`${pveAuthInfo.endpoint}/nodes/${node}/qemu/${vmid}/template`,
										{},
										{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
										{ PVEAuthCookie: pveAuth.GetAuthCookie() }
									);
								},
							},

							TermProxy: {
								Post: async function () {
									await pveAuth.GenerateTicket();
									return await pve_utils.PveCurl.Post(
										`${pveAuthInfo.endpoint}/nodes/${node}/qemu/${vmid}/termproxy`,
										{},
										{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
										{ PVEAuthCookie: pveAuth.GetAuthCookie() }
									);
								},
							},

							Unlink: {
								Put: async function (params) {
									await pveAuth.GenerateTicket();
									return await pve_utils.PveCurl.Put(
										`${pveAuthInfo.endpoint}/nodes/${node}/qemu/${vmid}/unlink`,
										params,
										{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
										{ PVEAuthCookie: pveAuth.GetAuthCookie() }
									);
								},
							},

							VncProxy: {
								Post: async function (params) {
									await pveAuth.GenerateTicket();
									return await pve_utils.PveCurl.Post(
										`${pveAuthInfo.endpoint}/nodes/${node}/qemu/${vmid}/vncproxy`,
										params,
										{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
										{ PVEAuthCookie: pveAuth.GetAuthCookie() }
									);
								},
							},

							VncWebSocket: {
								Get: async function (params) {
									await pveAuth.GenerateTicket();
									return await pve_utils.PveCurl.Get(
										`${pveAuthInfo.endpoint}/nodes/${node}/qemu/${vmid}/vncwebsocket`,
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
						await pveAuth.GenerateTicket();
						return await pve_utils.PveCurl.Get(
							`${pveAuthInfo.endpoint}/nodes/${node}/replication`,
							params,
							{},
							{ PVEAuthCookie: pveAuth.GetAuthCookie() }
						);
					},

					Id: function (id) {
						return {
							Get: async function () {
								await pveAuth.GenerateTicket();
								return await pve_utils.PveCurl.Get(
									`${pveAuthInfo.endpoint}/nodes/${node}/replication/${id}`,
									{},
									{},
									{ PVEAuthCookie: pveAuth.GetAuthCookie() }
								);
							},

							Log: {
								Get: async function (params) {
									await pveAuth.GenerateTicket();
									return await pve_utils.PveCurl.Get(
										`${pveAuthInfo.endpoint}/nodes/${node}/replication/${id}/log`,
										params,
										{},
										{ PVEAuthCookie: pveAuth.GetAuthCookie() }
									);
								},
							},

							ScheduleNow: {
								Post: async function (params) {
									await pveAuth.GenerateTicket();
									return await pve_utils.PveCurl.Post(
										`${pveAuthInfo.endpoint}/nodes/${node}/replication/${id}/schedule_now`,
										{},
										{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
										{ PVEAuthCookie: pveAuth.GetAuthCookie() }
									);
								},
							},

							Status: {
								Get: async function () {
									await pveAuth.GenerateTicket();
									return await pve_utils.PveCurl.Get(
										`${pveAuthInfo.endpoint}/nodes/${node}/replication/${id}/status`,
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
						await pveAuth.GenerateTicket();
						return await pve_utils.PveCurl.Get(
							`${pveAuthInfo.endpoint}/nodes/${node}/scan`,
							{},
							{},
							{ PVEAuthCookie: pveAuth.GetAuthCookie() }
						);
					},

					Cifs: {
						Get: async function (params) {
							await pveAuth.GenerateTicket();
							return await pve_utils.PveCurl.Get(
								`${pveAuthInfo.endpoint}/nodes/${node}/scan/cifs`,
								params,
								{},
								{ PVEAuthCookie: pveAuth.GetAuthCookie() }
							);
						},
					},

					GlusterFS: {
						Get: async function (params) {
							await pveAuth.GenerateTicket();
							return await pve_utils.PveCurl.Get(
								`${pveAuthInfo.endpoint}/nodes/${node}/scan/glusterfs`,
								params,
								{},
								{ PVEAuthCookie: pveAuth.GetAuthCookie() }
							);
						},
					},

					Iscsi: {
						Get: async function (params) {
							await pveAuth.GenerateTicket();
							return await pve_utils.PveCurl.Get(
								`${pveAuthInfo.endpoint}/nodes/${node}/scan/iscsi`,
								params,
								{},
								{ PVEAuthCookie: pveAuth.GetAuthCookie() }
							);
						},
					},

					Lvm: {
						Get: async function () {
							await pveAuth.GenerateTicket();
							return await pve_utils.PveCurl.Get(
								`${pveAuthInfo.endpoint}/nodes/${node}/scan/lvm`,
								{},
								{},
								{ PVEAuthCookie: pveAuth.GetAuthCookie() }
							);
						},
					},

					LvmThin: {
						Get: async function (params) {
							await pveAuth.GenerateTicket();
							return await pve_utils.PveCurl.Get(
								`${pveAuthInfo.endpoint}/nodes/${node}/scan/lvmthin`,
								params,
								{},
								{ PVEAuthCookie: pveAuth.GetAuthCookie() }
							);
						},
					},

					Nfs: {
						Get: async function (params) {
							await pveAuth.GenerateTicket();
							return await pve_utils.PveCurl.Get(
								`${pveAuthInfo.endpoint}/nodes/${node}/scan/nfs`,
								params,
								{},
								{ PVEAuthCookie: pveAuth.GetAuthCookie() }
							);
						},
					},

					Pbs: {
						Get: async function (params) {
							await pveAuth.GenerateTicket();
							return await pve_utils.PveCurl.Get(
								`${pveAuthInfo.endpoint}/nodes/${node}/scan/pbs`,
								params,
								{},
								{ PVEAuthCookie: pveAuth.GetAuthCookie() }
							);
						},
					},

					Zfs: {
						Get: async function () {
							await pveAuth.GenerateTicket();
							return await pve_utils.PveCurl.Get(
								`${pveAuthInfo.endpoint}/nodes/${node}/scan/zfs`,
								{},
								{},
								{ PVEAuthCookie: pveAuth.GetAuthCookie() }
							);
						},
					},
				},

				Sdn: {
					Get: async function () {
						await pveAuth.GenerateTicket();
						return await pve_utils.PveCurl.Get(
							`${pveAuthInfo.endpoint}/nodes/${node}/sdn`,
							{},
							{},
							{ PVEAuthCookie: pveAuth.GetAuthCookie() }
						);
					},

					Zones: {
						Get: async function () {
							await pveAuth.GenerateTicket();
							return await pve_utils.PveCurl.Get(
								`${pveAuthInfo.endpoint}/nodes/${node}/sdn/zones`,
								{},
								{},
								{ PVEAuthCookie: pveAuth.GetAuthCookie() }
							);
						},

						Zone: function (zone) {
							return {
								Get: async function () {
									await pveAuth.GenerateTicket();
									return await pve_utils.PveCurl.Get(
										`${pveAuthInfo.endpoint}/nodes/${node}/sdn/zones/${zone}`,
										{},
										{},
										{ PVEAuthCookie: pveAuth.GetAuthCookie() }
									);
								},

								Content: {
									Get: async function () {
										await pveAuth.GenerateTicket();
										return await pve_utils.PveCurl.Get(
											`${pveAuthInfo.endpoint}/nodes/${node}/sdn/zones/${zone}/content`,
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
						await pveAuth.GenerateTicket();
						return await pve_utils.PveCurl.Get(
							`${pveAuthInfo.endpoint}/nodes/${node}/services`,
							{},
							{},
							{ PVEAuthCookie: pveAuth.GetAuthCookie() }
						);
					},

					Service: function (service) {
						return {
							Get: async function () {
								await pveAuth.GenerateTicket();
								return await pve_utils.PveCurl.Get(
									`${pveAuthInfo.endpoint}/nodes/${node}/services/${service}`,
									{},
									{},
									{ PVEAuthCookie: pveAuth.GetAuthCookie() }
								);
							},

							Reload: {
								Post: async function () {
									await pveAuth.GenerateTicket();
									return await pve_utils.PveCurl.Post(
										`${pveAuthInfo.endpoint}/nodes/${node}/services/${service}/reload`,
										{},
										{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
										{ PVEAuthCookie: pveAuth.GetAuthCookie() }
									);
								},
							},

							Restart: {
								Post: async function () {
									await pveAuth.GenerateTicket();
									return await pve_utils.PveCurl.Post(
										`${pveAuthInfo.endpoint}/nodes/${node}/services/${service}/restart`,
										{},
										{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
										{ PVEAuthCookie: pveAuth.GetAuthCookie() }
									);
								},
							},

							Start: {
								Post: async function () {
									await pveAuth.GenerateTicket();
									return await pve_utils.PveCurl.Post(
										`${pveAuthInfo.endpoint}/nodes/${node}/services/${service}/start`,
										{},
										{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
										{ PVEAuthCookie: pveAuth.GetAuthCookie() }
									);
								},
							},

							State: {
								Get: async function () {
									await pveAuth.GenerateTicket();
									return await pve_utils.PveCurl.Get(
										`${pveAuthInfo.endpoint}/nodes/${node}/services/${service}/state`,
										{},
										{},
										{ PVEAuthCookie: pveAuth.GetAuthCookie() }
									);
								},
							},

							Stop: {
								Post: async function () {
									await pveAuth.GenerateTicket();
									return await pve_utils.PveCurl.Post(
										`${pveAuthInfo.endpoint}/nodes/${node}/services/${service}/stop`,
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
						await pveAuth.GenerateTicket();
						return await pve_utils.PveCurl.Get(
							`${pveAuthInfo.endpoint}/nodes/${node}/storage`,
							params,
							{},
							{ PVEAuthCookie: pveAuth.GetAuthCookie() }
						);
					},

					Storage: function (storage) {
						return {
							Get: async function () {
								await pveAuth.GenerateTicket();
								return await pve_utils.PveCurl.Get(
									`${pveAuthInfo.endpoint}/nodes/${node}/storage/${storage}`,
									{},
									{},
									{ PVEAuthCookie: pveAuth.GetAuthCookie() }
								);
							},

							Content: {
								Get: async function (params) {
									await pveAuth.GenerateTicket();
									return await pve_utils.PveCurl.Get(
										`${pveAuthInfo.endpoint}/nodes/${node}/storage/${storage}/content`,
										params,
										{},
										{ PVEAuthCookie: pveAuth.GetAuthCookie() }
									);
								},

								Post: async function (params) {
									await pveAuth.GenerateTicket();
									return await pve_utils.PveCurl.Post(
										`${pveAuthInfo.endpoint}/nodes/${node}/storage/${storage}/content`,
										params,
										{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
										{ PVEAuthCookie: pveAuth.GetAuthCookie() }
									);
								},

								Volume: function (volume) {
									return {
										Get: async function () {
											await pveAuth.GenerateTicket();
											return await pve_utils.PveCurl.Get(
												`${pveAuthInfo.endpoint}/nodes/${node}/storage/${storage}/content/${volume}`,
												{},
												{},
												{ PVEAuthCookie: pveAuth.GetAuthCookie() }
											);
										},

										Post: async function (params) {
											await pveAuth.GenerateTicket();
											return await pve_utils.PveCurl.Post(
												`${pveAuthInfo.endpoint}/nodes/${node}/storage/${storage}/content/${volume}`,
												params,
												{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
												{ PVEAuthCookie: pveAuth.GetAuthCookie() }
											);
										},

										Put: async function (params) {
											await pveAuth.GenerateTicket();
											return await pve_utils.PveCurl.Put(
												`${pveAuthInfo.endpoint}/nodes/${node}/storage/${storage}/content/${volume}`,
												params,
												{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
												{ PVEAuthCookie: pveAuth.GetAuthCookie() }
											);
										},

										Delete: async function (params) {
											await pveAuth.GenerateTicket();
											return await pve_utils.PveCurl.Delete(
												`${pveAuthInfo.endpoint}/nodes/${node}/storage/${storage}/content/${volume}`,
												params,
												{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
												{ PVEAuthCookie: pveAuth.GetAuthCookie() }
											);
										},
									};
								},
							},

							FileRestore: {
								Post: async function (params) {
									await pveAuth.GenerateTicket();
									return await pve_utils.PveCurl.Post(
										`${pveAuthInfo.endpoint}/nodes/${node}/storage/${storage}/file-restore`,
										params,
										{ CSRFPreventionToken: pveAuthInfo.apiTicket.ticket },
										{ PVEAuthCookie: pveAuth.GetAuthCookie() }
									);
								},

								Download: {
									Get: async function (volume) {
										await pveAuth.GenerateTicket();
										return await pve_utils.PveCurl.Get(
											`${pveAuthInfo.endpoint}/nodes/${node}/storage/${storage}/file-restore/download`,
											params,
											{},
											{ PVEAuthCookie: pveAuth.GetAuthCookie() }
										);
									},
								},
								List: {
									Get: async function () {
										await pveAuth.GenerateTicket();
										return await pve_utils.PveCurl.Get(
											`${pveAuthInfo.endpoint}/nodes/${node}/storage/${storage}/file-restore/list`,
											params,
											{},
											{ PVEAuthCookie: pveAuth.GetAuthCookie() }
										);
									},
								},
							},

							DownloadUrl: {
								Post: async function (params) {
									await pveAuth.GenerateTicket();
									return await pve_utils.PveCurl.Post(
										`${pveAuthInfo.endpoint}/nodes/${node}/storage/${storage}/download-url`,
										params,
										{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
										{ PVEAuthCookie: pveAuth.GetAuthCookie() }
									);
								},
							},

							PruneBackups: {
								Get: async function (params) {
									await pveAuth.GenerateTicket();
									return await pve_utils.PveCurl.Get(
										`${pveAuthInfo.endpoint}/nodes/${node}/storage/${storage}/prunebackups`,
										params,
										{},
										{ PVEAuthCookie: pveAuth.GetAuthCookie() }
									);
								},

								Delete: async function (params) {
									await pveAuth.GenerateTicket();
									return await pve_utils.PveCurl.Delete(
										`${pveAuthInfo.endpoint}/nodes/${node}/storage/${storage}/prunebackups`,
										params,
										{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
										{ PVEAuthCookie: pveAuth.GetAuthCookie() }
									);
								},
							},

							Rrd: {
								Get: async function (params) {
									await pveAuth.GenerateTicket();
									return await pve_utils.PveCurl.Get(
										`${pveAuthInfo.endpoint}/nodes/${node}/storage/${storage}/rrd`,
										params,
										{},
										{ PVEAuthCookie: pveAuth.GetAuthCookie() }
									);
								},
							},

							RrdData: {
								Get: async function (params) {
									await pveAuth.GenerateTicket();
									return await pve_utils.PveCurl.Get(
										`${pveAuthInfo.endpoint}/nodes/${node}/storage/${storage}/rrddata`,
										params,
										{},
										{ PVEAuthCookie: pveAuth.GetAuthCookie() }
									);
								},
							},

							Status: {
								Get: async function () {
									await pveAuth.GenerateTicket();
									return await pve_utils.PveCurl.Get(
										`${pveAuthInfo.endpoint}/nodes/${node}/storage/${storage}/status`,
										params,
										{},
										{ PVEAuthCookie: pveAuth.GetAuthCookie() }
									);
								},
							},

							Upload: {
								Post: async function (params) {
									await pveAuth.GenerateTicket();
									return await pve_utils.PveCurl.Post(
										`${pveAuthInfo.endpoint}/nodes/${node}/storage/${storage}/upload`,
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
						await pveAuth.GenerateTicket();
						return await pve_utils.PveCurl.Get(
							`${pveAuthInfo.endpoint}/nodes/${node}/tasks`,
							params,
							{},
							{ PVEAuthCookie: pveAuth.GetAuthCookie() }
						);
					},

					Upid: function (upid) {
						return {
							Get: async function () {
								await pveAuth.GenerateTicket();
								return await pve_utils.PveCurl.Get(
									`${pveAuthInfo.endpoint}/nodes/${node}/tasks/${upid}`,
									{},
									{},
									{ PVEAuthCookie: pveAuth.GetAuthCookie() }
								);
							},

							Delete: async function () {
								await pveAuth.GenerateTicket();
								return await pve_utils.PveCurl.Delete(
									`${pveAuthInfo.endpoint}/nodes/${node}/tasks/${upid}`,
									{},
									{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
									{ PVEAuthCookie: pveAuth.GetAuthCookie() }
								);
							},

							Log: {
								Get: async function (params) {
									await pveAuth.GenerateTicket();
									return await pve_utils.PveCurl.Get(
										`${pveAuthInfo.endpoint}/nodes/${node}/tasks/${upid}/log`,
										params,
										{},
										{ PVEAuthCookie: pveAuth.GetAuthCookie() }
									);
								},
							},

							Status: {
								Get: async function (params) {
									await pveAuth.GenerateTicket();
									return await pve_utils.PveCurl.Get(
										`${pveAuthInfo.endpoint}/nodes/${node}/tasks/${upid}/status`,
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
						await pveAuth.GenerateTicket();
						return await pve_utils.PveCurl.Post(
							`${pveAuthInfo.endpoint}/nodes/${node}/vzdump`,
							params,
							{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
							{ PVEAuthCookie: pveAuth.GetAuthCookie() }
						);
					},

					Defaults: {
						Get: async function (params) {
							await pveAuth.GenerateTicket();
							return await pve_utils.PveCurl.Get(
								`${pveAuthInfo.endpoint}/nodes/${node}/vzdump/defaults`,
								params,
								{},
								{ PVEAuthCookie: pveAuth.GetAuthCookie() }
							);
						},
					},

					ExtractConfig: {
						Get: async function (params) {
							await pveAuth.GenerateTicket();
							return await pve_utils.PveCurl.Get(
								`${pveAuthInfo.endpoint}/nodes/${node}/vzdump/extraconfig`,
								params,
								{},
								{ PVEAuthCookie: pveAuth.GetAuthCookie() }
							);
						},
					},
				},

				AplInfo: {
					Get: async function () {
						await pveAuth.GenerateTicket();
						return await pve_utils.PveCurl.Get(
							`${pveAuthInfo.endpoint}/nodes/${node}/aplinfo`,
							{},
							{},
							{ PVEAuthCookie: pveAuth.GetAuthCookie() }
						);
					},

					Post: async function (params) {
						await pveAuth.GenerateTicket();
						return await pve_utils.PveCurl.Post(
							`${pveAuthInfo.endpoint}/nodes/${node}/aplinfo`,
							params,
							{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
							{ PVEAuthCookie: pveAuth.GetAuthCookie() }
						);
					},
				},

				Config: {
					Get: async function (params) {
						await pveAuth.GenerateTicket();
						return await pve_utils.PveCurl.Get(
							`${pveAuthInfo.endpoint}/nodes/${node}/config`,
							params,
							{},
							{ PVEAuthCookie: pveAuth.GetAuthCookie() }
						);
					},

					Put: async function (params) {
						await pveAuth.GenerateTicket();
						return await pve_utils.PveCurl.Put(
							`${pveAuthInfo.endpoint}/nodes/${node}/config`,
							params,
							{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
							{ PVEAuthCookie: pveAuth.GetAuthCookie() }
						);
					},
				},

				Dns: {
					Get: async function () {
						await pveAuth.GenerateTicket();
						return await pve_utils.PveCurl.Get(
							`${pveAuthInfo.endpoint}/nodes/${node}/dns`,
							{},
							{},
							{ PVEAuthCookie: pveAuth.GetAuthCookie() }
						);
					},

					Put: async function (params) {
						await pveAuth.GenerateTicket();
						return await pve_utils.PveCurl.Put(
							`${pveAuthInfo.endpoint}/nodes/${node}/dns`,
							params,
							{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
							{ PVEAuthCookie: pveAuth.GetAuthCookie() }
						);
					},
				},

				Execute: {
					Get: async function () {
						await pveAuth.GenerateTicket();
						return await pve_utils.PveCurl.Get(
							`${pveAuthInfo.endpoint}/nodes/${node}/execute`,
							{},
							{},
							{ PVEAuthCookie: pveAuth.GetAuthCookie() }
						);
					},

					Put: async function (params) {
						await pveAuth.GenerateTicket();
						return await pve_utils.PveCurl.Put(
							`${pveAuthInfo.endpoint}/nodes/${node}/execute`,
							params,
							{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
							{ PVEAuthCookie: pveAuth.GetAuthCookie() }
						);
					},
				},

				Hosts: {
					Get: async function () {
						await pveAuth.GenerateTicket();
						return await pve_utils.PveCurl.Get(
							`${pveAuthInfo.endpoint}/nodes/${node}/hosts`,
							{},
							{},
							{ PVEAuthCookie: pveAuth.GetAuthCookie() }
						);
					},

					Post: async function (params) {
						await pveAuth.GenerateTicket();
						return await pve_utils.PveCurl.Post(
							`${pveAuthInfo.endpoint}/nodes/${node}/hosts`,
							params,
							{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
							{ PVEAuthCookie: pveAuth.GetAuthCookie() }
						);
					},
				},

				Journal: {
					Get: async function (params) {
						await pveAuth.GenerateTicket();
						return await pve_utils.PveCurl.Get(
							`${pveAuthInfo.endpoint}/nodes/${node}/journal`,
							params,
							{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
							{ PVEAuthCookie: pveAuth.GetAuthCookie() }
						);
					},
				},

				MigrateAll: {
					Post: async function (params) {
						await pveAuth.GenerateTicket();
						return await pve_utils.PveCurl.Post(
							`${pveAuthInfo.endpoint}/nodes/${node}/migrateall`,
							params,
							{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
							{ PVEAuthCookie: pveAuth.GetAuthCookie() }
						);
					},
				},

				NetStat: {
					Get: async function () {
						await pveAuth.GenerateTicket();
						return await pve_utils.PveCurl.Get(
							`${pveAuthInfo.endpoint}/nodes/${node}/netstat`,
							{},
							{},
							{ PVEAuthCookie: pveAuth.GetAuthCookie() }
						);
					},
				},

				Report: {
					Get: async function () {
						await pveAuth.GenerateTicket();
						return await pve_utils.PveCurl.Get(
							`${pveAuthInfo.endpoint}/nodes/${node}/report`,
							{},
							{},
							{ PVEAuthCookie: pveAuth.GetAuthCookie() }
						);
					},
				},

				Rrd: {
					Get: async function (params) {
						await pveAuth.GenerateTicket();
						return await pve_utils.PveCurl.Get(
							`${pveAuthInfo.endpoint}/nodes/${node}/rrd`,
							params,
							{},
							{ PVEAuthCookie: pveAuth.GetAuthCookie() }
						);
					},
				},

				RrdData: {
					Get: async function (params) {
						await pveAuth.GenerateTicket();
						return await pve_utils.PveCurl.Get(
							`${pveAuthInfo.endpoint}/nodes/${node}/rrddata`,
							params,
							{},
							{ PVEAuthCookie: pveAuth.GetAuthCookie() }
						);
					},
				},

				SpiceShell: {
					Post: async function (params) {
						await pveAuth.GenerateTicket();
						return await pve_utils.PveCurl.Post(
							`${pveAuthInfo.endpoint}/nodes/${node}/spiceshell`,
							params,
							{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
							{ PVEAuthCookie: pveAuth.GetAuthCookie() }
						);
					},
				},

				StartAll: {
					Post: async function (params) {
						await pveAuth.GenerateTicket();
						return await pve_utils.PveCurl.Post(
							`${pveAuthInfo.endpoint}/nodes/${node}/startall`,
							params,
							{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
							{ PVEAuthCookie: pveAuth.GetAuthCookie() }
						);
					},
				},

				Status: {
					Get: async function () {
						await pveAuth.GenerateTicket();
						return await pve_utils.PveCurl.Get(
							`${pveAuthInfo.endpoint}/nodes/${node}/status`,
							{},
							{},
							{ PVEAuthCookie: pveAuth.GetAuthCookie() }
						);
					},

					Post: async function (params) {
						await pveAuth.GenerateTicket();
						return await pve_utils.PveCurl.Post(
							`${pveAuthInfo.endpoint}/nodes/${node}/status`,
							params,
							{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
							{ PVEAuthCookie: pveAuth.GetAuthCookie() }
						);
					},
				},

				StopAll: {
					Post: async function (params) {
						await pveAuth.GenerateTicket();
						return await pve_utils.PveCurl.Post(
							`${pveAuthInfo.endpoint}/nodes/${node}/stopall`,
							params,
							{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
							{ PVEAuthCookie: pveAuth.GetAuthCookie() }
						);
					},
				},

				Subscription: {
					Get: async function () {
						await pveAuth.GenerateTicket();
						return await pve_utils.PveCurl.Get(
							`${pveAuthInfo.endpoint}/nodes/${node}/subscription`,
							{},
							{},
							{ PVEAuthCookie: pveAuth.GetAuthCookie() }
						);
					},

					Post: async function (params) {
						await pveAuth.GenerateTicket();
						return await pve_utils.PveCurl.Post(
							`${pveAuthInfo.endpoint}/nodes/${node}/subscription`,
							params,
							{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
							{ PVEAuthCookie: pveAuth.GetAuthCookie() }
						);
					},

					Put: async function (params) {
						await pveAuth.GenerateTicket();
						return await pve_utils.PveCurl.Put(
							`${pveAuthInfo.endpoint}/nodes/${node}/subscription`,
							params,
							{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
							{ PVEAuthCookie: pveAuth.GetAuthCookie() }
						);
					},

					Delete: async function () {
						await pveAuth.GenerateTicket();
						return await pve_utils.PveCurl.Delete(
							`${pveAuthInfo.endpoint}/nodes/${node}/subscription`,
							params,
							{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
							{ PVEAuthCookie: pveAuth.GetAuthCookie() }
						);
					},
				},

				SysLog: {
					Get: async function () {
						await pveAuth.GenerateTicket();
						return await pve_utils.PveCurl.Get(
							`${pveAuthInfo.endpoint}/nodes/${node}/syslog`,
							params,
							{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
							{ PVEAuthCookie: pveAuth.GetAuthCookie() }
						);
					},
				},

				TermProxy: {
					Post: async function (params) {
						await pveAuth.GenerateTicket();
						return await pve_utils.PveCurl.Post(
							`${pveAuthInfo.endpoint}/nodes/${node}/termproxy`,
							params,
							{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
							{ PVEAuthCookie: pveAuth.GetAuthCookie() }
						);
					},
				},
				Time: {
					Get: async function () {
						await pveAuth.GenerateTicket();
						return await pve_utils.PveCurl.Get(
							`${pveAuthInfo.endpoint}/nodes/${node}/time`,
							{},
							{},
							{ PVEAuthCookie: pveAuth.GetAuthCookie() }
						);
					},

					Put: async function (params) {
						await pveAuth.GenerateTicket();
						return await pve_utils.PveCurl.Put(
							`${pveAuthInfo.endpoint}/nodes/${node}/time`,
							params,
							{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
							{ PVEAuthCookie: pveAuth.GetAuthCookie() }
						);
					},
				},
				Version: {
					Get: async function () {
						await pveAuth.GenerateTicket();
						return await pve_utils.PveCurl.Get(
							`${pveAuthInfo.endpoint}/nodes/${node}/version`,
							{},
							{},
							{ PVEAuthCookie: pveAuth.GetAuthCookie() }
						);
					},
				},

				VncShell: {
					Post: async function (params) {
						await pveAuth.GenerateTicket();
						return await pve_utils.PveCurl.Post(
							`${pveAuthInfo.endpoint}/nodes/${node}/vncshell`,
							params,
							{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
							{ PVEAuthCookie: pveAuth.GetAuthCookie() }
						);
					},
				},

				VncWebSocket: {
					Get: async function () {
						await pveAuth.GenerateTicket();
						return await pve_utils.PveCurl.Get(
							`${pveAuthInfo.endpoint}/nodes/${node}/vncwebsocket`,
							{},
							{},
							{ PVEAuthCookie: pveAuth.GetAuthCookie() }
						);
					},
				},

				WakeOnLan: {
					Post: async function () {
						await pveAuth.GenerateTicket();
						return await pve_utils.PveCurl.Post(
							`${pveAuthInfo.endpoint}/nodes/${node}/wakeonlan`,
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