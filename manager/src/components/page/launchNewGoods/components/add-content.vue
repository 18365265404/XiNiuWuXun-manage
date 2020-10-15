<template>
    <div>
        <!-- 列表图片 -->
            <div>商品主图片</div>
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
                :on-change="imgChange"
                :before-upload="upBefore"
                :file-list="upImgList"
                :auto-upload="false">
                <el-button  slot="trigger" size="small" type="primary">选取图片</el-button><span style="margin-left:20px">图片尺寸（宽高：1:1）</span>
            </el-upload>


            <div style="margin:10px 0; line-height:30px; border-bottom:1px solid #cccccc">商品其它图片</div>    
            <el-upload
                style="margin-bottom:20px"
                :data="qiniuOther"
                :limit="6"
                multiple
                class="upload-demo"
                ref="upOtherloadimg"
                action="http://upload.qiniup.com"
                list-type="picture"
                :on-success="upImgOtherSuccess"
                :on-change="imgOtherChange"
                :before-upload="upOtherBefore"
                :file-list="upImgOtherList"
                :auto-upload="false">
                <el-button  slot="trigger" size="small" type="primary">选取图片</el-button><span style="margin-left:20px">图片尺寸（宽高：1:1）</span>
            </el-upload>

            <div style="margin:10px 0; line-height:30px; border-bottom:1px solid #cccccc">商品详情图片</div>    
            <el-upload
                style="margin-bottom:20px"
                :data="qiniuDetail"
                :limit="5"
                multiple
                class="upload-demo"
                ref="upDetailloadimg"
                action="http://upload.qiniup.com"
                list-type="picture"
                :on-success="upImgDetailSuccess"
                :on-change="imgDetailChange"
                :before-upload="upDetailBefore"
                :file-list="upImgDetailList"
                :auto-upload="false">
                <el-button  slot="trigger" size="small" type="primary">选取图片</el-button><span style="margin-left:20px">图片尺寸（宽：1200，高：不限）</span>
            </el-upload>

            <el-form :model="ruleForm" :rules="rules"   ref="ruleForm"  size='medium'    class="demo-ruleForm">
				

            <el-form-item  prop="selectOneV" style="width:100%" >
                <el-select
                style="width:100%"
                v-model="ruleForm.selectOneV"
                @change="selectOneF()"

                placeholder="请选择一级分类">
                    <el-option
                    v-for="item in selectHeadList1"
                    :key="item.classifyId"
                    :label="item.classifyName"
                    :value="item.classifyId">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item  prop="selectTwoV" >
                <el-select
                style="width:100%"
                v-model="ruleForm.selectTwoV"
                @change="selectTwoF()"
                filterable
                allow-create
                
                placeholder="请选择二级分类">
                    <el-option
                    v-for="item in selectHeadList2"
                    :key="item.classifyId"
                    :label="item.classifyName"
                    :value="item.classifyId">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item  prop="selectThreeV" >
                <el-select
                @change="selectThreeF()"
                
                v-model="ruleForm.selectThreeV"
                filterable
                allow-create
                style="width:100%"
                placeholder="请选择三级分类">
                    <el-option
                    v-for="item in selectHeadList3"
                    :key="item.classifyId"
                    :label="item.classifyName"
                    :value="item.classifyId">
                    </el-option>
                </el-select>
            </el-form-item>       

            <el-form-item  prop="selecBrandV" >
                <el-select
                @change="selecBrandF()"
                
                v-model="ruleForm.selecBrandV"
                filterable
                allow-create
                style="width:100%"
                placeholder="请选择品牌">
                    <el-option
                    v-for="item in selectbrandList"
                    :key="item.brandId"
                    :label="item.brandName"
                    :value="item.brandId">
                    </el-option>
                </el-select>
            </el-form-item>  
    
            <!-- 创建规格 -->
            
            <div class="guigebox" style="">
                <div class="guigebox-item" v-for="(item, index) in guigeList"
                :key="index">
                    <el-input type="text"
                    class="guigebox-input"
                    v-model="item.guigeV"
                    style=""
                    placeholder="请输入规格"
                    />

                    <el-button
                    type="danger"
                    style="float:left;font-size:10px;margin-left:10px"
                    icon="el-icon-delete"
                    circle
                    @click="deletGuigeInput(index,index)"
                    v-show="index!=0"
                    ></el-button>

                    <el-button
                    
                    type="primary"
                    icon="el-icon-edit"
                    circle
                    v-show="guigeList.length-1==index"
                    @click="addGuigeInput(index)"
                    ></el-button>
                </div>
            </div>
            

            
            <div class="spuTitle">
                <p>SPU:<span style="color: red;">（请先勾选对应的SPU、SKU，若不足请补充）</span></p>
            </div>
            <div class="spuShowBox" >
                
                <ul>
                    <li class="spu-item" v-for="(item, index) in supList"
                    :key="index">
                        <div class="spu-item-left"><span>{{item.spuName}}</span></div>
                        <div class="spu-item-right">

                            <el-checkbox @change="spuCheckF(index,item2.checked)" style="margin:5px 5px 0 0px" v-for="(item2, index2) in item.skuList" :key="index2" v-model="item2.checked">{{item2.skuValue}}</el-checkbox>
                        </div>
                        <el-button type="text" size="small"  @click.native.prevent="updateSup(index,item)" >补充SKU</el-button>
                    </li>
                   
                    
                </ul>
            </div>
            <div>  
                <el-button @click="addBigInput"  slot="trigger" size="small" type="primary" style="margin:10px 0" >补充SPU、SKU</el-button>
                <div style='margin-bottom:20px' v-show="supTag!='other'">
                    <div v-show="supTag=='change'" style="margin:10px 0">
                        当前：补充SKU
                    </div>
                    <div v-show="supTag=='add'" style="margin:10px 0">
                        当前：补充SPU、SKU
                    </div>
                    
                    <el-form-item v-for="(item, index) in inputList"
                    :key="index"
                    class="spuInputBox"
                    label="">
                        <div class="inputSpuName" v-show="supTag=='add'">
                            <el-input type="text"
                            
                            v-model="item.spuName"
                            style=""
                            placeholder="请输入SPU"
                            />
                            
                        </div>
                        

                    <div class="inputSpuValue" style="">
                        <div class="inputSpuValue-item" v-for="(item2, index2) in item.list"
                            :key="index2">
                            <el-input type="text"
                                class="inputSpuValue-input"
                                v-model="item2.skuValue"
                                style=""
                                placeholder="请输入SPU对应的SKU"
                                />

                                <el-button
                                type="danger"
                                style="float:left;font-size:10px;margin-left:10px"
                                icon="el-icon-delete"
                                circle
                                @click="deletSmallInput(index,index2)"
                                ></el-button>

                                <el-button
                                
                                type="primary"
                                icon="el-icon-edit"
                                circle
                                v-show="item.list.length-1==index2"
                                @click="addSmallInput(index)"
                                ></el-button>
                        </div>
                    </div>

                        <div class="bigDelet">
                            <el-button
                            type="danger"
                            style="float:left;font-size:10px;margin-left:10px;opacity:0"
                            icon="el-icon-delete"
                            circle
                            @click="deletBigInput(index)"
                            ></el-button>
                        </div>
                    </el-form-item>

                    <el-button style="margin-left:0;width:100%;" slot="trigger" size="small" type="primary" @click="saveSpuF">补充</el-button>
                </div>
            </div>
            


            <!-- <el-form-item label="是否包邮">
                <el-switch v-model="ruleForm.isFree"></el-switch>
            </el-form-item> -->


            <!-- <el-form-item
            v-show="ruleForm.isFree"             
            prop="postage"
            >
                <el-input type="text"  placeholder="请输入邮费" v-model.number="ruleForm.postage" autocomplete="off">
                 <template slot="prepend"><i class="el-icon-edit"></i></template>
                </el-input>
            </el-form-item> -->

            <el-form-item             
            prop="goodsName"
            >
                <el-input type="text"  placeholder="请输入商品名" v-model="ruleForm.goodsName" autocomplete="off">
                 <template slot="prepend"><i class="el-icon-edit"></i></template>
                </el-input>
            </el-form-item>


            <el-form-item             
            prop="price"
            >
                <el-input type="text"  placeholder="请输入原价" v-model="ruleForm.price" autocomplete="off">
                 <template slot="prepend"><i class="el-icon-edit"></i></template>
                </el-input>
            </el-form-item>

            <el-form-item             
            prop="adjustedPrice"
            >
                <el-input type="text"  placeholder="请输入现价" v-model="ruleForm.adjustedPrice" autocomplete="off">
                 <template slot="prepend"><i class="el-icon-edit"></i></template>
                </el-input>
            </el-form-item>

            
            <el-form-item             
            prop="stockNum"
            >
                <el-input type="text"  placeholder="请输入商品数量" v-model="ruleForm.stockNum" autocomplete="off">
                 <template slot="prepend"><i class="el-icon-edit"></i></template>
                </el-input>
            </el-form-item>

            <el-form-item             
            prop="weight"
            >
                <el-input type="text"  placeholder="请输入重量" v-model="ruleForm.weight" autocomplete="off">
                 <template slot="prepend"><i class="el-icon-edit"></i></template>
                </el-input>
            </el-form-item>


            </el-form>


			
			
            <div style="display:flex;width:100%;margin-top:10px">
                <el-button style="margin-left:0;width:100%;" slot="trigger" size="small" type="primary" @click="subPicForm">提交</el-button>
            </div>
    </div>
