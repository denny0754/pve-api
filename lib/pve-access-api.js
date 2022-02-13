const { PveAuth } = require("./auth/pve-auth");

module.exports = function (uname, pwd, realm, host, verboseLevel) {
	const pve_utils = require("./pve-curl")(verboseLevel);

	const logging = require("./utils/logging")(verboseLevel);

	var pveAuth = new PveAuth({
		uname: uname,
		pwd: pwd,
		realm: realm,
		host: host,
		verboseLevel: verboseLevel
	});
	
	let Module = {
		SetSslVerifyPeer: (sslVerifyPeer) => {
			logging.Info(`SSL Verify Peer set to ${sslVerifyPeer}`);
			pve_utils.PveCurl.SetSslVerifyPeer(sslVerifyPeer);
		},

		SetSslVerifyHost: (sslVerifyHost) => {
			logging.Info(`SSL Verify Host set to ${sslVerifyHost}`);
			pve_utils.PveCurl.SetSslVerifyHost(sslVerifyHost);
		},

		SetAuthenticator: (authenticator) => {
			pveAuth = authenticator;
		},

		Get: async function () {
			return await pve_utils.PveCurl.Get(
				`${pveAuth.GetEndpoint()}/access`,
				{},
				{},
				{ PVEAuthCookie: pveAuth.GetAuthCookie() }
			);
		},

		Domains: {
			Get: async function () {
				return await pve_utils.PveCurl.Get(
					`${pveAuth.GetEndpoint()}/access/domains`,
					{},
					{},
					{ PVEAuthCookie: pveAuth.GetAuthCookie() }
				);
			},

			Post: async function (params) {
				return await pve_utils.PveCurl.Post(
					`${pveAuth.GetEndpoint()}/access/domains`,
					params,
					{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
					{ PVEAuthCookie: pveAuth.GetAuthCookie() }
				);
			},

			Realm: function (realm) {
				return {
					Get: async function () {
						return await pve_utils.PveCurl.Get(
							`${pveAuth.GetEndpoint()}/access/domains/${realm}`,
							{},
							{},
							{ PVEAuthCookie: pveAuth.GetAuthCookie() }
						);
					},

					Put: async function (params) {
						return await pve_utils.PveCurl.Put(
							`${pveAuth.GetEndpoint()}/access/domains/${realm}`,
							params,
							{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
							{ PVEAuthCookie: pveAuth.GetAuthCookie() }
						);
					},

					Delete: async function () {
						return await pve_utils.PveCurl.Delete(
							`${pveAuth.GetEndpoint()}/access/domains/${realm}`,
							{},
							{},
							{ PVEAuthCookie: pveAuth.GetAuthCookie() }
						);
					},

					Sync: {
						Post: async function (params) {
							return await pve_utils.PveCurl.Post(
								`${pveAuth.GetEndpoint()}/access/domains/${realm}/sync`,
								params,
								{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
								{ PVEAuthCookie: pveAuth.GetAuthCookie() }
							);
						},
					},
				};
			},
		},

		Groups: {
			Get: async function () {
				return await pve_utils.PveCurl.Get(
					`${pveAuth.GetEndpoint()}/access/groups`,
					{},
					{},
					{ PVEAuthCookie: pveAuth.GetAuthCookie() }
				);
			},

			Post: async function (params) {
				return await pve_utils.PveCurl.Post(
					`${pveAuth.GetEndpoint()}/access/groups`,
					params,
					{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
					{ PVEAuthCookie: pveAuth.GetAuthCookie() }
				);
			},

			GroupID: function (groupid) {
				return {
					Get: async function () {
						return await pve_utils.PveCurl.Get(
							`${pveAuth.GetEndpoint()}/access/groups/${groupid}`,
							{},
							{},
							{ PVEAuthCookie: pveAuth.GetAuthCookie() }
						);
					},

					Put: async function (params) {
						return await pve_utils.PveCurl.Put(
							`${pveAuth.GetEndpoint()}/access/groups/${groupid}`,
							params,
							{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
							{ PVEAuthCookie: pveAuth.GetAuthCookie() }
						);
					},

					Delete: async function () {
						return await pve_utils.PveCurl.Delete(
							`${pveAuth.GetEndpoint()}/access/groups/${groupid}`,
							{},
							{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
							{ PVEAuthCookie: pveAuth.GetAuthCookie() }
						);
					},
				};
			},
		},

		OpenID: {
			Get: async function () {
				return await pve_utils.PveCurl.Get(
					`${pveAuth.GetEndpoint()}/access/openid`,
					{},
					{},
					{ PVEAuthCookie: pveAuth.GetAuthCookie() }
				);
			},
			AuthUrl: {
				Post: async function (params) {
					await pve_utils.PveCurl.Post(
						`${pveAuth.GetEndpoint()}/access/openid/auth-url`,
						params,
						{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
						{ PVEAuthCookie: pveAuth.GetAuthCookie() }
					);
				},
			},
			Login: {
				Post: async function (params) {
					await pve_utils.PveCurl.Post(
						`${pveAuth.GetEndpoint()}/access/openid/login`,
						params,
						{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
						{ PVEAuthCookie: pveAuth.GetAuthCookie() }
					);
				},
			},
		},

		Roles: {
			Get: async function () {
				return await pve_utils.PveCurl.Get(
					`${pveAuth.GetEndpoint()}/access/roles`,
					{},
					{},
					{ PVEAuthCookie: pveAuth.GetAuthCookie() }
				);
			},
			Post: async function (params) {
				return await pve_utils.PveCurl.Post(
					`${pveAuth.GetEndpoint()}/access/roles`,
					params,
					{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
					{ PVEAuthCookie: pveAuth.GetAuthCookie() }
				);
			},

			RoleID: function (roleid) {
				return {
					Get: async function () {
						return await pve_utils.PveCurl.Get(
							`${pveAuth.GetEndpoint()}/access/roles/${roleid}`,
							{},
							{},
							{ PVEAuthCookie: pveAuth.GetAuthCookie() }
						);
					},
					Put: async function (params) {
						return await pve_utils.PveCurl.Put(
							`${pveAuth.GetEndpoint()}/access/roles/${roleid}`,
							params,
							{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
							{ PVEAuthCookie: pveAuth.GetAuthCookie() }
						);
					},
					Delete: async function () {
						return await pve_utils.PveCurl.Delete(
							`${pveAuth.GetEndpoint()}/access/roles/${roleid}`,
							{},
							{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
							{ PVEAuthCookie: pveAuth.GetAuthCookie() }
						);
					},
				};
			},
		},

		Tfa: {
			Get: async function () {
				return await pve_utils.PveCurl.Get(
					`${pveAuth.GetEndpoint()}/access/tfa`,
					{},
					{ PVEAuthCookie: pveAuth.GetAuthCookie() }
				);
			},

			Post: async function (params) {
				return await pve_utils.PveCurl.Post(
					`${pveAuth.GetEndpoint()}/access/tfa`,
					params,
					{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
					{ PVEAuthCookie: pveAuth.GetAuthCookie() }
				);
			},

			UserID: function (userid) {
				return {
					Get: async function () {
						return await pve_utils.PveCurl.Get(
							`${pveAuth.GetEndpoint()}/access/tfa/${userid}`,
							{},
							{},
							{ PVEAuthCookie: pveAuth.GetAuthCookie() }
						);
					},

					Post: async function (params) {
						return await pve_utils.PveCurl.Post(
							`${pveAuth.GetEndpoint()}/access/tfa/${userid}`,
							params,
							{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
							{ PVEAuthCookie: pveAuth.GetAuthCookie() }
						);
					},

					Id: function (id) {
						return {
							Get: async function () {
								return await pve_utils.PveCurl.Get(
									`${pveAuth.GetEndpoint()}/access/tfa/${userid}/${id}`,
									{},
									{},
									{ PVEAuthCookie: pveAuth.GetAuthCookie() }
								);
							},

							Put: async function (params) {
								return await pve_utils.PveCurl.Put(
									`${pveAuth.GetEndpoint()}/access/tfa/${userid}/${id}`,
									params,
									{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
									{ PVEAuthCookie: pveAuth.GetAuthCookie() }
								);
							},

							Delete: async function (params) {
								return await pve_utils.PveCurl.Delete(
									`${pveAuth.GetEndpoint()}/access/tfa/${userid}/${id}`,
									params,
									{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
									{ PVEAuthCookie: pveAuth.GetAuthCookie() }
								);
							},
						};
					},
				};
			},
		},

		Users: {
			Get: async function (params) {
				return await pve_utils.PveCurl.Get(
					`${pveAuth.GetEndpoint()}/access/users`,
					params,
					{},
					{ PVEAuthCookie: pveAuth.GetAuthCookie() }
				);
			},

			Post: async function (params) {
				return await pve_utils.PveCurl.Post(
					`${pveAuth.GetEndpoint()}/access/users`,
					params,
					{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
					{ PVEAuthCookie: pveAuth.GetAuthCookie() }
				);
			},

			UserID: function (userid) {
				return {
					Get: async function () {
						return await pve_utils.PveCurl.Get(
							`${pveAuth.GetEndpoint()}/access/users/${userid}`,
							{},
							{},
							{ PVEAuthCookie: pveAuth.GetAuthCookie() }
						);
					},

					Put: async function (params) {
						return await pve_utils.PveCurl.Put(
							`${pveAuth.GetEndpoint()}/access/users/${userid}`,
							params,
							{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
							{ PVEAuthCookie: pveAuth.GetAuthCookie() }
						);
					},

					Delete: async function () {
						return await pve_utils.PveCurl.Delete(
							`${pveAuth.GetEndpoint()}/access/users/${userid}`,
							{},
							{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
							{ PVEAuthCookie: pveAuth.GetAuthCookie() }
						);
					},

					Token: {
						Get: async function () {
							return await pve_utils.PveCurl.Get(
								`${pveAuth.GetEndpoint()}/access/users/${userid}/token`,
								{},
								{},
								{ PVEAuthCookie: pveAuth.GetAuthCookie() }
							);
						},

						TokenID: function (tokenid) {
							return {
								Get: async function () {
									return await pve_utils.PveCurl.Get(
										`${pveAuth.GetEndpoint()}/access/users/${userid}/token/${tokenid}`,
										{},
										{},
										{ PVEAuthCookie: pveAuth.GetAuthCookie() }
									);
								},

								Post: async function (params) {
									return await pve_utils.PveCurl.Post(
										`${pveAuth.GetEndpoint()}/access/users/${userid}/token/${tokenid}`,
										params,
										{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
										{ PVEAuthCookie: pveAuth.GetAuthCookie() }
									);
								},

								Put: async function (params) {
									return await pve_utils.PveCurl.Put(
										`${pveAuth.GetEndpoint()}/access/users/${userid}/token/${tokenid}`,
										params,
										{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
										{ PVEAuthCookie: pveAuth.GetAuthCookie() }
									);
								},

								Delete: async function () {
									return await pve_utils.PveCurl.Delete(
										`${pveAuth.GetEndpoint()}/access/users/${userid}/token/${tokenid}`,
										{},
										{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
										{ PVEAuthCookie: pveAuth.GetAuthCookie() }
									);
								},
							};
						},
					},

					Tfa: {
						Get: async function (params) {
							return await pve_utils.PveCurl.Delete(
								`${pveAuth.GetEndpoint()}/access/users/${userid}/tfa`,
								params,
								{},
								{ PVEAuthCookie: pveAuth.GetAuthCookie() }
							);
						},
					},
				};
			},
		},

		Acl: {
			Get: async function () {
				return await pve_utils.PveCurl.Get(
					`${pveAuth.GetEndpoint()}/access/acl`,
					{},
					{},
					{ PVEAuthCookie: pveAuth.GetAuthCookie() }
				);
			},
			Put: async function (params) {
				return await pve_utils.PveCurl.Put(
					`${pveAuth.GetEndpoint()}/access/acl`,
					params,
					{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
					{ PVEAuthCookie: pveAuth.GetAuthCookie() }
				);
			},
		},
		Password: {
			Put: async function (params) {
				return await pve_utils.PveCurl.Put(
					`${pveAuth.GetEndpoint()}/access/password`,
					params,
					{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
					{ PVEAuthCookie: pveAuth.GetAuthCookie() }
				);
			},
		},
		Permissions: {
			Get: async function (params) {
				return await pve_utils.PveCurl.Get(
					`${pveAuth.GetEndpoint()}/access/permissions`,
					params,
					{},
					{ PVEAuthCookie: pveAuth.GetAuthCookie() }
				);
			},
		},
		Ticket: {
			Get: async function () {
				return await pve_utils.PveCurl.Get(
					`${pveAuth.GetEndpoint()}/access/ticket`,
					{},
					{},
					{ PVEAuthCookie: pveAuth.GetAuthCookie() }
				);
			},
			Post: async function (params) {
				return await pve_utils.PveCurl.Post(
					`${pveAuth.GetEndpoint()}/access/ticket`,
					params,
					{ CSRFPreventionToken: pveAuth.GetCsrfPreventionToken() },
					{ PVEAuthCookie: pveAuth.GetAuthCookie() }
				);
			},
		},
	};

	return Module;
};
