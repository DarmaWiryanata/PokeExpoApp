import { useLazyQuery, useQuery } from '@apollo/client';
import { Image } from 'expo-image';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { POKEBALL_IMAGE } from '@/constants/Images';
import { GET_POKEMON_DETAIL, GET_POKEMONS_DROPDOWN } from '@/graphql/queries';
import { Pokemon } from '.';
import { PokemonAbility, PokemonDetail, PokemonStat, PokemonType } from '../pokemon/[id]';

export default function FilterScreen() {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [firstPokemon, setFirstPokemon] = useState<PokemonDetail>();
  const [secondPokemonID, setSecondPokemonID] = useState<number>();
  const [secondPokemon, setSecondPokemon] = useState<PokemonDetail>();

  const { data } = useQuery(GET_POKEMONS_DROPDOWN);

  useEffect(() => {
    if (data) {
      const pokemons: Pokemon[] = data.pokemon_v2_pokemon.map((pokemon: any) => ({
        id: pokemon.id,
        name: pokemon.name,
        sprite: "",
      }))

      setPokemons(pokemons);
    }
  }, [data])

  const [fetchFirstPokemonQuery, firstPokemonQuery] = useLazyQuery(GET_POKEMON_DETAIL);
  const [fetchSecondPokemonQuery, secondPokemonQuery] = useLazyQuery(GET_POKEMON_DETAIL);

  useEffect(() => {
    if (firstPokemonQuery.data) {
      const {
        id,
        name,
        height,
        weight,
        pokemon_v2_pokemonsprites,
        pokemon_v2_pokemontypes,
        pokemon_v2_pokemonstats,
        pokemon_v2_pokemonspecy,
        pokemon_v2_pokemonabilities
      } = firstPokemonQuery.data.pokemon_v2_pokemon_by_pk;

      const types: PokemonType[] = pokemon_v2_pokemontypes.map((type: any) => ({
        name: type.pokemon_v2_type.name,
        slot: type.slot,
      })).sort((a: PokemonType, b: PokemonType) => (a.slot < b.slot ? -1 : 1));

      const stats: PokemonStat[] = pokemon_v2_pokemonstats.map((stat: any) => ({
        name: stat.pokemon_v2_stat.name,
        base_stat: stat.base_stat,
        effort: stat.effort,
      }));

      const abilities: PokemonAbility[] = pokemon_v2_pokemonabilities.map((ability: any) => ({
        name: ability.pokemon_v2_ability.name,
        slot: ability.slot,
        is_hidden: ability.is_hidden,
      })).sort((a: PokemonAbility, b: PokemonAbility) => (a.slot < b.slot ? -1 : 1));

      const selectedPokemon: PokemonDetail = {
        id,
        name,
        height,
        weight,
        sprite: pokemon_v2_pokemonsprites[0].default,
        officialArtworkSprite: pokemon_v2_pokemonsprites[0].official,
        growthRate: pokemon_v2_pokemonspecy.pokemon_v2_growthrate.name,
        types,
        stats,
        abilities,
      }

      setFirstPokemon(selectedPokemon);
    }
  }, [firstPokemonQuery.data])

  useEffect(() => {
    if (secondPokemonQuery.data) {
      const {
        id,
        name,
        height,
        weight,
        pokemon_v2_pokemonsprites,
        pokemon_v2_pokemontypes,
        pokemon_v2_pokemonstats,
        pokemon_v2_pokemonspecy,
        pokemon_v2_pokemonabilities
      } = secondPokemonQuery.data.pokemon_v2_pokemon_by_pk;

      const types: PokemonType[] = pokemon_v2_pokemontypes.map((type: any) => ({
        name: type.pokemon_v2_type.name,
        slot: type.slot,
      })).sort((a: PokemonType, b: PokemonType) => (a.slot < b.slot ? -1 : 1));

      const stats: PokemonStat[] = pokemon_v2_pokemonstats.map((stat: any) => ({
        name: stat.pokemon_v2_stat.name,
        base_stat: stat.base_stat,
        effort: stat.effort,
      }));

      const abilities: PokemonAbility[] = pokemon_v2_pokemonabilities.map((ability: any) => ({
        name: ability.pokemon_v2_ability.name,
        slot: ability.slot,
        is_hidden: ability.is_hidden,
      })).sort((a: PokemonAbility, b: PokemonAbility) => (a.slot < b.slot ? -1 : 1));

      const selectedPokemon: PokemonDetail = {
        id,
        name,
        height,
        weight,
        sprite: pokemon_v2_pokemonsprites[0].default,
        officialArtworkSprite: pokemon_v2_pokemonsprites[0].official,
        growthRate: pokemon_v2_pokemonspecy.pokemon_v2_growthrate.name,
        types,
        stats,
        abilities,
      }

      setSecondPokemon(selectedPokemon);
    }
  }, [secondPokemonQuery.data])
  
  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.sectionContainer}>
        <Dropdown
            style={styles.dropdown}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            data={pokemons}
            search
            maxHeight={300}
            labelField="name"
            valueField="id"
            searchPlaceholder="Search..."
            value={firstPokemon}
            onChange={(item) => {
              fetchFirstPokemonQuery({
                variables: { id: item.id }
              });
            }}
          />
        <Dropdown
            style={styles.dropdown}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            data={pokemons}
            search
            maxHeight={300}
            labelField="name"
            valueField="id"
            searchPlaceholder="Search..."
            value={secondPokemon}
            onChange={(item) => {
              fetchSecondPokemonQuery({
                variables: { id: item.id }
              });
            }}
          />
      </ThemedView>

      <ThemedView style={styles.sectionContainer}>
        <Image
          source={firstPokemon?.officialArtworkSprite ?? firstPokemon?.sprite ?? POKEBALL_IMAGE}
          style={{ width: '50%', height: 200 }}
        />
        <Image
          source={secondPokemon?.officialArtworkSprite ?? secondPokemon?.sprite ?? POKEBALL_IMAGE}
          style={{ width: '50%', height: 200 }}
        />
      </ThemedView>

      {firstPokemon && secondPokemon && firstPokemon.stats.map((stat, index) => {
        const name = stat.name
        const pokemon1Value = stat.base_stat
        const pokemon2Value = secondPokemon.stats[index].base_stat
        return (
          <View key={name}>
            <ThemedText style={{textAlign: 'center'}}>{name}</ThemedText>
            <ThemedView style={[styles.sectionContainer, styles.statContainer]}>
              <View style={{
                width: "50%",
                flexDirection: "row-reverse",
              }}>
                <ThemedText
                  style={[
                    styles.statBar,
                    styles.statValue,
                    {
                      width: `${pokemon1Value}%`,
                      backgroundColor: '#444',
                      borderBottomRightRadius: 0,
                      borderTopRightRadius: 0
                    }
                  ]}
                >
                  {pokemon1Value}
                </ThemedText>
              </View>
              <View style={{ width: "50%" }}>
                <ThemedText
                  style={[
                    styles.statBar,
                    styles.statValue,
                    {
                      width: `${pokemon2Value}%`,
                      backgroundColor: '#999',
                      borderBottomLeftRadius: 0,
                      borderTopLeftRadius: 0
                    }
                  ]}
                >
                  {pokemon2Value}
                </ThemedText>
              </View>
            </ThemedView>
          </View>
        )
      })}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  dropdown: {
    height: 50,
    flex: 1,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  sectionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statContainer: {
    width: `100%`,
    backgroundColor: '#ddd',
    borderRadius: 5,
  },
  statBar: {
    // flexGrow: 1,
    backgroundColor: '#00ffff',
    borderRadius: 5,
    position: 'relative',
    // justifyContent: 'flex-end',
  },
  statValue: {
    textAlign: 'center',
    paddingVertical: 4
  },
});
