global.locusModules = {};
global.locusModules.deasync = require.resolve('deasync');
global.locusModules.color = require.resolve('cli-color');
global.locusModules.stackTrace = require.resolve('stack-trace');
global.locusHistory = [];

function listener() {
  var done = false;
  var readline = require('readline');
  var color = require(global.locusModules.color);
  var deasync = require(global.locusModules.deasync);

  var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  writeBlock();
  exec();

  function writeBlock () {
    var trace = require(global.locusModules.stackTrace).get();
    var fileName = trace[3].getFileName();
    var file = require('fs').readFileSync(fileName, 'utf8');
    var lines = file.split('\n');
    var lineNumber = trace[3].getLineNumber() - 1;
    var start = lineNumber > 8 ? lineNumber - 8 : 0;
    var header = ' ' + fileName + ' - Line: ' + lineNumber + ' ';
    var border = '';

    for(var i = 0; i < header.length; i++) {
      border += '—';
    }

    console.log('');
    console.log(color.xterm(236).bgXterm(220)(header));
    console.log(color.xterm(244)(border));

    for(var i = start; i < lineNumber; i++) {
      console.log(i + ' : ' + color.xterm(220)(lines[i]));
    }
  }

  function exec() {
    rl.question(color.blueBright('ʆ: '), function (text) {
      try {
        if (text === 'quit' || text === 'exit') {
          return done = true;
        } else {
          var result = eval(text);

          if (result.text === null) {
            result = 'null';
          } else if (result === undefined) {
            result = 'undefined';
          }

          console.log(color.greenBright(result));
          exec();
        }
      } catch(err) {
        console.log(color.redBright(err));
        exec();
      }
    });
  }

  deasync.loopWhile(function(){ return !done });
}

global.locus = '(' + listener.toString() + ').call(this)';