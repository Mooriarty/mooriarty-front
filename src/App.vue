<template>
  <div :class="!active ?'main-white':'main-dark'">
    <div class="main-head">
      <div class="title">Mapper/DTO生成器</div>
      <div style="margin-right: 20px">
      </div>
    </div>
    <div class="content-box">
        <el-form :model="dbSearchContent" :inline="true" style="display: flex;justify-content: center;margin-top: 60px">
          <el-form-item prop="dbIp" label="数据库地址">
            <el-input v-model.trim="dbSearchContent.dbIp"></el-input>
          </el-form-item>
          <el-form-item prop="userName" label="用户名">
            <el-input v-model.trim="dbSearchContent.userName"></el-input>
          </el-form-item>
          <el-form-item prop="dbPassword" label="密码">
            <el-input v-model.trim="dbSearchContent.dbPassword"></el-input>
          </el-form-item>
        </el-form>
        <el-form :model="schemaSearchContent" :inline="true" style="display: flex;justify-content: center;margin-top: 10px">
          <el-form-item prop="dbIp" label="数据库名称">
            <el-input v-model.trim="schemaSearchContent.dbName"></el-input>
          </el-form-item>
          <el-form-item prop="userName" label="数据库表名">
            <el-input v-model.trim="schemaSearchContent.dbSchema"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button icon="el-icon-search" circle @click="getInfo" style="margin-left: 10px"></el-button>
          </el-form-item>
        </el-form>
      <div class="content">
        <div class="content-left">
          <div class="content-head">Mapper.XML</div>
          <div class="content-body">
            <prism-editor
                class="my-editor height-300"
                v-model="mapperXML"
                aria-disabled
                :highlight="xmlHighlighter"
                line-numbers
                :readonly="true"
                :tabSize="4"
            ></prism-editor>
          </div>
        </div>
        <div class="content-right">
          <div class="content-head">EntityDTO</div>
          <div class="content-body">
            <prism-editor
                class="my-editor height-300"
                v-model="entityDTO"
                aria-disabled
                :highlight="javaHighlighter"
                line-numbers
                :readonly="true"
                :tabSize="4"
            ></prism-editor>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from "./api/index"
