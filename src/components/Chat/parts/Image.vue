<template>
  <div class="image">
    <img :src="imgSrc">
  </div>
</template>

<script>
  export default {
    props: [
      'imgsrc'
    ],
    data () {
      return {
        imgSrc: 'https://media.tenor.com/images/d6cd5151c04765d1992edfde14483068/tenor.gif'
      }
    },
    mounted () {
      var img, that
      img = new Image()
      that = this
      img.onload = function () {
        that.imgSrc = that.imgsrc
        that.$emit('imageLoad')
      }
      img.src = this.imgsrc
    }
  }
</script>

<style>
  .image{
    margin: 10px 10px 0 10px;
    background-color: white;
    box-shadow: 0px 0px 34px -7px rgba(0,0,0,0.75);
    width: 200px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: auto;
  }
  .message.own .image{
    margin-right: 0;
    margin-left: auto;
  }
  .image img{
    width: 150px;
  }
  @media (max-width: 480px) {
    .image{
      width: 120px;
    }
    .image img{
      width: 90px;
    }
  }
</style>
