/* ***** BEGIN LICENSE BLOCK *****
 *   Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 * 
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is Ask Which Browser Window.
 *
 * The Initial Developer of the Original Code is
 * Bryan Clark.
 * Portions created by the Initial Developer are Copyright (C) 2010
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 * 
 * ***** END LICENSE BLOCK ***** */

var askwhichbrowserwindow = {
  onLoad: function() {
    // initialization code
    this.initialized = true;
    this.strings = document.getElementById("askwhichbrowserwindow-strings");

    eval('nsBrowserAccess.prototype.openURI = ' + nsBrowserAccess.prototype.openURI.toString().replace(
        'newWindow = browser.contentWindow;',
        'newWindow = browser.contentWindow;' +
        'var windowCount = 0;' +
        'var windows = Cc["@mozilla.org/appshell/window-mediator;1"].getService(Ci.nsIWindowMediator).getEnumerator("navigator:browser");' +
        'while (windows.hasMoreElements()) {' +
          'windowCount++;' +
          'windows.getNext();' +
        '}' +
        'browser.setAttribute("guessedWindow", (windowCount > 1));' +
        'let event = document.createEvent("Events");' +
        'event.initEvent("GuessedWindowEvent", true, true);' +
        'tab.dispatchEvent(event);' +
        'Application.console.log("windowCount: " + windowCount);' +
        'Application.console.log("guessedWindow: " + (windowCount > 1));'
        ));

    gBrowser.tabContainer.addEventListener("GuessedWindowEvent", this.windowGuessed, false);
  },

  windowGuessed: function(event) {
    Application.console.log("askwhichbrowserwindow.windowGuessed")
    let browser = gBrowser.getBrowserForTab(event.target);
    Application.console.log("browser.guessedWindow : " + browser.getAttribute("guessedWindow"));
    if (browser.getAttribute("guessedWindow") == "true") {
      Application.console.log("askwhichbrowserwindow.windowGuessed.guessedWindow.true")

      let buttons = [{
      label: "Move Tab to other Window",
      accessKey: "M",
      callback: function (aNotification, aButton) { alert("Move it!"); }
      }];

      let notificationBox = gBrowser.getNotificationBox(browser);
      notificationBox.appendNotification("The tab opened in this window because I don't know any better.  Do you want to move me to a better window?",
                                        "guessed-window",
                                        "chrome://browser/skin/Info.png",
                                        notificationBox.PRIORITY_INFO_LOW,
                                        buttons
                                        );

    }
  },
};
window.addEventListener("load", function(e) { askwhichbrowserwindow.onLoad(e); }, false);
