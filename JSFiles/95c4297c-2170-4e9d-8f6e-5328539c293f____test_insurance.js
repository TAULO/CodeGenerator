/**
  Copyright (c) 2018, ZSC Dev Team
  2018-10-19: v0.00.01
 */

import Output from "../common/output.js";
import Transaction from "../common/transaction_raw.js";
import Delegate from "../common/delegate.js";
import Watch from "../common/watch.js";
import Insurance from "../insurance/insurance.js";
import InsuranceExtension from "../insurance/insurance_extension.js";
import InsuranceWatch from "../insurance/insurance_watch.js";

//private member
const compiledJson = Symbol("compiledJson");

const companyAbi = Symbol("companyAbi");
const companyContractAddress = Symbol("companyContractAddress");

const templateAbi = Symbol("templateAbi");
const templateContractAddress = Symbol("templateContractAddress");

const userAbi = Symbol("userAbi");
const userContractAddress = Symbol("userContractAddress");

const policyAbi = Symbol("policyAbi");
const policyContractAddress = Symbol("policyContractAddress");

const integralAbi = Symbol("integralAbi");
const integralContractAddress = Symbol("integralContractAddress");

const abi = Symbol("abi");
const contractAddress = Symbol("contractAddress");

const extensionAbi = Symbol("extensionAbi");
const extensionContractAddress = Symbol("extensionContractAddress");

const watch = Symbol("watch");

//private function
const getLocalTime = Symbol("getLocalTime");
const getAccount = Symbol("getAccount");
const transactionProc = Symbol("transactionProc");
const hexToString = Symbol("hexToString");
const getErrorStr = Symbol("getErrorStr");
const getDelegateInstance = Symbol("getDelegateInstance");
const companyBatch = Symbol("companyBatch");
const templateBatch = Symbol("templateBatch");

export default class TestInsurance {

    constructor() {
        this[compiledJson] = [];

        this[companyAbi] = [];
        this[templateAbi] = [];
        this[userAbi] = [];
        this[policyAbi] = [];
        this[integralAbi] = [];
        this[abi] = [];
        this[extensionAbi] = [];

        this[companyContractAddress] = "";
        this[templateContractAddress] = "";
        this[userContractAddress] = "";
        this[policyContractAddress] = "";
        this[integralContractAddress] = "";
        this[contractAddress] = "";
        this[extensionContractAddress] = [];

        this[watch] = new Watch();
        this[watch].add("integral", "transfer");
        this[watch].add("integral", "approval");
    }

    [getLocalTime]() {
        let date = new Date();
        let utc = parseInt(date.getTime()/1000);
        let timeZone = date.getTimezoneOffset();
        let time = utc - timeZone*60;
        return time;
    }

    [getAccount]() { 
        let channels = window.channelClass.get("idle");

        if (0 == channels.length) {
            return new Array(0, 0);
        }

        return new Array(channels[0].account, channels[0].key);
    }

    [transactionProc](error, result, output, func) { 
        if (!error) {
            if ("" != result.status) {
                let status;
                if (0x1 == parseInt(result.status)) {
                    status = "succeeded";
                } else {
                    status = "failure";
                }
                let string = `[TransactionHash]:${result.transactionHash}</br>[Status]:${status}</br>[Try]:${result.tryTimes}(times)`;
                Output(output, "small", "red", string);

                if (("succeeded" == status) && (null != func) && ("" != func)) {
                    func();
                }
            } else {
                let status = "Try to get status again!";
                let string = `[TransactionHash]:${result.transactionHash}</br>[Status]:${status}</br>[Try]:${result.tryTimes}(times)`;
                Output(output, "small", "red", string);
            }
        } else {
            Output(output, "small", "red", error);
        }
    }

    [hexToString](str) {
        let value = "";
        let byte = "";
        let code = "";

        str = str.substr(str.indexOf("0x")+2);

        for(let i=0; i<str.length/2; i++) {
            byte = str.substring(i*2, i*2+2);
            code = parseInt(byte, 16);
            if ("0" == code) {
                break;
            }
            value += String.fromCharCode(code);
        }

        return value;
    }

    [getErrorStr](error) {
        let str = "";
        if ("0" == error) {
            str = "SUCCESS     ";
        } else if ("-1" == error) {
            str = "PARAMS ERROR";
        } else if ("-2" == error) {
            str = "NO DATA     ";
        } else if ("-3" == error) {
            str = "NO AUTH     ";
        } else if ("-9" == error) {
            str = "INNER ERROR ";
        } else {
            str = "UNKNOW ERROR";
        }

        return str;
    }

    setCompiledJson(data) {
        this[compiledJson] = JSON.parse(data);
    }

    live() {
    }

