type Color = "red" | "green" | "yellow" | "white";

interface UserInterface {
  input(): Promise<string>;
  clear(): void;
  destroy(): void;
  outPut(message: string, color?: Color): void;
  outPutAnswer(message: string): void;
}

export type { UserInterface, Color };
