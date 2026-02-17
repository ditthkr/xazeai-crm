import { getPartnerModels } from "@/app/actions/partner";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Box } from "lucide-react";

export default async function ModelsPage() {
    const models = await getPartnerModels();

    return (
        <div className="@container/main flex flex-col gap-4 md:gap-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Models</h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Box className="h-5 w-5" />
                        Available Models
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead className="text-right">Rate (per token)</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {models.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={2} className="h-24 text-center">
                                            No models found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    models.map((model) => (
                                        <TableRow key={model.id}>
                                            <TableCell className="font-medium">{model.name}</TableCell>
                                            <TableCell className="text-right font-mono">
                                                {formatCurrency(parseFloat(model.rate))}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
