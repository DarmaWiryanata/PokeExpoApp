import { ActivityIndicator, StyleSheet } from "react-native";

export function LoadingIndicator() {
  return (
    <ActivityIndicator style={styles.loading} />
  )
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    margin: 10,
    paddingLeft: 10,
    borderRadius: 5,
  },
});