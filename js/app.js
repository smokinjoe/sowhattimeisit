var app = {};

app.Problem = function (data) {
  var AM = 'am',
      PM = 'pm';

  var AMPMTEXT = {};
  AMPMTEXT[AM] = ' in the morning.';
  AMPMTEXT[PM] = ' in the afternoon.';

  var OFFSETTEXT = {};
  OFFSETTEXT[FAST] = ' hour(s) fast.';
  OFFSETTEXT[SLOW] = ' hour(s) slow.';

  this.hour = m.prop(data.hour);
  this.minute = m.prop(data.minute);
  this.offset = m.prop(data.offset);

  if (this.offset() !== 0) {
    this.offsetText = this.offset() > 0 ? m.prop(OFFSETTEXT[SLOW]) : m.prop(OFFSETTEXT[FAST]);
  }

  if (this.hour() > 12) {
    this.displayHour = m.prop(this.hour() - 12);
    this.ampm = m.prop(PM);
    this.ampmText = m.prop(AMPMTEXT[PM]);
  }
  else {
    this.displayHour = m.prop(this.hour());
    this.ampm = m.prop(AM); 
    this.ampmText = m.prop(AMPMTEXT[AM]);
  }

  if (this.minute() < 10) {
    this.displayMinute = m.prop("0" + this.minute());
  }
  else {
    this.displayMinute = m.prop(this.minute());
  }
};

app.Answer = function (data) {
  var arr = [];
  if (data.answer) {
    arr = data.answer.split(":")
  }
  else {
    return { error: 'Incorrect format' };
  }
  this.hour = m.prop(arr[0]);
  this.minute = m.prop(arr[1]);
};

app.vm = (function () {
  var vm = {};
  vm.init = function () {
    vm.hours = [];
    vm.minutes = [];
    // get this shit started!
    for (var i = 0; i < 24; i++) {
      vm.hours.push(i);
    }
    for (var i = 6; i < 54; i++) {
      vm.minutes.push(i);
    }

    // utility methods
    vm.randomArrValue = function (arr) {
      var key = (Math.random() * 0x10000 | 0) % arr.length;
      return arr[key];
    };

    vm.randomOffset = function () {
      return -vm.getRandomInt(0,3);
    };

    vm.getRandomInt = function (min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    



    
    // updateScore();
    // drawClock();
  };
}());
  












































































































































