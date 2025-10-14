## Online Store (Next.js, NextAuth, MongoDB, ImageKit, Razorpay)

An online image marketplace built with Next.js App Router. Includes authentication, role-based authorization, product management, orders, ImageKit uploads, and Razorpay payment/webhook handling.

### Tech Stack
- Next.js 15 (App Router) + React 19
- NextAuth (Credentials) with JWT sessions
- MongoDB + Mongoose
- Tailwind CSS v4
- ImageKit (`@imagekit/next`)
- Razorpay (checkout + webhook)
- React Hook Form, react-hot-toast, lucide-react

### Features
- Authentication (login/register) with credential provider
- Role-based access control via middleware and client guards
  - Admin-only: `\/admin` (create products)
  - Auth-only: `\/orders` (view user orders)
- Product CRUD (create via API; listing and detail pages)
- Image uploads via ImageKit with server auth endpoint
- Razorpay integration and webhook receiver
- Dark theme UI with Tailwind (no DaisyUI dependency)

---

## Getting Started

### 1) Prerequisites
- Node.js 18+
- MongoDB connection (local or Atlas)

### 2) Environment Variables
Create a `.env.local` in the project root with:

```env
# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-long-random-secret

# Database
MONGODB_URI=mongodb+srv://USER:PASS@HOST/DB?retryWrites=true&w=majority

# ImageKit
NEXT_PUBLIC_IMAGEKIT_BASE_URL=https://ik.imagekit.io/your_public_path
# or
NEXT_PUBLIC_URL_ENDPOINT=https://ik.imagekit.io/your_public_path

# Razorpay (if using payments locally, optional)
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret
```

Notes:
- ImageKit server auth is provided at `\/api\/imagekit-auth`.
- Either `NEXT_PUBLIC_IMAGEKIT_BASE_URL` or `NEXT_PUBLIC_URL_ENDPOINT` must be set.

### 3) Install and Run

```bash
npm install
npm run dev
# open http://localhost:3000
```

---

## Authentication and Authorization

- NextAuth configured in `lib\/auth.ts` and `src\/app\/api\/auth\/[...nextauth]\/route.ts`.
- JWT-based sessions; user `role` is embedded into the token and exposed to the client session.
- Middleware enforces access:
  - Public: `/`, `/products`, `/api/products` (GET)
  - Auth-only: everything else by default
  - Admin-only: `/admin`

Client-side guards additionally protect UI:
- `src\/app\/admin\/page.tsx`: redirects non-admin or unauthenticated users.
- `src\/app\/orders\/page.tsx`: redirects unauthenticated users.

On sign out, the header triggers a manual redirect to `/`.

---

## Image Uploads (ImageKit)

- `src\/app\/components\/FileUpload.tsx` integrates ImageKit upload UI.
- `src\/app\/api\/imagekit-auth\/route.ts` returns server-side auth params for secure uploads.
- Products store `imageUrl`; variants are defined in `models\/product.model.ts`.

---

## Payments (Razorpay)

- Checkout script is loaded in `src\/app\/layout.tsx`.
- Webhook handler at `src\/app\/api\/webhook\/razorpay\/route.ts`.
- Ensure webhook secret and dashboard configuration match.

---

## Common Workflows

### Create an Admin User
1. Register a user via `/register` or directly insert in DB.
2. In MongoDB, set `role` to `"admin"` for that user document.

### Add a Product (Admin)
1. Log in as admin.
2. Visit `/admin`.
3. Fill the form, upload an image, and submit.

### View Orders (User)
1. Log in.
2. Visit `/orders` to view your purchases.

---

## Scripts

```json
{
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "eslint"
}
```

---

## Project Structure (high level)

```
src/app
  ├─ api
  │  ├─ auth/[...nextauth]/route.ts
  │  ├─ imagekit-auth/route.ts
  │  ├─ products/route.ts
  │  ├─ products/[id]/route.ts
  │  ├─ orders/route.ts
  │  ├─ orders/user/route.ts
  │  └─ webhook/razorpay/route.ts
  ├─ admin/page.tsx           # Admin product form (guarded)
  ├─ orders/page.tsx          # User orders (guarded)
  ├─ products/[id]/page.tsx   # Product details
  ├─ components/*             # UI components
  ├─ layout.tsx, page.tsx, globals.css
lib/*                         # NextAuth, DB connection
models/*                      # Mongoose models
middleware.ts                 # RBAC and route protection
```

---

## Notes
- Tailwind CSS v4 is used; no DaisyUI.
- Forms and components are styled using Tailwind utility classes.
- Sign-out uses a manual redirect to home to avoid staying on protected pages.

---

## Deployment
- Set all environment variables in your hosting provider.
- Configure ImageKit origins and Razorpay webhooks for your deployed URL.
- Run `npm run build` then `npm start`.
