
支付宝生活号（服务窗） Node.js SDK
===========================
基于co框架的支付宝生活号SDK,目前只实现了oauth授权和生成推广二维码接口

## Install

```
npm install co-alipay-platform
```

## Usage

```javascript
const sdk = new ALIPAY_SDK(appId, privateKey);

co(function* (){

    //通过auth_code换取access_token
    sdk.oauthToken('auth_code');

    //生成推广二维码
    sdk.createQrcode(options);

});
```

