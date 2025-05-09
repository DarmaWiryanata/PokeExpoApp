import PokemonDetail from "@/types/PokemonDetail";
import PokemonStat from "@/types/PokemonStat";
import PokemonType from "@/types/PokemonType";
import { ReqPokemonDetail } from "@/types/ReqPokemonDetail";

export default function parsePokemon(data: ReqPokemonDetail): PokemonDetail {
  const {
    id,
    name,
    height,
    weight,
    pokemon_v2_pokemonsprites,
    pokemon_v2_pokemontypes,
    pokemon_v2_pokemonstats,
  } = data.pokemon_v2_pokemon_by_pk;

  const types: PokemonType[] = pokemon_v2_pokemontypes.map((type: any) => ({
    name: type.pokemon_v2_type.name,
    slot: type.slot,
  })).sort((a: PokemonType, b: PokemonType) => (a.slot < b.slot ? -1 : 1));

  const stats: PokemonStat[] = pokemon_v2_pokemonstats.map((stat: any) => ({
    name: stat.pokemon_v2_stat.name,
    base_stat: stat.base_stat,
    effort: stat.effort,
  }));

  const { officialSprite, defaultSprite }: any = pokemon_v2_pokemonsprites[0];
  const selectedPokemon: PokemonDetail = {
    id,
    name,
    height,
    weight,
    sprite: officialSprite ?? defaultSprite,
    types,
    stats,
  }

  return selectedPokemon;
}
