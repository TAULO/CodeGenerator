Date.prototype.getMonthName = function () {
    var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                  "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
    return monthNames[this.getMonth()];
}

function addComment() {
    var UserName = $('#UserName').val();
    var month_Name = new Date().getMonthName();
    var date = new Date()
    var month_Name = date.getMonthName();
    var day = date.getDate();
    var year = date.getUTCFullYear().toString().substring(0, 4);
    var htmlContent = '';
    var ope = $('table#commentTableUIRI002_edit tbody tr:last').index() + 1;
    htmlContent += '<tr class="new comentContainer">';
    htmlContent += '<td>';
    htmlContent += '<div class="padding10 leftAlign">';
    htmlContent += '<div class="verticalMargin10 w100 relative h50px" style="height:0%;">';
    htmlContent += '<input type="button" value="Delete" class="deleteTextButton verticalAlignTop absolute absRight DeletePMIRequest">';
    htmlContent += '</div>';
    htmlContent += '<div class="verticalMargin10 w100">';
    htmlContent += '<div class="verticalMargin10 inline-block" style="margin-right: 1%;">' + day + " " + month_Name + " " + year + '</div>';
    htmlContent += '<div class="verticalMargin10 inline-block bold marginLeft3">' + UserName + ' </div>';
    htmlContent += '</div>';
    htmlContent += '<div class="verticalMargin10 w100 textAreaContainer">';
    htmlContent += '<div class="padding10">';

    htmlContent += '<input data-val="true" data-val-user-required="The UserCommentId field is required." id="UserComments__' + ope + '__UserCommentId" name="UserComments[' + ope + '].UserCommentId" type="hidden" value="-1">';
    htmlContent += '<input id="UserComments_' + ope + '__Text" name="UserComments[' + ope + '].Text" type="hidden" data-val="true" data-val-user-required="Please, complete the mandatory fields" value="">';
    htmlContent += '<textarea maxlength="1000" class="txtDescriptionComent" cols="300" data-val="true;" data-val-required="Please, complete the mandatory fields" id="UserComments_' + ope + '__Text" name="UserComments[' + ope + '].Text" rows="5"></textarea>';

    htmlContent += '</div>';
    htmlContent += '</div>';
    htmlContent += '</div>';
    htmlContent += '</td>';
    htmlContent += '</tr>';
    $('#commentTableUIRI002_edit').append(htmlContent);
    var ddd = htmlContent;

    var lastCommentTextArea = $('#commentTableUIRI002_edit').find("textarea").last();
    lastCommentTextArea.on("focusout", function () {
        if (lastCommentTextArea.val() !== "") {
            $("#Accept_").val("1");
            $("#Reject_").val("1");
            $("#EditMessage_").val("1");
        }

        var divParent = $(this).parent();
        var inputImpactIndicator = $(divParent).find('[id$="__Text"]');
        $(inputImpactIndicator).attr("value", $(this).val());
    });

    try {
        $("#Accept_").val("0");
        $("#Reject_").val("0");
        $("#EditMessage_").val("0");
    } catch (Exception) { }
    
};

