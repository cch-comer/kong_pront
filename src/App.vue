<template>
  <AppLayout
    v-if="!hideComponents && !hideComponents2"
    :sidebar-top-items="sidebarItems"
  >
    <template #navbar-right>
      <div style="color: #C20A0A">
        {{ username }}
      </div>
      <k-button
        size="large"
        @click="logout"
      >
        Logout
      </k-button>
    </template>
    <template #sidebar-header>
      <NavbarLogo />
    </template>
    <router-view />
  </AppLayout>
  <AppLayout
    v-else-if="!hideComponents && hideComponents2"
    :sidebar-top-items="sidebarItems2"
  >
    <template #navbar-right>
      <div style="color: #C20A0A">
        {{ username }}
      </div>
      <k-button
        size="large"
        @click="logout"
      >
        Logout
      </k-button>
    </template>
    <template #sidebar-header>
      <NavbarLogo />
    </template>
    <router-view />
  </AppLayout>
  <router-view v-else />
</template>

<script setup lang="ts">
import { useAuth } from '@/useAuth'
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { AppLayout, type SidebarPrimaryItem } from '@kong-ui-public/app-layout'
import { useInfoStore } from '@/stores/info'
import NavbarLogo from '@/components/NavbarLogo.vue'

const { logout } = useAuth()
const route = useRoute()
const infoStore = useInfoStore()
const { isHybridMode } = storeToRefs(infoStore)
const username = ref('')
const hideComponents = computed(() => route.name === 'login')
const hideComponents2 = computed(() => route.name === 'overview' || route.name === 'portals' || route.name === 'vitals' || route.name === 'users')

const sidebarItems = computed<Array<SidebarPrimaryItem>>(() => [
  {
    name: 'Gateway Services',
    to: { name: 'service-list' },
    key: 'Gateway Services',
    active: route.meta?.entity === 'service',
  },
  {
    name: 'Routes',
    to: { name: 'route-list' },
    key: 'Routes',
    active: route.meta?.entity === 'route',
  },
  {
    name: 'Consumers',
    to: { name: 'consumer-list' },
    key: 'Consumers',
    active: route.meta?.entity === 'consumer',
  },
  {
    name: 'Plugins',
    to: { name: 'plugin-list' },
    key: 'Plugins',
    active: route.meta?.entity === 'plugin',
  },
  {
    name: 'Upstreams',
    to: { name: 'upstream-list' },
    key: 'Upstreams',
    active: route.meta?.entity === 'upstream',
  },
  {
    name: 'Certificates',
    to: { name: 'certificate-list' },
    key: 'Certificates',
    active: route.meta?.entity === 'certificate',
  },
  {
    name: 'CA Certificates',
    to: { name: 'ca-certificate-list' },
    key: 'CA Certificates',
    active: route.meta?.entity === 'ca-certificate',
  },
  {
    name: 'SNIs',
    to: { name: 'sni-list' },
    key: 'SNIs',
    active: route.meta?.entity === 'sni',
  },
  {
    name: 'Vaults',
    to: { name: 'vault-list' },
    key: 'Vaults',
    active: route.meta?.entity === 'vault',
  },
  {
    name: 'Keys',
    to: { name: 'key-list' },
    key: 'Keys',
    active: route.meta?.entity === 'key',
  },
  {
    name: 'Key Sets',
    to: { name: 'key-set-list' },
    key: 'Key Sets',
    active: route.meta?.entity === 'key-set',
  },
  ...(
    isHybridMode.value
      ? [
        // {
        //   name: 'Data Plane Nodes',
        //   to: { name: 'data-plane-nodes' },
        //   key: 'Data Plane Nodes',
        //   active: route.meta?.entity === 'data-plane-node',
        // },
      ]
      : []
  ),
])

const sidebarItems2 = computed<Array<SidebarPrimaryItem>>(() => [
  {
    name: 'Workspace',
    to: { name: 'overview' },
    key: 'overview',
    active: route.name === 'overview',
  },
  {
    name: 'Dev Portals',
    to: { name: 'portals' },
    key: 'portals',
    active: route.name === 'portals',
  },
  {
    name: 'Vitals',
    to: { name: 'vitals' },
    key: 'vitals',
    active: route.name === 'vitals',
  },
  {
    name: 'Users',
    to: { name: 'users' },
    key: 'users',
    active: route.name === 'users',
  },
  {
    name: '화면 전환',
    to: { name: 'service-list' },
    key: 'services',
    active: route.name === 'services',
  },
])
onMounted(() => {
  username.value = localStorage.getItem('username') || 'Guest'
})
</script>

<style scoped lang="scss">
.app-title {
  color: #fff;
  margin: 0;
  font-size: 20px;
}

:deep(.kong-ui-app-layout-content-inner) {
  position: relative;
  min-height: 100%;
  padding: 32px 40px 80px !important;
}

:deep(.json-content.k-code-block) {
  border-top-left-radius: $kui-border-radius-0 !important;
  border-top-right-radius: $kui-border-radius-0 !important;
}
</style>
