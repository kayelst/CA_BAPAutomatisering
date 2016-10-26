angular.module("myapp",[]);
angular.module("myapp2",["ngAnimate"]);
var LastCommit;
var TotalCommit = 0;
angular.module("theapp",['myapp','myapp2']).controller("myCtrl",function($http, $scope, $templateCache){

	var apiCallInfoFile = "https://api.github.com/repos/kayelst/CA_BAPAutomatisering/contents/README.md";
	var apiCallRepoInfo = "https://api.github.com/repos/kayelst/CA_BAPAutomatisering/stats/participation";
	var apiCallRepoLink = "https://api.github.com/repos/kayelst/CA_BAPAutomatisering";
	var apiCallRepoNames = "https://api.github.com/orgs/AP-Elektronica-ICT/repos";

	/*$http({method: 'GET', url: '/UserInfo'}).
	success(function(data, status, headers, config) {
		console.log('todos: ', data );
	}).
	error(function(data, status, headers, config) {
		console.log('Oops and error', data);
	});*/

	$http.get( "/UserInfo").success(function( data ) {
		$scope.A= data; //from your sample;
		alert( "Load was performed. " + data );
	});

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

		$http.get(apiCallInfoFile).then(function (response) {
			rawfileLink = response.data.download_url;
			$http.get(rawfileLink).then(function (response) {
				console.log(response.data);
				rawfile = response.data;
				filterInfo(rawfile);
			})

		});

		$http.get(apiCallRepoLink).then(function (response){
			RepoLink = response.data.html_url;
			$scope.getRepoLink = RepoLink;
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
		$http.get(apiCallRepoInfo).then(function (response) {
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
	};

	var RepoName;

	$scope.RepoNames = [];

	$scope.apiRepoCall = function() {
		console.log("apiRepoCall");
		$http.get(apiCallRepoNames).then(function (response){
			console.log(response);
			for (i = 0; i < response.data.length; i++) {
				console.log("Looping - " + [i]);
				RepoName = response.data[i].name;
				$scope.RepoNames.push(RepoName);

			};
			
			console.log($scope.RepoNames);
		});
	};


});

