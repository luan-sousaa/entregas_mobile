import { eq } from 'drizzle-orm';
import { randomUUID } from 'crypto';
import { db } from '../db/index.js';
import { regiao, cidade, uf, type NewRegiao, type Regiao } from '../db/schema.js';

export type RegiaoRelacional = {
  id:          string;
  nome:        string;
  cidade_id:   string;
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

export function createRegiao(nome: string, cidade_id: string): Regiao {
  const newRegiao: NewRegiao = { id: randomUUID(), nome, cidade_id };
  db.insert(regiao).values(newRegiao).run();
  return newRegiao as Regiao;
}

export function updateRegiao(id: string, nome: string, cidade_id: string): void {
  db.update(regiao).set({ nome, cidade_id }).where(eq(regiao.id, id)).run();
}

export function deleteRegiao(id: string): void {
  db.delete(regiao).where(eq(regiao.id, id)).run();
}
