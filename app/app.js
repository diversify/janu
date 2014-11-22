var app = angular.module('janu', ['ngRoute']);

    app.config(function ($routeProvider, $locationProvider) {
        $locationProvider.html5Mode(true);
        $routeProvider
            .when('/test', 
                {
                    controller: 'januController',
                    templateUrl: '/app/partials/test.html'
                })
            
            .otherwise({ redirectTo: '/' });
    });

    app.config(function ($httpProvider) {
        app.$httpProvider = $httpProvider;
    });