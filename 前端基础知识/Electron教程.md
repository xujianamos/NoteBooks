# 硬件

## 1.屏幕

### 1.1获取扩展屏幕

Elecron内置了API以支持获取主显示器及外接显示器的信息。如下代码可以获取主显示器信息： 

```js
let remote = require("electron").remote;
let mainScreen = remote.screen.getPrimaryDisplay();
console.log(mainScreen);
```

mainScreen是一个显示器信息对象，它包含很多字段，主要的字段如下： 

- id：显示器ID。 
- rotation：显示器是否旋转，值可能是0、90、180、270。 
- touchSupport：是否为触屏。 
- bounds：绑定区域，可以根据此来判断是否为外接显示器。 
- size：显示器大小，与显示器分辨率有关，但并不一定是显示器分辨率。 

下面的示例代码，控制窗口显示在外接显示器上：

```js
let { screen } = require('electron');
let displays = screen.getAllDisplays();
let externalDisplay = displays.find((display) => {
    return display.bounds.x !== 0 || display.bounds.y !== 0
})
if (externalDisplay) {
    win = new BrowserWindow({
        x: externalDisplay.bounds.x + 50,
        y: externalDisplay.bounds.y + 50,
        webPreferences: { nodeIntegration: true }
    })
    win.loadURL('https:// www.baidu.com')
}
```

以上代码先通过screen.getAllDisplays方法获取到所有显示器信息，再通过显示器信息的bounds对象来判断是否为外接显示器（如果bounds.x或bounds.y不等于0则认为是外接显示器），接着把窗口显示在外接显示器屏幕的左上角。 

> 注意：
>
> 虽然显示器信息对象包含internal属性，官方说明此属性值为true是内置显示器，值为false为外接显示器。但实验证明，无论是内置显示器还是外接显示器，此值都为false。因此通过display.bounds来确定是否为外接显示器更准确。 
>
> 另外screen模块只有在app.ready事件发生之后才能使用。在6.x.y及以前的版本中，你甚至不能在主进程代码首行引入此模块，只能在app.ready事件发生时或之后的时间线上引入。















# 调测

## 1.测试

## 2.调试

## 3.日志

### 3.1.业务日志

记录业务日志并不是一个技术难度很高的工作，但它比较烦琐，因为有的时候要把业务日志打印到控制台，有的时候要把业务日志输出到本地文件中。日志还要分级别，比如error级别、warn级别、info级别等。 

这些烦琐的工作对于Web服务端开发人员来说不是问题，因为他们可以用Log4j（一个Java的日志记录工具）、winston（Node.js的日志记录工具）等工具。但Electron应用是一个桌面GUI应用，不能使用这些日志记录工具，因此Elecron社区有人专门为Electron应用开发了electron-log日志记录工具，以解决这方面的问题。下面我们就来了解一下这个工具。为Electron项目安装electron-log模块的命令如下： 

```shell 
$ yarn add electron-log
```

此模块在主进程和渲染进程中都可以使用，我们在主进程中加入如下代码：

```js
var log = require("electron-log");
log.error("error");
log.warn("warn");
log.info("info");
log.verbose("verbose");
log.debug("debug");
log.silly("silly");
```

上述代码以不同的日志级别记录日志，默认情况下日志既会在控制台输出，也会保存到本地文件中，日志默认保存在app.getPath("userData")目录下的log.log文件中。 

日志记录的内容如下： 

```bash
[2019-12-02 11:17:03.635] [error] error
[2019-12-02 11:17:03.636] [warn] warn
[2019-12-02 11:17:03.636] [info] info
[2019-12-02 11:17:03.636] [verbose] verbos
[2019-12-02 11:17:03.637] [debug] debug
[2019-12-02 11:17:03.637] [silly] silly
```

你会发现，日志发生的时间、日志级别、日志内容都记录在其中了。 

开发者可以通过log.transports.file.level和log.transports.console.level来分别设置日志输出目标和日志输出级别。 

记录日志的信息也可以通过如下方法进行格式化： 

```js
log.transports.file.format = '[{y}-{m}-{d} {h}:{i}:{s}.{ms}] [{level}] {text}'
```

