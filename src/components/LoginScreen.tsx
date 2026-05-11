"use client";
import { useState } from "react";
import { Calendar as CalendarIcon } from "lucide-react";

export const LoginScreen = ({ onSave }: { onSave: (name: string) => void }) => {
  const [name, setName] = useState("");
  return (
    <div className="flex h-screen w-full items-center justify-center bg-slate-50 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md text-center">
        <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <CalendarIcon className="text-indigo-600 w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">
          Bienvenido a ApuTrak
        </h2>
        <p className="text-slate-500 mb-6 text-sm">
          Tus datos se guardan de forma segura en tu dispositivo
          (Offline-First).
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSave(name);
          }}
          className="space-y-4"
        >
          <input
            type="text"
            placeholder="¿Cómo te llamas?"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-colors"
            required
          />
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-xl transition-colors"
          >
            Entrar a mi espacio
          </button>
        </form>
      </div>
    </div>
  );
};
