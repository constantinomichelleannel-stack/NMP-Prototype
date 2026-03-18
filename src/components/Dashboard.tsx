/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  Users, 
  GraduationCap, 
  Activity, 
  TrendingUp, 
  AlertCircle,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { cn, formatNumber, formatPercent } from '../lib/utils';

const performanceData = [
  { name: 'Jan', score: 78, target: 85 },
  { name: 'Feb', score: 82, target: 85 },
  { name: 'Mar', score: 85, target: 85 },
  { name: 'Apr', score: 81, target: 85 },
  { name: 'May', score: 88, target: 85 },
  { name: 'Jun', score: 92, target: 85 },
];

const categoryData = [
  { name: 'Safety', value: 45, color: '#10B981' },
  { name: 'Technical', value: 30, color: '#3B82F6' },
  { name: 'Operational', value: 25, color: '#F59E0B' },
];

const stats = [
  { label: 'Total Trainees', value: '1,248', change: '+12%', trend: 'up', icon: Users, color: 'blue' },
  { label: 'Completion Rate', value: '94.2%', change: '+2.4%', trend: 'up', icon: GraduationCap, color: 'emerald' },
  { label: 'Simulator Usage', value: '82%', change: '-5%', trend: 'down', icon: Activity, color: 'amber' },
  { label: 'Avg Assessment', value: '86.5', change: '+4.1%', trend: 'up', icon: TrendingUp, color: 'indigo' },
];

export default function Dashboard() {
  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className={cn(
                "p-3 rounded-xl",
                stat.color === 'blue' && "bg-blue-50 text-blue-600",
                stat.color === 'emerald' && "bg-emerald-50 text-emerald-600",
                stat.color === 'amber' && "bg-amber-50 text-amber-600",
                stat.color === 'indigo' && "bg-indigo-50 text-indigo-600",
              )}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div className={cn(
                "flex items-center gap-1 text-sm font-medium",
                stat.trend === 'up' ? "text-emerald-600" : "text-red-600"
              )}>
                {stat.change}
                {stat.trend === 'up' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium text-slate-500">{stat.label}</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Performance Trend */}
        <div className="lg:col-span-2 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Training Performance Trend</h3>
              <p className="text-sm text-slate-500">Average assessment scores vs target</p>
            </div>
            <select className="bg-slate-50 border border-slate-200 text-sm rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500/20">
              <option>Last 6 Months</option>
              <option>Last Year</option>
            </select>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceData}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748B', fontSize: 12 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748B', fontSize: 12 }}
                  dx={-10}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#FFF', 
                    borderRadius: '12px', 
                    border: '1px solid #E2E8F0',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#10B981" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorScore)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="target" 
                  stroke="#94A3B8" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  fill="transparent" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Course Distribution */}
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Course Distribution</h3>
          <p className="text-sm text-slate-500 mb-8">Enrollment by category</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-4 mt-4">
            {categoryData.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-sm font-medium text-slate-600">{item.name}</span>
                </div>
                <span className="text-sm font-bold text-slate-900">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Alerts & Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-900">Critical Alerts</h3>
            <span className="px-2 py-1 bg-red-50 text-red-600 text-xs font-bold rounded-md uppercase tracking-wider">High Priority</span>
          </div>
          <div className="space-y-4">
            {[
              { icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-50', title: 'Simulator Maintenance Overdue', time: '2 hours ago', desc: 'Bridge Simulator A requires immediate sensor calibration.' },
              { icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50', title: 'Course Capacity Warning', time: '5 hours ago', desc: 'GMDSS Operational Course is at 95% capacity for next week.' },
              { icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-50', title: 'Certification Expiry Alert', time: '1 day ago', desc: '15 trainees have certifications expiring in the next 30 days.' },
            ].map((alert, i) => (
              <div key={i} className="flex gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                <div className={cn("p-2 rounded-lg h-fit", alert.bg, alert.color)}>
                  <alert.icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-slate-900">{alert.title}</h4>
                    <span className="text-xs text-slate-400">{alert.time}</span>
                  </div>
                  <p className="text-sm text-slate-500 mt-1">{alert.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-900">Recent Assessments</h3>
            <button className="text-sm font-medium text-emerald-600 hover:text-emerald-700">View All</button>
          </div>
          <div className="space-y-4">
            {[
              { name: 'John Doe', course: 'Advanced Firefighting', score: 94, status: 'Passed' },
              { name: 'Jane Smith', course: 'Bridge Resource Mgmt', score: 88, status: 'Passed' },
              { name: 'Mike Johnson', course: 'Engine Room Simulator', score: 72, status: 'Passed' },
              { name: 'Sarah Wilson', course: 'GMDSS General Operator', score: 91, status: 'Passed' },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-slate-100">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600">
                    {item.name[0]}
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">{item.name}</h4>
                    <p className="text-xs text-slate-500">{item.course}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-slate-900">{item.score}%</div>
                  <div className="flex items-center gap-1 text-xs text-emerald-600 font-medium">
                    <CheckCircle2 className="w-3 h-3" />
                    {item.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
