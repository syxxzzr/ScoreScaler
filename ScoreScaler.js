export const GENERAL_STANDARD = [
    [0.15, 0.35, 0.35, 0.13, 0.02],
    [
        [86, 100],
        [71, 85],
        [56, 70],
        [41, 55],
        [30, 40]
    ]];  // 通用赋分标准(适用于中国绝大多数采用新高考的省区)

/**
 * 提供一个类, 用于完成适用于中国新高考的赋分操作
 * @param {Array} standard 赋分标准
 * @author syxxzzr
 */
export default class ScaleScore {
    constructor(standard) {
        if (standard[0].length !== standard[1].length ||
            standard[0].reduce((a, b) => {
                return a + b
            }, 0) !== 1 ||
            standard[1].reduce((a, b) => {
                return a + (b.length === 2)
            }, 0) !== standard[1].length)
            throw new Error("Standard not required.") // 赋分标准不符合要求

        this.standard = standard;
        this.score_all = [];
        this.score_section = [];

        this.min_score_count = 1 / Math.min(...this.standard[0]);

        this.is_reprocessed = false;
        this.is_sorted = false;
    };

    /**
     * 为单个成绩赋分
     * @param {number} raw_score 待赋分的数据
     * @return {number} 赋分后的数据
     * @private
     */
    _scale_score(raw_score) {
        if (this.score_all.length < this.min_score_count) {
            throw new RangeError("The dataset is too small to scale score.")  // 数据集过小,无法进行赋分操作
        }

        if (!this.score_all.includes(raw_score))
            throw new RangeError("Raw score not included in the score data.");  // 原数据不在数据集中

        for (let i = 0; i < this.score_section.length; i++) {
            let score_section = this.score_section[i];
            if (raw_score > score_section[1] || raw_score < score_section[0])
                continue;
            return ((raw_score - score_section[0]) / (score_section[1] - score_section[0]) *
                (this.standard[1][i][1] - this.standard[1][i][0])) + this.standard[1][i][0];  // 进行分数映射
        }
    }

    /**
     * 为源数据集排序
     * @param reprocess_score_section {boolean} 是否在排序后自动重新计算不同分数段的分数区间 (默认重新计算)
     * @private
     */
    _sort(reprocess_score_section = true) {
        if (this.is_sorted)
            return;  // 已排序则不再重新排序

        this.score_all.sort(function (a, b) {
            return a - b;
        });
        this.is_sorted = true;
        this.is_reprocessed = false;

        // 重新计算不同分数段的分数区间
        if (reprocess_score_section)
            this._reprocess_score_section();
    }

    /**
     * 重新计算不同分数段的分数区间
     * @private
     */
    _reprocess_score_section() {
        if (!this.is_sorted)
            this._sort();

        if (this.is_reprocessed)
            return;

        this.score_section = [];
        let ratio = 1;
        for (const ratio_delta of this.standard[0]) {
            let section_end = this.score_all[parseInt(this.score_all.length * ratio) - 1];
            ratio -= ratio_delta;
            let section_start = this.score_all[parseInt(this.score_all.length * ratio) - 1];
            this.score_section.push([section_start, section_end]);
        }
        this.is_reprocessed = true;
    }

    /**
     * 添加成绩数据(集)
     * @param {number|Array} data 要添加的成绩数据(集)
     */
    update(data) {
        if (typeof data === "number")
            this.score_all.push(data);

        else
            this.score_all = this.score_all.concat(data);

        this.is_sorted = false;
        this.is_reprocessed = false;
    };

    /**
     * 为数据赋分
     * @param {number|Array} data 待赋分的数据(集)
     * @return {number|Array} 赋分后的数据(集)
     */
    scale(data) {
        let is_number = false;

        if (typeof data === "number") {
            is_number = true;
            data = [data];  // 参数归一化
        }

        this._sort();  // 对原成绩排序

        let output = [];
        for (const raw_score of data) {
            output.push(this._scale_score(raw_score));  // 执行赋分操作
        }

        return is_number ? output[0] : output;
    };

    /**
     * 为所有原成绩赋分
     * @return {Object} 原成绩-赋分对照表
     */
    scale_all() {
        let table = {};  // 原成绩-赋分对照表

        this._sort();  // 对原成绩排序

        let last_score = null;
        for (const score of this.score_all)
            if (score !== last_score)  // 防止对相同分数进行多次的赋分运算
                table[score] = this._scale_score(score);

        return table;
    }
}
