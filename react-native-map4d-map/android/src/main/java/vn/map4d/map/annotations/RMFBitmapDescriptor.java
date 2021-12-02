package vn.map4d.map.annotations;

import android.graphics.Bitmap;

public class RMFBitmapDescriptor {
    public static MFBitmapDescriptor create(Bitmap bitmap, int densityDpi) {
        return new MFBitmapDescriptor(bitmap, densityDpi);
    }
}
