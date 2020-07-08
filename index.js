/* eslint-disable class-methods-use-this */
/**
 * wx storage 辅助器
 * 提供方法：
 *
 * setSync(key, value) - 同步设置记录
 * set(key, value): Promise - 异步设置记录，返回 Promise
 * getSync(key) - 同步获取记录
 * get(key): Promise<any> - 异步获取记录，返回Promise
 * addItemsSync(key, [])
 * addItems(key, []): Promise
 * deleteItems(key, )
 *
 */
// TODO: 1. 类型判断；2.错误处理
class WxMiniStorage {
    /**
     * 同步设置记录
     * @param {*} key
     * @param {*} value
     */
    setSync(key, value) {
      wx.setStorageSync(key, value);
    }
  
    /**
     * 异步设置记录
     * @param {*} key
     * @param {*} value
     * @return {*} Promise()
     */
    set(key, value) {
      return new Promise((resolve, reject) => {
        wx.setStorage({
          key,
          data: value,
          success: () => {
            resolve();
          },
          fail: () => {
            reject();
          },
        });
      });
    }
  
    /**
     * 同步获取记录
     * @param {*} key
     */
    getSync(key) {
      return wx.getStorageSync(key);
    }
  
    /**
     * 异步获取记录，返回 Promise
     * @param {*} key
     */
    get(key) {
      return new Promise((resolve, reject) => {
        wx.getStorage({
          key,
          success: ({ data }) => {
            resolve(data);
          },
          fail: (err) => {
            // 抛出错误，代表没有返回，也一并 resolve 出去
            resolve(undefined);
          },
        });
      });
    }
  
    /**
     * 同步增加多条记录，会覆盖相同的key
     * @param {*} key
     * @param {*} items
     */
    addItemsSync(key, items) {
      const draft = wx.getStorageSync(key) || {};
  
      wx.setStorageSync(key, {
        ...draft,
        ...items,
      });
    }
  
    /**
     * 异步增加多条记录
     * @param {*} key
     * @param {*} items 数组类型
     */
    addItems(key, items) {
      return new Promise((resolve, reject) => {
        wx.getStorage({
          key,
          success: ({ data }) => {
            wx.setStorage({
              key,
              data: {
                ...data,
                ...items,
              },
              success: () => {
                resolve();
              },
              fail: (err) => {
                console.log('err', err)
                reject();
              },
            });
          },
          fail: () => {
            reject();
          },
        });
      });
    }
  
    /**
     * 同步删除记录
     * @param {*} key
     */
    deleteSync(key) {
      wx.removeStorageSync(key);
    }
  
    /**
     * 异步删除记录
     * @param {*} key
     */
    delete(key) {
      return new Promise((resolve, reject) => {
        wx.removeStorage({
          key,
          success: () => {
            resolve();
          },
          fail: () => {
            reject();
          },
        });
      });
    }
  
    /**
     * 同步删除部分记录
     * @param {*} key
     * @param {*} items
     * @example deleteItemsSync('dxd-test', ['name', 'age'])
     */
    deleteItemsSync(key, items = []) {
      const draft = wx.getStorageSync(key) || {};
  
      items.forEach((item) => {
        delete draft[item];
      });
      wx.setStorageSync(key, draft);
    }
  
    /**
     *
     * 异步删除部分记录
     * @param {*} key
     * @param {*} items
     */
    deleteItems(key, items) {
      return new Promise((resolve, reject) => {
        wx.getStorage({
          key,
          success: ({ data }) => {
            items.forEach((item) => {
              delete data[item];
            });
            wx.setStorage({
              key,
              data,
              success: () => {
                resolve();
              },
              fail: (err) => {
                reject(err);
              },
            });
          },
          fail: (err) => {
            reject(err);
          },
        });
      });
    }
  }
  
  const wxMiniStorage = new WxMiniStorage();
  
  export default wxMiniStorage;
  