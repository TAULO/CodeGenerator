const UI_Support_Format = ['image/jpeg','image/jpg','image/png','image/webp','image/bmp'];
var UI_Send_Image = false;
var UI_Search_Run = false;
var UI_Add_Counter = 0;
var UI_Auto_Imgs = 0;
var UI_Auto_Imgs_Counter = 0;
var UI_AI_Scaning = false;
var UI_HASH_MAP = {default:null};
var UI_HASH_MAIN_IMG = '';
var HISTORY_SAVE_LENGTH = 100;
var UI_Error_Msg_List = [];
var UI_WORKS_MAIN = $(window).height()-2*55-4*32;
var BRAND_ICON_MAP = {vcg:{type:'txt',icon:'VCG',name:'VCG'},hello:{type:'txt',icon:'站酷海洛',name:'站酷海洛'},veer:{type:'txt',icon:'veer',name:'veer'},unsplash:{type:'img',icon:'img/unsplash.png',name:'Unsplash'},getty:{type:'txt',icon:'getty',name:'getty'},huitu:{type:'txt',icon:'汇图网',name:'汇图网'},shutter:{type:'txt',icon:'shutter',name:'shutter'},dreams:{type:'txt',icon:'dreams',name:'dreams'},pond5:{type:'txt',icon:'pond5',name:'pond5'},adobe:{type:'img',icon:'img/adobe.png',name:'adobe'},istock:{type:'img',icon:'img/istock.png',name:'istock'},rf123:{type:'img',icon:'img/123rf.png',name:'123rf'},mauritius:{type:'txt',icon:'mauritius',name:'mauritius'},alamy:{type:'txt',icon:'alamy',name:'alamy'}};
var UI = ()=>{
	return UI.prototype.init();
};
UI.prototype = {
	init:function(){
		return this;
	},
	createQingfuXuntuUI:function(){
		$('body').append('\
			<div id="qingfu_xuntu_ui" style="position:fixed;top:45px;right:0px;width:276px;min-height:200px;height:auto;max-height:'+($(window).height()-2*50)+'px;z-index:2147483647;background-color:#282828;border-radius:6px;-webkit-user-select:none;">\
			</div>\
		');
		$('#qingfu_xuntu_ui').append('\
			<div id="qingfu_xuntu_ui_head" style="position:relative;display:flex;justify-content:space-between;align-items:center;top:0;width:100%;height:32px;font-weight:bold;letter-spacing:2px;border-radius:5px 5px 0 0;cursor:move;">\
				<div style="font-size:14px;color:#867e79;pointer-events:none;margin-left:8px;">'+chrome.i18n.getMessage("extName")+'</div>\
				<div id="qingfu_xuntu_ui_head_close" style="width:28px;height:100%;position:relative;display:flex;justify-content:center;align-items:center;cursor:pointer;">\
					<img src="'+chrome.extension.getURL('img/close32.png')+'" style="width:16px;height:16px;" class="qingfuXuntuOption" title="'+chrome.i18n.getMessage("optionClose")+'" />\
				</div>\
			</div>\
		');
		$('#qingfu_xuntu_ui').append('\
			<div id="qingfu_xuntu_ui_search" style="position:relative;width:100%;height:42px;display:flex;justify-content:space-between;align-items:center;padding-bottom:4px;">\
				<div style="width:6px;height:100%;">\</div>\
				<div style="width:100%;height:100%;border-radius:18px;border:1px solid #867e79;display:flex;justify-content:space-between;align-items:center;padding: 0 8px;" class="qingfuXuntuUiSearchGroup">\
					<input id="qingfu_xuntu_ui_search_input" type="search" style="width:190px !important;height:100% !important;font-size:14px !important;text-align:left;border-radius:16px !important;border-style:none !important;" class="qingfuXuntuSearchInput" placeholder="'+chrome.i18n.getMessage("searchInputTip")+'" autocomplete="off" />\
					<div id="qingfu_xuntu_ui_search_orig" data-qingfu_xuntu_work_img_id="" data-qingfu_xuntu_work_img_ts="" data-qingfu_xuntu_work_img_src=""  style="display:none;width:auto;height:auto;align-items:center;justify-content:center;">\
						<img id="qingfu_xuntu_ui_search_orig_clear" src="'+chrome.extension.getURL('img/close-facet.png')+'" style="width:16px;height:16px;margin:0 2px;cursor:pointer;" class="qingfuXuntuOption" title="'+chrome.i18n.getMessage("searchInputClear")+'" />\
						<div id="qingfu_xuntu_ui_search_orig_main" style="" title="'+chrome.i18n.getMessage("viewSearchImage")+'">\
							<img id="qingfu_xuntu_ui_search_orig_body_img" src="'+chrome.extension.getURL('img/image64.png')+'" style="height:32px;max-width:90px;" />\
							<div id="qingfu_xuntu_ui_search_orig_body_src" style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;padding:0 2px;font-size:14px;color:black;"></div>\
						</div>\
					</div>\
					<div id="qingfu_xuntu_ui_search_tools" style="">\
						<img id="qingfu_xuntu_ui_search_show_file" src="'+chrome.extension.getURL('img/cam32.png')+'" style="width:24px;height:24px;cursor:pointer;" class="qingfuXuntuOption" title="'+chrome.i18n.getMessage("searchUploadImage")+'" />\
						<input id="qingfu_xuntu_ui_search_get_file" type="file" style="display:none;" accept="image/jpeg,image/jpg,image/png,image/webp,image/bmp" />\
						<img id="qingfu_xuntu_ui_search_start" src="'+chrome.extension.getURL('img/search32.png')+'" style="width:24px;height:24px;cursor:pointer;" class="qingfuXuntuOption" title="'+chrome.i18n.getMessage("searchImage")+'" />\
					</div>\
					<div id="qingfu_xuntu_ui_search_run" style="display:none;">\
						<div id="qingfu_xuntu_ui_search_run_stop" title="'+chrome.i18n.getMessage("stopSearch")+'" class="qingfuXuntuSearchIcn"><div class="qingfuXuntuSearchCut"><div class="qingfuXuntuSearchDonut"></div></div></div>\
						<div style="width:24px;height:24px;"></div>\
					</div>\
				</div>\
				<div style="width:6px;height:100%;"></div>\
			</div>\
			<div id="qingfu_xuntu_ui_search_view" style="display:none;position:relative;cursor:pointer;">\
				<img src="" title="'+chrome.i18n.getMessage("returnSearch")+'" />\
				<a href="" target="_blank" />\
			</div>\
		');
		$('#qingfu_xuntu_ui').append('\
			<div id="qingfu_xuntu_ui_tools" style="position:relative;width:100%;height:26px;display:flex;justify-content:space-between;align-items:center;padding:0 10px;background-color:#282828;z-index:2147483647;">\
				<div style="width:auto;height:100%;position:relative;display:flex;justify-content:center;align-items:center;">\
					<div id="qingfu_xuntu_ui_tools_select" style="cursor:pointer;">\
						<img src="'+chrome.extension.getURL('img/click32.png')+'" style="width:18px;height:18px;" class="qingfuXuntuOption" title="'+chrome.i18n.getMessage("optionClickOne")+'" />\
					</div>\
					<div id="qingfu_xuntu_ui_tools_screenshot" style="margin-left:10px;cursor:pointer;">\
						<img src="'+chrome.extension.getURL('img/screenshot32.png')+'" style="width:18px;height:18px;" class="qingfuXuntuOption" title="'+chrome.i18n.getMessage("optionScreenshot")+'" />\
					</div>\
					<div id="qingfu_xuntu_ui_tools_gather" style="margin-left:10px;cursor:pointer;">\
						<img src="'+chrome.extension.getURL('img/pics32.png')+'" style="width:18px;height:18px;" class="qingfuXuntuOption" title="'+chrome.i18n.getMessage("optionGatherModel")+'" />\
					</div>\
				</div>\
				<div>\
				</div>\
				<div style="width:auto;height:100%;position:relative;display:flex;justify-content:center;align-items:center;">\
				</div>\
			</div>\
		');
		$('#qingfu_xuntu_ui').append('\
			<div id="qingfu_xuntu_ui_body" style="width:100%;height:auto;">\
			</div>\
		');
		$('#qingfu_xuntu_ui_body').append('\
			<div id="qingfu_xuntu_ui_body_notice" style="width:100%;height:100%;position:absolute;display:flex;justify-content:center;flex-direction:column;top:0px;visibility:hidden;">\
				<div style="width:100%;height:60px;position:relative;display:flex;justify-content:space-around;flex-direction:column;margin-top:18px;">\
					<div style="">\
						<img id="qingfu_xuntu_ui_body_notice_icon" style="" />\
					</div>\
					<div id="qingfu_xuntu_ui_body_notice_text" style="letter-spacing:1px;color:#ff6a00"></div>\
				</div>\
			</div>\
		');
		let imgStock = '';
		for(let stock in BRAND_ICON_MAP){
			imgStock += `<div><input type="checkbox" id="qingfu_xuntu_ui_body_config_similar_engine_${stock}" data-from="${stock}"><label for="qingfu_xuntu_ui_body_config_similar_engine_${stock}">${BRAND_ICON_MAP[stock].name}</label></div>`;
		}
		$('#qingfu_xuntu_ui_body').append('\
			<div style="position:absolute;height:auto;width:100%;z-index:2147483647;justify-content:center;">\
				<div id="qingfu_xuntu_ui_body_work_main_notice" style="display:none;padding:2px;color:#ff6a00"></div>\
				<img id="qingfu_xuntu_ui_body_work_main_notice_message" src="'+chrome.extension.getURL('img/error-message.png')+'" title="" style="display:none;position:absolute;right:14px;top:2px;width:16px;height:16px;" />\
			</div>\
			<div id="qingfu_xuntu_ui_body_work" style="width:100%;min-height:'+(200-3*32)+'px;height:inherit;max-height:'+UI_WORKS_MAIN+'px;display:flex;flex-direction:column;overflow-y:auto;">\
				<div id="qingfu_xuntu_ui_body_work_main" style="width:100%;height:auto;margin:4px 0 12px 0;">\
					<div id="qingfu_xuntu_ui_body_work_main_detail" style="visibility:hidden;margin:12px 0;">\
						<div id="qingfu_xuntu_ui_body_work_main_detail_source_main" style="margin-bottom:16px;display:none;">\
							<div style="text-align:left;margin:6px;font-size:14px;color:#817f7e;">'+chrome.i18n.getMessage("resultImageSource")+'</div>\
							<div id="qingfu_xuntu_ui_body_work_main_detail_source" style="display:grid;grid-template-columns:50% 50%;margin:0 6px 8px 6px;row-gap:12px;place-items:center;"></div>\
						</div>\
						<div>\
							<div style="display:flex;align-items:center;justify-content: space-between;">\
								<div style="text-align:left;margin:6px;font-size:14px;color:#817f7e;">'+chrome.i18n.getMessage("resultSimilarImage")+'</div>\
								<div id="qingfu_xuntu_ui_body_work_main_similar_order" style="display:none;margin:0 6px;cursor:pointer;" class="qingfuXuntuOption">'+chrome.i18n.getMessage("resultOrderBySimilar")+'</div>\
							</div>\
							<div id="qingfu_xuntu_ui_body_work_main_detail_similar" style="display:flex;flex-direction:column;row-gap:12px;"></div>\
						</div>\
					</div>\
				</div>\
				<div id="qingfu_xuntu_ui_body_history" style="display:none;width:100%;height:auto;margin:10px 0 0 0;">\
					<div style="display:flex;justify-content:space-between;margin:4px 10px;">\
						<div style="font-size:14px;color:#817f7e;display:flex;align-items:end;">'+chrome.i18n.getMessage("history")+'<img id="qingfu_xuntu_ui_body_history_clear" src="'+chrome.extension.getURL('img/delete.png')+'" style="width:16px;height:16px;cursor:pointer;margin-left:8px;" class="qingfuXuntuOption" title="'+chrome.i18n.getMessage("historyClear")+'" /></div>\
						<div id="qingfu_xuntu_ui_body_history_return"><img src="'+chrome.extension.getURL('img/return.png')+'" style="width:16px;height:16px;cursor:pointer;" class="qingfuXuntuOption" title="'+chrome.i18n.getMessage("optionReturn")+'" />\</div>\
					</div>\
					<div id="qingfu_xuntu_ui_body_history_imgs" style="display:flex;flex-direction:column;row-gap:12px;"></div>\
				</div>\
				<div id="qingfu_xuntu_ui_body_config" style="display:none;width:100%;height:auto;margin:10px 0 10px 0;">\
					<div style="display:flex;justify-content:space-between;margin:4px 10px;">\
						<div style="font-size:14px;color:#817f7e;display:flex;align-items:end;">'+chrome.i18n.getMessage("setup")+'<img id="qingfu_xuntu_ui_body_config_reset" src="'+chrome.extension.getURL('img/reset.png')+'" style="width:16px;height:16px;cursor:pointer;margin-left:8px;" class="qingfuXuntuOption" title="'+chrome.i18n.getMessage("setupReset")+'" /></div>\
						<div id="qingfu_xuntu_ui_body_config_return"><img src="'+chrome.extension.getURL('img/return.png')+'" style="width:16px;height:16px;cursor:pointer;" class="qingfuXuntuOption" title="'+chrome.i18n.getMessage("optionReturn")+'" />\</div>\
					</div>\
					<div style="margin:10px;">\
						<div style="text-align:left;margin:6px 0 6px 12px;font-size:12px;color:#817f7e;font-style:italic">'+chrome.i18n.getMessage("setupCopyrightImages")+'</div>\
						<div class="qingfuXuntuConfigSimilarEngine">\
							'+imgStock+'\
						</div>\
					</div>\
				</div>\
			</div>\
			<div id="qingfu_xuntu_ui_body_work_main_gotop" style="position:absolute;display:none;bottom:40px;right:12px;cursor:pointer;width:24px;">\
				<img src="'+chrome.extension.getURL('img/gotop.png')+'" style="width:24px;height:24px;" class="qingfuXuntuOption" title="'+chrome.i18n.getMessage("optionBackTop")+'" />\
			</div>\
		');
		$('#qingfu_xuntu_ui').append('\
			<div id="qingfu_xuntu_ui_foot" style="position:relative;bottom:0;left:0;height:32px;width:100%;display:flex;justify-content:space-between;align-items:center;border-radius: 0 0 5px 5px;background-color:#282828">\
				<div id="qingfu_xuntu_ui_foot_option" style="width:auto;height:100%;position:relative;display:flex;justify-content:center;align-items:center;margin-right: 4px;">\
					<div id="qingfu_xuntu_ui_foot_option_history" style="cursor:pointer;width:auto;margin-left:8px;">\
						<img src="'+chrome.extension.getURL('img/history32.png')+'" style="width:20px;height:20px;cursor:pointer;" class="qingfuXuntuOption" title="'+chrome.i18n.getMessage("history")+'" />\
					</div>\
					<div id="qingfu_xuntu_ui_foot_option_config" style="cursor:pointer;width:auto;margin-left:8px;">\
						<img src="'+chrome.extension.getURL('img/config32.png')+'" style="width:20px;height:20px;cursor:pointer;" class="qingfuXuntuOption" title="'+chrome.i18n.getMessage("setup")+'" />\
					</div>\
				</div>\
				<div></div>\
				<div id="qingfu_xuntu_ui_foot_other" style="width:auto;height:100%;position:relative;display:flex;justify-content:center;align-items:end;padding:0 2px 6px 0;">\
					<div id="qingfu_xuntu_ui_foot_other_help" style="cursor:pointer;width:24px;"><img src="'+chrome.extension.getURL('img/help32.png')+'" style="width:14px;height:14px;" class="qingfuXuntuOption" title="'+chrome.i18n.getMessage("optionHelp")+'" />\
					</div>\
				</div>\
			</div>\
		');
		this.padClickListen();
	},
	padClickListen:function(){
		$('#qingfu_xuntu_ui').draggable({axis:'x',snap:'body',snapTolerance:40,containment:'body',cancel:'#qingfu_xuntu_ui_search,#qingfu_xuntu_ui_tools,#qingfu_xuntu_ui_body,#qingfu_xuntu_ui_foot'});
		$('#qingfu_xuntu_ui_head_close').click(ev=>{
			this.hiddenQingfuXuntuUI();
		})
		$('#qingfu_xuntu_ui_search_input').focus(ev=>{
			$(ev.target).select();
		}).keyup(ev=>{
			if(ev.keyCode==13)this.inputSearch(ev);
		});
		$('#qingfu_xuntu_ui_search_show_file').click(ev=>{
			$('#qingfu_xuntu_ui_search_get_file').val('').trigger('click');
		});
		$('#qingfu_xuntu_ui_search_get_file').bind('input',()=>{
			this.getImgFromSystem(document.getElementById("qingfu_xuntu_ui_search_get_file").files[0]);
		});
		$('#qingfu_xuntu_ui_search_start').click(ev=>{
			this.inputSearch(ev);
		});
		$('#qingfu_xuntu_ui_search_orig_clear').click(ev=>{
			this.clearImgSearch();
		});
		$('#qingfu_xuntu_ui_search_orig_main').click(()=>{
			this.showSearchView();
		});
		$('#qingfu_xuntu_ui_search_view').click((ev)=>{
			if(ev.target.nodeName!='IMG')return;
			this.showSearchControl();
		});
		$('#qingfu_xuntu_ui_search_run_stop').click(()=>{
			this.searchImgStop();
		});
		$('#qingfu_xuntu_ui_search_run_stop').mouseover(()=>{
			$('.qingfuXuntuSearchDonut').addClass('color');
		}).mouseout(()=>{
			$('.qingfuXuntuSearchDonut').removeClass('color');
		});
		$('#qingfu_xuntu_ui_tools_select').click(ev=>{
			this.switchScreenshot('off');
			this.switchGather('off');
			this.switchSelect();
		});
		$('#qingfu_xuntu_ui_tools_screenshot').click(ev=>{
			this.switchSelect('off');
			this.switchGather('off');
			this.switchScreenshot();
		});
		$('#qingfu_xuntu_ui_tools_gather').click(ev=>{
			this.switchSelect('off');
			this.switchScreenshot('off');
			this.switchGather();
		});
		$('#qingfu_xuntu_ui').on('dragover',this.Drag.over).on('dragleave',this.Drag.leave).on('drop',this.Drag.drop);
		$('#qingfu_xuntu_ui_body_work').on('click','.qingfuSimilarImg, .qingfuHistoryImg',ev=>{
			this.clickRealImg(ev);
		});
		$('#qingfu_xuntu_ui_body_work').on('scroll',ev=>{
			this.switchGotop(ev);
		});
		$('#qingfu_xuntu_ui_body_work_main_gotop').click(ev=>{
			$('#qingfu_xuntu_ui_body_work').animate({scrollTop:0},'fast');
		});
		$('#qingfu_xuntu_ui_body_work_main_similar_order').click(ev=>{
			this.similarImageOrder();
		});
		$('#qingfu_xuntu_ui_foot_option_history').click(ev=>{
			this.fixMainPadHeight();
			this.switchHistory();
		});
		$('#qingfu_xuntu_ui_body_history_clear').click(ev=>{
			this.clearHistory();
		});
		$('#qingfu_xuntu_ui_foot_option_config').click(ev=>{
			this.fixMainPadHeight();
			this.switchConfig();
		});
		$('#qingfu_xuntu_ui_body_config .qingfuXuntuConfigSimilarEngine').on('click','input',ev=>{
			this.setupSimilarEngine(ev);
		});
		$('#qingfu_xuntu_ui_body_work_main_notice_message').tooltip({tooltipClass:"qingfuXuntuTest",content:()=>{
			if(UI_Error_Msg_List.length>0){
				return '<div>'+UI_Error_Msg_List.join('<br>')+'</div>';
			}
			return '';
		}});
		$('#qingfu_xuntu_ui_body_config_reset').click(ev=>{
			this.resetConfig()
		})
		$('#qingfu_xuntu_ui_body_history_return').click(ev=>{
			this.switchHistory();
		});
		$('#qingfu_xuntu_ui_body_config_return').click(ev=>{
			this.switchConfig();
		});
		$('#qingfu_xuntu_ui_foot_other_help').click(ev=>{
			front.Util.sendMessagePromise({'type':'openhelp'});
		});
	},
	showQingfuXuntuUI:function(){
		$('#qingfu_xuntu_ui').css('visibility','unset');
		this.createQingfuXuntuOneSelectPad();
	},
	hiddenQingfuXuntuUI:function(){
		$('#qingfu_xuntu_ui').css('visibility','hidden');
		this.removeQingfuXuntuOneSelectPad();
	},
	getImgAndSendBack:async function(img){
		let simg = [];
		simg.push({'id':img.id,'imb64_256':img.imb64_256,'ts':img.ts});
		if(simg.length>0){
			front.Util.sendMessagePromise({'type':'search','data':simg,'from':front.config.similar_search_engine});
		}
	},
	inputSearch:function(ev){
		const search = $('#qingfu_xuntu_ui_search_input');
		const url = search.val();
		let src = $('#qingfu_xuntu_ui_search_orig').attr('data-qingfu_xuntu_work_img_src');
		if(src.length==0){
			src = url;
			$('#qingfu_xuntu_ui_search_orig').attr(url);
		}
		const src_id = $.md5(src);
		if(url.length>0&&front.Util.checkUrlIsValid(url)){
			const a_img = {'id':src_id,'url':url,'src':src,'data':'','type':'select','from':'client','ts':Date.now()};
			this.addSearchImg(a_img,'search');
		}else{
			search.attr('disabled','disabled').addClass('qingfuXuntuSearchInputInfo').val(chrome.i18n.getMessage("searchErrorImageURL"));
			setTimeout(()=>search.removeClass('qingfuXuntuSearchInputInfo').val(url).removeAttr('disabled').focus(),1*1000);
		}
	},
	clearImgSearch:function(ev){
		$('#qingfu_xuntu_ui_search_orig,#qingfu_xuntu_ui_search_view').css('display','none');
		$('#qingfu_xuntu_ui_search_input').css('display','unset');
		$('#qingfu_xuntu_ui_search_input').val('').focus();
		$('#qingfu_xuntu_ui_search_orig').attr('data-qingfu_xuntu_work_img_src','').attr('data-qingfu_xuntu_work_img_id','').attr('data-qingfu_xuntu_work_img_ts','');
		$('#qingfu_xuntu_ui_search').css('display','flex');
	},
	showSearchView:function(){
		const img_data = $('#qingfu_xuntu_ui_search_input').val();
		const img_src = $('#qingfu_xuntu_ui_search_orig_body_img').attr('src');
		if(img_data.length<=0||img_src.indexOf('chrome-extension://')==0)return;
		let img_orig_src = $('#qingfu_xuntu_ui_search_orig_body_src').text();
		$('#qingfu_xuntu_ui_search_view img').attr('src',img_data);
		$('#qingfu_xuntu_ui_search_view a').attr('href',img_orig_src).text(img_orig_src);
		$('#qingfu_xuntu_ui_search').css('display','none');
		$('#qingfu_xuntu_ui_search_view').css('display','block');
		this.fixMainPadHeight();
	},
	showSearchControl:function(){
		const work_height = $('#qingfu_xuntu_ui_body_work').height();
		const new_height = work_height+($('#qingfu_xuntu_ui_search_view img').height()-42);
		if(new_height>=UI_WORKS_MAIN){
			$('#qingfu_xuntu_ui_body_work').height(new_height);
		}
		$('#qingfu_xuntu_ui_search_view img').attr('src','');
		$('#qingfu_xuntu_ui_search').css('display','flex');
		$('#qingfu_xuntu_ui_search_view').css('display','none');
	},
	searchImgStop:function(){
		front.Util.sendMessagePromise({'type':'searchstop'});
	},
	fixMainPadHeight:function(){
		const work_height = $('#qingfu_xuntu_ui_body_work').height();
		const new_height = 42-$('#qingfu_xuntu_ui_search_view img').height()+work_height;
		if(work_height+42>UI_WORKS_MAIN){
			$('#qingfu_xuntu_ui_body_work').height(new_height);
		}
	},
	getImgFromSystem:function(file){
		const reader = new FileReader();
		reader.onload = ev=>{
			const file_name = 'file://'+file.name;
			const src_id = $.md5(file_name);
			if(!UI.prototype.checkAImageIsAdded(src_id)){
				$('#qingfu_xuntu_ui_search_input').val(file_name);
				const a_img = {'id':src_id,'url':file_name,'src':file_name,'data':ev.target.result,'type':'drag','from':'client','ts':Date.now()};
				this.addSearchImg(a_img,'drag');
			}
		}
		reader.readAsDataURL(file);
	},
	addSearchImg:function(img,type){
		if(UI_Search_Run){
			return false;
		}
		UI_Search_Run = true;
		this.showSearchControl();
		$('#qingfu_xuntu_ui_tools,#qingfu_xuntu_ui_foot').css({'visibility':'hidden','height':'12px'});
		$('#qingfu_xuntu_select_one_image,.qingfuXuntuGatherList').css('cursor','url('+chrome.extension.getURL('img/ring16.png')+'),auto');
		this.switchHistory('off');
		this.switchConfig('off');
		this.addImgFrameToPanel(img,type);
		if(type=='screenshot'){
			front.Util.getScreenshotFromBack(img);
			this.switchScreenshot();
		}else if(type=='simple'){
			front.Util.sendQingfuXuntuEvent('qingfu_xuntu_client_imgs_data',{type:'simple',list:img});
		}else{
			front.Util.sendQingfuXuntuEvent('qingfu_xuntu_client_imgs_data',{type:'data',list:img});
		}
	},
	addImgFrameToPanel:function(img,type){
		this.fixMainPadHeight();
		$('#qingfu_xuntu_ui_search_orig').css('display','flex');
		$('#qingfu_xuntu_ui_search_input').css('display','none');
		$('#qingfu_xuntu_ui_body_work_main_similar_order').css('display','none');
		$('#qingfu_xuntu_ui_search_orig_body_img').attr('src',chrome.extension.getURL('img/image64.png'));
		$('#qingfu_xuntu_ui_search_orig_body_src').text(img['src']);
		$('#qingfu_xuntu_ui_search_input').val('');
		$('#qingfu_xuntu_ui_search_tools').css('display','none');
		$('#qingfu_xuntu_ui_search_orig_clear').css('visibility','hidden');
		$('#qingfu_xuntu_ui_search_run').css('display','flex');
		$('#qingfu_xuntu_ui_search_orig').attr('data-qingfu_xuntu_work_img_src',img['src']).attr('data-qingfu_xuntu_work_img_id',img['id']).attr('data-qingfu_xuntu_work_img_ts',img['ts']);
		$('#qingfu_xuntu_ui_body_work_main_detail').css('visibility','hidden');
		$('#qingfu_xuntu_ui_body_work_main_detail_source_main').css('display','none');
		$('#qingfu_xuntu_ui_body_work_main_detail_source,#qingfu_xuntu_ui_body_work_main_detail_similar').empty();
		$('#qingfu_xuntu_ui_body_work_main_notice').html('<div>'+chrome.i18n.getMessage("remindImageProcess")+'</div>').css('display','block');
		$('#qingfu_xuntu_ui_body_work_main_notice_message').attr('title','').css('display','none');
		UI_Error_Msg_List = [];
	},
	addImgErrorToPanel:function(img){
		this.addSimilarImgEnd();
		$('#qingfu_xuntu_ui_search_input').val(img.src);
		$('#qingfu_xuntu_ui_search_orig').attr('data-qingfu_xuntu_work_img_src','').attr('data-qingfu_xuntu_work_img_id',img['id']).attr('data-qingfu_xuntu_work_img_ts',img['ts']);
		$('#qingfu_xuntu_ui_body_work_main_notice').html('<div>'+chrome.i18n.getMessage("remindImageProcessError")+'</div>').css('display','block');
	},
	addImgToPanel:function(img){
		let wid = '#qingfu_xuntu_ui_body_work_main_orig';
		if(img.state){
			$('#qingfu_xuntu_ui_body_work_main_notice').html('<div>'+chrome.i18n.getMessage("remindImageSearch")+'</div>');
			$(wid).removeClass('qingfuXuntuGetImage').addClass('qingfuXuntuWaitSearch');
			$(wid+' img').removeClass('qingfuXuntuOriginalImageHandle').addClass('qingfuXuntuOriginalImage');
			$('#qingfu_xuntu_ui_search_orig_body_img').attr('src',img['imb64_256']);
			$('#qingfu_xuntu_ui_search_orig_body_src').text(img['src']);
			$('#qingfu_xuntu_ui_search_input').val(img['imb64_256']);
			this.saveHistory(img['imb64_256'],img['src']);
			this.getImgAndSendBack(img);
		}else{
			$('#qingfu_xuntu_ui_body_work_main_notice').html('<div>'+chrome.i18n.getMessage("remindProcessFail")+'</div>');
		}
		if($('#qingfu_xuntu_ui_body_work_main_notice').css('display')=='none'){
			$('#qingfu_xuntu_ui_body_work_main_notice').css('display','block');
		}
	},
	getSelectedElementInfo:function(ele){
		let ele_start = $(ele).offset();
		let ele_startX = ele_start.left;
		let ele_startY = ele_start.top;
		let ele_endX = ele.offsetWidth+ele_startX;
		let ele_endY = ele.offsetHeight+ele_startY;
		let ele_width = ele.offsetWidth;
		let ele_height = ele.offsetHeight;
		return [ele_startX,ele_startY,ele_endX,ele_endY,ele_width,ele_height];
	},
	checkIsAValidImage:function(ele_width,ele_height){
		if (Number.isNaN(ele_width)||ele_width<50||Number.isNaN(ele_height)||ele_height<50){
			return false;
		}
		return true;
	},
	imageSelectedShow:function(selected,call){
		const selected_type = $(selected).prop('nodeName').toLowerCase();
		const selected_style = $(selected).css('background')+$(selected).css('background-image');
		if (selected_type=='img'){
			const selected_class = $(selected).attr('class');
			if (selected_class!=undefined&&selected_class.length>0&&selected_class.indexOf('qingfuXuntuOriginalImage')>-1){
				return;
			}
			const [ele_startX,ele_startY,ele_endX,ele_endY,ele_width,ele_height] = this.getSelectedElementInfo(selected);
			if (this.checkIsAValidImage(selected)){
				call(selected,ele_startX,ele_startY,ele_width,ele_height);
			}
		}else if (selected_style!=undefined&&selected_style.length>0&&selected_style.indexOf('background')>-1&&selected_style.indexOf('url')>-1){
			const selected_class = $(selected).attr('class');
			if (selected_class!=undefined&&selected_class.length>0&&selected_class.indexOf('qingfuXuntuOriginalImage')>-1){
				return;
			}
			const [ele_startX,ele_startY,ele_endX,ele_endY,ele_width,ele_height] = this.getSelectedElementInfo(selected);
			if (this.checkIsAValidImage(selected)){
				call(selected,ele_startX,ele_startY,ele_width,ele_height);
			}
		}else{
			const start = $(selected).offset();
			const startX = start.left;
			const startY = start.top;
			const endX = selected.offsetWidth+startX;
			const endY = selected.offsetHeight+startY;
			const selected_elements = '*[style*="background"][style*="url"]:not(.qingfuXuntuOriginalImage),img:not(.qingfuXuntuOriginalImage)';
			let my_select = null;
			let distance = Infinity;
			for (let ele of $(selected_elements)){
				let [ele_startX,ele_startY,ele_endX,ele_endY,ele_width,ele_height] = this.getSelectedElementInfo(ele);
				if (ele_startX>=startX&&ele_startY>=startY&&ele_endX<=endX&&ele_endY<=endY){
					if (this.checkIsAValidImage(ele_width,ele_height)){
						let dist = Math.abs(startX-ele_startX)+Math.abs(startY-ele_startY);
						if(dist<distance){
							distance = dist;
							my_select = {ele,ele_startX,ele_startY,ele_endX,ele_endY,ele_width,ele_height};
						}
					}
				}
			}
			if(my_select!=null){
				call(my_select.ele,my_select.ele_startX,my_select.ele_startY,my_select.ele_width,my_select.ele_height);
			}
		}
	},
	createQingfuXuntuOneSelectPad:function(){
		$('body').append('<div id="qingfu_xuntu_select_one_image" style="position:absolute;display:none;left:0;top:0;width:0;height:0;opacity:0;z-index:2147483643;background-color:red;cursor:url('+chrome.extension.getURL('img/search16.png')+'),auto;" data-qingfu_xuntu_selected_url=""></div>');
		$(document).on("mouseover.docmsov",fn=ev=>{
			let selected = ev.target;
			this.imageSelectedShow(selected,(ele,ele_startX,ele_startY,ele_width,ele_height)=>{
				let ele_type = $(ele).prop('nodeName').toLowerCase();
				let src = '';
				if (ele_type=='img'){
					src = front.Util.safeGetImgSrc(ele);
				}else{
					src = front.Util.safeGetBackgroundSrc(ele);
				}
				if (src&&src.length>0){
					$('#qingfu_xuntu_select_one_image').off('click');
					$('#qingfu_xuntu_select_one_image').attr('data-qingfu_xuntu_selected_url',src);
					$('#qingfu_xuntu_select_one_image').css({'left':ele_startX,'top':ele_startY,'width':ele_width,'height':ele_height,'display':'block'});
					let src_id = $.md5(src);
					$('#qingfu_xuntu_select_one_image').click(ev=>{
						if (this.checkAImageIsAdded(src_id)){
							return;
						}
						let selected = ev.target;
						let url = $(selected).attr('data-qingfu_xuntu_selected_url');
						if (!front.Util.checkUrlIsValid(url)){
							return;
						}
						let a_img = {'id':src_id,'url':url,'src':url,'data':'','type':'select','from':'client','ts':Date.now()};
						this.markAImage(ele,url,src_id);
						this.addSearchImg(a_img,'select');
					});
				}
			});
		});
	},
	createQingfuXuntuRangeSelectPad:function(){
		const shadow_zone = parseInt($(document).height())+parseInt($(document).width());
		$('body').append('\
			<div id="qingfu_xuntu_manual_select_mask" style="width:'+$(document).width()+'px;height:'+$(document).height()+'px;position:absolute;top:0;left:0;box-sizing:border-box;z-index:2147483645;cursor:url('+chrome.extension.getURL('img/scissors16.png')+'),auto;">\
				<div id="qingfu_xuntu_manual_select_zone" style="display:none;position:absolute;top:0;left:0;border-width:0;box-sizing:border-box;z-index:2147483646;cursor:url('+chrome.extension.getURL('img/move16.png')+'),auto;box-shadow:0 0 0 '+shadow_zone+'px rgba(0,0,0,.6);">\
					<div id="qingfu_xuntu_manual_select_draw" style="width:16px;height:16px;display:none;position:absolute;bottom:0;right:0;display:none;background:url('+chrome.runtime.getURL('img/draw.png')+') no-repeat center center;background-size:92% 92%;cursor:url('+chrome.extension.getURL('img/resize16.png')+'),auto;"></div>\
					<div id="qingfu_xuntu_manual_select_zone_sure" style="width:32px;height:32px;display:none;position:absolute;bottom:-36px;right:26px;background: url('+chrome.extension.getURL('img/sure32.png')+') no-repeat center;cursor:default;cursor:pointer;"></div>\
				</div>\
			</div>');
        $('#qingfu_xuntu_manual_select_mask').mousedown(ev=>{
            if (ev.target.id!='qingfu_xuntu_manual_select_mask'){
                return;
            }
            $('.qingfuXuntuSelectImage').remove();
            $('#qingfu_xuntu_manual_select_zone_sure').css('display','none');
            $('#qingfu_xuntu_manual_select_zone').css({'width':0,'height':0,'display':'none'});
            $('#qingfu_xuntu_manual_select_zone').css({'top':ev.pageY,'left':ev.pageX,'display':'block'});
            $('#qingfu_xuntu_manual_select_mask').mousemove(ev=>{
                let z_height = ev.pageY-parseInt($('#qingfu_xuntu_manual_select_zone').css('top'))>=0?ev.pageY-parseInt($('#qingfu_xuntu_manual_select_zone').css('top')):0;
                let z_width = ev.pageX-parseInt($('#qingfu_xuntu_manual_select_zone').css('left'))>=0?ev.pageX-parseInt($('#qingfu_xuntu_manual_select_zone').css('left')):0;
                $('#qingfu_xuntu_manual_select_zone').css({'width':z_width,'height':z_height});
            });
        });
        $('#qingfu_xuntu_manual_select_mask').mouseup(ev=>{
			$('#qingfu_xuntu_manual_select_mask').css('cursor','url('+chrome.extension.getURL('img/scissors16.png')+'),auto');
			$('#qingfu_xuntu_manual_select_zone').css('cursor','url('+chrome.extension.getURL('img/move16.png')+'),auto');
            $('.qingfuXuntuSelectImage').remove();
            $('#qingfu_xuntu_manual_select_mask').off('mousemove');
            const z_height = parseInt($('#qingfu_xuntu_manual_select_zone').css('height'));
            const z_width = parseInt($('#qingfu_xuntu_manual_select_zone').css('width'));
			if(z_height>=64&&z_width>=64){
				$('#qingfu_xuntu_manual_select_zone_sure').css('display','block');
			}else{
				$('#qingfu_xuntu_manual_select_zone_sure').css('display','none');
			}
            $('#qingfu_xuntu_manual_select_zone').css({'height':z_height,'width':z_width});
            $('#qingfu_xuntu_manual_select_zone').draggable({cancel:'#qingfu_xuntu_manual_select_draw,#qingfu_xuntu_manual_select_zone_sure',start:(ev,ui)=>{$('.qingfuXuntuSelectImage').remove()}});
			$('#qingfu_xuntu_manual_select_draw').css({'inset':'unset','bottom':0,'right':0});
        });
		$('#qingfu_xuntu_manual_select_zone').mouseenter(()=>{
			const z_height = parseInt($('#qingfu_xuntu_manual_select_zone').css('height'));
            const z_width = parseInt($('#qingfu_xuntu_manual_select_zone').css('width'));
			if(z_height>=12&&z_width>=12){
				$('#qingfu_xuntu_manual_select_draw').css('display','block');
			}else{
				$('#qingfu_xuntu_manual_select_draw').css('display','none');
			}
		});
		$('#qingfu_xuntu_manual_select_zone').mouseleave(()=>{
			$('#qingfu_xuntu_manual_select_draw').css('display','none');
		});
		$('#qingfu_xuntu_manual_select_draw').draggable({
			drag:(ev,ui)=>{
				const zone_left = parseInt($('#qingfu_xuntu_manual_select_zone').css('width'));
				const zone_top = parseInt($('#qingfu_xuntu_manual_select_zone').css('height'));
				const gap_left = ui.position.left-zone_left+16;
				const gap_top = ui.position.top-zone_top+16;
				const z_width = zone_left+gap_left;
				const z_height = zone_top+gap_top;
				$('#qingfu_xuntu_manual_select_zone').css({'width':z_width>16?z_width:16,'height':z_height>16?z_height:16});
				if(z_height>=64&&z_width>=64){
					$('#qingfu_xuntu_manual_select_zone_sure').css('display','block');
				}else{
					$('#qingfu_xuntu_manual_select_zone_sure').css('display','none');
				}
			}
		});
        $('#qingfu_xuntu_manual_select_draw').mouseup(ev=>{
			$('#qingfu_xuntu_manual_select_mask').css('cursor','url('+chrome.extension.getURL('img/scissors16.png')+'),auto');
			$('#qingfu_xuntu_manual_select_zone').css('cursor','url('+chrome.extension.getURL('img/move16.png')+'),auto');
            $('#qingfu_xuntu_manual_select_draw').css('display','block');
            $('body').off('mousemove');
        });
		$('#qingfu_xuntu_manual_select_zone_sure').click(ev=>{
			const position = document.getElementById('qingfu_xuntu_manual_select_zone').getBoundingClientRect();
			const width = parseInt($('#qingfu_xuntu_manual_select_zone').css('width'));
			const height = parseInt($('#qingfu_xuntu_manual_select_zone').css('height'));
			const ts = Date.now();
			const src = 'http://'+position.left+position.top+width+height+ts+'.jpg';
			const src_id = $.md5(src);
			const a_img = {'id':src_id,'url':src,'src':src,'data':'','type':'screenshot','from':'client','ts':Date.now(),'zone':{'start_x':position.left,'start_y':position.top,width,height,}};
			this.addSearchImg(a_img,'screenshot');
		});
		$('#qingfu_xuntu_manual_select_zone_sure').mouseenter(ev=>{
			$('#qingfu_xuntu_manual_select_draw').css('display','none');
			ev.stopPropagation();
		});
		$(document).on('scroll',ev=>{
			const scroll_width = $(document).width();
			const mask_width = $('#qingfu_xuntu_manual_select_mask').width();
			const scroll_height = $(document).height();
			const mask_height = $('#qingfu_xuntu_manual_select_mask').height();
			const shadow_zone = parseInt($(document).height())+parseInt($(document).width());
			if(scroll_width!=mask_width){
				$('#qingfu_xuntu_manual_select_mask').css('width',scroll_width);
				$('#qingfu_xuntu_manual_select_zone').css('box-shadow','0 0 0 '+String(shadow_zone)+'px rgba(0,0,0,.6)');
			}
			if(scroll_height!=mask_height){
				$('#qingfu_xuntu_manual_select_mask').css('height',scroll_height);
				$('#qingfu_xuntu_manual_select_zone').css('box-shadow','0 0 0 '+String(shadow_zone)+'px rgba(0,0,0,.6)');
			}
		});
		$('#qingfu_xuntu_manual_select_mask').trigger('mousedown').trigger('mouseup');
	},
	removeQingfuXuntuRangeSelectPad:function(){
		$('#qingfu_xuntu_manual_select_mask').remove();
	},
	clickRealImg:function(ev,type='show'){
		const url = front.Util.safeGetImgSrc(ev.target);
		const src = $(ev.target).attr('data-orig_src');
		const src_id = $.md5(src);
		const a_img = {'id':src_id,'url':url,'src':src,'data':'','type':'select','from':'client','ts':Date.now()};
		if (this.checkAImageIsAdded(src_id,type)){
			return;
		}
		if(type=='gather'){
			this.addSearchImg(a_img);
		}else{
			this.addSearchImg(a_img,'simple');
		}
	},
	switchGotop:function(ev){
		if($('#qingfu_xuntu_ui_body_work').scrollTop()>600){
			$('#qingfu_xuntu_ui_body_work_main_gotop').css('display','block');
		}else{
			$('#qingfu_xuntu_ui_body_work_main_gotop').css('display','none');
		}
	},
	removeQingfuXuntuOneSelectPad:function(){
		$('#qingfu_xuntu_select_one_image').remove();
		$(document).off('.docmsov');
	},
	switchSelect:function(to=null){
		if($('#qingfu_xuntu_select_one_image').length>0||to=='off'){
			this.removeQingfuXuntuOneSelectPad();
			$('#qingfu_xuntu_ui_tools_select img').removeClass('qingfuXuntuOptionActive').addClass('qingfuXuntuOptionDisable');
		}else{
			$('#qingfu_xuntu_ui_tools_select img').removeClass('qingfuXuntuOptionDisable').addClass('qingfuXuntuOptionActive');
			this.createQingfuXuntuOneSelectPad();
		}
	},
	switchScreenshot:function(to=null){
		if($('#qingfu_xuntu_manual_select_mask').length>0||to=='off'){
			$('#qingfu_xuntu_manual_select_mask').remove();
			$('#qingfu_xuntu_ui_tools_screenshot img').removeClass('qingfuXuntuOptionActive').addClass('qingfuXuntuOptionDisable');
			if(to===null)this.switchSelect();
		}else{
			$('#qingfu_xuntu_ui_tools_screenshot img').removeClass('qingfuXuntuOptionDisable').addClass('qingfuXuntuOptionActive');
			this.createQingfuXuntuRangeSelectPad();
		}
	},
	switchGather:function(to=null){
		if($('#qingfu_xuntu_gather_mask').length>0||to=='off'){
			$('#qingfu_xuntu_gather_mask').remove();
			$('#qingfu_xuntu_ui_tools_gather img').removeClass('qingfuXuntuOptionActive').addClass('qingfuXuntuOptionDisable');
			if(to===null)this.switchSelect();
		}else{
			$('#qingfu_xuntu_ui_tools_gather img').removeClass('qingfuXuntuOptionDisable').addClass('qingfuXuntuOptionActive');
			this.createQingfuXuntuShowGather();
		}
	},
	checkAImageIsAdded:function(src_id,type='search'){
		if ($('#qingfu_xuntu_ui_search_orig').attr('data-qingfu_xuntu_work_img_id')==src_id){
			if(!UI_Search_Run){
				if(type=='search'||type=='gather'){
					$('.qingfuXuntuUiSearchGroup, #qingfu_xuntu_ui_search_view img').addClass('qingfuXuntuUiSearchGroupShake').one('webkitAnimationEnd',function(){
						$('.qingfuXuntuUiSearchGroup, #qingfu_xuntu_ui_search_view img').removeClass('qingfuXuntuUiSearchGroupShake');
					})
				}else if(type=='show'){
					this.swithToWorkMain();
				}
			}
			return true;
		}
		return false;
	},
	moveAndPointAddedImg:function(wid){
		let ele_top = $(wid).position().top-104;
		let offset = $('#qingfu_xuntu_ui_body_works').scrollTop()+ele_top;
		$('#qingfu_xuntu_ui_body_works').animate({scrollTop:offset},'fast',()=>{
			$(wid).css('background-color','red');
			setTimeout(()=>$(wid).css('background-color','#282828'),500);
		})
	},
	removeASelectedImage:function(ev){
		let selected = ev.target;
		let img = $(selected).attr('data-qingfu_xuntu_selected_mask_url');
		let wid = 'div[data-qingfu_xuntu_work="'+img+'"]';
		$(wid).remove();
		$(selected).remove();
		front.Util.sendQingfuXuntuEvent('qingfu_xuntu_ev_data_change',{});
	},
	createQingfuXuntuShowGather:function(){
		const img_list = front.Util.getAllImage();
		const s_width = window.innerWidth;
		const s_height = window.innerHeight;
		$('body').append('\
			<div id="qingfu_xuntu_gather_mask" style="width:'+$(document).width()+'px;height:'+$(document).height()+'px;position:absolute;top:0;left:0;box-sizing:border-box;z-index:2147483646;background-color:black;">\
				<div style="min-width:576px;width:calc(100% - 276px - 320px);height:auto;display:flex;justify-content:center;position:absolute;top:30px;right:308px;z-index:2147483647;overflow:hidden;">\
					<div id="qingfu_xuntu_gather_all_imgs" style="width:100%;margin:20px auto;columns:0;column-gap:18px;"></div>\
				</div>\
			</div>\
		');
		$('#qingfu_xuntu_gather_all_imgs').on('click','img',ev=>{
			this.clickRealImg(ev,'gather');
		});
		const columns = parseInt($('#qingfu_xuntu_gather_all_imgs').parent().width()/280);
		$('#qingfu_xuntu_gather_all_imgs').css('columns',String(columns));
		let img_html = '';
		for(img of img_list){
			img_html += '<div class="qingfuXuntuGatherList" style="cursor:url('+chrome.extension.getURL('img/search16.png')+'),auto;"><img src="'+img+'" data-orig_src="'+img+'" /></div>';
		}
		$('#qingfu_xuntu_gather_all_imgs').append(img_html).parent().css('display','grid');
		$(document).scrollTop(0).on('scroll',ev=>{
			const scroll_width = $(document).width();
			const mask_width = $('#qingfu_xuntu_gather_mask').width();
			const scroll_height = $(document).height();
			const mask_height = $('#qingfu_xuntu_gather_mask').height();
			if(scroll_width!=mask_width){
				$('#qingfu_xuntu_gather_mask').css('width',scroll_width);
			}
			if(scroll_height!=mask_height){
				$('#qingfu_xuntu_gather_mask').css('height',scroll_height);
			}
		});
	},
	markAImage:function(id,url,md5=''){
		md5 = md5.length>0?md5:$.md5(url);
		$(id).attr('data-qingfu_xuntu_mark',md5);
	},
	callMarkImage:function(ev){
		let pid = $(ev.target).parent().parent();
		let wid = $(pid).attr('data-qingfu_xuntu_work_img_id');
		let type = $(pid).attr('data-qingfu_xuntu_work_img_source');
		if(type=='auto'||type=='select'){
			let mid = $('*[data-qingfu_xuntu_mark="'+wid+'"]');
			if(mid.length>0){
				let [ele_startX,ele_startY,ele_endX,ele_endY,ele_width,ele_height] = this.getSelectedElementInfo(mid);
				let rid = this.randomString(10);
				let selected_image = 'qingfu_xuntu_selected_image_'+rid;
				let ele_top = $(mid).offset().top-100;
				$('html,body').animate({scrollTop:ele_top},'fast',()=>{
					$('body').append('<div id="'+selected_image+'" class="qingfuXuntuSelectedImage" style="position:absolute;display:flex;justify-content:center;align-items:center;left:'+ele_startX+'px;top:'+ele_startY+'px;width:'+ele_width+'px;height:'+ele_height+'px;background-color:red;opacity:0.3;z-index:2147483645;"></div>');
					setTimeout(()=>$('#'+selected_image).remove(),500);
				})
			}
		}else if(type=='search'||type=='drag'||type=='text'){
			let url = $(pid).attr('data-qingfu_xuntu_work_img_url');
			window.open(url);
		}
	},
	processSearchImg:async function(img){
		const ts = $('#qingfu_xuntu_ui_search_orig').attr('data-qingfu_xuntu_work_img_ts');
		if(img.source=='sample'){
			img_hash = await front.Util.getImgHashFromBack(img.data);
			img.info = img_hash.info;
			img.hash = img_hash.hash;
			UI_HASH_MAIN_IMG = img.hash;
			UI_HASH_MAP = {default:null};
			UI_HASH_MAP[img.hash] = img;
			return;
		}
		if(String(ts)!==String(img.ts)){
			return;
		}
		for(let a_hash in UI_HASH_MAP){
			const dist = front.Util.distance(a_hash,img.hash);
			if(dist<=8){
				if(a_hash==UI_HASH_MAIN_IMG&&img.type==1){
					this.addImgSourceToPanel(img);
				}
				return;
			}
		}
		UI_HASH_MAP[img.hash] = img;
		const hash_gap = front.Util.distance(img.hash,UI_HASH_MAIN_IMG);
		const img1 = {width:UI_HASH_MAP[UI_HASH_MAIN_IMG].info.width,height:UI_HASH_MAP[UI_HASH_MAIN_IMG].info.height,data:UI_HASH_MAP[UI_HASH_MAIN_IMG].info.data,channels:UI_HASH_MAP[UI_HASH_MAIN_IMG].info.channels};
		const img2 = {width:img.info.width,height:img.info.height,data:img.info.data,channels:img.info.channels};
		const ssim = ImageSSIM.compare(img1,img2);
		const all_gap = parseInt((((64-hash_gap)/64*0.8+ssim.ssim)/2).toFixed(6)*1000000);
		this.addSimilarImgToPanel(img,all_gap);
	},
	addImgSourceToPanel:function(img){
		let free_copyright = '';
		down_url = img.down_url;
		if(img.free==0){
			free_copyright = '<img class="qingfuXuntuSourceImgCopyright" title="'+chrome.i18n.getMessage("resultTipCopyright")+'" src="'+chrome.extension.getURL('img/copyright.png')+'" />';
		}else if(img.free==1){
			free_copyright = '<img class="qingfuXuntuSourceImgFree" title="'+chrome.i18n.getMessage("resultTipFree")+'" src="'+chrome.extension.getURL('img/free.png')+'" />';
		}
		let brand = '';
		if(BRAND_ICON_MAP[img.source].type=='img'){
			brand = '<img class="qingfuXuntuSourceImgBrandImg" src="'+chrome.extension.getURL(BRAND_ICON_MAP[img.source].icon)+'" />';
		}else if(BRAND_ICON_MAP[img.source].type=='txt'){
			brand = '<span>'+BRAND_ICON_MAP[img.source].icon+'</span>';
		}
		$('#qingfu_xuntu_ui_body_work_main_detail').css('visibility','unset');
		$('#qingfu_xuntu_ui_body_work_main_detail_source_main').css('display','unset');
		$('#qingfu_xuntu_ui_body_work_main_detail_source').append('\
			<div class="qingfuXuntuSourceImgBrand">\
				<a href="'+img.down_url+'" target="blank">\
					'+free_copyright+'\
					<img class="qingfuXuntuSourceImg" src="'+img.data+'" />\
					'+brand+'\
				</a>\
			</div>\
		');
	},
	addSimilarImgToPanel:function(img,gap){
		let down_url = img.url;
		let free_copyright = '';
		if(img.type==1){
			down_url = img.down_url;
			if(img.free==0){
				free_copyright = '<div style="position:absolute;top:6px;right:16px;opacity:0.6;"><img style="height:20px;" title="'+chrome.i18n.getMessage("resultTipCopyright")+'" src="'+chrome.extension.getURL('img/copyright.png')+'" /></div>';
			}else if(img.free==1){
				free_copyright = '<div style="position:absolute;top:0px;right:16px;opacity:0.6;"><img style="" title="'+chrome.i18n.getMessage("resultTipFree")+'" src="'+chrome.extension.getURL('img/free.png')+'" /></div>';
			}
		}
		let brand = '';
		if(BRAND_ICON_MAP[img.source].type=='img'){
			brand = '<img src="'+chrome.extension.getURL(BRAND_ICON_MAP[img.source].icon)+'" />';
		}else if(BRAND_ICON_MAP[img.source].type=='txt'){
			brand = '<span>'+BRAND_ICON_MAP[img.source].icon+'</span>';
		}
		$('#qingfu_xuntu_ui_body_work_main_detail').css('visibility','unset');
		$('#qingfu_xuntu_ui_body_work_main_detail_similar').append('\
			<div data-qingfu_xuntu_similar_gap="'+gap+'" class="qingfuXuntuSimilarList">\
				<img class="qingfuSimilarImg" src="'+img.data+'" data-orig_src="'+img.url+'" style="cursor:url('+chrome.extension.getURL('img/ring16.png')+'),auto;" />\
				'+free_copyright+'\
				<div class="qingfuXuntuSimilarImgBrand">\
					<a href="'+down_url+'" target="blank">\
						<div class="qingfuXuntuSimilarImgBrandBackground"></div>\
						'+brand+'\
					</a>\
				</div>\
			</div>'
		);
	},
	addSimilarImgEnd:function(){
		UI_Search_Run = false;
		this.relieveSearchRunShow();
	},
	relieveSearchRunShow:function(){
		if(UI_Search_Run)return;
		$('#qingfu_xuntu_ui_search_tools').css('display','unset');
		$('#qingfu_xuntu_ui_search_orig_clear').css('visibility','unset');
		$('.qingfuXuntuSearchDonut').removeClass('color');
		$('#qingfu_xuntu_ui_search_run').css('display','none');
		$('#qingfu_xuntu_ui_body_work_main_similar_order').css('display','block');
		$('#qingfu_xuntu_ui_body_work_main_notice').empty().css('display','none');
		$('#qingfu_xuntu_select_one_image,.qingfuSimilarImg,#qingfu_xuntu_select_one_image,.qingfuXuntuGatherList').css('cursor','url('+chrome.extension.getURL('img/search16.png')+'),auto');
		$('#qingfu_xuntu_ui_tools').css({'visibility':'unset','height':'26px'});
		$('#qingfu_xuntu_ui_foot').css({'visibility':'unset','height':'32px'});
	},
	similarImageOrder:function(){
		let order_dict = {};
		for(let a_img of $('#qingfu_xuntu_ui_body_work_main_detail_similar div[data-qingfu_xuntu_similar_gap]')){
			const rate = $(a_img).attr('data-qingfu_xuntu_similar_gap');
			if(order_dict.rate){
				order_dict.rate.push(a_img);
			}else{
				order_dict[rate] = [a_img];
			}
		}
		const order_img = Object.keys(order_dict).reverse()
		let similar_imgs = '';
		for(let a_key of order_img){
			for(let a_img of order_dict[a_key]){
				similar_imgs += $(a_img).prop('outerHTML');
			}
		}
		$('#qingfu_xuntu_ui_body_work_main_detail_similar').empty().append(similar_imgs);
	},
	showWorkMain:function(){
		$('#qingfu_xuntu_ui_body_work_main,#qingfu_xuntu_ui_body_work_main_notice').css('display','block');
	},
	hiddenWorkMain:function(){
		$('#qingfu_xuntu_ui_body_work_main,#qingfu_xuntu_ui_body_work_main_notice').css('display','none');
	},
	saveHistory:function(img,src){
		chrome.storage.local.get('COPYRIGHT_RADAR_IMG_HISTORY', v=>{
			if(v.COPYRIGHT_RADAR_IMG_HISTORY){
				if(v.COPYRIGHT_RADAR_IMG_HISTORY.unshift({img,src})>HISTORY_SAVE_LENGTH){
					v.COPYRIGHT_RADAR_IMG_HISTORY.pop();
				}
				chrome.storage.local.set({'COPYRIGHT_RADAR_IMG_HISTORY':v.COPYRIGHT_RADAR_IMG_HISTORY});
			}else{
				chrome.storage.local.set({'COPYRIGHT_RADAR_IMG_HISTORY':[{img,src}]});
			}
		})
	},
	showHistory:function(){
		chrome.storage.local.get('COPYRIGHT_RADAR_IMG_HISTORY',v=>{
			let imgs = '';
			if(v.COPYRIGHT_RADAR_IMG_HISTORY){
				for(let img of v.COPYRIGHT_RADAR_IMG_HISTORY){
					imgs += '<div><img class="qingfuHistoryImg" src="'+img.img+'" data-orig_src="'+img.src+'" style="cursor:url('+chrome.extension.getURL('img/search16.png')+'),auto;" /></div>';
				}
			}else{
				imgs = chrome.i18n.getMessage("historyNotHave");
			}
			$('#qingfu_xuntu_ui_body_history_imgs').empty().append(imgs);
			$('#qingfu_xuntu_ui_body_history').css('display','block').scrollTop(0);
		});
	},
	hiddenHistory:function(){
		$('#qingfu_xuntu_ui_body_history').css('display','none');
		$('#qingfu_xuntu_ui_body_history_imgs').empty();
		$('#qingfu_xuntu_ui_body_config').css('display','none');
	},
	switchHistory:function(to=null){
		if($('#qingfu_xuntu_ui_body_history').css('display')=='block'||to=='off'||to=='alloff'){
			if(to!='alloff'){
				this.showWorkMain();
			}
			this.hiddenHistory();
			$('#qingfu_xuntu_ui_foot_option_history img').removeClass('qingfuXuntuOptionActive').addClass('qingfuXuntuOptionDisable');
		}else{
			this.switchConfig('alloff');
			$('#qingfu_xuntu_ui_foot_option_history img').removeClass('qingfuXuntuOptionDisable').addClass('qingfuXuntuOptionActive');
			this.showHistory();
			this.hiddenWorkMain();
		}
	},
	clearHistory:function(){
		chrome.storage.local.remove('COPYRIGHT_RADAR_IMG_HISTORY',()=>{
			if(!chrome.runtime.lastError){
				$('#qingfu_xuntu_ui_body_history_imgs').empty().html(chrome.i18n.getMessage("historyEmptied"));
			}
		});
	},
	showConfig:function(){
		const search_engine_prefix = '#qingfu_xuntu_ui_body_config_similar_engine_';
		for(let a_from in front.config.similar_search_engine){
			const from_engine = search_engine_prefix+a_from;
			$(from_engine).prop('checked',front.config.similar_search_engine[a_from]);
		}
		$('#qingfu_xuntu_ui_body_config').css('display','block').scrollTop(0);
	},
	hiddenConfig:function(){
		$('#qingfu_xuntu_ui_body_config').css('display','none');
	},
	switchConfig:function(to=null){
		if($('#qingfu_xuntu_ui_body_config').css('display')=='block'||to=='off'||to=='alloff'){
			if(to!='alloff'){
				this.showWorkMain();
			}
			this.hiddenConfig();
			$('#qingfu_xuntu_ui_foot_option_config img').removeClass('qingfuXuntuOptionActive').addClass('qingfuXuntuOptionDisable');
		}else{
			this.switchHistory('alloff');
			$('#qingfu_xuntu_ui_foot_option_config img').removeClass('qingfuXuntuOptionDisable').addClass('qingfuXuntuOptionActive');
			this.showConfig();
			this.hiddenWorkMain();
		}
	},
	resetConfig:function(){
		front.initConfig(true);
		this.showConfig();
	},
	setupSimilarEngine:function(ev){
		const from = $(ev.target).attr('data-from');
		const is_check = $(ev.target).is(':checked');
		chrome.storage.local.get('COPYRIGHT_RADAR_CONFIG', v=>{
			v.COPYRIGHT_RADAR_CONFIG.similar_search_engine[from] = is_check;
			chrome.storage.local.set({'COPYRIGHT_RADAR_CONFIG':v.COPYRIGHT_RADAR_CONFIG});
			front.config = v.COPYRIGHT_RADAR_CONFIG;
		});
	},
	swithToWorkMain:function(){
		this.switchHistory('off');
		this.switchConfig('off');
	},
	addSearchErrorNotice:function(from){
		const id = this.randomString();
		const msg = from + chrome.i18n.getMessage("searchFail");
		$('#qingfu_xuntu_ui_body_work_main_notice').after(`<div id="${id}" style="color:red;margin-top:2px;">${msg}</div>`);
		UI_Error_Msg_List.push(msg);
		$('#qingfu_xuntu_ui_body_work_main_notice_message').css('display','block');
		setTimeout(()=>{$('#'+id).fadeOut(3000)},3000);
	},
	randomString:function(len){
		len = len||32;
		let chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
		let maxPos = chars.length;
		let rstr = '';
		for (let i=0;i<len;i++){
			rstr += chars.charAt(Math.floor(Math.random()*maxPos));
		}
		return rstr;
	}
}

