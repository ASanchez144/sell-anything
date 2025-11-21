import React, { ChangeEvent } from 'react';
import { Upload, Camera, Image as ImageIcon } from 'lucide-react';

interface ImageUploaderProps {
  onImageSelect: (base64: string) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelect }) => {
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // Remove data url prefix for API processing later if needed, but usually kept for display
      // We keep it full for display, service strips it if needed
      onImageSelect(base64String);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-slate-800">What are you selling?</h2>
        <p className="text-slate-500">Upload a photo to let AI create your listing.</p>
      </div>

      <label className="block w-full aspect-[3/4] relative border-2 border-dashed border-slate-300 rounded-3xl hover:border-indigo-500 hover:bg-indigo-50 transition-all cursor-pointer group bg-white shadow-sm">
        <input 
          type="file" 
          className="hidden" 
          accept="image/*" 
          onChange={handleFileChange} 
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center space-y-4">
          <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <Camera className="w-10 h-10 text-indigo-600" />
          </div>
          <div>
            <p className="text-lg font-semibold text-slate-700">Take a photo</p>
            <p className="text-sm text-slate-400">or upload from gallery</p>
          </div>
        </div>
      </label>
      
      <div className="flex justify-center gap-4 text-xs text-slate-400">
        <span className="flex items-center gap-1"><ImageIcon className="w-3 h-3"/> Supports JPG, PNG</span>
      </div>
    </div>
  );
};
