<template>
    <div class="min-vh-100 d-flex flex-column bg-light">
        <AppHeader />

        <main class="flex-grow-1 container py-4">
            <router-view v-slot="{ Component }">
                <transition name="fade" mode="out-in">
                    <component :is="Component" />
                </transition>
            </router-view>
        </main>

        <AppFooter />
    </div>
</template>

<script setup>
import AppHeader from './AppHeader.vue';
import AppFooter from './AppFooter.vue';
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>