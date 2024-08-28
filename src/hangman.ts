// resolveJsonModuleオプションをtrueにするとJSONファイルを読み込めるようになる
// fsというモジュールを使って読み込むこともできるが、any型に推論されてしまうため注意が必要
import rawData from "./data/questions.test.json";

interface Question {
  word: string;
  hint: string;
}

const questions: Question[] = rawData;
