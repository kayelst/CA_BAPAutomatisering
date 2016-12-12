angular.module("myapp",[]);
angular.module("myapp2",["ngAnimate"]);
var LastCommit;
var TotalCommit = 0;
var PreviousAmount = 0;
var Autho = "?client_id=651b11583f0162b4cc91&client_secret=68645eb111af8b05bc8fa1f505712fd3eb213298";
var client_id = "?client_id=651b11583f0162b4cc91"
var UserCode = window.location.search;

angular.module("theapp",['myapp','myapp2']).controller("myCtrl",function($http, $scope, $templateCache) {
	var apiCallRepoInfo = "https://api.github.com/repos/MyOrg1617/BAP1617_";
	var apiCallScriptie = "https://api.github.com/repos/MyOrg1617/BAP1617_";
	var apiCallAllStudents = "https://api.github.com/orgs/MyOrg1617/repos";
	var apiCallInfo = "https://api.github.com/repos/MyOrg1617/BAP1617_";
	var apiCallInfo2 = "/contents/Info.md";
	var apiCallLogCommits = "https://api.github.com/repos/MyOrg1617/BAP1617_";

	//BryanCalls
	var apiLogin = "https://github.com/login/oauth/authorize"
	var UserToken = "https://github.com/login/oauth/access_token"
	var apiAllIssuesCall = "https://api.github.com/repos/MyOrg1617/BAP1617_IssueTest/issues"
	
	//KayCalls

	var apiCallCommits = "https://api.github.com/repos/kayelst/CA_BAPAutomatisering/commits";
	var apiCallComment = "https://api.github.com/repos/kayelst/CA_BAPAutomatisering/commits/";


	// onload
	console.log(UserCode);
	UserCode = UserCode.replace('?code=', '&');
	console.log(UserCode);
	$http.post(UserToken + Autho, {"body": UserCode});


	//$http.post(UserToken + Autho + UserCode);

	//window.location.replace(UserToken + Autho + UserCode);

	//var apiCallInfo2 = "/contents/README.md";

	/*$http({method: 'GET', url: '/UserInfo'}).
	 success(function(data, status, headers, config) {
	 console.log('todos: ', data );
	 }).
	 error(function(data, status, headers, config) {
	 console.log('Oops and error', data);
	});*/

	$http.get("/UserInfo").success(function (data) {
		$scope.A = data; //from your sample;
		console.log("Load was performed. " + data);
	});

	$scope.div_value = 1;
	$scope.btnstate_repostats = true;
	$scope.btnstate_Repohulp = false;
	$scope.btnstate_Scriptie = false;

	$scope.Btn_RepoStats = function () {
		$scope.btnstate_repostats = true;
		$scope.btnstate_Repohulp = false;
		$scope.btnstate_Scriptie = false;
		$scope.div_value = 1;
	};

	$scope.Btn_RepoHulp = function () {
		$scope.btnstate_repostats = false;
		$scope.btnstate_Repohulp = true;
		$scope.btnstate_Scriptie = false;
		$scope.div_value = 2;
	};

	$scope.Btn_Scriptie = function () {
		$scope.btnstate_repostats = false;
		$scope.btnstate_Repohulp = false;
		$scope.btnstate_Scriptie = true;
		$scope.div_value = 3;
	};

	$scope.div_val = 1;
	$scope.btnstate_Issues = false;
	$scope.btnstate_Commits = true;

	$scope.Btn_Commits = function(){
		$scope.btnstate_Issues = false;
		$scope.btnstate_Commits = true;
		$scope.div_val = 1;
		$scope.GetCommits();
	};

	$scope.Btn_Issues = function(){
		$scope.btnstate_Issues = true;
		$scope.btnstate_Commits = false;
		$scope.div_val = 2;
		$scope.Issues();
	};

	var RepoName;

	$scope.RepoNames = [];

	$scope.apiAllStudentsCall = function () {
		console.log(window.location.search);
		console.log(UserCode);

		console.log("apiCallAllStudents");
		$http.get(apiCallAllStudents + Autho).then(function (response) {
			console.log(response);
			for (i = 0; i < response.data.length; i++) {
				console.log("Looping - " + [i]);
				RepoName = response.data[i].name;
				if (RepoName.indexOf("BAP1617") !== -1) {
					//RepoName Filteren zodat BAP1617_LameirBryan => Lameir Bryan word
					RepoName = RepoName.substring(8);
					$scope.RepoNames.push(RepoName);
				}
				;

				console.log($scope.RepoNames);
			}
			;

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

		$http.get(apiCallInfo + x + Autho).then(function (response) {
			RepoLink = response.data.html_url;
			$scope.getRepoLink = RepoLink;
		});

		var rawInfoFile;

		function filterInfo(rawInfoFile) {
			var getNaam = rawInfoFile.substring(rawInfoFile.indexOf("<!---naam -->") + 13,
				rawInfoFile.indexOf("<!---gitnaam -->") - 1);
			var getGitnaam = rawInfoFile.substring(rawInfoFile.indexOf("<!---gitnaam -->") + 16,
				rawInfoFile.indexOf("<!---reponaam -->") - 1);
			var getReponaam = rawInfoFile.substring(rawInfoFile.indexOf("<!---reponaam -->") + 17,
				rawInfoFile.indexOf("<!---promotor -->") - 1);
			var getPromotor = rawInfoFile.substring(rawInfoFile.indexOf("<!---promotor -->") + 17,
				rawInfoFile.indexOf("<!---phone -->") - 1);
			var getPhone = rawInfoFile.substring(rawInfoFile.indexOf("<!---phone -->") + 14,
				rawInfoFile.indexOf("<!---address -->") - 1);
			var getAddress = rawInfoFile.substring(rawInfoFile.indexOf("<!---address -->") + 16,
				rawInfoFile.indexOf("<!---end -->") - 1);
			$scope.SiteNaam = getNaam;
			$scope.getGitNaam = getGitnaam;
			$scope.getReponaam = getReponaam;
			$scope.getPromotor = getPromotor;
			$scope.getPhone = getPhone;
			$scope.getAddress = getAddress;
		};

		$scope.RepoInfo = function () {
			$http.get(apiCallRepoInfo + x + "/stats/participation" + Autho).then(function (response) {
				CommitMessages = [];
				shaArray = [];
				TotalCommit = 0;
				console.log(response);
				for (i = 0; i < response.data.all.length; i++) {
					LastCommit = response.data.all[i];
					TotalCommit += LastCommit;
				}
				$scope.LastCommithtml = LastCommit;
				$scope.TotalCommithtml = TotalCommit;
			});

			var currentdate = new Date();
			var datetime = currentdate.getFullYear() + "-"
			+ (currentdate.getMonth() + 1) + "-"
			+ currentdate.getDate() + "T"
			+ currentdate.getHours() + ":"
			+ currentdate.getMinutes() + ":"
			+ currentdate.getSeconds() + "Z";
			console.log(datetime);

			$http.get(apiCallLogCommits + x + "/commits" + Autho + "&path=Logfiles&until=" + datetime).then(function (response) {
				var CurrentAmount = response.data.length;
				console.log(CurrentAmount);
				if (CurrentAmount > PreviousAmount) {
					console.log("Logs have been added");
					PreviousAmount = CurrentAmount;
				}
			});

			$scope.GetCommits = function () {
				$http.get(apiCallCommits + Autho).then(function (response) {
					for (i = 0; i < response.data.length; i++) {
						CommitMessages.push(response.data[i].commit.message);
						$scope.AllCommits = CommitMessages;
						shaArray.push(response.data[i].sha);
					}
				});
			};

			$scope.idCommit = null;
			$scope.SelectCommit = function (index) {
				console.log(index);
				console.log(CommitMessages[index]);
				console.log(shaArray[index]);
				CommentSha = shaArray[index];
				CommentInfo = "test";
				var CommentInfo = prompt("Please enter your Comment for " + CommitMessages[index], "Comment");
				if(CommentInfo != null) {
					console.log("Posting comment");
					console.log(CommentInfo);
					var config = {headers: {'Content-Type': 'application/json'}};
					$http.post(apiCallComment + CommentSha + "/comments" + Autho, {'body': CommentInfo}, config).then(function (res) {
						console.log(res);
					});
					console.log("Comment was filled");
				}
				else {
					Window.alert("Please Fill out a valid comment");
				}
			}
		}
	};

	$scope.GetScriptie = function () {
		$http.get(apiCallScriptie + x + "/contents/scriptie/Scriptie.md" + Autho).then(function (response) {
			rawScriptieLink = response.data.download_url;
			$http.get(rawScriptieLink).then(function (response) {
				console.log(response.data);
				ScriptieRaw = response.data;

				Converter = new showdown.Converter();
				ScriptieHtml = Converter.makeHtml(ScriptieRaw);
				$scope.ScriptieData = $sce.trustAsHtml(ScriptieHtml);
			});
		});
	};
	
		//Login
		$scope.SignIn = function () {

			window.location.replace(apiLogin + client_id);

		};
	//Issues
	var IssueBody;
	var IssueTitel;
	var IssueNumber;
	var IssueState;
	$scope.IssueBodys = [];
	$scope.IssueTitels = [];
	$scope.IssueNumbers = [];
	$scope.IssueStates = [];
	$scope.Repeat = [];

	$scope.Issues = function(){
		$http.get(apiAllIssuesCall + Autho).then(function (response){
			console.log(response);

			for (var x = 0; x < response.data.length; x++) {
				console.log("Looping - " + [x])
				IssueBody = response.data[x].body;
				IssueTitel = response.data[x].title;
				IssueNumber = response.data[x].number;
				IssueState = response.data[x].state;

				$scope.IssueBodys.push(IssueBody);
				$scope.IssueTitels.push(IssueTitel);
				$scope.IssueNumbers.push(IssueNumber);
				$scope.IssueStates.push(IssueState);
				$scope.Repeat.push(IssueNumber - 1);

				//console.log(IssueBodys);
				//console.log(IssueTitels);
				//console.log(IssueNumbers);

			};
		});
	};

});
