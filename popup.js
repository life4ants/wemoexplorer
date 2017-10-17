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
            <div class="modal-body">
              <img src="images/firepit.png" height="50" width="50">
            </div>

            <div v-if="'yesno' === type" class="modal-footer">
              <button type="button" class="btn btn-default" id="esc" @click="close">No</button>
              <button type="button" class="btn btn-primary" id="etr" @click="action">Yes</button>
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
      title: "Build Menu",
      type: "build"
    }
  },
  methods: {
    close(){
      this.show = false
    },
    action(){
      console.log("ok")
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

