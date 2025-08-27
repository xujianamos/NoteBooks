# Recoil

## 1.安装

```bash 
npm install recoil
#or
yarn add recoil
#or
bower install --save recoil

```


## 2.快速开始

### RecoilRoot

如需在组件中使用 Recoil，则可以将 `RecoilRoot` 放置在父组件的某个位置。将他设为根组件。

```typescript 
import React from 'react';
import { RecoilRoot,atom,selector,useRecoilState,useRecoilValue} from 'recoil';

function App() {
  return (
    <RecoilRoot>
      <CharacterCounter />
    </RecoilRoot>
  );
}
```


### Atom

一个 **atom** 代表一个**状态**。Atom 可在任意组件中进行读写。读取 atom 值的组件隐式订阅了该 atom，因此任何 atom 的更新都将致使使用对应 atom 的组件重新渲染。

```typescript 
const textState = atom({
  key: 'textState', // 唯一key
  default: '', // 默认值
});
```


在需要使用的组件中，引入并使用 `useRecoilState()`。

```javascript 
function CharacterCounter() {
  return (
    <div>
      <TextInput />
      <CharacterCount />
    </div>
  );
}

function TextInput() {
  const [text, setText] = useRecoilState(textState);

  const onChange = (event) => {
    setText(event.target.value);
  };

  return (
    <div>
      <input type="text" value={text} onChange={onChange} />
      <br />
      Echo: {text}
    </div>
  );
}
```


### Selector

**selector** 代表一个**派生状态**，派生状态是状态的**转换**。你可以将派生状态视为将状态传递给以某种方式修改给定状态的纯函数的输出。

```javascript 
const charCountState = selector({
  key: 'charCountState', // 唯一key
  get: ({ get }) => {
    const text = get(textState);

    return text.length;
  },
});
```


我们可以使用 `useRecoilValue()` 的 hook，来读取 `charCountState` 的值。

```javascript 
function CharacterCount() {
  const count = useRecoilValue(charCountState);

  return <>Character Count: {count}</>;
}
```


## 3.核心概念

### Atom

Atom 包含我们应用中状态的来源。在我们的 Todo List 中，来源将会是一个对象数组，每个对象代表一个 Todo Item。

我们将列表的 atom 称为 `todoListState`，并使用 `atom()` 函数创建它：

```javascript 
const todoListState = atom({
  key: 'todoListState',
  default: [],
});
```


我们为该 atom 设定一个唯一的 `key`，并将`默认值`设置为一个空数组。要读取该 atom 的内容，我们可以在 `TodoList` 组件中使用 `useRecoilValue()` hook：

```javascript 
function TodoList() {
  const todoList = useRecoilValue(todoListState);

  return (
    <>
      <TodoItemCreator />

      {todoList.map((todoItem) => (
        <TodoItem key={todoItem.id} item={todoItem} />
      ))}
    </>
  );
}
```


要创建新的 Todo Item，我们需要访问一个 setter 函数，该函数将更新 `todoListState` 的内容。我们可以使用 `useSetRecoilState()` hook 在 `TodoItemCreator` 组件中获取一个 setter 函数：

```javascript 
function TodoItemCreator() {
  const [inputValue, setInputValue] = useState('');
  const setTodoList = useSetRecoilState(todoListState);

  const addItem = () => {
    setTodoList((oldTodoList) => [
      ...oldTodoList,
      {
        id: getId(),
        text: inputValue,
        isComplete: false,
      },
    ]);
    setInputValue('');
  };

  const onChange = ({target: {value}}) => {
    setInputValue(value);
  };

  return (
    <div>
      <input type="text" value={inputValue} onChange={onChange} />
      <button onClick={addItem}>Add</button>
    </div>
  );
}

// 用于创建唯一 id 的工具函数
let id = 0;
function getId() {
  return id++;
}
```


> 注意：我们在 setter 函数中使用**更新器（updater）** 的形式，以便我们可以基于旧的 Todo List 创建新的 Todo List。

`TodoItem` 组件将显示 Todo Item 的值，同时允许你更改其文本和删除它。我们使用 `useRecoilState()` 读取 `todoListState` 并获取一个 setter 函数，该函数用于更新 Item 的文本，将其标记为完成并删除它：

```javascript 
function TodoItem({item}) {
  const [todoList, setTodoList] = useRecoilState(todoListState);
  const index = todoList.findIndex((listItem) => listItem === item);

  const editItemText = ({target: {value}}) => {
    const newList = replaceItemAtIndex(todoList, index, {
      ...item,
      text: value,
    });

    setTodoList(newList);
  };

  const toggleItemCompletion = () => {
    const newList = replaceItemAtIndex(todoList, index, {
      ...item,
      isComplete: !item.isComplete,
    });

    setTodoList(newList);
  };

  const deleteItem = () => {
    const newList = removeItemAtIndex(todoList, index);

    setTodoList(newList);
  };

  return (
    <div>
      <input type="text" value={item.text} onChange={editItemText} />
      <input
        type="checkbox"
        checked={item.isComplete}
        onChange={toggleItemCompletion}
      />
      <button onClick={deleteItem}>X</button>
    </div>
  );
}

function replaceItemAtIndex(arr, index, newValue) {
  return [...arr.slice(0, index), newValue, ...arr.slice(index + 1)];
}

function removeItemAtIndex(arr, index) {
  return [...arr.slice(0, index), ...arr.slice(index + 1)];
}
```


### Selector

**Selector** 代表一个**派生状态**，你可以将派生状态视为将状态传递给以某种方式修改给定状态的纯函数的输出。

派生状态（Derived state）是一个强大的概念，因为它使我们可以构建依赖于其他数据的动态数据。 在我们的 Todo List 应用程序的中，以下内容被视为派生数据：

- **过滤筛选后的 Todo List**：通过创建一个新列表，该新列表是从完整的 Todo List 中根据某些条件过滤筛选后派生而来（例如，筛选出已经完成的项目）。
- **Todo List 的信息统计**：通过计算列表的有用属性（例如列表中的项目总数，已完成项目的数量以及已完成项目的百分比）从完整的 Todo List 中派生出来。

要实现过滤的 Todo List，我们需要选择一组过滤条件，其值可以保存在一个 atom 中。 我们将使用的过滤器选项为：“显示全部（Show All）”，“显示完成（Show Completed）”和“显示未完成（Show Uncompleted）”。 默认值为“全部显示（Show All）”：

