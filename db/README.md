# Meet&Move - Database

Our database is based on PostgreSQL.

## How to run it locally ?

To run it locally, you need to have Docker installed on your machine.

[Install Docker Desktop](https://docs.docker.com/desktop/setup/install/windows-install/) (Pick the right version for your OS)

Then, you can run the database using the following command:

```bash
docker-compose up -d
```

or in the project root folder:

```bash
npm run db:start
```

you can also run the entire project with the following command:

```
npm start
```

## How to connect to the database ?

The database is accessible on `localhost:5432`.

The username is `meetandmove` and the password is `meet&move`.