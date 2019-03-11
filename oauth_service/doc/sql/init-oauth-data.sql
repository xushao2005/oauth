USE `cmhb-oauth2`;

#  用户
INSERT INTO TC_SYS_USER (ID, VERSION, ADD_TIME, MOD_TIME, LOGINNAME, USERNAME, PASSWORD, USERSTATUS, EMAIL, ISSUPERADMIN, ISADMIN, PWDERRORNUMS, PRIMARYDEPARTMENTID, MOBILE, CREATOR_ID, LAST_LOGIN_TIME, USER_TYPE, WORKLOAD, APP_ID)
VALUES ('201607141412361691577571', 20, '2016-07-14 14:12:35', '2016-11-01 17:02:44', 'admin', '系统管理员',
                                    'e10adc3949ba59abbe56e057f20f883e', 'ACTIVE', '', '1', '0', 0, NULL, NULL, NULL,
        NULL, NULL, NULL, '34ed5259-9f3e-4fdc-b971-debe4bdbf8c7feff8');

#  角色
INSERT INTO TC_SYS_ROLE (ID, VERSION, ADD_TIME, MOD_TIME, ROLENAME, DESCRIPTION, ROLESTATUS, ROLETYPE, DEPARTMENTID)
VALUES ('201610261743511354363037', 216, '2016-10-26 17:43:50.337', '2017-07-04 14:48:15.117', '系统管理员隐含角色', '系统管理员隐含角色',
        'ACTIVE', 'SYSADMIN', NULL);
INSERT INTO TC_SYS_ROLE (ID, VERSION, ADD_TIME, MOD_TIME, ROLENAME, DESCRIPTION, ROLESTATUS, ROLETYPE, DEPARTMENTID)
VALUES
  ('201610271035540521912982', 0, '2016-10-27 10:35:51.600', '2017-05-12 10:20:10.373', '操作员隐含角色', '操作员隐含角色', 'ACTIVE',
   'DEPTADMIN', NULL);
INSERT INTO TC_SYS_ROLE (ID, VERSION, ADD_TIME, MOD_TIME, ROLENAME, DESCRIPTION, ROLESTATUS, ROLETYPE, DEPARTMENTID)
VALUES ('201610271037450850870943', 0, '2016-10-27 10:37:42.620', '2017-05-12 10:25:12.120', '部门管理员隐含角色', '部门管理员隐含角色',
        'ACTIVE', 'DEPTADMIN', NULL);

# 功能权限
INSERT INTO TC_SYS_FUNCTION (ID, FUNCTIONNAME, FUNCTIONURL, FUNCTIONSTATUS, DESCRIPTION, FUNCTIONTYPE, KEYWORD, client_id)
VALUES ('201705121014270910105022', '部门管理-删除部门', '/dept/deleteDepartment.htm', 'ACTIVE',
        '/dept/deleteDepartment->public void com.cmhb.cmcc.security.web.action.DepartmentAction.checkCode(java.lang.String,java.io.PrintWriter)',
        'DEPARTMENT_PUBLIC', '基础用户权限管理-部门管理', 0);
INSERT INTO TC_SYS_FUNCTION (ID, FUNCTIONNAME, FUNCTIONURL, FUNCTIONSTATUS, DESCRIPTION, FUNCTIONTYPE, KEYWORD, client_id)
VALUES ('201705121014281730972670', '用户管理-校验登录名是否唯一', '/userentity/checkname.htm', 'ACTIVE',
        '/userentity/checkname->public void com.cmhb.cmcc.security.web.action.UserEntityAction.checkName(java.lang.String,java.lang.String,java.io.PrintWriter)',
        'DEPARTMENT_PUBLIC', '基础用户权限管理-用户管理', 0);
INSERT INTO TC_SYS_FUNCTION (ID, FUNCTIONNAME, FUNCTIONURL, FUNCTIONSTATUS, DESCRIPTION, FUNCTIONTYPE, KEYWORD, client_id)
VALUES ('201705121014281546596829', '操作员管理-编辑操作员操作', '/userentity/doedit.htm', 'ACTIVE',
        '/userentity/doedit->public java.lang.String com.cmhb.cmcc.security.web.action.UserEntityAction.doEdit(com.cmhb.cmcc.security.domain.UserEntity,com.cmhb.cmcc.security.web.model.RefreshFuncTreeModel,javax.servlet.http.HttpSession,org.springframework.ui.Model)',
        'DEPARTMENT_PUBLIC', '基础用户权限管理-用户管理', 0);
INSERT INTO TC_SYS_FUNCTION (ID, FUNCTIONNAME, FUNCTIONURL, FUNCTIONSTATUS, DESCRIPTION, FUNCTIONTYPE, KEYWORD, client_id)
VALUES ('201705121014280225622769', '操作员管理-编辑操作员页面', '/userentity/toedit.htm', 'ACTIVE',
        '/userentity/toedit->public java.lang.String com.cmhb.cmcc.security.web.action.UserEntityAction.toEdit(java.lang.String,org.springframework.ui.Model,javax.servlet.http.HttpSession)',
        'DEPARTMENT_PUBLIC', '基础用户权限管理-用户管理', 0);
INSERT INTO TC_SYS_FUNCTION (ID, FUNCTIONNAME, FUNCTIONURL, FUNCTIONSTATUS, DESCRIPTION, FUNCTIONTYPE, KEYWORD, client_id)
VALUES ('201705121014281208214670', '操作员管理-新增操作员页面', '/userentity/toadd.htm', 'ACTIVE',
        '/userentity/toadd->public java.lang.String com.cmhb.cmcc.security.web.action.UserEntityAction.toAdd(org.springframework.ui.Model,javax.servlet.http.HttpSession)',
        'DEPARTMENT_PUBLIC', '基础用户权限管理-用户管理', 0);
