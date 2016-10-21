var app = angular.module("myapp",[]);
app.controller("myCtrl",function($http, $scope){

	/*$scope.GetFile = function(){
	 Console.log("In Function")
	 $http.get('https://raw.githubusercontent.com/kayelst/do_Ansible_ElstKay/master/README.md/').then(function(response){
	 console.log(response);
	 })
	}*/

	var vm = this;
	$scope.isActive = false;

	$scope.toggleActive = function() {
		$scope.value = '1';
		$scope.isActive = !$scope.isActive;
	}

	$scope.GetFile = function() {

		$http.get('https://api.github.com/repos/kayelst/CA_BAPAutomatisering/contents/README.md').then(function (response) {
			rawfileLink = response.data.download_url;
			$http.get(rawfileLink).then(function (response) {
				console.log(response.data);
				rawfile = response.data;
				filterInfo(rawfile);
			})

		});

		var rawfile;

		function filterInfo(rawfile) {
			var getNaam = rawfile.substring(rawfile.indexOf("tagnaam") + 8,
				rawfile.indexOf("naamtag") - 1);
			var getGitnaam = rawfile.substring(rawfile.indexOf("taggitnaam") + 11,
				rawfile.indexOf("gitnaamtag") - 1);
			var getReponaam = rawfile.substring(rawfile.indexOf("tagreponaam") + 12,
				rawfile.indexOf("reponaamtag") - 1);
			var getPromotor = rawfile.substring(rawfile.indexOf("tagpromotor") + 12,
				rawfile.indexOf("promotortag") - 1);
			var getPhone = rawfile.substring(rawfile.indexOf("tagphone") + 9,
				rawfile.indexOf("phonetag") - 1);
			var getAddress = rawfile.substring(rawfile.indexOf("tagaddress") + 11,
				rawfile.indexOf("addresstag") - 1);
			$scope.SiteNaam = getNaam;
			$scope.getGitNaam = getGitnaam;
			$scope.getReponaam = getReponaam;
			$scope.getPromotor = getPromotor;
			$scope.getPhone = getPhone;
			$scope.getAddress = getAddress;
		}
	};

	/*$scope.RepoInfo = function(){
		$http.get('https://api.github.com/repos/kayelst/CA_BAPAutomizer/stats/contributors').then(function (response) {
	});
*/

});