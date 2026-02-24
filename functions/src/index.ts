import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { VertexAI } from '@google-cloud/vertexai';

admin.initializeApp();
const db = admin.firestore();

const PROJECT_ID = process.env.GCP_PROJECT || 'cs-poc-rlwc9pihxctoazqsylrl3ka';
const vertexai = new VertexAI({ project: PROJECT_ID, location: 'us-central1' });
const gemini = vertexai.getGenerativeModel({ model: 'gemini-2.0-flash-001' });

/**
 * Triggered when a new submission is created in Firestore.
 * Runs the full AI processing pipeline:
 * 1. Update status to ai_processing
 * 2. Parse content with Gemini (extract text, reference IDs)
 * 3. Summarize content with Gemini
 * 4. Assess risk with Gemini (legal compliance prompt)
 * 5. Update submission with results and set status to in_review
 */
export const processSubmission = functions.firestore
  .document('submissions/{submissionId}')
  .onCreate(async (snap, context) => {
    const submissionId = context.params.submissionId;
    const data = snap.data();

    console.log(`Processing submission: ${submissionId}`);

    try {
      // Step 1: Mark as processing
      await db.collection('submissions').doc(submissionId).update({
        status: 'ai_processing',
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      // Step 2: Parse content — for now use the title and file names as context
      // In production, read file content from Cloud Storage
      const contentContext = `
Title: ${data.title}
Content Type: ${data.contentType}
Files: ${data.fileNames?.join(', ') || 'none'}
      `.trim();

      // Step 3: Extract reference IDs
      const parseResult = await gemini.generateContent(
        `Extract any reference IDs, job numbers, or campaign IDs from this content. ` +
        `If found, return just the ID. If not found, return "AUTO-${submissionId.substring(0, 8).toUpperCase()}".\n\n${contentContext}`
      );
      const referenceId = parseResult.response.candidates?.[0]?.content?.parts?.[0]?.text?.trim()
        || `AUTO-${submissionId.substring(0, 8).toUpperCase()}`;

      // Step 4: Summarize
      const summaryResult = await gemini.generateContent(
        `You are a legal compliance assistant for Canadian financial services. ` +
        `Summarize this marketing content in 3-5 sentences for a legal reviewer. ` +
        `Focus on what's being promoted, key claims, and potential compliance areas.\n\n${contentContext}`
      );
      const aiSummary = summaryResult.response.candidates?.[0]?.content?.parts?.[0]?.text || '';

      // Step 5: Risk assessment
      const riskResult = await gemini.generateContent(
        `You are a Canadian financial services legal compliance expert with knowledge of PIPEDA, OSFI, ` +
        `Ad Standards Canada, CASL, and provincial securities regulations.\n\n` +
        `Analyze this marketing content for compliance risks and respond in JSON:\n` +
        `{"riskScore":"high|medium|low","riskFactors":[{"category":"...","description":"...","regulation":"...","severity":"high|medium|low"}]}\n\n` +
        `Content:\n${contentContext}`
      );
      const riskText = riskResult.response.candidates?.[0]?.content?.parts?.[0]?.text || '';

      let riskScore = 'medium';
      let riskFactors: unknown[] = [];
      try {
        const jsonMatch = riskText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          riskScore = parsed.riskScore || 'medium';
          riskFactors = parsed.riskFactors || [];
        }
      } catch {
        console.warn('Could not parse risk assessment JSON, using defaults');
      }

      // Step 6: Update submission with all results
      await db.collection('submissions').doc(submissionId).update({
        referenceId: referenceId.substring(0, 30),
        aiSummary,
        riskScore,
        riskFactors,
        status: 'in_review',
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      // Step 7: Create initial chat message
      await db.collection('chatSessions').doc(submissionId).set({
        submissionId,
        messages: [
          {
            id: `msg-${Date.now()}`,
            role: 'assistant',
            content: `I've analyzed the submitted content "${data.title}". Here's my assessment:\n\n` +
              `**Summary:** ${aiSummary}\n\n` +
              `**Risk Level:** ${riskScore.toUpperCase()}\n` +
              `**Risk Factors:** ${riskFactors.length} identified\n\n` +
              `How can I help with your review?`,
            timestamp: new Date().toISOString(),
          },
        ],
      });

      console.log(`Submission ${submissionId} processed. Risk: ${riskScore}, Factors: ${riskFactors.length}`);
    } catch (error) {
      console.error(`Error processing submission ${submissionId}:`, error);
      // Don't leave it stuck in ai_processing
      await db.collection('submissions').doc(submissionId).update({
        status: 'in_review',
        aiSummary: 'AI processing encountered an error. Please review manually.',
        riskScore: 'medium',
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    }
  });

/**
 * Triggered when a document is added to the RAG repository.
 * Processes the document for embedding (placeholder for Vertex AI Vector Search).
 */
export const processRAGDocument = functions.firestore
  .document('ragDocuments/{docId}')
  .onCreate(async (snap, context) => {
    const docId = context.params.docId;
    console.log(`Processing RAG document: ${docId}`);

    try {
      // In production: read file, chunk it, generate embeddings via Vertex AI,
      // and store in Vertex AI Vector Search index.
      // For now, mark as indexed after a brief processing simulation.
      await new Promise((resolve) => setTimeout(resolve, 2000));

      await db.collection('ragDocuments').doc(docId).update({
        status: 'indexed',
      });

      console.log(`RAG document ${docId} indexed successfully`);
    } catch (error) {
      console.error(`Error processing RAG document ${docId}:`, error);
      await db.collection('ragDocuments').doc(docId).update({
        status: 'error',
      });
    }
  });
