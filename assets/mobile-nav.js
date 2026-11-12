(function(){
  const menus=Array.from(document.querySelectorAll(".gl-mobile-menu,.inner-nav .menu"));
  document.addEventListener("pointerdown",function(event){
    menus.forEach(function(menu){if(menu.open&&!menu.contains(event.target))menu.open=false;});
  });
  document.querySelectorAll(".nav-mobile-group").forEach(function(group){
    group.addEventListener("toggle",function(){
      if(!group.open)return;
      const parent=group.closest(".gl-mobile-menu,.inner-nav .menu");
      if(!parent)return;
      parent.querySelectorAll(".nav-mobile-group").forEach(function(other){if(other!==group)other.open=false;});
    });
  });
})();

/* Glasford quote quiz: reusable across every static website route. */
(function(){
  "use strict";
  const businessName="Glaford Tree Trimming & Landscape";
  // Add a verified endpoint before accepting live lead submissions.
  const quoteEndpoint=(typeof window.GLASFORD_QUOTE_WEBHOOK_URL==="string" ? window.GLASFORD_QUOTE_WEBHOOK_URL.trim() : "");
  document.querySelectorAll(".site-nav > a.site-logo-link, .inner-nav-row > a.site-logo-link").forEach(function(link){
    link.classList.add("gl-brand-wordmark");
    link.setAttribute("href","/");
    link.setAttribute("aria-label",businessName+" home");
    link.replaceChildren();
    const top=document.createElement("span"),bottom=document.createElement("span");
    top.className="gl-brand-top";
    bottom.className="gl-brand-bottom";
    top.textContent="Glaford";
    bottom.textContent="Tree Trimming & Landscape";
    link.append(top,bottom);
  });

  const questions=[
    {key:"service",title:"What kind of work do you need?",description:"Choose the service that best describes your project.",options:[
      "Tree trimming","Tree removal","Tree pruning","Palm tree care","Storm cleanup","Landscaping / yard work","I'm not sure yet"
    ]},
    {key:"size",title:"How big is the project?",description:"An approximate answer is completely fine.",options:[
      "One tree or small area","2–3 trees / medium area","4 or more trees / large area","Not sure yet"
    ]},
    {key:"timing",title:"When are you looking to get started?",description:"This helps us understand how soon you need service.",options:[
      "As soon as possible","Within 1–2 weeks","Within the next month","Just exploring options"
    ]},
    {key:"location",title:"Where is the property?",description:"We serve Port St. Lucie, West Palm Beach, and nearby areas. We'll confirm availability for your address."},
    {key:"contact",title:"Where can we reach you?",description:"Share your details and any helpful notes about the project."}
  ];
  let current=0,answers={},busy=false,lastFocus=null;
  const overlay=document.createElement("div");
  overlay.className="glq-overlay";
  overlay.hidden=true;
  overlay.innerHTML=String.raw`
    <div class="glq-backdrop" data-glq-close></div>
    <section class="glq-dialog" role="dialog" aria-modal="true" aria-labelledby="glq-heading" aria-describedby="glq-intro">
      <div class="glq-topbar"><div><span class="glq-kicker">GLAFORD TREE TRIMMING &amp; LANDSCAPE</span><span class="glq-top-title">Request a free estimate</span></div><button type="button" class="glq-close" data-glq-close aria-label="Close estimate form">×</button></div>
      <div class="glq-progress"><div class="glq-progress-caption"><span id="glq-step">Step 1 of 5</span><span>About 1 minute</span></div><div class="glq-track"><div id="glq-progress-fill"></div></div></div>
      <form id="glq-form" novalidate>
        <div class="glq-content"><h2 id="glq-heading"></h2><p id="glq-intro"></p><div id="glq-fields"></div><p id="glq-error" class="glq-error" role="alert" hidden></p></div>
        <div class="glq-actions"><button type="button" id="glq-back" class="glq-secondary">Back</button><button type="submit" id="glq-next" class="glq-primary">Continue <span aria-hidden="true">→</span></button></div>
      </form>
      <div class="glq-footnote">Your information is used only to follow up about the estimate you requested.</div>
    </section>
  `;
  document.body.appendChild(overlay);
  const form=overlay.querySelector("#glq-form");
  const fields=overlay.querySelector("#glq-fields");
  const title=overlay.querySelector("#glq-heading");
  const intro=overlay.querySelector("#glq-intro");
  const error=overlay.querySelector("#glq-error");
  const stepLabel=overlay.querySelector("#glq-step");
  const fill=overlay.querySelector("#glq-progress-fill");
  const back=overlay.querySelector("#glq-back");
  const next=overlay.querySelector("#glq-next");

  function showError(message){error.hidden=!message;error.textContent=message||"";}
  function escapeHTML(s){return String(s).replace(/[&<>"']/g,function(ch){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch];});}
  function render(){
    const q=questions[current];
    title.textContent=q.title;intro.textContent=q.description;
    stepLabel.textContent="Step "+(current+1)+" of "+questions.length;
    fill.style.width=(((current+1)/questions.length)*100)+"%";
    showError("");back.hidden=current===0;
    next.disabled=false;next.textContent=current===questions.length-1?(quoteEndpoint?"Send my request →":"Preview my request →"):"Continue →";
    if(q.options){
      fields.innerHTML='<div class="glq-options" role="radiogroup" aria-label="'+escapeHTML(q.title)+'">'+q.options.map(function(item){
        const selected=answers[q.key]===item;
        return '<button type="button" role="radio" aria-checked="'+selected+'" class="glq-option'+(selected?' is-selected':'')+'" data-glq-option="'+escapeHTML(item)+'"><span>'+escapeHTML(item)+'</span><span class="glq-choice-check" aria-hidden="true">'+(selected?'✓':'')+'</span></button>';
      }).join("")+'</div>';
    }else if(q.key==="location"){
      fields.innerHTML='<div class="glq-field-grid"><label class="glq-field"><span>ZIP code <b>*</b></span><input id="glq-zip" name="zip" type="text" inputmode="numeric" autocomplete="postal-code" maxlength="5" placeholder="e.g. 34952" required></label><label class="glq-field"><span>City (optional)</span><input id="glq-city" name="city" autocomplete="address-level2" placeholder="e.g. Port St. Lucie"></label></div><p class="glq-helper">We will confirm whether your location is within the service area.</p>';
      fields.querySelector("#glq-zip").value=answers.zip||"";
      fields.querySelector("#glq-city").value=answers.city||"";
    }else{
      fields.innerHTML='<div class="glq-field-grid"><label class="glq-field"><span>Full name <b>*</b></span><input id="glq-name" name="name" autocomplete="name" placeholder="Your name" maxlength="120" required></label><label class="glq-field"><span>Phone number <b>*</b></span><input id="glq-phone" name="phone" type="tel" autocomplete="tel" inputmode="tel" placeholder="(555) 555-5555" maxlength="25" required></label><label class="glq-field"><span>Email (optional)</span><input id="glq-email" name="email" type="email" autocomplete="email" placeholder="you@example.com" maxlength="160"></label><label class="glq-field"><span>Anything else we should know?</span><textarea id="glq-notes" name="notes" rows="3" maxlength="1000" placeholder="Describe the trees, access, or other details"></textarea></label><label class="glq-consent"><input id="glq-consent" type="checkbox"><span>I agree to be contacted about this estimate request. No marketing consent is required.</span></label></div>'+
        (quoteEndpoint?'':'<p class="glq-preview-notice">Preview mode: the website has no connected submission destination yet. Your information will not be sent.</p>');
      ["name","phone","email","notes"].forEach(function(k){fields.querySelector("#glq-"+k).value=answers[k]||"";});
      fields.querySelector("#glq-consent").checked=!!answers.consent;
    }
  }
  function saveFields(){
    if(current===3){answers.zip=(fields.querySelector("#glq-zip")?.value||"").trim();answers.city=(fields.querySelector("#glq-city")?.value||"").trim();}
    if(current===4){
      ["name","phone","email","notes"].forEach(function(k){answers[k]=(fields.querySelector("#glq-"+k)?.value||"").trim();});
      answers.consent=!!fields.querySelector("#glq-consent")?.checked;
    }
  }
  function openQuiz(){
    lastFocus=document.activeElement;
    current=0;answers={};busy=false;render();
    overlay.hidden=false;document.body.classList.add("glq-locked");
    document.querySelectorAll(".gl-mobile-menu[open],.inner-nav .menu[open]").forEach(function(m){m.open=false;});
    overlay.querySelector(".glq-close").focus();
  }
  function closeQuiz(){
    if(busy)return;
    overlay.hidden=true;document.body.classList.remove("glq-locked");
    if(lastFocus&&typeof lastFocus.focus==="function")lastFocus.focus();
  }
  function summaryText(){
    return "Glaford Tree Trimming & Landscape - estimate request\n"+
      "Service: "+(answers.service||"")+"\nProject size: "+(answers.size||"")+"\nTiming: "+(answers.timing||"")+
      "\nZIP: "+(answers.zip||"")+"\nCity: "+(answers.city||"")+"\nName: "+(answers.name||"")+
      "\nPhone: "+(answers.phone||"")+"\nEmail: "+(answers.email||"")+"\nNotes: "+(answers.notes||"");
  }
  function showResult(sent){
    const content=overlay.querySelector(".glq-content");
    form.querySelector(".glq-actions").hidden=true;
    content.replaceChildren();
    const symbol=document.createElement("div");symbol.className="glq-finish-icon";symbol.textContent=sent?"✓":"✳";
    const h=document.createElement("h2");h.id="glq-heading";h.textContent=sent?"Thank you! Your request was sent.":"Your quote details are ready";
    const p=document.createElement("p");p.textContent=sent?"We received your information. Glasford will review your request and follow up.":"This is a site preview. Your request has not been sent because the form has no connected submission destination yet.";
    content.append(symbol,h,p);
    if(!sent){
      const pre=document.createElement("pre");pre.className="glq-summary";pre.textContent=summaryText();content.appendChild(pre);
      const copy=document.createElement("button");copy.type="button";copy.className="glq-primary";copy.textContent="Copy my request";
      copy.addEventListener("click",async function(){
        try{await navigator.clipboard.writeText(summaryText());copy.textContent="Copied ✓";}
        catch(e){const range=document.createRange();range.selectNodeContents(pre);const selection=window.getSelection();selection.removeAllRanges();selection.addRange(range);copy.textContent="Select and copy the details above";}
      });
      content.appendChild(copy);
    }
    const done=document.createElement("button");done.type="button";done.className="glq-secondary glq-done";done.textContent="Close";done.addEventListener("click",closeQuiz);content.appendChild(done);
    stepLabel.textContent=sent?"Request complete":"Preview complete";
    fill.style.width="100%";
    done.focus();
  }
  form.addEventListener("click",function(event){
    const b=event.target.closest("[data-glq-option]");
    if(!b)return;
    answers[questions[current].key]=b.dataset.glqOption;
    fields.querySelectorAll("[data-glq-option]").forEach(function(el){
      const selected=el===b;el.classList.toggle("is-selected",selected);el.setAttribute("aria-checked",String(selected));
      el.querySelector(".glq-choice-check").textContent=selected?"✓":"";
    });
    showError("");
  });
  back.addEventListener("click",function(){if(current===0||busy)return;saveFields();current--;render();});
  form.addEventListener("submit",async function(event){
    event.preventDefault();if(busy)return;
    const q=questions[current];saveFields();
    if(q.options&&!answers[q.key]){showError("Choose an option to continue.");return;}
    if(q.key==="location"&&!/^\d{5}$/.test(answers.zip||"")){showError("Enter a valid five-digit ZIP code.");fields.querySelector("#glq-zip").focus();return;}
    if(q.key==="contact"){
      if(!(answers.name||"").trim()){showError("Enter your name.");fields.querySelector("#glq-name").focus();return;}
      if((answers.phone||"").replace(/\D/g,"").length<10){showError("Enter a valid phone number.");fields.querySelector("#glq-phone").focus();return;}
      const email=answers.email||"";
      if(email&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){showError("Enter a valid email, or leave it blank.");fields.querySelector("#glq-email").focus();return;}
      if(!answers.consent){showError("Please confirm that we can contact you about your request.");fields.querySelector("#glq-consent").focus();return;}
      if(!quoteEndpoint){showResult(false);return;}
      busy=true;next.disabled=true;next.textContent="Sending…";
      try{
        const res=await fetch(quoteEndpoint,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({
          source:"glasford-website-quote-funnel",submittedAt:new Date().toISOString(),page:location.href,
          service:answers.service,projectSize:answers.size,timing:answers.timing,zip:answers.zip,city:answers.city,
          name:answers.name,phone:answers.phone,email:answers.email,notes:answers.notes,contactConsent:answers.consent
        })});
        if(!res.ok)throw new Error("Submission could not be confirmed");
        busy=false;showResult(true);
      }catch(err){busy=false;next.disabled=false;next.textContent="Try sending again →";showError("The request could not be sent. Please try again.");}
      return;
    }
    current++;render();
    overlay.querySelector("#glq-heading").focus?.();
  });
  overlay.addEventListener("click",function(event){if(event.target.closest("[data-glq-close]"))closeQuiz();});
  document.addEventListener("keydown",function(event){
    if(overlay.hidden)return;
    if(event.key==="Escape"){event.preventDefault();closeQuiz();return;}
    if(event.key!=="Tab")return;
    const focusable=Array.from(overlay.querySelectorAll('button:not([hidden]):not([disabled]),input:not([disabled]),textarea:not([disabled])')).filter(function(el){return el.getClientRects().length>0&&el.closest('[hidden]')===null;});
    if(!focusable.length)return;
    const first=focusable[0],last=focusable[focusable.length-1];
    if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}
    else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
  });
  // Intercept only quote-related CTAs; ordinary "Contact" footer links still navigate normally.
  document.addEventListener("click",function(event){
    const target=event.target.closest("a,button");
    if(!target||target.closest(".glq-overlay"))return;
    const text=(target.textContent||"").trim();
    const href=target.getAttribute("href")||"";
    const isQuoteButton=target.matches(".demo-contact,[data-quote-open]")||
      ((href==="/contact/"||href==="#p2-contact")&&/estimate|quote|talk about your trees|let.s talk/i.test(text));
    if(!isQuoteButton)return;
    event.preventDefault();event.stopImmediatePropagation();openQuiz();
  },true);
  // A prominent CTA is available throughout long service and area pages.
  const floating=document.createElement("button");
  floating.type="button";floating.className="glq-floating-cta";
  floating.textContent="Get a free estimate ↗";
  floating.setAttribute("aria-label","Open free estimate quiz");
  floating.addEventListener("click",openQuiz);
  document.body.appendChild(floating);
})();