> 如果不方便让用户把日志文件发送给我们的测试人员，那么开发者也可以开发一个程序，在适当的时候把用户日志自动上传到Web服务器上去.
>

### 3.2.网络日志

一般情况下，我们通过渲染进程的开发者调试工具即可查看应用程序发起的网络请求数据。

但使用这种方法有三个问题： 

1. 无法监控主进程发起的网络请求。 
2. 多个窗口发起的网络请求要在不同的窗口中监控，如果不同窗口发起的网络请求间存在一定的关联关系，就需要联合监控，非常麻烦。 
3. 无法精确地分析某个时段内的网络请求。当一个应用内的网络请求非常频繁时，你只能手动查找某个时间点发生的请求，而且其中可能会有干扰数据（例如Wiresharq）。 

为了弥补这些方面的不足，Electron为我们提供了netLog模块，允许开发人员通过编程的方式记录网络请求数据。代码如下：

```js
let { remote } = require("electron");
await remote.netLog.startLogging("E:\\net.log");
let ses = remote.getCurrentWebContents().session;
let xhr = new XMLHttpRequest();
xhr.open("GET", "https:// www.baidu.com");
xhr.onload = async () => {
    console.log(xhr.responseText);
    await remote.netLog.stopLogging()
};
xhr.send();
```

netLog模块是一个主进程模块，所以我们需要通过remote来使用它。它的startLogging方法接收两个参数，第一个参数是日志文件记录的路径，你可以通过app.getPath方法获取当前环境下可用的路径，我这里指定了一个固定的路径。 

第二个参数是一个配置对象，该对象的captureMode属性代表你想记录哪些网络数据，默认只记录请求的元数据。你可以把它设置成includeSensitive，这样记录的数据就包括cookie和authentication相关的数据了。 

接着我们发起了一个网络请求，得到响应后，使用netLog.stopLogging方法停止网络监控。 

startLogging和stopLogging都返回一个Promise对象，所以它们都是异步操作（因此上面的代码应该放在一个async方法中执行）。 

收集到的数据信息含量巨大，请求的地址、请求头、响应、甚至HTTPS证书的数据都在日志中有所体现。

### 3.3.崩溃日志

Electron内置了崩溃报告上报模块crashReporter，开发者可以利用此模块收集应用程序崩溃时的环境情况和异常数据，并让应用程序把这些数据提交到一个事先指定好的服务器上。 

启动崩溃报告服务的代码如下：

```js
let electron = require('electron');
electron.crashReporter.start({
    productName: 'YourName',
    companyName: 'YourCompany',
    submitURL: 'http:// localhost:8989/',
    uploadToServer: true
});
```

虽然没有现成的工具支撑我们完成此项任务，但并没有什么大碍，我们可以自己构建一个用于接收崩溃报告的HTTP服务。当你的应用崩溃时，Electron框架会以POST的形式发送以下数据到你指定的HTTP服务器： 

```js
·ver：Electron的版本。 
·platform：系统环境，如：'win32'。 
·process_type：崩溃进程，如：'renderer'。 
·guid：ID，如：'5e1286fc-da97-479e-918b-6bfb0c3d1c72'。 
·_version：系统版本号，为package.json里的版本号。 
·_productName：系统名称，开发者在crashReporter对象中指定的产品名字。 
·prod：基础产品名字，一般情况下为Electron。 
·_companyName：公司名称，开发者在crashReporter对象中指定的公司名称。 
·upload_file_minidump：这是一个minidump格式的崩溃报告文件。 
```

如果以上数据项不足以支撑你分析应用崩溃的原因，你还可以通过如下代码增加上报的内容：

```js
crashReporter.addExtraParameter(key, value);
```

或者在启动崩溃报告服务时即设置好附加字段，代码如下：

```js
electron.crashReporter.start({
    // ...
    extra: { 'key': 'value' }
});
```

为了测试崩溃报告服务是否正常可用，你可以通过如下代码，引发应用崩溃：

```js
process.crash();
```

以下为一个简单的崩溃日志接收服务的演示代码：

