import { randomUUID } from "node:crypto";
import { createClient } from "@/lib/supabase/server";

const MEDIA_BUCKET = "pharma-media";

function getExtension(file: File) {
  const fromName = file.name.split(".").pop()?.toLowerCase();
  if (fromName) return fromName;
  if (file.type === "image/png") return "png";
  if (file.type === "image/webp") return "webp";
  return "jpg";
}

export async function uploadImageAsset(folder: "profiles" | "pharmacies" | "medicines" | "doctors", ownerId: string, file: File) {
  if (!file || file.size === 0) {
    return null;
  }

  if (!file.type.startsWith("image/")) {
    throw new Error("Le fichier doit etre une image.");
  }

  const supabase = await createClient();
  const extension = getExtension(file);
  const path = `${folder}/${ownerId}/${randomUUID()}.${extension}`;
  const bytes = new Uint8Array(await file.arrayBuffer());

  const { error: uploadError } = await supabase.storage.from(MEDIA_BUCKET).upload(path, bytes, {
    contentType: file.type,
    upsert: false
  });

  if (uploadError) {
    throw new Error(
      uploadError.message.includes("Bucket not found")
        ? `Le bucket Storage '${MEDIA_BUCKET}' est introuvable. Cree-le dans Supabase avant l'upload.`
        : uploadError.message
    );
  }

  const { data } = supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

