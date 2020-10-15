<template>
  <div>
        <div>
            <el-upload
                style="margin-bottom:20px"
                :data="qiniu"
                :limit="1"
                multiple
                class="upload-demo"
                ref="uploadimg"
                action="http://upload.qiniup.com"
                list-type="picture"
                :on-success="upImgSuccess"
                :file-list="upImgList"
                :on-change="imgChange"
                :before-upload="upBefore"
                :auto-upload="false">
                <el-button  slot="trigger" size="small" type="primary">选取商品图片</el-button>
                <span style="margin-left:10px;font-size:12px;color:#F83244">是否设为主图：</span>
                <el-switch
                v-model="isDiagram"
                active-color="#13ce66"
                inactive-color="#cccccc">
                </el-switch>
                <span style="margin-left:20px">图片尺寸（宽高：1:1）</span>
            </el-upload>
            <el-button style="margin-left:0;width:100%;" slot="trigger" size="small" type="primary" @click="subImgPic">提交商品图</el-button>

            <el-upload
                style="margin-bottom:20px;margin-top:20px"
                :data="qiniuDetail"
                :limit="1"
                multiple
                class="upload-demo"
                ref="upDetailloadimg"
                action="http://upload.qiniup.com"
                list-type="picture"
                :on-success="upDetailImgSuccess"
                :file-list="upDetailImgList"
                :on-change="imgDetailChange"
                :before-upload="detailupBefore"
                :auto-upload="false">
                <el-button  slot="trigger" size="small" type="primary">选取商品参数图片</el-button>
                <span style="margin-left:20px">图片尺寸（宽：1200，高：不限）</span>
            </el-upload>
            <el-button style="margin-left:0;width:100%;" slot="trigger" size="small" type="primary" @click="subDetailPic">提交商品参数图</el-button>


            
        </div>

        

        <div class="shopImg">
            <!-- 商品图展示： -->
            <div style='line-height:40px;'>商品图展示：</div>
            <ul>
                <li v-for="(item,index) in detailObj.gooImgList" :key="index">
                    <img :src="qiniuH+item.gooImgUrl" alt="">
                    <p>图片状态：<span style="color:#F83244">{{item.isDiagram==1 ? '主图':'非主图'}}</span></p>
                    <div class="mengceng" @click="deletImg(item.goodsImgId,item.gooImgUrl)">
                        <i class="el-icon-delete"></i>
                    </div>
                </li>
            </ul>

            <!-- 商品详情图展示： -->
            <div style='line-height:40px;'>商品详情图展示：</div>
            <ul>
                <li class="detailImg-item" v-for="(item,index) in detailObj.parImgList" :key="index" style="">
                    <img :src="qiniuH+item.parImgUrl" alt="">
                    <div class="mengceng" @click="deletDetailImg(item.parameterImgId,item.parImgUrl)">
                        <i class="el-icon-delete"></i>
                    </div>
                </li>
            </ul>
        </div>
        <div style="font-size:20px;border-top:1px solid #cccccc;margin-top:20px;line-height:50px ">商品的详情展示:</div>
        <el-form :model="ruleForm" :rules="rules"   ref="ruleForm"  size='medium'    class="demo-ruleForm" style="margin-top:20px;">

            <ul class="formBox">
                <li>
                    <span style="margin">规格：</span>
                    <p style="display:flex"><i v-for="(item,index) in detailObj.speList" :key="index" class="form-input">{{item.specificationsValue}}</i></p>
                </li>
                
            </ul>
            <ul class="formBox" v-for="(item,index) in detailObj.spkList" :key="index">
                <li>
                    <span style="margin">{{item.spuName}}：</span>
                    <i v-for="(item2,index2) in item.skuList" :key="index2" style="margin">{{item2.skuValue}}</i>
                </li>
                
            </ul>	
            <ul class="formBox">
                <li style=""><span style="margin">订单状态：</span><el-input  v-bind:disabled="true" v-model="ruleForm.auditStatusStr" class="form-input"></el-input></li>
                <li style=""><span style="margin">品牌名称：</span><el-input  v-bind:disabled="true" v-model="ruleForm.brandName" class="form-input"></el-input></li>
            </ul>
            
            <ul class="formBox">
                <li style=""><span style="margin">是否上架:</span><el-input  v-bind:disabled="true" v-model="ruleForm.isRoostStr" class="form-input"></el-input></li>
                <li style=""><span style="margin">备注:</span><el-input v-bind:disabled="true" v-model="ruleForm.remarks" class="form-input"></el-input></li>
            </ul>
            <ul class="formBox">
                <li style=""><span style="margin">一级分类：</span><el-input v-bind:disabled="true" v-model="ruleForm.firstLevelName" class="form-input"></el-input></li>
                <li style=""><span style="margin">二级分类：</span><el-input v-bind:disabled="true" v-model="ruleForm.secondLevelName" class="form-input"></el-input></li>
            </ul>
            <ul class="formBox">
                <li style=""><span style="margin">三级分类：</span><el-input v-bind:disabled="true" v-model="ruleForm.threeLevelName" class="form-input"></el-input></li>
                
            </ul>

            <el-switch
            style="margin:10px 0 15px 30px"
            v-model="formStatus"
            @change="changeSwitch"
            active-text="修改表单"
            inactive-text="禁用表单">
            </el-switch>
            <!-- 可修改 -->
            <ul class="formBox">
                <li style=""><span style="margin">商品名称：</span><el-input :disabled="ifStopInput" v-model="ruleForm.goodsName" class="form-input"></el-input></li>
                <li style=""><span style="margin">商品重量：</span><el-input :disabled="ifStopInput" v-model="ruleForm.weight" class="form-input"></el-input></li>
            </ul>
            <ul class="formBox">
                <li style=""><span style="margin">原价格:</span><el-input :disabled="ifStopInput" v-model="ruleForm.price" class="form-input"></el-input></li>
                <li style=""><span style="margin">现价：</span><el-input :disabled="ifStopInput" v-model="ruleForm.adjustedPrice" class="form-input"></el-input></li>
                
            </ul>
            <!-- <ul class="formBox">
                <li style=""><span style="margin">是否包邮：</span><el-switch  :disabled="ifStopInput" style="margin-top:6px" v-model="ruleForm.isFree"></el-switch></li>
                <li v-show="ruleForm.isFree" style=""><span style="margin">邮费：</span><el-input :disabled="ifStopInput" v-model="ruleForm.postage" class="form-input"></el-input></li>
            </ul> -->



            





            </el-form>
            <div style="display:flex;width:100%;margin-top:10px" v-show="!ifStopInput">
                <el-button style="margin-left:0;width:100%;" slot="trigger" size="small" type="primary" @click="subForm">提交</el-button>
            </div>
        <div class="shopDetailImg">
            
        </div>
  </div>
