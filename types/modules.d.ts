// Type declarations for modules missing type definitions

declare module 'lucide-react-native' {
    import { FC } from 'react';
    import { SvgProps } from 'react-native-svg';

    interface IconProps extends SvgProps {
        size?: number;
        color?: string;
        strokeWidth?: number;
    }

    export const Check: FC<IconProps>;
    export const ChevronRight: FC<IconProps>;
    export const ChevronLeft: FC<IconProps>;
    export const Settings: FC<IconProps>;
    export const Calendar: FC<IconProps>;
    export const Home: FC<IconProps>;
    export const BarChart3: FC<IconProps>;
    export const Trash2: FC<IconProps>;
    export const Plus: FC<IconProps>;
    export const X: FC<IconProps>;
    export const Edit3: FC<IconProps>;
    export const Save: FC<IconProps>;
    export const RotateCcw: FC<IconProps>;
    export const Award: FC<IconProps>;
    export const Flame: FC<IconProps>;
    export const Target: FC<IconProps>;
    export const TrendingUp: FC<IconProps>;
    export const TrendingDown: FC<IconProps>;
    export const ArrowLeft: FC<IconProps>;
    export const ArrowRight: FC<IconProps>;
    export const Sun: FC<IconProps>;
    export const Moon: FC<IconProps>;
    export const Minus: FC<IconProps>;
    export const Volume2: FC<IconProps>;
    export const VolumeX: FC<IconProps>;
    export const Bell: FC<IconProps>;
    export const BellOff: FC<IconProps>;
    export const Info: FC<IconProps>;
    // Add more icons as needed
}

declare module '@react-navigation/native' {
    export function useFocusEffect(callback: () => void | (() => void)): void;
    export function useNavigation<T = any>(): T;
    export function useRoute<T = any>(): T;
    export function useIsFocused(): boolean;
}
