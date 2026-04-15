import { eq } from 'drizzle-orm';
import { db } from '../db/index.js';
import { uf, type Uf } from '../db/schema.js';

export function listUfs(): Uf[] {
  return db.select().from(uf).all();
}

export function createUf(nome: string, sigla: string): void {
  db.insert(uf).values({ nome, sigla: sigla.toUpperCase() }).run();
}

export function updateUf(id: number, nome: string, sigla: string): void {
  db.update(uf).set({ nome, sigla: sigla.toUpperCase() }).where(eq(uf.id, id)).run();
}

export function deleteUf(id: number): void {
  db.delete(uf).where(eq(uf.id, id)).run();
}
