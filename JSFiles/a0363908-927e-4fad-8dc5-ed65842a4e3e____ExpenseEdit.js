$(function () {
        $('#div_file').hide();

        $('#ddl_ExpenseType').on('change', function () {
            var expense_type = $('#ddl_ExpenseType').val();
            if (expense_type == 1) {
                $("div.Conveyanceselfield").show();
            }
            else {
                $("div.Conveyanceselfield").hide();
                $('#ddl_TravelMode').val("0");
                $('#txt_From').val("");
                $('#txt_To').val("");
                $('#txt_KM').val("");
                $('#txt_Amount').prop('disabled', false).css("background-color", "white");
            }
        });

        $('#ddl_TravelMode').on('change', function () {
            var travel_mode = $(this).val();
            $('#txt_Km').val("");
            $('#txt_Amount').val("");
            if (travel_mode == 1 || travel_mode == 2) {
                $('#Amount').prop('disabled', true).css("background-color", "white");
            }
            if (travel_mode == 3 || travel_mode == 4 || travel_mode == 5 || travel_mode == 6 || travel_mode == 7 || travel_mode == 8 || travel_mode == 9) {
                $("div.Modefield").hide();
                $('#Amount').prop('disabled', false).css("background-color", "white");
            }
            else {
                $("div.Modefield").show();
            }
        });

        $('#btn_Update').on('click', function () {
            var expense_date = $('#txt_ExpenseDate').val();
            var expensetype_id = $('#ddl_ExpenseType option:selected').val();
            var transport_id = $('#ddl_TravelMode option:selected').val();
            var project_id = $('#ddl_Project option:selected').val();
            var from = $('#txt_From').val();
            var to = $('#txt_To').val();
            var km = $('#txt_KM').val();
            var amt = $('#txt_Amount').val();
            var detail = $('#txt_Description').val();

            if (expensetype_id != 1) {
                if (expense_date != "" && project_id != "0" && expensetype_id != "0" && amt != "" && detail != "")
                {
                    $('#btn_Update').prop('disabled', true);
                    SubmitExpenseData(expense_date, expensetype_id, transport_id, project_id, from, to, km, amt, detail);
                    $('#btn_Update').prop('disabled', false);
                }
                else if (expense_date == "") {
                    alert("Expense Date Can't be blank.");
                    setTimeout(function () { $('#txt_ExpenseDate').focus(); }, 1);
                    return false;
                }
                else if (project_id == "0") {
                    alert("Project Can't ba blank.");
                    setTimeout(function () { $('#ddl_Project').focus(); }, 1);
                    return false;
                }
                else if (expensetype_id == "0") {
                    alert("Expense Type Can't be blank.");
                    setTimeout(function () { $('#ddl_ExpenseType').focus(); }, 1);
                    return false;
                }
                else if (amt == "") {
                    alert("Expense Amount Can't be blank.");
                    setTimeout(function () { $('#txt_Amount').focus(); }, 1);
                    return false;
                }
                else if (detail == "") {
                    alert("Expense Description Can't be blank.");
                    setTimeout(function () { $('#txt_Description').focus(); }, 1);
                    return false;
                }
            }
            else {
                if (transport_id == 1 || transport_id == 2) {
                    if (transport_id == 0) {
                        alert("Please Select Travel Mode.");
                        setTimeout(function () { $('#ddl_TravelMode').focus(); }, 1);
                        return false;
                    }
                    else if (from == "") {
                        alert("From Location Can't be blank.");
                        setTimeout(function () { $('#txt_From').focus(); }, 1);
                        return false;
                    }
                    else if (to == "") {
                        alert("To Location Can't be blank.");
                        setTimeout(function () { $('#txt_To').focus(); }, 1);
                        return false;
                    }
                    else if (km == "") {
                        alert("Km Can't be blank.");
                        setTimeout(function () { $('#txt_KM').focus(); }, 1);
                        return false;
                    }
                    else if (amt == "") {
                        alert("Expense Amount Can't be blank.");
                        setTimeout(function () { $('#txt_Amount').focus(); }, 1);
                        return false;
                    }
                    else if (detail == "") {
                        alert("Expense Description Can't be blank.");
                        setTimeout(function () { $('#txt_Description').focus(); }, 1);
                        return false;
                    }
                    else if (transport_id != "0" && from != "" && to != "" && amt != "" && detail != "")
                    {
                        $('#btn_Update').prop('disabled', true);
                        SubmitExpenseData(expense_date, expensetype_id, transport_id, project_id, from, to, km, amt, detail);
                        $('#btn_Update').prop('disabled', false);
                    }
                    else if (transport_id == 0) {
                        alert("Please Select Travel Mode.");
                        setTimeout(function () { $('#ddl_TravelMode').focus(); }, 1);
                        return false;
                    }
                    else if (from == "") {
                        alert("From Location Can't be blank.");
                        setTimeout(function () { $('#txt_From').focus(); }, 1);
                        return false;
                    }
                    else if (to == "") {
                        alert("To Location Can't be blank.");
                        setTimeout(function () { $('#txt_To').focus(); }, 1);
                        return false;
                    }
                    else if (amt == "") {
                        alert("Expense Amount Can't be blank.");
                        setTimeout(function () { $('#txt_Amount').focus(); }, 1);
                        return false;
                    }
                }
                else {
                    if (transport_id == 0) {
                        alert("Please Select Travel Mode.");
                        setTimeout(function () { $('#ddl_TravelMode').focus(); }, 1);
                        return false;
                    }
                    if (from == "") {
                        alert("From Location Can't be blank.");
                        setTimeout(function () { $('#txt_From').focus(); }, 1);
                        return false;
                    }
                    else if (to == "") {
                        alert("To Location Can't be blank.");
                        setTimeout(function () { $('#txt_To').focus(); }, 1);
                        return false;
                    }
                    else if (amt == "") {
                        alert("Expense Amount Can't be blank.");
                        setTimeout(function () { $('#txt_Amount').focus(); }, 1);
                        return false;
                    }
                    else if (detail == "") {
                        alert("Expense Description Can't be blank.");
                        setTimeout(function () { $('#txt_Description').focus(); }, 1);
                        return false;
                    }
                    else if (transport_id != "0" && from != "" && to != "" && amt != "" && detail != "")
                    {
                        $('#btn_Update').prop('disabled', true);
                        SubmitExpenseData(expense_date, expensetype_id, transport_id, project_id, from, to, km, amt, detail);
                        $('#btn_Update').prop('disabled', false);
                    }
                }
            }
        });

        $('#btn_edit_close').on('click', function () {
           
            var con = confirm("Your changes are not saved. If you cancel without saving, then your changes will be lost. Do you want to continue?");
            if (con == true) {
                ClearTextData();
                //$('#table11 tbody').empty();
                $('#edit_expense').modal('hide');
            }
        });

        $('#UploadBtn').click(function ()
        {
            var TotalNo_Files = 3;
            var data = new FormData();
            var files = $("#Files").get(0).files;
            if (files.length > 0)
            {
                if (files.length <= 3)
                {
                    var filenamelist = [];

                    for (var i = 0; i < files.length; i++) {
                        filenamelist.push(files[i].name);
                        data.append(files[i].name, files[i]);
                        var isize = (files[i].size / 1024);
                        isize = (Math.round((isize / 1024) * 100) / 100);
                        if (isize > 2) {
                            alert("File must be less than 2MB");
                            return false;
                        }
                    }

                    for (var i = 0; i < filenamelist.length; i++) {
                        var extension = filenamelist[i].split('.').pop().toUpperCase();
                        if (extension != "DOC" && extension != "DOCX" && extension != "XLS" && extension != "XLSX" && extension != "PPT" && extension != "PPTX" && extension != "PPS" && extension != "PPSX" && extension != "PDF" && extension != "TXT" && extension != "PNG" && extension != "JPG" && extension != "BMP" && extension != "RTF" && extension != "JPEG" && extension != "ZIP") {
                            alert("Invalid file format." + "(." + extension.toLowerCase() + ")");
                            $("#Files").val('');
                            return false;
                        }

                    }

                    var tbody = $("#ListofFiles tbody");
                    var table_length = tbody.children().length;
                   
                    if (table_length > 0)
                    {
                        var remaing_files = parseInt(parseInt(TotalNo_Files) - parseInt(table_length));
                        if (remaing_files === files.length) {
                            $.ajax({
                                url: '/expense/UploadExpense_Files',
                                type: "POST",
                                processData: false,
                                data: data,
                                dataType: 'json',
                                contentType: false,
                                async: false,
                                success: function (result) {
                                    var len = Object.keys(result).length;
                                    if (result != "") {
                                        for (var i = 0; i < len; i++) {
                                            $('#FileBrowse').find("*").prop("disabled", true);
                                            LoadProgressBar(result[i]); //calling LoadProgressBar function to load the progress bar.
                                        }
                                        $('#ListofFiles').show();
                                        $('#div_file').show();
                                    }
                                },
                                error: function (err)
                                {
                                    alert(err.responseText);
                                }
                            });
                        }
                        else {
                            alert("You Can Add Only No Of 3 Fiels at One Expense.\n" + table_length + " Files Already on Table,You can only " + remaing_files + " Files.");
                            setTimeout(function () { $('#Files').focus(); }, 1);
                            $("#Files").val('');
                            return false;
                        }
                    }
                    else
                    {
                        $.ajax({
                            url: '/expense/UploadExpense_Files',
                            type: "POST",
                            processData: false,
                            data: data,
                            dataType: 'json',
                            contentType: false,
                            async: false,
                            success: function (result) {
                                var len = Object.keys(result).length;
                                if (result != "") {
                                    for (var i = 0; i < len; i++) {
                                        $('#FileBrowse').find("*").prop("disabled", true);
                                        LoadProgressBar(result[i]); //calling LoadProgressBar function to load the progress bar.
                                    }
                                    $('#ListofFiles').show();
                                    $('#div_file').show();
                                }
                            },
                            error: function (err) {
                                alert(err.responseText);
                            }
                        });
                    }
                    $('#btn_Update').prop("disabled", true);                   
                }
                else
                {
                    alert("No Of Files 3 can be Uploaded at a Time.");
                    setTimeout(function () { $('#Files').focus(); }, 1);
                    $("#Files").val('');
                    return false;
                }
            }
            else
            {
                alert("Please Check files to upload.");
                setTimeout(function () { $('#Files').focus(); }, 1);
                $("#Files").val('');
                return false;
            }
        });

        $(document).on('click', '#btn_delete', function (e) {
            var FileName = $(this).attr('data_file');
            var Expense_Id = $(this).attr('data_id');
            var tr = $(this).closest('tr');
            var res = '';
            if (FileName != "" && Expense_Id!="") {
                $.ajax({
                    url: '/Expense/DeleteExpenseFile',
                    type: "POST",
                    contentType: 'application/json;charset=utf-8',
                    data: JSON.stringify({ 'Filename': FileName, 'Expense_ID': Expense_Id }),
                    dataType: 'json',
                    success: function (response) {
                       
                        if (response != null || response != '' || response != undefined) {
                            var msg = response.split(',');
                            res = msg[1];
                            tr.fadeOut(1000, function () {
                                $(this).remove();
                            });
                            alert(res + " Successfully Deleted.");
                        }
                        else
                        {
                            alert(response);
                        }
                    },
                    error: function (response) {
                        alert(response.statusText);
                    }
                });
            }
            else {
                alert('Error While Deleting.');
            }
        });
});

