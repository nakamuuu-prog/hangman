"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// resolveJsonModuleオプションをtrueにするとJSONファイルを読み込めるようになる
// fsというモジュールを使って読み込むこともできるが、any型に推論されてしまうため注意が必要
const questions_test_json_1 = __importDefault(require("./data/questions.test.json"));
const Quiz_1 = require("./models/Quiz");
const Message_1 = require("./models/Message");
const Game_1 = require("./models/Game");
const CLI_1 = require("./utils/CLI");
const questions = questions_test_json_1.default;
const quiz = new Quiz_1.Quiz(questions);
const message = new Message_1.Message(CLI_1.CLI);
const game = new Game_1.Game(quiz, message, CLI_1.CLI);
game.start();
