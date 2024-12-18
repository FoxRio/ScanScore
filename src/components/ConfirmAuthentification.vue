<template>
  <div v-if="isVisible" class="overlay">
    <div class="modal">
      <h3>Confirm Your Password</h3>
      <p>To delete your account, please enter your current password:</p>
      <label for="password">
      <input type="password" v-model="password" placeholder="Current password" /></label>
        <button @click="confirmPassword">Confirm</button>
        <button @click="close">Cancel</button>
      </div>
    </div>
  </template>

<script>
export default {
  props: ['isVisible'],
  data() {
    return {
      password: '',
    };
  },
  methods: {
    close() {
      this.$emit('close');
    },
    confirmPassword() {
      this.$emit('confirm', this.password);
      this.close();
    },
  },
};
</script>

<style scoped>
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 300px;
  text-align: center;
}

input {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-sizing: border-box;
}

button {
  background-color: #d44e00;
  color: white;
  border: none;
  padding: 10px 15px;
  cursor: pointer;
  border-radius: 5px;
  width: 100%;
}

button:hover {
  background-color: #b43e00;
}
</style>
