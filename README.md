# Submodule Updater
A Node script for managing repos with submodules and seamlessly updating them

## What's this?
Using Git Submodules, you can use one repository as a dependency/library within another. This is especially convenient if you have code which you need to access across multiple repos - put the shared code in one repo and include it as a submodule inside the other repos. However, it can be a hassle to maintain this setup, because the submodules inside a parent repo don't get automatically updated. Any time you make an update to a repo S, which acts as a submodule to a parent repo P, you must then go into P and run a series of commands to update it to S's most recent commit. This is, in a way, good - if the update to S's repo unexpectedly caused P to break, you wouldn't want that happening automatically behind the scenes; you'd want to deliberately update the repo and test it out first before deploying. That said, the manual update process it is prone to human error, and can involve a lot of repetitive maintenance if you have many different repos depending on a given submodule.

Submodule Updater is just a little executable that cuts down the grunt work and removes the potential human error. Simply run the `submoduleUpdater.js` file, passing in as a flag the repo whose submodules you want to update. The script will enter your local copy of the repo, run the proper commands to update the submodules, and commit the result. It will not interfere with any uncommitted changes you may have on your local copy, and said changes will remain saved but uncommitted after the command is run.

## Setup

* Run `npm install`
* In `repos.json`, add the names of the your submodule-dependent repos, as strings, to the `repos` array (I have added a repo of my own, which has submodules, as a POC). The script assumes that you store all your repos in the same directory, so if that isn't the case, you will need to move them to the same level as this repo.

## Use

* Run `node submoduleUpdater.js -r <repo>` where `<repo>` is equal to the name of the repo you want to update. You can also run `npm start -- -r <repo>` if you want, which will achieve the same result.
* Follow the prompt assuring the program that you're not crazy and really do want this to happen.
* Assuming you set everything up correctly, your repo's submodules should be updated and committed. However, you will still have to cd into the repo's root and run a `git push` to send the updates to origin. (This is by design, so you can test the code locally before pushing; if the submodule update broke something, you can always undo the last commit by running `git reset HEAD~`, but this gets messier post-push and could result in you inadvertently putting broken code onto production.)
