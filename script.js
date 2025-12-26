(function(){
  const prevEl = document.getElementById('prev');
  const currEl = document.getElementById('current');
  let prev = '';
  let curr = '';
  let op = null;

  function updateDisplay(){
    prevEl.textContent = prev ? (prev + (op ? ' ' + op : '')) : '';
    currEl.textContent = curr || '0';
  }

  function appendNumber(n){
    if(n === '.' && curr.includes('.')) return;
    if(n === '.' && curr === '') curr = '0.';
    else curr = (curr === '0' && n !== '.') ? n : curr + n;
    updateDisplay();
  }

  function chooseOperator(operator){
    if(!curr) {
      // allow changing operator if prev exists
      if(prev) op = operator;
      updateDisplay();
      return;
    }
    if(prev){
      compute();
    } else {
      prev = curr;
      curr = '';
    }
    op = operator;
    updateDisplay();
  }

  function compute(){
    if(!prev || !curr) return;
    const a = parseFloat(prev);
    const b = parseFloat(curr);
    let result = 0;
    switch(op){
      case '+': result = a + b; break;
      case '-': result = a - b; break;
      case '*': result = a * b; break;
      case '/': result = b === 0 ? 'Error' : a / b; break;
      default: return;
    }
    prev = String(result);
    curr = '';
    op = null;
    updateDisplay();
  }

  function clearAll(){ prev=''; curr=''; op=null; updateDisplay(); }
  function backspace(){ if(curr) curr = curr.slice(0,-1); else if(op) op = null; else if(prev) prev = prev.slice(0,-1); updateDisplay(); }

  // percent: treat current as percentage of previous if prev exists, else divide by 100
  function percent(){
    if(curr){
      if(prev && op){
        // e.g. 200 + 10% -> 200 + (200 * 10 /100) => convert curr to percent of prev
        curr = String((parseFloat(prev) * parseFloat(curr)) / 100);
      } else {
        curr = String(parseFloat(curr) / 100);
      }
    }
    updateDisplay();
  }

  document.querySelectorAll('[data-num]').forEach(b=> b.addEventListener('click', e=> appendNumber(e.target.getAttribute('data-num'))));
  document.querySelectorAll('[data-op]').forEach(b=> b.addEventListener('click', e=> chooseOperator(e.target.getAttribute('data-op'))));

  document.getElementById('clear').addEventListener('click', clearAll);
  document.getElementById('back').addEventListener('click', backspace);
  document.getElementById('percent').addEventListener('click', percent);
  document.getElementById('equals').addEventListener('click', ()=>{ compute(); });

  // keyboard support
  window.addEventListener('keydown', (e)=>{
    if(e.key >= '0' && e.key <= '9') appendNumber(e.key);
    else if(e.key === '.') appendNumber('.')
    else if(e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') chooseOperator(e.key);
    else if(e.key === 'Enter' || e.key === '=') { e.preventDefault(); compute(); }
    else if(e.key === 'Backspace') backspace();
    else if(e.key === 'Escape') clearAll();
    else if(e.key === '%') percent();
  });

  // initialize
  clearAll();
})();