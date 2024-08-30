"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Quiz = void 0;
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
exports.Quiz = Quiz;
