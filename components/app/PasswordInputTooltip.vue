<template>
  <div
    id="password-tooltip"
    @pointerover="handlePointerOver"
    @pointerout="handlePointerOut"
    @click="handleClick"
  >
    <div class="password-tooltip-icon">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 140 140"
        fill="black"
        role="img"
        aria-hidden="false"
        width="15px"
        heught="15px"
      >
        <title>Password requirements</title>
        <g
          fill="none"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="10"
        >
          <path d="M5 70a65 65 0 10130 0A65 65 0 105 70zm65 0v35" />
          <path d="M65 45a5 5 0 1010 0 5 5 0 10-10 0z" />
        </g>
      </svg>
      <div
        v-if="isShown"
        class="password-tooltip"
      >
        <div class="password-tooltip__container">
          <div>
            <p>
              Make sure your password is at least 8 characters and contains:
            </p>
            <ul class="password-tooltip__list">
              <li class="password-tooltip__item">
                At least 1 uppercase letter and 1 lowercase letter
              </li>
              <li class="password-tooltip__item">
                At least 1 number
              </li>
              <li class="password-tooltip__item">
                At least 1 special character (like !@#$%^&*_)
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PasswordInputTooltip',
  data: () => ({
    isShown: false,
    isClicked: false,
  }),
  created() {
    document.addEventListener('click', this.clickHideTooltip);
  },
  methods: {
    clickHideTooltip(e) {
      if (
        this.isClicked
        && e.target.parentElement.className !== 'password-tooltip-icon'
      ) {
        console.log('click Any');
        this.isClicked = false;
        this.isShown = false;
      }
    },
    handleClick() {
      if (!this.isClicked) {
        console.log('click common');
        this.isClicked = !this.isClicked;
        this.isShown = true;
      }
    },
    handlePointerOver() {
      if (this.isClicked === false) {
        this.isShown = true;
      }
    },
    handlePointerOut() {
      if (this.isClicked === false) {
        this.isShown = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.password-tooltip-icon {
  display: flex;
  align-items: center;
  position: absolute;
  top: 50%;
  right: 50px;
  transform: translate(-0%, -50%);
  cursor: pointer;
}

.password-tooltip {
  transition: opacity 150ms ease 150ms;
  width: 70vw;
  position: absolute;
  padding-top: 0.75rem;
  -webkit-box-pack: end;
  justify-content: flex-end;
  max-width: 16rem;
  bottom: 30px;
  right: -50px;
  z-index: 1;

  &__container {
    min-width: 4rem;
    border: 1px solid red;
    line-height: 1.5;
    font-size: 0.875rem;
    box-shadow: none;
    display: inline-block;
    border-radius: 6px;
    color: black;
    background-color: #fff;
    padding: 1rem;
  }
  &__list {
    list-style: none;
    padding-left: 0;
  }
  &__item {
    position: relative;
    margin-left: 2rem;
    margin-bottom: 0.5rem;
    line-height: 1.6;
    &::before {
      background: black;
      border-radius: 100%;
      content: ' ';
      display: inline-block;
      height: 0.5rem;
      left: -1.25rem;
      line-height: 1.6;
      position: absolute;
      text-align: center;
      top: 0.6rem;
      width: 0.5rem;
    }
  }

  &::before {
    content: '';
    transform: rotate(225deg);
    border-style: solid;
    display: block;
    width: 1rem;
    height: 1rem;
    position: absolute;
    background-color: #fff;
    border-width: 1px 0px 0px 1px;
    border-color: red;
    bottom: -8px;
    right: 50px;
  }
}
</style>
