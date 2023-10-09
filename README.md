# Execução do Aplicativo Node.js com Docker Compose

Este repositório contém um aplicativo Node.js que utiliza Docker Compose para configurar um ambiente de desenvolvimento com Prisma e um banco de dados PostgreSQL. Siga as etapas abaixo para configurar e executar o aplicativo em sua máquina local.

## Pré-requisitos

Certifique-se de ter os seguintes pré-requisitos instalados:

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)
- [Node.js](https://nodejs.org/)
- [Yarn](https://yarnpkg.com/)

## Passos de Execução

1. Clone este repositório para sua máquina local
2. Execute o docker e rode o comando `docker-compose up -d`
2. Crie um arquivo .env na raiz do projeto com as seguintes configurações: DATABASE_URL=postgresql://root:password@db:5432/database
3. Execute o comando `yarn install` para instalar as dependências do projeto
4. Execute o comando `yarn start` para executar o projeto

