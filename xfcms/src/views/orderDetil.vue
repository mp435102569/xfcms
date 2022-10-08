<template>
    <div class="controBox">
        <div class="colTop">
            <el-row :gutter="12" class="rowBox">
                <el-col :span="8">
                    <el-card shadow="always">
                        <template #header>
                            <div class="card-header">
                                <span>订单状态</span>
                            </div>
                        </template>
                        {{ Detildata.orderStatusString }}
                    </el-card>
                </el-col>
                <el-col :span="8">
                    <el-card shadow="always">
                        <template #header>
                            <div class="card-header">
                                <span>创建时间</span>
                            </div>
                        </template>
                        {{ Detildata.createTime }}
                    </el-card>
                </el-col>
                <el-col :span="8">
                    <el-card shadow="always">
                        <template #header>
                            <div class="card-header">
                                <span>订单号</span>
                            </div>
                        </template>
                        {{ Detildata.orderNo }}
                    </el-card>
                </el-col>
            </el-row>
        </div>
        <el-table :data="Detildata.newBeeMallOrderItemVOS" style="width: 100%; margin-top:50px;">
            <!-- 数据为空提示 -->
            <template #empty>
                <el-empty description="数据正在来的路上~" />
            </template>
            <el-table-column label="商品图片" prop="goodsCoverImg" align="center">
                <template #default="{ row }">
                    <div>
                        <el-image fit="cover" :preview-teleported="true" style="width: 100%; height: 100%"
                            :src="'http://backend-api-02.newbee.ltd' + row.goodsCoverImg"
                            :preview-src-list="['http://backend-api-02.newbee.ltd' + row.goodsCoverImg]" />
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="商品编号" prop="goodsId" align="center" />
            <el-table-column label="商品名" prop="goodsName" align="center">
            </el-table-column>
            <el-table-column label="商品数量" prop="goodsCount" align="center">
            </el-table-column>
            <el-table-column label="价格" prop="sellingPrice" />
        </el-table>
    </div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router';
import { ref, reactive, onBeforeMount } from 'vue'
import api from '../api/http'
let router = useRouter(),
    route = useRoute(),
    orderId = ref(''),
    Detildata = ref([]);
onBeforeMount(async () => {
    orderId.value = route.params.id
    let { resultCode, data } = await api.get(`/orders/${orderId.value}`)
    if (resultCode == 200) {
        Detildata.value = data
        console.log(Detildata.value);
    }
})
</script>

<style lang="less" scoped>
</style>