

$(document).ready(function() {
    $("#btnSubmit").on("click", function() {
        var name = $("#name").val().trim();
        var dest = $("#destination").val().trim();
        var first = moment($("#firstTrain").val().trim(), "HH:mm");
        var frequency = Number.parseInt($("#frequency").val().trim());

        //TODO: perform form validation
        //name - empty
        //dest - empty
        //first - empty or invalid format (use first.isValid())
        //frequency - empty or NaN

        var train = {
            name: name,
            destination: dest,
            firstTrain: first,
            frequency: frequency
        }

        //send to firebase
    });
});