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

export const GET_POKEMON_DETAIL = gql`
  query getPokemonDetailQuery($id: Int!) {
    pokemon_v2_pokemon_by_pk(id: $id) {
      id
      name
      height
      weight
      pokemon_v2_pokemonsprites {
        default: sprites(path: "front_default")
        official: sprites(path: "other.official-artwork.front_default")
      }
      pokemon_v2_pokemontypes {
        slot
        pokemon_v2_type {
          name
        }
      }
      pokemon_v2_pokemonstats {
        base_stat
        effort
        pokemon_v2_stat {
          name
        }
      }
      pokemon_v2_pokemonspecy {
        gender_rate
        pokemon_v2_growthrate {
          name
        }
      }
      pokemon_v2_pokemonabilities {
        pokemon_v2_ability {
          name
        }
        is_hidden
        slot
      }
    }
  }
`;