$(document).on("ready",function () {
    
    //Remove tr ui_ri_003_edit comment table Clause 
    $(document).on('mousedown', '.deleteTextButton', function ()
    {
        var parent = $(this).closest('table');
        $(this).closest('tr').remove();

        var tabla = $(parent).attr('id');

        if ($(this).hasClass("controlDelete"))
        {
            var item = $(this).attr("data-itemDeleted");

            var newHtml = "<input type='hidden' name='itemDeletedList' value=" + item + " />";
            $("#ConvergencePartialForm").append(newHtml);
        }

        if ($(this).hasClass("DeleteSupervisionRequest"))
        {   
            ReindexarUserComments(tabla);
        }
        else if ($(this).hasClass("DeletePMIRequest"))
        {
            
            ReindexarUserComments(tabla);
        }
        else if ($(this).hasClass("deleteTextButtonCon"))
        {

            ReordenarComentariosContractos(tabla);
        }
        else if ($(this).hasClass("deleteTextButtonRevFund"))
        {   
            ReindexarComentarioRevolvingFund(tabla);
        }
        else if ($(this).hasClass("DeleteClauseExte"))
        {
            ReordenarComentariosExtension(tabla);
        }
        else if ($(this).hasClass("DeleteClauseIndiv"))
        {
            ReordenarComentariosFinalStatus(tabla);
        }
        else
        {
            ReordenarComentarios(tabla);
        }

        

        
    });

    //Reordenamiento cuando elimina comentarios Clause
    function ReordenarComentarios(Commenttable) {
        var ope = $('table#' + Commenttable + ' tbody tr:last').index();
        var Comments = $('table#' + Commenttable + ' tbody');
        var rowCount = 0;

        $(Comments).find('tr').each(function (index, tr) {
            var CommentsId = $(this).find('[name$="].UserCommentId"]');
            var Modifiedby = $(this).find('[name$="].ModifiedBy"]');
            var Modified = $(this).find('[name$="].Modified"]');
            var Text = $(this).find('[name$="].Text"]');
            var Created = $(this).find('[name$="].CreatedBy"]');
            var CreatedBy = $(this).find('[name$="].Created"]');

            if ($(CommentsId).val() != null) {
                $(CommentsId).attr("id",  rowCount + "__UserCommentId");
                $(CommentsId).attr("name", "[" + rowCount + "].UserCommentId");
            }

            if ($(Modifiedby).val() != null) {
                $(Modifiedby).attr("id", rowCount + "__ModifiedBy");
                $(Modifiedby).attr("name", "[" + rowCount + "].ModifiedBy");
            }

            if ($(Modified).val() != null) {
                $(Modified).attr("id", rowCount + "__Modified");
                $(Modified).attr("name", "[" + rowCount + "].Modified");
            }

            if ($(Text).val() != null) {
                $(Text).attr("id", rowCount + "__Text");
                $(Text).attr("name", "[" + rowCount + "].Text");
            }

            if ($(CreatedBy).val() != null) {
                $(CreatedBy).attr("id", rowCount + "__CreatedBy");
                $(CreatedBy).attr("name", "[" + rowCount + "].CreatedBy");
            }

            if ($(Created).val() != null)
            {
                $(Created).attr("id", rowCount + "__Created");
                $(Created).attr("name", "[" + rowCount + "].Created");
            }

            rowCount++;
        });
    }

    $(".txtDescriptionComent").focusout(function () {
        var divParent = $(this).parent();
        var inputImpactIndicator = $(divParent).find('[id$="__Text"]');
        $(inputImpactIndicator).attr("value", $(this).val());
    });

    $('#newCommentRisks002').click(function () {
        var UserName = $('#UserName').val();
        var month_Name = new Date().getMonthName();
        var date = new Date()
        var month_Name = date.getMonthName();
        var day = date.getDate();
        var year = date.getUTCFullYear().toString().substring(0, 4);
        var htmlContent = '';
        var ope = $('table#commentTableUIRI002_edit tbody tr:last').index() + 1;
        htmlContent += '<tr class="new">';
        htmlContent += '<td>';
        htmlContent += '<div class="padding10 leftAlign">';
        htmlContent += '<div class="verticalMargin10 w100 relative h50px" style="height:0%;">';
        htmlContent += '<input type="button" value="Delete" class="deleteTextButton verticalAlignTop absolute absRight">';
        htmlContent += '</div>';
        htmlContent += '<div class="verticalMargin10 w100">';
        htmlContent += '<div class="verticalMargin10 inline-block" style="margin-right: 1%;">' + day + " " + month_Name + " " + year + '</div>';
        htmlContent += '<div class="verticalMargin10 inline-block bold marginLeft3">' + UserName + ' </div>';
        htmlContent += '</div>';
        htmlContent += '<div class="verticalMargin10 w100 textAreaContainer">';
        htmlContent += '<div class="padding10">';

        htmlContent += '<input data-val="true" data-val-user-required="The UserCommentId field is required." id="UserComments__' + ope + '__UserCommentId" name="UserComments[' + ope + '].UserCommentId" type="hidden" value="-1">';
        htmlContent += '<input id="UserComments_' + ope + '__Text" name="UserComments[' + ope + '].Text" type="hidden" data-val="true" data-val-user-required="Please, complete the mandatory fields" value="">';
        htmlContent += '<textarea maxlength="1000" class="txtDescriptionComent" cols="300" data-val="true;" data-val-required="Please, complete the mandatory fields" id="UserComments_' + ope + '__Text" name="UserComments[' + ope + '].Text" rows="5"></textarea>';

        htmlContent += '</div>';
        htmlContent += '</div>';
        htmlContent += '</div>';
        htmlContent += '</td>';
        htmlContent += '</tr>';
        $('#commentTableUIRI002_edit').append(htmlContent);
        var ddd = htmlContent;

        $('#commentTableUIRI002_edit').find("textarea").last().focusout(function () {
            var divParent = $(this).parent();
            var inputImpactIndicator = $(divParent).find('[id$="__Text"]');
            $(inputImpactIndicator).attr("value", $(this).val());
        });

        try {
            $("#Accept_").val("1");
            $("#Reject_").val("1");
            $("#EditMessage_").val("1");
        } catch (Exception) { }
        
    });

    $("#newCommentSupervision").on("click", function () {

        var UserName = $('#UserName').val();
        var ActualRows = $("#commentTableUIRI002_edit tbody tr").length -1;

        if (UserName == null) {
            UserName = "";
        }

        ActualRows = ActualRows + 1;


        var month_Name = new Date().getMonthName();
        var date = new Date()
        var month_Name = date.getMonthName();
        var day = date.getDate();
        var year = date.getUTCFullYear().toString().substring(0, 4);
        var newHtml = "";

        newHtml += "<tr>"
        newHtml += "<td>"
        newHtml += "<div class='padding10 leftAlign'>"
        newHtml += '<div class="verticalMargin10 w100 relative h50px" style="height: 0%;">';
        newHtml += '<input type="button" value="Delete" class="deleteTextButton verticalAlignTop absolute absRight">'
        newHtml += '</div>'
        newHtml += "<div class='verticalMargin10 w100'>"

        newHtml += "<div class='verticalMargin10 inline-block'>" + day + " " + month_Name + " " + year + "</div>"
        newHtml += "<div class='verticalMargin10 inline-block bold marginLeft3'>" + UserName + "</div>"

        
        newHtml += "</div>"

        newHtml += "<div class='verticalMargin10 w100'>"
        newHtml += "<div class='padding10'>"

        newHtml += "<div class='verticalMargin10 inline-block bold marginLeft3'>"
        newHtml += "<textarea class='txtDescriptionComent' data-val='True' data-val-required='Please, complete the mandatory fields' name='[" + ActualRows + "].Text' rows='5' cols='300' maxlength='1000' ></textarea>"
        newHtml += "</div>"

        newHtml += "</div>"
        newHtml += "</div>"

        newHtml += "</div>"

        newHtml += "</td>"
        newHtml += "</tr>"

        $("#commentTableUIRI002_edit tbody").append(newHtml);

        try {
            $("#Accept_").val("1");
            $("#Reject_").val("1");
            $("#EditMessage_").val("1");
        } catch (Exception) { }
    });

    $('#newCommentSupervisionPlanRequestEdit').click(function () {
        var UserName = $('#UserName').val();
        var month_Name = new Date().getMonthName();
        var date = new Date()
        var month_Name = date.getMonthName();
        var day = date.getDate();
        var year = date.getUTCFullYear().toString().substring(0, 4);
        var htmlContent = '';
        var ope = $('table#commentTableUIRI002_edit tbody tr:last').index() + 1;
        htmlContent += '<tr class="new comentContainer">';
        htmlContent += '<td>';
        htmlContent += '<div class="padding10 leftAlign">';
        htmlContent += '<div class="verticalMargin10 w100 relative h50px" style="height:0%;">';
        htmlContent += '<input type="button" value="Delete" class="deleteTextButton verticalAlignTop absolute absRight DeleteSupervisionRequest">';
        htmlContent += '</div>';
        htmlContent += '<div class="verticalMargin10 w100">';
        htmlContent += '<div class="verticalMargin10 inline-block" style="margin-right: 1%;">' + day + " " + month_Name + " " + year + '</div>';
        htmlContent += '<div class="verticalMargin10 inline-block bold marginLeft3">' + UserName + ' </div>';
        htmlContent += '</div>';
        htmlContent += '<div class="verticalMargin10 w100 textAreaContainer">';
        htmlContent += '<div class="padding10">';

        htmlContent += '<input data-val="true" data-val-user-required="The UserCommentId field is required." id="UserComments__' + ope + '__UserCommentId" name="UserComments[' + ope + '].UserCommentId" type="hidden" value="-1">';
        htmlContent += '<input id="UserComments_' + ope + '__Text" name="UserComments[' + ope + '].Text" type="hidden" data-val="true" data-val-user-required="Please, complete the mandatory fields" value="">';
        htmlContent += '<textarea maxlength="1000"  class="txtDescriptionComent" cols="300" data-val="true;" data-val-required="Please, complete the mandatory fields" id="UserComments_' + ope + '__Text" name="UserComments[' + ope + '].Text" rows="5"></textarea>';

        htmlContent += '</div>';
        htmlContent += '</div>';
        htmlContent += '</div>';
        htmlContent += '</td>';
        htmlContent += '</tr>';
        $('#commentTableUIRI002_edit').append(htmlContent);
        var ddd = htmlContent;

        $('#commentTableUIRI002_edit').find("textarea").last().focusout(function () {
            var divParent = $(this).parent();
            var inputImpactIndicator = $(divParent).find('[id$="__Text"]');
            $(inputImpactIndicator).attr("value", $(this).val());
        });

        try {
            $("#Accept_").val("1");
            $("#Reject_").val("1");
            $("#EditMessage_").val("1");
        } catch (Exception) { }
        
    });

    $('#newCommentPMIRequestEdit').click(addComment);

    $('#newCommentContract002').click(function () {

        var month_Name = new Date().getMonthName();
        var date = new Date()
        var month_Name = date.getMonthName();
        var day = date.getDate();
        var year = date.getUTCFullYear().toString().substring(0, 4);
        var CurrentUser = $("#UserName").attr("value");


        var htmlContent = '';
        var ope = $('table#commentTableUIRI002_edit tbody tr:last').index() + 1;
        htmlContent += '<tr class="new">';
        htmlContent += '<td>';
        htmlContent += '<div class="padding10 leftAlign">';
        htmlContent += '<div class="verticalMargin10 w100 relative h50px" style="height:0%;">';
        htmlContent += '<input type="button" value="Delete" class="deleteTextButton verticalAlignTop absolute absRight deleteTextButtonCon">';
        htmlContent += '</div>';
        htmlContent += '<div class="verticalMargin10 w100">';
        htmlContent += '<div class="verticalMargin10 inline-block" style="margin-right: 1%;">' + day + " " + month_Name + " " + year + '</div>';
        htmlContent += '<div class="verticalMargin10 inline-block bold marginLeft3">' + CurrentUser + ' </div>';
        htmlContent += '</div>';
        htmlContent += '<div class="verticalMargin10 w100 textAreaContainer">';
        htmlContent += '<input data-val="true" data-val-user-required="The UserCommentId field is required." id="Contracts_0__UserComments__' + ope + '__UserCommentId" name="Contracts[0].UserComments[' + ope + '].UserCommentId" type="hidden" value="-1">';
        htmlContent += '<input id="Contracts_0__UserComments_' + ope + '__Text" name="Contracts[0].UserComments[' + ope + '].Text" type="hidden" data-val="true" data-val-user-required="Please, complete the mandatory fields" value="">';
        htmlContent += '<textarea maxlength="1000" class="txtDescriptionComent" id="Contracts_0__UserComments_' + ope + '__Text" name="Contracts[0].UserComments[' + ope + '].Text" rows="5" cols="300" data-val="true" data-val-required="The Text field is required."></textarea>';

        htmlContent += '</div>';
        htmlContent += '</div>';
        htmlContent += '</td>';
        htmlContent += '</tr>';
        $('#commentTableUIRI002_edit').append(htmlContent);
        var ddd = htmlContent;

        $('#commentTableUIRI002_edit').find("textarea").last().focusout(function () {
            var divParent = $(this).parent();
            var inputImpactIndicator = $(divParent).find('[id$="__Text"]');
            $(inputImpactIndicator).attr("value", $(this).val());
        });

        try {
            $("#Accept_").val("1");
            $("#Reject_").val("1");
            $("#EditMessage_").val("1");
        } catch (Exception) { }
    });

    $('#newCommentContractAprprovalRevFund002').click(function () {

        var month_Name = new Date().getMonthName();
        var date = new Date()
        var month_Name = date.getMonthName();
        var day = date.getDate();
        var year = date.getUTCFullYear().toString().substring(0, 4);
        var CurrentUser = $("#UserName").attr("value");
        var htmlContent = '';

        var ope = $('table#commentTableUIRI002_edit tbody tr:last').index() + 1;
        htmlContent += '<tr class="new">';
        htmlContent += '<td>';
        htmlContent += '<div class="padding10 leftAlign">';
        htmlContent += '<div class="verticalMargin10 w100 relative h50px" style="height:0%;">';
        htmlContent += '<input type="button" value="Delete" class="deleteTextButton verticalAlignTop absolute absRight deleteTextButtonRevFund">';
        htmlContent += '</div>';
        htmlContent += '<div class="verticalMargin10 w100">';
        htmlContent += '<div class="verticalMargin10 inline-block" style="margin-right: 1%;">' + day + " " + month_Name + " " + year + '</div>';
        htmlContent += '<div class="verticalMargin10 inline-block bold marginLeft3">' + CurrentUser + '</div>';
        htmlContent += '</div>';
        htmlContent += '<div class="verticalMargin10 w100 textAreaContainer">';
        htmlContent += '<input data-val="true" data-val-user-required="The UserCommentId field is required." id="Contracts_0__RevolvingFund_0__UserComments__' + ope + '__UserCommentId" name="Contracts[0].RevolvingFund[0].UserComments[' + ope + '].UserCommentId" type="hidden" value="-1">';
        htmlContent += '<input id="Contracts_0__RevolvingFund_0__UserComments_' + ope + '__Text" name="Contracts[0].RevolvingFund[0].UserComments[' + ope + '].Text" type="hidden" data-val="true" data-val-user-required="Please, complete the mandatory fields" value="">';
        htmlContent += '<textarea maxlength="1000" class="txtDescriptionComent" id="Contracts_0__RevolvingFund_0__UserComments_' + ope + '__Text" name="Contracts[0].RevolvingFund[0].UserComments[' + ope + '].Text" data-val="true" data-val-required="The Text field is required." cols="300" rows="5"></textarea>';

        htmlContent += '</div>';
        htmlContent += '</div>';
        htmlContent += '</td>';
        htmlContent += '</tr>';
        $('#commentTableUIRI002_edit').append(htmlContent);
        var ddd = htmlContent;

        $('#commentTableUIRI002_edit').find("textarea").last().focusout(function () {
            var divParent = $(this).parent();
            var inputImpactIndicator = $(divParent).find('[id$="__Text"]');
            $(inputImpactIndicator).attr("value", $(this).val());
        });

        try {
            $("#Accept_").val("1");
            $("#Reject_").val("1");
            $("#EditMessage_").val("1");
        } catch (Exception) { }
    });

    $('#newCommentClauseExtensionApproval002').click(function () {

        var month_Name = new Date().getMonthName();
        var date = new Date()
        var month_Name = date.getMonthName();
        var day = date.getDate();
        var year = date.getUTCFullYear().toString().substring(2, 4);
        var htmlContent = '';
        var CurrentUser = $("#UserName").attr("value");

        var ope = $('table#commentTableUIRI002_edit tbody tr:last').index() + 1;
        htmlContent += '<tr class="new">';
        htmlContent += '<td>';
        htmlContent += '<div class="padding10 leftAlign">';
        htmlContent += '<div class="verticalMargin10 w100 relative h50px" style="height:0%;">';
        htmlContent += '<input type="button" value="Delete" class="deleteTextButton verticalAlignTop absolute absRight DeleteClauseExte">';
        htmlContent += '</div>';
        htmlContent += '<div class="verticalMargin10 w100">';
        htmlContent += '<div class="verticalMargin10 inline-block" style="margin-right: 1%;">' + day + " " + month_Name + " " + year + '</div>';
        htmlContent += '<div class="verticalMargin10 inline-block bold marginLeft3">' + CurrentUser + ' </div>';
        htmlContent += '</div>';
        htmlContent += '<div class="verticalMargin10 w100 textAreaContainer">';
        htmlContent += '<input data-val="true" data-val-user-required="The UserCommentId field is required." id="Contracts_0__Clauses_0__ClauseIndividuals_0__ClauseExtension_0__UserComments__' + ope + '__UserCommentId" name="Contracts[0].Clauses[0].ClauseIndividuals[0].ClauseExtension[0].UserComments[' + ope + '].UserCommentId" type="hidden" value="-1">';
        htmlContent += '<input id="Contracts_0__Clauses_0__ClauseIndividuals_0__ClauseExtension_0__UserComments_' + ope + '__Text" name="Contracts[0].Clauses[0].ClauseIndividuals[0].ClauseExtension[0].UserComments[' + ope + '].Text" type="hidden" data-val="true" data-val-user-required="Please, complete the mandatory fields" value="">';
        htmlContent += '<textarea  maxlength="1000" class="txtDescriptionComent" id="Contracts_0__Clauses_0__ClauseIndividuals_0__ClauseExtension_0__UserComments_' + ope + '__Text" name="Contracts[0].Clauses[0].ClauseIndividuals[0].ClauseExtension[0].UserComments[' + ope + '].Text" data-val="true" data-val-required="The Text field is required." cols="300", rows="5"></textarea>';

        htmlContent += '</div>';
        htmlContent += '</div>';
        htmlContent += '</td>';
        htmlContent += '</tr>';
        $('#commentTableUIRI002_edit').append(htmlContent);
        var ddd = htmlContent;

        $("#Contracts_0__Clauses_0__ClauseIndividuals_0__ClauseExtension_0__UserComments_" + ope + "__Text").focus();

        $('#commentTableUIRI002_edit').find("textarea").last().focusout(function () {
            var divParent = $(this).parent();
            var inputImpactIndicator = $(divParent).find('[id$="__Text"]');
            $(inputImpactIndicator).attr("value", $(this).val());
        });

        try {
            $("#Accept_").val("1");
            $("#Reject_").val("1");
            $("#EditMessage_").val("1");
        } catch (Exception) { }
    });

    $('#newCommentClauseFinalStatus').on("click", function ()
    {
        var UserName = $('#UserName').val();
        var month_Name = new Date().getMonthName();
        var date = new Date()
        var month_Name = date.getMonthName();
        var day = date.getDate();
        var year = date.getUTCFullYear().toString().substring(2, 4);
        var htmlContent = '';
        var ope = $('table#commentTableUIRI002_edit tbody tr:last').index() + 1;
        htmlContent += '<tr class="new">';
        htmlContent += '<td>';
        htmlContent += '<div class="padding10 leftAlign">';
        htmlContent += '<div class="verticalMargin10 w100 relative h50px" style="height:0%;">';
        htmlContent += '<input type="button" value="Delete" class="deleteTextButton verticalAlignTop absolute absRight DeleteClauseIndiv">';
        htmlContent += '</div>';
        htmlContent += '<div class="verticalMargin10 w100">';
        htmlContent += '<div class="verticalMargin10 inline-block" style="margin-right: 1%;">' + day + " " + month_Name + " " + year + '</div>';
        htmlContent += '<div class="verticalMargin10 inline-block bold marginLeft3">' + UserName + '</div>';
        htmlContent += '</div>';
        htmlContent += '<div class="verticalMargin10 w100 textAreaContainer">';
        htmlContent += '<div class="padding10">';

        htmlContent += '<input data-val="true" data-val-user-required="The UserCommentId field is required." id="Contracts_0__Clauses_0__ClauseIndividuals_0__UserComments__' + ope + '__UserCommentId" name="Contracts[0].Clauses[0].ClauseIndividuals[0].UserComments[' + ope + '].UserCommentId" type="hidden" value="-1">';
        htmlContent += '<input id="Contracts_0__Clauses_0__ClauseIndividuals_0__UserComments_' + ope + '__Text" name="Contracts[0].Clauses[0].ClauseIndividuals[0].UserComments[' + ope + '].Text" type="hidden" data-val="true" data-val-user-required="Please, complete the mandatory fields" value="">';
        htmlContent += '<textarea maxlength="1000" class="txtDescriptionComent" id="Contracts_0__Clauses_0__ClauseIndividuals_0__UserComments_' + ope + '__Text" name="Contracts[0].Clauses[0].ClauseIndividuals[0].UserComments[' + ope + '].Text" data-val="true" data-val-required="The Text field is required." cols="300" rows="5"></textarea>';

        htmlContent += '</div>';
        htmlContent += '</div>';
        htmlContent += '</div>';
        htmlContent += '</td>';
        htmlContent += '</tr>';
        $('#commentTableUIRI002_edit').append(htmlContent);
        var ddd = htmlContent;

        $('#commentTableUIRI002_edit').find("textarea").last().focusout(function () {
            var divParent = $(this).parent();
            var inputImpactIndicator = $(divParent).find('[id$="__Text"]');
            $(inputImpactIndicator).attr("value", $(this).val());
        });

        try {
            $("#Accept_").val("1");
            $("#Reject_").val("1");
            $("#EditMessage_").val("1");
        } catch (Exception) { }
    });
    
    function ReindexarUserComments(Commenttable)
    {
        
        var ope = $('table#' + Commenttable + ' tbody tr:last').index();
        var Comments = $('table#' + Commenttable + ' tbody');
        var rowCount = 0;

        
        $(Comments).find('tr').each(function (index, tr)
        { 

            var CommentsId = $(this).find('[id$="__UserCommentId"]');
            var Modifiedby = $(this).find('[id$="__ModifiedBy"]');
            var Modified = $(this).find('[id$="__Modified"]');
            var Text = $(this).find('[id$="__Text"]');
            var CreatedBy = $(this).find('[id$="__CreatedBy"]');
            var Created = $(this).find('[id$="__Created"]');

            if ($(CommentsId).val() != null) {
                $(CommentsId).attr("id", "UserComments_" + rowCount + "__UserCommentId");
                $(CommentsId).attr("name", "UserComments[" + rowCount + "].UserCommentId");
            }

            if ($(Modifiedby).val() != null) {
                $(Modifiedby).attr("id", "UserComments_" + rowCount + "__ModifiedBy");
                $(Modifiedby).attr("name", "UserComments[" + rowCount + "].ModifiedBy");
            }

            if ($(Modified).val() != null) {
                $(Modified).attr("id", "UserComments_" + rowCount + "__Modified");
                $(Modified).attr("name", "UserComments[" + rowCount + "].Modified");
            }

            if ($(Text).val() != null) {
                $(Text).attr("id", "UserComments_" + rowCount + "__Text");
                $(Text).attr("name", "UserComments[" + rowCount + "].Text");
            }

            if ($(CreatedBy).val() != null) {
                $(CreatedBy).attr("id", "UserComments_" + rowCount + "__CreatedBy");
                $(CreatedBy).attr("name", "UserComments[" + rowCount + "].CreatedBy");
            }

            if ($(Created).val() != null) {
                $(Created).attr("id", "UserComments_" + rowCount + "__Created");
                $(Created).attr("name", "UserComments[" + rowCount + "].Created");
            }
        
            rowCount++;
        });
    }

    function ReordenarComentariosContractos(Commenttable)
    {
        var ope = $('table#' + Commenttable + ' tbody tr:last').index();
        var Comments = $('table#' + Commenttable + ' tbody');
        var rowCount = 0;

        $(Comments).find('tr').each(function (index, tr) {

            var CommentsId = $(this).find('[id$="__UserCommentId"]');
            var Modifiedby = $(this).find('[id$="__ModifiedBy"]');
            var Modified = $(this).find('[id$="__Modified"]');
            var CreatedBy = $(this).find('[id$="__CreatedBy"]');
            var Created = $(this).find('[id$="__Created"]');
            var Text = $(this).find('[id$="__Text"]');

            if ($(CommentsId).val() != null) {
                $(CommentsId).attr("id", "Contracts_0__UserComments_" + rowCount + "__UserCommentId");
                $(CommentsId).attr("name", "Contracts[0].UserComments[" + rowCount + "].UserCommentId");
            }

            if ($(Modifiedby).val() != null) {
                $(Modifiedby).attr("id", "Contracts_0__UserComments_" + rowCount + "__ModifiedBy");
                $(Modifiedby).attr("name", "Contracts[0].UserComments[" + rowCount + "].ModifiedBy");
            }

            if ($(CreatedBy).val() != null)
            {
                $(CreatedBy).attr("id", "Contracts_0__UserComments_" + rowCount + "__ModifiedBy");
                $(CreatedBy).attr("name", "Contracts[0].UserComments[" + rowCount + "].ModifiedBy");
            }

            if ($(Created).val() != null)
            {
                $(Created).attr("id", "Contracts_0__UserComments_" + rowCount + "__ModifiedBy");
                $(Created).attr("name", "Contracts[0].UserComments[" + rowCount + "].ModifiedBy");
            }

            if ($(Modified).val() != null) {
                $(Modified).attr("id", "Contracts_0__UserComments_" + rowCount + "__Modified");
                $(Modified).attr("name", "Contracts[0].UserComments[" + rowCount + "].Modified");
            }

            if ($(Text).val() != null) {
                $(Text).attr("id", "Contracts_0__UserComments_" + rowCount + "__Text");
                $(Text).attr("name", "Contracts[0].UserComments[" + rowCount + "].Text");
            }

            rowCount++;
        });

    }

    function ReindexarComentarioRevolvingFund(Commenttable)
    {
        var ope = $('table#' + Commenttable + ' tbody tr:last').index();
        var Comments = $('table#' + Commenttable + ' tbody');
        var rowCount = 0;

        $(Comments).find('tr').each(function (index, tr) {

            var CommentsId = $(this).find('[id$="__UserCommentId"]');
            var Modifiedby = $(this).find('[id$="__ModifiedBy"]');
            var Modified = $(this).find('[id$="__Modified"]');
            var CreatedBy = $(this).find('[id$="__CreatedBy"]');
            var Created = $(this).find('[id$="__Created"]');
            var Text = $(this).find('[id$="__Text"]');

            if ($(CommentsId).val() != null)
            {
                $(CommentsId).attr("id", "Contracts_0__RevolvingFund_0__UserComments_" + rowCount + "__UserCommentId");
                $(CommentsId).attr("name", "Contracts[0].RevolvingFund[0].UserComments[" + rowCount + "].UserCommentId");
            }

            if ($(Modifiedby).val() != null) {
                $(Modifiedby).attr("id", "Contracts_0__RevolvingFund_0__UserComments_" + rowCount + "__ModifiedBy");
                $(Modifiedby).attr("name", "Contracts[0].RevolvingFund[0].UserComments[" + rowCount + "].ModifiedBy");
            }

            if ($(Modified).val() != null)
            {
                $(Modified).attr("id", "Contracts_0__RevolvingFund_0__UserComments_" + rowCount + "__Modified");
                $(Modified).attr("name", "Contracts[0].RevolvingFund[0].UserComments[" + rowCount + "].Modified");
            }

            if ($(CreatedBy).val() != null) {
                $(CreatedBy).attr("id", "Contracts_0__RevolvingFund_0__UserComments_" + rowCount + "__Modified");
                $(CreatedBy).attr("name", "Contracts[0].RevolvingFund[0].UserComments[" + rowCount + "].Modified");
            }

            if ($(Created).val() != null) {
                $(Created).attr("id", "Contracts_0__RevolvingFund_0__UserComments_" + rowCount + "__Modified");
                $(Created).attr("name", "Contracts[0].RevolvingFund[0].UserComments[" + rowCount + "].Modified");
            }

            if ($(Text).val() != null) {
                $(Text).attr("id", "Contracts_0__RevolvingFund_0__UserComments_" + rowCount + "__Text");
                $(Text).attr("name", "Contracts[0].RevolvingFund[0].UserComments[" + rowCount + "].Text");
            }

            rowCount++;
        });
    }

    function ReordenarComentariosExtension(Commenttable) {
        var ope = $('table#' + Commenttable + ' tbody tr:last').index();
        var Comments = $('table#' + Commenttable + ' tbody');
        var rowCount = 0;

        $(Comments).find('tr').each(function (index, tr) {

            var CommentsId = $(this).find('[id$="__UserCommentId"]');
            var Modifiedby = $(this).find('[id$="__ModifiedBy"]');
            var Modified = $(this).find('[id$="__Modified"]');

            var CreatedBy = $(this).find('[id$="__CreatedBy"]');
            var Created = $(this).find('[id$="__Created"]');

            var Text = $(this).find('[id$="__Text"]');

            if ($(CommentsId).val() != null) {
                $(CommentsId).attr("id", "Contracts_0__Clauses_0__ClauseIndividuals_0__ClauseExtension_0__UserComments_" + rowCount + "__UserCommentId");
                $(CommentsId).attr("name", "Contracts[0].Clauses[0].ClauseIndividuals[0].ClauseExtension[0].UserComments[" + rowCount + "].UserCommentId");
            }

            if ($(CreatedBy).val() != null) {
                $(CreatedBy).attr("id", "Contracts_0__Clauses_0__ClauseIndividuals_0__ClauseExtension_0__UserComments_" + rowCount + "__ModifiedBy");
                $(CreatedBy).attr("name", "Contracts[0].Clauses[0].ClauseIndividuals[0].ClauseExtension[0].UserComments[" + rowCount + "].ModifiedBy");
            }

            if ($(Created).val() != null) {
                $(Created).attr("id", "Contracts_0__Clauses_0__ClauseIndividuals_0__ClauseExtension_0__UserComments_" + rowCount + "__ModifiedBy");
                $(Created).attr("name", "Contracts[0].Clauses[0].ClauseIndividuals[0].ClauseExtension[0].UserComments[" + rowCount + "].ModifiedBy");
            }

            if ($(Modifiedby).val() != null) {
                $(Modifiedby).attr("id", "Contracts_0__Clauses_0__ClauseIndividuals_0__ClauseExtension_0__UserComments_" + rowCount + "__ModifiedBy");
                $(Modifiedby).attr("name", "Contracts[0].Clauses[0].ClauseIndividuals[0].ClauseExtension[0].UserComments[" + rowCount + "].ModifiedBy");
            }

            if ($(Modified).val() != null) {
                $(Modified).attr("id", "Contracts_0__Clauses_0__ClauseIndividuals_0__ClauseExtension_0__UserComments_" + rowCount + "__Modified");
                $(Modified).attr("name", "Contracts[0].Clauses[0].ClauseIndividuals[0].ClauseExtension[0].UserComments[" + rowCount + "].Modified");
            }

            if ($(Text).val() != null) {
                $(Text).attr("id", "Contracts_0__Clauses_0__ClauseIndividuals_0__ClauseExtension_0__UserComments_" + rowCount + "__Text");
                $(Text).attr("name", "Contracts[0].Clauses[0].ClauseIndividuals[0].ClauseExtension[0].UserComments[" + rowCount + "].Text");
            }

            rowCount++;
        });

    }

    function ReordenarComentariosFinalStatus(Commenttable)
    {

        var ope = $('table#' + Commenttable + ' tbody tr:last').index();
        var Comments = $('table#' + Commenttable + ' tbody');
        var rowCount = 0;

        $(Comments).find('tr').each(function (index, tr) {

            var CommentsId = $(this).find('[id$="__UserCommentId"]');
            var Modifiedby = $(this).find('[id$="__ModifiedBy"]');
            var Modified = $(this).find('[id$="__Modified"]');
            var Text = $(this).find('[id$="__Text"]');

            var CreatedBy = $(this).find('[id$="__CreatedBy"]');
            var Created = $(this).find('[id$="__Created"]');


            if ($(CommentsId).val() != null) {
                $(CommentsId).attr("id", "Contracts_0__Clauses_0__ClauseIndividuals_0__UserComments_" + rowCount + "__UserCommentId");
                $(CommentsId).attr("name", "Contracts[0].Clauses[0].ClauseIndividuals[0].UserComments[" + rowCount + "].UserCommentId");
            }

            if ($(CreatedBy).val() != null) {
                $(CreatedBy).attr("id", "Contracts_0__Clauses_0__ClauseIndividuals_0__UserComments_" + rowCount + "__UserCommentId");
                $(CreatedBy).attr("name", "Contracts[0].Clauses[0].ClauseIndividuals[0].UserComments[" + rowCount + "].UserCommentId");
            }

            if ($(Created).val() != null) {
                $(Created).attr("id", "Contracts_0__Clauses_0__ClauseIndividuals_0__UserComments_" + rowCount + "__UserCommentId");
                $(Created).attr("name", "Contracts[0].Clauses[0].ClauseIndividuals[0].UserComments[" + rowCount + "].UserCommentId");
            }

            if ($(Modifiedby).val() != null) {
                $(Modifiedby).attr("id", "Contracts_0__Clauses_0__ClauseIndividuals_0__UserComments_" + rowCount + "__ModifiedBy");
                $(Modifiedby).attr("name", "Contracts[0].Clauses[0].ClauseIndividuals[0].UserComments[" + rowCount + "].ModifiedBy");
            }

            if ($(Modified).val() != null) {
                $(Modified).attr("id", "Contracts_0__Clauses_0__ClauseIndividuals_0__UserComments_" + rowCount + "__Modified");
                $(Modified).attr("name", "Contracts[0].Clauses[0].ClauseIndividuals[0].UserComments[" + rowCount + "].Modified");
            }

            if ($(Text).val() != null) {
                $(Text).attr("id", "Contracts_0__Clauses_0__ClauseIndividuals_0__UserComments_" + rowCount + "__Text");
                $(Text).attr("name", "Contracts[0].Clauses[0].ClauseIndividuals[0].UserComments[" + rowCount + "].Text");
            }

            rowCount++;
        });

    }


});