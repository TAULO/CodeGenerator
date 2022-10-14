'use strict';
const fs = require('fs');
const dns = require('dns');
const lighthouse = require('lighthouse');

const myconfig = require('./myconfig.js');
const http = require('http');
const chalk = require('chalk');
const requestObj = require('request');
const puppeteer = require('puppeteer');

/* Setting Enum */
const STATUS_TYPE = {
	INFO: 'INFO',
	CONNECTION: 'CONNECTION',
	PROCESS: 'PROCESS',
	MESSAGE: 'MESSAGE',
	SERVER: 'SERVER',
	ERROR: 'ERROR',
	UNKNOWN: 'UNKNOWN',
	PROCESS_STEP: 'PROCESS_STEP',
	PROCESS_ERROR: 'PROCESS_ERROR',
	PROCESS_RESULT: 'PROCESS_RESULT',
	PROCESS_SCORE: 'PROCESS_SCORE',
	PROCESS_START: 'PROCESS_START',
	PROCESS_FINISHED: 'PROCESS_FINISHED',
	PROCESS_THRESHOLD: 'PROCESS_THRESHOLD',
	SENDING: 'SENDING',
	SENDING_ERROR: 'SENDING_ERROR',
	HTTP_SERVER: 'HTTP_SERVER',
	HTTP_SERVER_ERROR: 'HTTP_SERVER_ERROR',
	HTTP_SERVER_NOTFOUND: 'HTTP_SERVER_NOTFOUND',
	HTTP_SERVER_INCOMING: 'HTTP_SERVER_INCOMING',
	HTTP_SERVER_OUTGOING: 'HTTP_SERVER_OUTGOING',
	LIGHTHOUSE_START: 'LIGHTHOUSE_START',
	LIGHTHOUSE_PUPPETEER: 'LIGHTHOUSE_PUPPETEER',
	LIGHTHOUSE_LOGIN: 'LIGHTHOUSE_LOGIN',
	LIGHTHOUSE_LOGIN_WAIT: 'LIGHTHOUSE_LOGIN_WAIT',
	LIGHTHOUSE_LOGIN_CRED: 'LIGHTHOUSE_LOGIN_CRED',
	LIGHTHOUSE_CHECK: 'LIGHTHOUSE_CHECK',
	LIGHTHOUSE_FINISHED: 'LIGHTHOUSE_FINISHED',
	LIGHTHOUSE_ERROR: 'LIGHTHOUSE_ERROR'
}

/* setting constants */
const { Worker, isMainThread, parentPort, SHARE_ENV } = require('worker_threads');
const log_offset = 70; /* this constant is used to format the message in the console log */

/* Load project files/libraries */
const lhcs_tools = require('./lhcs-tools.js');
const websocket_worker = new Worker("./WebSocket.js");


/* Setting global variables */
var nodeport = process.env.PORT || 80;
var port80 = 80;
var server_busy_state = false; /* this variable sets the server state to busy, which means the next processing request will not be executed */



function handle_request_result(error, response, body) {

	let b = body;
	let isSuccess = true
	let returnCode;
	let result = [];

	try {
		if (response && response.statusCode) {
			if (response.statusCode != 200) {
				system_notify_message("- Sending - Failed", STATUS_TYPE.ERROR);
				system_notify_message('- statusCode:' + response.statusCode, STATUS_TYPE.ERROR); // Print the response status code if a response was received
				system_notify_message('- error:' + error, STATUS_TYPE.ERROR); // Print the error if one occurred
				isSuccess = false
			}
		}
		returnCode = response.statusCode;
	} catch (ex) {
		system_notify_message("- response: " + response, STATUS_TYPE.SENDING_ERROR);
		system_notify_message("- Sending report unhandled error: " + ex, STATUS_TYPE.SENDING_ERROR);
	}
	result.push(isSuccess, returnCode);
	return result;
}


const crypto = require('crypto');
const encryptionType = 'aes-256-cbc';
const aesKey = 'vesselsth4esecharact6ersubstance';
const encryptionEncoding = 'base64';
const bufferEncryption = 'utf-8';
function AesDecrypt(base64String, AesIV) {

	const buff = Buffer.from(base64String, encryptionEncoding);
	const key = Buffer.from(aesKey, bufferEncryption);
	const iv = Buffer.from(AesIV, bufferEncryption);
	const decipher = crypto.createDecipheriv(encryptionType, key, iv);
	const deciphered = decipher.update(buff) + decipher.final();
	return deciphered;
};

function decryptPassword(enc_password, aes_iv) {
	system_notify_message("- Decryption", STATUS_TYPE.INFO);
	let decryptedPwd = '';
	try {
		decryptedPwd = AesDecrypt(enc_password, aes_iv);
	} catch (e) {
		system_notify_message("- Decryption Error " + e, STATUS_TYPE.ERROR);
	}
	//return decryptedPwd;
	return decryptedPwd;
}

/*
 * send_complete_json_report
 * this function sends the complete report in json format to the report endpoint "data_report_callback_url"
 * At the endpoint this report can be stored in a data repository (like elastic)
 */
function send_complete_json_report(data_report_callback_url, report, url_guid) {
	try {
		if (data_report_callback_url.trim().length === 0) return; /* if no url is defined, return */
		system_notify_message('- Sending the complete result - Start', STATUS_TYPE.PROCESS_STEP);
		system_notify_message('- Sending the complete result - Not implemented yet', STATUS_TYPE.PROCESS_STEP);
		system_notify_message('- Sending the complete result - Completed', STATUS_TYPE.PROCESS_STEP);
		//	return;
		report = report.replace("\"element\": \"\"", "\"element\":{}") /* We need to fix this part to have the same types on the reports */
		system_notify_message("- Sending report - Start", STATUS_TYPE.SENDING);
		if (data_report_callback_url.indexOf(" ?") == -1) {
			data_report_callback_url = data_report_callback_url + "?Type=complete-lighthouse-report&GroupingId=" + url_guid;
		} else {
			data_report_callback_url = data_report_callback_url + "&GroupingId=" + url_guid;
		}
		requestObj({
			url: data_report_callback_url,	/* Callback endpoint */
			method: "POST",	/* HTTP Method */
			headers: { "Content-Type": "application/json" }, /* HTTP Headers, in this case the content type */
			body: report	/* Actual JSON containing the report data */
		},
			function (error, response, body) {
				handle_request_result(error, response, body);
			}
		);
		system_notify_message("- Sending report - Done", STATUS_TYPE.SENDING);
	} catch (ex) {
		system_notify_message("- Sending report error: " + ex, STATUS_TYPE.SENDING_ERROR);
	}
}

/*
 * send_category_json_report
 * this function sends the complete report in json format to the report endpoint "data_report_callback_url"
 * At the endpoint this report can be stored in a data repository (like elastic)
 * 
 * input:
 * data_report_callback_url		:	The callback url where the report is send to
 * report						:	The JSON object data to send
 * category						:	the category for which the report is send
 * url_guid						:	The GUID of the URL, which is used as a grouping id for the entry
 */
function send_category_json_report(data_report_callback_url, data_report_token, data_report_Application_Extension, report, category, grouping_id, batchGuid) {
	try {
		system_notify_message("- Sending Result category " + category + " - Start", STATUS_TYPE.SENDING);
		if (data_report_callback_url.indexOf(" ?") == -1) {
			data_report_callback_url = data_report_callback_url + "?Type=" + data_report_Application_Extension + "_lighthouse_" + category + "&GroupingId=" + grouping_id;
		} else {
			data_report_callback_url = data_report_callback_url + "&GroupingId=" + grouping_id;
		}
		requestObj({

			url: data_report_callback_url,
			method: "POST",
			headers: { "Content-Type": "application/json", "batchguid": batchGuid, "identifying_token": data_report_token },
			body: report
		},
			function (error, response, body) {
				handle_request_result(error, response, body);
			}
		);
		system_notify_message("- Sending Result category " + category + " - End", STATUS_TYPE.SENDING);
	} catch (ex) {
		system_notify_message("- Sending Result error: " + ex, STATUS_TYPE.SENDING_ERROR);
	}
}


/* send_data_to_url
 * This function sends data for a batch and url to the callback_url via a defined http method
 * The difference between send_data_to_url and send_message_to_url is the content.
 * In this function we assume the data is in the right format and we send it out without conversion or check
 * 
 * Also we send the UrlGuid and BatchGuid in the Querystring for identification, where in send_message_to_url 
 * we can store this information in the body of the call
 * 
 * Input:
 * callback_url		:	The callback URL to send the data to
 * batch_guid		:	The GUID to identify the batch
 * url_guid			:	The GUID to identify the URL
 * method			:	The HTTP Method used to send the data (POST or GET)
 */
function send_data_to_url(callback_url, batch_guid, url_guid, data, method, batchGuid) {
	callback_url = callback_url.trim(); /* Clean the url by trimming the string */
	if (callback_url.length === 0) {
		system_notify_message("- No url for sending html - " + callback_url, STATUS_TYPE.SENDING_ERROR);
		return;
	}
	system_notify_message("- Sending response - Start", STATUS_TYPE.SENDING);
	system_notify_message(callback_url, STATUS_TYPE.SENDING);

	if (callback_url.indexOf(" ?") == -1) {
		callback_url = callback_url + "?UrlGuid=" + url_guid + "&BatchGuid=" + batch_guid;
	} else {
		callback_url = callback_url + "&UrlGuid=" + url_guid + "&BatchGuid=" + batch_guid;
	}

	try {
		//	callback_url += "?UrlGuid=" + url_guid + "&BatchGuid=" + batch_guid;

		requestObj({
			url: callback_url,
			method: method.toUpperCase(),
			headers: { "Content-Type": "application/json", "batchguid": batchGuid },
			body: data
		},
			function (error, response, body) {
				handle_request_result(error, response, body);
			}
		);
	} catch (ex) {
		system_notify_message("- Sending response - error" + ex, STATUS_TYPE.SENDING_ERROR);
	}
	system_notify_message("- Sending response - Done", STATUS_TYPE.SENDING);
}

