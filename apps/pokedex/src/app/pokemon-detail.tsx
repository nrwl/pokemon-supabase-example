import {
  createPokemonDataClient,
  FullPokemon,
  maxStats,
  Move,
  Stats,
} from '@pokemon-supabase-example/pokemon-data-client';
import { Type } from '@pokemon-supabase-example/pokemon-db';
import {
  Filler,
  LineElement,
  PointElement,
  RadialLinearScale,
  Tooltip,
  Legend,
  Chart as ChartJS,
  LinearScale,
} from 'chart.js';
import { useEffect, useState } from 'react';
import { Radar } from 'react-chartjs-2';
import { useParams } from 'react-router-dom';

export function PokemonDetail() {
  const [loadingState, setLoadingState] = useState<
    'loading' | 'not attempted' | 'success' | 'error'
  >('not attempted');
  const [pokemon, setPokemon] = useState<FullPokemon | undefined>(undefined);
  const { id } = useParams();
  useEffect(() => {
    setLoadingState('loading');
    const client = createPokemonDataClient();
    if (id) {
      client
        .getFullPokemonDataById(id)
        .then((data) => {
          setPokemon(data);
          setLoadingState('success');
        })
        .catch(() => {
          setLoadingState('error');
        });
    }
  }, []);
  switch (loadingState) {
    case 'loading': {
      return <div>Loading...</div>;
    }
    case 'not attempted': {
      return <div>Initializing...</div>;
    }
    case 'success': {
      if (!pokemon) {
        return <div>No pokemon found</div>;
      }
      return (
        <div className="bg-gray-900">
          <div className="flex justify-end px-4 pt-4">
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
            <PokemonTypes pokemon={pokemon} />
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {pokemon.classification}
            </span>
            <div className="bg-gray-400 rounded-lg shadow-2xl p-6 m-4 hover:ring-gray-300">
              <h2 className="text-center text-lg">Stats</h2>
              <div className="flex flex-row items-center">
                <StatsTable pokemon={pokemon} />
                <StatsChart pokemon={pokemon} />
              </div>
            </div>
            <div className="bg-gray-400 rounded-lg shadow-2xl p-6 m-4">
              <h2 className="text-center text-lg">Moves</h2>
              <MoveTable moves={pokemon.learnableMoves} />
            </div>
          </div>
        </div>
      );
    }
    case 'error': {
      return <div>Error</div>;
    }
  }
}

function MoveTable({ moves }: { moves: Move[] }) {
  return (
    <table className="text-center">
      <thead>
        <tr>
          <th>Name</th>
          <th>Description</th>
          <th>Type</th>
          <th>Power</th>
          <th>Accuracy</th>
          <th>PP</th>
          <th>Effect Chance</th>
        </tr>
      </thead>
      <tbody>
        {moves.map((move) => (
          <MoveRow key={move.name} move={move} />
        ))}
      </tbody>
    </table>
  );
}

function MoveRow({ move }: { move: Move }) {
  return (
    <tr>
      <td className="px-6">{move.name}</td>
      <td className="px-6">{move.description}</td>
      <td className="px-6">
        <TypeImage type={move.type} />
      </td>
      <td className="px-6">{move.attack || '--'} </td>
      <td className="px-6">{move.accuracy || '--'} </td>
      <td className="px-6">{move.powerPoints || '--'} </td>
      <td className="px-6">
        {move.effectPercentage ? `${move.effectPercentage}%` : '--'}{' '}
      </td>
    </tr>
  );
}

function StatsTable({ pokemon }: { pokemon: FullPokemon }) {
  return (
    <table className="text-center">
      <thead>
        <tr>
          <th></th>
          <th>Hp</th>
          <th>Attack</th>
          <th>Defense</th>
          <th>Special</th>
          <th>Speed</th>
        </tr>
      </thead>
      <tbody>
        <StatsRow name="Base Stats" stats={pokemon.baseStats} />
        <StatsRow name="Lv. 50 Min Stats" stats={pokemon.level50MinStats} />
        <StatsRow name="Lv. 50 Max Stats" stats={pokemon.level50MaxStats} />
        <StatsRow name="Lv. 100 Min Stats" stats={pokemon.level100MinStats} />
        <StatsRow name="Lv. 100 Max Stats" stats={pokemon.level100MaxStats} />
      </tbody>
    </table>
  );
}

function StatsRow({ stats, name }: { stats: Stats; name: string }) {
  return (
    <tr>
      <th className="px-6">{name}</th>
      <td className="px-6">{stats.hp}</td>
      <td className="px-6">{stats.attack}</td>
      <td className="px-6">{stats.defense}</td>
      <td className="px-6">{stats.special}</td>
      <td className="px-6">{stats.speed}</td>
    </tr>
  );
}

export function PokemonTypes({
  pokemon,
}: {
  pokemon: { types: [Type] | [Type, Type] };
}) {
  return (
    <div className="flex flex-row items-center">
      <TypeImage type={pokemon.types[0]} />
      {pokemon.types.length > 1 && <span> | </span>}
      {pokemon.types.length > 1 && <TypeImage type={pokemon.types[1]!} />}
    </div>
  );
}

function TypeImage({ type }: { type: Type }) {
  return (
    <img
      sizes="(max-width: 600px) 200px, 50vw"
      src={`https://serebii.net/pokedex-bw/type/${type}.gif`}
      alt={type}
    />
  );
}

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  LinearScale
);

export function StatsChart({
  pokemon,
}: {
  pokemon: { name: string; baseStats: Stats };
}) {
  const data = {
    labels: ['HP', 'Attack', 'Defense', 'Special', 'Speed'],
    datasets: [
      {
        label: `${pokemon.name}'s Base Stats`,
        data: [
          pokemon.baseStats.hp / maxStats.hp,
          pokemon.baseStats.attack / maxStats.attack,
          pokemon.baseStats.defense / maxStats.defense,
          pokemon.baseStats.special / maxStats.special,
          pokemon.baseStats.speed / maxStats.speed,
        ],
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  };
  return (
    <div className="bg-gray-300 rounded-lg shadow-lg">
      <Radar
        data={data}
        options={{
          scales: {
            RadialLinearScale: {
              max: 1,
              min: 0,
              ticks: { callback: () => '' },
            },
          },
        }}
      />
    </div>
  );
}
