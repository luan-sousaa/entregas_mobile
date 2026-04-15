import { eq } from 'drizzle-orm';
import { db } from '../db/index.js';
import { regiao, cidade, uf } from '../db/schema.js';

export type RegiaoRelacional = {
  id:          number;
  nome:        string;
  cidade_id:   number;
  cidade_nome: string;
  uf_sigla:    string;
  label:       string;
};

export function listRegioes(): RegiaoRelacional[] {
  const rows = db
    .select({
      id:          regiao.id,
      nome:        regiao.nome,
      cidade_id:   regiao.cidade_id,
      cidade_nome: cidade.nome,
      uf_sigla:    uf.sigla,
    })
    .from(regiao)
    .innerJoin(cidade, eq(regiao.cidade_id, cidade.id))
    .innerJoin(uf, eq(cidade.uf_id, uf.id))
    .all();

  return rows.map((r) => ({
    ...r,
    label: `${r.uf_sigla} - ${r.cidade_nome} - ${r.nome}`,
  }));
}

export function createRegiao(nome: string, cidade_id: number): void {
  db.insert(regiao).values({ nome, cidade_id }).run();
}

export function updateRegiao(id: number, nome: string, cidade_id: number): void {
  db.update(regiao).set({ nome, cidade_id }).where(eq(regiao.id, id)).run();
}

export function deleteRegiao(id: number): void {
  db.delete(regiao).where(eq(regiao.id, id)).run();
}
