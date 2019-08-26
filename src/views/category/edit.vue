<template>
  <category-detail :is-edit="true" />
</template>

<script>
import CategoryDetail from './components/CategoryDetail'

export default {
  name: 'EditCategory',
  components: { CategoryDetail }
}
</script>

