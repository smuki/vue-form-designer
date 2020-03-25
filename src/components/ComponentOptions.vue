<template>
  <div v-if="show">
    <Form label-position="top">
      <FormItem label="标题" v-if="data.type!='grid'">
        <Input v-model="data.name"></Input>
      </FormItem>
      <FormItem label="宽度" v-if="Object.keys(data.options).indexOf('width')>=0">
        <Input v-model="data.options.width"></Input>
      </FormItem>

      <FormItem label="高度" v-if="Object.keys(data.options).indexOf('height')>=0">
        <Input v-model="data.options.height"></Input>
      </FormItem>

      <FormItem label="大小" v-if="Object.keys(data.options).indexOf('size')>=0">
        宽度：
        <Input style="width: 90px;" type="number" v-model.number="data.options.size.width"></Input>高度：
        <Input style="width: 90px;" type="number" v-model.number="data.options.size.height"></Input>
      </FormItem>

      <FormItem
        label="提示文字"
        v-if="Object.keys(data.options).indexOf('placeholder')>=0 && (data.type!='time' || data.type!='date')"
      >
        <Input v-model="data.options.placeholder"></Input>
      </FormItem>
      <FormItem label="布局方式" v-if="Object.keys(data.options).indexOf('inline')>=0">
        <RadioGroup v-model="data.options.inline">
          <Radio :label="false">块级</Radio>
          <Radio :label="true">行内</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label="显示输入框" v-if="Object.keys(data.options).indexOf('showInput')>=0">
        <Switch v-model="data.options.showInput"></Switch>
      </FormItem>
      <FormItem label="最小值" v-if="Object.keys(data.options).indexOf('min')>=0">
        <Input-number v-model="data.options.min" :min="0" :max="100" :step="1"></Input-number>
      </FormItem>
      <FormItem label="最大值" v-if="Object.keys(data.options).indexOf('max')>=0">
        <Input-number v-model="data.options.max" :min="0" :max="100" :step="1"></Input-number>
      </FormItem>
      <FormItem label="步长" v-if="Object.keys(data.options).indexOf('step')>=0">
        <Input-number v-model="data.options.step" :min="0" :max="100" :step="1"></Input-number>
      </FormItem>
      <FormItem label="是否多选" v-if="data.type=='select' || data.type=='imgupload'">
        <Switch v-model="data.options.multiple" @change="handleSelectMuliple"></Switch>
      </FormItem>
      <FormItem label="是否可搜索" v-if="data.type=='select'">
        <Switch v-model="data.options.filterable"></Switch>
      </FormItem>
      <FormItem label="允许半选" v-if="Object.keys(data.options).indexOf('allowHalf')>=0">
        <Switch v-model="data.options.allowHalf"></Switch>
      </FormItem>
      <FormItem label="支持透明度选择" v-if="Object.keys(data.options).indexOf('showAlpha')>=0">
        <Switch v-model="data.options.showAlpha"></Switch>
      </FormItem>
      <FormItem label="是否显示标签" v-if="Object.keys(data.options).indexOf('showLabel')>=0">
        <Switch v-model="data.options.showLabel"></Switch>
      </FormItem>
      <FormItem label="选项" v-if="Object.keys(data.options).indexOf('options')>=0">
        <RadioGroup v-model="data.options.remote" size="mini" style="margin-bottom:10px;">
          <Radio :label="false">静态数据</Radio>
          <Radio :label="true">远端数据</Radio>
        </RadioGroup>
        <template v-if="data.options.remote">
          <div>
            <Input size="mini" style v-model="data.options.remoteFunc">
              <template slot="prepend">远端方法</template>
            </Input>
            <Input size="mini" style v-model="data.options.props.value">
              <template slot="prepend">值</template>
            </Input>
            <Input size="mini" style v-model="data.options.props.label">
              <template slot="prepend">标签</template>
            </Input>
          </div>
        </template>
        <template v-else>
          <template v-if="data.type=='radio' || (data.type=='select'&&!data.options.multiple)">
            <RadioGroup v-model="data.options.defaultValue">
              <draggable
                tag="ul"
                :list="data.options.options"
                v-bind="{group:{ name:'options'}, ghostClass: 'ghost',handle: '.drag-item'}"
                handle=".drag-item"
              >
                <li v-for="(item, index) in data.options.options" :key="index">
                  <Radio :label="item.value" style="margin-right: 5px;">
                    <Input
                      :style="{'width': data.options.showLabel? '90px': '180px' }"
                      size="mini"
                      v-model="item.value"
                    ></Input>
                    <Input
                      style="width:90px;"
                      size="mini"
                      v-if="data.options.showLabel"
                      v-model="item.label"
                    ></Input>
                    <!-- <input v-model="item.value"/> -->
                  </Radio>
                  <i class="drag-item" style="font-size: 16px;margin: 0 5px;cursor: move;">
                    <i class="iconfont icon-icon_bars"></i>
                  </i>
                  <el-button
                    @click="handleOptionsRemove(index)"
                    circle
                    plain
                    type="danger"
                    size="mini"
                    icon="el-icon-minus"
                    style="padding: 4px;margin-left: 5px;"
                  ></el-button>
                </li>
              </draggable>
            </RadioGroup>
          </template>

          <template v-if="data.type=='checkbox' || (data.type=='select' && data.options.multiple)">
            <CheckboxGroup v-model="data.options.defaultValue">
              <draggable
                tag="ul"
                :list="data.options.options"
                v-bind="{group:{ name:'options'}, ghostClass: 'ghost',handle: '.drag-item'}"
                handle=".drag-item"
              >
                <li v-for="(item, index) in data.options.options" :key="index">
                  <Checkbox :label="item.value" style="margin-right: 5px;">
                    <Input
                      :style="{'width': data.options.showLabel? '90px': '180px' }"
                      size="mini"
                      v-model="item.value"
                    ></Input>
                    <Input
                      style="width:90px;"
                      size="mini"
                      v-if="data.options.showLabel"
                      v-model="item.label"
                    ></Input>
                  </Checkbox>
                  <i class="drag-item" style="font-size: 16px;margin: 0 5px;cursor: move;">
                    <i class="iconfont icon-icon_bars"></i>
                  </i>
                  <el-button
                    @click="handleOptionsRemove(index)"
                    circle
                    plain
                    type="danger"
                    size="mini"
                    icon="el-icon-minus"
                    style="padding: 4px;margin-left: 5px;"
                  ></el-button>
                </li>
              </draggable>
            </CheckboxGroup>
          </template>
          <div style="margin-left: 22px;">
            <el-button type="text" @click="handleAddOption">添加选项</el-button>
          </div>
        </template>
      </FormItem>

      <FormItem label="远端数据" v-if="data.type=='cascader'">
        <div>
          <Input size="mini" style v-model="data.options.remoteFunc">
            <template slot="prepend">远端方法</template>
          </Input>
          <Input size="mini" style v-model="data.options.props.value">
            <template slot="prepend">值</template>
          </Input>
          <Input size="mini" style v-model="data.options.props.label">
            <template slot="prepend">标签</template>
          </Input>
          <Input size="mini" style v-model="data.options.props.children">
            <template slot="prepend">子选项</template>
          </Input>
        </div>
      </FormItem>

      <FormItem
        label="默认值"
        v-if="Object.keys(data.options).indexOf('defaultValue')>=0 && (data.type == 'textarea' || data.type == 'input' || data.type=='rate' || data.type=='color' || data.type=='switch')"
      >
        <Input
          v-if="data.type=='textarea'"
          type="textarea"
          :rows="5"
          v-model="data.options.defaultValue"
        ></Input>
        <Input v-if="data.type=='input'" v-model="data.options.defaultValue"></Input>
        <el-rate
          v-if="data.type == 'rate'"
          style="display:inline-block;vertical-align: middle;"
          :max="data.options.max"
          :allow-half="data.options.allowHalf"
          v-model="data.options.defaultValue"
        ></el-rate>
        <el-button
          type="text"
          v-if="data.type == 'rate'"
          style="display:inline-block;vertical-align: middle;margin-left: 10px;"
          @click="data.options.defaultValue=0"
        >清空</el-button>
        <el-color-picker
          v-if="data.type == 'color'"
          v-model="data.options.defaultValue"
          :show-alpha="data.options.showAlpha"
        ></el-color-picker>
        <Switch v-if="data.type=='switch'" v-model="data.options.defaultValue"></Switch>
      </FormItem>

      <template v-if="data.type == 'time' || data.type == 'date'">
        <FormItem label="显示类型" v-if="data.type == 'date'">
          <Select v-model="data.options.type">
            <Option value="year"></Option>
            <Option value="month"></Option>
            <Option value="date"></Option>
            <Option value="dates"></Option>
            <!-- <Option value="week"></Option> -->
            <Option value="datetime"></Option>
            <Option value="datetimerange"></Option>
            <Option value="daterange"></Option>
          </Select>
        </FormItem>
        <FormItem label="是否为范围选择" v-if="data.type == 'time'">
          <Switch v-model="data.options.isRange"></Switch>
        </FormItem>
        <FormItem label="是否获取时间戳" v-if="data.type == 'date'">
          <Switch v-model="data.options.timestamp"></Switch>
        </FormItem>
        <FormItem
          label="提示文字"
          v-if="(!data.options.isRange && data.type == 'time') || (data.type != 'time' && data.options.type != 'datetimerange' && data.options.type != 'daterange')"
        >
          <Input v-model="data.options.placeholder"></Input>
        </FormItem>
        <FormItem
          label="开始时间提示文字"
          v-if="(data.options.isRange) || data.options.type=='datetimerange' || data.options.type=='daterange'"
        >
          <Input v-model="data.options.startPlaceholder"></Input>
        </FormItem>
        <FormItem
          label="结束时间提示文字"
          v-if="data.options.isRange || data.options.type=='datetimerange' || data.options.type=='daterange'"
        >
          <Input v-model="data.options.endPlaceholder"></Input>
        </FormItem>
        <FormItem label="格式">
          <Input v-model="data.options.format"></Input>
        </FormItem>
        <FormItem
          label="默认值"
          v-if="data.type=='time' && Object.keys(data.options).indexOf('isRange')>=0"
        >
          <el-time-picker
            key="1"
            style="width: 100%;"
            v-if="!data.options.isRange"
            v-model="data.options.defaultValue"
            :arrowControl="data.options.arrowControl"
            :value-format="data.options.format"
          ></el-time-picker>
          <el-time-picker
            key="2"
            v-if="data.options.isRange"
            style="width: 100%;"
            v-model="data.options.defaultValue"
            is-range
            :arrowControl="data.options.arrowControl"
            :value-format="data.options.format"
          ></el-time-picker>
        </FormItem>
      </template>

      <template v-if="data.type=='imgupload'">
        <FormItem label="最大上传数">
          <Input type="number" v-model.number="data.options.length"></Input>
        </FormItem>
        <FormItem label="使用七牛上传">
          <Switch v-model="data.options.isQiniu"></Switch>
        </FormItem>
        <template v-if="data.options.isQiniu">
          <FormItem label="Domain" :required="true">
            <Input v-model="data.options.domain"></Input>
          </FormItem>
          <FormItem label="获取七牛Token方法" :required="true">
            <Input v-model="data.options.tokenFunc"></Input>
          </FormItem>
        </template>
        <template v-else>
          <FormItem label="图片上传地址" :required="true">
            <Input v-model="data.options.action"></Input>
          </FormItem>
        </template>
      </template>

      <template v-if="data.type=='blank'">
        <FormItem label="绑定数据类型">
          <Select v-model="data.options.defaultType">
            <Option value="String" label="字符"></Option>
            <Option value="Object" label="对象"></Option>
            <Option value="Array" label="数组"></Option>
          </Select>
        </FormItem>
      </template>

      <template v-if="data.type == 'grid'">
        <FormItem label="栅格间隔">
          <Input type="number" v-model.number="data.options.gutter"></Input>
        </FormItem>
        <FormItem label="列配置项">
          <draggable
            tag="ul"
            :list="data.columns"
            v-bind="{group:{ name:'options'}, ghostClass: 'ghost',handle: '.drag-item'}"
            handle=".drag-item"
          >
            <li v-for="(item, index) in data.columns" :key="index">
              <i class="drag-item" style="font-size: 16px;margin: 0 5px;cursor: move;">
                <i class="iconfont icon-icon_bars"></i>
              </i>
              <Input
                placeholder="栅格值"
                size="mini"
                style="width: 100px;"
                type="number"
                v-model.number="item.span"
              ></Input>

              <el-button
                @click="handleOptionsRemove(index)"
                circle
                plain
                type="danger"
                size="mini"
                icon="el-icon-minus"
                style="padding: 4px;margin-left: 5px;"
              ></el-button>
            </li>
          </draggable>
          <div style="margin-left: 22px;">
            <el-button type="text" @click="handleAddColumn">添加列</el-button>
          </div>
        </FormItem>
        <FormItem label="水平排列方式">
          <Select v-model="data.options.justify">
            <Option value="start" label="左对齐"></Option>
            <Option value="end" label="右对齐"></Option>
            <Option value="center" label="居中"></Option>
            <Option value="space-around" label="两侧间隔相等"></Option>
            <Option value="space-between" label="两端对齐"></Option>
          </Select>
        </FormItem>
        <FormItem label="垂直排列方式">
          <Select v-model="data.options.align">
            <Option value="top" label="顶部对齐"></Option>
            <Option value="middle" label="居中"></Option>
            <Option value="bottom" label="底部对齐"></Option>
          </Select>
        </FormItem>
      </template>

      <template v-if="data.type != 'grid'">
        <FormItem label="数据绑定Key">
          <Input v-model="data.field"></Input>
        </FormItem>
        <FormItem label="操作属性">
          <Checkbox
            v-model="data.options.readonly"
            v-if="Object.keys(data.options).indexOf('readonly')>=0"
          >完全只读</Checkbox>
          <Checkbox
            v-model="data.options.disabled"
            v-if="Object.keys(data.options).indexOf('disabled')>=0"
          >禁用</Checkbox>
          <Checkbox
            v-model="data.options.editable"
            v-if="Object.keys(data.options).indexOf('editable')>=0"
          >文本框可输入</Checkbox>
          <Checkbox
            v-model="data.options.clearable"
            v-if="Object.keys(data.options).indexOf('clearable')>=0"
          >显示清除按钮</Checkbox>
          <Checkbox
            v-model="data.options.arrowControl"
            v-if="Object.keys(data.options).indexOf('arrowControl')>=0"
          >使用箭头进行时间选择</Checkbox>
          <Checkbox
            v-model="data.options.isDelete"
            v-if="Object.keys(data.options).indexOf('isDelete')>=0"
          >删除</Checkbox>
          <Checkbox
            v-model="data.options.isEdit"
            v-if="Object.keys(data.options).indexOf('isEdit')>=0"
          >编辑</Checkbox>
        </FormItem>
        <FormItem label="校验">
          <div>
            <Checkbox v-model="data.options.required">必填</Checkbox>
          </div>
          <Select
            v-if="Object.keys(data.options).indexOf('dataType')>=0"
            v-model="data.options.dataType"
            size="mini"
          >
            <Option value="string" label="字符串"></Option>
            <Option value="number" label="数字"></Option>
            <Option value="boolean" label="布尔值"></Option>
            <Option value="integer" label="整数"></Option>
            <Option value="float" label="浮点数"></Option>
            <Option value="url" label="URL地址"></Option>
            <Option value="email" label="邮箱地址"></Option>
            <Option value="hex" label="十六进制"></Option>
          </Select>

          <div v-if="Object.keys(data.options).indexOf('pattern')>=0">
            <Input
              size="mini"
              v-model.lazy="data.options.pattern"
              style=" width: 240px;"
              placeholder="填写正则表达式"
            ></Input>
          </div>
        </FormItem>
      </template>
    </Form>
  </div>
