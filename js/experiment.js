
//first some things useful for randomizing conditions:

//i think this should be a random permutation (fisher-yates shuffle) of the array:
/*Array.prototype.randomize = function() {

   // for (var j, x, i = this.length; i; j = parseInt(Math.random() * i), x = this[--i], this[i] = this[j], this[j] = x);
   // return this;
   
    var tmp, current, top = this.length;

    if(top) while(--top) {
        current = Math.floor(Math.random() * (top + 1));
        tmp = this[current];
        this[current] = this[top];
        this[top] = tmp;
    }
    return this;
}

function random(a,b) {
    if (typeof b == "undefined") {
	a = a || 2;
	return Math.floor(Math.random()*a);
    } else {
	return Math.floor(Math.random()*(b-a+1)) + a;
    }
}*/

//** todo -- always update the order for slides:
slides = ['consent', 'EQinstructions', 'EQquestions', 'Eyesinstructions', 'Eyesquestions', 'Innuinstructions', 'Innuquestions', 'askInfo', 'finished'];
slideStage = 0;

//now show the first (consent) slide:

function showNextSlide() {
	console.log("showNEXTslide function called! Showing:");
    $(".slide").hide();
    nextID = slides[slideStage];
    console.log(nextID);
    $("#"+nextID).show();
    slideStage++;
}

//showNextSlide();

function showSlide(id) {
    $(".slide").hide();
    $("#"+id).show();
	slideStage++;
}


showSlide('consent');




/*
//helper functions for validating and extracting entries:

function isNumberKey(evt) {
	var charCode = (evt.which) ? evt.which : event.keyCode
    if (charCode > 31 && (charCode < 48 || charCode > 57))
		return false;

    return true;
}*/


warmupEQ = [   {"story": "warmup1",
				"ptype": "warmup",
				"s1": "I would be very upset if I could not listen to music every day."},
				{"story": "warmup1",
				"ptype": "warmup",
				"s1": "I prefer to speak to my friends on the phone rather than write letters to them."},
				{"story": "warmup1",
				"ptype": "warmup",
				"s1": "I have no desire to travel to different parts of the world."},
				{"story": "warmup1",
				"ptype": "warmup",
				"s1": "I prefer to read than to dance."}
		]; 

actualEQ = [{'story': 'empath1', 'ptype': 'actual', 's1': "I can easily tell if someone else wants to enter a conversation."},
			{'story': 'empath2', 'ptype': 'actual', 's1': "I find it difficult to explain to others things that I understand easily, when they don't understand it first time."},
			{'story': 'empath3', 'ptype': 'actual', 's1': "I really enjoy caring for other people."},
			];

warmupEyes = [{"story": "warmup1", "ptype": "warmup", "image": "eyes0", 'expressA': "Jealous", 'expressB': "Panicked", 'expressC': "Arrogant", 'expressD': "Hateful"},
			]; 

actualEyes = [{'story': 'eyes1', 'ptype': 'actual', 'image': 'eyes1', 'expressA': "Playful", 'expressB': "Comforted", 'expressC': "Irritated", 'expressD': "Bored"},
			  {'story': 'eyes2', 'ptype': 'actual', 'image': 'eyes2', 'expressA': "Jealous", 'expressB': "Panicked", 'expressC': "Arrogant", 'expressD': "Hateful"},
			];

warmupInnu = [   {"story": "warmup1",
				"ptype": "warmup",
				'innuA': "hi", 'innuB': "hey", 'innuC': "hello", 'innuD': "sup", 'innuE': "whadup"},
		]; 

actualInnu = [   {"story": "actual",
				"ptype": "warmup",
				'innuA': "seeya", 'innuB': "bye", 'innuC': "later", 'innuD': "ttyl", 'innuE': "peaceout"},
		]; 
//todo task javascript read in file for warmups and questions


//if (Math.floor(Math.random() * 2)){
//	//condition: actual
//	stories = actual_warmup.randomize().concat(actual.randomize()); //warmup comes first, but otherwise randomize
//}else{
//	//condition: epistemic
//	stories = epistemic_warmup.randomize().concat(epistemic.randomize()); // warmup comes first, but otherwise randomize
//}
storiesEQ = warmupEQ.concat(actualEQ);
storiesEyes = warmupEyes.concat(actualEyes);
storiesInnu = warmupInnu.concat(actualInnu);




