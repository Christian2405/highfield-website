// ============================================================
// HIGHFIELD — one-click publish function
// The Staff Dashboard POSTs the updated site content here.
// This commits js/site-data.js to the GitHub repo, which makes
// Netlify rebuild and the change go live for everyone.
//
// Netlify environment variables required (set in Netlify UI,
// Site configuration → Environment variables):
//   GITHUB_TOKEN   — a GitHub token with "Contents: write" on the repo
//   GITHUB_REPO    — e.g. "Christian2405/highfield-website"
//   STAFF_PASSWORD — must match the dashboard password
// ============================================================

exports.handler = async function (event) {
  const CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: CORS, body: '' };
  }
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: CORS, body: 'Method not allowed' };
  }

  const TOKEN = process.env.GITHUB_TOKEN;
  const REPO = process.env.GITHUB_REPO;
  const PASSWORD = process.env.STAFF_PASSWORD;

  if (!TOKEN || !REPO) {
    return { statusCode: 500, headers: CORS, body: JSON.stringify({ error: 'Publishing is not configured yet. Ask your web administrator to add the GitHub settings in Netlify.' }) };
  }

  let payload;
  try { payload = JSON.parse(event.body); } catch (e) {
    return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'Bad request' }) };
  }

  if (PASSWORD && payload.password !== PASSWORD) {
    return { statusCode: 401, headers: CORS, body: JSON.stringify({ error: 'Wrong password.' }) };
  }
  if (!payload.data) {
    return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'No content to publish.' }) };
  }

  const path = 'js/site-data.js';
  const fileText =
    '// ============================================================\n' +
    '// HIGHFIELD COUNTRY ESTATE — SITE CONTENT\n' +
    '// Published from the Staff Dashboard on ' + new Date().toISOString() + '\n' +
    '// ============================================================\n' +
    'window.SITE_DATA = ' + JSON.stringify(payload.data, null, 2) + ';\n';

  const api = 'https://api.github.com/repos/' + REPO + '/contents/' + path;
  const ghHeaders = {
    'Authorization': 'Bearer ' + TOKEN,
    'Accept': 'application/vnd.github+json',
    'User-Agent': 'highfield-dashboard'
  };

  try {
    let sha = undefined;
    const getRes = await fetch(api + '?ref=main', { headers: ghHeaders });
    if (getRes.ok) {
      const cur = await getRes.json();
      sha = cur.sha;
    }

    const contentB64 = Buffer.from(fileText, 'utf8').toString('base64');
    const putRes = await fetch(api, {
      method: 'PUT',
      headers: Object.assign({ 'Content-Type': 'application/json' }, ghHeaders),
      body: JSON.stringify({
        message: 'Update site content from Staff Dashboard',
        content: contentB64,
        sha: sha,
        branch: 'main'
      })
    });

    if (!putRes.ok) {
      const t = await putRes.text();
      return { statusCode: 502, headers: CORS, body: JSON.stringify({ error: 'GitHub rejected the update.', detail: t }) };
    }

    return { statusCode: 200, headers: CORS, body: JSON.stringify({ ok: true }) };
  } catch (e) {
    return { statusCode: 500, headers: CORS, body: JSON.stringify({ error: String(e) }) };
  }
};
