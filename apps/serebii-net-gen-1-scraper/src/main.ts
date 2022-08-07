import { parallelPromiseWithConcurrency } from './app/parallel-promise-with-concurrency';
import { scrapePokemonData } from './app/scrape-pokemon-data';
import { writeToDb } from './app/write-to-db';

async function run() {
  const pokemonIds: number[] = [];
  for (let i = 1; i <= 151; i++) {
    pokemonIds.push(i);
  }
  const pokemonPromises = pokemonIds.map((id) => () => scrapePokemonData(id));
  const scrapeResults = await parallelPromiseWithConcurrency(
    pokemonPromises,
    10
  );
  await writeToDb(scrapeResults);
}

run();
