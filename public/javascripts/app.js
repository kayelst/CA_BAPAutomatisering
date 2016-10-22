var app = angular.module("myapp",[]);
var LastCommit;
var TotalCommit = 0;
app.controller("myCtrl",function($http, $scope){

	var vm = this;
	$scope.div_value = 1;
	$scope.btnstate_repostats = true;
	$scope.btnstate_Repohulp = false;
	$scope.btnstate_Scriptie = false;
	
	$scope.Btn_RepoStats = function(){
		$scope.btnstate_repostats = true;
		$scope.btnstate_Repohulp = false;
		$scope.btnstate_Scriptie = false;
		$scope.div_value = 1;
	};

	$scope.Btn_RepoHulp = function(){
		$scope.btnstate_repostats = false;
		$scope.btnstate_Repohulp = true;
		$scope.btnstate_Scriptie = false;
		$scope.div_value = 2;
	};

	$scope.Btn_Scriptie = function(){
		$scope.btnstate_repostats = false;
		$scope.btnstate_Repohulp = false;
		$scope.btnstate_Scriptie = true;
		$scope.div_value = 3;
	};

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

	$scope.RepoInfo = function(){
		$http.get('https://api.github.com/repos/kayelst/CA_BAPAutomatisering/stats/participation').then(function (response) {
			TotalCommit = 0;
			console.log(response);
			for( i = 0; i < response.data.all.length ; i++) {
				console.log("in loop");
				LastCommit = response.data.all[i];
				TotalCommit += LastCommit;
				console.log(LastCommit);
				console.log(TotalCommit);
			}
			$scope.LastCommithtml = LastCommit;
			$scope.TotalCommithtml = TotalCommit;
		});
	}


});