# Python基础

## 变量

### 变量和类型

在编程语言中，**变量是数据的载体**，简单的说就是一块用来保存数据的内存空间，**变量的值可以被读取和修改**，这是所有运算和控制的基础。

1. 整型（`int`）：Python 中可以处理任意大小的整数，而且支持二进制（如`0b100`，换算成十进制是4）、八进制（如`0o100`，换算成十进制是64）、十进制（`100`）和十六进制（`0x100`，换算成十进制是256）的表示法。运行下面的代码，看看会输出什么。

```python 
print(0b100)  # 二进制整数
print(0o100)  # 八进制整数
print(100)    # 十进制整数
print(0x100)  # 十六进制整数
```


1. 浮点型（`float`）：浮点数也就是小数，之所以称为浮点数，是因为按照科学记数法表示时，一个浮点数的小数点位置是可变的，浮点数除了数学写法（如`123.456`）之外还支持科学计数法（如`1.23456e2`，表示$\small{1.23456 \times 10^{2}}$）。运行下面的代码，看看会输出什么。

```python 
print(123.456)    # 数学写法
print(1.23456e2)  # 科学计数法
```


1. 字符串型（`str`）：字符串是以单引号或双引号包裹起来的任意文本，比如`'hello'`和`"hello"`。
2. 布尔型（`bool`）：布尔型只有`True`、`False`两种值，要么是`True`，要么是`False`，可以用来表示现实世界中的“是”和“否”，命题的“真”和“假”，状况的“好”与“坏”，水平的“高”与“低”等等。如果一个变量的值只有两种状态，我们就可以使用布尔型。

### 变量命名

对于每个变量，我们都需要给它取一个名字，就如同我们每个人都有自己的名字一样。在 Python 中，变量命名需要遵循以下的规则和惯例。

- 规则部分：
  - 规则1：变量名由**字母**、**数字**和**下划线**构成，数字不能开头。需要说明的是，这里说的字母指的是 Unicode 字符，Unicode 称为万国码，囊括了世界上大部分的文字系统，这也就意味着中文、日文、希腊字母等都可以作为变量名中的字符，但是一些特殊字符（如：`！`、`@`、`#`等）是不能出现在变量名中的。我们强烈建议大家把这里说的字母理解为**尽可能只使用英文字母**。
  - 规则2：Python 是**大小写敏感**的编程语言，简单的说就是大写的`A`和小写的`a`是两个不同的变量，这一条其实并不算规则，而是需要大家注意的地方。
  - 规则3：变量名**不要跟 Python 的关键字重名**，**尽可能避开 Python 的保留字**。这里的关键字是指在 Python 程序中有特殊含义的单词（如：`is`、`if`、`else`、`for`、`while`、`True`、`False`等），保留字主要指 Python 语言内置函数、内置模块等的名字（如：`int`、`print`、`input`、`str`、`math`、`os`等）。
- 惯例部分：
  - 惯例1：变量名通常使用**小写英文字母**，**多个单词用下划线进行连接**。
  - 惯例2：受保护的变量用单个下划线开头。
  - 惯例3：私有的变量用两个下划线开头。

### 变量的使用

```python 
a = 45        # 定义变量a，赋值45
b = 12        # 定义变量b，赋值12
print(a, b)   # 45 12
print(a + b)  # 57
print(a - b)  # 33
print(a * b)  # 540
print(a / b)  # 3.75

```


在 Python 中可以使用`type`函数对变量的类型进行检查。

```python 
a = 100
b = 123.45
c = 'hello, world'
d = True
print(type(a))  # <class 'int'>
print(type(b))  # <class 'float'>
print(type(c))  # <class 'str'>
print(type(d))  # <class 'bool'>
```


可以通过 Python 内置的函数来改变变量的类型，下面是一些常用的和变量类型相关的函数。

- `int()`：将一个数值或字符串转换成整数，可以指定进制。
- `float()`：将一个字符串（在可能的情况下）转换成浮点数。
- `str()`：将指定的对象转换成字符串形式，可以指定编码方式。
- `chr()`：将整数（字符编码）转换成对应的（一个字符的）字符串。
- `ord()`：将（一个字符的）字符串转换成对应的整数（字符编码）。

```python 
a = 100
b = 123.45
c = '123'
d = '100'
e = '123.45'
f = 'hello, world'
g = True
print(float(a))         # int类型的100转成float，输出100.0
print(int(b))           # float类型的123.45转成int，输出123
print(int(c))           # str类型的'123'转成int，输出123
print(int(c, base=16))  # str类型的'123'按十六进制转成int，输出291
print(int(d, base=2))   # str类型的'100'按二进制转成int，输出4
print(float(e))         # str类型的'123.45'转成float，输出123.45
print(bool(f))          # str类型的'hello, world'转成bool，输出True
print(int(g))           # bool类型的True转成int，输出1
print(chr(a))           # int类型的100转成str，输出'd'
print(ord('d'))         # str类型的'd'转成int，输出100
```


> **说明**：`str`类型转`int`类型时可以通过`base`参数来指定进制，可以将字符串视为对应进制的整数进行转换。`str`类型转成`bool`类型时，只要字符串有内容，不是`''`或`""`，对应的布尔值都是`True`。`bool`类型转`int`类型时，`True`会变成`1`，`False`会变成`0`。在 ASCII 字符集和 Unicode 字符集中， 字符`'d'`对应的编码都是`100`。

## 运算符

Python 语言支持很多种运算符，下面的表格按照运算符的优先级从高到低，对 Python 中的运算符进行了罗列。

| 运算符                                                                    | 描述              |
| ---------------------------------------------------------------------- | --------------- |
| \`\[]\`、\`\[:]\`                                                       | 索引、切片           |
| ` **`                                                                  | 幂               |
| \`\~\`、\`+\`、\`-\`                                                     | 按位取反、正号、负号      |
| ` *`、`/`、`%`、`//`                                                      | 乘、除、模、整除        |
| \`+\`、\`-\`                                                            | 加、减             |
| \`>>\`、\`<<\`                                                          | 右移、左移           |
| \`&\`                                                                  | 按位与             |
| \`^\`、\\\`                                                             | \\\`            |
| \`<=\`、\`<\`、\`>\`、\`>=\`                                              | 小于等于、小于、大于、大于等于 |
| \`==\`、\`!=\`                                                          | 等于、不等于          |
| \`is\`、\`is not\`                                                      | 身份运算符           |
| \`in\`、\`not in\`                                                      | 成员运算符           |
| \`not\`、\`or\`、\`and\`                                                 | 逻辑运算符           |
| `=`、`+=`、`-=`、` *=`、`/=`、`%=`、`//=`、`* *=`、`&=`、`\|=`、`^=`、`>>=`、`<<=` | 赋值运算符           |

> **说明**： 所谓优先级就是在一个运算的表达式中，如果出现了多个运算符，应该先执行什么再执行什么的顺序。编写代码的时候，如果搞不清楚一个表达式中运算符的优先级，可以使用圆括号（小括号）来确保运算的执行顺序。

### 算术运算符

Python 中的算术运算符非常丰富，除了大家最为熟悉的加、减、乘、除之外，还有整除运算符、求模（求余数）运算符和求幂运算符。

```python 
print(321 + 12)     # 加法运算，输出333
print(321 - 12)     # 减法运算，输出309
print(321 * 12)     # 乘法运算，输出3852
print(321 / 12)     # 除法运算，输出26.75
print(321 // 12)    # 整除运算，输出26
print(321 % 12)     # 求模运算，输出9
print(321 ** 12)    # 求幂运算，输出1196906950228928915420617322241
```


### 赋值运算符

赋值运算符应该是最为常见的运算符，它的作用是将右边的值赋给左边的变量。赋值运算符还可以跟上面的算术运算符放在一起，组合成复合赋值运算符，例如：`a += b`相当于`a = a + b`，`a *= a + 2`相当于`a = a * (a + 2)`。

```python 
a = 10
b = 3
a += b        # 相当于：a = a + b
a *= a + 2    # 相当于：a = a * (a + 2)
print(a)      # 大家算一下这里会输出什么
```


赋值运算构成的表达式本身不产生任何值，也就是说，如果你把一个赋值表达式放到`print`函数中试图输出表达式的值，将会产生语法错误。为了解决这个问题，Python 3.8 中引入了一个新的赋值运算符`:=`，我们称之为海象运算符。海象运算符也是将运算符右侧的值赋值给左边的变量，与赋值运算符不同的是，运算符右侧的值也是整个表达式的值。

```python 
# SyntaxError: invalid syntax
# print((a = 10))
# 海象运算符
print((a := 10))  # 10
print(a)          # 10
```


> **提示**：上面第 8 行代码如果不注释掉，运行代码会看到`SyntaxError: invalid syntax`错误信息，注意，这行代码中我们给`a = 10`加上了圆括号，如果不小心写成了`print(a = 10)`，会看到`TypeError: 'a' is an invalid keyword argument for print()`错误信息，后面讲到函数的时候，大家就会明白这个错误提示是什么意思了。

### 比较运算符和逻辑运算符

比较运算符也称为关系运算符，包括`==`、`!=`、`<`、`>`、`<=`、`>=`。

逻辑运算符有三个，分别是`and`、`or`和`not`。

```python 
flag0 = 1 == 1
flag1 = 3 > 2
flag2 = 2 < 1
flag3 = flag1 and flag2
flag4 = flag1 or flag2
flag5 = not flag0
print('flag0 =', flag0)     # flag0 = True
print('flag1 =', flag1)     # flag1 = True
print('flag2 =', flag2)     # flag2 = False
print('flag3 =', flag3)     # flag3 = False
print('flag4 =', flag4)     # flag4 = True
print('flag5 =', flag5)     # flag5 = False
print(flag1 and not flag2)  # True
print(1 > 2 or 2 == 3)      # False
```


> **说明**：比较运算符的优先级高于赋值运算符，所以上面的`flag0 = 1 == 1`先做`1 == 1`产生布尔值`True`，再将这个值赋值给变量`flag0`。`print`函数可以输出多个值，多个值之间可以用`,`进行分隔，输出的内容默认以空格分开。

### 运算符和表达式应用

## 分支结构

### 使用if和else构造分支结构

在 Python 中，构造分支结构最常用的是`if`、`elif`和`else`三个关键字。所谓**关键字**就是编程语言中有特殊含义的单词，很显然你不能够使用它作为变量名。

```python 
height = float(input('身高(cm)：'))
weight = float(input('体重(kg)：'))
bmi = weight / (height / 100) ** 2
print(f'{bmi = :.1f}')
if 18.5 <= bmi < 24:
    print('你的身材很棒！')
```


> Python 中没有用花括号来构造代码块而是**使用缩进的方式来表示代码的层次结构**，如果`if`条件成立的情况下需要执行多条语句，只要保持多条语句具有相同的缩进就可以了。换句话说，若干行连续的语句如果保持了相同的缩进，那么它们就属于同一个**代码块**，相当于是一个执行的整体。缩进可以使用任意数量的空格，但**通常使用4个空格**，强烈建议大家**不要使用制表键（Tab键）来缩进代码**。

else块：

```python 
height = float(input('身高(cm)：'))
weight = float(input('体重(kg)：'))
bmi = weight / (height / 100) ** 2
print(f'{bmi = :.1f}')
if 18.5 <= bmi < 24:
    print('你的身材很棒！')
else:
    print('你的身材不够标准哟！')
```


如果要给出更为准确的提示信息，我们可以再次修改上面的代码，通过`elif`关键字为上面的分支结构增加更多的分支

