import * as steem from "steem";
import * as bluebird from "bluebird";
import {ExtensionServer} from "./ExtensionServer";
import {PrivateDataManager} from "./PrivateDataManager";
import {MessagesToEventsTransformer} from "./MessagesToEventsTransformer";
import {ConfirmationManager} from "./ConfirmationManager";

/**
 * What this script does:
 * 1. Script injects to webpage head or body script with interface
 * 2. Script works as "server" for requests send from injected script
 */

let s = document.createElement('script');
s.src = chrome.extension.getURL('scripts/injectedScripts/steemSecureSteemJsInterface.js');
(document.head || document.documentElement).appendChild(s);

new MessagesToEventsTransformer();
const extensionServer = new ExtensionServer();
const confirmationManager = new ConfirmationManager();

extensionServer.on(
  "SteemSecure.authentication.isUserLoggedIn", function (params, eResponse) {
    PrivateDataManager.getPrivateDataForDomain(function (privateDataModel) {
      if (privateDataModel) {
        eResponse.send({isLoggedIn: true, steemAccountName: privateDataModel.steemAccountName});
      }
      else {
        eResponse.send({isLoggedIn: false});
      }
    });
  }
);

extensionServer.on(
  "steem.api.setOptions", function (params, eResponse) {
    steem.api.setOptions(params.options);
    eResponse.send({});
  }
);

extensionServer.on(
  "steem.config.set", function (params, eResponse) {
    steem.config.set(params.property, params.value);
    eResponse.send({});
  }
);

extensionServer.on(
  "steem.config.get", function (params, eResponse) {
    let value = steem.config.get(params.property);
    eResponse.send({value: value});
  }
);

extensionServer.on(
  "steem.api.getTrendingTags", function (params, eResponse) {
    steem.api.getTrendingTags(params.afterTag, params.limit, function (err, res) {
      eResponse.send(res, err);
    });
  }
);

extensionServer.on(
  "steem.api.getDiscussionsByTrending", function (params, eResponse) {
    steem.api.getDiscussionsByTrending(params.query, function (err, res) {
      eResponse.send(res, err);
    });
  }
);

extensionServer.on(
  "steem.api.getDiscussionsByCreated", function (params, eResponse) {
    steem.api.getDiscussionsByCreated(params.query, function (err, res) {
      eResponse.send(res, err);
    });
  }
);

extensionServer.on(
  "steem.api.getDiscussionsByActive", function (params, eResponse) {
    steem.api.getDiscussionsByActive(params.query, function (err, res) {
      eResponse.send(res, err);
    });
  }
);

extensionServer.on(
  "steem.api.getDiscussionsByCashout", function (params, eResponse) {
    steem.api.getDiscussionsByCashout(params.query, function (err, res) {
      eResponse.send(res, err);
    });
  }
);

extensionServer.on(
  "steem.api.getDiscussionsByPayout", function (params, eResponse) {
    steem.api.getDiscussionsByPayout(params.query, function (err, res) {
      eResponse.send(res, err);
    });
  }
);

extensionServer.on(
  "steem.api.getDiscussionsByVotes", function (params, eResponse) {
    steem.api.getDiscussionsByVotes(params.query, function (err, res) {
      eResponse.send(res, err);
    });
  }
);

extensionServer.on(
  "steem.api.getDiscussionsByChildren", function (params, eResponse) {
    steem.api.getDiscussionsByChildren(params.query, function (err, res) {
      eResponse.send(res, err);
    });
  }
);

extensionServer.on(
  "steem.api.getDiscussionsByHot", function (params, eResponse) {
    steem.api.getDiscussionsByHot(params.query, function (err, res) {
      eResponse.send(res, err);
    });
  }
);

extensionServer.on(
  "steem.api.getDiscussionsByFeed", function (params, eResponse) {
    steem.api.getDiscussionsByFeed(params.query, function (err, res) {
      eResponse.send(res, err);
    });
  }
);

extensionServer.on(
  "steem.api.getDiscussionsByBlog", function (params, eResponse) {
    steem.api.getDiscussionsByBlog(params.query, function (err, res) {
      eResponse.send(res, err);
    });
  }
);

extensionServer.on(
  "steem.api.getDiscussionsByComments", function (params, eResponse) {
    steem.api.getDiscussionsByComments(params.query, function (err, res) {
      eResponse.send(res, err);
    });
  }
);

extensionServer.on(
  "steem.api.getBlockHeader", function (params, eResponse) {
    steem.api.getBlockHeader(params.blockNum, function (err, res) {
      eResponse.send(res, err);
    });
  }
);

extensionServer.on(
  "steem.api.getBlock", function (params, eResponse) {
    steem.api.getBlock(params.blockNum, function (err, res) {
      eResponse.send(res, err);
    });
  }
);

extensionServer.on(
  "steem.api.getState", function (params, eResponse) {
    steem.api.getState(params.path, function (err, res) {
      eResponse.send(res, err);
    });
  }
);

extensionServer.on(
  "steem.api.getTrendingCategories", function (params, eResponse) {
    steem.api.getTrendingCategories(params.after, params.limit, function (err, res) {
      eResponse.send(res, err);
    });
  }
);

extensionServer.on(
  "steem.api.getBestCategories", function (params, eResponse) {
    steem.api.getBestCategories(params.after, params.limit, function (err, res) {
      eResponse.send(res, err);
    });
  }
);

extensionServer.on(
  "steem.api.getActiveCategories", function (params, eResponse) {
    steem.api.getActiveCategories(params.after, params.limit, function (err, res) {
      eResponse.send(res, err);
    });
  }
);

extensionServer.on(
  "steem.api.getRecentCategories", function (params, eResponse) {
    steem.api.getRecentCategories(params.after, params.limit, function (err, res) {
      eResponse.send(res, err);
    });
  }
);

