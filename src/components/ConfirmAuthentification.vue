<template>
  <div v-if="isVisible" class="modal-overlay">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Confirm Your Password</h5>
          <button type="button" class="btn-close" @click="close" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <p>To delete your account, please enter your current password:</p>
          <label for="password">Password:
          <input type="password" v-model="password" placeholder="Current password" class="form-control" /></label>
        </div>
        <div class="modal-footer">
          <button class="btn btn-danger" @click="confirmPassword">Confirm</button>
          <button class="btn btn-secondary" @click="close">Cancel</button>
        </div>
      </div>
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
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1050;
}

.modal-dialog {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 1051; /* Ensure modal content is above overlay */
  width: 90%;
  max-width: 500px;
}

.modal-content {
  padding: 20px;
  border-radius: 8px;
  background-color: #fff;
}
</style>
