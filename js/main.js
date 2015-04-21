
$(function() {
  Parse.initialize("n4oZoGhNy29oAmOzq2bV8o7P1YXmcrqggHV2EXGA", "yFzQ1Irh8XGM33VjeprI3qnIzNqdZf8zG42VRunx");
});

var sessions = [];
var parsedResults = [];

function signUp(){
	var user = new Parse.User();
	user.set("username", $("#userName").val());
	user.set("password", $("#password").val());
	user.set("email", $("#email").val());

	user.signUp(null, {
	  success: function(user) {
	    console.log("signed up!");
	    logIn();
	  },
	  error: function(user, error) {
	    // Show the error message somewhere and let the user try again.
	    alert("Error: " + error.code + " " + error.message);
	  }
	});
}

function logIn() {
	Parse.User.logIn($("#userName").val(), $("#password").val(), {
	  success: function(user) {
	    // Do stuff after successful login.
	    var currentUser = Parse.User.current();
		if (currentUser) {
		    // do stuff with the user
		    var relation = currentUser.relation("Sessions");
		    var query = relation.query();
		    query.find({
		    	success : function(results) {
			     sessions = results;
			     parseData(sessions);
			     showDownloadLink();
			    }
		    });
		   
		    $("#userName").val("");
		    $("#password").val("");
		    $("#email").val("");
		    $("#form").css("display", "none");
		    $("#instructions").css("display", "block");
		} else {
		    // show the signup or login page
		}
	  },
	  error: function(user, error) {
	    // The login failed. Check error to see why.
	  }
	});
}

function parseData(sesh) {
	for(var i = 0; i < sesh.length; i++) {

		var found = false;
		for(var j = 0; j < parsedResults.length; j++) {
			if(parsedResults[j].level == sesh[i].attributes.level) {
				parsedResults[j].wordsPerMin.push(sesh[i].attributes.wordsPerMin);
				parsedResults[j].charactersPerMin.push(sesh[i].attributes.charactersPerMin)
				parsedResults[j].totalMistake.push(sesh[i].attributes.totalMistake);
				parsedResults[j].totalWordsTyped.push(sesh[i].attributes.totalWordsTyped);
				parsedResults[j].finishTime.push(sesh[i].attributes.finishTime);
				parsedResults[j].totalCharactersTyped.push(sesh[i].attributes.totalCharactersTyped);
				found = true;
				break;
			}
		}

		if(!found) {
			var levelEntry = {
					"level" : sesh[i].attributes.level,
					"wordsPerMin" : [sesh[i].attributes.wordsPerMin],
					"charactersPerMin" : [sesh[i].attributes.charactersPerMin],
					"totalMistake" : [sesh[i].attributes.totalMistake],
					"totalWordsTyped" : [sesh[i].attributes.totalWordsTyped],
					"finishTime" : [sesh[i].attributes.finishTime],
					"totalCharactersTyped" : [sesh[i].attributes.totalCharactersTyped]
			}
			parsedResults.push(levelEntry);
		}
	}
}

function showDownloadLink() {
	$("#instructions").prepend("<a href='KATGame_Mac.zip' class='button' download>Mac OSX Desktop Game</a>");
	$("#instructions").prepend("<a href='KATGame_Windows.zip' class='button' download>Windows Desktop Game</a>");
	$("#instructions").prepend("<a href='KATMobile.apk' class='button' download>Android App</a>");
	$("#instructions").append("<a class='button' onclick='showResults();'>Check your results</a>");
}

function showResults() {
	$("#instructions").css("display", "none");
	$("#results").css("display", "block");
	$("#results").empty();
	$("#results").prepend("<a onclick='backToInstructions();' class='button' >Back To Instructions</a><br>");
	for (var i = 0; i < sessions.length; i++) {
		$("#results").append("<div class = 'session one-half column' id = 'session" + 
			i + "'></div>")
		$("#session" + i).append("<h5> Level: " + 
			sessions[i].attributes.level + "</h5>");
		$("#session" + i).append("<h5> Words/min: " + 
			sessions[i].attributes.wordsPerMin + "</h5>");
		$("#session" + i).append("<h5> Characters/min: " + 
			sessions[i].attributes.charactersPerMin + "</h5>");
		$("#session" + i).append("<h5> Time to finish level: " + 
			sessions[i].attributes.finishTime + "</h5>");
		$("#session" + i).append("<h5> Number of mistakes: " + 
			sessions[i].attributes.totalMistake + "</h5>");
		$("#session" + i).append("<h5> Total words typed: " + 
			sessions[i].attributes.totalWordsTyped + "</h5>");
		$("#session" + i).append("<h5> Total characteres typed: " + 
			sessions[i].attributes.totalCharactersTyped + "</h5>");
	}

	// showGraph();
}

function showGraph() {
	$("#results").append("<h4> Blue for Characters Per Minute</h4>" + 
						"<h4>Yellow for Words Per Minute </h4>");
	$("#results").append("<canvas id = 'resultsGraph' width = '"+
							window.innerWidth * 0.6 + "' height = '" + 
							window.innerHeight * 0.6 + "'></canvas>");
	var ctx = document.getElementById("resultsGraph").getContext("2d");
	var ticks = [];
	for(var i = 0; i < parsedResults[0].wordsPerMin.length; i++) {
		ticks.push("Entry " + (i+1));
	}
	var data = {
		labels: ticks,
		datasets: [
			{
	            label: "Words Per Minute",
	            fillColor: "rgba(220,220,180,0.2)",
	            strokeColor: "rgba(220,220,180,1)",
	            pointColor: "rgba(220,220,180,1)",
	            pointStrokeColor: "#fff",
	            pointHighlightFill: "#fff",
	            pointHighlightStroke: "rgba(220,220,180,1)",
	            data: parsedResults[0].wordsPerMin
	        },
	        {
	            label: "Characters Per Minute",
	            fillColor: "rgba(151,187,205,0.2)",
	            strokeColor: "rgba(151,187,205,1)",
	            pointColor: "rgba(151,187,205,1)",
	            pointStrokeColor: "#fff",
	            pointHighlightFill: "#fff",
	            pointHighlightStroke: "rgba(151,187,205,1)",
	            data: parsedResults[0].charactersPerMin
	        }
        ]
	}

	options = {
		bezierCurve: false,
		animation: true	
	}

	var newChart = new Chart(ctx).Line(data,options);

}

function backToInstructions() {
	$("#results").css("display", "none");
	$("#instructions").css("display", "block");
}


