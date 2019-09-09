/* eslint-env browser, jquery, greasemonkey */
/* eslint-disable max-len */
/* global googleDocsUtil */

// ==UserScript==
// @name         Google Docs - Word Count (With Options)
// @namespace    https://zachhardesty.com
// @version      0.2
// @description  adds a word counter with options to Google Docs
// @author       Zach Hardesty
// @match        https://docs.google.com/document/*
// @require      https://raw.githubusercontent.com/JensPLarsen/ChromeExtension-GoogleDocsUtil/master/googleDocsUtil.js
// @grant        none
// ==/UserScript==

// heavy inspiration from:
// https://greasyfork.org/en/scripts/22057-google-docs-wordcount/code
// https://stackoverflow.com/questions/951021/what-is-the-javascript-version-of-sleep

// strikingly complex (uses DOM bounding boxes) to get currently selected text:
// may implement only necessary functions to save space, library size: (15.4 KB)
// https://github.com/JensPLarsen/ChromeExtension-GoogleDocsUtil

(function displayCount() {
	// words not counted between these when true
	const BRACKETS = true
	const PARENTHESIS = true
	const QUOTES = true
	const MISC = true // skips works cited, personal titles

	const SELECTED = true // if selected text present, word count only counts it

	const display = document.createElement('div')
	display.id = 'zh-display'
	display.style = `
    position: fixed;
    width: 100%;
    left: 0px;
    bottom: 0px;
    color: rgba(0,0,0,.7);
    height: 15px;
    background-color: #ededee;
    z-index: 100;
    font-family: Arial;
    font-size: 12px;
    padding-top: 5px;
    padding-left: 5px;
    border-top: 1px solid #d9d9d9;
  `
	document.querySelector('body').append(display)

	/**
  * update the word count
  */
	async function setCount() {
		const doc = googleDocsUtil.getGoogleDocument()
		let selected = doc.selectedText

		const pages = document.querySelector('.kix-paginateddocumentplugin').children[1].children
		let body = ''
		Array.from(pages).forEach((page) => {
			const content = page.lastElementChild.firstElementChild
			const text = content.textContent

			// pages that are unloaded will appear to have no text
			// add a marker to the cumulative body to indicate that
			// a word count should not be displayed
			if (text === '') body += ' ~~ '
			body += text
		})

		// clean extra spaces
		body = body.replace(/\u00A0/g, ' ').trim()

		// generate regex from settings
		// must escape \'s in JS
		// in standard regex form:
		//   /(“(.(?!“))+”)|(\((.(?!\())+\)|\[(.(?!\[))+\])
		//     |Works Cited(\n.*)*|(Unit \d (Primary Source Analysis|Exam: Part \d - #\d+))/g
		const regex = []
		if (BRACKETS) regex.push('\\[(.(?!\\[))+\\]')
		if (PARENTHESIS) regex.push('\\((.(?!\\())+\\)')
		if (QUOTES) regex.push('Works Cited(.|\\n.*)*|(Unit \\d (Primary Source Analysis|Exam: Part \\d( - #\\d+)*))')
		if (MISC) regex.push('(“(.(?!“))+”)')

		// apply regex filtering to body
		regex.forEach((reg) => {
			selected = selected.replace(new RegExp(reg, 'g'), ' ')
		})

		// apply regex filtering to selected text if necessary
		let filtered = body
		regex.forEach((reg) => {
			filtered = filtered.replace(new RegExp(reg, 'g'), ' ')
		})

		// remove extra spaces and line breaks and get counts
		const words = filtered.trim().replace(/\u00A0/g, ' ').replace(/ {2,}/g, ' ').split(' ')
		if (words.includes('~~')) { // empty or unloaded pages present
			document.querySelector('#zh-display').textContent = `Word Count: (scroll to bottom & remove empty pages) | Pages: ${pages.length}`
		} else if (selected.length > 0 && SELECTED) {
			selected = selected.trim().replace(/\u00A0/g, ' ').replace(/ {2,}/g, ' ').split(' ')
			document.querySelector('#zh-display').textContent = `Word Count: ${selected.length} of ${words.length} (selected) | Pages: ${pages.length}`
		} else {
			document.querySelector('#zh-display').textContent = `Word Count: ${words.length} | Pages: ${pages.length}`
		}
	}

	setInterval(setCount, 1000)
})()