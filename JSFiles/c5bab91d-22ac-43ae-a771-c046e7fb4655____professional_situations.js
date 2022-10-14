const sql = require('../utilities/sql');
const time = require('../utilities/time');
const responses = require('../utilities/responses');
const permissions = require('../utilities/permissions');
const notifications = require('../utilities/notifications');

/**
 * For reading professional situations data
 */
var actionGetProfessionalSituations = function (options) {
    let { req, res, next } = options;
    let personID = req.params.personID;
    var querySQL = '';
    var places = [];
    querySQL = querySQL + 'SELECT jobs.*, categories_situations.category_id, categories_situations.situation_id,'
                        + ' categories.name_en AS category_name_en,'
                        + ' situations.name_en AS situation_name_en,'
                        + ' situations.requires_unit_contract, situations.requires_fellowship'
                        + ' FROM jobs'
                        + ' LEFT JOIN categories_situations ON categories_situations.id = jobs.category_situation_id'
                        + ' LEFT JOIN categories ON categories.id = categories_situations.category_id'
                        + ' LEFT JOIN situations ON situations.id = categories_situations.situation_id'
                        + ' WHERE jobs.person_id = ?;';
    places.push(personID)
    return sql.getSQLOperationResult(req, res, querySQL, places,
        (resQuery, options) => {
            options.jobs = resQuery;
            getJobsFellowships(options, 0)
        },
        options);
};
var getJobsFellowships = function (options, i) {
    let { req, res, next, jobs } = options;
    if (jobs.length > 0) {
        var querySQL = '';
        var places = [];
        querySQL = querySQL + 'SELECT jobs_fellowships.fellowship_id,'
                            + ' fellowships.fellowship_type_id, fellowship_types.name AS fellowship_name, fellowship_types.acronym AS fellowship_acronym,'
                            + ' fellowships.reference,'
                            + ' fellowships.start, fellowships.end, fellowships.maximum_extension'
                            + ' FROM jobs_fellowships'
                            + ' JOIN fellowships ON fellowships.id = jobs_fellowships.fellowship_id'
                            + ' LEFT JOIN fellowship_types ON fellowship_types.id = fellowships.fellowship_type_id'
                            + ' WHERE jobs_fellowships.job_id = ?;';
        places.push(jobs[i].id)
        return sql.getSQLOperationResult(req, res, querySQL, places,
            (resQuery, options) => {
                options.jobs[i].fellowships = resQuery;
                getJobsFellowshipsManagementEntities(options, i, 0)
            },
            options);
    } else {
        responses.sendJSONResponse(res, 200,
            {
                "status": "success", "statusCode": 200, "count": 0,
                "result": []
            }
        );
        return;
    }
};
var getJobsFellowshipsManagementEntities = function (options, i, j) {
    let { req, res, next, jobs } = options;
    if (jobs[i].fellowships.length > 0) {
        var querySQL = '';
        var places = [];
        querySQL = querySQL + 'SELECT fellowships_management_entities.management_entity_id,'
                            + ' management_entities.official_name AS management_entity_official_name, management_entities.short_name AS management_entity_short_name'
                            + ' FROM fellowships'
                            + ' JOIN fellowships_management_entities ON fellowships_management_entities.fellowship_id = fellowships.id'
                            + ' JOIN management_entities ON management_entities.id = fellowships_management_entities.management_entity_id'
                            + ' WHERE fellowships.id = ?;';
        places.push(jobs[i].fellowships[j].fellowship_id)
        return sql.getSQLOperationResult(req, res, querySQL, places,
            (resQuery, options) => {
                options.jobs[i].fellowships[j].management_entities = resQuery;
                getJobsFellowshipsFundingAgencies(options, i, j);
            },
            options);
    } else {
        if (i + 1 < jobs.length) {
            return getJobsFellowships(options, i + 1);
        } else {
            return getJobsContracts(options, 0);
        }
    }
};
var getJobsFellowshipsFundingAgencies = function (options, i, j) {
    let { req, res, next, jobs } = options;
    if (jobs[i].fellowships.length > 0) {
        var querySQL = '';
        var places = [];
        querySQL = querySQL + 'SELECT fellowships_funding_agencies.funding_agency_id,'
                            + ' funding_agencies.official_name AS funding_agency_official_name, funding_agencies.short_name AS funding_agency_short_name'
                            + ' FROM fellowships'
                            + ' JOIN fellowships_funding_agencies ON fellowships_funding_agencies.fellowship_id = fellowships.id'
                            + ' JOIN funding_agencies ON funding_agencies.id = fellowships_funding_agencies.funding_agency_id'
                            + ' WHERE fellowships.id = ?;';
        places.push(jobs[i].fellowships[j].fellowship_id)
        if (j + 1 < jobs[i].fellowships.length) {
            return sql.getSQLOperationResult(req, res, querySQL, places,
                (resQuery, options) => {
                    options.jobs[i].fellowships[j].funding_agencies = resQuery;
                    return getJobsFellowshipsManagementEntities(options, i, j + 1);
                },
                options);
        } else if (i + 1 < jobs.length) {
            return sql.getSQLOperationResult(req, res, querySQL, places,
                (resQuery, options) => {
                    options.jobs[i].fellowships[j].funding_agencies = resQuery;
                    return getJobsFellowships(options, i + 1);
                },
                options);
        } else {
            return sql.getSQLOperationResult(req, res, querySQL, places,
                (resQuery, options) => {
                    options.jobs[i].fellowships[j].funding_agencies = resQuery;
                    return getJobsContracts(options, 0);
                },
                options);
        }
    } else {
        if (i + 1 < jobs.length) {
            return getJobsFellowships(options, i + 1);
        } else {
            return getJobsContracts(options, 0);
        }
    }
};
var getJobsContracts = function (options, i) {
    let { req, res, next, jobs } = options;
    if (jobs.length > 0) {
        var querySQL = '';
        var places = [];
        querySQL = querySQL + 'SELECT jobs_contracts.contract_id,'
                            + ' contracts.reference,'
                            + ' contracts.start, contracts.end, contracts.maximum_extension'
                            + ' FROM jobs_contracts'
                            + ' JOIN contracts ON contracts.id = jobs_contracts.contract_id'
                            + ' WHERE jobs_contracts.job_id = ?;';
        places.push(jobs[i].id)
        return sql.getSQLOperationResult(req, res, querySQL, places,
            (resQuery, options) => {
                options.jobs[i].contracts = resQuery;
                getJobsContractsManagementEntities(options, i, 0);
            },
            options);
    } else {
        responses.sendJSONResponse(res, 200,
            {
                "status": "success", "statusCode": 200, "count": 0,
                "result": []
            }
        );
        return;
    }

};
var getJobsContractsManagementEntities = function (options, i, j) {
    let { req, res, next, jobs } = options;
    if (jobs[i].contracts.length > 0) {
        var querySQL = '';
        var places = [];
        querySQL = querySQL + 'SELECT contracts_management_entities.management_entity_id,'
                            + ' management_entities.official_name AS management_entity_official_name, management_entities.short_name AS management_entity_short_name'
                            + ' FROM contracts'
                            + ' JOIN contracts_management_entities ON contracts_management_entities.contract_id = contracts.id'
                            + ' JOIN management_entities ON management_entities.id = contracts_management_entities.management_entity_id'
                            + ' WHERE contracts.id = ?;';
        places.push(jobs[i].contracts[j].contract_id);
        return sql.getSQLOperationResult(req, res, querySQL, places,
            (resQuery, options) => {
                options.jobs[i].contracts[j].management_entities = resQuery;
                getJobsContractsFundingAgencies(options, i, j);
            },
            options);
    } else {
        if (i + 1 < jobs.length) {
            return getJobsContracts(options, i + 1);
        } else {
            responses.sendJSONResponseOptions({
                response: res,
                status: 200,
                message: {
                    "status": "success", "statusCode": 200, "count": jobs.length,
                    "result": options.jobs
                }
            });
            return;
        }
    }
};
var getJobsContractsFundingAgencies = function (options, i, j) {
    let { req, res, next, jobs } = options;
    if (jobs[i].contracts.length > 0) {
        var querySQL = '';
        var places = [];
        querySQL = querySQL + 'SELECT contracts_funding_agencies.funding_agency_id,'
                            + ' funding_agencies.official_name AS funding_agency_official_name, funding_agencies.short_name AS funding_agency_short_name'
                            + ' FROM contracts'
                            + ' JOIN contracts_funding_agencies ON contracts_funding_agencies.contract_id = contracts.id'
                            + ' JOIN funding_agencies ON funding_agencies.id = contracts_funding_agencies.funding_agency_id'
                            + ' WHERE contracts.id = ?;';
        places.push(jobs[i].contracts[j].contract_id)
        if (j + 1 < jobs[i].contracts.length) {
            return sql.getSQLOperationResult(req, res, querySQL, places,
                (resQuery, options) => {
                    options.jobs[i].contracts[j].funding_agencies = resQuery;
                    getJobsContractsManagementEntities(options, i, j + 1)
                },
                options);
        } else if (i + 1 < jobs.length) {
            return sql.getSQLOperationResult(req, res, querySQL, places,
                (resQuery, options) => {
                    options.jobs[i].contracts[j].funding_agencies = resQuery;
                    getJobsContracts(options, i + 1)
                },
                options);
        } else {
            return sql.getSQLOperationResult(req, res, querySQL, places,
                (resQuery, options) => {
                    options.jobs[i].contracts[j].funding_agencies = resQuery;
                    responses.sendJSONResponseOptions({
                        response: res,
                        status: 200,
                        message: {
                            "status": "success", "statusCode": 200, "count": jobs.length,
                            "result": options.jobs
                        }
                    });
                    return;
                },
                options);
        }
    } else {
        if (i + 1 < jobs.length) {
            return getJobsContracts(options, i + 1);
        } else {
            responses.sendJSONResponseOptions({
                response: res,
                status: 200,
                message: {
                    "status": "success", "statusCode": 200, "count": jobs.length,
                    "result": options.jobs
                }
            });
            return;
        }
    }
};
module.exports.getProfessionalSituations = function (req, res, next) {
    permissions.checkPermissions(
        (options) => { actionGetProfessionalSituations(options) },
        { req, res, next }
    );
};