UI.prototype.Tools = {
	show:function(){
		$('#qingfu_xuntu_ui_tools_all_imgs').html($('.qingfuXuntuOriginalImage').length);
		$('#qingfu_xuntu_ui_tools_all_clues').html($('.qingfuXuntuCluePadImg').length);
		if($('.qingfuXuntuGetImage,.qingfuXuntuWaitSearch,.qingfuXuntuOriginalImage').length>0){
			$('#qingfu_xuntu_ui_tools').css('visibility','unset');
		}else{
			$('#qingfu_xuntu_ui_tools').css('visibility','hidden');
		}
	},
	activeHandle:function(s1,s2){
		if(UI.prototype.Notice.showing()){
			UI.prototype.Notice.close();
		}
		$('#qingfu_xuntu_ui_tools_handle').css('display','flex');
		$('#qingfu_xuntu_ui_tools_handle_nmb').html(s1+'/'+s2);
		if(s1==s2){
			UI_Auto_Imgs_Counter = 0;
			$('#qingfu_xuntu_ui_tools_handle').css('display','none');
			UI.prototype.AI.scanAfter();
		}
	},
	clearWorks:function(){
		$('#qingfu_xuntu_ui_body_works_list').empty();
		$('#qingfu_xuntu_ui_body_works_list').trigger('DOMNodeRemoved');
	}
}

