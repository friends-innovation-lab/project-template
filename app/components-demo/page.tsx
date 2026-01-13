'use client'
import { useState } from 'react'
import { 
  Button, 
  Input, 
  Select, 
  Textarea,
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter,
  Badge,
  Alert,
  StatCard,
  Avatar,
  Modal,
  Spinner,
  EmptyState
} from '@/components/ui'

export default function ComponentsDemo() {
  const [modalOpen, setModalOpen] = useState(false)
  
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 space-y-12">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Component Library</h1>
          <p className="mt-2 text-gray-600">All available UI components</p>
        </div>
        
        {/* Buttons */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Buttons</h2>
          <div className="flex flex-wrap gap-4">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Destructive</Button>
            <Button disabled>Disabled</Button>
          </div>
          <div className="flex flex-wrap gap-4 mt-4">
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
          </div>
        </section>
        
        {/* Form Inputs */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Form Inputs</h2>
          <div className="grid gap-4 max-w-md">
            <Input label="Email" type="email" placeholder="you@example.com" />
            <Input label="With error" error="This field is required" />
            <Input label="With hint" hint="We'll never share your email" />
            <Select 
              label="Select option" 
              options={[
                { value: '', label: 'Choose one...' },
                { value: '1', label: 'Option 1' },
                { value: '2', label: 'Option 2' },
              ]}
            />
            <Textarea label="Message" placeholder="Type your message..." />
          </div>
        </section>
        
        {/* Cards */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Cards</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Card Title</CardTitle>
                <CardDescription>This is a description</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Card content goes here.</p>
              </CardContent>
              <CardFooter>
                <Button size="sm">Action</Button>
                <Button size="sm" variant="outline">Cancel</Button>
              </CardFooter>
            </Card>
            
            <StatCard 
              title="Total Revenue"
              value="$45,231"
              change="+20.1% from last month"
              changeType="positive"
            />
          </div>
        </section>
        
        {/* Badges */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Badges</h2>
          <div className="flex flex-wrap gap-2">
            <Badge>Default</Badge>
            <Badge variant="success">Success</Badge>
            <Badge variant="warning">Warning</Badge>
            <Badge variant="error">Error</Badge>
            <Badge variant="info">Info</Badge>
          </div>
        </section>
        
        {/* Alerts */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Alerts</h2>
          <div className="space-y-4">
            <Alert variant="info" title="Information">
              This is an informational message.
            </Alert>
            <Alert variant="success" title="Success">
              Your changes have been saved.
            </Alert>
            <Alert variant="warning" title="Warning">
              Your session will expire soon.
            </Alert>
            <Alert variant="error" title="Error">
              Something went wrong.
            </Alert>
          </div>
        </section>
        
        {/* Avatars */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Avatars</h2>
          <div className="flex items-center gap-4">
            <Avatar name="John Doe" size="sm" />
            <Avatar name="Jane Smith" size="md" />
            <Avatar name="Bob Wilson" size="lg" />
            <Avatar name="Alice Brown" size="xl" />
          </div>
        </section>
        
        {/* Spinner */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Spinner</h2>
          <div className="flex items-center gap-4">
            <Spinner size="sm" />
            <Spinner size="md" />
            <Spinner size="lg" />
          </div>
        </section>
        
        {/* Empty State */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Empty State</h2>
          <Card>
            <EmptyState 
              title="No items yet"
              description="Get started by creating your first item."
              action={<Button>Create Item</Button>}
            />
          </Card>
        </section>
        
        {/* Modal */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Modal</h2>
          <Button onClick={() => setModalOpen(true)}>Open Modal</Button>
          <Modal 
            isOpen={modalOpen} 
            onClose={() => setModalOpen(false)}
            title="Confirm Action"
          >
            <p className="text-gray-600 mb-6">Are you sure you want to continue?</p>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
              <Button onClick={() => setModalOpen(false)}>Confirm</Button>
            </div>
          </Modal>
        </section>
      </div>
    </div>
  )
}
