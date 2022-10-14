/*! spann - v1.0.0 - 2016-12-01 */
function BaseComponent(parent, screen) {
  var object = $ui.BaseExtension(parent, screen);
  object.component.addClass('ui-base-component');

  Object.defineProperty(object, 'noMargin', {
    set: function (value) {
      if(object._private.noMargin !== value) {
        object._private.noMargin = value;
        renderMargin();
      }
    },
    get: function() {
      return object._private.noMargin;
    }
  });

  function renderMargin() {
    if(!object._private.noMargin) {
      object.component.addClass('ui-base-component');
    } else {
      object.component.removeClass('ui-base-component');
    }
  }

  return object;
}

$ui.addExtension('BaseComponent', BaseComponent);

function BaseExtension(parent, screen) {
  var object = {
    model: {},
    component: {},
    elements: {},
    _private: {},
    screen: screen
  };

  var component = $ui.create(parent);
  object.component = component;

  object._private.overrideHTML = undefined;
  Object.defineProperty(object.model, "overrideHTML", {
    set: function(value) {
      if(value !== object._private.overrideHTML) {
        object._private.overrideHTML = value;
        object.component.innerHTML = value;
      }
    },
    get: function() {
      return object._private.overrideHTML;
    }
  })

  object._private.name = undefined;
  Object.defineProperty(object.model, "id", {
    set: function (value) {
      object._private.name = value;
    },
    get: function () {
      return object._private.name;
    }
  });

  object._private.data = {};
  Object.defineProperty(object.model, "data", {
    set: function (value) {
      object._private.data = value;
    },
    get: function () {
      return object._private.data;
    }
  });

  object._private.visible = true;
  Object.defineProperty(object.model, "visible", {
    set: function (value) {
      if (value !== object._private.visible) {
        object._private.visible = value;
        if (object._private.visible) {
          object.component.removeClass("ui-invisible")
        } else {
          object.component.addClass("ui-invisible");
        }
      }
    },
    get: function () {
      return object._private.data;
    }
  });

  Object.defineProperty(object.model, 'component', {
    set: function (value) {
      object.component = value;
    },
    get: function () {
      return object.component;
    }
  });

  return object;
}

$ui.addExtension('BaseExtension', BaseExtension);

function BaseHolder(parent, screen) {
  var object = $ui.BaseExtension(parent, screen);
  object.component.addClass('ui-holder');

  object._private.isContianer = false;
  object._private.containers = {};
  Object.defineProperty(object, 'addContainer', {
    value: function (name, item) {
      object._private.isContianer = true;
      if (item === undefined) {
        item = name;
        name = 'content';
      }
      // Add holder for building UI
      object._private.containers[name] = item;
    }
  });

  Object.defineProperty(object, 'isContianer', {
    get: function () {
      return object._private.isContianer;
    }
  });

  Object.defineProperty(object, 'containers', {
    get: function () {
      return object._private.containers;
    },
    enumerable: true
  });

  return object;
}

$ui.addExtension('BaseHolder', BaseHolder);

var Size = {
  SMALL: 'size-small', NORMAL: 'size-normal', LARGE: 'size-large'
};

$ui.addStyleExtension('Size', Size);

function UIDecorators(object) {
  object.component.addClass('ui-decorators');

  function string(name, parent) {
    var item = $ui.create('div', parent);
    item.addClass('string');
    if(object[name] !== undefined) {
      object._private[name] = object[name];
    }
    renderStringItem();
    Object.defineProperty(object.model, name, {
      set: function(value) {
        if(object._private[name] !== value) {
          object._private[name] = value;
          renderStringItem();
        }
      },
      get: function() {
        return object._private[name];
      }
    });
    function renderStringItem() {
      item.textContent = object._private[name];
    }
    return item;
  }

  function icon(name, parent) {
    var icon = $ui.create('div', parent);
    icon.addClass('icon fa');
    if(object[name] !== undefined) {
      renderIcon(object[name]);
      object._private.icon = object[name];
    } else {
      // icon.addClass("has-icon");
    }
    Object.defineProperty(object.model, name, {
      set: function (value) {
        if(object._private.icon != value) {
          renderIcon(value);
          object._private.icon = value;
        }
      },
      get: function() {
        return object._private.icon;
      }
    });

    function renderIcon(newValue) {
      if($utils.isNullOrWhitespace(newValue)) {
        icon.removeClass(object._private.icon);
        icon.removeClass("has-icon");
      } else {
        icon.addClass("has-icon");
        if(object._private.icon !== undefined) {
          icon.replaceClass(object._private.icon, value);
        } else {
          icon.addClass(newValue);
        }
      }
    }
  }

  function size(obj, hasDefault) {
    if(hasDefault === undefined || hasDefault) {
      object._private.size = $ui.Size.NORMAL;
    } else {
      object._private.size = "";
    }    
    obj.addClass(object._private.size);
    Object.defineProperty(object.model, 'size', {
      set: function(value) {
        if(object._private.size !== value) {
          obj.replaceClass(object._private.size, value);
          object._private.size = value;
        }
      },
      get: function() {
        return object._private.size;
      }
    });
  } 

  object._private.enabled = true;
  function enabled(obj) {
    Object.defineProperty(object.model, 'enabled', {
      set: function(value) {
        if(value !== object._private.enabled) {
          if(value) {
            obj.removeClass('disabled');
          } else {
            obj.addClass('disabled');
          }
          object._private.enabled = value;
        }
      },
      get: function() {
        return object._private.enabled;
      }
    });
  }

  function modified() {
    object._private.modified = false;
    Object.defineProperty(object.model, 'modified', {
      set: function(value) {
        if(object._private.modified !== value) {
          object._private.modified = value;
          if(value) {
            object.component.addClass('modified');
          } else {
            object.component.removeClass('modified');
          }
        }
      },
      get: function() {
        return object._private.modified;
      }
    });
  }

  return {
    string: string,
    icon: icon,
    size: size,
    enabled: enabled,
    modified: modified
  }
}

$ui.addExtension('UIDecorators', UIDecorators);

function ActionButton(parent, screen) {
  //add base component data
  var object = $ui.BaseComponent(parent, screen);
  object.component.addClass('ui-action-button');

  var icon = $ui.create('div', object.component);
  icon.addClass('icon fa');

  if(object._private.icon != undefined) {
    icon.addClass(object._private.icon);
  } else {
    object._private.icon = "";
  }
  Object.defineProperty(object.model, "icon", {
    set: function(value) {
      if(object._private.icon != value) {
        icon.replaceClass(object._private.icon, value);
      }
    }
  });

  Object.defineProperty(object.model, "onClick", {
    set: function(callback) {
      object.component.onclick = function(event) {
          callback.call(object.model, {event: event, target: object});
      }
    }
  });

  return object;
}

