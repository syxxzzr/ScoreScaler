export declare type Standard = { [key: number]: number };

export const GENERAL_STANDARD: Standard = {
  0: 100,
  0.15: 85,
  0.5: 70,
  0.85: 55,
  0.98: 40,
  1: 30,
};

/**
 * 提供一个类, 用于完成适用于中国新高考的赋分操作
 * @param {Standard} standard 赋分标准
 * @author syxxzzr
 */
export default class ScaleScore {
  private readonly standard_ratio: number[];
  private readonly standard_dst: number[];
  private readonly min_score_count: number;
  private standard_src: number[];
  private is_reprocessed: boolean;
  private is_sorted: boolean;
  score_all: number[];

  constructor(standard: Standard) {
    this.standard_ratio = Object.keys(standard)
      .map((key) => Number(key))
      .sort();

    if (
      this.standard_ratio.length < 2 ||
      this.standard_ratio[0] < 0 ||
      this.standard_ratio[-1] > 1
    ) {
      throw new Error("standard not suited");
    }

    this.standard_dst = this.standard_ratio.map(
      (key) => standard[key.toString()],
    );

    this.score_all = [];

    this.min_score_count = this.standard_ratio.length;

    this.is_reprocessed = false;
    this.is_sorted = false;
  }

  /**
   * 为单个成绩赋分
   * @param {number} raw_score 待赋分的数据
   * @return {number} 赋分后的数据
   * @private
   */
  private _scale_score(raw_score: number): number {
    if (this.score_all.length < this.min_score_count) {
      throw new RangeError("The dataset is too small to scale score."); // 数据集过小,无法进行赋分操作
    }

    // if (!this.score_all.includes(raw_score))
    //   throw new RangeError("Raw score not included in the score data."); // 原数据不在数据集中

    for (let i = 0; i < this.standard_ratio.length - 1; i++) {
      if (
        raw_score > this.standard_src[i] ||
        raw_score < this.standard_src[i + 1]
      )
        continue;
      return (
        ((raw_score - this.standard_src[i + 1]) /
          (this.standard_src[i] - this.standard_src[i + 1])) *
          (this.standard_dst[i] - this.standard_dst[i + 1]) +
        this.standard_dst[i + 1]
      ); // 进行分数映射
    }
  }

  /**
   * 为源数据集排序
   * @param {boolean} reprocess_score_section 是否在排序后自动重新计算不同分数段的分数区间 (默认重新计算)
   * @private
   */
  private _sort(reprocess_score_section: boolean = true) {
    if (this.is_sorted) return; // 已排序则不再重新排序

    this.score_all.sort((a, b) => b - a);
    this.is_sorted = true;
    this.is_reprocessed = false;

    // 重新计算不同分数段的分数区间
    if (reprocess_score_section) this._reprocess_score_section();
  }

  /**
   * 重新计算不同分数段的分数区间
   */
  private _reprocess_score_section() {
    if (!this.is_sorted) this._sort(false);

    if (this.is_reprocessed) return;

    this.standard_src = [];
    this.standard_ratio.forEach((ratio) =>
      this.standard_src.push(
        this.score_all[Math.floor(this.score_all.length * ratio)] ||
          this.score_all[this.score_all.length - 1],
      ),
    );

    this.is_reprocessed = true;
  }

  /**
   * 添加成绩数据(集)
   * @param {number|number[]} data 要添加的成绩数据(集)
   */
  public update(data: number | number[]) {
    if (typeof data === "number") this.score_all.push(data);
    else this.score_all = this.score_all.concat(data);

    this.is_sorted = false;
    this.is_reprocessed = false;
  }

  /**
   * 为数据赋分
   * @param {number|number[]} data 待赋分的数据(集)
   * @return 赋分后的数据(集)
   */
  public scale(data: number | number[]): typeof data {
    let is_number = false;

    if (typeof data === "number") {
      is_number = true;
      data = [data];
    }

    this._sort(); // 对原成绩排序

    const output: number[] = [];
    for (const raw_score of data) {
      output.push(this._scale_score(raw_score));
    }

    return is_number ? output[0] : output;
  }

  /**
   * 为所有原成绩赋分
   * @return {{ [key: number]: number }} 原成绩-赋分对照表
   */
  public scale_all(): { [key: number]: number } {
    const table = {}; // 原成绩-赋分对照表

    this._sort(); // 对原成绩排序

    const last_score = null;
    for (const score of this.score_all)
      if (score !== last_score)
        // 防止对相同分数进行多次的赋分运算
        table[score] = this._scale_score(score);

    return table;
  }
}
