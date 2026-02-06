/**
 * Serper Plugin for OpenClaw
 * Google Serper API integration (Web + Scholar)
 */

import { Type } from "@sinclair/typebox";
import type { OpenClawPluginApi } from "openclaw/plugin-sdk";
import { emptyPluginConfigSchema } from "openclaw/plugin-sdk";

console.log("[serper] Module loading - top level");

// ============ Helper ============

function json(data: unknown) {
  return {
    content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
    details: data,
  };
}

// ============ Serper Web Search ============

async function serperWebSearch(params: { query: string; num?: number; gl?: string; hl?: string }) {
  const { query, num = 5, gl = 'cn', hl = 'zh-CN' } = params;

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
            const formatted = {
              query: query,
              results: [],
              count: 0
            };

            if (result.organic) {
              formatted.results = result.organic.map((item: any) => ({
                title: item.title,
                url: item.link,
                snippet: item.snippet
              }));
              formatted.count = formatted.results.length;
            }

            if (result.knowledgeGraph) {
              (formatted as any).knowledge = {
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
          reject(new Error(`Failed to parse response: ${e instanceof Error ? e.message : String(e)}`));
        }
      });
    });

    req.on('error', (err) => {
      reject(new Error(`Request failed: ${err instanceof Error ? err.message : String(err)}`));
    });

    req.write(data);
    req.end();
  });
}

// ============ Serper Scholar Search ============

async function serperScholar(params: { query: string; num?: number; gl?: string; hl?: string }) {
  const { query, num = 10, gl = 'cn', hl = 'zh-CN' } = params;

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
      path: '/scholar',
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
            const formatted = {
              query: query,
              results: [],
              count: 0
            };

            if (result.organic) {
              formatted.results = result.organic.map((item: any) => ({
                title: item.title,
                url: item.link,
                snippet: item.snippet,
                type: item.type,
                year: item.year,
                authors: item.authors?.join(', '),
                publication: item.publication,
                citationCount: item.citationCount
              }));
              formatted.count = formatted.results.length;
            }

            resolve(formatted);
          } else {
            reject(new Error(`API Error: ${res.statusCode} - ${result.message || body}`));
          }
        } catch (e) {
          reject(new Error(`Failed to parse response: ${e instanceof Error ? e.message : String(e)}`));
        }
      });
    });

    req.on('error', (err) => {
      reject(new Error(`Request failed: ${err instanceof Error ? err.message : String(err)}`));
    });

    req.write(data);
    req.end();
  });
}

// ============ Plugin Definition ============

const serperPlugin = {
  id: "serper",
  name: "Serper",
  description: "Google Serper API plugin for OpenClaw (Web + Scholar search)",
  kind: "extension" as const,
  configSchema: emptyPluginConfigSchema(),
  register(api: OpenClawPluginApi) {
    console.log("[serper] Extension register() called");

    // Register serper_search tool
    console.log("[serper] Registering serper_search tool");
    api.registerTool(
      {
        name: "serper_search",
        label: "Serper Web Search",
        description: "Google Serper API web search",
        parameters: Type.Object({
          query: Type.String({ description: "Search query" }),
          num: Type.Optional(Type.Number({ description: "Number of results (max 20, default 5)" })),
          gl: Type.Optional(Type.String({ description: "Country code (default: cn)" })),
          hl: Type.Optional(Type.String({ description: "Language code (default: zh-CN)" })),
        }),
        async execute(_toolCallId, params) {
          console.log("[serper] serper_search called with params:", params);
          try {
            const result = await serperWebSearch(params as { query: string; num?: number; gl?: string; hl?: string });
            console.log("[serper] serper_search result:", result);
            return json(result);
          } catch (err) {
            console.error("[serper] serper_search error:", err);
            return json({ error: err instanceof Error ? err.message : String(err) });
          }
        },
      },
      { name: "serper_search" },
    );
    console.log("[serper] serper_search registered");

    // Register serper_scholar tool
    console.log("[serper] Registering serper_scholar tool");
    api.registerTool(
      {
        name: "serper_scholar",
        label: "Serper Scholar Search",
        description: "Google Serper API scholar search (academic papers)",
        parameters: Type.Object({
          query: Type.String({ description: "Search query for academic papers" }),
          num: Type.Optional(Type.Number({ description: "Number of results (max 20, default 10)" })),
          gl: Type.Optional(Type.String({ description: "Country code (default: cn)" })),
          hl: Type.Optional(Type.String({ description: "Language code (default: zh-CN)" })),
        }),
        async execute(_toolCallId, params) {
          console.log("[serper] serper_scholar called with params:", params);
          try {
            const result = await serperScholar(params as { query: string; num?: number; gl?: string; hl?: string });
            console.log("[serper] serper_scholar result:", result);
            return json(result);
          } catch (err) {
            console.error("[serper] serper_scholar error:", err);
            return json({ error: err instanceof Error ? err.message : String(err) });
          }
        },
      },
      { name: "serper_scholar" },
    );
    console.log("[serper] serper_scholar registered");
    console.log("[serper] All tools registered successfully");
  },
};

export default serperPlugin;