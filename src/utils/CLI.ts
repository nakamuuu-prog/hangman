import type { UserInterface, Color } from "../interfaces/UserInterface";
// ユーザーからの入力を非同期で受け付ける機能
import readlinePromises from "readline/promises";
// npm install chalk@4.1.2
// 文字のスタイリングを簡単に行うためのライブラリ
// console.log(chalk.green("正解！")); // 緑色で表示される
import chalk from "chalk";
// npm  install figlet@1.6.0
// 文字を大きくしてアスキーアート形式で出力する機能
import figlet from "figlet";

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

export const CLI: UserInterface = {
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
    console.log(chalk[color](message), "\n");
  },

  outPutAnswer(message: string) {
    console.log(figlet.textSync(message, { font: "Big" }), "\n");
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
