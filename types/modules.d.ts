// Type declarations for modules missing type definitions.
// NOTE: lucide-react-native ships its own complete types (dist/lucide-react-native.d.ts),
// so we do NOT declare it here — a hand-maintained subset would shadow the real types and
// break any icon not in the list. Import icons directly from 'lucide-react-native'.

declare module '@react-navigation/native' {
    export function useFocusEffect(callback: () => void | (() => void)): void;
    export function useNavigation<T = any>(): T;
    export function useRoute<T = any>(): T;
    export function useIsFocused(): boolean;
}
