import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from './schema.js';

const sqlite = new Database('./database.db');

sqlite.pragma('journal_mode = WAL');
sqlite.pragma('foreign_keys = ON');

export const db = drizzle(sqlite, { schema });

// Bootstrap schema on first run — no migration step needed
sqlite.exec(`
  CREATE TABLE IF NOT EXISTS uf (
    id    TEXT PRIMARY KEY,
    nome  TEXT NOT NULL,
    sigla TEXT NOT NULL UNIQUE
  );

  CREATE TABLE IF NOT EXISTS cidade (
    id    TEXT PRIMARY KEY,
    nome  TEXT NOT NULL,
    uf_id TEXT NOT NULL REFERENCES uf(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS regiao (
    id        TEXT PRIMARY KEY,
    nome      TEXT NOT NULL,
    cidade_id TEXT NOT NULL REFERENCES cidade(id) ON DELETE CASCADE
  );
`);