INSERT INTO TC_SYS_FUNCTION (ID, FUNCTIONNAME, FUNCTIONURL, FUNCTIONSTATUS, DESCRIPTION, FUNCTIONTYPE, KEYWORD, client_id)
VALUES ('201705121014282143651238', '操作员管理-新增操作员操作', '/userentity/doadd.htm', 'ACTIVE',
        '/userentity/doadd->public java.lang.String com.cmhb.cmcc.security.web.action.UserEntityAction.doAdd(com.cmhb.cmcc.security.domain.UserEntity,com.cmhb.cmcc.security.web.model.RefreshFuncTreeModel,javax.servlet.http.HttpSession,org.springframework.ui.Model)',
        'DEPARTMENT_PUBLIC', '基础用户权限管理-用户管理', 0);
INSERT INTO TC_SYS_FUNCTION (ID, FUNCTIONNAME, FUNCTIONURL, FUNCTIONSTATUS, DESCRIPTION, FUNCTIONTYPE, KEYWORD, client_id)
VALUES ('201705121014280081294426', '操作员管理-操作员列表页', '/userentity/listoperator.htm', 'ACTIVE',
        '/userentity/listoperator->public java.lang.String com.cmhb.cmcc.security.web.action.UserEntityAction.listOperator(com.cmhb.cmcc.security.web.model.UserEntityModel,com.cmhb.cmcc.core.dao.page.PageInfo,javax.servlet.http.HttpSession,org.springframework.ui.Model)',
        'DEPARTMENT_PUBLIC', '基础用户权限管理-用户管理', 0);
INSERT INTO TC_SYS_FUNCTION (ID, FUNCTIONNAME, FUNCTIONURL, FUNCTIONSTATUS, DESCRIPTION, FUNCTIONTYPE, KEYWORD, client_id)
VALUES ('201705121014282095998261', '部门管理员管理-编辑部门管理员页面', '/userentity/toeditdeptadmin.htm', 'ACTIVE',
        '/userentity/toeditdeptadmin->public java.lang.String com.cmhb.cmcc.security.web.action.UserEntityAction.toEditDeptAdmin(java.lang.String,org.springframework.ui.Model,javax.servlet.http.HttpSession)',
        'DEPARTMENT_PUBLIC', '基础用户权限管理-用户管理', 0);
INSERT INTO TC_SYS_FUNCTION (ID, FUNCTIONNAME, FUNCTIONURL, FUNCTIONSTATUS, DESCRIPTION, FUNCTIONTYPE, KEYWORD, client_id)
VALUES ('201705121014281057748238', '部门管理员管理-新增部门管理员选择部门页面', '/userentity/toselectdept.htm', 'ACTIVE',
        '/userentity/toselectdept->public java.lang.String com.cmhb.cmcc.security.web.action.UserEntityAction.selectDept(org.springframework.ui.Model)',
        'DEPARTMENT_PUBLIC', '基础用户权限管理-用户管理', 0);
INSERT INTO TC_SYS_FUNCTION (ID, FUNCTIONNAME, FUNCTIONURL, FUNCTIONSTATUS, DESCRIPTION, FUNCTIONTYPE, KEYWORD, client_id)
VALUES ('201705121014281240919822', '用户管理-删除用户', '/userentity/deleteUser.htm', 'ACTIVE',
        '/userentity/deleteUser->public void com.cmhb.cmcc.security.web.action.UserEntityAction.deleteUser(java.lang.String,javax.servlet.http.HttpSession,java.io.PrintWriter)',
        'DEPARTMENT_PUBLIC', '基础用户权限管理-用户管理', 0);
INSERT INTO TC_SYS_FUNCTION (ID, FUNCTIONNAME, FUNCTIONURL, FUNCTIONSTATUS, DESCRIPTION, FUNCTIONTYPE, KEYWORD, client_id)
VALUES ('201705121014281526318880', '部门管理员管理-新增部门管理员页面', '/userentity/toadddeptadmin.htm', 'ACTIVE',
        '/userentity/toadddeptadmin->public java.lang.String com.cmhb.cmcc.security.web.action.UserEntityAction.toAddDeptAdmin(java.lang.String,org.springframework.ui.Model,javax.servlet.http.HttpSession)',
        'DEPARTMENT_PUBLIC', '基础用户权限管理-用户管理', 0);
INSERT INTO TC_SYS_FUNCTION (ID, FUNCTIONNAME, FUNCTIONURL, FUNCTIONSTATUS, DESCRIPTION, FUNCTIONTYPE, KEYWORD, client_id)
VALUES ('201705121014290188622085', '部门管理员管理-新增部门管理员操作', '/userentity/doadddeptadmin.htm', 'ACTIVE',
        '/userentity/doadddeptadmin->public java.lang.String com.cmhb.cmcc.security.web.action.UserEntityAction.doAddDeptAdmin(com.cmhb.cmcc.security.domain.UserEntity,com.cmhb.cmcc.security.web.model.RefreshFuncTreeModel,javax.servlet.http.HttpSession,org.springframework.ui.Model)',
        'DEPARTMENT_PUBLIC', '基础用户权限管理-用户管理', 0);
INSERT INTO TC_SYS_FUNCTION (ID, FUNCTIONNAME, FUNCTIONURL, FUNCTIONSTATUS, DESCRIPTION, FUNCTIONTYPE, KEYWORD, client_id)
VALUES ('201705121014291288441411', '部门管理员管理-编辑部门管理员操作', '/userentity/doeditdeptadmin.htm', 'ACTIVE',
        '/userentity/doeditdeptadmin->public java.lang.String com.cmhb.cmcc.security.web.action.UserEntityAction.doEditDeptAdmin(com.cmhb.cmcc.security.domain.UserEntity,com.cmhb.cmcc.security.web.model.RefreshFuncTreeModel,javax.servlet.http.HttpSession,org.springframework.ui.Model)',
        'DEPARTMENT_PUBLIC', '基础用户权限管理-用户管理', 0);
