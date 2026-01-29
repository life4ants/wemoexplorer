<template>
	<div class="modal-content" >
<!-- Header -->
		<div v-if="['build', 'cook'].includes(type)" class="modal-header">
      <h4>{{title}}</h4>
    </div>
    <div v-else class="modal-header">
      <h6>{{title}}</h6>
    </div>
<!-- Body -->
		<div v-if="'dumpMenu' === type" class="modal-body">
      <p>Use arrow keys or click:</p>
      <div class="flex">
        <div v-for="(item, k) in showOptions" :key="k" style="position: relative">
          <img :src="item.src" height="35" width="35" @click="() => select(k)"
            :class="selectId === k ? 'red-border' : 'no-border'">
          <div v-if="item.num" class="img-badge">{{item.num}}</div>
        </div>
      </div>
    </div>
    <div v-else-if="'info' === type" class="modal-body">
      <div class="flex">
        <div v-for="(item, k) in showOptions" :key="k" style="position: relative">
          <img :src="item.src" height="35" width="35" class="no-border">
          <div v-if="item.num" class="img-badge">{{item.num}}</div>
        </div>
      </div>
    </div>
    <div v-else class="modal-body">
    	<p v-if="type === 'cook'">In order to cook anything, you must have a campsite and a clay pot.</p>
      <div v-if="type === 'cook'" class="build-preview">
        <img :src="selected.src" height="50" width="50">
        <h5>{{selected.title}}</h5>
        <p>{{selected.dist}}</p>
        <p>Makes {{selected.servings}} servings</p>
        <p><b>Time it takes to cook:</b> {{selected.time}} Wemo Minutes</p>
        <p><b>Each Serving gives you:</b> {{selected.benefits}}</p>
        <p><b>Ingredients Needed:</b> {{selected.resources}}</p>
        <p><b>Instructions:</b> {{selected.inst}}</p>
      </div>
      <div v-if="type === 'build'" class="build-preview">
        <img :src="selected.src" height="50" width="50">
        <h5>{{selected.title}}</h5>
        <p>{{selected.dist}}</p>
        <p><b>Time it takes to build:</b> {{selected.time}} Wemo Minutes</p>
        <p><b>Energy Needed:</b> {{selected.energy}}</p>
        <p><b>Resources Needed:</b> {{selected.resources}}</p>
        <p><b>Instructions:</b> {{selected.inst}}</p>
      </div>
      <div class="build-menu">
        <div class="build-option-container">
          <div v-for="(item, k) in showOptions" :id="item.name" :key="item.name" @click="() => select(k)"
                    :class="{'build-option-selected': selected.name === item.name, 'build-option': true}">
            <div v-if="type === 'load'">
            	<h6>{{item.name}}</h6>
            </div>
            <div v-else>
	            <img :src="item.src" height="35" width="35" >
	            <h6>{{item.title}}</h6>
	            <p>{{item.dist}}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
<!-- Footer -->
		<div v-if="type === 'info'" class="modal-footer">
			<button type="button" id="etr" @click="close">Ok</button>
		</div>
    <div v-else class="modal-footer">
      <button type="button" id="esc" @click="close">Cancel</button>
      <button type="button" class="button-primary" id="etr" @click="action">{{actionTitle}}</button>
    </div>
	</div>
</template>
<script>
	module.exports = {
		props: ['type','title', 'selected', 'showOptions', 
						'select', 'selectId', 'action', 'actionTitle','close']
	}
</script>