<template>
  <div class="widget-form-container">
    <div v-if="data.Components.length == 0" class="form-empty">从 左 侧 拖 拽 来 添 加 字 段</div>
    <Form
      :size="data.config.size"
      label-suffix=":"
      :label-position="data.config.labelPosition"
      :label-width="data.config.labelWidth"
    >
      <draggable
        class
        v-model="data.Components"
        v-bind="{group:'people', ghostClass: 'ghost',animation: 200, handle: '.drag-widget'}"
        @end="handleMoveEnd"
        @add="handleWidgetAdd"
      >
        <transition-group name="fade" tag="div" class="widget-form-list">
          <template v-for="(element, index) in data.Components">
            <template v-if="element.type == 'grid'">
              <Row
                class="widget-col widget-view"
                v-if="element && element.key"
                :key="element.key"
                type="flex"
                :class="{active: selectWidget.key == element.key}"
                :gutter="element.options.gutter ? element.options.gutter : 0"
                :justify="element.options.justify"
                :align="element.options.align"
                @click.native="handleSelectWidget(index)"
              >
                <Col
                  v-for="(col, colIndex) in element.columns"
                  :key="colIndex"
                  :span="col.span ? col.span : 0"
                >
                  <draggable
                    v-model="col.Components"
                    :no-transition-on-drag="true"
                    v-bind="{group:'people', ghostClass: 'ghost',animation: 200, handle: '.drag-widget'}"
                    @end="handleMoveEnd"
                    @add="handleWidgetColAdd($event, element, colIndex)"
                  >
                    <transition-group name="fade" tag="div" class="widget-col-list">
                      <template v-for="(el, i) in col.Components">
                        <widget-form-item
                          :key="el.key"
                          v-if="el.key"
                          :element="el"
                          :select.sync="selectWidget"
                          :index="i"
                          :data="col"
                        ></widget-form-item>
                      </template>
                    </transition-group>
                  </draggable>
                </Col>
                <div
                  class="widget-view-action widget-col-action"
                  v-if="selectWidget.key == element.key"
                >
                  <i class="iconfont icon-trash" @click.stop="handleWidgetDelete(index)"></i>
                </div>

                <div
                  class="widget-view-drag widget-col-drag"
                  v-if="selectWidget.key == element.key"
                >
                  <i class="iconfont icon-drag drag-widget"></i>
                </div>
              </Row>
            </template>
            <template v-else>
              <widget-form-item
                v-if="element && element.key"
                :key="element.key"
                :element="element"
                :select.sync="selectWidget"
                :index="index"
                :data="data"
              ></widget-form-item>
            </template>
          </template>
        </transition-group>
      </draggable>
    </Form>
  </div>
</template>

<script>
import Draggable from "vuedraggable";
import WidgetFormItem from "./DesignComponent";

export default {
  components: {
    Draggable,
    WidgetFormItem
  },
  props: ["data", "select"],
  data() {
    return {
      selectWidget: this.select
    };
  },
  mounted() {
    document.body.ondrop = function(event) {
      let isFirefox = navigator.userAgent.toLowerCase().indexOf("firefox") > -1;
      if (isFirefox) {
        event.preventDefault();
        event.stopPropagation();
      }
    };
  },
  methods: {
    handleMoveEnd({ newIndex, oldIndex }) {
      console.log("index", newIndex, oldIndex);
    },
    handleSelectWidget(index) {
      console.log(index, "#####");
      this.selectWidget = this.data.Components[index];
    },
    handleWidgetAdd(evt) {
      console.log("add", evt);
      console.log("end", evt);
      const newIndex = evt.newIndex;
      const to = evt.to;
      console.log(to);

      //为拖拽到容器的元素添加唯一 key
      const key =
        Date.parse(new Date()) + "_" + Math.ceil(Math.random() * 99999);
      this.$set(this.data.Components, newIndex, {
        ...this.data.Components[newIndex],
        options: {
          ...this.data.Components[newIndex].options,
          remoteFunc: "func_" + key
        },
        key,
        // 绑定键值
        model: this.data.Components[newIndex].type + "_" + key,
        rules: []
      });

      if (
        this.data.Components[newIndex].type === "radio" ||
        this.data.Components[newIndex].type === "checkbox" ||
        this.data.Components[newIndex].type === "select"
      ) {
        this.$set(this.data.Components, newIndex, {
          ...this.data.Components[newIndex],
          options: {
            ...this.data.Components[newIndex].options,
            options: this.data.Components[newIndex].options.options.map(
              item => ({
                ...item
              })
            )
          }
        });
      }

      if (this.data.Components[newIndex].type === "grid") {
        this.$set(this.data.Components, newIndex, {
          ...this.data.Components[newIndex],
          columns: this.data.Components[newIndex].columns.map(item => ({
            ...item
          }))
        });
      }

      this.selectWidget = this.data.Components[newIndex];
    },
    handleWidgetColAdd($event, row, colIndex) {
      console.log("coladd", $event, row, colIndex);
      const newIndex = $event.newIndex;
      const oldIndex = $event.oldIndex;
      const item = $event.item;

      // 防止布局元素的嵌套拖拽
      if (item.className.indexOf("data-grid") >= 0) {
        // 如果是列表中拖拽的元素需要还原到原来位置
        item.tagName === "DIV" &&
          this.data.Components.splice(
            oldIndex,
            0,
            row.columns[colIndex].Components[newIndex]
          );

        row.columns[colIndex].Components.splice(newIndex, 1);

        return false;
      }

      console.log("from", item);
      console.log("from", row.columns);

      const key =
        Date.parse(new Date()) + "_" + Math.ceil(Math.random() * 99999);

      this.$set(row.columns[colIndex].Components, newIndex, {
        ...row.columns[colIndex].Components[newIndex],
        options: {
          ...row.columns[colIndex].Components[newIndex].options,
          remoteFunc: "func_" + key
        },
        key,
        // 绑定键值
        model: row.columns[colIndex].Components[newIndex].type + "_" + key,
        rules: []
      });

      if (
        row.columns[colIndex].Components[newIndex].type === "radio" ||
        row.columns[colIndex].Components[newIndex].type === "checkbox" ||
        row.columns[colIndex].Components[newIndex].type === "select"
      ) {
        this.$set(row.columns[colIndex].Components, newIndex, {
          ...row.columns[colIndex].Components[newIndex],
          options: {
            ...row.columns[colIndex].Components[newIndex].options,
            options: row.columns[colIndex].Components[newIndex].options.options.map(
              item => ({
                ...item
              })
            )
          }
        });
      }

      this.selectWidget = row.columns[colIndex].Components[newIndex];
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
