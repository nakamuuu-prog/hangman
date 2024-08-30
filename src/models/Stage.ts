import { type Question } from "../interfaces/Question";

export class Stage {
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
