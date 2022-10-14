// FUNCTION FOR KEYWORD COUNTER
function updateCountdown() {
    // 150 is the max message length
    var remaining = 150 - $('#prod_keyword').val().length;
    $('.countdown').text(remaining + ' characters remaining.');
} 

// NUMBER ONLY IN SPECIFIC FIELDS
function isNumberKey(evt)
{
    var charCode = (evt.which) ? evt.which : event.keyCode;
    if (charCode != 46 && charCode > 31 
        && (charCode < 48 || charCode > 57)){
        return false;
    }

    return true;
}

function setChosen(){
    $("#head-data,.value-data").chosen({
        create_option: true,
        skip_no_results: true,
        persistent_create_option: true,  
        width: "100%"
    });  
}

function appendNewSelectionRow(){
    cnt++;  
    var stringAppend = '<div class="control-panel-'+cnt+' ctrl row">\
    <div class="display-ib width-100p-40max"></div>\
    <div class="value-section col-xs-5 col-sm-5 col-md-5 pd-bttm-10">\
    <div class="select-value-section">\
    <select id="value-data-'+cnt+'" class="value-data" data-cnt="'+cnt+'" data-placeholder="(e.g Blue, Red, Small, Large,...) ">\
    <option value="0"></option>\
    </select>\
    </div>\
    </div>\
    <div class="price-div col-xs-3 col-sm-3 col-md-3 pd-bttm-10">\
    &#8369; <input type="text" maxlength="10"  onkeypress="return isNumberKey(event)"   class="price-val price'+cnt+' ui-form-control" placeholder="0.00" />\
    </div>\
    <div class="image-div col-xs-2 col-sm-2 col-md-2 pd-bttm-10">\
    <input type="hidden" class="image-val imageText'+cnt+'"/>\
    <input type="hidden" class="image-file imageFileText'+cnt+'"/>\
    <a class="select-image qty-image-con image'+cnt+'" data-cnt="'+cnt+'" href="javascript:void(0)"><img src="'+default_upload_image+'"></a>\
    <a class="select-image image'+cnt+' select-image-pencil" data-cnt="'+cnt+'" href="javascript:void(0)"><span class="glyphicon glyphicon-pencil"></span></a>\
    </div>\
    <a class="remove-control-panel" href="javascript:void(0)" data-cnt="'+cnt+'">Remove property value</a>\
    </div><div class="clear"></div>';

    $('.control-panel').append(stringAppend);

    var selector = $('#head-data');
    var valueData =  $('#value-data-'+cnt);
    var selectedValue = selector.chosen().val(); 
    if(selectedValue != '0'){
        var attrList = attributeArray[selectedValue];  
        valueData.empty(); 

        if(attrList!==undefined){
            $.each(attrList, function(key, value){
                valueData.append('<option>'+value+'</option>');
            });
        }
        valueData.trigger("liszt:updated");
    }
    setChosen(); 
    return cnt;
}

function askDraft(location)
{
    if(isEdit == 0){ 
        $("#question").dialog({
            resizable: false,
            width: '90%',
            modal: true,
            fluid: true,
            buttons: {
                "Yes, please.": function() {
                    $(".ui-dialog-buttonset").hide();
                    saveAsDraftProceed();
                    window.location = location;
                },
                "No, thanks": function() {
                    $(".ui-dialog-buttonset").hide();
                    window.location = location;
                },
                "Stay on this page": function() {
                    $(this).dialog("close");
                }
            },
            open: function() {
                var draftmessage = '<p style="font-size:14px;padding-top:18px;">You are about to close an incomplete upload. Would you like us to save this for you?</p>';
                $(this).html(draftmessage);
            },
            "title": "Save as Draft"
            
        });   
    }
    else{ 
        saveAsDraftProceed();
        window.location = location;
    }
    
    $(".ui-dialog-buttonset").children("button:eq(0)").addClass("btn btn-default-3");
    $(".ui-dialog-buttonset").children("button:eq(2)").addClass("btn btn-default-1").removeClass("btn-default-3");
}

function removeDuplicateCombination()
{
    var arrayCombination = [];
    $(".div-combination").each(function(){
        var selector = $(this);
        var cnt = selector.children('.div3').children('.remove-combination').data('cmbcnt');
        var select = selector.children('.div2').children('span').children('.selection');
        var stringId = "";
        select.each(function(){
            stringId += $(this).children('option:selected').data('value');
        });

        if($.inArray(stringId,arrayCombination) <= -1){
            arrayCombination.push(stringId);
        }
        else{
            $('.combination'+cnt).remove();
        }
    }); 
}

function checkCombination(currentStringId)
{
    var arrayCombination = [];
    $(".div-combination").each(function(){
        var select = $(this).children('.div2').children('span').children('.selection');
        var stringId = "";
        select.each(function(){
            stringId += $(this).children('option:selected').data('value');
        });
        arrayCombination.push(stringId);
    });
    if(arrayCombination.length > 0){
        if($.inArray(currentStringId,arrayCombination) <= -1){
            return true;
        }
        else{
            return false;
        }
    }
}

