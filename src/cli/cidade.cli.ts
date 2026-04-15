import { ask, showMenu, printDivider } from './menu.js';
import { listCidades, createCidade, updateCidade, deleteCidade } from '../services/cidade.service.js';
import { listUfs } from '../services/uf.service.js';

export async function cidadeMenu(): Promise<void> {
  let running = true;

  while (running) {
    const choice = await showMenu('GERENCIAR CIDADE', [
      'Listar Cidades',
      'Criar Cidade',
      'Editar Cidade',
      'Deletar Cidade',
    ]);

    switch (choice) {
      case 0:
        running = false;
        break;

      case 1: {
        const cidades = listCidades();
        printDivider();
        if (cidades.length === 0) {
          console.log('Nenhuma cidade cadastrada.');
        } else {
          cidades.forEach((c) => console.log(`[${c.uf_sigla}] ${c.nome}  (id: ${c.id})`));
        }
        printDivider();
        break;
      }

      case 2: {
        const ufs = listUfs();
        if (ufs.length === 0) { console.log('Cadastre uma UF primeiro.'); break; }
        ufs.forEach((u, i) => console.log(`  ${i + 1}. [${u.sigla}] ${u.nome}`));
        const ufIdx = parseInt(await ask('Número da UF: '), 10) - 1;
        if (ufIdx < 0 || ufIdx >= ufs.length) { console.log('Número inválido.'); break; }
        const nome = await ask('Nome da cidade: ');
        if (!nome) { console.log('Nome obrigatório.'); break; }
        createCidade(nome, ufs[ufIdx].id);
        console.log(`Cidade criada: [${ufs[ufIdx].sigla}] ${nome}`);
        break;
      }

      case 3: {
        const cidades = listCidades();
        if (cidades.length === 0) { console.log('Nenhuma cidade para editar.'); break; }
        cidades.forEach((c, i) => console.log(`  ${i + 1}. [${c.uf_sigla}] ${c.nome}`));
        const idx = parseInt(await ask('Número da cidade: '), 10) - 1;
        if (idx < 0 || idx >= cidades.length) { console.log('Número inválido.'); break; }
        const target = cidades[idx];

        const nome = (await ask(`Novo nome [${target.nome}]: `)) || target.nome;

        const ufs = listUfs();
        ufs.forEach((u, i) => console.log(`  ${i + 1}. [${u.sigla}] ${u.nome}`));
        const ufInput = await ask(`Nova UF (número) ou Enter para manter [${target.uf_sigla}]: `);
        let uf_id = target.uf_id;
        if (ufInput) {
          const ufIdx = parseInt(ufInput, 10) - 1;
          if (ufIdx >= 0 && ufIdx < ufs.length) uf_id = ufs[ufIdx].id;
        }
        updateCidade(target.id, nome, uf_id);
        console.log('Cidade atualizada.');
        break;
      }

      case 4: {
        const cidades = listCidades();
        if (cidades.length === 0) { console.log('Nenhuma cidade para deletar.'); break; }
        cidades.forEach((c, i) => console.log(`  ${i + 1}. [${c.uf_sigla}] ${c.nome}`));
        const idx = parseInt(await ask('Número da cidade a deletar: '), 10) - 1;
        if (idx < 0 || idx >= cidades.length) { console.log('Número inválido.'); break; }
        const target = cidades[idx];
        const confirm = await ask(`Confirmar exclusão de ${target.nome}? (s/n): `);
        if (confirm.toLowerCase() === 's') {
          deleteCidade(target.id);
          console.log('Cidade deletada (regiões removidas em cascata).');
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
