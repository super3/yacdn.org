# yacdn.org

#### How to Use:
```
https://yacdn.org/serve/<uri>
```

#### Example
```
https://yacdn.org/serve/http://meowbaari.com/wp-content/uploads/2016/06/1464933654_cat_sleep.png
```
![https://yacdn.org/serve/http://meowbaari.com/wp-content/uploads/2016/06/1464933654_cat_sleep.png](https://yacdn.org/serve/http://meowbaari.com/wp-content/uploads/2016/06/1464933654_cat_sleep.png)

#### Embeddable Script
Paste this into your browser console to replace all images.
```javascript
<script>
document.addEventListener('ready', function() {
    var imgs = document.getElementsByTagName("img");
    for (var i = 0, l = imgs.length; i < l; i++) {
        imgs[i].src = `https://yacdn.org/serve/${imgs[i].src}`;
    }
});
</script>
```
