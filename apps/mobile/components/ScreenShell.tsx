import { View, type ViewProps } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface ScreenShellProps extends ViewProps {
  children: React.ReactNode;
}

export function ScreenShell({ children, style, ...props }: ScreenShellProps) {
  return (
    <SafeAreaView className="flex-1 bg-ground">
      <View className="flex-1" style={style} {...props}>
        {children}
      </View>
    </SafeAreaView>
  );
}
