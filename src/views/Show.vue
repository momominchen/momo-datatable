<template>
    <div class="col-md-10 col-md-offset-1">
        <h1>datatable</h1>
        <data-table :rows="rows" :columns="columns" :url="url" :param="params" :hasData="hasData" v-on:choseFromChild='getChecked' :pageTotal="pageTotal"></data-table> 
    </div>
</template>

<script>
    import Vue from 'vue'
    import datatables from '../components/DataTable'
    export default {
        data() {
            return {
                rows: [],
                columns: [{
                    label: 'chose', // support checkbox and radio
                    choseType: 'checkbox'
                }, {
                    label: 'name',
                    field: 'locname'
                }, {
                    label: 'area',
                    value: 'china' // the value of the current column after setting value is 'china'
                }, {
                    label: '操作',
                    component: 'myActions' // support for custom components
                }],
                url: 'xxxx', // backend data interface url
                params: {}, // Send the request to the backend with the parameters
                hasData: false,
                pageTotal: 1 // total pages
            }
        },
        components: {
            'data-table': datatables
        },
        mounted() {
            var me = this
            this.$http.get(me.url, {
                    params: me.params
                })
                .then(function(response) {
                    if (response.data.status) {
                        me.hasData = true
                        me.rows = response.data.data.records //
                        me.pageTotal = response.data.data.total
                    } else {
                        me.hasData = false
                        console.log(response)
                    }
                })
                .catch(function(response) {
                    me.hasData = false
                    console.log(response)
                })
        },
        methods: {
            getChecked: function(checked) {
                // get the result of column 'chose'
                console.log(checked)
            }
        }
    }
    Vue.component('myActions', {
        template: '<button type=\'button\' @click=\'viewDetail\'>查看详情</button>',
        props: ['row'],
        methods: {
            viewDetail: function() {
                alert('hello world')
            }
        }
    })
</script>