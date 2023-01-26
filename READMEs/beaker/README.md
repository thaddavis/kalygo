# TLDR

Steps for how to use the ABI for a Beaker exported contract in the frontend...

npm i beaker-ts

## STEPS

- 1. First export the contract with the Beaker Python library ie:

```.py
escrowContract = EscrowContract()
escrowContract.dump("./build")
```

- 2. `npx beaker-ts generate src/contractExports/contracts/cashBuy/application.json src/contractExports/contracts/cashBuy/`
