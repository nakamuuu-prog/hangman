import { Quiz } from "./Quiz";
import { Message } from "./Message";
import { Stage } from "./Stage";
import { type UserInterface } from "../interfaces/UserInterface";
import { type GameState } from "../interfaces/GameState";

export class Game {
  quiz: Quiz;
  message: Message;
  stage: Stage;
  ui: UserInterface;

  constructor(quiz: Quiz, message: Message, ui: UserInterface) {
    this.quiz = quiz;
    this.message = message;
    this.ui = ui;
    this.stage = new Stage(this.quiz.getNext());
  }

  shouldEnd(): boolean {
    if (this.stage.isGameOver()) {
      return true;
    }

    if (!this.quiz.hasNext() && this.stage.isCorrect()) {
      return true;
    }

    return false;
  }

  next(isCorrect: boolean): GameState {
    if (!isCorrect) {
      this.stage.decrementAttempts();
    }

    if (this.shouldEnd()) {
      return { stage: this.stage, done: true }; // ゲーム終了のためにdoneをtrueにする
    }

    if (isCorrect) {
      this.stage = new Stage(this.quiz.getNext());
    }

    return { stage: this.stage, done: false }; // ゲームは終了しない
  }

  async start(): Promise<void> {
    this.ui.clear();
    this.message.start();

    let state: GameState = {
      stage: this.stage,
      done: false,
    };

    while (!state.done) {
      if (state.stage === undefined) break;

      const { stage } = state;

      this.message.leftQuestions(this.quiz);
      this.message.askQuestion(this.stage);

      const userInput = await this.ui.input();

      if (!userInput) {
        this.message.enterSomething();
        state = this.next(false);
        continue;
      }

      stage.updateAnswer(userInput);

      if (stage.isCorrect()) {
        this.message.correct(stage.question);
        state = this.next(true);
        continue;
      }

      if (stage.isTooLong(userInput)) {
        this.message.notCorrect(userInput);
        state = this.next(false);
        continue;
      }

      if (stage.isIncludes(userInput)) {
        this.message.hit(userInput);
        continue;
      }

      this.message.notInclude(userInput);
      state = this.next(false);
    }

    if (state.stage.isGameOver()) {
      this.message.gaemover(this.stage.question);
    }

    this.message.end;

    this.ui.destroy();
  }
}