extensionServer.on(
  "steem.api.getConfig", function (params, eResponse) {
    steem.api.getConfig(function (err, res) {
      eResponse.send(res, err);
    });
  }
);

extensionServer.on(
  "steem.api.getDynamicGlobalProperties", function (params, eResponse) {
    steem.api.getDynamicGlobalProperties(function (err, res) {
      eResponse.send(res, err);
    });
  }
);

extensionServer.on(
  "steem.api.getChainProperties", function (params, eResponse) {
    steem.api.getChainProperties(function (err, res) {
      eResponse.send(res, err);
    });
  }
);

extensionServer.on(
  "steem.api.getFeedHistory", function (params, eResponse) {
    steem.api.getFeedHistory(function (err, res) {
      eResponse.send(res, err);
    });
  }
);

extensionServer.on(
  "steem.api.getCurrentMedianHistoryPrice", function (params, eResponse) {
    steem.api.getCurrentMedianHistoryPrice(function (err, res) {
      eResponse.send(res, err);
    });
  }
);

extensionServer.on(
  "steem.api.getHardforkVersion", function (params, eResponse) {
    steem.api.getHardforkVersion(function (err, res) {
      eResponse.send(res, err);
    });
  }
);

extensionServer.on(
  "steem.api.getNextScheduledHardfork", function (params, eResponse) {
    steem.api.getNextScheduledHardfork(function (err, res) {
      eResponse.send(res, err);
    });
  }
);

extensionServer.on(
  "steem.api.getRewardFund", function (params, eResponse) {
    steem.api.getRewardFund(params.name, function (err, res) {
      eResponse.send(res, err);
    });
  }
);

extensionServer.on(
  "steem.api.getVestingDelegations", function (params, eResponse) {
    steem.api.getVestingDelegations(params.account, params.from, params.limit, function (err, res) {
      eResponse.send(res, err);
    });
  }
);

extensionServer.on(
  "steem.api.getKeyReferences", function (params, eResponse) {
    steem.api.getKeyReferences(params.key, function (err, res) {
      eResponse.send(res, err);
    });
  }
);

extensionServer.on(
  "steem.api.getAccounts", function (params, eResponse) {
    steem.api.getAccounts(params.accounts, function (err, res) {
      eResponse.send(res, err);
    });
  }
);

extensionServer.on(
  "steem.api.getAccountReferences", function (params, eResponse) {
    steem.api.getAccountReferences(params.accounts, function (err, res) {
      eResponse.send(res, err);
    });
  }
);

extensionServer.on(
  "steem.api.lookupAccountNames", function (params, eResponse) {
    steem.api.lookupAccountNames(params.accountNames, function (err, res) {
      eResponse.send(res, err);
    });
  }
);

extensionServer.on(
  "steem.api.lookupAccounts", function (params, eResponse) {
    steem.api.lookupAccounts(params.lowerBoundName, params.limit, function (err, res) {
      eResponse.send(res, err);
    });
  }
);

extensionServer.on(
  "steem.api.getAccountCount", function (params, eResponse) {
    steem.api.getAccountCount(function (err, res) {
      eResponse.send(res, err);
    });
  }
);

extensionServer.on(
  "steem.api.getConversionRequests", function (params, eResponse) {
    steem.api.getConversionRequests(params.accountName, function (err, res) {
      eResponse.send(res, err);
    });
  }
);

extensionServer.on(
  "steem.api.getAccountHistory", function (params, eResponse) {
    steem.api.getAccountHistory(params.account, params.from, params.limit, function (err, res) {
      eResponse.send(res, err);
    });
  }
);

extensionServer.on(
  "steem.api.getOwnerHistory", function (params, eResponse) {
    steem.api.getOwnerHistory(params.account, function (err, res) {
      eResponse.send(res, err);
    });
  }
);

extensionServer.on(
  "steem.api.getRecoveryRequest", function (params, eResponse) {
    steem.api.getRecoveryRequest(params.account, function (err, res) {
      eResponse.send(res, err);
    });
  }
);

extensionServer.on(
  "steem.api.getOrderBook", function (params, eResponse) {
    steem.api.getOrderBook(params.limit, function (err, res) {
      eResponse.send(res, err);
    });
  }
);

extensionServer.on(
  "steem.api.getOpenOrders", function (params, eResponse) {
    steem.api.getOpenOrders(params.owner, function (err, res) {
      eResponse.send(res, err);
    });
  }
);

extensionServer.on(
  "steem.api.getLiquidityQueue", function (params, eResponse) {
    steem.api.getLiquidityQueue(params.startAccount, params.limit, function (err, res) {
      eResponse.send(res, err);
    });
  }
);

extensionServer.on(
  "steem.api.getTransactionHex", function (params, eResponse) {
    steem.api.getTransactionHex(params.trx, function (err, res) {
      eResponse.send(res, err);
    });
  }
);

extensionServer.on(
  "steem.api.getTransaction", function (params, eResponse) {
    steem.api.getTransaction(params.trxId, function (err, res) {
      eResponse.send(res, err);
    });
  }
);

extensionServer.on(
  "steem.api.getRequiredSignatures", function (params, eResponse) {
    steem.api.getRequiredSignatures(params.trx, params.availableKeys, function (err, res) {
      eResponse.send(res, err);
    });
  }
);

extensionServer.on(
  "steem.api.getPotentialSignatures", function (params, eResponse) {
    steem.api.getPotentialSignatures(params.trx, function (err, res) {
      eResponse.send(res, err);
    });
  }
);

extensionServer.on(
  "steem.api.verifyAuthority", function (params, eResponse) {
    steem.api.verifyAuthority(params.trx, function (err, res) {
      eResponse.send(res, err);
    });
  }
);

extensionServer.on(
  "steem.api.verifyAccountAuthority", function (params, eResponse) {
    steem.api.verifyAccountAuthority(params.nameOrId, params.signers, function (err, res) {
      eResponse.send(res, err);
    });
  }
);

