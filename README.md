# Listei

App mobile de lista de compras com controle de orçamento, categorias, recorrência e estatísticas de gastos.

## Stack

- React Native
- Expo
- TypeScript
- Zustand
- React Navigation
- AsyncStorage

## Features

- Criação e gerenciamento de listas de compras, com duplicação e finalização de listas
- Catálogo de produtos reutilizável, organizado por categorias, com item favoritos
- Itens por unidade (quantidade + preço) ou por peso (kg + preço/kg)
- Preço estimado: itens novos herdam o último preço pago (atualizado no catálogo ao finalizar cada lista), então a lista já mostra um total aproximado antes da compra
- Controle de orçamento por lista, com barra de progresso e alerta visual (cor de erro + valor excedido) quando o total ultrapassa o orçamento definido
- Progresso de compra: enquanto a lista está aberta, um cabeçalho mostra itens marcados/total e gasto parcial/total
- Recorrência de listas (semanal, quinzenal ou mensal) com geração automática
- Estatísticas de gastos: total do mês, variação em relação ao mês anterior, últimos 7 dias, top itens e top categorias
- Exportação/compartilhamento de listas em texto
- Backup e restauração dos dados em JSON
- Tema claro, escuro ou automático (segue o sistema)

## Como rodar

```bash
npm install
npx expo start
```

No terminal do Expo, escolha como abrir o app: emulador Android/iOS, ou o app Expo Go no seu celular (lendo o QR code).

Também é possível rodar diretamente em uma plataforma específica:

```bash
npm run android
npm run ios
npm run web
```
