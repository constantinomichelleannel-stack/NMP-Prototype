/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Brain, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight,
  Loader2,
  Sparkles
} from 'lucide-react';
import { motion } from 'motion/react';
import { getPredictiveInsights } from '../services/gemini';
import { Trainee, Course, OptimizationInsight } from '../types';
import { cn } from '../lib/utils';

const mockTrainees: Trainee[] = [
  { id: '1', name: 'John Doe', rank: 'Officer', company: 'Maersk', courses: ['Safety'], performanceScore: 85, completionRate: 90, certificationStatus: 'Certified', lastAssessmentDate: '2024-03-01' },
  { id: '2', name: 'Jane Smith', rank: 'Engineer', company: 'MSC', courses: ['Technical'], performanceScore: 72, completionRate: 85, certificationStatus: 'Pending', lastAssessmentDate: '2024-02-15' },
];

const mockCourses: Course[] = [
  { id: '1', title: 'Advanced Firefighting', category: 'Safety', duration: 40, capacity: 20, enrolled: 18, successRate: 92, nextSchedule: '2024-04-10' },
];

export default function Analytics() {
  const [insights, setInsights] = React.useState<OptimizationInsight[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadInsights() {
      setLoading(true);
      const data = await getPredictiveInsights(mockTrainees, mockCourses);
      setInsights(data);
      setLoading(false);
    }
    loadInsights();
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Predictive Analytics</h2>
          <p className="text-slate-500">AI-driven insights for trainee performance and certification outcomes.</p>
        </div>
        <button 
          onClick={() => window.location.reload()}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-500/20"
        >
          <Sparkles className="w-4 h-4" />
          Refresh Insights
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <Loader2 className="w-12 h-12 text-emerald-500 animate-spin" />
          <p className="text-slate-500 font-medium">Gemini AI is analyzing training datasets...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {insights.map((insight, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col h-full"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={cn(
                  "p-3 rounded-xl",
                  insight.type === 'Performance' && "bg-blue-50 text-blue-600",
                  insight.type === 'Schedule' && "bg-emerald-50 text-emerald-600",
                  insight.type === 'Resource' && "bg-amber-50 text-amber-600",
                )}>
                  {insight.type === 'Performance' ? <TrendingUp className="w-6 h-6" /> : 
                   insight.type === 'Schedule' ? <CheckCircle2 className="w-6 h-6" /> : 
                   <AlertTriangle className="w-6 h-6" />}
                </div>
                <span className={cn(
                  "px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider",
                  insight.impact === 'High' ? "bg-red-50 text-red-600" :
                  insight.impact === 'Medium' ? "bg-amber-50 text-amber-600" :
                  "bg-emerald-50 text-emerald-600"
                )}>
                  {insight.impact} Impact
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">{insight.title}</h3>
              <p className="text-sm text-slate-600 mb-6 flex-1">{insight.description}</p>
              
              <div className="mt-auto pt-6 border-t border-slate-100">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Recommendation</p>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <p className="text-sm font-medium text-slate-700 leading-relaxed">
                    {insight.recommendation}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Trainee Risk Analysis Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900">Trainee Performance Predictions</h3>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-xs font-medium text-slate-500">
              <div className="w-2 h-2 rounded-full bg-emerald-500"></div> Low Risk
            </div>
            <div className="flex items-center gap-1 text-xs font-medium text-slate-500">
              <div className="w-2 h-2 rounded-full bg-amber-500"></div> Medium Risk
            </div>
            <div className="flex items-center gap-1 text-xs font-medium text-slate-500">
              <div className="w-2 h-2 rounded-full bg-red-500"></div> High Risk
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Trainee</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Course</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Current Score</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Predicted Outcome</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Risk Level</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {[
                { name: 'Michael Chen', course: 'Engine Room Simulator', score: 68, prediction: 'Likely to Fail Assessment', risk: 'High', color: 'red' },
                { name: 'Elena Rodriguez', course: 'Bridge Resource Mgmt', score: 82, prediction: 'On Track for Certification', risk: 'Low', color: 'emerald' },
                { name: 'Ahmed Hassan', course: 'Advanced Firefighting', score: 74, prediction: 'Requires Additional Practice', risk: 'Medium', color: 'amber' },
                { name: 'Sophie Martin', course: 'GMDSS General Operator', score: 91, prediction: 'Excellent Performance', risk: 'Low', color: 'emerald' },
              ].map((row, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600">
                        {row.name[0]}
                      </div>
                      <span className="font-medium text-slate-900">{row.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{row.course}</td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-900">{row.score}%</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{row.prediction}</td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                      row.color === 'red' && "bg-red-50 text-red-600",
                      row.color === 'amber' && "bg-amber-50 text-amber-600",
                      row.color === 'emerald' && "bg-emerald-50 text-emerald-600",
                    )}>
                      {row.risk}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-400 hover:text-emerald-600">
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
