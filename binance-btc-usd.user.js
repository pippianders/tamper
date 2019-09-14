
// ==UserScript==
// @name         Binance - Add BTC to USD Conversion
// @namespace    https://zachhardesty.coms
// @version      1.2.0
// @description  rough conversion to get USD val of coin on "balance" & "deposits/withdrawals" page
// @author       Zach Hardesty
// @match        https://www.binance.com/userCenter/balances*
// @match        https://www.binance.com/userCenter/depositWithdraw*
// @require      https://gist.githubusercontent.com/raw/ee7a6b80315148ad1fb6847e72a22313/
// @license     GPL-3.0-only; https://www.gnu.org/licenses/gpl-3.0.en.html
// @copyright   2019, Zach Hardesty (https://zachhardesty.com/)
// ==/UserScript==

function convertBTCToUSD() {
	fetch('https://min-api.cryptocompare.com/data/pricemulti?fsyms=BTC&tsyms=USD')
		.then(resp => resp.json())
		.then((data) => {
			// if el are loaded then add USD value below BTC val
			window.onElementReady('.td.ng-scope', false, e => addBTCConversionRate(e, data.BTC.USD))

			return null
		})
		.catch((error) => {
			console.error(error)
		})
}

/**
 * runs on the addition of each ticker and
 * adds rough dollar conversion using stored global data below BTC value
 *
 * @param {HTMLElement} el - node of most recently added ticker
 * @param {number} BTCUSD - literal value
 */
function addBTCConversionRate(el, BTCUSD) {
	const BTCElement = el.firstElementChild.children[5]

	if (BTCElement.textContent !== '0') {
		// convert to pretty USD format
		const USDVal = (parseFloat(BTCElement.textContent) * BTCUSD)
			.toFixed(2)
			.replace(/(\d)(?=(\d{3})+\.)/g, '$1,')
		const USDValElem = document.createElement('p')

		USDValElem.textContent = `≈ ${USDVal} USD`
		USDValElem.setAttribute('style', 'color: #a0a0a0')
		BTCElement.append(USDValElem)
	}
}

convertBTCToUSD()
