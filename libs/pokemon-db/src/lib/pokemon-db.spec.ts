import { pokemonDb } from './pokemon-db';

describe('pokemonDb', () => {
  it('should work', () => {
    expect(pokemonDb()).toEqual('pokemon-db');
  });
});
