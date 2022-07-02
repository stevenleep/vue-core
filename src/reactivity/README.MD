initReactiveObject: user = reactive({ age: 10 })
    deps: []

effect(function effectCallback() {
    // effect 进入就会执行一次, 监测到响应式对象user的get操作
    // 此时将这个fn添加到user到deps中
    user.age
})

// 更新到时候会触发响应式对象的set操作，将deps中的fn进行调用
// 从而触发更新
user.age++