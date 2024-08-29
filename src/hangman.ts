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

class Stage {
  answer: string;
  leftAttempts: number = 5;
  question: Question;

  constructor(question: Question) {
    this.question = question;
    // new Array(question.word.length) 文字数の長さの空の配列を作る
    // .fill("_") 配列の要素を_で埋める
    // .join("") 配列の要素を空文字で連結する
    this.answer = new Array(question.word.length).fill("_").join("");
  }

  // 試行回数を1減少
  decrementAttempts(): number {
    return --this.leftAttempts;
  }

  updateAnswer(userInput: string = "") {
    if (!userInput) return;

    const regex = new RegExp(userInput, "g"); // 入力を正規表現のパターンとして使用
    const answerArray = this.answer.split(""); // 文字列を配列に変換

    let matches: RegExpExecArray | null;

    while ((matches = regex.exec(this.question.word))) {
      const foundIdx = matches.index;
      answerArray.splice(foundIdx, userInput.length, ...userInput);

      this.answer = answerArray.join("");
    }
  }

  // 入力が単語の長さを超えているか
  isTooLong(userInput: string): boolean {
    return userInput.length > this.question.word.length;
  }

  // 単語に解答者の入力が含まれるか
  isIncludes(userInput: string): boolean {
    return this.question.word.includes(userInput);
  }

  // 解答が単語の全ての文字と一致したか
  isCorrect(): boolean {
    return this.answer === this.question.word;
  }

  // 試行回数が0か
  isGameOver(): boolean {
    return this.leftAttempts === 0;
  }
}

class Message {
  ui: UserInterface;

  constructor(ui: UserInterface) {
    this.ui = ui;
  }

  askQuestion(stage: Stage): void {
    this.ui.outPut(`Hint: ${stage.question.hint}`, "yellow");
    // stage.answerが "_oi_" のとき
    // .replaceAll("", " ") で全ての位置にスペースを挿入(見やすくするため)
    // .trim() 先頭と末尾のスペースを削除
    this.ui.outPutAnswer(stage.answer.replaceAll("", " ").trim());
    this.ui.outPut(`（残りの試行回数: ${stage.leftAttempts}）`);
  }

  leftQuestions(quiz: Quiz) {
    this.ui.outPut(`残り${quiz.lefts() + 1}問`);
  }

  start() {
    this.ui.outPut("¥nGame Start!!");
  }

  enterSomething() {
    this.ui.outPut("何か文字を入力してください。", "red");
  }

  notInclude(input: string) {
    this.ui.outPut(`"${input}"は単語に含まれていません。`, "red");
  }

  notCorrect(input: string) {
    this.ui.outPut(`残念！ "${input}”は正解ではありません。`, "green");
  }

  hit(input: string) {
    this.ui.outPut(`"${input}" が Hit!`, "green");
  }

  correct(question: Question) {
    this.ui.outPut(`正解！ 単語は"${question.word}”でした。`, "green");
  }

  gaemover(question: Question) {
    this.ui.outPut(`正解は ${question.word}でした。`);
  }

  end() {
    this.ui.outPut("ゲーム終了です！お疲れ様でした！");
  }
}

const message = new Message(CLI);
