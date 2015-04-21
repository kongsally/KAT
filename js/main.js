
$(function() {
  Parse.initialize("n4oZoGhNy29oAmOzq2bV8o7P1YXmcrqggHV2EXGA", "yFzQ1Irh8XGM33VjeprI3qnIzNqdZf8zG42VRunx");
});

var sessions = [];


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
}

function backToInstructions() {
	$("#results").css("display", "none");
	$("#instructions").css("display", "block");
}


