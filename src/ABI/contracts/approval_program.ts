export const approval_program = `#pragma version 5
txn ApplicationID
int 0
==
bnz main_l27
txn OnCompletion
int DeleteApplication
==
bnz main_l26
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
txna ApplicationArgs 0
byte "signal_pull_out"
==
bnz main_l22
txna ApplicationArgs 0
byte "signal_arbitration"
==
bnz main_l21
txna ApplicationArgs 0
byte "seller_withdraw_funds"
==
bnz main_l20
txna ApplicationArgs 0
byte "buyer_withdraw_funds"
==
bnz main_l19
txna ApplicationArgs 0
byte "arbiter_withdraw_funds"
==
bnz main_l18
global GroupSize
int 2
==
gtxn 0 TypeEnum
int pay
==
&&
gtxn 1 TypeEnum
int appl
==
&&
gtxna 1 ApplicationArgs 0
byte "fund_contract"
==
&&
bnz main_l17
global GroupSize
int 2
==
gtxn 0 TypeEnum
int pay
==
&&
gtxn 1 TypeEnum
int appl
==
&&
gtxna 1 ApplicationArgs 0
byte "fund_minimum_balance"
==
&&
bnz main_l15
err
main_l15:
callsub sub7
main_l16:
int 0
return
main_l17:
callsub sub5
b main_l16
main_l18:
callsub sub4
b main_l16
main_l19:
callsub sub3
b main_l16
main_l20:
callsub sub2
b main_l16
main_l21:
callsub sub1
b main_l16
main_l22:
callsub sub0
b main_l16
main_l23:
int 1
return
main_l24:
int 0
return
main_l25:
int 1
return
main_l26:
callsub sub6
int 0
return
main_l27:
byte "creator"
txn Sender
app_global_put
byte "inspection_begin"
txna ApplicationArgs 0
btoi
app_global_put
byte "inspection_end"
txna ApplicationArgs 1
btoi
app_global_put
byte "inspection_extension"
txna ApplicationArgs 2
btoi
app_global_put
byte "closing_date"
txna ApplicationArgs 3
btoi
app_global_put
byte "closing_date_extension"
txna ApplicationArgs 4
btoi
app_global_put
byte "sale_price"
txna ApplicationArgs 5
btoi
txna ApplicationArgs 6
btoi
txna ApplicationArgs 7
btoi
+
==
txna ApplicationArgs 6
btoi
txna ApplicationArgs 7
btoi
<
&&
txna ApplicationArgs 5
btoi
int 100000
>
&&
bnz main_l30
int 0
return
main_l29:
app_global_put
byte "1st_escrow_amount"
txna ApplicationArgs 6
btoi
app_global_put
byte "2nd_escrow_amount"
txna ApplicationArgs 7
btoi
app_global_put
byte "buyer"
txna ApplicationArgs 8
app_global_put
byte "seller"
txna ApplicationArgs 9
app_global_put
byte "arbiter"
txn Sender
app_global_put
byte "signal_pull_out"
int 0
app_global_put
byte "signal_arbitration"
int 0
app_global_put
byte "enable_time_checks"
txna ApplicationArgs 11
btoi
app_global_put
int 1
return
main_l30:
txna ApplicationArgs 5
btoi
b main_l29
sub0: // signal_pull_out
txn Sender
byte "buyer"
app_global_get
==
byte "enable_time_checks"
app_global_get
int 1
==
global LatestTimestamp
byte "inspection_end"
app_global_get
<
&&
&&
bnz sub0_l2
int 0
return
sub0_l2:
byte "contract_address"
global CurrentApplicationAddress
app_global_put
byte "contract_balance"
global CurrentApplicationAddress
balance
app_global_put
byte "signal_pull_out"
byte "signal_pull_out"
app_global_get
int 1
+
app_global_put
int 1
return
sub1: // signal_arbitration
txn Sender
byte "buyer"
app_global_get
==
byte "enable_time_checks"
app_global_get
int 1
==
global LatestTimestamp
byte "closing_date_extension"
app_global_get
<
&&
&&
bnz sub1_l2
int 0
return
sub1_l2:
byte "signal_arbitration"
byte "signal_arbitration"
app_global_get
int 1
+
app_global_put
int 1
return
sub2: // seller_withdraw_funds
txn Sender
byte "seller"
app_global_get
==
byte "signal_pull_out"
app_global_get
int 0
==
&&
byte "signal_arbitration"
app_global_get
int 0
==
&&
byte "enable_time_checks"
app_global_get
int 1
==
global LatestTimestamp
byte "closing_date"
app_global_get
>
&&
&&
bnz sub2_l2
int 0
return
sub2_l2:
itxn_begin
int pay
itxn_field TypeEnum
global CurrentApplicationAddress
balance
global MinBalance
-
global MinTxnFee
-
itxn_field Amount
global CurrentApplicationAddress
itxn_field Sender
txn Sender
itxn_field Receiver
global MinTxnFee
itxn_field Fee
itxn_submit
int 1
return
sub3: // buyer_withdraw_funds
txn Sender
byte "buyer"
app_global_get
==
byte "enable_time_checks"
app_global_get
int 1
==
global LatestTimestamp
byte "inspection_end"
app_global_get
<
&&
&&
byte "signal_pull_out"
app_global_get
int 0
>
global CurrentApplicationAddress
balance
global MinBalance
-
global MinTxnFee
-
byte "1st_escrow_amount"
app_global_get
global MinTxnFee
-
>=
&&
&&
bnz sub3_l2
int 0
return
sub3_l2:
itxn_begin
int pay
itxn_field TypeEnum
byte "1st_escrow_amount"
app_global_get
global MinTxnFee
-
itxn_field Amount
global CurrentApplicationAddress
itxn_field Sender
txn Sender
itxn_field Receiver
global MinTxnFee
itxn_field Fee
itxn_submit
int 1
return
sub4: // arbiter_withdraw_funds
txn Sender
byte "arbiter"
app_global_get
==
byte "signal_arbitration"
app_global_get
int 0
>
&&
byte "enable_time_checks"
app_global_get
int 1
==
global LatestTimestamp
byte "closing_date"
app_global_get
>
&&
&&
byte "seller"
app_global_get
txna ApplicationArgs 1
==
byte "buyer"
app_global_get
txna ApplicationArgs 1
==
||
&&
bnz sub4_l2
int 0
return
sub4_l2:
itxn_begin
int pay
itxn_field TypeEnum
global CurrentApplicationAddress
balance
global MinBalance
-
global MinTxnFee
-
itxn_field Amount
global CurrentApplicationAddress
itxn_field Sender
txna Accounts 1
itxn_field Receiver
global MinTxnFee
itxn_field Fee
itxn_submit
int 1
return
sub5: // fund_account
gtxn 0 Sender
byte "buyer"
app_global_get
==
gtxn 0 Amount
byte "1st_escrow_amount"
app_global_get
==
&&
gtxn 0 Sender
byte "buyer"
app_global_get
==
gtxn 0 Amount
byte "2nd_escrow_amount"
app_global_get
==
&&
||
bnz sub5_l2
int 0
return
sub5_l2:
byte "contract_address"
global CurrentApplicationAddress
app_global_put
byte "contract_balance"
global CurrentApplicationAddress
balance
app_global_put
int 1
return
sub6: // delete_app
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
byte "creator"
app_global_get
itxn_field Receiver
global MinTxnFee
itxn_field Fee
txn Sender
itxn_field CloseRemainderTo
itxn_submit
int 1
return
sub7: // fund_minimum_balance
gtxn 0 Sender
byte "buyer"
app_global_get
==
gtxn 0 Sender
byte "creator"
app_global_get
==
||
gtxn 0 Sender
byte "seller"
app_global_get
==
||
gtxn 0 Sender
byte "arbiter"
app_global_get
==
||
bnz sub7_l2
int 0
return
sub7_l2:
int 1
return`;