```js
let http = require('http');
let inspect = require('util').inspect;
let Busboy = require('busboy');
http.createServer(function(req, res) {
    if (req.method === 'POST') {
        var busboy = new Busboy({ headers: req.headers });
        busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
            console.log('File [' + fieldname + ']: filename: ' + filename + ', mimetype: ' + mimetype);
        });
        busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) {
            console.log('Field [' + fieldname + ']: value: ' + inspect(val));
        });
        busboy.on('finish', function() {
          res.end();
        });
        req.pipe(busboy);
    }
}).listen(8989);
```

上述代码以最简单的方式创建了一个Node.js HTTP服务，服务接收客户端请求，并把请求体中的内容格式化显示在控制台中。Busboy是一个可以格式化含有文件的请求体的第三方库，开源地址为https://github.com/mscdex/busboy。 

此服务接收到的dump文件可以使用Electron团队提供的minidump工具查看（https://github.com/electron/node-minidump）。 

另外你可以通过crashReporter.getLastCrashReport()方法获得已上传的崩溃报告，通过此方法也可以适时地提醒用户：应用上次退出是内部异常导致的，管理人员会跟踪此错误。

# 安全

## 1.保护源码

### 1.1禁用开发者调试工具

开发者在创建窗口时直接设置webPreferences.devTools参数即可禁用调试工具，代码如下：

```js
let win = new BrowserWindow({
    height: 768,
    width: 1024,
    webPreferences: {
        devTools: false                // 禁用开发者调试工具
    } 
});
```

通过以上方式打开的窗口，无论是通过菜单的View->Toggle Developer Tools还是使用Ctrl（Command）+Shift+I快捷键都无法打开开发者工具。

## 2.保护客户

### 2.1禁用Node.js集成

### 2.2启用同源策略

### 2.3启用沙箱隔离

### 2.4禁用webview标签

## 3.保护网络

### 3.1屏蔽虚假证书

为了更好地保证Electron应用与Web服务交互的安全性，我们应该使用session模块的setCertificateVerifyProc方法，如下代码所示：

```js
let session = win.webContents.session;
session.setCertificateVerifyProc((request, callback) => {
if(request.certificate.issuer.commonName == 'DO_NOT_TRUST_FiddlerRoot'){
        callback(-2);
    }else{
        callback(-3);
    }
})
```

setCertificateVerifyProc方法为当前会话设置证书验证钩子函数，我们可以在这个钩子函数中判断证书的发行人信息、证书序列号和发行人指纹。一旦证书信息不符合预期即调用callback(-2)来驳回证书。给callback传入-3表示使用Chromium的验证结果，传入0表示成功并禁用证书透明度验证。 
通过这样的方法可以在一定程度上屏蔽恶意用户通过伪造客户端证书来分析Electron应用的网络交互协议，但要注意，这也只是在一定程度上起到了保护作用，并不是绝对安全。

### 3.2关于防盗链

但有一个场景比较特殊，假设网站是我们自己的，我们既需要防止其他恶意网站盗链我们的静态资源，又要为我们的Electron应用提供静态资源服务，此时我们该怎么办呢？ 
Electron允许开发者监听发起请求的事件，并允许开发者在发起请求前修改请求头，如下代码所示：

```js
let session = window.webContents.session;
let requestFilter = { urls: ["http:// */*", "https:// */*"] };
session.webRequest.onBeforeSendHeaders(
    requestFilter,
    (details, callback) => {
    if (details.resourceType == "image" && details.method == "GET") {
        delete details.requestHeaders["Referer"];
    }
    callback({ requestHeaders: details.requestHeaders });
    }
);
```

以上代码中，我们监听了session.webRequest的onBeforeSendHeaders事件，并在此事件的执行方法内删除了Referer请求头。 

注册onBeforeSendHeaders事件的第一个参数是目标地址过滤器，过滤器过滤规则支持通配符。第二个参数是事件执行函数。 

在Electron发送HTTP请求头之前，事件函数得以执行。事件函数有两个参数details和callback。details对象包含请求头的所有信息，你可以用details.resourceType来获取请求的资源类型，可以用details.method获取请求的方式，可以用details.url来获取请求的URL地址。此对象的requestHeaders属性代表着所有请求头。想删掉Referer请求头，只要执行一个简单的delete语句即可。 

callback是回调方法，当你操作完请求头后，要把新的请求头传递给此方法，请求才可以继续执行。 

