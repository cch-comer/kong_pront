<!-- eslint-disable -->
 <template>
  <div class="workspace-container">
    <div class="workspace-header">
      <h1>Workspaces</h1>
      <KButton
        appearance="primary"
        class="new-workspace-btn"
        @click="router.push('/workspaces/create')"
      >
        New Workspace
      </KButton>
    </div>

    <div class="overview-section">
      <h2>Overview</h2>
      <div class="metrics-container">
        <div class="metrics-card">
          <div class="metric-item">
            <div class="blue-bar"></div>
            <div class="metric-content">
              <div class="metric-title">
                <span>API Services</span>
                <div class="metric-help">
                  <div class="custom-tooltip">
                    <img src="@/assets/metric-help-icon.svg" alt="이미지" class="metric-help-icon" width="16" height="16"/>
                    <div class="tooltip-text">The number of API services configured in Kong.</div>
                  </div>
                </div>
              </div>
              <div class="metric-number" data-testid="api-services-count">{{ apiServicesCount }}</div>
            </div>
          </div>
        </div>
        <div class="metrics-card">
          <div class="metric-item">
            <div class="blue-bar"></div>
            <div class="metric-content">
              <div class="metric-title">
                <span>API Consumers</span>
                <div class="metric-help">
                  <div class="custom-tooltip">
                    <img src="@/assets/metric-help-icon.svg" alt="이미지" class="metric-help-icon" width="16" height="16"/>
                    <div class="tooltip-text">The number of API consumers configured in Kong.</div>
                  </div>
                </div>
              </div>
              <div class="metric-number" data-testid="api-consumers-count">{{ apiConsumersCount }}</div>
            </div>
          </div>
        </div>
        <div class="metrics-card">
          <div class="metric-item">
            <div class="blue-bar"></div>
            <div class="metric-content">
              <div class="metric-title">
                <span>API Requests</span>
                <div class="metric-help">
                  <div class="custom-tooltip">
                    <img src="@/assets/metric-help-icon.svg" alt="이미지" class="metric-help-icon" width="16" height="16" />
                    <div class="tooltip-text">The number of API requests proxied through Kong.</div>
                  </div>
                </div>
              </div>
              <div class="metric-number" data-testid="api-requests-count">{{ apiRequestsCount }}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="traffic-section">
        <div class="traffic-metrics">
          <div 
            class="traffic-metric-item"
            :class="{ active: selectedMetric === 'traffic' }"
            @click="selectedMetric = 'traffic'"
          >
            <div class="metric-label">
              <span>Total traffic</span>
              <img src="@/assets/metric-help-icon.svg" alt="이미지" class="metric-help-icon" width="16" height="16" />
            </div>
            <div class="metric-value" data-testid="total-traffic-count">0</div>
          </div>
          <div 
            class="traffic-metric-item"
            :class="{ active: selectedMetric === 'latency' }"
            @click="selectedMetric = 'latency'"
          >
            <div class="metric-label">
              <span>Latency</span>
              <img src="@/assets/metric-help-icon.svg" alt="이미지" class="metric-help-icon" width="16" height="16" />
            </div>
            <div class="metric-value" data-testid="latency-value">-</div>
          </div>
        </div>

        <div class="traffic-controls">
          <KSelect
            v-model="selectedTimeframe"
            :items="timeframeOptions"
            class="timeframe-select"
            data-testid="timeframe-select"
          />
          <KCheckbox v-model="isUtc" class="utc-checkbox" data-testid="utc-checkbox">UTC</KCheckbox>
        </div>

        <div class="chart-container">
          <div v-if="selectedMetric === 'traffic'" class="traffic-chart">
            <div v-if="!hasData" class="no-data">
              <div class="no-data-text">
                <p>No data available</p>
                <p class="sub-text">Try using a longer timeframe</p>
              </div>
              <div class="chart-background" :style="{ 'background-image': `url(${placeholderImg})` }"></div>
            </div>
          </div>
          <div v-else class="latency-chart">
            <div v-if="!hasData" class="latency-no-data">
              <div class="latency-grid">
                <div class="latency-y-axis">
                  <div>1 ms</div>
                  <div>0 ms</div>
                </div>
                <div class="latency-x-axis">
                  <div>4:50:00 pm</div>
                  <div>4:51:00 pm</div>
                  <div>4:52:00 pm</div>
                  <div>4:53:00 pm</div>
                  <div>4:54:00 pm</div>
                </div>
                <div class="latency-table">
                  <div class="latency-header">
                    <div>Hostname</div>
                    <div>ID</div>
                    <div>AVG</div>
                    <div>Min</div>
                    <div>Max</div>
                  </div>
                  <div class="latency-row">
                    <div>cluster</div>
                    <div>-</div>
                    <div>-</div>
                    <div>-</div>
                    <div>-</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="workspaces-section">
      <div class="workspaces-header">
        <h2>Workspaces</h2>
        <div class="view-toggle">
          <span>View:</span>
          <div class="toggle-buttons">
            <button 
              :class="['toggle-btn', { active: viewMode === 'grid' }]" 
              @click="viewMode = 'grid'"
            >
              <i class="grid-icon"></i>
            </button>
            <button 
              :class="['toggle-btn', { active: viewMode === 'list' }]" 
              @click="viewMode = 'list'"
            >
              <i class="list-icon"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Grid View -->
      <div v-if="viewMode === 'grid'" class="workspaces-grid">
        <div v-for="workspace in workspaces" :key="workspace.id" class="workspace-card">
          <div class="workspace-header">
            <div class="workspace-tag" :class="workspace.tag.toLowerCase()">{{ workspace.tag }}</div>
            <div class="workspace-name">{{ workspace.name }}</div>
          </div>
          <div class="workspace-stats">
            <div class="stat-item">
              <span class="stat-value">{{ workspace.requests }}</span>
              <span class="stat-label">Requests</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">{{ workspace.errorRate }}%</span>
              <span class="stat-label">Error Rate</span>
            </div>
          </div>
          <div class="workspace-chart">
            <div v-if="workspace.hasData" class="chart-placeholder"></div>
            <div v-else class="workspace-no-data">
              <div class="workspace-no-data-text">
                <p>Add a Gateway Service to see its traffic here</p>
              </div>
              <div class="workspace-chart-background" :style="{ 'background-image': `url(${placeholderImg})` }"></div>
            </div>
          </div>
          <div class="workspace-footer">
            <div class="footer-stat">
              <span>{{ workspace.consumers }}</span> Consumers
            </div>
            <div class="footer-stat">
              <span>{{ workspace.gatewayServices }}</span> Gateway Services
            </div>
          </div>
        </div>
      </div>

      <!-- List View -->
      <div v-else class="workspaces-list">
        <table>
          <thead>
            <tr>
              <th>Workspace</th>
              <th>Requests</th>
              <th>Error Rate</th>
              <th>Consumers</th>
              <th>Gateway Services</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="workspace in workspaces" :key="workspace.id">
              <td>
                <div class="workspace-info">
                  <div class="workspace-tag" :class="workspace.tag.toLowerCase()">{{ workspace.tag }}</div>
                  <span>{{ workspace.name }}</span>
                </div>
              </td>
              <td>{{ workspace.requests }}</td>
              <td>{{ workspace.errorRate }}%</td>
              <td>{{ workspace.consumers }}</td>
              <td>{{ workspace.gatewayServices }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import placeholderImg from '@/assets/vitals-empty-placeholder-lrg.1edfaf8a.3_4_3_14.png'
import { ref, onMounted, computed } from 'vue'
//import axios from 'axios'
import { useRouter } from 'vue-router'
import { workspaceService } from '@/services/workspacesService'
import {
  KButton,
  KCheckbox,
} from '@kong/kongponents'

const isUtc = ref(false)
const hasData = ref(false)

const selectedMetric = ref('traffic') // 'traffic' or 'latency'

const viewMode = ref('grid')

// 기존 timeframeOptions 유지
const timeframeOptions = [
  { label: '1시간', value: '1h' },
  { label: '24시간', value: '24h' },
  { label: '7일', value: '7d' },
  { label: '30일', value: '30d' },
]

// 현재 선택된 timeframe
const selectedTimeframe = ref(timeframeOptions[1].value)

// 워크스페이스 인터페이스 정의
interface Workspace {
  id: string
  tag: string
  name: string
  requests: number
  errorRate: number
  consumers: number
  gatewayServices: number
  hasData: boolean
}

// 워크스페이스 상태 정의
const workspaces = ref<Workspace[]>([
  {
    id: 'default',
    tag: 'DE',
    name: 'default',
    requests: 0,
    errorRate: 0,
    consumers: 0,
    gatewayServices: 0,
    hasData: false,
  },
])

// 계산된 속성으로 서비스, 컨슈머, 요청 수 계산
const apiServicesCount = computed(() =>
  workspaces.value.reduce((sum, workspace) => sum + workspace.gatewayServices, 0),
)

const apiConsumersCount = computed(() =>
  workspaces.value.reduce((sum, workspace) => sum + workspace.consumers, 0),
)

const apiRequestsCount = computed(() =>
  workspaces.value.reduce((sum, workspace) => sum + workspace.requests, 0),
)

// 로딩 및 에러 상태 관리
const isLoading = ref(false)
const error = ref<string | null>(null)

// 워크스페이스 데이터 가져오는 함수
const fetchWorkspaces = async () => {
  try {
    isLoading.value = true
    error.value = null
    //const kongAdminBaseUrl = 'http://192.168.31.130:8001'

    /*
    // Services 정보 가져오기
    const servicesResponse = await axios.get(`${kongAdminBaseUrl}/services`)
    const services = servicesResponse.data.data

    // Consumers 정보 가져오기
    const consumersResponse = await axios.get(`${kongAdminBaseUrl}/consumers`)
    const consumers = consumersResponse.data.data

    // Routes 정보 가져오기
    const routesResponse = await axios.get(`${kongAdminBaseUrl}/routes`)
    const routes = routesResponse.data.data
    */

    const fetchedWorkspaces = await workspaceService.getAllWorkspaces()

    workspaces.value = [] // 먼저 배열 초기화
    if (fetchedWorkspaces.length > 0) {
      for (var i = 0; i < fetchedWorkspaces.length; i++) {
        workspaces.value.push({
          id: fetchedWorkspaces[i].id || `workspace-${i + 1}`,
          tag: fetchedWorkspaces[i].name.substring(0, 2).toUpperCase() || `workspace-${i + 1}`,
          name: fetchedWorkspaces[i].name || `workspace-${i + 1}`,
          requests: 0, // 실제 요청 수를 알 수 없다면 0으로 초기화
          errorRate: 0,
          consumers: 0, // 실제 컨슈머 수를 알 수 없다면 0으로 초기화
          gatewayServices: 1, // 기본값 설정
          hasData: true,
          //config: fetchedWorkspaces[i].config // 추가 정보 포함
        })
      }
    } else {
      workspaces.value = [
        {
          id: 'default',
          tag: 'DE',
          name: 'default',
          requests: 0,
          errorRate: 0,
          consumers: 0,
          gatewayServices: 0,
          hasData: false,
        },
      ]
    }


    console.log('Fetched Workspaces:', workspaces.value)
  } catch (err) {
    console.error('워크스페이스 정보를 가져오는 중 오류 발생:', err)
    error.value = '데이터를 불러오는 데 실패했습니다.'
  } finally {
    isLoading.value = false
  }
}

// 라우터 초기화
const router = useRouter()

/*
// 워크스페이스 상세 페이지로 이동
const navigateToWorkspaceDetail = (workspace: Workspace) => {
  router.push({
    name: 'WorkspaceDetail',
    params: {
      workspaceId: workspace.id
    }
  })
}
*/

// 컴포넌트 마운트 시 워크스페이스 데이터 로드
onMounted(() => {
  fetchWorkspaces()
})

// 컴포넌트 옵션 정의
defineOptions({
  name: 'WorkspaceOverview',
})
</script>

<style scoped>
.workspace-container {
  padding: 24px;
  min-height: 100vh;
}

.workspace-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}

