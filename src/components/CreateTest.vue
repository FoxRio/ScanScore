<template>
  <div class="createNewTest">
    <div>
      <button @click="collapse" class="collapse">collapse</button>
    </div>
    <div>
      <button @click="generateDocument">Generate Document</button>
    </div>
    <div>
      <p>Here you can create a new Test that will be outputed as a .docx download</p>
    </div>
    <div>
      <!-- <form action="#" method="post">
        <label for="taskDescription">Please input the question / task</label>
        <input type="text" id="taskDescription" name="taskDescription">
      </form> -->

    </div>

  </div>
</template>

<script>
// import Docxtemplater from 'docxtemplater';
import {
  Document, Paragraph, Packer, TextRun,
}
  from 'docx';

import { saveAs } from 'file-saver';

export default {
  components: {

  },
  data: () => ({
    state: {
      name: 'San Luis Potosi',
    },
  }),
  methods: {
    collapse() {
      this.$emit('collapse');
    },
    async generateDocument() {
      const doc = new Document({
        sections: [
          {
            properties: {},
            children: [
              new Paragraph({
                children: [
                  new TextRun('Dear User,'),
                ],
              }),
              new Paragraph({
                children: [
                  new TextRun('We would like to emphasize the importance of exercising caution when downloading files from the internet. The internet is a vast and dynamic space with both valuable and potentially harmful content. As part of ensuring your digital safety and the security of your device, we recommend the following precautions:'),
                ],
              }),
              new Paragraph({
                children: [
                  new TextRun('1. **Trustworthy Sources:**'),
                  new TextRun('\n   Only download files from reputable and well-known sources. Be cautious when downloading files from unfamiliar websites or sources, as they may pose a security risk.'),
                ],
              }),
              new Paragraph({
                children: [
                  new TextRun('2. **Verify Authenticity:**'),
                  new TextRun('\n   Before downloading any file, verify its authenticity. Ensure that the source is legitimate, and the file is what it claims to be. Avoid downloading files that seem suspicious or are not clearly identified.'),
                ],
              }),
              new Paragraph({
                children: [
                  new TextRun('3. **Use Security Software:**'),
                  new TextRun('\n   Install and regularly update reliable antivirus and anti-malware software. These tools help protect your device by detecting and preventing the download of malicious files.'),
                ],
              }),
              new Paragraph({
                children: [
                  new TextRun('4. **Check File Extensions:**'),
                  new TextRun('\n   Be mindful of file extensions. Avoid downloading files with executable extensions (e.g., .exe) unless you are certain of their safety. Malicious software often disguises itself as harmless files.'),
                ],
              }),
              new Paragraph({
                children: [
                  new TextRun('5. **Keep Software Updated:**'),
                  new TextRun('\n   Regularly update your operating system, web browsers, and any other software you use. Software updates often include security patches that help protect your device from vulnerabilities.'),
                ],
              }),
              new Paragraph({
                children: [
                  new TextRun('6. **Exercise Caution with Email Attachments:**'),
                  new TextRun('\n   Be cautious when opening email attachments, especially if they are unexpected or from unknown senders. Email attachments are a common vector for malware.'),
                ],
              }),
              new Paragraph({
                children: [
                  new TextRun('\nRemember that your digital safety is a shared responsibility. By practicing these precautions, you contribute to a safer online environment for yourself and others.'),
                ],
              }),
              new Paragraph({
                children: [
                  new TextRun('\nThank you for your attention to these guidelines.'),
                ],
              }),
              new Paragraph({
                children: [
                  new TextRun('\nBest regards,'),
                  new TextRun('\nThose who are now in your walls'),
                ],
              }),
            ],
          },
        ],
      });

      try {
        Packer.toBlob(doc).then((blob) => {
          // saveAs from FileSaver will download the file
          saveAs(blob, 'pipebomb.docx');
        });
        // const buffer = await Packer.toBuffer(doc);
        // const blob = new Blob([buffer],
        // { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
        // saveAs(blob, 'MyDocument.docx');
      } catch (error) {
        console.error('Error generating document:', error);
      }
    },
  },
};
</script>

<style></style>
