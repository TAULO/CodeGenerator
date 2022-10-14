function Editor() {
  return this.init();
}

(function(window, document, $, undefined) {
  'use strict';

  function Extension() {
  }

  function extend(b, a) {
    var prop;
    if (b === undefined) {
      return a;
    }
    for (prop in a) {
      if (a.hasOwnProperty(prop) && b.hasOwnProperty(prop) === false) {
        b[prop] = a[prop];
      }
    }
    return b;
  }

  function isDescendant(parent, child) {
    var node = child.parentNode;
    while (node !== null) {
      if (node === parent) {
        return true;
      }
      node = node.parentNode;
    }
    return false;
  }

  // http://stackoverflow.com/questions/5605401/insert-link-in-contenteditable-element
  function saveSelection(self) {
    var i,
      len,
      ranges,
      sel = self.options.contentWindow.getSelection();
    if (sel.getRangeAt && sel.rangeCount) {
      ranges = [];
      for (i = 0, len = sel.rangeCount; i < len; i += 1) {
        ranges.push(sel.getRangeAt(i));
      }
      return ranges;
    }
    return null;
  }

  function restoreSelection(self, savedSel) {
    var i,
      len,
      sel = self.options.contentWindow.getSelection();
    if (savedSel) {
      sel.removeAllRanges();
      for (i = 0, len = savedSel.length; i < len; i += 1) {
        sel.addRange(savedSel[i]);
      }
    }
  }

  // http://stackoverflow.com/questions/1197401/how-can-i-get-the-element-the-caret-is-in-with-javascript-when-using-contentedi
  function getSelectionStart(self) {
    var node = self.options.ownerDocument.getSelection().anchorNode,
      startNode = (node && node.nodeType === 3 ? node.parentNode : node);
    return startNode;
  }

  // http://stackoverflow.com/questions/4176923/html-of-selected-text
  function getSelectionHtml(self) {
    var i,
      html = '',
      sel,
      len,
      container;
    if (self.options.contentWindow.getSelection !== undefined) {
      sel = self.options.contentWindow.getSelection();
      if (sel.rangeCount) {
        container = self.options.ownerDocument.createElement('div');
        for (i = 0, len = sel.rangeCount; i < len; i += 1) {
          container.appendChild(sel.getRangeAt(i).cloneContents());
        }
        html = container.innerHTML;
      }
    } else if (self.options.ownerDocument.selection !== undefined) {
      if (self.options.ownerDocument.selection.type === 'Text') {
        html = self.options.ownerDocument.selection.createRange().htmlText;
      }
    }
    return html;
  }

  // http://stackoverflow.com/questions/6690752/insert-html-at-caret-in-a-contenteditable-div
  function insertHTMLCommand(doc, html) {
    var selection, range, el, fragment, node, lastNode;

    if (doc.queryCommandSupported && doc.queryCommandSupported('insertHTML')) {
      return doc.execCommand('insertHTML', false, html);
    }

    selection = window.getSelection();
    if (selection.getRangeAt && selection.rangeCount) {
      range = selection.getRangeAt(0);
      range.deleteContents();

      el = doc.createElement("div");
      el.innerHTML = html;
      fragment = doc.createDocumentFragment();
      while (el.firstChild) {
        node = el.firstChild;
        lastNode = fragment.appendChild(node);
      }
      range.insertNode(fragment);

      // Preserve the selection:
      if (lastNode) {
        range = range.cloneRange();
        range.setStartAfter(lastNode);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }
  }

  function getKeyStroke(event) {
    var keymap = {
        8: "backspace",
        9: "tab",
        13: "enter",
        16: "shift",
        17: "ctrl",
        18: "alt",
        19: "pause",
        20: "caps",
        27: "esc",
        32: "space",
        33: "pgup",
        34: "pgdn",
        35: "end",
        36: "home",
        37: "left",
        38: "up",
        39: "right",
        40: "down",
        45: "ins",
        46: "del",
        48: "0",
        49: "1",
        50: "2",
        51: "3",
        52: "4",
        53: "5",
        54: "6",
        55: "7",
        56: "8",
        57: "9",
        65: "a",
        66: "b",
        67: "c",
        68: "d",
        69: "e",
        70: "f",
        71: "g",
        72: "h",
        73: "i",
        74: "j",
        75: "k",
        76: "l",
        77: "m",
        78: "n",
        79: "o",
        80: "p",
        81: "q",
        82: "r",
        83: "s",
        84: "t",
        85: "u",
        86: "v",
        87: "w",
        88: "x",
        89: "y",
        90: "z",
        91: "cmd",
        93: "cmd",
        112: "f1",
        113: "f2",
        114: "f3",
        115: "f4",
        116: "f5",
        117: "f6",
        118: "f7",
        119: "f8",
        120: "f9",
        121: "f10",
        122: "f11",
        123: "f12",
        186: ";",
        187: "=",
        188: ",",
        189: "-",
        191: '/',
        192: "`",
        219: '[',
        220: '\\',
        221: "]",
        222: "'"
      },
      metaKeys = [],
      string = [];

    if (event === undefined || event.which === undefined) {
      return "@";
    }


    if (event.altKey) {
      metaKeys.push(keymap[18]);
    }
    if (event.metaKey) {
      metaKeys.push(keymap[91]);
    }
    if (event.ctrlKey) {
      metaKeys.push(keymap[17]);
    }
    if (event.shiftKey) {
      metaKeys.push(keymap[16]);
    }

    if (metaKeys.length) {
      string.push(metaKeys.join("+"));
    }

    if (keymap.hasOwnProperty(event.which)) {
      string.push(keymap[event.which]);
    }

    return "@" + string.join("+");
  }

  Editor.prototype = {
    options: {
      cleanPastedHTML: true,
      delay: 0,
      diffLeft: 0,
      diffTop: -10,
      disableReturn: true,
      elementsContainer: false,
      contentWindow: window,
      ownerDocument: document,
      firstHeader: 'h3',
      forcePlainText: true,
      placeholder: 'Type your text',
      secondHeader: 'h4',
      targetBlank: false,
      tabCharacter: '    ',
      anchorTarget: false,
      extensions: [],
      buttonIdCounter: 0,
      bindings: {}
    },
    isIE: ((navigator.appName === 'Microsoft Internet Explorer') || ((navigator.appName === 'Netscape') && (new RegExp('Trident/.*rv:([0-9]{1,}[.0-9]{0,})').exec(navigator.userAgent) !== null))),
    init: function() {
      this.parentElements = ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'pre', 'blockquote'];
      this.setup();
      return this;
    },
    setup: function() {
      this.initElements()
        .bindSelect()
        .bindPaste()
        .bindElementActions()
        .bindWindowActions()
      ;
    },
    on: function(event, selector, data, handler) {
      this.elements.root.on(event, selector, data, handler);
    },
    off: function(event, selector, handler) {
      this.elements.root.off(event, selector, handler);
    },
    initElements: function() {
      var hook;

      this.elements = {};

      /* 1. Load/Create editor root element */
      hook = $('[data-editor]');
      if (hook.length > 1) {
        console.log('Multiple editors not supported. Picking up first.');
        hook = hook.first();
      } else if (hook.length === 0) {
        throw "Editor root element not found";
      }
      // Plug the hook
      this.elements.root = hook;

      /* 2. Load/Create menu container */
      hook = this.elements.root.find('[data-menu-container]');
      if (hook.length === 0) {
        hook = $('<div>').attr('data-menu-container', '').addClass('menu-container');
        this.elements.root.append(hook);
      }
      // Plug the hook
      this.elements.menuContainer = hook;

      /* 3. Load/Create editor window */
      hook = this.elements.root.find('[data-edit]');
      if (hook.length === 0) {
        hook = $('<article>').attr('data-edit', '')
          .append($('<h2>').attr('data-placeholder', 'Title here').addClass('title'))
          .append($('<p>').attr('data-placeholder', 'Your text here'));
        this.elements.root.append(hook);
      }
      // Plug the hook
      this.elements.editable = hook;

      /* 4. Make editor editable */
      this.elements.editable.attr({contenteditable: true});

      return this;
    },
    bindSelect: function() {
      var self = this,
        timer = -1,
        checkSelectionWrapper = function(e) {
          self.event = e;
          // Do not close the toolbar when blurring the editable area and clicking into the anchor form
          if (e && self.clickingOnMenuElement(e)) {
            return;
          }

          clearTimeout(timer);
          timer = setTimeout(function() {
            self.checkSelection();
          }, self.options.delay);
        };

      $(this.options.ownerDocument).on('mouseup', checkSelectionWrapper);
      this.elements.root.on('keyup', checkSelectionWrapper);
      this.elements.root.on('blur', checkSelectionWrapper);
      this.elements.editable.on('click', checkSelectionWrapper);
      return this;
    },
    bindPaste: function() {
      var self = this,
        pasteWrapper = function(e) {
          var paragraphs,
            html = '',
            p,
            dataFormatHTML = 'text/html',
            dataFormatPlain = 'text/plain';

          // TODO: Remove placeholder
          if (!self.options.forcePlainText && !self.options.cleanPastedHTML) {
            return this;
          }

          if (window.clipboardData && e.clipboardData === undefined) {
            e.clipboardData = window.clipboardData;
            // If window.clipboardData exists, but e.clipboardData doesn't exist,
            // we're probably in IE. IE only has two possibilities for clipboard
            // data format: 'Text' and 'URL'.
            //
            // Of the two, we want 'Text':
            dataFormatHTML = 'Text';
            dataFormatPlain = 'Text';
          }

          if (e.clipboardData && e.clipboardData.getData && !e.defaultPrevented) {
            e.preventDefault();

            if (self.options.cleanPastedHTML && e.clipboardData.getData(dataFormatHTML)) {
              return self.cleanPaste(e.clipboardData.getData(dataFormatHTML));
            }

            if (!(self.options.disableReturn)) {
              paragraphs = e.clipboardData.getData(dataFormatPlain).split(/[\r\n]/g);
              for (p = 0; p < paragraphs.length; p += 1) {
                if (paragraphs[p] !== '') {
                  if (navigator.userAgent.match(/firefox/i) && p === 0) {
                    html += self.htmlEntities(paragraphs[p]);
                  } else {
                    html += '<p>' + self.htmlEntities(paragraphs[p]) + '</p>';
                  }
                }
              }
              insertHTMLCommand(self.options.ownerDocument, html);
            } else {
              html = self.htmlEntities(e.clipboardData.getData(dataFormatPlain));
              insertHTMLCommand(self.options.ownerDocument, html);
            }
          }
        };
      this.elements.editable.on('paste', pasteWrapper);
      return this;
    },
    bindElementActions: function() {
      this.bindReturn()
        .bindTab()
        .bindBlur()
        .bindButtons()
        .bindKeypress();
      return this;
    },
    bindReturn: function() {
      var self = this;
      this.elements.editable.on('keypress', function(e) {
        if (e.which === 13) {
          if (self.options.disableReturn && (e.altKey || e.shiftKey || e.ctrlKey || e.metaKey)) {
            console.log('disabling');
            e.preventDefault();
          }
        }
      });
      return this;
    },
    bindTab: function() {
      var self = this;
      this.elements.editable.on('keydown', function(e) {
        if (e.which === 9) {
          // Override tab only for pre nodes
          var tag = getSelectionStart(self).tagName.toLowerCase();
          if (tag === 'pre') {
            e.preventDefault();
            document.execCommand('insertHtml', null, self.options.tabCharacter);
          }

          // Tab to indent list structures!
          if (tag === 'li') {
            e.preventDefault();

            // If Shift is down, outdent, otherwise indent
            if (e.shiftKey) {
              document.execCommand('outdent', e);
            } else {
              document.execCommand('indent', e);
            }
          }
        }
      });
      return this;
    },
    bindBlur: function() {
      var self = this,
        blurFunction = function(e) {
          // If it's not part of the editor, or the toolbar
          if (e.target !== self.toolbar && e.target !== self.elements.root[0] && !isDescendant(self.elements.root[0], e.target)) {

            // Hide the toolbar after a small delay so we can prevent this on toolbar click
            setTimeout(function() {
              self.blurExtensions();
            }, 200);
          }
        };

      // Hide the toolbar when focusing outside of the editor.
      document.body.addEventListener('click', blurFunction, true);
      document.body.addEventListener('focus', blurFunction, true);

      return this;
    },
    bindKeypress: function() {
      var self = this;

      // Set up the keypress events
      this.elements.editable.on('keypress', function(event) {
        // TODO: handle if needed else remove
      });

      return this;
    },
    bindButtons: function() {
      var self = this;

      this.elements.menuContainer.on('click', 'a[href="#"]', function(event) {
        event.preventDefault();
        self.onButtonClick($(this), event);
      });

      return this;
    },
    bindWindowActions: function() {
      var timerResize,
        self = this,
        windowResizeHandler = function() {
          clearTimeout(timerResize);
          timerResize = setTimeout(function() {
            self.refreshExtensions();
          }, 100);
        };

      $(this.options.contentWindow).on('resize', windowResizeHandler);
      return this;
    },
    checkSelection: function() {
      var newSelection;

      newSelection = this.options.contentWindow.getSelection();
      if (this.selectionInContentEditableFalse()) {
        this.blurExtensions();
      } else {
        this.checkSelectionElement(newSelection);
      }
      return this;
    },
    clickingOnMenuElement: function(e) {
      var self = this;

      if (e.type && e.type.toLowerCase() === 'blur' && e.relatedTarget && isDescendant(self.elements.menuContainer[0], e.relatedTarget)) {
        return true;
      }

      return false;
    },

    hasMultiParagraphs: function() {
      var selectionHtml = getSelectionHtml(this).replace(/<[\S]+><\/[\S]+>/gim, ''),
        hasMultiParagraphs = selectionHtml.match(/<(p|h[0-6]|blockquote)>([\s\S]*?)<\/(p|h[0-6]|blockquote)>/g);

      return (hasMultiParagraphs ? hasMultiParagraphs.length : 0);
    },

    checkSelectionElement: function(newSelection) {
      var self = this, focusNode, range, position, boundary, blur = false, click = false;
      if (this.event.type === 'click') {
        this.propagateEvent('@click', this.event);
        focusNode = this.event.target;
        boundary = $(focusNode).position();
      } else if (this.event.type === 'blur') {
        focusNode = this.event.target;
        this.blurExtensions();
        return;
      }
      if (this.event.type === 'mouseup' || this.event.type === 'keyup') {
        focusNode = newSelection.focusNode;
        if (newSelection.rangeCount) {
          range = newSelection.getRangeAt(0);
          boundary = range.getBoundingClientRect();
        } else {
          boundary = $(this.findNodeInEditable(this.event.target, function(node) {
            return node.parentNode === self.elements.editable[0];
          })).position();
        }
        blur = newSelection.blur || (this.state && this.state.focusNode !== focusNode);
      }

      position = {
        top: boundary.top,
        right: boundary.right,
        bottom: boundary.bottom,
        left: boundary.left,
        hcenter: (boundary.left + boundary.right) / 2,
        vcenter: (boundary.top + boundary.bottom) / 2
      };

      this.state = {
        focusNode: focusNode,
        nodeList: this.createNodeList(focusNode),
        selection: newSelection,
        range: range,
        position: position
      };

      if (blur) {
        this.blurExtensions();
      }
      console.log(this.event.type);
      if (this.event.type === 'keyup') {
        var keyStroke = getKeyStroke(this.event);
        if ('@' !== keyStroke) {
          this.propagateEvent(keyStroke, this.event);
        }
      }

      if (!focusNode) {
        return;
      }

      if (this.event.type === 'mouseup' || this.event.type === 'keyup') {
        this.wildcardHandler();
        this.nodeHandler(focusNode.nodeName.toLowerCase());
      }
    },
    selectionInContentEditableFalse: function() {
      return this.findMatchingSelectionParent(function(el) {
        return (el && el.nodeName !== '#text' && el.getAttribute('contenteditable') === 'false');
      });
    },
    findMatchingSelectionParent: function(testElementFunction) {
      var selection = this.options.contentWindow.getSelection(), range, current;

      if (selection.rangeCount === 0) {
        return false;
      }

      range = selection.getRangeAt(0);
      current = range.commonAncestorContainer;

      do {
        if (current.nodeType === 1) {
          if (testElementFunction(current)) {
            return current;
          }
          // do not traverse upwards past the nearest containing editor
          if (current.hasAttribute('data-edit')) {
            return false;
          }
        }

        current = current.parentNode;
      } while (current);

      return false;
    },
    findNodeInEditable: function(node, testFunction) {
      if (!node) {
        return this.elements.editable[0];
      }
      while (node.parentNode) {
        if (testFunction(node)) {
          return node;
        }
        if (node == this.elements.editable[0]) {
          break;
        }
        node = node.parentNode;
      }
      return this.elements.editable[0];
    },
    getRootNode: function(node) {
      var self = this;
      return this.findNodeInEditable(node, function(n) {
        return n.parentNode == self.elements.editable[0];
      });
    },
    cleanPaste: function(text) {

      /*jslint regexp: true*/
      /*
       jslint does not allow character negation, because the negation
       will not match any unicode characters. In the regexes in this
       block, negation is used specifically to match the end of an html
       tag, and in fact unicode characters *should* be allowed.
       */
      var i, elList, workEl,
        el = this.elements.editable[0],
        multiline = /<p|<br|<div/.test(text),
        replacements = [

          // replace two bogus tags that begin pastes from google docs
          [new RegExp(/<[^>]*docs-internal-guid[^>]*>/gi), ""],
          [new RegExp(/<\/b>(<br[^>]*>)?$/gi), ""],

          // un-html spaces and newlines inserted by OS X
          [new RegExp(/<span class="Apple-converted-space">\s+<\/span>/g), ' '],
          [new RegExp(/<br class="Apple-interchange-newline">/g), '<br>'],

          // replace google docs italics+bold with a span to be replaced once the html is inserted
          [new RegExp(/<span[^>]*(font-style:italic;font-weight:bold|font-weight:bold;font-style:italic)[^>]*>/gi), '<span class="replace-with italic bold">'],

          // replace google docs italics with a span to be replaced once the html is inserted
          [new RegExp(/<span[^>]*font-style:italic[^>]*>/gi), '<span class="replace-with italic">'],

          //[replace google docs bolds with a span to be replaced once the html is inserted
          [new RegExp(/<span[^>]*font-weight:bold[^>]*>/gi), '<span class="replace-with bold">'],

          // replace manually entered b/i/a tags with real ones
          [new RegExp(/&lt;(\/?)(i|b|a)&gt;/gi), '<$1$2>'],

          // replace manually a tags with real ones, converting smart-quotes from google docs
          [new RegExp(/&lt;a\s+href=(&quot;|&rdquo;|&ldquo;|“|”)([^&]+)(&quot;|&rdquo;|&ldquo;|“|”)&gt;/gi), '<a href="$2">']

        ];
      /*jslint regexp: false*/

      for (i = 0; i < replacements.length; i += 1) {
        text = text.replace(replacements[i][0], replacements[i][1]);
      }

      if (multiline) {

        // double br's aren't converted to p tags, but we want paragraphs.
        elList = text.split('<br><br>');

        this.pasteHTML('<p>' + elList.join('</p><p>') + '</p>');
        this.options.ownerDocument.execCommand('insertText', false, "\n");

        // block element cleanup
        elList = el.querySelectorAll('a,p,div,br');
        for (i = 0; i < elList.length; i += 1) {

          workEl = elList[i];

          switch (workEl.tagName.toLowerCase()) {
            case 'a':
              if (this.options.targetBlank) {
                this.setTargetBlank(workEl);
              }
              break;
            case 'p':
            case 'div':
              this.filterCommonBlocks(workEl);
              break;
            case 'br':
              this.filterLineBreak(workEl);
              break;
          }
        }
      } else {
        this.pasteHTML(text);
      }
    },
    setTargetBlank: function(el) {
      var i;
      el = el || getSelectionStart(this);
      if (el.tagName.toLowerCase() === 'a') {
        el.target = '_blank';
      } else {
        el = el.getElementsByTagName('a');

        for (i = 0; i < el.length; i += 1) {
          el[i].target = '_blank';
        }
      }
    },
    isCommonBlock: function(el) {
      return (el && (el.tagName.toLowerCase() === 'p' || el.tagName.toLowerCase() === 'div'));
    },
    filterCommonBlocks: function(el) {
      if (/^\s*$/.test(el.textContent)) {
        el.parentNode.removeChild(el);
      }
    },
    filterLineBreak: function(el) {
      if (this.isCommonBlock(el.previousElementSibling)) {
        // remove stray br's following common block elements
        el.parentNode.removeChild(el);
      } else if (this.isCommonBlock(el.parentNode) && (el.parentNode.firstChild === el || el.parentNode.lastChild === el)) {
        // remove br's just inside open or close tags of a div/p
        el.parentNode.removeChild(el);
      } else if (el.parentNode.childElementCount === 1) {
        // and br's that are the only child of a div/p
        this.removeWithParent(el);
      }
    },
    // remove an element, including its parent, if it is the only element within its parent
    removeWithParent: function(el) {
      if (el && el.parentNode) {
        if (el.parentNode.parentNode && el.parentNode.childElementCount === 1) {
          el.parentNode.parentNode.removeChild(el.parentNode);
        } else {
          el.parentNode.removeChild(el.parentNode);
        }
      }
    },
    pasteHTML: function(html) {
      var elList, workEl, i, fragmentBody, pasteBlock = this.options.ownerDocument.createDocumentFragment();

      pasteBlock.appendChild(this.options.ownerDocument.createElement('body'));

      fragmentBody = pasteBlock.querySelector('body');
      fragmentBody.innerHTML = html;

      this.cleanupSpans(fragmentBody);

      elList = fragmentBody.querySelectorAll('*');
      for (i = 0; i < elList.length; i += 1) {

        workEl = elList[i];

        // delete ugly attributes
        workEl.removeAttribute('class');
        workEl.removeAttribute('style');
        workEl.removeAttribute('dir');

        if (workEl.tagName.toLowerCase() === 'meta') {
          workEl.parentNode.removeChild(workEl);
        }

      }
      this.options.ownerDocument.execCommand('insertHTML', false, fragmentBody.innerHTML.replace(/&nbsp;/g, ' '));
    },
    cleanupSpans: function(container_el) {

      var i,
        el,
        new_el,
        spans = container_el.querySelectorAll('.replace-with');

      for (i = 0; i < spans.length; i += 1) {
        el = spans[i];
        new_el = this.options.ownerDocument.createElement(el.classList.contains('bold') ? 'b' : 'i');

        if (el.classList.contains('bold') && el.classList.contains('italic')) {
          // add an i tag as well if this has both italics and bold
          new_el.innerHTML = '<i>' + el.innerHTML + '</i>';
        } else {
          new_el.innerHTML = el.innerHTML;
        }
        el.parentNode.replaceChild(new_el, el);
      }

      spans = container_el.querySelectorAll('span');
      for (i = 0; i < spans.length; i += 1) {
        el = spans[i];
        // remove empty spans, replace others with their contents
        if (/^\s*$/.test()) {
          el.parentNode.removeChild(el);
        } else {
          el.parentNode.replaceChild(this.options.ownerDocument.createTextNode(el.textContent), el);
        }
      }
    },
    htmlEntities: function(str) {
      // converts special characters (like <) into their escaped/encoded values (like &lt;).
      // This allows you to show to display the string without the browser reading it as HTML.
      return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    },
    install: function(extension) {
      if (extension) {
        extension = $.extend(new Extension(), extension);
        extension.id = this.options.extensions.length;
        this.options.extensions.push(extension);
        extension.base = this;

        if (extension.subscribe === undefined) {
          extension.subscribe = [];
        }

        /* Check if id is in list */
        var re, filter, self = this;

        this.elements.menuContainer.append(extension.view);
        extension.view.css({position: 'absolute'}).hide();

        /* Create button id namespace in extension */
        extension.R = {};
        /* Load button ids */
        extension.view.find('[data-button-id]').each(function() {
          var name = $(this).attr('data-button-id').replace(/-([a-z0-9])/gi, function(match) {
            return match[1].toUpperCase();
          });
          self.options.buttonIdCounter += 1;
          extension.R[name] = self.options.buttonIdCounter;
          $(this).attr('data-extension-id', extension.id);
          $(this).attr('data-id', self.options.buttonIdCounter);
        });

        filter = [];
        /* Load key bindings */
        extension.subscribe.forEach(function(event) {
          re = /^@.*$/gi;
          if (re.test(event)) {
            if (!self.options.bindings[event]) {
              self.options.bindings[event] = [];
            }
            self.options.bindings[event].push(extension);
          } else {
            filter.push(event);
          }
        });
        extension.subscribe = filter;

        extension.init();
      }
      return this;
    },
    createView: function(structure) {
      var buttons,
        container = $('<div>'),
        load = function(source, attr, parent) {
          var ele = source.split(",");
          var but = $('<a>').addClass('button').attr('href', '#');
          if (ele[0]) {
            but.attr('data-button-id', ele[0]);
          }
          if (ele[1]) {
            but.html('<i class="fa fa-' + ele[1] + '"></i>');
          }
          if (ele[2]) {
            but.html(but.html() + ele[2]);
          }
          but.attr(attr);
          parent.append($('<li>').append(but));
        };

      if (!structure || !(structure instanceof  Array)) {
        return '';
      }
      buttons = $('<ul>');

      structure.forEach(function(buttonGroup) {
        var sep,
          name,
          group;

        if (buttonGroup instanceof Object) {
          sep = buttonGroup.sep;
          name = buttonGroup.name;
          group = buttonGroup.break || false;
          if (buttons === undefined) {
            buttons = $('<ul>');
          }
          switch (buttonGroup.type) {
            /* Choose one or none */
            case 'select':
              buttonGroup.buttons.forEach(function(e) {
                load(e, {'data-button-type': 'select', 'data-button-name': name}, buttons);
              });
              break;
            /* Choose one */
            case 'radio':
              buttonGroup.buttons.forEach(function(e) {
                load(e, {'data-button-type': 'radio', 'data-button-name': name}, buttons);
              });
              break;
            case 'checkbox':
              buttonGroup.buttons.forEach(function(e) {
                load(e, {'data-button-type': 'checkbox'}, buttons);
              });
              break;
            default:
              buttonGroup.buttons.forEach(function(e) {
                load(e, {}, buttons);
              });
              break;
          }
          if (sep === true) {
            buttons.find('li:last-child').addClass('sep-right');
          }
          if (group === true) {
            container.append(buttons.addClass("menu default"));
            buttons = undefined;
          }
        }
      });

      if (buttons) {
        container.append(buttons.addClass("menu default"));
      }

      return container;
    },
    createNodeList: function(node) {
      var list = {};
      if (node && isDescendant(this.elements.editable[0], node)) {
        while (node.parentNode) {
          list[node.nodeName.toLowerCase()] = true;
          node = node.parentNode;
          if (node.hasAttribute('data-edit')) {
            break;
          }
        }
      }
      return list;
    },
    propagateEvent: function(eventName, event) {
      if (this.options.bindings.hasOwnProperty(eventName)) {
        this.options.bindings[eventName].some(function(extension) {
          return extension.onEvent(eventName, event);
        });
      }
      return this;
    },
    wildcardHandler: function() {
      return this.nodeHandler('*');
    },
    nodeHandler: function(nodeName) {
      if (!this.state) {
        return this;
      }
      this.options.extensions.forEach(function(extension) {
        if (extension.subscribe.indexOf(nodeName) !== -1) {
          if (!extension.isActive) {
            extension.focusIn(nodeName);
          }
        }
      });
      return this;
    },
    blurExtensions: function() {
      if (!this.state) {
        return this;
      }
      this.options.extensions.forEach(function(extension) {
        if (extension.isActive === false) {
          extension.focusOut();
          extension.isActive = false;
        }
      });
      return this;
    },
    refreshExtensions: function() {
      if (!this.state) {
        return this;
      }
      this.options.extensions.forEach(function(extension) {
        extension.refresh();
      });
      return this;
    },
    onButtonClick: function(view, event) {
      var extensionId, buttonId, buttonValue;

      /* Get extension id */
      extensionId = parseInt(view.attr('data-extension-id'), 10);
      console.log("button#click");
      if (this.options.extensions[extensionId]) {
        buttonValue = this.getButtonValue(view);
        buttonId = parseInt(view.attr('data-id'), 10);
        console.log(this.options.extensions[extensionId].name);
        if (true === this.options.extensions[extensionId].onClick(buttonId, buttonValue, view, event)) {
          this.updateButtonState(view);
        }
      }
    },
    getButtonValue: function(button) {
      var isOn = button.is('[selected]');
      switch (button.attr('data-button-type')) {
        case 'select':
          return !isOn ? button.attr('data-button-id') : undefined;
        case 'radio':
          return button.attr('data-button-id');
        case 'checkbox':
          return !isOn;
        default:
          return true;
      }
    },
    updateButtonState: function(button) {
      if (button.attr('data-button-type') === 'radio') {
        return button.attr('selected', '');
      }

      if (!button.attr('data-button-type')) {
        return;
      }

      if (button.is('[selected]')) {
        return button.removeAttr('selected');
      }

      return button.attr('selected', '');
    },
    execFormatBlock: function(el) {
      var selectionData = this.getSelectionData(this.state.selection.anchorNode);
      // FF handles blockquote differently on formatBlock
      // allowing nesting, we need to use outdent
      // https://developer.mozilla.org/en-US/docs/Rich-Text_Editing_in_Mozilla
      if (el === 'blockquote' && selectionData.el &&
        selectionData.el.parentNode.tagName.toLowerCase() === 'blockquote') {
        return this.options.ownerDocument.execCommand('outdent', false, null);
      }
      if (selectionData.tagName === el) {
        el = 'p';
      }
      // When IE we need to add <> to heading elements and
      //  blockquote needs to be called as indent
      // http://stackoverflow.com/questions/10741831/execcommand-formatblock-headings-in-ie
      // http://stackoverflow.com/questions/1816223/rich-text-editor-with-blockquote-function/1821777#1821777
      if (this.isIE) {
        if (el === 'blockquote') {
          return this.options.ownerDocument.execCommand('indent', false, el);
        }
        el = '<' + el + '>';
      }
      console.log('FormatBlock::' + el);
      return this.options.ownerDocument.execCommand('formatBlock', false, el);
    },
    getSelectionData: function(el) {
      var tagName;

      if (el && el.tagName) {
        tagName = el.tagName.toLowerCase();
      }

      while (el && this.parentElements.indexOf(tagName) === -1) {
        el = el.parentNode;
        if (el && el.tagName) {
          tagName = el.tagName.toLowerCase();
        }
      }

      return {
        el: el,
        tagName: tagName
      };
    },
    execFormatCode: function() {
      // TODO add auto removing tag

      var text = (getSelectionHtml(this)),
        ele,
        range,
        nodeList;
      if (this.state && this.state.selection.rangeCount) {
        range = this.state.selection.getRangeAt(0);
        nodeList = this.createNodeList(this.state.selection.focusNode);
        if (!nodeList.code) {
          ele = document.createElement('code');
          ele.innerHTML = text.replace(/<\/?code>/gi, "");
          range.deleteContents();
        } else {
          ele = document.createElement('span');
          range.deleteContents();
          if (!this.state.selection.focusNode.innerHTML) {
            $(this.state.selection.focusNode).contents().remove();
          }
          ele.innerHTML = text;
        }

        range.insertNode(ele);
        range.setStartBefore(ele);
        range.setEndAfter(ele);
        this.state.selection.removeAllRanges();
        this.state.selection.addRange(range);
        return true;
      }
      return false;
    },
    execInsertNewLine: function() {
      // TODO unable to undo this change
      var range, ele;
      if (this.state && this.state.selection.rangeCount) {
        range = this.state.selection.getRangeAt(0);
        ele = range.createContextualFragment('<br>');
        range.insertNode(ele);
        range.setStartAfter(range.endContainer.nextSibling);
        this.state.selection.removeAllRanges();
        this.state.selection.addRange(range);
        return true;
      }
      return false;
    },
    execCommand: function(command, extra) {
      document.execCommand(command, false, extra);
    },
    stripTags: function(html) {
      var tmp = document.createElement("DIV");
      tmp.innerHTML = html;
      return tmp.textContent || tmp.innerText || "";
    },
    saveSelection: function() {
      this.savedSelection = saveSelection(this);
    },

    restoreSelection: function() {
      restoreSelection(this, this.savedSelection);
    }
  };

  Extension.prototype = {
    refresh: function() {
      this.view.css({
        top: this.base.state.position.top,
        left: this.base.state.position.left
      });
    },
    onClick: function() {
    },
    onEvent: function() {
    },
    focusIn: function() {
    },
    focusOut: function() {
    },
    init: function() {
    }
  };

  window.Editor = new Editor();
  Editor.elements.editable.focus();
}(window, document, window.jQuery));