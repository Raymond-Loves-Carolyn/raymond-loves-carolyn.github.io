document.addEventListener("DOMContentLoaded", function () {
    var cover = document.getElementById("bookCover");
    var interior = document.getElementById("bookInterior");
    var backCover = document.getElementById("backCover");
    var openButton = document.getElementById("openBook");
    var readAgain = document.getElementById("readAgain");
    var prevButton = document.getElementById("prevPage");
    var nextButton = document.getElementById("nextPage");
    var leftImage = document.getElementById("leftPage");
    var rightImage = document.getElementById("rightPage");
    var label = document.getElementById("pageLabel");
    var pageNodes = document.querySelectorAll("#storybookPages [data-src]");

    if (!cover || !interior || !openButton || !pageNodes.length) return;

    var pages = Array.prototype.map.call(pageNodes, function (node) {
        return {
            src: node.getAttribute("data-src"),
            label: node.getAttribute("data-label") || ""
        };
    });

    var index = 0;
    var mobile = window.matchMedia("(max-width: 768px)");

    function setPage(img, page) {
        var holder = img.parentElement;
        if (!page) {
            img.removeAttribute("src");
            holder.classList.add("is-empty");
            return;
        }
        img.src = page.src;
        img.alt = page.label;
        holder.classList.remove("is-empty");
    }

    function render() {
        if (mobile.matches) {
            setPage(rightImage, pages[index]);
            label.textContent = pages[index] ? pages[index].label : "";
            prevButton.textContent = index === 0 ? "‹ Cover" : "‹ Previous";
            nextButton.textContent = index >= pages.length - 1 ? "Back Cover ›" : "Next ›";
        } else {
            setPage(leftImage, pages[index]);
            setPage(rightImage, pages[index + 1]);
            var a = pages[index], b = pages[index + 1];
            label.textContent = a && b && a.label === b.label ? a.label :
                [a && a.label, b && b.label].filter(Boolean).join(" · ");
            prevButton.textContent = index === 0 ? "‹ Cover" : "‹ Previous";
            nextButton.textContent = index + 2 >= pages.length ? "Back Cover ›" : "Next ›";
        }
    }

    function showCover() {
        interior.hidden = true;
        backCover.hidden = true;
        cover.hidden = false;
    }

    function showInterior() {
        cover.hidden = true;
        backCover.hidden = true;
        interior.hidden = false;
        render();
    }

    function showBackCover() {
        cover.hidden = true;
        interior.hidden = true;
        backCover.hidden = false;
    }

    openButton.addEventListener("click", function () {
        cover.classList.add("is-opening");
        var delay = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 520;
        window.setTimeout(function () {
            cover.classList.remove("is-opening");
            showInterior();
        }, delay);
    });

    prevButton.addEventListener("click", function () {
        if (index === 0) return showCover();
        index = Math.max(0, index - (mobile.matches ? 1 : 2));
        render();
    });

    nextButton.addEventListener("click", function () {
        var step = mobile.matches ? 1 : 2;
        if (index + step >= pages.length) return showBackCover();
        index += step;
        render();
    });

    readAgain.addEventListener("click", function () {
        index = 0;
        showCover();
    });

    if (mobile.addEventListener) {
        mobile.addEventListener("change", function () {
            index = mobile.matches ? index : Math.floor(index / 2) * 2;
            if (!interior.hidden) render();
        });
    }

    render();
});
