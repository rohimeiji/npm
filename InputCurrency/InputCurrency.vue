<script>
import AutoNumeric from 'autonumeric';

export default {
  props:{
    value: [String, Number],
    options: Object,
  },
  data(){
    return {
      plugin: null,
    }
  },
  mounted(){
    this.plugin = new AutoNumeric(this.$el, Object.assign({decimalCharacter:",",digitGroupSeparator:".",minimumValue:'0',allowDecimalPadding:false},this.options))
    $(this.$el).keyup((e)=>{
      this.$emit("input", e.target.value.toValue())
    })
    if(!isNaN(this.value)) this.plugin.set(this.value)
  },
  watch:{
    value(v){
      if(v===0) return this.plugin.set(0)
      if(!v) return this.plugin.set("")
      this.plugin.set(v.toValue())
    }
  }
}
</script>

<template>
  <input type="text" autocomplete="off">
</template>