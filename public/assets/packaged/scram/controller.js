(() => {
  'use strict';
  var e = {
      1762: function (e, r, t) {
        t.d(r, {
          Z: function () {
            return o;
          },
        });
        let o = {
          fmt: function (e, r, ...t) {
            let o = Error.prepareStackTrace;
            Error.prepareStackTrace = (e, r) => {
              r.shift(), r.shift(), r.shift();
              let t = '';
              for (let e = 1; e < Math.min(2, r.length); e++)
                r[e].getFunctionName() &&
                  (t += `${r[e].getFunctionName()} -> ` + t);
              return (t += r[0].getFunctionName() || 'Anonymous');
            };
            let n = (function () {
              try {
                throw Error();
              } catch (e) {
                return e.stack;
              }
            })();
            Error.prepareStackTrace = o;
            let c = console[e] || console.log;
            c(
              `%c${n}%c ${r}`,
              `
		background-color: ${{ log: '#000', warn: '#f80', error: '#f00', debug: 'transparent' }[e]};
		color: ${{ log: '#fff', warn: '#fff', error: '#fff', debug: 'gray' }[e]};
		padding: ${{ log: 2, warn: 4, error: 4, debug: 0 }[e]}px;
		font-weight: bold;
		font-family: monospace;
		font-size: 0.9em;
	`,
              `${'debug' === e ? 'color: gray' : ''}`,
              ...t
            );
          },
          log: function (e, ...r) {
            this.fmt('log', e, ...r);
          },
          warn: function (e, ...r) {
            this.fmt('warn', e, ...r);
          },
          error: function (e, ...r) {
            this.fmt('error', e, ...r);
          },
          debug: function (e, ...r) {
            this.fmt('debug', e, ...r);
          },
        };
      },
    },
    r = {};
  function t(o) {
    var n = r[o];
    if (void 0 !== n) return n.exports;
    var c = (r[o] = { exports: {} });
    return e[o](c, c.exports, t), c.exports;
  }
  (t.d = function (e, r) {
    for (var o in r)
      t.o(r, o) &&
        !t.o(e, o) &&
        Object.defineProperty(e, o, { enumerable: !0, get: r[o] });
  }),
    (t.o = function (e, r) {
      return Object.prototype.hasOwnProperty.call(e, r);
    });
  let o = Symbol.for('scramjet client global'),
    n = Symbol.for('scramjet frame handle');
  var c = t(1762).Z;
  class s extends EventTarget {
    controller;
    frame;
    constructor(e, r) {
      super(), (this.controller = e), (this.frame = r), (r[n] = this);
    }
    get client() {
      return this.frame.contentWindow.window[o];
    }
    get url() {
      return this.client.url;
    }
    go(e) {
      e instanceof URL && (e = e.toString()),
        c.log('navigated to', e),
        (this.frame.src = this.controller.encodeUrl(e));
    }
    back() {
      this.frame.contentWindow?.history.back();
    }
    forward() {
      this.frame.contentWindow?.history.forward();
    }
    reload() {
      this.frame.contentWindow?.location.reload();
    }
  }
  !('$scramjet' in self) &&
    (self.$scramjet = {
      version: { build: '4497455', version: '1.0.2-dev' },
      codec: {},
      flagEnabled: function (e, r) {
        let t = i.config.flags[e];
        for (let t in i.config.siteFlags) {
          let o = i.config.siteFlags[t];
          if (new RegExp(t).test(r.href) && e in o) return o[e];
        }
        return t;
      },
    });
  let i = self.$scramjet,
    a = Function;
  function f() {
    (i.codec.encode = a('url', i.config.codec.encode)),
      (i.codec.decode = a('url', i.config.codec.decode));
  }
  var l = t(1762).Z;
  window.ScramjetController = class e {
    db;
    constructor(e) {
      let r = {
          prefix: '/scramjet/',
          globals: {
            wrapfn: '$scramjet$wrap',
            wrapthisfn: '$scramjet$wrapthis',
            trysetfn: '$scramjet$tryset',
            importfn: '$scramjet$import',
            rewritefn: '$scramjet$rewrite',
            metafn: '$scramjet$meta',
            setrealmfn: '$scramjet$setrealm',
            pushsourcemapfn: '$scramjet$pushsourcemap',
          },
          files: {
            wasm: '/scramjet.wasm.js',
            shared: '/scramjet.shared.js',
            worker: '/scramjet.worker.js',
            client: '/scramjet.client.js',
            sync: '/scramjet.sync.js',
          },
          flags: {
            serviceworkers: !1,
            syncxhr: !1,
            naiiveRewriter: !1,
            strictRewrites: !0,
            rewriterLogs: !0,
            captureErrors: !0,
            cleanErrors: !1,
            scramitize: !1,
            sourcemaps: !1,
          },
          siteFlags: {},
          codec: {
            encode: `if (!url) return url;
					return encodeURIComponent(url);`,
            decode: `if (!url) return url;
					return decodeURIComponent(url);`,
          },
        },
        t = (e, r) => {
          for (let o in r)
            r[o] instanceof Object &&
              o in e &&
              Object.assign(r[o], t(e[o], r[o]));
          return Object.assign(e || {}, r);
        };
      i.config = t(r, e);
    }
    async init(e) {
      f(), await this.openIDB();
      let r = await navigator.serviceWorker.register(e);
      return l.log('service worker registered'), r;
    }
    createFrame(e) {
      return !e && (e = document.createElement('iframe')), new s(this, e);
    }
    encodeUrl(e) {
      return (
        e instanceof URL && (e = e.toString()),
        i.config.prefix + i.codec.encode(e)
      );
    }
    decodeUrl(e) {
      return e instanceof URL && (e = e.toString()), i.codec.decode(e);
    }
    async openIDB() {
      let e = indexedDB.open('$scramjet', 1);
      return new Promise((r, t) => {
        (e.onsuccess = async () => {
          (this.db = e.result), await this.#e(), r(e.result);
        }),
          (e.onupgradeneeded = () => {
            let r = e.result;
            !r.objectStoreNames.contains('config') &&
              r.createObjectStore('config'),
              !r.objectStoreNames.contains('cookies') &&
                r.createObjectStore('cookies');
          }),
          (e.onerror = () => t(e.error));
      });
    }
    async #e() {
      if (!this.db) {
        console.error('Store not ready!');
        return;
      }
      let e = this.db
        .transaction('config', 'readwrite')
        .objectStore('config')
        .put(i.config, 'config');
      return new Promise((r, t) => {
        (e.onsuccess = r), (e.onerror = t);
      });
    }
    async modifyConfig(e) {
      (i.config = Object.assign({}, i.config, e)), f(), await this.#e();
    }
  };
})();
//# sourceMappingURL=scramjet.controller.js.map