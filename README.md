# 赋分助手

赋分助手是一个帮助完成适用于中国新高考地区的赋分操作的JavaScript库，它帮助开发者更加快捷地编写相关代码，从而免去了理解赋分公式及编写此部分代码的繁琐过程。

赋分助手不依赖任何第三方库，采用原生`JavaScript`语法实现，可实现即拆即用。

赋分助手遵循MIT开源许可分发，任何开发者可自由使用，修改，转播相关代码。

赋分助手仅为个人实验性小DEMO，为高中生初学者利用课余时间独立开发。作者将尽最大努力完善赋分助手，但迫于作者的能力及时间有限，并无法完全保证其在复杂环境下运行的稳定性和高效性，请在认真检查后考虑是否使用，同时也期待您的宝贵意见。

### 快速入门

快速入门仅供开发人员快速了解使用方法，详细用法文档请见`document.md`，同时程序提供`example.js`实例代码以便更好地理解。

##### 1. 引入

您可以使用

```javascript
import ScaleScore from "./ScoreScaler.js"
```

或 在`Node.js`开发环境下使用

```javascript
require("./ScoreScaler.js");
```

的方法引入赋分助手。同时，您可以使用

```javascript
import {GENERAL_STANDARD} from "./ScoreScaler.js";
```

方法引入程序内自带的，适用于中国绝大多数采用新高考的省区的通用赋分标准。

注意，当使用`require()`方法引入本程序时，通用赋分标准将与赋分助手一起被引入。

##### 2. 使用

在引入程序后，可使用

```javascript
let scale_score = new ScaleScore( standard );
```

实例化赋分助手。其中，需将`standard`替换为您自己的赋分标准，应为`Array`类型，本程序附带了一个通用赋分标准。

随后，可使用

```javascript
scale_score.update( data );
```

添加赋分的原始分参考数据集。其中`data`为要被添加的原始分数据集，应为`number`或`Array`类型。

最后，可使用

```javascript
scale_score.scale( data );
```

为成绩执行赋分操作，其中，`data`为将被执行赋分操作的原始分成绩数据，应为`number`或`Array`类型，而函数将返回赋分后的数据。在此之前，请确保您已经向参考数据集中添加了足够多的数据，并保证`data`中包含的数组完全包含于参考数据集中。