.workspace-header h1 {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  color: #1a1c1e;
}

.new-workspace-btn {
  padding: 8px 16px;
  font-weight: 500;
  border-radius: var(--kui-border-radius-round, 100px);
}

.overview-section h2 {
  margin: 0 0 24px 0;
  font-size: 18px;
  font-weight: 600;
  color: #1a1c1e;
}

.metrics-container {
  display: flex;
  gap: 24px;
  margin-bottom: 32px;
}

.metrics-card {
  background: #fff;
  border-radius: 3px;
  padding: 16px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
  width: 255px;
}

.metric-item {
  flex: 1;
  padding: 16px;
  border-left: 4px solid transparent;
  cursor: pointer;
  transition: all 0.2s ease;
}

.metric-item:hover {
  background: #f8f9fa;
}

.metric-item.active {
  border-left-color: #1155cb;
  background: #f8f9fa;
}

.metric-item:not(:last-child) {
  border-right: 1px solid #eee;
}

.metric-content {
  flex: 1;
}

.metric-title {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 8px;
}

.metric-text {
  color: #5c6370;
  font-size: 14px;
}

.metric-help {
  display: flex;
  align-items: center;
}

.metric-help-icon {
  cursor: pointer;
  width: 16px;
  height: 16px;
  opacity: 0.5;
}

