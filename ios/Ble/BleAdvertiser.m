//
//  BleAdvertiser.m
//  fan
//
//  Created by mac on 2020/2/5.
//  Copyright © 2020 Facebook. All rights reserved.
//

#import "BleAdvertiser.h"
#import "Advertiser.h"
#import "sqlite3.h"

@implementation BleAdvertiser {
  Advertiser* advertiser;
  NSArray* HEXs;
  NSString* rawAddress;
  sqlite3 *_db;
}

RCT_EXPORT_MODULE(BLEAdvertiser);

RCT_EXPORT_METHOD(initBLE){
    HEXs = @[@"0", @"1", @"2", @"3", @"4", @"5", @"6", @"7", @"8", @"9", @"A", @"B", @"C", @"D", @"E", @"F"];
    rawAddress = @"cc cc cc cc cc";
  
    advertiser = [[Advertiser alloc] init];
    [advertiser initialize];
    [self openSqlite];
}

RCT_EXPORT_METHOD(checkBLEState:(RCTPromiseResolveBlock)resolve rejectChoose:(RCTPromiseRejectBlock)reject){
  @try{
    NSMutableDictionary *dic = [NSMutableDictionary dictionary];
    bool b = [advertiser isBluetoothEnabled];
    [dic setValue:b ? @YES : @NO forKey:@"status"];
    resolve(dic);
  }@catch(NSException *exception){
    NSError *error = [NSError errorWithDomain:NSURLErrorDomain code:121 userInfo:@{NSLocalizedDescriptionKey:exception.reason}];
    reject(@"no_events", @"There were no events", error);
  }
}

RCT_EXPORT_METHOD(close) {
  [self closeSqlite];
}

RCT_REMAP_METHOD(choose, :(NSString *)deviceid :(NSString *)name resolveChoose:(RCTPromiseResolveBlock)resolve rejectChoose:(RCTPromiseRejectBlock)reject) {
  @try{
    NSMutableDictionary *dic = [NSMutableDictionary dictionary];
    if(![self isEqualToNil:deviceid]) {
      NSDictionary *dict = @{@"id":deviceid};
      //首先判断能否转化为一个json数据，如果能，接下来先把foundation对象转化为NSData类型，然后写入文件
      if ([NSJSONSerialization isValidJSONObject:dict]) {
        NSData *jsonData = [NSJSONSerialization dataWithJSONObject:dict options:NSJSONWritingPrettyPrinted error:nil];
        NSString *filePath = [NSHomeDirectory() stringByAppendingString:@"/Documents/AiFanConfig.json"];
        [jsonData writeToFile:filePath atomically:YES];
      }
      [dic setValue:@YES forKey:@"status"];
    }else{
      [dic setValue:@NO forKey:@"status"];
    }
    resolve(dic);
  }@catch(NSException *exception){
    NSError *error = [NSError errorWithDomain:NSURLErrorDomain code:121 userInfo:@{NSLocalizedDescriptionKey:exception.reason}];
    reject(@"no_events", @"There were no events", error);
  }
}

RCT_REMAP_METHOD(currentDevice, resolveCurrent:(RCTPromiseResolveBlock)resolve rejectCurrent:(RCTPromiseRejectBlock)reject) {
  @try{
    NSMutableDictionary *dic = [NSMutableDictionary dictionary];
    NSString *filePath = [NSHomeDirectory() stringByAppendingString:@"/Documents/AiFanConfig.json"];
    
    if(![self isEqualToNil:filePath]){
      NSData *data = [NSData dataWithContentsOfFile:filePath];//获取指定路径的data文件
      
      if(data != nil){
        id json = [NSJSONSerialization JSONObjectWithData:data options:NSJSONReadingAllowFragments error:nil]; //获取到json文件的跟数据（字典）
        NSString *deviceid = [json objectForKey:@"id"];
        
        if(![self isEqualToNil:deviceid]){
          NSString *sql = [NSString stringWithFormat:@"SELECT deviceid,name FROM aifan WHERE deviceid = '%@';", deviceid];
          sqlite3_stmt * stmt;
          int ret = sqlite3_prepare_v2(_db, sql.UTF8String, -1, &stmt, NULL);
          if (ret == SQLITE_OK) {
            while (sqlite3_step(stmt) == SQLITE_ROW) {
              [dic setValue:deviceid forKey:@"id"];
              //参数1:结果集
              //参数2:列数
              const unsigned char *name = sqlite3_column_text(stmt, 1);
              [dic setValue:[[NSString alloc] initWithUTF8String:(char*)name] forKey:@"name"];
            }
          }
        }
        
      }
      
    }
    resolve(dic);
  }@catch(NSException *exception){
    NSError *error = [NSError errorWithDomain:NSURLErrorDomain code:121 userInfo:@{NSLocalizedDescriptionKey:exception.reason}];
    reject(@"no_events", @"There were no events", error);
  }
}

