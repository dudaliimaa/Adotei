# 🐾 Adotei

O **Adotei** é um aplicativo móvel criado para **facilitar a adoção responsável de animais**, conectando pessoas interessadas em adotar com **doadores** e protetores.

A proposta do projeto é centralizar o processo de adoção em uma plataforma simples e segura, permitindo que animais disponíveis ganhem visibilidade e encontrem novos lares com mais facilidade.

## 📌 Sobre o Projeto

Grande parte das adoções ainda acontece de forma desorganizada em **redes sociais, grupos de mensagens ou publicações isoladas**, o que dificulta encontrar informações claras sobre animais disponíveis.

O **Adotei** surge como uma alternativa digital para organizar esse processo, permitindo que usuários possam:

- visualizar animais disponíveis para adoção
- cadastrar pets que precisam de um novo lar
- entrar em contato diretamente com doadores
- acompanhar o processo de adoção dentro do aplicativo

## 🎯 Objetivos

O projeto busca:

- incentivar a **adoção responsável**
- dar maior **visibilidade a animais disponíveis**
- facilitar a comunicação entre **adotantes e doadores**
- ajudar **ONGs e protetores independentes**
- reduzir o abandono de animais

## 👥 Público-alvo

O aplicativo foi pensado para atender principalmente:

- pessoas que desejam adotar um pet
- ONGs de proteção animal
- protetores independentes
- pessoas que precisam doar um animal

## ⚙️ Funcionalidades

### 👤 Gestão de Usuários

- cadastro e login de usuários
- autenticação segura
- validação de CPF
- gerenciamento de perfil

### 🐶 Catálogo de Pets

Os usuários podem visualizar animais disponíveis com informações como:

- fotos
- nome
- espécie
- sexo
- porte
- idade
- descrição

Também é possível buscar pets por filtros como:

- espécie
- porte
- idade
- status de adoção

### 💬 Comunicação

Para facilitar o contato entre as partes:

- integração com WhatsApp
- compartilhamento de local de encontro via Google Maps

## 🧩 Pré-requisitos

Antes de executar o projeto, verifique se você tem os seguintes itens instalados e configurados:

- Node.js 16 ou superior
- npm ou yarn
- Expo CLI instalado globalmente ou disponível via `npx`
- conta Firebase configurada e, se necessário, arquivo de ambiente (`.env`)

Para instalar o Expo CLI globalmente, execute:

- no Windows/Linux (PowerShell, CMD ou terminal):
  `npm install -g expo-cli`

Se preferir não instalar globalmente, use o Expo via `npx`.

### Configuração do Firebase

- Crie um projeto no Firebase
- Configure Authentication, Firestore e Storage
- Se o projeto usar variáveis de ambiente, crie um arquivo `.env` seguindo o modelo sugerido no repositório ou na documentação interna

## ▶️ Como executar

Siga estes passos para rodar o aplicativo tanto no Windows quanto no Linux.

1. Clone o repositório:
   `git clone <URL do repositório>`
2. Acesse a pasta do projeto:
   `cd Adotei`
3. Instale as dependências:
   - com npm:
     `npm install`
   - com yarn:
     `yarn install`
4. Configure o arquivo de ambiente, se aplicável:
   - copie o modelo de `.env.example` para `.env`
   - preencha as chaves do Firebase e outras variáveis necessárias
5. Inicie o projeto:
   - com npm:
     `npm start`
   - com yarn:
     `yarn start`
   - ou diretamente com Expo:
     `npx expo start`
6. Abra o app no emulador ou dispositivo via Expo:
   - no emulador Android/iOS
   - usando o app Expo Go no celular

Se necessário, use `ctrl + c` para parar o servidor e reinicie com o mesmo comando acima.

## 🛠 Tecnologias Utilizadas

- React Native
- TypeScript
- Expo
- Firebase
- Cloud Firestore
- Firebase Authentication
- Firebase Storage
- Git
- GitHub

## 👨‍💻 Equipe

Projeto desenvolvido por:

- Eduarda Lima
- Nathalia Cappellini
- Vitor Lopes

Curso: Análise e Desenvolvimento de Sistemas — FATEC Praia Grande
