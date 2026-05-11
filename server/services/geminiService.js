const defaultGeminiModel = 'gemini-2.5-flash';

export async function generateWithGemini(prompt, mockResponse) {
  const apiKey = process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_MODEL || defaultGeminiModel;

  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    return {
      source: 'mock',
      text: formatMockResponse(mockResponse),
    };
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        temperature: 0.4,
        maxOutputTokens: 900,
      },
    }),
    },
  );

  if (!response.ok) {
    const errorBody = await response.text();
    throw createServiceError(
      `Gemini request failed for model ${model}. Check the API key, model, and request payload.`,
      response.status,
      errorBody,
    );
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) {
    throw createServiceError('Gemini returned an empty response.', 502);
  }

  return {
    source: 'gemini',
    text,
  };
}

function formatMockResponse({ mockTitle, mockBody }) {
  if (mockBody.trim().startsWith('{')) {
    return mockBody;
  }

  return `${mockTitle}\n\n${mockBody}\n\nSource: Mock response. Add GEMINI_API_KEY to .env to use Gemini.`;
}

function createServiceError(message, statusCode = 500, details) {
  const error = new Error(message);
  error.statusCode = statusCode;
  error.details = details;
  return error;
}
