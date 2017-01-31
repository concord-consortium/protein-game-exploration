rm -rf dist
git clone -b gh-pages https://github.com/concord-consortium/protein-game-exploration.git dist
webpack
cd dist
git add . && git commit -m 'Update gh-pages' && git push origin gh-pages
