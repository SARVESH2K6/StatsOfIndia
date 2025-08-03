import { useState, useEffect } from "react"
import { Button } from "./ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"
import { Badge } from "./ui/badge"
import { Alert, AlertDescription } from "./ui/alert"
import { 
  FileText, 
  Download, 
  Eye, 
  EyeOff, 
  ChevronDown, 
  ChevronUp,
  BarChart3,
  Calendar,
  Database,
  Loader2
} from "lucide-react"

interface CSVPreviewProps {
  datasetId: string
  fileId: string
  fileName: string
  fileType: string
  fileSize: number
  onClose: () => void
}

interface PreviewData {
  headers: string[]
  rows: string[][]
  totalRows: number
  totalColumns: number
  hasMoreRows: boolean
}

interface FileStats {
  totalRows: number
  totalColumns: number
  fileSize: number
  lastModified: string
}

interface PreviewResponse {
  fileName: string
  fileType: string
  fileSize: number
  preview: PreviewData
  stats: FileStats
}

export default function CSVPreview({ 
  datasetId, 
  fileId, 
  fileName, 
  fileType, 
  fileSize, 
  onClose 
}: CSVPreviewProps) {
  const [previewData, setPreviewData] = useState<PreviewResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showAllRows, setShowAllRows] = useState(false)
  const [maxRows, setMaxRows] = useState(10)

  useEffect(() => {
    fetchPreviewData()
  }, [datasetId, fileId, maxRows])

  const fetchPreviewData = async () => {
    try {
      setLoading(true)
      setError("")
      
      const response = await fetch(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/datasets/${datasetId}/preview/${fileId}?maxRows=${maxRows}`
      )
      
      const data = await response.json()
      
      if (data.success) {
        setPreviewData(data.data)
      } else {
        setError(data.message || 'Failed to load preview')
      }
    } catch (error) {
      setError('Error connecting to server')
    } finally {
      setLoading(false)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const handleLoadMore = () => {
    setMaxRows(prev => prev + 10)
  }

  const handleShowAll = () => {
    setShowAllRows(!showAllRows)
  }

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-blue-600" />
                <CardTitle>CSV Preview</CardTitle>
              </div>
              <Button variant="ghost" size="sm" onClick={onClose}>
                ×
              </Button>
            </div>
            <CardDescription>{fileName}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              <span className="ml-2 text-gray-600">Loading preview...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-blue-600" />
                <CardTitle>CSV Preview</CardTitle>
              </div>
              <Button variant="ghost" size="sm" onClick={onClose}>
                ×
              </Button>
            </div>
            <CardDescription>{fileName}</CardDescription>
          </CardHeader>
          <CardContent>
            <Alert>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            <div className="mt-4 flex space-x-2">
              <Button onClick={fetchPreviewData} variant="outline">
                Try Again
              </Button>
              <Button onClick={onClose}>
                Close
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!previewData) {
    return null
  }

  const { preview, stats } = previewData
  const displayRows = showAllRows ? preview.rows : preview.rows.slice(0, 10)

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-6xl max-h-[90vh] overflow-hidden">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-blue-600" />
              <CardTitle>CSV Preview</CardTitle>
              <Badge variant="outline">{fileType.toUpperCase()}</Badge>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              ×
            </Button>
          </div>
          <CardDescription>{fileName}</CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* File Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center space-x-2">
              <Database className="w-4 h-4 text-blue-600" />
              <div>
                <p className="text-xs text-gray-500">Total Rows</p>
                <p className="font-medium">{stats.totalRows.toLocaleString()}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <BarChart3 className="w-4 h-4 text-green-600" />
              <div>
                <p className="text-xs text-gray-500">Total Columns</p>
                <p className="font-medium">{stats.totalColumns}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Download className="w-4 h-4 text-purple-600" />
              <div>
                <p className="text-xs text-gray-500">File Size</p>
                <p className="font-medium">{formatFileSize(stats.fileSize)}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-orange-600" />
              <div>
                <p className="text-xs text-gray-500">Last Modified</p>
                <p className="font-medium text-xs">
                  {new Date(stats.lastModified).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Preview Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">
                Showing {displayRows.length} of {preview.totalRows} rows
              </span>
              {preview.hasMoreRows && (
                <Badge variant="secondary">
                  {preview.totalRows - displayRows.length} more rows available
                </Badge>
              )}
            </div>
            <div className="flex items-center space-x-2">
              {preview.rows.length > 10 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleShowAll}
                >
                  {showAllRows ? (
                    <>
                      <EyeOff className="w-4 h-4 mr-2" />
                      Show Less
                    </>
                  ) : (
                    <>
                      <Eye className="w-4 h-4 mr-2" />
                      Show All
                    </>
                  )}
                </Button>
              )}
              {preview.hasMoreRows && !showAllRows && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLoadMore}
                >
                  <ChevronDown className="w-4 h-4 mr-2" />
                  Load More
                </Button>
              )}
            </div>
          </div>

          {/* CSV Table */}
          <div className="border rounded-lg overflow-hidden">
            <div className="overflow-x-auto max-h-96">
              <Table>
                <TableHeader>
                  <TableRow>
                    {preview.headers.map((header, index) => (
                      <TableHead key={index} className="bg-gray-50 dark:bg-gray-800 font-medium">
                        {header}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {displayRows.map((row, rowIndex) => (
                    <TableRow key={rowIndex}>
                      {row.map((cell, cellIndex) => (
                        <TableCell key={cellIndex} className="max-w-xs truncate">
                          {cell}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>
              Preview generated on {new Date().toLocaleString()}
            </span>
            <span>
              {preview.totalColumns} columns × {preview.totalRows} rows
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 