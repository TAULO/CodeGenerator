// // import freeton from "../freeton_dev/src/index";
import freeton from "freeton";
import { TonClient } from "@tonclient/core";
import { libWeb } from "@tonclient/lib-web";
import { Account } from "@tonclient/appkit";

TonClient.useBinaryLibrary(libWeb);
TonClient.defaultConfig = { network: { endpoints: ["http://net.ton.dev"] } };

const { ResponseType } = require("@tonclient/core/dist/bin");
const { abiContract } = require("@tonclient/core");
const { DEXclient } = require("./contracts/DEXclient");
// const hex2dec = require('hex2dec');
const { MessageBodyType } = require("@tonclient/core");

const hex2ascii = require('hex2ascii');
const Radiance = require('./contracts/Radiance.json');
const { DEXrootContract } = require('./contracts/DEXroot.js');
const { DEXpairContract } = require('./contracts/DEXpair.js');
const { TONwrapper } = require('./contracts/TONwrapper.js');

const { DEXclientContract } = require('./contracts/DEXclient.js');

const { HelloEventsContract } = require('./contracts/contracts.js');
const { RootTokenContract } = require('./contracts/RootToken.js');
const { TONTokenWalletContract } = require('./contracts/TONTokenWallet.js');
const Kington = require('./contracts/Kington.json');
const KingtonOrder = require('./contracts/KingtonOrder.json');
const SetcodeMultisigWallet = require('./contracts/SetcodeMultisigWallet.json');

export const _ = {
  checkExtensionAvailability() {
    if (window.freeton === undefined) {
      throw new Error('Extension not available.');
    }
  },
  getProvider() {
    return new freeton.providers.ExtensionProvider(window.freeton);
  }
};

let provider;
let signer;
let pubkey;

(async function () {
  provider = _.getProvider();
  signer = await provider.getSigner();
  pubkey = await signer.getPublicKey();
})()

const client = new TonClient({ network: { server_address: 'net.ton.dev' } });

export async function getWallet() {
  try {
    _.checkExtensionAvailability();
    const provider = _.getProvider();
    const signer = await provider.getSigner();
    const walletId = signer.wallet.address;
    const result = (await client.net.query_collection({ collection: "accounts", filter: { id: { eq: walletId, }, }, result: "balance", })).result;
    const balance = (parseInt(result[0].balance) / 1000000000).toString().slice(0, (parseInt(result[0].balance) / 1000000000).toString().indexOf('.') + 4);
    return { id: walletId, balance };
  } catch (e) {
    throw e;
  }
}

export async function getTokenList() {
  try {
    _.checkExtensionAvailability();
    const wallet = signer.getWallet();
    console.log('wallet', wallet);
    const tokenList = await wallet.getTokenList();
    console.log(tokenList);
  } catch (e) {
    throw e;
  }
}

export async function checkPubKey() {
  try {
    _.checkExtensionAvailability();
    const signer = await provider.getSigner();
    const pubkey = await signer.getPublicKey();
    const contract = new freeton.Contract(provider, DEXrootContract.abi, Radiance.networks['2'].dexroot);
    const result = await contract.methods.checkPubKey.run({ pubkey: "0x" + pubkey });
    console.log('checkPubKey: ' + result.status);
    console.log('checkPubKey: ' + result.dexclient);
    // if (result.status == true) {
    //   const client = new TonClient({ network: { server_address: 'net.ton.dev' } });
    //   const balance = (await client.net.query_collection({ collection: "accounts", filter: { id: { eq: result.dexclient, }, }, result: "balance", })).result;
    //   console.log('balance: ' + parseInt(balance[0].balance));
    // }
    return {status: result.status, address: result.dexclient};
  } catch (e) {
    throw e;
  }
}

export async function computeDEXclientAddr(shardId) {
  try {
    _.checkExtensionAvailability();
    const contract = new freeton.Contract(provider, DEXrootContract.abi, Radiance.networks['2'].dexroot);
    const result = await contract.methods.computeDEXclientAddrWithId.run({ pubkey: "0x" + pubkey, clientId: shardId });
    console.log('computeDEXclientAddrWithId: ' + result.value0);
  } catch (e) {
    throw e;
  }
}

export async function createDEXclient(shardId) {
  try {
    _.checkExtensionAvailability();
    const contract = new freeton.Contract(signer, DEXrootContract.abi, Radiance.networks['2'].dexroot);
    const contractMessageProcessing = await contract.methods.createDEXclient.call({ pubkey: "0x" + pubkey, clientId: shardId });
    await contractMessageProcessing.wait();
    console.log(`Called. TxId: ${contractMessageProcessing.txid}`)
    // const client = new TonClient({network: { server_address: 'net.ton.dev' }});
    // const balance = (await client.net.query_collection({collection: "accounts",filter: {id: {eq: result.value0,},},result: "balance",})).result;
    console.log('createDEXclient: ' + contractMessageProcessing);
    // console.log('balance: '+parseInt(balance[0].balance));
  } catch (e) {
    throw e;
  }
}

export async function getClientRoots() {
  try {
    _.checkExtensionAvailability();
    const root = new freeton.Contract(provider, DEXrootContract.abi, Radiance.networks['2'].dexroot);
    const rootData = await root.methods.checkPubKey.run({ pubkey: "0x" + pubkey });
    if (rootData.status == true) {
      const dexclient = new freeton.Contract(provider, DEXclientContract.abi, rootData.dexclient);
      const dexclientData = await dexclient.methods.getAllDataPreparation.run();
      console.log('getAllClienRoots: ' + dexclientData.rootKeysR);
      const result = [];
      for (const item of dexclientData.rootKeysR) {
        const tokenRoot = new freeton.Contract(provider, RootTokenContract.abi, item);
        const symbol = await tokenRoot.methods.getSymbol.run();
        const addr = await dexclient.methods.getWalletByRoot.run({ rootAddr: item });
        const tokenWallet = new freeton.Contract(provider, TONTokenWalletContract.abi, addr.wallet);
        const balance = await tokenWallet.methods.getBalance.run();
        console.log('symbol: ' + hex2ascii(symbol.value0) + ' balance: ' + balance.value0 / 1000000000);
        result.push({ id: item, symbol: hex2ascii(symbol.value0), balance: +balance.value0 / 1000000000 });
      }
      return result;
    } else {
      console.log('DEXclient status false');
    }
  } catch (e) {
    throw e;
  }
}

export async function runContractR1Method() {
  try {
    _.checkExtensionAvailability();
    const contract = new freeton.Contract(provider, DEXrootContract.abi, Radiance.networks['2'].dexroot);
    let pairsArr = await contract.methods.pairKeys.run();
    pairsArr = pairsArr.pairKeys;
    const result = [];
    for (const item of pairsArr) {
      const dexpair = new freeton.Contract(provider, DEXpairContract.abi, item);
      let pairData = await dexpair.methods.getPair.run();
      let rootA = pairData.addressRootA;
      let rootB = pairData.addressRootB;
      let reserveA = pairData.balanceReserveA;
      let reserveB = pairData.balanceReserveB;
      const rootTokenA = new freeton.Contract(provider, RootTokenContract.abi, rootA);
      const rootTokenB = new freeton.Contract(provider, RootTokenContract.abi, rootB);
      let symbolA = await rootTokenA.methods.getSymbol.run();
      let symbolB = await rootTokenB.methods.getSymbol.run();
      symbolA = hex2ascii(symbolA.value0);
      symbolB = hex2ascii(symbolB.value0);
      // console.log('Pair:'+symbolA+' : '+symbolB+' addr: '+item);
      // console.log("reserveA:", reserveA);
      // console.log("reserveB:", reserveB);
      let rateBA = Number(reserveA) / Number(reserveB);
      let rateAB = Number(reserveB) / Number(reserveA);
      // console.log('1 '+symbolA+' = '+rateAB+' '+symbolB);
      // console.log('1 '+symbolB+' = '+rateBA+' '+symbolA);
      result.push({ pairId: item, idA: rootA, symbolA, idB: rootB, symbolB, rateAB, rateBA })
    }
    return result;
  } catch (e) {
    throw e;
  }
}

export async function getClientPairs() {
  try {
    _.checkExtensionAvailability();
    const root = new freeton.Contract(provider, DEXrootContract.abi, Radiance.networks['2'].dexroot);
    const rootData = await root.methods.checkPubKey.run({ pubkey: "0x" + pubkey });
    if (rootData.status == true) {
      const dexclient = new freeton.Contract(provider, DEXclientContract.abi, rootData.dexclient);
      const dexclientData = await dexclient.methods.getAllDataPreparation.run();
      console.log('getAllClienPairs: ' + dexclientData.pairKeysR);
      const result = [];
      for (const item of dexclientData.pairKeysR) {
        const dexpair = new freeton.Contract(provider, DEXpairContract.abi, item);
        let pairData = await dexpair.methods.getPair.run();
        let rootA = pairData.addressRootA;
        let rootB = pairData.addressRootB;
        const rootTokenA = new freeton.Contract(provider, RootTokenContract.abi, rootA);
        const rootTokenB = new freeton.Contract(provider, RootTokenContract.abi, rootB);
        let symbolA = await rootTokenA.methods.getSymbol.run();
        let symbolB = await rootTokenB.methods.getSymbol.run();
        symbolA = hex2ascii(symbolA.value0);
        symbolB = hex2ascii(symbolB.value0);
        console.log('Pair:' + symbolA + ' : ' + symbolB + ' addr: ' + item);
        result.push(item);
      }
      return result;
    } else {
      console.log('DEXclient status false');
    }
  } catch (e) {
    throw e;
  }
}

