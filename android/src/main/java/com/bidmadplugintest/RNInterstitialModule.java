package com.bidmadplugintest;

import android.app.Activity;
import android.content.Context;
import android.util.Log;

import androidx.annotation.Nullable;

import com.adop.sdk.BMAdError;
import com.adop.sdk.interstitial.InterstitialListener;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import java.util.UUID;

import ad.helper.openbidding.interstitial.BidmadInterstitialAd;

public class RNInterstitialModule extends ReactContextBaseJavaModule {
	Activity mActivity;
	ReactApplicationContext mContext;
	final String eventName = "BidmadInterstitialCallback";
	String mInstanceId = "";
	public RNInterstitialModule(ReactApplicationContext context) {
		super(context);
		mContext = context;
		mActivity = context.getCurrentActivity();
	}

	@Override
	public String getName() {
		return "BidmadPluginInterstitialModule";
	}

	@ReactMethod
	public void createInstance(String zoneId, Promise promise) { //test에서 activity가 생성되지 않는 경우가 있는지 확인 필요
		ReactApplicationContext context = getReactApplicationContext();
		mActivity = context.getCurrentActivity();
		if (mActivity != null) {
			RNInterstitial intersitial = new RNInterstitial(zoneId);
			intersitial.initObject(mActivity);
			setListener(intersitial);
			mInstanceId = intersitial.getInstanceId();
		}

		promise.resolve(mInstanceId);
	}

	@ReactMethod
	public void load(String instanceId, Promise promise) {
		RNInterstitial intersitial = RNInterstitial.getInstance(instanceId);
		if (intersitial != null) {
			intersitial.load();
		}

		promise.resolve(null);
	}

	@ReactMethod
	public void show(String instanceId, Promise promise) {
		RNInterstitial intersitial = RNInterstitial.getInstance(instanceId);
		if (intersitial != null) {
			intersitial.show();
		}

		promise.resolve(null);
	}

	@ReactMethod
	public void isLoaded(String instanceId, Promise promise) {
		RNInterstitial intersitial = RNInterstitial.getInstance(instanceId);
		if (intersitial != null) {
			promise.resolve(intersitial.isLoaded());
		} else {
			promise.resolve(false);
		}
	}

	@ReactMethod
	public void disposeInstance(String instanceId, Promise promise) {
		RNInterstitial intersitial = RNInterstitial.getInstance(instanceId);
		if (intersitial != null) {
			intersitial.release();
		}

		promise.resolve(null);
	}

	public void setListener(RNInterstitial interstitial) {
		interstitial.setListener(new InterstitialListener() {
			@Override
			public void onLoadAd() {
				WritableMap params = Arguments.createMap();
				params.putString("instanceId", mInstanceId);
				params.putString("action", "onInterstitialLoad");
				sendEvent(params);
			}

			@Override
			public void onShowAd() {
				WritableMap params = Arguments.createMap();
				params.putString("instanceId", mInstanceId);
				params.putString("action", "onInterstitialShow");
				sendEvent(params);
			}

			@Override
			public void onLoadFailAd(BMAdError bmAdError) {
				WritableMap params = Arguments.createMap();
				params.putString("instanceId", mInstanceId);
				params.putString("action", "onInterstitialLoadFail");
				params.putString("error", bmAdError.msg);
				sendEvent(params);
			}

			@Override
			public void onCloseAd() {
				WritableMap params = Arguments.createMap();
				params.putString("instanceId", mInstanceId);
				params.putString("action", "onInterstitialClose");
				sendEvent(params);
			}
		});
	}

	@ReactMethod
	public void addListener(String eventName) {
		// Set up any upstream listeners or background tasks as necessary
	}

	@ReactMethod
	public void removeListeners(Integer count) {
		// Remove upstream listeners, stop unnecessary background tasks
	}

	private void sendEvent(@Nullable WritableMap params) {
//		ReactApplicationContext context = getReactApplicationContext();
		if(mContext != null) {
			mContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(eventName, params);
		}
	}
}
