/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Calendar, 
  Clock, 
  Users, 
  Zap, 
  CheckCircle2, 
  AlertCircle,
  TrendingUp,
  ArrowRight,
  Sparkles,
  Loader2
} from 'lucide-react';
import { motion } from 'motion/react';
import { getOptimizationStrategies } from '../services/gemini';
import { Simulator, Course, OptimizationInsight } from '../types';
import { cn } from '../lib/utils';

const mockSimulators: Simulator[] = [
  { id: '1', name: 'Bridge Simulator A', type: 'Bridge', status: 'In Use', utilizationRate: 85, nextMaintenance: '2024-04-15' },
  { id: '2', name: 'Engine Room Sim B', type: 'Engine', status: 'Available', utilizationRate: 45, nextMaintenance: '2024-05-01' },
  { id: '3', name: 'GMDSS Lab', type: 'GMDSS', status: 'In Use', utilizationRate: 92, nextMaintenance: '2024-03-25' },
];

const mockCourses: Course[] = [
  { id: '1', title: 'Advanced Firefighting', category: 'Safety', duration: 40, capacity: 20, enrolled: 18, successRate: 92, nextSchedule: '2024-04-10' },
  { id: '2', title: 'Bridge Resource Mgmt', category: 'Operational', duration: 32, capacity: 12, enrolled: 12, successRate: 88, nextSchedule: '2024-04-12' },
];

export default function ResourceOptimization() {
  const [insights, setInsights] = React.useState<OptimizationInsight[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadInsights() {
      setLoading(true);
      const data = await getOptimizationStrategies(mockSimulators, mockCourses);
      setInsights(data);
      setLoading(false);
    }
    loadInsights();
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Resource Optimization</h2>
          <p className="text-slate-500">AI-based analytics to optimize training schedules and simulator utilization.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl font-medium hover:bg-slate-50 transition-colors">
            Export Schedule
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-500/20">
            <Zap className="w-4 h-4" />
            Run Optimizer
          </button>
        </div>
      </div>

      {/* Simulator Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {mockSimulators.map((sim) => (
          <div key={sim.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-slate-50 text-slate-600 rounded-xl">
                <Calendar className="w-6 h-6" />
              </div>
              <span className={cn(
                "px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                sim.status === 'Available' ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
              )}>
                {sim.status}
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-900">{sim.name}</h3>
            <p className="text-sm text-slate-500 mb-6">{sim.type} Simulator</p>
            
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-slate-500 font-medium">Utilization</span>
                  <span className="text-slate-900 font-bold">{sim.utilizationRate}%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className={cn(
                      "h-full transition-all duration-500",
                      sim.utilizationRate > 80 ? "bg-amber-500" : "bg-emerald-500"
                    )}
                    style={{ width: `${sim.utilizationRate}%` }}
                  ></div>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Next Maintenance</span>
                <span className="font-medium text-slate-600">{sim.nextMaintenance}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* AI Optimization Insights */}
      <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Sparkles className="w-48 h-48" />
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-emerald-500 p-2 rounded-lg">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold">AI Optimization Strategies</h3>
          </div>

          {loading ? (
            <div className="flex items-center gap-4 py-8">
              <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
              <p className="text-slate-400 font-medium">Generating optimization models...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {insights.map((insight, index) => (
                <div key={index} className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-sm">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">{insight.type}</span>
                    <span className={cn(
                      "px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider",
                      insight.impact === 'High' ? "bg-red-500/20 text-red-400" : "bg-emerald-500/20 text-emerald-400"
                    )}>
                      {insight.impact} Impact
                    </span>
                  </div>
                  <h4 className="text-lg font-bold mb-2">{insight.title}</h4>
                  <p className="text-sm text-slate-400 mb-6 leading-relaxed">{insight.description}</p>
                  <div className="bg-white/10 p-4 rounded-xl">
                    <p className="text-sm font-medium text-emerald-50 italic">
                      "{insight.recommendation}"
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Schedule Optimization Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-900">Upcoming Training Sessions</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Course</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Simulator</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Schedule</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Capacity</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">AI Score</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {[
                { course: 'Advanced Firefighting', sim: 'Safety Training Pool', date: '2024-04-10', time: '08:00 AM', enrolled: 18, capacity: 20, score: 98, status: 'Optimal' },
                { course: 'Bridge Resource Mgmt', sim: 'Bridge Simulator A', date: '2024-04-12', time: '09:30 AM', enrolled: 12, capacity: 12, score: 85, status: 'Full' },
                { course: 'Engine Room Simulator', sim: 'Engine Room Sim B', date: '2024-04-15', time: '01:00 PM', enrolled: 8, capacity: 15, score: 62, status: 'Under-utilized' },
              ].map((row, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="font-medium text-slate-900">{row.course}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{row.sim}</td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-slate-900">{row.date}</div>
                    <div className="text-xs text-slate-500">{row.time}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900">{row.enrolled}/{row.capacity}</span>
                      <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={cn(
                            "h-full",
                            (row.enrolled / row.capacity) > 0.9 ? "bg-amber-500" : "bg-emerald-500"
                          )}
                          style={{ width: `${(row.enrolled / row.capacity) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <TrendingUp className={cn(
                        "w-4 h-4",
                        row.score > 80 ? "text-emerald-500" : "text-amber-500"
                      )} />
                      <span className="text-sm font-bold text-slate-900">{row.score}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button className="flex items-center gap-1 text-xs font-bold text-emerald-600 hover:text-emerald-700 uppercase tracking-wider">
                      Optimize <ArrowRight className="w-3 h-3" />
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
