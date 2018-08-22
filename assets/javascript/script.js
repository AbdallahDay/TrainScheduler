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

function NextArrival(first, frequency) {
    var tMinus = MinutesAway(first, frequency);
    return moment().add(tMinus, "minutes");
}

function MinutesAway(first, frequency) {
    var now = moment();
    
    if (first.isAfter(now)) {
        first.subtract(1, "days");
    }

    var t = moment().diff(first, "minutes");
    return frequency - (t % frequency);
}

function Valid() {
    //form validation
    if (!$("#name").val()) {
        //name field empty
        console.log("name field empty");
        $("#name").parent
        return false;
    }

    if (!$("#destination").val()) {
        //destination field empty
        console.log("destination field empty");
        return false;
    }

    if (!$("#first").val()) {
        //first train field empty
        console.log("first train field empty");
        return false;
    }
    
    if (!moment($("#first").val().trim(), "HH:mm", true).isValid()) {
        //invalid input
        console.log("first train field contains incorrect format");
        return false;
    }

    if (!$("#frequency").val()) {
        //frquency field empty
        console.log("frequency field empty");
        return false;
    }

    if (!Number.parseInt($("#frequency").val().trim())) {
        //NaN
        console.log("frequency field NaN");
        return false;
    }

    return true;
}

$(document).ready(function() {
    
    $("#btnSubmit").on("click", function() {
        if (Valid()) {
            var name = $("#name").val().trim();
            var destination = $("#destination").val().trim();
            var first = $("#first").val().trim();
            var frequency = Number.parseInt($("#frequency").val().trim());

            var train = {
                name: name,
                destination: destination,
                first: first,
                frequency: frequency
            }

            //send to firebase
            database.ref().push(
                train,
                function(error) {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log(`${train.name} added successfully!`);
                    }
                }
            );
        }
    });

    database.ref().on("child_added", function(snapshot) {
        var train = snapshot.val();

        var first = moment(train.first, "HH:mm", true);

        var name = train.name;
        var destination = train.destination;
        var frequency = train.frequency;
        var next = NextArrival(first, train.frequency).format("hh:mm A");
        var minsAway = MinutesAway(first, train.frequency);

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