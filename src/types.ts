/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Trainee {
  id: string;
  name: string;
  rank: string;
  company: string;
  courses: string[];
  performanceScore: number; // 0-100
  completionRate: number; // 0-100
  certificationStatus: 'Certified' | 'Pending' | 'Expired';
  lastAssessmentDate: string;
  predictedOutcome?: string;
  riskLevel?: 'Low' | 'Medium' | 'High';
}

export interface TraineeCourseStatus {
  traineeId: string;
  courseId: string;
  traineeName: string;
  completionPercentage: number;
  completionDate?: string;
}

export interface Course {
  id: string;
  title: string;
  category: 'Safety' | 'Technical' | 'Operational';
  duration: number; // in hours
  capacity: number;
  enrolled: number;
  successRate: number;
  nextSchedule: string;
}

export interface Simulator {
  id: string;
  name: string;
  type: 'Bridge' | 'Engine' | 'GMDSS' | 'Liquid Cargo';
  status: 'Available' | 'In Use' | 'Maintenance';
  utilizationRate: number; // 0-100
  nextMaintenance: string;
}

export interface Assessment {
  id: string;
  traineeId: string;
  courseId: string;
  score: number;
  date: string;
  feedback: string;
}

export interface OptimizationInsight {
  type: 'Schedule' | 'Resource' | 'Performance';
  title: string;
  description: string;
  recommendation: string;
  impact: 'High' | 'Medium' | 'Low';
}
