/* Job price calculator on /blog/how-to-price-a-job-quote.
   Price before tax = cost / (1 - margin); cost = materials (with waste and delivery) + labour + overheads. */
(function () {
  'use strict';
  var root = document.getElementById('pcalc');
  if (!root) return;
  var $ = function (id) { return document.getElementById(id); };
  var num = function (id) { var n = parseFloat($(id).value); return isFinite(n) && n > 0 ? n : 0; };
  function money(n, sym) {
    var s = Math.abs(n).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return (n < 0 ? '-' : '') + sym + s;
  }
  function pct(n) { return (Math.round(n * 1000) / 10).toFixed(1).replace(/\.0$/, '') + '%'; }
  function update() {
    var sym = $('pcCur').value;
    var materials = num('pcMat') * (1 + num('pcWaste') / 100) + num('pcDel');
    var labour = num('pcHours') * num('pcRate');
    var overheads = num('pcHours') * num('pcOver');
    var cost = materials + labour + overheads;
    var margin = Math.min(num('pcMargin'), 90) / 100;
    var price = margin < 1 ? cost / (1 - margin) : cost;
    var profit = price - cost;
    $('pcoMat').textContent = money(materials, sym);
    $('pcoLab').textContent = money(labour, sym);
    $('pcoOver').textContent = money(overheads, sym);
    $('pcoCost').textContent = money(cost, sym);
    $('pcoProfit').textContent = money(profit, sym);
    $('pcoPrice').textContent = money(price, sym);
    var note = '';
    if (cost > 0 && margin > 0) {
      var markupPrice = cost * (1 + margin);
      note = 'A ' + pct(margin) + ' margin is a ' + pct(profit / cost) + ' markup. Adding ' + pct(margin) + ' to cost instead would give ' +
        money(markupPrice, sym) + ', a margin of only ' + pct((markupPrice - cost) / markupPrice) + '.';
    }
    if (num('pcHours') > 0 && price > 0) note += (note ? ' ' : '') + 'Without materials, the price earns ' + money((price - materials) / num('pcHours'), sym) + ' per labour hour.';
    $('pcoNote').textContent = note;
  }
  root.addEventListener('input', update);
  root.addEventListener('change', update);
  update();
})();
