import { nanoid } from 'nanoid';

import { Editor, Node, mergeAttributes } from '@tiptap/core';
import { generateHTML } from '@tiptap/html';

import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';

import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import ListItem from '@tiptap/extension-list-item';
import Blockquote from '@tiptap/extension-blockquote';
import CodeBlock from '@tiptap/extension-code-block';
import HardBreak from '@tiptap/extension-hard-break';
import HorizontalRule from '@tiptap/extension-horizontal-rule';
import Bold from '@tiptap/extension-bold';
import Underline from '@tiptap/extension-underline';
import Code from '@tiptap/extension-code';
import Italic from '@tiptap/extension-italic';
import Strike from '@tiptap/extension-strike';
import DropCursor from '@tiptap/extension-dropcursor';
import GapCursor from '@tiptap/extension-gapcursor';
import History from '@tiptap/extension-history';
import Heading from '@tiptap/extension-heading';
import TextStyle from '@tiptap/extension-text-style';
import Highlight from '@tiptap/extension-highlight';
import { Color } from '@tiptap/extension-color';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import TextAlign from '@tiptap/extension-text-align';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Typography from '@tiptap/extension-typography';

/**
 * A function that will use the adobe DC Embed PDF API to inline PDFs on the brochure
 * @returns script to build PDFs
 */
function pdfListener() {
  const script = document.createElement('script');
  script.innerHTML = `window.addEventListener('load', function () {
    [...document.querySelectorAll('div[id^=pdf]')].forEach(
      (pdfWrapper) => {
        const pdf = pdfWrapper.querySelector('object');
        const url = pdf.data;
        const fileName = 'download.pdf';
        const id = pdfWrapper.id;

        var adobeDCView = new AdobeDC.View({
          clientId: '9ec6f2abc7b34e9c87f0639106879d49',
          divId: id
        });

        adobeDCView.previewFile(
          { content: { location: { url } }, metaData: { fileName } },
          { embedMode: 'IN_LINE', enableLinearization: false, focusOnRendering: false }
        );
      }
    );
  });`;

  return script;
}

function replaceQuotes(o, reverse = false) {
  if (o === undefined || o === null) return o;

  Object.keys(o).forEach((k) => {
    if (typeof o[k] === 'object') {
      return replaceQuotes(o[k], reverse);
    }

    if (typeof o[k] === 'string') {
      if (reverse) {
        o[k] = o[k].replace(/&quot;/g, '"').replace(/&apos;/g, "'");
      } else {
        o[k] = o[k].replace(/"/g, '&quot;').replace(/'/g, '&apos;');
      }
    }
  });

  return o;
}

function addGlobalVar(name, value) {
  const script = document.createElement('script');
  script.innerHTML = `\nconst ${name} = '${JSON.stringify(
    replaceQuotes(value)
  )}';\nwindow.${name} = ${name};\n`;
  return script;
}

/**
 * A custom PDF Extension for tiptap
 */
const PDF = Node.create({
  name: 'pdf',
  group: 'block',
  atom: true,
  draggable: true,

  addOptions() {
    return {
      HTMLAttributes: {}
    };
  },

  addAttributes() {
    return {
      data: {
        default: ''
      },
      type: {
        default: 'application/pdf'
      }
    };
  },

  parseHTML() {
    return [
      {
        tag: 'object[data][type="application/pdf"]'
      }
    ];
  },

  renderHTML({ node, HTMLAttributes }) {
    const href =
      node.attrs.data ||
      this.options.HTMLAttributes.data ||
      HTMLAttributes.data ||
      '';
    return [
      'div',
      {
        id: 'pdf-' + nanoid()
      },
      [
        'object',
        mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
          width: '100%',
          height: '100%',
          data:
            href +
            '#page=1&view=FitH&toolbar=0&navpanes=0&scrollbar=0&pagemode=none'
        }),
        [
          'span',
          {},
          'PDF embeds are not supported in this browser, and/or you are trying to access a PDF you do not have access to on this website. Try viewing the PDF by navigating to ',
          ['a', { href, target: '_blank' }, 'this link'],
          '.'
        ]
      ]
    ];
  },

  addCommands() {
    return {
      setPDF:
        (options) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: options
          });
        }
    };
  }
});

