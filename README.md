# Submodule Updater
A Node script for managing repos with submodules and seamlessly updating them

## What's this?
Using Git Submodules, you can use one repository as a dependency/library within another. This is especially convenient if you have code which you need to access across multiple repos - put the shared code in one repo and include it as a submodule inside the parent repos. However, it can be a hassle to maintain this setup, because the submodule inside the parent repo doesn't get automatically updated. Any time you make an update to a repo which acts as a submodule to a parent, you must then go into the parent and run a series of commands to update the parent to the submodule's most recent commit. This is, in a way, good - if you have a parent repo P, which depends on a submodule S and an update to S's repo unexpectedly causes P to break, you wouldn't want that happening automatically behind the scenes, you'd want to manually decide to update the repo and test it out before deploying. That said, updating it is prone to human error, and can also involve a lot of maintenance work if you have many different repos depending on a given submodule.

Submodule Updater is just a little executable that cuts down the maintenance and removes the potential human error. Simply run the `submoduleUpdater.js` file, passing in as a flag the repo whose submodules you want to update. The script will enter your local copy of the repo, run the proper commands to update the submodules, and commit the update. It will not interfere with any uncommitted changes you may have on your local copy, and said changes will remain saved and uncommitted after the command is run.

## Setup

* Run `npm install`
* In `repos.json`, add the names of the repositories as strings to the `repos` array (I have added a repo of my own, which has submodules, as a POC). The executable assumes that you store all your repos in the same directory, so if that isn't the case, you will need to move them to the same level as this repo.

## Use

* Run `node submoduleUpdater.js -r <repo>` where `<repo>` is equal to the name of the repo you want to update.
* Follow the prompt assuring the program that you're not crazy and really do want to proceed.
* Assuming you set everything up correctly, your repo's submodules should be updated and committed. However, you will still have to cd into the repo's root and run a `git push` to send the updates to origin. (This is by design, so you can test the code locally before pushing; you can always undo the last commit if the submodule update broke something by running `git reset HEAD~`, but this gets messier post-push and could result in you inadvertently putting broken code onto production.)
