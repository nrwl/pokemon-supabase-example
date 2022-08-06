export interface PokemonTableEntity {
  id: string;
  name: string;
  type1: Type;
  type2: Type | undefined;
  classification: string;
  height: number;
  weight: number;
  captureRate: number;
  imageUrl: string;
  baseStatHp: number;
  baseStatAttack: number;
  baseStatDefense: number;
  baseStatSpecial: number;
  baseStatSpeed: number;
  level50MinHp: number;
  level50MaxHp: number;
  level50MinAttack: number;
  level50MaxAttack: number;
  level50MinDefense: number;
  level50MaxDefense: number;
  level50MinSpecial: number;
  level50MaxSpecial: number;
  level50MinSpeed: number;
  level50MaxSpeed: number;
  level100MinHp: number;
  level100MaxHp: number;
  level100MinAttack: number;
  level100MaxAttack: number;
  level100MinDefense: number;
  level100MaxDefense: number;
  level100MinSpecial: number;
  level100MaxSpecial: number;
  level100MinSpeed: number;
  level100MaxSpeed: number;
}

export interface MoveTableEntity {
  id: string;
  name: string;
  type: Type;
  description: string;
  attack: number;
  accuracy: number;
  powerPoints: number;
  effectPercentage: number;
}

export interface TypeTableEntity {
  name: Type;
}

export interface MovesLearnedByLevelTableEntity {
  pokemonId: string;
  moveId: string;
  level: number | undefined;
}

export interface MovesLearnedByItem {
  pokemonId: string;
  moveId: string;
  itemName: string;
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
] as const;

export type Type = typeof types[number];
