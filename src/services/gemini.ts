/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI, Type } from "@google/genai";
import { Trainee, Course, Simulator, OptimizationInsight } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function getPredictiveInsights(
  trainees: Trainee[],
  courses: Course[]
): Promise<OptimizationInsight[]> {
  const model = "gemini-3-flash-preview";
  const prompt = `
    Analyze the following NMP (National Maritime Polytechnic) training data:
    Trainees: ${JSON.stringify(trainees.slice(0, 5))}
    Courses: ${JSON.stringify(courses.slice(0, 5))}

    Based on this data, provide 3 predictive insights regarding:
    1. Trainee performance trends.
    2. Course completion risks.
    3. Certification outcomes.

    Return the response as a JSON array of objects with the following structure:
    {
      "type": "Performance" | "Schedule" | "Resource",
      "title": string,
      "description": string,
      "recommendation": string,
      "impact": "High" | "Medium" | "Low"
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              type: { type: Type.STRING, enum: ["Performance", "Schedule", "Resource"] },
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              recommendation: { type: Type.STRING },
              impact: { type: Type.STRING, enum: ["High", "Medium", "Low"] }
            },
            required: ["type", "title", "description", "recommendation", "impact"]
          }
        }
      }
    });

    return JSON.parse(response.text || "[]");
  } catch (error) {
    console.error("Gemini Error:", error);
    return [];
  }
}

export async function getOptimizationStrategies(
  simulators: Simulator[],
  courses: Course[]
): Promise<OptimizationInsight[]> {
  const model = "gemini-3-flash-preview";
  const prompt = `
    Analyze the following NMP simulator and course data:
    Simulators: ${JSON.stringify(simulators)}
    Courses: ${JSON.stringify(courses)}

    Provide 3 optimization strategies for:
    1. Simulator utilization.
    2. Training schedule efficiency.
    3. Resource allocation.

    Return the response as a JSON array of objects with the following structure:
    {
      "type": "Resource" | "Schedule",
      "title": string,
      "description": string,
      "recommendation": string,
      "impact": "High" | "Medium" | "Low"
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              type: { type: Type.STRING, enum: ["Resource", "Schedule"] },
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              recommendation: { type: Type.STRING },
              impact: { type: Type.STRING, enum: ["High", "Medium", "Low"] }
            },
            required: ["type", "title", "description", "recommendation", "impact"]
          }
        }
      }
    });

    return JSON.parse(response.text || "[]");
  } catch (error) {
    console.error("Gemini Error:", error);
    return [];
  }
}
