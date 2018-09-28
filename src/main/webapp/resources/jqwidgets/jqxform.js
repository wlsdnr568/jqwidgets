(function (a) {
	a.jqx.jqxWidget("jqxForm", "", {});
	a.extend(a.jqx._jqxForm.prototype, {
		defineInstance: function () {
			var b = {
				padding: {
					left: 5,
					top: 5,
					right: 5,
					bottom: 5
				},
				backgroundColor: "#FFFFFF",
				borderColor: "#E5E5E5",
				value: {},
				template: [{
						type: "text",
						label: "TextBox 1"
					}, {
						type: "text",
						label: "TextBox 2"
					}, ]
			};
			a.extend(true, this, b)
		},
		createInstance: function (c) {
			var b = this;
			b._isInitialized = false;
			var d = b.host;
			d.addClass(b.toThemeProperty("jqx-widget"));
			b._renderAndInit();
			this._setValue(this.value);
			this._prevValue = this._getValue();
			b._isInitialized = true
		},
		destroy: function () {
			this._destroyElements();
			this.host.removeData();
			this.host.remove();
			delete this.host;
			delete this.set;
			delete this.get;
			delete this.call;
			delete this.element
		},
		_destroyElements: function () {
			for (var c = 0; c < this.template.length; c++) {
				if (a.isArray(this.template[c].columns)) {
					for (var b = 0; b < this.template[c].columns.length; b++) {
						var d = c + "_" + b;
						this._getComponentById(d).off();
						this.host.find("#rowWrap_el_" + d).remove()
					}
				}
				this._getComponentById(c).off();
				this._getComponentLabelById(c).off();
				this._getComponentLabelById(c).removeData();
				this.host.find("#rowWrap_el_" + c).remove()
			}
			this.host.find("#formWrap").remove()
		},
		val: function (b) {
			if (undefined == b) {
				return this._getValue()
			} else {
				this._setValue(b)
			}
		},
		_onChangeHandler: function (f) {
			if (!this.isInitialized || this._suppressEvents) {
				return
			}
			var c = this._getValue();
			if (this._prevValue && JSON.stringify(c) == JSON.stringify(this._prevValue)) {
				return
			}
			var d = new a.Event("formDataChange");
			d.args = {
				value: c,
				previousValue: this._prevValue,
				target: f.target
			};
			console.log(f.target);
			d.owner = this;
			var b = this.host.trigger(d);
			if (d.cancel) {
				this._setValue(this._prevValue)
			} else {
				this._prevValue = c
			}
			return b
		},
		_onButtonClick: function (c, d) {
			if (!this.isInitialized) {
				return
			}
			var e = new a.Event("buttonClick");
			e.args = {
				name: d.name,
				text: c.val()
			};
			e.owner = this;
			var b = this.host.trigger(e);
			return b
		},
		submit: function (f, k, b) {
			var l = this;
			var d = l._getValue(true);
			var h = "<form id='jqx_fromToSubmit'";
			if (f) {
				h += ' action="' + f + '"'
			}
			if (k) {
				h += ' target="' + k + '"'
			}
			if (b && b.toString().toLowerCase() === "get") {
				h += ' method="GET"'
			} else {
				h += ' method="POST"'
			}
			h += ">";
			for (var g = 0; g < d.length; g++) {
				var e = d[g].value;
				var j = d[g].tool;
				var c = j.name;
				if (c == undefined) {
					c = j.id
				}
				if (c == undefined) {
					c = j.bind
				}
				if (j.type == "button" || j.type == "label") {
					if (!j.submit || j.submit == false) {
						continue
					}
				}
				if (j.submit == false) {
					continue
				}
				if (c !== undefined) {
					h += '<input type="hidden" ';
					h += ' name="' + c + '"';
					h += ' value="' + e + '"';
					h += ">"
				}
			}
			h += "</form>";
			l.host.find("#formSubmit").html(h);
			l.host.find("#jqx_fromToSubmit").submit()
		},
		_getValue: function (c) {
			var e = {};
			var d = [];
			for (var h = 0; h < this.template.length; h++) {
				var k = this.template[h];
				var l = "el_" + h;
				if (a.isArray(k.columns)) {
					for (var g = 0; g < k.columns.length; g++) {
						var f = k.columns[g];
						var q = l + "." + g;
						if (f.type == "option" && f.component != "jqxDropDownList") {
							var o = this._radioGroupGetValue(f, q);
							if (f.bind == undefined) {}
							else {
								this._setObjectProperty(e, f.bind, o)
							}
							if (c) {
								d.push({
									tool: f,
									value: o
								})
							}
							continue
						}
						var b = this._getComponentById(h + "_" + g);
						var n = b.val();
						if (n === undefined) {
							n = null
						}
						if (f.bind == undefined) {}
						else {
							this._setObjectProperty(e, f.bind, n)
						}
						if (c) {
							d.push({
								tool: f,
								value: n
							})
						}
					}
					continue
				}
				if (k.type == "option" && k.component != "jqxDropDownList") {
					var o = this._radioGroupGetValue(k, l);
					if (k.bind == undefined) {}
					else {
						this._setObjectProperty(e, k.bind, o)
					}
					if (c) {
						d.push({
							tool: k,
							value: o
						})
					}
					continue
				}
				var m = this._getComponentById(h);
				var n = m.val();
				if (n === undefined) {
					n = null
				}
				if (k.bind == undefined) {}
				else {
					this._setObjectProperty(e, k.bind, n)
				}
				if (c) {
					d.push({
						tool: k,
						value: n
					})
				}
			}
			if (c) {
				return d
			}
			return a.extend({}, this._prevValue, e)
		},
		_getObjectProperty: function (f, d) {
			if (typeof(f) !== "object" || f === undefined || d === undefined || d == "") {
				return f
			}
			var e = d.split(".");
			var g = f;
			for (var c = 0; c < e.length; c++) {
				g = g[e[c]]
			}
			return g
		},
		_setObjectProperty: function (g, d, e) {
			if (undefined === g) {
				return
			}
			if (undefined == d || d == "") {
				g = e;
				return
			}
			var f = d.split(".");
			var c = 0;
			while (c < f.length - 1) {
				if (undefined == g[f[c]]) {
					g[f[c]] = {}
				}
				c++
			}
			g[f[c]] = e
		},
		_setValue: function (c) {
			this._suppressEvents = true;
			for (var g = 0; g < this.template.length; g++) {
				var h = this.template[g];
				var k = "el_" + g;
				var d = undefined;
				if (a.isArray(h.columns)) {
					for (var f = 0; f < h.columns.length; f++) {
						var e = h.columns[f];
						var m = k + "." + f;
						if (!e.bind) {
							continue
						}
						d = this._getObjectProperty(c, e.bind);
						if (e.type == "option" && e.component != "jqxDropDownList") {
							this._radioGroupSetValue(e, m, d);
							continue
						}
						var b = this._getComponentById(g + "_" + f);
						if (c !== undefined) {
							b.val(d)
						}
					}
					continue
				}
				if (!h.bind) {
					continue
				}
				d = this._getObjectProperty(c, h.bind);
				if (h.type == "option" && h.component != "jqxDropDownList") {
					this._radioGroupSetValue(h, k, d);
					continue
				}
				var l = this._getComponentById(g);
				if (h.type == "label") {
					l.html(d);
					continue
				}
				if (c !== undefined) {
					l.val(d)
				}
			}
			this._prevValue = c;
			this._suppressEvents = false
		},
		_radioGroupGetValue: function (b, f) {
			for (var c = 0; c < b.options.length; c++) {
				var e = f + "_option_" + c;
				var d = this.host.find("#" + e);
				if (d.length > 0) {
					var g = d.jqxRadioButton("val");
					if (g == true) {
						if (b.options[c].value !== undefined) {
							return b.options[c].value
						}
						return b.options[c].label
					}
				}
			}
			return undefined
		},
		_radioGroupSetValue: function (b, f, g) {
			for (var c = 0; c < b.options.length; c++) {
				if (b.options[c].value !== undefined) {
					if (g !== b.options[c].value) {
						continue
					}
				} else {
					if (g !== b.options[c].label) {
						continue
					}
				}
				var e = f + "_option_" + c;
				var d = this.host.find("#" + e);
				if (d.length > 0) {
					d.jqxRadioButton("val", true)
				}
			}
		},
		_getToolStyle: function (b) {
			var c = "display: block;";
			var d = ["left", "right", "top", "bottom"];
			if (b.height) {
				c += "height: " + b.height + ";"
			}
			if (b.valign !== undefined) {
				c += "vertical-align: " + b.valign + ";"
			} else {
				c += "vertical-align: middle;"
			}
			return c
		},
		_getAlignMargin: function (b, f) {
			if (!b || !b[f]) {
				return ""
			}
			var g = ["left", "right", "top", "bottom"];
			var e = {};
			var d = "";
			if (b[f]) {
				e = {};
				if (b[f] == "left") {
					e.left = "0px";
					e.right = "auto"
				} else {
					if (b[f] == "right") {
						e.left = "auto";
						e.right = "0px"
					} else {
						e.left = "auto";
						e.right = "auto"
					}
				}
			}
			if (e) {
				for (var c in g) {
					if (e[g[c]]) {
						d += "margin-" + g[c] + ": " + e[g[c]] + ";"
					}
				}
			}
			return d
		},
		_getPaddingAndMarginStyle: function (f, g) {
			var b = "";
			var h = ["left", "right", "top", "bottom"];
			var k = g ? "labelpadding" : "padding";
			var e = g ? "labelmargin" : "margin";
			var j = a.extend({
					left: 5,
					top: 5,
					right: 5,
					bottom: 5
				}, f[k]);
			for (var d in j) {
				j[d] = !isNaN(j[d]) ? j[d] : parseFloat(j[d].toString())
			}
			var c = f[e];
			if (j) {
				for (var d in h) {
					if (j[h[d]]) {
						b += "padding-" + h[d] + ": " + j[h[d]] + "px;"
					}
				}
			}
			if (c) {
				for (var d in h) {
					if (c[h[d]]) {
						b += "margin-" + h[d] + ": " + c[h[d]] + ";"
					}
				}
			}
			return b
		},
		_getToolLabelStyle: function (b) {
			var c = "display:block;";
			var d = ["left", "right", "top", "bottom"];
			if (b.labelheight !== undefined) {
				c += "height: " + b.labelheight + ";"
			} else {
				c += "height: 100%;"
			}
			if (b.labelvalign !== undefined) {
				c += "vertical-align: " + b.labelvalign + ";"
			} else {
				if (b.valign !== undefined) {
					c += "vertical-align: " + b.valign + ";"
				} else {
					c += "vertical-align: middle;"
				}
			}
			return c
		},
		_renderAndInit: function () {
			var b = this._createTemplateHtml();
			this.host.append(b);
			this._initTools()
		},
		refresh: function (c) {
			var b = this;
			if (!b._isInitialized || c === true) {
				return
			}
			var d = b.val();
			b._destroyElements();
			b._renderAndInit();
			b._prevValue = d;
			b.val(d)
		},
		_createTemplateHtml: function () {
			var c = this.groups;
			var b = "padding-left: " + parseFloat(this.padding.left) + "px;padding-right: " + parseFloat(this.padding.right) + "px;padding-top: " + parseFloat(this.padding.top) + "px;padding-bottom: " + parseFloat(this.padding.bottom) + "px;";
			var f = "<table id='formWrap' style='background-color: " + this.backgroundColor + "; width: 100%; white-space: nowrap; border: 0px;" + b + "' cellpadding='0' cellspacing='0'><div id='formSubmit' style='display:hidden;'><div>";
			var j = this.template;
			for (var e = 0; e < j.length; e++) {
				var h = "el_" + e;
				var d = this.template[e];
				var g = this._getToolTemplate(d, h);
				f += g
			}
			f += "</table>";
			return f
		},
		_beginRow: function (e, b, c) {
			if (undefined === b) {
				b = "auto"
			}
			if (c) {
				c = "valign='" + c + "'"
			} else {
				c = ""
			}
			var d = "<tr style='width: 100%; height: " + b + ";' id='rowWrap_" + e + "' " + c + ">";
			d += "<td style='width: 100%;'><table style='width: 100%; white-space: nowrap; border: 0px;' cellspacing='0' cellpadding='0'><tr style='width: 100%'>";
			return d
		},
		_endRow: function () {
			return "<td style='width: auto; background: transparent;'> </tr></table></td></tr>"
		},
		_beginColumn: function (d, c) {
			if (!c) {
				c = ""
			}
			if (undefined === d) {
				d = "auto"
			}
			var b = "<td style='width:" + d + "; background: transparent;'>";
			b += "<div style='display:block; overflow: visible; width: 100%; background: transparent;'>";
			return b
		},
		_endColumn: function () {
			return "</div></td>"
		},
		_splitLabelToolWidth: function (e, c) {
			var h = c ? "auto" : e.columnwidth;
			var b = e.labelwidth;
			var d = a.extend({
					left: 5,
					top: 5,
					right: 5,
					bottom: 5
				}, e.padding);
			var g = a.extend({
					left: 5,
					top: 5,
					right: 5,
					bottom: 5
				}, e.labelpadding);
			for (var f in d) {
				d[f] = !isNaN(d[f]) ? d[f] : parseFloat(d[f].toString())
			}
			for (var f in g) {
				g[f] = !isNaN(g[f]) ? g[f] : parseFloat(g[f].toString())
			}
			if (e.label == "" || e.label == undefined) {
				b = 0;
				g = {
					left: 0,
					right: 0,
					top: 0,
					bottom: 0
				}
			}
			if (e.labelposition == "top" || e.labelposition == "bottom") {
				if (undefined === b) {
					b = h
				}
				if (undefined === h) {
					h = b
				}
				if (h && h.toString().indexOf("%") != -1 && b && b.toString().indexOf("%") != -1) {
					h = b = Math.max(parseFloat(h), parseFloat(b)) + "%"
				}
				if (h && h.toString().indexOf("%") == -1 && b && b.toString().indexOf("%") == -1) {
					h = b = Math.max(parseFloat(h), parseFloat(b)) + "px"
				}
				return [b, h]
			}
			if (b === undefined) {
				if (h !== undefined && h !== "auto") {
					return ["auto", h]
				} else {
					if (e.labelposition == "right") {
						if (e.align == "right" || e.align == "center" || e.align == "middle") {
							return ["auto", "100%"]
						}
						return ["100%", "auto"]
					}
					return ["auto", "100%"]
				}
			} else {
				if (b.toString().indexOf("%") !== -1) {
					b = parseFloat(b);
					if (h !== undefined) {
						if (h.toString().indexOf("%") !== -1) {
							h = parseFloat(h);
							return [Math.min(100, b) + "%", Math.min(h, 100 - b) + "%"]
						} else {
							h = parseFloat(h);
							return [Math.min(100, b) + "%", h]
						}
					}
					return [Math.min(100, b) + "%", Math.max(0, 100 - b) + "%"]
				} else {
					b = parseFloat(b) + g.left + g.right;
					if (h == undefined) {
						return [b + "px", "calc(100% - " + b + "px)"]
					}
					return [b + "px", h]
				}
			}
		},
		_getToolTemplate: function (h, s, j, q) {
			var g = {};
			for (p in h) {
				g[p.toLowerCase()] = h[p]
			}
			if (a.isArray(g.columns) && isNaN(j)) {
				var v = this._beginRow(s, g.rowheight || "auto");
				for (var A = 0; A < g.columns.length; A++) {
					var y = this._getToolTemplate(g.columns[A], (s + "_" + A), undefined, true);
					var t = "auto";
					if (g.columns[A].columnWidth !== undefined) {
						t = g.columns[A].columnWidth
					} else {
						if (g.columns[A].width !== undefined) {
							t = g.columns[A].width
						}
					}
					v += this._beginColumn(t);
					v += "<table cellspacing='0' cellpadding='0' style='width: 100%; white-space: nowrap; border: 0px;'>" + y + "</table>";
					v += this._endColumn()
				}
				v += this._endRow();
				return v
			}
			if (g.type == "option" && g.component != "jqxDropDownList") {
				if (isNaN(j)) {
					var B = this._beginRow(s, g.rowheight || "auto", g.valign);
					for (var A = 0; A < g.options.length; A++) {
						var y = this._getToolTemplate(g, (s + "_option_" + A), A, true);
						if (g.optionslayout == "horizontal") {
							var t = 100 / Math.max(1, g.options.length) + "%";
							if (g.columnwidth) {
								t = g.columnwidth
							}
							B += this._beginColumn(t);
							B += "<table cellspacing='0' cellpadding='0' style='width: 100%; white-space: nowrap; border: 0px;'>" + y + "</table>";
							B += this._endColumn()
						} else {
							B += y
						}
					}
					B += this._endRow();
					return B
				}
			}
			var d = g.labelposition;
			var m = g.label;
			var k = "";
			if (g.type == "option" && g.component != "jqxDropDownList" && !isNaN(j)) {
				var k = g.options[j].label;
				m = k
			}
			if (m === undefined) {
				m = ""
			}
			var B = "";
			var b = this._getToolLabelStyle(g) + this._getPaddingAndMarginStyle(g, true);
			var r = this._getToolStyle(g) + this._getPaddingAndMarginStyle(g, false);
			var e = "";
			var x = this._getAlignMargin(g, "align");
			var C = "text-align: left;";
			if (g.labelalign == "center" || g.labelalign == "middle") {
				C = "text-align: center"
			} else {
				if (g.labelalign == "right") {
					C = "text-align: right"
				}
			}
			var D = "text-align: left;";
			if (g.align == "center" || g.align == "middle") {
				D = "text-align: center"
			} else {
				if (g.align == "right") {
					D = "text-align: right"
				}
			}
			var o = this._splitLabelToolWidth(g, q);
			var f = m;
			if (g.required) {
				var n = "<span class='" + e + "' style='color:red;'>*</span>";
				if (g.requiredposition) {
					if (g.requiredposition.toLowerCase() == "left") {
						f = n + " " + m
					} else {
						f = m + " " + n
					}
				} else {
					f = m + " " + n
				}
			}
			var w = "";
			if (g.type == "boolean" || (g.type == "option" && !isNaN(j))) {
				w += "; cursor: pointer;"
			}
			var l = "<div class='" + e + "' style='" + b + "'><div style='" + C + w + ";' id='label_" + s + "'>" + f + "</div></div>";
			var z = (g.info !== undefined && g.infoposition != "left") ? "margin-left: -3px;" : "margin-right: -3px;";
			var c = "<div style='" + z + "' class='" + this.toThemeProperty("jqx-info-icon") + "' title='" + g.info + "'></div>";
			var u = "<div style='background: transparent;" + r + "'><div style='width: auto; height: auto; " + x + "' id='" + s + "'></div></div>";
			if (g.type == "text" || g.type == "button") {
				u = "<div style='background: transparent;" + r + D + "'><input style='width: auto; height: auto; " + x + "' id='" + s + "' type='" + g.type + "'/></div>"
			} else {
				if (g.type == "password") {
					u = "<div style='background: transparent;" + r + D + "'><input type='password' style='width: auto; height: auto; " + x + "' id='" + s + "'/></div>"
				}
			}
			if (g.type == "option" && g.component != "jqxDropDownList" && !isNaN(j)) {
				var t = g.width;
				if (t === undefined) {
					t = "15px"
				}
				o = [g.labelwidth || "auto", t];
				if (g.labelposition && (g.labelposition == "top" || g.labelposition == "bottom")) {
					o = ["100%", "100%"]
				}
				u = "<div style='background: transparent;" + r + x + D + "'><div style='width: " + t + "; height: 100%; " + x + D + ";' id='" + s + "'></div></div>"
			}
			if (g.info !== undefined && g.info !== "") {
				if (g.infoposition == "left") {
					u = "<table cellspacing='0' cellpadding='0' style='border: 0px; white-space: nowrap;" + x + "'><tr><td>" + c + "</td><td>" + u + "</td></tr></table>"
				} else {
					u = "<table cellspacing='0' cellpadding='0' style='border: 0px; white-space: nowrap;" + x + "'><tr><td>" + u + "</td><td>" + c + "</td></tr></table>"
				}
			}
			if (d == "right") {
				B += this._beginRow(s, g.rowheight || "auto", g.valign);
				B += this._beginColumn(o[1]);
				B += u;
				if (m != "") {
					B += this._endColumn();
					B += this._beginColumn(o[0]);
					B += l
				}
				B += this._endColumn();
				B += this._endRow()
			} else {
				if (d == "top") {
					B += this._beginRow(s, g.rowheight || "auto", g.valign);
					B += this._beginColumn(g.columnwidth);
					if (m != "") {
						B += l
					}
					B += u;
					B += this._endColumn();
					B += this._endRow()
				} else {
					if (d == "bottom") {
						B += this._beginRow(s, g.rowheight || "auto", g.valign);
						B += this._beginColumn(g.columnwidth);
						B += u;
						if (m != "") {
							B += l
						}
						B += this._endColumn();
						B += this._endRow()
					} else {
						B += this._beginRow(s, g.rowheight || "auto", g.valign);
						if (m != "") {
							B += this._beginColumn(o[0]);
							B += l;
							B += this._endColumn()
						}
						B += this._beginColumn(o[1]);
						B += u;
						B += this._endColumn();
						B += this._endRow()
					}
				}
			}
			return B
		},
		_initTools: function (f, e) {
			var d = f || this.template;
			if (undefined == e) {
				e = ""
			}
			for (var c = 0; c < d.length; c++) {
				var b = d[c];
				if (a.isArray(b.columns)) {
					this._initTools(b.columns, c + "_");
					continue
				}
				var g = e + c;
				switch (b.type) {
				case "color":
					this._initColorTool(g);
					break;
				case "option":
					if (b.component == "jqxDropDownList") {
						this._initOptionToolDropDownList(g)
					} else {
						this._initOptionTool(g)
					}
					break;
				case "dropdownlist":
					this._initOptionToolDropDownList(g);
					break;
				case "number":
					this._initNumberTool(g);
					break;
				case "boolean":
				case "checkbox":
					this._initBooleanTool(g);
					break;
				case "text":
					this._initTextTool(g);
					break;
				case "password":
					this._initPasswordTool(g);
					break;
				case "label":
					this._initLabelTool(g);
					break;
				case "date":
				case "time":
				case "datetime":
					this._initDateTimeTool(g);
					break;
				case "button":
					this._initButtonTool(g);
					break;
				case "custom":
					this._initCustomTool(g);
					break;
				case "maskedinput":
				    this._initMaskedInputTool(g);
				    break;
				}
				if (b.visible === false) {
					this._showhideComponent(undefined, g, false)
				}
				if (b.theme) {
					this._setToolTheme(b, g)
				}
			}
		},
		_setToolTheme: function (c, e) {
			var b = this._getComponentById(e);
			var d = c.theme || this.theme;
			switch (c.type) {
			case "option":
				if (c.component == "jqxDropDownList") {
					b.jqxDropDownList("theme", d)
				}
				break;
			case "number":
				b.jqxNumberInput("theme", d);
				break;
			case "text":
				b.jqxInput("theme", d);
				break;
			case "password":
				b.jqxPasswordInput("theme", d);
				break
			}
		},
		_initOptionTool: function (h) {
			var b = this;
			var j = "el_" + h;
			var c = b._getTool(h);
			for (var d = 0; d < c.options.length; d++) {
				var g = j + "_option_" + d;
				var e = b.host.find("#" + g);
				if (e.length > 0) {
					e.jqxRadioButton({
						width: 25,
						theme: b.theme,
						groupName: "group_" + h
					}).on("change", function (i) {
						b._onChangeHandler(i)
					})
				}
				var f = b.host.find("#label_" + g);
				f.data("el", e);
				f.on("mousedown", function (k) {
					var i = a(this).data("el");
					i.jqxRadioButton("toggle")
				})
			}
		},
		_initOptionToolDropDownList: function (seq) {
			var _this = this;
			var id = "el_" + seq;
			var obj =  _this._getTool(seq);
			var elem = this.host.find("#" + id);
			var divHeight = '<div style="height: 20px;"></div>';
			var source = [];
			
			if (obj.options && a.isArray(obj.options)) {     // TODO : a -> 변경
				for (let i = 0; i < obj.options.length; i++) {
				    source.push(obj.options[i]);
				}
			}
			
			if (obj.init) {
			    obj.init(elem);
			} else {
				var width = isNaN(parseFloat(obj.width)) ? "auto" : obj.width;
				if (obj.width && obj.width.toString().indexOf("%") != -1 && obj.columnwidth === undefined) {
					width = "100%";
				}
				
				var height = isNaN(parseFloat(obj.height)) ? "30px" : obj.height;
				
				elem.jqxDropDownList({
					"theme" :  _this.theme,
					"width" : width || "auto",
					"autoDropDownHeight" : true,
					"height" : height,
					"enableBrowserBoundsDetection" : true,
					"source" : source,
					"selectedIndex" : 0
				});
			}
			elem.on("change", function (event) {
			    _this._onChangeHandler(event);
			})
		},
		_initNumberTool: function (seq) {
		    let _this = this;
			let id = "el_" + seq;
			let obj = _this._getTool(seq);
			let elem = this.host.find("#" + id);
			
			if (obj.init) {
			    obj.init(elem);
			} else {
			    let width = isNaN(parseFloat(obj.width)) ? "auto" : obj.width;
				let height = isNaN(parseFloat(obj.height)) ? "30px" : obj.height;
				
				elem.jqxNumberInput({
					"theme" : _this.theme,
					"width" : width,
					"height" : height,
					"inputMode" : "simple"
				})
			}
			elem.on("change", function (i) {
			    _this._onChangeHandler(i)
			})
		},
		_initBooleanTool: function (seq) {
			let _this = this;
			let id = "el_" + seq;
			let obj = _this._getTool(seq);
			let elem = this.host.find("#" + id);
			
			if (obj.init) {
			    obj.init(elem);
			} else {
				let width = isNaN(parseFloat(obj.width)) ? "auto" : obj.width;
				let height = isNaN(parseFloat(obj.height)) ? "30px" : obj.height;
				let isThreeState = obj.isThreeState == true;
				
				if (obj.component === undefined || obj.component == "jqxCheckBox") {
				    elem.jqxCheckBox({
						"theme" : _this.theme,
						"width" : width,
						"height" : height,
						"hasThreeStates" : isThreeState
					});
				} else {
					return;
				}
			}
			
			elem.on("change", function (event) {
			    _this._onChangeHandler(event);
			});
			
			let labelElem = _this.host.find("#label_" + id);
			
			labelElem.on("mousedown", function (evnet) {
				let hasValue = _this.host.find("#" + id).val();
				_this.host.find("#" + id).val(!hasValue);
			})
		},
		_initTextTool: function (seq) {
			let _this = this;
			let id = "el_" + seq;
			let obj = _this._getTool(seq);
			let elem = this.host.find("#" + id);
			
			if (obj.init) {
			    obj.init(elem);
			} else {
				let width = isNaN(parseFloat(obj.width)) ? "auto" : obj.width;
				let height = isNaN(parseFloat(obj.height)) ? "30px" : obj.height;
				
				elem.jqxInput({
					"theme" : _this.theme,
					"width" : width,
					"height" : height
				});
			}
			
			elem.on("change", function (event) {
			    _this._onChangeHandler(event);
			});
		},
		_initLabelTool: function (seq) {
			let _this = this;
			let id = "el_" + seq;
			let obj = _this._getTool(seq);
			let elem = this.host.find("#" + id);
			
			if (obj.render && a.isFunction(obj.render)) {    // TODO : a -> 변경
				let render = obj.render();
				elem.html(render || "")
			}
		},
		// TODO : 위치변경
		_getTool: function (e) {
			var b = this;
			var d = e.split("_");
			var c = b.template[d[0]];
			if (d[1]) {
				if (a.isArray(c.columns) && c.columns.length > d[1]) {
					return c.columns[d[1]]
				}
				return undefined
			}
			return c
		},
		_initCustomTool: function (seq) {
			let _this = this;
			let id = "el_" + seq;
			let obj = b._getTool(seq);
			let elem = this.host.find("#" + id);
			
			if (obj.init) {
			    obj.init(elem);
			}
		},
		_initButtonTool: function (seq) {
			let _this = this;
			let id = "el_" + seq;
			let obj = _this._getTool(seq);
			let elem = _this.host.find("#" + id);
			
			if (obj.init) {
			    obj.init(elem);
			} else {
				let width = isNaN(parseFloat(obj.width)) ? "auto" : obj.width;
				let height = isNaN(parseFloat(obj.height)) ? "30px" : obj.height;
				
				elem.jqxButton({
					"theme" : _this.theme,
					"width" : width,
					"height" : height
				});
				
				elem.val(obj.text === undefined ? "Button" : obj.text);
			}
			
			_this.host.find("#" + id).on("click", function (event) {
			    _this._onButtonClick(elem, obj);
			});
		},
		_initPasswordTool: function (seq) {
		    let _this = this;
			var id = "el_" + seq;
			var obj = _this._getTool(seq);
			var elem = _this.host.find("#" + id);
			
			if (obj.init) {
			    obj.init(elem);
			} else {
				let width = isNaN(parseFloat(obj.width)) ? "auto" : obj.width;
				let height = isNaN(parseFloat(obj.height)) ? "25px" : obj.height;
				elem.jqxPasswordInput({
					"theme" : this.theme,
					"width" : width,
					"height" : height
				});
			}
			
			elem.on("change", function (event) {
			    _this._onChangeHandler(event);
			});
		},
		_initDateTimeTool: function (seq) {
		    let _this = this;
            let id = "el_" + seq;
            let obj = _this._getTool(seq);
            let elem = _this.host.find("#" + id);
            
            if (obj.init) {
                obj.init(elem);
            } else {
                let width = isNaN(parseFloat(obj.width)) ? "auto" : obj.width;
                let height = isNaN(parseFloat(obj.height)) ? "30px" : obj.height;
                let formatString = obj.formatString;
                
                if (!formatString) {
                    if (obj.type == "time") {
                        formatString = "hh mm ss tt";
                    } else {
                        if (obj.type == "date") {
                            formatString = "MM/dd/yyyy";
                        } else {
                            formatString = "MM/dd/yyyy hh:mm:ss tt";
                        }
                    }
                }
                
                elem.jqxDateTimeInput({
                    "theme": this.theme,
                    "width": width,
                    "height": height,
                    "formatString": formatString,
                    "showTimeButton": obj.type != "date",
                    "showCalendarButton": obj.type != "time"
                });
            }
            
            elem.on("valueChanged", function (event) {
                _this._onChangeHandler(event);
            })
        },
		// 180928_kmh Component 초기화 설정
		_initMaskedInputTool: function(seq) {
		    let _this = this;
            let id = "el_" + seq;
            let obj = _this._getTool(seq);
            let elem = _this.host.find("#" + id);
            
            if (obj.init) {
                obj.init(elem);
            } else {
                elem.jqxMaskedInput({
                    "mask" : obj.mask
                });
            }
		},
		getComponentByName: function (c) {
			if (!a.isArray(this.template)) {
				return undefined
			}
			for (var d = 0; d < this.template.length; d++) {
				if (this.template[d].name == c) {
					return this._getComponentById(d)
				}
				if (a.isArray(this.template[d].columns)) {
					for (var b = 0; b < this.template[d].columns.length; b++) {
						if (this.template[d].columns[b].name == c) {
							return this._getComponentById(d + "_" + b)
						}
					}
				}
			}
			return undefined
		},
		getComponentNameById: function (id) {
			if (!a.isArray(this.template)) {
				return undefined
			}
			for (var d = 0; d < this.template.length; d++) {
				if (this._getComponentById(d).attr("id") === id) {
					return this.template[d].bind;
				}
				if (a.isArray(this.template[d].columns)) {
					for (var b = 0; b < this.template[d].columns.length; b++) {
						if (this._getComponentById(d + "_" + b).attr("id") === id) {
							return this.template[d].columns[b].bind;
						}
					}
				}
			}
			return undefined;
		},
		setFocus: function (fieldNm) {
			this.getComponentByName(fieldNm).focus();
		},
		_getComponentById: function (c) {
			var b = this.host.find("#el_" + c);
			return b
		},
		_getComponentLabelById: function (c) {
			var b = this.host.find("#label_el_" + c);
			return b
		},
		hideComponent: function (b) {
			this._showhideComponent(b, undefined, false)
		},
		showComponent: function (b) {
			this._showhideComponent(b, undefined, true)
		},
		_showhideComponent: function (e, h, b) {
			if (!a.isArray(this.template)) {
				return
			}
			var d = "";
			if (h === undefined) {
				for (var f = 0; f < this.template.length; f++) {
					if (this.template[f].name == e) {
						d = f;
						break
					}
					if (a.isArray(this.template[f].columns)) {
						for (var c = 0; c < this.template[f].length; c++) {
							if (this.template[f].columns[c].name == e) {
								d = f + "_" + c;
								break
							}
						}
					}
				}
			} else {
				d = h
			}
			if (d != "") {
				var g = this.host.find("#rowWrap_el_" + d);
				if (g && g.length != 0) {
					if (b) {
						g.show()
					} else {
						g.hide()
					}
				}
			}
		}
	})
})(jqxBaseFramework);