    deploy(contractName) {
        console.log("TestInsurance.deploy(%s)", contractName);
        let elementId;

        if ("InsuranceCompany" == contractName) {
            elementId = window.outputDeployCompanyElement;
        } else if ("InsuranceTemplate" == contractName) {
            elementId = window.outputDeployTemplateElement;
        } else if ("InsuranceUser" == contractName) {
            elementId = window.outputDeployUserElement;
        } else if ("InsurancePolicy" == contractName) {
            elementId = window.outputDeployPolicyElement;
        } else if ("InsuranceIntegral" == contractName) {
            elementId = window.outputDeployIntegralElement;
        } else if ("Insurance" == contractName) {
            elementId = window.outputDeployElement;
        } else if ("InsuranceExtension" == contractName) {
            elementId = window.outputDeployExtensionElement;
        } else {
            console.log("Contract name Error!");
            return;
        }

        let tmps = this[getAccount]();
        if (0 == tmps[0]) {
            Output(elementId, "small", "red", "No channnel(idle)!");
            return;
        }

        let account = tmps[0];
        let privateKey = tmps[1];

        let name;
        let fullName;
        let found = false;

        let byteCode;
        let transaction;
        let contract;
        let data;
        let handler = this;

        for (fullName in this[compiledJson].contracts) {
            //console.log(fullName);
            name = fullName.substr(fullName.indexOf(":") + 1);
            if (name == contractName) {
                found = true;
                break;
            }
        }

        if (!found) {
            Output(elementId, "small", "red", "JSON file error！");
            return;
        }

        if ('' == this[compiledJson].contracts[fullName].bin) {
            Output(elementId, "small", "red", "Bin is null in json file!");
            return;
        }     

        byteCode = "0x" + this[compiledJson].contracts[fullName].bin;
        if ("InsuranceCompany" == contractName) {
            this[companyAbi] = JSON.parse(this[compiledJson].contracts[fullName].abi);
            contract = web3.eth.contract(this[companyAbi]);
        } else if ("InsuranceTemplate" == contractName) {
            this[templateAbi] = JSON.parse(this[compiledJson].contracts[fullName].abi);
            contract = web3.eth.contract(this[templateAbi]);
        } else if ("InsuranceUser" == contractName) {
            this[userAbi] = JSON.parse(this[compiledJson].contracts[fullName].abi);
            contract = web3.eth.contract(this[userAbi]);
        } else if ("InsurancePolicy" == contractName) {
            this[policyAbi] = JSON.parse(this[compiledJson].contracts[fullName].abi);
            contract = web3.eth.contract(this[policyAbi]);
        } else if ("InsuranceIntegral" == contractName) {
            this[integralAbi] = JSON.parse(this[compiledJson].contracts[fullName].abi);
            contract = web3.eth.contract(this[integralAbi]);
        } else if ("Insurance" == contractName) {
            this[abi] = JSON.parse(this[compiledJson].contracts[fullName].abi);
            contract = web3.eth.contract(this[abi]);
        } else if ("InsuranceExtension" == contractName) {
            this[extensionAbi] = JSON.parse(this[compiledJson].contracts[fullName].abi);
            contract = web3.eth.contract(this[extensionAbi]);
        } else {
            console.log("Contract name Error!");
            return;
        }

        data = contract.new.getData({data: byteCode});

        // estimate gas
        // The MetaMask Web3 object does not support synchronous methods without a callback parameter
        web3.eth.estimateGas({data: data}, function(error, result) {
            if (!error) {
                transaction = new Transaction(account, privateKey);
                if ("undefined" != typeof transaction) {
                    transaction.do("deploy", data, result, null, function(error, result) {
                        if (!error) {
                            if ("InsuranceCompany" == contractName) {
                                handler[companyContractAddress] = result.contractAddress;
                            } else if ("InsuranceTemplate" == contractName) {
                                handler[templateContractAddress] = result.contractAddress;
                            } else if ("InsuranceUser" == contractName) {
                                handler[userContractAddress] = result.contractAddress;
                            } else if ("InsurancePolicy" == contractName) {
                                handler[policyContractAddress] = result.contractAddress;
                            } else if ("InsuranceIntegral" == contractName) {
                                handler[integralContractAddress] = result.contractAddress;
                            } else if ("Insurance" == contractName) {
                                handler[contractAddress] = result.contractAddress;
                            } else if ("InsuranceExtension" == contractName) {
                                handler[extensionContractAddress] = result.contractAddress;
                            } else {
                                console.log("Contract name Error!");
                                return;
                            }
                            let string = `[TransactionHash]:${result.transactionHash}</br>[ContractAddress]:${result.contractAddress}</br>[Try]:${result.tryTimes}(times)`;
                            Output(elementId, "small", "red", string);
                        } else {
                            Output(elementId, "small", "red", error);
                        }
                    });
                }
            } else {
                Output(elementId, "small", "red", error);
            }
        });
    }

    setup(cmd, contractName) {
        console.log('TestInsurance.setup(%s, %s)', cmd, contractName);
        let handler = this;
        let tmps = this[getAccount]();
        if (0 == tmps[0]) {
            Output(window.outputSetupPauseElement, 'small', 'red', "No channnel(idle)!");
            return;
        }

        let account = tmps[0];
        let privateKey = tmps[1];

        switch (cmd) {
            case "Set":
                if ("Insurance" == contractName) {
                    let insurance = new Insurance(this[abi], this[contractAddress]);
                    insurance.setup(account, privateKey, this[companyContractAddress], this[templateContractAddress], this[userContractAddress], this[policyContractAddress], this[integralContractAddress], function(error, result) {
                        handler[transactionProc](error, result, window.outputSetupPauseElement);
                    });
                } else if ("InsuranceExtension" == contractName) {
                    let insuranceExtension = new InsuranceExtension(this[extensionAbi], this[extensionContractAddress]);
                    insuranceExtension.setup(account, privateKey, this[companyContractAddress], this[templateContractAddress], this[userContractAddress], this[policyContractAddress], this[integralContractAddress], function(error, result) {
                        handler[transactionProc](error, result, window.outputSetupPauseElement);
                    });
                } else {
                    Output(window.outputSetupPauseElement, 'small', 'red', "Contract name Error!");
                }
                break;
            case "Get":
                if ("Insurance" == contractName) {
                    let insurance = new Insurance(this[abi], this[contractAddress]);
                    insurance.getAddr(function(error, result) {
                        if (!error) {
                            Output(window.outputSetupPauseElement, 'small', 'red', `[Address]: company(${result[0]}), template(${result[1]}), user(${result[2]}), policy(${result[3]}), integral(${result[4]}`);
                        } else {
                            Output(window.outputSetupPauseElement, 'small', 'red', error);
                        }
                    });
                } else if ("InsuranceExtension" == contractName) {
                    let insuranceExtension = new InsuranceExtension(this[extensionAbi], this[extensionContractAddress]);
                    insuranceExtension.getAddr(function(error, result) {
                        if (!error) {
                            Output(window.outputSetupPauseElement, 'small', 'red', `[Address]: company(${result[0]}), template(${result[1]}), user(${result[2]}), policy(${result[3]}), integral(${result[4]}`);
                        } else {
                            Output(window.outputSetupPauseElement, 'small', 'red', error);
                        }
                    });
                } else {
                    Output(window.outputSetupPauseElement, 'small', 'red', "Contract name Error!");
                }
                break;
            default:
                Output(window.outputSetupPauseElement, 'small', 'red', "Command Error!");
                break;
        }
    }

    pause(contract, cmd) {
        console.log('TestInsurance.pasue(%s, %s)', contract, cmd);
        let handler = this;
        let tmps = this[getAccount]();
        if (0 == tmps[0]) {
            Output(window.outputSetupPauseElement, 'small', 'red', "No channnel(idle)!");
            return;
        }

        let account = tmps[0];
        let privateKey = tmps[1];
        let insurance;
        switch (cmd) {
            case "Pause":
                if ("Insurance" == contract) {
                    insurance = new Insurance(this[abi], this[contractAddress]);
                } else {
                    insurance = new InsuranceExtension(this[extensionAbi], this[extensionContractAddress]);
                }
                insurance.pause(account, privateKey, function(error, result) {
                    handler[transactionProc](error, result, window.outputSetupPauseElement);
                });
                break;
            case "UnPause":
                if ("Insurance" == contract) {
                    insurance = new Insurance(this[abi], this[contractAddress]);
                } else {
                    insurance = new InsuranceExtension(this[extensionAbi], this[extensionContractAddress]);
                }
                insurance.unpause(account, privateKey, function(error, result) {
                    handler[transactionProc](error, result, window.outputSetupPauseElement);
                });
                break;
            case "Paused":
                if ("Insurance" == contract) {
                    insurance = new Insurance(this[abi], this[contractAddress]);
                } else {
                    insurance = new InsuranceExtension(this[extensionAbi], this[extensionContractAddress]);
                }
                insurance.paused(function(error, result) {
                    if (!error) {
                        Output(window.outputSetupPauseElement, 'small', 'red', `[Paused]: ${result}`);
                    } else {
                        Output(window.outputSetupPauseElement, 'small', 'red', error);
                    }
                });
                break;
            default:
                Output(window.outputSetupPauseElement, 'small', 'red', "Command Error!");
                break;
        }
    }

