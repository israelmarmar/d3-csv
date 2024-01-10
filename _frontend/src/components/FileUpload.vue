<template>
  <div v-if="!selectedFile" class="file-upload" @dragover.prevent @drop="handleDrop" @click="openFileInput">
    <p>Clique ou arraste e solte um arquivo csv aqui</p>
    <input ref="fileInput" type="file" style="display: none" @change="handleFileInput" />
  </div>
  <p v-if="selectedFile">{{ selectedFile.name }}</p>
  <div v-if="values">
    <BarGraph label="MMR" :values="values.mmr"/>
    <BarGraph label="Churn" :values="values.churn"/>
    <QBarGraph label="Nº de cobranças" :values="values.quantities"/>

  </div>
</template>
  
<script>
import BarGraph from "./BarGraph.vue";
import QBarGraph from "./QBarGraph.vue";
import axios from 'axios';

export default {
  data() {
    return {
      selectedFile: null,
      values: null,
      skip: 1,
      limit: 10
    };
  },
  components: {
    BarGraph,
    QBarGraph
  },
  methods: {
    handleDrop(event) {
      event.preventDefault();
      const file = event.dataTransfer.files[0];

      if (file) {
        this.handleFile(file);
      }
    },
    openFileInput() {
      this.$refs.fileInput.click();
    },
    handleFileInput(event) {
      const file = event.target.files[0];

      if (file) {
        this.handleFile(file);
      }
    },
    handleFile(file) {
      this.selectedFile = file;
      this.uploadFile(file);
    },
    updateFile() {
      this.uploadFile(this.selectedFile);
    },
    uploadFile(file) {
      const formData = new FormData();
      formData.append("data", file);

      console.log(this.skip, this.limit);
      const apiUrl = `${process.env.VUE_APP_API_URL}?limit=${this.limit}&skip=${this.skip}`;

      axios.post(apiUrl, formData)
        .then(response => {
          console.log("Arquivo enviado com sucesso!", response.data);
          this.values = response.data;
        })
        .catch(error => {
          console.error("Erro ao enviar arquivo:", error);
        });
    },
  },
};
</script>
  
<style scoped>
.file-upload {
  border: 2px dashed #ccc;
  padding: 20px;
  text-align: center;
  cursor: pointer;
}

.row {
  display: flex;
  flex-direction: row;
  width: 45%;
}
</style>
  