extensionServer.on(
  "steem.api.getActiveVotes", function (params, eResponse) {
    steem.api.getActiveVotes(params.author, params.permlink, function (err, res) {
      eResponse.send(res, err);
    });
  }
);

extensionServer.on(
  "steem.api.getAccountVotes", function (params, eResponse) {
    steem.api.getAccountVotes(params.voter, function (err, res) {
      eResponse.send(res, err);
    });
  }
);

extensionServer.on(
  "steem.api.getContent", function (params, eResponse) {
    steem.api.getContent(params.author, params.permlink, function (err, res) {
      eResponse.send(res, err);
    });
  }
);

extensionServer.on(
  "steem.api.getContentReplies", function (params, eResponse) {
    steem.api.getContentReplies(params.author, params.permlink, function (err, res) {
      eResponse.send(res, err);
    });
  }
);

extensionServer.on(
  "steem.api.getDiscussionsByAuthorBeforeDate", function (params, eResponse) {
    steem.api.getDiscussionsByAuthorBeforeDate(params.author, params.startPermlink, params.beforeDate, params.limit, function (err, res) {
      eResponse.send(res, err);
    });
  }
);

extensionServer.on(
  "steem.api.getRepliesByLastUpdate", function (params, eResponse) {
    steem.api.getRepliesByLastUpdate(params.startAuthor, params.startPermlink, params.limit, function (err, res) {
      eResponse.send(res, err);
    });
  }
);

extensionServer.on(
  "steem.api.getWitnesses", function (params, eResponse) {
    steem.api.getWitnesses(params.witnessIds, function (err, res) {
      eResponse.send(res, err);
    });
  }
);

extensionServer.on(
  "steem.api.getWitnessByAccount", function (params, eResponse) {
    steem.api.getWitnessByAccount(params.accountName, function (err, res) {
      eResponse.send(res, err);
    });
  }
);

extensionServer.on(
  "steem.api.getWitnessesByVote", function (params, eResponse) {
    steem.api.getWitnessesByVote(params.from, params.limit, function (err, res) {
      eResponse.send(res, err);
    });
  }
);

extensionServer.on(
  "steem.api.lookupWitnessAccounts", function (params, eResponse) {
    steem.api.lookupWitnessAccounts(params.lowerBoundName, params.limit, function (err, res) {
      eResponse.send(res, err);
    });
  }
);

extensionServer.on(
  "steem.api.getWitnessCount", function (params, eResponse) {
    steem.api.getWitnessCount(function (err, res) {
      eResponse.send(res, err);
    });
  }
);

extensionServer.on(
  "steem.api.getActiveWitnesses", function (params, eResponse) {
    steem.api.getActiveWitnesses(function (err, res) {
      eResponse.send(res, err);
    });
  }
);

extensionServer.on(
  "steem.api.getMinerQueue", function (params, eResponse) {
    steem.api.getMinerQueue(function (err, res) {
      eResponse.send(res, err);
    });
  }
);

extensionServer.on(
  "steem.api.getFollowers", function (params, eResponse) {
    steem.api.getFollowers(params.following, params.startFollower, params.followType, params.limit, function (err, res) {
      eResponse.send(res, err);
    });
  }
);

extensionServer.on(
  "steem.api.getFollowing", function (params, eResponse) {
    steem.api.getFollowing(params.follower, params.startFollowing, params.followType, params.limit, function (err, res) {
      eResponse.send(res, err);
    });
  }
);

extensionServer.on(
  "steem.api.getFollowCount", function (params, eResponse) {
    steem.api.getFollowCount(params.account, function (err, res) {
      eResponse.send(res, err);
    });
  }
);

extensionServer.on(
  "steem.api.broadcastTransactionSynchronous", function (params, eResponse) {
    steem.api.broadcastTransactionSynchronous(params.trx, function (err, res) {
      eResponse.send(res, err);
    });
  }
);

extensionServer.on(
  "steem.api.broadcastBlock", function (params, eResponse) {
    steem.api.broadcastBlock(params.b, function (err, res) {
      eResponse.send(res, err);
    });
  }
);

extensionServer.on(
  "steem.broadcast.accountCreate", function (params, eResponse) {
    steem.broadcast.accountCreate(params.wif, params.fee, params.creator, params.newAccountName, params.ownerKey, params.activeKey, params.postingKey, params.memoKey, params.jsonMetadata, function (err, res) {
      eResponse.send(res, err);
    });
  }
);

extensionServer.on(
  "steem.broadcast.accountCreateWithDelegation", function (params, eResponse) {
    steem.broadcast.accountCreateWithDelegation(params.wif, params.fee, params.delegation, params.creator, params.newAccountName, params.ownerKey, params.activeKey, params.postingKey, params.memoKey, params.jsonMetadata, params.extensions, function (err, res) {
      eResponse.send(res, err);
    });
  }
);

extensionServer.on(
  "steem.broadcast.delegateVestingShares", function (params, eResponse) {
    PrivateDataManager.getActiveCredentials(function (steemAccountName, activeWif) {
        confirmationManager.askForSteemPowerDelegation(params, function (allowed) {
          if (allowed) {
            steem.broadcast.delegateVestingShares(activeWif, steemAccountName, params.delegatee, params.vesting_shares, function (err, res) {
              eResponse.send(res, err);
            });
          }
          else {
            eResponse.send(null, new Error("Operation not Permitted by user!"));
          }
        });
      }
    );
  }
);

extensionServer.on(
  "steem.broadcast.accountUpdate", function (params, eResponse) {
    PrivateDataManager.getActiveCredentials(function (steemAccountName, activeWif) {
        confirmationManager.askForUnknowOperation(params, function (allowed) {
          if (allowed) {
            steem.broadcast.accountUpdate(activeWif, steemAccountName, params.ownerKey, params.activeKey, params.postingKey, params.memoKey, params.jsonMetadata, function (err, res) {
              eResponse.send(res, err);
            });
          }
          else {
            eResponse.send(null, new Error("Operation not Permitted by user!"));
          }
        })
      }
    )
  }
);

