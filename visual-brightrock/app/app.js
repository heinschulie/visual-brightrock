
var app = angular.module('twitterApp', ['ngSanitize', 'ngRoute', 'd3']);

app.config(function ($routeProvider) {

    $routeProvider.when("/home", {
        controller: "homeController",
        templateUrl: "/app/views/home.html"
    });

    //FINALLY

    $routeProvider.otherwise({
        redirectTo: "/home"
    });

});

app.config(['$httpProvider', function($httpProvider) {
    //$httpProvider.defaults.withCredentials = true;
    //Enable cross domain calls
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
        $httpProvider.defaults.useXDomain = true;
}])

app.filter('trusted', ['$sce', function ($sce) {
    return function (url) {
        return $sce.trustAsResourceUrl(url);
    };
}]);
//app.config(function ($httpProvider) {
//    $httpProvider.interceptors.push('authInterceptorService');

//    //Enable cross domain calls
//    delete $httpProvider.defaults.headers.common['X-Requested-With'];
//    $httpProvider.defaults.useXDomain = true;
//});