function onlyAlphabets(e, t) {
    try {
        if (window.event) {
            var charCode = window.event.keyCode;
        }
        else if (e) {
            var charCode = e.which;
        }
        else { return true; }
        if ((charCode > 64 && charCode < 91) || (charCode > 96 && charCode < 123))
            return true;
        else
            return false;
    }
    catch (err) {
        alert(err.Description);
    }
}

function DateFormatter(currentdate) {
    var d = new Date(currentdate);
    var day = d.getDate();
    var month = d.getMonth() + 1;
    var year = d.getFullYear();
    if (day < 10) {
        day = "0" + day;
    }
    if (month < 10) {
        month = "0" + month;
    }
    var date = year + "-" + month + "-" + day;
    return date;
}

function SubmitExpenseData(expense_date, expense_type_id, transport_id, project_id, from, to, km, amt, detail) {
    var tbody = $("#ListofFiles tbody");
    var table_length = tbody.children().length;
    if (table_length > 0) {
        var table_data = GetTableData();
    }
    else {
        var files = $("#Files").get(0).files;
        if (files.length > 0) {
            alert("First Upload File.");
            setTimeout(function () { $('#UploadBtn').focus(); }, 1);
            return false;
        }
    }

    var EXPENSE_MODEL = {};
    EXPENSE_MODEL.EXPENSE_ID = $('#hdn_ExpenseID').val();
    EXPENSE_MODEL.EXPENSE_DATE = expense_date;
    EXPENSE_MODEL.EXPENSE_TYPE_ID = expense_type_id;
    EXPENSE_MODEL.TRAVEL_MODE = transport_id;
    EXPENSE_MODEL.PROJECT_ID = project_id;
    EXPENSE_MODEL.TRAVEL_FROM = from;
    EXPENSE_MODEL.TRAVEL_TO = to;
    EXPENSE_MODEL.TRAVEL_DISTANCE = km;
    EXPENSE_MODEL.EXPENSE_AMOUNT = amt;
    EXPENSE_MODEL.DESCRIPTION = detail;

    var ExpenseModel = {
        'CreateExpense': EXPENSE_MODEL,
        'Files': table_data
    };

    if (expense_type_id != 1) {
        if (expense_date != "" && project_id != "o" && expense_type_id != "0" && amt != "" && detail != "") {
            $.ajax({
                url: '/Expense/SubmitExpense',
                type: 'POST',
                contentType: 'application/json; charset=utf-8',
                data: JSON.stringify({ ExpenseModel }),
                dataType: 'json',
                success: function (data) {
                    var a = data.SuccessMsg;
                    var b = data.ErrorMsg;
                    if (data != null && a != null) {
                        alert(a);
                        ClearTextData();
                        $('#edit_expense').modal('hide');
                        ExpenseReport($('#ddl_month option:selected').val(), $('#ddl_year option:selected').val());
                    }
                    else
                    {
                        alert(b);
                    }
                },
                error: function (data) {
                    alert(data.responseText);
                }
            });
        }
        else if (expense_date == "") {
            alert("Expense Date Can't blank.");
            setTimeout(function () { $('#txt_ExpenseDate').focus(); }, 1);
            return false;
        }
        else if (project_id == "0") {
            alert("Project Can't be blank.");
            setTimeout(function () { $('#ddl_Project').focus(); }, 1);
            return false;
        }
        else if (expense_type_id == "0") {
            alert("Expense Type Can't be blank.");
            setTimeout(function () { $('#ddl_ExpenseType').focus(); }, 1);
            return false;
        }
        else if (amt == "") {
            alert("Expense Amount Can't be blank.");
            setTimeout(function () { $('#txt_Amount').focus(); }, 1);
            return false;
        }
        else if (detail == "") {
            alert("Expense Description Can't be blank.");
            setTimeout(function () { $('#txt_Description').focus(); }, 1);
            return false;
        }
    }
    else
    {
        if (transport_id != 4 && transport_id != 7) {
            if (transport_id == 0) {
                alert("Travel Mode Can't be blank.");
                setTimeout(function () { $('#ddl_TravelMode').focus(); }, 1);
                return false;
            }
            else if (from == "") {
                alert("From Location Can't be blank.");
                setTimeout(function () { $('#txt_From').focus(); }, 1);
                return false;
            }
            else if (to == "") {
                alert("To Location Can't be blank.");
                setTimeout(function () { $('#txt_To').focus(); }, 1);
                return false;
            }
            else if (km == "") {
                alert("Km Can't be blank.");
                setTimeout(function () { $('#txt_Km').focus(); }, 1);
                return false;
            }
            else if (detail == "") {
                alert("Expense Description Can't be blank.");
                setTimeout(function () { $('#txt_Description').focus(); }, 1);
                return false;
            }
            else if (transport_id != "0" && from != "" && to != "" && amt != "" && detail != "") {
                $.ajax({
                    url: '/Expense/SubmitExpense',
                    type: 'POST',
                    contentType: 'application/json; charset=utf-8',
                    data: JSON.stringify({ ExpenseModel }),
                    dataType: 'json',
                    success: function (data) {
                        var a = data.SuccessMsg;
                        var b = data.ErrorMsg;
                        if (data != null && a != null) {
                            alert(a);
                            ClearTextData();
                            $('#edit_expense').modal('hide');
                            ExpenseReport($('#ddl_month option:selected').val(), $('#ddl_year option:selected').val());
                        }
                        else
                        {
                            alert(b);
                        }
                    },
                    error: function (data) {
                        alert(data.responseText);
                    }
                });
            }
            else if (transport_id == "0") {
                alert("Travel Mode Can't be blank.");
                setTimeout(function () { $('#ddl_TravelMode').focus(); }, 1);
                return false;
            }
            else if (from == "") {
                alert("From Location Can't be blank.");
                setTimeout(function () { $('#txt_From').focus(); }, 1);
                return false;
            }
            else if (to == "") {
                alert("To Location Can't be blank.");
                setTimeout(function () { $('#txt_To').focus(); }, 1);
                return false;
            }
            else if (amt == "") {
                alert("Expense Amount Can't be blank.");
                setTimeout(function () { $('#txt_Amount').focus(); }, 1);
                return false;
            }
        }
        else {
            if (from == "") {
                alert("From Location Can't be blank.");
                setTimeout(function () { $('#txt_From').focus(); }, 1);
                return false;
            }
            else if (to == "") {
                alert("To Location Can't be blank.");
                setTimeout(function () { $('#txt_To').focus(); }, 1);
                return false;
            }
            else if (amt == "") {
                alert("Expense Amount Can't be blank.");
                setTimeout(function () { $('#txt_Amount').focus(); }, 1);
                return false;
            }
            else if (detail == "") {
                alert("Expense Description Can't be blank.");
                setTimeout(function () { $('#txt_Description').focus(); }, 1);
                return false;
            }
        }
    }
}

