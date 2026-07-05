// Beginner multiple-choice layer for spoken German practice.
(function(){
  const answers={
    'Translate: My name is Sam.':'Mein Name ist Sam.',
    'Complete: Ich ___ Anna.':'bin',
    'Type hello in German.':'hallo',
    'Translate: I am Anna.':'Ich bin Anna.',
    'Translate: I have time.':'Ich habe Zeit.',
    'Translate: I am tired.':'Ich bin müde.',
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
  const pool=Object.values(answers).concat(['Danke.','Guten Morgen.','Ich bin neu hier.','Ich bin fertig.','Wo ist die Kasse?','Ich brauche Hilfe.']);
  function say(text){if(!('speechSynthesis' in window))return; speechSynthesis.cancel(); const u=new SpeechSynthesisUtterance(text); u.lang='de-DE'; u.rate=.88; speechSynthesis.speak(u);}
  function shuffle(arr){return arr.slice().sort(()=>Math.random()-.5)}
  function setAnswer(input,value){input.value=value; input.dispatchEvent(new Event('input',{bubbles:true})); input.dispatchEvent(new Event('change',{bubbles:true}));}
  function questionText(card){const b=card.querySelector('b'); return b?b.textContent.replace(/^\d+\.\s*/,'').trim():''}
  function addChoices(){
    document.querySelectorAll('.testcard .mistake').forEach(card=>{
      if(card.querySelector('.mcBox'))return;
      const input=card.querySelector('input'); if(!input)return;
      const answer=answers[questionText(card)]; if(!answer)return;
      const box=document.createElement('div'); box.className='mcBox';
      const label=document.createElement('b'); label.textContent='Choose first, then repeat out loud:'; box.appendChild(label);
      const choices=shuffle([answer,...shuffle(pool.filter(x=>x!==answer)).slice(0,3)]);
      choices.forEach(choice=>{
        const btn=document.createElement('button'); btn.type='button'; btn.textContent=choice;
        btn.onclick=()=>{setAnswer(input,choice); box.querySelectorAll('button').forEach(x=>x.classList.remove('right','wrong')); btn.classList.add(choice===answer?'right':'wrong'); if(choice===answer)say(choice);};
        box.appendChild(btn);
      });
      const listen=document.createElement('button'); listen.type='button'; listen.textContent='🔊 Listen to correct answer'; listen.onclick=()=>say(answer); box.appendChild(listen);
      input.parentNode.insertBefore(box,input);
    });
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',addChoices);else addChoices();
  new MutationObserver(addChoices).observe(document.body,{childList:true,subtree:true});
})();
