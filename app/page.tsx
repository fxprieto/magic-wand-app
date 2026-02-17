"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

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

  useEffect(() => {
    validateForm();
    calculatePrice();
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
    if (form.personality === "Powerful" || form.personality === "Mysterious")
      base += 5;
    if (Number(form.length) > 13.5) base += 5;

    if (base > 69.99) base = 69.99;

    setPrice(base);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const generateWand = () => {
    if (!validateForm()) return;
    setGenerated(true);
  };

  const isFormValid =
    Object.keys(errors).length === 0 &&
    Object.values(form).every((v) => v !== "");

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-[#0f0f1f] to-black text-[#E5DCC3] flex items-center justify-center px-6 py-16">
      <div className="max-w-2xl w-full space-y-8 bg-[#111827] p-10 rounded-2xl shadow-2xl border border-[#2f2f2f]">

        <h1 className="text-4xl font-bold text-center text-[#D4AF37] tracking-wider">
          Wand Atelier
        </h1>

        <div className="space-y-6">

          {/* Age */}
          <Input
            name="age"
            type="number"
            placeholder="Age of Wizard"
            value={form.age}
            onChange={handleChange}
          />

          {/* Personality */}
          <select
            name="personality"
            value={form.personality}
            onChange={handleChange}
            className="w-full p-3 rounded-md bg-black border border-gray-600"
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

          {/* House Color */}
          <select
            name="houseColor"
            value={form.houseColor}
            onChange={handleChange}
            className="w-full p-3 rounded-md bg-black border border-gray-600"
          >
            <option value="">Select House Color</option>
            <option>Blue</option>
            <option>Yellow</option>
            <option>Green</option>
            <option>Purple</option>
          </select>

          {/* Wood */}
          <select
            name="wood"
            value={form.wood}
            onChange={handleChange}
            className="w-full p-3 rounded-md bg-black border border-gray-600"
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

          {/* Style */}
          <select
            name="style"
            value={form.style}
            onChange={handleChange}
            className="w-full p-3 rounded-md bg-black border border-gray-600"
          >
            <option value="">Select Style</option>
            <option>Elegant</option>
            <option>Simple</option>
          </select>

          {/* Wood Tone */}
          <select
            name="woodTone"
            value={form.woodTone}
            onChange={handleChange}
            className="w-full p-3 rounded-md bg-black border border-gray-600"
          >
            <option value="">Wood Tone</option>
            <option>Light</option>
            <option>Dark</option>
          </select>

          {/* Length */}
          <Input
            name="length"
            type="number"
            step="0.01"
            placeholder="Length (12.5 - 13.75 inches)"
            value={form.length}
            onChange={handleChange}
          />

          {/* Price Display */}
          <div className="text-center text-xl font-semibold text-[#D4AF37]">
            Estimated Price: ${price.toFixed(2)}
          </div>

          <Button
            onClick={generateWand}
            disabled={!isFormValid}
            className="w-full bg-[#D4AF37] text-black hover:bg-[#c49b2e] py-6 text-lg font-semibold"
          >
            <Sparkles className="mr-2 h-5 w-5" />
            Generate My Wand
          </Button>
        </div>

        {/* Generated Preview Section */}
        {generated && (
          <div className="mt-8 p-6 bg-black rounded-xl border border-[#D4AF37] text-center">
            <p className="mb-4 text-lg">✨ Your wand has been crafted!</p>

            {/* Replace this image src with your AI generated image later */}
            <img
              src="/placeholder-wand.png"
              alt="Generated Wand"
              className="mx-auto mb-4 h-64 object-contain"
            />

            <Button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3">
              Buy Now – ${price.toFixed(2)}
            </Button>
          </div>
        )}

      </div>
    </main>
  );
}
