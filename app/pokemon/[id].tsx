import { useQuery } from '@apollo/client';
import { Image } from 'expo-image';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';

import { Error } from '@/components/Error';
import { LoadingIndicator } from '@/components/LoadingIndicator';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { POKEBALL_IMAGE } from '@/constants/Images';
import { GET_POKEMON_DETAIL } from '@/graphql/queries';
import PokemonDetail from '@/types/PokemonDetail';
import PokemonStat from '@/types/PokemonStat';
import PokemonType from '@/types/PokemonType';

export default function DetailScreen() {
  const { id, name } = useLocalSearchParams();
  const navigation = useNavigation();
  const [pokemon, setPokemon] = useState<PokemonDetail>();
  const { data, loading, error } = useQuery(GET_POKEMON_DETAIL, { variables: { id } });
  
  useEffect(() => {
    navigation.setOptions({
      headerTitle: name,
    });
  }, []);

  useEffect(() => {
    if (data) {
      const {
        id,
        name,
        height,
        weight,
        pokemon_v2_pokemonsprites,
        pokemon_v2_pokemontypes,
        pokemon_v2_pokemonstats,
        pokemon_v2_pokemonabilities
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

      const abilities: PokemonAbility[] = pokemon_v2_pokemonabilities.map((ability: any) => ({
        name: ability.pokemon_v2_ability.name,
        slot: ability.slot,
        is_hidden: ability.is_hidden,
      })).sort((a: PokemonAbility, b: PokemonAbility) => (a.slot < b.slot ? -1 : 1));

      const { officialSprite, defaultSprite }: any = pokemon_v2_pokemonsprites[0];
      const selectedPokemon: PokemonDetail = {
        id,
        name,
        height,
        weight,
        sprite: officialSprite ?? defaultSprite,
        types,
        stats,
        abilities,
      }

      setPokemon(selectedPokemon);
    }
  }, [data])

  return (
    <ThemedView style={styles.container}>
      {loading && <LoadingIndicator />}

      {error && <Error message={error.message} />}

      {pokemon && (
        <ThemedView>
          <Image
            source={{ uri: pokemon.sprite }}
            style={styles.pokemonImage}
          />
          <ThemedView style={styles.profileContainer}>
            <PokemonID id={pokemon.id} />
            <PokemonTypes types={pokemon.types} />
            <PokemonStats stats={pokemon.stats} />
          </ThemedView>
        </ThemedView>
      )}
    </ThemedView>
  );
}

function PokemonID({ id }: { id: number }) {
  return (
    <ThemedView style={styles.quickProfileContainer}>
      <Image
        source={POKEBALL_IMAGE}
        style={{ width: 40, height: 40 }}
      />
      <ThemedText type='title'>{id}</ThemedText>
    </ThemedView>
  )
}

function PokemonTypes({ types }: { types: PokemonType[] }) {
  return (
    <ThemedView style={styles.quickProfileContainer}>
      {types.map(({ name, slot }) => (
        <ThemedText
          type='subtitle'
          style={styles.typePill}
          key={slot}
        >{name}</ThemedText>
      ))}
    </ThemedView>
  )
}

function PokemonStats({ stats }: { stats: PokemonStat[] }) {
  return (
    <>
      {stats.map(({ name, base_stat }) => (
        <ThemedView key={name}>
          <ThemedText type='defaultSemiBold'>{name}</ThemedText>
          <ThemedView style={styles.statContainer}>
            <ThemedView style={styles.statBar}>
              <ThemedText
                style={[styles.statValue, { width: `${base_stat}%` }]}
              >{base_stat}</ThemedText>
            </ThemedView>
          </ThemedView>
        </ThemedView>
      ))}
    </>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  pokemonImage: {
    width: "100%",
    height: 300,
  },
  profileContainer: { padding: 10 },
  quickProfileContainer: {
    flexDirection: 'row',
    width: "100%",
    paddingBottom: 5,
    alignItems: 'center',
  },
  typePill: {
    backgroundColor: '#aaa',
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginRight: 5,
    marginBottom: 5,
    fontWeight: '500',
  },
  statContainer: {
    width: `100%`,
    backgroundColor: '#ddd',
    borderRadius: 5,
  },
  statBar: {
    backgroundColor: '#00ffff',
    borderRadius: 5,
    position: 'relative',
  },
  statValue: {
    textAlign: 'center',
    paddingVertical: 4
  },
});
