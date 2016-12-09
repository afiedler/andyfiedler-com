# Preview
```
jekyll serve
```

Open browser to http://localhost:4000

# Adding Pictures
See https://github.com/robwierzbowski/jekyll-picture-tag

Examples:
```
{% picture book-covers/sprint.png [class="book-cover"] %}

```

# Deploying

This assumes that you've merged your changes into `master`.

```
# run from repo root
# assumes you have the Github pages in ../website (relative to the repo root)

git status

# confirm working directory is clean

jekyll build JEKYLL_ENV=production

cp -r _site/* ../website
cd ../website

git branch # confirm on gh-pages

git add .
git commit -a -m 'update content'

git push origin gh-pages
```
