#ifndef BleUtil_h
#define BleUtil_h
#include "whitening.h"
#include "crc16.h"

#define BLE_CHANNEL_INDEX    37

#define PREAMBLE_LENGTH        3
#define CRC_LENGTH            2

void get_rf_payload(const unsigned char *address, int address_length, int header_length,   // input:    address
                    const unsigned char *rf_payload, int rf_payload_width,                 // input:    payload data (xn297l)
                    unsigned char *output_ble_payload);                                    // output:    BLE additional data

#endif /* BleUtil_h */
