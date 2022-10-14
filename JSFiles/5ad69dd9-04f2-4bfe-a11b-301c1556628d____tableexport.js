/*!
* TableExport.js v3.3.10 (https://www.travismclarke.com)
* Copyright 2017 Travis Clarke
* Licensed under the MIT license
*/
// var tableToExcel = (function () {
//     var uri = 'data:application/vnd.ms-excel;base64,',
//         template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>',
//         base64 = function (s) {
//             return window.btoa(unescape(encodeURIComponent(s)))
//         }, format = function (s, c) {
//             return s.replace(/{(\w+)}/g, function (m, p) {
//                 return c[p];
//             })
//         }
//     return function (table, name, filename) {
//         if (!table.nodeType) table = document.getElementById(table)
//         var ctx = {
//             worksheet: name || 'Worksheet',
//             table: table.innerHTML
//         }

//         document.getElementById("dlink").href = uri + base64(format(template, ctx));
//         document.getElementById("dlink").download = filename;
//         document.getElementById("dlink").traget = "_blank";
//         document.getElementById("dlink").click();

//     }
// })();
var tableToExcel = (function () {
    var uri = 'data:application/vnd.ms-excel;base64,',
        template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>'
        , base64 = function (s) {
            return window.btoa(unescape(encodeURIComponent(s)))
        }
        , format = function (s, c) {
            return s.replace(/{(\w+)}/g, function (m, p) {
                return c[p];
            })
        };
    return function (table, name) {
        if (!table.nodeType) table = document.getElementById(table);
        var ctx = {worksheet: name || 'Worksheet', table: table.innerHTML};
        window.location.href = uri + base64(format(template, ctx));
    }
})();

// usage
// tableToExcel('#table','Export Name');

