This repo and service are no longer maintained.

# yacdn.org
Yet Another CDN.

[![Build Status](https://travis-ci.org/ovsoinc/yacdn.org.svg?branch=master)](https://travis-ci.org/ovsoinc/yacdn.org)
[![Coverage Status](https://coveralls.io/repos/github/ovsoinc/yacdn.org/badge.svg?branch=master)](https://coveralls.io/github/ovsoinc/yacdn.org?branch=master)
[![Design Doc](https://img.shields.io/badge/design-doc-blue.svg)](https://github.com/ovsoinc/yacdn.org/blob/master/docs/design-doc.md)
[![License](https://img.shields.io/badge/license-AGPLv3-blue.svg?label=license)](https://github.com/Storj/ovsoinc/yacdn.org/blob/master/LICENSE)
[![CDN Hits](https://img.shields.io/badge/dynamic/json.svg?label=CDN%20Hits&url=https://yacdn.org/global-stats&query=$.cdnHits&colorB=green)](https://img.shields.io/badge/dynamic/json.svg?label=CDN%20Hits&url=https://yacdn.org/global-stats&query=$.cdnHits&colorB=green)
[![CDN Data](https://img.shields.io/badge/dynamic/json.svg?label=CDN%20Data&url=https://yacdn.org/global-stats&query=$.cdnData&colorB=blue)](https://img.shields.io/badge/dynamic/json.svg?label=CDN%20Data&url=https://yacdn.org/global-stats&query=$.cdnData&colorB=blue)
[![Cache Usage](https://img.shields.io/badge/dynamic/json.svg?label=Cache%20Usage&url=https://yacdn.org/global-stats&query=$.cacheStorageUsage&colorB=purple)](https://img.shields.io/badge/dynamic/json.svg?label=Cache%20Usage&url=https://yacdn.org/global-stats&query=$.cacheStorageUsage&colorB=purple)

## CDN

#### How to Use

By default the file will be kept in the cache for 24 hours.

```
https://yacdn.org/serve/<uri>
```

Need to refresh the object more frequently than 24 hours? You can set `maxAge` manually:

```
https://yacdn.org/serve/<uri>?maxAge=[seconds]
```

#### Example
```
https://yacdn.org/serve/https://apprecs.org/ios/images/app-icons/256/4e/432805198.jpg
```
![https://yacdn.org/serve/https://apprecs.org/ios/images/app-icons/256/4e/432805198.jpg](https://yacdn.org/serve/hhttps://apprecs.org/ios/images/app-icons/256/4e/432805198.jpg)

## Proxy / CORS Proxy

Can also be used as an effective proxy / CORS proxy by using the proxy endpoint.

#### How to Use

```
https://yacdn.org/proxy/<uri>
```

#### Example
```
https://yacdn.org/proxy/https://apprecs.org/ios/images/app-icons/256/4e/432805198.jpg
```
![https://apprecs.org/ios/images/app-icons/256/4e/432805198.jpg](https://apprecs.org/ios/images/app-icons/256/4e/432805198.jpg)

## Technical

### Setup

Work in progress. Run as root.

```cmd
> curl -o - https://raw.githubusercontent.com/ovsoinc/yacdn.org/master/install.sh | bash
```

```cmd
> certbot --nginx
```

### Running

```cmd
> touch blacklist.txt
```

```cmd
> node server
yacdn:server Server listening on port 3000... +0ms
yacdn:server serve#205 url: http://meowbaari.com/wp-content/uploads/2016/06/1464933654_cat_sleep.png +5s
yacdn:server serve#205 referer: undefined +1ms
yacdn:cache http://meowbaari.com/wp-content/uploads/2016/06/1464933654_cat_sleep.png not in cache +0ms
yacdn:cache lock true +0ms
yacdn:server serve#205 size: 0.02 MB +398ms
yacdn:server serve#205 done, took 404ms +5ms
yacdn:server serve#205 effective speed: 0.04 megabits/s +0ms
yacdn:server serve#206 url: http://meowbaari.com/wp-content/uploads/2016/06/1464933654_cat_sleep.png +5s
yacdn:server serve#206 referer: undefined +0ms
yacdn:cache http://meowbaari.com/wp-content/uploads/2016/06/1464933654_cat_sleep.png already in cache +5s
yacdn:server serve#206 size: 0.02 MB +2ms
yacdn:server serve#206 done, took 2ms +0ms
yacdn:server serve#206 effective speed: 8.64 megabits/s +0ms
```

### Benchmarking

```cmd
> node benchmark.js https://speed.hetzner.de/100MB.bin
https://speed.hetzner.de/100MB.bin - took 32958 ms
https://speed.hetzner.de/100MB.bin - took 56222 ms
https://speed.hetzner.de/100MB.bin - took 40457 ms
Took 43212ms on average (min: 32958ms, max: 56222ms)

https://yacdn.org/proxy/https://speed.hetzner.de/100MB.bin - took 21116 ms
https://yacdn.org/proxy/https://speed.hetzner.de/100MB.bin - took 19269 ms
https://yacdn.org/proxy/https://speed.hetzner.de/100MB.bin - took 20951 ms
Took 20445ms on average (min: 19269ms, max: 21116ms)

https://yacdn.org/serve/https://speed.hetzner.de/100MB.bin - took 25699 ms
https://yacdn.org/serve/https://speed.hetzner.de/100MB.bin - took 23810 ms
https://yacdn.org/serve/https://speed.hetzner.de/100MB.bin - took 19544 ms
Took 23018ms on average (min: 19544ms, max: 25699ms)

yacdn proxy is 52.69% faster
yacdn serve is 46.73% faster
```
