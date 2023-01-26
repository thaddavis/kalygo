export const approval_program = `#pragma version 8
intcblock 0 1 4 100000
bytecblock 0x676c6f62616c5f6275796572 0x676c6f62616c5f6173615f6964 0x676c6f62616c5f73656c6c6572 0x676c6f62616c5f636c6f73696e675f64617465 0x676c6f62616c5f696e7370656374696f6e5f656e645f64617465 0x676c6f62616c5f62757965725f70756c6c6f75745f666c6167 0x676c6f62616c5f62757965725f6172626974726174696f6e5f666c6167 0x676c6f62616c5f73656c6c65725f6172626974726174696f6e5f666c6167 0x 0x676c6f62616c5f657363726f775f7061796d656e745f31 0x676c6f62616c5f657363726f775f7061796d656e745f32 0x676c6f62616c5f746f74616c5f7072696365 0x676c6f62616c5f696e7370656374696f6e5f73746172745f64617465 0x676c6f62616c5f696e7370656374696f6e5f657874656e73696f6e5f64617465 0x676c6f62616c5f6d6f76696e675f64617465 0x676c6f62616c5f667265655f66756e64735f64617465
txn NumAppArgs
intc_0 // 0
==
bnz main_l18
txna ApplicationArgs 0
pushbytes 0x26a3448f // "create(address,address,uint64,uint64,uint64,uint64,uint64,uint64,uint64,uint64,uint64,uint64)void"
==
bnz main_l17
txna ApplicationArgs 0
pushbytes 0x1cd7c51b // "buyer_set_arbitration()void"
==
bnz main_l16
txna ApplicationArgs 0
pushbytes 0xbb974a27 // "buyer_set_pullout()void"
==
bnz main_l15
txna ApplicationArgs 0
pushbytes 0x2088d1e1 // "optin_to_ASA()void"
==
bnz main_l14
txna ApplicationArgs 0
pushbytes 0xfb81e7a1 // "optout_from_ASA()void"
==
bnz main_l13
txna ApplicationArgs 0
pushbytes 0x48552f80 // "seller_set_arbitration()void"
==
bnz main_l12
txna ApplicationArgs 0
pushbytes 0x52807b3f // "withdraw_ASA()void"
==
bnz main_l11
txna ApplicationArgs 0
pushbytes 0xb3b58482 // "withdraw_balance()void"
==
bnz main_l10
err
main_l10:
txn OnCompletion
intc_0 // NoOp
==
txn ApplicationID
intc_0 // 0
!=
&&
assert
callsub withdrawbalance_15
intc_1 // 1
return
main_l11:
txn OnCompletion
intc_0 // NoOp
==
txn ApplicationID
intc_0 // 0
!=
&&
assert
callsub withdrawASA_14
intc_1 // 1
return
main_l12:
txn OnCompletion
intc_0 // NoOp
==
txn ApplicationID
intc_0 // 0
!=
&&
assert
callsub sellersetarbitration_13
intc_1 // 1
return
main_l13:
txn OnCompletion
intc_0 // NoOp
==
txn ApplicationID
intc_0 // 0
!=
&&
assert
callsub optoutfromASA_12
intc_1 // 1
return
main_l14:
txn OnCompletion
intc_0 // NoOp
==
txn ApplicationID
intc_0 // 0
!=
&&
assert
callsub optintoASA_11
intc_1 // 1
return
main_l15:
txn OnCompletion
intc_0 // NoOp
==
txn ApplicationID
intc_0 // 0
!=
&&
assert
callsub buyersetpullout_10
intc_1 // 1
return
main_l16:
txn OnCompletion
intc_0 // NoOp
==
txn ApplicationID
intc_0 // 0
!=
&&
assert
callsub buyersetarbitration_9
intc_1 // 1
return
main_l17:
txn OnCompletion
intc_0 // NoOp
==
txn ApplicationID
intc_0 // 0
==
&&
assert
txna ApplicationArgs 1
store 7
txna ApplicationArgs 2
store 8
txna ApplicationArgs 3
btoi
store 9
txna ApplicationArgs 4
btoi
store 10
txna ApplicationArgs 5
btoi
store 11
txna ApplicationArgs 6
btoi
store 12
txna ApplicationArgs 7
btoi
store 13
txna ApplicationArgs 8
btoi
store 14
txna ApplicationArgs 9
btoi
store 15
txna ApplicationArgs 10
btoi
store 16
txna ApplicationArgs 11
btoi
store 17
txna ApplicationArgs 12
btoi
store 18
load 7
load 8
load 9
load 10
load 11
load 12
load 13
load 14
load 15
load 16
load 17
load 18
callsub create_8
intc_1 // 1
return
main_l18:
txn OnCompletion
pushint 5 // DeleteApplication
==
bnz main_l20
err
main_l20:
txn ApplicationID
intc_0 // 0
!=
assert
callsub delete_0
intc_1 // 1
return

// delete
delete_0:
intc_1 // 1
return

// guard_buyer_set_arbitration
guardbuyersetarbitration_1:
store 0
global GroupSize
intc_1 // 1
==
bytec_0 // "global_buyer"
app_global_get
load 0
==
&&
global LatestTimestamp
bytec_3 // "global_closing_date"
app_global_get
<
&&
intc_0 // 0
||
retsub

// guard_buyer_set_pullout
guardbuyersetpullout_2:
store 1
bytec_0 // "global_buyer"
app_global_get
txn Sender
==
global LatestTimestamp
bytec 4 // "global_inspection_end_date"
app_global_get
<
&&
retsub

// guard_optin_to_ASA
guardoptintoASA_3:
store 2
txn Sender
bytec_0 // "global_buyer"
app_global_get
==
retsub

// guard_optout_from_ASA
guardoptoutfromASA_4:
store 3
intc_1 // 1
retsub

// guard_seller_set_arbitration
guardsellersetarbitration_5:
store 4
bytec_2 // "global_seller"
app_global_get
txn Sender
==
global LatestTimestamp
bytec_3 // "global_closing_date"
app_global_get
<
&&
intc_0 // 0
||
retsub

// guard_withdraw_ASA
guardwithdrawASA_6:
store 5
bytec_2 // "global_seller"
app_global_get
txn Sender
==
bytec_0 // "global_buyer"
app_global_get
txn Sender
==
||
retsub

// guard_withdraw_balance
guardwithdrawbalance_7:
store 6
bytec_0 // "global_buyer"
app_global_get
txn Sender
==
bytec_2 // "global_seller"
app_global_get
txn Sender
==
||
retsub

// create
create_8:
store 30
store 29
store 28
store 27
store 26
store 25
store 24
store 23
store 22
store 21
store 20
store 19
bytec 5 // "global_buyer_pullout_flag"
intc_0 // 0
app_global_put
bytec 6 // "global_buyer_arbitration_flag"
intc_0 // 0
app_global_put
bytec 7 // "global_seller_arbitration_flag"
intc_0 // 0
app_global_put
pushbytes 0x676c6f62616c5f63726561746f72 // "global_creator"
txn Sender
app_global_put
bytec_0 // "global_buyer"
bytec 8 // ""
app_global_put
bytec_2 // "global_seller"
bytec 8 // ""
app_global_put
bytec 9 // "global_escrow_payment_1"
intc_0 // 0
app_global_put
bytec 10 // "global_escrow_payment_2"
intc_0 // 0
app_global_put
bytec 11 // "global_total_price"
intc_0 // 0
app_global_put
bytec 12 // "global_inspection_start_date"
intc_0 // 0
app_global_put
bytec 4 // "global_inspection_end_date"
intc_0 // 0
app_global_put
bytec 13 // "global_inspection_extension_date"
intc_0 // 0
app_global_put
bytec 14 // "global_moving_date"
intc_0 // 0
app_global_put
bytec_3 // "global_closing_date"
intc_0 // 0
app_global_put
bytec 15 // "global_free_funds_date"
intc_0 // 0
app_global_put
bytec_1 // "global_asa_id"
intc_0 // 0
app_global_put
bytec_0 // "global_buyer"
load 19
app_global_put
bytec_2 // "global_seller"
load 20
app_global_put
bytec_1 // "global_asa_id"
load 30
app_global_put
load 21
intc_3 // 100000
>=
load 22
intc_3 // 100000
>=
&&
load 21
load 22
+
load 23
==
&&
bnz create_8_l5
intc_0 // 0
return
create_8_l2:
load 24
load 25
<=
load 25
load 26
<=
&&
load 26
load 27
<=
&&
load 27
load 28
<=
&&
load 28
load 29
<=
&&
bnz create_8_l4
intc_0 // 0
return
create_8_l4:
bytec 12 // "global_inspection_start_date"
load 24
app_global_put
bytec 4 // "global_inspection_end_date"
load 25
app_global_put
bytec 13 // "global_inspection_extension_date"
load 26
app_global_put
bytec 14 // "global_moving_date"
load 27
app_global_put
bytec_3 // "global_closing_date"
load 28
app_global_put
bytec 15 // "global_free_funds_date"
load 29
app_global_put
b create_8_l6
create_8_l5:
bytec 9 // "global_escrow_payment_1"
load 21
app_global_put
bytec 10 // "global_escrow_payment_2"
load 22
app_global_put
bytec 11 // "global_total_price"
load 23
app_global_put
b create_8_l2
create_8_l6:
retsub

// buyer_set_arbitration
buyersetarbitration_9:
txn Sender
callsub guardbuyersetarbitration_1
// unauthorized
assert
bytec 6 // "global_buyer_arbitration_flag"
intc_1 // 1
app_global_put
intc_1 // 1
return

// buyer_set_pullout
buyersetpullout_10:
txn Sender
callsub guardbuyersetpullout_2
// unauthorized
assert
bytec 5 // "global_buyer_pullout_flag"
intc_1 // 1
app_global_put
intc_1 // 1
return

// optin_to_ASA
optintoASA_11:
txn Sender
callsub guardoptintoASA_3
// unauthorized
assert
itxn_begin
intc_2 // axfer
itxn_field TypeEnum
bytec_1 // "global_asa_id"
app_global_get
itxn_field XferAsset
intc_0 // 0
itxn_field AssetAmount
global CurrentApplicationAddress
itxn_field Sender
global CurrentApplicationAddress
itxn_field AssetReceiver
intc_0 // 0
itxn_field Fee
itxn_submit
intc_1 // 1
return

// optout_from_ASA
optoutfromASA_12:
txn Sender
callsub guardoptoutfromASA_4
// unauthorized
assert
itxn_begin
intc_2 // axfer
itxn_field TypeEnum
bytec_1 // "global_asa_id"
app_global_get
itxn_field XferAsset
global CurrentApplicationAddress
itxn_field AssetCloseTo
global CurrentApplicationAddress
itxn_field Sender
global CurrentApplicationAddress
itxn_field AssetReceiver
intc_0 // 0
itxn_field Fee
itxn_submit
intc_1 // 1
return

// seller_set_arbitration
sellersetarbitration_13:
txn Sender
callsub guardsellersetarbitration_5
// unauthorized
assert
bytec 7 // "global_seller_arbitration_flag"
intc_1 // 1
app_global_put
intc_1 // 1
return

// withdraw_ASA
withdrawASA_14:
txn Sender
callsub guardwithdrawASA_6
// unauthorized
assert
global CurrentApplicationAddress
bytec_1 // "global_asa_id"
app_global_get
asset_holding_get AssetBalance
store 32
store 31
itxn_begin
intc_2 // axfer
itxn_field TypeEnum
bytec_1 // "global_asa_id"
app_global_get
itxn_field XferAsset
load 31
itxn_field AssetAmount
global CurrentApplicationAddress
itxn_field Sender
txn Sender
itxn_field AssetReceiver
intc_0 // 0
itxn_field Fee
itxn_submit
intc_1 // 1
return

// withdraw_balance
withdrawbalance_15:
txn Sender
callsub guardwithdrawbalance_7
// unauthorized
assert
itxn_begin
intc_1 // pay
itxn_field TypeEnum
global CurrentApplicationAddress
balance
global MinTxnFee
-
itxn_field Amount
global CurrentApplicationAddress
itxn_field Sender
txn Sender
itxn_field Receiver
global MinTxnFee
itxn_field Fee
txn Sender
itxn_field CloseRemainderTo
itxn_submit
intc_1 // 1
return`;
