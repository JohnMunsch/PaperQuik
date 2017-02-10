/**
 * @license Angulartics
 * (c) 2013 Luis Farzati http://luisfarzati.github.io/angulartics
 * Google Tag Manager Plugin Contributed by http://github.com/danrowe49
 * License: MIT
 */

(function(angular){
'use strict';


/**
 * @ngdoc overview
 * @name angulartics.google.analytics
 * Enables analytics support for Google Tag Manager (http://google.com/tagmanager)
 */

angular.module('angulartics.google.tagmanager', ['angulartics'])
.config(['$analyticsProvider', function($analyticsProvider){

    /**
    * Send content views to the dataLayer
    *
    * @param {string} path Required 'content name' (string) describes the content loaded
    */

    $analyticsProvider.registerPageTrack(function(path){
        var dataLayer = window.dataLayer = window.dataLayer || [];
        dataLayer.push({
            'event': 'content-view',
            'content-name': path
        });
    });

    /**
   * Send interactions to the dataLayer, i.e. for event tracking in Google Analytics
   * @name eventTrack
   *
   * @param {string} action Required 'action' (string) associated with the event
   * @param {object} properties Comprised of the mandatory field 'category' (string) and optional  fields 'label' (string), 'value' (integer) and 'noninteraction' (boolean)
   */

    $analyticsProvider.registerEventTrack(function(action, properties){
        var dataLayer = window.dataLayer = window.dataLayer || [];
        properties = properties || {};
        dataLayer.push({
            'event': properties.event || 'interaction',
            'target': properties.category,
            'action': action,
            'target-properties': properties.label,
            'value': properties.value,
            'interaction-type': properties.noninteraction
        });

    });

    $analyticsProvider.registerSetUsername(
  		/**
  		 * Send user's data to the datalayer, i.e. for user tracking in Google Analytics
  		 * @param  {string} username   login of the username
  		 * @param  {object} properties List of attribute of the current username
  		 * @return {void}
  		 */
  		function (username, properties) {
  			var dataLayer = window.dataLayer = window.dataLayer || [];
  				properties = properties || {};
    			dataLayer.push({
    				'username': username,
    				'user': properties
    			});
  	  }
  	);
}]);

})(angular);
