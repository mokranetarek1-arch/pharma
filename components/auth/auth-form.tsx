"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { motion } from "framer-motion";
import { loginAction, signupAction, type AuthActionState } from "@/lib/actions/auth";

const initialState: AuthActionState = {
  error: null,
  success: null
};

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const action = mode === "login" ? loginAction : signupAction;
  const [state, formAction] = useActionState(action, initialState);

  return (
    <motion.form action={formAction} className="space-y-5" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}>
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-teal-200">{mode === "login" ? "Connexion" : "Inscription"}</p>
        <h1 className="mt-3 text-3xl font-semibold text-white">{mode === "login" ? "Entre dans la plateforme" : "Creer un compte"}</h1>
        <p className="mt-3 max-w-xl text-sm leading-7 text-slate-200">
          {mode === "login"
            ? "Retrouve ton espace en quelques secondes avec une connexion simple et role-aware."
            : "Configure ton compte, choisis ton role et entre directement dans le bon parcours produit."}
        </p>
      </div>

      {mode === "signup" ? (
        <div className="grid gap-5 sm:grid-cols-3">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-100">Nom complet</span>
            <input name="full_name" required className="field-input" placeholder="Nom et prenom" />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-100">Sexe</span>
            <select name="gender" defaultValue="" className="field-input" required>
              <option value="" disabled>Choisir</option>
              <option value="male">Homme</option>
              <option value="female">Femme</option>
            </select>
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-100">Date de naissance</span>
            <input name="birthdate" type="date" required className="field-input" />
          </label>
        </div>
      ) : null}

      <label className="block">
        <span className="mb-2 block text-sm font-medium text-slate-100">Email</span>
        <input type="email" name="email" required className="field-input" placeholder="email@exemple.com" />
      </label>

      <label className="block">
        <span className="mb-2 block text-sm font-medium text-slate-100">Mot de passe</span>
        <input type="password" name="password" required minLength={6} className="field-input" placeholder="Minimum 6 caracteres" />
      </label>

      {mode === "signup" ? (
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-100">Role</span>
          <select name="role" defaultValue="user" className="field-input">
            <option value="user">Utilisateur</option>
            <option value="doctor">Medecin</option>
            <option value="pharmacist">Pharmacien</option>
          </select>
        </label>
      ) : null}

      {state.error ? <p className="rounded-[1.3rem] border border-red-300/18 bg-red-300/10 px-4 py-3 text-sm text-red-100">{state.error}</p> : null}
      {state.success ? <p className="rounded-[1.3rem] border border-emerald-300/18 bg-emerald-300/10 px-4 py-3 text-sm text-emerald-100">{state.success}</p> : null}

      <div className="rounded-[1.6rem] border border-white/20 bg-white/10 p-3">
        <SubmitButton label={mode === "login" ? "Se connecter" : "Creer le compte"} />
      </div>
    </motion.form>
  );
}

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();

  return (
    <motion.button type="submit" disabled={pending} className="primary-button w-full disabled:cursor-not-allowed disabled:opacity-60" whileTap={{ scale: 0.985 }}>
      {pending ? "Chargement..." : label}
    </motion.button>
  );
}
