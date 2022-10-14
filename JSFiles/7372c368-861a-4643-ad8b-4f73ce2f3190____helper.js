/**
 * name : module/notifications/user-extension/helper.js
 * author : Aman Jung Karki
 * Date : 15-Nov-2019
 * Description : User extension helper.
 */


/**
    * UserExtensionHelper
    * @class
*/

const entityTypesHelper = require(MODULES_BASE_PATH + "/entityTypes/helper");
const entitiesHelper = require(MODULES_BASE_PATH + "/entities/helper");
const userRolesHelper = require(MODULES_BASE_PATH + "/user-roles/helper");
const elasticSearch = require(GENERIC_HELPERS_PATH + "/elastic-search");
const programsHelper = require(MODULES_BASE_PATH + "/programs/helper");
const solutionsHelper = require(MODULES_BASE_PATH + "/solutions/helper");

module.exports = class UserExtensionHelper {

    /**
   * Get userExtension document based on userid.
   * @method
   * @name userExtensionDocument
   * @name userExtensionDocument
   * @param {Object} filterQueryObject - filter query data.
   * @param {Object} [projection = {}] - projected data.
   * @returns {Promise} returns a promise.
  */

    static userExtensionDocument(filterQueryObject, projection = {}) {
        return new Promise(async (resolve, reject) => {
            try {

                let userExtensionData = await database.models.userExtension.findOne(filterQueryObject, projection).lean();

                return resolve(userExtensionData);

            } catch (error) {
                return reject(error);
            }
        })


    }

    /**
     * Create or update the userExtension document.
     * @method
     * @name createOrUpdate
     * @name createOrUpdate 
     * @param {Object} deviceData - device data.
     * @param {Object} userDetails - User details.
     * @param {String} userDetails.userId - Logged in user id.
     * @param {String} userDetails.userName - Logged in user name.        
     * @returns {Promise} returns a promise.
    */

    static createOrUpdate(deviceData, userDetails) {

        return new Promise(async (resolve, reject) => {
            try {

                let userExtensionData = await this.userExtensionDocument({
                    userId: userDetails.userId,
                    status: "active",
                    isDeleted: false
                }, { devices: 1 });

                let response = {};

                if (userExtensionData) {

                    let deviceNotFound = false;

                    if (userExtensionData.devices && userExtensionData.devices.length > 0) {

                        let matchingDeviceData =
                            userExtensionData.devices.find(
                                eachDevice => eachDevice.deviceId === deviceData.deviceId
                            );

                        if (!matchingDeviceData) {

                            deviceNotFound = true;
                        }

                    } else {
                        deviceNotFound = true;
                    }

                    if (deviceNotFound) {

                        let updatedData = await database.models.userExtension.findOneAndUpdate({
                            userId: userDetails.userId,
                        }, { $addToSet: { devices: deviceData } }).lean();

                        if (updatedData) {
                            response["success"] = true;
                            response["message"] =
                                `Added Successfully device id ${deviceData.deviceId} for user ${userDetails.email}`;
                        } else {
                            throw `Could not add device id ${deviceData.deviceId} for user ${userDetails.email}`;
                        }
                    }

                } else {

                    let createUserExtension = await database.models.userExtension.create(
                        {
                            "userId": userDetails.userId,
                            "externalId": userDetails.userName,
                            "status": "active",
                            "isDeleted": false,
                            "devices": [deviceData],
                            "createdBy": "SYSTEM",
                            "updatedBy": "SYSTEM"
                        }
                    );

                    if (createUserExtension) {
                        response["success"] = true;
                        response["message"] =
                            `Successfully created user ${userDetails.userId} in userExtension`;
                    } else {
                        throw `Could not create user ${userDetails.userId} in userExtension`;
                    }

                }

                return resolve(response);

            } catch (error) {
                return reject(error);
            }
        })
    }

    /**
     * Update device status in userExtension document.
     * @method
     * @name updateDeviceStatus
     * @name updateDeviceStatus  
     * @param {Object} deviceData - device data.
     * @param {String} deviceData.title - title of device.
     * @param {Object[]} deviceArray - device array.      * 
     * @param {String} userId - Logged in user id.      
     * @returns {Promise} returns a promise.
    */

    static updateDeviceStatus(deviceId, deviceArray, userId) {

        return new Promise(async (resolve, reject) => {

            try {
                deviceArray.forEach(async devices => {

                    delete devices['message'];
                    delete devices['title'];

                    if (devices.deviceId == deviceId) {
                        devices.status = "inactive";
                        devices.deactivatedAt = new Date();
                    }
                });

                let updateDevice = await database.models.userExtension.findOneAndUpdate(
                    { userId: userId },
                    { $set: { "devices": deviceArray } }
                ).lean();

                if (!updateDevice) {
                    throw "Could not update device.";
                }

                return resolve({
                    success: true,
                    message: "successfuly updated the status to inactive"
                });

            } catch (error) {
                return reject(error);
            }

        })
    }

    /**
   * Get profile with entity details
   * @method
   * @name profileWithEntityDetails
   * @param {Object} filterQueryObject - filtered data.
   * @returns {Object} 
   */

    static profileWithEntityDetails(filterQueryObject, appName) {
        return new Promise(async (resolve, reject) => {
            try {

                const entityTypesArray = await entityTypesHelper.entityTypesDocument(
                    "all",
                    [
                        "name",
                        "immediateChildrenEntityType"
                    ]
                );

                let enityTypeToImmediateChildrenEntityMap = {};

                if (entityTypesArray.length > 0) {
                    entityTypesArray.forEach(entityType => {
                        enityTypeToImmediateChildrenEntityMap[entityType.name] = (entityType.immediateChildrenEntityType && entityType.immediateChildrenEntityType.length > 0) ? entityType.immediateChildrenEntityType : [];
                    })
                }

                let queryObject = [
                    {
                        $match: filterQueryObject
                    },
                    {
                        $lookup: {
                            "from": "entities",
                            "localField": "roles.entities",
                            "foreignField": "_id",
                            "as": "entityDocuments"
                        }
                    },
                    {
                        $lookup: {
                            "from": "userRoles",
                            "localField": "roles.roleId",
                            "foreignField": "_id",
                            "as": "roleDocuments"
                        }
                    },
                    {
                        $project: {
                            "externalId": 1,
                            "roles": 1,
                            "roleDocuments._id": 1,
                            "roleDocuments.code": 1,
                            "roleDocuments.title": 1,
                            "entityDocuments._id": 1,
                            "entityDocuments.metaInformation.externalId": 1,
                            "entityDocuments.metaInformation.name": 1,
                            "entityDocuments.groups": 1,
                            "entityDocuments.entityType": 1,
                            "entityDocuments.entityTypeId": 1,
                            "ratings": 1
                        }
                    }
                ];

                let userExtensionData =
                    await database.models.userExtension.aggregate(queryObject);
                let relatedEntities = [];

                if (userExtensionData[0]) {

                    let roleMap = {};

                    if (userExtensionData[0].entityDocuments && userExtensionData[0].entityDocuments.length > 0) {

                        let projection = [
                            "metaInformation.externalId",
                            "metaInformation.name",
                            "metaInformation.addressLine1",
                            "metaInformation.addressLine2",
                            "metaInformation.administration",
                            "metaInformation.city",
                            "metaInformation.country",
                            "entityTypeId",
                            "entityType"
                        ];

                        relatedEntities =
                            await entitiesHelper.relatedEntities(
                                userExtensionData[0].entityDocuments[0]._id,
                                userExtensionData[0].entityDocuments[0].entityTypeId,
                                userExtensionData[0].entityDocuments[0].entityType,
                                projection
                            );

                    }

                    // <- Dirty fix. Profile update for only Goa state. 
                    // In future can be removed if required for all state.

                    let goaStateExists = false;
                    let goaState = constants.common.GOA_STATE.toUpperCase();

                    if (relatedEntities.length > 0) {

                        let checkGoaStateExistsOrNot = relatedEntities.some(
                            entity => entity.metaInformation.name.toUpperCase() === goaState
                        );

                        if (
                            checkGoaStateExistsOrNot &&
                            appName === constants.common.UNNATI_APP_NAME
                        ) {
                            goaStateExists = true;
                        }

                    }

                    if (userExtensionData[0].roleDocuments && userExtensionData[0].roleDocuments.length > 0) {

                        userExtensionData[0].roleDocuments.forEach(role => {
                            roleMap[role._id.toString()] = role;
                        })
                        let entityMap = {};

                        if (userExtensionData[0].entityDocuments && userExtensionData[0].entityDocuments.length > 0) {

                            userExtensionData[0].entityDocuments.forEach(entity => {
                                entity.metaInformation.childrenCount = 0;
                                entity.metaInformation.entityType = entity.entityType;
                                entity.metaInformation.entityTypeId = entity.entityTypeId;
                                entity.metaInformation.subEntityGroups = new Array;

                                Array.isArray(enityTypeToImmediateChildrenEntityMap[entity.entityType]) && enityTypeToImmediateChildrenEntityMap[entity.entityType].forEach(immediateChildrenEntityType => {
                                    if (entity.groups && entity.groups[immediateChildrenEntityType]) {
                                        entity.metaInformation.immediateSubEntityType = immediateChildrenEntityType;
                                        entity.metaInformation.childrenCount = entity.groups[immediateChildrenEntityType].length;
                                    }
                                })

                                entity.groups && Array.isArray(Object.keys(entity.groups)) && Object.keys(entity.groups).forEach(subEntityType => {
                                    entity.metaInformation.subEntityGroups.push(subEntityType);
                                })

                                // <- Dirty fix. Profile update for only Goa state. 
                                // In future can be removed if required for all state.

                                if (
                                    appName === constants.common.UNNATI_APP_NAME &&
                                    entity.metaInformation.name.toUpperCase() === goaState
                                ) {
                                    goaStateExists = true;
                                }

                                entityMap[entity._id.toString()] = entity;
                            })
                        }

                        for (let userExtensionRoleCounter = 0; userExtensionRoleCounter < userExtensionData[0].roles.length; userExtensionRoleCounter++) {
                            for (let userExtenionRoleEntityCounter = 0; userExtenionRoleEntityCounter < userExtensionData[0].roles[userExtensionRoleCounter].entities.length; userExtenionRoleEntityCounter++) {
                                userExtensionData[0].roles[userExtensionRoleCounter].entities[userExtenionRoleEntityCounter] = {
                                    _id: entityMap[userExtensionData[0].roles[userExtensionRoleCounter].entities[userExtenionRoleEntityCounter].toString()]._id,
                                    ...entityMap[userExtensionData[0].roles[userExtensionRoleCounter].entities[userExtenionRoleEntityCounter].toString()].metaInformation
                                };
                            }
                            roleMap[userExtensionData[0].roles[userExtensionRoleCounter].roleId.toString()].immediateSubEntityType = (userExtensionData[0].roles[userExtensionRoleCounter].entities[0] && userExtensionData[0].roles[userExtensionRoleCounter].entities[0].entityType) ? userExtensionData[0].roles[userExtensionRoleCounter].entities[0].entityType : "";
                            roleMap[userExtensionData[0].roles[userExtensionRoleCounter].roleId.toString()].entities = userExtensionData[0].roles[userExtensionRoleCounter].entities;
                        }
                    }

                    let showPopupForm = false;
                    let userProfile = await database.models.userProfile.findOne(
                        {
                            userId: filterQueryObject.userId,
                            status: {
                                $in: [
                                    constants.common.USER_PROFILE_VERIFIED_STATUS,
                                    constants.common.USER_PROFILE_PENDING_STATUS
                                ]
                            }
                        }, { _id: 1, status: 1 }).lean();

                    if (userProfile == null) {
                        showPopupForm = true
                    }

                    return resolve(
                        _.merge(_.omit(
                            userExtensionData[0],
                            ["roles", "entityDocuments", "roleDocuments"]
                        ),
                            { roles: _.isEmpty(roleMap) ? [] : Object.values(roleMap) },
                            { relatedEntities: relatedEntities },
                            {
                                allowProfileUpdateForm: goaStateExists
                            }, {
                            showPopupForm: goaStateExists && showPopupForm ? true : false
                        }
                        )
                    );
                } else {
                    return resolve({
                        status: httpStatusCode['bad_request'].status,
                        message: constants.apiResponses.USER_EXTENSION_NOT_FOUND
                    });
                }
            } catch (error) {
                return reject(error);
            }
        })
    }

    /**
   * Update user profile data.
   * @method
   * @name update
   * @param {Object} updateData - Update user profile data.
   * @returns {Object} 
   */

    static update(userId, updateData) {
        return new Promise(async (resolve, reject) => {
            try {

                let updatedData =
                    await database.models.userExtension.findOneAndUpdate({
                        userId: userId
                    }, {
                        $set: updateData
                    }, {
                        new: true
                    });

                return resolve({
                    message: constants.apiResponses.USER_EXTENSION_FETCHED,
                    result: updatedData
                })
            } catch (error) {
                return reject(error);
            }
        });
    }

    /**
   * Update profile roles
   * @method
   * @name updateProfileRoles
   * @param {Object} requestedData - requested data.
   * @param {String} userId - Logged in user id.
   * @param {String} userName - Logged in user name.
   * @returns {Object} 
   */

    static updateProfileRoles(requestedData, userId, userName) {

        return new Promise(async (resolve, reject) => {
            try {

                const userExtensionData = await this.userExtensionDocument({
                    userId: userId
                }, {
                    "roles": 1,
                    "createdBy": 1,
                    "externalId": 1
                });

                if (
                    userExtensionData &&
                    userExtensionData.roles && userExtensionData.roles.length > 0
                ) {
                    return resolve({
                        message: constants.apiResponses.USER_DATA_EXISTS,
                        result: []
                    })
                }

                const entityData = await entitiesHelper.entityDocuments({
                    _id: requestedData.stateId
                }, ["_id", "metaInformation.name"]);

                if (!entityData.length > 0) {
                    return resolve({
                        message: constants.apiResponses.STATE_NOT_FOUND,
                        result: []
                    })
                }

                requestedData["state"] = {
                    _id: ObjectId(requestedData.stateId),
                    name: entityData[0].metaInformation.name
                }

                for (
                    let pointerToRole = 0;
                    pointerToRole < requestedData.roles.length;
                    pointerToRole++
                ) {

                    const rolesData =
                        await userRolesHelper.roleDocuments(
                            {
                                _id: requestedData.roles[pointerToRole]._id
                            }, [
                            "code",
                            "entityTypes"
                        ]
                        );

                    if (!rolesData.length > 0) {
                        return resolve({
                            message: constants.apiResponses.USER_ROLES_NOT_FOUND,
                            result: []
                        });
                    }

                    let entityTypes = rolesData[0].entityTypes.map(roleData => {
                        return roleData.entityType;
                    })
                     
                    let entities = [];

                    if ( !requestedData.roles[pointerToRole].entities || (requestedData.roles[pointerToRole].entities && requestedData.roles[pointerToRole].entities.length == 0 )) {
                        entities.push(requestedData.stateId);
                    } 
                    
                    if (requestedData.roles[pointerToRole].entities && requestedData.roles[pointerToRole].entities.length > 0) {
                        const entitiesData = await entitiesHelper.entityDocuments({
                            _id: { $in: requestedData.roles[pointerToRole].entities },
                            entityType: { $in: entityTypes }
                        }, ["_id"]);

                        if (entitiesData.length > 0) {

                            entities = entitiesData.map(entity => {
                                return entity._id
                            });
                        }
                    }

                    requestedData.roles[pointerToRole].roleId = rolesData[0]._id;
                    requestedData.roles[pointerToRole].code = rolesData[0].code;
                    requestedData.roles[pointerToRole].entities = entities;

                    delete requestedData.roles[pointerToRole]._id;
                }

                if (!userExtensionData[0]) {
                    
                    requestedData.userId = userId;
                    requestedData.createdBy =
                        userExtensionData && userExtensionData.createdBy ?
                            userExtensionData.createdBy : userId;

                    requestedData.status = constants.common.ACTIVE;
                    requestedData.externalId =
                        userExtensionData && userExtensionData.externalId ?
                            userExtensionData.externalId : userName;

                    requestedData.isDeleted = false;
                }

                requestedData.updatedBy = userId;

                await database.models.userExtension.findOneAndUpdate({
                    userId: userId
                }, {
                    $set: requestedData
                }, {
                    upsert: true,
                    new: true
                });

                const responseData = await this.profileWithEntityDetailsV2({
                    userId: userId,
                    status: constants.common.ACTIVE,
                    isDeleted: false
                });

                //update user role in elasticsearch
                if (requestedData.roles.length > 0) {
                   await this.updateUserRolesInEntitiesElasticSearch(userId, requestedData.roles);
                }   

                await this.pushUserToElasticSearch(userId);

                resolve({
                    message: constants.apiResponses.USER_EXTENSION_UPDATED,
                    result: responseData.result
                });

            } catch (error) {
                return reject(error);
            }
        })
    }

    /**
   * Get profile with entity details
   * @method
   * @name profileWithEntityDetails
   * @param {Object} filterQueryObject - filtered data.
   * @returns {Object} 
   */

    static profileWithEntityDetailsV2(filterQueryObject) {
        return new Promise(async (resolve, reject) => {
            try {

                const entityTypesArray = await entityTypesHelper.list({}, {
                    name: 1,
                    immediateChildrenEntityType: 1
                });

                let enityTypeToImmediateChildrenEntityMap = {};

                if (entityTypesArray.length > 0) {
                    entityTypesArray.forEach(entityType => {
                        enityTypeToImmediateChildrenEntityMap[entityType.name] = (entityType.immediateChildrenEntityType && entityType.immediateChildrenEntityType.length > 0) ? entityType.immediateChildrenEntityType : [];
                    })
                }

                let queryObject = [
                    {
                        $match: filterQueryObject
                    },
                    {
                        $lookup: {
                            "from": "entities",
                            "localField": "roles.entities",
                            "foreignField": "_id",
                            "as": "entityDocuments"
                        }
                    },
                    {
                        $lookup: {
                            "from": "userRoles",
                            "localField": "roles.roleId",
                            "foreignField": "_id",
                            "as": "roleDocuments"
                        }
                    },
                    {
                        $project: {
                            "externalId": 1,
                            "roles": 1,
                            "roleDocuments._id": 1,
                            "roleDocuments.code": 1,
                            "roleDocuments.title": 1,
                            "entityDocuments._id": 1,
                            "entityDocuments.metaInformation.externalId": 1,
                            "entityDocuments.metaInformation.name": 1,
                            "entityDocuments.groups": 1,
                            "entityDocuments.entityType": 1,
                            "entityDocuments.entityTypeId": 1,
                            "state": 1
                        }
                    }
                ];

                let userExtensionData =
                    await database.models.userExtension.aggregate(queryObject);

                if (!userExtensionData.length > 0) {
                    return resolve({
                        message: constants.apiResponses.USER_EXTENSION_NOT_FOUND,
                        result : {}
                    });
                }

                let roleMap = {};
                let entityMapToRelatedEntities = {};

                if (userExtensionData[0].entityDocuments && userExtensionData[0].entityDocuments.length > 0) {

                    let projection = [
                        "metaInformation.externalId",
                        "metaInformation.name",
                        "metaInformation.addressLine1",
                        "metaInformation.addressLine2",
                        "metaInformation.administration",
                        "metaInformation.city",
                        "metaInformation.country",
                        "entityTypeId",
                        "entityType"
                    ];

                    for (
                        let pointerToUser = 0;
                        pointerToUser < userExtensionData[0].entityDocuments.length;
                        pointerToUser++
                    ) {
                        let currentEntities =
                            userExtensionData[0].entityDocuments[pointerToUser];

                        const relatedEntities =
                            await entitiesHelper.relatedEntities(
                                currentEntities._id,
                                currentEntities.entityTypeId,
                                currentEntities.entityType,
                                projection
                            );

                        if (relatedEntities && relatedEntities.length > 0) {
                            entityMapToRelatedEntities[currentEntities._id.toString()] = relatedEntities;
                        }
                    }
                }

                if (userExtensionData[0].roleDocuments && userExtensionData[0].roleDocuments.length > 0) {

                    userExtensionData[0].roleDocuments.forEach(role => {
                        roleMap[role._id.toString()] = role;
                    })
                    let entityMap = {};

                    userExtensionData[0].entityDocuments.forEach(entity => {
                        entity.metaInformation.childrenCount = 0;
                        entity.metaInformation.entityType = entity.entityType;
                        entity.metaInformation.entityTypeId = entity.entityTypeId;
                        entity.metaInformation.subEntityGroups = new Array;

                        Array.isArray(enityTypeToImmediateChildrenEntityMap[entity.entityType]) && enityTypeToImmediateChildrenEntityMap[entity.entityType].forEach(immediateChildrenEntityType => {
                            if (entity.groups && entity.groups[immediateChildrenEntityType]) {
                                entity.metaInformation.immediateSubEntityType = immediateChildrenEntityType;
                                entity.metaInformation.childrenCount = entity.groups[immediateChildrenEntityType].length;
                            }
                        })

                        entity.groups && Array.isArray(Object.keys(entity.groups)) && Object.keys(entity.groups).forEach(subEntityType => {
                            entity.metaInformation.subEntityGroups.push(subEntityType);
                        })

                        entity.metaInformation["relatedEntities"] = [];

                        if (entityMapToRelatedEntities[entity._id.toString()]) {
                            entity.metaInformation["relatedEntities"] =
                                entityMapToRelatedEntities[entity._id.toString()];
                        }

                        entityMap[entity._id.toString()] = entity;
                    })

                    for (let userExtensionRoleCounter = 0; userExtensionRoleCounter < userExtensionData[0].roles.length; userExtensionRoleCounter++) {

                        if (userExtensionData[0].roles[userExtensionRoleCounter].entities && userExtensionData[0].roles[userExtensionRoleCounter].entities.length > 0) {
                            for (let userExtenionRoleEntityCounter = 0; userExtenionRoleEntityCounter < userExtensionData[0].roles[userExtensionRoleCounter].entities.length; userExtenionRoleEntityCounter++) {
                                if (entityMap[userExtensionData[0].roles[userExtensionRoleCounter].entities[userExtenionRoleEntityCounter].toString()]) {
                                userExtensionData[0].roles[userExtensionRoleCounter].entities[userExtenionRoleEntityCounter] = {
                                    _id: entityMap[userExtensionData[0].roles[userExtensionRoleCounter].entities[userExtenionRoleEntityCounter].toString()]._id,
                                    ...entityMap[userExtensionData[0].roles[userExtensionRoleCounter].entities[userExtenionRoleEntityCounter].toString()].metaInformation
                                };
                              }
                            }
                            roleMap[userExtensionData[0].roles[userExtensionRoleCounter].roleId.toString()].immediateSubEntityType = (userExtensionData[0].roles[userExtensionRoleCounter].entities[0] && userExtensionData[0].roles[userExtensionRoleCounter].entities[0].entityType) ? userExtensionData[0].roles[userExtensionRoleCounter].entities[0].entityType : "";
                            roleMap[userExtensionData[0].roles[userExtensionRoleCounter].roleId.toString()].entities = userExtensionData[0].roles[userExtensionRoleCounter].entities;
                        }
                    }
                }

                return resolve({
                    message: constants.apiResponses.USER_EXTENSION_FETCHED,
                    result:
                        _.merge(_.omit(userExtensionData[0], ["roles", "entityDocuments", "roleDocuments"]),
                            { roles: _.isEmpty(roleMap) ? [] : Object.values(roleMap) })
                });

            } catch (error) {
                return reject(error);
            }
        })
    }

    /**
     * Get profile with entity details
     * @method
     * @name getEntities
     * @param {Object} userId - Logged in user id.
     * @param {String} entityType - entity type
     * @param {String} pageSize - Size of page.
     * @param {String} pageNo - Recent page no.
     * @param {String} search - search text.
     * @returns {Object} 
     */

    static getEntities(userId, entityType, pageSize, pageNo, searchText) {
        return new Promise(async (resolve, reject) => {
            try {

                let filterQueryObject = {
                    userId : userId,
                    status: constants.common.ACTIVE,
                    isDeleted: false
                }

                if (searchText !== "") {
                    filterQueryObject["$or"] = [
                        { "entityDocuments.metaInformation.name": new RegExp(searchText, 'i') },
                    ];
                }
                if (entityType) {
                    filterQueryObject['entityDocuments.entityType'] = entityType;
                }
                let queryObject = [
                    {
                        $lookup: {
                            "from": "entities",
                            "localField": "roles.entities",
                            "foreignField": "_id",
                            "as": "entityDocuments"
                        }
                    },
                    {
                        $unwind: "$entityDocuments"
                    },
                    {
                        $match: filterQueryObject
                    },
                    {
                        $facet: {
                            "totalCount": [
                                { "$count": "count" }
                            ],
                            "data": [
                                { $skip: pageSize * (pageNo - 1) },
                                { $limit: pageSize }
                            ],
                        }
                    }, {
                        $project: {
                            "data": 1,
                            "count": {
                                $arrayElemAt: ["$totalCount.count", 0]
                            }
                        }
                    }
                ];

                let userExtensionData =
                    await database.models.userExtension.aggregate(queryObject);


                let entityDocuments = [];
                if (userExtensionData[0]) {
                    userExtensionData[0].data.forEach(entity => {
                        entityDocuments.push({
                            _id: entity.entityDocuments._id,
                            name: entity.entityDocuments.metaInformation.name,
                        });
                    });
                    return resolve({ data: entityDocuments, count: userExtensionData[0].count })

                } else {
                    return resolve({
                        status: httpStatusCode['bad_request'].status,
                        message: constants.apiResponses.USER_ENTITIES_NOT_FOUND
                    });
                }
            } catch (error) {
                return reject(error);
            }
        })
    }

    /**
       * Get user entity types
       * @method
       * @name getEntityTypes
       * @param {Object} filterQueryObject - filtered data.
       * @returns {Object} 
       */

    static getEntityTypes(filterQueryObject) {
        return new Promise(async (resolve, reject) => {
            try {

                let entityTypes = [];
                let queryObject = [
                    {
                        $lookup: {
                            "from": "entities",
                            "localField": "roles.entities",
                            "foreignField": "_id",
                            "as": "entityDocuments"
                        }
                    },
                    {
                        $match: filterQueryObject
                    }
                ];

                let userExtensionData =
                    await database.models.userExtension.aggregate(queryObject);

                if (userExtensionData[0]) {

                    if (userExtensionData[0].entityDocuments && userExtensionData[0].entityDocuments.length > 0) {

                        userExtensionData[0].entityDocuments.forEach(entity => {
                            if (entity.entityType && !entityTypes.includes(entity.entityType)) {
                                entityTypes.push(entity.entityType);
                            }
                        });
                    }
                    return resolve(entityTypes)

                } else {
                    return resolve({
                        status: httpStatusCode['bad_request'].status,
                        message: constants.apiResponses.USER_ENTITY_TYPE_NOT_FOUND
                    });
                }
            } catch (error) {
                return reject(error);
            }
        })
    }

    /**
 * Update user roles in entities elastic search 
 * @method
 * @name updateUserRolesInEntitiesElasticSearch
 * @name userId - user id
 * @name userRoles - array of userRoles.
 */
static updateUserRolesInEntitiesElasticSearch(userId = "", userRoles = []) {
    return new Promise(async (resolve, reject) => {
        try {
        
        await Promise.all(userRoles.map( async role => {
            await Promise.all(role.entities.map(async entity => {

                let entityDocument = await elasticSearch.getData
                ({
                    id : entity,
                    index : process.env.ELASTICSEARCH_ENTITIES_INDEX,
                    type : "_doc"
                })
               
                if (entityDocument.statusCode == httpStatusCode.ok.status) {

                    entityDocument = entityDocument.body["_source"].data;
                    
                    if (!entityDocument.roles) {
                        entityDocument.roles = {};
                    }
                    
                    if (entityDocument.roles[role.code]) {
                        if (!entityDocument.roles[role.code].includes(userId)) {
                            entityDocument.roles[role.code].push(userId);

                            await elasticSearch.createOrUpdateDocumentInIndex
                            (
                                process.env.ELASTICSEARCH_ENTITIES_INDEX,
                                "_doc",
                                entity,
                                {data: entityDocument }
                            )
                        }
                    }
                    else {
                        entityDocument.roles[role.code] = [userId];

                        await elasticSearch.createOrUpdateDocumentInIndex
                        (
                            process.env.ELASTICSEARCH_ENTITIES_INDEX,
                            "_doc",
                            entity,
                            {data: entityDocument }
                        )
                    }
                }
            }))
        }))

        return resolve({
            success: true
        });

    }
    catch (error) {
        return reject(error);
    }
})
}


/**
   * Push user data to elastic search
   * @method
   * @name pushUserToElasticSearch
   * @name userData - created or modified user data.
   * @returns {Object} 
   */

  static pushUserToElasticSearch(userId) {
    return new Promise(async (resolve, reject) => {
        try {

         let userInformation = await this.userExtensionDocument
         (
             { userId: userId },
             [ "_id",
             "status", 
             "isDeleted",
             "deleted",
             "roles",
             "userId",
             "externalId",
             "updatedBy",
             "createdBy",
             "updatedAt",
             "createdAt"]
         )
              
         await elasticSearch.createOrUpdateDocumentInIndex(
            process.env.ELASTICSEARCH_USER_EXTENSION_INDEX,
            "_doc",
            userId,
            {
                data : userInformation
            }
        );

        return resolve({
            success : true
        });
            
    }
        catch(error) {
            return reject(error);
        }
    })

   }

    /**
   * List of programs for platform user
   * @method
   * @name programsByPlatformRoles
   * @param {String} userId - Logged in user id.
   * @param {String} role - Platform user role.
   * @returns {Array} 
   */

    static programsByPlatformRoles(userId,role) {
        return new Promise(async (resolve, reject) => {
            try {

                let projection = {
                    "platformRoles": 1
                };

                let findQuery = {
                    userId: userId,
                    status: constants.common.ACTIVE
                }

                if (role) {
                    let roleArray = role.split(',');
                    findQuery["platformRoles.code"] =  {$in: roleArray};
                }
                
                const userInformation = await this.userExtensionDocument(findQuery,projection);
       
                if (!userInformation) {
                   return resolve({
                       status: httpStatusCode.bad_request.status,
                       message: constants.apiResponses.USER_PLATFORM_ROLE_NOT_FOUND
                   })
                }

                let programsDocuments = [];
                if (userInformation.platformRoles && userInformation.platformRoles.length > 0) {
                    let programIds = [];
                    let programMapToRole = {};
                    
                    for(let platformRole=0; platformRole < userInformation.platformRoles.length; platformRole++) {

                        const currentRole = userInformation.platformRoles[platformRole];
                        if (currentRole.programs && currentRole.programs.length > 0) {

                            if (role) {
                                let roleArray = role.split(',');
                                
                                if (!roleArray.includes(currentRole.code)) {
                                    continue;
                                }
                            }

                            for( let program = 0; program < currentRole.programs.length;program++) {
                                programMapToRole[currentRole.programs[program].toString()] = currentRole.code;
                                programIds.push(currentRole.programs[program]);
                            }

                        }
                    }

                    const programData = await programsHelper.programDocuments({
                        _id: {$in: programIds},
                        status: constants.common.ACTIVE 
                     },["externalId","name","description"]);

                     if (programData.length > 0) {
                         programsDocuments = programData.map(program => {
                             if (programMapToRole[program._id.toString()]) {
                                 program["role"] = programMapToRole[program._id.toString()];
                             }

                             return program;
                         });
                     }
                }

                return resolve({
                   message: constants.apiResponses.PLATFORM_USER_PROGRAMS,
                   data: programsDocuments
                });
            } catch(error) {
                return reject(error);
            }
        })
    }

     /**
   * List of solutions by platform user program
   * @method
   * @name solutions
   * @param {String} userId - Logged in user id.
   * @param {String} programId - Program id.
   * @param {String} role - role.
   * @returns {Array} 
   */

    static solutions(userId,programId,role) {
        return new Promise(async (resolve, reject) => {
            try {
                
                const userInformation = await this.userExtensionDocument
                (
                    { 
                        "userId": userId,
                        "status": constants.common.ACTIVE,
                        "$and": [
                            {"platformRoles": {$elemMatch: {"code": role,"programs": ObjectId(programId)}}}
                        ]
                   },
                   {
                       _id: 1
                   }
                );
       
               if (!userInformation) {
                   return resolve({
                       status: httpStatusCode.bad_request.status,
                       message: constants.apiResponses.USER_PLATFORM_ROLE_NOT_FOUND
                   })
               }
       
                const programDocuments = await programsHelper.programDocuments({
                   _id: programId,
                   status: constants.common.ACTIVE 
                },["components"]);

                if (!programDocuments.length > 0) {
                    return resolve({
                        status: httpStatusCode.bad_request.status,
                        message: constants.apiResponses.PROGRAM_NOT_FOUND
                    })
                }

                const solutionDocuments = await solutionsHelper.solutionDocuments({
                    _id: {$in: programDocuments[0].components},
                    programId: programId,
                    isReusable: false
                },[
                    "externalId",
                    "description",
                    "name",
                    "type",
                    "subType",
                    "isRubricDriven"
                ]);
       
                return resolve({
                   message: constants.apiResponses.SOLUTIONS_LIST,
                   data: solutionDocuments
                });
            } catch(error) {
                return reject(error);
            }
        })
    }
};




