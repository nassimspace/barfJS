(function () {
	var b = {};
	this.tmpl = function e(a, c) {
		var d = /\W/.test(a) ? new Function("obj",
			"var p=[],print=function(){p.push.apply(p,arguments);};with(obj){p.push('" +
			a.replace(
				/[\r\t\n]/g, " ").split("<%").join("\t").replace(
				/((^|%>)[^\t]*)'/g, "$1\r").replace(
				/\t=(.*?)%>/g, "',$1,'").split("\t").join("');").split("%>").join(
				"p.push('").split("\r").join(
				"\\'") + "');}return p.join('');") : b[a] = b[a] || e(document
			.getElementById(a).innerHTML);
		return c ? d(c) : d
	}
})();