import { PrismEditor } from "vue-prism-editor";
import "vue-prism-editor/dist/prismeditor.min.css";
import { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-java";
import "prismjs/themes/prism-tomorrow.css";
export default {
  name: 'App',
  data(){
    return{
      active: true,
      content:[],
      entityDTOList:[],
      mapperXMLList:[],
      entityDTO:'',
      mapperXML:'',
      dbSearchContent:{
        dbIp:'',
        userName:'',
        dbPassword:''
      },
      schemaSearchContent:{
        dbName:'',
        dbSchema:''
      }
    }
  },
  created() {
    if(localStorage.getItem('schemaInfo')){
      const{dbIp,userName,dbPassword,dbName,dbSchema} = JSON.parse(localStorage.getItem('schemaInfo'))
      this.dbSearchContent.dbIp = dbIp
      this.dbSearchContent.userName = userName
      this.dbSearchContent.dbPassword = dbPassword
      this.schemaSearchContent.dbName = dbName
      this.schemaSearchContent.dbSchema = dbSchema
    }
  },
  methods:{
    javaHighlighter(code) {
      return highlight(code,languages.java,'java'); //returns html
    },
    xmlHighlighter(code) {
      return highlight(code,languages.java,'java'); //returns html
    },
    async getInfo(event){
      let target = event.target
      if(target.nodeName === 'I' || target.nodeName ==='SPAN'){
        target = event.target.parentNode
      }
      target.blur()
      this.mapperXMLList = []
      this.entityDTOList = []
      localStorage.setItem('schemaInfo',JSON.stringify({...this.dbSearchContent,...this.schemaSearchContent}))
      try{
        const {dbIp:ip,userName,dbPassword:password} = this.dbSearchContent
        const {dbName:tableSchema,dbSchema:tableName} = this.schemaSearchContent
        if(ip && userName && password && tableSchema && tableName){
          let response = await api.getMapperEntityInfo({
            ip,
            userName,
            password,
            tableSchema,
            tableName
          })
          this.content = response.data.content
          response.data.content.forEach((item) => {
            let tableNameArr = item['COLUMN_NAME'].toLocaleLowerCase().split('_')
            for (let i = 1; i < tableNameArr.length; i++) {
              tableNameArr[i] = tableNameArr[i].charAt(0).toLocaleUpperCase() + tableNameArr[i].substring(1)
            }
            item['COLUMN_JAVA_NAME'] = `${tableNameArr.join('')}`
          })

          this.mapperXMLList.push(`<resultMap type="" id="">`)
          this.content.forEach(item=>{
            if((item['COLUMN_COMMENT']??'')!==''){
              this.entityDTOList.push(`// ${item['COLUMN_COMMENT']}`)
            }
            this.entityDTOList.push(`private ${this.columnsTypeMapper(item['DATA_TYPE'])} ${item['COLUMN_JAVA_NAME']};`)
            if ((item['COLUMN_KEY']??'')!==''){
              this.mapperXMLList.push(`    <id column="${item['COLUMN_NAME']}" property="${item['COLUMN_NAME']}" />`)
            }else{
              this.mapperXMLList.push(`    <result column="${item['COLUMN_NAME']}" property="${item['COLUMN_JAVA_NAME']}" />`)
            }
          })
          this.mapperXMLList.push(`</resultMap>`)
          this.mapperXML = this.mapperXMLList.join('\n')
          this.entityDTO = this.entityDTOList.join('\n')
        }

      }catch (e) {
        console.log()
      }
    }
  },
  computed:{
    columnsTypeMapper(){
      return sqlType => {
        let javaTypeMap = {
          "bigint":'BigInteger',
          "binary":'String',
          "bit":'Boolean',
          "blob":'byte[]',
          "char":'String',
          "date":'Date',
          "datetime":'Date',
          "decimal":'BigDecimal',
          "double":'double',
          "enum":'String',
          "float":'Float',
          "geometry":'String',
          "geometrycollection":'String',
          "int":'int',
          "integer":'int',
          "json":'String',
          "linestring":'String',
          "longblob":'byte[]',
          "longtext":'String',
          "mediumblob":'byte[]',
          "mediumint":'int',
          "mediumtext":'String',
          "multilinestring":'String',
          "multipoint":'String',
          "multipolygon":'String',
          "numeric":'int',
          "point":'String',
          "polygon":'String',
          "real":'double',
          "set":'String',
          "smallint":'int',
          "text":'String',
          "time":'Date',
          "timestamp":'Date',
          "tinyblob":'byte[]',
          "tinyint":'int',
          "tinytext":'String',
          "varbinary":'String',
          "varchar":'String',
          "year":'String'
        }
        return javaTypeMap[sqlType]
      }
    }
  },
  components:{
    PrismEditor
  }

}
</script>

<style lang="less" scoped>
.content-basic{
  padding: 20px;
  margin: 0 auto;
  font-size: 28px;
}
/deep/ html,body{
  margin: 0;
}
.main-dark{
  height: 100vh;
  background-color: rgb(16, 16, 20);
  color: rgba(255, 255, 255, 0.82);
  .main-head{
    height: 60px;
    border-bottom: 1px rgba(255, 255, 255, 0.09) solid;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
  .content-head{
    .content-basic();
    height: 80px;
    border: 1px rgba(255, 255, 255, 0.09) solid;
    background-color: rgb(24, 24, 28);
  }
  .content-body{
    min-height: 400px;
    background-color: rgb(24, 24, 28);
    border-left: 1px rgba(255, 255, 255, 0.09) solid;
    border-right: 1px rgba(255, 255, 255, 0.09) solid;
    border-bottom: 1px rgba(255, 255, 255, 0.09) solid;
  }
}
.main-white{
  height: 100vh;
  background-color: #fff;
  color: rgb(51, 54, 57);
  .main-head{
    height: 60px;
    border-bottom: 1px rgb(239, 239, 245) solid;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
  .content-head{
    .content-basic();
    height: 80px;
    border: 1px rgb(239, 239, 245) solid;
  }
  .content-body{
    min-height: 400px;
    border-left: 1px rgb(239, 239, 245) solid;
    border-right: 1px rgb(239, 239, 245) solid;
    border-bottom: 1px rgb(239, 239, 245) solid;
  }
}

.title{
  margin-left: 20px;
}
.content{
  padding: 40px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  .content-left{
    width: 60vh;
    margin-right: 20px;
    box-shadow: 0 1px 2px -2px rgba(0, 0, 0, 0.08), 0 3px 6px 0 rgba(0, 0, 0, 0.06), 0 5px 12px 4px rgba(0, 0, 0, 0.04);
  }
  .content-right{
    width: 60vh;
    box-shadow: 0 1px 2px -2px rgba(0, 0, 0, 0.08), 0 3px 6px 0 rgba(0, 0, 0, 0.06), 0 5px 12px 4px rgba(0, 0, 0, 0.04);
  }
}
.my-editor {
  background: rgb(24, 24, 28);
  color: #ccc;
  font-family: Fira code, Fira Mono, Consolas, Menlo, Courier, monospace;
  font-size: 14px;
  line-height: 1.5;
}

.prism-editor__textarea:focus {
  outline: none;
}
::v-deep .el-input .el-input__inner{
  background: rgb(24, 24, 28);
  border: 1px rgba(255, 255, 255, 0.09) solid;
  color: rgba(255, 255, 255, 0.82);
}
::v-deep .el-button {
  background: rgb(24, 24, 28);
  border: 1px rgba(255, 255, 255, 0.09) solid;
  &:hover{
    background: rgb(24, 24, 28);
    border: 1px rgba(255, 255, 255, 0.09) solid;
  }
  &:active{
    background: rgb(24, 24, 28);
    border: 1px rgba(255, 255, 255, 0.09) solid;
  }
}

</style>
<style lang="less">
html,body{
  margin: 0;
}
</style>
