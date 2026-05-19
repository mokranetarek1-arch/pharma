# Pharma Platform

Plateforme web multi-role construite avec Next.js, Supabase et Tailwind CSS.

## Stack

- Next.js App Router
- Supabase Auth + Database
- Tailwind CSS
- Deploiement cible: Vercel

## Roles

- `doctor` -> `/doctor/search`
- `pharmacist` -> `/pharmacy/dashboard`
- `user` -> `/search`
- `admin` -> `/admin`

## Demarrage

1. Copier `.env.example` vers `.env.local`
2. Remplir `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` et `NEXT_PUBLIC_SITE_URL`
3. Executer le SQL dans `supabase/schema.sql`
4. Installer les dependances puis lancer `npm install` et `npm run dev`

## Notes Supabase

- Active `Email` dans `Authentication > Providers`
- Pour le MVP tu peux desactiver `Confirm email`
- Ajoute `http://localhost:3000` dans `Authentication > URL Configuration`