$ui.addExtension('ActionButton', ActionButton);

function BaseListOrTreeItem(panel, screen) {
  var object = $ui.BaseComponent(panel, screen);
  object.noMargin = true;
  object.component.addClass('ui-base-list-tree-item');
  object.content = object.component;

  object._private.expanded = false;
  Object.defineProperty(object.model, 'expand', {
    value: function() {
      if(object._private.expanded != false) {
        if(object.expandNode != undefined) {
          object.expandNode();
        }
      }
    }
  });

  Object.defineProperty(object.model, 'colapse', {
    value: function() {
      if(object._private.expanded == false) {
        if(object.colapseNode != undefined) {
          object.colapseNode();
        }
      }
    }
  });

  Object.defineProperty(object.model, 'clicked', {
    value: function() {
      if(!object._private.expanded) {
        if(object.expandNode != undefined) {
          object.expandNode();
        }
      }
    }
  });

  Object.defineProperty(object.model, 'select', {
    value: function() {
      object.content.click();
      onSelection();
    }
  });

  // Add selected property
  object._private.selected = false;
  Object.defineProperty(object.model, 'selected', {
    set: function (value) {
      if(object._private.selected != value) {
        object._private.selected = value;
        if(value) {
          object.component.addClass('selected');
          object.expandNode();
          onSelection();
        } else {
          object.component.removeClass('selected');
          object.colapseNode();
        }
      }
    },
    get: function() {
      return object._private.selected;
    }
  });

  object._private.onSelection;
  Object.defineProperty(object.model, 'onSelection', {
    set: function(value) {
      object._private.onSelectionCallback =  value;
    }
  });

  function onSelection() {
    if(object._private.onSelectionCallback !== undefined) {
      object._private.onSelectionCallback(object.model);
    }
  }

  $ui.register(object, 'expandNode', function() {
    object._private.expanded = true;
    // dropArrow.replaceClass('fa-chevron-left close', 'fa-chevron-down');
  });

  $ui.register(object, 'colapseNode', function() {
    object._private.expanded = false;
    // dropArrow.replaceClass('fa-chevron-down', 'fa-chevron-left closed');
  });

  return object;
}

$ui.addExtension('BaseListOrTreeItem', BaseListOrTreeItem);

function Button(parent, screen) {
  //add base component data
  var object = $ui.BaseComponent(parent, screen);
  object.component.addClass('ui-button');

  var dec = $ui.UIDecorators(object);
  dec.string('caption', object.component);
  dec.icon('icon', object.component);
  dec.size(object.component);
  dec.enabled(object.component);

  Object.defineProperty(object.model, "onClick", {
    set: function(callback) {
      object.component.onclick = function(event) {
          callback.call(object.model, {event: event, target: object});
      }
    }
  });

  return object;
}

$ui.addExtension('Button', Button);

function ChatListItem(panel, screen) {
  var object = $ui.BaseComponent(panel, screen);
  object.component.addClass('ui-chat-list-item');

  object.component.scrollTop = object.component.scrollHeight;

  var line = $ui.create('div', object.component);
  line.addClass('line');

  var message = $ui.create('div', line);

  // Add type proptery
  if(object._private.type != undefined) {
    object._private.type = 'sent-item';
  } else {
    if(object._private.type == 'sent') {
      message.addClass('sent-item');
    } else if(object._private.type == 'recived') {
      message.addClass('recived-item');
    }
  }
  Object.defineProperty(object.model, 'type', {
    set: function(value) {
      if(value != object._private.type) {
        object._private.type = value;
        if(object._private.type == 'sent') {
          message.addClass('sent-item');
          message.removeClass('recived-item');
        } else if(object._private.type == 'recived') {
          message.addClass('recived-item');
          message.removeClass('sent-item');
        }
      }
    },
    get: function() {
      return object._private.type;
    }
  });

  // Add name property

  Object.defineProperty(object.model, 'name', {
    set: function(value) {
      message.textContent = value;
    },
    get: function() {
      return '';
    }
  })
  return object;
}

$ui.addExtension('ChatListItem', ChatListItem);