```javascript 
const todoListFilterState = atom({
  key: 'todoListFilterState',
  default: 'Show All',
});
```


使用 `todoListFilterState` 和 `todoListState`，我们可以构建一个 `filteredTodoListState` 的 selector，该 selector 派生一个过滤列表：

```javascript 
const filteredTodoListState = selector({
  key: 'filteredTodoListState',
  get: ({ get }) => {
    const filter = get(todoListFilterState);
    const list = get(todoListState);

    switch (filter) {
      case 'Show Completed':
        return list.filter((item) => item.isComplete);
      case 'Show Uncompleted':
        return list.filter((item) => !item.isComplete);
      default:
        return list;
    }
  },
});
```


`filteredTodoListState` 在内部跟踪两个依赖项：`todoListFilterState` 和 `todoListState`，以便在其中任何一个更改时重新运行。

> 从组件的角度来看，selector 可以使用与读取 atom 相同的 hook 来读取。不过务必注意，某些 hook 仅适用于**可写状态（writable state）**，例如 `useRecoilState()`。所有 atom 都是可写状态，但只有一些 selector 可被视为可写状态（同时具有 `get` 和 `set` 属性的 selector）。

要显示过滤后的 TodoList 只需要在 `TodoList` 组件中更改一行代码就能实现：

```javascript 
function TodoList() {
  const todoList = useRecoilValue(filteredTodoListState);

  return (
    <>
      <TodoListStats />
      <TodoListFilters />
      <TodoItemCreator />

      {todoList.map((todoItem) => (
        <TodoItem item={todoItem} key={todoItem.id} />
      ))}
    </>
  );
}
```


> 注意：UI 展示了每一项 todo，因为传给了 `todoListFilterState` 一个默认值，即“显示全部（Show All）”。 为了更改过滤器，我们需要创建 `TodoListFilters` 组件：

```javascript 
function TodoListFilters() {
  const [filter, setFilter] = useRecoilState(todoListFilterState);

  const updateFilter = ({target: {value}}) => {
    setFilter(value);
  };

  return (
    <>
      Filter:
      <select value={filter} onChange={updateFilter}>
        <option value="Show All">All</option>
        <option value="Show Completed">Completed</option>
        <option value="Show Uncompleted">Uncompleted</option>
      </select>
    </>
  );
}
```


我们要显示以下统计信息：

- Todo Item 总数
- 完成的项目总数
- 未完成的项目总数
- 已完成项目的百分比

尽管我们可以为每个统计信息创建一个 selector，但一种更简单的方法是创建一个 selector，该 selector 返回包含我们所需数据的对象。 我们将这个 selector 称为 `todoListStatsState`：

```typescript 
const todoListStatsState = selector({
  key: 'todoListStatsState',
  get: ({ get }) => {
    const todoList = get(todoListState);
    const totalNum = todoList.length;
    const totalCompletedNum = todoList.filter((item) => item.isComplete).length;
    const totalUncompletedNum = totalNum - totalCompletedNum;
    const percentCompleted = totalNum === 0 ? 0 : totalCompletedNum / totalNum * 100;

    return {
      totalNum,
      totalCompletedNum,
      totalUncompletedNum,
      percentCompleted,
    };
  },
});
```


为了读取 `todoListStatsState` 的值，我们再次使用 `useRecoilValue()`：

```javascript 
function TodoListStats() {
  const {
    totalNum,
    totalCompletedNum,
    totalUncompletedNum,
    percentCompleted,
  } = useRecoilValue(todoListStatsState);

  const formattedPercentCompleted = Math.round(percentCompleted);

  return (
    <ul>
      <li>Total items: {totalNum}</li>
      <li>Items completed: {totalCompletedNum}</li>
      <li>Items not completed: {totalUncompletedNum}</li>
      <li>Percent completed: {formattedPercentCompleted}</li>
    </ul>
  );
}
```


# 4.异步数据查询

Recoil 提供了一种通过数据流图将状态和派生状态映射到 React 组件方法。其真正强大的是，图中的函数也可以是异步的。这使得在同步 React 组件渲染器中使用异步函数变得更容易。Recoil 允许你在 selector 的数据流图中无缝混合同步和异步函数。不用返回值本身，只需从 selector `get` 回调中返回一个值的 Promise，接口仍然完全相同。因为这些只是 selector，其他 selector 也可以依据它们来进一步转换数据。

selector 可以被用作将异步数据纳入 Recoil 数据流图的一种方式。请记住，selector 是 “幂等” 函数：对于一组给定的输入，它们应该总是产生相同的结果 (至少在应用程序的生命周期内)。这一点很重要，因为 selector 的计算可能被缓存、重启或多次执行。正因为如此，selector 通常是模拟只读数据库查询的好方法。对于易变的数据，你可以使用 查询刷新，或者同步易变状态、持久化状态，或者对于其他的副作用，考虑实验性的 Atom Effects API。

### 同步示例

例如，这里有一个简单的用于获取一个用户名的同步 atom 和 selector。

```typescript 
const currentUserIDState = atom({
  key: 'CurrentUserID',
  default: 1,
});

const currentUserNameState = selector({
  key: 'CurrentUserName',
  get: ({get}) => {
    return tableOfUsers[get(currentUserIDState)].name;
  },
});

function CurrentUserInfo() {
  const userName = useRecoilValue(currentUserNameState);
  return <div>{userName}</div>;
}

function MyApp() {
  return (
    <RecoilRoot>
      <CurrentUserInfo />
    </RecoilRoot>
  );
}
```


### 异步示例

如果用户名被存储在某个我们需要查询的数据库中，我们需要做的就是返回一个 `Promise` 或者使用一个 `async` 函数。如果任何依赖关系发生变化，selector 都将重新计算并执行新的查询。结果会被缓存起来，所以查询将只对每个独特的输入执行一次。

```typescript 
const currentUserNameQuery = selector({
  key: 'CurrentUserName',
  get: async ({ get }) => {
    const response = await myDBQuery({
      userID: get(currentUserIDState),
    });
    return response.name;
  },
});

function CurrentUserInfo() {
  const userName = useRecoilValue(currentUserNameQuery);
  return <div>{userName}</div>;
}
```


selector 的接口总是相同的，所以使用这个 selector 的组件不需要关心它是用同步 atom 状态、派生 selector 状态或者异步查询来实现的！

但是，由于 React 的渲染函数是同步的，在 Promise 解决之前，它将渲染什么？Recoil 的设计配合 React Suspense 处理待定 (pending) 数据。如果用 Suspense 边界包裹你的组件，会捕捉到任何仍在 pending 中的后代，并渲染一个后备（fallback） UI。

