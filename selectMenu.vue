<template>
	<div class="modal-content">
<!-- Header -->
    <div v-if="'input' === type" class="modal-header">
      <h6>{{title}}</h6>
      <input type="text" v-model="inputValue.text" id="inputOne">
    </div>
    <div v-else-if="'fileUpload' === type" class="modal-header">
      <h6>{{title}}</h6>
      <input type="file" @change="readFilePath" id="inputOne">
      <p>{{uploadData.msg}}</p>
    </div>
		<div v-else class="modal-header">
      <h6>{{title}}</h6>
    </div>

<!-- Body -->
    <div v-if="'pickBombs' === type" class="modal-body">
      <label style="display: inline">Enter number (max 5):</label>
      <input type="number" min="1" max="5" id="inputOne" v-model="inputValue.number">
    </div>
    <div v-if="'getSize' === type" class="modal-body">
      <label style="display: inline">Number of columns (width):</label>
      <input type="number" v-model="inputValue.cols" min="20" max="250" id="inputOne">
      <br>
      <label style="display: inline">Number of rows (height):</label>
      <input type="number" v-model="inputValue.rows" min="20" max="250" id="inputTwo">
    </div>

 <!-- Footer -->
 		<div class="modal-footer">
      <button type="button" id="esc" @click="close">Cancel</button>
      <button type="button" class="button-primary" id="etr" @click="callAction">Ok</button>
    </div>
	</div>
</template>
<script>
	module.exports = {
		props: ['type', 'title', 'inputValue', 'action', 
      'close', 'callback', 'setAlert'],
  data(){
    return {
      uploadData: {
        text: "",
        done: false,
        outputMessage: ""
      }
    }
  },
  methods: {
    callAction(){
      if (this.type === "fileUpload"){
        let b = {}
        try {b = JSON.parse(this.uploadData.text)}
        catch(e){
          console.error(e)
          this.setAlert("Failed to parse file text.")
          return
        }
        if (b.name){
          board = new Board(b)
          world.resize(board.cols, board.rows)
          this.callback("Board Name: "+board.name)
          this.setAlert("World loaded. Please save before exiting.")
        }
        else
          this.setAlert("Failed to create board.");
      }
      else
        this.action()
    },
    readFilePath(){
      this.uploadData = {
        text: "",
        done: false,
        msg: "Loading..."
      }
      document.getElementById("inputOne").files[0].text().then(
        (e)=>{this.uploadData = {
          text: e,
          done: true,
          msg: "Uploaded successfully."
        } }).catch(
        ()=> this.uploadData.msg = "Upload failed. :(")
    }
  }
}
</script>