    [getDelegateInstance](contract) {
        let delegate = null;
        if ("InsuranceCompany" == contract) {
            delegate = new Delegate(this[companyAbi], this[companyContractAddress]);
        } else if ("InsuranceTemplate" == contract) {
            delegate = new Delegate(this[templateAbi], this[templateContractAddress]);
        } else if ("InsuranceUser" == contract) {
            delegate = new Delegate(this[userAbi], this[userContractAddress]);
        } else if ("InsurancePolicy" == contract) {
            delegate = new Delegate(this[policyAbi], this[policyContractAddress]);
        } else if ("Insurance" == contract) {
            delegate = new Delegate(this[abi], this[contractAddress]);
        } else if ("InsuranceIntegral" == contract) {
            delegate = new Delegate(this[integralAbi], this[integralContractAddress]);
        } else if ("InsuranceExtension" == contract) {
            delegate = new Delegate(this[extensionAbi], this[extensionContractAddress]);
        } else {}

        return delegate;       
    }

    delegate(cmd, params) {
        console.log('TestInsurance.delegate(%s; %s)', cmd, params);
        let handler = this;
        let tmps = this[getAccount]();
        if (0 == tmps[0]) {
            Output(window.outputDelegateReadElement, 'small', 'red', "No channnel(idle)!");
            return;
        }

        let account = tmps[0];
        let key = tmps[1];

        tmps = params.split(",");
        let contract = tmps[0];
        let address = tmps[1];

        let delegate = this[getDelegateInstance](contract);
        if (null == delegate) {
            Output(window.outputDelegateReadElement, 'small', 'red', "Delegate instance Error!");
            return;
        }

        switch (cmd) {
            case "Debug":
                delegate.number(function(error, result) {
                    if (!error) {
                        let sum = parseInt(result.toString(10));
                        let logs = new Array(sum);
                        let count = 0;
                        for (let i=0; i<sum; i++) {
                            delegate.getInfoById(i, function(error, id, result) {
                                if (!error) {
                                    logs[id] = `[Delegate${id}]: ${result}`;
                                    count ++;
                                    if (count == sum) {
                                        let str = "";
                                        for (let j=0; j<logs.length; j++) {
                                            str = str.concat(`${logs[j]}<br>`);
                                        }
                                        Output(window.outputDelegateReadElement, 'small', 'red', str);
                                    }                                 
                                } else {
                                    Output(window.outputDelegateReadElement, 'small', 'red', `[Delegate${id}]:</br>${error}`);
                                }
                            })
                        }
                    } else {
                        Output(window.outputDelegateReadElement, 'small', 'red', error);
                    }
                })               
                break;
            case "Update":
                let priority = tmps[2];

                if ((undefined == address) || ("" == address) ||(undefined == priority)) {
                    Output(window.outputDelegateWriteElement, 'small', 'red', "Please input address/priority!");
                    return;
                }

                // update
                delegate.update(account, key, address, priority, function(error, result) {
                    handler[transactionProc](error, result, window.outputDelegateWriteElement);
                });

                break;
            case "Remove":
                if ((undefined == address) || ("" == address)) {
                    Output(window.outputDelegateWriteElement, 'small', 'red', "Please input address/priority!");
                    return;
                }

                // remove
                delegate.remove(account, key, address, function(error, result) {
                    handler[transactionProc](error, result, window.outputDelegateWriteElement);
                });
                break;
            case "Transfer":
                if ((undefined == address) || ("" == address)) {
                    Output(window.outputDelegateWriteElement, 'small', 'red', "Please input address/priority!");
                    return;
                }

                // transferOwnership
                delegate.transferOwnership(account, key, address, 2, function(error, result) {
                    handler[transactionProc](error, result, window.outputDelegateWriteElement);
                });                
                break;
            default:
                Output(window.outputDelegateReadElement, 'small', 'red', "Command Error!");
                break;
        }
    }

    [companyBatch](handler, account, privateKey, cmd) {
        let insurance;
        switch (cmd) {
            case "Update":
                insurance = new InsuranceExtension(this[extensionAbi], this[extensionContractAddress]);
                insurance.companyUpdate(account, privateKey, "PingAn", "Life#Auto#Accident#Unemployment", function(error, result) {
                    handler[transactionProc](error, result, window.outputCompanyElement, function() {
                        insurance.companyUpdate(account, privateKey, "CPIC", "Accident#Unemployment", function(error, result) {
                            handler[transactionProc](error, result, window.outputCompanyElement, function() {
                                insurance.companyUpdate(account, privateKey, "AIA", "Unemployment", function(error, result) {
                                    handler[transactionProc](error, result, window.outputCompanyElement, function() {
                                        // insurance.companyUpdate(account, privateKey, "DB_Policy_CPIC_Accident", "Key#UserKey#Insurant#Passport#Amount#StartTime#EndTime#Vehicle#Country#City#Description", function(error, result) {
                                        //     handler[transactionProc](error, result, window.outputCompanyElement, function() {
                                        //         insurance.companyUpdate(account, privateKey, "DB_Policy_AIA_Unemployment", "Key#UserKey#Insurant#Sex#Age#ID#Amount#StartTime#Period#City#Company#Description", function(error, result) {
                                        //             handler[transactionProc](error, result, window.outputCompanyElement, function() {                   
                                        //             });
                                        //          });          
                                        //     });
                                        //  });          
                                    });
                                 });
                            });
                        });
                    });
                });
                break;
            default:
                Output(window.outputCompanyElement, "small", "red", "Command Error!");
                break;
        }
    }

