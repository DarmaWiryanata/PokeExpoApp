import { gql } from '@apollo/client';

export const GET_POKEMONS =  gql`
  query getPokemonsQuery(
    $limit: Int
    $nameFilter: String_comparison_exp
    $offset: Int
    $sort: [pokemon_v2_pokemon_order_by!]
    $typeFilter: pokemon_v2_pokemontype_bool_exp
  ) {
    pokemon_v2_pokemon(
      limit: $limit
      offset: $offset
      where: {name: $nameFilter, pokemon_v2_pokemontypes: $typeFilter}
      order_by: $sort
    ) {
      id
      name
      pokemon_v2_pokemonsprites {
        sprites(path: "front_default")
      }
    }
  }
`;

export const GET_POKEMONS_DROPDOWN = gql`
  query getPokemonsDropdownQuery {
    pokemon_v2_pokemon(order_by: {id: asc}) {
      id
      name
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

export const GET_POKEMON_TYPES = gql`
  query getPokemonTypesQuery {
    pokemon_v2_type {
      id
      name
    }
  }
`;
