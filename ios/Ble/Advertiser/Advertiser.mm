//
//  Advertiser.m
//  fan
//
//  Created by mac on 2020/2/5.
//  Copyright © 2020 Facebook. All rights reserved.

#import "Advertiser.h"
#import "BleUtil.h"

#define TARGET_ADDRESS  {0xcc, 0xcc, 0xcc, 0xcc, 0xcc}
#define ADDRESS_LENGTH  5

@implementation Advertiser{
  NSMutableArray* UUIDs;
}

@synthesize peripheralManager;

- (void)peripheralManagerDidUpdateState:(nonnull CBPeripheralManager *)peripheral {
  
}

- (void)initialize {
  peripheralManager = [[CBPeripheralManager alloc] initWithDelegate:self queue:nil];
}

- (BOOL)isBLEEnabled {
  return peripheralManager.state == CBManagerStatePoweredOn;
}

- (void)setPayload :(unsigned char *)payload OfLength:(int)length {
  
  @autoreleasepool {
    int resPayloadLen = length + ADDRESS_LENGTH + PREAMBLE_LENGTH + CRC_LENGTH;
    resPayloadLen = (resPayloadLen%2 == 1)?resPayloadLen+1:resPayloadLen;
    unsigned char address[] = TARGET_ADDRESS;
    unsigned char resPayload[resPayloadLen];
    get_rf_payload(address, ADDRESS_LENGTH, payload, length, resPayload);
//    for (int i = 0; i != resPayloadLen; ++i) {
//        //NSLog(@"zhy resPayload[%d]: %x", i, resPayload[i]);
//      printf("zhy resPayload[%d]：%x\n", i, resPayload[i]);
//    }
    
    for (int i = 0; i != resPayloadLen/2; ++i) {
      int tmp = resPayload[i*2+1];
      resPayload[i*2+1] = resPayload[i*2];
      resPayload[i*2] = tmp;
    }
    
    if (UUIDs != nil) {
      [UUIDs removeAllObjects];
    } else {
      UUIDs = [[NSMutableArray alloc] init];
    }
    for (int i = 0; i != resPayloadLen/2; ++i) {
      NSData* data = [[NSData alloc] initWithBytes:resPayload+i*2 length:2];
      [UUIDs addObject:[CBUUID UUIDWithData:data]];
    }
    for (int i = 0; i != 6; ++i) {
      NSLog(@"zhy UUIDs[%d]: %@", i, UUIDs[i]);
    }
  }
}

- (void)start {
  if ([self isBLEEnabled] && ![peripheralManager isAdvertising] && UUIDs != nil) {
    [peripheralManager startAdvertising:@{CBAdvertisementDataServiceUUIDsKey:UUIDs}];
  }
}

- (void)stop {
  if ([peripheralManager isAdvertising])
    [peripheralManager stopAdvertising];
}

- (BOOL)isAdvertising {
  return [peripheralManager isAdvertising];
}

@end
