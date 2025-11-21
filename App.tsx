import React, { useState, useRef, useEffect } from 'react';
import { ImageUploader } from './components/ImageUploader';
import { LoadingOverlay } from './components/LoadingOverlay';
import { EditTool } from './components/EditTool';
import { GenerateTool } from './components/GenerateTool';
import { analyzeItemImage } from './services/geminiService';
import { AppState, ListingData, ItemCategory } from './types';
import { 
  ChevronLeft, 
  ShoppingBag, 
  Tag, 
  Euro, 
  Share2, 
  CheckCircle2,
  LayoutTemplate,
  Wand2,
  Download,
  Key
} from 'lucide-react';

export default function App() {
  // Removed apiKeySelected state for Demo Mode
  const [state, setState] = useState<AppState>(AppState.UPLOAD);
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState('');
  const [listingData, setListingData] = useState<ListingData | null>(null);
  const [activeTab, setActiveTab] = useState<'details' | 'edit' | 'generate'>('details');

  const setAppLoading = (isLoading: boolean, msg: string = '') => {
    setLoading(isLoading);
    setLoadingMsg(msg);
  };

  const handleImageSelect = async (base64: string) => {
    setImage(base64);
    setAppLoading(true, 'Analyzing image with Gemini 2.5 Flash...');
    try {
      const data = await analyzeItemImage(base64.split(',')[1]);
      setListingData(data);
      setState(AppState.ANALYSIS);
    } catch (error) {
      console.error(error);
      alert("Failed to analyze. Please try another photo or check your connection.");
      setImage(null);
    } finally {
      setAppLoading(false);
    }
  };

  const handleUpdateImage = (newImage: string) => {
    setImage(newImage);
  };

  const handleReset = () => {
    setState(AppState.UPLOAD);
    setImage(null);
    setListingData(null);
    setActiveTab('details');
  };

  if (state === AppState.UPLOAD) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <header className="p-6 bg-white shadow-sm sticky top-0 z-10">
          <div className="flex items-center gap-2 max-w-md mx-auto">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <Tag className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">SellSmart AI</h1>
          </div>
        </header>
        <main className="flex-1 flex items-center justify-center p-6">
          <ImageUploader onImageSelect={handleImageSelect} />
        </main>
        <LoadingOverlay isVisible={loading} message={loadingMsg} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pb-20">
      <LoadingOverlay isVisible={loading} message={loadingMsg} />
      
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-20 px-4 py-3 flex items-center justify-between">
        <button onClick={handleReset} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
          <ChevronLeft className="w-6 h-6 text-slate-600" />
        </button>
        <h1 className="font-semibold text-slate-800">New Listing</h1>
        <button className="p-2 text-indigo-600 font-medium text-sm">Save</button>
      </header>

      <div className="max-w-md mx-auto w-full">
        {/* Image Preview Area */}
        <div className="relative w-full aspect-[4/5] bg-slate-200">
          {image && (
            <img 
              src={image} 
              alt="Item" 
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute bottom-4 right-4 flex gap-2">
             <button 
              onClick={() => {
                  const link = document.createElement('a');
                  link.href = image || '';
                  link.download = 'smart-sell-image.png';
                  link.click();
              }}
              className="bg-black/50 backdrop-blur-md p-2 rounded-full text-white hover:bg-black/70"
            >
              <Download className="w-5 h-5" />
             </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-white">
          <button 
            onClick={() => setActiveTab('details')}
            className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'details' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500'}`}
          >
            Listing Details
          </button>
          <button 
            onClick={() => setActiveTab('edit')}
            className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'edit' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500'}`}
          >
            Quick Edit
          </button>
          <button 
            onClick={() => setActiveTab('generate')}
            className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'generate' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500'}`}
          >
            Pro Style
          </button>
        </div>

        {/* Content Area */}
        <div className="p-5 space-y-6 animate-in slide-in-from-bottom-4 duration-300">
          
          {activeTab === 'details' && listingData && (
            <>
              {/* AI Insights */}
              <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle2 className="w-5 h-5 text-indigo-600" />
                  <h3 className="font-semibold text-indigo-900">AI Analysis Complete</h3>
                </div>
                <p className="text-sm text-indigo-700 leading-relaxed">
                  Identified as <span className="font-bold">{listingData.category}</span>. 
                  Suggested price: <span className="font-bold">{listingData.priceRange}</span>.
                </p>
              </div>

              {/* Editable Fields */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">Title</label>
                  <input 
                    type="text" 
                    defaultValue={listingData.title}
                    className="w-full p-3 bg-white border border-slate-200 rounded-lg font-medium text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">Description</label>
                  <textarea 
                    defaultValue={listingData.description}
                    className="w-full p-3 bg-white border border-slate-200 rounded-lg text-slate-600 h-32 focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">Suggested Price</label>
                  <div className="relative">
                    <Euro className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      type="text" 
                      defaultValue={listingData.priceRange.replace(/[^0-9-]/g, '')}
                      className="w-full pl-9 pr-3 py-3 bg-white border border-slate-200 rounded-lg font-medium text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                </div>

                 <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">Hashtags</label>
                  <div className="flex flex-wrap gap-2">
                    {listingData.hashtags.map((tag, i) => (
                      <span key={i} className="px-3 py-1 bg-slate-100 text-slate-600 text-xs rounded-full font-medium">
                        {tag.startsWith('#') ? tag : `#${tag}`}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Marketplaces */}
              <div className="pt-4 border-t border-slate-200">
                <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                  <Share2 className="w-4 h-4" /> Suggested Platforms
                </h4>
                <div className="flex gap-3">
                  {listingData.suggestedMarketplaces.map((mp, i) => (
                    <div key={i} className="flex-1 bg-white border border-slate-200 p-3 rounded-lg text-center">
                      <span className="text-sm font-semibold text-slate-800">{mp}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {activeTab === 'edit' && image && (
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <p className="text-sm text-blue-800">
                  Use simple commands to fix your photo. The AI maintains the original item but changes the environment.
                </p>
              </div>
              <EditTool 
                originalImage={image} 
                onImageUpdate={handleUpdateImage} 
                setLoading={setAppLoading}
              />
            </div>
          )}

           {activeTab === 'generate' && listingData && image && (
            <div className="space-y-4">
               <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                <p className="text-sm text-purple-800">
                  Create entirely new, high-fashion, or styled images based on your item description. Choose your resolution.
                </p>
              </div>
              <GenerateTool 
                currentImage={image}
                onImageGenerated={handleUpdateImage} 
                setLoading={setAppLoading}
                category={listingData.category}
              />
            </div>
          )}

        </div>
      </div>
      
      {/* Floating Publish Button */}
      <div className="fixed bottom-6 left-0 right-0 px-6 flex justify-center pointer-events-none">
        <button className="pointer-events-auto shadow-xl shadow-indigo-200 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-full font-bold text-lg flex items-center gap-2 transition-all transform hover:scale-105">
          <ShoppingBag className="w-5 h-5" />
          Publish Listing
        </button>
      </div>

    </div>
  );
}