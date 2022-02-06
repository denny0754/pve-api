class PveAuth {
	#pveAuthOptions = {
		apiToken: null,
		username: null,
		password: null,
		realm: null,
		host: null,
		endpoint: null,

		apiTicket: {
			ticket: "",
			csrfPreventionToken: "",
			timeStamp: 0,
		},
	};

	constructor(pveAuthOptions) {
		super();
		this.pveAuthOptions = pveAuthOptions;

		this.pveAuthOptions.apiTicket = {
			ticket: "",
			csrfPreventionToken: "",
			timeStamp: 0
		};

		await this.#GenerateTicket();
		// Every 7140 seconds(119 minutes) a new ticket is generated
		//!TODO Probably bad practice - should be tested or find better solution(?)
		setInterval(this.#GenerateTicket, 7150000);
	}

	async #GenerateTicket() {
		// Ticket validity time is 2 hours.
		// Ticket can be used to generate a new one, replacing the password field.
		// This generates a new ticket every 7080 seconds(118 minutes) which gives a 2 minutes
		// span to generate a new one using the current ticket.
		var ticketHasExpired =
			pveAuthInfo.apiTicket.timeStamp + 7080 < new Date().getTime();

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
	}

	GetCsrfPreventionToken() {
		return this.#pveAuthOptions.apiTicket.csrfPreventionToken;
	}

	GetAuthCookie() {
		return this.#pveAuthOptions.apiTicket.ticket;
	}

	GetEndpoint() {
		return this.#pveAuthOptions.endpoint;
	}
}

module.exports = { PveAuth };