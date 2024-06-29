/*
MIT License

Copyright (c) 2024 syxxzzr

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

export const GENERAL_STANDARD = [
    [0.15, 0.35, 0.35, 0.13, 0.02],
    [
        [100, 86],
        [85, 71],
        [70, 56],
        [55, 41],
        [40, 30]
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

        this.is_sorted = false;
    };

    /**
     * 为单个成绩赋分
     * @param {number} raw_score 待赋分的数据
     * @return {number} 赋分后的数据
     * @private
     */
    _scale_score(raw_score) {
        let rank = this.score_all.indexOf(raw_score);
        if (rank === -1)
            throw new RangeError("Raw score not included in the score data.");  // 原数据不在数据集中

        let percent_rank = (rank + 1) / this.score_all.length;  // 计算分数在所有分数中的百分位置

        let ratio = 1;
        for (let index = 0; index < this.standard[0].length; index++) {
            ratio -= this.standard[0][index];  // 查找分数所处的区间

            if (percent_rank > ratio) {
                let section = this.standard[1][index];
                return ((section[0] - section[1]) / this.standard[0][index]) * (percent_rank - ratio) + section[1];  // 进行分数映射
            }
        }

        /////
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

        if (!this.is_sorted) {  // 未排序则对分数进行排序
            if (this.score_all.length <= this.standard.length) {
                throw new RangeError("The dataset is too small to scale score.")  // 数据集过小,无法进行赋分操作
            }

            this.score_all.sort(function (a, b) {
                return a - b;
            });

            this.is_sorted = true;
        }

        let output = [];
        for (const raw_score of data) {
            output.push(this._scale_score(raw_score));  // 执行赋分操作
        }

        return is_number ? output[0] : output;
    };
}
