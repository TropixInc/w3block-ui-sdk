# Readme

Como padrão, para iniciar o projeto: 

```
// NPM
npm install

//YARN
yarn install
```

## Linkando a lib

Para fazer a linkagem da lib para um outro projeto é necessário a utilização `npm link`, porem o `npm link` nao consegue resolver o problema de dependecias duplicadas, no caso desse projeto o React e o react-query. Para resolver esse problema é necessário fazer um link para a pasta do react no node_modules do projeto que voce vai aplicar essa lib.

```
npm link <PATH_TO_YOUR_APP>/node_modules/react --force
npm link <PATH_TO_YOUR_APP>/node_modules/react-query --force
```

## Linkando o projeto

Para teste da lib dentro do projeto é necessário fazer o link tambem do projeto com a lib, para isso utilizamos novamente o `npm link`, só que dessa vez dentro da pasta do seu app/projeto.

```
npm link <PATH_TO_LIB>
```

## Rodando o projeto

Tendo feito a linkagem do react da lib com o react do projeto e o link do projeto com a lib, para que a mudanças aconteçam em tempo real basta rodar o comando: 

```
//NPM
npm dev:watch

//YARN
yarn dev:watch
```