```python 
height = float(input('身高(cm)：'))
weight = float(input('体重(kg)：'))
bmi = weight / (height / 100) ** 2
print(f'{bmi = :.1f}')
if bmi < 18.5:
    print('你的体重过轻！')
elif bmi < 24:
    print('你的身材很棒！')
elif bmi < 27:
    print('你的体重过重！')
elif bmi < 30:
    print('你已轻度肥胖！')
elif bmi < 35:
    print('你已中度肥胖！')
else:
    print('你已重度肥胖！')
```


### 使用match和case构造分支结构

Python 3.10 中增加了一种新的构造分支结构的方式，通过使用`match`和`case` 关键字，我们可以轻松的构造出多分支结构。

下面用`if-else`结构实现:

```python 
status_code = int(input('响应状态码: '))
if status_code == 400:
    description = 'Bad Request'
elif status_code == 401:
    description = 'Unauthorized'
elif status_code == 403:
    description = 'Forbidden'
elif status_code == 404:
    description = 'Not Found'
elif status_code == 405:
    description = 'Method Not Allowed'
elif status_code == 418:
    description = 'I am a teapot'
elif status_code == 429:
    description = 'Too many requests'
else:
    description = 'Unknown status Code'
print('状态码描述:', description)
```


使用match-case语法实现的代码:

```python 
status_code = int(input('响应状态码: '))
match status_code:
    case 400: description = 'Bad Request'
    case 401: description = 'Unauthorized'
    case 403: description = 'Forbidden'
    case 404: description = 'Not Found'
    case 405: description = 'Method Not Allowed'
    case 418: description = 'I am a teapot'
    case 429: description = 'Too many requests'
    case _: description = 'Unknown Status Code'
print('状态码描述:', description)
```


> **说明**：带有`_`的`case`语句在代码中起到通配符的作用，如果前面的分支都没有匹配上，代码就会来到`case _`。`case _`的是可选的，并非每种分支结构都要给出通配符选项。如果分支中出现了`case _`，它只能放在分支结构的最后面，如果它的后面还有其他的分支，那么这些分支将是不可达的。

1. 合并模式

我们要将响应状态码`401`、`403`和`404`归入一个分支，`400`和`405`归入到一个分支，其他保持不变。

```python 
status_code = int(input('响应状态码: '))
match status_code:
    case 400 | 405: description = 'Invalid Request'
    case 401 | 403 | 404: description = 'Not Allowed'
    case 418: description = 'I am a teapot'
    case 429: description = 'Too many requests'
    case _: description = 'Unknown Status Code'
print('状态码描述:', description)
```


### 分支结构的应用

#### 例子1：分段函数求值

```python 
x = float(input('x = '))
if x > 1:
    y = 3 * x - 5
elif x >= -1:
    y = x + 2
else:
    y = 5 * x + 3
print(f'{y = }')
```


#### 例子2：百分制成绩转换成等级

```python 
score = float(input('请输入成绩: '))
if score >= 90:
    grade = 'A'
elif score >= 80:
    grade = 'B'
elif score >= 70:
    grade = 'C'
elif score >= 60:
    grade = 'D'
else:
    grade = 'E'
print(f'{grade = }')
```


#### 例子3：计算三角形的周长和面积

```python 
a = float(input('a = '))
b = float(input('b = '))
c = float(input('c = '))
if a + b > c and a + c > b and b + c > a:
    perimeter = a + b + c
    print(f'周长: {perimeter}')
    s = perimeter / 2
    area = (s * (s - a) * (s - b) * (s - c)) ** 0.5
    print(f'面积: {area}')
else:
    print('不能构成三角形')
```


## 循环结构

所谓循环结构，就是程序中控制某条或某些指令重复执行的结构。在 Python 语言中构造循环结构有两种做法，一种是`for-in`循环，另一种是`while`循环。

### for-in循环

如果明确知道循环执行的次数，我们推荐使用`for-in`循环。注意，被`for-in`循环控制的代码块也是通过缩进的方式来构造，这一点跟分支结构中构造代码块的做法是一样的。我们被`for-in`循环控制的代码块称为循环体，通常循环体中的语句会根据循环的设定被重复执行。

```python 
import time

for i in range(3600):
    print("hello, world")
    time.sleep(1)

```


下面的清单给出了使用range函数的例子：

- `range(101)`：可以用来产生`0`到`100`范围的整数，需要注意的是取不到`101`。
- `range(1, 101)`：可以用来产生`1`到`100`范围的整数，相当于是左闭右开的设定，即`[1, 101)`。
- `range(1, 101, 2)`：可以用来产生`1`到`100`的奇数，其中`2`是步长（跨度），即每次递增的值，`101`取不到。
- `range(100, 0, -2)`：可以用来产生`100`到`1`的偶数，其中`-2`是步长（跨度），即每次递减的值，`0`取不到。

上面代码的输出操作和休眠操作都没有用到循环变量`i`，对于不需要用到循环变量的`for-in`循环结构，按照 Python 的编程惯例，我们通常把循环变量命名为`_`

```python 
import time

for _ in range(3600):
    print('hello, world')
    time.sleep(1)
```


用`for-in`循环实现从 1 到 100 的整数求和：

```python 
total = 0
for i in range(1, 101):
    total += i
print(total)

```


从1到100偶数求和的代码：

```python 
total = 0
for i in range(1, 101):
    if i % 2 == 0:
        total += i
print(total)
```


我们也可以修改`range`函数的参数，将起始值和跨度修改为`2`，用更为简单的代码实现从 1 到 100 的偶数求和。

```python 
total = 0
for i in range(2, 101, 2):
    total += i
print(total)
```


### while循环

如果要构造循环结构但是又不能确定循环重复的次数，我们推荐使用`while`循环。`while`循环通过布尔值或能产生布尔值的表达式来控制循环，当布尔值或表达式的值为`True`时，循环体（`while`语句下方保持相同缩进的代码块）中的语句就会被重复执行，当表达式的值为`False`时，结束循环。

```python 
"""
从1到100的整数求和
"""
total = 0
i = 1
while i <= 100:
    total += i
    i += 1
print(total)
```


### break和continue

如果把`while`循环的条件设置为`True`，即让条件恒成立会怎么样呢？我们看看下面的代码，还是使用`while`构造循环结构，计算 1 到 100 的偶数和。

```python 
total = 0
i = 2
while True:
    total += i
    i += 2
    if i > 100:
        break
print(total) 
```


上面的代码中使用`while True`构造了一个条件恒成立的循环，也就意味着如果不做特殊处理，循环是不会结束的，这就是我们常说的“死循环”。为了在`i`的值超过 100 后让循环停下来，我们使用了`break`关键字，它的作用是终止循环结构的执行。需要注意的是，`break`只能终止它所在的那个循环，这一点在使用嵌套循环结构时需要引起注意，后面我们会讲到什么是嵌套的循环结构。除了`break`之外，还有另一个在循环结构中可以使用的关键字`continue`，它可以用来放弃本次循环后续的代码直接让循环进入下一轮，代码如下所示。

```python 
"""
从1到100的偶数求和
"""
total = 0
for i in range(1, 101):
    if i % 2 != 0:
        continue
    total += i
print(total)
```


> **说明**：上面的代码使用`continue`关键字跳过了`i`是奇数的情况，只有在`i`是偶数的前提下，才会执行到`total += i`。

### 嵌套的循环结构

和分支结构一样，循环结构也是可以嵌套的，也就是说在循环结构中还可以构造循环结构。

```python 
"""
打印乘法口诀表
"""
for i in range(1, 10):
    for j in range(1, i + 1):
        print(f'{i}×{j}={i * j}', end='\t')
    print()
```


上面的代码中，`for-in`循环的循环体中又用到了`for-in`循环，外面的循环用来控制产生`i`行的输出，而里面的循环则用来控制在一行中输出`j`列。

### 循环结构的应用

例子1：判断素数

要求：输入一个大于 1 的正整数，判断它是不是素数。

```python 
"""
输入一个大于1的正整数判断它是不是素数
"""
num = int(input('请输入一个正整数: '))
end = int(num ** 0.5)
is_prime = True
for i in range(2, end + 1):
    if num % i == 0:
        is_prime = False
        break
if is_prime:
    print(f'{num}是素数')
else:
    print(f'{num}不是素数')
```


# 常用数据结构

## 列表

### 创建列表

在 Python 中，**列表是由一系元素按特定顺序构成的数据序列**，这就意味着如果我们定义一个列表类型的变量，**可以用它来保存多个数据**。

```python 
items1 = [35, 12, 99, 68, 55, 35, 87]
items2 = ["Python", "Java", "Go", "Kotlin"]
items3 = [100, 12.3, "Python", True]
print(items1)  # [35, 12, 99, 68, 55, 35, 87]
print(items2)  # ['Python', 'Java', 'Go', 'Kotlin']
print(items3)  # [100, 12.3, 'Python', True]

```


> **说明**：列表中可以有重复元素，例如`items1`中的`35`；列表中可以有不同类型的元素，例如`items3`中有`int`类型、`float`类型、`str`类型和`bool`类型的元素，但是我们通常并不建议将不同类型的元素放在同一个列表中，主要是操作起来极为不便。

还可以通过 Python 内置的`list`函数将其他序列变成列表。准确的说，`list`并不是一个普通的函数，它是创建列表对象的构造器。

```python 
items4 = list(range(1, 10))
items5 = list('hello')
print(items4)  # [1, 2, 3, 4, 5, 6, 7, 8, 9]
print(items5)  # ['h', 'e', 'l', 'l', 'o']
```


> **说明**：`range(1, 10)`会产生`1`到`9`的整数序列，给到`list`构造器中，会创建出由`1`到`9`的整数构成的列表。字符串是字符构成的序列，上面的`list('hello')`用字符串`hello`的字符作为列表元素，创建了列表对象。

### 列表的运算

我们可以使用`+`运算符实现两个列表的拼接，拼接运算会将两个列表中的元素连接起来放到一个列表中:

```python 
items5 = [35, 12, 99, 45, 66]
items6 = [45, 58, 29]
items7 = ['Python', 'Java', 'JavaScript']
print(items5 + items6)  # [35, 12, 99, 45, 66, 45, 58, 29]
print(items6 + items7)  # [45, 58, 29, 'Python', 'Java', 'JavaScript']
items5 += items6
print(items5)  # [35, 12, 99, 45, 66, 45, 58, 29]
```


使用`*`运算符实现列表的重复运算，`*`运算符会将列表元素重复指定的次数:

```python 
print(items6 * 3)  # [45, 58, 29, 45, 58, 29, 45, 58, 29]
print(items7 * 2)  # ['Python', 'Java', 'JavaScript', 'Python', 'Java', 'JavaScript']
```


使用`in`或`not in`运算符判断一个元素在不在列表中:

```python 
print(29 in items6)  # True
print(99 in items6)  # False
print('C++' not in items7)     # True
print('Python' not in items7)  # False
```


索引运算:可以使用`[]`运算符，通过在`[]`中指定元素的位置来访问该元素。需要说明的是，`[]`的元素位置可以是`0`到`N - 1`的整数，也可以是`-1`到`-N`的整数，分别称为正向索引和反向索引，其中`N`代表列表元素的个数。对于正向索引，`[0]`可以访问列表中的第一个元素，`[N - 1]`可以访问最后一个元素；对于反向索引，`[-1]`可以访问列表中的最后一个元素，`[-N]`可以访问第一个元素：

```python 
items8 = ['apple', 'waxberry', 'pitaya', 'peach', 'watermelon']
print(items8[0])   # apple
print(items8[2])   # pitaya
print(items8[4])   # watermelon
items8[2] = 'durian'
print(items8)      # ['apple', 'waxberry', 'durian', 'peach', 'watermelon']
print(items8[-5])  # 'apple'
print(items8[-4])  # 'waxberry'
print(items8[-1])  # watermelon
items8[-4] = 'strawberry'
print(items8)      # ['apple', 'strawberry', 'durian', 'peach', 'watermelon']
```