/* 
 * send_message_to_url
 * ===========
 * this function sends a message to a specific url using the method specified.
 * The difference between send_data_to_url and send_message_to_url is the content.
 * In this function we assume a string of JSON object (which will be converted to string)
 * 
 * input:
 * callback_url: The url to send the data to
 * message: the data which will be send to the url (in the form)
 * method: POST or GET
 */
function send_message_to_url(callback_url, message, method, batchGuid) {
	callback_url = callback_url.trim(); /* Clean the url by trimming the string */
	if (callback_url.length === 0) return; /* if the url is empty return */
	/*
	 * check if the message is an object (instead of plain string). If so, translate the object to a json string
	 */
	if (typeof message === "object") {
		try {
			message = JSON.stringify(message);
		} catch (ex) { }
	}
	/* try to send the data */
	try {
		system_notify_message("- Sending response - Start", STATUS_TYPE.SENDING);
		system_notify_message(callback_url, STATUS_TYPE.SENDING);
		system_notify_message(message, STATUS_TYPE.SENDING);

		requestObj({
			url: callback_url,
			method: method.toUpperCase(),
			headers: {
				"Content-Type": "application/json",
				"batchguid": batchGuid
			},
			body: message
		},
			function (error, response, body) {
				handle_request_result(error, response, body);
			}
		);
		system_notify_message("- Sending response - Done", STATUS_TYPE.SENDING);
	} catch (ex) {
		system_notify_message("- Sending response failed: " + ex);
	}
}



/*
 * url_get_protocol
 * this function returns the protocol part of an url
 */
function url_get_protocol(url) {
	var arrUrl = url.split("://");
	if (arrUrl.length > 1) {
		return arrUrl[0];
	}
	return "unknown";
}

/*
 * url_get_host
 * this function returns the host part of an url
 */
function url_get_host(url) {
	var arrUrl = url.split("://");
	var url_data = "";
	if (arrUrl.length == 1) {
		url_data = arrUrl[0];
	} else {
		url_data = arrUrl[1];
	}

	var url_parts = url_data.split("/");
	return url_parts[0];
}

/*
 * parse_category_performance_and_send
 * this function parses the performance category data and calls the data reporting callback url to send the results
 * 
 * input:
 * data_report_callback_url			:	The callback url where the report is send to
 * data_report_applicationExtension :	A way to recognise the application/extension; commonly used for creating node in Elastic / other datalakes
 * jsonObject						:	The JSON object data to send
 * url_guid							:	The GUID of the URL, which is used as a grouping id for the entry
 */
function parse_category_performance_and_send(data_report_callback_url, data_report_token, data_report_applicationExtension, jsonObject, url_guid, application_name, environment_name, is_mobile, batchGuid) {
	var result = {};
	result.finalUrl = jsonObject.finalUrl;
	result.application = application_name;
	result.os_environment = environment_name;
	result.requestedUrl = jsonObject.requestedUrl;
	result.protocol = url_get_protocol(result.finalUrl);
	result.server = url_get_host(result.finalUrl);
	result.lighthouseVersion = jsonObject.lighthouseVersion;
	result.userAgent = jsonObject.userAgent;
	result.environment = jsonObject.environment;
	result.fetchTime = jsonObject.fetchTime;
	result.categoryId = jsonObject.categories.performance.id;
	result.categoryName = jsonObject.categories.performance.title;
	result.score = jsonObject.categories.performance.score;
	result.ismobile = is_mobile;

	send_category_json_report(data_report_callback_url, data_report_token, data_report_applicationExtension, JSON.stringify(result), result.categoryId, url_guid, batchGuid);
}

/*
 * parse_category_accessibility_and_send
 * this function parses the performance category data and calls the data reporting callback url to send the results
 *
 * input:
 * data_report_callback_url			:	The callback url where the report is send to
 * data_report_applicationExtension :	A way to recognise the application/extension; commonly used for creating node in Elastic / other datalakes
 * jsonObject						:	The JSON object data to send
 * url_guid							:	The GUID of the URL, which is used as a grouping id for the entry
 */
function parse_category_accessibility_and_send(data_report_callback_url, data_report_token, data_report_applicationExtension, jsonObject, url_guid, application_name, environment_name, is_mobile, batchGuid) {
	var result = {};
	result.finalUrl = jsonObject.finalUrl;
	result.application = application_name;
	result.os_environment = environment_name;

	result.requestedUrl = jsonObject.requestedUrl;
	result.protocol = url_get_protocol(result.finalUrl);
	result.server = url_get_host(result.finalUrl);
	result.lighthouseVersion = jsonObject.lighthouseVersion;
	result.userAgent = jsonObject.userAgent;
	result.environment = jsonObject.environment;
	result.fetchTime = jsonObject.fetchTime;
	result.categoryId = jsonObject.categories.accessibility.id;
	result.categoryName = jsonObject.categories.accessibility.title;
	result.score = jsonObject.categories.accessibility.score;
	result.ismobile = is_mobile;

	send_category_json_report(data_report_callback_url, data_report_token, data_report_applicationExtension, JSON.stringify(result), result.categoryId, url_guid, batchGuid);
}

/*
 * parse_category_pwa_and_send
 * this function parses the pwa category data and calls the data reporting callback url to send the results
 *
 * input:
 * data_report_callback_url			:	The callback url where the report is send to
 * data_report_applicationExtension :	A way to recognise the application/extension; commonly used for creating node in Elastic / other datalakes
 * jsonObject						:	The JSON object data to send
 * url_guid							:	The GUID of the URL, which is used as a grouping id for the entry
 */
function parse_category_pwa_and_send(data_report_callback_url, data_report_token, data_report_applicationExtension, jsonObject, url_guid, application_name, environment_name, is_mobile, batchGuid) {
	var result = {};
	result.finalUrl = jsonObject.finalUrl;
	result.application = application_name;
	result.os_environment = environment_name;

	result.requestedUrl = jsonObject.requestedUrl;
	result.protocol = url_get_protocol(result.finalUrl);
	result.server = url_get_host(result.finalUrl);
	result.lighthouseVersion = jsonObject.lighthouseVersion;
	result.userAgent = jsonObject.userAgent;
	result.environment = jsonObject.environment;
	result.fetchTime = jsonObject.fetchTime;
	result.categoryId = jsonObject.categories.pwa.id;
	result.categoryName = jsonObject.categories.pwa.title;
	result.score = jsonObject.categories.pwa.score;
	result.ismobile = is_mobile;

	send_category_json_report(data_report_callback_url, data_report_token, data_report_applicationExtension, JSON.stringify(result), result.categoryId, url_guid, batchGuid);
}

/*
 * parse_category_seo_and_send
 * this function parses the seo category data and calls the data reporting callback url to send the results
  *
* input:
 * data_report_callback_url			:	The callback url where the report is send to
 * data_report_applicationExtension :	A way to recognise the application/extension; commonly used for creating node in Elastic / other datalakes
 * jsonObject						:	The JSON object data to send
 * url_guid							:	The GUID of the URL, which is used as a grouping id for the entry
 */
function parse_category_seo_and_send(data_report_callback_url, data_report_token, data_report_applicationExtension, jsonObject, url_guid, application_name, environment_name, is_mobile, batchGuid) {
	var result = {};
	result.finalUrl = jsonObject.finalUrl;
	result.application = application_name;
	result.os_environment = environment_name;

	result.requestedUrl = jsonObject.requestedUrl;
	result.protocol = url_get_protocol(result.finalUrl);
	result.server = url_get_host(result.finalUrl);
	result.lighthouseVersion = jsonObject.lighthouseVersion;
	result.userAgent = jsonObject.userAgent;
	result.environment = jsonObject.environment;
	result.fetchTime = jsonObject.fetchTime;
	result.categoryId = jsonObject.categories.seo.id;
	result.categoryName = jsonObject.categories.seo.title;
	result.score = jsonObject.categories.seo.score;
	result.ismobile = is_mobile;

	send_category_json_report(data_report_callback_url, data_report_token, data_report_applicationExtension, JSON.stringify(result), result.categoryId, url_guid, batchGuid);
}

/*
 * parse_category_best_practices_and_send
 * this function parses the best practices category data and calls the data reporting callback url to send the results
 *
 * input:
 * data_report_callback_url			:	The callback url where the report is send to
 * data_report_applicationExtension :	A way to recognise the application/extension; commonly used for creating node in Elastic / other datalakes
 * jsonObject						:	The JSON object data to send
 * url_guid							:	The GUID of the URL, which is used as a grouping id for the entry
 */
function parse_category_best_practices_and_send(data_report_callback_url, data_report_token, data_report_applicationExtension, jsonObject, url_guid, application_name, environment_name, is_mobile, batchGuid) {
	var result = {};
	result.finalUrl = jsonObject.finalUrl;
	result.application = application_name;
	result.os_environment = environment_name;

	result.requestedUrl = jsonObject.requestedUrl;
	result.protocol = url_get_protocol(result.finalUrl);
	result.server = url_get_host(result.finalUrl);
	result.lighthouseVersion = jsonObject.lighthouseVersion;
	result.userAgent = jsonObject.userAgent;
	result.environment = jsonObject.environment;
	result.fetchTime = jsonObject.fetchTime;
	result.categoryId = jsonObject.categories["best-practices"].id;
	result.categoryName = jsonObject.categories["best-practices"].title;
	result.score = jsonObject.categories["best-practices"].score;
	result.ismobile = is_mobile;

	send_category_json_report(data_report_callback_url, data_report_token, data_report_applicationExtension, JSON.stringify(result), result.categoryId, url_guid, batchGuid);
}