当需要在Electron应用中引用你自己的网络资源时，你可以使用这种方法来完成任务。这样你的网站不用做任何改动就可以在兼顾防盗链需求的同时，又能保证Electron应用正确地引用资源。

## 4.保护数据

### 4.1使用Node.js加密解密数据

无论是把数据保存在本地，还是在网络之间传输，我们都应该保证关键的数据是安全可靠的。关键数据既不会被非法用户窃取，也不会被非法用户篡改。 

Electron并未为开发者提供这方面的支持，但Node.js内置了数据加密、解密模块，可以利用它来保证关键数据的安全。接下来我们就看一下怎么使用Node.js的crypto模块来进行数据加密、解密。 

首先要为加密、解密工作创建原始密钥和初始化向量，代码如下：

```js
let crypto = require("crypto");
const key = crypto.scryptSync('这是我的密码', '生成密钥所用的盐', 32);
const iv = Buffer.alloc(16, 6);
```

crypto.scryptSync方法会基于你的密码生成一个密钥，使用这种方法可以有效地防止密码被暴力破解。 

Buffer.alloc会初始化一个定长的缓冲区，这里我们生成的缓冲区长度为16，填充值为6。建议把key和iv保存成全局变量，避免每次加密、解密时执行重复工作。 

接着对待加密的数据进行加密，代码如下：

```js
let cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
let encrypted = cipher.update("这是待加密的数据，这是待加密的数据");
encrypted = Buffer.concat([encrypted, cipher.final()]);
let result = encrypted.toString("hex");
console.log(result);
```

上面代码中使用aes-256-cbc进行加密，首先通过crypto.createCipheriv创建了加密对象cipher，cipher.update对数据进行加密，cipher.final结束加密。最终生成的密文保存在result变量中，上面结果执行后得到的密文为：

d4f8d3137af958c05ab589cb7e9a5bcf1b327fc62a4a7115ac49297aa04059a6f3a97ef3036430eedde29ca259c33a484e24bd345e3bc7e5510e49a76a5b1c9b

在需要的时候对密文进行解密，代码如下：

```js
let encryptedText = Buffer.from(result, "hex");
let decipher = crypto.createDecipheriv("aes-256-cbc",Buffer.from(key),iv);
let decrypted = decipher.update(encryptedText);
decrypted = Buffer.concat([decrypted, decipher.final()]);
result = decrypted.toString();
console.log(result);
```

result为待解密的密文，通过crypto.createDecipheriv创建解密对象，decipher.update执行解密过程，decipher.final结束解密工作。最终结果保存在result变量中。 

注意，加密、解密过程必须使用一致的密钥、初始化向量和加密、解密算法。 

如果每次加密完之后都会在可预期的未来执行解密过程，那么你也可以用下面这种方式生成随机的密钥和初始化向量：

```js
const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);
```

这种方法会随机生成key和iv，加密、解密过程都应使用它们。如果这两个值可能会在解密前被丢弃，那么就不应该使用这种方法。

对敏感数据进行加密可以保证你的数据不会被恶意用户窃取或篡改，你可以放心地把加密后的数据保存在客户端本地电脑上或在网络上传输（服务端使用对应的解密算法对密文进行解密）。这么做会使你的密钥和初始化向量变得尤为重要，因此你应保证它们不会被恶意用户窃取，不应把它们明文保存在客户端电脑上或在网络间传输。 

如果需要把密钥保存在客户电脑上，可以考虑使用node-keytar库（https://github.com/atom/node-keytar）。这是一个原生Node.js库，它帮助你使用本地操作系统密钥管理工具来管理你的密钥，Mac系统上使用的是钥匙串工具，Windows系统上使用的是用户凭证工具。 

网上有大量使用crypto.createCipher方法和crypto.createDecipher方法来完成加密、解密工作的示例，我不推荐大家使用，因为这两个方法都已经被Node.js官方标记为废弃了。Node.js官方不保证被标记为废弃的API向后兼容。

### 4.2保护electron-store数据

electron-store内置了数据加密、解密的支持，只要在创建Store对象时为其设置encryptionKey配置项即可加密保存在客户端的数据。同样设置此配置项后，读写客户端数据也不受影响。

```js
const Store = require("electron-store");
const schema = {
    foo: {
        type: "number",
        default: 50
    }
};
const store = new Store({
    schema,
    encryptionKey:'myEncryptKey'
});
```

