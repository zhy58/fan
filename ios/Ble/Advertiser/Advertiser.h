//
//  Advertiser.h
//  PANBLEPeripherialDemo
//
//  Created by 佳文 on 2018/9/26.
//  Copyright © 2018年 Panchip. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <CoreBluetooth/CoreBluetooth.h>

#define ADDRESS_LENGTH          5
#define ADV_EXHEADER_LENGTH     13
#define PAYLOAD_MAX_LENGTH      16

@interface Advertiser : NSObject<CBPeripheralManagerDelegate>

@property (strong, nonatomic) CBPeripheralManager* peripheralManager;

- (void)initialize;
- (void)start;
- (void)stop;
- (BOOL)isAdvertising;
- (void)setAddress:(Byte *)address ofLength:(int)addrLength andPayload:(Byte *)payload ofLength:(int)payloadLength ;
- (int)getAdvPayload:(Byte *)advPayload;

- (BOOL)isBluetoothEnabled;

@end
