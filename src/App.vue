<template>
  <div :class="!active ?'main-white':'main-dark'">
    <div class="main-head">
      <div class="title">Mapper/DTO生成器</div>
      <div style="margin-right: 20px">
      </div>
    </div>
    <div class="content-box">
      <div>
        <div>数据库地址
        </div>
        <div>用户名</div>
        <div>密码</div>
      </div>
      <div>
        <div>库名</div>
        <div>表名</div>
      </div>

      <div class="content">
        <div class="content-left">
          <div class="content-head">Mapper</div>
          <div class="content-body">

          </div>
        </div>
        <div class="content-right">
          <div class="content-head">Entity</div>
          <div class="content-body">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from "./api/index"
export default {
  name: 'App',
  data(){
    return{
      active: true
    }
  },
  created() {
    this.getInfo()
  },
  methods:{
    async getInfo(){
      let response = await api.getMapperEntityInfo({
        ip:"localhost",
        userName:"root",
        password:"123456",
        tableSchema:"test",
        tableName:"schema_infos"
      })
      console.log(response)
    }
  }

}
</script>

<style lang="less">
.content-basic{
  padding: 20px;
  margin: 0 auto;
  font-size: 28px;
}
html,body{
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
</style>
