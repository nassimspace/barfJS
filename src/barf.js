// Set barf Function

let barf = async () => await {}

// Single Page Apps for GitHub Pages
// https://github.com/rafrex/spa-github-pages
// Copyright (c) 2016 Rafael Pedicini, licensed under the MIT License
// MAKE SURE YOU INCLUDE <script>recieveRedirect()</script> RIGHT AFTER LOADING BARF.JS IN YOUR HTML

let redirect404 = () => {
 var segmentCount = 0;
 var location = window.location;
 location.replace(
  location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '') +
  location.pathname.split('/').slice(0, 1 + segmentCount).join('/') + '/?p=/' +
  location.pathname.slice(1).split('/').slice(segmentCount).join('/').replace(/&/g, '~and~') +
  (location.search ? '&q=' + location.search.slice(1).replace(/&/g, '~and~') : '') +
  location.hash
 );
}

let recieveRedirect = () => {
 (function(location) {
  if (location.search) {
   var q = {};
   location.search.slice(1).split('&').forEach(function(v) {
    var a = v.split('=');
    q[a[0]] = a.slice(1).join('=').replace(/~and~/g, '&');
   });
   if (q.p !== undefined) {
    window.history.replaceState(null, null,
     location.pathname.slice(0, -1) + (q.p || '') +
     (q.q ? ('?' + q.q) : '') +
     location.hash
    );
   }
  }
 }(window.location));
}

// Associate Routes & Pages to URLs by Bryan Manuele > https://github.com/FermiDirak/fermidirak.github.io
// In order to navigate to different views/pages, you'll need an 'onclick' event handled by navRoute

// <nav class="navbar">
//  <ul class="navbar-list">
//    <li class="navbar-item"><a href="#" onclick="navRoute('/portfolio'); return false;">Portfolio</a></li>
//    <li class="navbar-item"><a href="#" onclick="navRoute('/work'); return false;">Work</a></li>
//    <li class="navbar-item"><a href="#" onclick="navRoute('/contact'); return false;">Contact</a></li>
//  </ul>
// </nav>

let appView = undefined;
let routes = undefined;

window.onpopstate = () => {
 appView.innerHTML = routes[window.location.pathname];
}

let navRoute = (pathName) => {
 window.history.pushState({}, pathName, window.location.origin + pathName);
 appView.innerHTML = routes[pathName];
}

appView.innerHTML = routes[window.location.pathname];


// Passive Event Listeners by Hector Zarco https://github.com/zzarcon/default-passive-events
// More info here too > https://github.com/WICG/EventListenerOptions/blob/gh-pages/explainer.md
// added animation / transition related events


const eventListenerOptionsSupported = () => {
 let supported = false;

 try {
  const opts = Object.defineProperty({}, 'passive', {
   get() {
    supported = true;
   }
  });

  window.addEventListener('test', null, opts);
  window.removeEventListener('test', null, opts);
 } catch (e) {}

 return supported;
}

const defaultOptions = {
 passive: true,
 capture: false
};
const supportedPassiveTypes = [
 'scroll', 'wheel', "animationstart", "animationend", "transitionend", "click", "resize", "loadedmetadata", "loadeddata", "select",
 'touchstart', 'touchmove', 'touchenter', 'touchend', 'touchleave',
 'mouseout', 'mouseleave', 'mouseup', 'mousedown', 'mousemove', 'mouseenter', 'mousewheel', 'mouseover'
];
const getDefaultPassiveOption = (passive, eventName) => {
 if (passive !== undefined) return passive;

 return supportedPassiveTypes.indexOf(eventName) === -1 ? false : defaultOptions.passive;
};

const getWritableOptions = (options) => {
 const passiveDescriptor = Object.getOwnPropertyDescriptor(options, 'passive');

 return passiveDescriptor && passiveDescriptor.writable !== true && passiveDescriptor.set === undefined ?
  Object.assign({}, options) :
  options;
};

const overwriteAddEvent = (superMethod) => {
 EventTarget.prototype.addEventListener = function(type, listener, options) {
  const usesListenerOptions = typeof options === 'object' && options !== null;
  const useCapture = usesListenerOptions ? options.capture : options;

  options = usesListenerOptions ? getWritableOptions(options) : {};
  options.passive = getDefaultPassiveOption(options.passive, type);
  options.capture = useCapture === undefined ? defaultOptions.capture : useCapture;

  superMethod.call(this, type, listener, options);
 };

 EventTarget.prototype.addEventListener._original = superMethod;
};

