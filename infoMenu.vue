<template>
	<div class="modal-content">
<!-- Header -->
		<div v-if="'download' === type" class="modal-header">
      <h6><a :href="title" id="link" :download="actionTitle">
      Click here to download the board</a></h6>
    </div>
		<div v-else class="modal-header">
      <h6>{{title}}</h6>
    </div>

<!-- Body -->
    <div v-if="type === 'gameOver'" class="modal-body">
      <p>Your energy and/or health reached 0, and you died.</p>
    </div>

 <!-- Footer -->
 		<div v-if="'gameOver' === type" class="modal-footer">
      <button type="button" id="etr" @click="exit">Ok</button>
    </div>
    <div v-else class="modal-footer">
      <button type="button" id="etr" @click="close">Ok</button>
    </div>
	</div>
</template>
<script>
	module.exports = {
		props: ['type', 'title', 'action', 'actionTitle', 'close', 'exit'],
	}
</script>