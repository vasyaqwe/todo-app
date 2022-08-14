const indicator = document.querySelector('.indicator');
const tabList = document.querySelector('[role="tablist"]');
const tabs = tabList.querySelectorAll('[role="tab"]');

tabs[0].addEventListener('click', () => {
    setTimeout(() => {
        location.reload()
    }, 500);
})

tabs.forEach(tab => {
    tab.addEventListener('click', changeTabPanel);
});
let tabFocus = 0;
tabList.addEventListener('keydown', changeTabFocus);

function changeTabFocus(e) {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        tabs[tabFocus].setAttribute('tabindex', -1);

        if (e.key === 'ArrowLeft') {
            tabFocus--;
            if (tabFocus < 0) {
                tabFocus = tabs.length - 1;
            };
        } else if (e.key === 'ArrowRight') {
            tabFocus++;
            if (tabFocus >= tabs.length) {
                tabFocus = 0;
            };
        };
        tabs[tabFocus].setAttribute('tabindex', 0);
        tabs[tabFocus].focus();
    };
};
function changeTabPanel(e) {
    const targetTab = e.target;
    const targetPanel = targetTab.getAttribute('aria-controls');

    const num = targetTab.getAttribute('data-num');
    indicator.style.left = `${num}px`
    console.log()

    document.querySelector('[aria-selected="true"]').setAttribute("aria-selected", false);
    targetTab.setAttribute('aria-selected', true);

    hideContent('[role="tabpanel"]');
    showContent(targetPanel);
};


function hideContent(content) {
    document.querySelectorAll(content).forEach(item => {
        item.setAttribute('hidden', true);
    });
};

function showContent(target) {
    document.getElementById(target).removeAttribute('hidden');
};