export async function connectDEXpair(pairId) {
  try {
    _.checkExtensionAvailability();
    const root = new freeton.Contract(provider, DEXrootContract.abi, Radiance.networks['2'].dexroot);
    const rootData = await root.methods.checkPubKey.run({pubkey:"0x"+pubkey});
    const contract = new freeton.Contract(signer, DEXclientContract.abi, rootData.dexclient);
    const contractMessageProcessing = await contract.methods.connectPair.call({ pairAddr: pairId });
    await contractMessageProcessing.wait();
    console.log(`Called. TxId: ${contractMessageProcessing.txid}`)
    // const client = new TonClient({network: { server_address: 'net.ton.dev' }});
    // const balance = (await client.net.query_collection({collection: "accounts",filter: {id: {eq: result.value0,},},result: "balance",})).result;
    console.log('createDEXclient: ' + contractMessageProcessing);
    // console.log('balance: '+parseInt(balance[0].balance));
  } catch (e) {
    throw e;
  }
}

// export async function swapA(pairId, value, fromToken) {
//   try {
//   //перед началом в интерфейсе можно вызвать GET dex client root и получить балансы токен валлетов и после проведения свапа проверить еще раз чтобы убедиться что токены после обмена пришли

//   //нужно вынести проверку наличия dexclient в отдельную функцию, и вызывать при каждом действии (имеется в виду при работе с блокчейном)

//   _.checkExtensionAvailability();
//   // //создаем образ DEXrootContract прикладывая к методу contract провайдера, абишку
//   const root = new freeton.Contract(provider, DEXrootContract.abi, Radiance.networks['2'].dexroot);
//   // //проверяем есть ли задеплоенный смартконтракт клиента на руте по публичному ключу
//   const rootData = await root.methods.checkPubKey.run({pubkey:"0x"+pubkey});
//   // //если в rootData.status true и rootData.dexclient есть текущий адрес идем дальше, если нет просим пользователя задеплоить dexclient
//   if(!rootData.status){
//     console.log("no dex client pls deploy")
//     return
//   }

//   /*
//   для свапа первым шагом нужно перевести из msig кошелька на dexclient какое-то количество тоннов
//    */
//   ////если на msig wallet недостаточно средств выдать ошибку
//   let amountToTransfer = +value + 1000000000
//   const client = new TonClient({network: { server_address: 'net.ton.dev' }});

//   const balanceWallet = (await client.net.query_collection({collection: "accounts",filter: {id: {eq: signer.wallet.address,},},result: "balance",})).result;
//   //проверяем достаточно ли денег чтобы отправить,если нет возвращаем ошибку
//   if(parseInt(balanceWallet[0].balance) < amountToTransfer){
//     console.log("not enought tons",balanceWallet[0].balance,"amountToTransfer",amountToTransfer)
//     throw new Error('not enought tons')
//   }

//   //перед отправков получаем текущий баланс dexclient, это нужно чтобы после переода tons проверить что деньги реально пришли
//   const balanceDEXclientBefore = (await client.net.query_collection({collection: "accounts",filter: {id: {eq: rootData.dexclient,},},result: "balance",})).result;
//   //создаем экземплял кошелька
//   let x = await new freeton.Wallet(signer,signer.wallet.address)
//   //непосредственно перевод
//   let res = await x.transfer(rootData.dexclient, amountToTransfer)
//   console.log("signer.wallet.address",signer.wallet.address)
//   //получаем баланс после перевода и рекурсивно сравниваем балансы
//   let balanceDEXclientAfter = (await client.net.query_collection({collection: "accounts",filter: {id: {eq: rootData.dexclient,},},result: "balance",})).result;

//   //цикл можно обернуть в settimeout раз в 1сек примерно, через 10 сек return
//   while(parseInt(balanceDEXclientBefore[0].balance) === parseInt(balanceDEXclientAfter[0].balance)){
//     balanceDEXclientAfter = (await client.net.query_collection({collection: "accounts",filter: {id: {eq: rootData.dexclient,},},result: "balance",})).result;
//     console.log("transaction from msig\nbalance before",parseInt(balanceDEXclientBefore[0].balance), "balance after",parseInt(balanceDEXclientAfter[0].balance), "difference", parseInt(balanceDEXclientAfter[0].balance) - parseInt(balanceDEXclientBefore[0].balance))
//   }
//   console.log("all ok, transfer from msig to dexclient success")

//   /*
//         вторым шагом необходимо обернуть нативную валюту TON в токен WTON
//   */
//   const dexclient = new freeton.Contract(signer, DEXclientContract.abi, rootData.dexclient);
//   //здесь мы вызываем у контракта клиента функцию wtonroot которая возвращает нам адрес рута
//   const clientWTONrootAddr = await dexclient.methods.wTONroot.run();
//   //получаем адрес кошелька этого рута
//   const clientWTONwalletAddr = await dexclient.methods.getWalletByRoot.run({rootAddr: clientWTONrootAddr.wTONroot});
//   //создаем экземпляр токен валлета
//   const tokenWallet = new freeton.Contract(provider, TONTokenWalletContract.abi, clientWTONwalletAddr.wallet);
//   //берем баланс чтобы позже проверить пришли ли на него токены
//   const balanceWTONbefore = await tokenWallet.methods.getBalance.run();


//   const resp = await dexclient.methods.wrapTON.call({qtyTONgrams:value});
//   await resp.wait()
//   //если в ответе есть code - это код какой-то ошибки, если это 508 делаем retry (делать можно смело в течении 15-25 секудн, settimeout`ом), если какая то другая значит где то косяк
//   if(resp.code){
//     console.log("resp.code",resp.code,"resp.message", resp.message)
//     return
//   }
//   //чекаем изменения баланса
//   let balanceWTONafter = await tokenWallet.methods.getBalance.run();

//   while(parseInt(balanceWTONbefore.value0) === parseInt(balanceWTONafter.value0)){
//       balanceWTONafter = await tokenWallet.methods.getBalance.run();
//       console.log("tons wrapping\nbalance before",parseInt(balanceWTONbefore.value0), "balance after",parseInt(balanceWTONafter.value0), "difference", parseInt(balanceWTONafter.value0) - parseInt(balanceWTONbefore.value0))
//     }
//     console.log("all ok, tons wrapped success")
//       /*
//   третьим шагом кладем на депозит обернутые тонны (wton)
//   */

//   //для этого берем адрес пары на которой мы проводим сейчас свап
//   let pairclientwallets = await dexclient.methods.getPair.run({value0:pairId});
//   //создаем экземпляр токен валлета clientDepositA - поскольку в конкретно данном контексте свапаем токен А, в приложении это нужно реализовать как входящую переменную
//   // то есть если свапаем А берем clientDepositA если б то соответственно clientDepositB
//   const tokenWalletswapA = new freeton.Contract(provider, TONTokenWalletContract.abi, pairclientwallets.fromToken);
//   //снова берем баланс ДО выполнения операции
//   const walletABalancebefore = await tokenWalletswapA.methods.getBalance.run();

//  //кладем на депозит
//   let onDeposit = await dexclient.methods.makeAdepositToPair.call({pairAddr:pairId,qtyA:value});
//   //чекаем что токены реально уже на балансе
//   let walletABalanceafter = await tokenWalletswapA.methods.getBalance.run();
//   while(parseInt(walletABalancebefore.value0) === parseInt(walletABalanceafter.value0)){
//       walletABalanceafter = await tokenWalletswapA.methods.getBalance.run();
//       console.log("set deposit\nbalance before",parseInt(walletABalancebefore.value0), "balance after",parseInt(walletABalanceafter.value0), "difference", parseInt(walletABalanceafter.value0) - parseInt(walletABalancebefore.value0))
//     }
//     console.log("make tons to deposit success")