/**
 * For changing professional situation data
 */
var actionCreateProfessionalSituations = function (options) {
    let { req, res, next} = options;
    let personID = req.params.personID;
    let data = req.body.data;
    if (data.valid_from === '') data.valid_from = null;
    if (data.valid_until === '') data.valid_until = null;
    if (data.dedication === '') {
        data.dedication = null;
    }
    var querySQL = '';
    var places = [];
    querySQL = querySQL + 'INSERT INTO jobs'
        + ' (person_id, organization, dedication, valid_from, valid_until)'
        + ' VALUES (?,?,?,?,?);';
    places.push(personID,
        data.organization,
        data.dedication,
        data.valid_from,
        data.valid_until
        );
    return sql.getSQLOperationResult(req, res, querySQL, places,
        (resQuery, options) => {
            options.jobID = resQuery.insertId;
            options.action = 'create';
            return getCategorySituationID(options);
        },
        options);
};
var actionDeleteProfessionalSituations = function (options) {
    // NOTE: will only work if fellowship/contracts are deleted first
    let { req, res, next } = options;
    let jobID = req.params.jobID;
    var querySQL = '';
    var places = [];
    querySQL = querySQL + 'DELETE FROM jobs WHERE id = ?;';
    places.push(jobID)
    return sql.makeSQLOperation(req, res, querySQL, places);
};
var actionUpdateProfessionalSituations = function (options) {
    let { req, res, next } = options;
    let data = req.body.data;
    if (data.valid_from === '') data.valid_from = null;
    if (data.valid_until === '') data.valid_until = null;
    if (data.dedication === '') {
        data.dedication = null;
    }
    var querySQL = '';
    var places = [];
    // category_situation_id will be updated once categories_situations is queried
    querySQL = querySQL + 'UPDATE jobs'
                        + ' SET organization = ?,'
                        + ' dedication = ?,'
                        + ' valid_from = ?,'
                        + ' valid_until = ?'
                        + ' WHERE id = ?;';
    places.push(data.organization,
        data.dedication,
        data.valid_from,
        data.valid_until,
        data.id)
    return sql.makeSQLOperation(req, res, querySQL, places,
        (options) => {
            getCategorySituationID(options)
        },
        options);
};