INSERT INTO TC_SYS_FUNCTION (ID, FUNCTIONNAME, FUNCTIONURL, FUNCTIONSTATUS, DESCRIPTION, FUNCTIONTYPE, KEYWORD, client_id)
VALUES ('201705121014290803048307', '部门管理员管理-部门管理员列表页', '/userentity/listdeptadmin.htm', 'ACTIVE',
        '/userentity/listdeptadmin->public java.lang.String com.cmhb.cmcc.security.web.action.UserEntityAction.listDeptAdmin(com.cmhb.cmcc.security.web.model.UserEntityModel,com.cmhb.cmcc.core.dao.page.PageInfo,org.springframework.ui.Model)',
        'DEPARTMENT_PUBLIC', '基础用户权限管理-用户管理', 0);
INSERT INTO TC_SYS_FUNCTION (ID, FUNCTIONNAME, FUNCTIONURL, FUNCTIONSTATUS, DESCRIPTION, FUNCTIONTYPE, KEYWORD, client_id)
VALUES ('201705121014291567274840', '用户管理-系统管理员列表页', '/userentity/listsysadmin.htm', 'ACTIVE',
        '/userentity/listsysadmin->public java.lang.String com.cmhb.cmcc.security.web.action.UserEntityAction.listSysAdmin(com.cmhb.cmcc.security.web.model.UserEntityModel,com.cmhb.cmcc.core.dao.page.PageInfo,org.springframework.ui.Model)',
        'DEPARTMENT_PUBLIC', '基础用户权限管理-用户管理', 0);
INSERT INTO TC_SYS_FUNCTION (ID, FUNCTIONNAME, FUNCTIONURL, FUNCTIONSTATUS, DESCRIPTION, FUNCTIONTYPE, KEYWORD, client_id)
VALUES ('201610261622041082032320', '部门管理-校验部门名称是否唯一', '/dept/checkname.htm', 'ACTIVE',
        '/dept/checkname->public void com.cmhb.cmcc.security.web.action.DepartmentAction.checkName(java.lang.String,java.lang.String,java.io.PrintWriter)',
        'DEPARTMENT_PUBLIC', '基础用户权限管理-部门管理', 0);
INSERT INTO TC_SYS_FUNCTION (ID, FUNCTIONNAME, FUNCTIONURL, FUNCTIONSTATUS, DESCRIPTION, FUNCTIONTYPE, KEYWORD, client_id)
VALUES ('201610261622041691124817', '部门管理-新增页面', '/dept/toadd.htm', 'ACTIVE',
        '/dept/toadd->public java.lang.String com.cmhb.cmcc.security.web.action.DepartmentAction.toAdd(org.springframework.ui.Model)',
        'DEPARTMENT_PUBLIC', '基础用户权限管理-部门管理', 0);
INSERT INTO TC_SYS_FUNCTION (ID, FUNCTIONNAME, FUNCTIONURL, FUNCTIONSTATUS, DESCRIPTION, FUNCTIONTYPE, KEYWORD, client_id)
VALUES ('201610261622041659709808', '部门管理-查询页面', '/dept/list.htm', 'ACTIVE',
        '/dept/list->public java.lang.String com.cmhb.cmcc.security.web.action.DepartmentAction.listDept(com.cmhb.cmcc.security.web.model.DeptModel,com.cmhb.cmcc.core.dao.page.Page,org.springframework.ui.Model)',
        'DEPARTMENT_PUBLIC', '基础用户权限管理-部门管理', 0);
INSERT INTO TC_SYS_FUNCTION (ID, FUNCTIONNAME, FUNCTIONURL, FUNCTIONSTATUS, DESCRIPTION, FUNCTIONTYPE, KEYWORD, client_id)
VALUES ('201610261622041341430937', '部门管理-新增操作', '/dept/doadd.htm', 'ACTIVE',
        '/dept/doadd->public java.lang.String com.cmhb.cmcc.security.web.action.DepartmentAction.doAdd(com.cmhb.cmcc.security.domain.DepartmentEntity,org.springframework.ui.Model)',
        'DEPARTMENT_PUBLIC', '基础用户权限管理-部门管理', 0);
INSERT INTO TC_SYS_FUNCTION (ID, FUNCTIONNAME, FUNCTIONURL, FUNCTIONSTATUS, DESCRIPTION, FUNCTIONTYPE, KEYWORD, client_id)
VALUES ('201705121014290537131153', '用户管理-页面AJAX刷新功能列表树', '/userentity/refreshfunctree.htm', 'ACTIVE',
        '/userentity/refreshfunctree->public void com.cmhb.cmcc.security.web.action.UserEntityAction.refreshFuncTree(com.cmhb.cmcc.security.web.model.RefreshFuncTreeModel,javax.servlet.http.HttpSession,java.io.PrintWriter,javax.servlet.http.HttpServletRequest,javax.servlet.http.HttpServletResponse)',
        'DEPARTMENT_PUBLIC', '基础用户权限管理-用户管理', 0);
INSERT INTO TC_SYS_FUNCTION (ID, FUNCTIONNAME, FUNCTIONURL, FUNCTIONSTATUS, DESCRIPTION, FUNCTIONTYPE, KEYWORD, client_id)
VALUES ('201610261622040390808677', '部门管理-编辑页面', '/dept/toedit.htm', 'ACTIVE',
        '/dept/toedit->public java.lang.String com.cmhb.cmcc.security.web.action.DepartmentAction.toEdit(java.lang.String,org.springframework.ui.Model)',
        'DEPARTMENT_PUBLIC', '基础用户权限管理-部门管理', 0);
INSERT INTO TC_SYS_FUNCTION (ID, FUNCTIONNAME, FUNCTIONURL, FUNCTIONSTATUS, DESCRIPTION, FUNCTIONTYPE, KEYWORD, client_id)
VALUES ('201610261622041240974078', '部门管理-编辑操作', '/dept/doedit.htm', 'ACTIVE',
        '/dept/doedit->public java.lang.String com.cmhb.cmcc.security.web.action.DepartmentAction.doEdit(com.cmhb.cmcc.security.domain.DepartmentEntity,org.springframework.ui.Model)',
        'DEPARTMENT_PUBLIC', '基础用户权限管理-部门管理', 0);
