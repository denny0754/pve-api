# pve-api

## __Introduction__

`pve-api` is designed to be easy to use by straight up following the structure of the Proxmox PVE API (see [Proxmox API](https://pve.proxmox.com/pve-docs/api-viewer/#/storage)). As a matter of facts, you can just follow any route found in the [Proxmox API](https://pve.proxmox.com/pve-docs/api-viewer/#/storage) and convert it into code.

Here's a simple example of how `pve-api`'s conversion is used:

___Getting all LXC instances___

_Proxmox API_:
```bash
pvesh get /nodes/{node}/lxc
```
_or_
```bash
curl -XGET -d ... 'https://example.com:8006/api2/json/nodes/NODE_ID/lxc'
```

_pve-api_: 
```javascript
// Using the all-in-one API Module
const pveapi = require('pve-api')(
        uname, // Username by which you login to Proxmox
        pwd,   // Password of the User
        realm, // REALM of the User(PAM, PVE Auth, OpenID, ...)
        host,  // Hostname or IPv4
        verboseLevel // Verbosity of messages - default is 0(only errors and criticals)
    );

var response = await pveapi.Nodes.Node('NODE_ID').Get();

// Using the stand-alone API Module
const pve_nodes_api = require('pve-nodes-api')(
    uname,
    pwd,
    realm,
    host,
    verboseLevel
);

var response = pve_nodes_api.Node('NODE_ID').Get();
```