RCT_REMAP_METHOD(getDevices, :(RCTPromiseResolveBlock)resolve :(RCTPromiseRejectBlock)reject) {
  @try{
    NSArray *array = [self querySqlite];
    resolve(array);
  }@catch(NSException *exception){
    NSError *error = [NSError errorWithDomain:NSURLErrorDomain code:121 userInfo:@{NSLocalizedDescriptionKey:exception.reason}];
    reject(@"no_events", @"There were no events", error);
  }
}

RCT_REMAP_METHOD(delete, :(NSString *)deviceid :(RCTPromiseResolveBlock)resolve :(RCTPromiseRejectBlock)reject){
  @try{
    NSMutableDictionary *dic = [NSMutableDictionary dictionary];
    BOOL b = [self execSqlite:3 :deviceid :@""];
    [dic setValue:@0 forKey:@"status"];
    if(!b){
       [dic setValue:@1 forKey:@"status"];
     }
     
//    if([[self sendOrder:15 :deviceid]  isEqual: @0]){
//      BOOL b = [self execSqlite:3 :deviceid :@""];
//      if(!b){
//        [dic setValue:@1 forKey:@"status"];
//      }
//      [dic setValue:@0 forKey:@"status"];
//    }else{
//      [dic setValue:@3 forKey:@"status"];
//    }
    NSArray *array = [self querySqlite];
    [dic setValue:array forKey:@"devices"];
    resolve(dic);
  }@catch(NSException *exception){
    NSError *error = [NSError errorWithDomain:NSURLErrorDomain code:121 userInfo:@{NSLocalizedDescriptionKey:exception.reason}];
    reject(@"no_events", @"There were no events", error);
  }
}

RCT_REMAP_METHOD(add, :(NSString *)name :(NSString *)deviceid resolveAdd:(RCTPromiseResolveBlock)resolve rejectAdd:(RCTPromiseRejectBlock)reject){
  @try{
    NSMutableDictionary *dic = [NSMutableDictionary dictionary];
    NSNumber * val = [self addDevice:name :deviceid];
    NSArray *array = [self querySqlite];
    [dic setValue:val forKey:@"status"];
    [dic setValue:array forKey:@"devices"];
    resolve(dic);
  }@catch(NSException *exception){
    NSError *error = [NSError errorWithDomain:NSURLErrorDomain code:121 userInfo:@{NSLocalizedDescriptionKey:exception.reason}];
    reject(@"no_events", @"There were no events", error);
  }
}

RCT_REMAP_METHOD(send, :(int)order :(NSString *)deviceid :(RCTPromiseResolveBlock)resolve :(RCTPromiseRejectBlock)reject) {
  @try{
    NSMutableDictionary *dic = [NSMutableDictionary dictionary];
    NSNumber *val = [self sendOrder:order :deviceid];
    [dic setValue:val forKey:@"status"];
    resolve(dic);
  }@catch(NSException *exception){
    NSError *error = [NSError errorWithDomain:NSURLErrorDomain code:121 userInfo:@{NSLocalizedDescriptionKey:exception.reason}];
    reject(@"no_events", @"There were no events", error);
  }
}

- (NSNumber *)addDevice:(NSString *)name :(NSString *)deviceid {
  int type = 1;
  if(![self isEqualToNil:deviceid]) {
    type = 2;
  }
  NSString *id = [self randomHexString:4];
  NSArray *array = [self querySqlite];
  switch (type) {
    case 1:
      for (int i = 0; i < array.count; i++) {
        if([name  isEqual: [array[i] valueForKey:@"name"]] || [id  isEqual: [array[i] valueForKey:@"id"]]){
          return @0;
        }
      }
      if(![[self sendOrder:14 :id]  isEqual: @0]){
        return @1;
      }
      BOOL b = [self execSqlite:2 :id :name];
      if(!b){
        return @5;
      }
      break;
    case 2:
      if(![self isEqualToNil:name]){
        BOOL b = [self execSqlite:4 :deviceid :name];
        if(!b){
          return @5;
        }
      }
      break;
      
    default:
      break;
  }
  return @3;
}

