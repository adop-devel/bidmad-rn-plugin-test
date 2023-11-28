import {
  requireNativeComponent,
  UIManager,
  Platform,
  type ViewStyle,
} from 'react-native';

const LINKING_ERROR =
  `The package 'react-native-bidmad-plugin-test' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

type BidmadPluginTestProps = {
  color: string;
  style: ViewStyle;
  onLoad?: () => void;
  onLoadFail?: () => void;
  onClick?: () => void;
};

const ComponentName = 'BidmadPluginTestView';

export const BidmadPluginTestView =
  UIManager.getViewManagerConfig(ComponentName) != null
    ? requireNativeComponent<BidmadPluginTestProps>(ComponentName)
    : () => {
        throw new Error(LINKING_ERROR);
      };
