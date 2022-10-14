
window.SampleData = React.createClass( {
 mixins: [ SunFwMixinBase ],
 getDefaultProps: function() {
 return {
 id: '',
 };
 },
 getInitialState: function() {
 return {
 packages: [],
 actionToDo: '',
 processing: -1,
 lastInstalled: '',
 };
 },
 render: function() {
 var samples = [], action, className, title, label;
 this.state.packages.map( ( sample, index ) => {
 action = this.state.lastInstalled == sample.id ? 'uninstall' : 'install';
 className = 'thumbnail' + ( action == 'uninstall' ? ' active' : '' ); var buttons;
 if ( action == 'uninstall' ) {
 buttons = (
 <p>
 <a
 ref={ sample.id }
 href="#"
 title={ sunfw.text[ 'reinstall-sample' ].replace( '%s', sample.name ) }
 onClick={ this.install }
 className="btn btn-warning btn-sm reinstall-sample"
 data-index={ index }
 >
 { sunfw.text[ 'reinstall-label' ] }
 </a>
 <a
 ref={ sample.id }
 href="#"
 title={ sunfw.text[ 'uninstall-sample' ].replace( '%s', sample.name ) }
 onClick={ this.uninstall }
 className="btn btn-primary btn-sm uninstall-sample margin-left-10"
 data-index={ index }
 >
 { sunfw.text[ 'uninstall-label' ] }
 </a>
 </p>
 );
 } else {
 buttons = (
 <p>
 <a
 ref={ sample.id }
 href="#"
 title={ sunfw.text[ 'install-sample' ].replace( '%s', sample.name ) }
 onClick={ this.install }
 className="btn btn-primary btn-sm install-sample"
 data-index={ index }
 >
 { sunfw.text[ 'install-label' ] }
 </a>
 </p>
 );
 }
 samples.push(
 <div className="item">
 <div className="thumbnail">
 <a
 href={ sample.demo }
 title={ sunfw.text['preview-sample'].replace( '%s', sample.name ) }
 target="_blank"
 rel="noopener noreferrer"
 className={ className }
 >
 <span className="sunfw-loading-indicator">
 <i className="fa fa-circle-o-notch fa-3x fa-spin"></i>
 </span>
 <img src={ sample.thumbnail } alt={ sample.name } />
 </a>
 <div className="caption content-sample">
 <h3>{ sample.name }</h3>
 { buttons }
 </div>
 </div>
 </div>
 );
 } );
 return (
 <div
 id={ this.props.id }
 key={ this.props.id }
 ref="wrapper"
 className="sample-data"
 >
 <div className="jsn-main-content sample-data-item">
 <div className="container-fluid">
 <div className="row">
 <div className="items">
 { samples }
 </div>
 </div>
 </div>
 </div>
 <SunFwModal
 key={ this.props.id + '_modal' }
 ref="modal"
 parent={ this }
 editor={ this }
 buttons="disabled"
 centralize={ false }
 />
 </div>
 );
 },
 initActions: function() {
 if ( this.state.actionToDo == 'install' || this.state.actionToDo == 'uninstall' ) {
 var title, html;
 if ( this.state.actionToDo == 'install' ) {
 title = 'install-sample-data';
 html = (
 <SampleDataInstall
 id={ this.props.id + '_installer' }
 parent={ this }
 editor={ this }
 sample={ this.state.packages[ this.state.processing ] }
 />
 );
 } else {
 title = 'uninstall-sample-data';
 html = (
 <SampleDataUninstall
 id={ this.props.id + '_installer' }
 parent={ this }
 editor={ this }
 sample={ this.state.packages[ this.state.processing ] }
 />
 );
 } if ( ! this.refs.modal._listened_resize_event ) {
 var calculateModalHeight = function() {
 this.timeout && clearTimeout( this.timeout );
 this.timeout = setTimeout( function() {
 var header = this.refs.modal.refs.modal.querySelector( '.modal-header' ),
 body = this.refs.modal.refs.modal.querySelector( '.modal-body' );
 body.style.overflow = 'auto';
 body.style.maxHeight = (
 window.innerHeight - header.getBoundingClientRect().height - 60
 ) + 'px';
 }.bind( this ), 100 );
 }.bind( this );
 window.addEventListener( 'resize', calculateModalHeight );
 calculateModalHeight();
 this.refs.modal._listened_resize_event = true;
 }
 this.refs.modal.setState( {
 show: true,
 title: title,
 content: html
 } );
 }
 },
 install: function( event ) {
 event.preventDefault(); var idx = parseInt( event.target.getAttribute( 'data-index' ) );
 this.setState( {
 actionToDo: 'install',
 processing: idx,
 } );
 },
 uninstall: function( event ) {
 event.preventDefault(); var idx = parseInt( event.target.getAttribute( 'data-index' ) ),
 pkg = this.state.packages[ idx ];
 if ( this.state.lastInstalled == pkg.id ) {
 this.setState( {
 actionToDo: 'uninstall',
 processing: idx,
 } );
 }
 },
} );
window.SampleDataInstall = React.createClass( {
 mixins: [ SunFwMixinBase ],
 getDefaultProps: function() {
 return {
 sample: {},
 };
 },
 getInitialState: function() {
 return {
 step: 'confirm',
 installationType : 'sampledata',
 success: [],
 failure: {},
 confirmed: false,
 attention: [],
 installing: '',
 extensions: [],
 selectedPackage: '',
 ignoredExtension: {},
 showExtensionDesc: {},
 };
 },
 render: function() { if ( typeof this.hasUpdate == 'undefined' ) {
 var update_labels = document.querySelectorAll('.update-availabel');
 this.hasUpdate = false;
 for ( var i = 0, n = update_labels.length; i < n; i++ ) {
 if ( ! update_labels[ i ].classList.contains('sunfwhide') ) {
 this.hasUpdate = update_labels[ i ];
 break;
 }
 }
 }
 if ( this.hasUpdate ) {
 return (
 <div ref="wrapper" key={ this.props.id } id="install_sample_data_modal">
 <p>
 { sunfw.text['sample-data-unavailable-due-to-product-outdated'] }
 </p>
 <div className="modal-footer">
 <div className="actions">
 <button type="button" className="btn btn-primary" onClick={ function() {
 this.parent.refs.modal.close();
 jQuery(this.hasUpdate).find('a').trigger('click');
 }.bind( this ) }>
 { sunfw.text['update-product'] }
 </button>
 <button ref="close" type="button" onClick={ this.cancel } className="btn btn-default">
 { sunfw.text['cancel'] }
 </button>
 </div>
 </div>
 </div>
 );
 } var extensions = [];
 if ( this.hasError('extensions') == 'hidden' ) {
 this.total_extensions = 0;
 this.state.extensions.map( (ext) => {
 var children = []; if ( this.state.step != 'extensions' || this.state.installing != '' ) {
 if ( this.state.ignoredExtension[ ext.identifiedname ] ) {
 return;
 }
 }
 if ( ext.depends instanceof Array && ext.depends.length ) {
 ext.depends.map( ( child ) => {
 if ( child.state != 'installed' ) {
 children.push(
 <li className="extension">
 <label className="checkbox-inline extension-label title">
 <input
 ref={ child.identifiedname }
 type="checkbox"
 value={ child.identifiedname }
 checked={ this.state.ignoredExtension[ ext.identifiedname ] ? false : true }
 disabled="disabled"
 />
 { child.description }
 <span className={ 'fa fa-' + this.getIcon( child.identifiedname ) }></span>
 </label>
 <span className={ 'label label-' + ( child.state == 'install' ? 'success' : 'warning' ) + ( this.state.installing == '' ? '' : ' hidden' ) }>
 { sunfw.text[ child.state == 'install' ? 'new-installation' : 'update' ] }
 </span>
 <div ref={ child.identifiedname + '_progress' } className="progress hidden">
 <div className="progress-bar" role="progressbar">
 <span className="percentage">0%</span>
 </div>
 </div>
 <div ref={ child.identifiedname + '_alert' } className={ 'alert alert-danger ' + this.hasError( child.identifiedname ) }></div>
 </li>
 );
 this.total_extensions++;
 }
 } );
 }
 if ( children.length || ext.state != 'installed' ) {
 extensions.push(
 <li className="extension">
 <label className="checkbox-inline jsn-extension-label jsn-title">
 <input
 ref={ ext.identifiedname }
 type="checkbox"
 value={ ext.identifiedname }
 checked={ this.state.ignoredExtension[ ext.identifiedname ] ? false : true }
 disabled={ ( ext.state != 'install' || this.state.installing != '' ) ? true : false }
 onChange={ this.toggleExtension.bind( this, ext.identifiedname ) }
 />
 { ext.description }
 <span className={ 'fa fa-' + this.getIcon( ext.identifiedname ) }></span>
 </label>
 <a
 href="javascript:void(0)"
 onClick={ this.toggleExtensionDesc.bind( this, ext.identifiedname ) }
 className="extension-details"
 >
 <i className={ 'fa fa-' + ( this.state.showExtensionDesc[ ext.identifiedname ] ? 'minus' : 'plus' ) + ( this.state.installing == '' ? '' : ' hidden' ) }></i>
 </a>
 <span className={ 'label label-' + ( ext.state == 'install' ? 'success' : 'warning' ) + ( this.state.installing == '' ? '' : ' hidden' ) }>
 { sunfw.text[ ext.state == 'install' ? 'new-installation' : 'update' ] }
 </span>
 <p className={ 'extension-desc' + ( this.state.showExtensionDesc[ ext.identifiedname ] ? '' : ' hidden' ) + ( this.state.installing == '' ? '' : ' hidden' ) }>
 { ext.productdesc }
 <a href={ ext.producturl } target="_blank" rel="noopener noreferrer" className="read-more">
 { sunfw.text['read-more'] }
 </a>
 </p>
 <div ref={ ext.identifiedname + '_progress' } className="progress hidden">
 <div className="progress-bar" role="progressbar">
 <span className="percentage">0%</span>
 </div>
 </div>
 <div ref={ ext.identifiedname + '_alert' } className={ 'alert alert-danger ' + this.hasError( ext.identifiedname ) }></div>
 <ul>
 { children }
 </ul>
 </li>
 );
 this.total_extensions++;
 }
 } );
 } if ( this.state.step == 'extensions' ) {
 if ( extensions.length ) {
 extensions = (
 <ul>
 { extensions }
 </ul>
 );
 } else {
 this.state.success.push( 'extensions' );
 this.state.step = 'import';
 }
 } var attention = [];
 if ( this.state.attention instanceof Array && this.state.attention.length ) {
 this.state.attention.map( ( ext ) => {
 if ( ext.display === undefined || ext.display ) {
 var message = sunfw.text['notice-for-unchecked-extension'],
 textBtn = sunfw.text['get-it-now'],
 link = '',
 missing = '',
 skipped = false;
 for ( var p in this.state.ignoredExtension ) {
 if ( p.indexOf(ext.id) > -1 ) {
 skipped = true;
 }
 }
 if ( ! skipped ) {
 if (ext.author == '3rd') {
 if (ext.commercial == 'true') {
 message = sunfw.text['notice-for-commercial-extention']
 textBtn = sunfw.text['learn-more'];
 } else {
 message = sunfw.text['notice-for-free-extention']
 textBtn = sunfw.text['download-it'];
 }
 }
 }
 if ( ext.url ) {
 link = (
 <a href={ ext.url } target="_blank" rel="noopener noreferrer">
 { textBtn }
 </a>
 );
 }
 if (ext.missing) {
 missing = (
 <ul>
 { ext.missing.map( (m) => {
 return (<li><strong>{ m }</strong></li>);
 } ) }
 </ul>
 );
 }
 attention.push(
 <li>
 <strong>{ ext.name }</strong> { ext.version ? '(' + ext.version + ')' : '' }
 <br />
 { ( ext.missing || ext.outdate ) ? ext.message : message } { missing } { link }.
 </li>
 );
 }
 } );
 }
 if ( attention.length ) {
 attention = (
 <ul>
 { attention }
 </ul>
 );
 }
 return (
 <div ref="wrapper" key={ this.props.id } id="install_sample_data_modal">
 <div className={ this.state.step == 'confirm' ? '' : 'hidden' }>
 <div className="alert alert-warning">
 <span className="label label-danger">{ sunfw.text['important-notice'] }</span>
 <ul>
 <li ref="notice"></li>
 <li>{ sunfw.text['install-sample-notice-2'] }</li>
 </ul>
 </div>
 <div className="radio">
 <label>
 <input type="radio" checked={ this.state.installationType === 'sampledata' } onClick={ this.selectInstallationType } name="typeInstallation" value="sampledata" />
 { sunfw.text['install-sample-notice-3'] }
 </label>
 <br />
 <label>
 <input type="radio" checked={ this.state.installationType === 'structure' } onClick={ this.selectInstallationType } name="typeInstallation" value="structure" />
 { sunfw.text['install-sample-notice-4'] }
 </label>
 </div>
 </div>
 <div className={ ( this.state.step != 'confirm' && this.state.installationType == 'sampledata' ) ? '' : 'hidden' }>
 <p className={ this.state.step == 'success' ? 'hidden' : '' }>
 { sunfw.text['install-sample-processing'] }
 </p>
 <ul className={ this.state.step == 'success' ? 'hidden' : '' }>
 <li>
 <span className="title">{ sunfw.text['download-sample-package'] }</span>
 <span className={ 'fa fa-' + this.getIcon( 'download' ) }></span>
 <div ref="download_progress" className="progress hidden">
 <div className="progress-bar" role="progressbar">
 <span className="percentage">0%</span>
 </div>
 </div>
 <div ref="download_alert" className={ 'alert alert-danger ' + this.hasError( 'download' ) }></div>
 </li>
 <li className={ this.isVisible( 'upload' ) }>
 <span className="title">{ sunfw.text['upload-sample-package'] }</span>
 <span className={ 'fa fa-' + this.getIcon( 'upload' ) }></span>
 <div ref="upload_alert" className={ 'alert alert-danger ' + this.hasError( 'upload' ) }></div>
 </li>
 <li className={ this.isVisible( 'extensions' ) }>
 <span className="title">{
 sunfw.text[
 ( ! extensions.length || this.state.installing != '' )
 ? 'install-extensions'
 : 'recommend-extensions'
 ]
 }</span>
 <span className={ 'fa fa-' + this.getIcon( 'extensions' ) }></span>
 <div ref="extensions_progress" className="progress hidden">
 <div className="progress-bar" role="progressbar">
 <span className="percentage">0%</span>
 </div>
 </div>
 { extensions }
 <div ref="extensions_alert" className={ 'alert alert-danger ' + this.hasError( 'extensions' ) }></div>
 </li>
 <li className={ this.isVisible( 'import' ) }>
 <span className="title">{ sunfw.text['install-sample-package'] }</span>
 <span className={ 'fa fa-' + this.getIcon( 'import' ) }></span>
 <div ref="import_alert" className={ 'alert alert-danger ' + this.hasError( 'import' ) }></div>
 </li>
 </ul>
 <div className={ this.isVisible( 'manual' ) }>
 <form
 ref="form"
 method="post"
 target="upload-sample-data"
 encType="multipart/form-data"
 >
 <ol>
 <li>
 { sunfw.text['download-sample-package-m'] }
 <a href={ this.props.sample.download } className="btn btn-default" target="_blank" rel="noopener noreferrer">
 { sunfw.text['download-file'] }
 </a>
 </li>
 <li>
 { sunfw.text['select-sample-package'] }
 <input
 name="package"
 type="file"
 onChange={ this.selectPackage }
 defaultValue={ this.state.selectedPackage }
 />
 <br />
 <div className={ 'alert alert-danger ' + this.hasError( 'manual' ) }>
 { this.state.failure['manual'] ? this.state.failure['manual'] : '' }
 </div>
 </li>
 </ol>
 </form>
 <iframe ref="iframe" src="about:blank" name="upload-sample-data" className="hidden"></iframe>
 </div>
 <div className={ 'success-message ' + (
 ( this.isVisible( 'success' ) == 'hidden' || ! ( attention instanceof Array ) )
 ? 'hidden'
 : ''
 ) }>
 <p>
 { sunfw.text['install-sample-success'] }
 </p>
 </div>
 <div className={ 'notice-message ' + (
 ( this.isVisible( 'success' ) == '' && ! ( attention instanceof Array ) )
 ? ''
 : 'hidden'
 ) }>
 <p>
 { sunfw.text['install-sample-attention'] }
 </p>
 { attention }
 </div>
 <div className={ 'failure-message ' + this.isVisible( 'failure' ) }>
 <p>
 { sunfw.text['install-sample-failure'] }
 </p>
 </div>
 </div>
 <div className={ ( this.state.step != 'confirm' && this.state.installationType == 'structure' ) ? '' : 'hidden' }>
 <p className={ this.state.step == 'success' ? 'hidden' : '' }>
 { sunfw.text['install-structure-processing'] }
 </p>
 <ul className={ this.state.step == 'success' ? 'hidden' : '' }>
 <li>
 <span className="title">{ sunfw.text['install-structure-data'] }</span>
 <span className={ 'fa fa-' + this.getIcon( 'apply' ) }></span>
 <div ref="apply_alert" className={ 'alert alert-danger ' + this.hasError( 'apply' ) }></div>
 </li>
 </ul>
 <div className={ 'success-message ' + this.isVisible( 'success' ) }>
 <p>
 { sunfw.text['install-sample-success'] }
 </p>
 </div>
 <div className={ 'failure-message ' + this.isVisible( 'failure' ) }>
 <h4>
 { sunfw.text['install-sample-failure'] }
 </h4>
 </div>
 </div>
 <div className={
 'modal-footer' + (
 (
 this.state.step == 'confirm'
 ||
 this.state.step == 'manual'
 ||
 ( this.state.step == 'extensions' && this.state.installing == '' )
 ||
 this.state.step == 'success'
 ||
 this.state.step == 'failure'
 )
 ? ''
 : ' hidden'
 )
 }>
 <div className={ this.state.step == 'confirm' ? 'checkbox' : 'checkbox hidden' }>
 <label>
 <input
 ref="confirm"
 type="checkbox"
 name="agree"
 value="1"
 onClick={ this.confirm }
 />
 { sunfw.text['install-sample-confirm'] }
 </label>
 </div>
 <div className={
 'actions' + (
 (
 this.state.step == 'confirm'
 ||
 this.state.step == 'manual'
 ||
 ( this.state.step == 'extensions' && this.state.installing == '' )
 ||
 this.state.step == 'success'
 ||
 this.state.step == 'failure'
 )
 ? ''
 : ' hidden'
 )
 }>
 <button
 type="button"
 onClick={ this.next }
 disabled={ this.state.confirmed ? false : true }
 className={
 'btn btn-primary' + (
 ( this.state.step == 'success' || this.state.step == 'failure' ) ? ' hidden' : ''
 )
 }
 >
 { sunfw.text['continue'] }
 </button>
 <button
 ref="close"
 type="button"
 onClick={ this.cancel }
 className="btn btn-default"
 >
 { sunfw.text[ this.state.step == 'success' ? 'start-editing' : ( this.state.step == 'failure' ? 'close' : 'cancel' ) ] }
 </button>
 </div>
 </div>
 </div>
 );
 },
 initActions: function() { if ( this.hasUpdate ) {
 return;
 } this.refs.notice.innerHTML = sunfw.text['install-sample-notice-1']
 .replace( '%1$s', this.props.sample.demo )
 .replace( '%2$s', this.props.sample.name ); if ( ! this.state.confirmed ) {
 this.refs.confirm.checked = false;
 }
 if ( this.state.installationType == 'sampledata' ) {
 if ( this.state.confirmed ) { var token = document.getElementById( 'jsn-tpl-token' ).value;
 var styleID = document.getElementById( 'jsn-style-id' ).value;
 var templateName = document.getElementById( 'jsn-tpl-name' ).value; var server = 'index.php?option=com_ajax&format=json&plugin=sunfw&context=sampledata&'
 + token + '=1&style_id=' + styleID + '&template_name=' + templateName
 + '&sample_package=' + this.props.sample.id;
 switch ( this.state.step ) {
 case 'download': SunFwHelper.downloadFile(
 server + '&action=downloadPackage',
 this.refs.download_progress,
 function( req ) {
 var response;
 try {
 response = JSON.parse( req.responseText );
 } catch ( e ) {
 response = {
 type: 'error',
 data: req.responseText
 };
 }
 if ( response.type == 'success' ) {
 var success = this.state.success;
 success.push( 'download' );
 this.setState( {
 success: success,
 step: 'extensions',
 extensions: response.data,
 } );
 } else {
 var failure = this.state.failure, step = 'manual';
 failure['download'] = response.data.replace( 'OUTDATED: ', '' ); if ( [401, 403].indexOf(req.status) > -1 || response.data.indexOf( 'OUTDATED: ' ) > -1 ) {
 step = 'failure';
 }
 this.setState( {
 failure: failure,
 step: step,
 } );
 }
 }.bind( this )
 );
 break;
 case 'upload': if ( ! this.refs.iframe._listened_load_event ) {
 this.refs.iframe.addEventListener( 'load', function( event ) {
 var responseText = event.target.contentWindow.document.body.textContent, response;
 try {
 response = JSON.parse( responseText );
 } catch ( e ) {
 response = {
 type: 'error',
 data: responseText
 };
 }
 if ( response.type == 'success' ) {
 var success = this.state.success;
 success.push( 'upload' );
 this.setState( {
 success: success,
 step: 'extensions',
 extensions: response.data,
 } );
 } else {
 var failure = this.state.failure;
 failure['upload'] = response.data;
 this.setState( {
 failure: failure,
 step: 'failure',
 } );
 }
 }.bind( this ) );
 this.refs.iframe._listened_load_event = true;
 }
 this.refs.form.setAttribute( 'action', server + '&action=uploadPackage' );
 this.refs.form.submit();
 break;
 case 'extensions':
 if ( this.state.installing != '' ) { this.refs.extensions_progress.classList.remove('hidden');
 SunFwHelper.downloadFile(
 server + '&action=installExtension&tool_redirect=0&id=' + this.state.installing,
 this.refs[ this.state.installing + '_progress' ],
 function( req ) { this.installed_extensions ? this.installed_extensions++ : (this.installed_extensions = 1); var percentage = Math.round( (this.installed_extensions / this.total_extensions) * 100 );
 this.refs.extensions_progress.querySelector('[role="progressbar"]').style.width = percentage + '%';
 this.refs.extensions_progress.querySelector('.percentage').textContent = percentage + '%'; var next = this.next(),
 success = this.state.success,
 failure = this.state.failure,
 response;
 try {
 response = JSON.parse( req.responseText );
 } catch ( e ) {
 response = {
 type: 'error',
 data: req.responseText
 };
 }
 if ( response.type == 'success' ) {
 success.push( this.state.installing );
 if ( next ) {
 this.setState( {
 success: success,
 installing: next,
 } );
 }
 } else { if ( [401, 403].indexOf(req.status) > -1 ) {
 failure['extensions'] = response.data;
 return this.setState( {
 failure: failure,
 step: 'failure',
 } );
 }
 failure[ this.state.installing ] = response.data; this.hasExtensionNotInstalled || ( this.hasExtensionNotInstalled = true );
 if ( next ) {
 this.setState( {
 failure: failure,
 installing: next,
 } );
 }
 }
 if ( ! next ) {
 if ( this.hasExtensionNotInstalled ) {
 failure[ 'extensions' ] = '';
 } else {
 success.push( 'extensions' );
 }
 this.setState( {
 success: success,
 failure: failure,
 step: 'import',
 } ); this.refs.extensions_progress.classList.add('hidden');
 this.refs.extensions_progress.querySelector('[role="progressbar"]').style.width = '0%';
 this.refs.extensions_progress.querySelector('.percentage').textContent = '0%';
 }
 }.bind( this )
 );
 }
 break;
 case 'import': setTimeout( function() {
 SunFwHelper.requestUrl(
 server + '&action=importPackage',
 function( req ) {
 var response;
 try {
 response = JSON.parse( req.responseText );
 } catch ( e ) {
 response = {
 type: 'error',
 data: req.responseText
 };
 }
 if ( response.type == 'success' ) {
 var success = this.state.success;
 success.push( 'import' );
 this.setState( {
 success: success,
 step: 'success',
 attention: response.data.attention,
 styleId: response.data.styleId,
 } );
 } else {
 var failure = this.state.failure;
 failure['import'] = response.data;
 this.setState( {
 failure: failure,
 step: 'failure',
 } );
 }
 }.bind( this )
 );
 }.bind(this), 10000 );
 break;
 case 'success':
 if ( this.parent.state.lastInstalled != this.props.sample.id ) {
 this.parent.setState( {
 lastInstalled: this.props.sample.id,
 } );
 } window.cookieLawHasChange = window.layoutBuilderHasChange = window.styleBuilderHasChange = window.menuBuilderHasChange = window.systemHasChange = window.assignmentHasChange = false; localStorage.removeItem('active-tabs');
 break;
 }
 }
 }
 else if (this.state.installationType === 'structure') {
 if ( this.state.confirmed && this.state.step == 'structure' ) { var structureID = this.props.sample.id;
 var token = document.getElementById( 'jsn-tpl-token' ).value;
 var styleID = document.getElementById( 'jsn-style-id' ).value;
 var templateName = document.getElementById( 'jsn-tpl-name' ).value; var server = 'index.php?option=com_ajax&format=json&plugin=sunfw&'
 + token + '=1&style_id=' + styleID + '&template_name=' + templateName
 + '&structure_id=' + structureID;
 SunFwHelper.requestUrl(
 server + '&action=installStructure',
 function( req ) {
 var response;
 try {
 response = JSON.parse( req.responseText );
 } catch ( e ) {
 response = {
 type: 'error',
 data: req.responseText
 };
 }
 if ( response.type == 'success' ) {
 var success = this.state.success;
 success.push( 'apply' );
 this.setState( {
 success: success,
 step: 'success',
 } ); window.cookieLawHasChange = window.layoutBuilderHasChange = window.styleBuilderHasChange = window.menuBuilderHasChange = window.systemHasChange = window.assignmentHasChange = false; localStorage.removeItem('active-tabs');
 } else {
 var failure = this.state.failure;
 failure['apply'] = response.data;
 this.setState( {
 failure: failure,
 step: 'failure',
 } );
 }
 }.bind( this )
 );
 }
 } for ( var step in this.state.failure ) {
 this.refs[ step + '_alert' ].innerHTML = this.state.failure[ step ];
 }
 },
 confirm: function( event ) {
 this.setState( {
 confirmed: event.target.checked,
 } );
 },
 next: function( event ) { this.parent.refs.modal.refs.modal.querySelector('.modal-header .close').classList.add('hidden');
 if ( this.state.step == 'confirm' ) {
 if (this.state.installationType === 'sampledata') {
 this.setState( {
 step: 'download',
 } );
 } else {
 this.setState( {
 step: 'structure',
 } );
 }
 } else if ( this.state.step == 'manual' ) {
 this.setState( {
 step: 'upload',
 } );
 } else if ( this.state.step == 'extensions' ) {
 var installing;
 for ( var i = 0, n = this.state.extensions.length; i < n; i++ ) {
 if (
 this.state.extensions[ i ].state != 'installed'
 &&
 this.refs[ this.state.extensions[ i ].identifiedname ]
 &&
 this.refs[ this.state.extensions[ i ].identifiedname ].checked
 &&
 this.state.installing != this.state.extensions[ i ].identifiedname
 &&
 this.state.success.indexOf( this.state.extensions[ i ].identifiedname ) < 0
 &&
 this.state.failure[ this.state.extensions[ i ].identifiedname ] === undefined
 ) {
 installing = this.state.extensions[ i ].identifiedname;
 }
 else if (
 this.state.extensions[ i ].depends instanceof Array
 &&
 this.state.extensions[ i ].depends.length
 ) {
 for ( var i2 = 0, n2 = this.state.extensions[ i ].depends.length; i2 < n2; i2++ ) {
 if (
 this.state.extensions[ i ].depends[ i2 ].state != 'installed'
 &&
 this.refs[ this.state.extensions[ i ].depends[ i2 ].identifiedname ]
 &&
 this.refs[ this.state.extensions[ i ].depends[ i2 ].identifiedname ].checked
 &&
 this.state.installing != this.state.extensions[ i ].depends[ i2 ].identifiedname
 &&
 this.state.success.indexOf( this.state.extensions[ i ].depends[ i2 ].identifiedname ) < 0
 &&
 this.state.failure[ this.state.extensions[ i ].depends[ i2 ].identifiedname ] === undefined
 ) {
 installing = this.state.extensions[ i ].depends[ i2 ].identifiedname;
 break;
 }
 }
 }
 if ( installing ) {
 break;
 }
 }
 if ( event ) {
 if ( installing ) {
 this.setState( {
 installing: installing,
 } );
 } else {
 var success = this.state.success;
 success.push( 'extensions' );
 this.setState( {
 success: success,
 step: 'import',
 } );
 }
 } else {
 return installing;
 }
 }
 },
 cancel: function( event ) {
 if ( this.state.step == 'success' ) { this.refs.close.disabled = true;
 this.refs.close.innerHTML = sunfw.text['please-wait'];
 this.refs.close.style.cursor = 'wait'; var styleId = document.getElementById( 'jsn-style-id' ).value;
 if ( this.state.styleId && this.state.styleId != styleId ) {
 window.location.href = window.location.href.replace( styleId, this.state.styleId );
 } else {
 window.location.reload();
 }
 return;
 } else {
 this.setState( {
 step: 'confirm',
 installationType : 'sampledata',
 success: [],
 failure: {},
 confirmed: false,
 attention: [],
 installing: '',
 extensions: [],
 selectedPackage: '',
 ignoredExtension: {},
 showExtensionDesc: {},
 } );
 }
 this.parent.refs.modal.close();
 },
 isVisible: function( step ) {
 if (
 this.state.step == step
 ||
 this.state.success.indexOf( step ) > -1
 ||
 this.state.failure[ step ] !== undefined
 ) {
 return '';
 }
 return 'hidden';
 },
 getIcon: function( step ) {
 if ( this.state.success.indexOf( step ) > -1 ) {
 return 'check';
 } else if ( this.state.failure[ step ] !== undefined ) {
 return 'times';
 }
 if ( step == 'extensions' && this.state.installing == '' ) {
 return '';
 }
 if ( ['apply', 'import', 'upload'].indexOf(step) > -1 ) {
 return 'circle-o-notch fa-spin';
 }
 return '';
 },
 hasError: function( step ) {
 if ( this.state.failure[ step ] !== undefined ) {
 return '';
 }
 return 'hidden';
 },
 selectPackage: function( event ) {
 this.setState( {
 selectedPackage: event.target.value.split(/(\\|\/)/g).pop(),
 } );
 },
 toggleExtension: function( id ) {
 var ignoredExtension = this.state.ignoredExtension;
 if ( ignoredExtension[ id ] ) {
 delete ignoredExtension[ id ];
 } else {
 ignoredExtension[ id ] = true;
 }
 this.setState( {
 ignoredExtension: ignoredExtension,
 } );
 },
 toggleExtensionDesc: function( id ) {
 var showExtensionDesc = this.state.showExtensionDesc;
 if ( showExtensionDesc[ id ] ) {
 delete showExtensionDesc[ id ];
 } else {
 showExtensionDesc[ id ] = true;
 }
 this.setState( {
 showExtensionDesc: showExtensionDesc,
 } );
 },
 selectInstallationType: function (event) {
 this.setState( {
 installationType: event.target.value
 } );
 }
} );
window.SampleDataUninstall = React.createClass( {
 mixins: [ SunFwMixinBase ],
 getDefaultProps: function() {
 return {
 sample: {},
 };
 },
 getInitialState: function() {
 return {
 step: 'confirm',
 success: [],
 failure: {},
 confirmed: false,
 };
 },
 render: function() {
 return (
 <div ref="wrapper" key={ this.props.id } id="uninstall_sample_data_modal">
 <div className={ this.state.step == 'confirm' ? '' : 'hidden' }>
 <div className="alert alert-warning">
 <span className="label label-danger">{ sunfw.text['important-notice'] }</span>
 <ul>
 <li>{ sunfw.text['uninstall-sample-notice'] }</li>
 </ul>
 </div>
 </div>
 <div className={ this.state.step != 'confirm' ? '' : 'hidden' }>
 <p className={ this.state.step == 'success' ? 'hidden' : '' }>
 { sunfw.text['uninstall-sample-processing'] }
 </p>
 <ul className={ this.state.step == 'success' ? 'hidden' : '' }>
 <li>
 <span className="title">{ sunfw.text['restore-backed-up-data'] }</span>
 <span className={ 'fa fa-' + this.getIcon( 'restore' ) }></span>
 <div ref="restore_alert" className={ 'alert alert-danger ' + this.hasError( 'restore' ) }></div>
 </li>
 </ul>
 <div className={ 'success-message ' + this.isVisible( 'success' ) }>
 <p>
 { sunfw.text['uninstall-sample-success'] }
 </p>
 </div>
 <div className={ 'failure-message ' + this.isVisible( 'failure' ) }>
 <p>
 { sunfw.text['uninstall-sample-failure'] }
 </p>
 </div>
 </div>
 <div className={
 'modal-footer' + (
 (
 this.state.step == 'confirm'
 ||
 this.state.step == 'success'
 ||
 this.state.step == 'failure'
 )
 ? ''
 : ' hidden'
 )
 }>
 <div className={ this.state.step == 'confirm' ? 'checkbox' : 'checkbox hidden' }>
 <label>
 <input
 type="checkbox"
 name="agree"
 value="1"
 onClick={ this.confirm }
 />
 { sunfw.text['uninstall-sample-confirm'] }
 </label>
 </div>
 <div className={
 'actions' + (
 (
 this.state.step == 'confirm'
 ||
 this.state.step == 'success'
 ||
 this.state.step == 'failure'
 )
 ? ''
 : ' hidden'
 )
 }>
 <button
 type="button"
 onClick={ this.uninstall }
 disabled={ this.state.confirmed ? false : true }
 className={
 'btn btn-primary' + (
 ( this.state.step == 'success' || this.state.step == 'failure' ) ? ' hidden' : ''
 )
 }
 >
 { sunfw.text['continue'] }
 </button>
 <button
 ref="close"
 type="button"
 onClick={ this.cancel }
 className="btn btn-default"
 >
 { sunfw.text[
 ( this.state.step == 'success' || this.state.step == 'failure' ) ? 'close' : 'cancel'
 ] }
 </button>
 </div>
 </div>
 </div>
 );
 },
 initActions: function() {
 if ( this.state.confirmed ) { var token = document.querySelector( '#jsn-tpl-token' ).value;
 var styleID = document.querySelector( '#jsn-style-id' ).value;
 var templateName = document.querySelector( '#jsn-tpl-name' ).value; var server = 'index.php?option=com_ajax&format=json&plugin=sunfw&context=sampledata&'
 + token + '=1&style_id=' + styleID + '&template_name=' + templateName
 + '&sample_package=' + this.props.sample.id;
 switch ( this.state.step ) {
 case 'restore': SunFwHelper.requestUrl(
 server + '&action=restoreBackup',
 function( req ) {
 var response;
 try {
 response = JSON.parse( req.responseText );
 } catch ( e ) {
 response = {
 type: 'error',
 data: req.responseText
 };
 }
 if ( response.type == 'success' ) {
 var success = this.state.success;
 success.push( 'restore' );
 this.setState( {
 success: success,
 step: 'success',
 lastInstalled: response.data,
 } );
 } else {
 var failure = this.state.failure;
 failure['restore'] = response.data;
 this.setState( {
 failure: failure,
 step: 'failure',
 } );
 }
 }.bind( this )
 );
 break;
 case 'success':
 if ( this.parent.state.lastInstalled != this.state.lastInstalled ) {
 this.parent.setState( {
 lastInstalled: this.state.lastInstalled,
 } );
 } window.cookieLawHasChange = window.layoutBuilderHasChange = window.styleBuilderHasChange = window.menuBuilderHasChange = window.systemHasChange = window.assignmentHasChange = false;
 break;
 } for ( var step in this.state.failure ) {
 this.refs[ step + '_alert' ].innerHTML = this.state.failure[ step ];
 }
 }
 },
 confirm: function( event ) {
 this.setState( {
 confirmed: event.target.checked,
 } );
 },
 uninstall: function( event ) { this.parent.refs.modal.refs.modal.querySelector('.modal-header .close').classList.add('hidden');
 this.setState( {
 step: 'restore',
 } );
 },
 cancel: function( event ) {
 if ( this.state.step == 'success' ) { this.refs.close.disabled = true;
 this.refs.close.innerHTML = sunfw.text['please-wait'];
 this.refs.close.style.cursor = 'wait'; window.location.href = window.location.href.substr( 0, window.location.href.indexOf( '&view=' ) );
 return;
 }
 this.parent.refs.modal.close();
 },
 isVisible: function( step ) {
 if (
 this.state.step == step
 ||
 this.state.success.indexOf( step ) > -1
 ||
 this.state.failure[ step ] !== undefined
 ) {
 return '';
 }
 return 'hidden';
 },
 getIcon: function( step, isExt ) {
 if ( this.state.success.indexOf( step ) > -1 ) {
 return 'check';
 } else if ( this.state.failure[ step ] !== undefined ) {
 return 'times';
 }
 if ( step == 'extensions' && this.state.installing == '' ) {
 return '';
 }
 if ( isExt ) {
 return this.state.installing == step ? 'circle-o-notch fa-spin' : '';
 }
 return 'circle-o-notch fa-spin';
 },
 hasError: function( step ) {
 if ( this.state.failure[ step ] !== undefined ) {
 return '';
 }
 return 'hidden';
 }
} );
