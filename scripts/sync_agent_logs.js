const fs = require('fs');
const path = require('path');

const TRANSCRIPT_PATH = process.env.TRANSCRIPT_PATH || 'C:\\Users\\hp\\.gemini\\antigravity\\brain\\f9400c44-a09f-4c44-893d-ddc1dbd8fd9b\\.system_generated\\logs\\transcript.jsonl';
const OUTPUT_DIR = path.join(__dirname, '..', '.agent-logs');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

function syncLogs() {
  if (!fs.existsSync(TRANSCRIPT_PATH)) {
    console.log('Transcript file not found at:', TRANSCRIPT_PATH);
    return;
  }

  const fileContent = fs.readFileSync(TRANSCRIPT_PATH, 'utf8');
  const lines = fileContent.trim().split('\n').filter(Boolean);

  let promptCount = 0;
  let responseCount = 0;
  let logContent = '';
  let firstPromptTime = '';
  let lastPromptTime = '';
  let sessionId = 'f9400c44-a09f-4c44-893d-ddc1dbd8fd9b';

  const entries = [];

  for (const line of lines) {
    try {
      const data = JSON.parse(line);
      const timestamp = data.created_at || new Date().toISOString();

      if (data.type === 'USER_INPUT' && data.content) {
        promptCount++;
        if (!firstPromptTime) firstPromptTime = timestamp;
        lastPromptTime = timestamp;

        // Clean user content tag if present
        let content = data.content;
        content = content.replace(/^<USER_REQUEST>\s*/, '').replace(/\s*<\/USER_REQUEST>.*$/s, '');

        entries.push({
          type: 'PROMPT',
          num: promptCount,
          timestamp,
          content
        });
      } else if (data.type === 'PLANNER_RESPONSE') {
        responseCount++;
        // Use text content or thinking summary if text is empty
        let content = data.content || (data.thinking ? data.thinking.replace(/^[\S\s]*?\n\n/, '') : 'Executed turn.');
        entries.push({
          type: 'RESPONSE',
          num: promptCount,
          timestamp,
          content
        });
      }
    } catch (e) {
      // Ignore parse errors on trailing partial lines
    }
  }

  const header = `---
session_id: ${sessionId}
date: 2026-09-29
author: 8x-candidate
model: gemini-3.6-flash-high
tool: antigravity
project: fathom-ai-rebuild
total_exchanges: ${promptCount}
first_prompt_time: ${firstPromptTime}
last_prompt_time: ${lastPromptTime}
---

# Session Log - 2026-09-29

Session: \`${sessionId.substring(0, 8)}\` | Project: \`fathom-ai-rebuild\` | Author: \`8x-candidate\`

---
`;

  let body = '';
  for (const entry of entries) {
    body += `\n[LOG_ENTRY type=${entry.type} num=${entry.num} session=${sessionId.substring(0, 8)}]\ntimestamp: ${entry.timestamp}\nmodel: gemini-3.6-flash-high\n\n${entry.content}\n\n`;
  }

  const outputFile = path.join(OUTPUT_DIR, `2026-09-29_23-08-14_${sessionId}.md`);
  fs.writeFileSync(outputFile, header + body, 'utf8');
  console.log(`Synced ${entries.length} log entries to ${outputFile}`);
}

syncLogs();
