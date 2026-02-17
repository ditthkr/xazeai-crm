"use client";

import { useEffect, useState } from "react";
import { Copy, Eye, EyeOff, Loader2, Plus, Trash2, Key } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
    PartnerTenant,
    TenantKey,
    createTenantKey,
    getTenantKeys,
    revokeTenantKey,
    CreateTenantKeyResponse
} from "@/app/actions/partner";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function TenantKeysDialog({
    tenant,
    open,
    onOpenChange
}: {
    tenant: PartnerTenant;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}) {
    const [keys, setKeys] = useState<TenantKey[]>([]);
    const [loading, setLoading] = useState(false);
    const [view, setView] = useState<"list" | "create">("list");
    const [createdKey, setCreatedKey] = useState<CreateTenantKeyResponse | null>(null);

    const fetchKeys = async () => {
        setLoading(true);
        const data = await getTenantKeys(tenant.data.id);
        setKeys(data);
        setLoading(false);
    };

    useEffect(() => {
        if (open) {
            fetchKeys();
            setView("list");
            setCreatedKey(null);
        }
    }, [open, tenant.data.id]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Manage API Keys</DialogTitle>
                    <DialogDescription>
                        Manage API keys for {tenant.data.name}.
                    </DialogDescription>
                </DialogHeader>

                {view === "list" && (
                    <div className="space-y-4">
                        <div className="flex justify-end">
                            <Button onClick={() => setView("create")} size="sm">
                                <Plus className="mr-2 h-4 w-4" /> Generate New Key
                            </Button>
                        </div>
                        <div className="border rounded-md">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Prefix</TableHead>
                                        <TableHead>Scopes</TableHead>
                                        <TableHead>Created</TableHead>
                                        <TableHead className="w-[50px]"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {loading ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center h-24">
                                                <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                                            </TableCell>
                                        </TableRow>
                                    ) : keys.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                                                No API keys found.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        keys.map((key) => (
                                            <KeyRow
                                                key={key.id}
                                                tenantId={tenant.data.id}
                                                apiKey={key}
                                                onRevoked={fetchKeys}
                                            />
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                )}

                {view === "create" && (
                    <CreateKeyForm
                        tenantId={tenant.data.id}
                        onCancel={() => setView("list")}
                        onSuccess={(response) => {
                            setCreatedKey(response);
                            fetchKeys(); // Refresh list in background
                        }}
                    />
                )}

                {createdKey && (
                    <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                            <DialogTitle>API Key Generated</DialogTitle>
                            <DialogDescription>
                                Please copy your API key now. You won't be able to see it again!
                            </DialogDescription>
                        </DialogHeader>
                        <div className="py-4">
                            <div className="space-y-2">
                                <Label>API Key</Label>
                                <ApiKeyDisplay apiKey={createdKey.api_key || ""} />
                            </div>
                            {createdKey.details && (
                                <div className="mt-4 p-4 bg-muted rounded-md text-sm space-y-2">
                                    <div className="grid grid-cols-3 gap-2">
                                        <span className="font-medium text-muted-foreground">Scopes:</span>
                                        <div className="col-span-2 flex flex-wrap gap-1">
                                            {createdKey.details.scopes.map(scope => (
                                                <Badge key={scope} variant="secondary" className="text-xs">
                                                    {scope}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                        <DialogFooter>
                            <Button onClick={() => {
                                setCreatedKey(null);
                                setView("list");
                            }}>
                                Done
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                )}
            </DialogContent>
        </Dialog>
    );
}

function KeyRow({ tenantId, apiKey, onRevoked }: { tenantId: string; apiKey: TenantKey; onRevoked: () => void }) {
    const [revoking, setRevoking] = useState(false);

    const handleRevoke = async () => {
        setRevoking(true);
        const result = await revokeTenantKey(tenantId, apiKey.id);
        if (result.success) {
            toast.success("Key revoked successfully");
            onRevoked();
        } else {
            toast.error(result.error || "Failed to revoke key");
        }
        setRevoking(false);
    };

    return (
        <TableRow>
            <TableCell className="font-medium">
                {apiKey.name}
            </TableCell>
            <TableCell className="font-mono text-xs text-muted-foreground">
                {apiKey.prefix}...
            </TableCell>
            <TableCell>
                <div className="flex flex-wrap gap-1">
                    {apiKey.scopes.map((scope) => (
                        <Badge key={scope} variant="outline" className="text-[10px] px-1 py-0 h-5">
                            {scope}
                        </Badge>
                    ))}
                </div>
            </TableCell>
            <TableCell className="text-xs text-muted-foreground">
                {new Date(apiKey.created_at).toLocaleDateString()}
            </TableCell>
            <TableCell>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                            disabled={revoking}
                        >
                            {revoking ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <Trash2 className="h-4 w-4" />
                            )}
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently revoke the API key including scopes: {apiKey.scopes.join(", ")}.
                                Any applications using it will no longer be able to access the API.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleRevoke} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                Revoke Key
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </TableCell>
        </TableRow>
    );
}

function CreateKeyForm({ tenantId, onCancel, onSuccess }: { tenantId: string; onCancel: () => void; onSuccess: (res: CreateTenantKeyResponse) => void }) {
    const [name, setName] = useState("");
    const [isPending, setIsPending] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsPending(true);
        const formData = new FormData();
        formData.append("tenantId", tenantId);
        formData.append("name", name);

        const result = await createTenantKey(null, formData);
        setIsPending(false);

        if (result.error) {
            toast.error(result.error);
        } else {
            toast.success("API Key generated successfully");
            onSuccess(result);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 py-2">
            <div className="space-y-2">
                <Label htmlFor="keyName">Key Name</Label>
                <Input
                    id="keyName"
                    placeholder="e.g. App Key"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    autoFocus
                    autoComplete="off"
                />
            </div>
            <div className="space-y-2">
                <Label>Scopes</Label>
                <div className="flex gap-2">
                    <Badge variant="outline">chat:read</Badge>
                    <Badge variant="outline">chat:write</Badge>
                </div>
                <p className="text-xs text-muted-foreground">Default scopes for tenant keys.</p>
            </div>
            <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={onCancel} disabled={isPending}>
                    Cancel
                </Button>
                <Button type="submit" disabled={isPending || !name.trim()}>
                    {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Generate
                </Button>
            </div>
        </form>
    );
}

function ApiKeyDisplay({ apiKey }: { apiKey: string }) {
    const [visible, setVisible] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(apiKey);
        setCopied(true);
        toast.success("Copied to clipboard");
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="relative">
            <Input
                readOnly
                value={apiKey}
                type={visible ? "text" : "password"}
                className="pr-20 font-mono"
            />
            <div className="absolute right-0 top-0 h-full flex items-center pr-1 gap-1">
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => setVisible(!visible)}
                >
                    {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={handleCopy}
                >
                    <Copy className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}
