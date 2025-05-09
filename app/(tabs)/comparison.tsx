import { useLazyQuery, useQuery } from '@apollo/client';
import { Image } from 'expo-image';
import { useEffect, useState } from 'react';
import { ColorValue, StyleSheet, View, ViewStyle } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { POKEBALL_IMAGE } from '@/constants/Images';
import { GET_POKEMON_DETAIL, GET_POKEMONS_DROPDOWN } from '@/graphql/queries';
import Pokemon from '@/types/Pokemon';
import PokemonDetail from '@/types/PokemonDetail';
import getStatLabel from '@/utils/functions/getStatLabel';
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
        <PokemonDropdown pokemonsDropdown={pokemonsDropdown} selectedPokemon={firstPokemon} onSelect={(item) => onSelectPokemon(item, true)} />
        <PokemonDropdown pokemonsDropdown={pokemonsDropdown} selectedPokemon={secondPokemon} onSelect={(item) => onSelectPokemon(item, false)} />
      </ThemedView>

      <ThemedView style={styles.sectionContainer}>
        <PokemonImage image={firstPokemon?.sprite} />
        <PokemonImage image={secondPokemon?.sprite} />
      </ThemedView>

      {firstPokemon && secondPokemon && firstPokemon.stats.map((stat, index) => {
        const name = stat.name
        const pokemon1Value = stat.base_stat
        const pokemon2Value = secondPokemon.stats[index].base_stat

        return (
          <View key={name}>
            <ThemedText style={styles.statName}>{getStatLabel(name)}</ThemedText>
            <ThemedView style={[styles.sectionContainer, styles.statsContainer]}>
              <PokemonStats key={pokemon1Value} value={pokemon1Value} backgroundColor='#444' containerStyle={{ flexDirection: 'row-reverse' }} />
              <PokemonStats key={pokemon2Value} value={pokemon2Value} backgroundColor='#999' />
            </ThemedView>
          </View>
        )
      })}
    </ThemedView>
  );
}

function PokemonDropdown({
  pokemonsDropdown,
  selectedPokemon,
  onSelect
}: {
  pokemonsDropdown: Pokemon[]
  selectedPokemon?: PokemonDetail
  onSelect: (item: Pokemon) => void
}) {
  return (
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
      value={selectedPokemon}
      onChange={onSelect}
    />
  )
}

function PokemonImage({ image }: { image?: string }) {
  return (
    <Image
      source={image ?? POKEBALL_IMAGE}
      style={styles.pokemonImage}
    />
  )
}

function PokemonStats({ value, containerStyle, backgroundColor }: { value: number, containerStyle?: ViewStyle, backgroundColor: ColorValue }) {
  return (
    <ThemedView style={[styles.statContainer, containerStyle,]}>
      <ThemedText
        style={[
          styles.statBar,
          styles.statName,
          styles.statValue,
          {
            width: `${value}%`,
            backgroundColor,
          },
        ]}
      >
        {value}
      </ThemedText>
    </ThemedView>
  )
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
  pokemonImage: {
    width: '50%',
    height: 200,
  },
  statsContainer: {
    width: `100%`,
    backgroundColor: '#ddd',
    borderRadius: 5,
  },
  statContainer: {
    width: `50%`,
  },
  statBar: {
    backgroundColor: '#00ffff',
    borderRadius: 5,
    position: 'relative',
    borderBottomLeftRadius: 0,
    borderTopLeftRadius: 0,
  },
  statName: { textAlign: 'center' },
  statValue: { paddingVertical: 4 },
});
