'use strict';
//Import Node Modules.
//----------------------
//const { getFileExtension } = require("./functions-generic.js"); //Node JS import method supported by jest.
//const FunctionsGeneric = require("./functions-generic.js"); //Node JS import method supported by jest.
const gSystemConfig = require("../config-application.js"); //System configuration.
const SyncSystemNS = require("./syncsystem-ns.js"); //Node JS import method supported by jest.
//----------------------


//appLabelsGet unit test.
//**************************************************************************************
//With data.
test("SyncSystemNS.FunctionsGeneric.appLabelsGet: " + 
    SyncSystemNS.FunctionsGeneric.appLabelsGet(gSystemConfig.configLanguageBackend.appLabels, "testOutputString1") + " (Development)", ()=>{
    //Test with data full.
    //----------------------
    //Build the test.
    //let testData = FunctionsGeneric.fileExtensionGet(".xyz");
    let testData = SyncSystemNS.FunctionsGeneric.appLabelsGet(gSystemConfig.configLanguageBackend.appLabels, "layoutDevelopment");

    //Expected result.
    expect(testData).toBe("Development");
    //----------------------
}); //2 arguments - description, call to function to test.
//}, 10000); //With set timeout changed.

//Without data.
test("SyncSystemNS.FunctionsGeneric.appLabelsGet: " + 
    SyncSystemNS.FunctionsGeneric.appLabelsGet(gSystemConfig.configLanguageBackend.appLabels, "testOutputEmpty1"), ()=>{
    //Test with data empty.
    //----------------------
    //Build the test.
    //let testDataEmpty = FunctionsGeneric.fileExtensionGet("");
    let testDataEmpty = SyncSystemNS.FunctionsGeneric.appLabelsGet("", "");

    //Expected result.
    expect(testDataEmpty).toBe("");
    //----------------------


    //Test with data null.
    //----------------------
    //Build the test.
    //let testDataNull = FunctionsGeneric.fileExtensionGet(null);
    let testDataNull = SyncSystemNS.FunctionsGeneric.appLabelsGet(null, null);

    //Expected result.
    expect(testDataNull).toBe("");
    //----------------------


    //Test with data undefinied.
    //----------------------
    //Build the test.
    //let testDataUndefined = FunctionsGeneric.fileExtensionGet();
    let testDataUndefined = SyncSystemNS.FunctionsGeneric.appLabelsGet(undefined , undefined);

    //Expected result.
    expect(testDataUndefined).toBe("");
    //----------------------
});
//**************************************************************************************


//timeZoneConverter unit test.
//**************************************************************************************
//With data.
test("SyncSystemNS.FunctionsGeneric.timeZoneConverter: " + 
    SyncSystemNS.FunctionsGeneric.appLabelsGet(gSystemConfig.configLanguageBackend.appLabels, "testOutputDate1") + " (now).", ()=>{
    //Test with data full.
    //----------------------
    //Build the test.
    let testData = SyncSystemNS.FunctionsGeneric.timeZoneConverter("Atlantic/South_Georgia", "2");
    //let testDateDate = new Date(testData);    

    //Expected result.
    //expect(testData).toContain(Date);
    //expect(testDateDate).toContain(Date);
    //expect(testDateDate).toMatchObject(Date);
    //expect(testDateDate).toBeInstanceOf(Date);
    expect(testData).toBeInstanceOf(Date);
    //----------------------
}); //2 arguments - description, call to function to test.
//}, 10000); //With set timeout changed.


//Without data.
test("SyncSystemNS.FunctionsGeneric.timeZoneConverter: " + 
    SyncSystemNS.FunctionsGeneric.appLabelsGet(gSystemConfig.configLanguageBackend.appLabels, "testOutputDate1") + " (now).", ()=>{
    //Test with data empty.
    //----------------------
    //Build the test.
    let testDataEmpty = SyncSystemNS.FunctionsGeneric.timeZoneConverter("", "");

    //Expected result.
    expect(testDataEmpty).toBeInstanceOf(Date);
    //----------------------


    //Test without parameters.
    //----------------------
    //Build the test.
    let testDataWithoutParemeters = SyncSystemNS.FunctionsGeneric.timeZoneConverter();

    //Expected result.
    expect(testDataWithoutParemeters).toBeInstanceOf(Date);
    //----------------------
});
//**************************************************************************************


