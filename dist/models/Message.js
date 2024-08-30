"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Message = void 0;
class Message {
    ui;
    constructor(ui) {
        this.ui = ui;
    }
    askQuestion(stage) {
        this.ui.outPut(`Hint: ${stage.question.hint}`, "yellow");
        // stage.answerが "_oi_" のとき
        // .replaceAll("", " ") で全ての位置にスペースを挿入(見やすくするため)
        // .trim() 先頭と末尾のスペースを削除
        this.ui.outPutAnswer(stage.answer.replaceAll("", " ").trim());
        this.ui.outPut(`（残りの試行回数: ${stage.leftAttempts}）`);
    }
    leftQuestions(quiz) {
        this.ui.outPut(`残り${quiz.lefts() + 1}問`);
    }
    start() {
        this.ui.outPut("\nGame Start!!");
    }
    enterSomething() {
        this.ui.outPut("何か文字を入力してください。", "red");
    }
    notInclude(input) {
        this.ui.outPut(`"${input}"は単語に含まれていません。`, "red");
    }
    notCorrect(input) {
        this.ui.outPut(`残念！ "${input}”は正解ではありません。`, "green");
    }
    hit(input) {
        this.ui.outPut(`"${input}" が Hit!`, "green");
    }
    correct(question) {
        this.ui.outPut(`正解！ 単語は"${question.word}”でした。`, "green");
    }
    gaemover(question) {
        this.ui.outPut(`正解は ${question.word}でした。`);
    }
    end() {
        this.ui.outPut("ゲーム終了です！お疲れ様でした！");
    }
}
exports.Message = Message;