var getCategorySituationID = function (options) {
    let { req, res, next } = options;
    let data = req.body.data;
    var querySQL = '';
    var places = [];
    querySQL = querySQL + 'SELECT * FROM categories_situations'
                        + ' WHERE category_id = ? AND situation_id = ?;';
    places.push(data.category_id, data.situation_id)
    return sql.getSQLOperationResult(req, res, querySQL, places,
        (resQuery, options) => {
            if (resQuery.length === 1) {
                options.new_category_situation_id = resQuery[0].id;
                return updateJobCategorySituationID(options);
            } else {
                // if no row or if more that 1 row
                responses.sendJSONResponseOptions({
                    response: res,
                    status: 400,
                    message: {
                        "status": "error", "statusCode": 400,
                        "message": "An error occurred: situation and category IDs are not compatible",
                    }
                });
                return;
            }
        },
        options);
};
var updateJobCategorySituationID = function (options) {
    let { req, res, next, new_category_situation_id } = options;
    let data = req.body.data;
    let personID = req.params.personID;
    var querySQL = '';
    var places = [];
    querySQL = querySQL + 'UPDATE jobs'
                        + ' SET category_situation_id = ?'
                        + ' WHERE id = ?;';
    let notificationConfig
    if (options.action === 'create') {
        places.push(new_category_situation_id,
            options.jobID);
        return sql.makeSQLOperation(req, res, querySQL, places,
            (options) => {
                notificationConfig = { entityID: personID };
                notifications.notifyWebsiteAPI(notificationConfig);
                responses.sendJSONResponseOptions({
                    response: res,
                    status: 200,
                    message: {
                        "status": "success", "statusCode": 200,
                        "result": { jobID: options.jobID },
                    }
                });
                return;
             },
            options);
    } else {
        places.push(new_category_situation_id,
            data.id);
        return sql.makeSQLOperation(req, res, querySQL, places,
            (options) => {
                notificationConfig = { entityID: personID };
                notifications.notifyWebsiteAPI(notificationConfig)
                return responses.sendJSONResponseOptions(options)
            },
            {
                response: res,
                status: 200,
                message: {
                    "status": "success", "statusCode": 200, "count": 0,
                    "result": "Updated job data."
                }
            });
    }
};


