function filterInfo(){
	var rawfile = "x";
	var getNaam = rawfile.substring(rawfile.indexOf("tagnaam:") + 9, 
		rawfile.indexOf("naamtag") - 1);
	var getGitnaam = rawfile.substring(rawfile.indexOf("taggitnaam") + 12, 
		rawfile.indexOf("gitnaamtag") - 1);
	var getReponaam = rawfile.substring(rawfile.indexOf("tagreponaam") + 13, 
		rawfile.indexOf("reponaamtag") - 1);
	var getPromotor = rawfile.substring(rawfile.indexOf("tagpromotor") + 13, 
		rawfile.indexOf("promotortag") - 1);
	var getPhone = rawfile.substring(rawfile.indexOf("tagphone") + 10, 
		rawfile.indexOf("phonetag") - 1);
	var getAddress = rawfile.substring(rawfile.indexOf("tagaddress") + 12, 
		rawfile.indexOf("addresstag") - 1);

}

var app = angular.module("myapp",[]);
app.controller("myCtrl",function($http, $scope){

	var vm = this;
	$scope.value = "1";

	$http.get('https://api.github.com/').then(function(response){
		vm.data = response;
		console.log(vm.data);
	})


});