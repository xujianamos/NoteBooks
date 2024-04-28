为同一个电脑，配置多个 git 账号，其整体流程如下：

1. 清空默认的全局 user.name 和 user.email
2. 为不同的 git 账户生成不同的 ssh-key
3. 将以上的 ssh-key 分别添加到 ssh-agent 信任列表
4. 添加以上的公钥到自己的 git 账户中
5. 在 config 文件配置多个 ssh-key

## 1. 清空默认的全局 user.name 和 user.email

```bash
git config --global --unset user.name
git config --global --unset user.email
```

查看git配置： `git config --global --list`

## 2. 配置多个git的用户名和邮箱

在项目根目录执行如下命令：

```shell
git config user.name "用户名"
git config user.email "邮箱"
```

c、删除配置

```shell
git config --unset user.name
git config --unset user.email
```

## 3. 生成多个SSH key

> **注意：**在生成多个SSH key的时候一定要在`~/.ssh`目录下进行，否则生成的SSHkey不会在`~/.ssh`目录下。

这里使用one two两个账户进行举例

### 3.1 指定文件路径

a、生成A仓库的SSH

指定文件路径，方便后面操作：`~/.ssh/id_rsa_one`，`id_rsa_one`是秘钥的别名,主要为了区分所属平台。

```shell
ssh-keygen -t rsa -f ~/.ssh/id_rsa_one -C "one@email.com"
```

b、生成B仓库的SSH

```shell
ssh-keygen -t rsa -f ~/.ssh/id_rsa_two -C "two@email.com"
```

### 3.2 进入ssh目录

a、进入到`~/.ssh`目录下。

```shell
cd ~/.ssh
```

b、生成第一个ssh key

```shell
ssh-keygen -t rsa -C "one@email.com"
```

c、生成第二个ssh key

```shell
ssh-keygen -t rsa -C "two@email.com"
```

再输入命令行的时候在第一次提示`Enter file in which to save the key`的时候对ssh文件进行重命名（id_rsa_one和id_rsa_two），这时就会生成一下目录中的四个文件。

```
id_rsa.one
id_rsa_one.pub
id_rsa.two
id_rsa_two.pub
```

## 4. 将 ssh-key 分别添加到 ssh-agent 信任列表

```shell
ssh-agent bash
ssh-add ~/.ssh/id_rsa_one
ssh-add ~/.ssh/id_rsa_two
```

> 如果看到 Identitiy added: ~/.ssh/id_ras_one，就表示添加成功了。

## 5. 添加公钥到自己的 git 账户中

打开文件复制带 pub 的文件分别配置到不同平台中。

如下添加到github中：

![image-20240428225133353](https://noteimagebuket.oss-cn-hangzhou.aliyuncs.com/typora/202404282251416.png)

过程如下：

1. 登录 Github
2. 点击右上方的头像，点击 `settings`
3. 选择 `SSH key`
4. 点击 `Add SSH key`

在出现的界面中填写 SSH key 的名称，填一个你自己喜欢的名称即可。
将上面拷贝的`~/.ssh/id_rsa_xxx.pub`文件内容粘帖到 key 一栏，在点击 “add key” 按钮就可以了。

添加过程 github 会提示你输入一次你的 github 密码 ，确认后即添加完毕。

## 6. 在 config 文件配置多个 ssh-key

在生成密钥的.ssh 目录下，新建一个config文件，然后配置不同的仓库。

```shell
#git server one
Host one.github.com #别名
Hostname github.com #真实域名
PreferredAuthentications publickey
IdentityFile ~/.ssh/id_rsa_one #ssh 文件路径
User one

#git server two
Host two.github.com
Hostname github.com
PreferredAuthentications publickey
IdentityFile ~/.ssh/id_rsa_two
User two
```

字段解释：

1. Host

当ssh的时候如果服务器地址能匹配上这里Host指定的值，则Host下面指定的HostName将被作为最终的服务器地址使用，并且将使用该Host字段下面配置的所有自定义配置来覆盖默认的/etc/ssh/ssh_config配置信息。

2. Port

自定义的端口。默认为22，可不配置

3. User

自定义的用户名

4. HostName

真正连接的服务器地址

5. PreferredAuthentications

指定优先使用哪种方式验证，支持密码和秘钥验证方式

6. IdentityFile

指定本次连接使用的密钥文件

## 7. 测试

```shell
ssh -T git@one.github.com
ssh -T git@two.github.com
```

## 8.clone到本地

原来的写法:

```bash
git clone git@github.com:项目路径.git
```

现在的写法:

```bash
git clone git@one.github.com:项目路径.git
git clone git@two.github.com:项目路径.git
```

## 9.给仓库设置局部用户名和邮箱【可不设置】

```shell
git config user.name "one_name" ; git config user.email "one_email"
 git config user.name "two_name" ; git config user.email "two_email"
```

