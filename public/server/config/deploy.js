'use strict';

if (process.env.NODE_ENV === 'production') {
  const path = require('path');

  const deployConfig = path.resolve(__dirname, '../../../webpack.production.config.js');
  console.log("config", deployConfig);
  // We basically just create a child process that will run
  // the production bundle command
  const child_process = require('child_process');

  child_process.exec(`webpack -p --config ${deployConfig}`, function (error, stdout, stderr) {
    console.log('stdout: ' + stdout);
    console.log('stderr: ' + stderr);
    if (error !== null) {
      console.log('exec error: ' + error);
    }
  });
}
