import axios from 'axios'

export interface Workspace {
  id: string
  name: string
  created_at: number
  admin_url: string
  config?: Record<string, any>
}

class WorkspaceService {
  private workspaces: Workspace[] = []

  constructor() {
    // Axios 인터셉터 추가 (전역 에러 핸들링)
    axios.interceptors.response.use(
      response => response,
      error => {
        console.error('Axios 요청 중 오류 발생:', error)

        // 네트워크 오류 또는 서버 응답 오류 처리
        if (error.response) {
          // 서버 응답 있는 경우
          switch (error.response.status) {
            case 400:
              console.error('잘못된 요청입니다.')
              break
            case 401:
              console.error('인증되지 않은 요청입니다.')
              break
            case 404:
              console.error('요청한 리소스를 찾을 수 없습니다.')
              break
            case 500:
              console.error('서버 내부 오류가 발생했습니다.')
              break
            case 502:
              console.error('게이트웨이 오류가 발생했습니다. Kong 서버 상태를 확인해주세요.')
              break
          }
        } else if (error.request) {
          // 요청은 보내졌으나 응답을 받지 못한 경우
          console.error('서버로부터 응답을 받지 못했습니다.')
        } else {
          // 요청 설정 중 오류 발생
          console.error('요청 설정 중 오류가 발생했습니다.')
        }

        return Promise.reject(error)
      },
    )
  }

  async getAllWorkspaces(): Promise<Workspace[]> {
    try {
      const response = await axios.get('/workspaces')

      this.workspaces = response.data.map((workspace: any) => ({
        id: workspace.id || crypto.randomUUID(),
        name: workspace.name,
        created_at: workspace.created_at
          ? new Date(workspace.created_at).getTime()
          : Date.now(),
        admin_url: 'http://192.168.31.130',
        config: workspace,
      }))

      return this.workspaces
    } catch (error) {
      console.error('워크스페이스 조회 실패:', error)
      throw error // 호출부에서 처리할 수 있도록 에러 다시 던지기
    }
  }

  async createWorkspace(data: Partial<Workspace>): Promise<Workspace> {
    if (!data.name) {
      throw new Error('워크스페이스 이름은 필수입니다.')
    }

    try {
      const requestData = {
        name: data.name,
        description: data.config?.description || '',
        color: data.config?.color || '#4285f4',
      }

      console.log('워크스페이스 생성 요청 데이터:', requestData)

      const response = await axios.post('/workspaces', requestData)

      const workspace: Workspace = {
        id: response.data.id || crypto.randomUUID(),
        name: data.name,
        admin_url: 'http://192.168.31.130',
        created_at: Date.now(),
        config: {
          ...response.data,
          ...data.config,
        },
      }

      this.workspaces.push(workspace)
      return workspace
    } catch (error) {
      console.error('워크스페이스 생성 실패:', error)
      throw error
    }
  }

  async updateWorkspace(name: string, data: Partial<Workspace>): Promise<Workspace> {
    try {
      // Lua 플러그인의 워크스페이스 업데이트 엔드포인트
      const response = await axios.put(`/workspaces/${name}`, data)

      // 로컬 상태 업데이트
      const index = this.workspaces.findIndex(w => w.name === name)
      if (index !== -1) {
        this.workspaces[index] = {
          ...this.workspaces[index],
          ...response.data,
        }
        return this.workspaces[index]
      }

      return response.data
    } catch (error) {
      console.error('Failed to update workspace:', error)
      throw error
    }
  }

  async deleteWorkspace(name: string): Promise<void> {
    try {
      // Lua 플러그인의 워크스페이스 삭제 엔드포인트
      await axios.delete(`/workspaces/${name}`)

      // 로컬 상태에서 제거
      const index = this.workspaces.findIndex(w => w.name === name)
      if (index !== -1) {
        this.workspaces.splice(index, 1)
      }
    } catch (error) {
      console.error('Failed to delete workspace:', error)
      throw error
    }
  }
}

export const workspaceService = new WorkspaceService()