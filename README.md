# com.magadanski.fb

### Facebook JS Helpers

This package is part of the com.magadanski JS framework and has dependencies on the com.magadanski.core package including:

0. com.magadanski.core.core

0. com.magadanski.core.utils

0. com.magadanski.com.EventDispatcher

Use `npm` or `bower` to install the package to your project along with necessary dependencies by typing:

```
npm install com.magadanski.fb
```

or

```
bower install com.magadanski.fb
```

## Basic Usage

Instantiate the class as:

```javascript
var conn = new com.magadanski.fb.Connect({
	appId: '', // enter FB App ID here; create an application from https://developers.facebook.com/apps
	xfbml: true, // whether to parse XFBML tags
	version: 'v2.7', // what version of the JS SDK is to be included
	scope: 'public_profile,email', // what permissions are required
	loginButton: '.login', // CSS selector to the element you'd like to use as a "Login" button
	logoutButton: '.logout', // CSS selector to the element you'd like to use as a "Logout" button
	locale: 'en_US', // locale of the SDK to load
	userBodyClass: 'user', // class applied to the body upon profile connection
	guestBodyClass: 'guest', // class applied to the body upon profile disconnection
	onConnected: function (response) {}, // callback for when a user has connected their FB account
	onLogout: function (response) {}, // callback when a user has logged out
	onNotAuthorized: function (response) {} // callback when a user has clicked on the "Login" button but has rejected the request for permissions
});
```

When instantiated the class automatically asynchronously loads the FB SDK.

After the FB SDK is loaded and the DOMContentLoaded event fires the `init` method of the class. This method initializes the FB SDK, checks the current user's status (`connected`, `not_authorized` or `uknown`).

Based on this status a corresponding event of `login`, `not_authorized` or `logout` is dispatched.

If the status of the user changes then associated events are dispatched as well.

Based on options set for "login" and "logout" buttons necessary functionality is assigned to those.

### Initialization Options

* `appId` _(string)_ -- the only required option
	
	If you do not pass that none of the functionality will get executed.
	
* `xfbml` _(boolean)_ -- default value us `true`
	
	Simply forwarded to FBs SDK, denoting whether XFBML tags on the page should be parsed.
	
* `version` _(string)_ -- default value is `'v2.7'`
	
	Another option passed to FBs SDK. This denotes that your code would expect functionality for that version of the API.
	
* `scope` _(string)_ -- default value is `'public_profile,email'`
	
	You should pass a string with comma delimited permissions that your application needs as the `scope` option.
	
	Note that requesting permissions is not equal to receiving them. Facebook allows users to connect to your application providing access to just some of the information you've asked for. So if you're calling an API method that relies on special permissions it is a good idea to always double-check them.
	
	The `api` method of the class has a built-in way to double-check permissions, so just pass a string of those when calling it.
	
	Also, requesting too much permissions from the start may cause users reject your application (in case they are not acquainted with the option to simply disable them -- few users are).
	
	It is advised that the original login only requires some basic public profile information for the users and when you get to a meaningful situation where you need the permissions for some API method -- you can double check for the permissions even if those were not originally present in the `scope` option. This will just ask the users for additional permissions.
	
* `loginButton` _(string)_ -- default value is `'.login'`
	
	Pass a CSS selector for the `loginButton` option to hook proper login event handlers to the button.
	
* `logoutButton` _(string)_ -- default value is `'.logout'`
	
	Similar to the `loginButton` one.

* `locale` _(string)_ -- default value is `'en_US'`
	
	This is used when building the URL for the FB SDK to load.
	
	The SDK is available as multiple languages at different URLs, so you need to load the proper one in order for your application to be localized.
	
	You can pass a locale here as '`{language_code}_{country_code}`' where `{language_code}` is a two-lowercase representation of the language (for example 'en' or 'pt') and `{country_code}` is a two-lowercase representation of the country (for example 'US' or 'GB' in case for English and 'BR' or 'PT' for Portuguese).

* `userBodyClass` _(string)_ -- default value is `'user'`
	
	This class is assigned to the body tag after successful connection to the user's account is established.

* `guestBodyClass` _(string)_ -- default value is `'guest'`
	
	This class is assigned to the body tag if a user logs out of FB when on the site or if they do not authorize the application.

* `onConnected()` _(callback)_
 
* `onLogout()` _(callback)_
 
* `onNotAuthorized()` _(callback)_

There are three options that should be used as callback functions: `onConnected()`, `onLogout()` and `onNotAthorized()`. Those are called respectively when the user logs-in, when he logs-out and when the page is loaded by a user who has loged-into Facebook but has not yet authenticated your application.

Note that the `onNotAuthorized()` callback is executed on initialization of the Connect class (pretty-much on page load), so it may be annoying to the user to prompt them to log in right away.

## Further Functionality

You can use the `api()` method of the class to query for additional parameters such as the user's avatar for example:

```javascript
conn.api('/me/picture/?width=200&height=200', function (response) {
	if (typeof(response.data.url) !== 'undefined') {
		avatar.attr('src', response.data.url);
	}
});
```

The above example will query for a URL to the user's avatar with specific dimensions of 200x200 pixels.

Refer to Facebook's Graph API Documentation on available API calls: https://developers.facebook.com/docs/graph-api

## Language Reference

For more information on this and other packages of the JS framework please refer to the [com.magadanski JS Framework Language Reference](http://magadanskiuchen.github.io/com.magadanski.core/Connect.html)