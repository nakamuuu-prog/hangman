// resolveJsonModuleオプションをtrueにするとJSONファイルを読み込めるようになる
// fsというモジュールを使って読み込むこともできるが、any型に推論されてしまうため注意が必要
import rawData from "./data/questions.test.json";

interface Question {
  word: string;
  hint: string;
}

class Quiz {
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

const questions: Question[] = rawData;
const quiz = new Quiz(questions);