var actionCreateProfessionalSituationsFellowships = function (options) {
    let { req, res, next} = options;
    let data = req.body.data;
    if (data.start === '') data.start = null;
    if (data.end === '') data.end = null;
    if (data.maximum_extension === '') data.maximum_extension = null;
    var querySQL = '';
    var places = [];
    querySQL = querySQL + 'INSERT INTO fellowships'
        + ' (fellowship_type_id, reference, start, end, maximum_extension)'
        + ' VALUES (?,?,?,?,?);';
    places.push(data.fellowship_type_id,
        data.reference,
        data.start,
        data.end,
        data.maximum_extension
        );
    return sql.getSQLOperationResult(req, res, querySQL, places,
        (resQuery, options) => {
            options.fellowship_id = resQuery.insertId;
            return insertFellowshipJobRelationship(options);
        },
        options);
};
var actionDeleteProfessionalSituationsFellowships = function (options) {
    let { req, res, next } = options;
    let fellowshipID = req.params.fellowshipID;
    let personID = req.params.personID;
    var querySQL = '';
    var places = [];
    querySQL = querySQL + 'DELETE FROM fellowships WHERE id = ?;';
    places.push(fellowshipID)
    return sql.makeSQLOperation(req, res, querySQL, places,
        (options) => {
            let notificationConfig = { entityID: personID };
            notifications.notifyWebsiteAPI(notificationConfig);
            return responses.sendJSONResponseOptions(options);
        },
        {
            response: res,
            status: 200,
            message: {
                "status": "success", "statusCode": 200, "count": 0,
                "result": "OK - Changed people job"
            }
        }
    );
};
var actionUpdateProfessionalSituationsFellowships = function (options) {
    let { req, res, next } = options;
    let fellowshipID = req.params.fellowshipID;
    let data = req.body.data;
    if (data.start === '') data.start = null;
    if (data.end === '') data.end = null;
    if (data.maximum_extension === '') data.maximum_extension = null;
    var querySQL = '';
    var places = [];
    // category_situation_id will be updated once categories_situations is queried
    querySQL = querySQL + 'UPDATE fellowships'
                        + ' SET fellowship_type_id = ?,'
                        + ' reference = ?,'
                        + ' start = ?,'
                        + ' end = ?,'
                        + ' maximum_extension = ?'
                        + ' WHERE id = ?;';
    places.push(data.fellowship_type_id,
        data.reference,
        data.start,
        data.end,
        data.maximum_extension,
        fellowshipID)
    return sql.makeSQLOperation(req, res, querySQL, places,
        (options) => {
            // for funding agencies/mngmt entities,
            // some associations could be updated, others deleted or created
            // so the easiest way to 'update' is to delete all previous and add anew
            options.actionFellowship = 'update';
            options.fellowship_id = fellowshipID;
            deleteFellowshipFundingAgencies(options)
        },
        options);
};

