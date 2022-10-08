export const storage = {
    /* 给localStorage设置有效期 */
    set(name,state){
        localStorage.setItem(name, JSON.stringify({
            time: +new Date(),
            data:state
        }))
    },
    get(name, overdueTime = 302400000) {
        /* 获取存储的值 */
        let state = localStorage.getItem(name);
        if (!state) return null;
        let { time, data } = JSON.parse(state);
        if (+new Date() - time > overdueTime) {
            /* 当前时间 - 存储时间大于 传入的时间 此时数据已过期 */
            localStorage.removeItem(name);
            return null;
        }
        return data;
    },
    remove(name) {
        localStorage.removeItem(name);
    }

}