INSERT INTO TC_SYS_FUNCTION (ID, FUNCTIONNAME, FUNCTIONURL, FUNCTIONSTATUS, DESCRIPTION, FUNCTIONTYPE, KEYWORD, client_id)
VALUES ('201610261622041138126399', '部门管理-校验部门编码是否唯一', '/dept/checkcode.htm', 'ACTIVE',
        '/dept/checkcode->public void com.cmhb.cmcc.security.web.action.DepartmentAction.checkCode(java.lang.String,java.lang.String,java.io.PrintWriter)',
        'DEPARTMENT_PUBLIC', '基础用户权限管理-部门管理', 0);
INSERT INTO TC_SYS_FUNCTION (ID, FUNCTIONNAME, FUNCTIONURL, FUNCTIONSTATUS, DESCRIPTION, FUNCTIONTYPE, KEYWORD, client_id)
VALUES ('201610261622040510733224', '功能管理-校验功能名称是否唯一', '/function/checkname.htm', 'ACTIVE',
        '/function/checkname->public void com.cmhb.cmcc.security.web.action.FunctionAction.checkName(java.lang.String,java.lang.String,java.io.PrintWriter)',
        'DEPARTMENT_PUBLIC', '基础用户权限管理-功能管理', 0);
INSERT INTO TC_SYS_FUNCTION (ID, FUNCTIONNAME, FUNCTIONURL, FUNCTIONSTATUS, DESCRIPTION, FUNCTIONTYPE, KEYWORD, client_id)
VALUES ('201610261622040366783199', '功能管理-功能列表页', '/function/list.htm', 'ACTIVE',
        '/function/list->public java.lang.String com.cmhb.cmcc.security.web.action.FunctionAction.list(com.cmhb.cmcc.security.web.model.FunctionModel,com.cmhb.cmcc.core.dao.page.Page,org.springframework.ui.Model)',
        'DEPARTMENT_PUBLIC', '基础用户权限管理-功能管理', 0);
INSERT INTO TC_SYS_FUNCTION (ID, FUNCTIONNAME, FUNCTIONURL, FUNCTIONSTATUS, DESCRIPTION, FUNCTIONTYPE, KEYWORD, client_id)
VALUES ('201610261622041907154142', '功能管理-新增功能页面', '/function/toadd.htm', 'ACTIVE',
        '/function/toadd->public java.lang.String com.cmhb.cmcc.security.web.action.FunctionAction.toAdd(org.springframework.ui.Model)',
        'DEPARTMENT_PUBLIC', '基础用户权限管理-功能管理', 0);
INSERT INTO TC_SYS_FUNCTION (ID, FUNCTIONNAME, FUNCTIONURL, FUNCTIONSTATUS, DESCRIPTION, FUNCTIONTYPE, KEYWORD, client_id)
VALUES ('201610261622041676071556', '功能管理-新增功能操作', '/function/doadd.htm', 'ACTIVE',
        '/function/doadd->public java.lang.String com.cmhb.cmcc.security.web.action.FunctionAction.doAdd(com.cmhb.cmcc.security.domain.FunctionEntity,java.lang.String,org.springframework.ui.Model,javax.servlet.http.HttpSession)',
        'DEPARTMENT_PUBLIC', '基础用户权限管理-功能管理', 0);
INSERT INTO TC_SYS_FUNCTION (ID, FUNCTIONNAME, FUNCTIONURL, FUNCTIONSTATUS, DESCRIPTION, FUNCTIONTYPE, KEYWORD, client_id)
VALUES ('201610261622040966263878', '功能管理-编辑功能页面', '/function/toedit.htm', 'ACTIVE',
        '/function/toedit->public java.lang.String com.cmhb.cmcc.security.web.action.FunctionAction.toEdit(java.lang.String,org.springframework.ui.Model)',
        'DEPARTMENT_PUBLIC', '基础用户权限管理-功能管理', 0);
INSERT INTO TC_SYS_FUNCTION (ID, FUNCTIONNAME, FUNCTIONURL, FUNCTIONSTATUS, DESCRIPTION, FUNCTIONTYPE, KEYWORD, client_id)
VALUES ('201610261622051653448464', '功能管理-编辑功能操作', '/function/doedit.htm', 'ACTIVE',
        '/function/doedit->public java.lang.String com.cmhb.cmcc.security.web.action.FunctionAction.doEdit(com.cmhb.cmcc.security.domain.FunctionEntity,java.lang.String,org.springframework.ui.Model)',
        'DEPARTMENT_PUBLIC', '基础用户权限管理-功能管理', 0);
INSERT INTO TC_SYS_FUNCTION (ID, FUNCTIONNAME, FUNCTIONURL, FUNCTIONSTATUS, DESCRIPTION, FUNCTIONTYPE, KEYWORD, client_id)
VALUES ('201610261622050742225463', '功能管理-校验功能URL是否唯一', '/function/checkurl.htm', 'ACTIVE',
        '/function/checkurl->public void com.cmhb.cmcc.security.web.action.FunctionAction.checkUrl(java.lang.String,java.lang.String,java.io.PrintWriter)',
        'DEPARTMENT_PUBLIC', '基础用户权限管理-功能管理', 0);
INSERT INTO TC_SYS_FUNCTION (ID, FUNCTIONNAME, FUNCTIONURL, FUNCTIONSTATUS, DESCRIPTION, FUNCTIONTYPE, KEYWORD, client_id)
VALUES ('201610261622050596659510', '角色管理-校验角色名称是否唯一', '/role/checkname.htm', 'ACTIVE',
        '/role/checkname->public void com.cmhb.cmcc.security.web.action.RoleAction.checkName(java.lang.String,java.lang.String,java.io.PrintWriter)',
        'DEPARTMENT_PUBLIC', '基础用户权限管理-角色管理', 0);