var insertFellowshipJobRelationship = function (options) {
    let { req, res, next, fellowship_id } = options;
    let jobID = req.params.jobID;
    let personID = req.params.personID;
    let data = req.body.data;
    var querySQL = '';
    var places = [];
    querySQL = querySQL + 'INSERT INTO jobs_fellowships'
                        + ' (job_id, fellowship_id)'
                        + ' VALUES (?, ?);';
    places.push(jobID, fellowship_id);
    return sql.makeSQLOperation(req, res, querySQL, places,
        (options) => {
            if (data.funding_agencies!== undefined && data.funding_agencies.length > 0) {
                return insertFellowshipFundingAgencyRelationship(options, 0)
            } else if (data.management_entities !== undefined && data.management_entities.length > 0) {
                return insertFellowshipManagementEntityRelationship(options, 0)
            } else {
                let notificationConfig = { entityID: personID };
                notifications.notifyWebsiteAPI(notificationConfig);
                responses.sendJSONResponseOptions({
                    response: res,
                    status: 200,
                    message: {
                        "status": "success", "statusCode": 200,
                    }
                });
                return;
            }
        },
        options);
};
var insertFellowshipFundingAgencyRelationship = function (options, i) {
    let { req, res, next, fellowship_id } = options;
    let personID = req.params.personID;
    let data = req.body.data;
    var querySQL = '';
    var places = [];
    querySQL = querySQL + 'INSERT INTO fellowships_funding_agencies'
                        + ' (fellowship_id, funding_agency_id)'
                        + ' VALUES (?, ?);';
    if (typeof data.funding_agencies[i] === 'number') {
        places.push(fellowship_id, data.funding_agencies[i]);
    } else {
        places.push(fellowship_id, data.funding_agencies[i].funding_agency_id);
    }
    return sql.makeSQLOperation(req, res, querySQL, places,
        (options) => {
            if (i + 1 < data.funding_agencies.length) {
                return insertFellowshipFundingAgencyRelationship(options, i + 1);
            } else if (data.management_entities !== undefined && data.management_entities.length > 0) {
                return insertFellowshipManagementEntityRelationship(options, 0);
            } else {


                let notificationConfig = { entityID: personID };
                notifications.notifyWebsiteAPI(notificationConfig);
                responses.sendJSONResponseOptions({
                    response: res,
                    status: 200,
                    message: {
                        "status": "success", "statusCode": 200,
                    }
                });
                return;
            }
        },
        options);
};
var insertFellowshipManagementEntityRelationship = function (options, i) {
    let { req, res, next, fellowship_id } = options;
    let personID = req.params.personID;
    let data = req.body.data;
    var querySQL = '';
    var places = [];
    querySQL = querySQL + 'INSERT INTO fellowships_management_entities'
                        + ' (fellowship_id, management_entity_id)'
                        + ' VALUES (?, ?);';
    if (typeof data.management_entities[i] === 'number') {
        places.push(fellowship_id, data.management_entities[i]);
    } else {
        places.push(fellowship_id, data.management_entities[i].management_entity_id);
    }
    return sql.makeSQLOperation(req, res, querySQL, places,
        (options) => {
            if (i + 1 < data.management_entities.length) {
                return insertFellowshipManagementEntityRelationship(options, i + 1);
            } else {
                let notificationConfig = { entityID: personID };
                notifications.notifyWebsiteAPI(notificationConfig);
                responses.sendJSONResponseOptions({
                    response: res,
                    status: 200,
                    message: {
                        "status": "success", "statusCode": 200,
                    }
                });
                return;
            }
        },
        options);
};

