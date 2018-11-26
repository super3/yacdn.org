# yacdn.org

#### How to Use:
```
https://yacdn.org/serve/<encoded_uri>
```

#### Encode URL Tools
- https://meyerweb.com/eric/tools/dencoder/
- https://www.url-encode-decode.com/
- https://www.urlencoder.org/

#### Example
```
https://yacdn.org/serve/http%3A%2F%2Fmeowbaari.com%2Fwp-content%2Fuploads%2F2016%2F06%2F1464933654_cat_sleep.png
```
![https://yacdn.org/serve/http%3A%2F%2Fmeowbaari.com%2Fwp-content%2Fuploads%2F2016%2F06%2F1464933654_cat_sleep.png](https://yacdn.org/serve/http%3A%2F%2Fmeowbaari.com%2Fwp-content%2Fuploads%2F2016%2F06%2F1464933654_cat_sleep.png)

#### Embeddable Script
Paste this into your browser console to replace all images.
```javascript
<script>
document.addEventListener('ready', function() {
    var imgs = document.getElementsByTagName("img");
    for (var i = 0, l = imgs.length; i < l; i++) {
        const encode = encodeURIComponent(imgs[i].src);
        imgs[i].src = `https://yacdn.org/serve/${encode}`;
    }
});
</script>
```
