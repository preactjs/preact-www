/* PrismJS 1.17.1
https://prismjs.com/download.html#themes=prism-tomorrow&languages=markup+css+clike+javascript+json+jsx&plugins=line-highlight */
var _self = typeof self!=='undefined' ? self : {},
	Prism = function (g) {
		var c = /\blang(?:uage)?-([\w-]+)\b/i,
			a = 0,
			C = {
				util: {
					encode: function (e) {
						return e instanceof M ? new M(e.type, C.util.encode(e.content), e.alias) : Array.isArray(e) ? e.map(C.util.encode) : e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/\u00a0/g, " ")
					},
					type: function (e) {
						return Object.prototype.toString.call(e).slice(8, -1)
					},
					objId: function (e) {
						return e.__id || Object.defineProperty(e, "__id", {
							value: ++a
						}), e.__id
					},
					clone: function n(e, t) {
						var r, a, i = C.util.type(e);
						switch (t = t || {}, i) {
							case "Object":
								if (a = C.util.objId(e), t[a]) return t[a];
								for (var o in r = {}, t[a] = r, e) e.hasOwnProperty(o) && (r[o] = n(e[o], t));
								return r;
							case "Array":
								return a = C.util.objId(e), t[a] ? t[a] : (r = [], t[a] = r, e.forEach(function (e, a) {
									r[a] = n(e, t)
								}), r);
							default:
								return e
						}
					}
				},
				languages: {
					extend: function (e, a) {
						var n = C.util.clone(C.languages[e]);
						for (var t in a) n[t] = a[t];
						return n
					},
					insertBefore: function (n, e, a, t) {
						var r = (t = t || C.languages)[n],
							i = {};
						for (var o in r)
							if (r.hasOwnProperty(o)) {
								if (o == e)
									for (var l in a) a.hasOwnProperty(l) && (i[l] = a[l]);
								a.hasOwnProperty(o) || (i[o] = r[o])
							} var s = t[n];
						return t[n] = i, C.languages.DFS(C.languages, function (e, a) {
							a === s && e != n && (this[e] = i)
						}), i
					},
					DFS: function e(a, n, t, r) {
						r = r || {};
						var i = C.util.objId;
						for (var o in a)
							if (a.hasOwnProperty(o)) {
								n.call(a, o, a[o], t || o);
								var l = a[o],
									s = C.util.type(l);
								"Object" !== s || r[i(l)] ? "Array" !== s || r[i(l)] || (r[i(l)] = !0, e(l, n, o, r)) : (r[i(l)] = !0, e(l, n, null, r))
							}
					}
				},
				plugins: {},
				highlight: function (e, a, n) {
					var t = {
						code: e,
						grammar: a,
						language: n
					};
					return C.hooks.run("before-tokenize", t), t.tokens = C.tokenize(t.code, t.grammar), C.hooks.run("after-tokenize", t), M.stringify(C.util.encode(t.tokens), t.language)
				},
				matchGrammar: function (e, a, n, t, r, i, o) {
					for (var l in n)
						if (n.hasOwnProperty(l) && n[l]) {
							if (l == o) return;
							var s = n[l];
							s = "Array" === C.util.type(s) ? s : [s];
							for (var g = 0; g < s.length; ++g) {
								var c = s[g],
									u = c.inside,
									h = !!c.lookbehind,
									f = !!c.greedy,
									d = 0,
									m = c.alias;
								if (f && !c.pattern.global) {
									var p = c.pattern.toString().match(/[imuy]*$/)[0];
									c.pattern = RegExp(c.pattern.source, p + "g")
								}
								c = c.pattern || c;
								for (var y = t, v = r; y < a.length; v += a[y].length, ++y) {
									var k = a[y];
									if (a.length > e.length) return;
									if (!(k instanceof M)) {
										if (f && y != a.length - 1) {
											if (c.lastIndex = v, !(x = c.exec(e))) break;
											for (var b = x.index + (h ? x[1].length : 0), w = x.index + x[0].length, A = y, P = v, O = a.length; A < O && (P < w || !a[A].type && !a[A - 1].greedy); ++A)(P += a[A].length) <= b && (++y, v = P);
											if (a[y] instanceof M) continue;
											N = A - y, k = e.slice(v, P), x.index -= v
										} else {
											c.lastIndex = 0;
											var x = c.exec(k),
												N = 1
										}
										if (x) {
											h && (d = x[1] ? x[1].length : 0);
											w = (b = x.index + d) + (x = x[0].slice(d)).length;
											var j = k.slice(0, b),
												S = k.slice(w),
												E = [y, N];
											j && (++y, v += j.length, E.push(j));
											var _ = new M(l, u ? C.tokenize(x, u) : x, m, x, f);
											if (E.push(_), S && E.push(S), Array.prototype.splice.apply(a, E), 1 != N && C.matchGrammar(e, a, n, y, v, !0, l), i) break
										} else if (i) break
									}
								}
							}
						}
				},
				tokenize: function (e, a) {
					var n = [e],
						t = a.rest;
					if (t) {
						for (var r in t) a[r] = t[r];
						delete a.rest
					}
					return C.matchGrammar(e, n, a, 0, 0, !1), n
				},
				hooks: {
					all: {},
					add: function (e, a) {
						var n = C.hooks.all;
						n[e] = n[e] || [], n[e].push(a)
					},
					run: function (e, a) {
						var n = C.hooks.all[e];
						if (n && n.length)
							for (var t, r = 0; t = n[r++];) t(a)
					}
				},
				Token: M
			};

		function M(e, a, n, t, r) {
			this.type = e, this.content = a, this.alias = n, this.length = 0 | (t || "").length, this.greedy = !!r
		}
		g.Prism = C;
		M.stringify = function (e, a) {
			if ("string" == typeof e) return e;
			if (Array.isArray(e)) return e.map(function (e) {
				return M.stringify(e, a)
			}).join("");
			var n = {
				type: e.type,
				content: M.stringify(e.content, a),
				tag: "span",
				classes: ["token", e.type],
				attributes: {},
				language: a
			};
			if (e.alias) {
				var t = Array.isArray(e.alias) ? e.alias : [e.alias];
				Array.prototype.push.apply(n.classes, t)
			}
			C.hooks.run("wrap", n);
			var r = Object.keys(n.attributes).map(function (e) {
				return e + '="' + (n.attributes[e] || "").replace(/"/g, "&quot;") + '"'
			}).join(" ");
			return "<" + n.tag + ' class="' + n.classes.join(" ") + '"' + (r ? " " + r : "") + ">" + n.content + "</" + n.tag + ">"
		};
		return C;
	}(_self);
