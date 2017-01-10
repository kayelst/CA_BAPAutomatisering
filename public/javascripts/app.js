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
	var LastPushDate;
	var LastCommitDate = new Date();
	var datetime = new Date();
	var MondayDate = new Date();
	var NextMondayDate = new Date();
	var LastSundayDate = new Date();
	var ThePromotor;
	var GetLog = false;

	var apiCallRepoInfo = "https://api.github.com/repos/MyOrg1617/BAP1617_";
	var apiCallScriptie = "https://api.github.com/repos/MyOrg1617/BAP1617_";
	var apiCallAllStudents = "https://api.github.com/orgs/MyOrg1617/repos";
	var apiCallInfo = "https://api.github.com/repos/MyOrg1617/BAP1617_";
	var apiCallInfo2 = "/contents/Info.md";
	var apiCallInfoLog = "/contents/Logfiles/LOG.md";
	var apiCallLogCommits = "https://api.github.com/repos/MyOrg1617/BAP1617_";
	var Access = "?access_token=a67d824f6631ee92ff0ccd6f2698ddd8ed7170cf";
	var Access2 = "?access_token=0daec56ae84b247121b53069e34c126259cf92fa";
	var Participation = "https://api.github.com/repos/kayelst/CA_BAPAutomatisering/stats/participation";
	var client_id = "?client_id=651b11583f0162b4cc91";
	var apiLogin = "https://github.com/login/oauth/authorize";
	var apiAllIssuesCall = "https://api.github.com/repos/MyOrg1617/BAP1617_";
	var TijdelijkeOauth = "?client_id=651b11583f0162b4cc91&client_secret=cc5f94be35b0ccf9891b55dd6d670f3f7cf29388"
	var apiCallCommits = "https://api.github.com/repos/MyOrg1617/BAP1617_";

	Converter = new showdown.Converter();

	var currentdate = new Date();
	var yyyy = currentdate.getFullYear();
	var mm = currentdate.getMonth() + 1;
	var dd = currentdate.getDate();
	var hh = currentdate.getHours();
	var mi = currentdate.getMinutes();
	var ss = currentdate.getSeconds();
	var ddMonday = currentdate.getDate() - currentdate.getDay() - 6;
	var ddNextMonday = currentdate.getDate() - currentdate.getDay() + 1;
	var ddLastSunday = currentdate.getDate() - currentdate.getDay();

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
	if (ddLastSunday < 10)
		ddLastSunday = "0"+ddLastSunday;

	datetime = yyyy+"-"+mm+"-"+dd+"T"+hh+":"+mi+":"+ss+"Z";
	console.log(datetime);

	LastSundayDate = yyyy+"-"+mm+"-"+ddLastSunday+"T"+hh+":"+mi+":"+ss+"Z";

	MondayDate = ddMonday+"/"+mm+"/"+yyyy;

	NextMondayDate = ddNextMonday+"/"+mm+"/"+yyyy;

	//Check if we recieved a Usercode
	if(UserCode != ""){
		
		Usercode = UserCode.replace('?code=', '');
		window.history.pushState("object or string", "Title", "/"+window.location.href.substring(window.location.href.lastIndexOf('/') + 1).split("?")[0]);
		console.log("UserCode: " + Usercode);
		console.log("Exchanging UserCode for AccessToken");
		$http.post("/ClientToServer", {body: Usercode}).success(function (data) {
			OauthToken = data; 
			//OauthToken = OauthToken.replace('access_token=', '');
			OauthToken = OauthToken.replace('&scope=&token_type=bearer', '');
			OauthToken = "?" + OauthToken;
			console.log("AccessToken: " + OauthToken);			
		}).success(function(){
			console.log("Login Successfull");
			apiAllStudentsCall();
		});
	};

	//Login Btn 
	$scope.SignIn = function(){
		window.location.replace(apiLogin + client_id + "&scope=public_repo");
	};

	//Button vars and fucntions Switch between Divs
	$scope.div_MainMenu = 1;
	$scope.btnstate_repostats = true;
	$scope.btnstate_Repohulp = false;
	$scope.btnstate_Scriptie = false;

	$scope.Btn_RepoStats = function () {
		$scope.btnstate_repostats = true;
		$scope.btnstate_Repohulp = false;
		$scope.btnstate_Scriptie = false;
		$scope.div_MainMenu = 1;
		CommitMessages = [];
	};

	$scope.Btn_RepoHulp = function () {
		$scope.btnstate_repostats = false;
		$scope.btnstate_Repohulp = true;
		$scope.btnstate_Scriptie = false;
		CommitMessages = [];
		/*$scope.div_MainMenu = 2;
		$scope.btnstate_Issues = false;
		$scope.btnstate_Commits = true;
		$scope.div_RepoHulpMenu = 1;
		$scope.GetCommits();*/

	};


	$scope.div_RepoHulpMenu = 1;
	$scope.btnstate_Issues = false;
	$scope.btnstate_Commits = false;

	$scope.Btn_Commits = function(){
		$scope.btnstate_repostats = false;
		$scope.btnstate_Repohulp = true;
		$scope.btnstate_Scriptie = false;
		//$scope.btnstate_Issues = false;
		//$scope.btnstate_Commits = true;
		$scope.div_MainMenu = 2;
		$scope.div_RepoHulpMenu = 1;
		$scope.GetCommits();
	};

	$scope.Btn_Issues = function(){
		$scope.btnstate_repostats = false;
		$scope.div_MainMenu = 2;
		$scope.btnstate_Repohulp = true;
		$scope.btnstate_Scriptie = false;
		CommitMessages = [];
		//$scope.btnstate_Issues = true;
		//$scope.btnstate_Commits = false;

		$scope.div_RepoHulpMenu = 2;
		$scope.GetIssues();
		$scope.div_issues = 1;
		$scope.btnstate_IssueCreate = false;
		$scope.btnstate_IssuesView = true;
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
		$scope.CreateIssue();
	};

	$scope.Btn_Scriptie = function () {
		$scope.btnstate_repostats = false;
		$scope.btnstate_Repohulp = false;
		$scope.btnstate_Scriptie = true;
		$scope.div_MainMenu = 3;
		$scope.div_Documentatie = 1;
		$scope.GetScriptie();
		
	};

	$scope.Btn_LastLog = function () {
		$scope.btnstate_repostats = false;
		$scope.btnstate_Repohulp = false;
		$scope.btnstate_Scriptie = true;
		$scope.div_MainMenu = 3;
		$scope.div_Documentatie = 2;
		$scope.GetRecentLog();
	};

	$scope.Btn_AllLogs = function () {
		$scope.btnstate_repostats = false;
		$scope.btnstate_Repohulp = false;
		$scope.btnstate_Scriptie = true;
		$scope.div_MainMenu = 3;
		$scope.div_Documentatie = 3;
		$scope.GetFullLog();
	};

	var RepoName;

	$scope.RepoNames = [];
	$scope.RepoNamesSplit = [];

	var apiAllStudentsCall = function () {

		console.log("apiCallAllStudents");
		$http.get(apiCallAllStudents + OauthToken).then(function (response) {
			//console.log(response);
			for (i = 0; i < response.data.length; i++) {
				RepoName = response.data[i].name;
				if (RepoName.indexOf("BAP1617") !== -1) {
					RepoName = RepoName.substring(8);
					RepoNameSplit = RepoName.replace(/([A-Z])/g, ' $1').trim();
					$scope.RepoNames.push(RepoName);
					$scope.RepoNamesSplit.push({"name": RepoNameSplit});
				};
			};


			if ($scope.RepoNamesSplit.length > 0) $scope.do($scope.RepoNamesSplit[0].name);		

			angular.forEach($scope.RepoNames, function(name, index) {
				$http.get(apiCallCommits + name + "/commits" + OauthToken)
				.then(function(response) {
					var LastCommitDate = response.data[0].commit.author.date;
					var LastCommitDateS = LastCommitDate.toString();
					var datetimeS = datetime.toString();
					var difference = Date.parse(datetimeS) - Date.parse(LastCommitDateS);
					var TimeDifference = difference / (1000 * 60 * 60 * 24);
					console.log(TimeDifference);
					if(TimeDifference < 7)
						$scope.PutPersonAsColor(name, "Green");
					else if (TimeDifference > 7 && TimeDifference < 14)
						$scope.PutPersonAsColor(name, "Orange");
					else 
						$scope.PutPersonAsColor(name, "Red");
				});
			});
		});
	};

	$scope.PutPersonAsColor = function (name, color) {
		angular.forEach($scope.RepoNamesSplit, function(person, index){
			if (person.name == name.replace(/([A-Z])/g, ' $1').trim()) { $scope.RepoNamesSplit[index].color = color;
				console.log($scope.RepoNamesSplit[index]);
			}
		});
	};

	$scope.do = function(x) {
		$scope.selectedPerson = x;
		$scope.Btn_RepoStats();
		x = x.replace(' ', '');

		/*$scope.RepoNames[] = x;// spot van x
		 $scope.color[spotOfX] = personColor;*/

		$http.get(apiCallInfo + x + apiCallInfo2 + OauthToken).then(function (response) {
			rawfileLink = response.data.download_url;
			$http.get(rawfileLink).then(function (response) {
				console.log(response.data);
				rawInfoFile = response.data;
				filterInfo(rawInfoFile);
			});
		}, function (err) {
			alert("Deze student heeft zijn infoFile niet gemaakt en is hiervan per mail op de hoogte gebracht");
			$http.post("/MailInfo", {body: x, "promotor": ThePromotor}).success(function () {
				console.log("mail send");
			});

		});

		$http.get(apiCallCommits + x + "/commits" + OauthToken).then(function (response) {
			CommitMessages.length = 0;
			shaArray.length = 0;
			var LastPush = response.data[0].commit.author.date;
			for (i = 0; i < response.data.length; i++) {
				CommitMessages.push(response.data[i].commit.message);
				$scope.AllCommits = CommitMessages;
				shaArray.push(response.data[i].sha);
			}
		});

		$scope.RepoStatistics = function () {
			$http.get(apiCallRepoInfo + x + "/stats/participation" + OauthToken).then(function (response) {
				TotalCommit = 0;
				console.log(response);
				for (i = 0; i < response.data.all.length; i++) {
					LastCommit = response.data.all[i];
					TotalCommit += LastCommit;
				}
				$scope.LastCommithtml = LastCommit;
				$scope.TotalCommithtml = TotalCommit;
			});

			$http.get(apiCallLogCommits + x + "/commits" + OauthToken + "&path=Logfiles").then(function (response) {
				LastLogDate = response.data[0].commit.author.date;
				console.log("log " + LastLogDate);
				console.log("sunday " + LastSundayDate);
				LastLogDateS = LastLogDate.toString();
				var LastSundayDateS = LastSundayDate.toString();
				console.log("sunday " + Date.parse(LastSundayDateS));
				console.log("log " + Date.parse(LastLogDateS));
				var Time = Date.parse(LastSundayDateS) - Date.parse(LastLogDateS);
				var LogTime = Time / (1000 * 60 * 60 * 24);
				console.log(LogTime);
				if (LogTime < 0) {
					$scope.NewLogInfo = "Last weeks LOG Comitted!";
					GetLog = true;
				}
				else {
					$scope.NewLogInfo = "Last Weeks LOG has not been Comitted. The student has been Notified";
					GetLog = false;
				}
			}, function(err){
				console.log("LOGmail");
				$http.post("/MailLog", {body: x, "promotor": ThePromotor}).success(function () {
					console.log("logmail send");
				});
			});

			$http.get(apiCallCommits + x + "/commits" + OauthToken).then(function (response) {
				var LastPush = response.data[0].commit.author.date;
				$scope.LastPushDate = LastPush;
			});
		};

		function FilterLog() {
			var Logmd = PulledLog.substring(PulledLog.indexOf(MondayDate) - 11,
			PulledLog.indexOf(NextMondayDate) - 12);
			LogRaw = Logmd;

			LogHtml = Converter.makeHtml(LogRaw);
			$scope.rawLog = $sce.trustAsHtml(LogHtml);
		};


		$http.get(apiCallInfo + x + OauthToken).then(function (response) {
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
			ThePromotor = getPromotor;
		};

		$scope.GetCommits = function () {

			$http.get(apiCallCommits + x + "/commits" + OauthToken).then(function (response) {
				CommitMessages.length = 0;
				shaArray.length = 0;
				var LastPush = response.data[0].commit.author.date;
				for (i = 0; i < response.data.length; i++) {
					CommitMessages.push(response.data[i].commit.message);
					$scope.AllCommits = CommitMessages;
					shaArray.push(response.data[i].sha);
				}
			});
		};

		$scope.SelectCommit = function (index) {
			console.log(index);
			console.log(CommitMessages[index]);
			console.log(shaArray[index]);
			CommentSha = shaArray[index];
			CommentName = CommitMessages[index];
			$scope.CommentInfo = CommentName;
			document.getElementById("CommentArea").focus();
		};

		$scope.PostComment = function () {
			var config = {headers: {'Content-Type': 'application/json'}};
			CommentBody = document.getElementById("CommentArea").value;

			console.log(CommentBody);
			$http.post(apiCallCommits + x + "/commits/" + CommentSha + "/comments" + OauthToken, {'body': CommentBody}, config).then(function (res) {
				console.log(res);
			});
		};


		$scope.GetScriptie = function () {
			$http.get(apiCallScriptie + x + "/contents/scriptie/Scriptie.md" + OauthToken).then(function (response) {
				rawScriptieLink = response.data.download_url;
				$http.get(rawScriptieLink).then(function (response) {
					ScriptieRaw = response.data;

					ScriptieHtml = Converter.makeHtml(ScriptieRaw);
					$scope.ScriptieData = $sce.trustAsHtml(ScriptieHtml);
				});
			}, function (error) {
				alert("Deze student heeft geen scriptie en is hiervan per mail op de hoogte gebracht!");
				console.log("send scriptiemail");
				$http.post("/MailScriptie", {body: x, "promotor": ThePromotor}).success(function () {
					console.log("mail send");
				});
			});

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

			$scope.GetIssues = function () {
				console.log("Call for Issues");
				$http.get(apiAllIssuesCall + x + "/issues" + OauthToken).then(function (response) {

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

			var TitleIssue;
			var BodyIssue;

			$scope.CreateIssueScriptie = function(){
				TitleIssue = $scope.selectedText;
				BodyIssue = document.getElementById("ScriptieIssue").value;
				if (TitleIssue != "" && BodyIssue != "") {
					$http.post(apiAllIssuesCall + x + '/issues' + OauthToken,
						{'title': TitleIssue, 'body': BodyIssue},
						{headers: {'Content-Type': 'application/json'}}).then(function (res) {
						console.log(res);
					});
				}else {alert('Bijde velden moeten ingevuld worden.')};
				document.getElementById("ScriptieIssue").value = "";
			}



			$scope.CreateIssue = function () {
				TitleIssue = document.getElementById("Title").value;
				BodyIssue = document.getElementById("Body").value;
				console.log(TitleIssue);
				console.log(BodyIssue);
				if (TitleIssue != "" && BodyIssue != "") {
					$http.post(apiAllIssuesCall + x + '/issues' + OauthToken,
						{'title': TitleIssue, 'body': BodyIssue},
						{headers: {'Content-Type': 'application/json'}}).then(function (res) {
						console.log(res);
					});
				} else {
					alert('Bijde velden moeten ingevuld worden.')
				};

				document.getElementById("Title").value = "";
				document.getElementById("Body").value = "";

			};
		};

		$scope.GetRecentLog = function () {
			console.log("in function");
				$http.get(apiCallInfo + x + apiCallInfoLog + OauthToken).then(function (response) {
					console.log(response.data.download_url);
					LogLink = response.data.download_url;
					$http.get(LogLink).then(function (response) {
						//console.log(response.data);
						PulledLog = response.data;
						FilterLog();
					});
				}, function (error) {
					alert("Deze student heeft geen Logs en is hiervan per mail op de hoogte gebracht!");
				});
			};

		$scope.GetFullLog = function() {
			$http.get(apiCallInfo + x + apiCallInfoLog + OauthToken).then(function (response) {
				console.log(response.data.download_url);
				LogLink = response.data.download_url;
				$http.get(LogLink).then(function (response) {
					//console.log(response.data);
					PulledLogFull = response.data;
					FullLogHtml = Converter.makeHtml(PulledLogFull);
					$scope.FullLog = $sce.trustAsHtml(FullLogHtml);
				});
			}, function (error) {
				alert("Deze student heeft geen Logs en is hiervan per mail op de hoogte gebracht!");
			});
		};
		$scope.showSelectedText = function () {
			$scope.selectedText = $scope.getSelectionText();
		};

		$scope.getSelectionText = function () {
			var text = "";
			if (window.getSelection) {
				text = window.getSelection().toString();
			} else if (document.selection && document.selection.type != "Control") {
				text = document.selection.createRange().text;
			}
			return text;
		};

		$scope.AddComment = function () {

		};
	}
	});