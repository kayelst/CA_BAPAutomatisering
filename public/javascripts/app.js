var app = angular.module("myapp",[]);
app.controller("myCtrl",function($http, $scope){

	var vm = this;
	$scope.value = "1";

	$http.get('https://api.github.com/').then(function(response){
		vm.data = response;
		console.log(vm.data);
	})


});