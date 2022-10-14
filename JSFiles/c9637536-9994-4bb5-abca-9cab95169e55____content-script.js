'use strict';
// jshint -W110, -W003
/*global chrome, Coveo, EncodeHelper, ExtensionGallery, JSONFormatter, Headers, unescape */

/*
 * EXTENSION TESTER
 *
 */

/**
 * Gets the access token of the user from the document cookies
 *
 * https://stackoverflow.com/questions/5142337/read-a-javascript-cookie-by-name
 *
 * @returns The access token
 */
const getCookieApiKey = () => {
  const cookiestring = (/\baccess_token\b[^;]+/).exec(document.cookie);
  const apikey = decodeURIComponent(!!cookiestring ? cookiestring.toString().replace(/^[^=]+./, '') : '');
  return apikey;
};

/**
 * Gets the current org from the url
 *
 * @returns {string} The org string
 */
let getCurrentOrg = () => {
  return window.location.hash.substring(1).split('/')[0];
};

let getParameterNameForStorage = () => {
  const extName = $('#__extName').text();
  const name = 'parameters_' + (extName || '').replace(/[^\w]/g, '_');
  return name;
};

// Set the name for the parameter list based on extension names.
let getStorageDefinitionForParameters = json => {
  let def = {};
  const name = getParameterNameForStorage();

  if (json) {
    json = JSON.stringify(json);
  }

  def[name] = json || ''; // default to empty string.
  return def;
};

/**
 * Resets the results of the previous tests
 */
let resetTestEnv = () => {
  $('#__testResults').text('');
  $('#__originalFile, #__extensionTesterErrors').html('');
};

let validateDocId = () => {
  let docIdInput = $('#__testDocId');
  let id = $('#__testDocId').val();
  if (id) {
    $('#__runTests').removeAttr('disabled');
    docIdInput.removeClass('invalid');
    docIdInput.addClass('valid');
  } else {
    $('#__runTests').prop('disabled', 'disabled');
    docIdInput.removeClass('valid');
    docIdInput.addClass('invalid');
  }
};

let setDocId = docId => {
  $('#__testDocId').val(docId);
  validateDocId();
};

let validateParameters = () => {
  let $ta = $('#__parametersForTest textarea');
  let v = $ta.val().trim();
  if (!v) {
    $ta.removeClass('invalid');
    $ta.addClass('valid');
  } else {
    try {
      JSON.parse(v);
      $ta.removeClass('invalid');
      $ta.addClass('valid');
    } catch (e) {
      $ta.addClass('invalid');
      $ta.removeClass('valid');
    }
  }
};

