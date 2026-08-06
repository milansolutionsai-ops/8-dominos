import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Calendar, Home, Settings } from 'lucide-react-native';
import { colors, fonts, radius, spacing, elevation } from '@/constants/theme';

interface CustomTabBarProps {
  state: any;
  descriptors: any;
  navigation: any;
}

export default function CustomTabBar({ state, descriptors, navigation }: CustomTabBarProps) {
  const insets = useSafeAreaInsets();
  const getIcon = (routeName: string, focused: boolean) => {
    const size = 24;
    const strokeWidth = focused ? 2.5 : 2;
    const color = focused ? colors.onAccent : colors.textMuted;

    switch (routeName) {
      case 'index':
        return <Home size={size} color={color} strokeWidth={strokeWidth} />;
      case 'weekly':
        return <Calendar size={size} color={color} strokeWidth={strokeWidth} />;
      case 'settings':
        return <Settings size={size} color={color} strokeWidth={strokeWidth} />;
      default:
        return <Home size={size} color={color} strokeWidth={strokeWidth} />;
    }
  };

  const getLabel = (routeName: string) => {
    switch (routeName) {
      case 'index':
        return 'Daily';
      case 'weekly':
        return 'Weekly';
      case 'settings':
        return 'Settings';
      default:
        return '';
    }
  };

  return (
    <View
      style={[
        styles.tabBarContainer,
        { paddingBottom: Math.max(insets.bottom, 12), paddingTop: 0 },
      ]}
    >
      {state.routes.map((route: any, index: number) => {
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            preventDefault: () => { },
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        const label = getLabel(route.name);

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.tabButton}
            activeOpacity={0.7}
            accessibilityRole="tab"
            accessibilityLabel={label}
            accessibilityState={{ selected: isFocused }}
          >
            <View
              style={[
                styles.iconContainer,
                isFocused && styles.focusedIconContainer,
              ]}
            >
              {getIcon(route.name, isFocused)}
            </View>
            <Text
              style={[
                styles.tabLabel,
                {
                  color: isFocused ? colors.textPrimary : colors.textMuted,
                  fontFamily: isFocused ? fonts.bold : fonts.semibold,
                },
              ]}
            >
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceAlt,
    borderTopColor: colors.border,
    borderTopWidth: 1,
    paddingHorizontal: 8,
    ...elevation.md,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: spacing.sm,
    paddingBottom: spacing.xs,
  },
  iconContainer: {
    width: 40,
    height: 34,
    borderRadius: radius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  focusedIconContainer: {
    backgroundColor: colors.accent,
    ...elevation.accentGlow,
  },
  tabLabel: {
    fontSize: 11,
    // Was 16, roughly 4x the platform norm, which is why the labels read as
    // detached from their icons.
    marginTop: spacing.xs,
    textAlign: 'center',
  },
});
