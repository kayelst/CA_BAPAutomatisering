angular.module("myapp",[]);
angular.module("myapp2",["ngAnimate"]);

angular.module("theapp",['myapp','myapp2']).controller("myCtrl",function($http, $scope, $templateCache, $sce) {
	var LastCommit;
	var TotalCommit = 0;
	var PreviousAmount = 0;
	var Usercode;
	var UserCode = window.location.search;
	var CommitMessages = [];
	var shaArray = [];
	var ParticipationArray = [];
	var zerocounter = 0;
	var OauthToken;
	var LastCommitDate = new Date();
	var datetime = new Date();
	var MondayDate = new Date();
	var NextMondayDate = new Date();


	var apiCallRepoInfo = "https://api.github.com/repos/MyOrg1617/BAP1617_";
	var apiCallScriptie = "https://api.github.com/repos/MyOrg1617/BAP1617_";
	var apiCallAllStudents = "https://api.github.com/orgs/MyOrg1617/repos";
	var apiCallInfo = "https://api.github.com/repos/MyOrg1617/BAP1617_";
	var apiCallInfo2 = "/contents/Info.md";
	var apiCallInfoLog = "/contents/Logfiles/LOG.md";
	var apiCallLogCommits = "https://api.github.com/repos/MyOrg1617/BAP1617_";
	var Access = "?access_token=a67d824f6631ee92ff0ccd6f2698ddd8ed7170cf";
	var Participation = "https://api.github.com/repos/kayelst/CA_BAPAutomatisering/stats/participation";
	var client_id = "?client_id=651b11583f0162b4cc91";


	//BryanCalls
	var apiLogin = "https://github.com/login/oauth/authorize";
	//var UserToken = "https://github.com/login/oauth/access_token";
	var apiAllIssuesCall = "https://api.github.com/repos/MyOrg1617/BAP1617_";
	var TijdelijkeOauth = "?client_id=651b11583f0162b4cc91&client_secret=cc5f94be35b0ccf9891b55dd6d670f3f7cf29388"


	Converter = new showdown.Converter();

	//KayCalls

	var apiCallCommits = "https://api.github.com/repos/MyOrg1617/BAP1617_";


	// onload


	var currentdate = new Date();
	var yyyy = currentdate.getFullYear();
	var mm = currentdate.getMonth() + 1;
	var dd = currentdate.getDate();
	var hh = currentdate.getHours();
	var mi = currentdate.getMinutes();
	var ss = currentdate.getSeconds();
	var ddMonday = currentdate.getDate() - currentdate.getDay() - 6;
	var ddNextMonday = currentdate.getDate() - currentdate.getDay() + 1;

	if( mm < 10)
		 mm = "0"+mm;
	if (dd < 10)
		dd = "0"+dd;
	if (hh < 10)
		hh = "0"+hh;
	if (mi < 10)
		mi = "0"+mi;
	if (ss < 10)
		ss = "0"+ss;
	if (ddMonday < 10)
		ddMonday= "0"+ddMonday;
	if (ddNextMonday < 10)
		ddNextMonday = "0"+ddNextMonday;

	datetime = yyyy+"-"+mm+"-"+dd+"T"+hh+":"+mi+":"+ss+"Z";
	console.log(datetime);

	MondayDate = ddMonday+"/"+mm+"/"+yyyy;

	NextMondayDate = ddNextMonday+"/"+mm+"/"+yyyy;

	if(UserCode != ""){
		
		Usercode = UserCode.replace('?code=', '');
		console.log("UserCode: " + Usercode);
		console.log("Exchanging UserCode for AccessToken");
		$http.post("/ClientToServer", {body: Usercode}).success(function (data) {
			OauthToken = data; 
			OauthToken = OauthToken.replace('access_token=', '?');
			OauthToken = OauthToken.replace('&scope=&token_type=bearer', '');
			console.log("AccessToken: " + OauthToken);			
		}).success(function(){
			console.log("Login Successfull");
			apiAllStudentsCall();
		});
	};
	//Login
	$scope.SignIn = function(){
		window.location.replace(apiLogin + client_id);
	};

	//Button vars and fucntions
	$scope.div_MainMenu = 1;
	$scope.btnstate_repostats = true;
	$scope.btnstate_Repohulp = false;
	$scope.btnstate_Scriptie = false;

	$scope.Btn_RepoStats = function () {
		$scope.btnstate_repostats = true;
		$scope.btnstate_Repohulp = false;
		$scope.btnstate_Scriptie = false;
		$scope.div_MainMenu = 1;
	};

	$scope.Btn_RepoHulp = function () {
		$scope.btnstate_repostats = false;
		$scope.btnstate_Repohulp = true;
		$scope.btnstate_Scriptie = false;
		$scope.div_MainMenu = 2;
	};

	$scope.Btn_Scriptie = function () {
		$scope.btnstate_repostats = false;
		$scope.btnstate_Repohulp = false;
		$scope.btnstate_Scriptie = true;
		$scope.div_MainMenu = 3;
	};

	$scope.div_RepoHulpMenu = 1;
	$scope.btnstate_Issues = false;
	$scope.btnstate_Commits = true;

	$scope.Btn_Commits = function(){
		$scope.btnstate_Issues = false;
		$scope.btnstate_Commits = true;
		$scope.div_RepoHulpMenu = 1;
		$scope.GetCommits();
	};

	$scope.Btn_Issues = function(){
		$scope.btnstate_Issues = true;
		$scope.btnstate_Commits = false;
		$scope.div_RepoHulpMenu = 2;
	};

	$scope.div_issues = 0;
	$scope.btnstate_IssueCreate = false;
	$scope.btnstate_IssuesView = false;

	$scope.Btn_GetIssues = function(){
		$scope.btnstate_IssueCreate = false;
		$scope.btnstate_IssuesView = true;
		$scope.div_issues = 1;
		$scope.GetIssues();
	};

	$scope.Btn_CreateIssue = function(){
		$scope.btnstate_IssueCreate = true;
		$scope.btnstate_IssuesView = false;
		$scope.div_issues = 2;
	};

	var RepoName;

	$scope.RepoNames = [];
	$scope.RepoNamesSplit = [];
	CommitTime = [];

	var apiAllStudentsCall = function () {

		console.log("apiCallAllStudents");
		$http.get(apiCallAllStudents + TijdelijkeOauth).then(function (response) {
			//console.log(response);
			for (i = 0; i < response.data.length; i++) {
				RepoName = response.data[i].name;
				if (RepoName.indexOf("BAP1617") !== -1) {
					//RepoName Filteren zodat BAP1617_LameirBryan => Lameir Bryan word
					RepoName = RepoName.substring(8);
					RepoNameSplit = RepoName.replace(/([A-Z])/g, ' $1').trim();
					$scope.RepoNames.push(RepoName);
					$scope.RepoNamesSplit.push(RepoNameSplit);
				};	
			};
			console.log($scope.RepoNames);
			for(i = 0; i < $scope.RepoNames.length ; i++){
				console.log($scope.RepoNames[i]);
			   	$http.get(apiCallCommits + $scope.RepoNames[i] + "/commits" + TijdelijkeOauth).then(function (response) {
					for (i = 0; i < 1; i++) {
						LastCommitDate = response.data[i].commit.author.date;
					}
				   	var LastCommitDateS = LastCommitDate.toString();
				   	var datetimeS = datetime.toString();
				   	var difference = Date.parse(datetimeS) - Date.parse(LastCommitDateS);
				   	var TimeDifference = difference / (1000 * 60 * 60 * 24);
				   	console.log(TimeDifference);
				   	CommitTime.push(TimeDifference);
				   	console.log(CommitTime);

				});
			};
			console.log($scope.RepoNames);
		});

	};

	$scope.do = function(x){
		console.log("test");
		x = x.replace(' ', '');
		$http.get(apiCallInfo + x + apiCallInfo2 + TijdelijkeOauth).then(function (response) {
			rawfileLink = response.data.download_url;
			$http.get(rawfileLink).then(function (response) {
				console.log(response.data);
				rawInfoFile = response.data;
				filterInfo(rawInfoFile);
			});

		});

		$scope.RepoStatistics = function (){
			$http.get(apiCallRepoInfo + x + "/stats/participation" + TijdelijkeOauth).then(function (response) {
				TotalCommit = 0;
				console.log(response);
				for (i = 0; i < response.data.all.length; i++) {
					LastCommit = response.data.all[i];
					TotalCommit += LastCommit;
				}
				$scope.LastCommithtml = LastCommit;
				$scope.TotalCommithtml = TotalCommit;
			});

			$http.get(apiCallLogCommits + x + "/commits" + TijdelijkeOauth + "&path=Logfiles&until=" + datetime).then(function (response) {
				var CurrentAmount = response.data.length;
				ShowLogButton = document.getElementById("ShowLog");
				console.log("CurrentAmount is " + CurrentAmount);
				if (CurrentAmount > PreviousAmount) {
					$scope.NewLogInfo = "New Logs Available"
			$http.get(apiCallLogCommits + x + "/commits" + TijdelijkeOauth).then(function (response) {
				for (i = 0; i < 1; i++) {
					LastLogDate = response.data[i].commit.author.date;
				}
				var LastLogDateS = LastCommitDate.toString();
				var datetimeS = datetime.toString();
				var Time = Date.parse(datetimeS) - Date.parse(LastLogDateS);
				var LogTime= Time / (1000 * 60 * 60 * 24);
				console.log(LogTime);
				if(LogTime < 7){
					$scope.NewLogInfo = "Recent Log committed!"
				}
				else{
					$scope.NewLogInfo = "Newest Log has not been uploaded."
				}
				$scope.ShowLog = function() {
						$http.get(apiCallInfo + x + apiCallInfoLog + TijdelijkeOauth).then(function (response) {
							console.log(response.data.download_url);
							LogLink = response.data.download_url;
							$http.get(LogLink).then(function (response) {
								//console.log(response.data);
								PulledLog = response.data;
								FilterLog();
							});
						});
					}
			});

			
			function FilterLog(){
				console.log(MondayDate);
				console.log(NextMondayDate);
				console.log(PulledLog.indexOf(MondayDate));
				console.log(PulledLog.indexOf(NextMondayDate));

				var Logmd = PulledLog.substring(PulledLog.indexOf(MondayDate) - 11, 
					PulledLog.indexOf(NextMondayDate) - 12);
				LogRaw = Logmd;

				LogHtml = Converter.makeHtml(LogRaw);
				$scope.rawLog = $sce.trustAsHtml(LogHtml);
			};

			$scope.ShowCharts = function () {
				$http.get(Participation + TijdelijkeOauth).then (function(response){
					console.log(response);
					for(i = 0; i < response.data.owner.length; i++){
						if (response.data.owner[i] != 0){
							zerocounter++;
							ParticipationArray.push(response.data.owner[i]);
							console.log(zerocounter);
						}
						else if (zerocounter > 0){
							ParticipationArray.push(response.data.owner[i]);
						}
						console.log(zerocounter);
						console.log(ParticipationArray);
					}

					for(i = 0; i < ParticipationArray.length; i++){
						
					}
					/*
					var myData = new Array([ParticipationArray[i], index], [15, 0], [18, 3], [19, 6], [20, 8.5], [25, 10], [30, 9], [35, 8], [40, 5], [45, 6], [50, 2.5]);
					var myChart = new JSChart('chartid', 'line');
					myChart.setDataArray(myData);
					myChart.setAxisNameFontSize(10);
					myChart.setAxisNameX('Horizontal axis values');
					myChart.setAxisNameY('Vertical axis');
					myChart.setAxisNameColor('#787878');
					myChart.setAxisValuesNumberX(6);
					myChart.setAxisValuesNumberY(5);
					myChart.setAxisValuesColor('#38a4d9');
					myChart.setAxisColor('#38a4d9');
					myChart.setLineColor('#C71112');
					myChart.setTitle('A customized chart');
					myChart.setTitleColor('#383838');
					myChart.setGraphExtend(true);
					myChart.setGridColor('#38a4d9');
					myChart.setSize(616, 321);
					myChart.setAxisPaddingLeft(140);
					myChart.setAxisPaddingRight(140);
					myChart.setAxisPaddingTop(60);
					myChart.setAxisPaddingBottom(45);
					myChart.setTextPaddingLeft(105);
					myChart.setTextPaddingBottom(12);
					myChart.setBackgroundImage('path/background.jpg');
					myChart.draw();*/
				});
				
			}
		};

		$http.get(apiCallInfo + x + TijdelijkeOauth).then(function (response) {
			RepoLink = response.data.html_url;
			$scope.getRepoLink = RepoLink;
		});

		var rawInfoFile;

		function filterInfo(rawInfoFile) {
			var getNaam = rawInfoFile.substring(rawInfoFile.indexOf("<!---naam -->") + 19,
				rawInfoFile.indexOf("<!---gitnaam -->") - 1);
			var getGitnaam = rawInfoFile.substring(rawInfoFile.indexOf("<!---gitnaam -->") + 25,
				rawInfoFile.indexOf("<!---reponaam -->") - 1);
			var getReponaam = rawInfoFile.substring(rawInfoFile.indexOf("<!---reponaam -->") + 27,
				rawInfoFile.indexOf("<!---promotor -->") - 1);
			var getPromotor = rawInfoFile.substring(rawInfoFile.indexOf("<!---promotor -->") + 27,
				rawInfoFile.indexOf("<!---phone -->") - 1);
			var getPhone = rawInfoFile.substring(rawInfoFile.indexOf("<!---phone -->") + 24,
				rawInfoFile.indexOf("<!---address -->") - 1);
			var getAddress = rawInfoFile.substring(rawInfoFile.indexOf("<!---address -->") + 25,
				rawInfoFile.indexOf("<!---company -->") - 1);
			var getBedrijf = rawInfoFile.substring(rawInfoFile.indexOf("<!---company -->") + 25,
				rawInfoFile.indexOf("<!---end -->") - 1);
			$scope.getNaam = getNaam;
			$scope.getGitNaam = getGitnaam;
			$scope.getReponaam = getReponaam;
			$scope.getPromotor = getPromotor;
			$scope.getPhone = getPhone;
			$scope.getAddress = getAddress;
			$scope.getBedrijf = getBedrijf;
		};

		$scope.GetCommits = function () {

			$http.get(apiCallCommits + TijdelijkeOauth).then(function (response) {
				for (i = 0; i < response.data.length; i++) {
					CommitMessages.push(response.data[i].commit.message);
					$scope.AllCommits = CommitMessages;
					shaArray.push(response.data[i].sha);
				}
			});

			$scope.SelectCommit = function (index) {
				console.log(index);
				console.log(CommitMessages[index]);
				console.log(shaArray[index]);
				CommentSha = shaArray[index];
				CommentName = CommitMessages[index];
				$scope.CommentInfo = CommentName;
				document.getElementById("CommentArea").focus();
			}

			$scope.PostComment = function (){
				var config = {headers: {'Content-Type': 'application/json'}};
				CommentBody = document.getElementById("CommentArea").value;

				console.log(CommentBody);
				$http.post(apiCallCommits + x + "/commits" + CommentSha + "/comments" + Access, {'body': CommentBody}, config).then(function (res) { //Access wa doet die hier en wie zijn access is da
					console.log(res);
				});
			}
		};

		$scope.GetScriptie = function () {
			$http.get(apiCallScriptie + x + "/contents/scriptie/Scriptie.md" + TijdelijkeOauth).then(function (response) {
				rawScriptieLink = response.data.download_url;
				$http.get(rawScriptieLink).then(function (response) {
					ScriptieRaw = response.data;

					ScriptieHtml = Converter.makeHtml(ScriptieRaw);
					$scope.ScriptieData = $sce.trustAsHtml(ScriptieHtml);
				});
			});
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

		$scope.GetIssues = function(){
			console.log("Call for Issues");
			$http.get(apiAllIssuesCall + x + "/issues" + OauthToken).then(function (response){

				$scope.IssueBodys.length = 0;
				$scope.IssueTitels.length = 0;
				$scope.IssueNumbers.length = 0;
				$scope.IssueStates.length = 0;
				$scope.Repeat.length = 0;

				for (var i = 0; i < response.data.length; i++) {
					IssueBody = response.data[i].body;
					IssueTitel = response.data[i].title;
					IssueNumber = response.data[i].number;
					IssueState = response.data[i].state;
					console.log(IssueBody);

					$scope.IssueBodys.push(IssueBody);
					$scope.IssueTitels.push(IssueTitel);
					$scope.IssueNumbers.push(IssueNumber);
					$scope.IssueStates.push(IssueState);
					$scope.Repeat.push(i);


				};
			});
			console.log("Issues recieved");
		};

		$scope.CreateIssue = function(){
			

		};

	};

	$scope.showSelectedText = function() {
		$scope.selectedText =  $scope.getSelectionText();
	};

	$scope.getSelectionText = function() {
		var text = "";
		if (window.getSelection) {
			text = window.getSelection().toString();
		} else if (document.selection && document.selection.type != "Control") {
			text = document.selection.createRange().text;
		}
		return text;
	};

	$scope.AddComment = function(){

	};
});