### 4.3保护用户界面

有很多黑客工具会捕获你的窗口，然后通过模拟鼠标和键盘来操作你的窗口、输入数据、用机器模拟交互操作等。由于它看起来就像真实的用户在操作一样，对于应用程序的开发者来说，这种黑客行为防不胜防。 

想要预防这种黑客行为，就要防止你的窗口被不法工具截获。Electron为我们提供了这样的API，如下代码所示：

```js
win.setContentProtection(true);
```

执行上述代码后，如果再有这类黑客工具捕获你的窗口，Windows环境下窗口将显示一块黑色区域，应用窗口拒绝被捕获。 

恶意用户无法捕获应用的窗口，也就很难模拟鼠标和按键操作来操作你的窗口了，从而我们可以保证应用程序收集到的所有数据均来自于真实的客户的行为。

## 5.提升稳定性

### 5.1捕获全局异常

一般情况下，开发人员会在可能出现异常的地方使用try...catch...语句来捕获异常，但有些时候开发者并不能明确地判断应用程序什么地方可能会出现异常。当应用程序出现异常但又不想让应用程序停止响应时，我们可以使用捕获全局异常的技术。 

开发网页时，我们经常会通过如下方式捕获全局异常：

```js
window.onerror = function () { 
    // 收集日志
    // 显示异常提示信息或重新加载应用
}
```

当网页中有异常发生时，会触发window的onerror事件，开发者可以在此事件中收集日志、显示异常提示信息或重新加载应用。但以这种方式捕获异常后，异常依旧存在，开发者工具控制台还会输出异常。 

在Electron中还有另外一种捕获全局异常的方法：

```js
process.on('uncaughtException', (err, origin) => {
    // 收集日志
    // 显示异常提示信息或重新加载应用
});
```

这种方式是利用Node.js的技术捕获全局异常，以这种方式捕获异常后，异常会被“吃掉”，开发者工具控制台也不会再输出任何异常提示信息了。

因为process是Node.js的全局变量，所以在主进程和渲染进程中都可以使用这种方法捕获全局异常。 

> 注意，一定要谨慎使用这种捕获全局异常的方法，因为一旦异常发生，异常发生点后面的业务逻辑将不再执行，无论是用户还是开发者都将得不到通知。这可能导致你应用程序出现数据一致性的问题。

### 5.2从异常中恢复

上一章中我们讲到的崩溃报告服务只能在应用崩溃时自动发送崩溃报告，但我们并不能确切地通过它知道应用程序何时崩溃了。Electron提供了两个事件来帮助开发者截获渲染进程崩溃或挂起的事件。 

可以通过监听渲染进程的crashed事件来获悉渲染进程何时发生了崩溃错误，代码如下所示：

```js
let { dialog } = require('electron');
win.webContents.on("crashed", async (e, killed) => {
    // 应加入收集日志的逻辑
    let result = await dialog.showMessageBox({
        type: "error",
        title: "应用程序崩溃",
        message: "当前程序发生异常，是否要重新加载应用程序？",
        buttons: ["是", "否"]
    });
    if (result.response == 0) win.webContents.reload();
    else app.quit();
});
```

以上代码在主进程中监听webContents的crashed事件，一旦渲染进程崩溃，系统将弹出一个友善的提示对话框。点击“是”，应用程序将重新加载渲染进程的页面；点击“否”，应用程序将直接退出。

除此之外webContents还有另一个事件'unresponsive'，当网页变得未响应时，会触发该事件。需要注意的是，Electron会花一段时间来确认网页是否已经变成未响应了，这大概需要几十秒的时间。 

开发者也可以通过监听'unresponsive'事件收集程序运行日志，给客户友善的提示，并恢复应用程序运行状态。 

我们可以使用如下代码模拟渲染进程崩溃或挂起： 

```js
// 模拟进程崩溃
process.crash();
// 模拟进程挂起
process.hang();
```

需要注意的是，因为渲染进程是受控的，所以才有这两个事件提供给开发者，允许开发者监控异常并从异常中恢复。但主进程并没有类似的事件提供给开发者，开发者可以考虑使用process的'uncaughtException'事件，在此事件中收集日志并重启应用。

