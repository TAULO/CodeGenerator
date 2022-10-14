import { Meteor } from "meteor/meteor";
import React, { Component } from "react";
import ReactTable from "react-table";
import Swal from "sweetalert2";
import {
  Button,
  ButtonGroup,
  ControlLabel,
  FormControl,
  FormGroup,
  InputGroup,
  Modal,
  Tab,
  Tabs,
} from "react-bootstrap";
import {
  GridForm,
  Fieldset,
  Row,
  Field,
} from "../../../startup/utils/react-gridforms/lib";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
export default class ApplicantProfileModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: props,
      applicationHistory: props.applicationHistory,
      code: "",
      lastName: "",
      firstName: "",
      middleName: "",
      maidenName: "",
      nameExtension: "",
      address: "",
      cellNumber: "",
      politicalDistrict: "",
      congressionalDistrict: "",
      birthDate: "",

      //POLITICAL DISTRICTS
      firstDistrict: [
        <option key="poblacion" value="Poblacion">
          Poblacion
        </option>,
        <option key="talomo" value="Talomo">
          Talomo
        </option>,
      ],
      secondDistrict: [
        <option key="agdao" value="Agdao">
          Agdao
        </option>,
        <option key="buhangin" value="Buhangin">
          Buhangin
        </option>,
        <option key="bunawan" value="Bunawan">
          Bunawan
        </option>,
        <option key="pacquibato" value="Paquibato">
          Paquibato
        </option>,
      ],
      thirdDistrict: [
        <option key="baguio" value="Baguio">
          Baguio
        </option>,
        <option key="calinan" value="Calinan">
          Calinan
        </option>,
        <option key="marilog" value="Marilog">
          Marilog
        </option>,
        <option key="toril" value="Toril">
          Toril
        </option>,
        <option key="tugbok" value="Tugbok">
          Tugbok
        </option>,
      ],

      //RELIGION OPTIONS
      religionOptions: props.religionOptions,

      //EXISTING PERSONNEL
      employeeNumber: "000000",
      existingPersonnel: false,
      applicantProfileId: "",
      beginDate: "",
      dateFrom: null,
      dateTo: null,

      //UPDATE
      update: false,
      key: 1,
      applicationHistory: [],
    };

    this.errors = [];
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      data: nextProps,
      applicationHistory:
        nextProps.applicationHistory.length != 0
          ? nextProps.applicationHistory
          : [],
      code: nextProps.updateData != null ? nextProps.updateData.code : "",
      lastName:
        nextProps.updateData != null ? nextProps.updateData.last_name : "",
      firstName:
        nextProps.updateData != null ? nextProps.updateData.first_name : "",
      middleName:
        nextProps.updateData != null ? nextProps.updateData.middle_name : "",
      maidenName:
        nextProps.updateData != null ? nextProps.updateData.maiden_name : "",
      nameExtension:
        nextProps.updateData != null ? nextProps.updateData.name_ext : "",
      address: nextProps.updateData != null ? nextProps.updateData.address : "",
      cellNumber:
        nextProps.updateData != null ? nextProps.updateData.contact_number : "",
      politicalDistrict:
        nextProps.updateData != null
          ? nextProps.updateData.political_district
          : "",
      congressionalDistrict:
        nextProps.updateData != null
          ? nextProps.updateData.congressional_district
          : "",
      birthDate:
        nextProps.updateData != null
          ? new Date(nextProps.updateData.birth_date)
          : "",
      update: nextProps.update,
      existingPersonnel: nextProps.updateData
        ? nextProps.updateData.employee_number
          ? true
          : false
        : false,
      employeeNumber:
        nextProps.updateData != null
          ? nextProps.updateData.employee_number
            ? nextProps.updateData.employee_number
            : "000000"
          : "000000",
      applicantProfileId:
        nextProps.updateData != null
          ? nextProps.updateData.id
            ? nextProps.updateData.id
            : ""
          : "",
      beginDate:
        nextProps.updateData != null
          ? nextProps.updateData.last_begin_date
            ? nextProps.updateData.last_begin_date
            : ""
          : "",
    });

    if (nextProps.updateData === null) {
      this.setState({
        code:
          nextProps.lookUpData.length !== 0 ? nextProps.lookUpData.code : "",
        employeeNumber:
          nextProps.lookUpData.length !== 0
            ? nextProps.lookUpData.employeeNumber
            : "000000",
        firstName:
          nextProps.lookUpData.length !== 0
            ? nextProps.lookUpData.firstName
            : "",
        lastName:
          nextProps.lookUpData.length !== 0
            ? nextProps.lookUpData.lastName
            : "",
        middleName:
          nextProps.lookUpData.length !== 0
            ? nextProps.lookUpData.middleName
            : "",
        maidenName:
          nextProps.lookUpData.length !== 0
            ? nextProps.lookUpData.maidenName
            : "",
        nameExtension:
          nextProps.lookUpData.length !== 0
            ? nextProps.lookUpData.suffixName
            : "",
        dateFrom:
          nextProps.lookUpData.length !== 0
            ? nextProps.lookUpData.dateFrom
            : null,
        dateTo:
          nextProps.lookUpData.length !== 0
            ? nextProps.lookUpData.dateTo
            : null,
        existingPersonnel: nextProps.lookUpData.length !== 0 ? true : false,
      });
    }
  }

  handleChange = (value, id) => {
    if (id === "lastName") {
      this.setState({
        lastName: value,
      });
    } else if (id === "firstName") {
      this.setState({
        firstName: value,
      });
    } else if (id === "middleName") {
      this.setState({
        middleName: value,
      });
    } else if (id === "maidenName") {
      this.setState({
        maidenName: value,
      });
    } else if (id === "nameExtension") {
      this.setState({
        nameExtension: value,
      });
    } else if (id === "address") {
      this.setState({
        address: value,
      });
    } else if (id === "cellNumber") {
      this.setState({
        cellNumber: value,
      });
    } else if (id === "politicalDistrict") {
      this.setState({
        politicalDistrict: value,
      });
    } else if (id === "congressionalDistrict") {
      this.setState({
        congressionalDistrict: value,
      });
    } else if (id === "birthDate") {
      this.setState({
        birthDate: value.toString(),
      });
    }
  };

  handleKeyChange = (key) => {
    this.setState({
      key,
    });
  };

  getValidationState = (id) => {
    const {
      birthDate,
      lastName,
      firstName,
      middleName,
      address,
      congressionalDistrict,
    } = this.state;
    switch (id) {
      case "lastName":
        if (lastName.length === 0) {
          this.errors.includes("lastName")
            ? null
            : this.errors.push("lastName");
          return "error";
        } else {
          let index = this.errors.indexOf("lastName");
          if (index > -1) {
            this.errors.splice(index, 1);
          }
          return "success";
        }
      case "firstName":
        if (firstName.length === 0) {
          this.errors.includes("firstName")
            ? null
            : this.errors.push("firstName");
          return "error";
        } else {
          let index = this.errors.indexOf("firstName");
          if (index > -1) {
            this.errors.splice(index, 1);
          }
          return "success";
        }
      case "middleName":
        if (middleName.length === 0) {
          this.errors.includes("middleName")
            ? null
            : this.errors.push("middleName");
          return "error";
        } else {
          let index = this.errors.indexOf("middleName");
          if (index > -1) {
            this.errors.splice(index, 1);
          }
          return "success";
        }
      case "address":
        if (address.length === 0) {
          this.errors.includes("address") ? null : this.errors.push("address");
          return "error";
        } else {
          let index = this.errors.indexOf("address");
          if (index > -1) {
            this.errors.splice(index, 1);
          }
          return "success";
        }
      case "politicalDistrict":
        if (congressionalDistrict.length === 0) {
          return "warning";
        } else {
          return null;
        }
      case "birthdate":
        if (birthDate.length === 0) {
          this.errors.includes("birthdate")
            ? null
            : this.errors.push("birthdate");
          return "error";
        } else {
          let index = this.errors.indexOf("birthdate");
          if (index > -1) {
            this.errors.splice(index, 1);
          }
          return "success";
        }
    }
  };

  insertNewApplicant = () => {
    const {
      selectApplicantsProfile,
      selectApplications,
      toggleApplicationModal,
    } = this.state.data;
    Swal.fire({
      title: "Create Profile?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      showClass: {
        popup: "animated fadeIn",
      },
      hideClass: {
        popup: "animated fadeOut faster",
      },
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Continue",
    }).then((result) => {
      if (result.value) {
        const {
          firstName,
          lastName,
          middleName,
          maidenName,
          nameExtension,
          address,
          cellNumber,
          politicalDistrict,
          congressionalDistrict,
          birthDate,
          employeeNumber,
          beginDate,
          dateFrom,
          dateTo,
        } = this.state;
        let data = {
          firstName,
          lastName,
          middleName,
          maidenName,
          nameExtension,
          address,
          cellNumber,
          politicalDistrict,
          congressionalDistrict,
          birthDate,
          employeeNumber,
          beginDate,
          dateFrom,
          dateTo,
        };
        Meteor.call("insert-new-applicant", data, (error, result) => {
          if (!error) {
            if (result === "success") {
              selectApplicantsProfile();
              selectApplications();
              Swal.fire({
                position: "center",
                icon: "success",
                title: "Application has been successfuly recorded",
                showConfirmButton: false,
                showClass: {
                  popup: "animated fadeIn",
                },
                hideClass: {
                  popup: "animated fadeOut faster",
                },
                timer: 2500,
              });
              toggleApplicationModal("close");
            } else {
              Swal.fire({
                position: "center",
                icon: "error",
                title: "Submission failed. Please try again",
                showConfirmButton: false,
                showClass: {
                  popup: "animated fadeIn",
                },
                hideClass: {
                  popup: "animated fadeOut faster",
                },
                timer: 2500,
              });
            }
          } else {
            Swal.fire({
              position: "center",
              icon: "error",
              text: "Submission failed. Please try again",
              showConfirmButton: false,
              showClass: {
                popup: "animated fadeIn",
              },
              hideClass: {
                popup: "animated fadeOut faster",
              },
              timer: 2500,
            });
          }
        });
      }
    });
  };

  insertNewApplicantAndInsertApplication = () => {
    const {
      selectApplicantsProfile,
      selectApplications,
      toggleApplicationModal,
    } = this.state.data;
    Swal.fire({
      title: "Create Profile and Submit Application?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      showClass: {
        popup: "animated fadeIn",
      },
      hideClass: {
        popup: "animated fadeOut faster",
      },
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Continue",
    }).then((result) => {
      if (result.value) {
        const {
          firstName,
          lastName,
          middleName,
          maidenName,
          nameExtension,
          address,
          cellNumber,
          politicalDistrict,
          congressionalDistrict,
          birthDate,
          employeeNumber,
          beginDate,
          dateFrom,
          dateTo,
        } = this.state;
        let data = {
          firstName,
          lastName,
          middleName,
          maidenName,
          nameExtension,
          address,
          cellNumber,
          politicalDistrict,
          congressionalDistrict,
          birthDate,
          employeeNumber,
          beginDate,
          dateFrom,
          dateTo,
        };
        Meteor.call(
          "insert-new-applicant-application",
          data,
          (error, result) => {
            if (!error) {
              if (result === "success") {
                selectApplicantsProfile();
                selectApplications();
                Swal.fire({
                  position: "center",
                  icon: "success",
                  title: "Form has been successfuly recorded",
                  showConfirmButton: false,
                  showClass: {
                    popup: "animated fadeIn",
                  },
                  hideClass: {
                    popup: "animated fadeOut faster",
                  },
                  timer: 2500,
                });
                toggleApplicationModal("close");
              } else {
                Swal.fire({
                  position: "center",
                  icon: "error",
                  title: "Submission failed. Please try again",
                  showConfirmButton: false,
                  showClass: {
                    popup: "animated fadeIn",
                  },
                  hideClass: {
                    popup: "animated fadeOut faster",
                  },
                  timer: 2500,
                });
              }
            } else {
              Swal.fire({
                position: "center",
                icon: "error",
                text: "Submission failed. Please try again",
                showConfirmButton: false,
                showClass: {
                  popup: "animated fadeIn",
                },
                hideClass: {
                  popup: "animated fadeOut faster",
                },
                timer: 2500,
              });
            }
          }
        );
      }
    });
  };

  updateInformation = (id) => {
    const {
      selectApplicantsProfile,
      selectApplications,
      toggleApplicationModal,
    } = this.state.data;
    Swal.fire({
      title: "Submit Form?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      showClass: {
        popup: "animated fadeIn",
      },
      hideClass: {
        popup: "animated fadeOut faster",
      },
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Continue",
    }).then((result) => {
      if (result.value) {
        const {
          firstName,
          lastName,
          middleName,
          maidenName,
          nameExtension,
          address,
          cellNumber,
          politicalDistrict,
          congressionalDistrict,
          birthDate,
          employeeNumber,
          beginDate,
          applicantProfileId,
        } = this.state;
        let data = {
          firstName,
          lastName,
          middleName,
          maidenName,
          nameExtension,
          address,
          cellNumber,
          politicalDistrict,
          congressionalDistrict,
          birthDate,
          employeeNumber,
          beginDate,
          applicantProfileId,
        };
        Meteor.call("update-profile", data, (error, result) => {
          if (!error) {
            if (result === "success") {
              selectApplicantsProfile();
              selectApplications();
              Swal.fire({
                position: "center",
                icon: "success",
                title: "Personnel information has been successfuly updated",
                showConfirmButton: false,
                showClass: {
                  popup: "animated fadeIn",
                },
                hideClass: {
                  popup: "animated fadeOut faster",
                },
                timer: 2500,
              });
              toggleApplicationModal("close");
            } else {
              Swal.fire({
                position: "center",
                icon: "error",
                title: "Submission failed. Please try again",
                showConfirmButton: false,
                showClass: {
                  popup: "animated fadeIn",
                },
                hideClass: {
                  popup: "animated fadeOut faster",
                },
                timer: 2500,
              });
            }
          } else {
            Swal.fire({
              position: "center",
              icon: "error",
              text: "Submission failed. Please try again",
              showConfirmButton: false,
              showClass: {
                popup: "animated fadeIn",
              },
              hideClass: {
                popup: "animated fadeOut faster",
              },
              timer: 2500,
            });
          }
        });
      }
    });
  };

  changeBirthDate = (date) => {
    this.setState({
      birthDate: date,
    });
  };

  fetchExistingPersonnelData = () => {
    this.fixBootstrapModal();
    Swal.fire({
      title: "Submit Employee Number",
      input: "text",
      inputAttributes: {
        autocapitalize: "off",
      },
      showCancelButton: true,
      showClass: {
        popup: "animated fadeInDown faster",
      },
      hideClass: {
        popup: "animated fadeOutUp faster",
      },
      confirmButtonText: "Look up",
      showLoaderOnConfirm: true,
      preConfirm: (login) => {
        let getSomePromise = (myVar) => {
          let fetchExistingPersonnelApiData = new Promise((resolve, reject) => {
            HTTP.post(
              "http://localhost:3000/v2/graphql",
              {
                headers: {
                  "Content-Type": "application/json",
                  Accept: "application/json",
                },
                data: {
                  query: `
                  {
                    allEmployee(employeeNumber: "${myVar}") {
                      employeeNumber
                      employee {
                        lastName
                        firstName
                        extensionName
                        middleName
                        maidenName
                        nickName
                        fullName
                        fullNameReverse
                      }
                      address
                      cellNumber
                      politicalDistrict
                      congressionalDistrict
                      birthDate
                      hdmf
                      beginDate
                      employed
                    }
                  }`,
                },
              },
              (err, res) => {
                if (!err) {
                  let employeeInformation = JSON.parse(res.content);
                  let result_j_data = employeeInformation.data.allEmployee[0];
                  if (employeeInformation.data.allEmployee.length === 0) {
                    reject("Personnel not found");
                  } else {
                    resolve(result_j_data);
                  }
                } else {
                  reject(err);
                }
              }
            );
          });
          return fetchExistingPersonnelApiData;
        };

        return getSomePromise(login)
          .then(function (x) {
            if (x.employed === "1") {
              Swal.showValidationMessage(
                `Error: Personnel is currently employed.`
              );
            } else {
              return x;
            }
          })
          .catch(function (err) {
            Swal.showValidationMessage(`Error: ${err}`);
          });
      },
      allowOutsideClick: () => !Swal.isLoading(),
    }).then((result) => {
      if (result.value) {
        const {
          address,
          employeeNumber,
          cellNumber,
          politicalDistrict,
          congressionalDistrict,
          birthDate,
          beginDate,
          employed,
        } = result.value;
        const {
          lastName,
          firstName,
          extensionName,
          middleName,
          maidenName,
        } = result.value.employee;
        this.setState({
          employeeNumber: employeeNumber ? employeeNumber : "",
          lastName: lastName ? lastName : "",
          firstName: firstName ? firstName : "",
          middleName: middleName ? middleName : "",
          maidenName: maidenName ? maidenName : "",
          nameExtension: extensionName ? extensionName : "",
          address: address ? address : "",
          cellNumber: cellNumber ? cellNumber : "",
          politicalDistrict: politicalDistrict ? politicalDistrict : "",
          congressionalDistrict: congressionalDistrict
            ? congressionalDistrict
            : "",
          birthDate: birthDate ? new Date(birthDate) : new Date(),
          existingPersonnel: true,
          beginDate: beginDate ? beginDate : "",
        });
        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          onOpen: (toast) => {
            toast.addEventListener("mouseenter", Swal.stopTimer);
            toast.addEventListener("mouseleave", Swal.resumeTimer);
          },
        });

        Toast.fire({
          icon: "success",
          title: "Employee data fetched successfully",
        });
      }
    });
  };

  fixBootstrapModal = () => {
    var modalNode = document.querySelector('.modal[tabindex="-1"]');
    if (!modalNode) return;

    modalNode.removeAttribute("tabindex");
    modalNode.classList.add("js-swal-fixed");
  };

  restoreBootstrapModal = () => {
    var modalNode = document.querySelector(".modal.js-swal-fixed");
    if (!modalNode) return;

    modalNode.setAttribute("tabindex", "-1");
    modalNode.classList.remove("js-swal-fixed");
  };

  render() {
    const {
      show,
      toggleAutoSuggestProfileModal,
      toggleApplicationModal,
    } = this.state.data;
    const {
      code,
      firstName,
      lastName,
      middleName,
      maidenName,
      nameExtension,
      address,
      cellNumber,
      congressionalDistrict,
      politicalDistrict,
      birthDate,

      //POLITICAL DISTRICT OPTIONS
      firstDistrict,
      secondDistrict,
      thirdDistrict,

      //EXISTING PERSONNEL
      employeeNumber,
      existingPersonnel,

      //UPDATE
      update,
      applicantProfileId,
      key,
      applicationHistory,
    } = this.state;
    let personelLegend = existingPersonnel
      ? "Complete Name - #" + employeeNumber
      : "Complete Name";
    let legend = personelLegend;
    let reactTablePageSize = Math.floor(window.innerHeight - 628) * 0.0232;
    let columns = [
      {
        id: "id",
        Header: "#",
        Cell: (d) => d.index + 1,
        width: 35,
        style: { whiteSpace: "unset" },
        className: "center",
      },
      {
        Header: "Groupings",
        accessor: "groupings",
        minWidth: 35,
        headerClassName: "wordwrap",
        style: { whiteSpace: "unset" },
        className: "center",
      },
      {
        Header: "Date of Application",
        id: "date_applied",
        accessor: (d) => {
          return new Date(d.date_applied).toLocaleString("en-US", {
            year: "numeric",
            month: "short",
            day: "2-digit",
            hour: "2-digit",
            hour12: true,
            minute: "2-digit",
          });
        },
        minWidth: 50,
        className: "right",
        headerClassName: "wordwrap",
        style: { whiteSpace: "unset" },
        className: "center",
      },
    ];
    return (
      <Modal bsSize="large" role="document" show={show}>
        <Modal.Header>
          <Modal.Title id="contained-modal-title-lg">
            <center>
              {update
                ? key == 1
                  ? "Update Information"
                  : "Application History"
                : "Application Form"}
            </center>
            {update ? null : (
              <Button
                style={{
                  position: "relative",
                  top: "-29px",
                }}
                bsStyle="primary"
                className="pull-right"
                onClick={() => toggleAutoSuggestProfileModal()}
              >
                <i className="fa fa-database" aria-hidden="true"></i> Existing
                Personnel
              </Button>
            )}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body
          style={{
            padding: "0px 15px 0px 15px",
          }}
        >
          <Tabs
            defaultActiveKey={1}
            onSelect={this.handleKeyChange}
            id="applicant_profile_tab"
          >
            <Tab eventKey={1} title="Profile">
              <GridForm>
                <Fieldset legend={legend} style={{ fontSize: "16px" }}>
                  <Row span={20}>
                    <Field span={2}>
                      {/* LASTNAME */}
                      <FormGroup
                        controlId="lastName"
                        validationState={this.getValidationState("lastName")}
                      >
                        <ControlLabel>Last Name</ControlLabel>
                        <FormControl
                          autoComplete="off"
                          type="text"
                          value={lastName}
                          placeholder="Required"
                          onChange={(e) =>
                            this.handleChange(e.target.value, "lastName")
                          }
                        />
                      </FormGroup>
                    </Field>
                    <Field span={2}>
                      {/* FIRSTNAME */}
                      <FormGroup
                        controlId="firstName"
                        validationState={this.getValidationState("firstName")}
                      >
                        <ControlLabel>First Name</ControlLabel>
                        <FormControl
                          autoComplete="off"
                          type="text"
                          value={firstName}
                          placeholder="Required"
                          onChange={(e) =>
                            this.handleChange(e.target.value, "firstName")
                          }
                        />
                      </FormGroup>
                    </Field>
                    <Field span={1}>
                      {/* NAME EXTENSION */}
                      <FormGroup controlId="nameExtension">
                        <ControlLabel>Ext</ControlLabel>
                        <FormControl
                          autoComplete="off"
                          type="text"
                          value={nameExtension}
                          onChange={(e) =>
                            this.handleChange(e.target.value, "nameExtension")
                          }
                        />
                      </FormGroup>
                    </Field>
                    <Field span={2}>
                      {/* MIDDLE NAME */}
                      <FormGroup
                        controlId="middleName"
                        validationState={this.getValidationState("middleName")}
                      >
                        <ControlLabel>Middle Name</ControlLabel>
                        <FormControl
                          autoComplete="off"
                          type="text"
                          value={middleName}
                          placeholder="Required"
                          onChange={(e) =>
                            this.handleChange(e.target.value, "middleName")
                          }
                        />
                      </FormGroup>
                    </Field>
                    <Field span={2}>
                      {/* MAIDEN NAME */}
                      <FormGroup controlId="maidenName">
                        <ControlLabel>Maiden Name</ControlLabel>
                        <FormControl
                          autoComplete="off"
                          type="text"
                          value={maidenName}
                          onChange={(e) =>
                            this.handleChange(e.target.value, "maidenName")
                          }
                        />
                      </FormGroup>
                    </Field>
                  </Row>
                </Fieldset>
                <Fieldset legend="Other Information">
                  <Row span={1}>
                    <Field span={1}>
                      {/* ADDRESS */}
                      <FormGroup
                        controlId="address"
                        validationState={this.getValidationState("address")}
                      >
                        <ControlLabel>Address</ControlLabel>
                        <FormControl
                          autoComplete="off"
                          type="text"
                          value={address}
                          placeholder="Required"
                          onChange={(e) =>
                            this.handleChange(e.target.value, "address")
                          }
                        />
                      </FormGroup>
                    </Field>
                  </Row>
                  <Row span={4}>
                    <Field span={1}>
                      {/* CONGRESSIONAL DISTRICT */}
                      <FormGroup controlId="congressionalDistrict">
                        <ControlLabel>Congressional District</ControlLabel>
                        <FormControl
                          autoComplete="off"
                          componentClass="select"
                          onChange={(e) =>
                            this.handleChange(
                              e.target.value,
                              "congressionalDistrict"
                            )
                          }
                          value={
                            congressionalDistrict === "1"
                              ? "1"
                              : congressionalDistrict === "2"
                              ? "2"
                              : congressionalDistrict === "3"
                              ? "3"
                              : ""
                          }
                        >
                          <option value={""}>Please Select</option>
                          <option value="1">1st</option>
                          <option value="2">2nd</option>
                          <option value="3">3rd</option>
                        </FormControl>
                      </FormGroup>
                    </Field>
                    <Field span={1}>
                      {/* POLITICAL DISTRICT */}
                      <FormGroup
                        controlId="politicalDistrict"
                        validationState={this.getValidationState(
                          "politicalDistrict"
                        )}
                      >
                        <ControlLabel>Political District</ControlLabel>
                        <FormControl
                          autoComplete="off"
                          componentClass="select"
                          disabled={
                            this.getValidationState("politicalDistrict") !==
                            null
                              ? true
                              : false
                          }
                          onChange={(e) =>
                            this.handleChange(
                              e.target.value,
                              "politicalDistrict"
                            )
                          }
                          value={politicalDistrict ? politicalDistrict : ""}
                        >
                          <option value={""}>Please Select</option>
                          {congressionalDistrict === "1"
                            ? firstDistrict
                            : congressionalDistrict === "2"
                            ? secondDistrict
                            : congressionalDistrict === "3"
                            ? thirdDistrict
                            : null}
                        </FormControl>
                      </FormGroup>
                    </Field>
                    <Field span={1}>
                      {/* CELL NUMBER */}
                      <FormGroup controlId="cellNumber">
                        <ControlLabel>Contact Number</ControlLabel>
                        <FormControl
                          autoComplete="off"
                          type="text"
                          value={cellNumber}
                          onChange={(e) =>
                            this.handleChange(e.target.value, "cellNumber")
                          }
                        />
                      </FormGroup>
                    </Field>
                    <Field span={1}>
                      {/* BIRTH DATE */}
                      <FormGroup
                        controlId="birthDate"
                        validationState={this.getValidationState("birthdate")}
                      >
                        <ControlLabel>Birth Date:</ControlLabel>

                        <InputGroup>
                          <div
                            className="customDatePickerWidth"
                            style={{ height: "34px" }}
                          >
                            <DatePicker
                              name="datetime"
                              className="form-control"
                              style={{
                                width: "100%",
                                fontSize: "300px",
                                overflow: "true",
                              }}
                              autoComplete="off"
                              showYearDropdown
                              scrollableYearDropdown
                              selected={birthDate}
                              showMonthDropdown
                              showYearDropdown
                              dropdownMode="select"
                              dateFormat="MM-dd-yyyy"
                              onChange={this.changeBirthDate}
                            />
                          </div>
                        </InputGroup>
                      </FormGroup>
                    </Field>
                  </Row>
                </Fieldset>
              </GridForm>
            </Tab>
            {update ? (
              <Tab eventKey={2} title="History">
                <ReactTable
                  className="-striped -highlight"
                  data={applicationHistory}
                  columns={columns}
                  defaultPageSize={reactTablePageSize}
                  PreviousComponent={PreviousIcon}
                  NextComponent={NextIcon}
                  showPageSizeOptions={false}
                  style={{
                    height: window.innerHeight - 582,
                  }}
                />
              </Tab>
            ) : null}
          </Tabs>
        </Modal.Body>
        <Modal.Footer>
          <ButtonGroup>
            {update ? null : (
              <Button
                disabled={this.errors.length > 0 ? true : false}
                bsStyle="primary"
                onClick={() => this.insertNewApplicantAndInsertApplication()}
              >
                <i className="fa fa-check" aria-hidden="true"></i>{" "}
                {"Create Profile and Submit Application"}
              </Button>
            )}
            {update ? (
              key == 1 ? (
                <Button
                  disabled={this.errors.length > 0 ? true : false}
                  bsStyle="success"
                  style={{ marginLeft: "0px" }}
                  onClick={
                    update
                      ? () => this.updateInformation(applicantProfileId)
                      : () => this.insertNewApplicant()
                  }
                >
                  <i className="fa fa-check" aria-hidden="true"></i>{" "}
                  {update ? "Update" : "Create Profile"}
                </Button>
              ) : null
            ) : (
              <Button
                disabled={this.errors.length > 0 ? true : false}
                bsStyle="success"
                style={{ marginLeft: "0px" }}
                onClick={
                  update
                    ? () => this.updateInformation(applicantProfileId)
                    : () => this.insertNewApplicant()
                }
              >
                <i className="fa fa-check" aria-hidden="true"></i>{" "}
                {update ? "Update" : "Create Profile"}
              </Button>
            )}

            <Button onClick={() => toggleApplicationModal("close")}>
              Close
            </Button>
          </ButtonGroup>
        </Modal.Footer>
      </Modal>
    );
  }
}
