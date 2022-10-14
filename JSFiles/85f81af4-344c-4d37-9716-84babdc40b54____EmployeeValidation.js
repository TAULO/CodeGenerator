var bootstrap = require('../bootstrap');
var request = require('supertest-as-promised');
var settings = bootstrap.settings;
var XMLParser = require('xmldom').DOMParser;
var log = bootstrap.log;
var wd = require('wd');
var fs = require('fs');
var moment = require('moment');
var connect = require('../Connect');
var assert = require('assert');

var date = new Date();
var log = bootstrap.log;
var resultsXmlFile;
var browser;
var TheAPI = request(settings.qtest.apiurl);
var Testurl = request(settings.local.path);
var authkey = "Basic N2I1YTM4NzA1ZDdiMzU2MjY1NTkyNTQwNmE2NTJlMzI6NjU1ZjUyMzEyODIxMmQ2ZTcwNjM0NDQ2MjI0YzJhNDg=";

var EmpNumupdate="20";
var randomnumber=Math.floor(Math.random()*7777777771)
var EmpNum=106;
var authtoken;
var authtokenandtype; 

describe('Lifemap api', function() {
    this.timeout(bootstrap.MaxWaittime); // To get the app open in the emulator

    var exe_start_date = new moment.utc().format();
    console.log("start date " + exe_start_date);
    connect = new connect(browser);
   
     it('should return login using outh', function(done) {
        console.log("<------------------------------TESTCASE-login------------------------------>");
        testCaseId = 998021;
        Testurl
          //.get('/groupadmin-1.0.2/api/user/login?grant_type=password&username='+Usernameforlogin+'&password='+passwordforlogin)
          .get('/groupadmin-1.0.2/api/user/login?grant_type=password&username=ankitap@mobiquityinc.com&password=Password1@')
          .set('Content-Type','application/json')
          .set('Authorization',authkey)
          .send()
          .expect(200)
          .end(function(err, res) {
                log.info('Test: Response code: '+res.statusCode);
                log.info('Test: Response: \n'+ JSON.stringify(res.body, null, 2));

                authtoken = res.body.access_token;
                console.log("Token is "+ authtoken);
                authtokenandtype =("Bearer "+ authtoken);
                console.log(authtokenandtype);

                if(res.statusCode==200) {
                    status ="PASS";
                    log.info("The test passed..!!!");
                 }else{
                    status ="FAIL";
                    log.info("As one of the test-case failed");
                }
            log.info("status of the charter is...: " + status);
            assert.equal(res.statusCode, 200);
            assert.notEqual(0, res.length);
            done();
        });
    })

    it('To create employee,  Validation message for hiredate should be valid status code 400', function(done) {
        console.log("<------------------------------TESTCASE-1------------------------------>");
        testCaseId = 1034598;
        Testurl
          .post('/groupadmin-1.0.2/api/employee')
          .set('Content-Type','application/json')
          .set('Authorization',authtokenandtype)
          .send({
                "status":"FT",
                "occupation":"QA",
                "maritalStatus":"MA",
                "hireDate":"2012-05-1",
                "salary": "2299999991.67",
                "salaryFreq":"A",
                "firstName":"sneha",
                "middleName1":"",
                "lastName":"shah",
                "nameSuffix":"Jr.",
                "divisionID":"1112",
                "ssn":randomnumber,
                "dob":"2014-08-12",
                "gender":"M",
                "effectiveDate":"2014-11-19",
                "terminationDate":"2014-11-20",
                "terminationReason":"TE",
                "address": [
                { "type": "MN", "addressLine1": "1777 TimberlaneDr.", "addressLine2": "Unit5", "addressCity": "Austin", "addressState": "TX", "addressZipCode": "78740", "addressCountry": "US", "email": "jp@company.com", "phone": "+55555569.-", "phoneExtension": "", "fax": "+55555567.-", "faxExtension": "" }
                ,
                { "type": "MN", "addressLine1": "1777 TimberlaneDr.", "addressLine2": "Unit5", "addressCity": "Austin", "addressState": "TX", "addressZipCode": "78740", "addressCountry": "US", "email": "jp@company.com", "phone": "+55555569.-", "phoneExtension": "", "fax": "5555556789", "faxExtension": "" }
                ]
          })
          .expect(400)
          .end(function(err, res) {
                log.info('Test1: Response code: '+res.statusCode);
                log.info('Test1: Response: \n'+JSON.stringify(res.body, null, 2));
                if(res.statusCode==400) {
                    status ="PASS";
                    log.info("The test passed..!!!");
                 }else{
                    status ="FAIL";
                    log.info("As one of the test-case failed");
                }
            log.info("status of the charter is...: " + status);
            assert.equal(res.statusCode, 400);
            assert.notEqual(0, res.length);
            done();
        });
    })
    
    it('To create employee, Validation message for maritalStatus should be valid status code 400', function(done) {
        console.log("<------------------------------TESTCASE-2------------------------------>");
        testCaseId = 1034598;
        Testurl
          .post('/groupadmin-1.0.2/api/employee')
          .set('Content-Type','application/json')
          .set('Authorization',authtokenandtype)
          .send({
                "status":"FT",
                "occupation":"QA",
                "maritalStatus":"l",
                "hireDate":"2012-05-20",
                "salary": "2299999991.67",
                "salaryFreq":"A",
                "firstName":"sneha",
                "middleName1":"",
                "lastName":"shah",
                "nameSuffix":"Jr.",
                "divisionID":"1112",
                "ssn":randomnumber,
                "dob":"2014-08-12",
                "gender":"M",
                "effectiveDate":"2014-11-19",
                "terminationDate":"2014-11-20",
                "terminationReason":"TE",
                "address": [
                { "type": "MN", "addressLine1": "1777 TimberlaneDr.", "addressLine2": "Unit5", "addressCity": "Austin", "addressState": "TX", "addressZipCode": "78740", "addressCountry": "US", "email": "jp@company.com", "phone": "+55555569.-", "phoneExtension": "", "fax": "+55555567.-", "faxExtension": "" }
                ,
                { "type": "MN", "addressLine1": "1777 TimberlaneDr.", "addressLine2": "Unit5", "addressCity": "Austin", "addressState": "TX", "addressZipCode": "78740", "addressCountry": "US", "email": "jp@company.com", "phone": "+55555569.-", "phoneExtension": "", "fax": "5555556789", "faxExtension": "" }
                ]
          })
          .expect(400)
          .end(function(err, res) {
                log.info('Test2: Response code: '+res.statusCode);
                log.info('Test2: Response: \n'+JSON.stringify(res.body, null, 2));
                if(res.statusCode==400) {
                    status ="PASS";
                    log.info("The test passed..!!!");
                 }else{
                    status ="FAIL";
                    log.info("As one of the test-case failed");
                }
            log.info("status of the charter is...: " + status);
            assert.equal(res.statusCode, 400);
            assert.notEqual(0, res.length);
            done();
        });
    })

    it('To create employee, Validation message for salaryFreq should be valid status code 400', function(done) {
        console.log("<------------------------------TESTCASE-3------------------------------>");
        testCaseId = 1034598;
        Testurl
          .post('/groupadmin-1.0.2/api/employee')
          .set('Content-Type','application/json')
          .set('Authorization',authtokenandtype)
          .send({
                "status":"FT",
                "occupation":"QA",
                "maritalStatus":"MA",
                "hireDate":"2012-05-20",
                "salary": "2299999991.67",
                "salaryFreq":"l",
                "firstName":"sneha",
                "middleName1":"",
                "lastName":"shah",
                "nameSuffix":"Jr.",
                "divisionID":"1112",
                "ssn":randomnumber,
                "dob":"2014-08-12",
                "gender":"M",
                "effectiveDate":"2014-11-19",
                "terminationDate":"2014-11-20",
                "terminationReason":"TE",
                "address": [
                { "type": "MN", "addressLine1": "1777 TimberlaneDr.", "addressLine2": "Unit5", "addressCity": "Austin", "addressState": "TX", "addressZipCode": "78740", "addressCountry": "US", "email": "jp@company.com", "phone": "+55555569.-", "phoneExtension": "", "fax": "+55555567.-", "faxExtension": "" }
                ,
                { "type": "MN", "addressLine1": "1777 TimberlaneDr.", "addressLine2": "Unit5", "addressCity": "Austin", "addressState": "TX", "addressZipCode": "78740", "addressCountry": "US", "email": "jp@company.com", "phone": "+55555569.-", "phoneExtension": "", "fax": "5555556789", "faxExtension": "" }
                ]
          })
          .expect(400)
          .end(function(err, res) {
                log.info('Test3: Response code: '+res.statusCode);
                log.info('Test3: Response: \n'+JSON.stringify(res.body, null, 2));
                if(res.statusCode==400) {
                    status ="PASS";
                    log.info("The test passed..!!!");
                 }else{
                    status ="FAIL";
                    log.info("As one of the test-case failed");
                }
            log.info("status of the charter is...: " + status);
            assert.equal(res.statusCode, 400);
            assert.notEqual(0, res.length);
            done();
        });
    })
    
    it('To create employee, Validation message for divisionID should be valid status code 401', function(done) {
        console.log("<------------------------------TESTCASE-4------------------------------>");
        testCaseId = 1034598;
        Testurl
          .post('/groupadmin-1.0.2/api/employee')
          .set('Content-Type','application/json')
          .set('Authorization',authtokenandtype)
          .send({
                "status":"FT",
                "occupation":"QA",
                "maritalStatus":"MA",
                "hireDate":"2012-05-20",
                "salary": "2299999991.67",
                "salaryFreq":"A",
                "firstName":"sneha",
                "middleName1":"",
                "lastName":"shah",
                "nameSuffix":"Jr.",
                "divisionID":"111",
                "ssn":randomnumber,
                "dob":"2014-08-12",
                "gender":"M",
                "effectiveDate":"2014-11-19",
                "terminationDate":"2014-11-20",
                "terminationReason":"TE",
                "address": [
                { "type": "MN", "addressLine1": "1777 TimberlaneDr.", "addressLine2": "Unit5", "addressCity": "Austin", "addressState": "TX", "addressZipCode": "78740", "addressCountry": "US", "email": "jp@company.com", "phone": "+55555569.-", "phoneExtension": "", "fax": "+55555567.-", "faxExtension": "" }
                ,
                { "type": "MN", "addressLine1": "1777 TimberlaneDr.", "addressLine2": "Unit5", "addressCity": "Austin", "addressState": "TX", "addressZipCode": "78740", "addressCountry": "US", "email": "jp@company.com", "phone": "+55555569.-", "phoneExtension": "", "fax": "5555556789", "faxExtension": "" }
                ]
          })
          .expect(401)
          .end(function(err, res) {
                log.info('Test4: Response code: '+res.statusCode);
                log.info('Test4: Response: \n'+JSON.stringify(res.body, null, 2));
                if(res.statusCode==401) {
                    status ="PASS";
                    log.info("The test passed..!!!");
                 }else{
                    status ="FAIL";
                    log.info("As one of the test-case failed");
                }
            log.info("status of the charter is...: " + status);
            assert.equal(res.statusCode, 401);
            assert.notEqual(0, res.length);
            done();
        });
    })

    it('To create employee, Validation message for SSN number should be 9 digit valid status code 400', function(done) {
        console.log("<------------------------------TESTCASE-5------------------------------>");
        testCaseId = 1034598;
        Testurl
          .post('/groupadmin-1.0.2/api/employee')
          .set('Content-Type','application/json')
          .set('Authorization',authtokenandtype)
          .send({
                "status":"FT",
                "occupation":"QA",
                "maritalStatus":"MA",
                "hireDate":"2012-05-20",
                "salary": "2299999991.67",
                "salaryFreq":"A",
                "firstName":"sneha",
                "middleName1":"",
                "lastName":"shah",
                "nameSuffix":"Jr.",
                "divisionID":"1182",
                "ssn":"1313131",
                "dob":"2014-08-12",
                "gender":"M",
                "effectiveDate":"2014-11-19",
                "terminationDate":"2014-11-20",
                "terminationReason":"TE",
                "address": [
                { "type": "MN", "addressLine1": "1777 TimberlaneDr.", "addressLine2": "Unit5", "addressCity": "Austin", "addressState": "TX", "addressZipCode": "78740", "addressCountry": "US", "email": "jp@company.com", "phone": "+55555569.-", "phoneExtension": "", "fax": "+55555567.-", "faxExtension": "" }
                ,
                { "type": "MN", "addressLine1": "1777 TimberlaneDr.", "addressLine2": "Unit5", "addressCity": "Austin", "addressState": "TX", "addressZipCode": "78740", "addressCountry": "US", "email": "jp@company.com", "phone": "+55555569.-", "phoneExtension": "", "fax": "5555556789", "faxExtension": "" }
                ]
          })
          .expect(400)
          .end(function(err, res) {
                log.info('Test5: Response code: '+res.statusCode);
                log.info('Test5: Response: \n'+JSON.stringify(res.body, null, 2));
                if(res.statusCode==400) {
                    status ="PASS";
                    log.info("The test passed..!!!");
                 }else{
                    status ="FAIL";
                    log.info("As one of the test-case failed");
                }
            log.info("status of the charter is...: " + status);
            assert.equal(res.statusCode, 400);
            assert.notEqual(0, res.length);
            done();
        });
    })

    it('To create employee, Validation message for DOB valid status code 401', function(done) {
        console.log("<------------------------------TESTCASE-6------------------------------>");
        testCaseId = 1034598;
        Testurl
          .post('/groupadmin-1.0.2/api/employee')
          .set('Content-Type','application/json')
          .set('Authorization',authtokenandtype)
          .send({
                "status":"FT",
                "occupation":"QA",
                "maritalStatus":"MA",
                "hireDate":"2012-05-20",
                "salary": "2299999991.67",
                "salaryFreq":"A",
                "firstName":"sneha",
                "middleName1":"",
                "lastName":"shah",
                "nameSuffix":"Jr.",
                "divisionID":"1182",
                "ssn":randomnumber,
                "dob":"2015-08-12",
                "gender":"M",
                "effectiveDate":"2014-11-19",
                "terminationDate":"2014-11-20",
                "terminationReason":"TE",
                "address": [
                { "type": "MN", "addressLine1": "1777 TimberlaneDr.", "addressLine2": "Unit5", "addressCity": "Austin", "addressState": "TX", "addressZipCode": "78740", "addressCountry": "US", "email": "jp@company.com", "phone": "+55555569.-", "phoneExtension": "", "fax": "+55555567.-", "faxExtension": "" }
                ,
                { "type": "MN", "addressLine1": "1777 TimberlaneDr.", "addressLine2": "Unit5", "addressCity": "Austin", "addressState": "TX", "addressZipCode": "78740", "addressCountry": "US", "email": "jp@company.com", "phone": "+55555569.-", "phoneExtension": "", "fax": "5555556789", "faxExtension": "" }
                ]
          })
          .expect(401)
          .end(function(err, res) {
                log.info('Test6: Response code: '+res.statusCode);
                log.info('Test6: Response: \n'+JSON.stringify(res.body, null, 2));
                if(res.statusCode==401) {
                    status ="PASS";
                    log.info("The test passed..!!!");
                 }else{
                    status ="FAIL";
                    log.info("As one of the test-case failed");
                }
            log.info("status of the charter is...: " + status);
            assert.equal(res.statusCode, 401);
            assert.notEqual(0, res.length);
            done();
        });
    })

    it('To create employee, Validation message for Gender valid status code 400', function(done) {
        console.log("<------------------------------TESTCASE-7------------------------------>");
        testCaseId = 1034598;
        Testurl
          .post('/groupadmin-1.0.2/api/employee')
          .set('Content-Type','application/json')
          .set('Authorization',authtokenandtype)
          .send({
                "status":"FT",
                "occupation":"QA",
                "maritalStatus":"MA",
                "hireDate":"2012-05-20",
                "salary": "2299999991.67",
                "salaryFreq":"A",
                "firstName":"sneha",
                "middleName1":"",
                "lastName":"shah",
                "nameSuffix":"Jr.",
                "divisionID":"1182",
                "ssn":randomnumber,
                "dob":"2012-08-12",
                "gender":"l",
                "effectiveDate":"2014-11-19",
                "terminationDate":"2014-11-20",
                "terminationReason":"TE",
                "address": [
                { "type": "MN", "addressLine1": "1777 TimberlaneDr.", "addressLine2": "Unit5", "addressCity": "Austin", "addressState": "TX", "addressZipCode": "78740", "addressCountry": "US", "email": "jp@company.com", "phone": "+55555569.-", "phoneExtension": "", "fax": "+55555567.-", "faxExtension": "" }
                ,
                { "type": "MN", "addressLine1": "1777 TimberlaneDr.", "addressLine2": "Unit5", "addressCity": "Austin", "addressState": "TX", "addressZipCode": "78740", "addressCountry": "US", "email": "jp@company.com", "phone": "+55555569.-", "phoneExtension": "", "fax": "5555556789", "faxExtension": "" }
                ]
          })
          .expect(400)
          .end(function(err, res) {
                log.info('Test7: Response code: '+res.statusCode);
                log.info('Test7: Response: \n'+JSON.stringify(res.body, null, 2));
                if(res.statusCode==400) {
                    status ="PASS";
                    log.info("The test passed..!!!");
                 }else{
                    status ="FAIL";
                    log.info("As one of the test-case failed");
                }
            log.info("status of the charter is...: " + status);
            assert.equal(res.statusCode, 400);
            assert.notEqual(0, res.length);
            done();
        });
    })

    it('To create employee, Validation message for effective date valid status code 400', function(done) {
        console.log("<------------------------------TESTCASE-8------------------------------>");
        testCaseId = 1034598;
        Testurl
          .post('/groupadmin-1.0.2/api/employee')
          .set('Content-Type','application/json')
          .set('Authorization',authtokenandtype)
          .send({
                "status":"FT",
                "occupation":"QA",
                "maritalStatus":"MA",
                "hireDate":"2012-05-20",
                "salary": "2299999991.67",
                "salaryFreq":"A",
                "firstName":"sneha",
                "middleName1":"",
                "lastName":"shah",
                "nameSuffix":"Jr.",
                "divisionID":"1182",
                "ssn":randomnumber,
                "dob":"2014-08-12",
                "gender":"M",
                "effectiveDate":"204-11-19",
                "terminationDate":"2014-11-20",
                "terminationReason":"TE",
                "address": [
                { "type": "MN", "addressLine1": "1777 TimberlaneDr.", "addressLine2": "Unit5", "addressCity": "Austin", "addressState": "TX", "addressZipCode": "78740", "addressCountry": "US", "email": "jp@company.com", "phone": "+55555569.-", "phoneExtension": "", "fax": "+55555567.-", "faxExtension": "" }
                ,
                { "type": "MN", "addressLine1": "1777 TimberlaneDr.", "addressLine2": "Unit5", "addressCity": "Austin", "addressState": "TX", "addressZipCode": "78740", "addressCountry": "US", "email": "jp@company.com", "phone": "+55555569.-", "phoneExtension": "", "fax": "5555556789", "faxExtension": "" }
                ]
          })
          .expect(400)
          .end(function(err, res) {
                log.info('Test8: Response code: '+res.statusCode);
                log.info('Test8: Response: \n'+JSON.stringify(res.body, null, 2));
                if(res.statusCode==400) {
                    status ="PASS";
                    log.info("The test passed..!!!");
                 }else{
                    status ="FAIL";
                    log.info("As one of the test-case failed");
                }
            log.info("status of the charter is...: " + status);
            assert.equal(res.statusCode, 400);
            assert.notEqual(0, res.length);
            done();
        });
    })

    it('To create employee, Validation message for termination date valid status code 409', function(done) {
        console.log("<------------------------------TESTCASE-9------------------------------>");
        testCaseId = 1034598;
        Testurl
          .post('/groupadmin-1.0.2/api/employee')
          .set('Content-Type','application/json')
          .set('Authorization',authtokenandtype)
          .send({
                "status":"FT",
                "occupation":"QA",
                "maritalStatus":"MA",
                "hireDate":"2012-05-20",
                "salary": "2299999991.67",
                "salaryFreq":"A",
                "firstName":"sneha",
                "middleName1":"",
                "lastName":"shah",
                "nameSuffix":"Jr.",
                "divisionID":"1182",
                "ssn":randomnumber,
                "dob":"2014-08-12",
                "gender":"M",
                "effectiveDate":"2015-11-19",
                "terminationDate":"2014-11-20",
                "terminationReason":"TE",
                "address": [
                { "type": "MN", "addressLine1": "1777 TimberlaneDr.", "addressLine2": "Unit5", "addressCity": "Austin", "addressState": "TX", "addressZipCode": "78740", "addressCountry": "US", "email": "jp@company.com", "phone": "+55555569.-", "phoneExtension": "", "fax": "+55555567.-", "faxExtension": "" }
                ,
                { "type": "MN", "addressLine1": "1777 TimberlaneDr.", "addressLine2": "Unit5", "addressCity": "Austin", "addressState": "TX", "addressZipCode": "78740", "addressCountry": "US", "email": "jp@company.com", "phone": "+55555569.-", "phoneExtension": "", "fax": "5555556789", "faxExtension": "" }
                ]
          })
          .expect(409)
          .end(function(err, res) {
                log.info('Test9: Response code: '+res.statusCode);
                log.info('Test9: Response: \n'+JSON.stringify(res.body, null, 2));
                if(res.statusCode==409) {
                    status ="PASS";
                    log.info("The test passed..!!!");
                 }else{
                    status ="FAIL";
                    log.info("As one of the test-case failed");
                }
            log.info("status of the charter is...: " + status);
            assert.equal(res.statusCode, 409);
            assert.notEqual(0, res.length);
            done();
        });
    })
    
    it('View Employee profile, valdation message employee not found with status 409', function(done) {
        console.log("<------------------------------TESTCASE-10------------------------------>");
        testCaseId = 1034603;
        Testurl
          .get('/groupadmin-1.0.2/api/employee/'+ EmpNum)
          .set('Content-Type','application/json')
          .set('Authorization',authtokenandtype)
          .send()
          .expect(409)
          .end(function(err, res) {
                log.info('Test10: Response code: '+res.statusCode);
                log.info('Test10: Response: \n'+JSON.stringify(res.body, null, 2));
                if(res.statusCode==409) {
                    status ="PASS";
                    log.info("The test passed..!!!");
                 }else{
                    status ="FAIL";
                    log.info("As one of the test-case failed");
                }
            log.info("status of the charter is...: " + status);
            assert.equal(res.statusCode, 409);
            assert.notEqual(0, res.length);
            done();
        });
    })

    it('To update emplyee, Validation message for hiredate should be valid status code 400', function(done) {
        console.log("<------------------------------TESTCASE-11------------------------------>");
        testCaseId = 1034602;
        Testurl
          .put('/groupadmin-1.0.2/api/employee/'+ EmpNumupdate)
          .set('Content-Type','application/json')
          .set('Authorization',authkey)
          .set('Authorization',authtokenandtype)
          .send({
                "id":"20",
                "occupation":"QA",
                "maritalStatus":"MA",
                "hireDate":"2012-05-1",
                "salary": "2299999991.67",
                "salaryFreq":"A",
                "firstName":"sneha",
                "middleName1":"",
                "lastName":"shah",
                "nameSuffix":"Jr.",
                "divisionID":"1112",
                "ssn":randomnumber,
                "dob":"2014-08-12",
                "gender":"M",
                "effectiveDate":"2014-11-19",
                "terminationDate":"2014-11-20",
                "terminationReason":"TE",
                "address": [
                { "type": "MN", "addressLine1": "1777 TimberlaneDr.", "addressLine2": "Unit5", "addressCity": "Austin", "addressState": "TX", "addressZipCode": "78740", "addressCountry": "US", "email": "jp@company.com", "phone": "+55555569.-", "phoneExtension": "", "fax": "+55555567.-", "faxExtension": "" }
                ,
                { "type": "MN", "addressLine1": "1777 TimberlaneDr.", "addressLine2": "Unit5", "addressCity": "Austin", "addressState": "TX", "addressZipCode": "78740", "addressCountry": "US", "email": "jp@company.com", "phone": "+55555569.-", "phoneExtension": "", "fax": "5555556789", "faxExtension": "" }
                ]
          })
          .expect(400)
          .end(function(err, res) {
                log.info('Test11: Response code: '+res.statusCode);
                log.info('Test11: Response: \n'+JSON.stringify(res.body, null, 2));
                if(res.statusCode==400) {
                    status ="PASS";
                    log.info("The test passed..!!!");
                 }else{
                    status ="FAIL";
                    log.info("As one of the test-case failed");
                }
            log.info("status of the charter is...: " + status);
            assert.equal(res.statusCode, 400);
            assert.notEqual(0, res.length);
            done();
        });
    })

    it('To update employee, Validation message for maritalStatus should be valid status code 400', function(done) {
        console.log("<------------------------------TESTCASE-12------------------------------>");
        testCaseId = 1034602;
        Testurl
          .put('/groupadmin-1.0.2/api/employee/'+ EmpNumupdate)
          .set('Content-Type','application/json')
          .set('Authorization',authkey)
          .set('Authorization',authtokenandtype)
          .send({
                "status":"FT",
                "occupation":"QA",
                "maritalStatus":"l",
                "hireDate":"2012-05-20",
                "salary": "2299999991.67",
                "salaryFreq":"A",
                "firstName":"sneha",
                "middleName1":"",
                "lastName":"shah",
                "nameSuffix":"Jr.",
                "divisionID":"1112",
                "ssn":randomnumber,
                "dob":"2014-08-12",
                "gender":"M",
                "effectiveDate":"2014-11-19",
                "terminationDate":"2014-11-20",
                "terminationReason":"TE",
                "address": [
                { "type": "MN", "addressLine1": "1777 TimberlaneDr.", "addressLine2": "Unit5", "addressCity": "Austin", "addressState": "TX", "addressZipCode": "78740", "addressCountry": "US", "email": "jp@company.com", "phone": "+55555569.-", "phoneExtension": "", "fax": "+55555567.-", "faxExtension": "" }
                ,
                { "type": "MN", "addressLine1": "1777 TimberlaneDr.", "addressLine2": "Unit5", "addressCity": "Austin", "addressState": "TX", "addressZipCode": "78740", "addressCountry": "US", "email": "jp@company.com", "phone": "+55555569.-", "phoneExtension": "", "fax": "5555556789", "faxExtension": "" }
                ]
          })
          .expect(400)
          .end(function(err, res) {
                log.info('Test12: Response code: '+res.statusCode);
                log.info('Test12: Response: \n'+JSON.stringify(res.body, null, 2));
                if(res.statusCode==400) {
                    status ="PASS";
                    log.info("The test passed..!!!");
                 }else{
                    status ="FAIL";
                    log.info("As one of the test-case failed");
                }
            log.info("status of the charter is...: " + status);
            assert.equal(res.statusCode, 400);
            assert.notEqual(0, res.length);
            done();
        });
    })

    it('To update employee, Validation message for salaryFreq should be valid status code 400', function(done) {
        console.log("<------------------------------TESTCASE-13------------------------------>");
        testCaseId = 1034602;
        Testurl
          .put('/groupadmin-1.0.2/api/employee/'+ EmpNumupdate)
          .set('Content-Type','application/json')
          .set('Authorization',authkey)
          .set('Authorization',authtokenandtype)
          .send({
                "status":"FT",
                "occupation":"QA",
                "maritalStatus":"MA",
                "hireDate":"2012-05-20",
                "salary": "2299999991.67",
                "salaryFreq":"l",
                "firstName":"sneha",
                "middleName1":"",
                "lastName":"shah",
                "nameSuffix":"Jr.",
                "divisionID":"1112",
                "ssn":randomnumber,
                "dob":"2014-08-12",
                "gender":"M",
                "effectiveDate":"2014-11-19",
                "terminationDate":"2014-11-20",
                "terminationReason":"TE",
                "address": [
                { "type": "MN", "addressLine1": "1777 TimberlaneDr.", "addressLine2": "Unit5", "addressCity": "Austin", "addressState": "TX", "addressZipCode": "78740", "addressCountry": "US", "email": "jp@company.com", "phone": "+55555569.-", "phoneExtension": "", "fax": "+55555567.-", "faxExtension": "" }
                ,
                { "type": "MN", "addressLine1": "1777 TimberlaneDr.", "addressLine2": "Unit5", "addressCity": "Austin", "addressState": "TX", "addressZipCode": "78740", "addressCountry": "US", "email": "jp@company.com", "phone": "+55555569.-", "phoneExtension": "", "fax": "5555556789", "faxExtension": "" }
                ]
          })
          .expect(400)
          .end(function(err, res) {
                log.info('Test13: Response code: '+res.statusCode);
                log.info('Test13: Response: \n'+JSON.stringify(res.body, null, 2));
                if(res.statusCode==400) {
                    status ="PASS";
                    log.info("The test passed..!!!");
                 }else{
                    status ="FAIL";
                    log.info("As one of the test-case failed");
                }
            log.info("status of the charter is...: " + status);
            assert.equal(res.statusCode, 400);
            assert.notEqual(0, res.length);
            done();
        });
    })
    
    it('To update employee, Validation message for divisionID should be valid status code 400', function(done) {
        console.log("<------------------------------TESTCASE-14------------------------------>");
        testCaseId = 1034602;
        Testurl
          .put('/groupadmin-1.0.2/api/employee/'+ EmpNumupdate)
          .set('Content-Type','application/json')
          .set('Authorization',authkey)
          .set('Authorization',authtokenandtype)
          .send({
                "status":"FT",
                "occupation":"QA",
                "maritalStatus":"MA",
                "hireDate":"2012-05-20",
                "salary": "2299999991.67",
                "salaryFreq":"A",
                "firstName":"sneha",
                "middleName1":"",
                "lastName":"shah",
                "nameSuffix":"Jr.",
                "divisionID":"111",
                "ssn":randomnumber,
                "dob":"2014-08-12",
                "gender":"M",
                "effectiveDate":"2014-11-19",
                "terminationDate":"2014-11-20",
                "terminationReason":"TE",
                "address": [
                { "type": "MN", "addressLine1": "1777 TimberlaneDr.", "addressLine2": "Unit5", "addressCity": "Austin", "addressState": "TX", "addressZipCode": "78740", "addressCountry": "US", "email": "jp@company.com", "phone": "+55555569.-", "phoneExtension": "", "fax": "+55555567.-", "faxExtension": "" }
                ,
                { "type": "MN", "addressLine1": "1777 TimberlaneDr.", "addressLine2": "Unit5", "addressCity": "Austin", "addressState": "TX", "addressZipCode": "78740", "addressCountry": "US", "email": "jp@company.com", "phone": "+55555569.-", "phoneExtension": "", "fax": "5555556789", "faxExtension": "" }
                ]
          })
          .expect(401)
          .end(function(err, res) {
                log.info('Test14: Response code: '+res.statusCode);
                log.info('Test14: Response: \n'+JSON.stringify(res.body, null, 2));
                if(res.statusCode==401) {
                    status ="PASS";
                    log.info("The test passed..!!!");
                 }else{
                    status ="FAIL";
                    log.info("As one of the test-case failed");
                }
            log.info("status of the charter is...: " + status);
            assert.equal(res.statusCode, 401);
            assert.notEqual(0, res.length);
            done();
        });
    })

    it('To update employee, Validation message for SSN number should be 9 digit valid status code 400', function(done) {
        console.log("<------------------------------TESTCASE-15------------------------------>");
        testCaseId = 1034602;
        Testurl
          .put('/groupadmin-1.0.2/api/employee/'+ EmpNumupdate)
          .set('Content-Type','application/json')
          .set('Authorization',authkey)
          .set('Authorization',authtokenandtype)
          .send({
                "status":"FT",
                "occupation":"QA",
                "maritalStatus":"MA",
                "hireDate":"2012-05-20",
                "salary": "2299999991.67",
                "salaryFreq":"A",
                "firstName":"sneha",
                "middleName1":"",
                "lastName":"shah",
                "nameSuffix":"Jr.",
                "divisionID":"1182",
                "ssn":"150857",
                "dob":"2014-08-12",
                "gender":"M",
                "effectiveDate":"2014-11-19",
                "terminationDate":"2014-11-20",
                "terminationReason":"TE",
                "address": [
                { "type": "MN", "addressLine1": "1777 TimberlaneDr.", "addressLine2": "Unit5", "addressCity": "Austin", "addressState": "TX", "addressZipCode": "78740", "addressCountry": "US", "email": "jp@company.com", "phone": "+55555569.-", "phoneExtension": "", "fax": "+55555567.-", "faxExtension": "" }
                ,
                { "type": "MN", "addressLine1": "1777 TimberlaneDr.", "addressLine2": "Unit5", "addressCity": "Austin", "addressState": "TX", "addressZipCode": "78740", "addressCountry": "US", "email": "jp@company.com", "phone": "+55555569.-", "phoneExtension": "", "fax": "5555556789", "faxExtension": "" }
                ]
          })
          .expect(400)
          .end(function(err, res) {
                log.info('Test15: Response code: '+res.statusCode);
                log.info('Test15: Response: \n'+JSON.stringify(res.body, null, 2));
                if(res.statusCode==400) {
                    status ="PASS";
                    log.info("The test passed..!!!");
                 }else{
                    status ="FAIL";
                    log.info("As one of the test-case failed");
                }
            log.info("status of the charter is...: " + status);
            assert.equal(res.statusCode, 400);
            assert.notEqual(0, res.length);
            done();
        });
    })

    it('To update employee, Validation message for DOB valid status code 401', function(done) {
        console.log("<------------------------------TESTCASE-16------------------------------>");
        testCaseId = 1034602;
        Testurl
          .put('/groupadmin-1.0.2/api/employee/'+ EmpNumupdate)
          .set('Content-Type','application/json')
          .set('Authorization',authkey)
          .set('Authorization',authtokenandtype)
          .send({
                "status":"FT",
                "occupation":"QA",
                "maritalStatus":"MA",
                "hireDate":"2012-05-20",
                "salary": "2299999991.67",
                "salaryFreq":"A",
                "firstName":"sneha",
                "middleName1":"",
                "lastName":"shah",
                "nameSuffix":"Jr.",
                "divisionID":"1182",
                "ssn":randomnumber,
                "dob":"2015-08-12",
                "gender":"M",
                "effectiveDate":"2014-11-19",
                "terminationDate":"2014-11-20",
                "terminationReason":"TE",
                "address": [
                { "type": "MN", "addressLine1": "1777 TimberlaneDr.", "addressLine2": "Unit5", "addressCity": "Austin", "addressState": "TX", "addressZipCode": "78740", "addressCountry": "US", "email": "jp@company.com", "phone": "+55555569.-", "phoneExtension": "", "fax": "+55555567.-", "faxExtension": "" }
                ,
                { "type": "MN", "addressLine1": "1777 TimberlaneDr.", "addressLine2": "Unit5", "addressCity": "Austin", "addressState": "TX", "addressZipCode": "78740", "addressCountry": "US", "email": "jp@company.com", "phone": "+55555569.-", "phoneExtension": "", "fax": "5555556789", "faxExtension": "" }
                ]
          })
          .expect(401)
          .end(function(err, res) {
                log.info('Test16: Response code: '+res.statusCode);
                log.info('Test16: Response: \n'+JSON.stringify(res.body, null, 2));
                if(res.statusCode==401) {
                    status ="PASS";
                    log.info("The test passed..!!!");
                 }else{
                    status ="FAIL";
                    log.info("As one of the test-case failed");
                }
            log.info("status of the charter is...: " + status);
            assert.equal(res.statusCode, 401);
            assert.notEqual(0, res.length);
            done();
        });
    })

    it('To update employee, Validation message for Gender valid status code 400', function(done) {
        console.log("<------------------------------TESTCASE-17------------------------------>");
        testCaseId = 1034602;
        Testurl
          .put('/groupadmin-1.0.2/api/employee/'+ EmpNumupdate)
          .set('Content-Type','application/json')
          .set('Authorization',authkey)
          .set('Authorization',authtokenandtype)
          .send({
                "status":"FT",
                "occupation":"QA",
                "maritalStatus":"MA",
                "hireDate":"2012-05-20",
                "salary": "2299999991.67",
                "salaryFreq":"A",
                "firstName":"sneha",
                "middleName1":"",
                "lastName":"shah",
                "nameSuffix":"Jr.",
                "divisionID":"1182",
                "ssn":randomnumber,
                "dob":"2012-08-12",
                "gender":"l",
                "effectiveDate":"2014-11-19",
                "terminationDate":"2014-11-20",
                "terminationReason":"TE",
                "address": [
                { "type": "MN", "addressLine1": "1777 TimberlaneDr.", "addressLine2": "Unit5", "addressCity": "Austin", "addressState": "TX", "addressZipCode": "78740", "addressCountry": "US", "email": "jp@company.com", "phone": "+55555569.-", "phoneExtension": "", "fax": "+55555567.-", "faxExtension": "" }
                ,
                { "type": "MN", "addressLine1": "1777 TimberlaneDr.", "addressLine2": "Unit5", "addressCity": "Austin", "addressState": "TX", "addressZipCode": "78740", "addressCountry": "US", "email": "jp@company.com", "phone": "+55555569.-", "phoneExtension": "", "fax": "5555556789", "faxExtension": "" }
                ]
          })
          .expect(400)
          .end(function(err, res) {
                log.info('Test17: Response code: '+res.statusCode);
                log.info('Test17: Response: \n'+JSON.stringify(res.body, null, 2));
                if(res.statusCode==400) {
                    status ="PASS";
                    log.info("The test passed..!!!");
                 }else{
                    status ="FAIL";
                    log.info("As one of the test-case failed");
                }
            log.info("status of the charter is...: " + status);
            assert.equal(res.statusCode, 400);
            assert.notEqual(0, res.length);
            done();
        });
    })

    it('To update employee, Validation message for effective date valid status code 400', function(done) {
        console.log("<------------------------------TESTCASE-18------------------------------>");
        testCaseId = 1034602;
        Testurl
          .put('/groupadmin-1.0.2/api/employee/'+ EmpNumupdate)
          .set('Content-Type','application/json')
          .set('Authorization',authkey)
          .set('Authorization',authtokenandtype)
          .send({
                "status":"FT",
                "occupation":"QA",
                "maritalStatus":"MA",
                "hireDate":"2012-05-20",
                "salary": "2299999991.67",
                "salaryFreq":"A",
                "firstName":"sneha",
                "middleName1":"",
                "lastName":"shah",
                "nameSuffix":"Jr.",
                "divisionID":"1182",
                "ssn":randomnumber,
                "dob":"2014-08-12",
                "gender":"M",
                "effectiveDate":"204-11-19",
                "terminationDate":"2014-11-20",
                "terminationReason":"TE",
                "address": [
                { "type": "MN", "addressLine1": "1777 TimberlaneDr.", "addressLine2": "Unit5", "addressCity": "Austin", "addressState": "TX", "addressZipCode": "78740", "addressCountry": "US", "email": "jp@company.com", "phone": "+55555569.-", "phoneExtension": "", "fax": "+55555567.-", "faxExtension": "" }
                ,
                { "type": "MN", "addressLine1": "1777 TimberlaneDr.", "addressLine2": "Unit5", "addressCity": "Austin", "addressState": "TX", "addressZipCode": "78740", "addressCountry": "US", "email": "jp@company.com", "phone": "+55555569.-", "phoneExtension": "", "fax": "5555556789", "faxExtension": "" }
                ]
          })
          .expect(400)
          .end(function(err, res) {
                log.info('Test18: Response code: '+res.statusCode);
                log.info('Test18: Response: \n'+JSON.stringify(res.body, null, 2));
                if(res.statusCode==400) {
                    status ="PASS";
                    log.info("The test passed..!!!");
                 }else{
                    status ="FAIL";
                    log.info("As one of the test-case failed");
                }
            log.info("status of the charter is...: " + status);
            assert.equal(res.statusCode, 400);
            assert.notEqual(0, res.length);
            done();
        });
    })

    it('To update employee, Validation message for termination date valid status code 400', function(done) {
        console.log("<------------------------------TESTCASE-19------------------------------>");
        testCaseId = 1034602;
        Testurl
          .put('/groupadmin-1.0.2/api/employee/'+ EmpNumupdate)
          .set('Content-Type','application/json')
          .set('Authorization',authkey)
          .set('Authorization',authtokenandtype)
          .send({
                "status":"FT",
                "occupation":"QA",
                "maritalStatus":"MA",
                "hireDate":"2012-05-20",
                "salary": "2299999991.67",
                "salaryFreq":"A",
                "firstName":"sneha",
                "middleName1":"",
                "lastName":"shah",
                "nameSuffix":"Jr.",
                "divisionID":"1182",
                "ssn":randomnumber,
                "dob":"2014-08-12",
                "gender":"M",
                "effectiveDate":"2015-11-19",
                "terminationDate":"201-11-20",
                "terminationReason":"TE",
                "address": [
                { "type": "MN", "addressLine1": "1777 TimberlaneDr.", "addressLine2": "Unit5", "addressCity": "Austin", "addressState": "TX", "addressZipCode": "78740", "addressCountry": "US", "email": "jp@company.com", "phone": "+55555569.-", "phoneExtension": "", "fax": "+55555567.-", "faxExtension": "" }
                ,
                { "type": "MN", "addressLine1": "1777 TimberlaneDr.", "addressLine2": "Unit5", "addressCity": "Austin", "addressState": "TX", "addressZipCode": "78740", "addressCountry": "US", "email": "jp@company.com", "phone": "+55555569.-", "phoneExtension": "", "fax": "5555556789", "faxExtension": "" }
                ]
          })
          .expect(400)
          .end(function(err, res) {
                log.info('Test19: Response code: '+res.statusCode);
                log.info('Test19: Response: \n'+JSON.stringify(res.body, null, 2));
                if(res.statusCode==400) {
                    status ="PASS";
                    log.info("The test passed..!!!");
                 }else{
                    status ="FAIL";
                    log.info("As one of the test-case failed");
                }
            log.info("status of the charter is...: " + status);
            assert.equal(res.statusCode, 400);
            assert.notEqual(0, res.length);
            done();
        });
    })

     afterEach(function(done){
        log.warn("the value of status is....: "+ status);
        log.info("you are able to login in qtest, pass!!!");
        var exe_end_date = new moment.utc().format();
        console.log("end date " + exe_end_date);
            connect.UploadResultToQTest2("LMPS-33,39,40,: create employee,get details,update",testCaseId,exe_start_date ,exe_end_date, (status == "PASS"), function(err){
            log.info("the stauts in the qtest function is...: " + status);
                if(err){
                    log.info("the error is...."+err);
                    done(err);
                }else{
                    log.info(" you are able to updated in qtest.");
                    console.log("<-------------------------TESTCASE execution done------------------------->");
                    done();
                }
            })
    })

})

