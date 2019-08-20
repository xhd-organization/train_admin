<template>
  <field-detail :is-edit="false" />
</template>
<script>
import FieldDetail from './components/FieldDetail'

export default {
  name: 'CreateModule',
  components: { FieldDetail }
}
</script>
