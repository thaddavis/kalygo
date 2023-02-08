# Article for GHH3 Learning Challenge: Box Storage with Beaker

## MBR breakdown

100,000 reserved for being able to use address on the blockchain
100,000 per ASA opted-into by address
822,100 mAlgos for Buyer box
822,500 mAlgos for Seller box
=================================================
1.8446 ALGO

## Breakdown of buyer box and seller box

let buyerByteCount = 2049
let sellerByteCount = 2050
let mbrForBuyerNotes = 2500 + 400 * buyerByteCount || -1; // for Buyer Notes
let mbrForSellerNotes = 2500 + 400 * sellerByteCount || -1; // for Seller Notes
let mbr = 200000 + mbrForBuyerNotes + mbrForSellerNotes

## FORMULA FOR CALCULATING REQUIRED MBR FOR PER BOX

(2500 per box) + (400 * (box size + key size))

## Buyer Box Example

I wanted a box called "Buyer" and to be able to write as much data to it as possible in 1 txn

max amount of bytes you can send in the args field of a txn is 2048 bytes

so we will be able to send MAX 2042 bytes per txn to store into the "Buyer" box

ie: 2048 - (4 byte method selector) - 2 byte string length field = 2042

key: "Buyer"
box size: 2044 (2 bytes string length field + 2042 bytes string content)
key size: 5

2500 + 400 * 2049 = 822,100 mAlgos

## Seller Box Example

I wanted a box called "Seller" and to be able to write as much data to it as possible in 1 txn

max size of application args per txn is 2048 bytes

so we will be able to send MAX 2042 bytes per txn to store into the "Seller" box

ie: 2048 - (4 byte method selector) - 2 byte string length field = 2042

key: "Seller"
box size: 2044 (2 byte string length field + 2042 string content)
key size: 6

2500 + 400 * 2050 = 822,500 mAlgos

## Link to Code

### Frontend

`https://github.com/thaddavis/kalygo/blob/main/src/pages/AppDetail/CashBuy__v1_0_0/Box.tsx#L167`

### Backend

`https://github.com/thaddavis/kalygo-contracts-with-beaker/blob/main/contracts/escrow/contract.py`
