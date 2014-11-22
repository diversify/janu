var app = angular.module('janu', ['ngRoute']);

    app.config(function ($routeProvider, $locationProvider) {
        $locationProvider.html5Mode(true);
        $routeProvider
            .when('/test', 
                {
                    controller: 'januController',
                    templateUrl: '/app/partials/test.html'
                })
            .when('/game', 
                {
                    controller: 'januController',
                    templateUrl: '/app/partials/game.html'
                })
            .when('/', 
                {
                    controller: 'januController',
                    templateUrl: '/app/partials/game.html'
                })
            .when('/start', 
                {
                    controller: 'januController',
                    templateUrl: '/app/partials/start.html'
                })
            .when('/end', 
                {
                    controller: 'januController',
                    templateUrl: '/app/partials/end.html'
                })
            .otherwise({ redirectTo: '/' });
    });

    app.config(function ($httpProvider) {
        app.$httpProvider = $httpProvider;
    });