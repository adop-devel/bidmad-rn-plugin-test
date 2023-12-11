package com.bidmadplugintest;

import android.app.Activity;

import androidx.annotation.Nullable;

import com.adop.sdk.BMAdError;
import com.adop.sdk.reward.RewardListener;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

public class RNRewardModule extends ReactContextBaseJavaModule {
	Activity mActivity;
	ReactApplicationContext mContext;
	final String eventName = "BidmadRewardCallback";
	String mInstanceId = "";
	public RNRewardModule(ReactApplicationContext context) {
		super(context);
		mContext = context;
		mActivity = context.getCurrentActivity();
	}

	@Override
	public String getName() {
		return "BidmadPluginRewardModule";
	}

	@ReactMethod
	public void createInstance(String zoneId, Promise promise) { //test에서 activity가 생성되지 않는 경우가 있는지 확인 필요
		ReactApplicationContext context = getReactApplicationContext();
		mActivity = context.getCurrentActivity();
		if (mActivity != null) {
			RNReward reward = new RNReward(zoneId);
			reward.initObject(mActivity);
			setListener(reward);
			mInstanceId = reward.getInstanceId();
		}

		promise.resolve(mInstanceId);
	}

	@ReactMethod
	public void load(String instanceId, Promise promise) {
		RNReward reward = RNReward.getInstance(instanceId);
		if (reward != null) {
			reward.load();
		}

		promise.resolve(null);
	}

	@ReactMethod
	public void show(String instanceId, Promise promise) {
		RNReward reward = RNReward.getInstance(instanceId);
		if (reward != null) {
			reward.show();
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
		RNReward reward = RNReward.getInstance(instanceId);
		if (reward != null) {
			reward.release();
		}

		promise.resolve(null);
	}

	public void setListener(RNReward reward) {
		reward.setListener(new RewardListener() {
			@Override
			public void onLoadAd() {
				WritableMap params = Arguments.createMap();
				params.putString("instanceId", mInstanceId);
				params.putString("action", "onRewardLoad");
				sendEvent(params);
			}

			@Override
			public void onShowAd() {
				WritableMap params = Arguments.createMap();
				params.putString("instanceId", mInstanceId);
				params.putString("action", "onRewardShow");
				sendEvent(params);
			}

			@Override
			public void onLoadFailAd(BMAdError bmAdError) {
				WritableMap params = Arguments.createMap();
				params.putString("instanceId", mInstanceId);
				params.putString("action", "onRewardLoadFail");
				params.putString("error", bmAdError.msg);
				sendEvent(params);
			}

			@Override
			public void onCompleteAd() {
				WritableMap params = Arguments.createMap();
				params.putString("instanceId", mInstanceId);
				params.putString("action", "onRewardComplete");
				sendEvent(params);
			}

			@Override
			public void onCloseAd() {
				WritableMap params = Arguments.createMap();
				params.putString("instanceId", mInstanceId);
				params.putString("action", "onRewardClose");
				sendEvent(params);
			}

			@Override
			public void onClickAd() {
				WritableMap params = Arguments.createMap();
				params.putString("instanceId", mInstanceId);
				params.putString("action", "onRewardClick");
				sendEvent(params);
			}

			@Override
			public void onSkipAd() {
				WritableMap params = Arguments.createMap();
				params.putString("instanceId", mInstanceId);
				params.putString("action", "onRewardSkip");
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
		ReactApplicationContext context = getReactApplicationContext();
		if(context != null) {
			context.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(eventName, params);
		}
	}
}
