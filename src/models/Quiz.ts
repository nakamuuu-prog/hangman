import { type Question } from "../interfaces/Question";

export class Quiz {
  questions: Question[];
  constructor(questions: Question[]) {
    this.questions = questions;
  }

  // 次の質問が存在するか確認
  hasNext(): boolean {
    return this.questions.length > 0;
  }

  // ランダムに質問を取得して、その質問をリストから削除
  getNext(): Question {
    const idx = Math.floor(Math.random() * this.questions.length);
    // ランダムで取得したインデックスの問題を削除
    const [questions] = this.questions.splice(idx, 1);
    return questions;
  }

  // 残りの質問数を取得
  lefts(): number {
    return this.questions.length;
  }
}
