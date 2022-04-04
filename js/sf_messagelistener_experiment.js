function TheIndexExperimentFunction() {
	//fetch('https://Schach-in-Oberlauter.de/js/stockfish.js').then();

//	fetch('https://Schach-in-Oberlauter.de/css/common.css').then(
//		function(value) { dummy1 = value; },
//		function(error) { dummy2 = error; }
//	  );

//  fetch('https://Schach-in-Oberlauter.de/css/common.css')
//  .then((data) => {
//    console.log(data).text();
//  });

//  var url = 'https://Schach-in-Oberlauter.de/js/stockfish.js';
// var storedText;

//  fetch(url)
//    .then(function(response) {
//      response.text().then(function(text) {
//        storedText = text;
//        console.log(storedText);
//      });
//    });

var i = 19;

// Aufruf für stockfish
//var stockfish = new Worker("js/stockfish.js");
//stockfish = STOCKFISH();
//stockfish.postMessage("uci");
//stockfish.onmessage = function(event) {
//  //NOTE: Web Workers wrap the response in an object.
// console.log(event.data ? event.data : event);
//};

// Aufruf für stockfish.js
//var wasmSupported = typeof WebAssembly === 'object' && WebAssembly.validate(Uint8Array.of(0x0, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00));
//wasmSupported = false;
//var stockfish = new Worker(wasmSupported ? 'js/stockfish.wasm.js' : 'js/stockfish.js');
//stockfish.addEventListener('message', function (e) {
//  console.log(e.data);
//});
//stockfish.postMessage('uci');


}
