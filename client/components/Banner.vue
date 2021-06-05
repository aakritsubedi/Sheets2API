<template>
  <div class="banner">
    <div class="banner-data">
      <span class="banner-title">Sheets2API</span>
      <span class="banner-subtitle">
        Turn your spreadsheets into something amazing today.
      </span>
      <p class="banner-info">
        use Sheets2API to turn their spreadsheets into powerful APIs to rapidly
        develop prototypes, websites, apps and more.
      </p>
    </div>

    <div class="github-icon">
      <a href="https://github.com/aakritsubedi/Sheets2API">
        <span class="fab fa-github"></span>
      </a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Banner',
}
</script>

<style scoped>
.banner {
  width: 100%;
  height: 400px;
  display: flex;
  position: relative;
  padding: 15px 16px;
  align-items: center;
  background-size: contain;
  background-position: right;
  justify-content: flex-start;
  background-color: #54b87b;
  background-repeat: no-repeat;
  background-image: linear-gradient(#8ad8a8, #54b87b);
  background-image: url('../assets/images/sheetdb.png');
}
.banner .banner-data {
  width: 40%;
}
.banner .banner-logo {
  height: 75px;
  width: 150px;
  margin-right: 15px;
}
.banner-logo img {
  width: 100%;
  height: 100%;
}
.banner .banner-title {
  color: #fff;
  display: block;
  font-size: 30px;
  font-weight: bold;
}
.banner .banner-subtitle {
  color: #fff;
  display: block;
  font-size: 16px;
}
.banner .banner-info {
  color: #fff;
  margin: 15px 0;
  font-size: 18px;
}
.github-icon {
  position: absolute;
  top: 5px;
  right: 5px;
  font-size: 25px;
}
.github-icon a {
  color: #fff;
}

@media only screen and (max-width: 750px) {
  .banner {
    height: 250px;
  }
  .banner .banner-data {
    width: 90%;
  }
}
</style>