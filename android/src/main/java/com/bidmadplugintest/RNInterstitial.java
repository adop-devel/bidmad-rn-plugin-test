package com.bidmadplugintest;

import android.app.Activity;

import java.util.UUID;

import ad.helper.openbidding.OBHLog;
import ad.helper.openbidding.interstitial.BaseInterstitial;

public class RNInterstitial extends BaseInterstitial {
	private static String LOG_TAG = "RNInterstitial";

	private String mInstanceId;

	public RNInterstitial(String zoneId){
		super(zoneId);
		mInstanceId = UUID.randomUUID().toString();
		mInstanceMap.put(mInstanceId, this);
	}

	public String getInstanceId() {
		return mInstanceId;
	}

	public static RNInterstitial getInstance(String instanceId) {
		return (RNInterstitial) mInstanceMap.get(instanceId);
	}

	public void initObject(Activity activity) {
		OBHLog.write(LOG_TAG,"RNInterstitial - initObject Start ");
		setActivity(activity);
		setObject();
	}

	@Override
	public void show() {
		((Activity)mActivity).runOnUiThread(new Runnable() {
			@Override
			public void run() {
				if(isLoaded()){
					mInterstitial.show();
				}else{
					load();
				}
			}
		});
	}

	public void release() {
		mInstanceMap.remove(mInstanceId);
	}
}