/*
 * parse_categories_and_send
 * this function parses the best practices category data and calls the data reporting callback url to send the results
 *
 * input:
 * data_report_callback_url			:	The callback url where the report is send to
 * data_report_applicationExtension :	A way to recognise the application/extension; commonly used for creating node in Elastic / other datalakes
 * jsonObject						:	The JSON object data to send
 * url_guid							:	The GUID of the URL, which is used as a grouping id for the entry
 */
function parse_categories_and_send(data_report_callback_url, data_report_token, data_reportApplicationExtension, jsonObject, url_guid, application_name, environment_name, is_mobile, batchguid) {
	try {
		if (jsonObject.categories.performance != null) parse_category_performance_and_send(data_report_callback_url, data_report_token, data_reportApplicationExtension, jsonObject, url_guid, application_name, environment_name, is_mobile, batchguid);
		if (jsonObject.categories.accessibility != null) parse_category_accessibility_and_send(data_report_callback_url, data_report_token, data_reportApplicationExtension, jsonObject, url_guid, application_name, environment_name, is_mobile, batchguid);
		if (jsonObject.categories["best-practices"] != null) parse_category_best_practices_and_send(data_report_callback_url, data_report_token, data_reportApplicationExtension, jsonObject, url_guid, application_name, environment_name, is_mobile, batchguid);
		if (jsonObject.categories.seo != null) parse_category_seo_and_send(data_report_callback_url, data_report_token, data_reportApplicationExtension, jsonObject, url_guid, application_name, environment_name, is_mobile, batchguid);
		if (jsonObject.categories.pwa != null) parse_category_pwa_and_send(data_report_callback_url, data_report_token, data_reportApplicationExtension, jsonObject, url_guid, application_name, environment_name, is_mobile, batchguid);
	}
	catch (err) {
		console.log('critical error');
	}
}


/*	execute_check_on_page_puppeteer
 *	This function preforms a lighthouse check on the given URL. 
 *	
 *	When a login_url is presented to the function, every check is preceded with a login on the system using
 *	the login_url, user_name and password. This way we know we always have the intended security cookies/tokens/etc. 
 *	
 *	-	The login_url is opened (and the process waits until it is loaded)
 *	-	The username_selector object is searched on the page and the username is entered
 *	-	The password_selector object is searched on the page and the password is entered
 *	-	The submit_selector object is searched on the page and the button is clicked
 *	-	The the process waits until the result is loaded
 *	-	In the same session the check_url is openen and tested using lighthouse
 *	-	After the check is finished, the results are returned to the calling process
 *	
 *	If no login is presented, the check_url is directly processed using lighthouse
 *
 *	NOTE:
 *		-	The application does NOT check if the login was successfull. Detecting a failure, would mean we have to 
 *			implement a lot more page specific logic to scrap the info on the page. Because every application will have
 *			its own specs, this is not a wanted situation in this process
 *		
 *		-	All the actions for the login are made with the default timeout of 30 seconds. Because we run these checks
 *			in async processes, this is not a real problem (it just takes longer :) ). The processes asserts to an error
 *			on the first timeout (so it is not failing multiple times on a page). There is a way to shorten this or even 
 *			make it configurable
 *		
 *			Possible way to do this:
 *				// Configure the navigation timeout for the page process
 *				await page.setDefaultNavigationTimeout(0);
 *			
 *				// Configure the navigation timeout for an action, in this case the timeout for waitForNagivation is set to 10 seconds
 *				await await page.waitForNavigation({ waitUntil: "networkidle0" ,timeout: 10000});
 * 
 *		-	Perhaps in the future, page information (especially on errors), could be illustrated with a result snapshot
 *			For instance using
 *			Image	:		await page.screenshot({ path: 'screenshot.png' });
 *			Pdf		:		await page.pdf({path: 'screenshot.pdf', format: 'A4'});
 *		
 *	Input
 *		check_url			:	The url of the page to check with lighthouse
 *		options				:	The lighthouse options (the port is overwritten here to the puppeteer port)
 *		login_url			:	Option page of the login_url 
 *		user_name			:	Mandatory is login_url is filled, the user_name of an user with a appropiate role
 *		username_selector	:	Mandatory is login_url is filled, the (HTML) id of the username input box
 *		password			:	Mandatory is login_url is filled, the password of an user with a appropiate role
 *		password_selector	:	Mandatory is login_url is filled, the (HTML) id of the password input box
 *		submit_selector		:	Mandatory is login_url is filled, the (HTML) id of the login submit button
 *	
 *	Output
 *		The output can be different (because of the loosely type nature of Javascript) based on the execution state
 *		When everything functions as it should it return an object, when an error occurs which will prevent normal
 *		execution, it will return an error string.
 *		
 *		Normal execution
 *		Object				:	JSON Lighthouse result
 *	
 *		Execution with error
 *		String				:	String containing the last known error
 *
 */
function execute_check_on_page_puppeteer(check_url, options, login_url, user_name, username_selector, password, password_selector, submit_selector, isLoginByClass) {

	return new Promise(function (resolve, reject) {

		let runnerResult = null;
		try {

			(async () => {
				try {
					system_notify_message("Starting puppeteer", STATUS_TYPE.LIGHTHOUSE_PUPPETEER);
					const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'], product: 'chrome' });
					if (login_url.trim().length > 0) {
						let execution_succesfull = true;
						//selection character is either # when we select on id or . if we select on class. 
						let selectionCharacter = '';
						if (isLoginByClass === "true") {
							selectionCharacter = '.';
						} else {
							selectionCharacter = '#';
                        }


						/* open a new tab in puppeteer, making sure we have a working canvas */
						const page = await browser.newPage().catch(() => execution_succesfull = false);
						if (!execution_succesfull) {
							system_notify_message("New page cannot be opened", STATUS_TYPE.LIGHTHOUSE_ERROR);
							throw "Cannot open page";
						}
						/* Go to the login page */
						if (await page.goto(login_url).then(() => true).catch(() => false)) {
							system_notify_message("Login page loaded", STATUS_TYPE.LIGHTHOUSE_LOGIN);
							let chromiumversion = await page.browser().version();
						} else {
							system_notify_message("Login page cannot be reached", STATUS_TYPE.LIGHTHOUSE_ERROR);
							throw "Cannot reach page " + login_url;
						}
						/* Wait until the page is loaded (no network communication...could give problem if there is a stream) */
						//			if (await page.waitForNavigation({ waitUntil: "networkidle0" }).then(() => true).catch(() => false)) {
						//				system_notify_message("Loading Login page completed", STATUS_TYPE.LIGHTHOUSE_LOGIN_WAIT);
						//			} else {
						//				system_notify_message("Network idle not found...try to find fields", STATUS_TYPE.LIGHTHOUSE_ERROR);
						//				//throw "Loading the page seems not to work";
						//			}
						/* Wait until we can find a visible version of the username_selector. This could be later for react (lazy load)*/
						if (await page.waitForSelector(selectionCharacter + username_selector, { visible: true }).then(() => true).catch(() => false)) {
							system_notify_message("User name field found " + selectionCharacter + username_selector, STATUS_TYPE.LIGHTHOUSE_LOGIN_CRED);
						} else {
							system_notify_message("User name field not found " + selectionCharacter + username_selector, STATUS_TYPE.LIGHTHOUSE_ERROR);
							throw "User name field not found " + selectionCharacter + username_selector;
						}
						/* Set the username in the input box*/
						if (await page.type(selectionCharacter + username_selector, user_name).then(() => true).catch(() => false)) {
							system_notify_message("User name field set " + selectionCharacter + username_selector, STATUS_TYPE.LIGHTHOUSE_LOGIN_CRED);
						} else {
							system_notify_message("User name field not set " + selectionCharacter + username_selector, STATUS_TYPE.LIGHTHOUSE_ERROR);
							throw "User name field not set " + selectionCharacter + username_selector;
						}
						/* Wait until we can find a visible version of the password_selector. This could be later for react (lazy load) 
						 * due to events triggered by the username box */
						if (await page.waitForSelector(selectionCharacter + password_selector, { visible: true }).then(() => true).catch(() => false)) {
							system_notify_message("Password name field found" + selectionCharacter + password_selector, STATUS_TYPE.LIGHTHOUSE_LOGIN_CRED);
						} else {
							system_notify_message("Password field not found" + selectionCharacter + password_selector, STATUS_TYPE.LIGHTHOUSE_ERROR);
							throw "Password field not found " + selectionCharacter + password_selector;
						}
						/* Set the password in the input box */
						if (await page.type(selectionCharacter + password_selector, password).then(() => true).catch(() => false)) {
							system_notify_message("Password field set" + selectionCharacter + password_selector, STATUS_TYPE.LIGHTHOUSE_LOGIN_CRED);
						} else {
							system_notify_message("Password field not set " + selectionCharacter + password_selector, STATUS_TYPE.LIGHTHOUSE_ERROR);
							throw "Password field not set " + selectionCharacter + password_selector;
						}
						/* Wait until we can find a visible version of the submit button. This could be later for react (lazy load)
						 * due to events triggered by the username and password box */
						if (await page.waitForSelector(selectionCharacter + submit_selector, { visible: true }).then(() => true).catch(() => false)) {
							system_notify_message("Submit button found " + selectionCharacter + submit_selector, STATUS_TYPE.LIGHTHOUSE_LOGIN_CRED);
						} else {
							system_notify_message("Submit button not found " + selectionCharacter + submit_selector, STATUS_TYPE.LIGHTHOUSE_ERROR);
							throw "Submit button not found " + selectionCharacter + submit_selector;
						}

						// do the clicking and the waiting in one promise to prevent the waitForNavigation from firing too early and causing Lighthouse to snapshot the login page
						await Promise.all([
							// Click on the submit button and perform login
							page.click(selectionCharacter + submit_selector),
							// Wait for the login to be completely handled and until the landing page has been fully loaded
							page.waitForNavigation({ waitUntil: "domcontentloaded" }),
						]).then(() => {
							system_notify_message("Login button clicked and network is idle", STATUS_TYPE.LIGHTHOUSE_LOGIN_CRED);
						}).catch(error => {
							system_notify_message("Login action failed because " + error.message, STATUS_TYPE.LIGHTHOUSE_ERROR);
							throw "Login action failed because " + error.message;
							console.error(error.message)
						});;

						//await page.screenshot({ path: 'example.png' }); /* You could save a screenshot to view the page after login */
						/* Close the current page */
						await page.close();
					}
					/* Set the lighthouse options to connect lighthouse to the puppeteer browser*/
					options.port = (new URL(browser.wsEndpoint())).port;
					options.disableStorageReset = true;
					system_notify_message("Execute lighthouse for " + options.output, STATUS_TYPE.LIGHTHOUSE_CHECK);
					/* Execute the lighthouse check on the given url */
					runnerResult = await lighthouse(check_url, options, myconfig);
					system_notify_message("lighthouse check done", STATUS_TYPE.LIGHTHOUSE_FINISHED);
					if (runnerResult.artifacts.PageLoadError != undefined && runnerResult.artifacts.PageLoadError.lhrRuntimeError === true) {
						//can't directly check on lhrRuntimeError because when there's no error this property is null

						throw "statuscode " + runnerResult.artifacts.PageLoadError.statusCode;
					}
					try {
						/* When we finished the process, kill the created Chrome instance and wait until it is finished */
						await browser.close();
					} catch (ex) {
						system_notify_message("Browser kill failed (no problem)" + ex, STATUS_TYPE.LIGHTHOUSE_ERROR);
					}
					/* Send the result to the calling process */
					resolve(runnerResult);
				} catch (ex) {
					/* Send the error to the calling process */
					reject(ex);
				}
			})();

		} catch (ex) {
			/* Send the error to the calling process */
			console.log(ex);
			system_notify_message("Lighthouse execution failed" + ex, STATUS_TYPE.LIGHTHOUSE_ERROR);
			reject(ex);
		}
	});
}

