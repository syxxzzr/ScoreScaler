import ScaleScore, {GENERAL_STANDARD} from "./ScoreScaler.js";

let scale_score = new ScaleScore(GENERAL_STANDARD);  // 创建赋分实例

scale_score.update(1);  // 添加创建数据
scale_score.update([ 2, 3, 4, 5 ]);  // 添加创建数据

console.log(`1 在 [ 1, 2, 3, 4, 5 ] 中赋分后成绩为 ${scale_score.scale(1)}`);  // 执行赋分操作
console.log(`[ 2, 3, 4, 5 ] 在 [ 1, 2, 3, 4, 5 ] 中赋分后成绩为 [${scale_score.scale([2, 3, 4, 5])}]`);  // 执行赋分操作
