package com.bidmadplugintest;

import android.content.Context;
import android.view.View;
import android.view.ViewGroup;
import android.widget.FrameLayout;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.FragmentActivity;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;

import java.util.Map;

import ad.helper.openbidding.BidmadCommon;

public class RNBannerViewManager extends SimpleViewManager<View> {
//    public static final String CLASS_NAME = "BidmadBanner";
    public static final String CLASS_NAME = "BidmadPluginTestView";
    public final int COMMAND_CREATE = 1;
    public final int COMMAND_RELOAD = 2;
    public final int COMMAND_ADJUST = 3;

    private int propMaxWidth;
    private int propWidth;
    private int propHeight;

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

    @ReactProp(name = "width")
    public void setWidth(View view, int width) {
        propWidth = width;
    }

    @ReactProp(name = "maxWidth")
    public void setMaxWidth(View view, int maxWidth) {
        propMaxWidth = maxWidth;
    }

    @ReactProp(name = "endHeight")
    public void setHeight(View view, int height) {
        propHeight = height;
    }

    @Nullable
    @Override
    public Map<String, Integer> getCommandsMap() {
        return MapBuilder.of(
                "create", COMMAND_CREATE,
                "reload", COMMAND_RELOAD,
                "adjust", COMMAND_ADJUST
        );
    }

    @Override
    public void receiveCommand(@NonNull View root, String commandId, @Nullable ReadableArray args) {
        super.receiveCommand(root, commandId, args);

        int commandIdInt = Integer.parseInt(commandId);

        int reactNativeViewId = args.getInt(0);
        switch (commandIdInt) {
            case COMMAND_CREATE:
                String zoneId = args.getString(1);

                createFragment((FrameLayout) root, reactNativeViewId, zoneId);
                root.refreshDrawableState();
                break;
            case COMMAND_RELOAD:
                reloadBidmadBanner(reactNativeViewId);
                root.refreshDrawableState();
                break;
            case COMMAND_ADJUST:
                ViewGroup parentView = (ViewGroup) root.findViewById(reactNativeViewId);
                manuallyLayoutChildren(parentView, propMaxWidth, propWidth, propHeight);
                root.refreshDrawableState();
                break;
            default: {}
        }
    }

    /**
     * Replace your React Native view with a custom fragment
     */
    public void createFragment(FrameLayout root, int reactNativeViewId, String zoneId) {
        ViewGroup parentView = (ViewGroup) root.findViewById(reactNativeViewId);

        final RNBannerFragment bannerFragment = new RNBannerFragment(zoneId, root, propWidth, propHeight);
        bannerFragment.setListener(new RNBannerListener() {
            @Override
            public void onLoadAd() {
                Context context = root.getContext();
                if (context instanceof ReactContext) {
                    ((ReactContext) context).getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                            .emit("onLoad_"+reactNativeViewId, zoneId);
//                    manuallyLayoutChildren(parentView, propMaxWidth, propWidth, propHeight);
                }
            }

            @Override
            public void onFailedAd() {
                Context context = root.getContext();
                if (context instanceof ReactContext) {
                    ((ReactContext) context).getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                            .emit("onFail_"+reactNativeViewId, zoneId);
//                    manuallyLayoutChildren(parentView, 0, 0);
                }
            }
        });

        FragmentActivity activity = (FragmentActivity) reactContext.getCurrentActivity();
        activity.getSupportFragmentManager()
                .beginTransaction()
                .replace(reactNativeViewId, bannerFragment, String.valueOf(reactNativeViewId))
                .commit();
    }

    public void manuallyLayoutChildren(View view, int maxWidth, int width, int height) {
        view.measure(
                View.MeasureSpec.makeMeasureSpec(width, View.MeasureSpec.EXACTLY),
                View.MeasureSpec.makeMeasureSpec(height, View.MeasureSpec.EXACTLY));

        //전체 - 배너 크기 = 여백 / 2 = 좌/우여
        int leftPos = (maxWidth - width) / 2;
        view.layout(leftPos, view.getTop(), width, view.getBottom());
    }

    public void reloadBidmadBanner(int reactNativeViewId) {
        FragmentActivity activity = (FragmentActivity) reactContext.getCurrentActivity();
        RNBannerFragment bannerFragment = (RNBannerFragment) activity.getSupportFragmentManager().findFragmentById(reactNativeViewId);

        if(bannerFragment != null)
            bannerFragment.load();
    }
}
