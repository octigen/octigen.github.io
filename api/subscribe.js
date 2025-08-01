// Serverless function for MailerLite integration
// This can be deployed on Netlify Functions, Vercel API, or any serverless platform

// Environment variables you'll need to set:
// MAILERLITE_API_TOKEN=your_mailerlite_api_token (the JWT token you provided)
// MAILERLITE_GROUP_ID=your_group_id (optional, for adding to specific group)

export default async function handler(req, res) {
  // Set CORS headers for all requests
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept');
  res.setHeader('Access-Control-Max-Age', '86400');

  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Add some debugging
  console.log('API Request received:', {
    method: req.method,
    headers: req.headers,
    body: req.body
  });

  try {
    const { email, name, company, gdpr_consent } = req.body;

    // Validate required fields
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    if (!gdpr_consent) {
      return res.status(400).json({ error: 'GDPR consent is required' });
    }

    // Check if environment variables are set
    if (!process.env.MAILERLITE_API_TOKEN) {
      console.error('MAILERLITE_API_TOKEN environment variable not set');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    // Prepare subscriber data for MailerLite (new API format)
    const subscriberData = {
      email: email,
      fields: {},
      groups: [], // Will add group ID if provided
      status: 'unconfirmed' // Set to unconfirmed to trigger double opt-in
    };

    // Add name field if provided
    if (name) {
      subscriberData.fields.name = name;
    }

    // Add company field if provided  
    if (company) {
      subscriberData.fields.company = company;
    }

    // Add custom fields for waiting list tracking
    subscriberData.fields.source = 'waiting_list';

    // Add to group if specified
    if (process.env.MAILERLITE_GROUP_ID) {
      subscriberData.groups.push(process.env.MAILERLITE_GROUP_ID);
    }

    console.log('Sending to MailerLite:', subscriberData);

    // Call MailerLite API (new API endpoint)
    const response = await fetch('https://connect.mailerlite.com/api/subscribers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.MAILERLITE_API_TOKEN}`,
        'Accept': 'application/json'
      },
      body: JSON.stringify(subscriberData)
    });

    const responseData = await response.json();
    console.log('MailerLite response:', response.status, responseData);

    if (!response.ok) {
      console.error('MailerLite API error:', responseData);
      
      // Handle specific MailerLite errors
      if (response.status === 422 && responseData.errors) {
        // Validation errors
        const errorMessages = Object.values(responseData.errors).flat();
        return res.status(400).json({ 
          error: errorMessages.join(', ')
        });
      }

      if (response.status === 409) {
        // Subscriber already exists - this is actually okay for a waiting list
        return res.status(200).json({ 
          success: true, 
          message: 'Email already registered for waiting list updates',
          subscriber_id: responseData.data?.id || 'existing'
        });
      }

      throw new Error(`MailerLite API error: ${response.status}`);
    }
    
    return res.status(200).json({ 
      success: true, 
      message: 'Successfully added to waiting list!',
      subscriber_id: responseData.data?.id 
    });

  } catch (error) {
    console.error('Subscription error:', error);
    
    return res.status(500).json({ 
      error: 'Failed to subscribe. Please try again later.',
      details: error.message
    });
  }
}

// For Netlify Functions, use this export instead:
// exports.handler = async (event, context) => {
//   const req = {
//     method: event.httpMethod,
//     body: JSON.parse(event.body || '{}')
//   };
//   
//   const res = {
//     setHeader: () => {},
//     status: (code) => ({
//       json: (data) => ({
//         statusCode: code,
//         headers: {
//           'Access-Control-Allow-Origin': '*',
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(data)
//       }),
//       end: () => ({
//         statusCode: code,
//         headers: {
//           'Access-Control-Allow-Origin': '*'
//         },
//         body: ''
//       })
//     })
//   };
//   
//   return handler(req, res);
// }; 