<template>
    <Layout class="layout">
      <Header>
          <Button
                v-if="upload"
                size="default"
                icon="el-icon-upload2"
                @click="handleUpload"
              >导入JSON</Button>
              <Button v-if="clearable" size="default" icon="el-icon-delete" @click="handleClear">清空</Button>
              <Button v-if="preview" size="default" icon="el-icon-view" @click="handlePreview">预览</Button>
              <Button
                v-if="generateJson"
                size="default"
                icon="el-icon-tickets"
                @click="handleGenerateJson"
              >生成JSON</Button>
              <Button
                v-if="generateCode"
                size="default"
                icon="el-icon-document"
                @click="handleGenerateCode"
              >生成代码</Button>
      </Header>
      <Layout>
      <Sider hide-trigger :style="{background: '#fff'}">
        <div class="components-list">
          <div class="widget-cate">基础字段</div>
          <draggable
            tag="ul"
            :list="basicComponents"
            v-bind="{group:{ name:'people', pull:'clone',put:false},sort:false, ghostClass: 'ghost'}"
            @end="handleMoveEnd"
            @start="handleMoveStart"
            :move="handleMove"
          >
            <li
              class="form-edit-widget-label"
              v-for="(item, index) in basicComponents"
              :key="index"
            >
              <a>
                <i class="icon iconfont" :class="item.icon"></i>
                <span>{{item.name}}</span>
              </a>
            </li>
          </draggable>

          <div class="widget-cate">布局字段</div>
          <draggable
            tag="ul"
            :list="layoutComponents"
            v-bind="{group:{ name:'people', pull:'clone',put:false},sort:false, ghostClass: 'ghost'}"
            @end="handleMoveEnd"
            @start="handleMoveStart"
            :move="handleMove"
          >
            <li
              class="form-edit-widget-label data-grid"
              v-for="(item, index) in layoutComponents"
              :key="index"
            >
              <a>
                <i class="icon iconfont" :class="item.icon"></i>
                <span>{{item.name}}</span>
              </a>
            </li>
          </draggable>
        </div>
      </Sider>
      <Layout>
        <Content  :style="{ minHeight: '280px', background: '#fff',margin:'4px'}">
            <Tabs>
              <TabPane label="设计" name="name1">
                <DesignSurface
                  v-if="!resetJson"
                  ref="widgetForm"
                  :data="widgetForm"
                  :select.sync="widgetFormSelect"
                ></DesignSurface>
              </TabPane>
              <TabPane label="预览" name="name2">
                <runtime-form
                insite="true"
                @on-change="handleDataChange"
                :data="widgetForm"
                :value="widgetModels"
                :remote="remoteFuncs"
                ref="runtimeForm"
                >
                <template v-slot:blank="scope">
                宽度：
                <Input v-model="scope.model.blank.width" style="width: 100px"></Input>高度：
                <Input v-model="scope.model.blank.height" style="width: 100px"></Input>
                </template>
                </runtime-form>

                <template slot="action">
                <Button type="primary" @click="handleTest">获取数据</Button>
                <Button @click="handleReset">重置</Button>
                </template>
              </TabPane>
            </Tabs>
        </Content>
        <Sider width="300" hide-trigger :style="{background: '#fff',margin: '4px'}">
          <Tabs value="name1">
            <TabPane label="字段属性" name="name1" style="padding:8px;">
              <ComponentOptions :data="widgetFormSelect"></ComponentOptions>
            </TabPane>
            <TabPane label="表单属性" name="name2" style="padding:8px;">
              <form-config :data="widgetForm.config"></form-config>
            </TabPane>
          </Tabs>

          <el-header v-if="false" height="45px">
            <div
              class="config-tab"
              :class="{active: configTab=='widget'}"
              @click="handleConfigSelect('widget')"
            ></div>
            <div
              class="config-tab"
              :class="{active: configTab=='form'}"
              @click="handleConfigSelect('form')"
            ></div>
          </el-header>
          <el-main v-if="false" class="config-content"></el-main>
        </Sider>
      </Layout>
        <el-container v-if="false" class="fm2-container">
      <el-main class="fm2-main">
        <el-container>
          <el-aside width="250px"></el-aside>
          <el-container class="center-container" direction="vertical">
            <el-header class="btn-bar" style="height: 45px;">
              <slot name="action"></slot>
            
            </el-header>
            <el-main :class="{'widget-empty': widgetForm.Components.length == 0}"></el-main>
          </el-container>

          <cus-dialog
            :visible="previewVisible"
            @on-close="previewVisible = false"
            ref="widgetPreview"
            width="1000px"
            form
          >
           
          </cus-dialog>

          <cus-dialog
            :visible="uploadVisible"
            @on-close="uploadVisible = false"
            @on-submit="handleUploadJson"
            ref="uploadJson"
            width="800px"
            form
          >
            <el-alert type="info" title="JSON格式如下，直接复制生成的json覆盖此处代码点击确定即可"></el-alert>
            <div id="uploadeditor" style="height: 400px;width: 100%;">{{jsonEg}}</div>
          </cus-dialog>

          <cus-dialog
            :visible="jsonVisible"
            @on-close="jsonVisible = false"
            ref="jsonPreview"
            width="800px"
            form
          >
            <div id="jsoneditor" style="height: 400px;width: 100%;">{{jsonTemplate}}</div>

            <template slot="action">
              <Button type="primary" class="json-btn" :data-clipboard-text="jsonCopyValue">复制数据</Button>
            </template>
          </cus-dialog>

          <cus-dialog
            :visible="codeVisible"
            @on-close="codeVisible = false"
            ref="codePreview"
            width="800px"
            form
            :action="false"
          >
            <div id="codeeditor" style="height: 500px; width: 100%;">{{htmlTemplate}}</div>
          </cus-dialog>
        </el-container>
      </el-main>
    </el-container>
    </Layout>
    </Layout>
  