//   /*
//   четвертый шаг это непосредственно свап
//    */
//   //здесь в качестве pairAddr должен быть адрес пары на которой мы сейчас делаем свап
//   let onWalletAddressesGet = await dexclient.methods.getPairClientWallets.run({pairAddr:pairId});
//   //из нее мы получаем адреса кошельков принадлежащих клиенту и привязанных к этой паре
//   const walletBcontract = new freeton.Contract(provider, TONTokenWalletContract.abi, fromToken === 'clientDepositA' ? onWalletAddressesGet.walletB : onWalletAddressesGet.walletA);
//   //в конкретно данном случае мы свапаем токен А на токен Б - значит мы отдаем сколько то токенов А и проверяем сколько пришло кошелек токена Б ( onWalletAddressesGet.walletB )
//   const walletBbalanceBefore = await walletBcontract.methods.getBalance.run();
//   //свапаем
//   let swapRes = await dexclient.methods.processSwapA.call({pairAddr:pairId,qtyA:value});
//   await swapRes.wait()


//   //проверяем что токены Б пришли
//   let walletBbalanceAfter = await walletBcontract.methods.getBalance.run();


//   while(parseInt(walletBbalanceBefore.value0) === parseInt(walletBbalanceAfter.value0)){
//     walletBbalanceAfter = await walletBcontract.methods.getBalance.run();
//     console.log("balance before",parseInt(walletBbalanceBefore.value0), "balance after",parseInt(walletBbalanceAfter.value0), "difference", parseInt(walletBbalanceAfter.value0) - parseInt(walletBbalanceBefore.value0))
//   }
//   const symbol = await walletBcontract.methods.getSymbol.run();
//   console.log(`Swap success you getteed ${parseInt(walletBbalanceAfter.value0)} of ${hex2ascii(symbol.value0)}`)
//   //конец

//   } catch (e) {
//     console.log(e);
//   }
// }

let someError = {
  noTons: "not enought money for transfer",
  noTokens: "not enought tokens for swap",
  returnError: "cancel button on extension"
}

