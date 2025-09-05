'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Progress } from './ui/progress'
import { Button } from './ui/button'
import { 
  ChartBarIcon as Chart,
  ClockIcon as Clock,
  ExclamationTriangleIcon as Alert,
  CheckCircleIcon as Check,
  ArrowPathIcon as Refresh,
  CpuChipIcon as Cpu,
  WifiIcon as Network
} from '@heroicons/react/24/outline'
import { usePerformanceMonitor } from '@/hooks/usePerformanceMonitor'
import { useToast } from '@/components/ui/use-toast'

export function PerformanceDashboard() {
  const { 
    metrics, 
    isMonitoring, 
    alerts, 
    startMonitoring, 
    stopMonitoring, 
    getPerformanceScore, 
    getPerformanceGrade,
    thresholds 
  } = usePerformanceMonitor()
  
  const { toast } = useToast()

  const handleRefresh = () => {
    if (isMonitoring) {
      stopMonitoring()
      setTimeout(() => {
        startMonitoring()
        toast({
          title: "Performance Monitoring",
          description: "Performance metrics have been refreshed",
          variant: "info"
        })
      }, 100)
    }
  }

  if (!metrics) {
    return (
      <div className="space-y-6">
        <Card className="uber-card">
          <CardContent className="p-6 text-center">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-gray-700 rounded w-1/4 mx-auto"></div>
              <div className="h-20 bg-gray-700 rounded"></div>
              <div className="h-4 bg-gray-700 rounded w-1/2 mx-auto"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const score = getPerformanceScore(metrics)
  const grade = getPerformanceGrade(score)

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-400'
    if (score >= 80) return 'text-yellow-400'
    if (score >= 70) return 'text-orange-400'
    return 'text-red-400'
  }

  const getScoreBgColor = (score: number) => {
    if (score >= 90) return 'bg-green-500/20 border-green-500/30'
    if (score >= 80) return 'bg-yellow-500/20 border-yellow-500/30'
    if (score >= 70) return 'bg-orange-500/20 border-orange-500/30'
    return 'bg-red-500/20 border-red-500/30'
  }

  return (
    <div className="space-y-6">
      {/* Performance Score */}
      <Card className={`uber-card ${getScoreBgColor(score)}`}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-2xl">Performance Score</CardTitle>
              <CardDescription>Overall application performance metrics</CardDescription>
            </div>
            <div className="text-right">
              <div className={`text-4xl font-bold ${getScoreColor(score)}`}>
                {score}
              </div>
              <div className="text-lg font-semibold text-muted-foreground">
                Grade: {grade}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Progress value={score} className="h-3" />
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Performance Score</span>
              <span className="font-medium">{score}/100</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Core Web Vitals */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="uber-card">
          <CardHeader className="space-y-2">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Page Load Time</CardTitle>
            </div>
            <CardDescription>Time to fully load the page</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold">
                {(metrics.pageLoadTime / 1000).toFixed(2)}s
              </div>
              <div className="text-sm text-muted-foreground">
                Threshold: {(thresholds.pageLoadTime / 1000).toFixed(1)}s
              </div>
              <Badge 
                variant={metrics.pageLoadTime <= thresholds.pageLoadTime ? 'default' : 'destructive'}
                className="mt-2"
              >
                {metrics.pageLoadTime <= thresholds.pageLoadTime ? (
                  <><Check className="h-3 w-3 mr-1" /> Good</>
                ) : (
                  <><Alert className="h-3 w-3 mr-1" /> Needs Improvement</>
                )}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="uber-card">
          <CardHeader className="space-y-2">
            <div className="flex items-center space-x-2">
              <Chart className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">First Contentful Paint</CardTitle>
            </div>
            <CardDescription>Time to first content render</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold">
                {(metrics.firstContentfulPaint / 1000).toFixed(2)}s
              </div>
              <div className="text-sm text-muted-foreground">
                Threshold: {(thresholds.firstContentfulPaint / 1000).toFixed(1)}s
              </div>
              <Badge 
                variant={metrics.firstContentfulPaint <= thresholds.firstContentfulPaint ? 'default' : 'destructive'}
                className="mt-2"
              >
                {metrics.firstContentfulPaint <= thresholds.firstContentfulPaint ? (
                  <><Check className="h-3 w-3 mr-1" /> Good</>
                ) : (
                  <><Alert className="h-3 w-3 mr-1" /> Needs Improvement</>
                )}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="uber-card">
          <CardHeader className="space-y-2">
            <div className="flex items-center space-x-2">
              <Chart className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Largest Contentful Paint</CardTitle>
            </div>
            <CardDescription>Time to largest content render</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold">
                {(metrics.largestContentfulPaint / 1000).toFixed(2)}s
              </div>
              <div className="text-sm text-muted-foreground">
                Threshold: {(thresholds.largestContentfulPaint / 1000).toFixed(1)}s
              </div>
              <Badge 
                variant={metrics.largestContentfulPaint <= thresholds.largestContentfulPaint ? 'default' : 'destructive'}
                className="mt-2"
              >
                {metrics.largestContentfulPaint <= thresholds.largestContentfulPaint ? (
                  <><Check className="h-3 w-3 mr-1" /> Good</>
                ) : (
                  <><Alert className="h-3 w-3 mr-1" /> Needs Improvement</>
                )}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="uber-card">
          <CardHeader className="space-y-2">
            <div className="flex items-center space-x-2">
              <Alert className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Cumulative Layout Shift</CardTitle>
            </div>
            <CardDescription>Visual stability metric</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold">
                {metrics.cumulativeLayoutShift.toFixed(3)}
              </div>
              <div className="text-sm text-muted-foreground">
                Threshold: {thresholds.cumulativeLayoutShift}
              </div>
              <Badge 
                variant={metrics.cumulativeLayoutShift <= thresholds.cumulativeLayoutShift ? 'default' : 'destructive'}
                className="mt-2"
              >
                {metrics.cumulativeLayoutShift <= thresholds.cumulativeLayoutShift ? (
                  <><Check className="h-3 w-3 mr-1" /> Good</>
                ) : (
                  <><Alert className="h-3 w-3 mr-1" /> Needs Improvement</>
                )}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="uber-card">
          <CardHeader className="space-y-2">
            <div className="flex items-center space-x-2">
              <Cpu className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Time to Interactive</CardTitle>
            </div>
            <CardDescription>Time until page is fully interactive</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold">
                {(metrics.timeToInteractive / 1000).toFixed(2)}s
              </div>
              <div className="text-sm text-muted-foreground">
                Threshold: {(thresholds.timeToInteractive / 1000).toFixed(1)}s
              </div>
              <Badge 
                variant={metrics.timeToInteractive <= thresholds.timeToInteractive ? 'default' : 'destructive'}
                className="mt-2"
              >
                {metrics.timeToInteractive <= thresholds.timeToInteractive ? (
                  <><Check className="h-3 w-3 mr-1" /> Good</>
                ) : (
                  <><Alert className="h-3 w-3 mr-1" /> Needs Improvement</>
                )}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="uber-card">
          <CardHeader className="space-y-2">
            <div className="flex items-center space-x-2">
              <Network className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Memory Usage</CardTitle>
            </div>
            <CardDescription>JavaScript heap memory usage</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold">
                {metrics.memoryUsage ? `${(metrics.memoryUsage / 1024 / 1024).toFixed(1)} MB` : 'N/A'}
              </div>
              <div className="text-sm text-muted-foreground">
                Browser memory usage
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <Card className="uber-card border-destructive/20">
          <CardHeader>
            <CardTitle className="text-destructive flex items-center space-x-2">
              <Alert className="h-5 w-5" />
              <span>Performance Alerts</span>
            </CardTitle>
            <CardDescription>Issues that need attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {alerts.map((alert, index) => (
                <div key={index} className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <p className="text-sm text-destructive">{alert}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Monitoring Controls */}
      <Card className="uber-card">
        <CardHeader>
          <CardTitle>Monitoring Controls</CardTitle>
          <CardDescription>Manage performance monitoring</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${isMonitoring ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`}></div>
              <span className="text-sm font-medium">
                {isMonitoring ? 'Monitoring Active' : 'Monitoring Stopped'}
              </span>
            </div>
            <Button
              variant="outline"
              onClick={handleRefresh}
              className="btn-hover"
            >
              <Refresh className="h-4 w-4 mr-2" />
              Refresh Metrics
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
