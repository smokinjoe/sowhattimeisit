(function (Pop, $, undefined) {
  // private properties
  var hours = [],
      minutes = [];
      currentProblem = {},
      currentAnswer = {},
      $container = $('.container'),
      $hours = $('.hours'),
      $minutes = $('.minutes'),
      $offset = $('.offset'),
      $answer = $('.answer'),
      $submitBtn = $('.submit-answer'),
      $populateBtn = $('.populate');


  // private methods
  var init = function () {
    // get this shit started!
    for (var i = 0; i < 24; i++) {
      hours.push(i);
    }
    for (var i = 0; i < 60; i++) {
      minutes.push(i);
    }
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
      alert('fuck yeah, you did it!');
    }
    else {
      alert('sorry, try again!');
      $container.addClass('error');
    }

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

  init();
})( window.Pop = window.Pop || {}, jQuery);

