import { Image } from 'expo-image';
import { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, useColorScheme } from 'react-native';

import { ThemedView } from '@/components/ThemedView';
import { IconSymbol, IconSymbolName } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import Icons from '@/constants/Icons';
import { POKEBALL_IMAGE } from '@/constants/Images';
import { GET_POKEMONS } from '@/graphql/queries';
import { FilterContext } from '@/stores';
import { useQuery } from '@apollo/client';
import { Link, router, useNavigation } from 'expo-router';

export interface Pokemon {
  id: number;
  name: string;
  sprite: string;
}

export default function HomeScreen() {
  const navigation = useNavigation();
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [showSearchBar, setShowSearchBar] = useState<boolean>(false);
  const { searchInput, selectedSort, selectedType, setSearchInput } = useContext(FilterContext);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <ThemedView style={{ flexDirection: 'row' }}>
          <HeaderRightItem icon={Icons.FilterList} onPress={() => router.navigate('/filter')} />
          <HeaderRightItem icon={Icons.Search} onPress={() => setShowSearchBar(prev => !prev)} />
        </ThemedView>
      ),
    });
  }, []);

  const { data, loading, error, fetchMore, refetch } = useQuery(GET_POKEMONS, {
    variables: {
      limit: 20,
      nameFilter: { _ilike: `%${searchInput}%` },
      offset: 0,
      typeFilter: selectedType !== 0 ? { type_id: { _eq: selectedType } } : {},
      sort: { [selectedSort]: 'asc' },
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
    refetch();
  }, [searchInput, selectedSort, selectedType]);

  return (
    <ThemedView>
      {showSearchBar && (
        <TextInput
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
          onChangeText={(input: string) => setSearchInput(input)}
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
