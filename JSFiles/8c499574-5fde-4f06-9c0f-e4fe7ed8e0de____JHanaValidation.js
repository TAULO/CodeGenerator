/*****************************************************************************
 * 파일명 : JHanaValidation.js
 * 작성일 : 2007. 12. 28
 * 작성자 : ork
 * 설   명 : Field Validation 관련 클래스 모음
 * Dependency  : prototype.js , ext-base.js , ext-all.js , pbk-package.js
 * 메세지효과를 위하여 ExtJs 아래 정의 되어야 합니다.
 *
 * ===========================================================================
 * 변경이력:
 * DATE				AUTHOR		DESCRIPTION
 * ---------------------------------------------------------------------------
 * 2007.12.28	Oh,Ryunkyong 	Initial
 * 2008.02.15   Kim,Sangjun     기능 추가
 * 2008.02.21   Kim,Sangjun     JNumber 에 limitLength 추가
 * 2008.03.01   Kim,Sangjun     JCurrency 추가
 * 2008.03.01   Kim,Sangjun     입력 금지 문구 추가 hana.validation.banChar
 * 2009.03.04   Kim,Sangjun     JDateLimit 추가
 * 2009.03.09   Kim,Sangjun     사용자 메세지 정의로직 추가
 * 2009.03.19   Kim,Sangjun     JText 에 품목명 체크로직 추가
 * 변경 이력은 이곳에 추가 합니다.
 *****************************************************************************/

/**
 * Class 명 : JMessage
 * 설명 : 에러메세지 관리
 */
hana.JMessage = function () { // 생성자 메소드
	/* Member field */
    this.init;
    this.messages;
};

hana.JMessage.prototype = {
	/* Member method */

    initMsgs : function() {
        if (!this.init) {
	        this.messages = new Array();
	        this.messages["JSM-1001"] = "저장하시겠습니까?";
	        this.messages["JSM-1002"] = "아이디";
	        this.messages["JSM-1003"] = "삭제하시겠습니까?";
	        this.messages["JSM-1004"] = "{0} 입력해야 합니다.";
			this.messages["JSM-1005"] = "{0} {1}자리 입니다.";
	        this.messages["JSM-1006"] = "{0} {1}자리 이상 {2}자리 이하여야 합니다";
	        this.messages["JSM-1007"] = "{0}에는 다음({1}) 특수 문자는 입력할 수 없습니다";
	        this.messages["JSM-1008"] = "{0}에는 숫자만을 입력해야 합니다";
	        this.messages["JSM-1009"] = "{0}의 숫자는 {1}이여야 합니다";
	        this.messages["JSM-1010"] = "{0}의 숫자는 {1} {2} 사이여야 합니다";
	        this.messages["JSM-1011"] = "{0} 선택해야 합니다";
	        this.messages["JSM-1012"] = "선택할 수 있는 {0}의 수는 {1}개 입니다";
	        this.messages["JSM-1013"] = "선택할 수 있는 {0}의 수는 {1} ~ {2}개 사이여야 합니다";
	        this.messages["JSM-1014"] = "{0}의 금액은 {1} 이여야 합니다";
	        this.messages["JSM-1015"] = "{0}의 금액는 {1} {2} 사이여야 합니다";
	        this.messages["JSM-1016"] = "{0} 올바르게 입력하여 주십시오";
	        this.messages["JSM-1017"] = "입력하신 {0} 전자우편주소로 유효하지 않습니다.<br/> 다시 입력하여 주십시오!";
			this.messages["JSM-1018"] = "{0} 올바른 날짜가 아닙니다. 확인하여 주세요";
	        this.messages["JSM-1019"] = "{0}의 날짜는 {1} 이전 이어야 합니다";
	        this.messages["JSM-1020"] = "{0}의 날짜는 {1} 이후 이어야 합니다";
	        this.messages["JSM-1021"] = "선택할 수 있는 {0}의 날짜는 {1} {2} 사이여야 합니다";
	        this.messages["JSM-1022"] = "올바른 파일명이 아닙니다. 파일을 다시 입력해 주시기 바랍니다";
	        this.messages["JSM-1023"] = "{0}에 대한 파일을 첨부해야 합니다";
	        this.messages["JSM-1024"] = "{0}에 대한 첨부 가능한 파일의 확장자는 {1} 입니다";
	        this.messages["JSM-1025"] = "{0}에 대하여 확장자가 {1}인 파일은 첨부가 금지되어 있습니다";
	        this.messages["JSM-1026"] = "입력하신 {0} Crontab 표현식으로 유효하지 않습니다.<br/> 다시 입력하여 주십시오!";
	        this.messages["JSM-1027"] = "{0}의  {1} 올바른 속성 표현식이 아닙니다";
	        this.messages["JSM-1028"] = "{0}의 속성  {1} 필요합니다";
	        this.messages["JSM-1029"] = "관련 답글도 함께 삭제됩니다. 삭제하시겠습니까?";
	        this.messages["JSM-1030"] = "입력하신 {0} 전화번호 형식에 맞지 않습니다.<br/> 다시 입력하여 주십시오";
	        this.messages["JSM-1031"] = "입력하신 {0} 한글만 입력 할 수 있습니다.<br/> 다시 입력하여 주십시오";
	        this.messages["JSM-1032"] = "입력하신 {0} 영어만 입력 할 수 있습니다.<br/> 다시 입력하여 주십시오";
	        this.messages["JSM-1033"] = "{0}의 자리수는 {1}자 이여야 합니다";
	        this.messages["JSM-1034"] = "{0}의 자리수는 {1}자에서 {2}자 사이여야 합니다";
            this.messages["JSM-1035"] = "입력하신 {0}의 번호와 {1}의 번호가 일치하지않습니다.<br/> 다시 입력하여 주십시오";
            this.messages["JSM-1036"] = "{0} {1}원 이상 {2}원 이하로 가능합니다.";
			this.messages["JSM-1036-TRANS"] = "출금계좌의 지급가능잔액이 부족합니다.";
            this.messages["JSM-1036-FOR"] = "{0} [{1}] {2}{4} 이상 {3}{4} 이하로 가능합니다.";
            this.messages["JSM-1037"] = "{0} {1}원 이상 {2}원 이하 만원단위로 가능합니다.";
            this.messages["JSM-1038"] = "{0} {1}원 이상 가능합니다.";
            this.messages["JSM-1039"] = "{0}에 데이터가 없습니다.";
            this.messages["JSM-1040"] = "{0}에 데이터를 선택해 주세요";
            this.messages["JSM-1041"] = "{0}에 입력 금지 문구인 <font color='red'>{1}</font> (이)가 들어있습니다.<br/> 다시 입력하여 주십시오";
            this.messages["JSM-1042"] = "{0}행 {1}열 {2} {3}";
            this.messages["JSM-1043"] = "입력하신 {0} 사업자번호 형식에 맞지 않습니다.<br/> 다시 입력하여 주십시오";
            this.messages["JSM-1044"] = "{0) {1}이여야 합니다";
            this.messages["JSM-1045"] = "{0} {1} {2}사이여야 합니다";
            this.messages["JSM-1046"] = "{0} 최대 {1}입니다. {2} 조정하여 주십시오.";
            this.messages["JSM-1047"] = "부적절한 {0}입니다.";
            this.messages["JSM-1048"] = "{0}의 내용중 개인정보로 보이는 내용이 있어 입력 불가합니다.[{1}]";
            this.init = true;
        }
    },

    get : function(id, args) {
        //init 실행
        this.initMsgs();

        var message = this.messages[id];


        if (!message) {
	        return id;
	    }

        if (args) {

            try{
                if (typeof args == "object" && args.length) {
                    for (var i = 0; i < args.length; i++) {
                        var pattern = new RegExp("\\{" + i + "\\}", "g");
                        message = message.replace(pattern, args[i]);
                    }
                } else {
                    message = message.replace(/\{0\}/g, args);
                }
            }catch(e){}
        }

        return message;
	},

    /**
     * 메세지 설정
     * @param id 메세지 ID
     * @param msg 출력 할 메세지
     */
    set : function(id, msg){
        //init 실행
        this.initMsgs();

        this.messages[id] = msg;
    },

    /**
	 * 화면단에 메세지박스를 ExtJS로 구현한다.
	 * @param {Object} obj 메세지박스가 펼쳐질때 애니메이션이 시작할 오브젝트
	 * @param {Object} id 출력할 메세지패턴 아이디
	 * @param {Object} args 메세지패턴에 등록할 데이터
	 * @param {Object} isFocus 애니메이션이 시작할 오브젝트에 포커스선택 여부
	 */
	alert : function(obj, id, args, isFocus) {
		var alertMsg = this.get(id, args);

        //에러 메세지 초기화
        this.init = false;

        var clickObj = null;
        if(isFocus) {
        	clickObj = obj;
        }
		opb.common.layerpopup.openMessage_fnc({ 
        	isConfirm: false,
        	title: '입력오류',
        	message: alertMsg,
			clickObj : clickObj
        });
    }

};
var messages = new hana.JMessage();

