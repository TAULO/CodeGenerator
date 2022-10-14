/* ================ prototype function definitions ================ */
String.prototype.lpad = function(_total_len, _pad_char) {
	_total_len = (_total_len === null || typeof _total_len == 'undefined') ? this.length : _total_len;
	_pad_char = (_pad_char === null || typeof _pad_char == 'undefined') ? ' ' : _pad_char;
	var _return_char = this;
	while (_return_char.length < _total_len) {
		_return_char = _pad_char + _return_char;
	}
	return _return_char.substring(_return_char.length - _total_len);
};

Number.prototype.lpad = function(_total_len, _pad_char) {
	_total_len = (_total_len === null || typeof _total_len == 'undefined') ? this.toString().length : _total_len;
	_pad_char = (_pad_char === null || typeof _pad_char == 'undefined') ? ' ' : _pad_char;
	var _return_char = this.toString();
	while (_return_char.length < _total_len) {
		_return_char = _pad_char + _return_char;
	}
	return _return_char.substring(_return_char.length - _total_len);
};

String.prototype.rpad = function(_total_len, _pad_char) {
	_total_len = (_total_len === null || typeof _total_len == 'undefined') ? this.length : _total_len;
	_pad_char = (_pad_char === null || typeof _pad_char == 'undefined') ? ' ' : _pad_char;
	var _return_char = this;
	while (_return_char.length < _total_len) {
		_return_char += _pad_char;
	}
	return _return_char.substring(0, _total_len);
};

Number.prototype.rpad = function(_total_len, _pad_char) {
	_total_len = (_total_len === null || typeof _total_len == 'undefined') ? this.toString().length : _total_len;
	_pad_char = (_pad_char === null || typeof _pad_char == 'undefined') ? ' ' : _pad_char;
	var _return_char = this.toString();
	while (_return_char.length < _total_len) {
		_return_char += _pad_char;
	}
	return _return_char.substring(0, _total_len);
};

String.prototype.addComma = function() {
	var _amount = this.split('.');
	var _integer = _amount[0];
	var _decimal = _amount.length > 1 ? '.' + _amount[1] : '';
	var _regex = /(^[+-]?\d+)(\d{3})/;
	while (_regex.test(_integer)) {
		_integer = _integer.replace(_regex, '$1' + ',' + '$2');
	}
	return _integer + _decimal;
};

Number.prototype.addComma = function() {
	var _amount = this.toString().split('.');
	var _integer = _amount[0];
	var _decimal = _amount.length > 1 ? '.' + _amount[1] : '';
	var _regex = /(^[+-]?\d+)(\d{3})/;
	while (_regex.test(_integer)) {
		_integer = _integer.replace(_regex, '$1' + ',' + '$2');
	}
	return _integer + _decimal;
};
/* ================ prototype function definitions ================ */

/* ================ Object function definitions ================ */
GlobalFunc = {
	forwardToDomain : function(url) {
		if (url.indexOf('http://') >= 0) {
			location.href = url;
			return false;
		}
		location.href = url.indexOf('CYB') > 0 ? url : GlobalParam.homeDomain + url;
		return false;
	},
	/** ajax 공통 에러 처리 **/
	isErrorAjax : function(response, ajaxFlag) {
		if (typeof ajaxFlag === 'undefined') {

		} else {
			if (ajaxFlag) {

			}
		}
		
		if (typeof response === 'undefiend') {
			return false;
		}
		if (typeof response.result === 'undefined') {
			alert('처리중 에러가 발생하였습니다.');
			return false;
		}
		if (response.result === 'error') {
			var rtmsg = response.rtmsg;
			var rturl = response.rturl;
			if (rtmsg != null && rtmsg != '') {
				alert(rtmsg.replace(/~r~n/gi, '\n'));
			}
			if (rturl != null && rturl != '') {
				location.href = rturl;
				return false;
			}
			return false;
		}
		return true;
	}
};

/** 페이징 객체 * */ 
Paging = {
	$pagingForm : '',
	currentPage : 1,
	lastPageIndex : 1,
	pageSize : 10,
	/**
	 * 페이징 번호 및 이전글, 다음글 선택시 submit
	 */
	goPage : function() {
		$('.paging a').on('click', function() {
			var $form = Paging.$pagingForm;
			Paging.setPageIndex(this);
			var $paging = $(this);
			if ($paging.hasClass('prev')) {	// 이전 pagesize 페이지
				if (Paging.currentPage <= Paging.pageSize) {
					return false;
				}
				$form.find('#currentPage').val((parseInt((Paging.currentPage - 1) / Paging.pageSize) - 1) * Paging.pageSize + 1);
			} else if ($paging.hasClass('next')){	// 다음 pagesize 페이지
				if (Paging.currentPage === Paging.lastPageIndex || (Math.ceil(Paging.currentPage / Paging.pageSize) == Math.ceil(Paging.lastPageIndex / Paging.pageSize))) {
					return false;
				}
				$form.find('#currentPage').val(Math.ceil(Paging.currentPage / Paging.pageSize) * Paging.pageSize + 1);
			} else {	// 페이지 번호
				if (Paging.currentPage == $(this).text()) {
					return false;
				}
				$form.find('#currentPage').val($(this).text());
			}
			$form.submit();
			return false;
		});
	},
	/**
	 * submit 하기 위한 form 설정
	 * 
	 * @param actionUrl
	 *			호출 url
	 * @param formName
	 *			페이징에서 submit을 하기위한 form 이름(String)
	 */
	setForm : function(actionUrl, formName) {
		switch (arguments.length) {
			case 2 :
				if (typeof formName === 'string') {
					this.$pagingForm = $(document.getElementById(formName));
				}
			case 1 : 
				if (typeof actionUrl === 'string') {
					this.$pagingForm.attr('action', actionUrl);
				}
				break;
			default : 
				return false; 
		}
	},
	/**
	 * 현재페이지와 마지막페이지 index를 설정
	 * 
	 * @param currentPage
	 *			현재 페이지 index
	 * @param lastPageIndex
	 *			마지막 페이지 index
	 */
	setPageIndex : function(obj) {
		var $pagingDiv = $(obj).closest('.paging');
		this.currentPage = Number($pagingDiv.find('input:hidden[name=currentPage]').val());
		this.lastPageIndex = Number($pagingDiv.find('input:hidden[name=lastPageIndex]').val());
		this.pageSize = Number($pagingDiv.find('input:hidden[name=pageSize]').val());
	},
	init : function() {
		if ($('.paging').length > 0) {
			this.setForm(window.location.pathname, 'form');
			this.setPageIndex();
			this.goPage();
		}
	}
};

