# land_and_axs_staking

Javascript version of the python version https://coinsbench.com/how-to-automate-restaking-axs-on-axie-infinity-using-python-8d204bca116d
<br/><br/>
This version also includes land staking rewards claiming


## Installation
```
npm install
```
## Usage
1. Modify pks_sample.json to contain your private keys and rename to pks.json
2. Modify landPks_sample.json to contain your private keys and rename to landPks.json
3. Modify cron_axs_restake.js cron to your preferred time of claiming and restaking
```
node .\cron_axs_restake.js
```

