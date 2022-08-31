import store from '@/store'

const tokens = {
  admin: 'admin-token',
  user: 'user-token'
}

const users = {
  'admin-token': {
    user: {
      permission: ['admin'],
      introduction: 'I am a super administrator',
      avatar:
        'https://charmingcheng20.oss-cn-zhangjiakou.aliyuncs.com/wx-api/20201204/613f4398e74efd9f7585be8b0b890e13.png',
      username: 'Super Admin'
    }
  },
  'user-token': {
    user: {
      permission: ['user'],
      introduction: 'I am an user',
      avatar:
        'https://charmingcheng20.oss-cn-zhangjiakou.aliyuncs.com/wx-api/20201204/613f4398e74efd9f7585be8b0b890e13.png',
      username: 'Normal user'
    }
  }
}

export default [
  // user login
  {
    url: '/api/login',
    type: 'post',
    response: (config) => {
      const { username } = config.body
      const token = tokens[username]

      // mock error
      if (!token) {
        return {
          code: 60204,
          message: '账号或密码不正确'
        }
      }

      return {
        code: 20000,
        data: {
          token: token,
          permissions: ['admin']
        }
      }
    }
  },

  // get user info
  {
    url: '/api/userinfo',
    type: 'get',
    response: (config) => {
      const token = store.getters.token
      const info = users[token]

      // mock error
      if (!info) {
        return {
          code: 50008,
          message: '获取用户信息失败'
        }
      }

      return {
        code: 20000,
        data: info
      }
    }
  },

  // user logout
  {
    url: '/api/logout',
    type: 'post',
    response: (_) => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  }
]
