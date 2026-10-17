/* Fill-in boxes on template pages (/quotation-confirmation, /revised-quotation).
   Each input carries data-ph="[placeholder]"; what is typed replaces that placeholder in every
   copyable template on the page, so the Copy buttons copy the filled text. Runs only in the browser:
   nothing typed is sent anywhere. */
(function () {
  'use strict';
  var boxes = document.querySelectorAll('[data-fill]');
  if (!boxes.length) return;
  var spans = Array.prototype.slice.call(document.querySelectorAll('.tpl-body .ph'));
  spans.forEach(function (s) { s.setAttribute('data-ph', s.textContent); });

  function value(input) {
    var v = input.value.trim();
    if (input.type === 'date' && /^\d{4}-\d{2}-\d{2}$/.test(v)) {
      return new Date(v + 'T12:00:00Z').toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
    }
    return v;
  }

  function update() {
    var map = {};
    Array.prototype.forEach.call(boxes, function (box) {
      Array.prototype.forEach.call(box.querySelectorAll('input[data-ph]'), function (i) {
        var v = value(i);
        if (v) map[i.getAttribute('data-ph')] = v;
      });
    });
    spans.forEach(function (s) {
      var k = s.getAttribute('data-ph');
      var v = map[k] || k;
      if (s.textContent !== v) s.textContent = v;
    });
  }

  Array.prototype.forEach.call(boxes, function (box) {
    box.addEventListener('input', update);
    box.addEventListener('change', update);
  });
  window.addEventListener('pageshow', update);
  update();
})();