INSERT INTO TC_SYS_FUNCTION (ID, FUNCTIONNAME, FUNCTIONURL, FUNCTIONSTATUS, DESCRIPTION, FUNCTIONTYPE, KEYWORD, client_id)
VALUES ('201610261622050333371625', '角色管理-角色列表页', '/role/list.htm', 'ACTIVE',
        '/role/list->public java.lang.String com.cmhb.cmcc.security.web.action.RoleAction.list(com.cmhb.cmcc.security.web.model.RoleModel,com.cmhb.cmcc.core.dao.page.Page,org.springframework.ui.Model,javax.servlet.http.HttpSession)',
        'DEPARTMENT_PUBLIC', '基础用户权限管理-角色管理', 0);
INSERT INTO TC_SYS_FUNCTION (ID, FUNCTIONNAME, FUNCTIONURL, FUNCTIONSTATUS, DESCRIPTION, FUNCTIONTYPE, KEYWORD, client_id)
VALUES ('201610261622050628115536', '角色管理-角色新增页面', '/role/toadd.htm', 'ACTIVE',
        '/role/toadd->public java.lang.String com.cmhb.cmcc.security.web.action.RoleAction.toAdd(org.springframework.ui.Model,javax.servlet.http.HttpSession)',
        'DEPARTMENT_PUBLIC', '基础用户权限管理-角色管理', 0);
INSERT INTO TC_SYS_FUNCTION (ID, FUNCTIONNAME, FUNCTIONURL, FUNCTIONSTATUS, DESCRIPTION, FUNCTIONTYPE, KEYWORD, client_id)
VALUES ('201610261622050536257933', '角色管理-角色新增操作', '/role/doadd.htm', 'ACTIVE',
        '/role/doadd->public java.lang.String com.cmhb.cmcc.security.web.action.RoleAction.doAdd(com.cmhb.cmcc.security.domain.RoleEntity,org.springframework.ui.Model,javax.servlet.http.HttpSession)',
        'DEPARTMENT_PUBLIC', '基础用户权限管理-角色管理', 0);
INSERT INTO TC_SYS_FUNCTION (ID, FUNCTIONNAME, FUNCTIONURL, FUNCTIONSTATUS, DESCRIPTION, FUNCTIONTYPE, KEYWORD, client_id)
VALUES ('201610261622050459110715', '角色管理-角色编辑页面', '/role/toedit.htm', 'ACTIVE',
        '/role/toedit->public java.lang.String com.cmhb.cmcc.security.web.action.RoleAction.toEdit(java.lang.String,org.springframework.ui.Model,javax.servlet.http.HttpSession)',
        'DEPARTMENT_PUBLIC', '基础用户权限管理-角色管理', 0);
INSERT INTO TC_SYS_FUNCTION (ID, FUNCTIONNAME, FUNCTIONURL, FUNCTIONSTATUS, DESCRIPTION, FUNCTIONTYPE, KEYWORD, client_id)
VALUES ('201610261622050916808757', '角色管理-角色编辑操作', '/role/doedit.htm', 'ACTIVE',
        '/role/doedit->public java.lang.String com.cmhb.cmcc.security.web.action.RoleAction.doEdit(com.cmhb.cmcc.security.domain.RoleEntity,org.springframework.ui.Model,javax.servlet.http.HttpSession)',
        'DEPARTMENT_PUBLIC', '基础用户权限管理-角色管理', 0);
INSERT INTO TC_SYS_FUNCTION (ID, FUNCTIONNAME, FUNCTIONURL, FUNCTIONSTATUS, DESCRIPTION, FUNCTIONTYPE, KEYWORD, client_id)
VALUES ('201610261622061901391534', '角色管理-角色删除操作', '/role/deleteRole.htm', 'ACTIVE',
        '/role/deleteRole->public void com.cmhb.cmcc.security.web.action.RoleAction.deleteUser(java.lang.String,javax.servlet.http.HttpSession,java.io.PrintWriter)',
        'DEPARTMENT_PUBLIC', '基础用户权限管理-角色管理', 0);
INSERT INTO TC_SYS_FUNCTION (ID, FUNCTIONNAME, FUNCTIONURL, FUNCTIONSTATUS, DESCRIPTION, FUNCTIONTYPE, KEYWORD, client_id)
VALUES ('201706201156131201600248', '应用管理-新增应用', '/client/add.htm', 'ACTIVE',
				'/client/add->public java.lang.String com.cmhb.module.oauth2.controller.Oauth2ClientController.add(com.cmhb.module.oauth2.model.ClientModel)',
				'DEPARTMENT_PUBLIC', '基础用户权限管理-应用管理', 0);
INSERT INTO TC_SYS_FUNCTION (ID, FUNCTIONNAME, FUNCTIONURL, FUNCTIONSTATUS, DESCRIPTION, FUNCTIONTYPE, KEYWORD, client_id)
VALUES ('201706201156131610866685', '应用管理-删除应用', '/client/delete.htm', 'ACTIVE',
				'/client/delete->public java.lang.String com.cmhb.module.oauth2.controller.Oauth2ClientController.delete(java.lang.Long)',
				'DEPARTMENT_PUBLIC', '基础用户权限管理-应用管理', 0);
INSERT INTO TC_SYS_FUNCTION (ID, FUNCTIONNAME, FUNCTIONURL, FUNCTIONSTATUS, DESCRIPTION, FUNCTIONTYPE, KEYWORD, client_id)
VALUES ('201706201156130009389912', '应用管理-新增应用页面', '/client/addPage.htm', 'ACTIVE',
				'/client/addPage->public java.lang.String com.cmhb.module.oauth2.controller.Oauth2ClientController.addPage()',
				'DEPARTMENT_PUBLIC', '基础用户权限管理-应用管理', 0);
