### Preact Website Update

**Size before:** _(via [size-plugin](https://github.com/googlechromelabs/size-plugin))

WPT: https://www.webpagetest.org/result/181210_P8_82a008b7a17bc1c55c61197672205e93/
LH: https://www.webpagetest.org/lighthouse.php?test=181210_P8_82a008b7a17bc1c55c61197672205e93&run=3

```
     a3d80eb575b803a6508e.worker.js ⏤  216 kB
                          bundle.js ⏤  33.6 kB
    1.80d97f20c0fd15d2e7c6.chunk.js ⏤  3.21 kB
    2.f0ec73293bbbd9656786.chunk.js ⏤  8.77 kB
 repl.96b61a2ae529b974054a.chunk.js ⏤  70.1 kB
                          style.css ⏤  6.66 kB
                         index.html ⏤  2.23 kB
                              sw.js ⏤  10 kB (+2 B)
             appcache/manifest.html ⏤  66 B
```

**Size After:**

```
     247ee39acd39bae81efc.worker.js ⏤  217 kB
                          bundle.js ⏤  33.8 kB
    1.********************.chunk.js ⏤  3.21 kB
    2.********************.chunk.js ⏤  8.77 kB
 repl.********************.chunk.js ⏤  71.9 kB (+1.71 kB)
                          style.css ⏤  6.66 kB
                         index.html ⏤  2.23 kB
                              sw.js ⏤  10 kB (-8 B)
             appcache/manifest.html ⏤  66 B
```

### RCA

- bundle.js increased by 1.5kB because of marked: (+2kB to 7.2kB: https://bundlephobia.com/result?p=marked@0.5.2)
- highlight.js increased in size dramatically over the past few releases, though we're subsetting
- polyfills increased in size. switch from fetch to unfetch helped, code-splitting removed the issue entirely
- classnames increased in size a bit. it also isn't getting bundled optimally due to a nonstandard UMD wrapper
- FCP was always a bit bad since only the app shell is prerendered

**After webpack + dep updates:**

```
 ae1ee828a2ca1fab34e4.worker.js ⏤  214 kB
               editor.44a85.css ⏤  2.14 kB
          editor.452bc.chunk.js ⏤  69 kB
           emoji.d52cc.chunk.js ⏤  8.75 kB
                 main.3b5f6.css ⏤  6.6 kB
                        main.js ⏤  29.9 kB
         offline.e400f.chunk.js ⏤  801 B
                   polyfills.js ⏤  2.01 kB
                 repl.45b46.css ⏤  899 B
            repl.34587.chunk.js ⏤  2.28 kB
                     index.html ⏤  2.22 kB
                          sw.js ⏤  10.4 kB (+2 B)
         appcache/manifest.html ⏤  86 B
```

| Metric      | Start  | Final  |
|-------------|--------|--------|
| FCP         | 1300ms | 1300ms |
| TTI         | 5900ms | 2950ms |
| Speed Index | 2380ms | 1910ms |