function GetTableData() {
    var expense_files = new Array();

    $('#ListofFiles tbody tr').each(function () {
        var expense_file = {};
        expense_file.file_name = $(this).eq(0).find('td').html();
        expense_files.push(expense_file);
    });

    console.log(expense_files);
    return expense_files;
}

function ClearTextData() {
    $('#txt_ExpenseDate').val("");
    $('#ddl_Project').val("0");
    $('#ddl_ExpenseType').val("0");
    $('#ddl_TravelMode').val("0");
    $('#txt_From').val("");
    $('#txt_To').val("");
    $('#txt_Km').val("");
    $('#txt_Amount').val("");
    $('#txt_Description').val("");
    $('#Files').val("");
    $('#ListofFiles tbody').empty();
    $('#ListofFiles').hide();
    $("div.Conveyanceselfield").hide();
    $("div.Modefield").hide();
}

function CalculateAmount()
{
   
    var travel_mode = $('#ddl_TravelMode').val();
    var EmpType = $('#Role').val();
    var km = $('#txt_KM').val();
    var amt = 0;
    if (travel_mode == 1) {
        amt = (km * 3).toFixed(2);
        $('#txt_Amount').val(amt);
    }
    else if (travel_mode == 2) {
        if (EmpType == 3) {
            amt = (km * 4).toFixed(2);
        }
        else {
            amt = (km * 7).toFixed(2);
        }
        $('#txt_Amount').val(amt);
    }
}

