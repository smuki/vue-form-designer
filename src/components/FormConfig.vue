<template>
  <div class="form-config-container">
    <el-form label-position="top">
      <el-form-item label="单据模版名称">
        <el-input v-model="data.name"></el-input>
      </el-form-item>
      <el-form-item label="描述">
        <el-input v-model="data.descrpiton"></el-input>
      </el-form-item>
      <el-form-item label="标签对齐方式">
        <el-radio-group v-model="data.labelPosition">
          <el-radio-button label="left">左对齐</el-radio-button>
          <el-radio-button label="right">右对齐</el-radio-button>
          <el-radio-button label="top">顶部对齐</el-radio-button>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="名称显示宽度">
        <el-input-number v-model="data.labelWidth" :min="0" :max="200" :step="10"></el-input-number>
      </el-form-item>

      <el-form-item label="组件大小">
        <el-radio-group v-model="data.size">
          <el-radio-button label="medium">中</el-radio-button>
          <el-radio-button label="small">小</el-radio-button>
          <el-radio-button label="mini">最小</el-radio-button>
        </el-radio-group>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  props: ["data"]
};
</script>
