"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// resolveJsonModuleオプションをtrueにするとJSONファイルを読み込めるようになる
// fsというモジュールを使って読み込むこともできるが、any型に推論されてしまうため注意が必要
const questions_test_json_1 = __importDefault(require("./data/questions.test.json"));
// ユーザーからの入力を非同期で受け付ける機能
const promises_1 = __importDefault(require("readline/promises"));
// npm install chalk@4.1.2
// 文字のスタイリングを簡単に行うためのライブラリ
// console.log(chalk.green("正解！")); // 緑色で表示される
const chalk_1 = __importDefault(require("chalk"));
// npm  install figlet@1.6.0
// 文字を大きくしてアスキーアート形式で出力する機能
const figlet_1 = __importDefault(require("figlet"));
class Quiz {
    questions;
    constructor(questions) {
        this.questions = questions;
    }
    // 次の質問が存在するか確認
    hasNext() {
        return this.questions.length > 0;
    }
    // ランダムに質問を取得して、その質問をリストから削除
    getNext() {
        const idx = Math.floor(Math.random() * this.questions.length);
        // ランダムで取得したインデックスの問題を削除
        const [questions] = this.questions.splice(idx, 1);
        return questions;
    }
    // 残りの質問数を取得
    lefts() {
        return this.questions.length;
    }
}
const questions = questions_test_json_1.default;
const quiz = new Quiz(questions);
// 入出力処理のためのインターフェイスを提供するインスタンスを生成
// 入出力の方法をオブジェクトで渡す
const rl = promises_1.default.createInterface({
    // ユーザーの入力をどこから受け取るかを指定する
    // process.stdinは「標準入力」を表し、一般的にキーボードからの入力を受け取るために使用する
    input: process.stdin,
    // 出力をどこに送るかを指定する
    // process.stdoutは「標準出力」を表し、コンソールやターミナルに出力するために使用する
    output: process.stdout,
});
const CLI = {
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
    outPut(message, color = "white") {
        console.log(chalk_1.default[color](message), "¥n");
    },
    outPutAnswer(message) {
        console.log(figlet_1.default.textSync(message, { font: "Big" }), "¥n");
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
    answer;
    leftAttempts = 5;
    question;
    constructor(question) {
        this.question = question;
        // new Array(question.word.length) 文字数の長さの空の配列を作る
        // .fill("_") 配列の要素を_で埋める
        // .join("") 配列の要素を空文字で連結する
        this.answer = new Array(question.word.length).fill("_").join("");
    }
    // 試行回数を1減少
    decrementAttempts() {
        return --this.leftAttempts;
    }
    updateAnswer(userInput = "") {
        if (!userInput)
            return;
        const regex = new RegExp(userInput, "g"); // 入力を正規表現のパターンとして使用
        const answerArray = this.answer.split(""); // 文字列を配列に変換
        let matches;
        while ((matches = regex.exec(this.question.word))) {
            const foundIdx = matches.index;
            answerArray.splice(foundIdx, userInput.length, ...userInput);
            this.answer = answerArray.join("");
        }
    }
    // 入力が単語の長さを超えているか
    isTooLong(userInput) {
        return userInput.length > this.question.word.length;
    }
    // 単語に解答者の入力が含まれるか
    isIncludes(userInput) {
        return this.question.word.includes(userInput);
    }
    // 解答が単語の全ての文字と一致したか
    isCorrect() {
        return this.answer === this.question.word;
    }
    // 試行回数が0か
    isGameOver() {
        return this.leftAttempts === 0;
    }
}
