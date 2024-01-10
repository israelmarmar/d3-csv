<template>
  <div class="text-input">
    <label :for="name">{{ label }}</label>
    <input :type="type" :id="name" :name="name" :placeholder="placeholder" :value="text"  @input="onInput" />
  </div>
</template>
  
<script>

export default {
  model: {
      prop: 'text',
      event: 'update'
    },
  props: {
    label: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      default: 'text',
    },
    placeholder: {
      type: String,
      default: '',
    },
    text: {
      type: String,
      default: '',
    },
  },
  methods: {
      onInput(event) {
        this.$emit('update:text', event.target.value)
      }
    }
};
</script>
  
<style scoped>
.text-input {
  display: flex;
  flex-direction: row;
  margin-bottom: 20px;
  width: 70%;
}

label {
  display: block;
  margin-bottom: 8px;
  padding: 0.5rem 1rem;
  font-size: 18px;
  font-weight: 400;
  color: #495057;
  width: 70%;
}

input {
  width: 100%;
  padding: 8px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}
</style>
  