export async function swap(pairId, value, fromToken) {
  let curPair = pairId;
  let tokenNameForSwap = fromToken.symbol === 'TON' ? 'wrappedTON' : 'wrapped' + fromToken.symbol.slice(1);
  let tokenNameThatSwapped = fromToken.symbol === 'TON' ? 'wrappedTON' : 'wrapped' + fromToken.symbol.slice(1);
  //let operationType = processLiquidity || swap
  let amount = +value;
  let amountToTransfer = +value * 1000000000;
  try {
    //перед началом в интерфейсе можно вызвать GET dex client root и получить балансы токен валлетов и после проведения свапа проверить еще раз чтобы убедиться что токены после обмена пришли
    //нужно вынести проверку наличия dexclient в отдельную функцию, и вызывать при каждом действии (имеется в виду при работе с блокчейном)

    _.checkExtensionAvailability();
    // //создаем образ DEXrootContract прикладывая к методу contract провайдера, абишку
    const root = new freeton.Contract(provider, DEXrootContract.abi, Radiance.networks['2'].dexroot);
    // //проверяем есть ли задеплоенный смартконтракт клиента на руте по публичному ключу
    const rootData = await root.methods.checkPubKey.run({ pubkey: "0x" + pubkey });
    // //если в rootData.status true и rootData.dexclient есть текущий адрес идем дальше, если нет просим пользователя задеплоить dexclient
    if (!rootData.status) {
      console.log("no dex client pls deploy")
      return
    }

    const dexclient = new freeton.Contract(signer, DEXclientContract.abi, rootData.dexclient);
    let pairWallets = await dexclient.methods.getPairClientWallets.run({ pairAddr: curPair });

    const walletA = new freeton.Contract(provider, TONTokenWalletContract.abi, pairWallets.walletA);
    const walletB = new freeton.Contract(provider, TONTokenWalletContract.abi, pairWallets.walletB);
    const walletAtype = await walletA.methods.getName.run();
    const walletBtype = await walletB.methods.getName.run();
    const walletAName = hex2ascii(walletAtype.value0);
    const walletBName = hex2ascii(walletBtype.value0);
    console.log("walletAtype", walletAName, "walletBtype", walletBName)

    let tokType = tokenNameForSwap === walletAName ? "swapA" : "swapB";
    let wtonSide = null;
    let wtonInGame = walletAName === "wrappedTON" || walletBName === "wrappedTON";
    let wtonwallet;
    if (wtonInGame) {
      if (walletAName === "wrappedTON") {
        wtonSide = "sideA";
        wtonwallet = walletA;
      }
      if (walletBName === "wrappedTON") {
        wtonSide = "sideB";
        wtonwallet = walletB;
      }
    }
    if (tokenNameForSwap === "wrappedTON") {
      //создаем экземплял кошелька
      console.log("i am at transfer tons from", tokenNameForSwap)
      let x = await new freeton.Wallet(signer, signer.wallet.address)


      const client = new TonClient({ network: { server_address: 'net.ton.dev' } });
      /*
      для свапа первым шагом нужно перевести из msig кошелька на dexclient какое-то количество тоннов
       */
      //проверка msig wallet на достаточность баланса - недостаточно средств выдать ошибку

      const balanceWallet = (await client.net.query_collection({
        collection: "accounts",
        filter: { id: { eq: signer.wallet.address, }, },
        result: "balance",
      })).result;
      //проверяем достаточно ли денег чтобы отправить,если нет возвращаем ошибку
      if (parseInt(balanceWallet[0].balance) < amountToTransfer) {
        console.log("not enought tons", balanceWallet[0].balance, "amountToTransfer", amountToTransfer)
        return someError.noTons
      }

      //перед отправков получаем текущий баланс dexclient, это нужно чтобы после переода tons проверить что деньги реально пришли
      const balanceDEXclientBefore = (await client.net.query_collection({
        collection: "accounts",
        filter: { id: { eq: rootData.dexclient, }, },
        result: "balance",
      })).result;

      //непосредственно перевод
      await x.transfer(rootData.dexclient, amountToTransfer)

      //получаем баланс после перевода и рекурсивно сравниваем балансы
      let balanceDEXclientAfter = (await client.net.query_collection({
        collection: "accounts",
        filter: { id: { eq: rootData.dexclient, }, },
        result: "balance",
      })).result;

      //цикл можно обернуть в settimeout раз в 1сек примерно, через 10 сек return
      while (parseInt(balanceDEXclientBefore[0].balance) === parseInt(balanceDEXclientAfter[0].balance)) {
        balanceDEXclientAfter = (await client.net.query_collection({
          collection: "accounts",
          filter: { id: { eq: rootData.dexclient, }, },
          result: "balance",
        })).result;
        console.log("transaction from msig\nbalance before", parseInt(balanceDEXclientBefore[0].balance), "balance after", parseInt(balanceDEXclientAfter[0].balance), "difference", parseInt(balanceDEXclientAfter[0].balance) - parseInt(balanceDEXclientBefore[0].balance))
      }
      console.log("all ok, transfer from msig to dexclient success")
      /*
            вторым шагом необходимо обернуть нативную валюту TON в токен WTON
      */

      //берем баланс чтобы позже проверить пришли ли на него токены
      const balanceWTONbefore = await wtonwallet.methods.getBalance.run();


      await dexclient.methods.wrapTON.call({ qtyTONgrams: amount * 1000000000 }).catch(async e => {
        if (e.code === 1000) {
          console.log("e.code", dexclient)
          let resss = await dexclient.methods.sendTransfer.call({
            dest: signer.wallet.address,
            value: amount,
            bounce: false
          })
          console.log("eee", e, "resss", resss)
          throw new Error(e);
        } else {
          throw new Error(e);
        }
      })


      let balanceWTONafter = await wtonwallet.methods.getBalance.run();
      while (parseInt(balanceWTONbefore.value0) === parseInt(balanceWTONafter.value0)) {
        balanceWTONafter = await wtonwallet.methods.getBalance.run();
        console.log("WRAP\nbalance wton wallet before", parseInt(balanceWTONbefore.value0), "balance after", parseInt(balanceWTONafter.value0), "difference", parseInt(balanceWTONafter.value0) - parseInt(balanceWTONbefore.value0))
      }
      console.log("all ok, tons wrapped success")
    }
    /*
    третьим шагом кладем на депозит токены
    */

    //для этого берем адрес пары на которой мы проводим сейчас свап
    let pairclientwallets = await dexclient.methods.getPair.run({ value0: curPair });
    //создаем экземпляр токен валлета clientDepositA - поскольку в конкретно данном контексте свапаем токен А, в приложении это нужно реализовать как входящую переменную
    // то есть если свапаем А берем clientDepositA если б то соответственно clientDepositB
    let curWallet = tokType === "swapA" ? walletA : walletB;

    const curWalletBalance = await curWallet.methods.getBalance.run();
    const curName = await curWallet.methods.getName.run();


    if (parseInt(curWalletBalance.value0) < amount) {
      console.log("not enought tokens", curWalletBalance.value0, "amountToTransfer", amount, "token name", hex2ascii(curName.value0))
      return someError.noTokens
    }
    let tokenWalletswap;
    if (tokType === "swapA") {
      tokenWalletswap = new freeton.Contract(provider, TONTokenWalletContract.abi, pairclientwallets.clientDepositA)
    } else if (tokType === "swapB") {
      tokenWalletswap = new freeton.Contract(provider, TONTokenWalletContract.abi, pairclientwallets.clientDepositB)
    }
    console.log("tokenWalletswap", tokenWalletswap)
    //снова берем баланс ДО выполнения операции

    const walletBalanceBefore = await tokenWalletswap.methods.getBalance.run();
    console.log("walletBalanceBefore", walletBalanceBefore)
    //кладем на депозит
    if (tokType === "swapA") {
      console.log("swapA", walletBalanceBefore)
      await dexclient.methods.makeAdepositToPair.call({
        pairAddr: curPair,
        qtyA: amount
      }).catch(async e => {
        if (e.code === 1000) {
          if (tokenNameForSwap === "wrappedTON" && wtonInGame) {

            const tokenWalletBalanceBefore = await wtonwallet.methods.getBalance.run();
            await dexclient.methods.unwrapTON.call();

            let tokenWalletBalanceAfter = await wtonwallet.methods.getBalance.run();
            while (parseInt(tokenWalletBalanceBefore.value0) === parseInt(tokenWalletBalanceAfter.value0)) {
              tokenWalletBalanceAfter = await wtonwallet.methods.getBalance.run();
              console.log("balance before", parseInt(tokenWalletBalanceBefore.value0), "balance after", parseInt(tokenWalletBalanceAfter.value0), "difference", parseInt(tokenWalletBalanceAfter.value0) - parseInt(tokenWalletBalanceBefore.value0))
            }
            let res = await dexclient.methods.sendTransfer.call({
              dest: signer.wallet.address,
              value: Math.abs(parseInt(tokenWalletBalanceAfter.value0) - parseInt(tokenWalletBalanceBefore.value0)),
              bounce: false
            })
            console.log("eee", e, "swapA return transfer to msig", res)
            throw new Error(someError.returnError)
          }
        } else {
          throw new Error(e);
        }
      }
      );
    } else if (tokType === "swapB") {
      console.log("curPair", typeof curPair, curPair, "form.nanoTokens.value", typeof amount, amount)
      await dexclient.methods.makeBdepositToPair.call({
        pairAddr: curPair,
        qtyB: amount
      }).catch(async e => {
        console.log("eeee", e)
        if (e.code === 1000) {
          if (tokenNameForSwap === "wrappedTON" && wtonInGame) {
            const balanceWTONbeforeReturn2 = await wtonwallet.methods.getBalance.run();
            await dexclient.methods.unwrapTON.call();

            let balanceWTONafterReturn2 = await wtonwallet.methods.getBalance.run();
            while (parseInt(balanceWTONbeforeReturn2.value0) === parseInt(balanceWTONafterReturn2.value0)) {
              balanceWTONafterReturn2 = await wtonwallet.methods.getBalance.run();
              console.log("balance before", parseInt(balanceWTONbeforeReturn2.value0), "balance after", parseInt(balanceWTONafterReturn2.value0), "difference", parseInt(balanceWTONafterReturn2.value0) - parseInt(balanceWTONbeforeReturn2.value0))
            }
            let res = await dexclient.methods.sendTransfer.call({
              dest: signer.wallet.address,
              value: Math.abs(parseInt(balanceWTONafterReturn2.value0) - parseInt(balanceWTONbeforeReturn2.value0)),
              bounce: false
            })
            console.log("eee", e, "swapB return transfer to msig", res)
            throw new Error(someError.returnError);
          }
        } else {
          throw new Error(e);
        }
      }
      );
    }

    //чекаем что токены реально уже на балансе
    let walletBalanceAfter = await tokenWalletswap.methods.getBalance.run();
    while (parseInt(walletBalanceBefore.value0) === parseInt(walletBalanceAfter.value0)) {
      walletBalanceAfter = await tokenWalletswap.methods.getBalance.run();
      console.log("MAKEDEPOSIT checking\nbalance before", parseInt(walletBalanceBefore.value0), "balance after", parseInt(walletBalanceAfter.value0), "difference", parseInt(walletBalanceAfter.value0) - parseInt(walletBalanceBefore.value0))
    }
    console.log("make tokens to deposit success")

    /*
    четвертый шаг это непосредственно свап
    */
    let walletThatSwapped;
    if (tokType === "swapA") {
      walletThatSwapped = new freeton.Contract(provider, TONTokenWalletContract.abi, pairWallets.walletB)
    } else if (tokType === "swapB") {
      walletThatSwapped = new freeton.Contract(provider, TONTokenWalletContract.abi, pairWallets.walletA)
    }
    console.log("walletThatSwapped", walletThatSwapped)
    //в конкретно данном случае мы свапаем токен А на токен Б - значит мы отдаем сколько то токенов А и проверяем сколько пришло кошелек токена Б ( onWalletAddressesGet.walletB )
    const walletBbalanceBefore = await walletThatSwapped.methods.getBalance.run();
    const walName = await walletThatSwapped.methods.getName.run();
    //свапаем
    console.log("balance walletBbalanceBefore before", parseInt(walletBbalanceBefore.value0), "walletThatSwapped Name", hex2ascii(walName.value0), "form.nanoTokens.value", typeof +value, +value)

    if (tokType === "swapA") {
      console.log("swapA now")
      await dexclient.methods.processSwapA.call({
        pairAddr: curPair,
        qtyA: amount
      }).catch(async e => {
        if (e.code === 1000) {
          const walletABalancebeforeReturn = await tokenWalletswap.methods.getBalance.run();
          let returnDeposit = await dexclient.methods.returnDepositFromPair.call({ pairAddr: curPair });
          let walletABalanceafterReturn = await tokenWalletswap.methods.getBalance.run();
          while (parseInt(walletABalancebeforeReturn.value0) === parseInt(walletABalanceafterReturn.value0)) {
            walletABalanceafterReturn = await tokenWalletswap.methods.getBalance.run();
            console.log("RETURN DEPOSIT SWAPA\nbalance before", parseInt(walletABalancebeforeReturn.value0), "balance after return", parseInt(walletABalanceafterReturn.value0), "difference", parseInt(walletABalanceafterReturn.value0) - parseInt(walletABalancebeforeReturn.value0))
          }
          console.log("return tons from deposit success")
          //only if wton in game
          if (tokenNameForSwap === "wrappedTON" && wtonInGame) {
            const balanceWTONbeforeReturn2 = await wtonwallet.methods.getBalance.run();
            await dexclient.methods.unwrapTON.call();

            let balanceWTONafterReturn2 = await wtonwallet.methods.getBalance.run();
            while (parseInt(balanceWTONbeforeReturn2.value0) === parseInt(balanceWTONafterReturn2.value0)) {
              balanceWTONafterReturn2 = await wtonwallet.methods.getBalance.run();
              console.log("RETURN at unwrap swapA\nbalance before", parseInt(balanceWTONbeforeReturn2.value0), "balance after", parseInt(balanceWTONafterReturn2.value0), "difference", parseInt(balanceWTONafterReturn2.value0) - parseInt(balanceWTONbeforeReturn2.value0))
            }
            let res = await dexclient.methods.sendTransfer.call({
              dest: signer.wallet.address,
              value: Math.abs(parseInt(balanceWTONafterReturn2.value0) - parseInt(balanceWTONbeforeReturn2.value0)),
              bounce: false
            })
            console.log("send tons back", res)
            throw new Error(someError.returnError);
          }
        } else {
          throw new Error(e);
        }
      }
      );
    }
    if (tokType === "swapB") {
      console.log("swapB now")
      await dexclient.methods.processSwapB.call({
        pairAddr: curPair,
        qtyB: amount
      }).catch(async e => {
        if (e.code === 1000) {
          const walletABalancebeforeReturn = await tokenWalletswap.methods.getBalance.run();
          let returnDeposit = await dexclient.methods.returnDepositFromPair.call({ pairAddr: curPair });
          let walletABalanceafterReturn = await tokenWalletswap.methods.getBalance.run();
          while (parseInt(walletABalancebeforeReturn.value0) === parseInt(walletABalanceafterReturn.value0)) {
            walletABalanceafterReturn = await tokenWalletswap.methods.getBalance.run();
            console.log("RETURN DEPOSIT SWAPB\nbalance before", parseInt(walletABalancebeforeReturn.value0), "balance after return", parseInt(walletABalanceafterReturn.value0), "difference", parseInt(walletABalanceafterReturn.value0) - parseInt(walletABalancebeforeReturn.value0))
          }
          console.log("return tons from deposit success")
          //only if wton in game
          if (tokenNameForSwap === "wrappedTON" && wtonInGame) {
            const balanceWTONbeforeReturn2 = await wtonwallet.methods.getBalance.run();
            await dexclient.methods.unwrapTON.call();

            let balanceWTONafterReturn2 = await wtonwallet.methods.getBalance.run();
            while (parseInt(balanceWTONbeforeReturn2.value0) === parseInt(balanceWTONafterReturn2.value0)) {
              balanceWTONafterReturn2 = await wtonwallet.methods.getBalance.run();
              console.log("RETURN at unwrap swapB\nbalance before", parseInt(balanceWTONbeforeReturn2.value0), "balance before", parseInt(balanceWTONbeforeReturn2.value0), "balance after", parseInt(balanceWTONafterReturn2.value0), "difference", parseInt(balanceWTONafterReturn2.value0) - parseInt(balanceWTONbeforeReturn2.value0))
            }
            let res = await dexclient.methods.sendTransfer.call({
              dest: signer.wallet.address,
              value: Math.abs(parseInt(balanceWTONafterReturn2.value0) - parseInt(balanceWTONbeforeReturn2.value0)),
              bounce: false
            })
            console.log("send tons back", res)
            throw new Error(someError.returnError);
          }
        } else {
          throw new Error(e);
        }
      }
      );
    }

    //проверяем что токены Б пришли
    let walletBbalanceAfter = await walletThatSwapped.methods.getBalance.run();
    while (parseInt(walletBbalanceBefore.value0) === parseInt(walletBbalanceAfter.value0)) {
      walletBbalanceAfter = await walletThatSwapped.methods.getBalance.run();
      console.log("balance before", parseInt(walletBbalanceBefore.value0), "balance after", parseInt(walletBbalanceAfter.value0), "difference", parseInt(walletBbalanceAfter.value0) - parseInt(walletBbalanceBefore.value0))
    }
    const symbol = await walletThatSwapped.methods.getSymbol.run();
    console.log(`Swap success you balance of ${hex2ascii(symbol.value0)} tokens updated and now it is ${parseInt(walletBbalanceAfter.value0)}`)

    //возврат тоннов
    if (tokenNameForSwap !== "wrappedTON" && wtonInGame) {
      const balanceWTONbeforeReturn2 = await wtonwallet.methods.getBalance.run();
      await dexclient.methods.unwrapTON.call();

      let balanceWTONafterReturn2 = await wtonwallet.methods.getBalance.run();
      while (parseInt(balanceWTONbeforeReturn2.value0) === parseInt(balanceWTONafterReturn2.value0)) {
        balanceWTONafterReturn2 = await wtonwallet.methods.getBalance.run();
        console.log("balance before", parseInt(balanceWTONbeforeReturn2.value0), "balance after", parseInt(balanceWTONafterReturn2.value0), "difference", parseInt(balanceWTONafterReturn2.value0) - parseInt(balanceWTONbeforeReturn2.value0))
      }
      let resp = await dexclient.methods.sendTransfer.call({
        dest: signer.wallet.address,
        value: Math.abs(parseInt(walletBbalanceAfter.value0) - parseInt(walletBbalanceBefore.value0)),
        bounce: false
      })
      console.log("transfer to msig", resp)
    }
    console.log("successfully finish process, check your wallet balance")

  } catch (e) {
    // document.getElementById('result').innerHTML += '</br>' + JSON.stringify(e);
    console.log("i am here, error: " + e.text);
    throw new Error(e.text);
  }
}

