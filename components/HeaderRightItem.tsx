import { Colors } from "@/constants/Colors";
import { StyleSheet, TouchableOpacity, useColorScheme } from "react-native";
import { IconSymbol, IconSymbolName } from "./ui/IconSymbol";

export default function HeaderRightItem({ icon, onPress }: { icon: IconSymbolName, onPress: () => void }) {
  const colorScheme = useColorScheme();

  return (
    <TouchableOpacity onPress={onPress}>
      <IconSymbol size={28} name={icon} color={Colors[colorScheme ?? 'light'].icon} style={styles.headerRightItem} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  headerRightItem: {
    marginRight: 10,
  },
});
