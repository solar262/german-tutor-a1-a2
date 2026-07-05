// Remove misleading test model lines.
// The lesson-level model sentence is not always the right pattern for each test question.
// Tests should show question + answer box + tutor hint only.
(function(){
  function run(){
    document.querySelectorAll('.model').forEach(el=>{
      el.remove();
    });
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',run); else run();
  new MutationObserver(run).observe(document.documentElement,{childList:true,subtree:true});
})();