extensionServer.on(
  "steem.broadcast.accountWitnessProxy", function (params, eResponse) {
    PrivateDataManager.getActiveCredentials(function (steemAccountName, activeWif) {
        confirmationManager.askForUnknowOperation(params, function (allowed) {
          if (allowed) {
            steem.broadcast.accountWitnessProxy(activeWif, steemAccountName, params.proxy, function (err, res) {
              eResponse.send(res, err);
            });
          }
          else {
            eResponse.send(null, new Error("Operation not Permitted by user!"));
          }
        })
      }
    )
  }
);

extensionServer.on(
  "steem.broadcast.accountWitnessVote", function (params, eResponse) {
    PrivateDataManager.getActiveCredentials(function (steemAccountName, activeWif) {
        confirmationManager.askForUnknowOperation(params, function (allowed) {
          if (allowed) {
            steem.broadcast.accountWitnessVote(activeWif, steemAccountName, params.witness, params.approve, function (err, res) {
              eResponse.send(res, err);
            });
          }
          else {
            eResponse.send(null, new Error("Operation not Permitted by user!"));
          }
        })
      }
    )
  }
);

extensionServer.on(
  "steem.broadcast.challengeAuthority", function (params, eResponse) {
    PrivateDataManager.getActiveCredentials(function (steemAccountName, activeWif) {
        confirmationManager.askForUnknowOperation(params, function (allowed) {
          if (allowed) {
            steem.broadcast.challengeAuthority(activeWif, steemAccountName, params.challenged, params.requireOwner, function (err, res) {
              eResponse.send(res, err);
            });
          }
          else {
            eResponse.send(null, new Error("Operation not Permitted by user!"));
          }
        })
      }
    )
  }
);

extensionServer.on(
  "steem.broadcast.changeRecoveryAccount", function (params, eResponse) {
    PrivateDataManager.getActiveCredentials(function (steemAccountName, activeWif) {
        confirmationManager.askForUnknowOperation(params, function (allowed) {
          if (allowed) {
            steem.broadcast.changeRecoveryAccount(activeWif, steemAccountName, params.newRecoveryAccount, params.extensions, function (err, res) {
              eResponse.send(res, err);
            });
          }
          else {
            eResponse.send(null, new Error("Operation not Permitted by user!"));
          }
        })
      }
    )
  }
);

extensionServer.on(
  "steem.broadcast.comment", function (params, eResponse) {
    PrivateDataManager.getPostingCredentials(function (steemAccountName, postingWif) {
        confirmationManager.askForPostOrComment(params, function (allowed) {
          if (allowed) {
            steem.broadcast.comment(postingWif, params.parentAuthor, params.parentPermlink, steemAccountName, params.permlink, params.title, params.body, params.jsonMetadata, function (err, res) {
              eResponse.send(res, err);
            });
          }
          else {
            eResponse.send(null, new Error("Operation not Permitted by user!"));
          }
        });
      }
    );
  }
);

extensionServer.on(
  "steem.broadcast.commentOptions", function (params, eResponse) {
    PrivateDataManager.getPostingCredentials(function (steemAccountName, postingWif) {
        confirmationManager.askForUnknowOperation(params, function (allowed) {
          if (allowed) {
            steem.broadcast.commentOptions(postingWif, steemAccountName, params.permlink, params.maxAcceptedPayout, params.percentSteemDollars, params.allowVotes, params.allowCurationRewards, params.extensions, function (err, res) {
              eResponse.send(res, err);
            });
          }
          else {
            eResponse.send(null, new Error("Operation not Permitted by user!"));
          }
        });
      }
    );
  }
);

extensionServer.on(
  "steem.broadcast.commentPayout", function (params, eResponse) {
    PrivateDataManager.getPostingCredentials(function (steemAccountName, postingWif) {
        confirmationManager.askForUnknowOperation(params, function (allowed) {
          if (allowed) {
            steem.broadcast.commentPayout(postingWif, steemAccountName, params.permlink, params.payout, function (err, res) {
              eResponse.send(res, err);
            });
          }
          else {
            eResponse.send(null, new Error("Operation not Permitted by user!"));
          }
        });
      }
    );
  }
);

extensionServer.on(
  "steem.broadcast.commentReward", function (params, eResponse) {
    PrivateDataManager.getPostingCredentials(function (steemAccountName, postingWif) {
        confirmationManager.askForUnknowOperation(params, function (allowed) {
          if (allowed) {
            steem.broadcast.commentReward(postingWif, steemAccountName, params.permlink, params.sbdPayout, params.vestingPayout, function (err, res) {
              eResponse.send(res, err);
            });
          }
          else {
            eResponse.send(null, new Error("Operation not Permitted by user!"));
          }
        });
      }
    );
  }
);

extensionServer.on(
  "steem.broadcast.convert", function (params, eResponse) {
    PrivateDataManager.getPostingCredentials(function (steemAccountName, postingWif) {
        confirmationManager.askForUnknowOperation(params, function (allowed) {
          if (allowed) {
            steem.broadcast.convert(postingWif, steemAccountName, params.requestid, params.amount, function (err, res) {
              eResponse.send(res, err);
            });
          }
          else {
            eResponse.send(null, new Error("Operation not Permitted by user!"));
          }
        });
      }
    );
  }
);

