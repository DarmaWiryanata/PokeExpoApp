import { SAD_POKEMON_IMAGE } from "@/constants/Images";
import { Image } from "expo-image";
import { StyleSheet } from "react-native";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";

export function Error({ message }: { message: string }) {
  return (
    <ThemedView style={styles.container}>
      <Image
        source={SAD_POKEMON_IMAGE}
        style={{ width: 280, height: 330 }}
      />
      <ThemedView style={{ marginTop: 20, marginHorizontal: 8 }}>
        <ThemedText type='title' style={styles.label}>An error occured</ThemedText>
        <ThemedText style={styles.label}>{message}</ThemedText>
      </ThemedView>
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  label: {
    textAlign: 'center',
  },
});
