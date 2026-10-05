import type { Invoice } from "./invoicesType.ts"
import InvoiceRow from "./InvoiceRow.tsx";

interface InvoiceTableProp {
    invoices: Invoice[];
}

export default function InvoiceTable(props: InvoiceTableProp) {
    return <table>
        <thead>
            <tr>
                <td>Cliente</td>
                <td>Valor</td>
                <td>Data de Emissão</td>
                <td>Data de Vencimento</td>
                <td>Situação</td>
            </tr>
        </thead>
        <tbody>
            {props.invoices.map(invoice => (
                <InvoiceRow key={invoice.id} invoice={invoice} />
            ))}
        </tbody>
    </table>
}