//
//  Advertiser.m
//  PANBLEPeripherialDemo
//
//  Created by 佳文 on 2018/9/26.
//  Copyright © 2018年 Panchip. All rights reserved.
//

#import "Advertiser.h"
#import "BleUtil.h"

#define MAX_PAYLOAD_LEN     26

@implementation Advertiser {
    NSMutableArray* UUIDs;
    int actualPayloadLen;
    unsigned char resPayload[MAX_PAYLOAD_LEN];
}

@synthesize peripheralManager;


- (void)initialize {
    actualPayloadLen = -1;
    peripheralManager = [[CBPeripheralManager alloc] initWithDelegate:self queue:nil];
}

- (void)start {
    if ([self isBluetoothEnabled] && ![peripheralManager isAdvertising] && UUIDs != nil) {
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

- (void)setAddress:(Byte *)address ofLength:(int)addrLength andPayload:(unsigned char *)payload ofLength:(int)payloadLength {
    @autoreleasepool {
        actualPayloadLen = payloadLength + addrLength + PREAMBLE_LENGTH + CRC_LENGTH;
        
        get_rf_payload(address, addrLength, ADV_EXHEADER_LENGTH, payload, payloadLength, resPayload);
//        for (int i = 0; i != actualPayloadLen; ++i) {
//            NSLog(@"%x", resPayload[i]);
//        }
        
        for (int i = actualPayloadLen; i < MAX_PAYLOAD_LEN; ++i) {
            resPayload[i] = i;
        }
        
        for (int i = 0; i != MAX_PAYLOAD_LEN/2; ++i) {
            int tmp = resPayload[i*2+1];
            resPayload[i*2+1] = resPayload[i*2];
            resPayload[i*2] = tmp;
        }
        
        if (UUIDs != nil) {
            [UUIDs removeAllObjects];
        } else {
            UUIDs = [[NSMutableArray alloc] init];
        }
        for (int i = 0; i != MAX_PAYLOAD_LEN/2; ++i) {
            NSData* data = [[NSData alloc] initWithBytes:resPayload+i*2 length:2];
            [UUIDs addObject:[CBUUID UUIDWithData:data]];
        }
    }
}

- (int)getAdvPayload:(Byte *)advPayload {
    if (actualPayloadLen > 0)
        memcpy(advPayload, resPayload, actualPayloadLen);
    return actualPayloadLen;
}

- (BOOL)isBluetoothEnabled {
    return peripheralManager.state == CBManagerStatePoweredOn;
}

- (void)peripheralManagerDidStartAdvertising:(CBPeripheralManager *)peripheral error:(NSError *)error {
    NSLog(@"did start advertising");
}

- (void)peripheralManagerDidUpdateState:(nonnull CBPeripheralManager *)peripheral {
    
}

@end