//dateSQLWrite unit test.
//**************************************************************************************
//With data.
test("SyncSystemNS.FunctionsGeneric.dateSQLWrite: " + 
    SyncSystemNS.FunctionsGeneric.appLabelsGet(gSystemConfig.configLanguageBackend.appLabels, "testOutputString1") + " (2012-1-30 10:33:30).", ()=>{
    //Test with data full.
    //----------------------
    //Build the test.
    let testData = SyncSystemNS.FunctionsGeneric.dateSQLWrite(new Date(2012, 0, 30, 10, 33, 30, 0), ""); //note: january is 0 

    //Expected result.
    //expect(testData).toBeNaN().toHaveLength(21);
    //expect(testData).toBeNaN();
    expect(testData).toBe("2012-1-30 10:33:30");
    //----------------------
}); //2 arguments - description, call to function to test.
//}, 10000); //With set timeout changed.

//Without data.
test("SyncSystemNS.FunctionsGeneric.dateSQLWrite: " + 
    SyncSystemNS.FunctionsGeneric.appLabelsGet(gSystemConfig.configLanguageBackend.appLabels, "testOutputEmpty1"), ()=>{
    //Test with data empty.
    //----------------------
    //Build the test.
    let testDataEmpty = SyncSystemNS.FunctionsGeneric.dateSQLWrite("", "");

    //Expected result.
    expect(testDataEmpty).toBe("");
    //----------------------


    //Test with data null.
    //----------------------
    //Build the test.
    let testDataNull = SyncSystemNS.FunctionsGeneric.dateSQLWrite(null, null);

    //Expected result.
    expect(testDataNull).toBe("");
    //----------------------


    //Test with data undefinied.
    //----------------------
    //Build the test.
    let testDataUndefined = SyncSystemNS.FunctionsGeneric.dateSQLWrite(undefined , undefined);

    //Expected result.
    expect(testDataUndefined).toBe("");
    //----------------------
});
//**************************************************************************************


