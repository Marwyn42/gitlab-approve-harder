// ==UserScript==
// @name     Gitlab Approve Harder
// @description Approve a merge request multiple times!
// @version  1
// @grant    none
// @match *://*/*merge_requests/*
// @require https://raw.githubusercontent.com/uzairfarooq/arrive/master/minified/arrive.min.js
// @downloadURL https://raw.githubusercontent.com/tux3/gitlab-approve-harder/master/gitlab-approve-harder.user.js
// ==/UserScript==

function unapprove() {
  var e = document.querySelector('meta[name=csrf-token]');
  let csrfToken = null !== e ? e.getAttribute('content') : null

  let x = new XMLHttpRequest();
  x.open('DELETE', document.location+'/approvals', false);
  x.setRequestHeader('X-CSRF-Token', csrfToken);
  x.setRequestHeader('Accept', 'application/json, text/plain, */*');
  x.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
  x.send(null);
}

function approve() {
  var e = document.querySelector('meta[name=csrf-token]');
  let csrfToken = null !== e ? e.getAttribute('content') : null

  return new Promise(function (resolve, reject) {
    let x = new XMLHttpRequest();
    x.open('POST', document.location+'/approvals', true);
    x.setRequestHeader('X-CSRF-Token', csrfToken);
    x.setRequestHeader('Accept', 'application/json, text/plain, */*');
    x.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    x.onload = resolve();
    x.send(null);
  });
}

function approveHard() {
  console.log("Gitlab userscript: Approving harder");
  unapprove();
  let reqs = [];
  for (let i=1; i<10; ++i)
    reqs.push(approve());
  Promise.all(reqs).then(function() {
    location.reload();
  });
}

document.arrive(".mr-widget-approvals-container", function() {
  var approvebtn = document.createElement("button");
  approvebtn.classList.add('btn');
  approvebtn.appendChild(document.createTextNode("Approve harder"));
  approvebtn.onclick = approveHard;
  this.appendChild(approvebtn);
});
