# land_and_axs_staking

Javascript version of the python version https://coinsbench.com/how-to-automate-restaking-axs-on-axie-infinity-using-python-8d204bca116d
<br/><br/>
This version also includes land staking rewards claiming


## Installation
```
npm install
```
When updating axs_balance_staking.tx
```
npx tsc
```
## Usage
1. Modify pks_sample.json to contain your private keys and rename to pks.json - (Remove 0x at the beginning of you private key. After that, default implementation needs your private key's last 15 characters removed and placed at the start. [Look for a(pk) in the index.js to understand better])
2. Modify landPks_sample.json to contain your private keys and rename to landPks.json - (Remove 0x at the beginning of you private key. After that, default implementation needs your private key's last 15 characters removed and placed at the start. . [Look for a(pk) in the landIndex.js to understand better])
3. Modify cron_land_claim_axs_stake_restake.js cron to your preferred time of claiming and restaking
```
node .\cron_land_claim_axs_stake_restake.js.js
```

