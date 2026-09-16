"use client";

import { useState } from "react";
import { Brain, Sparkles, X, Plus, Activity, Search } from "lucide-react";

interface AIAssistantProps {
  onFindDoctors: (specialization: string) => void;
}

export default function AIAssistant({ onFindDoctors }: AIAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [symptomInput, setSymptomInput] = useState("");
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{ specialist: string; confidence: string; reasoning: string; disclaimer: string } | null>(null);

  const quickSymptoms = [
    "Chest Pain", "Fever", "Headache", "Joint Pain", 
    "Skin Rash", "Cough", "Breathing Difficulty", "Anxiety", 
    "Stomach Pain", "Vision Problems", "Back Pain", "Fatigue"
  ];

  const handleAddSymptom = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (symptomInput.trim() && !symptoms.includes(symptomInput.trim())) {
      setSymptoms([...symptoms, symptomInput.trim()]);
      setSymptomInput("");
    }
  };

  const removeSymptom = (sym: string) => {
    setSymptoms(symptoms.filter(s => s !== sym));
  };

  const toggleQuickSymptom = (sym: string) => {
    if (symptoms.includes(sym)) {
      removeSymptom(sym);
    } else {
      setSymptoms([...symptoms, sym]);
    }
  };

  const getRecommendation = async () => {
    if (symptoms.length === 0) return;
    setIsLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/ai/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symptoms }),
      });
      if (res.ok) {
        const data = await res.json();
        setResult(data);
      }
    } catch (err) {
      console.error(err);
      // Fallback dummy for demonstration
      setResult({
        specialist: "General Physician",
        confidence: "Medium",
        reasoning: "Based on the generic symptoms provided, a general physician is the best starting point for a comprehensive diagnosis.",
        disclaimer: "This is an AI-assisted suggestion for informational purposes only. Please consult a qualified healthcare professional for medical advice."
      });
    }
    setIsLoading(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-xl hover:scale-110 transition-all z-40 ${isOpen ? 'hidden' : ''}`}
      >
        <Sparkles className="w-6 h-6 animate-pulse" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/40 backdrop-blur-sm transition-opacity">
          <div className="w-full sm:max-w-md bg-white/95 backdrop-blur-xl rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden animate-slide-in sm:animate-fade-in flex flex-col max-h-[90vh]">
            <div className="bg-gradient-to-r from-cyan-600 to-blue-600 p-4 flex items-center justify-between text-white shrink-0">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <Brain className="w-5 h-5" /> AI Health Assistant
              </h3>
              <button onClick={() => setIsOpen(false)} className="text-cyan-100 hover:text-white transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto flex-1">
              {!result ? (
                <>
                  <p className="text-sm text-gray-600 mb-4">
                    Describe your symptoms and our AI will recommend the right specialist for you.
                  </p>

                  <form onSubmit={handleAddSymptom} className="flex gap-2 mb-4">
                    <input
                      type="text"
                      placeholder="Type a symptom..."
                      value={symptomInput}
                      onChange={(e) => setSymptomInput(e.target.value)}
                      className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none"
                    />
                    <button type="submit" className="p-2.5 bg-cyan-100 text-cyan-700 rounded-xl hover:bg-cyan-200 transition-colors">
                      <Plus className="w-5 h-5" />
                    </button>
                  </form>

                  {symptoms.length > 0 && (
                    <div className="mb-4 p-3 bg-cyan-50 rounded-xl border border-cyan-100">
                      <p className="text-xs font-semibold text-cyan-800 mb-2">Selected Symptoms:</p>
                      <div className="flex flex-wrap gap-2">
                        {symptoms.map(sym => (
                          <span key={sym} className="flex items-center gap-1 bg-white text-cyan-700 text-xs px-2.5 py-1.5 rounded-full border border-cyan-200 shadow-sm">
                            {sym}
                            <button type="button" onClick={() => removeSymptom(sym)}><X className="w-3 h-3 text-cyan-500 hover:text-cyan-700" /></button>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mb-6">
                    <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">Quick Select</p>
                    <div className="flex flex-wrap gap-2">
                      {quickSymptoms.map(sym => (
                        <button
                          key={sym}
                          onClick={() => toggleQuickSymptom(sym)}
                          className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                            symptoms.includes(sym) ? 'bg-cyan-600 text-white border-cyan-600' : 'bg-white text-gray-600 border-gray-200 hover:border-cyan-400 hover:bg-cyan-50'
                          }`}
                        >
                          {sym}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={getRecommendation}
                    disabled={symptoms.length === 0 || isLoading}
                    className="w-full py-3.5 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all flex justify-center items-center gap-2"
                  >
                    {isLoading ? (
                      <><Brain className="w-5 h-5 animate-pulse" /> Analyzing...</>
                    ) : (
                      <><Activity className="w-5 h-5" /> Get Recommendation</>
                    )}
                  </button>
                </>
              ) : (
                <div className="animate-fade-in space-y-4">
                  <div className="text-center p-6 bg-gradient-to-b from-cyan-50 to-white rounded-2xl border border-cyan-100">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm border border-cyan-50">
                      <Brain className="w-8 h-8 text-cyan-600" />
                    </div>
                    <p className="text-sm text-gray-500 font-medium mb-1">Recommended Specialist</p>
                    <h2 className="text-2xl font-bold text-gray-900 text-cyan-700">{result.specialist}</h2>
                    
                    <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800">
                      Confidence: {result.confidence}
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-xl text-sm text-gray-700 leading-relaxed border border-gray-100">
                    {result.reasoning}
                  </div>

                  <button
                    onClick={() => {
                      onFindDoctors(result.specialist);
                      setIsOpen(false);
                    }}
                    className="w-full py-3.5 bg-cyan-600 text-white rounded-xl font-bold hover:bg-cyan-700 transition-all flex justify-center items-center gap-2 shadow-sm"
                  >
                    <Search className="w-5 h-5" /> Find {result.specialist}s
                  </button>
                  
                  <button
                    onClick={() => setResult(null)}
                    className="w-full py-2.5 text-sm text-gray-500 font-medium hover:text-gray-700"
                  >
                    Reset & Try Again
                  </button>
                </div>
              )}
            </div>
            
            <div className="bg-amber-50 p-3 border-t border-amber-100 text-[10px] sm:text-xs text-amber-800 flex gap-2 shrink-0">
              <span className="text-xl">⚠️</span>
              <p>This is an AI-assisted suggestion for informational purposes only. Please consult a qualified healthcare professional for medical advice.</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
