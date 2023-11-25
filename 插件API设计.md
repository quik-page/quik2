# 插件API设计

[TOC]

# 搜索框 `quik.omnibox`

## 搜索框输入 `quik.omnibox.value(value: String)`

使用该方法写入搜索框内容

## 搜索联想 `quik.omnibox.addNewSug(details: Object)`

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


## 搜索框事件监听 `quik.omnibox.addEventListener(event:String,callback:Function(ev))`

| event事件 | 描述 | callback:ev内容 | 备注 |
|--|--|--|--|
| `focus` | 搜索框被选中 | 搜索框`HTMLElement` ||
| `input` | 搜索框内容改变 | 搜索框内容`String` | 事件发生时未触发搜索联想更新 |
| `blur` | 搜索框取消选中 | 搜索框`HTMLElement` | 会延迟一小段时间（≈6ms） |
| `beforeenter` | 回车前执行事件 | 搜索框内容`String` ||
| `afterenter` | 回车前执行事件 | 搜索框内容`String` ||

## 搜索引擎
- `quik.omnibox.getSearchType()` 获取搜索引擎URL
- `quik.omnibox.setSearchType(key)` 设置搜索引擎
- `quik.omnibox.setSearchList(list)` 设置搜索引擎列表
- `quik.omnibox.getSearchTypeList()` 获取搜索引擎列表
- `quik.omnibox.getSearchTypeIndex()` 获取搜索引擎KEY

## 搜索引擎事件监听 `quik.omnibox.search.addEventListener(event:String,callback:Function())` 

| event事件 | 描述 |  备注 |
|--|--|--|
| `typelistchange` | 搜索引擎列表改变 | 
| `nowtypechange` | 搜索引擎改变 | 


# 链接 `quik.links`

## 添加链接 `quik.links.addlink(details:Object)`

**`details`属性：**

| 属性 | 描述 | 内容 | 必要性 | 备注 |
|--|--|--|:--:|--|
| `cate` | 链接分类 | `String` | - | 该属性主要为链接分组时使用，不填为默认分组，须填已有分组 |
| `title` | 链接标题 | `String` | **required** |
| `url` | 链接URL | `String` | **required** |
| `index` | 链接位置 | `String` | - | 默认追加在末尾 |



## 修改链接 `quik.links.changeLink(cate:String|undefined,index:number,details:Object)`

- **`cate`：** 链接分类(该属性主要为链接分组时使用，不填为默认分组，须填已有分组)

- **`index`：** 链接位置

- **`details` 属性：**

| 属性 | 描述 | 内容 | 必要性 | 备注 |
|--|--|--|:--:|--|
| `cate` | 链接分类 | `String` | - |  |
| `title` | 链接标题 | `String` | **required** |
| `url` | 链接URL | `String` | **required** |
| `index` | 链接位置 | `String` | - | 默认为原来位置 |


## 删除链接  `quik.links.deleteLink(cate:String|undefined,index:number)`

- **`cate`：** 链接分类(该属性主要为链接分组时使用，不填为默认分组，须填已有分组)
- **`index`：** 链接位置

## 添加分组 `quik.links.addCate(catename:String)`
添加一个新的链接分组（不可重名）

## 重命名分组 `quik.links.renameCate(cate:String,newname:String)`

**该方法主要为链接分组时使用**

- **`cate`：** 链接分类(**必填**，须填已有分组)
- **`newname`：** 重命名(**必填**，不可重名)

## 删除分组 `quik.links.deleteCate(cate:String)=>Promise.then(userAgree:Boolean)`

**该方法主要为链接分组时使用**

**该方法会删除该分类下的所有链接，当该分类下的链接数量大于1时，需要用户同意**

**`cate`：** 链接分类(**必填**，须填已有分组)


# 一言 `quik.says`

## 添加一言类型 `quik.says.addSaysType(details)`

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

## 获取当前一言 `quik.says.getNowSay()=>Say`

# 窗口  `new quik.dialog(details)`

**`details` 属性：**

