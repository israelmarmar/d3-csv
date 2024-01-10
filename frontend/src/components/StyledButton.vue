<template>
    <button
      class="styled-button"
      :style="{ backgroundColor, color }"
      @click="handleClick"
    >
      <slot></slot>
    </button>
  </template>
  
  <script>
  export default {
    props: {
      backgroundColor: {
        type: String,
        default: '#3498db',
      },
      color: {
        type: String,
        default: '#ffffff',
      },
    },
    methods: {
      handleClick() {
        this.$emit('click');
      },
    },
  };
  </script>
  
  <style scoped>
  .styled-button {
    padding: 10px 20px;
    font-size: 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
    height: 100%;
    margin-left: 12px;
  }
  
  .styled-button:hover {
    background-color: #2980b9;
  }
  </style>
  