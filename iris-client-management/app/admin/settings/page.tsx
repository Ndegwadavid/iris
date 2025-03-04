"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Configure system preferences</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Business Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Business Name</Label>
            <Input placeholder="EyeCare Solutions" />
          </div>
          <div className="space-y-2">
            <Label>Contact Email</Label>
            <Input type="email" placeholder="admin@eyecare.com" />
          </div>
        </CardContent>
        <div className="p-6">
          <Button>Save Changes</Button>
        </div>
      </Card>
    </div>
  );
}