document.addEventListener('DOMContentLoaded', function() {
  const searchButton = document.querySelector('.searchBtn');
  const searchBar = document.querySelector('.searchBar');
  const searchInput = document.getElementById('searchInput');
  const searchClose = document.getElementById('searchClose');

  if (searchButton) {
    searchButton.addEventListener('click', function(){
      searchBar.style.visibility = 'visible';
      searchBar.classList.add('open');
      this.setAttribute('aria-expended', 'true');
      searchInput.focus();
    });
  
    searchClose.addEventListener('click', function() {
      searchBar.style.visibility = 'hidden';
      searchBar.classList.remove('open');
      this.setAttribute('aria-expended', 'false');
    })
  }
});