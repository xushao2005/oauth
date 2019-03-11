[TOC]

# cmhb-oauth2部署

## 运行环境安装

### 准备工作

| 安装包                   | 说明        |
| --------------------- | --------- |
| apache-tomcat8.zip    | Web应用服务容器 |
| jdk7-linux-x64.tar.gz | Java运行环境  |

### 创建用户并设置密码

创建用户

```
useradd -m oauth2 -d /home/oauth2  -s /bin/bash -g users
```

设置密码

```
passwd oauth2
```

### 安装环境

- 切换至oauth2用户

```
su - oauth2
```

#### 安装JDK

- 解压JDK安装包

```
tar -zxvf jdk7-linux-x64.tar.gz
mv jdk7/ jdk
```

- 配置环境变量，编辑用户环境变量文件

```
vi .bashrc
```

在.bashrc文件尾追加如下内容

```
export JAVA_HOME=$HOME/jdk
export JRE_HOME=$JAVA_HOME/jre
export PATH=$PATH:$JAVA_HOME/bin
```

使用`:wq`命令保存并退出

执行命令，使配置生效

```
source .bashrc
```

- 验证是否安装成功

```
java -version
```

#### 安装Web应用服务容器

- 解压tomcat安装包

```
unzip apache-tomcat8.zip
mv apache-tomcat-8.x.xx release
rm -rf release/webapps/*
```

- 赋予执行权限

```
chmod +x release/bin/*.sh
```

## 应用部署

文件说明

| 文件名               | 说明                                       |
| ----------------- | ---------------------------------------- |
| cmhb-oauth2.war   | 应用包                                      |
| init-schema.sql   | 初始化表                                     |
| init-oauth-data.sql     | 初始化数据，包括功能信息（认证中心基本权限管理功能、应用管理功能）、角色信息（系统管理员隐含角色、操作员隐含角色、部门管理员隐含角色）、用户信息（管理员） |
| server.properties | 服务器配置文件，具体配置请咨询开发对接人员                    |

### 数据准备

- 执行[init.schema.sql](sql\init-schema.sql)、[init-oauth-data.sql](sql\init-oauth-data.sql)、[init-functions-data.sql](sql\init-functions-data.sql)，初始化数据库。

### 应用环境准备

- 进入容器目录


```shell
cd release
```

- 根据环境修改应用配置文件


```shell
vi server.properties
```

#### 启动应用


```shell
bin/start.sh
```

## 进入认证系统

### 添加应用

用户名:admin|密码:123456

