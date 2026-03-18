/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  BookOpen, 
  Plus, 
  Edit2, 
  Trash2, 
  Search, 
  Filter,
  X,
  CheckCircle2,
  Clock,
  Users,
  AlertCircle,
  ArrowLeft,
  Calendar,
  TrendingUp,
  Shield,
  Cog,
  Anchor,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Course, TraineeCourseStatus } from '../types';
import { cn } from '../lib/utils';
import { GoogleGenAI, Type } from "@google/genai";

const initialCourses: Course[] = [
  { id: '1', title: 'Advanced Firefighting', category: 'Safety', duration: 40, capacity: 20, enrolled: 18, successRate: 92, nextSchedule: '2024-04-10' },
  { id: '2', title: 'Bridge Resource Management', category: 'Operational', duration: 32, capacity: 12, enrolled: 12, successRate: 88, nextSchedule: '2024-04-12' },
  { id: '3', title: 'Engine Room Simulator', category: 'Technical', duration: 48, capacity: 15, enrolled: 8, successRate: 75, nextSchedule: '2024-04-15' },
  { id: '4', title: 'GMDSS General Operator', category: 'Technical', duration: 60, capacity: 10, enrolled: 10, successRate: 95, nextSchedule: '2024-04-20' },
];

const mockTraineeStatuses: TraineeCourseStatus[] = [
  { traineeId: 'T1', courseId: '1', traineeName: 'John Doe', completionPercentage: 100, completionDate: '2024-03-15' },
  { traineeId: 'T2', courseId: '1', traineeName: 'Jane Smith', completionPercentage: 85 },
  { traineeId: 'T3', courseId: '1', traineeName: 'Mike Johnson', completionPercentage: 45 },
  { traineeId: 'T4', courseId: '2', traineeName: 'Sarah Wilson', completionPercentage: 100, completionDate: '2024-03-10' },
  { traineeId: 'T5', courseId: '2', traineeName: 'David Brown', completionPercentage: 60 },
  { traineeId: 'T6', courseId: '3', traineeName: 'Emily Davis', completionPercentage: 20 },
  { traineeId: 'T7', courseId: '4', traineeName: 'Chris Miller', completionPercentage: 100, completionDate: '2024-03-12' },
];

