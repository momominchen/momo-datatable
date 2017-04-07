<!-- tabular tab -->
<template>
  <div>
    <nav class="boot-nav">
      <ul class="pagination boot-page">
        <li>
          <a href="javascript:void(0)" aria-label="Previous" @click="onFirstClick()">
            <span aria-hidden="true">&laquo;</span>
          </a>
        </li>
        <li>
          <a href="javascript:void(0)" aria-label="Next" @click="onPrevClick()">
            <span aria-hidden="true">‹</span>
          </a>
        </li>
        <li v-for="(page,index) in pages" :class="activeNum === index ? 'active' : ''">
          <a href="javascript:void(0)" v-text="page" @click="onPageClick(index)"></a>
        </li>
        <li>
          <a href="javascript:void(0)" aria-label="Next" @click="onNextClick()">
            <span aria-hidden="true">›</span>
          </a>
        </li>
        <li>
          <a href="javascript:void(0)" aria-label="Next" @click="onLastClick()">
            <span aria-hidden="true">&raquo;</span>
          </a>
        </li>
      </ul>
      <div class="page-total">
        turn to  <input type="text" class="pageTrans light-gray" @keyup.enter="pageTrans" v-model="pageInput"> 
        total <span v-text="pageTotal"></span>
      </div>
    </nav>
    <select class="form-control boot-select" v-model="len" @change="changePageSize">
      <option v-for="(arr,index) in lens" :value="arr" v-text="arr" :selected="index === 0 ? true : false"></option>
    </select>
  </div>
</template>
<script>
    export default {
        props: {
            // page num
            pages_props: {
                type: Array,
                default: function() {
                    return [1]
                }
            },
            async: {
                type: Boolean,
                default: false
            },
            // limit
            len_props: {
                type: Number,
                default: 10
            },
            // limit array
            lens: {
                type: Array,
                default: function() {
                    return [5, 10, 50, 100]
                }
            },
            // data array
            data: {
                type: Array,
                default: function() {
                    return []
                }
            },
            // AJAX
            url: {
                type: String,
                default: ''
            },
            // current page
            pageLen: {
                type: Number,
                default: 1
            },
            // total page
            pageTotal: {
                type: Number,
                default: 1
            },
            // parameters
            param: {
                type: Object,
                default: function() {
                    return {}
                }
            }
        },
        data() {
            return {
                activeNum: 0,
                len: [],
                pages: [],
                pageInput: 1
            }
        },
        created() {
            this.len = this.param.limit ? this.param.limit : this.len_props
            this.getPages()
        },
        methods: {
            // turn to
            pageTrans: function() {
                this.activeNum = this.pageInput
                this.$emit('current', this.activeNum)
            },
            // change limit
            changePageSize: function() {
                // this.getData()
                this.$emit('limit', this.len)
            },
            // data change
            onPageClick(index) {
                this.activeNum = index
                this.$emit('current', this.pages[index])
            },
            // prev
            onPrevClick() {
                // whether the current page is the current minimum page number
                if (this.activeNum > 0) {
                    this.activeNum = this.activeNum - 1
                } else {
                    if (this.pages[0] !== 1) {
                        var newPages = []
                        for (var i = 0; i < this.pages.length; i++) {
                            newPages[i] = this.pages[i] - 1
                        }
                        this.pages = newPages
                    }
                }
                this.$emit('current', this.pages[this.activeNum])
            },
            // next
            onNextClick() {
                // whether the current page is the current maximum page number
                if (this.activeNum < this.pages.length - 1) {
                    this.activeNum = this.activeNum + 1
                } else {
                    if (this.pages[this.pages.length - 1] < this.pageTotal) {
                        var newPages = []
                        for (var i = 0; i < this.pages.length; i++) {
                            newPages[i] = this.pages[i] + 1
                        }
                        this.pages = newPages
                    }
                }
                this.$emit('current', this.pages[this.activeNum])
            },
            // first page
            onFirstClick() {
                if (this.pages[0] === 1) {
                    this.activeNum = 0
                } else {
                    let originPage = []
                    for (let i = 1; i <= this.pageLen; i++) {
                        originPage.push(i)
                    }
                    this.pages = originPage
                    this.activeNum = 0
                }
                this.$emit('current', this.pages[this.activeNum])
            },
            // last page
            onLastClick() {
                if (this.pageTotal <= this.pageLen) {
                    this.activeNum = this.pages.length - 1
                } else {
                    let lastPage = []
                    for (let i = this.pageLen - 1; i >= 0; i--) {
                        lastPage.push(this.pageTotal - i)
                    }
                    this.pages = lastPage
                    this.activeNum = this.pages.length - 1
                }
                this.$emit('current', this.pages[this.activeNum])
            },
            // get pages
            getPages() {
                this.pages = []
                if (!this.async) {
                    // console.log('dataLength:' + this.data.length)
                    this.pageTotal = Math.ceil(this.data.length / this.len)
                }
                // compare the total page number and the number of pages displayed
                if (this.pageTotal <= this.pageLen) {
                    for (let i = 1; i <= this.pageTotal; i++) {
                        this.pages.push(i)
                    }
                } else {
                    for (let i = 1; i <= this.pageLen; i++) {
                        this.pages.push(i)
                    }
                }
            },
            // page number change to get data
            getData() {
                if (!this.async) {
                    var len = this.len
                    var pageNum = this.pages[this.activeNum] - 1
                    var newData = []
                    for (var i = pageNum * len; i < (pageNum * len + len); i++) {
                        this.data[i] !== undefined ? newData.push(this.data[i]) : ''
                    }
                    this.$emit('newData', newData)
                } else {
                    var me = this
                    this.param.limit = this.len
                    this.param.offset = parseInt(this.len * (this.pages[this.activeNum] - 1))
                    this.$http.get(me.url, {
                            params: me.param
                        })
                        .then(function(response) {
                            me.pageTotal = Math.ceil(response.data.data.total / me.len)
                            if (me.pages.length !== me.pageLen || me.pageTotal < me.pageLen) {
                                me.getPages()
                            }
                            if (!response.data.data.length) {
                                me.activeNum = me.pageTotal - 1
                            }
                            me.$emit('data', response.data.data.records)
                        })
                }
            }
        },
        ready() {
            if (!this.async) {
                this.getPages()
            }
            this.getPages()
        }
    }
</script>
<style scoped>
    .boot-select {
        float: right;
        width: 80px;
    }
    
    .boot-nav {
        float: right;
    }
    
    .boot-page {
        display: inline-block;
        margin: 2px 10px 0 20px;
        vertical-align: middle;
    }
    
    .page-total {
        display: inline-block;
        vertical-align: middle;
    }
    
    .pagination>.active>a,
    .pagination>.active>a:focus,
    .pagination>.active>a:hover,
    .pagination>.active>span,
    .pagination>.active>span:focus,
    .pagination>.active>span:hover,
    .pagination>li>a:focus,
    .pagination>li>a:hover,
    .pagination>li>span:focus,
    .pagination>li>span:hover {
        background-color: #585659;
        color: #fff;
        border: 1px solid #fff;
    }
    
    .pageTrans {
        width: 40px;
        text-align: center;
    }
    
    .pageTrans:focus,
    .pageTrans:hover {
        background-color: #585659;
    }
</style>