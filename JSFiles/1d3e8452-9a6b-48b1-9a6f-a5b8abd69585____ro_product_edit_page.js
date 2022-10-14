
//  Related Options / Связанные опции
//  Support: support@liveopencart.com / Поддержка: help@liveopencart.ru

function getROInstance(one_tab) {

	return (function($){

		var ro_extension = {
			
			comb_cnt: 0,
			discount_cnt: 0,
			special_cnt: 0,
			
			tabs_cnt: 0,
			
			events: {},
		
			each : function(collection, fn){
				for ( var i_item in collection ) {
					if ( !collection.hasOwnProperty(i_item) ) continue;
					if ( fn(collection[i_item], i_item) === false ) {
						return;
					}
				}
			},
			
			onEvent: function(event_name, fn){
				if ( event_name.indexOf(',') != -1 ) {
					ro_extension.each(event_name.split(','), function(current_event_name){
						ro_extension.onEvent( $.trim(current_event_name), fn);
					});
				}
				if ( typeof(ro_extension.events[event_name]) == 'undefined' ) {
					ro_extension.events[event_name] = [];
				}
				ro_extension.events[event_name].push(fn);
			},
			
			triggerEvent: function(event_name, params){
				let result = true;
				if ( typeof(ro_extension.events[event_name]) != 'undefined' ) {
					ro_extension.each(ro_extension.events[event_name], function(fn){
						result = result && fn.apply(ro_extension, params);
					});
				}
				return result;
			},
		
			init : function(one_tab) {
				
				$(document).trigger('init_before.ro', [ro_extension]);
				
				setInterval(function(){
					ro_extension.checkMaxInputVars();
				}, 1000);
				
				var added_tabs = 0;
				if (ro_data && ro_settings) {
					ro_extension.each(ro_data, function(ro_dt){
						var ro_tabs_num = ro_extension.addTab(ro_dt);
						added_tabs++;
						
						ro_extension.updateTabStatus(ro_tabs_num);
						
						if ( one_tab ) {
							return false;
						}
					});
				}
				if ( ro_settings && added_tabs==0 && one_tab ) {
					ro_extension.addTab();
				}
				
				ro_extension.enableEvents();
				
			},
			
			enableEvents : function(){
				$('#ro_content').on('change', 'select[id^="ro_o_"]', function(){
					var parts = $(this).attr('name').split(/\]|\[/);
					if ( parts.length > 8 && parts[0] == 'ro_data' && parts[7] == 'options' ) {
						var tab_num = parts[1];
						var ro_comb_num = parts[5];
						ro_extension.checkDuplicates(tab_num, ro_comb_num);
					}
				});
				
			},
			
			removeComb : function(button) {
				let $button = $(button);
				var tab_num = $button.closest('[data-ro-cnt]').attr('data-ro-cnt');
				var ro_tr_id = $button.closest('tr').attr('data-ro-tr-id');
				var $tr = $button.closest('tr');
				$tr.css('opacity', 0.1);
				setTimeout(function(){
					$tr.remove();
					ro_extension.checkDuplicates(tab_num, false, ro_tr_id);
					ro_extension.triggerEvent('removeComp_after', [tab_num]);
					//ro_extension.updatePagination(tab_num);
				}, 1);	
			},
			
			checkPerformance : function(fn, name) {
				var t0 = performance.now();
				fn();
				var t1 = performance.now();
				console.log('Call to '+name+' took ' + (t1 - t0) + ' milliseconds.');
			},
			
			// ROPRO
			// ro_tab_name_change
			updateTabName : function(ro_tabs_num) {
				
				let new_tab_name = '';
				if ( $('#ro-use-'+ro_tabs_num+'').is(':checked') ) {
					new_tab_name = $('#rov-'+ro_tabs_num+' option[value="'+$('#rov-'+ro_tabs_num).val()+'"]').html();
				} else {
					new_tab_name = ro_texts.related_options_title;
				}
				
				$('#ro_nav_tabs a[data-ro-cnt="'+ro_tabs_num+'"]').html(new_tab_name);
				
			},
			
			getTabElement : function(tab_num) {
				return $('#tab-ro-'+tab_num);
			},
			
			getTabTableContainer : function(tab_num) {
				return $('#tab-ro-'+tab_num).find('div.table-responsive:first');
			},
			
			getTabCombElements : function(tab_num) {
				
				// after some testings this way (with 'children') was found as the fastest
				var $trs = $('#tbody-ro-'+tab_num).children('tr');
	
				return $trs;
			},
			
			addTabContainer: function(tab_num, tab_data){
				
				if ( !ro_extension.triggerEvent('addTabContainer_before', [tab_num, tab_data]) ) {
					return;
				}
				
				let tab_id = 'tab-ro-'+tab_num;
				if ( !$('#'+tab_id).length ) {
					let html = '<div id="'+tab_id+'" data-ro-cnt="'+tab_num+'">'+tab_num+'</div>';
					$('#ro_content').append(html);
				}
				
			},
			
			addTabTable: function(tab_num, tab_data){
				
				let html = '';
				html+= '<input type="hidden" name="ro_data['+tab_num+'][rovp_id]" value="'+(tab_data.rovp_id ? tab_data.rovp_id : '0')+'">';
				html+= '<div class="form-group">';
				
				html+= '<label class="col-sm-2 control-label">'+ro_texts.entry_ro_use+'</label>';
				
				html+= '<div class="col-sm-10">';
				html+= '<label class="radio-inline">';
					html+= '<input type="radio" name="ro_data['+tab_num+'][use]" id="ro-use-'+tab_num+'" value="1" '+((tab_data.use)?('checked'):(''))+' onchange="ro_extension.updateTabStatus('+tab_num+')" />';
					html+= ' '+ro_texts.text_yes;
				html+= '</label>';
				html+= '<label class="radio-inline">';
					html+= '<input type="radio" name="ro_data['+tab_num+'][use]" value="" '+((tab_data.use)?(''):('checked'))+' onchange="ro_extension.updateTabStatus('+tab_num+')" />';
					html+= ' '+ro_texts.text_no;
				html+= '</label>';
				html+= '</div>';
				
				html+= '</div>';
				
				html+= '<div id="ro-use-data-'+tab_num+'">';
				html+= '	<div class="form-group">';
				html+= '		<label class="col-sm-2 control-label" for="rov-'+tab_num+'" >'+ro_texts.entry_ro_variant+'</label>';
				html+= '		<div class="col-sm-3" >';
				html+= '			<select name="ro_data['+tab_num+'][rov_id]" id="rov-'+tab_num+'" class="form-control" onChange="ro_extension.updateTabName('+tab_num+');">';
				
				if (ro_settings.ro_use_variants) {
					ro_extension.each(ro_variants_sorted, function(ro_variant){
						if (ro_variant.rov_id == 0) {
							html+= '				<option value="0">'+ro_texts.text_ro_all_options+'</option>';
						} else {
							html+= '			<option value="'+ro_variant.rov_id+'" '+(tab_data.rov_id && tab_data.rov_id == ro_variant.rov_id ? 'selected':'')+' >'+ro_variant.name+'</option>';
						}
					});	
				} else {
					html+= '				<option value="0">'+ro_texts.text_ro_all_options+'</option>';
				}
				
				html+= '			</select>';
				html+= '		</div>';
				html+= '		<button type="button" onclick="ro_extension.fillAllCombinations('+tab_num+');" data-toggle="tooltip" title="" class="btn btn-default" data-original-title="'+ro_texts.entry_add_all_variants+'">'+ro_texts.entry_add_all_variants+'</button>';
				html+= '		<button type="button" onclick="ro_extension.fillAllCombinations('+tab_num+',1);" data-toggle="tooltip" title="" class="btn btn-default" data-original-title="'+ro_texts.entry_add_product_variants+'">'+ro_texts.entry_add_product_variants+'</button>';
				html+= '		<button type="button" onclick="ro_extension.removeAllCombinations('+tab_num+');" data-toggle="tooltip" title="" class="btn btn-danger" data-original-title="'+ro_texts.entry_delete_all_combs+'">'+ro_texts.entry_delete_all_combs+'</button>';
				html+= '	</div>';
				
				
				html+= '	<div class="table-responsive" id="ro-table-'+tab_num+'">';
				html+= '		<table class="table table-striped table-bordered table-hover table-condensed">';
				html+= '			<thead>';
				html+= '				<tr>';
				if ( ro_settings.copy_comb_button ) {
					html += '				<td width="40"></td>';
				}
				html+= '					<td class="text-left">'+ro_texts.entry_options_values+'</td>';
				html+= '					<td class="text-left" width="90">'+ro_texts.entry_related_options_quantity+':</td>';
						
				let ro_fields = {
					spec_model: ro_texts.entry_model,
					spec_sku: ro_texts.entry_sku,
					spec_upc: ro_texts.entry_upc,
					spec_ean: ro_texts.entry_ean,
					spec_location: ro_texts.entry_location,
					spec_ofs: ro_texts.entry_stock_status,
					spec_weight: ro_texts.entry_weight,
				};
			
				ro_extension.each(ro_fields, function(ro_field, index_key){
					if (ro_settings[index_key] && ro_settings[index_key] != 0) {
						html+= '<td class="text-left" width="90">'+ro_field+'</td>';
					}
				});
						
				if (ro_settings.spec_price ) {
					html+= '				<td class="text-left" width="90" >'+ro_texts.entry_price+'</td>';
					if (ro_settings.spec_price_discount ) {
						html+= '					<td class="text-left" style="90">'+ro_texts.tab_discount+': <span style="font-weight:normal;font-size:80%;">('+ro_texts.entry_customer_group+' | '+ro_texts.entry_quantity+' | '+ro_texts.entry_price+' )</span></td>';
					}
					if (ro_settings.spec_price_special ) {
						html+= '					<td class="text-left" style="90">'+ro_texts.tab_special+': <span style="font-weight:normal;font-size:80%;">('+ro_texts.entry_customer_group+' |  '+ro_texts.entry_price+' )</span></td>';
					}
				}
							
				if (ro_settings.select_first && ro_settings.select_first == 1 ) {
					html+= '				<td class="text-left" width="90" style="white-space:nowrap">'+ro_texts.entry_select_first_short+':</td>';
				}
				
								
				html+= '					<td class="text-left" width="70"></td>';
				
				html+= '				<tr>';			
				html+= '		</thead>';
				html+= '		<tbody id="tbody-ro-'+tab_num+'"></tbody>';
				html+= '	</table>';
				html+= '</div>';
				
				html+= '<div class="form-group"><div class="col-sm-12" >';
				html+= '	<button type="button" onclick="ro_extension.addCombinationNew('+tab_num+');" data-toggle="tooltip" title="" class="btn btn-primary" data-original-title="'+ro_texts.entry_add_related_options+'">'+ro_texts.entry_add_related_options+'</button>';
				html+= '</div></div>';
				
				html+= '';
				html+= '';
				html+= '</div>';
				
				$('#tab-ro-'+tab_num+'').html(html);
				
				ro_extension.triggerEvent('addTabTable_after', [tab_num]);
				
			},
			
			// ro_add_tab
			addTab : function(tab_data_param) {
				
				let tab_data = tab_data_param ? tab_data_param : false;
				let tab_num = ro_extension.tabs_cnt;
				
				ro_extension.triggerEvent('addTab_before', [tab_num, tab_data]);
				ro_extension.addTabContainer(tab_num, tab_data);
				
				
				$('#ro_nav_tabs [data-ro-cnt='+tab_num+']').click();
				
				ro_extension.addTabTable(tab_num, tab_data);
				
				ro_extension.updateTabStatus(tab_num);
				
				if (tab_data.ro) {
					ro_extension.each(tab_data.ro, function(ro_comb){
						ro_extension.addCombination(tab_num, ro_comb);
					});
				}
				
				ro_extension.checkDuplicates(tab_num);
				ro_extension.checkDefaultSelectPriority(tab_num);
				
				ro_extension.triggerEvent('addTab_after', [tab_num]);
				//ro_extension.updatePagination(ro_tabs_cnt);
				
				ro_extension.tabs_cnt++;
				
				return ro_tabs_cnt-1;
				
			},
			
			// ro_use_check
			updateTabStatus : function(tab_num) {
				
				$('#ro-use-data-'+tab_num).toggle( $('input[type=radio][name="ro_data['+tab_num+'][use]"][value="1"]').is(':checked') );
				ro_extension.updateTabName(tab_num);
				
			},
			
			getROTabNumByElement : function($elem) {
				return $elem.closest('[data-ro-cnt]').attr('data-ro-cnt');
			},
			
			getROTrByNum : function(ro_num) {
				return $('#related-option'+ro_num);
			},
			
			getROCombValuesFromForm : function(ro_num) {
				let $tr = ro_extension.getROTrByNum(ro_num);
				let tab_num = ro_extension.getROTabNumByElement($tr);
				let name_begin = 'ro_data['+tab_num+'][ro]['+ro_num+']';
				
				$inputs = $tr.find('input[type="text"], textarea, select, checkbox:checked').filter('[name]');
				
				let values = {options:{}, discounts:[], specials:[]};
				$inputs.each(function(){
					let $input = $(this);
					let name = $input.attr('name');
					if ( name && name.indexOf(name_begin) === 0 ) {
						name = name.substr(name_begin.length);
						
						name_parts = name.split(/\[|\]/);
						
						if ( name_parts.length >= 2 ) {
							let param_name = name_parts[1];
							if ( name_parts.length >= 5 ) { // options, discounts, specials
								let param_key = name_parts[3];
								if ( param_name == 'options' ) {
									values.options[param_key] = $input.val();
									
								} else if ( param_name == 'discounts' || param_name == 'specials' ) {
									if ( !values[param_name][param_key] ) {
										values[param_name][param_key] = {};
									}
									values[param_name][param_key][name_parts[5]] = $input.val();
								}
								
							} else { // simple inputs/selects/checkboxes
								values[param_name] = $input.val();
							}
						}
					}
				});
				return values;
			},
			
			copyCombination : function(ro_num) {
				let $tr = ro_extension.getROTrByNum(ro_num);
				let tab_num = ro_extension.getROTabNumByElement($tr);
				
				if ( $tr.length ) {
					
					let params = ro_extension.getROCombValuesFromForm(ro_num);
					
					ro_extension.addCombination(tab_num, params);
					
					ro_extension.checkDuplicates(tab_num);
					
					ro_extension.triggerEvent('copyCombination_after', [tab_num]);
				}
				
				
			},
			
			// ro_add_combination
			addCombination : function(tab_num, params) {
				
				var rov_id = $('#rov-'+tab_num).val();
				var ro_variant = ro_variants[ rov_id ];
				var entry_add_discount = ro_texts.entry_add_discount;
				var entry_add_special = ro_texts.entry_add_special;
				let ro_num = ro_extension.comb_cnt;

				var str_add = '';
				str_add += '<tr id="related-option'+ro_num+'" '+(ro_settings.pagination ? 'style="display:none;' : '')+'">';
				
				if ( ro_settings.copy_comb_button ) {
					str_add += '<td>';
					str_add += '<button type="button" onclick="ro_extension.copyCombination('+ro_num+');" title="'+ro_texts.entry_copy_comb_button_help_title+'" class="btn btn-default btn-xs"><i class="fa fa-plus-circle"></i></button>';
					str_add += '</td>';
				}
				
				str_add +='<td>';
				var div_id = 'ro_status'+ro_num;
				str_add +='<div id="'+div_id+'" style="color: red"></div>';
				
				ro_extension.each(ro_variant.options, function(ro_option){
					var option_id = ro_option.option_id;
				
					str_add += "<div style='float:left;'><label class='col-sm-1 control-label' for='ro_o_"+ro_num+"_"+option_id+"'> ";
					str_add += "<nobr>"+ro_option.name+":</nobr>";
					str_add += "</label>";
					str_add += "<select class='form-control' id='ro_o_"+ro_num+"_"+option_id+"' name='ro_data["+tab_num+"][ro]["+ro_num+"][options]["+option_id+"]'>";
					//str_add += "<select class='form-control' id='ro_o_"+ro_num+"_"+option_id+"' name='ro_data["+tab_num+"][ro]["+ro_num+"][options]["+option_id+"]' onChange=\"ro_extension.checkDuplicates("+tab_num+","+ro_num+")\">";
					str_add += "<option value=0></option>";
					
					if ( ro_all_options[option_id] ) {
						ro_extension.each(ro_all_options[option_id].values, function(ov_details){
						  
							var option_value_id = ov_details.option_value_id;
							
							str_add += "<option value='"+option_value_id+"'";
							if (params.options && params.options[option_id] && params.options[option_id] == option_value_id) str_add +=" selected ";
							str_add += ">"+ov_details.name+"</option>";
						});
					}
			
					str_add += "</select>";
					str_add += "</div>";
				});
				
				
				str_add += "</td>";
				str_add += '<td><label class="control-label">&nbsp;</label>';
				str_add += "<input type='text' class='form-control' name='ro_data["+tab_num+"][ro]["+ro_num+"][quantity]' size='2' value='"+(params.quantity||0)+"'>";
				str_add += "<input type='hidden' name='ro_data["+tab_num+"][ro]["+ro_num+"][relatedoptions_id]' value='"+(params.relatedoptions_id||"")+"'>";
				str_add += "</td>";
				
				str_add += ro_extension.addTextField(tab_num, ro_num, 'spec_model', params, 'model');
				str_add += ro_extension.addTextField(tab_num, ro_num, 'spec_sku', params, 'sku');
				str_add += ro_extension.addTextField(tab_num, ro_num, 'spec_upc', params, 'upc');
				str_add += ro_extension.addTextField(tab_num, ro_num, 'spec_ean', params, 'ean');
				str_add += ro_extension.addTextField(tab_num, ro_num, 'spec_location', params, 'location');
				
				if (ro_settings.spec_ofs) {
					
					str_add += '<td>';
					str_add += '<label class="control-label">&nbsp;</label><select name="ro_data['+tab_num+'][ro]['+ro_num+'][stock_status_id]" class="form-control">';
					str_add += '<option value="0">-</option>';
					ro_extension.each(ro_stock_statuses, function(ro_stock_status){
						str_add += '<option value="'+ro_stock_status.stock_status_id+'"';
						if (ro_stock_status.stock_status_id == params.stock_status_id) {
							str_add += ' selected ';
						}
						str_add += '>'+ro_stock_status.name+'</option>';
					});
					str_add += '</select>';
					str_add += '</td>';
				}
				
				if (ro_settings.spec_weight)	{
					str_add += "<td>";
					str_add += '<select class="form-control input-sm" name="ro_data['+tab_num+'][ro]['+ro_num+'][weight_prefix]">';
					str_add += "<option value='=' "+( (params.weight_prefix && params.weight_prefix=='=')? ("selected") : (""))+">=</option>";
					str_add += "<option value='+' "+( (params.weight_prefix && params.weight_prefix=='+')? ("selected") : (""))+">+</option>";
					str_add += "<option value='-' "+( (params.weight_prefix && params.weight_prefix=='-')? ("selected") : (""))+">-</option>";
					str_add += "</select>";
					str_add += "<input type='text' class='form-control' name='ro_data["+tab_num+"][ro]["+ro_num+"][weight]' value=\""+(params.weight||'0.000')+"\" size='5'>";
					str_add += "</td>";
				}
				
				if (ro_settings.spec_price)	{
					str_add += "<td>";
					if (ro_settings.spec_price_prefix) {
						str_add += '<select name="ro_data['+tab_num+'][ro]['+ro_num+'][price_prefix]" class="form-control input-sm">';
						let price_prefixes = ['=', '+', '-'];
						
						ro_extension.each(price_prefixes, function(price_prefix){
							str_add += "<option value='"+price_prefix+"' "+(price_prefix==params.price_prefix?"selected":"")+">"+price_prefix+"</option>";
						});
						str_add += "</select>";
					} else {
						str_add += '<label class="control-label">&nbsp;</label>';
					}
					str_add += "<input type='text' class='form-control' name='ro_data["+tab_num+"][ro]["+ro_num+"][price]' value='"+(params.price||'')+"' size='10'>";
					str_add += "</td>";
				}
				
				
				if (ro_settings.spec_price && ro_settings.spec_price_discount)	{
					str_add += "<td>";
				
					str_add += "<button type='button' onclick=\"ro_extension.addDiscount("+tab_num+", "+ro_num+", '');\" data-toggle='tooltip' title='"+entry_add_discount+"' class='btn btn-primary'><i class='fa fa-plus-circle'></i></button>";
					str_add += "<div id='ro_price_discount"+ro_num+"' >";
					str_add += "</div>";
					str_add += "</td>";	
				}
				
				if (ro_settings.spec_price && ro_settings.spec_price_special)	{
					str_add += "<td>";
					str_add += "<button type='button' onclick=\"ro_extension.addSpecial("+tab_num+", "+ro_num+", '');\" data-toggle='tooltip' title='"+entry_add_special+"' class='btn btn-primary'><i class='fa fa-plus-circle'></i></button>";
					str_add += "<div id='ro_price_special"+ro_num+"'>";
					str_add += "</div>";
					str_add += "</td>";	
				}
				
				if (ro_settings.select_first && ro_settings.select_first==1) {
					str_add += '<td><label class="control-label">&nbsp;</label>';
					
					str_add += "<input id='defaultselect_"+ro_num+"' type='checkbox' onchange='ro_extension.checkDefaultSelectPriority("+tab_num+");' name='ro_data["+tab_num+"][ro]["+ro_num+"][defaultselect]' "+((params && params.defaultselect==1)?("checked"):(""))+" value='1'>";
					str_add += '<input id="defaultselectpriority_'+ro_num+'" type="text" class="form-control" title="'+ro_texts.entry_select_first_priority+'" name="ro_data['+tab_num+'][ro]['+ro_num+'][defaultselectpriority]"  value="'+((params && params.defaultselectpriority)?(params.defaultselectpriority):(''))+'" >';
					str_add += "</td>";	
				}
			
				str_add += '<td class="text-right" ><label class="col-sm-12 control-label">&nbsp;</label>';
				str_add += '<button type="button" class="btn btn-danger" onclick="ro_extension.removeComb(this)" class="btn btn-primary" data-original-title="'+ro_texts.button_remove+'" ><i class="fa fa-minus-circle"></i></button>';
				str_add += '</td>';
				str_add += '</tr>';
				
				$('#tbody-ro-'+tab_num).append(str_add);
				
				if (ro_settings.spec_price && ro_settings.spec_price_discount)	{
					if (params && params.discounts ) {
						ro_extension.each(params.discounts, function(discount_details){
							ro_extension.addDiscount(tab_num, ro_num, discount_details);
						});
					}
				}
				
				if (ro_settings.spec_price && ro_settings.spec_price_special)	{
					if (params && params.specials ) {
						ro_extension.each(params.specials, function(special_details){
							ro_extension.addSpecial(tab_num, ro_num, special_details);
						});
					}
				}
				
				ro_extension.updateCombinationUID(tab_num,ro_num);
				
				ro_extension.comb_cnt++;
				
				ro_extension.triggerEvent('addCombination_after', [tab_num, ro_num, params]);
				
				return ro_num;
			},
			
			addCombinationNew: function(tab_num) {
				
				let ro_num = ro_extension.addCombination(tab_num, false);
				
				ro_extension.checkDuplicates(tab_num);
				ro_extension.checkDefaultSelectPriority(tab_num);
				
				ro_extension.triggerEvent('addCombinationNew_after', [tab_num, ro_num]);
			},
			
			// ro_refresh_status
			checkDuplicates : function(ro_tabs_num, ro_num, p_ro_tr_id) {
				
				var ro_tr_id_check = '';
				if ( ro_num || ro_num===0 ) {
					var ro_tr_id_old = ro_extension.getCombinationUID(ro_num);
					ro_tr_id_check = ro_extension.updateCombinationUID(ro_tabs_num, ro_num);
					ro_extension.checkDuplicates(ro_tabs_num, false, ro_tr_id_old);
				} else if ( p_ro_tr_id ) {
					ro_tr_id_check = p_ro_tr_id;
				}
				
				$('#tab-ro-'+ro_tabs_num+' [data-ro-tr-id="'+ro_tr_id_check+'"] div[id^=ro_status]').filter(':not(:empty)').html('');
				
				var $trs = ro_extension.getTabCombElements(ro_tabs_num);
				if ( ro_tr_id_check ) {
					$trs = $trs.filter('[data-ro-tr-id="'+ro_tr_id_check+'"]');
				}
				
				var tr_ids = {};
				var double_tr_ids = [];
				$trs.each( function () {
					var ro_comb_tr_id = $(this).attr('data-ro-tr-id');
					
					if ( !tr_ids[ro_comb_tr_id] ) {
						tr_ids[ro_comb_tr_id] = true;
					} else {
						double_tr_ids.push(ro_comb_tr_id);
					}
				});
				
				ro_extension.each(double_tr_ids, function(double_tr_id){
					$trs.filter('[data-ro-tr-id="'+double_tr_id+'"]').each(function(){
						$(this).find('div[id^=ro_status]').html(ro_texts.warning_equal_options);
					});
				});
				return;
				
			},
			
			// ro_update_combination
			updateCombinationUID : function(ro_tabs_num, ro_num) {
				
				var rov_id = $('#rov-'+ro_tabs_num).val();
				var ro_variant = ro_variants[ rov_id ];
				var str_opts = "";
				
				ro_extension.each(ro_variant.options, function(variant_option){
					var option_id = variant_option.option_id;
				
					str_opts += "_o"+option_id;
					str_opts += "_"+$('#ro_o_'+ro_num+'_'+option_id).val();
				});
				ro_extension.getROTrByNum(ro_num).attr('data-ro-tr-id', str_opts);
				return str_opts;
			},
			
			getCombinationUID : function(ro_num) {
				return ro_extension.getROTrByNum(ro_num).attr('data-ro-tr-id');
			},
			
			// ro_add_text_field
			addTextField : function(ro_tabs_num, ro_num, setting_name, params, field_name) {
				str_add = "";
				if (ro_settings[setting_name] && ro_settings[setting_name]!='0')	{
					str_add += '<td><label class="control-label">&nbsp;</label>';
					str_add += "<input type='text' class='form-control' name='ro_data["+ro_tabs_num+"][ro]["+ro_num+"]["+field_name+"]' value=\""+(params[field_name]||'')+"\">";
					str_add += "</td>";
				}
				return str_add;
			},
			
			// ro_add_discount
			addDiscount : function(ro_tabs_num, ro_num, discount) {
				
				let discount_num = ro_extension.discount_cnt;

				
				var first_name = "ro_data["+ro_tabs_num+"][ro]["+ro_num+"][discounts]["+discount_num+"]";
				var customer_group_id = (discount=="")?(0):(discount.customer_group_id);
				
				str_add = "";
				str_add += "<table id='related-option-discount"+discount_num+"' style='width:300px;'><tr><td>";
				
				str_add += '<select name="'+first_name+'[customer_group_id]" class="form-control" title="'+ro_texts.entry_customer_group+'" style="float:left;width:80px;">';
				ro_extension.each(ro_customer_groups, function(ro_customer_group){
					str_add += '<option value="'+ro_customer_group.customer_group_id+'" '+(customer_group_id==ro_customer_group.customer_group_id ? 'selected' : '')+'>'+ro_customer_group.name+'</option>';
				});
				str_add += '</select>';
				
				str_add += '<input type="text" class="form-control" style="float:left;width:100px;" size="2" name="'+first_name+'[quantity]" value="'+((discount=='')?(''):(discount.quantity))+'" title="'+ro_texts.entry_quantity+'">';
				str_add += '';
				
				// hidden
				str_add += '<input type="hidden" name="'+first_name+'[priority]" value="'+((discount=='')?(''):(discount.priority))+'" title="'+ro_texts.entry_priority+'">';
				
				str_add += '<input type="text" class="form-control" style="float:left;width:80px;" size="10" name="'+first_name+'[price]" value="'+((discount=='')?(''):(discount.price))+'" title="'+ro_texts.entry_price+'">';
				
				str_add += '<button type="button" onclick="$(\'#related-option-discount' + discount_num + '\').remove();" data-toggle="tooltip" title="'+ro_texts.button_remove+'" class="btn btn-danger" style="float:left;" data-original-title=""><i class="fa fa-minus-circle"></i></button>';
			
				str_add += '</td></tr></table>';
				
				$('#ro_price_discount'+ro_num).append(str_add);
				
				ro_extension.discount_cnt++;
				
			},
			
			// ro_add_special
			addSpecial : function(ro_tabs_num, ro_num, special) {
				
				let special_num = ro_extension.special_cnt;
				
				var first_name = "ro_data["+ro_tabs_num+"][ro]["+ro_num+"][specials]["+special_num+"]";
				var customer_group_id = (special=="")?(0):(special.customer_group_id);
				
				str_add = "";
				str_add += "<table id='related-option-special"+special_num+"' style='width:200px;'><tr><td>";
				
				str_add += '<select name="'+first_name+'[customer_group_id]" class="form-control" style="float:left;width:80px;" title="'+ro_texts.entry_customer_group+'">';
				ro_extension.each(ro_customer_groups, function(ro_customer_group){
					str_add += '<option value="'+ro_customer_group.customer_group_id+'" '+(customer_group_id==ro_customer_group.customer_group_id ? 'selected' : '')+'>'+ro_customer_group.name+'</option>';
				});
				str_add += '</select>';
				
				// hidden
				str_add += '<input type="hidden" size="2" name="'+first_name+'[priority]" value="'+((special=='')?(''):(special.priority))+'" title="'+ro_texts.entry_priority+'">';
				str_add += '<input type="text" class="form-control" style="float:left;width:80px;" size="10" name="'+first_name+'[price]" value="'+((special=='')?(''):(special.price))+'" title="'+ro_texts.entry_price+'">';
				str_add += '<button type="button" onclick="$(\'#related-option-special' + special_num + '\').remove();" data-toggle="tooltip" title="'+ro_texts.button_remove+'" class="btn btn-danger" style="float:left;" data-original-title="'+ro_texts.button_remove+'"><i class="fa fa-minus-circle"></i></button>';
				str_add += "</td></tr></table>";
				
				$('#ro_price_special'+ro_num).append(str_add);
				
				ro_extension.special_cnt++;
				
			},
			
			// ro_delete_all_combinations
			removeAllCombinations : function(ro_tabs_num) {
			
				if ( confirm(ro_texts.text_delete_all_combs) ) {
					// fastest
					$('#tbody-ro-'+ro_tabs_num+' tr').detach().remove();
					ro_extension.checkDuplicates(ro_tabs_num);
					
					ro_extension.triggerEvent('removeAllCombinations_after', [ro_tabs_num]);
					//ro_extension.updatePagination(ro_tabs_num);
					
				}
			},
			
			numberOfPossibleCombinations : function(ro_variant) {
				var numberOfCombs = 1;
				ro_extension.each(ro_variant.options, function(variant_option){
					var option_id = variant_option.option_id;
					var numberOfValues = ro_all_options[option_id].values.length || 1;
					numberOfCombs = numberOfCombs * numberOfValues;
				});
				return numberOfCombs;
			},
			
			confirmNumberOfCombinations : function(number_of_combs) {
				var max_number_of_combinations = ro_texts.max_number_of_combinations;
				var confirm_number_of_combinations = ro_texts.confirm_number_of_combinations;
				if ( number_of_combs > max_number_of_combinations ) {
					alert(ro_texts.text_combs_number+number_of_combs.toString()+ro_texts.text_combs_number_out_of_limit);
					return false;
				} else if ( number_of_combs > confirm_number_of_combinations ) {
					if ( !confirm(ro_texts.text_combs_number+number_of_combs.toString()+ro_texts.text_combs_number_is_big) ) {
						return false;
					}
				} else {
					if ( !confirm(number_of_combs.toString()+ro_texts.text_combs_will_be_added) ) {
						return false;
					}
				}
				return true;
			},
			
			// ro_fill_all_combinations
			fillAllCombinations : function(ro_tabs_num, product_options_only) {
				
				var rov_id = $('#rov-'+ro_tabs_num).val();
				var ro_variant = ro_variants[ rov_id ];
				var all_vars = [];
				
				if (product_options_only) {
					var this_product_options = [];
					$('select[name^=product_option][name*=option_value_id]').each(function() {
						if ( $(this).val() ) {
							this_product_options.push($(this).val());
						}
					});
				}
				
				if (!product_options_only) {
					// if all options used, there may be millinons of combinations, it may freeze script before determination of combinations list
					let numberOfCombs = ro_extension.numberOfPossibleCombinations(ro_variant);
					if (!ro_extension.confirmNumberOfCombinations(numberOfCombs)) {
						return;
					}
				}
					
				var reversed_options = [];
				ro_extension.each(ro_variant.options, function(variant_option, index){
					reversed_options.unshift(index);
				});
					
				ro_extension.each(reversed_options, function(ro_variant_option_index){
					
					var option_id = ro_variant.options[ro_variant_option_index].option_id;
					
					var temp_arr = [];
					ro_extension.each(ro_all_options[option_id].values, function(ov_details){
						
						var option_value_id = ov_details.option_value_id;
						
						if ( !product_options_only || $.inArray(option_value_id, this_product_options) != -1 ) { //
							
							if (all_vars.length) {
								ro_extension.each(all_vars, function(current_set_of_options){
								//for (var k in all_vars) {
								//  if((all_vars[k] instanceof Function) ) { continue; }
								  
									var comb_arr = current_set_of_options.slice(0);
									comb_arr[option_id] = option_value_id;
									temp_arr.push( comb_arr );
								});
							} else {
								var comb_arr = [];
								comb_arr[option_id] = option_value_id;
								temp_arr.push(comb_arr);
							}
						}
					});
					if (temp_arr && temp_arr.length) {
						all_vars = temp_arr.slice(0);
					}
				});
				
				if (all_vars.length) {
					
					if (product_options_only) {
						let numberOfCombs = all_vars.length;
						if (!ro_extension.confirmNumberOfCombinations(numberOfCombs)) {
							return;
						}
					}
				
					ro_extension.each(all_vars, function(current_set_of_options){
						
						rop = {};
						ro_extension.each(current_set_of_options, function(option_value_id, option_id){
							rop[option_id] = option_value_id;
						});
						
						ro_extension.addCombination(ro_tabs_num, {options: rop});
			
					});
					
					ro_extension.updateTabStatus(ro_tabs_num);
					ro_extension.checkDuplicates(ro_tabs_num);
					ro_extension.checkDefaultSelectPriority(ro_tabs_num);
					
					ro_extension.triggerEvent('fillAllCombinations_after', [ro_tabs_num]);
					//ro_extension.updatePagination(ro_tabs_num);
					
				}
				
			},
			
			// check priority fields (is it available or not) for default options combination
			// ro_check_defaultselectpriority
			checkDefaultSelectPriority : function(ro_tabs_num) {
				
				var dsc = $('#tab-ro-'+ro_tabs_num+' input[type=checkbox][id^=defaultselect_]');
				var dsp;
				for (var i=0;i<dsc.length;i++) {
					dsp = $('#defaultselectpriority_'+dsc[i].id.substr(14));
					if (dsp && dsp.length) {
						if (dsc[i].checked) {
							dsp[0].style.display = '';
							if (isNaN(parseInt(dsp[0].value))) {
								dsp[0].value = 0;
							}
							if (parseInt(dsp[0].value)==0) {
								dsp[0].value = "1";
							}
						} else {
							dsp[0].style.display = 'none';
						}
					}
				}
			},
			
			// check_max_input_vars
			checkMaxInputVars : function() {
				var max_input_vars = ro_texts.max_input_vars;
				if (max_input_vars && !$('#warning_max_input_vars').length) {
					var input_vars = $('select').length + $('input').length  + $('textarea').length; // works faster
					//var input_vars = $('select, input, textarea').length;
					if ( input_vars/max_input_vars*100 > 80 ) {
						var html = '<div class="alert alert-danger" id="warning_max_input_vars"><i class="fa fa-exclamation-circle"></i> '+ro_texts.warning_max_input_vars+'</div>';
						$('div.panel:first').before(html);
					}
				}
			},
		};
		
		ro_extension.init(one_tab);
		
		return ro_extension;
	})(jQuery);
}