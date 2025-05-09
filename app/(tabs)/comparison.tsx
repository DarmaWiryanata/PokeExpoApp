import { useLazyQuery, useQuery } from '@apollo/client';
import { Image } from 'expo-image';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { POKEBALL_IMAGE } from '@/constants/Images';
import { GET_POKEMON_DETAIL, GET_POKEMONS_DROPDOWN } from '@/graphql/queries';
import Pokemon from '@/types/Pokemon';
import PokemonDetail from '@/types/PokemonDetail';
import parsePokemon from '@/utils/functions/parsePokemon';

export default function FilterScreen() {
  const [pokemonsDropdown, setPokemonsDropdown] = useState<Pokemon[]>([]);
  const [firstPokemon, setFirstPokemon] = useState<PokemonDetail>();
  const [secondPokemon, setSecondPokemon] = useState<PokemonDetail>();
  const [isLeft, setIsLeft] = useState<boolean>();

  const pokemonDropdown = useQuery(GET_POKEMONS_DROPDOWN);
  const [fetchPokemon, pokemon] = useLazyQuery(GET_POKEMON_DETAIL);

  useEffect(() => {
    if (pokemonDropdown.data) {
      const pokemons: Pokemon[] = pokemonDropdown.data.pokemon_v2_pokemon.map((pokemon: any) => ({
        id: pokemon.id,
        name: pokemon.name,
        sprite: "",
      }))

      setPokemonsDropdown(pokemons);
    }
  }, [pokemonDropdown.data])

  useEffect(() => {
    if (pokemon.data) {
      const parsedPokemon = parsePokemon(pokemon.data);
      isLeft ? setFirstPokemon(parsedPokemon) : setSecondPokemon(parsedPokemon);
    }
  }, [pokemon.data])

  function onSelectPokemon(item: Pokemon, isLeft: boolean) {
    fetchPokemon({
      variables: { id: item.id }
    });
    setIsLeft(isLeft)
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.sectionContainer}>
        <Dropdown
            style={styles.dropdown}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
          data={pokemonsDropdown}
            search
            maxHeight={300}
            labelField="name"
            valueField="id"
            searchPlaceholder="Search..."
            value={firstPokemon}
          onChange={(item) => onSelectPokemon(item, true)}
          />
        <Dropdown
            style={styles.dropdown}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
          data={pokemonsDropdown}
            search
            maxHeight={300}
            labelField="name"
            valueField="id"
            searchPlaceholder="Search..."
            value={secondPokemon}
          onChange={(item) => onSelectPokemon(item, false)}
          />
      </ThemedView>

      <ThemedView style={styles.sectionContainer}>
        <Image
          source={firstPokemon?.sprite ?? POKEBALL_IMAGE}
          style={{ width: '50%', height: 200 }}
        />
        <Image
          source={secondPokemon?.sprite ?? POKEBALL_IMAGE}
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
