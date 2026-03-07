"use client";

import { useState, useRef, FormEvent, ChangeEvent } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";
import { provinces } from "@/lib/provinces";

const zodiacSigns = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces",
];

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

interface Profile {
  id: string;
  name: string | null;
  age: number | null;
  gender: string | null;
  bio: string | null;
  province: string | null;
  photo_url: string | null;
  looking_for: string | null;
  interests: string[];
  zodiac: string | null;
}

export default function ProfileForm({
  profile,
  userId,
}: {
  profile: Profile | null;
  userId: string;
}) {
  const [name, setName] = useState(profile?.name ?? "");
  const [age, setAge] = useState(profile?.age?.toString() ?? "");
  const [gender, setGender] = useState(profile?.gender ?? "");
  const [bio, setBio] = useState(profile?.bio ?? "");
  const [province, setProvince] = useState(profile?.province ?? "");
  const [photoUrl, setPhotoUrl] = useState(profile?.photo_url ?? "");
  const [lookingFor, setLookingFor] = useState(profile?.looking_for ?? "");
  const [zodiac, setZodiac] = useState(profile?.zodiac ?? "");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(profile?.photo_url ?? null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const router = useRouter();
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      setMessage("Error: Only JPEG, PNG, and WebP images are allowed.");
      return;
    }
    if (file.size > MAX_SIZE) {
      setMessage("Error: Image must be under 5MB.");
      return;
    }

    setPhotoFile(file);
    setMessage("");
    const reader = new FileReader();
    reader.onload = (ev) => setPhotoPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setPhotoFile(null);
    setPhotoPreview(null);
    setPhotoUrl("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const uploadPhoto = async (): Promise<string | null> => {
    if (!photoFile) return photoUrl || null;

    setUploading(true);
    const ext = photoFile.name.split(".").pop()?.toLowerCase() || "jpg";
    const path = `${userId}/photo.${ext}`;

    const { error } = await supabase.storage
      .from("avatars")
      .upload(path, photoFile, { upsert: true });

    setUploading(false);

    if (error) {
      throw new Error("Photo upload failed: " + error.message);
    }

    const { data: urlData } = supabase.storage
      .from("avatars")
      .getPublicUrl(path);

    // Append cache-buster so browser shows the new image
    return urlData.publicUrl + "?t=" + Date.now();
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    let finalPhotoUrl = photoUrl || null;

    try {
      // If user removed their photo, finalPhotoUrl is already null
      // If user selected a new file, upload it
      if (photoFile) {
        finalPhotoUrl = await uploadPhoto();
      }
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Photo upload failed.");
      setSaving(false);
      return;
    }

    const updates = {
      id: userId,
      name: name || null,
      age: age ? parseInt(age) : null,
      gender: gender || null,
      bio: bio || null,
      province: province || null,
      photo_url: finalPhotoUrl,
      looking_for: lookingFor || null,
      zodiac: zodiac || null,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from("profiles")
      .upsert(updates, { onConflict: "id" });

    if (error) {
      setMessage("Error saving profile: " + error.message);
    } else {
      setPhotoUrl(finalPhotoUrl ?? "");
      setPhotoFile(null);
      setMessage("Profile saved!");
      router.refresh();
    }

    setSaving(false);
  };

  return (
    <form className="profile-form" onSubmit={handleSubmit}>
      <div className="profile-form-group">
        <label>Photo</label>
        <div
          className="photo-upload"
          onClick={() => fileInputRef.current?.click()}
        >
          {photoPreview ? (
            <img src={photoPreview} alt="Preview" className="photo-preview" />
          ) : (
            <div className="photo-upload-placeholder">
              <span className="photo-upload-icon">+</span>
              <span className="photo-upload-label">Upload Photo</span>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileSelect}
            style={{ display: "none" }}
          />
        </div>
        {photoPreview && (
          <button
            type="button"
            className="photo-remove"
            onClick={handleRemovePhoto}
          >
            Remove photo
          </button>
        )}
      </div>

      <div className="profile-form-group">
        <label>Name</label>
        <input
          type="text"
          className="profile-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
        />
      </div>

      <div className="profile-form-row">
        <div className="profile-form-group">
          <label>Age</label>
          <input
            type="number"
            className="profile-input"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            min="18"
            max="99"
            placeholder="18"
          />
        </div>
        <div className="profile-form-group">
          <label>Gender</label>
          <select
            className="profile-input"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          >
            <option value="">Select</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      <div className="profile-form-group">
        <label>Bio</label>
        <textarea
          className="profile-input profile-textarea"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Tell others about yourself..."
          rows={3}
        />
      </div>

      <div className="profile-form-row">
        <div className="profile-form-group">
          <label>Province</label>
          <select
            className="profile-input"
            value={province}
            onChange={(e) => setProvince(e.target.value)}
          >
            <option value="">Select province</option>
            {provinces.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>
        <div className="profile-form-group">
          <label>Looking For</label>
          <select
            className="profile-input"
            value={lookingFor}
            onChange={(e) => setLookingFor(e.target.value)}
          >
            <option value="">Select</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="everyone">Everyone</option>
          </select>
        </div>
      </div>

      <div className="profile-form-group">
        <label>Zodiac Sign</label>
        <select
          className="profile-input"
          value={zodiac}
          onChange={(e) => setZodiac(e.target.value)}
        >
          <option value="">Select</option>
          {zodiacSigns.map((z) => (
            <option key={z} value={z}>
              {z}
            </option>
          ))}
        </select>
      </div>

      {message && (
        <p className={`profile-msg ${message.startsWith("Error") ? "error" : "success"}`}>
          {message}
        </p>
      )}

      <button type="submit" className="btn-primary profile-submit" disabled={saving}>
        {saving
          ? uploading
            ? "Uploading photo..."
            : "Saving..."
          : "Save Profile"}
      </button>
    </form>
  );
}
