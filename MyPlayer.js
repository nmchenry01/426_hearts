var MyPlayer = function (name, ui_div) {

    var cardDict = {
        "Two of Clubs": "2_of_clubs",
        "Two of Diamonds": "2_of_diamonds",
        "Two of Hearts": "2_of_hearts",
        "Two of Spades": "2_of_spades",
        "Three of Clubs": "3_of_clubs",
        "Three of Diamonds": "3_of_diamonds",
        "Three of Hearts": "3_of_hearts",
        "Three of Spades": "3_of_spades",
        "Four of Clubs": "4_of_clubs",
        "Four of Diamonds": "4_of_diamonds",
        "Four of Hearts": "4_of_hearts",
        "Four of Spades": "4_of_spades",
        "Five of Clubs": "5_of_clubs",
        "Five of Diamonds": "5_of_diamonds",
        "Five of Hearts": "5_of_hearts",
        "Five of Spades": "5_of_spades",
        "Six of Clubs": "6_of_clubs",
        "Six of Diamonds": "6_of_diamonds",
        "Six of Hearts": "6_of_hearts",
        "Six of Spades": "6_of_spades",
        "Seven of Clubs": "7_of_clubs",
        "Seven of Diamonds": "7_of_diamonds",
        "Seven of Hearts": "7_of_hearts",
        "Seven of Spades": "7_of_spades",
        "Eight of Clubs": "8_of_clubs",
        "Eight of Diamonds": "8_of_diamonds",
        "Eight of Hearts": "8_of_hearts",
        "Eight of Spades": "8_of_spades",
        "Nine of Clubs": "9_of_clubs",
        "Nine of Diamonds": "9_of_diamonds",
        "Nine of Hearts": "9_of_hearts",
        "Nine of Spades": "9_of_spades",
        "Ten of Clubs": "10_of_clubs",
        "Ten of Diamonds": "10_of_diamonds",
        "Ten of Hearts": "10_of_hearts",
        "Ten of Spades": "10_of_spades",
        "Jack of Clubs": "jack_of_clubs",
        "Jack of Diamonds": "jack_of_diamonds",
        "Jack of Hearts": "jack_of_hearts",
        "Jack of Spades": "jack_of_spades",
        "Queen of Clubs": "queen_of_clubs",
        "Queen of Diamonds": "queen_of_diamonds",
        "Queen of Hearts": "queen_of_hearts",
        "Queen of Spades": "queen_of_spades",
        "King of Clubs": "king_of_clubs",
        "King of Hearts": "king_of_hearts",
        "King of Diamonds": "king_of_diamonds",
        "King of Spades": "king_of_spades",
        "Ace of Clubs": "ace_of_clubs",
        "Ace of Diamonds": "ace_of_diamonds",
        "Ace of Hearts": "ace_of_hearts",
        "Ace of Spades": "ace_of_spades"
    }

    var match = null;
    var position = null;
    var current_game = null;
    var player_key = null;

    //Set player name
    console.log(name)
    $('span.north_player').text(name);

    this.getName = function () {
        return name;
    }

    this.setupMatch = function (hearts_match, pos) {
        match = hearts_match;
        position = pos;
    }

    this.setupNextGame = function (game_of_hearts, pkey) {
        current_game = game_of_hearts;
        player_key = pkey;

        game_of_hearts.registerEventHandler(Hearts.GAME_STARTED_EVENT, function (e) {
            //Clear scores from last game
            $('.n_card_space').empty();
            $('.e_card_space').empty();
            $('.s_card_space').empty();
            $('.w_card_space').empty();
            $('.score_space').empty();

            setTimeout(function () { //Set a small delay so page loads
                alert('Dealing Cards for Next Match!');
            }, 5);

            for (var i = 0; i < 13; i++) {
                var card_to_append = '<img src="playing-card-back.png" class="blank_cards" alt="card" height="50" width="50">';
                $("div.w_card_space").append(card_to_append);
                $("div.s_card_space").append(card_to_append);
                $("div.e_card_space").append(card_to_append);
            }

            refresh_hand();

            //Check to see if it is a pass round or not, adjust message
            if (e.getPassType() == 1) {
                setTimeout(function () {
                    alert('Please choose 3 cards to pass left!');
                }, 250);
            } else if (e.getPassType() == 2) {
                setTimeout(function () {
                    alert('Please choose 3 cards to pass right!');
                }, 250);
            } else if (e.getPassType() == 3) {
                setTimeout(function () {
                    alert('Please choose 3 cards to pass across!');
                }, 250);
            } else {
                alert("This is a no pass round! Let's play a trick!");
            }

            refresh_scoreboard();
        });

        //Indicates that a pass was completed successfully 
        game_of_hearts.registerEventHandler(Hearts.PASSING_COMPLETE_EVENT, function (e) {
            console.log('Passing has been completed successfully');
        });

        //Shows an alert when the trick starts 
        game_of_hearts.registerEventHandler(Hearts.TRICK_START_EVENT, function (e) {
            var start_position = e.getStartPos();
            alert('The player in the ' + start_position + ' position will lead the trick!');

            //If North leads, display playable cards
            if (start_position == 'North') {
                highlight_player('north');
                show_playable_cards();
            }
        });

        //Adds cards to the score/playing area
        game_of_hearts.registerEventHandler(Hearts.CARD_PLAYED_EVENT, function (e) {
            //Identify the playing position
            var position_playing = e.getPosition()[0].toLowerCase();

            //Clear the previously highlighted player
            reset_player('north');
            reset_player('east');
            reset_player('south');
            reset_player('west');

            //Highlight the position that is about to play a card
            if (position_playing == 'n') {
                highlight_player('north');
            } else if (position_playing == 'e') {
                highlight_player('east');
            } else if (position_playing == 's') {
                highlight_player('south');
            } else if (position_playing == 'w') {
                highlight_player('west');
            }

            var card_to_append = '<img src="PNG-cards-1.3/' + cardDict[e.getCard().toString()] + '.png" class="cards" id="' + cardDict[e.getCard().toString()] + '" alt="card" height="50" width="50">';
            $('div.score_space').append(card_to_append);

            //Remove random card image if not North player
            if (position_playing != 'n') {
                $("div." + position_playing + "_card_space").find('img:first').remove();
            } else { //Just refresh hand if the North player to delete card
                refresh_hand();
            }
        });

        //Alerts when it's your turn
        game_of_hearts.registerEventHandler(Hearts.TRICK_CONTINUE_EVENT, function (e) {

            if (e.getNextPos() == 'North') {
                //Clear any other player
                reset_player('east');
                reset_player('south');
                reset_player('west');

                //Highlight player, alert, and show playable cards
                alert('It is your turn to play a card!');
                highlight_player('north');
                show_playable_cards();
            }
        });

        //Logs winner of trick and clears the board
        game_of_hearts.registerEventHandler(Hearts.TRICK_COMPLETE_EVENT, function (e) {
            var trick = e.getTrick();
            var trick_winner = trick.getWinner();
            var trick_points = trick.getPoints();

            //Clear the previously highlighted player
            reset_player('north');
            reset_player('east');
            reset_player('south');
            reset_player('west');

            alert('The ' + trick_winner + ' player won the trick with ' + trick_points + ' point(s)!');
            $('div.score_space').empty();
            refresh_hand();

        });

        game_of_hearts.registerEventHandler(Hearts.GAME_OVER_EVENT, function (e) {
            //Retrieve all scores
            var north_score = current_game.getScore(Hearts.NORTH);
            var east_score = current_game.getScore(Hearts.EAST);
            var south_score = current_game.getScore(Hearts.SOUTH);
            var west_score = current_game.getScore(Hearts.WEST);
            //Find the winning score for the round
            var winning_score = Math.min(north_score, east_score, south_score, west_score);
            var winner = '';

            //Round score and position
            if (north_score == winning_score) {
                winner = 'North';
            } else if (east_score == winning_score) {
                winner = 'East';
            } else if (south_score == winning_score) {
                winner = 'South';
            } else if (west_score == winning_score) {
                winner = 'West';
            } else {
                winner = null;
                console.log('This should not occur')
            }

            //Append the 4 scores for the round
            $('.n_card_space').append(north_score);
            $('.e_card_space').append(east_score);
            $('.s_card_space').append(south_score);
            $('.w_card_space').append(west_score);

            refresh_scoreboard();

        });
    }

    //Displaying current cards for the player
    $("#showDealt").click(function () {
        //Get the array of dealt cards
        var to_show = current_game.getHand(player_key).getUnplayedCards(player_key);
        //Empty the div if it contains stuff to prevent repeat appends
        if ($("div.n_card_space").children().length != 0) {
            $("div.n_card_space").empty();
        }
        //Iterates over cards and appends them to div
        to_show.forEach(function (c) {
            var card_to_append = '<img src="PNG-cards-1.3/' + cardDict[c.toString()] + '.png" class="cards" id="' + cardDict[c.toString()] + '" alt="card" height="50" width="50">';
            $("div.n_card_space").append(card_to_append);
        });
        attach_event_listeners();
    });

    //Function that can be used in other methods to refresh the hand
    var refresh_hand = function () {
        var to_show = current_game.getHand(player_key).getUnplayedCards(player_key);
        if ($("div.n_card_space").children().length != 0) {
            $("div.n_card_space").empty();
        }
        to_show.forEach(function (c) {
            var card_to_append = '<img src="PNG-cards-1.3/' + cardDict[c.toString()] + '.png" class="cards" id="' + cardDict[c.toString()] + '" alt="card" height="50" width="50">';
            $("div.n_card_space").append(card_to_append);
        });
        attach_event_listeners();
    }

    //Method to attach event listenrs to all cards currently displayed
    var attach_event_listeners = function () {
        var cards = document.getElementsByClassName('cards'); // Select all the cards
        for (var i = 0; i < cards.length; i++) {
            cards[i].addEventListener('click', function (e) { // Add a listener to each card
                this.classList.toggle('selected');
            })
        }
    }

    //Passing the 3 selected cards
    $("#pass").click(function () {
        //Get all selected cards
        var selected_cards = $(".selected");
        var card_array = [];
        var card_ids = [];

        //Alert user to select 3 cards
        if (selected_cards.length != 3) {
            alert("Please select three cards to pass");
            return;
        }
        //iterate over cards to add cards to card_array
        selected_cards.each(function (index, item) {
            var item_id = item.id;
            var item_suit = item_id.split('_')[2];
            var item_rank = item_id.split('_')[0];

            card_ids.push(item_id);
            card_array.push(new Card(Card.parseRank(item_rank), Card.parseSuit(item_suit)));
        });

        //Play the cards with error checking
        if (!current_game.passCards(card_array, player_key)) {
            alert('Failed to play cards, try again');
            return;
        }

        //Visually add new cards to hand
        refresh_hand();

    });

    //Showing playable cards 
    $('#showPlayable').click(function () {
        var playable = current_game.getHand(player_key).getPlayableCards(player_key);
        // console.log(playable);

        //May need to remove if it throws unexpected errors
        if (!playable) {
            alert('No cards to play at this time');
            return;
        }

        //Empty the playing space 
        if ($("div.n_card_space").children().length != 0) {
            $("div.n_card_space").empty();
        }

        //Iterate and append to div
        playable.forEach(function (c) {
            var card_to_append = '<img src="PNG-cards-1.3/' + cardDict[c.toString()] + '.png" class="cards" id="' + cardDict[c.toString()] + '" alt="card" height="50" width="50">';
            $("div.n_card_space").append(card_to_append);
        });
        attach_event_listeners();
    });

    //A function that is used to display only playable cards 
    var show_playable_cards = function () {
        var playable = current_game.getHand(player_key).getPlayableCards(player_key);

        //May need to remove if it throws unexpected errors
        if (!playable) {
            alert('No cards to play at this time');
            return;
        }

        //Empty the playing space 
        if ($("div.n_card_space").children().length != 0) {
            $("div.n_card_space").empty();
        }

        //Iterate and append to div
        playable.forEach(function (c) {
            var card_to_append = '<img src="PNG-cards-1.3/' + cardDict[c.toString()] + '.png" class="cards" id="' + cardDict[c.toString()] + '" alt="card" height="50" width="50">';
            $("div.n_card_space").append(card_to_append);
        });
        attach_event_listeners();
    }

    //Playing selected cards
    $('#play').click(function () {
        //Get currently selected cards
        var selected_card = $(".selected");
        //Check to make sure only one card has been selected
        if (selected_card.length != 1) {
            alert('Please select one card');
            return;
        }

        //Extract suit and rank from ID
        var card_rank = selected_card[0].id.split('_')[0];
        var card_suit = selected_card[0].id.split('_')[2];
        //Form new card, play it
        var card_to_play = new Card(Card.parseRank(card_rank), Card.parseSuit(card_suit));

        if (current_game.playCard(card_to_play, player_key)) {
            console.log('Successful Play');
        }

    });

    //Function to update the scoreboard
    var refresh_scoreboard = function () {
        //Empty old scores
        $(".n_score_space").empty();
        $(".e_score_space").empty();
        $(".s_score_space").empty();
        $(".w_score_space").empty();

        //Pull relevant information
        var current_scoreboard = match.getScoreboard();
        var north_score = current_scoreboard[Hearts.NORTH];
        var east_score = current_scoreboard[Hearts.EAST];
        var south_score = current_scoreboard[Hearts.SOUTH];
        var west_score = current_scoreboard[Hearts.WEST];

        //Append new scores
        $(".n_score_space").append(north_score);
        $(".e_score_space").append(east_score);
        $(".s_score_space").append(south_score);
        $(".w_score_space").append(west_score);
    }

    var highlight_player = function (position) {
        var player_class = "." + position + "_player";
        $(player_class).css('color', '#FFD700');
        $(player_class).css('font-weight', 'bold');
        $(player_class).css('font-size', '20px');
    }

    var reset_player = function (position) {
        var player_class = "." + position + "_player";
        $(player_class).css('color', '#000000');
        $(player_class).css('font-weight', 'normal');
        $(player_class).css('font-size', '16px');
    }

}