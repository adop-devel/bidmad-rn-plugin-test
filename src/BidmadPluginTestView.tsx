import React, {useRef, useEffect, useCallback, useState} from 'react';
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

  const [bannerWidth, setBannerWidth] = useState<number>(0);
  const [bannerHeight, setBannerHeight] = useState<number>(0);

  const loadCallbackWithResizing = useCallback((event: any) => {
    const width = event.nativeEvent.width;
    const height = event.nativeEvent.height;

    if (bannerWidth < width) {
      setBannerWidth(width);
    }

    if (bannerHeight < height) {
      setBannerHeight(height);
    }

    if (props.onLoad) {
      props.onLoad();
    }
  }, [props.onLoad]);

  const onLayout = (event: any) => {
    const {width, height} = event.nativeEvent.layout;
    setBannerWidth(width);
    setBannerHeight(height);
  };

  return <BidmadPluginTestBannerComponent style={{
    width: bannerWidth,
    height: bannerHeight,
    alignSelf: 'center',
  }} {...props} onLoad={loadCallbackWithResizing} ref={bidmadRef} onLayout={onLayout} />;
};

export default BidmadPluginTestView;
