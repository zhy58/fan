package com.zhy.fan.ble;

import android.content.Context;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteOpenHelper;

public class SqlModel extends SQLiteOpenHelper {

  public SqlModel(Context context) {
    super(context, "aifanSystem.db", null, 1);
    // TODO Auto-generated constructor stub
  }

  @Override
  public void onCreate(SQLiteDatabase db) {
    // TODO Auto-generated method stub
    db.execSQL("create table aifan(_id integer primary key autoincrement, deviceid char(10), name VARCHAR(150))");
  }

  @Override
  public void onUpgrade(SQLiteDatabase db, int oldVersion, int newVersion) {
    // TODO Auto-generated method stub
  }
}