function jqSelector(str)
{
    return str.replace(/([;&,\.\+\*\~':"\!\^#$%@\[\]\(\)=>\|])/g, '\\$1');
}

function resetControlPanel(buttonReset)
{
    var defaultString = '<div class="control-panel-1 ctrl row">\
    <div class="display-ib width-100p-40max"></div>\
    <div class="value-section col-xs-5 col-sm-5 col-md-5 pd-bttm-10">\
    <div class="select-value-section">\
        <select data-placeholder="(e.g Blue, Red, Small, Large,...) " data-cnt="1" class="value-data" id="value-data-1">\
            <option value="0"></option> \
        </select>\
    </div> \
    </div>\
    <div class="price-div col-xs-3 col-sm-3 col-md-3 pd-bttm-10">\
        &#8369; <input type="text"  maxlength="10" placeholder="0.00"  onkeypress="return isNumberKey(event)"   class="price-val price1 ui-form-control">\
    </div>\
    <div class="image-div col-xs-2 col-sm-2 col-md-2 pd-bttm-10">\
        <input type="hidden" class="image-val imageText1"/>\
        <input type="hidden" class="image-file imageFileText1"/>\
         <a class="select-image qty-image-con image1" data-cnt="1" href="javascript:void(0)"><img src="'+default_upload_image+'"></a>\
        <a class="select-image image1 select-image-pencil" data-cnt="1" href="javascript:void(0)"><span class="glyphicon glyphicon-pencil"></span></a>\
    </div>\
    </div><div class="clear"></div>';

    $('.control-panel').empty().append(defaultString);
    setChosen();

    var headData = $("#head-data");
    var valueData = $('.value-data');
    headData.trigger("liszt:updated");

    if(buttonReset){
        headData.val('').trigger("liszt:updated");
        $('.add-property').val('Add Property');
        editSelectedValue,editSelectedValue = '';
        $('#cancel-changes').remove();
        validateWhiteTextBox(".div2 > span > .selection");
    }

    var selectedValue = headData.chosen().val();  
    var cleanString = jqSelector(selectedValue.toLowerCase().replace(/ /g,''));
    var attrList = attributeArray[selectedValue];
    
    valueData.empty(); 
    if(attrList!==undefined){
        valueData.append('<option></option>');
        $.each(attrList, function(key, value){
            valueData.append('<option>'+value+'</option>');
        });
    }
    valueData.trigger("liszt:updated");
} 

function get_discPrice() {
    var prcnt = $("#slider_val").val().replace("%",'');
    var act_price = $("#prod_price").val().replace(/,/g,'');
    if (prcnt >= 100) {
        prcnt = 99;
    }
    if (act_price == 0 || act_price == null || isNaN(act_price)) {
        validateRedTextBox("#prod_price");
        $("#prod_price").val("");
        act_price = 0;
    }
    $("#slider_val").val("");
    $("#slider_val").val(prcnt+"%");
    var discounted = act_price * (prcnt/100);
    var discountPrice = Math.abs(parseFloat(act_price - discounted)); 
    var finalDiscountPrice = replaceNumberWithCommas(discountPrice.toFixed(2));
    $("#discountedP").val(finalDiscountPrice);
    $( "span#discounted_price_con" ).text( finalDiscountPrice );
}

function zebraCombination()
{
    $(".zebra-div:even").css("background-color","#F7F7F7"); 
    $(".zebra-div:odd").css("background-color","white"); 
}

function checkOptionValue(selector,id,value,evt)
{
    var exists = false;
    var commonValue;
    var activeSelection = selector.search_results.find('li.active-result').length;
    var highlightSelection = selector.search_results.find('li.highlighted').length;
    var valueData =  $('.value-data'); 
    value = $.trim(value.replace(/[^a-z0-9\s\-]/gi, ''));

    if(value.length <= 0){
        return false;
        $('body').click();
    }

    $(id).children('option').each(function(){
        var text = $(this).text(); 
        if (text.toLowerCase() == value.toLowerCase()) {
            exists = true;
            commonValue = text;
            return false;
        }
    });

    if(highlightSelection >= 1){
        if(exists !== true){
            selector.result_highlight = selector.search_results.find('li.highlighted').first(); 
            return selector.result_select(evt);
        }
    }
    else{
        if(exists !== true){
            $(id).append('<option>' + value + '</option>');
            $(id).trigger('liszt:updated');
            selector.result_highlight = selector.search_results.find('li.active-result').last(); 
            return selector.result_select(evt);   
        }
    }

    if(exists == true){ 
        if(id.id == 'head-data'){
            valueData.empty().trigger("liszt:updated");
        }
        if(activeSelection <= 1){ 
            $(id).val(commonValue).trigger("liszt:updated");
            var attrList = attributeArray[commonValue]; 
            if(typeof attrList !== 'undefined'){ 
                $.each(attrList, function(key, value){
                    valueData.append('<option>'+value+'</option>');
                });
            }
            valueData.trigger("liszt:updated");
        }
        else{ 
            selector.result_highlight = selector.search_results.find('li.active-result').first();
            return selector.result_select(evt);
        }
    }
    $('body').click();
}


function proceedStep3(url)
{
    $('#form_product').ajaxForm({
        url: url,
        dataType: "json",
        beforeSubmit : function(arr, $form, options){

            var combination = processCombination();
            var attributes = processAttributes(); 
            var percentVal = '0%';
            $('.percentage').html(percentVal);
            $( ".button_div" ).hide();
            $( ".loader_div" ).show();

            $('<input type="hidden">').attr({
                  id: 'primaryPicture',
                  name: 'primaryPicture',
                  value: primaryPicture
                }).appendTo('form');
            arr.push({"name":"primaryPicture", "value":primaryPicture});

            $('<input type="hidden">').attr({
                  id: 'removeThisPictures',
                  name: 'removeThisPictures',
                  value: JSON.stringify(removeThisPictures)
                }).appendTo('form');
            arr.push({"name":"removeThisPictures", "value":JSON.stringify(removeThisPictures)});

            $('<input type="hidden">').attr({
                  id: 'combination',
                  name: 'combination',
                  value: combination
                }).appendTo('form');
            arr.push({"name":"combination","value":combination});

            $('<input type="hidden">').attr({
                  id: 'attributes',
                  name: 'attributes',
                  value: attributes
                }).appendTo('form');
            arr.push({"name":"attributes","value":attributes});


        },
        uploadProgress : function(event, position, total, percentComplete) {
            var percentVal = percentComplete + '%';
            $('.percentage').empty();
            if(percentComplete >= 100){
                percentVal = '100%'
                $('.percentage').html(percentVal);
            }else{
                $('.percentage').html(percentVal);
            }
        },
        success :function(d) { 
            $('.percentage').html('100%');
            if (d.e == 1) {
                $('#prod_h_id').val(d.d); 
                document.getElementById("hidden_form").submit();
            } else {
                $( ".button_div" ).show();
                $( ".loader_div" ).hide();
                $('.percentage').empty();
                alert(d.d);
            } 
        },
        error: function (request, status, error) {
            $( ".button_div" ).show();
            $( ".loader_div" ).hide();
            $('.percentage').empty();
            response = request.responseText;
            if (response.toLowerCase().indexOf("1001") >= 0){
                alert('Something went wrong. Some of the images you are trying to upload for this listing are too large.');
            }else{
                alert('Something went wrong. Please try again.');
            }
        } 
    }); 
}



function saveAsDraftProceed(url)
{
    $('.arrayNameOfFiles').val(JSON.stringify(af));
    tinyMCE.triggerSave(); 
    $('#form_product').ajaxForm({ 
        url: url,
        dataType: "json",
        beforeSubmit : function(arr, $form, options){
            var combination = processCombination();
            var attributes = processAttributes(); 

            $('<input type="hidden">').attr({
                  id: 'primaryPicture',
                  name: 'primaryPicture',
                  value: primaryPicture
            }).appendTo('form');
            arr.push({name:'primaryPicture', value:primaryPicture});

            $('<input type="hidden">').attr({
              id: 'removeThisPictures',
              name: 'removeThisPictures',
              value: JSON.stringify(removeThisPictures)
            }).appendTo('form');
            arr.push({name:'removeThisPictures', value:JSON.stringify(removeThisPictures)});

            $('<input type="hidden">').attr({
              id: 'combination',
              name: 'combination',
              value: combination
            }).appendTo('form');
            arr.push({name:'combination',value:combination});

            $('<input type="hidden">').attr({
                id: 'attributes',
                name: 'attributes',
                value: attributes
            }).appendTo('form');
            arr.push({name:'attributes',value:attributes});

            $('<input type="hidden">').attr({
                id: 'savedraft',
                name: 'savedraft',
                value: '1'
            }).appendTo('form');
            arr.push({name:'savedraft',value:'1'});

        },success :function(d) { 
            $("#form_product").attr("action", "/sell/edit/processing");
            $("#form_product").append('<input type="hidden" name="p_id" id="p_id" value="'+d.d+'">');
            $("#edit_step1 > #p_id").val(d.d);
        }
    }).submit(); 
}

function processCombination()
{
    var completeCombination = [];   
    $(".div-combination").each(function(){

        var currentDiv = $(this);
        var selectList = currentDiv.children('.div2').children('span');

        var eachData = {};
        var eachCombination = {};
        var itemId = 0;
        if (currentDiv.data("itemid") != undefined) {
            itemId = currentDiv.data("itemid");
        }

        selectList.each(function(){
            var currentSelect = $(this);
            var optionSelected = $(this).children('select').children('option:selected');
            var head = optionSelected.data('head');
             var value = optionSelected.data('value');
            var price = optionSelected.data('price');
            eachData[head] = value; 
        });

        eachCombination.quantity = currentDiv.children('.div1').children('.qty').val(); 
        eachCombination.data = eachData; 
        eachCombination.itemid = itemId;
        completeCombination.push(eachCombination);
    });

    return JSON.stringify(completeCombination);
}

function processAttributes()
{
    var span = $('.select-control-panel-option > .div2 > span');
    var completeAttributes = {}; 
    span.each(function(){
        var currentSelect = $(this);
        var select = $(this).children('select').children('option');
        var currentHead;
        var eachHead = [];
        select.each(function(){
            var eachValue = {};
            var optionSelected = $(this);
            var head = currentHead = optionSelected.data('head');
            var value = optionSelected.data('value');
            var price = optionSelected.data('price');
            var image = optionSelected.data('image');
            eachValue.value =value;
            eachValue.price =price;
            eachValue.image =image;
            eachHead.push(eachValue);
        });
        completeAttributes[currentHead] =  eachHead;
        
    });

    return JSON.stringify(completeAttributes);
}

(function($) {

     // if keyword change. counter will change also either increase or decrease until reach its limit..
    updateCountdown();
    $('#prod_keyword').change(updateCountdown);
    $('#prod_keyword').keyup(updateCountdown); 


    $('#prod_price').on('change', function(){
        var prcnt = parseFloat($("#slider_val").val().replace("%",''));
        var price = parseFloat($(this).val());
        if( !isNaN(prcnt) ){
            get_discPrice();
        }
        else{
            if(isNaN(price)){
                price = 0; 
                $("#discountedP").val('');
                $("#slider_val").val("0%");
            }
            $("#discounted_price_con").text(replaceNumberWithCommas(price.toFixed(2)));
        }
    });
    
    $( "#prod_price" ).keypress(function() {
        validateWhiteTextBox("#prod_price");
    });

    // view more product details trigger
    $('.view_more_product_details').on('click', function() {
        $('.more_product_details_container,.prod-details-add-more-link').slideToggle();
        $('.view_more_product_details').toggleClass('active-product-details');
    });

    // Load tinyMCE plugin
    $(function() {
        tinyMCE.init({ 
            mode : "specific_textareas",
            editor_selector : "mceEditor", 
            menubar: "table format view insert",
            statusbar: false, 
            height: 300,
            plugins: ["lists link preview","table jbimages fullscreen","textcolor" ],  
            toolbar: "insertfile undo redo | sizeselect | fontselect  fontsizeselect styleselect  forecolor backcolor | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | jbimages | image_advtab: true ",  
            relative_urls: false,
            remove_script_host : false,
            convert_urls: true,
            target_list: []
        });
    });

})(jQuery);

/**
 * Load Discount Feature
 */
(function($) {

    var sliderValue = parseFloat($('#slider_val').data('value'));

    // Load if discount is set for edit
    if(sliderValue !== 0 && !isNaN(sliderValue)){
        $('#slider_val').val(sliderValue+'%');
        get_discPrice();
    }

    // Load discount range slider
    var $rangeSlider = $("#range_1");
    $rangeSlider.ionRangeSlider({
        min: 0,
        max: 99,
        type: 'single',
        step: 1,
        postfix: "%",
        prettify: true,
        hasGrid: true,
        from:sliderValue,
        onChange: function (obj) {        // callback is called after slider load and update
            var value = obj.fromNumber;
            $("#slider_val").val(value);
            get_discPrice();
        }
    });

    $("#dsc_frm").hide();
    $("#discnt_btn").on("click",function(){
        $("#dsc_frm").toggle();
    });

    $("#slider_val").bind('change keyup',function(e){
        if(e.which > 13 || e.which < 13){
            return false;
        }

        var $this = $(this);
        var newval = (parseFloat($this.val()) > 100) ? 99 : (parseFloat($this.val()) == 0 || isNaN(parseFloat($this.val())))? 0 : parseFloat($this.val());
        $(this).val(newval);
        get_discPrice();
        $rangeSlider.ionRangeSlider("update", {
            from: newval 
        });
    });

    $("#discountedP").bind('change',function(e){

        var $this = $(this);
        var discountPrice = parseFloat($this.val());
        var basePrice = parseFloat($("#prod_price").val().replace(/,/g,''));
        var sum = ((basePrice - discountPrice) / basePrice) * 100;
        sum = sum.toFixed(4);
        validateWhiteTextBox("#discountedP");
        
        if (isNaN(discountPrice) || $("#prod_price").val() <= 0) {
            $(this).val('');
            $("#slider_val").val("0%");
            $rangeSlider.ionRangeSlider("update", {
                from: 0
            });
            if(isNaN(basePrice)){
                basePrice = 0;
            }
            $( "span#discounted_price_con" ).text( replaceNumberWithCommas(basePrice.toFixed(2)) );

            return false;
        } 

        if(discountPrice > basePrice){
            alert("Discounted price cannot be greater than base price.");
            $this.val('');
            $("#slider_val").val("0%");
            $rangeSlider.ionRangeSlider("update", {
                from: 0
            }); 
            $( "span#discounted_price_con" ).text( replaceNumberWithCommas(basePrice.toFixed(2)) ); 

            return false;
        } 
 
        if(discountPrice <= 0){
            alert("Discounted price cannot be equal or less than 0.");
            $this.val('');
            $("#slider_val").val("0%");
            $rangeSlider.ionRangeSlider("update", {
                from: 0
            }); 
            $( "span#discounted_price_con" ).text( replaceNumberWithCommas(basePrice.toFixed(2)) );
            
            return false;
        }

        $rangeSlider.ionRangeSlider("update", {
            from: sum
        });

        $("#slider_val").val(sum+"%");
        tempval = Math.abs(discountPrice);
        discountPrice = replaceNumberWithCommas(tempval.toFixed(2));
        $this.val(discountPrice);
        $("span#discounted_price_con").text(discountPrice);
    });

    $(document).mouseup(function (e){
        var $container = $("#dsc_frm");

        //Close $container if the target of the click isn't the $container
        if (!$container.is(e.target)
            && $container.has(e.target).length === 0){
            $container.hide(); 
        }
    });
})( jQuery );

var maxQuantity = 9999;
// Manipulating of additional attributes
var cnt = 1; 
var previous,editSelectedValue,editSelectedId; 
(function($) {

    setChosen();
    zebraCombination();
    $("#head-data,.value-data").val('').trigger("liszt:updated");

    $(document).on('change',".price-val,#prod_price",function () {
        var priceval = this.value.replace(new RegExp(",", "g"), '');
        var v = parseFloat(priceval);
        var tempval;
        if (isNaN(v)) {
            this.value = '';
        } else {
            tempval = Math.abs(v);
            this.value = tempval.toFixed(2);
        }
    });

    $(document).on('change',".qty",function () {
        var qty = this.value;
        var v = parseInt(qty);
        var tempval;
        if (isNaN(v)) {
            this.value = '1';
        } else {
            tempval = Math.abs(v);
            this.value = tempval;
        }
    });

    $(document).on("click","#head_data_chzn",function (){
        var selector = $("#head-data");  
        previous = selector.chosen().val(); 
    });

    AbstractChosen.prototype.input_blur = function(evt) {
        checkOptionValue(this,this.form_field,$(evt.target).val(),evt);
    }

    Chosen.prototype.keydown_checker = function(evt) {
        if(evt.which === 13){
            checkOptionValue(this,this.form_field,$(evt.target).val(),evt);
        }
    }

    $(document).on('focus, click', '.chzn-single', function(){
        $(".chzn-search > input[type=text]").attr('maxlength', 25);
    });


    $(document).on("keypress",".chzn-search > input[type=text]", function (evt){
        var regex = new RegExp("^[a-zA-Z0-9\\-\\s\\b]+$");
        var str = String.fromCharCode(!evt.charCode ? evt.which : evt.charCode);
        if (regex.test(str)) {
            return true;
        }
        evt.preventDefault();

        return false;
    });

    $(document).on("change","#head-data",function (){
        var selector = $(this); 
        var valueData =  $('.value-data'); 
        var selectedValue = selector.chosen().val();
        var cleanString = jqSelector(selectedValue.toLowerCase().replace(/ /g,''));
        var length = $(".select-control-panel-option > .div2 > span > [id="+cleanString+"]").length; 
        var buttonValue = $('.add-property').val(); 
        var attrList = attributeArray[selectedValue]; 

        if(buttonValue === 'Add Property'){
            valueData.empty(); 
            if(attrList!==undefined){
                $.each(attrList, function(key, value){
                    valueData.append('<option>'+value+'</option>');
                });
            }
            else{
                attributeArray[selectedValue] = [];
            }
        }
        else{
            if(length > 0 && editSelectedValue != selectedValue){
                $('#head-data').val(previous).trigger("liszt:updated");
                alert(selectedValue +' already exists in the selection.');
            }
            else{
                $('.value-data option').not(':selected').remove();
                if(attrList!==undefined){
                    $.each(attrList, function(key, value){
                        valueData.append('<option>'+value+'</option>');
                    });
                }
            }
        }
        valueData.trigger("liszt:updated");
    });

    $(document).on("click",".add-property-value",function (){
       appendNewSelectionRow();
    });

    $(document).on("click",".remove-control-panel",function (){
        var cnt = $(this).data('cnt'); 
        $('.control-panel-'+cnt).remove();
        if( $('.ctrl').length <= 0 ) {
            resetControlPanel(false); 
        }
    });

    $(document).on("click",".add-property",function (){
        var selector = $('#head-data');
        buttonValue = $(this).val();
        var selectedValue = selector.chosen().val();
        var cleanString = jqSelector(selectedValue.toLowerCase().replace(/ /g,''));
        var optionString = "";
        var eachCtrlValue = [];
        var checked = $('.set-default:checked').length > 0; 

        if(selectedValue == 0){
            return false;
        }

        $(".ctrl").each(function(){
            var selectList = $(this).find(".value-section").find('.select-value-section').find('.value-data').val();
            var priceString = $(this).find(".price-div").find('.price-val').val();
            var price = (priceString.length == 0) ? '0.00' : priceString;
            var image = $(this).find(".image-div").find('.image-val').val();
            var fileImage = $(this).find(".image-div").find('.image-file').val();
            
            if(selectList){
                if($.inArray(selectList,eachCtrlValue) <= -1){
                    if($.trim( $('.select-control-panel-option > .div2').html() ).length ) {
                        if($(".select-control-panel-option > .div2 > span > #"+cleanString).length > 0){
                            if($('.select-control-panel-option > .div2 > span > #'+cleanString + ' option[data-value="'+selectList+'"]').length > 0){
                                $('.select-control-panel-option > .div2 > span > #'+cleanString + ' option[data-value="'+selectList+'"]').remove()
                            }
                        } 
                    }
                    optionString += "<option data-value='"+selectList+"' value='"+selectList+"' data-head='"+selectedValue+"' data-price='"+price+"' data-file='"+fileImage+"' data-image='"+image+"'>"+selectList+" - &#8369; "+price+"</option>";       
                    if($.inArray(selectList,attributeArray[selectedValue]) <= -1){
                        attributeArray[selectedValue].push(selectList);
                    }
                    eachCtrlValue.push(selectList);
                }
            }
        });

        if(buttonValue === 'Add Property'){
            if(optionString == ""){
                return false;
            }
            var selectString = "<span class='spanSelect"+cleanString+"'><select class='selection width-30p ui-form-control' id='"+cleanString+"' data-id='"+cleanString+"'>";
            selectString += optionString + "</select><a data-id='"+cleanString+"' data-head='"+selectedValue+"' class='edit-attr' href='javascript:void(0)'><span class='glyphicon glyphicon-pencil'></span></a>  <a data-id='"+cleanString+"' data-head='"+selectedValue+"' class='remove-attr' href='javascript:void(0)'><span class='glyphicon glyphicon-remove'></span></a></span>";

            if( !$.trim( $('.select-control-panel-option > .div2').html() ).length ) {

                var rowString = '<div class="col-xs-2 col-sm-1 col-md-1 div1"><input class="qty ui-form-control" onkeypress="return isNumberKey(event)" name="allQuantity" maxlength="4" type="text" size=3 value="1" /></div>\
                <div class="col-xs-8 col-sm-9 col-md-9  div2">'+selectString+'</div>\
                <div class="col-xs-2 col-sm-2 col-md-2 div3"><input type="button" class="select-combination  orange_btn3 width-70p" value="Add" /></div>';

                $('.select-control-panel-option').empty().append(rowString);
            }
            else{
                var length = $(".select-control-panel-option > .div2 > span > #"+cleanString).length;
                
                if(length <= 0){
                    $('.list-choosen-combination-div > .div-combination > .div2').append(selectString);
                    $('.list-choosen-combination-div > .div-combination > .div2 > span > .selection').prop("disabled",true); 
                    $('.select-control-panel-option > .div2').append(selectString);
                    $('.list-choosen-combination-div > .div-combination > .div2 > span > .remove-attr').remove();
                }
                else{
                    $('.select-control-panel-option > .div2 > span > #'+cleanString).append(optionString);
                }
                if(checked){
                    $('.list-choosen-combination-div > .div-combination > .div2 > span > .selection').empty().append('<option>All Combination</option>');
                }
            } 
        }
        else{

            var currentSelector = $('.select-control-panel-option > .div2 > span > #'+editSelectedId);
            currentSelector.empty().append(optionString).attr("id",cleanString);
            currentSelector.data('id',cleanString);
            currentSelector.parent().children('a').data('head',selectedValue);
            currentSelector.parent().children('a').data('id',cleanString);
            currentSelector.parent().removeClass().addClass('spanSelect'+cleanString)
            
            if(!checked){
                $('.list-choosen-combination-div > .div-combination > .div2 > span > #'+editSelectedId).append(optionString).attr("id",cleanString);
            }

            validSelection = [];
            currentSelector.children('option').each(function () {
                var valx = $(this).data('value');
                var eachCombination = {};
                eachCombination.price = $(this).data('price');
                eachCombination.image = $(this).data('image'); 
                eachCombination.text = $(this).text(); 
                validSelection[valx] = eachCombination;
            });
 
            $('.list-choosen-combination-div > .div-combination').each(function () {
                var used = {}; 
              
                $(this).find(".div2").find('span').find('#'+editSelectedId).each(function () {
                    var $choosenSelect = $(this);
                    var selectedValue = $choosenSelect.children('option:selected').data('value');
                    if( validSelection[selectedValue] === undefined ) { 
                        $choosenSelect.children('option').remove();

                       $(".select-control-panel-option > .div2 > .spanSelect"+editSelectedId + " > #"+editSelectedId + " > option").each(function () {
                            $choosenSelect.append($(this).clone());
                        });

                    }
                    else{
                        $(this).children('option:selected').data('price',validSelection[selectedValue]['price']);
                        $(this).children('option:selected').data('image',validSelection[selectedValue]['image']);
                        $(this).children('option:selected').text(validSelection[selectedValue]['text']);
                    }
                });
            });

            if(optionString == ""){
                $('.spanSelect'+cleanString).remove();
                if( !$.trim( $('.select-control-panel-option > .div2').html() ).length ) {
                    $('.list-choosen-combination-div,.select-control-panel-option ').empty();
                    $('.select-control-panel-option').append('\
                        <div class="col-xs-2 col-sm-1 col-md-1 div1">\
                        <input type="text" value="1" name="allQuantity" size="3" class="qty" onkeypress="return isNumberKey(event)">\
                        </div>\
                        <div class="col-xs-8 col-sm-9 col-md-9 div2"></div>\
                        <div class="col-xs-2 col-sm-2 col-md-2 div3"></div>');
                    resetControlPanel(true);
                }
            }
            removeDuplicateCombination();
        }
        $(".ctrl").remove();    
        resetControlPanel(true);
        zebraCombination();
    });

    $(document).on("click",".select-combination",function (){

        currentStringId = "";
        $(".select-control-panel-option > .div2 > span > .selection").each(function() {
            currentStringId += $('.select-control-panel-option > .div2 > span > #'+$(this).data('id') +' option:selected').data('value');
        });

        var checkIfExist = checkCombination(currentStringId);
        if(checkIfExist == false){
            alert('<span style="font-size:13px;">The quantity for this combination has already been assigned.</span>');
            return false;
        }
        var combinationQuantity = parseInt($('.select-control-panel-option > .div1 > .qty').val());
        if( combinationQuantity <= 0 || $.isNumeric(combinationQuantity) == false || combinationQuantity > maxQuantity){
            validateRedTextBox('.qty');
            return false;
        }
        else{
            validateWhiteTextBox('.qty');
        }

        var checked = $('.set-default:checked').length > 0;

        if(!checked){
            $('.set-default').remove(); 
            $(".div-combination > .div2").each(function() {
                $(".select-control-panel-option > .div2 > .selection").each(function() {
                    var id = $(this).data('id');
                    var length = $(".div-combination > .div2 > #"+id).length; 
                    if(length <= 0){
                        $(".div-combination > .div2 ").append($('.select-control-panel-option > .div2 > #'+id).clone());
                    }
                });
            });

            $('.list-choosen-combination-div').append('<div class="div-combination zebra-div combination'+combinationcnt+'"></div>');
            $('.combination'+combinationcnt).append($('.select-control-panel-option').children().clone());
            $('.list-choosen-combination-div > .div-combination > .div2 > span > .remove-attr').remove();
            $(".select-control-panel-option > .div2 > span > .selection").each(function() {
                var selData = $('.select-control-panel-option > .div2 > span > #'+$(this).data('id') +' option:selected').data('value');
                var selectElement = $(".combination"+combinationcnt+" > .div2 > span > #" + $(this).data('id'));
                selectElement.children('option').each(function(){
                    if ($(this).data('value') == selData) {
                        $(this).parent().val(selData).change(); 
                    }
                });

                selectElement.prop("disabled",true);
            });

            $('.combination'+combinationcnt +' > .div3').empty().append('<input class="remove-combination btn btn-danger width-70p" data-cmbcnt="'+combinationcnt+'" type="button" value="Remove">')
            $('.combination'+combinationcnt).append('<div class="clear"></div>');
            combinationcnt++; 
        }
        else{ 
            $('.select-combination').prop("disabled",true); 
            $('.list-choosen-combination-div').append('<div class="div-combination zebra-div combinationAll"></div>');
            $('.combinationAll').append($('.select-control-panel-option').children().clone());
            $('.list-choosen-combination-div > .div-combination > .div2 > span > .remove-attr').remove(); 
            $('.list-choosen-combination-div > .div-combination > .div2 > span > .edit-attr').remove();    
            $('.combinationAll > .div2 > span > .selection').empty().append('<option>All Combination</option>');
            $('.combinationAll > .div3').empty().append('<input class="remove-combination btn btn-danger width-70p" data-cmbcnt="All" type="button" value="Remove">')
        }
        resetControlPanel(true);
        zebraCombination();
    });

    $(document).on("click",".remove-combination",function (){
        var selector = $(this);
        cmbcnt = selector.data('cmbcnt');
        $('.combination'+cmbcnt).remove();
        if( !$.trim( $('.list-choosen-combination-div').html() ).length ) { 
            $('.select-combination').prop("disabled",false); 
            $('.select-control-panel-option > .div3 > .set-default').remove(); 
        }
        resetControlPanel(true);
        zebraCombination();
    });

    $(document).on("click",".remove-attr",function (){
        var selector = $(this);
        var id = selector.data('id');
        validateRedTextBox(".div2 > span > #"+id);
        var confirmation = confirm('Are you sure you want to remove?');
        if(confirmation === true){
            $('.spanSelect'+id).remove();
            if( !$.trim( $('.select-control-panel-option > .div2').html() ).length ) {
                $('.list-choosen-combination-div,.select-control-panel-option ').empty();
                $('.select-control-panel-option').append('\
                    <div class="col-xs-2 col-sm-1 col-md-1 div1">\
                    <input type="text" name="allQuantity" value="1" size="3" class="qty ui-form-control" maxlength="4" onkeypress="return isNumberKey(event)">\
                    </div>\
                    <div class="col-xs-8 col-sm-9 col-md-9 div2"></div>\
                    <div class="col-xs-2 col-sm-2 col-md-2 div3"></div>');
            }
            resetControlPanel(true);
        }
        validateWhiteTextBox(".div2 > span > #"+id);
        removeDuplicateCombination();
    });

    $(document).on("click",".edit-attr",function (){
        var selector = $(this);
        var head = editSelectedValue = selector.data('head');
        var id = editSelectedId = selector.data('id');  
        $('.add-property').val('Save Property').nextAll().remove();
        $('.add-property').after('<input type="button" id="cancel-changes" value="Cancel" class="btn btn-default width-80p" />');
        $('#head-data').val(head).trigger("liszt:updated");
        $('.control-panel').empty();
        validateWhiteTextBox(".selection");
        validateRedTextBox(".div2 > span > #"+id);
        $(".select-control-panel-option > .div2 > span > #"+id +" option").each(function(){
            var row = appendNewSelectionRow();
            var value = $(this).data('value'); 
            var price = $(this).data('price'); 
            var image = $(this).data('image'); 
            var filePath = $(this).data('file'); 
            var displayImage = (filePath == "") ? default_upload_image : filePath;
            $('.control-panel-'+row +' > .value-section > .select-value-section > #value-data-'+row).val(value);
            $('.control-panel-'+row +' > .price-div > .price'+row).val(price);
            $('.control-panel-'+row +' > .image-div > .imageText'+row).val(image);
            $('.control-panel-'+row +' > .image-div > .imageFileText'+row).val(filePath);
            $('.control-panel-'+row +' > .image-div > .image'+row+' img').attr("src", displayImage);
            $('#value-data-'+row).trigger("liszt:updated");
        });
    });

    $(document).on("click","#cancel-changes",function (){
        resetControlPanel(true);
    });
})( jQuery );
// END of Manipulating of additional attributes

/**
 * Loading Brand Search Feature
 */
var currentRequest = null;
 
(function($) {
 
    $('#brand_search_drop_content').hide();
    $(document).on('keyup','#brand_sch',function(){
        $('#prod_brand').val(0).trigger( "change" ) 
        $(".brand_sch_loading").hide();
        var searchQuery = $(this).val().trim();
        if(searchQuery != ""){
            currentRequest = $.ajax({
                type: "GET",
                url: '/product_search/searchBrand',
                data: "data="+searchQuery, 
                beforeSend : function(){
                    if(currentRequest != null) {
                        currentRequest.abort();
                    }
                },
                success: function(response) {
                    currentRequest = null;
                    var obj = $.parseJSON(response);
                    var html = '<ul>';
                    if((obj.length)>0){
                        $('.brand_sch_drop_content').show();
                        $.each(obj,function(){
                            html += '<li class="brand_result" data-brandid="'+(this.id_brand) +'">'+(this.name)+'</li>';
                        });
                        html += '<li class="add_brand blue">Use <span style="font-style:italics;">'+searchQuery+'</span> as the brand of your listing</li>';
                        $(".brand_sch_loading").hide();
                    }
                    else{
                        $("#brand_search_drop_content").hide();
                        addNewBrand();
                    }
                    html += '</ul>';
                    $("#brand_search_drop_content").html(html);

                    if(!$("#brand_sch").is(":focus")){
                        var available = false;
                        $('#brand_search_drop_content li.brand_result a').each(function(){
                            if($(this).text().toLowerCase() ===  $('#brand_sch').val().toLowerCase()){
                                $(this).click();
                                available = true;
                                return false;
                            }
                        });
                        if(!available){
                            addNewBrand();
                        }
                    }
                }
            });
        }
    });

    $('#brand_search_drop_content').on('click', 'li.brand_result', function(){
        $this = $(this);
        $('#prod_brand').val($this.data('brandid')).trigger( "change" );
        $("#brand_sch").val($this.text()).trigger( "change" ); 
        $('#brand_search_drop_content').empty().hide(); 
        $(".brand_sch_loading").html('<img src="/assets/images/check_icon.png" />').show().css('display','inline-block');
    });

    $(document).on("click",".add_brand", function(){
        if(currentRequest != null){
            currentRequest.abort();
        }

        if($('#brand_sch').val().trim() != ""){
            addNewBrand();
        }

        $('#brand_search_drop_content').hide();
    });

    $('#brand_sch').focusout(function(){
        var available = false;
        var $this = $(this);
        var brandValue = $this.val();
        var $searchDrop = $('#brand_search_drop_content li.brand_result');

        if(brandValue.trim() != ""){
            $searchDrop.each(function(){
                if($searchDrop.text().toLowerCase() ===  brandValue.toLowerCase()){
                    $searchDrop.click();
                    available = true;
                    return false;
                }
                if(!available){
                    addNewBrand();
                }
            });
        }
    });

    $('#brand_sch').focus(function() { 
        $('#brand_search_drop_content').show();
        $(document).bind('focusin.brand_sch_drop_content click.brand_sch_drop_content',function(e) {
            if ($(e.target).closest('#brand_search_drop_content, #brand_sch').length) return;
            $('#brand_search_drop_content').hide();
        });
    });

    function addNewBrand(){
        $('#prod_brand').val(1)
        $('#prod_brand').trigger( "change" ); 
        $(".brand_sch_loading").html('<img src="/assets/images/img_new_txt.png" />').show().css('display','inline-block');
    }
})( jQuery );
// BRAND SEARCH END

// ES_UPLOADER BETA
var canProceed = true; 
var removeThisPictures = []; 
var imageAttr = [];
var pictureCountOther  = 0; 
var primaryPicture = 0;

var filescnt = 1;
var imageCustom =  []; 
var response;
var filescntret;
var currentCnt;

var imageObject = [];
var cropCurrentCount;
var arrayUpload = [];
var afstart = [];
var afTemp = [];
var imageName = "";
var errorValues = ""; 
var sizeList = [];
var extensionList = [];
var imageCollection = [];
var base64collection = [];
var totalCropImage;
var imageTage; 
var default_upload_image = config.assetsDomain+'assets/images/img_upload_photo.jpg';
var universalExtension = ".jpeg";

(function($) {
  
    if(window.FileReader){
        badIE = false;
        $('#inputList').append('<input type="file" id="files" class="files active" name="files[]" multiple accept="image/*" required = "required"  />');
    }
    else{
        badIE = true;
        $('#inputList').append('<input type="file" id="files" class="files active" name="files[]" accept="image/*" required = "required"  />');
    }

    $(".labelfiles").click(function(){
        $('.files.active').click(); 
    });

    var cropImage = function($input)
    {
        totalCropImage = imageObject.length; 
        var targetImage = imageObject[cropCurrentCount];
        var currentExtension = extensionList[cropCurrentCount];
        var currentSize = sizeList[cropCurrentCount];

        if((currentExtension == 'gif' 
            || currentExtension == 'jpg' 
            || currentExtension == 'png' 
            || currentExtension == 'jpeg') 
            && currentSize < maxImageSize){ 
            $('.imageContainer > #imageTag').attr('src',targetImage);
            $("<img/>") // Make in memory copy of image to avoid css issues
                .attr("src", $('.imageContainer > #imageTag').attr("src"))
                .load(function() { 
                    $('#crop-image-main').dialog({
                        resizable: false,
                        "resize": "auto",
                        width: 'auto',
                        modal: true,
                        fluid: true,
                        buttons: {
                            "Crop": function() { 
                                base64collection.push(imageTag.cropper("getDataURL", 'image/jpeg')); 
                                af.push(afTemp[cropCurrentCount]);
                                cropCurrentCount++;
                                $(this).dialog("close"); 
                                if(cropCurrentCount < totalCropImage){
                                    cropImage($input);
                                }
                                else{
                                    triggerUpload();
                                    $(".files").hide();
                                    $(".files.active").each(function(){
                                        $(this).removeClass('active');
                                    });
                                    $('#inputList').append('<input type="file"  id="files" class="files active" name="files[]" multiple accept="image/*" required = "required"  /> ');
                                    $input.remove();
                                }
                            }
                        },
                        open: function() {
                            $(this).parent().addClass('pop-up-fixed');
                            newCropper();
                        },
                        close: function(){
                            $('.imageContainer > #imageTag').attr('src', '');
                            imageTag.cropper("destroy");
                            imageTag = null;
                        },
                        "title": "Crop your image"
                    });
                });
        }
        else{ 
            af.push(afTemp[cropCurrentCount]);
            cropCurrentCount++;
            if(cropCurrentCount < totalCropImage){
                cropImage($input);
            }
            else{
                triggerUpload();
                $(".files").hide();
                $(".files.active").each(function(){
                    $(this).removeClass('active');
                });
                $('#inputList').append('<input type="file"  id="files" class="files active" name="files[]" multiple accept="image/*" required = "required"  /> ');
                $input.remove();
            }
        }
    } 

    function newCropper()
    {
        var widthRatio = 445;
        var heightRatio = 538;
        $(".imageContainer").css({
            width: widthRatio,
            height: heightRatio,
        })
        var imageContainerWidth = $(".imageContainer").width(); 
        imageTag = $(".imageContainer > #imageTag");  
        imageTag.cropper({ 
            aspectRatio: widthRatio / heightRatio,
            minContainerWidth: 10,
            minContainerHeight: 10,
            autoCropArea: 1,
            multiple: false,
            dragCrop: false,
            dashed: false,
            movable: false, 
            resizable: false,
            dashed: true,
            responsive: true,
        });
    } 

    $(document).on('click','.zoomIn',function(e){ 
        imageTag.cropper("zoom", 0.2);
    });

    $(document).on('click','.zoomOut',function(e){ 
        imageTag.cropper("zoom", -0.2);
    });

    $(document).on('click','.rotateRight',function(e){ 
        imageTag.cropper("rotate", 90); 
    });

    $(document).on('click','.rotateLeft',function(e){ 
        imageTag.cropper("rotate", -90);
    });

    $(document).on('click','.refresh',function(e){
        imageTag.cropper("reset");
    });

    $(document).on('click','.ui-dialog-titlebar-close',function(e){
            af.push(afTemp[cropCurrentCount]); 
            cropCurrentCount++;
            while(cropCurrentCount < totalCropImage){
                af.push(afTemp[cropCurrentCount]);
                cropCurrentCount++;
            }
            $.each( arrayUpload, function( key, value ) {
                removeThisPictures.push(value); 
                $('#previewList'+value).remove();
            }); 
            canProceed = true;  
    });

    function triggerUpload()
    {
        startUpload(pictureCount,filescnt,arrayUpload,afstart,imageName,errorValues);
        filescnt++;
    }

    function startUpload(cnt,filescnt,arrayUpload,afstart,imageName,errorValues){
        var uploadUrl = badIE ? '/productUpload/fallBackUploadimage' : '/productUpload/uploadimage';
        canProceed = false; 
        $('.counter').val(cnt); 
        $('.filescnttxt').val(filescnt); 
        $('#afstart').val(JSON.stringify(afstart)); 
        $("#imageCollections").val(JSON.stringify(base64collection));
        $('#form_files').ajaxForm({
            url: uploadUrl,
            type: "POST", 
            dataType: "json",
            xhr: function(){
                var xhr = new window.XMLHttpRequest();
                xhr.upload.addEventListener("progress", function(evt){
                    if (evt.lengthComputable) {
                        var percentComplete = evt.loaded / evt.total * 100.0;
                        $('.loading-text').html(parseFloat(percentComplete).toFixed(2) + ' %');
                    }
                }, false);
                return xhr;
            },
            beforeSubmit : function(arr, $form, options){ 
                $('<input type="hidden">').attr({
                    id: 'pictureName',
                    name: 'pictureName',
                    value: imageName
                }).appendTo('#form_files');
                arr.push({name:'pictureName', value:imageName});
            },
            success :function(d) {
                filescntret = d.fcnt;
                $('.filescnt'+filescntret+' > .loadingfiles').remove();
                $('.filescnt'+filescntret+' > span').removeClass('loading_opacity');
                $('.filescnt'+filescnt+' > .makeprimary').show(); 
                $('.filescnt'+filescnt+' > .removepic').show(); 
                $('.filescnt'+filescnt+' > .loading-text').hide(); 
                canProceed = true; 
                if(d.err == '1'){ 
                    alert(d.msg, "The following files cannot be uploaded: <br>" + errorValues);
                    $.each( arrayUpload, function( key, value ) {
                        removeThisPictures.push(value); 
                        $('#previewList'+value).remove();
                    });
                }
                else{
                    $.each( imageCollection, function( key, value ) {
                        $('#previewList'+value.picture_count + ' > span > img')
                            .attr("src",'/'+tempDirectory+'/categoryview/'+value.image_name);
                    });
                }
                if(badIE == true){ 
                    if(d.err != '1'){
                        $.each( arrayUpload, function( key, value ) {
                            $('#previewList'+value + ' > span > img').attr("src",'/'+tempDirectory+'/categoryview/'+d.imageName); 
                            $('#previewList'+value + ' > .loadingfiles').remove();
                        });
                    } 
                    $(".files").remove();
                    $('#inputList').append('<input type="file"  id="files" class="files active" name="files[]" accept="image/*" required = "required"  /> ');
                }
                $('#form_files > #pictureName').remove();
            },
            error: function (request, status, error) {

                alert('Sorry, we have encountered a problem.<br>\
                    Please select valid image type. <br>\
                    Allowed type: .PNG,.JPEG,.GIF <br>\
                    Allowed max size: 5mb.<br>\
                    Allowed max dimension 5000px');
                
                $.each( arrayUpload, function( key, value ) {
                    removeThisPictures.push(value); 
                    $('#previewList'+value).remove();
                });

                canProceed = true;
                if(badIE == true){
                    $(".files").remove();
                    $('#inputList').append('<input type="file"  id="files" class="files active" name="files[]"  accept="image/*" required = "required"  /> ');
                }
                $('#form_files > #pictureName').remove();
            }

        }); 
        $('#form_files').submit();
    }

    $(document).on('change',".files.active",function (e){
        arrayUpload = [];
        afstart = [];
        afTemp = [];
        imageObject = []; 
        base64collection = [];
        sizeList = [];
        extensionList = [];
        imageCollection = [];
        errorValues = "";
        cropCurrentCount = 0;

        if(badIE == false){
            var fileList = this.files;
            var anyWindow = window.URL || window.webkitURL;
            for(var i = 0; i < fileList.length; i++){
                var arraySet = {};
                var activeText= ""; 
                var primaryText = "Make Primary"; 
                var size = fileList[i].size
                var val = fileList[i].name;
                var extension = val.substring(val.lastIndexOf('.') + 1).toLowerCase();
                var objectUrl = anyWindow.createObjectURL(fileList[i]); 
                pictureInDiv = $("#list > div").length;

                if(pictureInDiv == 0){
                    primaryText = "Your Primary";
                    activeText = "active_img";
                    primaryPicture = pictureCount;
                }

                if((extension == 'gif' || extension == 'jpg' || extension == 'png' || extension == 'jpeg') && size < maxImageSize){
                    $('#list').append('<div id="previewList'+pictureCount+'" class="new_img upload_img_div '+activeText+' filescnt filescntactive filescnt'+filescnt+'">\
                        <span class="upload_img_con loading_opacity"><img src="'+objectUrl+'"></span>\
                        <a href="javascript:void(0)" class="removepic" data-number="'+pictureCount+'">x</a><br>\
                        <span class="loading-text">0 %</span>\
                        <a href="javascript:void(0)" class="makeprimary photoprimary'+pictureCount+'" data-number="'+pictureCount+'">'+primaryText+'</a>\
                        <div class="loadingfiles"></div>\
                        </div>');
                    $('.filescnt'+filescnt+' > .makeprimary').hide(); 
                    $('.filescnt'+filescnt+' > .removepic').hide();
                }
                else{
                    if(size < maxImageSize){
                        errorValues += val + "\n(Invalid file type).\n<br>";
                    }
                    else{
                        errorValues += val + "\n(The file size exceeds 5 MB).\n<br>";
                    }
                    removeThisPictures.push(pictureCount);
                }

                imageName = tempId+'_'+memberId+'_'+fulldate+pictureCount+'.'+extension;
                var newName = tempId+'_'+memberId+'_'+fulldate+pictureCount+universalExtension;
                arraySet['picture_count'] = pictureCount;
                arraySet['image_name'] = newName;
                imageCollection.push(arraySet);
                afTemp.push(newName+'||'+extension);
                afstart.push(imageName);
                arrayUpload.push(pictureCount);
                imageObject.push(objectUrl);
                sizeList.push(size);
                extensionList.push(extension);
                pictureCount++;
            }
            cropImage($(this));
        }
        else{
            var activeText= ""; 
            var primaryText = "Make Primary"; 
            var val = $(this).val();
            pictureInDiv = $("#list > div").length;

            if(pictureInDiv == 0){
                primaryText = "Your Primary";
                activeText = "active_img";
                primaryPicture = pictureCount;
            }

            var id = "imgid" + pictureCount;
            imageCustom = document.getElementById('files').value;
            var filename = imageCustom.match(/[^\/\\]+$/);
            extension = val.substring(val.lastIndexOf('.') + 1).toLowerCase();
            imageName = tempId+'_'+memberId+'_'+fulldate+pictureCount+'.'+extension; 
            af.push(imageName+'||'+extension); 
            afstart.push(imageName); 
            arrayUpload.push(pictureCount);  

            switch(extension){
                case 'gif': case 'jpg': case 'png': case 'jpeg':
                    $('#list').append('<div id="previewList'+pictureCount+'" class="new_img upload_img_div '+activeText+' filescnt filescntactive filescnt'+filescnt+'"><span class="upload_img_con"><img src="'+imageCustom+'" alt="'+filename+'" style="height:100px;"></span><a href="javascript:void(0)" class="removepic" data-number="'+pictureCount+'">x</a><br><a href="javascript:void(0)" class="makeprimary photoprimary'+pictureCount+'" data-number="'+pictureCount+'">'+primaryText+'</a><div class="loadingfiles"></div></div>');   
                    $('.filescnt'+filescnt+' > .makeprimary').hide(); 
                    $('.filescnt'+filescnt+' > .removepic').hide(); 
                    pictureCount++;
                break;
                default:
                    alert('Invalid file type. Please choose another image.');
                    removeThisPictures.push(pictureCount); 
                    pictureCount++;
                    return false;
                break;
            }

            $(".files").hide();  
            $(".files.active").each(function(){
                $(this).removeClass('active');
            });

            startUpload(pictureCount,filescnt,arrayUpload,afstart,imageName,filename);
            filescnt++;
        }
    });

    $(document).on('click','.remove-attr-image',function(e){
        var selector = $(this);
        currentCnt = selector.data('cnt');
        $('.imageText'+currentCnt).val('');
        $('.imageFileText'+currentCnt).val('');
        $('.image'+currentCnt+' > img,.pop-image-container > a > img').attr("src",default_upload_image);
        $("#other_files")[0].reset();
    });

    $(document).on('click',".attr-image",function (e){
        var selector = $(this);
        currentCnt = selector.data('cnt');
        $("#other_files")[0].reset();
        $('.attr-image-input').click();
    });

    $(document).on('click',".select-image",function (e){   
        var cnt = $(this).data('cnt');   
        var img = $('.image'+cnt).children('img').attr("src");
        $('.pop-image-container > a > img').attr("src", img);
        $('.pop-image-container > a,.pop-image-remove-container > a').data('cnt', cnt); 
        $('#pop-image').modal({
            escClose: false,
            containerCss:{
                maxHeight: 400,
                minHeight: 400,
            },
            persist: true
        });
        $("#pop-image").parents("#simplemodal-container").addClass("prod-upload-con");
    });

    var cropImageOther = function(imageCustom, picName)
    { 
        $('.imageContainer > #imageTag').attr('src',imageCustom);
        $("<img/>") // Make in memory copy of image to avoid css issues
            .attr("src", $('.imageContainer > #imageTag').attr("src"))
            .load(function() { 
                $('#crop-image-main').dialog({
                    resizable: false,
                    "resize": "auto",
                    width: 'auto',
                    modal: true,
                    fluid: true,
                    buttons: {
                        "Crop": function() {
                            base64collection.push(imageTag.cropper("getDataURL", 'image/jpeg'));  
                            triggerUploadOther(picName);
                            $(this).dialog("close");
                        }
                    },
                    open: function() { 
                        $(this).parent().addClass('pop-up-fixed');
                        newCropper();
                    },
                    close: function(){  
                        $('.imageContainer >  #imageTag').attr('src', '');
                        imageTag.cropper("destroy"); 
                        imageTag = null;
                    },
                    "title": "Crop your image"
                });
            });
    }

    function triggerUploadOther(picName)
    {
        var uploadUrl = badIE ? '/productUpload/fallBackUploadimage' : '/productUpload/uploadimageOther';
        $("#imageCollectionsOther").val(JSON.stringify(base64collection));
        $('#other_files').ajaxForm({
            url: uploadUrl,
            type: "POST", 
            dataType: "json", 
            beforeSubmit : function(arr, $form, options){
                $('<input type="hidden">').attr({
                    id: 'pictureNameOther',
                    name: 'pictureNameOther',
                    value: picName
                }).appendTo('#other_files');
                arr.push({name:'pictureNameOther', value:picName});

                $('<input type="hidden">').attr({
                    id: 'pictureCount',
                    name: 'pictureCount',
                    value: pictureCountOther
                }).appendTo('#other_files');
                arr.push({name:'pictureCount', value:pictureCountOther});
                canProceed = false;
                $('.image'+currentCnt+' > img,.pop-image-container > a > img').attr("src",'/assets/images/loading/preloader-whiteBG.gif');
            },
            uploadProgress : function(event, position, total, percentComplete) {
                canProceed = false;
                $('.image'+currentCnt+' > img,.pop-image-container > a > img').attr("src",'/assets/images/loading/preloader-whiteBG.gif');
            },
            success :function(d) {
                canProceed = true;
                if(d.result == "ok"){
                    imageAttr.push(d.imageName);
                    var imagePath = '/'+tempDirectory+'other/categoryview/'+d.imageName;
                    $('.imageText'+currentCnt).val(d.imageName); 
                    $('.imageFileText'+currentCnt).val(imagePath); 
                    $('.image'+currentCnt+' > img,.pop-image-container > a > img').attr("src", imagePath);
                    pictureCountOther++;
                }
                else{
                    alert(d.msg);
                    $('.image'+currentCnt+' > img,.pop-image-container > a > img').attr("src",default_upload_image);
                }
                $('#other_files > #pictureCount').remove();
                $('#other_files > #pictureName').remove();
                
            },
            error: function (request, status, error) {
                alert('Sorry, we have encountered a problem.<br>\
                    Please select valid image type. <br>\
                    Allowed type: .PNG,.JPEG,.GIF <br>\
                    Allowed max size: 5mb.<br>\
                    Allowed max dimension 5000px');
                $('.image'+currentCnt+' > img,.pop-image-container > a > img').attr("src",default_upload_image);
                canProceed = true;
                $('#other_files > #pictureCount').remove();
                $('#other_files > #pictureName').remove();
            }
        }).submit();
    }

    $(document).on('change',".attr-image-input",function (e){
 
        var val = $(this).val();
        var extension = val.substring(val.lastIndexOf('.') + 1).toLowerCase();
        var picName = tempId+'_'+memberId+'_'+fulldate+pictureCountOther+'o.'+extension;
        base64collection = [];

        switch(extension){
            case 'gif': case 'jpg': case 'png': case 'jpeg':
            break;
            default:
                alert('Invalid file type. Please choose another image.');
                return false;
            break;
        }

        if(badIE == false){
            var size = this.files[0].size;
            if(size > maxImageSize){
                alert('Invalid file size. Please select an image that is not larger than 5 mB in size.');
                return false;
            }
        }
        
        if(badIE == false){
            var fileList = this.files;
            var anyWindow = window.URL || window.webkitURL;
            var objectUrl = anyWindow.createObjectURL(fileList[0]); 
            cropImageOther(objectUrl, picName);
        }
        else{
            triggerUploadOther(picName)
            canProceed = false;
        }

    });


    $(document).on('click',".removepic",function (){
        var text = $(this).siblings('.makeprimary').first().text();
        var idNumber = $(this).data('number');
        removeThisPictures.push(idNumber);

        $(this).closest('.upload_img_div').remove();
        if(text === "Your Primary"){
            var first_img_div = $("#list > div:first");
            var primary_control_anchor = $("#list > div:first > .makeprimary");
            primaryPicture = 0;
            primary_control_anchor.text('Your Primary');     
            first_img_div.addClass("active_img"); 
        } 
    });

    $(document).on('click','.makeprimary',function(){
        primaryPicture = $(this).data('number'); 
        $(".makeprimary").text('Make Primary');
        $(".upload_img_div").removeClass("active_img");
        $(this).text('Your Primary');
        $(this).closest('.upload_img_div').addClass("active_img");
    });
})(jQuery);
// ES_UPLOADER BETA END

(function($) {

    // SAVING AND PROCEED 
    $(document).on('click','#proceed_form',function(){

        $('#form_product').validate({  
            rules: {
                prod_title: {
                    required: true, 
                },
                prod_price :{
                    required: true,
                    number: true,
                    range :[0.1,Infinity],
                    maxlength: 18
                },
                prod_condition: {
                    required: true
                },
                prod_description:{
                    required: true
                }
            },
            messages: {
                prod_title: "Enter title for your listing",
                prod_condition: "Select condition",
                prod_price: {
                    required: "Enter a valid price",
                    range : "Price must not be less than 0"
                }
            },
            errorClass: "errorTxt",
            validClass: "validateTxt",
            highlight: function( element, errorClass, validClass ) { 
                validateRedTextBox(element);
            },
            unhighlight: function( element, errorClass, validClass ) { 
                validateWhiteTextBox(element);

            }
        });

        if( !$.trim( $('.list-choosen-combination-div').html() ).length ) {
            var qtySelector = $(".select-control-panel-option > .div1 > .qty");
            var soloQty = parseInt(qtySelector.val());
            if( soloQty <= 0 || $.isNumeric(soloQty) == false || soloQty > maxQuantity){
                validateRedTextBox(qtySelector);
                qtySelector.focus();
                return false;
            }else{
                validateWhiteTextBox(qtySelector);
            }
        }
        else{
            error = 0;
            $(".list-choosen-combination-div > .div-combination > .div1 > .qty").each(function() {
                var combinationQuantity = parseInt($(this).val()); 
                if( combinationQuantity <= 0 || $.isNumeric(combinationQuantity) == false || combinationQuantity > maxQuantity){
                    validateRedTextBox(this);
                    this.focus();
                    error++;
                }else{
                    validateWhiteTextBox(this);
                }
            });
            if(error > 0){
                return false;
            }  
        }

        tinyMCE.triggerSave();   
        if($('#prod_description').val().length <= 0){
            validateRedTextBox('.mce-tinymce');
            tinymce.execCommand('mceFocus',false,'prod_description');
            return false; 
        }
        validateWhiteTextBox('.mce-tinymce');
        
        if(canProceed == false){
            alert('Please wait while your images are uploading.');
            return false;
        }

        window.onbeforeunload=null;
        $('.arrayNameOfFiles').val(JSON.stringify(af));
        proceedStep3('processing');
        $('#form_product').submit();
    });

    // back to step1 
    $(document).on('click','.step1_link',function(){
        if(currentRequest != null) {
            $('#prod_brand').val(1)
            $('#prod_brand').trigger( "change" );
        }
        confirm_unload = false;
        saveAsDraftProceed();
        $('#edit_step1').submit();
    });

    function disableF5(e) { if ((e.which || e.keyCode) == 116) e.preventDefault(); };
    // To disable f5
    /* jQuery < 1.7 */
    $(document).bind("keydown", disableF5);
    /* OR jQuery >= 1.7 */
    $(document).on("keydown", disableF5);

    var confirm_unload = true;
    window.onbeforeunload = function (e) { 
        if(confirm_unload){ 
            if(isEdit == 1){
                saveAsDraftProceed(); 
            }
        }
    };
 
    $(window).data('beforeunload',window.onbeforeunload);  

    $(document).on('mouseover mouseout','a[href="javascript:void(0)"]', function(event) {
        if (event.type == 'mouseover') {
            window.onbeforeunload=null;
        }
        else{
            window.onbeforeunload=$(window).data('beforeunload');
        }
    });

    $(document).on('click', '.prevent', function(event){
        confirm_unload = false;
        var loc = $(this).attr("href");
        event.preventDefault(); 
        askDraft(loc);
    });

})( jQuery );

