# Vue CLI

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve --mode=development
```

### Compiles and minifies for production
```
npm run build
```

### Run your tests
```
npm run test
```

### Lints and fixes files
```
npm run lint
```

To disable TSLint, open **vue.config.js** and add 

```
module.exports = {
  lintOnSave: process.env.NODE_ENV !== 'development',
  //...
}
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).



# iView-Admin

## Side menus

### Themes

To change the theme of side menu which is using [iView's Menu](https://www.iviewui.com/components/menu-en).

Update the following settings,

- index.less

```less
// For dard theme on side menus
@menu-dark-title: #001529;
@menu-dark-active-bg: #000c17;
@layout-sider-background: #001529;

// For light theme on side menus
@menu-dark-title: #001529;
@menu-dark-active-bg: #000c17;
@layout-sider-background: #ffffff;
```

- side-menu.vue

```javascript
theme: {
  type: String as PropType<string>,
  default: 'dark', // dark/light/primary
},
```


### Nodes structure

Side menus supports hierarchy menu nodes as following.
Notice if a master node (which at level 1) has ONLY ONE child node, the child node will replace its parent on the side menu.
So the parent node will not show!

```json
[
  {
    "icon": "fas fa-receipt",
    "name": "XX",
    "meta": {
      "icon": "fas fa-receipt",
      "title": "XX"
    },
    "children": [
      {
        "icon": "md-arrow-dropdown-circle",
        "name": "XX1",
        "meta": {
          "icon": "md-arrow-dropdown-circle",
          "title": "XX1"
        }
      },
      {
        "icon": "md-trending-up",
        "name": "XX2",
        "meta": {
          "icon": "md-trending-up",
          "title": "XX2"
        }
      }
    ]
  },
  {
    "icon": "fas fa-cog",
    "name": "YY",
    "meta": {
      "icon": "fas fa-cog",
      "title": "YY"
    },
    "children": [
      {
        "icon": "md-arrow-dropdown-circle",
        "name": "YY1",
        "meta": {
          "icon": "md-arrow-dropdown-circle",
          "title": "YY1"
        }
      }
    ]
  }
]
```


## Icons

The template supports both [font-awesome 5](https://fontawesome.com/icons) and [iView Icon](https://www.iviewui.com/components/icon-en) by using `@components\_icon\common-icon`.


- font-awesome

Just put the Font-Awesome's style (class value) into **type**.

```html
<common-icon :size="16" :color="#495060" :type="fas fa-clock"/>
```

- iview: Icon

Append prefix: `_` to **type** which will be used as iView Icon's [type](https://www.iviewui.com/components/icon-en#Icon_props).

```html
<common-icon :size="16" :color="#495060" :type="_ios-checkmark"/>
```

### API

| Prop | Description | Type | Default value |
|:----:|:------------|:----:|:------:|
| size | Size (pixel) | string | `16` |
| color | Color | string | `#5c6b77` | 
| size | Use font-awesome or iView. | string |  |


## Tables

We use [vue-tables-2](https://github.com/matfish2/vue-tables-2) to display the row data.
**IMPORTANT!!** DO NOT use `Vue.extend()` for the components which will be used as **Template** in  [vue-tables-2](https://github.com/matfish2/vue-tables-2).

Or the following error will occurs,

> Error in render: "TypeError: Cannot read property 'props' of undefined



