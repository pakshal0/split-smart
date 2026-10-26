# Split Smart

**Split Expenses. Not Friendships.** Split Smart is a beginner-friendly MERN app for tracking shared expenses among friends, roommates, and travel groups. It stores expense shares and repayments, then calculates each member’s net position from those records. It does not move money or verify bank transfers.

##Video's Link

## Features

- Account registration and login with bcrypt password hashing and expiring JWTs.
- Create groups, invite people with a unique code, and view members.
- Record INR expenses with equal splits, including deterministic paise rounding.
- View group balances and suggested repayments calculated from expense and settlement history.
- Record a repayment confirmation made outside the app.
- Personalized group dashboard, responsive landing page, and protected app routes.

## Technology and structure

React, Vite, React Router, Axios, Tailwind CSS, Lucide React; Node.js, Express, Mongoose, MongoDB Atlas, JWT, bcryptjs.

```text
client/  React frontend and Vercel config
server/  Express API, Mongo models, business logic, tests
README.md
```

## Prerequisites

Install Node.js 20 or newer and npm. Create a MongoDB Atlas account and database cluster (free tier is sufficient for a small demo). You do not need MongoDB installed locally.

## Install and configure

From the project root, install each app’s dependencies:

```bash
cd server && npm install
cd ../client && npm install
```

Make private environment files from the examples:

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

Set these values:

**`server/.env`**

- `PORT=5001` for local work; Render sets its own port.
- `NODE_ENV=development` locally; set `production` on Render.
- `MONGODB_URI` to your Atlas connection string with database name `split_smart`.
- `JWT_SECRET` to a random secret of at least 32 characters. For example, generate one with `openssl rand -hex 32`.
- `CLIENT_URL=http://localhost:5173` locally. For production, set this to the exact Vercel site origin, without a trailing slash.

**`client/.env`**

- `VITE_API_URL=http://localhost:5001/api` locally. In production it must be your Render service URL followed by `/api`.

Never put MongoDB credentials or the JWT secret in the client environment.

## MongoDB Atlas setup

1. In MongoDB Atlas, create a project and a cluster.
2. Under **Database Access**, create a database user with a strong password. Keep this separate from your Atlas website login.
3. Under **Network Access**, allow your development IP address. For a demo on Render, use Atlas’s documented network access approach; allowing `0.0.0.0/0` permits connections from any IP and should be paired with a strong database user password and least-privilege database access. Prefer a fixed egress IP/private networking option when your hosting plan supports it.
4. Choose **Connect → Drivers**, copy the connection string, replace the username/password placeholders with the database user credentials, and include `/split_smart` before any query string. URL-encode special characters in the password.
5. Put the finished URI only in `server/.env` for local development and Render’s `MONGODB_URI` setting for deployment. Never commit or publicly share it.

## Run locally

Start the API from the `server/` directory:

```bash
cd server
npm run dev
```

Start the frontend in a second terminal from the `client/` directory:

```bash
cd client
npm run dev
```

Open the Vite URL printed in the terminal (normally `http://localhost:5173`). The API health check is `http://localhost:5001/api/health`. The API intentionally exits on startup if MongoDB or the JWT secret is missing or invalid.

## Try the app

1. Register with your name, email, and a password of at least 8 characters.
2. Create a group from the dashboard. Copy the invitation code from the group header.
3. Register another account in a separate browser session and join using that code.
4. Add an expense, choose who paid, and select the participants. Amounts accept decimals and are stored as integer paise.
5. Open **Balances** or **Overview** to see net balances and suggested repayments. Positive means the member should receive money; negative means the member owes money.
6. After a real repayment has happened outside the app, record who paid whom under **Settlements**. This is only a group member’s confirmation; Split Smart does not verify the transfer.

### How balances work

For each user: amount paid for expenses − allocated expense shares + settlements sent − settlements received. A repayment from a debtor to a creditor reduces both balances toward zero. Expense shares sum exactly to the expense amount; leftover paise go to earlier participants in the submitted order. Suggested repayments simplify the net balances without changing the records or balances.

