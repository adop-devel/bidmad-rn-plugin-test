import React, { useRef, useEffect, useCallback, useState } from 'react';
import {
  requireNativeComponent,
  UIManager,
  Platform,
  View,
  findNodeHandle,
  NativeEventEmitter,
  Text
} from 'react-native';

export const BidmadBannarSize = {
    BANNER: '320x50',
    LARGE_BANNER: '320x100',
    MREC: '300x250'
} as const;

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
  bannerSize?: BidmadBannarSize;
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

  var width;
  var height;
  if(props.bannerSize == BidmadBannarSize.MREC){
    width = 300;
    height = 250;
  }else if(props.bannerSize == BidmadBannarSize.LARGE_BANNER) {
    width = 320;
    height = 100;
  }else {
    width = 320;
    height = 50;
  }

  const [bannerWidth, setBannerWidth] = useState<number>(width);
  const [bannerHeight, setBannerHeight] = useState<number>(height);

  const bidmadRef = useRef(null);

  useEffect(() => {
    const controller = new BidmadPluginTestController(bidmadRef, props);
    if (props.onControllerCreated) {
      props.onControllerCreated(controller);
    }

    const viewId = findNodeHandle(bidmadRef.current);

    if (Platform.OS === 'android') {
      setAndroidCallbackEvent(viewId);
      controller.load();
    }

    return () => {
      if (Platform.OS === 'android') {
        removeAndroidCallbackEvent(viewId);
      }
    };
  }, [props.onControllerCreated]);

  const setAndroidCallbackEvent = (viewId) => {
    const loadEventKey = 'onLoad_'+viewId;
    if(androidCallbackEvents[loadEventKey] != undefined){
      androidCallbackEvents[loadEventKey].remove();
      androidCallbackEvents[loadEventKey] = undefined;
    }

    const loadEvent = androidEventEmitter.addListener(loadEventKey, (params) => {
      androidCallbackEvents[loadEventKey] = loadEvent

      if (props.onLoad) {
        props.onLoad();
      }
    });

    const loadFailEventKey = 'onLoadFail_'+viewId;
    if(androidCallbackEvents[loadFailEventKey] != undefined){
      androidCallbackEvents[loadFailEventKey].remove();
      androidCallbackEvents[loadFailEventKey] = undefined;
    }

    const loadFailEvent = androidEventEmitter.addListener(loadFailEventKey, (params) => {
      androidCallbackEvents[loadFailEventKey] = loadEvent

      if (props.onLoadFail) {
        props.onLoadFail();
      }
    })

    const clickEventKey = 'onClick_'+viewId;
    if(androidCallbackEvents[clickEventKey] != undefined){
      androidCallbackEvents[clickEventKey].remove();
      androidCallbackEvents[clickEventKey] = undefined;
    }

    const clickEvent = androidEventEmitter.addListener(clickEventKey, (params) => {
      androidCallbackEvents[clickEventKey] = loadEvent

      if (props.onClick) {
        props.onClick();
      }
    })
  }

  const removeAndroidCallbackEvent = (viewId) => {
    const loadEventKey = 'onLoad_'+viewId;
    if(androidCallbackEvents[loadEventKey] != undefined){
      androidCallbackEvents[loadEventKey].remove();
      androidCallbackEvents[loadEventKey] = undefined;
    }

    const loadFailEventKey = 'onLoadFail_'+viewId;
    if(androidCallbackEvents[loadFailEventKey] != undefined){
      androidCallbackEvents[loadFailEventKey].remove();
      androidCallbackEvents[loadFailEventKey] = undefined;
    }

    const clickEventKey = 'onClick_'+viewId;
    if(androidCallbackEvents[clickEventKey] != undefined){
      androidCallbackEvents[clickEventKey].remove();
      androidCallbackEvents[clickEventKey] = undefined;
    }
  }

  if (Platform.OS === 'android') {
    return (
      <View>
        <BidmadPluginTestBannerComponent
          style={{
            width: bannerWidth,
            height: bannerHeight,
            alignSelf: 'center',
          }}
          {...props}
          zoneId={props.androidZoneId}
          ref={bidmadRef}
        />
      </View> 
    );
  } else if (Platform.OS === 'ios') {
    return (
      <View>
        <BidmadPluginTestBannerComponent
          style={{
            width: bannerWidth,
            height: bannerHeight,
            alignSelf: 'center',
          }}
          {...props}
          zoneId={props.iOSZoneId}
          ref={bidmadRef}
        />
      </View>
    );
  } else {
    return <View />;
  }
};

export default BidmadPluginTestView;