```typescript 
function MyApp() {
  return (
    <RecoilRoot>
      <React.Suspense fallback={<div>加载中。。。</div>}>
        <CurrentUserInfo />
      </React.Suspense>
    </RecoilRoot>
  );
}
```


### 报错处理

但如果请求有错误怎么办？Recoil selector 也可以抛出错误，其错误来自一个组件试图使用该值时就会抛出的错误。这可以用 React `<ErrorBoundary>` 来捕捉。例如：

```typescript 
const currentUserNameQuery = selector({
  key: 'CurrentUserName',
  get: async ({get}) => {
    const response = await myDBQuery({
      userID: get(currentUserIDState),
    });
    if (response.error) {
      throw response.error;
    }
    return response.name;
  },
});

function CurrentUserInfo() {
  const userName = useRecoilValue(currentUserNameQuery);
  return <div>{userName}</div>;
}

function MyApp() {
  return (
    <RecoilRoot>
      <ErrorBoundary>
        <React.Suspense fallback={<div>加载中……</div>}>
          <CurrentUserInfo />
        </React.Suspense>
      </ErrorBoundary>
    </RecoilRoot>
  );
}
```


### 带参查询

有时你希望能够基于参数进行查询，而不仅仅是基于派生状态。例如，你可能想根据组件的 props 来查询。你可以使用 **`selectorFamily`** helper 来实现：

```typescript 
const userNameQuery = selectorFamily({
  key: 'UserName',
  get: userID => async () => {
    const response = await myDBQuery({userID});
    if (response.error) {
      throw response.error;
    }
    return response.name;
  },
});

function UserInfo({userID}) {
  const userName = useRecoilValue(userNameQuery(userID));
  return <div>{userName}</div>;
}

function MyApp() {
  return (
    <RecoilRoot>
      <ErrorBoundary>
        <React.Suspense fallback={<div>加载中……</div>}>
          <UserInfo userID={1}/>
          <UserInfo userID={2}/>
          <UserInfo userID={3}/>
        </React.Suspense>
      </ErrorBoundary>
    </RecoilRoot>
  );
}
```


### 数据流图

记住，通过为可做 selector 的查询建模，我们可以建立一个混合状态、派生状态和查询的数据流图！当状态被更新时，该图会自动更新并重新渲染 React 组件。

下面的例子将渲染当前用户的名字和他们的朋友列表。如果一个朋友的名字被点击，他们将成为当前用户，名字和列表将自动更新。

```typescript 
const currentUserIDState = atom({
  key: 'CurrentUserID',
  default: null,
});

const userInfoQuery = selectorFamily({
  key: 'UserInfoQuery',
  get: userID => async () => {
    const response = await myDBQuery({userID});
    if (response.error) {
      throw response.error;
    }
    return response;
  },
});

const currentUserInfoQuery = selector({
  key: 'CurrentUserInfoQuery',
  get: ({ get }) => get(userInfoQuery(get(currentUserIDState))),
});

const friendsInfoQuery = selector({
  key: 'FriendsInfoQuery',
  get: ({ get }) => {
    const {friendList} = get(currentUserInfoQuery);
    return friendList.map(friendID => get(userInfoQuery(friendID)));
  },
});

function CurrentUserInfo() {
  const currentUser = useRecoilValue(currentUserInfoQuery);
  const friends = useRecoilValue(friendsInfoQuery);
  const setCurrentUserID = useSetRecoilState(currentUserIDState);
  return (
    <div>
      <h1>{currentUser.name}</h1>
      <ul>
        {friends.map(friend =>
          <li key={friend.id} onClick={() => setCurrentUserID(friend.id)}>
            {friend.name}
          </li>
        )}
      </ul>
    </div>
  );
}

function MyApp() {
  return (
    <RecoilRoot>
      <ErrorBoundary>
        <React.Suspense fallback={<div>加载中……</div>}>
          <CurrentUserInfo />
        </React.Suspense>
      </ErrorBoundary>
    </RecoilRoot>
  );
}
```


### 并行请求

如果你注意到了上面的例子，`friendsInfoQuery` 使用一个查询来获得每个朋友的信息。但是，在一个循环中这样做的结果是它们基本上被序列化了。 如果查询的速度很快，这也许是可行的。 但如果它耗时巨大，你可以使用一个并发 helper，如 `waitForAll` 来并行执行它们。这个 helper 接受数组和指定的依赖对象。

```typescript 
const friendsInfoQuery = selector({
  key: 'FriendsInfoQuery',
  get: ({ get }) => {
    const { friendList } = get(currentUserInfoQuery);
    const friends = get(waitForAll(
      friendList.map(friendID => userInfoQuery(friendID))
    ));
    return friends;
  },
});
```


你可以使用带有部分数据的 `waitForNone` 来对用户界面进行增量更新。

```typescript 
const friendsInfoQuery = selector({
  key: 'FriendsInfoQuery',
  get: ({ get }) => {
    const { friendList } = get(currentUserInfoQuery);
    const friendLoadables = get(waitForNone(
      friendList.map(friendID => userInfoQuery(friendID))
    ));
    return friendLoadables
      .filter(({state}) => state === 'hasValue')
      .map(({contents}) => contents);
  },
});
```


### 预取

出于性能方面的考虑，你可能希望在渲染**之前**就开始获取数据。这样，在我们开始渲染的时候，查询就可以开始了。

让我们改变一下上面的例子，一旦用户点击改变用户的按钮，就启动对下一个用户信息的获取。

```javascript 
function CurrentUserInfo() {
  const currentUser = useRecoilValue(currentUserInfoQuery);
  const friends = useRecoilValue(friendsInfoQuery);

  const changeUser = useRecoilCallback(({snapshot, set}) => userID => {
    snapshot.getLoadable(userInfoQuery(userID)); // 预取用户信息
    set(currentUserIDState, userID); //  改变当前用户以开始新的渲染
  });

  return (
    <div>
      <h1>{currentUser.name}</h1>
      <ul>
        {friends.map(friend =>
          <li key={friend.id} onClick={() => changeUser(friend.id)}>
            {friend.name}
          </li>
        )}
      </ul>
    </div>
  );
}
```


### 查询默认 Atom 值

常见的模式是使用一个 atom 来代表本地可编辑的状态，但使用一个 selector 来查询默认值。