.metric-number {
  font-size: 24px;
  font-weight: 600;
  color: #1f2937;
}

.traffic-section {
  margin-top: 24px;
}

.traffic-metrics {
  display: flex;
  gap: 1px;
  background: #eee;
  margin-bottom: 16px;
}

.traffic-metric-item {
  flex: 1;
  padding: 16px 24px;
  background: white;
  cursor: pointer;
}

.traffic-metric-item:hover {
  background: #f8f9fa;
}

.traffic-metric-item.active {
  background: #f8f9fa;
}

.metric-label {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #666;
  margin-bottom: 8px;
}


.metric-value {
  font-size: 24px;
  font-weight: 500;
  color: #333;
}

.traffic-controls {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}

.timeframe-select {
  width: 160px;
}

.chart-container {
  height: 400px;
  position: relative;
  background: #f8f9fa;
  border-radius: 8px;
  overflow: hidden;
}

.traffic-chart {
  height: 100%;
  position: relative;
  background: #f8f9fa;
  border-radius: 8px;
  overflow: hidden;
}

.no-data {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
}

.no-data-text {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
}

.chart-background {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60%;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: bottom;
}

.no-data p {
  margin: 0;
  color: #666;
}

.no-data .sub-text {
  font-size: 12px;
  margin-top: 4px;
  color: #999;
}

