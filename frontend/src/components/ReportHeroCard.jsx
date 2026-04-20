import React from 'react';
import { Link } from 'react-router-dom';
import { Search, ArrowRight, Sparkles, MapPin, Clock } from 'lucide-react';

const ReportHeroCard = () => {
  return (
    <div className="relative group overflow-hidden rounded-3xl bg-white border border-gray-200/60 shadow-xl shadow-primary-500/5 transition-all duration-500 hover:shadow-2xl hover:shadow-primary-500/10 hover:-translate-y-1">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-primary-100/30 rounded-full blur-3xl group-hover:bg-primary-200/40 transition-colors" />
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-64 h-64 bg-accent-100/30 rounded-full blur-3xl group-hover:bg-accent-200/40 transition-colors" />

      <div className="relative p-8 sm:p-10 flex flex-col lg:flex-row items-center gap-10">
        {/* Content Side */}
        <div className="flex-1 space-y-6 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 border border-primary-100 rounded-full text-primary-600">
            <Sparkles className="w-4 h-4 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider">Report Lost Item</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold text-surface-dark leading-tight">
            Lost something valuable? <br />
            <span className="bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
              Let the community help you.
            </span>
          </h2>

          <p className="text-gray-500 text-lg max-w-xl mx-auto lg:mx-0">
            Post your lost item details in seconds. Our automated matching system will notify you the moment someone finds it.
          </p>

          <div className="flex flex-wrap justify-center lg:justify-start gap-6 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary-500" />
              <span>Campus-wide Reach</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-accent-500" />
              <span>Real-time Alerts</span>
            </div>
          </div>

          <div className="pt-4">
            <Link
              to="/report-lost"
              className="group/btn inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-2xl font-bold text-lg shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 transition-all hover:scale-105"
            >
              Start Reporting Now
              <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Visual Side (Illustration/Graphic) */}
        <div className="relative w-full max-w-[320px] lg:max-w-[400px]">
          <div className="relative z-10 aspect-square rounded-2xl bg-gradient-to-br from-gray-50 to-white border border-gray-100 shadow-inner overflow-hidden flex items-center justify-center">
            {/* Abstract Graphic Representation */}
            <div className="relative">
              <div className="w-40 h-40 rounded-full border-2 border-dashed border-primary-200 animate-[spin_20s_linear_infinite]" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-24 h-24 rounded-3xl bg-white shadow-xl flex items-center justify-center transform -rotate-12 group-hover:rotate-0 transition-transform duration-500">
                  <Search className="w-12 h-12 text-primary-500" />
                </div>
              </div>
              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 w-12 h-12 rounded-xl bg-accent-500 shadow-lg flex items-center justify-center text-white transform rotate-12 animate-bounce">
                <MapPin className="w-6 h-6" />
              </div>
              <div className="absolute -bottom-6 -left-2 w-16 h-16 rounded-full bg-primary-100 shadow-md flex items-center justify-center text-primary-600 transform -rotate-6">
                <Sparkles className="w-8 h-8" />
              </div>
            </div>
          </div>
          {/* Decorative Circles */}
          <div className="absolute -top-6 -left-6 w-24 h-24 bg-primary-500/10 rounded-full blur-xl" />
          <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-accent-500/10 rounded-full blur-xl" />
        </div>
      </div>
    </div>
  );
};

export default ReportHeroCard;
