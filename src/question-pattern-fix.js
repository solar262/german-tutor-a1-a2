// Fix misleading test wording: the test card was showing the lesson model as a "Model pattern".
// That is not always the pattern for the current question, so show it as a lesson example instead.
(function(){
  function run(){
    document.querySelectorAll('.model').forEach(el=>{
      if(el.textContent && el.textContent.includes('Model pattern:')){
        el.textContent = el.textContent.replace('Model pattern:', 'Lesson example:');
      }
    });
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',run); else run();
  new MutationObserver(run).observe(document.documentElement,{childList:true,subtree:true,characterData:true});
})();