module.exports = Prism;
Prism.languages.markup = {
	comment: /<!--[\s\S]*?-->/,
	prolog: /<\?[\s\S]+?\?>/,
	doctype: /<!DOCTYPE[\s\S]+?>/i,
	cdata: /<!\[CDATA\[[\s\S]*?]]>/i,
	tag: {
		pattern: /<\/?(?!\d)[^\s>\/=$<%]+(?:\s(?:\s*[^\s>\/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))|(?=[\s/>])))+)?\s*\/?>/i,
		greedy: !0,
		inside: {
			tag: {
				pattern: /^<\/?[^\s>\/]+/i,
				inside: {
					punctuation: /^<\/?/,
					namespace: /^[^\s>\/:]+:/
				}
			},
			"attr-value": {
				pattern: /=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+)/i,
				inside: {
					punctuation: [/^=/, {
						pattern: /^(\s*)["']|["']$/,
						lookbehind: !0
					}]
				}
			},
			punctuation: /\/?>/,
			"attr-name": {
				pattern: /[^\s>\/]+/,
				inside: {
					namespace: /^[^\s>\/:]+:/
				}
			}
		}
	},
	entity: /&#?[\da-z]{1,8};/i
}, Prism.languages.markup.tag.inside["attr-value"].inside.entity = Prism.languages.markup.entity, Prism.hooks.add("wrap", function (a) {
	"entity" === a.type && (a.attributes.title = a.content.replace(/&amp;/, "&"))
}), Object.defineProperty(Prism.languages.markup.tag, "addInlined", {
	value: function (a, e) {
		var s = {};
		s["language-" + e] = {
			pattern: /(^<!\[CDATA\[)[\s\S]+?(?=\]\]>$)/i,
			lookbehind: !0,
			inside: Prism.languages[e]
		}, s.cdata = /^<!\[CDATA\[|\]\]>$/i;
		var n = {
			"included-cdata": {
				pattern: /<!\[CDATA\[[\s\S]*?\]\]>/i,
				inside: s
			}
		};
		n["language-" + e] = {
			pattern: /[\s\S]+/,
			inside: Prism.languages[e]
		};
		var i = {};
		i[a] = {
			pattern: RegExp("(<__[\\s\\S]*?>)(?:<!\\[CDATA\\[[\\s\\S]*?\\]\\]>\\s*|[\\s\\S])*?(?=<\\/__>)".replace(/__/g, a), "i"),
			lookbehind: !0,
			greedy: !0,
			inside: n
		}, Prism.languages.insertBefore("markup", "cdata", i)
	}
}), Prism.languages.xml = Prism.languages.extend("markup", {}), Prism.languages.html = Prism.languages.markup, Prism.languages.mathml = Prism.languages.markup, Prism.languages.svg = Prism.languages.markup;
! function (s) {
	var t = /("|')(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/;
	s.languages.css = {
		comment: /\/\*[\s\S]*?\*\//,
		atrule: {
			pattern: /@[\w-]+[\s\S]*?(?:;|(?=\s*\{))/,
			inside: {
				rule: /@[\w-]+/
			}
		},
		url: {
			pattern: RegExp("url\\((?:" + t.source + "|[^\n\r()]*)\\)", "i"),
			inside: {
				function: /^url/i,
				punctuation: /^\(|\)$/
			}
		},
		selector: RegExp("[^{}\\s](?:[^{};\"']|" + t.source + ")*?(?=\\s*\\{)"),
		string: {
			pattern: t,
			greedy: !0
		},
		property: /[-_a-z\xA0-\uFFFF][-\w\xA0-\uFFFF]*(?=\s*:)/i,
		important: /!important\b/i,
		function: /[-a-z0-9]+(?=\()/i,
		punctuation: /[(){};:,]/
	}, s.languages.css.atrule.inside.rest = s.languages.css;
	var e = s.languages.markup;
	e && (e.tag.addInlined("style", "css"), s.languages.insertBefore("inside", "attr-value", {
		"style-attr": {
			pattern: /\s*style=("|')(?:\\[\s\S]|(?!\1)[^\\])*\1/i,
			inside: {
				"attr-name": {
					pattern: /^\s*style/i,
					inside: e.tag.inside
				},
				punctuation: /^\s*=\s*['"]|['"]\s*$/,
				"attr-value": {
					pattern: /.+/i,
					inside: s.languages.css
				}
			},
			alias: "language-css"
		}
	}, e.tag))
}(Prism);
Prism.languages.clike = {
	comment: [{
		pattern: /(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/,
		lookbehind: !0
	}, {
		pattern: /(^|[^\\:])\/\/.*/,
		lookbehind: !0,
		greedy: !0
	}],
	string: {
		pattern: /(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
		greedy: !0
	},
	"class-name": {
		pattern: /((?:\b(?:class|interface|extends|implements|trait|instanceof|new)\s+)|(?:catch\s+\())[\w.\\]+/i,
		lookbehind: !0,
		inside: {
			punctuation: /[.\\]/
		}
	},
	keyword: /\b(?:if|else|while|do|for|return|in|instanceof|function|new|try|throw|catch|finally|null|break|continue)\b/,
	boolean: /\b(?:true|false)\b/,
	function: /\w+(?=\()/,
	number: /\b0x[\da-f]+\b|(?:\b\d+\.?\d*|\B\.\d+)(?:e[+-]?\d+)?/i,
	operator: /--?|\+\+?|!=?=?|<=?|>=?|==?=?|&&?|\|\|?|\?|\*|\/|~|\^|%/,
	punctuation: /[{}[\];(),.:]/
};
Prism.languages.javascript = Prism.languages.extend("clike", {
	"class-name": [Prism.languages.clike["class-name"], {
		pattern: /(^|[^$\w\xA0-\uFFFF])[_$A-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\.(?:prototype|constructor))/,
		lookbehind: !0
	}],
	keyword: [{
		pattern: /((?:^|})\s*)(?:catch|finally)\b/,
		lookbehind: !0
	}, {
		pattern: /(^|[^.])\b(?:as|async(?=\s*(?:function\b|\(|[$\w\xA0-\uFFFF]|$))|await|break|case|class|const|continue|debugger|default|delete|do|else|enum|export|extends|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)\b/,
		lookbehind: !0
	}],
	number: /\b(?:(?:0[xX](?:[\dA-Fa-f](?:_[\dA-Fa-f])?)+|0[bB](?:[01](?:_[01])?)+|0[oO](?:[0-7](?:_[0-7])?)+)n?|(?:\d(?:_\d)?)+n|NaN|Infinity)\b|(?:\b(?:\d(?:_\d)?)+\.?(?:\d(?:_\d)?)*|\B\.(?:\d(?:_\d)?)+)(?:[Ee][+-]?(?:\d(?:_\d)?)+)?/,
	function: /#?[_$a-zA-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\s*(?:\.\s*(?:apply|bind|call)\s*)?\()/,
	operator: /-[-=]?|\+[+=]?|!=?=?|<<?=?|>>?>?=?|=(?:==?|>)?|&[&=]?|\|[|=]?|\*\*?=?|\/=?|~|\^=?|%=?|\?|\.{3}/
}), Prism.languages.javascript["class-name"][0].pattern = /(\b(?:class|interface|extends|implements|instanceof|new)\s+)[\w.\\]+/, Prism.languages.insertBefore("javascript", "keyword", {
	regex: {
		pattern: /((?:^|[^$\w\xA0-\uFFFF."'\])\s])\s*)\/(\[(?:[^\]\\\r\n]|\\.)*]|\\.|[^/\\\[\r\n])+\/[gimyus]{0,6}(?=\s*($|[\r\n,.;})\]]))/,
		lookbehind: !0,
		greedy: !0
	},
	"function-variable": {
		pattern: /#?[_$a-zA-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\s*[=:]\s*(?:async\s*)?(?:\bfunction\b|(?:\((?:[^()]|\([^()]*\))*\)|[_$a-zA-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*)\s*=>))/,
		alias: "function"
	},
	parameter: [{
		pattern: /(function(?:\s+[_$A-Za-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*)?\s*\(\s*)(?!\s)(?:[^()]|\([^()]*\))+?(?=\s*\))/,
		lookbehind: !0,
		inside: Prism.languages.javascript
	}, {
		pattern: /[_$a-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\s*=>)/i,
		inside: Prism.languages.javascript
	}, {
		pattern: /(\(\s*)(?!\s)(?:[^()]|\([^()]*\))+?(?=\s*\)\s*=>)/,
		lookbehind: !0,
		inside: Prism.languages.javascript
	}, {
		pattern: /((?:\b|\s|^)(?!(?:as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)(?![$\w\xA0-\uFFFF]))(?:[_$A-Za-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*\s*)\(\s*)(?!\s)(?:[^()]|\([^()]*\))+?(?=\s*\)\s*\{)/,
		lookbehind: !0,
		inside: Prism.languages.javascript
	}],
	constant: /\b[A-Z](?:[A-Z_]|\dx?)*\b/
}), Prism.languages.insertBefore("javascript", "string", {
	"template-string": {
		pattern: /`(?:\\[\s\S]|\${(?:[^{}]|{(?:[^{}]|{[^}]*})*})+}|(?!\${)[^\\`])*`/,
		greedy: !0,
		inside: {
			"template-punctuation": {
				pattern: /^`|`$/,
				alias: "string"
			},
			interpolation: {
				pattern: /((?:^|[^\\])(?:\\{2})*)\${(?:[^{}]|{(?:[^{}]|{[^}]*})*})+}/,
				lookbehind: !0,
				inside: {
					"interpolation-punctuation": {
						pattern: /^\${|}$/,
						alias: "punctuation"
					},
					rest: Prism.languages.javascript
				}
			},
			string: /[\s\S]+/
		}
	}
}), Prism.languages.markup && Prism.languages.markup.tag.addInlined("script", "javascript"), Prism.languages.js = Prism.languages.javascript;
Prism.languages.json = {
	property: {
		pattern: /"(?:\\.|[^\\"\r\n])*"(?=\s*:)/,
		greedy: !0
	},
	string: {
		pattern: /"(?:\\.|[^\\"\r\n])*"(?!\s*:)/,
		greedy: !0
	},
	comment: /\/\/.*|\/\*[\s\S]*?(?:\*\/|$)/,
	number: /-?\d+\.?\d*(e[+-]?\d+)?/i,
	punctuation: /[{}[\],]/,
	operator: /:/,
	boolean: /\b(?:true|false)\b/,
	null: {
		pattern: /\bnull\b/,
		alias: "keyword"
	}
};
! function (i) {
	var t = i.util.clone(i.languages.javascript);
	i.languages.jsx = i.languages.extend("markup", t), i.languages.jsx.tag.pattern = /<\/?(?:[\w.:-]+\s*(?:\s+(?:[\w.:-]+(?:=(?:("|')(?:\\[\s\S]|(?!\1)[^\\])*\1|[^\s{'">=]+|\{(?:\{(?:\{[^}]*\}|[^{}])*\}|[^{}])+\}))?|\{\.{3}[a-z_$][\w$]*(?:\.[a-z_$][\w$]*)*\}))*\s*\/?)?>/i, i.languages.jsx.tag.inside.tag.pattern = /^<\/?[^\s>\/]*/i, i.languages.jsx.tag.inside["attr-value"].pattern = /=(?!\{)(?:("|')(?:\\[\s\S]|(?!\1)[^\\])*\1|[^\s'">]+)/i, i.languages.jsx.tag.inside.tag.inside["class-name"] = /^[A-Z]\w*(?:\.[A-Z]\w*)*$/, i.languages.insertBefore("inside", "attr-name", {
		spread: {
			pattern: /\{\.{3}[a-z_$][\w$]*(?:\.[a-z_$][\w$]*)*\}/,
			inside: {
				punctuation: /\.{3}|[{}.]/,
				"attr-value": /\w+/
			}
		}
	}, i.languages.jsx.tag), i.languages.insertBefore("inside", "attr-value", {
		script: {
			pattern: /=(\{(?:\{(?:\{[^}]*\}|[^}])*\}|[^}])+\})/i,
			inside: {
				"script-punctuation": {
					pattern: /^=(?={)/,
					alias: "punctuation"
				},
				rest: i.languages.jsx
			},
			alias: "language-javascript"
		}
	}, i.languages.jsx.tag);
	var o = function (t) {
			return t ? "string" == typeof t ? t : "string" == typeof t.content ? t.content : t.content.map(o).join("") : ""
		},
		p = function (t) {
			for (var n = [], e = 0; e < t.length; e++) {
				var a = t[e],
					s = !1;
				if ("string" != typeof a && ("tag" === a.type && a.content[0] && "tag" === a.content[0].type ? "</" === a.content[0].content[0].content ? 0 < n.length && n[n.length - 1].tagName === o(a.content[0].content[1]) && n.pop() : "/>" === a.content[a.content.length - 1].content || n.push({
						tagName: o(a.content[0].content[1]),
						openedBraces: 0
					}) : 0 < n.length && "punctuation" === a.type && "{" === a.content ? n[n.length - 1].openedBraces++ : 0 < n.length && 0 < n[n.length - 1].openedBraces && "punctuation" === a.type && "}" === a.content ? n[n.length - 1].openedBraces-- : s = !0), (s || "string" == typeof a) && 0 < n.length && 0 === n[n.length - 1].openedBraces) {
					var g = o(a);
					e < t.length - 1 && ("string" == typeof t[e + 1] || "plain-text" === t[e + 1].type) && (g += o(t[e + 1]), t.splice(e + 1, 1)), 0 < e && ("string" == typeof t[e - 1] || "plain-text" === t[e - 1].type) && (g = o(t[e - 1]) + g, t.splice(e - 1, 1), e--), t[e] = new i.Token("plain-text", g, null, g)
				}
				a.content && "string" != typeof a.content && p(a.content)
			}
		};
	i.hooks.add("after-tokenize", function (t) {
		"jsx" !== t.language && "tsx" !== t.language || p(t.tokens)
	})
}(Prism);
! function () {
	if ("undefined" != typeof self && self.Prism && self.document && document.querySelector) {
		var t, n = function () {
				if (void 0 === t) {
					var e = document.createElement("div");
					e.style.fontSize = "13px", e.style.lineHeight = "1.5", e.style.padding = 0, e.style.border = 0, e.innerHTML = "&nbsp;<br />&nbsp;", document.body.appendChild(e), t = 38 === e.offsetHeight, document.body.removeChild(e)
				}
				return t
			},
			a = 0;
		Prism.hooks.add("before-sanity-check", function (e) {
			var t = e.element.parentNode,
				n = t && t.getAttribute("data-line");
			if (t && n && /pre/i.test(t.nodeName)) {
				var i = 0;
				r(".line-highlight", t).forEach(function (e) {
					i += e.textContent.length, e.parentNode.removeChild(e)
				}), i && /^( \n)+$/.test(e.code.slice(-i)) && (e.code = e.code.slice(0, -i))
			}
		}), Prism.hooks.add("complete", function e(t) {
			var n = t.element.parentNode,
				i = n && n.getAttribute("data-line");
			if (n && i && /pre/i.test(n.nodeName)) {
				clearTimeout(a);
				var r = Prism.plugins.lineNumbers,
					o = t.plugins && t.plugins.lineNumbers;
				if (l(n, "line-numbers") && r && !o) Prism.hooks.add("line-numbers", e);
				else s(n, i)(), a = setTimeout(u, 1)
			}
		}), window.addEventListener("hashchange", u), window.addEventListener("resize", function () {
			var t = [];
			r("pre[data-line]").forEach(function (e) {
				t.push(s(e))
			}), t.forEach(i)
		})
	}

	function r(e, t) {
		return Array.prototype.slice.call((t || document).querySelectorAll(e))
	}

	function l(e, t) {
		return t = " " + t + " ", -1 < (" " + e.className + " ").replace(/[\n\t]/g, " ").indexOf(t)
	}

	function i(e) {
		e()
	}

	function s(u, e, d) {
		var t = (e = "string" == typeof e ? e : u.getAttribute("data-line")).replace(/\s+/g, "").split(","),
			c = +u.getAttribute("data-line-offset") || 0,
			f = (n() ? parseInt : parseFloat)(getComputedStyle(u).lineHeight),
			h = l(u, "line-numbers"),
			p = h ? u : u.querySelector("code") || u,
			m = [];
		return t.forEach(function (e) {
				var t = e.split("-"),
					n = +t[0],
					i = +t[1] || n,
					r = u.querySelector('.line-highlight[data-range="' + e + '"]') || document.createElement("div");
				if (m.push(function () {
						r.setAttribute("aria-hidden", "true"), r.setAttribute("data-range", e), r.className = (d || "") + " line-highlight"
					}), h && Prism.plugins.lineNumbers) {
					var o = Prism.plugins.lineNumbers.getLine(u, n),
						a = Prism.plugins.lineNumbers.getLine(u, i);
					if (o) {
						var l = o.offsetTop + "px";
						m.push(function () {
							r.style.top = l
						})
					}
					if (a) {
						var s = a.offsetTop - o.offsetTop + a.offsetHeight + "px";
						m.push(function () {
							r.style.height = s
						})
					}
				} else m.push(function () {
					r.setAttribute("data-start", n), n < i && r.setAttribute("data-end", i), r.style.top = (n - c - 1) * f + "px", r.textContent = new Array(i - n + 2).join(" \n")
				});
				m.push(function () {
					p.appendChild(r)
				})
			}),
			function () {
				m.forEach(i)
			}
	}

	function u() {
		var e = location.hash.slice(1);
		r(".temporary.line-highlight").forEach(function (e) {
			e.parentNode.removeChild(e)
		});
		var t = (e.match(/\.([\d,-]+)$/) || [, ""])[1];
		if (t && !document.getElementById(e)) {
			var n = e.slice(0, e.lastIndexOf(".")),
				i = document.getElementById(n);
			if (i) i.hasAttribute("data-line") || i.setAttribute("data-line", ""), s(i, t, "temporary ")(), document.querySelector(".temporary.line-highlight").scrollIntoView()
		}
	}
}();
