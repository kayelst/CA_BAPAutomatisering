angular.module("myapp",[]);
angular.module("myapp2",["ngAnimate"]);
var LastCommit;
var TotalCommit = 0;
var Autho = "?client_id=651b11583f0162b4cc91&client_secret=e42b41de694254d711122267d88d3bd884ad2de4";
var PreviousAmount = 0;

angular.module("theapp",['myapp','myapp2']).controller("myCtrl",function($http, $scope, $templateCache){
	var apiCallRepoInfo = "https://api.github.com/repos/MyOrg1617/BAP1617_";
	var apiCallScriptie = "https://api.github.com/repos/MyOrg1617/BAP1617_";
	var apiCallAllStudents = "https://api.github.com/orgs/MyOrg1617/repos";
	var apiCallInfo = "https://api.github.com/repos/MyOrg1617/BAP1617_";
	var apiCallInfo2 = "/contents/Info.md";
	var apiCallLogCommits = "https://api.github.com/repos/MyOrg1617/BAP1617_";
	
	//BryanCalls
	

	//KayCalls


	//var apiCallInfo2 = "/contents/README.md";

	/*$http({method: 'GET', url: '/UserInfo'}).
	success(function(data, status, headers, config) {
		console.log('todos: ', data );
	}).
	error(function(data, status, headers, config) {
		console.log('Oops and error', data);
	});*/

	$http.get( "/UserInfo").success(function( data ) {
		$scope.A= data; //from your sample;
		console.log( "Load was performed. " + data );
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

	var RepoName;

	$scope.RepoNames = [];

	$scope.apiAllStudentsCall = function() {
		console.log("apiCallAllStudents");
		$http.get(apiCallAllStudents + Autho).then(function (response){
			console.log(response);
			for (i = 0; i < response.data.length; i++) {
				console.log("Looping - " + [i]);
				RepoName = response.data[i].name;
				if (RepoName.indexOf("BAP1617") !== -1) {
					//RepoName Filteren zodat BAP1617_LameirBryan => Lameir Bryan word
					RepoName = RepoName.substring(8);
					$scope.RepoNames.push(RepoName);
				}
			};
			
			console.log($scope.RepoNames);
		});
	};

	$scope.do = function(x){
		$http.get(apiCallInfo + x + apiCallInfo2 + Autho).then(function (response) {
			rawfileLink = response.data.download_url;
			$http.get(rawfileLink).then(function (response) {
				console.log(response.data);
				rawInfoFile = response.data;
				filterInfo(rawInfoFile);
			});

		});

		$http.get(apiCallInfo + x + Autho).then(function (response){
			RepoLink = response.data.html_url;
			$scope.getRepoLink = RepoLink;
		});

		var rawInfoFile;

		function filterInfo(rawInfoFile) {
			var getNaam = rawInfoFile.substring(rawInfoFile.indexOf("tagnaam") + 8,
				rawInfoFile.indexOf("naamtag") - 1);
			var getGitnaam = rawInfoFile.substring(rawInfoFile.indexOf("taggitnaam") + 11,
				rawInfoFile.indexOf("gitnaamtag") - 1);
			var getReponaam = rawInfoFile.substring(rawInfoFile.indexOf("tagreponaam") + 12,
				rawInfoFile.indexOf("reponaamtag") - 1);
			var getPromotor = rawInfoFile.substring(rawInfoFile.indexOf("tagpromotor") + 12,
				rawInfoFile.indexOf("promotortag") - 1);
			var getPhone = rawInfoFile.substring(rawInfoFile.indexOf("tagphone") + 9,
				rawInfoFile.indexOf("phonetag") - 1);
			var getAddress = rawInfoFile.substring(rawInfoFile.indexOf("tagaddress") + 11,
				rawInfoFile.indexOf("addresstag") - 1);
			$scope.SiteNaam = getNaam;
			$scope.getGitNaam = getGitnaam;
			$scope.getReponaam = getReponaam;
			$scope.getPromotor = getPromotor;
			$scope.getPhone = getPhone;
			$scope.getAddress = getAddress;
		};

		$scope.RepoInfo = function(){
			$http.get(apiCallRepoInfo + x + "/stats/participation" + Autho).then(function (response) {
				TotalCommit = 0;
				console.log(response);
				for( i = 0; i < response.data.all.length ; i++) {
					LastCommit = response.data.all[i];
					TotalCommit += LastCommit;
				}
				$scope.LastCommithtml = LastCommit;
				$scope.TotalCommithtml = TotalCommit;
			});

			var currentdate = new Date();
			var datetime = currentdate.getFullYear() + "-"
				+ (currentdate.getMonth()+1)  + "-"
				+ currentdate.getDate() + "T"
				+ currentdate.getHours() + ":"
				+ currentdate.getMinutes() + ":"
				+ currentdate.getSeconds() + "Z";
			console.log(datetime);

			$http.get(apiCallLogCommits + x +"/commits" + Autho +"&path=Logfiles&until=" + datetime).then(function(response){
				var CurrentAmount = response.data.length;
				console.log(CurrentAmount);
				if (CurrentAmount > PreviousAmount){
					console.log("Logs have been added");
					PreviousAmount = CurrentAmount;
				}
			});

		};

		$scope.GetScriptie = function() {
			$http.get(apiCallScriptie + x + "/contents/scriptie/Scriptie.md" + Autho ).then(function (response) {
				rawScriptieLink = response.data.download_url;
				$http.get(rawScriptieLink).then(function (response) {
					console.log(response.data);
					$scope.ScriptieData = response.data;
				});
			});
		};

	};


});