function reloadPage() {
    location.reload(true);
}

function DeleteImage() {
    var data = new FormData();
    var files = $("#Files").get(0).files;
    for (var i = 0; i < files.length; i++) {
        data.append(files[i].name, files[i]);
    }
    if (files.length > 0) {
        $('#UploadBtn').prop('disabled', true);
        $.ajax({
            url: '/Expense/DeleteExpenseFiles',
            type: "POST",
            processData: false,
            data: data,
            dataType: 'json',
            contentType: false,
            success: function (response) {
            },
            error: function (er) {
            }
        });
    }
}

var specialKeys = new Array();

specialKeys.push(8); //Backspace

function numericOnly(elementRef) {

    var keyCodeEntered = (event.which) ? event.which : (window.event.keyCode) ? window.event.keyCode : -1;

    if ((keyCodeEntered >= 48) && (keyCodeEntered <= 57)) {

        return true;
    }
    else if (keyCodeEntered === 46) {

        if ((elementRef.value) && (elementRef.value.indexOf('.') >= 0))
            return false;
        else
            return true;
    }
    return false;
}

function numericTwoDecimal(elementRef, len, precision) {


    var txtvalue = elementRef.value;
    var keyCodeEntered = (event.which) ? event.which : (window.event.keyCode) ? window.event.keyCode : -1;

    if ((keyCodeEntered >= 48) && (keyCodeEntered <= 57)) {

        return true;
    }
    else if (keyCodeEntered == 46) {

        if ((elementRef.value) && (elementRef.value.indexOf('.') >= 0))
            return false;
        else
            return true;
    }
    return false;
}


