Red Social
Para ejecutar el proyecto, deben abrir 3 consolas de comandos (CMD):

Una para MongoDB

Una para el backend

Una para el frontend

Importante: En el proyecto deben reemplazar todas las direcciones IP que aparezcan en las páginas por la IP de su equipo. Además, en MongoDB Compass la base de datos utilizada se llama webSocial.

Para obtener la IP de su equipo, abran una consola CMD y ejecuten el comando:

ipconfig
Luego, copien el valor que aparece en Dirección IPv4.

Pasos para iniciar cada terminal:
Primera terminal (MongoDB):
Ejecutar el siguiente comando para iniciar el servidor de MongoDB:

mongod
(Esto se hace en CMD desde el escritorio)

Segunda terminal (Backend):

Instalar las dependencias necesarias:

npm install express mongoose cors
Entrar a la carpeta del servidor:

cd server
Iniciar el backend:

node index.js
(Todo esto se hace en CMD desde la carpeta del proyecto)

Tercera terminal (Frontend):

Instalar las dependencias:

npm install
Iniciar la aplicación frontend:

npm start
(También desde la carpeta del proyecto)

Enlace de referencia para la descarga y configuración de MongoDB Compass
Para descargar e instalar MongoDB Compass:
https://youtu.be/eKXIxSZrJfw?si=3sILflpC95S-en1H

