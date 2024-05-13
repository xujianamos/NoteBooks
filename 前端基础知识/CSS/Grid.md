`Grid` 布局即网格布局。是目前唯一一种 `CSS` 二维布局。

# 1.Grid 布局和 flex 布局

区别：**`flex` 布局是一维布局，`Grid` 布局是二维布局**。`flex` 布局一次只能处理一个维度上的元素布局，一行或者一列。`Grid` 布局是将容器划分成了“行”和“列”，产生了一个个的网格，我们可以将网格元素放在与这些行和列相关的位置上，从而达到我们布局的目的。

# 2.容器属性介绍

## 2.1display属性

我们通过在元素上声明 `display：grid` 或 `display：inline-grid` 来创建一个网格容器。声明 `display：grid` 则该容器是一个块级元素，设置成 `display: inline-grid` 则容器元素为行内元素。

> 1.块元素

```css
.wrapper {
  display: grid;
}
```

效果：

<img src="https://noteimagebuket.oss-cn-hangzhou.aliyuncs.com/typora/202405082341541.png" alt="image-20240508234143485" style="zoom:50%;" />

> 2.行内元素

```css
.wrapper-1 {
  display: inline-grid;
}
```

效果：

<img src="https://noteimagebuket.oss-cn-hangzhou.aliyuncs.com/typora/202405082341740.png" alt="image-20240508234124703" style="zoom:50%;" />

## 2.2行高和列宽属性

`grid-template-columns` 属性设置列宽，`grid-template-rows` 属性设置行高。

### 2.2.1固定的列宽和行高

```css
.wrapper {
  display: grid;
  /*  声明了三列，宽度分别为 200px 100px 200px */
  grid-template-columns: 200px 100px 200px;
  grid-gap: 5px;
  /*  声明了两行，行高分别为 50px 50px  */
  grid-template-rows: 50px 50px;
}
```

<img src="https://noteimagebuket.oss-cn-hangzhou.aliyuncs.com/typora/202405082345649.png" alt="image-20240508234512597" style="zoom:50%;" />

### 2.2.2repeat函数

使用repeat函数，可以简化重复的值。该函数接受两个参数，第一个参数是重复的次数，第二个参数是所要重复的值。

使用函数简化上面的写法：

```css
.wrapper-1 {
  display: grid;
  grid-template-columns: 200px 100px 200px;
  grid-gap: 5px;
  /*  2行，而且行高都为 50px  */
  grid-template-rows: repeat(2, 50px);
}
```

### 2.2.3**auto-fill** 关键字

auto-fill关键字,表示自动填充。让一行（或者一列）中尽可能的容纳更多的单元格。`grid-template-columns: repeat(auto-fill, 200px)` 表示列宽是 200 px，但列的数量是不固定的，只要浏览器能够容纳得下，就可以放置元素。

```css
.wrapper-2 {
  display: grid;
  grid-template-columns: repeat(auto-fill, 200px);
  grid-gap: 5px;
  grid-auto-rows: 50px;
}
```

### 2.2.4fr关键字

`Grid` 布局还引入了一个另外的长度单位来帮助我们创建灵活的网格轨道。`fr` 单位代表网格容器中可用空间的一等份。`grid-template-columns: 200px 1fr 2fr` 表示第一个列宽设置为 200px，后面剩余的宽度分为两部分，宽度分别为剩余宽度的 1/3 和 2/3。

```css
.wrapper-3 {
  display: grid;
  grid-template-columns: 200px 1fr 2fr;
  grid-gap: 5px;
  grid-auto-rows: 50px;
}
```

### 2.2.5minmax函数

我们有时候想给网格元素一个最小和最大的尺寸，`minmax()` 函数产生一个长度范围，表示长度就在这个范围之中都可以应用到网格项目中。它接受两个参数，分别为最小值和最大值。`grid-template-columns: 1fr 1fr minmax(300px, 2fr)` 的意思是，第三个列宽最少也是要 300px，但是最大不能大于第一第二列宽的两倍。

```css
.wrapper-4 {
  display: grid;
  grid-template-columns: 1fr 1fr minmax(300px, 2fr);
  grid-gap: 5px;
  grid-auto-rows: 50px;
}
```

### 2.2.6auto关键字