/**
 * A custom Iframe/Video embed extension for tiptap
 */

function manipulateEmbedURL(url) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);

  return match && match[2].length === 11
    ? '//www.youtube.com/embed/' + match[2]
    : url;
}

const Iframe = Node.create({
  name: 'iframe',
  group: 'block',
  atom: true,
  draggable: true,

  addOptions() {
    return {
      allowFullscreen: true,
      HTMLAttributes: { class: 'iframe-wrapper' }
    };
  },

  addAttributes() {
    return {
      src: {
        default: null
      },
      frameborder: {
        default: 0
      },
      allowfullscreen: {
        default: this.options.allowFullscreen,
        parseHTML: () => this.options.allowFullscreen
      }
    };
  },

  parseHTML() {
    return [{ tag: 'iframe[src]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', this.options.HTMLAttributes, ['iframe', HTMLAttributes]];
  },

  addCommands() {
    return {
      setIframe:
        (options) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: options
          });
        }
    };
  }
});

const extensions = [
  Document,
  PDF,
  Paragraph,
  Text,
  Bold,
  Underline,
  Code,
  Italic,
  Strike,
  HardBreak,
  CodeBlock,
  Blockquote,
  BulletList,
  Iframe,
  OrderedList,
  ListItem,
  HorizontalRule,
  DropCursor,
  GapCursor,
  History,
  TextStyle,
  Color,
  Link.extend({
    addAttributes() {
      return {
        ...this.parent?.(),
        class: {
          default: ''
        }
      };
    }
  }).configure({
    openOnClick: false
  }),
  Image.extend({
    addAttributes() {
      return {
        ...this.parent?.(),
        class: {
          default: ''
        }
      };
    }
  }),
  Superscript,
  TaskList,
  TaskItem,
  Subscript.extend({
    addKeyboardShortcuts() {
      return {
        'Mod-Shift-,': () => this.editor.commands.toggleSubscript()
      };
    }
  }),
  Table.configure({ resizable: false }),
  TableRow,
  TableHeader,
  TableCell,
  Highlight.configure({ multicolor: true }),
  Heading.configure({ levels: [1, 2, 3] }),
  TextAlign.extend({
    addKeyboardShortcuts() {
      return {
        'Mod-Alt-l': () => this.editor.commands.setTextAlign('left'),
        'Mod-Alt-e': () => this.editor.commands.setTextAlign('center'),
        'Mod-Alt-r': () => this.editor.commands.setTextAlign('right'),
        'Mod-Alt-j': () => this.editor.commands.setTextAlign('justify')
      };
    }
  }).configure({ types: ['heading', 'paragraph'] }),
  Placeholder.configure({
    placeholder: 'Your Content Goes Here...'
  }),
  Typography
];

/**
 * Alpine Store for creating an editor and handling its data
 */