    company(operation, params) {
        console.log("TestInsurance.company(%s, %s)", operation, params);

        // check param
        if ((undefined == operation) || ("" == operation)) {
            Output(window.outputCompanyElement, "small", "red", "Please input correct input!");
            return;
        }

        let handler = this;
        let tmps = this[getAccount]();
        if (0 == tmps[0]) {
            Output(window.outputCompanyElement, 'small', 'red', "No channnel(idle)!");
            return;
        }

        let account = tmps[0];
        let privateKey = tmps[1];

        let insurance;
        switch (operation) {
            case "Debug":
                insurance = new InsuranceExtension(this[extensionAbi], this[extensionContractAddress]);
                insurance.companySize(function(error, result) {
                    if (!error) {
                        let sum = parseInt(result.toString(10));
                        let logs = new Array(sum);
                        let count = 0;

                        if (0 == sum) {
                            Output(window.outputCompanyElement, "small", "red", "No Data!");
                            return;
                        }

                        for (let i=0; i<sum; i++) {
                            insurance.companyGetById(i, function(error, id, result) {
                                if (!error) {
                                    let errorStr = handler[getErrorStr](result[0].toString(10));
                                    logs[id] = `[Company${id}]: (${errorStr}) ${result[1]} => ${result[2]}`;
                                    count ++;
                                    if (count == sum) {
                                        let str = "";
                                        for (let j=0; j<logs.length; j++) {
                                            str = str.concat(`${logs[j]}<br>`);
                                        }
                                        Output(window.outputCompanyElement, 'small', 'red', str);
                                    }
                                } else {
                                    Output(window.outputCompanyElement, 'small', 'red', `[Company${id}]:</br>${error}`);
                                }
                            })
                        }
                    } else {
                        Output(window.outputCompanyElement, "small", "red", error);
                    }
                })
                break;
            case "Batch":
                handler[companyBatch](handler, account, privateKey, params);
                break;
            case "Update":
                if ((undefined == params) || ("" == params)) {
                    Output(window.outputCompanyElement, "small", "red", "Please input correct params!");
                    return;
                }

                tmps = params.split(",");
                let key = tmps[0];
                let data = tmps[1];

                if ((undefined == key) || (undefined == data)) {
                    Output(window.outputCompanyElement, "small", "red", "Please input correct params!");
                    return;
                }

                insurance = new InsuranceExtension(this[extensionAbi], this[extensionContractAddress]);
                insurance.companyUpdate(account, privateKey, key, data, function(error, result) {
                    handler[transactionProc](error, result, window.outputCompanyElement, null);
                });
                break;
            case "Remove":
                if ((undefined == params) || ("" == params)) {
                    Output(window.outputCompanyElement, "small", "red", "Please input correct params!");
                    return;
                }

                insurance = new InsuranceExtension(this[extensionAbi], this[extensionContractAddress]);
                insurance.companyRemove(account, privateKey, params, function(error, result) {
                    handler[transactionProc](error, result, window.outputCompanyElement, null);
                });
                break;
            case "Size":
                insurance = new InsuranceExtension(this[extensionAbi], this[extensionContractAddress]);
                insurance.companySize(function(error, result) {
                    if (!error) {
                        Output(window.outputCompanyElement, "small", "red", `[Size]: ${result.toString(10)}`);
                    } else {
                        Output(window.outputCompanyElement, "small", "red", error);
                    }
                });
                break;
            case "GetByKey":
                if ((undefined == params) || ("" == params)) {
                    Output(window.outputCompanyElement, "small", "red", "Please input correct params!");
                    return;
                }

                insurance = new InsuranceExtension(this[extensionAbi], this[extensionContractAddress]);
                insurance.companyGetByKey(params, function(error, result) {
                    if (!error) {
                        let errorStr = handler[getErrorStr](result[0].toString(10));
                        Output(window.outputCompanyElement, "small", "red", `[Company]: (${errorStr}) ${params} => ${result[1]}`);
                    } else {
                        Output(window.outputCompanyElement, "small", "red", error);
                    }
                });
                break;
            case "GetById":
                if ((undefined == params) || ("" == params)) {
                    Output(window.outputCompanyElement, "small", "red", "Please input correct params!");
                    return;
                }

                insurance = new InsuranceExtension(this[extensionAbi], this[extensionContractAddress]);
                insurance.companyGetById(params, function(error, id, result) {
                    if (!error) {
                        let errorStr = handler[getErrorStr](result[0].toString(10));
                        Output(window.outputCompanyElement, "small", "red", `[Company${id}]: (${errorStr}) ${result[1]} => ${result[2]}`);
                    } else {
                        Output(window.outputCompanyElement, "small", "red", error);
                    }
                });
                break;
            case "GetAll":
                insurance = new Insurance(this[abi], this[contractAddress]);
                insurance.companyGetAll(function(error, result) {
                    if (!error) {
                        let errorStr = handler[getErrorStr](result[0].toString(10));
                        Output(window.outputCompanyElement, "small", "red", `[Company]: (${errorStr}) ${result[1]}`);
                    } else {
                        Output(window.outputCompanyElement, "small", "red", error);
                    }
                });
                break;
            default:
                Output(window.outputCompanyElement, "small", "red", "Operation Error!");
                break;
        }
    }

    [templateBatch](handler, account, privateKey, cmd) {
        let insurance;
        switch (cmd) {
            case "Update":
                insurance = new InsuranceExtension(this[extensionAbi], this[extensionContractAddress]);
                // insurance.templateUpdate(account, privateKey, "UI_User_PhoneSignIn", "手机号&密码", function(error, result) {
                //     handler[transactionProc](error, result, window.outputTemplateElement, function() {
                //         insurance.templateUpdate(account, privateKey, "UI_User_EmailSignIn", "邮箱&密码", function(error, result) {
                //             handler[transactionProc](error, result, window.outputTemplateElement, function() {
                //                 insurance.templateUpdate(account, privateKey, "UI_User_PhoneSignUp", "手机号&短信验证码&密码&确认密码", function(error, result) {
                //                     handler[transactionProc](error, result, window.outputTemplateElement, function() {
                //                         insurance.templateUpdate(account, privateKey, "UI_User_EmailSignUp", "邮箱&邮箱验证码&密码&确认密码", function(error, result) {
                //                             handler[transactionProc](error, result, window.outputTemplateElement, function() {
                //                                 insurance.templateUpdate(account, privateKey, "UI_User_ForgetPassword", "邮箱/手机号", function(error, result) {
                //                                     handler[transactionProc](error, result, window.outputTemplateElement, function() {                   
                //                                     });
                //                                  });          
                //                             });
                //                          });          
                //                     });
                //                  });
                //             });
                //         });
                //     });
                // });
                insurance.templateUpdate(account, privateKey, "DB_User", "Key#Password#NickName#SignUpTime#UpdateTime#Policies#Receipts", function(error, result) {
                    handler[transactionProc](error, result, window.outputTemplateElement, function() {
                        insurance.templateUpdate(account, privateKey, "DB_Policy_PingAn_Life", "Key#UserKey#Insurant#Sex#Age#Amount#StartTime#Period#Description", function(error, result) {
                            handler[transactionProc](error, result, window.outputTemplateElement, function() {
                                insurance.templateUpdate(account, privateKey, "DB_Policy_PingAn_Auto", "Key#UserKey#Insurant#Amount#StartTime#EndTime#City#PlateNumber#Description", function(error, result) {
                                    handler[transactionProc](error, result, window.outputTemplateElement, function() {
                                        insurance.templateUpdate(account, privateKey, "DB_Policy_CPIC_Accident", "Key#UserKey#Insurant#Passport#Amount#StartTime#EndTime#Vehicle#Country#City#Description", function(error, result) {
                                            handler[transactionProc](error, result, window.outputTemplateElement, function() {
                                                insurance.templateUpdate(account, privateKey, "DB_Policy_AIA_Unemployment", "Key#UserKey#Insurant#Sex#Age#ID#Amount#StartTime#Period#City#Company#Description", function(error, result) {
                                                    handler[transactionProc](error, result, window.outputTemplateElement, function() {                   
                                                    });
                                                 });          
                                            });
                                         });          
                                    });
                                 });
                            });
                        });
                    });
                });
                break;
            default:
                Output(window.outputTemplateElement, "small", "red", "Command Error!");
                break;
        }
    }