const getExtensionIdFromName = async (extName, extVersion) => {
  const currentOrg = getCurrentOrg();
  const apiTestsKey = getCookieApiKey();
  const allExtensions = await fetch(`https://${location.host}/rest/organizations/${currentOrg}/extensions/`, {
    headers: new Headers({
      Authorization: `Bearer ${apiTestsKey}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }),
    method: 'GET',
  })
    .then(res => res.json());

  const ext = allExtensions.find(e => e.name === extName && e.versionId === extVersion);
  if (!ext) {
    ext = allExtensions.find(e => e.name === extName);
  }
  return ext.id;
};

/**
 * The onclick for the test buttons on the elements, in the Extensions page.
 *
 * @param {event} e - The mouse click event
 */
let testButtonsOnClick = async e => {
  const $extRow = $(e.target).closest('tr');
  const extName = $('.extension-name', $extRow).text().trim();
  const extVersion = $('.extension-last-modified-date .second-row', $extRow).text().replace('Version:', '').trim();

  const extId = await getExtensionIdFromName(extName, extVersion);

  resetTestEnv();
  
  $('#__tab-select-document').click();
  setDocId('');
  $('#__extName').text(extName);

  // get saved parameters from local storage for this extension
  chrome.storage.local.get(getStorageDefinitionForParameters(), items => {
    try {
      let paramName = getParameterNameForStorage(),
        v = items[paramName] || '';
      if (v) {
        v = JSON.stringify(JSON.parse(v), 2, 2);
      }
      $('#__parametersForTest textarea').val(v);

      let manifest = chrome.runtime.getManifest();
      document.getElementById('version').innerText = 'v' + manifest.version;

    } catch (e) {
      $('#__parametersForTest textarea').val('');
    }
    validateParameters();
  });

  // Show modal
  $('#__contentModal').show();
  $('#__currentExtension').text(extId);
};


function initCoveo() {
  if ((typeof Coveo) === "undefined") {
    setTimeout(initCoveo, 500);
    return;
  }
  let currentOrg = getCurrentOrg();
  let root = document.getElementById('__orgContent');
  Coveo.SearchEndpoint.endpoints['orgContent'] = new Coveo.SearchEndpoint({
    restUri: `https://${location.host}/rest/search`,
    accessToken: getCookieApiKey(),
    anonymous: false,
    isGuestUser: false,
    queryStringArguments: {
      organizationId: currentOrg,
    },
  });
  Coveo.init(root, {
    ResultLink: {
      onClick: function (e, result) {
        e.preventDefault();
        setDocId(result.uniqueId);
        resetTestEnv();
        $('#__tab-test').click();
        // Give the option to pass parameters before triggering the test
        // $('#__runTests').click();
      },
    },
  });
  let testSection = document.getElementById('__testSection');
  Coveo.init(testSection);
}

/**
 * Add test modal to page
 */
function addTestModal() {
  fetch(chrome.runtime.getURL('/html/content-search.html'))
    .then(res => res.text())
    .then(function (body) {
      $('body').append(body);

      let activateTab = id => {
        $('.__selector > .tab-navigation .tab.active, .__selector > .tab-content .tab-pane.active').removeClass('active');
        $(`#${id},[data-tab=${id}]`).addClass('active');
      };
      $('.__selector > .tab-navigation .tab.enabled').on('click', data => {
        activateTab(data.target.id);
      });

      $('#__runTests').click(runTest);

      // Show modal
      let modal = $('#__contentModal');
      let span = document.getElementsByClassName('__close');

      let hideModal = () => {
        modal.hide();
      };

      for (var i = 0; i < span.length; i++) {
        var element = span[i];
        element.onclick = hideModal;
      }

      modal.onclick = event => {
        if (event.target === modal) {
          hideModal();
        }
      };

      initCoveo();

      $('#__testDocId').on('input', validateDocId);
      let $ta = $('#__parametersForTest textarea');
      $ta.on('input', validateParameters);
    });
}

/**
 * Runs the extension test
 *
 */
function runTest() {
  resetTestEnv();

  //Show the loading bubbles
  let loadingElement = $('#__testLoading');
  loadingElement.css('display', 'block');

  $('#__testResults').text('');
  let apiTestsKey = getCookieApiKey();
  let currentOrg = getCurrentOrg();
  let extensionId = $('#__currentExtension').text();
  let uniqueId = $('#__testDocId').val();
  let testUrl = `https://${location.host}/rest/organizations/${currentOrg}/extensions/${extensionId}/test`;
  let documentUrl = `https://${location.host}/rest/search/document?uniqueId=${encodeURIComponent(uniqueId)}&access_token=${apiTestsKey}&organizationId=${currentOrg}`;
  let extensionSettingsUrl = `https://${location.host}/rest/organizations/${currentOrg}/extensions/${extensionId}`;
  let docUri = '';

  // clear previous messages
  $('#__extensionTesterErrors').empty();

  /**
   * Add an error message to the test
   *
   * @param {string} msg - The error message
   * @param {boolean} isWarning - True if is warning, else error
   */
  let addMessage = (msg, isWarning) => {
    $('#__extensionTesterErrors').append(`
			<div class='banner flex center-align bg-${isWarning === true ? 'yellow' : 'red'}'>
				<div class="banner-description">
					<p>${msg}</p>
				</div>
			</div>`);
  };

  let toSendData = {
    document: {
      permissions: [],
      metadata: [
        {
          Values: {},
          origin: 'Extension tester',
        },
      ],
      dataStreams: [
        {
          Values: {},
          origin: 'Extension tester',
        },
      ],
    },
    parameters: {},
    language: "PYTHON",
  };

  //When all of these are true, fire the extension test
  //Each will be set to true when it finishes the async
  let requestsReady = {
    bodyText: false,
    bodyHTML: false,
    thumbnail: false,
    metadata: false,
    documentData: false,
  };

  fetch(extensionSettingsUrl, {
    headers: new Headers({
      Authorization: `Bearer ${apiTestsKey}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }),
    method: 'GET',
  })
    .then(res => res.json())
    .catch(() => {
      addMessage('Failed to fetch extension, stopping');
      loadingElement.css('display', 'none');
    })
    .then(data => {
      // success
      toSendData.language = data.language || 'PYTHON3';

      if (data.requiredDataStreams) {
        let streams = data.requiredDataStreams;
        if (streams.includes('BODY_TEXT')) {
          setBodyText();
        } else {
          requestsReady.bodyText = true;
        }

        if (streams.includes('BODY_HTML')) {
          setBodyHTML();
        } else {
          requestsReady.bodyHTML = true;
        }

        if (streams.includes('THUMBNAIL')) {
          setThumbnail();
        } else {
          requestsReady.thumbnail = true;
        }

        if (streams.includes('DOCUMENT_DATA')) {
          addOriginalFile();
        } else {
          requestsReady.documentData = true;
        }
      }

      return setDocumentMetadata();
    })
    .then((gettingDocumentIsSuccessful) => {
      // complete
      let counter = 0;
      let displayedError = false;
      function wait() {
        //Wait until all true
        let areAllRequestsCompleted = Object.keys(requestsReady).every(k => requestsReady[k]);
        if (areAllRequestsCompleted) {
          //Clears the original file selector, since we already have the extracted data
          $('#__originalFile').html('');
          runTestAjax();
        } else {
          counter++;
          if (counter > 50 && !displayedError) {
            addMessage('Something might have gone wrong, check the console for errors');
            displayedError = true;
            loadingElement.css('display', 'none');
          }
          else {
            setTimeout(wait, 250);
          }
        }
      }

      if (gettingDocumentIsSuccessful) {
        wait();
      }
    });

  /**
   * Adds an original file selector
   *
   */
  function addOriginalFile() {
    fetch(chrome.runtime.getURL('/html/originalFile.html'))
      .then(res => res.text())
      .then(data => {
        let originalFileElement = $('#__originalFile');
        originalFileElement.html(data);

        //Coveo things (vapor css)
        $('input[type=file]').change(function () {
          var fileValue = this.files.length ? this.files[0].name : '';
          var $input = $(this)
            .closest('.file-input')
            .find('.file-path');
          $input.val(fileValue);
          $input.toggleClass('has-file', !!fileValue);
          $(this)
            .closest('.file-input')
            .find('.clear-file')
            .toggleClass('hidden', !fileValue);
        });
        $('.clear-file').click(function () {
          var $input = $(this).closest('.file-input');
          var $path = $input.find('.file-path');

          $input.find('input[type=file]').val('');
          $path.val('');
          $path.removeClass('hasFile');
          $(this).addClass('hidden');
        });

        let activateTab = id => {
          $('#__originalFile > .tab-navigation .tab.active, #__originalFile > .tab-content .tab-pane.active').removeClass('active');
          $(`#${id},[data-tab=${id}]`).addClass('active');
        };
        $('#__originalFile > .tab-navigation .tab.enabled').on('click', data => {
          activateTab(data.target.id);
        });
        //Coveo things

        $('#__uploadedFile').on('change', handleFileChange);
        $('#__noFile').click(function () {
          requestsReady.documentData = true;
        });
        if (docUri !== '') {
          $('#__originalLink').val(docUri);
        }
        $('#__useLinkBtn').on('click', useLinkOnClick);
      });
  }

  /**
   * The onclick function for the 'use original link'
   * This sends out an ajax request to the URL in question
   * and adds the resulting HTMl to the document data of the tester
   *
   */
  function useLinkOnClick() {
    fetch($('#__originalLink').val(), {
      headers: new Headers({
        'Access-Control-Allow-Origin': '*',
      }),
      method: 'GET',
    })
      .then(res => res.text())
      .then(data => {
        toSendData.document.dataStreams[0].Values['DOCUMENT_DATA'] = {
          inlineContent: EncodeHelper.base64(data),
          compression: 'UNCOMPRESSED',
        };
        requestsReady.documentData = true;
      })
      .catch(data => {
        addMessage(`Failed to get URL content: ${data}`);
      });
  }

  /**
   * The onchange function for the uploaded file for the original
   * file tester.
   *
   * https://stackoverflow.com/questions/16505333/get-the-data-of-uploaded-file-in-javascript
   *
   * @param {event} evt
   */
  function handleFileChange(evt) {
    let files = evt.target.files; // FileList object

    // use the 1st file from the list
    let f = files[0];

    let reader = new FileReader();

    // Closure to capture the file information.
    reader.addEventListener(
      'load',
      function () {
        toSendData.document.dataStreams[0].Values['DOCUMENT_DATA'] = {
          inlineContent: reader.result
            .split(',')
            .slice(1)
            .join(','),
          compression: 'UNCOMPRESSED',
        };
        requestsReady.documentData = true;
      },
      false
    );

    // Read in the image file as a data URL.
    reader.readAsDataURL(f);
  }

  /**
   * Adds the Body Text data to the data to send
   *
   * @returns The ajax request
   */
  function setBodyText() {
    return fetch(`https://${location.host}/rest/search/text?access_token=${apiTestsKey}&organizationId=${currentOrg}&uniqueId=${encodeURIComponent(uniqueId)}`, {
      headers: new Headers({
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
      method: 'GET',
    })
      .then(res => res.json())
      .then(data => {
        if (data.content) {
          //If it find no statusCode, meaning it was successful
          if (!data.status) {
            toSendData.document.dataStreams[0].Values['BODY_TEXT'] = {
              inlineContent: btoa(EncodeHelper.unicodeEscape(data.content)),
              compression: 'UNCOMPRESSED',
            };
          } else {
            addMessage('Extension called for "Body text", but no Body Text exists for this document');
          }
        }
        requestsReady.bodyText = true;
      })
      .catch(() => {
        addMessage('Extension called for "Body text", but no Body Text exists for this document');
      });
  }

  /**
   * Adds the HTML data to the data to send
   *
   * @returns The ajax request
   */
  function setBodyHTML() {
    return fetch(`https://${location.host}/rest/search/html?access_token=${apiTestsKey}&organizationId=${currentOrg}&uniqueId=${encodeURIComponent(uniqueId)}`, {
      headers: new Headers({
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
    })
      .then(res => res.text())
      .then(data => {
        if (data) {
          //If it find no statusCode, meaning it was successful
          if (!data.status) {
            let utf8bytes = unescape(encodeURIComponent(data));
            toSendData.document.dataStreams[0].Values['BODY_HTML'] = {
              inlineContent: btoa(utf8bytes),
              compression: 'UNCOMPRESSED',
            };
          } else {
            addMessage('Extension called for "Body HTML", but no Body HTML exists for this document');
          }
        }
        requestsReady.bodyHTML = true;
      })
      .catch(() => {
        addMessage('Extension called for "Body HTML", but no Body HTML exists for this document');
      });
  }

  /**
   * Adds the Thumbnail data to the data to send
   *
   */
  function setThumbnail() {
    let url = `https://${location.host
      }/rest/search/datastream?access_token=${apiTestsKey}&organizationId=${currentOrg}&contentType=application%2Fbinary&dataStream=%24Thumbnail%24&uniqueId=${encodeURIComponent(uniqueId)}`;

    fetchBlob(url, function (blob) {
      // Array buffer to Base64:
      if (blob) {
        let str = btoa(String.fromCharCode.apply(null, new Uint8Array(blob)));
        toSendData.document.dataStreams[0].Values['THUMBNAIL'] = {
          inlineContent: str,
          compression: 'UNCOMPRESSED',
        };
      } else {
        addMessage('Extension called for "Thumbnail", but no Thumbnail exists for this document');
      }
      requestsReady.thumbnail = true;
    });
  }

  /**
   * Adds the metadata of the document to test to the data to send
   *
   * @returns The ajax request
   */
  function setDocumentMetadata() {
    //Get the document metadata
    return fetch(documentUrl, {
      headers: new Headers({
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
      method: 'GET',
    })
      .then(res => res.json())
      .catch(() => {
        addMessage('Failed to fetch document metadata');
      })
      .then(data => {
        //StatusCode would mean an error
        if (data.statusCode) {
          $('#__testResults').text('Failed to fetch document\n' + JSON.stringify(data, null, 2));
          loadingElement.css('display', 'none');

          return false;
        } else {
          docUri = data.printableUri;
          if ($('#__originalLink').length) {
            $('#__originalLink').val(docUri);
          }
          try {
            let paramsText = $('#__parametersForTest textarea').val();
            let json = paramsText ? JSON.parse(paramsText) : {};
            toSendData.parameters = json;

            $('#__parametersForTest textarea').val(JSON.stringify(json, 2, 2));
            chrome.storage.local.set(getStorageDefinitionForParameters(json));
          } catch (e) {
            toSendData.parameters = {};
            console.warn(e);
          }

          //Build the document metadata
          let addToJson = (valueToAdd, addKey) => {
            if (['boolean', 'number', 'string'].includes(typeof valueToAdd)) {
              toSendData.document.metadata[0].Values[addKey] = [valueToAdd];
            }
            else if (valueToAdd && valueToAdd.length) {
              if (valueToAdd instanceof Array) {
                toSendData.document.metadata[0].Values[addKey] = valueToAdd;
              } else if (valueToAdd instanceof Object) {
                for (let ckey in valueToAdd) {
                  addToJson(valueToAdd[ckey], ckey);
                }
              } else if (valueToAdd.constructor === Object) {
                for (let ckey in valueToAdd) {
                  addToJson(valueToAdd[ckey], ckey);
                }
              } else {
                toSendData.document.metadata[0].Values[addKey] = [valueToAdd];
              }
            }
          };
          for (let key in data) {
            addToJson(data[key], key);
          }
          for (let key in data.raw) {
            addToJson(data.raw[key], key);
          }
        }

        requestsReady.metadata = true;
        return true;
      });
  }

  /**
   * Sends the ajax request to the extension tester with
   * all the metadata added
   */
  function runTestAjax() {
    fetch(testUrl, {
      method: 'POST', // or 'PUT'
      body: JSON.stringify(toSendData),
      headers: new Headers({
        Authorization: `Bearer ${apiTestsKey}`,
        'Content-Type': 'application/json',
      }),
    })
      .then(res => res.json())
      .catch(error => {
        console.error('Error:', error);
        addMessage(error.errorCode);
      })
      .then(response => {
        let formatter = new JSONFormatter(response, Infinity, {
          hoverPreviewEnabled: false,
        });
        $('#__testResults').html(formatter.render());
        loadingElement.css('display', 'none');
      });
  }
}

/**
 * Adds the Test buttons in the table of the extensions
 *
 */
let addTestButtonsToPage = () => {
  // Do this first, since it will be called multiple times before the async function is done below
  let nExtension = document.querySelector('#admin #main table.admin-table-view');
  if (!nExtension) {
    return;
  }

  const hasExtensions = nExtension.querySelector('.extension-name');
  if (!hasExtensions) {
    return;
  }

  // This is to ensure we don't get multiple columns
  let $table = $(nExtension);

  if ($('tbody tr.empty', $table).length) {
    // no extensions, don't need to add buttons or header
    return;
  }

  // Add 'Tests' column in Extension table header
  if ($('#__testHeader', $table).length === 0) {
    $('thead tr', $table).append('<th id="__testHeader">Tests</th>');
  }
  // Add Test buttons to each extension
  $('tbody tr', $table).each((i, tr) => {
    let $tr = $(tr);
    if ($('.btn', $tr).length) {
      // button is already there
      return;
    }
    let $td = $(`<td class="col"><div class="wrapper"><div class="btn">Test</div></div></td>`);
    $tr.append($td);
    $td.on('click', testButtonsOnClick);
  });
};

/*
 * OTHER
 *
 */

/**
 * The 'init' function of the script
 * Loads the values from the config and inits the mutation obs
 *
 */

function initPipelineExtensionTester() {
  let modalObserver = new MutationObserver((mutations, observer) => {
    const nAdmin = document.getElementById('admin');
    if (!nAdmin) {
      return;
    }
    const nModal = document.getElementById('Modal');
    if (!nModal) {
      return;
    }
    observer.disconnect();

    let modalObserver = new MutationObserver(() => {
      // If the EditExtensionComponent appears
      if ($('#EditExtensionComponent').length && $('#CreateExtension').length) {
        ExtensionGallery.addExtensionSearchToPage();
      }
    });
    modalObserver.observe(nAdmin, { childList: true, subtree: true });
  });

  let extensionObserver = new MutationObserver((mutations, observer) => {
    const nAdmin = document.getElementById('admin');
    if (!nAdmin) {
      return;
    }
    const nMain = document.getElementById('main');
    if (!nMain) {
      return;
    }

    observer.disconnect();

    // If extensions appears AND it wasn't already modified by this script
    addTestButtonsToPage();
    if (!$('#__contentModal').length) {
      addTestModal();
    }

    let extensionObserver = new MutationObserver(addTestButtonsToPage);
    extensionObserver.observe(nMain, { childList: true, subtree: true });
  });

  modalObserver.observe(document, { childList: true, subtree: true });
  extensionObserver.observe(document, { childList: true, subtree: true });
}

//https://stackoverflow.com/questions/23013871/how-to-parse-into-base64-string-the-binary-image-from-response
function fetchBlob(uri, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', uri, true);
  xhr.responseType = 'arraybuffer';

  xhr.onload = function () {
    if (this.status === 200) {
      var blob = this.response;
      if (callback) {
        callback(blob);
      }
    } else {
      if (callback) {
        callback();
      }
    }
  };
  xhr.send();
}

// load it only in /admin/ extensions page.
if (/https:\/\/platform[-\w]*\.cloud.coveo.com\/admin\//.test(window.location.href)) {
  window.addEventListener('load', initPipelineExtensionTester);
}
