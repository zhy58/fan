package com.fan.ble;

import android.app.Activity;
import android.util.Log;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.Random;

public class Utils {

  private static final String HEX = "0123456789abcdef";

  /**
   * 字符串转字节
   * @param str
   * @return
   */
  public static byte strToByte(String str) {
    byte res = 0;
    if (str.length() == 1) {
      res = (byte)(HEX.indexOf(str) & 0xff);
    } else {
      res = (byte) ((charToByte(str.charAt(0)) << 4) | charToByte(str.charAt(1)));
    }
    return res;
  }

  private static byte charToByte(char c) {
    return (byte) HEX.indexOf(c);
  }

  /**
   * 随机16进制数
   * @param len
   * @return
   */
  public static String randomHexString(int len)  {
    try {
      StringBuffer result = new StringBuffer();
      for(int i = 0; i < len; i++) {
        result.append(Integer.toHexString(new Random().nextInt(16)));
      }
      return result.toString().toUpperCase();
    } catch (Exception e) {
      e.printStackTrace();
    }
    return null;
  }

  /**
   * 保存内容
   * @param context
   * @param toSaveString
   */
  public static boolean saveFile(Activity context, String toSaveString, String path) {
    try {
      File saveFile = new File(context.getFilesDir().getAbsolutePath() + "/" + path);
      if (!saveFile.exists()) {
        File dir = new File(saveFile.getParent());
        dir.mkdirs();
        saveFile.createNewFile();
      }
      FileOutputStream outStream = new FileOutputStream(saveFile);
      outStream.write(toSaveString.getBytes());
      outStream.close();
    } catch (FileNotFoundException e) {
      e.printStackTrace();
      return false;
    } catch (IOException e) {
      e.printStackTrace();
      return false;
    }
    return true;
  }

  /**
   * 读取内容
   * @param context
   * @return
   */
  public static String readFile(Activity context, String path) {
    String str = "";
    try {
      File readFile = new File(context.getFilesDir().getAbsolutePath() + "/" + path);
      if(!readFile.exists()) {
        return null;
      }
      FileInputStream inStream = new FileInputStream(readFile);
      ByteArrayOutputStream stream = new ByteArrayOutputStream();
      byte[] buffer = new byte[1024];
      int length = -1;
      while ((length = inStream.read(buffer)) != -1) {
        stream.write(buffer, 0, length);
      }
      str = stream.toString();
      stream.close();
      inStream.close();
      return str;
    } catch (FileNotFoundException e) {
      e.printStackTrace();
      return null;
    } catch (IOException e) {
      e.printStackTrace();
      return null;
    }
  }

  /**
   * 十六进制相加
   * @param hexdata
   * @return
   */
  public static String makeChecksum(String hexdata) {
    if (hexdata == null || hexdata.equals("")) {
      return "00";
    }
    hexdata = hexdata.replaceAll(" ", "");
    int total = 0;
    int len = hexdata.length();
    if (len % 2 != 0) {
      return "00";
    }
    int num = 0;
    while (num < len) {
      String s = hexdata.substring(num, num + 2);
      total += Integer.parseInt(s, 16);
      num = num + 2;
    }
    return hexInt(total);
  }

  public static String hexInt(int total) {
    int a = total / 256;
    int b = total % 256;
    if (a > 255) {
      return hexInt(a) + format(b);
    }
    return format(a) + format(b);
  }

  public static String format(int hex) {
    String hexa = Integer.toHexString(hex);
    int len = hexa.length();
    if (len < 2) {
      hexa = "0" + hexa;
    }
    return hexa;
  }


}
