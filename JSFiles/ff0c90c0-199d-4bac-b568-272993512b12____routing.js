
document.executeOnce('/sincerity/classes/')
document.executeOnce('/sincerity/objects/')
document.executeOnce('/sincerity/templates/')
document.executeOnce('/sincerity/jvm/')
document.executeOnce('/restlet/')

var Prudence = Prudence || {}

importClass(com.threecrickets.sincerity.exception.SincerityException)

/**
 * Handles the bootstrapping of Prudence applications using a convenient DSL.
 * This library is meant to be used in the bootstrapping scripts of the
 * Sincerity Restlet skeleton. * 
 * 
 * @namespace
 * 
 * @author Tal Liron
 * @version 1.0
 */
Prudence.Routing = Prudence.Routing || function() {
	/** @exports Public as Prudence.Routing */
	var Public = {}
	
	Public.cleanUri = function(uri) {
		// No doubles
		uri = String(uri).replace(/\/\//g, '/')
		if ((uri == '') || (uri[0] != '/')) {
			// Always at the beginning
			uri = '/' + uri
		}
		/*
		if ((uri != '/') && (uri[uri.length - 1] != '/')) {
			// Always at the end
			uri += '/'
		}
		*/
		return uri
	}

	Public.cleanBaseUri = function(uri) {
		// No doubles
		uri = String(uri).replace(/\/\//g, '/')
		if ((uri == '') || (uri[0] != '/')) {
			// Always at the beginning
			uri = '/' + uri
		}
		var length = uri.length
		if ((length > 0) && (uri[length - 1] == '/')) {
			// No trailing slash
			uri = uri.substring(0, length - 1)
		}
		return uri
	}

	/**
	 * @class
	 * @name Prudence.Routing.Application
	 */
	Public.Application = Sincerity.Classes.define(function(Module) {
		/** @exports Public as Prudence.Routing.Application */
		var Public = {}
		
		/** @ignore */
		Public._construct = function() {
			this.root = Sincerity.Container.here
			this.settings = {}
			this.globals = {}
			this.sharedGlobals = {}
			this.hosts = {}
			this.routes = {}
			this.dispatchers = {}
			this.preheat = []
		}

		Public.create = function(component) {
			importClass(
				com.threecrickets.prudence.PrudenceApplication,
				com.threecrickets.prudence.PrudenceRouter,
				com.threecrickets.prudence.ApplicationTaskCollector,
				com.threecrickets.prudence.DelegatedStatusService,
				com.threecrickets.prudence.util.LoggingUtil,
				com.threecrickets.prudence.util.PreheatTask,
				org.restlet.resource.Finder,
				org.restlet.routing.Router,
				org.restlet.routing.Template,
				org.restlet.routing.Redirector,
				org.restlet.data.Reference,
				org.restlet.data.MediaType,
				java.util.concurrent.CopyOnWriteArrayList,
				java.util.concurrent.CopyOnWriteArraySet,
				java.io.File)
				
			this.component = component
				
			// Ensure settings exist
			this.settings.description = Sincerity.Objects.ensure(this.settings.description, {})
			this.settings.errors = Sincerity.Objects.ensure(this.settings.errors, {})
			this.settings.code = Sincerity.Objects.ensure(this.settings.code, {})
			this.settings.uploads = Sincerity.Objects.ensure(this.settings.code, {})
			this.settings.mediaTypes = Sincerity.Objects.ensure(this.settings.mediaTypes, {})

			// Sensible default settings
			this.settings.code.minimumTimeBetweenValidityChecks = Sincerity.Objects.ensure(this.settings.code.minimumTimeBetweenValidityChecks, 1000)
			this.settings.code.defaultDocumentName = Sincerity.Objects.ensure(this.settings.code.defaultDocumentName, 'default')
			this.settings.code.defaultExtension = Sincerity.Objects.ensure(this.settings.code.defaultExtension, 'js')
			this.settings.code.defaultLanguageTag = Sincerity.Objects.ensure(this.settings.code.defaultLanguageTag, 'javascript')
			this.settings.logger = Sincerity.Objects.ensure(this.settings.logger, this.root.name)
			
			this.settings.uploads.sizeThreshold = Sincerity.Objects.ensure(this.settings.uploads.sizeThreshold, 0)
			this.settings.uploads.root = Sincerity.Objects.ensure(this.settings.uploads.root, 'uploads')
			if (!(this.settings.uploads.root instanceof File)) {
				this.settings.uploads.root = new File(this.root, this.settings.uploads.root).absoluteFile
			}

			// Create instance
			this.context = component.context.createChildContext()
			this.instance = new PrudenceApplication(this.context)
			
			// Logger
			this.context.logger = LoggingUtil.getRestletLogger(this.settings.logger)
			
			// Description
			if (Sincerity.Objects.exists(this.settings.description.name)) {
				this.instance.name = this.settings.description.name
			}
			if (Sincerity.Objects.exists(this.settings.description.description)) {
				this.instance.description = this.settings.description.description
			}
			if (Sincerity.Objects.exists(this.settings.description.author)) {
				this.instance.author = this.settings.description.author
			}
			if (Sincerity.Objects.exists(this.settings.description.owner)) {
				this.instance.owner = this.settings.description.owner
			}

			println('Prudence application: "{0}"'.cast(this.instance.name))

			// Media types
			for (var extension in this.settings.mediaTypes) {
				var type = this.settings.mediaTypes[extension]
				if (Sincerity.Objects.isString(type)) {
					type = MediaType.valueOf(type)
				}
				this.instance.metadataService.addExtension(extension, type)
			}

			// Trailing-slash redirector
			this.addTrailingSlashRedirector = new Redirector(this.context, '{ri}/', Redirector.MODE_CLIENT_PERMANENT)

			// Default internal host to subdirectory name
			if (!Sincerity.Objects.exists(this.hosts.internal)) {
				this.hosts.internal = String(this.root.name)
			}
			
			// Attach to hosts
			println('  Hosts:')
			for (var name in this.hosts) {
				var host = Restlet.getHost(component, name)
				if (!Sincerity.Objects.exists(host)) {
					throw new SavoryException('Unknown host: ' + name)
				}
				var uri = Module.cleanBaseUri(this.hosts[name])
				if (name == 'internal') {
					this.internalName = uri.substring(1)
				}
				println('	"{0}/" on "{1}"'.cast(uri, name))
				if (uri != '') {
					host.attach(uri, this.addTrailingSlashRedirector).matchingMode = Template.MODE_EQUALS
				}
				host.attach(uri, this.instance)
			}

			// Status service
			println('  Status service:')
			this.instance.statusService = new DelegatedStatusService(this.settings.code.sourceViewable ? '/source/' : null)
			this.instance.statusService.debugging = true == this.settings.errors.debug
			delete this.settings.errors.debug
			if (Sincerity.Objects.exists(this.settings.errors.homeUrl)) {
				println('	Home URL: "{0}"'.cast(this.settings.errors.homeUrl))
				this.instance.statusService.homeRef = new Reference(this.settings.errors.homeUrl)
				delete this.settings.errors.homeUrl
			}
			if (Sincerity.Objects.exists(this.settings.errors.contactEmail)) {
				println('	Contact email: "{0}"'.cast(this.settings.errors.contactEmail))
				this.instance.statusService.contactEmail = this.settings.errors.contactEmail
				delete this.settings.errors.contactEmail
			}
			for (var code in this.settings.errors) {
				var uri = this.settings.errors[code]
				println('	Capturing error code {0} to "{1}"'.cast(code, uri))
				this.instance.statusService.capture(code, this.internalName, uri, this.context)
			}

			// Inbound root
			this.instance.inboundRoot = new PrudenceRouter(this.context)
			this.instance.inboundRoot.routingMode = Router.MODE_BEST_MATCH
			
			// Libraries
			this.libraryDocumentSources = new CopyOnWriteArrayList()
			
			// Pass-through documents
			this.passThroughDocuments = new CopyOnWriteArraySet()

			// Container library
			var containerLibraryDocumentSource = component.context.attributes.get('prudence.containerLibraryDocumentSource')
			if (!Sincerity.Objects.exists(containerLibraryDocumentSource)) {
				var library = sincerity.container.getLibrariesFile('scripturian')
				containerLibraryDocumentSource = this.createDocumentSource(library)
				var existing = component.context.attributes.put('prudence.containerLibraryDocumentSource', containerLibraryDocumentSource)
				if (Sincerity.Objects.exists(existing)) {
					containerLibraryDocumentSource = existing
				}
			}

			println('  Libraries:')
			if (Sincerity.Objects.exists(this.settings.code.libraries)) {
				for (var i in this.settings.code.libraries) {
					var library = this.settings.code.libraries[i]
					
					if (!(library instanceof File)) {
						library = new File(this.root, library).absoluteFile
					}
					
					println('	Library: "{0}"'.cast(library))
					var documentSource = this.createDocumentSource(library)
					this.libraryDocumentSources.add(documentSource)
					
					if (i == 0) {
						// We'll use the first library for handlers and tasks
						var extraDocumentSources = new CopyOnWriteArrayList()
						extraDocumentSources.add(containerLibraryDocumentSource)
						
						// Handlers
						this.globals['com.threecrickets.prudence.DelegatedHandler'] = {
							documentSource: documentSource,
							extraDocumentSources: extraDocumentSources,
							libraryDocumentSources: this.libraryDocumentSources,
							defaultName: this.settings.code.defaultDocumentName,
							defaultLanguageTag: this.settings.code.defaultLanguageTag,
							languageManager: executable.manager,
							sourceViewable: this.settings.code.sourceViewable,
							fileUploadDirectory: this.settings.uploads.root,
							fileUploadSizeThreshold: this.settings.uploads.sizeThreshold
						}
						println('	Handlers: "{0}"'.cast(library))

						// Tasks
						this.globals['com.threecrickets.prudence.ApplicationTask'] = {
							documentSource: documentSource,
							extraDocumentSources: extraDocumentSources,
							libraryDocumentSources: this.libraryDocumentSources,
							defaultName: this.settings.code.defaultDocumentName,
							defaultLanguageTag: this.settings.code.defaultLanguageTag,
							languageManager: executable.manager,
							sourceViewable: this.settings.code.sourceViewable,
							fileUploadDirectory: this.settings.uploads.root,
							fileUploadSizeThreshold: this.settings.uploads.sizeThreshold
						}
						println('	Tasks: "{0}"'.cast(library))
					}
				}
			}
			
			println('	Container library: "{0}"'.cast(containerLibraryDocumentSource.basePath))
			this.libraryDocumentSources.add(containerLibraryDocumentSource)

			// Sincerity library
			var sincerityLibraryDocumentSource = component.context.attributes.get('prudence.sincerityLibraryDocumentSource')
			if (!Sincerity.Objects.exists(sincerityLibraryDocumentSource)) {
				var library = sincerity.getHomeFile('libraries', 'scripturian')
				sincerityLibraryDocumentSource = this.createDocumentSource(library)
				var existing = component.context.attributes.put('prudence.sincerityLibraryDocumentSource', sincerityLibraryDocumentSource)
				if (Sincerity.Objects.exists(existing)) {
					sincerityLibraryDocumentSource = existing
				}
			}
			if (sincerityLibraryDocumentSource.basePath != containerLibraryDocumentSource.basePath) {
				println('	Sincerity library: "{0}"'.cast(sincerityLibraryDocumentSource.basePath))
				this.libraryDocumentSources.add(sincerityLibraryDocumentSource)
			}
			
			println('  Routing:')

			// Source viewer
			if (true == this.settings.code.sourceViewable) {
				this.sourceViewableDocumentSources = new CopyOnWriteArrayList()
				this.globals['com.threecrickets.prudence.SourceCodeResource.documentSources'] = this.sourceViewableDocumentSources
				var sourceViewer = new Finder(this.context, Sincerity.JVM.getClass('com.threecrickets.prudence.SourceCodeResource'))
				this.instance.inboundRoot.attach('/source/', sourceViewer).matchingMode = Template.MODE_EQUALS
				println('	"/source/" -> "{0}"'.cast(sourceViewer['class'].simpleName))
			}

			// Create and attach restlets
			for (var uri in this.routes) {
				var restlet = this.routes[uri]

				var attachBase = false
				var length = uri.length
				if (length > 1) {
					var last = uri[length - 1]
					if (last == '*') {
						uri = uri.substring(0, length - 1)
						attachBase = true
					}
				}
				
				uri = Module.cleanUri(uri)

				restlet = this.createRestlet(restlet, uri)
				if (Sincerity.Objects.exists(restlet)) {
					if (restlet == 'hidden') {
						println('	"{0}" hidden'.cast(uri))
						this.instance.inboundRoot.hide(uri)
					}
					else if (attachBase) {
						println('	"{0}*" -> {1}'.cast(uri, restlet['class'].simpleName))
						this.instance.inboundRoot.attachBase(uri, restlet)
					}
					else {
						println('	"{0}" -> {1}'.cast(uri, restlet['class'].simpleName))
						this.instance.inboundRoot.attach(uri, restlet).matchingMode = Template.MODE_EQUALS
					}
				}
				else {
					throw new SincerityException('Unsupported restlet for "{0}"'.cast(uri))
				}
			}

			// crontab
			var crontab = new File(this.root, 'crontab').absoluteFile
			if (crontab.exists() && !crontab.directory) {
				println('  Crontab:')
				println('	"{0}"'.cast(crontab))
				var scheduler = component.context.attributes.get('com.threecrickets.prudence.scheduler')
				scheduler.addTaskCollector(new ApplicationTaskCollector(crontab, this.instance))
			}

			// Use common cache, if exists
			var cache = component.context.attributes.get('com.threecrickets.prudence.cache')
			if (Sincerity.Objects.exists(cache)) {
				this.globals['com.threecrickets.prudence.cache'] = cache
			}

			// Allow access to component
			if (!Sincerity.Objects.ensure(this.settings.isolate, false)) {
				// (This can be considered a security breach, because it allows applications to access other applications)
				this.globals['com.threecrickets.prudence.component'] = component
			}
			
			// Apply globals
			var globals = Sincerity.Objects.flatten(this.globals)
			for (var name in globals) {
				if (null !== globals[name]) {
					this.context.attributes.put(name, globals[name])
				}
			}

			// Apply shared globals
			var sharedGlobals = Sincerity.Objects.flatten(this.sharedGlobals)
			for (var name in sharedGlobals) {
				if (null !== sharedGlobals[name]) {
					component.context.attributes.put(name, sharedGlobals[name])
				}
			}

			// Preheat tasks
			var internal = String(this.hosts.internal).replace(/\//g, '')
			for (var p in this.preheat) {
				var uri = this.preheat[p]
				executorTasks.push(new PreheatTask(internal, uri, this.instance, this.settings.logger))
			}

			// Add to application list
			var applications = component.context.attributes.get('com.threecrickets.prudence.applications')
			if (!Sincerity.Objects.exists(applications)) {
				applications = new CopyOnWriteArrayList()
				var existing = component.context.attributes.putIfAbsent('com.threecrickets.prudence.applications', applications)
				if (Sincerity.Objects.exists(existing)) {
					applications = existing
				}
			}
			applications.add(this.instance)

			return this.instance
		}
		
		Public.createRestlet = function(restlet, uri) {
			if (Sincerity.Objects.isArray(restlet)) {
				return new Module.Chain({restlets: restlet}).create(this, uri)
			}
			else if (Sincerity.Objects.isString(restlet)) {
				if (restlet == 'hidden') {
					return restlet
				}
				else if (restlet[0] == '/') {
					/*for (var i = this.instance.inboundRoot.routes.iterator(); i.hasNext(); ) {
						var route = i.next()
						var pattern = route.template.pattern
						if (route.matchingMode == Template.MODE_STARTS_WITH) {
							pattern += '*'
						}
						if (pattern == restlet) {
							println('Connecting to pattern: ' + pattern)
							return route.next
						}
					}*/
					return new Module.Capture({uri: restlet}).create(this, uri)
				}
				else if (restlet[0] == '#') {
					restlet = restlet.substring(1)
					return new Module.Implicit({id: restlet}).create(this, uri)
				}
				else {
					var type = Module[Sincerity.Objects.capitalize(restlet)]
					if (Sincerity.Objects.exists(type)) {
						return this.createRestlet({type: restlet}, uri)
					}
					else {
						return new Module.Implicit({id: restlet}).create(this, uri)
					}
				}
			}
			else if (Sincerity.Objects.isString(restlet.type)) {
				var type = Module[Sincerity.Objects.capitalize(restlet.type)]
				delete restlet.type
				if (Sincerity.Objects.exists(type)) {
					restlet = new type(restlet)
					if (!Sincerity.Objects.exists(restlet.create)) {
						return null
					}
					return restlet.create(this, uri)
				}
			}
			else {
				return restlet.create(this, uri)
			}
		}
		
		Public.createDocumentSource = function(root, preExtension, defaultDocumentName, defaultExtension) {
			importClass(
				com.threecrickets.scripturian.document.DocumentFileSource)

			return new DocumentFileSource(
				'container/' + sincerity.container.getRelativePath(root) + '/',
				root,
				Sincerity.Objects.ensure(defaultDocumentName, this.settings.code.defaultDocumentName),
				Sincerity.Objects.ensure(defaultExtension, this.settings.code.defaultExtension),
				Sincerity.Objects.ensure(preExtension, null),
				this.settings.code.minimumTimeBetweenValidityChecks
			)
		}
		
		Public.defrost = function(documentSource) {
			importClass(
				com.threecrickets.scripturian.util.DefrostTask)
				
			if (true == this.settings.code.defrost) {
				var tasks = DefrostTask.forDocumentSource(documentSource, executable.manager, this.settings.code.defaultLanguageTag, false, true)
				for (var t in tasks) {
					executorTasks.push(tasks[t])
				}
			}
		}
		
		Public.getDispatcher = function(name) {
			var dispatcher = this.dispatchers[name]
			if (!Sincerity.Objects.exists(dispatcher)) {
				dispatcher = this.dispatchers[name] = {}
			}
			if (!Sincerity.Objects.exists(dispatcher.explicit)) {
				dispatcher.explicit = '/prudence/dispatch/{0}/'.cast(name)
			}
			if (!Sincerity.Objects.exists(dispatcher.library)) {
				dispatcher.library = '/resources/{0}/'.cast(name)
			}
			this.globals['prudence.dispatch.{0}.library'.cast(name)] = dispatcher.library
			return dispatcher
		}
		
		return Public	
	}(Public))

   	/**
	 * @class
	 * @name Prudence.Routing.Restlet
	 */
	Public.StaticWeb = Sincerity.Classes.define(function(Module) {
		/** @exports Public as Prudence.Routing.Restlet */
		var Public = {}
		
		Public.create = function(app, uri) {
			return null
		}
		
		return Public
	}(Public))

	/**
	 * @class
	 * @name Prudence.Routing.StaticWeb
	 * @augments Prudence.Routing.Restlet
	 */
	Public.StaticWeb = Sincerity.Classes.define(function(Module) {
		/** @exports Public as Prudence.Routing.StaticWeb */
		var Public = {}
		
		/** @ignore */
		Public._inherit = Module.Restlet

		/** @ignore */
		Public._configure = ['root', 'listingAllowed', 'negotiate', 'compress']

		Public.create = function(app, uri) {
			importClass(
				org.restlet.resource.Directory,
				org.restlet.engine.application.Encoder,
				java.io.File)
			
			this.root = Sincerity.Objects.ensure(this.root, 'mapped')
			if (!(this.root instanceof File)) {
				this.root = new File(app.root, this.root).absoluteFile
			}
			
			var directory = new Directory(app.context, this.root.toURI())
			directory.listingAllowed = Sincerity.Objects.ensure(this.listingAllowed, false)
			directory.negotiatingContent = Sincerity.Objects.ensure(this.negotiate, true)
			
			if (Sincerity.Objects.ensure(this.compress, true)) {
				var encoder = new Encoder(app.context, false, false, app.instance.encoderService)
				encoder.next = directory
				directory = encoder
			}
			
			return directory
		}
		
		return Public
	}(Public))

	/**
	 * @class
	 * @name Prudence.Routing.DynamicWeb
	 * @augments Prudence.Routing.Restlet
	 */
	Public.DynamicWeb = Sincerity.Classes.define(function(Module) {
		/** @exports Public as Prudence.Routing.DynamicWeb */
		var Public = {}
		
		/** @ignore */
		Public._inherit = Module.Restlet

		/** @ignore */
		Public._configure = ['root', 'fragmentsRoot', 'passThroughs', 'preExtension', 'defaultDocumentName', 'defaultExtension', 'clientCachingMode']

		Public.create = function(app, uri) {
			if (Sincerity.Objects.exists(app.globals['com.threecrickets.prudence.GeneratedTextResource'])) {
				throw new SincerityException('There can be only one DynamicWeb per application')
			}

			importClass(
				com.threecrickets.prudence.util.PhpExecutionController,
				com.threecrickets.prudence.util.PrudenceScriptletPlugin,
				org.restlet.resource.Finder,
				java.util.concurrent.CopyOnWriteArrayList,
				java.util.concurrent.CopyOnWriteArraySet,
				java.util.concurrent.ConcurrentHashMap,
				java.io.File)
				
			this.root = Sincerity.Objects.ensure(this.root, 'mapped')
			if (!(this.root instanceof File)) {
				this.root = new File(app.root, this.root).absoluteFile
			}
			
			this.fragmentsRoot = Sincerity.Objects.ensure(this.fragmentsRoot, 'fragments')
			if (!(this.fragmentsRoot instanceof File)) {
				this.fragmentsRoot = new File(app.root, this.fragmentsRoot).absoluteFile
			}

			if (Sincerity.Objects.isString(this.clientCachingMode)) {
				if (this.clientCachingMode == 'disabled') {
					this.clientCachingMode = 0
				}
				else if (this.clientCachingMode == 'conditional') {
					this.clientCachingMode = 1
				}
				else if (this.clientCachingMode == 'offline') {
					this.clientCachingMode = 2
				}
				else {
					throw new SavoryException('Unsupported clientCachingMode: ' + this.clientCachingMode)
				}
			}
			else if (!Sincerity.Objects.exists(this.clientCachingMode)) {
				this.clientCachingMode = 1
			}

			this.defaultDocumentName = Sincerity.Objects.ensure(this.defaultDocumentName, 'index')
			this.defaultExtension = Sincerity.Objects.ensure(this.defaultExtension, 'html')
			this.preExtension = Sincerity.Objects.ensure(this.preExtension, 'd')

			println('	DynamicWeb:')
			println('	  Library: "{0}"'.cast(this.root))

			var generatedTextResource = app.globals['com.threecrickets.prudence.GeneratedTextResource'] = {
				documentSource: app.createDocumentSource(this.root, this.preExtension, this.defaultDocumentName, this.defaultExtenion),
				extraDocumentSources: new CopyOnWriteArrayList(),
				libraryDocumentSources: app.libraryDocumentSources,
				passThroughDocuments: app.passThroughDocuments,
				cacheKeyPatternHandlers: new ConcurrentHashMap(),
				scriptletPlugins: new ConcurrentHashMap(),
				clientCachingMode: this.clientCachingMode,
				defaultIncludedName: this.defaultDocumentName,
				executionController: new PhpExecutionController(), // Adds PHP predefined variables
				languageManager: executable.manager,
				sourceViewable: app.settings.code.sourceViewable,
				fileUploadDirectory: app.settings.uploads.root,
				fileUploadSizeThreshold: app.settings.uploads.sizeThreshold,
				scriptletPlugins: new ConcurrentHashMap()
			}

			// Fragments
			if (Sincerity.Objects.exists(this.fragmentsRoot)) {
				println('	  Fragments: "{0}"'.cast(this.fragmentsRoot))
				generatedTextResource.extraDocumentSources.add(app.createDocumentSource(this.fragmentsRoot, null, this.defaultDocumentName, this.defaultExtenion))
			}

			// Common fragments
			var commonFragmentsDocumentSource = app.component.context.attributes.get('prudence.fragmentsDocumentSource')
			if (!Sincerity.Objects.exists(commonFragmentsDocumentSource)) {
				var library = sincerity.container.getFile('libraries', 'prudence')
				commonFragmentsDocumentSource = app.createDocumentSource(library, null, this.defaultDocumentName, this.defaultExtenion)
				app.component.context.attributes.put('prudence.fragmentsDocumentSource', commonFragmentsDocumentSource)
			}

			println('	  Common fragments: "{0}"'.cast(commonFragmentsDocumentSource.basePath))
			generatedTextResource.extraDocumentSources.add(commonFragmentsDocumentSource)

			// Viewable source
			if (true == app.settings.code.sourceViewable) {
				app.sourceViewableDocumentSources.add(generatedTextResource.documentSource)
				app.sourceViewableDocumentSources.addAll(generatedTextResource.extraDocumentSources)
			}
			
			// Pass-throughs
			if (Sincerity.Objects.exists(this.passThroughs)) {
				for (var i in this.passThroughs) {
					println('	  Pass through: "{0}"'.cast(this.passThroughs[i]))
					generatedTextResource.passThroughDocuments.add(this.passThroughs[i])
				}
			}
			
			// Scriptlet plugins
			var prudenceScriptletPlugin = new PrudenceScriptletPlugin()
			generatedTextResource.scriptletPlugins.put('{{', prudenceScriptletPlugin)
			generatedTextResource.scriptletPlugins.put('}}', prudenceScriptletPlugin)
			generatedTextResource.scriptletPlugins.put('==', prudenceScriptletPlugin)
			
			if (Sincerity.Objects.exists(app.settings.scriptletPlugins)) {
				for (var code in app.settings.scriptletPlugins) {
					println('	  Scriptlet plugin {0} -> "{1}"'.cast(code, app.settings.scriptletPlugins[code]))
					generatedTextResource.scriptletPlugins.put(code, app.settings.scriptletPlugins[code])
				}
			}
			
			// Defrost
			app.defrost(generatedTextResource.documentSource)
			
			return new Finder(app.context, Sincerity.JVM.getClass('com.threecrickets.prudence.GeneratedTextResource'))
		}
		
		return Public
	}(Public))

	/**
	 * @class
	 * @name Prudence.Routing.Explicit
	 * @augments Prudence.Routing.Restlet
	 */
	Public.Explicit = Sincerity.Classes.define(function(Module) {
		/** @exports Public as Prudence.Routing.Explicit */
		var Public = {}
		
		/** @ignore */
		Public._inherit = Module.Restlet

		/** @ignore */
		Public._configure = ['root', 'passThroughs', 'implicit', 'preExtension']

		Public.create = function(app, uri) {
			if (Sincerity.Objects.exists(app.globals['com.threecrickets.prudence.DelegatedResource'])) {
				throw new SincerityException('There can be only one Explicit per application')
			}

			importClass(
				org.restlet.resource.Finder,
				java.io.File)

			this.root = Sincerity.Objects.ensure(this.root, 'mapped')
			if (!(this.root instanceof File)) {
				this.root = new File(app.root, this.root).absoluteFile
			}

			this.preExtension = Sincerity.Objects.ensure(this.preExtension, 'e')

			println('	Explicit:')
			println('	  Library: "{0}"'.cast(this.root))

			var delegatedResource = app.globals['com.threecrickets.prudence.DelegatedResource'] = {
				documentSource: app.createDocumentSource(this.root, this.preExtension),
				libraryDocumentSources: app.libraryDocumentSources,
				passThroughDocuments: app.passThroughDocuments,
				defaultName: app.settings.code.defaultDocumentName,
				defaultLanguageTag: app.settings.code.defaultLanguageTag,
				languageManager: executable.manager,
				sourceViewable: app.settings.code.sourceViewable,
				fileUploadDirectory: app.settings.uploads.root,
				fileUploadSizeThreshold: app.settings.uploads.sizeThreshold
			}

			// Pass-throughs
			if (Sincerity.Objects.exists(this.passThroughs)) {
				for (var i in this.passThroughs) {
					println('	  Pass through: "{0}"'.cast(this.passThroughs[i]))
					delegatedResource.passThroughDocuments.add(this.passThroughs[i])
				}
			}

			// Viewable source
			if (true == app.settings.code.sourceViewable) {
				app.sourceViewableDocumentSources.add(delegatedResource.documentSource)
				app.sourceViewableDocumentSources.addAll(app.libraryDocumentSources)
			}

			// Pass-through and hide dispatchers
			var dispatcherBaseUri = Module.cleanBaseUri(uri)
			for (var name in app.dispatchers) {
				var dispatcher = app.getDispatcher(name)
				delegatedResource.passThroughDocuments.add(dispatcher.explicit)
				var explicit = dispatcherBaseUri + dispatcher.explicit
				app.instance.inboundRoot.hide(explicit)
				println('	  Dispatcher "{0}" -> "{1}"'.cast(name, explicit))
			}

			// Defrost
			app.defrost(delegatedResource.documentSource)

			return new Finder(app.context, Sincerity.JVM.getClass('com.threecrickets.prudence.DelegatedResource'))
		}
		
		return Public
	}(Public))

	/**
	 * @class
	 * @name Prudence.Routing.Implicit
	 * @augments Prudence.Routing.Restlet
	 */
	Public.Implicit = Sincerity.Classes.define(function(Module) {
		/** @exports Public as Prudence.Routing.Implicit */
		var Public = {}
		
		/** @ignore */
		Public._inherit = Module.Restlet

		/** @ignore */
		Public._configure = ['id', 'locals', 'dispatcher']

		Public.create = function(app, uri) {
			importClass(
				com.threecrickets.prudence.util.Injector,
				com.threecrickets.prudence.util.CapturingRedirector)
				
			if (!Sincerity.Objects.exists(app.globals['com.threecrickets.prudence.DelegatedResource'])) {
				throw new SincerityException('An Explicit must be attached before an Implicit can be created')
	   		}
				
			this.dispatcher = Sincerity.Objects.ensure(this.dispatcher, 'javascript')
			var dispatcher = app.getDispatcher(this.dispatcher)
	   		var capture = new CapturingRedirector(app.context, 'riap://application' + dispatcher.explicit + '?{rq}', false)
			var injector = new Injector(app.context, capture)
			injector.values.put('prudence.id', this.id)

			// Extra locals
			if (Sincerity.Objects.exists(this.locals)) {
				for (var i in this.locals) {
					injector.values.put(i, this.locals[i])
				}
			}
   
			return injector
		}
		
		return Public
	}(Public))

	/**
	 * @class
	 * @name Prudence.Routing.Capture
	 * @augments Prudence.Routing.Restlet
	 */
	Public.Capture = Sincerity.Classes.define(function(Module) {
		/** @exports Public as Prudence.Routing.Capture */
		var Public = {}
		
		/** @ignore */
		Public._inherit = Module.Restlet

		/** @ignore */
		Public._configure = ['uri', 'hidden', 'locals']

		Public.create = function(app, uri) {
			importClass(
				com.threecrickets.prudence.util.Injector,
				com.threecrickets.prudence.util.CapturingRedirector)
				
	   		var capture = new CapturingRedirector(app.context, 'riap://application' + this.uri + '?{rq}', false)

			if (Sincerity.Objects.exists(this.locals)) {
				var injector = new Injector(app.context, capture)

				for (var i in this.locals) {
					injector.values.put(i, this.locals[i])
				}
				
				capture = injector
			}
			
			if (true == this.hidden) {
				app.instance.inboundRoot.hide(uri)				
			}
   
			return capture
		}
		
		return Public
	}(Public))

	/**
	 * @class
	 * @name Prudence.Routing.Chain
	 * @augments Prudence.Routing.Restlet 
	 */
	Public.Chain = Sincerity.Classes.define(function(Module) {
		/** @exports Public as Prudence.Routing.Chain */
		var Public = {}
		
		/** @ignore */
		Public._inherit = Module.Restlet

		/** @ignore */
		Public._configure = ['restlets']

		Public.create = function(app, uri) {
			importClass(com.threecrickets.prudence.util.Fallback)
			
			var fallback = new Fallback(app.context, app.settings.code.minimumTimeBetweenValidityChecks)
			
			if (Sincerity.Objects.exists(this.restlets)) {
				for (var i in this.restlets) {
					var restlet = app.createRestlet(this.restlets[i], uri)
					if (Sincerity.Objects.exists(restlet)) {
						fallback.addTarget(restlet)					
					}
				}
			}
			
			return fallback
		}
		
		return Public
	}(Public))
	
	/**
	 * @class
	 * @name Prudence.Routing.Resource
	 * @augments Prudence.Routing.Restlet 
	 */
	Public.Resource = Sincerity.Classes.define(function(Module) {
		/** @exports Public as Prudence.Routing.Resource */
		var Public = {}
		
		/** @ignore */
		Public._inherit = Module.Restlet

		/** @ignore */
		Public._configure = ['class']

		Public.create = function(app, uri) {
			importClass(org.restlet.resource.Finder)
			
			var theClass = Sincerity.JVM.getClass(this['class'])
			if (null === theClass) {
				throw new SavoryException('Cannot load class: ' + this['class'])
			}
			return new Finder(app.context, theClass)
		}
		
		return Public
	}(Public))

	/**
	 * @class
	 * @name Prudence.Routing.AddSlash
	 * @augments Prudence.Routing.Restlet 
	 */
	Public.AddSlash = Sincerity.Classes.define(function(Module) {
		/** @exports Public as Prudence.Routing.AddSlash */
		var Public = {}
		
		/** @ignore */
		Public._inherit = Module.Restlet

		Public.create = function(app, uri) {
			return app.addTrailingSlashRedirector
		}
		
		return Public
	}(Public))

	/**
	 * @class
	 * @name Prudence.Routing.Filter
	 * @augments Prudence.Routing.Restlet 
	 */
	Public.Filter = Sincerity.Classes.define(function(Module) {
		/** @exports Public as Prudence.Routing.Filter */
		var Public = {}
		
		/** @ignore */
		Public._inherit = Module.Restlet

		/** @ignore */
		Public._configure = ['library', 'next']

		Public.create = function(app, uri) {
			importClass(com.threecrickets.prudence.DelegatedFilter)
			
			this.next = app.createRestlet(this.next, uri)
			var filter = new DelegatedFilter(app.context, this.next, this.library)
			
			return filter
		}
		
		return Public
	}(Public))

	/**
	 * @class
	 * @name Prudence.Routing.JavaScriptUnifyMinify
	 * @augments Prudence.Routing.Restlet 
	 */
	Public.JavaScriptUnifyMinify = Sincerity.Classes.define(function(Module) {
		/** @exports Public as Prudence.Routing.JavaScriptUnifyMinify */
		var Public = {}
		
		/** @ignore */
		Public._inherit = Module.Restlet

		/** @ignore */
		Public._configure = ['roots', 'next']

		Public.create = function(app, uri) {
			importClass(
				com.threecrickets.prudence.util.JavaScriptUnifyMinifyFilter,
				java.io.File)
   
			this.roots = Sincerity.Objects.array(this.roots)
			if (!Sincerity.Objects.exists(this.roots) || (this.roots.length == 0)) {
				this.roots = [new File(new File(app.root, 'mapped'), 'scripts'), sincerity.container.getLibrariesFile('web', 'scripts')]
			}
			var target = this.roots[0]
			if (!(target instanceof File)) {
				target = new File(app.root, target).absoluteFile
			}

			this.next = app.createRestlet(this.next, uri)
			var filter = new JavaScriptUnifyMinifyFilter(app.context, this.next, target, app.settings.code.minimumTimeBetweenValidityChecks)

			println('	JavaScriptUnifyMinify: "{0}"'.cast(target))
			for (var r in this.roots) {
				var root = this.roots[r]
				if (!(root instanceof File)) {
					root = new File(app.root, root).absoluteFile
				}
				filter.sourceDirectories.add(root)
				println('	  Directory: "{0}"'.cast(root))
			}

			return filter
		}
		
		return Public
	}(Public))

	/**
	 * @class
	 * @name Prudence.Routing.CssUnifyMinify
	 * @augments Prudence.Routing.Restlet 
	 */
	Public.CssUnifyMinify = Sincerity.Classes.define(function(Module) {
		/** @exports Public as Prudence.Routing.CssUnifyMinify */
		var Public = {}
		
		/** @ignore */
		Public._inherit = Module.Restlet

		/** @ignore */
		Public._configure = ['roots', 'next']

		Public.create = function(app, uri) {
			importClass(
				com.threecrickets.prudence.util.CssUnifyMinifyFilter,
				java.io.File)
   
			this.roots = Sincerity.Objects.array(this.roots)
			if (!Sincerity.Objects.exists(this.roots) || (this.roots.length == 0)) {
				this.roots = [new File(new File(app.root, 'mapped'), 'style'), sincerity.container.getLibrariesFile('web', 'style')]
			}
			var target = this.roots[0]
			if (!(target instanceof File)) {
				target = new File(app.root, target).absoluteFile
			}

			this.next = app.createRestlet(this.next, uri)
			var filter = new CssUnifyMinifyFilter(app.context, this.next, target, app.settings.code.minimumTimeBetweenValidityChecks)

			println('	CssUnifyMinify: "{0}"'.cast(target))
			for (var r in this.roots) {
				var root = this.roots[r]
				if (!(root instanceof File)) {
					root = new File(app.root, root).absoluteFile
				}
				filter.sourceDirectories.add(root)
				println('	  Directory: "{0}"'.cast(root))
			}

			return filter
		}
		
		return Public
	}(Public))

	/**
	 * @class
	 * @name Prudence.Routing.Zuss
	 * @augments Prudence.Routing.Restlet 
	 */
	Public.Zuss = Sincerity.Classes.define(function(Module) {
		/** @exports Public as Prudence.Routing.Zuss */
		var Public = {}
		
		/** @ignore */
		Public._inherit = Module.Restlet

		/** @ignore */
		Public._configure = ['roots', 'next' ,'resolver']

		Public.create = function(app, uri) {
			importClass(
				com.threecrickets.prudence.util.ZussFilter,
				java.io.File)
   
			this.roots = Sincerity.Objects.array(this.roots)
			if (!Sincerity.Objects.exists(this.roots) || (this.roots.length == 0)) {
				this.roots = [new File(new File(app.root, 'mapped'), 'style'), sincerity.container.getLibrariesFile('web', 'style')]
			}
			var target = this.roots[0]
			if (!(target instanceof File)) {
				target = new File(app.root, target).absoluteFile
			}

			this.next = app.createRestlet(this.next, uri)
			var filter
			if (Sincerity.Objects.exists(this.resolver)) {
				filter = new ZussFilter(app.context, this.next, target, app.settings.code.minimumTimeBetweenValidityChecks, resolver)
			}
			else {
				filter = new ZussFilter(app.context, this.next, target, app.settings.code.minimumTimeBetweenValidityChecks)
			}
			
			println('	Zuss: "{0}"'.cast(target))
			for (var r in this.roots) {
				var root = this.roots[r]
				if (!(root instanceof File)) {
					root = new File(app.root, root).absoluteFile
				}
				filter.sourceDirectories.add(root)
				println('	  Directory: "{0}"'.cast(root))
			}
			
			return filter
		}
		
		return Public
	}(Public))

	/**
	 * @class
	 * @name Prudence.Routing.CacheControl
	 * @augments Prudence.Routing.Restlet 
	 */
	Public.CacheControl = Sincerity.Classes.define(function(Module) {
		/** @exports Public as Prudence.Routing.CacheControl */
		var Public = {}
		
		/** @ignore */
		Public._inherit = Module.Restlet

		/** @ignore */
		Public._configure = ['mediaTypes', 'default', 'next']

		Public.create = function(app, uri) {
			importClass(
				com.threecrickets.prudence.util.CacheControlFilter,
				org.restlet.data.MediaType,
				java.io.File)
   
			this.root = Sincerity.Objects.ensure(this.root, 'mapped')
			if (!(this.root instanceof File)) {
				this.root = new File(app.root, this.root).absoluteFile
			}
			
			this['default'] = Sincerity.Objects.ensure(this['default'], -1)
			if (this['default'] == 'farFuture') {
				this['default'] = CacheControlFilter.FAR_FUTURE
			}
			
			this.next = app.createRestlet(this.next, uri)
			var filter = new CacheControlFilter(app.context, this.next, this['default'])
			
			println('	CacheControl:')
			if (Sincerity.Objects.exists(this.mediaTypes)) {
				for (var mediaType in this.mediaTypes) {
					var maxAge = this.mediaTypes[mediaType]
					if (maxAge == 'farFuture') {
						maxAge = CacheControlFilter.FAR_FUTURE
					}
					mediaType = MediaType.valueOf(mediaType)
					filter.maxAgeForMediaType.put(mediaType, maxAge)
					println('	  Max age for {0} -> {1}'.cast(mediaType, maxAge))
				}
			}
			println('	  Default max age -> {0}'.cast(this['default']))
			
			return filter
		}
		
		return Public
	}(Public))

	return Public
}()