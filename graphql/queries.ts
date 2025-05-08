import { gql } from '@apollo/client';

export const GET_POKEMONS =  gql`
  query getPokemonsQuery($limit: Int, $offset: Int) {
    pokemon_v2_pokemon_aggregate {
      aggregate {
        count
      }
    }
    pokemon_v2_pokemon(limit: $limit, offset: $offset) {
      id
      name
      pokemon_v2_pokemonsprites {
        sprites(path: "front_default")
      }
    }
  }
`;
