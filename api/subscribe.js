// Serverless function for MailerLite integration
// This can be deployed on Netlify Functions, Vercel API, or any serverless platform

// Environment variables you'll need to set:
// MAILERLITE_API_TOKEN=your_mailerlite_api_token (the JWT token you provided)
// MAILERLITE_GROUP_ID=your_group_id (optional, for adding to specific group)

export default async function handler(req, res) {
  // Handle CORS for browser requests
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, name, company, gdpr_consent } = req.body;

    // Validate required fields
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    if (!gdpr_consent) {
      return res.status(400).json({ error: 'GDPR consent is required' });
    }

    // Prepare subscriber data for MailerLite (new API format)
    const subscriberData = {
      email: email,
      fields: {},
      groups: [], // Will add group ID if provided
      status: 'active', // Set to active since they've consented
      subscribed_at: new Date().toISOString()
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
    subscriberData.fields.signup_date = new Date().toISOString().split('T')[0]; // Date only

    // Add to group if specified
    if (process.env.MAILERLITE_GROUP_ID) {
      subscriberData.groups.push(process.env.MAILERLITE_GROUP_ID);
    }

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

    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    return res.status(200).json({ 
      success: true, 
      message: 'Successfully added to waiting list!',
      subscriber_id: responseData.data?.id 
    });

  } catch (error) {
    console.error('Subscription error:', error);
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    return res.status(500).json({ 
      error: 'Failed to subscribe. Please try again later.' 
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