/* PrismJS 1.22.0
https://prismjs.com/download.html#themes=prism-tomorrow&languages=markup+css+clike+javascript+json+jsx+tsx+typescript&plugins=line-highlight */
/// <reference lib="WebWorker"/>

/**
 * Note: this file is hand-edited to remove DOM code and Prism's built-in Worker logic.
 * It contains only the syntax highlighting core and languages from the above link.
 */

var _self = typeof self!=='undefined' ? self : {};

export var Prism = function(e) {
    var n = 0, a = {
        util: {
            encode: function e(t) {
                return t instanceof r ? new r(t.type, e(t.content), t.alias) : Array.isArray(t) ? t.map(e) : t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/\u00a0/g, " ");
            },
            type: function(e) {
                return Object.prototype.toString.call(e).slice(8, -1);
            },
            objId: function(e) {
                return e.__id || Object.defineProperty(e, "__id", {
                    value: ++n
                }), e.__id;
            },
            clone: function e(t, n) {
                var r, i;
                switch (n = n || {}, a.util.type(t)) {
                  case "Object":
                    if (i = a.util.objId(t), n[i]) return n[i];
                    for (var s in r = {}, n[i] = r, t) t.hasOwnProperty(s) && (r[s] = e(t[s], n));
                    return r;

                  case "Array":
                    return i = a.util.objId(t), n[i] ? n[i] : (r = [], n[i] = r, t.forEach((function(t, a) {
                        r[a] = e(t, n);
                    })), r);

                  default:
                    return t;
                }
            }
        },
        languages: {
            extend: function(e, t) {
                var n = a.util.clone(a.languages[e]);
                for (var r in t) n[r] = t[r];
                return n;
            },
            insertBefore: function(e, t, n, r) {
                var i = (r = r || a.languages)[e], s = {};
                for (var l in i) if (i.hasOwnProperty(l)) {
                    if (l == t) for (var o in n) n.hasOwnProperty(o) && (s[o] = n[o]);
                    n.hasOwnProperty(l) || (s[l] = i[l]);
                }
                var u = r[e];
                return r[e] = s, a.languages.DFS(a.languages, (function(t, n) {
                    n === u && t != e && (this[t] = s);
                })), s;
            },
            DFS: function e(t, n, r, i) {
                i = i || {};
                var s = a.util.objId;
                for (var l in t) if (t.hasOwnProperty(l)) {
                    n.call(t, l, t[l], r || l);
                    var o = t[l], u = a.util.type(o);
                    "Object" !== u || i[s(o)] ? "Array" !== u || i[s(o)] || (i[s(o)] = !0, e(o, n, l, i)) : (i[s(o)] = !0,
                    e(o, n, null, i));
                }
            }
        },
        plugins: {},
        highlight: function(e, t, n) {
            var i = {
                code: e,
                grammar: t,
                language: n
            };
            return a.hooks.run("before-tokenize", i), i.tokens = a.tokenize(i.code, i.grammar),
            a.hooks.run("after-tokenize", i), r.stringify(a.util.encode(i.tokens), i.language);
        },
        tokenize: function(e, t) {
            var n = t.rest;
            if (n) {
                for (var a in n) t[a] = n[a];
                delete t.rest;
            }
            var r = new s;
            return l(r, r.head, e), i(e, r, t, r.head, 0), function(e) {
                var t = [], n = e.head.next;
                for (;n !== e.tail; ) t.push(n.value), n = n.next;
                return t;
            }(r);
        },
        hooks: {
            all: {},
            add: function(e, t) {
                var n = a.hooks.all;
                n[e] = n[e] || [], n[e].push(t);
            },
            run: function(e, t) {
                var n = a.hooks.all[e];
                if (n && n.length) for (var r, i = 0; r = n[i++]; ) r(t);
            }
        },
        Token: r
    };
    function r(e, t, n, a) {
        this.type = e, this.content = t, this.alias = n, this.length = 0 | (a || "").length;
    }
    function i(e, t, n, s, u, c) {
        for (var g in n) if (n.hasOwnProperty(g) && n[g]) {
            var d = n[g];
            d = Array.isArray(d) ? d : [ d ];
            for (var p = 0; p < d.length; ++p) {
                if (c && c.cause == g + "," + p) return;
                var f = d[p], m = f.inside, h = !!f.lookbehind, y = !!f.greedy, v = 0, b = f.alias;
                if (y && !f.pattern.global) {
                    var F = f.pattern.toString().match(/[imsuy]*$/)[0];
                    f.pattern = RegExp(f.pattern.source, F + "g");
                }
                for (var x = f.pattern || f, k = s.next, w = u; k !== t.tail && !(c && w >= c.reach); w += k.value.length,
                k = k.next) {
                    var A = k.value;
                    if (t.length > e.length) return;
                    if (!(A instanceof r)) {
                        var P = 1;
                        if (y && k != t.tail.prev) {
                            if (x.lastIndex = w, !(E = x.exec(e))) break;
                            var $ = E.index + (h && E[1] ? E[1].length : 0), S = E.index + E[0].length, j = w;
                            for (j += k.value.length; $ >= j; ) j += (k = k.next).value.length;
                            if (w = j -= k.value.length, k.value instanceof r) continue;
                            for (var _ = k; _ !== t.tail && (j < S || "string" == typeof _.value); _ = _.next) P++,
                            j += _.value.length;
                            P--, A = e.slice(w, j), E.index -= w;
                        } else {
                            x.lastIndex = 0;
                            var E = x.exec(A);
                        }
                        if (E) {
                            h && (v = E[1] ? E[1].length : 0);
                            $ = E.index + v;
                            var N = E[0].slice(v), z = (S = $ + N.length, A.slice(0, $)), C = A.slice(S), B = w + A.length;
                            c && B > c.reach && (c.reach = B);
                            var T = k.prev;
                            z && (T = l(t, T, z), w += z.length), o(t, T, P), k = l(t, T, new r(g, m ? a.tokenize(N, m) : N, b, N)),
                            C && l(t, k, C), P > 1 && i(e, t, n, k.prev, w, {
                                cause: g + "," + p,
                                reach: B
                            });
                        }
                    }
                }
            }
        }
    }
    function s() {
        var e = {
            value: null,
            prev: null,
            next: null
        }, t = {
            value: null,
            prev: e,
            next: null
        };
        e.next = t, this.head = e, this.tail = t, this.length = 0;
    }
    function l(e, t, n) {
        var a = t.next, r = {
            value: n,
            prev: t,
            next: a
        };
        return t.next = r, a.prev = r, e.length++, r;
    }
    function o(e, t, n) {
        for (var a = t.next, r = 0; r < n && a !== e.tail; r++) a = a.next;
        t.next = a, a.prev = t, e.length -= r;
	}
	e.Prism = a;
	r.stringify = function e(t, n) {
        if ("string" == typeof t) return t;
        if (Array.isArray(t)) {
            var r = "";
            return t.forEach((function(t) {
                r += e(t, n);
            })), r;
        }
        var i = {
            type: t.type,
            content: e(t.content, n),
            tag: "span",
            classes: [ "token", t.type ],
            attributes: {},
            language: n
        }, s = t.alias;
        s && (Array.isArray(s) ? Array.prototype.push.apply(i.classes, s) : i.classes.push(s)),
        a.hooks.run("wrap", i);
        var l = "";
        for (var o in i.attributes) l += " " + o + '="' + (i.attributes[o] || "").replace(/"/g, "&quot;") + '"';
        return "<" + i.tag + ' class="' + i.classes.join(" ") + '"' + l + ">" + i.content + "</" + i.tag + ">";
    };
    return a;
}(_self);