auto关键字表示由浏览器决定长度。通过 `auto` 关键字，我们可以轻易实现三列或者两列布局。`grid-template-columns: 100px auto 100px` 表示第一第三列为 100px，中间由浏览器决定长度。

```css
.wrapper-5 {
  display: grid;
  grid-template-columns: 100px auto 100px;
  grid-gap: 5px;
  grid-auto-rows: 50px;
}
```

## 2.3行间距和列间距

`grid-row-gap` 属性、`grid-column-gap` 属性分别设置行间距和列间距。` grid-gap` 属性是两者的简写形式。

`grid-row-gap: 10px` 表示行间距是 10px，`grid-column-gap: 20px` 表示列间距是 20px。`grid-gap: 10px 20px` 实现的效果是一样的。

常规写法：

```css
.wrapper-1 {
  display: grid;
  grid-template-columns: 200px 100px 100px;
  grid-auto-rows: 50px;
  grid-row-gap: 10px;
  grid-column-gap: 20px;
}
```

简写：

```css
.wrapper {
  display: grid;
  grid-template-columns: 200px 100px 100px;
  grid-gap: 10px 20px;
  grid-auto-rows: 50px;
}
```

## 2.4grid-template-areas

`grid-template-areas`：属性用于定义区域，一个区域由一个或者多个单元格组成，需要与网格元素的 `grid-area` 一起使用。

`grid-area`：属性指定项目放在哪一个区域。

```css
.wrapper {
  display: grid;
  grid-gap: 10px;
  grid-template-columns: 120px  120px  120px;
  grid-template-areas:
    ". header  header"
    "sidebar content content";
  background-color: #fff;
  color: #444;
}
```

上面代码表示划分出 6 个单元格，其中值得注意的是 `.` 符号代表空的单元格，也就是没有用到该单元格。

```css
.sidebar {
  grid-area: sidebar;
}

.content {
  grid-area: content;
}

.header {
  grid-area: header;
}
```

以上代码表示将类 `.sidebar` `.content` `.header`所在的元素放在上面 `grid-template-areas` 中定义的 `sidebar` `content` `header` 区域中。

<img src="https://noteimagebuket.oss-cn-hangzhou.aliyuncs.com/typora/202405092335069.png" alt="image-20240509233558589" style="zoom:50%;" />

## 2.5grid-auto-flow 属性

`grid-auto-flow` 属性控制着自动布局算法怎样运作，精确指定在网格中被自动布局的元素怎样排列。默认的放置顺序是"先行后列"，即先填满第一行，再开始放入第二行，即下图英文数字的顺序 `one`,`two`,`three`...。这个顺序由 `grid-auto-flow` 属性决定，默认值是 `row`。

```css
.wrapper {
  display: grid;
  grid-template-columns: 100px 200px 100px;
  grid-auto-flow: row;
  grid-gap: 5px;
  grid-auto-rows: 50px;
}
```

<img src="https://noteimagebuket.oss-cn-hangzhou.aliyuncs.com/typora/202405092337864.png" alt="image-20240509233753804" style="zoom:50%;" />

细心的同学可能发现了一个问题，就是第五个项目和第六个项目之间有个空白（如下图所示），这个是由于第六块的长度大于了空白处的长度，被挤到了下一行导致的。在实际应用中，我们可能想让下面长度合适的填满这个空白，这个时候可以设置 `grid-auto-flow: row dense`，表示尽可能填满表格。代码以及效果如下所示：

```css
.wrapper-2 {
  display: grid;
  grid-template-columns: 100px 200px 100px;
  grid-auto-flow: row dense;
  grid-gap: 5px;
  grid-auto-rows: 50px;
}
```

<img src="https://noteimagebuket.oss-cn-hangzhou.aliyuncs.com/typora/202405092338282.png" alt="image-20240509233859231" style="zoom:50%;" />

可以设置 `grid-auto-flow: column`，表示先列后行，代码以及效果如下图所示：

```css
.wrapper-1 {
  display: grid;
  grid-auto-columns: 100px;
  grid-auto-flow: column;
  grid-gap: 5px;
  grid-template-rows:  50px 50px;
}
```

<img src="https://noteimagebuket.oss-cn-hangzhou.aliyuncs.com/typora/202405092339369.png" alt="image-20240509233937315" style="zoom:50%;" />

