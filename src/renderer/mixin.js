export default {
  mounted () {
    this.disableDragEvent()
  },
  
  methods: {
    disableDragEvent () {
      window.addEventListener('dragenter', this.disableDrag, false)
      window.addEventListener('dragover', this.disableDrag)
      window.addEventListener('drop', this.disableDrag)
    },
    disableDrag (e) {
      const dropzone = document.getElementById('filebox') // 这个是可拖拽的上传区
      const dropzone2 = document.getElementById('filebox2') // 这个是可拖拽的上传区
      if ((dropzone&&dropzone.contains(e.target)) || (dropzone2&&dropzone2.contains(e.target)))
        return
      else{
        e.preventDefault()
        e.dataTransfer.effectAllowed = 'none'
        e.dataTransfer.dropEffect = 'none'
      }
    },
    beforeDestroy () {
      window.removeEventListener('dragenter', this.disableDrag, false)
      window.removeEventListener('dragover', this.disableDrag)
      window.removeEventListener('drop', this.disableDrag)
    }
  }
}