// Initialize Firebase
var config = {
apiKey: "AIzaSyBfbk7qQCvmuF6iwyKGjWf9nm7G1C7Id0o",
authDomain: "trainscheduler-4b33a.firebaseapp.com",
databaseURL: "https://trainscheduler-4b33a.firebaseio.com",
projectId: "trainscheduler-4b33a",
storageBucket: "trainscheduler-4b33a.appspot.com",
messagingSenderId: "796002551874"
};

firebase.initializeApp(config);

var database = firebase.database();

function NextArrival_Time(first, frequency) {
    var t = moment().diff(first, "minutes");
    return moment(first).add(Math.ceil(t / frequency) * frequency);
}

function NextArrival_MinutesAway(first, frequency) {
    var t = moment().diff(first, "minutes");
    return frequency - (t % frequency);
}

$(document).ready(function() {
    
    $("#btnSubmit").on("click", function() {
        var name = $("#name").val().trim();
        var destination = $("#destination").val().trim();
        var first = moment($("#first").val().trim(), "HH:mm");
        var frequency = Number.parseInt($("#frequency").val().trim());

        //TODO: perform form validation
        //name - empty
        //destination - empty
        //first - empty or invalid format (use first.isValid())
        //frequency - empty or NaN

        var train = {
            name: name,
            destination: destination,
            first: first,
            frequency: frequency
        }
        console.log(train);

        //send to firebase
        database.ref().push(train);

        console.log("pushed to firebase");
    });

    database.ref().on("child_added", function(snapshot) {
        var train = snapshot.val();

        console.log("New child added:");
        console.log(train);

        var name = train.name;
        var destination = train.destination;
        var frequency = train.frequency;
        var next = NextArrival_Time(train.first, train.frequency).format("hh:mm A");
        var minsAway = NextArrival_MinutesAway(train.first, train.frequency);

        var tr = $("<tr>");

        var tdName = $(`<td>${name}</td>`);
        var tdDestination = $(`<td>${destination}</td>`);
        var tdFrequency = $(`<td>${frequency}</td>`);
        var tdNext = $(`<td>${next}</td>`);
        var tdMinsAway = $(`<td>${minsAway}</td>`);

        tr.append(tdName);
        tr.append(tdDestination);
        tr.append(tdFrequency);
        tr.append(tdNext);
        tr.append(tdMinsAway);        

        $("#tBody").append(tr);
    });
});