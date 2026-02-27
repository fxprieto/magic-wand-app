"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sparkles, Image as ImageIcon } from "lucide-react";

type FormData = {
  age: string;
  personality: string;
  houseColor: string;
  wood: string;
  style: string;
  woodTone: string;
  length: string;
};

export default function Home() {
  const [form, setForm] = useState<FormData>({
    age: "",
    personality: "",
    houseColor: "",
    wood: "",
    style: "",
    woodTone: "",
    length: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [price, setPrice] = useState<number>(39.99);
  const [generated, setGenerated] = useState(false);

  // ✅ Image generation state
  const [wandImageUrl, setWandImageUrl] = useState<string | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);

  useEffect(() => {
    validateForm();
    calculatePrice();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    const ageNum = Number(form.age);
    const lengthNum = Number(form.length);

    if (!form.age || isNaN(ageNum) || ageNum < 5 || ageNum > 120)
      newErrors.age = "Age must be between 5 and 120.";

    if (!form.personality) newErrors.personality = "Select personality.";
    if (!form.houseColor) newErrors.houseColor = "Select house color.";
    if (!form.wood) newErrors.wood = "Select wood type.";
    if (!form.style) newErrors.style = "Select style.";
    if (!form.woodTone) newErrors.woodTone = "Select wood tone.";

    if (!form.length || isNaN(lengthNum) || lengthNum < 12.5 || lengthNum > 13.75)
      newErrors.length = "Length must be 12.5 - 13.75 inches.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculatePrice = () => {
    let base = 39.99;

    if (form.style === "Elegant") base += 10;
    if (["Elder", "Ebony"].includes(form.wood)) base += 5;
    if (form.personality === "Powerful" || form.personality === "Mysterious") base += 5;
    if (Number(form.length) > 13.5) base += 5;

    if (base > 69.99) base = 69.99;
    setPrice(base);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setGenerated(false);
    setWandImageUrl(null);
    setImageError(null);
  };

  const generateWand = () => {
    if (!validateForm()) return;
    setGenerated(true);
    setWandImageUrl(null);
    setImageError(null);
  };

  const isFormValid =
    Object.keys(errors).length === 0 &&
    Object.values(form).every((v) => v !== "");

  // ✅ Wire to /api/generate-image (POST)
  const generateWandImage = async () => {
    if (!generated) {
      setImageError("Generate your wand first, then create the artwork.");
      return;
    }

    setIsGeneratingImage(true);
    setImageError(null);
    setWandImageUrl(null);

    // Hogwarts dark aesthetic prompt tuned to your inputs
    const prompt = `A single handcrafted magic wand, Hogwarts dark aesthetic, candlelit gothic workshop, dramatic rim lighting, centered product shot, no text, no logo. 
Wand details: ${form.woodTone} ${form.wood} wood, ${form.style} style, house accent color ${form.houseColor}, length ${form.length} inches. 
Wizard age ${form.age}, personality ${form.personality}. Ultra-detailed, high quality.`;

    try {
      const res = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data: { imageUrl?: string; error?: string } = await res.json();

      if (!res.ok || !data.imageUrl) {
        throw new Error(data.error || "Image generation failed.");
      }

      setWandImageUrl(data.imageUrl);
    } catch (err: any) {
      setImageError(err?.message || "Image generation failed.");
    } finally {
      setIsGeneratingImage(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-[#0f0f1f] to-black text-[#E5DCC3] flex items-center justify-center px-6 py-16">
      <div className="max-w-2xl w-full space-y-8 bg-[#111827] p-10 rounded-2xl shadow-2xl border border-[#2f2f2f]">
        <h1 className="text-4xl font-bold text-center text-[#D4AF37] tracking-wider">
          Wand Atelier
        </h1>

        <div className="space-y-6">
          <Input
            name="age"
            type="number"
            placeholder="Age of Wizard"
            value={form.age}
            onChange={handleChange}
            className={errors.age ? "border-red-500" : ""}
          />
          {errors.age && <p className="text-red-400 text-sm">{errors.age}</p>}

          <select
            name="personality"
            value={form.personality}
            onChange={handleChange}
            className={`w-full p-3 rounded-md bg-black border ${errors.personality ? "border-red-500" : "border-gray-600"}`}
          >
            <option value="">Select Personality</option>
            <option>Brave</option>
            <option>Powerful</option>
            <option>Kind</option>
            <option>Clever</option>
            <option>Mysterious</option>
            <option>Funny</option>
            <option>Elegant</option>
          </select>
          {errors.personality && <p className="text-red-400 text-sm">{errors.personality}</p>}

          <select
            name="houseColor"
            value={form.houseColor}
            onChange={handleChange}
            className={`w-full p-3 rounded-md bg-black border ${errors.houseColor ? "border-red-500" : "border-gray-600"}`}
          >
            <option value="">Select House Color</option>
            <option>Blue</option>
            <option>Yellow</option>
            <option>Green</option>
            <option>Purple</option>
          </select>
          {errors.houseColor && <p className="text-red-400 text-sm">{errors.houseColor}</p>}

          <select
            name="wood"
            value={form.wood}
            onChange={handleChange}
            className={`w-full p-3 rounded-md bg-black border ${errors.wood ? "border-red-500" : "border-gray-600"}`}
          >
            <option value="">Select Wood</option>
            <option>Oak</option>
            <option>Dark Oak</option>
            <option>Elder</option>
            <option>Walnut</option>
            <option>Maple</option>
            <option>Cherry</option>
            <option>Ebony</option>
          </select>
          {errors.wood && <p className="text-red-400 text-sm">{errors.wood}</p>}

          <select
            name="style"
            value={form.style}
            onChange={handleChange}
            className={`w-full p-3 rounded-md bg-black border ${errors.style ? "border-red-500" : "border-gray-600"}`}
          >
            <option value="">Select Style</option>
            <option>Elegant</option>
            <option>Simple</option>
          </select>
          {errors.style && <p className="text-red-400 text-sm">{errors.style}</p>}

          <select
            name="woodTone"
            value={form.woodTone}
            onChange={handleChange}
            className={`w-full p-3 rounded-md bg-black border ${errors.woodTone ? "border-red-500" : "border-gray-600"}`}
          >
            <option value="">Wood Tone</option>
            <option>Light</option>
            <option>Dark</option>
          </select>
          {errors.woodTone && <p className="text-red-400 text-sm">{errors.woodTone}</p>}

          <Input
            name="length"
            type="number"
            step="0.01"
            placeholder="Length (12.5 - 13.75 inches)"
            value={form.length}
            onChange={handleChange}
            className={errors.length ? "border-red-500" : ""}
          />
          {errors.length && <p className="text-red-400 text-sm">{errors.length}</p>}

          <div className="text-center text-xl font-semibold text-[#D4AF37]">
            Estimated Price: ${price.toFixed(2)}
          </div>

          <Button
            onClick={generateWand}
            disabled={!isFormValid}
            className="w-full bg-[#D4AF37] text-black hover:bg-[#c49b2e] py-6 text-lg font-semibold disabled:opacity-50"
          >
            <Sparkles className="mr-2 h-5 w-5" />
            Generate My Wand
          </Button>
        </div>

        {generated && (
          <div className="mt-8 p-6 bg-black rounded-xl border border-[#D4AF37] text-center space-y-4">
            <p className="text-lg">✨ Your wand has been crafted!</p>

            <Button
              onClick={generateWandImage}
              disabled={isGeneratingImage}
              className="w-full bg-[#2B1B3D] hover:bg-[#3a2755] text-[#E5DCC3] py-5 text-base font-semibold disabled:opacity-50"
            >
              <ImageIcon className="mr-2 h-5 w-5" />
              {isGeneratingImage ? "Conjuring Image..." : "Generate Wand Image"}
            </Button>

            {imageError && <p className="text-red-300 text-sm">{imageError}</p>}

            {wandImageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={wandImageUrl}
                alt="Generated wand"
                className="mx-auto rounded-lg border border-[#2B1B3D]"
              />
            ) : (
              <p className="text-sm text-purple-300">
                Click “Generate Wand Image” to create artwork.
              </p>
            )}

            <Button className="w-full bg-green-600 hover:bg-green-700 text-white px-6 py-5 text-base font-semibold">
              Buy Now – ${price.toFixed(2)}
            </Button>
          </div>
        )}
      </div>
    </main>
  );
}