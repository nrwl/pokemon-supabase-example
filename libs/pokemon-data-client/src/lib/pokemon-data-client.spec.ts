import { pokemonDataClient } from './pokemon-data-client';

describe('pokemonDataClient', () => {
  it('should work', () => {
    expect(pokemonDataClient()).toEqual('pokemon-data-client');
  });
});
