import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('pokemon.db');

export function criarTabelaFavoritos() {
  db.execSync(`
    CREATE TABLE IF NOT EXISTS pokemon_favoritos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      pokemon_id INTEGER,
      nome TEXT,
      tipo TEXT,
      nota INTEGER
    );
  `);
}

export async function salvarPokemonFavorito({ pokemon_id, nome, tipo, nota }) {
  await db.runAsync(
    'INSERT INTO pokemon_favoritos (pokemon_id, nome, tipo, nota) VALUES (?, ?, ?, ?);',
    [pokemon_id, nome, tipo, nota]
  );
}

export async function listarNotasDoPokemon(pokemon_id) {
  return db.getAllAsync(
    `SELECT id, pokemon_id, nome, tipo, nota
     FROM pokemon_favoritos
     WHERE pokemon_id = ?
     ORDER BY id DESC;`,
    [pokemon_id]
  );
}