> 注意：在使用索引运算的时候要避免出现索引越界的情况。

如果希望一次性访问列表中的多个元素，我们可以使用切片运算。切片运算是形如`[start:end:stride]`的运算符，其中`start`代表访问列表元素的起始位置，`end`代表访问列表元素的终止位置（终止位置的元素无法访问），而`stride`则代表了跨度，简单的说就是位置的增量，比如我们访问的第一个元素在`start`位置，那么第二个元素就在`start + stride`位置，当然`start + stride`要小于`end`：

```python 
print(items8[1:3:1])     # ['strawberry', 'durian']
print(items8[0:3:1])     # ['apple', 'strawberry', 'durian']
print(items8[0:5:2])     # ['apple', 'durian', 'watermelon']
print(items8[-4:-2:1])   # ['strawberry', 'durian']
print(items8[-2:-6:-1])  # ['peach', 'durian', 'strawberry', 'apple']
```


如果`start`值等于`0`，那么在使用切片运算符时可以将其省略；如果`end`值等于`N`，`N`代表列表元素的个数，那么在使用切片运算符时可以将其省略；如果`stride`值等于`1`，那么在使用切片运算符时也可以将其省略。

```python 
print(items8[1:3])     # ['strawberry', 'durian']
print(items8[:3:1])    # ['apple', 'strawberry', 'durian']
print(items8[::2])     # ['apple', 'durian', 'watermelon']
print(items8[-4:-2])   # ['strawberry', 'durian']
print(items8[-2::-1])  # ['peach', 'durian', 'strawberry', 'apple']
```


事实上，我们还可以通过切片操作修改列表中的元素:

```python 
items8[1:3] = ['x', 'o']
print(items8)  # ['apple', 'x', 'o', 'peach', 'watermelon']
```


两个列表还可以做关系运算，我们可以比较两个列表是否相等:

```python 
nums1 = [1, 2, 3, 4]
nums2 = list(range(1, 5))
nums3 = [3, 2, 1]
print(nums1 == nums2)  # True
print(nums1 != nums2)  # False
print(nums1 <= nums3)  # True
print(nums2 >= nums3)  # False
```


> **说明**：上面的`nums1`和`nums2`对应元素完全相同，所以`==`运算的结果是`True`。`nums2`和`nums3`的比较，由于`nums2`的第一个元素`1`小于`nums3`的第一个元素`3`，所以`nums2 >= nums3`比较的结果是`False`。两个列表的关系运算在实际工作并不那么常用，如果实在不理解就跳过吧，不用纠结。

### 元素的遍历

如果想逐个取出列表中的元素，可以使用`for-in`循环的:

方法一：在循环结构中通过索引运算，遍历列表元素。

```python 
languages = ["Python", "Java", "C++", "Kotlin"]
for index in range(len(languages)):
    print(languages[index])

```


> **说明**：上面的`len`函数可以获取列表元素的个数`N`，而`range(N)`则构成了从`0`到`N-1`的范围，刚好可以作为列表元素的索引。

方法二：直接对列表做循环，循环变量就是列表元素的代表。

```python 
languages = ["Python", "Java", "C++", "Kotlin"]
for language in languages:
    print(language)

```


### 列表的方法

#### 添加和删除元素

我们可以使用列表的`append`方法向列表中追加元素，使用`insert`方法向列表中插入元素。追加指的是将元素添加到列表的末尾，而插入则是在指定的位置添加新元素:

```python 
languages = ["Python", "Java", "C++"]
languages.append("JavaScript")
print(languages)  # ['Python', 'Java', 'C++', 'JavaScript']
languages.insert(1, "SQL")
print(languages)  # ['Python', 'SQL', 'Java', 'C++', 'JavaScript']

```


列表的`remove`方法从列表中删除指定元素，需要注意的是，如果要删除的元素并不在列表中，会引发`ValueError`错误导致程序崩溃。我们还可以使用`pop`方法从列表中删除元素，`pop`方法默认删除列表中的最后一个元素，当然也可以给一个位置，删除指定位置的元素。在使用`pop`方法删除元素时，如果索引的值超出了范围，会引发`IndexError`异常，导致程序崩溃。除此之外，列表还有一个`clear`方法，可以清空列表中的元素

```python 
languages = ["Python", "SQL", "Java", "C++", "JavaScript"]
if "Java" in languages:
    languages.remove("Java")
if "Swift" in languages:
    languages.remove("Swift")
print(languages)  # ['Python', 'SQL', C++', 'JavaScript']
languages.pop()
temp = languages.pop(1)
print(temp)  # SQL
languages.append(temp)
print(languages)  # ['Python', C++', 'SQL']
languages.clear()
print(languages)  # []

```


> **说明**：`pop`方法删除元素时会得到被删除的元素，上面的代码中，我们将`pop`方法删除的元素赋值给了名为`temp`的变量。当然如果你愿意，还可以把这个元素再次加入到列表中，正如上面的代码`languages.append(temp)`所做的那样。

这里还有一个小问题，例如`languages`列表中有多个`'Python'`，那么我们用`languages.remove('Python')`是删除所有的`'Python'`，还是删除第一个`'Python'`，

从列表中删除元素其实还有一种方式，就是使用 Python 中的`del`关键字后面跟要删除的元素，这种做法跟使用`pop`方法指定索引删除元素没有实质性的区别，但后者会返回删除的元素，前者在性能上略优，因为`del`对应的底层字节码指令是`DELETE_SUBSCR`，而`pop`对应的底层字节码指令是`CALL_METHOD`和`POP_TOP`：

```python 
items = ['Python', 'Java', 'C++']
del items[1]
print(items)  # ['Python', 'C++']
```


#### 元素位置和频次

列表的`index`方法可以查找某个元素在列表中的索引位置，如果找不到指定的元素，`index`方法会引发`ValueError`错误；列表的`count`方法可以统计一个元素在列表中出现的次数

```python 
items = ['Python', 'Java', 'Java', 'C++', 'Kotlin', 'Python']
print(items.index('Python'))     # 0
# 从索引位置1开始查找'Python'
print(items.index('Python', 1))  # 5
print(items.count('Python'))     # 2
print(items.count('Kotlin'))     # 1
print(items.count('Swfit'))      # 0
# 从索引位置3开始查找'Java'
print(items.index('Java', 3))    # ValueError: 'Java' is not in list
```


#### 元素排序和反转

列表的`sort`操作可以实现列表元素的排序，而`reverse`操作可以实现元素的反转

```python 
items = ['Python', 'Java', 'C++', 'Kotlin', 'Swift']
items.sort()
print(items)  # ['C++', 'Java', 'Kotlin', 'Python', 'Swift']
items.reverse()
print(items)  # ['Swift', 'Python', 'Kotlin', 'Java', 'C++']
```


#### 列表生成式

在 Python 中，列表还可以通过一种特殊的字面量语法来创建，这种语法叫做生成式

场景一：创建一个取值范围在`1`到`99`且能被`3`或者`5`整除的数字构成的列表。

```python 
items = []
for i in range(1, 100):
    if i % 3 == 0 or i % 5 == 0:
        items.append(i)
print(items)

```


使用列表生成式实现：

```python 
items = [i for i in range(1, 100) if i % 3 == 0 or i % 5 == 0]
print(items)
```


场景二：有一个整数列表`nums1`，创建一个新的列表`nums2`，`nums2`中的元素是`nums1`中对应元素的平方。

```python 
nums1 = [35, 12, 97, 64, 55]
nums2 = []
for num in nums1:
    nums2.append(num ** 2)
print(nums2)
```


使用列表生成式实现：

```python 
nums1 = [35, 12, 97, 64, 55]
nums2 = [num ** 2 for num in nums1]
print(nums2)
```


场景三： 有一个整数列表`nums1`，创建一个新的列表`nums2`，将`nums1`中大于`50`的元素放到`nums2`中。

```python 
nums1 = [35, 12, 97, 64, 55]
nums2 = []
for num in nums1:
    if num > 50:
        nums2.append(num)
print(nums2)
```


使用列表生成式实现：

```python 
nums1 = [35, 12, 97, 64, 55]
nums2 = [num for num in nums1 if num > 50]
print(nums2)
```


### 嵌套列表

### 列表的应用

## 元组

## 字符串

## 集合

如果我们**把一定范围的、确定的、可以区别的事物当作一个整体来看待**，那么这个整体就是集合，集合中的各个事物称为集合的**元素**。通常，集合需要满足以下要求：

1. **无序性**：一个集合中，每个元素的地位都是相同的，元素之间是无序的。
2. **互异性**：一个集合中，任何两个元素都是不相同的，即元素在集合中只能出现一次。
3. **确定性**：给定一个集合和一个任意元素，该元素要么属这个集合，要么不属于这个集合，二者必居其一，不允许有模棱两可的情况出现。

需要强调的是上面所说的无序性和互异性。无序性说明集合中的元素并不像列中的元素那样存在某种次序，可以通过索引运算就能访问任意元素，**集合并不支持索引运算**。另外，集合的互异性决定了**集合中不能有重复元素**，这一点也是集合区别于列表的地方，我们无法将重复的元素添加到一个集合中。集合类型必然是支持`in`和`not in`成员运算的，这样就可以确定一个元素是否属于集合，也就是上面所说的集合的确定性。**集合的成员运算在性能上要优于列表的成员运算**，这是集合的底层存储特性决定的

> 说明：集合底层使用了哈希存储（散列存储）

### 创建集合

1. 在 Python 中，创建集合可以使用`{}`字面量语法，`{}`中需要至少有一个元素，因为没有元素的`{}`并不是空集合而是一个空字典。
2. 当然，也可以使用 Python 内置函数`set`来创建一个集合，准确的说`set`并不是一个函数，而是创建集合对象的构造器。我们可以使用`set`函数创建一个空集合，也可以用它将其他序列转换成集合，例如：`set('hello')`会得到一个包含了`4`个字符的集合（重复的字符`l`只会在集合中出现一次）。
3. 除了这两种方式，还可以使用生成式语法来创建集合，就像我们之前用生成式语法创建列表那样。

```python 
set1 = {1, 2, 3, 3, 3, 2}
print(set1)

set2 = {"banana", "pitaya", "apple", "apple", "banana", "grape"}
print(set2)

set3 = set("hello")
print(set3)

set4 = set([1, 2, 2, 3, 3, 3, 2, 1])
print(set4)

set5 = {num for num in range(1, 20) if num % 3 == 0 or num % 7 == 0}
print(set5)

```


需要提醒大家，集合中的元素必须是`hashable`类型，所谓`hashable`类型指的是能够计算出哈希码的数据类型，通常不可变类型都是`hashable`类型，如整数（`int`）、浮点小数（`float`）、布尔值（`bool`）、字符串（`str`）、元组（`tuple`）等。可变类型都不是`hashable`类型，因为可变类型无法计算出确定的哈希码，所以它们不能放到集合中。例如：我们不能将列表作为集合中的元素；同理，由于集合本身也是可变类型，所以集合也不能作为集合中的元素。我们可以创建出嵌套列表（列表的元素也是列表），但是我们不能创建出嵌套的集合，这一点在使用集合的时候一定要引起注意。

### 元素的遍历

我们可以通过`len`函数来获得集合中有多少个元素，但是我们不能通过索引运算来遍历集合中的元素，因为集合元素并没有特定的顺序。当然，要实现对集合元素的遍历，我们仍然可以使用`for-in`循环，代码如下所示。

