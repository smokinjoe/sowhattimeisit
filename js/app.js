var app = {};

app.Defaults = (function () {
  this.hours = [];
  this.minutes = [];

  for (var i = 0; i < 24; i++) {
   this.hours.push(i);
  }
  for (var i = 6; i < 54; i++) {
   this.minutes.push(i);
  }
}());

app.Problem = {
  new : function () {
    var AM = 'am',
        PM = 'pm';

    var AMPMTEXT = {};
    AMPMTEXT[AM] = ' in the morning.';
    AMPMTEXT[PM] = ' in the afternoon.';

    var FAST = 'fast',
        SLOW = 'slow';

    var OFFSETTEXT = {};
    OFFSETTEXT[FAST] = ' hour(s) fast.';
    OFFSETTEXT[SLOW] = ' hour(s) slow.';

    this.hour = m.prop(app.utility.getRandomInt(4, 24));
    this.minute = m.prop(app.utility.randomArrValue(app.Defaults.minutes));
    this.offset = m.prop(app.utility.getRandomInt(0, 3));

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
  }

};

app.Answer = {
  set : function (data) {
    var arr = [];
    if (data.answer) {
      arr = data.answer.split(":")
    }
    else {
      return { error: 'Incorrect format' };
    }
    this.hour = m.prop(arr[0]);
    this.minute = m.prop(arr[1]);
  }
};

app.Clock = {
  init : function () {
    this.canvas = {};
    this.clock = {};
    this.hourHand = {};
    this.minuteHand = {};
  },
  draw : function () {
    //var hour_sign;
    this.canvas = Raphael("clock", 200, 200);
    this.clock = this.canvas.circle(100, 100, 95);

    this.clock.attr({"fill":"#f5f5f5","stroke":"#444444","stroke-width":"5"});
    for(i=0;i<12;i++){
      var start_x = 100+Math.round(80*Math.cos(30*i*Math.PI/180));
      var start_y = 100+Math.round(80*Math.sin(30*i*Math.PI/180));
      var end_x = 100+Math.round(90*Math.cos(30*i*Math.PI/180));
      var end_y = 100+Math.round(90*Math.sin(30*i*Math.PI/180));  
      //hour_sign = canvas.path("M"+start_x+" "+start_y+"L"+end_x+" "+end_y);
    }    
    var pin = this.canvas.circle(100, 100, 5);
    pin.attr("fill", "#000000");
  },
  update : function (problem) {
    if (this.hourHand.remove) {
      this.hourHand.remove();
    }
    if (this.minuteHand.remove) {
      this.minuteHand.remove();
    }

    this.hourHand = this.canvas.path("M100 100L100 50");
    this.hourHand.attr({stroke: "#444444", "stroke-width": 6});
    this.minuteHand = this.canvas.path("M100 100L100 40");
    this.minuteHand.attr({stroke: "#444444", "stroke-width": 4});
    this.hourHand.rotate(30 * problem.displayHour() + (problem.minute() / 2.5), 100, 100);
    this.minuteHand.rotate(6 * problem.minute(), 100, 100);
  }
};

app.utility = {};
app.utility.randomArrValue = function (arr) {
  var key = (Math.random() * 0x10000 | 0) % arr.length;
  return arr[key];
};
app.utility.getRandomInt = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

app.controller = function () {
  var ctrl = this;


};

app.view = function (ctrl) {
  return m("div.game-container", [
           m("div.game-box", [
             m("div.score-container.well", [
               m("h4", "Right : ", [
                 m("span.num-right", 0)
               ]),
               m("h4", "Wrong : ", [
                 m("span.num-wrong", 0)
               ])
             ]),
             m("div.problem-container", [
               m("div.analog-clock", [
                 m("h4", [
                   m("span.offset", 0)
                 ]),
                 m("div#clock")
               ]),
               m("div.offset-container.hidden", [
                 m("strong", [
                   m("span.offset", 0)
                 ])
               ])
             ]),
             m("div.answer-container", [
               m("h4", "So, roughly what time is it?"),
               m("div.input-group", [
                 m("input.answer.form-control"),
                 m("span.input-group-btn", [
                   m("button.js-submit-answer.btn.btn-default", "Submit!"),
                   m("button.js-populate.btn.btn-default", "New game")
                 ])
               ]),
               m("div.btn-group.right", [
                 m("button.js-show-hint.btn.btn-default.btn-sm", "Show hint"),
                 m("button.js-show-answer.btn.btn-default.btn-sm", "Show answer")
               ]),
               m("div.clear")
             ]),
             m("div.message-container")
           ])
         ]);
};

//app.vm.init();
//m.render(document.getElementById("app-container"), app.view(app.vm));
m.module(document.getElementById("app-container"), app);


































































































































