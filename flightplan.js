// flightplan.js
var plan = require('flightplan');

plan.target('production', [
  {
    host: 'PocketChange',
    username: 'root',
    agent: process.env.SSH_AUTH_SOCK
  }
]);

var tmpDir = 'PaperQuik-com-' + new Date().getTime();

// run commands on localhost
plan.local(function(local) {
  local.log('Deploy the current build of PaperQuik.com.');
  local.log('Run build');
  local.exec('grunt build');

  local.log('Copy files to remote hosts');
  local.with('cd dist', function() {
    var filesToCopy = local.exec('find .');

    // rsync files to all the target's remote hosts
    local.transfer(filesToCopy, '/tmp/' + tmpDir);
  });
});

// run commands on the target's remote hosts
plan.remote(function(remote) {
  remote.log('Move folder to web root');
  remote.sudo('cp -R /tmp/' + tmpDir + '/*' + ' /var/www/paperquik');
  remote.rm('-rf /tmp/' + tmpDir);
});
