type DoctorAvailabilityInput = {
  isOpen24h?: boolean | null;
  openTime?: string | null;
  closeTime?: string | null;
  now?: Date;
};

type DoctorAvailabilityResult = {
  isOpen: boolean;
  label: string;
  tone: "emerald" | "amber" | "slate";
  scheduleLabel: string;
};

function parseMinutes(value: string | null | undefined) {
  if (!value) return null;

  const match = /^(\d{2}):(\d{2})/.exec(value);
  if (!match) return null;

  const hours = Number(match[1]);
  const minutes = Number(match[2]);

  if (Number.isNaN(hours) || Number.isNaN(minutes) || hours > 23 || minutes > 59) {
    return null;
  }

  return hours * 60 + minutes;
}

function getCurrentMinutesInAlgiers(now = new Date()) {
  const formatter = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Africa/Algiers"
  });

  const parts = formatter.formatToParts(now);
  const hour = Number(parts.find((part) => part.type === "hour")?.value ?? "0");
  const minute = Number(parts.find((part) => part.type === "minute")?.value ?? "0");

  return hour * 60 + minute;
}

function formatHour(value: string | null | undefined) {
  if (!value) return null;

  const match = /^(\d{2}):(\d{2})/.exec(value);
  if (!match) return value;
  return `${match[1]}:${match[2]}`;
}

export function getDoctorAvailability({
  isOpen24h,
  openTime,
  closeTime,
  now
}: DoctorAvailabilityInput): DoctorAvailabilityResult {
  if (isOpen24h) {
    return {
      isOpen: true,
      label: "Ouvert 24/7",
      tone: "emerald",
      scheduleLabel: "24h/24, 7j/7"
    };
  }

  const openMinutes = parseMinutes(openTime);
  const closeMinutes = parseMinutes(closeTime);
  const formattedOpenTime = formatHour(openTime);
  const formattedCloseTime = formatHour(closeTime);

  if (openMinutes === null && closeMinutes === null) {
    return {
      isOpen: false,
      label: "Horaires non renseignes",
      tone: "slate",
      scheduleLabel: "Horaires a completer"
    };
  }

  if (openMinutes === null) {
    return {
      isOpen: false,
      label: "Heure d'ouverture manquante",
      tone: "slate",
      scheduleLabel: `Fermeture: ${formattedCloseTime}`
    };
  }

  if (closeMinutes === null) {
    return {
      isOpen: false,
      label: "Heure de fermeture manquante",
      tone: "slate",
      scheduleLabel: `Ouverture: ${formattedOpenTime}`
    };
  }

  const currentMinutes = getCurrentMinutesInAlgiers(now);
  const isOpen = openMinutes === closeMinutes
    ? true
    : openMinutes < closeMinutes
      ? currentMinutes >= openMinutes && currentMinutes < closeMinutes
      : currentMinutes >= openMinutes || currentMinutes < closeMinutes;

  return {
    isOpen,
    label: isOpen ? "Ouvert maintenant" : "Ferme maintenant",
    tone: isOpen ? "emerald" : "amber",
    scheduleLabel: `${formattedOpenTime} - ${formattedCloseTime}`
  };
}