/** 공통 함수 * */
CommonFunc = {
	/**
	 * cvtJgbh
	 */
	cvtJgbh : function(str) {
		return str == null ? '' : replaceFront(str, 3, '*');
	},
	/**
	 * cvtGjbh
	 */
	cvtGjbh : function(str) {
		return str == null ? '' : replaceFront(str, 5, '*');
	},
	/**
	 * cvtJumin
	 */
	cvtJumin : function(str) {
		if (str == null) {
			return '';
		}
		return str.length == 14 ? str.substring(0, 6) + '-*******' : str;
	},
	/**
	 * toJuminFormat
	 */
	toJuminFormat : function(str) {
		if (str == null) return '';
		return str.length == 13 ? str.substring(0, 6) + '-' + str.substring(6, 13) : str;
	},
	/**
	 * replaceFront
	 */
	replaceFront : function(str, length, rep) {
	   if (str == null) return '';
	   var retVal = '';
	   if (str.length >= length) {
		   for(var i = 0; i < length; i++) {
			   retVal = retVal + rep;
		   }
		   retVal = retVal + str.substring(length);
	   }
	   return retVal;
	},
	/**
	 * 지정한 길이만큼 숫자 앞에 0을 채움
	 *
	 * @param length 표현 자리수
	 * @param source 대상 숫자
	 * @return string
	 *
	 */
	formatZeroString : function(p_source, p_length) {
		var tmp = '';

		if(parseInt(p_source, 10) == 'NaN') p_source = 0;

		for(var i=p_source.toString().length; i<p_length; i++) tmp+= '0';
		
		return tmp + p_source;
	},
	/**
	 * 대상 문자열에서 지정한 자리수의 뒷부분을 모두 0으로 치환
	 *
	 * @history			 2008-01-16 김형섭 추가
	 * @param src		   (string or number) 대상 숫자
	 * @param figureAmount  (number) 치환대상 뒷 자릿수
	 * @param flag		  (boolean) 숫자 이외의 문자 제거 유무
	 * @return number
	 *
	 */
	replaceFiguresAmountToZero : function(src, figureAmount, flag) {
		if((typeof src) != 'string') src = String(src);
		if(flag) src = src.replace(/[^0-9]/g, '');
		
		// 대상 문자열에서 0으로 치환될 뒷부분의 문자열
		var lastNumbers = src.substring( src.length - figureAmount, src.length );
		// 뒷부분의 0으로 치환될 문자열이 대상 문자열에서 마지막으로 시작되는 인덱스
		var lastIndexOfLastNumbers = src.lastIndexOf(lastNumbers);
		// 대상 문자열에서 뒷부분의 0으로 치환될 문자열을 제외한 나머지 앞부분 문자열
		var firstNumbers = src.substring( 0, lastIndexOfLastNumbers );
		var zeros = '';

		for(var i=0; i<figureAmount; i++) zeros+= '0';

		return parseInt(firstNumbers + zeros, 10);
	},
	/**
	 * 대상 문자열에서 지정한 자리수의 뒷부분 문자가 모두 0인지 체크
	 *
	 * @history			 2008-01-16 김형섭 추가
	 * @param src		   (string or number) 대상 숫자
	 * @param figureAmount  (number) 체크대상 뒷 자릿수
	 * @param flag		  (boolean) 숫자 이외의 문자 제거 유무
	 * @return number
	 *
	 */
	isValidFigureAmountFormat : function(src, figureAmount, flag) {
		if((typeof src) != 'string') src = String(src);
		if(flag) src = src.replace(/[^0-9]/g, '');

		// 대상 문자열에서 0으로 확인될 뒷부분의 문자열
		var lastNumbers = src.substring( src.length - figureAmount, src.length ); 
		var lastNumbersArray = '';
		
		if(lastNumbers != '') lastNumbersArray = lastNumbers.split('');

		for(var i=0; i<lastNumbersArray.length; i++)
		{
			if(lastNumbersArray[i] != '0') return false;
		}
		return true;
	},
	/**
	 * DWR 파라미터 전송을 위한 EVALUATE 함수
	 *
	 * eval() breaks when we use it to get an object using the { a:42, b:'x' }
	 * syntax because it thinks that { and } surround a block and not an object
	 * So we wrap it in an array and extract the first element to get around this.
	 * This code is only needed for interpreting the parameter input fields,
	 * so you can ignore this for normal use.
	 *
	 * The regex = [start of line][whitespace]{[stuff]}[whitespace][end of line]
	 *
	 * @history			 2008-01-16 김형섭 추가
	 * @param text		  (string) 대상 문자열
	 *
	 */
	evaluate : function(text) {
		text = text.replace(/\n/g, ' ');
		text = text.replace(/\r/g, ' ');
		if (text.match(/^\s*\{.*\}\s*$/)) text = '[' + text + '][0]';
		return eval(text);
	},
	/**
	 * XSS script check
	 */
	XSStextCheck : function(inputVal) {
		if (typeof inputVal === 'undefiend') {
			return true;
		}
		var textLan = inputVal.length;
		for (var i = 0; i < textLan; i++) {
			var chkText = inputVal.charAt(i);
			if (chkText == "<" || chkText == ">"  || chkText == "-"  || chkText== "=" || chkText == "'" ) {
				alert('특수문자는 사용할 수 없습니다. : \n' + inputVal);
				return true;
			}
		}
		return false;
	},
	/** 이메일 주소 체크 **/
	checkEmail : function(email) {
		if (email.indexOf("@") == -1 || email.indexOf(" ") != -1 || email.indexOf("*") != -1 ){
			   return false;
	      }
	      else{
			   if (email.indexOf(".") == -1){
				   return false;
			   }
			   else{
				   return true;
			   }	
	      }	
	},
	/** 입력 날짜 유효성 체크 **/
	checkDate : function(year, month, day) {
		if (year === '' || month === '' || day === '' || isNaN(year) || isNaN(month) || isNaN(day)) {
			return false;
		}
		if (year.length !== 4 || parseInt(year) < 1900) {
			return false;
		}
		if (parseInt(month) < 1 || parseInt(month) > 12) {
			return false;
		}
		if (parseInt(day) < 1 || parseInt(day) > 31) {
			return false;
		}
		// TODO 날짜체크 필요
		return true;
	},
	/** 해당 년월의 마지막 날짜를 조회 **/
	getLastDayOfMonth : function(year, month) {
		year = Number(year);
		month = Number(month);
		var dayList = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
		if (year % 1000 !== 0 && year % 4 === 0) {
			dayList[1] = 29;
		}
		return dayList[month -1];
	},
	/** 금액 format에서 숫자만을 return **/
	getNumber : function(value) {
		return parseInt(value.replace(/[^0-9]/gi, '') || 0, 10);
	},
	
	/**
	* 영문입력 체크 
	*/
	isEng : function (checkStr){	
		var cstr = checkStr;
		var flag = true;
		var pattern = /^[A-Za-z\s+]*$/gi;
		//입력이 영문인 것인지를 체크하는 함수
		if (pattern.test(cstr) == true){
			flag = false;	
		}
		return flag;
	},

	/**
	* 영문숫자입력 체크 
	*/
	isEngNum : function (checkStr){	
		var cstr = checkStr;
		var flag = true;
		var pattern = /^[_A-Za-z0-9\s+]*$/gi;
		//입력이 영문숫자인 것인지를 체크하는 함수
		if (pattern.test(cstr) == true){
			flag = false;	
		}
		return flag;
	},

	/**
	* 특수문자( - . 제외) 체크 
	*/
	isSpecialChar : function (checkStr){	
		var cstr = checkStr;
		var flag = true;
		var pattern = /['~!@#$%^&*|\\\'\";:\?<>()\]\[{}_+=,]/gi;
		//입력이 숫자인 것인지를 체크하는 함수
		if (pattern.test(cstr) == true){
			flag = false;	
		}
		return flag;
	},
	
	isAddressEng : function (checkStr) {
		var cstr = checkStr;
		var flag = true;
		var pattern = /^[-,A-Za-z0-9\s+]*$/gi;
		//입력이 숫자인 것인지를 체크하는 함수
		if (pattern.test(cstr) == true){
			flag = false;	
		}
		return flag;		
	},
	
	/** pc에서 공인인증서 skip을 위한 모바일 여부 return **/
	isMobile : function(){
		var agent = navigator.userAgent.toLowerCase();
		if(agent.indexOf('android') > -1
			|| agent.indexOf('iphone') > -1
			|| agent.indexOf('ipad') > -1){
			return true;
		}
		return false;
	},
	//모바일OS체크용
	typeMobileOS : function () {
		var agent = navigator.userAgent.toLowerCase();
		if(agent.indexOf('android') > -1) {
			return 'AOS';
		} else if(agent.indexOf('iphone') > -1 || agent.indexOf('ipad') > -1) {
			return 'IOS';
		} else {
			return false;
		}		
	},
	/**
	 * (업무)목록 탑네비 이벤트 바인딩 (moveScroll 및 메뉴 active 상태가 첫번째로 보이기)
	 */
	tabNaviEventBind : function(){
		//상단 스크롤 이벤트
		$('#nav .btnPrev').off().click(function(e){
			var currentWidth = $('div.scroller').scrollLeft();
			if(currentWidth > 0){
				$('.scroller').animate({scrollLeft : currentWidth -180}, 400);	
			} 
		});
		$('#nav .btnNext').off().click(function(e){
			var scrollWidth = $('div.scroller')[0].scrollWidth;
			var currentWidth = $('div.scroller').scrollLeft();
			if(currentWidth < scrollWidth-180){
				$('.scroller').animate({scrollLeft :  currentWidth + 180}, 400);	
			}
		});
		
		//페이지 로딩시 선택 된 매뉴까지 스크롤
		var scrollMove = 0;
		var scrollReset = 0;
		$('div.scroller li').each(function(){
			var self = $(this);
			if(self.hasClass('active')){
				scrollReset = 1;
			}
			if(scrollReset == 0){
				scrollMove = scrollMove + self.width();	
			}
		});
		$('.scroller').animate({scrollLeft :  scrollMove}, 1000);
	}, 
	
	/**
	 * 고액승인여부 및 고액신청 시간 체크
	 * @param 	checkeAmt 		: 금액
	 * 			standardAmt 	: 기준금액
	 * 			highYb			: 고액승인여부
	 */
	isHighAmtCheck : function(checkeAmt, standardAmt, highYb){
		
		//기준금액 미전달 시 리턴.
		if(isNull(standardAmt) || isNull(checkeAmt)){
			return false;
		}
		
		//기본 값 설정 및 유효성 체크.
		highYb = highYb||'N';
		var std = Number((String(standardAmt)||'0').replace(/[^(0-9)]/gi, ''));
		var jgy = Number((String(checkeAmt)||'0').replace(/[^(0-9)]/gi, ''));
		
		if(std <= jgy){

			var result = false;
			
			//시간체크
			$.ajax({
				type : 'POST',
				url: '/CYB/commonCyber/isHighTimeCheck.do',
				async: false,
				success: function(response, statusText) {
					if (!GlobalFunc.isErrorAjax(response)) {
						return false;
					}
					result = true;
				}
			});
			
			if(result == false){
				return false;
			}
			
			//승인여부 체크
			if(highYb != 'Y'){
				alert('본 계약은 고액계약(1억 초과)으로 고객센터(1577-1112)로 연락하여 등록하신 후 신청이 가능합니다.');
				return false;	
			}
		}
		return true;
	}
};

function parseParamStringToObj(parameter) {
	var params = parameter.split('&');
	var rtnObj = {};
	for (var i = 0; i < params.length; i++) {
		arrParam = params[i].split("=");
		rtnObj[arrParam[0]] = arrParam[1];
	}
	return rtnObj;
}


/* loading bar Object 
 * 사용법 
 * 		
 * 		시작 : gLoading.start();
 * 		종료 : gLoading.end();
 * 
 * */
var gLoading = new Loading();
function Loading() {
	var vm = this;
	
	/* ================ constant definitions ================ */
	vm.LOADING_LAYER_ID = '__loadingArea__';
	vm.LOADING_TEXT_ID = '__loadingText__';
	vm.LOADING_COUNT = 0;
	 
	/* ================ variable definitions ================ */
	vm.loadingInterval = null;
	
	/* ================ execution codes ================ */
	LOG('create loading...');
	
	/* ================ assign functions ================ */
	vm.start = start;
	vm.delayStart = delayStart;
	vm.setLoadingText = setLoadingText;
	vm.end = end;
	vm.count = vm.LOADING_COUNT;
	/* ================ function definitions ================ */
	function start() {
		vm.LOADING_COUNT++;
		if ($('#'+vm.LOADING_LAYER_ID).size() <= 0) {
			$(getLoadingHtml()).insertAfter('#innerWrap');
		} else {
			//로딩바가 있을 경우 리턴하지 않아, 아래 로직을 실행하여 이미지 로딩바 속도영향으로 수정.
			return false;
		}
		$('#' + vm.LOADING_LAYER_ID).css('z-index', '999999');
		$('#' + vm.LOADING_LAYER_ID).show(); 
		
	}

	//$.post를 연속으로 쓸 경우 ajaxPrefilter complete에서 setTime, 1000 으로 로딩제거하기에 딜레이있는 수동 start()추가
	function delayStart(delayTime) {
		
		if(delayTime == undefined){
			delayTime = 1010;
		}
		setTimeout(function(){
			vm.start();
			vm.LOADING_COUNT--;
		}, delayTime);
	}
	
	function end() {
		clearInterval(vm.loadingInterval);
		if (vm.LOADING_COUNT <= 1) {
			$('#' + vm.LOADING_LAYER_ID).remove();
		}
		vm.LOADING_COUNT--;
	}
	
	function setLoadingText(loadingText) {
		$('#' + vm.LOADING_TEXT_ID).removeClass('disNone');
		$('#' + vm.LOADING_TEXT_ID).html(loadingText);
	}
	/* 2020 - loding 변경 */
	function getLoadingHtml(){
		var	loadingHtml  = '<div id="'+vm.LOADING_LAYER_ID+'" class="loading">\n';
			loadingHtml += '	<div class="back"></div>\n';
			loadingHtml += '	<div class="loding_box">\n';
			loadingHtml += '		<div class="loader">\n';
			loadingHtml += '		</div>\n';
			loadingHtml += '		<p id="'+vm.LOADING_TEXT_ID+'" class="disNone"></p>\n';
			loadingHtml += '	</div>\n';
			loadingHtml += '</div>\n';
			
		return loadingHtml; 
	}
	/* //2020 - loding 변경 */
}

var gLoginExtension = new LoginExtension();
function LoginExtension() {
	var vm = this;
	
	/* ================ constant definitions ================ */
	vm.EXTENSION_LAYER_ID = '__loginExtensionArea__';
	vm.IS_SHOW_EXTENSION = false;
	
	/* ================ variable definitions ================ */
	vm.timeInterval = null;
	vm.maxTime = 60 * 10;		/* 세션 연장 최대 시간 */
	vm.time = 60 * 10;			/* 세션 연장 남은 시간 */
	vm.checkTime = 60;		/* 타임아웃 확인 시간 */
	/* test용도 */
	//vm.maxTime = 63;
	//vm.time = 63;
	/* test용도 */		
	/* ================ execution codes ================ */
	LOG('create LoginExtension...');
	
	/* ================ assign functions ================ */
	vm.init = initTime;		//초기화
	vm.reLogin = reLogin;	//로그인
	vm.logout = logout;		//로그아웃
	/* ================ function definitions ================ */
	function initTime(){
		//초기화 및 타이체크 시작
		if ($('#' + vm.EXTENSION_LAYER_ID).size() <= 0) {
			$(getLoginExtensionHtml()).insertAfter('#innerWrap');
		}			
		$('#' + vm.EXTENSION_LAYER_ID).find('#infoTimeMsg').html('<em>'+vm.time+'</em>초 후 자동 접속 종료 예정입니다.');
		vm.timeInterval = setInterval(checkTime, 1000);
	}
	
	function checkTime(){
		vm.time = vm.time - 1;
		//LOG('vm.time==' + vm.time);
		
		if (vm.time <= vm.checkTime) {
			//레이어 오픈하기
			if (!vm.IS_SHOW_EXTENSION) {
				showExtension();
			}
			$('#' + vm.EXTENSION_LAYER_ID).find('#reLoginBtn').focus();
		}
		
		if (vm.time > 0){
			$('#' + vm.EXTENSION_LAYER_ID).find('#infoTimeMsg > em').text(vm.time);
			$('#' + vm.EXTENSION_LAYER_ID).find('#infoTimeMsg > em').show();
		} else {
			clearInterval(vm.timeInterval);
			$('#' + vm.EXTENSION_LAYER_ID).find('#infoTimeMsg').html('<em>1</em>초 후 메인화면으로 이동합니다.');
			setTimeout(logout, 1000);
		}		
	}

	function showExtension(){
		scrollLockYn('Y');
		
		$('#' + vm.EXTENSION_LAYER_ID).find('.popup').css('top', ($(window).height() / 2) - 110 +'px');
		$('#' + vm.EXTENSION_LAYER_ID).css('z-index', '9999999');		//모든 팝업 보다 위
		$('#' + vm.EXTENSION_LAYER_ID).show();
		vm.IS_SHOW_EXTENSION = true;
	}
	
	function reLogin(){
		$.post('/CYB/cyberLogin/reLogin.do', function() {
			closeExtension();
			vm.time = vm.maxTime;
			initTime();	//재시작
			return false;
		});
	}
	
	function logout(){
		window.location.href= '/CYB/cyberLogin/cyberLogout.do';
	}
	
	function closeExtension(){
		scrollLockYn('N');
		clearInterval(vm.timeInterval);
		$('#' + vm.EXTENSION_LAYER_ID).hide();
		vm.IS_SHOW_EXTENSION = false;
	}
	
	function scrollLockYn(lockYn){
		if (lockYn == 'Y') {
			$("html, body,#innerWrap").addClass("overNo");
			$("#innerWrap").off("touchmove").on("touchmove", function(e) {
				e.preventDefault();
			});			
		} else {
			//body scroll Lock 해제
			$("html, body,#innerWrap").removeClass("overNo");
			$("#innerWrap").off("touchmove");
		}
		
	}
	
	function getLoginExtensionHtml() {
		var extensionHtml = '';
		extensionHtml += '<article id="'+vm.EXTENSION_LAYER_ID+'" class="layerWrap">\n';
		extensionHtml += '<div class="popupLayer popStyle02">\n';
		extensionHtml += '	<div class="back">딤드영역</div>\n';
		extensionHtml += '	<div class="layerContent">\n';
		extensionHtml += '		<div class="popup">\n';
		extensionHtml += '			<div class="popHead">\n';
		extensionHtml += '				<h1>로그인시간 연장</h1>\n';
		extensionHtml += '			</div>\n';
		extensionHtml += '			<div class="popCont">\n';
		extensionHtml += '				<div class="boxStyle02 pdType01">\n';
		extensionHtml += '					<p class="bg_clock"><span id="infoTimeMsg"><em>60</em>초 후<br /> 자동 접속 종료 예정입니다.</span></p>\n';
		extensionHtml += '				</div>\n';
		extensionHtml += '				<div class="clock_txtBox">\n';
		extensionHtml += '					<p class="tc mb10">안전한 금융거래를 위하여 <em class="colorPk">10분</em> 동안 거래가 없을 경우 자동으로 접속 종료됩니다.</p>\n';
		extensionHtml += '					<p class="tc colorGn">지금 로그인 시간을 연장하시겠습니까?</p>\n';
		extensionHtml += '				</div>\n';
		extensionHtml += '				<div class="btnArea per ">\n';
		extensionHtml += '					<span><button type="button" id="reLoginBtn" onclick="gLoginExtension.reLogin();" class="btnMd bt01">로그인시간 연장하기</button></span>\n';
		extensionHtml += '					<span><button type="button" id="extensionLogout" onclick="gLoginExtension.logout();" class="btnMd">로그아웃</button></span>\n';
		extensionHtml += '				</div>\n';
		extensionHtml += '			</div>\n';
		extensionHtml += '		</div>\n';
		extensionHtml += '	</div>\n';
		extensionHtml += '</div>\n';
		extensionHtml += '</article>\n';
		
		return extensionHtml;
	}
}


/* jquery ajax 셋팅
 *  error function
 *  beforeSend function
 *  complete function 
 * 
 * */
$.ajaxPrefilter(function (options, originalOptions, jqXHR){

    // error handling
    var errorHandler    = originalOptions.error;
    if (!errorHandler) {
        options.error   = function (jqXHR, textStatus, errorThrown) {
        
        	/** 201906xx AJAX 요청 시 세션이 끊겼을 경우 (단, 그전에 로그인 연장팝업이 떠서, 시간이 되면 로그인 페이지로 강제 이동이 되어야 하지만 그렇지 못한경우 **/
            if(jqXHR.status == 999){
        		alert('로그인 후 다시 이용하시기 바랍니다.');
				location.href='/CYB/cyberLogin/cyberLogin.do';
        	}
        };
    } else {
        options.error   = errorHandler;
    }
    
    // before handling
    var beforeHandler    = originalOptions.beforeSend;
    if (!beforeHandler) {    
    	options.beforeSend = function(xmlHttpRequest){
    		
    		/** 201906xx AJAX 요청 시 세션이 끊겼을 경우 (단, 그전에 로그인 연장팝업이 떠서, 시간이 되면 로그인 페이지로 강제 이동이 되어야 하지만 그렇지 못한경우 **/
	    	xmlHttpRequest.setRequestHeader("AJAX", "Y");
	    	
	    	gLoading.start();
	    };
    } else {
    	options.beforeSend   = beforeHandler;
    }
    // complete Handling
    var completeHandler = originalOptions.complete;
    if (!completeHandler) {
    	options.complete = function(){
			setTimeout(function(){
				gLoading.end();	
			}, 1000);
    	};
    	
    } else {
    	options.complete = completeHandler;
    }
});

/* ================ Object function definitions ================ */

/* ================ function definitions ================ */
function onlyNumberInput(obj) { 
	val = '' + obj.value;
	re = /[^0-9]/gi;
	obj.value = val.replace(re, '');
}
/**
 * 입력 숫자값의 3자리마다 쉼표(comma)를 찍음
 *
 * @history             2008-01-21 김형섭 추가
 * @history             2010-12-30 김형섭 수정
 * @param obj           (Element) 대상 엘리먼트
 * @return void
 *
 */
function inputMoneyFormat(obj, e) {
    if(!e) e = window.event;

    if(e.which) var keycode = e.which;
    else var keycode = e.keyCode;

    // 탭과 백스페이스는 패스대상 제외
    if(keycode == 37) return; // ←(방향키) 패스
    if(keycode == 39) return; // →(방향키) 패스

    var str = obj.val().replace(/[^0-9]/gi,''); // 숫자가 아닌 문자는 모두 제거
    var cnt = 0; // 뒤에서 몇번째인지를 체크 
    var res = '';

    // 입력숫자가 없을 경우 0으로 초기화
    if(str == '') 
    {
        str = '0';
        obj.val(str);
    }
    
    // 입력숫자가 0 한글자의 경우는 허용
    if(str == '0') return;

    // 첫자리의 입력숫자가 0인경우 첫자리의 0을 제거
    if(str.charAt(0) == '0') str = str.substring(1); 

    obj.val(str);

    // 뒤에서 부터 루핑
    for (var i=(str.length-1); i>=0; i--)
    {
        var cha = str.charAt(i); 
        
        if (cnt != 0 && cnt % 3 == 0) res = cha + ',' + res; 
        else res = cha + res;
        
        cnt++; 
    } 

    obj.val(res);

    return;
} 

/**
 * 대상 문자열에서 지정한 자리수의 뒷부분 문자가 모두 0인지 체크
 *
 * @history             2008-01-16 김형섭 추가
 * @param src           (string or number) 대상 숫자
 * @param figureAmount  (number) 체크대상 뒷 자릿수
 * @param flag          (boolean) 숫자 이외의 문자 제거 유무
 * @return number
 *
 */
function isValidFigureAmountFormat(src, figureAmount, flag) {
    if((typeof src) != 'string') src = String(src);
    if(flag) src = src.replace(/[^0-9]/g, '');

    // 대상 문자열에서 0으로 확인될 뒷부분의 문자열
    var lastNumbers = src.substring( src.length - figureAmount, src.length ); 
    var lastNumbersArray = '';
    
    if(lastNumbers != '') lastNumbersArray = lastNumbers.split('');

    for(var i=0; i<lastNumbersArray.length; i++)
    {
        if(lastNumbersArray[i] != '0') return false;
    }

    return true;
}
/**
 * 대상 문자열에서 지정한 자리수의 뒷부분을 모두 0으로 치환
 *
 * @history             2008-01-16 김형섭 추가
 * @param src           (string or number) 대상 숫자
 * @param figureAmount  (number) 치환대상 뒷 자릿수
 * @param flag          (boolean) 숫자 이외의 문자 제거 유무
 * @return number
 *
 */
function replaceFiguresAmountToZero(src, figureAmount, flag) {
    if((typeof src) != 'string') src = String(src);
    if(flag) src = src.replace(/[^0-9]/g, '');
    
    // 대상 문자열에서 0으로 치환될 뒷부분의 문자열
    var lastNumbers = src.substring( src.length - figureAmount, src.length );
    // 뒷부분의 0으로 치환될 문자열이 대상 문자열에서 마지막으로 시작되는 인덱스
    var lastIndexOfLastNumbers = src.lastIndexOf(lastNumbers);
    // 대상 문자열에서 뒷부분의 0으로 치환될 문자열을 제외한 나머지 앞부분 문자열
    var firstNumbers = src.substring( 0, lastIndexOfLastNumbers );
    var zeros = '';

    for(var i=0; i<figureAmount; i++) zeros+= '0';

    return parseInt(firstNumbers + zeros, 10);
}
/**
 * MONEY 포맷의 문자열을 숫자로 변환
 *
 */
function toNumberFromMoney(str) {
    return parseInt( str.replace(/,/g, ''), 10 );
}


/**
 * 날짜의 유효성을 검증
 */
function isValidDate(inputDate) {
	var rslt = true;
	var cstr = inputDate.replace("-", "");
	cstr = inputDate.replace(/\//gi, '');
	var buffer = "";
	var	arrLastDay = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
	for (var i = 0;i < cstr.length;i++){
		ch = cstr.charAt(i);
		if (ch < "0" || ch > "9"){
			continue;
		}else{
			buffer = buffer + ch;
		}
	} 
	
	
	if(buffer.length != 8){
		alert("입력된 날짜형식이 유효하지 않습니다. 예)20130426");
		rslt = false;
	}
	
	var yyyy =  buffer.substring(0, 4);
	var mm = buffer.substring(4, 6);
	var dd = buffer.substring(6);
	
	if (rslt && (mm%1 != 0 || yyyy%1 != 0 || dd%1 != 0)){ //정수체크
		alert("입력된 날짜형식이 유효하지 않습니다. 예)20130427");
		rslt = false;
	}
	
	if(rslt && ((mm<1) || (mm>12))){ //월체크
		alert("입력된 날짜형식이 유효하지 않습니다. 예)20130428");
		rslt = false;
	}
	
	if(rslt && ((dd<1) || (dd>31))){ //일체크
		alert("입력된 날짜형식이 유효하지 않습니다. 예)20130429");
		rslt = false;
	}
	
	//if (yyyy%1000 != 0 && yyyy%4 ==	0) arrLastDay[1] = 29; //윤년체크
	if(yyyy % 4 == 0) {
		if(yyyy % 100 == 0) {
			if(yyyy % 400 == 0) {
				arrLastDay[1] = 29; //윤년체크	
			}
		} else {
			arrLastDay[1] = 29; //윤년체크
		}
	}
	
	if (rslt && (dd > arrLastDay[mm-1] || dd < 1)) { //홀수 짝수 월 체크
		alert("입력된 날짜형식이 유효하지 않습니다. 예)20130430");
		rslt = false;
	}
	
	return rslt;
};

/**
 * null이나 empty Sting인지 체크합니다. 
 */
function isNull(value){
	
	if (value == null || value.length == 0)	{
		return true;
	}
	
	return false;
};

/*
 *	보험 상태값으로 이미지를 리턴
 *  param1 : status - 보험 상태값
 *  return  : rtnImgTag - 보험 상태값에 따르 img html tag
 */
function getInsuStatus(status){
	var rtnImgTag = '';
	
	switch(status) {		
		case '정상유지'		: rtnImgTag = '<img src="/images/cyber/txt_joinCheck01.png" alt="정상유지" />' ; break;
		case '지급(소멸)' 	: rtnImgTag = '<img src="/images/cyber/txt_joinCheck02.png" alt="지급(소멸)" />' ; break;
		case '기타소멸' 		: rtnImgTag = '<img src="/images/cyber/txt_joinCheck03.png" alt="기타소멸" />'  ; break;
		case '취소' 			: rtnImgTag = '<img src="/images/cyber/txt_joinCheck04.png" alt="취소" />'  ; break;
		case '청약철회' 		: rtnImgTag = '<img src="/images/cyber/txt_joinCheck05.png" alt="청약철회" />'  ; break;
		case '해지무효' 		: rtnImgTag = '<img src="/images/cyber/txt_joinCheck06.png" alt="해지무효" />'  ; break;
		case '기실효'		: rtnImgTag = '<img src="/images/cyber/txt_joinCheck07.png" alt="기실효" />' ; break;
		case '당월실효'	 	: rtnImgTag = '<img src="/images/cyber/txt_joinCheck08.png" alt="당월실효" />'  ; break;		
		case '시효소멸'	 	: rtnImgTag = '<img src="/images/cyber/txt_joinCheck09.png" alt="휴면" />'  ; break;		
		case '휴면출연'	 	: rtnImgTag = '<img src="/images/cyber/txt_joinCheck10.png" alt="휴면출연" />'  ; break;		
		case '미결'     	 	: rtnImgTag = '<img src="/images/cyber/txt_joinCheck11.png" alt="미결" />' ; break;
		case '만기'     	 	: rtnImgTag = '<img src="/images/cyber/txt_joinCheck12.png" alt="만기" />' ; break;
		case '지급(만기)'    : rtnImgTag = '<img src="/images/cyber/txt_joinCheck13.png" alt="지급(만기)" />' ; break;
	}
	
	return rtnImgTag;
}				

/**
 * 콘솔로그
 *
 * @param msg 출력할 메시지
 * @param source 소스파일명
 */
function LOG(msg, source) {

    try {
        var console = window.console || { log : function () {} };
        var	log	= source ? source + ']' + msg : msg;
        console.log(log);
    } catch (e) {
    }
}
/*
 * 금액 한글화
 */
function amtKorean(num) {
	
	if(num != undefined){
		num = num.replace(/[^0-9]/gi,'');//특수문자 제거 (한글 금액은 소수점 지원하지 않기에 '.' 또한 제거
	}
	
	var hanA = new Array("","일","이","삼","사","오","육","칠","팔","구","십"); 
	var danA = new Array("","십","백","천","","십","백","천","","십","백","천","","십","백","천"); 
	var result = ""; 
	for(i = 0; i < num.length; i++) {	
		str = ""; 
		han = hanA[num.charAt(num.length-(i+1))]; 
		if(han != "") {
			str += han+danA[i]; 
		}
		//만단위
		if(i == 4) {	
			str += "만";	
		}
		//억단위
		if(i == 8) {
			str += "억"; 
		}
		//조단위
		if(i == 12) {
			str += "조"; 
		}
		result = str + result; 
	}		
	if(num != 0) {
		result = result + "원"; 
	}
	return result ; 
}

/**
 * 숫자입력 체크 
 */
function onlyNum(elementId){
	document.getElementById(elementId).onkeyup = function(e) {
		var valE = $("#" + elementId).val();
		var pattern = /[^0-9\-]+$/gi;
		
		if(pattern.test(valE)){
			alert("숫자만 입력 가능합니다.");
			$("#" + elementId).val("");
		}
	};
};

/**
 * 금액을 숫자로 변환하고, max 길이까지만 표기. (comma는 옵션)
 * param object, param displayObject
 * Element setting value.
 * 1. Object attr 'max' : maxlength
 * 2. Object attr 'data-comma' : comma flag
 */
function setAmtField(obj, displayObj){

	var max = obj.attr('max')||'999999999999999';
	var comma = obj.attr('data-comma')||undefined;
	
	var value = obj.val().replace(/[^0-9]/g, '');
	
	if(isNull(value)){
		obj.val('');
		if(displayObj != undefined){
			displayObj.html('');	
		}
		return false;
	}
	
	if(Number(value) == 0){
		obj.val('0');
		if(displayObj != undefined){
			displayObj.html('');	
		}
		return false;
	}
	
	var maxlength = max.length;
	if(value.length > maxlength){
		value = Number(value.slice(0, maxlength));
	} else {
		value = Number(value)+'';
	}
	
	obj.val(comma == undefined ? value : value.addComma());
	
	if(displayObj != undefined){
		displayObj.html(amtKorean(value.replace(/[^0-9]/g, '')));
	}
	
	return true;
}

/**
 * Storage 공통함수 (설정)
 * key : storage key 값
 * value : storage value 값
 * storagePlace : storage 저장 장소
 */
function setStorage(key, value, storagePlace) {
	var place;
	
	if(typeof storagePlace == "undefined") {
		place = sessionStorage;
	} else if(storagePlace.toLowerCase() == "local") {
		place = localStorage;
	} else if(storagePlace.toLowerCase() == "session") {
		place = sessionStorage;
	} else {
		LOG("Storage Place Type Error!");
		return;
	}
	
	place.setItem(key, JSON.stringify(value));
}


/**
 * Storage 공통함수 (조회)
 * key : storage key 값
 * storagePlace : storage 저장 장소
 */
function getStorage(key, storagePlace) {
	var place;
	
	if(typeof storagePlace == "undefined") {
		place = sessionStorage;
	} else if(storagePlace.toLowerCase() == "local") {
		place = localStorage;
	} else if(storagePlace.toLowerCase() == "session") {
		place = sessionStorage;
	} else {
		LOG("Storage Place Type Error!");
		return;
	}
	
	return JSON.parse(place.getItem(key));
}

/**
 * Storage 공통함수 (삭제)
 * key : storage key 값
 * storagePlace : storage 저장 장소
 */
function removeStorage(key, storagePlace) {
	var place;
	
	if(typeof storagePlace == "undefined") {
		place = sessionStorage;
	} else if(storagePlace.toLowerCase() == "local") {
		place = localStorage;
	} else if(storagePlace.toLowerCase() == "session") {
		place = sessionStorage;
	} else {
		LOG("Storage Place Type Error!");
		return;
	}
	
	return place.removeItem(key);
}
/*
 * 레이어팝업 오픈
 */
function gfnOpenLayer(el, btnObj){
	var temp = $('#' + el);   //레이어의 id를 temp변수에 저장
	var back = temp.prev().hasClass('back');  //dimmed 레이어를 감지하기 위한 boolean 변수
	$('.popup').css('height', $(window).height() );
	
	$('.layerWrap').hide();
	temp.parent('.layerWrap').show();
	temp.show();	

	
	if (temp.hasClass('popStyle02')) {	//중앙에 띄우는 팝업의 경우
		/* 전체 레이어가 아닌경우 스크롤 Lock */
		$('body').on('touchmove', function(e){	//아이폰 스크롤 막기
			e.preventDefault();
		});
		
		$('html, body, #innerWrap').addClass('overNo');// 부모창 scroll lock 안드로이드 스크롤막기
		//화면의 중앙에 레이어를 띄운다.
		//temp.find('.popup').css('margin-top', temp.find('.popup').outerHeight()/6+'px');
		temp.find('.popup').css('display', 'fixed').css('height', temp.find('.popCont').height() + 68).css('top', ($(window).height() / 2) - (temp.find('.popCont').height() / 2) - 26.5);		
		temp.parent('.layerWrap').css('z-index', '901');
		
	} else if ( temp.hasClass('popStyle03') ){
		$('body').on('touchmove', function(e){	//아이폰 스크롤 막기
			e.preventDefault();
		});		
		temp.find('.popup').css('height', temp.find('.popCont').height() + 30).css('top', ($(window).height() / 2) - (temp.find('.popCont').height() / 2) - 15);		
		temp.parent('.layerWrap').css('z-index', '901');
		

	} else {
		$('#innerWrap').on('touchmove', function(e){
			e.preventDefault();
		});		
		$('html, body, #innerWrap').addClass('overNo');// 부모창 scroll lock
	}	


	temp.find('.close, .btnClose').click(function(){
		
		temp.parent('.layerWrap').hide();   //'닫기'버튼을 클릭하면 레이어가 사라진다.
		$("html, body, #innerWrap").removeClass("overNo");
		$("#innerWrap").off("touchmove").css("overflow","auto");
		$('body').off('touchmove');
		
		if (btnObj != 'undefined') {
			$(btnObj).focus();
		}
		return false;
	});
	/* 
	 * 확인버튼에 기능없이 팝업을 닫을 때  
	 */
	if (temp.find(':button[name="closeBtn"]').size() > 0) {
		temp.find(':button[name="closeBtn"]').click(function(){
			temp.parent('.layerWrap').hide();   //'닫기'버튼을 클릭하면 레이어가 사라진다.
			$("html, body, #innerWrap").removeClass("overNo");
			$("#innerWrap").off("touchmove").css("overflow","auto");
			$('body').off('touchmove');
			
			if (btnObj != 'undefined') {
				$(btnObj).focus();
			}
			
			return false;
		});
	}
 };
 
 /*
  * 201905 레이어팝업 종료 추가 by 88451
  */
 function gfnCloseLayer(el, btnObj){
 	var temp = $('#' + el);   //레이어의 id를 temp변수에 저장
 		
	temp.parent('.layerWrap').hide();   //'닫기'버튼을 클릭하면 레이어가 사라진다.
	$("html, body, #innerWrap").removeClass("overNo");
	$("#innerWrap").off("touchmove").css("overflow","auto");
	$('body').off('touchmove');
	
	if (btnObj != 'undefined') {
		$(btnObj).focus();
	}
	
	return false;
 }
  
//쿠키셋팅
function setCookie(name, value, expiredays){
	var todayDate = new Date();
	todayDate.setDate(todayDate.getDate() + parseInt(expiredays));
	document.cookie = name + "=" + escape(value) + ",expires=" + todayDate.toGMTString() + ",";
}

//쿠키정보를 가져온다
function getCookie(name){
	var Found = false;
	var start, end;
	var i=0;

 	while(i <= document.cookie.length){
 		start =i;
 		end = start + name.length;

 		if(document.cookie.substring(start, end)==name){
 			Found = true;
 			break;
 		}
 		i++;
 	}

 	if(Found == true){
 		start = end + 1;
 		end = document.cookie.indexOf(",", start);
 		if(end<start){
 			end = document.cookie.length;
 		}
 		return document.cookie.substring(start, end);
 	}
 	return "";
} 

/**
 * 6, 8자리의 숫자를 날짜형태의 포맷으로 변환 2007/09/13 추가 (김형섭)////////// 이거 getDateString 사용으로 수정해야함...
 * @param sourceNumber 대상숫자
 * @param formatLength 자리수
 * @return 날짜
 */
function toDateFormat(str)
{
    str = str||'';
    
    if (str.length == 6) {
        return str.substring(0, 4) + "/" + str.substring(4, 6);
    } else if (str.length == 8 || str.length == 14) {
        return str.substring(0, 4) + "/" + str.substring(4, 6) + "/" + str.substring(6, 8);
    } else {
        return str;
    }
}

function getSecToMinuteFormat(secondTime) {
	var min = parseInt(secondTime / 60);
	var sec = secondTime % 60;
	if (String(sec).length < 2) {
		sec = "0" + sec;
	}
	
	return min + ":" +sec;
};

/* ================ function definitions ================ */

/* ================ 휴대폰 인증 Layer definitions ================ */
/**
 * hpAuth Layer : incCommonLayer.jsp
 */
var hpAuth = {};
/**
 * type : 2factor(서명용), cert(본인인증), 
 */
hpAuth.defaultSettings = {
	'proc' : 'twofactor'
};

//휴대폰인증 입력 레이어팝업
hpAuth.showLayer = function(btnObj, settings) {
	hpAuth.openBtnObj = btnObj;
	gfnOpenLayer('layerHpAuth', $(hpAuth.openBtnObj));
	
	if ($('#hpAuthNumber').val() == '') {
		$('#hpAuthNumber').attr('disabled', true);	//인증번호 입력필드 비활성화
	}
	
	if (typeof settings != 'undefined') {
		hpAuth.defaultSettings = settings;
	}
	
	if (hpAuth.defaultSettings.proc == 'twofactor') {
		//각 필드에 고객정보 셋팅 함수 호출
	}
};

hpAuth.closeLayer = function() {
	gfnCloseLayer('layerHpAuth', $(hpAuth.openBtnObj));
};

hpAuth.checkAll = function (checkbox) {
	if ($(checkbox).prop('checked')) {
		$('#hpAuthCheckArea input[type="checkbox"]').prop('checked', true);
	} else {
		$('#hpAuthCheckArea input[type="checkbox"]').prop('checked', false);
	}
};

//휴대폰본인인증 : 입력값 유효성 검사 
hpAuth.validate = function(validType) {
	
	if (validType == 'callAuthNumber') {
		if (!$('#hpAuthAgreeCheck01').prop('checked')) {
			alert('[필수]통신사 이용약관 동의하시기 바랍니다.');
			$('#hpAuthAgreeCheck01').focus();
			return false;
		}
		if (!$('#hpAuthAgreeCheck02').prop('checked')) {
			alert('[필수]본인확인 서비스 이용약관 동의하시기 바랍니다.');
			$('#hpAuthAgreeCheck02').focus();
			return false;
		}
		if (!$('#hpAuthAgreeCheck03').prop('checked')) {
			alert('[필수]개인정보 이용 동의하시기 바랍니다.');
			$('#hpAuthAgreeCheck03').focus();
			return false;
		}
		if (!$('#hpAuthAgreeCheck04').prop('checked')) {
			alert('[필수]고유식별정보 처리 동의하시기 바랍니다.');
			$('#hpAuthAgreeCheck04').focus();
			return false;
		}
		
		if ($('#hpAuthName').val() == '') {
			alert('이름을 입력하시기 바랍니다.');
			$('#hpAuthName').focus();
			return false;
		}
		if ($('#hpAuthBirth').val() == '') {
			alert('주민번호 앞자리를 입력하시기 바랍니다.');
			$('#hpAuthBirth').focus();
			return false;
		}
		if ($('#hpAuthGender').val() == '') {
			alert('주민번호 뒤 1자리를 입력하시기 바랍니다.');
			$('#hpAuthGender').focus();
			return false;
		}
		
		if ($('#hpAuthTelCorp').val() == '') {
			alert('통신사를 선택하시기 바랍니다.');
			$('#hpAuthTelCorp').focus();
			return false;
		}
		if ($('#hpAuthTel1').val() == '') {
			alert('휴대폰 번호 앞자리를 선택하시기 바랍니다.');
			$('#hpAuthTel1').focus();
			return false;
		}
		
		if ($('#hpAuthTel2').val() == '' || $('#hpAuthTel2').val().length < 7) {
			alert('휴대폰 번호를 정확하게 입력하시기 바랍니다.');
			$('#hpAuthTel2').focus();
			return false;		
		}
	} else if (validType == 'confirmAuthNumber'){
		if ($('#hpAuthNumber').val() == '') {
			alert('인증번호를 입력하시기 바랍니다.');
			$('#hpAuthNumber').focus();
			return false;		
		}
		
		if (!hpAuth.authTimeOver) {	//입력시간 종료 여부
			alert('인증번호 입력시간이 종료되었습니다. \n인증요청 버튼을 다시 눌러서 진행하시기 바랍니다.');
			$('#callHpAuthNumberBtn').prop('disabled', false);
			$('#callHpAuthNumberBtn').focus();
			return false;
		}
	} else {
		alert('잘못된 접근입니다.');
		return false;
	}
	
	return true;
};

//휴대폰본인인증 : 인증번호 요청
hpAuth.callHpAuthNumber = function(btnObj) {
	if (!hpAuth.validate('callAuthNumber')) {
		return false;
	}
	
	//휴대폰 본인인증 시 - 4키 고객조회
	if (hpAuth.defaultSettings.proc == 'cert') {
		var isConfirmMember = false;
		$.ajax({
			type : 'POST',
			url: '/commonAuth/confirmMember.do',
			data : $('#hpAuthForm').serialize(),
			async: false,
			success: function(response, statusText) {
				if (response.rtcd != '000') {
					alert(response.rtmsg);
					isConfirmMember = false;
				} else {
					isConfirmMember = true;
				}
			}
		});		
		if (!isConfirmMember) {
			return false;
		}
	}
	
	$('#hpAuthForm').find('input, select').prop('disabled', false);
	$.post('/commonAuth/callHpAuthNumber.do', $('#hpAuthForm').serialize(), function(response) {
		if (response.rtcd != '000') {
			alert(response.rtmsg);
			return false;
		} else {
			alert(response.rtmsg);
			$('#callHpAuthNumberBtn').attr('disabled', true);
			$('#hpAuthNumber').attr('disabled', false);
			hpAuth.initTime();
		}
	});	
};

//휴대폰본인인증 : 인증번호 확인
hpAuth.confirmHpAuthNumber = function(btnObj, callback) {
	if (!hpAuth.validate('confirmAuthNumber')) {
		return false;
	}
	
	$.post('/commonAuth/confirmHpAuthNumber.do', $('#hpAuthForm').serialize(), function(response) {
		if (response.rtcd != '000') {
			alert(response.rtmsg);
			return false;
		} else {
			alert(response.rtmsg);
			$('#callHpAuthNumberBtn').attr('disabled', false);
			hpAuth.resetTime();
			hpAuth.closeLayer();
			
			if (typeof callback == 'function' ) {
				callback();
			}
		}
	});		
};

hpAuth.timeInterval = null;		
hpAuth.authTimeOver = true;		//인증번호 입력시간 종료여부	: false 가 종료
hpAuth.defaultTime = 60 * 3;	//최초시간 3분

//휴대폰본인인증 : 인증번호 입력 시간 체크
hpAuth.initTime = function() {
	
	hpAuth.resetTime();
	hpAuth.timeInterval = setInterval(hpAuth.checkHpAuthTime, 1000);
};

hpAuth.checkHpAuthTime = function (){
	hpAuth.curTime = hpAuth.curTime - 1;	
	
	if (hpAuth.curTime < 0) {
		hpAuth.authTimeOver = false;
		clearInterval(hpAuth.timeInterval);
	} else {
		$('#hpAuthTimeLimit').text(getSecToMinuteFormat(hpAuth.curTime));
	}
};

hpAuth.resetTime = function() {
	clearInterval(hpAuth.timeInterval);
	hpAuth.authTimeOver = true;
	hpAuth.curTime = hpAuth.defaultTime;
	$('#hpAuthTimeLimit').text(getSecToMinuteFormat((hpAuth.curTime)));
};
/* ================ 휴대폰 인증 Layer definitions ================ */

/* ================ 카카오페이 Layer definitions ================ */
/**
 * kakaoAuth Layer : incCommonLayer.jsp
 */
var kakaoAuth = {};
/**
 * type : elecSign(전자서명), cert(본인인증), 
 */
kakaoAuth.defaultSettings = {
	'proc' : 'elecSign'
};
//휴대폰인증 입력 레이어팝업
kakaoAuth.showLayer = function(btnObj, settings) {
	kakaoAuth.openBtnObj = btnObj;
	gfnOpenLayer('layerKAKAO', $(kakaoAuth.openBtnObj));
	
	if (typeof settings != 'undefined') {
		kakaoAuth.defaultSettings = settings;
	}
	
	//서명데이터
	$('#kakaoAuthForm input[name="signData"]').val(kakaoAuth.defaultSettings.signData);
	$('#kakaoAuthForm input[name="proc"]').val(kakaoAuth.defaultSettings.proc);
	
};

kakaoAuth.closeLayer = function() {
	gfnCloseLayer('layerKAKAO', $(kakaoAuth.openBtnObj));
};

kakaoAuth.checkAll = function (checkbox) {
	if ($(checkbox).prop('checked')) {
		$('#kakaoAuthCheckArea input[type="checkbox"]').prop('checked', true);
	} else {
		$('#kakaoAuthCheckArea input[type="checkbox"]').prop('checked', false);
	}
};

//카카오인증 : 입력값 유효성 검사 
kakaoAuth.validate = function() {
	
	if (!$('#kakaoAuthAgreeCheck01').prop('checked')) {
		alert('[필수]개인(신용)정보의 수집/이용 동의하시기 바랍니다.');
		$('#kakaoAuthAgreeCheck01').focus();
		return false;
	}
	if (!$('#kakaoAuthAgreeCheck02').prop('checked')) {
		alert('[필수]개인(신용)정보의 제3자 제공 동의하시기 바랍니다.');
		$('#kakaoAuthAgreeCheck02').focus();
		return false;
	}

	if ($('#kakaoAuthName').val() == '') {
		alert('이름을 입력하시기 바랍니다.');
		$('#kakaoAuthName').focus();
		return false;
	} else {
		$('#kakaoAuthName').val($.trim($('#kakaoAuthName').val()));
	}
	
	if ($('#kakaoAuthBirth').val() == '') {
		alert('주민번호 앞자리를 입력하시기 바랍니다.');
		$('#kakaoAuthBirth').focus();
		return false;
	}
	if ($('#kakaoAuthGender').val() == '') {
		alert('주민번호 뒤 1자리를 입력하시기 바랍니다.');
		$('#kakaoAuthGender').focus();
		return false;
	}
	if ($('#kakaoAuthTel1').val() == '') {
		alert('휴대폰 번호 앞자리를 선택하시기 바랍니다.');
		$('#kakaoAuthTel1').focus();
		return false;
	}
	
	if ($('#kakaoAuthTel2').val() == '' || $('#kakaoAuthTel2').val().length < 7) {
		alert('휴대폰 번호를 정확하게 입력하시기 바랍니다.');
		$('#kakaoAuthTel2').focus();
		return false;		
	}
	
	return true;
};

//카카오 인증 요청
kakaoAuth.callKakaoAuth = function() {

	if (!kakaoAuth.validate('callAuthNumber')) {
		return false;
	}
	
	
	$('#kakaoAuthForm').find('input, select').prop('diabled', false);
	//카카오 본인인증 시 - 4키 고객조회 :: ajax 동기처리를 위해
	var actionUrl = '';
	
	if (kakaoAuth.defaultSettings.proc == 'elecSign') {	//전자서명 : 출금동의
		actionUrl = '/commonAuth/callKakaoAuthCert.do';
		
	} else {
		actionUrl = '/commonAuth/callKakaoAuth.do';
		
		if (kakaoAuth.defaultSettings.proc == 'cert') {	//로그인 전 고객키 조회
			
			//먼저 고객정보 체크해야하기 때문에 비동기 ajax사용
			var isConfirmMember = false;
			$.ajax({
				type : 'POST',
				url: '/commonAuth/confirmMember.do',
				data : $('#kakaoAuthForm').serialize(),
				async: false,
				success: function(response, statusText) {
					if (response.rtcd != '000') {
						alert(response.rtmsg);
						isConfirmMember = false;
						$('#callKakaoAuthBtn').removeClass('disNone');
					} else {
						isConfirmMember = true;
					}
				}
			});	
			if (!isConfirmMember) {
				return false;
			}
		}
	}
	
	/* 카카오인증요청 */
	$.ajax({
		type : 'POST',
		url: actionUrl,
		data : $('#kakaoAuthForm').serialize(),
		async: false,
		beforeSend : function() {
/*			gLoading.start();
			gLoading.setLoadingText('카카오톡 인증이 진행 중입니다.<br>본인의 휴대폰으로 발송된 카카오톡 메시지를 확인해 주시기 바랍니다.');*/
		},
		success: function(response, statusText) {
			if (response.rtcd != 'Y') {
				alert(response.rtmsg);
				$('#callKakaoAuthBtn').removeClass('disNone');
				return false;
			} else {
				
				//상태 체크 폴링	:: 서버에서 폴링할 경우 사용자가 인증 중단하여도 계속 폴링상태가 되어 클라이언트에서 실행 :: 주기 5초 : 카카오 권장사항
				var statusResult = {};
				
				//카카오 인증 확인 팝업 제어 스크립트
				$('#kakaoInfo').show();
				$('#kakaoInfo').css('z-index', '901');
				$('#kakaoInfo .popup').css('height', $('#kakaoInfo .popup .popCont').height() + 30).css('top', ($(window).height() / 2) - ($('#kakaoInfo .popup .popCont').height() / 2) - 15);
				$('#kakaoInfo .kakaoClose').click(function(){
					if (confirm("카카오페이 인증 진행을 취소하시겠습니까?")) {
						$('.layerWrap .layerContent > #kakaoInfo').hide();
						clearInterval(kakaoStatus);
					}
				});				
				
				
				var kakaoStatus = setInterval(function() {
					statusResult = kakaoAuth.callKakaoStatus();	//상태 조회
					if (statusResult.result != 'PREPARE') {
						clearInterval(kakaoStatus);
						if (statusResult.result == 'COMPLETE') {
							//인증 verify 호출
							kakaoAuth.callKakaoVerify();	//검증 호출
						} else {
							//result = "EXPIRED||EXCEPTION"
							alert(statusResult.rtmsg);
							$('#callKakaoAuthBtn').removeClass('disNone');
						} 
					}
				}, 5000);
			}
		}
	});	
};

kakaoAuth.callKakaoVerify = function() {
	/*gLoading.setLoadingText('인증확인 진행 중입니다.<br>잠시만 기다려 주세요.');*/
	$.post('/commonAuth/callKakaoAuthVerify.do', $('#kakaoForm').serialize(), function(response) {
		$('#callKakaoAuthBtn').removeClass('disNone');
		
		if (response.rtcd != 'Y') {
			alert(response.rtmsg);
			return false;
		} else {
			alert(response.rtmsg);
			kakaoAuth.closeLayer();
			if (typeof kakaoAuth.defaultSettings.callback == 'function' ) {
				kakaoAuth.defaultSettings.callback();
			}
		}
	});	
};

kakaoAuth.callKakaoStatus = function() {
	var resultObj = {};
	$.ajax({
		type : 'POST',
		url: '/commonAuth/callKakaoAuthStatus.do',
		async: false,
		beforeSend : function() {
			/*gLoading.start();
			gLoading.setLoadingText('카카오톡 인증이 진행 중입니다.<br>본인의 휴대폰으로 발송된 카카오톡 메시지를 확인해 주시기 바랍니다.');*/
		},
		success: function(response, statusText) {
			resultObj.rtmsg = response.rtmsg;
			resultObj.rtcd = response.rtcd;
			resultObj.result = response.result;
		}
	});
	return resultObj;
};

/* ================ 카카오페이 Layer definitions ================ */


/* ================ FATCA Layer definitions ================ */
/**
 * FATCA Layer : incCommonLayer.jsp
 */
var fatca = {};
fatca.isNatSetting = false; //fatca 국적셀렉트 셋팅 여부
fatca.showLayer = function(isReset, btnObj) {
	
	if (typeof btnObj != 'undefined') {
		fatca.openBtnObj = btnObj;
	}
	
	gfnOpenLayer('layerFatca', $(btnObj));
	

	/**
	 * 초기화		20190815 현업 요청으로 초기화 제거
		if (isReset) {
			fatca.chkCustConfirmItem1($('#CS_CFMT_MTT_N'));	//모든값
			$('input[type="radio"][name="csCfmtMtt"]').prop('checked', false);
			$('#CS_CFMT_MTT, #CS_CFMT_MTT2').val('');
		}
	 */
	if($('input[name="csCfmtMtt"]:checked').size() <= 0){
		$('#fatcaInfoBox').addClass('disNone');
	}
	
	
	//레이어 호출시 국가 정보 조회
	if (!fatca.isNatSetting) {
		$.post('/CYB/commonCyber/getNatCodeList.do', '', function(response) {
			if (response.rtcd != '0' && response.rturl != '') {
				location.href = response.rturl;
			} else {
				fatca.setNatSelect(response.rtdata);
			}
		});	
	}
};
fatca.closeLayer = function() {
	gfnCloseLayer('layerFatca', $(fatca.openBtnObj));
};

/**
 * 국가 셀렉트 박스 셋팅
 */
fatca.setNatSelect = function(natList) {
	if (natList.length > 0) {
		var firstKrLine = '<option value="">국가선택</option>\n';
		var firstEnLine = '<option value="">국가선택</option>\n';
		var specialKr = '';
		var specialEn = '';
		var krHtml = '';
		var engHtml = '';
		for (var i = 0; i < natList.length; i++) {
			if (natList[i].natNameKr.indexOf('대한민국') >= 0){
				specialKr = '<option value="'+natList[i].natCode+'">'+natList[i].natNameKr+'</option>\n';
				specialEn = '<option value="'+natList[i].natCode+'">'+natList[i].natNameKr +'(' + natList[i].natNameEng +')</option>\n';				
			} else {
				krHtml  += '<option value="'+natList[i].natCode+'">'+natList[i].natNameKr+'</option>\n';
				engHtml += '<option value="'+natList[i].natCode+'">'+natList[i].natNameKr +'(' + natList[i].natNameEng +')</option>\n';
			}
		}
		
		var optionHtmlKr = firstKrLine + specialKr + krHtml;
		
		$('#NAT_CODE').html(optionHtmlKr);
		
		$('#NAT_CODE').val('KR');	//한국 기본셋팅
		$('#NAT_NAME_KR').val($.trim($('#NAT_CODE option:selected').text()));
		
		var optionHtmlEng = firstEnLine + specialEn + engHtml;
		
		$('#STAY_NAT_CODE1').html(optionHtmlEng);
		$('#STAY_NAT_CODE2').html(optionHtmlEng);
		$('#STAY_NAT_CODE3').html(optionHtmlEng);
		
		fatca.isNatSetting = true;
	}
};
/**
 * 국적셀렉트 선택시 국가명 Input 값 세팅
 */
fatca.setNatName = function(selectObj) {
	var selectValue = $(selectObj).find('option:selected').val();
	var selectText = $(selectObj).find('option:selected').text();
	
	var inputNatName = $(selectObj).closest('dd').find('input[type="hidden"]');
	inputNatName.val(selectText);
};

/**
 * 납세자번호 여부 체크박스 이벤트
 */
fatca.setNoSsn = function(checkbox) {
	//납세자번호 초기화		20190723 첫번째 input만 선택하도록 수정
	var inputSsn = $(checkbox).closest('dl').find('dd > input:eq(0)');
	if ($(checkbox).prop('checked')) {
		$(inputSsn).prop('disabled', true ).val('');
	} else {
		$(inputSsn).prop('disabled', false ).val('');
	}
	//미기재 사유 보여주기 토글
	var sayuBox = $(checkbox).closest('dl').find('dd > dl');
	if ($(checkbox).prop('checked')) {
		$(sayuBox).removeClass('disNone');
	} else {
		$(sayuBox).addClass('disNone');
	}
};

/**
 * 납세자 번호 미기재 사유 셀렉트박스 이벤트
 */
fatca.setSsnSayu = function(selectObj) {
	var sayuSelect = $(selectObj);
	var sayuSelectValue = $(selectObj).find('option:selected').val();
	
	var sayuInputId = sayuSelect.attr('id').substring(0, sayuSelect.attr('id').length-1) + "2";
	
	//SSN_SAYU*_1 값이 3일 경우 SSN_SAYU*_2 input을 show 한다. 
	if (sayuSelectValue == '3') {
		$('#'+sayuInputId).removeClass('disNone');
	} else {
		$('#'+sayuInputId).addClass('disNone');
		$('#'+sayuInputId).val('');
	}
};
/**
 * 납세자 번호 미기재 사유 라디오버튼 이벤트 20190723
 */
fatca.setSsnSayuRadio = function(radioObj) {
	$(radioObj).prop('checked', true);
	var sayuRadio = $(radioObj);
	var sayuInputId = sayuRadio.attr('name').substring(0, sayuRadio.attr('name').length-1) + "2";
	
	//SSN_SAYU*_1 값이 3일 경우 SSN_SAYU*_2 input을 show 한다. 
	if (sayuRadio.val() == '3') {
		$('#'+sayuInputId).removeClass('disNone');
	} else {
		$('#'+sayuInputId).addClass('disNone');
		$('#'+sayuInputId).val('');
	}
};


fatca.chkCustConfirmItem1 = function(radioObj) {
	$(radioObj).prop('checked', true);
	if ($(radioObj).val() == '1') {
		$('#fatcaInfoBox').find('input, select, radio, checkbox').attr('disabled', true).attr('checked', false);
		$('#fatcaInfoBox').find('input[type="text"], select').val('');
		$('#fatcaInfoBox').addClass('disNone');
		$('#CS_CFMT_MTT').val($(radioObj).val());
	} else if ($(radioObj).val() == 'Y') {
		$('#fatcaInfoBox').find('input, select, radio, checkbox').attr('disabled', false);
		$('#fatcaInfoBox').removeClass('disNone');
	}
};

/**
 * 미국 영주권자 관련
 */
fatca.chkCustConfirmItem234 = function(checkObj) {
	var checkboxName = $(checkObj).attr('name');
	
	if ($(checkObj).prop('checked')) {
		//체크박스이지만 라디오박스처럼 움직여야하기 때문에 모든 체크를 해제하고 해당 엘리먼트만 체크한다!		
		$('input[name="'+checkboxName+'"]').prop('checked', false);		
		$(checkObj).prop('checked', true);
		
		//미국셋팅
		$('#STAY_NAT_CODE1').val('US');
		$('#STAY_GUKJUK1').val($('#STAY_NAT_CODE1 option:selected').text());
		$('#STAY_NAT_CODE1').attr('disabled', true);
		$('#SSN1_YN').attr('disabled', true);
		$('#SSN1_YN').attr('checked', false);	
		fatca.setNoSsn($('#SSN1_YN'));
		$('#CS_CFMT_MTT').val($(checkObj).val());
	} else {
		$('#STAY_NAT_CODE1').val('');
		$('#STAY_GUKJUK1').val('');
		$('#STAY_NAT_CODE1').attr('disabled', false);
		$('#SSN1_YN').attr('disabled', false);
		$('#CS_CFMT_MTT').val('');
	}
};
/**
 * 한국이외의 조세목적상 해외 거주자
 */
fatca.chkCustConfirmItem5 = function(radioObj) {
	$(radioObj).prop('checked', true);
	if ($(radioObj).val() == 'Y') {
		$('#CS_CFMT_MTT2').val($(radioObj).val());
	} else if ($(radioObj).val() == 'N') {
		$('#CS_CFMT_MTT2').val('');
	}
};

fatca.validate = function(callback) {
	if ($('#NAT_CODE').val() == '' || $('#NAT_NAME_KR').val() == '') {
		alert('국적을 선택하시기 바랍니다.');
		$('#NAT_CODE').focus();
		return false;
	}
	if ($('input[name="csCfmtMtt"]:checked').size() <= 0) {
		alert('해외 거주자 여부를 선택하시기 바랍니다.');
		$('input[name="csCfmtMtt"]:eq(0)').focus();
		return false;
	}
	
	if ($('input[name="csCfmtMtt"]:checked').val() != '1') {	//input[name="csCfmtMtt"] 해당있음의 경우
		if ($('input[name="csCfmtMttAmerica"]:checked').size() <= 0 && $('input[name="csCfmtMtt2"]:checked').size() <= 0) {
			alert('손님확인사항 1번 또는 2번을 선택하시기 바랍니다.');
			$('input[name="csCfmtMttAmerica"]:eq(0)').focus();
			return false;
		}
		//20190815 손님확인사항 선택내용 확인 추가
		if ($('input[name="csCfmtMtt2"]:checked').size() <= 0) {
			alert('손님확인사항 2번을 선택하시기 바랍니다.');
			$('input[name="csCfmtMtt2"]:eq(0)').focus();
			return false;
		}
		//20190815 손님확인사항 선택내용 확인 추가
		if($('input[name="csCfmtMtt2"]:checked').val() == 'N' && $('input[name="csCfmtMttAmerica"]:checked').size() <= 0 ){
			alert('손님확인사항 1번을 선택하시기 바랍니다.');
			$('input[name="csCfmtMttAmerica"]:eq(0)').focus();
			return false;
		}
		if ($('#FAMILY_NAME').val() == '' || CommonFunc.isEngNum($('#FAMILY_NAME').val())) {
			alert('손님확인사항 3번 영문이름(성)을 영문으로 입력하시기 바랍니다.');
			$('#FAMILY_NAME').focus();
			return false;
		}
		if ($('#LAST_NAME').val() == '' || CommonFunc.isEngNum($('#LAST_NAME').val())) {
			alert('손님확인사항 3번 영문이름(명)을 영문으로 입력하시기 바랍니다.');
			$('#LAST_NAME').focus();
			return false;
		}
		if ($('#ADDRESS_US').val() == '' || CommonFunc.isAddressEng($('#ADDRESS_US').val())) {
			alert('손님확인사항 4번을 영문으로 입력하시기 바랍니다.');
			$('#ADDRESS_US').focus();
			return false;
		}
	}
	
	var checkObj = {};
	
	if ($('input[name="csCfmtMttAmerica"]:checked').size() <= 0) {
		//1. 미국 거주자에 해당하는 경우 해당 유형을 선택해 주시기 바랍니다. [체크박스 3개중 1개라도 체크가 없다면]
		checkObj.alertPreffix = '조세목적상 거주지 국가①';
		checkObj.natCdItem = 'STAY_NAT_CODE1';
		checkObj.natNmItem = 'STAY_GUKJUK1';
		checkObj.ssnCheckItem = 'SSN1_YN';
		checkObj.ssnNoItem = 'SSN1';
		//checkObj.sayuSelectItem = 'SSN_SAYU1_1';
		checkObj.sayuRadioItem = 'SSN_SAYU1_1';
		checkObj.sayuEtcItem = 'SSN_SAYU1_2';				
	} else {
		//1. 미국 거주자에 해당하는 경우 해당 유형을 선택해 주시기 바랍니다. [체크박스 3개중 1개라도 체크가 되었다면]
		//국가①은 미국으로 자동 채워짐 : 납세자 번호만 체크하면 됨! 
		if ($('#SSN1').val() == '' || CommonFunc.isEngNum($('#SSN1').val())) {
			alert('조세목적상 거주지 국가① 항목의 납세자 번호를 정확히 입력하시기 바랍니다.');
			$('#SSN1').focus();
			return false;
		}
		
		checkObj.alertPreffix =  '조세목적상 거주지 국가 ②';
		checkObj.natCdItem = 'STAY_NAT_CODE2';
		checkObj.natNmItem = 'STAY_GUKJUK2';
		checkObj.ssnCheckItem = 'SSN2_YN';
		checkObj.ssnNoItem = 'SSN2';
		//checkObj.sayuSelectItem = 'SSN_SAYU2_1';
		checkObj.sayuRadioItem = 'SSN_SAYU2_1';
		checkObj.sayuEtcItem = 'SSN_SAYU2_2';
	}
	
	//2. 한국 이외의 조세목적상 해외 거주자에 해당하십니까? [라디오박스] 해당있음의 경우
	if ($('input[name="csCfmtMtt2"]:checked').val() == 'Y') {
		
		if ($('#'+ checkObj.natCdItem).val() == '' || $('#'+ checkObj.natNmItem).val() == '') {
			alert(checkObj.alertPreffix + '항목의 국적을 선택하시기 바랍니다.');
			$('#'+ checkObj.natCdItem).focus();
			return false;
		}
		
		if ($('#'+ checkObj.ssnCheckItem).prop('checked')) {	//납세자 번호가 없는 경우
			//미기재 사유 선택 안한경우
			if ($('input[name="'+checkObj.sayuRadioItem +'"]:checked').size() <= 0) {
				alert(checkObj.alertPreffix + '항목의 미기재 사유를 선택하시기 바랍니다.');
				$('#'+ checkObj.sayuRadioItem).focus();
				return false;				
			} else {	
				//미기재 사유 - 미취득 선택한 경우
				if ($('input[name="'+checkObj.sayuRadioItem +'"]:checked').val() == '3' 
						&& $('#'+checkObj.sayuEtcItem).val() == ''){
					alert(checkObj.alertPreffix + '항목의 미취득 사유를 작성하시기 바랍니다.');
					$('#'+checkObj.sayuEtcItem).focus();
					return false;
				}
			}
		} else {
			//납세자번호는 영문/숫자 9자리 입력
			if ($('#'+checkObj.ssnNoItem).val() == '' || CommonFunc.isEngNum($('#'+checkObj.ssnNoItem).val())
					|| $('#'+checkObj.ssnNoItem).val().length < 9) {
				alert(checkObj.alertPreffix + '항목의 납세자 번호를 정확히 입력하시기 바랍니다.');
				$('#'+checkObj.ssnNoItem).focus();
				return false;
			}
		}
		//납세자 번호 없음 체크를 했을 경우
		if ($('#SSN2_YN').prop('checked')) {
			if ($('#STAY_NAT_CODE2').val() == '') {
				alert('조세목적상 거주지 국가 ②항목의 국적을 선택하시기 바랍니다.');
				$('#STAY_NAT_CODE2').focus();
				return false;
			}			
			//미기재 사유 선택 안한경우
			if ($('input[name="SSN_SAYU2_1"]:checked').size() <= 0) {
				alert('조세목적상 거주지 국가 ② 항목의 미기재 사유를 선택하시기 바랍니다.');
				$('#'+ checkObj.sayuRadioItem).focus();
				return false;				
			} else {
				//미기재 사유 - 미취득 선택한 경우
				if ($('input[name="SSN_SAYU2_1"]:checked').val() == '3'  && $('#SSN_SAYU2_2').val() == ''){
					alert('조세목적상 거주지 국가 ② 항목의 미취득 사유를 작성하시기 바랍니다.');
					$('#'+checkObj.sayuEtcItem).focus();
					return false;
				}
				
			}
			
		}
		//납세자 번호 없음 체크를 했을 경우
		if ($('#SSN3_YN').prop('checked')) {
			if ($('#STAY_NAT_CODE3').val() == '') {
				alert('조세목적상 거주지 국가 ③ 항목의 국적을 선택하시기 바랍니다.');
				$('#STAY_NAT_CODE3').focus();
				return false;
			}
			//미기재 사유 선택 안한경우
			if ($('input[name="SSN_SAYU3_1"]:checked').size() <= 0) {
				alert('조세목적상 거주지 국가 ③ 항목의 미기재 사유를 선택하시기 바랍니다.');
				$('#SSN_SAYU3_1').focus();
				return false;				
			} else {
				//미기재 사유 - 미취득 선택한 경우
				if ($('input[name="SSN_SAYU3_1"]:checked').val() == '3'  && $('#SSN_SAYU3_2').val() == ''){
					alert('조세목적상 거주지 국가 ③ 항목의 미취득 사유를 작성하시기 바랍니다.');
					$('#SSN_SAYU3_1').focus();
					return false;
				}
				
			}	
			
			
			
		}		
	}
	


	if (typeof callback == 'function' ) {
		$('#fatcaInfoBox').find('input, select, radio, checkbox').attr('disabled', false);
		callback();
	} else {
		return true;
	}
};

/**
 * 20190723 
 * 조세목정상 거주지국가
 * 거주자 확인사항 추가하기 클릭시 입력 폼 추가되는 이벤트
 */
function openStayGukjuk(obj){
	if($(obj).attr('id') == "openStayGukjuk1"){
		$(".2ndStayGukjuk1").removeClass("disNone");
		$("#openStayGukjuk1").addClass("disNone");
	} else if ($(obj).attr('id') =="openStayGukjuk2"){
		$(".3rdStayGukjuk1").removeClass("disNone");	
		$("#openStayGukjuk2").addClass("disNone");
	} else {
		alert("더이상 추가할 수 없습니다.");
	}
}
/* ================ FATCA Layer definitions ================ */


