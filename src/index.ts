import { ufMenu }     from './cli/uf.cli.js';
import { cidadeMenu } from './cli/cidade.cli.js';
import { regiaoMenu } from './cli/regiao.cli.js';
import { showMenu, closeRL } from './cli/menu.js';
import { listRegioes } from './services/regiao.service.js';

async function main(): Promise<void> {
  console.log('\nBem-vindo — Gestão de UF / Cidade / Região');

  let running = true;

  while (running) {
    const choice = await showMenu('MENU PRINCIPAL', [
      'Gerenciar UF',
      'Gerenciar Cidade',
      'Gerenciar Região',
      'Listar tudo (UF - Cidade - Região)',
    ]);

    switch (choice) {
      case 0:
        running = false;
        break;
      case 1:
        await ufMenu();
        break;
      case 2:
        await cidadeMenu();
        break;
      case 3:
        await regiaoMenu();
        break;
      case 4: {
        const regioes = listRegioes();
        console.log('\n=== LISTAGEM RELACIONAL ===');
        if (regioes.length === 0) {
          console.log('Nenhum dado cadastrado.');
        } else {
          regioes.forEach((r) => console.log(r.label));
        }
        console.log('===========================');
        break;
      }
      default:
        break;
    }
  }

  console.log('\nAté logo!');
  closeRL();
  process.exit(0);
}

main().catch((err) => {
  console.error('Erro fatal:', err);
  closeRL();
  process.exit(1);
});
