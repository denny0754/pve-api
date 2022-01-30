module.exports = function (uname, pwd, realm, host) {
	const pveCurl = require("./pve-curl")(0);

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
			timeStamp: 0,
		},
	};

	var Module = {
		GenerateTicket: async () => {
			// Ticket validity time is 2 hours.
			// Ticket can be used to generate a new one, replacing the password field.
			var ticketHasExpired = pveAuthInfo.apiTicket.timeStamp + 7140 < new Date().getTime();

			// Generate a new ticket only if current one has expired
			if (ticketHasExpired) {
				var response = await pveCurl.PveCurl.Post(
					`${pveAuthInfo.endpoint}/access/ticket`,
					{
						username: pveAuthInfo.username,
						password: pveAuthInfo.password,
					},
					"",
					""
				);

				var resBody = null;

				if (response.body !== "undefined" && response.body !== null) {
					if (typeof response.body === "string") {
						resBody = JSON.parse(response.body);
					} else {
						resBody = response.body;
					}
				}

				var ticketData = resBody.data;
				pveAuthInfo.apiTicket.csrfPreventionToken =
					ticketData.CSRFPreventionToken;
				pveAuthInfo.apiTicket.ticket = ticketData.ticket;
				pveAuthInfo.apiTicket.timeStamp = new Date().getTime();
				// Replacing the password with the newly generated ticket.
				// Quote from `https://pve.proxmox.com/wiki/Proxmox_VE_API#Authentication`:
				// NOTE: Tickets have a limited lifetime of 2 hours.
				// But you can simply get a new ticket by passing the old
				// ticket as password to the /access/ticket method before its lifetime expired.
				pveAuthInfo.password = pveAuthInfo.apiTicket.ticket;
			}
		},

        GetCsrfPreventionToken: async () => {
            return pveAuthInfo.apiTicket.csrfPreventionToken;
        },

        GetAuthCookie: async() => {
            return pveAuthInfo.apiTicket.ticket;
        }
	};

    return Module;
};
