(() => {
  "use strict";
  let appliedToken = null;
  let attempts = 0;

  function visible(el) {
    return !!el && el.getClientRects().length > 0 &&
      getComputedStyle(el).visibility !== "hidden";
  }

  function findSearchInput() {
    const inputs=[...document.querySelectorAll("input")].filter(el=>visible(el)&&!el.disabled);
    return inputs.find(el => (el.placeholder || "").trim().toLowerCase() === "sök...") ||
      inputs.find(el => (el.placeholder || "").trim().toLowerCase().startsWith("sök")) ||
      inputs.find(el => /koordinat|search/i.test([
        el.placeholder,el.getAttribute("aria-label"),el.title,el.name
      ].join(" "))) ||
      inputs.find(el=>el.type==="search");
  }

  function setNativeValue(input,value) {
    const setter=Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,"value").set;
    setter.call(input,value);
    input.dispatchEvent(new Event("input",{bubbles:true}));
    input.dispatchEvent(new Event("change",{bubbles:true}));
  }

  function findMagnifierButton(input) {
    // Min Karta toolbar layout (from screenshot):
    // [search input] [clear X] [magnifier] [drop-pin tool]
    // Do NOT choose the rightmost button: that opens the separate manual
    // coordinate-entry panel instead of submitting the search.
    let p=input.parentElement;
    for(let level=0;p&&level<7;level++,p=p.parentElement) {
      const buttons=[...p.querySelectorAll("button,[role='button']")].filter(visible);
      const ir=input.getBoundingClientRect();
      const candidates=buttons.map(b=>({b,r:b.getBoundingClientRect()}))
        .filter(x=>x.r.width>=22&&x.r.width<=100&&Math.abs(x.r.top-ir.top)<40&&
          x.r.left>=ir.right-5&&x.r.left-ir.right<180)
        .sort((a,b)=>a.r.left-b.r.left);

      if(candidates.length) {
        const notClear=candidates.filter(x => !/clear|rensa|töm|close|stäng/i.test([
          x.b.getAttribute("aria-label"), x.b.title, x.b.innerText
        ].join(" ")));
        // If accessible names identify the clear control, use the next button.
        if(notClear.length && notClear.length < candidates.length) return notClear[0].b;
        // Otherwise the first button is the X/clear control and the second is
        // the magnifier. If there is only one candidate, use it.
        return candidates.length >= 2 ? candidates[1].b : candidates[0].b;
      }
    }
    return null;
  }

  function showStatus(message, isError=false) {
    let el=document.getElementById("gmlm-status");
    if(!el) {
      el=document.createElement("div");
      el.id="gmlm-status";
      Object.assign(el.style,{
        position:"fixed",zIndex:"2147483647",bottom:"18px",left:"50%",
        transform:"translateX(-50%)",padding:"11px 16px",borderRadius:"8px",
        font:"14px Arial,sans-serif",boxShadow:"0 2px 10px #0004",
        maxWidth:"90vw"
      });
      document.body.appendChild(el);
    }
    el.style.background=isError?"#8b2525":"#173f35";
    el.style.color="#fff";
    el.textContent=message;
    setTimeout(()=>el?.remove(),12000);
  }

  async function checkPending() {
    const result=await browser.storage.local.get("gmlmPending");
    const pending=result.gmlmPending;
    if(!pending || !pending.query || Date.now()-pending.created>180000) return false;
    if(appliedToken===pending.token) return true;

    const input=findSearchInput();
    if(!input) return false;

    appliedToken=pending.token;
    setNativeValue(input,pending.query);
    input.focus();

    showStatus(
      `Punkt ${pending.source || ""} · SWEREF ${pending.query} – söker…`
    );

    setTimeout(async()=>{
      const button=findMagnifierButton(input);
      if(button) {
        button.click();
        showStatus(`Söker ${pending.query}. Nu ska sökträffen kunna markeras på kartan.`);
        await browser.storage.local.remove("gmlmPending");
      } else {
        showStatus(`Koordinater ifyllda: ${pending.query} – klicka på förstoringsglaset, inte kartnålen.`,true);
      }
    },500);
    return true;
  }

  const timer=setInterval(async()=>{
    attempts++;
    await checkPending();
    if(attempts>120)clearInterval(timer);
  },500);
  checkPending();
})();
