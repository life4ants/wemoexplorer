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
    <div v-else-if="'getSize' === type" class="modal-body">
      <label style="display: inline">Number of columns (width):</label>
      <input type="number" v-model="inputValue.cols" min="20" max="250" id="inputOne">
      <br>
      <label style="display: inline">Number of rows (height):</label>
      <input type="number" v-model="inputValue.rows" min="20" max="250" id="inputTwo">
    </div>
    <div v-else-if="'download' === type" class="modal-body">
      <label style="display: inline">Type:</label>
      <select v-model="inputValue.type">
        <option value="custom">Custom</option>
        <option value="default">Default</option>
      </select>
      <br>
      <label style="display: inline">Name:</label>
      <input type="text" v-model="inputValue.name" id="inputOne">
      <label style="display: inline">Level:</label>
      <input type="number" min="1" max="10" id="inputTwo" v-model="inputValue.level">
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
        let d = {}
        try {d = JSON.parse(this.uploadData.text)}
        catch(e){
          console.error(e)
          this.setAlert("Failed to parse file text.")
          return
        }
        if (d && d.cols && d.rows){
          let w = new Board(d)
          let dupname = false
          for (let g of Object.keys(localStorage)){
            if (g === "board" + w.name){dupname = true}
          }
          if (dupname || w.save()){// board.save returns true with error message, so world was not saved
            board = w
            world.resize(board.cols, board.rows)
            this.callback("Board Name: "+board.name)
            this.setAlert(`World [${w.name}] loaded. Please save before exiting. If you already have a world named [${w.name}], it will replace it. Use Save As to save with a new name.`)
          }
          else {// world was saved to local storage
            this.setAlert(`World [${w.name}] was saved. You can load it to edit, or exit and play it now.`)
          }
        }
        else
          this.setAlert("Failed to create board.");
      }
      else if (this.type === "download"){
        let data = structuredClone(board)
        if (this.inputValue.type === "default"){delete data.playtime}
        data.type = this.inputValue.type
        data.level = Number(this.inputValue.level)
        data.name = this.inputValue.name

        const blob = data.type === "custom" ?
          new Blob([JSON.stringify(data, null, 2)],{ type: "text/plain" }) :
          new Blob([JSON.stringify(data)],{ type: "application/json" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = data.type === "custom" ? data.name+".txt" : data.level+".json"
        a.click()
        URL.revokeObjectURL(url)
        this.close()
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