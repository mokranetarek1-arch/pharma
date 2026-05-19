"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { updateUserProfileAction } from "@/lib/actions/user";
import { Reveal } from "@/components/ui/motion";

export default function UserProfilePage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
        setProfile(data);
        setPreview(data?.photo_url || null);
      }
      setLoading(false);
    }
    loadProfile();
  }, []);

  if (loading) return <div className="p-10 text-center">Chargement...</div>;

  return (
    <main className="mx-auto max-w-4xl p-6">
      <Reveal>
        <div className="soft-panel rounded-[2rem] border border-white/20 bg-white/10 p-8">
          <h1 className="text-3xl font-semibold text-white">Mon Profil</h1>
          <p className="mt-2 text-slate-200">Gère tes informations personnelles et ta photo de profil.</p>

          <form action={updateUserProfileAction} className="mt-8 space-y-6">
            <div className="flex items-center gap-6">
              <div className="relative h-24 w-24 overflow-hidden rounded-2xl bg-white/10 ring-2 ring-white/20">
                {preview ? (
                  <img src={preview} alt="Profile" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-2xl font-bold text-white">
                    {profile?.full_name?.slice(0, 2).toUpperCase()}
                  </div>
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-white">Photo de profil</p>
                <input 
                  type="file" 
                  name="photo" 
                  accept="image/*" 
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) setPreview(URL.createObjectURL(file));
                  }}
                  className="mt-2 text-xs text-slate-200 file:mr-4 file:rounded-full file:border-0 file:bg-teal-500/20 file:px-4 file:py-2 file:text-xs file:font-semibold file:text-teal-200"
                />
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-100">Nom complet</span>
                <input name="full_name" defaultValue={profile?.full_name} className="field-input" />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-100">Date de naissance</span>
                <input name="birthdate" type="date" defaultValue={profile?.birthdate} className="field-input" />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-100">Sexe</span>
                <select name="gender" defaultValue={profile?.gender || ""} className="field-input">
                  <option value="male">Homme</option>
                  <option value="female">Femme</option>
                </select>
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-100">Email</span>
                <input disabled value={profile?.email} className="field-input opacity-50" />
              </label>
            </div>

            <div className="pt-4">
              <button type="submit" className="primary-button w-full sm:w-auto">Enregistrer les modifications</button>
            </div>
          </form>
        </div>
      </Reveal>
    </main>
  );
}