## 2.6justify-items 属性、align-items 属性以及 place-items 属性

`justify-items` 属性设置单元格内容的水平位置（左中右），`align-items` 属性设置单元格的垂直位置（上中下）。

```css
.container {
  justify-items: start | end | center | stretch;
  align-items: start | end | center | stretch;
}
```

其代码实现以及效果如下：

```css
.wrapper, .wrapper-1, .wrapper-2, .wrapper-3 {
  display: grid;
  grid-template-columns: 100px 200px 100px;
  grid-gap: 5px;
  grid-auto-rows: 50px;
  justify-items: start;
}
.wrapper-1 {
  justify-items: end;
}
.wrapper-2 {
  justify-items: center;
}
.wrapper-3 {
  justify-items: stretch;
}
```

- start：对齐单元格的起始边缘

<img src="https://noteimagebuket.oss-cn-hangzhou.aliyuncs.com/typora/202405092341650.png" alt="image-20240509234130596" style="zoom:50%;" />

- end：对齐单元格的结束边缘

<img src="https://noteimagebuket.oss-cn-hangzhou.aliyuncs.com/typora/202405092341149.png" alt="image-20240509234154115" style="zoom:50%;" />



- center：单元格内部居中

<img src="https://noteimagebuket.oss-cn-hangzhou.aliyuncs.com/typora/202405092342109.png" alt="image-20240509234220045" style="zoom:50%;" />



- stretch：拉伸，占满单元格的整个宽度（默认值）

<img src="https://noteimagebuket.oss-cn-hangzhou.aliyuncs.com/typora/202405092342701.png" alt="image-20240509234244665" style="zoom:50%;" />

## 2.7justify-content 属性、align-content 属性以及 place-content 属性

`justify-content` 属性是整个内容区域在容器里面的水平位置（左中右），`align-content` 属性是整个内容区域的垂直位置（上中下）。它们都有如下的属性值。

```css
.container {
  justify-content: start | end | center | stretch | space-around | space-between | space-evenly;
  align-content: start | end | center | stretch | space-around | space-between | space-evenly;  
}
```

下面以 `justify-content` 属性为例进行讲解，`align-content` 属性同理，只是方向为垂直方向

- start - 对齐容器的起始边框
- end - 对齐容器的结束边框
- center - 容器内部居中

```css
.wrapper, .wrapper-1, .wrapper-2, .wrapper-3, .wrapper-4, .wrapper-5, .wrapper-6 {
  display: grid;
  grid-template-columns: 100px 200px 100px;
  grid-gap: 5px;
  grid-auto-rows: 50px;
  justify-content: start;
}
.wrapper-1 {
  justify-content: end;
}
.wrapper-2 {
  justify-content: center;
}
```

<img src="https://noteimagebuket.oss-cn-hangzhou.aliyuncs.com/typora/202405092343832.png" alt="image-20240509234356776" style="zoom:50%;" />

- space-around - 每个项目两侧的间隔相等。所以，项目之间的间隔比项目与容器边框的间隔大一倍
- space-between - 项目与项目的间隔相等，项目与容器边框之间没有间隔
- space-evenly - 项目与项目的间隔相等，项目与容器边框之间也是同样长度的间隔
- stretch - 项目大小没有指定时，拉伸占据整个网格容器

```css
.wrapper-3 {
  justify-content: space-around;
}
.wrapper-4 {
  justify-content: space-between;
}
.wrapper-5 {
  justify-content: space-evenly;
}
.wrapper-6 {
  justify-content: stretch;
}
```

