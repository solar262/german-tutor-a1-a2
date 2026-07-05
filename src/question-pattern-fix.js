// Remove misleading test model lines and add beginner multiple-choice help.
(function(){
  const answers={
    'Translate: My name is Sam.':'Mein Name ist Sam.',
    'Complete: Ich ___ Anna.':'bin',
    'Type hello in German.':'hallo',
    'Translate: I am Anna.':'Ich bin Anna.',
    'Translate: I am at home.':'Ich bin zu Hause.',
    'Translate: the room.':'das Zimmer',
    'Translate: Where is the bathroom?':'Wo ist das Bad?',
    'Translate: The room is clean.':'Das Zimmer ist sauber.',
    'Translate: I need a towel.':'Ich brauche ein Handtuch.',
    'Translate: Where is the key?':'Wo ist der Schlüssel?',
    'Translate: I need soap.':'Ich brauche Seife.',
    'Translate: I would like water.':'Ich möchte Wasser.',
    'Translate: I drink coffee.':'Ich trinke Kaffee.',
    'Translate: I have a problem.':'Ich habe ein Problem.',
    'Translate: It is broken.':'Es ist kaputt.',
    'Translate: Hello, how are you?':'Hallo, wie geht es dir?',
    'Translate: I am good, thanks.':'Mir geht es gut, danke.',
    'Translate: Do you have time today?':'Hast du heute Zeit?',
    'Translate: I would like a coffee, please.':'Ich möchte einen Kaffee, bitte.',
    'Translate: Can I pay?':'Kann ich bezahlen?',
    'Translate: Excuse me, I do not understand.':'Entschuldigung, ich verstehe nicht.',
    'Translate: Again, please.':'Noch einmal, bitte.',
    'Translate: Slowly, please.':'Langsam, bitte.'
  };
  const pool=Object.values(answers).concat(['Danke.','Guten Morgen.','Ich bin neu hier.','Ich bin fertig.']);
  function say(text){if(!('speechSynthesis'in window))return;speechSynthesis.cancel();let u=new SpeechSynthesisUtterance(text);u.lang='de-DE';u.rate=.88;speechSynthesis.speak(u)}
  function shuffle(a){return a.slice().sort(()=>Math.random()-.5)}
  function setAnswer(input,value){input.value=value;input.dispatchEvent(new Event('input',{bubbles:true}));input.dispatchEvent(new Event('change',{bubbles:true}))}
  function qText(card){let b=card.querySelector('b');return b?b.textContent.replace(/^\d+\.\s*/,'').trim():''}
  function addChoices(){
    document.querySelectorAll('.testcard .mistake').forEach(card=>{
      card.querySelectorAll('.model').forEach(el=>el.remove());
      if(card.querySelector('.mcBox'))return;
      let input=card.querySelector('input'),answer=answers[qText(card)];if(!input||!answer)return;
      let box=document.createElement('div');box.className='mcBox';box.style.cssText='background:#07111f;border:1px solid #2a3c58;border-radius:18px;padding:12px;margin:10px 0;display:grid;gap:8px';
      let label=document.createElement('b');label.textContent='Choose first, then repeat out loud:';label.style.color='#facc15';box.appendChild(label);
      shuffle([answer,...shuffle(pool.filter(x=>x!==answer)).slice(0,3)]).forEach(choice=>{let btn=document.createElement('button');btn.type='button';btn.textContent=choice;btn.onclick=()=>{setAnswer(input,choice);box.querySelectorAll('button').forEach(x=>x.style.outline='0');btn.style.outline=choice===answer?'3px solid #22c55e':'3px solid #facc15';if(choice===answer)say(choice)};box.appendChild(btn)});
      let listen=document.createElement('button');listen.type='button';listen.textContent='🔊 Listen to correct answer';listen.onclick=()=>say(answer);box.appendChild(listen);
      input.parentNode.insertBefore(box,input);
    })
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',addChoices);else addChoices();
  new MutationObserver(addChoices).observe(document.documentElement,{childList:true,subtree:true});
})();
