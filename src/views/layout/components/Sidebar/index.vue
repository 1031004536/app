<template>
  <scroll-bar>
    <el-menu
      mode="vertical"
      :show-timeout="200"
      :default-active="$route.path"
      :collapse="isCollapse"
      background-color="#304156"
      text-color="#bfcbd9"
      active-text-color="#409EFF"
      unique-opened
    >
      <sidebar-item :routes="menu" ></sidebar-item>
    </el-menu>
  </scroll-bar>
</template>

<script>
import { mapGetters } from "vuex";
import SidebarItem from "./SidebarItem";
import ScrollBar from "@/components/ScrollBar";

export default {
  components: { SidebarItem, ScrollBar },
  computed: {
    ...mapGetters(["sidebar"]),
    routes() {
      return this.$store.getters.menu.options.routes;
    },
    menu(){
      if(this.$store.getters.menu){
        return this.$store.getters.menu.options.routes;
      }
      return [];
    },
    isCollapse() {
      return !this.sidebar.opened;
    },
  }
};
</script>
