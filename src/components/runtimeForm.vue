<template>
  <div>
    <el-form
      ref="runtimeForm"
      label-suffix=":"
      :size="data.config.size"
      :model="models"
      :rules="rules"
      :label-position="data.config.labelPosition"
      :label-width="data.config.labelWidth + 'px'"
    >
      <template v-for="item in data.Components">
        <template v-if="item.type == 'grid'">
          <el-row
            :key="item.key"
            type="flex"
            :gutter="item.options.gutter ? item.options.gutter : 0"
            :justify="item.options.justify"
            :align="item.options.align"
          >
            <el-col v-for="(col, colIndex) in item.columns" :key="colIndex" :span="col.span">
              <template v-for="citem in col.Components">
                <el-form-item
                  v-if="citem.type=='blank'"
                  :label="citem.name"
                  :prop="citem.model"
                  :key="citem.key"
                >
                  <slot :name="citem.model" :model="models"></slot>
                </el-form-item>
                <runtime-form-item
                  v-else
                  :key="citem.key"
                  :models.sync="models"
                  :remote="remote"
                  :rules="rules"
                  :widget="citem"
                ></runtime-form-item>
              </template>
            </el-col>
          </el-row>
        </template>

        <template v-else-if="item.type == 'blank'">
          <el-form-item :label="item.name" :prop="item.model" :key="item.key">
            <slot :name="item.model" :model="models"></slot>
          </el-form-item>
        </template>

        <template v-else>
          <runtime-form-item
            :key="item.key"
            :models.sync="models"
            :rules="rules"
            :widget="item"
            :remote="remote"
          ></runtime-form-item>
        </template>
      </template>
    </el-form>
  </div>
</template>

<script>
import runtimeFormItem from "./runtimeFormItem";
import { loadJs } from "../util/index.js";

export default {
  name: "fm-runtime-form",
  components: {
    runtimeFormItem
  },
  props: ["data", "remote", "value", "insite"],
  data() {
    return {
      models: {},
      rules: {}
    };
  },
  created() {
    console.log(this.data);
    this.generateModle(this.data.Components);
  },
  mounted() {},
  methods: {
    generateModle(genList) {
      for (let i = 0; i < genList.length; i++) {
        console.log(i);
        console.log(genList[i].type);
        if (genList[i].type === "grid") {
          console.log("columns");
          console.log(genList[i].columns);
          genList[i].columns.forEach(item => {
            console.log("Components");

            console.log(item.Components);

            this.generateModle(item.Components);
          });
        } else {
          if (
            this.value &&
            Object.keys(this.value).indexOf(genList[i].model) >= 0
          ) {
                      console.log("columns-1111");

            this.models[genList[i].model] = this.value[genList[i].model];
          } else {
            if (genList[i].type === "blank") {
              this.$set(
                this.models,
                genList[i].model,
                genList[i].options.defaultType === "String"
                  ? ""
                  : genList[i].options.defaultType === "Object"
                  ? {}
                  : []
              );
            } else {
                                    console.log("columns-22222");

              this.models[genList[i].model] = genList[i].options.defaultValue;
            }
          }

          if (this.rules[genList[i].model]) {
            this.rules[genList[i].model] = [
              ...this.rules[genList[i].model],
              ...genList[i].rules.map(item => {
                if (item.pattern) {
                  return { ...item, pattern: eval(item.pattern) };
                } else {
                  return { ...item };
                }
              })
            ];
          } else {
            this.rules[genList[i].model] = [
              ...genList[i].rules.map(item => {
                if (item.pattern) {
                  return { ...item, pattern: eval(item.pattern) };
                } else {
                  return { ...item };
                }
              })
            ];
          }
        }
      }
    },
    getData() {
      return new Promise((resolve, reject) => {
        this.$refs.runtimeForm.validate(valid => {
          if (valid) {
            resolve(this.models);
          } else {
            reject(new Error("表单数据校验失败").message);
          }
        });
      });
    },
    reset() {
      this.$refs.runtimeForm.resetFields();
    },
    refresh() {}
  },
  watch: {
    data: {
      deep: true,
      handler(val) {
        this.generateModle(val.list);
      }
    },
    value: {
      deep: true,
      handler(val) {
        console.log(JSON.stringify(val));
        this.models = { ...this.models, ...val };
      }
    }
  }
};
</script>

<style lang="scss">
// @import '../styles/cover.scss';
</style>