    template(operation, params) {
        console.log("TestInsurance.template(%s, %s)", operation, params);

        // check param
        if ((undefined == operation) || ("" == operation)) {
            Output(window.outputTemplateElement, "small", "red", "Please input correct input!");
            return;
        }

        let handler = this;
        let tmps = this[getAccount]();
        if (0 == tmps[0]) {
            Output(window.outputTemplateElement, 'small', 'red', "No channnel(idle)!");
            return;
        }

        let account = tmps[0];
        let privateKey = tmps[1];

        let insurance;
        switch (operation) {
            case "Debug":
                insurance = new InsuranceExtension(this[extensionAbi], this[extensionContractAddress]);
                insurance.templateSize(function(error, result) {
                    if (!error) {
                        let sum = parseInt(result.toString(10));
                        let logs = new Array(sum);
                        let count = 0;

                        if (0 == sum) {
                            Output(window.outputTemplateElement, "small", "red", "No Data!");
                            return;
                        }

                        for (let i=0; i<sum; i++) {
                            insurance.templateGetById(i, function(error, id, result) {
                                if (!error) {
                                    let errorStr = handler[getErrorStr](result[0].toString(10));
                                    logs[id] = `[Template${id}]: (${errorStr}) ${result[1]} => ${result[2]}`;
                                    count ++;
                                    if (count == sum) {
                                        let str = "";
                                        for (let j=0; j<logs.length; j++) {
                                            str = str.concat(`${logs[j]}<br>`);
                                        }
                                        Output(window.outputTemplateElement, 'small', 'red', str);
                                    }
                                } else {
                                    Output(window.outputTemplateElement, 'small', 'red', `[Template${id}]:</br>${error}`);
                                }
                            })
                        }
                    } else {
                        Output(window.outputTemplateElement, "small", "red", error);
                    }
                })
                break;
            case "Batch":
                handler[templateBatch](handler, account, privateKey, params);
                break;
            case "Update":
                if ((undefined == params) || ("" == params)) {
                    Output(window.outputTemplateElement, "small", "red", "Please input correct params!");
                    return;
                }

                tmps = params.split(",");
                let key = tmps[0];
                let data = tmps[1];

                if ((undefined == key) || (undefined == data)) {
                    Output(window.outputTemplateElement, "small", "red", "Please input correct params!");
                    return;
                }

                insurance = new InsuranceExtension(this[extensionAbi], this[extensionContractAddress]);
                insurance.templateUpdate(account, privateKey, key, data, function(error, result) {
                    handler[transactionProc](error, result, window.outputTemplateElement, null);
                });
                break;
            case "Remove":
                if ((undefined == params) || ("" == params)) {
                    Output(window.outputTemplateElement, "small", "red", "Please input correct params!");
                    return;
                }

                insurance = new InsuranceExtension(this[extensionAbi], this[extensionContractAddress]);
                insurance.templateRemove(account, privateKey, params, function(error, result) {
                    handler[transactionProc](error, result, window.outputTemplateElement, null);
                });
                break;
            case "Size":
                insurance = new InsuranceExtension(this[extensionAbi], this[extensionContractAddress]);
                insurance.templateSize(function(error, result) {
                    if (!error) {
                        Output(window.outputTemplateElement, "small", "red", `[Size]: ${result.toString(10)}`);
                    } else {
                        Output(window.outputTemplateElement, "small", "red", error);
                    }
                });
                break;
            case "GetByKey":
                if ((undefined == params) || ("" == params)) {
                    Output(window.outputTemplateElement, "small", "red", "Please input correct params!");
                    return;
                }

                insurance = new Insurance(this[abi], this[contractAddress]);
                insurance.templateGetByKey(params, function(error, result) {
                    if (!error) {
                        let errorStr = handler[getErrorStr](result[0].toString(10));
                        Output(window.outputTemplateElement, "small", "red", `[Template]: (${errorStr}) ${params} => ${result[1]}`);
                    } else {
                        Output(window.outputTemplateElement, "small", "red", error);
                    }
                });
                break;
            case "GetById":
                if ((undefined == params) || ("" == params)) {
                    Output(window.outputTemplateElement, "small", "red", "Please input correct params!");
                    return;
                }

                insurance = new InsuranceExtension(this[extensionAbi], this[extensionContractAddress]);
                insurance.templateGetById(params, function(error, id, result) {
                    if (!error) {
                        let errorStr = handler[getErrorStr](result[0].toString(10));
                        Output(window.outputTemplateElement, "small", "red", `[Template${id}]: (${errorStr}) ${result[1]} => ${result[2]}`);
                    } else {
                        Output(window.outputTemplateElement, "small", "red", error);
                    }
                });
                break;
            default:
                Output(window.outputTemplateElement, "small", "red", "Operation Error!");
                break;
        }
    }