INSERT INTO TC_SYS_FUNCTION (ID, FUNCTIONNAME, FUNCTIONURL, FUNCTIONSTATUS, DESCRIPTION, FUNCTIONTYPE, KEYWORD, client_id)
VALUES ('201706201156130728239006', '应用管理-应用列表页', '/client/list.htm', 'ACTIVE',
				'/client/list->public java.lang.String com.cmhb.module.oauth2.controller.Oauth2ClientController.pageList(com.cmhb.module.oauth2.model.ClientModel,com.cmhb.common.mybatisplus.PageInfo,org.springframework.ui.Model)',
				'DEPARTMENT_PUBLIC', '基础用户权限管理-应用管理', 0);
INSERT INTO TC_SYS_FUNCTION (ID, FUNCTIONNAME, FUNCTIONURL, FUNCTIONSTATUS, DESCRIPTION, FUNCTIONTYPE, KEYWORD, client_id)
VALUES ('201706201156130729841346', '应用管理-更新应用', '/client/update.htm', 'ACTIVE',
				'/client/update->public java.lang.String com.cmhb.module.oauth2.controller.Oauth2ClientController.edit(com.cmhb.module.oauth2.model.ClientModel)',
				'DEPARTMENT_PUBLIC', '基础用户权限管理-应用管理', 0);
INSERT INTO TC_SYS_FUNCTION (ID, FUNCTIONNAME, FUNCTIONURL, FUNCTIONSTATUS, DESCRIPTION, FUNCTIONTYPE, KEYWORD, client_id)
VALUES ('201706201156141964982376', '应用管理-修改应用页面', '/client/editPage.htm', 'ACTIVE',
				'/client/editPage->public java.lang.String com.cmhb.module.oauth2.controller.Oauth2ClientController.editPage(java.lang.Long,org.springframework.ui.Model)',
				'DEPARTMENT_PUBLIC', '基础用户权限管理-应用管理', 0);
INSERT INTO TC_SYS_FUNCTION (ID, FUNCTIONNAME, FUNCTIONURL, FUNCTIONSTATUS, DESCRIPTION, FUNCTIONTYPE, KEYWORD, client_id)
VALUES ('201706201156141467074608', '/userentity/user/ownClients/add', '/userentity/user/ownClients/add.htm', 'ACTIVE',
        '/userentity/user/ownClients/add->public java.lang.String com.cmhb.security.web.action.UserEntityAction.addOwnClient(java.lang.String,java.lang.Long)',
        'DEPARTMENT_PUBLIC', '基础用户权限管理-用户管理', 0);
INSERT INTO TC_SYS_FUNCTION (ID, FUNCTIONNAME, FUNCTIONURL, FUNCTIONSTATUS, DESCRIPTION, FUNCTIONTYPE, KEYWORD, client_id)
VALUES ('201706201156140986507844', '/userentity/user/ownClients', '/userentity/user/ownClients.htm', 'ACTIVE',
        '/userentity/user/ownClients->public java.lang.String com.cmhb.security.web.action.UserEntityAction.ownClients(java.lang.String,org.springframework.ui.Model)',
        'DEPARTMENT_PUBLIC', '基础用户权限管理-用户管理', 0);
INSERT INTO TC_SYS_FUNCTION (ID, FUNCTIONNAME, FUNCTIONURL, FUNCTIONSTATUS, DESCRIPTION, FUNCTIONTYPE, KEYWORD, client_id)
VALUES
  ('201706201156141238587010', '/userentity/user/ownClients/delete', '/userentity/user/ownClients/delete.htm', 'ACTIVE',
   '/userentity/user/ownClients/delete->public java.lang.String com.cmhb.security.web.action.UserEntityAction.deleteOwnClient(java.lang.String,java.lang.Long)',
   'DEPARTMENT_PUBLIC', '基础用户权限管理-用户管理', 0);