var deleteFellowshipFundingAgencies = function (options) {
    let { req, res, next } = options;
    let fellowshipID = req.params.fellowshipID;
    var querySQL = '';
    var places = [];
    querySQL = querySQL + 'DELETE FROM fellowships_funding_agencies WHERE fellowship_id = ?;';
    places.push(fellowshipID)
    return sql.makeSQLOperation(req, res, querySQL, places,
        (options) => {
            return deleteFellowshipManagementEntities(options);
        },
        options
    );
};
var deleteFellowshipManagementEntities = function (options) {
    let { req, res, next } = options;
    let fellowshipID = req.params.fellowshipID;
    let personID = req.params.personID;
    let data;
    if (req.body !== undefined) {
        data = req.body.data;
    }
    var querySQL = '';
    var places = [];
    querySQL = querySQL + 'DELETE FROM fellowships_management_entities WHERE fellowship_id = ?;';
    places.push(fellowshipID)
    return sql.makeSQLOperation(req, res, querySQL, places,
        (options) => {
            if (options.actionFellowship === 'update' && data !== undefined) {
                if (data.funding_agencies !== undefined && data.funding_agencies.length > 0) {
                    return insertFellowshipFundingAgencyRelationship(options, 0)
                } else if (data.management_entities !== undefined && data.management_entities.length > 0) {
                    return insertFellowshipManagementEntityRelationship(options, 0)
                } else {
                    let notificationConfig = { entityID: personID };
                    notifications.notifyWebsiteAPI(notificationConfig);
                    responses.sendJSONResponseOptions({
                        response: res,
                        status: 200,
                        message: {
                            "status": "success", "statusCode": 200,
                        }
                    });
                    return;
                }
            } else {
                return deleteFellowshipJobRelationship(options);
            }
        },
        options
    );
};
var deleteFellowshipJobRelationship = function (options) {
    let { req, res, next } = options;
    let fellowshipID = req.params.fellowshipID;
    var querySQL = '';
    var places = [];
    querySQL = querySQL + 'DELETE FROM jobs_fellowships WHERE fellowship_id = ?;';
    places.push(fellowshipID)
    return sql.makeSQLOperation(req, res, querySQL, places,
        (options) => {
            return actionDeleteProfessionalSituationsFellowships(options);
        },
        options
    );
};



var actionCreateProfessionalSituationsContracts = function (options) {
    let { req, res, next} = options;
    let data = req.body.data;
    if (data.start === '') data.start = null;
    if (data.end === '') data.end = null;
    if (data.maximum_extension === '') data.maximum_extension = null;
    var querySQL = '';
    var places = [];
    querySQL = querySQL + 'INSERT INTO contracts'
        + ' (reference, start, end, maximum_extension)'
        + ' VALUES (?,?,?,?);';
    places.push(
        data.reference,
        data.start,
        data.end,
        data.maximum_extension
        );
    return sql.getSQLOperationResult(req, res, querySQL, places,
        (resQuery, options) => {
            options.contract_id = resQuery.insertId;
            return insertContractJobRelationship(options);
        },
        options);
};
var actionDeleteProfessionalSituationsContracts = function (options) {
    let { req, res, next } = options;
    let contractID = req.params.contractID;
    var querySQL = '';
    var places = [];
    querySQL = querySQL + 'DELETE FROM contracts WHERE id = ?;';
    places.push(contractID)
    return sql.makeSQLOperation(req, res, querySQL, places);
};
var actionUpdateProfessionalSituationsContracts = function (options) {
    let { req, res, next } = options;
    let contractID = req.params.contractID;
    let data = req.body.data;
    if (data.start === '') data.start = null;
    if (data.end === '') data.end = null;
    if (data.maximum_extension === '') data.maximum_extension = null;
    var querySQL = '';
    var places = [];
    // category_situation_id will be updated once categories_situations is queried
    querySQL = querySQL + 'UPDATE contracts'
                        + ' SET reference = ?,'
                        + ' start = ?,'
                        + ' end = ?,'
                        + ' maximum_extension = ?'
                        + ' WHERE id = ?;';
    places.push(
        data.reference,
        data.start,
        data.end,
        data.maximum_extension,
        contractID)
    return sql.makeSQLOperation(req, res, querySQL, places,
        (options) => {
            // for funding agencies/mngmt entities,
            // some associations could be updated, others deleted or created
            // so the easiest way to 'update' is to delete all previous and add anew
            options.actionContract = 'update';
            options.contract_id = contractID;
            deleteContractFundingAgencies(options)
        },
        options);
};

