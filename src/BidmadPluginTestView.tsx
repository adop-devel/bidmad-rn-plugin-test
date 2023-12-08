import React, { useRef, useEffect, useCallback, useState } from 'react';
import {
  requireNativeComponent,
  UIManager,
  Platform,
  View,
  findNodeHandle,
  NativeEventEmitter
} from 'react-native';

const LINKING_ERROR =
  `The package 'react-native-bidmad-plugin-test' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

const ComponentName = 'BidmadPluginTestView';
const BidmadPluginTestBannerComponent = requireNativeComponent(ComponentName);

const androidEventEmitter = new NativeEventEmitter();

var androidCallbackEvents = {};

class BidmadPluginTestController {
  private bidmadRef: BidmadPluginTestRef;
  private props: BidmadPluginTestProps;

  constructor(bidmadRef: BidmadPluginTestRef, props: BidmadPluginTestProps) {
    this.bidmadRef = bidmadRef;
    this.props = props;
  }

  public load(): void {
    const handle = findNodeHandle(this.bidmadRef.current);
    if (handle) {
      const commandId = UIManager.getViewManagerConfig(ComponentName).Commands
        .load.toString();
      UIManager.dispatchViewManagerCommand(handle, commandId, [handle, this.props.androidZoneId]);
    }
  }
}

type BidmadPluginTestProps = {
  iOSZoneId?: string;
  androidZoneId?: string;
  refreshInterval?: number;
  onControllerCreated?: (controller: BidmadPluginTestController) => void;
  onLoad?: () => void;
  onLoadFail?: (event) => void;
  onClick?: () => void;
};

type BidmadPluginTestRef = React.RefObject<View>;

export const BidmadPluginTestView = (props: BidmadPluginTestProps) => {
  if (UIManager.getViewManagerConfig(ComponentName) == null) {
    throw new Error(LINKING_ERROR);
  }

  const bidmadRef = useRef(null);

  useEffect(() => {
    const controller = new BidmadPluginTestController(bidmadRef, props);
    console.log(findNodeHandle(bidmadRef.current));
    if (props.onControllerCreated) {
      props.onControllerCreated(controller);
    }

    if (Platform.OS === 'android') {
      setAndroidCallbackEvent();
      controller.load();
    }
  }, [props.onControllerCreated]);

  const [bannerWidth, setBannerWidth] = useState<number>(0);
  const [bannerHeight, setBannerHeight] = useState<number>(0);
  const [visibility, setVisibility] = useState<number>(0);

  const loadCallbackWithResizing = useCallback(
    (event: any) => {
      // when sending the load callback event from swift or java to rn-js,
      // width and height arguments must be passed from the event.
      const width = event.nativeEvent.width;
      const height = event.nativeEvent.height;

      if (bannerWidth < width) {
        setBannerWidth(width);
      }

      if (bannerHeight < height) {
        setBannerHeight(height);
      }

      if (visibility < 1) {
        setVisibility(1);
      }

      if (props.onLoad) {
        props.onLoad();
      }
    },
    [props.onLoad]
  );

  const setAndroidCallbackEvent = () => {
    const viewId = findNodeHandle(bidmadRef.current);
    const loadEventKey = 'onLoad_'+viewId;
    if(androidCallbackEvents[loadEventKey] != undefined){
      // DeviceEventEmitter.remove(callbackEvents[loadEventKey]);
      androidCallbackEvents[loadEventKey].remove();
      androidCallbackEvents[loadEventKey] = undefined;
    }

    const loadEvent = androidEventEmitter.addListener(loadEventKey, (params) => {
      console.log("onLoad : ", params);
      androidCallbackEvents[loadEventKey] = loadEvent

      const width = event.nativeEvent.width;
      const height = event.nativeEvent.height;

      if (bannerWidth < width) {
        setBannerWidth(width);
      }

      if (bannerHeight < height) {
        setBannerHeight(height);
      }

      if (visibility < 1) {
        setVisibility(1);
      }

      if (props.onLoad) {
        props.onLoad();
      }
    })

    const loadFailEventKey = 'onLoadFail_'+viewId;
    if(androidCallbackEvents[loadFailEventKey] != undefined){
      // DeviceEventEmitter.remove(callbackEvents[loadFailEventKey]);
      androidCallbackEvents[loadFailEventKey].remove();
      androidCallbackEvents[loadFailEventKey] = undefined;
    }

    const loadFailEvent = androidEventEmitter.addListener(loadFailEventKey, (params) => {
      console.log("onLoad : ", params);
      androidCallbackEvents[loadFailEventKey] = loadEvent

      if (props.onLoadFail) {
        props.onLoadFail();
      }
    })

    const clickEventKey = 'onClick_'+viewId;
    if(androidCallbackEvents[clickEventKey] != undefined){
      // DeviceEventEmitter.remove(callbackEvents[clickEventKey]);
      androidCallbackEvents[clickEventKey].remove();
      androidCallbackEvents[clickEventKey] = undefined;
    }

    const clickEvent = androidEventEmitter.addListener(clickEventKey, (params) => {
      console.log("onLoad : ", params);
      androidCallbackEvents[clickEventKey] = loadEvent

      if (props.onClick) {
        props.onClick();
      }
    })
  }

  const onLayout = (event: any) => {
    console.log("onLayout : ", event);
    const { width, height } = event.nativeEvent.layout;
    setBannerWidth(width);
    setBannerHeight(height);
  };

  if (Platform.OS === 'android') {
    return (
      <View>
        <BidmadPluginTestBannerComponent
          style={{
            opacity: 1,
            width: 320,
            height: 50,
            alignSelf: 'center',
            backgroundColor: 'yellow',
          }}
          {...props}
          zoneId={props.androidZoneId}
          ref={bidmadRef}
          onLayout={onLayout}
        />
      </View> 
    );
  } else if (Platform.OS === 'ios') {
    return (
      <View>
        <BidmadPluginTestBannerComponent
          style={{
            opacity: visibility,
            width: bannerWidth,
            height: bannerHeight,
            alignSelf: 'center',
          }}
          {...props}
          zoneId={props.iOSZoneId}
          onLoad={loadCallbackWithResizing}
          viewId={bidmadRef.current}
          ref={bidmadRef}
          onLayout={onLayout}
        />
      </View>
    );
  } else {
    return <View />;
  }
};

export default BidmadPluginTestView;
