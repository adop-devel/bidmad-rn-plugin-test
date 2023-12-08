package com.bidmadplugintest;

import android.content.Context;
import android.util.Log;
import android.view.Choreographer;
import android.view.View;
import android.view.ViewGroup;
import android.widget.FrameLayout;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.FragmentActivity;

import com.adop.sdk.BMAdError;
import com.adop.sdk.adview.AdViewListener;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.react.uimanager.events.RCTEventEmitter;
import com.facebook.react.uimanager.events.RCTModernEventEmitter;

import java.util.Map;

import ad.helper.openbidding.BidmadCommon;

public class RNBannerViewManager extends SimpleViewManager<View> {
//    public static final String CLASS_NAME = "BidmadBanner";
    public static final String CLASS_NAME = "BidmadPluginTestView";
    public final int COMMAND_LOAD = 1;
    public final int COMMAND_RELOAD = 2;
    public final int COMMAND_ADJUST = 3;

    private int propMaxWidth;
    private int propWidth;
    private int propHeight;

    private String propZoneId;

    private int viewId;

    ReactApplicationContext reactContext;

    public RNBannerViewManager(ReactApplicationContext reactContext) {
        this.reactContext = reactContext;
    }

    @NonNull
    @Override
    public String getName() {
        return CLASS_NAME;
    }

    @NonNull
    @Override
    protected View createViewInstance(@NonNull ThemedReactContext reactContext) {
        BidmadCommon.setDebugging(true);
        BidmadCommon.initializeSdk(reactContext.getCurrentActivity());
        return new FrameLayout(reactContext);
    }

//    @ReactProp(name = "zoneId")
//    public void setZoneId(View view, String zoneId) {
//        viewId = view.getId();
//        Log.d("bidmad", "viewId = " + viewId);
//        Log.d("bidmad", "viewId hash = " + this.hashCode());
//        propZoneId = zoneId;
//    }

//    @ReactProp(name = "width")
//    public void setWidth(View view, int width) {
//        propWidth = width;
//    }
//
//    @ReactProp(name = "maxWidth")
//    public void setMaxWidth(View view, int maxWidth) {
//        propMaxWidth = maxWidth;
//    }
//
//    @ReactProp(name = "endHeight")
//    public void setHeight(View view, int height) {
//        propHeight = height;
//    }

    @Nullable
    @Override
    public Map<String, Integer> getCommandsMap() {
        return MapBuilder.of(
                "load", COMMAND_LOAD,
                "reload", COMMAND_RELOAD,
                "adjust", COMMAND_ADJUST
        );
    }

    @Override
    public void receiveCommand(@NonNull View root, String commandId, @Nullable ReadableArray args) {
        super.receiveCommand(root, commandId, args);

        Log.d("bidmad", "receiveCommand");
        int commandIdInt = Integer.parseInt(commandId);

        int reactNativeViewId = args.getInt(0);
        String zoneId = args.getString(1);

        switch (commandIdInt) {
            case COMMAND_LOAD:
                Log.d("bidmad", "load call");
                createFragment((FrameLayout) root, reactNativeViewId, zoneId);
                root.refreshDrawableState();
                break;
            default: {}
        }
    }

    @ReactMethod
    public void addListener(String eventName) {
        // Set up any upstream listeners or background tasks as necessary
    }

    @ReactMethod
    public void removeListeners(Integer count) {
        // Remove upstream listeners, stop unnecessary background tasks
    }

    /**
     * Replace your React Native view with a custom fragment
     */
    public void createFragment(FrameLayout root, int reactNativeViewId, String zoneId) {
        ViewGroup parentView = (ViewGroup) root.findViewById(reactNativeViewId);
        setupLayout(parentView);

        final RNBannerFragment bannerFragment = new RNBannerFragment(zoneId);

        bannerFragment.setListener(new AdViewListener() {
            @Override
            public void onLoadAd() {
                if(reactContext != null) {
                    reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit("onLoad_"+reactNativeViewId, null);
                }
            }

            @Override
            public void onLoadFailAd(BMAdError bmAdError) {
                WritableMap event = Arguments.createMap();
                event.putString("error", bmAdError.getMsg());
                reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit("onLoadFail_"+reactNativeViewId, event);
            }

            @Override
            public void onClickAd() {
                reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit("onClick_"+reactNativeViewId, null);
            }
        });
        FragmentActivity activity = (FragmentActivity) reactContext.getCurrentActivity();
        activity.getSupportFragmentManager()
                .beginTransaction()
                .replace(reactNativeViewId, bannerFragment, String.valueOf(reactNativeViewId))
                .commit();
    }

    public void setupLayout(View view) {
        Choreographer.getInstance().postFrameCallback(new Choreographer.FrameCallback() {
            @Override
            public void doFrame(long frameTimeNanos) {
                manuallyLayoutChildren(view);
                view.getViewTreeObserver().dispatchOnGlobalLayout();
                Choreographer.getInstance().postFrameCallback(this);
            }
        });
    }

    public void manuallyLayoutChildren(View parentView) {
        int width = parentView.getWidth();
        int height = parentView.getHeight();


//        Log.d("bidmad", "view getWidth : " + view.getWidth());
//        Log.d("bidmad", "view getHeight : " + view.getHeight());
//        Log.d("bidmad", "view getTop : " + view.getTop());
//        Log.d("bidmad", "view getBottom : " + view.getBottom());
//        Log.d("bidmad", "view getLeft : " + view.getLeft());
//        Log.d("bidmad", "view getRight : " + view.getRight());

        parentView.measure(
                View.MeasureSpec.makeMeasureSpec(width, View.MeasureSpec.EXACTLY),
                View.MeasureSpec.makeMeasureSpec(height, View.MeasureSpec.EXACTLY));
//        view getWidth 	: 420
//        view getHeight 	: 66
//        view getTop 	: 0
//        view getBottom 	: 66
//        view getLeft 	: 0
//        view getRight 	: 420
        //전체 - 배너 크기 = 여백 / 2 = 좌/우여
//        int leftPos = (maxWidth - width) / 2;
//        view.layout(leftPos, view.getTop(), width, view.getBottom());
        parentView.layout(parentView.getLeft(), parentView.getTop(), parentView.getRight(), parentView.getBottom());

//        parentView.layout(0,0, width, height);
    }

    public void reloadBidmadBanner(int reactNativeViewId) {
        FragmentActivity activity = (FragmentActivity) reactContext.getCurrentActivity();
        RNBannerFragment bannerFragment = (RNBannerFragment) activity.getSupportFragmentManager().findFragmentById(reactNativeViewId);

        if(bannerFragment != null)
            bannerFragment.load();
    }

//    @Nullable
//    @Override
//    public Map<String, Object> getExportedCustomDirectEventTypeConstants() {
//        return MapBuilder.<String, Object>builder()
//                .put("onLoad", MapBuilder.of("registrationName", "onLoad"))
////                .put("onLoadFail", MapBuilder.of("registrationName", "onLoadFail"))
////                .put("onClick", MapBuilder.of("registrationName", "onClick"))
////                .put("topChange", MapBuilder.of("registrationName", "onChange"))
//                .build();
//    }

    @Nullable
    @Override
    public Map getExportedCustomBubblingEventTypeConstants() {
        return MapBuilder.builder().put(
                "onLoad",
                MapBuilder.of(
                        "phasedRegistrationNames",
                        MapBuilder.of("bubbled", "onLoad")
                )
        ).build();
    }
}
