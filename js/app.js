(function (window,Vue,undefined) {
	// 1 先创建一个数组
	var list = [
		{
			id: '1',
			content:'abc',
			isFinish: true
		},
		{
			id: '2',
			content:'abc',
			isFinish: false
		},
		{
			id: '3',
			content:'abc',
			isFinish: true
		}
	]
	new Vue({
		el:'#app',
		data:{
			// 2 因为我们数据是在localStorage里面存储的，拿的时候是json格式，需要使用josn.pase
			dataList: JSON.parse(window.localStorage.getItem('dataList')) || [],
			newTodo: '',
			beforeUpdate: {},
			activeBtn: 1
		},
		methods: {
			// 4 4-1 添加数据
			addTodo() {
				// 判断内容不能为空
				if (!this.newTodo.trim()) {
					return;
				}
				// console.log('aaa')
				// 组装一个对象，把对象添加到数组中去
				this.dataList.push({
					content: this.newTodo.trim(),
					isFinish: false,
					id: this.dataList.length ? this.dataList[this.dataList.length - 1]['id'] + 1 :1
				});
				// 清空输入框
				this.newTodo = '';
			},

			// 4-2 删除一条数据todo
			delTodo(index) {
				this.dataList.splice(index,1);
			},

			// 4-3 删除所有的todo
			delAll() {
				this.dataList = this.dataList.filter(item => !item.isFinish)
			},


			// 显示编辑的文本框
			showEdit(index){
				console.log(index)
				console.log(this.$refs);
				this.$refs.show.forEach(item => {
					item.classList.remove('editing')
				})
				this.$refs.show[index].classList.add('editing')
				this.beforeUpdate = JSON.parse(JSON.stringify(this.dataList[index]))
			},

			// 编辑事件
			updateTodo(index) {
				if (!this.dataList[index].content.trim()) {
					return this.dataList.splice(index,1)
				}
				if (this.dataList[index].content !== this.beforeUpdate.content) {
					this.dataList[index].isFinish =false
				}
				this.$refs.show[index].classList.remove('editing')
			},

			// 还原内容
			backTodo(index) {
				this.dataList[index].content = this.beforeUpdate.content
				this.$refs.show[index].classList.remove('editing')
				this.beforeUpdate = {}
			},

			// hashchange事件
			hashchange() {
				switch (window.location.hash) {
					case '':
					case '#/':
						this.showAll();
						this.activeBtn = 1;
						break
					case '#/active':
						this.activeAll(false);
						this.activeBtn = 2;
						break
					case '#/completed':
						this.activeAll(true);
						this.activeBtn = 3;
						break
				}
			},

			// 先创建一个显示的数组
			showAll() {
				this.showArr = this.dataList.map(() => true);
				// console.log(this.showArr);
			},
			// 给要修改的数组的使用
			activeAll(boo) {
				this.showArr = this.dataList.map(item => item.isFinish === boo)
				if (this.dataList.every(item => item.isFinish === !boo)) return window.location.hash = '#/';
			} 
		},
		// 监听
		watch: {
			dataList: {
				handler(newArr) {
					window.localStorage.setItem('dataList',JSON.stringify(newArr))
					this.hashchange()
				},
				deep:true
			}
		},
		// 4-3 计算属性 (所有isFinish为false的数量)
		computed: {
			activeNum() {
			return this.dataList.filter(item => !item.isFinish).length
			},
			// 4-4 让全选按钮显示
			toggleAll: {
				get() {
					return this.dataList.every(item => item.isFinish);
				},
				set(val) {
					// console.log(val)
					this.dataList.forEach(item => item.isFinish = val);
				}
			}
		},
	
		// 3 自定义指令
		directives: {
			focus: {
				inserted(el) {
					el.focus();
				}
			}
		},
		filters: {
			date (val) {
				return val + '  ---  ' + new Date().getDay()
			}
		},


		// 生命周期
		created () {
			this.hashchange();
			window.onhashchange = () => {
				this.hashchange()
			}			
		} 

	})
})(window,Vue);
