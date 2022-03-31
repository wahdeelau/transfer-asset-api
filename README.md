#transfer-asset-api
## Prequisite

1) install nodejs
2) install yarn
3) install nest
4) free port 5000 (if not free, need to change configuration)


## Assumptions
1) EVM and Terra ecosystem share same mnemonic phrase

## Configuration

For Port Change
```bash
export PORT=XXXXXX
```

Update wallet-utils.ts
```
At initWallet()
1) Update Mnemonic Phrase
2) Set the Correct LCD Endpoints
```


## Run Server
```bash
yarn
yarn start:debug
```

For delegated Luna retrieval, run the /terra/activate-poll endpoint