#  系统管理员隐含角色增加基础权限管理权限
INSERT INTO TC_SYS_ROLE_FUNCTION (ID, VERSION, ADD_TIME, MOD_TIME, ROLEID, FUNCTIONID)
VALUES ('201707070924580072836236', 0, now(), now(), '201610261743511354363037', '201610261622041691124817');
INSERT INTO TC_SYS_ROLE_FUNCTION (ID, VERSION, ADD_TIME, MOD_TIME, ROLEID, FUNCTIONID)
VALUES ('201707070924580141571987', 0, now(), now(), '201610261743511354363037', '201610261622041341430937');
INSERT INTO TC_SYS_ROLE_FUNCTION (ID, VERSION, ADD_TIME, MOD_TIME, ROLEID, FUNCTIONID)
VALUES ('201707070924580919156171', 0, now(), now(), '201610261743511354363037', '201610261622041082032320');
INSERT INTO TC_SYS_ROLE_FUNCTION (ID, VERSION, ADD_TIME, MOD_TIME, ROLEID, FUNCTIONID)
VALUES ('201707070924581539748680', 0, now(), now(), '201610261743511354363037', '201610261622041138126399');
INSERT INTO TC_SYS_ROLE_FUNCTION (ID, VERSION, ADD_TIME, MOD_TIME, ROLEID, FUNCTIONID)
VALUES ('201707070924581593191344', 0, now(), now(), '201610261743511354363037', '201705121014270910105022');
INSERT INTO TC_SYS_ROLE_FUNCTION (ID, VERSION, ADD_TIME, MOD_TIME, ROLEID, FUNCTIONID)
VALUES ('201707070924581507994114', 0, now(), now(), '201610261743511354363037', '201610261622041659709808');
INSERT INTO TC_SYS_ROLE_FUNCTION (ID, VERSION, ADD_TIME, MOD_TIME, ROLEID, FUNCTIONID)
VALUES ('201707070924580828016957', 0, now(), now(), '201610261743511354363037', '201610261622040390808677');
INSERT INTO TC_SYS_ROLE_FUNCTION (ID, VERSION, ADD_TIME, MOD_TIME, ROLEID, FUNCTIONID)
VALUES ('201707070924581433563520', 0, now(), now(), '201610261743511354363037', '201610261622041240974078');
INSERT INTO TC_SYS_ROLE_FUNCTION (ID, VERSION, ADD_TIME, MOD_TIME, ROLEID, FUNCTIONID)
VALUES ('201707070924580800757861', 0, now(), now(), '201610261743511354363037', '201610261622050596659510');
INSERT INTO TC_SYS_ROLE_FUNCTION (ID, VERSION, ADD_TIME, MOD_TIME, ROLEID, FUNCTIONID)
VALUES ('201707070924580805206808', 0, now(), now(), '201610261743511354363037', '201610261622050628115536');
INSERT INTO TC_SYS_ROLE_FUNCTION (ID, VERSION, ADD_TIME, MOD_TIME, ROLEID, FUNCTIONID)
VALUES ('201707070924580472236602', 0, now(), now(), '201610261743511354363037', '201610261622050536257933');
INSERT INTO TC_SYS_ROLE_FUNCTION (ID, VERSION, ADD_TIME, MOD_TIME, ROLEID, FUNCTIONID)
VALUES ('201707070924582097609494', 0, now(), now(), '201610261743511354363037', '201610261622061901391534');
INSERT INTO TC_SYS_ROLE_FUNCTION (ID, VERSION, ADD_TIME, MOD_TIME, ROLEID, FUNCTIONID)
VALUES ('201707070924581332429480', 0, now(), now(), '201610261743511354363037', '201610261622050333371625');
INSERT INTO TC_SYS_ROLE_FUNCTION (ID, VERSION, ADD_TIME, MOD_TIME, ROLEID, FUNCTIONID)
VALUES ('201707070924581406024856', 0, now(), now(), '201610261743511354363037', '201610261622050459110715');
INSERT INTO TC_SYS_ROLE_FUNCTION (ID, VERSION, ADD_TIME, MOD_TIME, ROLEID, FUNCTIONID)
VALUES ('201707070924582130838614', 0, now(), now(), '201610261743511354363037', '201610261622050916808757');
INSERT INTO TC_SYS_ROLE_FUNCTION (ID, VERSION, ADD_TIME, MOD_TIME, ROLEID, FUNCTIONID)
VALUES ('201707070924582129565875', 0, now(), now(), '201610261743511354363037', '201705121014290537131153');
INSERT INTO TC_SYS_ROLE_FUNCTION (ID, VERSION, ADD_TIME, MOD_TIME, ROLEID, FUNCTIONID)
VALUES ('201707070924581249907442', 0, now(), now(), '201610261743511354363037', '201705121014281730972670');
INSERT INTO TC_SYS_ROLE_FUNCTION (ID, VERSION, ADD_TIME, MOD_TIME, ROLEID, FUNCTIONID)
VALUES ('201707070924581065977526', 0, now(), now(), '201610261743511354363037', '201705121014291567274840');
INSERT INTO TC_SYS_ROLE_FUNCTION (ID, VERSION, ADD_TIME, MOD_TIME, ROLEID, FUNCTIONID)
VALUES ('201707070924581594012179', 0, now(), now(), '201610261743511354363037', '201705121014281240919822');
INSERT INTO TC_SYS_ROLE_FUNCTION (ID, VERSION, ADD_TIME, MOD_TIME, ROLEID, FUNCTIONID)
VALUES ('201707070924580524716044', 0, now(), now(), '201610261743511354363037', '201705121014281208214670');
INSERT INTO TC_SYS_ROLE_FUNCTION (ID, VERSION, ADD_TIME, MOD_TIME, ROLEID, FUNCTIONID)
VALUES ('201707070924580642426890', 0, now(), now(), '201610261743511354363037', '201705121014282143651238');
INSERT INTO TC_SYS_ROLE_FUNCTION (ID, VERSION, ADD_TIME, MOD_TIME, ROLEID, FUNCTIONID)
VALUES ('201707070924581390216665', 0, now(), now(), '201610261743511354363037', '201705121014280081294426');
INSERT INTO TC_SYS_ROLE_FUNCTION (ID, VERSION, ADD_TIME, MOD_TIME, ROLEID, FUNCTIONID)
VALUES ('201707070924580643414961', 0, now(), now(), '201610261743511354363037', '201705121014280225622769');
INSERT INTO TC_SYS_ROLE_FUNCTION (ID, VERSION, ADD_TIME, MOD_TIME, ROLEID, FUNCTIONID)
VALUES ('201707070924580677961323', 0, now(), now(), '201610261743511354363037', '201705121014281546596829');
INSERT INTO TC_SYS_ROLE_FUNCTION (ID, VERSION, ADD_TIME, MOD_TIME, ROLEID, FUNCTIONID)
VALUES ('201707070924581370188981', 0, now(), now(), '201610261743511354363037', '201705121014281526318880');
INSERT INTO TC_SYS_ROLE_FUNCTION (ID, VERSION, ADD_TIME, MOD_TIME, ROLEID, FUNCTIONID)
VALUES ('201707070924581063440152', 0, now(), now(), '201610261743511354363037', '201705121014281057748238');
INSERT INTO TC_SYS_ROLE_FUNCTION (ID, VERSION, ADD_TIME, MOD_TIME, ROLEID, FUNCTIONID)
VALUES ('201707070924581196251023', 0, now(), now(), '201610261743511354363037', '201705121014290188622085');
INSERT INTO TC_SYS_ROLE_FUNCTION (ID, VERSION, ADD_TIME, MOD_TIME, ROLEID, FUNCTIONID)
VALUES ('201707070924581615790563', 0, now(), now(), '201610261743511354363037', '201705121014290803048307');
INSERT INTO TC_SYS_ROLE_FUNCTION (ID, VERSION, ADD_TIME, MOD_TIME, ROLEID, FUNCTIONID)
VALUES ('201707070924581068945259', 0, now(), now(), '201610261743511354363037', '201705121014282095998261');
INSERT INTO TC_SYS_ROLE_FUNCTION (ID, VERSION, ADD_TIME, MOD_TIME, ROLEID, FUNCTIONID)
VALUES ('201707070924580302523696', 0, now(), now(), '201610261743511354363037', '201705121014291288441411');
INSERT INTO TC_SYS_ROLE_FUNCTION (ID, VERSION, ADD_TIME, MOD_TIME, ROLEID, FUNCTIONID)
VALUES ('201707070924580273530736', 0, now(), now(), '201610261743511354363037', '201706201156141238587010');
INSERT INTO TC_SYS_ROLE_FUNCTION (ID, VERSION, ADD_TIME, MOD_TIME, ROLEID, FUNCTIONID)
VALUES ('201707070924580168162508', 0, now(), now(), '201610261743511354363037', '201706201156141467074608');
INSERT INTO TC_SYS_ROLE_FUNCTION (ID, VERSION, ADD_TIME, MOD_TIME, ROLEID, FUNCTIONID)
VALUES ('201707070924580014957236', 0, now(), now(), '201610261743511354363037', '201706201156140986507844');
INSERT INTO TC_SYS_ROLE_FUNCTION (ID, VERSION, ADD_TIME, MOD_TIME, ROLEID, FUNCTIONID)
VALUES ('201707070924582088507832', 0, now(), now(), '201610261743511354363037', '201706201156130728239006');
INSERT INTO TC_SYS_ROLE_FUNCTION (ID, VERSION, ADD_TIME, MOD_TIME, ROLEID, FUNCTIONID)
VALUES ('201707070924591334903271', 0, now(), now(), '201610261743511354363037', '201706201156141964982376');
INSERT INTO TC_SYS_ROLE_FUNCTION (ID, VERSION, ADD_TIME, MOD_TIME, ROLEID, FUNCTIONID)
VALUES ('201707070924591813438118', 0, now(), now(), '201610261743511354363037', '201706201156130009389912');
INSERT INTO TC_SYS_ROLE_FUNCTION (ID, VERSION, ADD_TIME, MOD_TIME, ROLEID, FUNCTIONID)
VALUES ('201707070924590913303094', 0, now(), now(), '201610261743511354363037', '201706201156131201600248');
INSERT INTO TC_SYS_ROLE_FUNCTION (ID, VERSION, ADD_TIME, MOD_TIME, ROLEID, FUNCTIONID)
VALUES ('201707070924590946541474', 0, now(), now(), '201610261743511354363037', '201706201156131610866685');
INSERT INTO TC_SYS_ROLE_FUNCTION (ID, VERSION, ADD_TIME, MOD_TIME, ROLEID, FUNCTIONID)
VALUES ('201707070924590731125474', 0, now(), now(), '201610261743511354363037', '201706201156130729841346');
INSERT INTO TC_SYS_ROLE_FUNCTION (ID, VERSION, ADD_TIME, MOD_TIME, ROLEID, FUNCTIONID)
VALUES ('201707070924591124243545', 0, now(), now(), '201610261743511354363037', '201610261622041907154142');
INSERT INTO TC_SYS_ROLE_FUNCTION (ID, VERSION, ADD_TIME, MOD_TIME, ROLEID, FUNCTIONID)
VALUES ('201707070924590113862251', 0, now(), now(), '201610261743511354363037', '201610261622041676071556');
INSERT INTO TC_SYS_ROLE_FUNCTION (ID, VERSION, ADD_TIME, MOD_TIME, ROLEID, FUNCTIONID)
VALUES ('201707070924590145459245', 0, now(), now(), '201610261743511354363037', '201610261622040510733224');
INSERT INTO TC_SYS_ROLE_FUNCTION (ID, VERSION, ADD_TIME, MOD_TIME, ROLEID, FUNCTIONID)
VALUES ('201707070924591708034297', 0, now(), now(), '201610261743511354363037', '201610261622050742225463');
INSERT INTO TC_SYS_ROLE_FUNCTION (ID, VERSION, ADD_TIME, MOD_TIME, ROLEID, FUNCTIONID)
VALUES ('201707070924592144232990', 0, now(), now(), '201610261743511354363037', '201610261622040366783199');
INSERT INTO TC_SYS_ROLE_FUNCTION (ID, VERSION, ADD_TIME, MOD_TIME, ROLEID, FUNCTIONID)
VALUES ('201707070924590115253437', 0, now(), now(), '201610261743511354363037', '201610261622040966263878');
INSERT INTO TC_SYS_ROLE_FUNCTION (ID, VERSION, ADD_TIME, MOD_TIME, ROLEID, FUNCTIONID)
VALUES ('201707070924590658436556', 0, now(), now(), '201610261743511354363037', '201610261622051653448464');

