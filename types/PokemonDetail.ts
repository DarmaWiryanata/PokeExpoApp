import Pokemon from "./Pokemon";
import PokemonStat from "./PokemonStat";
import PokemonType from "./PokemonType";

export default interface PokemonDetail extends Pokemon {
  height: number;
  weight: number;
  types: PokemonType[];
  stats: PokemonStat[];
}