</template>

<script>
import {getRequest,postRequest,putRequest,deleteRequest,patchRequest} from '@/utils/api';
import sessionStorage from '@/utils/sessionStorage'
import url from '@/utils/url';
import qs from 'qs'
export default {
    props:{
        goDetailId:{
            default:''
        }
    },
    data(){
        var validatenickPublic = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('输入框不能为空'));
            }else{
                callback();
            }

        };
        return {
            formStatus:false,
            ifStopInput:true,
            isDiagram:true,
            detailObj:{},
            qiniu:{
                upUrl:'',
                token:'',
            },
            qiniuDetail:{
                upUrl:'',
                token:'',
            },
            upImgList:[],
            upDetailImgList:[],
            tableList:[],
            qiniuH:url.qiniuH,
            ruleForm:{
                
            },
            rules: {
                title: [
                    { validator: validatenickPublic, trigger: 'blur' }
                ],
            },
            uploadNum:0,
            upDetailloadNum:0
        }
    },
    methods: {

        // 表单是否可以输入switch change时间
        changeSwitch(){
            console.log(this.formStatus)
            this.ifStopInput=!this.formStatus
        },
        // 提交表单
        subForm(){
            if(this.ruleForm.goodsName==''){
                this.$message.warning('商品名不能为空')
                return
            }
            if(this.ruleForm.weight==''){
                this.$message.warning('商品重量不能为空')
                return
            }
            if(this.ruleForm.price==''){
                this.$message.warning('商品价格不能为空')
                return
            }
            // return
            // if(this.ruleForm.isFree){
            //     if(this.ruleForm.postage==''){
            //         this.$message.warning('请输入邮费')
            //         return
            //     }
                
            // }
            postRequest(url.systemGooUpdateGoods, {
                jsonMap:JSON.stringify({
                    goodsId:this.goDetailId,
                    goodsName:this.ruleForm.goodsName,
                    price:this.ruleForm.price.toString(),
                    adjustedPrice:this.ruleForm.adjustedPrice==undefined ? this.ruleForm.price.toString():this.ruleForm.adjustedPrice.toString(),
                    weight:this.ruleForm.weight.toString(),
                    // isFree:this.ruleForm.isFree ? '1':'0',
                    // postage:this.ruleForm.isFree ? this.ruleForm.postage.toString():'',
                })
            }).then(data=> {
                this.uploadNum=0
                if(data.data.status!=1){
                    this.$message.success(data.data.message);
                    
                    return
                }


                
                console.log("添加成功数据",data.data.data)  
                this.upImgList=[]
                this.initDetail({
                    goodsId:this.goDetailId
                }) 
                this.$message.success('修改成功');
                this.$emit('sonMethond', {type:'show',dialogVisible:false})
            }); 
        },

        // 关闭弹窗 清空数据
        resetForms(){
            
            this.upImgList=[]
            this.upDetailImgList=[]
            this.$refs['ruleForm'].resetFields();
            this.formStatus=false
            this.ifStopInput=true
            // this.supList=[],
            // this.guigeList=[{guigeV:''}],
            // this.imgListLength=0
            // this.imgOtherLength=0
            // this.imgDetailListLength=0
            // this.upImgList=[],
            // this.upImgDetailList=[],
            // this.upImgOtherList=[],
            // this.spuParamList=[]
            // this.guigeList=[{guigeV:''}],
            // this.$refs['ruleForm'].resetFields();
        },
        /******************上传商品图片操作过程***************************/ 
        //商品图提交
        subImgPic(){

            this.$refs.uploadimg.submit();
        },
        // 上传上商品图片之前
        upBefore(file){
            let dates= new Date()
            return  this.qiniu.key=file.uid
        },
        // 商品图片改变
        imgChange(file, fileList) {
            this.imgListLength=fileList.length
            console.log("显示主图的长度",this.imgListLength)
            this.isChangeImg=true
        },
        // 上传商品图片成功
        upImgSuccess(response, file, fileList){
            console.log("55555555555555555",fileList)
            // this.getSuccessImgList.push
            

            this.uploadNum++
            if(this.uploadNum==this.imgListLength){
                let dataArr=[]
                fileList.forEach(v => {
                    // dataArr.push(v.uid)
                    dataArr.push({goodsId:this.goDetailId,imgUrl:v.uid,isDiagram:this.isDiagram ? 1 : 0})
                });
                
                this.addImgServer(dataArr)
            }

        } ,

        // 添加商品图片
        addImgServer(parmas){
            console.log("传给后台的数据",parmas)
            
            postRequest(url.systemGoodsImgSaveGoodsImg, parmas[0]).then(data=> {
                this.uploadNum=0
                if(data.data.status!=1){
                    this.$message.success(data.data.message);
                    
                    return
                }

                this.$message.success('商品图片添加成功');
                
                console.log("添加成功数据",data.data.data)  
                this.upImgList=[]
                this.initDetail({
                    goodsId:this.goDetailId
                }) 
            }); 
        },


        /******************上传商品详情图片操作过程***************************/ 
        // 提交商品图片详情
        subDetailPic(){
            this.$refs.upDetailloadimg.submit();
        },
        // 上传主图片之前
        detailupBefore(file){
            let dates= new Date()
            return  this.qiniuDetail.key=file.uid
        },
        // 主图片改变
        imgDetailChange(file, fileList) {
            this.imgDetailListLength=fileList.length
            console.log("显示主图的长度",this.imgDetailListLength)
            this.isChangeImg=true
        },
        // 上传主图片成功
        upDetailImgSuccess(response, file, fileList){
            console.log("55555555555555555",fileList)
            // this.getSuccessImgList.push
            

            this.upDetailloadNum++
            console.log(this.upDetailloadNum,this.imgDetailListLength)
            if(this.upDetailloadNum==this.imgDetailListLength){
                
                let dataArr=[]
                fileList.forEach(v => {
                    // dataArr.push(v.uid)
                    dataArr.push({goodsId:this.goDetailId,imgUrl:v.uid})
                });
                
                this.addDetailImgServer(dataArr)
            }

        } ,

        // 添加商品详情图片
        addDetailImgServer(parmas){
            console.log("传给后台的数据",parmas)
            postRequest(url.systemParameterImgSaveParameterImg, parmas[0]).then(data=> {
                this.upDetailloadNum=0
                if(data.data.status!=1){
                    this.$message.success(data.data.message);
                    
                    return
                }

                // this.initData(this.tableParams)
                // this.$refs['ruleForm'].resetFields();
                // this.dialogVisible=false
                console.log("添加成功数据",data.data.data)  
                this.upDetailImgList=[]
                this.$message.success('商品参数图片添加成功');
                this.initDetail({
                    goodsId:this.goDetailId
                }) 
            }); 
        },
        
        

        // 删除商品图片
        deletImg(id,img){
            
            postRequest(url.systemGoodsImgRemoveGoodsImg,{
                goodsImgId:id,
                gooImgUrl:img
            }).then(data=> {
                if(data.data.status!=1){
                    this.$message.success(data.data.message);
                    
                    return
                }
                console.log("删除后打印的数据",data)

                this.initDetail({
                    goodsId:this.goDetailId
                }) 
                this.$message({
                    type: 'success',
                    message: '删除成功'
                });        
                        

            }); 
            
        },
        // 删除详情商品图片
        deletDetailImg(id,img){
            
            postRequest(url.systemParameterImgRemoveParameterImg,{
                parameterImgId:id,
                parImgUrl:img
            }).then(data=> {
                if(data.data.status!=1){
                    this.$message.success(data.data.message);
                    
                    return
                }
                console.log("删除后打印的数据",data)

                this.initDetail({
                    goodsId:this.goDetailId
                }) 
                this.$message({
                    type: 'success',
                    message: '删除成功'
                });        
                        

            }); 
            
        },
        

        // 多选操作改变事件
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        showDetail(){
            console.log("父级传递的值",this.goDetailId)

            this.initDetail({
                goodsId:this.goDetailId
            })
        },
        initDetail(params){
            postRequest(url.systemGooGetGoodsDetatls, params).then(data=> {

                if(data.data.status!=1){
                    this.$message.success(data.data.message);
                    
                    return
                }
                let datas = data.data.data
                // datas.isFree= datas.isFree=="1"? true : false
                
                this.detailObj=datas
                this.ruleForm=datas
                console.log("详情初始化返回数据",data.data.data)     
                
            }); 
        },
    },
    created(){
        let upToken = sessionStorage.getSessionStorage('upToken')
        console.log("upToken",upToken)
        this.qiniu={
            token:upToken
        }
        this.qiniuDetail={
            token:upToken
        }
        
    }
}
</script>


