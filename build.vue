<template>
	<div class="sidebar" style="width: 150px">
    <div class="sidebar-content">
      <h5 style="text-decoration: underline">Build Mode</h5>
      <h6>Rules:</h6>
      <ul>
        <li>You may only build within the grey circle around your player.</li>
        <li>You may not build on the same square as your player.</li>
        <li>You may not build on an unrevealed square.</li>
        <li>A red square means you can't build at that spot, a green circle inside a square means you can.</li>
        <li>Click to build!</li>
      </ul>
      <p style="margin-left: 5px">
        You are building: <br><b>{{buildType}}</b>
      </p>
      <button style="margin-left: 20px" @click="toggleBuildMode" id="esc">Cancel</button>
    </div>
  </div>
</template>

<script>
module.exports = {
	data(){
		return {

		}
	},
	props: [
		"toggleBuildMode"
	],
	mounted(){
    
  },
  computed: {
    buildType(){
      if (builder.item.name){
        switch(builder.item.name){
          case "raft": return "A Raft"
          case "steppingStones": return "Stepping Stones"
          case "campsite": return "A Campsite"
        }
      }
      return ""
    }
  },
  methods: {

	}
}
</script>