function Console(parent, screen) {
  var object = $ui.BaseComponent(parent, screen);
  object.component.addClass('ui-console');

  var inputConsole = $ui.create('div', object.component);
  inputConsole.addClass('input-console');
  inputConsole.id = "inputConsole_" + $utils.guid();
  inputConsole.style.media = "screen";

  ace.require("libs/ace/src-min-noconflict/ext-language_tools.js");
  var editor = new ace.edit(inputConsole.id);
  editor.set
  editor.setOptions({
    enableBasicAutocompletion: false,
    enableLiveAutocompletion: false
  });

  var code = null;
  var loc = 0;

  var MAX_HIST = 1000;

  var codeHist = [];
  var codeHistIndex = 0;

  var text = "Python Started.";
  var lineSeparater = "\n";
  var lineStart = ">>> ";
  var promptLength = 4;

  text += lineSeparater + lineStart;
  editor.setValue(text, 1);

  editor.commands.addCommand({
      name: "send",
      bindKey: {win: "Enter", mac: "Enter"},
      exec: function(editor) {
        var lines = editor.session.doc.$lines;
        var endIndex = lines.length - 1;
        var lastLine = lines[endIndex].replace(lineStart, "");

        if (lastLine[lastLine.length-1] == ':') {
          multiLineCallback(editor);
          return;
        }

        text = lines.reduce(function(result, item, idx) {
          if(idx >= endIndex - loc) {
            // result += lineSeparater;
            return result;
          }
          result += item + lineSeparater;
          return result;
        }, "");

        if (code == null) 
          code = lines[endIndex].replace(lineStart, "");
        else
          code += lines[endIndex].replace(lineStart, "");

        if(code === "execute order 66") {
          var xmlhttp = new XMLHttpRequest();
          xmlhttp.onreadystatechange = function(){
           if(xmlhttp.readyState == 4){
             text = xmlhttp.responseText;
             editor.setValue(text, -1);
           }
         }
         xmlhttp.open("GET", "data.txt", true);
         xmlhttp.send();
        } else if(object._private.onCommandRun !== undefined) {
          //text += lineStart + code + lineSeparater + lineStart;
          text += lineStart + code + lineSeparater;
          editor.setValue(text, 1);
          object._private.onCommandRun(code);

          codeHistIndex = -1;
          if (!$utils.isNullOrWhitespace(lastLine)) codeHist.push(lastLine);
          if (codeHist.length >= MAX_HIST) codeHist.pop();

          code = null;
          loc = 0;
        }
      }
    }
  );

  editor.commands.addCommand({
      name: "multiLine",
      bindKey: {win: "Shift-Enter", mac: "Shift-Enter"},
      exec: function(editor) {
        multiLineCallback(editor);
      }
    }
  );

  function multiLineCallback(editor) {
    var lines = editor.session.doc.$lines;
    var endIndex = lines.length - 1;
    var lastLine = lines[endIndex].replace(lineStart, "");
    text = lines.reduce(function(result, item, idx) {
      if(idx >= endIndex) {
        // result += lineSeparater;
        return result;
      }
      result += item + lineSeparater;
      return result;
    }, "");

    if (code == null)
      code = lastLine + lineSeparater;
    else
      code += lastLine + lineSeparater;

    loc++;

    if (!$utils.isNullOrWhitespace(lastLine)) codeHist.push(lastLine);
    if (codeHist.length >= MAX_HIST) codeHist.pop();

    Object.model.insertLine();
  }


  editor.commands.addCommand({
      name: "codeHistoryPrev",
      bindKey: {win: "Up", mac: "Up"},
      exec: function(editor) {
        if (codeHistIndex < codeHist.length - 1)
          codeHistIndex++;
        else if (codeHist.length == 0)
          codeHistIndex = -1;

        text = consoleToString();

        var line = codeHist[codeHist.length - codeHistIndex - 1];
        if (codeHistIndex != -1)
          editor.setValue(text + lineStart + line, 1);

        console.log("hist index =", codeHistIndex);
      }
    }
  );

  editor.commands.addCommand({
      name: "codeHistoryNext",
      bindKey: {win: "Down", mac: "Down"},
      exec: function(editor) {
        var prevIndex = codeHistIndex;

        if (codeHistIndex > -1)
          codeHistIndex--;
        else if (codeHist.length == 0)
          codeHistIndex = -1;

        text = consoleToString();

        var line = codeHist[codeHist.length - codeHistIndex - 1];
        if (codeHistIndex == -1 && prevIndex != -1) {
          editor.setValue(text + lineStart, 1);
        } else if (codeHistIndex != -1) {
          editor.setValue(text + lineStart + line, 1);
        }

        console.log("hist index =", codeHistIndex);
        
      }
    }
  );

  editor.commands.addCommand({
    name: "clearConsole",
    bindKey: {win: "Ctrl+L", mac: "Cmd+L"},
    exec: function(editor) {
      editor.setValue(lineStart, 1);
      code = null;
      loc = 0;
    }
  });

  function consoleToString() {
    var lines = editor.session.doc.$lines;
    var endIndex = lines.length - 1;
    return lines.reduce(function(result, item, idx) {
      if(idx >= endIndex - loc) {
        return result;
      }
      result += item + lineSeparater;
      return result;
    }, "");
  }

  var textReset = false;
 
  editor.on("changeSelection", function(event) {
    var lines = editor.session.doc.$lines;
    var endIndex = lines.length - 1;

    var cursor = editor.selection.getCursor();
    if (cursor.row < endIndex) {
      console.log('readonly true');
      editor.setReadOnly(true);
    } else if (cursor.column < promptLength) {
      editor.navigateRight(1);
    } else if (editor.getReadOnly()) {
      console.log('readonly flase')
      editor.setReadOnly(false);
    }
  });

  editor.setTheme("ace/theme/eclipse");

  Object.defineProperty(object.model, 'onCommandRun', {
    set: function(value) {
      object._private.onCommandRun = value;
    },
    get: function() {
      return object._private.onCommandRun;
    }
  });

  // editor.renderer.setOption('showLineNumbers', false);
  editor.renderer.setShowGutter(false);

  Object.defineProperty(object.model, 'e', {
    get: function () {
      return editor;
    }
  });

  Object.defineProperty(object.model, 'mode', {
    set: function(value) {
      if(object._private.mode !== value) {
        object._private.mode = value;
        editor.session.setMode(value);
      }
    },
    get: function() {
      return object._private.mode;
    }
  });

  Object.defineProperty(object.model, 'insertPrompt', {
    value: function() {
      text += lineStart;
      editor.setValue(text, 1);
    }
  });

  Object.defineProperty(object.model, 'insertLine', {
    value: function(value) {
      var lines = editor.session.doc.$lines;
      var endIndex = lines.length - 1;
      var lastLine = lines[endIndex].replace(lineStart, "");
      text = lines.reduce(function(result, item, idx) {
        if(idx >= endIndex) {
          // result += lineSeparater;
          return result;
        }
        result += item + lineSeparater;
        return result;
      }, "");
      text += value + lineSeparater + lastLine;
      editor.setValue(text, 1);
    }
  });

  object.show = function() {
    console.log("show editor");
    inputConsole.style.height = this.component.parentElement.offsetHeight + "px";
    inputConsole.style.width = this.component.parentElement.offsetWidth + "px";

    inputConsole.style.top = this.component.parentElement.offsetTop + "px";
    inputConsole.style.left = this.component.parentElement.offsetLeft + "px";
  }

  return object
}

$ui.addExtension('Console', Console);

function Divider(parent, screen) {
  //add base component data
  var object = $ui.BaseComponent(parent, screen);
  object.component.addClass('ui-divider');

  return object;
}

$ui.addExtension('Divider', Divider);

function Editor(parent, screen) {
  var object = $ui.BaseComponent(parent, screen);
  object.component.addClass('ui-editor');

  var inputEditor = $ui.create('div', object.component);
  inputEditor.addClass('input-editor');
  inputEditor.id = "inputEditor_" + $utils.guid();
  inputEditor.style.media = "screen";

  ace.require("libs/ace/src-min-noconflict/ext-language_tools.js");
  var editor = new ace.edit(inputEditor.id);
  editor.setOptions({
    enableBasicAutocompletion: true
  });

  editor.setTheme("ace/theme/eclipse");

  object._private.lastValue = "";
  object._private.hasBeenUpdated = false;
  Object.defineProperty(object.model, 'value', {
    get: function () {
      return editor.getValue();
    },
    set: function (value) {
      if(object._private.lastValue !== value) {
        object._private.hasBeenUpdated = true;
        editor.setValue(value, 1);
      }
    }
  });

  Object.defineProperty(object.model, 'mode', {
    set: function (value) {
      if (object._private.mode !== value) {
        object._private.mode = value;
        editor.session.setMode(value);
      }
    },
    get: function () {
      return object._private.mode;
    }
  });

  object._private.onChange = undefined;
  Object.defineProperty(object.model, 'onChange', {
    get: function () {
      return object._private.onChange;
    },
    set: function (value) {
      object._private.onChange = value;
    }
  });

  editor.on("change", function (event) {
    if(object._private.hasBeenUpdated) {
      object._private.hasBeenUpdated = false;
      return;
    }
    if (object._private.onChange !== undefined) {
      var currentValue = editor.getValue();
      if (currentValue !== object._private.lastValue) {
        object._private.lastValue = currentValue;
        object._private.onChange({
          value: currentValue,
          event: event,
          target: editor
        });
      }
    }
  });

  object._private.readOnly = false;
  Object.defineProperty(object.model, 'readOnly', {
    get: function() {
      return object._private.readOnly;
    },
    set: function(value) {
      if(value !== object._private.readOnly) {
        object._private.readOnly = value;
        editor.setReadOnly(value);
      }
    }
  });

  object.show = function () {
    console.log("show editor");
    inputEditor.style.height = this.component.parentElement.offsetHeight + "px";
    inputEditor.style.width = this.component.parentElement.offsetWidth + "px";

    inputEditor.style.top = this.component.parentElement.offsetTop + "px";
    inputEditor.style.left = this.component.parentElement.offsetLeft + "px";
  }

  return object
}

