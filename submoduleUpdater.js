var colors = require('colors');
var fs = require('fs');
var prompt = require('prompt');
var { exec } = require('child_process');

var logger = {
  success: function(msg) {
    console.log(msg.blue);
  },
  warn: function(msg) {
    console.log(msg.yellow);
  },
  err: function(msg) {
    console.log('Error: '.red, msg.red);
    process.exit();
  }
};

var flagIndex = process.argv.indexOf('-r');
var repo = process.argv[flagIndex + 1];

function checkRepo(repo) {
  var REPO_LIST = JSON.parse(fs.readFileSync('repos.json')).repos;

  if (REPO_LIST.indexOf(repo) === -1) {
    logger.err('Please specify a valid repository name (an array of repos can be found in the repos.json file).');
  }

  prompt.start();
  prompt.get({
    properties: {
      confirm: {
        pattern: /^(Y|N|y|n)$/gi,
        description: colors.yellow(`You are about to commit all updates to the git submodules of the "${repo}" repo. Are you sure you want to proceed? (y/n): `),
        required: true
      }
    }
  }, function(err, result) {
    if (result.confirm.match(/(N|n)$/gi)) {
      process.exit();
    }

    updateSubmodules(repo);
  });
}

function updateSubmodules(repo) {
  var GIT_STEPS = [
    // Stash away any uncommitted changes inside the repo;
    // We don't want them coupled with the submodule update.
    'git add .',
    'git stash',

    // Update submodules and commit the result.
    'git submodule update --remote --merge',
    'git add .',
    'git commit -m "Submodule sync"',

    // Unstash unrelated local changes.
    'git stash pop'
  ];

  exec(`cd ../${repo} && ` + GIT_STEPS.join(' && '), function(error, stdout) {
    if (!stdout.length) {
      logger.err('Problem updating submodules. Please try again.');
    }

    if (stdout.indexOf('nothing to commit') !== -1) {
      logger.warn('Submodules already up-to-date. Nothing to commit.');
      process.exit();
    }

    console.log(stdout);
    logger.success('Submodules updated and committed! Change directories into your local repo copy and push to submit updates to origin.');
  });
}

prompt.message = '';
prompt.delimiter = '';
prompt.colors = false;

if (flagIndex === -1 || !repo) {
  logger.err('Please specify a repository for which you to update submodules using the -r flag.');
}

checkRepo(repo);