document.addEventListener('alpine:init', () => {
  Alpine.data('editor', (customId = null, customContent = null) => {
    const editors = window.tiptapEditors || {};

    return {
      id: null,
      updatedAt: null,

      init() {
        this.id = customId ? customId : this.$el.id;
        const section = document.getElementById(this.id);
        const _this = this;

        [
          ...document.querySelectorAll(`#${this.id} :is(h1,h2,h3,h4,h5,h6)`)
        ].forEach(
          (heading) =>
            (heading.innerHTML = heading.querySelector('a').innerHTML)
        );

        const content =
          customContent !== null ? customContent : section.innerHTML.trim();

        if (customContent === null) section.innerHTML = '';

        editors[this.id] = new Editor({
          element: section,
          editorProps: {
            attributes: {
              class: 'prose focus:outline-none w-full max-w-[85ch]'
            }
          },
          extensions,
          content,
          onCreate() {
            _this.updatedAt = Date.now();
            _this.$data.lastUpdate = Date.now();
          },
          onUpdate() {
            _this.updatedAt = Date.now();
            _this.$data.lastUpdate = Date.now();
          },
          onSelectionUpdate() {
            _this.updatedAt = Date.now();
            _this.$data.lastUpdate = Date.now();
          },
          onTransaction: () => {
            _this.updatedAt = Date.now();
            _this.$data.lastUpdate = Date.now();
          }
        });

        window.tiptapEditors = editors;

        this.$data.editor = () => {
          return this.aagFocused
            ? editors[this.aagFocused]
            : editors[this.currentId];
        };
      }
    };
  });

  Alpine.data('menu', () => {
    return {
      bgColorPicker: null,
      txtColorPicker: null,
      init() {
        this.bgColorPicker = new iro.ColorPicker(
          '#template-tt-background-color',
          {
            width: 250,
            color: 'rgba(55, 65, 81, 1)',
            borderWidth: 1,
            borderColor: '#fff',
            layout: [
              {
                component: iro.ui.Slider,
                options: {
                  sliderType: 'hue'
                }
              },
              {
                component: iro.ui.Slider,
                options: {
                  sliderType: 'saturation'
                }
              },
              {
                component: iro.ui.Slider,
                options: {
                  sliderType: 'value'
                }
              },
              {
                component: iro.ui.Slider,
                options: {
                  sliderType: 'alpha'
                }
              }
            ]
          }
        );

        this.txtColorPicker = new iro.ColorPicker('#template-tt-text-color', {
          width: 250,
          color: 'rgba(55, 65, 81, 1)',
          borderWidth: 1,
          borderColor: '#fff',
          layout: [
            {
              component: iro.ui.Slider,
              options: {
                sliderType: 'hue'
              }
            },
            {
              component: iro.ui.Slider,
              options: {
                sliderType: 'saturation'
              }
            },
            {
              component: iro.ui.Slider,
              options: {
                sliderType: 'value'
              }
            },
            {
              component: iro.ui.Slider,
              options: {
                sliderType: 'alpha'
              }
            }
          ]
        });

        this.bgColorPicker.on('input:change', (color) => {
          this.setBackground(color.rgbaString);
        });

        this.txtColorPicker.on('input:change', (color) => {
          this.setColor(color.rgbaString);
        });
      },
      isActive(type, lastUpdate, options = {}) {
        // lastUpdate forces a rerender
        return (
          this.$data.editor() && this.$data.editor().isActive(type, options)
        );
      },
      toggleBold() {
        return (
          this.$data.editor() &&
          this.$data.editor().chain().toggleBold().focus().run()
        );
      },
      toggleUnderline() {
        return (
          this.$data.editor() &&
          this.$data.editor().chain().toggleUnderline().focus().run()
        );
      },
      toggleStrike() {
        return (
          this.$data.editor() &&
          this.$data.editor().chain().toggleStrike().focus().run()
        );
      },
      toggleCode() {
        return (
          this.$data.editor() &&
          this.$data.editor().chain().toggleCode().focus().run()
        );
      },
      toggleItalic() {
        return (
          this.$data.editor() &&
          this.$data.editor().chain().toggleItalic().focus().run()
        );
      },
      toggleSuperscript() {
        return (
          this.$data.editor() &&
          this.$data.editor().chain().toggleSuperscript().focus().run()
        );
      },
      toggleSubscript() {
        return (
          this.$data.editor() &&
          this.$data.editor().chain().toggleSubscript().focus().run()
        );
      },
      toggleBulletList() {
        return (
          this.$data.editor() &&
          this.$data.editor().chain().toggleBulletList().focus().run()
        );
      },
      toggleOrderedList() {
        return (
          this.$data.editor() &&
          this.$data.editor().chain().toggleOrderedList().focus().run()
        );
      },
      toggleTaskList() {
        return (
          this.$data.editor() &&
          this.$data.editor().chain().toggleTaskList().focus().run()
        );
      },
      toggleCodeBlock() {
        return (
          this.$data.editor() &&
          this.$data.editor().chain().toggleCodeBlock().focus().run()
        );
      },
      toggleBlockquote() {
        return (
          this.$data.editor() &&
          this.$data.editor().chain().toggleBlockquote().focus().run()
        );
      },
      toggleBlockquote() {
        return (
          this.$data.editor() &&
          this.$data.editor().chain().toggleBlockquote().focus().run()
        );
      },
      setHardBreak() {
        return (
          this.$data.editor() &&
          this.$data.editor().chain().setHardBreak().focus().run()
        );
      },
      setHorizontalRule() {
        return (
          this.$data.editor() &&
          this.$data.editor().chain().setHorizontalRule().focus().run()
        );
      },
      toggleTable() {
        if (!this.isActive('table'))
          return (
            this.$data.editor() &&
            this.$data
              .editor()
              .chain()
              .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
              .focus()
              .run()
          );

        return (
          this.$data.editor() &&
          this.$data.editor().chain().deleteTable().focus().run()
        );
      },
      deleteRow() {
        return (
          this.$data.editor() &&
          this.$data.editor().chain().deleteRow().focus().run()
        );
      },
      addRowAfter() {
        return (
          this.$data.editor() &&
          this.$data.editor().chain().addRowAfter().focus().run()
        );
      },
      deleteColumn() {
        return (
          this.$data.editor() &&
          this.$data.editor().chain().deleteColumn().focus().run()
        );
      },
      addColumnAfter() {
        return (
          this.$data.editor() &&
          this.$data.editor().chain().addColumnAfter().focus().run()
        );
      },
      setColor(color) {
        return (
          this.$data.editor() &&
          this.$data.editor().chain().focus().setColor(color).run()
        );
      },
      toggleColor() {
        if (this.isActive('textStyle')) {
          this.bgColorPicker.color.rgbaString = 'rgba(55, 65, 81, 1)';
          return (
            this.$data.editor() &&
            this.$data.editor().chain().focus().unsetColor().run()
          );
        }

        const color = 'rgba(255, 33, 33, 1)';
        this.bgColorPicker.color.rgbaString = color;
        return (
          this.$data.editor() &&
          this.$data.editor().chain().focus().setColor(color).run()
        );
      },
      getColor(lastUpdate) {
        // lastUpdate forces a rerender
        const color =
          (this.$data.editor() &&
            this.$data.editor().getAttributes('textStyle').color) ||
          'rgba(55, 65, 81, 1)';

        if (this.txtColorPicker.color.rgbaString !== color)
          this.txtColorPicker.color.rgbaString = color;

        return color;
      },
      setBackground(color) {
        return (
          this.$data.editor() &&
          this.$data.editor().chain().focus().setHighlight({ color }).run()
        );
      },
      toggleBackground() {
        if (this.isActive('highlight')) {
          this.bgColorPicker.color.rgbaString = 'rgba(55, 65, 81, 1)';
          return (
            this.$data.editor() &&
            this.$data.editor().chain().focus().unsetHighlight().run()
          );
        }

        const color = 'rgba(255, 255, 0, 1)';
        this.bgColorPicker.color.rgbaString = color;
        return (
          this.$data.editor() &&
          this.$data.editor().chain().focus().setHighlight({ color }).run()
        );
      },
      getBackground(lastUpdate) {
        // lastUpdate forces a rerender
        const color =
          (this.$data.editor() &&
            this.$data.editor().getAttributes('highlight').color) ||
          'rgba(55, 65, 81, 1)';

        if (this.bgColorPicker.color.rgbaString !== color)
          this.bgColorPicker.color.rgbaString = color;

        return color;
      },
      setTextAlign(align) {
        return (
          this.$data.editor() &&
          this.$data.editor().chain().focus().setTextAlign(align).run()
        );
      },
      setHeading(level) {
        return (
          this.$data.editor() &&
          this.$data.editor().chain().focus().setHeading({ level }).run()
        );
      },
      setParagraph() {
        return (
          this.$data.editor() &&
          this.$data.editor().chain().focus().setParagraph().run()
        );
      },
      clearFormat() {
        return (
          this.$data.editor() &&
          this.$data.editor().chain().focus().unsetAllMarks().run()
        );
      },
      toggleLink(link, target, classes, clear) {
        target = target === true ? '_blank' : '_self';

        if (clear)
          return (
            this.$data.editor() &&
            this.$data
              .editor()
              .chain()
              .extendMarkRange('link')
              .unsetLink()
              .run()
          );

        return (
          this.$data.editor() &&
          this.$data
            .editor()
            .chain()
            .extendMarkRange('link')
            .setLink({ href: link, target, class: classes })
            .run()
        );
      },
      getLink(lastUpdate) {
        // lastUpdate forces a rerender
        return (
          (this.$data.editor() &&
            this.$data.editor().getAttributes('link').href) ||
          ''
        );
      },
      getTarget(lastUpdate) {
        // lastUpdate forces a rerender
        return (
          (this.$data.editor() &&
            this.$data.editor().getAttributes('link').target) ||
          '_self'
        );
      },
      getLinkClasses(lastUpdate) {
        // lastUpdate forces a rerender
        return (
          (this.$data.editor() &&
            this.$data.editor().getAttributes('link').class) ||
          ''
        );
      },
      setIframe(src) {
        return (
          this.$data.editor() &&
          this.$data
            .editor()
            .chain()
            .focus()
            .setIframe({ src: manipulateEmbedURL(src) })
            .run()
        );
      },
      getIframe() {
        return (
          (this.$data.editor() &&
            this.$data.editor().getAttributes('iframe').src) ||
          ''
        );
      },
      setImage(src, classes) {
        return (
          this.$data.editor() &&
          this.$data
            .editor()
            .chain()
            .focus()
            .setImage({ src: src, class: classes })
            .run()
        );
      },
      getImage() {
        return (
          (this.$data.editor() &&
            this.$data.editor().getAttributes('image').src) ||
          ''
        );
      },
      getImageClasses(lastUpdate) {
        // lastUpdate forces a rerender
        return (
          (this.$data.editor() &&
            this.$data.editor().getAttributes('image').class) ||
          'header full'
        );
      },
      setPDF(pdf) {
        return (
          this.$data.editor() &&
          this.$data.editor().chain().focus().setPDF({ data: pdf }).run()
        );
      },
      getPDF() {
        return (
          (this.$data.editor() &&
            this.$data.editor().getAttributes('pdf').data) ||
          ''
        );
      },
      canUndo(lastUpdate) {
        // lastUpdate forces a rerender
        return this.$data.editor() && this.$data.editor().can().undo();
      },
      canRedo(lastUpdate) {
        // lastUpdate forces a rerender
        return this.$data.editor() && this.$data.editor().can().redo();
      },
      isSelected(lastUpdate) {
        // lastUpdate forces a rerender
        return (
          this.$data.editor() &&
          this.$data.editor().view.state.selection &&
          !this.$data.editor().view.state.selection.empty
        );
      },
      undo() {
        return (
          this.$data.editor() &&
          this.$data.editor().chain().focus().undo().run()
        );
      },
      redo() {
        return (
          this.$data.editor() &&
          this.$data.editor().chain().focus().redo().run()
        );
      }
    };
  });
});

