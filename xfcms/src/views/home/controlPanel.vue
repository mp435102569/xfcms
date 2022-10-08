<template>
    <div class="controBox">
        <div class="colTop">
            <el-row :gutter="12" class="rowBox">
                <el-col :span="7">
                    <el-card shadow="always">
                        <template #header>
                            <div class="card-header">
                                <span>今日订单数</span>
                            </div>
                        </template>
                        1200
                    </el-card>
                </el-col>
                <el-col :span="7">
                    <el-card shadow="always">
                        <template #header>
                            <div class="card-header">
                                <span>今日日活</span>
                            </div>
                        </template>
                        36271
                    </el-card>
                </el-col>
                <el-col :span="7">
                    <el-card shadow="always">
                        <template #header>
                            <div class="card-header">
                                <span>转化率</span>
                            </div>
                        </template>
                       20%
                    </el-card>
                </el-col>
            </el-row>
        </div>
        <div class="echarts" ref="box">

        </div>
    </div>

</template>

<script setup>
import * as echarts from 'echarts';
import { onMounted, ref } from 'vue'
let box = ref('');
onMounted(() => {
    let myEcharts = echarts.init(box.value);
    myEcharts.setOption({
        title: {
            text: '新峰CMS管理系统'
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                label: {
                    backgroundColor: '#6a7985'
                }
            }
        },
        legend: {
            data: ['新增注册', '付费用户', '活跃用户', '订单数', '当日总收入']
        },
        toolbox: {
            feature: {
                saveAsImage: {}
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: [
            {
                type: 'category',
                boundaryGap: false,
                data: ['2022-06-25', '2022-06-26', '2022-06-26', '2022-06-27', '2022-06-28', '2022-06-29', '2022-06-30']
            }
        ],
        yAxis: [
            {
                type: 'value'
            }
        ],
        series: [
                    {
                        name: "新增注册",
                        type: "line",
                        stack: "Total",
                        areaStyle: {},
                        emphasis: {
                            focus: "series",
                        },
                        data: [140, 232, 101, 264, 90, 340, 250]
                    },
                    {
                        name: "付费用户",
                        type: "line",
                        stack: "Total",
                        areaStyle: {},
                        emphasis: {
                            focus: "series",
                        },
                        data: [120, 282, 111, 234, 220, 340, 310]
                    },
                    {
                        name: "活跃用户",
                        type: "line",
                        stack: "Total",
                        areaStyle: {},
                        emphasis: {
                            focus: "series",
                        },
                         data: [320, 132, 201, 334, 190, 130, 220]
                    },
                    {
                        name: "订单数",
                        type: "line",
                        stack: "Total",
                        areaStyle: {},
                        emphasis: {
                            focus: "series",
                        },
                         data: [220, 402, 231, 134, 190, 230, 120]
                    },
                      {
                        name: "当日总收入",
                        type: "line",
                        stack: "Total",
                        areaStyle: {},
                        emphasis: {
                            focus: "series",
                        },
                        data: [220, 302, 181, 234, 210, 290, 150]
                    },
                ],
    });
  })


</script>

<style lang="less" scoped>

.controBox{
    width: 100%;
    height: 750px;
    background-color: #fff;
    border-radius: 10px;
.echarts {
        width: 95%;
        margin: 0 2.5%;
        height: 550px;
    }
    .colTop{
        width: 100%;
        height: 150px;
        padding-top: 10px;
        .el-row{
        display: flex;
        justify-content: space-around;
        }
    }
}

</style>