-  (NSNumber *)sendOrder:(int)order :(NSString *)deviceid {
  if([advertiser isBluetoothEnabled]) {
    // address handling
    rawAddress = [rawAddress uppercaseString];
    rawAddress = [rawAddress stringByReplacingOccurrencesOfString:@" " withString:@""];
    unsigned char addressBytes[rawAddress.length/2];
    [self string:rawAddress toBytes:addressBytes];
    
    NSString *rawPayload = [self instructions:order :deviceid];
    //NSLog(@"zhy rawPayload: %@", rawPayload);
    
    rawPayload = [rawPayload uppercaseString];
    rawPayload = [rawPayload stringByReplacingOccurrencesOfString:@" " withString:@""];
    unsigned char payloadBytes[rawPayload.length/2];
    [self string:rawPayload toBytes:payloadBytes];
    [advertiser setAddress:addressBytes ofLength:rawAddress.length/2 andPayload:payloadBytes ofLength:rawPayload.length/2];
    
    [advertiser start];
    [self delayMethod];
    return @0;
  }else {
    return @1;
  }
}

- (NSString *)randomHexString:(NSInteger)len {
  NSString *result = @"";
  for (int i = 0; i < len; ++i) {
    int r = arc4random() % [HEXs count];
    result = [result stringByAppendingString: [HEXs objectAtIndex:r]];
  }
  return result;
}

- (void)string:(NSString*)string toBytes:(unsigned char *)bytes {
  for (int i = 0; i != string.length/2; ++i) {
    NSString *firstChar = [NSString stringWithFormat:@"%c", [string characterAtIndex:i*2]], *secondChar = [NSString stringWithFormat:@"%c", [string characterAtIndex:i*2+1]];
    
    unsigned char firstHex = [self indexOfHexChar:firstChar], secondHex = [self indexOfHexChar:secondChar];
    bytes[i] = (firstHex << 4)|secondHex;
  }
}

- (unsigned char)indexOfHexChar:(NSString *)hexChar {
  for (int i = 0; i != HEXs.count; ++i) {
    if ([hexChar isEqualToString:[HEXs objectAtIndex:i]]) {
      return i;
    }
  }
  return 0;
}

- (void)delayMethod {
  dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(0.2 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
    [self->advertiser stop];
  });
}

- (NSString *)instructions:(int)order :(NSString *)deviceid {
  NSString *did = @"";
  if(order == 15){
    did = @"CC CC CC CC";
  }else{
    NSInteger len = deviceid.length;
    if(len != 4){
      return false;
    }
    
    NSString *iPre = @"";
    for(NSInteger i = 0; i < len; i++)
    {
      iPre = [NSString stringWithFormat:@"0"@"%c", [deviceid characterAtIndex:i]];
      did = [NSString stringWithFormat:@"%@%@", did, iPre];
    }
  }

  NSString *str = @"AA66";
  NSString *rawPayload = @"";
  NSString *inst = @"";
  switch (order) {
    case 0:
      rawPayload = @"A0";
      break;
    case 1:
      rawPayload = @"A1";
      break;
    case 2:
      rawPayload = @"A2";
      break;
    case 3:
      rawPayload = @"A3";
      break;
    case 4:
      rawPayload = @"A4";
      break;
    case 5:
      rawPayload = @"A5";
      break;
    case 6:
      rawPayload = @"A6";
      break;
    case 7:
      rawPayload = @"A7";
      break;
    case 8:
      rawPayload = @"A8";
      break;
    case 9:
      rawPayload = @"A9";
      break;
    case 10:
      rawPayload = @"B0";
      break;
    case 11:
      rawPayload = @"B1";
      break;
    case 12:
      rawPayload = @"B2";
      break;
    case 13:
      rawPayload = @"B3";
      break;
    case 14:
      rawPayload = @"B4";
      break;
    case 15:
      rawPayload = @"B5";
      break;
      
    default:
      break;
  }
  inst = [NSString stringWithFormat:@"%@%@%@ ", str, rawPayload,did];
  unsigned long res = 0;
  for(NSInteger j = 0; j < inst.length/2; j++){
    NSString *subChart = [inst  substringWithRange:NSMakeRange(j*2, 2)];
    unsigned long num = strtoul([subChart UTF8String],0,16);
    res = res + num;
  }
  Byte byteRes = res;
  NSString *hexStr = [self stringWithHexNumber:byteRes];
  hexStr = [hexStr uppercaseString];
  inst = [NSString stringWithFormat:@"%@%@ ", inst, hexStr];
  inst = [inst stringByReplacingOccurrencesOfString:@" " withString:@""];
  return inst;
}

- (NSString *)stringWithHexNumber:(NSUInteger)hexNumber{
  char hexChar[6];
  sprintf(hexChar, "%x", (int)hexNumber);
  
  NSString *hexString = [NSString stringWithCString:hexChar encoding:NSUTF8StringEncoding];
  
  return hexString;
}

- (BOOL)isEqualToNil:(NSString*)str {
  return str.length<=0 ||[str isEqualToString:@""] || !str;
}

