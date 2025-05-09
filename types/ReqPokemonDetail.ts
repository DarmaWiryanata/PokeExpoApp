export interface ReqPokemonDetail {
  pokemon_v2_pokemon_by_pk: PokemonV2PokemonByPk;
}

interface PokemonV2PokemonByPk {
  id:                        number;
  name:                      string;
  height:                    number;
  weight:                    number;
  pokemon_v2_pokemonsprites: PokemonV2Pokemonsprite[];
  pokemon_v2_pokemontypes:   PokemonV2Pokemontype[];
  pokemon_v2_pokemonstats:   PokemonV2Pokemonstat[];
}

interface PokemonV2Pokemonsprite {
  defaultSprite:  string;
  officialSprite: string;
}

interface PokemonV2Pokemonstat {
  base_stat:       number;
  effort:          number;
  pokemon_v2_stat: PokemonV2;
}

interface PokemonV2 {
  name: string;
}

interface PokemonV2Pokemontype {
  slot:            number;
  pokemon_v2_type: PokemonV2;
}
