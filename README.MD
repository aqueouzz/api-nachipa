
## ---------------------------------------------------------------------------------------- ##


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

git remote add origin https://github.com/username/repo.git
git push -u origin main

Tips Commits :
    Tipo	Uso
    feat	Nueva funcionalidad
    fix	Corrección de bugs
    docs	Cambios en documentación
    style	Cambios de formato (espacios, comas, sin tocar la lógica)
    refactor	Reestructuración del código sin cambiar funcionalidad
    test	Agrega o modifica tests
    chore	Cambios menores (builds, deps, configs)

    

git checkout -b feature/users-endpoint

# RAMA DEVELOP

npm i express
