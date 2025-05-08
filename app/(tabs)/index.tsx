import { Image } from 'expo-image';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, useColorScheme } from 'react-native';

import { ThemedView } from '@/components/ThemedView';
import { IconSymbol, IconSymbolName } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { GET_POKEMONS } from '@/graphql/queries';
import { useLazyQuery } from '@apollo/client';
import { Link, router, useLocalSearchParams, useNavigation } from 'expo-router';

export interface Pokemon {
  id: number;
  name: string;
  sprite: string;
}

export default function HomeScreen() {
  const { sort, type } = useLocalSearchParams();
  const navigation = useNavigation();
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [showSearchBar, setShowSearchBar] = useState<boolean>(false);
  const searchInput = useRef<TextInput>(null);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <ThemedView style={{ flexDirection: 'row' }}>
          <HeaderRightItem icon="line.horizontal.3.decrease" onPress={() => router.navigate('/filter')} />
          <HeaderRightItem icon="magnifyingglass" onPress={() => setShowSearchBar(prev => !prev)} />
        </ThemedView>
      ),
    });
    filterItems();
  }, []);

  const [filterItems, { data, loading, error, fetchMore }] = useLazyQuery(GET_POKEMONS, {
    variables: {
      limit: 20,
      nameFilter: {},
      offset: 0,
      typeFilter: {},
      sort: { id: 'asc' },
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

  useEffect(() => {
    filterItems({
      variables: {
        sort: { [sort?.toString() ?? 'id']: 'asc' },
        typeFilter: type && type !== "0" ? { type_id: { _eq: type } } : {},
      }
    });
  }, [sort, type]);

  function onSearch(input: string) {
    filterItems({ variables: { nameFilter: input !== '' ? { _ilike: `%${input}%` } : {} } });
  }

  return (
    <ThemedView>
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
    </ThemedView>
  );
}

function HeaderRightItem({ icon, onPress }: { icon: IconSymbolName, onPress: () => void }) {
  const colorScheme = useColorScheme();

  return (
    <TouchableOpacity onPress={onPress}>
      <IconSymbol size={28} name={icon} color={Colors[colorScheme ?? 'light'].icon} style={styles.headerRightItem} />
    </TouchableOpacity>
  );
}

function PokemonCard({ pokemon }: { pokemon: Pokemon }) {
  const { id, name, sprite } = pokemon;
  const POKEBALL_IMAGE = 'https://icon-library.com/images/small-pokeball-icon/small-pokeball-icon-4.jpg';

  return (
    <Link
      style={styles.cardContainer}
      href={{
        pathname: '/pokemon/[id]',
        params: { id, name }
      }}
    >
      <ThemedView style={styles.cardHeader}>
        <Image
          source={POKEBALL_IMAGE}
          style={{ width: 40, height: 40 }}
        />
        <Text>{id}</Text>
      </ThemedView>
      <ThemedView style={styles.cardContent}>
        <Image
          source={sprite}
          style={{ width: 100, height: 100 }}
        />
        <Text style={{ textAlign: 'center' }}>{name}</Text>
      </ThemedView>
    </Link>
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
