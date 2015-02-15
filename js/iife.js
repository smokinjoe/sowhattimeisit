// http://yuiblog.com/blog/2007/06/12/module-pattern/

 //Self-Executing Anonymous Func: Part 2 (Public & Private) 
(function( skillet, $, undefined ) { 
  //Private Property 
  var isHot = true;

  //Public Property
  skillet.ingredient = 'Bacon Strips';

  //Public Method
  skillet.fry = function() {
    var oliveOil;

    addItem( '\t\n Butter \n\t' );
    addItem( oliveOil );
    console.log( 'Frying ' + skillet.ingredient );
  };

  //Private Method
  function addItem( item ) {
    if ( item !== undefined ) {
        console.log( 'Adding ' + $.trim(item) );
    }
  }

}( window.skillet = window.skillet || {}, jQuery ));

//Public Properties 
console.log( skillet.ingredient ); //Bacon Strips

//Public Methods 
skillet.fry(); //Adding Butter & Fraying Bacon Strips

//Adding a Public Property 
skillet.quantity = "12"; 
console.log( skillet.quantity ); //12

//Adding New Functionality to the Skillet 
(function( skillet, $, undefined ) { 
  //Private Property 
  var amountOfGrease = "1 Cup";

  //Public Method
  skillet.toString = function() {
    console.log( skillet.quantity + ' ' +
                 skillet.ingredient + ' & ' +
                 amountOfGrease + ' of Grease' );
    console.log( isHot ? 'Hot' : 'Cold' );
  };
}( window.skillet = window.skillet || {}, jQuery ));

try { 
  //12 Bacon Strips & 1 Cup of Grease 
  skillet.toString(); //Throws Exception 
} catch( e ) { 
  console.log( e.message ); 
  //isHot is not defined 
} 