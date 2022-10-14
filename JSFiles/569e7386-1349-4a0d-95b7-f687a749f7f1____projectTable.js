/* eslint-disable */
//'use strict';


// Class definition

const ProjectTable = (function () {
    var dataSet;
    // Private functions

    const projectDiscussionsTable = async () => {
        const options = {
            // datasource definition
            data: {
              type: 'remote',
              source: {
                read: {
                  method: 'get',
                  url: `${HOST_URL}/api/v1/project/discussions/table`,
                  params: {
                    fields: '_id,_projectId,subject,description,datecreated,lastActivity,startedBy,createdBy,createdAt,updatedAt,updatedBy',
                  },
                  map: function(raw) {
                    // sample data mapping
                    console.log('raw', raw);
                    dataSet = raw;
                
                    if (typeof raw.projectDiscussions !== 'undefined') {
                      dataSet = raw.projectDiscussions;
                      console.log('dataSet', dataSet);
                    }
                    return dataSet;
                  }
        
                },
              },
              pageSize: 10,
              serverPaging: true,
              serverFiltering: true,
              serverSorting: true,
              //autoColumns: true,  // newly added
            },
        
            // layout definition
            layout: {
              scroll: true, // enable/disable datatable scroll both horizontal and
              footer: false, // display/hide footer
              height: 450,
        
            },
        
            // column sorting
            sortable: true,
        
            pagination: true,
            search: {
              input: $('#kt_datatable_search_query_2'),
              key: 'generalSearch',
            },
        
            // columns definition
            columns: [
              {
                field: '_id',
                title: '#',
                sortable: false,
                width: 20,
                selector: {
                  class: '',
                },
                textAlign: 'center',
              },
              {
                field: '_projectId',
                title: 'Project ID',
              },
              {
                field: 'subject',
                title: 'Subject',
              },
              {
                field: 'description',
                title: 'Description',
              },
              {
                field: 'datecreated',
                title: 'Date Created',
              },
              {
                field: 'lastActivity',
                title: 'Last Activity',
              },
              {
                field: 'startedBy',
                title: 'Started By',
              },

              {
                field: 'createdBy',
                title: 'createdBy',
              },
              {
                field: 'createdAt',
                title: 'createdAt',
              },
              {
                field: 'updatedAt',
                title: 'updatedAt',
              },
              {
                field: 'details',
                title: 'Details',
                textAlign: 'center',
                //width: 100,
                sortable: false,
                template: function () {
                  return '\
                    <a href="#" class="btn btn-sm btn-light" role="button">\
                      view details\
                    </a >\
                  '
                  ;
                },
              },
              {
                field: 'Actions',
                title: 'Actions',
                sortable: false,
                width: 125,
                overflow: 'visible',
                autoHide: false,
                template: function () {
                  return '\
                              <div class="dropdown dropdown-inline">\
                                  <a href="javascript:;" class="btn btn-sm btn-clean btn-icon mr-2" data-toggle="dropdown">\
                                    <i class="fas fa-cog">\
                                    </i>\
                                  </a>\
                                  <div class="dropdown-menu dropdown-menu-sm dropdown-menu-right">\
                                      <ul class="navi flex-column navi-hover py-2">\
                                          <li class="navi-header font-weight-bolder text-uppercase font-size-xs text-primary pb-2">\
                                              Choose an action:\
                                          </li>\
                                          <li class="navi-item">\
                                              <a href="#" class="navi-link">\
                                                  <span class="navi-icon"><i class="fas fa-print"></i></span>\
                                                  <span class="navi-text">Print</span>\
                                              </a>\
                                          </li>\
                                          <li class="navi-item">\
                                              <a href="#" class="navi-link">\
                                                  <span class="navi-icon"><i class="fas fa-copy"></i></span>\
                                                  <span class="navi-text">Copy</span>\
                                              </a>\
                                          </li>\
                                          <li class="navi-item">\
                                              <a href="#" class="navi-link">\
                                                  <span class="navi-icon"><i class="fas fa-file-excel"></i></span>\
                                                  <span class="navi-text">Excel</span>\
                                              </a>\
                                          </li>\
                                          <li class="navi-item">\
                                              <a href="#" class="navi-link">\
                                                  <span class="navi-icon"><i class="fas fa-file-csv"></i></span>\
                                                  <span class="navi-text">CSV</span>\
                                              </a>\
                                          </li>\
                                          <li class="navi-item">\
                                              <a href="#" class="navi-link">\
                                                  <span class="navi-icon"><i class="fas fa-file-pdf"></i></span>\
                                                  <span class="navi-text">PDF</span>\
                                              </a>\
                                          </li>\
                                      </ul>\
                                  </div>\
                              </div>\
                              <a href="javascript:;" class="btn btn-sm btn-clean btn-icon mr-2" title="Edit details">\
                                <i class="far fa-edit">\
                                </i>\
                              </a>\
                              <a href="javascript:;" class="btn btn-sm btn-clean btn-icon" title="Delete">\
                                <i class="far fa-trash-alt">\
                                </i>\
                              </a>\
                          ';
                },
              },
            ],
          }
          
          // enable extension
          options.extensions = {
            // boolean or object (extension options)
            checkbox: true,
          };
      
      
          const datatable = $('#kt_datatable_2').KTDatatable(options);
      
          $('#kt_datatable_search_status_2').on('change', function () {
            datatable.search($(this).val().toLowerCase(), 'Status');
          });
      
          $('#kt_datatable_search_type_2').on('change', function () {
            datatable.search($(this).val().toLowerCase(), 'Type');
          });
      
          $(
            '#kt_datatable_search_status_2, #kt_datatable_search_type_2'
          ).selectpicker();
      
          datatable.on('datatable-on-click-checkbox', function (e) {
            // datatable.checkbox() access to extension methods
            const ids = datatable.checkbox().getSelectedId();
            const count = ids.length;
      
            $('#kt_datatable_selected_records_2').html(count);
      
            if (count > 0) {
              $('#kt_datatable_group_action_form_2').collapse('show');
            } else {
              $('#kt_datatable_group_action_form_2').collapse('hide');
            }
          });
      
            
    };
    const projectMembersTable = async () => {
        const options = {
            // datasource definition
            data: {
              type: 'remote',
              source: {
                read: {
                  method: 'get',
                  url: `${HOST_URL}/api/v1/project/members/table`,
                  params: {
                    fields: '_id,_projectId,_userId,status,createdBy,createdAt,updatedAt,updatedBy',
                  },
                  map: function(raw) {
                    // sample data mapping
                    console.log('raw', raw);
                    dataSet = raw;
                
                    if (typeof raw.projectMembers !== 'undefined') {
                      dataSet = raw.projectMembers;
                      console.log('dataSet', dataSet);
                    }
                    return dataSet;
                  }
        
                },
              },
              pageSize: 10,
              serverPaging: true,
              serverFiltering: true,
              serverSorting: true,
              //autoColumns: true,  // newly added
            },
        
            // layout definition
            layout: {
              scroll: true, // enable/disable datatable scroll both horizontal and
              footer: false, // display/hide footer
              height: 450,
        
            },
        
            // column sorting
            sortable: true,
        
            pagination: true,
            search: {
              input: $('#kt_datatable_search_query_2'),
              key: 'generalSearch',
            },
        
            // columns definition
            columns: [
              {
                field: '_id',
                title: '#',
                sortable: false,
                width: 20,
                selector: {
                  class: '',
                },
                textAlign: 'center',
              },
              {
                field: '_projectId',
                title: 'Project ID',
              },
              {
                field: '_userId',
                title: 'User Id',
              },
              {
                field: 'status',
                title: 'Status',
              },
              {
                field: 'createdBy',
                title: 'createdBy',
              },
              {
                field: 'createdAt',
                title: 'createdAt',
              },
              {
                field: 'updatedAt',
                title: 'updatedAt',
              },
              {
                field: 'details',
                title: 'Details',
                textAlign: 'center',
                //width: 100,
                sortable: false,
                template: function () {
                  return '\
                    <a href="#" class="btn btn-sm btn-light" role="button">\
                      view details\
                    </a >\
                  '
                  ;
                },
              },
              {
                field: 'Actions',
                title: 'Actions',
                sortable: false,
                width: 125,
                overflow: 'visible',
                autoHide: false,
                template: function () {
                  return '\
                              <div class="dropdown dropdown-inline">\
                                  <a href="javascript:;" class="btn btn-sm btn-clean btn-icon mr-2" data-toggle="dropdown">\
                                    <i class="fas fa-cog">\
                                    </i>\
                                  </a>\
                                  <div class="dropdown-menu dropdown-menu-sm dropdown-menu-right">\
                                      <ul class="navi flex-column navi-hover py-2">\
                                          <li class="navi-header font-weight-bolder text-uppercase font-size-xs text-primary pb-2">\
                                              Choose an action:\
                                          </li>\
                                          <li class="navi-item">\
                                              <a href="#" class="navi-link">\
                                                  <span class="navi-icon"><i class="fas fa-print"></i></span>\
                                                  <span class="navi-text">Print</span>\
                                              </a>\
                                          </li>\
                                          <li class="navi-item">\
                                              <a href="#" class="navi-link">\
                                                  <span class="navi-icon"><i class="fas fa-copy"></i></span>\
                                                  <span class="navi-text">Copy</span>\
                                              </a>\
                                          </li>\
                                          <li class="navi-item">\
                                              <a href="#" class="navi-link">\
                                                  <span class="navi-icon"><i class="fas fa-file-excel"></i></span>\
                                                  <span class="navi-text">Excel</span>\
                                              </a>\
                                          </li>\
                                          <li class="navi-item">\
                                              <a href="#" class="navi-link">\
                                                  <span class="navi-icon"><i class="fas fa-file-csv"></i></span>\
                                                  <span class="navi-text">CSV</span>\
                                              </a>\
                                          </li>\
                                          <li class="navi-item">\
                                              <a href="#" class="navi-link">\
                                                  <span class="navi-icon"><i class="fas fa-file-pdf"></i></span>\
                                                  <span class="navi-text">PDF</span>\
                                              </a>\
                                          </li>\
                                      </ul>\
                                  </div>\
                              </div>\
                              <a href="javascript:;" class="btn btn-sm btn-clean btn-icon mr-2" title="Edit details">\
                                <i class="far fa-edit">\
                                </i>\
                              </a>\
                              <a href="javascript:;" class="btn btn-sm btn-clean btn-icon" title="Delete">\
                                <i class="far fa-trash-alt">\
                                </i>\
                              </a>\
                          ';
                },
              },
            ],
          }
          
          // enable extension
          options.extensions = {
            // boolean or object (extension options)
            checkbox: true,
          };

    };
    const projectTaskRemindersTable = async () => {
        const options = {
            // datasource definition
            data: {
              type: 'remote',
              source: {
                read: {
                  method: 'get',
                  url: `${HOST_URL}/api/v1/project/task-reminders/table`,
                  params: {
                    fields: '_id,description,date,_taskId,isNotified,notifyByEmail,creator,createdBy,createdAt,updatedAt,updatedBy',
                  },
                  map: function(raw) {
                    // sample data mapping
                    console.log('raw', raw);
                    dataSet = raw;
                
                    if (typeof raw.projectTaskReminders !== 'undefined') {
                      dataSet = raw.projectTaskReminders;
                      console.log('dataSet', dataSet);
                    }
                    return dataSet;
                  }
        
                },
              },
              pageSize: 10,
              serverPaging: true,
              serverFiltering: true,
              serverSorting: true,
              //autoColumns: true,  // newly added
            },
        
            // layout definition
            layout: {
              scroll: true, // enable/disable datatable scroll both horizontal and
              footer: false, // display/hide footer
              height: 450,
        
            },
        
            // column sorting
            sortable: true,
        
            pagination: true,
            search: {
              input: $('#kt_datatable_search_query_2'),
              key: 'generalSearch',
            },
        
            // columns definition
            columns: [
              {
                field: '_id',
                title: '#',
                sortable: false,
                width: 20,
                selector: {
                  class: '',
                },
                textAlign: 'center',
              },
              {
                field: 'description',
                title: 'Description',
              },
              {
                field: 'date',
                title: 'Date',
              },
              {
                field: '_taskId',
                title: 'Task ID',
              },
              {
                field: 'isNotified',
                title: 'Is Notified',
              },
              {
                field: 'notifyByEmail',
                title: 'Notify By Email',
              },
              {
                field: 'creator',
                title: 'Creator',
              },

              {
                field: 'createdBy',
                title: 'createdBy',
              },
              {
                field: 'createdAt',
                title: 'createdAt',
              },
              {
                field: 'updatedAt',
                title: 'updatedAt',
              },
              {
                field: 'details',
                title: 'Details',
                textAlign: 'center',
                //width: 100,
                sortable: false,
                template: function () {
                  return '\
                    <a href="#" class="btn btn-sm btn-light" role="button">\
                      view details\
                    </a >\
                  '
                  ;
                },
              },
              {
                field: 'Actions',
                title: 'Actions',
                sortable: false,
                width: 125,
                overflow: 'visible',
                autoHide: false,
                template: function () {
                  return '\
                              <div class="dropdown dropdown-inline">\
                                  <a href="javascript:;" class="btn btn-sm btn-clean btn-icon mr-2" data-toggle="dropdown">\
                                    <i class="fas fa-cog">\
                                    </i>\
                                  </a>\
                                  <div class="dropdown-menu dropdown-menu-sm dropdown-menu-right">\
                                      <ul class="navi flex-column navi-hover py-2">\
                                          <li class="navi-header font-weight-bolder text-uppercase font-size-xs text-primary pb-2">\
                                              Choose an action:\
                                          </li>\
                                          <li class="navi-item">\
                                              <a href="#" class="navi-link">\
                                                  <span class="navi-icon"><i class="fas fa-print"></i></span>\
                                                  <span class="navi-text">Print</span>\
                                              </a>\
                                          </li>\
                                          <li class="navi-item">\
                                              <a href="#" class="navi-link">\
                                                  <span class="navi-icon"><i class="fas fa-copy"></i></span>\
                                                  <span class="navi-text">Copy</span>\
                                              </a>\
                                          </li>\
                                          <li class="navi-item">\
                                              <a href="#" class="navi-link">\
                                                  <span class="navi-icon"><i class="fas fa-file-excel"></i></span>\
                                                  <span class="navi-text">Excel</span>\
                                              </a>\
                                          </li>\
                                          <li class="navi-item">\
                                              <a href="#" class="navi-link">\
                                                  <span class="navi-icon"><i class="fas fa-file-csv"></i></span>\
                                                  <span class="navi-text">CSV</span>\
                                              </a>\
                                          </li>\
                                          <li class="navi-item">\
                                              <a href="#" class="navi-link">\
                                                  <span class="navi-icon"><i class="fas fa-file-pdf"></i></span>\
                                                  <span class="navi-text">PDF</span>\
                                              </a>\
                                          </li>\
                                      </ul>\
                                  </div>\
                              </div>\
                              <a href="javascript:;" class="btn btn-sm btn-clean btn-icon mr-2" title="Edit details">\
                                <i class="far fa-edit">\
                                </i>\
                              </a>\
                              <a href="javascript:;" class="btn btn-sm btn-clean btn-icon" title="Delete">\
                                <i class="far fa-trash-alt">\
                                </i>\
                              </a>\
                          ';
                },
              },
            ],
          }
          
          // enable extension
          options.extensions = {
            // boolean or object (extension options)
            checkbox: true,
          };
      
      
          const datatable = $('#kt_datatable_2').KTDatatable(options);
      
          $('#kt_datatable_search_status_2').on('change', function () {
            datatable.search($(this).val().toLowerCase(), 'Status');
          });
      
          $('#kt_datatable_search_type_2').on('change', function () {
            datatable.search($(this).val().toLowerCase(), 'Type');
          });
      
          $(
            '#kt_datatable_search_status_2, #kt_datatable_search_type_2'
          ).selectpicker();
      
          datatable.on('datatable-on-click-checkbox', function (e) {
            // datatable.checkbox() access to extension methods
            const ids = datatable.checkbox().getSelectedId();
            const count = ids.length;
      
            $('#kt_datatable_selected_records_2').html(count);
      
            if (count > 0) {
              $('#kt_datatable_group_action_form_2').collapse('show');
            } else {
              $('#kt_datatable_group_action_form_2').collapse('hide');
            }
          });
      
            
    };  
    const projectTaskStatusTable = async () => {
        const options = {
            // datasource definition
            data: {
              type: 'remote',
              source: {
                read: {
                  method: 'get',
                  url: `${HOST_URL}/api/v1/project/task-status/table`,
                  params: {
                    fields: '_id,status,deadlineNotified,kanbanOrder,milestoneOrder,_taskId,_projectId,_userId,progress,createdBy,createdAt,updatedAt,updatedBy',
                  },
                  map: function(raw) {
                    // sample data mapping
                    console.log('raw', raw);
                    dataSet = raw;
                
                    if (typeof raw.projectTaskStatus !== 'undefined') {
                      dataSet = raw.projectTaskStatus;
                      console.log('dataSet', dataSet);
                    }
                    return dataSet;
                  }
        
                },
              },
              pageSize: 10,
              serverPaging: true,
              serverFiltering: true,
              serverSorting: true,
              //autoColumns: true,  // newly added
            },
        
            // layout definition
            layout: {
              scroll: true, // enable/disable datatable scroll both horizontal and
              footer: false, // display/hide footer
              height: 450,
        
            },
        
            // column sorting
            sortable: true,
        
            pagination: true,
            search: {
              input: $('#kt_datatable_search_query_2'),
              key: 'generalSearch',
            },
        
            // columns definition
            columns: [
              {
                field: '_id',
                title: '#',
                sortable: false,
                width: 20,
                selector: {
                  class: '',
                },
                textAlign: 'center',
              },
              {
                field: 'status',
                title: 'Status',
              },
              {
                field: 'deadlineNotified',
                title: 'Deadline Notified',
              },
              {
                field: 'kanbanOrder',
                title: 'Kanban Order',
              },
              {
                field: 'milestoneOrder',
                title: 'Milestone Order',
              },
              {
                field: '_taskId',
                title: 'Task ID',
              },
              {
                field: '_projectId',
                title: 'Project ID',
              },
              {
                field: '_userId',
                title: 'User ID',
              },
              {
                field: 'progress',
                title: 'Progress',
              },              
              {
                field: 'createdBy',
                title: 'createdBy',
              },
              {
                field: 'createdAt',
                title: 'createdAt',
              },
              {
                field: 'updatedAt',
                title: 'updatedAt',
              },
              {
                field: 'details',
                title: 'Details',
                textAlign: 'center',
                //width: 100,
                sortable: false,
                template: function () {
                  return '\
                    <a href="#" class="btn btn-sm btn-light" role="button">\
                      view details\
                    </a >\
                  '
                  ;
                },
              },
              {
                field: 'Actions',
                title: 'Actions',
                sortable: false,
                width: 125,
                overflow: 'visible',
                autoHide: false,
                template: function () {
                  return '\
                              <div class="dropdown dropdown-inline">\
                                  <a href="javascript:;" class="btn btn-sm btn-clean btn-icon mr-2" data-toggle="dropdown">\
                                    <i class="fas fa-cog">\
                                    </i>\
                                  </a>\
                                  <div class="dropdown-menu dropdown-menu-sm dropdown-menu-right">\
                                      <ul class="navi flex-column navi-hover py-2">\
                                          <li class="navi-header font-weight-bolder text-uppercase font-size-xs text-primary pb-2">\
                                              Choose an action:\
                                          </li>\
                                          <li class="navi-item">\
                                              <a href="#" class="navi-link">\
                                                  <span class="navi-icon"><i class="fas fa-print"></i></span>\
                                                  <span class="navi-text">Print</span>\
                                              </a>\
                                          </li>\
                                          <li class="navi-item">\
                                              <a href="#" class="navi-link">\
                                                  <span class="navi-icon"><i class="fas fa-copy"></i></span>\
                                                  <span class="navi-text">Copy</span>\
                                              </a>\
                                          </li>\
                                          <li class="navi-item">\
                                              <a href="#" class="navi-link">\
                                                  <span class="navi-icon"><i class="fas fa-file-excel"></i></span>\
                                                  <span class="navi-text">Excel</span>\
                                              </a>\
                                          </li>\
                                          <li class="navi-item">\
                                              <a href="#" class="navi-link">\
                                                  <span class="navi-icon"><i class="fas fa-file-csv"></i></span>\
                                                  <span class="navi-text">CSV</span>\
                                              </a>\
                                          </li>\
                                          <li class="navi-item">\
                                              <a href="#" class="navi-link">\
                                                  <span class="navi-icon"><i class="fas fa-file-pdf"></i></span>\
                                                  <span class="navi-text">PDF</span>\
                                              </a>\
                                          </li>\
                                      </ul>\
                                  </div>\
                              </div>\
                              <a href="javascript:;" class="btn btn-sm btn-clean btn-icon mr-2" title="Edit details">\
                                <i class="far fa-edit">\
                                </i>\
                              </a>\
                              <a href="javascript:;" class="btn btn-sm btn-clean btn-icon" title="Delete">\
                                <i class="far fa-trash-alt">\
                                </i>\
                              </a>\
                          ';
                },
              },
            ],
          }
          
          // enable extension
          options.extensions = {
            // boolean or object (extension options)
            checkbox: true,
          };
      
      
          const datatable = $('#kt_datatable_2').KTDatatable(options);
      
          $('#kt_datatable_search_status_2').on('change', function () {
            datatable.search($(this).val().toLowerCase(), 'Status');
          });
      
          $('#kt_datatable_search_type_2').on('change', function () {
            datatable.search($(this).val().toLowerCase(), 'Type');
          });
      
          $(
            '#kt_datatable_search_status_2, #kt_datatable_search_type_2'
          ).selectpicker();
      
          datatable.on('datatable-on-click-checkbox', function (e) {
            // datatable.checkbox() access to extension methods
            const ids = datatable.checkbox().getSelectedId();
            const count = ids.length;
      
            $('#kt_datatable_selected_records_2').html(count);
      
            if (count > 0) {
              $('#kt_datatable_group_action_form_2').collapse('show');
            } else {
              $('#kt_datatable_group_action_form_2').collapse('hide');
            }
          });
      
            
    };









    return {
        // public functions
        init: function () {
          projectDiscussionsTable();
          projectMembersTable();
          projectTaskRemindersTable();
          projectTaskStatusTable();
        },
      };
    })();
    
    jQuery(document).ready(function () {
        ProjectTable.init();
    });
  