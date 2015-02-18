(function (Pop, $, JStore, undefined) {
  // private properties
  var hours = [],
      minutes = [];
      currentProblem = {},
      currentAnswer = {},
      score = {},
      level = 1, // unused for now
      levelMessages = [], // unused for now
      winsPerLevel = 1, // unused for now
      canvas = Raphael("clock", 200, 200), // raphael.js canvas
      clock = canvas.circle(100, 100, 95),
      hourHand = {},
      minuteHand = {},
      $gameContainer = $('.game-container'),
      $hours = $('.hours'),
      $minutes = $('.minutes'),
      $ampm = $('.ampm'),
      $offset = $('.offset'),
      $answer = $('.answer'),
      $submitBtn = $('.submit-answer'),
      $populateBtn = $('.populate'),
      $showAnswerBtn = $('.show-answer'),
      $getStartedBtn = $('.get-started'),
      $rightScore = $('.num-right'),
      $wrongScore = $('.num-wrong'),
      $messageContainer = $('.message-container'),
      $burger = $('.command-hamburger'),
      $burgerMenu = $('.burger-menu');

  var AM = 'am',
      PM = 'pm';

  var AMPMTEXT = {};
  AMPMTEXT[AM] = ' in the morning.';
  AMPMTEXT[PM] = ' in the afternoon.';

  var FAST = 'fast';
      SLOW = 'slow';

  var OFFSETTEXT = {};
  OFFSETTEXT[FAST] = ' hour(s) fast.';
  OFFSETTEXT[SLOW] = ' hour(s) slow.';

    // JOE: unused for now
  var levelMessages = [
    'Beginnings.',
    'The offset will now disappear after 2 seconds.',
    'The offset will remain and the time will disappear after 4 seconds.'
  ];

  // private methods
  var init = function () {
    var data;

    JStore.init('POP');

    // get this shit started!
    for (var i = 0; i < 24; i++) {
      hours.push(i);
    }
    for (var i = 6; i < 54; i++) {
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
    drawClock();
  };

  var randomArrValue = function (arr) {
    var key = (Math.random() * 0x10000 | 0) % arr.length;
    return arr[key];
  };

  var randomOffset = function () {
    //var offset = 0 - (Math.random() * 10 | 0);
    //if (Math.abs(offset) > currentProblem.hour) {
    //  return randomOffset(); // JOE: hopefully this works JUST good enough
    //}
    return -getRandomInt(0,3);
  };

  var checkAnswer = function () {
    var minutesMatch = false,
        hoursMatch = false;

    currentAnswer.minute.replace('am','');
    currentAnswer.minute.replace('AM','');
    currentAnswer.minute.replace('a.m.','');
    currentAnswer.minute.replace('A.M.','');
    currentAnswer.minute.replace('am.','');
    currentAnswer.minute.replace('AM.','');
    currentAnswer.minute.replace('pm','');
    currentAnswer.minute.replace('PM','');
    currentAnswer.minute.replace('p.m.','');
    currentAnswer.minute.replace('P.M.','');
    currentAnswer.minute.replace('pm.','');
    currentAnswer.minute.replace('PM.','');

    if (currentProblem.hour + currentProblem.offset > 12) {
      currentAnswer.hour = parseInt(currentAnswer.hour) + 12;
    }

    if ((currentProblem.hour + currentProblem.offset) == currentAnswer.hour) {
      hoursMatch = true;
    }

    // totally +cheating
    if (currentProblem.minute == +currentAnswer.minute) {
      minutesMatch = true;
    }
    else if (hoursMatch) {
      // get roughly what time it is
      var lowEnd = currentAnswer.minute > 4 ? +currentAnswer.minute - 5 : 4;
      var highEnd = currentAnswer.minute < 54 ? +currentAnswer.minute + 5 : 59;

      if (lowEnd <= currentAnswer.minute <= highEnd) {
        minutesMatch = true;
      }
    }

    if (hoursMatch && minutesMatch) {
      displayMessage('Correct', 'success');
      Pop.populate();
      score.right++;
      //if (score.right > level * winsPerLevel) {
      //  alert(levelMessages[level++]);
      //}
    }
    else {
      displayMessage('Try again!', 'error');
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

  var displayMessage = function (msg, msgClass, duration) {
    duration = duration || 1500;
    msgClass = msgClass || '';
    $messageContainer.addClass(msgClass);
    $messageContainer.html(msg).show(function () {
      window.setTimeout(function () {
        $messageContainer.fadeOut(function () {
          $messageContainer.html('');
          $messageContainer.removeClass(msgClass);
        });
      }, duration);
    });
  };

  var getRandomInt = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  // clock drawing and upating utility methods
  function drawClock(){
    var hour_sign;

    clock.attr({"fill":"#f5f5f5","stroke":"#444444","stroke-width":"5"});
    for(i=0;i<12;i++){
      var start_x = 100+Math.round(80*Math.cos(30*i*Math.PI/180));
      var start_y = 100+Math.round(80*Math.sin(30*i*Math.PI/180));
      var end_x = 100+Math.round(90*Math.cos(30*i*Math.PI/180));
      var end_y = 100+Math.round(90*Math.sin(30*i*Math.PI/180));  
      hour_sign = canvas.path("M"+start_x+" "+start_y+"L"+end_x+" "+end_y);
    }    
    var pin = canvas.circle(100, 100, 5);
    pin.attr("fill", "#000000");    

    updateClock()
  }
  
  function updateClock(){
    if (hourHand.remove) {
      hourHand.remove();
    }
    if (minuteHand.remove) {
      minuteHand.remove();
    }

    hourHand = canvas.path("M100 100L100 50");
    hourHand.attr({stroke: "#444444", "stroke-width": 6});
    minuteHand = canvas.path("M100 100L100 40");
    minuteHand.attr({stroke: "#444444", "stroke-width": 4});
    hourHand.rotate(30 * currentProblem.displayHour + (currentProblem.minute / 2.5), 100, 100);
    minuteHand.rotate(6 * currentProblem.minute, 100, 100);
  }

  // public methods
  Pop.populate = function () {
    var offsetText = 'on time.';

    currentProblem.hour = getRandomInt(4, 24), 
    currentProblem.minute = randomArrValue(minutes),
    currentProblem.offset = randomOffset();

    if (currentProblem.offset !== 0) {
      offsetText = currentProblem.offset > 0 ? OFFSETTEXT[SLOW] : OFFSETTEXT[FAST];
    }

    if (currentProblem.hour > 12) {
      currentProblem.displayHour = currentProblem.hour - 12;
      currentProblem.ampm = PM;
    }
    else {
      currentProblem.displayHour = currentProblem.hour;
      currentProblem.ampm = AM;
    }
    $hours.html(currentProblem.displayHour);
    $ampm.html(AMPMTEXT[currentProblem.ampm]);    

    if (currentProblem.minute < 10) {
      currentProblem.minute = "0" + currentProblem.minute;
    }
    $minutes.html(currentProblem.minute);
    //$offset.html(currentProblem.offset);
    if (currentProblem.offset !== 0) {
      $offset.html(Math.abs(currentProblem.offset) + offsetText);
    }
    else {
      $offset.html(offsetText);
    }

    // JOE: this should be some sort of test or constant or something..
    // who knows, I'm tired.
    //if (level === 2) {
    //  window.setTimeout(function () {
    //    $offset.fadeOut(function (){
    //      $offset.html('').fadeIn();
    //    });
    //  }, 2000);
    //}
    //else if (level === 3) {
    //  window.setTimeout(function () {
    //    $hours.fadeOut();
    //    $minutes.fadeOut(function () {
    //      $hours.html('').fadeIn();
    //      $minutes.html('').fadeIn();
    //    });
    //  }, 4000);
    //}

    updateClock();

    // JOE: looks like we got the beginnings of some clear() method
    $answer.val('');
  };

  Pop.submit = function () {
    var arr = $answer.val().split(":");
    // parse the answer data - add some error detection ... later
    currentAnswer.hour = arr[0];
    currentAnswer.minute = arr[1];

    checkAnswer();
  };

  Pop.showMenu = function () {
    $burger.hide();
    $burgerMenu.animate({
      left: '0px'
    }, 700);
  };

  Pop.hideMenu = function () {
    $burger.show();
    $burgerMenu.animate({
      left: '-400px'
    }, 200);
  };

  Pop.showAnswer = function (confirmed) {
    var answer = {};
    confirmed = confirmed || confirm("Are you sure you want to see the answer?");
    if (confirmed) {
      answer.hour = currentProblem.hour + currentProblem.offset;
      answer.minute = currentProblem.minute;
      if (answer.hour > 12) {
        answer.hour -= 12;
      }

      displayMessage('The answer is, ' + answer.hour + ':' + answer.minute, 'info', 5000);
    }
  };

  Pop.debug = function (options) {
    options = options || {};

    if (options.hour) {
      currentProblem.hour = options.hour;
      if (currentProblem.hour > 12) {
        currentProblem.displayHour = currentProblem.hour - 12;
        currentProblem.ampm = PM;
      }
      else {
        currentProblem.displayHour = currentProblem.hour;
        currentProblem.ampm = AM;
      }
      $hours.html(currentProblem.displayHour);
      $ampm.html(AMPMTEXT[currentProblem.ampm]);
    }

    if (options.minute) {
      currentProblem.minute = options.minute;
      if (currentProblem.minute < 10) {
        currentProblem.minute = "0" + currentProblem.minute;
      }
      $minutes.html(currentProblem.minute);
    }

    if (options.offset) {
      currentProblem.offset = options.offset;
      $offset.html(currentProblem.offset);
    }

    updateClock();
    $('.digital-clock').show();
  };

  // event bindings
  $populateBtn.on('click', function () {
    Pop.populate();
  });

  $submitBtn.on('click', function () {
    Pop.submit();
  });

  $answer.on('keyup', function (e) {
    var $input = $(this),
        code = e.which;
    if (code === 13) {
      Pop.submit();
    }
  });

  $getStartedBtn.on('click', function () {
    $('.intro-box').fadeOut(function () {
      $('.game-box').fadeIn();
      Pop.populate();
    });
  });

  $burger.on('click', function () {
    Pop.showMenu();
  });

  $showAnswerBtn.on('click', function () {
    Pop.showAnswer();
  });

  init();
})( window.Pop = window.Pop || {}, jQuery, new JocalStorage());