export async function getAllMessagesAndAllTransaction(clientAddr) {
    
  const decode = { 
    async message(abi, boc) {        
      try {
        const decodedMessage = (              
          await TonClient.default.abi.decode_message({
            abi: abiContract(abi),  //DEXclientContract.abi RootTokenContract 60ae82cc933c9613a7a9e531129a66195390edd61d8f5b77224893cea003021e
            message: boc,
          })
        )
        return decodedMessage
      } catch (e) {
        // console.log(e)
        return e.code
      }                      
    },      

    // 0 – internal
    // 1 – extIn
    // 2 – extOut
    async body(abi, body, internal = true) {
      try {
        const decodedBody = (
          await TonClient.default.abi.decode_message_body({
            abi: abiContract(abi),  
            body: body,
            is_internal: internal
          })
        )
        return decodedBody
      } catch (e) {
        console.log(e)
        return e.code
      }    
    },
  } 
  
  try {

    const client = new TonClient({network: { server_address: 'net.ton.dev' }})    
    const result = (await client.net.query_collection({
      collection: "messages",
        filter: {
          src: {
            eq: clientAddr,
          }, 
            OR:{
              dst:{
                eq:clientAddr
              }
          },
        }, 
        limit:10,
        order:[{path:"created_at",direction:'DESC'}],
        result: "id src dst created_at_string msg_type msg_type_name value boc body",
    })).result;
      
    // console.log('messages: '+parseInt(result[0]));
    console.log('message: ')
    let resultArr = [];
    for (let i = 0; i < result.length; i++) {

      // console.log(result[i])

      let resMessage = await decode.message(DEXclientContract.abi, result[i].boc) 
      if (resMessage == 304) {resMessage = await decode.message(DEXrootContract.abi, result[i].boc)} 
      if (resMessage == 304) {resMessage = await decode.message(DEXpairContract.abi, result[i].boc)} 
      if (resMessage == 304) {resMessage = await decode.message(RootTokenContract.abi, result[i].boc)} 
      if (resMessage == 304) {resMessage = await decode.message(TONTokenWalletContract.abi, result[i].boc)} 
       
      // let resBody = await decode.body(DEXclientContract.abi, result[i].body)
      // if (resBody == 304) {resBody = await decode.body(DEXrootContract.abi, result[i].body)} 
      // if (resBody == 304) {resBody = await decode.body(DEXpairContract.abi, result[i].body)} 
      // if (resBody == 304) {resBody = await decode.body(RootTokenContract.abi, result[i].body)} 
      // if (resBody == 304) {resBody = await decode.body(TONTokenWalletContract.abi, result[i].body)} 

      console.log(`Type inbound message "${resMessage.body_type}", function "${resMessage.name}", parameters: `, JSON.stringify(resMessage.value));
      // console.log(`Type inbound message "${resBody.body_type}", function "${resBody.name}", parameters: `, JSON.stringify(resBody.value));
      resultArr.push({
        type: resMessage.name
      })
    }
    return resultArr;
  } catch (e) {
    console.log(e)
  }              
}

export async function getALLmessages(clientAddr) {
  try {
    const client = new TonClient({network: { server_address: 'net.ton.dev' }})
    // const result = (await client.net.query_collection({collection: "messages",filter: {src: {eq: clientAddr,}, OR:{dst:{eq:clientAddr}},}, limit:50, orderBy:[{path:"created_at",direction:"ASC"},{path:"created_lt"}],result: "id src dst created_at created_lt",})).result;
    const result = (await client.net.query_collection({
      collection: "messages",
        filter: {
          src: {
            eq: clientAddr,
          }, 
          OR:{
            dst:{
              eq:clientAddr
            }
          },
        }, 
        result: "id src dst created_at_string msg_type msg_type_name value boc body",
    })).result;
           
    // console.log('messages: '+parseInt(result[0]));
    console.log('message: ')
    for (let i = 0; i < result.length; i++) {
      console.log(result[i])
    }      
  } catch (e) {
    console.log(e)
  }              
}

export async function getALLtransactions(clientAddr) {
  try {
    const client = new TonClient({network: { server_address: 'net.ton.dev' }});
    const result = (await client.net.query_collection({
      collection: "transactions",
        filter: {
          account_addr: {
            eq: clientAddr,
          }, 
          // limit:50, 
          // orderBy:[
          //   {
          //     path:"created_at",
          //     direction:"ASC"
          //   },
          //   {
          //     path:"created_lt"
          //   }
          // ],
        }, 
        result: "id now lt",
    })).result

    console.log('transactions: ')
    for (let i = 0; i < result.length; i++) {
      console.log(result[i])
    }
    
  } catch (e) {
    console.log(e)
  }              
}

export async function getTransactionID(idTransaction) {
  try {
    const client = new TonClient({network: { server_address: 'net.ton.dev' }})
    const result = (await client.net.query_collection({
      collection: "transactions",
        filter: {
          id: {
            eq: idTransaction,
          },  
        }, 
        result: "id tr_type tr_type_name aborted block_id account_addr balance_delta workchain_id lt prev_trans_lt now outmsg_cnt orig_status_name end_status_name in_msg in_message{ msg_type_name src dst value} boc",
    })).result

    console.log(result[0])

    
  //   const decoded = (await TonClient.default.abi.decode_message({
  //     abi: abiContract(DEXclientContract.abi),   //DEXclientContract.abi 
  //     message: result[0].boc,
  // }));
  // console.log(`External inbound message, function "${decoded.name}", parameters: `, JSON.stringify(decoded.value));

  const transactionBoc = (await client.boc.parse_transaction({boc: result[0].boc}))

  console.log(transactionBoc.parsed)    

  } catch (e) {
    console.log(e)
  }              
}