    user(operation, params) {
        console.log("TestInsurance.user(%s, %s)", operation, params);

        // check param
        if ((undefined == operation) || ("" == operation)) {
            Output(window.outputUserElement, "small", "red", "Please input correct input!");
            return;
        }

        let handler = this;
        let tmps = this[getAccount]();
        if (0 == tmps[0]) {
            Output(window.outputUserElement, 'small', 'red', "No channnel(idle)!");
            return;
        }

        let account = tmps[0];
        let privateKey = tmps[1];

        let time;
        let insurance;
        switch (operation) {
            case "Debug":
                insurance = new InsuranceExtension(this[extensionAbi], this[extensionContractAddress]);
                insurance.userSize(function(error, result) {
                    if (!error) {
                        let sum = parseInt(result.toString(10));
                        let logs = new Array(sum);
                        let count = 0;

                        if (0 == sum) {
                            Output(window.outputUserElement, "small", "red", "No Data!");
                            return;
                        }

                        for (let i=0; i<sum; i++) {
                            insurance.userGetById(params, i, function(error, id, result) {
                                if (!error) {
                                    let errorStr = handler[getErrorStr](result[0].toString(10));
                                    logs[id] = `[User${id}]: (${errorStr}) ${result[1]}`;
                                    count ++;
                                    if (count == sum) {
                                        let str = "";
                                        for (let j=0; j<logs.length; j++) {
                                            str = str.concat(`${logs[j]}<br>`);
                                        }
                                        Output(window.outputUserElement, 'small', 'red', str);
                                    }
                                } else {
                                    Output(window.outputUserElement, 'small', 'red', `[User${id}]:</br>${error}`);
                                }
                            })
                        }
                    } else {
                        Output(window.outputUserElement, "small", "red", error);
                    }
                })
                break;
            case "Add":
                if ((undefined == params) || ("" == params)) {
                    Output(window.outputUserElement, "small", "red", "Please input correct params!");
                    return;
                }

                tmps = params.split("#");
                insurance = new Insurance(this[abi], this[contractAddress]);
                time = this[getLocalTime]();
                insurance.userAdd(account, privateKey, tmps[0], tmps[1], tmps[2], time, function(error, result) {
                    handler[transactionProc](error, result, window.outputUserElement, null);
                });
                break;
            case "Remove":
                if ((undefined == params) || ("" == params)) {
                    Output(window.outputUserElement, "small", "red", "Please input correct params!");
                    return;
                }

                insurance = new Insurance(this[abi], this[contractAddress]);
                insurance.userRemove(account, privateKey, params, function(error, result) {
                    handler[transactionProc](error, result, window.outputUserElement, null);
                });
                break;
            case "CheckIn":
                if ((undefined == params) || ("" == params)) {
                    Output(window.outputUserElement, "small", "red", "Please input correct params!");
                    return;
                }

                insurance = new Insurance(this[abi], this[contractAddress]);
                time = this[getLocalTime]();
                insurance.userCheckIn(account, privateKey, params, time, function(error, result) {
                    handler[transactionProc](error, result, window.outputUserElement, null);
                });
                break;
            case "Size":
                insurance = new InsuranceExtension(this[extensionAbi], this[extensionContractAddress]);
                insurance.userSize(function(error, result) {
                    if (!error) {
                        Output(window.outputUserElement, "small", "red", `[Size]: ${result.toString(10)}`);
                    } else {
                        Output(window.outputUserElement, "small", "red", error);
                    }
                });
                break;
            case "Exist":
                if ((undefined == params) || ("" == params)) {
                    Output(window.outputUserElement, "small", "red", "Please input correct params!");
                    return;
                }

                tmps = params.split(",");
                insurance = new Insurance(this[abi], this[contractAddress]);
                insurance.userExist(tmps[1], function(error, result) {
                    if (!error) {
                        Output(window.outputUserElement, "small", "red", `[Exist]: ${result.toString(10)}`);
                    } else {
                        Output(window.outputUserElement, "small", "red", error);
                    }
                });
                break;
            case "GetByKey":
                if ((undefined == params) || ("" == params)) {
                    Output(window.outputUserElement, "small", "red", "Please input correct params!");
                    return;
                }

                tmps = params.split(",");
                insurance = new Insurance(this[abi], this[contractAddress]);
                insurance.userGetByKey(tmps[0], tmps[1], function(error, result) {
                    if (!error) {
                        let errorStr = handler[getErrorStr](result[0].toString(10));
                        Output(window.outputUserElement, "small", "red", `[User]:<br>(${errorStr}) ${result[1]}`);
                    } else {
                        Output(window.outputUserElement, "small", "red", error);
                    }
                });
                break;
            case "GetById":
                if ((undefined == params) || ("" == params)) {
                    Output(window.outputUserElement, "small", "red", "Please input correct params!");
                    return;
                }

                tmps = params.split(",");
                insurance = new InsuranceExtension(this[extensionAbi], this[extensionContractAddress]);
                insurance.userGetById(tmps[0], tmps[1], function(error, id, result) {
                    if (!error) {
                        let errorStr = handler[getErrorStr](result[0].toString(10));
                        Output(window.outputUserElement, "small", "red", `[User${id}]:<br>(${errorStr}) ${result[1]}`);
                    } else {
                        Output(window.outputUserElement, "small", "red", error);
                    }
                });
                break;
            case "GetPolicies":
                if ((undefined == params) || ("" == params)) {
                    Output(window.outputUserElement, "small", "red", "Please input correct params!");
                    return;
                }

                tmps = params.split(",");
                insurance = new Insurance(this[abi], this[contractAddress]);
                insurance.userGetPolicies(tmps[1], function(error, result) {
                    if (!error) {
                        let errorStr = handler[getErrorStr](result[0].toString(10));
                        Output(window.outputUserElement, "small", "red", `[UserPolicies]:<br>(${errorStr}) ${result[1]}`);
                    } else {
                        Output(window.outputUserElement, "small", "red", error);
                    }
                });
                break;
            default:
                Output(window.outputUserElement, "small", "red", "Operation Error!");
                break;
        }
    }

    policy(operation, params) {
        console.log("TestInsurance.policy(%s, %s)", operation, params);

        // check param
        if ((undefined == operation) || ("" == operation)) {
            Output(window.outputPolicyElement, "small", "red", "Please input correct input!");
            return;
        }

        let handler = this;
        let tmps = this[getAccount]();
        if (0 == tmps[0]) {
            Output(window.outputPolicyElement, 'small', 'red', "No channnel(idle)!");
            return;
        }

        let account = tmps[0];
        let privateKey = tmps[1];

        let insurance;
        switch (operation) {
            case "Debug":
                insurance = new InsuranceExtension(this[extensionAbi], this[extensionContractAddress]);
                insurance.policySize(function(error, result) {
                    if (!error) {
                        let sum = parseInt(result.toString(10));
                        let logs = new Array(sum);
                        let count = 0;

                        if (0 == sum) {
                            Output(window.outputPolicyElement, "small", "red", "No Data!");
                            return;
                        }

                        for (let i=0; i<sum; i++) {
                            insurance.policyGetById(params, i, function(error, id, result) {
                                if (!error) {
                                    let errorStr = handler[getErrorStr](result[0].toString(10));
                                    logs[id] = `[User${id}]: (${errorStr}) ${result[1]}`;
                                    count ++;
                                    if (count == sum) {
                                        let str = "";
                                        for (let j=0; j<logs.length; j++) {
                                            str = str.concat(`${logs[j]}<br>`);
                                        }
                                        Output(window.outputPolicyElement, 'small', 'red', str);
                                    }
                                } else {
                                    Output(window.outputPolicyElement, 'small', 'red', `[Policy${id}]:</br>${error}`);
                                }
                            })
                        }
                    } else {
                        Output(window.outputPolicyElement, "small", "red", error);
                    }
                })                
                break;
            case "Add":
                if ((undefined == params) || ("" == params)) {
                    Output(window.outputPolicyElement, "small", "red", "Please input correct params!");
                    return;
                }

                tmps = params.split("#");
                insurance = new Insurance(this[abi], this[contractAddress]);
                let time = this[getLocalTime]();
                insurance.policyAdd(account, privateKey, tmps[0], tmps[1], tmps[2], tmps[3], time, function(error, result) {
                    handler[transactionProc](error, result, window.outputPolicyElement, null);
                });
                break;
            case "Remove":
                if ((undefined == params) || ("" == params)) {
                    Output(window.outputPolicyElement, "small", "red", "Please input correct params!");
                    return;
                }

                insurance = new Insurance(this[abi], this[contractAddress]);
                insurance.policyRemove(account, privateKey, params, function(error, result) {
                    handler[transactionProc](error, result, window.outputPolicyElement, null);
                });
                break;
            case "AddElement":
                if ((undefined == params) || ("" == params)) {
                    Output(window.outputPolicyElement, "small", "red", "Please input correct params!");
                    return;
                }

                tmps = params.split(",");
                insurance = new Insurance(this[abi], this[contractAddress]);
                insurance.policyAddElement(account, privateKey, tmps[0], tmps[1], tmps[2], function(error, result) {
                    handler[transactionProc](error, result, window.outputPolicyElement, null);
                });
                break;
            case "Size":
                insurance = new InsuranceExtension(this[extensionAbi], this[extensionContractAddress]);
                insurance.policySize(function(error, result) {
                    if (!error) {
                        Output(window.outputPolicyElement, "small", "red", `[Size]: ${result.toString(10)}`);
                    } else {
                        Output(window.outputPolicyElement, "small", "red", error);
                    }
                });
                break;
            case "GetByKey":
                if ((undefined == params) || ("" == params)) {
                    Output(window.outputPolicyElement, "small", "red", "Please input correct params!");
                    return;
                }

                tmps = params.split(",");
                insurance = new Insurance(this[abi], this[contractAddress]);
                insurance.policyGetByKey(tmps[0], tmps[1], function(error, result) {
                    if (!error) {
                        let errorStr = handler[getErrorStr](result[0].toString(10));
                        Output(window.outputPolicyElement, "small", "red", `[User]:<br>(${errorStr}) ${result[1]}`);
                    } else {
                        Output(window.outputPolicyElement, "small", "red", error);
                    }
                });
                break;
            case "GetById":
                if ((undefined == params) || ("" == params)) {
                    Output(window.outputPolicyElement, "small", "red", "Please input correct params!");
                    return;
                }

                tmps = params.split(",");
                insurance = new InsuranceExtension(this[extensionAbi], this[extensionContractAddress]);
                insurance.policyGetById(tmps[0], tmps[1], function(error, id, result) {
                    if (!error) {
                        let errorStr = handler[getErrorStr](result[0].toString(10));
                        Output(window.outputPolicyElement, "small", "red", `[User${id}]:<br>(${errorStr}) ${result[1]}`);
                    } else {
                        Output(window.outputPolicyElement, "small", "red", error);
                    }
                });
                break;
            case "GetKeys":
                if ((undefined == params) || ("" == params)) {
                    Output(window.outputPolicyElement, "small", "red", "Please input correct params!");
                    return;
                }

                tmps = params.split(",");

                insurance = new Insurance(this[abi], this[contractAddress]);
                insurance.policyGetKeys(tmps[1], tmps[2], function(error, result) {
                    if (!error) {
                        let errorStr = handler[getErrorStr](result[0].toString(10));
                        Output(window.outputPolicyElement, "small", "red", `[Keys]: (${errorStr}) ${result[1]}`);
                    } else {
                        Output(window.outputPolicyElement, "small", "red", error);
                    }
                });
                break;
            default:
                Output(window.outputPolicyElement, "small", "red", "Operation Error!");
                break;
        }
    }

