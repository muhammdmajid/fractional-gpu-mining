import { Button } from "@/ui/primitives/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/ui/primitives/card";
import { Input } from "@/ui/primitives/input";


export default function NewsLetter() {
  return (
    <div className="w-full mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Subscribe to our newsletter</CardTitle>
          <CardDescription>Enter your email address to receive updates and news.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="flex items-center flex-col space-y-2">
            <Input type="email" placeholder="Enter your email" className="flex-1 h-15" />
            <Button type="submit" className="w-full">Subscribe</Button>
          </form>

        </CardContent>
      </Card>
    </div>
  )
}