```python 
set1 = {"Python", "C++", "Java", "Kotlin", "Swift"}
for elem in set1:
    print(elem)

```


### 集合的运算

ython 为集合类型提供了非常丰富的运算，主要包括：成员运算、交集运算、并集运算、差集运算、比较运算（相等性、子集、超集）等。

#### 成员运算

可以通过成员运算`in`和`not in` 检查元素是否在集合中

```python 
set1 = {11, 12, 13, 14, 15}
print(10 in set1)  # False
print(15 in set1)  # True
set2 = {"Python", "Java", "C++", "Swift"}
print("Ruby" in set2)  # False
print("Java" in set2)  # True

```


#### 二元运算

集合的二元运算主要指集合的交集、并集、差集、对称差等运算，这些运算可以通过运算符来实现，也可以通过集合类型的方法来实现，代码如下所示。

![](https://noteimagebuket.oss-cn-hangzhou.aliyuncs.com/typora/202508280010904.png)

```python 
set1 = {1, 2, 3, 4, 5, 6, 7}
set2 = {2, 4, 6, 8, 10}

# 交集
print(set1 & set2)                      # {2, 4, 6}
print(set1.intersection(set2))          # {2, 4, 6}

# 并集
print(set1 | set2)                      # {1, 2, 3, 4, 5, 6, 7, 8, 10}
print(set1.union(set2))                 # {1, 2, 3, 4, 5, 6, 7, 8, 10}

# 差集
print(set1 - set2)                      # {1, 3, 5, 7}
print(set1.difference(set2))            # {1, 3, 5, 7}

# 对称差
print(set1 ^ set2)                      # {1, 3, 5, 7, 8, 10}
print(set1.symmetric_difference(set2))  # {1, 3, 5, 7, 8, 10}
```


通过上面的代码可以看出，对两个集合求交集，`&`运算符和`intersection`方法的作用是完全相同的，使用运算符的方式显然更直观且代码也更简短。需要说明的是，集合的二元运算还可以跟赋值运算一起构成复合赋值运算，例如：`set1 |= set2`相当于`set1 = set1 | set2`，跟`|=`作用相同的方法是`update`；`set1 &= set2`相当于`set1 = set1 & set2`，跟`&=`作用相同的方法是`intersection_update`，代码如下所示。

```python 
set1 = {1, 3, 5, 7}
set2 = {2, 4, 6}
set1 |= set2
# set1.update(set2)
print(set1)  # {1, 2, 3, 4, 5, 6, 7}
set3 = {3, 6, 9}
set1 &= set3
# set1.intersection_update(set3)
print(set1)  # {3, 6}
set2 -= set1
# set2.difference_update(set1)
print(set2)  # {2, 4}
```


#### 比较运算

两个集合可以用`==`和`!=`进行相等性判断，如果两个集合中的元素完全相同，那么`==`比较的结果就是`True`，否则就是`False`。

Python 为集合类型提供了判断子集和超集的运算符，其实就是我们非常熟悉的`<`、`<=`、`>`、`>=`这些运算符。当然，我们也可以通过集合类型的方法`issubset`和`issuperset`来判断集合之间的关系，代码如下所示。

```python 
set1 = {1, 3, 5}
set2 = {1, 2, 3, 4, 5}
set3 = {5, 4, 3, 2, 1}

print(set1 < set2)   # True
print(set1 <= set2)  # True
print(set2 < set3)   # False
print(set2 <= set3)  # True
print(set2 > set1)   # True
print(set2 == set3)  # True

print(set1.issubset(set2))    # True
print(set2.issuperset(set1))  # True
```


> **说明**：上面的代码中，`set1 < set2`判断`set1`是不是`set2`的真子集，`set1 <= set2`判断`set1`是不是`set2`的子集，`set2 > set1`判断`set2`是不是`set1`的超集。当然，我们也可以通过`set1.issubset(set2)`判断`set1`是不是`set2`的子集；通过`set2.issuperset(set1)`判断`set2`是不是`set1`的超集。

#### 集合的方法

刚才我们说过，Python 中的集合是可变类型，我们可以通过集合的方法向集合添加元素或从集合中删除元素。

```python 
set1 = {1, 10, 100}

# 添加元素
set1.add(1000)
set1.add(10000)
print(set1)  # {1, 100, 1000, 10, 10000}

# 删除元素
set1.discard(10)
if 100 in set1:
    set1.remove(100)
print(set1)  # {1, 1000, 10000}

# 清空元素
set1.clear()
print(set1)  # set()

```


> **说明**：删除元素的`remove`方法在元素不存在时会引发`KeyError`错误，所以上面的代码中我们先通过成员运算判断元素是否在集合中。集合类型还有一个`pop`方法可以从集合中随机删除一个元素，该方法在删除元素的同时会返回（获得）被删除的元素，而`remove`和`discard`方法仅仅是删除元素，不会返回（获得）被删除的元素。

集合类型还有一个名为`isdisjoint`的方法可以判断两个集合有没有相同的元素，如果没有相同元素，该方法返回`True`，否则该方法返回`False`，代码如下所示。

```python 
set1 = {'Java', 'Python', 'C++', 'Kotlin'}
set2 = {'Kotlin', 'Swift', 'Java', 'Dart'}
set3 = {'HTML', 'CSS', 'JavaScript'}
print(set1.isdisjoint(set2))  # False
print(set1.isdisjoint(set3))  # True
```


#### 不可变集合

Python 中还有一种不可变类型的集合，名字叫`frozenset`。`set`跟`frozenset`的区别就如同`list`跟`tuple`的区别，`frozenset`由于是不可变类型，能够计算出哈希码，因此它可以作为`set`中的元素。除了不能添加和删除元素，`frozenset`在其他方面跟`set`是一样的，下面的代码简单的展示了`frozenset`的用法。

```python 
fset1 = frozenset({1, 3, 5, 7})
fset2 = frozenset(range(1, 6))
print(fset1)          # frozenset({1, 3, 5, 7})
print(fset2)          # frozenset({1, 2, 3, 4, 5})
print(fset1 & fset2)  # frozenset({1, 3, 5})
print(fset1 | fset2)  # frozenset({1, 2, 3, 4, 5, 7})
print(fset1 - fset2)  # frozenset({7})
print(fset1 < fset2)  # False
```


## 字典

这种数据类型最适合把相关联的信息组装到一起。

### 创建和使用字典

Python 中创建字典可以使用`{}`字面量语法，这一点跟上一节课讲的集合是一样的。但是字典的`{}`中的元素是以键值对的形式存在的，每个元素由`:`分隔的两个值构成，`:`前面是键，`:`后面是值，代码如下所示。

```python 
xinhua = {
    '麓': '山脚下',
    '路': '道，往来通行的地方；方面，地区：南～货，外～货；种类：他俩是一～人',
    '蕗': '甘草的别名',
    '潞': '潞水，水名，即今山西省的浊漳河；潞江，水名，即云南省的怒江'
}
print(xinhua)
person = {
    'name': '王大锤',
    'age': 55,
    'height': 168,
    'weight': 60,
    'addr': '成都市武侯区科华北路62号1栋101', 
    'tel': '13122334455',
    'emergence contact': '13800998877'
}
print(person)
```


通过上面的代码，相信大家已经看出来了，用字典来保存一个人的信息远远优于使用列表或元组，因为我们可以用`:`前面的键来表示条目的含义，而`:`后面就是这个条目所对应的值。

当然，如果愿意，我们也可以使用内置函数`dict`或者是字典的生成式语法来创建字典，代码如下所示。

```python 
# dict函数(构造器)中的每一组参数就是字典中的一组键值对
person = dict(name="王大锤", age=55, height=168, weight=60, addr="成都市武侯区科华北路62号1栋101")
print(
    person
)  # {'name': '王大锤', 'age': 55, 'height': 168, 'weight': 60, 'addr': '成都市武侯区科华北路62号1栋101'}

# 可以通过Python内置函数zip压缩两个序列并创建字典
items1 = dict(zip("ABCDE", "12345"))
print(items1)  # {'A': '1', 'B': '2', 'C': '3', 'D': '4', 'E': '5'}
items2 = dict(zip("ABCDE", range(1, 10)))
print(items2)  # {'A': 1, 'B': 2, 'C': 3, 'D': 4, 'E': 5}

# 用字典生成式语法创建字典
items3 = {x: x**3 for x in range(1, 6)}
print(items3)  # {1: 1, 2: 8, 3: 27, 4: 64, 5: 125}

```


想知道字典中一共有多少组键值对，仍然是使用`len`函数；如果想对字典进行遍历，可以用`for`循环，但是需要注意，`for`循环只是对字典的键进行了遍历，不过没关系，在学习了字典的索引运算后，我们可以通过字典的键访问它对应的值。

```python 
person = {
    'name': '王大锤',
    'age': 55,
    'height': 168,
    'weight': 60,
    'addr': '成都市武侯区科华北路62号1栋101'
}
print(len(person))  # 5
for key in person:
    print(key)
```


### 字典的运算

对于字典类型来说，成员运算和索引运算肯定是很重要的，前者可以判定指定的键在不在字典中，后者可以通过键访问对应的值或者向字典中添加新的键值对。

```python 
person = {
    "name": "王大锤",
    "age": 55,
    "height": 168,
    "weight": 60,
    "addr": "成都市武侯区科华北路62号1栋101",
}

# 成员运算
print("name" in person)  # True
print("tel" in person)  # False

# 索引运算
print(person["name"])
print(person["addr"])
person["age"] = 25
person["height"] = 178
person["tel"] = "13122334455"
person["signature"] = "你的男朋友是一个盖世垃圾，他会踏着五彩祥云去迎娶你的闺蜜"
print(person)

# 循环遍历
for key in person:
    print(f"{key}:\t{person[key]}")

```


需要注意，在通过索引运算获取字典中的值时，如指定的键没有在字典中，将会引发`KeyError`异常。

### 字典的方法

1. 获取键值

字典类型的方法基本上都跟字典的键值对操作相关，其中`get`方法可以通过键来获取对应的值。跟索引运算不同的是，`get`方法在字典中没有指定的键时不会产生异常，而是返回`None`或指定的默认值，代码如下所示。

```python 
person = {"name": "王大锤", "age": 25, "height": 178, "addr": "成都市武侯区科华北路62号1栋101"}
print(person.get("name"))  # 王大锤
print(person.get("sex"))  # None
print(person.get("sex", True))  # True

```


如果需要获取字典中所有的键，可以使用`keys`方法；如果需要获取字典中所有的值，可以使用`values`方法。字典还有一个名为`items`的方法，它会将键和值组装成二元组，通过该方法来遍历字典中的元素也是非常方便的。

```python 
person = {'name': '王大锤', 'age': 25, 'height': 178}
print(person.keys())    # dict_keys(['name', 'age', 'height'])
print(person.values())  # dict_values(['王大锤', 25, 178])
print(person.items())   # dict_items([('name', '王大锤'), ('age', 25), ('height', 178)])
for key, value in person.items():
    print(f'{key}:\t{value}')
```


1. 更新

字典的`update`方法实现两个字典的合并操作。例如，有两个字典`x`和`y`，当执行`x.update(y)`操作时，`x`跟`y`相同的键对应的值会被`y`中的值更新，而`y`中有但`x`中没有的键值对会直接添加到`x`中，代码如下所示。

```python 
person1 = {'name': '王大锤', 'age': 55, 'height': 178}
person2 = {'age': 25, 'addr': '成都市武侯区科华北路62号1栋101'}
person1.update(person2)
print(person1)  # {'name': '王大锤', 'age': 25, 'height': 178, 'addr': '成都市武侯区科华北路62号1栋101'}
```


如果使用 Python 3.9 及以上的版本，也可以使用|运算符来完成同样的操作，代码如下所示。

```python 
person1 = {'name': '王大锤', 'age': 55, 'height': 178}
person2 = {'age': 25, 'addr': '成都市武侯区科华北路62号1栋101'}
person1 |= person2
print(person1)  # {'name': '王大锤', 'age': 25, 'height': 178, 'addr': '成都市武侯区科华北路62号1栋101'}
```


1. 删除

可以通过`pop`或`popitem`方法从字典中删除元素，前者会返回（获得）键对应的值，但是如果字典中不存在指定的键，会引发`KeyError`错误；后者在删除元素时，会返回（获得）键和值组成的二元组。字典的`clear`方法会清空字典中所有的键值对，代码如下所示。

```python 
person = {'name': '王大锤', 'age': 25, 'height': 178, 'addr': '成都市武侯区科华北路62号1栋101'}
print(person.pop('age'))  # 25
print(person)             # {'name': '王大锤', 'height': 178, 'addr': '成都市武侯区科华北路62号1栋101'}
print(person.popitem())   # ('addr', '成都市武侯区科华北路62号1栋101')
print(person)             # {'name': '王大锤', 'height': 178}
person.clear()
print(person)             # {}
```


跟列表一样，从字典中删除元素也可以使用`del`关键字，在删除元素的时候如果指定的键索引不到对应的值，一样会引发`KeyError`错误，具体的做法如下所示。

```python 
person = {'name': '王大锤', 'age': 25, 'height': 178, 'addr': '成都市武侯区科华北路62号1栋101'}
del person['age']
del person['addr']
print(person)  # {'name': '王大锤', 'height': 178}
```


### 字典的应用

**例子1**：输入一段话，统计每个英文字母出现的次数，按出现次数从高到低输出。

```python 
sentence = input("请输入一段话: ")
counter = {}
for ch in sentence:
    if "A" <= ch <= "Z" or "a" <= ch <= "z":
        counter[ch] = counter.get(ch, 0) + 1
sorted_keys = sorted(counter, key=counter.get, reverse=True)
for key in sorted_keys:
    print(f"{key} 出现了 {counter[key]} 次.")

```


**例子2**：在一个字典中保存了股票的代码和价格，找出股价大于100元的股票并创建一个新的字典。

```python 
stocks = {
    "AAPL": 191.88,
    "GOOG": 1186.96,
    "IBM": 149.24,
    "ORCL": 48.44,
    "ACN": 166.89,
    "FB": 208.09,
    "SYMC": 21.29,
}
stocks2 = {key: value for key, value in stocks.items() if value > 100}
print(stocks2)

```


**说明**：可以用字典的生成式语法来创建这个新字典。

# 函数

**函数是对功能相对独立且会重复使用的代码的封装**。

## 函数和模块

### 定义函数

Python 中可以使用`def`关键字来定义函数，和变量一样每个函数也应该有一个漂亮的名字，命名规则跟变量的命名规则是一样的。在函数名后面的圆括号中可以设置函数的参数，也就是我们刚才说的函数的自变量，而函数执行完成后，我们会通过`return`关键字来返回函数的执行结果，这就是我们刚才说的函数的因变量。如果函数中没有`return`语句，那么函数会返回代表空值的`None`。另外，函数也可以没有自变量（参数），但是函数名后面的圆括号是必须有的。

![](https://noteimagebuket.oss-cn-hangzhou.aliyuncs.com/typora/202508280010817.png)

```python 
"""
输入m和n，计算组合数C(m,n)的值

Version: 1.1
Author: 骆昊
"""


# 通过关键字def定义求阶乘的函数
# 自变量（参数）num是一个非负整数
# 因变量（返回值）是num的阶乘
def fac(num):
    result = 1
    for n in range(2, num + 1):
        result *= n
    return result


m = int(input("m = "))
n = int(input("n = "))
# 计算阶乘的时候不需要写重复的代码而是直接调用函数
# 调用函数的语法是在函数名后面跟上圆括号并传入参数
print(fac(m) // fac(n) // fac(m - n))

```


Python 标准库的`math`模块中，已经有一个名为`factorial`的函数实现了求阶乘的功能，我们可以直接用`import math`导入`math`模块，然后使用`math.factorial`来调用求阶乘的函数；我们也可以通过`from math import factorial`直接导入`factorial`函数来使用它，代码如下所示。

```python 
"""
输入m和n，计算组合数C(m,n)的值

Version: 1.2
Author: 骆昊
"""
from math import factorial

m = int(input("m = "))
n = int(input("n = "))
print(factorial(m) // factorial(n) // factorial(m - n))

```


对于上面的代码，如果你觉得`factorial`这个名字太长，书写代码的时候不是特别方便，我们在导入函数的时候还可以通过`as`关键字为其别名。在调用函数的时候，我们可以用函数的别名

```python 
"""
输入m和n，计算组合数C(m,n)的值

Version: 1.3
Author: 骆昊
"""
from math import factorial as f

m = int(input("m = "))
n = int(input("n = "))
print(f(m) // f(n) // f(m - n))

```


### 函数的参数

1. 位置参数和关键字参数

我们再来写一个函数，根据给出的三条边的长度判断是否可以构成三角形，如果可以构成三角形则返回`True`，否则返回`False`，代码如下所示。

```python 
def make_judgement(a, b, c):
    """判断三条边的长度能否构成三角形"""
    return a + b > c and b + c > a and a + c > b

```


上面`make_judgement`函数有三个参数，这种参数叫做位置参数，在调用函数时通常按照从左到右的顺序依次传入，而且传入参数的数量必须和定义函数时参数的数量相同，如下所示。

```python 
print(make_judgement(1, 2, 3))  # False
print(make_judgement(4, 5, 6))  # True
```


如果不想按照从左到右的顺序依次给出`a`、`b`、`c` 三个参数的值，也可以使用关键字参数，通过“参数名=参数值”的形式为函数传入参数，如下所示。

```python 
print(make_judgement(b=2, c=3, a=1))  # False
print(make_judgement(c=6, b=4, a=5))  # True
```


在定义函数时，我们可以在参数列表中用`/`设置**强制位置参数**（*positional-only arguments*），用`*`设置**命名关键字参数**。所谓强制位置参数，就是调用函数时只能按照参数位置来接收参数值的参数；而命名关键字参数只能通过“参数名=参数值”的方式来传递和接收参数

```python 
# /前面的参数是强制位置参数
def make_judgement(a, b, c, /):
    """判断三条边的长度能否构成三角形"""
    return a + b > c and b + c > a and a + c > b


# 下面的代码会产生TypeError错误，错误信息提示“强制位置参数是不允许给出参数名的”
# TypeError: make_judgement() got some positional-only arguments passed as keyword arguments
# print(make_judgement(b=2, c=3, a=1))

```


```python 
# *后面的参数是命名关键字参数
def make_judgement(*, a, b, c):
    """判断三条边的长度能否构成三角形"""
    return a + b > c and b + c > a and a + c > b


# 下面的代码会产生TypeError错误，错误信息提示“函数没有位置参数但却给了3个位置参数”
# TypeError: make_judgement() takes 0 positional arguments but 3 were given
# print(make_judgement(1, 2, 3))

```


1. 参数的默认值

简单的例子:

```python 
def add(a=0, b=0, c=0):
    """三个数相加求和"""
    return a + b + c


# 调用add函数，没有传入参数，那么a、b、c都使用默认值0
print(add())  # 0
# 调用add函数，传入一个参数，该参数赋值给变量a, 变量b和c使用默认值0
print(add(1))  # 1
# 调用add函数，传入两个参数，分别赋值给变量a和b，变量c使用默认值0
print(add(1, 2))  # 3
# 调用add函数，传入三个参数，分别赋值给a、b、c三个变量
print(add(1, 2, 3))  # 6

```


需要注意的是，**带默认值的参数必须放在不带默认值的参数之后**，否则将产生`SyntaxError`错误，错误消息是：`non-default argument follows default argument`，翻译成中文的意思是“没有默认值的参数放在了带默认值的参数后面”。

1. 可变参数

Python 语言中可以通过星号表达式语法让函数支持可变参数。所谓可变参数指的是在调用函数时，可以向函数传入`0`个或任意多个参数。

下面的代码演示了如何使用可变位置参数实现对任意多个数求和的`add`函数，调用函数时传入的参数会保存到一个元组，通过对该元组的遍历，可以获取传入函数的参数。

```python 
# 用星号表达式来表示args可以接收0个或任意多个参数
# 调用函数时传入的n个参数会组装成一个n元组赋给args
# 如果一个参数都没有传入，那么args会是一个空元组
def add(*args):
    total = 0
    # 对保存可变参数的元组进行循环遍历
    for val in args:
        # 对参数进行了类型检查（数值型的才能求和）
        if type(val) in (int, float):
            total += val
    return total


# 在调用add函数时可以传入0个或任意多个参数
print(add())         # 0
print(add(1))        # 1
print(add(1, 2, 3))  # 6
print(add(1, 2, 'hello', 3.45, 6))  # 12.45
```


如果我们希望通过“参数名=参数值”的形式传入若干个参数，具体有多少个参数也是不确定的，我们还可以给函数添加可变关键字参数，把传入的关键字参数组装到一个字典中，代码如下所示。

```python 
# 参数列表中的**kwargs可以接收0个或任意多个关键字参数
# 调用函数时传入的关键字参数会组装成一个字典（参数名是字典中的键，参数值是字典中的值）
# 如果一个关键字参数都没有传入，那么kwargs会是一个空字典
def foo(*args, **kwargs):
    print(args)
    print(kwargs)


foo(3, 2.1, True, name="骆昊", age=43, gpa=4.95)
# 输出：
# (3, 2.1, True)
# {'name': '骆昊', 'age': 43, 'gpa': 4.95}

```


### 用模块管理函数

Python 中每个文件就代表了一个模块（module），我们在不同的模块中可以有同名的函数，在使用函数的时候，我们通过`import`关键字导入指定的模块再使用**完全限定名**（`模块名.函数名`）的调用方式，就可以区分到底要使用的是哪个模块中的`foo`函数，代码如下所示。

[module1.py](http://module1.py "module1.py"):

```python 
def foo():
    print('hello, world!')
```


[module2.py](http://module2.py "module2.py"):

```python 
def foo():
    print('goodbye, world!')
```


[test.py](http://test.py "test.py"):

```python 
import module1
import module2

# 用“模块名.函数名”的方式（完全限定名）调用函数，
module1.foo()  # hello, world!
module2.foo()  # goodbye, world!
```


在导入模块时，还可以使用`as`关键字对模块进行别名，这样我们可以使用更为简短的完全限定名。

[test.py](http://test.py "test.py"):

```python 
import module1 as m1
import module2 as m2

m1.foo()  # hello, world!
m2.foo()  # goodbye, world!

```


上面两段代码，我们导入的是定义函数的模块，我们也可以使用`from...import...`语法从模块中直接导入需要使用的函数，代码如下所示。

```python 
from module1 import foo

foo()  # hello, world!

from module2 import foo

foo()  # goodbye, world!

```


但是，如果我们如果从两个不同的模块中导入了同名的函数，后面导入的函数会替换掉之前的导入，就像下面的代码，调用`foo`会输出`goodbye, world!`，因为我们先导入了`module1`的`foo`，后导入了`module2`的`foo` 。如果两个`from...import...`反过来写，那就是另外一番光景了。

[test.py](http://test.py "test.py"):

```python 
from module1 import foo
from module2 import foo

foo()  # goodbye, world!
```


如果想在上面的代码中同时使用来自两个模块的`foo`函数还是有办法的，大家可能已经猜到了，还是用`as`关键字对导入的函数进行别名，代码如下所示。

`test.py`:

```python 
from module1 import foo as f1
from module2 import foo as f2

f1()  # hello, world!
f2()  # goodbye, world!
```


## 函数应用实战

### 例子1：随机验证码

设计一个生成随机验证码的函数，验证码由数字和英文大小写字母构成，长度可以通过参数设置。

```python 
import random
import string

ALL_CHARS = string.digits + string.ascii_letters


def generate_code(*, code_len=4):
    """
    生成指定长度的验证码
    :param code_len: 验证码的长度(默认4个字符)
    :return: 由大小写英文字母和数字构成的随机验证码字符串
    """
    return "".join(random.choices(ALL_CHARS, k=code_len))

```


> **说明1**：`string`模块的`digits`代表0到9的数字构成的字符串`'0123456789'`，`string`模块的`ascii_letters`代表大小写英文字母构成的字符串`'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'`。

> **说明2**：`random`模块的`sample`和`choices`函数都可以实现随机抽样，`sample`实现无放回抽样，这意味着抽样取出的元素是不重复的；`choices`实现有放回抽样，这意味着可能会重复选中某些元素。这两个函数的第一个参数代表抽样的总体，而参数`k`代表样本容量，需要说明的是`choices`函数的参数`k`是一个命名关键字参数，在传参时必须指定参数名。

使用:

```python 
for _ in range(5):
    print(generate_code()) 

# 或
for _ in range(5):
    print(generate_code(code_len=6))

```


> **说明**：我们设计的`generate_code`函数的参数是命名关键字参数，由于它有默认值，可以不给它传值，使用默认值4。如果需要给函数传入参数，必须指定参数名`code_len`。

### 例子2：判断素数

设计一个判断给定的大于1的正整数是不是质数的函数。质数是只能被1和自身整除的正整数（大于1），如果一个大于 1 的正整数N是质数，那就意味着在 2 到N-1之间都没有它的因子。

```python 
def is_prime(num: int) -> bool:
    """
    判断一个正整数是不是质数
    :param num: 大于1的正整数
    :return: 如果num是质数返回True，否则返回False
    """
    for i in range(2, int(num**0.5) + 1):
        if num % i == 0:
            return False
    return True

```


> **说明1**：上面`is_prime`函数的参数`num`后面的`: int`用来标注参数的类型，虽然它对代码的执行结果不产生任何影响，但是很好的增强了代码的可读性。同理，参数列表后面的`-> bool`用来标注函数返回值的类型，它也不会对代码的执行结果产生影响，但是却让我们清楚的知道，调用函数会得到一个布尔值，要么是`True`，要么是`False`。

> **说明2**：上面的循环并不需要从 2 循环到 N−1 ，因为如果循环进行到 N 时，还没有找到$\small{N}$的因子，那么 N 之后也不会出现 N 的因子，大家可以自己想一想这是为什么。

### 例子3：最大公约数和最小公倍数

设计计算两个正整数最大公约数和最小公倍数的函数。

```python 
def lcm(x: int, y: int) -> int:
    """求最小公倍数"""
    return x * y // gcd(x, y)


def gcd(x: int, y: int) -> int:
    """求最大公约数"""
    while y % x != 0:
        x, y = y % x, x
    return x

```


## 函数使用进阶

### 高阶函数

把一个函数作为其他函数的参数或返回值的用法，我们通常称之为“高阶函数”。

```python 
def calc(*args, **kwargs):
    items = list(args) + list(kwargs.values())
    result = 0
    for item in items:
        if type(item) in (int, float):
            result += item
    return result

```


如果我们希望上面的`calc`函数不仅仅可以做多个参数的求和，还可以实现更多的甚至是自定义的二元运算，我们该怎么做呢？上面的代码只能求和是因为函数中使用了`+=`运算符，这使得函数跟加法运算形成了耦合关系，如果能解除这种耦合关系，函数的通用性和灵活性就会更好。解除耦合的办法就是将`+`运算符变成函数调用，并将其设计为函数的参数，代码如下所示。

```python 
def calc(init_value, op_func, *args, **kwargs):
    items = list(args) + list(kwargs.values())
    result = init_value
    for item in items:
        if type(item) in (int, float):
            result = op_func(result, item)
    return result

```


注意，上面的函数增加了两个参数，其中`init_value`代表运算的初始值，`op_func`代表二元运算函数，为了调用修改后的函数，我们先定义做加法和乘法运算的函数，代码如下所示。

```python 
def add(x, y):
    return x + y


def mul(x, y):
    return x * y

```


如果要做求和的运算，我们可以按照下面的方式调用`calc`函数。

```python 
print(calc(0, add, 1, 2, 3, 4, 5))  # 15

```


如果要做求乘积运算，我们可以按照下面的方式调用`calc`函数。

```python 
print(calc(1, mul, 1, 2, 3, 4, 5))  # 120 
```


上面的`calc`函数通过将运算符变成函数的参数，实现了跟加法运算耦合，这是一种非常高明和实用的编程技巧，但对于最初学者来说可能会觉得难以理解，建议大家细品一下。需要注意上面的代码中，将函数作为参数传入其他函数和直接调用函数是有显著的区别的，**调用函数需要在函数名后面跟上圆括号，而把函数作为参数时只需要函数名即可**。

### Lambda函数

在使用高阶函数的时候，如果作为参数或者返回值的函数本身非常简单，一行代码就能够完成，也不需要考虑对函数的复用，那么我们可以使用 lambda 函数。Python 中的 lambda 函数是没有的名字函数，所以很多人也把它叫做**匿名函数**，lambda 函数只能有一行代码，代码中的表达式产生的运算结果就是这个匿名函数的返回值。之前的代码中，我们写的`is_even`和`square`函数都只有一行代码，我们可以考虑用 lambda 函数来替换掉它们，代码如下所示。

```python 
old_nums = [35, 12, 8, 99, 60, 52]
new_nums = list(map(lambda x: x**2, filter(lambda x: x % 2 == 0, old_nums)))
print(new_nums)  # [144, 64, 3600, 2704]

```


通过上面的代码可以看出，定义 lambda 函数的关键字是`lambda`，后面跟函数的参数，如果有多个参数用逗号进行分隔；冒号后面的部分就是函数的执行体，通常是一个表达式，表达式的运算结果就是 lambda 函数的返回值，不需要写`return` 关键字。

### 偏函数

偏函数是指固定函数的某些参数，生成一个新的函数，这样就无需在每次调用函数时都传递相同的参数。在 Python 语言中，我们可以使用`functools`模块的`partial`函数来创建偏函数。例如，`int`函数在默认情况下可以将字符串视为十进制整数进行类型转换，如果我们修修改它的`base`参数，就可以定义出三个新函数，分别用于将二进制、八进制、十六进制字符串转换为整数，代码如下所示。

```python 
import functools

int2 = functools.partial(int, base=2)
int8 = functools.partial(int, base=8)
int16 = functools.partial(int, base=16)

print(int('1001'))    # 1001

print(int2('1001'))   # 9
print(int8('1001'))   # 513
print(int16('1001'))  # 4097
```


`partial`函数的第一个参数和返回值都是函数，它将传入的函数处理成一个新的函数返回。通过构造偏函数，我们可以结合实际的使用场景将原函数变成使用起来更为便捷的新函数。

## 函数高级应用

### 装饰器

Python 语言中，装饰器是“**用一个函数装饰另外一个函数并为其提供额外的能力**”的语法现象。装饰器本身是一个函数，它的参数是被装饰的函数，它的返回值是一个带有装饰功能的函数。通过前面的描述，相信大家已经听出来了，装饰器是一个高阶函数，它的参数和返回值都是函数。

```python 
import random
import time


def download(filename):
    """下载文件"""
    print(f"开始下载{filename}.")
    time.sleep(random.random() * 6)
    print(f"{filename}下载完成.")


def upload(filename):
    """上传文件"""
    print(f"开始上传{filename}.")
    time.sleep(random.random() * 8)
    print(f"{filename}上传完成.")


download("MySQL从删库到跑路.avi")
upload("Python从入门到住院.pdf")

```


现在有一个新的需求，我们希望知道调用`download`和`upload`函数上传下载文件到底用了多少时间，这应该如何实现呢？相信很多小伙伴已经想到了，我们可以在函数开始执行的时候记录一个时间，在函数调用结束后记录一个时间，两个时间相减就可以计算出下载或上传的时间，代码如下所示。

```python 
start = time.time()
download("MySQL从删库到跑路.avi")
end = time.time()
print(f"花费时间: {end - start:.2f}秒")
start = time.time()
upload("Python从入门到住院.pdf")
end = time.time()
print(f"花费时间: {end - start:.2f}秒")

```


上面记录时间、计算和显示执行时间的代码都是重复代码。那么有没有办法在不写重复代码的前提下，用一种简单优雅的方式记录下函数的执行时间呢？在 Python 语言中，装饰器就是解决这类问题的最佳选择。通过装饰器语法，我们可以把跟原来的业务（上传和下载）没有关系计时功能的代码封装到一个函数中，如果`upload`和`download`函数需要记录时间，我们直接把装饰器作用到这两个函数上即可。

```python title="装饰器"
def record_time(func):
    def wrapper(*args, **kwargs):
        result = func(*args, **kwargs)

        return result

    return wrapper

```


`record_time`函数的参数`func`代表了一个被装饰的函数，函数里面定义的`wrapper`函数是带有装饰功能的函数，它会执行被装饰的函数`func`，它还需要返回在最后产生函数执行的返回值。`record_time`函数最终会返回这个带有装饰功能的函数`wrapper`并通过它替代原函数`func`，当原函数`func`被`record_time`函数装饰后，我们调用它时其实调用的是`wrapper`函数，所以才获得了额外的能力。`wrapper`函数的参数比较特殊，由于我们要用`wrapper`替代原函数`func`，但是我们又不清楚原函数`func`会接受哪些参数，所以我们就通过可变参数和关键字参数照单全收，然后在调用`func`的时候，原封不动的全部给它。

记录时间的功能写到这个装饰器中：

```python 
import time
def record_time(func):
    def wrapper(*args, **kwargs):
        # 在执行被装饰的函数之前记录开始时间
        start = time.time()
        # 执行被装饰的函数并获取返回值
        result = func(*args, **kwargs)
        # 在执行被装饰的函数之后记录结束时间
        end = time.time()
        # 计算和显示被装饰函数的执行时间
        print(f"{func.__name__}执行时间: {end - start:.2f}秒")
        # 返回被装饰函数的返回值
        return result

    return wrapper

```


使用上面的装饰器函数有两种方式，第一种方式就是直接调用装饰器函数，传入被装饰的函数并获得返回值，我们可以用这个返回值直接替代原来的函数，那么在调用时就已经获得了装饰器提供的额外的能力（记录执行时间）

```python 
download = record_time(download)
upload = record_time(upload)
download("MySQL从删库到跑路.avi")
upload("Python从入门到住院.pdf")

```


在 Python 中，使用装饰器很有更为便捷的**语法糖**，可以用`@装饰器函数`将装饰器函数直接放在被装饰的函数上，效果跟上面的代码相同。

```python 
import random
import time


def record_time(func):
    def wrapper(*args, **kwargs):
        start = time.time()
        result = func(*args, **kwargs)
        end = time.time()
        print(f"{func.__name__}执行时间: {end - start:.2f}秒")
        return result

    return wrapper


@record_time
def download(filename):
    print(f"开始下载{filename}.")
    time.sleep(random.random() * 6)
    print(f"{filename}下载完成.")


@record_time
def upload(filename):
    print(f"开始上传{filename}.")
    time.sleep(random.random() * 8)
    print(f"{filename}上传完成.")


download("MySQL从删库到跑路.avi")
upload("Python从入门到住院.pdf")

```


如果在代码的某些地方，我们想去掉装饰器的作用执行原函数，那么在定义装饰器函数的时候，需要做一点点额外的工作。Python 标准库`functools`模块的`wraps`函数也是一个装饰器，我们将它放在`wrapper`函数上，这个装饰器可以帮我们保留被装饰之前的函数，这样在需要取消装饰器时，可以通过被装饰函数的`__wrapped__`属性获得被装饰之前的函数。

```python 
import random
import time

from functools import wraps


def record_time(func):

    @wraps(func)
    def wrapper(*args, **kwargs):
        start = time.time()
        result = func(*args, **kwargs)
        end = time.time()
        print(f'{func.__name__}执行时间: {end - start:.2f}秒')
        return result

    return wrapper


@record_time
def download(filename):
    print(f'开始下载{filename}.')
    time.sleep(random.random() * 6)
    print(f'{filename}下载完成.')


@record_time
def upload(filename):
    print(f'开始上传{filename}.')
    time.sleep(random.random() * 8)
    print(f'{filename}上传完成.')


# 调用装饰后的函数会记录执行时间
download('MySQL从删库到跑路.avi')
upload('Python从入门到住院.pdf')
# 取消装饰器的作用不记录执行时间
download.__wrapped__('MySQL必知必会.pdf')
upload.__wrapped__('Python从新手到大师.pdf')
```


**装饰器函数本身也可以参数化**，简单的说就是装饰器也是可以通过调用者传入的参数来进行定制的。

### 递归调用

使用递归调用的方式来写一个求阶乘的函数，代码如下所示。

```python 
def fac(num):
    if num in (0, 1):
        return 1
    return num * fac(num - 1)

```


上面的代码中，`fac`函数中又调用了`fac`函数，这就是所谓的递归调用。代码第2行的`if`条件叫做递归的收敛条件，简单的说就是什么时候要结束函数的递归调用，在计算阶乘时，如果计算到`0`或`1`的阶乘，就停止递归调用，直接返回`1`；代码第4行的`num * fac(num - 1)`是递归公式，也就是阶乘的递归定义。下面，我们简单的分析下，如果用`fac(5)`计算`5`的阶乘，整个过程会是怎样的。

```markdown 
# 递归调用函数入栈
# 5 * fac(4)
# 5 * (4 * fac(3))
# 5 * (4 * (3 * fac(2)))
# 5 * (4 * (3 * (2 * fac(1))))
# 停止递归函数出栈
# 5 * (4 * (3 * (2 * 1)))
# 5 * (4 * (3 * 2))
# 5 * (4 * 6)
# 5 * 24
# 120
print(fac(5))    # 120
```


> 注意，函数调用会通过内存中称为“栈”（stack）的数据结构来保存当前代码的执行现场，函数调用结束后会通过这个栈结构恢复之前的执行现场。栈是一种先进后出的数据结构，这也就意味着最早入栈的函数最后才会返回，而最后入栈的函数会最先返回。例如调用一个名为`a`的函数，函数`a`的执行体中又调用了函数`b`，函数`b`的执行体中又调用了函数`c`，那么最先入栈的函数是`a`，最先出栈的函数是`c`。每进入一个函数调用，栈就会增加一层栈帧（stack frame），栈帧就是我们刚才提到的保存当前代码执行现场的结构；每当函数调用结束后，栈就会减少一层栈帧。通常，内存中的栈空间很小，因此递归调用的次数如果太多，会导致栈溢出（stack overflow），所以**递归调用一定要确保能够快速收敛**。我们可以尝试执行`fac(5000)`，看看是不是会提示`RecursionError`错误，错误消息为：`maximum recursion depth exceeded in comparison`（超出最大递归深度），其实就是发生了栈溢出。

# 面向对象编程

## 面向对象编程入门

在面向对象编程的世界里，程序中的**数据和操作数据的函数是一个逻辑上的整体**，我们称之为**对象**，**对象可以接收消息**，解决问题的方法就是**创建对象并向对象发出各种各样的消息**；通过消息传递，程序中的多个对象可以协同工作，这样就能构造出复杂的系统并解决现实中的问题。

### 类和对象

> **面向对象编程**：把一组数据和处理数据的方法组成**对象**，把行为相同的对象归纳为**类**，通过**封装**隐藏对象的内部细节，通过**继承**实现类的特化和泛化，通过**多态**实现基于对象类型的动态分派。

简而言之，**类是对象的蓝图和模板，对象是类的实例，是可以接受消息的实体**。

在面向对象编程的世界中，**一切皆为对象**，**对象都有属性和行为**，**每个对象都是独一无二的**，而且**对象一定属于某个类**。对象的属性是对象的静态特征，对象的行为是对象的动态特征。

### 定义类

在 Python 语言中，我们可以使用`class`关键字加上类名来定义类，通过缩进我们可以确定类的代码块。在类的代码块中，我们需要写一些函数，我们说过类是一个抽象概念，那么这些函数就是我们对一类对象共同的动态特征的提取。写在类里面的函数我们通常称之为**方法**，方法就是对象的行为，也就是对象可以接收的消息。方法的第一个参数通常都是`self`，它代表了接收这个消息的对象本身。

```python 
class Student:
    def study(self, course_name):
        print(f"学生正在学习{course_name}.")

    def play(self):
        print(f"学生正在玩游戏.")

```


### 创建和使用对象

在我们定义好一个类之后，可以使用构造器语法来创建对象，代码如下所示。

```python 
stu1 = Student()
stu2 = Student()
print(stu1)  # <__main__.Student object at 0x10ad5ac50>
print(stu2)  # <__main__.Student object at 0x10ad5acd0>
print(hex(id(stu1)), hex(id(stu2)))  # 0x10ad5ac50 0x10ad5acd0

```


在类的名字后跟上圆括号就是所谓的构造器语法，上面的代码创建了两个学生对象，一个赋值给变量`stu1`，一个赋值给变量`stu2`。当我们用`print`函数打印`stu1`和`stu2`两个变量时，我们会看到输出了对象在内存中的地址（十六进制形式），跟我们用`id`函数查看对象标识获得的值是相同的。现在我们可以告诉大家，我们定义的变量其实保存的是一个对象在内存中的逻辑地址（位置），通过这个逻辑地址，我们就可以在内存中找到这个对象。所以`stu3 = stu2`这样的赋值语句并没有创建新的对象，只是用一个新的变量保存了已有对象的地址。

接下来，我们尝试给对象发消息，即调用对象的方法。刚才的`Student`类中我们定义了`study`和`play`两个方法，两个方法的第一个参数`self`代表了接收消息的学生对象，`study`方法的第二个参数是学习的课程名称。Python中，给对象发消息有两种方式，请看下面的代码。

```python 
# 通过“类.方法”调用方法
# 第一个参数是接收消息的对象
# 第二个参数是学习的课程名称
Student.study(stu1, "Python程序设计")  # 学生正在学习Python程序设计.
# 通过“对象.方法”调用方法
# 点前面的对象就是接收消息的对象
# 只需要传入第二个参数课程名称
stu1.study("Python程序设计")  # 学生正在学习Python程序设计.

Student.play(stu2)  # 学生正在玩游戏.
stu2.play()  # 学生正在玩游戏.

```


### 初始化方法

如果要给学生对象定义属性，我们可以修改`Student`类，为其添加一个名为`__init__`的方法。在我们调用`Student`类的构造器创建对象时，首先会在内存中获得保存学生对象所需的内存空间，然后通过自动执行`__init__`方法，完成对内存的初始化操作，也就是把数据放到内存空间中。所以我们可以通过给`Student`类添加`__init__`方法的方式为学生对象指定属性，同时完成对属性赋初始值的操作，正因如此，`__init__`方法通常也被称为初始化方法。

我们对上面的`Student`类稍作修改，给学生对象添加`name`（姓名）和`age`（年龄）两个属性。

```python 
class Student:
    """学生"""

    def __init__(self, name, age):
        """初始化方法"""
        self.name = name
        self.age = age

    def study(self, course_name):
        """学习"""
        print(f"{self.name}正在学习{course_name}.")

    def play(self):
        """玩耍"""
        print(f"{self.name}正在玩游戏.")

```


修改刚才创建对象和给对象发消息的代码，重新执行一次，

```python 
# 调用Student类的构造器创建对象并传入初始化参数
stu1 = Student('骆昊', 44)
stu2 = Student('王大锤', 25)
stu1.study('Python程序设计')    # 骆昊正在学习Python程序设计.
stu2.play()                    # 王大锤正在玩游戏.
```


## 面向对象编程进阶

### 可见性和属性装饰器

在 Python 中，可以通过给对象属性名添加前缀下划线的方式来说明属性的访问可见性，例如，可以用`__name`表示一个私有属性，`_name`表示一个受保护属性，代码如下所示。

```python 
class Student:
    def __init__(self, name, age):
        self.__name = name
        self.__age = age

    def study(self, course_name):
        print(f"{self.__name}正在学习{course_name}.")


stu = Student("王大锤", 20)
stu.study("Python程序设计")
print(stu.__name)  # AttributeError: 'Student' object has no attribute '__name'

```


上面代码的最后一行会引发`AttributeError`（属性错误）异常，异常消息为：`'Student' object has no attribute '__name'`。由此可见，以`__`开头的属性`__name`相当于是私有的，在类的外面无法直接访问，但是类里面的`study`方法中可以通过`self.__name`访问该属性。

### 动态属性

目前流行的 Python 和 JavaScript 都是动态语言.

在 Python 中，我们可以动态为对象添加属性，这是 Python 作为动态类型语言的一项特权，代码如下所示。需要提醒大家的是，对象的方法其实本质上也是对象的属性，如果给对象发送一个无法接收的消息，引发的异常仍然是`AttributeError`。

```python 
class Student:
    def __init__(self, name, age):
        self.name = name
        self.age = age


stu = Student("王大锤", 20)
stu.sex = "男"  # 给学生对象动态添加sex属性

```


如果不希望在使用对象时动态的为对象添加属性，可以使用 Python 语言中的`__slots__`魔法。对于`Student`类来说，可以在类中指定`__slots__ = ('name', 'age')`，这样`Student`类的对象只能有`name`和`age`属性，如果想动态添加其他属性将会引发异常，代码如下所示。

```python 
class Student:
    __slots__ = ("name", "age")

    def __init__(self, name, age):
        self.name = name
        self.age = age


stu = Student("王大锤", 20)
# AttributeError: 'Student' object has no attribute 'sex'
stu.sex = "男"

```


### 静态方法和类方法

之前我们在类中定义的方法都是对象方法，换句话说这些方法都是对象可以接收的消息。除了对象方法之外，类中还可以有静态方法和类方法，这两类方法是发给类的消息，二者并没有实质性的区别。在面向对象的世界里，一切皆为对象，我们定义的每一个类其实也是一个对象，而静态方法和类方法就是发送给类对象的消息。

举一个例子，定义一个三角形类，通过传入三条边的长度来构造三角形，并提供计算周长和面积的方法。计算周长和面积肯定是三角形对象的方法，这一点毫无疑问。但是在创建三角形对象时，传入的三条边长未必能构造出三角形，为此我们可以先写一个方法来验证给定的三条边长是否可以构成三角形，这种方法很显然就不是对象方法，因为在调用这个方法时三角形对象还没有创建出来。我们可以把这类方法设计为静态方法或类方法，也就是说这类方法不是发送给三角形对象的消息，而是发送给三角形类的消息，代码如下所示。

```python 
class Triangle(object):
    """三角形"""

    def __init__(self, a, b, c):
        """初始化方法"""
        self.a = a
        self.b = b
        self.c = c

    @staticmethod
    def is_valid(a, b, c):
        """判断三条边长能否构成三角形(静态方法)"""
        return a + b > c and b + c > a and a + c > b

    # @classmethod
    # def is_valid(cls, a, b, c):
    #     """判断三条边长能否构成三角形(类方法)"""
    #     return a + b > c and b + c > a and a + c > b

    def perimeter(self):
        """计算周长"""
        return self.a + self.b + self.c

    def area(self):
        """计算面积"""
        p = self.perimeter() / 2
        return (p * (p - self.a) * (p - self.b) * (p - self.c)) ** 0.5

```


上面的代码使用`staticmethod`装饰器声明了`is_valid`方法是`Triangle`类的静态方法，如果要声明类方法，可以使用`classmethod`装饰器。可以直接使用`类名.方法名`的方式来调用静态方法和类方法，二者的区别在于，类方法的第一个参数是类对象本身，而静态方法则没有这个参数。

> 简单的总结一下，**对象方法、类方法、静态方法都可以通过“类名.方法名”的方式来调用，区别在于方法的第一个参数到底是普通对象还是类对象，还是没有接受消息的对象**。静态方法通常也可以直接写成一个独立的函数，因为它并没有跟特定的对象绑定。

我们可以给上面计算三角形周长和面积的方法添加一个`property`装饰器（Python 内置类型），这样三角形类的`perimeter`和`area`就变成了两个属性，不再通过调用方法的方式来访问，而是用对象访问属性的方式直接获得，修改后的代码如下所示。

```python 
class Triangle(object):
    """三角形"""

    def __init__(self, a, b, c):
        """初始化方法"""
        self.a = a
        self.b = b
        self.c = c

    @staticmethod
    def is_valid(a, b, c):
        """判断三条边长能否构成三角形(静态方法)"""
        return a + b > c and b + c > a and a + c > b

    @property
    def perimeter(self):
        """计算周长"""
        return self.a + self.b + self.c

    @property
    def area(self):
        """计算面积"""
        p = self.perimeter / 2
        return (p * (p - self.a) * (p - self.b) * (p - self.c)) ** 0.5


t = Triangle(3, 4, 5)
print(f"周长: {t.perimeter}")
print(f"面积: {t.area}")

```


### 继承和多态

面向对象的编程语言支持在已有类的基础上创建新类，从而减少重复代码的编写。提供继承信息的类叫做父类（超类、基类），得到继承信息的类叫做子类（派生类、衍生类）。例如，我们定义一个学生类和一个老师类，我们会发现他们有大量的重复代码，而这些重复代码都是老师和学生作为人的公共属性和行为，所以在这种情况下，我们应该先定义人类，再通过继承，从人类派生出老师类和学生类，代码如下所示。

```python 
class Person:
    """人"""

    def __init__(self, name, age):
        self.name = name
        self.age = age

    def eat(self):
        print(f"{self.name}正在吃饭.")

    def sleep(self):
        print(f"{self.name}正在睡觉.")


class Student(Person):
    """学生"""

    def __init__(self, name, age):
        super().__init__(name, age)

    def study(self, course_name):
        print(f"{self.name}正在学习{course_name}.")


class Teacher(Person):
    """老师"""

    def __init__(self, name, age, title):
        super().__init__(name, age)
        self.title = title

    def teach(self, course_name):
        print(f"{self.name}{self.title}正在讲授{course_name}.")


stu1 = Student("白元芳", 21)
stu2 = Student("狄仁杰", 22)
tea1 = Teacher("武则天", 35, "副教授")
stu1.eat()
stu2.sleep()
tea1.eat()
stu1.study("Python程序设计")
tea1.teach("Python程序设计")
stu2.study("数据科学导论")

```


**继承的语法是在定义类的时候，在类名后的圆括号中指定当前类的父类。** 如果定义一个类的时候没有指定它的父类是谁，那么默认的父类是`object`类。`object`类是 Python 中的顶级类，这也就意味着所有的类都是它的子类，要么直接继承它，要么间接继承它。**Python 语言允许多重继承，也就是说一个类可以有一个或多个父类。** 在子类的初始化方法中，我们可以通过`super().__init__()`来调用父类初始化方法，`super`函数是 Python 内置函数中专门为获取当前对象的父类对象而设计的。

子类除了可以通过继承得到父类提供的属性和方法外，还可以定义自己特有的属性和方法，所以子类比父类拥有的更多的能力。在实际开发中，我们经常会用子类对象去替换掉一个父类对象，这是面向对象编程中一个常见的行为，也叫做“里氏替换原则”（Liskov Substitution Principle）。

子类继承父类的方法后，还可以对方法进行重写（重新实现该方法），不同的子类可以对父类的同一个方法给出不同的实现版本，这样的方法在程序运行时就会表现出多态行为（调用相同的方法，做了不同的事情）。多态是面向对象编程中最精髓的部分。

## 面向对象编程应用

### 例子1：扑克游戏

与 C、Java 等语言不同的是，Python 中没有声明枚举类型的关键字，但是可以通过继承`enum`模块的`Enum`类来创建枚举类型，代码如下所示。

```python 
from enum import Enum


class Suite(Enum):
    """花色(枚举)"""

    SPADE, HEART, CLUB, DIAMOND = range(4)

```


通过上面的代码可以看出，定义枚举类型其实就是定义符号常量，如`SPADE`、`HEART`等。每个符号常量都有与之对应的值，这样表示黑桃就可以不用数字 0，而是用`Suite.SPADE`；注意，使用符号常量肯定是优于使用字面常量的，因为能够读懂英文就能理解符号常量的含义，代码的可读性会提升很多。Python 中的枚举类型是可迭代类型，简单的说就是可以将枚举类型放到`for-in`循环中，依次取出每一个符号常量及其对应的值，如下所示。

```python 
for suite in Suite:
    print(f"{suite}: {suite.value}")

```


定义牌类:

```python 
class Card:
    """牌"""

    def __init__(self, suite, face):
        self.suite = suite
        self.face = face

    def __repr__(self):
        suites = "♠♥♣♦"
        faces = ["", "A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"]
        return f"{suites[self.suite.value]}{faces[self.face]}"  # 返回牌的花色和点数

```


定义扑克类:

```python 
import random


class Poker:
    """扑克"""

    def __init__(self):
        self.cards = [
            Card(suite, face) for suite in Suite for face in range(1, 14)
        ]  # 52张牌构成的列表
        self.current = 0  # 记录发牌位置的属性

    def shuffle(self):
        """洗牌"""
        self.current = 0
        random.shuffle(self.cards)  # 通过random模块的shuffle函数实现随机乱序

    def deal(self):
        """发牌"""
        card = self.cards[self.current]
        self.current += 1
        return card

    @property
    def has_next(self):
        """还有没有牌可以发"""
        return self.current < len(self.cards)

```


定义玩家类:

```python 
class Player:
    """玩家"""

    def __init__(self, name):
        self.name = name
        self.cards = []  # 玩家手上的牌

    def get_one(self, card):
        """摸牌"""
        self.cards.append(card)

    def arrange(self):
        """整理手上的牌"""
        self.cards.sort()

```


### 例子2：工资结算系统

**要求**：某公司有三种类型的员工，分别是部门经理、程序员和销售员。需要设计一个工资结算系统，根据提供的员工信息来计算员工的月薪。其中，部门经理的月薪是固定 15000 元；程序员按工作时间（以小时为单位）支付月薪，每小时 200 元；销售员的月薪由 1800 元底薪加上销售额 5% 的提成两部分构成。

通过对上述需求的分析，可以看出部门经理、程序员、销售员都是员工，有相同的属性和行为，那么我们可以先设计一个名为`Employee`的父类，再通过继承的方式从这个父类派生出部门经理、程序员和销售员三个子类。很显然，后续的代码不会创建`Employee` 类的对象，因为我们需要的是具体的员工对象，所以这个类可以设计成专门用于继承的抽象类。Python 语言中没有定义抽象类的关键字，但是可以通过`abc`模块中名为`ABCMeta` 的元类来定义抽象类。

```python 
from abc import ABCMeta, abstractmethod


class Employee(metaclass=ABCMeta):
    """员工"""

    def __init__(self, name):
        self.name = name

    @abstractmethod
    def get_salary(self):
        """结算月薪"""
        pass

```


在上面的员工类中，有一个名为`get_salary`的方法用于结算月薪，但是由于还没有确定是哪一类员工，所以结算月薪虽然是员工的公共行为但这里却没有办法实现。对于暂时无法实现的方法，我们可以使用`abstractmethod`装饰器将其声明为抽象方法，所谓**抽象方法就是只有声明没有实现的方法**，**声明这个方法是为了让子类去重写这个方法**。

```python 
class Manager(Employee):
    """部门经理"""

    def get_salary(self):
        return 15000.0


class Programmer(Employee):
    """程序员"""

    def __init__(self, name, working_hour=0):
        super().__init__(name)
        self.working_hour = working_hour

    def get_salary(self):
        return 200 * self.working_hour


class Salesman(Employee):
    """销售员"""

    def __init__(self, name, sales=0):
        super().__init__(name)
        self.sales = sales

    def get_salary(self):
        return 1800 + self.sales * 0.05

```


上面的`Manager`、`Programmer`、`Salesman`三个类都继承自`Employee`，三个类都分别重写了`get_salary`方法。**重写就是子类对父类已有的方法重新做出实现**。相信大家已经注意到了，三个子类中的`get_salary`各不相同，所以这个方法在程序运行时会产生**多态行为**，多态简单的说就是**调用相同的方法**，**不同的子类对象做不同的事情**。

由于程序员和销售员需要分别录入本月的工作时间和销售额，所以在下面的代码中我们使用了 Python 内置的`isinstance`函数来判断员工对象的类型。我们之前讲过的`type`函数也能识别对象的类型，但是`isinstance`函数更加强大，因为它可以判断出一个对象是不是某个继承结构下的子类型，你可以简单的理解为`type`函数是对对象类型的精准匹配，而`isinstance`函数是对对象类型的模糊匹配。

```python 
emps = [
    Manager("刘备"),
    Programmer("诸葛亮"),
    Manager("曹操"),
    Programmer("荀彧"),
    Salesman("张辽"),
]
for emp in emps:
    if isinstance(emp, Programmer):
        emp.working_hour = int(input(f"请输入{emp.name}本月工作时间: "))
    elif isinstance(emp, Salesman):
        emp.sales = float(input(f"请输入{emp.name}本月销售额: "))
    print(f"{emp.name}本月工资为: ￥{emp.get_salary():.2f}元")

```


设计一个判断给定的大于1的正整数是不是质数的函数。质数是只能被1和自身整除的正整数（大于1），如果一个大于 1 的正整数&#x20;

N

是质数，那就意味着在 2 到&#x20;

N

−

1

之间都没有它的因子。

设计一个判断给定的大于1的正整数是不是质数的函数。质数是只能被1和自身整除的正整数（大于1），如果一个大于 1 的正整数&#x20;

N

是质数，那就意味着在 2 到&#x20;

N

−

1

之间都没有它的因子。

a = float(input('a = '))

b = float(input('b = '))

c = float(input('c = '))

if a + b > c and a + c > b and b + c > a:

perimeter = a + b + c

print(f'周长: {perimeter}')

s = perimeter / 2

area = (s \* (s - a) \* (s - b) \* (s - c)) \*\* 0.5

print(f'面积: {area}')

else:

print('不能构成三角形')
