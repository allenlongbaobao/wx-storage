import wxMiniStorage from '../index'
Function.prototype.before = function (fn) {
  var __self = this
  return function () {
    fn.apply(this, arguments)
    return __self.apply(this, arguments)
  }
}

export function runTest() {
  console.log('start run wx-storage test')
  testSetSync.before(clearHelper)()

  testGetSync.before(clearHelper)()

  testAddItemsSync.before(clearHelper)()

  testAddItemsSyncDump.before(clearHelper)()

  testDeleteSync.before(clearHelper)()

  testDeleteItemsSync.before(clearHelper)()

  // 异步任务，顺序执行
  testSet()
    .then(() => testGet())
    .then(() => testAddItems())
    .then(() => testDelete())
    .then(() => testDeleteItems())
  
}

function clearHelper() {
  // 清空缓存
  const key = 'main'
  wx.removeStorageSync(key);
}

// 测试 setSync
function testSetSync() {
  const key = 'main'
  const value = '同步设置'
  wxMiniStorage.setSync(key, value)
  const result = wx.getStorageSync(key) || {}
  if (result === value) {
    console.info('同步设置测试成功')
  } else {
    console.error('同步设置测试失败')
  }
}

// 测试 getSync
function testGetSync() {
  const key = 'main'
  const value = '同步获取'
  wxMiniStorage.setSync(key, value)
  const result = wxMiniStorage.getSync(key)
  if (result === value) {
    console.info('同步获取成功')
  } else {
    console.error('同步获取失败')
  }
}

// 测试同步增加多条记录,增加数据和原数据没有重复
function testAddItemsSync() {
  const key = 'main'
  const value = { name: 'allen' }
  const addItems = { age: 19 }
  wxMiniStorage.setSync(key, value)
  wxMiniStorage.addItemsSync(key, addItems)
  const { name, age } = wxMiniStorage.getSync(key) || {}
  if (name === 'allen' && age === 19) {
    console.info('同步增加数据成功, 增加数据和原数据没有重复')
  } else {
    console.error('同步增加数据失败')
  }
}

// 测试同步增加多条记录，增加的数据和原数据有重复
function testAddItemsSyncDump() {
  const key = 'main'
  const value = { name: 'allen' }
  const addItems = { age: 19, name: 'cathy' }
  wxMiniStorage.setSync(key, value)
  wxMiniStorage.addItemsSync(key, addItems)
  const { name, age } = wxMiniStorage.getSync(key) || {}
  if (name === 'cathy' && age === 19) {
    console.info('同步增加数据成功, 增加的数据和原数据有重复')
  } else {
    console.error('同步增加数据失败')
  }
}

// 测试同步删除整条记录
function testDeleteSync() {
  const key = 'main'
  const value = { name: 'allen', age: 19 } 
  wxMiniStorage.setSync(key, value)
  wxMiniStorage.deleteSync(key)
  const draft = wxMiniStorage.getSync(key) || {}
  if (!draft.name || !draft.age) {
    console.log('同步删除整条记录成功')
  } else {
    console.log('同步删除整条记录失败')
  }
}

// 测试同步删除部分记录
function testDeleteItemsSync() {
  const key = 'main'
  const value = { name: 'allen', age: 19 } 
  const deleteItems = ['age']
  wxMiniStorage.set(key, value)
  wxMiniStorage.deleteItemsSync(key, deleteItems)
  const { name, age } = wxMiniStorage.getSync(key) || {}
  if (name === 'allen' && !age) {
    console.log('同步删除部分记录成功')
  } else {
    console.log('同步删除部分记录失败')
  }
}

// 测试异步设置记录
function testSet() {
  const key = 'main'
  const value = { name: 'allen', age: 19 } 
  return wxMiniStorage.set(key, value).then(() => {
    const { name, age }= wxMiniStorage.getSync(key) || {}
    if (name === 'allen' && age === 19) {
      console.info('异步设置记录成功')
    } else {
      console.error('异步设置记录失败')
    }
  })
}

// 测试异步获取记录
function testGet() {
  const key = 'main'
  const value = { name: 'allen', age: 19 }
  return wxMiniStorage
    .set(key, value)
    .then(() => {
      return wxMiniStorage.get(key).then(({ name, age }) => {
        if (name === 'allen' && age === 19) {
          console.info('异步获取记录成功')
        } else {
          console.error('异步获取记录失败')
        }
      })
    })
}

// 测试异步增加多条记录
function testAddItems() {
  const key = 'main'
  const value = { name: 'allen' }
  return wxMiniStorage
    .set(key, value)
    .then(() => {
      return wxMiniStorage.addItems(key, { age: 20 })
       .then(() => {
         return wxMiniStorage.get(key).then(({ name, age }) => {
           if (name === 'allen' && age === 20) {
             console.info('异步增加多条记录成功')
           } else {
             throw new Error()
           }
         })
       })
    }).catch((err) => {
      console.error('异步增加多条记录失败', err)
    })
}

// 测试异步删除记录
function testDelete() {
  const key = 'main'
  const value = { name: 'allen', age: 19 }
  return wxMiniStorage.set(key, value).then(() => {
    return wxMiniStorage.delete(key)
      .then(() => {
        return wxMiniStorage.get(key).then(({ name, age } = {}) => {
          if (!name && !age) {
            console.info('测试异步删除记录成功')
          } else {
            throw new Error()
          }
        })
      })
      .catch((err) => {
        console.error('测试异步增加记录失败', err)
      })
  })
}

// 测试异步删除部分记录
function testDeleteItems() {
  const key = 'main'
  const value = { name: 'allen', age: 19 }
  return wxMiniStorage.set(key, value).then(() => {
    return wxMiniStorage.deleteItems(key, ['age']).then(() => {
      return wxMiniStorage.get(key).then(({ name, age } = {}) => {
        if (name === 'allen' && !age) {
          console.info('异步删除部分记录成功')
        } else {
          throw new Error()
        }
      })
    }).catch((err) => {
      console.error('异步删除部分记录失败', err)
    })
  })
}
