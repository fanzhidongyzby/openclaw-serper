/**
 * Serper Plugin for OpenClaw
 * Google Serper API integration
 */

async function serperSearch(params) {
  const { query, num = 5, gl = 'cn', hl = 'zh-CN' } = params;

  // Get API key from environment variable
  const apiKey = process.env.SERPER_API_KEY;

  if (!apiKey) {
    throw new Error('SERPER_API_KEY environment variable is not set');
  }

  const data = JSON.stringify({
    q: query,
    num: Math.min(num, 20),
    gl: gl,
    hl: hl
  });

  return new Promise((resolve, reject) => {
    const req = require('https').request({
      hostname: 'google.serper.dev',
      path: '/search',
      method: 'POST',
      headers: {
        'X-API-KEY': apiKey,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    }, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(body);

          if (res.statusCode === 200) {
            // Format the response
            const formatted = {
              query: query,
              results: [],
              count: 0
            };

            if (result.organic) {
              formatted.results = result.organic.map(item => ({
                title: item.title,
                url: item.link,
                snippet: item.snippet
              }));
              formatted.count = formatted.results.length;
            }

            if (result.knowledgeGraph) {
              formatted.knowledge = {
                title: result.knowledgeGraph.title,
                description: result.knowledgeGraph.description,
                url: result.knowledgeGraph.descriptionLink
              };
            }

            resolve(formatted);
          } else {
            reject(new Error(`API Error: ${res.statusCode} - ${result.message || body}`));
          }
        } catch (e) {
          reject(new Error(`Failed to parse response: ${e.message}`));
        }
      });
    });

    req.on('error', (err) => {
      reject(new Error(`Request failed: ${err.message}`));
    });

    req.write(data);
    req.end();
  });
}

// OpenClaw plugin exports
export function register(context) {
  context.registerTool({
    name: 'serper_search',
    fn: serperSearch
  });
}

export function activate(context) {
  context.log('Serper plugin activated');
}

export function deactivate(context) {
  // Plugin deactivation logic
}