/*
 * execute_check_on_page
 * this function is used to check the page using lighthouse
 * First the chrome instance is started (remove --headless to see the execution of the tests)
 * The lighthouse options are set (categories and form factor)
 * 
 * After this, the lighthouse process is executed for a JSON reporting
 * The JSON part is evaluated on categories and send to the reporting server endpoint
 * 
 * After this action, the categories are evaluated and send to the processing engine (url_score_callback)
 * If one of the values is failing on the warning or error threshold, the lighthouse process is rerun using 
 * HTML as the reporting format. This HTML is send to the url_report_callback
 * 
 * During the execution of the checks, status information about the process is send to the url_status_callback_url
 * 
 * check_url				:	The url on which the lighthouse check is executed
 * check_categories			:	A JSON object (string array) containing the categories to check on
 * process_guid				:	The Guid of the process (group of URLs)
 * url_guid					:	The Guid of the URL
 * url_score_callback_url	:	The address to report the scores of an URL
 * url_status_callback_url	:	The address to report the status of execution of an URL
 * url_report_callback_url	:	The address to report the resuls of an URL
 * ismobile					:	Indicating if the check should be done as a Mobile (true) or Desktop (false)
 * warning_threshold		:	Value (0 - 100) indicating below which the results should trigger a warning state
 * error_threshold			:	Value (0 - 100) indicating below which the results should trigger an error state
 *								The current logic reacts when the warning is triggered (which should be higher)
 *								No logic at this moment is directly dependant of the error_threshold
 */
