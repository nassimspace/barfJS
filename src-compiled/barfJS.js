barf.JS = function (c) {
	var b = document.createElement("script");
	b.setAttribute("defer", "");
	fetch(c)
		.then(function (a) {
			return a.text()
		})
		.then(function (a) {
			return b.textContent = a
		})
		.then(function (a) {
			return document.getElementsByTagName("body")[0].appendChild(b)
		})["catch"](function (a) {
			return console.log(a)
		})
};