/** #. start JForm control **/
/**
 * Class 명 : JForm
 * 설명 : Form 관리
 */
hana.JForm = function() { // 생성자 메소드
    /* Member field */
    this.children = new Array();
};

hana.JForm.prototype = {
	/* Member method */
	add : function(child) {
	    this.children[this.children.length] = child;
	    return this;
	},
	validate : function() {
	    for (var i = 0; i < this.children.length; i++) {
	        if (!this.children[i].validate()) {
	        	if((window.location.href).indexOf('/cms/voc/') > -1){
	        		if((jQuery("#"+this.children[i].object.id).closest("td").attr("class")+"").indexOf("selBox") > -1){
	        			jQuery("#"+this.children[i].object.id).closest("td").addClass("err");
	        		}else{
	        			jQuery("#"+this.children[i].object.id).addClass("err");
	        		}
	        	}
	        	
	            return false;
	        }
	    }
	    return true;
	}
};
/** #. end JForm control **/

/** #. start JText control TYPE에 따라 추가 정의한다. **/
/**
 * Class 명 : JText
 *
 * 설명 : text 타입 관리
 * validate method를 제외한 나머지는 모두 chained method 입니다.
 *
 * 사용 예 :
 * new hana.JText('이름', formObj.name).nullable().range(4,10).isEnglish()
 * 위 소스는 name 필드에 빈값이 올 수 있으며 4,10자 사이의 영어만 입력 할 수 있도록
 * 설정한 내용입니다.
 *
 * filter method 를 통해 특수문자입력을 filtering 합니다.
 *
 * checkRegExp method 는 정규식을 통한 체크를 가능하게 해줍니다.
 * 하지만 사용을 위해선 메세지를 설정 해야 합니다.
 *
 * @param {String} name
 * @param {HTMLElement} object
 */
hana.JText = function (name, object) {
    /* Member Field */
    this.name = name;
    this.object = object;

    this.min;
    this.max;

    this.nullCheck = true;
    this.rangeCheck = false;
    this.filterCheck = false;
    this.denyCharCheck = false;
    this.regExpCheck = false;
    this.juminCheck = false;
    
    this.juminCheckType = 1;
    this.pattern;
    this.filterPattern = "`~!@#$%^&*'\"/|";
	this.messageCode = "JSM-1004";
    this.messageParam = [name];
    
    
    this.nullable = hana.validation.nullable;
    this.range = hana.validation.range;
    this.jumiNo = hana.validation.juminNo;

    this.setMsg = hana.validation.setMsg;
};
hana.JText.prototype =  {
    /* Member Method */
	/**
	 * 문자열 타입 유효성 검사
	 */
    validate : function(){
 
        //에러 메세지 설정
        if(this.isSetMsg)
            messages.set(this.id, this.msg);


        var value = this.object.value;

        if (this.nullCheck && hana.validation.isNull(value)) {
	        return messages.alert(this.object, "JSM-1004", hana.validation.ul(this.name), true);
	    }

        if (this.regExpCheck && !hana.validation.isNull(value) && !this.pattern.test(value) ){
            return messages.alert(this.object, this.messageCode, this.messageParam, true);
        }

        if (this.rangeCheck && !hana.validation.isNull(value) && !hana.validation.checkCharacterSize(value, this.min, this.max)) {
	        if (this.min == this.max) {
	            return messages.alert(this.object, "JSM-1005", [hana.validation.un(this.name), this.min], true);
	        } else {
	            return messages.alert(this.object, "JSM-1006", [hana.validation.un(this.name), this.min, this.max], true);
	        }
	    }

        if (this.filterCheck && hana.validation.isExistSpacialChar(value, this.filterPattern) ){
            return messages.alert(this.object, "JSM-1007", [this.name, this.filterPattern], true);
        }

        //품목명 검증
        if (this.denyCharCheck){
            var message = hana.validation.getExistDenyCharArr(value);

            if( message.length > 0 ){
                messages.alert(this.object, "JSM-1041", [this.name, message.join(", ")], true);
                return false;
            }

            //부적절한 품목명인지 체크합니다.
            if(hana.validation.isInCorrectRpsMitmNm(value)){
                messages.alert(this.object, "JSM-1047", [this.name], true);
                return false;
            }

        }
        
        //주민번호 체크
        if(this.juminCheck){
            var juminNoMsg = hana.JHanaUtils.util.isStringWithJuminNo(value, this.juminCheckType);
            if(juminNoMsg != ""){
                messages.alert(this.object, "JSM-1048", [this.name, juminNoMsg], true);
                return false;
            }
        }

        return true;
	},

    /**
	 * 전화번호 형식 체크함.
	 * ex) 02-523-5353, 023.3552.2353, 02 202 4024, 0324236450
	 * 주의: 구분자가 없을 경우 정확한 전화번호를 체크할 수 없음
	 */
    isTelnum : function() {
        this.checkRegExp( new RegExp("^(02|031|032|033|041|042|043|051|052|053|054|055|061|062|063|064|070|010|011|015|016|017|018|019)[-. ]?[0-9]{3,4}[-. ]?[0-9]{4}$","g"), "JSM-1030", hana.validation.un([this.name]));
        return this;
	},

    /**
	 * 이메일 형식 체크함.
	 */
    isEmail : function() {
	    this.checkRegExp( new RegExp("^[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,4}$","ig"), "JSM-1017", hana.validation.un([this.name]));
        return this;
	},

    /**
	 * 한글 형식체크함. 한글만 존재 해야함. (공백 불가능)
	 */
    isKorean : function() {
	    this.checkRegExp( new RegExp("^[가-힝]+$","g"), "JSM-1031", hana.validation.un([this.name]));
        return this;
	},

    /**
	 * 영어 형식체크함. 영어만 존재 해야함. (공백, ',', '.', '_' 가능)
	 */
    isEnglish : function() {
	    this.checkRegExp( new RegExp("^[A-Z0-9.,_\\s]+$","ig"), "JSM-1032", hana.validation.un([this.name]));
        return this;
	},

    /**
	 * 사업자번호 형식체크함. 000-00-00000, 0000000000
	 */
    isBizNo : function() {
	    this.checkRegExp( new RegExp("^[0-9]{3}-?[0-9]{2}-?[0-9]{5}-?$","ig"), "JSM-1043", hana.validation.un([this.name]));
        return this;
	},


    /**
     * 정규식을 인자로 받아서 체크한다.
     * 메세지 정의 필요합니다.
     *
     * @param reg 정규식
     * @param msgCd 메세지 코드
     * @param msgParam 메세지 param
     */
    checkRegExp : function(reg, msgCd, msgParam) {
	    this.regExpCheck = true;
        this.pattern = reg;
        this.messageCode = msgCd;
        this.messageParam = msgParam;
        return this;
	},

    /**
     * 특수문자 허용안함
     * `~!@#$%^&*'\"
     */
    filter : function (pattern){
		if( pattern ){
			this.filterPattern = pattern;
		}
        this.filterCheck = true;
        return this;
    },

    /**
     * 입력 금지 문구 체크여부
     */
    denyChar : function (){
        this.denyCharCheck = true;
        return this;
    }
};
/** #. end JText**/