function execute_check_on_page(
	check_url,
	check_categories,
	process_guid,
	url_guid,
	url_score_callback_url,
	url_status_callback_url,
	url_report_callback_url,
	/*request_report_callback_url,*/
	data_report_callback_url,
	data_report_token,
	data_report_applicationExtension,
	ismobile,
	warning_threshold,
	error_threshold,
	slowDownCPU,
	networkThrottling,
	networkThrottlingMobile,
	login_path, user_name, username_selector, password, password_selector, submit_selector, application_name, environment_name,
	batchGuid,
	isLoginByClass
) {
	(async () => { /* Start the process asynchoon */
		/* Set the global server handling state to busy, holding off other checks */
		server_busy_state = true;
		/*	Set the lighthouse check parameters (Form factor, throttling and options like categories) */
		let form_factor = (ismobile ? "mobile" : "desktop");
		/* The browser process is executed elsewhere. Because of that we do not have a port, but we initialize it */
		/* We use both html and json, json makes the analysis easier while we need html for the report. The order in which we post this array is the order in which the results are returned to us */

		const options = { logLevel: 'error', output: ['html', 'json'], onlyCategories: check_categories, port: null, formFactor: form_factor };

		//add specific options for mobile / desktop
		//all throttling options go in one object that when ready will be added to the options object
		const throttlingOptions = new Object();

		//Change size of screen for desktop or enable CPU slowdown for mobile
		if (ismobile === false) {
			const screen_Emulation = { mobile: ismobile, width: 1920, height: 1080, deviceScaleFactor: 1 };
			options.screenEmulation = screen_Emulation;
			if (typeof networkThrottling == 'undefined' || networkThrottling == 0) {
				throttlingOptions.rttMs = 40;
			} else {
				try {
					let networkInt = parseInt(networkThrottling);
					throttlingOptions.rttMs = networkInt;
				} catch (e) {
					system_notify_message("Lighthouse preparation failed, could not cast " + networkThrottling + " to integer; fallback to default", STATUS_TYPE.LIGHTHOUSE_ERROR);
					throttlingOptions.rttMs = 40;
                }
			}
		} else {
			// if CPU Slowdown not configured we take a default value of 4 as Google uses this as default for mobile
		if (typeof slowDownCPU == 'undefined' || networkThrottling == 0 || networkThrottling == "") {
				throttlingOptions.cpuSlowdownMultiplier = 4
			} else {
				throttlingOptions.cpuSlowdownMultiplier = slowDownCPU;
			}
			// if network throttling not defined take default value of 150 as Google uses this as default for mobile
			if (typeof networkThrottlingMobile == 'undefined' || networkThrottlingMobile == 0) {
				throttlingOptions.rttMs = 150;

			} else {
				try {
					let networkInt = parseInt(networkThrottlingMobile);
					throttlingOptions.rttMs = networkInt;
				} catch (e) {
					system_notify_message("Lighthouse preparation failed, could not cast " + networkThrottlingMobile + " to integer; fallback to default", STATUS_TYPE.LIGHTHOUSE_ERROR);
					throttlingOptions.rttMs = 150;
				}
			}
		}
		//now add all throttling options to the options object
		options.throttling = throttlingOptions;

		let isError = false;
		let errMessage = "";
		system_notify_message("Coolmetrics version: 0.2.3. Compiled at 04/10/2021", STATUS_TYPE.INFO);
		try {
			system_notify_message('- getting : ' + check_url, STATUS_TYPE.PROCESS_STEP);
			try {
				/* Execute the lighthouse check and wait for it to complete */
				let runnerResult = await execute_check_on_page_puppeteer(check_url, options, login_path, user_name, username_selector, password, password_selector, submit_selector, isLoginByClass);
				/* when the process is executed we get a resulting object or an error_message back. If the return is a message (string) whe halt the process and return the message */
				if ((runnerResult == null) || (typeof runnerResult == "string")) {
					error_message = "Lighthouse check failed " + error_message;
					isError = true;
					throw error_message; /* this message needs to be handled within the async process */
				}
				// use the returned JSON for analysis
				const reportJson = runnerResult.report[1]; /* the return seems to be an object, so we retrieve the JSON */
				var jsonObject = JSON.parse(reportJson); /* make sure it is a JSON object */
				/* are there any errors detected during the execution */
				if (typeof jsonObject.runtimeError !== "undefined") {
					isError = true;
					system_notify_message('- Error detected: ', STATUS_TYPE.PROCESS_ERROR);
					/* determine error message or code */
					var error_message = "";
					if (typeof jsonObject.runtimeError.code != "undefined") {
						error_message += jsonObject.runtimeError.code + " ";
					}
					if (typeof jsonObject.runtimeError.message != "undefined") {
						error_message += jsonObject.runtimeError.message
					}
					if (error_message.length > 0) {
						system_notify_message("Message : " + error_message, STATUS_TYPE.PROCESS_ERROR);
					}
					/* Send information to the callback urls for url score and status */
					//send_message_to_url(url_score_callback_url, { process: process_guid, url: url_guid, iserror: true, busy: false, finished: true, message: "error", date_time: new Date(), order: Date.now() }, "POST");
					send_message_to_url(url_status_callback_url, { process: process_guid, url: url_guid, iserror: true, busy: false, finished: true, message: "error", date_time: new Date(), order: Date.now() }, "POST", batchGuid);
				} else {
					/* No errors detected */
					system_notify_message('- sending data', STATUS_TYPE.PROCESS_STEP);
					parse_categories_and_send(data_report_callback_url, data_report_token, data_report_applicationExtension, jsonObject, url_guid, application_name, environment_name, ismobile, batchGuid); /* send the extracted category data to the report server */

					/* We can send the complete JSON report 
					 * 
					 * If needed yoou can Write the report to disk using the code below
					 * fs.writeFileSync('lhreport-' + i + '.json', reportJson);
					 * 
					 */
					//	send_complete_json_report(data_report_callback_url, reportJson, url_guid);
					system_notify_message('- Report is done for: ' + runnerResult.lhr.finalUrl, STATUS_TYPE.PROCESS_STEP);

					/* if the url_score_callback_url is filled, we can send the scores to the calling service */
					if (url_score_callback_url.trim().length > 0) {
						/* 
						 * Sending the scores has to be done per category. 
						 * The categories can not be iterated (bummer), and have to be written out at the moment
						 * So we have to check if they are present, and if they are, we can report the results
						 */
						var cat_scores = { scores: [] };
						if (runnerResult.lhr.categories["performance"] != null) {
							//send_message_to_url(url_score_callback_url, { process: process_guid, url: url_guid, iserror: false, busy: true, finished: false, message: "score", date_time: new Date(), order: Date.now(), score: runnerResult.lhr.categories["performance"].score * 100, metric: "performance" }, "POST");
							cat_scores.scores.push({ metric: "performance", score: runnerResult.lhr.categories["performance"].score * 100 });
						}
						if (runnerResult.lhr.categories["accessibility"] != null) {
							//send_message_to_url(url_score_callback_url, { process: process_guid, url: url_guid, iserror: false, busy: true, finished: false, message: "score", date_time: new Date(), order: Date.now(), score: runnerResult.lhr.categories["accessibility"].score * 100, metric: "accessibility" }, "POST");
							cat_scores.scores.push({ metric: "accessibility", score: runnerResult.lhr.categories["accessibility"].score * 100 });
						}
						if (runnerResult.lhr.categories["pwa"] != null) {
							//send_message_to_url(url_score_callback_url, { process: process_guid, url: url_guid, iserror: false, busy: true, finished: false, message: "score", date_time: new Date(), order: Date.now(), score: runnerResult.lhr.categories["pwa"].score * 100, metric: "pwa" }, "POST");
							cat_scores.scores.push({ metric: "pwa", score: runnerResult.lhr.categories["pwa"].score * 100 });
						}
						if (runnerResult.lhr.categories["seo"] != null) {
							//send_message_to_url(url_score_callback_url, { process: process_guid, url: url_guid, iserror: false, busy: true, finished: false, message: "score", date_time: new Date(), order: Date.now(), score: runnerResult.lhr.categories["seo"].score * 100, metric: "seo" }, "POST");
							cat_scores.scores.push({ metric: "seo", score: runnerResult.lhr.categories["seo"].score * 100 });
						}
						if (runnerResult.lhr.categories["best-practices"] != null) {
							//send_message_to_url(url_score_callback_url, { process: process_guid, url: url_guid, iserror: false, busy: true, finished: false, message: "score", date_time: new Date(), order: Date.now(), score: runnerResult.lhr.categories["best-practices"].score * 100, metric: "best-practices" }, "POST");
							cat_scores.scores.push({ metric: "best-practices", score: runnerResult.lhr.categories["best-practices"].score * 100 });
						}

						/* only send it once all the categories, less payload */
						send_message_to_url(url_score_callback_url,
							{
								process: process_guid,
								url: url_guid,
								IsMobile: ismobile,
								iserror: false,
								busy: true,
								finished: false,
								message: "scores",
								date_time: new Date(),
								order: Date.now(),
								scores: cat_scores.scores
							}, "POST", batchGuid);


						/* After we have reported the results, we can determine if we need to send the Lighthouse report with details
						 * to the calling service. This report contains all the information on which the scores are based. Including
						 * ways to improve the score for the specific page
						 */

						if (check_category_result_failed(warning_threshold, runnerResult.lhr.categories)) {
							system_notify_message('- A Score is below thresholds ', STATUS_TYPE.PROCESS_THRESHOLD);
							if (url_report_callback_url.trim().length !== 0) {
								let buff = new Buffer.from(runnerResult.report[0]);
								let base64data = buff.toString('base64');

								system_notify_message('- Sending the complete report - Start', STATUS_TYPE.PROCESS_THRESHOLD);
								/* send the base64 encoded data to the url_report_callback_url */
								send_data_to_url(url_report_callback_url, process_guid, url_guid, base64data, "POST", batchGuid);
								system_notify_message('- Sending the complete report - Completed', STATUS_TYPE.PROCESS_THRESHOLD);
							}
						}
					}
					/* Give a score summary for to the console  in case anybody is watching :) */
					system_notify_message('- score results for ' + check_url, STATUS_TYPE.PROCESS_SCORE);
					if (runnerResult.lhr.categories["performance"] != null) system_notify_message('- Performance score was ' + runnerResult.lhr.categories["performance"].score * 100, STATUS_TYPE.PROCESS_SCORE);
					if (runnerResult.lhr.categories["accessibility"] != null) system_notify_message('- Accessibility score was ' + runnerResult.lhr.categories["accessibility"].score * 100, STATUS_TYPE.PROCESS_SCORE);
					if (runnerResult.lhr.categories["pwa"] != null) system_notify_message('- PWA score was ' + runnerResult.lhr.categories["pwa"].score * 100, STATUS_TYPE.PROCESS_SCORE);
					if (runnerResult.lhr.categories["seo"] != null) system_notify_message('- SEO score was ' + runnerResult.lhr.categories["seo"].score * 100, STATUS_TYPE.PROCESS_SCORE);
					if (runnerResult.lhr.categories["best-practices"] != null) system_notify_message('- Best practices score was ' + runnerResult.lhr.categories["best-practices"].score * 100, STATUS_TYPE.PROCESS_SCORE);
				}
			} catch (err) {
				/* handle the error */
				system_notify_message("Check on page getting : " + err, STATUS_TYPE.PROCESS_ERROR);
				isError = true;
				errMessage = err;
			}

		} catch (err) {
			/* handle the error */
			system_notify_message("Check on page : " + err, STATUS_TYPE.PROCESS_ERROR);
			isError = true;
			errMessage = err;
		}

		/* The page check is complete, so we can report the processing of the url_guid is done. First we inform the url is done, then we inform the request (group) this URL is finished */

		/* JLA: removed reporting on request level */
		/*
		send_message_to_url(request_report_callback_url, { process: process_guid, url: url_guid, iserror: isError, busy: false, finished: true, message: "completed", date_time: new Date(), order: Date.now() }, "POST");
		*/
		if (!isError) {
			send_message_to_url(url_status_callback_url, { process: process_guid, url: url_guid, iserror: isError, busy: false, finished: true, message: "completed", date_time: new Date(), order: Date.now() }, "POST", batchGuid);
		} else {
			send_message_to_url(url_status_callback_url, { process: process_guid, url: url_guid, iserror: isError, busy: false, finished: true, message: "completed with errors: " + errMessage, date_time: new Date(), order: Date.now() }, "POST", batchGuid);
		}

		system_notify_message("Page Check Finished - " + check_url, STATUS_TYPE.PROCESS_FINISHED);
		/* We set the server busy state to false, therefore inform the HTTP Server, we are ready to process another url */
		server_busy_state = false;
	})();
}

/*
 * check_category_score_failed
 * This function checks if the score is equal or lower than the score_threshold
 * 
 * input:
 * score_threshold	:	The threshold of the score
 * score			:	The achieved score
 * 
 * output:
 * boolean			:	True, score is equal or below threshold
 *						False, score is higher than threshold
 *
 */
function check_category_score_failed(score_threshold, score) {
	return score <= score_threshold;
}

/*
 * check_category_result_failed
 * This function checks if the score for at least one category is equal or lower than the score_threshold
 *
 * input:
 * score_threshold	:	The threshold of the score
 * score			:	The achieved score
 *
 * output:
 * boolean			:	True, score is equal or below threshold
 *						False, score is higher than threshold
 *
 */
function check_category_result_failed(score_threshold, categories) {
	let return_bool = false;

	if (categories["performance"] != null)
		return_bool = return_bool || check_category_score_failed(score_threshold, categories["performance"].score * 100);
	if (categories["accessibility"] != null)
		return_bool = return_bool || check_category_score_failed(score_threshold, categories["accessibility"].score * 100);
	if (categories["pwa"] != null)
		return_bool = return_bool || check_category_score_failed(score_threshold, categories["pwa"].score * 100);
	if (categories["seo"] != null)
		return_bool = return_bool || check_category_score_failed(score_threshold, categories["seo"].score * 100);
	if (categories["best-practices"] != null)
		return_bool = return_bool || check_category_score_failed(score_threshold, categories["best-practices"].score * 100);
	return return_bool;
}

/*
 * result_message_add_line
 * This function returns a JSON formatted string (not JSON Object!!) with a message as a line
 * This is used to report multi line messages. This way we can return multiple messages and
 * still identify the differences between the messages if needed.
 * 
 * Input:
 * message	:	The currently registered messages in a JSON array like format ( {line:text}, {line:text}, etc)
 * new_line	:	The new message which should be added to the existing list
 * 
 * Output:
 * string	:	the input message with the new_line added (in a JSON array like format)
 */
function result_message_add_line(message, new_line) {
	message += (message.length > 0 ? "," : "") + "{'line':'" + new_line + "'}";
	return message;
}

