<template>
  <module-detail :is-edit="true" />
</template>

<script>
import ModuleDetail from './components/ModuleDetail'

export default {
  name: 'EditModule',
  components: { ModuleDetail }
}
</script>