```typescript 
const currentUserIDState = atom({
  key: 'CurrentUserID',
  default: selector({
    key: 'CurrentUserID/Default',
    get: () => myFetchCurrentUserID(),
  }),
});
```


### 不带 React Suspense 的异步查询

没有必要使用 React Suspense 来处理未决的异步 selector。你也可以使用 `useRecoilValueLoadable()` 钩子来确定渲染期间的状态：

```javascript 
function UserInfo({userID}) {
  const userNameLoadable = useRecoilValueLoadable(userNameQuery(userID));
  switch (userNameLoadable.state) {
    case 'hasValue':
      return <div>{userNameLoadable.contents}</div>;
    case 'loading':
      return <div>加载中……</div>;
    case 'hasError':
      throw userNameLoadable.contents;
  }
}
```


### 查询刷新

当使用 selector 为数据查询建模时，重要的是要记住，selector 的计算总能为给定的状态提供一个一致的值。 selector 代表从其他 atom 和 selector 状态派生出来的状态。 因此，对于一个给定的输入，selector 的计算函数应该是幂等的，因为它可能被缓存或执行多次。 实际上，这意味着单一的选择器不应该被用于查询在应用程序的生命周期内会有变化的结果。

1. 使用请求ID

selector 的计算应该根据输入（依赖状态或族参数）为一个给定的状态提供一个一致的值。因此，你可以将请求 ID 作为族参数或依赖关系添加到你的查询中。 例如：

```javascript 
const userInfoQueryRequestIDState = atomFamily({
  key: 'UserInfoQueryRequestID',
  default: 0,
});

const userInfoQuery = selectorFamily({
  key: 'UserInfoQuery',
  get: userID => async ({ get }) => {
    get(userInfoQueryRequestIDState(userID)); // 添加请求ID作为依赖关系
    const response = await myDBQuery({userID});
    if (response.error) {
      throw response.error;
    }
    return response;
  },
});

function useRefreshUserInfo(userID) {
  const setUserInfoQueryRequestID = useSetRecoilState(userInfoQueryRequestIDState(userID));
  return () => {
    setUserInfoQueryRequestID(requestID => requestID + 1);
  };
}

function CurrentUserInfo() {
  const currentUserID = useRecoilValue(currentUserIDState);
  const currentUserInfo = useRecoilValue(userInfoQuery(currentUserID));
  const refreshUserInfo = useRefreshUserInfo(currentUserID);

  return (
    <div>
      <h1>{currentUser.name}</h1>
      <button onClick={refreshUserInfo}>刷新</button>
    </div>
  );
}
```


1. 使用 Atom

另一个选择是使用 Atom，而不是 Selector，来为查询结果建模。 你可以根据你的刷新策略，用新的查询结果强制性地更新 atom 状态。

```javascript 
const userInfoState = atomFamily({
  key: 'UserInfo',
  default: userID => fetch(userInfoURL(userID)),
});

// 刷新查询的 React 组件
function RefreshUserInfo({userID}) {
  const refreshUserInfo = useRecoilCallback(({set}) => async id => {
    const userInfo = await myDBQuery({userID});
    set(userInfoState(userID), userInfo);
  }, [userID]);

  // 每秒钟刷新一次用户信息
  useEffect(() => {
    const intervalID = setInterval(refreshUserInfo, 1000);
    return () => clearInterval(intervalID);
  }, [refreshUserInfo]);

  return null;
}
```


如果这是你想要的效果，但这种方法的一个缺点是，atom **目前**不支持接受 `Promise` 作为新值，以便在查询刷新时自动利用 React Suspense。 然而，如果需要的话，你可以存储一个对象，对加载状态和结果进行手动编码。

# 5.Atom Effects

Atom Effects 是一个新的实验性 API，用于管理副作用和初始化 Recoil atom。它们有很多有用的应用，比如状态持久化、状态同步、管理历史、日志等。它们被定义为 atom 定义的一部分，所以每个 atom 都可以指定和组成它们自己的策略。

# API

## RecoilRoot

提供了上下文，并且 atom 有值。此组件必须是所有使用 Recoil hook 的根组件。

### 属性