/*
 * http_start_process
 * this function handles calls to the http server on the address start_process
 * It basically handles the calls for the checks using lighthouse and provides the core
 * functionality of this application
 * 
 * Input:
 * req		:	HTTP Request object
 */
function http_start_process(req) {
	var result = {};

	/* first initalize the local variables to a default state */
	result.code = 200;	/* By default we assume a 200 result code */
	result.iserror = false;
	result.issuccess = true;
	result.isbusy = false;
	result.message = "";

	let check_url = "";
	let process_guid = "";
	let url_guid = "";
	let categories = "";

	/* JLA: removed reporting on request level */
	/*let request_report_callback_url = "";*/
	/*let request_status_callback_url = "";*/

	let url_score_callback_url = "";
	let url_status_callback_url = "";
	let url_report_callback_url = "";
	let data_report_callback_url = "";
	let data_report_applicationExtension = "";
	let data_report_token = ""; 
	let user = "";
	let enc_password = "";
	let aes_iv = "";
	let password = "";
	let login_page = "";
	let user_selector = "";
	let password_selector = "";
	let submit_selector = "";
	let application_name = "";
	let environment_name = "";
	let warning_threshold = 0;
	let error_threshold = 0;
	let ismobile = false;
	let slowDownCPU;
	let networkThrottling;
	let networkThrottlingMobile;
	let batchGuid = ""
	let isLoginByclass = false;

	try {
		/* Only react to HTTP Post */
		if (req.method.toUpperCase() == "POST") {

			/* set url stats, that we have started */
			//send_message_to_url(url_status_callback_url, { process: process_guid, url: url_guid, iserror: false, busy: true, finished: false, message: "started", date_time: new Date(), order: Date.now() }, "POST", batchGuid);

			/* check the header variables existance */
			result = lhcs_tools.check_header_value(result, req, "check_url", true);
			/*if (result.code == 200) result = lhcs_tools.check_header_value(result, req, "process_guid", true);*/
			if (result.code == 200) result = lhcs_tools.check_header_value(result, req, "url_guid", true);
			if (result.code == 200) result = lhcs_tools.check_header_value(result, req, "categories", true);
			if (result.code == 200) result = lhcs_tools.check_header_value(result, req, "ismobile", false);
			if (result.code == 200) result = lhcs_tools.check_header_value(result, req, "application_name", true);
			if (result.code == 200) result = lhcs_tools.check_header_value(result, req, "environment_name", true);

			/* check the callback URLs */
			if (result.code == 200) result = lhcs_tools.check_header_value(result, req, "data_report_callback_url", false);
			if (result.code == 200) result = lhcs_tools.check_header_value(result, req, "url_score_callback_url", true);
			if (result.code == 200) result = lhcs_tools.check_header_value(result, req, "url_status_callback_url", true);
			if (result.code == 200) result = lhcs_tools.check_header_value(result, req, "url_report_callback_url", true);
			if (result.code == 200) result = lhcs_tools.check_header_value(result, req, "data_report_applicationextension", false);
			if (result.code == 200) result = lhcs_tools.check_header_value(result, req, "data_report_token", false);
			/* check the thresholds */
			if (result.code == 200) result = lhcs_tools.check_header_value(result, req, "warning_threshold", false);
			if (result.code == 200) result = lhcs_tools.check_header_value(result, req, "error_threshold", false);
			/* check for Batch guid (variable used to authenticate to callback urls)*/
			if (result.code == 200) result = lhcs_tools.check_header_value(result, req, "batchguid", false);

			/* If the headers are conform the specs and we are still have a result code of 200, we can continue */
			if (result.code == 200) {
				/* retrieve the header variables */
				/* general settings */
				check_url = lhcs_tools.get_header_value(req, "check_url");
				process_guid = 'dummy'; //lhcs_tools.get_header_value(req, "process_guid");
				url_guid = lhcs_tools.get_header_value(req, "url_guid");
				categories = lhcs_tools.get_header_value(req, "categories");
				ismobile = lhcs_tools.get_header_value_boolean(req, "ismobile");
				application_name = lhcs_tools.get_header_value(req, "application_name");
				environment_name = lhcs_tools.get_header_value(req, "environment_name");

				/* Callback urls */
				url_score_callback_url = lhcs_tools.get_header_value(req, "url_score_callback_url");
				url_status_callback_url = lhcs_tools.get_header_value(req, "url_status_callback_url");
				url_report_callback_url = lhcs_tools.get_header_value(req, "url_report_callback_url");
				data_report_callback_url = lhcs_tools.get_header_value(req, "data_report_callback_url");
				data_report_token = lhcs_tools.get_header_value(req, "data_report_token");
				data_report_applicationExtension = lhcs_tools.get_header_value(req, "data_report_applicationextension");
				batchGuid = lhcs_tools.get_header_value(req, "batchguid");


				/* Thresholds */
				warning_threshold = lhcs_tools.get_header_value_integer(req, "warning_threshold", 70);
				error_threshold = lhcs_tools.get_header_value_integer(req, "error_threshold", 60);
				/* Credentials */
				user = lhcs_tools.get_header_value(req, "user");
				enc_password = lhcs_tools.get_header_value(req, "password");
				aes_iv = lhcs_tools.get_header_value(req, "aes_iv");
				password = decryptPassword(enc_password, aes_iv);

				login_page = lhcs_tools.get_header_value(req, "login_page");
				user_selector = lhcs_tools.get_header_value(req, "user_selector");
				password_selector = lhcs_tools.get_header_value(req, "password_selector");
				submit_selector = lhcs_tools.get_header_value(req, "submit_selector");

				isLoginByclass = lhcs_tools.get_header_value(req, "is_login_by_class");

				/* Mobile and performance flags */
				slowDownCPU = lhcs_tools.get_header_value(req, "cpu_slowdown");
				networkThrottling = lhcs_tools.get_header_value(req, "network_throttling");
				networkThrottlingMobile = lhcs_tools.get_header_value(req, "network_throttling_mobile");
				/* Mobile and performance flags */

				system_notify_message("- Check url : " + check_url, STATUS_TYPE.INFO);
				system_notify_message("- Process Guid : " + process_guid, STATUS_TYPE.INFO);
				system_notify_message("- Is Mobile : " + ismobile, STATUS_TYPE.INFO);
				system_notify_message("- Application : " + application_name, STATUS_TYPE.INFO);
				system_notify_message("- Environment : " + environment_name, STATUS_TYPE.INFO);

				/* Code beneath can be used for 
				 * 
				 * system_notify_message("- User : " + user, STATUS_TYPE.INFO);
				 * system_notify_message("- Password : " + password, STATUS_TYPE.INFO);
				 * system_notify_message("- login_page : " + login_page, STATUS_TYPE.INFO);
				 * system_notify_message("- user_selector : " + user_selector, STATUS_TYPE.INFO);
				 * system_notify_message("- password_selector : " + password_selector, STATUS_TYPE.INFO);
				 * system_notify_message("- submit_selector : " + submit_selector, STATUS_TYPE.INFO);
				 */

				/* create the check structure */
				var checks = [];
				try {
					checks = JSON.parse(categories);
				} catch (ex) {
					/* something went wrong with the parsing of the categories, so we set the result code */
					result.code = 400;
					result.message = ex;
					system_notify_message("Checks : " + ex, STATUS_TYPE.PROCESS_ERROR);
				}

				/* 
				 * validation is ok, now we actually can tell we are running lighthouse
				 * send the status information to the request server 
				 */
				send_message_to_url(url_status_callback_url, { process: process_guid, url: url_guid, iserror: false, busy: true, finished: false, message: "running", date_time: new Date(), order: Date.now() }, "POST", batchGuid);
				/* If we still have a result code of 200, we can start checking the page. This is an async process and wil return instantly */
				if (result.code == 200) {
					execute_check_on_page(
						check_url,
						checks,
						process_guid,
						url_guid,
						url_score_callback_url,
						url_status_callback_url,
						url_report_callback_url,
						data_report_callback_url,
						data_report_token, 
						data_report_applicationExtension,
						ismobile,
						warning_threshold,
						error_threshold,
						slowDownCPU,
						networkThrottling,
						networkThrottlingMobile,
						login_page,
						user,
						user_selector,
						password,
						password_selector,
						submit_selector, application_name, environment_name,
						batchGuid, 
						isLoginByclass
					);
				}
			}
		} else {
			result.message = "Method not allowed";
			result.code = 405;	/* Set the error code to server error */
			result.iserror = true; /* Inform an error has occured */
			result.issuccess = false; /* Inform there is no success, which could be different from error*/
			result.isbusy = false; /* disable the busy flag */

		}
	} catch (ex) {
		system_notify_message("Process : " + ex, STATUS_TYPE.PROCESS_ERROR);
		/* create a result for the webserver handler*/
		result.message = result_message_add_line(result.message, ex);
		result.code = 503;	/* Set the error code to server error */
		result.iserror = true; /* Inform an error has occured */
		result.issuccess = false; /* Inform there is no success, which could be different from error*/
		result.isbusy = false; /* disable the busy flag */
		/* an error has occured, inform the request server */
		send_message_to_url(url_status_callback_url, { process: process_guid, url: url_guid, iserror: true, busy: false, finished: true, message: ex, order: Date.now() }, "POST", batchGuid);

		// Set server_busy_state to false just in case our exception handler did not catch the exception in function execute_check_on_page()
		server_busy_state = false
	}
	system_notify_message(" - Pre processing finished for " + check_url, STATUS_TYPE.PROCESS_STEP);
	return result;
}

