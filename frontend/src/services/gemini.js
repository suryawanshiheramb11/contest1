// Gemini API service for validating code submissions

const GEMINI_API_KEY = 'AIzaSyAZJkKSpeDYo-9PfvLmWnR5h0UY1d3PSHU';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

export async function validateCodeWithGemini(code, problemTitle, problemDescription, expectedSolution) {
    try {
        const prompt = `You are a Java code evaluator for a coding assessment platform.

PROBLEM: ${problemTitle}

PROBLEM DESCRIPTION (summary):
${problemDescription.replace(/<[^>]*>/g, '').slice(0, 1000)}

STUDENT'S SUBMITTED CODE:
\`\`\`java
${code}
\`\`\`

EXPECTED SOLUTION (reference):
\`\`\`java
${expectedSolution || 'Not provided'}
\`\`\`

TASK: Evaluate the student's code and determine if it correctly solves the problem.

EVALUATION CRITERIA:
1. Does the code compile (syntactically correct Java)?
2. Does the algorithm logic appear correct?
3. Does it handle edge cases appropriately?
4. Would it produce correct output for typical test cases?

RESPOND IN THIS EXACT JSON FORMAT ONLY (no other text):
{
  "isCorrect": true/false,
  "score": 0-100,
  "feedback": "Brief explanation of why the solution is correct/incorrect",
  "suggestions": ["suggestion 1", "suggestion 2"] or [],
  "testCaseResults": [
    {"input": "example input", "expected": "expected output", "passed": true/false}
  ]
}`;

        const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }],
                generationConfig: {
                    temperature: 0.2,
                    topK: 40,
                    topP: 0.95,
                    maxOutputTokens: 1024,
                }
            })
        });

        if (!response.ok) {
            throw new Error(`Gemini API error: ${response.status}`);
        }

        const data = await response.json();

        // Extract the text response
        const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!textResponse) {
            throw new Error('No response from Gemini');
        }

        // Parse JSON from response (handle possible markdown code blocks)
        let jsonStr = textResponse;
        const jsonMatch = textResponse.match(/```json\s*([\s\S]*?)\s*```/);
        if (jsonMatch) {
            jsonStr = jsonMatch[1];
        } else {
            // Try to find JSON object directly
            const objectMatch = textResponse.match(/\{[\s\S]*\}/);
            if (objectMatch) {
                jsonStr = objectMatch[0];
            }
        }

        const result = JSON.parse(jsonStr);
        return result;

    } catch (error) {
        console.error('Gemini validation error:', error);

        // Return a fallback response
        return {
            isCorrect: false,
            score: 0,
            feedback: `Unable to validate code: ${error.message}. Please try again or check your code manually.`,
            suggestions: ['Make sure your code is syntactically correct', 'Verify your solution logic'],
            testCaseResults: [],
            error: true
        };
    }
}

export default { validateCodeWithGemini };
