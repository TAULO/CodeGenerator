// var types = [
// 	'scene', 
// 	'action', 
// 	'character', 
// 	'dialogue', 
// 	'parenthetical', 
// 	'transition', 
// 	'shot', 
// 	'text'
// ];
// var nextTypes = {
// 	scene: 'action',
// 	action: 'action',
// 	character: 'dialogue',
// 	dialogue: 'character',
// 	parenthetical: 'dialogue',
// 	transition: 'scene',
// 	shot: 'action',
// 	text: 'text'
// };

var types = [
	'general', 
	'scene',
	'action',
	'character',
	'dialogue',
	'parenthetical',
	'transition',
	'shot',
	'cast_list',
	'new_list',
	'end_of_act'
];
var nextTypes = {
	general: 'general',
	scene: 'action',
	action: 'character',
	character: 'dialogue',
	dialogue: 'character',
	parenthetical: 'character',
	transition: 'scene',
	shot: 'action',
	cast_list: 'cast_list',
	new_list: 'scene',
	end_of_act: 'action',
}
var typeButtonStr = {
	general: 'General',
	scene: 'Scene Heading',
	action: 'Action',
	character: 'Character',
	dialogue: 'Dialogue',
	parenthetical: 'Parenthetical',
	transition: 'Transition',
	shot: 'Shot',
	cast_list: 'Cast List',
	new_list: 'New List',
	end_of_act: 'End of Act',
}
var StopPropagationMixin = {
	stopProp: function(event) {
		event.nativeEvent.stopImmediatePropagation();
	},
};
function cursorPos(element) {
	var caretOffset = 0;
	var doc = element.ownerDocument || element.document;
	var win = doc.defaultView || doc.parentWindow;
	var sel;
	if (typeof win.getSelection != "undefined") {
		sel = win.getSelection();
		if (sel.rangeCount > 0) {
			var range = win.getSelection().getRangeAt(0);
			var preCaretRange = range.cloneRange();
			preCaretRange.selectNodeContents(element);
			preCaretRange.setEnd(range.endContainer, range.endOffset);
			caretOffset = preCaretRange.toString().length;
		}
	} else if ( (sel = doc.selection) && sel.type != "Control") {
		var textRange = sel.createRange();
		var preCaretTextRange = doc.body.createTextRange();
		preCaretTextRange.moveToElementText(element);
		preCaretTextRange.setEndPoint("EndToEnd", textRange);
		caretOffset = preCaretTextRange.text.length;
	}
	return caretOffset;
};

function placeCaretAtEnd(el) {
	el.focus();
	if (typeof window.getSelection != "undefined"
			&& typeof document.createRange != "undefined") {
		var range = document.createRange();
		range.selectNodeContents(el);
		range.collapse(false);
		var sel = window.getSelection();
		sel.removeAllRanges();
		sel.addRange(range);
	} else if (typeof document.body.createTextRange != "undefined") {
		var textRange = document.body.createTextRange();
		textRange.moveToElementText(el);
		textRange.collapse(false);
		textRange.select();
	}
}

function S4() {
   return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
}
function guid() {
   return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}