## Deploy backend to Render

1. Push this repository to a Git provider. The root `render.yaml` is ready to use as a Render Blueprint, or you can configure a web service manually.
2. For manual setup, create a **New → Web Service** connected to the repository and set the **Root Directory** to `server`.
3. Use **Build Command** `npm ci` and **Start Command** `npm start`.
4. Add environment variables `NODE_ENV=production`, `MONGODB_URI`, `JWT_SECRET` (random, 32+ characters), and `CLIENT_URL` (the exact deployed Vercel origin). Render supplies `PORT` automatically.
5. Deploy and check `https://YOUR-RENDER-SERVICE.onrender.com/api/health`. Database should report `connected`.

## Deploy frontend to Vercel

1. Import the repository as a Vercel project and set **Root Directory** to `client`.
2. Vercel should detect Vite. Build command is `npm run build`; output directory is `dist`.
3. Add `VITE_API_URL=https://YOUR-RENDER-SERVICE.onrender.com/api` in Vercel project settings.
4. Deploy, then set Render’s `CLIENT_URL` to the new Vercel origin and redeploy the Render service if needed.
5. When changing Vercel environment variables, trigger a new deployment; Vite embeds them into the frontend build.

The frontend sends the JWT in an `Authorization` header and keeps it in session storage, so it survives refreshes in the same browser tab session and is cleared when the session ends or the user logs out. This avoids cross-site cookie requirements for separate Vercel and Render domains. Use HTTPS in production. This MVP does not include refresh tokens or persistent “remember me” sessions.

## API reference

All routes use `/api`; group routes require a bearer token.

| Method | Route | Purpose |
|---|---|---|
| GET | `/health` | API and database readiness |
| POST | `/auth/register` | Create account (`name,email,password,confirmPassword`) |
| POST | `/auth/login` | Login (`email,password`) |
| POST | `/auth/logout` | Client logout acknowledgement |
| GET | `/auth/me` | Current account |
| POST / GET | `/groups` | Create / list current member’s groups |
| POST | `/groups/join` | Join with `inviteCode` |
| GET | `/groups/:groupId` | Group, history, balances, suggestions |
| GET | `/groups/:groupId/members` | Member list is available as part of group detail |
| GET | `/groups/:groupId/balances` | Net balances and repayment suggestions |
| GET / POST | `/groups/:groupId/expenses` | List / add equal-split expense |
| PUT / DELETE | `/groups/:groupId/expenses/:expenseId` | Correct or remove an expense and recalculate balances |
| GET / POST | `/groups/:groupId/settlements` | List / record repayment confirmation |
| GET | `/groups/:groupId/suggested-settlements` | Suggested transfers |

## Tests and checks

From `server/`, run `npm test` for the splitting, rounding, balance, settlement, simplification, and invalid member logic tests. From `client/`, run `npm run build` to check the production bundle. A live database check requires your Atlas credentials.

## Common issues

- **API says database URI missing:** check `server/.env` exists and has `MONGODB_URI`.
- **Atlas connection timeout:** confirm Network Access includes the current IP and credentials are correct; URL-encode special password characters.
- **CORS error on deployed frontend:** Render’s `CLIENT_URL` must match the Vercel origin exactly, including `https://` and excluding a trailing slash.
- **Frontend cannot reach API:** verify the Vercel `VITE_API_URL` ends with `/api` and redeploy after changing it.
- **Invalid or expired session:** log in again; JWT lifetime is seven days.

## MVP limitations

Equal splits only; no custom shares, recurring expenses, email invitations, payment processing, account recovery, refresh tokens, or admin/member roles. Members can record settlements, which are not independently verified. Transaction lists are capped at 100 records. The dashboard’s shared-spending figure is the sum of group expenses visible to the current user, so the same expense can appear in each member’s dashboard; it is not the user’s personal amount owed. The group details API returns full transaction history for current balance calculation.
