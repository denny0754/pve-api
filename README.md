# pve-api

## Introduction

`pve-api` is designed to be easy to use by straight up following the structure of the Proxmox VE API found at the following link: [Proxmox VE API](https://pve.proxmox.com/pve-docs/api-viewer).

You can easily build the function to call for a given route by looking at the Proxmox VE API viewer.

Here's an example that shows how to get the current configuration of a running LXC

The API viewer's path is:
```
/nodes/{node}/lxc/{vmid}/config
```

`pve-api`'s approach is:
```js
let lxcConfig = pve_api.Nodes.Node('NODDID').Lxc.Vmid('VMID').Config.Get({ ...params });
```

## __Why modular?__

`pve-api` was designed to be modular for a simple and logical reason: you won't always need the full feature set of a library.

This is why `pve-api` was designed and sub-divided into five smaller modules, each representing a main route on the PVE API viewer, that is: `/access`, `/nodes`, `/cluster`, `/pools` and `/storage`.

_Note: the `/cluster` nodes is still under development and thus not available._

## __Usage__

In order to use `pve-api` you're required to have `npm` installed. Right now the library is developed and tested under `npm` version `8.1.0`.

Having `npm` installed, you can install `pve-api` by executing the following command under your project's folder:

```bash
npm install pve-api
```

From then on you can start using by including it in your projects:

```javascript
// Using the all-in-one API Module
const pveapi = require('pve-api')(
        uname, // Username
        pwd,   // Password
        realm, // REALM of the User(PAM, PVE Auth, OpenID, ...)
        host,  // Hostname or IPv4
        verboseLevel // Verbosity of messages - default is 0(only errors and criticals)
    );

// Using the stand-alone API Module
const pve_nodes_api = require('pve-nodes-api')(
    uname,  // Username
    pwd,    // Password
    realm,  // REALM of the User(PAM, PVE Auth, OpenID, ...)
    host,   // Hostname or IPv4
    verboseLevel // Verbosity of messages - default is 0(only errors and criticals)
);

```
Where:

- `username`: is the User you use to login to Proxmox VE.
- `password`: is the User's password
- `realm`: by default it's `PAM`.
- `host`: hostname or IPv4 of the server hosting Proxmox VE
- `verboseLevel`: 
    - 0(default): Errors, Criticals
    - 1: Warnings, Errors, Criticals
    - 2: Info, Warnings, Errors, Criticals
    - 3: Debug, Info, Warnings, Errors, Criticals

## __In progress__

- [ ] `pve-api-cluster` module
- [ ] Possibility to make requests using an API Token/Key
- [ ] Tests
- [ ] Cleaner codebase and documentation