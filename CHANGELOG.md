# Change Log

## future development

## [1.0.4 Update default version of FB Graph API to 2.7](https://github.com/magadanskiuchen/com.magadanski.fb/releases/tag/1.0.4) (2016-09-10)

[Full changelog](https://github.com/magadanskiuchen/com.magadanski.fb/compare/1.0.3...1.0.4)

By default **2.7** will be passed as `version` option upon instantiating a new `com.magadanski.fb.Connect` object.

Read more about version 2.7 at [https://developers.facebook.com/blog/post/2016/07/14/graph-api-v27/](https://developers.facebook.com/blog/post/2016/07/14/graph-api-v27/)

## [1.0.3 Duplicate events fix, body class options, updated docs](https://github.com/magadanskiuchen/com.magadanski.fb/releases/tag/1.0.3) (2016-05-29)

[Full changelog](https://github.com/magadanskiuchen/com.magadanski.fb/compare/1.0.2...1.0.3)

Remove duplicate event firing on init.

Add options to control user and guest body classes. Closed [`user` and `guest` classes assigned to the body are too generic](https://github.com/magadanskiuchen/com.magadanski.fb/issues/2) issue.

Update default version of FB's JS SDK to 2.6.

## [1.0.2 FB JS SDK now loaded from within the Connect class](https://github.com/magadanskiuchen/com.magadanski.fb/releases/tag/1.0.2) (2016-04-09)

[Full changelog](https://github.com/magadanskiuchen/com.magadanski.fb/compare/1.0.1...1.0.2)

Load FB JS SDK through the class, instead of having it as dependency.

## [1.0.1 Event handler fix, new callback and public methods, updates to documentation](https://github.com/magadanskiuchen/com.magadanski.fb/releases/tag/1.0.1) (2016-02-20)

[Full changelog](https://github.com/magadanskiuchen/com.magadanski.fb/compare/1.0.0...1.0.1)

Closed [Login alert error message is in pure English](https://github.com/magadanskiuchen/com.magadanski.fb/issues/1) issue.

Add `onNotAuthorized` callback.

Add `login()` and `logout()` public methods.

## [1.0.0 Initial Release](https://github.com/magadanskiuchen/com.magadanski.fb/releases/tag/1.0.0) (2016-02-18)

[Full changelog](https://github.com/magadanskiuchen/com.magadanski.fb/compare/be45ec0379daa4f277972ae53b597fff586e1474...1.0.0)

Initial version of the `com.magadanski.fb` package.