<template>
  <div class="createNewTest">
    <div>
      <button @click="collapse" class="collapse">collapse</button>
    </div>
    <div><button @click="generateDocx">Generate .docx</button></div>
    <div>
      <p>Here you can create a new Test that will be outputed as a .docx download</p>
    </div>
    <div>
      <form>
        <label for="taskDescription">Please input the question / task</label>
        <input type="text" id="taskDescription" name="taskDescription">
      </form>

    </div>

  </div>
</template>

<script>
import Docxtemplater from 'docxtemplater';

export default {
  data() {

  },
  methods: {
    collapse() {
      this.$emit('collapse');
    },
    // generateDocx() {
    //   // Your data to be inserted into the document
    //   const data = {
    //     title: 'My Document',
    //     content: 'This is the content of the document.',
    //   };

    //   // Create a new Docxtemplater instance
    //   const doc = new Docxtemplater();

    //   // Define the content structure (you can customize this based on your needs)
    //   const content = `<h1>{{title}}</h1><p>{{content}}</p>`;

    //   // Load the content into the Docxtemplater instance
    //   doc.load(content);

    //   // Set the data in the template
    //   doc.setData(data);

    //   // Render the document
    //   try {
    //     doc.render();
    //   } catch (error) {
    //     console.error('Error rendering document:', error);
    //     return;
    //   }

    //   // Generate a Blob from the document content
    //   const blob = doc.getBlob();

    //   // Download the generated .docx file
    //   const link = document.createElement('a');
    //   link.href = URL.createObjectURL(blob);
    //   link.download = 'generated.docx';

    //   // Programmatically click the link to trigger the download
    //   link.click();
    // },
  },
};
</script>

<style></style>
