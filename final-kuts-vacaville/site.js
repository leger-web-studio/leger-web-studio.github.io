// Open-now badge + highlight today's hours. Hours: [{d:0..6 (Sun=0), o:"HH:MM", c:"HH:MM"} | {d, closed:true}]
(function(){
  var H = window.__HOURS__ || [];
  if (!H.length) return;
  var now = new Date(new Date().toLocaleString("en-US",{timeZone: window.__TZ__}));
  var d = now.getDay(), mins = now.getHours()*60+now.getMinutes();
  function m(s){var p=s.split(":");return +p[0]*60+ +p[1];}
  function fmt(s){var p=s.split(":"),h=+p[0],ap=h>=12?"PM":"AM";h=h%12||12;return h+(p[1]!=="00"?":"+p[1]:"")+" "+ap;}
  var today = H.filter(function(x){return x.d===d;});
  var open = today.some(function(x){return !x.closed && mins>=m(x.o) && mins<m(x.c);});
  var b = document.getElementById("openBadge");
  if (b){
    if (open){ var t=today.filter(function(x){return !x.closed && mins<m(x.c);})[0]; b.textContent="Open now · until "+fmt(t.c); b.className="open-badge is-open"; }
    else { b.textContent="Closed now"; b.className="open-badge is-closed"; }
    b.hidden=false;
  }
  var row = document.querySelector('#hoursTable tr[data-d="'+d+'"]');
  if (row) row.classList.add("today");
})();
