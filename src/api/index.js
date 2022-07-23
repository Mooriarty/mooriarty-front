import request from '@/axios/permissions.ts'
export default {
    getMapperEntityInfo(data){
        return request({
            url:'/mooriarty/sqlMapperEntity',
            method:'post',
            data:{...data}
        })
    }
}