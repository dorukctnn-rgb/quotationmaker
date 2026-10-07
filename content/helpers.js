// Small helpers for writing page content as HTML strings.
const escapeHtml = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

// Plain text with blank lines between paragraphs -> <p> blocks; [placeholders] highlighted.
function textToHtml(text) {
  return text.trim().split(/\n\s*\n/).map(par =>
    '<p>' + escapeHtml(par.trim()).replace(/\n/g, '<br>').replace(/\[([^\]]+)\]/g, '<span class="ph">[$1]</span>') + '</p>'
  ).join('');
}

// A copyable template block. `id` must be unique on the page.
function tpl(id, title, text, note) {
  return '<div class="tpl"><div class="tpl-h"><h3 id="' + id + '-h">' + title + '</h3>' +
    '<button type="button" class="copy-btn" data-copy="' + id + '" aria-label="Copy: ' + escapeHtml(title.replace(/<[^>]+>/g, '')) + '">Copy</button></div>' +
    (note ? '<p class="tpl-note">' + note + '</p>' : '') +
    '<div class="tpl-body" id="' + id + '">' + textToHtml(text) + '</div></div>';
}

module.exports = { tpl, textToHtml, escapeHtml };
