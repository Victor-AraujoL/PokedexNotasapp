# Como rodar o app no PC

Este projeto foi feito com React Native, Expo e JavaScript.

## O que precisa instalar

1. Node.js

   Baixe e instale pelo site oficial:

   https://nodejs.org

   Depois de instalar, confira no terminal:

   ```bat
   node --version
   npm --version
   ```

2. Expo Go no celular

   Instale o aplicativo Expo Go pela loja do celular:

   - Android: Play Store
   - iPhone: App Store

## Como instalar as dependencias do projeto

Abra o CMD na pasta do projeto:

```bat
cd /d "D:\VSCODE PROJETOS\Pokedexapp"
```

Instale as dependencias:

```bat
npm install
```

## Como iniciar o app

Na pasta do projeto, rode:

```bat
npx expo start --lan --port 8081
```

Depois escaneie o QR Code pelo Expo Go no celular.

## Observacoes importantes

- O celular e o PC precisam estar na mesma rede.
- O PC pode estar no cabo e o celular no Wi-Fi, desde que estejam no mesmo roteador.
- Se der erro de conexao, libere o Node.js no Firewall do Windows.
- O app usa a PokeAPI, entao precisa de internet para carregar os Pokemon.
- O app usa SQLite local pelo pacote expo-sqlite.

## Comando para limpar processos antigos

Se o Expo travar ou disser que a porta ja esta em uso, rode:

```bat
taskkill /F /IM node.exe
```

Depois inicie novamente:

```bat
npx expo start --lan --port 8081
```
