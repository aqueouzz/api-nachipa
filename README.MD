
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

git remote add origin (https://github.com/aqueouzz/api-nachipa.git)
git push -u origin master

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


# DOCKER 

    docker --version

    docker images



Crear archivos DockerFile
Crear archivos docker-compose.yml
Crear archivos .dockerignore


Validar la exclusion de archivos

    docker build --no-cache --progress plain -f Dockerfile .

Crear contenedor

    docker build -t api-nachipa .


    docker-compose up --build

Contenedores activos
    docker ps

Detener contenedores activos
    docker stop <container_id>

Levantar el contenedor :

    docker run -p 4500:4500 mi-app-nachipa


Para volver a instalar un paquete de node y subirl para un contenedor

    git add package.json package-lock.json
    git commit -m "feat: added lodash"
    git push

Pero debo volver a contruir el contenedor

    docker build -t mi-app



Entra : 
    http://localhost:4500


