const assert = require('assert');
require('dotenv').config();
const pveapi = require('../../lib/pve-api')(
    process.env.UNAME,
    process.env.PASSWORD,
    process.env.REALM || 'pam',
    process.env.HOST
);

describe('root.version', () => {
    it('Version', async () => {
        pveapi.SetSslVerifyHost(false);
        pveapi.SetSslVerifyPeer(false);
        var response = await pveapi.Version.Post();
        console.log(response);
        console.log(response.header)
        assert.equal(response.statusCode, 200);
    }).timeout(10000);
});