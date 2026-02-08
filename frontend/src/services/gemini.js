// Gemini API service for validating code submissions

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
// Using gemini-2.5-flash as requested by the user
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

export async function validateCodeWithGemini(code, problemTitle, problemDescription, expectedSolution) {
    try {
        const prompt = `You are a Java code evaluator.

PROBLEM: ${problemTitle}
DESCRIPTION: ${problemDescription.replace(/<[^>]*>/g, '').slice(0, 500)}...

STUDENT CODE:
\`\`\`java
${code}
\`\`\`

EXPECTED SOLUTION:
\`\`\`java
${expectedSolution || 'Not provided'}
\`\`\`

TASK: Simulate the execution of the student's code.
NOTE: The student may define a 'public static void main' method to run tests, OR a 'solve' method matching the problem. 
- If the code has a 'main' method that prints the correct output for the test cases, mark it as CORRECT.
- If the code has a method (like 'solve') that returns the correct value, mark it as CORRECT.
- Do NOT require a specific method name unless the problem description strictly says so.
- If the class is empty, return logic missing error.

RESPONSE FORMAT (Strict JSON only):
{
  "isCorrect": boolean,
  "compilationError": "Error message if code fails to compile, else null",
  "score": 0-100,
  "feedback": "Short feedback",
  "testCaseResults": [
    {
      "input": "...",
      "expected": "...",
      "actualOutput": "What the code actually printed/returned",
      "passed": boolean
    }
  ]
}`;

        const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: { temperature: 0.1 } // Lower temperature for more deterministic JSON
            })
        });

        if (!response.ok) {
            throw new Error(`Gemini API error: ${response.status}`);
        }

        const data = await response.json();
        const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!textResponse) throw new Error('No response from Gemini');

        // Robust JSON extraction
        let jsonStr = textResponse;
        const startIndex = textResponse.indexOf('{');
        const endIndex = textResponse.lastIndexOf('}');

        if (startIndex !== -1 && endIndex !== -1) {
            jsonStr = textResponse.substring(startIndex, endIndex + 1);
        } else {
            // If no braces, it might be raw text failure
            throw new Error("Invalid response format. Raw: " + textResponse.substring(0, 50));
        }

        try {
            return JSON.parse(jsonStr);
        } catch (e) {
            // Attempt to fix common JSON issues (newlines in strings) before failing
            try {
                return JSON.parse(jsonStr.replace(/\n/g, "\\n"));
            } catch (e2) {
                console.error("JSON Parse Error:", jsonStr);
                throw new Error("AI response was not valid JSON.");
            }
        }

    } catch (error) {
        console.error('Gemini error:', error);
        return {
            isCorrect: false,
            score: 0,
            feedback: `Error: ${error.message}`,
            testCaseResults: []
        };
    }
}

export default { validateCodeWithGemini };
