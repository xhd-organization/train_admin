<template>
  <field-detail :is-edit="true" />
</template>

<script>
import FieldDetail from './components/FieldDetail'

export default {
  name: 'EditField',
  components: { FieldDetail }
}
</script>

