
支付宝生活号（服务窗） Node.js SDK
===========================
目前只实现了oauth授权和生成推广二维码接口



## Usage

```javascript
const sdk = new ALIPAY_SDK(appId, privateKey);

//通过auth_code换取access_token
sdk.oauthToken('auth_code');

//生成推广二维码
sdk.createQrcode(options);
```

