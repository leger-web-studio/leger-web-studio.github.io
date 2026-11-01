// Demo site runtime: language switching (lazy per-language JSON) + open-now badge and today's hours.
// Hours: [{d:0..6 (Sun=0), o:"HH:MM", c:"HH:MM"} | {d, closed:true}]
(function(){
  var UI = { openUntil: "Open now · until {t}", closedNow: "Closed now" };
  function hours(){
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
      if (open){ var t=today.filter(function(x){return !x.closed && mins<m(x.c);})[0]; b.textContent=UI.openUntil.replace("{t}",fmt(t.c)); b.className="open-badge is-open"; }
      else { b.textContent=UI.closedNow; b.className="open-badge is-closed"; }
      b.hidden=false;
    }
    var row = document.querySelector('#hoursTable tr[data-d="'+d+'"]');
    if (row) row.classList.add("today");
  }
  function picker(){
    var sel = document.getElementById("langSel");
    if (!sel) return;
    sel.value = window.__LANG__ || "en";
    sel.addEventListener("change", function(){
      try { localStorage.setItem("lang", sel.value); } catch(e){}
      var u = new URL(location.href); u.searchParams.set("lang", sel.value); location.href = u.toString();
    });
  }
  function done(){ document.documentElement.classList.remove("i18n-wait"); }
  function init(){ hours(); picker(); }
  var l = window.__LANG__ || "en", html = document.documentElement;
  if (l === "en") { init(); done(); return; }
  var isMenu = document.body.classList.contains("menu-page");
  fetch((window.__ROOT__||"") + "i18n/" + l + (isMenu ? ".menu" : "") + ".json")
    .then(function(r){ if (!r.ok) throw 0; return r.json(); })
    .then(function(j){
      html.lang = j.lang; html.dir = j.dir || "ltr";
      var ta = document.createElement("textarea"); ta.innerHTML = j.title; document.title = ta.value;
      document.body.innerHTML = j.body;
      if (j.ui) UI = j.ui;
      init(); done();
      if (location.hash) { var t = document.getElementById(location.hash.slice(1)); if (t) t.scrollIntoView(); }
    })
    .catch(function(){ html.lang = "en"; html.dir = "ltr"; init(); done(); });
})();
