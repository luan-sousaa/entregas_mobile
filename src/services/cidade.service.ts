import { eq } from 'drizzle-orm';
import { db } from '../db/index.js';
import { cidade, uf, type Cidade } from '../db/schema.js';

export type CidadeComUf = Cidade & { uf_sigla: string; uf_nome: string };

export function listCidades(): CidadeComUf[] {
  return db
    .select({
      id:       cidade.id,
      nome:     cidade.nome,
      uf_id:    cidade.uf_id,
      uf_sigla: uf.sigla,
      uf_nome:  uf.nome,
    })
    .from(cidade)
    .innerJoin(uf, eq(cidade.uf_id, uf.id))
    .all();
}

export function createCidade(nome: string, uf_id: number): void {
  db.insert(cidade).values({ nome, uf_id }).run();
}

export function updateCidade(id: number, nome: string, uf_id: number): void {
  db.update(cidade).set({ nome, uf_id }).where(eq(cidade.id, id)).run();
}

export function deleteCidade(id: number): void {
  db.delete(cidade).where(eq(cidade.id, id)).run();
}
