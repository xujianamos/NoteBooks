# 1.OS 模块

`os` 模块是 Python 标准库中的一个重要模块，它提供了与操作系统交互的功能。通过 `os` 模块，你可以执行文件操作、目录操作、环境变量管理、进程管理等任务。`os` 模块是跨平台的，这意味着你可以在不同的操作系统（如 Windows、Linux、macOS）上使用相同的代码。在使用 `os` 模块之前，你需要先导入它。导入 `os` 模块的代码如下：

```bash
import os
```

## 1.1常用功能

### 1.1.1 获取当前工作目录

`os.getcwd()` 函数用于获取当前工作目录的路径。当前工作目录是 Python 脚本执行时所在的目录。

```python
current_directory = os.getcwd()
print("当前工作目录:", current_directory)
```

### 1.1.2. 改变当前工作目录

`os.chdir(path)` 函数用于改变当前工作目录。`path` 是你想要切换到的目录路径。

```py
os.chdir("/path/to/new/directory")
print("新的工作目录:", os.getcwd())
```

### 1.1.3. 列出目录内容

`os.listdir(path)` 函数用于列出指定目录中的所有文件和子目录。如果不提供 `path` 参数，则默认列出当前工作目录的内容。

```python
files_and_dirs = os.listdir()
print("目录内容:", files_and_dirs)
```

### 1.1.4. 创建目录

`os.mkdir(path)` 函数用于创建一个新的目录。如果目录已经存在，会抛出 `FileExistsError` 异常。

```python
os.mkdir("new_directory")
```

### 1.1.5. 删除目录

`os.rmdir(path)` 函数用于删除一个空目录。如果目录不为空，会抛出 `OSError` 异常。

```python
os.rmdir("new_directory")
```

### 1.1.6. 删除文件

`os.remove(path)` 函数用于删除一个文件。如果文件不存在，会抛出 `FileNotFoundError` 异常。

```py
os.remove("file_to_delete.txt")
```

### 1.1.7. 重命名文件或目录

`os.rename(src, dst)` 函数用于重命名文件或目录。`src` 是原始路径，`dst` 是新的路径。

```python
os.rename("old_name.txt", "new_name.txt")
```

### 1.1.8 获取环境变量

`os.getenv(key)` 函数用于获取指定环境变量的值。如果环境变量不存在，返回 `None`。

```python
home_directory = os.getenv("HOME")
print("HOME 目录:", home_directory)
```

### 1.1.9 执行系统命令

`os.system(command)` 函数用于在操作系统的 shell 中执行命令。命令执行后，返回命令的退出状态。

```python
os.system("ls -l")
```

## 1.2常用方法

1. 检验权限模式：`os.access(path, mode)`



2. 改变当前工作目录:`os.chdir(path)`



3. 设置路径的标记为数字标记:`os.chflags(path, flags)`



4. 更改权限:`os.chmod(path, mode)`



5. 更改文件所有者:`os.chown(path, uid, gid)`



6. 改变当前进程的根目录:`os.chroot(path)`



7. 关闭文件描述符 fd:`os.close(fd)`



8. 关闭所有文件描述符，从 fd_low (包含) 到 fd_high (不包含), 错误会忽略:`os.closerange(fd_low, fd_high)`



9. 复制文件描述符 fd:`os.dup(fd)`



10. 将一个文件描述符 fd 复制到另一个 fd2:`os.dup2(fd, fd2)`



11. 通过文件描述符改变当前工作目录:`os.fchdir(fd)`



12. 改变一个文件的访问权限，该文件由参数fd指定，参数mode是Unix下的文件访问权限:`os.fchmod(fd, mode)`



13. 修改一个文件的所有权，这个函数修改一个文件的用户ID和用户组ID，该文件由文件描述符fd指定:`os.fchown(fd, uid, gid)`



14. 强制将文件写入磁盘，该文件由文件描述符fd指定，但是不强制更新文件的状态信息:`os.fdatasync(fd)`



15. 通过文件描述符 fd 创建一个文件对象，并返回这个文件对象:`os.fdopen(fd[, mode[, bufsize\]])`



16. 返回一个打开的文件的系统配置信息。name为检索的系统配置的值，它也许是一个定义系统值的字符串，这些名字在很多标准中指定（POSIX.1, Unix 95, Unix 98, 和其它）:`os.fpathconf(fd, name)`



17. 返回文件描述符fd的状态，像stat():`os.fstat(fd)`



18. 返回包含文件描述符fd的文件的文件系统的信息，Python 3.3 相等于 statvfs():`os.fstatvfs(fd)`



19. 强制将文件描述符为fd的文件写入硬盘:`os.fsync(fd)`



20. 裁剪文件描述符fd对应的文件, 所以它最大不能超过文件大小:`os.ftruncate(fd, length)`



21. 返回当前工作目录:`os.getcwd()`



22. 返回一个当前工作目录的Unicode对象:`os.getcwdb()`



23. 如果文件描述符fd是打开的，同时与tty(-like)设备相连，则返回true, 否则False:`os.isatty(fd)`



24. 设置路径的标记为数字标记，类似 chflags()，但是没有软链接:`os.lchflags(path, flags)`



25. 修改连接文件权限:`os.lchmod(path, mode)`



26. 更改文件所有者，类似 chown，但是不追踪链接:`os.lchown(path, uid, gid)`



27. 创建硬链接，名为参数 dst，指向参数 src:`os.link(src, dst)`



28. 返回path指定的文件夹包含的文件或文件夹的名字的列表:`os.listdir(path)`



29. 设置文件描述符 fd当前位置为pos, how方式修改: SEEK_SET 或者 0 设置从文件开始的计算的pos; SEEK_CUR或者 1 则从当前位置计算; os.SEEK_END或者2则从文件尾部开始. 在unix，Windows中有效

```python
os.lseek(fd, pos, how)
```

30. 像stat(),但是没有软链接:`os.lstat(path)`



31. 从原始的设备号中提取设备major号码 (使用stat中的st_dev或者st_rdev field):`os.major(device)`



32. 以major和minor设备号组成一个原始设备号:`os.makedev(major, minor)`



33. `os.makedirs(path[, mode\])`

递归文件夹创建函数。像mkdir(), 但创建的所有intermediate-level文件夹需要包含子文件夹。

34. `os.minor(device)`

从原始的设备号中提取设备minor号码 (使用stat中的st_dev或者st_rdev field )。

35. `os.mkdir(path[, mode\])`

以数字mode的mode创建一个名为path的文件夹.默认的 mode 是 0777 (八进制)

36. `os.mkfifo(path[, mode\])`

创建命名管道，mode 为数字，默认为 0666 (八进制)

37. `os.mknod(filename[, mode=0600, device\])`

创建一个名为filename文件系统节点（文件，设备特别文件或者命名pipe）。

38. `os.open(file, flags[, mode])`

打开一个文件，并且设置需要的打开选项，mode参数是可选的

39. `os.openpty()`

打开一个新的伪终端对。返回 pty 和 tty的文件描述符。

40. `os.pathconf(path, name)`

返回相关文件的系统配置信息

41. `os.pipe()`

创建一个管道. 返回一对文件描述符(r, w) 分别为读和写

42. `os.popen(command[, mode[, bufsize]])`

从一个 command 打开一个管道

43. `os.read(fd, n)`

从文件描述符 fd 中读取最多 n 个字节，返回包含读取字节的字符串，文件描述符 fd对应文件已达到结尾, 返回一个空字符串。

44. `os.readlink(path)`

返回软链接所指向的文件

45. `os.remove(path)`

删除路径为path的文件。如果path 是一个文件夹，将抛出OSError; 查看下面的rmdir()删除一个 directory。

46. `os.removedirs(path)`

递归删除目录

47. `os.rename(src, dst)`

重命名文件或目录，从 src 到 dst

48. `os.renames(old, new)`

递归地对目录进行更名，也可以对文件进行更名。

49. `os.rmdir(path)`

