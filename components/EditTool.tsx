import React, { useState } from 'react';
import { Wand2, Send, Undo2 } from 'lucide-react';
import { editImage } from '../services/geminiService';

interface EditToolProps {
  originalImage: string;
  onImageUpdate: (newImage: string) => void;
  setLoading: (loading: boolean, msg: string) => void;
}

export const EditTool: React.FC<EditToolProps> = ({ originalImage, onImageUpdate, setLoading }) => {
  const [prompt, setPrompt] = useState('');

  const handleEdit = async () => {
    if (!prompt.trim()) return;
    setLoading(true, `Applying: "${prompt}" with Gemini 2.5 Flash...`);
    try {
      // Extract base64 data part
      const base64Data = originalImage.split(',')[1];
      const newImage = await editImage(base64Data, prompt);
      onImageUpdate(newImage);
      setPrompt('');
    } catch (error) {
      console.error(error);
      alert('Failed to edit image. Please try again.');
    } finally {
      setLoading(false, '');
    }
  };

  const quickPrompts = [
    "Remove the background",
    "Add a cozy warm filter",
    "Make the background a white studio wall",
    "Enhance lighting and contrast"
  ];

  return (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
          <Wand2 className="w-4 h-4 text-indigo-500" />
          AI Magic Edit
        </h3>
        
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2 no-scrollbar">
          {quickPrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => setPrompt(p)}
              className="px-3 py-1.5 bg-slate-100 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 text-xs font-medium rounded-full whitespace-nowrap transition-colors border border-transparent hover:border-indigo-200"
            >
              {p}
            </button>
          ))}
        </div>

        <div className="relative">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g. 'Remove the person in the background'..."
            className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            onKeyDown={(e) => e.key === 'Enter' && handleEdit()}
          />
          <button 
            onClick={handleEdit}
            disabled={!prompt.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:hover:bg-indigo-600 transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="text-[10px] text-slate-400 mt-2 text-right">Powered by Gemini 2.5 Flash Image</p>
      </div>
    </div>
  );
};
