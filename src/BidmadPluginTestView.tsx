import React, { useRef, useEffect, useCallback, useState } from 'react';
import {
  requireNativeComponent,
  UIManager,
  Platform,
  View,
  findNodeHandle,
  NativeEventEmitter
} from 'react-native';

export const BidmadBannerSize = {
    BANNER: '320x50',
    LARGE_BANNER: '320x100',
    MREC: '300x250'
} as const;

export type BidmadBannerSizeType = typeof BidmadBannerSize[keyof typeof BidmadBannerSize];

const LINKING_ERROR =
  `The package 'react-native-bidmad-plugin-test' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

const ComponentName = 'BidmadPluginTestView';
const BidmadPluginTestBannerComponent = requireNativeComponent(ComponentName);

var androidEventEmitter: NativeEventEmitter | null = null;
var androidCallbackEvents: any = {};

if(Platform.OS === 'android'){
  androidEventEmitter = new NativeEventEmitter();
}


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
        .load!.toString();
      UIManager.dispatchViewManagerCommand(handle, commandId, [handle, this.props.androidZoneId]);
    }
  }
}

type BidmadPluginTestProps = {
  iOSZoneId?: string;
  androidZoneId?: string;
  refreshInterval?: number;
  bannerSize?: BidmadBannerSizeType;
  onControllerCreated?: (controller: BidmadPluginTestController) => void;
  onLoad?: () => void;
  onLoadFail?: (error: string) => void;
  onClick?: () => void;
};

type BidmadPluginTestRef = React.RefObject<View>;

export const BidmadPluginTestView = (props: BidmadPluginTestProps) => {
  if (UIManager.getViewManagerConfig(ComponentName) == null) {
    throw new Error(LINKING_ERROR);
  }

  let width: number;
  let height: number;

  if (props.bannerSize) {
    if (props.bannerSize === BidmadBannerSize.MREC) {
      width = 300;
      height = 250;
    } else if (props.bannerSize === BidmadBannerSize.LARGE_BANNER) {
      width = 320;
      height = 100;
    } else {
      width = 320;
      height = 50;
    }

  } else {
    // default value if size is not given
    width = 320;
    height = 50;
  }

  const bidmadRef = useRef(null);

  useEffect(() => {
    const controller = new BidmadPluginTestController(bidmadRef, props);
    if (props.onControllerCreated) {
      props.onControllerCreated(controller);
    }

    const viewId: number = findNodeHandle(bidmadRef.current)!;

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

  const setAndroidCallbackEvent = (viewId: number) => {
    const loadEventKey = 'onLoad_'+viewId;
    if(androidCallbackEvents[loadEventKey] != undefined){
      androidCallbackEvents[loadEventKey].remove();
      androidCallbackEvents[loadEventKey] = undefined;
    }

    const loadEvent = androidEventEmitter?.addListener(loadEventKey, (_) => {
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

    const loadFailEvent = androidEventEmitter?.addListener(loadFailEventKey, (params) => {
      androidCallbackEvents[loadFailEventKey] = loadFailEvent

      if (props.onLoadFail) {
        props.onLoadFail();
      }
    })

    const clickEventKey = 'onClick_'+viewId;
    if(androidCallbackEvents[clickEventKey] != undefined){
      androidCallbackEvents[clickEventKey].remove();
      androidCallbackEvents[clickEventKey] = undefined;
    }

    const clickEvent = androidEventEmitter?.addListener(clickEventKey, (_) => {
      androidCallbackEvents[clickEventKey] = clickEvent

      if (props.onClick) {
        props.onClick();
      }
    })
  }

  const removeAndroidCallbackEvent = (viewId: number) => {
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
            width: width,
            height: height,
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
            width: width,
            height: height,
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
