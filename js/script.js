(function (Pop, $, undefined) {
  var hours = [],
      minutes = [];
      offset = 0,
      $hours = $('.hours'),
      $minutes = $('.minutes'),
      $offset = $('.offset'),
      $answer = $('.answer'),
      $submitBtn = $('.submit-answer'),
      $populateBtn = $('.populate');


  Pop.init = function () {
    // get this shit started!
    for (var i = 0; i < 13; i++) {
      hours.push(i);
    }
    for (var i = 0; i < 60; i++) {
      minutes.push(i);
    }
  };

  Pop.populate = function () {
    var hour = randomArrValue(hours), 
        minute = randomArrValue(minutes);

    $hours.html(hour);
    $minutes.html(minute);
  };

  // Private methods
  randomArrValue = function (arr) {
    var key = (Math.random() * 0x10000 | 0) % arr.length;
    return arr[key];
  }

  // event bindings
  $populateBtn.on('click', function () {
    Pop.populate();
  });


})( window.Pop = window.Pop || {}, jQuery);