/**
 * A function to remove certain parts from the HTML
 * @param {string} html A string of html
 * @param {string[]} sections A list of section names that should be removed (i.e. a section wrapped with <!--STRIP SCRIPT-->...<!--STRIPEND SCRIPT--> would be removed)
 * @returns Removes a list of stripped sections from the html string
 */
function removeStrip(html, sections) {
  if (!Array.isArray(sections)) sections = [sections];

  return sections
    .map((section) => section.toLowerCase())
    .reduce(
      (prev, cur) =>
        prev.replace(
          new RegExp(
            `<!--STRIP ${cur}-->(.|\n)*?<!--STRIPEND ${cur}-->`,
            'gim'
          ),
          ''
        ),
      html
    );
}

const appData =
  '{"appGlance":{"type":"doc","content":[{"type":"paragraph","attrs":{"textAlign":"left"},"content":[{"type":"text","marks":[{"type":"bold"}],"text":"Term"},{"type":"text","text":" "},{"type":"hardBreak"},{"type":"text","marks":[{"type":"italic"}],"text":"Coming Soon"}]},{"type":"paragraph","attrs":{"textAlign":"left"},"content":[{"type":"text","marks":[{"type":"bold"}],"text":"Sponsor"},{"type":"text","text":" "},{"type":"hardBreak"},{"type":"text","marks":[{"type":"italic"}],"text":"Coming Sooon"}]},{"type":"paragraph","attrs":{"textAlign":"left"},"content":[{"type":"text","marks":[{"type":"bold"}],"text":"Estimated Cost"},{"type":"text","text":" "},{"type":"hardBreak"},{"type":"text","marks":[{"type":"italic"}],"text":"Coming Soon"}]},{"type":"horizontalRule"},{"type":"paragraph","attrs":{"textAlign":"left"},"content":[{"type":"text","marks":[{"type":"bold"}],"text":"Courses"},{"type":"text","text":" "},{"type":"hardBreak"},{"type":"text","marks":[{"type":"italic"}],"text":"Coming Soon"}]},{"type":"paragraph","attrs":{"textAlign":"left"},"content":[{"type":"text","marks":[{"type":"bold"}],"text":"CSER"},{"type":"text","text":" "},{"type":"hardBreak"},{"type":"text","marks":[{"type":"italic"}],"text":"Coming Soon"}]},{"type":"paragraph","attrs":{"textAlign":"left"},"content":[{"type":"text","marks":[{"type":"bold"}],"text":"Not For Credit"},{"type":"text","text":" "},{"type":"hardBreak"},{"type":"text","marks":[{"type":"italic"}],"text":"Coming Soon"}]}]},"appOverview":{"type":"doc","content":[{"type":"heading","attrs":{"textAlign":"left","level":1},"content":[{"type":"text","text":"Trip Overview"}]},{"type":"image","attrs":{"src":"https://images.unsplash.com/photo-1429277096327-11ee3b761c93?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2048&q=80","alt":null,"title":null}},{"type":"iframe","attrs":{"src":"//www.youtube.com/embed/dQw4w9WgXcQ","frameborder":0,"allowfullscreen":true}},{"type":"pdf","attrs":{"data":"https://liberty-sa.terradotta.com/_customtags/ct_DocumentRetrieve.cfm?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJwYXlsb2FkIjp7InRpbWVzdGFtcCI6IjIwMjItMDUtMDZUMTY6Mzc6MTkiLCJleHBpcmVMaW5rIjpmYWxzZSwiZmlsZUlkIjozNjQ1Nn19.dplg3cWUG97rVZqspNmLLmg3bxcJ3HfKa3pl3DT2b44","type":"application/pdf"}}]},"appResources":{"type":"doc","content":[{"type":"paragraph","attrs":{"textAlign":"left"},"content":[{"type":"text","text":"This is a test"}]},{"type":"image","attrs":{"src":"https://images.unsplash.com/photo-1652080923969-50184837d714?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80","alt":null,"title":null}},{"type":"pdf","attrs":{"data":"https://liberty-sa.terradotta.com/_customtags/ct_DocumentRetrieve.cfm?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJwYXlsb2FkIjp7InRpbWVzdGFtcCI6IjIwMjItMDUtMDlUMTE6NTk6MjkiLCJleHBpcmVMaW5rIjpmYWxzZSwiZmlsZUlkIjozNjQ1Nn19.jF_zr7eeNVX8jK7LLXFjKCueyCbdlmR2fLbpfEsObBk","type":"application/pdf"}}]},"appSafety":{"type":"doc","content":[{"type":"bulletList","content":[{"type":"listItem","content":[{"type":"paragraph","attrs":{"textAlign":"left"},"content":[{"type":"text","text":"asdf"}]}]},{"type":"listItem","content":[{"type":"paragraph","attrs":{"textAlign":"left"},"content":[{"type":"text","text":"asdf"}]}]},{"type":"listItem","content":[{"type":"paragraph","attrs":{"textAlign":"left"},"content":[{"type":"text","text":"asdf"}]}]},{"type":"listItem","content":[{"type":"paragraph","attrs":{"textAlign":"left"},"content":[{"type":"text","text":"asdf"}]}]}]},{"type":"paragraph","attrs":{"textAlign":"left"}},{"type":"orderedList","attrs":{"start":1},"content":[{"type":"listItem","content":[{"type":"paragraph","attrs":{"textAlign":"left"},"content":[{"type":"text","text":"asdf"}]}]},{"type":"listItem","content":[{"type":"paragraph","attrs":{"textAlign":"left"},"content":[{"type":"text","text":"asdf"}]}]},{"type":"listItem","content":[{"type":"paragraph","attrs":{"textAlign":"left"},"content":[{"type":"text","text":"asdf"}]}]},{"type":"listItem","content":[{"type":"paragraph","attrs":{"textAlign":"left"},"content":[{"type":"text","text":"asdf"}]}]},{"type":"listItem","content":[{"type":"paragraph","attrs":{"textAlign":"left"},"content":[{"type":"text","text":"asdf"}]}]}]}]},"appChecklist":{"type":"doc","content":[{"type":"heading","attrs":{"textAlign":"left","level":1},"content":[{"type":"text","text":"This is a test"}]},{"type":"taskList","content":[{"type":"taskItem","attrs":{"checked":false},"content":[{"type":"paragraph","attrs":{"textAlign":"left"},"content":[{"type":"text","text":"This is a test"}]}]},{"type":"taskItem","attrs":{"checked":false},"content":[{"type":"paragraph","attrs":{"textAlign":"left"},"content":[{"type":"text","text":"This is still a test"}]}]},{"type":"taskItem","attrs":{"checked":false},"content":[{"type":"paragraph","attrs":{"textAlign":"left"},"content":[{"type":"text","text":"This is another test"}]}]},{"type":"taskItem","attrs":{"checked":false},"content":[{"type":"paragraph","attrs":{"textAlign":"left"},"content":[{"type":"text","text":"asdf"}]}]}]},{"type":"paragraph","attrs":{"textAlign":"left"},"content":[{"type":"text","text":"Hello!"}]},{"type":"taskList","content":[{"type":"taskItem","attrs":{"checked":false},"content":[{"type":"paragraph","attrs":{"textAlign":"left"},"content":[{"type":"text","text":"asdf"}]}]},{"type":"taskItem","attrs":{"checked":false},"content":[{"type":"paragraph","attrs":{"textAlign":"left"},"content":[{"type":"text","text":"asdf"}]}]},{"type":"taskItem","attrs":{"checked":false},"content":[{"type":"paragraph","attrs":{"textAlign":"left"},"content":[{"type":"text","text":"asdf"}]}]},{"type":"taskItem","attrs":{"checked":false},"content":[{"type":"paragraph","attrs":{"textAlign":"left"},"content":[{"type":"text","text":"saasdf"}]}]}]}]},"appFlights":{"type":"doc","content":[{"type":"heading","attrs":{"textAlign":"left","level":1},"content":[{"type":"text","text":"Flight Itinerary"}]},{"type":"paragraph","attrs":{"textAlign":"left"},"content":[{"type":"text","text":"Vroom vroom goes the car, thus fly fly goes the plane"}]}]},"appPacking":{"type":"doc","content":[{"type":"paragraph","attrs":{"textAlign":"left"}}]},"other":{"background":"https://images.unsplash.com/photo-1651767565362-de7e8d57cc94?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"}}';

