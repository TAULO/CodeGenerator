(function(mod) {
  if (typeof exports == "object" && typeof module == "object") // CommonJS
    return mod(require("tern/lib/infer"), require("tern/lib/tern"));
  if (typeof define == "function" && define.amd) // AMD
    return define([ "tern/lib/infer", "tern/lib/tern" ], mod);
  mod(tern, tern);
})(function(infer, tern) {
  "use strict";

  tern.registerPlugin("jquery-mobile1.5", function(server, options) {

    return {
      defs : defs
    };
  });
  
  var defs = {
  "!name": "jquery-mobile1.5",
  "!define": {
    "textinputOption": {
      "autogrow": {
        "!type": "bool",
        "!doc": "This option is provided by the autogrow extension.\n\t\t\t\tWhether to update the size of the textarea element upon first appearance, as well as upon a change in the content of the element.\n\t\t\t\tThis option applies only to  widgets based on textarea elements.\n\t\t\t\tThis option is also exposed as a data attribute: data-autogrow=\"false\".\n\t\t\t"
      },
      "keyupTimeoutBuffer": {
        "!type": "number",
        "!doc": "This option is provided by the autogrow extension.\n\t\t\t\tThe amount of time (in milliseconds) to wait between the occurence of a keystroke and the resizing of the textarea element. If another keystroke occurs within this time, the resizing is postponed by another period of time of the same length.\n\t\t\t\tThis option applies only to  widgets based on textarea elements.\n\t\t\t\tThis option is also exposed as a data attribute: data-keyup-timeout-buffer=\"150\".\n\t\t\t"
      },
      "clearBtn": {
        "!type": "bool",
        "!doc": "This option is provided by the clearButton extension.\n\t\t\t\tAdds a clear button to the input when set to true.\n\t\t\t\tThis option applies only to  widgets based on input elements.\n\t\t\t\tThis option is also exposed as a data attribute: data-clear-btn=\"true\".\n\t\t\t"
      },
      "clearBtnText": {
        "!type": "string",
        "!doc": "This option is provided by the clearButton extension.\n\t\t\t\tThe text description for the optional clear button, useful for assistive technologies like screen readers.\n\t\t\t\tThis option applies only to  widgets based on input elements.\n\t\t\t\tThis option is also exposed as a data attribute: data-clear-btn-text=\"Clear value\".\n\t\t\t"
      },
      "corners": {
        "!type": "bool",
        "!doc": "Applies the theme border radius if set to true by adding the class ui-corner-all to the  widget's outermost element.\n\t\t\t\tThis option is also exposed as a data attribute: data-corners=\"false\".\n\t\t\t"
      },
      "preventFocusZoom": {
        "!type": "bool",
        "!doc": "Attempts to prevent the device from focusing in on the input element when the element receives the focus.\n\t\t\t\tThis option is also exposed as a data attribute: data-prevent-focus-zoom=\"true\".\n\t\t\t"
      },
      "wrapperClass": {
        "!type": "string",
        "!doc": "The value of this option is a string containing a space-separated list of classes to be applied to the outermost element of the  widget.\n\t\t\t\tThis option is also exposed as a data attribute: data-wrapper-class=\"true\".\n\t\t\t"
      }
    },
    "footerOption": {
      
    },
    "tableOption": {
      "classes.reflowTable": {
        "!type": "string",
        "!doc": "Class added to the generated label content added to each table cell based on the header name.\n\t\t\t\tNote: The reflow mode has one option, classes, which is only configurable via JavaScript because it expects an object literal value. The classes option has two properties that define the structural classnames that the plugin uses."
      },
      "classes.cellLabels": {
        "!type": "string",
        "!doc": "Class added to the first cell within each grouped header's column. This makes it easy to style these differently to visually delineate the column groups.\n\t\t\t\tNote: The reflow mode has one option, classes, which is only configurable via JavaScript because it expects an object literal value. The classes option has two properties that define the structural classnames that the plugin uses."
      },
      "initSelector": {
        "!type": "+CSS selector string",
        "!doc": "This is used to define the selectors (element types, data roles, etc.) that will automatically be initialized as tables. To change which elements are initialized, bind this option to the mobileinit event:\n\n$( document ).on( \"mobileinit\", function() {\n\t$.mobile.table.prototype.options.initSelector = \".mytable\";\n});\n\n\t\t\t"
      },
      "classes.table": {
        "!type": "string",
        "!doc": "Class assigned to the table.\n\t\t\tThe classes option is only configurable via JavaScript because it expects an object literal value."
      }
    },
    "listviewOption": {
      "autodividers": {
        "!type": "bool",
        "!doc": "This option is provided by the listview.autodividers extension.\n\t\t\t\tWhen set to true, dividers are automatically created for the listview items.\n\t\t\t\tThe function stored in the value of the autodividersSelector option governs the text displayed on the dividers.\n\t\t\t\tThis option is also exposed as a data-attribute: data-autodividers=\"true\".\n\t\t\t"
      },
      "autodividersSelector": {
        "!type": "fn()",
        "!doc": "This option is provided by the listview.autodividers extension.\n\t\t\t\tThe value of this option is a function that returns a string. It receives a jQuery collection object containing an element. It computes the returned string from the element. The function is called for each list item in sequence, and a divider is created whenever the function returns a value for a list item that is different from the value it returned for the previous list item.\n\t\t\t\tThe function may return null for a given list item. In that case, no new divider is created even if the value returned for the previous list item was something other than null.\n\t\t\t\tThe default value of this option is a function that returns the capitalized first letter of the list item text:\n\nfunction defaultAutodividersSelector( elt ) {\n\t// look for the text in the given element\n\tvar text = $.trim( elt.text() ) || null;\n\n\tif ( !text ) {\n\t\treturn null;\n\t}\n\n\t// create the text for the divider (first uppercased letter)\n\ttext = text.slice( 0, 1 ).toUpperCase();\n\n\treturn text;\n}\n\n\t\t\t"
      },
      "countTheme": {
        "!type": "string",
        "!doc": "\n\t\t\t\tThis option is deprecated in 1.4.0 and will be removed in 1.5.0.\n\t\t\t\tSets the color scheme (swatch) for the list item count bubble. It accepts a single letter from a-z that maps to the swatches included in your theme.\n\t\t\t\tPossible values: swatch letter (a-z).\n\t\t\t\tThis option is also exposed as a data attribute: data-count-theme=\"b\".\n\t\t\t"
      },
      "dividerTheme": {
        "!type": "string",
        "!doc": "Sets the color scheme (swatch) for list dividers. It accepts a single letter from a-z that maps to one of the swatches included in your theme.\n\t\t\t\tThis option is also exposed as a data attribute: data-divider-theme=\"b\".\n\t\t\t"
      },
      "filter": {
        "!type": "bool",
        "!doc": "\n\t\t\t\tThis option is deprecated in 1.4.0 and will be removed in 1.5.0. It has become the initSelector for the filterable widget.\n\t\t\t\tAdds a search filter bar to listviews.\n\t\t\t\tThis option is also exposed as a data attribute: data-filter=\"true\".\n\t\t\t"
      },
      "filterCallback": {
        "!type": "fn(event: +Event)",
        "!doc": "\n\t\t\t\tThis option is deprecated in 1.4.0 and will be removed in 1.5.0. It is now implemented in the filterable widget.\n\t\t\t\tThe function to determine which rows to hide when the search filter textbox changes. The function accepts two arguments -- the text of the list item (or data-filtertext value if present), and the search string. Return true to hide the item, false to leave it visible.\n\n$( document ).on( \"mobileinit\", function() {\n\t$.mobile.listview.prototype.options.filterCallback = function( text, searchValue ) {\n\t\t// only show items that *begin* with the search string\n\t\treturn text.toLowerCase().substring( 0, searchValue.length ) !== searchValue;\n\t};\n});\n\n\t\t\t"
      },
      "filterPlaceholder": {
        "!type": "string",
        "!doc": "\n\t\t\t\tThis option is deprecated in 1.4.0 and will be removed in 1.5.0.\n\t\t\t\tThe placeholder text used in search filter bars.\n\t\t\t\tThis option is also exposed as a data attribute: data-filter-placeholder=\"Search...\".\n\t\t\t"
      },
      "filterReveal": {
        "!type": "string",
        "!doc": "\n\t\t\t\tThis option is deprecated in 1.4.0 and will be removed in 1.5.0. It is now implemented in the filterable widget.\n\t\t\t\tWhen true, and the search input string is empty, all items are hidden instead of shown.\n\t\t\t\tThis option is also exposed as a data attribute: data-filter-reveal=\"true\".\n\t\t\t"
      },
      "filterTheme": {
        "!type": "string",
        "!doc": "\n\t\t\t\tThis option is deprecated in 1.4.0 and will be removed in 1.5.0.\n\t\t\t\tSets the color scheme (swatch) for the search filter bar. It accepts a single letter from a-z that maps to one of the swatches included in your theme.\n\t\t\t\tThis option is also exposed as a data attribute: data-filter-theme=\"a\".\n\t\t\t"
      },
      "hideDividers": {
        "!doc": "This option is provided by the listview.hidedividers extension.\n\t\t\t\tWhen set to true and all list items residing under a given divider become hidden, then the divider itself is hidden.\n\t\t\t\tThis option is also exposed as a data-attribute: data-hide-dividers=\"true\".\n\t\t\t"
      },
      "icon": {
        "!type": "string",
        "!doc": "Applies an icon from the icon set to all linked list buttons.\n\t\t\t\tThis option is also exposed as a data attribute: data-icon=\"star\".\n\t\t\t"
      },
      "inset": {
        "!type": "bool",
        "!doc": "Adds inset list styles.\n\t\t\t\tThis option is also exposed as a data attribute: data-inset=\"true\".\n\t\t\t"
      },
      "splitIcon": {
        "!type": "string",
        "!doc": "Applies an icon from the icon set to all split list buttons.\n\t\t\t\tThis option is also exposed as a data attribute: data-split-icon=\"star\".\n\t\t\t"
      },
      "splitTheme": {
        "!type": "string",
        "!doc": "Sets the color scheme (swatch) for split list buttons. It accepts a single letter from a-z that maps to one of the swatches included in your theme.\n\t\t\t\tThis option is also exposed as a data attribute: data-split-theme=\"b\".\n\t\t\t"
      }
    },
    "navbarOption": {
      "iconpos": {
        "!type": "string",
        "!doc": "Positions the icon in the button. Possible values: left, right, top, bottom, none, notext. The notext value will display an icon-only button with no text feedback.\n\n\n<div data-role=\"navbar\" data-iconpos=\"bottom\">\n\n\t\t\t"
      }
    },
    "buttonOption": {
      "corners": {
        "!type": "bool",
        "!doc": "Applies the theme button border-radius if set to true.\n\t\t\t\tThis option is also exposed as a data attribute: data-corners=\"false\".\n\t\t\t"
      },
      "icon": {
        "!type": "string",
        "!doc": "Applies an icon from the icon set.\n\t\t\t\tThe .buttonMarkup() documentation contains a reference of all the icons available in the default theme.\n\t\t\t\tThis option is also exposed as a data attribute: data-icon=\"star\".\n\t\t\t"
      },
      "iconpos": {
        "!type": "string",
        "!doc": "Positions the icon in the . Possible values: left, right, top, bottom, none, notext. The notext value will display an icon-only  with no text feedback.\n\t\t\t\tThis option is also exposed as a data attribute: data-iconpos=\"right\".\n\t\t\t"
      },
      "iconshadow": {
        "!type": "bool",
        "!doc": "\n\t\t\t\tThis option is deprecated in 1.4.0 and will be removed in 1.5.0.\n\t\t\t\tApplies the theme shadow to the 's icon if set to true.\n\t\t\t\tThis option is also exposed as a data attribute: data-iconshadow=\"true\".\n\t\t\t"
      },
      "inline": {
        "!type": "bool",
        "!doc": "If set to true, this will make the  act like an inline  so the width is determined by the 's text. By default, this is null (false) so the  is full width, regardless of the feedback content. Possible values: true, false.\n\t\t\t\tThis option is also exposed as a data attribute: data-inline=\"true\".\n\t\t\t"
      },
      "shadow": {
        "!type": "bool",
        "!doc": "Applies the drop shadow style to the  if set to true.\n\t\t\t\tThis option is also exposed as a data attribute: data-shadow=\"false\".\n\t\t\t"
      },
      "wrapperClass": {
        "!type": "string",
        "!doc": "Allows you to specify CSS classes to be set on the 's wrapper element.\n\t\t\t\tThis option is also exposed as a data attribute: data-wrapper-class=\"custom-class\".\n\t\t\t"
      }
    },
    "checkboxradioOption": {
      "iconpos": {
        "!type": "string",
        "!doc": "Allows you to specify on which side of the checkbox or radio button the checkmark/radio icon will appear.\n\t\t\t\tThis option is also exposed as a data attribute: data-iconpos=\"right\".\n\t\t\t"
      },
      "wrapperClass": {
        "!doc": "It is difficult to write custom CSS for the wrapper div around the native input element generated by the framework. This option allows you to specify one or more space-separated class names to be added to the wrapper div element by the framework.\n\t\t\t\tThis option is also exposed as a data attribute: data-wrapper-class=\"custom-class\".\n\t\t\t"
      }
    },
    "collapsibleOption": {
      "collapseCueText": {
        "!type": "string",
        "!doc": "This text is used to provide audible feedback for users with screen reader software.\n\t\t\t\tIf the value is unset for an individual collapsible container, but that container is part of a collapsible set, then the value is inherited from the parent collapsible set.\n\t\t\t\tThis option is also exposed as a data attribute: data-collapse-cue-text=\" collapse with a click\".\n\t\t\t"
      },
      "collapsed": {
        "!type": "bool",
        "!doc": "When false, the container is initially expanded with a minus icon in the header.\n\t\t\t\tThis option is also exposed as a data attribute: data-collapsed=\"false\".\n\t\t\t"
      },
      "collapsedIcon": {
        "!type": "string|bool",
        "!doc": "Sets the icon for the header of the collapsible container when in a collapsed state.\n\t\t\t\tIf the value is unset for an individual collapsible container, but that container is part of a collapsible set, then the value is inherited from the parent collapsible set.\n\t\t\t\tThis option is also exposed as a data attribute: data-collapsed-icon=\"arrow-r\".\n\t\t\t"
      },
      "corners": {
        "!type": "bool",
        "!doc": "Applies the theme border-radius if set to true.\n\t\t\t\tIf the value is unset for an individual collapsible container, but that container is part of a collapsible set, then the value is inherited from the parent collapsible set.\n\t\t\t\tThis option is also exposed as a data attribute: data-corners=\"false\".\n\t\t\t"
      },
      "expandCueText": {
        "!type": "string",
        "!doc": "This text is used to provide audible feedback for users with screen reader software.\n\t\t\t\tIf the value is unset for an individual collapsible container, but that container is part of a collapsible set, then the value is inherited from the parent collapsible set.\n\t\t\t\tThis option is also exposed as a data attribute: data-expand-cue-text=\" expand with a click\".\n\t\t\t"
      },
      "expandedIcon": {
        "!type": "string",
        "!doc": "Sets the icon for the header of the collapsible container when in an expanded state.\n\t\t\t\tIf the value is unset for an individual collapsible container, but that container is part of a collapsible set, then the value is inherited from the parent collapsible set.\n\t\t\t\tThis option is also exposed as a data attribute: data-expanded-icon=\"arrow-d\".\n\t\t\t"
      },
      "heading": {
        "!type": "string",
        "!doc": "Within the collapsible container, the first immediate child element that matches this selector will be used as the header for the collapsible.\n\t\t\t\tThis option is also exposed as a data attribute: data-heading=\".mycollapsibleheading\".\n\t\t\t"
      },
      "iconpos": {
        "!type": "string",
        "!doc": "Positions the icon in the collapsible header.\n\t\t\t\tIf the value is unset for an individual collapsible container, but that container is part of a collapsible set, then the value is inherited from the parent collapsible set.\n\t\t\t\tPossible values: left, right, top, bottom, none, notext.\n\t\t\t\tThis option is also exposed as a data attribute: data-iconpos=\"right\".\n\t\t\t"
      },
      "inset": {
        "!type": "bool",
        "!doc": "By setting this option to false the element will get a full width appearance without corners.\n\t\t\t\tIf the value is unset for an individual collapsible container, but that container is part of a collapsible set, then the value is inherited from the parent collapsible set.\n\t\t\t\tThis option is also exposed as a data attribute: data-inset=\"false\".\n \t\t\t"
      },
      "mini": {
        "!type": "bool",
        "!doc": "Sets the size of the element to a more compact, mini version.\n\t\t\t\tIf the value is unset for an individual collapsible container, but that container is part of a collapsible set, then the value is inherited from the parent collapsible set.\n\t\t\t\tThis option is also exposed as a data attribute: data-mini=\"true\".\n\t\t\t"
      },
      "theme": {
        "!type": "string",
        "!doc": "Sets the color scheme (swatch) for the collapsible. It accepts a single letter from a-z that maps to the swatches included in your theme.\n\t\t\t\tIf the value is unset for an individual collapsible container, but that container is part of a collapsible set, then the value is inherited from the parent collapsible set.\n\t\t\t\tPossible values: swatch letter (a-z).\n\t\t\t\tThis option is also exposed as a data attribute: data-theme=\"b\".\n\t\t\t"
      }
    },
    "dialogOption": {
      "closeBtn": {
        "!type": "string",
        "!doc": "\n\t\t\t\tSets the position of the dialog close button in the header (left or right) or prevents the framework from adding a close button (none).\n\t\t\t\tThis option is also exposed as a data attribute: data-close-btn.\n\t\t\t"
      },
      "closeBtnText": {
        "!type": "string",
        "!doc": "\n\t\t\t\tCustomizes the text of the close button which is helpful for translating this into different languages. The close button is displayed as an icon-only button by default so the text isn't visible on-screen, but is read by screen readers so this is an important accessibility feature.\n\t\t\t\tThis option is also exposed as a data attribute: data-close-btn-text=\"Fermer\".\n\t\t\t"
      },
      "corners": {
        "!type": "bool",
        "!doc": "Sets whether to draw the dialo with rounded corners..\n\t\t\t\tThis option is also exposed as a data attribute:data-corners=\"false\".\n\t\t\t"
      },
      "overlayTheme": {
        "!type": "string",
        "!doc": "\n\t\t\t\tDialogs appear to be floating above an overlay layer. This overlay adopts the swatch A content color by default, but the data-overlay-theme attribute can be added to the page wrapper to set the overlay to any swatch letter.\n\t\t\t\t Possible values: swatch letter (a-z)\n\t\t\t\tThis option is also exposed as a data attribute: data-overlay-theme=\"b\".\n\t\t\t"
      }
    },
    "sliderOption": {
      "highlight": {
        "!type": "bool",
        "!doc": "Sets an active state fill on the track from the left edge to the slider handle when set to \"true\".\n\n\t\t\t"
      },
      "trackTheme": {
        "!type": "string",
        "!doc": "Sets the color scheme (swatch) for the slider's track, specifically. It accepts a single letter from a-z that maps to the swatches included in your theme.\n\n\t\t\t\tPossible values: swatch letter (a-z).\n\t\t\t\tThis option can be overridden in the markup by assigning a data attribute to the input, e.g. data-track-theme=\"a\".\n\t\t\t"
      }
    },
    "panelOption": {
      "animate": {
        "!type": "bool",
        "!doc": "Sets whether the panel will animate when opening and closing. If set to false, the panel will just appear and disappear without animation. This is recommended for fastest performance.\n\t\t\t\tThis option is also exposed as a data attribute:data-animate=\"false\" on the panel container.\n\t\t\t"
      },
      "classes.animate": {
        "!type": "string",
        "!doc": "Class added to the panel, page contents wrapper and fixed toolbars when option animate is true and the 3D transform feature test returns true."
      },
      "classes.contentFixedToolbar": {
        "!type": "string",
        "!doc": "\n\t\t\t\tNote: This class is no longer used as of 1.4.0, so setting this option will have no effect on the panel.\n\t\t\t\tClass added to the page container to suppress scrolling horizontally\n\t\t\t"
      },
      "classes.contentFixedToolbarClosed": {
        "!type": "string",
        "!doc": "\n\t\t\t\tNote: This class is no longer used as of 1.4.0, so setting this option will have no effect on the panel.\n\t\t\t\tClass added to fixed toolbars after the close animation is complete.\n\t\t\t"
      },
      "classes.contentFixedToolbarOpen": {
        "!type": "string",
        "!doc": "\n\t\t\t\tNote: This class is no longer used as of 1.4.0, so setting this option will have no effect on the panel.\n\t\t\t\tClass added to fixed toolbars when the panel is opening.\n\t\t\t"
      },
      "classes.contentWrap": {
        "!type": "string",
        "!doc": "\n\t\t\t\tNote: This class is no longer used as of 1.4.0, so setting this option will have no effect on the panel.\n\t\t\t\tClass added to the wrapper injected around the page contents (header, content, footer), needed for positioning of the panel.\n\t\t\t"
      },
      "classes.contentWrapClosed": {
        "!type": "string",
        "!doc": "\n\t\t\t\tNote: This class is no longer used as of 1.4.0, so setting this option will have no effect on the panel.\n\t\t\t\tClass added to the page contents wrapper after the close animation is complete.\n\t\t\t"
      },
      "classes.contentWrapOpen": {
        "!type": "string",
        "!doc": "\n\t\t\t\tNote: This class is no longer used as of 1.4.0, so setting this option will have no effect on the panel.\n\t\t\t\tClass added to the wrapper injected around the page contents (header, content, footer) when the panel is opening. Used for targeting hardware acceleration only during transitions.\n\t\t\t"
      },
      "classes.modal": {
        "!type": "string",
        "!doc": "Class added to the overlay on the page to dismiss the panel when hidden."
      },
      "classes.modalOpen": {
        "!type": "string",
        "!doc": "Class added to the invisible overlay over the page when the panel is open. Used to dismiss the panel."
      },
      "classes.pageContainer": {
        
      },
      "classes.pageContentPrefix": {
        "!doc": "Used for wrapper and fixed toolbars position, display and open classes."
      },
      "classes.pageFixedToolbar": {
        
      },
      "classes.pagePanel": {
        "!type": "string",
        "!doc": "\n\t\t\t\tNote: This class is no longer used as of 1.4.0, so setting this option will have no effect on the panel.\n\t\t\t\tClass added to the page container when a panel widget is present.\n\t\t\t"
      },
      "classes.pagePanelOpen": {
        "!type": "string",
        "!doc": "\n\t\t\t\tNote: This class is no longer used as of 1.4.0, so setting this option will have no effect on the panel.\n\t\t\t\tClass added to the page when a panel is open.\n\t\t\t"
      },
      "classes.panel": {
        "!type": "string",
        "!doc": "Class added to the panel."
      },
      "classes.panelClosed": {
        "!type": "string",
        "!doc": "Class added to the panel when closed."
      },
      "classes.panelFixed": {
        "!type": "string",
        "!doc": "Class added to the panel when fixed positioning is applied."
      },
      "classes.panelInner": {
        "!type": "string",
        "!doc": "Class added to the panel contents wrapper div."
      },
      "classes.panelOpen": {
        "!type": "string",
        "!doc": "Class added to the panel when opening. Used for targeting hardware acceleration only during transitions."
      },
      "dismissible": {
        "!type": "bool",
        "!doc": "Sets whether the panel can be closed by clicking outside onto the page.\n\t\t\t\tThis option is also exposed as a data attribute:data-dismissible=\"false\" on the link that opens the panel.\n\t\t\t"
      },
      "display": {
        "!type": "string",
        "!doc": "The relationship of the panel to the page contents. This option accepts one of three values:\n\t\t\t\t\n\t\t\t\t\t\"reveal\"Push the page over\n\t\t\t\t\t\"push\"Re-flow the content to fit the panel content as a column\n\t\t\t\t\t\"overlay\"Sit over the content\n\t\t\t\t\n\t\t\t\tThis option is also exposed as a data attribute:data-display=\"push\" on the link that opens the panel.\n\t\t\t"
      },
      "position": {
        "!type": "string",
        "!doc": "The side of the screen the panel appears on. Values can be \"left\" or \"right\".\n\t\t\t\tThis option is also exposed as a data attribute:data-position=\"right\" on the link that opens the panel.\n\t\t\t"
      },
      "positionFixed": {
        "!type": "bool",
        "!doc": "Sets whether the panel has fixed positioning so the contents are in view even if the page is scrolled down. This also allows the page to scroll while the panel stays fixed. We recommend not to enable this feature when panels are used withing Android apps because of poor performance and display issues.\n\t\t\t\tThis option is also exposed as a data attribute:data-position-fixed=true on the panel.\n\t\t\t"
      },
      "swipeClose": {
        "!type": "bool",
        "!doc": "Sets whether the panel can be closed by swiping left or right over the panel.\n\t\t\t\tThis option is also exposed as a data attribute:data-swipe-close=false on the panel.\n\t\t\t"
      },
      "theme": {
        "!type": "string",
        "!doc": "\n\t\t\t\tSets the color scheme (swatch) for the  widget. It accepts a single letter from a-z that maps to the swatches included in your theme.\n\t\t\t\tPossible values: swatch letter (a-z).\n\t\t\t\tThis option is also exposed as a data attribute: data-theme=\"b\".\n\t\t\t"
      }
    },
    "rangesliderOption": {
      "highlight": {
        "!type": "bool",
        "!doc": "Sets an active state fill on the track between the two rangeslider handles when set to \"true\".\n\t\t\t\tThis option is also exposed as a data attribute: data-highlight=\"false\".\n\t\t\t"
      },
      "trackTheme": {
        "!type": "string",
        "!doc": "Sets the color scheme (swatch) for the slider's track, specifically. It accepts a single letter from a-z that maps to the swatches included in your theme.\n\t\t\t\tPossible values: swatch letter (a-z).\n\t\t\t\tThis option can be overridden in the markup by assigning a data attribute to the input, e.g. data-track-theme=\"a\".\n\t\t\t"
      }
    },
    "pageOption": {
      "closeBtn": {
        "!type": "string",
        "!doc": "This option is provided by the dialog extension.\n\t\t\t\tSets the position of the dialog close button in the header.\n\t\t\t\tPossible values:\n\t\t\t\t\t\n\t\t\t\t\t\t\"left\"\n\t\t\t\t\t\tThe button will be placed on the left edge of the titlebar.\n\t\t\t\t\t\t\"right\"\n\t\t\t\t\t\tThe button will be placed on the right edge of the titlebar.\n\t\t\t\t\t\t\"none\"\n\t\t\t\t\t\tThe dialog will not have a close button.\n\t\t\t\t\t\n\t\t\t\t\n\t\t\t\tThis option is also exposed as a data attribute: data-close-btn.\n\t\t\t"
      },
      "closeBtnText": {
        "!type": "string",
        "!doc": "This option is provided by the dialog extension.\n\t\t\t\tCustomizes the text of the close button which is helpful for translating this into different languages. The close button is displayed as an icon-only button by default so the text isn't visible on-screen, but is read by screen readers so this is an important accessibility feature.\n\t\t\t\tThis option is also exposed as a data attribute: data-close-btn-text=\"Fermer\".\n\t\t\t"
      },
      "contentTheme": {
        "!type": "string",
        "!doc": "\n\t\t\t\tThis option is deprecated in 1.4.0 and will be removed in 1.5.0.\n\t\t\t\tSets the color scheme (swatch) for the content div of the  widget. It accepts a single letter from a-z that maps to the swatches included in your theme.\n\t\t\t\tPossible values: swatch letter (a-z).\n\t\t\t\tThis option is also exposed as a data attribute: data-content-theme=\"b\".\n\t\t\t"
      },
      "corners": {
        "!type": "bool",
        "!doc": "This option is provided by the dialog extension.\n\t\t\t\tSets whether to draw the dialog with rounded corners.\n\t\t\t\tThis option is also exposed as a data attribute: data-corners=\"false\".\n\t\t\t"
      },
      "degradeInputs": {
        "!doc": "\n\t\t\t\tThis option is deprecated as of jQuery Mobile 1.4.0 and will be removed in 1.5.0. Use $.mobile.degradeInputs instead.\n\t\t\t"
      },
      "dialog": {
        "!type": "bool",
        "!doc": "This option is provided by the dialog extension.\n\t\t\t\tSets whether the page should be styled like a dialog.\n\t\t\t\tThis option is also exposed as a data attribute: data-dialog=\"true\".\n\t\t\t"
      },
      "domCache": {
        "!type": "bool",
        "!doc": "\n\t\t\t\tSets whether to keep the page in the DOM after the user has navigated away from it.\n\t\t\t\tThis option is also exposed as a data attribute: data-dom-cache=\"true\".\n\t\t\t"
      },
      "keepNative": {
        "!type": "+Selector",
        "!doc": "\n\t\t\t\tThis option is deprecated as of jQuery Mobile 1.4.0 and will be removed in 1.5.0. Use $.mobile.keepNative instead.\n\t\t\t\tThe value of this option is a selector that will be used in addition to the keepNativeDefault option to prevent elements matching it from being enhanced.\n\t\t\t\tThis option is also exposed as a data attribute: data-keep-native=\".do-not-enhance.\n\t\t\t"
      },
      "keepNativeDefault": {
        "!type": "+Selector",
        "!doc": "\n\t\t\t\tThis option is deprecated as of jQuery Mobile 1.4.0 and will be removed in 1.5.0. Use $.mobile.keepNative instead.\n\t\t\t\tThe value of this option is a selector that will be used to prevent elements matching it from being enhanced.\n\t\t\t\tThis option is also exposed as a data attribute: data-keep-native-default=\".do-not-enhance.\n\t\t\t"
      },
      "overlayTheme": {
        "!type": "string",
        "!doc": "This option is provided by the dialog extension.\n\t\t\t\tDialogs appear to be floating above an overlay layer. This overlay adopts the swatch \"a\" content color by default, but the data-overlay-theme attribute can be added to the element to set the overlay to any swatch letter.\n\t\t\t\t Possible values: swatch letter (a-z)\n\t\t\t\tThis option is also exposed as a data attribute: data-overlay-theme=\"b\".\n\t\t\t"
      },
      "theme": {
        "!type": "string",
        "!doc": "\n\t\t\t\tSets the color scheme (swatch) for the  widget. It accepts a single letter from a-z that maps to the swatches included in your theme.\n\t\t\t\tPossible values: swatch letter (a-z).\n\t\t\t\tThis option is also exposed as a data attribute: data-theme=\"b\".\n\t\t\t"
      }
    },
    "collapsiblesetOption": {
      "collapsedIcon": {
        "!type": "string",
        "!doc": "Sets the icon for the headers of the collapsible containers when in a collapsed state.\n\t\t\t\tThis option is also exposed as a data attribute: data-collapsed-icon=\"arrow-r\".\n\t\t\t"
      },
      "corners": {
        "!type": "bool",
        "!doc": "Applies the theme border-radius to the first and last collapsible if set to true.\n\t\t\t\tThis option is also exposed as a data attribute:data-corners=\"false\".\n\t\t\t"
      },
      "expandedIcon": {
        "!type": "string",
        "!doc": "Sets the icon for the header of the collapsible container when in an expanded state.\n\t\t\t\tThis option is also exposed as a data attribute: data-expanded-icon=\"arrow-d\".\n\t\t\t"
      },
      "iconpos": {
        "!type": "string",
        "!doc": "Positions the icon in the collapsible headers.\n\t\t\t\tPossible values: left, right, top, bottom, none, notext.\n\t\t\t\tThis option is also exposed as a data attribute: data-iconpos=\"right\".\n\t\t\t"
      },
      "initSelector": {
        "!type": "string",
        "!doc": "\n\t\t\t\tThe default initSelector for the  widget is:\n\t\t\n\t\t\"\"\n\t\t\n\t\t\t\tThis option is deprecated in 1.4.0 and will be removed in 1.5.0.\n\t\t\t\tThe old value of the  widget's initSelector option (\":jqmData(role='collapsible-set')\") is deprecated. As of jQuery Mobile 1.5.0, only widgets that have the attribute data-role=\"collapsibleset\" will be enhanced as  widgets.\n\t\t\t\tAs of jQuery Mobile 1.4.0, the initSelector is no longer a widget option. Instead, it is declared directly on the widget prototype. Thus, you may specify a custom value by handling the mobileinit event and overwriting the initSelector on the prototype:\n\t\t\n\t\t$( document ).on( \"mobileinit\", function() {\n\t\t\t$.mobile..prototype.initSelector = \"div.custom\";\n\t\t});\n\t\t\n\t\t\t\tNote: Remember to attach the mobileinit handler after you have loaded jQuery, but before you load jQuery Mobile, because the event is triggered as part of jQuery Mobile's loading process.\n\t\t\t\tThe value of this option is a jQuery selector string. The framework selects elements based on the value of this option and instantiates  widgets on each of the resulting list of elements.\n\t\t\t"
      },
      "inset": {
        "!type": "bool",
        "!doc": "By setting this option to false the collapsibles will get a full width appearance without corners. If the value is false for an individual collapsible container, but that container is part of a  widget, then the value is inherited from the parent  widget.\n\t\t\t\tThis option is also exposed as a data attribute: data-inset=\"true\".\n\t\t\t"
      },
      "mini": {
        "!type": "bool",
        "!doc": "Sets the size of the element to a more compact, mini version. If the value is false for an individual collapsible container, but that container is part of a  widget, then the value is inherited from the parent  widget.\n\t\t\t\tThis option is also exposed as a data attribute: data-mini=\"false\".\n\t\t\t"
      }
    },
    "flipswitchOption": {
      "corners": {
        "!type": "bool",
        "!doc": "Applies the theme button border-radius if set to true.\n\t\t\t\tThis option is also exposed as a data attribute: data-corners=\"false\".\n\t\t\t"
      },
      "offText": {
        "!type": "string",
        "!doc": "\n\t\t\t\tWhen the  widget is based on a checkbox rather than a select the value of this option is used as the label for the \"Off\" state.\n\t\t\t\tThis option is also exposed as a data attribute: data-off-text=\"Go\"\n\t\t\t"
      },
      "onText": {
        "!type": "string",
        "!doc": "\n\t\t\t\tWhen the  widget is based on a checkbox rather than a select the value of this option is used as the label for the \"On\" state.\n\t\t\t\tThis option is also exposed as a data attribute: data-on-text=\"Go\"\n\t\t\t"
      },
      "wrapperClass": {
        "!doc": "It is difficult to write custom CSS for the wrapper div around the native input element generated by the framework. This option allows you to specify one or more space-separated class names to be added to the wrapper div element by the framework.\n\t\t\t\tThis option is also exposed as a data attribute: data-wrapper-class=\"custom-class\".\n\t\t\t"
      }
    },
    "controlgroupOption": {
      "corners": {
        "!type": "bool",
        "!doc": "\n\t\t\t\tSets whether to draw the controlgroup with rounded corners.\n\t\t\t\tThis option is also exposed as a data attribute: data-corners=\"false\".\n\t\t\t"
      },
      "excludeInvisible": {
        "!type": "bool",
        "!doc": "\n\t\t\t\tSets whether to exclude invisible children in the assignment of rounded corners.\n\t\t\t\tWhen set to false, all children of a controlgroup are taken into account when assigning rounded corners, including hidden children. Thus, if, for example, the controlgroup's first child is hidden, the controlgroup will, in effect, not have rounded corners on the top edge.\n\t\t\t\tThis option is also exposed as a data attribute: data-exclude-invisible=\"false\".\n\t\t\t"
      },
      "shadow": {
        "!type": "bool",
        "!doc": "\n\t\t\t\tSets whether a drop shadow is drawn around the controlgroup.\n\t\t\t\tThis option is also exposed as a data attribute: data-shadow=\"false\".\n\t\t\t"
      },
      "theme": {
        "!type": "string",
        "!doc": "Sets the color scheme (swatch) for the controlgroup. It accepts a single letter from a-z that maps to the swatches included in your theme.\n\t\t\t\tPossible values: swatch letter (a-z).\n\t\t\t\tThis option is also exposed as a data attribute: data-theme=\"b\".\n\t\t\t"
      },
      "type": {
        "!type": "string",
        "!doc": "\n\t\t\t\tSets whether children should be stacked on top of each other or next to each other. If set to \"horizontal\", the children of the controlgroup will be stacked next to each other.\n\t\t\t\tThis option is also exposed as a data attribute: data-type=\"horizontal\".\n\t\t\t"
      }
    },
    "popupOption": {
      "arrow": {
        "!type": "string|bool",
        "!doc": "Sets whether to draw the popup with an arrow.\n\t\t\t\tThis option is provided by the widgets/popup.arrow extension.\n\t\t\t\tThis option is also exposed as a data attribute: data-arrow=\"t,b\".\n\t\t\t\tThe following values are valid: true, false, or a string containing a comma-separated list of the letters \"l\", \"t\", \"r\", and \"b\". The list may be empty, in which case it corresponds to a value of false. The value true corresponds to the list \"l,t,r,b\". This list indicates along which edges the code should attempt to place the arrow. The code tries to place the arrow along each edge given in the list in the left-to-right order given in the list until one such placement would result in the arrow pointing exactly at the desired coordinates. If no arrows can be displayed the popup is positioned as though the value of this option were false.\n\t\t\t"
      },
      "corners": {
        "!type": "bool",
        "!doc": "\n\t\t\t\tSets whether to draw the popup with rounded corners.\n\t\t\t\tThis option is also exposed as a data attribute: data-corners=\"false\".\n\t\t\t"
      },
      "dismissible": {
        "!type": "bool",
        "!doc": "\n\t\t\t\tSets whether clicking outside the popup or pressing Escape while the popup is open will close the popup.\n\t\t\t\tNote: When history support is turned on, pressing the browser's \"Back\" button will dismiss the popup even if this option is set to false.\n\t\t\t\tThis option is also exposed as a data attribute: data-dismissible=\"false\".\n\t\t\t"
      },
      "history": {
        "!type": "bool",
        "!doc": "\n\t\t\t\tSets whether to alter the url when a popup is open to support the back button.\n\t\t\t\tThis option is also exposed as a data attribute: data-history=\"false\".\n\t\t\t"
      },
      "overlayTheme": {
        "!type": "string",
        "!doc": "\n\t\t\t\tSets the color scheme (swatch) for the popup background, which covers the entire window. If not explicitly set, the background will be transparent.\n\t\t\t\tThis option is also exposed as a data attribute: data-overlay-theme=\"b\".\n\t\t\t"
      },
      "positionTo": {
        "!type": "string",
        "!doc": "\n\t\t\t\tSets the element relative to which the popup will be centered. It has the following values:\n\t\t\t\t\n\t\t\t\t\t\t\"origin\"\n\t\t\t\t\t\t\tWhen the popup opens, center over the coordinates passed to the open() call (see details on this method).\n\t\t\t\t\t\t\n\t\t\t\t\t\t\"window\"\n\t\t\t\t\t\t\tWhen the popup opens, center in the window.\n\t\t\t\t\t\t\n\t\t\t\t\t\tjQuery selector\n\t\t\t\t\t\t\tWhen the popup opens, create a jQuery object based on the selector, and center over it. The selector is filtered for elements that are visible with \":visible\". If the result is empty, the popup will be centered in the window.\n\t\t\t\t\t\t\n\t\t\t\t\t\n\t\t\t\t\n\t\t\t\tThis option is also exposed as a data attribute: data-position-to=\"window\".\n\t\t\t"
      },
      "shadow": {
        "!type": "bool",
        "!doc": "\n\t\t\t\tSets whether to draw a shadow around the popup.\n\t\t\t\tThis option is also exposed as a data attribute: data-shadow=\"false\".\n\t\t\t"
      },
      "theme": {
        "!type": "string",
        "!doc": "Sets the color scheme (swatch) for the popup contents. Unless explicitly set to 'none', the theme for the popup will be assigned the first time the popup is shown by inheriting the page theme or, failing that, by the hard-coded value 'a'. If you set it to 'none', the popup will not have any theme at all, and will be transparent.\n\t\t\t\tPossible values: swatch letter (a-z), or \"none\".\n\t\t\t\tThis option is also exposed as a data attribute: data-theme=\"b\".\n\t\t\t"
      },
      "tolerance": {
        "!type": "string",
        "!doc": "\n\t\t\t\tSets the minimum distance from the edge of the window for the corresponding edge of the popup. By default, the values above will be used for the distance from the top, right, bottom, and left edge of the window, respectively.\n\t\t\t\tYou can specify a value for this option in one of four ways:\n\t\t\t\t\t\n\t\t\t\t\t\tEmpty string, null, or some other falsy value. This will cause the popup to revert to the above default values.\n\t\t\t\t\t\tA single number. This number will be used for all four edge tolerances.\n\t\t\t\t\t\tTwo numbers separated by a comma. The first number will be used for tolerances from the top and bottom edge of the window, and the second number will be used for tolerances from the left and right edge of the window.\n\t\t\t\t\t\tFour comma-separated numbers. The first will be used for tolerance from the top edge, the second for tolerance from the right edge, the third for tolerance from the bottom edge, and the fourth for tolerance from the left edge.\n\t\t\t\t\t\n\t\t\t\t\n\t\t\t"
      },
      "transition": {
        "!type": "string",
        "!doc": "\n\t\t\t\tSets the default transition for the popup. The default value will result in no transition.\n\t\t\t\tIf the popup is opened from a link, and the link has the data-transition attribute set, the value specified therein will override the value of this option at the time the popup is opened from the link.\n\t\t\t"
      }
    },
    "fixedtoolbarOption": {
      
    },
    "loaderOption": {
      "html": {
        "!type": "string",
        "!doc": "If this is set to a non empty string value, it will be used to replace the entirety of the loader's inner html."
      },
      "text": {
        "!type": "string",
        "!doc": "Sets the text of the message."
      },
      "textonly": {
        "!type": "bool",
        "!doc": "If true, the \"spinner\" image will be hidden when the message is shown."
      },
      "textVisible": {
        "!type": "bool",
        "!doc": "If true, the text value will be used under the spinner."
      }
    },
    "filterableOption": {
      "children": {
        "!type": "string",
        "!doc": "Provides the list of children which will be processed during filtering. If no children result from examination of the value of this option, then the children of the element from which this  widget is constructed will be used.\n\t\t\t\tThis option is also exposed as a data attribute: data-children=\".my-children\".\n\t\t\t"
      },
      "filterCallback": {
        "!type": "fn(index: number)",
        "!doc": "\n\t\t\t\tA function that will be called to determine whether an element in the list of children is considered to be filtered. It must return true if the element is to be filtered, and it must return false if the element is to be shown. The function is called once for each of the DOM elements and its context is set to the DOM element for which a decision is needed. Thus, the keyword this refers to the DOM element for which it must be decided whether it should be shown.\n\t\t\tThe default value of this attribute is a function that will examine each child for the presence of the data-filtertext attribute. If such an attribute is found, the function returns true if the string contained in the function's searchValue parameter cannot be found inside the value of the data-filtertext attribute. If no such attribute is found, the text content of the child is searched for the presence of the value of the function's searchValue parameter, and the function returns true if the search fails.\n\t\t\tFor backwards compatibility with the jQuery Mobile 1.3 listview filter extension, the function provided as the default value of this attribute will never hide listview dividers, however, this behavior is deprecated as of jQuery Mobile 1.4.0 and will be removed in jQuery Mobile 1.5.0.\n\t\t\tYou can provide a custom callback if you need to process the children in special ways.\n\t\t\t"
      },
      "filterPlaceholder": {
        "!type": "string",
        "!doc": "\n\t\t\t\tThis option is deprecated in 1.4.0 and will be removed in 1.5.0.\n\t\t\t\tA string that will be used as the value of the placeholder attribute for the generated text input.\n\t\t\t\tThis option is also exposed as a data attribute: data-filter-placeholder=\"Refine options...\".\n\t\t\t"
      },
      "filterReveal": {
        "!type": "bool",
        "!doc": "When set to true all children are hidden whenever the search string is empty.\n\t\t\t\tThis option is also exposed as a data attribute: data-filter-reveal=\"true\".\n\t\t\t"
      },
      "filterTheme": {
        "!type": "string",
        "!doc": "\n\t\t\t\tThis option is deprecated in 1.4.0 and will be removed in 1.5.0.\n\t\t\t\tSets the color scheme (swatch) for the generated text input. It accepts a single letter from a-z that maps to the swatches included in your theme.\n\t\t\t\tPossible values: swatch letter (a-z).\n\t\t\t\tIf a collapsibleset, selectmenu, controlgroup, or listview widget is instantiated on the element and its options are being synchronized with the options of the generated text input, then the value of this option, if set, takes precedence overe the value of the theme option retrieved from the the widget.\n\t\t\t\tThis option is also exposed as a data attribute: data-filter-theme=\"b\".\n\t\t\t"
      },
      "input": {
        "!type": "string|+jQuery|+Element",
        "!doc": "Provides the element that will serve as the input source for search strings.\n\t\t\t\tThis option is also exposed as a data attribute: data-input=\"#input-for-filterable\".\n\t\t\t"
      }
    },
    "headerOption": {
      
    },
    "selectmenuOption": {
      "closeText": {
        "!doc": "\n\t\t\t\tCustomizes the text of the close button which is helpful for translating this into different languages. The close button is displayed as an icon-only button by default so the text isn't visible on-screen, but is read by screen readers so this is an important accessibility feature.\n\t\t\t\tThis option is also exposed as a data attribute: data-close-text=\"Fermer\".\n\t\t\t"
      },
      "corners": {
        "!type": "bool",
        "!doc": "Applies the theme button border-radius to the select button if set to true.\n\t\t\tThis option is also exposed as a data attribute: data-corners=\"false\".\n\t\t\t"
      },
      "dividerTheme": {
        "!type": "string",
        "!doc": "\n\t\t\t\tSets the color scheme (swatch) for the listview dividers that represent the optgroup headers. It accepts a single letter from a-z that maps to the swatches included in your theme.\n\t\t\t\tPossible values: swatch letter (a-z).\n\t\t\t\tThis option is also exposed as a data attribute: data-divider-theme=\"b\".\n\t\t\t"
      },
      "hidePlaceholderMenuItems": {
        "!type": "bool",
        "!doc": "\n\t\t\t\tSets whether placeholder menu items are hidden. When true, the menu item used as the placeholder for the select menu widget will not appear in the list of choices.\n\t\t\t\tThis option is also exposed as a data attribute: data-hide-placeholder-menu-items=\"false\".\n\t\t\t"
      },
      "icon": {
        "!type": "string",
        "!doc": "Replaces the default icon \"carat-d\" with an icon from the icon set. Setting this attribute to \"false\" suppresses the icon.\n\t\t\t\tTo suppress the icon, a boolean expression must be used:\n\t\t\t\tThis option is also exposed as a data attribute: data-icon=\"star\".\n\t\t\t"
      },
      "iconpos": {
        "!type": "string",
        "!doc": "Position of the icon in the select button. Possible values: left, right, top, bottom, notext. The notext value will display the select as an icon-only button with no text feedback.\n\t\t\t\tThis option is also exposed as a data attribute: data-iconpos=\"left\".\n\t\t\t"
      },
      "iconshadow": {
        "!type": "bool",
        "!doc": "\n\t\t\t\tThis option is deprecated in 1.4.0 and will be removed in 1.5.0.\n\t\t\t\tApplies the theme shadow to the select button's icon if set to true.\n\t\t\t\tThis option is also exposed as a data attribute: data-iconshadow=\"false\".\n\t\t\t"
      },
      "inline": {
        "!type": "bool",
        "!doc": "If set to true, this will make the select button act like an inline button so the width is determined by the button's text. By default, this is null (false) so the select button is full width, regardless of the feedback content. Possible values: true, false.\n\t\t\t\tThis option is also exposed as a data attribute: data-inline=\"true\".\n\t\t\t"
      },
      "nativeMenu": {
        "!type": "bool",
        "!doc": "When set to true, clicking the custom-styled select menu will open the native select menu which is best for performance. If set to false, the custom select menu style will be used instead of the native menu.\n\t\t\t\tThis option is also exposed as a data attribute: data-native-menu=\"false\".\n\t\t\t"
      },
      "preventFocusZoom": {
        "!type": "bool",
        "!doc": "This option disables page zoom temporarily when a custom select is focused, which prevents iOS devices from zooming the page into the select. By default, iOS often zooms into form controls, and the behavior is often unnecessary and intrusive in mobile-optimized layouts.\n\t\t\t\tThis option is also exposed as a data attribute: data-prevent-focus-zoom=\"true\".\n\t\t\t"
      },
      "shadow": {
        "!type": "bool",
        "!doc": "Applies the drop shadow style to the select button if set to true.\n\t\t\t\tThis option is also exposed as a data attribute: data-shadow=\"false\".\n\t\t\t"
      },
      "overlayTheme": {
        "!type": "string",
        "!doc": "Sets the color of the overlay layer for the dialog-based custom select menus and the outer border of the smaller custom menus. It accepts a single letter from a-z that maps to the swatches included in your theme. By default, the content block colors for the overlay will be inherited from the parent of the select.\n\t\t\t\tThis option is also exposed as a data attribute: data-overlay-theme=\"a\".\n\t\t\t"
      }
    },
    "toolbarOption": {
      "addBackBtn": {
        "!type": "bool",
        "!doc": "Whether to automatically add a button to the header that will take the user to the previous page.\n\t\t\t\tThis option only affects header  widgets.\n\t\t\t\tThis option is also exposed as a data attribute: data-add-back-btn=\"true\".\n\t\t\t"
      },
      "backBtnText": {
        "!type": "string",
        "!doc": "The text to be shown on the back button.\n\t\t\t\tThis option only affects header  widgets.\n\t\t\t\tThis option is also exposed as a data attribute: data-back-btn-text=\"Previous\".\n\t\t\t"
      },
      "backBtnTheme": {
        "!type": "string",
        "!doc": "Sets the color theme swatch for the back button. It accepts a single letter from a-z that maps to the swatches included in your theme.\n\t\t\t\tPossible values: swatch letter (a-z).\n\t\t\t\tThis option is also exposed as a data attribute: data-back-btn-theme=\"b\".\n\t\t\t"
      },
      "disablePageZoom": {
        "!type": "bool",
        "!doc": "This option is provided by the fixedToolbar extension.\n\t\t\tSets whether to disable page zoom whenever the page containing the fixed  is shown.\n\t\t\t\tThis option is also exposed as a data attribute: data-disable-page-zoom=\"false\".\n\t\t\t"
      },
      "fullscreen": {
        "!type": "bool",
        "!doc": "This option is provided by the fixedToolbar extension.\n\t\t\t\tSets whether the toolbar should be hidden entirely when the page is tapped.\n\t\t\t\tThis option is also exposed as a data attribute: data-fullscreen=\"true\".\n\t\t\t"
      },
      "hideDuringFocus": {
        "!type": "string",
        "!doc": "This option is provided by the fixedToolbar extension.\n\t\t\t\tThe value of this option is a CSS selector for those elements that, when focused, should cause the fixed  to be hidden and conversely, to be shown upon loss of focus.\n\t\t\t\tThis option is also exposed as a data attribute: data-hide-during-focus=\"button\".\n\t\t\t"
      },
      "position": {
        "!type": "string",
        "!doc": "This option is provided by the fixedToolbar extension.\n\t\t\t\tCauses the toolbar to float above the content via CSS position: fixed when set to \"fixed\".\n\t\t\t\tThis option is also exposed as a data attribute: data-position=\"fixed\".\n\t\t\t"
      },
      "supportBlacklist": {
        "!type": "fn(tbPage: +jQuery)",
        "!doc": "This option is provided by the fixedToolbar extension.\n\t\t\tThe value of this option is a function that will return true on platforms where  widgets should not be displayed as fixed.\n\t\t\tThe default value of this option is a function that returns true whenever the value of $.support.fixedPosition is false.\n\t\t\t"
      },
      "tapToggle": {
        "!type": "bool",
        "!doc": "This option is provided by the fixedToolbar extension.\n\t\t\t\tSets whether the fixed toolbar's visibility can be toggled by tapping on the page.\n\t\t\t\tThis option is also exposed as a data attribute: data-tap-toggle=\"false\".\n\t\t\t"
      },
      "tapToggleBlacklist": {
        "!type": "string",
        "!doc": "This option is provided by the fixedToolbar extension.\n\t\t\t\tWhen the user taps on the page and the tapToggle option is set on the fixed  widget, the element on which the user has tapped is examined before the visibility of the  is toggled. If the element on which the user has tapped matches the selector provided as the value of this option, then the  is not toggled.\n\t\t\t\tThis option is also exposed as a data attribute: data-tap-toggle-blacklist=\".do-not-toggle-fixed-toolbar\".\n\t\t\t"
      },
      "trackPersistentToolbars": {
        "!type": "bool",
        "!doc": "This option is provided by the fixedToolbar extension.\n\t\t\t\tWhether to persist the  across pages.\n\t\t\t\tThis option is also exposed as a data attribute: data-track-persistent-toolbars=\"false\".\n\t\t\t"
      },
      "transition": {
        "!type": "string",
        "!doc": "This option is provided by the fixedToolbar extension.\n\t\t\t\tThe transition to apply when showing/hiding the fixed .\n\t\t\t\tThe following values are recognized:\n\t\t\t\t\t\n\t\t\t\t\t\t\"none\"The fixed  appears and disappears abruptly, without any transition.\n\t\t\t\t\t\t\"slide\"The fixed  slides in and out when it is toggled. \"slideup\" is used for headers, and \"slidedown\" is used for footers.\n\t\t\t\t\t\t\"fade\"The fixed  fades in and out when it is toggled.\n\t\t\t\t\t\n\t\t\t"
      },
      "updatePagePadding": {
        "!type": "bool",
        "!doc": "This option is provided by the fixedToolbar extension.\n\t\t\t\tWhether to set the page content div's top and bottom padding to the height of the .\n\t\t\t\tThis opstion is also exposed as a data attribute: data-update-page-padding=\"false\".\n\t\t\t"
      },
      "visibleOnPageShow": {
        "!type": "bool",
        "!doc": "This option is provided by the fixedToolbar extension.\n\t\t\t\tWhether the  is shown along with the page.\n\t\t\t\tThis opstion is also exposed as a data attribute: data-visible-on-page-show=\"false\".\n\t\t\t"
      }
    },
    "table-columntoggleOption": {
      "columnBtnTheme": {
        "!type": "string",
        "!doc": "Sets the theme for the column chooser button. Set to any valid swatch letter in your theme.\n\t\t\tThis option is also exposed as a data attribute:data-column-btn-theme=\"b\"."
      },
      "columnBtnText": {
        "!type": "string",
        "!doc": "Sets the theme for the column chooser button. Set to any valid swatch letter in your theme.\n\t\t\tThis option is also exposed as a data attribute:data-column-btn-text=\"Show columns\"."
      },
      "columnPopupTheme": {
        "!type": "string",
        "!doc": "Sets the theme for the column chooser popup checkboxes. Set to any valid swatch letter in your theme.\n\t\t\tThis option is also exposed as a data attribute:data-popup-theme=\"a\"."
      },
      "classes.columnToggleTable": {
        "!type": "string",
        "!doc": "Class assigned to the table.\n\t\t\t\tNote: The reflow mode has one option, classes, which is only configurable via JavaScript because it expects an object literal value. The classes option has two properties that define the structural classnames that the plugin uses.\n\t\t\t"
      },
      "classes.columnBtn": {
        "!type": "string",
        "!doc": "Class assigned to the column toggle button.\n\t\t\t\tNote: The reflow mode has one option, classes, which is only configurable via JavaScript because it expects an object literal value. The classes option has two properties that define the structural classnames that the plugin uses.\n\t\t\t"
      },
      "classes.popup": {
        "!type": "string",
        "!doc": "Class assigned to the column chooser popup.\n\t\t\t\tNote: The reflow mode has one option, classes, which is only configurable via JavaScript because it expects an object literal value. The classes option has two properties that define the structural classnames that the plugin uses.\n\t\t\t"
      },
      "classes.priorityPrefix": {
        "!type": "string",
        "!doc": "Class prefix added to each cell in a column. This string is appended to the priority value set on the headers.\n\t\t\t\tNote: The reflow mode has one option, classes, which is only configurable via JavaScript because it expects an object literal value. The classes option has two properties that define the structural classnames that the plugin uses.\n\t\t\t"
      }
    },
    "pagecontainerOption": {
      "theme": {
        "!type": "string",
        "!doc": "\n\t\t\t\tSets the color scheme (swatch) for the  widget. It accepts a single letter from a-z that maps to the swatches included in your theme.\n\t\t\t\tPossible values: swatch letter (a-z).\n\t\t\t\tThis option is also exposed as a data attribute: data-theme=\"b\".\n\t\t\t"
      }
    }
  },
  "jQuery": {
    "mobile": {
      "changePage": {
        "!type": "fn(to: string|?, options: ?|?|string)",
        "!doc": "Programmatically change from one page to another.\n\t\t\n\t\t\tNote:  is deprecated as of jQuery Mobile 1.4.0 and will be removed in 1.5.0. Use the pagecontainer widget's change() method instead.\n\t\t\n\t"
      },
      "degradeInputsWithin": {
        "!type": "fn(target: +Element)",
        "!doc": "Alter the input type of form widgets."
      },
      "getDocumentBase": {
        "!type": "fn(asParsedObject: bool)",
        "!doc": "Utility method for retrieving the original document base URL.\n\t\t\n\t\t\tNote:  is deprecated as of jQuery Mobile 1.4.0 and will be removed in 1.5.0. Use the jQuery.mobile.path.getDocumentBase() method instead.\n\t\t\n\t"
      },
      "getDocumentUrl": {
        "!type": "fn(asParsedObject: bool)",
        "!doc": "Retrieve the URL of the original document.\n\t\t\n\t\t\tNote:  is deprecated as of jQuery Mobile 1.4.0 and will be removed in 1.5.0. Use the jQuery.mobile.path.getDocumentUrl() method instead.\n\t\t\n\t"
      },
      "getInheritedTheme": {
        "!type": "fn(el: +jQuery, defaultTheme: string)",
        "!doc": "Retrieves the theme of the nearest parent that has a theme assigned."
      },
      "loadPage": {
        "!type": "fn(url: string|?, options: ?|?|string)",
        "!doc": "Load an external page, enhance its content, and insert it into the DOM.\n\t\t\n\t\t\tNote:  is deprecated as of jQuery Mobile 1.4.0 and will be removed in 1.5.0. Use the pagecontainer widget's load() method instead.\n\t\t\n\t"
      },
      "navigate": {
        "!type": "fn(url: string, data: ?)",
        "!doc": "Alter the url and track history. Works for browsers with and without the new history API."
      },
      "silentScroll": {
        "!type": "fn(yPos: number)",
        "!doc": "Scroll to a particular Y position without triggering scroll event listeners."
      },
      "path": {
        "get": {
          "!type": "fn(url: string)",
          "!doc": "Utility method for determining the directory portion of an URL."
        },
        "getDocumentBase": {
          "!type": "fn(asParsedObject: bool)",
          "!doc": "Utility method for retrieving the original document base URL."
        },
        "getDocumentUrl": {
          "!type": "fn(asParsedObject: bool)",
          "!doc": "Utility method for retrieving the URL of the original document."
        },
        "getLocation": {
          "!type": "fn()",
          "!doc": "Utility method for safely retrieving the current location."
        },
        "isAbsoluteUrl": {
          "!type": "fn(url: string)",
          "!doc": "Utility method for determining if a URL is absolute."
        },
        "isRelativeUrl": {
          "!type": "fn(url: string)",
          "!doc": "Utility method for determining if a URL is a relative variant."
        },
        "isSameDomain": {
          "!type": "fn(absUrl1: string, absUrl2: string)",
          "!doc": "Utility method for determining if a URL has the same domain."
        },
        "makePathAbsolute": {
          "!type": "fn(relPath: string, absPath: string)",
          "!doc": "Utility method for converting a relative file or directory path into an absolute path."
        },
        "makeUrlAbsolute": {
          "!type": "fn(relUrl: string, absUrl: string)",
          "!doc": "Utility method for converting a relative URL to an absolute URL."
        },
        "parseLocation": {
          "!type": "fn()",
          "!doc": "Utility method for retrieving the current location as a parsed object."
        },
        "parseUrl": {
          "!type": "fn(Url: string)",
          "!doc": "Utility method for parsing a URL and its relative variants into an object that makes accessing the components of the URL easy."
        }
      }
    },
    "fn": {
      "button": {
        "!type": "fn(options?: +buttonOption)",
        "!doc": "Creates a button widget"
      },
      "buttonMarkup": {
        "!type": "fn(options: ?|bool|string|string|bool|bool|bool|string, overwriteClasses: bool)",
        "!doc": "Adds button styling to an element"
      },
      "checkboxradio": {
        "!type": "fn(options?: +checkboxradioOption)",
        "!doc": "Creates a checkboxradio widget"
      },
      "collapsible": {
        "!type": "fn(options?: +collapsibleOption)",
        "!doc": "Creates a collapsible block of content"
      },
      "collapsibleset": {
        "!type": "fn(options?: +collapsiblesetOption)",
        "!doc": "Creates a set of collapsible blocks of content"
      },
      "controlgroup": {
        "!type": "fn(options?: +controlgroupOption)",
        "!doc": "Groups buttons together."
      },
      "dialog": {
        "!type": "fn(options?: +dialogOption)",
        "!doc": "Opens content in an interactive overlay."
      },
      "enhanceWithin": {
        "!type": "fn()",
        "!doc": "Enhance all the children of all elements in the set of matched elements."
      },
      "fieldcontain": {
        "!type": "fn()",
        "!doc": "Adds field container styling to an element"
      },
      "filterable": {
        "!type": "fn(options?: +filterableOption)",
        "!doc": "Makes the children of an element filterable."
      },
      "fixedtoolbar": {
        "!type": "fn(options?: +fixedtoolbarOption)",
        "!doc": "See Toolbar Widget"
      },
      "flipswitch": {
        "!type": "fn(options?: +flipswitchOption)",
        "!doc": "Creates a  widget"
      },
      "footer": {
        "!type": "fn(options?: +footerOption)",
        "!doc": "See Toolbar Widget"
      },
      "header": {
        "!type": "fn(options?: +headerOption)",
        "!doc": "See Toolbar Widget"
      },
      "jqmData": {
        "!type": "fn()",
        "!doc": "Store arbitrary data associated with the specified element. Returns the value that was set."
      },
      "jqmEnhanceable": {
        "!type": "fn()",
        "!doc": "Filter method to respect data-enhance=false parent elements during manual enhancement."
      },
      "jqmHijackable": {
        "!type": "fn()",
        "!doc": "For users that wish to respect data-ajax=false parent elements during custom form and link binding jQuery Mobile provides the $.fn.jqmHijackable filter method."
      },
      "jqmRemoveData": {
        "!type": "fn()",
        "!doc": "Remove a previously-stored piece of data."
      },
      "listview": {
        "!type": "fn(options?: +listviewOption)",
        "!doc": "Creates a listview widget"
      },
      "loader": {
        "!type": "fn(options?: +loaderOption)",
        "!doc": "Handles the task of displaying the loading dialog when jQuery Mobile pulls in content via Ajax. "
      },
      "navbar": {
        "!type": "fn(options?: +navbarOption)",
        "!doc": "Creates a navbar widget"
      },
      "page": {
        "!type": "fn(options?: +pageOption)",
        "!doc": "Primary unit of content."
      },
      "pagecontainer": {
        "!type": "fn(options?: +pagecontainerOption)",
        "!doc": "Manages a collection of pages."
      },
      "panel": {
        "!type": "fn(options?: +panelOption)",
        "!doc": "Creates a panel widget"
      },
      "popup": {
        "!type": "fn(options?: +popupOption)",
        "!doc": "Opens content in a popup."
      },
      "rangeslider": {
        "!type": "fn(options?: +rangesliderOption)",
        "!doc": "Creates a rangeslider widget"
      },
      "selectmenu": {
        "!type": "fn(options?: +selectmenuOption)",
        "!doc": "Creates a select menu widget"
      },
      "slider": {
        "!type": "fn(options?: +sliderOption)",
        "!doc": "Creates a slider widget"
      },
      "table-columntoggle": {
        "!type": "fn(options?: +table_columntoggleOption)",
        "!doc": "Creates a responsive table in column toggle mode"
      },
      "table": {
        "!type": "fn(options?: +tableOption)",
        "!doc": "Creates a responsive table"
      },
      "textinput": {
        "!type": "fn(options?: +textinputOption)",
        "!doc": "Creates a  widget for textinput, textarea or search input"
      },
      "toolbar": {
        "!type": "fn(options?: +toolbarOption)",
        "!doc": "Adds toolbars to the top and/or bottom of the page."
      }
    }
  }
};
});