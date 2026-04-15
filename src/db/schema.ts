import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const uf = sqliteTable('uf', {
  id:    integer('id').primaryKey({ autoIncrement: true }),
  nome:  text('nome').notNull(),
  sigla: text('sigla').notNull().unique(),
});

export const cidade = sqliteTable('cidade', {
  id:    integer('id').primaryKey({ autoIncrement: true }),
  nome:  text('nome').notNull(),
  uf_id: integer('uf_id')
    .notNull()
    .references(() => uf.id, { onDelete: 'cascade' }),
});

export const regiao = sqliteTable('regiao', {
  id:        integer('id').primaryKey({ autoIncrement: true }),
  nome:      text('nome').notNull(),
  cidade_id: integer('cidade_id')
    .notNull()
    .references(() => cidade.id, { onDelete: 'cascade' }),
});

export type Uf     = typeof uf.$inferSelect;
export type Cidade = typeof cidade.$inferSelect;
export type Regiao = typeof regiao.$inferSelect;

export type NewUf     = typeof uf.$inferInsert;
export type NewCidade = typeof cidade.$inferInsert;
export type NewRegiao = typeof regiao.$inferInsert;