# 发布

## 1.生成图标

在编译打包应用程序之前，你要先为应用程序准备一个图标。图标建议为1024*1024尺寸的png格式的图片。

1. 把图标文件放置在[your_project_path]/public目录下，然后安装electron-icon-builder组件：

```shell
$ yarn add electron-icon-builder --dev
```

2. 接着在package.json的scripts配置节增加如下指令的配置：

```json
{
  “build-icon": "electron-icon-builder --input=./public/icon.png --output=build --flatten”
}
```

3. 然后执行生成应用程序图标的指令：

```shell
$ yarn build-icon
```

此时会在[your_project_path]/build/icons中生成各种大小的图标文件:



生成的这些图标将被打包编译进最终的可执行文件内。这个工具可以帮助团队美工节省大量的重复工作的时间。

## 2.生成安装包

Electron生态下有两个常用的打包工具：electron-packager（https://github.com/electron/electron-packager）、electron-builder（https://www.electron.build/）。

electron-packager依赖于Electron框架内部提供的自动升级机制，需要自己搭建自动升级服务器，才能完成自动升级工作。

electron-builder则内置自动升级机制，把打包出的文件随意存储到一个Web服务器上即可完成自动升级（比如七牛云对象存储服务或阿里云的OSS服务）。 

这两个项目都是Electron官方团队维护的，electron-packager直接挂载Electron组织下，electron-builder项目挂在electron-userland组织（也由Electron团队创建）下。”

基于以上对比，显然electron-builder更胜一筹。

如果你是使用Vue CLI Plugin Electron Builder创建的项目，那么工程内自带electron-builder。你只需要执行package.json中默认配置的打包指令即可完成打包工作： 

```shell
$ yarn electron:build
```

打包过程比较慢，需耐心等待。打包完成后会在[your project]/dist_electron目录下生成一系列的文件。

其中[your_project_name]Setup[your_project_version].exe即你要分发给你的用户的安装文件。Mac环境下待分发的文件为[your_project_name]-[your_project_version].dmg。

[your_project_path]/dist_electron/win-unpacked这个目录下存放的是未打包的可执行程序及其相关依赖库。Mac环境下的.app文件存放在[your_project_path]/dist_electron/mac目录下。

> 扩展：
>
> 除electron-packager和electron-builder外，你还可以考虑使用electron-forge（https://www.electronforge.io/）作为你的打包工具。这个项目也是由Electron团队开发的，目标是使Electron项目的创建、发布、安装工作更简便。以此工具创建的项目可以很方便地集成webpack和原生的Node.js模块。它也可以把应用程序打包成安装文件，但需要自己搭建服务器才能实现自动升级，不像electron-builder那样简单。
>

### 2.1减少安装包大小

Electron的缺点之一就是安装包巨大，如不做特殊处理，每次升级就都相当于重新下载了一次安装包，虽然现在网络条件越来越好，但动辄四五十兆大小的安装包还是给应用的分发带来了阻碍。一个可行的解决方案是：使用C++开发一个应用程序安装器，开发者把这个安装器分发给用户，当用户打开这个安装器的时候，安装器下载Electron的可执行文件、动态库以及应用程序的各种资源，下载完成后创建开始菜单图标或桌面图标。当用户点击应用图标启动应用时，启动的是Electron的可执行程序。由于安装器逻辑简单，没有携带与Electron有关的资源，所以可以确保安装器足够轻量，易于分发。

当应用程序升级的时候，如果不需要升级Electron自身，就不必下载Electron的可执行程序及动态库，只需要下载你修改过的程序文件及资源即可（可能仅仅是一个asar文件）。 

如果你没有一个高性能服务器，那么用户通过安装器下载应用所需文件时，可能会对你的服务器造成巨大的网络压力，这时你可以考虑把这些文件放置在CDN服务器上，或者让安装器分别从两处下载：从淘宝镜像网站下载Electron的可执行文件及其动态库，从你的服务器下载应用程序文件及其资源文件。 

如果你的应用只会分发给Windows用户，那么你可以通过配置electron-builder使其内部的NSIS打包工具从网络下载程序必备的文件，这样就不用再开发一个独立的安装器了，具体配置文档详见https://www.electron.build/configuration/nsis#web-installer。