| 属性 | 描述 | 内容 | 必要性 | 备注 |
|--|--|--|:--:|--|
| `content` | 窗口内容 | `HTMLString` | **required** |  |
| `mobileShowtype` | 窗口在手机端的显示效果 | `quik.dialog.SHOW_TYPE_FULLSCREEN`或`quik.dialog.SHOW_TYPE_DIALOG` | - | `quik.dialog.SHOW_TYPE_FULLSCREEN`全屏显示，`quik.dialog.SHOW_TYPE_DIALOG`下方托出小窗口（类似夸克） |
| `class` | 窗口HTMLElement class名称 | `String` | - | 便于css控制样式 |

## `quik.dialog.prototype.open()`

打开窗口

## `quik.dialog.prototype.close()`

关闭窗口

## `quik.dialog.prototype.destory()`

销毁窗口，销毁后窗口消失，不允许打开或关闭

## `quik.dialog.prototype.getDialogDom()`

获取窗口Dom元素

# 特殊窗口

## `quik.dialog.iframeDialogBuilder(url:String,mobileShowtype)=>quik.dialog()`

创建一个网页框架窗口，返回`quik.dialog()`对象

## `quik.dialog.alert(content:String,icon?:number)=>Promise.then()`

显示一个警示窗口，返回Promise，当用户确认后回调

- **`content`：** 内容
- **`icon`：** 图标
  - **0 (default)** 提示 info 
  - **1** 询问 ask
  - **2** 完成 yes 
  - **3** 警告 warn  
  - **4** 错误 error  

## `quik.dialog.confirm(content:String,icon?:number)=>Promise.then(userAgree:Boolean)`

显示一个询问窗口，返回Promise，当用户确认或取消后回调

- **`content`：** 内容
- **`icon`：** 图标
  - **0 (default)** 提示 info 
  - **1** 询问 ask
  - **2** 完成 yes 
  - **3** 警告 warn  
  - **4** 错误 error  
  
## `quik.dialog.prompt(content:String,type?:number,required?:Boolean)=>Promise.then(userwrite:String)`

显示一个输入窗口，返回Promise，当用户输入确认后回调

- **`content`：** 提示内容
- **`type`：** 输入类型
  - **0 (default)** input (不可换行)
  - **1** textarea (可换行)
- **`required`：** 是否必填（默认false）


# 存储 `quik.storage(key:String)`

使用`quik.storage(key)`即可获得以key为标识的独立的存储分区
使用localStorage为内核

## 获取存储 quik.storage(key).get(skey,useidb?,callback?)

返回存储的内容

- **`skey`：** 键
- **`useidb`：** 是否存储在indexedDB内
- **`callback`：** 若存储在indexedDB内，这是获取的回调

## 写入存储 quik.storage(key).set(skey,content,useidb?,callback?)

写入存储

- **`skey`：** 键
- **`content`：** 内容
- **`useidb`：** 是否存储在indexedDB内
- **`callback`：** 若存储在indexedDB内，这是写入成功的回调

## 删除键 quik.storage(key).remove(skey,useidb?,callback?)

- **`skey`：** 键
- **`useidb`：** 是否存储在indexedDB内
- **`callback`：** 若存储在indexedDB内，这是删除成功的回调

## 对存储在indexedDB中的内容的注意事项

如果你普通的获取存在indexedDB中的内容，你会拿到一个存储标识，这是用来定位indexedDB内容的。

如果你普通的写入了原本存在indexedDB中的内容，你就会拿不到存在indexedDB中的内容了。

**不要普通的写入了原本存在indexedDB中的内容，因为写入indexedDB中的内容相对较大，这可能会导致localStorage爆满！！！**

# 设置 `quik.settings`

## 创建单独的设置实例窗口

使用`quik.settings.create(details)`创建单独的设置实例窗口

**`details`属性：**

| 属性 | 描述 | 内容 | 必要性 | 备注 |
|--|--|--|--|--|
| `title` | 设置实例窗口标题 | `String` | **required** |  |

返回一个设置实例 Setting

**一旦创建，不可删除**

## 为Setting添加设置分组

使用`Setting.addNewGroup(details)`添加设置分组

