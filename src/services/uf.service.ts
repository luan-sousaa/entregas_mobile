import { eq } from 'drizzle-orm';
import { randomUUID } from 'crypto';
import { db } from '../db/index.js';
import { uf, type NewUf, type Uf } from '../db/schema.js';

export function listUfs(): Uf[] {
  return db.select().from(uf).all();
}

export function createUf(nome: string, sigla: string): Uf {
  const newUf: NewUf = { id: randomUUID(), nome, sigla: sigla.toUpperCase() };
  db.insert(uf).values(newUf).run();
  return newUf as Uf;
}

export function updateUf(id: string, nome: string, sigla: string): void {
  db.update(uf).set({ nome, sigla: sigla.toUpperCase() }).where(eq(uf.id, id)).run();
}

export function deleteUf(id: string): void {
  db.delete(uf).where(eq(uf.id, id)).run();
}
