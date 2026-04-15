import { ask, showMenu, printDivider } from './menu.js';
import { listUfs, createUf, updateUf, deleteUf } from '../services/uf.service.js';

export async function ufMenu(): Promise<void> {
  let running = true;

  while (running) {
    const choice = await showMenu('GERENCIAR UF', [
      'Listar UFs',
      'Criar UF',
      'Editar UF',
      'Deletar UF',
    ]);

    switch (choice) {
      case 0:
        running = false;
        break;

      case 1: {
        const ufs = listUfs();
        printDivider();
        if (ufs.length === 0) {
          console.log('Nenhuma UF cadastrada.');
        } else {
          ufs.forEach((u) => console.log(`[${u.sigla}] ${u.nome}  (id: ${u.id})`));
        }
        printDivider();
        break;
      }

      case 2: {
        const nome  = await ask('Nome da UF: ');
        const sigla = await ask('Sigla (ex: SP): ');
        if (!nome || !sigla) { console.log('Campos obrigatórios.'); break; }
        const created = createUf(nome, sigla);
        console.log(`UF criada: [${created.sigla}] ${created.nome}`);
        break;
      }

      case 3: {
        const ufs = listUfs();
        if (ufs.length === 0) { console.log('Nenhuma UF para editar.'); break; }
        ufs.forEach((u, i) => console.log(`  ${i + 1}. [${u.sigla}] ${u.nome}`));
        const idx = parseInt(await ask('Número da UF: '), 10) - 1;
        if (idx < 0 || idx >= ufs.length) { console.log('Número inválido.'); break; }
        const target = ufs[idx];
        const nome  = (await ask(`Novo nome [${target.nome}]: `)) || target.nome;
        const sigla = (await ask(`Nova sigla [${target.sigla}]: `)) || target.sigla;
        updateUf(target.id, nome, sigla);
        console.log('UF atualizada.');
        break;
      }

      case 4: {
        const ufs = listUfs();
        if (ufs.length === 0) { console.log('Nenhuma UF para deletar.'); break; }
        ufs.forEach((u, i) => console.log(`  ${i + 1}. [${u.sigla}] ${u.nome}`));
        const idx = parseInt(await ask('Número da UF a deletar: '), 10) - 1;
        if (idx < 0 || idx >= ufs.length) { console.log('Número inválido.'); break; }
        const target = ufs[idx];
        const confirm = await ask(`Confirmar exclusão de [${target.sigla}] ${target.nome}? (s/n): `);
        if (confirm.toLowerCase() === 's') {
          deleteUf(target.id);
          console.log('UF deletada (cidades e regiões removidas em cascata).');
        } else {
          console.log('Cancelado.');
        }
        break;
      }

      default:
        break;
    }
  }
}