Prism.languages.markup = {
    comment: /<!--[\s\S]*?-->/,
    prolog: /<\?[\s\S]+?\?>/,
    doctype: {
        pattern: /<!DOCTYPE(?:[^>"'[\]]|"[^"]*"|'[^']*')+(?:\[(?:[^<"'\]]|"[^"]*"|'[^']*'|<(?!!--)|<!--(?:[^-]|-(?!->))*-->)*\]\s*)?>/i,
        greedy: !0,
        inside: {
            "internal-subset": {
                pattern: /(\[)[\s\S]+(?=\]>$)/,
                lookbehind: !0,
                greedy: !0,
                inside: null
            },
            string: {
                pattern: /"[^"]*"|'[^']*'/,
                greedy: !0
            },
            punctuation: /^<!|>$|[[\]]/,
            "doctype-tag": /^DOCTYPE/,
            name: /[^\s<>'"]+/
        }
    },
    cdata: /<!\[CDATA\[[\s\S]*?]]>/i,
    tag: {
        pattern: /<\/?(?!\d)[^\s>\/=$<%]+(?:\s(?:\s*[^\s>\/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))|(?=[\s/>])))+)?\s*\/?>/,
        greedy: !0,
        inside: {
            tag: {
                pattern: /^<\/?[^\s>\/]+/,
                inside: {
                    punctuation: /^<\/?/,
                    namespace: /^[^\s>\/:]+:/
                }
            },
            "attr-value": {
                pattern: /=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+)/,
                inside: {
                    punctuation: [ {
                        pattern: /^=/,
                        alias: "attr-equals"
                    }, /"|'/ ]
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
    entity: [ {
        pattern: /&[\da-z]{1,8};/i,
        alias: "named-entity"
    }, /&#x?[\da-f]{1,8};/i ]
}

Prism.languages.markup.tag.inside["attr-value"].inside.entity = Prism.languages.markup.entity;
Prism.languages.markup.doctype.inside["internal-subset"].inside = Prism.languages.markup;

Prism.hooks.add("wrap", (function(e) {
    "entity" === e.type && (e.attributes.title = e.content.replace(/&amp;/, "&"));
}));

Object.defineProperty(Prism.languages.markup.tag, "addInlined", {
    value: function(e, t) {
        var n = {};
        n["language-" + t] = {
            pattern: /(^<!\[CDATA\[)[\s\S]+?(?=\]\]>$)/i,
            lookbehind: !0,
            inside: Prism.languages[t]
        }, n.cdata = /^<!\[CDATA\[|\]\]>$/i;
        var a = {
            "included-cdata": {
                pattern: /<!\[CDATA\[[\s\S]*?\]\]>/i,
                inside: n
            }
        };
        a["language-" + t] = {
            pattern: /[\s\S]+/,
            inside: Prism.languages[t]
        };
        var r = {};
        r[e] = {
            pattern: RegExp(/(<__[\s\S]*?>)(?:<!\[CDATA\[(?:[^\]]|\](?!\]>))*\]\]>|(?!<!\[CDATA\[)[\s\S])*?(?=<\/__>)/.source.replace(/__/g, (function() {
                return e;
            })), "i"),
            lookbehind: !0,
            greedy: !0,
            inside: a
        }, Prism.languages.insertBefore("markup", "cdata", r);
    }
})

Prism.languages.html = Prism.languages.markup,
Prism.languages.svg = Prism.languages.markup,
Prism.languages.xml = Prism.languages.extend("markup", {}),

(function(e) {
    var t = /("|')(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/;
    e.languages.css = {
        comment: /\/\*[\s\S]*?\*\//,
        atrule: {
            pattern: /@[\w-]+[\s\S]*?(?:;|(?=\s*\{))/,
            inside: {
                rule: /^@[\w-]+/,
                "selector-function-argument": {
                    pattern: /(\bselector\s*\((?!\s*\))\s*)(?:[^()]|\((?:[^()]|\([^()]*\))*\))+?(?=\s*\))/,
                    lookbehind: !0,
                    alias: "selector"
                },
                keyword: {
                    pattern: /(^|[^\w-])(?:and|not|only|or)(?![\w-])/,
                    lookbehind: !0
                }
            }
        },
        url: {
            pattern: RegExp("\\burl\\((?:" + t.source + "|" + /(?:[^\\\r\n()"']|\\[\s\S])*/.source + ")\\)", "i"),
            greedy: !0,
            inside: {
                function: /^url/i,
                punctuation: /^\(|\)$/,
                string: {
                    pattern: RegExp("^" + t.source + "$"),
                    alias: "url"
                }
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
	};
	e.languages.css.atrule.inside.rest = e.languages.css;
    var n = e.languages.markup;
    n && (n.tag.addInlined("style", "css"), e.languages.insertBefore("inside", "attr-value", {
        "style-attr": {
            pattern: /(^|["'\s])style\s*=\s*(?:"[^"]*"|'[^']*')/i,
            lookbehind: !0,
            inside: {
                "attr-value": {
                    pattern: /=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+)/,
                    inside: {
                        style: {
                            pattern: /(["'])[\s\S]+(?=["']$)/,
                            lookbehind: !0,
                            alias: "language-css",
                            inside: e.languages.css
                        },
                        punctuation: [ {
                            pattern: /^=/,
                            alias: "attr-equals"
                        }, /"|'/ ]
                    }
                },
                "attr-name": /^style/i
            }
        }
    }, n.tag));
}(Prism));

Prism.languages.clike = {
    comment: [ {
        pattern: /(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/,
        lookbehind: !0
    }, {
        pattern: /(^|[^\\:])\/\/.*/,
        lookbehind: !0,
        greedy: !0
    } ],
    string: {
        pattern: /(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
        greedy: !0
    },
    "class-name": {
        pattern: /(\b(?:class|interface|extends|implements|trait|instanceof|new)\s+|\bcatch\s+\()[\w.\\]+/i,
        lookbehind: !0,
        inside: {
            punctuation: /[.\\]/
        }
    },
    keyword: /\b(?:if|else|while|do|for|return|in|instanceof|function|new|try|throw|catch|finally|null|break|continue)\b/,
    boolean: /\b(?:true|false)\b/,
    function: /\w+(?=\()/,
    number: /\b0x[\da-f]+\b|(?:\b\d+\.?\d*|\B\.\d+)(?:e[+-]?\d+)?/i,
    operator: /[<>]=?|[!=]=?=?|--?|\+\+?|&&?|\|\|?|[?*/~^%]/,
    punctuation: /[{}[\];(),.:]/
}

Prism.languages.javascript = Prism.languages.extend("clike", {
    "class-name": [ Prism.languages.clike["class-name"], {
        pattern: /(^|[^$\w\xA0-\uFFFF])[_$A-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\.(?:prototype|constructor))/,
        lookbehind: !0
    } ],
    keyword: [ {
        pattern: /((?:^|})\s*)(?:catch|finally)\b/,
        lookbehind: !0
    }, {
        pattern: /(^|[^.]|\.\.\.\s*)\b(?:as|async(?=\s*(?:function\b|\(|[$\w\xA0-\uFFFF]|$))|await|break|case|class|const|continue|debugger|default|delete|do|else|enum|export|extends|for|from|function|(?:get|set)(?=\s*[\[$\w\xA0-\uFFFF])|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)\b/,
        lookbehind: !0
    } ],
    number: /\b(?:(?:0[xX](?:[\dA-Fa-f](?:_[\dA-Fa-f])?)+|0[bB](?:[01](?:_[01])?)+|0[oO](?:[0-7](?:_[0-7])?)+)n?|(?:\d(?:_\d)?)+n|NaN|Infinity)\b|(?:\b(?:\d(?:_\d)?)+\.?(?:\d(?:_\d)?)*|\B\.(?:\d(?:_\d)?)+)(?:[Ee][+-]?(?:\d(?:_\d)?)+)?/,
    function: /#?[_$a-zA-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\s*(?:\.\s*(?:apply|bind|call)\s*)?\()/,
    operator: /--|\+\+|\*\*=?|=>|&&=?|\|\|=?|[!=]==|<<=?|>>>?=?|[-+*/%&|^!=<>]=?|\.{3}|\?\?=?|\?\.?|[~:]/
});

Prism.languages.javascript["class-name"][0].pattern = /(\b(?:class|interface|extends|implements|instanceof|new)\s+)[\w.\\]+/;

Prism.languages.insertBefore("javascript", "keyword", {
    regex: {
        pattern: /((?:^|[^$\w\xA0-\uFFFF."'\])\s]|\b(?:return|yield))\s*)\/(?:\[(?:[^\]\\\r\n]|\\.)*]|\\.|[^/\\\[\r\n])+\/[gimyus]{0,6}(?=(?:\s|\/\*(?:[^*]|\*(?!\/))*\*\/)*(?:$|[\r\n,.;:})\]]|\/\/))/,
        lookbehind: !0,
        greedy: !0,
        inside: {
            "regex-source": {
                pattern: /^(\/)[\s\S]+(?=\/[a-z]*$)/,
                lookbehind: !0,
                alias: "language-regex",
                inside: Prism.languages.regex
            },
            "regex-flags": /[a-z]+$/,
            "regex-delimiter": /^\/|\/$/
        }
    },
    "function-variable": {
        pattern: /#?[_$a-zA-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\s*[=:]\s*(?:async\s*)?(?:\bfunction\b|(?:\((?:[^()]|\([^()]*\))*\)|[_$a-zA-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*)\s*=>))/,
        alias: "function"
    },
    parameter: [ {
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
        pattern: /((?:\b|\s|^)(?!(?:as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)(?![$\w\xA0-\uFFFF]))(?:[_$A-Za-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*\s*)\(\s*|\]\s*\(\s*)(?!\s)(?:[^()]|\([^()]*\))+?(?=\s*\)\s*\{)/,
        lookbehind: !0,
        inside: Prism.languages.javascript
    } ],
    constant: /\b[A-Z](?:[A-Z_]|\dx?)*\b/
});

Prism.languages.insertBefore("javascript", "string", {
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
});

Prism.languages.markup && Prism.languages.markup.tag.addInlined("script", "javascript");

Prism.languages.js = Prism.languages.javascript;

Prism.languages.json = {
    property: {
        pattern: /"(?:\\.|[^\\"\r\n])*"(?=\s*:)/,
        greedy: !0
    },
    string: {
        pattern: /"(?:\\.|[^\\"\r\n])*"(?!\s*:)/,
        greedy: !0
    },
    comment: {
        pattern: /\/\/.*|\/\*[\s\S]*?(?:\*\/|$)/,
        greedy: !0
    },
    number: /-?\b\d+(?:\.\d+)?(?:e[+-]?\d+)?\b/i,
    punctuation: /[{}[\],]/,
    operator: /:/,
    boolean: /\b(?:true|false)\b/,
    null: {
        pattern: /\bnull\b/,
        alias: "keyword"
    }
};

(function(e) {
    var t = e.util.clone(e.languages.javascript);
	e.languages.jsx = e.languages.extend("markup", t);
	e.languages.jsx.tag.pattern = /<\/?(?:[\w.:-]+\s*(?:\s+(?:[\w.:$-]+(?:=(?:("|')(?:\\[\s\S]|(?!\1)[^\\])*\1|[^\s{'">=]+|\{(?:\{(?:\{[^{}]*\}|[^{}])*\}|[^{}])+\}))?|\{\s*\.{3}\s*[a-z_$][\w$]*(?:\.[a-z_$][\w$]*)*\s*\}))*\s*\/?)?>/i,
	e.languages.jsx.tag.inside.tag.pattern = /^<\/?[^\s>\/]*/i;
	e.languages.jsx.tag.inside["attr-value"].pattern = /=(?!\{)(?:("|')(?:\\[\s\S]|(?!\1)[^\\])*\1|[^\s'">]+)/i;
    e.languages.jsx.tag.inside.tag.inside["class-name"] = /^[A-Z]\w*(?:\.[A-Z]\w*)*$/;
    e.languages.insertBefore("inside", "attr-name", {
        spread: {
            pattern: /\{\s*\.{3}\s*[a-z_$][\w$]*(?:\.[a-z_$][\w$]*)*\s*\}/,
            inside: {
                punctuation: /\.{3}|[{}.]/,
                "attr-value": /\w+/
            }
        }
	}, e.languages.jsx.tag);
	e.languages.insertBefore("inside", "attr-value", {
        script: {
            pattern: /=(?:\{(?:\{(?:\{[^{}]*\}|[^{}])*\}|[^{}])+\})/i,
            inside: {
                "script-punctuation": {
                    pattern: /^=(?={)/,
                    alias: "punctuation"
                },
                rest: e.languages.jsx
            },
            alias: "language-javascript"
        }
    }, e.languages.jsx.tag);
    var n = function(e) {
        return e ? "string" == typeof e ? e : "string" == typeof e.content ? e.content : e.content.map(n).join("") : "";
    }, a = function(t) {
        for (var r = [], i = 0; i < t.length; i++) {
            var s = t[i], l = !1;
            if ("string" != typeof s && ("tag" === s.type && s.content[0] && "tag" === s.content[0].type ? "</" === s.content[0].content[0].content ? r.length > 0 && r[r.length - 1].tagName === n(s.content[0].content[1]) && r.pop() : "/>" === s.content[s.content.length - 1].content || r.push({
                tagName: n(s.content[0].content[1]),
                openedBraces: 0
            }) : r.length > 0 && "punctuation" === s.type && "{" === s.content ? r[r.length - 1].openedBraces++ : r.length > 0 && r[r.length - 1].openedBraces > 0 && "punctuation" === s.type && "}" === s.content ? r[r.length - 1].openedBraces-- : l = !0),
            (l || "string" == typeof s) && r.length > 0 && 0 === r[r.length - 1].openedBraces) {
                var o = n(s);
                i < t.length - 1 && ("string" == typeof t[i + 1] || "plain-text" === t[i + 1].type) && (o += n(t[i + 1]),
                t.splice(i + 1, 1)), i > 0 && ("string" == typeof t[i - 1] || "plain-text" === t[i - 1].type) && (o = n(t[i - 1]) + o,
                t.splice(i - 1, 1), i--), t[i] = new e.Token("plain-text", o, null, o);
            }
            s.content && "string" != typeof s.content && a(s.content);
        }
    };
    e.hooks.add("after-tokenize", (function(e) {
        "jsx" !== e.language && "tsx" !== e.language || a(e.tokens);
    }));
}(Prism));

(function(e) {
    e.languages.typescript = e.languages.extend("javascript", {
        "class-name": {
            pattern: /(\b(?:class|extends|implements|instanceof|interface|new|type)\s+)(?!keyof\b)[_$a-zA-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?:\s*<(?:[^<>]|<(?:[^<>]|<[^<>]*>)*>)*>)?/,
            lookbehind: !0,
            greedy: !0,
            inside: null
        },
        keyword: /\b(?:abstract|as|asserts|async|await|break|case|catch|class|const|constructor|continue|debugger|declare|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|is|keyof|let|module|namespace|new|null|of|package|private|protected|public|readonly|return|require|set|static|super|switch|this|throw|try|type|typeof|undefined|var|void|while|with|yield)\b/,
        builtin: /\b(?:string|Function|any|number|boolean|Array|symbol|console|Promise|unknown|never)\b/
    }), delete e.languages.typescript.parameter;
    var t = e.languages.extend("typescript", {});
    delete t["class-name"], e.languages.typescript["class-name"].inside = t, e.languages.insertBefore("typescript", "function", {
        "generic-function": {
            pattern: /#?[_$a-zA-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*\s*<(?:[^<>]|<(?:[^<>]|<[^<>]*>)*>)*>(?=\s*\()/,
            greedy: !0,
            inside: {
                function: /^#?[_$a-zA-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*/,
                generic: {
                    pattern: /<[\s\S]+/,
                    alias: "class-name",
                    inside: t
                }
            }
        }
    }), e.languages.ts = e.languages.typescript;
}(Prism));

var typescript = Prism.util.clone(Prism.languages.typescript);

Prism.languages.tsx = Prism.languages.extend("jsx", typescript);
