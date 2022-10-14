import axios from 'axios';
import React, {useEffect, useState} from 'react';
import { Link } from "react-router-dom";
import '../../Component/Patients/AddNewPatient/AddNewPatient.css';
import swal from "sweetalert";
import HistorySetupSidebar from '../history_setup_mainsidebar/HistorySetupSidebar';

function AddExamHistoryExtension() {

    const [exam_name_list, setExamName] = useState([]);
    const [history_name_list, setHistoryName] = useState([]);
    const [errors, setError] = useState([]);

    const [examinationInput, setExamination] = useState({
        examination_name_id: '',
        history_name_id: '',
        extension_code: '',
        extension_name: '',
    });

    useEffect(()=>{
       axios.get('/examhistext-dropdown').then(res=>{
           if (res.data.status === 200)
           {
               setExamName(res.data.exam_name);
               setHistoryName(res.data.history_name);
           }
       })
    },[]);

    const handleInput = (e) => {
        e.persist();
        setExamination({ ...examinationInput, [e.target.name]: e.target.value })
    }

    const submitExamHistExtension = (e) => {
        e.preventDefault();

        const data = {
            examination_name_id: examinationInput.examination_name_id,
            history_name_id: examinationInput.history_name_id,
            extension_code: examinationInput.extension_code,
            extension_name: examinationInput.extension_name,
        }

        axios.post(`/save-history-extension`, data).then(res => {

            if (res.data.status === 200) {
                swal("Success", res.data.message, "success");

                setExamination({
                    ...examinationInput,

                    examination_name_id: '',
                    history_name_id: '',
                    extension_code: '',
                    extension_name: '',
                });

            } else if (res.data.status === 400) {
                // console.log(res.data.errors);
                setError(res.data.errors);
                // setExamination({ ...examinationInput, error_list: res.data.errors });
            }

        });
    }

    return (
        <>
            
            <div className="container">
                <div className="row">
                    <div className="col-md-3">
                        <HistorySetupSidebar></HistorySetupSidebar>
                    </div>
                    <div className="col-md-9 mt-3">
                        <div className="card">
                            <div className="card-header">
                                <h6 className="card-title"> Add Examination
                                    <Link to={'/examination'} className="btn btn-primary btn-sm float-end"> Back </Link>
                                </h6>
                            </div>
                            <div className="card-body">
                                <form onSubmit={submitExamHistExtension} id="examinationForms">
                                    <div className="card-body">

                                                <label htmlFor="inputPassword4" className="form-label  col-form-label col-form-label-sm"> Examination Name </label>
                                                <select name="examination_name_id" type="text" onChange={handleInput} value={examinationInput.examination_name_id} id="examination_name_id"
                                                        className="form-select  col-form-label-sm font-size-patient">
                                                    <option selected>Select</option>

                                                    {
                                                        exam_name_list.map((item) => {
                                                            return (
                                                                <option value={item.id} key={item.id}>{item.examination_code} - {item.examination_name}</option>
                                                            )
                                                        })
                                                    }

                                                </select>
                                            <span className="text-danger">{errors.examination_name_id}</span>
                                            <div className='form-group'>
    
                                                <label htmlFor="inputPassword4"
                                                       className="form-label  col-form-label col-form-label-sm"> History Name </label>
                                                <select name="history_name_id" type="text" onChange={handleInput} value={examinationInput.history_name_id} id="history_name_id"
                                                        className="form-select  col-form-label-sm font-size-patient">
                                                    <option selected>Select</option>

                                                    {
                                                        history_name_list.map((item) => {
                                                            return (
                                                                <option value={item.id} key={item.id}>{item.history_code} - {item.history_name}</option>
                                                            )
                                                        })
                                                    }

                                                </select>
                                            <span className="text-danger">{errors.history_name_id}</span>
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="extension_code" className="col-form-label-sm"> Extension Code </label>
                                                <input type="text" onChange={handleInput} value={examinationInput.extension_code} className="form-control" name="extension_code" />
                                                <span className="text-danger">{errors.extension_code}</span>
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="extension_name" className="col-form-label-sm"> Extension Name </label>
                                                <input type="text" onChange={handleInput} value={examinationInput.extension_name} className="form-control" name="extension_name" />
                                                <span className="text-danger">{errors.extension_name}</span>
                                            </div>

                                            <div className="float-right">
                                                <button type="submit" className="btn btn-sm btn-primary text-uppercase float-end mt-2"><i
                                                    className="fas fa-save"></i> Save
                                                </button>
                                            </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
           
        </>

    )
}

export default AddExamHistoryExtension;