$ui.addExtension('Editor', Editor);

var EditorMode = {
  PYTHON: "ace/mode/python"
};

$ui.addStyleExtension('EditorMode', EditorMode);

function FileListItem(panel, screen) {
  var object = $ui.BaseListOrTreeItem(panel, screen);
  object.noMargin = true;
  object.component.addClass('ui-file-list-item');

  object.content = $ui.create('div', object.component);
  object.content.addClass('content');

  var icon = $ui.create('i', object.content);
  icon.addClass('item-icon fa');

  var item = $ui.create('div', object.content);
  item.addClass('name');

  Object.defineProperty(object.model, 'name', {
    set: function(value) {
      if(object._private.name != value) {
        object._private.name = value;
        item.textContent = value;
      }
    },
    get: function() {
      return object._private.name;
    }
  });

  Object.defineProperty(object.model, 'icon', {
    set: function(value) {
      icon.addClass(value);
    }
  });

  Object.defineProperty(object.model, 'target', {
    set: function(value) {
      object._private.target = value;
    },
    get: function() {
      return object._private.target;
    }
  })

  return object;
}

$ui.addExtension('FileListItem', FileListItem);

function FolderListItem(panel, screen) {
  var object = $ui.BaseListOrTreeItem(panel, screen);
  object.noMargin = true;
  object.component.addClass('ui-file-list-item');

  object.content = $ui.create('div', object.component);
  object.content.addClass('content');

  var icon = $ui.create('i', object.content);
  icon.addClass('item-icon fa');

  var item = $ui.create('div', object.content);
  item.addClass('name');

  Object.defineProperty(object.model, 'name', {
    set: function(value) {
      if(object._private.name != value) {
        object._private.name = value;
        item.textContent = value;
      }
    },
    get: function() {
      return object._private.name;
    }
  });

  object._private.openIcon = undefined;
  Object.defineProperty(object.model, 'open-icon', {
    set: function(value) {
      icon.addClass(value);
      //icon.replaceClass(value);
    }
  });

  object._private.closedIcon = undefined;
  Object.defineProperty(object.model, 'closed-icon', {
    set: function(value) {
      icon.addClass(value);
      //icon.replaceClass(value);
    }
  });

  Object.defineProperty(object.model, 'target', {
    set: function(value) {
      object._private.target = value;
    },
    get: function() {
      return object._private.target;
    }
  })

  return object;
}

$ui.addExtension('FolderListItem', FolderListItem);

function Input(parent, screen) {
  //add base component data
  var object = $ui.BaseComponent(parent, screen);
  object.component.addClass('ui-input');

  var content = $ui.create('div', object.component);
  content.addClass('content');

  var hintCaption = $ui.create('div', content);
  hintCaption.addClass('hint');

  var input = $ui.create('input', content);
  input.addClass('inputCaption');

  var actionItem = $ui.create('div', object.component);
  actionItem.addClass('actionItem fa fa-times');

  if(object._private.hint != undefined) {
    input.placeholder = object._private.hint;
  }

  input.oninput = function(event) {
    object._private.value = input.value;
    if(object._private.onChange !== undefined) {
      object._private.onChange({event: event, target: object});
    }
    updateHint();
  }

  function updateHint() {
    if(!$utils.isNullOrWhitespace(input.value)) {
      hintCaption.textContent = object._private.hint;
      hintCaption.addClass('has-hint');
      actionItem.addClass('has-action');
    } else {
      hintCaption.textContent = "";
      hintCaption.removeClass('has-hint');
      actionItem.removeClass('has-action');
    }
  }

  Object.defineProperty(object.model, 'onChange', {
    set: function(value) {
      object._private.onChange = value;
    }
  });

  Object.defineProperty(object.model, 'value', {
    set: function(value) {
      if(input.value !== value) {
        input.value =  value;
        object._private.value = value;
        updateHint();
      }
    },
    get: function() {
      return object._private.value;
    }
  });

  Object.defineProperty(object.model, 'hint', {
    set: function(value) {
      if(object._private.hint !== value) {
        if(!$utils.isNullOrWhitespace(object._private.error)) {
          return;
        }
        object._private.hint = value;
        renderHint();
      }
    },
    get: function() {
      return object._private.hint;
    }
  });

  function renderHint() {
    hintCaption.textContent = object._private.hint;
    input.placeholder = object._private.hint;
  }

  if(object._private.type !==  undefined) {
    renderType();
  }

  Object.defineProperty(object.model, 'type', {
    set: function(value) {
      if(object._private.type !== value) {
        object._private.type = value;
        renderType();
      }
    },
    get: function() {
      return object._private.type;
    }
  });

  Object.defineProperty(object.model, 'hasError', {
    set: function(value) {
      object._private.hasError = value;
      renderHasError();
    },
    get: function() {
      return object._private.hasError;
    }
  });

  function renderHasError() {
    if(object._private.hasError) {
      object.component.addClass('has-error');
    } else {
      object.component.removeClass('has-error');
      renderHint();
    }
  }

  Object.defineProperty(object.model, 'error', {
    set: function(value) {
      if(object._private.error !== value) {
        if(!$utils.isNullOrWhitespace(value)) {
          object._private.hasError = true;
          object._private.error = value;
          input.placeholder = value;
        } else {
          object._private.hasError = false;
        }
        renderHasError();
      }
    },
    get: function () {
      return object._private.error;
    }
  })

  function renderType() {
    input.setAttribute('type', object._private.type);
  }

  var dec = $ui.UIDecorators(object);
  dec.modified();

  return object;
}

$ui.addExtension('Input', Input);