/** #. start JNumber control TYPE에 따라 추가 정의한다. **/
/**
 * Class 명 : JNumber
 *
 * 설명 : number 타입 관리
 * validate method를 제외한 나머지는 모두 chained method 입니다.
 *
 * 사용 예 :
 * new hana.JNumber('나이', formObj.age).nullable().range(1,999)
 * 위 소스는 age 필드에 숫자만 입력 가능하고 빈값이 올 수 있으며 1~999 까지의 숫자만 입력
 * 할 수 있도록 설정한 내용입니다.
 *
 * @param {String} name
 * @param {HTMLElement} object
 * @param {String} 생성될 hidden 필드명
 */
hana.JNumber = function(name, object, targetElId){
    /* Member Field */
    this.name = name;
    this.object = object;
    this.targetElId = targetElId;

    this.nullCheck = true;
    this.rangeCheck = false;
    this.lengthCheck = false;

    this.min;
    this.max;

    this.minlength;
    this.maxlength;

    this.nullable = hana.validation.nullable;
    this.range = hana.validation.range;

    this.setMsg = hana.validation.setMsg;
};
hana.JNumber.prototype = {
	/* Member Method */
	/**
	 * Number타입 유효성 검사
	 */
	validate : function(){

        //에러 메세지 설정
        if(this.isSetMsg)
            messages.set(this.id, this.msg);

        var value = this.object.value;

        //nullcheck
        if (this.nullCheck && hana.validation.isNull(value) ) {
	        messages.alert(this.object, "JSM-1004", hana.validation.ul(this.name), true);
	        return false;
	    }

        // null 이 아닌 경우 숫자인지 체크
	    if (isNaN(value)) {
	        messages.alert(this.object, "JSM-1008", this.name, true);
	        return false;
	    }

        //범위 체크 ex) 1~999
        if (this.rangeCheck && !hana.validation.isNull(value) && !hana.validation.checkNumberSize(value, this.min, this.max)) {
	        if (this.min == this.max) {
	            messages.alert(this.object, "JSM-1009", [this.name, this.min], true);
	        } else {
	            messages.alert(this.object, "JSM-1010", [this.name, hana.validation.wa(this.min), this.max], true);
	        }
	        return false;
	    }

        // 자리수 체크
        if (this.lengthCheck && !hana.validation.isNull(value) && !hana.validation.checkNumberLength(value, this.minlength, this.maxlength)) {
	        if (this.minlength == this.maxlength) {
	            messages.alert(this.object, "JSM-1033", [this.name, this.minlength], true);
	        } else {
	            messages.alert(this.object, "JSM-1034", [this.name, this.minlength, this.maxlength], true);
	        }
	        return false;
	    }

        return true;
	},

    limitLength : function(min, max){
        this.minlength = min;
        this.maxlength = max;
        this.lengthCheck = true;
        return this;
    }
};
/** #. end JNumber control **/

/** #. start JCurrency control TYPE에 따라 추가 정의한다. **/
/**
 * Class 명 : JCurrency
 *
 * 설명 : number 타입 관리
 * validate method를 제외한 나머지는 모두 chained method 입니다.
 *
 * 사용 예 :
 * new hana.JCurrency('나이', formObj.age).nullable().range(1,999)
 * 위 소스는 age 필드에 숫자만 입력 가능하고 빈값이 올 수 있으며 1~999 까지의 숫자만 입력
 * 할 수 있도록 설정한 내용입니다.
 *
 * @param {String} name
 * @param {HTMLElement} object
 * @param {String} 생성될 hidden 필드명
 */
hana.JCurrency = function(name, object, targetElId){
    /* Member Field */
    this.name = name;
    this.object = object;
    this.targetElId = targetElId;

    this.nullCheck = true;
    this.rangeCheck = false;
    this.rangePointCheck = false;
    this.rangeMoneyCheck = false;
    this.rangeDollarCheck = false;
    this.lengthCheck = false;

    this.min;
    this.max;
    this.type;
    this.curr;

    this.minlength;
    this.maxlength;

    this.nullable = hana.validation.nullable;
    this.range = hana.validation.range;
    this.rangeMoney = hana.validation.rangeMoney;
    this.rangePoint = hana.validation.rangePoint;
    this.rangeDollar = hana.validation.rangeDollar;

    this.setMsg = hana.validation.setMsg;
};