UI.prototype.Drag = {
	over:function(ev){
		ev.originalEvent.preventDefault();
		$('.qingfuXuntuUiSearchGroup').css('border-color','#ff6a00');
	},
	leave:function(ev){
		$('.qingfuXuntuUiSearchGroup').css('border-color','#867e79');
	},
	drop:function(ev){
		ev.originalEvent.preventDefault();
		$('.qingfuXuntuUiSearchGroup').css('border-color','#867e79');
		UI.prototype.Drag.dropped(ev);
	},
	dropped:function(ev){
		let files = ev.originalEvent.dataTransfer.files;
		let text = ev.originalEvent.dataTransfer.getData('Text');
		if (files.length>0){
			UI.prototype.Drag.processFiles(files);
		}else if (text.length>0){
			UI.prototype.Drag.processText(text);
		}else{
			UI.prototype.Notice.tips(chrome.i18n.getMessage("dragInfoFail"),true);
		}
	},
	processText:function(text){
		if (!front.Util.checkUrlIsValid(text)){
			UI.prototype.Notice.tips(chrome.i18n.getMessage("dragFormatError"),true,true);
			return;
		}
		const src_id = $.md5(text);
		if(!UI.prototype.checkAImageIsAdded(src_id)){
			$('#qingfu_xuntu_ui_search_input').val(text);
			const a_img = {'id':src_id,'url':text,'src':text,'data':'','type':'drag','from':'client','ts':Date.now()};
			this.addSearchImg(a_img,'drag');
		}
	},
	processFiles:function(files){
		if(files.length>1){
			UI.prototype.Notice.tips(chrome.i18n.getMessage("dragImagesNumberError"),true);
			return;
		}
		const file = files[0]
		if (!UI_Support_Format.includes(file.type)){
			UI.prototype.Notice.tips(chrome.i18n.getMessage("dragFormatError"),true,true,true);
			return;
		}
		UI.prototype.getImgFromSystem(file);
	}
}