const supportsPassive = eventListenerOptionsSupported();

if (supportsPassive) {
 const addEvent = EventTarget.prototype.addEventListener;
 overwriteAddEvent(addEvent);
}

// Global Function to add functions or events to window.onload (run several async events on window.onload)


let add2Onload = (func) => {
 let oldonload = window.onload;
 if (typeof window.onload != "function") {
  window.onload = func;
 } else {
  window.onload = () => {
   if (oldonload) {
    oldonload();
   }
   func();
  }
 }
};

// Lazy Load Elements with custom attribute [EXAMPLE= <img src="" data-src="url_to_image.png" data-lazy='1'></img>]
// Make sure to add the ['data-lazy='1'] attribute to your images, iframes & videos, maybe even audio tags as well

add2Onload(() => {

 let lazyElems = [].slice.call(document.querySelectorAll("[data-lazy='1']"));

 if ("IntersectionObserver" in window) {

  let elemObserver = new IntersectionObserver((entries, observer) => {
   entries.forEach((entry) => {
    if (entry.isIntersecting && entry.target.src.length == 0) {
     entry.target.src = entry.target.dataset.src;
     elemObserver.unobserve(entry.target);
    }
   });
  });

  lazyElems.forEach((elem) => {
   elemObserver.observe(elem);
  });

  // if IntersectionObserver not available, load normally

 } else {

  for (let i = 0; i < lazyElems.length; i++) {
   if (lazyElems[i].getAttribute('data-src')) {
    lazyElems[i].setAttribute('src', lazyElems[i].getAttribute('data-src'));
   }
  }
 }

});