/*
 * http_server_busy
 * this function handles calls to the http server on the address server_busy
 * and also handles start_process calls when the server is already active on a check, 
 * When the start_process is called, and it returns a server busy, it means the calling 
 * agent should try it again at a later moment in time.
 *
 * Input:
 * req		:	HTTP Request object
 */
function http_server_busy(req) {
	var result = {};
	result.code = 429;
	result.message = "";
	result.message = result_message_add_line(result.message, "Server Busy: " + server_busy_state);
	let header_result = lhcs_tools.check_header_value(result, req, "check_url", false);
	if (header_result.code === 200) {
		let check_url = lhcs_tools.get_header_value(req, "check_url");
		system_notify_message("HTTP Call received for " + check_url, STATUS_TYPE.HTTP_SERVER_BUSY);
	}
	result.iserror = false;
	result.issuccess = false;
	result.isbusy = true;
	system_notify_message("HTTP Call received, but server busy", STATUS_TYPE.HTTP_SERVER_BUSY);
	return result;
}

/* simple check on the rqeuest, return a 200, because we are alive */
function http_server_alive() {
	var result = {};
	result.code = 200;
	result.message = "";
	result.message = result_message_add_line(result.message, "Server Busy: " + server_busy_state);
	result.iserror = false;
	result.issuccess = true;
	result.isbusy = /*server_busy_state*/true;
	system_notify_message("HTTP Call received, alive check", STATUS_TYPE.HTTP_SERVER_INCOMING);
	return result;
}



function lookupPromise(callback_url) {
	return new Promise((resolve, reject) => {
		const options = {
			all: true,
		};
		dns.lookup(callback_url, options,  (err, address, family) => {
			if (err) reject(err);
			resolve(address);
		});
	});
};

const dnsPromises = dns.promises;
function dnsLookup(callback_url) {
	var result = {};
	result.code = 200;
	result.message = "";
	result.iserror = false;
	result.issuccess = true;
	result.isbusy = false;

	// Asynchronous function 
	system_notify_message("starting ", STATUS_TYPE.INFO);

	(async function () {

		try {
			const options = {
				all: true,
			};

			// Address from lookup function
			const addresses = await dns.lookup('geeksforgeeks.org', options);
			// Printing  addresses
			system_notify_message("cheese: " + addresses, STATUS_TYPE.INFO);
		}
		catch (err) {
				system_notify_message("err: " + err.code + ":" + err.message, STATUS_TYPE.INFO);
				result.message = err.code + ":" + err.message;
				result.iserror = true;
				result.issuccess = false;
		}

	})();
	system_notify_message("finished ", STATUS_TYPE.INFO);

	return result;
}


/* 
	this is to see if the node.js server can reach the calling party.
	so we need to call dns.lookup (or something similar)
*/
function http_server_alive_callback(req) {

	/* we always return 200 */
	var result = {};
	result.code = 200;
	result.message = "";
	result.iserror = false;
	result.issuccess = true;
	result.isbusy = false;
	system_notify_message("Alive_callback check", STATUS_TYPE.HTTP_SERVER_INCOMING);

	try {
		// fetching the domain we need to call
		var callback_url = lhcs_tools.get_header_value(req, "callback_url");
		result.message = result_message_add_line(result.message, "callback_url: " + callback_url);
		system_notify_message("starting dns promise", STATUS_TYPE.INFO);

		let res = dnsLookup(callback_url);
		system_notify_message("end" + res.message, STATUS_TYPE.INFO);
		result.message = result_message_add_line(result.message, "beep boop: " + res);
	} catch (ex) {
		result.code = 200;
		result.message = "unhandled exception " + ex;
		result.iserror = true;
		result.issuccess = false;
	}
	system_notify_message("returning", STATUS_TYPE.INFO);
	return result;
}

/*
 * websocket_type_triggers_update
 * This function returns a true if it should set the update trigger for a websocket message
 * 
 * input
 * type		:	Type of message
 * 
 * Output
 * boolean	:	true if it should trigger an update, false if it is just informational
 * 
 */
function websocket_type_triggers_update(type) {
	let trigger_update = false;

	switch (type) {
		case STATUS_TYPE.INFO: trigger_update = false; break;
		case STATUS_TYPE.CONNECTION: trigger_update = true; break;
		case STATUS_TYPE.PROCESS: trigger_update = true; break;
		case STATUS_TYPE.MESSAGE: trigger_update = false; break;
		case STATUS_TYPE.SERVER: trigger_update = false; break;
		case STATUS_TYPE.ERROR: trigger_update = true; break;
		case STATUS_TYPE.UNKNOWN: trigger_update = false; break;
		case STATUS_TYPE.PROCESS_STEP: trigger_update = false; break;
		case STATUS_TYPE.PROCESS_ERROR: trigger_update = true; break;
		case STATUS_TYPE.PROCESS_RESULT: trigger_update = true; break;
		case STATUS_TYPE.PROCESS_SCORE: trigger_update = true; break;
		case STATUS_TYPE.PROCESS_START: trigger_update = true; break;
		case STATUS_TYPE.PROCESS_FINISHED: trigger_update = true; break;
		case STATUS_TYPE.PROCESS_THRESHOLD: trigger_update = false; break;
		case STATUS_TYPE.SENDING: trigger_update = false; break;
		case STATUS_TYPE.SENDING_ERROR: trigger_update = false; break;
		case STATUS_TYPE.HTTP_SERVER: trigger_update = false; break;
		case STATUS_TYPE.HTTP_SERVER_ERROR: trigger_update = false; break;
		case STATUS_TYPE.HTTP_SERVER_NOTFOUND: trigger_update = false; break;
		case STATUS_TYPE.HTTP_SERVER_INCOMING: trigger_update = false; break;
		case STATUS_TYPE.HTTP_SERVER_OUTGOING: trigger_update = false; break;
		case STATUS_TYPE.HTTP_SERVER_BUSY: trigger_update = false; break;
		case STATUS_TYPE.LIGHTHOUSE_START: trigger_update = false; break;
		case STATUS_TYPE.LIGHTHOUSE_PUPPETEER: trigger_update = false; break;
		case STATUS_TYPE.LIGHTHOUSE_LOGIN: trigger_update = false; break;
		case STATUS_TYPE.LIGHTHOUSE_LOGIN_WAIT: trigger_update = false; break;
		case STATUS_TYPE.LIGHTHOUSE_LOGIN_CRED: trigger_update = false; break;
		case STATUS_TYPE.LIGHTHOUSE_CHECK: trigger_update = false; break;
		case STATUS_TYPE.LIGHTHOUSE_FINISHED: trigger_update = false; break;
		case STATUS_TYPE.LIGHTHOUSE_ERROR: trigger_update = false; break;

	}
	return trigger_update;
}

/*
 * websocket_format_message_to_json
 * this function formats a message and a type into a JSON object
 *
 * Input:
 * type		:	Type of the message (use STATUS_TYPE enum)
 * message	:	Message to give
 * 
 * Output:
 * JSON		:	Json object with the type and the message as attributes
 */
function websocket_format_message_to_json(type, message) {
	var message_struct = {};
	message_struct.type = type;
	message_struct.message = message;
	message_struct.isupdate = websocket_type_triggers_update(type);
	return JSON.stringify(message_struct);
}
/*
 * system_notify_message
 * this function notifies the message via console and the websocket
 *
 * Input:
 * type		:	Type of the message (use STATUS_TYPE enum)
 * message	:	Message to give
 *
 */
function system_notify_message(message, type) {
	var msg = "";
	/* First we check if there is a parent process we need to inform */
	if (typeof parentPort != "undefined") {
		if (parentPort != null) {
			parentPort.postMessage(message);
		}
	}
	try {
		/* If no type is given, we set the type to Unknown */
		if (typeof type === "undefined") {
			type = STATUS_TYPE.UNKNOWN;
		}
		/* We format the message into a JSON structure */
		msg = websocket_format_message_to_json(type, message);
		/* We send the message to the websocket_worker, which will distribute it to the listeners */
		websocket_worker.postMessage(msg);
	} catch (ex) {
		/* Something gone wrong, so we inform the error to the listeners */
		type = STATUS_TYPE.ERROR;
		msg = websocket_format_message_to_json(STATUS_TYPE.ERROR, message);
		message = ex;
		try {
			websocket_worker.postMessage(msg);
		} catch (websocket_ex) {
			/* the websocket seems to fail :( */
		}
	};
	/* The world is informed, now show the info on the console, in case anybody is watching it */
	if (typeof message === "object") {
		message = JSON.stringify(message);
	}
	try {
		/* create a timestamp string */
		let now = new Date();
		let dateString = now.getHours().toString().padStart(2, "0") + ":" + now.getMinutes().toString().padStart(2, "0") + ":" + now.getSeconds().toString().padStart(2, "0") + "." + now.getMilliseconds().toString().padStart(3, "0");
		/* reset the string start */
		let log_str_start = 0;

		do {
			/* we take a part of the message we can display on one line. This is done using the constant log_offset */
			let log_show_message = message.slice(log_str_start, log_str_start + log_offset);
			if (log_str_start === 0) {
				/* first line, so we show the timestamp and type */
				console.info(
					system_set_console_output_field("%s", type, false) +
					system_set_console_output_field("%s", type, false) +
					system_set_console_output_field("%s ", type, false),
					dateString.padEnd(15, " "), type.padEnd(25, " "), log_show_message.padEnd(log_offset, " "));

			} else {
				/* Not the first line, so we only show the message part */
				console.info(
					system_set_console_output_field("%s", type, true) +
					system_set_console_output_field("%s", type, true) +
					system_set_console_output_field("%s ", type, false),
					"".padEnd(15, " "), "".padEnd(25, " "), log_show_message.padEnd(log_offset, " "));
			}

			log_str_start += log_offset; /* raise the start with the log_offset */
		} while (log_str_start < message.length); /* as long as the start is smaller than the length of the message, we need to show another line */
	} catch (ex) {
		console.error(ex);
	}

}
/*
 * system_set_console_output_field
 * This function formats a string based on the type. It pre/post fixes the string to make it look good
 * in the console output window. It also set some fore and background color to identify groups or
 * important messages. This is done with the chalk library, which creates the special characters needed
 * to format everything and returns it in a string
 * 
 * We says we do not take our administrators seriously? :)
 * 
 * Input:
 * field_string		:	string with the message to show
 * type				:	The line type of the message (use STATUS_TYPE enum)
 * isempty			:	This wil result in a black line if true (ignoring the type and field_string), if false show the field_string
 * 
 * Output:
 * string			:	The formatted field message, including control codes for coloring
 */
