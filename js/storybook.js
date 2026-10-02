(function() {
    var c = document.getElementById('bookCover'),
        i = document.getElementById('bookInterior'),
        o = document.getElementById('openBook'),
        x = document.getElementById('closeBook');
    if (!c || !i) return;
    o.addEventListener('click', function() {
        c.classList.add('is-opening');
        setTimeout(function() {
            c.hidden = true;
            i.hidden = false;
            c.classList.remove('is-opening')
        }, window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 520)
    });
    x.addEventListener('click', function() {
        i.hidden = true;
        c.hidden = false
    })
})();
