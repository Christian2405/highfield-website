// ============================================================
// HIGHFIELD CMS RENDERER
// Renders editable content (awards, testimonials, news, gallery)
// from js/site-data.js. If the Staff Dashboard has unsaved
// draft changes in this browser, those are shown instead so the
// manager can preview before publishing.
// ============================================================
(function () {
  'use strict';

  function getData() {
    // The public website always shows the truly-published content, identical
    // for every visitor. (Editing/preview happens inside the Staff Dashboard.)
    return window.SITE_DATA || {};
  }

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  var data = getData();

  // ---------- EDITABLE PAGE TEXT ----------
  // Any element with data-edit="key" is overridden by data.pageText[key]
  if (data.pageText) {
    document.querySelectorAll('[data-edit]').forEach(function (el) {
      var key = el.getAttribute('data-edit');
      if (data.pageText[key] != null && data.pageText[key] !== '') {
        el.innerHTML = data.pageText[key];
      }
    });
  }

  // ---------- LIGHTBOX (used by award certificates) ----------
  window.hfShowLightbox = function (src) {
    var overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(19,32,56,0.92);z-index:9999;display:flex;align-items:center;justify-content:center;padding:2rem;cursor:zoom-out;';
    var img = document.createElement('img');
    img.src = src;
    img.style.cssText = 'max-width:95%;max-height:95%;box-shadow:0 20px 60px rgba(0,0,0,0.5);border-radius:3px;';
    var close = document.createElement('span');
    close.innerHTML = '&times;';
    close.style.cssText = 'position:absolute;top:1rem;right:1.5rem;color:white;font-size:3rem;line-height:1;cursor:pointer;font-family:sans-serif;';
    overlay.appendChild(img);
    overlay.appendChild(close);
    overlay.addEventListener('click', function () { document.body.removeChild(overlay); });
    document.addEventListener('keydown', function esc(e) {
      if (e.key === 'Escape' && overlay.parentNode) { document.body.removeChild(overlay); }
      document.removeEventListener('keydown', esc);
    });
    document.body.appendChild(overlay);
  };

  // ---------- AWARDS (index.html) ----------
  var awardsEl = document.getElementById('hf-awards');
  if (awardsEl && data.awards) {
    var html = '';
    data.awards.forEach(function (a, i) {
      if (a.image) {
        // Certificate image card
        html += '<div style="background: white; padding: 1.25rem; border-radius: 2px; text-align: center; flex: 1; min-width: 220px; max-width: 320px; border: 1px solid var(--border-light); display: flex; flex-direction: column; align-items: center; justify-content: center;">' +
          '<img src="' + esc(a.image) + '" alt="' + esc(a.title || 'Award certificate') + '" onclick="hfShowLightbox(this.src)" title="Click to enlarge" style="max-width: 100%; max-height: 280px; width: auto; height: auto; display: block; margin: 0 auto; cursor: zoom-in;">' +
          (a.detail ? '<p style="font-size: 0.8rem; color: var(--text-mid); margin: 0.75rem 0 0;">' + esc(a.detail) + '</p>' : '') +
          '</div>';
      } else if (i % 2 === 1) {
        // Light text card
        html += '<div style="background: white; padding: 2rem 2.5rem; border-radius: 2px; text-align: center; flex: 2; min-width: 300px; border: 1px solid var(--border-light);">' +
          '<p style="font-family: var(--font-serif); font-size: 1.8rem; color: var(--primary-green); margin-bottom: 0.5rem; line-height: 1;">' + esc(a.year) + '</p>' +
          '<p style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.15em; color: var(--text-mid); margin: 0;">' + esc(a.title) + '</p>' +
          '<p style="font-size: 0.85rem; color: var(--text-mid); margin-top: 0.75rem;">' + esc(a.detail) + '</p>' +
          '</div>';
      } else {
        // Dark text card
        html += '<div style="background: var(--primary-green); color: white; padding: 2rem 2.5rem; border-radius: 2px; text-align: center; flex: 1; min-width: 200px;">' +
          '<p style="font-family: var(--font-serif); font-size: 3rem; color: var(--gold); margin-bottom: 0.25rem; line-height: 1;">' + esc(a.year) + '</p>' +
          '<p style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.15em; color: rgba(255,255,255,0.9); margin: 0;">' + esc(a.title) + '</p>' +
          '<p style="font-size: 0.7rem; color: rgba(255,255,255,0.6); margin-top: 0.5rem;">' + esc(a.detail) + '</p>' +
          '</div>';
      }
    });
    awardsEl.innerHTML = html;
  }

  // ---------- TESTIMONIALS (testimonials.html) ----------
  var testEl = document.getElementById('hf-testimonials');
  if (testEl && data.testimonials) {
    var thtml = '';
    data.testimonials.forEach(function (t, i) {
      var last = i === data.testimonials.length - 1;
      thtml += '<div class="testimonial-card"' + (last ? '' : ' style="margin-bottom: 3rem;"') + '>' +
        '<blockquote>' + esc(t.quote) + '</blockquote>' +
        '<p class="testimonial-author">' + esc(t.author) + '</p>' +
        '</div>';
    });
    testEl.innerHTML = thtml;
  }

  // ---------- TEAM (testimonials.html) ----------
  var teamEl = document.getElementById('hf-team');
  if (teamEl && data.team) {
    teamEl.innerHTML = data.team.map(function (m) {
      return '<div class="team-member" onclick="this.classList.toggle(\'expanded\')" style="cursor:pointer;">' +
        '<div class="team-photo"><img src="' + esc(m.image) + '" alt="' + esc(m.name) + '" style="width:100%;height:100%;object-fit:cover;border-radius:50%;"></div>' +
        '<h3>' + esc(m.name) + '</h3>' +
        '<p>' + esc(m.role) + '</p>' +
        '<div class="team-bio">' +
        (m.bio ? '<p>' + esc(m.bio) + '</p>' : '') +
        (m.funfact ? '<p class="team-funfact"><strong>Fun fact:</strong> ' + esc(m.funfact) + '</p>' : '') +
        '</div></div>';
    }).join('');
  }

  // ---------- NEWS (news.html) ----------
  var newsEl = document.getElementById('hf-news');
  if (newsEl && data.news) {
    var news = data.news;
    var params = new URLSearchParams(window.location.search);
    var articleParam = params.get('article');

    if (articleParam !== null && news[articleParam]) {
      // ----- Single full-article page -----
      var n = news[articleParam];
      var paras = (n.paragraphs || []).filter(function (p) { return p; })
        .map(function (p) { return '<p style="font-size:1.02rem;line-height:1.8;margin-bottom:1.25rem;color:#444;">' + esc(p) + '</p>'; }).join('');
      newsEl.innerHTML =
        '<article style="max-width:760px;margin:0 auto;">' +
        '<a href="news.html" style="display:inline-block;margin-bottom:1.5rem;color:var(--gold);font-size:0.85rem;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;text-decoration:none;">&larr; Back to News</a>' +
        (n.image ? '<img src="' + esc(n.image) + '" alt="' + esc(n.title) + '" style="display:block;width:auto;max-width:100%;height:auto;margin:0 auto 1.75rem;border-radius:4px;">' : '') +
        '<span class="section-label">' + esc(n.category) + '</span>' +
        '<h1 style="font-family:var(--font-serif);color:var(--primary-green);font-size:clamp(1.9rem,4vw,2.7rem);margin:0.4rem 0 0.5rem;">' + esc(n.title) + '</h1>' +
        '<p style="color:var(--text-mid);font-size:0.9rem;margin-bottom:1.75rem;">' + esc(n.date) + '</p>' +
        paras +
        '<div style="margin-top:2rem;"><a href="contact.html" class="btn btn-outline">Get in Touch</a></div>' +
        '</article>';
      var titleEl = document.querySelector('title');
      if (titleEl) titleEl.textContent = n.title + ' — Highfield Country Estate';
      var headingEl = document.getElementById('hf-news-heading');
      if (headingEl) headingEl.style.display = 'none';
    } else {
      // ----- First 4 as the original feature-pair rows, then "Show more" reveals the rest in a grid -----
      function featurePair(n, i) {
        var reverse = i % 2 === 1 ? ' reverse' : '';
        var excerpt = ((n.paragraphs || [])[0] || '');
        if (excerpt.length > 260) excerpt = excerpt.slice(0, 260).replace(/\s+\S*$/, '') + '…';
        return '<a href="news.html?article=' + i + '" class="feature-pair' + reverse + '" style="margin-bottom: 4rem; text-decoration:none; color:inherit;">' +
          '<div class="feature-image"><img src="' + esc(n.image) + '" alt="' + esc(n.title) + '"></div>' +
          '<div class="feature-text">' +
          '<span class="section-label">' + esc(n.category) + '</span>' +
          '<h2>' + esc(n.title) + '</h2>' +
          '<p style="color: var(--text-mid); font-size: 0.85rem; margin-bottom: 1rem;">' + esc(n.date) + '</p>' +
          '<p>' + esc(excerpt) + '</p>' +
          '<span style="display:inline-block;margin-top:0.5rem;color:var(--gold);font-size:0.8rem;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;">Read More &rarr;</span>' +
          '</div></a>';
      }
      function gridCard(n, i) {
        var excerpt = ((n.paragraphs || [])[0] || '');
        if (excerpt.length > 140) excerpt = excerpt.slice(0, 140).replace(/\s+\S*$/, '') + '…';
        return '<a href="news.html?article=' + i + '" class="grid-card" style="display:flex;flex-direction:column;text-decoration:none;color:inherit;overflow:hidden;">' +
          '<div style="height:200px;overflow:hidden;background:#eef1f5;">' +
          (n.image ? '<img src="' + esc(n.image) + '" alt="' + esc(n.title) + '" style="width:100%;height:100%;object-fit:cover;">' : '') +
          '</div>' +
          '<div class="grid-card-content" style="flex:1;display:flex;flex-direction:column;">' +
          '<span style="color:var(--gold);font-size:0.7rem;font-weight:700;text-transform:uppercase;letter-spacing:0.14em;margin-bottom:0.4rem;">' + esc(n.category) + '</span>' +
          '<h3 style="margin-bottom:0.35rem;">' + esc(n.title) + '</h3>' +
          '<p style="color:var(--text-mid);font-size:0.8rem;margin-bottom:0.75rem;">' + esc(n.date) + '</p>' +
          '<p style="font-size:0.92rem;margin-bottom:1rem;">' + esc(excerpt) + '</p>' +
          '<span style="margin-top:auto;color:var(--gold);font-size:0.8rem;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;">Read More &rarr;</span>' +
          '</div></a>';
      }
      var html = news.slice(0, 4).map(featurePair).join('');
      if (news.length > 4) {
        var rest = news.slice(4).map(function (n, k) { return gridCard(n, k + 4); }).join('');
        html += '<div id="hf-news-more" style="display:none;margin-top:2rem;"><div class="grid grid-3">' + rest + '</div></div>' +
          '<div class="text-center" style="margin-top:2.5rem;"><button id="hf-news-morebtn" class="btn btn-primary" onclick="var m=document.getElementById(\'hf-news-more\');m.style.display=\'block\';this.style.display=\'none\';">Show More News</button></div>';
      }
      if (!news.length) html = '<p style="text-align:center;color:var(--text-mid);">No news articles yet.</p>';
      newsEl.innerHTML = html;
    }
  }

  // ---------- WEEKLY TRIPS & EVENTS (facilities.html) ----------
  var tripsEl = document.getElementById('hf-trips');
  if (tripsEl && data.trips && data.trips.length) {
    tripsEl.innerHTML = data.trips.map(function (t) {
      return '<div class="grid-card" style="padding: 2.25rem 2rem; text-align: center;">' +
        '<span style="display: inline-block; background: var(--primary-green); color: var(--gold-light); font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.16em; padding: 0.45rem 1.1rem; border-radius: 999px; margin-bottom: 1.1rem;">' + esc(t.day) + '</span>' +
        '<h3 style="margin-bottom: 0.75rem;">' + esc(t.title) + '</h3>' +
        '<p style="margin: 0; font-size: 0.95rem;">' + esc(t.description) + '</p>' +
        '</div>';
    }).join('');
  } else if (tripsEl) {
    var tripsSection = document.getElementById('hf-trips-section');
    if (tripsSection) tripsSection.style.display = 'none';
  }

  // ---------- AVAILABLE VILLAS (available-villas.html) ----------
  function villaFeatureLines(v) {
    function line(val, singular, plural) {
      if (!val) return '';
      var s = String(val).trim();
      if (/^\d+$/.test(s)) s = s + ' ' + (s === '1' ? singular : plural);
      return '<p style="margin: 0 0 0.3rem; font-size: 0.92rem; color: #555;">' + esc(s) + '</p>';
    }
    var out = '';
    out += line(v.beds, 'bedroom', 'bedrooms');
    out += line(v.baths, 'bathroom', 'bathrooms');
    out += line(v.garage, 'car internal access garage', 'car internal access garage');
    if (v.area) {
      var a = String(v.area).trim();
      if (/^\d+(\.\d+)?$/.test(a)) a = a + ' m² (' + Math.round(parseFloat(a) * 10.764) + ' sq ft)';
      out += '<p style="margin: 0 0 0.3rem; font-size: 0.92rem; color: #555;">' + esc(a) + '</p>';
    }
    return out;
  }

  function villaImgs(v) {
    if (v.images && v.images.length) return v.images;
    if (v.image) return [v.image];
    return [];
  }

  // Full-screen villa viewer with an image carousel + all details
  window.hfVillaCard = function (idx) {
    var v = (getData().villas || [])[idx];
    if (!v) return;
    var imgs = villaImgs(v);
    var cur = 0;
    var overlay = document.createElement('div');
    overlay.className = 'hf-villa-overlay';
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(19,32,56,0.85);z-index:9999;display:flex;align-items:center;justify-content:center;padding:1.5rem;';

    function render() {
      var statusColor = String(v.status || '').toLowerCase().indexOf('offer') !== -1 ? '#1B2A4A' : '#2e7d32';
      var gallery = imgs.length
        ? '<div style="position:relative;background:#000;">' +
            '<img src="' + esc(imgs[cur]) + '" alt="' + esc(v.name) + '" style="width:100%;max-height:60vh;object-fit:contain;display:block;">' +
            (imgs.length > 1 ?
              '<button class="hf-vc-prev" aria-label="Previous" style="position:absolute;top:50%;left:0.75rem;transform:translateY(-50%);width:44px;height:44px;border-radius:50%;border:none;background:rgba(255,255,255,0.9);font-size:1.5rem;cursor:pointer;">&#8249;</button>' +
              '<button class="hf-vc-next" aria-label="Next" style="position:absolute;top:50%;right:0.75rem;transform:translateY(-50%);width:44px;height:44px;border-radius:50%;border:none;background:rgba(255,255,255,0.9);font-size:1.5rem;cursor:pointer;">&#8250;</button>' +
              '<div style="position:absolute;bottom:0.75rem;left:50%;transform:translateX(-50%);background:rgba(0,0,0,0.55);color:white;font-size:0.8rem;padding:0.25rem 0.75rem;border-radius:999px;">' + (cur + 1) + ' / ' + imgs.length + '</div>'
              : '') +
          '</div>'
        : '<div style="height:200px;background:#eef1f5;display:flex;align-items:center;justify-content:center;color:#889;">No photos yet</div>';

      overlay.innerHTML =
        '<div class="hf-villa-modal" style="background:white;border-radius:6px;max-width:620px;width:100%;max-height:92vh;overflow-y:auto;position:relative;box-shadow:0 25px 80px rgba(0,0,0,0.4);">' +
        '<button class="hf-vc-close" aria-label="Close" style="position:absolute;top:0.6rem;right:0.9rem;font-size:2rem;line-height:1;cursor:pointer;color:white;background:rgba(0,0,0,0.35);border:none;width:40px;height:40px;border-radius:50%;z-index:2;">&times;</button>' +
        gallery +
        '<div style="padding:1.75rem 2rem 2rem;">' +
        '<span style="display:inline-block;background:' + (statusColor === '#2e7d32' ? '#eef5ee' : '#eef0f6') + ';color:' + statusColor + ';font-size:0.7rem;font-weight:700;text-transform:uppercase;letter-spacing:0.12em;padding:0.3rem 0.8rem;border-radius:999px;margin-bottom:0.75rem;">' + esc(v.status || 'Available Now') + '</span>' +
        (v.tag ? '<p style="color:var(--gold);font-size:0.72rem;font-weight:700;text-transform:uppercase;letter-spacing:0.14em;margin:0 0 0.4rem;">' + esc(v.tag) + '</p>' : '') +
        '<h2 style="font-family:var(--font-serif);font-size:2rem;color:var(--primary-green);margin:0 0 0.75rem;">' + esc(v.name) + '</h2>' +
        '<div style="margin-bottom:0.75rem;">' + villaFeatureLines(v) + '</div>' +
        (v.price ? '<p style="font-family:var(--font-serif);font-size:1.8rem;color:var(--primary-green);margin:0 0 1rem;">' + esc(v.price) + '</p>' : '') +
        (v.description ? '<p style="font-size:0.95rem;line-height:1.65;color:#555;margin:0 0 1.5rem;">' + esc(v.description) + '</p>' : '') +
        '<a href="contact.html" style="display:inline-block;background:var(--primary-green);color:white;padding:0.85rem 2rem;font-size:0.8rem;font-weight:700;text-transform:uppercase;letter-spacing:0.12em;text-decoration:none;border-radius:2px;">Enquire About This Villa</a>' +
        '</div></div>';

      overlay.querySelector('.hf-vc-close').addEventListener('click', close);
      var p = overlay.querySelector('.hf-vc-prev'), n = overlay.querySelector('.hf-vc-next');
      if (p) p.addEventListener('click', function (e) { e.stopPropagation(); cur = (cur - 1 + imgs.length) % imgs.length; render(); });
      if (n) n.addEventListener('click', function (e) { e.stopPropagation(); cur = (cur + 1) % imgs.length; render(); });
    }
    function close() { if (overlay.parentNode) overlay.parentNode.removeChild(overlay); }
    overlay.addEventListener('click', function (e) { if (e.target === overlay) close(); });
    document.addEventListener('keydown', function esc3(e) {
      if (e.key === 'Escape') { close(); document.removeEventListener('keydown', esc3); }
      if (e.key === 'ArrowLeft' && imgs.length > 1) { cur = (cur - 1 + imgs.length) % imgs.length; render(); }
      if (e.key === 'ArrowRight' && imgs.length > 1) { cur = (cur + 1) % imgs.length; render(); }
    });
    render();
    document.body.appendChild(overlay);
  };

  var villasEl = document.getElementById('hf-villas');
  if (villasEl) {
    if (data.villas && data.villas.length) {
      villasEl.innerHTML = data.villas.map(function (v, idx) {
        var imgs = villaImgs(v);
        return '<div class="grid-card" style="display: flex; flex-direction: column; cursor: pointer;" onclick="hfVillaCard(' + idx + ')">' +
          '<div style="height: 230px; overflow: hidden; position: relative; background: var(--cream-dark, #eee);">' +
          (imgs.length ? '<img src="' + esc(imgs[0]) + '" alt="' + esc(v.name) + '" style="width:100%;height:100%;object-fit:cover;">' : '') +
          '<span style="position: absolute; top: 0.9rem; left: 0.9rem; background: ' + (String(v.status || '').toLowerCase().indexOf('offer') !== -1 ? 'rgba(27,42,74,0.92)' : 'rgba(46,125,50,0.92)') + '; color: white; font-size: 0.68rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.12em; padding: 0.35rem 0.85rem; border-radius: 999px;">' + esc(v.status || 'Available Now') + '</span>' +
          (imgs.length > 1 ? '<span style="position:absolute;bottom:0.9rem;right:0.9rem;background:rgba(0,0,0,0.55);color:white;font-size:0.72rem;padding:0.25rem 0.7rem;border-radius:999px;">&#128247; ' + imgs.length + '</span>' : '') +
          '</div>' +
          '<div class="grid-card-content" style="flex: 1; display: flex; flex-direction: column;">' +
          (v.tag ? '<p style="color: var(--gold); font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.14em; margin: 0 0 0.4rem;">' + esc(v.tag) + '</p>' : '') +
          '<h3 style="margin-bottom: 0.75rem;">' + esc(v.name) + '</h3>' +
          villaFeatureLines(v) +
          (v.price ? '<p style="font-family: var(--font-serif); font-size: 1.6rem; color: var(--primary-green); margin: 0.75rem 0;">' + esc(v.price) + '</p>' : '') +
          '<div style="margin-top: auto;"><span class="btn btn-outline">View Villa &amp; Photos</span></div>' +
          '</div></div>';
      }).join('');
    } else {
      villasEl.innerHTML =
        '<div style="grid-column: 1 / -1; text-align: center; background: white; border: 1px solid var(--border-light, #e5e5e5); border-radius: 4px; padding: 3.5rem 2rem;">' +
        '<h3 style="font-family: var(--font-serif); color: var(--primary-green); font-size: 1.6rem; margin-bottom: 0.75rem;">No Villas Available Right Now</h3>' +
        '<p style="max-width: 520px; margin: 0 auto 1.5rem; color: #555;">Our villas are in high demand and are usually secured from our waiting list before they reach this page. Register your interest and we\'ll contact you as soon as one becomes available.</p>' +
        '<a href="contact.html" class="btn btn-primary">Join the Waiting List</a>' +
        '</div>';
    }
  }

  // ---------- INTERACTIVE VILLAGE MAP (villas.html) ----------
  // The actual villa building shapes are clickable. Available villas are
  // shaded gold; hovering any villa highlights it.
  var mapEl = document.getElementById('hf-map');
  if (mapEl && data.villaMapIndex && data.villaMapBoxes) {
    var availByNum = {};
    (data.villas || []).forEach(function (v) {
      if (v.number) availByNum[String(v.number).trim()] = v;
    });

    var popStyle = document.createElement('style');
    popStyle.textContent =
      '.hf-popup-overlay { position: fixed; inset: 0; background: rgba(19,32,56,0.75); z-index: 9999; display: flex; align-items: center; justify-content: center; padding: 1.5rem; }' +
      '.hf-popup { background: white; border-radius: 6px; max-width: 440px; width: 100%; max-height: 88vh; overflow-y: auto; box-shadow: 0 25px 80px rgba(0,0,0,0.4); position: relative; animation: hfPopIn 0.25s ease; }' +
      '@keyframes hfPopIn { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: none; } }' +
      '.hf-popup .hf-close { position: absolute; top: 0.6rem; right: 0.9rem; font-size: 1.9rem; line-height: 1; cursor: pointer; color: #999; background: none; border: none; z-index: 2; }' +
      '.hf-popup .hf-close:hover { color: var(--primary-green); }';
    document.head.appendChild(popStyle);

    function closePopup() {
      var ov = document.querySelector('.hf-popup-overlay');
      if (ov) ov.parentNode.removeChild(ov);
    }

    window.hfVillaPopup = function (n) {
      closePopup();
      var v = availByNum[String(n)];
      var inner;
      if (v) {
        inner =
          (v.image ? '<img src="' + esc(v.image) + '" alt="Villa ' + esc(n) + '" style="width:100%;height:210px;object-fit:cover;border-radius:6px 6px 0 0;">' : '') +
          '<div style="padding: 1.5rem 1.75rem 1.75rem;">' +
          '<span style="display:inline-block;background:#eef5ee;color:#2e7d32;font-size:0.7rem;font-weight:700;text-transform:uppercase;letter-spacing:0.12em;padding:0.3rem 0.8rem;border-radius:999px;margin-bottom:0.75rem;">' + esc(v.status || 'Available Now') + '</span>' +
          '<h3 style="font-family:var(--font-serif);font-size:1.7rem;color:var(--primary-green);margin:0 0 0.3rem;">' + (esc(v.name) || 'Villa ' + esc(n)) + '</h3>' +
          (v.tag ? '<p style="color:var(--gold);font-size:0.75rem;font-weight:700;text-transform:uppercase;letter-spacing:0.12em;margin:0 0 0.6rem;">' + esc(v.tag) + '</p>' : '') +
          (v.details ? '<p style="color:var(--gold);font-size:0.8rem;text-transform:uppercase;letter-spacing:0.1em;margin:0 0 0.75rem;">' + esc(v.details) + '</p>' : '') +
          '<div style="margin: 0 0 0.75rem;">' + villaFeatureLines(v) + '</div>' +
          (v.price ? '<p style="font-family:var(--font-serif);font-size:1.5rem;color:var(--primary-green);margin:0 0 0.75rem;">' + esc(v.price) + '</p>' : '') +
          (v.description ? '<p style="font-size:0.93rem;line-height:1.6;color:#555;margin:0 0 1.25rem;">' + esc(v.description) + '</p>' : '') +
          '<a href="contact.html" style="display:inline-block;background:var(--primary-green);color:white;padding:0.8rem 1.8rem;font-size:0.8rem;font-weight:700;text-transform:uppercase;letter-spacing:0.12em;text-decoration:none;border-radius:2px;">Enquire About This Villa</a>' +
          '</div>';
      } else {
        inner =
          '<div style="padding: 2rem 1.75rem 1.75rem;">' +
          '<span style="display:inline-block;background:#f0f2f6;color:var(--primary-green);font-size:0.7rem;font-weight:700;text-transform:uppercase;letter-spacing:0.12em;padding:0.3rem 0.8rem;border-radius:999px;margin-bottom:0.75rem;">Occupied</span>' +
          '<h3 style="font-family:var(--font-serif);font-size:1.7rem;color:var(--primary-green);margin:0 0 0.5rem;">Villa ' + esc(n) + '</h3>' +
          '<p style="font-size:0.93rem;line-height:1.6;color:#555;margin:0 0 1.25rem;">This villa is currently home to one of our residents. Villas become available from time to time &mdash; join our waiting list and we\'ll let you know as soon as one comes up.</p>' +
          '<a href="contact.html" style="display:inline-block;background:transparent;color:var(--primary-green);border:1px solid var(--primary-green);padding:0.8rem 1.8rem;font-size:0.8rem;font-weight:700;text-transform:uppercase;letter-spacing:0.12em;text-decoration:none;border-radius:2px;">Join the Waiting List</a>' +
          '</div>';
      }
      var overlay = document.createElement('div');
      overlay.className = 'hf-popup-overlay';
      overlay.innerHTML = '<div class="hf-popup"><button class="hf-close" aria-label="Close">&times;</button>' + inner + '</div>';
      overlay.addEventListener('click', function (e) { if (e.target === overlay) closePopup(); });
      overlay.querySelector('.hf-close').addEventListener('click', closePopup);
      document.addEventListener('keydown', function esc2(e) {
        if (e.key === 'Escape') { closePopup(); document.removeEventListener('keydown', esc2); }
      });
      document.body.appendChild(overlay);
    };

    // Build the map: base image + shading canvas driven by the pixel index,
    // inside a scrollable container with zoom controls
    mapEl.innerHTML =
      '<div style="position: relative; max-width: 1100px; margin: 0 auto;">' +
      '<div id="hf-map-scroll" style="overflow: auto; border-radius: 4px; box-shadow: 0 10px 40px rgba(0,0,0,0.12); max-height: 78vh; -webkit-overflow-scrolling: touch;">' +
      '<div id="hf-map-wrap" style="position: relative; width: 100%;">' +
      '<img id="hf-map-img" src="images/village-map.jpg" alt="Highfield Country Estate village layout plan" style="width: 100%; display: block;">' +
      '<canvas id="hf-map-canvas" style="position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none;"></canvas>' +
      '</div></div>' +
      '<div style="position: absolute; top: 0.75rem; right: 0.75rem; display: flex; flex-direction: column; gap: 0.4rem; z-index: 10;">' +
      '<button id="hf-zoom-in" title="Zoom in" aria-label="Zoom in" style="width: 42px; height: 42px; border-radius: 50%; border: none; background: var(--primary-green); color: white; font-size: 1.5rem; line-height: 1; cursor: pointer; box-shadow: 0 3px 10px rgba(0,0,0,0.25);">+</button>' +
      '<button id="hf-zoom-out" title="Zoom out" aria-label="Zoom out" style="width: 42px; height: 42px; border-radius: 50%; border: none; background: var(--primary-green); color: white; font-size: 1.7rem; line-height: 1; cursor: pointer; box-shadow: 0 3px 10px rgba(0,0,0,0.25);">&minus;</button>' +
      '<button id="hf-zoom-reset" title="Reset zoom" aria-label="Reset zoom" style="width: 42px; height: 42px; border-radius: 50%; border: none; background: white; color: var(--primary-green); font-size: 1rem; font-weight: 700; cursor: pointer; box-shadow: 0 3px 10px rgba(0,0,0,0.25);">&#8634;</button>' +
      '</div></div>';

    // Zoom & pan: scroll-wheel / trackpad zooms in at the pointer position,
    // click-drag pans around when zoomed. Buttons also work.
    (function () {
      var scroll = document.getElementById('hf-map-scroll');
      var wrap = document.getElementById('hf-map-wrap');
      var zoom = 1, MIN = 1, MAX = 4;
      window.__hfMapState = { suppress: false, zoom: 1, dragging: false };

      function applyZoom(newZoom, anchorX, anchorY) {
        newZoom = Math.max(MIN, Math.min(MAX, newZoom));
        if (Math.abs(newZoom - zoom) < 0.001) return;
        var rect = scroll.getBoundingClientRect();
        var ax = (anchorX == null ? rect.width / 2 : anchorX - rect.left);
        var ay = (anchorY == null ? rect.height / 2 : anchorY - rect.top);
        var fx = (scroll.scrollLeft + ax) / wrap.offsetWidth;
        var fy = (scroll.scrollTop + ay) / wrap.offsetHeight;
        zoom = newZoom;
        window.__hfMapState.zoom = zoom;
        wrap.style.width = (zoom * 100) + '%';
        scroll.scrollLeft = fx * wrap.offsetWidth - ax;
        scroll.scrollTop = fy * wrap.offsetHeight - ay;
      }

      // Wheel / trackpad: zoom anchored at the cursor
      scroll.addEventListener('wheel', function (e) {
        e.preventDefault();
        var factor = Math.exp(-e.deltaY * 0.0022);
        applyZoom(zoom * factor, e.clientX, e.clientY);
      }, { passive: false });

      // Mouse drag to pan
      var dragging = false, sx = 0, sy = 0, sl = 0, st = 0, movedFar = false;
      scroll.addEventListener('mousedown', function (e) {
        if (zoom <= 1.01) return;
        dragging = true; movedFar = false;
        window.__hfMapState.dragging = true;
        sx = e.clientX; sy = e.clientY; sl = scroll.scrollLeft; st = scroll.scrollTop;
        wrap.style.cursor = 'grabbing';
        e.preventDefault();
      });
      window.addEventListener('mousemove', function (e) {
        if (!dragging) return;
        var dx = e.clientX - sx, dy = e.clientY - sy;
        if (Math.abs(dx) + Math.abs(dy) > 6) movedFar = true;
        scroll.scrollLeft = sl - dx;
        scroll.scrollTop = st - dy;
      });
      window.addEventListener('mouseup', function () {
        if (!dragging) return;
        dragging = false;
        window.__hfMapState.dragging = false;
        wrap.style.cursor = zoom > 1.01 ? 'grab' : '';
        if (movedFar) {
          // a drag shouldn't open a villa popup on release
          window.__hfMapState.suppress = true;
          setTimeout(function () { window.__hfMapState.suppress = false; }, 80);
        }
      });
      // Touch panning comes free with the scrollable container.

      document.getElementById('hf-zoom-in').addEventListener('click', function () { applyZoom(zoom * 1.5); });
      document.getElementById('hf-zoom-out').addEventListener('click', function () { applyZoom(zoom / 1.5); });
      document.getElementById('hf-zoom-reset').addEventListener('click', function () { applyZoom(1); scroll.scrollLeft = 0; scroll.scrollTop = 0; });
    })();

    var idxImg = new Image();
    idxImg.src = data.villaMapIndex;
    idxImg.onload = function () {
      var IW = idxImg.width, IH = idxImg.height;
      var idxCanvas = document.createElement('canvas');
      idxCanvas.width = IW; idxCanvas.height = IH;
      var ictx = idxCanvas.getContext('2d');
      ictx.drawImage(idxImg, 0, 0);
      var idxData = ictx.getImageData(0, 0, IW, IH).data;

      function villaAt(fx, fy) { // fx, fy = 0..1
        var x = Math.floor(fx * IW), y = Math.floor(fy * IH);
        if (x < 0 || y < 0 || x >= IW || y >= IH) return 0;
        var i = (y * IW + x) * 4;
        return idxData[i + 3] > 0 ? idxData[i] : 0;
      }

      var overlay = document.getElementById('hf-map-canvas');
      overlay.width = IW; overlay.height = IH;
      var octx = overlay.getContext('2d');

      function shadeVilla(n, rgba) {
        var bb = data.villaMapBoxes[n];
        if (!bb) return;
        var x0 = Math.max(0, Math.floor(bb[0]/100*IW)-2), y0 = Math.max(0, Math.floor(bb[1]/100*IH)-2);
        var x1 = Math.min(IW-1, Math.ceil(bb[2]/100*IW)+2), y1 = Math.min(IH-1, Math.ceil(bb[3]/100*IH)+2);
        var region = octx.getImageData(x0, y0, x1-x0+1, y1-y0+1);
        var rd = region.data, w = x1-x0+1;
        for (var y = y0; y <= y1; y++) {
          for (var x = x0; x <= x1; x++) {
            var ii = (y * IW + x) * 4;
            if (idxData[ii+3] > 0 && idxData[ii] === Number(n)) {
              var ri = ((y-y0) * w + (x-x0)) * 4;
              rd[ri] = rgba[0]; rd[ri+1] = rgba[1]; rd[ri+2] = rgba[2]; rd[ri+3] = rgba[3];
            }
          }
        }
        octx.putImageData(region, x0, y0);
      }

      var hovered = 0;
      function repaint() {
        octx.clearRect(0, 0, IW, IH);
        Object.keys(availByNum).forEach(function (n) {
          shadeVilla(n, [184, 150, 90, 165]); // gold — available
        });
        if (hovered && !availByNum[String(hovered)]) {
          shadeVilla(hovered, [27, 42, 74, 110]); // navy — hover on occupied
        } else if (hovered) {
          shadeVilla(hovered, [212, 184, 124, 200]); // brighter gold on hover
        }
      }
      repaint();

      var wrap = document.getElementById('hf-map-wrap');
      var baseImg = document.getElementById('hf-map-img');
      function relPos(e) {
        var r = baseImg.getBoundingClientRect();
        return [(e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height];
      }
      wrap.addEventListener('mousemove', function (e) {
        if (window.__hfMapState && window.__hfMapState.dragging) return;
        var p = relPos(e);
        var n = villaAt(p[0], p[1]);
        var zoomed = window.__hfMapState && window.__hfMapState.zoom > 1.01;
        wrap.style.cursor = n ? 'pointer' : (zoomed ? 'grab' : 'default');
        if (n !== hovered) { hovered = n; repaint(); }
      });
      wrap.addEventListener('mouseleave', function () {
        if (hovered) { hovered = 0; repaint(); }
      });
      wrap.addEventListener('click', function (e) {
        if (window.__hfMapState && window.__hfMapState.suppress) return;
        var p = relPos(e);
        var n = villaAt(p[0], p[1]);
        if (n) window.hfVillaPopup(n);
      });
    };
  }

  // ---------- GALLERY (gallery.html) ----------
  var galEl = document.getElementById('hf-gallery');
  if (galEl && data.gallery) {
    var ghtml = '';
    data.gallery.forEach(function (sec, i) {
      var bg = i % 2 === 0 ? 'section-white' : 'section-cream';
      var cols = sec.photos.length <= 2 ? ' style="grid-template-columns: repeat(2, 1fr);"' : '';
      var imgs = sec.photos.map(function (p) {
        return '<img src="' + esc(p.src) + '" alt="' + esc(p.alt) + '" onclick="openLightbox(this.src.replace(\'width=800,height=600\',\'width=1600,height=1200\'))">';
      }).join('');
      ghtml += '<section class="' + bg + '"><div class="container">' +
        '<div class="text-center" style="margin-bottom: 3rem;">' +
        '<span class="section-label">' + esc(sec.label) + '</span>' +
        '<h2 class="section-title centered">' + esc(sec.title) + '</h2>' +
        '</div><div class="gallery-grid"' + cols + '>' + imgs + '</div>' +
        '</div></section>';
    });
    galEl.innerHTML = ghtml;
  }
})();
