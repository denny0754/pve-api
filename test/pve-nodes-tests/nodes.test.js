const assert = require('assert');
require('dotenv').config();

let RequireUnCached = (module) => {
    delete require.cache[require.resolve(module)];
    return require(module);
};

describe('nodes.get', () => {
    it('ALL_IN_ONE_200_OK', async () => {
        const pveapi = RequireUnCached('../../lib/pve-api')(
            process.env.UNAME,
            process.env.PASSWORD,
            process.env.REALM || 'pam',
            process.env.HOST_NAME || process.env.HOST_IPV4,
            process.env.VERBOSE_LEVEL || -1
        );

        pveapi.SetSslVerifyHost(false);
        pveapi.SetSslVerifyPeer(false);

        var response = await pveapi.Nodes.Get();
        assert.equal(response.statusCode, 200);
    }).timeout(10000);

    it('STANDALONE_200_OK', async () => {
        const pve_nodes_api = RequireUnCached('../../lib/pve-nodes-api')(
            process.env.UNAME,
            process.env.PASSWORD,
            process.env.REALM || 'pam',
            process.env.HOST_NAME || process.env.HOST_IPV4,
            process.env.VERBOSE_LEVEL || -1
        );

        pve_nodes_api.SetSslVerifyHost(false);
        pve_nodes_api.SetSslVerifyPeer(false);

        var response = await pve_nodes_api.Get();
        assert.equal(response.statusCode, 200);

    }).timeout(10000);
});

describe('nodes.node.get', () => {
    it('ALL_IN_ONE_200_OK', async () => {
        const pveapi = RequireUnCached('../../lib/pve-api')(
            process.env.UNAME,
            process.env.PASSWORD,
            process.env.REALM || 'pam',
            process.env.HOST_NAME || process.env.HOST_IPV4,
            process.env.VERBOSE_LEVEL || -1
        );

        pveapi.SetSslVerifyHost(false);
        pveapi.SetSslVerifyPeer(false);

        assert.notEqual(process.env.PROXMOX_NODE, undefined);
        assert.notEqual(process.env.PROXMOX_NODE, "");

        var response = await pveapi.Nodes.Node(process.env.PROXMOX_NODE).Get();
        assert.equal(response.statusCode, 200);

    }).timeout(10000);

    it('STANDALONE_200_OK', async () => {
        const pve_nodes_api = RequireUnCached('../../lib/pve-nodes-api')(
            process.env.UNAME,
            process.env.PASSWORD,
            process.env.REALM || 'pam',
            process.env.HOST_NAME || process.env.HOST_IPV4,
            process.env.VERBOSE_LEVEL || -1
        );

        pve_nodes_api.SetSslVerifyHost(false);
        pve_nodes_api.SetSslVerifyPeer(false);

        assert.notEqual(process.env.PROXMOX_NODE, undefined);
        assert.notEqual(process.env.PROXMOX_NODE, "");

        var response = await pve_nodes_api.Node(process.env.PROXMOX_NODE).Get();
        assert.equal(response.statusCode, 200);

    }).timeout(10000);
});