import { useState, useEffect } from 'react'

interface Job {
  id: string
  name: string
}

export const useJobs = () => {
  const [jobs, setJobs] = useState<Job[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchJobs = async () => {
      setIsLoading(true)
      try {
        const response = await fetch('https://static.giotmauvang.org.vn/ihpstatic/ihp_job.json')
        if (!response.ok) throw new Error('Failed to fetch jobs')
        const data = await response.json()
        setJobs(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error fetching jobs')
      } finally {
        setIsLoading(false)
      }
    }

    fetchJobs()
  }, [])

  return { jobs, isLoading, error }
}
