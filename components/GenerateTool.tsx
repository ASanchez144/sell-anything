import React, { useState } from 'react';
import { Sparkles, Image as ImageIcon, User, MapPin, Shirt, Palette } from 'lucide-react';
import { generateHighResImage } from '../services/geminiService';
import { ImageResolution } from '../types';

interface GenerateToolProps {
  currentImage: string;
  onImageGenerated: (newImage: string) => void;
  setLoading: (loading: boolean, msg: string) => void;
  category: string;
}

export const GenerateTool: React.FC<GenerateToolProps> = ({ currentImage, onImageGenerated, setLoading, category }) => {
  const [resolution, setResolution] = useState<ImageResolution>('1K');
  const [customDetails, setCustomDetails] = useState('');
  
  // Structured Inputs
  const [selectedModel, setSelectedModel] = useState('No Model (Product Only)');
  const [selectedLocation, setSelectedLocation] = useState('Professional Studio');
  const [selectedStyle, setSelectedStyle] = useState('Neutral & Clean');

  const modelOptions = [
    "No Model (Product Only)",
    "Female Model",
    "Male Model",
    "Hand Model (Close up)"
  ];

  const locationOptions = [
    "Professional Studio",
    "Cozy Living Room",
    "Urban Street / City",
    "Nature / Park",
    "Minimalist Concrete",
    "Luxury Interior"
  ];

  const styleOptions = [
    "Neutral & Clean",
    "Streetwear / Trendy",
    "Vintage / Retro",
    "Professional / Formal",
    "Boho / Artistic"
  ];

  const handleGenerate = async () => {
    setLoading(true, `Generating ${resolution} image with Nano Banana Pro...`);
    
    // Construct a robust prompt based on selections
    const basePrompt = `Generate a high-quality, realistic product photography image of the item in the attached image.
    
    Configuration:
    - Subject: ${selectedModel === "No Model (Product Only)" ? "The product by itself" : `The product worn/held by a ${selectedModel}`}.
    - Environment/Background: ${selectedLocation}.
    - Aesthetics/Vibe: ${selectedStyle}.
    
    Important: Keep the main product identical to the input image. Improve lighting and composition suitable for a high-end marketplace listing.
    ${customDetails ? `Additional Instructions: ${customDetails}` : ''}`;

    try {
      // Extract base64 if full string provided
      const base64Data = currentImage.includes('base64,') ? currentImage.split(',')[1] : currentImage;
      
      const newImage = await generateHighResImage(base64Data, basePrompt, resolution);
      onImageGenerated(newImage);
    } catch (error) {
      console.error(error);
      alert('Failed to generate image. Please try again.');
    } finally {
      setLoading(false, '');
    }
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 space-y-5">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-500" />
          Pro Styling Studio
        </h3>
        <span className="text-[10px] px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full font-bold">GEMINI 3 PRO</span>
      </div>

      {/* Resolution Selection */}
      <div>
        <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Quality</label>
        <div className="flex bg-slate-100 p-1 rounded-lg">
          {(['1K', '2K', '4K'] as ImageResolution[]).map((res) => (
            <button
              key={res}
              onClick={() => setResolution(res)}
              className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${
                resolution === res 
                  ? 'bg-white text-purple-700 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {res}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        
        {/* 1. Model Selection */}
        <div>
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-600 mb-2">
            <User className="w-3 h-3 text-indigo-500" /> Who is the model?
          </label>
          <div className="grid grid-cols-2 gap-2">
            {modelOptions.map(opt => (
              <button
                key={opt}
                onClick={() => setSelectedModel(opt)}
                className={`text-left px-3 py-2 rounded-lg text-xs font-medium border transition-all ${
                  selectedModel === opt
                  ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                  : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-200'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* 2. Location Selection */}
        <div>
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-600 mb-2">
            <MapPin className="w-3 h-3 text-indigo-500" /> Where to take the photo?
          </label>
          <select 
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-indigo-500"
          >
            {locationOptions.map(loc => <option key={loc} value={loc}>{loc}</option>)}
          </select>
        </div>

        {/* 3. Style Selection */}
         <div>
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-600 mb-2">
            <Shirt className="w-3 h-3 text-indigo-500" /> Outfit / Vibe
          </label>
          <div className="flex flex-wrap gap-2">
            {styleOptions.map(style => (
              <button
                key={style}
                onClick={() => setSelectedStyle(style)}
                className={`px-3 py-1.5 rounded-full text-xs border transition-all ${
                  selectedStyle === style
                  ? 'bg-purple-50 border-purple-400 text-purple-700 font-semibold'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {style}
              </button>
            ))}
          </div>
        </div>

        {/* 4. Custom Details */}
        <div>
           <label className="flex items-center gap-1.5 text-xs font-bold text-slate-600 mb-2">
             <Palette className="w-3 h-3 text-indigo-500" /> Extra Details (Optional)
           </label>
           <textarea
            value={customDetails}
            onChange={(e) => setCustomDetails(e.target.value)}
            placeholder="e.g. Make the lighting golden hour, ensure the shoes are red..."
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-purple-500 min-h-[60px]"
          />
        </div>

        <button
          onClick={handleGenerate}
          className="w-full py-3 bg-purple-600 text-white text-sm font-bold rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-purple-100 mt-2"
        >
          <ImageIcon className="w-4 h-4" />
          Generate Pro Photo
        </button>
        <p className="text-[10px] text-slate-400 text-center">
          Generates a new image preserving your item's details.
        </p>
      </div>
    </div>
  );
};