export interface PokemonTableEntity {
  id: string;
  name: string;
  type1: Type;
  type2: Type | undefined;
  classification: string;
  height: number;
  weight: number;
  capture_rate: number;
  image_url: string;
  base_stat_hp: number;
  base_stat_attack: number;
  base_stat_defense: number;
  base_stat_special: number;
  base_stat_speed: number;
  level_50_min_hp: number;
  level_50_max_hp: number;
  level_50_min_attack: number;
  level_50_max_attack: number;
  level_50_min_defense: number;
  level_50_max_defense: number;
  level_50_min_special: number;
  level_50_max_special: number;
  level_50_min_speed: number;
  level_50_max_speed: number;
  level_100_min_hp: number;
  level_100_max_hp: number;
  level_100_min_attack: number;
  level_100_max_attack: number;
  level_100_min_defense: number;
  level_100_max_defense: number;
  level_100_min_special: number;
  level_100_max_special: number;
  level_100_min_speed: number;
  level_100_max_speed: number;
}

export interface MoveTableEntity {
  id: string;
  name: string;
  type: Type;
  description: string;
  attack?: number;
  accuracy?: number;
  power_points: number;
  effect_percentage?: number;
}

export interface TypeTableEntity {
  name: Type;
}

export interface MovesLearnedByLevelTableEntity {
  pokemon_id: string;
  move_id: string;
  level: number | undefined;
}

export interface MovesLearnedByItem {
  pokemon_id: string;
  move_id: string;
  item_name: string;
}

export const types = [
  'water',
  'fire',
  'grass',
  'electric',
  'psychic',
  'normal',
  'fighting',
  'poison',
  'ground',
  'rock',
  'bug',
  'ghost',
  'dragon',
  'flying',
  'ice',
] as const;

export type Type = typeof types[number];

export function isType(value: string): value is Type {
  return types.includes(value as any);
}

export function assertType(value: string): asserts value is Type {
  if (!isType(value)) {
    throw new Error(`${value} is not a valid type`);
  }
}