extensionServer.on(
  "steem.broadcast.curateReward", function (params, eResponse) {
    PrivateDataManager.getPostingCredentials(function (steemAccountName, postingWif) {
        confirmationManager.askForUnknowOperation(params, function (allowed) {
          if (allowed) {
            steem.broadcast.curateReward(postingWif, steemAccountName, params.reward, params.commentAuthor, params.commentPermlink, function (err, res) {
              eResponse.send(res, err);
            });
          }
          else {
            eResponse.send(null, new Error("Operation not Permitted by user!"));
          }
        });
      }
    );
  }
);

extensionServer.on(
  "steem.broadcast.custom", function (params, eResponse) {
    PrivateDataManager.getActiveCredentials(function (steemAccountName, activeWif) {
        confirmationManager.askForUnknowOperation(params, function (allowed) {
          if (allowed) {
            steem.broadcast.custom(activeWif, steemAccountName, params.requiredAuths, params.id, params.data, function (err, res) {
              eResponse.send(res, err);
            });
          }
          else {
            eResponse.send(null, new Error("Operation not Permitted by user!"));
          }
        });
      }
    );
  }
);

extensionServer.on(
  "steem.broadcast.customBinary", function (params, eResponse) {
    PrivateDataManager.getActiveCredentials(function (steemAccountName, activeWif) {
        confirmationManager.askForUnknowOperation(params, function (allowed) {
          if (allowed) {
            steem.broadcast.customBinary(activeWif, params.id, params.data, function (err, res) {
              eResponse.send(res, err);
            });
          }
          else {
            eResponse.send(null, new Error("Operation not Permitted by user!"));
          }
        });
      }
    );
  }
);

extensionServer.on(
  "steem.broadcast.customJson", function (params, eResponse) {
    PrivateDataManager.getActiveCredentials(function (steemAccountName, activeWif) {
        confirmationManager.askForUnknowOperation(params, function (allowed) {
          if (allowed) {
            steem.broadcast.customJson(activeWif, params.requiredAuths, params.requiredPostingAuths, params.id, params.json, function (err, res) {
              eResponse.send(res, err);
            });
          }
          else {
            eResponse.send(null, new Error("Operation not Permitted by user!"));
          }
        });
      }
    );
  }
);

extensionServer.on(
  "steem.broadcast.deleteComment", function (params, eResponse) {
    PrivateDataManager.getPostingCredentials(function (steemAccountName, postingWif) {
        confirmationManager.askForDeletePostOrComment(params, function (allowed) {
          if (allowed) {
            steem.broadcast.deleteComment(postingWif, steemAccountName, params.permlink, function (err, res) {
              eResponse.send(res, err);
            });
          }
          else {
            eResponse.send(null, new Error("Operation not Permitted by user!"));
          }
        });
      }
    );
  }
);

extensionServer.on(
  "steem.broadcast.escrowDispute", function (params, eResponse) {
    PrivateDataManager.getActiveCredentials(function (steemAccountName, activeWif) {
        confirmationManager.askForUnknowOperation(params, function (allowed) {
          if (allowed) {
            steem.broadcast.escrowDispute(activeWif, steemAccountName, params.to, params.agent, params.who, params.escrowId, function (err, res) {
              eResponse.send(res, err);
            });
          }
          else {
            eResponse.send(null, new Error("Operation not Permitted by user!"));
          }
        });
      }
    );
  }
);

extensionServer.on(
  "steem.broadcast.escrowRelease", function (params, eResponse) {
    PrivateDataManager.getActiveCredentials(function (steemAccountName, activeWif) {
        confirmationManager.askForUnknowOperation(params, function (allowed) {
          if (allowed) {
            steem.broadcast.escrowRelease(activeWif, steemAccountName, params.to, params.agent, params.who, params.receiver, params.escrowId, params.sbdAmount, params.steemAmount, function (err, res) {
              eResponse.send(res, err);
            });
          }
          else {
            eResponse.send(null, new Error("Operation not Permitted by user!"));
          }
        });
      }
    );
  }
);

extensionServer.on(
  "steem.broadcast.escrowTransfer", function (params, eResponse) {
    PrivateDataManager.getActiveCredentials(function (steemAccountName, activeWif) {
        confirmationManager.askForUnknowOperation(params, function (allowed) {
          if (allowed) {
            steem.broadcast.escrowTransfer(activeWif, steemAccountName, params.to, params.agent, params.escrowId, params.sbdAmount, params.steemAmount, params.fee, params.ratificationDeadline, params.escrowExpiration, params.jsonMeta, function (err, res) {
              eResponse.send(res, err);
            });
          }
          else {
            eResponse.send(null, new Error("Operation not Permitted by user!"));
          }
        });
      }
    );
  }
);

extensionServer.on(
  "steem.broadcast.feedPublish", function (params, eResponse) {
    PrivateDataManager.getActiveCredentials(function (steemAccountName, activeWif) {
        confirmationManager.askForUnknowOperation(params, function (allowed) {
          if (allowed) {
            steem.broadcast.feedPublish(activeWif, steemAccountName, params.exchangeRate, function (err, res) {
              eResponse.send(res, err);
            });
          }
          else {
            eResponse.send(null, new Error("Operation not Permitted by user!"));
          }
        });
      }
    );
  }
);

extensionServer.on(
  "steem.broadcast.pow2", function (params, eResponse) {
    PrivateDataManager.getActiveCredentials(function (steemAccountName, activeWif) {
        confirmationManager.askForUnknowOperation(params, function (allowed) {
          if (allowed) {
            steem.broadcast.pow2(activeWif, params.work, params.newOwnerKey, params.props, function (err, res) {
              eResponse.send(res, err);
            });
          }
          else {
            eResponse.send(null, new Error("Operation not Permitted by user!"));
          }
        });
      }
    );
  }
);

