# Trainer Activity

Application full-stack pour le suivi et la gestion d’activités côté formateur : une interface **React** parle à une API **NestJS**, avec une base **PostgreSQL**. Le dépôt regroupe le frontend (`frontend/`), le backend (`backend/`) et la stack locale sous **Docker Compose** (`docker/`).

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)

## Prérequis

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/) (LTS recommandé)
- [Docker](https://www.docker.com/) avec Docker Compose

## Initialisation

1. **Cloner le dépôt**

   ```bash
   git clone <url-du-depot>
   cd trainer-activity
   ```

2. **Configurer l’environnement**

   Placez et vérifiez les fichiers `.env` aux bons emplacements (`backend/.env`, `docker/.env`) pour que le backend et Docker Compose les chargent correctement.

3. **Démarrer PostgreSQL et pgAdmin**

   ```bash
   cd docker
   docker compose up -d
   cd ..
   ```

4. **Backend** (terminal 1 — laissez-le ouvert une fois l’API lancée)

   ```bash
   cd backend
   npm install
   npx prisma migrate dev
   npx prisma generate
   npm run start:dev
   ```

5. **Frontend** (terminal 2, depuis la racine du dépôt `trainer-activity`)

   ```bash
   cd frontend
   npm install
   npm run dev
   ```

L’API NestJS écoute par défaut sur le port **3000** ;
Le frontend écoute par défaut sur le port **5173**.


Test