<style lang="less" scoped>
    .formBox{
        display: flex;
        margin-bottom: 15px;
        li{
            display:flex;width:50%;
            margin-left: 2%;
            &:nth-child(1){
                margin-left: 0;
            }
            .form-input{
                flex: 1;
            }
            span{
                width: 90px;
                margin-right: 5px;
                line-height: 30px;
                text-align: right;
                
            }
            i{
                font-style: normal;
                margin-right: 15px;
                line-height: 30px;
            }
        }
    }
    .btn-box{
        width: 100%;
        display: flex;
        justify-content: space-between;
        margin: 30px 0 10px 0;
    }
    .shopImg{
        ul{
            display: flex;
            flex-wrap: wrap;
            li{
                border: 1px solid #cccccc;
                width: 120px;
                height: 145px;
                margin: 0 5px 5px 0;
                position: relative;
                cursor: pointer;
                img{
                    height: 120px;
                    width: 120px;
                }
                .mengceng{
                    display: none;
                }
                &:hover{
                    .mengceng{
                        
                        display: block;
                        position: absolute;
                        left: 0;
                        top: 0;
                        height: 100%;
                        width: 100%;
                        background: rgba(24, 21, 21, 0.11);
                        .el-icon-delete{
                            text-align: center;
                            font-size: 30px;
                            margin: 45px 0 0 45px;
                            color: white;
                        }
                    }
                }
                &.detailImg-item{
                    width: 120px;
                    height: 120px;
                }
            }
        }
    }
   
</style>
