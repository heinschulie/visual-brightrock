'use strict';
(function () {

    var instagramService = function ($http, $q) {
       
        var instagramLoginUrl = "https://instagram.com/oauth/authorize/?client_id=14e0eb16c9194c13a02a85ec0d2c7923&redirect_uri=http://localhost:22268&response_type=code";

        // -------- METHODS EXPOSED TO INTERNAL CONTROLLERS 

        var setImages = function (images, imageArray) {
            images.sort(function (a, b) {
                return a.created_time - b.created_time;
            })
            for (var i = 0; i < images.length; i++) {
                imageArray.push(images[i]);
            }
        };

        // -------- API CALLS TO INSTAGRAM SERVERS 

        //var getTagFeed = function (taginfo, accessToken) {
        //    return $http.get('https://api.instagram.com/v1/tags/' + taginfo + "/media/recent/?access_token=" + accessToken).then(function (results) {
        //        if (results.data.error) {
        //            var error = { data: { message: results.data.error } };
        //            alert(error.data.message);
        //        }
        //        return results;
        //    })
        //    .catch(function (error) {
        //        alert(error);
        //    });
        //}

        var getTagFeed = function (taginfo, accessToken) {
            var deferred = $q.defer(); 
            var feed = new Instafeed({
                get: 'tagged',
                tagName: taginfo,
                clientId: '14e0eb16c9194c13a02a85ec0d2c7923',
                success: function (results) {
                    deferred.resolve(results);
                }
            });
            feed.run();
            return deferred.promise; 
        }
        
        //var getLocationFeed = function (locationinfo, accessToken) {
        //    return $http.get(serviceBase + 'GetLocationInstagram?locationinfo=' + locationinfo + "," + accessToken).then(function (results) {
        //        if (results.data.error) {
        //            var error = { data: { message: results.data.error } };
        //            errorService.catchError(error);
        //        }
        //        return results;
        //    })
        //    .catch(function (error) {
        //        errorService.catchError(error);
        //    });
        //}

        return {
            instagramLoginUrl: instagramLoginUrl,
            getTagFeed: getTagFeed
            //getLocationFeed: getLocationFeed
        };
    };

    var module = angular.module("twitterApp");
    module.factory('instagramService', ['$http', '$q', instagramService]);

}());