export default function TrainingModules() {
  const [courses, setCourses] = React.useState<Course[]>(initialCourses);
  const [traineeStatuses] = React.useState<TraineeCourseStatus[]>(mockTraineeStatuses);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingCourse, setEditingCourse] = React.useState<Course | null>(null);
  const [selectedCourse, setSelectedCourse] = React.useState<Course | null>(null);
  const [recommendations, setRecommendations] = React.useState<{ title: string; reason: string }[]>([]);
  const [isLoadingRecommendations, setIsLoadingRecommendations] = React.useState(false);
  const [risks, setRisks] = React.useState<{ severity: 'High' | 'Medium' | 'Low'; title: string; description: string }[]>([]);
  const [isLoadingRisks, setIsLoadingRisks] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [showFilters, setShowFilters] = React.useState(false);
  const [filters, setFilters] = React.useState({
    minDuration: 0,
    minCapacity: 0,
    minSuccessRate: 0,
  });
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  React.useEffect(() => {
    if (selectedCourse) {
      fetchRecommendations(selectedCourse);
      fetchRisks(selectedCourse);
    } else {
      setRecommendations([]);
      setRisks([]);
    }
  }, [selectedCourse]);

  const fetchRisks = async (course: Course) => {
    setIsLoadingRisks(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Analyze potential training risks for the maritime module "${course.title}" (${course.category}). 
        Current stats: Success Rate: ${course.successRate}%, Enrolled: ${course.enrolled}/${course.capacity}.
        Identify 3 specific risks (e.g., related to low success, capacity issues, or certification urgency). 
        For each risk, provide a severity (High, Medium, Low), a title, and a brief description.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                severity: { type: Type.STRING, enum: ["High", "Medium", "Low"] },
                title: { type: Type.STRING },
                description: { type: Type.STRING },
              },
              required: ["severity", "title", "description"],
            },
          },
        },
      });

      if (response.text) {
        setRisks(JSON.parse(response.text));
      }
    } catch (error) {
      console.error("Error fetching risks:", error);
    } finally {
      setIsLoadingRisks(false);
    }
  };

  const fetchRecommendations = async (course: Course) => {
    setIsLoadingRecommendations(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Based on the maritime training module "${course.title}" in the "${course.category}" category with a success rate of ${course.successRate}%, recommend 3 related or advanced modules. Provide a title and a brief reason for each.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                reason: { type: Type.STRING },
              },
              required: ["title", "reason"],
            },
          },
        },
      });

      if (response.text) {
        setRecommendations(JSON.parse(response.text));
      }
    } catch (error) {
      console.error("Error fetching recommendations:", error);
    } finally {
      setIsLoadingRecommendations(false);
    }
  };

  const [formData, setFormData] = React.useState({
    title: '',
    category: 'Safety' as Course['category'],
    duration: 0,
    capacity: 0,
  });

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (formData.title.trim().length < 3) {
      newErrors.title = 'Title must be at least 3 characters long.';
    }
    if (formData.title.trim().length > 100) {
      newErrors.title = 'Title must be less than 100 characters.';
    }
    if (formData.capacity < 1 || formData.capacity > 100) {
      newErrors.capacity = 'Capacity must be between 1 and 100 trainees.';
    }
    if (formData.duration < 1 || formData.duration > 500) {
      newErrors.duration = 'Duration must be between 1 and 500 hours.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleOpenModal = (course?: Course) => {
    setErrors({});
    if (course) {
      setEditingCourse(course);
      setFormData({
        title: course.title,
        category: course.category,
        duration: course.duration,
        capacity: course.capacity,
      });
    } else {
      setEditingCourse(null);
      setFormData({
        title: '',
        category: 'Safety',
        duration: 0,
        capacity: 0,
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    if (editingCourse) {
      setCourses(courses.map(c => c.id === editingCourse.id ? { ...c, ...formData } : c));
    } else {
      const newCourse: Course = {
        id: Math.random().toString(36).substr(2, 9),
        ...formData,
        enrolled: 0,
        successRate: 0,
        nextSchedule: new Date().toISOString().split('T')[0],
      };
      setCourses([...courses, newCourse]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this module?')) {
      setCourses(courses.filter(c => c.id !== id));
    }
  };

  const filteredCourses = courses.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         c.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDuration = c.duration >= filters.minDuration;
    const matchesCapacity = c.capacity >= filters.minCapacity;
    const matchesSuccess = c.successRate >= filters.minSuccessRate;
    
    return matchesSearch && matchesDuration && matchesCapacity && matchesSuccess;
  });

  if (selectedCourse) {
    return (
      <div className="space-y-8">
        <button 
          onClick={() => setSelectedCourse(null)}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-medium transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Modules
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
              <div className="flex items-start justify-between mb-6">
                <div className="space-y-1">
                  <div className={cn(
                    "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-2",
                    selectedCourse.category === 'Safety' && "bg-emerald-50 text-emerald-600",
                    selectedCourse.category === 'Technical' && "bg-blue-50 text-blue-600",
                    selectedCourse.category === 'Operational' && "bg-amber-50 text-amber-600",
                  )}>
                    {selectedCourse.category === 'Safety' && <Shield className="w-3 h-3" />}
                    {selectedCourse.category === 'Technical' && <Cog className="w-3 h-3" />}
                    {selectedCourse.category === 'Operational' && <Anchor className="w-3 h-3" />}
                    {selectedCourse.category}
                  </div>
                  <h2 className="text-3xl font-bold text-slate-900">{selectedCourse.title}</h2>
                </div>
                <button 
                  onClick={() => handleOpenModal(selectedCourse)}
                  className="p-3 bg-slate-50 text-slate-600 rounded-xl hover:bg-slate-100 transition-colors"
                >
                  <Edit2 className="w-5 h-5" />
                </button>
              </div>

              <p className="text-slate-600 leading-relaxed mb-8">
                This module focuses on the core competencies required for {selectedCourse.title.toLowerCase()} in maritime operations. 
                It covers theoretical knowledge and practical simulator-based training as per NMP standards.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Duration</p>
                  <div className="flex items-center gap-2 text-slate-900 font-bold">
                    <Clock className="w-4 h-4 text-emerald-500" />
                    {selectedCourse.duration} Hours
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Max Capacity</p>
                  <div className="flex items-center gap-2 text-slate-900 font-bold">
                    <Users className="w-4 h-4 text-blue-500" />
                    {selectedCourse.capacity} Trainees
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Success Rate</p>
                  <div className="flex items-center gap-2 text-slate-900 font-bold">
                    <TrendingUp className="w-4 h-4 text-emerald-500" />
                    {selectedCourse.successRate}%
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Next Schedule</p>
                  <div className="flex items-center gap-2 text-slate-900 font-bold">
                    <Calendar className="w-4 h-4 text-amber-500" />
                    {selectedCourse.nextSchedule}
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Chart Placeholder */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-6">Historical Performance</h3>
              <div className="h-64 bg-slate-50 rounded-2xl border border-dashed border-slate-200 flex items-center justify-center">
                <p className="text-slate-400 font-medium">Performance analytics visualization will be displayed here.</p>
              </div>
            </div>

            {/* AI Recommendations */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2 mb-6">
                <Zap className="w-5 h-5 text-amber-500" />
                <h3 className="text-lg font-bold text-slate-900">AI Recommended Modules</h3>
              </div>
              
              {isLoadingRecommendations ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-20 bg-slate-50 rounded-2xl animate-pulse" />
                  ))}
                </div>
              ) : recommendations.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {recommendations.map((rec, idx) => (
                    <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-emerald-200 transition-colors group">
                      <h4 className="font-bold text-slate-900 mb-1 group-hover:text-emerald-600 transition-colors">{rec.title}</h4>
                      <p className="text-xs text-slate-500 leading-relaxed">{rec.reason}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-400 text-sm italic">No recommendations available at this time.</p>
              )}
            </div>

            {/* AI Risk Analysis */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2 mb-6">
                <AlertCircle className="w-5 h-5 text-rose-500" />
                <h3 className="text-lg font-bold text-slate-900">AI Risk Analysis</h3>
              </div>

              {isLoadingRisks ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-24 bg-slate-50 rounded-2xl animate-pulse" />
                  ))}
                </div>
              ) : risks.length > 0 ? (
                <div className="space-y-4">
                  {risks.map((risk, idx) => (
                    <div key={idx} className="flex gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <div className={cn(
                        "mt-1 w-2 h-2 rounded-full shrink-0",
                        risk.severity === 'High' && "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]",
                        risk.severity === 'Medium' && "bg-amber-500",
                        risk.severity === 'Low' && "bg-blue-500",
                      )} />
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-slate-900">{risk.title}</h4>
                          <span className={cn(
                            "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider",
                            risk.severity === 'High' && "bg-rose-100 text-rose-600",
                            risk.severity === 'Medium' && "bg-amber-100 text-amber-600",
                            risk.severity === 'Low' && "bg-blue-100 text-blue-600",
                          )}>
                            {risk.severity} Risk
                          </span>
                        </div>
                        <p className="text-sm text-slate-500 leading-relaxed">{risk.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-400 text-sm italic">No risks identified for this module.</p>
              )}
            </div>

            {/* Trainee Completion Status */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-emerald-600" />
                  <h3 className="text-lg font-bold text-slate-900">Enrolled Trainees Progress</h3>
                </div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  {traineeStatuses.filter(s => s.courseId === selectedCourse.id).length} Enrolled
                </span>
              </div>

              <div className="space-y-4">
                {traineeStatuses.filter(s => s.courseId === selectedCourse.id).length > 0 ? (
                  traineeStatuses
                    .filter(s => s.courseId === selectedCourse.id)
                    .map((status) => (
                      <div key={status.traineeId} className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-xs">
                              {status.traineeName.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-slate-900">{status.traineeName}</p>
                              <p className="text-[10px] text-slate-500 uppercase tracking-wider">ID: {status.traineeId}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-bold text-slate-900">{status.completionPercentage}%</p>
                            {status.completionDate && (
                              <p className="text-[10px] text-emerald-600 font-medium">Completed: {status.completionDate}</p>
                            )}
                          </div>
                        </div>
                        <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${status.completionPercentage}%` }}
                            className={cn(
                              "h-full rounded-full",
                              status.completionPercentage === 100 ? "bg-emerald-500" : "bg-blue-500"
                            )}
                          />
                        </div>
                      </div>
                    ))
                ) : (
                  <div className="text-center py-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                    <p className="text-slate-400 text-sm">No trainees currently enrolled in this module.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-6">Enrolled Trainees</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold">
                      {selectedCourse.enrolled}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">Current Batch</p>
                      <p className="text-xs text-slate-500">Active enrollments</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-slate-900">{Math.round((selectedCourse.enrolled / selectedCourse.capacity) * 100)}%</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Utilization</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
                    <span>Progress to Capacity</span>
                    <span>{selectedCourse.enrolled}/{selectedCourse.capacity}</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-emerald-500 transition-all duration-500" 
                      style={{ width: `${(selectedCourse.enrolled / selectedCourse.capacity) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-emerald-600 p-8 rounded-3xl text-white shadow-lg shadow-emerald-500/20">
              <Zap className="w-8 h-8 mb-4" />
              <h3 className="text-lg font-bold mb-2">AI Optimization</h3>
              <p className="text-emerald-50/80 text-sm leading-relaxed mb-6">
                Gemini AI suggests increasing the capacity for this module based on high demand trends in the maritime sector.
              </p>
              <button className="w-full py-3 bg-white text-emerald-600 rounded-xl font-bold hover:bg-emerald-50 transition-colors">
                Apply AI Suggestions
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Training Modules</h2>
          <p className="text-slate-500">Manage and configure NMP course modules and training requirements.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-500/20"
        >
          <Plus className="w-4 h-4" />
          Add New Module
        </button>
      </div>

      {/* Filters & Search */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search modules by title or category..." 
              className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              "flex items-center gap-2 px-4 py-3 border rounded-xl font-medium transition-all",
              showFilters 
                ? "bg-emerald-50 border-emerald-200 text-emerald-600 shadow-sm" 
                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
            )}
          >
            <Filter className="w-5 h-5" />
            {showFilters ? 'Hide Filters' : 'More Filters'}
          </button>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-slate-50 border border-slate-200 rounded-2xl">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center justify-between">
                    Min Duration (Hrs)
                    <span className="text-emerald-600">{filters.minDuration}h</span>
                  </label>
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    step="5"
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                    value={filters.minDuration}
                    onChange={(e) => setFilters({ ...filters, minDuration: parseInt(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center justify-between">
                    Min Capacity
                    <span className="text-blue-600">{filters.minCapacity}</span>
                  </label>
                  <input 
                    type="range" 
                    min="0" 
                    max="50" 
                    step="5"
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    value={filters.minCapacity}
                    onChange={(e) => setFilters({ ...filters, minCapacity: parseInt(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center justify-between">
                    Min Success Rate
                    <span className="text-amber-600">{filters.minSuccessRate}%</span>
                  </label>
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    step="5"
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
                    value={filters.minSuccessRate}
                    onChange={(e) => setFilters({ ...filters, minSuccessRate: parseInt(e.target.value) })}
                  />
                </div>
                <div className="md:col-span-3 flex justify-end">
                  <button 
                    onClick={() => setFilters({ minDuration: 0, minCapacity: 0, minSuccessRate: 0 })}
                    className="text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors uppercase tracking-widest"
                  >
                    Reset Filters
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <motion.div 
            layout
            key={course.id} 
            className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={cn(
                "p-3 rounded-xl",
                course.category === 'Safety' && "bg-emerald-50 text-emerald-600",
                course.category === 'Technical' && "bg-blue-50 text-blue-600",
                course.category === 'Operational' && "bg-amber-50 text-amber-600",
              )}>
                {course.category === 'Safety' && <Shield className="w-6 h-6" />}
                {course.category === 'Technical' && <Cog className="w-6 h-6" />}
                {course.category === 'Operational' && <Anchor className="w-6 h-6" />}
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => handleOpenModal(course)}
                  className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-blue-600 transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleDelete(course.id)}
                  className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <h3 className="text-lg font-bold text-slate-900 mb-1">{course.title}</h3>
            <span className={cn(
              "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full",
              course.category === 'Safety' && "bg-emerald-50 text-emerald-600",
              course.category === 'Technical' && "bg-blue-50 text-blue-600",
              course.category === 'Operational' && "bg-amber-50 text-amber-600",
            )}>
              {course.category}
            </span>

            <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-400" />
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Duration</p>
                  <p className="text-sm font-bold text-slate-700">{course.duration} Hours</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-slate-400" />
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Capacity</p>
                  <p className="text-sm font-bold text-slate-700">{course.capacity} Trainees</p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between">
              <button 
                onClick={() => setSelectedCourse(course)}
                className="text-xs font-bold text-emerald-600 hover:text-emerald-700 transition-colors"
              >
                View Details
              </button>
              <div className="flex items-center gap-1 text-xs font-bold text-emerald-600">
                <CheckCircle2 className="w-3 h-3" />
                {course.successRate}% Success
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    {editingCourse ? 'Edit Module' : 'Add New Module'}
                  </h3>
                  <p className="text-sm text-slate-500">Enter the details for the training module.</p>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-slate-200 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Module Title</label>
                  <input 
                    required
                    type="text" 
                    placeholder="e.g. Advanced Firefighting"
                    className={cn(
                      "w-full px-4 py-3 bg-slate-50 border rounded-xl outline-none focus:ring-2 transition-all",
                      errors.title ? "border-red-500 focus:ring-red-500/20" : "border-slate-200 focus:ring-emerald-500/20"
                    )}
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                  {errors.title && (
                    <p className="text-xs text-red-500 font-medium flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.title}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Category</label>
                    <select 
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value as Course['category'] })}
                    >
                      <option value="Safety">Safety</option>
                      <option value="Technical">Technical</option>
                      <option value="Operational">Operational</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Capacity</label>
                    <input 
                      required
                      type="number" 
                      placeholder="e.g. 20"
                      className={cn(
                        "w-full px-4 py-3 bg-slate-50 border rounded-xl outline-none focus:ring-2 transition-all",
                        errors.capacity ? "border-red-500 focus:ring-red-500/20" : "border-slate-200 focus:ring-emerald-500/20"
                      )}
                      value={formData.capacity || ''}
                      onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 0 })}
                    />
                    {errors.capacity && (
                      <p className="text-xs text-red-500 font-medium flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.capacity}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Duration (Hours)</label>
                  <input 
                    required
                    type="number" 
                    placeholder="e.g. 40"
                    className={cn(
                      "w-full px-4 py-3 bg-slate-50 border rounded-xl outline-none focus:ring-2 transition-all",
                      errors.duration ? "border-red-500 focus:ring-red-500/20" : "border-slate-200 focus:ring-emerald-500/20"
                    )}
                    value={formData.duration || ''}
                    onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 0 })}
                  />
                  {errors.duration && (
                    <p className="text-xs text-red-500 font-medium flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.duration}
                    </p>
                  )}
                </div>

                <div className="pt-4 flex gap-4">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-6 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-500/20"
                  >
                    {editingCourse ? 'Save Changes' : 'Create Module'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
