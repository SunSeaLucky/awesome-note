---
title: 服务器快速命令
date: 2025-10-26 14:22:00 +0800
categories: [科研, 服务器]
tags: [linux, research]     # TAG names should always be lowercase
---

## 代理

### 导出代理

```bash
PORT=7890 && export http_proxy=http://127.0.0.1:$PORT && export https_proxy=http://127.0.0.1:$PORT && export HTTP_PROXY=http://127.0.0.1:$PORT && export HTTPS_RPOXY=http://127.0.0.1:$PORT
```

在某些 shell 或 Python 环境里（特别是 root + conda base 环境），小写版并不会被继承。

取消代理：

```bash
unset http_proxy && unset https_proxy && unset HTTP_PROXY && unset HTTPS_RPOXY
```

### SSH 反向代理服务器的网络到本机

在本机终端执行：

```bash
ssh -R host:7891:127.0.0.1:7890 username@host
```
连接完成后，执行：

```bash
export https_proxy=http://127.0.0.1:7891 http_proxy=http://127.0.0.1:7891 all_proxy=socks5://127.0.0.1:7891
```

如果需使用 `conda install` 来安装第三方库，还需执行：

```bash
conda config --set proxy_servers.http http://127.0.0.1:7891
conda config --set proxy_servers.https https://127.0.0.1:7891
```

如果要使用 Git，还需执行：

```bash
git config --global http.proxy http://127.0.0.1:7891
git config --global https.proxy https://127.0.0.1:7891
```

为什么这个方法，ping 不通 www.baidu.com？ping 是使用的 ICMP 协议，而 SSH 只转发 TCP 流量。

### 让 VSCode 的 Extension 在远程机器上使用代理

在远程机器的配置文件中添加：

```json
{
    "http.proxy": "http://127.0.0.1:7884",
    "http.proxySupport": "on",
}
```

## SSH

### 生成 SSH 密钥对

指定文件：

```bash
ssh-keygen -t ed25519 -C "sunsealucky@gmail.com" -f ~/.ssh/id_ed25519_sunsealucky
```

不指定文件：

```bash
ssh-keygen -t ed25519 -C "sunsealucky@gmail.com"
```

### 配置服务器免密登录

```bash
vim ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
chmod 700 ~/.ssh
```
## 数据传输：[AList](https://github.com/AlistGo/alist/releases) + [Rclone](https://rclone.org/) + [阿里云盘](https://www.aliyundrive.com/drive/home)

- 配置 AList

使用一键安装脚本安装。如有超级用户权限，且不是容器环境（需要 systemd）

```bash
curl -fsSL "https://alist.nn.ci/v3.sh" -o v3.sh && bash v3.sh
```

但这条命令通常无法成功执行，可以到 [Alist 官方的 GitHub 仓库](https://github.com/AlistGo/alist/releases)下载对应平台的二进制文件，以 Ubuntu 平台为例

```
wget https://github.com/AlistGo/alist/releases/download/v3.55.0/alist-linux-amd64.tar.gz
```

如果使用一键安装脚本安装

```bash
cd /opt/alist
```

否则找到你的下载目录，然后设置账号密码

```bash
chmod +x alist && ./alist admin set 123456789
```

启动 AList 服务器

```bash
./alist server
```

进入 http://localhost:5244/ 后，点击下方的管理按钮，添加一个新的阿里云存储。刷新令牌地址。

- 配置 [Rclone](https://rclone.org/)

下载二进制文件：

```bash
curl -O https://downloads.rclone.org/rclone-current-linux-amd64.zip
unzip rclone-current-linux-amd64.zip
cd rclone-*-linux-amd64
```

复制到自己的家目录下：

```bash
cp rclone ~/bin/
chmod 755 ~/bin/rclone
```

按照 Rclone 的[官方文档](https://rclone.org/docs/)配置好 Rclone 或者按照这样的格式配置 Rclone：

```bash
[ali]
type = webdav
url = http://127.0.0.1:5244/dav
vendor = other
user = admin
pass = iIYpMc_TkqqX_bje1_zw0Mp8Hj9XqHtxNg
```

- （可选）配置 Aria2

执行

```bash
sudo apt update && sudo apt install aria2 aria2p
```

复制 AList 中需要下载文件的链接，执行

```bash
$URL=<url>
aria2c --enable-rpc --rpc-listen-all -s 3 -j 3 -c -l download.log -D $URL
```

其中 -s 3 表示同时下载三个任务，-j 3 表示同时使用三个下载连接，-c 表示断点续传，-l download.log 表示日志文件，-D 表示指定下载目录。

可以通过如下命令查看下载进度

```bash
aria2p top
```

## AutoDL

### 配置 HuggingFace 和 Conda 缓存路径

```bash
mkdir -p /root/autodl-tmp/.cache/huggingface
echo "export HF_HOME=/root/autodl-tmp/.cache/huggingface" >> ~/.bashrc
echo "export HF_ENDPOINT=https://hf-mirror.com" >> ~/.bashrc
mkdir -p /root/autodl-tmp/.cache/conda/pkgs
mkdir -p /root/autodl-tmp/.cache/conda/envs
conda config --add pkgs_dirs /root/autodl-tmp/.cache/conda/pkgs
conda config --add envs_dirs /root/autodl-tmp/.cache/conda/envs
source ~/.bashrc
```