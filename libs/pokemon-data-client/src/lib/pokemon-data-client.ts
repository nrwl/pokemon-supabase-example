import {
  MovesLearnedByItem,
  MovesLearnedByLevelTableEntity,
  MoveTableEntity,
  PokemonTableEntity,
  Type,
} from '@pokemon-supabase-example/pokemon-db';
import { createClient } from '@supabase/supabase-js';

export interface Stats {
  hp: number;
  attack: number;
  defense: number;
  special: number;
  speed: number;
}

export const maxStats: Stats = {
  hp: 250,
  attack: 134,
  defense: 180,
  special: 154,
  speed: 140,
};

export interface FullPokemon {
  id: string;
  name: string;
  types: [Type] | [Type, Type];
  classification: string;
  imageUrl: string;
  baseStats: Stats;
  height: number;
  weight: number;
  captureRate: number;
  level50MinStats: Stats;
  level50MaxStats: Stats;
  level100MinStats: Stats;
  level100MaxStats: Stats;
  learnableMoves: Move[];
}

export interface BasicPokemonInfo {
  id: string;
  name: string;
  types: [Type] | [Type, Type];
  classification: string;
  imageUrl: string;
  baseStats: Stats;
  height: number;
  weight: number;
}

export interface Move {
  name: string;
  type: Type;
  description: string;
  attack?: number;
  accuracy?: number;
  powerPoints: number;
  effectPercentage?: number;
}

export interface PokemonDataClient {
  getAllBasicPokemonInfo(): Promise<BasicPokemonInfo[]>;
  getFullPokemonDataById(id: string): Promise<FullPokemon>;
}

export function createPokemonDataClient(): PokemonDataClient {
  const { supabaseUrl, supabaseKey } = getSupabaseCredsFromEnv();

  const client = createClient(supabaseUrl, supabaseKey);

  const getAllBasicPokemonInfo = async (): Promise<BasicPokemonInfo[]> => {
    const { data, error } = await client
      .from<PokemonTableEntity>('pokemon')
      .select();
    if (error) {
      throw new Error(`Error getting pokemon basic info`);
    }
    function convertData(inc: PokemonTableEntity): BasicPokemonInfo {
      return {
        id: inc.id,
        name: inc.name,
        types: inc.type2 ? [inc.type1, inc.type2] : [inc.type1],
        classification: inc.classification,
        imageUrl: inc.image_url,
        baseStats: {
          hp: inc.base_stat_hp,
          attack: inc.base_stat_attack,
          defense: inc.base_stat_defense,
          special: inc.base_stat_special,
          speed: inc.base_stat_speed,
        },
        height: inc.height,
        weight: inc.weight,
      };
    }
    return data.map(convertData);
  };

  const getFullPokemonDataById = async (id: string): Promise<FullPokemon> => {
    const [
      { data: pokemonData, error: pokemonError },
      { data: movesByLevelData, error: movesByLevelError },
      { data: movesByItemData, error: movesByItemError },
    ] = await Promise.all([
      client
        .from<PokemonTableEntity>('pokemon')
        .select()
        .filter('id', 'eq', id),
      client
        .from<MovesLearnedByLevelTableEntity>('moves_learned_by_level')
        .select()
        .filter('pokemon_id', 'eq', id),
      client
        .from<MovesLearnedByItem>('moves_learned_by_item')
        .select()
        .filter('pokemon_id', 'eq', id),
    ]);
    const pokemon = pokemonData && pokemonData[0];
    if (!pokemon) {
      throw new Error(`No pokemon found with id ${id}`);
    }
    if (pokemonError || movesByLevelError || movesByItemError) {
      throw new Error(`Error getting pokemon with id ${id}`);
    }
    const moveIds = [
      ...(movesByLevelData || []),
      ...(movesByItemData || []),
    ].map((move) => move.move_id);
    const { data: moveData, error: moveError } = await client
      .from<MoveTableEntity>('moves')
      .select()
      .in('id', moveIds);
    if (!moveData || moveError) {
      throw new Error(`Error getting moves for pokemon at id: ${id}`);
    }
    return convertToFullPokemon(pokemon, moveData);
  };
  function convertToFullPokemon(
    pokemon: PokemonTableEntity,
    movesData: MoveTableEntity[]
  ): FullPokemon {
    return {
      id: pokemon.id,
      name: pokemon.name,
      types: pokemon.type2 ? [pokemon.type1, pokemon.type2] : [pokemon.type1],
      classification: pokemon.classification,
      height: pokemon.height,
      weight: pokemon.weight,
      captureRate: pokemon.capture_rate,
      imageUrl: pokemon.image_url,
      baseStats: {
        hp: pokemon.base_stat_hp,
        attack: pokemon.base_stat_attack,
        defense: pokemon.base_stat_defense,
        special: pokemon.base_stat_special,
        speed: pokemon.base_stat_speed,
      },
      level50MinStats: {
        hp: pokemon.level_50_min_hp,
        attack: pokemon.level_50_min_attack,
        defense: pokemon.level_50_min_defense,
        special: pokemon.level_50_min_special,
        speed: pokemon.level_50_min_speed,
      },
      level50MaxStats: {
        hp: pokemon.level_50_max_hp,
        attack: pokemon.level_50_max_attack,
        defense: pokemon.level_50_max_defense,
        special: pokemon.level_50_max_special,
        speed: pokemon.level_50_max_speed,
      },
      level100MinStats: {
        hp: pokemon.level_100_min_hp,
        attack: pokemon.level_100_min_attack,
        defense: pokemon.level_100_min_defense,
        special: pokemon.level_100_min_special,
        speed: pokemon.level_100_min_speed,
      },
      level100MaxStats: {
        hp: pokemon.level_100_max_hp,
        attack: pokemon.level_100_max_attack,
        defense: pokemon.level_100_max_defense,
        special: pokemon.level_100_max_special,
        speed: pokemon.level_100_max_speed,
      },
      learnableMoves:
        movesData?.map((moveTableEntity) => ({
          name: moveTableEntity.name,
          type: moveTableEntity.type,
          description: moveTableEntity.description,
          attack: moveTableEntity.attack,
          accuracy: moveTableEntity.accuracy,
          powerPoints: moveTableEntity.power_points,
          effectPercentage: moveTableEntity.effect_percentage,
        })) || [],
    };
  }
  return {
    getFullPokemonDataById,
    getAllBasicPokemonInfo,
  };
}

function getSupabaseCredsFromEnv(): {
  supabaseUrl: string;
  supabaseKey: string;
} {
  const { supabaseApiUrl, supabaseApiKey } = (window as any).env;
  if (!supabaseApiUrl || !supabaseApiKey) {
    throw new Error(
      'Missing SUPABASE_URL or SUPABASE_KEY environment variables'
    );
  }
  return {
    supabaseKey: supabaseApiKey,
    supabaseUrl: supabaseApiUrl,
  };
}
