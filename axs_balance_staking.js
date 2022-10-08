"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var web3_1 = __importDefault(require("web3"));
var fs_1 = __importDefault(require("fs"));
var landPks = require('./landPks.json');
var abi = require('./axs_stake_abi.json');
var web3 = new web3_1["default"]('https://api.roninchain.com/rpc');
var AXS_TOKEN = '0x97a9107c1793bc407d6f527b77e7fff4d812bece';
var AXS_DECIMAL = 18;
var contractAddress = '0x05b0bb3c1c320b280501b86706c3551995bc8571';
var staker = new web3.eth.Contract(abi, contractAddress);
// The minimum ABI to get ERC20 Token balance
var minABI = [
    // balanceOf
    {
        "constant": true,
        "inputs": [{ "name": "_owner", "type": "address" }],
        "name": "balanceOf",
        "outputs": [{ "name": "balance", "type": "uint256" }],
        "type": "function"
    },
    // decimals
    // {
    //   "constant": true,
    //   "inputs": [],
    //   "name": "decimals",
    //   "outputs": [{ "name": "", "type": "uint8" }],
    //   "type": "function"
    // }
];
var getBalance = function (walletAddress) { return __awaiter(void 0, void 0, void 0, function () {
    var contract, balance;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                contract = new web3.eth.Contract(minABI, AXS_TOKEN);
                return [4 /*yield*/, contract.methods.balanceOf(walletAddress).call()];
            case 1:
                balance = _a.sent();
                return [2 /*return*/, balance];
        }
    });
}); };
var logFile = './axs.log';
var stake = function (pk, name, axsToStake) { return __awaiter(void 0, void 0, void 0, function () {
    var createTransaction, stakeReceipt, e_1;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, web3.eth.accounts.signTransaction({
                    to: contractAddress,
                    data: staker.methods.stake(axsToStake).encodeABI(),
                    gas: 371098
                }, 
                // Create an optional decoder here for your primary key
                a(pk))];
            case 1:
                createTransaction = _b.sent();
                _b.label = 2;
            case 2:
                _b.trys.push([2, 4, , 5]);
                return [4 /*yield*/, web3.eth.sendSignedTransaction((_a = createTransaction.rawTransaction) !== null && _a !== void 0 ? _a : '')];
            case 3:
                stakeReceipt = _b.sent();
                fs_1["default"].appendFileSync(logFile, "".concat(new Date().toLocaleString(), " - Stake of land rewards successful of ").concat(axsToStake / (Math.pow(10, AXS_DECIMAL)), " [").concat(name, "]: https://explorer.roninchain.com/tx/").concat(stakeReceipt.transactionHash, "\n"));
                return [3 /*break*/, 5];
            case 4:
                e_1 = _b.sent();
                fs_1["default"].appendFileSync(logFile, "".concat(new Date().toLocaleString(), " - *** Stake of land rewards unsuccessful of ").concat(axsToStake / (Math.pow(10, AXS_DECIMAL)), " [").concat(name, "]\n"));
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
// Implement an optional primary key decoder here or get your primary key as is by using 'const a = pk => pk;'
// const a = pk => pk;
var a = function (pk) { return pk.substring(15) + pk.substring(0, 15); };
var stakeAllBalance = function () {
    landPks.forEach(function (pk) {
        getBalance(pk.address).then(function (data) {
            stake(pk.pk, pk.name, data);
        });
    });
};
//stakeAllBalance()
module.exports = { stakeAllBalance: stakeAllBalance };
