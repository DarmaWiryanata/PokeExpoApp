import { useQuery } from '@apollo/client';
import { Image } from 'expo-image';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { POKEBALL_IMAGE } from '@/constants/Images';
import { GET_POKEMON_DETAIL } from '@/graphql/queries';
import { Pokemon } from '../(tabs)';

export interface PokemonDetail extends Pokemon {
  height: number;
  weight: number;
  officialArtworkSprite?: string;
  growthRate: string;
  types: PokemonType[];
  stats: PokemonStat[];
  abilities: PokemonAbility[];
}

export interface PokemonType {
  name: string;
  slot: number;
}

export interface PokemonStat {
  name: string;
  base_stat: number;
  effort: number;
}

export interface PokemonAbility {
  name: string;
  slot: number;
  is_hidden: boolean;
}

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
        pokemon_v2_pokemonspecy,
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

      setPokemon(selectedPokemon);
    }
  }, [data])

  return (
    <ThemedView>
      {loading && <ActivityIndicator style={styles.loading} />}

      {error && <ThemedText>Error: {error.message}</ThemedText>}

      {pokemon && (
        <ThemedView>
          <Image
            source={{ uri: pokemon.officialArtworkSprite}}
            style={styles.pokemonImage}
          />
          <ThemedView style={{ padding: 10 }}>
            <ThemedView style={styles.cardHeader}>
              <Image
                source={POKEBALL_IMAGE}
                style={{ width: 40, height: 40 }}
              />
              <ThemedText type='title'>{pokemon.id}</ThemedText>
            </ThemedView>
            <ThemedView style={styles.cardHeader}>
              {pokemon.types.map(({ name, slot }) => (
                <ThemedText
                  type='subtitle'
                  style={styles.typePill}
                  key={slot}
                >{name}</ThemedText>
              ))}
            </ThemedView>
            <ThemedView>
              {pokemon.stats.map(({ name, base_stat }) => (
                <ThemedView key={name}>
                  <ThemedText>{name}</ThemedText>
                  <ThemedView style={styles.statContainer}>
                    <ThemedView style={styles.statBar}>
                      <ThemedText
                        style={{ width: `${base_stat}%`, ...styles.statValue }}
                      >{base_stat}</ThemedText>
                    </ThemedView>
                  </ThemedView>
                </ThemedView>
              ))}
            </ThemedView>
          </ThemedView>
        </ThemedView>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardHeader: {
    flexDirection: 'row',
    width: "100%",
    paddingBottom: 5,
    alignItems: 'center',
  },
  pokemonImage: {
    width: "100%",
    height: 300,
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
