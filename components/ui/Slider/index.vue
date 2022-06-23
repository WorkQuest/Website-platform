<template>
  <div class="slider-container">
    <input
      class="slider"
      :class="[{
        'slider_gray': mode === $options.SLIDER_MODE.GRAY,
        'slider_blue': mode === $options.SLIDER_MODE.BLUE,
        'slider_green': mode === $options.SLIDER_MODE.GREEN,
        'slider_red': mode === $options.SLIDER_MODE.RED,
      }]"
      type="range"
      :min="from"
      :max="to"
      :value="value"
      @input="$emit('change', $event.target.value)"
    >
  </div>
</template>

<script>
import BigNumber from 'bignumber.js';
import { SLIDER_MODE } from './model';

export default {
  SLIDER_MODE,
  props: {
    value: {
      type: Number,
      default: 1,
    },
    mode: {
      type: String,
      default: SLIDER_MODE.GRAY,
    },
    from: {
      type: Number,
      default: 0,
    },
    to: {
      type: Number,
      default: 100,
    },
  },
  computed: {
    progressValue() {
      const { to, from, value } = this;

      const length = new BigNumber(to).minus(from).toNumber();
      const segment = new BigNumber(value).minus(from).toNumber();

      return new BigNumber(segment).multipliedBy(100).dividedBy(length).toFixed(0);
    },
  },
};
</script>

<style lang="scss" scoped>

.slider {
  width: 100%;
  -webkit-appearance: none;
  appearance: none;
  background: transparent;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    height: 16px;
    width: 16px;
    border-radius: 50%;
    cursor: pointer;
    margin-top: -5px; /* You need to specify a margin in Chrome, but in Firefox and IE it is automatic */
  }

  &_gray::-webkit-slider-thumb {
    background: $black100;
  }

  &_green::-webkit-slider-thumb {
    background: $green;
  }

  &_blue::-webkit-slider-thumb {
    background: $blue;
  }

  &_red::-webkit-slider-thumb {
    background: $red;
  }

  &::-moz-range-thumb {
    height: 16px;
    width: 16px;
    border: none;
    border-radius: 50%;
    cursor: pointer;
  }

  &_gray::-moz-range-thumb {
    background: $black100;
  }

  &_green::-moz-range-thumb {
    background: $green;
  }

  &_blue::-moz-range-thumb {
    background: $blue;
  }

  &_red::-moz-range-thumb {
    background: $red;
  }

  &::-webkit-slider-runnable-track {
    width: 100%;
    height: 6px;
    border-radius: 4px;
    background: $black0;
    cursor: pointer;
  }

  &:active::-webkit-slider-runnable-track {
    background: $black100;
  }

  &::-moz-range-track {
    width: 100%;
    height: 6px;
    cursor: pointer;
    background: $black0;
    border-radius: 4px;
  }

  &:active::-moz-range-track {
    background: $black100;
  }

}
</style>