删除path指定的空目录，如果目录非空，则抛出一个OSError异常。

50. `os.stat(path)`

获取path指定的路径的信息，功能等同于C API中的stat()系统调用。

51. `os.stat_float_times([newvalue])`

决定stat_result是否以float对象显示时间戳

52. `os.statvfs(path)`

获取指定路径的文件系统统计信息

53. `os.symlink(src, dst)`

创建一个软链接

54. `os.tcgetpgrp(fd)`

返回与终端fd（一个由os.open()返回的打开的文件描述符）关联的进程组

55. `os.tcsetpgrp(fd, pg)`

设置与终端fd（一个由os.open()返回的打开的文件描述符）关联的进程组为pg。

56. `os.ttyname(fd)`

返回一个字符串，它表示与文件描述符fd 关联的终端设备。如果fd 没有与终端设备关联，则引发一个异常。

57. `os.unlink(path)`

删除文件路径

58. `os.utime(path, times)`

返回指定的path文件的访问和修改的时间。

59. `os.walk(top[, topdown=True[, onerror=None[, followlinks=False\]]])`

输出在文件夹中的文件名通过在树中游走，向上或者向下。

60. `os.write(fd, str)`

写入字符串到文件描述符 fd中. 返回实际写入的字符串长度

61. `os.path 模块`

获取文件的属性信息。

62. `os.pardir()`

获取当前目录的父目录，以字符串形式显示目录名。

63. `os.replace()`

重命名文件或目录。

64. `os.startfile()`

用于在 Windows 上打开一个文件或文件夹。

# 2.sys 模块

`sys` 是 Python 标准库中的一个模块，提供了与 Python 解释器及其环境交互的功能。通过 `sys` 库，你可以访问与 Python 解释器

相关的变量和函数，例如命令行参数、标准输入输出、程序退出等。

## 2.1基本使用

在使用 `sys` 库之前，你需要先导入它。

```python
import sys

# 列出 os 模块的所有属性和方法
print(dir(os))
```

## 2.2sys 库的常用功能

### 2.2.1命令行参数

`sys.argv` 是一个包含命令行参数的列表。`sys.argv[0]` 是脚本的名称，后续元素是传递给脚本的参数。

```python
import sys

print("脚本名称:", sys.argv[0])
print("参数列表:", sys.argv[1:])
```

**运行方式：**

```bash
python script.py arg1 arg2
```

**输出结果：**

```python
脚本名称: script.py
参数列表: ['arg1', 'arg2']
```

### 2.2.2程序退出

`sys.exit()` 用于退出程序。你可以传递一个整数作为退出状态码，通常 `0` 表示成功，非零值表示错误。

```python
import sys

print("程序开始")
sys.exit(0)
print("这行代码不会执行")
```

### 2.2.3标准输入输出

`sys.stdin`、`sys.stdout` 和 `sys.stderr` 分别代表标准输入、标准输出和标准错误流。你可以重定向这些流以实现自定义的输入输出行为。

```python
import sys

# 重定向标准输出到文件
with open('output.txt', 'w') as f:
    sys.stdout = f
    print("这行内容将写入 output.txt")

# 恢复标准输出
sys.stdout = sys.__stdout__
print("这行内容将显示在控制台")
```

### 2.2.4Python 版本信息

`sys.version` 和 `sys.version_info` 提供了当前 Python 解释器的版本信息。

```python
import sys

print("Python 版本:", sys.version)
print("版本信息:", sys.version_info)
```

**输出结果：**

```python
<code>Python 版本: 3.9.7 (default, Aug 31 2021, 13:28:12) 
[GCC 7.5.0]
版本信息: sys.version_info(major=3, minor=9, micro=7, releaselevel=&#39;final&#39;, serial=0)
</code>
```

### 2.2.5.模块搜索路径

`sys.path` 是一个列表，包含了 Python 解释器在导入模块时搜索的路径。你可以修改这个列表来添加自定义的模块搜索路径。

```python
import sys

print("模块搜索路径:", sys.path)
sys.path.append('/custom/path')
print("更新后的模块搜索路径:", sys.path)
```

## 2.3sys 模块常用属性

| 属性             | 说明                                                    |
| :--------------- | :------------------------------------------------------ |
| `sys.argv`       | 命令行参数列表，`sys.argv[0]` 是脚本名称                |
| `sys.path`       | Python 模块搜索路径（`PYTHONPATH`）                     |
| `sys.modules`    | 已加载模块的字典                                        |
| `sys.platform`   | 操作系统平台标识（如 `'win32'`, `'linux'`, `'darwin'`） |
| `sys.version`    | Python 解释器版本信息                                   |
| `sys.executable` | Python 解释器的绝对路径                                 |
| `sys.stdin`      | 标准输入流（文件对象）                                  |
| `sys.stdout`     | 标准输出流（文件对象）                                  |
| `sys.stderr`     | 标准错误流（文件对象）                                  |
| `sys.byteorder`  | 字节序（`'little'` 或 `'big'`）                         |
| `sys.maxsize`    | 最大整数值（`2**31-1` 或 `2**63-1`）                    |

------

## 2.4sys 模块常用方法

| 方法                           | 说明                                           |
| :----------------------------- | :--------------------------------------------- |
| `sys.exit([status])`           | 退出程序，`status=0` 表示正常退出              |
| `sys.getsizeof(obj)`           | 返回对象占用的内存字节数                       |
| `sys.getdefaultencoding()`     | 获取默认字符串编码（通常 `'utf-8'`）           |
| `sys.setrecursionlimit(limit)` | 设置递归深度限制（默认 `1000`）                |
| `sys.getrecursionlimit()`      | 获取当前递归深度限制                           |
| `sys.getrefcount(obj)`         | 返回对象的引用计数                             |
| `sys.exc_info()`               | 获取当前异常信息（`(type, value, traceback)`） |
| `sys.settrace(tracefunc)`      | 设置调试跟踪函数                               |
| `sys.setprofile(profilefunc)`  | 设置性能分析函数                               |

















# 3.time模块

时间间隔是以秒为单位的浮点小数。每个时间戳都以自从 1970 年 1 月 1 日午夜（历元）经过了多长时间来表示。

```python
#!/usr/bin/python3

import time  # 引入time模块

ticks = time.time()
print ("当前时间戳为:", ticks) # 当前时间戳为: 1459996086.7115328
```

时间戳单位最适于做日期运算。但是1970年之前的日期就无法以此表示了。太遥远的日期也不行，UNIX和Windows只支持到2038年。

## 3.1什么是时间元组？

很多Python函数用一个元组装起来的9组数字处理时间:

| 序号 | 字段         | 值                                   |
| :--- | :----------- | :----------------------------------- |
| 0    | 4位数年      | 2008                                 |
| 1    | 月           | 1 到 12                              |
| 2    | 日           | 1到31                                |
| 3    | 小时         | 0到23                                |
| 4    | 分钟         | 0到59                                |
| 5    | 秒           | 0到61 (60或61 是闰秒)                |
| 6    | 一周的第几日 | 0到6 (0是周一)                       |
| 7    | 一年的第几日 | 1到366 (儒略历)                      |
| 8    | 夏令时       | -1, 0, 1, -1是决定是否为夏令时的标识 |

上述也就是 struct_time 元组。这种结构具有如下属性：

| 序号 | 属性     | 值                                                           |
| :--- | :------- | :----------------------------------------------------------- |
| 0    | tm_year  | 2008                                                         |
| 1    | tm_mon   | 1 到 12                                                      |
| 2    | tm_mday  | 1 到 31                                                      |
| 3    | tm_hour  | 0 到 23                                                      |
| 4    | tm_min   | 0 到 59                                                      |
| 5    | tm_sec   | 0 到 61 (60或61 是闰秒)                                      |
| 6    | tm_wday  | 0 到 6 (0是周一)                                             |
| 7    | tm_yday  | 一年中的第几天，1 到 366                                     |
| 8    | tm_isdst | 是否为夏令时，值有：1(夏令时)、0(不是夏令时)、-1(未知)，默认 -1 |