![image-20240509234439168](https://noteimagebuket.oss-cn-hangzhou.aliyuncs.com/typora/202405092344247.png)

## 2.8grid-auto-columns 属性和 grid-auto-rows 属性

**隐式和显示网格**：显式网格包含了你在 `grid-template-columns` 和 `grid-template-rows` 属性中定义的行和列。如果你在网格定义之外又放了一些东西，或者因为内容的数量而需要的更多网格轨道的时候，网格将会在隐式网格中创建行和列

假如有多余的网格（也就是上面提到的隐式网格），那么它的行高和列宽可以根据 `grid-auto-columns` 属性和 `grid-auto-rows` 属性设置。它们的写法和` grid-template-columns` 和 `grid-template-rows` 完全相同。如果不指定这两个属性，浏览器完全根据单元格内容的大小，决定新增网格的列宽和行高

```css
.wrapper {
  display: grid;
  grid-template-columns: 200px 100px;
/*  只设置了两行，但实际的数量会超出两行，超出的行高会以 grid-auto-rows 算 */
  grid-template-rows: 100px 100px;
  grid-gap: 10px 20px;
  grid-auto-rows: 50px;
}
```

`grid-template-columns` 属性和 `grid-template-rows` 属性只是指定了两行两列，但实际有九个元素，就会产生隐式网格。通过 `grid-auto-rows` 可以指定隐式网格的行高为 50px

![image-20240509234557774](https://noteimagebuket.oss-cn-hangzhou.aliyuncs.com/typora/202405092345834.png)

# 3.项目属性介绍

## 3.1grid-column-start 属性、grid-column-end 属性、grid-row-start 属性以及grid-row-end 属性

可以指定网格项目所在的四个边框，分别定位在哪根网格线，从而指定项目的位置

- grid-column-start 属性：左边框所在的垂直网格线
- grid-column-end 属性：右边框所在的垂直网格线
- grid-row-start 属性：上边框所在的水平网格线
- grid-row-end 属性：下边框所在的水平网格线

```css
.wrapper {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 20px;
  grid-auto-rows: minmax(100px, auto);
}
.one {
  grid-column-start: 1;
  grid-column-end: 2;
  background: #19CAAD;
}
.two { 
  grid-column-start: 2;
  grid-column-end: 4;
  grid-row-start: 1;
  grid-row-end: 2;
  /*   如果有重叠，就使用 z-index */
  z-index: 1;
  background: #8CC7B5;
}
.three {
  grid-column-start: 3;
  grid-column-end: 4;
  grid-row-start: 1;
  grid-row-end: 4;
  background: #D1BA74;
}
.four {
  grid-column-start: 1;
  grid-column-end: 2;
  grid-row-start: 2;
  grid-row-end: 5;
  background: #BEE7E9;
}
.five {
  grid-column-start: 2;
  grid-column-end: 2;
  grid-row-start: 2;
  grid-row-end: 5;
  background: #E6CEAC;
}
.six {
  grid-column: 3;
  grid-row: 4;
  background: #ECAD9E;
}
```

上面代码中，类 `.two` 所在的网格项目，垂直网格线是从 2 到 4，水平网格线是从 1 到 2。其中它跟 `.three` （垂直网格线是从3 到 4，水平网格线是从 1 到 4） 是有冲突的。可以设置 `z-index` 去决定它们的层级关系

![image-20240509234707664](https://noteimagebuket.oss-cn-hangzhou.aliyuncs.com/typora/202405092347727.png)

## 3.2grid-area 属性

`grid-area` 属性指定项目放在哪一个区域.

## 3.3justify-self 属性、align-self 属性以及 place-self 属性

`justify-self` 属性设置单元格内容的水平位置（左中右），跟 `justify-items` 属性的用法完全一致，但只作用于单个项目

`align-self` 属性设置单元格内容的垂直位置（上中下），跟align-items属性的用法完全一致，也是只作用于单个项目

两者很相像，这里只拿 `justify-self` 属性演示，`align-self` 属性同理，只是作用于垂直方向

```css
.item {
  justify-self: start | end | center | stretch;
  align-self: start | end | center | stretch;
}

```



```css
.item {
  justify-self: start;
}
.item-1 {
  justify-self: end;
}
.item-2 {
  justify-self: center;
}
.item-3 {
  justify-self: stretch;
}

```

- start：对齐单元格的起始边缘

![image-20240509234828496](https://noteimagebuket.oss-cn-hangzhou.aliyuncs.com/typora/202405092348560.png)

- end：对齐单元格的结束边缘

![image-20240509234848181](https://noteimagebuket.oss-cn-hangzhou.aliyuncs.com/typora/202405092348227.png)

- center：单元格内部居中 

![image-20240509234911193](https://noteimagebuket.oss-cn-hangzhou.aliyuncs.com/typora/202405092349271.png)

- stretch：拉伸，占满单元格的整个宽度（默认值）

![image-20240509234933652](https://noteimagebuket.oss-cn-hangzhou.aliyuncs.com/typora/202405092349729.png)

# 4.Grid 实战——实现响应式布局