extensionServer.on(
  "steem.broadcast.fillConvertRequest", function (params, eResponse) {
    PrivateDataManager.getActiveCredentials(function (steemAccountName, activeWif) {
        confirmationManager.askForUnknowOperation(params, function (allowed) {
          if (allowed) {
            steem.broadcast.fillConvertRequest(activeWif, steemAccountName, params.requestid, params.amountIn, params.amountOut, function (err, res) {
              eResponse.send(res, err);
            });
          }
          else {
            eResponse.send(null, new Error("Operation not Permitted by user!"));
          }
        });
      }
    );
  }
);

extensionServer.on(
  "steem.broadcast.fillOrder", function (params, eResponse) {
    PrivateDataManager.getActiveCredentials(function (steemAccountName, activeWif) {
        confirmationManager.askForUnknowOperation(params, function (allowed) {
          if (allowed) {
            steem.broadcast.fillOrder(activeWif, steemAccountName, params.currentOrderid, params.currentPays, params.openOwner, params.openOrderid, params.openPays, function (err, res) {
              eResponse.send(res, err);
            });
          }
          else {
            eResponse.send(null, new Error("Operation not Permitted by user!"));
          }
        });
      }
    );
  }
);
extensionServer.on(
  "steem.broadcast.fillVestingWithdraw", function (params, eResponse) {
    PrivateDataManager.getActiveCredentials(function (steemAccountName, activeWif) {
        confirmationManager.askForUnknowOperation(params, function (allowed) {
          if (allowed) {
            steem.broadcast.fillVestingWithdraw(activeWif, steemAccountName, params.toAccount, params.withdrawn, params.deposited, function (err, res) {
              eResponse.send(res, err);
            });
          }
          else {
            eResponse.send(null, new Error("Operation not Permitted by user!"));
          }
        });
      }
    );
  }
);

extensionServer.on(
  "steem.broadcast.interest", function (params, eResponse) {
    PrivateDataManager.getActiveCredentials(function (steemAccountName, activeWif) {
        confirmationManager.askForUnknowOperation(params, function (allowed) {
          if (allowed) {
            steem.broadcast.interest(activeWif, steemAccountName, params.interest, function (err, res) {
              eResponse.send(res, err);
            });
          }
          else {
            eResponse.send(null, new Error("Operation not Permitted by user!"));
          }
        });
      }
    );
  }
);

extensionServer.on(
  "steem.broadcast.limitOrderCancel", function (params, eResponse) {
    PrivateDataManager.getActiveCredentials(function (steemAccountName, activeWif) {
        confirmationManager.askForUnknowOperation(params, function (allowed) {
          if (allowed) {
            steem.broadcast.limitOrderCancel(activeWif, steemAccountName, params.orderid, function (err, res) {
              eResponse.send(res, err);
            });
          }
          else {
            eResponse.send(null, new Error("Operation not Permitted by user!"));
          }
        });
      }
    );
  }
);

extensionServer.on(
  "steem.broadcast.limitOrderCreate", function (params, eResponse) {
    PrivateDataManager.getPostingCredentials(function (steemAccountName, postingWif) {
        confirmationManager.askForUnknowOperation(params, function (allowed) {
          if (allowed) {
            steem.broadcast.limitOrderCreate(postingWif, steemAccountName, params.orderid, params.amountToSell, params.minToReceive, params.fillOrKill, params.expiration, function (err, res) {
              eResponse.send(res, err);
            });
          }
          else {
            eResponse.send(null, new Error("Operation not Permitted by user!"));
          }
        });
      }
    );
  }
);

extensionServer.on(
  "steem.broadcast.limitOrderCreate2", function (params, eResponse) {
    PrivateDataManager.getPostingCredentials(function (steemAccountName, postingWif) {
        confirmationManager.askForUnknowOperation(params, function (allowed) {
          if (allowed) {
            steem.broadcast.limitOrderCreate2(postingWif, steemAccountName, params.orderid, params.amountToSell, params.minToReceive, params.fillOrKill, params.expiration, function (err, res) {
              eResponse.send(res, err);
            });
          }
          else {
            eResponse.send(null, new Error("Operation not Permitted by user!"));
          }
        })
      }
    )
  }
);

extensionServer.on(
  "steem.broadcast.liquidityReward", function (params, eResponse) {
    PrivateDataManager.getPostingCredentials(function (steemAccountName, postingWif) {
        confirmationManager.askForUnknowOperation(params, function (allowed) {
          if (allowed) {
            steem.broadcast.liquidityReward(postingWif, steemAccountName, params.payout, function (err, res) {
              eResponse.send(res, err);
            });
          }
          else {
            eResponse.send(null, new Error("Operation not Permitted by user!"));
          }
        })
      }
    )
  }
);

extensionServer.on(
  "steem.broadcast.pow", function (params, eResponse) {
    PrivateDataManager.getPostingCredentials(function (steemAccountName, postingWif) {
        confirmationManager.askForUnknowOperation(params, function (allowed) {
          if (allowed) {
            steem.broadcast.pow(postingWif, steemAccountName, params.input, params.signature, params.work, function (err, res) {
              eResponse.send(res, err);
            });
          }
          else {
            eResponse.send(null, new Error("Operation not Permitted by user!"));
          }
        });
      }
    );
  }
);

extensionServer.on(
  "steem.broadcast.proveAuthority", function (params, eResponse) {
    PrivateDataManager.getPostingCredentials(function (steemAccountName, postingWif) {
        confirmationManager.askForUnknowOperation(params, function (allowed) {
          if (allowed) {
            steem.broadcast.proveAuthority(postingWif, steemAccountName, params.requireOwner, function (err, res) {
              eResponse.send(res, err);
            });
          }
          else {
            eResponse.send(null, new Error("Operation not Permitted by user!"));
          }
        });
      }
    );
  }
);

