// ============================================================
// HIGHFIELD — image upload function
// The Staff Dashboard POSTs a single resized image here.
// It commits the image as its own file in the GitHub repo and
// returns a URL, so photos are NOT stored inside site-data.js
// (which keeps the content file small and under the publish limit).
// ============================================================

exports.handler = async function (event) {
  const CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers: CORS, body: '' };
  if (event.httpMethod !== 'POST') return { statusCode: 405, headers: CORS, body: 'Method not allowed' };

  const TOKEN = process.env.GITHUB_TOKEN;
  const REPO = process.env.GITHUB_REPO;
  const PASSWORD = process.env.STAFF_PASSWORD;
  if (!TOKEN || !REPO) return { statusCode: 500, headers: CORS, body: JSON.stringify({ error: 'Publishing is not configured yet.' }) };

  let payload;
  try { payload = JSON.parse(event.body); } catch (e) {
    return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'Bad request' }) };
  }
  if (PASSWORD && payload.password !== PASSWORD) {
    return { statusCode: 401, headers: CORS, body: JSON.stringify({ error: 'Wrong password.' }) };
  }

  const dataUrl = payload.dataUrl || '';
  const m = dataUrl.match(/^data:image\/([a-zA-Z0-9.+-]+);base64,(.+)$/);
  if (!m) return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'No image provided.' }) };
  const ext = (m[1].toLowerCase() === 'jpeg') ? 'jpg' : m[1].toLowerCase();
  const b64 = m[2];

  const name = 'images/uploads/hf-' + Date.now() + '-' + Math.random().toString(36).slice(2, 8) + '.' + ext;
  const api = 'https://api.github.com/repos/' + REPO + '/contents/' + name;
  const ghHeaders = {
    'Authorization': 'Bearer ' + TOKEN,
    'Accept': 'application/vnd.github+json',
    'User-Agent': 'highfield-dashboard'
  };

  try {
    const putRes = await fetch(api, {
      method: 'PUT',
      headers: Object.assign({ 'Content-Type': 'application/json' }, ghHeaders),
      body: JSON.stringify({ message: 'Add uploaded image', content: b64, branch: 'main' })
    });
    if (!putRes.ok) {
      const t = await putRes.text();
      return { statusCode: 502, headers: CORS, body: JSON.stringify({ error: 'GitHub rejected the image.', detail: t }) };
    }
    // Raw GitHub URL is available immediately (before the site rebuilds),
    // so the photo shows straight away in the dashboard and on the live site.
    const url = 'https://raw.githubusercontent.com/' + REPO + '/main/' + name;
    return { statusCode: 200, headers: CORS, body: JSON.stringify({ ok: true, url: url }) };
  } catch (e) {
    return { statusCode: 500, headers: CORS, body: JSON.stringify({ error: String(e) }) };
  }
};