- `initializeState?`: `({set, setUnvalidatedAtomValues}) => void`。
  - 可选函数，可使用 [MutableSnapshot](https://recoiljs.org/zh-hans/docs/api-reference/core/Snapshot#Transforming_Snapshots "MutableSnapshot") 来[初始化](https://recoiljs.org/zh-hans/docs/api-reference/core/Snapshot#state-initialization "初始化") `<RecoilRoot>` 类型的 atom 状态。这为初始渲染设置了状态，并不打算用于后续的状态变化或异步的初始化。使用类似 [useSetRecoilState()](https://recoiljs.org/zh-hans/docs/api-reference/core/useSetRecoilState "useSetRecoilState()") 或 [useRecoilCallback()](https://recoiljs.org/zh-hans/docs/api-reference/core/useRecoilCallback "useRecoilCallback()") 的 hook 来同步状态的变化。
- `override?`: `boolean`
  - 默认为 `true`。此 prop 只有在 `<RecoilRoot>` 被嵌套在另一个 `<RecoilRoot>` 中时才有效。如果 `override` 为 `true`，这个根节点将创建一个新的 Recoil 作用域。如果为 `false`，这个 `<RecoilRoot>` 除了渲染它的子代外，将不会执行任何额外功能，因此，这个根的子代将访问最近的祖先节点 `<RecoilRoot>` 作用域中 Recoil 的值。

### 使用多个 `<RecoilRoot>`

多个 `<RecoilRoot>` 可以共存，代表 atom 状态的独立提供者/存储者；atom 在每个根中拥有不同的值。当你将一个根嵌入到另一个根中时，这一行为保持不变（内部根将覆盖外部根），除非你将 `override` 设为 `false`（详见 `Props`）。

注意，缓存可以跨根节点共享，如 selector 缓存。 Selector 的评估对于缓存或日志必须幂等，因此跨根结点缓存不应该是个问题，但是可能会被观测到或者引起重复查询。

```javascript 
import {RecoilRoot} from 'recoil';

function AppRoot() {
  return (
    <RecoilRoot>
      <ComponentThatUsesRecoil />
    </RecoilRoot>
  );
}
```


## 状态

### atom(options)

一个 *atom* 表示 Recoil 的 state。`atom()` 函数返回一个可写的 `RecoilState` 对象。

```typescript 
function atom<T>({
  key: string,
  default: T | Promise<T> | RecoilValue<T>,

  effects_UNSTABLE?: $ReadOnlyArray<AtomEffect<T>>,

  dangerouslyAllowMutability?: boolean,
}): RecoilState<T>
```


- `key` - 在内部用于标识 atom 的唯一字符串。在整个应用中，该字符串必须相对于其他 atom 和 selector 保持唯一。
- `default` - atom 的初始值，或一个 `Promise`，或另一个 atom，或一个用来表示相同类型的值的 selector。
- `dangerouslyAllowMutability` - 在某些情况下，我们可能希望允许存储在 atom 中的对象发生改变，而这些变化并不代表 status 的变更。使用这个选项可以覆盖开发模式下的 freezing 对象。

Recoil 管理 atom 的 state 变化，以便通知订阅该 atom 的组件何时重新渲染，所以你需使用下面列出的钩子函数来改变 atom 的 state。如果一个存储在 atom 中的对象被直接 mutated，它可能会绕过钩子，在没有正确触发订阅的情况下导致 state 的变化，为了帮助大家检测 bug，Recoil 会在开发模式下 freeze 存储在 atom 中的对象。

通常，你需要使用以下 hook 来与 atom 搭配使用。

- `useRecoilState()`：当你同时需要对 atom 进行读写时，使用此 hook。使用此 hook 会使组件订阅 atom。
- `useRecoilValue()`：当你仅需要读取 atom 时，使用此 hook。使用此 hook 会使组件订阅 atom。
- `useSetRecoilState()`：当你仅需要写入 atom 时，使用此 hook。
- `useResetRecoilState()`：需将 atom 重置为默认值时，使用此 hook。

在一些罕见的场景下，你需要在不订阅组件的情况下读取 atom 的值，请参考 `useRecoilCallback()`。

可以使用 `Promise` 或者表示相同类型值的 `RecoilValue`。因为 `Promise` 会是 pending 状态，而默认的 selector 也可能是异步的，因此 atom 的值也可以是 pending 状态，或者在读取值的时候抛出异常。注意设置 atom 时，你不能对 `Promise` 实时赋值。对于异步函数，请使用 selectors 。

Atom 不能用来直接存储 `Promise` 或 `RecoilValue`，但是可以用对象包装它们。注意 `Promise` 是可变的。Atoms 可以设置为纯函数，如果你这么做，你需要使用更新器组成 setter。（例如： `set(myAtom, () => myFunc);`）。

```javascript 
import {atom, useRecoilState} from 'recoil';

const counter = atom({
  key: 'myCounter',
  default: 0,
});

function Counter() {
  const [count, setCount] = useRecoilState(counter);
  const incrementByOne = () => setCount(count + 1);

  return (
    <div>
      Count: {count}
      <br />
      <button onClick={incrementByOne}>Increment</button>
    </div>
  );
}
```


`atomFamily()` 对于存储一系列的相关状态以及 划分你 atom 状态的作用域 来说，非常有用。

### selector(options)

在 Recoil 里，*selector* 代表一个函数，或 **派生状态**。你可以把它们看作是类似于一个没有副作用的 "幂等操作" 或 "纯函数"，对于一组给定的依赖值永远返回相同的值。如果只提供 `get` 方法，则 selector 便是只读的，并且会返回一个 `RecoilValueReadOnly` 对象。如果还提供了一个 `set` 方法，它的返回值将变为一个可写的 `RecoilState` 对象。

为了知道何时通知订阅该 selector 的组件重新渲染，Recoil 会自动管理 atom 以及 selector 的状态变化。如果一个 selector 的对象值被直接改变，它可能会绕过管理，以避免通知订阅它的组件。

```typescript 
type ValueOrUpdater<T> = T | DefaultValue | ((prevValue: T) => T | DefaultValue);
type GetCallback =
  <Args, Return>(
    fn: ({snapshot: Snapshot}) => (...Args) => Return,
  ) => (...Args) => Return;

type GetRecoilValue = <T>(RecoilValue<T>) => T;
type SetRecoilState = <T>(RecoilState<T>, ValueOrUpdater<T>) => void;
type ResetRecoilState = <T>(RecoilState<T>) => void;

function selector<T>({
  key: string,

  get: ({
    get: GetRecoilValue,
    getCallback: GetCallback,
  }) => T | Promise<T> | RecoilValue<T>,

  set?: (
    {
      get: GetRecoilValue,
      set: SetRecoilState,
      reset: ResetRecoilState,
    },
    newValue: T | DefaultValue,
  ) => void,

  dangerouslyAllowMutability?: boolean,
})
```


- `key` - 一个在内部用来标识 atom 的唯一字符串。在整个应用中，该字符串必须相对于其他 atom 和 selector 保持唯一。如果用于持久化，则他需要在整个执行过程中保持稳定性。
- `get` - 一个评估派生 state 值的函数。它可以直接返回一个值，也可以返回一个异步的 `Promise` 或另一个代表相同类型的 atom 或 selector。它被传递给一个对象作为第一个参数，并包含如下属性：
  - `get` - 一个用来从其他 atom 或 selector 获取值的函数。所有传入该函数的 atom 或 selector 将会隐式地被添加到此 selector 的一个 **依赖** 列表中。如果这个 selector 的任何一个依赖发生改变，这个 selector 就会重新计算值。
  - `getCallback()` - 用于创建 Recoil-aware 回调的函数。参见后续 [示例](https://recoiljs.org/zh-hans/docs/api-reference/core/selector#returning-objects-with-callbacks "示例")。
- `set?` - 如果设置了该属性，selector 就会返回一个 **可写** 的 state。这个函数需要传入一个回调函数的对象作为其第一个参数以及一个新值。新值可以是一个 `T` 类型的值，如果用户重置了 selector，也可以是一个 `DefaultValue` 类型的对象。该回调函数包含了：
  - `get()` - 一个用来从其他 atom 或 selector 获取值的函数。该函数不会为 selector 订阅给定的 atom 或 selector。
  - `set()` - 一个用来设置 Recoil 状态的函数。第一个参数是 Recoil 的 state，第二个参数是新的值。新值可以是一个更新函数，或一个 `DefaultValue` 类型的对象，用以传递更新操作。
- `dangerouslyAllowMutability` - 在某些情况下，我们可能希望允许存储在 atom 中的对象发生改变，而这些变化并不代表 status 的变更。使用这个选项可以覆盖开发模式下的 freezing 对象。

#### 动态依赖

只读 selector 有一个 `get` 方法，该方法会根据依赖关系计算 selector 的值。如果这些依赖项中的任何一个更新了，那么 selector 的值也将重新计算。求该 selector 的值时，其依赖关系是基于实际使用的 atoms 或 selectors 动态确定的。根据先前依赖项的值，你可以动态地使用不同的附加依赖项。Recoil 将自动更新当前的数据流图，因此 selector 只需订阅来自当前依赖关系集的更新。 在这个示例中，`mySelector` 将取决于 `toggleState` 的 atom 以及依赖于 `toggleState` 状态的 `selectorA` 或 `selectorB`。

```javascript 
const toggleState = atom({key: 'Toggle', default: false});

const mySelector = selector({
  key: 'MySelector',
  get: ({get}) => {
    const toggle = get(toggleState);
    if (toggle) {
      return get(selectorA);
    } else {
      return get(selectorB);
    }
  },
});
```


#### 可写的 Selectors

一个双向 (bi-directional) selector 接收传入值作为参数，并可以使用该参数沿数据流图向上游传递更改。因为用户既可以选择使用新值设置 selector，也可以选择重置 selector，所以传入的值要么是与 selector 表示的同类值，要么是表示重置操作的 `DefaultValue` 对象。

这个简单的 selector 实质上包装了一个 atom 来添加一个额外的字段。它仅仅只是将 set 和 reset 操作传递给了上游的 atom。

```typescript 
const proxySelector = selector({
  key: 'ProxySelector',
  get: ({get}) => ({...get(myAtom), extraField: 'hi'}),
  set: ({set}, newValue) => set(myAtom, newValue),
});
```


这个 selector 转换了数据，所以需要检查传入值是否是一个 `DefaultValue`。

```typescript 
const transformSelector = selector({
  key: 'TransformSelector',
  get: ({get}) => get(myAtom) * 100,
  set: ({set}, newValue) =>
    set(myAtom, newValue instanceof DefaultValue ? newValue : newValue / 100),
});
```


#### 异步 Selectors

Selectors 还可以具有异步求值函数，并将一个 `Promise` 作为返回值。

```typescript 
const myQuery = selector({
  key: 'MyQuery',
  get: async ({get}) => {
    return await myAsyncQuery(get(queryParamState));
  }
});
```


#### 示例 (同步)

```javascript 
import {atom, selector, useRecoilState, DefaultValue} from 'recoil';

const tempFahrenheit = atom({
  key: 'tempFahrenheit',
  default: 32,
});

const tempCelsius = selector({
  key: 'tempCelsius',
  get: ({get}) => ((get(tempFahrenheit) - 32) * 5) / 9,
  set: ({set}, newValue) =>
    set(
      tempFahrenheit,
      newValue instanceof DefaultValue ? newValue : (newValue * 9) / 5 + 32
    ),
});

function TempCelsius() {
  const [tempF, setTempF] = useRecoilState(tempFahrenheit);
  const [tempC, setTempC] = useRecoilState(tempCelsius);
  const resetTemp = useResetRecoilState(tempCelsius);

  const addTenCelsius = () => setTempC(tempC + 10);
  const addTenFahrenheit = () => setTempF(tempF + 10);
  const reset = () => resetTemp();

  return (
    <div>
      Temp (Celsius): {tempC}
      <br />
      Temp (Fahrenheit): {tempF}
      <br />
      <button onClick={addTenCelsius}>Add 10 Celsius</button>
      <br />
      <button onClick={addTenFahrenheit}>Add 10 Fahrenheit</button>
      <br />
      <button onClick={reset}>Reset</button>
    </div>
  );
}
```


#### 示例 (异步)

```typescript 
import {selector, useRecoilValue} from 'recoil';

const myQuery = selector({
  key: 'MyDBQuery',
  get: async () => {
    const response = await fetch(getMyRequestUrl());
    return response.json();
  },
});

function QueryResults() {
  const queryResults = useRecoilValue(myQuery);

  return (
    <div>
      {queryResults.foo}
    </div>
  );
}

function ResultsSection() {
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <QueryResults />
    </React.Suspense>
  );
}
```


#### 使用回调来返回对象

有时 selector 可以用来返回包含回调的对象。这些回调有助于访问 Recoil 的状态。例如查询 typeahead 或点击处理程序。下面示例中使用一个 selector 来生成菜单项，点击事件可以访问 Recoil 状态。当把这些对象传递给 React 组件上下文之外的框架或逻辑时，会很有益处。

此回调与使用 `useRecoilCallback()` 之间是一致的。请注意，由 `getCallback()` 返回的回调可以作为一个同步回调使用，用以访问 Recoil 状态，它不应该在评估 selector 本身时被调用。

```javascript 
const menuItemState = selectorFamily({
  key: 'MenuItem',
  get: itemID => ({get, getCallback}) => {
    const name = get(itemNameQuery(itemID));
    const onClick = getCallback(({snapshot}) => async () => {
      const info = await snapshot.getPromise(itemInfoQuery(itemID));
      displayInfoModal(info);
    });
    return {
      title: `Show info for ${name}`,
      onClick,
    };
  },
});
```


### useRecoilValueLoadable

`Loadable` 对象代表 Recoil [atom](https://recoiljs.org/zh-hans/docs/api-reference/core/atom "atom") 或 [selector](https://recoiljs.org/zh-hans/docs/api-reference/core/selector "selector") 的当前状态。此状态可能有一个可用值，也可能处于错误状态，或者是仍处于 pending 状态的异步解析。一个 `Loadable` 有如下接口：

- `state`：atom 或 selector 的当前状态。可能的值有 `'hasValue'`、`'hasError'` 或者 `'loading'`。
- `contents`：此 `Loadable`表示的值。如果 state 的值是 `hasValue`，其值为实际值；如果 state 的值是 `hasError`，其值为被抛出 `Error` 对象；如果 state 的值是 `loading`，那么你可以使用 `toPromise()` 得到一个 `Promise`。

Loadable 还包含用于访问当前状态的 helper 方法。**注意这些 API 并不稳定**：

- `getValue()` - 访问与 React Suspense 和 Recoil selectors 语义匹配的值的方法。如果 state 有值，那么它会返回该值；如果它为错误信息，那么它会抛出该错误；如果它仍然处于 pending 状态，那么它会暂停执行或者渲染以传递 pending 状态。
- `toPromise()`：返回值为 selector 执行完毕后执行的 `Promise`。如果此 selector 是同步执行的或者已经执行完毕，它会返回一个立即执行的 `Promise`。
- `valueMaybe()` - 如果有值则返回该值，否则返回 `undefined`。
- `valueOrThrow()` - 如果有值则返回该值，否则抛出错误。
- `map()` - 接受一个用以转换 Loadable 值的函数，并返回一个带有转换后值的新 Loadable。转换函数取得该值的参数并返回新值，它也可以抛出错误或者 suspense。

```javascript 
function UserInfo({userID}) {
  const userNameLoadable = useRecoilValueLoadable(userNameQuery(userID));
  switch (userNameLoadable.state) {
    case 'hasValue':
      return <div>{userNameLoadable.contents}</div>;
    case 'loading':
      return <div>Loading...</div>;
    case 'hasError':
      throw userNameLoadable.contents;
  }
}
```


### useRecoilState(state)

返回一个数组，第一个元素是 state 的值，第二个元素是一个 setter 函数，调用该函数时会更新为给定 state 的值。

使用此 hook 会使组件隐式地订阅给定的 state。

```typescript 
function useRecoilState<T>(state: RecoilState<T>): [T, SetterOrUpdater<T>];

type SetterOrUpdater<T> = (T | (T => T)) => void;
```


- `state`: 一个 [atom](https://recoiljs.org/zh-hans/docs/api-reference/core/atom "atom") 或一个 *可写* 的 [selector](https://recoiljs.org/zh-hans/docs/api-reference/core/selector "selector")。可写的 selector 在其定义的同时具有 `get` 和 `set` 函数，而只读 selector 只有一个 `get`。

当组件同时需要读写状态时，推荐使用该 hook。

在 React 组件中，使用本 hook 将会订阅该组件，并且在 state 更新时重新渲染该组件。该 hook 在 state 异常或者在异步解析时抛出异常。

```javascript 
import {atom, selector, useRecoilState} from 'recoil';

const tempFahrenheit = atom({
  key: 'tempFahrenheit',
  default: 32,
});

const tempCelsius = selector({
  key: 'tempCelsius',
  get: ({get}) => ((get(tempFahrenheit) - 32) * 5) / 9,
  set: ({set}, newValue) => set(tempFahrenheit, (newValue * 9) / 5 + 32),
});

function TempCelsius() {
  const [tempF, setTempF] = useRecoilState(tempFahrenheit);
  const [tempC, setTempC] = useRecoilState(tempCelsius);

  const addTenCelsius = () => setTempC(tempC + 10);
  const addTenFahrenheit = () => setTempF(tempF + 10);

  return (
    <div>
      Temp (Celsius): {tempC}
      <br />
      Temp (Fahrenheit): {tempF}
      <br />
      <button onClick={addTenCelsius}>Add 10 Celsius</button>
      <br />
      <button onClick={addTenFahrenheit}>Add 10 Fahrenheit</button>
    </div>
  );
}
```


### useRecoilValue(state)

使用此 hook 会使组件隐式地订阅给定的 state。

```typescript 
function useRecoilValue<T>(state: RecoilValue<T>): T;
```


- `state`：一个 `atom` 或 `selector`

当一个组件需要在不写入 state 的情况下读取 state 时，推荐使用该 hook，因为该 hook 可以同时在**只读 state** 和**可写 state** 中使用。Atom 是可写 state，而 selector 可以是只读，也可以是可写的。

在 React 组件中，使用本 hook 将会订阅该组件，并且在 state 更新时重新渲染该组件。该 hook 在 state 异常或者在异步解析时抛出异常。

```javascript 
import {atom, selector, useRecoilValue} from 'recoil';

const namesState = atom({
  key: 'namesState',
  default: ['', 'Ella', 'Chris', '', 'Paul'],
});

const filteredNamesState = selector({
  key: 'filteredNamesState',
  get: ({get}) => get(namesState).filter((str) => str !== ''),
});

function NameDisplay() {
  const names = useRecoilValue(namesState);
  const filteredNames = useRecoilValue(filteredNamesState);

  return (
    <>
      Original names: {names.join(',')}
      <br />
      Filtered names: {filteredNames.join(',')}
    </>
  );
}
```


### useSetRecoilState(state)

```typescript 
function useSetRecoilState<T>(state: RecoilState<T>): SetterOrUpdater<T>;

type SetterOrUpdater<T> = (T | (T => T)) => void;
```


- `state`：可写的 Recoil state （[atom](https://recoiljs.org/zh-hans/docs/api-reference/core/atom "atom") 或可写的 [selector](https://recoiljs.org/zh-hans/docs/api-reference/core/selector "selector")）

返回一个可以用来异步改变 state 的 setter 函数。可以传给此 setter 函数一个新的值，也可以传入一个更新函数，此函数接受上一次的值作为其参数。

当一个组件需要写入而不需要读取 state 时，推荐使用此 hook。如果组件使用了 `useRecoilState()` 来获取 setter 函数，那么同时它也会订阅更新，并在 atom 或 selector 更新时重新渲染。使用 `useSetRecoilState()` 允许组件在值发生改变时而不用给组件订阅重新渲染的情况下设置值。

```javascript 
import {atom, useSetRecoilState} from 'recoil';

const namesState = atom({
  key: 'namesState',
  default: ['Ella', 'Chris', 'Paul'],
});

function FormContent({setNamesState}) {
  const [name, setName] = useState('');
  
  return (
    <>
      <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
      <button onClick={() => setNamesState(names => [...names, name])}>Add Name</button>
    </>
)}

// This component will be rendered once when mounting
function Form() {
  const setNamesState = useSetRecoilState(namesState);
  
  return <FormContent setNamesState={setNamesState} />;
}
```


### useResetRecoilState(state)

返回一个函数，用来把给定 state 重置为其初始值。

使用 `useResetRecoilState()` 可将组件的 state 重置为默认值，无需订阅组件，并且每当 state 改变时会重新渲染该组件。

```typescript 
function useResetRecoilState<T>(state: RecoilState<T>): () => void;
```


state：一个可写的 Recoil state

```javascript 
import {todoListState} from "../atoms/todoListState";

const TodoResetButton = () => {
  const resetList = useResetRecoilState(todoListState);
  return <button onClick={resetList}>Reset</button>;
};
```


### useRecoilStateLoadable(state)

此钩子可用于读取异步 selector 的值。为获取到指定状态值，此钩子将隐含地订阅对应组件。

与 [useRecoilState()](https://recoiljs.org/zh-hans/docs/api-reference/core/useRecoilState "useRecoilState()") 不同，当读取异步 selector 时，这个钩子不会抛出一个 `Error` 或`Promise` (为了能与 [React Suspense](https://reactjs.org/docs/concurrent-mode-suspense.html "React Suspense") 共存)。相反，这个钩子会返回一个 [Loadable](https://recoiljs.org/zh-hans/docs/api-reference/core/Loadable "Loadable") 对象的值以及 setter 回调。

```typescript 
function useRecoilStateLoadable<T>(state: RecoilState<T>): [Loadable<T>, (T | (T => T)) => void]
```


- `state`: 一个可写的 `atom` 或 *可能* 有一些异步操作的 `selector`。返回的 loadable 的状态将取决于所提供的状态 selector 的状态。

返回一个 [Loadable](https://recoiljs.org/zh-hans/docs/api-reference/core/Loadable "Loadable") 的当前状态与接口：

- `state`: 表示 selector 的状态。可能的值是 `hasValue`、`hasError`、`loading`。
- `contents`: `Loadable` 所代表的值。如果状态是 `hasValue`，它就是实际的值；如果状态是 `hasError`，它就是被抛出的 `Error` 对象，如果状态是 `loading`，那么它就是 `Promise`。

```javascript 
function UserInfo({userID}) {
  const [userNameLoadable, setUserName] = useRecoilStateLoadable(userNameQuery(userID));
  switch (userNameLoadable.state) {
    case 'hasValue':
      return <div>{userNameLoadable.contents}</div>;
    case 'loading':
      return <div>Loading...</div>;
    case 'hasError':
      throw userNameLoadable.contents;
  }
}
```


### useGetRecoilValueInfo\_UNSTABLE()

此钩子函数允许组件 “窥视” atom 或者 selector 的当前状态、值和其他信息。这类似于 [Snapshot](https://recoiljs.org/zh-hans/docs/api-reference/core/docs/api-reference/core/Snapshot "Snapshot") 中的 [getInfo\_UNSTABLE()](https://recoiljs.org/zh-hans/docs/api-reference/core/Snapshot#debug-information "getInfo_UNSTABLE()") 方法。

```typescript 
function useGetRecoilValueInfo_UNSTABLE(): RecoilValue<T> => AtomInfo<T>;

interface AtomInfo<T> {
  loadable?: Loadable<T>;
  isActive: boolean;
  isSet: boolean;
  isModified: boolean; // TODO 是否报告已修改的 selectors
  type: 'atom' | 'selector' | undefined; // 初始化之前暂时设定为 undefined
  deps: Iterable<RecoilValue<T>>;
  subscribers: {
    nodes: Iterable<RecoilValue<T>>,
    components: Iterable<ComponentInfo>,
  };
}

interface ComponentInfo {
  name: string;
}
```


它提供了一个可以通过 `RecoilValue<T>` 传递的函数并且将会返回一个包含 atom/selector 当前信息的对象。它并不会导致任何 state 改变或者创建任何订阅。它主要用于调试或开发工具中。

调试信息正在改进中，但可能包括：

- `loadable` - 一个带有当前状态的 Loadable。与 `getLoadable()` 等方法不同，此方法根本不会改变快照 (snapshot)。它提供当前状态，并且将不会初始化新的 atoms/selectors，执行任何新的 selector 计算，或更新任何依赖项或订阅。
- `isSet` - 如果这是存储在快照状态中的带有显式值的 atom，则为 True。如果这是一个 selector 或使用默认的 atom 状态，则为 False。
- `isModified` - 如果这是自上次处理后修改过的 atom，则为 True。
- `type` - `atom` 或者 `selector`。
- `deps` - 该节点所依赖的 atoms 或者 selectors 上的迭代器。
- `subscribers` - 有关为此快照订阅此节点的信息。详细信息正在开发中。

```javascript 
function ButtonToShowCurrentSubscriptions() {
  const getRecoilValueInfo = useGetRecoilValueInfo_UNSTABLE();
  function onClick() {
    const {subscribers} = getRecoilValueInfo(myAtom);
    console.debug(
      'Current Subscriber Nodes:',
      Array.from(subscribers.nodes).map(({key})=>key),
    );
  }

  return <button onClick={onClick} >See Current Subscribers</button>;
}
```


### isRecoilValue(value)

如果 `value` 是一个 atom 或者 selector 则返回 `true`，反之，返回 `false`。

```typescript 
function isRecoilValue(value: mixed): boolean
```


```javascript 
import {atom, isRecoilValue} from 'recoil';

const counter = atom({
  key: 'myCounter',
  default: 0,
});

const strCounter = selector({
  key: 'myCounterStr',
  get: ({get}) => String(get(counter)),
});

isRecoilValue(counter); // true
isRecoilValue(strCounter); // true

isRecoilValue(5); // false
isRecoilValue({}); // false
```


# 工具

## atomFamily(options)

返回一个可写的 `RecoilState` [atom](https://recoiljs.org/zh-hans/docs/api-reference/core/atom "atom") 函数。

```typescript 
function atomFamily<T, Parameter>({
  key: string,

  default:
    | RecoilValue<T>
    | Promise<T>
    | T
    | (Parameter => T | RecoilValue<T> | Promise<T>),

  effects_UNSTABLE?:
    | $ReadOnlyArray<AtomEffect<T>>
    | (P => $ReadOnlyArray<AtomEffect<T>>),

  dangerouslyAllowMutability?: boolean,
}): Parameter => RecoilState<T>
```


- `key` —— 一个在内部用来标识 atom 的唯一字符串。在整个应用中，该字符串必须相对于其他 atom 和 selector 保持唯一。
- `default` —— atom 的初始值。它可以是一个直接的值，一个代表默认值的`RecoilValue` 或 `Promise`，或者一个获得默认值的函数。回调函数被传递给 `atomFamily` 函数被调用时使用的参数的副本。
- `effects_UNSTABLE` —— 一个可选的数组，或回调函数，用于根据 [Atom Effects](https://recoiljs.org/zh-hans/docs/guides/atom-effects "Atom Effects") 的族参数获取数组。
- `dangerouslyAllowMutability` —— Recoil 依赖 atom 状态的变化来知道何时通知使用原 atom 组件重新渲染。如果一个 atom 的值发生了变异，它可能会绕过这个，并导致状态发生变化，而不正确地通知订阅组件。为了防止这种情况，所有存储的值都被冻结。在某些情况下，我们可能希望使用这个选项来覆盖这一点。
