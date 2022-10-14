
var TableDatatablesColreorder = function () {

    var initTable = function () {
        var oTable = $('#tbl_order').DataTable({
            "ajax"            : ROUTE_DATATABLE,
            "bInfo": false,
            "processing": true,
            "columns"         : [
                {"data" : "id", "width":"50px"},
                {"data" : "branch"},
                {"data" : "code"},
                {"data" : "date_transaction"},
                {"data" : "customer"},
                {"data" : "pay"},
                {"data" : "payment"},
                {"data" : "paid"},
                {"data" : "status"},
                {"data" : "created_by"},
                {"data" : "updated_by"},
                {"data" : "href", "width":"150px"}
            ],
            // Internationalisation. For more info refer to http://datatables.net/manual/i18n
            "language": {
                "aria": {
                    "sortAscending": ": activate to sort column ascending",
                    "sortDescending": ": activate to sort column descending"
                },
                "emptyTable": "No data available in table",
                "info": "Showing _START_ to _END_ of _TOTAL_ entries",
                "infoEmpty": "No entries found",
                "infoFiltered": "(filtered1 from _MAX_ total entries)",
                "lengthMenu": "_MENU_ entries",
                "search": "Search:",
                "zeroRecords": "No matching records found"
            },

            // Or you can use remote translation file
            //"language": {
            //   url: '//cdn.datatables.net/plug-ins/3cfcc339e89/i18n/Portuguese.json'
            //},

            // setup buttons extentension: http://datatables.net/extensions/buttons/
            buttons: [
            ],

            // setup responsive extension: http://datatables.net/extensions/responsive/
            responsive: true,
            "bLengthChange": false,
            // setup colreorder extension: http://datatables.net/extensions/colreorder/
            colReorder: {
                reorderCallback: function () {
                    console.log( 'callback' );
                }
            },

            "columnDefs": [
                {
                "targets": 0,
                "visible": false
                },
                {
                "targets": 3,
                "orderable": false
                }

            ],

            "order": [
                [0, 'desc']
            ],

            "lengthMenu": [
                [5, 10, 15, 20, -1],
                [5, 10, 15, 20, "All"] // change per page values here
            ],
            // set the initial value
            "pageLength": 10,

            "dom": "<'row' <'col-md-12'B>><'row'<'col-md-6 col-sm-12'l><'col-md-6 col-sm-12'f>r><'table-scrollable't><'row'<'col-md-5 col-sm-12'i><'col-md-7 col-sm-12'p>>", // horizobtal scrollable datatable

            // Uncomment below line("dom" parameter) to fix the dropdown overflow issue in the datatable cells. The default datatable layout
            // setup uses scrollable div(table-scrollable) with overflow:auto to enable vertical scroll(see: assets/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.js).
            // So when dropdowns used the scrollable div should be removed.
            //"dom": "<'row' <'col-md-12'T>><'row'<'col-md-6 col-sm-12'l><'col-md-6 col-sm-12'f>r>t<'row'<'col-md-5 col-sm-12'i><'col-md-7 col-sm-12'p>>",
        });

        setInterval( function () {
            oTable.ajax.reload(); // user paging is not reset on reload
        }, 100000 );
    }

    var initTable2 = function () {
        var oTable = $('#tbl_order_done').DataTable({
            "ajax"            : ROUTE_DATATABLE_DONE,
            "bInfo": false,
            "processing": true,
            "columns"         : [
                {"data" : "id", "width":"50px"},
                {"data" : "branch"},
                {"data" : "code"},
                {"data" : "date_transaction"},
                {"data" : "customer"},
                {"data" : "pay"},
                {"data" : "payment"},
                {"data" : "paid"},
                {"data" : "status"},
                {"data" : "created_by"},
                {"data" : "updated_by"},
                {"data" : "href", "width":"150px"}
            ],
            // Internationalisation. For more info refer to http://datatables.net/manual/i18n
            "language": {
                "aria": {
                    "sortAscending": ": activate to sort column ascending",
                    "sortDescending": ": activate to sort column descending"
                },
                "emptyTable": "No data available in table",
                "info": "Showing _START_ to _END_ of _TOTAL_ entries",
                "infoEmpty": "No entries found",
                "infoFiltered": "(filtered1 from _MAX_ total entries)",
                "lengthMenu": "_MENU_ entries",
                "search": "Search:",
                "zeroRecords": "No matching records found"
            },

            // Or you can use remote translation file
            //"language": {
            //   url: '//cdn.datatables.net/plug-ins/3cfcc339e89/i18n/Portuguese.json'
            //},

            // setup buttons extentension: http://datatables.net/extensions/buttons/
            buttons: [
            ],

            // setup responsive extension: http://datatables.net/extensions/responsive/
            responsive: true,
            "bLengthChange": false,
            // setup colreorder extension: http://datatables.net/extensions/colreorder/
            colReorder: {
                reorderCallback: function () {
                    console.log( 'callback' );
                }
            },

            "columnDefs": [
                {
                "targets": 0,
                "visible": false
                },
                {
                "targets": 3,
                "orderable": false
                }

            ],

            "order": [
                [0, 'desc']
            ],

            "lengthMenu": [
                [5, 10, 15, 20, -1],
                [5, 10, 15, 20, "All"] // change per page values here
            ],
            // set the initial value
            "pageLength": 10,

            "dom": "<'row' <'col-md-12'B>><'row'<'col-md-6 col-sm-12'l><'col-md-6 col-sm-12'f>r><'table-scrollable't><'row'<'col-md-5 col-sm-12'i><'col-md-7 col-sm-12'p>>", // horizobtal scrollable datatable

            // Uncomment below line("dom" parameter) to fix the dropdown overflow issue in the datatable cells. The default datatable layout
            // setup uses scrollable div(table-scrollable) with overflow:auto to enable vertical scroll(see: assets/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.js).
            // So when dropdowns used the scrollable div should be removed.
            //"dom": "<'row' <'col-md-12'T>><'row'<'col-md-6 col-sm-12'l><'col-md-6 col-sm-12'f>r>t<'row'<'col-md-5 col-sm-12'i><'col-md-7 col-sm-12'p>>",
        });

        setInterval( function () {
            oTable.ajax.reload(); // user paging is not reset on reload
        }, 100000 );
    }

    var initTable3 = function () {
        var oTable = $('#tbl_order_takeitems').DataTable({
            "ajax"            : ROUTE_DATATABLE_TAKEITEMS,
            "bInfo": false,
            "processing": true,
            "columns"         : [
                {"data" : "id", "width":"50px"},
                {"data" : "branch"},
                {"data" : "code"},
                {"data" : "date_transaction"},
                {"data" : "customer"},
                {"data" : "pay"},
                {"data" : "payment"},
                {"data" : "paid"},
                {"data" : "status"},
                {"data" : "created_by"},
                {"data" : "updated_by"},
                {"data" : "href", "width":"150px"}
            ],
            // Internationalisation. For more info refer to http://datatables.net/manual/i18n
            "language": {
                "aria": {
                    "sortAscending": ": activate to sort column ascending",
                    "sortDescending": ": activate to sort column descending"
                },
                "emptyTable": "No data available in table",
                "info": "Showing _START_ to _END_ of _TOTAL_ entries",
                "infoEmpty": "No entries found",
                "infoFiltered": "(filtered1 from _MAX_ total entries)",
                "lengthMenu": "_MENU_ entries",
                "search": "Search:",
                "zeroRecords": "No matching records found"
            },

            // Or you can use remote translation file
            //"language": {
            //   url: '//cdn.datatables.net/plug-ins/3cfcc339e89/i18n/Portuguese.json'
            //},

            // setup buttons extentension: http://datatables.net/extensions/buttons/
            buttons: [
            ],

            // setup responsive extension: http://datatables.net/extensions/responsive/
            responsive: true,
            "bLengthChange": false,
            // setup colreorder extension: http://datatables.net/extensions/colreorder/
            colReorder: {
                reorderCallback: function () {
                    console.log( 'callback' );
                }
            },

            "columnDefs": [
                {
                "targets": 0,
                "visible": false
                },
                {
                "targets": 3,
                "orderable": false
                }

            ],

            "order": [
                [0, 'desc']
            ],

            "lengthMenu": [
                [5, 10, 15, 20, -1],
                [5, 10, 15, 20, "All"] // change per page values here
            ],
            // set the initial value
            "pageLength": 10,

            "dom": "<'row' <'col-md-12'B>><'row'<'col-md-6 col-sm-12'l><'col-md-6 col-sm-12'f>r><'table-scrollable't><'row'<'col-md-5 col-sm-12'i><'col-md-7 col-sm-12'p>>", // horizobtal scrollable datatable

            // Uncomment below line("dom" parameter) to fix the dropdown overflow issue in the datatable cells. The default datatable layout
            // setup uses scrollable div(table-scrollable) with overflow:auto to enable vertical scroll(see: assets/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.js).
            // So when dropdowns used the scrollable div should be removed.
            //"dom": "<'row' <'col-md-12'T>><'row'<'col-md-6 col-sm-12'l><'col-md-6 col-sm-12'f>r>t<'row'<'col-md-5 col-sm-12'i><'col-md-7 col-sm-12'p>>",
        });

        setInterval( function () {
            oTable.ajax.reload(); // user paging is not reset on reload
        }, 100000 );
    }


    var initTable4 = function () {
        var oTable = $('#tbl_order_all').DataTable({
            "ajax"            : ROUTE_DATATABLE_ALL,
            "bInfo": false,
            "processing": true,
            "columns"         : [
                {"data" : "id", "width":"50px"},
                {"data" : "branch"},
                {"data" : "code"},
                {"data" : "date_transaction"},
                {"data" : "customer"},
                {"data" : "pay"},
                {"data" : "payment"},
                {"data" : "paid"},
                {"data" : "status"},
                {"data" : "created_by"},
                {"data" : "updated_by"},
                {"data" : "href", "width":"150px"}
            ],
            // Internationalisation. For more info refer to http://datatables.net/manual/i18n
            "language": {
                "aria": {
                    "sortAscending": ": activate to sort column ascending",
                    "sortDescending": ": activate to sort column descending"
                },
                "emptyTable": "No data available in table",
                "info": "Showing _START_ to _END_ of _TOTAL_ entries",
                "infoEmpty": "No entries found",
                "infoFiltered": "(filtered1 from _MAX_ total entries)",
                "lengthMenu": "_MENU_ entries",
                "search": "Search:",
                "zeroRecords": "No matching records found"
            },

            // Or you can use remote translation file
            //"language": {
            //   url: '//cdn.datatables.net/plug-ins/3cfcc339e89/i18n/Portuguese.json'
            //},

            // setup buttons extentension: http://datatables.net/extensions/buttons/
            buttons: [
            ],

            // setup responsive extension: http://datatables.net/extensions/responsive/
            responsive: true,
            "bLengthChange": false,
            // setup colreorder extension: http://datatables.net/extensions/colreorder/
            colReorder: {
                reorderCallback: function () {
                    console.log( 'callback' );
                }
            },

            "columnDefs": [
                {
                "targets": 0,
                "visible": false
                },
                {
                "targets": 3,
                "orderable": false
                }

            ],

            "order": [
                [0, 'desc']
            ],

            "lengthMenu": [
                [5, 10, 15, 20, -1],
                [5, 10, 15, 20, "All"] // change per page values here
            ],
            // set the initial value
            "pageLength": 10,

            "dom": "<'row' <'col-md-12'B>><'row'<'col-md-6 col-sm-12'l><'col-md-6 col-sm-12'f>r><'table-scrollable't><'row'<'col-md-5 col-sm-12'i><'col-md-7 col-sm-12'p>>", // horizobtal scrollable datatable

            // Uncomment below line("dom" parameter) to fix the dropdown overflow issue in the datatable cells. The default datatable layout
            // setup uses scrollable div(table-scrollable) with overflow:auto to enable vertical scroll(see: assets/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.js).
            // So when dropdowns used the scrollable div should be removed.
            //"dom": "<'row' <'col-md-12'T>><'row'<'col-md-6 col-sm-12'l><'col-md-6 col-sm-12'f>r>t<'row'<'col-md-5 col-sm-12'i><'col-md-7 col-sm-12'p>>",
        });

        setInterval( function () {
            oTable.ajax.reload(); // user paging is not reset on reload
        }, 100000 );
    }


    var initTable5 = function () {
        var oTable = $('#tbl_order_kirimworkshop').DataTable({
            "ajax"            : ROUTE_DATATABLE_KIRIMWORKSHOP,
            "bInfo": false,
            "processing": true,
            "columns"         : [
                {"data" : "id", "width":"50px"},
                {"data" : "branch"},
                {"data" : "code"},
                {"data" : "date_transaction"},
                {"data" : "customer"},
                {"data" : "pay"},
                {"data" : "payment"},
                {"data" : "paid"},
                {"data" : "status"},
                {"data" : "created_by"},
                {"data" : "updated_by"},
                {"data" : "href", "width":"150px"}
            ],
            // Internationalisation. For more info refer to http://datatables.net/manual/i18n
            "language": {
                "aria": {
                    "sortAscending": ": activate to sort column ascending",
                    "sortDescending": ": activate to sort column descending"
                },
                "emptyTable": "No data available in table",
                "info": "Showing _START_ to _END_ of _TOTAL_ entries",
                "infoEmpty": "No entries found",
                "infoFiltered": "(filtered1 from _MAX_ total entries)",
                "lengthMenu": "_MENU_ entries",
                "search": "Search:",
                "zeroRecords": "No matching records found"
            },

            // Or you can use remote translation file
            //"language": {
            //   url: '//cdn.datatables.net/plug-ins/3cfcc339e89/i18n/Portuguese.json'
            //},

            // setup buttons extentension: http://datatables.net/extensions/buttons/
            buttons: [
            ],

            // setup responsive extension: http://datatables.net/extensions/responsive/
            responsive: true,
            "bLengthChange": false,
            // setup colreorder extension: http://datatables.net/extensions/colreorder/
            colReorder: {
                reorderCallback: function () {
                    console.log( 'callback' );
                }
            },

            "columnDefs": [
                {
                "targets": 0,
                "visible": false
                },
                {
                "targets": 3,
                "orderable": false
                }

            ],

            "order": [
                [0, 'desc']
            ],

            "lengthMenu": [
                [5, 10, 15, 20, -1],
                [5, 10, 15, 20, "All"] // change per page values here
            ],
            // set the initial value
            "pageLength": 10,

            "dom": "<'row' <'col-md-12'B>><'row'<'col-md-6 col-sm-12'l><'col-md-6 col-sm-12'f>r><'table-scrollable't><'row'<'col-md-5 col-sm-12'i><'col-md-7 col-sm-12'p>>", // horizobtal scrollable datatable

            // Uncomment below line("dom" parameter) to fix the dropdown overflow issue in the datatable cells. The default datatable layout
            // setup uses scrollable div(table-scrollable) with overflow:auto to enable vertical scroll(see: assets/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.js).
            // So when dropdowns used the scrollable div should be removed.
            //"dom": "<'row' <'col-md-12'T>><'row'<'col-md-6 col-sm-12'l><'col-md-6 col-sm-12'f>r>t<'row'<'col-md-5 col-sm-12'i><'col-md-7 col-sm-12'p>>",
        });

        setInterval( function () {
            oTable.ajax.reload(); // user paging is not reset on reload
        }, 100000 );
    }


    var initTable6 = function () {
        var oTable = $('#tbl_order_proccessworkshop').DataTable({
            "ajax"            : ROUTE_DATATABLE_PROCCESSWORKSHOP,
            "bInfo": false,
            "processing": true,
            "columns"         : [
                {"data" : "id", "width":"50px"},
                {"data" : "branch"},
                {"data" : "code"},
                {"data" : "date_transaction"},
                {"data" : "customer"},
                {"data" : "pay"},
                {"data" : "payment"},
                {"data" : "paid"},
                {"data" : "status"},
                {"data" : "created_by"},
                {"data" : "updated_by"},
                {"data" : "href", "width":"150px"}
            ],
            // Internationalisation. For more info refer to http://datatables.net/manual/i18n
            "language": {
                "aria": {
                    "sortAscending": ": activate to sort column ascending",
                    "sortDescending": ": activate to sort column descending"
                },
                "emptyTable": "No data available in table",
                "info": "Showing _START_ to _END_ of _TOTAL_ entries",
                "infoEmpty": "No entries found",
                "infoFiltered": "(filtered1 from _MAX_ total entries)",
                "lengthMenu": "_MENU_ entries",
                "search": "Search:",
                "zeroRecords": "No matching records found"
            },

            // Or you can use remote translation file
            //"language": {
            //   url: '//cdn.datatables.net/plug-ins/3cfcc339e89/i18n/Portuguese.json'
            //},

            // setup buttons extentension: http://datatables.net/extensions/buttons/
            buttons: [
            ],

            // setup responsive extension: http://datatables.net/extensions/responsive/
            responsive: true,
            "bLengthChange": false,
            // setup colreorder extension: http://datatables.net/extensions/colreorder/
            colReorder: {
                reorderCallback: function () {
                    console.log( 'callback' );
                }
            },

            "columnDefs": [
                {
                "targets": 0,
                "visible": false
                },
                {
                "targets": 3,
                "orderable": false
                }

            ],

            "order": [
                [0, 'desc']
            ],

            "lengthMenu": [
                [5, 10, 15, 20, -1],
                [5, 10, 15, 20, "All"] // change per page values here
            ],
            // set the initial value
            "pageLength": 10,

            "dom": "<'row' <'col-md-12'B>><'row'<'col-md-6 col-sm-12'l><'col-md-6 col-sm-12'f>r><'table-scrollable't><'row'<'col-md-5 col-sm-12'i><'col-md-7 col-sm-12'p>>", // horizobtal scrollable datatable

            // Uncomment below line("dom" parameter) to fix the dropdown overflow issue in the datatable cells. The default datatable layout
            // setup uses scrollable div(table-scrollable) with overflow:auto to enable vertical scroll(see: assets/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.js).
            // So when dropdowns used the scrollable div should be removed.
            //"dom": "<'row' <'col-md-12'T>><'row'<'col-md-6 col-sm-12'l><'col-md-6 col-sm-12'f>r>t<'row'<'col-md-5 col-sm-12'i><'col-md-7 col-sm-12'p>>",
        });

        setInterval( function () {
            oTable.ajax.reload(); // user paging is not reset on reload
        }, 100000 );
    }

    var initTable7 = function () {
        var oTable = $('#tbl_order_kirimcounter').DataTable({
            "ajax"            : ROUTE_DATATABLE_KIRIMCOUNTER,
            "bInfo": false,
            "processing": true,
            "columns"         : [
                {"data" : "id", "width":"50px"},
                {"data" : "branch"},
                {"data" : "code"},
                {"data" : "date_transaction"},
                {"data" : "customer"},
                {"data" : "pay"},
                {"data" : "payment"},
                {"data" : "paid"},
                {"data" : "status"},
                {"data" : "created_by"},
                {"data" : "updated_by"},
                {"data" : "href", "width":"150px"}
            ],
            // Internationalisation. For more info refer to http://datatables.net/manual/i18n
            "language": {
                "aria": {
                    "sortAscending": ": activate to sort column ascending",
                    "sortDescending": ": activate to sort column descending"
                },
                "emptyTable": "No data available in table",
                "info": "Showing _START_ to _END_ of _TOTAL_ entries",
                "infoEmpty": "No entries found",
                "infoFiltered": "(filtered1 from _MAX_ total entries)",
                "lengthMenu": "_MENU_ entries",
                "search": "Search:",
                "zeroRecords": "No matching records found"
            },

            // Or you can use remote translation file
            //"language": {
            //   url: '//cdn.datatables.net/plug-ins/3cfcc339e89/i18n/Portuguese.json'
            //},

            // setup buttons extentension: http://datatables.net/extensions/buttons/
            buttons: [
            ],

            // setup responsive extension: http://datatables.net/extensions/responsive/
            responsive: true,
            "bLengthChange": false,
            // setup colreorder extension: http://datatables.net/extensions/colreorder/
            colReorder: {
                reorderCallback: function () {
                    console.log( 'callback' );
                }
            },

            "columnDefs": [
                {
                "targets": 0,
                "visible": false
                },
                {
                "targets": 3,
                "orderable": false
                }

            ],

            "order": [
                [0, 'desc']
            ],

            "lengthMenu": [
                [5, 10, 15, 20, -1],
                [5, 10, 15, 20, "All"] // change per page values here
            ],
            // set the initial value
            "pageLength": 10,

            "dom": "<'row' <'col-md-12'B>><'row'<'col-md-6 col-sm-12'l><'col-md-6 col-sm-12'f>r><'table-scrollable't><'row'<'col-md-5 col-sm-12'i><'col-md-7 col-sm-12'p>>", // horizobtal scrollable datatable

            // Uncomment below line("dom" parameter) to fix the dropdown overflow issue in the datatable cells. The default datatable layout
            // setup uses scrollable div(table-scrollable) with overflow:auto to enable vertical scroll(see: assets/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.js).
            // So when dropdowns used the scrollable div should be removed.
            //"dom": "<'row' <'col-md-12'T>><'row'<'col-md-6 col-sm-12'l><'col-md-6 col-sm-12'f>r>t<'row'<'col-md-5 col-sm-12'i><'col-md-7 col-sm-12'p>>",
        });

        setInterval( function () {
            oTable.ajax.reload(); // user paging is not reset on reload
        }, 100000 );
    }

    var initTable8 = function () {
        var oTable = $('#tbl_order_terimacounter').DataTable({
            "ajax"            : ROUTE_DATATABLE_TERIMACOUNTER,
            "bInfo": false,
            "processing": true,
            "columns"         : [
                {"data" : "id", "width":"50px"},
                {"data" : "branch"},
                {"data" : "code"},
                {"data" : "date_transaction"},
                {"data" : "customer"},
                {"data" : "pay"},
                {"data" : "payment"},
                {"data" : "paid"},
                {"data" : "status"},
                {"data" : "created_by"},
                {"data" : "updated_by"},
                {"data" : "href", "width":"150px"}
            ],
            // Internationalisation. For more info refer to http://datatables.net/manual/i18n
            "language": {
                "aria": {
                    "sortAscending": ": activate to sort column ascending",
                    "sortDescending": ": activate to sort column descending"
                },
                "emptyTable": "No data available in table",
                "info": "Showing _START_ to _END_ of _TOTAL_ entries",
                "infoEmpty": "No entries found",
                "infoFiltered": "(filtered1 from _MAX_ total entries)",
                "lengthMenu": "_MENU_ entries",
                "search": "Search:",
                "zeroRecords": "No matching records found"
            },

            // Or you can use remote translation file
            //"language": {
            //   url: '//cdn.datatables.net/plug-ins/3cfcc339e89/i18n/Portuguese.json'
            //},

            // setup buttons extentension: http://datatables.net/extensions/buttons/
            buttons: [
            ],

            // setup responsive extension: http://datatables.net/extensions/responsive/
            responsive: true,
            "bLengthChange": false,
            // setup colreorder extension: http://datatables.net/extensions/colreorder/
            colReorder: {
                reorderCallback: function () {
                    console.log( 'callback' );
                }
            },

            "columnDefs": [
                {
                "targets": 0,
                "visible": false
                },
                {
                "targets": 3,
                "orderable": false
                }

            ],

            "order": [
                [0, 'desc']
            ],

            "lengthMenu": [
                [5, 10, 15, 20, -1],
                [5, 10, 15, 20, "All"] // change per page values here
            ],
            // set the initial value
            "pageLength": 10,

            "dom": "<'row' <'col-md-12'B>><'row'<'col-md-6 col-sm-12'l><'col-md-6 col-sm-12'f>r><'table-scrollable't><'row'<'col-md-5 col-sm-12'i><'col-md-7 col-sm-12'p>>", // horizobtal scrollable datatable

            // Uncomment below line("dom" parameter) to fix the dropdown overflow issue in the datatable cells. The default datatable layout
            // setup uses scrollable div(table-scrollable) with overflow:auto to enable vertical scroll(see: assets/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.js).
            // So when dropdowns used the scrollable div should be removed.
            //"dom": "<'row' <'col-md-12'T>><'row'<'col-md-6 col-sm-12'l><'col-md-6 col-sm-12'f>r>t<'row'<'col-md-5 col-sm-12'i><'col-md-7 col-sm-12'p>>",
        });

        setInterval( function () {
            oTable.ajax.reload(); // user paging is not reset on reload
        }, 100000 );
    }

    var initTable9 = function () {
        var oTable = $('#tbl_order_qcchecked').DataTable({
            "ajax"            : ROUTE_DATATABLE_QCCOUNTER,
            "bInfo": false,
            "processing": true,
            "columns"         : [
                {"data" : "id", "width":"50px"},
                {"data" : "branch"},
                {"data" : "code"},
                {"data" : "date_transaction"},
                {"data" : "customer"},
                {"data" : "pay"},
                {"data" : "payment"},
                {"data" : "paid"},
                {"data" : "status"},
                {"data" : "created_by"},
                {"data" : "updated_by"},
                {"data" : "href", "width":"150px"}
            ],
            // Internationalisation. For more info refer to http://datatables.net/manual/i18n
            "language": {
                "aria": {
                    "sortAscending": ": activate to sort column ascending",
                    "sortDescending": ": activate to sort column descending"
                },
                "emptyTable": "No data available in table",
                "info": "Showing _START_ to _END_ of _TOTAL_ entries",
                "infoEmpty": "No entries found",
                "infoFiltered": "(filtered1 from _MAX_ total entries)",
                "lengthMenu": "_MENU_ entries",
                "search": "Search:",
                "zeroRecords": "No matching records found"
            },

            // Or you can use remote translation file
            //"language": {
            //   url: '//cdn.datatables.net/plug-ins/3cfcc339e89/i18n/Portuguese.json'
            //},

            // setup buttons extentension: http://datatables.net/extensions/buttons/
            buttons: [
            ],

            // setup responsive extension: http://datatables.net/extensions/responsive/
            responsive: true,
            "bLengthChange": false,
            // setup colreorder extension: http://datatables.net/extensions/colreorder/
            colReorder: {
                reorderCallback: function () {
                    console.log( 'callback' );
                }
            },

            "columnDefs": [
                {
                "targets": 0,
                "visible": false
                },
                {
                "targets": 3,
                "orderable": false
                }

            ],

            "order": [
                [0, 'desc']
            ],

            "lengthMenu": [
                [5, 10, 15, 20, -1],
                [5, 10, 15, 20, "All"] // change per page values here
            ],
            // set the initial value
            "pageLength": 10,

            "dom": "<'row' <'col-md-12'B>><'row'<'col-md-6 col-sm-12'l><'col-md-6 col-sm-12'f>r><'table-scrollable't><'row'<'col-md-5 col-sm-12'i><'col-md-7 col-sm-12'p>>", // horizobtal scrollable datatable

            // Uncomment below line("dom" parameter) to fix the dropdown overflow issue in the datatable cells. The default datatable layout
            // setup uses scrollable div(table-scrollable) with overflow:auto to enable vertical scroll(see: assets/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.js).
            // So when dropdowns used the scrollable div should be removed.
            //"dom": "<'row' <'col-md-12'T>><'row'<'col-md-6 col-sm-12'l><'col-md-6 col-sm-12'f>r>t<'row'<'col-md-5 col-sm-12'i><'col-md-7 col-sm-12'p>>",
        });

        setInterval( function () {
            oTable.ajax.reload(); // user paging is not reset on reload
        }, 100000 );
    }

    return {

        //main function to initiate the module
        init: function () {

            if (!jQuery().dataTable) {
                return;
            }

            initTable(); // menu
            initTable2(); // done
            initTable3(); // takeitems
            initTable4(); // All
            initTable5(); // Kirim Workshop
            initTable6(); // Proccess Workshop
            initTable7(); // Kirim Counter
            initTable8(); // Terima Counter
            initTable9(); // Qc Checked

        }

    };

}();

jQuery(document).ready(function() {
    TableDatatablesColreorder.init();
});
