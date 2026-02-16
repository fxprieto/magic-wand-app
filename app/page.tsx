"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Save, Wand2, Baby, Crown, Share2, Star } from "lucide-react";
import { motion } from "framer-motion";
import * as htmlToImage from "html-to-image";

type Wand = {
  age: string;
  personality: string;
  house: string;
  wood: string;
  specialTrait: string;
  length: string;
  handleDiameter: string;
  description: string;
  rarity: string | null;
  stats: {
    power: number;
    control: number;
    wisdom: number;
    charm: number;
  } | null;
};

// NOTE:
// This version is structured for a deploy-ready Next.js App Router project.
// To connect a real database, plug in Supabase / Firebase in the marked sections.

export default function MagicWandBuilder() {
  const [mode, setMode] = useState("adult");
  const [user, setUser] = useState<{ id: string; name: string } | null>(null);
  const [savedWands, setSavedWands] = useState<Wand[]>([]);

  const [form, setForm] = useState({
    age: "",
    personality: "",
    house: "",
    wood: "",
    specialTrait: "",
    length: "12.25",
    handleDiameter: "1.375",
  });

  const [description, setDescription] = useState("");
  const [imagePrompt, setImagePrompt] = useState("");
  const [rarity, setRarity] = useState<string | null>(null);
  const [stats, setStats] = useState<{ power: number; control: number; wisdom: number; charm: number } | null>(null);

  // =============================
  // AUTH (Mock – Replace with Supabase/Firebase)
  // =============================
  const login = () => {
    const mockUser = { id: "123", name: "Wizard" };
    setUser(mockUser);
  };

  const logout = () => {
    setUser(null);
    setSavedWands([]);
  };

  // =============================
  // FORM HANDLER
  // =============================
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // =============================
  // RARITY SYSTEM
  // =============================
  const calculateRarity = () => {
    const score = Math.random();
    if (score > 0.9) return "Legendary";
    if (score > 0.75) return "Epic";
    if (score > 0.5) return "Rare";
    return "Common";
  };

  const generateStats = (rarityTier: string): { power: number; control: number; wisdom: number; charm: number } => {
    const base = {
      power: Math.floor(Math.random() * 50) + 50,
      control: Math.floor(Math.random() * 50) + 50,
      wisdom: Math.floor(Math.random() * 50) + 50,
      charm: Math.floor(Math.random() * 50) + 50,
    };

    const multiplier =
      rarityTier === "Legendary"
        ? 1.4
        : rarityTier === "Epic"
        ? 1.25
        : rarityTier === "Rare"
        ? 1.1
        : 1;

    return Object.fromEntries(
      Object.entries(base).map(([k, v]) => [k, Math.floor(v * multiplier)])
    ) as { power: number; control: number; wisdom: number; charm: number };
  };

  // =============================
  // GENERATE WAND
  // =============================
  const generateWand = () => {
    const { age, personality, house, wood, specialTrait, length, handleDiameter } = form;

    const tone =
      mode === "child"
        ? "bright, whimsical, glowing, magical cartoon style"
        : "cinematic, detailed, realistic magical craftsmanship";

    const rarityTier = calculateRarity();
    const generatedStats = generateStats(rarityTier);

    const result = `✨ Your Custom Magic Wand ✨

Wood: ${wood || "Mystic Maple"}
Length: ${length} inches
Handle Diameter: ${handleDiameter} inches

Crafted for a ${age || "wise"}-year-old wizard.
Personality: ${personality || "Brave and Curious"}
Alignment: ${house || "Ancient Scholars"}

Special Trait: ${specialTrait || "Reacts strongly to protective charms."}

RARITY: ${rarityTier}

Stats:
Power: ${generatedStats.power}
Control: ${generatedStats.control}
Wisdom: ${generatedStats.wisdom}
Charm: ${generatedStats.charm}
`;

    const prompt = `${tone}, light wood wand, twisted handle, elegant design, ${personality}, ${house}, ${length} inches long`;

    setRarity(rarityTier);
    setStats(generatedStats);
    setDescription(result);
    setImagePrompt(prompt);
  };

  // =============================
  // SAVE TO CLOUD (Mocked)
  // =============================
  const saveWand = async () => {
    if (!user) return alert("Login required");

    const newSaved = [...savedWands, { ...form, description, rarity, stats }];
    setSavedWands(newSaved);

    // Replace with real DB call:
    // await supabase.from('wands').insert({...})
  };

  // =============================
  // SHARE TO SOCIAL IMAGE
  // =============================
  const shareImage = async () => {
    const node = document.getElementById("share-card");
    if (!node) return;

    const dataUrl = await htmlToImage.toPng(node);
    const link = document.createElement("a");
    link.download = "my-magic-wand.png";
    link.href = dataUrl;
    link.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-800 text-white p-6">
      <div className="max-w-6xl mx-auto">

        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-center mb-6"
        >
          🪄 AI Magic Wand Creator
        </motion.h1>

        {/* AUTH BUTTONS */}
        <div className="flex justify-end gap-4 mb-4">
          {!user ? (
            <Button onClick={login}>Login</Button>
          ) : (
            <Button onClick={logout}>Logout</Button>
          )}
        </div>

        {/* MODE TOGGLE */}
        <div className="flex justify-center gap-4 mb-8">
          <Button onClick={() => setMode("child")}>
            <Baby className="mr-2" size={16} /> Child Mode
          </Button>
          <Button onClick={() => setMode("adult")}>
            <Crown className="mr-2" size={16} /> Adult Mode
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* FORM */}
          <Card className="bg-white/10 backdrop-blur-xl border-none rounded-2xl shadow-2xl">
            <CardContent className="p-6 grid gap-4">
              <Input name="age" placeholder="Wizard Age" value={form.age} onChange={handleChange} />
              <Input name="personality" placeholder="Personality" value={form.personality} onChange={handleChange} />
              <Input name="house" placeholder="House" value={form.house} onChange={handleChange} />
              <Input name="wood" placeholder="Wood" value={form.wood} onChange={handleChange} />
              <Input name="length" placeholder="Length (inches)" value={form.length} onChange={handleChange} />
              <Input name="handleDiameter" placeholder="Handle Diameter" value={form.handleDiameter} onChange={handleChange} />
              <Textarea name="specialTrait" placeholder="Special Trait" value={form.specialTrait} onChange={handleChange} />

              <Button onClick={generateWand} className="flex gap-2">
                <Sparkles size={18} /> Generate Wand
              </Button>

              {description && (
                <Button onClick={saveWand} className="bg-emerald-600 flex gap-2">
                  <Save size={18} /> Save to Cloud
                </Button>
              )}
            </CardContent>
          </Card>

          {/* PREVIEW + SHARE */}
          <div className="space-y-6">
            {description && (
              <Card id="share-card" className="bg-white/10 backdrop-blur-xl border-none rounded-2xl shadow-2xl">
                <CardContent className="p-6 whitespace-pre-line text-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <Star /> <strong>{rarity}</strong>
                  </div>
                  {description}
                </CardContent>
              </Card>
            )}

            {description && (
              <Button onClick={shareImage} className="bg-pink-600 flex gap-2">
                <Share2 size={18} /> Share to Social (Download Image)
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
