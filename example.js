import ScaleScore, {GENERAL_STANDARD} from "./ScoreScaler.js";

let scale_score = new ScaleScore(GENERAL_STANDARD);  // 创建赋分实例

scale_score.update(1);  // 添加原始分数数据
scale_score.update([...Array(99).keys()].map(i => i + 2));  // 添加原始分数数据 (2-100 均匀分布的99项数组)

// 执行赋分操作
console.log(`1 在 1-100 均匀分布的100项原始分数据集中赋分后成绩为:\n${scale_score.scale(1)}\n`);

// 执行赋分操作
console.log(`[ 2, 3, 4, 5 ] 在 1-100 均匀分布的100项原始分数据集中赋分后成绩为:\n[${scale_score.scale([2, 3, 4, 5])}]\n`);

// 输出所有原成绩赋分后的原成绩-赋分对照表
console.log(`1-100 均匀分布的100项原始分数集赋分后的原成绩-赋分对照表为:\n${JSON.stringify(scale_score.scale_all())}`);
