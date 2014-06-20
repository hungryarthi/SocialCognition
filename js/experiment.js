
//first some things useful for randomizing conditions:

//i think this should be a random permutation (fisher-yates shuffle) of the array:
Array.prototype.randomize = function() {

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
}


//now show the first (instructions) slide:

function showSlide(id) {
    $(".slide").hide();
    $("#"+id).show();
}

showSlide("consent");

//helper functions for validating and extracting entries:

function isNumberKey(evt) {
	var charCode = (evt.which) ? evt.which : event.keyCode
    if (charCode > 31 && (charCode < 48 || charCode > 57))
		return false;

    return true;
}


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
{'story': 'empath3', 'ptype': 'actual', 's1': "I really enjoy caring for other people."}];
//todo task javascript read in file for warmups and questions

warmupX = [   {"story": "warmup1",
				"ptype": "warmup",
				"s1": "What is your emotion: a b c d"},
		]; 

actualX = [{'story': 'empath1', 'ptype': 'actual', 's1': "Emotion: a b c d"}];
//todo task javascript read in file for warmups and questions


//if (Math.floor(Math.random() * 2)){
//	//condition: actual
//	stories = actual_warmup.randomize().concat(actual.randomize()); //warmup comes first, but otherwise randomize
//}else{
//	//condition: epistemic
//	stories = epistemic_warmup.randomize().concat(epistemic.randomize()); // warmup comes first, but otherwise randomize
//}
storiesEQ = warmupEQ.concat(actualEQ);
storiesX = warmupX.concat(actualX);



var experiment = {
    times: {},
    timer: function(stamp) {
		this.times[stamp] = (new Date()).getTime();
	},
    storiesEQ: storiesEQ,
    totalTrials: storiesEQ.length,
    storiesX: storiesX,
    //totalXTrials: storiesX.length,    
    trial: 0, //first trial will be trial number 0
    trialsEQ: [],
    trialsX: [],
    demographics: {},
	current_story: "",
	
	start: function() {
		var story = this.storiesEQ[this.trial];
		this.current_story = story.shortname; //for checking when we've changed.
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

	recordX: function(trial, answer) {
		results={"a1": answer};
		this.trialsX.push({	"trial": trial,
							"story": this.storiesX[this.trial].story, 	//empath# or warmup#
							"ptype": this.storiesX[this.trial].ptype, 	//actual or warmup
							"s1": this.storiesX[this.trial].s1,			//"statement"
							"rt": this.times.stoptrial - this.times.starttrial,
							"results": results});						//"a1": stronglyagree/slightlyagree/slightlydisagree/stronglydisagree
		
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
			showSlide("Xinstructions"); 
			this.totalTrials = storiesX.length;
			this.trial = 0;    
			return;}
		if (this.trial>1){
			$('#marble_init').hide();
		}
		
		//make everything editable again:
		$(':input').prop('disabled',false);

		var story = this.storiesEQ[this.trial];
		this.current_story = story.shortname; //for checking when we've changed.
		$('#s1').html(story.s1);
		
		//reset values
		////rb1.reset();
		//make answers invisible but continue button visible
		
		this.timer("starttrial");
		showSlide("EQquestions");
    },

    nextX: function(answer) {
	    experiment.recordX(this.trial, answer); //send trial number as argument since this.trial may get updates before we record!
		//advance, and see if we're done:
		this.trial++;
	        $('.bar').css('width', (200.0 * this.trial/this.totalTrials) + 'px');	//advance the completion bar at top
		if (this.trial >= this.totalTrials) {this.background(); return;}
		if (this.trial>1){
			$('#marble_init').hide();
		}
		
		//make everything editable again:
		$(':input').prop('disabled',false);

		var story = this.storiesX[this.trial];
		this.current_story = story.shortname; //for checking when we've changed.
		$('#s1').html(story.s1);
		
		//reset values
		////rb1.reset();
		//make answers invisible but continue button visible
		
		this.timer("starttrial");
		showSlide("Xquestions");
		
    },
	
	
	
    background: function() {
    	showSlide("askInfo");
    },
	
    //this fuction get's called to add a time stamp: each time we move on to the next phase.
    times: {},
    timer: function(stamp) {
	this.times[stamp] = (new Date()).getTime();
    }
}