## 3.2获取当前时间

从返回浮点数的时间戳方式向时间元组转换，只要将浮点数传递给如localtime之类的函数。

```python
#!/usr/bin/python3

import time

localtime = time.localtime(time.time())
print ("本地时间为 :", localtime)
```

以上实例输出结果：

```python
本地时间为 : time.struct_time(tm_year=2016, tm_mon=4, tm_mday=7, tm_hour=10, tm_min=28, tm_sec=49, tm_wday=3, tm_yday=98, tm_isdst=0)
```

## 3.3获取格式化的时间

你可以根据需求选取各种格式，但是最简单的获取可读的时间模式的函数是asctime():

```python
#!/usr/bin/python3

import time

localtime = time.asctime( time.localtime(time.time()) )
print ("本地时间为 :", localtime)
```

以上实例输出结果：

```
本地时间为 : Thu Apr  7 10:29:13 2016
```

## 3.4格式化日期

我们可以使用 time 模块的 strftime 方法来格式化日期：

```
time.strftime(format[, t])
```

```python
#!/usr/bin/python3

import time

# 格式化成2016-03-20 11:45:39形式
print (time.strftime("%Y-%m-%d %H:%M:%S", time.localtime()))

# 格式化成Sat Mar 28 22:24:24 2016形式
print (time.strftime("%a %b %d %H:%M:%S %Y", time.localtime()))
  
# 将格式字符串转换为时间戳
a = "Sat Mar 28 22:24:24 2016"
print (time.mktime(time.strptime(a,"%a %b %d %H:%M:%S %Y")))
```

以上实例输出结果：

```
2016-04-07 10:29:46
Thu Apr 07 10:29:46 2016
1459175064.0
```

python中时间日期格式化符号：

- %y 两位数的年份表示（00-99）
- %Y 四位数的年份表示（000-9999）
- %m 月份（01-12）
- %d 月内中的一天（0-31）
- %H 24小时制小时数（0-23）
- %I 12小时制小时数（01-12）
- %M 分钟数（00=59）
- %S 秒（00-59）
- %a 本地简化星期名称
- %A 本地完整星期名称
- %b 本地简化的月份名称
- %B 本地完整的月份名称
- %c 本地相应的日期表示和时间表示
- %j 年内的一天（001-366）
- %p 本地A.M.或P.M.的等价符
- %U 一年中的星期数（00-53）星期天为星期的开始
- %w 星期（0-6），星期天为星期的开始
- %W 一年中的星期数（00-53）星期一为星期的开始
- %x 本地相应的日期表示
- %X 本地相应的时间表示
- %Z 当前时区的名称
- %% %号本身

## 3.5获取某月日历

Calendar 模块有很广泛的方法用来处理年历和月历，例如打印某月的月历：

```python
#!/usr/bin/python3

import calendar

cal = calendar.month(2016, 1)
print ("以下输出2016年1月份的日历:")
print (cal)
```

以上实例输出结果：

```
以下输出2016年1月份的日历:
    January 2016
Mo Tu We Th Fr Sa Su
             1  2  3
 4  5  6  7  8  9 10
11 12 13 14 15 16 17
18 19 20 21 22 23 24
25 26 27 28 29 30 31
```

## 3.6Time 模块

Time 模块包含了以下内置函数，既有时间处理的，也有转换时间格式的：