// Basic Markdown Parser
(() => {
 let bmp = (md) => {
  return md
   .replace(
    /[\[]{1}([^\]]+)[\]]{1}[\(]{1}([^\)\"]+)(\"(.+)\")?[\)]{1}/g, '<a href="$2" title="$4" target="_blank" rel="noopener">$1</a>'
   )
   .replace(/\*\*(.*?)\*\*/gi, "<strong>$1</strong>")
   .replace(/^\>(.+)/gm, "<blockquote>$1</blockquote>")
   .replace(
    /\!\[([^\]]+)\]\(([^\)]+)\)/g,
    '<img src="" data-src="$2" alt="$1" style="display: block;margin-left: auto;margin-right: auto;width: 75%" data-lazy='
    1 '>'
   )
   .replace(/^(.+)\n\=+/gm, "<h1>$1</h1>")
   .replace(/^(.+)\n\-+/gm, "<h2>$1</h2>")
   .replace(/^\s*\n\`\`\`(([^\s]+))?/gm, '<pre class="$2">')
   .replace(/^\`\`\`\s*\n/gm, "</pre>\n\n")
   .replace(/[\*\_]{2}([^\*\_]+)[\*\_]{2}/g, "<b>$1</b>")
   .replace(/[\*\_]{1}([^\*\_]+)[\*\_]{1}/g, "<i>$1</i>")
   .replace(/[\~]{2}([^\~]+)[\~]{2}/g, "<del>$1</del>")
   .replace(/[\`]{1}([^\`]+)[\`]{1}/g, "<code>$1</code>")
   .replace(/[\#]{6}(.+)/g, "<h6>$1</h6>")
   .replace(/[\#]{5}(.+)/g, "<h5>$1</h5>")
   .replace(/[\#]{4}(.+)/g, "<h4>$1</h4>")
   .replace(/[\#]{3}(.+)/g, "<h3>$1</h3>")
   .replace(/[\#]{2}(.+)/g, "<h2>$1</h2>")
   .replace(/[\#]{1}(.+)/g, "<h1>$1</h1>");
 };
 if (typeof module !== "undefined" && typeof exports === "object") {
  module.exports = bmp;
 } else {
  window.bmp = bmp;
 }
})();

// barf.URL(); get URL Query Parameters
// https://example.com?item='album'&artist='favBand'
// barf.URL('item'); > will provide the 'album' value
// barf.URL('artist'); > will provide the 'favBand' value
// setting the barf.URL function this particular way prevents overwiting the default 'barf();'

barf = {
 URL: (item) => {
  let svalue = location.search.match(new RegExp("[\?\&]" + item + "=([^\&]*)(\&?)", "i"));
  return svalue ? svalue[1] : svalue;
 }
};

// barf.CP("./components/myCardsGrid.html");
// Loads html, css, js (component) from separate file and inserts it
// at the same location the function was called from (using XHR, not Fetch)

// NOTE: if you are loading CSS or JS that way, it"s best to inline within style / script tags :
// barf.CP("./components/jsModal.html");
// in "jsModal.html"= <script>whatever code to make modal window</script>


barf.CP = (l) => {
 let d = document.currentScript || document.scripts[document.scripts.length - 1],
  k = function(b) {
   b = document.createElement(null);
   b.innerHTML = this.responseText;
   for (let a = b.getElementsByTagName("SCRIPT"), e = a.length - 1; - 1 < e; --e) {
    const c = a[e],
     f = document.createElement("script");
    f.innerHTML = c.innerHTML;
    for (let g = c.attributes.length - 1; - 1 < g; --g) attribute = c.attributes[g], f.setAttribute(attribute.name, attribute.value);
    c.parentNode.replaceChild(f, c)
   }
   for (; b.firstChild;) d.parentNode.insertBefore(b.removeChild(b.firstChild), d);
   d.parentNode.removeChild(d);
   this.removeEventListener("error", h);
   this.removeEventListener("load", k)
  },
  h = function(a) {
   this.removeEventListener("error", h);
   this.removeEventListener("load", k);
   alert("there was an error!")
  },
  a = new XMLHttpRequest;
 a.addEventListener("error", h);
 a.addEventListener("load", k);
 a.open("GET", l, true);
 a.send()
};

// barf.MD(); Loads Markdown file & renders it within Element ID (preferably within article tag with an ID for SEO)
// EXAMPLE= barf.MD("https://raw.github.com/username/repo/my-awesome-post.md", "post");
// in HTML= <article id="post">MARKDOWN FILE WILL BE LOADED & RENDERED HERE</article>

barf.MD = (url, id) => {
 const resMD = fetch(url)
  .then(r => r.text())
  .then(data => bmp(data))
  .then(content => document.getElementById(id).innerHTML = content)
  .catch(e => console.log(e))
};


// barf.HTML("./components/post.html", "article");
// Loads HTML file and shoots it in Element ID (example: <div id="article></div>") of your choice

barf.HTML = (url, id) => {
 const resHTML = fetch(url, {
   method: "GET",
   mode: "cors",
   cache: "force-cache"
  })
  .then(r => r.text())
  .then(data => document.getElementById(id).innerHTML = data)
  .catch(e => console.log(e));
 return resHTML;
};

// barf.CSS("./styles/urlOfCssFile.css");
// Loads CSS file, creates a style element in the HEAD, and shoot CSS file content within the style element

barf.CSS = (url) => {
 const css = document.createElement("style");
 const resCSS = fetch(url, {
   method: "GET",
   mode: "cors",
   cache: "force-cache"
  })
  .then(r => r.text())
  .then(data => css.textContent = data)
  .then(content => document.getElementsByTagName("head")[0].appendChild(css))
  .catch(e => console.log(e));
 return resCSS;
};

// barf.JS("./js/jquery.min.js");
// Loads JS file, creates a script tag at end of BODY, and shoots the JS file content within the element

barf.JS = (url) => {
 const js = document.createElement("script");
 const resJS = fetch(url, {
   method: "GET",
   mode: "cors",
   cache: "force-cache"
  })
  .then(r => r.text())
  .then(data => js.textContent = data)
  .then(content => document.getElementsByTagName("body")[0].appendChild(js))
  .catch(e => console.log(e));
 return resJS;
};

// barf.JSON("./content/data.json");
// Loads JSON file, creates a script tag with the proper application-Type at end of BODY, and shoots the JSON file content in it

barf.JSON = (url) => {
 const json = document.createElement("script");
 json.type = "application/json",
  const resJSON = fetch(url, {
    method: "GET",
    mode: "cors",
    cache: "force-cache"
   })
   .then(r => r.text())
   .then(data => json.textContent = data)
   .then(content => document.getElementsByTagName("body")[0].appendChild(js))
   .catch(e => console.log(e));
 return resJSON;
};