hana.JCurrency.prototype = {
    /**
	 * Currency타입 유효성 검사
	 */
	validate : function(){

        //에러 메세지 설정
        if(this.isSetMsg)
            messages.set(this.id, this.msg);

        var value = this.object.value;

        //nullcheck
        if (this.nullCheck && hana.validation.isNull(value) ) {
	        return messages.alert(this.object, "JSM-1004", hana.validation.ul(this.name), true);
	    }


        // null 이 아닌 경우 숫자인지 체크
        if (!hana.validation.isNull(value) && hana.validation.isNaN(value)) {
	        return messages.alert(this.object, "JSM-1008", this.name, true);
	    }

        //범위 체크 ex) 1~999
        if (this.rangeCheck && !hana.validation.isNull(value) && !hana.validation.checkNumberSize(value, this.min, this.max)) {
	        if (this.min == this.max) {
	            return messages.alert(this.object, "JSM-1009", [this.name, this.min], true);
	        } else {
	            return messages.alert(this.object, "JSM-1010", [this.name, hana.validation.wa(this.min), this.max], true);
	        }
	    }

        //범위 체크 ex) 1~999,999
        if (this.rangePointCheck && !hana.validation.isNull(value) && !hana.validation.checkNumberSize(value, this.min, this.max)) {
            //@김준 : 숫자 에러메세지시에 자리수 ',' 추가하여 표시합니다.
            var str_min = html.toMoney(this.min);
            var str_max = html.toMoney(this.max);
            if (this.min == this.max) {
                return messages.alert(this.object, "JSM-1044", [hana.validation.un(this.name), str_min], true);
            } else if(this.type == '1'){
                return messages.alert(this.object, "JSM-1045", [hana.validation.un(this.name), hana.validation.wa(str_min), str_max], true);
            } else if(this.type == '2'){
                str_max = html.toMoney(this.max+'0000');    // 만원단위 입력창에서 max값 오류메세지도 만원단위로 보여준다.
                return messages.alert(this.object, "JSM-1037", [hana.validation.un(this.name), str_min, str_max], true);
            }
        }

	    //금액체크
	    if(this.rangeMoneyCheck && !hana.validation.isNull(value) && "" != hana.validation.checkMoney(value,this.min, this.max, this.type)) {
		    //var str_min = hana.validation.getKoreaMoney(this.min);
		    //var str_max = hana.validation.getKoreaMoney(this.max);
			//@모근원 : 금액 에러메세지시에 숫자로 표시합니다.
			var str_min = html.toMoney(this.min);
		    var str_max = html.toMoney(this.max);
	    	if(this.type == "1") {
	    		return messages.alert(this.object, "JSM-1036", [hana.validation.un(this.name), str_min, str_max], true);
	    	} else if(this.type == "2") {
	    		return messages.alert(this.object, "JSM-1037", [hana.validation.un(this.name), str_min, str_max], true);
	    	} else if(this.type == "3") {
	    		return messages.alert(this.object, "JSM-1038", [hana.validation.un(this.name), str_min, str_max], true);
	    	} else if(this.type == "4") {
	    		return messages.alert(this.object, "JSM-1036-TRANS", [this.name, str_min, str_max], true);
	    	}
	    }

	    //외화 금액체크
	    if(this.rangeDollarCheck && !hana.validation.isNull(value) && !hana.validation.checkDollar(value, this.min, this.max, this.type)) {
			//@김준 : 외화 금액 에러메세지시에 숫자로 표시합니다.
            var str_min = hana.JHanaUtils.input.toFormatDollarMoney(this.min);
            var str_max = hana.JHanaUtils.input.toFormatDollarMoney(this.max);

            // 소수점 필요없는 통화코드
            var NO_POINT_CUR_MAP = ['KRW','ESP','IDR','ITL','JPY'];

            for(var i=0; i<NO_POINT_CUR_MAP.length; i++){
                if(NO_POINT_CUR_MAP[i] == this.type){
                    if(str_min.indexOf('.') > -1) str_min = str_min.substring(0,str_min.indexOf('.'));  // 소수점 삭제
                    if(str_max.indexOf('.') > -1) str_max = str_max.substring(0,str_max.indexOf('.'));  // 소수점 삭제
                }
            }

	    	return messages.alert(this.object, "JSM-1036-FOR", [hana.validation.un(this.name), this.type, str_min, str_max, this.curr], true);
	    }

        // 자리수 체크
        if (this.lengthCheck && !hana.validation.isNull(value) && !hana.validation.checkNumberLength(value, this.minlength, this.maxlength)) {
	        if (this.minlength == this.maxlength) {
	            return messages.alert(this.object, "JSM-1033", [this.name, this.minlength], true);
	        } else {
	            return messages.alert(this.object, "JSM-1034", [this.name, this.minlength, this.maxlength], true);
	        }
	    }

        //hana.validation.makeHiddenInput(this, value, /[,]/g);
        return true;
	},
    limitLength : function(min, max){
        this.minlength = min;
        this.maxlength = max;
        this.lengthCheck = true;
        return this;
    }
};
/** #. end JCurrency control **/

/** #. start Date control **/
/**
 * Class 명 : JDate
 *
 * 설명 : Date 타입 관리
 * nullable 과 range method만이 chained method 입니다.
 *
 * toString 은 입력된 날짜를 this.format = "YYYY년MM월DD일(DAY)" 에 정의된
 * 형식으로 반환해 주는 method입니다.( 메세지 출력시 내부적 호출 )
 * toDate => Date 클래스로 반환.
 *
 * 사용 예 :
 * new hana.JDate('날짜', formObj.date).nullable().range('20050101','20070101')
 * 위 예제는 date 필드에 빈값이 올수 있으며 20050101 부터 20070101 까지 날짜 입력에
 * 제한을 둔 설정입니다.
 *
 * new hana.JDate('날짜', formObj.date, /^\d{4}[년]?\d{2}[월]?\d{2}[일]?$/)
 * date 필드에 입력되는 날짜 형식이 2007년02월20일 과 같은 형식일 때 날짜 입력
 * 여부를 체크하도록 설정한 내용입니다.
 *
 * 기존 설정은 구분자가 없거나 '-','.','/'를 구분자로 사용하는 날짜 형식이며
 * 이외의 날짜 입력시 잘못된 날짜로 간주 합니다.
 *
 * 반드시 년도 4자리, 월 2자리, 일 2자리로 구성되는 형식이여야 하며
 * 특별한 구분자를 사용할 경우 해당하는 구분자 형식의 정규식을 넘겨주어야 합니다.
 *
 * 추가 작업 : targetElId 인자를 받아 validation 성공 시 targetElId 로 hidden 필드를 만듭니다.
 *
 * @param {String} name
 * @param {HTMLElement} object
 * @param {String} 생성될 hidden 필드명
 * @param {Object} regExp 정규식 객체
 *
 */