var insertContractJobRelationship = function (options) {
    let { req, res, next, contract_id } = options;
    let jobID = req.params.jobID;
    let personID = req.params.personID;
    let data = req.body.data;
    var querySQL = '';
    var places = [];
    querySQL = querySQL + 'INSERT INTO jobs_contracts'
                        + ' (job_id, contract_id)'
                        + ' VALUES (?, ?);';
    places.push(jobID, contract_id);
    return sql.makeSQLOperation(req, res, querySQL, places,
        (options) => {
            if (data.funding_agencies !== undefined && data.funding_agencies.length > 0) {
                return insertContractFundingAgencyRelationship(options, 0)
            } else if (data.management_entities !== undefined && data.management_entities.length > 0) {
                return insertContractManagementEntityRelationship(options, 0)
            } else {
                let notificationConfig = { entityID: personID };
                notifications.notifyWebsiteAPI(notificationConfig);
                responses.sendJSONResponseOptions({
                    response: res,
                    status: 200,
                    message: {
                        "status": "success", "statusCode": 200,
                    }
                });
                return;
            }
        },
        options);
};
var insertContractFundingAgencyRelationship = function (options, i) {
    let { req, res, next, contract_id } = options;
    let personID = req.params.personID;
    let data = req.body.data;
    var querySQL = '';
    var places = [];
    querySQL = querySQL + 'INSERT INTO contracts_funding_agencies'
                        + ' (contract_id, funding_agency_id)'
                        + ' VALUES (?, ?);';
    if (typeof data.funding_agencies[i] === 'number') {
        places.push(contract_id, data.funding_agencies[i]);
    } else {
        places.push(contract_id, data.funding_agencies[i].funding_agency_id);
    }
    return sql.makeSQLOperation(req, res, querySQL, places,
        (options) => {
            if (i + 1 < data.funding_agencies.length) {
                return insertContractFundingAgencyRelationship(options, i + 1);
            } else if (data.management_entities !== undefined && data.management_entities.length > 0) {
                return insertContractManagementEntityRelationship(options, 0);
            } else {
                let notificationConfig = { entityID: personID };
                notifications.notifyWebsiteAPI(notificationConfig);
                responses.sendJSONResponseOptions({
                    response: res,
                    status: 200,
                    message: {
                        "status": "success", "statusCode": 200,
                    }
                });
                return;
            }
        },
        options);
};
var insertContractManagementEntityRelationship = function (options, i) {
    let { req, res, next, contract_id } = options;
    let personID = req.params.personID;
    let data = req.body.data;
    var querySQL = '';
    var places = [];
    querySQL = querySQL + 'INSERT INTO contracts_management_entities'
                        + ' (contract_id, management_entity_id)'
                        + ' VALUES (?, ?);';
    if (typeof data.management_entities[i] === 'number') {
        places.push(contract_id, data.management_entities[i]);
    } else {
        places.push(contract_id, data.management_entities[i].management_entity_id);
    }
    return sql.makeSQLOperation(req, res, querySQL, places,
        (options) => {
            if (i + 1 < data.management_entities.length) {
                return insertContractManagementEntityRelationship(options, i + 1);
            } else {
                let notificationConfig = { entityID: personID };
                notifications.notifyWebsiteAPI(notificationConfig);
                responses.sendJSONResponseOptions({
                    response: res,
                    status: 200,
                    message: {
                        "status": "success", "statusCode": 200,
                    }
                });
                return;
            }
        },
        options);
};