function system_set_console_output_field(field_string, type, isempty) {
	let return_string = "";
	let string_postfix = chalk.black(chalk.bgBlack(" ")); /* After each field_string we show this string to create some kind of cells */
	field_string = " " + field_string; /* We place a space in front of the field_string, purely aestethics. kinda padding-left */
	if (isempty) {
		/* just show a black line */
		return chalk.black(chalk.bgBlack(field_string)) + chalk.black(chalk.bgBlack(" "));
	}
	/* based on the type we format the string */
	switch (type) {
		case STATUS_TYPE.PROCESS_ERROR:
			return_string = chalk.white(chalk.bgRedBright(field_string)) + string_postfix;
			break;
		case STATUS_TYPE.ERROR:
			return_string = chalk.white(chalk.bgRedBright(field_string)) + string_postfix;
			break;
		case STATUS_TYPE.INFO:
			return_string = chalk.black(chalk.bgCyan(field_string)) + string_postfix;
			break;
		case STATUS_TYPE.CONNECTION:
			return_string = chalk.black(chalk.bgWhite(field_string)) + string_postfix;
			break;
		case STATUS_TYPE.PROCESS:
			return_string = chalk.black(chalk.bgGreen(field_string)) + string_postfix;
			break;
		case STATUS_TYPE.MESSAGE:
			return_string = chalk.black(chalk.bgCyan(field_string)) + string_postfix;
			break;
		case STATUS_TYPE.SERVER:
			return_string = chalk.black(chalk.bgYellow(field_string)) + string_postfix;
			break;
		case STATUS_TYPE.UNKNOWN:
			return_string = chalk.black(chalk.bgYellow(field_string)) + string_postfix;
			break;
		case STATUS_TYPE.PROCESS_STEP:
			return_string = chalk.white(chalk.bgCyan(field_string)) + string_postfix;
			break;
		case STATUS_TYPE.PROCESS_RESULT:
			return_string = chalk.black(chalk.bgYellow(field_string)) + string_postfix;
			break;
		case STATUS_TYPE.PROCESS_SCORE:
			return_string = chalk.black(chalk.bgYellow(field_string)) + string_postfix;
			break;
		case STATUS_TYPE.PROCESS_THRESHOLD:
			return_string = chalk.red(chalk.bgYellow(field_string)) + string_postfix;
			break;
		case STATUS_TYPE.SENDING:
			return_string = chalk.black(chalk.bgCyan(field_string)) + string_postfix;
			break;
		case STATUS_TYPE.HTTP_SERVER:
			return_string = chalk.black(chalk.bgBlackBright(field_string)) + string_postfix;
			break;
		case STATUS_TYPE.HTTP_SERVER_ERROR:
			return_string = chalk.white(chalk.bgRedBright(field_string)) + string_postfix;
			break;
		case STATUS_TYPE.SENDING_ERROR:
			return_string = chalk.white(chalk.bgRedBright(field_string)) + string_postfix;
			break;
		case STATUS_TYPE.HTTP_SERVER_NOTFOUND:
			return_string = chalk.white(chalk.bgRedBright(field_string)) + string_postfix;
			break;
		case STATUS_TYPE.HTTP_SERVER_INCOMING:
			return_string = chalk.blue(chalk.bgBlack(field_string)) + string_postfix;
			break;
		case STATUS_TYPE.HTTP_SERVER_OUTGOING:
			return_string = chalk.green(chalk.bgBlack(field_string)) + string_postfix;
			break;
		case STATUS_TYPE.PROCESS_START:
			return_string = chalk.white(chalk.bgBlackBright(field_string)) + string_postfix;
			break;
		case STATUS_TYPE.PROCESS_FINISHED:
			return_string = chalk.white(chalk.bgBlackBright(field_string)) + string_postfix;
			break;
		case STATUS_TYPE.HTTP_SERVER_BUSY:
			return_string = chalk.red(chalk.bgYellow(field_string)) + string_postfix;
			break;
		case STATUS_TYPE.LIGHTHOUSE_CHECK:
			return_string = chalk.white(chalk.bgMagenta(field_string)) + string_postfix;
			break;
		case STATUS_TYPE.LIGHTHOUSE_ERROR:
			return_string = chalk.white(chalk.bgMagenta(field_string)) + string_postfix;
			break;
		case STATUS_TYPE.LIGHTHOUSE_FINISHED:
			return_string = chalk.white(chalk.bgMagenta(field_string)) + string_postfix;
			break;
		case STATUS_TYPE.LIGHTHOUSE_LOGIN:
			return_string = chalk.white(chalk.bgMagenta(field_string)) + string_postfix;
			break;
		case STATUS_TYPE.LIGHTHOUSE_LOGIN_CRED:
			return_string = chalk.white(chalk.bgMagenta(field_string)) + string_postfix;
			break;
		case STATUS_TYPE.LIGHTHOUSE_LOGIN_WAIT:
			return_string = chalk.white(chalk.bgMagenta(field_string)) + string_postfix;
			break;
		case STATUS_TYPE.LIGHTHOUSE_PUPPETEER:
			return_string = chalk.white(chalk.bgMagenta(field_string)) + string_postfix;
			break;
		case STATUS_TYPE.LIGHTHOUSE_START:
			return_string = chalk.red(chalk.bgMagenta(field_string)) + string_postfix;
			break;

		default:
			return_string = chalk.yellow(chalk.bgBlue(field_string)) + string_postfix;
	}
	return return_string;
}

/* The code beneath is executed when the application is started */
console.clear(); /* clearing the console and inform the user the server deamon is created*/
system_notify_message("Create HTTP server deamon", STATUS_TYPE.HTTP_SERVER);

/* define websocket message received, if needed
 * At this moment the handler is empty because every message is already displayed and there are no other senders
 */
websocket_worker.on('message', (message) => {
	//	console.log("from websocket: " + message);
	//	console.log(message);  
});

/* Here we create a listener for the HTTP server. Basically the base engine on which everything will work */
http.createServer(
	function (req, res) {
		/* create default result */
		var result = {};
		result.code = 404; /* Page not found */
		result.message = "";
		result.iserror = true;
		result.issuccess = false;
		result.isbusy = false;
		try {
			/* A call is received on the webservice */
			system_notify_message("HTTP Received request: " + req.url, STATUS_TYPE.HTTP_SERVER_INCOMING);
			system_notify_message("- User agent            " + req.headers["user-agent"], STATUS_TYPE.HTTP_SERVER_INCOMING);
			system_notify_message("- Remote address/port   " + req.socket.remoteAddress + ":" + req.socket.remotePort, STATUS_TYPE.HTTP_SERVER_INCOMING);
			system_notify_message("- Local address/port    " + req.socket.localAddress + ":" + req.socket.localPort, STATUS_TYPE.HTTP_SERVER_INCOMING);
			switch (req.url) {
				case "/server_busy": /* somebody calls the server_busy.....suspicous */
					result = http_server_busy(req);
					break;
				case "/start_process": /* This is the main entry point for starting the lighthouse check */
					if (server_busy_state) {	/* If the server is already processing, the busy state is true. We respond with the busy state */
						result = http_server_busy(req);
					} else { /* Else start executing the lighthouse checks */
						result = http_start_process(req);
					}
					break;
				case "/alive": /* somebody calls if node js is alive*/
					result = http_server_alive();
					break;
				case "/alive_callback": /* somebody calls if node js is alive*/
					result = http_server_alive_callback(req);
					break;
				default:	/* Everything else......default result code 404 page not found */
					system_notify_message("- Unknown URL: " + req.url, STATUS_TYPE.HTTP_SERVER_ERROR);
					result.message += (result.message.length > 0 ? "," : "") + "{'line':'What are you trying to do??'}";
					result.message += (result.message.length > 0 ? "," : "") + "{'line':'I cannot find anything!!!'}";
					result.message += (result.message.length > 0 ? "," : "") + "{'line':'So you asked for it, here it is 404 error'}";
					break;
			}
		} catch (ex_message) {
			console.error(ex_message);
		}
		/* set response variables */
		res.writeHead(result.code, { 'Content-Type': 'application/json' });
		res.write("{ result: { 'code':" + result.code + ", 'success': " + result.issuccess + ",'busy': " + result.isbusy + ", 'error': " + result.iserror + ", 'lines':	[" + result.message + "]}}");
		res.end();
		system_notify_message("- Sending sync response (process is running async)", STATUS_TYPE.HTTP_SERVER_OUTGOING);
		result = null;

	}).listen(nodeport);
system_notify_message("HTTP server is listening on port " + nodeport + "....", STATUS_TYPE.HTTP_SERVER);