//dateMount unit test.
//**************************************************************************************
test("SyncSystemNS.FunctionsGeneric.dateMount(objDateInput, configDateFormat, dateFormatReturn): " + 
SyncSystemNS.FunctionsGeneric.appLabelsGet(gSystemConfig.configLanguageBackend.appLabels, "testOutputString1") + " (pt: 14/01/2016 / 14/01/2016 06:10:00 | uk: 01/14/2016 / 01/14/2016 06:10:00).", ()=>{
    //With data.
    //Test with data (dateField + pt date format).
    //----------------------
    //Build the test.
    let testData_dateField_pt = SyncSystemNS.FunctionsGeneric.dateMount({
                                                                            dateField: "14/01/2016",
                                                                            dateFieldDay: "",
                                                                            dateFieldMonth: "",
                                                                            dateFieldYear: "",
                                                                            dateFieldHour: "",
                                                                            dateFieldMinute: "",
                                                                            dateFieldSeconds: ""
                                                                        },  
                                                                        1, 
                                                                        "");

    //Expected result.
    //expect(testData).toBeNaN().toHaveLength(21);
    //expect(testData).toBeNaN();
    expect(testData_dateField_pt).toBe("14/01/2016");
    //----------------------


    //Test with data (dateFieldDay + dateFieldMonth + dateFieldYear + pt date format).
    //----------------------
    //Build the test.
    let testData_dateFieldDay_dateFieldMonth_dateFieldYear_pt = SyncSystemNS.FunctionsGeneric.dateMount({
                                                                                                            dateField: "",
                                                                                                            dateFieldDay: "14",
                                                                                                            dateFieldMonth: "01",
                                                                                                            dateFieldYear: "2016",
                                                                                                            dateFieldHour: "",
                                                                                                            dateFieldMinute: "",
                                                                                                            dateFieldSeconds: ""
                                                                                                        },  
                                                                                                        1, 
                                                                                                        "");

    //Expected result.
    //expect(testData).toBeNaN().toHaveLength(21);
    //expect(testData).toBeNaN();
    expect(testData_dateFieldDay_dateFieldMonth_dateFieldYear_pt).toBe("14/01/2016");
    //----------------------


    //Test with data (semi-full date + pt date format).
    //----------------------
    //Build the test.
    let testData_semifull_pt = SyncSystemNS.FunctionsGeneric.dateMount({
                                                                        dateField: "",
                                                                        dateFieldDay: "14",
                                                                        dateFieldMonth: "01",
                                                                        dateFieldYear: "2016",
                                                                        dateFieldHour: "06",
                                                                        dateFieldMinute: "10",
                                                                        dateFieldSeconds: ""
                                                                    },  
                                                                    1, 
                                                                    "");

    //Expected result.
    //expect(testData).toBeNaN().toHaveLength(21);
    //expect(testData).toBeNaN();
    expect(testData_semifull_pt).toBe("14/01/2016 06:10:00");
    //----------------------


    //Test with data (full date + pt date format).
    //----------------------
    //Build the test.
    let testData_full_pt = SyncSystemNS.FunctionsGeneric.dateMount({
                                                                        dateField: "",
                                                                        dateFieldDay: "14",
                                                                        dateFieldMonth: "01",
                                                                        dateFieldYear: "2016",
                                                                        dateFieldHour: "06",
                                                                        dateFieldMinute: "10",
                                                                        dateFieldSeconds: "00"
                                                                    },  
                                                                    1, 
                                                                    "");

    //Expected result.
    //expect(testData).toBeNaN().toHaveLength(21);
    //expect(testData).toBeNaN();
    expect(testData_full_pt).toBe("14/01/2016 06:10:00");
    //----------------------


    //Test with data (dateField + uk date format).
    //----------------------
    //Build the test.
    let testData_dateField_uk = SyncSystemNS.FunctionsGeneric.dateMount({
                                                                            dateField: "01/14/2016",
                                                                            dateFieldDay: "",
                                                                            dateFieldMonth: "",
                                                                            dateFieldYear: "",
                                                                            dateFieldHour: "",
                                                                            dateFieldMinute: "",
                                                                            dateFieldSeconds: ""
                                                                        },  
                                                                        2, 
                                                                        "");

    //Expected result.
    //expect(testData).toBeNaN().toHaveLength(21);
    //expect(testData).toBeNaN();
    expect(testData_dateField_uk).toBe("01/14/2016");
    //----------------------


    //Test with data (dateFieldDay + dateFieldMonth + dateFieldYear + uk date format).
    //----------------------
    //Build the test.
    let testData_dateFieldDay_dateFieldMonth_dateFieldYear_uk = SyncSystemNS.FunctionsGeneric.dateMount({
                                                                                                            dateField: "",
                                                                                                            dateFieldDay: "14",
                                                                                                            dateFieldMonth: "01",
                                                                                                            dateFieldYear: "2016",
                                                                                                            dateFieldHour: "",
                                                                                                            dateFieldMinute: "",
                                                                                                            dateFieldSeconds: ""
                                                                                                        },  
                                                                                                        2, 
                                                                                                        "");

    //Expected result.
    //expect(testData).toBeNaN().toHaveLength(21);
    //expect(testData).toBeNaN();
    expect(testData_dateFieldDay_dateFieldMonth_dateFieldYear_uk).toBe("01/14/2016");
    //----------------------


    //Test with data (semi-full date + uk date format).
    //----------------------
    //Build the test.
    let testData_semifull_uk = SyncSystemNS.FunctionsGeneric.dateMount({
                                                                        dateField: "",
                                                                        dateFieldDay: "14",
                                                                        dateFieldMonth: "01",
                                                                        dateFieldYear: "2016",
                                                                        dateFieldHour: "06",
                                                                        dateFieldMinute: "10",
                                                                        dateFieldSeconds: ""
                                                                    },  
                                                                    2, 
                                                                    "");

    //Expected result.
    //expect(testData).toBeNaN().toHaveLength(21);
    //expect(testData).toBeNaN();
    expect(testData_semifull_uk).toBe("01/14/2016 06:10:00");
    //----------------------
    

    //Test with data (full date + uk date format).
    //----------------------
    //Build the test.
    let testData_full_uk = SyncSystemNS.FunctionsGeneric.dateMount({
                                                                        dateField: "",
                                                                        dateFieldDay: "14",
                                                                        dateFieldMonth: "01",
                                                                        dateFieldYear: "2016",
                                                                        dateFieldHour: "06",
                                                                        dateFieldMinute: "10",
                                                                        dateFieldSeconds: "00"
                                                                    },  
                                                                    2, 
                                                                    "");

    //Expected result.
    //expect(testData).toBeNaN().toHaveLength(21);
    //expect(testData).toBeNaN();
    expect(testData_full_uk).toBe("01/14/2016 06:10:00");
    //----------------------
});

