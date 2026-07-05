// Guardrail for beginner-facing German accuracy.
// Display the textbook translation for "My name is Sam" while still allowing the natural phrase "Ich heiße Sam" elsewhere.
(function(){
  const fixes = [
    [/Translate: My name is Sam\./g, 'Translate: My name is Sam.'],
    [/\bIch heise Sam\.?/g, 'Mein Name ist Sam.'],
    [/\bIch heisse Sam\.?/g, 'Mein Name ist Sam.'],
    [/\bIch heiße Sam\.?/g, 'Mein Name ist Sam.'],
    [/\bich heise sam\.?/g, 'Mein Name ist Sam.'],
    [/\bich heisse sam\.?/g, 'Mein Name ist Sam.'],
    [/\bich heiße sam\.?/g, 'Mein Name ist Sam.'],
    [/\bich heise\b/g, 'ich heiße'],
    [/\bich heisse\b/g, 'ich heiße'],
    [/\bIch heise\b/g, 'Ich heiße'],
    [/\bIch heisse\b/g, 'Ich heiße']
  ];
  function fixTextNode(node){
    let text = node.nodeValue;
    let next = text;
    for (const [from,to] of fixes) next = next.replace(from,to);
    if (next !== text) node.nodeValue = next;
  }
  function walk(root){
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) fixTextNode(node);
  }
  function addNameNote(){
    if(document.getElementById('name-translation-note')) return;
    const bodyText = document.body && document.body.innerText || '';
    if(!bodyText.includes('Mein Name ist Sam.')) return;
    const note=document.createElement('div');
    note.id='name-translation-note';
    note.style.cssText='position:fixed;left:12px;right:12px;bottom:92px;z-index:998;background:#10233b;border:1px solid #355174;color:#dbeafe;border-radius:16px;padding:10px 12px;font:700 13px system-ui,Arial;box-shadow:0 12px 40px #0008;max-width:520px;margin:auto;';
    note.innerHTML='Textbook: <b>Mein Name ist Sam.</b><br>Natural spoken German: <b>Ich heiße Sam.</b>';
    note.addEventListener('click',()=>note.remove());
    document.body.appendChild(note);
    setTimeout(()=>note.remove(),9000);
  }
  function run(){
    walk(document.body);
    addNameNote();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run);
  else run();
  new MutationObserver(run).observe(document.documentElement,{childList:true,subtree:true,characterData:true});
})();
