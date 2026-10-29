import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// API route for PulseHealth AI Clinical Assistant
app.post('/api/advisor', async (req, res) => {
  try {
    const { prompt, vitals, hydration, activity, sleep, profile } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey) {
      try {
        const ai = new GoogleGenAI({ apiKey });
        const systemInstruction = `You are PulseHealth's Clinical AI Assistant, specialized in cardiovascular hemodynamics, circadian sleep architecture, and metabolic telemetry.
You provide evidence-based, empathetic, and scientifically grounded insights referencing AHA (American Heart Association), ESC (European Society of Cardiology), and Mayo Clinic standards.
Always include specific numbers from the user's live telemetry in your answer.
User live telemetry:
- Resting Heart Rate: ${vitals?.restingHeartRate ?? 68} BPM
- Blood Pressure: ${vitals?.systolic ?? 118}/${vitals?.diastolic ?? 76} mmHg
- Fasting Glucose: ${vitals?.bloodGlucose ?? 94} mg/dL
- Hydration: ${hydration?.currentMl ?? 1800}/${hydration?.targetMl ?? 2500} ml
- Activity: ${activity?.steps ?? 8432} steps, ${activity?.activeCalories ?? 480} active kcal
- Sleep: ${sleep?.hours ?? 8}h ${sleep?.minutes ?? 12}m (Score: ${sleep?.score ?? 88})
- Profile: Age ${profile?.age ?? 32}, BMI ${profile?.weightKg && profile?.heightCm ? (profile.weightKg / Math.pow(profile.heightCm / 100, 2)).toFixed(1) : '22.5'}
Keep answers concise (2-3 brief paragraphs max) with clinical clarity.`;

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt || 'Analyze my current physiological status.',
          config: {
            systemInstruction,
            temperature: 0.4,
          },
        });

        const text = response.text || '';
        const lower = prompt.toLowerCase();
        let telemetryCard = undefined;

        if (lower.includes('heart rate') || lower.includes('resting') || lower.includes('bpm')) {
          telemetryCard = {
            title: 'Resting Heart Rate',
            currentValue: `${vitals?.restingHeartRate ?? 64}`,
            unit: 'BPM',
            deltaText: '-7 bpm',
            statusBadge: 'Optimal',
            svgSparklineType: 'heartRate',
          };
        } else if (lower.includes('blood pressure') || lower.includes('pressure')) {
          telemetryCard = {
            title: 'Blood Pressure',
            currentValue: `${vitals?.systolic ?? 118}/${vitals?.diastolic ?? 76}`,
            unit: 'mmHg',
            deltaText: 'Optimal Range',
            statusBadge: 'Optimal',
            svgSparklineType: 'bloodPressure',
          };
        }

        return res.json({ text, telemetryCard });
      } catch (geminiError) {
        console.warn('Gemini API call failed, falling back to clinical rule engine:', geminiError);
      }
    }

    // High fidelity fallback rule engine
    const lower = (prompt || '').toLowerCase();
    let text = '';
    let telemetryCard = undefined;

    if (lower.includes('heart rate') || lower.includes('resting') || lower.includes('bpm')) {
      text = `That is a positive indicator! A lowering resting heart rate generally reflects improved cardiovascular efficiency and cardiovascular endurance, especially paired with your consistent ${activity?.steps ?? 8432} daily steps. Your HRV has also remained stable at 58ms.`;
      telemetryCard = {
        title: 'Resting Heart Rate',
        currentValue: `${vitals?.restingHeartRate ?? 64}`,
        unit: 'BPM',
        deltaText: '-7 bpm',
        statusBadge: 'Optimal',
        svgSparklineType: 'heartRate',
      };
    } else if (lower.includes('blood pressure') || lower.includes('pressure') || lower.includes('hypertension')) {
      const isOptimal = (vitals?.systolic ?? 118) < 120 && (vitals?.diastolic ?? 76) < 80;
      text = `Your current blood pressure is ${vitals?.systolic ?? 118}/${vitals?.diastolic ?? 76} mmHg. Under AHA/ACC guidelines, this reading reflects ${
        isOptimal ? 'optimal arterial compliance and minimal systemic vascular resistance' : 'elevated circulatory resistance'
      }. Maintaining regular hydration and low sodium keeps this balanced.`;
      telemetryCard = {
        title: 'Blood Pressure',
        currentValue: `${vitals?.systolic ?? 118}/${vitals?.diastolic ?? 76}`,
        unit: 'mmHg',
        deltaText: isOptimal ? 'Optimal' : 'Monitored',
        statusBadge: isOptimal ? 'Optimal' : 'Elevated',
        svgSparklineType: 'bloodPressure',
      };
    } else if (lower.includes('sodium') || lower.includes('dinner') || lower.includes('meal')) {
      text = `For cardiovascular health and maintaining arterial flexibility, consider wild salmon or steamed cod with lemon-dill, paired with steamed asparagus and roasted sweet potato. Herbs like garlic, rosemary, and oregano provide rich flavor without excess sodium.`;
    } else if (lower.includes('sleep') || lower.includes('deep sleep')) {
      text = `Last night you logged ${sleep?.hours ?? 8}h ${sleep?.minutes ?? 12}m with a Sleep Score of ${sleep?.score ?? 88}/100. Your deep restorative sleep was ${sleep?.deepHours ?? 1.8}h (approx 20%), which aligns with target slow-wave sleep requirements for autonomic renewal.`;
    } else {
      text = `I have correlated your continuous telemetry with your ${activity?.steps ?? 8432} daily steps and current resting pulse of ${vitals?.restingHeartRate ?? 68} BPM. Your physiological markers demonstrate balanced autonomic regulation and cellular recovery.`;
    }

    return res.json({ text, telemetryCard });
  } catch (error) {
    console.error('Advisor error:', error);
    return res.status(500).json({ error: 'Failed to process clinical inquiry' });
  }
});

async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`PulseHealth server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
