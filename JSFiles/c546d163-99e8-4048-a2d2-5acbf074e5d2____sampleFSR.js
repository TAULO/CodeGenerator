import React, { Component } from 'react';
import { Divider } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import './../style.css';
import * as Api from '../api';

var dataNum = 0;

export default class myApp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      //id: this.props.id
      id: this.props.location.state.id,
      pubs: [],
      profile: '',
      adminwork: [],
      extension: [],
      profchair: [],
      profession: [],
      teachingload: [],
      consul: [],
      degree: 'NaN',
      uni: 'NaN',
      studyleave: 'No',
      fellowship: 'No',
      studyload: [],
      hasData: false
    };
  }

  componentDidMount() {
        //Profile
    Api.getEmployeeData({ empid: this.state.id }).then(res => {
      console.log('1');
      this.setState({ profile: res.data.data });
      if (res.data.data.is_studying === 0) {
        this.setState({
          profile: { ...this.state.profile, is_full_time: 'YES' }
        });
      } else {
        this.setState({ profile: { ...this.state.profile, is_full_time: 'NO' } });
      }
      //extension
      Api.viewExtension({ id: this.state.id }).then(result => {
        console.log('2');
        if (result.data.data !== null) {
          this.setState({ extension: result.data.data });
        }
          //professorial chair
          Api.viewFacultyGrant({id: this.state.id }).then(result => {
            console.log('3');
            if (result.data.data !== null) {
              this.setState({ profchair: result.data.data[0] });
            }
              //practice of profession
              Api.viewLimitedPractice({ emp_id: this.state.id }).then(result => {
                console.log('4');
                if (result.data.data !== null) {
                  this.setState({ profession: result.data.data[0]});
                }
                Api.viewHisPosition({ id: this.state.id }).then(result => {
                  console.log('5');
                  if (result.data.data !== null) {
                    this.setState({ adminwork: result.data.data });
                  }
                  Api.viewConsultation({ id: this.state.id }).then(result => {
                    console.log('6');
                    if (result.data.data !== null) {
                      this.setState({ consul: result.data.data });
                    }
                    Api.getStudyLoadCredentialsFSR({emp_id: this.state.id }).then(response => {
                      console.log('7');
                      if (response.data.data !== undefined) {
                        this.setState({
                          degree: response.data.data.degree,
                          uni: response.data.data.university
                        });
                      }
                      if (response.data.data.full_studyleave === 1) {
                        this.setState({ studyleave: 'Yes' });
                      }else{
                        this.setState({ studyleave: 'No' });
                      }
                      if (response.data.data.faculty_fellowship === 1) {
                        this.setState({ fellowship: 'Yes' });
                      }else{
                        this.setState({ studyleave: 'No' });
                      }
                      Api.getStudyLoadFSR({emp_id: this.state.id }).then(response => {
                        console.log('8');
                        if (response.data.data[0] !== undefined) {
                          this.setState({ studyload: response.data.data });
                          this.state.studyload.map(item => {
                          var stringday = "";
                          Api.getDays({studyload_id:item.studyload_id}).then((results)=>{
                            results.data.data.forEach(json=>{
                              stringday+=json.day+" "
                            })
                          }).then(()=>{
                            item.days=stringday;
                          })
                        });
                        Api.viewTeachLoadEmpAdmin({emp_id: this.state.id }).then(result => {
                          console.log('9');
                        if (result.data.data !== null) {
                          this.setState({ teachingload: result.data.data});
                          Api.viewPublications({ empid: this.state.id }).then(result => {
                            console.log('10');
                            if (result.data.data !== null) {
                              this.setState({ pubs: result.data.data[0]});
                              if(result.data.data[0].length==0){
                                this.setState({hasData: true});
                                window.print();
                                window.onafterprint=this.props.history.push('../admin/viewPendingFSR');
                              }else{
                                this.state.pubs.map(item => {
                                Api.getCoworkers({
                                  id: item.publication_id
                                }).then(result => {
                                  dataNum++;
                                  item.Coworkers = result.data.data;
                                  if(dataNum == this.state.pubs.length){
                                    this.setState({hasData: true});
                                    window.print();
                                    window.onafterprint=this.props.history.push('../admin/viewPendingFSR');
                                  }
                                })
                              });
                              }
                            }
                          });
                        }
                        });
                        }
                      });
                    });
                  });
                })
              });
          });
      });
    });
  }



  render() {
    if(this.state.hasData){
    return (
      <div>
      <div class="generate">
        <p>
          <center>
            <div>
              <b>FACULTY SERVICE RECORD</b>
            </div>
            <div>{this.state.profile.semester} AY {this.state.profile.year} – {parseInt(this.state.profile.year)+1}</div>
          </center>
        </p>

        <p>
          <div>
            <table class="inv">
              <tr>
                <td class="inv2">PRINTED NAME:</td>
                <td class="inv2"><center><u>{this.state.profile.l_name}, {this.state.profile.f_name} {this.state.profile.m_name}</u></center></td>
                <td class="inv2">RANK:</td>
                <td class="inv2"><center><u>{this.state.profile.emp_type} {this.state.profile.emp_type_no}</u></center></td>
              </tr>
              <tr>
                <td class="inv2">&nbsp;</td>
                <td class="inv2"><center>(Family name, Given name, M.I.)</center></td>
                <td class="inv2">&nbsp;</td>
                {this.state.profile.is_full_time==='YES'?
                  <td class="inv2">
                    [&nbsp;&nbsp;X&nbsp;&nbsp;]
                    Full-time&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;]
                    Part-time
                  </td>
                :
                  <td class="inv2">
                    [&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;]
                    Full-time&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[&nbsp;&nbsp;X&nbsp;&nbsp;]
                    Part-time
                  </td>
                }
              </tr>
              <tr>
                <td class="inv2">HOME DEPARTMENT</td>
                <td class="inv2"><center><u>{this.state.profile.department}</u></center></td>
                <td class="inv2">HOME COLLEGE:</td>
                <td class="inv2"><center><u>{this.state.profile.college}</u></center></td>
              </tr>
            </table>
          </div>
        </p>

        <p>
          <div>
            <b>I. TEACHING LOAD in the COLLEGE</b>
            <table class="fsrtable">
              <tr>
                <th class="thtable">SUBJECT</th>
                <th class="thtable">SECTON CODE</th>
                <th class="thtable">ROOM</th>
                <th class="thtable">DAYS</th>
                <th class="thtable">TIME</th>
                <th class="thtable">HOURS PER WEEK</th>
                <th class="thtable">NO. OF STUDENTS (A)</th>
                <th class="thtable">COURSE CREDIT W/O MULTIPLIERS (B)</th>
                <th class="thtable">STUDENT CREDIT UNITS (A x B)</th>
                <th class="thtable">TEACHING LOAD CREDITS WITH MULTIPLIERS</th>
              </tr>
              {
                this.state.teachingload.map(item=>{
                  return(
                    <tr>
                      <td class="tdtable">{item.subject_code}</td>
                      <td class="tdtable">{item.section_code}</td>
                      <td class="tdtable">{item.room}</td>
                      <td class="tdtable">{item.day}</td>
                      <td class="tdtable">{item.start_time}-{item.end_time}</td>
                      <td class="tdtable"></td>
                      <td class="tdtable">{item.no_of_students}</td>
                      <td class="tdtable"></td>
                      <td class="tdtable"></td>
                      <td class="tdtable"></td>
                    </tr>
                  )
                })
              }
              <tr>
                <td colspan="7" class="total">
                  TOTAL Teaching Load Credits
                </td>
                <td class="tdtable">a</td>
                <td class="tdtable">a</td>
                <td class="tdtable">a</td>
              </tr>
            </table>
            <center>
              <b>
                <sub>
                  Concurrent teaching load outside the college. Write NON
                  whenever applicable. Please do not leave any blank.
                </sub>
              </b>
            </center>
            <Divider hidden="true" />
            <table class="inv">
              <center>
              <tr>
                <td class="inv2">____________________________</td>
                <td class="inv2">____________________________</td>
                <td class="inv2">____________________________</td>
              </tr>
              <tr>
                <td class="inv2">COLLEGE OUTSIDE THE UP SYSTEM</td>
                <td class="inv2">NO. OF SUBJECTS </td>
                <td class="inv2">NO. OF UNITS (W/O MULTIPLIERS)</td>
              </tr>
              <tr>
                <td class="inv2">&nbsp;</td>
                <td class="inv2">&nbsp;</td>
                <td class="inv2">&nbsp;</td>
              </tr>
              <tr>
                <td class="inv2">____________________________</td>
                <td class="inv2">____________________________</td>
                <td class="inv2">____________________________</td>
              </tr>
              <tr>
                <td class="inv2">UP COLLEGE / DEPARTMENT</td>
                <td class="inv2">NO. OF SUBJECTS </td>
                <td class="inv2">NO. OF UNITS (W/O MULTIPLIERS)</td>
              </tr>
              </center>
            </table>
            <sub>
              <b>
                NOTE: A faculty member teaching in another college and/or
                another Constituent University (CU) should file a separate Form
                67 (FSR) in that college and/or CU. In the event that a 2nd or
                3rd FSR needs to be prepared, only the teaching load and
                consultation hours should be completed. Permission fromf the
                Chancellor should be sought before teaching outside the
                University.
              </b>
            </sub>
            <div>
              <Divider hidden="true" />
              <table class="fsrtable">
                <tr>
                  <td class="inv2">Certified Correct:</td>
                </tr>
                <tr>
                  <td class="inv2">
                    ________________________________________________
                  </td>
                </tr>
                <tr>
                  <td class="inv2">
                    <b>MYRNA G. CARANDANG</b>
                  </td>
                </tr>
                <tr>
                  <td class="inv2">University Registrar</td>
                </tr>
              </table>
            </div>
          </div>
        </p>

        <p>
          <div>
            <div>
              <b>II. RESEARCH/TEXTBOOK WRITING/CREATIVE WORK</b>
            </div>
            <div>
              <b>II. A. RESEARCH</b>
            </div>

            <b>II. A1. RESEARCH PROPOSAL</b>
            <table class="fsrtable">
              <tr>
                <th class="thtable">TITLE (SPECIFY COMPLETE TITLE)</th>
                <th class="thtable">CO-WORKERS INVOLVED</th>
                <th class="thtable">FUNDING AGENCY</th>
                <th class="thtable">APPROVED CREDIT UNITS</th>
              </tr>
                  {this.state.pubs.map(item => {
                    if(item.subcategory==='Research Proposal'){
                      return (
                        <tr>
                        <td class="tdtable">{item.title}</td>
                        <td class="tdtable">
                          {item.Coworkers.map(item2 => {
                              return (
                                <div className="item2" key={item.emp_id}>
                                  {item2.f_name} {item2.l_name}
                                </div>
                              );
                          })}
                        </td>
                        <td class="tdtable">{item.funding}</td>
                        <td class="tdtable">{item.credit_units}</td>
                        </tr>
                      );
                    }
                  })}
            </table>
            <div align="right">
              Total Research Work Load Credits (RLC) _______________
            </div>

            <b>
              II. A2. RESEARCH IMPLEMENTATION (Please attach Progress Report)
            </b>
            <table class="fsrtable">
              <tr>
                <th class="thtable">TITLE (SPECIFY COMPLETE TITLE)</th>
                <th class="thtable">CO-WORKERS INVOLVED</th>
                <th class="thtable">
                  START DATE<br />MM/DD/YY
                </th>
                <th class="thtable">
                  END DATE<br />MM/DD/YY
                </th>
                <th class="thtable">FUNDING AGENCY</th>
                <th class="thtable">APPROVED CREDIT UNITS</th>
              </tr>
                  {this.state.pubs.map(item => {
                    if(item.subcategory==='Research Implementation'){
                      return (
                        <tr>
                        <td class="tdtable">{item.title}</td>
                        <td class="tdtable">
                          {item.Coworkers.map(item2 => {
                              return (
                                <div className="item2" key={item.emp_id}>
                                  {item2.f_name} {item2.l_name}
                                </div>
                              );
                          })}
                        </td>
                        <td class="tdtable">{item.start_date}</td>
                        <td class="tdtable">{item.end_date}</td>
                        <td class="tdtable">{item.funding}</td>
                        <td class="tdtable">{item.credit_units}</td>
                        </tr>
                      );
                    }
                  })}
            </table>
            <div align="right">
              Total Research Work Load Credits (RLC) _______________
            </div>

            <Divider hidden="true" />
            <div>
              <b>II. B. CREATIVE WORK</b>
            </div>

            <b>
              II. B1. ORAL/POSTER PAPERS PRESENTED IN CONFERENCES (Please attach
              first page of article)
            </b>
            <table class="fsrtable">
              <tr>
                <th class="thtable">
                  TITLE (SPECIFY COMPLETE TITLE, PLACE, PUBLICATION)
                </th>
                <th class="thtable">CO-WORKERS INVOLVED</th>
                <th class="thtable">
                  DATE OF PUBLICATION<br />MM/DD/YY
                </th>
                <th class="thtable">APPROVED CREDIT UNITS</th>
              </tr>
                  {this.state.pubs.map(item => {
                    if(item.subcategory==='Oral/Poster Papers'){
                      return (
                        <tr>
                        <td class="tdtable">{item.title}</td>
                        <td class="tdtable">
                          {item.Coworkers.map(item2 => {
                              return (
                                <div className="item2" key={item.emp_id}>
                                  {item2.f_name} {item2.l_name}
                                </div>
                              );
                          })}
                        </td>
                        <td class="tdtable">{item.end_date}</td>
                        <td class="tdtable">{item.credit_units}</td>
                        </tr>
                      );
                    }
                  })}
            </table>
            <div align="right">
              Creative Work Load Credits (CLC) _______________
            </div>

            <b>
              II. B2. PAPERS PUBLISHED IN PROCEEDINGS OF CONFERENCES (Please
              attach first page of article)
            </b>
            <table class="fsrtable">
              <tr>
                <th class="thtable">
                  TITLE (SPECIFY COMPLETE TITLE, PLACE, PUBLICATION)
                </th>
                <th class="thtable">CO-WORKERS INVOLVED</th>
                <th class="thtable">
                  DATE OF PUBLICATION<br />MM/DD/YY
                </th>
                <th class="thtable">APPROVED CREDIT UNITS</th>
              </tr>
                  {this.state.pubs.map(item => {
                    if(item.subcategory==='Papers for Conferences'){
                      return (
                        <tr>
                        <td class="tdtable">{item.title}</td>
                        <td class="tdtable">
                          {item.Coworkers.map(item2 => {
                              return (
                                <div className="item2" key={item.emp_id}>
                                  {item2.f_name} {item2.l_name}
                                </div>
                              );
                          })}
                        </td>
                        <td class="tdtable">{item.end_date}</td>
                        <td class="tdtable">{item.credit_units}</td>
                        </tr>
                      );
                    }
                  })}
            </table>
            <div align="right">
              Creative Work Load Credits (CLC) _______________
            </div>

            <b>
              II. B3. MONOGRAPHS: manuals, training modules (Please attach first
              page of article)
            </b>
            <table class="fsrtable">
              <tr>
                <th class="thtable">
                  TITLE (SPECIFY COMPLETE TITLE, PLACE, PUBLICATION)
                </th>
                <th class="thtable">CO-WORKERS INVOLVED</th>
                <th class="thtable">
                  DATE OF PUBLICATION<br />MM/DD/YY
                </th>
                <th class="thtable">APPROVED CREDIT UNITS</th>
              </tr>
                  {this.state.pubs.map(item => {
                    if(item.subcategory==='Monographs'){
                      return (
                        <tr>
                        <td class="tdtable">{item.title}</td>
                        <td class="tdtable">
                          {item.Coworkers.map(item2 => {
                              return (
                                <div className="item2" key={item.emp_id}>
                                  {item2.f_name} {item2.l_name}
                                </div>
                              );
                          })}
                        </td>
                        <td class="tdtable">{item.end_date}</td>
                        <td class="tdtable">{item.credit_units}</td>
                        </tr>
                      );
                    }
                  })}
            </table>
            <div align="right">
              Creative Work Load Credits (CLC) _______________
            </div>

            <b>
              II. B4. ARTICLES IN REFEREED JOURNALS (Please attach first page of
              article)
            </b>
            <table class="fsrtable">
              <tr>
                <th class="thtable">
                  TITLE (SPECIFY COMPLETE TITLE, PLACE, PUBLICATION)
                </th>
                <th class="thtable">CO-WORKERS INVOLVED</th>
                <th class="thtable">
                  DATE OF PUBLICATION<br />MM/DD/YY
                </th>
                <th class="thtable">APPROVED CREDIT UNITS</th>
              </tr>
                  {this.state.pubs.map(item => {
                    if(item.subcategory==='Articles in referred journals'){
                      return (
                        <tr>
                        <td class="tdtable">{item.title}</td>
                        <td class="tdtable">
                          {item.Coworkers.map(item2 => {
                              return (
                                <div className="item2" key={item.emp_id}>
                                  {item2.f_name} {item2.l_name}
                                </div>
                              );
                          })}
                        </td>
                        <td class="tdtable">{item.end_date}</td>
                        <td class="tdtable">{item.credit_units}</td>
                        </tr>
                      );
                    }
                  })}
            </table>
            <div align="right">
              Creative Work Load Credits (CLC) _______________
            </div>

            <b>
              II. B5. CHAPTERS IN A BOOK (Please attach first page of article)
            </b>
            <table class="fsrtable">
              <tr>
                <th class="thtable">
                  TITLE (SPECIFY COMPLETE TITLE, PLACE, PUBLICATION)
                </th>
                <th class="thtable">CO-WORKERS INVOLVED</th>
                <th class="thtable">
                  DATE OF PUBLICATION<br />MM/DD/YY
                </th>
                <th class="thtable">APPROVED CREDIT UNITS</th>
              </tr>
                  {this.state.pubs.map(item => {
                    if(item.subcategory==='Chapters in a book'){
                      return (
                        <tr>
                        <td class="tdtable">{item.title}</td>
                        <td class="tdtable">
                          {item.Coworkers.map(item2 => {
                              return (
                                <div className="item2" key={item.emp_id}>
                                  {item2.f_name} {item2.l_name}
                                </div>
                              );
                          })}
                        </td>
                        <td class="tdtable">{item.end_date}</td>
                        <td class="tdtable">{item.credit_units}</td>
                        </tr>
                      );
                    }
                  })}
            </table>
            <div align="right">
              Creative Work Load Credits (CLC) _______________
            </div>

            <b>II. B6. BOOKS (Please attach first page of article)</b>
            <table class="fsrtable">
              <tr>
                <th class="thtable">
                  TITLE (SPECIFY COMPLETE TITLE, PLACE, PUBLICATION)
                </th>
                <th class="thtable">CO-WORKERS INVOLVED</th>
                <th class="thtable">
                  DATE OF PUBLICATION<br />MM/DD/YY
                </th>
                <th class="thtable">APPROVED CREDIT UNITS</th>
              </tr>
                  {this.state.pubs.map(item => {
                    if(item.subcategory==='Books'){
                      return (
                        <tr>
                        <td class="tdtable">{item.title}</td>
                        <td class="tdtable">
                          {item.Coworkers.map(item2 => {
                              return (
                                <div className="item2" key={item.emp_id}>
                                  {item2.f_name} {item2.l_name}
                                </div>
                              );
                          })}
                        </td>
                        <td class="tdtable">{item.end_date}</td>
                        <td class="tdtable">{item.credit_units}</td>
                        </tr>
                      );
                    }
                  })}
            </table>
            <div align="right">
              Creative Work Load Credits (CLC) _______________
            </div>

            <b>
              II. B7. OTHERS (e.g. plays, poetry, musical arrangements, etc.)
              (Please attach copy of program; arrangements, or poetry)
            </b>
            <table class="fsrtable">
              <tr>
                <th class="thtable">
                  TITLE (SPECIFY COMPLETE TITLE, PLACE, PUBLICATION)
                </th>
                <th class="thtable">CO-WORKERS INVOLVED</th>
                <th class="thtable">
                  DATE OF PUBLICATION<br />MM/DD/YY
                </th>
                <th class="thtable">APPROVED CREDIT UNITS</th>
              </tr>
                  {this.state.pubs.map(item => {
                    if(item.subcategory==='Others'){
                      return (
                        <tr>
                        <td class="tdtable">{item.title}</td>
                        <td class="tdtable">
                          {item.Coworkers.map(item2 => {
                              return (
                                <div className="item2" key={item.emp_id}>
                                  {item2.f_name} {item2.l_name}
                                </div>
                              );
                          })}
                        </td>
                        <td class="tdtable">{item.end_date}</td>
                        <td class="tdtable">{item.credit_units}</td>
                        </tr>
                      );
                    }
                  })}
            </table>
            <div align="right">
              Creative Work Load Credits (CLC) _______________
            </div>
          </div>
        </p>

        <Divider hidden="true" />
        <p>
          <div>
            <b>III. ADMINISTRATIVE WORK</b>
            <center>
              <sub>
                Specify if administrative work is inside or outside the college.
                Include even if no load credit or no honorarium is received.
              </sub>
            </center>
            <table class="fsrtable">
              <tr>
                <th class="thtable">POSITION/NATURE OF ADMINISTRATIVE WORK</th>
                <th class="thtable">OFFICE/UNIT</th>
                <th class="thtable">APPROVED CREDIT UNITS</th>
              </tr>
              {this.state.adminwork.map(item => {
                return (
                  <tr>
                    <td class="tdtable">{item.work_position}/{item.nature_of_work}</td>
                    <td class="tdtable">{item.office}</td>
                    <td class="tdtable">{item.credit_units}</td>
                  </tr>
                );
              })}
            </table>
            <div align="right">
              Total Administrative Load Credits (ALC) _______________
            </div>
          </div>
        </p>

        <Divider hidden="true" />
        <p>
          <div>
            <b>IV. EXTENSION AND COMMUNITY SERVICE</b> (e.g. training programs,
            services, to UP-PGH, Pahinungod, etc.)
            <div>
              <sub>
                (Include all extension and community service this semester and
                all work in the immediately preceding semester which were not
                reported at that time (even if no load credits or honorarium are
                received). Department Chairs and Deans should afx their initials
                beside the credit units which they approved or endorsed).
              </sub>
            </div>
            <b>IV A. TRAININGS</b>
            <table class="fsrtable">
              <tr>
                <th class="thtable">
                  TITLE OF ACTIVITY/<br />PROGRAM
                </th>
                <th class="thtable">
                  NO. OF HOURS<br />INCLUDING PREPARATION
                </th>
                <th class="thtable">
                  NO. OF<br />PARTICIPANTS
                </th>
                <th class="thtable">
                  START DATE<br />MM/DD/YY
                </th>
                <th class="thtable">
                  END DATE<br />MM/DD/YY
                </th>
                <th class="thtable">ROLE</th>
                <th class="thtable">FUNDING AGENCY</th>
                <th class="thtable">
                  APPROVED<br />CREDIT UNITS
                </th>
              </tr>
              {this.state.extension.map(item => {
                if(item.extension_type==='Trainings'){
                  return (
                    <tr>
                      <td class="tdtable">{item.extension_name}</td>
                      <td class="tdtable">{item.no_of_hours}</td>
                      <td class="tdtable">{item.no_of_participants}</td>
                      <td class="tdtable">{item.start_time}</td>
                      <td class="tdtable">{item.end_time}</td>
                      <td class="tdtable">{item.extension_role}</td>
                      <td class="tdtable">{item.funding_agency}</td>
                      <td class="tdtable">{item.credit_unit}</td>
                    </tr>
                  );
                }
              })}
            </table>
            <div align="right">
              Total Extension and Community Credits (ELC) _______________
            </div>
            <b>
              IV. B. INFORMATION DISSEMINATION (e.g. print, broadcast T.V.,
              online)
            </b>
            <table class="fsrtable">
              <tr>
                <th class="thtable">
                  TITLE OF ACTIVITY/<br />PROGRAM
                </th>
                <th class="thtable">
                  NO. OF HOURS<br />INCLUDING PREPARATION
                </th>
                <th class="thtable">
                  NO. OF<br />PARTICIPANTS
                </th>
                <th class="thtable">
                  START DATE<br />MM/DD/YY
                </th>
                <th class="thtable">
                  END DATE<br />MM/DD/YY
                </th>
                <th class="thtable">ROLE</th>
                <th class="thtable">FUNDING AGENCY</th>
                <th class="thtable">
                  APPROVED<br />CREDIT UNITS
                </th>
              </tr>
              {this.state.extension.map(item => {
                if(item.extension_type==='Information Dissemination'){
                  return (
                    <tr>
                      <td class="tdtable">{item.extension_name}</td>
                      <td class="tdtable">{item.no_of_hours}</td>
                      <td class="tdtable">{item.no_of_participants}</td>
                      <td class="tdtable">{item.start_time}</td>
                      <td class="tdtable">{item.end_time}</td>
                      <td class="tdtable">{item.extension_role}</td>
                      <td class="tdtable">{item.funding_agency}</td>
                      <td class="tdtable">{item.credit_unit}</td>
                    </tr>
                  );
                }
              })}
            </table>
            <div align="right">
              Total Extension and Community Credits (ELC) _______________
            </div>
            <b>IV. C. WORKSHOPS</b>
            <table class="fsrtable">
              <tr>
                <th class="thtable">
                  TITLE OF ACTIVITY/<br />PROGRAM
                </th>
                <th class="thtable">
                  NO. OF HOURS<br />INCLUDING PREPARATION
                </th>
                <th class="thtable">
                  NO. OF<br />PARTICIPANTS
                </th>
                <th class="thtable">
                  START DATE<br />MM/DD/YY
                </th>
                <th class="thtable">
                  END DATE<br />MM/DD/YY
                </th>
                <th class="thtable">ROLE</th>
                <th class="thtable">FUNDING AGENCY</th>
                <th class="thtable">
                  APPROVED<br />CREDIT UNITS
                </th>
              </tr>
              {this.state.extension.map(item => {
                if(item.extension_type==='Workshops'){
                  return (
                    <tr>
                      <td class="tdtable">{item.extension_name}</td>
                      <td class="tdtable">{item.no_of_hours}</td>
                      <td class="tdtable">{item.no_of_participants}</td>
                      <td class="tdtable">{item.start_time}</td>
                      <td class="tdtable">{item.end_time}</td>
                      <td class="tdtable">{item.extension_role}</td>
                      <td class="tdtable">{item.funding_agency}</td>
                      <td class="tdtable">{item.credit_unit}</td>
                    </tr>
                  );
                }
              })}
            </table>
            <div align="right">
              Total Extension and Community Credits (ELC) _______________
            </div>
            <b>IV. D. SYMPOSIUM</b>
            <table class="fsrtable">
              <tr>
                <th class="thtable">
                  TITLE OF ACTIVITY/<br />PROGRAM
                </th>
                <th class="thtable">
                  NO. OF HOURS<br />INCLUDING PREPARATION
                </th>
                <th class="thtable">
                  NO. OF<br />PARTICIPANTS
                </th>
                <th class="thtable">
                  START DATE<br />MM/DD/YY
                </th>
                <th class="thtable">
                  END DATE<br />MM/DD/YY
                </th>
                <th class="thtable">ROLE</th>
                <th class="thtable">FUNDING AGENCY</th>
                <th class="thtable">
                  APPROVED<br />CREDIT UNITS
                </th>
              </tr>
              {this.state.extension.map(item => {
                if(item.extension_type==='Symposium'){
                  return (
                    <tr>
                      <td class="tdtable">{item.extension_name}</td>
                      <td class="tdtable">{item.no_of_hours}</td>
                      <td class="tdtable">{item.no_of_participants}</td>
                      <td class="tdtable">{item.start_time}</td>
                      <td class="tdtable">{item.end_time}</td>
                      <td class="tdtable">{item.extension_role}</td>
                      <td class="tdtable">{item.funding_agency}</td>
                      <td class="tdtable">{item.credit_unit}</td>
                    </tr>
                  );
                }
              })}
            </table>
            <div align="right">
              Total Extension and Community Credits (ELC) _______________
            </div>
            <b>IV. E. OTHERS (e.g. community action services)</b>
            <table class="fsrtable">
              <tr>
                <th class="thtable">
                  TITLE OF ACTIVITY/<br />PROGRAM
                </th>
                <th class="thtable">
                  NO. OF HOURS<br />INCLUDING PREPARATION
                </th>
                <th class="thtable">
                  NO. OF<br />PARTICIPANTS
                </th>
                <th class="thtable">
                  START DATE<br />MM/DD/YY
                </th>
                <th class="thtable">
                  END DATE<br />MM/DD/YY
                </th>
                <th class="thtable">ROLE</th>
                <th class="thtable">FUNDING AGENCY</th>
                <th class="thtable">
                  APPROVED<br />CREDIT UNITS
                </th>
              </tr>
              {this.state.extension.map(item => {
                if(item.extension_type==='Others'){
                  return (
                    <tr>
                      <td class="tdtable">{item.extension_name}</td>
                      <td class="tdtable">{item.no_of_hours}</td>
                      <td class="tdtable">{item.no_of_participants}</td>
                      <td class="tdtable">{item.start_time}</td>
                      <td class="tdtable">{item.end_time}</td>
                      <td class="tdtable">{item.extension_role}</td>
                      <td class="tdtable">{item.funding_agency}</td>
                      <td class="tdtable">{item.credit_unit}</td>
                    </tr>
                  );
                }
              })}
            </table>
            <div align="right">
              Total Extension and Community Credits (ELC) _______________
            </div>
          </div>
        </p>

        <Divider hidden="true" />
        <p>
          <div>
            <b>V. STUDY LOAD</b>
            <table class="inv">
              <tr>
                <td class="inv2">Degree Enrolled In:</td>
                <td class="inv2"><center><u>{this.state.degree}</u></center></td>
                <td class="inv2">University Enrolled In:</td>
                <td class="inv2"><center><u>{this.state.uni}</u></center></td>
              </tr>
              <tr>
                <td class="inv2">
                  <sub>On Full Study Leave w/ Pay?</sub>
                </td>
                {this.state.studyleave==='Yes'?
                  <td class="inv2">Yes ____X____ No _________</td>
                  :
                  <td class="inv2">Yes _________ No ____X____</td>
                }
                <td class="inv2">
                  <sub>Recipient of faculty fellowship?</sub>
                </td>
                {this.state.fellowship==='Yes'?
                  <td class="inv2">Yes ____X____ No _________</td>
                  :
                  <td class="inv2">Yes _________ No ____X____</td>
                }
              </tr>
            </table>
            <br />
            <div>
              FOR FACULTY MEMBERS WITH SOME TEACHING LOAD BUT ALSO HAVE STUDY
              LOADS:
            </div>
            <div>
              Study Load CREDITS (i.e. study load counted as part of normal
              12-unit faculty load)
            </div>
            <div>
              Study Load Units (i.e. study load done above a full teaching load)
            </div>
            <table class="fsrtable">
              <tr>
                <th class="thtable">Course Number</th>
                <th class="thtable">Course Credit</th>
                <th class="thtable">Day/s</th>
                <th class="thtable">Time</th>
                <th class="thtable">School</th>
              </tr>
              {this.state.studyload.map(item => {
                  return (
                    <tr>
                      <td class="tdtable">{item.course_no}</td>
                      <td class="tdtable">{item.credits}</td>
                      <td class="tdtable">{item.days}</td>
                      <td class="tdtable">{item.start_time} to {item.end_time}</td>
                      <td class="tdtable">{item.school}</td>
                    </tr>
                  );
              })}
            </table>
            <div align="right">
              Total Study Load Credits (SLC) _______________
            </div>
            <div align="right">
              TOTAL FACULTY LOAD IN CREDIT UNITS _______________
            </div>
          </div>
        </p>

        <Divider hidden="true" />
        <p>
          <div>
            <b>VI. LIMITED PRACTICE OF PROFESSION</b>
            <table class="inv">
              <tr>
                <td colspan="2" class="inv2">
                  Have you applied for official permission for limited practice
                  of profession?
                </td>
                {this.state.profession.haveApplied===0?
                  <td colspan="2" class="inv2">
                    Yes _________ No ____X____
                  </td>
                  :
                  <td colspan="2" class="inv2">
                    Yes ____X____ No _________
                  </td>
                }
              </tr>
              <tr>
                <td class="inv2">
                  If yes, indicate date (MM/DD/YY) permission was submitted:
                </td>
                {this.state.profession.haveApplied===0?
                <td class="inv2">_______________</td>
                :
                <td class="inv2"><u>{this.state.profession.date_submitted}</u></td>
                }
                <td class="inv2">Or approved:</td>
                <td class="inv2">_______________</td>
              </tr>
            </table>
          </div>
        </p>

        <Divider hidden="true" />
        <p>
          <div>
            <b>VII. PROFESSORIAL CHAIR or FACULTY GRANT RECIPIENT or NOMINEE</b>
            <table class="inv">
              <tr>
                <td colspan="4" class="inv2">
                  Please write NA on the space on the right if neither a
                  recipient nor a nominee
                </td>
                {this.state.profchair.type==='Yes'?
                  <td colspan="2" class="inv2">
                    _________________
                  </td>
                :
                  <td colspan="2" class="inv2">
                    <u>_______NA________</u>
                  </td>
                }
              </tr>
              <tr>
                <td colspan="4" class="inv2">
                  <sub>
                    No appointment has been approved as of today but college has
                    already nominated (Y/N):
                  </sub>
                </td>
                {this.state.profchair.is_approved==='1'?
                  <td colspan="2" class="inv2">
                    <u>_____Yes_______</u>
                  </td>
                :
                  <td colspan="2" class="inv2">
                    <u>_______No________</u>
                  </td>
                }
              </tr>
              <tr>
                <td class="inv2">PROFESSORIAL CHAIR </td>
                <td class="inv2"><u>{this.state.profchair.professional_chair}</u></td>
                <td class="inv2">GRANT</td>
                <td class="inv2"><u>{this.state.profchair.grants}</u></td>
                <td class="inv2">CHAIR/GRANT TITLE</td>
                <td class="inv2"><u>{this.state.profchair.grant_title}</u></td>
              </tr>
              <tr>
                <td colspan="2" class="inv2">
                  APPROVED START DATE (MM/DD/YY)
                </td>
                <td class="inv2"><u>{this.state.profchair.start_date}</u></td>
                <td colspan="2" class="inv2">
                  END DATE (MM/DD/YY)
                </td>
                <td class="inv2"><u>{this.state.profchair.end_date}</u></td>
              </tr>
            </table>
          </div>
        </p>

        <Divider hidden="true" />
        <p>
          <div>
            <b>VIII. CONSULTATION HOURS:</b> (From U.P. Faculty Manual: “At
            least 10 hours per week during regular hours.”)
            <center>
              <sub>
                Please specify definite days and hours; avoid “By appointment.”
              </sub>
            </center>
            <table class="fsrtable">
              <tr>
                <th class="thtable">DAYS</th>
                <th class="thtable">TIME</th>
                <th class="thtable">PLACE</th>
              </tr>
              {this.state.consul.map(item => {
                  return (
                    <tr>
                      <td class="tdtable">{item.day}</td>
                      <td class="tdtable">{item.consultation_start_time} to {item.consultation_end_time}</td>
                      <td class="tdtable">{item.consultation_place}</td>
                    </tr>
                  );
              })}
            </table>
            <div align="right">Total hours per week _______________</div>
          </div>
        </p>

        <Divider hidden="true" />
        <p>
          <div>
            <b>IX. CERTIFICATION: </b>
            <br />
            The faculty member certifies that all the information provided above
            are correct as of the date of signing. By signing below, the
            Department Chair certifies to the correctness of the reported data
            on teaching, administrative and study load inside the department.
            The Dean certifies the correctness of the reported data on teaching
            , administrative and study load inside the college. (PRINTED NAMES
            AND SIGNATURES)
            <table class="inv">
              <tr>
                <td class="inv2">_____________________</td>
                <td class="inv2">____________________</td>
                <td class="inv2">____________________</td>
                <td class="inv2">____________________</td>
              </tr>
              <tr>
                <td class="inv2">Faculty</td>
                <td class="inv2">Director/Chairman</td>
                <td class="inv2">College Secretary</td>
                <td class="inv2">Dean</td>
              </tr>
              <tr>
                <td class="inv2">Date: </td>
                <td class="inv2">Date: </td>
                <td class="inv2">Date: </td>
                <td class="inv2">Date: </td>
              </tr>
            </table>
            <sub>
              NOTE: Every faculty member in residence (i. e. receiving salary
              from U.P.). including those on full study leave with pay,
              fellowship or sabbatical is required to fill up a Faculty Service
              Record every semester or trimester. File copies of this form shall
              be maintained in the department, in the college and at the Ofce of
              the Vice Chancellor for Academic Afairs.
            </sub>
          </div>
        </p>
      </div>
      </div>
    );} else return (<div></div>);
  }
}
