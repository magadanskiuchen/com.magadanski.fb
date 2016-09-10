/**
 * Connect
 * 
 * @namespace fb
 * @author Georgi Popov
 * @version 1.0.4
 * @license http://www.gnu.org/licenses/gpl-3.0.en.html GPLv3
 * @requires com/magadanski/core/core.js
 * @requires com/magadanski/core/utils.js
 * @requires com/magadanski/core/EventDispatcher.js
 */

define('com.magadanski.fb.Connect', function () {
	var that;
	var utils = inc('com.magadanski.utils', true);
	
	// private properties
	/**
	 * @access private
	 * @inner
	 * @member {Boolean} domReady
	 * @memberOf Connect
	 * @default
	 */
	var domReady = false;
	
	/**
	 * @access private
	 * @inner
	 * @member {Boolean} fbReady
	 * @memberOf Connect
	 * @default
	 */
	var fbReady = false;
	
	/**
	 * @access private
	 * @inner
	 * @member {Boolean} initialized
	 * @memberOf Connect
	 * @default
	 */
	var initialized = false;
	
	// private methods
	/**
	 * @access private
	 * @inner
	 * @memberOf Connect
	 * @param  {Object} e
	 * @return {void}
	 */
	function init(e) {
		if (that.getDomReady() && that.getFbReady() && !initialized) {
			FB.init({
				appId: that.options.appId,
				xfbml: that.options.xfbml,
				version: that.options.version
			});
			
			FB.Event.subscribe('auth.statusChange', function(response) {
				switch (response.status) {
					case 'not_authorized':
						handleNotAuthorized(response);
						break;
					case 'connected':
						handleLogin(response);
						break;
					case 'unknown':
						handleLogout(response);
						break;
				}
			});
			
			FB.getLoginStatus();
			
			var loginButton = document.querySelector(that.options.loginButton);
			
			if (loginButton) {
				loginButton.addEventListener('click', function (e) {
					e.preventDefault();
					
					that.login();
				});
			}
			
			var logoutButton = document.querySelector(that.options.logoutButton);
			
			if (logoutButton) {
				logoutButton.addEventListener('click', function (e) {
					e.preventDefault();
					
					that.logout();
				});
			}
			
			initialized = true;
		}
	}
	
	/**
	 * @access private
	 * @inner
	 * @memberOf Connect
	 * @param  {Object} response
	 * @return {void}
	 */
	function handleNotAuthorized(response) {
		document.body.classList.add(that.options.guestBodyClass);
		document.body.classList.remove(that.options.userBodyClass);
		
		if (typeof(that.options.onNotAuthorized) === 'function') {
			that.options.onNotAuthorized(response);
		}
		
		/**
		 * Event dispatched when the user does not authorize the application.
		 * 
		 * When the "login" button is clicked or the `login` method is called
		 * directly a popup is shown to the user asking for authorization of
		 * the application.
		 * 
		 * If the user declines the application's authorization the `not_authorized`
		 * event will be dispatched.
		 * 
		 * @event Connect#not_authorized
		 * @type {Object}
		 * @property {Obect} response FB API's response
		 */
		that.dispatchEvent('not_authorized', { response: response });
	}
	
	/**
	 * @access private
	 * @inner
	 * @memberOf Connect
	 * @param  {Object} response
	 * @return {void}
	 */
	function handleLogin(response) {
		document.body.classList.add(that.options.userBodyClass);
		document.body.classList.remove(that.options.guestBodyClass);
		
		if (typeof(that.options.onConnected) === 'function') {
			that.options.onConnected(response);
		}
		
		/**
		 * Event dispatched when the user's account is connected to the application.
		 * 
		 * This is called upon successful connection of the user's profile either
		 * in response to them clicking on the "login" button or as some other direct
		 * call of the `login` method.
		 * 
		 * @event Connect#login
		 * @type {Object}
		 * @property {Object} response FB API's response
		 */
		that.dispatchEvent('login', { response: response });
	}
	
	/**
	 * @access private
	 * @inner
	 * @memberOf Connect
	 * @param  {Object} response
	 * @return {void}
	 */
	function handleLogout(response) {
		document.body.classList.add(that.options.guestBodyClass);
		document.body.classList.remove(that.options.userBodyClass);
		
		if (typeof(that.options.onLogout) === 'function') {
			that.options.onLogout(response);
		}
		
		/**
		 * Event dispatched when the user's account is disconnected from the application.
		 * 
		 * This is called upon successful disconnection of the user's profile either in
		 * response to them clicking on the "logout" button or as some other direct call
		 * of the `logout` method.
		 * 
		 * This does not mean the user has deauthorized the application, rather that
		 * they are simply logged-out of Facebook.
		 * 
		 * @event Connect#logout
		 * @type {Object}
		 * @property {Object} response FB API's response
		 */
		that.dispatchEvent('logout', { response: response });
	}
	
	/**
	 * Facebook login helper
	 * 
	 * When instantiated the class automatically asynchronously loads the FB SDK.
	 * 
	 * After the FB SDK is loaded and the DOMContentLoaded event fires the
	 * `init` method of the class. This method initializes the FB SDK, checks
	 * the current user's status (`connected`, `not_authorized` or `uknown`).
	 * 
	 * Based on this status a corresponding event of `login`, `not_authorized`
	 * or `logout` is dispatched.
	 * 
	 * If the status of the user changes then associated events are dispatched as well.
	 * 
	 * Based on options set for "login" and "logout" buttons necessary functionality
	 * is assigned to those.
	 * 
	 * @class Connect
	 * @since 1.0.0
	 * @extends {EventDispatcher}
	 * @param {Object} options See {@link Connect#defaultInitOptions|defaultInitOptions}
	 * @fires {@link Connect#login|login}
	 * @fires {@link Connect#logout|logout}
	 * @fires {@link Connect#not_authorized|not_authorized}
	 */
	var Connect = function (options) {
		that = this;
		
		// priviledged properties
		/**
		 * Initialization options
		 * 
		 * @access public
		 * @instance
		 * @member {Object} options
		 * @memberOf Connect
		 * @see {@link Connect#defaultInitOptions|defaultInitOptions}
		 */
		that.options = utils.extendOptions(that.defaultInitOptions, options);
		
		// priviledged methods
		/**
		 * Getter for the domReady private property
		 * 
		 * @access public
		 * @instance
		 * @memberOf Connect
		 * @method getDomReady
		 * @return {boolean} Whether the DOM is ready or not
		 */
		that.getDomReady = function () {
			return domReady = (document.readyState == "complete" || document.readyState == "loaded" || document.readyState == "interactive");
		};
		
		/**
		 * Setter, which calls the getter as the value is auto-set.
		 * 
		 * @access public
		 * @instance
		 * @memberOf Connect
		 * @method setDomReady
		 */
		that.setDomReady = function () {
			that.getDomReady();
		};
		
		/**
		 * Getter for the fbReady private property
		 * 
		 * @access public
		 * @instance
		 * @memberOf Connect
		 * @method getFbReady
		 * @return {boolean} Whether the FB JS SDK has been loaded and initialized
		 */
		that.getFbReady = function () {
			return fbReady;
		};
		
		/**
		 * Setter for the fbReady private property
		 * 
		 * @access public
		 * @instance
		 * @memberOf Connect
		 * @method  setFbReady
		 * @param {boolean} ready The new state for the property
		 */
		that.setFbReady = function (ready) {
			var oldValue = fbReady;
			
			fbReady = !!ready;
			
			if (oldValue !== fbReady) {
				that.dispatchEvent('fbReadyChanged');
			}
		};
		
		/**
		 * Getter for the initialized private property
		 * 
		 * @access public
		 * @instance
		 * @memberOf Connect
		 * @method getInitialized
		 * @return {boolean} Whether the FB Login has been initialized
		 */
		that.getInitialized = function () {
			return initialized;
		};
		
		/**
		 * Helper method for accessing FB.api
		 * 
		 * @access public
		 * @instance
		 * @memberOf Connect
		 * @method api
		 * @param {string}   method                 The api method you'd like to call. Use RESTful path.
		 * @param {Function} callback               The callback function to handle the result of the API call.
		 * @param {string}   doubleCheckPermissions (optional) Pass a string to double-check whether the necessary permissions for the API call are available. It is encouraged to always double-check special permissions when making API calls. If the permission is midding the method will automatically handle it and trigger a dialog screen to ask the user to grant the permission. This is essential as users may originally authenticate the application but remove specific permissions later on.
		 * @return {void}
		 */
		that.api = function (method, callback, doubleCheckPermissions) {
			FB.api(method, function (response) {
				var hasPermissions = false;
				
				if (typeof(doubleCheckPermissions) !== 'undefined') {
					for (var i=0; i < response.data.length; ++i) {
						if (response.data[i].permission === doubleCheckPermissions) {
							if (response.data[i].status === 'granted') {
								hasPermissions = true;
							}
						}
					}
				} else {
					hasPermissions = true;
				}
				
				if (hasPermissions) {
					callback(response);
				} else {
					FB.login(function (response) {
						handleLogin();
					}, { scope: doubleCheckPermissions, auth_type: 'rerequest' });
				}
			});
		};
		
		// constructor
		window.fbAsyncInit = function () {
			that.setFbReady(true);
		};
		
		// load FB JS SDK
		// make sure the SDK is not loaded prior to settin the window.fbAsyncInit event handler
		(function(d, s, id){
			var js, fjs = d.getElementsByTagName(s)[0];
			if (d.getElementById(id)) {return;}
			js = d.createElement(s); js.id = id;
			js.src = "//connect.facebook.net/" + that.options.locale + "/sdk.js";
			fjs.parentNode.insertBefore(js, fjs);
		}(document, 'script', 'facebook-jssdk'));

		document.addEventListener('DOMContentLoaded', function (e) {
			that.setDomReady();
		});
		
		that.addEventListener('domReadyChanged fbReadyChanged', init);
	}
	Connect.inherits(com.magadanski.core.EventDispatcher);
	com.magadanski.fb.Connect = Connect;
	
	// public properties
	/**
	 * The default initialization options.
	 * 
	 * Those options include:
	 * 
	 *  * `appId` _(string)_ -- the only required option
	 *  	
	 *  	If you do not pass that none of the functionality will get executed.
	 *  	
	 *  * `xfbml` _(boolean)_ -- default value us `true`
	 *  	
	 *  	Simply forwarded to FBs SDK, denoting whether XFBML tags on the page
	 *  	should be parsed.
	 *  	
	 *  * `version` _(string)_ -- default value is `'v2.7'`
	 *  	
	 *  	Another option passed to FBs SDK. This denotes that your code would
	 *  	expect functionality for that version of the API.
	 *  	
	 *  * `scope` _(string)_ -- default value is 'public_profile,email'
	 *  	
	 *  	You should pass a string with comma delimited permissions that your
	 *  	application needs as the `scope` option.
	 *  	
	 *  	Note that requesting permissions is not equal to receiving them.
	 *  	Facebook allows users to connect to your application providing
	 *  	access to just some of the information you've asked for. So if
	 *  	you're calling an API method that relies on special permissions
	 *  	it is a good idea to always double-check them.
	 *  	
	 *  	The `api` method of the class has a built-in way to double-check
	 *  	permissions, so just pass a string of those when calling it.
	 *  	
	 *  	Also, requesting too much permissions from the start may cause
	 *  	users reject your application (in case they are not acquainted
	 *  	with the option to simply disable them -- few users are).
	 *  	
	 *  	It is advised that the original login only requires some basic
	 *  	public profile information for the users and when you get to
	 *  	a meaningful situation where you need the permissions for some
	 *  	API method -- you can double check for the permissions even if
	 *  	those were not originally present in the `scope` option. This
	 *  	will just ask the users for additional permissions.
	 *  	
	 *  * `loginButton` _(string)_ -- default value is `'.login'`
	 *  	
	 *  	Pass a CSS selector for the `loginButton` option to hook proper login
	 *  	event handlers to the button.
	 *  	
	 *  * `logoutButton` _(string)_ -- default value is `'.logout'`
	 *  	
	 *  	Similar to the `loginButton` one.
	 *  	
	 *  * `locale` _(string)_ -- default value is `'en_US'`
	 *  	
	 *  	This is used when building the URL for the FB SDK to load.
	 *  	
	 *  	The SDK is available as multiple languages at different
	 *  	URLs, so you need to load the proper one in order for
	 *  	your application to be localized.
	 *  	
	 *  	You can pass a locale here as '`{language_code}_{country_code}`'
	 *  	where `{language_code}` is a two-lowercase representation
	 *  	of the language (for example 'en' or 'pt') and
	 *  	`{country_code}` is a two-lowercase representation of the
	 *  	country (for example 'US' or 'GB' in case for English
	 *  	and 'BR' or 'PT' for Portuguese).
	 *  	
	 *  * `userBodyClass` _(string)_ -- default value is `'user'`
	 *  	
	 *  	This class is assigned to the body tag after successful
	 *  	connection to the user's account is established.
	 *  
	 *  * `guestBodyClass` _(string)_ -- default value is `'guest'`
	 *  	
	 *  	This class is assigned to the body tag if a user logs
	 *  	out of FB when on the site or if they do not authorize
	 *  	the application.
	 *  
	 *  * `onConnected()` _(callback)_
	 *  
	 *  * `onLogout()` _(callback)_
	 *  
	 *  * `onNotAuthorized()` _(callback)_
	 * 
	 * There are three options that should be used as callback functions: `onConnected()`,
	 * `onLogout()` and `onNotAthorized()`. Those are called respectively when the user
	 * logs-in, when he logs-out and when the page is loaded by a user who has loged-into
	 * Facebook but has not yet authenticated your application.
	 * 
	 * Note that the `onNotAuthorized()` callback is executed on initialization of the
	 * Connect class (pretty-much on page load), so it may be annoying to the user to
	 * prompt them to log in right away.
	 * 
	 * @access public
	 * @instance
	 * @memberOf Connect
	 * @type {Object}
	 */
	Connect.prototype.defaultInitOptions = {
		appId: '',
		xfbml: true,
		version: 'v2.7',
		scope: 'public_profile,email',
		loginButton: '.login',
		logoutButton: '.logout',
		locale: 'en_US',
		userBodyClass: 'user',
		guestBodyClass: 'guest',
		onConnected: function (response) {},
		onLogout: function (response) {},
		onNotAuthorized: function (response) {}
	};
	
	// public methods
	
	/**
	 * You can manually call the `login` method.
	 * 
	 * If the user has not yet authorized the application they will see a popup
	 * asking them for permissions, according to the scope from the init options.
	 * 
	 * If the user is not logged-into Facebook the popup will first ask them to
	 * do so and only then they will see the permissions requirements.
	 * 
	 * If the user has previously logged-in this will just take a second and will
	 * fire the `login` event once connection is reestablished.
	 * 
	 * @access public
	 * @instance
	 * @memberOf Connect
	 * @return {void}
	 */
	Connect.prototype.login = function () {
		FB.login(function (response) {
			if (response.status === 'connected') {
				handleLogin(response);
			} else {
				handleNotAuthorized(response);
			}
		}, { scope: that.options.scope });
	};
	
	/**
	 * You can manualy call the `logout` method.
	 * 
	 * This will simply log a user out of Facebook. It will not de-authorize
	 * your application, restricting it from future access.
	 * 
	 * @access public
	 * @instance
	 * @memberOf Connect
	 * @return {void}
	 */
	Connect.prototype.logout = function () {
		FB.logout(function (response) {
			handleLogout(response);
		});
	};
});
