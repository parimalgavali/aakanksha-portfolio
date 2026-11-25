const filters = document.querySelectorAll('[data-filter]');
filters.forEach(button => button.addEventListener('click', () => {
  filters.forEach(item => { const selected = item === button; item.classList.toggle('active', selected); item.setAttribute('aria-pressed', String(selected)); });
  document.querySelectorAll('[data-category]').forEach(project => { project.hidden = button.dataset.filter !== 'all' && project.dataset.category !== button.dataset.filter; });
}));
document.querySelector('.copy-email').addEventListener('click', async () => {
  const status = document.querySelector('.copy-status');
  try { await navigator.clipboard.writeText('aakankshasuryawanshi16@gmail.com'); status.textContent = 'Email copied. Let’s start a conversation.'; }
  catch { status.textContent = 'aakankshasuryawanshi16@gmail.com'; }
});
document.querySelector('#year').textContent = new Date().getFullYear();
