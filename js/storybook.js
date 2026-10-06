(function () {
    "use strict";

    var cover = document.getElementById("bookCover");
    var interior = document.getElementById("bookInterior");
    var backCover = document.getElementById("backCover");
    var openBook = document.getElementById("openBook");
    var readAgain = document.getElementById("readAgain");
    var prevButton = document.getElementById("prevPage");
    var nextButton = document.getElementById("nextPage");
    var status = document.getElementById("pageStatus");
    var leftPage = document.querySelector(".book-page-left");
    var rightPage = document.querySelector(".book-page-right");
    var leftImage = document.getElementById("leftPageImage");
    var rightImage = document.getElementById("rightPageImage");
    var pageNodes = document.querySelectorAll("#bookPages li");

    if (!cover || !interior || !pageNodes.length) return;

    var pages = Array.prototype.map.call(pageNodes, function (node) {
        return {
            src: node.getAttribute("data-src"),
            title: node.getAttribute("data-title") || ""
        };
    });

    var desktopIndex = 0;
    var mobileIndex = 0;
    var mobileQuery = window.matchMedia("(max-width: 768px)");
    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    function isMobile() {
        return mobileQuery.matches;
    }

    function setImage(pageElement, imageElement, page) {
        if (!page) {
            imageElement.removeAttribute("src");
            imageElement.alt = "";
            pageElement.classList.add("is-empty");
            return;
        }

        imageElement.src = page.src;
        imageElement.alt = page.title || "";
        pageElement.classList.remove("is-empty");
    }

    function renderDesktop() {
        var left = pages[desktopIndex];
        var right = pages[desktopIndex + 1];

        setImage(leftPage, leftImage, left);
        setImage(rightPage, rightImage, right);

        if (left && right && left.title === right.title) {
            status.textContent = left.title;
        } else if (left && right) {
            status.textContent = left.title + " · " + right.title;
        } else if (left) {
            status.textContent = left.title;
        }

        prevButton.textContent = desktopIndex === 0 ? "‹ Cover" : "‹ Previous";
        nextButton.textContent = desktopIndex + 2 >= pages.length ? "Back Cover ›" : "Next ›";
    }

    function renderMobile() {
        var page = pages[mobileIndex];

        setImage(rightPage, rightImage, page);
        status.textContent = page ? page.title : "";

        prevButton.textContent = mobileIndex === 0 ? "‹ Cover" : "‹ Previous";
        nextButton.textContent = mobileIndex + 1 >= pages.length ? "Back Cover ›" : "Next ›";
    }

    function render() {
        if (isMobile()) {
            renderMobile();
        } else {
            renderDesktop();
        }
    }

    function showInterior() {
        cover.hidden = true;
        backCover.hidden = true;
        interior.hidden = false;
        render();
    }

    function showFrontCover() {
        interior.hidden = true;
        backCover.hidden = true;
        cover.hidden = false;
    }

    function showBackCover() {
        interior.hidden = true;
        cover.hidden = true;
        backCover.hidden = false;
    }

    openBook.addEventListener("click", function () {
        cover.classList.add("is-opening");

        window.setTimeout(function () {
            cover.classList.remove("is-opening");
            showInterior();
        }, reduceMotion.matches ? 0 : 520);
    });

    readAgain.addEventListener("click", function () {
        desktopIndex = 0;
        mobileIndex = 0;
        showFrontCover();
    });

    prevButton.addEventListener("click", function () {
        if (isMobile()) {
            if (mobileIndex === 0) {
                showFrontCover();
                return;
            }
            mobileIndex -= 1;
        } else {
            if (desktopIndex === 0) {
                showFrontCover();
                return;
            }
            desktopIndex = Math.max(0, desktopIndex - 2);
        }

        render();
    });

    nextButton.addEventListener("click", function () {
        if (isMobile()) {
            if (mobileIndex + 1 >= pages.length) {
                showBackCover();
                return;
            }
            mobileIndex += 1;
        } else {
            if (desktopIndex + 2 >= pages.length) {
                showBackCover();
                return;
            }
            desktopIndex += 2;
        }

        render();
    });

    function handleResponsiveChange() {
        if (isMobile()) {
            mobileIndex = Math.min(desktopIndex, pages.length - 1);
        } else {
            desktopIndex = Math.floor(mobileIndex / 2) * 2;
        }

        if (!interior.hidden) render();
    }

    if (mobileQuery.addEventListener) {
        mobileQuery.addEventListener("change", handleResponsiveChange);
    } else if (mobileQuery.addListener) {
        mobileQuery.addListener(handleResponsiveChange);
    }

    render();
})();
