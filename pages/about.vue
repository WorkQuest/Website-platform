<template>
  <div class="about">
    <Header
      :title="'About Service'"
      :sub-title="'Information'"
    />
    <div class="about__container">
      <div class="about__body">
        <div class="about__content">
          <div class="about__row">
            <div class="about__description description">
              <div class="description__title">
                {{ $t('about.content.title') }}
              </div>
              <div class="description__text">
                <span>{{ $t('about.content.text') }}</span>
              </div>
            </div>
            <div class="about__image">
              <img
                src="~assets/img/app/about.png"
                alt=""
              >
            </div>
          </div>
        </div>
      </div>
      <div class="about__footer">
        <div class="about__content">
          <div class="description__text description__text_normal">
            <div class="description__info">
              {{ $t('about.contact') }}:
            </div>
            <div class="description__text description__text_link">
              <a
                target="_blank"
                href="mailto:feedback@workquest.co"
              >feedback@workquest.co</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>

export default {
  name: 'About',
};
</script>

<style lang="scss" scoped>
.about {
  display: grid;
  grid-gap: 50px;
  &__container {
    display: grid;
    grid-template-rows: 1fr 140px;
    min-height: calc(100vh - 174px);
    height: 100%;
  }
  &__content {
    max-width: 1000px;
    margin: 0 auto;
    width: 100%;
  }
  &__body {
    display: flex;
    background: #20253b;
  }
  &__row {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  &__image {
    position: absolute;
    right: 0;
    top: -23px;
  }
  &__footer {
    background-color: #27a860;
    max-height: 140px;
    display: flex;
    align-items: center;
  }
}
.description {
  padding-top: 40px;
  display: flex;
  flex-direction: column;
  grid-gap: 20px;
  max-width: 482px;
  &__title {
    color: #ffffff;
    font-family: 'GothamProBlack', sans-serif;
    font-size: 31px;
    font-weight: 400;
    font-style: normal;
    letter-spacing: normal;
    text-align: left;
    text-transform: uppercase;
    line-height: normal;
  }
  &__text {
    color: #ffffff;
    font-family: 'GothamProMedium', sans-serif;
    font-size: 15px;
    font-weight: 500;
    font-style: normal;
    letter-spacing: normal;
    line-height: 20.17px;
    text-align: left;
    white-space: pre-line;
    &_normal {
      white-space: normal;
      display: flex;
      flex-direction: column;
      grid-gap: 20px;
    }
    a {
      color: #ffffff !important;
      text-decoration: none;
    }
  }
}

@include _1300 {
  .about {
    &__body {
      padding-bottom: 20px;
    }
  }
}

@include _575 {
  .about {
    &__footer {
      display: none;
    }
    display: flex;
    flex-direction: column;
    margin-top: -100px;
    padding-bottom: 20px;
    &__row {
      flex-direction: column-reverse;
    }
    &__container {
      //height: initial;
      display: grid;
      grid-template-rows: 1fr;
      min-height: calc(100vh);
      height: 100%;
    }
    &__image {
      position: initial;
      top: 0;
      max-height: 270px;
      overflow: hidden;
      img {
        width: 400px;
      }
    }
    &__content {
      height: 100%;
    }
    &__container {
      grid-template-columns: 1fr;
    }
  }
  .description {
    align-items: center;
    max-width: 330px;
    padding-bottom: 40px;
    display: grid;
    grid-template-rows: auto 1fr;
    &__title {
      text-align: center;
      font-size: 24px;
    }
    &__text {
      font-size: 12px;
      line-height: normal;
      &_normal {
        flex-direction: initial;
        justify-content: center;
        padding-top: 20px;
      }
    }
  }
}
</style>