function LoadProgressBar(result) {
    var markup = "<tr><td>" + result + "</td><td><a href='javascript:void(0);' data_file='" + result + "' id='btn_delete'><span class='glyphicon glyphicon-remove red'></span></a></td></tr>"; // Binding the file name
    $("#ListofFiles tbody").append(markup);
    $('.glyphicon-remove').prop('disabled', true);
    var progressbar = $("#progressbar-5");
    var progressLabel = $(".progress-label");
    progressbar.show();
    $("#progressbar-5").progressbar({
        //value: false,
        change: function () {
            progressLabel.text(
                progressbar.progressbar("value") + "%");  // Showing the progress increment value in progress bar
        },
        complete: function () {
            progressLabel.text("Loading Completed!");
            progressbar.progressbar("value", 0);  //Reinitialize the progress bar value 0
            progressLabel.text("");
            progressbar.hide(); //Hiding the progress bar
            $('#Files').val('');
            $('#FileBrowse').find("*").prop("disabled", false);
            $('#btn_Update').prop("disabled", false);
            $('.glyphicon-remove').prop('disabled', false);
        }
    });
    function progress() {
        var val = progressbar.progressbar("value") || 0;
        progressbar.progressbar("value", val + 1);
        if (val < 99) {
            setTimeout(progress, 25);
        }
    }
    setTimeout(progress, 100);
}