UI.prototype.Notice = {
	show:function(){
		if(!this.showing()){
			$('#qingfu_xuntu_ui_body_work_main,#qingfu_xuntu_ui_body_history,#qingfu_xuntu_ui_body_config').css('visibility','hidden');
			$('#qingfu_xuntu_ui_body_notice').css('visibility','unset');
		}
	},
	busy:function(msg,close=false){
		this.show();
		$('#qingfu_xuntu_ui_body_notice_icon').attr('src',chrome.extension.getURL('img/busy32.png'));
		$('#qingfu_xuntu_ui_body_notice_text').html(msg);
		if(close){
			setTimeout(()=>this.close(),500);
		}
	},
	tips:function(msg,close=false){
		this.show();
		$('#qingfu_xuntu_ui_body_notice_icon').attr('src',chrome.extension.getURL('img/tips32.png'));
		$('#qingfu_xuntu_ui_body_notice_text').html(msg);
		if(close){
			setTimeout(()=>this.close(),1000);
		}
	},
	close:function(){
		if(this.showing()){
			$('#qingfu_xuntu_ui_body_notice').css('visibility','hidden');
			$('#qingfu_xuntu_ui_body_work_main,#qingfu_xuntu_ui_body_history,#qingfu_xuntu_ui_body_config').css('visibility','unset');
		}
	},
	showing:function(){
		if($('#qingfu_xuntu_ui_body_notice').css('visibility')=='visible'){
			return true;
		}
		return false;
	}
}
