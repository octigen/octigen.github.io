export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Return test response
  return res.status(200).json({ 
    success: true, 
    message: 'API is working!',
    timestamp: new Date().toISOString(),
    method: req.method,
    env_check: {
      has_api_token: !!process.env.MAILERLITE_API_TOKEN,
      has_group_id: !!process.env.MAILERLITE_GROUP_ID
    }
  });
} 