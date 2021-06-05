<template>
  <footer>
    <div class="footer-top">
      <div class="quote-wrapper">
        <blockquote class="text" cite="https://aakritsubedi9.com.np">
          <p>
            There is no point in worrying.... use<strong> Sheets2API</strong> in your next project and get the work done with ease.
            
          </p>
        </blockquote>
      </div>
    </div>
    <div class="footer-info">
      <span class="footer-copyright">Copyright &copy; {{ currentYear }}.</span>
      <span class="footer-copyright">All Right Reserved.</span>
      <span class="footer-title">Sheet2API | Aakrit Subedi </span>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'Footer',
  data() {
    return {
      currentYear: null,
    }
  },
  created() {
    const d = new Date()
    this.currentYear = d.getFullYear()
  },
}
</script>

<style scoped>
footer {
  padding-top: 50px;
}
.footer-top {
  height: 275px;
  width: 100%;
  background-image: url(../assets/images/footer.gif);
  background-repeat: no-repeat;
  background-position: right;
  display: flex;
  background-size: contain;
  align-items: flex-start;
  padding: 0px 25px;
}
.footer-info {
  margin-top: -10px;
  padding: 25px;
  display: flex;
  color: #ffffff;
  align-items: flex-end;
  flex-direction: column;
  background-color: #2e2e2e;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
}
.footer-copyright {
  font-size: 14px;
  display: block;
}
.footer-title {
  margin: 5px 0;
  font-weight: bold;
}
/* Blockquote */
.quote-wrapper {
  width: 150px;
  height: 150px;
  position: relative;
}

.text {
  width: 100%;
  height: 100%;
  background: radial-gradient(
    ellipse at center,
    rgb(46, 46, 46) 0%,
    rgb(46, 46, 46) 70%,
    rgba(0, 128, 172, 0) 70.3%
  );
  position: relative;
  margin: 0;
  color: white;
}

.text p {
  height: 100%;
  font-size: 18px;
  line-height: 1.25;
  padding: 0;
  text-align: center;
  font-style: italic;
  text-shadow: 0.5px 0.5px 1px rgba(0, 0, 0, 0.3);
}

.text::before {
  content: '';
  width: 50%;
  height: 100%;
  float: left;
  shape-outside: polygon(
    0 0,
    98% 0,
    50% 6%,
    23.4% 17.3%,
    6% 32.6%,
    0 50%,
    6% 65.6%,
    23.4% 82.7%,
    50% 94%,
    98% 100%,
    0 100%
  );
  shape-margin: 7%;
}

.text p::before {
  content: '';
  width: 50%;
  height: 100%;
  float: right;
  shape-outside: polygon(
    2% 0%,
    100% 0%,
    100% 100%,
    2% 100%,
    50% 94%,
    76.6% 82.7%,
    94% 65.6%,
    100% 50%,
    94% 32.6%,
    76.6% 17.3%,
    50% 6%
  );
  shape-margin: 7%;
}

.quote-wrapper::before {
  content: '\201C';
  font-size: 270px;
  height: 82px;
  line-height: 0.78;
  line-height: 1;
  position: absolute;
  top: -48px;
  left: 0;
  z-index: 1;
  font-family: sans-serif, serif;
  color: #ccc;
  opacity: 0.9;
}

@media (max-width: 460px) {
  .footer-top {
    height: 250px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-image: unset;
  }
  .quote-wrapper {
    width: 225px;
    height: 225px;
  }

  .quote-wrapper::before {
    font-size: 225px;
  }

  .text p {
    font-size: 16px;
  }

  .quote-wrapper blockquote footer {
    bottom: 32px;
  }
}

@media (min-width: 850px) {
  .quote-wrapper {
    width: 250px;
    height: 250px;
  }

  .quote-wrapper::before {
    font-size: 250px;
  }

  .text p {
    font-size: 18px;
  }

  .quote-wrapper blockquote footer {
    bottom: 32px;
  }
}
.note {
  margin: 5vw;
  padding: 0.5em;
  border-left: 0.5em solid #52e052;
  background: #e9fbe9;
}

.note a {
  text-decoration: none;
  color: #161b1e;
}

.note a:hover {
  text-decoration: underline;
}
</style>