.utc-checkbox {
  margin: 0;
}

.custom-tooltip {
  position: relative;
  display: inline-block;
}

.custom-tooltip .tooltip-text {
  visibility: hidden;
  position: absolute;
  z-index: 1;
  bottom: 125%;
  left: 50%;
  transform: translateX(-50%);
  background: rgb(58, 66, 88);
  color: #ffffff;
  padding: 8px 12px;
  border-radius: 3px;
  font-size: 12px;
  line-height: 1.4;
  width: max-content;
  max-width: 280px;
  opacity: 0;
  transition: opacity 0.3s;
}

.custom-tooltip:hover .tooltip-text {
  visibility: visible;
  opacity: 1;
}

.custom-tooltip .tooltip-text::after {
  content: "";
  position: absolute;
  top: 100%;
  left: 50%;
  margin-left: -5px;
  border-width: 5px;
  border-style: solid;
  border-color: rgb(58, 66, 88) transparent transparent transparent;
}

.latency-chart {
  height: 100%;
  background: white;
  border-radius: 8px;
  padding: 24px;
}

.latency-no-data {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.latency-grid {
  flex: 1;
  display: grid;
  grid-template-rows: 1fr auto auto;
  gap: 24px;
}

.latency-y-axis {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 16px 0;
  color: #666;
  font-size: 12px;
}

.latency-x-axis {
  display: flex;
  justify-content: space-between;
  color: #666;
  font-size: 12px;
  padding: 0 16px;
}

.latency-table {
  border-top: 1px solid #eee;
  padding-top: 16px;
}

.latency-header {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
  gap: 16px;
  padding: 8px 16px;
  font-weight: 500;
  color: #666;
}

.latency-row {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
  gap: 16px;
  padding: 8px 16px;
  color: #666;
}

.workspaces-section {
  margin-top: 32px;
}

.workspaces-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.view-toggle {
  display: flex;
  align-items: center;
  gap: 8px;
}

.view-toggle span {
  color: #666;
}

.toggle-buttons {
  display: flex;
  gap: 4px;
}

.toggle-btn {
  padding: 6px;
  border: 1px solid #ddd;
  background: white;
  cursor: pointer;
  border-radius: 4px;
}

.toggle-btn.active {
  background: #f0f0f0;
}

.grid-icon, .list-icon {
  display: inline-block;
  width: 16px;
  height: 16px;
  background-size: contain;
}

.grid-icon {
  background-image: url('data:image/svg+xml,<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M3 3h7v7H3V3zm11 0h7v7h-7V3zm0 11h7v7h-7v-7z" fill="%23666"/></svg>');
}

.list-icon {
  background-image: url('data:image/svg+xml,<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M3 4h18v2H3V4zm0 7h18v2H3v-2zm0 7h18v2H3v-2z" fill="%23666"/></svg>');
}

.workspaces-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
}

.workspace-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
  padding: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.workspace-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-1px);
}



.workspace-tag {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  color: white;
  background: #4284F4;
}
.workspace-name {
  font-weight: 500;
  color: #1f2937;
}

.workspace-stats {
  display: flex;
  gap: 24px;
  margin-bottom: 16px;
}

.stat-item {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 14px;
  font-weight: 500;
  color: #1f2937;
}

.stat-label {
  font-size: 12px;
  color: #666;
}

.workspace-chart {
  height: 120px;
  position: relative;
  background: #f9fafb;
  border-radius: 4px;
  margin-bottom: 16px;
  overflow: hidden;
}

.workspace-no-data {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
}

.workspace-no-data-text {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
  font-size: 12px;
  color: #666;
}

.workspace-chart-background {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60%;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: bottom;
}

.workspace-footer {
  display: flex;
  gap: 24px;
  color: #666;
  font-size: 12px;
}

.footer-stat span {
  color: #1f2937;
  font-weight: 500;
}

/* List View Styles */
.workspaces-list {
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
}

.workspaces-list table {
  width: 100%;
  border-collapse: collapse;
}

.workspaces-list th {
  text-align: left;
  padding: 12px 16px;
  font-weight: 500;
  color: #666;
  border-bottom: 1px solid #eee;
}

.workspaces-list td {
  padding: 12px 16px;
  border-bottom: 1px solid #eee;
}

.workspace-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.workspaces-list tr {
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.workspaces-list tr:hover {
  background-color: #f8f9fa;
}
</style>
