let popup = new Vue({
  el: '#popup',
  template: `
    <div>
      <div :class="{modal: true, fade: true, in: show}" :style="{ display: show ? 'block' : 'none' }" :id="id">
        <div class="modal-dialog">
          <div class="modal-content" >
            <div class="modal-header">
              <h4 class="modal-title">
                {{title}}
              </h4>
            </div>
            <div v-if="type === 'build'" class="modal-body">
              <img src="images/firepitIcon.png" height="50" width="50" id="firepit" :class="{selected: selected === 'firepit'}" @click="select">
            </div>

            <div v-if="'build' === type" class="modal-footer">
              <button type="button" id="esc" @click="close">Cancel</button>
              <button type="button" class="button-primary" :class="{disabled: selected === null}" id="etr" @click="build">Build</button>
            </div>
            <div v-else class="modal-footer">
              <button type="button" @click="close">Ok</button>
            </div>
          </div>
        </div>
      </div>
      <div :class="{'modal-backdrop': show, in: show}"></div>
    </div>
    `,
  data(){
    return {
      show: false,
      size: "small-center",
      title: "Test Message",
      type: "alert",
      selected: null
    }
  },
  methods: {
    buildMenu(){
      this.title = "Build Menu"
      this.type = "build"
      this.selected = null
      this.show = true
    },
    close(){
      this.show = false
    },
    build(){
      if (this.selected !== null){
        let error = build(this.selected)
        if (!error)
          this.close()
        else {
          this.type = "alert"
          this.title = error
        }
      }
    },
    select(){
      this.selected = "firepit"
    }
  },
  computed: {
    id(){
      if (this.size === 'small')
        return 'popup'
      else if (this.size === 'small-center')
        return 'popup-center'
      else
        return "popup-big"
    }
  }
})

