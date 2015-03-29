
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
			     showResults();
			    }
		    });
		    console.log(currentUser);
		    $("#userName").val("");
		    $("#password").val("");
		    $("#email").val("");
		    $("#form").css("display", "none");
		} else {
		    // show the signup or login page
		}
	  },
	  error: function(user, error) {
	    // The login failed. Check error to see why.
	  }
	});
}

function showResults() {
	console.log(sessions);
	for (var i = 0; i < sessions.length; i++) {
		$("#sessions").append("<div class = 'session one-half column' id = 'session" + 
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