export async function getParseBOC(messageID) {  //messageID
  try {

    // {
    //   messages(
    //     filter:{ 
    //       id: {eq:"35fe6636ed39fce73419164d9114b6bf25cc0719996bedb0381847351ca2fbbe"} 
    //     }
    //   )
    //   {
    //     id    
    //     src
    //     dst
    //     created_at_string
    //     created_lt
    //     data
    //     value
    //     boc
    //   }
    // }

    const client = new TonClient({network: { server_address: 'net.ton.dev' }})  //'net.ton.dev'  "http://localhost"
    const result = (await client.net.query_collection({
      collection: "messages",
        filter: {
          id: {
            eq: messageID,
          },  
        }, 
        result: "boc body",
    })).result

    // const messageSubscription = await TonClient.default.net.subscribe_collection({     
    //   // collection: "messages",
    //   // filter: {
    //   //   id: { eq: messageID },
    //   // },
    //   // result: "id src dst created_at_string created_lt data value boc",

    //   collection: "messages",
    //   filter: {
    //       src: { eq: address },
    //       OR: {
    //           dst: { eq: address },
    //       }
    //   },
    //   result: "id src dst created_at_string created_lt data value boc",

    // }, async (params, responseType) => {
      // try {
        // if (responseType === ResponseType.Custom) {
          const decoded = (await TonClient.default.abi.decode_message({
              abi: abiContract(DEXclientContract.abi),  //DEXclientContract.abi RootTokenContract 60ae82cc933c9613a7a9e531129a66195390edd61d8f5b77224893cea003021e
              message: result[0].boc,
          }));
          // switch (decoded.body_type) {
          // case MessageBodyType.Input:
              console.log(`External inbound message, function "${decoded.name}", parameters: `, JSON.stringify(decoded.value));
          

          const decoded_body = (await TonClient.default.abi.decode_message_body({
            abi: abiContract(DEXclientContract.abi),  //DEXclientContract.abi
            body: result[0].body,
            is_internal: true
        }));

          console.log(`External inbound message, function "${decoded_body.name}", parameters: `, JSON.stringify(decoded_body.value));
                            
          const messageBoc = (await client.boc.parse_message({boc: result[0].boc}))

          console.log('value:' +hex2dec.hexToDec(messageBoc.parsed.value))
          // hex2dec(messageBoc.parsed.value)
          console.log(messageBoc.parsed)            
              
              //     break;
          // case MessageBodyType.Output:
          //     console.log(`External outbound message, function "${decoded.name}", result`, JSON.stringify(decoded.value));
          //     break;
          // case MessageBodyType.Event:
          //     console.log(`External outbound message, event "${decoded.name}", parameters`, JSON.stringify(decoded.value));
          //     break;
          // }
        // }
      // } catch (e) {
      //     console.log('>>>', e);
      // }
    // });

    // await TonClient.default.net.unsubscribe(messageSubscription);
  } catch (e) {
    console.log(e)
  }              
}

// window.app = {
//   async requestVersion() {
//     const button = document.getElementById('buttonRequestVersion');
//     button.disabled = true;
//     try {
//       _.checkExtensionAvailability();
//       const provider = _.getProvider();
//       const version = await provider.getVersion();
//       document.getElementById('result').innerHTML += '</br>' + JSON.stringify(version)
//       console.log(version);
//     } catch (e) {
//       document.getElementById('result').innerHTML += '</br>' + JSON.stringify(e);
//       console.log(e);
//     } finally {
//       button.disabled = false;
//     }
//   },
//   async requestNetwork() {
//     const button = document.getElementById('buttonRequestNetwork');
//     button.disabled = true;
//     try {
//       _.checkExtensionAvailability();
//       const provider = _.getProvider();
//       const network = await provider.getNetwork();
//       document.getElementById('result').innerHTML += '</br>' + JSON.stringify(network)
//       console.log(network);
//     } finally {
//       button.disabled = false;
//     }
//   },
//   async requestKeys() {
//     const button = document.getElementById('buttonRequestKeys');
//     button.disabled = true;
//     try {
//       const client = new TonClient({network: { server_address: 'net.ton.dev' }});
//       const keys = await client.crypto.generate_random_sign_keys();
//       document.getElementById('result').innerHTML += '</br>' + JSON.stringify(keys)
//       console.log(keys);
//     } catch (e) {
//       document.getElementById('result').innerHTML += '</br>' + JSON.stringify(e);
//       console.log(e);
//     } finally {
//       button.disabled = false;
//     }
//   },
//   async getWallet() {
//     const button = document.getElementById('buttonGetWallet');
//     button.disabled = true;
//     try {
//       _.checkExtensionAvailability();
//       const provider = _.getProvider();
//       const signer = await provider.getSigner();
//       // const wallet = await signer.getWallet();
//       document.getElementById('result').innerHTML += '</br>' + 'wallet: '+ JSON.stringify(signer.wallet.address);
//       console.log('wallet: '+signer.wallet.address);
//       const client = new TonClient({network: { server_address: 'net.ton.dev' }});
//       const result = (await client.net.query_collection({collection: "accounts",filter: {id: {eq: signer.wallet.address,},},result: "balance",})).result;
//       document.getElementById('result').innerHTML += '</br>' + 'balance: '+ JSON.stringify(parseInt(result[0].balance));
//       console.log('balance: '+parseInt(result[0].balance));
//     } catch (e) {
//       document.getElementById('result').innerHTML += '</br>' + JSON.stringify(e);
//       console.log(e);
//     } finally {
//       button.disabled = false;
//     }
//   },
//   async getPubKey() {
//     const button = document.getElementById('buttonGetPublicKey');
//     button.disabled = true;
//     try {
//       _.checkExtensionAvailability();
//       const provider = _.getProvider();
//       const signer = await provider.getSigner();
//       const pubkey = await signer.getPublicKey();
//       document.getElementById('result').innerHTML += '</br>' + 'public key: '+ JSON.stringify(pubkey)
//       console.log('public key: '+pubkey);
//     } catch (e) {
//       document.getElementById('result').innerHTML += '</br>' + JSON.stringify(e);
//       console.log(e);
//     } finally {
//       button.disabled = false;
//     }
//   },
//   async checkPubKey() {
//     const button = document.getElementById('buttonCheckPublicKey');
//     button.disabled = true;
//     try {
//       _.checkExtensionAvailability();
//       const provider = _.getProvider();
//       const signer = await provider.getSigner();
//       const pubkey = await signer.getPublicKey();
//       const contract = new freeton.Contract(provider, DEXrootContract.abi, Radiance.networks['2'].dexroot);
//       const result = await contract.methods.checkPubKey.run({pubkey:"0x"+pubkey});
//       document.getElementById('result').innerHTML += '</br>' + 'checkPubKey: '+ JSON.stringify(result)
//       console.log('checkPubKey: '+result.status);
//       console.log('checkPubKey: '+result.dexclient);
//       if (result.status == true) {
//         const client = new TonClient({network: { server_address: 'net.ton.dev' }});
//         const balance = (await client.net.query_collection({collection: "accounts",filter: {id: {eq: result.dexclient,},},result: "balance",})).result;
//         document.getElementById('result').innerHTML += '</br>' + ' balance: '+ JSON.stringify(parseInt(balance[0].balance))
//         console.log('balance: '+parseInt(balance[0].balance));
//       }

