// Validic Health Data Integration
// Sandbox: 28 days remaining - MAX utilization!

export interface ValidicConfig {
  organizationId: string
  apiKey: string
  baseUrl: string
}

const config: ValidicConfig = {
  organizationId: process.env.VALIDIC_ORGANIZATION_ID!,
  apiKey: process.env.VALIDIC_API_KEY!,
  baseUrl: process.env.VALIDIC_BASE_URL || 'https://api.validic.com/v1',
}

export interface ValidicUser {
  uid: string
  marketplace: {
    token: string
    url: string
  }
}

export interface ValidicRoutine {
  id: string
  type: string
  log_id: string
  source: string
  source_name: string
  timestamp: string
  utc_offset: string
  metrics: {
    steps?: number
    distance?: number
    floors?: number
    elevation?: number
    calories_burned?: number
    active_duration?: number
  }
}

export interface ValidicBiometrics {
  id: string
  type: string
  log_id: string
  source: string
  source_name: string
  timestamp: string
  utc_offset: string
  metrics: {
    heart_rate?: number
    blood_pressure_systolic?: number
    blood_pressure_diastolic?: number
    body_temperature?: number
    oxygen_saturation?: number
    respiratory_rate?: number
  }
}

export interface ValidicSleep {
  id: string
  type: string
  log_id: string
  source: string
  source_name: string
  start_time: string
  end_time: string
  utc_offset: string
  metrics: {
    total_sleep?: number
    awake?: number
    deep?: number
    light?: number
    rem?: number
    times_awoken?: number
    sleep_efficiency?: number
  }
}

class ValidicClient {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${config.baseUrl}${endpoint}`

    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })

    if (!response.ok) {
      throw new Error(`Validic API error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  // Create a new Validic user
  async createUser(externalUserId: string): Promise<ValidicUser> {
    const response = await this.request<{ user: ValidicUser }>(
      `/organizations/${config.organizationId}/users`,
      {
        method: 'POST',
        body: JSON.stringify({
          user: {
            uid: externalUserId,
          },
        }),
      }
    )
    return response.user
  }

  // Get user marketplace URL for connecting devices
  async getMarketplaceUrl(validicUserId: string): Promise<string> {
    const response = await this.request<{ user: ValidicUser }>(
      `/organizations/${config.organizationId}/users/${validicUserId}`,
      { method: 'GET' }
    )
    return response.user.marketplace.url
  }

  // Get routine data (steps, activity)
  async getRoutines(
    validicUserId: string,
    startDate: string,
    endDate: string
  ): Promise<ValidicRoutine[]> {
    const params = new URLSearchParams({
      start_date: startDate,
      end_date: endDate,
    })

    const response = await this.request<{ routine: ValidicRoutine[] }>(
      `/organizations/${config.organizationId}/users/${validicUserId}/routine?${params}`,
      { method: 'GET' }
    )
    return response.routine
  }

  // Get biometrics data (heart rate, blood pressure, etc.)
  async getBiometrics(
    validicUserId: string,
    startDate: string,
    endDate: string
  ): Promise<ValidicBiometrics[]> {
    const params = new URLSearchParams({
      start_date: startDate,
      end_date: endDate,
    })

    const response = await this.request<{ biometrics: ValidicBiometrics[] }>(
      `/organizations/${config.organizationId}/users/${validicUserId}/biometrics?${params}`,
      { method: 'GET' }
    )
    return response.biometrics
  }

  // Get sleep data
  async getSleep(
    validicUserId: string,
    startDate: string,
    endDate: string
  ): Promise<ValidicSleep[]> {
    const params = new URLSearchParams({
      start_date: startDate,
      end_date: endDate,
    })

    const response = await this.request<{ sleep: ValidicSleep[] }>(
      `/organizations/${config.organizationId}/users/${validicUserId}/sleep?${params}`,
      { method: 'GET' }
    )
    return response.sleep
  }

  // Delete user
  async deleteUser(validicUserId: string): Promise<void> {
    await this.request(
      `/organizations/${config.organizationId}/users/${validicUserId}`,
      { method: 'DELETE' }
    )
  }

  // Disconnect a source
  async disconnectSource(validicUserId: string, sourceType: string): Promise<void> {
    await this.request(
      `/organizations/${config.organizationId}/users/${validicUserId}/sources/${sourceType}`,
      { method: 'DELETE' }
    )
  }

  // Get connected sources for a user
  async getConnectedSources(validicUserId: string): Promise<string[]> {
    const response = await this.request<{ sources: { type: string }[] }>(
      `/organizations/${config.organizationId}/users/${validicUserId}/sources`,
      { method: 'GET' }
    )
    return response.sources.map(s => s.type)
  }
}

export const validicClient = new ValidicClient()

// Helper to sync all health data for a user
export async function syncAllHealthData(
  validicUserId: string,
  days: number = 7
): Promise<{
  routines: ValidicRoutine[]
  biometrics: ValidicBiometrics[]
  sleep: ValidicSleep[]
}> {
  const endDate = new Date().toISOString().split('T')[0]
  const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
    .toISOString()
    .split('T')[0]

  const [routines, biometrics, sleep] = await Promise.all([
    validicClient.getRoutines(validicUserId, startDate, endDate),
    validicClient.getBiometrics(validicUserId, startDate, endDate),
    validicClient.getSleep(validicUserId, startDate, endDate),
  ])

  return { routines, biometrics, sleep }
}
