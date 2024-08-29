// resolveJsonModuleオプションをtrueにするとJSONファイルを読み込めるようになる
// fsというモジュールを使って読み込むこともできるが、any型に推論されてしまうため注意が必要
import rawData from "./data/questions.test.json";
// ユーザーからの入力を非同期で受け付ける機能
import readlinePromises from "readline/promises";
// npm install chalk@4.1.2
// 文字のスタイリングを簡単に行うためのライブラリ
// console.log(chalk.green("正解！")); // 緑色で表示される
import chalk from "chalk";
// npm  install figlet@1.6.0
// 文字を大きくしてアスキーアート形式で出力する機能
import figlet from "figlet";

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

type Color = "red" | "green" | "yellow" | "white";

interface UserInterface {
  input(): Promise<string>;
  clear(): void;
  destroy(): void;
  outPut(message: string, color?: Color): void;
  outPutAnswer(message: string): void;
}

// 入出力処理のためのインターフェイスを提供するインスタンスを生成
// 入出力の方法をオブジェクトで渡す
const rl = readlinePromises.createInterface({
  // ユーザーの入力をどこから受け取るかを指定する
  // process.stdinは「標準入力」を表し、一般的にキーボードからの入力を受け取るために使用する
  input: process.stdin,
  // 出力をどこに送るかを指定する
  // process.stdoutは「標準出力」を表し、コンソールやターミナルに出力するために使用する
  output: process.stdout,
});

const CLI: UserInterface = {
  async input() {
    const input = await rl.question("文字または単語を推測してください： ");
    return input.replaceAll(" ", "").toLowerCase();
  },
  clear() {
    console.clear(); // コンソールに表示されている内容をすべて消去する
  },
  destroy() {
    rl.close(); // プロンプトの終了
  },

  outPut(message: string, color: Color = "white") {
    console.log(chalk[color](message), "¥n");
  },

  outPutAnswer(message: string) {
    console.log(figlet.textSync(message, { font: "Big" }), "¥n");
  },
};

// CLIテスト用関数
// async function testQuestion() {
//   CLI.clear();
//   const userInput = await CLI.input();
//   console.log(userInput);
//   CLI.destroy();
// }
// // 結果：
// // 文字または単語を推測してください： aiueo
// // aiueo
// testQuestion();