//Without data.
test("SyncSystemNS.FunctionsGeneric.dateMount: " + 
    SyncSystemNS.FunctionsGeneric.appLabelsGet(gSystemConfig.configLanguageBackend.appLabels, "testOutputEmpty1"), ()=>{
    //Test with data empty.
    //----------------------
    //Build the test.
    let testDataEmpty = SyncSystemNS.FunctionsGeneric.dateMount({
                                                                    dateField: "",
                                                                    dateFieldDay: "",
                                                                    dateFieldMonth: "",
                                                                    dateFieldYear: "",
                                                                    dateFieldHour: "",
                                                                    dateFieldMinute: "",
                                                                    dateFieldSeconds: ""
                                                                },  
                                                                gSystemConfig.configBackendDateFormat, 
                                                                "");

    //Expected result.
    expect(testDataEmpty).toBe("");
    //----------------------


    //Test with data null.
    //----------------------
    //Build the test.
    let testDataNull = SyncSystemNS.FunctionsGeneric.dateMount({
                                                                    dateField: null,
                                                                    dateFieldDay: null,
                                                                    dateFieldMonth: null,
                                                                    dateFieldYear: null,
                                                                    dateFieldHour: null,
                                                                    dateFieldMinute: null,
                                                                    dateFieldSeconds: null
                                                                },  
                                                                gSystemConfig.configBackendDateFormat, 
                                                                "");

    //Expected result.
    expect(testDataNull).toBe("");
    //----------------------


    //Test with data undefinied.
    //----------------------
    //Build the test.
    let testDataUndefined = SyncSystemNS.FunctionsGeneric.dateMount({
                                                                        dateField: undefined,
                                                                        dateFieldDay: undefined,
                                                                        dateFieldMonth: undefined,
                                                                        dateFieldYear: undefined,
                                                                        dateFieldHour: undefined,
                                                                        dateFieldMinute: undefined,
                                                                        dateFieldSeconds: undefined
                                                                    },  
                                                                    gSystemConfig.configBackendDateFormat, 
                                                                    "");

    //Expected result.
    expect(testDataUndefined).toBe("");
    //----------------------
});
//**************************************************************************************


