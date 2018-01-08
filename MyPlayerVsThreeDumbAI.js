$(document).ready(function () {
    var player_name = prompt('What is your name?');
    if (player_name == ''){
        player_name = 'Player 1';
    }

    var north = new MyPlayer(player_name, $("div.north_player")[0]);
    var east = new DumbAI("Bob")
    var south = new DumbAI("Carol");
    var west = new DumbAI("David");

    var match = new HeartsMatch(north, east, south, west);

    match.run();
});