**`details`属性：**

| 属性 | 描述 | 内容 | 必要性 | 备注 |
|--|--|--|--|--|
| `title` | 设置分组标题 | `String` | **required** |  |
| `index` | 设置分组位置 | `Number`| - | 方便排序用，正数从前，负数从后|

返回一个设置分组实例 SettingGroup

**一旦创建，不可删除**

## 修改设置分组

使用`SettingGroup.setDetails(details)`修改设置分组

## 为SettingGroup添加设置项

使用`SettingGroup.addItem(details)`添加设置项

**`details`属性：**

| 属性 | 描述 | 内容 | 必要性 | 备注 |
|--|--|--|--|--|
| `title` | 设置项标题 | `String` | **required** |  |
| `index` | 设置项位置 | `Number`| - | 方便排序用，正数从前，负数从后|
| `message` | 设置项描述 | `String` | - ||
| `type` | 设置项类型 | 参见设置项类型 | **required** |
| `init` | 返回设置初始化内容 | `Function` | type=`range\|select` **required** | 为`range`和`select`准备，`range`返回\[min,max\]，`select`返回\[选项...\] |
| `check` | 检查用户输入内容 | `Function(content)` | - ||
| `callback` | 设置修改回调 | `Function(content)`| **required** ||

返回SettingItem实例

**一旦创建，不可删除**

## 设置项类型

- `string`：字符串
- `number`：数字
- `boolean`：开关
- `range`：拖动条
- `select`：选择
- `color`：颜色
- `null`：点击跳转

## 修改设置项内容

- `SettingItem.setTitle(title)` 设置项标题
- `SettingItem.setMessage(message)` 设置项描述
- `SettingItem.setIndex(index)` 设置项位置
- `SettingItem.hide()` 隐藏项
- `SettingItem.show()` 显示项

## 获取主设置

`quik.settings.main` 获取主设置实例
`quik.settings.mainGroups` 获取所有主设置组

# 背景 `quik.background`

## 改变背景 `quik.background.change(bgstr:String)`

**`bgstr`:**抽象背景字符串

## 托管背景 `quik.background.addAddonsBg(details)`

**`details`属性：**

| 属性 | 描述 | 内容 | 必要性 | 备注 |
|--|--|--|:--:|--|
| `title` | 标题 | `String` | **required** |
| `message` | 描述 | `HTMLString` | - |
| `addonsID` | 插件标识 | `String` | **required** | 用于等待插件加载 |
| `bgID` | 背景标识 | `String` | **required** | 用于区分不同背景 |
| `t-dark` | 是否开启t-dark模式 | `Boolean` | - | 如果背景是图片的话建议开启 |
| `main` | 主程序 | `Function(HTMLElement('.bg'))` | **required** | 传入背景Element |

之后该背景会显示在背景设置=>插件一栏

# 二级菜单 `new quik.contextMenu(details)`

**`details`属性：**

| 属性 | 描述 | 内容 | 必要性 | 备注 |
|--|--|--|:--:|--|
|`list`| 二级菜单项列表 | `ContextMenuItem[]` | **required** |
|`offset`| 二级菜单位置 | `{top?,left?,right?,bottom?}` | **required** | top,bottom任选其一,left,right任选其一 |

**`ContextMenuItem`属性：**

| 属性 | 描述 | 内容 | 必要性 | 备注 |
|--|--|--|:--:|--|
|`icon` |  图标  |`HTMLString`| **required** |
|`title`|  标题  |`String`|**required**|
|`click`|点击回调|`Function`|**required**|

## 控制二级菜单

- `quik.contextMenu.prototype.show()` 显示
- `quik.contextMenu.prototype.hide()` 隐藏
- `quik.contextMenu.prototype.isShow()=>Boolean` 是否显示
- `quik.contextMenu.prototype.destory()` 销毁(之后无法操作)
- `quik.contextMenu.prototype.setList(ContextMenuItem[])` 设置二级菜单项列表
- `quik.contextMenu.prototype.setOffset({top?,left?,right?,bottom?})` 设置二级菜单位置

