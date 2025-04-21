git init
git config --global core.autocrlf true
git config --global user.email ""
git config --global user.name ""
git add.
git commit -m ""
git checkout -b develop
git push -u origin develop

git checkout main
git log --oneline

git branch // Saber en que rama estoy parado
git branch --show-current // comando mas limpio (solo la actual)

git checkout -b features/users-endpoint

# RAMA DEVELOP

npm i express
