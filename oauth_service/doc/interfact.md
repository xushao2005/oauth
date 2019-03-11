### 导航菜单接口

#### 请求

`/resource/menu`

```json
 clientId #非必填
```

#### 结果

```json
[
    {
        "id": "110",
        "name": "控制台",
        "resourceType": "MENU",
        "type": "MENU",
        "parentId": "0",
        "controlPId": "0",
        "breadPId": "0",
        "icon": "appstore-o",
        "router": "/",
        "matchRouter": "",
        "clientId": "0"
    },
    {
        "id": "999",
        "name": "系统管理",
        "resourceType": "MENU",
        "type": "MENU",
        "parentId": "0",
        "controlPId": "0",
        "breadPId": "0",
        "icon": "setting",
        "router": "",
        "matchRouter": "",
        "clientId": "0"
    },
    {
        "id": "9992",
        "name": "角色管理",
        "resourceType": "MENU",
        "type": "MENU",
        "parentId": "999",
        "controlPId": "999",
        "breadPId": "999",
        "icon": "team",
        "router": "/roles",
        "matchRouter": "",
        "clientId": "0"
    }
]

```

###OAuth2的authorize接口
####URL
http://127.0.0.1:2333/auth/oauth2/authorize
####http请求方式
GET/POST
####请求参数
|               | 必选   | 类型     | 说明                     |
| ------------- | ---- | ------ | ---------------------- |
| client_id     | true | string | 申请应用时分配的AppKey。        |
| redirect_uri  | true | string | 授权回调地址，站外应用需与设置的回调地址一致 |
| response_type | true | string | 响应类型。目前仅支持code         |
####请求示例
`curl -i -X GET \
 'http://127.0.0.1:2333/auth/oauth/authorize?client_id=b5ccdce8-5a46-4356-985b-89d0047d2d99&redirect_uri=http%3A%2F%2F127.0.0.1%3A8080%2Fcmbc%2Foauth2-login&response_type=code'`
####返回数据
#####成功
```json
{
  "successful": true,
  "code": "2200",
  "result": {
	"redirectUri": "http://xxxxx/callback",
    "code": "11223354232"
  }
}
```
|      | 类型     | 说明                                       |
| ---- | ------ | ---------------------------------------- |
| code | string | 用于第二步调用oauth2/access_token接口，获取授权后的access token。 |
#####失败
应用相关信息错误
```json
{
  "successful": false,
  "code": "4100",
  "msg": "error:invalid_client"
}
```
登录错误
```json
{
  "successful": false,
  "code": "4200",
  "msg": "error:未登录"
}
```
###登录接口
####URL
http://127.0.0.1:2333/auth/oauth2/login
####http请求方式
POST
####请求参数
|          | 必选   | 类型     | 说明   |
| -------- | ---- | ------ | ---- |
| username | true | string | 登录名  |
| password | true | string | 密码   |
####请求示例
`curl -i -X POST \
    -H "Content-Type:application/x-www-form-urlencoded" \
    -d "username=admin" \
    -d "password=1" \
  'http://127.0.0.1:2333/auth/oauth/login'`
####返回数据
#####成功
```json
{
"successful": true
}
```
#####失败
```json
{
"successful": false,
"msg": "用户名密码错误"
}
```