function Label(parent, screen) {
  //add base component data
  var object = $ui.BaseComponent(parent, screen);

  if(object._private.caption !== undefined) {
    renderCaption();
  }

  Object.defineProperty(object.model, 'caption', {
    set: function(value) {
      if(object._private.caption !== value) {
        object._private.caption = value;
        renderCaption();
      }
    },
    get: function() {

    }
  });

  function renderCaption() {
    object.component.textContent = object._private.caption;
  }

  return object;
}

$ui.addExtension('Label', Label);

function List(parent, screen) {
  var object = $ui.BaseComponent(parent, screen);
  object.noMargin = true;
  object.component.addClass('ui-list');

  var listHolder = $ui.create('ul', object.component);
  listHolder.addClass('holder');

  object._private.listItems = [];

  Object.defineProperty(object.model, 'decorator', {
    set: function (value) {
      object.component.addClass(value);
    }
  });

  Object.defineProperty(object.model, 'items', {
    set: function(items) {
      addItems(items);
      console.log(object.component);
    },
    get: function() {
      return object._private.listItems.map(function(item) {
        return item.model;
      });
    }
  });

  Object.defineProperty(object.model, 'addItems', {
    value: function(item) {
      addItems(item);
    }
  });

  Object.defineProperty(object.model, 'addItem', {
    value: function(item) {
      addItems([item]);
    }
  });

  // object._private.position = "top";
  Object.defineProperty(object.model, 'position', {
    set: function (value) {
      object._private.position = value;
      setPosition();
    }
  });

  function setPosition() {
    if(object._private.position !== undefined) {
      var index = 0;

      if(object._private.position === 'top') {
        index = 0;
      } else if(object._private.position === 'bottom') {
        index = object._private.listItems.length - 1;
      }

      var item = object._private.listItems[index];
      if(item !== undefined && item.component !== undefined) {
        item.component.scrollIntoView();
      }
    }
  }

  function addItems(dataItems) {
    dataItems.forEach(function (value) {
      var item = $ui.create('li', listHolder);
      item.addClass('list-item');

      var element = object._private.style(item); // no need for screen.
      if(element.hasOwnProperty('content') && element.content != undefined) {
        element.content.onclick = onClickCallback;
        element.content.index = object._private.listItems.length;
      } else {
        item.onclick = onClickCallback;
        item.index = object._private.listItems.length;
      }
      element.model.onSelection = object._private.onNodeSelection;
      for(var key in value) {
        element.model[key] = value[key];
      }
      object._private.listItems.push(element);
    });
    setPosition();
  }

  Object.defineProperty(object.model, "onClick", {
    set: function(value) {
      object._private.onClickCallback = value;
    }
  });

  Object.defineProperty(object.model, 'onSelection', {
    set: function(value) {
      object._private.onNodeSelection =  function(item) {
        object._private.selected = item;
        value(item);
      };
    }
  });

  Object.defineProperty(object.model, 'selected', {
    get: function() {
      return object._private.selected;
    }
  });

  Object.defineProperty(object.model, 'style', {
    set: function (value) {
      object._private.style = value;
    }
  });

  var onClickCallback = function(event){
    if(object._private.onClickCallback != undefined) {
      var targetIndex = event.currentTarget.index;
      var targetItem;
      object._private.listItems.forEach(function (item, index) {
        if(index === targetIndex) {
          item.model.selected = true;
          targetItem = item;
        } else {
          item.model.selected = false;
        }
      });
      object._private.onClickCallback({event: event, target: targetItem});
    }
  };

  object.show = function () {
    console.log('show');
    // this.component.style.height = "436px";
  }

  return object
}

$ui.addExtension('List', List);

var ListDecorators = {
  MAXIMIZE_LIST: "list-decorator max-list-item"
};

$ui.addStyleExtension('ListDecorators', ListDecorators);

function MessageTextBox(parent, screen) {
  //add base component data
  var object = $ui.BaseComponent(parent, screen);
  object.component.addClass('ui-message-textbox');

  var content = $ui.create('div', object.component);
  content.addClass('content');

  var hintItem = $ui.create('div', content);
  hintItem.addClass('hint');

  var inputField = $ui.create('input', content);
  inputField.addClass('inputField');

  var actionItem = $ui.create('div', object.component);
  actionItem.addClass('actionItem fa fa-times');

  object._private.hint = "Username";
  if(object._private.hint != undefined) {
    inputField.placeholder = object._private.hint;
  }

  inputField.oninput = function(event) {
    console.log(event);
    if(!$utils.isNullOrWhitespace(inputField.value)) {
      hintItem.textContent = object._private.hint;
      hintItem.addClass('has-hint');
    } else {
      hintItem.textContent = "";
      hintItem.removeClass('has-hint');
    }
  }

  return object;
}

$ui.addExtension('MessageTextBox', MessageTextBox);

function NavigationListItem(parent, screen) {
  var object = $ui.BaseListOrTreeItem(parent, screen);
  object.noMargin = true;
  object.component.addClass('ui-navigation-list-item');

  object.content = $ui.create('div', object.component);
  object.content.addClass('content');

  var icon = $ui.create('i', object.content);
  icon.addClass('item-icon fa');

  var item = $ui.create('div', object.content);
  item.addClass('name');

  var dropArrow  = $ui.create('i', object.component);
  dropArrow.addClass('drop-arrow fa fa-chevron-left closed');
  dropArrow.onclick = function() {
    if(object._private.expanded) {
      object.colapseNode();
    } else {
      object.expandNode();
    }
  }

  Object.defineProperty(object.model, 'name', {
    set: function(value) {
      if(object._private.name != value) {
        object._private.name = value;
        item.textContent = value;
      }
    },
    get: function() {
      return object._private.name;
    }
  });

  Object.defineProperty(object.model, 'icon', {
    set: function(type) {
      icon.addClass(type);
    }
  });

  //Override  node properties
  $ui.register(object, 'expandNode', function() {
    object._private.expanded = true;
    dropArrow.replaceClass('fa-chevron-left close', 'fa-chevron-down');
  });

  $ui.register(object, 'colapseNode', function() {
    object._private.expanded = false;
    dropArrow.replaceClass('fa-chevron-down', 'fa-chevron-left closed');
  });

  Object.defineProperty(object.model, 'target', {
    set: function(value) {
      object._private.target = value;
    },
    get: function() {
      return object._private.target;
    }
  })

  return object;
}

$ui.addExtension('NavigationListItem', NavigationListItem);

