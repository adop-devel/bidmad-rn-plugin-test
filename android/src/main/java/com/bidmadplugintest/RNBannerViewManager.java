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
    public static final String CLASS_NAME = "BidmadPluginTestView";
    public final int COMMAND_LOAD = 1;

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
        return new FrameLayout(reactContext);
    }

    @Nullable
    @Override
    public Map<String, Integer> getCommandsMap() {
        return MapBuilder.of(
                "load", COMMAND_LOAD
        );
    }

    @Override
    public void receiveCommand(@NonNull View root, String commandId, @Nullable ReadableArray args) {
        super.receiveCommand(root, commandId, args);

        int commandIdInt = Integer.parseInt(commandId);

        int reactNativeViewId = args.getInt(0);
        String zoneId = args.getString(1);

        switch (commandIdInt) {
            case COMMAND_LOAD:
                createFragment((FrameLayout) root, reactNativeViewId, zoneId);
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
        setupLayout(parentView);

        final RNBannerFragment bannerFragment = new RNBannerFragment(reactContext, zoneId, reactNativeViewId);
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

        parentView.measure(
                View.MeasureSpec.makeMeasureSpec(width, View.MeasureSpec.EXACTLY),
                View.MeasureSpec.makeMeasureSpec(height, View.MeasureSpec.EXACTLY));

        parentView.layout(parentView.getLeft(), parentView.getTop(), parentView.getRight(), parentView.getBottom());
    }
}
