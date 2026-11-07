(() => {
  "use strict";
  const ID = "gmlm-open-link";
  const LABELS = ["add a label","lägg till etikett","lägg till en etikett","add label"];

  function getCoordinates() {
    const url = location.href;
    // The final !3d..!4d.. pair in the Google Maps place URL is the selected feature.
    const pairs = [...url.matchAll(/!3d(-?\d+(?:\.\d+)?)!4d(-?\d+(?:\.\d+)?)/g)];
    if (pairs.length) {
      const p = pairs[pairs.length - 1];
      return [Number(p[1]), Number(p[2])];
    }
    let decoded = url;
    try { decoded = decodeURIComponent(url); } catch (_) {}
    const re = /(\d{1,3})\s*°\s*(\d{1,2})\s*['′]\s*(\d+(?:\.\d+)?)\s*["″]?\s*([NSEW])/gi;
    const found = [...decoded.matchAll(re)];
    if (found.length >= 2) {
      const v = {};
      for (const m of found) {
        let n = +m[1] + (+m[2])/60 + (+m[3])/3600;
        if (/[SW]/i.test(m[4])) n = -n;
        v[m[4].toUpperCase()] = n;
      }
      if (v.N != null && v.E != null) return [v.N,v.E];
    }
    const center = url.match(/@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/);
    return center ? [Number(center[1]),Number(center[2])] : null;
  }

  // SWEREF 99 TM / EPSG:3006, returns northing/easting.
  function toSweref(lat, lon) {
    const a=6378137, f=1/298.257222101, k0=.9996, n=f/(2-f);
    const lon0=15*Math.PI/180, phi=lat*Math.PI/180, dl=lon*Math.PI/180-lon0;
    const A=a/(1+n)*(1+n*n/4+Math.pow(n,4)/64);
    const al=[0,n/2-2*n*n/3+5*Math.pow(n,3)/16+41*Math.pow(n,4)/180,
      13*n*n/48-3*Math.pow(n,3)/5+557*Math.pow(n,4)/1440,
      61*Math.pow(n,3)/240-103*Math.pow(n,4)/140,49561*Math.pow(n,4)/161280];
    const e=2*Math.sqrt(n)/(1+n), tau=Math.tan(phi);
    const sig=Math.sinh(e*Math.atanh(e*tau/Math.sqrt(1+tau*tau)));
    const tp=tau*Math.sqrt(1+sig*sig)-sig*Math.sqrt(1+tau*tau);
    const xi0=Math.atan2(tp,Math.cos(dl));
    const eta0=Math.asinh(Math.sin(dl)/Math.sqrt(tp*tp+Math.cos(dl)*Math.cos(dl)));
    let xi=xi0,eta=eta0;
    for(let j=1;j<=4;j++){
      xi+=al[j]*Math.sin(2*j*xi0)*Math.cosh(2*j*eta0);
      eta+=al[j]*Math.cos(2*j*xi0)*Math.sinh(2*j*eta0);
    }
    return [Math.round(k0*A*xi),Math.round(500000+k0*A*eta)];
  }


  // Google Maps' address row is a .RcCsl wrapper containing a button
  // [data-item-id="address"]. Insert our row beside that wrapper, never inside
  // the button (which caused nested interactive elements and broken layout).
  function findInsertionPoint() {
    // 1) Business/place cards: insert after the complete address row.
    const addressButton = [...document.querySelectorAll(
      'button[data-item-id="address"], [role="button"][data-item-id="address"]'
    )].find(el => el.getClientRects().length > 0);
    if (addressButton) {
      const addressRow = addressButton.closest(".RcCsl") || addressButton.parentElement;
      if (addressRow?.parentElement) {
        return { anchor: addressRow, position: "after" };
      }
    }

    // 2) Ordinary map pins / dropped pins: these often have no address row.
    // Their info panel uses independent .MngOvd rows and ends with
    // "Your Maps history". Insert immediately before that row as a sibling.
    const historyRows = [...document.querySelectorAll(".MngOvd")].filter(el => {
      if (!el.getClientRects().length || el.id === ID || el.querySelector("#" + ID)) return false;
      const text = (el.innerText || "").replace(/\\s+/g, " ").trim().toLowerCase();
      return text === "your maps history" || text === "din korthistorik";
    });
    if (historyRows.length) {
      const row = historyRows[historyRows.length - 1];
      if (row.parentElement) return { anchor: row, position: "before" };
    }

    // 3) Fallback for localized/changed labels: use a visible .MngOvd
    // section whose button announces map history.
    const fallback = [...document.querySelectorAll('.MngOvd [role="button"]')].find(el => {
      const label = (el.innerText || el.getAttribute("aria-label") || "").toLowerCase();
      return /maps history|korthistorik/.test(label) && el.closest(".MngOvd")?.getClientRects().length;
    });
    const fallbackRow = fallback?.closest(".MngOvd");
    if (fallbackRow?.parentElement) return { anchor: fallbackRow, position: "before" };

    return null;
  }

  function addLink() {
    const insertion = findInsertionPoint();
    if (!insertion) return;
    const target = insertion.anchor;
    if (!target || !target.parentElement) return;

    let row = document.getElementById(ID);
    if (!row) {
      row = document.createElement("div");
      row.id = ID;
      row.setAttribute("role", "button");
      row.tabIndex = 0;
      row.innerHTML = `
        <div class="gmlm-inner">
          <span class="gmlm-icon" aria-hidden="true">📍</span>
          <span class="gmlm-copy">
            <span class="gmlm-title">Öppna i Lantmäteriet</span>
            <span class="gmlm-subtitle">Visa punkten i Min Karta ↗</span>
          </span>
        </div>`;

      const style = document.createElement("style");
      style.textContent = `
        #${ID} {
          display:block; width:100%; box-sizing:border-box;
          cursor:pointer; color:#202124; font-family:Arial,sans-serif;
          border-top:1px solid #dadce0;
        }
        #${ID} .gmlm-inner {
          display:flex; align-items:center; gap:18px;
          padding:12px 20px; min-height:56px; box-sizing:border-box;
        }
        #${ID}:hover { background:#f1f3f4; }
        #${ID}:focus-visible { outline:2px solid #1a73e8; outline-offset:-2px; }
        #${ID} .gmlm-icon { width:28px; flex:0 0 28px; font-size:23px; text-align:center; }
        #${ID} .gmlm-copy { display:flex; flex-direction:column; gap:3px; min-width:0; }
        #${ID} .gmlm-title { font-size:14px; line-height:20px; font-weight:500; }
        #${ID} .gmlm-subtitle { font-size:12px; line-height:16px; color:#5f6368; }
      `;
      row.appendChild(style);

      const open = () => {
        const c = getCoordinates();
        if (!c) {
          alert("Kunde inte hitta koordinater för den valda platsen.");
          return;
        }
        const [north, east] = toSweref(c[0], c[1]);
        browser.runtime.sendMessage({
          type: "OPEN_MIN_KARTA",
          query: `${north} ${east}`,
          source: `${c[0].toFixed(6)}, ${c[1].toFixed(6)}`
        });
      };

      row.addEventListener("click", e => {
        e.preventDefault();
        e.stopPropagation();
        open();
      });
      row.addEventListener("keydown", e => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          e.stopPropagation();
          open();
        }
      });
    }

    // Always position as a sibling after the complete address row.
    const expectedPrevious = insertion.position === "after" ? target : target.previousElementSibling;
    const expectedNext = insertion.position === "before" ? target : target.nextElementSibling;
    if (row.parentElement !== target.parentElement ||
        (insertion.position === "after" && target.nextElementSibling !== row) ||
        (insertion.position === "before" && target.previousElementSibling !== row)) {
      target.insertAdjacentElement(insertion.position === "after" ? "afterend" : "beforebegin", row);
    }
  }

  new MutationObserver(addLink).observe(document.documentElement,{childList:true,subtree:true});
  addLink();setInterval(addLink,1000);
})();
