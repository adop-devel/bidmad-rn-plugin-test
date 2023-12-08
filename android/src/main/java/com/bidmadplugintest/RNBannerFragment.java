package com.bidmadplugintest;

import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.fragment.app.Fragment;

import com.adop.sdk.adview.AdViewListener;
import com.facebook.react.bridge.ReactApplicationContext;

import java.util.HashMap;
import java.util.Map;

public class RNBannerFragment extends Fragment {
    RNBanner mBanner;
    AdViewListener mBannerListener;
    String mZoneId;
    public RNBannerFragment(String zoneId) {
        mZoneId = zoneId;
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup parent, Bundle savedInstanceState) {
        super.onCreateView(inflater, parent, savedInstanceState);
        Log.d("bidmad", "onCreateView");
        mBanner = new RNBanner(getContext(), mZoneId);
        mBanner.setListener(mBannerListener);
        return mBanner.getView();
    }

    @Override
    public void onViewCreated(View view, Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);
        Log.d("bidmad", "onViewCreated");
        // do any logic that should happen in an `onCreate` method, e.g:
        load();
    }

    @Override
    public void onPause() {
        super.onPause();
        // do any logic that should happen in an `onPause` method
        mBanner.onPause();
    }

    @Override
    public void onResume() {
        super.onResume();
        // do any logic that should happen in an `onResume` method
        mBanner.onResume();
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        // do any logic that should happen in an `onDestroy` method
        mBanner.onPause();
    }

    public void load(){
        mBanner.load();
    }

    public void setListener(AdViewListener adViewListener) {
        mBannerListener = adViewListener;
    }
}