//     } catch (e) {
//       document.getElementById('result').innerHTML += '</br>' + JSON.stringify(e);
//       console.log(e);
//     } finally {
//       button.disabled = false;
//     }
//   },
//   async computeDEXclientAddr(form) {
//     const button = document.getElementById('buttonComputeDEXclientAddr');
//     button.disabled = true;
//     try {
//       _.checkExtensionAvailability();
//       const provider = _.getProvider();
//       const signer = await provider.getSigner();
//       const pubkey = await signer.getPublicKey();
//       const contract = new freeton.Contract(provider, DEXrootContract.abi, Radiance.networks['2'].dexroot);
//       const result = await contract.methods.computeDEXclientAddrWithId.run({pubkey:"0x"+pubkey,clientId:form.clientId.value});
//       document.getElementById('result').innerHTML += '</br>' + 'computeDEXclientAddrWithId: '+ JSON.stringify(result)
//       console.log('computeDEXclientAddrWithId: '+result.value0);
//     } catch (e) {
//       document.getElementById('result').innerHTML += '</br>' + JSON.stringify(e);
//       console.log(e);
//     } finally {
//       button.disabled = false;
//     }
//   },
//   async createDEXclient(form) {
//     const button = document.getElementById('buttonCreateDEXclient');
//     button.disabled = true;
//     try {
//       _.checkExtensionAvailability();
//       const provider = _.getProvider();
//       const signer = await provider.getSigner();
//       const pubkey = await signer.getPublicKey();
//       const contract = new freeton.Contract(signer, DEXrootContract.abi, Radiance.networks['2'].dexroot);
//       const contractMessageProcessing = await contract.methods.createDEXclient.call({pubkey:"0x"+pubkey,clientId:form.clientId.value});
//       await contractMessageProcessing.wait();
//       console.log(`Called. TxId: ${contractMessageProcessing.txid}`)
//       document.getElementById('result').innerHTML += '</br>' + `Called. TxId: ${contractMessageProcessing.txid}`
//       // const client = new TonClient({network: { server_address: 'net.ton.dev' }});
//       // const balance = (await client.net.query_collection({collection: "accounts",filter: {id: {eq: result.value0,},},result: "balance",})).result;
//       document.getElementById('result').innerHTML += '</br>' + 'createDEXclient: '+ JSON.stringify(contractMessageProcessing)
//       console.log('createDEXclient: '+contractMessageProcessing);
//       // console.log('balance: '+parseInt(balance[0].balance));
//     } catch (e) {
//       document.getElementById('result').innerHTML += '</br>' + JSON.stringify(e);
//       console.log(e);
//     } finally {
//       button.disabled = false;
//     }
//   },
//   async getClientRoots() {
//     const button = document.getElementById('buttonGetClientRoots');
//     button.disabled = true;
//     try {
//       _.checkExtensionAvailability();
//       const provider = _.getProvider();
//       const signer = await provider.getSigner();
//       const pubkey = await signer.getPublicKey();
//       const root = new freeton.Contract(provider, DEXrootContract.abi, Radiance.networks['2'].dexroot);
//       const rootData = await root.methods.checkPubKey.run({pubkey:"0x"+pubkey});
//       if (rootData.status == true) {
//         const dexclient = new freeton.Contract(provider, DEXclientContract.abi, rootData.dexclient);
//         const dexclientData = await dexclient.methods.getAllDataPreparation.run();
//         document.getElementById('result').innerHTML += '</br>' + 'getAllClienRoots: '+ JSON.stringify(dexclientData.rootKeysR)
//         console.log('getAllClienRoots: '+dexclientData.rootKeysR);
//         for (const item of dexclientData.rootKeysR) {
//           const tokenRoot = new freeton.Contract(provider, RootTokenContract.abi, item);
//           const symbol = await tokenRoot.methods.getSymbol.run();
//           const addr = await dexclient.methods.getWalletByRoot.run({rootAddr:item});
//           const tokenWallet = new freeton.Contract(provider, TONTokenWalletContract.abi, addr.wallet);
//           const balance = await tokenWallet.methods.getBalance.run();
//           document.getElementById('result').innerHTML += '</br>' + 'symbol: '+ JSON.stringify(hex2ascii(symbol.value0))+' balance: '+ JSON.stringify(balance.value0)
//           console.log('symbol: '+hex2ascii(symbol.value0)+' balance: '+balance.value0);
//         }
//       } else {
//         document.getElementById('result').innerHTML += '</br>' + 'DEXclient status false'
//         console.log('DEXclient status false');
//       }
//     } catch (e) {
//       document.getElementById('result').innerHTML += '</br>' + JSON.stringify(e);
//       console.log(e);
//     } finally {
//       button.disabled = false;
//     }
//   },
//   async getClientPairs() {
//     const button = document.getElementById('buttonGetClientPairs');
//     button.disabled = true;
//     try {
//       _.checkExtensionAvailability();
//       const provider = _.getProvider();
//       const signer = await provider.getSigner();
//       const pubkey = await signer.getPublicKey();
//       const root = new freeton.Contract(provider, DEXrootContract.abi, Radiance.networks['2'].dexroot);
//       const rootData = await root.methods.checkPubKey.run({pubkey:"0x"+pubkey});
//       if (rootData.status == true) {
//         const dexclient = new freeton.Contract(provider, DEXclientContract.abi, rootData.dexclient);
//         const dexclientData = await dexclient.methods.getAllDataPreparation.run();
//         document.getElementById('result').innerHTML += '</br>' + 'getAllClienPairs: '+ JSON.stringify(dexclientData.pairKeysR)
//         console.log('getAllClienPairs: '+dexclientData.pairKeysR);
//         for (const item of dexclientData.pairKeysR) {
//           const dexpair = new freeton.Contract(provider, DEXpairContract.abi, item);
//           let pairData = await dexpair.methods.getPair.run();
//           let rootA = pairData.addressRootA;
//           let rootB = pairData.addressRootB;
//           const rootTokenA = new freeton.Contract(provider, RootTokenContract.abi, rootA);
//           const rootTokenB = new freeton.Contract(provider, RootTokenContract.abi, rootB);
//           let symbolA = await rootTokenA.methods.getSymbol.run();
//           let symbolB = await rootTokenB.methods.getSymbol.run();
//           symbolA = hex2ascii(symbolA.value0);
//           symbolB = hex2ascii(symbolB.value0);
//           console.log('Pair:'+symbolA+' : '+symbolB+' addr: '+item);
//           document.getElementById('result').innerHTML += '</br>' +'Pair: '+JSON.stringify(symbolA)+' : '+JSON.stringify(symbolB)+' addr: '+JSON.stringify(item);

//         }
//       } else {
//         document.getElementById('result').innerHTML += '</br>' + 'DEXclient status false'
//         console.log('DEXclient status false');
//       }
//     } catch (e) {
//       document.getElementById('result').innerHTML += '</br>' + JSON.stringify(e);
//       console.log(e);
//     } finally {
//       button.disabled = false;
//     }
//   },

//   async connectDEXpair(form) {
//     const button = document.getElementById('buttonConnectDEXpair');
//     button.disabled = true;
//     try {
//       _.checkExtensionAvailability();
//       const provider = _.getProvider();
//       const signer = await provider.getSigner();
//       const pubkey = await signer.getPublicKey();
//       const root = new freeton.Contract(provider, DEXrootContract.abi, Radiance.networks['2'].dexroot);
//       const rootData = await root.methods.checkPubKey.run({pubkey:"0x"+pubkey});
//       if (rootData.status == true) {
//         const contract = new freeton.Contract(signer, DEXclientContract.abi, rootData.dexclient);
//         const contractMessageProcessing = await contract.methods.connectPair.call({pairAddr:form.pairAddr.value});
//         await contractMessageProcessing.wait();
//         console.log(`Called. TxId: ${contractMessageProcessing.txid}`)
//         document.getElementById('result').innerHTML += '</br>' + `Called. TxId: ${contractMessageProcessing.txid}`
//         // const client = new TonClient({network: { server_address: 'net.ton.dev' }});
//         // const balance = (await client.net.query_collection({collection: "accounts",filter: {id: {eq: result.value0,},},result: "balance",})).result;
//         document.getElementById('result').innerHTML += '</br>' + 'createDEXclient: '+ JSON.stringify(contractMessageProcessing)
//         console.log('createDEXclient: '+contractMessageProcessing);
//         // console.log('balance: '+parseInt(balance[0].balance));
//       } else {
//         document.getElementById('result').innerHTML += '</br>' + 'DEXclient status false'
//         console.log('DEXclient status false');
//       }
//     } catch (e) {
//       document.getElementById('result').innerHTML += '</br>' + JSON.stringify(e);
//       console.log(e);
//     } finally {
//       button.disabled = false;
//     }
//   },

//   async swapA() {
//     const button = document.getElementById('buttonConnectDEXpair');
//     button.disabled = true;
//     try {
//       _.checkExtensionAvailability();
//       const provider = _.getProvider();
//       const signer = await provider.getSigner();
//       const pubkey = await signer.getPublicKey();
//       const root = new freeton.Contract(provider, DEXrootContract.abi, Radiance.networks['2'].dexroot);
//       const rootData = await root.methods.checkPubKey.run({pubkey:"0x"+pubkey});
//       if (rootData.status == true) {
//         const contract = new freeton.Contract(signer, DEXclientContract.abi, rootData.dexclient);
//         const contractMessageProcessing = await contract.methods.connectPair.call({pairAddr:form.pairAddr.value});
//         await contractMessageProcessing.wait();
//         console.log(`Called. TxId: ${contractMessageProcessing.txid}`)
//         document.getElementById('result').innerHTML += '</br>' + `Called. TxId: ${contractMessageProcessing.txid}`
//         // const client = new TonClient({network: { server_address: 'net.ton.dev' }});
//         // const balance = (await client.net.query_collection({collection: "accounts",filter: {id: {eq: result.value0,},},result: "balance",})).result;
//         document.getElementById('result').innerHTML += '</br>' + 'createDEXclient: '+ JSON.stringify(contractMessageProcessing)
//         console.log('createDEXclient: '+contractMessageProcessing);
//         // console.log('balance: '+parseInt(balance[0].balance));
//       } else {
//         document.getElementById('result').innerHTML += '</br>' + 'DEXclient status false'
//         console.log('DEXclient status false');
//       }
//     } catch (e) {
//       document.getElementById('result').innerHTML += '</br>' + JSON.stringify(e);
//       console.log(e);
//     } finally {
//       button.disabled = false;
//     }
//   },