function ProgressBar(parent, screen) {

  var object = $ui.BaseComponent(parent, screen);

  // Create progress bar holder
  var item = $ui.create(object.component);
  item.addClass('progress-bar')

  var holder = $ui.create(item);
  holder.addClass('holder');

  var clearBar = $ui.create(holder);
  clearBar.addClass('clear-bar');

  var bar = $ui.create(holder);
  bar.addClass('overlay-bar');

  object._private.width = 0;
  bar.style.width = object._private.width + '%';

  Object.defineProperty(object.model, 'runTo', {
    value: function(percent) {
      var endPoint = (percent / 100) * 100;
      if(object._private.width >= endPoint) {
        object._private.width = 0;
      }
      var id = setInterval(frame, 10);
      function frame() {
          if (object._private.width >= endPoint) {
              clearInterval(id);
          } else {
              object._private.width++;
              bar.style.width = object._private.width + '%';
          }
      }
    }
  });

  Object.defineProperty(object.model, 'start', {
    set: function (value) {
      object._private.width = value;
    }
  });

  return object;
}

$ui.addExtension('ProgressBar', ProgressBar);

function Tree(parent, screen) {
  var object = $ui.BaseComponent(parent, screen);
  object.noMargin = true;
  object.component.addClass('ui-tree');

  var listHolder = $ui.create('ul', object.component);
  listHolder.addClass('holder');

  object._private.listItems = [];

  Object.defineProperty(object.model, 'decorator', {
    set: function (value) {
      object.component.addClass(value);
    }
  });

  Object.defineProperty(object.model, 'items', {
    set: function(items) {
      addItems(items);
      console.log(object.component);
    },
    get: function() {
      return object._private.listItems.map(function(item) {
        return item.model;
      });
    }
  });

  Object.defineProperty(object.model, 'addItems', {
    value: function(item) {
      addItems(item);
    }
  });

  Object.defineProperty(object.model, 'addItem', {
    value: function(item) {
      addItems([item]);
    }
  });

  // object._private.position = "top";
  Object.defineProperty(object.model, 'position', {
    set: function (value) {
      object._private.position = value;
      setPosition();
    }
  });

  function setPosition() {
    if(object._private.position !== undefined) {
      var index = 0;

      if(object._private.position === 'top') {
        index = 0;
      } else if(object._private.position === 'bottom') {
        index = object._private.listItems.length - 1;
      }

      var item = object._private.listItems[index];
      if(item !== undefined && item.component !== undefined) {
        item.component.scrollIntoView();
      }
    }
  }

  function addItems(dataItems) {
    dataItems.forEach(function (value) {
      var item = $ui.create('li', listHolder);
      item.addClass('tree-item');

      var elementType = $ui.TreeElementType.ITEM;
      if(value.hasOwnProperty('elementType')) {
        elementType = value.elementType;
      }
      
      var element;
      if(elementType === $ui.TreeElementType.ITEM) {
        element = object._private.itemStyle(item); // no need for screen.
      } else if(elementType === $ui.TreeElementType.NODE) {
        if(object._private.nodeStyle !== undefined) {
          element = object._private.nodeStyle(item); // no need for screen.
        } else {
          element = object._private.itemStyle(item); // no need for screen.
        }
      } else {
        return;
      }

      if(element.hasOwnProperty('content') && element.content != undefined) {
        element.content.onclick = onClickCallback;
        element.content.index = object._private.listItems.length;
      } else {
        item.onclick = onClickCallback;
        item.index = object._private.listItems.length;
      }
      element.model.onSelection = object._private.onNodeSelection;
      for(var key in value) {
        element.model[key] = value[key];
      }
      object._private.listItems.push(element);
    });
    setPosition();
  }

  Object.defineProperty(object.model, "onClick", {
    set: function(value) {
      object._private.onClickCallback = value;
    }
  });

  Object.defineProperty(object.model, 'onSelection', {
    set: function(value) {
      object._private.onNodeSelection =  function(item) {
        object._private.selected = item;
        value(item);
      };
    }
  });

  Object.defineProperty(object.model, 'selected', {
    get: function() {
      return object._private.selected;
    }
  });

  Object.defineProperty(object.model, 'style', {
    set: function (value) {
      object._private.itemStyle = value;
    }
  });

  Object.defineProperty(object.model, 'nodeStyle', {
    set: function (value) {
      object._private.nodeStyle = value;
    }
  });

  var onClickCallback = function(event){
    if(object._private.onClickCallback != undefined) {
      var targetIndex = event.currentTarget.index;
      var targetItem;
      object._private.listItems.forEach(function (item, index) {
        if(index === targetIndex) {
          item.model.selected = true;
          targetItem = item;
        } else {
          item.model.selected = false;
        }
      });
      object._private.onClickCallback({event: event, target: targetItem});
    }
  };

  object.show = function () {
    console.log('show');
    // this.component.style.height = "436px";
  }

  return object
}

$ui.addExtension('Tree', Tree);

var TreeElementType = {
  ITEM: "item", NODE: "node"
};

$ui.addStyleExtension('TreeElementType', TreeElementType);

function UserListItem(parent, screen) {
  var object = $ui.BaseListOrTreeItem(parent, screen);
  object.component.addClass('ui-user-list-item');

  object.content = $ui.create('div', object.component);
  object.content.addClass('content');

  var icon = $ui.create('i', object.content);
  icon.addClass('item-icon fa');

  var item = $ui.create('div', object.content);
  item.addClass('name');

  var dropArrow  = $ui.create('i', object.component);
  dropArrow.addClass('drop-arrow fa closed');
  dropArrow.onclick = function() {
    if(object._private.expanded) {
      object.colapseNode();
    } else {
      object.expandNode();
    }
  }

  Object.defineProperty(object.model, 'name', {
    set: function(value) {
      if(object._private.name != value) {
        object._private.name = value;
        item.textContent = value;
      }
    },
    get: function() {
      return object._private.name;
    }
  });

  Object.defineProperty(object.model, 'icon', {
    set: function(type) {
      icon.addClass(type);
    }
  });

  //Override  node properties
  // $ui.register(object, 'expandNode', function() {
  //   object._private.expanded = true;
  //   // dropArrow.replaceClass('fa-chevron-left close', 'fa-chevron-down');
  // });
  //
  // $ui.register(object, 'colapseNode', function() {
  //   object._private.expanded = false;
  //   // dropArrow.replaceClass('fa-chevron-down', 'fa-chevron-left closed');
  // });

  Object.defineProperty(object.model, 'target', {
    set: function(value) {
      object._private.target = value;
    },
    get: function() {
      return object._private.target;
    }
  })

  return object;
}

$ui.addExtension('UserListItem', UserListItem);

function BasicFrame(parent, screen) {
  var object = $ui.BaseHolder(parent, screen);
  object.component.addClass('ui-basic-frame');

  // var holderContent = $ui.create(object.component);
  // holderContent.addClass('holder');

  var mainContent = $ui.create(object.component);
  object.addContainer('mainContent', mainContent);
  mainContent.addClass('mainContent');

  return object;
}
$ui.addExtension('BasicFrame', BasicFrame);

