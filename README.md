# Meet&Move

Meet&Move is a mobile application that helps people find partners for physical activities, like sports, cinema, museum, etc.

## Tech Stack

- **Frontend**: [React Native](https://reactnative.dev/) + [TamagUI](https://tamagui.dev/)
- **Backend**: [Hono](https://hono.dev/)
- **Database**: [PostgreSQL](https://www.postgresql.org/)

## How to run the project ?

```bash
# Clone the repository
git clone https://github.com/maximepenn/Meet-and-Move.git

# Install dependencies
npm install

# Run the app
npm start
```

> [!WARNING]  
> This command might not work on Windows because of a bug in the library used to run simultaneously multiple npm scripts (mprocs).
> 
> To run the project on Windows, you can run the following commands in different terminals:
> ```bash
> // Mobile app
> npm run start:mobile
>
> // API
> npm run start:api
>
> // Database
> npm run db:start
> ```