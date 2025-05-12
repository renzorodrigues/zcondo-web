<script setup lang="ts">
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Tabs,
  TabsContent,
} from '@/components/ui/tabs'
import UserNav from '@/components/app/profile/UserNav.vue'
</script>

<template>
  <div class="flex flex-col flex-1 w-full min-h-screen">
    <div class="border-b w-full">
      <div class="flex h-16 items-center px-4 w-full">
        <div class="ml-auto flex items-center space-x-4">
          <UserNav />
        </div>
      </div>
    </div>
    <div class="flex-1 p-8 pt-6 w-full">
      <Tabs default-value="overview" class="space-y-4 mt-4 w-full">
        <TabsContent value="overview" class="space-y-4 w-full">
          <div class="w-full">
            <Card class="mx-auto max-w-3xl w-full">
              <CardHeader>
                <CardTitle>Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <main>
                  <NuxtPage />
                </main>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  </div>
</template>