<script setup>
import { ref, onMounted, computed } from "vue";
import { processedUrlsApi } from "@/services/api";
import Table from "@/components/ui/Table.vue";
import TableHeader from "@/components/ui/TableHeader.vue";
import TableBody from "@/components/ui/TableBody.vue";
import TableRow from "@/components/ui/TableRow.vue";
import TableHead from "@/components/ui/TableHead.vue";
import TableCell from "@/components/ui/TableCell.vue";
import Sheet from "@/components/ui/Sheet.vue";
import SheetContent from "@/components/ui/SheetContent.vue";
import SheetHeader from "@/components/ui/SheetHeader.vue";
import SheetTitle from "@/components/ui/SheetTitle.vue";
import SheetDescription from "@/components/ui/SheetDescription.vue";
import Badge from "@/components/ui/Badge.vue";
import Card from "@/components/ui/Card.vue";
import CardHeader from "@/components/ui/CardHeader.vue";
import CardTitle from "@/components/ui/CardTitle.vue";
import CardContent from "@/components/ui/CardContent.vue";
import Button from "@/components/ui/Button.vue";

const records = ref([]);
const selectedRecord = ref(null);
const isSheetOpen = ref(false);
const isLoading = ref(true);
const error = ref(null);

const fetchRecords = async () => {
    try {
        isLoading.value = true;
        error.value = null;
        const data = await processedUrlsApi.getAll();
        records.value = data;
    } catch (err) {
        error.value =
            "Failed to fetch records. Please check if the backend is running.";
        console.error("Error fetching records:", err);
    } finally {
        isLoading.value = false;
    }
};

const openSheet = (record) => {
    selectedRecord.value = record;
    isSheetOpen.value = true;
};

const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
};

const formatCurrency = (value) => {
    if (!value) return "-";
    return new Intl.NumberFormat("pt-PT", {
        style: "currency",
        currency: "EUR",
    }).format(value);
};

const getPriceDisplay = (record) => {
    if (record.financialProduct === "Apoio ao PVP" && record.pvpCampaign) {
        return formatCurrency(record.pvpCampaign);
    } else if (record.financialProduct === "Mensalidade" && record.monthlyFee) {
        return formatCurrency(record.monthlyFee);
    }
    return "-";
};

const carDetails = computed(() => {
    if (!selectedRecord.value?.fullResult?.car) return [];
    const car = selectedRecord.value.fullResult.car;
    return [
        { label: "Brand", value: car.brand || "-" },
        { label: "Model", value: car.model || "-" },
        { label: "Version", value: car.version || "-" },
        { label: "Fuel", value: car.fuel || "-" },
        { label: "Kilometers Limit", value: car.kilometers_limit || "0" },
    ];
});

const campaignDetails = computed(() => {
    if (!selectedRecord.value?.fullResult?.campaign) return [];
    const campaign = selectedRecord.value.fullResult.campaign;
    return [
        { label: "Recipients", value: campaign.recipients || "-" },
        {
            label: "Financial Product",
            value: campaign.financial_product || "-",
        },
        {
            label: "PVP Campaign",
            value: campaign.pvp_campaign
                ? formatCurrency(campaign.pvp_campaign)
                : "-",
        },
        {
            label: "Monthly Fee (Total)",
            value: campaign.monthly_fee?.total
                ? formatCurrency(campaign.monthly_fee.total)
                : "-",
        },
        {
            label: "Monthly Fee (Maintenance)",
            value: campaign.monthly_fee?.maintenance_included
                ? formatCurrency(campaign.monthly_fee.maintenance_included)
                : "-",
        },
        {
            label: "Entry Fee",
            value: campaign.entry_fee
                ? formatCurrency(campaign.entry_fee)
                : "-",
        },
        {
            label: "Number of Monthly Fees",
            value: campaign.number_of_monthly_fees || "-",
        },
        { label: "Due Date", value: campaign.due_date || "-" },
        { label: "TAN", value: campaign.tan ? `${campaign.tan}%` : "-" },
        { label: "TAEG", value: campaign.taeg ? `${campaign.taeg}%` : "-" },
        { label: "PVPR", value: campaign.pvpr || "-" },
        { label: "Legal Note", value: campaign.legal_note || "-" },
        { label: "Summary", value: campaign.summary || "-" },
    ];
});

onMounted(() => {
    fetchRecords();
});
</script>