# 用户系统管理员增加系统管理员隐含角色
INSERT INTO TC_SYS_USER_ROLE (ID, VERSION, ADD_TIME, MOD_TIME, USERID, ROLEID) VALUES
  ('1', 1, '2016-10-26 18:18:19.000', '2016-10-26 18:18:23.000', '201607141412361691577571',
   '201610261743511354363037');

#  业务系统
# 允许插入自增字段
# SET IDENTITY_INSERT tc_oauth2_client ON;
INSERT INTO tc_oauth2_client (id, client_name, description, secret, uri, icon, redirect_uri, grant_types, app_id)
VALUES
  (1, 'test1', '测试1', '6d0d5327-88f9-472c-a151-763102d5962a', 'http://127.0.0.1:9080/OAuth2-client/', '1',
   'http://127.0.0.1:9080/OAuth2-client/oauth2-login.htm', 'authorization_code',
   '22d33153-3fa6-4048-98b8-a97d9da5a6db');
INSERT INTO tc_oauth2_client (id, client_name, description, secret, uri, icon, redirect_uri, grant_types, app_id)
VALUES (2, 'cmbc', '主数据中心', '43c4dae6-7e11-4d74-a74a-e2da77c79b18', 'http://127.0.0.1:8080/cmbc/', '1',
        'http://127.0.0.1:8080/cmbc/oauth2-login.htm', 'authorization_code', 'b5ccdce8-5a46-4356-985b-89d0047d2d99');
# SET IDENTITY_INSERT tc_oauth2_client ON;


