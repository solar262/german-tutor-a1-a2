// Guardrail for beginner-facing German spelling.
// We display correct German with ß/umlauts, while still letting the app explain keyboard alternatives elsewhere.
(function(){
  const fixes = [
    [/\bIch heise Sam\.?/g, 'Ich heiße Sam.'],
    [/\bIch heisse Sam\.?/g, 'Ich heiße Sam.'],
    [/\bich heise sam\.?/g, 'Ich heiße Sam.'],
    [/\bich heisse sam\.?/g, 'Ich heiße Sam.'],
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
  function run(){
    walk(document.body);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run);
  else run();
  new MutationObserver(run).observe(document.documentElement,{childList:true,subtree:true,characterData:true});
})();