<template>
    <div class="min-h-screen bg-background">
        <div class="container mx-auto py-10">
            <div class="mb-8">
                <h1 class="text-4xl font-bold tracking-tight">
                    Brands Dashboard
                </h1>
                <p class="text-muted-foreground mt-2">
                    View and manage processed URLs and campaigns
                </p>
            </div>

            <!-- Error Message -->
            <div
                v-if="error"
                class="mb-6 p-4 bg-destructive/10 border border-destructive rounded-lg"
            >
                <p class="text-destructive">{{ error }}</p>
            </div>

            <!-- Loading State -->
            <div
                v-if="isLoading"
                class="flex items-center justify-center py-20"
            >
                <div class="text-center">
                    <div
                        class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                    ></div>
                    <p class="mt-4 text-muted-foreground">Loading records...</p>
                </div>
            </div>

            <!-- Data Table -->
            <div v-else-if="records.length > 0" class="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>URL</TableHead>
                            <TableHead>Brand</TableHead>
                            <TableHead>Model</TableHead>
                            <TableHead>Recipients</TableHead>
                            <TableHead>Financial Product</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Due Date</TableHead>
                            <TableHead>Modified Date</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow
                            v-for="record in records"
                            :key="record.id"
                            @click="openSheet(record)"
                            class="cursor-pointer"
                        >
                            <TableCell class="font-medium max-w-xs truncate">
                                <a
                                    :href="record.url"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    class="text-primary hover:underline"
                                    @click.stop
                                >
                                    {{ record.url }}
                                </a>
                            </TableCell>
                            <TableCell>{{ record.brand || "-" }}</TableCell>
                            <TableCell>{{ record.model || "-" }}</TableCell>
                            <TableCell>{{
                                record.recipients || "-"
                            }}</TableCell>
                            <TableCell>
                                <Badge
                                    v-if="record.financialProduct"
                                    variant="secondary"
                                >
                                    {{ record.financialProduct }}
                                </Badge>
                                <span v-else>-</span>
                            </TableCell>
                            <TableCell>{{ getPriceDisplay(record) }}</TableCell>
                            <TableCell>{{ record.dueDate || "-" }}</TableCell>
                            <TableCell>{{
                                formatDate(record.modifiedAt)
                            }}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>

            <!-- Empty State -->
            <div v-else class="flex items-center justify-center py-20">
                <div class="text-center">
                    <p class="text-xl text-muted-foreground">
                        No records found
                    </p>
                    <Button
                        @click="fetchRecords"
                        variant="outline"
                        class="mt-4"
                    >
                        Refresh
                    </Button>
                </div>
            </div>
        </div>

        <!-- Detail Sheet -->
        <Sheet v-model:open="isSheetOpen">
            <SheetContent class="w-full sm:max-w-2xl overflow-y-auto">
                <SheetHeader v-if="selectedRecord">
                    <SheetTitle>Campaign Details</SheetTitle>
                    <SheetDescription>
                        {{ selectedRecord.brand }} {{ selectedRecord.model }}
                    </SheetDescription>
                </SheetHeader>

                <div v-if="selectedRecord" class="mt-6 space-y-6">
                    <!-- URL -->
                    <div>
                        <h3
                            class="text-sm font-medium text-muted-foreground mb-2"
                        >
                            Resumo
                        </h3>
                        <p>{{ selectedRecord.fullResult.campaign.summary }}</p>
                    </div>

                    <!-- Car Information -->
                    <Card>
                        <CardHeader>
                            <CardTitle class="text-lg"
                                >Car Information</CardTitle
                            >
                        </CardHeader>
                        <CardContent>
                            <dl class="grid grid-cols-1 gap-4">
                                <div
                                    v-for="detail in carDetails"
                                    :key="detail.label"
                                >
                                    <dt
                                        class="text-sm font-medium text-muted-foreground"
                                    >
                                        {{ detail.label }}
                                    </dt>
                                    <dd class="mt-1 text-sm">
                                        {{ detail.value }}
                                    </dd>
                                </div>
                            </dl>
                        </CardContent>
                    </Card>

                    <!-- Campaign Information -->
                    <Card>
                        <CardHeader>
                            <CardTitle class="text-lg"
                                >Campaign Information</CardTitle
                            >
                        </CardHeader>
                        <CardContent>
                            <dl class="grid grid-cols-1 gap-4">
                                <div
                                    v-for="detail in campaignDetails"
                                    :key="detail.label"
                                >
                                    <dt
                                        class="text-sm font-medium text-muted-foreground"
                                    >
                                        {{ detail.label }}
                                    </dt>
                                    <dd class="mt-1 text-sm">
                                        {{ detail.value }}
                                    </dd>
                                </div>
                            </dl>
                        </CardContent>
                    </Card>

                    <!-- Screenshot -->
                    <Card v-if="selectedRecord.screenshot">
                        <CardHeader>
                            <CardTitle class="text-lg">Screenshot</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <a
                                :href="selectedRecord.screenshot"
                                target="_blank"
                                rel="noopener noreferrer"
                                class="text-primary hover:underline"
                            >
                                View Screenshot
                            </a>
                        </CardContent>
                    </Card>

                    <!-- Metadata -->
                    <Card>
                        <CardHeader>
                            <CardTitle class="text-lg">Metadata</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <dl class="grid grid-cols-1 gap-4">
                                <div>
                                    <dt
                                        class="text-sm font-medium text-muted-foreground"
                                    >
                                        Created At
                                    </dt>
                                    <dd class="mt-1 text-sm">
                                        {{
                                            formatDate(selectedRecord.createdAt)
                                        }}
                                    </dd>
                                </div>
                                <div>
                                    <dt
                                        class="text-sm font-medium text-muted-foreground"
                                    >
                                        Modified At
                                    </dt>
                                    <dd class="mt-1 text-sm">
                                        {{
                                            formatDate(
                                                selectedRecord.modifiedAt,
                                            )
                                        }}
                                    </dd>
                                </div>
                                <div>
                                    <dt
                                        class="text-sm font-medium text-muted-foreground"
                                    >
                                        Status
                                    </dt>
                                    <dd class="mt-1 text-sm">
                                        <Badge
                                            :variant="
                                                selectedRecord.active
                                                    ? 'default'
                                                    : 'secondary'
                                            "
                                        >
                                            {{
                                                selectedRecord.active
                                                    ? "Active"
                                                    : "Inactive"
                                            }}
                                        </Badge>
                                    </dd>
                                </div>
                            </dl>
                        </CardContent>
                    </Card>
                </div>
            </SheetContent>
        </Sheet>
    </div>
</template>