    integral(operation, params) {
        console.log("TestInsurance.integral(%s, %s)", operation, params);

        // check param
        if ((undefined == operation) || ("" == operation)) {
            Output(window.outputIntegralElement, "small", "red", "Please input correct input!");
            return;
        }

        let handler = this;
        let tmps = this[getAccount]();
        if (0 == tmps[0]) {
            Output(window.outputIntegralElement, 'small', 'red', "No channnel(idle)!");
            return;
        }

        let account = tmps[0];
        let privateKey = tmps[1];

        let time;
        let insurance
        let insuranceExtension;
        let insuranceIntegral;
        switch (operation) {
            case "Debug":
                insuranceExtension = new InsuranceExtension(this[extensionAbi], this[extensionContractAddress]);
                insuranceExtension.integralCap(function(error, result) {
                    if (!error) {
                        let cap = parseInt(result.toString(10));
                        insuranceExtension.integralTotal(function(error, result) {
                            if (!error) {
                                let total = parseInt(result.toString(10));
                                insuranceExtension.userSize(function(error, result) {
                                    if (!error) {
                                        let sum = parseInt(result.toString(10));
                                        let logs = new Array(sum + 1);
                                        let count = 0;

                                        logs[0] = `##### Cap: ${cap} | Total: ${total} #####`;
                                        count ++;

                                        if (0 == sum) {
                                            Output(window.outputIntegralDebugElement, "small", "red", "No Data!");
                                            return;
                                        }

                                        for (let i=0; i<sum; i++) {
                                            insuranceExtension.userGetById(params, i, function(error, id, result) {
                                                if (!error) {
                                                    let json = JSON.parse(result[1]);
                                                    let key = json["Key"];
                                                    insurance = new Insurance(handler[abi], handler[contractAddress]);
                                                    insurance.integralBalanceOf(key, function(error, owner, result) {
                                                        if (!error) {
                                                            logs[count] = `[${count}] ${owner}: ${result}`;
                                                            count ++;
                                                            if (count == sum + 1) {
                                                                let str = "";
                                                                for (let j=0; j<logs.length; j++) {
                                                                    str = str.concat(`${logs[j]}<br>`);
                                                                }
                                                                Output(window.outputIntegralDebugElement, 'small', 'red', str);
                                                            }

                                                        } else {
                                                            Output(window.outputIntegralDebugElement, 'small', 'red', `Get balance error!</br>${error}`);
                                                        }
                                                    })
                                                } else {
                                                    Output(window.outputIntegralDebugElement, 'small', 'red', `[User${id}]:</br>${error}`);
                                                }
                                            })
                                        }
                                    } else {
                                        Output(window.outputIntegralDebugElement, "small", "red", error);
                                    }
                                })
                            } else {
                                Output(window.outputIntegralDebugElement, "small", "red", error);
                            }
                        })
                    } else {
                        Output(window.outputIntegralDebugElement, "small", "red", error);
                    }
                })
                break;
            case "Watch":
                if ((undefined == params) || ("" == params)) {
                    Output(window.outputIntegralWatchElement, "small", "red", "Please input correct params!");
                    return;
                }

                tmps = params.split(",");
                let insuranceWatch = new InsuranceWatch();
                if ("Start" == tmps[0]) {
                    if ("Transfer" == tmps[1]) {
                        let result = this[watch].get("integral", "transfer");
                        if (0 == result.length) {
                            Output(window.outputIntegralWatchElement, "small", "red", "Can't find event!");
                        } else {
                            if (null != result[0].handle) {
                                Output(window.outputIntegralWatchElement, "small", "red", "Event watcher has already started!");
                            } else {
                                let handle = insuranceWatch.start(this[integralAbi], this[integralContractAddress], "InsuranceIntegralTransfer", function(error, from, to, value) {
                                    Output(window.outputIntegralWatchElement, "small", "red", `[Event]: Transfer(${from}, ${to}, ${value})`);
                                });
                                if (null == handle) {
                                    Output(window.outputIntegralWatchElement, "small", "red", `Event is null!`);
                                } else {
                                    this[watch].update("integral", "transfer", handle);
                                    Output(window.outputIntegralWatchElement, "small", "red", "Event watcher start.");
                                }
                            }
                        }
                    } else if ("Approval" == tmps[1]) {
                        Output(window.outputIntegralWatchElement, "small", "red", "Event don't support now!");
                    } else {
                        Output(window.outputIntegralWatchElement, "small", "red", "Event Error!");
                    }
                } else if ("Stop" == tmps[0]) {
                    if ("Transfer" == tmps[1]) {
                        let result = this[watch].get("integral", "transfer");
                        if (0 == result.length) {
                            Output(window.outputIntegralWatchElement, "small", "red", "Can't find event!");
                        } else {
                            if (null == result[0].handle) {
                                Output(window.outputIntegralWatchElement, "small", "red", "Event watcher has already stopped!");
                            } else {
                                insuranceWatch.stop(result[0].handle);
                                this[watch].update("integral", "transfer", null);
                                Output(window.outputIntegralWatchElement, "small", "red", "Event watcher stop.");
                            }
                        }
                    } else if ("Approval" == tmps[1]) {
                        Output(window.outputIntegralWatchElement, "small", "red", "Event don't support now!");
                    } else {
                        Output(window.outputIntegralWatchElement, "small", "red", "Event Error!");
                    }
                } else {
                    Output(window.outputIntegralWatchElement, "small", "red", "Operation Error!");
                }
                break;
            case "Claim":
                if ((undefined == params) || ("" == params)) {
                    Output(window.outputIntegralElement, "small", "red", "Please input correct params!");
                    return;
                }

                tmps = params.split(",");
                time = this[getLocalTime]();
                insurance = new Insurance(this[abi], this[contractAddress]);
                insurance.integralClaim(account, privateKey, tmps[0], tmps[1], time, tmps[1], function(error, result) {
                    handler[transactionProc](error, result, window.outputIntegralElement, null);
                });
                break;
            case "Mint":
                if ((undefined == params) || ("" == params)) {
                    Output(window.outputIntegralElement, "small", "red", "Please input correct params!");
                    return;
                }

                tmps = params.split(",");
                time = this[getLocalTime]();
                insurance = new InsuranceExtension(this[extensionAbi], this[extensionContractAddress]);
                insurance.integralMint(account, privateKey, tmps[0], time, tmps[1], function(error, result) {
                    handler[transactionProc](error, result, window.outputIntegralElement, null);
                });
                break;
            case "Burn":
                if ((undefined == params) || ("" == params)) {
                    Output(window.outputIntegralElement, "small", "red", "Please input correct params!");
                    return;
                }

                tmps = params.split(",");
                time = this[getLocalTime]();
                insurance = new Insurance(this[abi], this[contractAddress]);
                insurance.integralBurn(account, privateKey, tmps[0], time, tmps[1], function(error, result) {
                    handler[transactionProc](error, result, window.outputIntegralElement, null);
                });
                break;
            case "Transfer":
                if ((undefined == params) || ("" == params)) {
                    Output(window.outputIntegralElement, "small", "red", "Please input correct params!");
                    return;
                }

                tmps = params.split(",");
                time = this[getLocalTime]();
                insurance = new Insurance(this[abi], this[contractAddress]);
                insurance.integralTransfer(account, privateKey, tmps[0], tmps[1], time, tmps[2], function(error, result) {
                    handler[transactionProc](error, result, window.outputIntegralElement, null);
                });
                break;
            case "UpdateThreshold":
                if ((undefined == params) || ("" == params)) {
                    Output(window.outputIntegralElement, "small", "red", "Please input correct params!");
                    return;
                }

                tmps = params.split(",");
                insurance = new InsuranceExtension(this[extensionAbi], this[extensionContractAddress]);
                insurance.integralUpdateThreshold(account, privateKey, tmps[0], tmps[1], function(error, result) {
                    handler[transactionProc](error, result, window.outputIntegralElement, null);
                });
                break;
            case "UpdateCap":
                if ((undefined == params) || ("" == params)) {
                    Output(window.outputIntegralElement, "small", "red", "Please input correct params!");
                    return;
                }

                insurance = new InsuranceExtension(this[extensionAbi], this[extensionContractAddress]);
                insurance.integralUpdateCap(account, privateKey, params, function(error, result) {
                    handler[transactionProc](error, result, window.outputIntegralElement, null);
                });
                break;
            case "Trace":
                if ((undefined == params) || ("" == params)) {
                    Output(window.outputIntegralElement, "small", "red", "Please input correct params!");
                    return;
                }

                tmps = params.split(",");
                insurance = new Insurance(this[abi], this[contractAddress]);
                insurance.integralTrace(tmps[0], tmps[1], tmps[2], function(error, result) {
                    if (!error) {
                        Output(window.outputIntegralElement, "small", "red", `[Trace]: ${result}`);
                    } else {
                        Output(window.outputIntegralElement, "small", "red", error);
                    }
                });
                break;
            case "Threshold":
                if ((undefined == params) || ("" == params)) {
                    Output(window.outputIntegralElement, "small", "red", "Please input correct params!");
                    return;
                }

                insurance = new InsuranceExtension(this[extensionAbi], this[extensionContractAddress]);
                insurance.integralThreshold(params, function(error, result) {
                    if (!error) {
                        Output(window.outputIntegralElement, "small", "red", `[Threshold]: ${result}`);
                    } else {
                        Output(window.outputIntegralElement, "small", "red", error);
                    }
                });
                break;
            case "Cap":
                insurance = new InsuranceExtension(this[extensionAbi], this[extensionContractAddress]);
                insurance.integralCap(function(error, result) {
                    if (!error) {
                        Output(window.outputIntegralElement, "small", "red", `[Cap]: ${result}`);
                    } else {
                        Output(window.outputIntegralElement, "small", "red", error);
                    }
                });
                break;
            case "Total":
                insurance = new InsuranceExtension(this[extensionAbi], this[extensionContractAddress]);
                insurance.integralTotal(function(error, result) {
                    if (!error) {
                        Output(window.outputIntegralElement, "small", "red", `[Total]: ${result}`);
                    } else {
                        Output(window.outputIntegralElement, "small", "red", error);
                    }
                });
                break;            
            case "BalanceOf":
                if ((undefined == params) || ("" == params)) {
                    Output(window.outputIntegralElement, "small", "red", "Please input correct params!");
                    return;
                }

                insurance = new Insurance(this[abi], this[contractAddress]);
                insurance.integralBalanceOf(params, function(error, owner, result) {
                    if (!error) {
                        Output(window.outputIntegralElement, "small", "red", `[Integral] ${owner}: ${result}`);
                    } else {
                        Output(window.outputIntegralElement, "small", "red", error);
                    }
                });
                break;
            default:
                Output(window.outputIntegralElement, "small", "red", "Operation Error!");
                break;
        }
    }

    do(operation, para1, para2) {
        console.log("TestInsurance.do(%s, %s, %s)", operation, para1, para2);
        switch(operation) {
            case "Live":
                this.live();
                break;
            case "Deploy":
                this.deploy(para1);
                break;
            case "Setup":
                this.setup(para1, para2);
                break;
            case "Pause":
                this.pause(para1, para2);
                break;
            case 'Delegate':
                this.delegate(para1, para2);
                break;
            case "Company":
                this.company(para1, para2);
                break;
            case "Template":
                this.template(para1, para2);
                break;
            case "User" :
                this.user(para1, para2);
                break;
            case "Policy":
                this.policy(para1, para2);
                break;
            case "Integral":
                this.integral(para1, para2);
                break;
            default:
                console.log("Operation Error!");
                break;
        }
    }
}