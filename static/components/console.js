// Open console
document.addEventListener('keydown', (event) => {
  if (event.key === '`' || event.key === '~') { // Grave accent (`) or tilde (~)
    const container = document.getElementById('console');
    if (container) container.classList.toggle('open');
  }
});
