Ext.ns('com.atento.gap');
Ext.BLANK_IMAGE_URL='../../extjs/resources/images/s.gif';
Ext.chart.Chart.CHART_URL = '../../extjs/resources/charts.swf';
com.atento.gap.ValidarIncidencia={
    id:'frmvalidaincidencia',
    url:'../controllers/validar_incidencia_controller.php',
    columnas : ['empleado']
    ,aplica_Efecto:function(obj){
        obj.scale(600);obj.slideIn();obj.highlight();
    },changeColor: function(value, metaData, record, rowIndex, colIndex, store){
        metaData.attr = 'style="color:#0000FF;"';
        return value;
    },detalleExtension:function(){
        alert('mostrar detalle de la extension');
    },formateaExtension:function(value, metaData, record, rowIndex, colIndex, store){
        var c='';
        if(value!=''){
            if(value.split(' - ')[0]=='Si'){
                metaData.attr = 'style="white-space:nowrap;text-align:center;background-color:#F4FA58;"';
                c='<a href="javascript:com.atento.gap.ValidarIncidencia.detalleExtension()" border="0" style="color: #000000;" title="Detalle de Extension">'+value+'</a>';
            }else if(value.split(' - ')[0]=='No'){
                c=value;
            }
        }
        return c;
    },changeColorSel: function(value, metaData, record, rowIndex, colIndex, store){
        var cadena='';
        if(parseInt(value.split('_')[2])!=0) metaData.attr = 'style="white-space:normal;text-align:center;background-color:#F4FA58;"';//background-color: #D8DAB4;
        else metaData.attr = 'style="white-space:normal;text-align:center;"';//background-color: #D8DAB4;
        cadena+=' <input type="radio" id="rdo" name="rdo_emp[]" value="'+value+'" ';
        cadena+=' style="cursor:pointer;" onclick="javascript:com.atento.gap.ValidarIncidencia.cargarStorePivot(this.value)" title="'+value.split('_')[2]+'"/> ';
        return cadena;
    },formateaColumna:function(value, metaData, record, rowIndex, colIndex, store){
        metaData.attr = 'style="white-space:normal;font-size: 9px;font-family: "Arial", sans-serif;';
        return value;
    },recarga:function(fecha){
        var fec='';
        if(typeof fecha!="undefined"){
            fec=fecha;
        }else{
            fec=Ext.getCmp(com.atento.gap.ValidarIncidencia.id+'-hdd_fecha_selected').getValue();
        }
        //-->RECARGAR DATOS DEL GRUPO X FECHA
        Ext.getCmp(com.atento.gap.ValidarIncidencia.id+'-listado_grupo').getStore().removeAll();
        
        this.datosEjecutivos.load({
            params:{
                /*start:0,
                limit:5,*/
                find:Ext.get('buscam').getValue(),
                f:fec
            }
        });
        //-->RECARGAR OTROS X FECHA
        Ext.getCmp(com.atento.gap.ValidarIncidencia.id+'-listado_otros').getStore().removeAll();
        this.datosOtros.load({params:{f:fec}});
        //-->RECARGAR DATOS CESADOS X FECHA
        Ext.getCmp(com.atento.gap.ValidarIncidencia.id+'-listado_cesados').getStore().removeAll();
        this.datosCesados.load({params:{f:fec}});
        //-->RECARGAR RESUMEN SUPERVISOR X FECHA
        this.datos_column_supervisor.load({
            params:{
                fecha :fec
            }
        });
        Ext.getCmp(com.atento.gap.ValidarIncidencia.id+'tab_resumen').setActiveTab(1);
    },cargaEjecutivosxFecha:function(fecha_c){//-->!DATA[STORES]
        //-->DATA MI GRUPO
        this.datosEjecutivos=new Ext.data.JsonStore({
            url:com.atento.gap.ValidarIncidencia.url,
            root:'data',
            totalProperty : 'total',
            fields: ['radio','empleado','turno_descripcion','asistencia_entrada'
                ,'asistencia_salida','tardanza_minutos','extension'
                ,'tipo_extension','vacaciones','falta'],
            baseParams : {action : 'datagrupo',responsable_codigo:Ext.get("empleado_codigo").getValue(),fecha:fecha_c}
        });
        //-->DATA OTROS
        this.datosOtros=new Ext.data.JsonStore({
            url:com.atento.gap.ValidarIncidencia.url,
            root:'data',
            totalProperty:'total',
            fields: ['radio','empleado','turno_descripcion','asistencia_entrada'
                ,'asistencia_salida','tardanza_minutos','extension'
                ,'tipo_extension','vacaciones','falta'],
            baseParams : { action : 'dataotros',responsable_codigo:Ext.get("empleado_codigo").getValue(),fecha:fecha_c}
        });
        //-->DATA CESADOS
        this.datosCesados=new Ext.data.JsonStore({
            url:com.atento.gap.ValidarIncidencia.url,
            root:'data',
            totalProperty:'total',
            fields: ['radio','empleado','turno_descripcion','asistencia_entrada'
                ,'asistencia_salida','tardanza_minutos','extension'
                ,'tipo_extension','vacaciones','falta'],
            baseParams : { action : 'datacesados',responsable_codigo:Ext.get("empleado_codigo").getValue(),fecha:fecha_c}
        });
        //-->DATA PIVOT RAC
        this.datos_pivot_rac = new Ext.data.JsonStore({
            url: com.atento.gap.ValidarIncidencia.url,
            root: 'data',
            fields: ['incidencia','total'],
            autoLoad: true
            ,baseParams: {action:'resumenrac',empleado_codigo:0,asistencia_codigo:0,responsable_codigo:0,tiempo_efectivo :0,
                extension_tiempo : 0}
        });
        //-->DATA COLUMN SUPERVISOR
        this.datos_column_supervisor = new Ext.data.JsonStore({
            url: com.atento.gap.ValidarIncidencia.url,
            root: 'data',
            fields: ['asistencia_fecha','total_empleados','asistencias','extensiones','tardanzas','turnos_especiales']
            ,autoLoad: true
            ,baseParams: {action:'resumensupervisor',responsable_codigo:Ext.get("empleado_codigo").getValue(),fecha :fecha_c}
        });
    },cargarStorePivot:function(_data){//pivot
        Ext.getCmp(com.atento.gap.ValidarIncidencia.id+'tab_resumen').setActiveTab(0);
        var reg='';
        var tiempo_efectivo='';
        var extension_tiempo='';
        if(typeof _data=="undefined"){
            reg=document.getElementById('hdd_registro').value;
            tiempo_efectivo=reg.split("_")[3];
            extension_tiempo=reg.split("_")[4];
        }else{
            reg=_data;
            document.getElementById('hdd_tiempo_efectivo').value=_data.split("_")[6];
            document.getElementById('hdd_extension_tiempo').value=_data.split("_")[7];
            tiempo_efectivo=reg.split("_")[6];
            extension_tiempo=reg.split("_")[7];
            Ext.getCmp(com.atento.gap.ValidarIncidencia.id+'panel-pivot-rac').setTitle(_data.split("_")[8]);
        }
        var responsable_codigo=reg.split("_")[0];
        var empleado_codigo=reg.split("_")[1];
        var asistencia_codigo=reg.split("_")[2];
        //alert('1->'+responsable_codigo+'->2->'+empleado_codigo+'->3->'+asistencia_codigo+'->4->'+tiempo_efectivo+'->5->'+extension_tiempo);
        this.datos_pivot_rac. load({
            params:{
                action : 'resumenrac',
                responsable_codigo:responsable_codigo,
                empleado_codigo : empleado_codigo,
                asistencia_codigo : asistencia_codigo,
                tiempo_efectivo : tiempo_efectivo,
                extension_tiempo : extension_tiempo
            }
        });
        /*this.datos_pivot_rac. load({
            params:{
                action : 'resumenrac',
                responsable_codigo:7861,
                empleado_codigo : 55214 ,
                asistencia_codigo : 134,
                tiempo_efectivo : 600,
                extension_tiempo : 0
            }
        });*/
        //console.info(this.datos_pivot_rac);
        com.atento.gap.Menu.show_Panel('panel-pivot-rac');
        com.atento.gap.ValidarIncidencia.cargarIncidencias(reg);
    },cargarIncidencias:function(_registro){
        var responsable_codigo=_registro.split("_")[0];
        var empleado_codigo=_registro.split("_")[1];
        var asistencia_codigo=_registro.split("_")[2];
        var newHtml='';
        if(parseInt(asistencia_codigo)==0){
            newHtml+='<table class="Table_Incidencias" id="Table_Incidencias" cellspacing="3">';
            newHtml+='<tbody>';
            newHtml+='<tr class="cabecera_tabla">';
            newHtml+='<th>No hay registros de asistencias activas al momento!!</th>';
            newHtml+='</tr>';
            newHtml+='</tbody>';
            newHtml+='</table>';
            Ext.get('lista').dom.innerHTML='';
            Ext.DomHelper.append('lista',newHtml,true);
            com.atento.gap.ValidarIncidencia.aplica_Efecto(Ext.get('lista'));
            return;
        }else{
            Ext.Ajax.request({
                url:com.atento.gap.ValidarIncidencia.url,
                method: 'POST',
                params:{
                    action:'incidenciasXejecutivo',
                    empleado_codigo:empleado_codigo,
                    asistencia_codigo:asistencia_codigo,
                    responsable_codigo:responsable_codigo
                },success: function(response, opts) {
                    var respuesta = Ext.decode(response.responseText);
                    //--DETALLE RESPONSABLE
                    newHtml+='<table class="Table_Incidencias" id="Table_Incidencias" cellspacing="3">';
                    newHtml+='<tbody>';
                    newHtml+='<tr class="cabecera_tabla">';
                    newHtml+='<th>Responsable</th>';
                    newHtml+='</tr>';
                    Ext.each(respuesta.data[0].responsable_asistencia, function(responsable) {
                        newHtml+='<tr>';
                        newHtml+='<th>'+responsable.responsable+'</th>';
                        newHtml+='</tr>';
                    });
                    newHtml+='</tbody>';
                    newHtml+='</table>';
                    newHtml+='<br/>';
                    //--DETALLE INCIDENCIAS
                    newHtml+='<table class="Table_Incidencias" id="Table_Incidencias" cellspacing="3">';
                    newHtml+='<tbody>';
                    newHtml+='<tr class="cabecera_tabla">';
                    newHtml+='<th>Incidencia</th>';
                    newHtml+='<th>Inicio</th>';
                    newHtml+='<th>Fin</th>';
                    newHtml+='<th>Tiempo</th>';
                    newHtml+='<th>Modificar</th>';
                    newHtml+='<th>Eliminar</th>';
                    newHtml+='</tr>';
                    Ext.each(respuesta.data[1].incidencia_asistencia, function(incidencias) {
                        newHtml+='<tr>';
                        newHtml+='<th>'+incidencias.imagen+'&nbsp;'+incidencias.incidencia+'</th>';
                        newHtml+='<th>'+incidencias.inicio+'</th>';
                        newHtml+='<th>'+incidencias.fin+'</th>';
                        newHtml+='<th>'+incidencias.tiempo+'</th>';
                        newHtml+='<th>'+incidencias.modificar+'</th>';
                        newHtml+='<th>'+incidencias.eliminar+'</th>';
                        newHtml+='</tr>';
                    });
                    newHtml+='</tbody>';
                    newHtml+='</table>';
                    newHtml+='<br/>';
                    //--DETALLE JORNADAS PASIVAS
                    newHtml+='<table class="Table_Incidencias" id="Table_Incidencias" cellspacing="3">';
                    newHtml+='<tbody>';
                    newHtml+='<tr class="cabecera_tabla">';
                    newHtml+='<th>Tiempo</th>';
                    newHtml+='<th>Observacion</th>';
                    newHtml+='<th>Ticket</th>';
                    newHtml+='<th>Validable por</th>';
                    newHtml+='<th>Evento</th>';
                    newHtml+='<th>Estado</th>';
                    newHtml+='</tr>';
                    Ext.each(respuesta.data[2].jornadas_asistencia, function(jornadas) {
                        newHtml+='<tr>';
                        newHtml+='<th>'+jornadas.tiempo+'</th>';
                        newHtml+='<th>'+jornadas.observacion+'</th>';
                        newHtml+='<th>'+jornadas.ticket+'</th>';
                        newHtml+='<th>'+jornadas.validador+'</th>';
                        newHtml+='<th>'+jornadas.incidencia_descripcion+'</th>';
                        newHtml+='<th>'+jornadas.ee_descripcion+'</th>';
                        newHtml+='</tr>';
                    });
                    newHtml+='</tbody>';
                    newHtml+='</table>';
                    Ext.get('lista').dom.innerHTML='';
                    Ext.DomHelper.append('lista',newHtml,true);
                    com.atento.gap.ValidarIncidencia.aplica_Efecto(Ext.get('lista'));
                }
            });
        }
    },customFormat:function(value){//Nuevo
        return 'Fec. Asis.: '+value;
    },init:function(){
        var responsable_nombre=Ext.get("empleado_nombre").getValue();
        //-->Cargar Stores
        com.atento.gap.ValidarIncidencia.cargaEjecutivosxFecha(Ext.get("hdd_fecha").getValue());
        //this.datosEjecutivos.load({params:{start:0,limit:5}});
        this.datosEjecutivos.load();
        this.datosOtros.load();
        this.datosCesados.load();
        
        fecha_desde=com.atento.gap.Valida_Fecha.fecha_actual(Ext.get('hdd_fecha').getValue());//obtener la fecha actual
        
        /*paginador = new Ext.PagingToolbar({
            store : this.datosEjecutivos,
            displayMsg : 'Mostrando {0}-{1} de {2} Registros ',
            emptyMsg   : 'No se encontraron registros',
            displayInfo : true,
            pageSize    : 5
        });*/
        
        //Change color row
        var gridView = new Ext.grid.GridView({
            getRowClass : function (row, index) { 
                var cls = '';
                var data = row.data;
                if(data.vacaciones==1) cls = 'yellow-row';
                if(data.falta==1) cls = 'red-row';
                return cls;
            }
        });
        //-->GRILLA CESADOS
        this.grilla_cesados = new Ext.grid.GridPanel({
            id:com.atento.gap.ValidarIncidencia.id+'-listado_cesados',
            name:'listado_cesados',
            store : this.datosCesados,
            animCollapse:true,
            height:360,
            border:false,
            stripeRows:true,
            loadMask: {msg: 'Cargando datos de cesados!'},
            columns  : [
                new Ext.grid.RowNumberer(),
                {id:'radio',header:'Sel.',dataIndex:'radio',width:33,renderer:this.changeColorSel},
                {id:'empleado',header:'Empleado',sortable:true,dataIndex: 'empleado',renderer:this.formateaColumna,width:200},
                {id:'turno',header:'Turno',width:100,sortable:true,dataIndex:'turno_descripcion',renderer:this.changeColor},
                {id:'ingreso',header:'Ingreso',width:60,sortable:true,dataIndex:'asistencia_entrada'},
                {id:'salida',header:'Salida',width:60,sortable:true,dataIndex:'asistencia_salida'},
                {id:'salida',header:'Tardanza',width:60,sortable:true,dataIndex:'tardanza_minutos'},
                {id:'salida',header:'Ext. Turno',width:60,sortable:true,dataIndex:'extension',renderer:this.formateaExtension},
                {id:'salida',header:'Tip. Ext.',width:80,sortable:true,dataIndex:'tipo_extension',renderer:this.formateaColumna}
            ]
        });
        //-->GRILLA CESADOS
        this.grilla_otros = new Ext.grid.GridPanel({
            id:com.atento.gap.ValidarIncidencia.id+'-listado_otros',
            name:'listado_otros',
            store : this.datosOtros,
            animCollapse:true,
            height:360,
            border:false,
            stripeRows:true,
            loadMask: {msg: 'Cargando datos de otros!'},
            columns  : [
                new Ext.grid.RowNumberer(),
                {id:'radio',header:'Sel.',dataIndex:'radio',width:33,renderer:this.changeColorSel},
                {id:'empleado',header:'Empleado',sortable:true,dataIndex: 'empleado',renderer:this.formateaColumna,width:200},
                {id:'turno',header:'Turno',width:100,sortable:true,dataIndex:'turno_descripcion',renderer:this.changeColor},
                {id:'ingreso',header:'Ingreso',width:60,sortable:true,dataIndex:'asistencia_entrada'},
                {id:'salida',header:'Salida',width:60,sortable:true,dataIndex:'asistencia_salida'},
                {id:'salida',header:'Tardanza',width:60,sortable:true,dataIndex:'tardanza_minutos'},
                {id:'salida',header:'Ext. Turno',width:60,sortable:true,dataIndex:'extension',renderer:this.formateaExtension},
                {id:'salida',header:'Tip. Ext.',width:80,sortable:true,dataIndex:'tipo_extension',renderer:this.formateaColumna}
            ]
        });
        //-->GRILLA MI GRUPO
        this.grilla = new Ext.grid.GridPanel({
            id:com.atento.gap.ValidarIncidencia.id+'-listado_grupo',
            name:'listado_grupo',
            store : this.datosEjecutivos,
            animCollapse:true,
            height:200,//500
            border:false,
            stripeRows:true,
            //bbar : paginador,
            view: gridView,
            loadMask: {msg: 'Cargando grupo!'},
            listeners: {
                'Afterrender':function(grid,columnIndex,e){
                    var item1=Ext.DomQuery.select('div[class=x-grid3-header-offset] table thead tr td div[class=x-grid3-hd-inner x-grid3-hd-empleado]')[0];
                    var el1=Ext.Element.get(item1);
                    el1.set({
                        onmouseover : 'javascript:com.atento.gap.Grilla.aparece("empleado")',
                        onmouseout : 'javascript:com.atento.gap.Grilla.desaparece("empleado")',
                        unselectable: ''
                    });
                    if(Ext.isIE){
                        var itemIE1=Ext.DomQuery.select('div[class=x-grid3-hd-inner x-grid3-hd-empleado]',this.dom);
                        var elIE1=Ext.Element.get(itemIE1);
                        elIE1.addListener('mouseover',function(event,element,options){
                            var letra=element.className;
                            var pos_ini=letra.lastIndexOf('empleado');
                            var pos_fin=letra.length;
                            var value=letra.substring(pos_ini, pos_fin);
                            com.atento.gap.Grilla.aparece(value);
                        },this,{param1:'the mouse is '});

                        elIE1.on('mouseout',function(event,element,options){
                            var letra=element.className;
                            var pos_ini=letra.lastIndexOf('empleado');
                            var pos_fin=letra.length;
                            var value=letra.substring(pos_ini, pos_fin);
                            com.atento.gap.Grilla.desaparece(value);
                        },this);
                    }
                },'mouseout': function(grid,columnIndex,e){
                    window.x=grid.xy[0];
                    window.y=grid.xy[1];
                    com.atento.gap.Grilla.criterio();
                },'mouseover': function(grid,columnIndex,e){
                   window.x=grid.xy[0];
                   window.y=grid.xy[1];
                }
            },columns  : [
                new Ext.grid.RowNumberer(),
                {id:'radio',header:'Sel.',dataIndex:'radio',width:33,renderer:this.changeColorSel},
                {id:'empleado',header:'Empleado',sortable:true,dataIndex: 'empleado',renderer:this.formateaColumna,width:200},//200
                {id:'turno',header:'Turno',width:100,sortable:true,dataIndex:'turno_descripcion',renderer:this.changeColor},
                {id:'ingreso',header:'Ingreso',width:60,sortable:true,dataIndex:'asistencia_entrada'},
                {id:'salida',header:'Salida',width:60,sortable:true,dataIndex:'asistencia_salida'},
                {id:'salida',header:'Tardanza',width:60,sortable:true,dataIndex:'tardanza_minutos'},
                {id:'salida',header:'Ext. Turno',width:60,sortable:true,dataIndex:'extension',renderer:this.formateaExtension},
                {id:'salida',header:'Tip. Ext.',width:65,sortable:true,dataIndex:'tipo_extension',renderer:this.formateaColumna}
            ]
        });
        
        var filtros=com.atento.gap.Grilla.generaFiltros(com.atento.gap.ValidarIncidencia.columnas);//generar Filtros en divs
        var div_filtro=Ext.get('div_filtros');
        div_filtro.insertHtml('afterBegin',''+filtros+'');
        //-->IMAGEN SALIR
        var boxarea = new Ext.BoxComponent({
            autoEl: {
                id:com.atento.gap.ValidarIncidencia.id+'-imgareas',
                name:com.atento.gap.ValidarIncidencia.id+'-imgareas',
                tag: 'img',
                src: '../images/ico/door_in.png'
            },listeners: {
                render: function(component){
                    component.getEl().on('click', function(e){
                      com.atento.gap.Valida_Fecha.salir();
                    });
                }
             },cls: 'mano'
        });
        //-->RESUMEN POR RAC
        var pieChart = new Ext.chart.PieChart({
            store:this.datos_pivot_rac,
            id:com.atento.gap.ValidarIncidencia.id+'-pie_rac',
            dataField: 'total',
            categoryField:'incidencia',
            tips: {
                trackMouse: true,
                width: 140,
                height: 28,
                renderer: function(storeItem, item) {

                var total = 0;
                this.datos_pivot_rac.each(function(rec) {
                total += rec.get('data1');
                });
                this.setTitle(storeItem.get('name') + ': ' + Math.round(storeItem.get('data1') / total * 100) + '%');
                }
            },
            highlight: {
                segment: {
                    margin: 20
                }
            },
            label: {
                field: 'incidencia',
                display: 'outside',
                contrast: true,
                font: '18px Arial'
            },showInLegend: true,
            seriesStyles: {
                 colors:['#F8869D','#25CDF2',
                         '#FFAA3C','#DEFE39'
                         ]
            },
            extraStyle:{
                legend:{
                    display: 'bottom',
                    padding: 5,
                    font:{
                        family: 'Tahoma',
                        size: 9
                    },border:{
                        color: '#CBCBCB',
                        size: 1
                    }

                }
            }
        });
        
        //RESUMEN POR SUPERVISOR
        var chart = new Ext.chart.ColumnChart({
            store: this.datos_column_supervisor,
            xField: 'asistencia_fecha',
            series:[
                    {yField:'total_empleados',displayName:'Total'},
                    {yField:'asistencias',displayName:'Asistencias'},
                    {yField:'extensiones',displayName:'Extensiones'},
                    {yField:'tardanzas',displayName:'Tardanzas'}
            ],
            yAxis: new Ext.chart.NumericAxis({
                title: "Ejecutivos"
            }),
            xAxis: new Ext.chart.CategoryAxis({
                    labelRenderer: this.customFormat
            }),
            chartStyle: {//estilos dentro del column chart
                font:{
                    family: 'Tahoma',
                    size: 9
                }
            },
            listeners: {
                itemclick: function (param) {
                    //console.info(param.storeItem.get(param.yField));
                }
            },
            extraStyle:{
                legend:{
                    display: 'bottom'
                }
            }
        });
        chart.setVisible(true);
        
        //-->MAQUETACION
        new Ext.Panel({
                title:'Validacion de Asistencia de Personal'
                ,height:700
                ,renderTo: Ext.getBody()
                ,width:1150
                ,layout:'fit'
                ,items:[{
                    xtype:'panel',
                    layout:'table',
                    cls: 'x-table-layout-cell-top-align',
                    layoutConfig: {
                        "columns": 2
                    },
                    defaults: {
                        autoHeight:true
                    },    
                    items:[{/*Zona 01*/
                        xtype:'panel',
                        colspan:2,
                        collapsible:true,
                        layout:'table',
                        baseCls: 'x-plain',
                        cls:"my-header",
                        //width:1000,
                        title:'<div style="text-align:center;">Supervisor :  '+responsable_nombre+' </div>',
                        layoutConfig: {
                            "columns": 2
                        },
                        defaults: {
                            autoHeight:true,
                            bodyStyle:'padding:0px 0px 0px 0px;'
                        },
                        items:[{
                            xtype:'panel',
                            layout:'table',
                            baseCls: 'x-plain',
                            layoutConfig: {
                                "columns": 2
                            },items:[{
                                xtype:'panel',
                                layout:'form',
                                baseCls: 'x-plain',
                                labelWidth: 80,
                                labelAlign: 'right',
                                //->colspan:2,
                                items:[{
                                    xtype:'datefield',
                                    fieldLabel:'Fecha',
                                    format:'d/m/Y',
                                    allowBlank:true,
                                    listeners: {
                                        select: function(dtpIssueDate, date) {
                                            var valor=com.atento.gap.Valida_Fecha.validaFecha(Ext.get('hdd_fecha').getValue(),date.format('d/m/Y'),Ext.get('hdd_dias').getValue());//
                                            if(parseInt(valor)==1){
                                                Ext.MessageBox.alert('Alerta!!', 'Fecha NO VALIDA!!.\nNo puede validar fechas menores a  '+Ext.get('hdd_dias').getValue()+' dias.',function(){
                                                });
                                            }else if(parseInt(valor)==2){
                                                Ext.MessageBox.alert('Alerta!!', 'Fecha NO VALIDA!!.\nElija una fecha anterior o igual al actual.',function(){
                                                });
                                            }
                                            if(parseInt(valor)!=0){  
                                                //--setear fecha previa
                                                var _fecha_prev=Ext.getCmp(com.atento.gap.ValidarIncidencia.id+'-hdd_fecha_selected').getValue();
                                                Ext.getCmp(com.atento.gap.ValidarIncidencia.id+'-txt_fecha').setValue(com.atento.gap.Valida_Fecha.fecha_actual(_fecha_prev));
                                            }else{//es 0=OK
                                                //--setear fecha seleccionada y refrescar store
                                                com.atento.gap.Menu.hide_Panel('panel-pivot-rac');//N
                                                Ext.get('lista').dom.innerHTML='';//N
                                                
                                                Ext.getCmp(com.atento.gap.ValidarIncidencia.id+'-hdd_fecha_selected').setValue(date.format('d/m/Y'));
                                                com.atento.gap.ValidarIncidencia.recarga(Ext.getCmp(com.atento.gap.ValidarIncidencia.id+'-hdd_fecha_selected').getValue());
                                            }
                                            
                                        }
                                    },
                                    id:com.atento.gap.ValidarIncidencia.id+'-txt_fecha',
                                    editable: false,
                                    value:fecha_desde
                                },{
                                    xtype:'hidden',
                                    name:com.atento.gap.ValidarIncidencia.id+'-hdd_fecha_selected',
                                    id:com.atento.gap.ValidarIncidencia.id+'-hdd_fecha_selected',
                                    value:Ext.get("hdd_fecha").getValue()
                                }]
                            },{
                               xtype:'panel',
                               layout:'form',
                               baseCls: 'x-plain',
                               bodyStyle:'margin:0px 0px 0px 10px',
                               items:[boxarea]
                            }]
                        }]/*Zona 01*/
                    },{/*Zona 02 C1*/
                        xtype:'panel',
                        layout:'table',
                        baseCls: 'x-plain',
                        layoutConfig: {
                            "columns": 1
                        },items:[{
                            closable: false,
                            width   : 700,
                            height  : 600,//-->ALTO PANEL LEFT
                            tbar:com.atento.gap.Menu.generarMenu()
                            ,layout  : "border",
                            items   : [{
                                xtype:"panel",
                                region:"north",
                                height: 40,
                                html:com.atento.gap.Grilla.generaBuscarOrden(),//buscar y orden
                                margins:{top:3,bottom:3,left:3,right:3}
                            },{
                                xtype:"panel",
                                region:"center",
                                items:[{
                                    xtype   : 'tabpanel',
                                    height  : 400,//-->ALTO CONTENIDO TAB
                                    id:com.atento.gap.ValidarIncidencia.id+'tab_supervision',
                                    activeTab   : 0,
                                    plain   :true,
                                    items   : [{
                                        layout:'form',
                                        title:'Mi Grupo',
                                        id:com.atento.gap.ValidarIncidencia.id+'panel_migrupo',
                                        bodyStyle:'padding: 3px',
                                        labelAlign:'top',
                                        items:[this.grilla]
                                    },{
                                        layout:'form',
                                        title:'Otros',
                                        id:com.atento.gap.ValidarIncidencia.id+'panel_otros',
                                        bodyStyle:'padding: 5px',
                                        labelAlign:'top',
                                        items:[this.grilla_otros]
                                    },{
                                        layout:'form',
                                        title:'Cesados',
                                        id:com.atento.gap.ValidarIncidencia.id+'panel_cesados',
                                        bodyStyle:'padding: 5px',
                                        labelAlign:'top',
                                        items:[this.grilla_cesados]
                                    }]
                                }]
                            }]
                        }]
                        /*Zona 02 C1*/
                    },{/*Zona 02 C2*/
                        xtype:'panel',
                        layout:'table',
                        layoutConfig: {
                            "columns": 1
                        },items:[{//--Z1
                            xtype:'panel',
                            collapsible:true,
                            layout:'table',
                            listeners:{
                                collapse: function (p, eOpts ){
                                    var _t1=350;
                                    var _t2=Ext.getCmp(com.atento.gap.ValidarIncidencia.id+'panel_incidencias').getHeight();
                                    var _tamanio=((_t1*1)+(_t2*1))-20;
                                    Ext.getCmp(com.atento.gap.ValidarIncidencia.id+'panel_incidencias').setHeight(_tamanio-100);
                                    Ext.getCmp(com.atento.gap.ValidarIncidencia.id+'M_panel_incidencias').setHeight(_tamanio);
                                    //
                            },expand :function(p, eOpts){
                                    Ext.getCmp(com.atento.gap.ValidarIncidencia.id+'M_panel_incidencias').setHeight(250);
                                    Ext.getCmp(com.atento.gap.ValidarIncidencia.id+'panel_incidencias').setHeight(240);
                                    Ext.getCmp(com.atento.gap.ValidarIncidencia.id+'panel_incidencias').setAutoScroll(true);
                            }},
                            baseCls: 'x-plain',
                            cls:"my-header",
                            width:400,
                            height  : 350,
                            id:com.atento.gap.ValidarIncidencia.id+'panel_pivots',
                            title:'<div style="text-align:center;">&nbsp;Resumen Rac Supervisor </div>',
                            layoutConfig: {
                                "columns": 1
                            },
                            items:[{
                                xtype:'panel',
                                layout:'table',
                                layoutConfig: {
                                    "columns": 1
                                },items:[{
                                    xtype   : 'tabpanel',
                                    height  : 333,
                                    border:true,
                                    id      : com.atento.gap.ValidarIncidencia.id+'tab_resumen',
                                    activeTab   : 1,
                                    plain   :true,
                                    items   : [{
                                        layout:'form',
                                        title:'Rac',
                                        id:com.atento.gap.ValidarIncidencia.id+'tab_rac',
                                        bodyStyle:'padding: 3px',
                                        labelAlign:'top',
                                        items: [{
                                            xtype:'panel',
                                            width: 250,
                                            id:com.atento.gap.ValidarIncidencia.id+'panel-pivot-rac',
                                            listeners: {render: function(c) {c.setVisible(false);}},
                                            title:'ejecutivo',
                                            height: 250,
                                            items:[pieChart]
                                        }]
                                    },{
                                        layout:'form',
                                        title:'Supervision',
                                        id:'tab_supervisor',
                                        bodyStyle:'padding: 5px',
                                        labelAlign:'top',
                                        items: [{
                                            xtype:'panel',
                                            width: 280,
                                            title:'ejecutivo',
                                            height: 280,
                                            items: [chart]
                                        }]
                                    }]
                                }]
                            }]
                        }/*--Z1*/
                       ,{//--Z2
                            xtype:'panel',
                            collapsible:true,
                            layout:'table',
                            baseCls: 'x-plain',
                            cls:"my-header",
                            width:400,
                            height:250,
                            id:com.atento.gap.ValidarIncidencia.id+'M_panel_incidencias',
                            title:'<div style="text-align:center;">&nbsp;Incidencias Registradas </div>',
                            layoutConfig: {
                                "columns": 1,
                                width:400
                            },items:[{
                                xtype:'panel',
                                layout:'table',
                                autoScroll: true,
                                layoutConfig: {
                                    "columns": 1
                                },items:[{//-
                                    xtype   : 'panel',
                                    height:240,
                                    id:com.atento.gap.ValidarIncidencia.id+'panel_incidencias',
                                    width:400,
                                    autoScroll: true,
                                    html:'<div id="lista"></div>'
                                }]
                            }]   
                        }]
                    }/*--Z2*/]/*Zona 02 C2*/     
                }]
            });
    }
}
Ext.onReady(com.atento.gap.ValidarIncidencia.init,com.atento.gap.ValidarIncidencia);
/*
*tener en cuenta que la fila de la grilla debe estar con color rojo/azul/amarillo si esta de vacaciones/licencia/falta.(OK)
*devolver desde el store si esta de licencia
*2.	En el tab de supervision también debe mostrarse la incidencia o la suma de ellas.(Pendiente)
*http://172.30.194.39/SisPersonal01/ControlAsistencia/validacion/validar_incidencia.php
*http://www.amcharts.com/javascript-charts/
*http://blogs.walkingtree.in/2010/10/15/all-about-extjs-chart/
*http://css-tricks.com/almanac/properties/w/whitespace/
*http://stackoverflow.com/questions/9198390/extjs-tooltip-issue
*http://aboutfrontend.com/extjs/extjs-renderer/
*http://www.hbensalem.com/javascript/extjs-add-tooltip-to-grid-row/
*http://blogs.walkingtree.in/2009/08/25/formatting-grid-cell/
*/