| 序号 | 函数及描述                                                   | 实例                                                         |
| :--- | :----------------------------------------------------------- | :----------------------------------------------------------- |
| 1    | time.altzone 返回格林威治西部的夏令时地区的偏移秒数。如果该地区在格林威治东部会返回负值（如西欧，包括英国）。对夏令时启用地区才能使用。 | 以下实例展示了 altzone()函数的使用方法：`>>> import time >>> print ("time.altzone %d " % time.altzone) time.altzone -28800 ` |
| 2    | time.asctime([tupletime]) 接受时间元组并返回一个可读的形式为"Tue Dec 11 18:07:14 2008"（2008年12月11日 周二18时07分14秒）的24个字符的字符串。 | 以下实例展示了 asctime()函数的使用方法：`>>> import time >>> t = time.localtime() >>> print ("time.asctime(t): %s " % time.asctime(t)) time.asctime(t): Thu Apr  7 10:36:20 2016 ` |
| 3    | [time.clock()](https://www.runoob.com/python3/python3-att-time-clock.html) 用以浮点数计算的秒数返回当前的CPU时间。用来衡量不同程序的耗时，比time.time()更有用。 | [实例](https://www.runoob.com/python3/python3-att-time-clock.html)由于该方法依赖操作系统，在 Python 3.3 以后不被推荐，而在 3.8 版本中被移除，需使用下列两个函数替代。`time.perf_counter()  # 返回系统运行时间 time.process_time()  # 返回进程运行时间` |
| 4    | time.ctime([secs]) 作用相当于asctime(localtime(secs))，未给参数相当于asctime() | 以下实例展示了 ctime()函数的使用方法：`>>> import time >>> print ("time.ctime() : %s" % time.ctime()) time.ctime() : Thu Apr  7 10:51:58 2016` |
| 5    | time.gmtime([secs]) 接收时间戳（1970纪元后经过的浮点秒数）并返回格林威治天文时间下的时间元组t。注：t.tm_isdst始终为0 | 以下实例展示了 gmtime()函数的使用方法：`>>> import time >>> print ("gmtime :", time.gmtime(1455508609.34375)) gmtime : time.struct_time(tm_year=2016, tm_mon=2, tm_mday=15, tm_hour=3, tm_min=56, tm_sec=49, tm_wday=0, tm_yday=46, tm_isdst=0)` |
| 6    | time.localtime([secs] 接收时间戳（1970纪元后经过的浮点秒数）并返回当地时间下的时间元组t（t.tm_isdst可取0或1，取决于当地当时是不是夏令时）。 | 以下实例展示了 localtime()函数的使用方法：`>>> import time >>> print ("localtime(): ", time.localtime(1455508609.34375)) localtime():  time.struct_time(tm_year=2016, tm_mon=2, tm_mday=15, tm_hour=11, tm_min=56, tm_sec=49, tm_wday=0, tm_yday=46, tm_isdst=0)` |
| 7    | [time.mktime(tupletime)](https://www.runoob.com/python3/python3-att-time-mktime.html) 接受时间元组并返回时间戳（1970纪元后经过的浮点秒数）。 | [实例](https://www.runoob.com/python3/python3-att-time-mktime.html) |
| 8    | time.sleep(secs) 推迟调用线程的运行，secs指秒数。            | 以下实例展示了 sleep()函数的使用方法：`#!/usr/bin/python3 import time print ("Start : %s" % time.ctime()) time.sleep( 5 ) print ("End : %s" % time.ctime())` |
| 9    | time.strftime(fmt[,tupletime]) 接收以时间元组，并返回以可读字符串表示的当地时间，格式由fmt决定。 | 以下实例展示了 strftime()函数的使用方法：`>>> import time >>> print (time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())) 2016-04-07 11:18:05` |
| 10   | time.strptime(str,fmt='%a %b %d %H:%M:%S %Y') 根据fmt的格式把一个时间字符串解析为时间元组。 | 以下实例展示了 strptime()函数的使用方法：`>>> import time >>> struct_time = time.strptime("30 Nov 00", "%d %b %y") >>> print ("返回元组: ", struct_time) 返回元组:  time.struct_time(tm_year=2000, tm_mon=11, tm_mday=30, tm_hour=0, tm_min=0, tm_sec=0, tm_wday=3, tm_yday=335, tm_isdst=-1)` |
| 11   | time.time( ) 返回当前时间的时间戳（1970纪元后经过的浮点秒数）。 | 以下实例展示了 time()函数的使用方法：`>>> import time >>> print(time.time()) 1459999336.1963577` |
| 12   | [time.tzset()](https://www.runoob.com/python3/python3-att-time-tzset.html) 根据环境变量TZ重新初始化时间相关设置。 | [实例](https://www.runoob.com/python3/python3-att-time-tzset.html) |
| 13   | **time.perf_counter()** 返回计时器的精准时间（系统的运行时间），包含整个系统的睡眠时间。由于返回值的基准点是未定义的，所以，只有连续调用的结果之间的差才是有效的。 | [实例](https://www.runoob.com/python3/python3-date-time.html#comment-35499) |
| 14   | **time.process_time()** 返回当前进程执行 CPU 的时间总和，不包含睡眠时间。由于返回值的基准点是未定义的，所以，只有连续调用的结果之间的差才是有效的。 |                                                              |

Time模块包含了以下2个非常重要的属性：

| 序号 | 属性及描述                                                   |
| :--- | :----------------------------------------------------------- |
| 1    | **time.timezone** 属性time.timezone是当地时区（未启动夏令时）距离格林威治的偏移秒数（>0，美洲;<=0大部分欧洲，亚洲，非洲）。 |
| 2    | **time.tzname** 属性time.tzname包含一对根据情况的不同而不同的字符串，分别是带夏令时的本地时区名称，和不带的。 |

------

## 3.7日历（Calendar）模块

此模块的函数都是日历相关的，例如打印某月的字符月历。

星期一是默认的每周第一天，星期天是默认的最后一天。更改设置需调用calendar.setfirstweekday()函数。模块包含了以下内置函数：

| 序号 | 函数及描述                                                   |
| :--- | :----------------------------------------------------------- |
| 1    | **calendar.calendar(year,w=2,l=1,c=6)** 返回一个多行字符串格式的 year 年年历，3 个月一行，间隔距离为 c。 每日宽度间隔为w字符。每行长度为 **21\* W+18+2\* C**。**l** 是每星期行数。 |
| 2    | **calendar.firstweekday( )** 返回当前每周起始日期的设置。默认情况下，首次载入 calendar 模块时返回 0，即星期一。 |
| 3    | **calendar.isleap(year)** 是闰年返回 True，否则为 False。`>>> import calendar >>> print(calendar.isleap(2000)) True >>> print(calendar.isleap(1900)) False` |
| 4    | **calendar.leapdays(y1,y2)** 返回在Y1，Y2两年之间的闰年总数。 |
| 5    | **calendar.month(year,month,w=2,l=1)** 返回一个多行字符串格式的year年month月日历，两行标题，一周一行。每日宽度间隔为w字符。每行的长度为7* w+6。l是每星期的行数。 |
| 6    | **calendar.monthcalendar(year,month)** 返回一个整数的单层嵌套列表。每个子列表装载代表一个星期的整数。Year年month月外的日期都设为0;范围内的日子都由该月第几日表示，从1开始。 |
| 7    | **calendar.monthrange(year,month)** 返回两个整数。第一个是该月的星期几，第二个是该月有几天。星期几是从0（星期一）到 6（星期日）。`>>> import calendar >>> calendar.monthrange(2014, 11) (5, 30)`(5, 30)解释：5 表示 2014 年 11 月份的第一天是周六，30 表示 2014 年 11 月份总共有 30 天。 |
| 8    | **calendar.prcal(year, w=0, l=0, c=6, m=3)** 相当于 print (calendar.calendar(year, w=0, l=0, c=6, m=3))。 |
| 9    | **calendar.prmonth(theyear, themonth, w=0, l=0)** 相当于 **print(calendar.month(theyear, themonth, w=0, l=0))**。 |
| 10   | **calendar.setfirstweekday(weekday)** 设置每周的起始日期码。0（星期一）到6（星期日）。 |
| 11   | **calendar.timegm(tupletime)** 和time.gmtime相反：接受一个时间元组形式，返回该时刻的时间戳（1970纪元后经过的浮点秒数）。 |
| 12   | **calendar.weekday(year,month,day)** 返回给定日期的日期码。0（星期一）到6（星期日）。月份为 1（一月） 到 12（12月）。 |



# 4.datetime 模块

Python 的 `datetime` 模块是用于处理日期和时间的标准库模块。它提供了多种类和函数，可以帮助我们轻松地处理日期、时间、时间差等操作。无论是获取当前时间、格式化日期，还是计算时间差，`datetime` 模块都能胜任。

## datetime 模块的核心类

`datetime` 模块中包含了以下几个核心类：

- `date` 类 - `date` 类用于表示日期，包含年、月、日三个属性。
- `time` 类 - `time` 类用于表示时间，包含时、分、秒、微秒等属性。
- `datetime` 类 -`datetime` 类是 `date` 和 `time` 的结合体，可以同时表示日期和时间。
- `timedelta` 类 - `timedelta` 类用于表示时间差，可以用于日期和时间的加减操作。

## 使用 datetime 模块

### 获取当前日期和时间

我们可以使用 `datetime` 类的 `now()` 方法来获取当前的日期和时间。

```python
from datetime import datetime

# 获取当前日期和时间
now = datetime.now()
print("当前时间:", now) # 当前时间: 2025-04-22 14:30:45.123456
```

### 创建特定的日期和时间

我们可以通过 `datetime` 类的构造函数来创建特定的日期和时间。

```python
from datetime import datetime

# 创建特定的日期和时间
specific_time = datetime(2025, 4, 22, 15, 30, 0)
print("特定时间:", specific_time) # 特定时间: 2025-04-22 15:30:00
```

### 格式化日期和时间

`datetime` 对象可以通过 `strftime()` 方法格式化为字符串。

```python
from datetime import datetime

# 获取当前时间
now = datetime.now()

# 格式化输出
formatted_time = now.strftime("%Y-%m-%d %H:%M:%S")
print("格式化时间:", formatted_time) #格式化时间: 2025-04-22 14:30:45
```

### 计算时间差

`timedelta` 类可以用于计算两个日期或时间之间的差值。

```python
from datetime import datetime, timedelta

# 获取当前时间
now = datetime.now()

# 计算 10 天后的时间
future_time = now + timedelta(days=10)
print("10 天后的时间:", future_time)# 10 天后的时间: 2025-05-02 14:30:45.123456
```

## 常见应用场景

### 计算两个日期之间的天数

```python
from datetime import date

# 创建两个日期
date1 = date(2025, 4, 22)
date2 = date(2025, 5, 1)

# 计算天数差
delta = date2 - date1
print("两个日期之间的天数差:", delta.days)# 两个日期之间的天数差: 9
```

### 处理时区

`datetime` 模块本身不直接支持时区操作，但可以通过 `pytz` 库来处理时区。

```python
from datetime import datetime
import pytz

# 获取当前时间并设置时区
now = datetime.now(pytz.timezone('Asia/Shanghai'))
print("上海当前时间:", now)#上海当前时间: 2025-04-22 14:30:45.123456+08:00
```

## 常用类、方法及属性

### **1. 核心类**

| 类                       | 说明                            | 示例                            |
| :----------------------- | :------------------------------ | :------------------------------ |
| **`datetime.date`**      | 日期类（年、月、日）            | `date(2023, 5, 15)`             |
| **`datetime.time`**      | 时间类（时、分、秒、微秒）      | `time(14, 30, 0)`               |
| **`datetime.datetime`**  | 日期时间类（包含日期和时间）    | `datetime(2023, 5, 15, 14, 30)` |
| **`datetime.timedelta`** | 时间间隔类（用于日期/时间计算） | `timedelta(days=5)`             |
| **`datetime.tzinfo`**    | 时区信息基类（需子类化实现）    | 自定义时区类                    |

### **2. `date` 对象常用方法/属性**

| 方法/属性                     | 说明                           | 示例                                      |
| :---------------------------- | :----------------------------- | :---------------------------------------- |
| **`date.today()`**            | 返回当前本地日期               | `date.today()` → `date(2023, 5, 15)`      |
| **`date.fromisoformat(str)`** | 从 `YYYY-MM-DD` 字符串解析日期 | `date.fromisoformat("2023-05-15")`        |
| **`date.year`**               | 年份（只读）                   | `d.year` → `2023`                         |
| **`date.month`**              | 月份（1-12，只读）             | `d.month` → `5`                           |
| **`date.day`**                | 日（1-31，只读）               | `d.day` → `15`                            |
| **`date.weekday()`**          | 返回星期几（0=周一，6=周日）   | `d.weekday()` → `0`                       |
| **`date.isoformat()`**        | 返回 `YYYY-MM-DD` 格式字符串   | `d.isoformat()` → `"2023-05-15"`          |
| **`date.strftime(format)`**   | 自定义格式化输出               | `d.strftime("%Y/%m/%d")` → `"2023/05/15"` |

### **3. `time` 对象常用方法/属性**

| 方法/属性                   | 说明                              | 示例                              |
| :-------------------------- | :-------------------------------- | :-------------------------------- |
| **`time.hour`**             | 小时（0-23，只读）                | `t.hour` → `14`                   |
| **`time.minute`**           | 分钟（0-59，只读）                | `t.minute` → `30`                 |
| **`time.second`**           | 秒（0-59，只读）                  | `t.second` → `0`                  |
| **`time.microsecond`**      | 微秒（0-999999，只读）            | `t.microsecond` → `0`             |
| **`time.isoformat()`**      | 返回 `HH:MM:SS.mmmmmm` 格式字符串 | `t.isoformat()` → `"14:30:00"`    |
| **`time.strftime(format)`** | 自定义格式化输出                  | `t.strftime("%H:%M")` → `"14:30"` |

### **4. `datetime` 对象常用方法/属性**

| 方法/属性                        | 说明                         | 示例                                                   |
| :------------------------------- | :--------------------------- | :----------------------------------------------------- |
| **`datetime.now()`**             | 返回当前本地日期时间         | `datetime.now()` → `datetime(2023, 5, 15, 14, 30, 0)`  |
| **`datetime.utcnow()`**          | 返回当前 UTC 日期时间        | `datetime.utcnow()`                                    |
| **`datetime.fromtimestamp(ts)`** | 从时间戳创建 `datetime` 对象 | `datetime.fromtimestamp(1684146600)`                   |
| **`datetime.timestamp()`**       | 返回时间戳（浮点数秒）       | `dt.timestamp()` → `1684146600.0`                      |
| **`datetime.date()`**            | 提取日期部分                 | `dt.date()` → `date(2023, 5, 15)`                      |
| **`datetime.time()`**            | 提取时间部分                 | `dt.time()` → `time(14, 30)`                           |
| **`datetime.year`**              | 年份（同 `date`）            | `dt.year` → `2023`                                     |
| **`datetime.strftime(format)`**  | 自定义格式化输出             | `dt.strftime("%Y-%m-%d %H:%M")` → `"2023-05-15 14:30"` |

### **5. `timedelta` 对象常用属性**

| 属性               | 说明               | 示例                              |
| :----------------- | :----------------- | :-------------------------------- |
| **`days`**         | 天数（可正可负）   | `delta.days` → `5`                |
| **`seconds`**      | 秒数（0-86399）    | `delta.seconds` → `3600`（1小时） |
| **`microseconds`** | 微秒数（0-999999） | `delta.microseconds` → `0`        |

### **6. 常用格式化符号（`strftime`）**

| 符号 | 说明                  | 示例输出 |
| :--- | :-------------------- | :------- |
| `%Y` | 四位年份              | `2023`   |
| `%m` | 两位月份（01-12）     | `05`     |
| `%d` | 两位日（01-31）       | `15`     |
| `%H` | 24小时制小时（00-23） | `14`     |
| `%M` | 分钟（00-59）         | `30`     |
| `%S` | 秒（00-59）           | `00`     |
| `%A` | 完整星期名            | `Monday` |
| `%a` | 缩写星期名            | `Mon`    |
| `%B` | 完整月份名            | `May`    |
| `%b` | 缩写月份名            | `May`    |

## 实例

1. 计算日期差

```python
from datetime import date, timedelta

d1 = date(2023, 5, 15)
d2 = date(2023, 6, 1)
delta = d2 - d1  # 返回 timedelta 对象
print(delta.days)  # 输出: 17
```

2. 时间加减

```python
from datetime import datetime, timedelta

now = datetime.now()
future = now + timedelta(days=3, hours=2)
print(future.strftime("%Y-%m-%d %H:%M"))
```

3. 时区转换（需安装 pytz）

```python
from datetime import datetime
import pytz

utc_time = datetime.utcnow().replace(tzinfo=pytz.utc)
beijing_time = utc_time.astimezone(pytz.timezone("Asia/Shanghai"))
print(beijing_time)
```

4. 解析字符串

```python
from datetime import datetime

dt = datetime.strptime("2023-05-15 14:30", "%Y-%m-%d %H:%M")
print(dt.year)  # 输出: 2023
```

## 注意事项

1. **不可变性**：所有 `datetime` 对象不可变，操作会返回新对象。
2. **时区处理**：原生 `datetime` 无时区支持，需用 `pytz` 或 Python 3.9+ 的 `zoneinfo`。
3. **性能**：频繁创建对象可能影响性能，考虑重用或缓存。
4. **边界检查**：非法日期（如 `date(2023, 2, 30)`）会触发 `ValueError`。

# 5.random 模块

Python **random** 模块主要用于生成随机数。**random** 模块实现了各种分布的伪随机数生成器。

接下来我们使用 [random()](https://www.runoob.com/python3/python3-func-number-random.html) 方法返回一个随机数，它在[半开放区间](https://www.runoob.com/w3cnote/programming-range.html) **[0,1)** 范围内，包含 0 但不包含 1。

```python
# 导入 random 包
import random

# 生成随机数
print(random.random()) # 0.4784904215869241
```

**[seed()](https://www.runoob.com/python3/python3-func-number-seed.html)** 方法改变随机数生成器的种子，可以在调用其他随机模块函数之前调用此函数。

```python
#!/usr/bin/python3
import random

random.seed()
print ("使用默认种子生成随机数：", random.random())
print ("使用默认种子生成随机数：", random.random())

random.seed(10)
print ("使用整数 10 种子生成随机数：", random.random())
random.seed(10)
print ("使用整数 10 种子生成随机数：", random.random())

random.seed("hello",2)
print ("使用字符串种子生成随机数：", random.random())
```

以上实例运行后输出结果为：

```
使用默认种子生成随机数： 0.7908102856355441
使用默认种子生成随机数： 0.81038961519195
使用整数 10 种子生成随机数： 0.5714025946899135
使用整数 10 种子生成随机数： 0.5714025946899135
使用字符串种子生成随机数： 0.3537754404730722
```

# 6.json 模块

Python3 中可以使用 json 模块来对 JSON 数据进行编解码，它包含了两个函数：

- **json.dumps():** 对数据进行编码。
- **json.loads():** 对数据进行解码。

![img](https://noteimagebuket.oss-cn-hangzhou.aliyuncs.com/typora/202601111447660.png)

在 json 的编解码过程中，Python 的原始类型与 json 类型会相互转换，具体的转化对照如下：

### 6.1Python 编码为 JSON 类型转换对应表：

| Python                                 | JSON   |
| :------------------------------------- | :----- |
| dict                                   | object |
| list, tuple                            | array  |
| str                                    | string |
| int, float, int- & float-derived Enums | number |
| True                                   | true   |
| False                                  | false  |
| None                                   | null   |

### 6.2JSON 解码为 Python 类型转换对应表：

| JSON          | Python |
| :------------ | :----- |
| object        | dict   |
| array         | list   |
| string        | str    |
| number (int)  | int    |
| number (real) | float  |
| true          | True   |
| false         | False  |
| null          | None   |

### 6.3json.dumps 与 json.loads 实例

以下实例演示了 Python 数据结构转换为JSON：

```python
#!/usr/bin/python3
 
import json
 
# Python 字典类型转换为 JSON 对象
data = {
    'no' : 1,
    'name' : 'Runoob',
    'url' : 'https://www.runoob.com'
}
 
json_str = json.dumps(data)
print ("Python 原始数据：", repr(data))
print ("JSON 对象：", json_str)
```

执行以上代码输出结果为：

```python
Python 原始数据： {'no': 1, 'name': 'Runoob', 'url': 'https://www.runoob.com'}
JSON 对象： {"no": 1, "name": "Runoob", "url": "https://www.runoob.com"}
```

通过输出的结果可以看出，简单类型通过编码后跟其原始的repr()输出结果非常相似。

接着以上实例，我们可以将一个JSON编码的字符串转换回一个Python数据结构：

```python
#!/usr/bin/python3
 
import json
 
# Python 字典类型转换为 JSON 对象
data1 = {
    'no' : 1,
    'name' : 'Runoob',
    'url' : 'http://www.runoob.com'
}
 
json_str = json.dumps(data1)
print ("Python 原始数据：", repr(data1))
print ("JSON 对象：", json_str)
 
# 将 JSON 对象转换为 Python 字典
data2 = json.loads(json_str)
print ("data2['name']: ", data2['name'])
print ("data2['url']: ", data2['url'])
```

执行以上代码输出结果为：

```python
Python 原始数据： {'name': 'Runoob', 'no': 1, 'url': 'http://www.runoob.com'}
JSON 对象： {"name": "Runoob", "no": 1, "url": "http://www.runoob.com"}
data2['name']:  Runoob
data2['url']:  http://www.runoob.com
```

如果你要处理的是文件而不是字符串，你可以使用 **json.dump()** 和 **json.load()** 来编码和解码JSON数据。例如：

```python
# 写入 JSON 数据
with open('data.json', 'w') as f:
    json.dump(data, f)
 
# 读取数据
with open('data.json', 'r') as f:
    data = json.load(f)
```

# 7.urllib 模块

Python urllib 库用于操作网页 URL，并对网页的内容进行抓取处理。

urllib 包 包含以下几个模块：

- **urllib.request** - 打开和读取 URL。
- **urllib.error** - 包含 urllib.request 抛出的异常。
- **urllib.parse** - 解析 URL。
- **urllib.robotparser** - 解析 robots.txt 文件。

## 7.1urllib.request

urllib.request 定义了一些打开 URL 的函数和类，包含授权验证、重定向、浏览器 cookies等。

urllib.request 可以模拟浏览器的一个请求发起过程。

我们可以使用 urllib.request 的 urlopen 方法来打开一个 URL，语法格式如下：

```
urllib.request.urlopen(url, data=None, [timeout, ]*, cafile=None, capath=None, cadefault=False, context=None)
```

- **url**：url 地址。
- **data**：发送到服务器的其他数据对象，默认为 None。
- **timeout**：设置访问超时时间。
- **cafile 和 capath**：cafile 为 CA 证书， capath 为 CA 证书的路径，使用 HTTPS 需要用到。
- **cadefault**：已经被弃用。
- **context**：ssl.SSLContext类型，用来指定 SSL 设置。

```python
from urllib.request import urlopen

myURL = urlopen("https://www.runoob.com/")
print(myURL.read())
```

以上代码使用 urlopen 打开一个 URL，然后使用 read() 函数获取网页的 HTML 实体代码。

read() 是读取整个网页内容，我们可以指定读取的长度：

```python
from urllib.request import urlopen

myURL = urlopen("https://www.runoob.com/")
print(myURL.read(300))
```

除了 read() 函数外，还包含以下两个读取网页内容的函数：

- **readline()** - 读取文件的一行内容

  ```python
  from urllib.request import urlopen
  
  myURL = urlopen("https://www.runoob.com/")
  print(myURL.readline()) #读取一行内容
  ```

- **readlines()** - 读取文件的全部内容，它会把读取的内容赋值给一个列表变量。

  ```python
  from urllib.request import urlopen
  
  myURL = urlopen("https://www.runoob.com/")
  lines = myURL.readlines()
  for line in lines:
      print(line) 
  ```

我们在对网页进行抓取时，经常需要判断网页是否可以正常访问，这里我们就可以使用 getcode() 函数获取网页状态码，返回 200 说明网页正常，返回 404 说明网页不存在:

```python
import urllib.request

myURL1 = urllib.request.urlopen("https://www.runoob.com/")
print(myURL1.getcode())   # 200

try:
    myURL2 = urllib.request.urlopen("https://www.runoob.com/no.html")
except urllib.error.HTTPError as e:
    if e.code == 404:
        print(404)   # 404
```

如果要将抓取的网页保存到本地，可以使用 [Python3 File write() 方法](https://www.runoob.com/python3/python3-file-write.html) 函数：

```python
from urllib.request import urlopen

myURL = urlopen("https://www.runoob.com/")
f = open("runoob_urllib_test.html", "wb")
content = myURL.read()  # 读取网页内容
f.write(content)
f.close()
```

执行以上代码，在本地就会生成一个 runoob_urllib_test.html 文件，里面包含了 https://www.runoob.com/ 网页的内容。

URL 的编码与解码可以使用 **urllib.request.quote()** 与 **urllib.request.unquote()** 方法：

```python
import urllib.request 

encode_url = urllib.request.quote("https://www.runoob.com/")  # 编码
print(encode_url)

unencode_url = urllib.request.unquote(encode_url)    # 解码
print(unencode_url)
```

输出结果为：

```
https%3A//www.runoob.com/
https://www.runoob.com/
```

# logging 模块

Python 提供了一个内置的 `logging` 模块，专门用于处理日志记录任务。与简单的 `print` 语句相比，`logging` 模块更加灵活和强大，能够满足不同场景下的日志需求。

为什么使用 logging 模块？

1. **灵活性**：`logging` 模块允许你根据需要设置日志的级别、格式和输出位置。
2. **可扩展性**：你可以轻松地将日志输出到文件、控制台、网络等不同的目标。
3. **结构化日志**：`logging` 模块支持结构化日志记录，便于后续的分析和处理。
4. **性能优化**：与 `print` 相比，`logging` 模块在性能上进行了优化，适合在生产环境中使用。

## 基本用法

### 1. 导入 logging 模块

首先，我们需要导入 `logging` 模块：

```python
import logging
```

### 2. 配置日志级别

日志级别用于控制日志的详细程度。`logging` 模块提供了以下几种日志级别：

- **DEBUG**：详细的调试信息，通常用于开发阶段。
- **INFO**：程序正常运行时的信息。
- **WARNING**：表示潜在的问题，但程序仍能正常运行。
- **ERROR**：表示程序中的错误，导致某些功能无法正常工作。
- **CRITICAL**：表示严重的错误，可能导致程序崩溃。

你可以通过以下代码设置日志级别：

```python
logging.basicConfig(level=logging.DEBUG)
```

### 3. 记录日志

设置好日志级别后，你可以使用以下方法记录日志：

```python
logging.debug("这是一条调试信息")
logging.info("这是一条普通信息")
logging.warning("这是一条警告信息")
logging.error("这是一条错误信息")
logging.critical("这是一条严重错误信息")
```

### 4. 日志输出格式

你可以通过 `basicConfig` 方法自定义日志的输出格式。例如：

```python
logging.basicConfig(
    level=logging.DEBUG,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S"
)
```

### 5. 将日志输出到文件

默认情况下，日志会输出到控制台。如果你希望将日志保存到文件中，可以这样配置：

```python
logging.basicConfig(
    level=logging.DEBUG,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    filename="app.log"
)
```

## 高级用法

### 1. 使用多个日志记录器

在大型项目中，你可能需要为不同的模块或组件创建独立的日志记录器。可以通过以下方式实现：

```python
logger = logging.getLogger("my_logger")
logger.setLevel(logging.DEBUG)

# 创建文件处理器
file_handler = logging.FileHandler("my_logger.log")
file_handler.setLevel(logging.DEBUG)

# 创建控制台处理器
console_handler = logging.StreamHandler()
console_handler.setLevel(logging.INFO)

# 设置日志格式
formatter = logging.Formatter("%(asctime)s - %(name)s - %(levelname)s - %(message)s")
file_handler.setFormatter(formatter)
console_handler.setFormatter(formatter)

# 将处理器添加到日志记录器
logger.addHandler(file_handler)
logger.addHandler(console_handler)

# 记录日志
logger.debug("这是一条调试信息")
logger.info("这是一条普通信息")
```

### 2. 日志过滤器

你可以通过过滤器来控制哪些日志需要被记录。例如：

```python
class MyFilter(logging.Filter):
    def filter(self, record):
        return record.levelno == logging.ERROR

logger.addFilter(MyFilter())
```

### 3. 日志轮转

当日志文件过大时，可以使用 `RotatingFileHandler` 或 `TimedRotatingFileHandler` 实现日志轮转：

```python
from logging.handlers import RotatingFileHandler

handler = RotatingFileHandler("app.log", maxBytes=1024, backupCount=3)
logger.addHandler(handler)
```

## 常用的属性和方法

### 1. 核心类

| 类                      | 说明                                                         | 示例                                                         |
| :---------------------- | :----------------------------------------------------------- | :----------------------------------------------------------- |
| **`logging.Logger`**    | 记录器，用于发出日志消息（通过 `logging.getLogger(name)` 获取） | `logger = logging.getLogger("my_logger")`                    |
| **`logging.Handler`**   | 处理器，决定日志输出位置（如文件、控制台等）                 | `handler = logging.FileHandler("app.log")`                   |
| **`logging.Formatter`** | 格式化器，控制日志输出的格式                                 | `formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')` |
| **`logging.Filter`**    | 过滤器，用于更精细地控制日志记录                             | `filter = logging.Filter("module.name")`                     |

### 2. Logger 对象常用方法

| 方法                             | 说明                                               | 示例                             |
| :------------------------------- | :------------------------------------------------- | :------------------------------- |
| **`logger.setLevel(level)`**     | 设置日志级别（如 `logging.DEBUG`、`logging.INFO`） | `logger.setLevel(logging.DEBUG)` |
| **`logger.debug(msg)`**          | 记录 DEBUG 级别日志                                | `logger.debug("调试信息")`       |
| **`logger.info(msg)`**           | 记录 INFO 级别日志                                 | `logger.info("程序启动")`        |
| **`logger.warning(msg)`**        | 记录 WARNING 级别日志                              | `logger.warning("磁盘空间不足")` |
| **`logger.error(msg)`**          | 记录 ERROR 级别日志                                | `logger.error("操作失败")`       |
| **`logger.critical(msg)`**       | 记录 CRITICAL 级别日志                             | `logger.critical("系统崩溃")`    |
| **`logger.addHandler(handler)`** | 添加处理器                                         | `logger.addHandler(handler)`     |
| **`logger.addFilter(filter)`**   | 添加过滤器                                         | `logger.addFilter(filter)`       |

### 3. Handler 常用类型

| Handler 类型                   | 说明                 | 示例                                                         |
| :----------------------------- | :------------------- | :----------------------------------------------------------- |
| **`StreamHandler`**            | 输出到流（如控制台） | `handler = logging.StreamHandler()`                          |
| **`FileHandler`**              | 输出到文件           | `handler = logging.FileHandler("app.log")`                   |
| **`RotatingFileHandler`**      | 按文件大小分割日志   | `handler = logging.RotatingFileHandler("app.log", maxBytes=1e6, backupCount=3)` |
| **`TimedRotatingFileHandler`** | 按时间分割日志       | `handler = logging.TimedRotatingFileHandler("app.log", when="midnight")` |
| **`SMTPHandler`**              | 通过邮件发送日志     | `handler = logging.SMTPHandler("mail.example.com", "from@example.com", "to@example.com", "Error Log")` |

### 4. 日志级别（常量）

| 级别           | 数值 | 说明                           |
| :------------- | :--- | :----------------------------- |
| **`CRITICAL`** | 50   | 严重错误，程序可能无法继续运行 |
| **`ERROR`**    | 40   | 错误，但程序仍可运行           |
| **`WARNING`**  | 30   | 警告信息（默认级别）           |
| **`INFO`**     | 20   | 程序运行信息                   |
| **`DEBUG`**    | 10   | 调试信息                       |
| **`NOTSET`**   | 0    | 继承父记录器的级别             |

### 5. Formatter 常用格式字段

| 字段            | 说明             | 示例输出                  |
| :-------------- | :--------------- | :------------------------ |
| `%(asctime)s`   | 日志创建时间     | `2023-01-01 12:00:00,123` |
| `%(levelname)s` | 日志级别名称     | `INFO`                    |
| `%(message)s`   | 日志消息内容     | `程序启动成功`            |
| `%(name)s`      | 记录器名称       | `my_logger`               |
| `%(filename)s`  | 生成日志的文件名 | `app.py`                  |
| `%(lineno)d`    | 生成日志的行号   | `42`                      |
| `%(funcName)s`  | 生成日志的函数名 | `main`                    |

### 6. 快速配置方法

| 方法                        | 说明                                                 | 示例                                                         |
| :-------------------------- | :--------------------------------------------------- | :----------------------------------------------------------- |
| **`logging.basicConfig()`** | 一键配置日志级别、处理器和格式（通常在程序入口调用） | `logging.basicConfig(level=logging.INFO, format='%(levelname)s - %(message)s')` |

**常用参数**：

- `level`：设置根记录器级别
- `filename`：输出到文件
- `filemode`：文件模式（如 `'w'` 覆盖）
- `format`：格式字符串
- `datefmt`：日期格式（如 `"%Y-%m-%d %H:%M:%S"`）

## 实例

### 基础配置

```python
import logging

# 配置日志
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    filename='app.log'
)

# 使用
logger = logging.getLogger("my_app")
logger.info("程序启动")
```

### 多处理器复杂配置

```python
import logging

# 创建记录器
logger = logging.getLogger("my_module")
logger.setLevel(logging.DEBUG)

# 控制台处理器
console_handler = logging.StreamHandler()
console_handler.setLevel(logging.WARNING)

# 文件处理器
file_handler = logging.FileHandler("debug.log")
file_handler.setLevel(logging.DEBUG)

# 格式化
formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
console_handler.setFormatter(formatter)
file_handler.setFormatter(formatter)

# 添加处理器
logger.addHandler(console_handler)
logger.addHandler(file_handler)

# 使用
logger.debug("调试信息")  # 仅写入文件
logger.warning("警告！")  # 同时输出到控制台和文件
```

### 日志分割

```python
from logging.handlers import RotatingFileHandler

handler = RotatingFileHandler(
    "app.log", maxBytes=1e6, backupCount=3  # 每个文件1MB，保留3个备份
)
logger.addHandler(handler)
```



# 9.asyncio 模块

`asyncio` 是 Python 标准库中的一个模块，用于编写异步 I/O 操作的代码。

asyncio 提供了一种高效的方式来处理并发任务，特别适用于 I/O 密集型操作，如网络请求、文件读写等。

通过使用 `asyncio`，你可以在单线程中同时处理多个任务，而无需使用多线程或多进程。

>  为什么需要 asyncio？

在传统的同步编程中，当一个任务需要等待 I/O 操作（如网络请求）完成时，程序会阻塞，直到操作完成。这会导致程序的效率低下，尤其是在需要处理大量 I/O 操作时。

`asyncio` 通过引入异步编程模型，允许程序在等待 I/O 操作时继续执行其他任务，从而提高了程序的并发性和效率。

## 9.1asyncio 的核心概念

### 1. 协程（Coroutine）

协程是 `asyncio` 的核心概念之一。它是一个特殊的函数，可以在执行过程中暂停，并在稍后恢复执行。协程通过 `async def` 关键字定义，并通过 `await` 关键字暂停执行，等待异步操作完成。

```python
import asyncio

async def say_hello():
    print("Hello")
    await asyncio.sleep(1)
    print("World")
```

### 2. 事件循环（Event Loop）

事件循环是 `asyncio` 的核心组件，负责调度和执行协程。它不断地检查是否有任务需要执行，并在任务完成后调用相应的回调函数。

```python
async def main():
    await say_hello()

asyncio.run(main())
```

### 3. 任务（Task）

任务是对协程的封装，表示一个正在执行或将要执行的协程。你可以通过 `asyncio.create_task()` 函数创建任务，并将其添加到事件循环中。

```python
async def main():
    task = asyncio.create_task(say_hello())
    await task
```

### 4. Future

`Future` 是一个表示异步操作结果的对象。它通常用于底层 API，表示一个尚未完成的操作。你可以通过 `await` 关键字等待 `Future` 完成。

```python
async def main():
    future = asyncio.Future()
    await future
```

## 9.2asyncio 的基本用法

### 1. 运行协程

要运行一个协程，你可以使用 `asyncio.run()` 函数。它会创建一个事件循环，并运行指定的协程。

```python
import asyncio

async def main():
    print("Start")
    await asyncio.sleep(1)
    print("End")

asyncio.run(main())
```

### 2. 并发执行多个任务

你可以使用 `asyncio.gather()` 函数并发执行多个协程，并等待它们全部完成。

```python
import asyncio

async def task1():
    print("Task 1 started")
    await asyncio.sleep(1)
    print("Task 1 finished")

async def task2():
    print("Task 2 started")
    await asyncio.sleep(2)
    print("Task 2 finished")

async def main():
    await asyncio.gather(task1(), task2())

asyncio.run(main())
```

### 3. 超时控制

你可以使用 `asyncio.wait_for()` 函数为协程设置超时时间。如果协程在指定时间内未完成，将引发 `asyncio.TimeoutError` 异常。

```python
import asyncio

async def long_task():
    await asyncio.sleep(10)
    print("Task finished")

async def main():
    try:
        await asyncio.wait_for(long_task(), timeout=5)
    except asyncio.TimeoutError:
        print("Task timed out")

asyncio.run(main())
```

## 9.3asyncio 的应用场景

`asyncio` 特别适用于以下场景：

1. **网络请求**：如 HTTP 请求、WebSocket 通信等。
2. **文件 I/O**：如异步读写文件。
3. **数据库操作**：如异步访问数据库。
4. **实时数据处理**：如实时消息队列处理。

## 9.4常用类、方法和函数

### **1. 核心函数**

| 方法/函数                       | 说明                          | 示例                                                 |
| :------------------------------ | :---------------------------- | :--------------------------------------------------- |
| **`asyncio.run(coro)`**         | 运行异步主函数（Python 3.7+） | `asyncio.run(main())`                                |
| **`asyncio.create_task(coro)`** | 创建任务并加入事件循环        | `task = asyncio.create_task(fetch_data())`           |
| **`asyncio.gather(\*coros)`**   | 并发运行多个协程              | `await asyncio.gather(task1, task2)`                 |
| **`asyncio.sleep(delay)`**      | 异步等待（非阻塞）            | `await asyncio.sleep(1)`                             |
| **`asyncio.wait(coros)`**       | 控制任务完成方式              | `done, pending = await asyncio.wait([task1, task2])` |

### **2. 事件循环（Event Loop）**

| 方法                                   | 说明                 | 示例                              |
| :------------------------------------- | :------------------- | :-------------------------------- |
| **`loop.run_until_complete(future)`**  | 运行直到任务完成     | `loop.run_until_complete(main())` |
| **`loop.run_forever()`**               | 永久运行事件循环     | `loop.run_forever()`              |
| **`loop.stop()`**                      | 停止事件循环         | `loop.stop()`                     |
| **`loop.close()`**                     | 关闭事件循环         | `loop.close()`                    |
| **`loop.call_soon(callback)`**         | 安排回调函数立即执行 | `loop.call_soon(print, "Hello")`  |
| **`loop.call_later(delay, callback)`** | 延迟执行回调         | `loop.call_later(5, callback)`    |

### **3. 协程（Coroutine）与任务（Task）**

| 方法/装饰器              | 说明                               | 示例                                   |
| :----------------------- | :--------------------------------- | :------------------------------------- |
| **`@asyncio.coroutine`** | 协程装饰器（旧版，Python 3.4-3.7） | `@asyncio.coroutine` `def old_coro():` |
| **`async def`**          | 定义协程（Python 3.5+）            | `async def fetch():`                   |
| **`task.cancel()`**      | 取消任务                           | `task.cancel()`                        |
| **`task.done()`**        | 检查任务是否完成                   | `if task.done():`                      |
| **`task.result()`**      | 获取任务结果（需任务完成）         | `data = task.result()`                 |

### **4. 同步原语（类似`threading`）**

| 类                        | 说明       | 示例                                              |
| :------------------------ | :--------- | :------------------------------------------------ |
| **`asyncio.Lock()`**      | 异步互斥锁 | `lock = asyncio.Lock()` `async with lock:`        |
| **`asyncio.Event()`**     | 事件通知   | `event = asyncio.Event()` `await event.wait()`    |
| **`asyncio.Queue()`**     | 异步队列   | `queue = asyncio.Queue()` `await queue.put(item)` |
| **`asyncio.Semaphore()`** | 信号量     | `sem = asyncio.Semaphore(5)` `async with sem:`    |

### **5. 网络与子进程**

| 方法/类                                | 说明          | 示例                                                         |
| :------------------------------------- | :------------ | :----------------------------------------------------------- |
| **`asyncio.open_connection()`**        | 建立TCP连接   | `reader, writer = await asyncio.open_connection('host', 80)` |
| **`asyncio.start_server()`**           | 创建TCP服务器 | `server = await asyncio.start_server(handle, '0.0.0.0', 8888)` |
| **`asyncio.create_subprocess_exec()`** | 创建子进程    | `proc = await asyncio.create_subprocess_exec('ls')`          |

### **6. 实用工具**

| 方法                                  | 说明             | 示例                                   |
| :------------------------------------ | :--------------- | :------------------------------------- |
| **`asyncio.current_task()`**          | 获取当前任务     | `task = asyncio.current_task()`        |
| **`asyncio.all_tasks()`**             | 获取所有任务     | `tasks = asyncio.all_tasks()`          |
| **`asyncio.shield(coro)`**            | 保护任务不被取消 | `await asyncio.shield(critical_task)`  |
| **`asyncio.wait_for(coro, timeout)`** | 带超时的等待     | `try: await asyncio.wait_for(task, 5)` |

## 9.5实例

1. 基本协程示例

```python
import asyncio

async def hello():
    print("Hello")
    await asyncio.sleep(1)
    print("World")

asyncio.run(hello())  # Python 3.7+
```

2. 并发执行任务

```python
async def fetch(url):
    print(f"Fetching {url}")
    await asyncio.sleep(2)
    return f"Data from {url}"

async def main():
    results = await asyncio.gather(
        fetch("url1.com"),
        fetch("url2.com")
    )
    print(results)

asyncio.run(main())
```

3. 使用异步队列

```python
async def producer(queue):
    for i in range(5):
        await queue.put(i)
        await asyncio.sleep(0.1)

async def consumer(queue):
    while True:
        item = await queue.get()
        print(f"Consumed {item}")
        queue.task_done()

async def main():
    queue = asyncio.Queue()
    await asyncio.gather(
        producer(queue),
        consumer(queue)
    )
```

### **注意事项**

1. **Python版本**：部分功能需Python 3.7+（如`asyncio.run()`）。
2. **阻塞操作**：避免在协程中使用同步阻塞代码（如`time.sleep()`）。
3. **调试**：设置`PYTHONASYNCIODEBUG=1`环境变量可启用调试模式。
4. **取消任务**：被取消的任务会引发`CancelledError`，需妥善处理。