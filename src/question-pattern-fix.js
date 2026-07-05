// Memory-support layer: removes misleading model lines, adds multiple choice, Daily 5, Emergency German, and I-forgot rescue.
(function(){
  const answers={
    'Translate: My name is Sam.':'Mein Name ist Sam.',
    'Complete: Ich ___ Anna.':'bin','Type hello in German.':'hallo','Translate: I am Anna.':'Ich bin Anna.',
    'Translate: I am at home.':'Ich bin zu Hause.','Translate: the room.':'das Zimmer','Translate: Where is the bathroom?':'Wo ist das Bad?','Translate: The room is clean.':'Das Zimmer ist sauber.',
    'Translate: I need a towel.':'Ich brauche ein Handtuch.','Translate: Where is the key?':'Wo ist der Schlüssel?','Translate: I need soap.':'Ich brauche Seife.',
    'Translate: I would like water.':'Ich möchte Wasser.','Translate: I drink coffee.':'Ich trinke Kaffee.','Translate: I have a problem.':'Ich habe ein Problem.','Translate: It is broken.':'Es ist kaputt.',
    'Translate: Hello, how are you?':'Hallo, wie geht es dir?','Translate: I am good, thanks.':'Mir geht es gut, danke.','Translate: Do you have time today?':'Hast du heute Zeit?',
    'Translate: I would like a coffee, please.':'Ich möchte einen Kaffee, bitte.','Translate: Can I pay?':'Kann ich bezahlen?',
    'Translate: Excuse me, I do not understand.':'Entschuldigung, ich verstehe nicht.','Translate: Again, please.':'Noch einmal, bitte.','Translate: Slowly, please.':'Langsam, bitte.'
  };
  const daily=['Ich verstehe nicht.','Können Sie mir bitte helfen?','Wo ist das Bad?','Ich brauche ein Handtuch.','Einen Moment, bitte.'];
  const emergency=['Ich verstehe nicht.','Können Sie mir bitte helfen?','Langsam, bitte.','Noch einmal, bitte.','Wo ist das Bad?','Ich habe ein Problem.','Einen Moment, bitte.'];
  const pool=Object.values(answers).concat(['Danke.','Guten Morgen.','Ich bin neu hier.','Ich bin fertig.']);
  function say(text){if(!('speechSynthesis'in window))return;speechSynthesis.cancel();let u=new SpeechSynthesisUtterance(text);u.lang='de-DE';u.rate=.86;speechSynthesis.speak(u)}
  function shuffle(a){return a.slice().sort(()=>Math.random()-.5)}
  function setAnswer(input,value){input.value=value;input.dispatchEvent(new Event('input',{bubbles:true}));input.dispatchEvent(new Event('change',{bubbles:true}))}
  function qText(card){let b=card.querySelector('b');return b?b.textContent.replace(/^\d+\.\s*/,'').trim():''}
  function phraseState(p){let data=JSON.parse(localStorage.getItem('phraseConfidence')||'{}');return data[p]||'New'}
  function setPhraseState(p,s){let data=JSON.parse(localStorage.getItem('phraseConfidence')||'{}');data[p]=s;localStorage.setItem('phraseConfidence',JSON.stringify(data))}
  function choiceBox(card,input,answer){
    let box=document.createElement('div');box.className='mcBox';box.style.cssText='background:#07111f;border:1px solid #2a3c58;border-radius:18px;padding:12px;margin:10px 0;display:grid;gap:8px';
    let label=document.createElement('b');label.textContent='Choose first, then repeat out loud:';label.style.color='#facc15';box.appendChild(label);
    shuffle([answer,...shuffle(pool.filter(x=>x!==answer)).slice(0,3)]).forEach(choice=>{let btn=document.createElement('button');btn.type='button';btn.textContent=choice;btn.onclick=()=>{setAnswer(input,choice);box.querySelectorAll('button').forEach(x=>x.style.outline='0');btn.style.outline=choice===answer?'3px solid #22c55e':'3px solid #facc15';if(choice===answer){say(choice);setPhraseState(choice,'Almost')}};box.appendChild(btn)});
    let listen=document.createElement('button');listen.type='button';listen.textContent='🔊 Listen to correct answer';listen.onclick=()=>say(answer);box.appendChild(listen);
    let forgot=document.createElement('button');forgot.type='button';forgot.textContent='🧠 I forgot — rescue me';forgot.onclick=()=>rescue(card,input,answer);box.appendChild(forgot);
    return box;
  }
  function rescue(card,input,answer){
    let old=card.querySelector('.memoryRescue');if(old)old.remove();
    let box=document.createElement('div');box.className='memoryRescue';box.style.cssText='background:#211a07;border:1px solid rgba(250,204,21,.45);border-radius:18px;padding:12px;margin:10px 0;color:#fde68a;display:grid;gap:8px;font-weight:800';
    let chunks=answer.split(' ');box.innerHTML='<b style="color:#facc15">Memory rescue</b><span>Do not panic. Learn it in tiny chunks:</span>';
    chunks.forEach((c,i)=>{let b=document.createElement('button');b.type='button';b.textContent=(i+1)+'. '+c;b.onclick=()=>say(c);box.appendChild(b)});
    let full=document.createElement('button');full.type='button';full.textContent='🔊 Listen to full phrase';full.onclick=()=>say(answer);box.appendChild(full);
    let fill=document.createElement('button');fill.type='button';fill.textContent='Put answer in box';fill.onclick=()=>setAnswer(input,answer);box.appendChild(fill);
    card.insertBefore(box,input);
  }
  function addChoices(){
    document.querySelectorAll('.testcard .mistake').forEach(card=>{
      card.querySelectorAll('.model').forEach(el=>el.remove());
      if(card.querySelector('.mcBox'))return;
      let input=card.querySelector('input'),answer=answers[qText(card)];if(!input||!answer)return;
      input.parentNode.insertBefore(choiceBox(card,input,answer),input);
    })
  }
  function floatingPanel(title,phrases){
    let old=document.getElementById('memoryPanel');if(old)old.remove();
    let p=document.createElement('div');p.id='memoryPanel';p.style.cssText='position:fixed;left:10px;right:10px;bottom:92px;z-index:999;background:#0b1424;border:1px solid #355174;border-radius:20px;padding:14px;box-shadow:0 18px 60px #000b;max-width:560px;margin:auto;color:white;display:grid;gap:8px';
    p.innerHTML='<b style="color:#facc15">'+title+'</b><small style="color:#a8b6cc">Tap a phrase to hear it. Tap Strong when you know it.</small>';
    phrases.forEach(x=>{let row=document.createElement('div');row.style.cssText='display:grid;grid-template-columns:1fr auto auto;gap:6px;align-items:center;background:#07111f;border:1px solid #2a3c58;border-radius:14px;padding:8px';row.innerHTML='<span>'+x+'<br><small style="color:#facc15">'+phraseState(x)+'</small></span>';let l=document.createElement('button');l.textContent='🔊';l.onclick=()=>say(x);let s=document.createElement('button');s.textContent='Strong';s.onclick=()=>{setPhraseState(x,'Strong');row.querySelector('small').textContent='Strong'};row.appendChild(l);row.appendChild(s);p.appendChild(row)});
    let close=document.createElement('button');close.textContent='Close';close.onclick=()=>p.remove();p.appendChild(close);document.body.appendChild(p);
  }
  function addMemoryButtons(){
    if(document.getElementById('memoryBar'))return;
    let bar=document.createElement('div');bar.id='memoryBar';bar.style.cssText='position:fixed;left:50%;top:112px;transform:translateX(-50%);z-index:45;display:flex;gap:7px;background:#07111fd9;border:1px solid #2a3c58;border-radius:999px;padding:6px;box-shadow:0 10px 35px #0008';
    let d=document.createElement('button');d.textContent='Daily 5';d.onclick=()=>floatingPanel('Today’s 5 phrases',daily);
    let e=document.createElement('button');e.textContent='Emergency';e.onclick=()=>floatingPanel('Emergency German',emergency);
    bar.appendChild(d);bar.appendChild(e);document.body.appendChild(bar);
  }
  function polishRoleplay(){
    const text=document.body.innerText||'';if(!text.includes('Ist alles okay?'))return;let card=document.querySelector('.roleCard');
    if(card&&!card.querySelector('.situationBox')){let box=document.createElement('div');box.className='situationBox';box.style.cssText='background:#10233b;border:1px solid #355174;color:#dbeafe;border-radius:18px;padding:12px;margin:0 0 12px;font-weight:800';box.innerHTML='<b style="color:#facc15">Situation: Problem at home</b><br>Your neighbour asks if everything is okay.<br><span style="color:#facc15">Goal:</span> Say no, then say you have a problem.';card.insertBefore(box,card.firstChild)}
    document.querySelectorAll('.coachBox p').forEach(p=>{if(p.textContent.includes('Say that you have a problem'))p.textContent='Say no, then say you have a problem.'});
  }
  function run(){addChoices();addMemoryButtons();polishRoleplay()}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);else run();
  new MutationObserver(run).observe(document.documentElement,{childList:true,subtree:true});
})();
