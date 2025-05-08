import { Image } from 'expo-image';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';

import { GET_POKEMONS } from '@/graphql/queries';
import { useQuery } from '@apollo/client';

interface Pokemon {
  id: number;
  name: string;
  sprite: string;
}

export default function HomeScreen() {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);

  const { data, loading, error, fetchMore } = useQuery(GET_POKEMONS, {
    variables: {
      limit: 20,
      offset: 0,
    },
  });

  useEffect(() => {
    if (data) {
      const pokemons: Pokemon[] = data.pokemon_v2_pokemon.map((pokemon: any) => ({
        id: pokemon.id,
        name: pokemon.name,
        sprite: pokemon.pokemon_v2_pokemonsprites[0]?.sprites ?? "",
      }))

      setPokemons(pokemons);
    }
  }, [data])

  if (loading) {
    return <ActivityIndicator style={styles.loading} />;
  }

  if (error) {
    return <Text>Error: {error.message}</Text>;
  }

  return (
    <View>
      <FlatList
        data={pokemons}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <PokemonCard pokemon={item} />}
        numColumns={2}
        onEndReachedThreshold={0.8}
        onEndReached={() => {
          fetchMore({
            variables: {
              offset: pokemons.length,
            },
          })
        }}
        ListFooterComponent={loading ? <ActivityIndicator /> : null}
      />
    </View>
  );
}

function PokemonCard({ pokemon }: { pokemon: Pokemon }) {
  const { id, name, sprite } = pokemon;
  const POKEBALL_IMAGE = 'https://icon-library.com/images/small-pokeball-icon/small-pokeball-icon-4.jpg';

  return (
    <View style={styles.cardContainer}>
      <View style={styles.cardHeader}>
        <Image
          source={POKEBALL_IMAGE}
          style={{ width: 40, height: 40 }}
        />
        <Text>{id}</Text>
      </View>
      <View style={styles.cardContent}>
        <Image
          source={sprite}
          style={{ width: 100, height: 100 }}
        />
        <Text>{name}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    margin: 5,
    backgroundColor: '#fff',
  },
  cardHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#ccc',
    width: "100%",
    paddingHorizontal: 10,
    paddingBottom: 5,
    alignItems: 'center',
  },
  cardContent: {
    paddingTop: 5,
  },
});
