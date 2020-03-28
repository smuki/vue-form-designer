<template>
  <FormItem
    class="widget-view"
    v-if="element && element.key"
    :class="{active: selectWidget.key == element.key, 'is_req': element.options.required}"
    :label="element.name"
    @click.native.stop="handleSelectWidget(index)"
  >
    <template v-if="element.type == 'input'">
      <Input
        v-model="element.options.defaultValue"
        :style="{width: element.options.width}"
        :placeholder="element.options.placeholder"
        :disabled="element.options.disabled"
      ></Input>
    </template>

    <template v-if="element.type == 'textarea'">
      <Input
        type="textarea"
        :rows="5"
        v-model="element.options.defaultValue"
        :style="{width: element.options.width}"
        :disabled="element.options.disabled"
        :placeholder="element.options.placeholder"
      ></Input>
    </template>

    <template v-if="element.type == 'number'">
      <Input-number
        v-model="element.options.defaultValue"
        :disabled="element.options.disabled"
        :controls-position="element.options.controlsPosition"
        :style="{width: element.options.width}"
      ></Input-number>
    </template>

    <template v-if="element.type == 'radio'">
      <el-radio-group
        v-model="element.options.defaultValue"
        :style="{width: element.options.width}"
        :disabled="element.options.disabled"
      >
        <el-radio
          :style="{display: element.options.inline ? 'inline-block' : 'block'}"
          :label="item.value"
          v-for="(item, index) in element.options.options"
          :key="item.value + index"
        >{{element.options.showLabel ? item.label : item.value}}</el-radio>
      </el-radio-group>
    </template>

    <template v-if="element.type == 'checkbox'">
      <el-checkbox-group
        v-model="element.options.defaultValue"
        :style="{width: element.options.width}"
        :disabled="element.options.disabled"
      >
        <el-checkbox
          :style="{display: element.options.inline ? 'inline-block' : 'block'}"
          :label="item.value"
          v-for="(item, index) in element.options.options"
          :key="item.value + index"
        >{{element.options.showLabel ? item.label : item.value}}</el-checkbox>
      </el-checkbox-group>
    </template>

    <template v-if="element.type == 'time'">
      <el-time-picker
        v-model="element.options.defaultValue"
        :is-range="element.options.isRange"
        :placeholder="element.options.placeholder"
        :start-placeholder="element.options.startPlaceholder"
        :end-placeholder="element.options.endPlaceholder"
        :readonly="element.options.readonly"
        :disabled="element.options.disabled"
        :editable="element.options.editable"
        :clearable="element.options.clearable"
        :arrowControl="element.options.arrowControl"
        :style="{width: element.options.width}"
      ></el-time-picker>
    </template>

    <template v-if="element.type == 'date'">
      <DatePicker
        v-model="element.options.defaultValue"
        :type="element.options.type"
        :is-range="element.options.isRange"
        :placeholder="element.options.placeholder"
        :start-placeholder="element.options.startPlaceholder"
        :end-placeholder="element.options.endPlaceholder"
        :readonly="element.options.readonly"
        :disabled="element.options.disabled"
        :editable="element.options.editable"
        :clearable="element.options.clearable"
        :style="{width: element.options.width}"
      ></DatePicker>
    </template>

    <template v-if="element.type == 'rate'">
      <Rate
        v-model="element.options.defaultValue"
        :max="element.options.max"
        :disabled="element.options.disabled"
        :allow-half="element.options.allowHalf"
      ></Rate>
    </template>

    <template v-if="element.type == 'color'">
      <el-color-picker
        v-model="element.options.defaultValue"
        :disabled="element.options.disabled"
        :show-alpha="element.options.showAlpha"
      ></el-color-picker>
    </template>

    <template v-if="element.type == 'select'">
      <Select
        v-model="element.options.defaultValue"
        :disabled="element.options.disabled"
        :multiple="element.options.multiple"
        :clearable="element.options.clearable"
        :placeholder="element.options.placeholder"
        :style="{width: element.options.width}"
      >
        <Option
          v-for="item in element.options.options"
          :key="item.value"
          :value="item.value"
          :label="element.options.showLabel?item.label:item.value"
        ></Option>
      </Select>
    </template>

    <template v-if="element.type=='switch'">
      <Switch v-model="element.options.defaultValue" :disabled="element.options.disabled"></Switch>
    </template>

    <template v-if="element.type=='slider'">
      <el-slider
        v-model="element.options.defaultValue"
        :min="element.options.min"
        :max="element.options.max"
        :disabled="element.options.disabled"
        :step="element.options.step"
        :show-input="element.options.showInput"
        :range="element.options.range"
        :style="{width: element.options.width}"
      ></el-slider>
    </template>

    <template v-if="element.type == 'cascader'">
      <el-cascader
        v-model="element.options.defaultValue"
        :disabled="element.options.disabled"
        :clearable="element.options.clearable"
        :placeholder="element.options.placeholder"
        :style="{width: element.options.width}"
        :options="element.options.remoteOptions"
      ></el-cascader>
    </template>

    <template v-if="element.type=='blank'">
      <div
        style="height: 50px;color: #999;background: #eee;line-height:50px;text-align:center;"
      >自定义区域</div>
    </template>

    <div class="widget-view-action" v-if="selectWidget.key == element.key">
      <i class="iconfont icon-icon_clone" @click.stop="handleWidgetClone(index)"></i>
      <i class="iconfont icon-trash" @click.stop="handleWidgetDelete(index)"></i>
    </div>

    <div class="widget-view-drag" v-if="selectWidget.key == element.key">
      <i class="iconfont icon-drag drag-widget"></i>
    </div>
  </FormItem>
</template>

<script>

export default {
  props: ["element", "select", "index", "data"],
  components: {
  },
  data() {
    return {
      selectWidget: this.select
    };
  },
  mounted() {},
  methods: {
    handleSelectWidget(index) {
      this.selectWidget = this.data.Components[index];
    },
    handleWidgetDelete(index) {
      if (this.data.Components.length - 1 === index) {
        if (index === 0) {
          this.selectWidget = {};
        } else {
          this.selectWidget = this.data.Components[index - 1];
        }
      } else {
        this.selectWidget = this.data.Components[index + 1];
      }

      this.$nextTick(() => {
        this.data.Components.splice(index, 1);
      });
    },
    handleWidgetClone(index) {
      let cloneData = {
        ...this.data.Components[index],
        options: { ...this.data.Components[index].options },
        key: Date.parse(new Date()) + "_" + Math.ceil(Math.random() * 99999)
      };

      if (
        this.data.Components[index].type === "radio" ||
        this.data.Components[index].type === "checkbox"
      ) {
        cloneData = {
          ...cloneData,
          options: {
            ...cloneData.options,
            options: cloneData.options.options.map(item => ({ ...item }))
          }
        };
      }

      this.data.Components.splice(index, 0, cloneData);

      this.$nextTick(() => {
        this.selectWidget = this.data.Components[index + 1];
      });
    }
  },
  watch: {
    select(val) {
      this.selectWidget = val;
    },
    selectWidget: {
      handler(val) {
        this.$emit("update:select", val);
      },
      deep: true
    }
  }
};
</script>
