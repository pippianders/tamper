/* eslint-env browser, jquery, greasemonkey */
/* eslint-disable max-len */

// ==UserScript==
// @name         Github - Inactive Development Warning
// @namespace    https://zachhardesty.com
// @version      0.1.0
// @description  display big banner if project's last commit over 6 months ago and giant banner if over 1 year ago
// @author       Zach Hardesty
// @match        https://github.com/*/*
// @license     GPL-3.0-only; https://www.gnu.org/licenses/gpl-3.0.en.html
// @copyright   2019, Zach Hardesty (https://zachhardesty.com/)
// ==/UserScript==

(function calcAge() {
	const date = new Date(document.querySelector('.repository-content .commit-tease').lastElementChild.lastElementChild.firstElementChild.attributes[0].textContent)
	const dif = (Date.now() - date.getUTCMilliseconds()) / 1000 / 60 / 60 / 24 // in days
	if (dif > 365) { renderWarning() } else if (dif > 182.5) { renderCaution() }
})()

/**
 * @param {HTMLElement} el - target
 */
function displayMessage(el) {
	document
		.querySelector('.repohead-details-container')
		.insertAdjacentElement('afterend', el)
}

function renderWarning() {
	const banner = document.createElement('div')
	banner.setAttribute('style', `
    background-color: red;
    height: 100px;
    margin-bottom: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    font-size: 36px;
  `)

	banner.textContent = "WARNING: repo hasn't received an update in 1+ year(s)"

	displayMessage(banner)
}

function renderCaution() {
	const banner = document.createElement('div')
	banner.setAttribute('style', `
    background-color: yellow;
    height: 50px;
    margin-bottom: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 24px;
  `)

	banner.textContent = "Caution: repo hasn't received an update in 6+ months"

	displayMessage(banner)
}
