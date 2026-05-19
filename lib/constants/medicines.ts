export const MEDICINE_FORMS = [
  { value: "comprime", label: "Comprime" },
  { value: "gelule", label: "Gelule" },
  { value: "sirop", label: "Sirop" },
  { value: "solution_buvable", label: "Solution buvable" },
  { value: "sachet", label: "Sachet" },
  { value: "gouttes", label: "Gouttes" },
  { value: "spray", label: "Spray" },
  { value: "injection", label: "Injection" },
  { value: "ampoule", label: "Ampoule" },
  { value: "pommade", label: "Pommade" },
  { value: "creme", label: "Creme" },
  { value: "suppositoire", label: "Suppositoire" },
  { value: "patch", label: "Patch" },
  { value: "collyre", label: "Collyre" },
  { value: "inhalateur", label: "Inhalateur" }
] as const;

type MedicineFormValue = (typeof MEDICINE_FORMS)[number]["value"];

const medicineFormMap = new Map<string, string>(MEDICINE_FORMS.map((item) => [item.value, item.label]));

export function isValidMedicineForm(value: string) {
  return MEDICINE_FORMS.some((item) => item.value === value);
}

export function getMedicineFormLabel(value: string | null | undefined) {
  if (!value) return null;
  return medicineFormMap.get(value) ?? value.replaceAll("_", " ");
}

export type { MedicineFormValue };