;(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['exports', 'jquery', 'blobjs', 'file-saverjs', 'xlsx-js'], factory);
    } else if (typeof exports === 'object' && typeof exports.nodeName !== 'string') {
        factory(exports, require('jquery'), require('blobjs'), require('file-saverjs'), require('xlsx-js'));
    } else {
        factory(root, root.jQuery, root.Blob, root.saveAs, root.XLSX);
    }
}(this || window, function(exports, $, Blob, saveAs, XLSX) {
    'use strict';
    var TableExport = function(selectors, options, isUpdate) {
        var gobal_dataObject;
        var self = this;
        self.settings = isUpdate ? options : $.extend({}, TableExport.prototype.defaults, options);
        self.selectors = selectors;
        var rowD = TableExport.prototype.rowDel, ignoreRows = self.settings.ignoreRows instanceof Array ? self.settings.ignoreRows : [self.settings.ignoreRows], ignoreCols = self.settings.ignoreCols instanceof Array ? self.settings.ignoreCols : [self.settings.ignoreCols], ignoreCSS = self.settings.ignoreCSS instanceof Array ? self.settings.ignoreCSS.join(", ") : self.settings.ignoreCSS, emptyCSS = self.settings.emptyCSS instanceof Array ? self.settings.emptyCSS.join(", ") : self.settings.emptyCSS, bootstrapClass, bootstrapTheme, bootstrapSpacing;
        if (self.settings.bootstrap) {
            bootstrapClass = TableExport.prototype.bootstrap[0] + " ";
            bootstrapTheme = TableExport.prototype.bootstrap[1] + " ";
            bootstrapSpacing = TableExport.prototype.bootstrap[2] + " ";
        } else {
            bootstrapClass = TableExport.prototype.defaultButton + " ";
            bootstrapTheme = bootstrapSpacing = "";
        }
        self.selectors.each(function() {
            var $el = $(this);
            if (isUpdate) {
                $el.find('caption:not(.head)').remove();
            }

            var $rows = $el.find('tbody').find('tr').not(".ui-search-toolbar")
              , $rows = self.settings.headings ? $rows.add($el.find('thead>tr').not(".ui-search-toolbar")) : $rows
              , $rows = self.settings.footers ? $rows.add($el.find('tfoot>tr')) : $rows
              , thAdj = self.settings.headings ? $el.find('thead>tr').not(".ui-search-toolbar").length : 0
              , fileName = self.settings.fileName === "id" ? ($el.attr('id') ? $el.attr('id') : TableExport.prototype.defaultFileName) : self.settings.fileName
              , exporters = {
                xlsx: function(rDel, name) {
                    var rcMap = {}
                      , dataURL = $rows.map(function(ir, val) {
                        if (!!~ignoreRows.indexOf(ir - thAdj) || $(val).is(ignoreCSS)) {
                            return;
                        }
                        var $cols = $(val).find('th, td').not(".ui-search-oper, .ui-search-input, .ui-search-clear, .ui-widget-content, .ui-jqgrid-pg-center, ui-jqgrid-pg-right");
                        if(ir==3){
                            return;
                        }
                        if($cols.html()==undefined || $cols.html()==''){
                            return;
                        }
                        return [$cols.map(function(ic, val) {
                            if (!!~ignoreCols.indexOf(ic) || $(val).is(ignoreCSS)) {
                                return;
                            }
                            if ($(val).is(emptyCSS)) {
                                return;
                            }
                            if($(val).prop("dir")=="ltr"){
                                return;
                            }
                            if($(val).css('display')=="none"){
                                return;
                            }
                            if (val.hasAttribute('colspan')) {
                                rcMap[ir] = rcMap[ir] || {};
                                rcMap[ir][ic + 1] = val.getAttribute('colspan') - 1
                            }
                            if (val.hasAttribute('rowspan')) {
                                for (var i = 1; i < val.getAttribute('rowspan'); i++) {
                                    rcMap[ir + i] = rcMap[ir + i] || {};
                                    rcMap[ir + i][ic] = 1
                                }
                            }
                            if (rcMap[ir]) {
                                var threshold = ic + 1
                                  , total = 0
                                  , count = 0;
                                for (var i = 0; i <= Math.max.apply(Math, Object.keys(rcMap[ir])); i++) {
                                    (!rcMap[ir][i]) ? count++ : total = count >= ic ? total + rcMap[ir][i] : total;
                                    if (count === threshold) {
                                        break;
                                    }
                                }
                                return new Array(total).concat($(val).text());
                            }
                            return formatValue($(val).text());
                        }).get()];
                    }).get()
                      , dataObject = TableExport.prototype.escapeHtml(JSON.stringify({
                        data: dataURL,
                        fileName: name,
                        mimeType: TableExport.prototype.xlsx.mimeType,
                        fileExtension: TableExport.prototype.xlsx.fileExtension
                    }))
                      , myContent = TableExport.prototype.xlsx.buttonContent
                      , myClass = TableExport.prototype.xlsx.defaultClass,
                      gobal_dataObject = {
                          data: dataURL,
                          fileName: name,
                          mimeType: TableExport.prototype.xlsx.mimeType,
                          fileExtension: TableExport.prototype.xlsx.fileExtension };
                    createObjButton(dataObject, myContent, myClass,gobal_dataObject);
                },
                printHtml: function(rDel, name) {
                    var rcMap = {}
                      , dataURL = $rows.map(function(ir, val) {
                        if (!!~ignoreRows.indexOf(ir - thAdj) || $(val).is(ignoreCSS)) {
                            return;
                        }
                        var $cols = $(val).find('th, td').not(".ui-search-oper, .ui-search-input, .ui-search-clear, .ui-widget-content, .ui-jqgrid-pg-center, ui-jqgrid-pg-right");
                        if(ir==3){
                            return;
                        }
                        if($cols.html()==undefined || $cols.html()==''){
                            return;
                        }
                        return [$cols.map(function(ic, val) {
                            if (!!~ignoreCols.indexOf(ic) || $(val).is(ignoreCSS)) {
                                return;
                            }
                            if ($(val).is(emptyCSS)) {
                                return;
                            }
                            if($(val).prop("dir")=="ltr"){
                                return;
                            }
                            if($(val).css('display')=="none"){
                                return;
                            }
                            if (val.hasAttribute('colspan')) {
                                rcMap[ir] = rcMap[ir] || {};
                                rcMap[ir][ic + 1] = val.getAttribute('colspan') - 1
                            }
                            if (val.hasAttribute('rowspan')) {
                                for (var i = 1; i < val.getAttribute('rowspan'); i++) {
                                    rcMap[ir + i] = rcMap[ir + i] || {};
                                    rcMap[ir + i][ic] = 1
                                }
                            }
                            if (rcMap[ir]) {
                                var threshold = ic + 1
                                  , total = 0
                                  , count = 0;
                                for (var i = 0; i <= Math.max.apply(Math, Object.keys(rcMap[ir])); i++) {
                                    (!rcMap[ir][i]) ? count++ : total = count >= ic ? total + rcMap[ir][i] : total;
                                    if (count === threshold) {
                                        break;
                                    }
                                }
                                return new Array(total).concat($(val).text());
                            }
                            return formatValue($(val).text());
                        }).get()];
                    }).get()
                      , dataObject = TableExport.prototype.escapeHtml(JSON.stringify({
                        data: dataURL,
                        fileName: name,
                        mimeType: TableExport.prototype.xlsx.mimeType,
                        fileExtension: TableExport.prototype.xlsx.fileExtension
                    }))
                      , myContent = TableExport.prototype.xlsx.buttonContent
                      , myClass = TableExport.prototype.xlsx.defaultClass,
                      gobal_dataObject = {
                          data: dataURL,
                          fileName: name,
                          mimeType: TableExport.prototype.xlsx.mimeType,
                          fileExtension: TableExport.prototype.xlsx.fileExtension };
                    createPrintHtml(dataObject, myContent, myClass,gobal_dataObject);
                },
                xlsm: function(rDel, name) {
                    var rcMap = {}
                      , dataURL = $rows.map(function(ir, val) {
                        if (!!~ignoreRows.indexOf(ir - thAdj) || $(val).is(ignoreCSS)) {
                            return;
                        }
                        var $cols = $(val).find('th, td').not(".ui-search-oper, .ui-search-input, .ui-search-clear, .ui-widget-content, .ui-jqgrid-pg-center");
                        if(i==3){
                            return;
                        }
                        if($cols.html()==undefined || $cols.html()==''){
                            return;
                        }
                        return [$cols.map(function(ic, val) {
                            if (!!~ignoreCols.indexOf(ic) || $(val).is(ignoreCSS)) {
                                return;
                            }
                            if ($(val).is(emptyCSS)) {
                                return " "
                            }
                            if (val.hasAttribute('colspan')) {
                                rcMap[ir] = rcMap[ir] || {};
                                rcMap[ir][ic + 1] = val.getAttribute('colspan') - 1
                            }
                            if (val.hasAttribute('rowspan')) {
                                for (var i = 1; i < val.getAttribute('rowspan'); i++) {
                                    rcMap[ir + i] = rcMap[ir + i] || {};
                                    rcMap[ir + i][ic] = 1
                                }
                            }
                            if (rcMap[ir]) {
                                var threshold = ic + 1
                                  , total = 0
                                  , count = 0;
                                for (var i = 0; i <= Math.max.apply(Math, Object.keys(rcMap[ir])); i++) {
                                    (!rcMap[ir][i]) ? count++ : total = count >= ic ? total + rcMap[ir][i] : total;
                                    if (count === threshold) {
                                        break;
                                    }
                                }
                                return new Array(total).concat($(val).text());
                            }
                            return formatValue($(val).text());
                        }).get()];
                    }).get()
                      , dataObject = TableExport.prototype.escapeHtml(JSON.stringify({
                        data: dataURL,
                        fileName: name,
                        mimeType: TableExport.prototype.xls.mimeType,
                        fileExtension: TableExport.prototype.xls.fileExtension
                    }))
                      , myContent = TableExport.prototype.xls.buttonContent
                      , myClass = TableExport.prototype.xls.defaultClass;
                    createObjButton(dataObject, myContent, myClass);
                },
                xls: function(rdel, name) {
                    var colD = TableExport.prototype.xls.separator
                      , dataURL = $rows.map(function(i, val) {
                        if (!!~ignoreRows.indexOf(i - thAdj) || $(val).is(ignoreCSS)) {
                            return;
                        }
                        var $cols = $(val).find('th, td').not(".ui-search-oper, .ui-search-input, .ui-search-clear, .ui-widget-content, .ui-jqgrid-pg-center");
                        if(i==3){
                            return;
                        }
                        if($cols.html()==undefined || $cols.html()==''){
                            return;
                        }
                        return $cols.map(function(i, val) {
                            if (!!~ignoreCols.indexOf(i) || $(val).is(ignoreCSS)) {
                                return;
                            }
                            if ($(val).is(emptyCSS)) {
                                return " "
                            }
                            return formatValue($(val).text());
                        }).get().join(colD);
                    }).get().join(rdel)
                      , dataObject = TableExport.prototype.escapeHtml(JSON.stringify({
                        data: dataURL,
                        fileName: name,
                        mimeType: TableExport.prototype.xls.mimeType,
                        fileExtension: TableExport.prototype.xls.fileExtension
                    }))
                      , myContent = TableExport.prototype.xls.buttonContent
                      , myClass = TableExport.prototype.xls.defaultClass;
                    createObjButton(dataObject, myContent, myClass);
                },
                csv: function(rdel, name) {
                    var colD = TableExport.prototype.csv.separator
                      , dataURL = $rows.map(function(i, val) {
                        if (!!~ignoreRows.indexOf(i - thAdj) || $(val).is(ignoreCSS)) {
                            return;
                        }
                        var $cols = $(val).find('th, td').not(".ui-search-oper, .ui-search-input, .ui-search-clear, .ui-widget-content, .ui-jqgrid-pg-center");
                        if(i==3){
                            return;
                        }
                        if($cols.html()==undefined || $cols.html()==''){
                            return;
                        }
                        return $cols.map(function(i, val) {
                            if (!!~ignoreCols.indexOf(i) || $(val).is(ignoreCSS)) {
                                return;
                            }
                            if ($(val).is(emptyCSS)) {
                                return " "
                            }
                            return '"' + formatValue($(val).text().replace(/"/g, '""')) + '"';
                        }).get().join(colD);
                    }).get().join(rdel)
                      , dataObject = TableExport.prototype.escapeHtml(JSON.stringify({
                        data: dataURL,
                        fileName: name,
                        mimeType: TableExport.prototype.csv.mimeType,
                        fileExtension: TableExport.prototype.csv.fileExtension
                    }))
                      , myContent = TableExport.prototype.csv.buttonContent
                      , myClass = TableExport.prototype.csv.defaultClass;
                    createObjButton(dataObject, myContent, myClass);
                },
                txt: function(rdel, name) {
                    var colD = TableExport.prototype.txt.separator
                      , dataURL = $rows.map(function(i, val) {
                        if (!!~ignoreRows.indexOf(i - thAdj) || $(val).is(ignoreCSS)) {
                            return;
                        }
                        var $cols = $(val).find('th, td').not(".ui-search-oper, .ui-search-input, .ui-search-clear, .ui-widget-content, .ui-jqgrid-pg-center");
                        if(i==3){
                            return;
                        }
                        if($cols.html()==undefined || $cols.html()==''){
                            return;
                        }
                        return $cols.map(function(i, val) {
                            if (!!~ignoreCols.indexOf(i) || $(val).is(ignoreCSS)) {
                                return;
                            }
                            if ($(val).is(emptyCSS)) {
                                return " "
                            }
                            return formatValue($(val).text());
                        }).get().join(colD);
                    }).get().join(rdel)
                      , dataObject = TableExport.prototype.escapeHtml(JSON.stringify({
                        data: dataURL,
                        fileName: name,
                        mimeType: TableExport.prototype.txt.mimeType,
                        fileExtension: TableExport.prototype.txt.fileExtension
                    }))
                      , myContent = TableExport.prototype.txt.buttonContent
                      , myClass = TableExport.prototype.txt.defaultClass;
                    createObjButton(dataObject, myContent, myClass);
                }
            };
            self.settings.formats.forEach(function(key) {
                XLSX && key === 'xls' ? key = 'xlsm' : false;
                !XLSX && key === 'xlsx' ? key = null : false;
                key && exporters[key](rowD, fileName);
            });
            function formatValue(string) {
                return self.settings.trimWhitespace ? string.trim() : string;
            }
            function checkCaption(exportButton) {
                var $caption = $el.find('caption:not(.head)');
                $caption.length ? $caption.append(exportButton) : $el.prepend('<caption class="' + bootstrapSpacing + self.settings.position + '" >' + exportButton + '</caption>');
            }
            function createObjButton(dataObject, myContent, myClass,gobal_dataObjec) {
                if(gobal_dataObjec){
                    var object = gobal_dataObjec
                    , data = object.data
                    , fileName = object.fileName
                    , mimeType = object.mimeType
                    , fileExtension = object.fileExtension;
                    TableExport.prototype.export2file(data, mimeType, fileName, fileExtension);
                }else{
                    var exportButton = "<button data-fileblob='" + dataObject + "' class='" + bootstrapClass + bootstrapTheme + myClass + "'>" + myContent + "</button>";
                    checkCaption(exportButton);
                }
            }
            
            function createPrintHtml(dataObject, myContent, myClass,gobal_dataObjec) {
                var data = gobal_dataObjec.data;
                var html = '<table>';
                var columnas = options.columnas * 1 + 1;
                var numericos = [];
                var headers = '<table><tbody class="table table-bordered">';
                var thead = '<thead>';
                
                for(var i=0;i<3;i++){
                    headers+='<tr>';
                    thead+='<tr>';
                    var row =data[i]
                    for(var j=0;j<row.length;j++){
                        var colspan = Math.floor(columnas /row.length)
                        
                        if((columnas /row.length) % 1 != 0){
                            if(j+1==row.length){
                                // colspan = columnas - row.length + 1;
                                colspan = columnas - colspan * (j-1);
                            }
                        }
                        if(i<3){
                            switch(row[j].trim()){
                                case "Tipo_Cambio":
                                    numericos.push(j)
                                break;
                                case "Base_Calculada":
                                    numericos.push(j)
                                break;
                                case "Descuento":
                                    numericos.push(j)
                                break;
                                case "Base_Imponible":
                                    numericos.push(j)
                                break;
                                case "Igv":
                                    numericos.push(j)
                                break;
                                case "Total":
                                    numericos.push(j)
                                break;
                            }
                        }
                        // html+='<td colspan="'+colspan+'" '+($.isNumeric(row[j])?'class="text-right"':'')+'>';
                        if(!(i<2 && j==0)){
                            // headers+='<td colspan="'+colspan+'" '+((numericos.indexOf(j)>=0)?'class="text-right '+i==2 ? 'border' : ''+'"':'')+'>';
                            // headers+=row[j];
                            // headers+="</td>";
                            thead+='<td colspan="'+colspan+'" class="text-center '+ ((i==2) ? 'border' : '')+'">';
                            thead+=row[j];
                            thead+="</td>";
                        }
                    }
                    headers+="</tr>";
                    thead+="</tr>";
                }

                thead+="</thead>";
                html += thead+'<tbody class="table table-bordered">';
                for(var i=3;i<data.length -1;i++){
                    html+='<tr>';
                    var row =data[i]
                    for(var j=0;j<row.length;j++){
                        var colspan = Math.floor(columnas /row.length)
                        
                        if((columnas /row.length) % 1 != 0){
                            if(j+1==row.length){
                                // colspan = columnas - row.length + 1;
                                colspan = columnas - colspan * (j-1);
                            }
                        }
                        if(i<3){
                            switch(row[j].trim()){
                                case "Tipo_Cambio":
                                    numericos.push(j)
                                break;
                                case "Base_Calculada":
                                    numericos.push(j)
                                break;
                                case "Descuento":
                                    numericos.push(j)
                                break;
                                case "Base_Imponible":
                                    numericos.push(j)
                                break;
                                case "Igv":
                                    numericos.push(j)
                                break;
                                case "Total":
                                    numericos.push(j)
                                break;
                            }
                        }
                        // html+='<td colspan="'+colspan+'" '+($.isNumeric(row[j])?'class="text-right"':'')+'>';
                        if(!(i<2 && j==0)){
                            html+='<td colspan="'+colspan+'" '+((numericos.indexOf(j)>=0)?'class="text-right"':'')+'>';
                            html+=row[j];
                            html+="</td>";
                        }
                    }
                    html+="</tr>";
                }
                html+="<tfooter></toffot</tbody></table>";
                headers+="</tbody></table>";
                headers+="</tbody></table>";
                $("#reporte_print").html("");
                $("#reporte_print").append(html);
                
                // var divToPrint=document.getElementById('reporte_print');

                // var newWin=window.open('','Print-Window');

                // newWin.document.open();

                // newWin.document.write('<html> <style>.table{width: 100%;margin-bottom: 1rem;color: #212529;border: 1px solid #dee2e6} table{border-collapse: collapse;display: table;border-spacing: 2px;} tbody {display: table-row-group;vertical-align: middle;border-color: inherit;} tr {display: table-row;vertical-align: inherit;border-color: inherit;} td{border: 1px solid #dee2e6;padding: .75rem;display: table-cell;vertical-align: top;}.text-right {text-align: right!important;}</style><body onload="window.print()">'+divToPrint.innerHTML+'</body></html>');

                // newWin.document.close();

                // setTimeout(function(){newWin.close();},10);
                
                // $("#reporte_print").printThis({
                //     header: headers
                // });
                // $("#reporte_print").kinziPrint({
                //     header: "cabecera",
                //     footer: "piede pagina"
                //   });
                $("#reporte_print").printThis();
            }
        });
        $("button[data-fileblob]").off("click").on("click", function() {
            var object = $(this).data("fileblob")
              , data = object.data
              , fileName = object.fileName
              , mimeType = object.mimeType
              , fileExtension = object.fileExtension;
            TableExport.prototype.export2file(data, mimeType, fileName, fileExtension);
        });
        return self;
    };
    TableExport.prototype = {
        version: "3.3.10",
        defaults: {
            headings: true,
            footers: true,
            formats: ["xls", "csv", "txt"],
            fileName: "id",
            bootstrap: true,
            position: "bottom",
            ignoreRows: null,
            ignoreCols: null,
            ignoreCSS: ".tableexport-ignore",
            emptyCSS: ".tableexport-empty",
            trimWhitespace: false
        },
        charset: "charset=utf-8",
        defaultFileName: "myDownload",
        defaultButton: "button-default",
        bootstrap: ["btn", "btn-default", "btn-toolbar"],
        rowDel: "\r\n",
        entityMap: {
            "&": "&#38;",
            "<": "&#60;",
            ">": "&#62;",
            "'": '&#39;',
            "/": '&#47;'
        },
        xlsx: {
            defaultClass: "xlsx",
            buttonContent: "Exportar a xlsx",
            mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            fileExtension: ".xlsx"
        },
        xls: {
            defaultClass: "xls",
            buttonContent: "Exportar a xls",
            separator: "\t",
            mimeType: "application/vnd.ms-excel",
            fileExtension: ".xls"
        },
        csv: {
            defaultClass: "csv",
            buttonContent: "Exportar a csv",
            separator: ",",
            mimeType: "text/csv",
            fileExtension: ".csv"
        },
        txt: {
            defaultClass: "txt",
            buttonContent: "Exportar a txt",
            separator: "  ",
            mimeType: "text/plain",
            fileExtension: ".txt"
        },
        escapeHtml: function(string) {
            return String(string).replace(/[&<>'\/]/g, function(s) {
                return TableExport.prototype.entityMap[s];
            });
        },
        dateNum: function(v, date1904) {
            if (date1904)
                v += 1462;
            var epoch = Date.parse(v);
            return (epoch - new Date(Date.UTC(1899, 11, 30))) / (24 * 60 * 60 * 1000);
        },
        createSheet: function(data) {
            var ws = {};
            var range = {
                s: {
                    c: 10000000,
                    r: 10000000
                },
                e: {
                    c: 0,
                    r: 0
                }
            };
            for (var R = 0; R != data.length; ++R) {
                for (var C = 0; C != data[R].length; ++C) {
                    if (range.s.r > R)
                        range.s.r = R;
                    if (range.s.c > C)
                        range.s.c = C;
                    if (range.e.r < R)
                        range.e.r = R;
                    if (range.e.c < C)
                        range.e.c = C;
                    var cell = {
                        v: data[R][C]
                    };
                    if (cell.v == null)
                        continue;
                    var cell_ref = XLSX.utils.encode_cell({
                        c: C,
                        r: R
                    });
                    if (( cell.v == "0.00"  || (cell.v).slice(0,1) != "0" ) && (typeof cell.v === 'number' || (!isNaN(cell.v) && !isNaN(parseFloat(cell.v)))))
                        cell.t = 'n';
                    else if (typeof cell.v === 'boolean')
                        cell.t = 'b';
                    else if (cell.v instanceof Date) {
                        cell.t = 'n';
                        cell.z = XLSX.SSF._table[14];
                        cell.v = this.dateNum(cell.v);
                    } else{
                        cell.t = 's';
                    }
                    ws[cell_ref] = cell;
                }
            }
            if (range.s.c < 10000000)
                ws['!ref'] = XLSX.utils.encode_range(range);
            return ws;
        },
        Workbook: function() {
            this.SheetNames = [];
            this.Sheets = {};
        },
        string2ArrayBuffer: function(s) {
            var buf = new ArrayBuffer(s.length);
            var view = new Uint8Array(buf);
            for (var i = 0; i != s.length; ++i)
                view[i] = s.charCodeAt(i) & 0xFF;
            return buf;
        },
        export2file: function(data, mime, name, extension) {
            if (XLSX && extension.substr(0, 4) == (".xls")) {
                var wb = new this.Workbook()
                  , ws = this.createSheet(data);
                wb.SheetNames.push(name);
                wb.Sheets[name] = ws;
                var wopts = {
                    bookType: extension.substr(1, 3) + (extension.substr(4) || 'm'),
                    bookSST: false,
                    type: 'binary'
                }
                  , wbout = XLSX.write(wb, wopts);
                data = this.string2ArrayBuffer(wbout);
            }
            var blob = new Blob([data],{
                type: mime + ";" + this.charset
            });
            if (typeof saveAs === "undefined" && typeof navigator !== "undefined" && navigator.msSaveOrOpenBlob) {
                window.navigator.msSaveOrOpenBlob(blob, name + extension);
            } else {
                saveAs(blob, name + extension, true);
            }
        },
        update: function(options) {
            return new TableExport(this.selectors,$.extend({}, this.settings, options),true);
        },
        reset: function() {
            return new TableExport(this.selectors,this.settings,true);
        },
        remove: function() {
            this.selectors.each(function() {
                $(this).find('caption:not(.head)').remove();
            });
        }
    };
    $.fn.tableExport = function(options, isUpdate) {
        return new TableExport(this,options,isUpdate);
    }
    ;
    for (var prop in TableExport.prototype) {
        $.fn.tableExport[prop] = TableExport.prototype[prop];
    }
    return exports.default = exports.TableExport = TableExport;
}));
