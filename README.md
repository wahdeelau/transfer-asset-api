#transfer-asset-api
## Prequisite

1) install nodejs
2) install yarn
3) install nest
4) free port 5000 (if not free, need to change configuration)


## Assumptions
1) Source wallet have 0 luna but have other TerraSDR asset (code does not do any null pointer checking)
2) EVM and Terra ecosystem share same mnemonic phrase

## Configuration

For Port Change
```bash
export PORT=XXXXXX
```

Change Mnenomic Phrase at wallet-utils.ts


## Run Server
```bash
yarn
yarn start:debug
```