document.querySelector('#appSubtitle').innerHTML =
  'XX Month, 20XX - XX Month, 20XX';
document.querySelector('#appApplicationDeadline').innerHTML =
  'Application Due XX/XX/20XX';

/**
 * Copies the brochure to be pasted into the TD WYSIWYG
 */
async function exportBrochure(programID) {
  const html = await get(window.location.href, { asText: true });
  const strippedHTML = removeStrip(html, [
    'script',
    'menu',
    'importexport',
    'aag'
  ]);

  const parser = new DOMParser();

  const finalJSON = {};

  let finalHTML = parser.parseFromString(strippedHTML, 'text/html');
  for (const [section, editor] of Object.entries(window.tiptapEditors)) {
    finalJSON[section] = replaceQuotes(editor.getJSON());

    const tempHTML =
      section === 'appGlance'
        ? finalHTML.getElementById(section).innerHTML +
          generateHTML(finalJSON[section], extensions)
        : generateHTML(finalJSON[section], extensions);
    finalHTML.getElementById(section).innerHTML =
      tempHTML === '<p></p>' ? '&nbsp;' : tempHTML;
    finalHTML.getElementById(section).removeAttribute('x-data');
  }

  finalHTML.getElementById('app').appendChild(pdfListener());

  finalJSON.other = {};

  if (Alpine.store('program')) {
    finalHTML.getElementById('app').setAttribute('x-init', '');

    for (let [key, value] of Object.entries(Alpine.store('program'))) {
      if (value instanceof Function || ['dateRow', 'id'].includes(key))
        continue;
      if (value === undefined) continue;
      if (!finalJSON.other.program) finalJSON.other.program = {};

      const newValue =
        typeof value === 'string'
          ? value
              .replace(/[\/\(\)\"]/g, '&quot;')
              .replace(/[\/\(\)\']/g, '&apos;')
          : value;
      finalJSON.other.program[key] = newValue;

      finalHTML
        .getElementById('app')
        .setAttribute(
          'x-init',
          finalHTML.getElementById('app').getAttribute('x-init') +
            `$store.program.${key} = ${
              typeof newValue === 'string' ? `'${newValue}'` : newValue
            };`
        );
    }
  }

  if (Alpine.store('background')) {
    finalJSON.other.background = Alpine.store('background');
    if (!Alpine.store('background').endsWith('21698'))
      finalHTML
        .getElementById('app')
        .setAttribute(
          'x-init',
          finalHTML.getElementById('app').getAttribute('x-init') +
            `$store.background = '${Alpine.store('background')}';`
        );
    else
      finalHTML
        .getElementById('app')
        .setAttribute(
          'x-init',
          finalHTML.getElementById('app').getAttribute('x-init') +
            `$store.temp = getDefaultBackground([$store.program.getTitle(), $store.program.getSchools(), $store.program.getDepartments(), $store.program.getCities(), $store.program.getCountries()]); $store.background = $store.temp.image; $store.bgPosition = $store.temp.position;`
        );
  }

  if (Alpine.store('bgPosition') && Alpine.store('bgPosition') !== '50%') {
    finalJSON.other.bgPosition = Alpine.store('bgPosition');
    finalHTML
      .getElementById('app')
      .setAttribute(
        'x-init',
        finalHTML.getElementById('app').getAttribute('x-init') +
          `$store.bgPosition = '${Alpine.store('bgPosition')}';`
      );
  }

  finalHTML
    .getElementById('app')
    .appendChild(addGlobalVar('appData', finalJSON));

  await navigator.clipboard.writeText(
    finalHTML.head.innerHTML
      .replace(/&amp;apos;/g, '&apos;')
      .replace(/&amp;quot;/g, '&quot;') +
      finalHTML.body.innerHTML
        .replace(/&amp;apos;/g, '&apos;')
        .replace(/&amp;quot;/g, '&quot;')
  );

  if (programID !== undefined) {
    window.open(
      'https://liberty-sa.terradotta.com/index.cfm?FuseAction=ProgramAdmin.BrochureEdit&Program_ID=' +
        programID,
      '_blank'
    );
  }
}

async function importBrochure(importData) {
  if (importData) {
    try {
      const data = JSON.parse(importData);
      setTimeout(function () {
        for (const [section, editor] of Object.entries(window.tiptapEditors)) {
          if (data && data[section])
            editor.commands.setContent(replaceQuotes(data[section], true));
          document.getElementById('importBrochureButton').style.display =
            'none';
        }

        if (data.other) {
          const other = data.other;

          if (other.background) {
            Alpine.store('background', other.background);
          }

          if (other.bgPosition) {
            Alpine.store('bgPosition', other.bgPosition);
          }

          if (other.program) {
            for (let [key, value] of Object.entries(other.program)) {
              Alpine.store('program')[key] =
                typeof value === 'string'
                  ? value.replace(/&quot;/g, '"').replace(/&apos;/g, "'")
                  : value;
            }
          }
        }
      }, 0);
    } catch (error) {
      console.warn(error);
    }
  }
}

async function addAAG() {
  if (window.tiptapEditors.appGlance) {
    const editor = window.tiptapEditors.appGlance;
    editor
      .chain()
      .focus()
      .insertContent('<p><strong>Title</strong><br />Details</p>')
      .run();
  }
}

/**
 * Makes this function publicly available
 */
window.exportBrochure = exportBrochure;
window.importBrochure = importBrochure;
window.appData = appData;
window.addAAG = addAAG;
