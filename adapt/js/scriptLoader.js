(function() {

  const isProduction = (window.ADAPT_BUILD_TYPE !== 'development');

  function loadScript(url, callback) {
    if (!url || typeof url !== 'string') return;
    const script = document.createElement('script');
    script.onload = callback;
    script.src = url;
    document.getElementsByTagName('head')[0].appendChild(script);
  };

  // 0. Keep loadScript code to add into Adapt API later
  window.__loadScript = loadScript;

  // 2. Setup require for old-style module declarations (some code still uses these), configure paths then load JQuery
  function setupRequireJS() {
    requirejs.config({
      map: {
        '*': {
          coreJS: 'core/js',
          coreViews: 'core/js/views',
          coreModels: 'core/js/models',
          coreCollections: 'core/js/collections'
        }
      },
      paths: {
        'regenerator-runtime': 'libraries/regenerator-runtime.min',
        'core-js': 'libraries/core-js.min',
        jquery: 'libraries/jquery.min',
        underscore: 'libraries/underscore.min',
        'underscore.results': 'libraries/underscore.results',
        backbone: 'libraries/backbone.min',
        'backbone.controller': 'libraries/backbone.controller',
        'backbone.controller.results': 'libraries/backbone.controller.results',
        'backbone.es6': 'libraries/backbone.es6',
        handlebars: 'libraries/handlebars.min',
        velocity: 'libraries/velocity.min',
        imageReady: 'libraries/imageReady',
        inview: 'libraries/inview',
        scrollTo: 'libraries/scrollTo.min',
        bowser: 'libraries/bowser',
        enum: 'libraries/enum',
        jqueryMobile: 'libraries/jquery.mobile.custom.min',
        react: isProduction ? 'libraries/react.production.min' : 'libraries/react.development',
        'react-dom': isProduction ? 'libraries/react-dom.production.min' : 'libraries/react-dom.development',
        'html-react-parser': 'libraries/html-react-parser.min',
        semver: 'libraries/semver'
      },
      waitSeconds: 0
    });
    loadJQuery();
  }

  // 3. start loading JQuery, wait for it to be loaded
  function loadJQuery() {
    loadScript('libraries/jquery.min.js', checkJQueryStatus);
  }

  // 4. Wait until JQuery gets loaded completely then load foundation libraries
  function checkJQueryStatus() {
    if (window.jQuery === undefined) {
      setTimeout(checkJQueryStatus, 100);
    } else {
      setupModernizr();
    }
  }

  // 5. Backward compatibility for Modernizr
  function setupModernizr() {
    Modernizr.touch = Modernizr.touchevents;
    const touchClass = Modernizr.touch ? 'touch' : 'no-touch';
    $('html').addClass(touchClass);
    loadFoundationLibraries();
  }

  // 6. Load foundation libraries and templates then load Adapt itself
  function loadFoundationLibraries() {
    require([
      'handlebars',
      'underscore',
      'regenerator-runtime',
      'core-js',
      'underscore.results',
      'backbone',
      'backbone.controller',
      'backbone.controller.results',
      'backbone.es6',
      'velocity',
      'imageReady',
      'inview',
      'jqueryMobile',
      'libraries/jquery.resize',
      'scrollTo',
      'bowser',
      'enum',
      'react',
      'react-dom',
      'html-react-parser',
      'semver'
    ], loadGlobals);
  }

  // 7. Expose global context libraries
  function loadGlobals(Handlebars, _) {
    window._ = _;
    window.Handlebars = Handlebars;
    require([
      'events/touch'
    ], loadTemplates);
  }

  // 8. Load templates
  function loadTemplates() {
    require([
      'templates'
    ], loadAdapt);
  }

  // 9. Allow cross-domain AJAX then load Adapt
  function loadAdapt() {
    $.ajaxPrefilter(function(options) {
      options.crossDomain = true;
    });
    loadScript('adapt/js/adapt.min.js');
  }

  // 1. Load requirejs then set it up
  loadScript('libraries/require.min.js', setupRequireJS);

})();
