# 最全的React拖拽排序组件库对比研究

基于react的拖拽功能，有这么几个比较流行的库：

1. react-dnd
2. react-beautiful-dnd
3. dnd-kit
4. react-sortable-hoc

### 1. React-dnd

（一）基本概念

- Backend：后端主要用来抹平浏览器差异，处理 DOM 事件，同时把 DOM 事件转换为 React DnD 内部的 redux action，你可以使用 HTML5 拖拽后端，也可以自定义 touch、mouse 事件模拟的后端实现
- Item：用一个数据对象来描述当前被拖拽的元素，例如{ cardId: 42 }
- Type：类似于 redux 里面的actions types 枚举常量，定义了应用程序里支持的拖拽类型
- Monitor： 拖放本质上是有状态的。要么正在进行拖动操作，要么不在。要么有当前类型和当前项目，要么没有，React DnD 通过 Monitor 来存储这些状态并且提供查询
- Connector：连接组件和 Backend ，可以让 Backend 获取到 DOM
- DragSource： 这是一个高阶组件，使用它包裹住你的组件使它变为拖拽源
- DropTarget：这是一个高阶组件，使用它包裹住你的组件使它变为放置源
- DragDropContext：包裹根组件，提供拖拽的上下文环境

demo：

```javascript 

```


### 2. react-beautiful-dnd

主要包含三个组件.

1. DragDropContext : 用于包装拖拽根组件，Draggable和Droppable都需要包裹在DragDropContext内
2. Draggable 用于包装你需要拖动的组件，使组件能够被拖拽（make it draggable）
3. Droppable 用于包装接收拖拽元素的组件，使组件能够放置（dropped on it）

demo:

### 3. dnd-kit

1、DndContext 用于包装拖拽根组件，Draggable和Droppable都需要包裹在DndContext 内
2、Droppable 用于包装接收拖拽元素的组件，使组件能够放置
3、Draggable 用于包装你需要拖动的组件，使组件能够被拖拽
4、Sensors 用于检测不同的输入方法，以启动拖动操作、响应移动以及结束或取消操作，内置传感器有：

指针
鼠标
触摸
键盘

5、Modifiers 可让您动态修改传感器检测到的运动坐标。它们可用于广泛的用例，例如：

将运动限制在单个轴上

限制可拖动节点容器的边界矩形的运动

限制可拖动节点的滚动容器边界矩形的运动

施加阻力或夹紧运动

### 4.react-sortable-hoc

**（一）、基本概念**

1、SortableContainer 拖拽排序的容器

2、SortableElement 拖拽排序的元素

## 5. 兼容antd的table

## 6.树兼容

**自带的tree拖拽缺点是**

1. 无法实现动态实时拖拽更换位置效果，必须拖拽结束后才发生位置变化
2. 需要修改大量的自带的样式

可以简单地把树看做是互相嵌套的列表。

## 7. 移动端兼容

## 8.总结对比

- [react-dnd](https://link.juejin.cn?target=github.com/react-dnd/react-dnd "react-dnd")
- 文档齐全
- github star星数16.4k
- 维护更新良好，最近一月内有更新维护
- 学习成本较高
- 功能中等
- 移动端兼容情况，良好
- 示例数量中等
- 概念较多，使用复杂
- 组件间能解耦
- [react-beautiful-dnd](https://link.juejin.cn?target=github.com/atlassian/react-beautiful-dnd "react-beautiful-dnd")
- 文档齐全
- github star星数24.8k
- 维护更新良好，最近三月内有更新维护
- 学习成本较高
- 使用易度中等
- 功能丰富
- 移动端兼容情况，优秀
- 示例数量丰富
- 是为垂直和水平列表专门构建的更高级别的抽象，没有提供 react-dnd 提供的广泛功能
- 外观漂亮，可访问性好，物理感知让人感觉更真实的在移动物体
- 开发理念上是拖拽，不支持copy/clone
- [dnd-kit](https://link.juejin.cn?target=github.com/clauderic/dnd-kit "dnd-kit")
- 文档齐全
- github star星数2.8k
- 维护更新良好，最近一月内有更新维护
- 学习成本中等
- 使用易度中等
- 功能中等
- 移动端兼容情况，中等
- 示例数量丰富
- 未看到copy/clone
- [react-sortable-hoc](https://link.juejin.cn?target=github.com/clauderic/react-sortable-hoc "react-sortable-hoc")
- 文档较少
- github star星数9.5k
- 维护更新良好，最近三月内有更新维护
- 学习成本较低
- 使用易度较低
- 功能简单
- 移动端兼容情况，中等
- 示例数量中等
- 不支持拖拽到另一个容器中
- 未看到copy/clone
- 主要集中于排序功能，其余拖拽功能不丰富

如果是要结合antd的table使用，最简单的组件是react-sortable-hoc，如果是无限滚动react-sortable-hoc示例虽然多，但是源码很少，可以考虑使用react-beautiful-dnd。如果是树形拖拽，要求不高的情况可以使用antd自带的tree，要求高点可以使用react-beautiful-dnd。兼容移动端，可以考虑使用react-sortable-hoc或者react-beautiful-dnd。

## 9.如何自己封装一个简单的拖拽组件
