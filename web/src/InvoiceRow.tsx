import type { Invoice } from "./invoicesType";
import statusLabel from "./statusLabel";

interface InvoiceRowProps {
    invoice: Invoice;
}

export default function InvoiceRow(props: InvoiceRowProps) {
    return <tr>
        <td>{props.invoice.customer.name}</td>
        <td>{props.invoice.amount}</td>
        <td>{props.invoice.issueDate}</td>
        <td>{props.invoice.dueDate}</td>
        <td>{statusLabel(props.invoice.status)}</td>
    </tr>;
}