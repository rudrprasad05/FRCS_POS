import { GetSuperAdminDashboard } from "@/actions/SuperAdminDashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";

export default async function page() {
  const res = await GetSuperAdminDashboard();
  return (
    <div className="p-12 space-y-6">
      <Card className="">
        <CardHeader>
          <CardTitle>Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 text-muted-foreground capitalize text-sm">
            <div>Username</div>
            <div>Email</div>
            <div>Id</div>
          </div>
          {res.data?.users.map((user, i) => (
            <div className="grid grid-cols-3" key={i}>
              <div>{user.username}</div>
              <div>{user.email}</div>
              <div>{user.id}</div>
            </div>
          ))}
        </CardContent>
      </Card>
      <Card className="">
        <CardHeader>
          <CardTitle>Companies</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 text-muted-foreground capitalize text-sm">
            <div>Company Name</div>
            <div>Admin Username</div>
          </div>
          {res.data?.companies.map((comapny, i) => (
            <div className="grid grid-cols-3" key={i}>
              <div>{comapny.name}</div>
              <div>{comapny.adminUser?.username}</div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