var Navbar = React.createClass({displayName: 'Navbar',
	mixins: [ReactFireMixin, ReactRouter.State],
	getInitialState: function(){
		return {
			script: {},
			setScript: this.setScript.bind(this),
		};
	},
	componentWillMount: function() {
		this.loadScript();
	},
	componentWillReceiveProps: function() {
		this.loadScript();
	},
	loadScript: function() {
		if (this.firebaseRefs.script) this.unbind('script');
		this.bindAsObject(new Firebase("https://screenwrite.firebaseio.com/"+this.getParams().scriptId), "script");	
		// CLEANUP OLD DATA
		var fb = new Firebase("https://screenwrite.firebaseio.com/"+this.state.scriptId);
		console.log(this.state.scriptId);
		fb.once('value', (function(snapshot){
			if (!snapshot.val()) {
				fb.set({});
				var newLine = fb.child('lines').push({ type: 'scene' });
				fb.update({ firstLine: newLine.key() });
				return;
			}
			if (snapshot.val().firstLine) return;
			var previous, previousIndex;
			fb.update({firstLine: '0'});
			_.each(snapshot.val().lines, function(line, index) {
				if (previous) {
					fb.child('lines/'+previousIndex+'/next').set(index);
				}
				previous = line;
				previousIndex = index;
			});
		}).bind(this));

		window.onunload = (function(){
			if (_.keys(this.state.script.lines).length <= 2)
				fb.remove();
		}).bind(this);
	},
	setScript: function(extension, result){

		console.log(extension);
		
		var exts = ['html', 'xml', 'pdf'];
		if(exts.indexOf(extension) == -1){
			alert('Import file correctly');
			return;
		}

		if (this.firebaseRefs.script) this.unbind('script');
		var scriptId = new Date().getTime();
		var doc;
		var type = 'text/' + extension;
		var doc = new DOMParser().parseFromString(result, type);
		
		// console.log(doc);

		var lines;
		if(extension == 'html')
			lines = doc.getElementsByTagName('li')
		else if(extension == 'xml')
			lines = doc.getElementsByTagName('element');

		// console.log(lines); 
		
		this.bindAsObject(new Firebase('https://screenwrite.firebaseio.com/' + scriptId), 'script');
		var fb = new Firebase('https://screenwrite.firebaseio.com/' + scriptId);
		// var fb = new Firebase('https://screenwrite.firebaseio.com/');
		// var newRef = fb.push();

		fb.once('value',(function(snapshot){	
			// console.log('once value ');
			var length = lines.length;
			// var length = 10;
			
			console.log(length);

			fb.set({});
			var newLine = fb.child('lines').push({type:'scene', text: new Date().toLocaleDateString()});
			fb.update({firstLine: newLine.key()});

			var previous = newLine, previousIndex = newLine.key();

			var type, value, line;
			for(var i = 0; i < length; i++){

				if(extension == 'html'){
					type = lines[i].getAttribute('type');
					value = lines[i].firstElementChild.innerHTML;
				}else if(extension == 'xml'){
					// type = lines[i].getElementsByTagName('type')[0].nodeValue;
					// value = lines[i].getElementsByTagName('value')[0].nodeValue;
					type = lines[i].getElementsByTagName('type')[0].innerHTML;
					value = lines[i].getElementsByTagName('value')[0].innerHTML;
					// console.log(type, value);
					// console.log(lines[i].getElementsByTagName('type')[0].innerHTML);
				}

				line = fb.child('lines').push({type: type, text: value});
				var index = line.key();
				if(previous){
					fb.child('lines/'+previousIndex+'/next').set(index);
				}
				previous = line;
				previousIndex = index;
			}
		}).bind(this));
		window.location.hash = '#/' + scriptId;
	},

	import: function(event) {
		
		var reader = new FileReader;
		var self = this;
		
		var extension;
		reader.onload = function(){
			self.setScript(extension, this.result);
 		}
		if(event.target.files.length > 0){
			var file = event.target.files[0];	
			extension = file.name.split('.').pop();
			reader.readAsText(file);
		}
	},
	download: function(strData, strFileName, strMimeType){
		var D = document,
	        A = arguments,
	        a = D.createElement("a"),
	        d = A[0],
	        n = A[1],
	        t = A[2] || "text/plain";

	    //build download link:
	    a.href = "data:" + strMimeType + "charset=utf-8," + escape(strData);


	    if (window.MSBlobBuilder) { // IE10
	        var bb = new MSBlobBuilder();
	        bb.append(strData);
	        return navigator.msSaveBlob(bb, strFileName);
	    } /* end if(window.MSBlobBuilder) */



	    if ('download' in a) { //FF20, CH19
	        a.setAttribute("download", n);
	        a.innerHTML = "downloading...";
	        D.body.appendChild(a);
	        setTimeout(function() {
	            var e = D.createEvent("MouseEvents");
	            e.initMouseEvent("click", true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
	            a.dispatchEvent(e);
	            D.body.removeChild(a);
	        }, 66);
	        return true;
	    }; /* end if('download' in a) */



	    //do iframe dataURL download: (older W3)
	    var f = D.createElement("iframe");
	    D.body.appendChild(f);
	    f.src = "data:" + (A[2] ? A[2] : "application/octet-stream") + (window.btoa ? ";base64" : "") + "," + (window.btoa ? window.btoa : escape)(strData);
	    setTimeout(function() {
	        D.body.removeChild(f);
	    }, 333);
	    return true;
	},
	readCssFile: function(){
		var fileReader = new FileReader();
		fileReader.onload = function() {
			console.log(this.result);
		//   var o = JSON.parse(this.result);
		  //Object.assign(localStorage, o);   // use this with localStorage
		//   alert("done, myKey=" + o["myKey"]); // o[] -> localStorage.getItem("myKey")
		};
		fileReader.readAsText(new File([],'style.css'));
	},
	makeXml: function(){
		// let authors = this.state.script["authors"];
		// let leftAddress = this.state.script["leftAddress"];
		// let rightAddress = this.state.script["rightAddress"];
		// let title = this.state.script["title"];
		let lines = this.state.script["lines"];
		let firstLine = this.state.script["firstLine"]
		let xmlbody = "<?xml version=\"1.0\" encoding=\"utf-8\"?><!DOCTYPE base>\n<base>\n";
		// xmlbody = xmlbody + "<element>\n" + "<type>\n" + "title\n" + "</type>\n" + "<value>\n" + title + "\n</value>\n" + "</element>\n";
		// xmlbody = xmlbody + "<element>\n" + "<type>\n" + "authors\n" + "</type>\n" + "<value>\n" + authors + "\n</value>\n" + "</element>\n";
		// xmlbody = xmlbody + "<element>\n" + "<type>\n" + "leftAddress\n" + "</type>\n" + "<value>\n" + leftAddress + "\n</value>\n" + "</element>\n";
		// xmlbody = xmlbody + "<element>\n" + "<type>\n" + "rightAddress\n" + "</type>\n" + "<value>\n" + rightAddress + "\n</value>\n" + "</element>\n";

		while(firstLine != undefined)
		{
			let line = lines[firstLine];
			firstLine = line["next"];
			let type = line["type"];
			xmlbody = xmlbody + "<element>\n" + "<type>\n" + type + "\n</type>\n" + "<value>\n" + line["text"] + "\n</value>\n";
			if(line["comment"] != undefined)
			{
				xmlbody = xmlbody + "<comment>\n" + line["comment"] + "\n</comment>\n";
			}
			xmlbody = xmlbody + "</element>\n"
		}
		xmlbody += "</base>";
		return xmlbody;
	},
	export2html: function(){
		console.log('print as html');
		// var html = '';
		var html = '<html>' + 
					'<head>' +
					'<title>Screenwriter: ttttt</title>' +
					'<meta name="viewport" content="initial-scale=1, maximum-scale=1">' +
					
					'<link rel="stylesheet" href="bower_components/bootstrap/dist/css/bootstrap.min.css">' +
					'<link rel="stylesheet" href="styles.css">' +
					'<link rel="stylesheet" href="print.css">' +
					'</head>' +
					'<body>' +
					'<div id="container" class="container">' +
						'<div data-reactid=".0">' +
						'<div data-reactid=".0.0">' +
					
							'<header class="" data-reactid=".0.0.1">' +
							'<p class="uppercase" data-reactid=".0.0.1.0"></p>' +
							'<h1>ttttt</h1>' +
							'<p data-reactid=".0.0.1.2"></p>' +
							'<span data-reactid=".0.0.1.3"></span>' +
							'<address class="text-left" data-reactid=".0.0.1.4"></address>' +
							'<address class="text-right" data-reactid=".0.0.1.5"></address>' +
							'</header>' +
						'</div>' +
						'<ul class="script" data-reactid=".0.1">';
		var script = this.state.script;
		
		console.log(script);
		Object.keys(script).forEach(function(key){
			var type = typeof(script[key]);
			// console.log(key);
			if(type == 'string'){
				console.log('type is string');
				// html += '<li>';
				// html += key + ':' + script[key];
				// html += '</li>'
			}else if(type == 'object'){
				Object.keys(script[key]).forEach(function(id){
					var line = script[key][id];
					html += '<li class="line ' + line['type'] +  '" type = "'+ line['type'] + '" >' +
								'<div class="line-text" contenteditable="true" data-reactid=".0.1.$-MkKJ604grNQVI7okL_I.0">' + line['text'] + '</div>' +
								'<a class="comment-add" data-reactid=".0.1.$-MkKJ604grNQVI7okL_I.1">' +
									'<i class="glyphicon glyphicon-comment" data-reactid=".0.1.$-MkKJ604grNQVI7okL_I.1.0"></i>' +
								'</a>' +
							'</li>';

				})
			}
		})
		html += 		'</ul>' +
					'</div>' +
				'</div>' +
			'</body>' +
			'</html>';
		
		this.download(html,(new Date().getTime())+'.html','application/octet-stream');
	},
	export2xml: function(){
		let data = this.makeXml();
		// console.log(data);
		this.download(data,(new Date().getTime())+'.xml','application/octet-stream');
	},
	export2pdf: function(){
		window.print();
	},
	newScript: function(){
		var fb = new Firebase("https://screenwrite.firebaseio.com/");
		var newRef = fb.push();

		// console.log(fb, newRef);
		window.location.hash = '#/' + newRef.key();
		window.location.reload(); // force firebase to reload
	},
	
	render: function() {
		return (
			
			React.createElement('nav', {className: 'navbar navbar-inverse'},
					React.createElement('div', {className: 'container-fluid'}, 
						React.createElement('div', {className: 'navbar-header'},
							React.createElement('a', {className: 'navbar-brand', href: '#'}, 'ScreenWriter')
						),
						
						React.createElement('div', {style: {position: 'absolute', right: '20px'}},
							React.createElement('ul', {className: 'nav navbar-nav'},
								React.createElement('ul', {className: 'nav navbar-nav'},
									React.createElement('li', {className: 'dropdown'},
										React.createElement('a', {onClick: this.newScript.bind(this)},
											'New Script '
											),
										)
									),
								React.createElement('li', {className: 'dropdown'},
									React.createElement('a', {className: 'dropdown-toggle', 'data-toggle': 'dropdown'},
										'Import ',
									React.createElement('span', {className: 'caret'}, '')
								),

								React.createElement('ul', {className: 'dropdown-menu'},
									React.createElement("li", null, 
										React.createElement('a',null,
											React.createElement('label', {className:'custom-file-upload', htmlFor:'file-upload'},'HTML'),
											React.createElement('input',{type: 'file', id: 'file-upload', accept: '*.html', onChange: this.import.bind(this)}),
										)
									),
									React.createElement("li", null, 
										React.createElement('a', null, 
											React.createElement('label', {className:'custom-file-upload', htmlFor:'file-upload'},'XML'),
											React.createElement('input',{type: 'file', id: 'file-upload', accept: '*.xml', onChange: this.import.bind(this)}),
										)
									),
									React.createElement("li", null, 
										React.createElement('a', null, 
											React.createElement('label', {className:'custom-file-upload', htmlFor:'file-upload'},'PDF'),
											React.createElement('input',{type: 'file', id: 'file-upload', accept: '*.pdf', onChange: this.import.bind(this)}),
										)
									),
								)
								)
							),

						// React.createElement('ul', {className: 'nav navbar-nav'},
						// 	React.createElement("li", null, 
						// 		React.createElement('label', {className:'custom-file-upload', htmlFor:'file-upload'},'Import'),
						// 		React.createElement('input',{type: 'file', id: 'file-upload', onChange: this.import.bind(this)}),
						// 	),
						// ),

						React.createElement('ul', {className: 'nav navbar-nav'},
							React.createElement('li', {className: 'dropdown'},
								React.createElement('a', {className: 'dropdown-toggle', 'data-toggle': 'dropdown'},
									'Export ',
								React.createElement('span', {className: 'caret'}, '')
							),

							React.createElement('ul', {className: 'dropdown-menu'},
								React.createElement('li',null,
									React.createElement('a',{onClick: this.export2html.bind(this)}, 'HTML'),
									React.createElement('a',{onClick: this.export2xml.bind(this)}, 'XML'),
									React.createElement('a',{onClick: this.export2pdf.bind(this)}, 'PDF'),
								)
							)
							)
						),
					)
				)
			)
		)
	}
})

// var Navbar = React.createClass({displayName: 'Navbar',
// 	mixins: [],
// 	getInitialState: function(){
// 		return {};
// 	},
// 	render: function() {
// 		return (
// 			React.createElement('div',{className: 'navbar navbar-inverse'},
// 				React.createElement('div',{className: 'container-fluid'},
// 					React.createElement('div', {className: 'navbar-header'}, 
// 						React.createElement('a', {className: 'navbar-brand', href: '#'}, 'ScreenWriter')
// 					)
// 				)
// 			)
// 			// <div class ='navbar navbar-inverse'>
// 			// 	<div class="container-fluid">
// 			// 		<div class="navbar-header">
// 			// 			<a class="navbar-brand" href="#">ScreenWriter</a>
// 			// 		</div>
// 			// 	</div>
// 			// </div>
// 		)
// 	}
// })
var Page = React.createClass({displayName: 'page',

	render(){
		let cm = [...Array(9).keys()];
		let mm = [...Array(10).keys()];
		return (
			React.createElement('div',{style: {width: '816px', margin: 'auto'}},
					React.createElement('div',{className: 'ruler'},
						cm.map(() => {
							return React.createElement('div', {className: 'cm'},
								mm.map(()=>{
									return React.createElement('div', {className: 'mm'});
								})
							);
						}),
					),
					React.createElement("ul", {className: "script", style: {height: '1056px'}}, lines)
				)
		)
	}
})
var Script = React.createClass({displayName: "Script",
	mixins: [ReactFireMixin, ReactRouter.State],
	getInitialState: function() {
		highlight = '';

		return {
			scriptId: this.getParams().scriptId,
			action: this.getParams().action,
			script: {},
			editing: {}
		};
	},
	componentWillMount: function() {
		this.loadScript();
	},
	componentWillReceiveProps: function() {
		this.loadScript();
	},
	loadScript: function() {
		if (this.firebaseRefs.script) this.unbind('script');
		this.bindAsObject(new Firebase("https://screenwrite.firebaseio.com/"+this.getParams().scriptId), "script");	
		// CLEANUP OLD DATA
		var fb = new Firebase("https://screenwrite.firebaseio.com/"+this.state.scriptId);
		console.log(this.state.scriptId);
		fb.once('value', (function(snapshot){
			console.log(snapshot.val());
			if (!snapshot.val()) {
				fb.set({});
				var newLine = fb.child('lines').push({ type: 'scene' });
				fb.update({ firstLine: newLine.key() });
				return;
			}
			if (snapshot.val().firstLine) return;
			var previous, previousIndex;
			fb.update({firstLine: '0'});
			_.each(snapshot.val().lines, function(line, index) {
				if (previous) {
					fb.child('lines/'+previousIndex+'/next').set(index);
				}
				previous = line;
				previousIndex = index;
			});
		}).bind(this));

		window.onunload = (function(){
			if (_.keys(this.state.script.lines).length <= 2)
				fb.remove();
		}).bind(this);
	},
	editing: function(line) {
		this.setState({editing:line});
	},
	getSuggestion: function(lineIndex, fromValue) {
		if (!this.state.script.lines[lineIndex].text) return '';
		var type = this.state.script.lines[lineIndex].type;
		var text = fromValue && fromValue.toUpperCase() || this.state.script.lines[lineIndex].text.toUpperCase();

		var suggestions = [];
		var passed = false;
		var iterate = (function(index){
			var line = this.state.script.lines[index];
			if (line.type == type
				&& line.text
				&& line.text.length > text.length
				&& line.text.toUpperCase().indexOf(text) === 0)
				suggestions.push(line.text.toUpperCase());
			if (index == lineIndex)
				passed = true;
			if (passed && suggestions.length) return;
			if (line.next)
				iterate(line.next);
		}).bind(this);
		iterate(this.state.script.firstLine);
		return (suggestions.pop() || '').substr(text.length);
	},
	handleKey: function(event, line, index, prevIndex, prevPrevIndex) {
		// console.log(line);console.log(event.keyCode);
		///222
		// console.log('second handle key');
		// placeCaretAtEnd(this.refs.text.getDOMNode());
		switch (event.keyCode) {
			case 38: // up
				if (prevIndex) {
					if (event.metaKey || event.ctrlKey) {
						// [a, b, C, d] => [a, C, b, d]
						// A points to C
						if (prevPrevIndex)
							this.firebaseRefs.script.child('lines/'+prevPrevIndex).update({next: index});
						else
							this.firebaseRefs.script.update({firstLine:index});
						// C points to B
						var newNext = line.next;
						this.firebaseRefs.script.child('lines/'+index).update({next: prevIndex });
						// B points to D
						if (line.next)
							this.firebaseRefs.script.child('lines/'+prevIndex).update({next: newNext });
						else
							this.firebaseRefs.script.child('lines/'+prevIndex+'/next').remove();
						this.refs['line'+index].focus(true);
						event.preventDefault();
					} else if (!cursorPos(event.target)) {
						this.refs['line'+prevIndex].focus(true);
						event.preventDefault();
					}
				}
				break;
			case 40: // down
				if (line.next) {
					
					if (event.metaKey || event.ctrlKey) {
						// [a, b, c, d] => [a, c, b, d]

						// A points to C
						if (prevIndex)
							this.firebaseRefs.script.child('lines/'+prevIndex).update({next: line.next});
						else
							this.firebaseRefs.script.update({firstLine:line.next});
						var newNext = this.state.script.lines[line.next].next;
						// C points to B
						this.firebaseRefs.script.child('lines/'+line.next).update({next: index});
						// B points to D
						if (newNext)
							this.firebaseRefs.script.child('lines/'+index).update({ next: newNext });
						else
							this.firebaseRefs.script.child('lines/'+index+'/next').remove();
						this.refs['line'+index].focus();
						event.preventDefault();
					} else if (cursorPos(event.target) >= event.target.textContent.length ) {
						this.refs['line'+line.next].focus();
						event.preventDefault();
					}
				}
				break;
			case 8: // backspace
				if (!line.text && prevIndex) {
					// update previous line
					if (line.next)
						this.firebaseRefs.script.child('lines/'+prevIndex).update({next:line.next});
					else
						this.firebaseRefs.script.child('lines/'+prevIndex+'/next').remove();

					// remove line
					this.firebaseRefs.script.child('lines/'+index).remove();
					this.refs['line'+prevIndex].focus(true);
					event.preventDefault();
				}
				break;
			case 13: // enter
				if (line.text) {
					// create new line pointing to current line's `next`

					var newItem = { type: nextTypes[line.type] };
					if (line.next) newItem.next = line.next;
					newRef = this.firebaseRefs.script.child('lines').push(newItem);
					// point current line to the new line
					this.firebaseRefs.script.child('lines/'+index+'/next').set(newRef.key());
					setTimeout((function(){
						this.refs['line'+newRef.key()].focus();
					}).bind(this));
				}
		}
		// placeCaretAtEnd(this.refs.text.getDOMNode());
	},
	setScript: function(extension, result){

		console.log(extension);
		
		var exts = ['html', 'xml', 'pdf'];
		if(exts.indexOf(extension) == -1){
			alert('Import file correctly');
			return;
		}

		if (this.firebaseRefs.script) this.unbind('script');
		var scriptId = new Date().getTime();
		var doc;
		var type = 'text/' + extension;
		var doc = new DOMParser().parseFromString(result, type);
		
		// console.log(doc);

		var lines;
		if(extension == 'html')
			lines = doc.getElementsByTagName('li')
		else if(extension == 'xml')
			lines = doc.getElementsByTagName('element');

		// console.log(lines); 
		
		this.bindAsObject(new Firebase('https://screenwrite.firebaseio.com/' + scriptId), 'script');
		var fb = new Firebase('https://screenwrite.firebaseio.com/' + scriptId);
		// var fb = new Firebase('https://screenwrite.firebaseio.com/');
		// var newRef = fb.push();

		fb.once('value',(function(snapshot){	
			// console.log('once value ');
			var length = lines.length;
			// var length = 10;
			
			console.log(length);

			fb.set({});
			var newLine = fb.child('lines').push({type:'scene', text: new Date().toLocaleDateString()});
			fb.update({firstLine: newLine.key()});

			var previous = newLine, previousIndex = newLine.key();

			var type, value, line;
			for(var i = 0; i < length; i++){

				if(extension == 'html'){
					type = lines[i].getAttribute('type');
					value = lines[i].firstElementChild.innerHTML;
				}else if(extension == 'xml'){
					// type = lines[i].getElementsByTagName('type')[0].nodeValue;
					// value = lines[i].getElementsByTagName('value')[0].nodeValue;
					type = lines[i].getElementsByTagName('type')[0].innerHTML;
					value = lines[i].getElementsByTagName('value')[0].innerHTML;
					// console.log(type, value);
					// console.log(lines[i].getElementsByTagName('type')[0].innerHTML);
				}

				line = fb.child('lines').push({type: type, text: value});
				var index = line.key();
				if(previous){
					fb.child('lines/'+previousIndex+'/next').set(index);
				}
				previous = line;
				previousIndex = index;
			}
		}).bind(this));
		window.location.hash = '#/' + scriptId;
	},
	render: function() {
		var indexes = {};
		var lines = [];
		var previous = null, prevPrevious = null;
		var next = (function(line, index){
			lines.push(
				React.createElement(Line, {line: line, key: index, index: index, ref: 'line'+index, 
					previous: previous, prevPrevious: prevPrevious, 
					onFocus: this.editing.bind(this, index), 
					getSuggestion: this.getSuggestion, 
					readonly: this.state.action == 'view', 
					onKeyDown: this.handleKey})
			);
			prevPrevious = previous;
			previous = index;
			if (line.next) next(this.state.script.lines[line.next], line.next);
		}).bind(this);

		if (this.state.script && this.state.script.lines && this.state.script.firstLine) {
			next(this.state.script.lines[this.state.script.firstLine], this.state.script.firstLine);
		} else {
			lines = React.createElement("h1", {className: "text-center"}, "Loading Script...")
		}
		var cm = [...Array(9).keys()];
		var mm = [...Array(10).keys()];
		return (
			React.createElement("div", null, 
				React.createElement(Navbar,{}),
				React.createElement(Nav, {
					script: this.state.script, 
					editingIndex: this.state.editing, 
					readonly: this.state.action=='view',
					setScript: this.setScript.bind(this),
				}),
				React.createElement('div',{style: {width: '816px', margin: 'auto', marginBottom:'50px'}},
					React.createElement('div',{className: 'ruler'},
						cm.map(() => {
							return React.createElement('div', {className: 'cm'},
								mm.map(()=>{
									return React.createElement('div', {className: 'mm'});
								})
							);
						}),
					),
					React.createElement("ul", {className: "script", style: {height: '1056px', marginBottom: '20px'}}, lines)
				)
			)
		)
	}
});

var highlight = '';

var Line = React.createClass({displayName: "Line",
	mixins: [ReactFireMixin, StopPropagationMixin, ReactRouter.State],
	getInitialState: function() {
		return {
			comments: this.props.line.comments,
			commenting: false,
			scriptId: this.getParams().scriptId,
			focused: false,
		};
	},
	componentWillMount: function() {
		this.bindAsObject(new Firebase("https://screenwrite.firebaseio.com/"+this.state.scriptId+"/lines/" + this.props.index), "line");
	},
	handleChange: function(event) {
		//333
		// console.log('third handle change');
		this.firebaseRefs.line.update({'text':event.target.value});
		// placeCaretAtEnd(this.refs.text.getDOMNode());
	},
	handleComment: function(event) {
		this.firebaseRefs.line.update({'comment':event.target.value});
		
	},
	nextType: function(){
		var index = types.indexOf(this.props.line.type) + 1;
		index = (index < types.length) ? index : 0;
		this.setType(types[index]);
	},
	prevType: function() {
		var index = types.indexOf(this.props.line.type) - 1;
		index = (index >= 0) ? index : types.length - 1;
		this.setType(types[index]);
	},
	setType: function(type) {
		this.firebaseRefs.line.update({type:type});
	},
	handleKey: function(event) {
		//111
		// console.log('first handle key');
		// placeCaretAtEnd(this.refs.text.getDOMNode());
		switch (event.keyCode) {
			case 39: // right
				if (~['character', 'scene'].indexOf(this.props.line.type) && cursorPos(event.target) >= event.target.textContent.length) {
					var suggestion;
					if (suggestion = this.props.getSuggestion(this.props.index)) {
						this.firebaseRefs.line.update({ text: this.props.line.text + suggestion }, (function(){
							// placeCaretAtEnd(this.refs.text.getDOMNode());
						}).bind(this));
					}
				}
				break;
			case 13: // enter
				event.preventDefault();
				if (this.props.line.text) {
					break;
				}
			case 9: // tab
				event.preventDefault();
				if (event.shiftKey) {
					this.prevType();
				} else {
					this.nextType();
				}
		}
		
		this.props.onKeyDown(event, this.props.line, this.props.index, this.props.previous, this.props.prevPrevious);
		placeCaretAtEnd(this.refs.text.getDOMNode());
	},
	comment: function(event) {
		event.stopPropagation();
		this.setState({ commenting: !this.state.commenting }, function(){
			if (this.state.commenting) {
				var that = this;
				document.addEventListener('click', function listener(){
					that.setState({ commenting: false });
					document.removeEventListener('click', listener);
				});
				this.refs.commentBox.getDOMNode().focus();
			}
		});
	},
	focus: function(atEnd) {
		if (atEnd)
			placeCaretAtEnd(this.refs.text.getDOMNode());
		else
			this.refs.text.getDOMNode().focus();
	},
	onFocus: function(event) {
		this.setState({focused:true});
		this.props.onFocus(event);
	},
	onBlur: function(event) {
		this.setState({focused:false});
	},
	render: function() {
		var classes = {
			line: true,
			commented: this.props.line.comment,
			highlight: highlight && this.props.line.text && highlight.toUpperCase()==this.props.line.text.toUpperCase()
		};
		classes[this.props.line.type] = true;
		classes = React.addons.classSet(classes);

		var line, suggest;
		if (this.props.readonly) {
			line = React.createElement("div", {className: "line-text", dangerouslySetInnerHTML: {__html: this.props.line.text}});
		} else {
			if (this.state.focused) {
				suggest = this.props.getSuggestion(this.props.index);
			}

			line = React.createElement(ContentEditable, {
					ref: "text", 
					html: this.props.line.text, 
					onChange: this.handleChange, 
					onKeyDown: this.handleKey, 
					onFocus: this.onFocus, 
					onBlur: this.onBlur, 
					suggest: suggest, 
					className: "line-text"})
		}

		return (
			React.createElement("li", {className: classes}, 
				line, 
				React.createElement("a", {onClick: this.comment, className: "comment-add"}, 
					React.createElement("i", {className: "glyphicon glyphicon-comment"})
				), 

				this.state.commenting && React.createElement(ContentEditable, {
					ref: "commentBox", 
					onChange: this.handleComment, 
					onClick: this.stopProp, 
					className: "comment-box", 
					html: this.props.line.comment})
			)
		);
	}
});

var ContentEditable = React.createClass({displayName: "ContentEditable",
	stripPaste: function(e){
		// Strip formatting on paste
		var tempDiv = document.createElement("DIV");
		var item = _.findWhere(e.clipboardData.items, { type: 'text/plain' });
		item.getAsString(function (value) {
			tempDiv.innerHTML = value;
			document.execCommand('inserttext', false, tempDiv.innerText);
		});
		e.preventDefault();
	},
	emitChange: function(){
		var html = this.getDOMNode().innerHTML;
		if (this.props.onChange && html !== this.lastHtml) {

			this.props.onChange({
				target: {
					value: html
				}
			});
		}
		this.lastHtml = html;
	},
	render: function(){
		return React.createElement("div", {
			ref: "input", 
			onInput: this.emitChange, 
			onBlur: this.emitChange, 
			onKeyDown: this.props.onKeyDown, 
			onClick: this.props.onClick, 
			className: this.props.className, 
			onFocus: this.props.onFocus, 
			onBlur: this.props.onBlur, 
			onPaste: this.stripPaste, 
			"data-suggest": this.props.suggest, 
			contentEditable: true, 
			dangerouslySetInnerHTML: {__html: this.props.html}});
	}
});

var Nav = React.createClass({displayName: "Nav",
	mixins: [ReactFireMixin, StopPropagationMixin, ReactRouter.State],
	getInitialState: function() {
		return {
			open: null,
			script: {},
			scriptId: this.getParams().scriptId,
			highlight: '',
			printType:1,
			printTypes: ['HTML','XML','PDF'],
		};
	},
	componentWillMount: function() {
		this.bindAsObject(new Firebase("https://screenwrite.firebaseio.com/"+this.state.scriptId), "script");

		// window.fb = this.firebaseRefs;
	},
	toggle: function(dropdown, event) {
		var that = this;
		if (this.state.open != dropdown) {
			setTimeout((function(){
				document.addEventListener('click', function listener(){
					that.setState({ open: false });
					document.removeEventListener('click', listener);
				});
				this.setState({ open: dropdown });
			}).bind(this));
		}
	},
	setType: function(type) {
		if (!this.props.editingIndex) return;
		this.firebaseRefs.script.child('lines/'+this.props.editingIndex+'/type').set(type);
	},
	download: function(strData, strFileName, strMimeType){
		var D = document,
	        A = arguments,
	        a = D.createElement("a"),
	        d = A[0],
	        n = A[1],
	        t = A[2] || "text/plain";

	    //build download link:
	    a.href = "data:" + strMimeType + "charset=utf-8," + escape(strData);


	    if (window.MSBlobBuilder) { // IE10
	        var bb = new MSBlobBuilder();
	        bb.append(strData);
	        return navigator.msSaveBlob(bb, strFileName);
	    } /* end if(window.MSBlobBuilder) */



	    if ('download' in a) { //FF20, CH19
	        a.setAttribute("download", n);
	        a.innerHTML = "downloading...";
	        D.body.appendChild(a);
	        setTimeout(function() {
	            var e = D.createEvent("MouseEvents");
	            e.initMouseEvent("click", true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
	            a.dispatchEvent(e);
	            D.body.removeChild(a);
	        }, 66);
	        return true;
	    }; /* end if('download' in a) */



	    //do iframe dataURL download: (older W3)
	    var f = D.createElement("iframe");
	    D.body.appendChild(f);
	    f.src = "data:" + (A[2] ? A[2] : "application/octet-stream") + (window.btoa ? ";base64" : "") + "," + (window.btoa ? window.btoa : escape)(strData);
	    setTimeout(function() {
	        D.body.removeChild(f);
	    }, 333);
	    return true;
	},
	readCssFile: function(){
		var fileReader = new FileReader();
		fileReader.onload = function() {
			console.log(this.result);
		//   var o = JSON.parse(this.result);
		  //Object.assign(localStorage, o);   // use this with localStorage
		//   alert("done, myKey=" + o["myKey"]); // o[] -> localStorage.getItem("myKey")
		};
		fileReader.readAsText(new File([],'style.css'));
	},
	makeXml: function(){
		// let authors = this.state.script["authors"];
		// let leftAddress = this.state.script["leftAddress"];
		// let rightAddress = this.state.script["rightAddress"];
		// let title = this.state.script["title"];
		let lines = this.state.script["lines"];
		let firstLine = this.state.script["firstLine"]
		let xmlbody = "<?xml version=\"1.0\" encoding=\"utf-8\"?><!DOCTYPE base>\n<base>\n";
		// xmlbody = xmlbody + "<element>\n" + "<type>\n" + "title\n" + "</type>\n" + "<value>\n" + title + "\n</value>\n" + "</element>\n";
		// xmlbody = xmlbody + "<element>\n" + "<type>\n" + "authors\n" + "</type>\n" + "<value>\n" + authors + "\n</value>\n" + "</element>\n";
		// xmlbody = xmlbody + "<element>\n" + "<type>\n" + "leftAddress\n" + "</type>\n" + "<value>\n" + leftAddress + "\n</value>\n" + "</element>\n";
		// xmlbody = xmlbody + "<element>\n" + "<type>\n" + "rightAddress\n" + "</type>\n" + "<value>\n" + rightAddress + "\n</value>\n" + "</element>\n";

		while(firstLine != undefined)
		{
			let line = lines[firstLine];
			firstLine = line["next"];
			let type = line["type"];
			xmlbody = xmlbody + "<element>\n" + "<type>\n" + type + "\n</type>\n" + "<value>\n" + line["text"] + "\n</value>\n";
			if(line["comment"] != undefined)
			{
				xmlbody = xmlbody + "<comment>\n" + line["comment"] + "\n</comment>\n";
			}
			xmlbody = xmlbody + "</element>\n"
		}
		xmlbody += "</base>";
		return xmlbody;
	},
	export2html: function(){
		console.log('print as html');
		// var html = '';
		var html = '<html>' + 
					'<head>' +
					'<title>Screenwriter: ttttt</title>' +
					'<meta name="viewport" content="initial-scale=1, maximum-scale=1">' +
					
					'<link rel="stylesheet" href="bower_components/bootstrap/dist/css/bootstrap.min.css">' +
					'<link rel="stylesheet" href="styles.css">' +
					'<link rel="stylesheet" href="print.css">' +
					'</head>' +
					'<body>' +
					'<div id="container" class="container">' +
						'<div data-reactid=".0">' +
						'<div data-reactid=".0.0">' +
					
							'<header class="" data-reactid=".0.0.1">' +
							'<p class="uppercase" data-reactid=".0.0.1.0"></p>' +
							'<h1>ttttt</h1>' +
							'<p data-reactid=".0.0.1.2"></p>' +
							'<span data-reactid=".0.0.1.3"></span>' +
							'<address class="text-left" data-reactid=".0.0.1.4"></address>' +
							'<address class="text-right" data-reactid=".0.0.1.5"></address>' +
							'</header>' +
						'</div>' +
						'<ul class="script" data-reactid=".0.1">';
		var script = this.state.script
		console.log(script);
		Object.keys(script).forEach(function(key){
			var type = typeof(script[key]);
			// console.log(key);
			if(type == 'string'){
				console.log('type is string');
				// html += '<li>';
				// html += key + ':' + script[key];
				// html += '</li>'
			}else if(type == 'object'){
				Object.keys(script[key]).forEach(function(id){
					var line = script[key][id];
					html += '<li class="line ' + line['type'] +  '" type = "'+ line['type'] + '" >' +
								'<div class="line-text" contenteditable="true" data-reactid=".0.1.$-MkKJ604grNQVI7okL_I.0">' + line['text'] + '</div>' +
								'<a class="comment-add" data-reactid=".0.1.$-MkKJ604grNQVI7okL_I.1">' +
									'<i class="glyphicon glyphicon-comment" data-reactid=".0.1.$-MkKJ604grNQVI7okL_I.1.0"></i>' +
								'</a>' +
							'</li>';

				})
			}
		})
		html += 		'</ul>' +
					'</div>' +
				'</div>' +
			'</body>' +
			'</html>';
		
		this.download(html,(new Date().getTime())+'.html','application/octet-stream');
	},
	export2xml: function(){
		let data = this.makeXml();
		// console.log(data);
		this.download(data,(new Date().getTime())+'.xml','application/octet-stream');
	},
	print: function() {
		// console.log(ReactFireMixin);
		// window.print();
		var type = Number(this.state.printType);
		console.log(type);

		switch(type){
			case 1:
			this.export2html();
			break;
			case 2:
			// console.log('print as xml');
			this.export2xml();
			break;
			case 3:
				window.print();
			break;
			default:
		}
	},
	
	import: function(event) {
		
		var reader = new FileReader;
		var self = this;
		
		var extension;
		reader.onload = function(){
			// self.props.setScript(this.result);

			// var extension
			// console.log(this);
			// if(extension == 'html'){
			// 	self.importAsHtml(this.result);
			// }else if(extension == 'xml'){
			// 	self.importAsXml(this.result);
			// }else if(extension == 'pdf'){

			// }else{

			// }
			self.props.setScript(extension, this.result);
 		}
		// console.log(event.target.files[0].name.split('.').pop());
		
		if(event.target.files.length > 0){
			var file = event.target.files[0];	
			extension = file.name.split('.').pop();
			reader.readAsText(file);
		}
	},
	importAsHtml: function(result){

	},
	importAsXml: function(result){

	},
	highlight: function(event) {
		highlight = event.target.value;
		this.setState({highlight: event.target.value});
	},
	handleChange: function(input, event) {
		console.log('title change handle');
		console.log(event.target.value);
		this.firebaseRefs.script.child(input).set(event.target.value);
	},
	newScript: function(){
		var fb = new Firebase("https://screenwrite.firebaseio.com/");
		var newRef = fb.push();

		// console.log(fb, newRef);
		window.location.hash = '#/' + newRef.key();
		window.location.reload(); // force firebase to reload
	},
	setPrintType: function(event) {
		var value = event.target.value;
		console.log(value);
		if(value == 0) return;

		this.setState({printType: value});
	},
	render: function() {
		var printTypes = ['html', 'xml', 'pdf'];

		if (!this.state.script) return React.createElement("div", null);

		if (this.state.script.title)
			document.title = 'Screenwriter: ' + this.state.script.title;

		var editing = this.state.script.lines && this.state.script.lines[this.props.editingIndex] || {};
		if (this.state.open=='print') {
			var characters = [];
			_.each(_.uniq(_.map(_.pluck(_.where(this.state.script.lines, {type:'character'}), 'text'), function(character){
				return character && character.toUpperCase();
			})), function(character){
				if (character)
					characters.push(React.createElement("option", {key: character}, character))
			});
		}
		return (
			React.createElement("div", null, 
				React.createElement("div", {className: "navbar hidden-print", role: "navigation"}, 
					React.createElement("div", {className: ""}, 
						React.createElement("ul", {className: "nav navbar-nav btn-block row"}, 
							React.createElement("li", {className: "col-sm-12 col-xs-12 navbar-btn dropdown"}, 
								React.createElement("div", {className: "input-group", style: {margin: 'auto'}}, 
									types.map(function(type){
										return (React.createElement("a", {onClick: this.setType.bind(this, type), 
											key: type, 
											className: 'btn btn-primary btn-script-type '+(editing.type==type&&'active')}, 
											typeButtonStr[type]
										))
									}, this)
								), 
								
							), 
							
							
						)

					)
				), 
				// React.createElement("header", {className: "visible-print"}, 
				// 	React.createElement("p", {className: "uppercase"}, this.props.script.title), 
				// 	this.props.script.authors && React.createElement("p", null, "by"), 
				// 	React.createElement("p", null, this.props.script.authors), 
				// 	this.state.highlight && React.createElement("p", {className: "character-highlighted"}, "Character: ", this.state.highlight.toUpperCase()), 
				// 	React.createElement("address", {className: "text-left"}, this.props.script.leftAddress), 
				// 	React.createElement("address", {className: "text-right"}, this.props.script.rightAddress)
				// )
			)
		);
	}
});

// var Home = React.createClass({displayName: "Home",
// 	newScript: function(){
// 		var fb = new Firebase("https://screenwrite.firebaseio.com/");
// 		var newRef = fb.push();
// 		window.location.hash = '#/' + newRef.key();
// 		window.location.reload(); // force firebase to reload

// 		console.log('reloaded');
// 	},
// 	render: function() {
// 		var commentStyles = {
// 			color: '#dd0',
// 			textShadow: '0 1px 1px #000',
// 			fontSize: '120%'
// 		};
// 		return (
// 				React.createElement("div", null, 
// 					React.createElement(Navbar,{}),
// 					React.createElement("div", {className: "text-center"}, 

// 						React.createElement("h1", null, "Screenwriter"), 
// 						React.createElement("p", null, 
// 							React.createElement("a", {className: "btn btn-primary", onClick: this.newScript}, React.createElement("i", {className: "glyphicon glyphicon-plus"}), " New Script"), 
// 							" ", 
// 							React.createElement(Link, {className: "btn btn-primary", to: "/demo"}, "Demo Script")
// 						), 

// 						React.createElement("p", null, 
// 							React.createElement("a", {className: "btn btn-default", href: "https://github.com/ProLoser/screenwriter"}, React.createElement("img", {src: "github-icons/GitHub-Mark-32px.png", alt: "Github"}), " Source Code")
// 						)
// 					), 

// 					React.createElement("h3", null, "Collaborate:"), 
// 					React.createElement("p", null, "Share your custom URL with friends to collaborate or add ", React.createElement("code", null, "/view"), " to the end for ", React.createElement("strong", null, "readonly"), " mode!"), 

// 					React.createElement("h3", null, "Shortcuts:"), 
// 					React.createElement("p", null, 
// 						React.createElement("strong", null, "Enter"), " Insert new line", React.createElement("br", null), 
// 						React.createElement("strong", null, "(Shift+)Tab"), " Cycle through line types", React.createElement("br", null), 
// 						React.createElement("strong", null, "Up/Down"), " Move through lines", React.createElement("br", null), 
// 						React.createElement("strong", null, "Cmd/Ctrl+Up/Down"), " Reorder lines", React.createElement("br", null), 
// 						React.createElement("strong", null, "Right"), " Autocomplete the character or scene", React.createElement("br", null)
// 					), 

// 					React.createElement("h3", null, "Comments:"), 
// 					React.createElement("p", {className: "help"}, "Hover over a line and click comment button ", React.createElement("i", {className: "glyphicon glyphicon-comment", style: commentStyles})), 

// 					React.createElement("h3", null, "Notes:"), 
// 					React.createElement("p", null, "Scripts are not secure, if someone can figure out your URL, they can edit it. Print to PDF if you want a permanent copy.")
// 				)
// 		);
// 	}

// });

var Home = React.createClass({displayName: "Home",
	newScript: function(){
		var fb = new Firebase("https://screenwrite.firebaseio.com/");
		var newRef = fb.push();
		window.location.hash = '#/' + newRef.key();
		window.location.reload(); // force firebase to reload

		console.log('reloaded');
	},
	render: function() {
		var commentStyles = {
			color: '#dd0',
			textShadow: '0 1px 1px #000',
			fontSize: '120%'
		};
		return (
				React.createElement('div', null,
					React.createElement('div',{className: 'navbar navbar-inverse'},
						React.createElement('div',{className: 'container-fluid'},
							React.createElement('div', {className: 'navbar-header'}, 
								React.createElement('a', {className: 'navbar-brand', href: '#'}, 'ScreenWriter')
							)
						)
					),
					React.createElement("div", {className: "row container home"}, 

					React.createElement("h1", {className: "text-center"}, "Welcome To Screenwriter"),

					React.createElement("div", {className: "text-center"}, 
						React.createElement("a", {className: "btn btn-primary", onClick: this.newScript}, " New Script"), 
						"  ",
						React.createElement(Link, {className: "btn btn-primary", to: "/demo"}, "Demo Script")
					), 

					React.createElement("div", {className: "col-lg-3 col-md-6 col-sm-12 item-container"},
							React.createElement("h3", {className: "topics"}, "Collaborate"), 
							React.createElement("p", null, "Share your custom URL with friends to collaborate or add ", React.createElement("code", null, "/view"), " to the end for ", React.createElement("strong", null, "readonly"), " mode!"), 
					),

					React.createElement("div", {className: "col-lg-3 col-md-6 col-sm-12 item-container"},
						React.createElement("h3", {className: "topics"}, "Shortcuts"), 
						React.createElement("div", null, 
							React.createElement("strong", null, "Enter"), React.createElement("span", null, " Insert new line"), React.createElement("br", null), 
							React.createElement("strong", null, "(Shift+)Tab"), React.createElement("span", null, " Cycle through line types"), React.createElement("br", null), 
							React.createElement("strong", null, "Up/Down"), React.createElement("span", null, " Move through lines"), React.createElement("br", null), 
							React.createElement("strong", null, "Cmd/Ctrl+Up/Down"), React.createElement("span", null, " Reorder lines"), React.createElement("br", null), 
							React.createElement("strong", null, "Right"), React.createElement("span", null, " Autocomplete the character or scene"), React.createElement("br", null)
						), 
					),

					React.createElement("div", {className: "col-lg-3 col-md-6 col-sm-12 item-container"},
						React.createElement("h3", {className: "topics"}, "Comments"), 
						React.createElement("p", {className: "help"}, "Hover over a line and click comment button ", React.createElement("i", {className: "glyphicon glyphicon-comment", style: commentStyles})), 
					),

					React.createElement("div", {className: "col-lg-3 col-md-6 col-sm-12 item-container"},
						React.createElement("h3", {className: "topics"}, "Notes"), 
						React.createElement("span", null, "Scripts are not secure, if someone can figure out your URL, they can edit it. Print to PDF if you want a permanent copy.")
					),
				)
				)
		);
	}

});

var App = React.createClass({displayName: "App",
	render: function() {
		return React.createElement(RouteHandler, null);
	}
});

Route = ReactRouter.Route;
Link = ReactRouter.Link;
RouteHandler = ReactRouter.RouteHandler;
DefaultRoute = ReactRouter.DefaultRoute;
var routes = (
	React.createElement(Route, {handler: App}, 
		React.createElement(DefaultRoute, {handler: Home}), 
		React.createElement(Route, {name: "script", path: "/:scriptId", handler: Script}), 
		React.createElement(Route, {name: "scriptAction", path: "/:scriptId/:action", handler: Script})
	)
);

ReactRouter.run(routes, function (Handler) {
  React.render(React.createElement(Handler, null), document.getElementById('container'));
});