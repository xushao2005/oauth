CREATE DATABASE `auth` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;

# 分公司
CREATE TABLE auth_branch (
	id                     BIGINT                AUTO_INCREMENT,
	code                   NVARCHAR(10) NOT NULL, # 对应其它系统仓库id
	name                   NVARCHAR(50) NOT NULL, # 分公司名
	name_spell             VARCHAR(50)  NOT NULL, # 分公司名拼音
	status_id              BIT          NOT NULL,
	area                   NVARCHAR(50) NOT NULL,
	warehouse_code         NVARCHAR(20),
	area_code              NVARCHAR(50),
	baud_rate              INT,
	is_belong              NVARCHAR(50),
	cainiao_warehouse_code NVARCHAR(50),
	abbreviation_name      NVARCHAR(50),
	status                 TINYINT      NOT NULL DEFAULT 0,
	add_time               DATETIME     NOT NULL,
	mod_time               DATETIME     NOT NULL,
	PRIMARY KEY (id)
);
# 部门
CREATE TABLE auth_department (
	id       BIGINT                AUTO_INCREMENT,
	name     NVARCHAR(50) NOT NULL,
	status   TINYINT      NOT NULL DEFAULT 0,
	add_time DATETIME     NOT NULL,
	mod_time DATETIME     NOT NULL,
	PRIMARY KEY (id)
);
# 部门-岗位
CREATE TABLE auth_work_post_type (
	id       BIGINT                AUTO_INCREMENT,
	name     NVARCHAR(50) NOT NULL UNIQUE,
	dept_id  BIGINT       NOT NULL,
	status   TINYINT      NOT NULL DEFAULT 0,
	add_time DATETIME     NOT NULL,
	mod_time DATETIME     NOT NULL,
	PRIMARY KEY (id)
);
# 员工
CREATE TABLE auth_user (
	id             BIGINT                                         AUTO_INCREMENT,
	login_name     VARCHAR(50)   NOT NULL UNIQUE,
	password       VARCHAR(50)   NOT NULL,
	username       VARCHAR(50)   NOT NULL,
	email          VARCHAR(50),
	phone          VARCHAR(100),
	mobile         VARCHAR(100),
	description    NVARCHAR(500),
	sales          BIT DEFAULT 0 NOT NULL,
	checking       BIT DEFAULT 0 NOT NULL,
	receipt        BIT DEFAULT 0 NOT NULL,
	driver         BIT DEFAULT 0 NOT NULL,
	branch_company VARCHAR(64),
	department     VARCHAR(64),
	post           VARCHAR(64),
	entry_time     DATETIME      NOT NULL,
	duty_status    BIT           NOT NULL                         DEFAULT 0,
	resign_time    DATETIME,
	status         TINYINT       NOT NULL                         DEFAULT 0,
	add_time       DATETIME      NOT NULL,
	mod_time       DATETIME      NOT NULL,
	PRIMARY KEY (id)
);
CREATE UNIQUE INDEX uidx_login_name
	on auth_user (login_name)
;
CREATE UNIQUE INDEX uindex_username
	ON auth_user (username);

# 角色
CREATE TABLE auth_role (
	id       BIGINT       NOT NULL,
	name     NVARCHAR(50) NOT NULL,
	description VARCHAR(100)  NULL,
	status   TINYINT      NOT NULL                         DEFAULT 0,
	add_time DATETIME     NOT NULL,
	mod_time DATETIME     NOT NULL,
	PRIMARY KEY (id)
);
create unique index idx_name
	on auth_role (name)
;
# token
create table auth_access_token
(
	id BIGINT(19) auto_increment
		primary key,
	user_id VARCHAR(128) not null,
	client_secret VARCHAR(128) NOT NULL,
	access_token VARCHAR(128) NOT NULL,
	refresh_token VARCHAR(128) NOT NULL,
	access_token_expired_time DATETIME NOT NULL,
	refresh_token_expired_time DATETIME not null
);
# 应用
CREATE TABLE auth_client (
	id           BIGINT AUTO_INCREMENT,
	application_name  VARCHAR(64)  NULL,
	description  VARCHAR(100)  NULL,
	secret_key       VARCHAR(128) NULL,
	uri          VARCHAR(512) NULL,
	icon         VARCHAR(512) NULL,
	redirect_uri VARCHAR(512) NULL,
	grant_types  VARCHAR(32)  NULL,
	app_id       VARCHAR(128) NULL,
	PRIMARY KEY (id)
);
create unique index idx_uri
	on auth_client (redirect_uri);

