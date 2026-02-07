import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Calendar, Home, Settings } from 'lucide-react-native';

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
    const color = focused ? '#000000' : '#6b7280';

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
        const { options } = descriptors[route.key];

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
          >
            <View
              style={[
                styles.iconContainer,
                isFocused && styles.focusedIconContainer,
              ]}
            >
              {getIcon(route.name, isFocused)}
              {isFocused && <View style={styles.indicatorLine} />}
            </View>
            <Text
              style={[
                styles.tabLabel,
                {
                  color: isFocused ? '#000000' : '#6b7280',
                  fontWeight: isFocused ? '800' : '600',
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
    backgroundColor: '#fffbea',
    borderTopColor: '#000000',
    borderTopWidth: 2,
    paddingHorizontal: 8,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 18, // Pushed down even further as requested
    paddingBottom: 4,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  focusedIconContainer: {
    backgroundColor: '#fedd14',
    borderWidth: 2,
    borderColor: '#000000',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  indicatorLine: {
    position: 'absolute',
    bottom: 4, // Moved up slightly to avoid hugging the edge
    width: 32,
    height: 3,
    backgroundColor: '#000000',
    borderRadius: 1.5,
  },
  tabLabel: {
    fontSize: 11,
    marginTop: 16, // Maximum breathing room between indicator and label
    textAlign: 'center',
    fontWeight: '800',
  },
});
