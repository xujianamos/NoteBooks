# ORM与ODM

ORM: 全名是 Object Relational Mapping（对象关系映射）是一种程序设计技术。简单说就是在操作数据库之前，先把数据表与实体类关联起来。然后通过实体类的对象操作（增删改查）数据库表。好处就是无需在代码中编写原生的SQL语句，直接通过操作实体对象的方式对数据库表进行CRUD，减少开发者对原生SQL的一个学习成本，对开发者来说更好的理解与上手，但是在可控性和性能上就没有直接操作原生SQL那么6了。

ODM:全名是 Object-Document Mapping 是一种程序设计技术。用于将对象模型与文档数据库之间进行映射。它将数据库中的文档（如JSON或XML）映射为对象，并提供类似于ORM的对象操作方法。

主要区别如下：

1. 数据库类型：ORM主要用于关系型数据库，如MySQL、PostgreSQL等，而ODM主要用于文档型数据库，如MongoDB等。
2. 数据模型：ORM使用表和行来表示数据模型，而ODM使用文档（或称为文档对象）来表示数据模型。
3. 查询语言：ORM使用结构化查询语言（SQL）来查询和操作数据库，而ODM使用对象查询语言（OQL）或类似于MongoDB的查询语法来查询和操作数据库。

总的来说，ORM适用于传统的关系型数据库，而ODM适用于非关系型的文档数据库。具体选择哪种技术取决于应用程序所使用的数据库类型。

# 操作流程

1. 建立数据库连接

2. 对实体对象CRUD操作

3. 关闭数据库连接

# Sequelize

Sequelize 是一个基于 promise 的 Node.js 的 ORM，目前支持 Mysql，Postgres，MariaDB，SQLite以及 Microsft SQL Server。它具有强大的事务支持，关联关系，预读和延迟加载，读取复制等功能。低版本不支持Ts

Sequelize 遵从语义版本控制。支持 Node v10 及更高版本以便使用 ES6 功能。

是Egg框架默认的数据库 ORM。

# TypeORM

TypeORM 是一个运行在 NodeJS、Browser、Cordova、PhoneGap、Ionic、React Native、Expo 和 Electron 平台上的一个 ORM 框架，可以与 TypeScript 和 JavaScript 一起使用。它的目标是始终支持最新的 JavaScript 特性并提供额外的特性以帮助你开发任何使用数据库的应用程序。

TypeORM 支持 Active Record （活动记录）和 Data Mapper（数据映射） 模式，这意味着你可以以最高效的方式编写高质量的、松耦合的、可扩展的、可维护的应用程序。

目前支持 MySQL、MariaDB、PostgreSQL、SQLite、Microsoft SQL Server、sql.js、Oracle、MongoDB (试验性)、NativeScript, react-native 和 Cordova。

复杂的 SQL 实现比较麻烦，TypeORM 提供了底层的 query builder 让你自己去构建更复杂的 SQL。

Typeorm 对 Serverless 场景的支持有待优化，在数据库重连接方面有些问题待解决。

对 TS 的高度支持、简洁、支持装饰器语法。是Midway框架默认的数据库ORM，同时也完美集成到了Nestjs框架。

# Prisma

Prisma 是一个开源的下一代 Node.js、TypeScript、Go 的数据库 ORM，目前支持 PostgreSQL、MySQL、MongoDB(实验性)、SQL Server(实验性) 和 SQLite 数据库。Prisma 客户端可以被用在 Node.js 或 TypeScript 后端应用中（包括 Serverless 应用和微服务）。可以是一个 REST API，一个 GraphQL API，一个 gRPC API，或任何其他需要数据库的东西。

Prisma 通过提供一个干净（clean）和类型安全（type-safe）的 API 来提交数据库查询，同时返回一个普通 JavaScript 对象（plain old JavaScript object），来使得开发者能够更容易地进行数据库查询。

提供VS Code编辑器扩展插件、语法高亮、智能自动补全。

Prisma 是 TypeScript 生态中唯一一个 彻底 的类型安全 ORM。

Prisma 的主要目的是使应用程序开发人员在与数据库打交道时能够更加高效。

Prisma 提倡开发人员应该只关心他们实现某项功能所需要的数据，而不是花时间去搞清楚复杂的 SQL 查询，在面对复杂的 SQL 查询时还支持暴露原生 SQL API。

# Mongoose

是一款比较流行的 MongoDB 数据库 Node ODM，它是对Node原生的MongoDB模块进行了进一步的优化封装。仅支持 MongoDB。

- 支持 Promise/async/await
- 基于 JS 内置类型的 Schema 声明
- 基于链式构造的 Query Builder 查询

# 总结

目前市面上大部分都是ORM的库，专门针对ODM的相对较少。其中TypeORM和Prisma也在支持MongoDB数据库了，但在可用性和稳定性上还需要检验。目前就只有Mongoose 库对MongoDB的支持比较完备，也比较稳定。











