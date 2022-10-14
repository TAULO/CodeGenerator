/*
    Nomis Report creator
    Author: Spencer Hedger

    Usage: call "nomisReport.create(params)" with configuration.

    This will create the report in the browser and return an object with the following functions:
        remove: remove the report from the target DOM element
        refresh: refresh the report by requerying data
        redraw: redraw the report
        params: get the params object that was passed in to the create function
*/
var nomisReport = function () {
    function createProfile(params) {
        var _params = params;
        var data = null;
        var win = $(window);
        var profile = null;
        var profile_tgt = params.target;
        var placeholders = [];
        var url_randomizer = 0;
        var renderedsecs = 0; // Number of sections rendered
        var renderedsecscomplete = 0; // Number of sections that have completed rendering
        var defs = []; // Definitions section
        var defdiv = null; // Div for definition content
        var defname = null; // Name of definitions section
        var vlisteners = []; // Listeners notified when variables all done loading
        var datafilterstate = []; // List of filters last used when extracting data

        function updateUrlRandomizer() {
            url_randomizer = Math.floor((Math.random() * 1000000) + 1);
        }

        function initUrlRandomizer() {
            updateUrlRandomizer();

            var interval = 5 * 60; // 5 minutes
            if (_params.dataCacheDurationSeconds != undefined) interval = Number(_params.dataCacheDurationSeconds);
            interval = interval * 1000;
            if (interval < 1000) interval = 1000;

            setInterval(updateUrlRandomizer, interval);
        }

        initUrlRandomizer();

        function removePlaceholders() {
            for (var i = 0; i < placeholders.length; i++) {
                var p = placeholders[i];
                if (p.parentNode != null) p.parentNode.removeChild(p);
            }

            placeholders = [];
        }

        function removeProfile() {
            removePlaceholders();
            data = null;
            defs = [];
            defdiv = null;
        }

        function refreshProfile() {
            removeProfile();
            init();
        }

        function redrawProfile() {
            // TODO: This should redraw the profile without fetching data again etc.
            refreshProfile();
        }

        function getParams() {
            return _params;
        }

        function treeFromDimension(dim) {
            var haveparent = [];
            var root = [];
            var getChild = function (dim, array) {
                if (array !== null) {
                    array.forEach(function (e, i) {
                        var dc = dim.Category(e);
                        var children = [];
                        if (dc.id !== null) {
                            dc.id.forEach(function (c) {
                                children.push(c);
                            });
                        }
                        array[i] = (children.length == 0) ? { category: dc} : { category: dc, children: getChild(dim, children) };
                    });

                    return array;
                }
                else return null;
            };

            // Which have a parent
            dim.Category().forEach(function (e, i) {
                if (e.length) {
                    e.id.forEach(function (c) {
                        haveparent.push(c);
                    })
                }
            });

            // Which are root
            dim.Category().forEach(function (e, i) {
                if (haveparent.indexOf(dim.id[i]) == -1) {
                    root.push(dim.id[i]);
                }
            });

            return getChild(dim, root);
        }

        function createNode(node, text, cssClass) {
            var n = document.createElement(node);
            if (text != undefined) n.innerHTML = text;
            if (cssClass != undefined) n.setAttribute('class', cssClass);

            return n;
        }

        function doneSecRender() {
            renderedsecscomplete++;
            if (renderedsecs == renderedsecscomplete && _params.hooks != undefined && _params.hooks.onRenderComplete != undefined) _params.hooks.onRenderComplete();
        }

        function sec_definitions(section) {
            var div = nomisUI.element({ tagname: 'div', classname: 'definitions-section' });
            defname = section.title;

            // Anchor
            div.appendChild(nomisUI.element({ tagname: 'a', attributes: [{ name: 'name', value: 'defs_' + section.anchor}] }));

            return div;
        }

        function sec_contents(section, sectionlist, index, depth, maxdepth) {
            var ul = document.createElement('ul');
            var seenSection = true;
            if (depth == 0) seenSection = false;

            if (sectionlist == undefined || (maxdepth != undefined && maxdepth < depth)) return ul;

            for (var i = 0; i < sectionlist.length; i++) {
                if (sectionlist[i] != section && seenSection) {
                    var sli = sectionlist[i];
                    var t = sli.title;
                    var istable = false;
                    if (section.options && section.options.indextables && sli.type == 'table') {
                        t = sli.options.caption;
                        istable = true;
                    }

                    if (t != undefined && t != null) {
                        var li = document.createElement('li');
                        var a = document.createElement('a');
                        a.setAttribute('href', '#' + sli.anchor);
                        a.appendChild(document.createTextNode(t));

                        li.appendChild(a);

                        if (sli.options != undefined && sli.options.contentsText != undefined) {
                            var ct = sli.options.contentsText;
                            var ctd = document.createElement('div');

                            if (sli.sections) {
                                sli.sections.map(function (s, j) {
                                    var ref = '#' + s.anchor;
                                    var n = '';
                                    if (s.options) {
                                        if (s.options.shortName) n = s.options.shortName;
                                        else if (s.options.title) n = s.options.title;
                                        else if (s.options.caption) n = s.options.caption;
                                        else n = 'undefined';

                                        ct = ct.replace('#' + j, '<a href="' + ref + '">' + n + '</a>');
                                    }
                                });
                            }

                            ctd.innerHTML = ct;
                            li.appendChild(ctd);
                        }

                        if (section.options != undefined && section.options.depth > 1) {
                            var subsec = sec_contents(section, sectionlist[i].sections, -1, depth + 1, section.options.depth)
                            if (subsec.children.length > 0) li.appendChild(subsec);
                        }

                        ul.appendChild(li);
                    }
                }
                else seenSection = true;
            }

            return ul;
        }

        function sec_paragraph(p, section, sectionlist, index, depth, placeholder, target) {
            var text = section.options.text;

            // Defer the content because of variables embedded in the text?
            if (varsReady(text) == false) {
                renderedsecs++;

                if (placeholder == null) {
                    placeholder = createWaitPlaceholder(section, 'smallsizedWait');
                    target.appendChild(placeholder);
                }

                var _ph = placeholder;

                vlisteners.push({ text: text, callback: createRenderCallback(p, section, sectionlist, index, depth, sec_paragraph, placeholder) });
                return;
            }
            else {
                doneSecRender();
                if (placeholder == null) placeholder = createWaitPlaceholder(section);
                if (target != null) target.appendChild(placeholder);
            }

            text = substituteVars(text);

            var div = document.createElement('p');
            div.setAttribute('class', 'htmlbox');
            div.innerHTML = text;

            setSection(placeholder, section, div);
        }

        function findDatasource(p, id) {
            for (var i = 0; i < p.datasources.length; i++) {
                var u = p.datasources[i];
                if (u.id == id) return u;
            }

            return null;
        }

        function createWaitPlaceholder(section, waitClass) {
            var p = document.createElement('div');

            if (section != undefined) {
                if (section.options.style != undefined) p.setAttribute('style', section.options.style);
                if (section.options.cssClass != undefined) p.setAttribute('class', section.options.cssClass);
            }

            var d = createNode('div', 'Please wait while we get your data...');
            d.setAttribute('class', 'pleasewait' + ((waitClass) ? ' ' + waitClass : ''));

            p.appendChild(d);

            placeholders.push(p);
            return p;
        }

        function dataReady(id) {
            return (data != null && data[id] != undefined);
        }

        function table_colHeadForUi(d, parentcol, cols, index, filter) {
            var list = parentcol || [];

            if (index < cols.length) {
                var col = cols[index];
                var dc = d.Dimension(col.id);

                if (col.select != undefined) {
                    // Just some
                    for (var i = 0; i < col.select.length; i++) {
                        var coldef = { label: dataLabelFromSelect(col, dc, i) };

                        if (col.id === "measures") {
                            var dccat = dc.Category(subsel(col.id, col.select[i]));
                            if(!dccat) console.log('Could not get category for ' + col.select[i] + ' from ' + col.id);

                            var unit = (dccat)? dccat.unit : null;
                            if (unit && unit.type) {
                                coldef.classname = 'column-type-' + unit.type;
                            }
                        }
                        else coldef.classname = 'column-' + col.id;

                        var clk = null;
                        try {
                            clk = _params.hooks.table.columnHeading.onclick;
                        }
                        catch {
                            // No problem as might not hava a hook
                        }

                        if(clk) coldef.onclick = clk(col.id, col.select[i], coldef.label);

                        list.push(coldef);
                        var subcols = [];
                        table_colHeadForUi(d, subcols, cols, index + 1, filter);
                        if (subcols.length > 0) coldef.columns = subcols;
                    }
                }
                else {
                    var dclist = [];
                    if (filter[col.id]) { // Pivot
                        var didx = dc.Category(filter[col.id]).index;
                        dclist.push(didx);
                    }
                    else { // All
                        for (var i = 0; i < dc.length; i++) dclist.push(i);
                    }

                    for (var i = 0; i < dclist.length; i++) {
                        var currdc = dclist[i];
                        var coldef = { label: dataLabel(col, dc, currdc) };
                        var unit = dc.Category(dc.id[currdc]).unit;

                        // Unit of column
                        if (unit != null && unit.type) coldef.classname = 'column-type-' + unit.type;
                        else coldef.classname = 'column-' + col.id;

                        // Column heading onclick hook
                        try {
                            var clk = _params.hooks.table.columnHeading.onclick;
                            if(typeof(clk) === 'function') coldef.onclick = clk(col.id, dc.id[currdc], coldef.label);
                        }
                        catch {
                            // No problem as might not hava a hook
                        }

                        list.push(coldef);
                        var subcols = [];
                        table_colHeadForUi(d, subcols, cols, index + 1, filter);
                        if (subcols.length > 0) coldef.columns = subcols;
                    }
                }
            }

            return list;
        }

        function recurseAddRow(branch, level, labelpath, cols, d, dRow, filter, rowopt, section, target) {
            var lblpth = labelpath.slice();

            var c = branch.category;
            filter[rowopt] = dRow.id[c.index];

            var row = {};
            dataRow(cols, d, filter, c.label, row, section);

            if (dRow.extension && dRow.extension.attributes) {
                var attr = dRow.extension.attributes[dRow.id[c.index]];

                if (attr && attr.UI_SuggestStyle) row.classname = attr.UI_SuggestStyle;
                if (attr && attr.DisplayName) row.label = attr.DisplayName;
            }

            lblpth.push(row.label);

            if (lblpth.length > 1) row.label = lblpth;

            target.push(row);

            if (branch.children) {
                for (var i = 0; i < branch.children.length; i++) {
                    recurseAddRow(branch.children[i], level + 1, lblpth, cols, d, dRow, filter, rowopt, section, target);
                }
            }
        }

        // Supports multiple cols dimensions, but only single dimension in rows in table
        function sec_table(p, section, sectionlist, index, depth, placeholder, target) {
            var dsrc = section.options.datasource;
            if (!section._def) {
                section._def = { complete: false };
                defs.push(section._def);
            }

            // Defer the table?
            if (!dataReady(dsrc.id)) {
                renderedsecs++;
                if (placeholder == null) {
                    placeholder = createWaitPlaceholder(section);
                    target.appendChild(placeholder);
                }

                var _ph = placeholder;

                addListener(p, dsrc.id, createRenderCallback(p, section, sectionlist, index, depth, sec_table, placeholder), function () { return $(_ph).offset().top });
                return;
            }
            else {
                doneSecRender();
                if (placeholder == null) placeholder = createWaitPlaceholder(section);
                if (target != null) target.appendChild(placeholder);
            }

            createPivotableTable(p, section, sectionlist, index, depth, placeholder);
        }

        // Return a function that when called passing a filter in refreshes the table content inside placeholder
        function createRefreshTableContentCall(p, section, sectionlist, index, depth, placeholder) {
            var _p = p;
            var _section = section;
            var _sectionlist = sectionlist;
            var _index = index;
            var _depth = depth;
            var _placeholder = placeholder;

            return function (filter) {
                createTable(_p, _section, _sectionlist, _index, _depth, _placeholder, filter, true); // Pass true for refresh
            }
        }

        function needsRequeryOnChange(datasource, dimensionId) {
            var url = datasource.url || datasource.apiUrl;
            if (url.indexOf('$' + dimensionId) != -1) return true;
            else return false;
        }

        function requeryData(datasource, callback) {
            datasource.ready = false;
            datasource.running = false;
            datasource.listeners = []; // Remove all listeners as it is just for the callback.
            getDataForSource(datasource, callback);
        }

        function createPivot(currData, d, pivot, baseFilter, target, changeCallback, complete, needsRequery, btnUpdate) {
            var _dsrc = currData;
            var pivId = pivot.id;
            var dFilt = (d == null) ? null : d.Dimension(pivId);
            var bFilter = baseFilter;
            var list = [];
            var sel = null;
            var needsrq = needsRequeryOnChange(_dsrc, pivId);
            var _btnUpdate = btnUpdate;
            var pivDomId = null;
            if (pivot.dom && pivot.dom.id) pivDomId = pivot.dom.id;

            var div = nomisUI.element({ tagname: 'div', cssClass: 'pivotControl', id: pivDomId });

            function cpiv() {
                // Set initial selection in filter
                bFilter[pivId] = sel.toString();

                div.appendChild(nomisUI.select({ label: (pivot.label) ? pivot.label : dFilt.label, list: list, selected: sel, onchange: function () {
                    var elem = this;

                    if (bFilter[pivId] != elem.value) {
                        _btnUpdate.disabled = false;
                        bFilter[pivId] = elem.value;
                        if (needsrq) needsRequery.status = true;
                    }
                }
                }));

                if (needsrq) needsRequery.status = true;
                complete();
            }

            // No dimension list from data
            if (dFilt == null) {
                // Need to go get the list from the API
                var url = currData.url || currData.apiUrl;

                if(url.indexOf("www.nomisweb.co.uk") >= 0) { // For Nomis API go and get an overview document to populate pivot options
                    // Pull out the but up to just after dataset number
                    var idx = url.indexOf('/nm_');
                    var idx2 = url.indexOf('.', idx);
                    var chop = url.substring(0, idx2);
                    url = chop;

                    // Append codelist request
                    url += '.overview.json?select=codes,dimension-' + pivId;

                    $.getJSON(url, function (data) {
                        var a = data.overview.dimensions.dimension.codes.code;

                        a.map(function (d, i) {
                            if (sel == null) sel = d.value;
                            else if (pivot.selected == 'LAST') sel = d.value;
                            else if ((pivot.selected == 'FIRST') && (i == 0)) sel = d.value;
                            else if (pivot.selected == d.value) sel = d.value;

                            list.push({ label: d.name, value: d.value });
                        });

                        // Re-instate previous filter value
                        if (datafilterstate[_dsrc.id]) sel = datafilterstate[_dsrc.id][pivId];

                        cpiv();
                    });
                }
                else console.log('Cannot pivot ' + pivId + ' data contains no dimension list');
            }
            else {
                for (var i = 0; i < dFilt.id.length; i++) {
                    var currentId = dFilt.id[i];

                    if (i == 0) sel = currentId;
                    else if ((pivot.selected == 'LAST') && (i == (dFilt.id.length - 1))) sel = currentId;
                    else if ((pivot.selected == 'FIRST') && (i == 0)) sel = currentId;
                    else if (pivot.selected == currentId) sel = currentId;

                    list.push({ label: dFilt.Category(currentId).label, value: dFilt.id[i] });
                }

                // Re-instate previous filter value
                if (datafilterstate[_dsrc.id]) sel = datafilterstate[_dsrc.id][pivId];

                cpiv();
            }

            target.appendChild(div);
            placeholders.push(div);
        }

        function createCreatePivotCall(currData, d, currPiv, baseFilter, ptgt, tcall, needsRequery, btnUpdate) {
            var _currData = currData;
            var _d = d;
            var _currPiv = currPiv;
            var _baseFilter = baseFilter;
            var _ptgt = ptgt;
            var _tcall = tcall
            var _needsRequery = needsRequery;
            var _btnUpdate = btnUpdate;

            return function (complete) {
                createPivot(_currData, _d, _currPiv, _baseFilter, _ptgt, _tcall, complete, _needsRequery, _btnUpdate);
            }
        }

        function createPivotableTable(p, section, sectionlist, index, depth, placeholder) {
            var _section = section;
            var dsrc = section.options.datasource;
            var currData = data[dsrc.id];
            var d = currData.dao.Dataset((dsrc.bundleDatasetIndex != undefined)? dsrc.bundleDatasetIndex : 0);
            var pivot = dsrc.pivot;
            var baseFilter = getFilter(d, dsrc.filter);
            var needsRequery = { status: false };

            // Apply pivot to filter
            if (pivot && (pivot.length > 0)) {
                var btn = nomisUI.button({ label: 'Update table', classname: 'positive' }); // Button to submit pivot changes
                var tableTarget = document.createElement('div');
                var tcall = createRefreshTableContentCall(p, section, sectionlist, index, depth, tableTarget);
                var pivotControlTarget = null;

                var queue = FuncQueue.create({ ignoreErrors: false, timeout: 30000, onError: function (message) { console.log(message); }, onTimeout: function () { console.log('failed'); } });

                for (var i = 0; i < pivot.length; i++) {
                    var ptgt = null;
                    var currPiv = pivot[i];

                    if (currPiv.dom) {
                        var par = currPiv.dom.parent;
                        if (par) {
                            ptgt = document.getElementById(par);
                        }
                    }

                    if (!ptgt) {
                        if (!pivotControlTarget) {
                            pivotControlTarget = document.createElement('div');
                            pivotControlTarget.setAttribute('class', 'pivotController');
                            placeholders.push(pivotControlTarget); // So it gets removed when report is cleared.
                        }

                        ptgt = pivotControlTarget;
                    }

                    // Create a pivot selector
                    queue.add(createCreatePivotCall(currData, d, currPiv, baseFilter, ptgt, tcall, needsRequery, btn));
                }

                queue.run(function (data) {
                    placeholder.innerHTML = '';

                    var pcgdiv = document.createElement('div');
                    pcgdiv.setAttribute('class', 'pivotControlGroup' + ((pivot.length == 1)? ' pivotControlGroupSinglePivot' : '') );

                    if (pivotControlTarget) pcgdiv.appendChild(pivotControlTarget);

                    btn.onclick = function () {
                        var elem = this;
                        elem.disabled = true;
                        tableTarget.innerHTML = '';

                        var pw = createNode('div', 'Please wait while we get your data...');
                        pw.setAttribute('class', 'pleasewait');
                        tableTarget.appendChild(pw);

                        function redoTable() {
                            // Clone the base filter to use in preparing the table
                            var filter = {}
                            nomisUI.util.forEachProperty(baseFilter, function (p, o) { filter[p] = o[p]; }); // Clone the filter object

                            tcall(filter);
                        }

                        if (needsRequery.status) {
                            currData.filter = baseFilter;
                            requeryData(currData, redoTable);
                            needsRequery.status = false;
                        }
                        else redoTable();
                    };

                    btn.disabled = true;

                    pcgdiv.appendChild(btn);

                    // Set up a download link for the pivot
                    var url = getXlsUrl(_section, currData);

                    if(url != null) {
                        var xlsicon = document.createElement('img');
                        xlsicon.setAttribute('src', 'images/xlsicon.png');
                        xlsicon.setAttribute('width', '15');
                        xlsicon.setAttribute('alt', 'Microsoft Excel download icon');
                        xlsicon.setAttribute('style', 'padding-right: 0.5em;');
                        var xlsbtn = nomisUI.button({ label: xlsicon, onclick: function () {
                            document.location.href = url;
                        }
                        });
                        xlsbtn.appendChild(document.createTextNode('Download (.xlsx)'));
                        xlsbtn.setAttribute('title', 'Download this table in Microsoft Excel format');
                        xlsbtn.setAttribute('style', 'float: right;');
                        pcgdiv.appendChild(xlsbtn);
                    }

                    placeholder.appendChild(pcgdiv);
                    placeholder.appendChild(tableTarget);


                    // Clone the base filter to use in preparing the table
                    var filter = {}
                    nomisUI.util.forEachProperty(baseFilter, function (p, o) { filter[p] = o[p]; }); // Clone the filter object

                    function initT() {
                        createTable(p, section, sectionlist, index, depth, tableTarget, filter);
                    }

                    if (needsRequery.status) {
                        tableTarget.innerHTML = '';
                        var pw = createNode('div', 'Please wait while we get your data...');
                        pw.setAttribute('class', 'pleasewait');
                        tableTarget.appendChild(pw);

                        currData.filter = baseFilter;
                        datafilterstate[currData.id] = baseFilter;
                        requeryData(currData, initT);
                        needsRequery.status = false;
                    }
                    else initT();
                });
            }
            else createTable(p, section, sectionlist, index, depth, placeholder, baseFilter);
        }

        function createTable(p, section, sectionlist, index, depth, placeholder, filter, refresh) {
            var dsrc = section.options.datasource;
            var d = data[dsrc.id].dao.Dataset((dsrc.bundleDatasetIndex != undefined)? dsrc.bundleDatasetIndex : 0);

            var rows = section.options.rows;
            var cols = section.options.columns;
            var rowopt = rows[0].id;
            var dRow = d.Dimension(rowopt);

            var opts = {};

            // Table title
            if (section.options.caption != undefined) {
                opts.summary = section.options.caption.replace('$source', d.label);
                opts.caption = opts.summary;
            }

            // Units from measures
            var meas = d.Dimension('measures');
            if (meas) {
                opts.unit = [];
                for (var i = 0; i < meas.id.length; i++) {
                    var u = meas.Category(meas.id[i]);
                    if (u.unit.base) opts.unit.push({ content: u.unit.base });
                }
            }

            // Column headings
            opts.columns = table_colHeadForUi(d, null, cols, 0, filter);

            // Row headings and data
            opts.data = [];
            if (rows[0].select != undefined) {
                for (var i = 0; i < rows[0].select.length; i++) {
                    filter[rowopt] = subsel(rowopt, rows[0].select[i]);

                    var row = {};
                    dataRow(cols, d, filter, dataLabelFromSelect(rows[0], dRow, i), row, section);

                    var optclassname = rows[0].classname;
                    if (optclassname && optclassname[rows[0].select[i]]) {
                        row.classname = optclassname[rows[0].select[i]];
                    }

                    opts.data.push(row);
                }
            }
            else {
                // Follow the hierarchy if present (and if data isn't sorted by row label)
                if (dRow.hierarchy == true && section.options.sortdata != true) {
                    var tree = treeFromDimension(dRow);

                    for (var i = 0; i < tree.length; i++) {
                        recurseAddRow(tree[i], 0, [], cols, d, dRow, filter, rowopt, section, opts.data);
                    }
                }
                else {
                    for (var i = 0; i < dRow.length; i++) {
                        filter[rowopt] = dRow.id[dRow.Category(i).index];

                        var row = {};
                        dataRow(cols, d, filter, dataLabel(rows[0], dRow, i), row, section);
                        opts.data.push(row);
                    }
                }
            }

            // Add "before" classes to rows
            for (var i = 0; i < opts.data.length - 1; i++) {
                var od = opts.data[i];
                var od1 = opts.data[i + 1].classname;
                if (typeof od1 === 'string' && od1.length > 0) {
                    if (!od.classname) od.classname = '';
                    else od.classname += ' ';

                    od.classname += 'before-' + od1.split(' ')[0];
                }
            }

            // Sort rows on labels
            if (section.options.sortdata == true) {
                opts.data.sort(function (a, b) {
                    if (a.label < b.label)
                        return -1;
                    if (a.label > b.label)
                        return 1;
                    return 0;
                });
            }

            // Split labels for row heading indentation
            /*if (!dRow.hierarchy) {
            for (var i = 0; i < opts.data.length; i++) {
            var row = opts.data[i];

            if (row.label.indexOf(' - ') > -1) row.label = row.label.split(' - ');
            else if (row.label.indexOf(': ') > -1) row.label = row.label.split(': ');
            }
            }*/

            // Source
            opts.source = section.options.source || 'Unknown source';
            if(d.Dimension('time') != null) opts.source = opts.source.replace('$date', d.Dimension('time').Category(0).label);

            if(d.extension) {
                var warn = d.extension.warnings;
                if (warn) {
                    opts.flags = [];

                    for (var i = 0; i < warn.length; i++) {
                        var w = warn[i];
                        if (w.message != undefined) {
                            var flag = {};

                            flag.content = w.message.replace(/\n/g, " "); // Remove line breaks from warning messages.
                            if (w.status) flag.flag = w.status;

                            opts.flags.push(flag);
                        }
                    }
                }
            }

            // Contact
            if (section.options.includeContact && d.extension.contact) {
                opts.contact = d.extension.contact;
            }

            // Anchor
            var anchor = nomisUI.element({ tagname: 'a', attributes: [{ name: 'name', value: section.anchor}] });

            // Row metadata
            if (dRow.extension && dRow.extension.metadata) {
                for (var i = 0; i < dRow.extension.metadata.length; i++) {
                    if (!opts.footnotes) opts.footnotes = [];

                    var metaentry = dRow.extension.metadata[i];
                    opts.footnotes.push(((metaentry.title.length > 0) ? 'h3' + metaentry.title + '/h3' : '') + metaentry.message);
                }
            }

            // Dataset metadata
            var metadiv = null;

            if(d.extension && section.options.includeDatasetMetadata) {
                var meta = d.extension.metadata;
                metadiv = nomisUI.element({ tagname: 'div', attributes: [{ name: 'class', value: 'dataset-metadata'}] });
                if (meta) {
                    for (var i = 0; i < meta.length; i++) {
                        var m = meta[i];
                        var f = '';

                        if (m.title && m.title.length > 0) f = '<h2>' + m.title + '</h2>';
                        if (m.message) {
                            f += nomisUI.util.textism(m.message);
                            var met = document.createElement('div');
                            met.innerHTML = f;
                            metadiv.appendChild(met);
                        }
                    }
                }
            }

            // Contact in table notes?
            if ((!section.options.includeContact) && (d.extension && d.extension.contact)) {
                var contact = 'h3Contact details/h3';

                if (typeof d.extension.contact !== 'string') {

                    contact += '<table class="plain">';
                    if (d.extension.contact.name) contact += '<tr><th>Name</th><td>' + d.extension.contact.name + '</td></tr>';
                    if (d.extension.contact.telephone) contact += '<tr><th>Telephone</th><td>' + d.extension.contact.telephone + '</td></tr>';
                    if (d.extension.contact.uri) contact += '<tr><th>Web site</th><td>' + d.extension.contact.uri + '</td></tr>';
                    if (d.extension.contact.email) contact += '<tr><th>Email</th><td>' + d.extension.contact.email + '</td></tr>';
                    contact += '</table>';
                }
                else contact += d.extension.contact;

                if (!opts.footnotes) opts.footnotes = [];
                opts.footnotes.push(contact);
            }

            // Complete the definitions section entry for this table.
            if (defdiv) {
                section._def.title = opts.caption;
                section._def.anchor = 'defs_' + section.anchor;
                section._def.originAnchor = section.anchor;
                section._def.notes = opts.footnotes;
                opts.footnotes = null;
                section._def.complete = true; // Mark section definition as complete.
                defReady(section._def); // Notify this definition is ready
            }

            tbl = nomisUI.table(opts);

            // Optional view links
            var links = getOptionalViewLinks(section, data[dsrc.id]);

            replacePlaceholder(placeholder, [anchor, metadiv, tbl, links], section);
        }

        function getXlsUrl(section, d) {
            if (!d) return;

            // Allow a specific link to XLSX file for data
            if(d.links) {
                if(d.links.xlsx) return d.links.xlsx;
                else return null;
            }

            var url = d.apiUrl;
            if (!url) url = d.url;
            
            // If Nomis API make substitutions to create a dynamic XLSX url
            if(url != null && url.indexOf("www.nomisweb.co.uk") >= 0) {
                url = url.replace('jsonstat.json', 'data.xlsx');

                var ridx = url.indexOf('&_=');
                if (ridx > 0) url = url.substring(0, ridx);

                // Any filtered dimension not in url?
                if (d.filter) {
                    nomisUI.util.forEachProperty(d.filter, function (p, o) {
                        if (url.indexOf(p + '=') == -1) url += '&' + p + '=' + o[p];
                    });
                }

                // Add the rows and columns
                for (var i = 0; i < section.options.rows.length; i++) {
                    if (i == 0) url += '&rows=';
                    else url += ',';

                    url += section.options.rows[i].id;
                }

                for (var i = 0; i < section.options.columns.length; i++) {
                    if (i == 0) url += '&cols=';
                    else url += ',';

                    url += section.options.columns[i].id;
                }
            }
            else url = null; // Do not know how to get from an API URL to an XLSX link.

            return url;
        }

        function getOptionalViewLinks(section, d) {
            var div = document.createElement('div');
            div.setAttribute('class', 'profile-optional-view-links');

            var div2 = document.createElement('div');
            div2.setAttribute('class', 'navmenuitem');

            var ul = document.createElement('ul');

            if (d.apiUrl != undefined && section.options.xlsLink != false) {
                var url = getXlsUrl(section, d);
                if(url != null) {
                    // Download link
                    var a = document.createElement('a');
                    a.setAttribute('href', url);
                    a.setAttribute('title', 'Download this table of data in Microsoft Excel format');
                    a.setAttribute('class', 'btn btn--primary btn--inline');
                    a.appendChild(nomisUI.element({
                        tagname: 'img',
                        attributes: [
                                { name: 'title', value: 'Download this table of data in Microsoft Excel format' },
                                { name: 'src', value: 'images/xlsicon.png' }
                            ]
                    }));
                    a.appendChild(document.createTextNode('Download this table (.xlsx)'));

                    var li = document.createElement('li');
                    li.appendChild(a);
                    ul.appendChild(li);
                }
            }

            if (section.options.definitionsLink != false && (defdiv && section._def.notes && (section._def.notes.length > 0))) {
                var li = document.createElement('li');
                var a = document.createElement('a');
                a.setAttribute('href', '#' + section._def.anchor);
                a.setAttribute('title', 'Jump to ' + defname + ' for this table');
                a.setAttribute('class', 'btn btn--primary btn--inline');
                a.innerHTML = '<span class="infoicon">&#9432;</span>' + defname;
                a.onclick = function () {
                    var m = '';
                    section._def.notes.map(function (note) {
                        m += '<div style="margin-bottom: 1em;">' + nomisUI.util.textism(note) + '</div>';
                    });

                    if(_params.hooks && _params.hooks.popupMessage) {
                        _params.hooks.popupMessage(section.options.caption + ' ' + defname.toLowerCase(), m);
                        return false;
                    }
                    else return true;
                }
                li.appendChild(a);
                ul.appendChild(li);
            }

            div2.appendChild(ul);
            div.appendChild(div2);

            return div;
        }

        // Produce a row of data containing all columns.
        function dataRow(cols, d, filter, label, rowspec, section) {
            var row = rowspec || {};
            row.label = label;

            row.values = [];

            dataCols(cols, filter, d, row.values);

            if (rowspec.decorations != undefined) {
                for (var i = 0; i < rowspec.decorations.length; i++) {
                    var deco = rowspec.decorations[i];

                    if (deco.target == filter[rowspec.id]) {
                        if (deco.type == 'heading') row.label = [deco.value, row.label];
                        else if (deco.type == 'class') row.classname = deco.value;
                    }
                }
            }

            return row;
        }

        // Get the label for a col/row of data based on a select option.
        function dataLabelFromSelect(spec, dim, i) {
            var label = 'Error';
            if (spec.labels != undefined && spec.labels.length > i && spec.labels[i] != null) label = spec.labels[i];
            else {
                var sus = subsel(spec.id, spec.select[i]);
                var dcat = dim.Category(sus);
                var cid = (dcat)? dim.Category(dcat.index) : null;

                if (cid == null) {
                    label = 'Error: ' + spec.select[i];
                    console.log('Could not get category ' + spec.select[i] + ' from ' + spec.id);
                }
                else label = cid.label;
            }

            return label;
        }

        // Get the label for a col/row of data.
        function dataLabel(spec, dim, i) {
            var label = 'Error';
            if (spec.labels != undefined && spec.labels.length > i && spec.labels[i] != null) label = spec.labels[i];
            else {
                var cid = dim.Category(i);

                if (cid == null) label = 'Error: ' + i;
                else label = cid.label;
            }

            return label;
        }

        function getValue(d, filter, category) {
            var v = d.Data(filter);

            var vobj = {};

            //if (v.value != undefined && v.value != null) vobj.value = numberWithCommas(v.value);
            if (v.value != undefined && v.value != null && v.value != '-') vobj.value = v.value;
            if (v.status != undefined && v.status != null) vobj.flag = v.status;

            if (vobj.value == undefined && vobj.flag == undefined) vobj.flag = '-';

            if (category && category.unit && category.unit.decimals) {
                vobj.precision = category.unit.decimals;
            }

            return vobj;
        }

        // Recursively print the data for all columns
        function dataCols(colspec, filt, data, rowvalues) {
            var cols = colspec;
            var filter = filt;
            var d = data;

            function recurse(lvl) {
                var c = lvl;
                var col = cols[c];
                var cid = col.id;
                var dim = d.Dimension(cid);

                if (col.select != undefined) {
                    for (var k = 0; k < col.select.length; k++) {
                        filter[cid] = subsel(col.id, col.select[k]);
                        if (c == cols.length - 1) rowvalues.push(getValue(d, filter, dim.Category(filter[cid])));
                        else recurse(lvl + 1);
                    }
                }
                else {
                    if (filter[cid]) { // Pivot
                        if (c == cols.length - 1) rowvalues.push(getValue(d, filter, dim.Category(filter[cid])));
                        else recurse(lvl + 1);
                    }
                    else {
                        for (var k = 0; k < dim.length; k++) {
                            filter[cid] = dim.id[dim.Category(k).index];
                            if (c == cols.length - 1) rowvalues.push(getValue(d, filter, dim.Category(filter[cid])));
                            else recurse(lvl + 1);
                            filter[cid] = null;
                        }
                    }
                }
            }

            // Data
            recurse(0);
        }

        function replacePlaceholder(placeholder, elems, section) {
            if (placeholder != undefined) {
                placeholder.innerHTML = '';

                if (section.options.style != undefined) placeholder.setAttribute('style', section.options.style);
                if (section.options.cssClass != undefined) placeholder.setAttribute('class', section.options.cssClass);

                for (var i = 0; i < elems.length; i++) {
                    if (elems[i] != null) placeholder.appendChild(elems[i]);
                }
            }
        }

        function createSectionDiv(section) {
            var div = document.createElement('div');

            return div;
        }

        // d and filter are optional, if present then anything in filter is substituted in string (e.g. $time)
        function setSection(placeholder, section, div, d, filter) {
            var repl = new Array();

            if (section.options.title != undefined) repl.push(createNode('h2', substituteFilterLabels(section.options.title, d, filter)));
            if (section.options.subtitle != undefined) repl.push(createNode('h3', substituteFilterLabels(section.options.subtitle, d, filter)));

            repl.push(div);
            replacePlaceholder(placeholder, repl, section);
        }

        function sec_figure(p, section, sectionlist, index, depth, placeholder, target) {
            var dsrc = section.options.datasource;

            // Defer the table?
            if (!dataReady(dsrc.id)) {
                renderedsecs++;
                if (placeholder == null) {
                    placeholder = createWaitPlaceholder(section);
                    target.appendChild(placeholder);
                }

                var _ph = placeholder;

                addListener(p, dsrc.id, createRenderCallback(p, section, sectionlist, index, depth, sec_figure, placeholder), function () { return $(_ph).offset().top });
                return;
            }
            else {
                doneSecRender();
                if (placeholder == null) placeholder = createWaitPlaceholder(section);
                if (target != null) target.appendChild(placeholder);
            }

            var d = data[dsrc.id].dao.Dataset((dsrc.bundleDatasetIndex != undefined)? dsrc.bundleDatasetIndex : 0);

            var filter = getFilter(d, dsrc.filter);

            // Resolve dynamic filter properties with report config
            nomisUI.util.forEachProperty(filter, function(p) { // Translate any numeric index into matching param from config
                var sv = filter[p];
                if(isNaN(sv) == false && _params.config[p] != undefined) {
                    if(_params.config[p].length > sv) filter[p] = _params.config[p][sv];
                    else console.log('Error: figure index ' + sv + ' out of bounds for config ' + p);
                }
            });

            nomisUI.util.forEachProperty(_params.config, function(p) { // Add any missing properties
                if(filter[p] == undefined) filter[p] = _params.config[p][0];
            });

            var val = '';
            var txt = null;
            var symb = document.createElement('span'); // Symbol next to figure (e.g. change up or down)

            if (section.options.change == undefined) {
                val = formatVal(d.Data(filter).value, section);
            }
            else {
                // Change between figures
                var filter2 = getFilter(d, section.options.change.filter);

                // Resolve dynamic filter properties with report config
                nomisUI.util.forEachProperty(filter2, function(p) { // Translate any numeric index into matching param from config
                    var sv = filter2[p];
                    if(isNaN(sv) == false && _params.config[p] != undefined) {
                        if(_params.config[p].length > sv) filter2[p] = _params.config[p][sv];
                        else console.log('Error: figure index ' + sv + ' out of bounds for config ' + p);
                    }
                });

                nomisUI.util.forEachProperty(_params.config, function(p) { // Add any missing properties
                    if(filter2[p] == undefined) filter2[p] = _params.config[p][0];
                });

                var v1 = d.Data(filter).value;
                var v2 = d.Data(filter2).value;

                // Autogenerate a sub-title
                if (section.options.change.dimension != undefined) {
                    txt = 'Comparison of ';
                    txt += substituteFilterLabels('$' + section.options.change.dimension, d, filter);
                    txt += ' and ';
                    txt += substituteFilterLabels('$' + section.options.change.dimension, d, filter2);
                }

                if (v1 != v2) {
                    if (v2 > v1) {
                        symb.innerHTML = '&uarr;<span>up<\/span>';
                        symb.setAttribute('class', 'change-arrow-up');
                    }
                    else {
                        symb.innerHTML = '&darr;<span>down<\/span>';
                        symb.setAttribute('class', 'change-arrow-down');
                    }
                }

                if (section.options.change.display == "percentage-change") {
                    var chg = (((v2 - v1) / v2) * 100);
                    if (section.options.precision != undefined) chg = chg.toFixed(section.options.precision);
                    else chg = chg.toFixed(1);

                    val = chg.toString();
                    val += '%';
                }
                else val = formatVal(v2 - v1, section);
            }

            var valdiv = document.createElement('div');
            valdiv.setAttribute('class', 'figurebox-value');
            valdiv.appendChild(document.createTextNode(val));
            valdiv.appendChild(symb);

            var div = createSectionDiv(section, d, filter);
            div.setAttribute('class', 'figurebox');
            div.appendChild(valdiv);
            if (txt != null) div.appendChild(createNode('div', txt));
            if (section.options.footer != undefined) div.appendChild(createNode('div', substituteFilterLabels(section.options.footer, d, filter), 'figurebox-footer'));
            if (section.options.showSource == true) div.appendChild(createSourceDiv(d));

            setSection(placeholder, section, div, d, filter);
        }

        function formatVal(val, section) {
            var v = '';

            if (section.options.precision != undefined) val = Number(val).toFixed(Number(section.options.precision));

            if (section.options.prefix != undefined) v += section.options.prefix;
            v += val.toString();
            if (section.options.suffix != undefined) v += section.options.suffix;

            return v;
        }

        function substituteParams(text, ob, path) {
            var p = path || '';
            var t = text;

            nomisUI.util.forEachProperty(ob || _params.config, function (property, object) {
                var o = object[property];

                if (nomisUI.util.isArray(o)) {
                    for (var i = 0; i < o.length; i++) {
                        var pp = property + '[' + i + ']';
                        if (typeof o[i] === 'string') t = t.replace('$' + pp, o[i]);
                        else substituteParams(t, o[i], p + '.' + pp);
                    }
                }
                else if (typeof o === 'string') t = t.replace('$' + property, o);
            });

            return t;
        }

        function substituteFilterLabels(text, d, filter) {
            if (filter == null || filter == undefined) return substituteParams(text);

            d.Dimension().forEach(function (dim) {
                var id = dim.label;
                var lbl = null;

                if (filter[id] != undefined) lbl = dim.Category(filter[id]).label;
                else {
                    lbl = '';

                    for (var i = 0; i < dim.id.length; i++) {
                        if (i > 0) lbl += ', ';
                        lbl += dim.Category(dim.id[i]).label;
                    }
                }

                if (lbl != null) text = text.replace('$' + id, lbl);
            });

            if (filter['time'] != undefined) {
                text = text.replace('$time', d.Dimension('time').Category(filter['time']).label);
            }

            return substituteParams(text);
        }

        function getLatestTimeId(d) {
            if (!d) return '$time';

            var ids = d.Dimension('time').id;
            var max = 0;

            for (var i = ids.length - 1; i >= 0; i--) {
                var n = Number(ids[i]);
                if (n > max) max = n;
                else break;
            }

            return max.toString();
        }

        function getPreviousTimeId(d) {
            if (!d) return '$time';

            var latest = Number(getLatestTimeId(d));

            var ids = d.Dimension('time').id;
            var previous = 0;

            for (var i = 0; i < ids.length; i++) {
                var n = Number(ids[i]);
                if (n > previous && n < latest) previous = n;
            }

            return previous.toString();
        }

        // Set the correct time field
        function fixFilter(d, filter) {
            if (filter == undefined) return;

            if (filter['time'] === 'latest') filter['time'] = getLatestTimeId(d);
            else if (filter['time'] === 'previous') filter['time'] = getPreviousTimeId(d);
        }

        function getFilter(d, f) {
            var filter = f || {};
            fixFilter(d, filter);
            return filter;
        }

        function createVarDataReadyCallback(myVar, src) {
            var v = myVar;
            var d = src;

            return function () {
                var ds = data[v.datasource].dao.Dataset((v.bundleDatasetIndex != undefined)? v.bundleDatasetIndex : 0);

                v.getValue = function (index) {
                    var cell = ds.Data(v.select);

                    if (index) {
                        if (cell.length > index) return cell[index].value;
                        else {
                            if (console && console.log) console.log('Index out of bounds: ' + v.name + ' [' + index + ']');
                            return null;
                        }
                    }
                    else {
                        if (cell.length) {
                            if (console && console.log) console.log('Variable resolved to more than one figure, revise "select" clause: ' + v.name);
                            return null;
                        }
                        return cell.value;
                    }
                };

                // Set some information in the variable object with names of things selected.
                v.names = [];
                nomisUI.util.forEachProperty(v.select, function(k) {
                    var dim = ds.Dimension(k);
                    
                    if(dim) {
                        var cat = dim.Category(v.select[k]);
                        v.names.push({ id: k, label: (cat)? cat.label : v.select[k] });
                    }
                });

                notifyVarsReady();
            }
        }

        function initCustomVariables() {
            if (!profile.variables) return;
            vlisteners = [];

            var list = profile.variables;

            nomisUI.util.forEachProperty(list, function(property) {
                var v = list[property];
                var src = findDatasource(profile, v.datasource);

                if(v.select) {
                    nomisUI.util.forEachProperty(v.select, function(p) { // Translate any numeric index into matching param from config
                        var sv = v.select[p];
                        if(isNaN(sv) == false && _params.config[p] != undefined) {
                            if(_params.config[p].length > sv) v.select[p] = _params.config[p][sv];
                            else console.log('Error: variable index ' + sv + ' out of bounds for config ' + p);
                        }
                    });

                    nomisUI.util.forEachProperty(_params.config, function(p) { // Add any missing properties
                        if(v.select[p] == undefined) v.select[p] = _params.config[p][0];
                    });
                }

                if (!src.listeners) src.listeners = new Array();
                src.listeners.push(createVarDataReadyCallback(v, src));
            });
        }

        function notifyVarsReady() {
            for (var i = 0; i < vlisteners.length; i++) if (varsReady(vlisteners[i].text)) vlisteners[i].callback();
        }

        function varsReady(text) {
            if (!profile.variables) return true; // Profile doesn't have variables
            if (text.indexOf('$') == -1) return true; // Text doesn't use variables

            var list = profile.variables;
            for (var property in list) {
                if (list.hasOwnProperty(property)) {
                    var v = list[property];

                    if (text.indexOf('$' + property) > -1 && v.getValue == undefined) return false;
                }
            }

            return true;
        }

        function substituteVars(text) {
            // Nothing to substitute
            if (profile.variables == false || text.indexOf('$') == -1) return text;

            var list = profile.variables;
            for (var property in list) {
                if (list.hasOwnProperty(property) && (text.indexOf('$' + property) > -1)) {
                    var v = list[property];

                    var val = v.getValue();
                    if (val == null) val = '-';

                    text = text.replace('$' + property + '.name', v.name);

                    // Substitute labels from selected properties.
                    for(var i = 0; i < v.names.length; i++) {
                        text = text.replace('$' + property + '.' + v.names[i].id, v.names[i].label);
                    }

                    // Do this substitution last so other longer strings before it can work.
                    text = text.replace('$' + property, numberWithCommas(val));
                }
            }

            return text;
        }

        function sec_html(p, section, sectionlist, index, depth, placeholder, target) {
            var dsrc = section.options.datasource;

            // Defer the table?
            if (!dataReady(dsrc.id)) {
                renderedsecs++;

                if (placeholder == null) {
                    placeholder = createWaitPlaceholder(section);
                    target.appendChild(placeholder);
                }

                var _ph = placeholder;

                addListener(p, dsrc.id, createRenderCallback(p, section, sectionlist, index, depth, sec_html, placeholder), function () { return $(_ph).offset().top });
                return;
            }
            else {
                doneSecRender();
                if (placeholder == null) placeholder = createWaitPlaceholder(section);
                if (target != null) target.appendChild(placeholder);
            }

            var d = data[dsrc.id].html;

            var div = createSectionDiv(section);
            div.setAttribute('class', 'htmlbox');
            div.innerHTML = d;

            setSection(placeholder, section, div);
        }

        function getconfigval(obj) {
            if (typeof obj === 'object') {
                if (obj.label) return 'MAKE|' + obj.label + '|' + obj.value;
                else return obj.value;
            }
            else return obj;
        }

        function subsel(spec, val) {
            if (val.indexOf('$') == 0 && _params.config[spec.id] != undefined) {
                return _params.config[spec.id][val.split('$')[1]];
            }
            else return val;
        }

        function numberWithCommas(x) {
            return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }

        function createRenderCallback(prof, section, sectionlist, index, depth, func, placeholder) {
            var p = prof;
            var s = section;
            var sl = sectionlist;
            var i = index;
            var d = depth;
            var f = func;
            var ph = placeholder;

            return function (data) {
                f(p, s, sl, i, d, ph);
            }
        }

        function defReady(def) {
            var done = true;
            defs.map(function (d) {
                if (!d.complete) done = false;
            });

            if (done && defdiv) {
                var commonnotes = [];
                defs.map(function (d) {
                    if(d.notes) {
                        d.notes.map(function (n) {
                            if (commonnotes.includes(n)) return;

                            var common = true;

                            for (var i = 0; i < defs.length; i++) {
                                var d1 = defs[i];
                                if (d1 !== d) {
                                    var hasnote = false;
                                    if(d1.notes) {
                                        for (var j = 0; j < d1.notes.length; j++) {
                                            var n1 = d1.notes[j];
                                            if (n === n1) {
                                                hasnote = true;
                                                break;
                                            }
                                        }
                                    }

                                    if (!hasnote) {
                                        common = false;
                                        break;
                                    }
                                }
                            }

                            if (common) commonnotes.push(n);
                        });
                    }
                });

                if (commonnotes.length > 0) {
                    var ddiv = document.createElement('div');
                    var h2 = document.createElement('h2');
                    h2.appendChild(document.createTextNode('General information (applicable to all tables)'));
                    ddiv.appendChild(h2);
                    commonnotes.map(function (n) {
                        var div = document.createElement('div');
                        div.innerHTML = nomisUI.util.textism(n);
                        ddiv.appendChild(div);
                    });

                    defdiv.appendChild(ddiv);
                }

                // Render the definitions section
                defs.map(function (d) {
                    // Anchor
                    defdiv.appendChild(nomisUI.element({ tagname: 'a', attributes: [{ name: 'name', value: d.anchor}] }));

                    var ddiv = document.createElement('div');

                    var h2 = document.createElement('h2');
                    h2.appendChild(document.createTextNode(d.title));

                    h2.appendChild(nomisUI.element({ tagname: 'a', content: 'Go to table', attributes: [{ name: 'href', value: '#' + d.originAnchor}] }));

                    ddiv.appendChild(h2);

                    var ncount = 0;

                    if(d.notes) {
                        d.notes.map(function (n) {
                            if (!commonnotes.includes(n)) {
                                var div = document.createElement('div');
                                div.innerHTML = nomisUI.util.textism(n);
                                ddiv.appendChild(div);
                                ncount++;
                           }
                        });
                    }

                    if (ncount > 0) defdiv.appendChild(ddiv);
                });
            }
        }

        function render_sec(p, section, sectionlist, index, depth, target) {
            var div = target;
            if (section.target != undefined) {
                var t = document.getElementById(section.target);
                if (t != null) div = t;
            }

            if (section.title != undefined && section.title != null) {
                var a = document.createElement('a');
                a.setAttribute('name', section.anchor);
                var hdg = document.createElement('h' + (depth + 1));
                hdg.appendChild(a)
                hdg.appendChild(document.createTextNode(substituteFilterLabels(section.title)));

                if (!(index == 0 && depth == 0)) {
                    var atop = document.createElement('a');
                    atop.setAttribute('href', '#');
                    atop.setAttribute('class', 'back-to-top');
                    atop.setAttribute('title', 'Jump back to top of page');
                    atop.innerHTML = '&#8679;'

                    hdg.appendChild(atop);
                }

                div.appendChild(hdg);
                placeholders.push(hdg);
            }

            if (section.subtitle != undefined && section.subtitle != null) {
                var subt = createNode('h' + (depth + 2), substituteFilterLabels(section.subtitle));
                div.appendChild(subt);
                placeholders.push(subt);
            }

            if (section.type === 'contents') {
                var p = document.createElement('div');
                p.setAttribute('class', 'profile_contents');

                if (section.options) {
                    if (section.options.title) {
                        var cont = document.createElement('h3');
                        cont.appendChild(document.createTextNode(section.options.title))
                        p.appendChild(cont);
                    }
                    if (section.options.text) p.appendChild(document.createTextNode(section.options.text));
                }
                p.appendChild(sec_contents(section, sectionlist, index, depth));

                placeholders.push(p);
                div.appendChild(p);
            }
            else if (section.type === 'paragraph') sec_paragraph(p, section, sectionlist, index, depth, null, div);
            else if (section.type === 'table') sec_table(p, section, sectionlist, index, depth, null, div);
            else if (section.type === 'html') sec_html(p, section, sectionlist, index, depth, null, div);
            else if (section.type === 'figure') sec_figure(p, section, sectionlist, index, depth, null, div);
            else if (section.type === 'definitions') {
                defdiv = sec_definitions(section);
                placeholders.push(defdiv);
                div.appendChild(defdiv);
            }

            if (section.sections != undefined && section.sections != null) {
                for (var i = 0; i < section.sections.length; i++) {
                    render_sec(p, section.sections[i], section.sections, i, depth + 1, div);
                }
            }

            return div;
        }

        function renderSections(p, sections, target) {
            var div = document.createElement('div');
            target.appendChild(div);

            for (var i = 0; i < sections.length; i++) {
                render_sec(p, sections[i], sections, i, 0, div);
            }

            placeholders.push(div);
            return div;
        };

        function call_data(req, callback) {
            if (req.running == true || req.ready == true) return;

            var u = req;
            var uri = prepURL(u.url, u.filter);

            // Make sure no unresolved substitutions in URL.
            if (uri.indexOf('$') != -1) {
                req.ready = true;

                if (data == null) data = new Array();
                data[u.id] = u;
                if (u.listeners != undefined) for (var i = 0; i < u.listeners.length; i++) u.listeners[i](data[u.id]);
                if (callback != undefined) callback();
                return;
            }

            u.running = true;

            var daocreator = _params.dao[u.type];
            
            if(daocreator) {
                daocreator(uri, function(dao) {
                    if (data == null) data = new Array();

                    data[u.id] = data[u.id] || {};
                    data[u.id].dao = dao;
                    data[u.id].apiUrl = uri;

                    // Notify that data is ready
                    u.running = false;
                    u.ready = true;
                    if (u.listeners != undefined) for (var i = 0; i < u.listeners.length; i++) u.listeners[i](data[u.id]);
                    if (callback != undefined) callback();
                }, { labelSubstitutions: u.substitute, onError: function(msg) {} });
            }
            else console.log('Error: no DAO support for ' + u.type);
        }

        function call_html(req, callback) {
            if (req.running == true || req.ready == true) return;

            var u = req;
            var uri = prepURL(u.url);
            u.running = true;

            $.get(uri, function (d) {
                if (data == null) data = new Array();
                data[u.id] = {
                    html: d
                };

                // Notify that data is ready
                u.running = false;
                u.ready = true;
                if (u.listeners != undefined) for (var i = 0; i < u.listeners.length; i++) u.listeners[i](data[u.id]);
                if (callback != undefined) callback();
            }, 'html');
        }

        function subsURLprop(url, filter) {
            if (filter) {
                var keys = Object.keys(filter);
                for (var k = 0; k < keys.length; k++) {
                    var key = keys[k];
                    var a = filter[key];

                    var s = '';

                    if (nomisUI.util.isArray(a)) {
                        for (var i = 0; i < a.length; i++) {
                            if (i > 0) s += ',';
                            s += getconfigval(a[i]);
                        }
                    }
                    else s += getconfigval(a);

                    url = url.replace('$' + key, s);
                }
            }

            return url;
        }

        function prepURL(url, filter) {
            url = subsURLprop(url, filter);
            url = subsURLprop(url, _params.config);
            url += ((url.indexOf('?') > -1)? '&' : '?') + '_=' + url_randomizer;
            return url;
        }

        function addListener(p, dataId, listener, pos) {
            var src = findDatasource(p, dataId);
            if (src.listeners == undefined) src.listeners = new Array();
            if (src.pos == undefined) src.pos = pos;
            else if (src.pos() > pos()) src.pos = pos;
            src.listeners.push(listener);
        }

        function getDataForSource(u, callback) {
            if (u.type === 'html') call_html(u, callback); // Special case for HTML as type isn't really "data" in the DAO sense
            else call_data(u, callback); // All other types of data should use a DAO
        }

        function render(p) {
            renderSections(p, profile.sections, profile_tgt);
        }

        function checkWinFold() {
            var h = win.scrollTop() + win.height();

            var url = profile.datasources;

            for (var i = 0; i < url.length; i++) {
                var pos = url[i].pos;
                if (pos != undefined) {
                    if (h >= pos()) getDataForSource(url[i]);
                }
            }
        }

        function getAllData() {
            var url = profile.datasources;

            for (var i = 0; i < url.length; i++) {
                var pos = url[i].pos;
                if (pos != undefined) {
                    getDataForSource(url[i]);
                }
            }
        }

        function initAnchors(section, path) {
            path = path || 'section'

            section.anchor = path;

            if (section.sections) {
                section.sections.map(function (s, i) {
                    initAnchors(s, path + '_' + i);
                });
            }
        }

        function init() {
            // Clone the profile
            profile = JSON.parse(JSON.stringify(_params.profile));

            // Place the substituition block into each data source
            if (_params.config.substitute) {
                if (profile.datasources && profile.datasources) {
                    profile.datasources.map(function (d) {
                        // Need to merge
                        if (d.substitute) {
                            for (var property in _params.config.substitute) {
                                if (d.substitute.hasOwnProperty(property)) {
                                    _params.config.substitute[property].map(function (m) {
                                        d.substitute[property].push(m); // Add these substitutions to list
                                    });
                                }
                                else d.substitute[property] = _params.config.substitute[property]; // Not defined so set all
                            }
                        }
                        else d.substitute = _params.config.substitute; // All
                    });
                }
            }

            initAnchors(profile);

            // Reset counters
            renderedsecs = 0;
            renderedsecscomplete = 0;
            mapnum = 0;

            initCustomVariables();

            // Get started
            if (_params.lazyload == true) {
                setTimeout(function () {
                    render(profile); // Initial render of document skeleton, this also binds callback functions to datasources.
                    checkWinFold(); // Pull initial query data for visible content

                    win.scroll(checkWinFold);
                    win.resize(checkWinFold);
                }, 0);
            }
            else {
                render(profile);
                getAllData();
            }
        }

        init();

        return {
            remove: removeProfile,
            refresh: refreshProfile,
            redraw: redrawProfile,
            params: getParams
        };
    }

    return {
        create: createProfile
    };
} ();