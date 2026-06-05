# Meet&Move - Database

Our database is based on PostgreSQL. The Docker stack also bundles **Redis**
(cache / pub-sub) and **MinIO**, an S3-compatible object store used for image
storage in local development.

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

## Object storage (MinIO / S3)

Images (profile avatars, activity covers) are stored in a local S3-compatible
bucket served by MinIO. When the stack starts, a one-shot `minio-init` container
creates the `meetandmove` bucket and makes it publicly readable so images can be
displayed directly.

| What | Where |
|---|---|
| S3 API endpoint | `http://localhost:9000` |
| Web console | `http://localhost:9001` (user `meetandmove`, password `meetandmove-secret`) |
| Bucket | `meetandmove` |
| Public image URL | `http://localhost:9000/meetandmove/<key>` |

The API talks to it through the `S3_*` variables defined in `api/.env`. In
production the same variables can point at Cloudflare R2 or AWS S3 without code
changes. Uploaded objects persist in the `minio-data` Docker volume; `npm run
db:prune` removes it.

> ⚠️ The bucket is intentionally public-read for local development only. Do not
> reuse this configuration in production.