//timeTableFill01 unit test.
//**************************************************************************************
//With data.
test("SyncSystemNS.FunctionsGeneric.timeTableFill01('timeTableType', fillType): " + 
    "Should output array with matching values and array length.", ()=>{
    //Test with data - day.
    //----------------------
    //Build the test.
    //let testData = FunctionsGeneric.fileExtensionGet(".xyz");
    let testDataExpected_day = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31];
    let testData_day = SyncSystemNS.FunctionsGeneric.timeTableFill01("d", 1);

    //Expected result.
    //expect(testData_day).toBe(".xyz");
    //expect(testData_day).toEqual(expect.arrayContaining([1, 2, 3])); //working
    expect(testData_day).toEqual(expect.arrayContaining(testDataExpected_day));
    expect(testData_day).toHaveLength(31);
    //----------------------


    //Test with data - month.
    //----------------------
    //Build the test.
    //let testData = FunctionsGeneric.fileExtensionGet(".xyz");
    let testDataExpected_month = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    let testData_month = SyncSystemNS.FunctionsGeneric.timeTableFill01("mm", 1);

    //Expected result.
    //expect(testData_day).toBe(".xyz");
    //expect(testData_day).toEqual(expect.arrayContaining([1, 2, 3])); //working
    expect(testData_month).toEqual(expect.arrayContaining(testDataExpected_month));
    expect(testData_month).toHaveLength(12);
    //----------------------


    //Test with data - hour.
    //----------------------
    //Build the test.
    //let testData = FunctionsGeneric.fileExtensionGet(".xyz");
    let testDataExpected_hour = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
    let testData_hour = SyncSystemNS.FunctionsGeneric.timeTableFill01("h", 1);

    //Expected result.
    //expect(testData_day).toBe(".xyz");
    //expect(testData_day).toEqual(expect.arrayContaining([1, 2, 3])); //working
    expect(testData_hour).toEqual(expect.arrayContaining(testDataExpected_hour));
    expect(testData_hour).toHaveLength(24);
    //----------------------


    //Test with data - minute.
    //----------------------
    //Build the test.
    //let testData = FunctionsGeneric.fileExtensionGet(".xyz");
    let testDataExpected_minute = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59];
    let testData_minute = SyncSystemNS.FunctionsGeneric.timeTableFill01("m", 1);

    //Expected result.
    //expect(testData_day).toBe(".xyz");
    //expect(testData_day).toEqual(expect.arrayContaining([1, 2, 3])); //working
    expect(testData_minute).toEqual(expect.arrayContaining(testDataExpected_minute));
    expect(testData_minute).toHaveLength(60);
    //----------------------


    //Test with data - second.
    //----------------------
    //Build the test.
    //let testData = FunctionsGeneric.fileExtensionGet(".xyz");
    let testDataExpected_second = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59];
    let testData_second = SyncSystemNS.FunctionsGeneric.timeTableFill01("s", 1);

    //Expected result.
    //expect(testData_day).toBe(".xyz");
    //expect(testData_day).toEqual(expect.arrayContaining([1, 2, 3])); //working
    expect(testData_second).toEqual(expect.arrayContaining(testDataExpected_second));
    expect(testData_second).toHaveLength(60);
    //----------------------
}); //2 arguments - description, call to function to test.
//}, 10000); //With set timeout changed.
//**************************************************************************************


//getFileExtension unit test.
//**************************************************************************************
//With data.
test("SyncSystemNS.FunctionsGeneric.fileExtensionGet('data'): " + 
    "Should output file extension. (ex: .xyz).", ()=>{
    //Test with data full.
    //----------------------
    //Build the test.
    //let testData = FunctionsGeneric.fileExtensionGet(".xyz");
    let testData = SyncSystemNS.FunctionsGeneric.fileExtensionGet(".xyz");

    //Expected result.
    expect(testData).toBe(".xyz");
    //----------------------
}); //2 arguments - description, call to function to test.
//}, 10000); //With set timeout changed.

