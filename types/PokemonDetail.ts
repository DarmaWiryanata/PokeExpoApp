import Pokemon from "./Pokemon";
import PokemonAbility from "./PokemonAbility";
import PokemonStat from "./PokemonStat";
import PokemonType from "./PokemonType";

export default interface PokemonDetail extends Pokemon {
  height: number;
  weight: number;
  officialArtworkSprite?: string;
  growthRate: string;
  types: PokemonType[];
  stats: PokemonStat[];
  abilities: PokemonAbility[];
}
