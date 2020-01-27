package com.fan.ble;

import android.app.Activity;
import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothManager;
import android.bluetooth.le.AdvertiseCallback;
import android.bluetooth.le.AdvertiseData;
import android.bluetooth.le.AdvertiseSettings;
import android.bluetooth.le.BluetoothLeAdvertiser;
import android.content.ContentValues;
import android.content.Intent;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.support.annotation.Nullable;
import android.util.Log;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.BaseActivityEventListener;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import com.example.nirjon.bledemo4_advertising.util.BLEUtil;
import com.facebook.react.uimanager.IllegalViewOperationException;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.Arrays;
import java.util.Timer;
import java.util.TimerTask;

import static android.app.Activity.RESULT_OK;
import static android.bluetooth.le.AdvertiseSettings.ADVERTISE_MODE_LOW_LATENCY;
import static android.bluetooth.le.AdvertiseSettings.ADVERTISE_TX_POWER_HIGH;
import static android.content.Context.BLUETOOTH_SERVICE;

public class AdvertiserModule extends ReactContextBaseJavaModule {

  protected ReactApplicationContext context;
  private SqlModel sqlModel;
  private SQLiteDatabase db;

  private BluetoothAdapter bluetoothAdapter;
  private BluetoothManager myManager;
  private BluetoothAdapter myAdapter;
  private static BluetoothLeAdvertiser myAdvertiser;
  private static AdvertiseSettings myAdvertiseSettings;
  private static AdvertiseData myAdvertiseData;
  private static final int ENABLE_BLUETOOTH = 1234;
  public static String ID = "";
  public static boolean off = false;
  static AdvertiseCallback myAdvertiseCallback = new AdvertiseCallback() {
    @Override
    public void onStartSuccess(AdvertiseSettings settingsInEffect) {
      super.onStartSuccess(settingsInEffect);
    }

    @Override
    public void onStartFailure(int errorCode) {
      super.onStartFailure(errorCode);
    }
  };
  private final ActivityEventListener activityEventListener = new BaseActivityEventListener(){
    @Override
    public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
      super.onActivityResult(activity, requestCode, resultCode, data);
      if (requestCode == ENABLE_BLUETOOTH) {
        switch (resultCode) {
          case RESULT_OK:
            init();
            WritableMap writableMap = Arguments.createMap();
            writableMap.putInt("resultCode", resultCode);
            writableMap.putInt("requestCode", requestCode);
            sendEvent("openBLECallback", writableMap);
            break;
          default:
            context.getCurrentActivity().finish();
        }
      }
    }
  };

  public AdvertiserModule(ReactApplicationContext reactContext) {
    super(reactContext);
    context = reactContext;
    reactContext.addActivityEventListener(activityEventListener);
  }

  @Override
  public String getName() {
    return "BLEAdvertiser";
  }

  @ReactMethod
  public void initBLE(Promise promise) {
    init();
  }

  @ReactMethod
  public void checkBLEState(Promise promise) {
    Boolean isEnabled = bluetoothIsEnabled();
    try {
      WritableMap map = Arguments.createMap();
      map.putBoolean("isEnabled", isEnabled);
      promise.resolve(map);
    } catch (IllegalViewOperationException e) {
      promise.reject(e);
    }
  }

  @ReactMethod
  public void openBLE() {
    openBluetooth();
  }

  @ReactMethod
  public void isSupport(Promise promise) {
    Boolean isEnabled = isSupportAdvertisement();
    try {
      WritableMap map = Arguments.createMap();
      map.putBoolean("isSupport", isEnabled);
      promise.resolve(map);
    } catch (IllegalViewOperationException e) {
      promise.reject(e);
    }
  }

  @ReactMethod
  public void send(String order, Promise promise){

    try {
      WritableMap map = Arguments.createMap();
      order = order.toLowerCase();
      if(ID.isEmpty() && order.isEmpty()){
        map.putInt("status", -1);
      }
      else if(!bluetoothAdapter.isEnabled()){
        map.putInt("status", 1);
      }
      else if(!myAdapter.isMultipleAdvertisementSupported()){
        map.putInt("status", 2);
      }
      else{
        if(!off){//关机
          if (order.equals("a0") || order.equals("a1") || order.equals("b4") || order.equals("b5")) {
            Boolean bool = sendOrder(ID, order);
            map.putInt("status", bool ? 0 : 3);
          }else{
            map.putInt("status", 4);
          }
        }else{
          Boolean bool = sendOrder(ID, order);
          map.putInt("status", bool ? 0 : 3);
        }
      }
      promise.resolve(map);
    }catch (IllegalViewOperationException e) {
      promise.reject(e);
    }
  }

  @ReactMethod
  public void add(String name, String id, Promise promise){
    Integer type = 1;
    if(!id.isEmpty()){
      type = 2;
    }
    Integer number = addDevice(type, id, name);
    WritableArray arrays = getDeviceList();
    WritableMap map = Arguments.createMap();
    map.putArray("devices", arrays);
    map.putInt("status", number);
    promise.resolve(map);
  }

  @ReactMethod
  public void delete(String id, Promise promise){
    WritableMap map = Arguments.createMap();
    if (sendOrder(id,"b5")){
      db.delete("aifan","deviceid = ?", new String[]{id});
      map.putInt("status", 0);
    }else{
      map.putInt("status", 3);
    }
    WritableArray arrays = getDeviceList();
    map.putArray("devices", arrays);
    promise.resolve(map);
  }

  @ReactMethod
  public void choose(String id, String name, Promise promise){
    Boolean bool = chooseDevice(id, name);
    try {
      WritableMap map = Arguments.createMap();
      map.putBoolean("status", bool);
      promise.resolve(map);
    } catch (IllegalViewOperationException e) {
      promise.reject(e);
    }
  }

  @ReactMethod
  public void currentDevice( Promise promise){
    String aiFanConfig = Utils.readFile(context.getCurrentActivity(), "AiFanConfig.json");
    WritableMap map = Arguments.createMap();
    map.putString("id", null);
    map.putString("name", null);
    if (aiFanConfig != null) {
      try {
        if (aiFanConfig != null) {
          JSONObject object = new JSONObject(aiFanConfig);
          ID = "cc cc cc cc cc";
          map.putString("id", object.getString("id"));
          Cursor cursor = db.query ("aifan", new String[]{"name"},"deviceid = ?", new String[]{object.getString("id")},null,null,null);
          if (cursor.getCount() == 1)
            while(cursor.moveToNext())
              map.putString("name", cursor.getString(cursor.getColumnIndex("name")));

        }
      } catch (JSONException e) {
        e.printStackTrace();
      }
    }
    promise.resolve(map);
  }

  @ReactMethod
  private void getDevices(Promise promise) {
    try {
      WritableArray arrays = getDeviceList();
      promise.resolve(arrays);
    }catch (IllegalViewOperationException e) {
      promise.reject(e);
    }
  }

  //获取设备
  private WritableArray getDeviceList(){
    Cursor cursor = db.query("aifan", null, null, null, null, null, null);
    WritableArray arrays = Arguments.createArray();
    while (cursor.moveToNext()) {
      String id = cursor.getString(1);
      String name = cursor.getString(2);
      WritableMap map = Arguments.createMap();
      map.putString("id", id);
      map.putString("name", name);
      arrays.pushMap(map);
    }
    return arrays;
  }

  //选择设备
  private boolean chooseDevice(String id, String name){
    if(!id.isEmpty() && !name.isEmpty()){
      try {
        JSONObject object = new JSONObject();
        object.put("id", id);
          return Utils.saveFile(context.getCurrentActivity(), object.toString(), "AiFanConfig.json");
      } catch (JSONException e) {
        e.printStackTrace();
      }
    }
    return false;
  }

  //初始化
  private void init(){
    Boolean isEnabled = bluetoothIsEnabled();
    if(!isEnabled){
      openBluetooth();
    }else{
      myManager = (BluetoothManager) context.getSystemService(BLUETOOTH_SERVICE);
      myAdapter = myManager.getAdapter();
      myAdvertiser = myAdapter.getBluetoothLeAdvertiser();
      if (!myAdapter.isMultipleAdvertisementSupported()) {
        return;
      }
      myAdvertiseSettings = new AdvertiseSettings.Builder()
        .setAdvertiseMode(ADVERTISE_MODE_LOW_LATENCY)
        .setConnectable(true)
        .setTimeout(0)
        .setTxPowerLevel(ADVERTISE_TX_POWER_HIGH)
        .build();
    }
  }

  //检测蓝牙
  private boolean bluetoothIsEnabled(){
    bluetoothAdapter = BluetoothAdapter.getDefaultAdapter();
    return bluetoothAdapter.isEnabled();
  }

  //开启蓝牙
  private void openBluetooth(){
    Intent intent = new Intent(BluetoothAdapter.ACTION_REQUEST_ENABLE);
    context.getCurrentActivity().startActivityForResult(intent, ENABLE_BLUETOOTH);
  }

  //广播支持
  private boolean isSupportAdvertisement(){
    myManager = (BluetoothManager) context.getSystemService(BLUETOOTH_SERVICE);
    myAdapter = myManager.getAdapter();
    myAdvertiser = myAdapter.getBluetoothLeAdvertiser();
    if (!myAdapter.isMultipleAdvertisementSupported()) {
      return false;
    }
    return true;
  }

  //添加设备
  public int addDevice(final int type, final String devid, String name){
    String id = Utils.randomHexString(4);
    ContentValues values = new ContentValues();
    try {
      switch (type) {
        case 1:
          Cursor cursor = db.query("aifan", null, null, null, null, null, null);
          while (cursor.moveToNext()) {
            String deviceid = cursor.getString(1);
            String devicename = cursor.getString(2);
            if (id.equals(deviceid) || name.equals(devicename)) {
              return 0;
            }
          }
          if (!sendOrder(id,"b4"))
            return 1;
          values.put("deviceid", id);
          values.put("name", name);
          db.insert("aifan", null, values);
          break;
        case 2:
          if (devid == null)
            return 2;
          values.put("name", name);
          db.update("aifan", values, "deviceid = ?", new String[]{devid});
          break;
      }
      return 3;
    }
    catch (Exception e) {
      e.printStackTrace();
      return 4;
    }
  }

  //发送指令
  public static boolean sendOrder(String addr, String order){
    //设备地址处理
    addr = addr.replace(" ", "");
    addr = addr.toLowerCase();

    byte[] address = new byte[addr.length()/2];
    for (int i = 0; i < address.length; ++i) {
      address[i] = Utils.strToByte(addr.substring(i*2, (i+1)*2));
    }

    //设备控制指令处理
    order = order.replace(" ", "");
    order = order.toLowerCase();

    if (order.length() < 2) {
      return false;
    }

    byte[] payload = new byte[order.length()/2];
    for (int i = 0; i < payload.length; ++i) {
      payload[i] = Utils.strToByte(order.substring(i*2, (i+1)*2));
    }

    final byte[] calculatedPayload = new byte[address.length+payload.length+5];
    BLEUtil.get_rf_payload(address, address.length, payload, payload.length, calculatedPayload);

    myAdvertiseData = new AdvertiseData.Builder()
      .addManufacturerData(65520, calculatedPayload)
      .build();

    myAdvertiser.startAdvertising(myAdvertiseSettings, myAdvertiseData, myAdvertiseCallback);
    Timer timer = new Timer();
    TimerTask task = new TimerTask(){
      public void run(){
        myAdvertiser.stopAdvertising(myAdvertiseCallback);
      }
    };
    timer.schedule(task, 500);
    if(order.equals("a0")){
      off = true;
    }else if(order.equals("a1")){
      off = false;
    }
    return true;
  }

  /**
   * @param eventName
   * @param params
   *  通过RCTDeviceEventEmitter向JS传递事件
   */
  protected void sendEvent(String eventName,@Nullable WritableMap params) {
    context.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
      .emit(eventName, params);
  }

  @Override
  public void initialize() {
    super.initialize();

    sqlModel = new SqlModel(context);
    db = sqlModel.getWritableDatabase();
  }

  @Override
  public void onCatalystInstanceDestroy() {
    db.close();
    super.onCatalystInstanceDestroy();
  }
}
