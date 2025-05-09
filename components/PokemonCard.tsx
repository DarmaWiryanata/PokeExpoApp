import { POKEBALL_IMAGE } from "@/constants/Images";
import Pokemon from "@/types/Pokemon";
import { Image } from "expo-image";
import { router } from "expo-router";
import { StyleSheet, TouchableOpacity } from "react-native";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";

export default function PokemonCard({ pokemon }: { pokemon: Pokemon }) {
  const { id, name, sprite } = pokemon;

  return (
    <TouchableOpacity
      style={styles.cardContainer}
      onPress={() => router.navigate({
        pathname: '/pokemon/[id]',
        params: { id, name }
      })}
    >
      <ThemedView style={styles.cardHeader}>
        <Image
          source={POKEBALL_IMAGE}
          style={{ width: 40, height: 40 }}
        />
        <ThemedText type='subtitle'>{id}</ThemedText>
      </ThemedView>
      <ThemedView style={styles.cardContent}>
        <Image
          source={sprite}
          style={{ width: 100, height: 100, alignSelf: 'center' }}
        />
        <ThemedText style={styles.nameLabel}>{name}</ThemedText>
      </ThemedView>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
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
  nameLabel: { textAlign: 'center' },
});