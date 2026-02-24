import { VertexAI } from '@google-cloud/vertexai';

const PROJECT_ID = process.env.GCP_PROJECT_ID || 'cs-poc-rlwc9pihxctoazqsylrl3ka';
const LOCATION = process.env.GCP_REGION || 'us-central1';

const vertexai = new VertexAI({ project: PROJECT_ID, location: LOCATION });

const geminiModel = vertexai.getGenerativeModel({
  model: 'gemini-2.0-flash-001',
});

/** Parse content and extract reference IDs, content type, and text */
export async function parseContent(text: string, fileName: string): Promise<{
  extractedText: string;
  referenceId: string;
  detectedContentType: string;
}> {
  const prompt = `You are a content parser for a financial services marketing compliance platform in Canada.

Analyze the following content from file "${fileName}" and extract:
1. The full readable text content
2. Any reference IDs, job numbers, campaign IDs, or project codes (look for patterns like MKT-XXXX, CAMP-XXXX, JOB-XXXX, or any alphanumeric tracking identifiers)
3. The content type category (one of: paid_search, landing_page, email, social, video_script, other)

Respond in this exact JSON format:
{
  "extractedText": "the full text content",
  "referenceId": "extracted ID or empty string",
  "detectedContentType": "one of the categories above"
}

Content:
${text.substring(0, 30000)}`;

  const result = await geminiModel.generateContent(prompt);
  const response = result.response;
  const responseText = response.candidates?.[0]?.content?.parts?.[0]?.text || '';

  try {
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch {
    // fallback
  }

  return {
    extractedText: text,
    referenceId: '',
    detectedContentType: 'other',
  };
}

/** Generate a summary of the content for legal reviewers */
export async function summarizeContent(text: string, contentType: string): Promise<string> {
  const prompt = `You are a legal compliance assistant for Canadian financial services marketing.

Summarize the following ${contentType} marketing content for a legal reviewer. Focus on:
- What the content is promoting
- Key claims or statements made
- Any financial products or services mentioned
- Potential areas that may need compliance review

Keep the summary concise (3-5 sentences).

Content:
${text.substring(0, 30000)}`;

  const result = await geminiModel.generateContent(prompt);
  const response = result.response;
  return response.candidates?.[0]?.content?.parts?.[0]?.text || 'Unable to generate summary.';
}

/** Assess compliance risk using Gemini with legal domain prompting
 *  (Replaces SaulLM-7B for cost efficiency — same interface, swap later) */
export async function assessRisk(text: string, contentType: string): Promise<{
  riskScore: 'high' | 'medium' | 'low';
  riskFactors: Array<{
    category: string;
    description: string;
    regulation: string;
    severity: 'high' | 'medium' | 'low';
  }>;
}> {
  const prompt = `You are a Canadian financial services legal compliance expert. You have deep knowledge of:
- PIPEDA (Personal Information Protection and Electronic Documents Act)
- OSFI Guidelines for financial institution advertising
- Provincial Securities Regulations (especially Ontario, BC, Alberta)
- Ad Standards Canada (Canadian Code of Advertising Standards)
- CASL (Canadian Anti-Spam Legislation)
- Cost of Borrowing Regulations
- CDIC advertising requirements

Analyze the following ${contentType} marketing content for compliance risks.

For each risk found, provide:
- category: short name (e.g., "Performance Claims", "Missing Disclaimers", "Privacy Concerns")
- description: specific explanation of the issue
- regulation: which regulation it violates
- severity: "high" (likely violation), "medium" (potential issue), or "low" (minor concern)

Also provide an overall risk score: "high" if any factor is high, "medium" if the highest is medium, "low" if all are low or none found.

Respond in this exact JSON format:
{
  "riskScore": "high|medium|low",
  "riskFactors": [
    {
      "category": "...",
      "description": "...",
      "regulation": "...",
      "severity": "high|medium|low"
    }
  ]
}

Content:
${text.substring(0, 30000)}`;

  const result = await geminiModel.generateContent(prompt);
  const response = result.response;
  const responseText = response.candidates?.[0]?.content?.parts?.[0]?.text || '';

  try {
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch {
    // fallback
  }

  return { riskScore: 'medium', riskFactors: [] };
}

/** Chat with the AI about a specific submission */
export async function chat(
  submissionContext: string,
  chatHistory: Array<{ role: string; content: string }>,
  userMessage: string
): Promise<string> {
  const historyText = chatHistory
    .map((m) => `${m.role === 'user' ? 'Reviewer' : 'AI'}: ${m.content}`)
    .join('\n');

  const prompt = `You are an AI legal compliance assistant for Canadian financial services marketing review.

You are helping a legal reviewer analyze a piece of marketing content. Here is the context:

${submissionContext}

Previous conversation:
${historyText}

The reviewer asks: ${userMessage}

Provide a helpful, specific response focusing on Canadian financial services compliance. Reference specific regulations (PIPEDA, OSFI, Ad Standards Canada, CASL, provincial securities regulations) when relevant.`;

  const result = await geminiModel.generateContent(prompt);
  const response = result.response;
  return response.candidates?.[0]?.content?.parts?.[0]?.text || 'Unable to generate response.';
}

/** Find relevant precedents from content text (for RAG matching) */
export async function generateEmbedding(text: string): Promise<number[]> {
  // Use Vertex AI text embedding for RAG similarity search
  const embeddingModel = vertexai.getGenerativeModel({
    model: 'text-embedding-005',
  });

  const result = await embeddingModel.generateContent(text.substring(0, 2048));
  // Note: For production RAG, use the dedicated Embeddings API
  // This is a simplified version; the full RAG pipeline uses Vertex AI Vector Search
  return [];
}
