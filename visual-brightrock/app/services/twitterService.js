
'use strict';
(function () {

    var twitterService = function ($q) {

        var authorizationResult = false;

        var initialize = function () {
            //initialize OAuth.io with public key of the application
            OAuth.initialize('19gVB-kbrzsJWQs5o7Ha2LIeX4I', {
                cache: true
            });
            //try to create an authorization result when the page loads,
            // this means a returning user won't have to click the twitter button again
            authorizationResult = OAuth.create("twitter");
        };

        var isReady = function () {
            return (authorizationResult);
        };

        var connectTwitter = function () {
            var deferred = $q.defer();
            OAuth.popup("twitter", {
                cache: true
            }, function (error, result) {
                // cache means to execute the callback if the tokens are already present
                if (!error) {
                    authorizationResult = result;
                    deferred.resolve();
                } else {
                    //do something if there's an error

                }
            });
            return deferred.promise;
        };

        var clearCache = function () {
            OAuth.clearCache('twitter');
            authorizationResult = false;
        };

        var getLatestTweets = function (maxId, searchterm) {
            //create a deferred object using Angular's $q service
            var deferred = $q.defer();
            var url = '/1.1/search/tweets.json?q=%23' + searchterm;// + '&geocode=51.5286416,-0.1015987,200km';
            if (maxId) {
                url += '?max_id=' + maxId;
            }
            var promise = authorizationResult.get(url).done(function (data) {
                // https://dev.twitter.com/docs/api/1.1/get/statuses/home_timeline
                // when the data is retrieved resolve the deferred object
                deferred.resolve(data);
            }).fail(function (err) {
                deferred.reject(err);
            });
            //return the promise of the deferred object
            return deferred.promise;
        };

        return {
            initialize: initialize,
            isReady: isReady,
            connectTwitter: connectTwitter,
            clearCache: clearCache,
            getLatestTweets: getLatestTweets
        }
    };
    var module = angular.module("twitterApp");
    module.factory('twitterService', ['$q', twitterService]);

}());