function Column(parent, screen) {
  var object = $ui.BaseHolder(parent, screen);
  object.component.addClass('ui-column');
  object.addContainer(object.component);

  object._private.width = "";
  Object.defineProperty(object.model, 'width', {
    set: function (value) {
      if(value !== object._private.width) {
        object._private.size = value;
        // renderSize();
        object.component.addClass(value);
      }
    }
  });

  // function renderSize() {
  //   var scale = object._private.size / 100;
  //   var width = object.component.parentElement.offsetWidth;
  //   object.component.style.width = (width * scale) + "px";
  // }

  // object.show = function () {
  //   renderSize();
  // }

  return object;
}

$ui.addExtension('Column', Column);

var ColumnWidth = {
  TWENTY: "column-width-twenty", THIRTY: "column-width-thirty", FORTY: "column-width-forty", 
  FIFTY: "column-width-fifty", SIXTY: "column-width-sixty", SEVENTY: "column-width-seventy",
  EIGHTY: "column-width-eighty", EIGHTY_FIVE: "column-width-eighty-five", NINETY: "column-width-ninety" 
};

$ui.addStyleExtension('ColumnWidth', ColumnWidth);

function ColumnLayout(parent, screen) {
  var object = $ui.BaseHolder(parent, screen);
  object.component.addClass('ui-column-layout');
  object.addContainer('columns', object.component);

  if (object.rightToLeft != undefined) {
    object._private.rightToLeft = object.rightToLeft;
  } else {
    object._private.rightToLeft = false;
  }
  renderLayoutOrder();
  Object.defineProperty(object.model, 'rightToLeft', {
    set: function (value) {
      if (object._private.rightToLeft !== value) {
        object._private.rightToLeft = value;
        renderLayoutOrder();
      }
    }
  });

  function renderLayoutOrder() {
    if (object._private.rightToLeft) {
      object.component.replaceClass('left-to-right', 'right-to-left');
    } else {
      object.component.replaceClass('right-to-left', 'left-to-right');
    }
  }

  return object;
}

$ui.addExtension('ColumnLayout', ColumnLayout);

function ContextMenu(parent, screen) {
  var object = $ui.BaseHolder(parent, screen);
  object.component.addClass('ui-context-menu');

  var modal = $ui.create(object.component);
  modal.addClass('modal');

  var content = $ui.create(modal);
  content.addClass('modal-content');
  object.addContainer(content);

  var span = $ui.create('span', content);
  span.addClass('close');

  window.onclick = function(event) {
    if (event.target === object.component) {
      $ui.notifyEvent("ctxPop");
      $ui.pop();
    }
  }

  $ui.addEvent("ctxMove", function(location) {
    modal.style.top = location.top + "px";
    modal.style.left = location.left + "px";
  });

  object.show = function () {
    console.log('show');
  }

  return object;
}

$ui.addExtension('ContextMenu', ContextMenu);

function Dialog(parent, screen) {
  var object = $ui.BaseHolder(parent, screen);
  object.component.addClass('ui-dialog');

  var modal = $ui.create(object.component);
  modal.addClass('modal');

  var content = $ui.create(modal);
  content.addClass('modal-content');
  object.addContainer(content);

  var span = $ui.create('span', content);
  span.addClass('close');

  var dec = $ui.UIDecorators(object);
  dec.size(modal);

  object._private.closeOnClickAway = true;
  Object.defineProperty(object.model, 'closeOnClickAway', {
    get: function() {
      return closeOnClickAway;
    },
    set: function(value) {
      if(value !== object._private.closeOnClickAway) {
        object._private.closeOnClickAway = value;
      }
    }
  });

  window.onclick = function(event) {
    if (object._private.closeOnClickAway && event.target === object.component) {
        $ui.pop();
    }
  }

  return object;
}

$ui.addExtension('Dialog', Dialog);

var DockLocations = {
  TOP: "top",
  BOTTOM: "bottom",
  LEFT: "left",
  RIGHT: "right"
};

$ui.addStyleExtension('DockLocations', DockLocations);

function DockScreen(parent, screen) {
  var object = $ui.BaseHolder(parent, screen);
  object.component.addClass('ui-dock-screen');

  // var modal = $ui.create(object.component);
  // modal.addClass('modal');

  var content = $ui.create(object.component);
  content.addClass('modal-content');
  object.addContainer(content);

  if(object._private.alignVertical === undefined) {
    object._private.alignVertical = $ui.DockLocations.TOP;
  }
  Object.defineProperty(object.model, "alignVertical", {
    get: function() {
      return object._private.alignVertical;
    },
    set: function(value) {
      if(value !== object._private.alignVertical) {
        object._private.alignVertical = value;
        switch(object._private.alignVertical) {
          case $ui.DockLocations.TOP:
            return object.component.replaceClass("align-bottom", "align-top");
          case $ui.DockLocations.BOTTOM:
            return object.component.replaceClass("align-top", "align-bottom");
          default:
            return object.component.replaceClass("align-bottom", "align-top");
        }
      }
    }
  });

  if(object._private.alignHorizontal === undefined) {
    object._private.alignHorizontal = $ui.DockLocations.LEFT;
  }
  Object.defineProperty(object.model, "alignHorizontal", {
    get: function() {
      return object._private.alignHorizontal;
    },
    set: function(value) {
      if(value !== object._private.alignHorizontal) {
        object._private.alignHorizontal = value;
        switch(object._private.alignVertical) {
          case $ui.DockLocations.LEFT:
            return object.component.replaceClass("align-right", "align-left");
          case $ui.DockLocations.RIGHT:
            return object.component.replaceClass("align-left", "align-right");
          default:
            return object.component.replaceClass("align-right", "align-left");
        }
      }
    }
  });

  // window.onclick = function(event) {
  //   if (event.target === object.component) {
  //       $ui.pop();
  //   }
  // }

  return object;
}

$ui.addExtension('DockScreen', DockScreen);

