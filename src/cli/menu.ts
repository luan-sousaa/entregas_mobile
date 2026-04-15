import * as readline from 'readline';

let rl: readline.Interface | null = null;

export function getRL(): readline.Interface {
  if (!rl) {
    rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
  }
  return rl;
}

export function closeRL(): void {
  rl?.close();
  rl = null;
}

export function ask(question: string): Promise<string> {
  return new Promise((resolve) => {
    getRL().question(question, (answer) => resolve(answer.trim()));
  });
}

export async function showMenu(title: string, options: string[]): Promise<number> {
  console.log(`\n=== ${title} ===`);
  options.forEach((opt, i) => console.log(`  ${i + 1}. ${opt}`));
  console.log(`  0. Voltar`);

  const input = await ask('\nEscolha uma opção: ');
  const choice = parseInt(input, 10);

  if (isNaN(choice) || choice < 0 || choice > options.length) {
    console.log('Opção inválida.');
    return -1;
  }
  return choice;
}

export function printDivider(): void {
  console.log('─'.repeat(50));
}