</template>

<script>
import Draggable from "vuedraggable";
import ComponentOptions from "./ComponentOptions";
import FormConfig from "./FormConfig";
import DesignSurface from "./DesignSurface";
import runtimeForm from "./runtimeForm";
import Clipboard from "clipboard";
import CusDialog from "./CusDialog";

import {
  basicComponents,
  layoutComponents,
  advanceComponents
} from "./componentsConfig.js";
import { loadJs, loadCss } from "../util/index.js";
import request from "../util/request.js";
import generateCode from "./generateCode.js";

export default {
  name: "fm-form-designer",
  components: {
    Draggable,
    ComponentOptions,
    FormConfig,
    DesignSurface,
    CusDialog,
    runtimeForm
  },
  props: {
    preview: {
      type: Boolean,
      default: false
    },
    generateCode: {
      type: Boolean,
      default: false
    },
    generateJson: {
      type: Boolean,
      default: false
    },
    upload: {
      type: Boolean,
      default: false
    },
    clearable: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      basicComponents,
      layoutComponents,
      advanceComponents,
      resetJson: false,
      widgetForm: {
        Components: [],
        config: {
          labelWidth: 100,
          labelPosition: "right",
          size: "small"
        }
      },
      configTab: "widget",
      widgetFormSelect: null,
      previewVisible: false,
      jsonVisible: false,
      codeVisible: false,
      uploadVisible: false,
      remoteFuncs: {
        func_test(resolve) {
          setTimeout(() => {
            const options = [
              { id: "1", name: "1111" },
              { id: "2", name: "2222" },
              { id: "3", name: "3333" }
            ];

            resolve(options);
          }, 2000);
        },
        funcGetToken(resolve) {
          request
            .get("http://tools-server.xiaoyaoji.cn/api/uptoken")
            .then(res => {
              resolve(res.uptoken);
            });
        },
        upload_callback(response, file, fileList) {
          console.log("callback", response, file, fileList);
        }
      },
      widgetModels: {},
      blank: "",
      htmlTemplate: "",
      jsonTemplate: "",
      uploadEditor: null,
      jsonCopyValue: "",
      jsonClipboard: null,
      jsonEg: `{
  "Components": [
    {
      "type": "input",
      "name": "单行文本",
      "icon": "icon-input",
      "options": {
        "width": "100%",
        "defaultValue": "",
        "required": false,
        "dataType": "string",
        "pattern": "",
        "placeholder": "",
        "remoteFunc": "func_1540908864000_94322"
      },
      "key": "1540908864000_94322",
      "model": "input_1540908864000_94322",
      "rules": [
        {
          "type": "string",
          "message": "单行文本格式不正确"
        }
      ]
    },
    {
      "type": "textarea",
      "name": "多行文本",
      "icon": "icon-diy-com-textarea",
      "options": {
        "width": "100%",
        "defaultValue": "",
        "required": false,
        "pattern": "",
        "placeholder": "",
        "remoteFunc": "func_1540908876000_19435"
      },
      "key": "1540908876000_19435",
      "model": "textarea_1540908876000_19435",
      "rules": []
    }
  ],
  "config": {
    "labelWidth": 100,
    "labelPosition": "top",
    "size": "small"
  }
}`
    };
  },
  mounted() {},
  methods: {
    handleConfigSelect(value) {
      this.configTab = value;
    },
    handleMoveEnd(evt) {
      console.log("end", evt);
    },
    handleMoveStart({ oldIndex }) {
      console.log("start", oldIndex, this.basicComponents);
    },
    handleMove() {
      return true;
    },
    handlePreview() {
      console.log(this.widgetForm);
      this.previewVisible = true;
    },
    handleTest() {
      this.$refs.runtimeForm
        .getData()
        .then(data => {
          this.$alert(data, "").catch(e => {});
          this.$refs.widgetPreview.end();
        })
        .catch(e => {
          this.$refs.widgetPreview.end();
        });
    },
    handleReset() {
      this.$refs.runtimeForm.reset();
    },
    handleGenerateJson() {
      this.jsonVisible = true;
      this.jsonTemplate = this.widgetForm;
      console.log(JSON.stringify(this.widgetForm));
      this.$nextTick(() => {
        if (!this.jsonClipboard) {
          this.jsonClipboard = new Clipboard(".json-btn");
          this.jsonClipboard.on("success", e => {
            this.$message.success("复制成功");
          });
        }
        this.jsonCopyValue = JSON.stringify(this.widgetForm);
      });
    },
    handleGenerateCode() {
      this.codeVisible = true;
      this.htmlTemplate = generateCode(JSON.stringify(this.widgetForm));
      this.$nextTick(() => {});
    },
    handleUpload() {
      this.uploadVisible = true;
      this.$nextTick(() => {
        //this.uploadEditor = ace.edit("uploadeditor");
        //this.uploadEditor.session.setMode("ace/mode/json");
      });
    },
    handleUploadJson() {
      //try {
      //this.setJSON(JSON.parse(this.uploadEditor.getValue()));
      // this.uploadVisible = false;
      // } catch (e) {
      //  this.$message.error(e.message);
      //  this.$refs.uploadJson.end();
      //}
    },
    handleClear() {
      this.widgetForm = {
        Components: [],
        config: {
          labelWidth: 100,
          labelPosition: "right",
          size: "small",
          customClass: ""
        }
      };

      this.widgetFormSelect = {};
    },
    getJSON() {
      return this.widgetForm;
    },
    getHtml() {
      return generateCode(JSON.stringify(this.widgetForm));
    },
    setJSON(json) {
      this.widgetForm = json;

      if (json.list.length > 0) {
        this.widgetFormSelect = json.list[0];
      }
    },
    handleInput(val) {
      console.log(val);
      this.blank = val;
    },
    handleDataChange(field, value, data) {
      console.log(field, value, data);
    }
  },
  watch: {
    widgetForm: {
      deep: true,
      handler: function(val) {
        console.log(this.$refs.widgetForm);
      }
    }
  }
};
</script>

<style lang="scss">
.widget-empty {
  background-position: 50%;
}
.demo-tabs-style1 > .ivu-tabs-card > .ivu-tabs-content {
  height: 120px;
}

.demo-tabs-style1 > .ivu-tabs-card > .ivu-tabs-content > .ivu-tabs-tabpane {
  background: #fff;
}

.demo-tabs-style1 > .ivu-tabs.ivu-tabs-card > .ivu-tabs-bar .ivu-tabs-tab {
  border-color: transparent;
  margin-bottom: 100px;
}

.demo-tabs-style1 > .ivu-tabs-card > .ivu-tabs-bar .ivu-tabs-tab-active {
  border-color: #fff;
}
.layout{
    border: 1px solid #d7dde4;
    background: #f5f7f9;
    position: relative;
    border-radius: 4px;
    overflow: hidden;
    height: 100%;
}
</style>
