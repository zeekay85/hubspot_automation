import { generateDocumentationResponse } from '../server/routes/aiRoutes.js';

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    return response.status(405).json({ error: 'Method not allowed.' });
  }

  try {
    const result = await generateDocumentationResponse(parseBody(request.body));
    return response.status(200).json(result);
  } catch (error) {
    const statusCode = error.statusCode || 500;

    if (statusCode >= 500) {
      console.error(error);
    }

    return response.status(statusCode).json({
      error: error.message || 'Something went wrong.',
    });
  }
}

function parseBody(body) {
  return typeof body === 'string' ? JSON.parse(body || '{}') : body;
}
