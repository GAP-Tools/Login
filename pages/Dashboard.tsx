import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../App';
import { geminiService } from '../services/geminiService';
import { InsightType, InsightResponse } from '../types';
import { Button } from '../components/Button';
import { RefreshCw, Lightbulb, Zap, BookOpen, Quote, Sparkles } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [insight, setInsight] = useState<InsightResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeType, setActiveType] = useState<InsightType>(InsightType.MOTIVATION);

  const fetchInsight = useCallback(async (type: InsightType) => {
    if (!user) return;
    
    setLoading(true);
    setActiveType(type);
    
    try {
      const data = await geminiService.generateInsight(user, type);
      setInsight(data);
    } catch (err) {
      console.error("Failed to fetch insight", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Initial fetch on mount
  useEffect(() => {
    fetchInsight(InsightType.MOTIVATION);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  if (!user) return null;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Welcome Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Welcome back, {user.name.split(' ')[0]}!</h1>
          <p className="text-slate-500 mt-2">Ready to explore what AI has in store for you today?</p>
        </div>
        <div className="flex gap-2 flex-wrap">
           <div className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-medium border border-indigo-100">
             {user.interests.join(' • ')}
           </div>
        </div>
      </div>

      {/* Insight Generator Card */}
      <div className="grid md:grid-cols-3 gap-6">
        
        {/* Controls */}
        <div className="col-span-1 bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-6 h-fit">
          <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
            <Zap className="h-5 w-5 text-amber-500" />
            Generate Insight
          </h2>
          <div className="space-y-3">
            <button
              onClick={() => fetchInsight(InsightType.MOTIVATION)}
              disabled={loading}
              className={`w-full text-left px-4 py-3 rounded-xl transition-all flex items-center gap-3 ${
                activeType === InsightType.MOTIVATION 
                  ? 'bg-indigo-50 text-indigo-700 border-indigo-200 border shadow-sm ring-1 ring-indigo-200' 
                  : 'hover:bg-slate-50 text-slate-600 border border-transparent'
              }`}
            >
              <Lightbulb className="h-5 w-5" />
              <div className="flex flex-col">
                <span className="font-medium">Motivation</span>
                <span className="text-xs opacity-75">Boost your morale</span>
              </div>
            </button>

            <button
              onClick={() => fetchInsight(InsightType.PRODUCTIVITY)}
              disabled={loading}
              className={`w-full text-left px-4 py-3 rounded-xl transition-all flex items-center gap-3 ${
                activeType === InsightType.PRODUCTIVITY 
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 border shadow-sm ring-1 ring-emerald-200' 
                  : 'hover:bg-slate-50 text-slate-600 border border-transparent'
              }`}
            >
              <Zap className="h-5 w-5" />
              <div className="flex flex-col">
                <span className="font-medium">Productivity</span>
                <span className="text-xs opacity-75">Work smarter</span>
              </div>
            </button>

            <button
              onClick={() => fetchInsight(InsightType.LEARNING)}
              disabled={loading}
              className={`w-full text-left px-4 py-3 rounded-xl transition-all flex items-center gap-3 ${
                activeType === InsightType.LEARNING 
                  ? 'bg-blue-50 text-blue-700 border-blue-200 border shadow-sm ring-1 ring-blue-200' 
                  : 'hover:bg-slate-50 text-slate-600 border border-transparent'
              }`}
            >
              <BookOpen className="h-5 w-5" />
              <div className="flex flex-col">
                <span className="font-medium">Learning</span>
                <span className="text-xs opacity-75">Expand knowledge</span>
              </div>
            </button>
          </div>
        </div>

        {/* Display Area */}
        <div className="col-span-1 md:col-span-2 bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl shadow-xl p-8 flex flex-col justify-center relative overflow-hidden min-h-[300px]">
          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 p-12 opacity-5">
            <Quote size={120} />
          </div>
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-indigo-500 rounded-full blur-[80px] opacity-20"></div>

          <div className="relative z-10 space-y-6">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white ring-1 ring-inset ring-white/20">
                Gemini 2.5 Flash
              </span>
              <Button 
                variant="secondary" 
                size="sm"
                onClick={() => fetchInsight(activeType)}
                isLoading={loading}
                className="!bg-white/10 hover:!bg-white/20 text-white border-0"
              >
                {!loading && <RefreshCw className="h-4 w-4 mr-2" />}
                Refresh
              </Button>
            </div>

            <div className="min-h-[120px] flex items-center justify-center">
              {loading ? (
                <div className="space-y-3 w-full animate-pulse">
                  <div className="h-4 bg-white/10 rounded w-3/4 mx-auto"></div>
                  <div className="h-4 bg-white/10 rounded w-1/2 mx-auto"></div>
                </div>
              ) : (
                <div className="text-center space-y-4">
                  <p className="text-2xl md:text-3xl font-serif leading-relaxed italic text-white/90">
                    "{insight?.message}"
                  </p>
                  {insight?.author && (
                    <p className="text-indigo-200 font-medium">— {insight.author}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Grid Features */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
           <h3 className="font-semibold text-slate-900 mb-2">My Profile</h3>
           <p className="text-sm text-slate-500 mb-4">Your personalized settings used for AI generation.</p>
           <ul className="space-y-2">
             <li className="flex justify-between text-sm py-2 border-b border-slate-100">
               <span className="text-slate-500">Name</span>
               <span className="font-medium text-slate-900">{user.name}</span>
             </li>
             <li className="flex justify-between text-sm py-2 border-b border-slate-100">
               <span className="text-slate-500">Email</span>
               <span className="font-medium text-slate-900">{user.email}</span>
             </li>
             <li className="flex justify-between text-sm py-2 border-b border-slate-100">
               <span className="text-slate-500">Account ID</span>
               <span className="font-mono text-xs bg-slate-100 px-2 py-0.5 rounded text-slate-600">{user.id}</span>
             </li>
           </ul>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-center items-center text-center space-y-4">
           <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center">
             <Sparkles className="h-6 w-6" />
           </div>
           <div>
             <h3 className="font-semibold text-slate-900">Pro Features</h3>
             <p className="text-sm text-slate-500 mt-1">Upgrade to unlock full conversational history and complex reasoning models.</p>
           </div>
           <Button variant="outline" className="w-full sm:w-auto">View Plans</Button>
        </div>
      </div>

    </div>
  );
};