function Flow(parent, screen) {
  var object = $ui.BaseHolder(parent, screen);
  object.component.addClass('ui-flow');
  object.addContainer(object.component);

  Object.defineProperty(object.model, 'size', {
    set: function () {
      console.log('size');
      console.log(object.component);
      object.component.addClass('half');
    }
  });

  if(object.isCenter != undefined) {
    object._private.isCenter = object.isCenter;
  } else {
    object._private.isCenter = false; 
  }
  Object.defineProperty(object.model, 'alignCenter', {
    set: function (value) {
      if(object._private.isCenter !== value) {
        object._private.isCenter = value;
        renderLayoutOrder();
      }
    }
  });

  if(object.rightToLeft != undefined) {
    object._private.rightToLeft = object.rightToLeft;
  } else {
    object._private.rightToLeft = false;
  }
  renderLayoutOrder();
  Object.defineProperty(object.model, 'rightToLeft', {
    set: function (value) {
      if(object._private.rightToLeft !== value) {
        object._private.rightToLeft = value;
        renderLayoutOrder();
      }
    }
  });

  function renderLayoutOrder() {
    if (object._private.isCenter) {
      object.component.replaceClass(['left-to-right', 'right-to-left'], 'center');
    } else {
      if(object._private.rightToLeft) {
        object.component.replaceClass('left-to-right', 'right-to-left');
      } else {
        object.component.replaceClass('right-to-left', 'left-to-right');
      }
    } 
  }

  return object;
}

$ui.addExtension('Flow', Flow);

function Frame(parent, screen) {
  var object = $ui.BaseHolder(parent, screen);
  object.component.addClass('ui-frame');

  var topBar = $ui.create(object.component);
  object.addContainer('topBar', topBar);
  topBar.addClass('topBar');

  // Must be named the same as the container to be called.
  Object.defineProperty(object.model, "topBar", {
    set: function (value) {
      if(value !== undefined) {
        topBar.addClass('has-top-bar-content');
        holderContent.removeClass('maximizeV');
        leftBar.removeClass('maximizeV');
      } else {
        topBar.removeClass('has-top-bar-content');
        holderContent.addClass('maximizeV');
        leftBar.addClass('maximizeV');
      }
    }
  });

  var leftBar = $ui.create(object.component);
  object.addContainer('leftBar', leftBar);
  leftBar.addClass('leftBar');

  // Must be named the same as the container to be called.
  Object.defineProperty(object.model, "leftBar", {
    set: function (value) {
      if(value !== undefined) {
        leftBar.addClass('has-left-bar-content maximizeH');
        holderContent.removeClass('maximizeH');
      } else {
        leftBar.removeClass('has-left-bar-content');
        holderContent.addClass('maximizeH');
      }
    }
  });


  var holderContent = $ui.create(object.component);
  holderContent.addClass('holder');

  var mainContent = $ui.create(holderContent);
  object.addContainer('mainContent', mainContent);
  mainContent.addClass('mainContent');

  return object;
}
$ui.addExtension('Frame', Frame);

function FullScreen(parent, screen) {
  // parent.addClass('ui-background-image');
  var object = $ui.BaseHolder(parent, screen);
  object.component.addClass('ui-full-screen');

  object.component.addClass('image');

  var credentials = $ui.create(object.component);
  credentials.addClass('credentials');
  object.addContainer(credentials);

  Object.defineProperty(object.model, 'backgroundImage', {
    set: function (value) {
      if(object._private.backgroudImage !== value) {
        object._private.backgroudImage = value;
        object.component.style.backgroundImage = "url(" + value + ")";
      }
    }
  })

  return object;
}

$ui.addExtension('FullScreen', FullScreen);

function Group(parent, screen) {
  var object = $ui.BaseHolder(parent, screen);
  object.component.addClass('ui-group');
  object.addContainer(object.component);

  Object.defineProperty(object.model, 'size', {
    set: function () {
      console.log('size');
      console.log(object.component);
      object.component.addClass('half');
    }
  });

  Object.defineProperty(object.model, 'backgroudImage', {
    set: function (value) {
      if(object._private.backgroudImage !== value) {
        object._private.backgroudImage = value;
        object.component.style.background = "url(" + value + ")";
        object.component.addClass('background-image');
      }
    }
  })

  return object;
}

$ui.addExtension('Group', Group);

function Panel(parent, screen) {
  var object = $ui.BaseHolder(parent, screen);
  object.component.addClass('ui-panel');

  var topDock = $ui.create(object.component);
  topDock.addClass('top-dock has-top-dock');
  object.addContainer('topDock', topDock);

  object._private.showTopDockBar = true;
  Object.defineProperty(object.model, "showTopDock", {
    set: function (value) {
      object._private.showTopDockBar = value;
      if(value) {
        topDock.addClass('has-top-dock');
      } else {
        topDock.removeClass('has-top-dock');
      }
    },
    get: function () {
      return object._private.showTopDockBar;
    }
  });

  // Must be named the same as the container to be called.
  Object.defineProperty(object.model, "topDock", {
    set: function (value) {
      if(value !== undefined) {
        topDock.addClass('has-top-dock-content');
      } else {
        topDock.removeClass('has-top-dock-content');
      }
    }
  });

  var body = $ui.create(object.component);
  body.addClass('body');
  object.addContainer(body);

  var bottomDock = $ui.create(object.component);
  bottomDock.addClass('bottom-dock');
  object.addContainer('bottomDock', bottomDock);

  // Must be named the same as the container to be called.
  Object.defineProperty(object.model, "bottomDock", {
    set: function (value) {
      if(value !== undefined) {
        bottomDock.addClass('has-bottom-dock');
      } else {
        bottomDock.removeClass('has-bottom-dock');
      }
    }
  });

  // object._private.showFooterBar = false;
  // Object.defineProperty(object.model, "showFooterBar", {
  //   set: function (value) {
  //     object._private.showFooterBar = value;
  //     if(value) {
  //       object.elements.topDock.addClass('hasFooter');
  //     } else {
  //       object.elements.topDock.removeClass('hasFooter');
  //     }
  //   },
  //   get: function () {
  //     return object._private.showFooterBar;
  //   }
  // });

  return object;
}

$ui.addExtension('Panel', Panel);

function PartitionScreen(parent, screen) {
  var object = $ui.BaseHolder(parent);
  object.component.addClass('ui-partition-screen', screen);

  var leftBar = $ui.create(object.component);
  object.addContainer('leftSide', leftBar);
  leftBar.addClass('left-side');

  var holderContent = $ui.create(object.component);
  holderContent.addClass('holder');

  var mainContent = $ui.create(holderContent);
  object.addContainer('rightSide', mainContent);
  mainContent.addClass('right-side');

  return object;
}
$ui.addExtension('PartitionScreen', PartitionScreen);

function Slider(parent, screen) {
  var object = $ui.BaseHolder(parent, screen);
  object.component.addClass('ui-slider');

  var dec = $ui.UIDecorators(object);
  dec.size(object.component, false);

  var leftArrow = $ui.create('div', object.component);
  leftArrow.addClass('move-left fa fa-chevron-left');

  var items = $ui.create('div', object.component);
  items.addClass('items');
  object.addContainer('items', items);

  var rightArrow = $ui.create('div', object.component);
  rightArrow.addClass('move-right fa fa-chevron-right');

  return object;

}

$ui.addExtension('Slider', Slider);