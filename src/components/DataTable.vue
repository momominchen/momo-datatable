<!-- 表格组件 -->
<template>
    <div>
        <div>
            <div class="pull-left">
                <label>Search：
                    <input type="text" class="light-gray" name="" placeholder="please enter" @keyup.enter="search" v-model="searchKey">
                </label>
            </div>
            <div class="pull-right" v-if="pagination">
                <!-- ajax -->
                 <boot-page :async="true" :lens="lenArr" :url="url" :page-len="pageLen" :param="param" :pageTotal="pageTotal" v-on:current="getCurrent" v-on:limit="getLimit"></boot-page> 
                <!-- local json -->
                <!--<boot-page :async="false" :lens="lenArr" :page-len="pageLen" v-on:newData="getNewRows" :data="rows"></boot-page>-->
            </div>
        </div>
        <table class="table table-hover table-bordered">
            <thead>
                <tr>
                    <th v-for="column in columns">
                        {{ column.label }}
                        <span v-if="column.sortable" class="glyphicon glyphicon-sort" @click="sortBy(column.field)">
                        </span>
                    </th>
                </tr>
            </thead>
            <tbody v-if="hasData">
                <tr v-for="row in rows">
                    <td v-for="column in columns">
                        <input v-if="column.choseType == 'checkbox'" type="checkbox" v-model="choseValue" :value="row.id" @change="updateMe">
                        <input v-if="column.choseType == 'radio'" type="radio" v-model="choseValue" :value="row.id" @change="updateMe">
                        <span v-if="column.field">{{ row[column.field] }}</span>
                        <span v-if="column.value">{{ column.value }}</span>
                        <component v-if="column.component" :is="column.component" :row="row"></component>
                    </td>
                </tr>
            </tbody>
            <tbody v-if="!hasData">
              <tr>
                <td :colspan="columns.length">Sorry，the data is empty.</td>
              </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
    import bootpage from './BootPage'

    export default {
        props: {
            columns: {
                type: Array
            },
            rows: {
                type: Array
            },
            lenArr: {
                type: Array
            },
            pageLen: {},
            param: {
                type: Object,
                default: function() {
                    return {}
                }
            },
            url: {
                type: String,
                default: ''
            },
            hasData: {
                type: Boolean,
                default: false
            },
            pageTotal: {
                type: Number,
                default: 1
            },
            pagination: {
                type: Boolean,
                default: true
            },
            choseValue: {}
        },
        data() {
            return {
                searchKey: '',
                sortdir: 'desc', // sorting
                current: '', // current page
                limit: 10 // the number of page display entries, default 10
            }
        },
        methods: {
            // search
            search: function() {
                this.param.search = this.searchKey
                var me = this
                this.$http.get(this.url, {
                        params: me.param
                    })
                    .then(function(response) {
                        if (response.data.status) {
                            me.rows = response.data.data.records
                            me.pageTotal = Math.ceil(response.data.data.total / 10)
                        } else {
                            giveAlert(response.data.info, 0)
                        }
                    })
                    .catch(function(response) {})
            },
            // change current page
            getCurrent: function(current) {
                this.current = current
                var me = this
                this.getData(me.limit, current)
            },
            // change limit
            getLimit: function(limit) {
                this.limit = limit
                var me = this
                me.current = 1
                this.getData(limit, me.current)
            },
            // sorting
            sortBy: function(sortcol) {
                var me = this
                me.sortdir = (me.sortdir === 'desc' ? 'asc' : 'desc')
                me.param.sortcol = sortcol
                me.param.sortdir = me.sortdir
                me.current = 1
                me.getData(me.limit, me.current)
            },
            // request data
            getData: function(limit, current) {
                var me = this
                var params = me.param
                params.limit = limit
                params.offset = parseInt((current - 1) * limit)
                this.$http.get(me.url, {
                        params: params
                    })
                    .then(function(response) {
                        if (response.data.status) {
                            if (response.data.data.records) {
                                me.rows = response.data.data.records
                            } else {
                                me.rows = me.rows = response.data.data
                            }
                            me.pageTotal = Math.ceil(response.data.data.total / me.limit)
                        } else {
                            giveAlert(response.data.info, 0)
                            me.hasData = false
                        }
                    })
                    .catch(function(response) {
                        giveAlert(response, 0)
                        me.hasData = false
                    })
            },
            // checkbox/radio
            updateMe: function() {
                var chose = this.choseValue
                    // console.log('choseValue: ' + this.choseValue)
                this.$emit('choseFromChild', chose)
            }
        },
        components: {
            'boot-page': bootpage
        },
        events: {
            'data' (data) {
                this.rows = data
            }
        }
    }
</script>

<style>
    .glyphicon-sort {
        cursor: pointer;
    }
    
    .pull-right {
        margin-bottom: 10px;
    }
</style>