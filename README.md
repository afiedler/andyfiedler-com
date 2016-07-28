# Deploying

This assumes that you've merged your changes into `master`.

```
git status

# confirm working directory is clean

jekyll build

git checkout gh-pages
ls | grep -v _site|xargs rm -rf
cp -r _site/* .
rm -rf _site/
touch .nojekyll

git add .
git commit -a -m 'update content'

git push prod gh-pages:master
git checkout master
```
