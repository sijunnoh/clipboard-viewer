import { Component } from "react"
import type { ErrorInfo, ReactNode } from "react"

import { AlertTriangleIcon, RotateCcwIcon } from "lucide-react"

import { Button } from "@/components/ui/button"

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-screen w-screen items-center justify-center bg-gray-50">
          <div className="max-w-md space-y-4 rounded-lg border bg-white p-8 text-center shadow-lg">
            <AlertTriangleIcon className="mx-auto h-12 w-12 text-amber-500" />
            <h2 className="text-lg font-semibold text-gray-800">
              Something went wrong
            </h2>
            <p className="text-sm text-gray-600">
              An unexpected error occurred. Please try refreshing the page.
            </p>
            {this.state.error && (
              <pre className="max-h-32 overflow-auto rounded bg-gray-100 p-3 text-left text-xs text-gray-700">
                {this.state.error.message}
              </pre>
            )}
            <Button onClick={this.handleReset} className="gap-2">
              <RotateCcwIcon className="h-4 w-4" />
              Try Again
            </Button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
