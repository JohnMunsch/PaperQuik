
// Running this requires installing Shipit (https://github.com/shipitjs/shipit).
// Then use commands like:
//   shipit production install
//   shipit production deploy
//   shipit production upgrade
module.exports = function (shipit) {
  require('shipit-deploy')(shipit);

  shipit.initConfig({
    default: {
      key: '.vagrant/machines/default/virtualbox/private_key'
    },
    vagrant: {
      servers: 'vagrant@127.0.0.1:2222'
    },
    production: {
      servers: 'root@PocketChange'
    }
  });

  var tmpDir = 'PaperQuik-com-' + new Date().getTime();

  shipit.task('install', function () {
    // MongoDB install instructions for Ubuntu per http://docs.mongodb.org/manual/tutorial/install-mongodb-on-ubuntu/
    shipit.remote('sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 7F0CEB10')
        .then(function () {
          // "Create a list file for MongoDB" - What does that mean? I would have appreciated more explanation 
          // from the MongoDB install instructions here.
          return shipit.remote('echo "deb http://repo.mongodb.org/apt/ubuntu trusty/mongodb-org/3.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.0.list');
        })
        .then(function () {
          // We need to do this anyway whether we're installing MongoDB or not.
          return shipit.remote('sudo apt-get update');
        })
        .then(function () {
          // We'll wait for the update to complete before installing some software I like to have on the
          // server.
          return shipit.remote('sudo apt-get -y install apache2 emacs23 git unzip nodejs npm mongodb-org');
        })
        .then(function () {
          var promises = [ ];

          // We couldn't copy this file earlier because there isn't a spot for it until after Apache is installed.
          promises.push(shipit.remoteCopy('paperquik.conf', '~'));
          promises.push(shipit.remoteCopy('../ClearAndDraw/mdm.conf', '~'));

          // Create the directories to which we map these projects.
          promises.push(shipit.remote('sudo mkdir /var/www/mdm /var/www/paperquik'));

          return Promise.all(promises);
        })
        .then(function () {
          return shipit.remote('sudo mv ~/*.conf /etc/apache2/sites-available/');
        }).then(function () {
          // We don't need the following set of actions to happen in any particular order. For example,
          // we're good if the disables happen before the enables.
          var promises = [ ];

          promises.push(shipit.remote('sudo a2enmod expires headers rewrite proxy_http'));

          promises.push(shipit.remote('sudo a2dissite 000-default'));

          promises.push(shipit.remote('sudo a2ensite paperquik mdm'));

          // But we do need this to wait until we've complete all of the above. So we have it wait until
          // all of their promises have resolved.
          Promise.all(promises).then(function () {
            shipit.remote('sudo service mongod start');
            shipit.remote('sudo service apache2 reload');
          });
        });
  });

  // This shipit file doesn't yet use the official shipit deploy functionality. It may in the future but
  // this is my old sequence and I know it works. Note: I also know theirs seems like it might be
  // better because it can roll back and I definitely do not have that.
  shipit.task('deploy', function () {
    shipit.log('Deploy the current build of PaperQuik.com.');
    shipit.local('grunt build')
        .then(function () {
          return shipit.remoteCopy('dist/*', '/tmp/' + tmpDir);
        })
        .then(function () {
          shipit.log('Move folder to web root');
          return shipit.remote('sudo cp -R /tmp/' + tmpDir + '/*' + ' /var/www/paperquik')          
        })
        .then(function () {
          shipit.remote('rm -rf /tmp/' + tmpDir);        
        });
  });

  shipit.task('upgrade', function () {
    shipit.log('Fetches the list of available Ubuntu upgrades.');
    shipit.remote('sudo apt-get update').then(function () {
      shipit.log('Now perform the upgrade.');
      shipit.remote('sudo apt-get -y dist-upgrade');
    });
  });
};
