'use client'

import { useLivePreview } from '@payloadcms/live-preview-react'
import { useEffect, useState } from 'react'
import { use } from 'react'
import type { Test } from '@/payload-types'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { cn } from '@/lib/utils'

export default function TestPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [initialData, setInitialData] = useState<Test | null>(null)

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/Tests/${id}?draft=true`, {
          credentials: 'include',
        })
        if (res.ok) {
          const data = await res.json()
          setInitialData(data)
        }
      } catch (error) {
        console.error('Error fetching test:', error)
      }
    }
    fetchData()
  }, [id])

  // Live preview hook
  const { data } = useLivePreview<Test>({
    initialData: initialData as Test,
    serverURL: process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000',
    depth: 2,
  })

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-muted-foreground">Loading...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-3xl">{data.text || 'Untitled Test'}</CardTitle>
            <Badge variant={data._status === 'published' ? 'default' : 'secondary'}>
              {data._status === 'published' ? 'Published' : 'Draft'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Text Fields */}
          {data.textarea && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">Textarea</h3>
              <p className="text-foreground whitespace-pre-wrap">{data.textarea}</p>
              <Separator />
            </div>
          )}

          {data.email && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
              <p className="text-foreground">{data.email}</p>
              <Separator />
            </div>
          )}

          {/* Number Fields */}
          {data.number !== undefined && data.number !== null && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">Number</h3>
              <p className="text-foreground">{data.number}</p>
              <Separator />
            </div>
          )}

          {/* Date Fields */}
          {data.date && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">Date</h3>
              <p className="text-foreground">{new Date(data.date).toLocaleDateString()}</p>
              <Separator />
            </div>
          )}

          {/* Checkbox */}
          {data.checkbox !== undefined && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">Checkbox</h3>
              <p className="text-foreground">{data.checkbox ? 'Yes' : 'No'}</p>
              <Separator />
            </div>
          )}

          {/* Select */}
          {data.select && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">Select</h3>
              <p className="text-foreground capitalize">{data.select}</p>
              <Separator />
            </div>
          )}

          {/* JSON Display for debugging */}
          <Collapsible>
            <CollapsibleTrigger className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
              View Raw Data
            </CollapsibleTrigger>
            <CollapsibleContent>
              <pre className="mt-2 p-4 bg-muted rounded-lg overflow-auto text-xs text-foreground">
                {JSON.stringify(data, null, 2)}
              </pre>
            </CollapsibleContent>
          </Collapsible>
        </CardContent>
      </Card>
    </div>
  )
}