hana.JDate = function(name, object, targetElId, re) { // 생성자 함수
	this.DAY_OF_WEEK = new Array("일","월","화","수","목","금","토");
    /* Member Field */
    this.name = name;
    this.object = object;

    this.nullCheck = true;
    this.rangeCheck = false;

    this.date = null;

	this.targetElId = targetElId;

    if (re)  {
    	this.re = re;
    } else {
		this.re = /^\d{4}[-.\/]?\d{2}[-.\/]?\d{2}$/;
    }

    this.min = null; /* YYYYMMDD Format */
    this.max = null; /* YYYYMMDD Format */

    this.format = "YYYY년MM월DD일(DAY)";

    this.parse();

    this.nullable = hana.validation.nullable;
    this.range = hana.validation.range;

    this.setMsg = hana.validation.setMsg;
};
hana.JDate.prototype = {
	/* Member Method */
	/**
	 * Date타입 유효성 검사
	 */
    validate : function(){

        //에러 메세지 설정
        if(this.isSetMsg)
            messages.set(this.id, this.msg);

        var value = this.object.value;

        // null check
        if (this.nullCheck && hana.validation.isNull(value)) {
	        return messages.alert(this.object, "JSM-1004", hana.validation.ul(this.name), true);
	    }

        // nullable 인 경우 null 이면 여기서 return true 한다.
        if (!this.nullCheck && hana.validation.isNull(value)) {
	        //hana.validation.makeHiddenInput(this, value, /[^\d]/g);
            return true;
	    }

        // 유효날짜 체크
        if (this.date == null) {
	        return messages.alert(this.object, "JSM-1018", hana.validation.un(this.name), true);
	    }

        // 범위 체크
        if (this.rangeCheck) {
	        var aDate = this.toDate();
	        var minDate, maxDate;

	        if (this.min != null && this.min != "") {
	            minDate = new hana.JDate().parse(this.min);
	        } else {
	            minDate = new hana.JDate().parse("10000101");
	        }
	        if (this.max != null && this.max != "") {
                maxDate = new hana.JDate().parse(this.max);
	        } else {
	            maxDate = new hana.JDate().parse("99991231");
	        }

            if (this.min == null && aDate > maxDate.toDate()) {
	            return messages.alert(this.object, "JSM-1019", [this.name, maxDate], true);
	        } else if (this.max == null && aDate < minDate.toDate()) {
	            return messages.alert(this.object, "JSM-1020", [this.name, minDate], true);
	        } else if (aDate > maxDate.toDate() || aDate < minDate.toDate()) {
	            return messages.alert(this.object, "JSM-1021", [this.name, minDate, maxDate], true);
	        }
	    }

        //hana.validation.makeHiddenInput(this, value, /[^\d]/g);
        return true;
	},

    /**
	 * Date 반환
	 */
	toDate :  function() {
	    return this.date;
	},

	/**
	 * 문자열을 Date 클래스로 parsing 합니다.
	 */
	parse : function() {
	    var value = this.object;
	    if (this.parse.arguments.length > 0) {
	        value = this.parse.arguments[0];
	    } else if (this.object && typeof this.object=="object") {
	        value = this.object.value;
	    } else {
	        this.date = new Date();
	        return this;
	    }

	    this.date = null;
	    if (value.search(this.re) >= 0) {
            var chkVal = value.replace(/[^\d]/g,"");
//	        value = value.replace(/[^\d]/g,"");
	        var aDate = new Date(chkVal.substring(0,4),chkVal.substring(4,6)-1,chkVal.substring(6,8));
	        if (   aDate.getFullYear()  == Math.abs(chkVal.substring(0,4))
	            && aDate.getMonth() == Math.abs(chkVal.substring(4,6))-1
	            && aDate.getDate()  == Math.abs(chkVal.substring(6,8)) ) {
	            this.date = aDate;
	        }
	    }
	    return this;
	},

	/**
	 * string 타입으로 반환
	 */
	toString : function() {
	    var formatString = this.format;
	    /*
	    if (toString.arguments != undefined && toString.arguments.length > 0) {
	        formatString = toString.arguments[0];
	    }
	    */

	    var str = formatString.replace(/YYYY/g , this.getYear());
	    str = str.replace(/MM/g , this.getMonth());
	    str = str.replace(/DD/g , this.getDate());
	    str = str.replace(/DAY/g , this.getDay());
	    str = str.replace(/yy/g , new String(this.getYear()).substring(2,4));
	    return str;
	},
	getYear : function() {
	    return this.date == null ? 1000 : this.date.getFullYear();
	},
	getMonth : function () {
	    var num = (this.date == null ? 0 : this.date.getMonth()+1);
	    return (num < 10 ? '0' + new String(num) : num);
	},
	getDate : function() {
	    var num = (this.date == null ? 0 : this.date.getDate());
	    return (num < 10 ? '0' + new String(num) : num);
	},
	getDay : function() {
	    return (this.date == null ? this.DAY_OF_WEEK[0] : this.DAY_OF_WEEK[this.date.getDay()]);
	}
};
/** #. end Date control **/

/** #. start Check/Radio control **/
/**
 * Class 명 : JCheck
 *
 * 설명 : JCheck 타입 관리
 * nullable 과 range method만이 chained method 입니다.
 *
 * 사용 예 :
 * new hana.JCheck('체크', formObj.chk).nullable().range(2,3)
 * 위 예제는 chk 선택이 선택 되지 않아도 되며 선택 된다면 2개에서 3개 사이가 선택 되도록
 * 제한을 둔 설정입니다.
 *
 * @param {String} name
 * @param {HTMLElement} object
 */
hana.JCheck = function (name, object) {

    /* Member Field */
    this.name = name;
    this.object = object;

    this.min;
    this.max;

    this.nullCheck = true;
    this.rangeCheck;

    this.nullable = hana.validation.nullable;
    this.range = hana.validation.range;

    this.setMsg = hana.validation.setMsg;
};

hana.JCheck.prototype = {
	validate : function() {

        //에러 메세지 설정
        if(this.isSetMsg)
            messages.set(this.id, this.msg);

        //var value = this.object;
	    var number = hana.validation.isCheckedCnt(this.object);

		if (this.nullCheck && number == 0) {
			return messages.alert(this.object, "JSM-1011", hana.validation.ul(this.name), false);
		}

		if (this.rangeCheck && number != 0 && (number < this.min || number > this.max)) {
		    if (this.min == this.max) {
				return messages.alert(this.object, "JSM-1012", [this.name, this.min], false);
		    } else {
				return messages.alert(this.object, "JSM-1013", [this.name, hana.validation.wa(this.min), this.max], false);
		    }
		}
	    return true;
	}
};
/** #. end Check/Radio control **/


/** #. start Select control **/
/**
 * Class 명 : JSelect
 *
 * 설명 : JSelect 타입 관리
 * nullable 과 range method만이 chained method 입니다.
 *
 * 사용 예 :
 * new hana.JSelect('선택', formObj.select).nullable().range(1,2)
 * 위 예제는 select 선택이 선택 되지 않아도 되며 선택 된다면 1개에서 2개 사이가 선택 되도록
 * 제한을 둔 설정입니다.
 *
 * @param {String} name
 * @param {HTMLElement} object
 */
hana.JSelect = function (name, object) {

    /* Member Field */
    this.name = name;
    this.object = object;

    this.min;
    this.max;

    this.nullCheck = true;
    this.rangeCheck;

    this.range = hana.validation.range;
    this.nullable = hana.validation.nullable;

    this.setMsg = hana.validation.setMsg;
};

hana.JSelect.prototype = {
    validate : function () {

        //에러 메세지 설정
        if(this.isSetMsg)
            messages.set(this.id, this.msg);

        var value = this.object.value;

        if (this.nullCheck && hana.validation.isNull(value)) {
            return messages.alert(this.object, "JSM-1011", hana.validation.ul(this.name), true);
        }

        var number = hana.validation.isSelectedCnt(this.object);

        if (this.rangeCheck && number != 0 && (number < this.min || number > this.max)) {
		    if (this.min == this.max) {
				return messages.alert(this.object, "JSM-1012", [this.name, this.min], true);
		    } else {
				return messages.alert(this.object, "JSM-1013", [this.name, hana.validation.wa(this.min), this.max], true);
		    }
		}
        return true;
    }
};
/** #. end Select control **/

/** #. start JFile control **/
/**
 * Class 명 : JFile
 *
 * 설명 : JFile 타입 관리
 * nullable, arrowFileExt, denyFileExt 이 chained method 입니다.
 *
 * 사용 예 :
 * new hana.JFile('파일', formObj.file).nullable().denyFileExt(['zip','exe'])
 * 위 예제는 file 에 파일을 첨부 하지 않아도 되며 첨부 시 확장자가 'zip','exe' 인 형식은
 * 제한을 둔 설정입니다.
 *
 * @param {String} name
 * @param {HTMLElement} object
 */
hana.JFile = function (name, object) {
    /* Member Field */
    this.name = name;
    this.object = object;

    this.nullCheck = true;
    this.allowedExtension;
    this.disallowedExtension;

    this.nullable = hana.validation.nullable;

    this.setMsg = hana.validation.setMsg;
};

