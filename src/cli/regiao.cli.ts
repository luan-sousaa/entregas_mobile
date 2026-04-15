import { ask, showMenu, printDivider } from './menu.js';
import { listRegioes, createRegiao, updateRegiao, deleteRegiao } from '../services/regiao.service.js';
import { listCidades } from '../services/cidade.service.js';

export async function regiaoMenu(): Promise<void> {
  let running = true;

  while (running) {
    const choice = await showMenu('GERENCIAR REGIÃO', [
      'Listar Regiões',
      'Criar Região',
      'Editar Região',
      'Deletar Região',
    ]);

    switch (choice) {
      case 0:
        running = false;
        break;

      case 1: {
        const regioes = listRegioes();
        printDivider();
        if (regioes.length === 0) {
          console.log('Nenhuma região cadastrada.');
        } else {
          regioes.forEach((r) => console.log(r.label));
        }
        printDivider();
        break;
      }

      case 2: {
        const cidades = listCidades();
        if (cidades.length === 0) { console.log('Cadastre uma Cidade primeiro.'); break; }
        cidades.forEach((c, i) => console.log(`  ${i + 1}. [${c.uf_sigla}] ${c.nome}`));
        const cidadeIdx = parseInt(await ask('Número da Cidade: '), 10) - 1;
        if (cidadeIdx < 0 || cidadeIdx >= cidades.length) { console.log('Número inválido.'); break; }
        const nome = await ask('Nome da região: ');
        if (!nome) { console.log('Nome obrigatório.'); break; }
        createRegiao(nome, cidades[cidadeIdx].id);
        console.log(`Região criada: ${nome} em ${cidades[cidadeIdx].nome}`);
        break;
      }

      case 3: {
        const regioes = listRegioes();
        if (regioes.length === 0) { console.log('Nenhuma região para editar.'); break; }
        regioes.forEach((r, i) => console.log(`  ${i + 1}. ${r.label}`));
        const idx = parseInt(await ask('Número da região: '), 10) - 1;
        if (idx < 0 || idx >= regioes.length) { console.log('Número inválido.'); break; }
        const target = regioes[idx];

        const nome = (await ask(`Novo nome [${target.nome}]: `)) || target.nome;

        const cidades = listCidades();
        cidades.forEach((c, i) => console.log(`  ${i + 1}. [${c.uf_sigla}] ${c.nome}`));
        const cidadeInput = await ask(`Nova cidade (número) ou Enter para manter [${target.cidade_nome}]: `);
        let cidade_id = target.cidade_id;
        if (cidadeInput) {
          const cidadeIdx = parseInt(cidadeInput, 10) - 1;
          if (cidadeIdx >= 0 && cidadeIdx < cidades.length) cidade_id = cidades[cidadeIdx].id;
        }
        updateRegiao(target.id, nome, cidade_id);
        console.log('Região atualizada.');
        break;
      }

      case 4: {
        const regioes = listRegioes();
        if (regioes.length === 0) { console.log('Nenhuma região para deletar.'); break; }
        regioes.forEach((r, i) => console.log(`  ${i + 1}. ${r.label}`));
        const idx = parseInt(await ask('Número da região a deletar: '), 10) - 1;
        if (idx < 0 || idx >= regioes.length) { console.log('Número inválido.'); break; }
        const target = regioes[idx];
        const confirm = await ask(`Confirmar exclusão de "${target.nome}"? (s/n): `);
        if (confirm.toLowerCase() === 's') {
          deleteRegiao(target.id);
          console.log('Região deletada.');
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
