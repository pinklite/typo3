/*
 * This file is part of the TYPO3 CMS project.
 *
 * It is free software; you can redistribute it and/or modify it under
 * the terms of the GNU General Public License, either version 2
 * of the License, or any later version.
 *
 * For the full copyright and license information, please read the
 * LICENSE.txt file that was distributed with this source code.
 *
 * The TYPO3 project - inspiring people to share!
 */
import{MessageUtility}from"@typo3/backend/utility/message-utility.js";import ElementBrowser from"@typo3/backend/element-browser.js";import NProgress from"nprogress";import RegularEvent from"@typo3/core/event/regular-event.js";import Icons from"@typo3/backend/icons.js";import{FileListActionEvent,FileListActionSelector,FileListActionUtility}from"@typo3/filelist/file-list-actions.js";import InfoWindow from"@typo3/backend/info-window.js";import AjaxRequest from"@typo3/core/ajax/ajax-request.js";class BrowseFiles{constructor(){this.importSelection=e=>{e.preventDefault();const t=e.target,n=e.detail.checkboxes;if(!n.length)return;const i=[];if(n.forEach((e=>{if(e.checked){const t=e.closest(FileListActionSelector.elementSelector),n=FileListActionUtility.getResourceForElement(t);"file"===n.type&&n.uid&&i.unshift(n)}})),!i.length)return;Icons.getIcon("spinner-circle",Icons.sizes.small,null,null,Icons.markupIdentifiers.inline).then((e=>{t.classList.add("disabled"),t.innerHTML=e})),NProgress.configure({parent:".element-browser-main-content",showSpinner:!1}),NProgress.start();const o=1/i.length;BrowseFiles.handleNext(i),new RegularEvent("message",(e=>{if(!MessageUtility.verifyOrigin(e.origin))throw"Denied message sent by "+e.origin;"typo3:foreignRelation:inserted"===e.data.actionName&&(i.length>0?(NProgress.inc(o),BrowseFiles.handleNext(i)):(NProgress.done(),ElementBrowser.focusOpenerAndClose()))})).bindTo(window)},new RegularEvent(FileListActionEvent.primary,(e=>{e.preventDefault();const t=e.detail;t.action=FileListActionEvent.select,document.dispatchEvent(new CustomEvent(FileListActionEvent.select,{detail:t}))})).bindTo(document),new RegularEvent(FileListActionEvent.select,(e=>{e.preventDefault();const t=e.detail.resources[0];"file"===t.type&&BrowseFiles.insertElement(t.name,t.uid,!0),"folder"===t.type&&this.loadContent(t)})).bindTo(document),new RegularEvent(FileListActionEvent.show,(e=>{e.preventDefault();const t=e.detail.resources[0];InfoWindow.showItem("_"+t.type.toUpperCase(),t.identifier)})).bindTo(document),new RegularEvent("multiRecordSelection:action:import",this.importSelection).bindTo(document)}static insertElement(e,t,n){return ElementBrowser.insertElement("sys_file",String(t),e,String(t),n)}static handleNext(e){if(e.length>0){const t=e.pop();BrowseFiles.insertElement(t.name,Number(t.uid))}}loadContent(e){if("folder"!==e.type)return;const t=document.location.href+"&contentOnly=1&expandFolder="+e.identifier;new AjaxRequest(t).get().then((e=>e.resolve())).then((e=>{document.querySelector(".element-browser-main-content .element-browser-body").innerHTML=e}))}}export default new BrowseFiles;