extensionServer.on(
  "steem.broadcast.recoverAccount", function (params, eResponse) {
    PrivateDataManager.getPostingCredentials(function (steemAccountName, postingWif) {
        confirmationManager.askForUnknowOperation(params, function (allowed) {
          if (allowed) {
            steem.broadcast.recoverAccount(postingWif, steemAccountName, params.newOwnerAuthority, params.recentOwnerAuthority, params.extensions, function (err, res) {
              eResponse.send(res, err);
            });
          }
          else {
            eResponse.send(null, new Error("Operation not Permitted by user!"));
          }
        });
      }
    );
  }
);

extensionServer.on(
  "steem.broadcast.reportOverProduction", function (params, eResponse) {
    PrivateDataManager.getPostingCredentials(function (steemAccountName, postingWif) {
        confirmationManager.askForUnknowOperation(params, function (allowed) {
          if (allowed) {
            steem.broadcast.reportOverProduction(postingWif, steemAccountName, params.firstBlock, params.secondBlock, function (err, res) {
              eResponse.send(res, err);
            });
          }
          else {
            eResponse.send(null, new Error("Operation not Permitted by user!"));
          }
        });
      }
    );
  }
);

extensionServer.on(
  "steem.broadcast.requestAccountRecovery", function (params, eResponse) {
    PrivateDataManager.getActiveCredentials(function (steemAccountName, activeWif) {
        confirmationManager.askForUnknowOperation(params, function (allowed) {
          if (allowed) {
            steem.broadcast.requestAccountRecovery(activeWif, steemAccountName, params.accountToRecover, params.newOwnerAuthority, params.extensions, function (err, res) {
              eResponse.send(res, err);
            });
          }
          else {
            eResponse.send(null, new Error("Operation not Permitted by user!"));
          }
        });
      }
    );
  }
);

extensionServer.on(
  "steem.broadcast.escrowApprove", function (params, eResponse) {
    PrivateDataManager.getActiveCredentials(function (steemAccountName, activeWif) {
        confirmationManager.askForUnknowOperation(params, function (allowed) {
          if (allowed) {
            steem.broadcast.escrowApprove(activeWif, steemAccountName, params.to, params.agent, params.who, params.escrowId, params.approve, function (err, res) {
              eResponse.send(res, err);
            });
          }
          else {
            eResponse.send(null, new Error("Operation not Permitted by user!"));
          }
        });
      }
    );
  }
);

extensionServer.on(
  "steem.broadcast.setWithdrawVestingRoute", function (params, eResponse) {
    PrivateDataManager.getActiveCredentials(function (steemAccountName, activeWif) {
        confirmationManager.askForUnknowOperation(params, function (allowed) {
          if (allowed) {
            steem.broadcast.setWithdrawVestingRoute(activeWif, steemAccountName, params.toAccount, params.percent, params.autoVest, function (err, res) {
              eResponse.send(res, err);
            });
          }
          else {
            eResponse.send(null, new Error("Operation not Permitted by user!"));
          }
        });
      }
    );
  }
);

extensionServer.on(
  "steem.broadcast.transfer", function (params, eResponse) {
    PrivateDataManager.getActiveCredentials(function (steemAccountName, activeWif) {
      confirmationManager.askForTransfer(params, function (allowed) {
        if (allowed) {
          steem.broadcast.transfer(activeWif, steemAccountName, params.to, params.amount, params.memo, function (err, res) {
            eResponse.send(res, err);
          });
        }
        else {
          eResponse.send(null, new Error("Operation not Permitted by user!"));
        }
      })
    })
  }
);

extensionServer.on(
  "steem.broadcast.transferToVesting", function (params, eResponse) {
    PrivateDataManager.getActiveCredentials(function (steemAccountName, activeWif) {
        confirmationManager.askForUnknowOperation(params, function (allowed) {
          if (allowed) {
            steem.broadcast.transferToVesting(activeWif, steemAccountName, params.to, params.amount, function (err, res) {
              eResponse.send(res, err);
            });
          }
          else {
            eResponse.send(null, new Error("Operation not Permitted by user!"));
          }
        })
      }
    );
  }
);

extensionServer.on(
  "steem.broadcast.vote", function (params, eResponse) {
    PrivateDataManager.getPostingCredentials(function (steemAccountName, postingWif) {
        confirmationManager.askForVote(params, function (allowed) {
          if (allowed) {
            steem.broadcast.vote(postingWif, steemAccountName, params.author, params.permlink, params.weight, function (err, res) {
              eResponse.send(res, err);
            });
          }
          else {
            eResponse.send(null, new Error("Operation not Permitted by user!"));
          }
        })
      }
    );
  }
);

extensionServer.on(
  "steem.broadcast.withdrawVesting", function (params, eResponse) {
    PrivateDataManager.getPostingCredentials(function (steemAccountName, postingWif) {
        confirmationManager.askForUnknowOperation(params, function (allowed) {
          if (allowed) {
            steem.broadcast.withdrawVesting(postingWif, steemAccountName, params.vestingShares, function (err, res) {
              eResponse.send(res, err);
            });
          }
          else {
            eResponse.send(null, new Error("Operation not Permitted by user!"));
          }
        })
      }
    )
  }
);


extensionServer.on(
  "steem.broadcast.witnessUpdate", function (params, eResponse) {
    PrivateDataManager.getPostingCredentials(function (steemAccountName, postingWif) {
        confirmationManager.askForUnknowOperation(params, function (allowed) {
          if (allowed) {
            steem.broadcast.witnessUpdate(postingWif, steemAccountName, params.url, params.blockSigningKey, params.props, params.fee, function (err, res) {
              eResponse.send(res, err);
            });
          }
          else {
            eResponse.send(null, new Error("Operation not Permitted by user!"));
          }
        })
      }
    );
  }
);

extensionServer.on(
  "steem.broadcast.fillVestingWithdraw", function (params, eResponse) {
    PrivateDataManager.getPostingCredentials(function (steemAccountName, postingWif) {
        confirmationManager.askForUnknowOperation(params, function (allowed) {
          if (allowed) {
            steem.broadcast.fillVestingWithdraw(postingWif, steemAccountName, params.toAccount, params.withdrawn, params.deposited, function (err, res) {
              eResponse.send(res, err);
            });
          }
          else {
            eResponse.send(null, new Error("Operation not Permitted by user!"));
          }
        })
      }
    );
  }
);

