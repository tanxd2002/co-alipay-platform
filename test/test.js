'use strict';

const mocha = require('co-mocha');
const expect = require('chai').expect;
const ALIPAY_SDK = require('../index');

/********** 定义APPID, 私钥  **********/
const appId = "201612122122";
const privateKey =
    "-----BEGIN RSA PRIVATE KEY-----\n" +
    "MIICXQIBAAKBgQDVBxxF/YbtXt35rySOm3U9RChqsdVwFNBPxGQ1/brx3DtYgz5L\n" +
    "................................................................\n"+
    "................................................................\n"+
    "................................................................\n"+
    "................................................................\n"+
    "Wm/RrhriHv+lJOv/mA86/awO9PdxrTEjU8wE109hRGO+\n" +
    "-----END RSA PRIVATE KEY-----";
/********** 定义APPID, 私钥  **********/


const sdk = new ALIPAY_SDK(appId, privateKey);

describe('alipay-platform-sdk-test', function() {

    it('createQrcode', function* () {
        let response = yield sdk.createQrcode({showLogo:'N', sceneId:'123'});
        expect(response).to.be.ok;
    });

    it('oauthToken', function* () {
        let response = yield sdk.oauthToken('123');
        expect(response).to.be.ok;
    });
});