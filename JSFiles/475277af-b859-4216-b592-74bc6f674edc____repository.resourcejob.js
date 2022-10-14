(function () {
    'use strict';
    var serviceId = 'repository.resourcejob';

    angular.module('app').factory(serviceId,
        ['$routeParams', 'common', 'authService', 'model', 'repository.abstract', RepositoryResourceJob]);

    function RepositoryResourceJob($routeParams, common, authService, model, AbstractRepository) {
        var entityName = model.entityNames.person;
        var entityNames = model.entityNames;
        var EntityQuery = breeze.EntityQuery;
        var filterValue = authService.authentication.userName;
        var Predicate = breeze.Predicate;
        var $q = common.$q;

        function Ctor(mgr) {
            this.serviceId = serviceId;
            this.entityName = entityName;
            this.manager = mgr;
            // Exposed data access functions
            this.getById = getById;
            this.getJobById = getJobById;
            this.getJobTrackerById = getJobTrackerById;
            this.getJobBatchTrackerById = getJobBatchTrackerById;
            this.getDeliveryNoteId = getDeliveryNoteId;

            this.getJobBatchTrackerByTrackerId = getJobBatchTrackerByTrackerId;
            this.getCardIssuanceById = getCardIssuanceById;
            this.getCardIssuanceLogById = getCardIssuanceLogById;
            this.getJobSplitCEAnalysisById = getJobSplitCEAnalysisById;
            this.getJobSplitPrintCEAnalysisById = getJobSplitPrintCEAnalysisById;
            this.getJobSplitQCAnalysisById = getJobSplitQCAnalysisById;
            this.getCardWasteAnalysisById = getCardWasteAnalysisById;
            this.getPrintWasteAnalysisById = getPrintWasteAnalysisById;

            this.getServerJobQueues = getServerJobQueues;
            this.getServerJobQueues2 = getServerJobQueues2;
            this.getDeletedServerJobQueues = getDeletedServerJobQueues;
            this.getRecentServerJobQueues = getRecentServerJobQueues;
            this.getRecentServerJobQueues2 = getRecentServerJobQueues2;

            this.getServerJobCount = getServerJobCount;
            this.getServerJobFilteredCount = getServerJobFilteredCount;

            this.getJobTrackers = getJobTrackers;
            this.getAllJobTrackers = getAllJobTrackers;
            this.getJobTrackerCount = getJobTrackerCount;
            this.getJobTrackerFilteredCount = getJobTrackerFilteredCount;

            this.getJobs = getJobs;
            this.getNonPersoJobs = getNonPersoJobs;
            this.getJobCount = getJobCount;
            this.getJobFilteredCount = getJobFilteredCount;

            this.getJobSplits = getJobSplits;


            this.getByServerJobQueueId = getByServerJobQueueId;
            this.getByNonPersoJobId = getByNonPersoJobId;

            this.getJobTrackerByCEAnalysisId = getJobTrackerByCEAnalysisId;
            this.getJobTrackerByJobId = getJobTrackerByJobId;
            this.getJobVariantByJobId = getJobVariantByJobId;
            this.getJobVariantByJobTrackerId = getJobVariantByJobTrackerId;
            this.getIncompleteJobs = getIncompleteJobs;

            this.getJobSplitCEAnalysis = getJobSplitCEAnalysis;
            this.getJobSplitCEAnalysisByDepartment = getJobSplitCEAnalysisByDepartment;

            this.getJobSplitByJobTrackerId = getJobSplitByJobTrackerId;
            this.getPersoJobSplitByJobTrackerId = getPersoJobSplitByJobTrackerId;
            this.getPrintJobSplitByJobTrackerId = getPrintJobSplitByJobTrackerId;
            this.getMailingJobSplitByJobTrackerId = getMailingJobSplitByJobTrackerId;
            this.getPendingCESplitAnalysisByJobTrackerId = getPendingCESplitAnalysisByJobTrackerId;
            this.getJobSplitCEAnalysisByJobTrackerId = getJobSplitCEAnalysisByJobTrackerId;
            this.getJobSplitQCAnalysisByJobTrackerId = getJobSplitQCAnalysisByJobTrackerId;
            this.getIncomingCESplitAnalysisByJobTrackerId = getIncomingCESplitAnalysisByJobTrackerId;
            this.getIncomingQCSplitAnalysisByJobTrackerId = getIncomingQCSplitAnalysisByJobTrackerId;
            this.getIncomingPrintCESplitAnalysisByJobTrackerId = getIncomingPrintCESplitAnalysisByJobTrackerId;

            this.getJobTrackerByPrintCEAnalysisId = getJobTrackerByPrintCEAnalysisId;
            this.geJobSplitAnalysisByTrackerId = geJobSplitAnalysisByTrackerId;

            this.getCardOpsByJobId = getCardOpsByJobId;
            this.getJobByTrackerId = getJobByTrackerId;

            this.getQABySplitId = getQABySplitId;
            this.getQAWasteRequests = getQAWasteRequests;
            this.getPendingWasteRequests = getPendingWasteRequests;
            this.getIssuedWasteRequests = getIssuedWasteRequests;

            this.getPrintQAWasteRequests = getPrintQAWasteRequests;

            this.getCECardDeliverys = getCECardDeliverys;
            this.getCECardDeliveryLogs = getCECardDeliveryLogs;

            this.getCECardDeliveryLogByTrackerId = getCECardDeliveryLogByTrackerId;
            this.getPrQCCardDeliveryLogByTrackerId = getPrQCCardDeliveryLogByTrackerId;
            this.getQCCardDeliveryLogByTrackerId = getQCCardDeliveryLogByTrackerId;
            this.getMACardDeliveryLogByTrackerId = getMACardDeliveryLogByTrackerId;
            this.getDPCardDeliveryLogByClientId = getDPCardDeliveryLogByClientId;

            this.getCardIssuanceByTrackerId = getCardIssuanceByTrackerId;
            this.getCardIssuanceLogByTrackerId = getCardIssuanceLogByTrackerId;
            this.getPrintAnalysisByTrackerId = getPrintAnalysisByTrackerId;
            this.getDispatchJobTracker = getDispatchJobTracker;

            this.getJobSplitByTrackerId = getJobSplitByTrackerId;

            this.getFlaggedJobs = getFlaggedJobs;
            this.getResolvedFlaggedJobs = getResolvedFlaggedJobs;
            this.getUnitFlaggedJobs = getUnitFlaggedJobs;

            this.getCEJobSplits = getCEJobSplits;
            this.getJobHandler = getJobHandler;
        }

        AbstractRepository.extend(Ctor);

        return Ctor;

        function getById(id, forceRemote) {
            return this._getById(entityName, id, forceRemote);
        }

        function getJobById(id, forceRemote) {
            return this._getById(entityNames.job, id, forceRemote);
        }

        function getJobTrackerById(id, forceRemote) {
            return this._getById(entityNames.jobTracker, id, forceRemote);
        }

        function getJobBatchTrackerById(id, forceRemote) {
            return this._getById(entityNames.jobBatchTracker, id, forceRemote);
        }

        function getByServerJobQueueId(id, forceRemote) {
            return this._getById(entityNames.serverJobQueue, id, forceRemote);
        }

        function getByNonPersoJobId(id, forceRemote) {
            return this._getById('NonPersoJob', id, forceRemote);
        }

        function getDeliveryNoteId(id, forceRemote) {
            return this._getById('DeliveryNote', id, forceRemote);
        }

        // Issuance
        function getCardIssuanceById(id, forceRemote) {
            return this._getById(entityNames.cardIssuance, id, forceRemote);
        }

        function getCardIssuanceLogById(id, forceRemote) {
            return this._getById(entityNames.cardIssuanceLog, id, forceRemote);
        }

        function getJobSplitCEAnalysisById(id, forceRemote) {
            return this._getById(entityNames.jobSplitCEAnalysis, id, forceRemote);
        }

        function getJobSplitPrintCEAnalysisById(id, forceRemote) {
            return this._getById(entityNames.jobSplitPrintCEAnalysis, id, forceRemote);
        }

        function getJobSplitQCAnalysisById(id, forceRemote) {
            return this._getById(entityNames.jobSplitQCAnalysis, id, forceRemote);
        }

        function getCardWasteAnalysisById(id, forceRemote) {
            return this._getById(entityNames.cardWasteAnalysis, id, forceRemote);
        }

        function getPrintWasteAnalysisById(id, forceRemote) {
            return this._getById(entityNames.printWasteAnalysis, id, forceRemote);
        }



        // ServerJobs
        function getRecentServerJobQueues(extension, forceRemote, page, size, nameFilter) {
            var self = this;
            var entity;
            var orderBy = 'createdOn desc';
            var predicate = null;

            //if (nameFilter) {
            //    predicate = _recentServerJobPredicate(nameFilter);
            //}

            if (extension === 'asc') {
                predicate = _serverJobPredicateJobFile(nameFilter);
                if (nameFilter && extension === 'asc') {
                    predicate = _serverJobPredicateJobFile(nameFilter);
                }
            } else if (extension === 'xls') {
                predicate = _serverJobPredicateSorting(nameFilter);
                if (nameFilter && extension === 'xls') {
                    predicate = _serverJobPredicateSorting(nameFilter);
                }
            } else {
                predicate = _serverJobPredicate(nameFilter);
                if (nameFilter) {
                    predicate = _serverJobPredicate(nameFilter);
                }
            }

            //var take = size || 20;
            var take = 50;
            var skip = page ? (page - 1) * size : 0;

            //if (self._areItemsLoaded() && !forceRemote) {
            //    return self.$q.when(getByPage());
            //}

            return EntityQuery.from('RecentServerJobQueues')
                .select('id, jobName, createdOn')
                .orderBy(orderBy)
                .toType(entityNames.serverJobQueue)
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                entity = data.results;
                return getByPage();
            }

            function getByPage() {
                var predicate = null;

                //if (nameFilter) {
                //    predicate = _recentServerJobPredicate(nameFilter);
                //}

                if (extension === 'asc') {
                    predicate = _serverJobPredicateJobFile(nameFilter);
                    if (nameFilter && extension === 'asc') {
                        predicate = _serverJobPredicateJobFile(nameFilter);
                    }
                } else if (extension === 'xls') {
                    predicate = _serverJobPredicateSorting(nameFilter);
                    if (nameFilter && extension === 'xls') {
                        predicate = _serverJobPredicateSorting(nameFilter);
                    }
                } else {
                    predicate = _serverJobPredicate(nameFilter);
                    if (nameFilter) {
                        predicate = _serverJobPredicate(nameFilter);
                    }
                }


                //Todo
                var newEntities = EntityQuery.from('RecentServerJobQueues')
                    .where(predicate)
                    .orderBy(orderBy)
                    .take(take).skip(skip)
                    .using(self.manager)
                    .executeLocally();

                return newEntities;
            }

        }

        function getRecentServerJobQueues2(extension, forceRemote, page, size, nameFilter) {
            var self = this;
            var entity;
            var orderBy = 'createdOn desc';
            var predicate = null;

            //if (nameFilter) {
            //    predicate = _recentServerJobPredicate(nameFilter);
            //}

            if (extension === 'asc') {
                predicate = _serverJobPredicateJobFile(nameFilter);
                if (nameFilter && extension === 'asc') {
                    predicate = _serverJobPredicateJobFile(nameFilter);
                }
            } else if (extension === 'xls') {
                predicate = _serverJobPredicateSorting(nameFilter);
                if (nameFilter && extension === 'xls') {
                    predicate = _serverJobPredicateSorting(nameFilter);
                }
            } else {
                predicate = _serverJobPredicate(nameFilter);
                if (nameFilter) {
                    predicate = _serverJobPredicate(nameFilter);
                }
            }

            //var take = size || 20;
            var take = 50;
            var skip = page ? (page - 1) * size : 0;

            //if (self._areItemsLoaded() && !forceRemote) {
            //    return self.$q.when(getByPage());
            //}

            return EntityQuery.from('RecentServerJobQueues')
                .select('id, jobName, createdOn, isTreated, isDeleted')
                .where(predicate)
                .orderBy(orderBy)
                .toType(entityNames.serverJobQueue)
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                entity = data.results;
                return entity;
            }

        }

        function getRecentServerJobCount() {
            var self = this;
            return EntityQuery.from('ServerJobQueues').take(0).inlineCount()
                .using(this.manager).execute()
                .then(this._getInlineCount);
        }

        function getRecentServerJobFilteredCount(nameFilter) {
            var self = this;
            var predicate = _serverJobPredicate(nameFilter);

            var entities = EntityQuery.from('ServerJobQueues')
                    .where(predicate)
                    .using(this.manager)
                    .executeLocally();

            return entities.length;
        }


        // ServerJobs
        function getServerJobQueues(extension, forceRemote, page, size, nameFilter) {
            var self = this;
            var entity;
            var orderBy = 'createdOn desc';
            var predicate = null;

            if (extension === 'asc') {
                predicate = _serverJobPredicateJobFile(nameFilter);
                if (nameFilter && extension === 'asc') {
                    predicate = _serverJobPredicateJobFile(nameFilter);
                }
            } else if (extension === 'xls') {
                predicate = _serverJobPredicateSorting(nameFilter);
                if (nameFilter && extension === 'xls') {
                    predicate = _serverJobPredicateSorting(nameFilter);
                }
            } else {
                predicate = _serverJobPredicate(nameFilter);
                if (nameFilter) {
                    predicate = _serverJobPredicate(nameFilter);
                }
            }

            var take = size || 20;
            var skip = page ? (page - 1) * size : 0;

            return EntityQuery.from('ServerJobQueues')
                .select('id, jobName, createdOn, isTreated, isDeleted')
                .orderBy(orderBy)
                .toType(entityNames.serverJobQueue)
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                entity = data.results;
                return getByPage();
            }

            function getByPage() {
                var predicate = null;

                if (extension === 'asc') {
                    predicate = _serverJobPredicateJobFile(nameFilter);
                    if (nameFilter && extension === 'asc') {
                        predicate = _serverJobPredicateJobFile(nameFilter);
                    }
                } else if (extension === 'xls') {
                    predicate = _serverJobPredicateSorting(nameFilter);
                    if (nameFilter && extension === 'xls') {
                        predicate = _serverJobPredicateSorting(nameFilter);
                    }
                } else {
                    predicate = _serverJobPredicate(nameFilter);
                    if (nameFilter) {
                        predicate = _serverJobPredicate(nameFilter);
                    }
                }

                var newEntities = EntityQuery.from('ServerJobQueues')
                    .where(predicate)
                    .orderBy(orderBy)
                    .take(take).skip(skip)
                    .using(self.manager)
                    .executeLocally();

                return newEntities;
            }

        }

        function getServerJobQueues2(extension, forceRemote, page, size, nameFilter) {

            var self = this;
            var entity;
            var orderBy = 'createdOn desc';
            var predicate = null;

            if (extension === 'asc') {
                predicate = _serverJobPredicateJobFile(nameFilter);
                if (nameFilter && extension === 'asc') {
                    predicate = _serverJobPredicateJobFile(nameFilter);
                }
            } else if (extension === 'xls') {
                predicate = _serverJobPredicateSorting(nameFilter);
                if (nameFilter && extension === 'xls') {
                    predicate = _serverJobPredicateSorting(nameFilter);
                }
            } else {
                predicate = _serverJobPredicate(nameFilter);
                if (nameFilter) {
                    predicate = _serverJobPredicate(nameFilter);
                }
            }

            var take = size || 20;
            var skip = page ? (page - 1) * size : 0;

            return EntityQuery.from('ServerJobQueues')
                .select('id, jobName, createdOn, isTreated, isDeleted')
                .take(100)
                .orderBy(orderBy)
                .toType(entityNames.serverJobQueue)
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                entity = data.results;
                return getByPage(); //entity;
            }

            function getByPage() {
                //var predicate = null;
                var newEntities = EntityQuery.from('ServerJobQueues')
                    .where(predicate)
                    .orderBy(orderBy)
                    .take(take).skip(skip)
                    .using(self.manager)
                    .executeLocally();

                return newEntities;
            }

        }

        // DeletedServerJobs
        function getDeletedServerJobQueues(extension, forceRemote, page, size, nameFilter) {

            var self = this;
            var entity;
            var orderBy = 'createdOn desc';
            var predicate = null;

            if (extension === 'asc') {
                predicate = _deletedServerJobPredicateJobFile(nameFilter);
                if (nameFilter && extension === 'asc') {
                    predicate = _deletedServerJobPredicateJobFile(nameFilter);
                }
            } else if (extension === 'xls') {
                predicate = _deletedServerJobPredicateSorting(nameFilter);
                if (nameFilter && extension === 'xls') {
                    predicate = _deletedServerJobPredicateSorting(nameFilter);
                }
            } else {
                predicate = _deletedServerJobPredicate(nameFilter);
                if (nameFilter) {
                    predicate = _deletedServerJobPredicate(nameFilter);
                }
            }

            var take = size || 20;
            var skip = page ? (page - 1) * size : 0;

            return EntityQuery.from('ServerJobQueues')
                .select('id, jobName, createdOn, isTreated, isDeleted')
                .where(predicate)
                .orderBy(orderBy)
                .toType(entityNames.serverJobQueue)
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                entity = data.results;
                return getByPage(); //entity;
            }

            function getByPage() {
                //var predicate = null;
                var newEntities = EntityQuery.from('ServerJobQueues')
                    .where(predicate)
                    .orderBy(orderBy)
                    .take(take).skip(skip)
                    .using(self.manager)
                    .executeLocally();

                return newEntities;
            }

        }


        function getServerJobCount() {
            var self = this;

            var newEnty = EntityQuery.from('ServerJobQueues').take(0).inlineCount()
                .using(this.manager).execute()
                .then(this._getInlineCount);

            return newEnty
        }

        function getServerJobFilteredCount(nameFilter) {
            var self = this;
            var predicate = _serverJobPredicate(nameFilter);

            var entities = EntityQuery.from('ServerJobQueues')
                    .where(predicate)
                    .using(this.manager)
                    .executeLocally();

            return entities.length;
        }

        // All serverJobs
        function _serverJobPredicate(filterValue) {
            return breeze.Predicate
                .create('jobName', 'contains', filterValue)
                .and('isTreated', '==', false)
                .and('isDeleted', '==', false);
        }

        //_serverJobPredicateJobFile
        function _serverJobPredicateJobFile(filterValue) {
            return breeze.Predicate
                .create('jobName', 'contains', filterValue)
                .and('jobName', 'contains', 'asc')
                .and('isDeleted', '==', false)
                .and('isTreated', '==', false);
        }

        //_serverJobPredicateSorting
        function _serverJobPredicateSorting(filterValue) {
            return breeze.Predicate
                .create('jobName', 'contains', filterValue)
                .and('jobName', 'contains', '.xls')
                .and('isTreated', '==', false)
                .and('isDeleted', '==', false);
        }

        function _recentServerJobPredicate(filterValue) {
            var d = new Date();
            d.setHours(d.getHours() - 2);

            return breeze.Predicate
                .create('jobName', 'contains', filterValue)
                .and('jobName', 'contains', 'asc')
                //.or('jobName', 'contains', 'pgp')
                .and('isTreated', '==', false)
                .and('isDeleted', '==', false)
                .and('createdOn', '>=', d);
        }
        

        function _deletedServerJobPredicate(filterValue) {
            return breeze.Predicate
                .create('jobName', 'contains', filterValue)
                .and('isTreated', '==', false)
                .and('isDeleted', '==', true);
        }

        function _deletedServerJobPredicateJobFile(filterValue) {
            return breeze.Predicate
                .create('jobName', 'contains', filterValue)
                .and('jobName', 'contains', 'asc')
                //.or('jobName', 'contains', 'pgp')
                .and('isTreated', '==', false)
                .and('isDeleted', '==', true);
        }

        function _deletedServerJobPredicateSorting(filterValue) {
            return breeze.Predicate
                .create('jobName', 'contains', filterValue)
                .and('jobName', 'contains', '.xls')
                .and('isTreated', '==', false)
                .and('isDeleted', '==', true);
        }

        function getAllJobTrackers(forceRemote, page, size, nameFilter) {
            var self = this;
            var entity;
            var orderBy = 'modifiedOn desc';
            var predicate = null;
            predicate = _jobTrackerDefaultPredicate(nameFilter);

            return EntityQuery.from('JobTrackers')
                .select('id, jobId, cardOpsId, inventoryId, printingId, printQAId, printQCId, cardEngrId, qAId, firstJobRunId, cardEngrResumeId, qCId, mailingId, dispatchId, mAudId, customerServiceId, tAT, isFlag, createdOn, modifiedOn, isCompleted, isDeleted')
                .where(predicate)
                .orderBy(orderBy)
                .toType(entityNames.jobTracker)
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                entity = data.results;
                return entity;
            }
        }


        function getJobTrackers(forceRemote, page, size, nameFilter) {
            var self = this;
            var entity;
            var orderBy = 'modifiedOn desc';
            var predicate = null;

            var take = size || 10;
            var skip = page ? (page - 1) * size : 0;
            var nameFilter = nameFilter || '';

            if (nameFilter) {
                predicate = _jobTrackerPredicate(nameFilter);
            } else {
                predicate = _jobTrackerDefaultPredicate(nameFilter);
            }

            return EntityQuery.from('JobTrackers')
                .select('id, isDeleted, jobId, cardOpsId, inventoryId, printingId, printQAId, printQCId, cardEngrId, qAId, firstJobRunId, cardEngrResumeId, qCId, mailingId, dispatchId, mAudId, customerServiceId, tAT, isFlag, createdOn, modifiedOn, isCompleted')
                .take(100)
                .where(predicate)
                .orderBy(orderBy)
                .toType(entityNames.jobTracker)
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                entity = data.results;
                return getByPage(); //entity; 
            }

            function getByPage() {
                var predicate = null;

                if (nameFilter) {
                    predicate = _jobTrackerPredicate(nameFilter);
                } else {
                    predicate = _jobTrackerDefaultPredicate(nameFilter);
                }

                var newEntities = EntityQuery.from('JobTrackers')
                    .where(predicate)
                    .orderBy(orderBy)
                    .take(take).skip(skip)
                    .using(self.manager)
                    .executeLocally();

                return newEntities;
            }
        }

        function getJobTrackerFilteredCount(nameFilter) {
            var self = this;
            var predicate = _jobTrackerPredicate(nameFilter);

            var entities = EntityQuery.from('JobTrackers')
                    .where(predicate)
                    .using(this.manager)
                    .executeLocally();

            return entities.length;
        }

        function getJobTrackerCount() {
            var self = this;
            if (self._areItemsLoaded()) {
                return self.$q.when(self._getLocalEntityCount('JobTrackers'));
            }
            // Attendees aren't loaded; ask the server for a count.
            return EntityQuery.from('JobTrackers').take(0).inlineCount()
                .using(this.manager).execute()
                .then(this._getInlineCount);
        }

        function _jobTrackerPredicate(filterValue) {
            return Predicate
                .create('job.jobName', 'contains', filterValue)
                .and('isFlag', '==', false)
                .and('isCompleted', '==', false)
                .and('isDeleted', '==', false);
        }

        function _jobTrackerDefaultPredicate() {
            return Predicate
                .create('isFlag', '==', false)
                .and('isCompleted', '==', false)
                .and('isDeleted', '==', false);
        }


        function getJobSplits(forceRemote) {
            var self = this;
            var entity;
            var orderBy;

            return EntityQuery.from('JobSplits')
                .select('id, jobTrackerId, departmentId, sidMachineId, rangeFrom, rangeTo')
                .orderBy(orderBy)
                .toType(entityNames.jobSplit)
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                entity = data.results;
                //self.log('Retrieved [JobSplit Partials] from remote data source', entity.length, true);
                return entity;
            }
        }

        function getJobBatchTrackerByTrackerId(jobTrackerId, forceRemote) {
            var self = this;
            var entity;
            var orderBy;

            return EntityQuery.from('JobBatchTrackerByTrackerId')
                .select('id, jobId, jobTrackerId')
                .withParameters({ jobTrackerId: jobTrackerId })
                .orderBy(orderBy)
                .toType(entityNames.jobBatchTracker)
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                entity = data.results;
                //self.log('Retrieved [JobTracker Partials] from remote data source', entity.length, true);
                return entity;
            }
        }

        function getCardIssuanceByTrackerId(jobTrackerId, forceRemote) {
            var self = this;
            var entity;
            var orderBy;

            return EntityQuery.from('CardIssuanceByTrackerId')
                .select('id, jobTrackerId, totalQuantity, totalQuantityIssued, totalQuantityRemain, totalWaste, totalHeld')
                .withParameters({ jobTrackerId: jobTrackerId })
                .orderBy(orderBy)
                .toType(entityNames.cardIssuance)
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                entity = data.results;
                //self.log('Retrieved [cardIssuance Partials] from remote data source', entity.length, true);
                return entity;
            }
        }

        function getCardIssuanceLogByTrackerId(jobTrackerId, forceRemote) {
            var self = this;
            var entity;
            var orderBy;

            //quantityIssued, quantityRemain, issuanceId, collectorId, issuedDate
            return EntityQuery.from('CardIssuanceLogByTrackerId')
                .select('id, quantityIssued, quantityRemain, issuanceId, collectorId, issuedDate')
                .withParameters({ jobTrackerId: jobTrackerId })
                .orderBy(orderBy)
                .toType(entityNames.cardIssuanceLog)
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                entity = data.results;
                //self.log('Retrieved [cardIssuanceLog Partials] from remote data source', entity.length, true);
                return entity;
            }
        }

        //getPrintAnalysisByTrackerId
        function getPrintAnalysisByTrackerId(jobTrackerId, forceRemote) {
            var self = this;
            var entity;
            var orderBy;

            return EntityQuery.from('JobSplitPrintCEAnalysisByTrackerId')
                .select('id, jobSplitId, quantityGood, quantityHeld, quantityBad, createdOn')
                .withParameters({ jobTrackerId: jobTrackerId })
                .orderBy(orderBy)
                .toType(entityNames.jobSplitPrintCEAnalysis)
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                entity = data.results;
                //self.log('Retrieved [PrintCEAnalysis Partials] from remote data source', entity.length, true);
                return entity;
            }
        }

        function getJobSplitByTrackerId(jobTrackerId, forceRemote) {
            var self = this;
            var entity;
            var orderBy;

            return EntityQuery.from('JobSplitByTrackerId')
                .select('id, jobTrackerId, departmentId, sidMachineId, rangeFrom, rangeTo')
                .withParameters({ jobTrackerId: jobTrackerId })
                .orderBy(orderBy)
                .toType(entityNames.jobSplit)
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                entity = data.results;
                //self.log('Retrieved [JobSplit Partials] from remote data source', entity.length, true);
                return entity;
            }
        }

        function getCECardDeliverys(forceRemote) {
            var self = this;
            var entity;
            var orderBy;

            return EntityQuery.from('CEDepCardDeliverys')
                .select('id, jobTrackerId, departmentId, targetDepartmentId')
                .orderBy(orderBy)
                .toType(entityNames.cardDelivery)
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                entity = data.results;
                //self.log('Retrieved [CardDelivery Partials] from remote data source', entity.length, true);
                return entity;
            }
        }

        function getCECardDeliveryLogs(forceRemote) {
            var self = this;
            var entity;
            var orderBy;

            return EntityQuery.from('CEDepCardDeliveryLogs')
                .select('id, jobTrackerId, cardDeliveryId, rangeFrom, rangeTo, createdById, confirmedById, createdOn, isConfirmed')
                .orderBy(orderBy)
                .toType(entityNames.cardDeliveryLog)
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                entity = data.results;
                //self.log('Retrieved [CardDeliveryLog Partials] from remote data source', entity.length, true);
                return entity;
            }
        }



        function getCECardDeliveryLogByTrackerId(jobTrackerId, forceRemote) {
            var self = this;
            var entity;
            var orderBy;

            return EntityQuery.from('CECardDeliveryLogs')
                .select('id, jobTrackerId, cardDeliveryId, rangeFrom, rangeTo, boxQty, createdById, createdOn, isConfirmed')
                .withParameters({ jobTrackerId: jobTrackerId })
                .orderBy(orderBy)
                .toType(entityNames.cardDeliveryLog)
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                entity = data.results;
                //self.log('Retrieved [CardDeliveryLog Partials] from remote data source', entity.length, true);
                return entity;
            }
        }

        function getPrQCCardDeliveryLogByTrackerId(jobTrackerId, forceRemote) {
            var self = this;
            var entity;
            var orderBy;

            return EntityQuery.from('PrQCCardDeliveryLogs')
                .select('id, jobTrackerId, cardDeliveryId, rangeFrom, rangeTo, boxQty, createdById, createdOn, isConfirmed, description')
                .withParameters({ jobTrackerId: jobTrackerId })
                .orderBy(orderBy)
                .toType("CardDeliveryLog")
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                entity = data.results;
                //self.log('Retrieved [CardDeliveryLog Partials] from remote data source', entity.length, true);
                return entity;
            }
        }


        function getQCCardDeliveryLogByTrackerId(jobTrackerId, forceRemote) {
            var self = this;
            var entity;
            var orderBy;

            return EntityQuery.from('QCCardDeliveryLogs')
                .select('id, jobTrackerId, cardDeliveryId, rangeFrom, rangeTo, boxQty, createdById, createdOn, isConfirmed, description')
                .withParameters({ jobTrackerId: jobTrackerId })
                .orderBy(orderBy)
                .toType("CardDeliveryLog")
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                entity = data.results;
                //self.log('Retrieved [CardDeliveryLog Partials] from remote data source', entity.length, true);
                return entity;
            }
        }

        function getMACardDeliveryLogByTrackerId(jobTrackerId, forceRemote) {
            var self = this;
            var entity;
            var orderBy;

            return EntityQuery.from('MACardDeliveryLogs')
                .select('id, jobTrackerId, cardDeliveryId, rangeFrom, rangeTo, createdById, createdOn, isConfirmed, boxQty')
                .withParameters({ jobTrackerId: jobTrackerId })
                .orderBy(orderBy)
                .toType(entityNames.cardDeliveryLog)
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                entity = data.results;
                //self.log('Retrieved [CardDeliveryLog Partials] from remote data source', entity.length, true);
                return entity;
            }
        }

        function getDPCardDeliveryLogByClientId(clientId, forceRemote) {
            var self = this;
            var entity;
            var orderBy;

            return EntityQuery.from('DPCardDeliveryLogs')
                .select('id, jobTrackerId, rangeFrom, rangeTo, isConfirmed, createdById')
                .withParameters({ clientId: clientId })
                .orderBy(orderBy)
                .toType(entityNames.cardDeliveryLog)
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                entity = data.results;
                //self.log('Retrieved [CardDeliveryLog Partials] from remote data source', entity.length, true);
                return entity;
            }
        }




        function getJobs(forceRemote, page, size, nameFilter) {
            var self = this;
            var entity;
            var orderBy = 'createdOn desc';

            var nameFilter = nameFilter || '';
            var take = size || 10;
            var skip = page ? (page - 1) * size : 0;

            return EntityQuery.from('Jobs')
                .select('id, isDeleted, jobName, sidClientId, sidCardTypeId, jobStatusId, remarkId, serviceTypeId, quantity, createdOn')
                .orderBy(orderBy)
                .toType(entityNames.job)
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                var entity = self._setIsPartialTrue(data.results);
                return getByPage();
            }

            function getByPage() {
                var predicate = null;

                if (nameFilter) {
                    predicate = _jobPredicate(nameFilter);
                }

                var sidProducts = EntityQuery.from('Jobs')
                    .where(predicate)
                    .orderBy(orderBy)
                    .take(take).skip(skip)
                    .using(self.manager)
                    .executeLocally();

                return sidProducts;
            }

        }

        function getJobFilteredCount(nameFilter) {
            var self = this;
            var predicate = _jobPredicate(nameFilter);

            var sidProducts = EntityQuery.from('Job')
                    .where(predicate)
                    .using(this.manager)
                    .executeLocally();

            return sidProducts.length;
        }

        function getJobCount() {
            var self = this;
            // Attendees aren't loaded; ask the server for a count.
            return EntityQuery.from('Jobs').take(0).inlineCount()
                .using(this.manager).execute()
                .then(this._getInlineCount);
        }

        function _jobPredicate(filterValue) {
            return Predicate
                .create('jobName', 'contains', filterValue)
                .or('serviceType.name', 'contains', filterValue)
                .or('sidCardType.name', 'contains', filterValue)
                .or('sidClient.name', 'contains', filterValue)
                .and('isDeleted', '==', false);
        }


        function getNonPersoJobs(forceRemote) {
            var self = this;
            var entity;
            var orderBy;

            return EntityQuery.from('NonPersoJobs')
                .select('id, jobName, description, createdById')
                .orderBy(orderBy)
                .toType('NonPersoJob')
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                var entity = self._setIsPartialTrue(data.results);
                self._areItemsLoaded(true);
                //self.log('Retrieved [NonPersoJob Partials] from remote data source', entity.length, true);
                return entity;
            }

        }




        function getJobByTrackerId(val, forceRemote) {
            var self = this;
            var entity;
            var orderBy;

            return EntityQuery.from('JobByTrackerId')
                .select('id, isDeleted, jobName, sidClientId, sidCardTypeId, remark, quantity')
                .withParameters({ jobTrackerId: val })
                .orderBy(orderBy)
                .toType(entityNames.job)
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                entity = data.results;
                //self.log('Retrieved [Job Partials] from remote data source', entity.length, true);
                return entity;
            }
        }

        function getJobHandler(jobSplitId, forceRemote) {
            var self = this;
            var entity;
            var orderBy;

            return EntityQuery.from('JobHandlers')
                .select('id, jobSplitId, handlerId, createdOn, modifiedOn')
                .withParameters({ jobSplitId: jobSplitId })
                .orderBy(orderBy)
                .toType('JobHandler')
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                entity = data.results;
                return entity;
            }
        }

        function getDispatchJobTracker(forceRemote) {
            var self = this;
            var entity;
            var orderBy = 'modifiedOn desc';

            return EntityQuery.from('DispatchJobTracker')
                .select('id, jobId, modifiedOn')
                .orderBy(orderBy)
                .toType(entityNames.jobTracker)
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                entity = data.results;
                //self.log('Retrieved [JobTracker] from remote data source', entity.length, true);
                return entity;
            }
        }

        function getCEJobSplits(forceRemote) {
            var self = this;
            var entity;
            var orderBy = 'modifiedOn desc';


            return EntityQuery.from('CEJobSplits')
                .select('id, jobTrackerId, departmentId, sidMachineId, rangeFrom, rangeTo, isQACompleted, isQCCompleted, isCECompleted, modifiedOn')
                .orderBy(orderBy)
                .toType(entityNames.jobSplit)
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                entity = data.results;
                //self.log('Retrieved [JobTrackerByJobId Partials] from remote data source', entity.length, true);
                return entity;
            }
        }

        function getJobSplitByJobTrackerId(jobTrackerId, forceRemote) {
            var self = this;
            var entity;
            var orderBy;

            return EntityQuery.from('CEJobSplitByJobTrackerId')
                .select('id, jobTrackerId, departmentId, sidMachineId, rangeFrom, rangeTo, isQACompleted, isQCCompleted, isCECompleted')
                .withParameters({ jobTrackerId: jobTrackerId })
                .orderBy(orderBy)
                .toType(entityNames.jobSplit)
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                entity = data.results;
                //self.log('Retrieved [JobTrackerByJobId Partials] from remote data source', entity.length, true);
                return entity;
            }
        }

        function getPersoJobSplitByJobTrackerId(jobTrackerId, forceRemote) {
            var self = this;
            var entity;
            var orderBy = 'modifiedOn desc';

            return EntityQuery.from('PersoJobSplitByJobTrackerId')
                .select('id, jobTrackerId, departmentId, sidMachineId, rangeFrom, rangeTo, isQACompleted, isQCCompleted, isCECompleted')
                .withParameters({ jobTrackerId: jobTrackerId })
                .orderBy(orderBy)
                .toType(entityNames.jobSplit)
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                entity = data.results;
                //self.log('Retrieved [JobTracker Partials] from remote data source', entity.length, true);
                return entity;
            }
        }

        function getPrintJobSplitByJobTrackerId(jobTrackerId, forceRemote) {
            var self = this;
            var entity;
            var orderBy = 'modifiedOn desc';


            return EntityQuery.from('PrintJobSplitByJobTrackerId')
                .select('id, jobTrackerId, departmentId, sidMachineId, rangeFrom, rangeTo, isQACompleted, isQCCompleted, isCECompleted, modifiedOn')
                .withParameters({ jobTrackerId: jobTrackerId })
                .orderBy(orderBy)
                .toType(entityNames.jobSplit)
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                entity = data.results;
                //self.log('Retrieved [JobSplit Partials] from remote data source', entity.length, true);
                return entity;
            }
        }

        function getMailingJobSplitByJobTrackerId(jobTrackerId, forceRemote) {
            var self = this;
            var entity;
            var orderBy = 'modifiedOn desc';

            return EntityQuery.from('MailingJobSplitByJobTrackerId')
                .select('id, jobTrackerId, departmentId, sidMachineId, rangeFrom, rangeTo, isQACompleted, isQCCompleted, isCECompleted, isMACompleted, modifiedOn')
                .withParameters({ jobTrackerId: jobTrackerId })
                .orderBy(orderBy)
                .toType(entityNames.jobSplit)
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                entity = data.results;
                //self.log('Retrieved [JobSplit Partials] from remote data source', entity.length, true);
                return entity;
            }
        }

        function getJobSplitCEAnalysis(forceRemote) {
            var self = this;
            var entity;
            var orderBy = 'modifiedOn desc';

            return EntityQuery.from('JobSplitCEAnalysis')
                .select('id, jobTrackerId, jobSplitId, quantityGood, quantityHeld, quantityBad, createdOn, mo')
                .orderBy(orderBy)
                .toType('JobSplitCEAnalysis')
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                entity = data.results;
                //self.log('Retrieved [JobSplitCEAnalysis Partials] from remote data source', entity.length, true);
                return entity;
            }
        }

        function getJobSplitCEAnalysisByDepartment(department, forceRemote) {
            var self = this;
            var entity;
            var orderBy = 'modifiedOn desc';

            return EntityQuery.from('JobSplitCEAnalysisByDepartment')
                .select('id, jobTrackerId, jobSplitId, quantityGood, quantityHeld, quantityBad, createdOn, modifiedOn, modifiedById')
                .withParameters({ department: department })
                .orderBy(orderBy)
                .toType('JobSplitCEAnalysis')
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                entity = data.results;
                //self.log('Retrieved [JobSplitCEAnalysis Partials] from remote data source', entity.length, true);
                return entity;
            }
        }

        function getJobSplitCEAnalysisByJobTrackerId(jobTrackerId, forceRemote) {
            var self = this;
            var entity;
            var orderBy;

            return EntityQuery.from('JobSplitCEAnalysisByTrackerId')
                .select('id, jobSplitId, quantityGood, quantityHeld, quantityBad, createdOn, modifiedOn, modifiedById')
                .withParameters({ jobTrackerId: jobTrackerId })
                .orderBy(orderBy)
                .toType('JobSplitCEAnalysis')
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                entity = data.results;
                //self.log('Retrieved [JobTrackerByJobId Partials] from remote data source', entity.length, true);
                return entity;
            }
        }

        function getJobSplitQCAnalysisByJobTrackerId(jobTrackerId, forceRemote) {
            var self = this;
            var entity;
            var orderBy;

            return EntityQuery.from('JobSplitQCAnalysisByTrackerId')
                .select('id, jobSplitId, quantityGood, quantityHeld, quantityBad, createdOn')
                .withParameters({ jobTrackerId: jobTrackerId })
                .orderBy(orderBy)
                .toType('JobSplitQCAnalysis')
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                entity = data.results;
                //self.log('Retrieved [JobSplitQCAnalysis Partials] from remote data source', entity.length, true);
                return entity;
            }
        }

        function getIncomingCESplitAnalysisByJobTrackerId(jobTrackerId, forceRemote) {
            var self = this;
            var entity;
            var orderBy = 'modifiedOn desc';

            return EntityQuery.from('IncomingCEJobSplitAnalysisByJobTrackerId')
                .select('id, jobSplitId, quantityGood, quantityHeld, quantityBad, createdById, createdOn, modifiedById, modifiedOn, heldReturned, wasteReturned, isJobHandleByCE, isJobHandleByQC')
                .withParameters({ jobTrackerId: jobTrackerId })
                .orderBy(orderBy)
                .toType(entityNames.jobSplitCEAnalysis)
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                entity = data.results;
                return entity;
            }
        }

        function getPendingCESplitAnalysisByJobTrackerId(jobTrackerId, forceRemote) {
            var self = this;
            var entity;
            var orderBy = 'modifiedOn desc';

            return EntityQuery.from('PendingCEJobSplitAnalysisByJobTrackerId')
                .select('id, jobSplitId, quantityGood, quantityHeld, quantityBad, createdById, createdOn, modifiedById, modifiedOn, heldReturned, wasteReturned, isJobHandleByCE, isJobHandleByQC')
                .withParameters({ jobTrackerId: jobTrackerId })
                .orderBy(orderBy)
                .toType(entityNames.jobSplitCEAnalysis)
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                entity = data.results;
                //self.log('Retrieved [jobSplitCEAnalysis Partials] from remote data source', entity.length, true);
                return entity;
            }
        }

        function getIncomingPrintCESplitAnalysisByJobTrackerId(jobTrackerId, forceRemote) {
            var self = this;
            var entity;
            var orderBy = 'modifiedOn desc';


            return EntityQuery.from('IncomingPrintCEJobSplitAnalysisByJobTrackerId')
                .select('id, jobSplitId, quantityGood, quantityHeld, quantityBad, createdById, createdOn, modifiedById, modifiedOn, heldReturned, wasteReturned')
                .withParameters({ jobTrackerId: jobTrackerId })
                .orderBy(orderBy)
                .toType(entityNames.jobSplitPrintCEAnalysis)
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                entity = data.results;
                //self.log('Retrieved [jobSplitPrintCEAnalysis Partials] from remote data source', entity.length, true);
                return entity;
            }
        }

        function getIncomingQCSplitAnalysisByJobTrackerId(jobTrackerId, forceRemote) {
            var self = this;
            var entity;
            var orderBy;

            return EntityQuery.from('IncomingQCJobSplitAnalysisByJobTrackerId')
                .select('id, jobSplitId, quantityGood, quantityHeld, quantityBad, createdById, createdOn')
                .withParameters({ jobTrackerId: jobTrackerId })
                .orderBy(orderBy)
                .toType(entityNames.jobSplitQCAnalysis)
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                entity = data.results;
                //self.log('Retrieved [jobSplitQCAnalysis Partials] from remote data source', entity.length, true);
                return entity;
            }
        }

        function getJobTrackerByJobId(jobId, forceRemote) {
            var self = this;
            var entity;
            var orderBy = 'modifiedOn desc';

            return EntityQuery.from('JobTrackerByJobId')
                .select('id, isDeleted, jobId, cardOpsId, inventoryId, printingId, cardEngrId, qAId, firstJobRunId, cardEngrResumeId, qCId, mailingId, dispatchId, customerServiceId, modifiedOn')
                .withParameters({ jobId: jobId })
                .orderBy(orderBy)
                .toType(entityNames.jobTracker)
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                entity = data.results;
                //self.log('Retrieved [JobTrackerByJobId Partials] from remote data source', entity.length, true);
                return entity;
            }
        }

        function getJobTrackerByCEAnalysisId(jobCEAnalysisId, forceRemote) {
            var self = this;
            var entity;
            var orderBy = 'modifiedOn desc';

            return EntityQuery.from('JobTrackerByCEAnalysisId')
                .select('id, jobId, modifiedOn')
                .withParameters({ jobCEAnalysisId: jobCEAnalysisId })
                .orderBy(orderBy)
                .toType(entityNames.jobTracker)
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                entity = data.results;
                //self.log('Retrieved [JobTrackerByJobId Partials] from remote data source', entity.length, true);
                return entity;
            }
        }

        function getJobTrackerByPrintCEAnalysisId(jobCEAnalysisId, forceRemote) {
            var self = this;
            var entity;
            var orderBy = 'modifiedOn desc';

            return EntityQuery.from('JobTrackerByCEAnalysisId')
                .select('id, jobId, modifiedOn')
                .withParameters({ jobCEAnalysisId: jobCEAnalysisId })
                .orderBy(orderBy)
                .toType(entityNames.jobTracker)
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                entity = data.results;
                //self.log('Retrieved [JobTrackerByJobId Partials] from remote data source', entity.length, true);
                return entity;
            }
        }

        function getJobVariantByJobTrackerId(jobTrackerId, forceRemote) {
            var self = this;
            var entity;
            var orderBy;

            return EntityQuery.from('JobVariantByJobTrackerId')
                .select('id, jobId, jobTrackerId, sidProductId, serviceTypeId')
                .withParameters({ jobTrackerId: jobTrackerId })
                .orderBy(orderBy)
                .toType('JobVariant')
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                entity = data.results;
                //self.log('Retrieved [JobVariantByJobId Partials] from remote data source', entity.length, true);
                return entity;
            }
        }

        function getJobVariantByJobId(jobId, jobTrackerId, forceRemote) {
            var self = this;
            var entity;
            var orderBy;

            return EntityQuery.from('JobVariantByJobId')
                .select('id, jobId, jobTrackerId, sidProductId, serviceTypeId')
                .withParameters({ jobId: jobId, jobTrackerId: jobTrackerId })
                .orderBy(orderBy)
                .toType('JobVariant')
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                entity = data.results;
                //self.log('Retrieved [JobVariantByJobId Partials] from remote data source', entity.length, true);
                return entity;
            }
        }



        function getIncompleteJobs(forceRemote) {
            var self = this;
            var entity;
            var orderBy = 'modifiedOn desc';

            return EntityQuery.from('IncompleteJobs')
                .select('id, isDeleted, jobName, sidSectorId, sidClientId, remark, serviceTypeId, quantity, jobStatusId, modifiedOn')
                .orderBy(orderBy)
                .toType(entityNames.job)
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                entity = data.results;
                //self.log('Retrieved [IncompleteJob Partials] from remote data source', entity.length, true);
                return entity;
            }
        }

        function getQABySplitId(splitId, forceRemote) {
            var self = this;
            var entity;
            var orderBy;

            return EntityQuery.from('QABySplitId')
                .select('id, jobTrackerId, jobSplitId')
                .withParameters({ splitId: splitId })
                .orderBy(orderBy)
                .toType('Sid05QA')
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                entity = data.results;
                //self.log('Retrieved [JobTrackerByJobId Partials] from remote data source', entity.length, true);
                return entity;
            }
        }


        function getQAWasteRequests(forceRemote) {
            var self = this;
            var entity;
            var orderBy;

            return EntityQuery.from('QAWasteRequests')
                .select('id, jobTrackerId, jobSplitId, quantityGood, quantityHeld, quantityBad, createdOn, createdById')
                .orderBy(orderBy)
                .toType('JobSplitCEAnalysis')
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                entity = data.results;
                //self.log('Retrieved [JobSplitCEAnalysis Partials] from remote data source', entity.length, true);
                return entity;
            }
        }

        function getPendingWasteRequests(forceRemote) {
            var self = this;
            var entity;
            var orderBy = 'modifiedOn desc';

            return EntityQuery.from('PendingWasteRequests')
                .select('id, jobSplitId, modifiedOn')
                .orderBy(orderBy)
                .toType('JobBadCardApproval')
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                entity = data.results;
                //self.log('Retrieved [JobBadCardApproval Partials] from remote data source', entity.length, true);
                return entity;
            }
        }

        function getIssuedWasteRequests(forceRemote) {
            var self = this;
            var entity;
            var orderBy;

            return EntityQuery.from('IssuedWasteRequests')
                .select('id, jobSplitId')
                .orderBy(orderBy)
                .toType('JobBadCardApproval')
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                entity = data.results;
                //self.log('Retrieved [JobBadCardApproval Partials] from remote data source', entity.length, true);
                return entity;
            }
        }


        //Print Section
        function geJobSplitAnalysisByTrackerId(jobTrackerId, forceRemote) {
            var self = this;
            var entity;
            var orderBy = 'modifiedOn desc';

            return EntityQuery.from('JobSplitPrintAnalysisByTrackerId')
                .select('id, jobSplitId, quantityGood, quantityHeld, quantityBad, createdById, createdOn, modifiedById, modifiedOn')
                .withParameters({ jobTrackerId: jobTrackerId })
                .orderBy(orderBy)
                .toType(entityNames.jobSplitCEAnalysis)
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                entity = data.results;
                //self.log('Retrieved [jobSplitCEAnalysis Partials] from remote data source', entity.length, true);
                return entity;
            }
        }

        function getPrintQAWasteRequests(forceRemote) {
            var self = this;
            var entity;
            var orderBy;

            return EntityQuery.from('PrintQAWasteRequests')
                .select('id, jobTrackerId, jobSplitId, quantityGood, quantityHeld, quantityBad, createdOn, createdById')
                .orderBy(orderBy)
                .toType('JobSplitPrintCEAnalysis')
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                entity = data.results;
                //self.log('Retrieved [JobSplitPrintCEAnalysis Partials] from remote data source', entity.length, true);
                return entity;
            }
        }



        //Unit Activities
        function getCardOpsByJobId(jobId, forceRemote) {
            var self = this;
            var entity;
            var orderBy;

            return EntityQuery.from('CardOpsByJobId')
                .select('id, timeIn, timeOut')
                .withParameters({ jobId: jobId })
                .orderBy(orderBy)
                .toType('Sid01CardOps')
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                entity = data.results;
                //self.log('Retrieved [CardOps Partials] from remote data source', entity.length, true);
                return entity;
            }
        }



        function _jobNamePredicate(filterValue) {
            return Predicate
                .create('jobName', 'contains', filterValue)
                .or('jobName', 'contains', filterValue);
        }

        function _fullNamePredicate(filterValue) {
            return Predicate
                .create('jobId', 'contains', filterValue)
                .or('cardOpsId', 'contains', filterValue);
        }


        function getUnitFlaggedJobs(unitName, forceRemote) {
            var self = this;
            var entity;
            var orderBy;

            return EntityQuery.from('UnitFlaggedJobs')
                .select('id, jobTrackerId, flagTypeId, description, recommendation')
                .withParameters({ unitName: unitName })
                .orderBy(orderBy)
                .toType(entityNames.jobFlag)
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                entity = data.results;
                //self.log('Retrieved [CardOps Partials] from remote data source', entity.length, true);
                return entity;
            }
        }

        function getFlaggedJobs(forceRemote) {
            var self = this;
            var entity = [];
            var orderBy;

            return EntityQuery.from('FlaggedJobs')
                .select('id, jobTrackerId, flagTypeId, description, recommendation')
                .toType(entityNames.jobFlag)
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                entity = data.results;
                return entity;
            }
        }

        function getResolvedFlaggedJobs(forceRemote) {
            var self = this;
            var entity = [];
            var orderBy;

            return EntityQuery.from('ResolvedFlaggedJobs')
                .select('id, jobTrackerId, flagTypeId, description, recommendation')
                .toType(entityNames.jobFlag)
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                entity = data.results;
                return entity;
            }
        }
        
    }
})();