# 分公司下的部门
CREATE TABLE auth_r_branch_dept (
	id        BIGINT                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 AUTO_INCREMENT,
	branch_id BIGINT   NOT NULL,
	dept_id   BIGINT NOT NULL,
	status    TINYINT NOT NULL                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     DEFAULT 0,
	add_time  DATETIME NOT NULL,
	mod_time  DATETIME NOT NULL,
	PRIMARY KEY (branch_id, dept_id)
);
# 分公司-部门-权限
CREATE TABLE auth_r_branch_dept_perm (
	id             BIGINT AUTO_INCREMENT,
	branch_dept_id BIGINT NOT NULL,
	control_id        BIGINT NOT NULL,
	client_id			 BIGINT NOT NULL,
	PRIMARY KEY (control_id, branch_dept_id)
);
# 分公司-部门-岗位
CREATE TABLE auth_r_assign_post (
	id             BIGINT   NOT NULL AUTO_INCREMENT,
	branch_dept_id BIGINT NOT NULL,
	post_id        BIGINT NOT NULL,
	status         TINYINT NOT NULL DEFAULT 0,
	add_time       DATETIME NOT NULL,
	mod_time       DATETIME NOT NULL,
	PRIMARY KEY (branch_dept_id, post_id)
);
#特定岗位-权限
CREATE TABLE auth_r_post_perm (
	id             BIGINT AUTO_INCREMENT,
	assign_post_id BIGINT NOT NULL,
	control_id        BIGINT NOT NULL,
	client_id BIGINT NOT NULL,
	PRIMARY KEY (id)
);
CREATE UNIQUE
INDEX idx_post_perm
	ON auth_r_post_perm(assign_post_id, control_id, client_id);

# 用户角色管理
CREATE TABLE auth_r_user_role (
	id      BIGINT AUTO_INCREMENT,
	user_id BIGINT NOT NULL,
	role_id BIGINT NOT NULL,
	PRIMARY KEY (id)
);
create unique index idx_user_role
	on auth_r_user_role (user_id, role_id)
;
# 菜单权限
CREATE TABLE auth_control (
	id           BIGINT        NOT NULL,
	name         NVARCHAR(100) NOT NULL,
	type         VARCHAR(10)   NOT NULL,
	control_p_id BIGINT        NOT NULL,
	bread_p_id   BIGINT        NOT NULL,
	icon         VARCHAR(100),
	router       VARCHAR(50),
	client_id    BIGINT        NOT NULL,
	status       TINYINT       NOT NULL                         DEFAULT 0,
	add_time     DATETIME      NOT NULL,
	mod_time     DATETIME      NOT NULL,
	PRIMARY KEY (id, client_id)
);
# 角色-权限
CREATE TABLE auth_r_role_control (
	id      BIGINT AUTO_INCREMENT,
	name NVARCHAR(50) NOT NULL,
	role_id BIGINT    NOT NULL,
	control_id BIGINT    NOT NULL,
	client_id BIGINT NOT NULL,
	PRIMARY KEY (id)
);
create unique index idx_role_control
	on auth_r_role_control (role_id, control_id, client_id)
;
# 应用和员工
CREATE TABLE auth_r_client_user (
	id        BIGINT AUTO_INCREMENT,
	user_id BIGINT NOT NULL,
	client_id BIGINT NOT NULL,
	PRIMARY KEY (id)
);
CREATE UNIQUE
INDEX idx_user_client
	ON auth_r_client_user (user_id, client_id);

# 接口权限
CREATE TABLE auth_api (
	id BIGINT NOT NULL,
	name NVARCHAR(100) NOT NULL,
	path	VARCHAR(100) NOT NULL ,
	method_type VARCHAR(10),
	parent_id     BIGINT        NOT NULL,
	client_id BIGINT NOT NULL,
	status        TINYINT       NOT NULL                         DEFAULT 0,
	add_time      DATETIME      NOT NULL,
	mod_time      DATETIME      NOT NULL,
	PRIMARY KEY (id, client_id)
);
# 菜单-api
CREATE TABLE auth_r_menu_api (
	id           BIGINT NOT NULL,
	control_id      BIGINT NOT NULL,
	api_id BIGINT NOT NULL,
	client_id    BIGINT NOT NULL,
	PRIMARY KEY (id)
);
CREATE UNIQUE
INDEX idx_menu_api
	ON auth_r_menu_api (control_id, api_id, client_id);

# 更改
ALTER TABLE auth_r_role_menu RENAME TO auth_r_role_control;
ALTER TABLE auth_menu RENAME TO auth_control;
ALTER TABLE auth_r_role_control CHANGE menu_id control_id BIGINT NOT NULL;
ALTER TABLE auth_control
	ADD COLUMN type VARCHAR(10) NOT NULL AFTER resource_type;
ALTER TABLE auth_control
	ADD COLUMN control_p_id BIGINT NOT NULL AFTER parent_id;
ALTER TABLE auth_control
	ADD COLUMN bread_p_id BIGINT NOT NULL AFTER control_p_id;
ALTER TABLE auth_control
	ADD COLUMN match_router VARCHAR(50) NOT NULL AFTER router;
ALTER TABLE auth_user
	MODIFY COLUMN driver BIT NOT NULL DEFAULT b'0'
	AFTER driver;