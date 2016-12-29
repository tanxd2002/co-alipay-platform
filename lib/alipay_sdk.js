'use strict';

const crypto = require('crypto');
const querystring = require('querystring');
const request = require("co-request");

const alipayGatewayUrl = 'https://openapi.alipay.com/gateway.do';

function alipay_platform_sdk(appId, privateKey) {
    this.appId = appId;
    this.privateKey = privateKey;
}

module.exports = alipay_platform_sdk;

(function(alipay_platform_sdk){

    let sdk = alipay_platform_sdk.prototype;

    sdk.createQrcode = function* (options){
        let _options = options || {};
        let _codeType = _options.codeType || 'TEMP';
        let _expireSecond = _options.expireSecond || '1800';
        let _showLogo = _options.showLogo || 'Y';

        let bizContent = {
            'codeType': _codeType,
            'expireSecond': _expireSecond,
            'showLogo': _showLogo
        };

        if (_options.sceneId) {
            bizContent.codeInfo = bizContent.codeInfo || {};
            bizContent.codeInfo.scene = bizContent.codeInfo.scene || {};
            bizContent.codeInfo.scene.sceneId = _options.sceneId;
        }
        if (_options.gotoUrl) {
            bizContent.codeInfo = bizContent.codeInfo || {};
            bizContent.codeInfo.gotoUrl = _options.gotoUrl;
        }

        let postData = {
            'app_id': this.appId,
            'method': 'alipay.open.public.qrcode.create',
            'charset': 'GBK',
            'sign_type': 'RSA',
            'version': '1.0',
            'timestamp': getCurrentTime(),
            'biz_content': JSON.stringify(bizContent)
        };
        postData.sign = getSign(postData, this.privateKey);
        const postDataStr = querystring.stringify(postData);
        const req = {
            uri: alipayGatewayUrl,
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': postDataStr ? Buffer.byteLength(postDataStr) : 0
            },
            body: postDataStr
        };
        const response = yield request(req);
        const data = JSON.parse(response.body);
        return data.alipay_open_public_qrcode_create_response;
    };

    sdk.oauthToken = function* (code) {
        let postData = {
            'app_id': this.appId,
            'method': 'alipay.system.oauth.token',
            'charset': 'GBK',
            'sign_type': 'RSA',
            'version': '1.0',
            'grant_type': 'authorization_code',
            'code': code,
            'timestamp': getCurrentTime()
        };
        postData.sign = getSign(postData, this.privateKey);
        const postDataStr = querystring.stringify(postData);
        const options = {
            uri: alipayGatewayUrl,
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': postDataStr ? Buffer.byteLength(postDataStr) : 0
            },
            body: postDataStr
        };
        const response = yield request(options);
        const data = JSON.parse(response.body);
        if (data.error_response) {
            return data.error_response;
        } else {
            return data.alipay_system_oauth_token_response;
        }
    }

})(alipay_platform_sdk);

function getSign (params, privateKey) {
    let preSignContent = '';
    let keys = Object.keys(params).sort();
    for (const key of keys) {
        if (preSignContent != '') {
            preSignContent += '&'
        }
        preSignContent += key + '=' + params[key];
    }
    var sign = crypto.createSign('RSA-SHA1');
    sign.update(preSignContent);
    return sign.sign(privateKey, 'base64');
}

function getCurrentTime() {
    let date  = new Date();
    let year = date.getFullYear();
    let month = date.getMonth()+1;
    if (month < 10) {
        month = "0"+month;
    }
    let day = date.getDate();
    if (day < 10) {
        day = "0"+day;
    }
    let hour = date.getHours();
    if (hour < 10) {
        hour = "0"+hour;
    }
    let minute = date.getMinutes();
    if (minute < 10) {
        minute = "0"+minute;
    }
    let second = date.getSeconds();
    if (second < 10) {
        second = "0"+second;
    }
    return year+'-'+month+'-'+day+' '+hour+":"+minute+":"+second;
}
