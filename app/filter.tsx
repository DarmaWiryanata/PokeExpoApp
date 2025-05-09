import Checkbox from 'expo-checkbox';
import { useNavigation } from 'expo-router';
import { useContext, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { GET_POKEMON_TYPES } from '@/graphql/queries';
import { FilterContext } from '@/stores';
import { useQuery } from '@apollo/client';

interface PokemonType {
  id: number;
  name: string;
}

export default function FilterScreen() {
  const navigation = useNavigation();
  const [types, setTypes] = useState<PokemonType[]>([{ id: 0, name: 'All' }]);
  const { selectedSort, selectedType, setSelectedSort, setSelectedType } = useContext(FilterContext);

  useEffect(() => {
    navigation.setOptions({
      title: 'Filter & Sort',
      headerBackTitle: 'Back',
    });
  }, []);

  const { data } = useQuery(GET_POKEMON_TYPES);

  useEffect(() => {
    if (data) {
      setTypes(prev => [...prev, ...data.pokemon_v2_type]);
    }
  }, [data])

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.sectionContainer}>
        <FilterTypeLabel title='Sort' />
        <ThemedView style={styles.checkboxItemsContainer}>
          <CheckboxItem label='ID' value='id' selectedSort={selectedSort} onValueChange={() => setSelectedSort('id')} />
          <CheckboxItem label='name' value='name' selectedSort={selectedSort} onValueChange={() => setSelectedSort('name')} />      
        </ThemedView>
      </ThemedView>

      <ThemedView style={styles.sectionContainer}>
        <FilterTypeLabel title='Filter by type' />
        <Dropdown
          style={styles.dropdown}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          data={types}
          search
          maxHeight={300}
          labelField="name"
          valueField="id"
          searchPlaceholder="Search..."
          value={selectedType}
          onChange={item => {
            setSelectedType(item.id);
          }}
        />
      </ThemedView>
    </ThemedView>
  );
}

function FilterTypeLabel({ title }: { title: string }) {
  return (
    <ThemedText type='defaultSemiBold'>{title}</ThemedText>
  )
}

function CheckboxItem({ label, value, selectedSort, onValueChange }: { label: string, value: string, selectedSort?: string, onValueChange: (value: string) => void }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Checkbox style={styles.checkbox} value={selectedSort === value} onValueChange={() => onValueChange(value)} />
      <ThemedText>By {label}</ThemedText>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sectionContainer: {
    margin: 8
  },
  checkboxItemsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dropdown: {
    height: 50,
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
  checkbox: {
    margin: 8,
  },
});