var experiment = {
    times: {},
    timer: function(stamp) {
		this.times[stamp] = (new Date()).getTime();
	},
    storiesEQ: storiesEQ,
    totalTrials: storiesEQ.length,
    storiesEyes: storiesEyes,
    storiesInnu: storiesInnu,
    //totalEyesTrials: storiesEyes.length,    
    trial: 0, //first trial will be trial number 0
    trialsEQ: [],
    trialsEyes: [],
    trialsInnu: [],
    demographics: {},
	//**current_story: "",
	
	start: function() {
		var story = this.storiesEQ[this.trial];
		//**this.current_story = story.shortname; //for checking when we've changed.
		$('#s1').html(story.s1);
		this.timer("starttrial");
		showSlide("EQquestions");
	},

	
	/*validate: function(rb1) {
		results={"q1": rb1.getValue()};
		if (results.q1==null || results.q1==(-1)) {
			alert ( "Please be sure to answer the question.");
			return false;
		};
		if (this.stories[this.trial].ptype == "warmup"){
			//validate warmup trial
			if (this.stories[this.trial].expected == "pos"){
				if (results.q1 > 65){
					return true;
				}else{
					alert("Please read the question carefully and try answering again!");
					return false;
				};
			}else{
				if (results.q1 < 35){
					return true;
				}else{
					alert("Please read the question carefully and try answering again!");
					return false;
				};				
			};
		}else{
			return true;
		}
	},*/
	
	recordEQ: function(trial, emp) {
		results={"a1": emp};
		this.trialsEQ.push({	"trial": trial,
							"story": this.storiesEQ[this.trial].story, 	//empath# or warmup#
							"ptype": this.storiesEQ[this.trial].ptype, 	//actual or warmup
							"s1": this.storiesEQ[this.trial].s1,			//"statement"
							"rt": this.times.stoptrial - this.times.starttrial,
							"results": results});						//"a1": stronglyagree/slightlyagree/slightlydisagree/stronglydisagree
	},

	recordEyes: function(trial, answer) {
		//feeling = this.storiesEyes[this.trial].answer
		results={"a1": this.getEyeAnswer(answer)};
		this.trialsEyes.push({	"trial": trial,
							"story": this.storiesEyes[this.trial].story, 	//empath# or warmup#
							"ptype": this.storiesEyes[this.trial].ptype, 	//actual or warmup
							//"s1": this.storiesEyes[this.trial].s1,			//"statement"
							"rt": this.times.stoptrial - this.times.starttrial,
							"results": results});						//"a1": stronglyagree/slightlyagree/slightlydisagree/stronglydisagree
		
	},

	recordInnu: function(trial) {
		//feeling = this.storiesEyes[this.trial].answer
		var userRankings = $( "#sortable" ).sortable( "toArray" );
		results={"a1": this.getInnuAnswer(userRankings, trial)};
		this.trialsInnu.push({	"trial": trial,
							"story": this.storiesInnu[this.trial].story, 	//empath# or warmup#
							"ptype": this.storiesInnu[this.trial].ptype, 	//actual or warmup
							//"s1": this.storiesEyes[this.trial].s1,			//"statement"
							"rt": this.times.stoptrial - this.times.starttrial,
							"results": results});						//"a1": stronglyagree/slightlyagree/slightlydisagree/stronglydisagree
		
	},

	getEyeAnswer: function(answer) {
		if (answer == "A") {
			return this.storiesEyes[this.trial].expressA;}
		if (answer == "B") {
			return this.storiesEyes[this.trial].expressB;}
		if (answer == "C") {
			return this.storiesEyes[this.trial].expressC;}
		if (answer == "D") {
			return this.storiesEyes[this.trial].expressD;}
	},

	getInnuAnswer: function(answer) { 
		var userAnswers = [];
		var i = 0;

		while (i<answer.length) {
			option = answer[i];
			if (option == "innuA") { userAnswers.push(this.storiesInnu[this.trial].innuA);}
			if (option == "innuB") { userAnswers.push(this.storiesInnu[this.trial].innuB);}
			if (option == "innuC") { userAnswers.push(this.storiesInnu[this.trial].innuC);}
			if (option == "innuD") { userAnswers.push(this.storiesInnu[this.trial].innuD);}
			if (option == "innuE") { userAnswers.push(this.storiesInnu[this.trial].innuE);}
			i++;
		}
		return userAnswers;

/*
		if (answer == "A") {
			return this.storiesEyes[this.trial].expressA;}
		if (answer == "B") {
			return this.storiesEyes[this.trial].expressB;}
		if (answer == "C") {
			return this.storiesEyes[this.trial].expressC;}
		if (answer == "D") {
			return this.storiesEyes[this.trial].expressD;}
*/
			
	},

    
    end: function() {
	
	//record demographic data
	this.demographics.gender = $("#gender").val();
	this.demographics.age = $("#age").val();
	this.demographics.language = $("#language").val();
	this.demographics.comments = $("#comments").val();

	//finish up:
        showSlide("finished");
        setTimeout(function() { turk.submit(experiment) }, 1500);
    },
	

	nextEQ: function(emp) {
	    experiment.recordEQ(this.trial, emp); //send trial number as argument since this.trial may get updates before we record!
		//advance, and see if we're done:
		this.trial++;
	        $('.bar').css('width', (200.0 * this.trial/this.totalTrials) + 'px');	//advance the completion bar at top
		if (this.trial >= this.totalTrials) {
			//showNextSlide(); 
			showSlide('Eyesinstructions');
			this.totalTrials = storiesEyes.length; //odd
			this.trial = 0;  						//odd
			return;}
		if (this.trial>1){
			$('#marble_init').hide(); //todo - check, what does this do?
		}
		
		//make everything editable again:
		$(':input').prop('disabled',false);

		var story = this.storiesEQ[this.trial];
		//**this.current_story = story.shortname; //for checking when we've changed.
		$('#s1').html(story.s1);
		
		//reset values
		////rb1.reset();
		//make answers invisible but continue button visible
		
		this.timer("starttrial");
		showSlide("EQquestions"); //odd
    },

    nextEyes: function(answer) {
    	////todo adjust answer and image update
    	experiment.recordEyes(this.trial, answer); //send trial number as argument since this.trial may get updates before we record!
		//advance, and see if we're done:
		this.trial++;
	        $('.bar').css('width', (200.0 * this.trial/this.totalTrials) + 'px');	//advance the completion bar at top
		if (this.trial >= this.totalTrials) {
			//showNextSlide(); 
			showSlide('Innuinstructions');
			this.totalTrials = storiesInnu.length; //odd
			this.trial = 0;  						//odd
			return;}
		if (this.trial>1){
			$('#marble_init').hide();
		}
		
		//make everything editable again:
		$(':input').prop('disabled',false);

		var story = this.storiesEyes[this.trial];
		//**this.current_story = story.shortname; //for checking when we've changed.
		$('#ansA').html(story.expressA);
		$('#ansB').html(story.expressB);
		$('#ansC').html(story.expressC);
		$('#ansD').html(story.expressD);
		var imagesrc = "images/eyes" + this.trial + ".png";
		document.getElementById("eyesImage").src=imagesrc;


		
		//reset values
		////rb1.reset();
		//make answers invisible but continue button visible
		
		this.timer("starttrial");
		showSlide("Eyesquestions");
		
    },

    
    nextInnu: function() {
	    experiment.recordInnu(this.trial); //send trial number as argument since this.trial may get updates before we record!
		//advance, and see if we're done:
		this.trial++;
	        $('.bar').css('width', (200.0 * this.trial/this.totalTrials) + 'px');	//advance the completion bar at top
		if (this.trial >= this.totalTrials) {this.background(); return;}
		if (this.trial>1){
			$('#marble_init').hide();
		}
		
		//make everything editable again:
		$(':input').prop('disabled',false);

		var story = this.storiesInnu[this.trial];
		//**this.current_story = story.shortname; //for checking when we've changed.
		$('#ansA').html(story.innuA);
		$('#ansB').html(story.innuB);
		$('#ansC').html(story.innuC);
		$('#ansD').html(story.innuD);
		$('#ansE').html(story.innuE);

		
		//reset values
		////rb1.reset();
		//make answers invisible but continue button visible
		
		this.timer("starttrial");
		showSlide("Innuquestions");
		
    },


	
	
	
    background: function() {
    	showSlide("askInfo");
    },
	
    //this fuction get's called to add a time stamp: each time we move on to the next phase.
    times: {},
    timer: function(stamp) {
	this.times[stamp] = (new Date()).getTime();
    }
};


$(document).keypress(function(e) {
  if(e.which == 13) {
    // enter pressed
    alert("Hi there!");
  }
});

document.onkeypress = function(event) {
	//skip slide:
	//showNextSlide();
}