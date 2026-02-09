<template>
	<div class="sidebar" style="width: 180px">
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
      <p class="slide-right">You are building:</p>
      <p class="center"><b>{{buildType.name}}</b></p>
      <p class="slide-right">{{buildType.rules}}</p>
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
  computed: {
  	buildType(){
      let types = {
          raft: {name:"A Raft", rules: "Must be on a beach with water next to it." },
          steppingStones: {name: "Stepping Stones", rules: "Must be in a straight section of river"},
          campsite: {name: "A Campsite", rules: "Must be on a cleared section of land"}
        }
       return types[builder.item.name]
    }
  },
  methods: {

	}
}
</script>
<style>
  .slide-right{
    margin-left: 10px;
  }
</style>