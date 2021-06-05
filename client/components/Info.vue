<template>
  <div class="information">
    <div class="info-content">
      <h2>Easy to use and implement</h2>
      <p>
        SheetDB will turn your sheets into a JSON API, easy to integrate with
        other tools and all programming languages. We have prepared many
        libraries working with common tools, other APIs and programming
        languages.
      </p>
      <p>
        If you want to use a different API, e.g. in your CRM, you can use our
        API to turn the spreadsheet into JSON API.
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Information',
}
</script>

<style scoped>
.information {
  display: flex;
  color: #2e2e2e;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  background-color: #fafafa;
  background-image: url('../assets/images/dots.png');
  background-size: contain;
}
.information .info-content {
  padding: 60px 0;
  width: 60%;
}
.information h2 {
  font-size: 28px;
}
.information p {
  margin: 10px 0;
}

@media (max-width: 460px) {
  .information .info-content {
    padding: 60px 0;
    width: 80%;
  }
}
</style>