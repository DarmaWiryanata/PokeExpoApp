import { gql } from '@apollo/client';

export const GET_POKEMONS =  gql`
  query getPokemonsQuery($limit: Int, $name: String, $offset: Int) {
    pokemon_v2_pokemon_aggregate {
      aggregate {
        count
      }
    }
    pokemon_v2_pokemon(limit: $limit, offset: $offset, where: {name: {_like: $name}}) {
      id
      name
      pokemon_v2_pokemonsprites {
        sprites(path: "front_default")
      }
    }
  }
`;