</template>

<script>
import Draggable from "vuedraggable";

export default {
  components: {
    Draggable
  },
  props: ["data"],
  data() {
    return {
      validator: {
        type: null,
        required: null,
        pattern: null,
        range: null,
        length: null
      }
    };
  },
  computed: {
    show() {
      if (this.data && Object.keys(this.data).length > 0) {
        return true;
      }
      return false;
    }
  },
  methods: {
    handleOptionsRemove(index) {
      if (this.data.type === "grid") {
        this.data.columns.splice(index, 1);
      } else {
        this.data.options.options.splice(index, 1);
      }
    },
    handleAddOption() {
      if (this.data.options.showLabel) {
        this.data.options.options.push({
          value: "新选项",
          label: "新选项"
        });
      } else {
        this.data.options.options.push({
          value: "新选项"
        });
      }
    },
    handleAddColumn() {
      this.data.columns.push({
        span: "",
        list: []
      });
    },
    generateRule() {
      this.data.rules = [];
      Object.keys(this.validator).forEach(key => {
        if (this.validator[key]) {
          this.data.rules.push(this.validator[key]);
        }
      });
    },
    handleSelectMuliple(value) {
      if (value) {
        if (this.data.options.defaultValue) {
          this.data.options.defaultValue = [this.data.options.defaultValue];
        } else {
          this.data.options.defaultValue = [];
        }
      } else {
        if (this.data.options.defaultValue.length > 0) {
          this.data.options.defaultValue = this.data.options.defaultValue[0];
        } else {
          this.data.options.defaultValue = "";
        }
      }
    },

    validateRequired(val) {
      if (val) {
        this.validator.required = {
          required: true,
          message: `${this.data.name}必须填写`
        };
      } else {
        this.validator.required = null;
      }

      this.$nextTick(() => {
        this.generateRule();
      });
    },

    validateDataType(val) {
      if (!this.show) {
        return false;
      }

      if (val) {
        this.validator.type = {
          type: val,
          message: this.data.name + "格式不正确"
        };
      } else {
        this.validator.type = null;
      }

      this.generateRule();
    },
    valiatePattern(val) {
      if (!this.show) {
        return false;
      }

      if (val) {
        this.validator.pattern = {
          pattern: val,
          message: this.data.name + "格式不匹配"
        };
      } else {
        this.validator.pattern = null;
      }

      this.generateRule();
    }
  },
  watch: {
    "data.options.isRange": function(val) {
      if (typeof val !== "undefined") {
        if (val) {
          this.data.options.defaultValue = null;
        } else {
          if (Object.keys(this.data.options).indexOf("defaultValue") >= 0)
            this.data.options.defaultValue = "";
        }
      }
    },
    "data.options.required": function(val) {
      this.validateRequired(val);
    },
    "data.options.dataType": function(val) {
      this.validateDataType(val);
    },
    "data.options.pattern": function(val) {
      this.valiatePattern(val);
    },
    "data.name": function(val) {
      if (this.data.options) {
        this.validateRequired(this.data.options.required);
        this.validateDataType(this.data.options.dataType);
        this.valiatePattern(this.data.options.pattern);
      }
    }
  }
};
</script>
