<template>
  <div class="brand-logo">
    <router-link
      :to="{ name: 'workspace' }"
      title="go to workspace page"
    >
      <img
        src="@/assets/logo.svg?external"
        alt="Kong Manager Logo"
      >
    </router-link>
  </div>
</template>