//   async runContractMethod() {
//     const button = document.getElementById('buttonRunContractMethod');
//     button.disabled = true;
//     try {
//       _.checkExtensionAvailability();
//       const provider = _.getProvider();
//       const contract = new freeton.Contract(provider, Kington.abi, Kington.networks['2'].address);
//       const messages = await contract.methods.getMessages.run();
//       document.getElementById('result').innerHTML += '</br>' + JSON.stringify(messages);
//       console.log(messages);
//     } catch (e) {
//       document.getElementById('result').innerHTML += '</br>' + JSON.stringify(e);
//       console.log(e);
//     } finally {
//       button.disabled = false;
//     }
//   },
//   async runContractR1Method() {
//     const button = document.getElementById('buttonCallContractR1Method');
//     button.disabled = true;
//     try {
//       _.checkExtensionAvailability();
//       const provider = _.getProvider();
//       const contract = new freeton.Contract(provider, DEXrootContract.abi, Radiance.networks['2'].dexroot);
//       let pairsArr = await contract.methods.pairKeys.run();
//       pairsArr = pairsArr.pairKeys;
//       for (const item of pairsArr) {
//         const dexpair = new freeton.Contract(provider, DEXpairContract.abi, item);
//         let pairData = await dexpair.methods.getPair.run();
//         let rootA = pairData.addressRootA;
//         let rootB = pairData.addressRootB;
//         let reserveA = pairData.balanceReserveA;
//         let reserveB = pairData.balanceReserveB;
//         const rootTokenA = new freeton.Contract(provider, RootTokenContract.abi, rootA);
//         const rootTokenB = new freeton.Contract(provider, RootTokenContract.abi, rootB);
//         let symbolA = await rootTokenA.methods.getSymbol.run();
//         let symbolB = await rootTokenB.methods.getSymbol.run();
//         symbolA = hex2ascii(symbolA.value0);
//         symbolB = hex2ascii(symbolB.value0);
//         console.log('Pair:'+symbolA+' : '+symbolB+' addr: '+item);
//         document.getElementById('result').innerHTML += '</br>' +'Pair: '+JSON.stringify(symbolA)+' : '+JSON.stringify(symbolB)+' addr: '+JSON.stringify(item);
//         console.log("reserveA:", reserveA);
//         document.getElementById('result').innerHTML += '</br>' + 'reserveA: '+JSON.stringify(reserveA);
//         console.log("reserveB:", reserveB);
//         document.getElementById('result').innerHTML += '</br>' + 'reserveB: '+JSON.stringify(reserveB);
//         let rateBA = Number(reserveA)/Number(reserveB);
//         let rateAB = Number(reserveB)/Number(reserveA);
//         console.log('1 '+symbolA+' = '+rateAB+' '+symbolB);
//         document.getElementById('result').innerHTML += '</br>' + 'rateAB: '+'1 '+JSON.stringify(symbolA)+' = '+JSON.stringify(rateAB)+' '+JSON.stringify(symbolB);
//         console.log('1 '+symbolB+' = '+rateBA+' '+symbolA);
//         document.getElementById('result').innerHTML += '</br>' + 'rateBA: '+'1 '+JSON.stringify(symbolB)+' = '+JSON.stringify(rateBA)+' '+JSON.stringify(symbolA);
//       }
//     } catch (e) {
//       document.getElementById('result').innerHTML += '</br>' + JSON.stringify(e);
//       console.log(e);
//     } finally {
//       button.disabled = false;
//     }
//   },
//   async runContractR2Method() {
//     const button = document.getElementById('buttonCallContractR2Method');
//     button.disabled = true;
//     try {
//       const client = new TonClient({network: { server_address: 'net.ton.dev' }});
//       const rootAddress = Radiance.networks['2'].dexroot;
//       const rootAcc = new Account( DEXrootContract, {address:rootAddress,client,});
//       const response = await rootAcc.runLocal("pairKeys", {});
//       document.getElementById('result').innerHTML += '</br>' + JSON.stringify(response.decoded.output.pairKeys)
//       console.log(response.decoded.output.pairKeys);
//     } catch (e) {
//       document.getElementById('result').innerHTML += '</br>' + JSON.stringify(e);
//       console.log(e);
//     } finally {
//       button.disabled = false;
//     }
//   },
//   async deploy() {
//     const button = document.getElementById('buttonDeploy');
//     button.disabled = true;
//     try {
//       _.checkExtensionAvailability();
//       const provider = _.getProvider();
//       const signer = await provider.getSigner();
//       const contractBuilder = new freeton.ContractBuilder(signer, KingtonOrder.abi, KingtonOrder.imageBase64);
//       contractBuilder.setInitialAmount('1000022000');
//       const constructorParams = {
//         destinationAddress: Kington.networks['2'].address,
//         message: freeton.utils.stringToHex('London is the capital of Great Britain.'),
//       };
//       const contract = await contractBuilder.deploy(constructorParams);
//       await contract.getDeployProcessing().wait();
//       console.log(`Deployed. TxId: ${contract.getDeployProcessing().txid}`)
//     } finally {
//       button.disabled = false;
//     }
//   },
//   async transfer(form) {//Transfer tokens with message "Hello".
//     const button = document.getElementById('buttonTransfer');
//     button.disabled = true;
//     try {
//       _.checkExtensionAvailability();
//       const provider = _.getProvider();
//       const signer = await provider.getSigner();
//       const wallet = signer.getWallet();
//       const payload = 'te6ccgEBAgEADgABCAAAAAABAApIZWxsbw==';
//       const contractMessageProcessing = await wallet.transfer(form.address.value, form.amount.value, false, payload);
//       await contractMessageProcessing.wait();
//       console.log(`Transferred. TxId: ${contractMessageProcessing.txid}`)
//     } finally {
//       button.disabled = false;
//     }
//   },
//   async confirmTransaction(form) {
//     const button = document.getElementById('buttonConfirmTransaction');
//     button.disabled = true;
//     try {
//       _.checkExtensionAvailability();
//       const provider = _.getProvider();
//       const signer = await provider.getSigner();
//       const wallet = new freeton.Wallet(signer, form.address.value);
//       const contractMessageProcessing = await wallet.confirmTransaction(form.txid.value);
//       await contractMessageProcessing.wait();
//       console.log(`Confirmed. TxId: ${contractMessageProcessing.txid}`)
//     } finally {
//       button.disabled = false;
//     }
//   },
//   async callContractMethod() {
//     const button = document.getElementById('buttonCallContractMethod');
//     button.disabled = true;
//     try {
//       _.checkExtensionAvailability();
//       const provider = _.getProvider();
//       const signer = await provider.getSigner();
//       const contract = new freeton.Contract(signer, SetcodeMultisigWallet.abi, '0:bc6ed51718ca3fe6ba96d84e8a0f2f409423b6e3f3198d08634cd7f74372ed48');
//       const input = {
//         dest: '0:11684118bc3062a07126191bf17a650dbb101aff809eb79a9c64b061f4b9b97b',
//         value: '500000000',
//         bounce: false,
//         allBalance: false,
//         payload: '',
//       };
//       const contractMessageProcessing = await contract.methods.submitTransaction.call(input);
//       await contractMessageProcessing.wait();
//       console.log(`Called. TxId: ${contractMessageProcessing.txid}`)
//       document.getElementById('result').innerHTML += '</br>' + `Called. TxId: ${contractMessageProcessing.txid}`
//     } catch (e) {
//       document.getElementById('result').innerHTML += '</br>' + JSON.stringify(e);
//       console.log(e);
//     } finally {
//       button.disabled = false;
//     }
//   },
//   async getTokenList() {
//     const button = document.getElementById('buttonGetTokenList');
//     button.disabled = true;
//     try {
//       _.checkExtensionAvailability();
//       const provider = _.getProvider();
//       const signer = await provider.getSigner();
//       const wallet = signer.getWallet();
//       const tokenList = await wallet.getTokenList();
//       console.log(tokenList);
//     } catch (e) {
//       document.getElementById('result').innerHTML += '</br>' + JSON.stringify(e);
//       console.log(e);
//     } finally {
//       button.disabled = false;
//     }
//   },
//   async transferToken(form) {
//     const button = document.getElementById('buttonTransferToken');
//     button.disabled = true;
//     try {
//       _.checkExtensionAvailability();
//       const provider = _.getProvider();
//       const signer = await provider.getSigner();
//       const wallet = signer.getWallet();
//       const tokenList = await wallet.getTokenList();
//       let token = null;
//       for (const item of tokenList) {
//         if (item.rootAddress === form.rootAddress.value) {
//           token = item;
//         }
//       }
//       if (null === token) {
//         throw 'Token with this rootAddress not found in extension.';
//       }
//       const contractMessageProcessing = await token.transfer(form.address.value, form.amount.value);
//       await contractMessageProcessing.wait();
//       console.log(`Transferred. TxId: ${contractMessageProcessing.txid}`)
//       document.getElementById('result').innerHTML += '</br>' + `Transferred. TxId: ${contractMessageProcessing.txid}`
//     } catch (e) {
//       document.getElementById('result').innerHTML += '</br>' + JSON.stringify(e);
//       console.log(e);
//     } finally {
//       button.disabled = false;
//     }
//   },
// };
