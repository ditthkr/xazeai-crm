"use client";

import { useState, useEffect } from "react";
import { Plus, Loader2, Trash2, ExternalLink, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { usePlaygroundAuth } from "../../_components/playground-auth-provider";
import {
    createPlaygroundBusinessProfile,
    updatePlaygroundBusinessProfile,
    getPlaygroundBusinessProfile,
    type BusinessProfile,
} from "@/app/actions/playground";

interface BusinessProfileDialogProps {
    mode: "create" | "edit" | "view";
    profile?: BusinessProfile;
    trigger?: React.ReactNode;
    onSuccess?: () => void;
}

interface Contact {
    platform: string;
    source: string;
}

export function BusinessProfileDialog({
    mode,
    profile,
    trigger,
    onSuccess,
}: BusinessProfileDialogProps) {
    const { apiKey } = usePlaygroundAuth();
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Form State
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [type, setType] = useState("");

    // Config Fields
    const [targetAudience, setTargetAudience] = useState("");
    const [usp, setUsp] = useState("");
    const [operatingHours, setOperatingHours] = useState("");
    const [contacts, setContacts] = useState<Contact[]>([{ platform: "Line", source: "" }]);

    useEffect(() => {
        if (open) {
            if (profile) {
                // If viewing/editing, we might want to fetch fresh data to ensure we have the latest config
                // But for now, using the passed profile is faster. 
                // If deep fetching is needed, we can do it here.
                setName(profile.name);
                setDescription(profile.description || "");
                setType(profile.type || "");

                const config = profile.config || {};
                setTargetAudience(config.target_audience || "");
                setUsp(config.usp || "");
                setOperatingHours(config.operating_hours || "24 Hours");
                setContacts(Array.isArray(config.contact) ? config.contact : [{ platform: "Line", source: "" }]);
            } else {
                // Reset for create
                setName("");
                setDescription("");
                setType("");
                setTargetAudience("");
                setUsp("");
                setOperatingHours("24 Hours");
                setContacts([{ platform: "Line", source: "" }]);
            }
        }
    }, [open, mode, profile]);

    // Fetch full details if viewing (optional, but good practice if list data is partial)
    useEffect(() => {
        if (open && mode === "view" && profile?.id && apiKey) {
            const fetchData = async () => {
                const fullProfile = await getPlaygroundBusinessProfile(apiKey, profile.id);
                if (fullProfile) {
                    const config = fullProfile.config || {};
                    setTargetAudience(config.target_audience || "");
                    setUsp(config.usp || "");
                    setOperatingHours(config.operating_hours || "");
                    setContacts(Array.isArray(config.contact) ? config.contact : [{ platform: "Line", source: "" }]);
                }
            };
            fetchData();
        }
    }, [open, mode, profile, apiKey]);


    const handleAddContact = () => {
        setContacts([...contacts, { platform: "Line", source: "" }]);
    };

    const handleRemoveContact = (index: number) => {
        setContacts(contacts.filter((_, i) => i !== index));
    };

    const handleContactChange = (index: number, field: keyof Contact, value: string) => {
        const newContacts = [...contacts];
        newContacts[index] = { ...newContacts[index], [field]: value };
        setContacts(newContacts);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (mode === "view") {
            setOpen(false);
            return;
        }

        if (!apiKey) {
            toast.error("API Key not found");
            return;
        }

        setIsLoading(true);
        try {
            const config = {
                target_audience: targetAudience,
                usp,
                operating_hours: operatingHours,
                contact: contacts.filter(c => c.source.trim() !== ""), // Filter empty contacts
            };

            const payload = {
                name,
                description,
                type,
                config,
            };

            if (mode === "create") {
                const res = await createPlaygroundBusinessProfile(apiKey, payload);
                if (res.error) throw new Error(res.error);
                toast.success("Business Profile created");
            } else {
                if (!profile?.id) return;
                const res = await updatePlaygroundBusinessProfile(apiKey, profile.id, payload);
                if (res.error) throw new Error(res.error);
                toast.success("Business Profile updated");
            }

            setOpen(false);
            onSuccess?.();

        } catch (error: any) {
            toast.error(error.message || "Operation failed");
        } finally {
            setIsLoading(false);
        }
    };

    const isReadOnly = mode === "view";

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button size="sm">
                        <Plus className="mr-2 h-4 w-4" />
                        Create Profile
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {mode === "create" && "Create Business Profile"}
                        {mode === "edit" && "Edit Business Profile"}
                        {mode === "view" && "View Business Profile"}
                    </DialogTitle>
                    <DialogDescription>
                        {mode === "view" ? "Details of the business profile." : "Configure business identity and context."}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6 py-4">
                    {/* Basic Info */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-medium leading-none">Basic Information</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Golden777 Online"
                                    required
                                    disabled={isReadOnly}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="type">Type</Label>
                                <Input
                                    id="type"
                                    value={type}
                                    onChange={(e) => setType(e.target.value)}
                                    placeholder="Online Gambling"
                                    required
                                    disabled={isReadOnly}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Brief description of the business..."
                                className="resize-none"
                                rows={2}
                                disabled={isReadOnly}
                            />
                        </div>
                    </div>

                    <div className="border-t pt-4 space-y-4">
                        <h3 className="text-sm font-medium leading-none">Configuration</h3>

                        <div className="grid grid-cols-1 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="targetAudience">Target Audience</Label>
                                <Input
                                    id="targetAudience"
                                    value={targetAudience}
                                    onChange={(e) => setTargetAudience(e.target.value)}
                                    placeholder="e.g. Working adults who like excitement"
                                    disabled={isReadOnly}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="usp">Unique Selling Point (USP)</Label>
                                <Textarea
                                    id="usp"
                                    value={usp}
                                    onChange={(e) => setUsp(e.target.value)}
                                    placeholder="e.g. Auto deposit 3s, 5% cashback"
                                    disabled={isReadOnly}
                                    rows={2}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="operatingHours">Operating Hours</Label>
                                <Input
                                    id="operatingHours"
                                    value={operatingHours}
                                    onChange={(e) => setOperatingHours(e.target.value)}
                                    placeholder="e.g. 24 Hours"
                                    disabled={isReadOnly}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="border-t pt-4 space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-medium leading-none">Contact Channels</h3>
                            {!isReadOnly && (
                                <Button type="button" variant="outline" size="sm" onClick={handleAddContact}>
                                    <Plus className="h-3 w-3 mr-1" /> Add Channel
                                </Button>
                            )}
                        </div>

                        <div className="space-y-3">
                            {contacts.map((contact, index) => (
                                <div key={index} className="flex gap-2 items-start">
                                    <div className="w-[120px]">
                                        <Input
                                            value={contact.platform}
                                            onChange={(e) => handleContactChange(index, "platform", e.target.value)}
                                            placeholder="Platform"
                                            disabled={isReadOnly}
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <Input
                                            value={contact.source}
                                            onChange={(e) => handleContactChange(index, "source", e.target.value)}
                                            placeholder="ID / URL / Number"
                                            disabled={isReadOnly}
                                        />
                                    </div>
                                    {!isReadOnly && contacts.length > 1 && (
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleRemoveContact(index)}
                                            className="text-muted-foreground hover:text-destructive"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <DialogFooter>
                        {mode === "view" ? (
                            <Button type="button" onClick={() => setOpen(false)}>
                                Close
                            </Button>
                        ) : (
                            <>
                                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={isLoading}>
                                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    {mode === "create" ? "Create" : "Save Changes"}
                                </Button>
                            </>
                        )}
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
