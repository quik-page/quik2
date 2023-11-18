# 插件API设计

[TOC]

## 搜索框 `quik.omnibox`

### 搜索框输入 `quik.omnibox.value(value: String)`

使用该方法写入搜索框内容

### 搜索联想 `quik.omnibox.addNewSug(details: Object)`

在特定情况下触发自定义搜索联想

**`details`属性：**

| 属性 | 描述 | 内容 | 必要性 | 备注 |
|--|--|--|--|--|
| `check` | 检查搜索框内容是否满足触发条件 | `Function(value:String)` `=>Boolean` | **required** | function内传参数value:搜索框内容 |
| `callback` | 对搜索联想的操作 | `Function(oldsuglist:Sug[])` `=>Promise.then(newsuglist:Sug[])` `\|newsuglist:Sug[]` | **required** | `Sug`格式见下方 |
| `interrupt` | 操作被打断时的回调（如取消请求进行省流） |`Function()`| - |  |

**`Sug`格式:**

| 属性 | 描述 | 内容 | 必要性 | 备注 |
|--|--|--|--|--|
| `icon` | 搜索联想左边的图标 | `HTMLString` | **required** ||
| `text` | 搜索联想内容 | `String` | **reuqired** ||
| `callback` | 点击或选中后的回调 | `Function(value:String)` | **required** | function内传参数value:搜索框内容 |


### 搜索框事件监听 `quik.omnibox.addEventListener(event:String,callback:Function(ev))`

| event事件 | 描述 | callback:ev内容 | 备注 |
|--|--|--|--|
| `focus` | 搜索框被选中 | 搜索框`HTMLElement` ||
| `input` | 搜索框内容改变 | 搜索框内容`String` | 事件发生时未触发搜索联想更新 |
| `blur` | 搜索框取消选中 | 搜索框`HTMLElement` | 会延迟一小段时间（≈6ms） |
| `beforeenter` | 回车前执行事件 | 搜索框内容`String` ||
| `afterenter` | 回车前执行事件 | 搜索框内容`String` ||

## 链接 `quik.links`

### 添加链接 `quik.links.addlink(details:Object)`

**`details`属性：**

| 属性 | 描述 | 内容 | 必要性 | 备注 |
|--|--|--|:--:|--|
| `cate` | 链接分类 | `String` | - | 该属性主要为链接分组时使用，不填为默认分组，须填已有分组 |
| `title` | 链接标题 | `String` | **required** |
| `url` | 链接URL | `String` | **required** |
| `index` | 链接位置 | `String` | - | 默认追加在末尾 |



### 修改链接 `quik.links.changeLink(cate:String|undefined,index:number,details:Object)`

- **`cate`：** 链接分类(该属性主要为链接分组时使用，不填为默认分组，须填已有分组)

- **`index`：** 链接位置

- **`details` 属性：**

| 属性 | 描述 | 内容 | 必要性 | 备注 |
|--|--|--|:--:|--|
| `cate` | 链接分类 | `String` | - |  |
| `title` | 链接标题 | `String` | **required** |
| `url` | 链接URL | `String` | **required** |
| `index` | 链接位置 | `String` | - | 默认为原来位置 |


### 删除链接  `quik.links.deleteLink(cate:String|undefined,index:number)`

- **`cate`：** 链接分类(该属性主要为链接分组时使用，不填为默认分组，须填已有分组)
- **`index`：** 链接位置

### 添加分组 `quik.links.addCate(catename:String)`
添加一个新的链接分组（不可重名）

### 重命名分组 `quik.links.renameCate(cate:String,newname:String)`

**该方法主要为链接分组时使用**

- **`cate`：** 链接分类(**必填**，须填已有分组)
- **`newname`：** 重命名(**必填**，不可重名)

### 删除分组 `quik.links.deleteCate(cate:String)=>Promise.then(userAgree:Boolean)`

**该方法主要为链接分组时使用**

**该方法会删除该分类下的所有链接，当该分类下的链接数量大于1时，需要用户同意**

**`cate`：** 链接分类(**必填**，须填已有分组)


## 一言 `quik.says`

### 添加一言类型 `quik.says.addSaysType(details)`

**`details` 属性：**

| 属性 | 描述 | 内容 | 必要性 | 备注 |
|--|--|--|:--:|--|
| `name` | 一言类型 | `String` | **required** |  |
| `key` | 一言类型标识 | `String` | **required** |
| `callback` | 一言获取方法 | `Function()=>Promise.then(Say)` | **required** |
| `menu` | 一言菜单 | `ContextMenu` | - | 默认只有复制 |

**`Say` 属性：**

| 属性 | 描述 | 内容 | 必要性 | 备注 |
|--|--|--|:--:|--|
|`say`| 一言内容 | `String` | **required** ||
|`title`| 一言详情 | `String` | - | 当鼠标放在一言上时title内容 |
|...|...|...|-| 其它内容随意添加，主要为一言详情准备 |

### 获取当前一言 `quik.says.getNowSay()=>Say`

## 窗口  `new quik.dialog(details)`

**`details` 属性：**

| 属性 | 描述 | 内容 | 必要性 | 备注 |
|--|--|--|:--:|--|
| `content` | 窗口内容 | `HTMLString` | **required** |  |
| `mobileShowtype` | 窗口在手机端的显示效果 | `quik.dialog.SHOW_TYPE_FULLSCREEN`或`quik.dialog.SHOW_TYPE_DIALOG` | - | `quik.dialog.SHOW_TYPE_FULLSCREEN`全屏显示，`quik.dialog.SHOW_TYPE_DIALOG`下方托出小窗口（类似夸克） |
| `class` | 窗口HTMLElement class名称 | `String` | - | 便于css控制样式 |

### `quik.dialog.prototype.open()`

打开窗口

### `quik.dialog.prototype.close()`

关闭窗口

### `quik.dialog.prototype.destory()`

销毁窗口，销毁后窗口消失，不允许打开或关闭

### `quik.dialog.prototype.getDialogDom()`

获取窗口Dom元素

## 特殊窗口

### `quik.dialog.iframeDialogBuilder(url:String,mobileShowtype)=>quik.dialog()`

创建一个网页框架窗口，返回`quik.dialog()`对象

### `quik.dialog.alert(content:String,icon?:number)=>Promise.then()`

显示一个警示窗口，返回Promise，当用户确认后回调

- **`content`：** 内容
- **`icon`：** 图标
  - **0 (default)** 提示 info 
  - **1** 询问 ask
  - **2** 完成 yes 
  - **3** 警告 warn  
  - **4** 错误 error  

### `quik.dialog.confirm(content:String,icon?:number)=>Promise.then(userAgree:Boolean)`

显示一个询问窗口，返回Promise，当用户确认或取消后回调

- **`content`：** 内容
- **`icon`：** 图标
  - **0 (default)** 提示 info 
  - **1** 询问 ask
  - **2** 完成 yes 
  - **3** 警告 warn  
  - **4** 错误 error  
  
### `quik.dialog.prompt(content:String,type?:number,required?:Boolean)=>Promise.then(userwrite:String)`

显示一个输入窗口，返回Promise，当用户输入确认后回调

- **`content`：** 提示内容
- **`type`：** 输入类型
  - **0 (default)** input (不可换行)
  - **1** textarea (可换行)
- **`required`：** 是否必填（默认false）


## 存储
