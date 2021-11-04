const assert = require('assert');
require('dotenv').config();
const pveapi = require('../../lib/pve-api')(
    process.env.UNAME,
    process.env.PASSWORD,
    process.env.REALM || 'pam',
    process.env.HOST_NAME || process.env.HOST_IPV4,
    process.env.VERBOSE_LEVEL || -1
);

describe('version.get', () => {
    it('Version', async () => {
        pveapi.SetSslVerifyHost(false);
        pveapi.SetSslVerifyPeer(false);
        var response = await pveapi.Version.Get();
        assert.equal(response.statusCode, 200);
    }).timeout(10000);
});
