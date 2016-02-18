/**
 * Connect
 * 
 * @namespace fb
 * @author Georgi Popov
 * @version 1.0.0
 * @license http://www.gnu.org/licenses/gpl-3.0.en.html GPLv3
 * @uses com/magadanski/core/core.js
 * @uses com/magadanski/core/utils.js
 * @uses com/magadanski/core/EventDispatcher.js
 */

define('com.magadanski.fb.Connect', function () {
	var that;
	var utils = inc('com.magadanski.utils', true);
	
	// private properties
	var domReady = false;
	var fbReady = false;
	var initialized = false;
	
	// private methods
	function init(e) {
		if (that.getDomReady() && that.getFbReady() && !initialized) {
			FB.init({
				appId: that.options.appId,
				xfbml: that.options.xfbml,
				version: that.options.version
			});
			
			FB.getLoginStatus(function (response) {
				switch (response.status) {
					case 'connected':
						handleLogin(response);
						break;
					case 'not_authorized':
					case 'unknown':
					default:
						handleLogout(response);
						break;
				}
			});
			
			var loginButton = document.querySelector(that.options.loginButton);
			
			if (loginButton) {
				loginButton.addEventListener('click', function (e) {
					e.preventDefault();
					
					FB.login(function (response) {
						if (response.status === 'connected') {
							handleLogin(response);
						} else {
							alert('You need to log in to use the application'); // TODO: i18n
						}
					}, { scope: that.options.scope });
				});
			}
			
			var logoutButton = document.querySelector(that.options.logoutButton);
			
			if (logoutButton) {
				logoutButton.addEventListener('click', function (e) {
					e.preventDefault();
					
					FB.logout(function (response) {
						handleLogout(response);
					});
				});
			}
			
			initialized = true;
		}
	}
	
	function handleLogin(response) {
		document.body.classList.add('user');
		document.body.classList.remove('guest');
		
		if (typeof(that.options.onConnected) === 'function') {
			that.options.onConnected();
		}
		
		that.dispatchEvent('login', { response: response });
	}
	
	function handleLogout(response) {
		document.body.classList.add('guest');
		document.body.classList.remove('user');
		
		if (typeof(that.options.onLogout) === 'function') {
			that.options.onLogout();
		}
		
		that.dispatchEvent('logout', { response: response });
	}
	
	/**
	 * Facebook login helper
	 * 
	 * @class Connect
	 * @constructor
	 * @since 1.0.0
	 * @extends {core.EventDispatcher}
	 */
	var Connect = function (options) {
		that = this;
		
		// priviledged properties
		/**
		 * Initialization options
		 * 
		 * @property options
		 * @type {Object}
		 */
		that.options = utils.extendOptions(that.defaultInitOptions, options);
		
		// priviledged methods
		/**
		 * Getter for the domReady private property
		 * 
		 * @method getDomReady
		 * @return {boolean} Whether the DOM is ready or not
		 */
		that.getDomReady = function () {
			return domReady = (document.readyState == "complete" || document.readyState == "loaded" || document.readyState == "interactive");
		};
		
		/**
		 * Setter, which calls the getter as the value is auto-set.
		 * 
		 * @method setDomReady
		 */
		that.setDomReady = function () {
			that.getDomReady();
		};
		
		/**
		 * Getter for the fbReady private property
		 * 
		 * @method getFbReady
		 * @return {boolean} Whether the FB JS SDK has been loaded and initialized
		 */
		that.getFbReady = function () {
			return fbReady;
		};
		
		/**
		 * Setter for the fbReady private property
		 * 
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
		 * @method getInitialized
		 * @return {boolean} Whether the FB Login has been initialized
		 */
		that.getInitialized = function () {
			return initialized;
		};
		
		/**
		 * Helper method for accessing FB.api
		 * 
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

		document.addEventListener('DOMContentLoaded', function (e) {
			that.setDomReady();
		});
		
		that.addEventListener('domReadyChanged fbReadyChanged', init);
	}
	Connect.inherits(com.magadanski.core.EventDispatcher);
	com.magadanski.fb.Connect = Connect;
	
	// public properties
	/**
	 * The default initialization options
	 * 
	 * @type {Object}
	 */
	Connect.prototype.defaultInitOptions = {
		appId: '',
		xfbml: true,
		version: 'v2.5',
		scope: 'public_profile,email',
		onConnected: function () {},
		onLogout: function () {},
		loginButton: '.login',
		logoutButton: '.logout'
	};
	
	// public methods
	// Connect.protytype.functionName = function () {}
});
