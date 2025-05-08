import { Image } from 'expo-image';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, useColorScheme, View } from 'react-native';

import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { GET_POKEMONS } from '@/graphql/queries';
import { useLazyQuery } from '@apollo/client';
import { useNavigation } from 'expo-router';

interface Pokemon {
  id: number;
  name: string;
  sprite: string;
}

export default function HomeScreen() {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [showSearchBar, setShowSearchBar] = useState<boolean>(false);
  const searchInput = useRef<TextInput>(null)
  const navigation = useNavigation();

  const [searchItems, { data, loading, error, fetchMore }] = useLazyQuery(GET_POKEMONS, {
    variables: {
      limit: 20,
      offset: 0,
      name: `%%`,
    },
  });

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => <HeaderRightItem onPress={() => setShowSearchBar(prev => !prev)} />,
    });
    searchItems();
  }, []);

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

  function onSearch(input: string) {
    searchItems({ variables: { name: `%${input}%` } });
  }

  return (
    <View>
      {showSearchBar && (
        <TextInput
          ref={searchInput}
          placeholder="Search"
          style={{
            height: 40,
            borderColor: 'gray',
            borderWidth: 1,
            margin: 10,
            paddingLeft: 10,
            borderRadius: 5,
          }}
          autoCapitalize='none'
          autoCorrect={false}
          onChangeText={onSearch}
        />
      )}

      {loading && <ActivityIndicator style={styles.loading} />}

      {error && <Text>Error: {error.message}</Text>}

      {!loading && !error && (
        <FlatList
          data={pokemons}
          keyExtractor={(item: Pokemon) => item.id.toString()}
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
      )}
    </View>
  );
}

function HeaderRightItem({ onPress }: { onPress: () => void }) {
  const colorScheme = useColorScheme();

  return (
    <TouchableOpacity onPress={onPress}>
      <IconSymbol size={28} name="magnifyingglass" color={Colors[colorScheme ?? 'light'].icon} style={styles.headerRightItem} />
    </TouchableOpacity>
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
        <Text style={{ textAlign: 'center' }}>{name}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerRightItem: {
    marginRight: 10,
  },
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