- (BOOL)execSqlite:(int)type :(NSString *)deviceid :(NSString *)name{
  //1.设计sql语句
  //const char * sql = "CREATE TABLE IF NOT EXISTS aifan(id text PRIMARY KEY AUTOINCREMENT, deviceid text NOT NULL, name text NOT NULL);";
  //const char * sql = "INSERT INTO aifan (deviceid,name) VALUES ('','');";
  //const char * sql = "DELETE FROM aifan WHERE deviceid = '';";
  //const char * sql = "UPDATE aifan SET deviceid = '', name = '';";
  NSString *sql = @"";
  switch (type) {
      case 1:
      sql = @"CREATE TABLE IF NOT EXISTS aifan(id INTEGER PRIMARY KEY AUTOINCREMENT, deviceid text NOT NULL, name text NOT NULL);";
      break;
      case 2:
      sql = [NSString stringWithFormat:@"INSERT INTO aifan (deviceid,name) VALUES ('%@', '%@');", deviceid, name];
      break;
    case 3:
      sql = [NSString stringWithFormat:@"DELETE FROM aifan WHERE deviceid = '%@';", deviceid];
      break;
    case 4:
      sql = [NSString stringWithFormat:@"UPDATE aifan SET name = '%@' WHERE deviceid = '%@';", name, deviceid];
      break;
      
      default:
      break;
  }
  
  //2.执行sql语句
  //通过sqlite3_exec方法可以执行创建表、数据的插入、数据的删除以及数据的更新操作；但是数据查询的sql语句不能使用这个方法来执行
  //参数1:数据库指针(需要操作的数据库)
  //参数2:需要执行的sql语句
  //返回值:执行结果
  char *errorMesg = NULL; // 用来存储错误信息
  int ret = sqlite3_exec(_db, sql.UTF8String, NULL, NULL, &errorMesg);
  
  //3.判断执行结果
  if (ret == SQLITE_OK) {
    NSLog(@"zhy %d 操作成功", type);
    return true;
  }else{
    NSLog(@"zhy %d 操作失败: %s", type, errorMesg);
    return false;
  }
}

- (NSArray *)querySqlite {
  NSMutableArray *array = [[NSMutableArray alloc] init];
  //1.创建数据查询的sql语句
  const char * sql = "SELECT deviceid,name FROM aifan;";
  
  //2.执行sql语句
  //参数1:数据库
  //参数2:sql语句
  //参数3:sql语句的长度(-1自动计算)
  //参数4:结果集(用来收集查询结果)
  //参数5:NULL
  sqlite3_stmt * stmt;
  int ret = sqlite3_prepare_v2(_db, sql, -1, &stmt, NULL);
  if (ret == SQLITE_OK) {
    //NSLog(@"zhy 查询成功");
    //遍历结果集拿到查询到的数据
    //sqlite3_step获取结果集数据
    while (sqlite3_step(stmt) == SQLITE_ROW) {
      //参数1:结果集
      //参数2:列数
      const unsigned char *deviceid = sqlite3_column_text(stmt, 0);
      const unsigned char *name = sqlite3_column_text(stmt, 1);
      NSMutableDictionary *dic = [NSMutableDictionary dictionary];
      [dic setValue:[[NSString alloc] initWithUTF8String:(char*)deviceid] forKey:@"id"];
      [dic setValue:[[NSString alloc] initWithUTF8String:(char*)name] forKey:@"name"];
      [array addObject:dic];
    }
  }else{
    NSLog(@"zhy 查询失败");
  }
  return array;
}

- (void)openSqlite {
  //1.打开数据库(如果指定的数据库文件存在就直接打开，不存在就创建一个新的数据文件)
  //参数1:需要打开的数据库文件路径(iOS中一般将数据库文件放到沙盒目录下的Documents下)
  NSString *nsPath = [NSString stringWithFormat:@"%@/Documents/fan.sqlite", NSHomeDirectory()];
  const char *path = [nsPath UTF8String];
  
  //参数2:指向数据库变量的指针的地址
  //返回值:数据库操作结果
  int ret = sqlite3_open(path, &_db);
  
  //判断执行结果
  if (ret == SQLITE_OK) {
    //NSLog(@"zhy 打开数据库成功：%s", path);
    [self execSqlite:1 :@"" :@""];
  }else{
    NSLog(@"zhy 打开数据库失败：%s", path);
  }
}

- (void)closeSqlite {
  int ret = sqlite3_close(_db);
  if (ret == SQLITE_OK) {
    _db = nil;
    //NSLog(@"zhy 关闭数据库成功");
  }else {
    NSLog(@"zhy 关闭数据库失败");
  }
}

@end
