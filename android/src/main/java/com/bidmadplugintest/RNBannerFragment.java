package com.bidmadplugintest;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.FrameLayout;

import androidx.fragment.app.Fragment;

import java.util.HashMap;
import java.util.Map;

public class RNBannerFragment extends Fragment {
    static Map<Integer, RNBannerView> viewMap = new HashMap<Integer, RNBannerView>();
    RNBannerView mBannerView;
    RNBannerListener mBannerListener;
    String mZoneId;
    FrameLayout mLayout;
    int mWidth;
    int mHeight;

    public RNBannerFragment(String zoneId, FrameLayout root, int propWidth, int propHeight) {
        mZoneId = zoneId;
        mLayout = root;
        mWidth = propWidth;
        mHeight = propHeight;
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup parent, Bundle savedInstanceState) {
        super.onCreateView(inflater, parent, savedInstanceState);
        mBannerView = new RNBannerView(getActivity(), mZoneId);
        mBannerView.setListener(mBannerListener);
        return mBannerView.getView(); // this CustomView could be any view that you want to render
    }

    @Override
    public void onViewCreated(View view, Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);
        // do any logic that should happen in an `onCreate` method, e.g:
        load();
    }

    @Override
    public void onPause() {
        super.onPause();
        // do any logic that should happen in an `onPause` method
//        mBannerView.onPause();
    }

    @Override
    public void onResume() {
        super.onResume();
        // do any logic that should happen in an `onResume` method
//        mBannerView.onResume();
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        // do any logic that should happen in an `onDestroy` method
//        mBannerView.onPause();
    }

    public void setListener(RNBannerListener bbl){
        mBannerListener = bbl;
    }

    public void load(){
        mBannerView.load();
    }
}