# 通知 `new quik.notice(details)`

**`details`属性：**

| 属性 | 描述 | 内容 | 必要性 | 备注 |
|--|--|--|:--:|--|
| `title` | 标题|`String`|**required**|
|`content`| 内容|`String`|**required**|
|`useprogress`|是否使用进度条|`Boolean`|-|
|`btns`|按钮|`{text:String,click:Function}[]`|-|默认`确定`|

返回一个notice实例

## 控制通知

- **`quik.notice.prototype.show(time)`** 显示通知(显示时间,为空为负则永久)
- **`quik.notice.prototype.hide()`** 隐藏通知
- **`quik.notice.prototype.focus()`** 高亮通知(手机端)
- **`quik.notice.prototype.setTitle(title:String)`** 修改通知标题
- **`quik.notice.prototype.setContent(title:String)`** 修改通知内容
- **`quik.notice.prototype.setBtn({text:String,click:Function}[])`** 修改通知按钮
- **`quik.notice.prototype.setProgress(progress:number)`** 修改通知进度(useprogress=true)

# 卡片 `new quik.card(details)`

**`details` 属性：**

| 属性 | 描述 | 内容 | 必要性 | 备注 |
|--|--|--|:--:|--|
| `content` | 卡片内容 | `HTMLString` | **required** |  |
| `offset` | 卡片位置 | `{top?:,left?:,right?:,bottom?:}` | **required** |  |
| `class` | 卡片HTMLElement class名称 | `String` | - | 便于css控制样式 |

## `quik.dialog.prototype.show()`

显示卡片

## `quik.dialog.prototype.hide()`

隐藏卡片

## `quik.dialog.prototype.destory()`

销毁卡片，销毁后卡片消失，不允许操作

## `quik.dialog.prototype.getCardDom()`

获取卡片Dom元素

## `quik.dialog.prototype.getCardOffset()`

获取卡片位置

## `quik.dialog.prototype.setCardOffset({top?:,left?:,right?:,bottom?:},transition?:Boolean)`

改变卡片位置

`transition`: 为true时添加过渡效果

# 图标栏 `new quik.icon(details)`

**`details` 属性：**

| 属性 | 描述 | 内容 | 必要性 | 备注 |
|--|--|--|:--:|--|
| `content` | 图标内容 | `HTMLString` | **required** |  |
| `offset` | 图标位置 | `'tl'|'tr'|'bl'|'br'` | **required** |  |
| `width` | 图标宽度 | `'tl'|'tr'|'bl'|'br'` | - |  |
| `class` | 图标HTMLElement class名称 | `String` | - | 便于css控制样式 |

## `quik.icon.getIcon()`

获取icon HTMLElement

## `quik.icon.setIcon(content:HTMLString)`

设置icon内容

## `quik.icon.getWidth()`

获取icon宽度

## `quik.icon.setWidth(width:String)`

设置icon宽度

## `quik.icon.show()`

显示icon

## `quik.icon.hids()`

隐藏icon

# Toast `quik.toast.show(message:String,time?:number)`

显示一段提示信息

- `message`:提示信息
- `time`:显示时间 （ms）


# 主菜单 `quik.mainmenu`

## 添加项 

`quik.mainmenu.append(ContextMenuItem)=>MainMenuId`

## 删除项

`quik.mainmenu.remove(MainMenuId)`

# 插件 `quik.addons`

## 发起安装请求 

安装第三方插件：`quik.addons.askinstall(url:String)`
安装官方插件：`quik.addons.askinstall(id:number)`

## 发起卸载插件请求

`quik.addons.askuninstall(rid:String)`

# 主事件 `quik.addEventListener(event:String,cb:Function)`

- `load`:所有组件和启动项加载完毕

# 添加启动项 （高级）

启动项是起始页显示（加载完成）前的执行内容，你可以通过 `quik.registerStarter(rid:String)` 使插件成为启动项，在插件内部需要这样写：

```javascript
quik.addons.main(function(options){
  quik.registerStarter(options.rid);
  // ...
  if(options.next){
    options.next();
  }
});

```
