import type { InvoiceStatus } from "./invoicesType.ts";

export default function statusLabel(status: InvoiceStatus) {
    return status === 'paid' ? 'Pago' : 'Pendente';
}