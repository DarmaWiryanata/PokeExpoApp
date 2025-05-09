import { GET_POKEMONS } from '@/graphql/queries';
import { useQuery } from '@apollo/client';
import { router, useNavigation } from 'expo-router';
import { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, TextInput } from 'react-native';

import Error from '@/components/Error';
import HeaderRightItem from '@/components/HeaderRightItem';
import LoadingIndicator from '@/components/LoadingIndicator';
import PokemonCard from '@/components/PokemonCard';
import { ThemedView } from '@/components/ThemedView';
import Icons from '@/constants/Icons';
import { FilterContext } from '@/stores';
import Pokemon from '@/types/Pokemon';

export default function HomeScreen() {
  const navigation = useNavigation();
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [showSearchBar, setShowSearchBar] = useState<boolean>(false);
  const { searchInput, selectedSort, selectedType, setSearchInput } = useContext(FilterContext);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <ThemedView style={styles.headerRightItemsContainer}>
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
    <ThemedView style={styles.container}>
      {showSearchBar && (
        <TextInput
          placeholder="Search"
          style={styles.textInput}
          onChangeText={(input: string) => setSearchInput(input)}
        />
      )}

      {loading && <LoadingIndicator />}

      {error && <Error message={error.message} />}

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

const styles = StyleSheet.create({
  headerRightItemsContainer: { flexDirection: 'row' },
  container: { flex: 1 },
  textInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    margin: 10,
    paddingLeft: 10,
    borderRadius: 5,
  },
});
