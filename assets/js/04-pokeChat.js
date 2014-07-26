function initChat() {

  // Setup base properties
  var user_id,
      rand_id = Math.floor(Math.random() * (152 - 0 + 1)) + 0,
      poke_id = 0,
      name = 'guest',
      current_status = 'online',
      position = Math.random() * (80 - 20) + 20;


  function isNumber (o) {
    return ! isNaN (o-0) && o !== null && o.replace(/^\s\s*/, '') !== "" && o !== false && o % 1 === 0;
  }


  var hash = location.hash.replace('#', '');

  if(isNumber(hash)) {
    if(hash <= 152) {
      rand_id = hash;
    } else {
      rand_id = 0;
    }
  }

  // Get a reference to the list of pokemon
  var pokeref = 'https://haustraliaer.firebaseio.com/pokelist/' + rand_id;

  // Get firebase references
  var userListRef = new Firebase('https://haustraliaer.firebaseio.com/users');
  var pokelist = new Firebase(pokeref);

  pokelist.once('value', function(data) {

    var pokemon = data.val();

    poke_id = pokemon.number;
    name = pokemon.name;


    // Generate a reference to a new location for my user with push.
    var myUserRef = userListRef.push();

    // A helper function to let us set our own state.
    function setUserStatus(status) {

      // Set our status in the list of online users.
      current_status = status;
      myUserRef.set({
        name: name,
        poke_id: poke_id,
        status: status,
        position: position });

      myUserRef.once('value', function(snapshot) {
        user_id = snapshot.name();
      });
    }

    // Get a reference to my own presence status.
    var connectedRef = new Firebase("https://haustraliaer.firebaseio.com/.info/connected");

    connectedRef.on("value", function(isOnline) {

      if (isOnline.val()) {

        // If we lose our internet connection, we want ourselves removed from the list.
        myUserRef.onDisconnect().remove();

        // Set our initial online status.
        setUserStatus("online");

      } else {

        // We need to catch anytime we are marked as offline and then set the correct status. We
        // could be marked as offline 1) on page load or 2) when we lose our internet connection
        // temporarily.
        setUserStatus(current_status);
      }
    });
  });



  // Frontend /////////////////////////////////////////////////////////////////////////


  // Update our GUI to show someone"s online status.

  userListRef.on("child_added", function(snapshot) {

    var user = snapshot.val();

    var poke_html = '<div id="' + snapshot.name() + '_container" class="poke_container"><div class="test_chat" id="' + snapshot.name() + '_chat"></div><img id ="' + snapshot.name() + '_user" class="visitor__img" src="assets/img/poke/' + user.poke_id + '.gif"/></div>'

    $(poke_html).hide().appendTo("#js-fullscreen-intro").fadeIn(500);

    $('#' + snapshot.name() + '_container').css({
      left: user.position + "%"
    });

    var message_id =  snapshot.name() + '_msg';
    var message_hash = '#' + message_id;
    var html = '<p id="' + message_id + '" class="il-center alert__message">A wild ' + user.name + ' appeared</p>';

    $(html).hide().appendTo("#js-text-area").fadeIn(500,function() {

      // after fading in...
      $(message_hash).delay(800).fadeOut(500, function() {
       $(message_hash).delay(300).remove();
      });
    });

  });

  // Update our GUI to remove the status of a user who has left.
  userListRef.on("child_removed", function(snapshot) {
    var user = snapshot.val();
    var message_id =  snapshot.name() + '_msg';
    var message_hash = '#' + message_id;
    var html = '<p id="' + message_id + '" class="il-center alert__message">' + user.name + ' fled!</p>';

    $("#" + snapshot.name() + "_user").fadeOut(500,function() {
      $(this).remove();
    });

    $(html).hide().appendTo("#js-text-area").fadeIn(500,function() {

      // after fading in...
      $(message_hash).delay(800).fadeOut(500, function() {
       $(message_hash).delay(300).remove();
      });
    });
  });

  // chat log:

  var chatDate = 'https://haustraliaer.firebaseio.com/chat/' + datDate();
  var chatRef = new Firebase(chatDate);

  // When the user presses enter on the message input, write the message to firebase.
  $('#messageInput').keypress(function (e) {
    if (e.keyCode == 13) {
      var text = $('#messageInput').val();
      var chatter = user_id;
      var pokemon = name;
      chatRef.push({
        text:text,
        chatter: chatter,
        pokemon: pokemon
      });
      $('#messageInput').val('');
    }
  });


  var first_chat = true;
  chatRef.endAt().limit(1).on('child_added', function (snapshot) {

    if(first_chat) {
       // ignore the first snapshot, which is an existing record
       first_chat = false;
       return;
    }
    var message = snapshot.val();
    var message_id =  snapshot.name() + '_chat';
    var message_hash = '#' + message_id;
    var html = '<p id="' + message_id + '" class="il-center alert__message">' + message.text + '</p>';

    var datDiv = '#' + message.chatter + '_chat';

    var snapshot_url = chatRef + '/' + snapshot.name();

    $(html).hide().appendTo(datDiv).fadeIn(500,function() {
      // after fading in...
      $(message_hash).delay(12000).fadeOut(500, function() {
       $(message_hash).delay(300).remove();
      });
    });

  });




  function datDate() {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!

    var yyyy = today.getFullYear();
    if(dd<10){dd='0'+dd} if(mm<10){mm='0'+mm} today = mm+'-'+dd+'-'+yyyy;

    return today;
  }

}
