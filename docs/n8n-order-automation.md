# n8n Order Email Automation — BeautyMatch

This guide explains how to run n8n locally (npm, no Docker), configure a webhook workflow to send order confirmation emails and update MockAPI, and how the React app integrates with it.

---

## 1. Install and Configure n8n (npm only)

### 1.1 Install and run n8n

**Option A — Use npx (recommended, no global install)**

No global install needed. Run n8n with:

```bash
npx n8n
```

This downloads and runs n8n from the npm cache. Use this if global install fails (e.g. Windows EPERM or timeout).

**Option B — Install globally**

```bash
npm install -g n8n
```

Check the installation:

```bash
n8n --version
```

If global install fails on Windows with **EPERM** (permission) or **EIDLETIMEOUT** (registry timeout), see the [Troubleshooting](#61-common-issues) section below, or use Option A (`npx n8n`) instead.

### 1.2 Run n8n locally

- With **npx:** `npx n8n`
- With **global install:** `n8n`

By default n8n runs at **http://localhost:5678**. Open that URL in your browser to access the editor.

### 1.3 Enable basic authentication

Create a folder for n8n config (e.g. project root or a dedicated folder) and use environment variables.

**Option A — Inline (quick test only)**

```bash
set N8N_BASIC_AUTH_ACTIVE=true
set N8N_BASIC_AUTH_USER=admin
set N8N_BASIC_AUTH_PASSWORD=YourSecurePassword
n8n
```

**Option B — `.env` file (recommended)**

Create a file e.g. `n8n/.env` (or project root, and load it when starting n8n):

```env
N8N_BASIC_AUTH_ACTIVE=true
N8N_BASIC_AUTH_USER=admin
N8N_BASIC_AUTH_PASSWORD=YourSecurePassword
N8N_HOST=localhost
N8N_PORT=5678
N8N_PROTOCOL=http
```

Then run (from the folder that contains `.env`, or use a tool that loads it):

```bash
n8n
```

On Windows PowerShell you can load env from a file manually, or use `dotenv-cli`: `npx dotenv -e n8n/.env -- n8n`.

### 1.4 Configuration structure

| Variable | Description |
|----------|-------------|
| `N8N_BASIC_AUTH_ACTIVE` | Set to `true` to enable login. |
| `N8N_BASIC_AUTH_USER` | Username for the UI. |
| `N8N_BASIC_AUTH_PASSWORD` | Password for the UI. |
| `N8N_HOST` | Host (e.g. `localhost`). |
| `N8N_PORT` | Port (default `5678`). |
| `N8N_PROTOCOL` | `http` or `https`. |

Keep `.env` out of version control (add to `.gitignore` if it’s in the repo).

---

## 2. Webhook automation (mandatory)

- **Do not** use polling or cron for this flow.
- Use a **Webhook** trigger so React calls n8n when an order is placed.

**Flow:**

```
React Checkout → Axios POST → n8n Webhook
                          ↓
                    Send Email (Gmail SMTP)
                          ↓
                Update Order in MockAPI (PATCH)
                          ↓
                    Respond { success: true }
```

---

## 3. n8n workflow — exact configuration

### 3.1 Webhook node

- **Trigger:** Webhook  
- **HTTP Method:** POST  
- **Path:** e.g. `order-confirmation` (full URL will be like `http://localhost:5678/webhook/order-confirmation` or with your production URL).  
- **Respond:** Immediately (so n8n returns after the workflow runs).

**Payload the React app sends (and webhook receives):**

```json
{
  "id": "orderId",
  "userName": "string",
  "userEmail": "string",
  "items": [],
  "total": number
}
```

In later nodes, use:

- `{{ $json.body.id }}`
- `{{ $json.body.userName }}`
- `{{ $json.body.userEmail }}`
- `{{ $json.body.items }}`
- `{{ $json.body.total }}`

(If your webhook is configured to put the body in `body`, otherwise use the path your Webhook node shows in “Output”.)

### 3.2 Send Email node (Gmail SMTP)

- **Node:** Gmail (or “Send Email” with SMTP).  
- **From:** Your Gmail address (or use env variable).  
- **To:** `{{ $json.body.userEmail }}` (or the correct path from Webhook output).  
- **Subject:** e.g. `BeautyMatch — Order Confirmation #{{ $json.body.id }}`  
- **Email type:** HTML.  
- **Message body (HTML):** Premium-style confirmation, e.g.:

```html
<div style="font-family: Georgia, serif; max-width: 500px; margin: 0 auto;">
  <h2 style="color: #9E3B3B;">BeautyMatch — Order Confirmed</h2>
  <p>Hi {{ $json.body.userName }},</p>
  <p>Thank you for your order. Here’s a summary:</p>
  <ul>
    {{#each $json.body.items}}
    <li>{{ this.name }} — Qty: {{ this.quantity }} — ${{ this.price }}</li>
    {{/each}}
  </ul>
  <p><strong>Total: ${{ $json.body.total }}</strong></p>
  <p>We’ll notify you when your order ships.</p>
  <p>— BeautyMatch</p>
</div>
```

(Syntax may vary by node — use the node’s expression helper; above is Handlebars-style. In n8n use `{{ $json.body.userName }}` etc. and loop over `$json.body.items` as the node allows.)

**Credentials:** Create a Gmail SMTP credential in n8n and select it. Use env for password (e.g. Gmail App Password) if the node supports expressions.

### 3.3 HTTP Request node — update MockAPI

- **Method:** PATCH  
- **URL:** `https://6972993e32c6bacb12c754e5.mockapi.io/api/matchbeauty/orders/{{ $json.body.id }}`  
  (Or use an n8n env variable for the base URL and append `/$json.body.id`.)  
- **Body (JSON):**

```json
{
  "emailSent": true
}
```

- **Headers:** `Content-Type: application/json` (if not default).

This marks the order as “confirmation email sent” in MockAPI.

### 3.4 Respond to Webhook node

- **Node:** “Respond to Webhook” (or the Webhook node’s “Respond” option).  
- **Response body:**

```json
{
  "success": true
}
```

- **Status code:** 200.

---

## 4. React integration (Axios only)

### 4.1 Helper: `services/n8nService.js`

The app already includes a reusable helper:

- **Function:** `sendOrderToN8n(orderData)`  
- **Uses:** Axios (POST).  
- **Env:** `VITE_N8N_ORDER_WEBHOOK_URL` = full webhook URL (e.g. `http://localhost:5678/webhook/order-confirmation`).  
- **Behavior:** Sends `{ id, userName, userEmail, items, total }`, returns `{ success: true }` or `{ success: false, error }`.  
- **Error handling:** try/catch, timeout; no `fetch`.

### 4.2 Checkout flow

1. User fills shipping form and clicks “Confirm Order”.  
2. Frontend creates the order in MockAPI via `createOrder()` (see `features/orders/ordersAPI.js`).  
3. Frontend calls `sendOrderToN8n({ id, userName, userEmail, items, total })` with the created order’s `id`.  
4. n8n runs: send email → PATCH MockAPI `emailSent: true` → respond `{ success: true }`.  
5. If `success === true`, the UI shows order confirmed and clears the cart; otherwise it shows the error from `n8nService`.

---

## 5. Email setup (Gmail)

### 5.1 Gmail App Password

1. Use a Google Account with 2-Step Verification enabled.  
2. Go to: [Google Account → Security → 2-Step Verification → App passwords](https://myaccount.google.com/apppasswords).  
3. Create an app password for “Mail” (or “Other” and name it e.g. “n8n”).  
4. Copy the 16-character password; use it in n8n as the SMTP password (not your normal Gmail password).

### 5.2 SMTP configuration (n8n / Gmail)

| Field   | Value           |
|--------|-----------------|
| Host   | `smtp.gmail.com` |
| Port   | 587 (TLS)       |
| User   | Your Gmail address |
| Password | Gmail App Password (from above) |

Use n8n credential store; avoid hardcoding the password in the workflow.

### 5.3 Security

- Never commit `.env` or credentials.  
- Use App Passwords, not main account password.  
- In production, use env variables for all secrets and consider HTTPS for n8n.

---

## 6. Testing and debugging

### 6.1 Test webhook with Postman

1. Method: **POST**.  
2. URL: your webhook URL (e.g. `http://localhost:5678/webhook/order-confirmation`).  
3. Headers: `Content-Type: application/json`.  
4. Body (raw JSON):

```json
{
  "id": "test-order-1",
  "userName": "Jane Doe",
  "userEmail": "jane@example.com",
  "items": [
    { "name": "Test Product", "quantity": 1, "price": 29.99 }
  ],
  "total": 29.99
}
```

5. Send. You should get `{ "success": true }` and see the workflow run in n8n.

### 6.2 Test inside n8n UI

- Open the workflow and run it **manually** (Execute Workflow).  
- For the Webhook node, use “Listen for Test Event” and then send the same POST from Postman (or from the React app) so the webhook receives data.  
- Check each node’s output to confirm `body` shape and expressions.

### 6.3 Execution logs

- In n8n: **Executions** (left sidebar).  
- Open an execution to see each node’s input/output and errors.

### 6.4 Common issues

| Problem | What to check |
|--------|----------------|
| **npm install -g n8n fails (Windows)** | **EPERM:** Another process is locking npm’s global folder (antivirus, Windows Search, or a previous Node/n8n). Fix: (1) Close other terminals and Node processes; (2) Run PowerShell **as Administrator** and run `npm install -g n8n` again; or (3) Skip global install and use **`npx n8n`** instead. **EIDLETIMEOUT:** Network/registry timeout. Fix: Run `npm config set fetch-timeout 120000` and retry, or use **`npx n8n`**. |
| 401 / 403 | Basic auth: correct user/password; or CORS / webhook auth if you added it. |
| Webhook not firing | Correct URL; workflow **Active**; path matches (e.g. `/webhook/order-confirmation`). |
| Email not sent | Gmail SMTP credentials (App Password); “Less secure apps” not needed if using App Password. |
| MockAPI PATCH fails | Order `id` exists in MockAPI; URL and method (PATCH) correct; body `{ "emailSent": true }`. |
| React: “webhook URL not set” | `VITE_N8N_ORDER_WEBHOOK_URL` in `.env`; restart dev server after changing `.env`. |

---

## 7. Run n8n in the background (PM2)

### 7.1 Install PM2

```bash
npm install -g pm2
```

### 7.2 Start n8n with PM2

From a folder where you have your n8n `.env` (or after setting env):

```bash
pm2 start n8n --name "n8n-beautymatch"
```

Or with explicit env file (if using dotenv):

```bash
pm2 start "n8n" --name "n8n-beautymatch" --env production
```

To load a specific `.env` file you can use:

```bash
pm2 start n8n --name "n8n-beautymatch" --env-file /path/to/n8n/.env
```

(Check PM2 docs for your version; `--env-file` is supported in recent PM2.)

### 7.3 Useful PM2 commands

```bash
pm2 list
pm2 logs n8n-beautymatch
pm2 restart n8n-beautymatch
pm2 stop n8n-beautymatch
pm2 delete n8n-beautymatch
```

### 7.4 Auto restart on reboot

```bash
pm2 startup
pm2 save
```

---

## 8. Data flow and architecture

### 8.1 End-to-end flow

1. **User** completes checkout in React (shipping form + order summary).  
2. **React** creates the order in MockAPI (`POST /orders`) and gets back `id`.  
3. **React** calls `sendOrderToN8n({ id, userName, userEmail, items, total })` via Axios to the n8n webhook URL.  
4. **n8n** receives the payload, sends the confirmation email (Gmail SMTP), then PATCHes MockAPI `orders/:id` with `{ "emailSent": true }`, then responds `{ "success": true }`.  
5. **React** shows success and clears the cart.

### 8.2 React ↔ n8n ↔ MockAPI

- **React → MockAPI:** Create order (ordersAPI.js, Axios).  
- **React → n8n:** POST webhook with order data (n8nService.js, Axios).  
- **n8n → Gmail:** Send email.  
- **n8n → MockAPI:** PATCH order to set `emailSent: true`.  
- **n8n → React:** HTTP 200 and `{ "success": true }`.

### 8.3 MockAPI “orders” resource

Ensure your MockAPI project has an **orders** resource (same base as products, e.g. `.../api/matchbeauty/orders`). If it doesn’t, create it in the MockAPI dashboard. Each order can have: `userName`, `userEmail`, `items`, `total`, `emailSent` (boolean). The app creates orders with `emailSent: false`; n8n sets it to `true` after sending the email.

### 8.4 Admin dashboard and orders

The admin dashboard can read orders from MockAPI:

- **GET** `https://6972993e32c6bacb12c754e5.mockapi.io/api/matchbeauty/orders`  
  (or the same base URL you use in `ordersAPI.js`).

Each order has at least: `id`, `userName`, `userEmail`, `items`, `total`, `emailSent`. You can build an Orders page that lists them and filter by `emailSent` if needed.

---

## Environment variables summary

**React (Vite) — `.env` in project root**

```env
VITE_N8N_ORDER_WEBHOOK_URL=http://localhost:5678/webhook/order-confirmation
VITE_MOCKAPI_ORDERS_URL=https://6972993e32c6bacb12c754e5.mockapi.io/api/matchbeauty/orders
```

**n8n (e.g. `n8n/.env` or where you run n8n)**

```env
N8N_BASIC_AUTH_ACTIVE=true
N8N_BASIC_AUTH_USER=admin
N8N_BASIC_AUTH_PASSWORD=YourSecurePassword
```

Use the same MockAPI base in n8n’s HTTP Request node as in your React app (or an n8n variable) so PATCH targets the correct resource.

---

## Constraints respected

- **Axios only** in React (no `fetch`).  
- **Webhook trigger** (no polling/cron).  
- **Simple, beginner-friendly** flow and docs.  
- **No Docker** — n8n installed and run via npm.  
- **No backend framework** — MockAPI + n8n only.  
- **Secrets** in environment variables.
