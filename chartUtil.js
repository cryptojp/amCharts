angular.module('myApp')
.factory('chartUtil', ['$http', function chartUtilFactory($http) {
    return {
        getHistoFromMinApi: function(type, limit, aggr, from, to) {
            var url = "https://min-api.cryptocompare.com/data/histo" + type + "?fsym=" + from + "&tsym=" + to + "&limit=" + limit + "&aggregate=" + aggr;
            return $http.get(url);
        }
    };
}]);