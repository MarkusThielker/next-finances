# Next-Finances

This is my simple finances tracker that I use to keep track of my spending.

## Using the app

### Understanding the Basics

- **Entities**: The core building blocks of your finances.
  - Accounts: Where you hold money (e.g., bank accounts, PayPal account, cash)
  - Entities: Where you spend money (e.g., Walmart, Spotify, Netflix)
- **Payments**: Record money movement.
  - Expenses: Money leaving an Account. (Account -> Entity)
  - Income: Money entering an Account. (Entity -> Account)
- **Categories** *(optional)*: Add labels to Payments for better tracking.

### Your First Steps

- Set up: Create Entities and Accounts that reflect your finances.
- Record a Payment:
  - Enter the amount and date.
  - Select payor and payee
  - *(optional)* Assign a category or enter a note.
- Explore: View your payment history and view your statics at the dashboard

### Tips

- Install the website as a PWA for easy access.
- Get in the habit of recording Payments as they happen for accurate tracking.
- Use categories to understand your spending patterns.

## Development

Clone this repository and run the following commands:

```bash

## create .env file
cp .env.example .env

## start the database
docker compose -f docker/finances-dev/docker-compose.yml up -d

## generate prisma client
bunx prisma generate

## apply database migrations
bunx prisma migrate deploy

## start the development server
bun run dev

```

Then open [http://localhost:3000](http://localhost:3000) with your browser and create an account.
While in development mode, you can generate sample data from the [Account page](http://localhost:3000/account).

## Deployment

Copy the [docker-compose.yaml](./docker/finances-prod/docker-compose.yaml) file and
the [.env.example](./docker/finances-prod/.env.example) from 'docker/finances-prod' to your server.

Rename the `.env.example` file to `.env` and adjust the required environment variables.

The docker setup expects you to run a Traefik reverse proxy. It will then register itself automatically.
If your setup is different, you will need to adjust the `docker-compose.yaml` file accordingly.

The finances containers will automatically register themselves to a running watchtower container if it is present.

Finally run `docker-compose up -d` on your server to start the application.
