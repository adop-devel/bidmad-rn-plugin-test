import React, {useRef, useEffect} from 'react';
import {
  requireNativeComponent,
  UIManager,
  Platform,
  View,
  findNodeHandle,
  type ViewStyle,
} from 'react-native';

const LINKING_ERROR =
  `The package 'react-native-bidmad-plugin-test' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

const ComponentName = 'BidmadPluginTestView';
const BidmadPluginTestBannerComponent = requireNativeComponent(ComponentName);

class BidmadPluginTestController {
  private bidmadRef: BidmadPluginTestRef;

  constructor(bidmadRef: BidmadPluginTestRef) {
    this.bidmadRef = bidmadRef;
  }

  public load(): void {
    const handle = findNodeHandle(this.bidmadRef.current);
    if (handle) {
      const commandId = UIManager.getViewManagerConfig(ComponentName).Commands.load as number;
      UIManager.dispatchViewManagerCommand(
        handle,
        commandId,
        []
      );
    }
  }
}

type BidmadPluginTestProps = {
  style: ViewStyle;
  iOSZoneId: string;
  androidZoneId: string;
  refreshInterval?: number;
  onControllerCreated?: (controller: BidmadPluginTestController) => void;
  onLoad?: () => void;
  onLoadFail?: () => void;
  onClick?: () => void;
};

type BidmadPluginTestRef = React.RefObject<View>;

export const BidmadPluginTestView = (props: BidmadPluginTestProps) => {
  if (UIManager.getViewManagerConfig(ComponentName) == null) {
    throw new Error(LINKING_ERROR);
  }

  const bidmadRef = useRef(null);

  useEffect(() => {
    if (props.onControllerCreated) {
      const controller = new BidmadPluginTestController(bidmadRef);
      props.onControllerCreated(controller);
    }
  }, [props.onControllerCreated]);

  return <BidmadPluginTestBannerComponent {...props} ref={bidmadRef} />;
};

export default BidmadPluginTestView;
