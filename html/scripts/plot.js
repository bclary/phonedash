/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

function dateStr(d) {
  function pad(n) { return n < 10 ? '0' + n : n; }  
  return d.getUTCFullYear() +
    '-' + pad(d.getUTCMonth() + 1) +
    '-' + pad(d.getUTCDate()) +
    ' ' + pad(d.getUTCHours()) +
    ':' + pad(d.getUTCMinutes()) +
    ':' + pad(d.getUTCSeconds());
}


function showLineTooltip(x, y, timestamp, product, revision, value, valueerr) {
  var params = {
    date: dateStr(new Date(Math.floor(timestamp))),
    value: Math.floor(value),
    valueerr: '&plusmn;' + Math.floor(valueerr),
    revision: revision,
    url: ''
  };
  if (product == 'org.mozilla.fennec') {
    params.url = 'https://hg.mozilla.org/mozilla-central/rev/';
  }
  params.url += revision;
  var content = ich.flot_tooltip(params);

  $(content).css({
    top: y + 5,
    left: x + 5
  }).appendTo('body');
}


// calls toolTipFn when we detect that the current selection has changed
function plotClick(selector, toolTipFn) {
  var previousPoint = null;
  var prevX = 0;
  var prevY = 0;
  return function(event, pos, item) {
    if (item) {
      if (previousPoint != item.datapoint) {
        previousPoint = item.datapoint;
        prevX = pos.pageX;
        prevY = pos.pageY;
        $('.tooltip').remove();
        toolTipFn(item);
      }
    } else {
      if (previousPoint &&
          (pos.pageX < (prevX - 5) ||
           pos.pageX > (prevX + 10 + $('.tooltip').width()) ||
           pos.pageY < (prevY - 5) ||
           pos.pageY > (prevY + 10 + $('.tooltip').height()))) {
        $('.tooltip').remove();
        previousPoint = null;
      }
    }
  };
}