</template>
<style lang="less" scoped>
.guigebox{
    display: flex;
    flex-wrap: wrap;
    .guigebox-item{
        width: 45%;
        display: flex;
        margin: 0 3% 10px 0;
        .guigebox-input{
            width: 80%;
        }
    }
    
}
.spuTitle{
    p{
        font-size: 20px;
        line-height: 30px;
    }
}
.spuInputBox{
    display: flex;
    overflow: hidden;
    .inputSpuName{
        float: left;
        display: flex;
        height: 100%;
        justify-content: center;
        flex-direction:column;
        width:30%;
        
        margin-right:2%
    }
    .inputSpuValue{
        width:350px;
        float: left;
        // border:1px solid #cccccc;
        display:flex;
        
        flex-wrap: wrap;
        padding: 10px 5px;
        .inputSpuValue-item{
            width: 100%;
            display: flex;
            margin: 5px;
        }
        .inputSpuValue-input{
            width:70%
        }
    }
    .bigDelet{
        display: flex;
        height: 100%;
        flex-direction: column;
        justify-content: center;
        width: 45px;
    }
    
    
}
.spuShowBox{
    border:1px solid #cccccc;
    border-radius: 5px;
    ul{
        padding: 20px;
        padding-bottom: 10px;
        display: flex;
        flex-wrap: wrap;
        li{
            
            display: flex;
            width: 48%;
            flex-wrap: wrap;
            margin-right: 2%;
            margin-bottom: 10px;
            .spu-item-left{
                display: flex;
                align-items: center;
                
                padding:2px 5px;
                border-radius: 5px;
                margin-right: 5px;
            }
            .spu-item-right{
                padding-left: 5px;
                border: 1px solid #cccccc;
                border-radius: 5px;
                display: flex;
                flex-wrap: wrap;
                flex: 1;
                span{
                    line-height: 20px;
                    
                    padding:2px 5px;
                }
            }
        }
    }
}
</style>
<script>
import {getRequest,postRequest,putRequest,deleteRequest,patchRequest} from '@/utils/api';
import sessionStorage from '@/utils/sessionStorage'
import url from '@/utils/url';
export default {

    props:{
        dialogVisible:{
            type:Boolean,
            default:false
        }
    },
    data () {
        var validatenickPublic = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('输入框不能为空'));
            }else{
                callback();
            }

        };
        return {
            supTag:'other',
            supList:[],
            guigeList:[{guigeV:''}],
            inputList:[
                {
                    spuName: "",    
                    list:[
                        {
                            skuValue: "",
                        },
                    ]
                },
            ],
            getSuccessImgList:[],
            getSuccessOtherImgList:[],
            getSuccessDetailImgList:[],
            imgListLength:0,
            imgOtherLength:0,
            imgDetailListLength:0,
            uploadNum:0,
            upOtherloadNum:0,
            upDetailloadNum:0,
            qiniuH:url.qiniuH,
            upImgList:[],
            upImgDetailList:[],
            upImgOtherList:[],
            selectHeadList1:[],
            selectHeadList2:[],
            selectHeadList3:[],
            selectbrandList:[],
            ifUpImg:false,
            qiniu:{
                upUrl:'',
                token:'',
            },
            qiniuDetail:{
                upUrl:'',
                token:'',
            },
            qiniuOther:{
                upUrl:'',
                token:'',
            },
            spuParamList:[],
            
            ruleForm:{
                title:'',
                selectOneV:"",
                selectTwoV:"",
                selectThreeV:"",
                selecBrandV:'',
                goodsName:'',
                // isFree:true,
                // postage:'',
                price:'',
                adjustedPrice:"",
                stockNum:'',
                weight:''
                
            },
            rules: {
                // title: [
                //     { validator: validatenickPublic, trigger: 'blur' }
                // ],
                // selectOneV: [
                //     { validator: validatenickPublic, trigger: 'blur' }
                // ],
                // selectTwoV: [
                //     { validator: validatenickPublic, trigger: 'blur' }
                // ],
                // selecBrandV: [
                //     { validator: validatenickPublic, trigger: 'blur' }
                // ],
            },
            
        }
    },
    methods:{
        // spu Checkbox选择
        spuCheckF(index,status){
            // if(status){
            //     this.supList[index].checked=true
            // }
            let flagF=false
            this.supList[index].skuList.forEach((v,i)=>{
                if(v.checked){
                    flagF=true
                }
            })
            this.supList[index].checked=flagF

            
            let spuParamList=[]
            


            this.supList.forEach((v1,i1)=>{
                if(v1.checked){
                    let objs = {spuId:'',skuList:[]}
                    v1.skuList.forEach((v2,i2)=>{
                        if(v2.checked){
                            
                            objs.spuId=v1.spuId
                            objs.skuList.push({skuId:v2.skuId})
                            
                            
                            
                        }
                        
                    })
                    spuParamList.push(objs)
                }
                
            })
            this.spuParamList=spuParamList
            console.log("spuParamList",spuParamList)
            
        },
        // 规格输入框删除
        deletGuigeInput(index){
            this.guigeList.splice(index, 1);
        },
        // 添加输入框规格
        addGuigeInput(){
            this.guigeList.push({guigeV:''})
        },
        // 保存修改或增加的spu值
        saveSpuF(){
            
            if(this.supTag=='change'){

                if(this.ruleForm.selectThreeV==''){
                    this.$message.warning('请选择三级分类');
                    return
                }
                let spuParams=[]
                
                this.inputList.forEach((v,i)=>{
                    spuParams.push({spuId:this.changeId,spuName:"",skuList:v.list})
                })
                this.addSpuHttp({
                    spuSkuJson:JSON.stringify(spuParams[0]),
                    classifyIdStr:this.ruleForm.selectTwoV+'-'+this.ruleForm.selectThreeV
                })
            }

            if(this.supTag=='add'){
                if(this.ruleForm.selectThreeV==''){
                    this.$message.warning('请选择三级分类');
                    return
                }
                let spuParams=[]
                
                this.inputList.forEach((v,i)=>{
                    spuParams.push({spuId:'',spuName:v.spuName,skuList:v.list})
                })
                this.addSpuHttp({
                    spuSkuJson:JSON.stringify(spuParams[0]),
                    classifyIdStr:this.ruleForm.selectTwoV+'-'+this.ruleForm.selectThreeV
                })
            }
        },
        addSpuHttp(params){
            console.log('params',params)
            
            postRequest(url.systemSpuSaveSpuSku, params).then(data=> {
                
                if(data.data.status!=1){
                    this.$message.success(data.data.message);
                    return
                }
                this.initSpu()    
                
                this.supTag='other'
                console.log("SPU添加成功数据",data.data.data)  
                
                
            }); 
        },
        // 初始化spu
        initSpu(){
            postRequest(url.systemSpuListSpuSku, {
                classifyId:this.ruleForm.selectThreeV
            }).then(data=> {
                
                if(data.data.status!=1){
                    this.$message.success(data.data.message);
                    return
                }
                this.supList=data.data.data
                // this.initData(this.tableParams)
                // this.$refs['ruleForm'].resetFields();
                // this.dialogVisible=false
                console.log("SPU查询数据",data.data.data)  
                
                
            }); 
        },
        
        updateSup(index,item){
            console.log('updateSup',item)
            this.changeId=item.spuId
            this.supTag='change'
            this.inputList=[
                {
                    spuName: "",    
                    list:[
                        {
                            skuValue: "",
                        },
                    ]
                },
            ]

            
        },
        // 删除小的input
        deletSmallInput(index1,index2){
            
            console.log("this.list",this.inputList)
            if(this.inputList[index1].list.length==1){
                this.$message.warning('至少添加一条');
                return
            }
            this.inputList[index1].list.splice(index2, 1);
            
        },
        // 删除大的input
        deletBigInput(index){
            
            // this.inputList.splice(index, 1);
        },
        // 添加小的input
        addSmallInput(index){
            
            this.inputList[index].list.push({skuValue:''})
            console.log(this.inputList,this.inputList)
        },
        // 添加大的input
        addBigInput(){
            this.supTag='add'
            this.inputList=[
                {
                    spuName: "",    
                    list:[
                        {
                            skuValue: "",
                        },
                    ]
                },
            ]
        },

        selectOneF(){
            this.selectHeadList2=[]
            this.selectHeadList3=[]
            this.selectbrandList=[]
            this.ruleForm.selectTwoV=''
            this.ruleForm.selectThreeV=''
            this.ruleForm.selecBrandV=''
            
            console.log("selectOne的值",this.ruleForm.selectOneV)
            let  selectOneV = this.ruleForm.selectOneV
            this.initHeadSelct(selectOneV).then(data=>{
                let datas = data.data.data
                this.selectHeadList2=datas
            })
        },
        selectTwoF(){
            this.selectHeadList3=[]
            this.selectbrandList=[]
            this.ruleForm.selectThreeV=''
            this.ruleForm.selecBrandV=''
            console.log("selectTwo的值",this.ruleForm.selectTwoV)
            let  selectTwoV = this.ruleForm.selectTwoV
            this.initHeadSelct(selectTwoV).then(data=>{
                let datas = data.data.data
                this.selectHeadList3=datas
            })
            // this.initBrand(selectTwoV).then(data=>{
            //     let datas = data.data.data
            //     this.selectbrandList=datas
            // })
            
        },
        selectThreeF(){
            this.selectbrandList=[]
            this.ruleForm.selecBrandV=''
            console.log("selectThreeV的值",this.ruleForm.selectThreeV)
            let  selectThreeV = this.ruleForm.selectThreeV
            this.initBrand(selectThreeV).then(data=>{
                let datas = data.data.data
                this.selectbrandList=datas
                this.initSpu()
            })
            
        },
        selecBrandF(){
            this.$forceUpdate()//强制刷新获取选择的值
        },
        // 关闭弹窗 清空数据
        resetForms(){
            this.upImgList=[]
            this.upImgDetailList=[]
            this.upImgOtherList=[]
            this.supList=[],
            this.guigeList=[{guigeV:''}],
            this.imgListLength=0
            this.imgOtherLength=0
            this.imgDetailListLength=0
            this.upImgList=[],
            this.upImgDetailList=[],
            this.upImgOtherList=[],
            this.spuParamList=[]
            this.guigeList=[{guigeV:''}],
            this.$refs['ruleForm'].resetFields();
        },
        //提交
        subPicForm(){
            if(this.imgListLength==0){
                this.$message.warning('主图是必须上传的')
                return
            }
            if(this.imgDetailListLength==0){
                this.$message.warning('请上传详情图')
                return
            }
            if(this.ruleForm.selectOneV==''){
                this.$message.warning('请选择一级分类')
                return
            }
            if(this.ruleForm.selectTwoV==''){
                this.$message.warning('请选择二级分类')
                return
            }
            if(this.ruleForm.selectThreeV==''){
                this.$message.warning('请选择三级分类')
                return
            }
            if(this.ruleForm.selecBrandV==''){
                this.$message.warning('请选择品牌')
                return
            }

            if(this.spuParamList.length==0){
                this.$message.warning('至少选择一条spu和sku')
                return
            }

            
            // if(this.ruleForm.isFree){
            //     if(this.ruleForm.postage==''){
            //         this.$message.warning('请输入邮费')
            //         return
            //     }
                
            // }
            
            if(this.ruleForm.goodsName==''){
                this.$message.warning('请输入商品名')
                return
            }
            if(this.ruleForm.price==''){
                this.$message.warning('请输入原价')
                return
            }
            if(this.ruleForm.adjustedPrice==''){
                this.$message.warning('请输入现价')
                return
            }
            
            if(this.ruleForm.stockNum==''){
                this.$message.warning('请输入商品数量')
                return
            }
            if(this.ruleForm.weight==''){
                this.$message.warning('请输入商品重量')
                return
            }

            let guigeArr=[]
            this.guigeList.forEach((v,i)=>{
                if(v.guigeV!=''){
                    guigeArr.push(v.guigeV)
                }
                
            })
            
            console.log("guigeArr",guigeArr)
            if(guigeArr.length==0){
                this.$message.warning('至少选择一条规格')
                return
            }
            this.guigeArr=guigeArr
            this.$refs["ruleForm"].validate((valid) => {
            if (valid) {    
                this.$refs.uploadimg.submit();
                this.$refs.upOtherloadimg.submit();
                this.$refs.upDetailloadimg.submit();
                

            }else {

                return false;
            }
            });
        },

/*****************************商品图上传操作过程****************************************/        
        // 上传主图片之前
        upBefore(file){
            let dates= new Date()
            return  this.qiniu.key=file.uid
        },
        // 主图片改变
        imgChange(file, fileList) {
            this.imgListLength=fileList.length
            console.log("显示主图的长度",this.imgListLength)
            this.isChangeImg=true
        },
        // 上传主图片成功
        upImgSuccess(response, file, fileList){
            
            // this.getSuccessImgList.push
            

            this.uploadNum++
            console.log(this.uploadNum+"55555555555555555"+this.imgListLength)
            if(this.uploadNum==this.imgListLength){
                fileList.forEach(v => {
                    this.getSuccessImgList.push({
                            
                            imgUrl:v.uid,
                            isDiagram:'1',
                            
                        })
                });
            }
            
            if(this.uploadNum+this.upOtherloadNum+this.upDetailloadNum==this.imgListLength+this.imgOtherLength+this.imgDetailListLength){
                
                console.log("图片的总数量",this.upDetailloadNum+this.upOtherloadNum+this.uploadNum)

                
                this.addServer({
                    brandId:this.ruleForm.selecBrandV,
                    firstLevelId:this.ruleForm.selectOneV,
                    secondLevelId:this.ruleForm.selectTwoV,
                    threeLevelId:this.ruleForm.selectThreeV,
                    goodsName:this.ruleForm.goodsName,
                    // isFree:this.ruleForm.isFree,
                    // postage:this.ruleForm.postage,
                    price:this.ruleForm.price,
                    adjustedPrice:this.ruleForm.adjustedPrice,
                    stockNum:this.ruleForm.stockNum,
                    weight:this.ruleForm.weight,
                    speList:this.guigeArr,
                    gooImgList:this.getSuccessImgList.concat(this.getSuccessOtherImgList),
                    parImgList:this.getSuccessDetailImgList,
                    spklist:this.spuParamList,
                    userId:''
                })
                
            }
        } ,

/*****************************商品其它图上传操作过程****************************************/        
        // 上传商品其它图片之前
        upOtherBefore(file){
            
            let dates= new Date()
            return  this.qiniuOther.key=file.uid
        },
        // 商品其它图片改变
        imgOtherChange(file, fileList) {
            this.imgOtherLength=fileList.length
            console.log("显示详情图的长度",this.imgOtherLength)
            this.isChangeImg=true
        },
        // 上传商品其它图片成功
        upImgOtherSuccess(response, file, fileList){
            console.log('fileList',fileList)
            
            this.upOtherloadNum++
            if(this.upOtherloadNum==this.imgOtherLength){
                fileList.forEach(v => {
                    this.getSuccessOtherImgList.push({
                        imgUrl:v.uid,
                        isDiagram:'0',
                    })
                });
            }
            
            if(this.uploadNum+this.upOtherloadNum+this.upDetailloadNum==this.imgListLength+this.imgOtherLength+this.imgDetailListLength){
                
                console.log("图片的总数量",this.upDetailloadNum+this.upOtherloadNum+this.uploadNum)

                
                this.addServer({
                    brandId:this.ruleForm.selecBrandV,
                    firstLevelId:this.ruleForm.selectOneV,
                    secondLevelId:this.ruleForm.selectTwoV,
                    threeLevelId:this.ruleForm.selectThreeV,
                    goodsName:this.ruleForm.goodsName,
                    // isFree:this.ruleForm.isFree,
                    // postage:this.ruleForm.postage,
                    price:this.ruleForm.price,
                    adjustedPrice:this.ruleForm.adjustedPrice,
                    stockNum:this.ruleForm.stockNum,
                    weight:this.ruleForm.weight,
                    speList:this.guigeArr,
                    gooImgList:this.getSuccessImgList.concat(this.getSuccessOtherImgList),
                    parImgList:this.getSuccessDetailImgList,
                    spklist:this.spuParamList,
                    userId:''
                })
                
            }
        } ,      
/*****************************详情图上传操作过程****************************************/        
        // 上传详情图片之前
        upDetailBefore(file){
            let dates= new Date()
            return  this.qiniuDetail.key=file.uid
        },
        // 详情图片改变
        imgDetailChange(file, fileList) {
            this.imgDetailListLength=fileList.length
            console.log("显示详情图的长度",this.imgDetailListLength)
            this.isChangeImg=true
        },
        // 上传详情图片成功
        upImgDetailSuccess(response, file, fileList){
            console.log('fileList',fileList)
            
            this.upDetailloadNum++
            if(this.upDetailloadNum==this.imgDetailListLength){
                fileList.forEach(v => {
                    this.getSuccessDetailImgList.push({imgUrl:v.uid})
                });
            }
            
            if(this.uploadNum+this.upOtherloadNum+this.upDetailloadNum==this.imgListLength+this.imgOtherLength+this.imgDetailListLength){
                
                console.log("图片的总数量",this.upDetailloadNum+this.upOtherloadNum+this.uploadNum)

                
                this.addServer({
                    brandId:this.ruleForm.selecBrandV,
                    firstLevelId:this.ruleForm.selectOneV,
                    secondLevelId:this.ruleForm.selectTwoV,
                    threeLevelId:this.ruleForm.selectThreeV,
                    goodsName:this.ruleForm.goodsName,
                    // isFree:this.ruleForm.isFree ? 1:0,
                    // postage:this.ruleForm.isFree ? this.ruleForm.postage : '',
                    price:this.ruleForm.price,
                    adjustedPrice:this.ruleForm.adjustedPrice,
                    stockNum:this.ruleForm.stockNum,
                    weight:this.ruleForm.weight,
                    speList:this.guigeArr,
                    gooImgList:this.getSuccessImgList.concat(this.getSuccessOtherImgList),
                    parImgList:this.getSuccessDetailImgList,
                    spklist:this.spuParamList,
                    userId:''
                })
                
            }

        } ,

        // 添加
        addServer(parmas){
            console.log("传给后台的数据",parmas)
            postRequest(url.systemGooSaveGoods, {
                goodsJson:JSON.stringify(parmas)
            }).then(data=> {
                this.uploadNum=0
                if(data.data.status!=1){
                    this.$message.success(data.data.message);
                    
                    return
                }

                // this.initData(this.tableParams)
                // this.$refs['ruleForm'].resetFields();
                // this.dialogVisible=false
                console.log("添加成功数据",data.data.data)  
                // 重置表单
                this.supList=[],
                this.guigeList=[{guigeV:''}],
                this.imgListLength=0
                this.imgOtherLength=0
                this.imgDetailListLength=0
                this.upImgList=[],
                this.upImgDetailList=[],
                this.upImgOtherList=[],
                this.spuParamList=[]
                this.guigeList=[{guigeV:''}],
                this.$emit('sonMethond', {type:'add',dialogVisible:false})
            }); 
        },

        // 初始化品牌列表
        initBrand(num){

             return new Promise((resolve, reject) => {
                postRequest(url.systemBrandListBrandByClassifyId, {
                    classifyId:num
                }).then(data=> {

                    if(data.data.status!=1){
                        this.$message.success(data.data.message);
                        
                        return
                    }
                    
                    resolve(data)
                    
                });   
                    
                    
            })

        },
        // 初始化头部下拉框
        initHeadSelct(num){

             return new Promise((resolve, reject) => {
                postRequest(url.systemClassifyListClassifyByFatherId, {
                    fatherId:num
                }).then(data=> {

                    if(data.data.status!=1){
                        this.$message.success(data.data.message);
                        
                        return
                    }
                    
                    resolve(data)
                    
                });   
                    
                    
            })
              
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
        this.qiniuOther={
            token:upToken
        }

        this.initHeadSelct(0).then(data=>{
            
            let datas = data.data.data

            console.log('selctOne列表',datas)
            this.selectHeadList1=datas
        })


        
    }

}
</script>