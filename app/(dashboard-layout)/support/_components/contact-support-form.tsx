import { Input } from '@/ui/primitives/input';
import { Label } from '@/ui/primitives/label';
import { Card } from '@/ui/primitives/card';
import { RadioGroup } from '@/ui/primitives/radio-group';

export default function ContactSupportForm() {
  return (
    <Card className="space-y-4 p-6">
      <h2 className="text-2xl font-semibold">Contact Support</h2>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Email</Label>
          <Input type="email" placeholder="your@email.com" />
        </div>
        <div className="space-y-2">
          <Label>Subject</Label>
          <Input placeholder="Brief description of your issue" />
        </div>
        <div className="space-y-2">
          <Label>Priority</Label>
          <RadioGroup defaultValue="normal" className="flex gap-4">
            <div className="flex items-center space-x-2">
              <input type="radio" id="normal" value="normal" name="priority" className="text-primary" />
              <Label htmlFor="normal">Normal</Label>
            </div>
            <div className="flex items-center space-x-2">
              <input type="radio" id="urgent" value="urgent" name="priority" className="text-primary" />
              <Label htmlFor="urgent">Urgent</Label>
            </div>
          </RadioGroup>
        </div>
        <div className="space-y-2">
          <Label>Message</Label>
          <textarea
            className="border-input placeholder:text-muted-foreground focus-visible:ring-ring min-h-[100px] w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:ring-1 focus-visible:outline-none"
            placeholder="Describe your GPU mining issue in detail..."
          />
        </div>
        <span className="text-primary border-primary inline-block cursor-not-allowed rounded-md border px-4 py-2 text-sm font-medium">
          Submit Ticket
        </span>
      </div>
    </Card>
  );
}
