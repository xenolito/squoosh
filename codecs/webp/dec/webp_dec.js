var Module = (function () {
  var _scriptDir = import.meta.url;

  return function (Module) {
    Module = Module || {};

    var e;
    e || (e = typeof Module !== 'undefined' ? Module : {});
    var aa, r;
    e.ready = new Promise(function (a, b) {
      aa = a;
      r = b;
    });
    var t = {},
      u;
    for (u in e) e.hasOwnProperty(u) && (t[u] = e[u]);
    var v = '',
      ba;
    v = self.location.href;
    _scriptDir && (v = _scriptDir);
    0 !== v.indexOf('blob:')
      ? (v = v.substr(0, v.lastIndexOf('/') + 1))
      : (v = '');
    ba = function (a) {
      var b = new XMLHttpRequest();
      b.open('GET', a, !1);
      b.responseType = 'arraybuffer';
      b.send(null);
      return new Uint8Array(b.response);
    };
    var x = e.printErr || console.warn.bind(console);
    for (u in t) t.hasOwnProperty(u) && (e[u] = t[u]);
    t = null;
    var y;
    e.wasmBinary && (y = e.wasmBinary);
    var noExitRuntime;
    e.noExitRuntime && (noExitRuntime = e.noExitRuntime);
    'object' !== typeof WebAssembly && z('no native wasm support detected');
    var A,
      ca = !1,
      da = new TextDecoder('utf8');
    function ea(a, b, c) {
      var d = C;
      if (0 < c) {
        c = b + c - 1;
        for (var f = 0; f < a.length; ++f) {
          var g = a.charCodeAt(f);
          if (55296 <= g && 57343 >= g) {
            var k = a.charCodeAt(++f);
            g = (65536 + ((g & 1023) << 10)) | (k & 1023);
          }
          if (127 >= g) {
            if (b >= c) break;
            d[b++] = g;
          } else {
            if (2047 >= g) {
              if (b + 1 >= c) break;
              d[b++] = 192 | (g >> 6);
            } else {
              if (65535 >= g) {
                if (b + 2 >= c) break;
                d[b++] = 224 | (g >> 12);
              } else {
                if (b + 3 >= c) break;
                d[b++] = 240 | (g >> 18);
                d[b++] = 128 | ((g >> 12) & 63);
              }
              d[b++] = 128 | ((g >> 6) & 63);
            }
            d[b++] = 128 | (g & 63);
          }
        }
        d[b] = 0;
      }
    }
    var fa = new TextDecoder('utf-16le');
    function ha(a, b) {
      var c = a >> 1;
      for (b = c + b / 2; !(c >= b) && D[c]; ) ++c;
      return fa.decode(C.subarray(a, c << 1));
    }
    function ia(a, b, c) {
      void 0 === c && (c = 2147483647);
      if (2 > c) return 0;
      c -= 2;
      var d = b;
      c = c < 2 * a.length ? c / 2 : a.length;
      for (var f = 0; f < c; ++f) (E[b >> 1] = a.charCodeAt(f)), (b += 2);
      E[b >> 1] = 0;
      return b - d;
    }
    function ja(a) {
      return 2 * a.length;
    }
    function ka(a, b) {
      for (var c = 0, d = ''; !(c >= b / 4); ) {
        var f = F[(a + 4 * c) >> 2];
        if (0 == f) break;
        ++c;
        65536 <= f
          ? ((f -= 65536),
            (d += String.fromCharCode(55296 | (f >> 10), 56320 | (f & 1023))))
          : (d += String.fromCharCode(f));
      }
      return d;
    }
    function la(a, b, c) {
      void 0 === c && (c = 2147483647);
      if (4 > c) return 0;
      var d = b;
      c = d + c - 4;
      for (var f = 0; f < a.length; ++f) {
        var g = a.charCodeAt(f);
        if (55296 <= g && 57343 >= g) {
          var k = a.charCodeAt(++f);
          g = (65536 + ((g & 1023) << 10)) | (k & 1023);
        }
        F[b >> 2] = g;
        b += 4;
        if (b + 4 > c) break;
      }
      F[b >> 2] = 0;
      return b - d;
    }
    function ma(a) {
      for (var b = 0, c = 0; c < a.length; ++c) {
        var d = a.charCodeAt(c);
        55296 <= d && 57343 >= d && ++c;
        b += 4;
      }
      return b;
    }
    var G, na, C, E, D, F, H, oa, pa;
    function qa(a) {
      G = a;
      e.HEAP8 = na = new Int8Array(a);
      e.HEAP16 = E = new Int16Array(a);
      e.HEAP32 = F = new Int32Array(a);
      e.HEAPU8 = C = new Uint8Array(a);
      e.HEAPU16 = D = new Uint16Array(a);
      e.HEAPU32 = H = new Uint32Array(a);
      e.HEAPF32 = oa = new Float32Array(a);
      e.HEAPF64 = pa = new Float64Array(a);
    }
    var ra = e.INITIAL_MEMORY || 16777216;
    e.wasmMemory
      ? (A = e.wasmMemory)
      : (A = new WebAssembly.Memory({ initial: ra / 65536, maximum: 32768 }));
    A && (G = A.buffer);
    ra = G.byteLength;
    qa(G);
    var J,
      sa = [],
      ta = [],
      ua = [],
      va = [];
    function wa() {
      var a = e.preRun.shift();
      sa.unshift(a);
    }
    var K = 0,
      xa = null,
      M = null;
    e.preloadedImages = {};
    e.preloadedAudios = {};
    function z(a) {
      if (e.onAbort) e.onAbort(a);
      x(a);
      ca = !0;
      a = new WebAssembly.RuntimeError(
        'abort(' + a + '). Build with -s ASSERTIONS=1 for more info.',
      );
      r(a);
      throw a;
    }
    function ya() {
      var a = N;
      return String.prototype.startsWith
        ? a.startsWith('data:application/octet-stream;base64,')
        : 0 === a.indexOf('data:application/octet-stream;base64,');
    }
    var N = 'webp_dec.wasm';
    if (!ya()) {
      var za = N;
      N = e.locateFile ? e.locateFile(za, v) : v + za;
    }
    function Aa() {
      try {
        if (y) return new Uint8Array(y);
        if (ba) return ba(N);
        throw 'both async and sync fetching of the wasm failed';
      } catch (a) {
        z(a);
      }
    }
    function Ba() {
      return y || 'function' !== typeof fetch
        ? Promise.resolve().then(Aa)
        : fetch(N, { credentials: 'same-origin' })
            .then(function (a) {
              if (!a.ok) throw "failed to load wasm binary file at '" + N + "'";
              return a.arrayBuffer();
            })
            .catch(function () {
              return Aa();
            });
    }
    function O(a) {
      for (; 0 < a.length; ) {
        var b = a.shift();
        if ('function' == typeof b) b(e);
        else {
          var c = b.G;
          'number' === typeof c
            ? void 0 === b.C
              ? J.get(c)()
              : J.get(c)(b.C)
            : c(void 0 === b.C ? null : b.C);
        }
      }
    }
    function Ca(a) {
      switch (a) {
        case 1:
          return 0;
        case 2:
          return 1;
        case 4:
          return 2;
        case 8:
          return 3;
        default:
          throw new TypeError('Unknown type size: ' + a);
      }
    }
    var Da = void 0;
    function P(a) {
      for (var b = ''; C[a]; ) b += Da[C[a++]];
      return b;
    }
    var Q = {},
      R = {},
      S = {};
    function Ea(a) {
      if (void 0 === a) return '_unknown';
      a = a.replace(/[^a-zA-Z0-9_]/g, '$');
      var b = a.charCodeAt(0);
      return 48 <= b && 57 >= b ? '_' + a : a;
    }
    function Fa(a, b) {
      a = Ea(a);
      return new Function(
        'body',
        'return function ' +
          a +
          '() {\n    "use strict";    return body.apply(this, arguments);\n};\n',
      )(b);
    }
    function Ga(a) {
      var b = Error,
        c = Fa(a, function (d) {
          this.name = a;
          this.message = d;
          d = Error(d).stack;
          void 0 !== d &&
            (this.stack =
              this.toString() + '\n' + d.replace(/^Error(:[^\n]*)?\n/, ''));
        });
      c.prototype = Object.create(b.prototype);
      c.prototype.constructor = c;
      c.prototype.toString = function () {
        return void 0 === this.message
          ? this.name
          : this.name + ': ' + this.message;
      };
      return c;
    }
    var Ha = void 0;
    function T(a) {
      throw new Ha(a);
    }
    var Ia = void 0;
    function Ja(a, b) {
      function c(h) {
        h = b(h);
        if (h.length !== d.length)
          throw new Ia('Mismatched type converter count');
        for (var p = 0; p < d.length; ++p) U(d[p], h[p]);
      }
      var d = [];
      d.forEach(function (h) {
        S[h] = a;
      });
      var f = Array(a.length),
        g = [],
        k = 0;
      a.forEach(function (h, p) {
        R.hasOwnProperty(h)
          ? (f[p] = R[h])
          : (g.push(h),
            Q.hasOwnProperty(h) || (Q[h] = []),
            Q[h].push(function () {
              f[p] = R[h];
              ++k;
              k === g.length && c(f);
            }));
      });
      0 === g.length && c(f);
    }
    function U(a, b, c) {
      c = c || {};
      if (!('argPackAdvance' in b))
        throw new TypeError(
          'registerType registeredInstance requires argPackAdvance',
        );
      var d = b.name;
      a || T('type "' + d + '" must have a positive integer typeid pointer');
      if (R.hasOwnProperty(a)) {
        if (c.H) return;
        T("Cannot register type '" + d + "' twice");
      }
      R[a] = b;
      delete S[a];
      Q.hasOwnProperty(a) &&
        ((b = Q[a]),
        delete Q[a],
        b.forEach(function (f) {
          f();
        }));
    }
    var Ma = [],
      V = [
        {},
        { value: void 0 },
        { value: null },
        { value: !0 },
        { value: !1 },
      ];
    function Na(a) {
      4 < a && 0 === --V[a].D && ((V[a] = void 0), Ma.push(a));
    }
    function W(a) {
      switch (a) {
        case void 0:
          return 1;
        case null:
          return 2;
        case !0:
          return 3;
        case !1:
          return 4;
        default:
          var b = Ma.length ? Ma.pop() : V.length;
          V[b] = { D: 1, value: a };
          return b;
      }
    }
    function Oa(a) {
      return this.fromWireType(H[a >> 2]);
    }
    function Pa(a) {
      if (null === a) return 'null';
      var b = typeof a;
      return 'object' === b || 'array' === b || 'function' === b
        ? a.toString()
        : '' + a;
    }
    function Qa(a, b) {
      switch (b) {
        case 2:
          return function (c) {
            return this.fromWireType(oa[c >> 2]);
          };
        case 3:
          return function (c) {
            return this.fromWireType(pa[c >> 3]);
          };
        default:
          throw new TypeError('Unknown float type: ' + a);
      }
    }
    function Ra(a) {
      var b = Function;
      if (!(b instanceof Function))
        throw new TypeError(
          'new_ called with constructor type ' +
            typeof b +
            ' which is not a function',
        );
      var c = Fa(b.name || 'unknownFunctionName', function () {});
      c.prototype = b.prototype;
      c = new c();
      a = b.apply(c, a);
      return a instanceof Object ? a : c;
    }
    function Sa(a) {
      for (; a.length; ) {
        var b = a.pop();
        a.pop()(b);
      }
    }
    function Ta(a, b) {
      var c = e;
      if (void 0 === c[a].A) {
        var d = c[a];
        c[a] = function () {
          c[a].A.hasOwnProperty(arguments.length) ||
            T(
              "Function '" +
                b +
                "' called with an invalid number of arguments (" +
                arguments.length +
                ') - expects one of (' +
                c[a].A +
                ')!',
            );
          return c[a].A[arguments.length].apply(this, arguments);
        };
        c[a].A = [];
        c[a].A[d.F] = d;
      }
    }
    function Ua(a, b, c) {
      e.hasOwnProperty(a)
        ? ((void 0 === c || (void 0 !== e[a].A && void 0 !== e[a].A[c])) &&
            T("Cannot register public name '" + a + "' twice"),
          Ta(a, a),
          e.hasOwnProperty(c) &&
            T(
              'Cannot register multiple overloads of a function with the same number of arguments (' +
                c +
                ')!',
            ),
          (e[a].A[c] = b))
        : ((e[a] = b), void 0 !== c && (e[a].J = c));
    }
    function Va(a, b) {
      for (var c = [], d = 0; d < a; d++) c.push(F[(b >> 2) + d]);
      return c;
    }
    function Wa(a, b) {
      0 <= a.indexOf('j') ||
        z('Assertion failed: getDynCaller should only be called with i64 sigs');
      var c = [];
      return function () {
        c.length = arguments.length;
        for (var d = 0; d < arguments.length; d++) c[d] = arguments[d];
        var f;
        -1 != a.indexOf('j')
          ? (f =
              c && c.length
                ? e['dynCall_' + a].apply(null, [b].concat(c))
                : e['dynCall_' + a].call(null, b))
          : (f = J.get(b).apply(null, c));
        return f;
      };
    }
    function Xa(a, b) {
      a = P(a);
      var c = -1 != a.indexOf('j') ? Wa(a, b) : J.get(b);
      'function' !== typeof c &&
        T('unknown function pointer with signature ' + a + ': ' + b);
      return c;
    }
    var Ya = void 0;
    function Za(a) {
      a = $a(a);
      var b = P(a);
      X(a);
      return b;
    }
    function ab(a, b) {
      function c(g) {
        f[g] || R[g] || (S[g] ? S[g].forEach(c) : (d.push(g), (f[g] = !0)));
      }
      var d = [],
        f = {};
      b.forEach(c);
      throw new Ya(a + ': ' + d.map(Za).join([', ']));
    }
    function bb(a, b, c) {
      switch (b) {
        case 0:
          return c
            ? function (d) {
                return na[d];
              }
            : function (d) {
                return C[d];
              };
        case 1:
          return c
            ? function (d) {
                return E[d >> 1];
              }
            : function (d) {
                return D[d >> 1];
              };
        case 2:
          return c
            ? function (d) {
                return F[d >> 2];
              }
            : function (d) {
                return H[d >> 2];
              };
        default:
          throw new TypeError('Unknown integer type: ' + a);
      }
    }
    var cb = {};
    function db() {
      return 'object' === typeof globalThis
        ? globalThis
        : Function('return this')();
    }
    function eb(a, b) {
      var c = R[a];
      void 0 === c && T(b + ' has unknown type ' + Za(a));
      return c;
    }
    for (var fb = {}, gb = Array(256), Y = 0; 256 > Y; ++Y)
      gb[Y] = String.fromCharCode(Y);
    Da = gb;
    Ha = e.BindingError = Ga('BindingError');
    Ia = e.InternalError = Ga('InternalError');
    e.count_emval_handles = function () {
      for (var a = 0, b = 5; b < V.length; ++b) void 0 !== V[b] && ++a;
      return a;
    };
    e.get_first_emval = function () {
      for (var a = 5; a < V.length; ++a) if (void 0 !== V[a]) return V[a];
      return null;
    };
    Ya = e.UnboundTypeError = Ga('UnboundTypeError');
    ta.push({
      G: function () {
        hb();
      },
    });
    var jb = {
      g: function () {},
      o: function (a, b, c, d, f) {
        var g = Ca(c);
        b = P(b);
        U(a, {
          name: b,
          fromWireType: function (k) {
            return !!k;
          },
          toWireType: function (k, h) {
            return h ? d : f;
          },
          argPackAdvance: 8,
          readValueFromPointer: function (k) {
            if (1 === c) var h = na;
            else if (2 === c) h = E;
            else if (4 === c) h = F;
            else throw new TypeError('Unknown boolean type size: ' + b);
            return this.fromWireType(h[k >> g]);
          },
          B: null,
        });
      },
      r: function (a, b) {
        b = P(b);
        U(a, {
          name: b,
          fromWireType: function (c) {
            var d = V[c].value;
            Na(c);
            return d;
          },
          toWireType: function (c, d) {
            return W(d);
          },
          argPackAdvance: 8,
          readValueFromPointer: Oa,
          B: null,
        });
      },
      n: function (a, b, c) {
        c = Ca(c);
        b = P(b);
        U(a, {
          name: b,
          fromWireType: function (d) {
            return d;
          },
          toWireType: function (d, f) {
            if ('number' !== typeof f && 'boolean' !== typeof f)
              throw new TypeError(
                'Cannot convert "' + Pa(f) + '" to ' + this.name,
              );
            return f;
          },
          argPackAdvance: 8,
          readValueFromPointer: Qa(b, c),
          B: null,
        });
      },
      j: function (a, b, c, d, f, g) {
        var k = Va(b, c);
        a = P(a);
        f = Xa(d, f);
        Ua(
          a,
          function () {
            ab('Cannot call ' + a + ' due to unbound types', k);
          },
          b - 1,
        );
        Ja(k, function (h) {
          var p = a,
            m = a;
          h = [h[0], null].concat(h.slice(1));
          var n = f,
            q = h.length;
          2 > q &&
            T(
              "argTypes array size mismatch! Must at least get return value and 'this' types!",
            );
          for (var w = null !== h[1] && !1, B = !1, l = 1; l < h.length; ++l)
            if (null !== h[l] && void 0 === h[l].B) {
              B = !0;
              break;
            }
          var Ka = 'void' !== h[0].name,
            I = '',
            L = '';
          for (l = 0; l < q - 2; ++l)
            (I += (0 !== l ? ', ' : '') + 'arg' + l),
              (L += (0 !== l ? ', ' : '') + 'arg' + l + 'Wired');
          m =
            'return function ' +
            Ea(m) +
            '(' +
            I +
            ') {\nif (arguments.length !== ' +
            (q - 2) +
            ") {\nthrowBindingError('function " +
            m +
            " called with ' + arguments.length + ' arguments, expected " +
            (q - 2) +
            " args!');\n}\n";
          B && (m += 'var destructors = [];\n');
          var La = B ? 'destructors' : 'null';
          I = 'throwBindingError invoker fn runDestructors retType classParam'.split(
            ' ',
          );
          n = [T, n, g, Sa, h[0], h[1]];
          w &&
            (m += 'var thisWired = classParam.toWireType(' + La + ', this);\n');
          for (l = 0; l < q - 2; ++l)
            (m +=
              'var arg' +
              l +
              'Wired = argType' +
              l +
              '.toWireType(' +
              La +
              ', arg' +
              l +
              '); // ' +
              h[l + 2].name +
              '\n'),
              I.push('argType' + l),
              n.push(h[l + 2]);
          w && (L = 'thisWired' + (0 < L.length ? ', ' : '') + L);
          m +=
            (Ka ? 'var rv = ' : '') +
            'invoker(fn' +
            (0 < L.length ? ', ' : '') +
            L +
            ');\n';
          if (B) m += 'runDestructors(destructors);\n';
          else
            for (l = w ? 1 : 2; l < h.length; ++l)
              (q = 1 === l ? 'thisWired' : 'arg' + (l - 2) + 'Wired'),
                null !== h[l].B &&
                  ((m += q + '_dtor(' + q + '); // ' + h[l].name + '\n'),
                  I.push(q + '_dtor'),
                  n.push(h[l].B));
          Ka && (m += 'var ret = retType.fromWireType(rv);\nreturn ret;\n');
          I.push(m + '}\n');
          h = Ra(I).apply(null, n);
          l = b - 1;
          if (!e.hasOwnProperty(p))
            throw new Ia('Replacing nonexistant public symbol');
          void 0 !== e[p].A && void 0 !== l
            ? (e[p].A[l] = h)
            : ((e[p] = h), (e[p].F = l));
          return [];
        });
      },
      c: function (a, b, c, d, f) {
        function g(m) {
          return m;
        }
        b = P(b);
        -1 === f && (f = 4294967295);
        var k = Ca(c);
        if (0 === d) {
          var h = 32 - 8 * c;
          g = function (m) {
            return (m << h) >>> h;
          };
        }
        var p = -1 != b.indexOf('unsigned');
        U(a, {
          name: b,
          fromWireType: g,
          toWireType: function (m, n) {
            if ('number' !== typeof n && 'boolean' !== typeof n)
              throw new TypeError(
                'Cannot convert "' + Pa(n) + '" to ' + this.name,
              );
            if (n < d || n > f)
              throw new TypeError(
                'Passing a number "' +
                  Pa(n) +
                  '" from JS side to C/C++ side to an argument of type "' +
                  b +
                  '", which is outside the valid range [' +
                  d +
                  ', ' +
                  f +
                  ']!',
              );
            return p ? n >>> 0 : n | 0;
          },
          argPackAdvance: 8,
          readValueFromPointer: bb(b, k, 0 !== d),
          B: null,
        });
      },
      b: function (a, b, c) {
        function d(g) {
          g >>= 2;
          var k = H;
          return new f(G, k[g + 1], k[g]);
        }
        var f = [
          Int8Array,
          Uint8Array,
          Int16Array,
          Uint16Array,
          Int32Array,
          Uint32Array,
          Float32Array,
          Float64Array,
        ][b];
        c = P(c);
        U(
          a,
          {
            name: c,
            fromWireType: d,
            argPackAdvance: 8,
            readValueFromPointer: d,
          },
          { H: !0 },
        );
      },
      i: function (a, b) {
        b = P(b);
        var c = 'std::string' === b;
        U(a, {
          name: b,
          fromWireType: function (d) {
            var f = H[d >> 2];
            if (c)
              for (var g = d + 4, k = 0; k <= f; ++k) {
                var h = d + 4 + k;
                if (k == f || 0 == C[h]) {
                  if (g) {
                    for (var p = g + (h - g), m = g; !(m >= p) && C[m]; ) ++m;
                    g = da.decode(C.subarray(g, m));
                  } else g = '';
                  if (void 0 === n) var n = g;
                  else (n += String.fromCharCode(0)), (n += g);
                  g = h + 1;
                }
              }
            else {
              n = Array(f);
              for (k = 0; k < f; ++k) n[k] = String.fromCharCode(C[d + 4 + k]);
              n = n.join('');
            }
            X(d);
            return n;
          },
          toWireType: function (d, f) {
            f instanceof ArrayBuffer && (f = new Uint8Array(f));
            var g = 'string' === typeof f;
            g ||
              f instanceof Uint8Array ||
              f instanceof Uint8ClampedArray ||
              f instanceof Int8Array ||
              T('Cannot pass non-string to std::string');
            var k = (c && g
                ? function () {
                    for (var m = 0, n = 0; n < f.length; ++n) {
                      var q = f.charCodeAt(n);
                      55296 <= q &&
                        57343 >= q &&
                        (q =
                          (65536 + ((q & 1023) << 10)) |
                          (f.charCodeAt(++n) & 1023));
                      127 >= q
                        ? ++m
                        : (m = 2047 >= q ? m + 2 : 65535 >= q ? m + 3 : m + 4);
                    }
                    return m;
                  }
                : function () {
                    return f.length;
                  })(),
              h = ib(4 + k + 1);
            H[h >> 2] = k;
            if (c && g) ea(f, h + 4, k + 1);
            else if (g)
              for (g = 0; g < k; ++g) {
                var p = f.charCodeAt(g);
                255 < p &&
                  (X(h),
                  T('String has UTF-16 code units that do not fit in 8 bits'));
                C[h + 4 + g] = p;
              }
            else for (g = 0; g < k; ++g) C[h + 4 + g] = f[g];
            null !== d && d.push(X, h);
            return h;
          },
          argPackAdvance: 8,
          readValueFromPointer: Oa,
          B: function (d) {
            X(d);
          },
        });
      },
      h: function (a, b, c) {
        c = P(c);
        if (2 === b) {
          var d = ha;
          var f = ia;
          var g = ja;
          var k = function () {
            return D;
          };
          var h = 1;
        } else
          4 === b &&
            ((d = ka),
            (f = la),
            (g = ma),
            (k = function () {
              return H;
            }),
            (h = 2));
        U(a, {
          name: c,
          fromWireType: function (p) {
            for (var m = H[p >> 2], n = k(), q, w = p + 4, B = 0; B <= m; ++B) {
              var l = p + 4 + B * b;
              if (B == m || 0 == n[l >> h])
                (w = d(w, l - w)),
                  void 0 === q
                    ? (q = w)
                    : ((q += String.fromCharCode(0)), (q += w)),
                  (w = l + b);
            }
            X(p);
            return q;
          },
          toWireType: function (p, m) {
            'string' !== typeof m &&
              T('Cannot pass non-string to C++ string type ' + c);
            var n = g(m),
              q = ib(4 + n + b);
            H[q >> 2] = n >> h;
            f(m, q + 4, n + b);
            null !== p && p.push(X, q);
            return q;
          },
          argPackAdvance: 8,
          readValueFromPointer: Oa,
          B: function (p) {
            X(p);
          },
        });
      },
      p: function (a, b) {
        b = P(b);
        U(a, {
          I: !0,
          name: b,
          argPackAdvance: 0,
          fromWireType: function () {},
          toWireType: function () {},
        });
      },
      e: Na,
      f: function (a) {
        if (0 === a) return W(db());
        var b = cb[a];
        a = void 0 === b ? P(a) : b;
        return W(db()[a]);
      },
      k: function (a) {
        4 < a && (V[a].D += 1);
      },
      l: function (a, b, c, d) {
        a || T('Cannot use deleted val. handle = ' + a);
        a = V[a].value;
        var f = fb[b];
        if (!f) {
          f = '';
          for (var g = 0; g < b; ++g) f += (0 !== g ? ', ' : '') + 'arg' + g;
          var k =
            'return function emval_allocator_' +
            b +
            '(constructor, argTypes, args) {\n';
          for (g = 0; g < b; ++g)
            k +=
              'var argType' +
              g +
              " = requireRegisteredType(Module['HEAP32'][(argTypes >>> 2) + " +
              g +
              '], "parameter ' +
              g +
              '");\nvar arg' +
              g +
              ' = argType' +
              g +
              '.readValueFromPointer(args);\nargs += argType' +
              g +
              "['argPackAdvance'];\n";
          f = new Function(
            'requireRegisteredType',
            'Module',
            '__emval_register',
            k +
              ('var obj = new constructor(' +
                f +
                ');\nreturn __emval_register(obj);\n}\n'),
          )(eb, e, W);
          fb[b] = f;
        }
        return f(a, c, d);
      },
      m: function () {
        z();
      },
      q: function (a, b, c) {
        C.copyWithin(a, b, b + c);
      },
      d: function (a) {
        a >>>= 0;
        var b = C.length;
        if (2147483648 < a) return !1;
        for (var c = 1; 4 >= c; c *= 2) {
          var d = b * (1 + 0.2 / c);
          d = Math.min(d, a + 100663296);
          d = Math.max(16777216, a, d);
          0 < d % 65536 && (d += 65536 - (d % 65536));
          a: {
            try {
              A.grow((Math.min(2147483648, d) - G.byteLength + 65535) >>> 16);
              qa(A.buffer);
              var f = 1;
              break a;
            } catch (g) {}
            f = void 0;
          }
          if (f) return !0;
        }
        return !1;
      },
      a: A,
    };
    (function () {
      function a(f) {
        e.asm = f.exports;
        J = e.asm.s;
        K--;
        e.monitorRunDependencies && e.monitorRunDependencies(K);
        0 == K &&
          (null !== xa && (clearInterval(xa), (xa = null)),
          M && ((f = M), (M = null), f()));
      }
      function b(f) {
        a(f.instance);
      }
      function c(f) {
        return Ba()
          .then(function (g) {
            return WebAssembly.instantiate(g, d);
          })
          .then(f, function (g) {
            x('failed to asynchronously prepare wasm: ' + g);
            z(g);
          });
      }
      var d = { a: jb };
      K++;
      e.monitorRunDependencies && e.monitorRunDependencies(K);
      if (e.instantiateWasm)
        try {
          return e.instantiateWasm(d, a);
        } catch (f) {
          return (
            x('Module.instantiateWasm callback failed with error: ' + f), !1
          );
        }
      (function () {
        return y ||
          'function' !== typeof WebAssembly.instantiateStreaming ||
          ya() ||
          'function' !== typeof fetch
          ? c(b)
          : fetch(N, { credentials: 'same-origin' }).then(function (f) {
              return WebAssembly.instantiateStreaming(f, d).then(b, function (
                g,
              ) {
                x('wasm streaming compile failed: ' + g);
                x('falling back to ArrayBuffer instantiation');
                return c(b);
              });
            });
      })().catch(r);
      return {};
    })();
    var hb = (e.___wasm_call_ctors = function () {
        return (hb = e.___wasm_call_ctors = e.asm.t).apply(null, arguments);
      }),
      ib = (e._malloc = function () {
        return (ib = e._malloc = e.asm.u).apply(null, arguments);
      }),
      X = (e._free = function () {
        return (X = e._free = e.asm.v).apply(null, arguments);
      }),
      $a = (e.___getTypeName = function () {
        return ($a = e.___getTypeName = e.asm.w).apply(null, arguments);
      });
    e.___embind_register_native_and_builtin_types = function () {
      return (e.___embind_register_native_and_builtin_types = e.asm.x).apply(
        null,
        arguments,
      );
    };
    var Z;
    M = function kb() {
      Z || lb();
      Z || (M = kb);
    };
    function lb() {
      function a() {
        if (!Z && ((Z = !0), (e.calledRun = !0), !ca)) {
          O(ta);
          O(ua);
          aa(e);
          if (e.onRuntimeInitialized) e.onRuntimeInitialized();
          if (e.postRun)
            for (
              'function' == typeof e.postRun && (e.postRun = [e.postRun]);
              e.postRun.length;

            ) {
              var b = e.postRun.shift();
              va.unshift(b);
            }
          O(va);
        }
      }
      if (!(0 < K)) {
        if (e.preRun)
          for (
            'function' == typeof e.preRun && (e.preRun = [e.preRun]);
            e.preRun.length;

          )
            wa();
        O(sa);
        0 < K ||
          (e.setStatus
            ? (e.setStatus('Running...'),
              setTimeout(function () {
                setTimeout(function () {
                  e.setStatus('');
                }, 1);
                a();
              }, 1))
            : a());
      }
    }
    e.run = lb;
    if (e.preInit)
      for (
        'function' == typeof e.preInit && (e.preInit = [e.preInit]);
        0 < e.preInit.length;

      )
        e.preInit.pop()();
    noExitRuntime = !0;
    lb();

    return Module.ready;
  };
})();
export default Module;
