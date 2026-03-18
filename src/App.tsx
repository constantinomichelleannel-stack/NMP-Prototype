/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Analytics from './components/Analytics';
import ResourceOptimization from './components/ResourceOptimization';
import TrainingModules from './components/TrainingModules';

// Simple placeholder components for other routes
const Trainees = () => (
  <div className="p-8 bg-white rounded-2xl border border-slate-200 shadow-sm">
    <h2 className="text-2xl font-bold text-slate-900 mb-4">Trainee Management</h2>
    <p className="text-slate-500">Manage and track NMP trainee records, certifications, and assessment history.</p>
    <div className="mt-8 p-12 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center text-slate-400">
      <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
      </div>
      <p className="font-medium">Trainee database module loading...</p>
    </div>
  </div>
);

const Simulators = () => (
  <div className="p-8 bg-white rounded-2xl border border-slate-200 shadow-sm">
    <h2 className="text-2xl font-bold text-slate-900 mb-4">Simulator Management</h2>
    <p className="text-slate-500">Monitor and manage NMP simulator assets, maintenance schedules, and technical status.</p>
    <div className="mt-8 p-12 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center text-slate-400">
      <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
      </div>
      <p className="font-medium">Simulator asset module loading...</p>
    </div>
  </div>
);

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="modules" element={<TrainingModules />} />
          <Route path="trainees" element={<Trainees />} />
          <Route path="optimization" element={<ResourceOptimization />} />
          <Route path="simulators" element={<Simulators />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
