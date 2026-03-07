"use client";

import { useState, useRef, FormEvent, ChangeEvent } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";
import { countries, countryCities } from "@/lib/provinces";

const animalSigns = [
  "Monkey", "Rooster", "Dog", "Pig", "Rat", "Ox",
  "Tiger", "Rabbit", "Dragon", "Snake", "Horse", "Goat",
];

function getAnimalSign(dateStr: string): string | null {
  if (!dateStr) return null;
  const year = new Date(dateStr).getFullYear();
  return animalSigns[year % 12];
}

const compatibility: Record<string, string[]> = {
  Rat: ["Ox", "Dragon", "Monkey"],
  Ox: ["Rat", "Snake", "Rooster"],
  Tiger: ["Horse", "Dog", "Pig"],
  Rabbit: ["Goat", "Dog", "Pig"],
  Dragon: ["Rat", "Monkey", "Rooster"],
  Snake: ["Ox", "Rooster", "Goat"],
  Horse: ["Tiger", "Goat", "Dog"],
  Goat: ["Rabbit", "Horse", "Pig", "Snake"],
  Monkey: ["Rat", "Dragon", "Snake"],
  Rooster: ["Ox", "Dragon", "Snake"],
  Dog: ["Tiger", "Rabbit", "Horse"],
  Pig: ["Tiger", "Rabbit", "Goat"],
};

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

interface Profile {
  id: string;
  name: string | null;
  age: number | null;
  gender: string | null;
  bio: string | null;
  country: string | null;
  province: string | null;
  city: string | null;
  zipcode: string | null;
  photo_url: string | null;
  looking_for: string | null;
  interests: string[];
  zodiac: string | null;
  date_of_birth: string | null;
}

export default function ProfileForm({
  profile,
  userId,
}: {
  profile: Profile | null;
  userId: string;
}) {
  const [name, setName] = useState(profile?.name ?? "");
  const [gender, setGender] = useState(profile?.gender ?? "");
  const [bio, setBio] = useState(profile?.bio ?? "");
  const [country, setCountry] = useState(profile?.country ?? "");
  const [province, setProvince] = useState(profile?.province ?? "");
  const [city, setCity] = useState(profile?.city ?? "");
  const [zipcode, setZipcode] = useState(profile?.zipcode ?? "");
  const [photoUrl, setPhotoUrl] = useState(profile?.photo_url ?? "");
  const [lookingFor, setLookingFor] = useState(profile?.looking_for ?? "");
  const [dob, setDob] = useState(profile?.date_of_birth ?? "");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(profile?.photo_url ?? null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const calcAge = (dateStr: string): number | null => {
    if (!dateStr) return null;
    const birth = new Date(dateStr);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
  };

  const computedAge = calcAge(dob);
  const computedZodiac = getAnimalSign(dob);

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
      age: computedAge,
      gender: gender || null,
      bio: bio || null,
      country: country || null,
      province: province || null,
      city: city || null,
      zipcode: zipcode || null,
      photo_url: finalPhotoUrl,
      looking_for: lookingFor || null,
      zodiac: computedZodiac,
      date_of_birth: dob || null,
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

      <div className="profile-form-group">
        <label>Date of Birth</label>
        <input
          type="date"
          className="profile-input"
          value={dob}
          onChange={(e) => setDob(e.target.value)}
        />
      </div>

      <div className="profile-form-row">
        <div className="profile-form-group">
          <label>Age</label>
          <input
            type="text"
            className="profile-input"
            value={computedAge !== null ? `${computedAge} years old` : "Set date of birth"}
            readOnly
            tabIndex={-1}
            style={{ opacity: computedAge !== null ? 1 : 0.5 }}
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

      <div className="profile-form-group">
        <label>Country</label>
        <select
          className="profile-input"
          value={country}
          onChange={(e) => {
            setCountry(e.target.value);
            setProvince("");
            setCity("");
            setZipcode("");
          }}
        >
          <option value="">Select country</option>
          {countries.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <div className="profile-form-row">
        <div className="profile-form-group">
          <label>{country === "Cambodia" ? "Province" : country === "USA" ? "State" : country === "Canada" ? "Province" : "City"}</label>
          <select
            className="profile-input"
            value={province}
            onChange={(e) => setProvince(e.target.value)}
            disabled={!country}
          >
            <option value="">
              {country ? `Select ${country === "Cambodia" || country === "Canada" ? "province" : country === "USA" ? "state" : "city"}` : "Select country first"}
            </option>
            {(countryCities[country] ?? []).map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>
        {(country === "USA" || country === "Canada") && (
          <div className="profile-form-group">
            <label>City</label>
            <input
              type="text"
              className="profile-input"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Your city"
            />
          </div>
        )}
      </div>

      {(country === "USA" || country === "Canada") && (
        <div className="profile-form-row">
          <div className="profile-form-group">
            <label>Zip Code</label>
            <input
              type="text"
              className="profile-input"
              value={zipcode}
              onChange={(e) => setZipcode(e.target.value)}
              placeholder={country === "USA" ? "e.g. 90210" : "e.g. V6B 1A1"}
            />
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
      )}

      {country !== "USA" && country !== "Canada" && (
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
      )}

      <div className="profile-form-row">
        <div className="profile-form-group">
          <label>Your Birth Animal Sign</label>
          <input
            type="text"
            className="profile-input"
            value={computedZodiac ?? "Set date of birth"}
            readOnly
            tabIndex={-1}
            style={{ opacity: computedZodiac ? 1 : 0.5 }}
          />
        </div>
        <div className="profile-form-group">
          <label>Your Compatible Signs</label>
          <input
            type="text"
            className="profile-input"
            value={computedZodiac ? (compatibility[computedZodiac] ?? []).join(", ") : "Set date of birth"}
            readOnly
            tabIndex={-1}
            style={{ opacity: computedZodiac ? 1 : 0.5 }}
          />
        </div>
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
