const assert = require('assert');
require('dotenv').config();

describe('storage.get', () => {
    it('INTEGRATED_200_OK', async () => {
        delete require.cache[require.resolve('../../lib/pve-api')];
        const pveapi = require('../../lib/pve-api')(
            process.env.UNAME,
            process.env.PASSWORD,
            process.env.REALM || 'pam',
            process.env.HOST_NAME || process.env.HOST_IPV4,
            process.env.VERBOSE_LEVEL || -1
        );

        pveapi.SetSslVerifyHost(false);
        pveapi.SetSslVerifyPeer(false);
        var response = await pveapi.Storage.Get("");
        assert.equal(response.statusCode, 200);
    }).timeout(10000);

    it('STANDALONE_200_OK', async () => {
        delete require.cache[require.resolve('../../lib/pve-storage/api')];
        const pve_storage_api = require('../../lib/pve-storage/api')(
            process.env.UNAME,
            process.env.PASSWORD,
            process.env.REALM || 'pam',
            process.env.HOST_NAME || process.env.HOST_IPV4,
            process.env.VERBOSE_LEVEL || -1
        );

        pve_storage_api.SetSslVerifyHost(false);
        pve_storage_api.SetSslVerifyPeer(false);
        var response = await pve_storage_api.Get("");
        assert.equal(response.statusCode, 200);

    }).timeout(10000);
});
