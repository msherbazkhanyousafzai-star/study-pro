import React, { useState } from 'react';

function App() {
  const [activeTab, setActiveTab] = useState('notes');
  const [inputTopic, setInputTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [aiOutput, setAiOutput] = useState('');

  const handleGenerate = async () => {
  if (!inputTopic) return alert("Please enter a topic!");
    setLoading(true);
    setAiOutput('');

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
    alert("Please set API Key in .env file!");
      setLoading(false);
      return;
    }

    // System Prompts per Feature
    let systemPrompt = '';
    if (activeTab === 'notes') {
      systemPrompt = `You are StudyAI Pro. Generate detailed study notes, main key points, and a quick summary for: "${inputTopic}".`;
    } else if (activeTab === 'quiz') {
      systemPrompt = `You are StudyAI Pro. Create 3 multiple choice quiz questions with correct answers and explanations for: "${inputTopic}".`;
    } else if (activeTab === 'planner') {
      systemPrompt = `You are StudyAI Pro. Generate a 3-day step-by-step actionable study roadmap/schedule for mastering: "${inputTopic}".`;
    }

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: [{ parts: [{ text: systemPrompt }] }] })
        }
      );

      const data = await response.json();
      if (data.candidates && data.candidates[0].content.parts[0].text) {
        setAiOutput(data.candidates[0].content.parts[0].text);
      } else {
        setAiOutput('جواب حاصل کرنے میں ناکامی ہوئی۔ API Key کی تصدیق کریں۔');
      }
    } catch (err) {
      console.error(err);
      setAiOutput('ایک ایرر پیش آیا ہے۔ براہ کرم دوبارہ کوشش کریں۔');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur p-4">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-extrabold text-blue-500">🎓 StudyAI Pro</h1>
          <span className="text-xs bg-blue-900/50 text-blue-300 px-3 py-1 rounded-full border border-blue-700">Next-Gen Learning Platform</span>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto w-full p-6 flex-grow">
        {/* Navigation Tabs */}
        <div className="flex bg-slate-900 p-1 rounded-xl mb-6 border border-slate-800">
          <button
            onClick={() => setActiveTab('notes')}
            className={`flex-1 py-2 rounded-lg font-medium transition ${activeTab === 'notes' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            📝 AI Study Notes
          </button>
          <button
            onClick={() => setActiveTab('quiz')}
            className={`flex-1 py-2 rounded-lg font-medium transition ${activeTab === 'quiz' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            ❓ Quiz Generator
          </button>
          <button
            onClick={() => setActiveTab('planner')}
            className={`flex-1 py-2 rounded-lg font-medium transition ${activeTab === 'planner' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            📅 Study Planner
          </button>
        </div>

        {/* Input Card */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl mb-6">
          <label className="block text-sm font-semibold text-slate-300 mb-2">
            {activeTab === 'notes' && 'کس ٹاپک کے نوٹس بنانا چاہتے ہیں؟'}
            {activeTab === 'quiz' && 'کوئز کے لیے ٹاپک درج کریں:'}
            {activeTab === 'planner' && 'کس مضمون کا روڈ میپ چاہیے؟'}
          </label>
          <textarea
            value={inputTopic}
            onChange={(e) => setInputTopic(e.target.value)}
            rows="3"
            placeholder="مثال: Organic Chemistry, Data Structures, European History..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500 transition"
          />
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 py-3 rounded-xl font-bold transition disabled:opacity-50"
          >
            {loading ? 'AI پروسیسنگ جاری ہے...' : '✨ AI نتائج تیار کریں'}
          </button>
        </div>

        {/* Output Card */}
        {aiOutput && (
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl whitespace-pre-line text-slate-300 leading-relaxed">
            {aiOutput}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
