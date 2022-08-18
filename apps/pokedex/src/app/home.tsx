import {
  BasicPokemonInfo,
  createPokemonDataClient,
} from '@pokemon-supabase-example/pokemon-data-client';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PokemonTypes, StatsChart } from './pokemon-detail';

const sortingMethds = [
  'by id',
  'by name',
  'by height',
  'by weight',
  'by hp',
  'by attack',
  'by defense',
  'by special',
  'by speed',
  'by total base stats',
] as const;

type SortingMethod = typeof sortingMethds[number];

const sortBy: Record<
  SortingMethod,
  (a: BasicPokemonInfo, b: BasicPokemonInfo) => 1 | -1
> = {
  'by id': (a, b) => (+a.id < +b.id ? -1 : 1),
  'by name': (a, b) => (a.name < b.name ? -1 : 1),
  'by height': (a, b) => (a.height < b.height ? 1 : -1),
  'by weight': (a, b) => (a.weight < b.weight ? 1 : -1),
  'by hp': (a, b) => (a.baseStats.hp < b.baseStats.hp ? 1 : -1),
  'by attack': (a, b) => (a.baseStats.attack < b.baseStats.attack ? 1 : -1),
  'by defense': (a, b) => (a.baseStats.defense < b.baseStats.defense ? 1 : -1),
  'by special': (a, b) => (a.baseStats.special < b.baseStats.special ? 1 : -1),
  'by speed': (a, b) => (a.baseStats.speed < b.baseStats.speed ? 1 : -1),
  'by total base stats': (a, b) =>
    Object.values(a.baseStats).reduce((acc, stat) => acc + stat, 0) <
    Object.values(b.baseStats).reduce((acc, stat) => acc + stat, 0)
      ? 1
      : -1,
};

export function Home() {
  const [loadingState, setLoadingState] = useState<
    'loading' | 'not attempted' | 'success' | 'error'
  >('not attempted');
  const [pokemon, setPokemon] = useState<BasicPokemonInfo[]>([]);
  const [sortingMethod, setSortingMethod] = useState<SortingMethod>('by id');
  useEffect(() => {
    setLoadingState('loading');
    const client = createPokemonDataClient();
    client
      .getAllBasicPokemonInfo()
      .then((data) => {
        setPokemon(data);
        setLoadingState('success');
      })
      .catch(() => {
        setLoadingState('error');
      });
  }, []);
  useEffect(() => {
    setPokemon([...pokemon].sort(sortBy[sortingMethod]));
  }, [sortingMethod]);
  switch (loadingState) {
    case 'loading': {
      return <div>Loading...</div>;
    }
    case 'not attempted': {
      return <div>Initializing...</div>;
    }
    case 'success': {
      return (
        <>
          <h1 className="text-center text-4xl pt-4">Pokedex</h1>
          <fieldset
            className="text-right pr-4
          "
          >
            <label htmlFor="sorting-method">Sorting Method: </label>
            <select
              id="sorting-method"
              value={sortingMethod}
              onChange={(event) => {
                setSortingMethod(event.target.value as SortingMethod);
              }}
            >
              {sortingMethds.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </fieldset>
          <div className="grid grid-cols-5 gap-4 m-4">
            {pokemon.map((p) => (
              <BasicPokemonCard key={p.id} pokemon={p} />
            ))}
          </div>
        </>
      );
    }
    case 'error': {
      return <div>Error</div>;
    }
  }
}

export function BasicPokemonCard({ pokemon }: { pokemon: BasicPokemonInfo }) {
  return (
    <Link to={`/pokemon/${pokemon.id}`}>
      <div className="pokemon-card max-w-sm bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-600 cursor-pointer">
        <div className="flex justify-end px-4 pt-4 cursor-pointer">
          <div className="inline-block text-gray-500 dark:text-gray-400 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:outline-none focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-1.5">
            <span>#{pokemon.id}</span>
          </div>
        </div>
        <div className="flex flex-col items-center pb-10 mt-4">
          <img
            className="mb-3 w-24 h-24 bg-gray-400 rounded-lg shadow-lg"
            src={pokemon.imageUrl}
            alt={`${pokemon.name} - ${pokemon.classification}`}
          />
          <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">
            {pokemon.name}
          </h5>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            <PokemonTypes pokemon={pokemon} />
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {pokemon.classification}
          </span>
          <div className="mt-4" style={{ width: '200px' }}>
            <StatsChart pokemon={pokemon} />
          </div>
        </div>
      </div>
    </Link>
  );
}

export default Home;
