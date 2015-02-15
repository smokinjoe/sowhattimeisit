(function (Pop, $, JStore, undefined) {
  // private properties
  var hours = [],
      minutes = [];
      currentProblem = {},
      currentAnswer = {},
      score = {},
      $container = $('.container'),
      $hours = $('.hours'),
      $minutes = $('.minutes'),
      $offset = $('.offset'),
      $answer = $('.answer'),
      $submitBtn = $('.submit-answer'),
      $populateBtn = $('.populate'),
      $getStartedBtn = $('.get-started'),
      $rightScore = $('.num-right'),
      $wrongScore = $('.num-wrong'),
      $messageContainer = $('.message-container');


  // private methods
  var init = function () {
    var data;

    JStore.init('POP');

    // get this shit started!
    for (var i = 0; i < 24; i++) {
      hours.push(i);
    }
    for (var i = 0; i < 60; i++) {
      minutes.push(i);
    }

    var data = JStore.get();
    if (data.length > 0) {
      score.right = data[0].right;
      score.wrong = data[0].wrong;
    }
    else {
      score.right = 0;
      score.wrong = 0;
    }
    updateScore();
  };

  var randomArrValue = function (arr) {
    var key = (Math.random() * 0x10000 | 0) % arr.length;
    return arr[key];
  };

  var randomOffset = function () {
    var offset = 0 - (Math.random() * 10 | 0);
    if (Math.abs(offset) > currentProblem.hour) {
      return randomOffset(); // JOE: hopefully this works JUST good enough
    }
    return offset;
  };

  var checkAnswer = function () {
    var minutesMatch = false,
        hoursMatch = false;

    $container.removeClass('error');

    if ((currentProblem.hour + currentProblem.offset) == currentAnswer.hour) {
      hoursMatch = true;
    }

    // totally +cheating
    if (currentProblem.minute == +currentAnswer.minute) {
      minutesMatch = true;
    }

    if (hoursMatch && minutesMatch) {
      displayMessage('fuck yeah, you did it!');
      score.right++;
    }
    else {
      displayMessage('sorry, try again!');
      $container.addClass('error');
      score.wrong++;
    }

    updateScore();
  };

  var updateScore = function () {
    $rightScore.html(score.right);
    $wrongScore.html(score.wrong);

    // JOE: necessary or it'll just keep adding more and more - which I don't want to do, I want to just replace the data
    //JStore.clear();
    // JOE: I think if I take some time to work on JocalStorage's initialization options, I could probably take care of this shit

    //JStore.store(score);
  };

  var displayMessage = function (msg) {
    $messageContainer.html(msg).show(function () {
      window.setTimeout(function () {
        $messageContainer.fadeOut(function () {
          $messageContainer.html('');
        });
      }, 1500);
    });
  };

  // public methods
  Pop.populate = function () {
    currentProblem.hour = randomArrValue(hours), 
    currentProblem.minute = randomArrValue(minutes),
    currentProblem.offset = randomOffset();

    $hours.html(currentProblem.hour);
    if (currentProblem.minute < 10) {
      currentProblem.minute = "0" + currentProblem.minute;
    }
    $minutes.html(currentProblem.minute);
    $offset.html(currentProblem.offset);

    // JOE: looks like we got the beginnings of some clear() method
    $answer.val('');
    $container.removeClass('error');
  };

  Pop.submit = function () {
    var arr = $answer.val().split(":");
    // parse the answer data - add some error detection ... later
    currentAnswer.hour = arr[0];
    currentAnswer.minute = arr[1];

    checkAnswer();
  };

  // event bindings
  $populateBtn.on('click', function () {
    Pop.populate();
  });

  $submitBtn.on('click', function () {
    Pop.submit();
  });

  $getStartedBtn.on('click', function () {
    $('.intro-box').fadeOut(function () {
      $('.game-box').fadeIn();
      Pop.populate();
    });
  });

  init();
})( window.Pop = window.Pop || {}, jQuery, new JocalStorage());

