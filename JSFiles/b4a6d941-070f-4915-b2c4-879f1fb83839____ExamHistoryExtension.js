import axios from 'axios';
import MaterialTable from 'material-table';
import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import HistorySetupSidebar from '../history_setup_mainsidebar/HistorySetupSidebar';
import Swal from "sweetalert2";

function ExamHistoryExtension() {
    const [historyextensionlist, setExamHistoryExtensionList] = useState([]);

    useEffect(() => {
        axios.get(`/history-extension`).then(res => {
            if (res.status === 200) {
                setExamHistoryExtensionList(res.data.history_extension);
            }

        });

    }, []);

    const deleteExamHistoryExtension = (e, id) => {

        e.preventDefault();
        const thisClicked = e.currentTarget;

        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete(`/delete-history-extension/${id}`).then(res => {
                    if (res.data.status === 200) {
                        thisClicked.closest("tr").remove();
                    }
                });
                Swal.fire(
                    'Deleted!',
                    'Your data has been deleted.',
                    'success'
                )
            }
        })

    }

    var view_historyextension_HTML_TABLE = "";

    const columns = [

        {
            title: "Exam", field: `extension_code`, render: (row) => <div>{row.examination.examination_name}</div>

            ,
            // cellStyle: {
            //     marginLeft: 50,
            //     width:600
            // },
        },
        {
            title: "History", field: `extension_code`, render: (row) => <div>{row.history.history_name}</div>

            ,
            // cellStyle: {
            //     marginLeft: 50,
            //     width:600
            // },
        },
        {
            title: "Extension Code", field: `extension_code`

            ,
            // cellStyle: {
            //     marginLeft: 50,
            //     width:600
            // },
        },
        {
            title: "Extension Name", field: `extension_name`

            ,
            // cellStyle: {
            //     marginLeft: 50,
            //     width:600
            // },
        },
        {
            title: "Action", field: "patient", render: (row) => <div><Link to={`/edit-history-extension/${row.id}`} class="btn btn-info btn-sm action-btn"><i class="fas fa-edit"></i></Link>&nbsp;
                <button onClick={(e) => deleteExamHistoryExtension(e, row.id)} className="btn btn-danger btn-sm action-btn"> <i class="fas fa-trash"></i> </button></div>
        },
    ];
    return (
        <>
           
            <div className="container">
                <div className="row">
                    <div className="col-md-3">
                        <HistorySetupSidebar />
                    </div>
                    <div className="col-md-9 mt-3">
                        <div className="card">
                            <div className="card-header">
                                <h6 className="card-title">Exam History Extension
                                    <Link to='/add-history-extension' className="btn btn-primary btn-sm float-end"> Add Exam History Extension </Link>
                                </h6>
                            </div>
                            <div className="card-body">
                                
                                <MaterialTable
                                    columns={columns}
                                    data={historyextensionlist}
                                    options={{
                                        search: true,
                                        // filtering: filter,
                                        showTitle: false,
                                        searchFieldAlignment: "left",
                                        pageSize: 5,
                                        emptyRowsWhenPaging:false,
                                        pageSizeOptions: [5, 10, 20, 50, 100]
                                    }}

                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
        </>

    )
}

export default ExamHistoryExtension;