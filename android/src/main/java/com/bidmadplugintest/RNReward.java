package com.bidmadplugintest;

import android.app.Activity;

import java.util.UUID;

import ad.helper.openbidding.OBHLog;
import ad.helper.openbidding.reward.BaseReward;

public class RNReward extends BaseReward {
	private static String LOG_TAG = "RNReward";

	private String mInstanceId;

	public RNReward(String zoneId){
		super(zoneId);
		mInstanceId = UUID.randomUUID().toString();
		mInstanceMap.put(mInstanceId, this);
	}

	public String getInstanceId() {
		return mInstanceId;
	}

	public static RNReward getInstance(String instanceId) {
		return (RNReward) mInstanceMap.get(instanceId);
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
					mReward.show();
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
