package com.bidmadplugintest;

import android.app.Activity;
import android.content.Context;

import androidx.annotation.NonNull;

import com.adop.sdk.adview.AdViewListener;

import ad.helper.openbidding.adview.BaseAdView;

public class RNBanner extends BaseAdView {
    public RNBanner(@NonNull Context context, String zoneId) {
        super(context, zoneId);
        setObject();
    }

    @Override
    public void setListener(AdViewListener listener) {
        super.setListener(listener);
    }
}