//Without data.
test("SyncSystemNS.FunctionsGeneric.fileExtensionGet(): " + 
    SyncSystemNS.FunctionsGeneric.appLabelsGet(gSystemConfig.configLanguageBackend.appLabels, "testOutputEmpty1"), ()=>{
    //Test with data empty.
    //----------------------
    //Build the test.
    //let testDataEmpty = FunctionsGeneric.fileExtensionGet("");
    let testDataEmpty = SyncSystemNS.FunctionsGeneric.fileExtensionGet("");

    //Expected result.
    expect(testDataEmpty).toBe("");
    //----------------------


    //Test with data null.
    //----------------------
    //Build the test.
    //let testDataNull = FunctionsGeneric.fileExtensionGet(null);
    let testDataNull = SyncSystemNS.FunctionsGeneric.fileExtensionGet(null);

    //Expected result.
    expect(testDataNull).toBe("");
    //----------------------


    //Test with data undefinied.
    //----------------------
    //Build the test.
    //let testDataUndefined = FunctionsGeneric.fileExtensionGet();
    //let testDataUndefined = SyncSystemNS.FunctionsGeneric.fileExtensionGet(); //working
    let testDataUndefined = SyncSystemNS.FunctionsGeneric.fileExtensionGet(undefined);
    

    //Expected result.
    expect(testDataUndefined).toBe("");
    //----------------------
});
//**************************************************************************************


//contentMaskWrite unit test.
//**************************************************************************************
//With data.
test("SyncSystemNS.FunctionsGeneric.contentMaskWrite: " + 
    SyncSystemNS.FunctionsGeneric.appLabelsGet(gSystemConfig.configLanguageBackend.appLabels, "testOutputString1") + " (content test).", ()=>{
    //Test with data full.
    //----------------------
    //Build the test.
    let testData = SyncSystemNS.FunctionsGeneric.contentMaskWrite("content test", "");

    //Expected result.
    expect(testData).toBe("content test");
    //----------------------


    //Test with data full.
    //----------------------
    //Build the test.
    let testData_db_write_text = SyncSystemNS.FunctionsGeneric.contentMaskWrite("content test", "db_write_text");

    //Expected result.
    expect(testData_db_write_text).toBe("content test");
    //----------------------
}); //2 arguments - description, call to function to test.
//}, 10000); //With set timeout changed.

//Without data.
test("SyncSystemNS.FunctionsGeneric.contentMaskWrite: " + 
    SyncSystemNS.FunctionsGeneric.appLabelsGet(gSystemConfig.configLanguageBackend.appLabels, "testOutputEmpty1"), ()=>{
    //Test with data empty.
    //----------------------
    //Build the test.
    let testDataEmpty = SyncSystemNS.FunctionsGeneric.contentMaskWrite("", "");

    //Expected result.
    expect(testDataEmpty).toBe("");
    //----------------------


    //Test with data null.
    //----------------------
    //Build the test.
    let testDataNull = SyncSystemNS.FunctionsGeneric.contentMaskWrite(null, null);

    //Expected result.
    expect(testDataNull).toBe("");
    //----------------------


    //Test with data undefinied.
    //----------------------
    //Build the test.
    let testDataUndefined = SyncSystemNS.FunctionsGeneric.contentMaskWrite(undefined , undefined);

    //Expected result.
    expect(testDataUndefined).toBe("");
    //----------------------
});
//**************************************************************************************


//contentMaskWrite unit test.
//**************************************************************************************
//With data.
test("SyncSystemNS.FunctionsGeneric.contentMaskWrite('data','db_write_text'): " + 
    SyncSystemNS.FunctionsGeneric.appLabelsGet(gSystemConfig.configLanguageBackend.appLabels, "testOutputString1") + " (return test - data).", ()=>{
    //Test with data full.
    //----------------------
    //Build the test.
    //let testData = FunctionsGeneric.fileExtensionGet(".xyz");
    let testData_db_write_text = SyncSystemNS.FunctionsGeneric.contentMaskWrite("return test - data", "db_write_text");

    //Expected result.
    expect(testData_db_write_text).toBe("return test - data");
    //----------------------
});
//}, 10000); //With set timeout changed.
//**************************************************************************************

