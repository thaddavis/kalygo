export const approval_program = `#pragma version 8
txn ApplicationID
int 0
==
bnz main_l31
txn OnCompletion
int DeleteApplication
==
bnz main_l28
txn OnCompletion
int UpdateApplication
==
bnz main_l25
txn OnCompletion
int OptIn
==
bnz main_l24
txn OnCompletion
int CloseOut
==
bnz main_l23
txn OnCompletion
int NoOp
==
bnz main_l7
err
main_l7:
callsub guardcreatorwithdrawbalance_0
bnz main_l22
callsub guardbuyerwithdrawbalance_1
bnz main_l21
callsub guardsellerwithdrawbalance_2
bnz main_l20
callsub guardoptoutfromASA_4
bnz main_l19
callsub guardbuyersetpullout_6
bnz main_l18
callsub guardbuyerwithdrawASA_5
bnz main_l17
callsub guardoptintoASA_3
bnz main_l15
err
main_l15:
callsub optintoASA_9
main_l16:
int 0
return
main_l17:
callsub withdrawASA_11
b main_l16
main_l18:
callsub buyersetpullout_12
b main_l16
main_l19:
callsub optoutfromASA_10
b main_l16
main_l20:
callsub withdrawbalance_8
b main_l16
main_l21:
callsub withdrawbalance_8
b main_l16
main_l22:
callsub withdrawbalance_8
b main_l16
main_l23:
int 1
return
main_l24:
int 0
return
main_l25:
byte "global_creator"
app_global_get
txn Sender
==
bnz main_l27
err
main_l27:
int 1
return
main_l28:
global CurrentApplicationAddress
balance
int 0
==
bnz main_l30
int 0
return
main_l30:
int 1
return
main_l31:
callsub initializecontract_7
int 1
return

// guard_creator_withdraw_balance
guardcreatorwithdrawbalance_0:
global GroupSize
int 1
==
byte "global_creator"
app_global_get
txn Sender
==
&&
txna ApplicationArgs 0
byte "withdraw_balance"
==
&&
retsub

// guard_buyer_withdraw_balance
guardbuyerwithdrawbalance_1:
global GroupSize
int 1
==
byte "global_buyer"
app_global_get
txn Sender
==
&&
txna ApplicationArgs 0
byte "withdraw_balance"
==
&&
retsub

// guard_seller_withdraw_balance
guardsellerwithdrawbalance_2:
global GroupSize
int 1
==
byte "global_seller"
app_global_get
txn Sender
==
&&
txna ApplicationArgs 0
byte "withdraw_balance"
==
&&
retsub

// guard_optin_to_ASA
guardoptintoASA_3:
global GroupSize
int 1
==
txn Sender
byte "global_buyer"
app_global_get
==
&&
txn TypeEnum
int appl
==
&&
txna ApplicationArgs 0
byte "optin_contract"
==
&&
retsub

// guard_optout_from_ASA
guardoptoutfromASA_4:
global GroupSize
int 1
==
txna ApplicationArgs 0
byte "optout_contract"
==
&&
retsub

// guard_buyer_withdraw_ASA
guardbuyerwithdrawASA_5:
global GroupSize
int 1
==
byte "global_buyer"
app_global_get
txn Sender
==
&&
txna ApplicationArgs 0
byte "withdraw_ASA"
==
&&
retsub

// guard_buyer_set_pullout
guardbuyersetpullout_6:
global GroupSize
int 1
==
byte "global_buyer"
app_global_get
txn Sender
==
&&
txna ApplicationArgs 0
byte "buyer_set_pullout"
==
&&
byte "global_enable_time_checks"
app_global_get
int 1
==
&&
global LatestTimestamp
byte "global_inspection_end_date"
app_global_get
<
&&
retsub

// initialize_contract
initializecontract_7:
byte "global_enable_time_checks"
txna ApplicationArgs 10
btoi
app_global_put
byte "global_asa_id"
txna ApplicationArgs 11
btoi
app_global_put
byte "global_buyer_pullout_flag"
int 0
app_global_put
byte "global_creator"
txn Sender
app_global_put
byte "global_buyer"
txna ApplicationArgs 0
app_global_put
byte "global_seller"
txna ApplicationArgs 1
app_global_put
txna ApplicationArgs 2
btoi
int 100000
>=
txna ApplicationArgs 3
btoi
int 100000
>=
&&
txna ApplicationArgs 2
btoi
txna ApplicationArgs 3
btoi
+
txna ApplicationArgs 4
btoi
==
&&
bnz initializecontract_7_l5
int 0
return
initializecontract_7_l2:
txna ApplicationArgs 5
btoi
txna ApplicationArgs 6
btoi
<=
txna ApplicationArgs 6
btoi
txna ApplicationArgs 7
btoi
<=
&&
txna ApplicationArgs 7
btoi
txna ApplicationArgs 8
btoi
<=
&&
bnz initializecontract_7_l4
int 0
return
initializecontract_7_l4:
byte "global_inspection_start_date"
txna ApplicationArgs 5
btoi
app_global_put
byte "global_inspection_end_date"
txna ApplicationArgs 6
btoi
app_global_put
byte "global_moving_date"
txna ApplicationArgs 7
btoi
app_global_put
byte "global_closing_date"
txna ApplicationArgs 8
btoi
app_global_put
byte "global_free_funds_date"
txna ApplicationArgs 9
btoi
app_global_put
b initializecontract_7_l6
initializecontract_7_l5:
byte "global_escrow_payment_1"
txna ApplicationArgs 2
btoi
app_global_put
byte "global_escrow_payment_2"
txna ApplicationArgs 3
btoi
app_global_put
byte "global_escrow_total"
txna ApplicationArgs 4
btoi
app_global_put
b initializecontract_7_l2
initializecontract_7_l6:
retsub

// withdraw_balance
withdrawbalance_8:
itxn_begin
int pay
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
int 1
return

// optin_to_ASA
optintoASA_9:
itxn_begin
int axfer
itxn_field TypeEnum
byte "global_asa_id"
app_global_get
itxn_field XferAsset
int 0
itxn_field AssetAmount
global CurrentApplicationAddress
itxn_field Sender
global CurrentApplicationAddress
itxn_field AssetReceiver
int 0
itxn_field Fee
itxn_submit
int 1
return

// optout_from_ASA
optoutfromASA_10:
itxn_begin
int axfer
itxn_field TypeEnum
byte "global_asa_id"
app_global_get
itxn_field XferAsset
global CurrentApplicationAddress
itxn_field AssetCloseTo
global CurrentApplicationAddress
itxn_field Sender
global CurrentApplicationAddress
itxn_field AssetReceiver
int 0
itxn_field Fee
itxn_submit
int 1
return

// withdraw_ASA
withdrawASA_11:
global CurrentApplicationAddress
byte "global_asa_id"
app_global_get
asset_holding_get AssetBalance
store 1
store 0
itxn_begin
int axfer
itxn_field TypeEnum
byte "global_asa_id"
app_global_get
itxn_field XferAsset
load 0
itxn_field AssetAmount
global CurrentApplicationAddress
itxn_field Sender
txn Sender
itxn_field AssetReceiver
int 0
itxn_field Fee
itxn_submit
int 1
return

// buyer_set_pullout
buyersetpullout_12:
byte "global_buyer_pullout_flag"
int 1
app_global_put
int 1
return`;