function ExpenseReport(Month, Year) {
    $.ajax({
        type: "POST",
        url: "/Expense/GetExpense_History",
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify({ 'Month': Month, 'Year': Year }),
        dataType: 'json',
        success: function (data) {
            var result = JSON.parse(data.history);
            var result1 = JSON.parse(data.remarks);
            if (result.length > 0) {
                $("#tblExpenseReport").dataTable().fnDestroy();
                $('#tblHistoryBody').empty();
                var html = "";
                var st, user_submission, mg_approval, hr_approval;
                $.each(result, function (txt, val) {
                    st = val.EXPENSE_STATUS;
                    user_submission = val.USER_SUBMISSION;
                    mg_approval = val.MNG_APPROVAL;
                    hr_approval = val.HR_APPROVAL;

                    html += "<tr id='info'>";
                    html += "<td data_id='" + val.ID + "'> " + val.SR_NO + "</td > ";
                    html += "<td>" + val.EXPENSE_DATE + "</td>";
                    html += "<td>" + val.PROJECT_NAME + "</td>";
                    html += "<td>" + val.EXPENSE_TYPE_NAME + "</td>";
                    html += "<td style='text-align:right' id='tot'>" + val.EXPENSE_AMOUNT + "</td>";
                    html += "<td style='width:135px;'>" + val.DESCRIPTION + "</td>";
                    if (val.FileName == 'attachment') {
                        html += "<td><a class='upload_file' title='Attachement' href='javascript:void(0);' data_id='" + val.ID + "'><i class='fa fa-paperclip m-r-5' style='font-size: 15px;'></i></a></td>";
                    }
                    else {
                        html += "<td></td>";
                    }
                    html += "<td>";
                    if (st == 'Open' || st == "Rejected" || st == "Rejected Hr") {
                        html += "<a href='javascript:void(0);' class='lnkActionEdit' title='Edit' data_id='" + val.ID + "' > <i class='fa fa-pencil m-r-5'></i ></a>  ";
                        html += "<a href='javascript:void(0);' class='lnkActionView' title='View' data_id='" + val.ID + "' ><i class='fa fa-eye m-r-5'></i></a>"
                        html += "<a href='javascript:void(0);' class='lnkActionDel' title='Delete' data_id='" + val.ID + "'><i class='fa fa-trash m-r-5'></i></a>";
                    }
                    else {
                        html += "<a href='javascript:void(0);' class='lnkActionView' title='View' data_id='" + val.ID + "'><i class='fa fa-eye m-r-5'></i></a>"
                    }
                    html += "</td>";
                    html += "</tr>";
                });
                $('#tblHistoryBody').append(html);
                $("#tblExpenseReport").DataTable(
                    {
                        "columnDefs": [
                            { "targets": [7], "orderable": false }
                        ],
                        "language": {
                            "search": "",
                            "searchPlaceholder": "Search"
                        }
                    });
                if (st != "Open" && st != undefined && st != "Rejected" && st != "Rejected Hr") {
                    $('.btn_Submit').hide();
                }
                else if (st == "Rejected" || st == "Rejected Hr" || st == "Open") {
                    $('.btn_Submit').show();
                }

                $('#tblExpenseReport').each(function () {
                    var amt_sum = 0;
                    $(this).find('tr#info td#tot').each(function () {
                        var combat = $(this).text();
                        if (!isNaN(combat) && combat.length !== 0) {
                            amt_sum = parseFloat(amt_sum) + parseFloat(combat);
                        }
                    });
                    $('.grdtotal').text(amt_sum.toFixed(2)).digits();
                });

                if (result1) {
                    $('#tblRemarkBody').empty();
                    var html = "";
                    $.each(result1, function (txt, val) {
                        html += "<tr>";
                        html += "<td style='color:#ff0000'>" + st + "</td > ";
                        html += "<td style='color:#ff0000'>" + user_submission + "</td>";
                        html += "<td style='color:#ff0000'>" + mg_approval + "</td>";
                        html += "<td style='color:#ff0000'>" + hr_approval + "</td>";
                        html += "<td style='color:#ff0000'>" + val.Approve_Remark_Manager + "</td > ";
                        html += "<td style='color:#ff0000'>" + val.Approve_Remark_Hr + "</td>";
                        html += "<td style='color:#ff0000'>" + val.Reject_Remark_Manager + "</td>";
                        html += "<td style='color:#ff0000'>" + val.Reject_Remark_Hr + "</td>";
                        html += "</tr>";
                    });
                    $('#tblRemarkBody').append(html);
                }
                $('.table-responsive').show();
                //$('#tbl_status').show();
                //$('#btn_Submit').show();
                $('#btn_Export').show();
            }
            else {
                $('.table-responsive').hide();
                //$('#tbl_status').hide();
                $('.btn_Submit').hide();
                $('#btn_Export').hide();
                alert("No Data Found.");
            }
            //$('#ddl_month').val(Month);
            //$('#ddl_year').val(Year);
        },
        error: function (data) {
            alert(data.responseText);
        }
    });
}