hana.JFile.prototype = {

    validate : function () {

        //에러 메세지 설정
        if(this.isSetMsg)
            messages.set(this.id, this.msg);

        var value = this.object.value;

        /*IE 버그로 인한 입력값 정확성 체크 */
        var re = /^[a-z]:\\(.){0,300}$/i;

        if (value != "" && !value.match(re)) {
            return messages.alert(this.object, "JSM-1022", true);
        }

        if (this.nullCheck && hana.validation.isNull(value)) {
            return messages.alert(this.object, "JSM-1023", [this.name], false);
        }

        if (this.allowedExtension) {
            var passed = true;
            var extension = hana.validation.getFileExt(value);
            if (extension) {
                for(var j = 0; j < this.allowedExtension.length ; j++) {
                    if (this.allowedExtension[j].toLowerCase() == extension) {
                        break;
                    }
                    if (j == this.allowedExtension.length - 1) {
                        passed = false;
                    }
                }
            }
            if (!passed) {
                return messages.alert(this.object, "JSM-1024", [this.name, this.allowedExtension.join(", ")], false);
            }
        }

        if (this.disallowedExtension) {
            var passed = true;
            var extension = hana.validation.getFileExt(value);
            if (extension) {
                for(var j = 0; j < this.disallowedExtension.length ; j++) {
                    if (this.disallowedExtension[j].toLowerCase() == extension) {
                        passed = false;
                        break;
                    }
                    if (j == this.disallowedExtension.length - 1) {
                        passed = true;
                    }
                }
            }
            if (!passed) {
                return messages.alert(this.object, "JSM-1025", [this.name, this.disallowedExtension.join(", ")], false);
            }
        }
        return true;
    },

    /**
     * 허용 확장명 설정
     * @param array 확장자 array
     */
    allowFileExt : function (array) {
        this.allowedExtension = array;
        return this;
    },

    /**
     * 불가 확장명 설정
     * @param array 확장자 array
     */
    denyFileExt : function (array) {
        this.disallowedExtension = array;
        return this;
    }

};
/** #. end JFile control **/


/** #. start JGrid control **/
/**
 * Class 명 : JGrid
 *
 * 설명 : JGrid 타입 관리
 * checkedData 가 chained method 입니다.
 *
 * 사용 예 :
 *
 *  그리드에 선택한 데이터가 있는지 체크합니다.
 *
 *  if( !new hana.JGrid(gridObject).checkedData().validate() ){
 *      return;
 *  }
 *
 *  그리드에 체크 가능한 데이터의 개수를 1~5로 제한 합니다.
 *
 *  if( !new hana.JGrid(gridObject).range(1,5).validate() ){
 *      return;
 *  }
 *
 *  그리드에 데이터가 있는지 체크합니다.
 *
 *  if( !new hana.JGrid(gridObject).validate() ){
 *      return;
 *  }
 *
 * 위 예제는 grid에서 체크된 데이터가 있는지 validation 하는 코드입니다.
 *
 * default는 데이터가 들어있는지만 체크합니다.
 *
 * @param {String} name
 * @param {Object} grid object
 */
hana.JGrid = function (object) {
    /* Member Field */
    this.object = object;
    this.name = object.GridName;
    this.isCheckedData = false;

    this.min;
    this.max;
    this.rangeCheck;

    this.range = hana.validation.range;

    this.setMsg = hana.validation.setMsg;
};

hana.JGrid.prototype = {

    validate : function () {

        //에러 메세지 설정
        if(this.isSetMsg)
            messages.set(this.id, this.msg);

        //그리드에 데이터가 존재하는지 체크합니다.
        var rowCnt = this.object.RecordCount;
        //선택한 row 개수
        var checkedCnt = getSelectedCount(this.object, "선택");

        if (rowCnt == null || typeof(rowCnt) == "undefined" || rowCnt == 0) {
            return messages.alert(this.object, "JSM-1039", [this.name], false);
        }

        //그리드에 선택한 데이터가 존재하는지 체크합니다.
        if( this.isCheckedData && checkedCnt == 0){
            return messages.alert(this.object, "JSM-1040", [this.name], false);
        }

        //그리드에 선택한 개수 제한
        if (this.rangeCheck && (checkedCnt < this.min || checkedCnt > this.max)) {
            if (this.min == this.max) {
                return messages.alert(this.object, "JSM-1012", [this.name, this.min], false);
		    } else {
				return messages.alert(this.object, "JSM-1013", [this.name, hana.validation.wa(this.min), this.max], false);
		    }
		}

        return true;
    },

    checkedData : function () {
        this.isCheckedData = true;
        return this;
    }
};
/** #. end JGrid control **/



/** #. start JDateLimit control **/
/**
 * usage :
 * new hana.JDateLimit("조회기간", formObj.inqBascStrDt, formObj.inqBascEndDt, 'M', 6).validate()
 *
 * @param name   메세지
 * @param strObj 시작일 필드
 * @param endObj 종료일 필드
 * @param type  'Y' 년, 'M' 월, 'D' 일
 * @param cnt   기간
 */
hana.JDateLimit = function(name, strObj, endObj, type, cnt) { // 생성자 함수

    /* Member Field */
    this.name = name;
    this.strObj = strObj;
    this.endObj = endObj;

    this.type = type;
    this.cnt = cnt;

    this.setMsg = hana.validation.setMsg;
};
hana.JDateLimit.prototype = {
	/* Member Method */

    /**
	 * Date 기간 체크
	 */
    validate : function(){

        //에러 메세지 설정
        if(this.isSetMsg)
            messages.set(this.id, this.msg);

        var strVal = this.strObj.value;
	    var endVal = this.endObj.value;

        var strDt = this.parse(strVal);
        var endDt = this.parse(endVal);

        // 조회시작일 기준으로 최대 this.cnt 이내만 조회되도록 강제함
        if (this.addDate(strDt, this.type, this.cnt) < endDt) {
            var cntMsg = this.rangeMsg(this.type, this.cnt);
            return messages.alert(this.strObj, "JSM-1046", [hana.validation.un(this.name), cntMsg, hana.validation.ul(this.name)], true);
        }

        return true;
	},

    /**
     * 기간 메세지 parse
     * @param type
     * @param cnt
     */
    rangeMsg : function(type, cnt){
        var rangeMsg = '개월';
        if( type == 'Y' ){
            rangeMsg = '년';
        }
        if( type == 'M' ){
            rangeMsg = '개월';
        }
        if( type == 'D' ){
            rangeMsg = '일';
        }

        return cnt + rangeMsg;
    },

    /**
     * 날짜 더하기
     * @param dt
     * @param type
     * @param cnt
     */
    addDate : function(dt, type, cnt) {
        var addType = Date.DAY;
        if( type == 'Y' ){
            addType = Date.YEAR;
        }
        if( type == 'M' ){
            addType = Date.MONTH;
        }
        if( type == 'D' ){
            addType = Date.DAY;
        }

        return dt.add(addType, new Number(cnt));
    },

    /**
     * 날짜 string parse
     * @param value
     */
	parse : function(value) {
        value = value.replace(/[^\d]/g,"");
        return Date.parseDate(value, "Ymd");
	}
};
/** #. end JDateLimit control **/



