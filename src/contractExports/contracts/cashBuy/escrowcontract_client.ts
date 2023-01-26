import algosdk from "algosdk";
import * as bkr from "beaker-ts";
export class EscrowContract extends bkr.ApplicationClient {
  desc: string = "";
  override appSchema: bkr.Schema = {
    declared: {
      global_buyer_pullout_flag: {
        type: bkr.AVMType.uint64,
        key: "global_buyer_pullout_flag",
        desc: "",
        static: false,
      },
      global_buyer_arbitration_flag: {
        type: bkr.AVMType.uint64,
        key: "global_buyer_arbitration_flag",
        desc: "",
        static: false,
      },
      global_seller_arbitration_flag: {
        type: bkr.AVMType.uint64,
        key: "global_seller_arbitration_flag",
        desc: "",
        static: false,
      },
      global_creator: {
        type: bkr.AVMType.bytes,
        key: "global_creator",
        desc: "",
        static: false,
      },
      global_buyer: {
        type: bkr.AVMType.bytes,
        key: "global_buyer",
        desc: "",
        static: false,
      },
      global_seller: {
        type: bkr.AVMType.bytes,
        key: "global_seller",
        desc: "",
        static: false,
      },
      global_escrow_payment_1: {
        type: bkr.AVMType.uint64,
        key: "global_escrow_payment_1",
        desc: "",
        static: false,
      },
      global_escrow_payment_2: {
        type: bkr.AVMType.uint64,
        key: "global_escrow_payment_2",
        desc: "",
        static: false,
      },
      global_total_price: {
        type: bkr.AVMType.uint64,
        key: "global_total_price",
        desc: "",
        static: false,
      },
      global_inspection_start_date: {
        type: bkr.AVMType.uint64,
        key: "global_inspection_start_date",
        desc: "",
        static: false,
      },
      global_inspection_end_date: {
        type: bkr.AVMType.uint64,
        key: "global_inspection_end_date",
        desc: "",
        static: false,
      },
      global_inspection_extension_date: {
        type: bkr.AVMType.uint64,
        key: "global_inspection_extension_date",
        desc: "",
        static: false,
      },
      global_moving_date: {
        type: bkr.AVMType.uint64,
        key: "global_moving_date",
        desc: "",
        static: false,
      },
      global_closing_date: {
        type: bkr.AVMType.uint64,
        key: "global_closing_date",
        desc: "",
        static: false,
      },
      global_free_funds_date: {
        type: bkr.AVMType.uint64,
        key: "global_free_funds_date",
        desc: "",
        static: false,
      },
      global_asa_id: {
        type: bkr.AVMType.uint64,
        key: "global_asa_id",
        desc: "",
        static: false,
      },
    },
    reserved: {},
  };
  override acctSchema: bkr.Schema = { declared: {}, reserved: {} };
  override approvalProgram: string =
    "I3ByYWdtYSB2ZXJzaW9uIDgKaW50Y2Jsb2NrIDAgMSA0IDEwMDAwMApieXRlY2Jsb2NrIDB4Njc2YzZmNjI2MTZjNWY2Mjc1Nzk2NTcyIDB4Njc2YzZmNjI2MTZjNWY2MTczNjE1ZjY5NjQgMHg2NzZjNmY2MjYxNmM1ZjczNjU2YzZjNjU3MiAweDY3NmM2ZjYyNjE2YzVmNjM2YzZmNzM2OTZlNjc1ZjY0NjE3NDY1IDB4Njc2YzZmNjI2MTZjNWY2OTZlNzM3MDY1NjM3NDY5NmY2ZTVmNjU2ZTY0NWY2NDYxNzQ2NSAweDY3NmM2ZjYyNjE2YzVmNjI3NTc5NjU3MjVmNzA3NTZjNmM2Zjc1NzQ1ZjY2NmM2MTY3IDB4Njc2YzZmNjI2MTZjNWY2Mjc1Nzk2NTcyNWY2MTcyNjI2OTc0NzI2MTc0Njk2ZjZlNWY2NjZjNjE2NyAweDY3NmM2ZjYyNjE2YzVmNzM2NTZjNmM2NTcyNWY2MTcyNjI2OTc0NzI2MTc0Njk2ZjZlNWY2NjZjNjE2NyAweCAweDY3NmM2ZjYyNjE2YzVmNjU3MzYzNzI2Zjc3NWY3MDYxNzk2ZDY1NmU3NDVmMzEgMHg2NzZjNmY2MjYxNmM1ZjY1NzM2MzcyNmY3NzVmNzA2MTc5NmQ2NTZlNzQ1ZjMyIDB4Njc2YzZmNjI2MTZjNWY3NDZmNzQ2MTZjNWY3MDcyNjk2MzY1IDB4Njc2YzZmNjI2MTZjNWY2OTZlNzM3MDY1NjM3NDY5NmY2ZTVmNzM3NDYxNzI3NDVmNjQ2MTc0NjUgMHg2NzZjNmY2MjYxNmM1ZjY5NmU3MzcwNjU2Mzc0Njk2ZjZlNWY2NTc4NzQ2NTZlNzM2OTZmNmU1ZjY0NjE3NDY1IDB4Njc2YzZmNjI2MTZjNWY2ZDZmNzY2OTZlNjc1ZjY0NjE3NDY1IDB4Njc2YzZmNjI2MTZjNWY2NjcyNjU2NTVmNjY3NTZlNjQ3MzVmNjQ2MTc0NjUKdHhuIE51bUFwcEFyZ3MKaW50Y18wIC8vIDAKPT0KYm56IG1haW5fbDE4CnR4bmEgQXBwbGljYXRpb25BcmdzIDAKcHVzaGJ5dGVzIDB4MjZhMzQ0OGYgLy8gImNyZWF0ZShhZGRyZXNzLGFkZHJlc3MsdWludDY0LHVpbnQ2NCx1aW50NjQsdWludDY0LHVpbnQ2NCx1aW50NjQsdWludDY0LHVpbnQ2NCx1aW50NjQsdWludDY0KXZvaWQiCj09CmJueiBtYWluX2wxNwp0eG5hIEFwcGxpY2F0aW9uQXJncyAwCnB1c2hieXRlcyAweDFjZDdjNTFiIC8vICJidXllcl9zZXRfYXJiaXRyYXRpb24oKXZvaWQiCj09CmJueiBtYWluX2wxNgp0eG5hIEFwcGxpY2F0aW9uQXJncyAwCnB1c2hieXRlcyAweGJiOTc0YTI3IC8vICJidXllcl9zZXRfcHVsbG91dCgpdm9pZCIKPT0KYm56IG1haW5fbDE1CnR4bmEgQXBwbGljYXRpb25BcmdzIDAKcHVzaGJ5dGVzIDB4MjA4OGQxZTEgLy8gIm9wdGluX3RvX0FTQSgpdm9pZCIKPT0KYm56IG1haW5fbDE0CnR4bmEgQXBwbGljYXRpb25BcmdzIDAKcHVzaGJ5dGVzIDB4ZmI4MWU3YTEgLy8gIm9wdG91dF9mcm9tX0FTQSgpdm9pZCIKPT0KYm56IG1haW5fbDEzCnR4bmEgQXBwbGljYXRpb25BcmdzIDAKcHVzaGJ5dGVzIDB4NDg1NTJmODAgLy8gInNlbGxlcl9zZXRfYXJiaXRyYXRpb24oKXZvaWQiCj09CmJueiBtYWluX2wxMgp0eG5hIEFwcGxpY2F0aW9uQXJncyAwCnB1c2hieXRlcyAweDUyODA3YjNmIC8vICJ3aXRoZHJhd19BU0EoKXZvaWQiCj09CmJueiBtYWluX2wxMQp0eG5hIEFwcGxpY2F0aW9uQXJncyAwCnB1c2hieXRlcyAweGIzYjU4NDgyIC8vICJ3aXRoZHJhd19iYWxhbmNlKCl2b2lkIgo9PQpibnogbWFpbl9sMTAKZXJyCm1haW5fbDEwOgp0eG4gT25Db21wbGV0aW9uCmludGNfMCAvLyBOb09wCj09CnR4biBBcHBsaWNhdGlvbklECmludGNfMCAvLyAwCiE9CiYmCmFzc2VydApjYWxsc3ViIHdpdGhkcmF3YmFsYW5jZV8xNQppbnRjXzEgLy8gMQpyZXR1cm4KbWFpbl9sMTE6CnR4biBPbkNvbXBsZXRpb24KaW50Y18wIC8vIE5vT3AKPT0KdHhuIEFwcGxpY2F0aW9uSUQKaW50Y18wIC8vIDAKIT0KJiYKYXNzZXJ0CmNhbGxzdWIgd2l0aGRyYXdBU0FfMTQKaW50Y18xIC8vIDEKcmV0dXJuCm1haW5fbDEyOgp0eG4gT25Db21wbGV0aW9uCmludGNfMCAvLyBOb09wCj09CnR4biBBcHBsaWNhdGlvbklECmludGNfMCAvLyAwCiE9CiYmCmFzc2VydApjYWxsc3ViIHNlbGxlcnNldGFyYml0cmF0aW9uXzEzCmludGNfMSAvLyAxCnJldHVybgptYWluX2wxMzoKdHhuIE9uQ29tcGxldGlvbgppbnRjXzAgLy8gTm9PcAo9PQp0eG4gQXBwbGljYXRpb25JRAppbnRjXzAgLy8gMAohPQomJgphc3NlcnQKY2FsbHN1YiBvcHRvdXRmcm9tQVNBXzEyCmludGNfMSAvLyAxCnJldHVybgptYWluX2wxNDoKdHhuIE9uQ29tcGxldGlvbgppbnRjXzAgLy8gTm9PcAo9PQp0eG4gQXBwbGljYXRpb25JRAppbnRjXzAgLy8gMAohPQomJgphc3NlcnQKY2FsbHN1YiBvcHRpbnRvQVNBXzExCmludGNfMSAvLyAxCnJldHVybgptYWluX2wxNToKdHhuIE9uQ29tcGxldGlvbgppbnRjXzAgLy8gTm9PcAo9PQp0eG4gQXBwbGljYXRpb25JRAppbnRjXzAgLy8gMAohPQomJgphc3NlcnQKY2FsbHN1YiBidXllcnNldHB1bGxvdXRfMTAKaW50Y18xIC8vIDEKcmV0dXJuCm1haW5fbDE2Ogp0eG4gT25Db21wbGV0aW9uCmludGNfMCAvLyBOb09wCj09CnR4biBBcHBsaWNhdGlvbklECmludGNfMCAvLyAwCiE9CiYmCmFzc2VydApjYWxsc3ViIGJ1eWVyc2V0YXJiaXRyYXRpb25fOQppbnRjXzEgLy8gMQpyZXR1cm4KbWFpbl9sMTc6CnR4biBPbkNvbXBsZXRpb24KaW50Y18wIC8vIE5vT3AKPT0KdHhuIEFwcGxpY2F0aW9uSUQKaW50Y18wIC8vIDAKPT0KJiYKYXNzZXJ0CnR4bmEgQXBwbGljYXRpb25BcmdzIDEKc3RvcmUgNwp0eG5hIEFwcGxpY2F0aW9uQXJncyAyCnN0b3JlIDgKdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMwpidG9pCnN0b3JlIDkKdHhuYSBBcHBsaWNhdGlvbkFyZ3MgNApidG9pCnN0b3JlIDEwCnR4bmEgQXBwbGljYXRpb25BcmdzIDUKYnRvaQpzdG9yZSAxMQp0eG5hIEFwcGxpY2F0aW9uQXJncyA2CmJ0b2kKc3RvcmUgMTIKdHhuYSBBcHBsaWNhdGlvbkFyZ3MgNwpidG9pCnN0b3JlIDEzCnR4bmEgQXBwbGljYXRpb25BcmdzIDgKYnRvaQpzdG9yZSAxNAp0eG5hIEFwcGxpY2F0aW9uQXJncyA5CmJ0b2kKc3RvcmUgMTUKdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMTAKYnRvaQpzdG9yZSAxNgp0eG5hIEFwcGxpY2F0aW9uQXJncyAxMQpidG9pCnN0b3JlIDE3CnR4bmEgQXBwbGljYXRpb25BcmdzIDEyCmJ0b2kKc3RvcmUgMTgKbG9hZCA3CmxvYWQgOApsb2FkIDkKbG9hZCAxMApsb2FkIDExCmxvYWQgMTIKbG9hZCAxMwpsb2FkIDE0CmxvYWQgMTUKbG9hZCAxNgpsb2FkIDE3CmxvYWQgMTgKY2FsbHN1YiBjcmVhdGVfOAppbnRjXzEgLy8gMQpyZXR1cm4KbWFpbl9sMTg6CnR4biBPbkNvbXBsZXRpb24KcHVzaGludCA1IC8vIERlbGV0ZUFwcGxpY2F0aW9uCj09CmJueiBtYWluX2wyMAplcnIKbWFpbl9sMjA6CnR4biBBcHBsaWNhdGlvbklECmludGNfMCAvLyAwCiE9CmFzc2VydApjYWxsc3ViIGRlbGV0ZV8wCmludGNfMSAvLyAxCnJldHVybgoKLy8gZGVsZXRlCmRlbGV0ZV8wOgppbnRjXzEgLy8gMQpyZXR1cm4KCi8vIGd1YXJkX2J1eWVyX3NldF9hcmJpdHJhdGlvbgpndWFyZGJ1eWVyc2V0YXJiaXRyYXRpb25fMToKc3RvcmUgMApnbG9iYWwgR3JvdXBTaXplCmludGNfMSAvLyAxCj09CmJ5dGVjXzAgLy8gImdsb2JhbF9idXllciIKYXBwX2dsb2JhbF9nZXQKbG9hZCAwCj09CiYmCmdsb2JhbCBMYXRlc3RUaW1lc3RhbXAKYnl0ZWNfMyAvLyAiZ2xvYmFsX2Nsb3NpbmdfZGF0ZSIKYXBwX2dsb2JhbF9nZXQKPAomJgppbnRjXzAgLy8gMAp8fApyZXRzdWIKCi8vIGd1YXJkX2J1eWVyX3NldF9wdWxsb3V0Cmd1YXJkYnV5ZXJzZXRwdWxsb3V0XzI6CnN0b3JlIDEKYnl0ZWNfMCAvLyAiZ2xvYmFsX2J1eWVyIgphcHBfZ2xvYmFsX2dldAp0eG4gU2VuZGVyCj09Cmdsb2JhbCBMYXRlc3RUaW1lc3RhbXAKYnl0ZWMgNCAvLyAiZ2xvYmFsX2luc3BlY3Rpb25fZW5kX2RhdGUiCmFwcF9nbG9iYWxfZ2V0CjwKJiYKcmV0c3ViCgovLyBndWFyZF9vcHRpbl90b19BU0EKZ3VhcmRvcHRpbnRvQVNBXzM6CnN0b3JlIDIKdHhuIFNlbmRlcgpieXRlY18wIC8vICJnbG9iYWxfYnV5ZXIiCmFwcF9nbG9iYWxfZ2V0Cj09CnJldHN1YgoKLy8gZ3VhcmRfb3B0b3V0X2Zyb21fQVNBCmd1YXJkb3B0b3V0ZnJvbUFTQV80OgpzdG9yZSAzCmludGNfMSAvLyAxCnJldHN1YgoKLy8gZ3VhcmRfc2VsbGVyX3NldF9hcmJpdHJhdGlvbgpndWFyZHNlbGxlcnNldGFyYml0cmF0aW9uXzU6CnN0b3JlIDQKYnl0ZWNfMiAvLyAiZ2xvYmFsX3NlbGxlciIKYXBwX2dsb2JhbF9nZXQKdHhuIFNlbmRlcgo9PQpnbG9iYWwgTGF0ZXN0VGltZXN0YW1wCmJ5dGVjXzMgLy8gImdsb2JhbF9jbG9zaW5nX2RhdGUiCmFwcF9nbG9iYWxfZ2V0CjwKJiYKaW50Y18wIC8vIDAKfHwKcmV0c3ViCgovLyBndWFyZF93aXRoZHJhd19BU0EKZ3VhcmR3aXRoZHJhd0FTQV82OgpzdG9yZSA1CmJ5dGVjXzIgLy8gImdsb2JhbF9zZWxsZXIiCmFwcF9nbG9iYWxfZ2V0CnR4biBTZW5kZXIKPT0KYnl0ZWNfMCAvLyAiZ2xvYmFsX2J1eWVyIgphcHBfZ2xvYmFsX2dldAp0eG4gU2VuZGVyCj09Cnx8CnJldHN1YgoKLy8gZ3VhcmRfd2l0aGRyYXdfYmFsYW5jZQpndWFyZHdpdGhkcmF3YmFsYW5jZV83OgpzdG9yZSA2CmJ5dGVjXzAgLy8gImdsb2JhbF9idXllciIKYXBwX2dsb2JhbF9nZXQKdHhuIFNlbmRlcgo9PQpieXRlY18yIC8vICJnbG9iYWxfc2VsbGVyIgphcHBfZ2xvYmFsX2dldAp0eG4gU2VuZGVyCj09Cnx8CnJldHN1YgoKLy8gY3JlYXRlCmNyZWF0ZV84OgpzdG9yZSAzMApzdG9yZSAyOQpzdG9yZSAyOApzdG9yZSAyNwpzdG9yZSAyNgpzdG9yZSAyNQpzdG9yZSAyNApzdG9yZSAyMwpzdG9yZSAyMgpzdG9yZSAyMQpzdG9yZSAyMApzdG9yZSAxOQpieXRlYyA1IC8vICJnbG9iYWxfYnV5ZXJfcHVsbG91dF9mbGFnIgppbnRjXzAgLy8gMAphcHBfZ2xvYmFsX3B1dApieXRlYyA2IC8vICJnbG9iYWxfYnV5ZXJfYXJiaXRyYXRpb25fZmxhZyIKaW50Y18wIC8vIDAKYXBwX2dsb2JhbF9wdXQKYnl0ZWMgNyAvLyAiZ2xvYmFsX3NlbGxlcl9hcmJpdHJhdGlvbl9mbGFnIgppbnRjXzAgLy8gMAphcHBfZ2xvYmFsX3B1dApwdXNoYnl0ZXMgMHg2NzZjNmY2MjYxNmM1ZjYzNzI2NTYxNzQ2ZjcyIC8vICJnbG9iYWxfY3JlYXRvciIKdHhuIFNlbmRlcgphcHBfZ2xvYmFsX3B1dApieXRlY18wIC8vICJnbG9iYWxfYnV5ZXIiCmJ5dGVjIDggLy8gIiIKYXBwX2dsb2JhbF9wdXQKYnl0ZWNfMiAvLyAiZ2xvYmFsX3NlbGxlciIKYnl0ZWMgOCAvLyAiIgphcHBfZ2xvYmFsX3B1dApieXRlYyA5IC8vICJnbG9iYWxfZXNjcm93X3BheW1lbnRfMSIKaW50Y18wIC8vIDAKYXBwX2dsb2JhbF9wdXQKYnl0ZWMgMTAgLy8gImdsb2JhbF9lc2Nyb3dfcGF5bWVudF8yIgppbnRjXzAgLy8gMAphcHBfZ2xvYmFsX3B1dApieXRlYyAxMSAvLyAiZ2xvYmFsX3RvdGFsX3ByaWNlIgppbnRjXzAgLy8gMAphcHBfZ2xvYmFsX3B1dApieXRlYyAxMiAvLyAiZ2xvYmFsX2luc3BlY3Rpb25fc3RhcnRfZGF0ZSIKaW50Y18wIC8vIDAKYXBwX2dsb2JhbF9wdXQKYnl0ZWMgNCAvLyAiZ2xvYmFsX2luc3BlY3Rpb25fZW5kX2RhdGUiCmludGNfMCAvLyAwCmFwcF9nbG9iYWxfcHV0CmJ5dGVjIDEzIC8vICJnbG9iYWxfaW5zcGVjdGlvbl9leHRlbnNpb25fZGF0ZSIKaW50Y18wIC8vIDAKYXBwX2dsb2JhbF9wdXQKYnl0ZWMgMTQgLy8gImdsb2JhbF9tb3ZpbmdfZGF0ZSIKaW50Y18wIC8vIDAKYXBwX2dsb2JhbF9wdXQKYnl0ZWNfMyAvLyAiZ2xvYmFsX2Nsb3NpbmdfZGF0ZSIKaW50Y18wIC8vIDAKYXBwX2dsb2JhbF9wdXQKYnl0ZWMgMTUgLy8gImdsb2JhbF9mcmVlX2Z1bmRzX2RhdGUiCmludGNfMCAvLyAwCmFwcF9nbG9iYWxfcHV0CmJ5dGVjXzEgLy8gImdsb2JhbF9hc2FfaWQiCmludGNfMCAvLyAwCmFwcF9nbG9iYWxfcHV0CmJ5dGVjXzAgLy8gImdsb2JhbF9idXllciIKbG9hZCAxOQphcHBfZ2xvYmFsX3B1dApieXRlY18yIC8vICJnbG9iYWxfc2VsbGVyIgpsb2FkIDIwCmFwcF9nbG9iYWxfcHV0CmJ5dGVjXzEgLy8gImdsb2JhbF9hc2FfaWQiCmxvYWQgMzAKYXBwX2dsb2JhbF9wdXQKbG9hZCAyMQppbnRjXzMgLy8gMTAwMDAwCj49CmxvYWQgMjIKaW50Y18zIC8vIDEwMDAwMAo+PQomJgpsb2FkIDIxCmxvYWQgMjIKKwpsb2FkIDIzCj09CiYmCmJueiBjcmVhdGVfOF9sNQppbnRjXzAgLy8gMApyZXR1cm4KY3JlYXRlXzhfbDI6CmxvYWQgMjQKbG9hZCAyNQo8PQpsb2FkIDI1CmxvYWQgMjYKPD0KJiYKbG9hZCAyNgpsb2FkIDI3Cjw9CiYmCmxvYWQgMjcKbG9hZCAyOAo8PQomJgpsb2FkIDI4CmxvYWQgMjkKPD0KJiYKYm56IGNyZWF0ZV84X2w0CmludGNfMCAvLyAwCnJldHVybgpjcmVhdGVfOF9sNDoKYnl0ZWMgMTIgLy8gImdsb2JhbF9pbnNwZWN0aW9uX3N0YXJ0X2RhdGUiCmxvYWQgMjQKYXBwX2dsb2JhbF9wdXQKYnl0ZWMgNCAvLyAiZ2xvYmFsX2luc3BlY3Rpb25fZW5kX2RhdGUiCmxvYWQgMjUKYXBwX2dsb2JhbF9wdXQKYnl0ZWMgMTMgLy8gImdsb2JhbF9pbnNwZWN0aW9uX2V4dGVuc2lvbl9kYXRlIgpsb2FkIDI2CmFwcF9nbG9iYWxfcHV0CmJ5dGVjIDE0IC8vICJnbG9iYWxfbW92aW5nX2RhdGUiCmxvYWQgMjcKYXBwX2dsb2JhbF9wdXQKYnl0ZWNfMyAvLyAiZ2xvYmFsX2Nsb3NpbmdfZGF0ZSIKbG9hZCAyOAphcHBfZ2xvYmFsX3B1dApieXRlYyAxNSAvLyAiZ2xvYmFsX2ZyZWVfZnVuZHNfZGF0ZSIKbG9hZCAyOQphcHBfZ2xvYmFsX3B1dApiIGNyZWF0ZV84X2w2CmNyZWF0ZV84X2w1OgpieXRlYyA5IC8vICJnbG9iYWxfZXNjcm93X3BheW1lbnRfMSIKbG9hZCAyMQphcHBfZ2xvYmFsX3B1dApieXRlYyAxMCAvLyAiZ2xvYmFsX2VzY3Jvd19wYXltZW50XzIiCmxvYWQgMjIKYXBwX2dsb2JhbF9wdXQKYnl0ZWMgMTEgLy8gImdsb2JhbF90b3RhbF9wcmljZSIKbG9hZCAyMwphcHBfZ2xvYmFsX3B1dApiIGNyZWF0ZV84X2wyCmNyZWF0ZV84X2w2OgpyZXRzdWIKCi8vIGJ1eWVyX3NldF9hcmJpdHJhdGlvbgpidXllcnNldGFyYml0cmF0aW9uXzk6CnR4biBTZW5kZXIKY2FsbHN1YiBndWFyZGJ1eWVyc2V0YXJiaXRyYXRpb25fMQovLyB1bmF1dGhvcml6ZWQKYXNzZXJ0CmJ5dGVjIDYgLy8gImdsb2JhbF9idXllcl9hcmJpdHJhdGlvbl9mbGFnIgppbnRjXzEgLy8gMQphcHBfZ2xvYmFsX3B1dAppbnRjXzEgLy8gMQpyZXR1cm4KCi8vIGJ1eWVyX3NldF9wdWxsb3V0CmJ1eWVyc2V0cHVsbG91dF8xMDoKdHhuIFNlbmRlcgpjYWxsc3ViIGd1YXJkYnV5ZXJzZXRwdWxsb3V0XzIKLy8gdW5hdXRob3JpemVkCmFzc2VydApieXRlYyA1IC8vICJnbG9iYWxfYnV5ZXJfcHVsbG91dF9mbGFnIgppbnRjXzEgLy8gMQphcHBfZ2xvYmFsX3B1dAppbnRjXzEgLy8gMQpyZXR1cm4KCi8vIG9wdGluX3RvX0FTQQpvcHRpbnRvQVNBXzExOgp0eG4gU2VuZGVyCmNhbGxzdWIgZ3VhcmRvcHRpbnRvQVNBXzMKLy8gdW5hdXRob3JpemVkCmFzc2VydAppdHhuX2JlZ2luCmludGNfMiAvLyBheGZlcgppdHhuX2ZpZWxkIFR5cGVFbnVtCmJ5dGVjXzEgLy8gImdsb2JhbF9hc2FfaWQiCmFwcF9nbG9iYWxfZ2V0Cml0eG5fZmllbGQgWGZlckFzc2V0CmludGNfMCAvLyAwCml0eG5fZmllbGQgQXNzZXRBbW91bnQKZ2xvYmFsIEN1cnJlbnRBcHBsaWNhdGlvbkFkZHJlc3MKaXR4bl9maWVsZCBTZW5kZXIKZ2xvYmFsIEN1cnJlbnRBcHBsaWNhdGlvbkFkZHJlc3MKaXR4bl9maWVsZCBBc3NldFJlY2VpdmVyCmludGNfMCAvLyAwCml0eG5fZmllbGQgRmVlCml0eG5fc3VibWl0CmludGNfMSAvLyAxCnJldHVybgoKLy8gb3B0b3V0X2Zyb21fQVNBCm9wdG91dGZyb21BU0FfMTI6CnR4biBTZW5kZXIKY2FsbHN1YiBndWFyZG9wdG91dGZyb21BU0FfNAovLyB1bmF1dGhvcml6ZWQKYXNzZXJ0Cml0eG5fYmVnaW4KaW50Y18yIC8vIGF4ZmVyCml0eG5fZmllbGQgVHlwZUVudW0KYnl0ZWNfMSAvLyAiZ2xvYmFsX2FzYV9pZCIKYXBwX2dsb2JhbF9nZXQKaXR4bl9maWVsZCBYZmVyQXNzZXQKZ2xvYmFsIEN1cnJlbnRBcHBsaWNhdGlvbkFkZHJlc3MKaXR4bl9maWVsZCBBc3NldENsb3NlVG8KZ2xvYmFsIEN1cnJlbnRBcHBsaWNhdGlvbkFkZHJlc3MKaXR4bl9maWVsZCBTZW5kZXIKZ2xvYmFsIEN1cnJlbnRBcHBsaWNhdGlvbkFkZHJlc3MKaXR4bl9maWVsZCBBc3NldFJlY2VpdmVyCmludGNfMCAvLyAwCml0eG5fZmllbGQgRmVlCml0eG5fc3VibWl0CmludGNfMSAvLyAxCnJldHVybgoKLy8gc2VsbGVyX3NldF9hcmJpdHJhdGlvbgpzZWxsZXJzZXRhcmJpdHJhdGlvbl8xMzoKdHhuIFNlbmRlcgpjYWxsc3ViIGd1YXJkc2VsbGVyc2V0YXJiaXRyYXRpb25fNQovLyB1bmF1dGhvcml6ZWQKYXNzZXJ0CmJ5dGVjIDcgLy8gImdsb2JhbF9zZWxsZXJfYXJiaXRyYXRpb25fZmxhZyIKaW50Y18xIC8vIDEKYXBwX2dsb2JhbF9wdXQKaW50Y18xIC8vIDEKcmV0dXJuCgovLyB3aXRoZHJhd19BU0EKd2l0aGRyYXdBU0FfMTQ6CnR4biBTZW5kZXIKY2FsbHN1YiBndWFyZHdpdGhkcmF3QVNBXzYKLy8gdW5hdXRob3JpemVkCmFzc2VydApnbG9iYWwgQ3VycmVudEFwcGxpY2F0aW9uQWRkcmVzcwpieXRlY18xIC8vICJnbG9iYWxfYXNhX2lkIgphcHBfZ2xvYmFsX2dldAphc3NldF9ob2xkaW5nX2dldCBBc3NldEJhbGFuY2UKc3RvcmUgMzIKc3RvcmUgMzEKaXR4bl9iZWdpbgppbnRjXzIgLy8gYXhmZXIKaXR4bl9maWVsZCBUeXBlRW51bQpieXRlY18xIC8vICJnbG9iYWxfYXNhX2lkIgphcHBfZ2xvYmFsX2dldAppdHhuX2ZpZWxkIFhmZXJBc3NldApsb2FkIDMxCml0eG5fZmllbGQgQXNzZXRBbW91bnQKZ2xvYmFsIEN1cnJlbnRBcHBsaWNhdGlvbkFkZHJlc3MKaXR4bl9maWVsZCBTZW5kZXIKdHhuIFNlbmRlcgppdHhuX2ZpZWxkIEFzc2V0UmVjZWl2ZXIKaW50Y18wIC8vIDAKaXR4bl9maWVsZCBGZWUKaXR4bl9zdWJtaXQKaW50Y18xIC8vIDEKcmV0dXJuCgovLyB3aXRoZHJhd19iYWxhbmNlCndpdGhkcmF3YmFsYW5jZV8xNToKdHhuIFNlbmRlcgpjYWxsc3ViIGd1YXJkd2l0aGRyYXdiYWxhbmNlXzcKLy8gdW5hdXRob3JpemVkCmFzc2VydAppdHhuX2JlZ2luCmludGNfMSAvLyBwYXkKaXR4bl9maWVsZCBUeXBlRW51bQpnbG9iYWwgQ3VycmVudEFwcGxpY2F0aW9uQWRkcmVzcwpiYWxhbmNlCmdsb2JhbCBNaW5UeG5GZWUKLQppdHhuX2ZpZWxkIEFtb3VudApnbG9iYWwgQ3VycmVudEFwcGxpY2F0aW9uQWRkcmVzcwppdHhuX2ZpZWxkIFNlbmRlcgp0eG4gU2VuZGVyCml0eG5fZmllbGQgUmVjZWl2ZXIKZ2xvYmFsIE1pblR4bkZlZQppdHhuX2ZpZWxkIEZlZQp0eG4gU2VuZGVyCml0eG5fZmllbGQgQ2xvc2VSZW1haW5kZXJUbwppdHhuX3N1Ym1pdAppbnRjXzEgLy8gMQpyZXR1cm4=";
  override clearProgram: string =
    "I3ByYWdtYSB2ZXJzaW9uIDgKcHVzaGludCAwIC8vIDAKcmV0dXJu";
  override methods: algosdk.ABIMethod[] = [
    new algosdk.ABIMethod({
      name: "create",
      desc: "",
      args: [
        { type: "address", name: "global_buyer", desc: "" },
        { type: "address", name: "global_seller", desc: "" },
        { type: "uint64", name: "global_escrow_payment_1", desc: "" },
        { type: "uint64", name: "global_escrow_payment_2", desc: "" },
        { type: "uint64", name: "global_total_price", desc: "" },
        { type: "uint64", name: "global_inspection_start_date", desc: "" },
        { type: "uint64", name: "global_inspection_end_date", desc: "" },
        { type: "uint64", name: "global_inspection_extension_date", desc: "" },
        { type: "uint64", name: "global_moving_date", desc: "" },
        { type: "uint64", name: "global_closing_date", desc: "" },
        { type: "uint64", name: "global_free_funds_date", desc: "" },
        { type: "uint64", name: "global_asa_id", desc: "" },
      ],
      returns: { type: "void", desc: "" },
    }),
    new algosdk.ABIMethod({
      name: "buyer_set_arbitration",
      desc: "",
      args: [],
      returns: { type: "void", desc: "" },
    }),
    new algosdk.ABIMethod({
      name: "buyer_set_pullout",
      desc: "",
      args: [],
      returns: { type: "void", desc: "" },
    }),
    new algosdk.ABIMethod({
      name: "optin_to_ASA",
      desc: "",
      args: [],
      returns: { type: "void", desc: "" },
    }),
    new algosdk.ABIMethod({
      name: "optout_from_ASA",
      desc: "",
      args: [],
      returns: { type: "void", desc: "" },
    }),
    new algosdk.ABIMethod({
      name: "seller_set_arbitration",
      desc: "",
      args: [],
      returns: { type: "void", desc: "" },
    }),
    new algosdk.ABIMethod({
      name: "withdraw_ASA",
      desc: "",
      args: [],
      returns: { type: "void", desc: "" },
    }),
    new algosdk.ABIMethod({
      name: "withdraw_balance",
      desc: "",
      args: [],
      returns: { type: "void", desc: "" },
    }),
  ];
  async create(
    args: {
      global_buyer: string;
      global_seller: string;
      global_escrow_payment_1: bigint;
      global_escrow_payment_2: bigint;
      global_total_price: bigint;
      global_inspection_start_date: bigint;
      global_inspection_end_date: bigint;
      global_inspection_extension_date: bigint;
      global_moving_date: bigint;
      global_closing_date: bigint;
      global_free_funds_date: bigint;
      global_asa_id: bigint;
    },
    txnParams?: bkr.TransactionOverrides
  ): Promise<bkr.ABIResult<void>> {
    const result = await this.execute(
      await this.compose.create(
        {
          global_buyer: args.global_buyer,
          global_seller: args.global_seller,
          global_escrow_payment_1: args.global_escrow_payment_1,
          global_escrow_payment_2: args.global_escrow_payment_2,
          global_total_price: args.global_total_price,
          global_inspection_start_date: args.global_inspection_start_date,
          global_inspection_end_date: args.global_inspection_end_date,
          global_inspection_extension_date:
            args.global_inspection_extension_date,
          global_moving_date: args.global_moving_date,
          global_closing_date: args.global_closing_date,
          global_free_funds_date: args.global_free_funds_date,
          global_asa_id: args.global_asa_id,
        },
        txnParams
      )
    );
    return new bkr.ABIResult<void>(result);
  }
  async buyer_set_arbitration(
    txnParams?: bkr.TransactionOverrides
  ): Promise<bkr.ABIResult<void>> {
    const result = await this.execute(
      await this.compose.buyer_set_arbitration(txnParams)
    );
    return new bkr.ABIResult<void>(result);
  }
  async buyer_set_pullout(
    txnParams?: bkr.TransactionOverrides
  ): Promise<bkr.ABIResult<void>> {
    const result = await this.execute(
      await this.compose.buyer_set_pullout(txnParams)
    );
    return new bkr.ABIResult<void>(result);
  }
  async optin_to_ASA(
    txnParams?: bkr.TransactionOverrides
  ): Promise<bkr.ABIResult<void>> {
    const result = await this.execute(
      await this.compose.optin_to_ASA(txnParams)
    );
    return new bkr.ABIResult<void>(result);
  }
  async optout_from_ASA(
    txnParams?: bkr.TransactionOverrides
  ): Promise<bkr.ABIResult<void>> {
    const result = await this.execute(
      await this.compose.optout_from_ASA(txnParams)
    );
    return new bkr.ABIResult<void>(result);
  }
  async seller_set_arbitration(
    txnParams?: bkr.TransactionOverrides
  ): Promise<bkr.ABIResult<void>> {
    const result = await this.execute(
      await this.compose.seller_set_arbitration(txnParams)
    );
    return new bkr.ABIResult<void>(result);
  }
  async withdraw_ASA(
    txnParams?: bkr.TransactionOverrides
  ): Promise<bkr.ABIResult<void>> {
    const result = await this.execute(
      await this.compose.withdraw_ASA(txnParams)
    );
    return new bkr.ABIResult<void>(result);
  }
  async withdraw_balance(
    txnParams?: bkr.TransactionOverrides
  ): Promise<bkr.ABIResult<void>> {
    const result = await this.execute(
      await this.compose.withdraw_balance(txnParams)
    );
    return new bkr.ABIResult<void>(result);
  }
  compose = {
    create: async (
      args: {
        global_buyer: string;
        global_seller: string;
        global_escrow_payment_1: bigint;
        global_escrow_payment_2: bigint;
        global_total_price: bigint;
        global_inspection_start_date: bigint;
        global_inspection_end_date: bigint;
        global_inspection_extension_date: bigint;
        global_moving_date: bigint;
        global_closing_date: bigint;
        global_free_funds_date: bigint;
        global_asa_id: bigint;
      },
      txnParams?: bkr.TransactionOverrides,
      atc?: algosdk.AtomicTransactionComposer
    ): Promise<algosdk.AtomicTransactionComposer> => {
      return this.addMethodCall(
        algosdk.getMethodByName(this.methods, "create"),
        {
          global_buyer: args.global_buyer,
          global_seller: args.global_seller,
          global_escrow_payment_1: args.global_escrow_payment_1,
          global_escrow_payment_2: args.global_escrow_payment_2,
          global_total_price: args.global_total_price,
          global_inspection_start_date: args.global_inspection_start_date,
          global_inspection_end_date: args.global_inspection_end_date,
          global_inspection_extension_date:
            args.global_inspection_extension_date,
          global_moving_date: args.global_moving_date,
          global_closing_date: args.global_closing_date,
          global_free_funds_date: args.global_free_funds_date,
          global_asa_id: args.global_asa_id,
        },
        txnParams,
        atc
      );
    },
    buyer_set_arbitration: async (
      txnParams?: bkr.TransactionOverrides,
      atc?: algosdk.AtomicTransactionComposer
    ): Promise<algosdk.AtomicTransactionComposer> => {
      return this.addMethodCall(
        algosdk.getMethodByName(this.methods, "buyer_set_arbitration"),
        {},
        txnParams,
        atc
      );
    },
    buyer_set_pullout: async (
      txnParams?: bkr.TransactionOverrides,
      atc?: algosdk.AtomicTransactionComposer
    ): Promise<algosdk.AtomicTransactionComposer> => {
      return this.addMethodCall(
        algosdk.getMethodByName(this.methods, "buyer_set_pullout"),
        {},
        txnParams,
        atc
      );
    },
    optin_to_ASA: async (
      txnParams?: bkr.TransactionOverrides,
      atc?: algosdk.AtomicTransactionComposer
    ): Promise<algosdk.AtomicTransactionComposer> => {
      return this.addMethodCall(
        algosdk.getMethodByName(this.methods, "optin_to_ASA"),
        {},
        txnParams,
        atc
      );
    },
    optout_from_ASA: async (
      txnParams?: bkr.TransactionOverrides,
      atc?: algosdk.AtomicTransactionComposer
    ): Promise<algosdk.AtomicTransactionComposer> => {
      return this.addMethodCall(
        algosdk.getMethodByName(this.methods, "optout_from_ASA"),
        {},
        txnParams,
        atc
      );
    },
    seller_set_arbitration: async (
      txnParams?: bkr.TransactionOverrides,
      atc?: algosdk.AtomicTransactionComposer
    ): Promise<algosdk.AtomicTransactionComposer> => {
      return this.addMethodCall(
        algosdk.getMethodByName(this.methods, "seller_set_arbitration"),
        {},
        txnParams,
        atc
      );
    },
    withdraw_ASA: async (
      txnParams?: bkr.TransactionOverrides,
      atc?: algosdk.AtomicTransactionComposer
    ): Promise<algosdk.AtomicTransactionComposer> => {
      return this.addMethodCall(
        algosdk.getMethodByName(this.methods, "withdraw_ASA"),
        {},
        txnParams,
        atc
      );
    },
    withdraw_balance: async (
      txnParams?: bkr.TransactionOverrides,
      atc?: algosdk.AtomicTransactionComposer
    ): Promise<algosdk.AtomicTransactionComposer> => {
      return this.addMethodCall(
        algosdk.getMethodByName(this.methods, "withdraw_balance"),
        {},
        txnParams,
        atc
      );
    },
  };
}
