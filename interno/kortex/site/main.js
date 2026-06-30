document.addEventListener('DOMContentLoaded', function () {
  var toggle = document.getElementById('menuToggle');
  var mobileNav = document.getElementById('mobileNav');

  toggle.addEventListener('click', function () {
    toggle.classList.toggle('open');
    mobileNav.classList.toggle('open');
  });

  mobileNav.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      toggle.classList.remove('open');
      mobileNav.classList.remove('open');
    });
  });
});
