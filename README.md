# Jotion Extended
This is a repository for my submission for Convex Build Bounty: Jotion, which took place from Nov 16 until December 3rd 2023. The foundation of this application is based on [Antonio's Jotion](https://github.com/AntonioErdeljac/notion-clone-tutorial)

New Features:

- Real-time Chat
- Presence
- Using convex storage instead of edgestore
- Ability to make a document public/private
- Ability to make a document editable/non-editable.

### Prerequisites

**Node version 18.x.x**

### Cloning the repository

```shell
git clone https://github.com/trace2798/jotion_convex_extented/.git
```

### Install packages

```shell
npm i
```

### Setup .env file


```js
# Deployment used by `npx convex dev`
CONVEX_DEPLOYMENT=
NEXT_PUBLIC_CONVEX_URL=

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

EDGE_STORE_ACCESS_KEY=
EDGE_STORE_SECRET_KEY=
```

### Setup Convex

```shell
npx convex dev

```

### Start the app

```shell
npm run dev
```
