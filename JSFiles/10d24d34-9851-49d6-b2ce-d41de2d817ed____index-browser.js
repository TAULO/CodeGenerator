var hubl = (function (exports, Nunjucks, dateFns, strftime, clip, lib) {
  'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var Nunjucks__default = /*#__PURE__*/_interopDefaultLegacy(Nunjucks);
  var strftime__default = /*#__PURE__*/_interopDefaultLegacy(strftime);
  var clip__default = /*#__PURE__*/_interopDefaultLegacy(clip);

  class CtaManager {
    constructor(ctas) {
      this.ctas = ctas;
      this.ctasById = [];
      this.init();
    }

    init() {
      for (const cta of this.ctas) {
        this.ctasById[cta.id] = cta;
      }
    }

    getAll() {
      return this.ctas;
    }

    getById(id) {
      return this.ctasById(id);
    }

    render(id) {

      const { portal_id, button_text, ...rest}  = this.ctasById[id];

      return `<!--HubSpot Call-to-Action Code -->
      <span class="hs-cta-wrapper" id="hs-cta-wrapper-${ id }">
        <span class="hs-cta-node hs-cta-${ id }" id="hs-cta-${ id }">
          <!--[if lte IE 8]><div id="hs-cta-ie-element"></div><![endif]-->
          
          <a href="https://cta-redirect.hubspot.com/cta/redirect/${ portal_id }/${ id }" >
            <img class="hs-cta-img" id="hs-cta-img-${ id }" style="border-width:0px;" src="https://no-cache.hubspot.com/cta/default/${ portal_id }/${ id }.png"  alt="${ button_text }"/>
          </a>
        </span>
        <script charset="utf-8" src="https://js.hscta.net/cta/current.js"></script>
        <script type="text/javascript">
          hbspt.cta.load(${ portal_id }, '${ id }', {}); 
        </script>
      </span>
      <!-- end HubSpot Call-to-Action Code -->`;
    }
  }

  const OPERATORS = {
    'eq': (a, b) => a == b,
    'ne': (a,b) => a != b,
    'contains': (a, b) => a.includes(b),
    'lt': (a, b) => a < b,
    'lte': (a,b) => a <= b,
    'gt': (a,b) => a > b,
    'gte': (a,b) => a >= b,
    'is_null': (a) => a === null,
    'not_null': (a) => a !== null,
  };

  const SORT_LIMIT = {
    'orderBy': (data, val) => {
      return [...data].sort();
    },
    'limit': (data, val) => {
      return [...data].slice(op)
    }
  };


  class HubDbManager {
    constructor(data) {
      this.data = data;
    }

    init() {
      // for (const cta of this.ctas) {
        // this.data[cta.id] = cta;
      // }
    }
    getAll() {
      return this.data;
    }

    getById(id) {
      return this.ctasById(id);
    }

    /**
     * Query table.
     * @param {*} tableId 
     * @param {*} query 
     */
    find(tableId, query) {
        const parts = this.parseQuery(query);

        let data = { ...this.data[tableId] };

        for (const [key, value] of Object.entries(parts)) {
        
          // Limit or sort
          if (SORT_LIMIT[key]) {
            continue;
          }

          let items = key.split('__');

          if (items && items[1]) {
            const field = items[0];
            data.rows = data.rows.filter( item => OPERATORS[items[1]]( item[field], value) );
          } else {
            data.rows = data.rows.filter( item => OPERATORS['eq']( item[key], value) );
          }
      }
      return data.rows;
    }

    parseQuery(queryString) {
      var query = {};
      var pairs = (queryString[0] === '?' ? queryString.substr(1) : queryString).split('&');
      for (var i = 0; i < pairs.length; i++) {
          var pair = pairs[i].split('=');
          query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
      }
      return query;
    }
    
  }

  function register(env) {
    env.addExtension("blog_comments", new handler(env));
  }
  function handler(env) {
    this.tags = ['blog_comments'];

    this.parse = function (parser, nodes, lexer) {
        var tok = parser.nextToken();

        var args = parser.parseSignature(null, true);
        parser.advanceAfterBlockEnd(tok.value);
        //var body = parser.parseUntilBlocks('end_blog_comments');
        let body = null;
        //parser.advanceAfterBlockEnd();
        return new nodes.CallExtension(this, 'run', args, [body]);

    };

    this.run = function(environment) {
      
        let str = JSON.stringify(environment.ctx);
        return new Nunjucks__default['default'].runtime.SafeString(str);
    };
  }

  function register$1(env) {
    env.addExtension("blog_social_sharing", new handler$1(env));
  }
  function handler$1(env) {
    this.tags = ['blog_social_sharing'];

    this.parse = function (parser, nodes, lexer) {
        var tok = parser.nextToken();

        var args = parser.parseSignature(null, true);
        parser.advanceAfterBlockEnd(tok.value);
        //var body = parser.parseUntilBlocks('end_blog_social_sharing');
        let body = null;
        //parser.advanceAfterBlockEnd();
        return new nodes.CallExtension(this, 'run', args, [body]);

    };

    this.run = function(environment) {
      
        let str = JSON.stringify(environment.ctx);
        return new Nunjucks__default['default'].runtime.SafeString(str);
    };
  }

  function register$2(env) {
    env.addExtension("blog_subscribe", new handler$2(env));
  }
  function handler$2(env) {
    this.tags = ['blog_subscribe'];

    this.parse = function (parser, nodes, lexer) {
        var tok = parser.nextToken();

        var args = parser.parseSignature(null, true);
        parser.advanceAfterBlockEnd(tok.value);
        //var body = parser.parseUntilBlocks('end_blog_subscribe');
        let body = null;
        //parser.advanceAfterBlockEnd();
        return new nodes.CallExtension(this, 'run', args, [body]);

    };

    this.run = function(environment) {
      
        let str = JSON.stringify(environment.ctx);
        return new Nunjucks__default['default'].runtime.SafeString(str);
    };
  }

  function register$3(env) {
    env.addExtension("boolean", new handler$3(env));
  }
  function handler$3(env) {
    this.tags = ['boolean'];

    this.parse = function (parser, nodes, lexer) {
        var tok = parser.nextToken();

        var args = parser.parseSignature(null, true);
        parser.advanceAfterBlockEnd(tok.value);
        //var body = parser.parseUntilBlocks('end_boolean');
        let body = null;
        //parser.advanceAfterBlockEnd();
        return new nodes.CallExtension(this, 'run', args, [body]);

    };

    this.run = function(environment) {
      
        let str = JSON.stringify(environment.ctx);
        return new Nunjucks__default['default'].runtime.SafeString(str);
    };
  }

  function register$4(env) {
    env.addExtension("choice", new handler$4(env));
  }
  function handler$4(env) {
    this.tags = ['choice'];

    this.parse = function (parser, nodes, lexer) {
        var tok = parser.nextToken();

        var args = parser.parseSignature(null, true);
        parser.advanceAfterBlockEnd(tok.value);
        //var body = parser.parseUntilBlocks('end_choice');
        let body = null;
        //parser.advanceAfterBlockEnd();
        return new nodes.CallExtension(this, 'run', args, [body]);

    };

    this.run = function(environment) {
      
        let str = JSON.stringify(environment.ctx);
        return new Nunjucks__default['default'].runtime.SafeString(str);
    };
  }

  function register$5(env) {
    env.addExtension("color", new handler$5(env));
  }
  function handler$5(env) {
    this.tags = ['color'];

    this.parse = function (parser, nodes, lexer) {
        var tok = parser.nextToken();

        var args = parser.parseSignature(null, true);
        parser.advanceAfterBlockEnd(tok.value);
        //var body = parser.parseUntilBlocks('end_color');
        let body = null;
        //parser.advanceAfterBlockEnd();
        return new nodes.CallExtension(this, 'run', args, [body]);

    };

    this.run = function(environment) {
      
        let str = JSON.stringify(environment.ctx);
        return new Nunjucks__default['default'].runtime.SafeString(str);
    };
  }

  function register$6(env) {
    env.addExtension("cta", new handler$6(env));
  }
  function handler$6(env) {
    this.tags = ['cta'];

    this.parse = function (parser, nodes, lexer) {
        var tok = parser.nextToken();

        var args = parser.parseSignature(null, true);
        parser.advanceAfterBlockEnd(tok.value);
        //var body = parser.parseUntilBlocks('end_cta');
        let body = null;
        //parser.advanceAfterBlockEnd();
        return new nodes.CallExtension(this, 'run', args, [body]);

    };

    this.run = function(environment) {
        let str = JSON.stringify(environment.ctx);
        return new Nunjucks__default['default'].runtime.SafeString(str);
    };
  }

  function register$7(env) {
    env.addExtension("dnd_area", new handler$7(env));
  }
  function handler$7(env) {
    this.tags = ['dnd_area'];

    this.parse = function (parser, nodes, lexer) {
        var tok = parser.nextToken();

        var args = parser.parseSignature(null, true);
        parser.advanceAfterBlockEnd(tok.value);
        var body = parser.parseUntilBlocks('end_dnd_area');
        parser.advanceAfterBlockEnd();
        return new nodes.CallExtension(this, 'run', args, [body]);

    };

    this.run = function(context, body, args) {
      return new Nunjucks__default['default'].runtime.SafeString(`<div class="container-fluid ${ args.className || '' }">
        <div class="row-wrapper">
            <div class="row-fluid">
                <div class="span12 widget-span widget-type-cell " style="" data-widget-type="cell" data-x="0" data-w="12">
                ${body}
                </div>
            </div>
        </div>  
    </div>
    `);
    };
  }

  function register$8(env) {
    env.addExtension("dnd_column", new handler$8(env));
  }
  function handler$8(env) {
    this.tags = ['dnd_column'];

    this.parse = function (parser, nodes, lexer) {
        var tok = parser.nextToken();

        var args = parser.parseSignature(null, true);
        parser.advanceAfterBlockEnd(tok.value);
        var body = parser.parseUntilBlocks('end_dnd_column');
        parser.advanceAfterBlockEnd();
        return new nodes.CallExtension(this, 'run', args, [body]);

    };

    this.run = function(context, body, args) {
      return new Nunjucks__default['default'].runtime.SafeString(`
    <div class="span12 widget-span widget-type-cell unique_name-column-1-margin unique_name-column-1-background-color unique_name-column-1-vertical-alignment dnd-column" style="" data-widget-type="cell" data-x="0" data-w="12">
      ${ body }
    </div>
    <!--end widget-span -->
    `);
    };
  }

  function register$9(env) {
    env.addExtension("dnd_module", new handler$9(env));
  }
  function handler$9(env) {
    this.tags = ['dnd_module'];

    this.parse = function (parser, nodes, lexer) {
        var tok = parser.nextToken();

        var args = parser.parseSignature(null, true);
        parser.advanceAfterBlockEnd(tok.value);
        // var body = parser.parseUntilBlocks('end_dnd_module');
        // parser.advanceAfterBlockEnd();
        return new nodes.CallExtension(this, 'run', args, [null]);

    };

    this.run = function(context, args) {

      const { path, width = 12, offset = 0 } = args;

      const content = env.renderModule(path + '.module/module.html', args);

      return new Nunjucks__default['default'].runtime.SafeString(`
    <div class="span${width} widget-span widget-type-custom_widget" style="" data-widget-type="custom_widget" data-x="${ offset }" data-w="${ width }">
      <div id="hs_cos_wrapper_main-module-1" class="hs_cos_wrapper hs_cos_wrapper_widget hs_cos_wrapper_type_module" style="" data-hs-cos-general-type="widget" data-hs-cos-type="module" >
          <span id="hs_cos_wrapper_module-1_" class="hs_cos_wrapper hs_cos_wrapper_widget hs_cos_wrapper_type_rich_text" style="" data-hs-cos-general-type="widget" data-hs-cos-type="rich_text">
              ${content}
          </span>
      </div>
    </div>  
    `);
    };
  }

  function register$a(env) {
    env.addExtension("dnd_row", new handler$a(env));
  }
  function handler$a(env) {
    this.tags = ['dnd_row'];

    this.parse = function (parser, nodes, lexer) {
        var tok = parser.nextToken();

        var args = parser.parseSignature(null, true);
        parser.advanceAfterBlockEnd(tok.value);
        var body = parser.parseUntilBlocks('end_dnd_row');
        // let body = null;
        parser.advanceAfterBlockEnd();
        return new nodes.CallExtension(this, 'run', args, [body]);

    };

    this.run = function(environment) {
      
        let str = JSON.stringify(environment.ctx);
        return new Nunjucks__default['default'].runtime.SafeString(str);
    };
  }

  function register$b(env) {
    env.addExtension("dnd_section", new handler$b(env));
  }
  function handler$b(env) {
    this.tags = ['dnd_section'];

    this.parse = function (parser, nodes, lexer) {
        var tok = parser.nextToken();

        var args = parser.parseSignature(null, true);
        parser.advanceAfterBlockEnd(tok.value);
        var body = parser.parseUntilBlocks('end_dnd_section');
        // let body = null;
        parser.advanceAfterBlockEnd();
        return new nodes.CallExtension(this, 'run', args, [body]);

    };

    this.run = function(environment) {
      
        let str = JSON.stringify(environment.ctx);
        return new Nunjucks__default['default'].runtime.SafeString(str);
    };
  }

  function register$c(env) {
    env.addExtension("email_simple_subscription", new handler$c(env));
  }
  function handler$c(env) {
    this.tags = ['email_simple_subscription'];

    this.parse = function (parser, nodes, lexer) {
        var tok = parser.nextToken();

        var args = parser.parseSignature(null, true);
        parser.advanceAfterBlockEnd(tok.value);
        //var body = parser.parseUntilBlocks('end_email_simple_subscription');
        let body = null;
        //parser.advanceAfterBlockEnd();
        return new nodes.CallExtension(this, 'run', args, [body]);

    };

    this.run = function(environment) {
      
        let str = JSON.stringify(environment.ctx);
        return new Nunjucks__default['default'].runtime.SafeString(str);
    };
  }

  function register$d(env) {
    env.addExtension("email_subscriptions_confirmation", new handler$d(env));
  }
  function handler$d(env) {
    this.tags = ['email_subscriptions_confirmation'];

    this.parse = function (parser, nodes, lexer) {
        var tok = parser.nextToken();

        var args = parser.parseSignature(null, true);
        parser.advanceAfterBlockEnd(tok.value);
        //var body = parser.parseUntilBlocks('end_email_subscriptions_confirmation');
        let body = null;
        //parser.advanceAfterBlockEnd();
        return new nodes.CallExtension(this, 'run', args, [body]);

    };

    this.run = function(environment) {
      
        let str = JSON.stringify(environment.ctx);
        return new Nunjucks__default['default'].runtime.SafeString(str);
    };
  }

  function register$e(env) {
    env.addExtension("email_subscriptions", new handler$e(env));
  }
  function handler$e(env) {
    this.tags = ['email_subscriptions'];

    this.parse = function (parser, nodes, lexer) {
        var tok = parser.nextToken();

        var args = parser.parseSignature(null, true);
        parser.advanceAfterBlockEnd(tok.value);
        //var body = parser.parseUntilBlocks('end_email_subscriptions');
        let body = null;
        //parser.advanceAfterBlockEnd();
        return new nodes.CallExtension(this, 'run', args, [body]);

    };

    this.run = function(environment) {
      
        let str = JSON.stringify(environment.ctx);
        return new Nunjucks__default['default'].runtime.SafeString(str);
    };
  }

  function register$f(env) {
    env.addExtension("form", new handler$f(env));
  }
  function handler$f(env) {
    this.tags = ['form'];

    this.parse = function (parser, nodes, lexer) {
        var tok = parser.nextToken();

        var args = parser.parseSignature(null, true);
        parser.advanceAfterBlockEnd(tok.value);
        //var body = parser.parseUntilBlocks('end_form');
        let body = null;
        //parser.advanceAfterBlockEnd();
        return new nodes.CallExtension(this, 'run', args, [body]);

    };

    this.run = function(environment) {
      
        let str = JSON.stringify(environment.ctx);
        return new Nunjucks__default['default'].runtime.SafeString(str);
    };
  }

  function register$g(env) {
    env.addExtension("gallery", new handler$g(env));
  }
  function handler$g(env) {
    this.tags = ['gallery'];

    this.parse = function (parser, nodes, lexer) {
        var tok = parser.nextToken();

        var args = parser.parseSignature(null, true);
        parser.advanceAfterBlockEnd(tok.value);
        //var body = parser.parseUntilBlocks('end_gallery');
        let body = null;
        //parser.advanceAfterBlockEnd();
        return new nodes.CallExtension(this, 'run', args, [body]);

    };

    this.run = function(environment) {
      
        let str = JSON.stringify(environment.ctx);
        return new Nunjucks__default['default'].runtime.SafeString(str);
    };
  }

  function register$h(env) {
    env.addExtension("header", new handler$h(env));
  }
  function handler$h(env) {
    this.tags = ['header'];

    this.parse = function (parser, nodes, lexer) {
        var tok = parser.nextToken();

        var args = parser.parseSignature(null, true);
        parser.advanceAfterBlockEnd(tok.value);
        //var body = parser.parseUntilBlocks('end_header');
        let body = null;
        //parser.advanceAfterBlockEnd();
        return new nodes.CallExtension(this, 'run', args, [body]);

    };

    this.run = function(environment) {
      
        let str = JSON.stringify(environment.ctx);
        return new Nunjucks__default['default'].runtime.SafeString(str);
    };
  }

  function register$i(env) {
    env.addExtension("image_src", new handler$i(env));
  }
  function handler$i(env) {
    this.tags = ['image_src'];

    this.parse = function (parser, nodes, lexer) {
        var tok = parser.nextToken();

        var args = parser.parseSignature(null, true);
        parser.advanceAfterBlockEnd(tok.value);
        //var body = parser.parseUntilBlocks('end_image_src');
        let body = null;
        //parser.advanceAfterBlockEnd();
        return new nodes.CallExtension(this, 'run', args, [body]);

    };

    this.run = function(environment) {
      
        let str = JSON.stringify(environment.ctx);
        return new Nunjucks__default['default'].runtime.SafeString(str);
    };
  }

  function register$j(env) {
    env.addExtension("image", new handler$j(env));
  }
  function handler$j(env) {
    this.tags = ['image'];

    this.parse = function (parser, nodes, lexer) {
        var tok = parser.nextToken();

        var args = parser.parseSignature(null, true);
        parser.advanceAfterBlockEnd(tok.value);
        //var body = parser.parseUntilBlocks('end_image');
        let body = null;
        //parser.advanceAfterBlockEnd();
        return new nodes.CallExtension(this, 'run', args, [body]);

    };

    this.run = function(environment) {
      
        let str = JSON.stringify(environment.ctx);
        return new Nunjucks__default['default'].runtime.SafeString(str);
    };
  }

  function register$k(env) {
    env.addExtension("language_switcher", new handler$k(env));
  }
  function handler$k(env) {
    this.tags = ['language_switcher'];

    this.parse = function (parser, nodes, lexer) {
        var tok = parser.nextToken();

        var args = parser.parseSignature(null, true);
        parser.advanceAfterBlockEnd(tok.value);
        //var body = parser.parseUntilBlocks('end_language_switcher');
        let body = null;
        //parser.advanceAfterBlockEnd();
        return new nodes.CallExtension(this, 'run', args, [body]);

    };

    this.run = function(environment) {
      
        let str = JSON.stringify(environment.ctx);
        return new Nunjucks__default['default'].runtime.SafeString(str);
    };
  }

  function register$l(env) {
    env.addExtension("linked_image", new handler$l(env));
  }
  function handler$l(env) {
    this.tags = ['linked_image'];

    this.parse = function (parser, nodes, lexer) {
        var tok = parser.nextToken();

        var args = parser.parseSignature(null, true);
        parser.advanceAfterBlockEnd(tok.value);
        //var body = parser.parseUntilBlocks('end_linked_image');
        let body = null;
        //parser.advanceAfterBlockEnd();
        return new nodes.CallExtension(this, 'run', args, [body]);

    };

    this.run = function(environment) {
      
        let str = JSON.stringify(environment.ctx);
        return new Nunjucks__default['default'].runtime.SafeString(str);
    };
  }

  function register$m(env) {
    env.addExtension("logo", new handler$m(env));
  }
  function handler$m(env) {
    this.tags = ['logo'];

    this.parse = function (parser, nodes, lexer) {
        var tok = parser.nextToken();

        var args = parser.parseSignature(null, true);
        parser.advanceAfterBlockEnd(tok.value);
        //var body = parser.parseUntilBlocks('end_logo');
        let body = null;
        //parser.advanceAfterBlockEnd();
        return new nodes.CallExtension(this, 'run', args, [body]);

    };

    this.run = function(environment) {
      
        let str = JSON.stringify(environment.ctx);
        return new Nunjucks__default['default'].runtime.SafeString(str);
    };
  }

  function register$n(env) {
    env.addExtension("menu", new handler$n(env));
  }
  function handler$n(env) {
    this.tags = ['menu'];

    this.parse = function (parser, nodes, lexer) {
        var tok = parser.nextToken();

        var args = parser.parseSignature(null, true);
        parser.advanceAfterBlockEnd(tok.value);
        //var body = parser.parseUntilBlocks('end_menu');
        let body = null;
        //parser.advanceAfterBlockEnd();
        return new nodes.CallExtension(this, 'run', args, [body]);

    };

    this.run = function(environment) {
      
        let str = JSON.stringify(environment.ctx);
        return new Nunjucks__default['default'].runtime.SafeString(str);
    };
  }

  function register$o(env) {
    env.addExtension("module_attribute", new handler$o(env));
  }
  function handler$o(env) {
    this.tags = ['module_attribute'];

    this.parse = function (parser, nodes, lexer) {
        var tok = parser.nextToken();

        var args = parser.parseSignature(null, true);
        parser.advanceAfterBlockEnd(tok.value);
        var body = parser.parseUntilBlocks('end_module_attribute');
        // let body = null;
        parser.advanceAfterBlockEnd();
        return new nodes.CallExtension(this, 'run', args, [body]);

    };

    this.run = function(environment) {
      
        let str = JSON.stringify(environment.ctx);
        return new Nunjucks__default['default'].runtime.SafeString(str);
    };
  }

  function register$p(env) {
    env.addExtension("module", new handler$p(env));
  }
  function handler$p(env) {
    this.tags = ['module'];

    this.parse = function (parser, nodes, lexer) {
        var tok = parser.nextToken();

        var args = parser.parseSignature(null, true);
        parser.advanceAfterBlockEnd(tok.value);
        //var body = parser.parseUntilBlocks('end_module');
        let body = null;
        //parser.advanceAfterBlockEnd();
        return new nodes.CallExtension(this, 'run', args, [body]);

    };

    this.run = function(environment) {
      
        let str = JSON.stringify(environment.ctx);
        return new Nunjucks__default['default'].runtime.SafeString(str);
    };
  }

  function register$q(env) {
    env.addExtension("page_footer", new handler$q(env));
  }
  function handler$q(env) {
    this.tags = ['page_footer'];

    this.parse = function (parser, nodes, lexer) {
        var tok = parser.nextToken();

        var args = parser.parseSignature(null, true);
        parser.advanceAfterBlockEnd(tok.value);
        //var body = parser.parseUntilBlocks('end_page_footer');
        let body = null;
        //parser.advanceAfterBlockEnd();
        return new nodes.CallExtension(this, 'run', args, [body]);

    };

    this.run = function(environment) {
      
        let str = JSON.stringify(environment.ctx);
        return new Nunjucks__default['default'].runtime.SafeString(str);
    };
  }

  function register$r(env) {
    env.addExtension("password_prompt", new handler$r(env));
  }
  function handler$r(env) {
    this.tags = ['password_prompt'];

    this.parse = function (parser, nodes, lexer) {
        var tok = parser.nextToken();

        var args = parser.parseSignature(null, true);
        parser.advanceAfterBlockEnd(tok.value);
        //var body = parser.parseUntilBlocks('end_password_prompt');
        let body = null;
        //parser.advanceAfterBlockEnd();
        return new nodes.CallExtension(this, 'run', args, [body]);

    };

    this.run = function(environment) {
      
        let str = JSON.stringify(environment.ctx);
        return new Nunjucks__default['default'].runtime.SafeString(str);
    };
  }

  function register$s(env) {
    env.addExtension("post_filter", new handler$s(env));
  }
  function handler$s(env) {
    this.tags = ['post_filter'];

    this.parse = function (parser, nodes, lexer) {
        var tok = parser.nextToken();

        var args = parser.parseSignature(null, true);
        parser.advanceAfterBlockEnd(tok.value);
        //var body = parser.parseUntilBlocks('end_post_filter');
        let body = null;
        //parser.advanceAfterBlockEnd();
        return new nodes.CallExtension(this, 'run', args, [body]);

    };

    this.run = function(environment) {
      
        let str = JSON.stringify(environment.ctx);
        return new Nunjucks__default['default'].runtime.SafeString(str);
    };
  }

  function register$t(env) {
    env.addExtension("post_listing", new handler$t(env));
  }
  function handler$t(env) {
    this.tags = ['post_listing'];

    this.parse = function (parser, nodes, lexer) {
        var tok = parser.nextToken();

        var args = parser.parseSignature(null, true);
        parser.advanceAfterBlockEnd(tok.value);
        //var body = parser.parseUntilBlocks('end_post_listing');
        let body = null;
        //parser.advanceAfterBlockEnd();
        return new nodes.CallExtension(this, 'run', args, [body]);

    };

    this.run = function(environment) {
      
        let str = JSON.stringify(environment.ctx);
        return new Nunjucks__default['default'].runtime.SafeString(str);
    };
  }

  function register$u(env) {
    env.addExtension("raw_html", new handler$u(env));
  }
  function handler$u(env) {
    this.tags = ['raw_html'];

    this.parse = function (parser, nodes, lexer) {
        var tok = parser.nextToken();

        var args = parser.parseSignature(null, true);
        parser.advanceAfterBlockEnd(tok.value);
        //var body = parser.parseUntilBlocks('end_raw_html');
        let body = null;
        //parser.advanceAfterBlockEnd();
        return new nodes.CallExtension(this, 'run', args, [body]);

    };

    this.run = function(environment) {
      
        let str = JSON.stringify(environment.ctx);
        return new Nunjucks__default['default'].runtime.SafeString(str);
    };
  }

  function register$v(env) {
    env.addExtension("related_blog_posts", new handler$v(env));
  }
  function handler$v(env) {
    this.tags = ['related_blog_posts'];

    this.parse = function (parser, nodes, lexer) {
        var tok = parser.nextToken();

        var args = parser.parseSignature(null, true);
        parser.advanceAfterBlockEnd(tok.value);
        //var body = parser.parseUntilBlocks('end_related_blog_posts');
        let body = null;
        //parser.advanceAfterBlockEnd();
        return new nodes.CallExtension(this, 'run', args, [body]);

    };

    this.run = function(environment) {
      
        let str = JSON.stringify(environment.ctx);
        return new Nunjucks__default['default'].runtime.SafeString(str);
    };
  }

  function register$w(env) {
    env.addExtension("require_css", new handler$w(env));
  }
  function handler$w(env) {
    this.tags = ['require_css'];

    this.parse = function (parser, nodes, lexer) {
        var tok = parser.nextToken();

        var args = parser.parseSignature(null, true);
        parser.advanceAfterBlockEnd(tok.value);
        var body = parser.parseUntilBlocks('end_require_css');
        // let body = null;
        parser.advanceAfterBlockEnd();
        return new nodes.CallExtension(this, 'run', args, [body]);

    };

    this.run = function(environment) {
      
        let str = JSON.stringify(environment.ctx);
        return new Nunjucks__default['default'].runtime.SafeString(str);
    };
  }

  function register$x(env) {
    env.addExtension("require_head", new handler$x(env));
  }
  function handler$x(env) {
    this.tags = ['require_head'];

    this.parse = function (parser, nodes, lexer) {
        var tok = parser.nextToken();

        var args = parser.parseSignature(null, true);
        parser.advanceAfterBlockEnd(tok.value);
        var body = parser.parseUntilBlocks('end_require_head');
        // let body = null;
        parser.advanceAfterBlockEnd();
        return new nodes.CallExtension(this, 'run', args, [body]);

    };

    this.run = function(environment) {
      
        let str = JSON.stringify(environment.ctx);
        return new Nunjucks__default['default'].runtime.SafeString(str);
    };
  }

  function register$y(env) {
    env.addExtension("require_js", new handler$y(env));
  }
  function handler$y(env) {
    this.tags = ['require_js'];

    this.parse = function (parser, nodes, lexer) {
        var tok = parser.nextToken();

        var args = parser.parseSignature(null, true);
        parser.advanceAfterBlockEnd(tok.value);
        var body = parser.parseUntilBlocks('end_require_js');
        // let body = null;
        parser.advanceAfterBlockEnd();
        return new nodes.CallExtension(this, 'run', args, [body]);

    };

    this.run = function(environment) {
      
        let str = JSON.stringify(environment.ctx);
        return new Nunjucks__default['default'].runtime.SafeString(str);
    };
  }

  function register$z(env) {
    env.addExtension("rich_text", new handler$z(env));
  }
  function handler$z(env) {
    this.tags = ['rich_text'];

    this.parse = function (parser, nodes, lexer) {
        var tok = parser.nextToken();

        var args = parser.parseSignature(null, true);
        parser.advanceAfterBlockEnd(tok.value);
        //var body = parser.parseUntilBlocks('end_rich_text');
        let body = null;
        //parser.advanceAfterBlockEnd();
        return new nodes.CallExtension(this, 'run', args, [body]);

    };

    this.run = function(environment) {
      
        let str = JSON.stringify(environment.ctx);
        return new Nunjucks__default['default'].runtime.SafeString(str);
    };
  }

  function register$A(env) {
    env.addExtension("rss_listing", new handler$A(env));
  }
  function handler$A(env) {
    this.tags = ['rss_listing'];

    this.parse = function (parser, nodes, lexer) {
        var tok = parser.nextToken();

        var args = parser.parseSignature(null, true);
        parser.advanceAfterBlockEnd(tok.value);
        //var body = parser.parseUntilBlocks('end_rss_listing');
        let body = null;
        //parser.advanceAfterBlockEnd();
        return new nodes.CallExtension(this, 'run', args, [body]);

    };

    this.run = function(environment) {
      
        let str = JSON.stringify(environment.ctx);
        return new Nunjucks__default['default'].runtime.SafeString(str);
    };
  }

  function register$B(env) {
    env.addExtension("section_header", new handler$B(env));
  }
  function handler$B(env) {
    this.tags = ['section_header'];

    this.parse = function (parser, nodes, lexer) {
        var tok = parser.nextToken();

        var args = parser.parseSignature(null, true);
        parser.advanceAfterBlockEnd(tok.value);
        //var body = parser.parseUntilBlocks('end_section_header');
        let body = null;
        //parser.advanceAfterBlockEnd();
        return new nodes.CallExtension(this, 'run', args, [body]);

    };

    this.run = function(environment) {
      
        let str = JSON.stringify(environment.ctx);
        return new Nunjucks__default['default'].runtime.SafeString(str);
    };
  }

  function register$C(env) {
    env.addExtension("simple_menu", new handler$C(env));
  }
  function handler$C(env) {
    this.tags = ['simple_menu'];

    this.parse = function (parser, nodes, lexer) {
        var tok = parser.nextToken();

        var args = parser.parseSignature(null, true);
        parser.advanceAfterBlockEnd(tok.value);
        //var body = parser.parseUntilBlocks('end_simple_menu');
        let body = null;
        //parser.advanceAfterBlockEnd();
        return new nodes.CallExtension(this, 'run', args, [body]);

    };

    this.run = function(environment) {
      
        let str = JSON.stringify(environment.ctx);
        return new Nunjucks__default['default'].runtime.SafeString(str);
    };
  }

  function register$D(env) {
    env.addExtension("social_sharing", new handler$D(env));
  }
  function handler$D(env) {
    this.tags = ['social_sharing'];

    this.parse = function (parser, nodes, lexer) {
        var tok = parser.nextToken();

        var args = parser.parseSignature(null, true);
        parser.advanceAfterBlockEnd(tok.value);
        //var body = parser.parseUntilBlocks('end_social_sharing');
        let body = null;
        //parser.advanceAfterBlockEnd();
        return new nodes.CallExtension(this, 'run', args, [body]);

    };

    this.run = function(environment) {
      
        let str = JSON.stringify(environment.ctx);
        return new Nunjucks__default['default'].runtime.SafeString(str);
    };
  }

  function register$E(env) {
    env.addExtension("space", new handler$E(env));
  }
  function handler$E(env) {
    this.tags = ['space'];

    this.parse = function (parser, nodes, lexer) {
        var tok = parser.nextToken();

        var args = parser.parseSignature(null, true);
        parser.advanceAfterBlockEnd(tok.value);
        //var body = parser.parseUntilBlocks('end_space');
        let body = null;
        //parser.advanceAfterBlockEnd();
        return new nodes.CallExtension(this, 'run', args, [body]);

    };

    this.run = function(environment) {
      
        let str = JSON.stringify(environment.ctx);
        return new Nunjucks__default['default'].runtime.SafeString(str);
    };
  }

  function register$F(env) {
    env.addExtension("text", new handler$F(env));
  }
  function handler$F(env) {
    this.tags = ['text'];

    this.parse = function (parser, nodes, lexer) {
        var tok = parser.nextToken();

        var args = parser.parseSignature(null, true);
        parser.advanceAfterBlockEnd(tok.value);
        //var body = parser.parseUntilBlocks('end_text');
        let body = null;
        //parser.advanceAfterBlockEnd();
        return new nodes.CallExtension(this, 'run', args, [body]);

    };

    this.run = function(environment) {
      
        let str = JSON.stringify(environment.ctx);
        return new Nunjucks__default['default'].runtime.SafeString(str);
    };
  }

  function register$G(env) {
    env.addExtension("textarea", new handler$G(env));
  }
  function handler$G(env) {
    this.tags = ['textarea'];

    this.parse = function (parser, nodes, lexer) {
        var tok = parser.nextToken();

        var args = parser.parseSignature(null, true);
        parser.advanceAfterBlockEnd(tok.value);
        //var body = parser.parseUntilBlocks('end_textarea');
        let body = null;
        //parser.advanceAfterBlockEnd();
        return new nodes.CallExtension(this, 'run', args, [body]);

    };

    this.run = function(environment) {
      
        let str = JSON.stringify(environment.ctx);
        return new Nunjucks__default['default'].runtime.SafeString(str);
    };
  }

  function register$H(env) {
    env.addExtension("video_player", new handler$H(env));
  }
  function handler$H(env) {
    this.tags = ['video_player'];

    this.parse = function (parser, nodes, lexer) {
        var tok = parser.nextToken();

        var args = parser.parseSignature(null, true);
        parser.advanceAfterBlockEnd(tok.value);
        //var body = parser.parseUntilBlocks('end_video_player');
        let body = null;
        //parser.advanceAfterBlockEnd();
        return new nodes.CallExtension(this, 'run', args, [body]);

    };

    this.run = function(environment) {
      
        let str = JSON.stringify(environment.ctx);
        return new Nunjucks__default['default'].runtime.SafeString(str);
    };
  }

  function register$I(env) {
    env.addExtension("widget_attribute", new handler$I(env));
  }
  function handler$I(env) {
    this.tags = ['widget_attribute'];

    this.parse = function (parser, nodes, lexer) {
        var tok = parser.nextToken();

        var args = parser.parseSignature(null, true);
        parser.advanceAfterBlockEnd(tok.value);
        var body = parser.parseUntilBlocks('end_widget_attribute');
        // let body = null;
        parser.advanceAfterBlockEnd();
        return new nodes.CallExtension(this, 'run', args, [body]);

    };

    this.run = function(environment) {
      
        let str = JSON.stringify(environment.ctx);
        return new Nunjucks__default['default'].runtime.SafeString(str);
    };
  }

  function register$J(env) {
    env.addExtension("widget_block", new handler$J(env));
  }
  function handler$J(env) {
    this.tags = ['widget_block'];

    this.parse = function (parser, nodes, lexer) {
        var tok = parser.nextToken();

        var args = parser.parseSignature(null, true);
        parser.advanceAfterBlockEnd(tok.value);
        var body = parser.parseUntilBlocks('end_widget_block');
        // let body = null;
        parser.advanceAfterBlockEnd();
        return new nodes.CallExtension(this, 'run', args, [body]);

    };

    this.run = function(environment) {
      
        let str = JSON.stringify(environment.ctx);
        return new Nunjucks__default['default'].runtime.SafeString(str);
    };
  }

  function register$K(env) {
    env.addExtension("widget_container", new handler$K(env));
  }
  function handler$K(env) {
    this.tags = ['widget_container'];

    this.parse = function (parser, nodes, lexer) {
        var tok = parser.nextToken();

        var args = parser.parseSignature(null, true);
        parser.advanceAfterBlockEnd(tok.value);
        var body = parser.parseUntilBlocks('end_widget_container');
        parser.advanceAfterBlockEnd();
        return new nodes.CallExtension(this, 'run', args, [body]);

    };

    this.run = function(environment) {
        let str = JSON.stringify(environment.ctx);
        return new Nunjucks.runtime.SafeString(str);
    };
  }

  function configure(env, hubdb, config) {
    
    register(env);
    register$1(env);
    register$2(env);
    register$3(env);
    register$4(env);
    register$5(env);
    register$6(env);
    register$7(env);
    register$8(env);
    register$9(env);
    register$a(env);
    register$b(env);
    register$c(env);
    register$d(env);
    register$e(env);
    register$f(env);
    register$g(env);
    register$h(env);
    register$i(env);
    register$j(env);
    register$k(env);
    register$l(env);
    register$m(env);
    register$n(env);
    register$o(env);
    register$p(env);
    register$q(env);
    register$r(env);
    register$s(env);
    register$t(env);
    register$u(env);
    register$v(env);
    register$w(env);
    register$x(env);
    register$y(env);
    register$z(env);
    register$A(env);
    register$B(env);
    register$C(env);
    register$D(env);
    register$E(env);
    register$F(env);
    register$G(env);
    register$H(env);
    register$I(env);
    register$J(env);
    register$K(env);
  }

  function register$L(env) {
    env.addGlobal("blog_all_posts_url", handler$L);
  }
      
  function handler$L(selected_blog) {
    return `<a href="http://www.hubspot.com/marketing/all">All Marketing blog posts</a>`;
  }

  function register$M(env) {
    env.addGlobal("blog_author_url", handler$M);
  }
      
  function handler$M(selected_blog, author_slug) {
    return `<a href="http://blog.hubspot.com/marketing/author/brian-halligan">Brian Halligan</a>`;
  }

  function register$N(env) {
    env.addGlobal("blog_authors", handler$N);
  }
      
  function handler$N(selected_blog, limit) {
      return ['Author 1', 'Author 2', 'Author 3'];
  }

  function register$O(env) {
    env.addGlobal("blog_by_id", handler$O);
  }
      
  function handler$O(id) {
    return {
      absolute_url: 'http://blog.com',
      html_title: 'This is a blog title'
    }
  }

  function register$P(env) {
    env.addGlobal("blog_page_link", handler$P);
  }
      
  function handler$P(page) {
    return `http://designers.hubspot.com/blog/page/${page}`;
  }

  function register$Q(env) {
    env.addGlobal("blog_popular_posts", handler$Q);
  }
      
  function handler$Q(selected_blog, limit, tag_slug, time_frame) {

    return [{
      name: 'Title 1'
    }, {name: 'Title 2'}]

  }

  function register$R(env) {
    env.addGlobal("blog_post_archive_url", handler$R);
  }
      
  function handler$R(selected_blog, year, month, day) {

    return `http://blog.hubspot.com/marketing/archive/${year}/${ month }/${ day }`;
  }

  function register$S(env) {
    env.addGlobal("blog_recent_author_posts", handler$S);
  }
      
  function handler$S(selected_blog, author_slug, limit) {

    return [{
      title: 'Title 1'
    }]

  }

  function register$T(env) {
    env.addGlobal("blog_recent_posts", handler$T);
  }
      
  function handler$T(selected_blog, limit) {

    return [{
      title: 'title 1'
    }]
  }

  function register$U(env) {
    env.addGlobal("blog_recent_tag_posts", handler$U);
  }
      
  function handler$U(selected_blog, tag_slug, limit) {

    return [{
      title: 'Post 1'
    }]
  }

  function register$V(env) {
    env.addGlobal("blog_recent_topic_posts", handler$V);
  }
      
  function handler$V(selected_blog, topic_slug, limit) {
    return [{title: 'title 1'}]
  }

  function register$W(env) {
    env.addGlobal("blog_tag_url", handler$W);
  }
      
  function handler$W(selected_blog, tag_slug) {

    return `http://blog.hubspot.com/marketing/tag/inbound-marketing`;
  }

  function register$X(env) {
    env.addGlobal("blog_tags", handler$X);
  }
      
  function handler$X(selected_blog, limit) {

    return [{ slug: 'slugfortag', title: 'tag titel'}]
  }

  function register$Y(env) {
    env.addGlobal("blog_total_post_count", handler$Y);
  }
      
  function handler$Y(selected_blog) {
    return 2;
  }

  function register$Z(env) {
    env.addGlobal("color_variant", handler$Z);
  }
      
  function handler$Z(base_color, brightness_offset) {
    return '#' + base_color.replace(/^#/, '').replace(/../g, color => ('0'+Math.min(255, Math.max(0, parseInt(color, 16) + brightness_offset)).toString(16)).substr(-2));
  }

  function register$_(env) {
    env.addGlobal("content_by_id", handler$_);
  }
      
  function handler$_(id) {
    return {
      title: 'Content title'
    }

  }

  function register$$(env) {
    env.addGlobal("content_by_ids", handler$$);
  }
      
  function handler$$(ids) {

    return [
      {title: 'page title'}
    ]
  }

  function register$10(env) {
    env.addGlobal("crm_associations", handler$10);
  }
      
  function handler$10(id, association_category, association_definition_id, query, properties, formatting) {

    return {"has_more":"true", "offset":3, "total": 203, "results": [{"firstname": "Aimee", "id": "905", "email": "abanks@company.com"}]};
  }

  function register$11(env) {
    env.addGlobal("crm_object", handler$11);
  }
      
  function handler$11(object_type, query_or_object_instance_id, properties, formatting) {
    return 'crm_object not implemented yet';
  }

  function register$12(env) {
    env.addGlobal("crm_objects", handler$12);
  }
      
  function handler$12(object_type, query_or_list_of_object_ids, properties, formatting) {

    return ["not implemented yet"];
  }

  function register$13(env) {
    env.addGlobal("cta", (guid, align_opt) => handler$13(env, guid, align_opt));
  }
      
  function handler$13(env, guid, align_opt) {
    return env.getCTAManager().render(guid, align_opt);
  }

  function register$14(env) {
    env.addGlobal("datetimeformat", handler$14);
  }
      
  function handler$14(var_attr, new_format, timezone = null) {
    

    let strftimeUTC = strftime__default['default'].timezone(0);

    const parsedDate = dateFns.parseISO(var_attr);

    return strftimeUTC(new_format, parsedDate);
  }

  function register$15(env) {
    env.addGlobal("file_by_id", handler$15);
  }
      
  function handler$15(file_id) {

    return {};
  }

  function register$16(env) {
    env.addGlobal("geo_distance", handler$16);
  }
  // FOR HUBDB
  function handler$16(point1, point2_lat, point2_long, units) {


  }

  function register$17(env) {
    env.addGlobal("get_asset_url", handler$17);
  }
      
  function handler$17(path) {
    return path;
  }

  function register$18(env) {
    env.addGlobal("get_public_template_url_by_id", handler$18);
  }
      
  function handler$18(template_id) {


  }

  function register$19(env) {
    env.addGlobal("hubdb_table_column", handler$19);
  }
      
  function handler$19(table_id, column) {


  }

  function register$1a(env) {
    env.addGlobal("hubdb_table_row", handler$1a);
  }
      
  function handler$1a(table_id, row_id) {


  }

  function register$1b(env) {
    env.addGlobal("hubdb_table_rows", (table_id, query) => handler$1b(env, table_id, query));
  }
      
  function handler$1b(env, table_id, query) {
    const res = env.getHubDB().find(table_id, query);

    return res;
  }

  function register$1c(env) {
    env.addGlobal("hubdb_table", handler$1c);
  }
      
  function handler$1c(table_id) {


  }

  function register$1d(env) {
    env.addGlobal("locale_name", handler$1d);
  }
      
  function handler$1d(language_code, target_language_code) {
    const languageNames = new Intl.DisplayNames([target_language_code], {type: 'language'});
    return languageNames.of(language_code);}

  function register$1e(env) {
    env.addGlobal("menu", (menu_id_or_menu_name, root_type, root_key) => handler$1e(env, menu_id_or_menu_name));
  }
      
  function handler$1e(env, menu_id_or_menu_name, root_type, root_key) { 

    const menus = env.getMenuManager();
    if (isNaN(menu_id_or_menu_name)) {
      return menus.getByName(menu_id_or_menu_name);
    }
    return menus.getById(menu_id_or_menu_name);
  }

  function register$1f(env) {
    env.addGlobal("module_asset_url", handler$1f);
  }
      
  function handler$1f(name) {
    return `https://cdn2.hubspot.net/hubfs/6178146/${ name }`;
  }

  function register$1g(env) {
    env.addGlobal("personalization_token", handler$1g);
  }
      
  function handler$1g(expression, default_attr) {
    return default_attr;
  }

  function register$1h(env) {
    env.addGlobal("postal_location", handler$1h);
  }
      
  function handler$1h(postal_code, country_code) {
    return {
      latitude: 42.3647,
      longitude: -71.1042
    }
  }

  function register$1i(env) {
    env.addGlobal("require_css", ( url, render_options ) => handler$1i(env, url, render_options));
  }
      
  function handler$1i(env, url, render_options) {
      return env.addStylesheet(url, render_options);
  }

  function register$1j(env) {
    env.addGlobal("require_js", (url, render_options) => handler$1j(env, url, render_options));
  }


  function handler$1j(env, url, render_options) {
    return env.addScript(url, render_options);
  }

  function register$1k(env) {
    env.addGlobal("resize_image_url", handler$1k);
  }
      
  function handler$1k(url, width, height, length, upscale, upsize) {
    return `${ url }?length=${ length }&name=img.jpg`;
  }

  function register$1l(env) {
    env.addGlobal("set_response_code", handler$1l);
  }
      
  function handler$1l(code) {

    // Doesn't need to do anything.

  }

  function register$1m(env) {
    env.addGlobal("to_local_time", handler$1m);
  }
      
  function handler$1m(date) {


  }

  function register$1n(env) {
    env.addGlobal("today", handler$1n);
  }
  // TODO: handle timezone, extract to a shared lib and make sure format is correct!
  function handler$1n(timezone) {
    function today() {
      this.datetime = new Date();
    }

    today.prototype.plusDays = function(num) {
      return dateFns.addDays(this.datetime, num);
    };

    today.prototype.toString = function() {
      return dateFns.formatISO(this.datetime);
    };

    
    return new today();
  }

  function register$1o(env) {
    env.addGlobal("topic_cluster_by_content_id", handler$1o);
  }
      
  function handler$1o(content_id) {


  }

  function register$1p(env) {
    env.addGlobal("truncate", handler$1p);
  }
      
  function handler$1p(s, length, killwords, end = '...') {

    if (s.length <= length) {
      return s;
    }

    if (killwords) {
      return s.substr(0, length) + end;
    }

    return s.substr(0, s.lastIndexOf(' ', length)) + end;
  }

  function register$1q(env) {
    env.addGlobal("type", handler$1q);
  }
      
  function handler$1q(input) {

    let types = {
      'string' : 'str',
      'boolean': 'bool',
      'array': 'array',
      'number': 'int',
    };
    return types[typeof input];
  }

  function register$1r(env) {
    env.addGlobal("unixtimestamp", handler$1r);
  }
      
  function handler$1r(var_attr) {
    return Math.floor(new Date().getTime() / 1000);
  }

  function register$1s(env) {
    env.addGlobal("video_metadata_by_player_id", handler$1s);
  }
      
  function handler$1s(request) {


  }

  function register$1t(env) {
    env.addGlobal("video_thumbnail", handler$1t);
  }
      
  function handler$1t(request) {


  }

  function configure$1(env, config) {
    
    register$L(env);
    register$M(env);
    register$N(env);
    register$O(env);
    register$P(env);
    register$Q(env);
    register$R(env);
    register$S(env);
    register$T(env);
    register$U(env);
    register$V(env);
    register$W(env);
    register$X(env);
    register$Y(env);
    register$Z(env);
    register$_(env);
    register$$(env);
    register$10(env);
    register$11(env);
    register$12(env);
    register$13(env);
    register$14(env);
    register$15(env);
    register$16(env);
    register$17(env);
    register$18(env);
    register$19(env);
    register$1a(env);
    register$1b(env);
    register$1c(env);
    register$1d(env);
    register$1e(env);
    register$1f(env);
    register$1g(env);
    register$1h(env);
    // range_init(env, config);
    register$1i(env);
    register$1j(env);
    register$1k(env);
    register$1l(env);
    register$1m(env);
    register$1n(env);
    register$1o(env);
    register$1p(env);
    register$1q(env);
    register$1r(env);
    register$1s(env);
    register$1t(env);
  }

  function register$1u(env) {
    env.addFilter("add", handler$1u);
  }

  function handler$1u(input, addend) {
    return input + addend;
  }

  function register$1v(env) {
    env.addFilter("attr", handler$1v);
  }

  function handler$1v(input, name) {
    return input[name];
  }

  function register$1w(env) {
    env.addFilter("between_times", handler$1w);
  }

  // TODO: implement unit
  function handler$1w(input, end, unit) {
    const res = dateFns.intervalToDuration({ start: input, end: end}, unit);

    if (!res[unit]) {
      throw Error("Unit not implemented yet.")
    }

    return res[unit];

  }

  function register$1x(env) {
    env.addFilter("bool", handler$1x);
  }

  function handler$1x(input) {
    return input.toLowerCase() == 'true' ? true : false;
  }

  function register$1y(env) {
    env.addFilter("convert_rgb", handler$1y);
  }

  function handler$1y(hex) {

    // https://stackoverflow.com/questions/21646738/convert-hex-to-rgba
    let c;
    if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
        c= hex.substring(1).split('');
        if(c.length== 3){
            c= [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c= '0x'+c.join('');
        return [(c>>16)&255, (c>>8)&255, c&255].join(',');
    }
    throw new Error('Bad Hex');
  }

  function register$1z(env) {
    env.addFilter("count", handler$1z);
  }

  function handler$1z(input) {
    return input.length;
  }

  function register$1A(env) {
    env.addFilter("cut", handler$1A);
  }

  function handler$1A(input, to_remove) {
    return input.replace(to_remove, '');
  }

  function register$1B(env) {
    env.addFilter("datetimeformat", handler$1B);
  }

  function handler$1B(input, format, timezone, locale) {


  }

  function register$1C(env) {
    env.addFilter("default", handler$1C);
  }

  /**
   * Not exactly correct.
   * @param {*} input 
   * @param {*} default_value 
   * @param {*} truthy 
   */
  function handler$1C(input, default_value, truthy) {

    return typeof input !== 'undefined' ? (truthy && !input ? default_value : input) : default_value;
    
  }

  function register$1D(env) {
    env.addFilter("difference", handler$1D);
  }

  function handler$1D(input, list) {

  }

  function register$1E(env) {
    env.addFilter("divide", handler$1E);
  }

  function handler$1E(input, divisor) {
    return parseFloat(input) / parseFloat(divisor);
  }

  function register$1F(env) {
    env.addFilter("divisible", handler$1F);
  }

  function handler$1F(input, divisor) {


  }

  function register$1G(env) {
    env.addFilter("escape_jinjava", handler$1G);
  }

  function handler$1G(input) {


  }

  function register$1H(env) {
    env.addFilter("escapejs", handler$1H);
  }

  function handler$1H(input) {

  }

  function register$1I(env) {
    env.addFilter("escapejson", handler$1I);
  }

  function handler$1I(input) {
    return JSON.stringify(input);
  }

  function register$1J(env) {
    env.addFilter("filesizeformat", handler$1J);
  }

  function handler$1J(input, binary) {


  }

  function register$1K(env) {
    env.addFilter("format_currency", handler$1K);
  }

  function handler$1K(input, locale, currency_code, use_default_decimal_digits) {


  }

  function register$1L(env) {
    env.addFilter("format", handler$1L);
  }

  function handler$1L(input, args) {


  }

  function register$1M(env) {
    env.addFilter("fromjson", handler$1M);
  }

  function handler$1M(input) {
    return JSON.parse(input);
  }

  function register$1N(env) {
    env.addFilter("geo_distance", handler$1N);
  }

  function handler$1N(input, point1, point2_lat, point2_long, units) {


  }

  function register$1O(env) {
    env.addFilter("int", handler$1O);
  }

  function handler$1O(input, default_attr) {
    return parseInt(input) || default_attr;
  }

  function register$1P(env) {
    env.addFilter("intersect", handler$1P);
  }

  function handler$1P(input, list) {


  }

  function register$1Q(env) {
    env.addFilter("ipaddr", handler$1Q);
  }

  function handler$1Q(input, function_attr) {
    // Thanks to https://ipregex.com/
    let ipReg = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    return new RegExp(ipReg).test(input);
  }

  function register$1R(env) {
    env.addFilter("length", handler$1R);
  }

  function handler$1R(input) {


  }

  function register$1S(env) {
    env.addFilter("log", handler$1S);
  }

  function handler$1S(input, base) {


  }

  function register$1T(env) {
    env.addFilter("map", (input, attribute, add) => handler$1T(input, attribute, add, env));
  }

  function handler$1T(input, attribute, add, env) {
    const fn = env.getNunjucksEnv().getFilter(attribute);
    return input.map(fn);
  }

  function register$1U(env) {
    env.addFilter("md5", handler$1U);
  }

  function handler$1U(input) {


  }

  function register$1V(env) {
    env.addFilter("minus_time", handler$1V);
  }

  function handler$1V(input, diff, unit) {
    return dateFns.sub(input, {[unit]: diff} );
  }

  function register$1W(env) {
    env.addFilter("multiply", handler$1W);
  }

  function handler$1W(input, multiplier) {
    return input * multiplier;
  }

  function register$1X(env) {
    env.addFilter("plus_time", handler$1X);
  }

  function handler$1X(input, diff, unit) {
    return dateFns.add(input, {[unit]: diff} );
  }

  function register$1Y(env) {
    env.addFilter("pprint", handler$1Y);
  }

  function handler$1Y(input) {
    return JSON.stringify(input);
  }

  function register$1Z(env) {
    env.addFilter("regex_replace", handler$1Z);
  }

  function handler$1Z(input, regex, replacement) {
    const regexp = new RegExp(regex, 'g');
    return input.replace(regexp, replacement);
  }

  function register$1_(env) {
    env.addFilter("render", handler$1_);
  }

  function handler$1_(input) {


  }

  function register$1$(env) {
    env.addFilter("root", handler$1$);
  }

  function handler$1$(input) {
    return Math.sqrt(input);
  }

  function register$20(env) {
    env.addFilter("select", handler$20);
  }

  function handler$20(input, exp_test) {


  }

  function register$21(env) {
    env.addFilter("shuffle", handler$21);
  }

  function handler$21(input) {


  }

  function register$22(env) {
    env.addFilter("sort", handler$22);
  }

  function handler$22(input, reverse, case_sensitive, attribute) {


  }

  function register$23(env) {
    env.addFilter("split", handler$23);
  }

  function handler$23(input, separator, limit) {
    return input.split(input, separator);
  }

  function register$24(env) {
    env.addFilter("strtotime", handler$24);
  }

  function handler$24(input, datetimeFormat) {

    // // need to sort this out to handle java modifiers, we dont really need to do this.
    // const check = strftime(input, datetimeFormat);

    // if (!check) {
    //   return Error('Invalid datetimeFormat');
    // }

    //                                            ????
    // i think this should handle most formats. \__o__/
    return dateFns.parseISO(input);
  }

  function register$25(env) {
    env.addFilter("symmetric_difference", handler$25);
  }

  function handler$25(input, list) {


  }

  function register$26(env) {
    env.addFilter("tojson", handler$26);
  }

  function handler$26(input) {
    return new Nunjucks__default['default'].runtime.SafeString(JSON.stringify(input));
  }

  function register$27(env) {
    env.addFilter("truncatehtml", handler$27);
  }

  function handler$27(input, length, end = "...", breakword = false) {
    return new Nunjucks__default['default'].runtime.SafeString(clip__default['default'](input, length, { html: true, breakWords: breakword, indicator: end }));
  }

  function register$28(env) {
    env.addFilter("union", handler$28);
  }

  function handler$28(input, list) {


  }

  function register$29(env) {
    env.addFilter("unique", handler$29);
  }

  function handler$29(input, attr) {

    // array of objects?
    if (typeof input[0] === 'object') {
      var filtered = {};
      input.filter(function(entry) {
          if (filtered[attr]) {
              return false;
          }
          filtered[attr] = true;
          return true;
      });

      
      return filtered;
    }

    // otherwise unique string

    return [... new Set(input)];
  }

  function register$2a(env) {
    env.addFilter("unixtimestamp", handler$2a);
  }

  function handler$2a(input) {
    return dateFns.getUnixTime(dateFns.parseISO(input));
  }

  function register$2b(env) {
    env.addFilter("wordwrap", handler$2b);
  }

  function handler$2b(input, width, break_long_words) {


  }

  function register$2c(env) {
    env.addFilter("xmlattr", handler$2c);
  }

  function handler$2c(input, autospace) {


  }

  function register$2d(env) {
    env.addFilter("float", handler$2d);
  }

  function handler$2d(input) {
    return parseFloat(input);
  }

  function register$2e(env) {
    env.addFilter("upper", handler$2e);
  }

  function handler$2e(input) {
    return input.toUpperCase();
  }

  function register$2f(env) {
    env.addFilter("random", handler$2f);
  }

  function handler$2f(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function register$2g(env) {
    env.addFilter("groupby", handler$2g);
  }

  function handler$2g(input, group_by_key) {
    let groups = [];
    for (const [key, val] of Object.entries(input)) {
      const index = groups.findIndex( g => g.grouper === val[group_by_key] );

      if (groups[index]) {
        groups[index].list.push(val);
      } else {
        groups.push({
          grouper: val[group_by_key],
          list: [val]
        });
      }
      
    }

    return groups;
  }

  function register$2h(env) {
    env.addFilter("list", handler$2h);
  }

  function handler$2h(input) {

    return list(input);

  }
    

  function list(val) {
   
    if (lib.isArray(val)) {
      return val;
    }

    if (!isNaN(val)) {
      return [val];
    }

    if (lib.isString(val)) {
      return val.split('');
    }

    if (lib.isObject(val)) {
      return Object.entries(val || {}).map(([key, val])  => ({ key, value }));
    }


    throw new lib.TemplateError('list filter: type not iterable');
    
  }

  function configure$2(env, config) {
    
    register$1u(env);
    register$1v(env);
    register$1w(env);
    register$1x(env);
    register$1y(env);
    register$1z(env);
    register$1A(env);
    register$1B(env);
    register$1C(env);
    register$1D(env);
    register$1E(env);
    register$1F(env);
    register$1G(env);
    register$1H(env);
    register$1I(env);
    register$1J(env);
    register$1K(env);
    register$1L(env);
    register$1M(env);
    register$1N(env);
    register$1O(env);
    register$1P(env);
    register$1Q(env);
    register$1R(env);
    register$1S(env);
    register$1T(env);
    register$1U(env);
    register$1V(env);
    register$1W(env);
    register$1X(env);
    register$1Y(env);
    register$1Z(env);
    register$1_(env);
    register$1$(env);
    register$20(env);
    register$21(env);
    register$22(env);
    register$23(env);
    register$24(env);
    register$25(env);
    register$26(env);
    register$27(env);
    register$28(env);
    register$29(env);
    register$2a(env);
    register$2b(env);
    register$2c(env);
    register$2d(env);
    register$2e(env);
    register$2f(env);
    register$2g(env);
    register$2h(env);
  }

  /**
   * 
   */
  class HublEnvironment {
    constructor(env, pageManager, hubdbManager, ctaManager, menuManager) {
      this.nunjucksEnv = env;

      // Store things like standard_page_includes.
      this.globalStorage = {};

      this.hubdbManager = hubdbManager;
      this.ctaManager = ctaManager;
      this.menuManager = menuManager;
      this.pageManager = pageManager;

      this.stylesheets = [];
      this.scripts = [];
      
      this.setupExtensions({});

      this.globalVariables = {
        // Add some replacement tokens. This is a little cheeky hack.
        standard_footer_includes: '!!STANDARD_FOOTER_NCLUDES!!',
        standard_header_includes: '!!STANDARD_HEADER_INCLUDES!!'
      };
    }

    getHubDB() {
      return this.hubdbManager;
    }

    getCTAManager() {
      return this.ctaManager;
    }
    getMenuManager() {
      return this.menuManager;
    }

    getPageManager() {
      return this.pageManager;
    }

    addStylesheet(href, attributes) {
      // open to XSS, but we're allowing this as it's user controlled. TODO: escape
      const attrs = attributes ? Object.entries(attributes).map((key, val) => `${key}="${ val }"`) : [];
      this.stylesheets.push(`<link rel="stylesheet" href="${ href }" ${ attrs.join(' ') } />`);
    }
    addScript(src, attributes) {
      // open to XSS, but we're allowing this as it's user controlled. TODO: escape
      const attrs = attributes ? Object.entries(attributes).map((key, val) => `${key}="${ val }"`) : [];
      this.stylesheets.push(`<script src="${ src }" ${ attrs.join(' ') } />`); 
    }

    /**
     * Parse a HubL snippet in the context of a module.
     * @param {*} string 
     * @param {*} variables 
     */
    renderModuleString(string, variables = {}) {
      return this.fixQuotes(this.nunjucksEnv.renderString(string, { 
        ...this.globalVariables, 
        module: variables,
        module_id: new Date().getTime() 
      }));
    }

    renderModule(file, variables = {}) {
      return this.fixQuotes(this.nunjucksEnv.render(file, {
        ...this.globalVariables,
        module: variables,
        module_id: new Date().getTime() 
      }));
    }

    /**
     * Can be used for strings.
     * @param {*} string 
     * @param {*} variables 
     */
    renderString(string, variables = {}) {
      return this.fixQuotes(this.nunjucksEnv.renderString(string, {
        ...this.globalVariables,
        ...variables
      })); 
    }

    /**
     * Render HubL snippet in context of a page.
     */
    renderPageString(string, variables = {}) {
      return this.fixQuotes(this.nunjucksEnv.renderString(string, {
        ...this.globalVariables,
        ...variables
      }));
    }

    /**
     * Allow Nujucks to be extended.
     */
    getNunjucksEnv() {
      return this.nunjucksEnv;
    }

    /**
     * To match hubl
     */
    fixQuotes(input) {

      input = input.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, "&");
      input = input.replace('!!STANDARD_FOOTER_INCLUDES!!', this.buildStandardFooterIncludes());
      input = input.replace('!!STANDARD_HEADER_INCLUDES!!', this.buildStandardHeaderIncludes());
      return input;
    }

    /**
     * Register everything.
     */
    setupExtensions(config) {
      configure(this);
      configure$1(this);
      configure$2(this);
    }

    addExtension(str, handler) {
      return this.nunjucksEnv.addExtension(str, handler);
    }
    addGlobal(str, handler) {
      return this.nunjucksEnv.addGlobal(str, handler);
    }
    addFilter(str, handler) {
      return this.nunjucksEnv.addFilter(str, handler);
    }

    buildStandardHeaderIncludes() {
      
      const module_css = '';
      return `
${ this.stylesheets.join("\n") }
${ module_css }
    `
    }

    buildStandardFooterIncludes() {
      const module_js = '';
      return `
      ${ module_js }
    `;
    }
  }

  class MenuManager {
    constructor(menus) {
      this.menus = menus;
      this.menusById = [];
      this.init();
    }

    init() {
      for (const menu of this.menus) {
        this.menusById[menu.id] = menu;
      }
    }

    getByName(name) {
      return this.menus.find(item => item.slug === name);
    }

    getAll() {
      return this.menus;
    }

    getById(id) {
      return this.menusById[id];
    }

  }

  class PageManager {
    constructor(pages) {
      this.activePage = null;
      this.pages = pages;
      this.request = {

      };
    }

    setActivePageById(id) {
      this.activePage = this.pages.find(page => page.content_id === id);
      return this.activePage;
    }
    
    setActivePageByPath(path) {
      this.activePage = this.pages.find(({ content }) => {

        // Homepage.
        if (path === '/' && content.absolute_url.substr(-1) === '/') {
          return true;
        }

        return path === content.absolute_url;
      });

      return this.activePage;
    }

    getThemeGlobals() {
      return { ...this.activePage, ...this.request };
    }

    getActivePageId() {
      return this.activePage.content_id;
    }

  }

  // Copy nunjuck
  var hublenv;

  // Setup a single instance.
  function configure$3(config) {
    let { pageManager, hubDBManager, ctaManager, menuManager, templatePath } = config || {};
    const isNode = typeof process === 'object' && process + '' === '[object process]';

    let fs;
    // In nodeJS.
    if (isNode) { 
      fs = new Nunjucks__default['default'].FileSystemLoader(templatePath ? templatePath : './');
    } else {
      fs = new Nunjucks__default['default'].WebLoader(templatePath ? templatePath : './'); 
    }
    
    const env = new Nunjucks__default['default'].Environment(fs);
    hublenv = new HublEnvironment(env, pageManager, hubDBManager, ctaManager, menuManager);
  }

  /**
   * Useful for rendering simple strings.
   * @param {*} content 
   * @param {*} ctx 
   */
  function renderString(content, ctx = {}) {
    if (!hublenv) {
      configure$3();
    }

    return hublenv.renderString(content, ctx);  
  }

  /**
   * Render in a module context. This still needs access to manager instances as lots of methods
   * require data from a datasource such as crm_*, hubdb_* and menu*
   * @param {*} content 
   * @param {*} ctx 
   */
  function renderModuleString(content, ctx = {}) {
    if (!hublenv) {
      configure$3();
    }

    // TODO: add module.id etc
    
    return hublenv.renderModuleString(content, ctx);  
  }


  /**
   * Render in a page context. This requires a page to be set, it must've been setup initially.
   * @param string path
   * @param {*} content 
   * @param {*} ctx 
   */
  function renderPageString(page, content, ctx = {}) {
    if (!hublenv) {
      configure$3();
    }

    const pageManager = hublenv.getPageManager();
    pageManager.setActivePageByPath(page);
    // Render string, but throw in the page variables.
    return hublenv.renderPageString(content, {...ctx, ...pageManager.getThemeGlobals()});
  }

  const Environment = HublEnvironment;

  exports.CtaManager = CtaManager;
  exports.Environment = Environment;
  exports.HubDbManager = HubDbManager;
  exports.MenuManager = MenuManager;
  exports.PageManager = PageManager;
  exports.configure = configure$3;
  exports.renderModuleString = renderModuleString;
  exports.renderPageString = renderPageString;
  exports.renderString = renderString;

  Object.defineProperty(exports, '__esModule', { value: true });

  return exports;

}({}, Nunjucks, dateFns, strftime, clip, lib));
