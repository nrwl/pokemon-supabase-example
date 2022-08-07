import {
  MovesLearnedByItem,
  MovesLearnedByLevelTableEntity,
  MoveTableEntity,
  PokemonTableEntity,
  types,
  TypeTableEntity,
} from '@pokemon-supabase-example/pokemon-db';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'http://localhost:54321';
const SUPABASE_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSJ9.vI9obAHOGyVVKa3pD--kJlyxp-Z2zV9UUMAhKpNLAcU';

export async function writeToDb(
  input: {
    pokemon: PokemonTableEntity;
    levelingMoves: (MoveTableEntity & { level: number | undefined })[];
    itemMoves: (MoveTableEntity & { item_name: string })[];
  }[]
) {
  const supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY);
  console.log('writing to db');
  console.log('writing to types');
  const { data, error } = await supabaseClient
    .from<TypeTableEntity>('types')
    .insert(types.map((type) => ({ name: type })));
  if (error) {
    console.log(error);
    return;
  }
  console.log('successfully wrote types to DB');
  console.log('writing to pokemon');
  const { data: pokemonData, error: pokemonError } = await supabaseClient
    .from<PokemonTableEntity>('pokemon')
    .insert(input.map(({ pokemon }) => pokemon));
  if (pokemonError) {
    console.log(pokemonError);
    return;
  }
  console.log('successfully wrote pokemon to DB');
  console.log('writing to moves');
  const allMoves: Record<string, MoveTableEntity> = {};
  for (const levelingMoves of input.flatMap(({ levelingMoves }) =>
    levelingMoves.map((move) => {
      const newMove = { ...move };
      delete newMove.level;
      return newMove;
    })
  )) {
    allMoves[levelingMoves.id] = levelingMoves;
  }
  for (const itemMoves of input.flatMap(({ itemMoves }) =>
    itemMoves.map((move) => {
      const newMove = { ...move };
      delete newMove.item_name;
      return newMove;
    })
  )) {
    allMoves[itemMoves.id] = itemMoves;
  }
  const { data: moveData, error: moveError } = await supabaseClient
    .from<MoveTableEntity>('moves')
    .insert(Object.values(allMoves));
  if (moveError) {
    console.log(moveError);
    return;
  }
  console.log('successfully wrote moves to DB');
  for (const pokemonInput of input) {
    console.log(`writing to moves learned by ${pokemonInput.pokemon.name}`);
    const [
      { data: levelData, error: levelError },
      { data: itemData, error: itemError },
    ] = await Promise.all([
      supabaseClient
        .from<MovesLearnedByLevelTableEntity>('moves_learned_by_level')
        .insert(
          Object.values(
            pokemonInput.levelingMoves.reduce((acc, move) => {
              acc[move.id] = move;
              return acc;
            }, {})
          ).map(({ id, level }) => ({
            pokemon_id: pokemonInput.pokemon.id,
            move_id: id,
            level,
          }))
        ),
      supabaseClient.from<MovesLearnedByItem>('moves_learned_by_item').insert(
        Object.values(
          pokemonInput.itemMoves.reduce((acc, move) => {
            acc[move.id] = move;
            return acc;
          }, {})
        ).map(({ id, item_name }) => ({
          pokemon_id: pokemonInput.pokemon.id,
          move_id: id,
          item_name,
        }))
      ),
    ]);
    if (levelError || itemError) {
      console.log(levelError, itemError);
    }
  }
}