hana.validation = {

    /**
     * 에러 메세지 설정
     * @param id
     * @param msg
     */
    setMsg : function(id, msg){
        this.isSetMsg = true;
        this.id = id;
        this.msg = msg;
        return this;
    },

    /**
     * 입력된 문자열 중 특정 문자를 지우고 이를 targetElId 의 input hidden 필드로 넣어주는 함수
     * 이때 생성된 input hidden 태그는 Object 의 앞에 들어간다. (parentNode.insertBefore)
     *
     * @param obj {Object} validation 객체에 넘어온 Object
     * @param value {String} value
     * @param regExp {Object} replace 시 수행할 정규식
     */
    makeHiddenInput : function(obj, value, regExp){
        var replaceVal = value.replace(regExp,"");

        if (obj.targetElId && document.getElementById(obj.targetElId)) {
			// 숫자를 제외한 문자들은 전부 뺀다. replace
			document.getElementById(obj.targetElId).value = replaceVal;
		} else if( obj.targetElId ) {
			var cEl = document.createElement("INPUT");
			cEl.type = "hidden";
			cEl.name = obj.targetElId;
			cEl.id = obj.targetElId;
			cEl.value = replaceVal;
			obj.object.parentNode.insertBefore(cEl, obj.object);
		} else{
            obj.object.value = replaceVal;
        }
    },


    /**
     * 공통함수입니다.
     *
	 * Null 체크 비활성화
	 */
    nullable : function() {
	   this.nullCheck = false;
	   return this;
	},

	/**
	 * 공통함수입니다.
	 *
	 * 유효성 검사 범위 설정
	 * @param {Object} min 최소값
	 * @param {Object} max 최대값
	 */
	range : function(min, max) {
	    this.rangeCheck = true;
	    this.min = min;
	    this.max = max;
	    return this;
	},

	/**
	 * 공통함수입니다.
	 * 알림창에 ',' 자리수 포인트를 추가해서 출력.
	 * 유효성 검사 범위 설정
	 * @param {Object} min 최소값
	 * @param {Object} max 최대값
	 */
	rangePoint : function(min, max, type) {
	    this.rangePointCheck = true;
	    this.min = min;
	    this.max = max;
        if(type == undefined) type = '1';
        this.type = type;
	    return this;
	},

	/**공통함수입니다.
	 * 금액 범위 체크함.
	 * 금액이 min 와 max 사이가 아닐경우 안내메시지
	 * type : ('1':일반) ('2':만원단위로 입력체크 해야할경우)
	 * ('3':min값만 있을경우 ) rangeMoney(3000000,999999999999,'3'); => "삼백만원 이상 가능합니다"
	 */
	rangeMoney : function(min, max, type) {
		this.rangeMoneyCheck = true;
	    this.min = min;
	    this.max = max;
	    this.type = type;
	    return this;
	},

	/**공통함수입니다.
	 * 외화 금액 범위 체크함.
	 * 외화 금액이 min 와 max 사이가 아닐경우 안내메시지
	 * type : 통화단위 영문(USD,EUR,JPY..)
	 * curr : 통화단위 한글('달러','유로','엔'..)
	 */
	rangeDollar : function(min, max, type, curr) {
		this.rangeDollarCheck = true;
	    this.min = min;
	    this.max = max;
	    this.type = type;
	    this.curr = curr;
	    return this;
	},

    /**
	 * 금액 범위 체크함.
	 * 금액이 min 와 max 사이가 아닐경우 안내메시지
	 * type : ('1':일반) ('2':만원단위로 입력체크 해야할경우)
	 * ('3':min값만 있을경우 ) rangeMoney(this,3000000,999999999999,'3'); => "삼백만원 이상 가능합니다"
	 */
    checkMoney : function(value,min, max, type) {
	    if (!this.nullCheck || !hana.validation.isNull(value) ) {
            var flag = hana.validation.checkNumberSize(value,min,max);
		    if(flag && "1" == type) {
	    		type = "";
	    	} else if("2" == type) {
	    		var money = Number(value.replace(/[,]/g,"").replace(/[.][0-9]+$/g,""));
	    		if(flag && money%10000 == 0) {
	    			type = "";
	    		}
	    	} else if("3" == type && flag) {
	    		type = "";
            } else if("4" == type && flag) {
	    		type = "";
	    	}
	        return type;
        }
	},
    /**
	 * 외화 금액 범위 체크함.
	 * 금액이 min 와 max 사이가 아닐경우 안내메시지
	 */
    checkDollar : function(value, min, max, type) {
	    if (!this.nullCheck || !hana.validation.isNull(value) ) {
            var flag = hana.validation.checkDoubleSize(value,min,max,type);
	        return flag;
        }
	},

    /* 내부함수 (한글 종성체크) */
    isJongsong : function (wd) {

        var INDETERMINATE = 0;
        var NOJONGSONG = 1;
        var JONGSONG = 2;

        var word = new String(wd);                    /* 숫자가 들어오는 등에 대비해 무조건 문자열로 바꿈 */
        var numStr1 = "013678lmnLMN";                 /* '조' 전까지는 0이 받침이 있는걸로 나옴 --; */
        var numStr2 = "2459aefhijkoqrsuvwxyzAEFHIJKOQRSUVWXYZ";
        /* bdgpt들은 읽기에 따라 받침이 있기도 하고 없기도 한다고 판단. */
        /* 대문자는 단독으로 읽을 때를 감안하면 받침 있다고 확정되는 것이 더 적음. */

        if (word == null || word.length < 1) {
            return INDETERMINATE;
        }

        var lastChar = word.charAt(word.length - 1);
        var lastCharCode = word.charCodeAt(word.length - 1);

        if (numStr1.indexOf(lastChar) > -1) {
            return JONGSONG;
        }else if (numStr2.indexOf(lastChar) > -1) {
            return NOJONGSONG;
        }

        if (lastCharCode<0xac00 || lastCharCode>0xda0c) {
            return INDETERMINATE;
        }
        else{
            var lastjongseong = (lastCharCode - 0xAC00) % (21*28) % 28  ;

            if (lastjongseong == 0){
                return NOJONGSONG;
            }else{
                return JONGSONG;
            }
        }
    },

    /* 내부함수 (을/를) */
    ul : function (s) {
        var ul0 = new Array("(을)를", "를", "을");
        return s + ul0[hana.validation.isJongsong(s)];
    },

    /* 내부함수 (이/가) */
    ka : function (s){
        var ka0 = new Array("(이)가", "가", "이");
        return s + ka0[hana.validation.isJongsong(s)];
    },

    /* 내부함수 (은/는) */
    un : function (s){
        var un0 = new Array("(은)는", "는", "은");
        return s + un0[hana.validation.isJongsong(s)];
    },

    /* 내부함수 (와/과) */
    wa : function (s){
        var arr = new Array("(와)과", "와", "과");
        return s + arr[hana.validation.isJongsong(s)];
    },

    /**
     * Text 사이즈를 check
     * @param {String} data
     * @param {int} min
     * @param {int} max
     */
    checkCharacterSize : function (data, min, max) {
        if( !data ) return false;

        var total = 0;

        for (var i = 0; i < data.length; i++) {
            var a = data.charAt(i);
            /* 한글인 경우 길이가 6 이다. */
            if (escape(a).length >= 6) {
                total = total + 2;
            } else {
                total = total + 1;
            }
        }
        return total >= min && total <= max;
    },

    /**
     * Number의 사이즈를 체크
     * data에 들어온 ',' 문자와 소수점을 제외하고 min, max를 비교한다.
     *
     * @param {number} data
     * @param {int} min
     * @param {int} max
     */
    checkNumberSize : function(data, min, max){
        if( !data ) return false;

		if(typeof min == 'string'){
			min = min.replace(/[,]/g,"").replace(/[.][0-9]+$/g,"");
		}

		if(typeof max == 'string'){
			max = max.replace(/[,]/g,"").replace(/[.][0-9]+$/g,"");
		}

        if(typeof data == 'string'){
			data = data.replace(/[,]/g,"").replace(/[.][0-9]+$/g,"");
		}

        min = new Number(min);
        max = new Number(max);

        var parseData = new Number(data);

        if(max <= 0) {
            return parseData >= min;
        } else {
            return parseData >= min && parseData <= max;
        }
    },

    /**
     * Double의 사이즈를 체크
     * data에 들어온 ',' 문자를  제외하고 min, max를 비교한다.
     *
     * @param {double} data
     * @param {int} min
     * @param {int} max
     */
    checkDoubleSize : function(data, min, max, type){
        if( !data ) return false;

		if(typeof min == 'string'){
			min = min.replace(/[,]/g,"").replace(/[0-9]+$/g,"");
		}

		if(typeof max == 'string'){
			max = max.replace(/[,]/g,"").replace(/[0-9]+$/g,"");
		}
        if(typeof data == 'string'){
			data = data.replace(/[,]/g,"");
		}

        min = parseFloat(min);
        max = parseFloat(max);

        var parseData = parseFloat(data);

        if(max <= 0) {
            return parseData >= min;
        } else {
            return parseData >= min && parseData <= max;
        }
    },

    /**
     * Number의 사이즈를 체크
     * data에 들어온 ',' 문자와 소수점을 제외하고 min, max를 비교한다.
     *
     * @param {number} data
     * @param {int} min
     * @param {int} max
     */
    checkNumberLength : function(data, min, max){
        if( !data ) return false;

        var parseData = data.replace(/[,]/g,"").replace(/[.][0-9]+$/g,"");
        var total = parseData.length;
        return total >= min && total <= max;
    },

    /**
     * 공백문자를 제외한 글자가 있는지 체크
     * @param val {String} check 할 문자열
     */
    isNull : function(val){
        return !new RegExp("[^\\s]+","g").test(val);
    },


    /**
     * 빈 문자열인 경우 false 임.
     * 앞에 +- 를 제외하고 세자리 마다찍히는 ','를 제외하고 소수점 2자리 까지만 숫자로 체크
     * @param val {String} check 할 문자열
     */
    isNaN : function(val){

        return !new RegExp("^[+-]?[0-9]{1,3}(?:,?[0-9]{3})*(?:\\.[0-9]{2})?$","g").test(val);
    },

    /**
     * 특수 문자가 포함되어있는지 체크
     * @param val {String} check 할 문자열
     */
    isExistSpacialChar : function(val, pattern){
        return new RegExp("["+pattern+"]","g").test(val);
    },

    /**
     * checkbox/radio list 에서 check 된 개수를 return한다.
     * @param list checkbox/radio list
     */
    isCheckedCnt : function(list) {
        if (list == null) return 0;
        var result = 0;

        /* list array의 데이터가 1인 경우 */
        if (list.checked) {
            return 1;
        }
        for (var i = 0; i < list.length; i++) {
            if (list[i].checked) {
                result++;
            }
        }
        return result;
    },

    /**
     * selectbox 에서 선택된 item 의 개수를 return 한다.
     * @param item selecbox
     */
    isSelectedCnt : function (item) {
        if (item == null) return 0;
        var result = 0;

        for (var i = 0; i < item.length; i++) {
            if (item[i].selected) {
                result++;
            }
        }
        return result;
    },

    /**
     * 파일의 확장자 가져옴
     * @param val {String} 파일경로
     */
    getFileExt : function (value) {
        var ext = null;
        var extension = value;
        var index = extension.lastIndexOf(".");

        if (index != -1){
            ext = extension.substring(index + 1).toLowerCase();
        }

        return ext;
	},

    /*
    * 입력된 숫자를 문자 금액으로 변환
    * @param val {money}
    */
    getKoreaMoney : function (money) {
        var arrayNum=new Array("","일","이","삼","사","오","육","칠","팔","구");
        var arrayUnit=new Array("","십","백","천","만 ","십만 ","백만 ","천만 ",
                                "억 ","십억 ","백억 ","천억 ","조 ","십조 ","백조");
        var arrayStr= new Array();
        var numStr = String(money);
        var numStr = opb.common.util.stripCommas_fnc(numStr);
        var len = numStr.length;

        var isValid = true;
        var hanStr = "";
        if (isValid) {
            for (var i = 0; i < len; i++) {
                arrayStr[i] = numStr.substr(i, 1)
            }
            code = len;
            for (var i = 0; i < len; i++) {
                code--;
                tmpUnit = "";
                if (arrayNum[arrayStr[i]] != "") {
                    tmpUnit = arrayUnit[code];
                    if (code > 4) {
                        if ((Math.floor(code / 4) == Math.floor((code - 1) / 4) &&
                        arrayNum[arrayStr[i + 1]] != "") ||
                        (Math.floor(code / 4) == Math.floor((code - 2) / 4) &&
                        arrayNum[arrayStr[i + 2]] != "")) {
                            tmpUnit = arrayUnit[code].substr(0, 1);
                        }
                    }
                }
                hanStr += arrayNum[arrayStr[i]] + tmpUnit;
            }
        }
        return hanStr;
    },


    /**
     * 입력 금지 문구들...
     */
    denyChar : ["가공비", "결재", "결제", "계약", "구매", "기타", "납품", "대우", "대출",
               "도매", "도소매", "동국", "두산", "매담", "매출", "무역", "물품",
               "부가가치", "비품", "상품", "서비스", "선급금", "선수금", "세금",
               "써비스", "어음", "엘지", "외상", "임가공", "잡기", "정산비", "제조",
               "채권", "추심", "판매", "할인", "현금", "현대", "환어음", "효성"],

    /**
     * 입력 금지 문구가 존재하면 존재하는 입력 금지문구의 Array 를 반환합니다.
     * @param str 품목명 문자열
     */
    getExistDenyCharArr : function(str){

        var arr = hana.validation.denyChar;
        var message = new Array();

        for( var i = 0; i< arr.length; i++){
            if( str.indexOf(arr[i]) != -1 ){
                message.push(arr[i]);
            }
        }

        return message;
    },


    /**
     * 올바르지 않은 품목명인지 체크합니다.
     *
     * 조건
     * 1. 영문 숫자를 제외한 남은 문자가 정상적인 한글이 아닌경우
     * 2. 다른 문자와 조합되지 않고 영문이나 숫자만 1자 있는 경우 예) a, 1
     * 3. 다른 문자와 조합되지 않고 같은 영문이나 숫자만 2자이상 반복되는 경우  예) aa, 11
     * @param str 품목명 문자열
     */
    isInCorrectRpsMitmNm : function(str){
        var strTmp = str.replace(/[0-9a-z]/ig,'');

        //영문 숫자를 제외한 남은 문자가 정상적인 한글이 아닌경우
        if(strTmp && !new RegExp("^[가-힝]+$","g").test(strTmp)){
            return true;
        }

        //다른 문자와 조합되지 않고 영문이나 숫자만 1자 있는 경우 예) a, 1
        if(new RegExp("^[0-9a-z]{1}$","g").test(str)){
            return true;
        }

        //다른 문자와 조합되지 않고 같은 영문이나 숫자만 2자이상 반복되는 경우  예) aa, 11
        var re = new RegExp("^([a-z0-9])","gi");

        var matches = re.exec(str);

        if(matches != null){
            re = new RegExp("^["+matches[0]+"]*$","gi");

            var chkStr = str.replace(re, '');

            if(!chkStr){
                return true;
            }
        }

        return false;
    },
    
    /**
     * 주민번호 체크
     * 
     */
    juminNo : function(type) {
        this.juminCheck = true;
        if( type != undefined ) this.juminCheckType = type;
        
        return this;
    }
};