extensionServer.on(
  "steem.broadcast.fillOrder", function (params, eResponse) {
    PrivateDataManager.getPostingCredentials(function (steemAccountName, postingWif) {
        confirmationManager.askForUnknowOperation(params, function (allowed) {
          if (allowed) {
            steem.broadcast.fillOrder(postingWif, steemAccountName, params.currentOrderid, params.currentPays, params.openOwner, params.openOrderid, params.openPays, function (err, res) {
              eResponse.send(res, err);
            });
          }
          else {
            eResponse.send(null, new Error("Operation not Permitted by user!"));
          }
        })
      }
    )
  }
);

extensionServer.on(
  "steem.broadcast.fillTransferFromSavings", function (params, eResponse) {
    PrivateDataManager.getActiveCredentials(function (steemAccountName, activeWif) {
        confirmationManager.askForUnknowOperation(params, function (allowed) {
          if (allowed) {
            steem.broadcast.fillTransferFromSavings(activeWif, steemAccountName, params.to, params.amount, params.requestId, params.memo, function (err, res) {
              eResponse.send(res, err);
            });
          }
          else {
            eResponse.send(null, new Error("Operation not Permitted by user!"));
          }
        })
      }
    )
  }
);

extensionServer.on(
  "steem.broadcast.commentPayout", function (params, eResponse) {
    PrivateDataManager.getPostingCredentials(function (steemAccountName, postingWif) {
        confirmationManager.askForUnknowOperation(params, function (allowed) {
          if (allowed) {
            steem.broadcast.commentPayout(postingWif, steemAccountName, params.permlink, params.payout, function (err, res) {
              eResponse.send(res, err);
            });
          }
          else {
            eResponse.send(null, new Error("Operation not Permitted by user!"));
          }
        })
      }
    )
  }
);

extensionServer.on(
  "steem.broadcast.transferToSavings", function (params, eResponse) {
    PrivateDataManager.getActiveCredentials(function (steemAccountName, activeWif) {
        confirmationManager.askForUnknowOperation(params, function (allowed) {
          if (allowed) {
            steem.broadcast.transferToSavings(activeWif, steemAccountName, params.to, params.amount, params.memo, function (err, res) {
              eResponse.send(res, err);
            });
          }
          else {
            eResponse.send(null, new Error("Operation not Permitted by user!"));
          }
        })
      }
    );
  }
);

extensionServer.on(
  "steem.broadcast.transferFromSavings", function (params, eResponse) {
    PrivateDataManager.getActiveCredentials(function (steemAccountName, activeWif) {
        confirmationManager.askForUnknowOperation(params, function (allowed) {
          if (allowed) {
            steem.broadcast.transferFromSavings(activeWif, steemAccountName, params.to, params.amount, params.memo, function (err, res) {
              eResponse.send(res, err);
            });
          }
          else {
            eResponse.send(null, new Error("Operation not Permitted by user!"));
          }
        })
      }
    );
  }
);

extensionServer.on(
  "steem.broadcast.cancelTransferFromSavings", function (params, eResponse) {
    PrivateDataManager.getActiveCredentials(function (steemAccountName, activeWif) {
        confirmationManager.askForUnknowOperation(params, function (allowed) {
          if (allowed) {
            steem.broadcast.cancelTransferFromSavings(activeWif, steemAccountName, params.requestId, function (err, res) {
              eResponse.send(res, err);
            });
          }
          else {
            eResponse.send(null, new Error("Operation not Permitted by user!"));
          }
        })
      }
    );
  }
);

extensionServer.on(
  "steem.broadcast.prepareAndSignTransferTransaction", function (params, eResponse) {
    PrivateDataManager.getActiveCredentials(function (steemAccountName, activeWif) {
        confirmationManager.askForTransfer(params, function (allowed) {
          if (allowed) {
            let tx = {
              extensions: [],
              operations: [
                ["transfer", {
                  amount: params.amount,
                  from: steemAccountName,
                  to: params.to,
                  memo: params.memo
                }]
              ]
            };
            steem.broadcast._prepareTransaction(tx).then(function (params) {
              return bluebird.join(transaction, steem.auth.signTransaction(params.transaction, {active: activeWif}));
            }).spread(function (transaction, signedTransaction) {
              eResponse.send(signedTransaction);
            });
          }
          else {
            eResponse.send(null, new Error("Operation not Permitted by user!"));
          }
        });
      }
    );
  }
);

extensionServer.on(
  "steem.broadcast.broadcastSignedTransaction", function (params, eResponse) {
    steem.api.broadcastTransactionSynchronousAsync(params.signedTransaction).then(function (result) {
      eResponse.send(result);
    });
  }
);

extensionServer.on(
  "steem.formatter.commentPermlink", function (params, eResponse) {
    let commentPermlink = steem.formatter.commentPermlink(params.parentAuthor, params.parentPermlink);
    eResponse.send(commentPermlink);
  }
);

extensionServer.on(
  "steem.formatter.estimateAccountValue", function (params, eResponse) {
    let steemPower = steem.formatter.estimateAccountValue(params.account);
    eResponse.send(steemPower);
  }
);

extensionServer.on(
  "steem.formatter.reputation", function (params, eResponse) {
    let reputation = steem.formatter.reputation(params.amount);
    eResponse.send(reputation);
  }
);

extensionServer.on(
  "steem.formatter.vestToSteem", function (params, eResponse) {
    let steemPower = steem.formatter.vestToSteem(params.vestingShares, params.totalVestingShares, params.totalVestingFundSteem);
    eResponse.send(steemPower);
  }
);
