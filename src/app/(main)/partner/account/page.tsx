import { Suspense } from "react";
import { CreditCard, DollarSign, Wallet } from "lucide-react";
import { getPartnerProfile } from "@/app/actions/partner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { ProfileSettings } from "./_components/profile-settings";

export default async function AccountPage() {
    const profile = await getPartnerProfile();

    if (!profile) {
        return <div className="p-8">Failed to load profile information.</div>;
    }

    return (
        <div className="flex flex-col gap-6 p-8">
            <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Wallet Balance</CardTitle>
                        <Wallet className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${parseFloat(profile.wallet_balance).toFixed(2)}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Credit Limit</CardTitle>
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${parseFloat(profile.credit_limit).toFixed(2)}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Default Markup Rate</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {profile.default_tenant_markup_rate
                                ? `${(profile.default_tenant_markup_rate * 100).toFixed(0)}%`
                                : "N/A"}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <ProfileSettings profile={profile} />

            <Card>
                <CardHeader>
                    <CardTitle>Rates</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Model</TableHead>
                                    <TableHead className="text-right">Rate (per token)</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {Object.entries(profile.system_rates || {}).map(([model, rate]) => (
                                    <TableRow key={model}>
                                        <TableCell className="font-medium">{model}</TableCell>
                                        <TableCell className="text-right font-mono">${rate}</TableCell>
                                    </TableRow>
                                ))}
                                {(!profile.system_rates || Object.keys(profile.system_rates).length === 0) && (
                                    <TableRow>
                                        <TableCell colSpan={2} className="text-center text-muted-foreground">
                                            No system rates available
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

