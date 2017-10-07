#!/usr/bin/env bash

dir=DISC_CLONED
git clone https://github.com/markpad/markpad.git $dir
cd $dir
git checkout master
sed --in-place '/\/build\.js/d' .gitignore || exit 0
git rm build.js
cat ./.gitignore
npm install
npm run build
git add build.js
ls
git commit -m "Atualizando gh-pages via travis-ci"
git status
git push --force "${GH_REFERENCE}" master:gh-pages