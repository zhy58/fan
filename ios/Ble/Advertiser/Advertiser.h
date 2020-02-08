//
//  Advertiser.h
//  fan
//
//  Created by mac on 2020/2/5.
//  Copyright © 2020 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <CoreBluetooth/CoreBluetooth.h>

@interface Advertiser : NSObject<CBPeripheralManagerDelegate>

@property (strong, nonatomic) CBPeripheralManager* peripheralManager;

- (void)initialize;
- (void)start;
- (void)stop;
- (BOOL)isAdvertising;
- (void)setPayload:(Byte *)payload OfLength:(int)length;

- (BOOL)isBLEEnabled;

@end
