"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { algeriaWilayas } from "@/lib/constants/doctor-profile";
import type { SearchType } from "@/lib/types";

export function SearchForm({ query, city, speciality, searchType = "medicine", action = "/search" }: { query: string; city: string; speciality?: string; searchType?: SearchType; action?: string }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedType, setSelectedType] = useState<SearchType>(searchType);
  const doctorSpecialities = [
    "Cardiologie",
    "Pediatrie",
    "Dermatologie",
    "Gynecologie",
    "Orthopedie",
    "Psychiatrie",
    "Neurologie",
    "Medecine generale",
    "Oto-rhino-laryngologie",
    "Ophtalmologie"
  ];

  useEffect(() => {
    setSelectedType(searchType);
    setIsSubmitting(false);
  }, [searchType, query, city, speciality]);

  return (
    <motion.form
      action={action}
      onSubmit={() => setIsSubmitting(true)}
      className={`grid gap-3 rounded-[1rem] bg-slate-50 p-3 ${selectedType === "doctor" ? "lg:grid-cols-[1.1fr_180px_180px_140px_140px]" : "lg:grid-cols-[1.1fr_180px_140px_140px]"}`}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
    >
      <input
        name="q"
        defaultValue={query}
        placeholder="Rechercher un medicament, une specialite ou un medcin"
        className="field-input h-14"
      />
      {selectedType === "doctor" ? (
        <>
          <input
            name="speciality"
            defaultValue={speciality}
            placeholder="Choisir une specialite"
            list="doctor-specialities"
            className="field-input h-14"
          />
          <datalist id="doctor-specialities">
            {doctorSpecialities.map((specialityOption) => (
              <option key={specialityOption} value={specialityOption} />
            ))}
          </datalist>
        </>
      ) : null}
      <>
        <input name="city" defaultValue={city} list="algeria-wilayas-search" placeholder="Wilaya (optionnel)" className="field-input h-14" />
        <datalist id="algeria-wilayas-search">
          {algeriaWilayas.map((wilaya) => (
            <option key={wilaya} value={wilaya} />
          ))}
        </datalist>
      </>
      <select name="type" value={selectedType} onChange={(event) => setSelectedType(event.target.value as SearchType)} className="field-input h-14">
        <option value="medicine">Medicaments</option>
        <option value="doctor">Medecins</option>
      </select>
      <motion.button
        whileTap={{ scale: isSubmitting ? 1 : 0.99 }}
        whileHover={{ scale: isSubmitting ? 1 : 1.03 }}
        disabled={isSubmitting}
        className={`primary-button h-14 ${isSubmitting ? "cursor-not-allowed opacity-80" : ""}`}
        type="submit"
      >
        {isSubmitting ? (
          <span className="inline-flex items-center gap-2">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-200 border-t-white" />
            Recherche...
          </span>
        ) : (
          "Rechercher"
        )}
      </motion.button>
    </motion.form>
  );
}
