<template>
  <div class="form-config-container">
    <Form label-position="top">
      <FormItem label="单据模版名称">
        <Input v-model="data.name"></Input>
      </FormItem>
      <FormItem label="描述">
        <Input v-model="data.descrpiton"></Input>
      </FormItem>
      <FormItem label="标签对齐方式">
        <RadioGroup v-model="data.labelPosition">
          <Radio label="left">左对齐</Radio>
          <Radio label="right">右对齐</Radio>
          <Radio label="top">顶部对齐</Radio>
        </RadioGroup>
      </FormItem>

      <FormItem label="名称显示宽度">
        <InputNumber v-model="data.labelWidth" :min="0" :max="200" :step="10"></InputNumber>
      </FormItem>

      <FormItem label="组件大小">
        <RadioGroup v-model="data.size">
          <Radio label="medium">中</Radio>
          <Radio label="small">小</Radio>
          <Radio label="mini">最小</Radio>
        </RadioGroup>
      </FormItem>
    </Form>
  </div>
</template>

<script>

import { InputNumber, RadioGroup, Radio,Input} from 'view-design';


export default {
  props: ["data"],
  components: {
    InputNumber,
    RadioGroup,
    Radio,
    Input
  },
};
</script>
