package com.bidmadplugintest;

import android.app.Activity;
import android.view.View;

import androidx.annotation.NonNull;

import com.adop.sdk.BMAdError;
import com.adop.sdk.adview.AdViewListener;

import ad.helper.openbidding.adview.BidmadBannerAd;

public class RNBannerView {
    Activity mActivity;
    BidmadBannerAd mBanner;
    View mBannerView;
    public RNBannerView(@NonNull Activity activity, String zoneId) {
        mActivity = activity;
        mBanner = new BidmadBannerAd(mActivity, zoneId);
    }

    public void load(){
        mBanner.onceload();
    }

    public void setListener(RNBannerListener bannerListener){
        mBanner.setAdViewListener(new AdViewListener() {
            @Override
            public void onLoadAd() {
                if(bannerListener != null){
                    bannerListener.onLoadAd();
                }
            }

            @Override
            public void onLoadFailAd(BMAdError bmAdError) {
                if(bannerListener != null){
                    bannerListener.onFailedAd();
                }
            }

            @Override
            public void onClickAd() {
                if(bannerListener != null){
                    // bannerListener.onFailedAd();
                }
            }
        });
    }

    public void onResume(){
        if(mBanner != null)
            mBanner.onResume();
    }

    public void onPause(){
        if(mBanner != null)
            mBanner.onPause();
    }

    public View getView(){
        return mBanner.getView();
    }
}
