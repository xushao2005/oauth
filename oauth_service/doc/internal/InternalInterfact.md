# 认证中心内部接口

[TOC]

##OAuth2登录接口
###URL
`http://127.0.0.1:2333/auth/oauth2/login`
###http请求方式
`POST`
###请求参数
**headers**
|              | 必选   | 类型     | 说明                 |
| ------------ | ---- | ------ | ------------------ |
| Content-Type | true | string | 填写application/json |
**body**
|          | 必选   | 类型     | 说明   |
| -------- | ---- | ------ | ---- |
| username | true | string | 登录名  |
| password | true | string | 密码   |
###请求示例
```sh
curl -i -X POST \
   -H "Content-Type:application/json" \
   -d \
'{
  "loginName":"admin",
  "password":"1"
}' \
 'http://127.0.0.1:2333/auth/oauth/login'
```
###返回数据
**成功**

```json
{
"successful": true
}
```
**失败**

```json
{
"successful": false,
"msg": "用户名密码错误"
}
```

## demo

### URL

`http://127.0.0.1:2333/auth/test`

### http请求方式

`post`

### 请求参数
|      | 必选   | 类型   | 说明   |
| ---- | ---- | ---- | ---- |
|      |      |      |      |

### 请求示例

```sh

```

### 返回数据

**成功**

```json

```

**失败**

```json

```


## 登录

### URL

`http://127.0.0.1:2333/auth/login`

### http请求方式

`post`

### 请求参数
**headers**
|              | 必选   | 类型     | 说明                 |
| ------------ | ---- | ------ | ------------------ |
| Content-Type | true | string | 填写application/json |
**body**
|          | 必选   | 类型     | 说明   |
| -------- | ---- | ------ | ---- |
| username | true | string | 登录名  |
| password | true | string | 密码   |
### 请求示例

```sh
curl -i -X POST \
   -H "Content-Type:application/json" \
   -d \
'{
    "loginName": "test6",
    "password": "1"
}' \
 'http://127.0.0.1:2333/auth/login'
```

### 返回数据

**成功**

http Status Code: 200

**失败**

http Status Code: 401

http Status Code: 407

http Status Code: 500

---