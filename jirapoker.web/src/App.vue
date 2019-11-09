<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<style lang="less">
@font-face {
  font-family: 'PingFangTC';
  src: url("./assets/fonts/PingFang-TC/PingFangTC.ttf") format('truetype');
  font-weight: normal;
  font-style: normal;
}

@font-face {
  font-family: 'PingFangSC';
  src: url("./assets/fonts/PingFang-SC/PingFangSC.ttf") format('truetype');
  // src: url('./assets/fonts/PingFang-SC-Regular/PingFangSC.eot?#iefix') format('embedded-opentype'),
  //      url('./assets/fonts/PingFang-SC-Regular/PingFangSC.ttf') format('truetype'),
  //      url('./assets/fonts/PingFang-SC-Regular/PingFangSC.woff') format('woff'),
  //      url('./assets/fonts/PingFang-SC-Regular/PingFangSC.woff2') format('woff2'),
  //      url('./assets/fonts/PingFang-SC-Regular/PingFangSC.svg#PingFang') format('svg');
  font-weight: normal;
  font-style: normal;
}

* {
  font-family: "Arial","PingFangTC","PingFangSC";
}

html,body{
  .size;
  margin: 0;
  padding: 0;
  overflow: hidden;
  min-width:600px; //Set screen's minimum resize 
  color: #4A4A4A !important;
}
#app {
  .size;
}
.size{
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
