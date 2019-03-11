### 功能添加接口


####请求说明
```
http请求方法:POST

http://127.0.0.1:2333/cmhb-OAuth2/functionEntity/add.htm
```

#### 请求示例

``` json
{
  "functions": [
        {
          "ID": "201705121014270910105022",
          "version": 0,
          "add_time": "2017-05-12 10:14:24.970",
          "mod_time": "2017-05-12 10:14:24.970",
          "function_name": "部门管理-删除部门",
          "function_url": "/dept/deleteDepartment.htm",
          "function_status": "ACTIVE",
          "description": "/dept/deleteDepartment->public void com.cmhb.cmcc.security.web.action.DepartmentAction.checkCode(java.lang.String,java.io.PrintWriter)",
          "function_type": "DEPARTMENT_PUBLIC",
          "keyword": "基础用户权限管理-部门管理",
          "client_id": 2
        },
        {
          "id": "201705121014281730972670",
          "version": 0,
          "add_time": "2017-05-12 10:14:24.780",
          "mod_time": "2017-05-12 10:14:24.780",
          "function_name": "用户管理-校验登录名是否唯一",
          "function_url": "/userentity/checkname.htm",
          "function_status": "ACTIVE",
          "description": "/userentity/checkname->public void com.cmhb.cmcc.security.web.action.UserEntityAction.checkName(java.lang.String,java.lang.String,java.io.PrintWriter)",
          "function_type": "DEPARTMENT_PUBLIC",
          "keyword": "基础用户权限管理-用户管理",
          "client_id": 2
        }
  ]
}
```

#### 参数说明

| 参数              | 是否必填 | 说明                                       |
| --------------- | ---- | ---------------------------------------- |
| id              | 是    | id                                       |
| version         | 是    |                                          |
| add_time        | 是    | 添加时间                                     |
| mod_time        | 否    | 修改时间                                     |
| function_name   | 是    | 功能名。由注解ActionMethodDesc的desc定义。          |
| function_url    | 是    | 访问pathInfo                               |
| function_status | 是    | 是否启用。枚举FunctionStatusEnum定义。             |
| description     | 是    | 方法全限定名。${RequestMappingInfo.getPatternsCondition().getPatterns().get(0)}.htm |
| function_type   | 是    | 类型。枚举FunctionTypeEnum定义。                 |
| keyword         | 是    | 模块名。由注解ActionDesc的属性desc定义。              |
| client_id       | 是    | 应用id                                     |

#### 返回结果

正确返回

```json
{successful:true, result:null, msg:""}
```

失败返回

```json
{successful:false, result:null, msg: "错误信息"}
```