//Without data.
test("SyncSystemNS.FunctionsGeneric.contentMaskWrite('','db_write_text'): " + 
    SyncSystemNS.FunctionsGeneric.appLabelsGet(gSystemConfig.configLanguageBackend.appLabels, "testOutputEmpty1"), ()=>{
    //Test with data empty.
    //----------------------
    //Build the test.
    //let testDataEmpty = FunctionsGeneric.fileExtensionGet("");
    let testDataEmpty_db_write_text = SyncSystemNS.FunctionsGeneric.contentMaskWrite("", "db_write_text");

    //Expected result.
    expect(testDataEmpty_db_write_text).toBe("");
    //----------------------


    //Test with data null.
    //----------------------
    //Build the test.
    //let testDataNull = FunctionsGeneric.fileExtensionGet(null);
    let testDataNull_db_write_text = SyncSystemNS.FunctionsGeneric.contentMaskWrite(null, "db_write_text");

    //Expected result.
    expect(testDataNull_db_write_text).toBe("");
    //----------------------


    //Test with data undefinied.
    //----------------------
    //Build the test.
    //let testDataUndefined = FunctionsGeneric.fileExtensionGet();
    //let testDataUndefined = SyncSystemNS.FunctionsGeneric.fileExtensionGet(); //working
    let testDataUndefined_db_write_text = SyncSystemNS.FunctionsGeneric.contentMaskWrite(undefined, "db_write_text");
    

    //Expected result.
    expect(testDataUndefined_db_write_text).toBe("", "db_write_text");
    //----------------------
});
//**************************************************************************************


//valueMaskWrite unit test.
//**************************************************************************************
//With data.
test("SyncSystemNS.FunctionsGeneric.valueMaskWrite: " + 
    SyncSystemNS.FunctionsGeneric.appLabelsGet(gSystemConfig.configLanguageBackend.appLabels, "testOutputNumber1"), ()=>{
    //Test with data full.
    //----------------------
    //Build the test.
    let testData = SyncSystemNS.FunctionsGeneric.valueMaskWrite(123, 2);

    //Expected result.
    //expect(testData).not.toBeNaN().toEqual(123);
    expect(testData).toEqual(123);
    //----------------------
}); //2 arguments - description, call to function to test.
//}, 10000); //With set timeout changed.
//**************************************************************************************

//contentMaskRead unit test.
//**************************************************************************************
//With data.
test('SyncSystemNS.FunctionsGeneric.contentMaskRead: ' + 
    SyncSystemNS.FunctionsGeneric.appLabelsGet(gSystemConfig.configLanguageBackend.appLabels, 'testOutputString1') + ' (content<br />test).', ()=>{
    //Test with data full.
    //----------------------
    //Build the test.
    let testData_db = SyncSystemNS.FunctionsGeneric.contentMaskRead('content\ntest', 'db');

    //Expected result.
    expect(testData_db).toBe('content<br />test');
    //----------------------


    //Test with data full.
    //----------------------
    //Build the test.
    let testData_config_application = SyncSystemNS.FunctionsGeneric.contentMaskRead('content test', 'config-application');

    //Expected result.
    expect(testData_config_application).toBe('content test');
    //----------------------
}); //2 arguments - description, call to function to test.
//}, 10000); //With set timeout changed.

//Without data.
test('SyncSystemNS.FunctionsGeneric.contentMaskRead: ' + 
    SyncSystemNS.FunctionsGeneric.appLabelsGet(gSystemConfig.configLanguageBackend.appLabels, 'testOutputEmpty1'), ()=>{
    //Test with data empty.
    //----------------------
    //Build the test.
    let testDataEmpty_db = SyncSystemNS.FunctionsGeneric.contentMaskRead('', 'db');

    //Expected result.
    expect(testDataEmpty_db).toBe('');
    //----------------------


    //Test with data null.
    //----------------------
    //Build the test.
    let testDataNull = SyncSystemNS.FunctionsGeneric.contentMaskRead(null, null);

    //Expected result.
    expect(testDataNull).toBe('');
    //----------------------


    //Test with data undefinied.
    //----------------------
    //Build the test.
    let testDataUndefined = SyncSystemNS.FunctionsGeneric.contentMaskRead(undefined , undefined);

    //Expected result.
    expect(testDataUndefined).toBe('');
    //----------------------
});
//**************************************************************************************