## 3.代码签名

在应用程序分发给用户的过程中，开发者很难知道应用是否被篡改过。如果不加防范，很可能会对用户造成伤害。操作系统也提供了相应的机制来提醒用户这类风险：在Mac操作系统下，默认只允许安装来自Mac App Store的应用；Windows系统下安装未签名的应用程序会给出安全提示。作为一种安全技术，代码签名可以用来证明应用是由你创建的。

### 3.1Windows应用程序签名

如果要给Windows应用程序签名，首先我们需要购买代码签名证书。你可以在digicert（https://www.digicert.com/code-signing/microsoft-authenticode.htm）、Comodo（https://www.comodo.com/landing/ssl-certificate/authenticode-signature/）或GoDaddy（https://au.godaddy.com/web-security/code-signing-certificate）等平台按时间付费的方式购买代码签名证书。

如果你使用electron-builder来打包你的应用，待证书购买好之后可以按照https://www.electron.build/configuration/win文档所述步骤进行证书的配置。 
如果你是使用Vue CLI Plugin Electron Builder创建的项目，配置信息将被放置在vue.config.js中，代码如下：

```js
module.exports = {
    productionSourceMap: false,
    pluginOptions: {
        electronBuilder: {
            builderOptions: {
                win: {
                    signingHashAlgorithms: ['sha1', 'sha256'],
                    certificateFile: "./customSign.pfx",
                    certificatePassword:"********",
                    certificateSubjectName:'your certificate subject name'
                    // ...
                }
            },
            mainProcessFile: 'public/background/start.js',
        },
    }
}
```

其中customSign.pfx为证书颁发机构颁发给你的证书文件，certificatePassword为证书密码。

### 3.2Mac代码签名

在Mac平台上使用electron-builder打包应用时，一般情况下不用做额外的配置，electron-builder会自动加载Mac系统下钥匙串中的证书。但如果想获得证书则必须加入苹果开发者计划（这也是一个付费项目）。

## 4，自动升级

electron-builder内置自动升级的机制。

1. 首先需要修改应用程序的配置文件，增加如下配置节


```json
publish: [{
    provider: "generic",
    url: "http:        // download.yoursite.com"
}]
```

如果你是使用Vue CLI Plugin Electron Builder创建的项目，此配置节应该在builderOptions配置节下（见上一节代码签名的配置样例）。这里配置的URL路径就代表你把新版本安装包放在哪个地址下了，也就是说这是你的版本升级服务器。这个服务器并没有特殊的要求，只要可以通过HTTP协议下载文件即可，所以阿里云的OSS服务或者七牛云对象存储服务均可使用。 
接着需要在主进程中加入如下代码：

```js
const { autoUpdater } = require('electron-updater');
autoUpdater.checkForUpdates();
autoUpdater.on('update-downloaded', () => {
“this.mainWin.webContents.send('updateDownLoaded');
})
ipcMain.on('quitAndInstall', (event) => {
    autoUpdater.quitAndInstall();
});
```

> 注意：这段逻辑应在窗口启动后的适当的时机执行，尽量不要占用窗口启动的宝贵时间。 
>

autoUpdater模块负责管理应用程序升级，checkForUpdates方法会检查配置文件中Web服务地址下是否存在比当前版本更新的安装程序，如果有则开始下载。下载完成后将给渲染进程发送一个消息，由渲染进程提示用户“当前有新版本，是否需要升级”。当用户选择升级之后，再由渲染进程发送'quitAndInstall'消息给主进程。主进程接到此消息后，执行autoUpdater.quitAndInstall();方法，此时应用程序退出，并安装刚才下载好的新版本的应用程序。安装完成后重启应用程序。 

autoUpdater模块是根据package.json中的版本号来判断当前版本是否比服务器上的版本老的。所以打包新版本时，一定要更新package.json中的version配置。 

新版本打包完成后，Windows平台需要把[your_project_name]Setup[your_project_version].exe和latest.yml两个文件上传到你的升级服务器；Mac平台需要把[your_project_name]-[your_project_version]-mac.zip、[your_project_name]-[your_project_version].dmg和latest-mac.yml三个文件上传到你的升级服务器；Linux平台需要把[your_project_name]-[your_project_version[…]













