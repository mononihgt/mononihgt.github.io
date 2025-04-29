---
layout: post
title: '用 Nginx 和 Ngrok 把自己的电脑当作服务器'
subtitle: '一个简单的线上实验教程'
date: 2025-4-29 15:40:00 +0800
categories: tech
author: mpxuann
cover: 'https://images.unsplash.com/photo-1529322365446-6efd62aed02e?w=1600&q=900'
cover_author: 'inma santiago'
cover_author_link: 'https://unsplash.com/@inmasantiago'
tags: 
- 在线实验
- jspsych
- ngrok
- nginx
# pin: true
# submenu: 'begin'
---


该指南将详细介绍如何结合使用 Nginx 和 Ngrok，将你本地计算机上运行的服务（例如一个网站、API 或其他应用）暴露到互联网上，使其可以被外部网络访问。

在进行 Web 开发、演示本地项目或测试需要公网访问的应用程序（如微信公众号开发、接收 Webhook）时，这个方法非常实用，省去了购买云服务器或进行复杂端口映射的麻烦。

在这个过程中，**Nginx**负责将服务部署到本地计算机的端口，**Ngrok**负责让其他人能够通过https网址访问本地计算机的服务

> note "tips"
> 如果关于端口、服务器等概念不是很了解，可以先看一下这个入门视频→[你管这破玩意叫网络？](https://www.bilibili.com/video/BV17x6hYZEzJ/?vd_source=20d1be4abb4a9c3ea13bdd70bb92fb5d)


## 1. Nginx

### Nginx 是什么

Nginx（发音为 engine-x）是一个高性能的 HTTP 和反向代理服务器，同时也是一个 IMAP/POP3/SMTP 代理服务器。它由伊戈尔·赛索耶夫（Igor Sysoev）开发，并于2004年首次公开发布。Nginx 以其高稳定性、丰富的功能集、简单的配置和低资源消耗而闻名。

**Nginx 的主要特点和用途：**

*   **高性能和高并发处理能力：** Nginx 采用了基于事件驱动的异步非阻塞架构，使其在高并发连接下表现出色，最初设计就是为了解决“C10K 问题”（即单台服务器同时处理 10000 个客户端连接）。
*   **作为静态文件服务器：** Nginx 非常擅长快速、高效地提供静态文件（HTML、CSS、JavaScript、图片等）。
*   **作为反向代理服务器：** 这是 Nginx 最常见的用途之一。它可以接收来自客户端的请求，然后将这些请求转发到后端的应用服务器（如 Node.js、Python Flask/Django、Java Tomcat 等），并将应用服务器的响应返回给客户端。这样做的好处包括负载均衡、提高安全性、隐藏后端服务器信息等。
*   **负载均衡：** Nginx 可以在多个后端服务器之间分配客户端请求，从而提高应用的可用性和扩展性。
*   **HTTP 缓存：** Nginx 可以缓存静态和动态内容，减少后端服务器的负载并加快响应速度。
*   **SSL/TLS 终止：** Nginx 可以处理加密的 HTTPS 连接，减轻后端应用服务器的负担。

在这份指南中，我们将主要利用 Nginx 作为静态文件服务器或反向代理，将本地的 Web 内容或服务暴露到本地的一个特定端口上。

### 安装 Nginx 并在本地启用服务（Windows/macOS）

#### macOS

在 macOS 上，使用 Homebrew 包管理器安装 Nginx 是最简单快捷的方式。

**1. 安装 Homebrew (如果尚未安装):**

打开终端，粘贴并运行以下命令：

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```
按照屏幕上的提示完成安装。
    
**2. 使用 Homebrew 安装 Nginx:**
在终端中运行以下命令：
```bash
brew install nginx
```
Homebrew 会自动下载、编译和安装 Nginx 及其依赖项。

**3. 启动 Nginx 服务:**
安装完成后，可以使用以下命令启动 Nginx 服务：
```bash
brew services start nginx
```
Homebrew 会将 Nginx 配置为一个后台服务，随系统启动。

**4. 验证 Nginx 是否启动成功:**
打开浏览器，输入网址 `http://localhost:8080` 并访问。

*   如果看到 "Welcome to nginx!" 的页面，说明 Nginx 启动成功，并且正在监听默认的 8080 端口。
*   如果显示 "An error occurred." 或 "Sorry, the page you are looking for is currently unavailable."，这通常也意味着 Nginx 启动成功，但默认的 8080 端口可能被其他程序占用，或者 Nginx 的默认配置已被修改。你可以检查终端输出或 Nginx 的错误日志来确认。

**其他 Homebrew 管理 Nginx 的常用命令:**
*   停止 Nginx: `brew services stop nginx`
*   重启 Nginx: `brew services restart nginx`
*   重新加载 Nginx 配置文件: `brew services reload nginx` (修改配置后常用)
*   查看 Nginx 安装信息: `brew info nginx` (可以查看安装路径和配置文件位置)

#### Windows

在 Windows 上，通常通过下载官方提供的预编译好的 ZIP 压缩包进行安装。

**1. 下载 Nginx:**
访问 Nginx 官方网站的下载页面：[https://nginx.org/en/download.html](https://nginx.org/en/download.html)。
在 "Mainline version" 或 "Stable version" 下找到 Windows 版本的链接（通常是一个 `.zip` 文件），点击下载。建议下载最新稳定版本。

**2. 解压 Nginx:**
将下载的 ZIP 文件解压到你选择的目录。例如，可以解压到 `C:\nginx` 或 `D:\Software\nginx`。解压后你会看到一个 `nginx-版本号` 的文件夹，里面包含 `conf`、`html`、`logs` 等子目录以及 `nginx.exe` 可执行文件。

**3. 启动 Nginx:**
打开命令提示符 (按下 `Win + R`，输入 `cmd` 并回车)。
切换到 Nginx 的安装目录（包含 `nginx.exe` 的目录）。例如，如果解压到 `C:\nginx\nginx-1.25.3`：
```cmd
cd C:\nginx\nginx-1.25.3
```
运行以下命令启动 Nginx：
```cmd
start nginx
```
`start` 命令会在新的窗口中运行 Nginx，这样当前命令提示符窗口就不会被占用。

**4. 验证 Nginx 是否启动成功:**
在命令提示符中运行以下命令，查看是否有 `nginx.exe` 进程在运行：
```cmd
tasklist /fi "imagename eq nginx.exe"
```
如果看到两个 `nginx.exe` 进程（一个主进程，一个工作进程），说明 Nginx 已成功启动。

打开浏览器，输入网址 `http://localhost:80` 并访问（默认监听 80 端口）。
*   如果看到 "Welcome to nginx!" 的页面，说明 Nginx 启动成功。
*   如果访问失败，可能是 80 端口被占用。你可以检查 Nginx 安装目录下的 `logs\error.log` 文件来查看错误信息。

**Windows 下 Nginx 的常用命令:**
在 Nginx 安装目录下执行以下命令：
*   快速停止 Nginx (不保存当前工作): `nginx -s stop`
*   优雅地停止 Nginx (等待当前请求处理完毕): `nginx -s quit`
*   重新加载 Nginx 配置文件: `nginx -s reload` (修改配置后常用)
*   检查配置文件语法: `nginx -t`
*   查看 Nginx 版本: `nginx -v`

### 怎么用 Nginx 将本地的服务部署到某个端口上（Windows/macOS）

这一步是利用 Nginx 将你本地的 Web 内容或应用程序暴露在本地网络的特定端口上。我们主要通过修改 Nginx 的配置文件来实现。Nginx 的主配置文件通常是 `nginx.conf`。

**找到 Nginx 配置文件:**

* **macOS (通过 Homebrew 安装):** 配置文件通常位于 `/opt/homebrew/etc/nginx/nginx.conf`。你也可以运行 `brew info nginx` 来查看具体路径。

    ```bash
    maopeixuan@maopeixuandeMacBook-Air ~ % brew info nginx         
    ==> nginx: stable 1.27.5 (bottled), HEAD
    HTTP(S) server and reverse proxy, and IMAP/POP3 proxy server
    https://nginx.org/
    Installed
    /opt/homebrew/Cellar/nginx/1.27.5 (27 files, 2.5MB) *   `# 不是这一行的地址`
      Poured from bottle using the formulae.brew.sh API on 2025-04-20 at 15:01:18
    From: https://mirrors.tuna.tsinghua.edu.cn/git/homebrew/homebrew-core.git/Formula/n/nginx.rb
    License: BSD-2-Clause
    ==> Dependencies
    Required: openssl@3 ✔, pcre2 ✔
    ==> Options
    --HEAD
    	Install HEAD version
    ==> Caveats
    Docroot is: /opt/homebrew/var/www
    
    The default port has been set in /opt/homebrew/etc/nginx/nginx.conf to 8080 so that  `# 是这一行的地址`
    nginx can run without sudo.
    
    nginx will load all files in /opt/homebrew/etc/nginx/servers/.
    
    To restart nginx after an upgrade:
      brew services restart nginx
    Or, if you don't want/need a background service you can just run:
      /opt/homebrew/opt/nginx/bin/nginx -g daemon\ off\;
    ==> Analytics
    install: 12,895 (30 days), 38,804 (90 days), 166,015 (365 days)
    install-on-request: 12,862 (30 days), 38,695 (90 days), 165,576 (365 days)
    build-error: 4 (30 days)
    
    ```

* **Windows (通过 ZIP 包安装):** 配置文件位于 Nginx 安装目录下的 `conf\nginx.conf`。

**修改 Nginx 配置:**

使用文本编辑器打开 `nginx.conf` 文件。Nginx 的配置结构是层级的，主要包含 `http`、`server`、`location` 等块。

一个基本的配置示例，将 Nginx 配置为监听一个非默认端口（例如 8088），并提供本地一个目录下的静态文件：

```nginx
# 这是主配置文件的一部分

http {
    # ... 其他 http 块配置 ...

  	# 注意是在 http 块里面新添加一个 server 块
    # 不是在原有的 server 块里直接添加
    server {
        listen 8088; # 修改为你想监听的本地端口
        server_name localhost; # 或者你的本地IP地址 127.0.0.1

        # 配置根目录，指向你的本地项目文件夹
        # macOS 示例
        # root /Users/你的用户名/你的项目文件夹;

        # Windows 示例
        root C:/Users/你的用户名/你的项目文件夹; # 注意 Windows 路径使用斜杠 / 或双反斜杠 \\
    		

        # 索引文件，当你访问根目录时，默认查找的文件
        index index.html index.htm;

        location / {
            # 尝试按顺序查找文件
            try_files $uri $uri/ =404; # 这行不用改
        }

        # 如果你的本地服务是一个应用程序（例如在 3000 端口运行的 Node.js 应用）
        # 你可以配置一个反向代理
        # location /api/ { # 例如，所有以 /api/ 开头的请求
        #     proxy_pass http://localhost:3000; # 转发到本地运行在 3000 端口的应用
        #     proxy_set_header Host $host;
        #     proxy_set_header X-Real-IP $remote_addr;
        #     proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        # }
    }

    # ... 其他 server 块配置 ...
}
```



**配置说明：**

*   `listen 8088;`: Nginx 将监听本地的 8088 端口。你可以根据需要修改这个端口号，只要确保该端口未被其他程序占用。
*   `server_name localhost;`: 指定服务器名称，这里使用 `localhost` 表示本地访问。
*   `root /path/to/your/project;`: 指定 Nginx 提供服务的根目录。将 `/path/to/your/project` 替换为你本地存放网页文件（如 `index.html`）或项目构建输出的文件夹路径。**请注意不同操作系统的路径格式。**
*   `index index.html index.htm;`: 指定当访问目录时，默认查找并显示的索引文件。
*   `location / {}`: 这是一个 location 块，匹配所有以 `/` 开头的请求（即网站的根目录及所有子路径）。
*   `try_files $uri $uri/ =404;`: 这个指令尝试按照顺序查找文件：首先查找与 URI 匹配的文件 (`$uri`)，如果不存在，则尝试查找与 URI 匹配的目录下的 `index` 文件 (`$uri/`)，如果都找不到，则返回 404 错误。
*   `proxy_pass http://localhost:3000;`: 如果你的本地服务不是简单的静态文件，而是一个运行在特定端口的应用程序，你可以使用 `proxy_pass` 指令将请求转发到该应用程序的地址和端口。上面的注释示例展示了如何将所有 `/api/` 开头的请求转发到本地 3000 端口的应用。

**应用新的配置：**

**1. 检查配置文件语法:**

打开终端或命令提示符，切换到 Nginx 安装目录，运行以下命令：

```bash
# macOS/Linux
nginx -t

# Windows
nginx -t

# 如果配置文件语法正确，会显示 syntax is ok 和 configuration file ... test is successful。如果存在错误，会提示具体的错误位置，你需要回到配置文件中修改。`
```    

**2. 重新加载 Nginx 配置:**
在终端或命令提示符中运行以下命令，让 Nginx 加载新的配置而无需停止服务：

```bash
# macOS (使用 Homebrew)
brew services reload nginx

# Windows
nginx -s reload
```

现在，你的本地服务应该已经可以通过 Nginx 在指定的端口上访问了（例如 `http://localhost:8088` 或 `http://127.0.0.1:8088`）。确保你的本地项目文件放在 Nginx 配置的 `root` 目录下，或者你的应用程序正在 `proxy_pass` 指定的端口上运行。

## 2. Ngrok

### Ngrok 是什么

Ngrok 是一款跨平台的应用程序，它可以轻松地将你本地计算机上的 Web 服务、数据库或其他网络服务通过安全的隧道暴露到互联网上。简单来说，Ngrok 提供一个临时的、公共的 URL，当你通过这个 URL 访问时，请求会被 Ngrok 服务转发到你的本地机器上的指定端口。

**Ngrok 的主要作用和优势：**

*   **内网穿透：** 最主要的功能，解决了本地服务无法直接从公网访问的问题，无需进行复杂的路由器端口映射或拥有公网 IP。
*   **方便开发和测试：** 可以方便地向外部人员演示本地正在开发的项目，或者测试需要公网回调的功能（如支付回调、微信/钉钉机器人、Webhook）。
*   **创建安全的隧道：** Ngrok 会创建加密的隧道，确保数据传输的安全性。
*   **实时请求检查：** Ngrok 提供一个本地的 Web 界面（通常在 `http://localhost:4040`），可以实时查看通过 Ngrok 隧道的所有请求和响应，对于调试非常有用。
*   **支持多种协议：** 除了 HTTP 和 HTTPS，Ngrok 还支持 TCP 隧道，可以用来暴露 SSH、数据库等服务。

使用 Ngrok 通常需要下载其客户端并在本地运行。

### 如何安装 Ngrok（Windows/macOS）

Ngrok 的安装非常简单，只需下载对应的客户端可执行文件即可。

**1. 下载 Ngrok:**
    访问 Ngrok 的官方下载页面：[https://ngrok.com/download](https://ngrok.com/download)。
    网站会自动检测你的操作系统，并提供相应的下载链接。选择适合你操作系统的版本（Windows, macOS, Linux 等）并点击下载。通常下载的是一个 ZIP 压缩包。

**2. 解压 Ngrok:**
    将下载的 ZIP 文件解压到你选择的目录。解压后，你会得到一个名为 `ngrok` 或 `ngrok.exe` 的可执行文件。

**3. 安装到 PATH (可选但推荐):**
为了方便在任何位置都能运行 `ngrok` 命令，建议将 Ngrok 可执行文件所在的目录添加到系统的 PATH 环境变量中。

*   **macOS:**
    打开终端，将 `ngrok` 可执行文件移动到一个已在 PATH 中的目录，例如 `/usr/local/bin` 或 `/usr/local/sbin`：
    
    ```bash
    mv /path/to/downloaded/ngrok /usr/local/bin/
    ```
    (请将 `/path/to/downloaded/ngrok` 替换为你下载的 `ngrok` 文件路径)
    
*   **Windows:**
    将 Ngrok 可执行文件所在的目录添加到系统的 PATH 环境变量中。具体步骤如下：
    
    *   右键点击“此电脑”（或“我的电脑”），选择“属性”。
    *   点击“高级系统设置”。
    *   点击“环境变量”按钮。
    *   在“系统变量”列表中找到名为 `Path` 的变量，双击编辑。
    *   点击“新建”，然后粘贴 Ngrok 可执行文件所在的完整目录路径（例如 `C:\ngrok`）。
    *   点击“确定”保存所有更改。
    *   重启命令提示符或终端窗口，以使 PATH 更改生效。

### 获得 Ngrok 授权码（authentication token）并给自己的电脑授权

Ngrok 提供免费和付费服务。即使是免费服务，也强烈建议你注册一个账号并使用授权码（Authtoken）进行认证。使用授权码可以解锁更多功能，例如更长的隧道在线时间、更多的隧道数量以及访问 Ngrok 的 Web 管理界面和 API。

**1. 注册 Ngrok 账号:**
访问 Ngrok 官方网站：[https://ngrok.com/](https://ngrok.com/)。
点击“Sign Up”注册一个新账号。你可以使用邮箱注册，也可以使用 Google 或 GitHub 账号快速登录。

**2. 获取你的 Authtoken:**
注册并登录后，你会被导向 Ngrok 的 Dashboard（控制面板）。在左侧菜单中，找到 "Authentication" 或 "Your Authtoken" 页面。
在该页面，你会看到你的专属 Authtoken，通常是一串长长的字符串。复制这个 Authtoken。

**3. 在本地电脑上授权 Ngrok 客户端:**
打开终端或命令提示符，运行以下命令，将你的 Authtoken 添加到 Ngrok 的配置文件中：

```bash
ngrok config add-authtoken <YOUR_AUTHTOKEN>
```
将 `<YOUR_AUTHTOKEN>` 替换为你刚刚从 Ngrok Dashboard 复制的 Authtoken。

这个命令会在你的用户目录下创建一个 Ngrok 配置文件（例如在 Windows 上是 `C:\Users\你的用户名\.ngrok2\ngrok.yml`，在 macOS 上是 `/Users/你的用户名/.ngrok2/ngrok.yml`），并将 Authtoken 保存在其中。这样以后每次使用 Ngrok 客户端时，都会自动使用这个 Authtoken 进行认证。

### 使用 Ngrok 将之前部署在某个端口上的服务从内网穿透到外网

现在你已经安装并授权了 Ngrok 客户端，可以将本地 Nginx 暴露的服务（或其他在特定端口运行的本地服务）穿透到公网了。

**1. 确保你的本地服务（由 Nginx 或其他应用提供）正在运行：**
确认你的 Nginx 正在监听你在 `.nginx.conf` 中配置的端口（例如 8088），并且能够正常访问（通过 `http://localhost:8088`）。

**2. 使用 Ngrok 启动隧道：**
打开终端或命令提示符，运行以下命令：
```bash
ngrok http <PORT>
```
将 `<PORT>` 替换为你本地服务正在监听的端口号。例如，如果 Nginx 监听 8088 端口：
```bash
ngrok http 8088
```
如果你想暴露本地运行在默认 HTTP 端口 (80) 或 HTTPS 端口 (443) 的服务，可以直接使用：
```bash
ngrok http 80
# 或
ngrok http 443
```

**3. 查看 Ngrok 输出：**
运行命令后，Ngrok 客户端会连接到 Ngrok 服务器并建立隧道。终端会显示类似以下的输出信息：

```ngrok
ngrok                                                                                           (Ctrl+C to quit)

Session Status                online
Account                       Your Name (Plan: Free)
Version                       3.x.x
Region                        United States (us)
Web Interface                 http://127.0.0.1:4040
Forwarding                    http://xxxxxxxxxxxx.ngrok-free.app -> http://localhost:8088
Forwarding                    https://xxxxxxxxxxxx.ngrok-free.app -> http://localhost:8088

Connections                   ttl     opn     rt1     p50     p95     byt     byt
                                0       0       0.00    0.00    0.00    0       0
```

**重点信息解释：**

*   `Session Status: online`：表示 Ngrok 客户端已成功连接到 Ngrok 服务。
*   `Account: Your Name (Plan: Free)`：显示你的 Ngrok 账号信息。
*   `Web Interface: http://127.0.0.1:4040`：这是 Ngrok 提供的本地 Web 界面地址，你可以在浏览器中访问它来查看通过隧道的所有请求和响应，以及其他会话信息。
*   `Forwarding`：这是最重要的部分，显示了 Ngrok 分配给你的公共 URL 以及它转发到的本地地址和端口。你会看到 `http://...ngrok-free.app` 和 `https://...ngrok-free.app` 两个 URL。

**4. 通过公共 URL 访问你的本地服务：**
现在，你可以复制 Ngrok 输出中的 `http://...ngrok-free.app` 或 `https://...ngrok-free.app` URL，在任何可以访问互联网的设备上打开浏览器访问它。这个 URL 会将请求转发到你本地机器上通过 Nginx 暴露的 8088 端口的服务。

**注意：** 免费版 Ngrok 的公共 URL 通常是随机生成的子域名，每次启动 Ngrok 隧道时都会改变。如果你需要固定的域名，可以考虑升级到 Ngrok 的付费计划或使用其他提供固定域名的内网穿透服务。

**5. 停止 Ngrok 隧道：**
在运行 Ngrok 的终端或命令提示符窗口中，按下 `Ctrl + C` 即可停止 Ngrok 隧道。停止后，之前生成的公共 URL 将不再有效。

## 总结

通过以上步骤，你已经成功地利用 Nginx 将本地文件或应用服务运行在特定的端口上，并使用 Ngrok 将这个本地端口映射到了互联网上，使其可以被外部访问。

**整个流程回顾：**

**1. 安装并配置 Nginx：**
*   根据操作系统安装 Nginx。
*   修改 `nginx.conf`，配置一个 `server` 块来监听一个本地端口（例如 8088），并将 `root` 指向你的项目文件夹，或者使用 `proxy_pass` 指向你本地运行的应用服务端口。
*   检查 Nginx 配置语法并重新加载 Nginx。
*   确保本地服务可以通过 `http://localhost:<PORT>` 正常访问。

**2. 安装并授权 Ngrok：**
*   下载 Ngrok 客户端并解压。
*   （可选）将 Ngrok 添加到系统 PATH。
*   注册 Ngrok 账号并获取你的 Authtoken。
*   使用 `ngrok config add-authtoken <YOUR_AUTHTOKEN>` 命令授权你的客户端。

**3. 使用 Ngrok 穿透本地服务：**
*   打开终端，运行 `ngrok http <PORT>` 命令，将 `<PORT>` 替换为 Nginx 或其他本地服务监听的端口号。
*   复制 Ngrok 输出中生成的公共 URL。
*   在外部网络访问该公共 URL，即可访问你本地的服务。

## 进一步探索（可选）

*   **Nginx 作为反向代理：** 如果你的本地运行的是 Node.js、Python 等后端应用，你可以配置 Nginx 作为这些应用的**反向代理**。客户端请求先到达 Nginx，然后 Nginx 根据配置将请求转发给运行在其他端口的后端应用。这有助于管理请求、处理静态文件、添加 SSL 等。
*   **Ngrok 高级功能：** Ngrok 提供更多高级功能，如 reserved domains (固定域名)、TLS certificates (使用自己的 SSL 证书)、HTTP basic auth (添加访问密码)、webhook tunels (专门用于接收 webhook 的隧道) 等。这些功能可能需要付费计划。
*   **安全性考虑：** 当你将本地机器暴露到公网时，请务必注意安全性。不要暴露包含敏感信息的目录，确保你的本地服务和操作系统都是安全的，并只在需要时开启 Ngrok 隧道。对于长期或生产环境的使用，建议使用更稳定和安全的云服务。
*   **防火墙设置：** 如果对信息的暴露有一定的担心，可以查找使用防火墙只开放某个端口(比如我把实验部署在80端口，那我就只开放80端口允许其他设备访问)的方法，这里不再展开，AI可以快速给出解决方案。