var deleteContractFundingAgencies = function (options) {
    let { req, res, next } = options;
    let contractID = req.params.contractID;
    var querySQL = '';
    var places = [];
    querySQL = querySQL + 'DELETE FROM contracts_funding_agencies WHERE contract_id = ?;';
    places.push(contractID)
    return sql.makeSQLOperation(req, res, querySQL, places,
        (options) => {
            return deleteContractManagementEntities(options);
        },
        options
    );
};
var deleteContractManagementEntities = function (options) {
    let { req, res, next } = options;
    let personID = req.params.personID;
    let contractID = req.params.contractID;
    let data;
    if (req.body !== undefined) {
        data = req.body.data;
    }
    var querySQL = '';
    var places = [];
    querySQL = querySQL + 'DELETE FROM contracts_management_entities WHERE contract_id = ?;';
    places.push(contractID)
    return sql.makeSQLOperation(req, res, querySQL, places,
        (options) => {
            if (options.actionContract === 'update' && data !== undefined) {
                if (data.funding_agencies !== undefined && data.funding_agencies.length > 0) {
                    return insertContractFundingAgencyRelationship(options, 0)
                } else if (data.management_entities !== undefined && data.management_entities.length > 0) {
                    return insertContractManagementEntityRelationship(options, 0)
                } else {
                    let notificationConfig = { entityID: personID };
                    notifications.notifyWebsiteAPI(notificationConfig);
                    responses.sendJSONResponseOptions({
                        response: res,
                        status: 200,
                        message: {
                            "status": "success", "statusCode": 200,
                        }
                    });
                    return;
                }
            } else {
                return deleteContractJobRelationship(options);
            }
        },
        options
    );
};
var deleteContractJobRelationship = function (options) {
    let { req, res, next } = options;
    let contractID = req.params.contractID;
    var querySQL = '';
    var places = [];
    querySQL = querySQL + 'DELETE FROM jobs_contracts WHERE contract_id = ?;';
    places.push(contractID)
    return sql.makeSQLOperation(req, res, querySQL, places,
        (options) => {
            return actionDeleteProfessionalSituationsContracts(options);
        },
        options
    );
};

module.exports.updateProfessionalSituations = function (req, res, next) {
    permissions.checkPermissions(
        (options) => { actionUpdateProfessionalSituations(options) },
        { req, res, next }
    );
};
module.exports.deleteProfessionalSituations = function (req, res, next) {
    // we start by deleting first supervisors, then external supervisors
    // only then we delete the degree
    permissions.checkPermissions(
        (options) => { actionDeleteProfessionalSituations(options) },
        { req, res, next }
    );
};
module.exports.createProfessionalSituations = function (req, res, next) {
    permissions.checkPermissions(
        (options) => { actionCreateProfessionalSituations(options) },
        { req, res, next }
    );
};
module.exports.updateProfessionalSituationsFellowships = function (req, res, next) {
    permissions.checkPermissions(
        (options) => { actionUpdateProfessionalSituationsFellowships(options) },
        { req, res, next }
    );
};
module.exports.deleteProfessionalSituationsFellowships = function (req, res, next) {
    // first we must delete association with funding agencies, then management entities
    permissions.checkPermissions(
        (options) => { deleteFellowshipFundingAgencies(options) },
        { req, res, next }
    );
};
module.exports.createProfessionalSituationsFellowships = function (req, res, next) {
    permissions.checkPermissions(
        (options) => { actionCreateProfessionalSituationsFellowships(options) },
        { req, res, next }
    );
};
module.exports.updateProfessionalSituationsContracts = function (req, res, next) {
    permissions.checkPermissions(
        (options) => { actionUpdateProfessionalSituationsContracts(options) },
        { req, res, next }
    );
};
module.exports.deleteProfessionalSituationsContracts = function (req, res, next) {
    // first we must delete association with funding agencies, then management entities
    permissions.checkPermissions(
        (options) => { deleteContractFundingAgencies(options) },
        { req, res, next }
    );
};
module.exports.createProfessionalSituationsContracts = function (req, res, next) {
    permissions.checkPermissions(
        (options) => { actionCreateProfessionalSituationsContracts(options) },
        { req, res, next }
    );
};