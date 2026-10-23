import { connect } from 'node:http2';
import pool from '../../shared/database.ts';

export type InvoiceStatus = 'paid' | 'pending';
type InvoiceSituation = 'paid' | 'pending' | 'overdue';

interface Customer {
  id: number;
  name: string;
  email: string;
}

export interface Invoice {
  id: number;
  amount: number;
  status: InvoiceStatus;
  situation: InvoiceSituation;
  issueDate: string;
  dueDate: string;
  customer: Customer;
}

interface InvoiceRow {
  id: number;
  amount: number;
  status_: InvoiceStatus;
  situation: InvoiceSituation;
  issue_date: string;
  due_date: string;
  customer_id: number;
  customer_name: string;
  customer_email: string;
}

interface Invoiceinput {
  customerId: number;
  amount: number;
  status: InvoiceStatus;
  issueDate: string;
  dueDate: string;
}

const baseQuery = `
  SELECT
    invoices.id,
    invoices.amount,
    invoices.status_,
    CASE
      WHEN status_ = 'paid' THEN 'paid'
      WHEN invoices.due_date < CURRENT_DATE THEN 'overdue'
      ELSE 'pending'
    END AS situation,
    invoices.issue_date::text,
    invoices.due_date::text,
    customers.id AS customer_id,
    customers.name_ AS customer_name,
    customers.email AS customer_email
  FROM invoices
  JOIN customers ON invoices.customer_id = customer_id
`;

function toInvoice(row: InvoiceRow): Invoice {
  return {
    id: row.id,
    amount: row.amount,
    status: row.status_,
    situation: row.situation,
    issueDate: row.issue_date,
    dueDate: row.due_date,
    customer: {
      id: row.customer_id,
      name: row.customer_name,
      email: row.customer_email,
    },
  };
}

function toInvoices(rows: InvoiceRow[]): Invoice[] {
  const invoices: Invoice[] = [];

  rows.forEach((invoice) => invoices.push(toInvoice(invoice)));

  return invoices;
}

export async function findAllInvoices(): Promise<Invoice[]> {
  const connect = await pool.query<InvoiceRow>(
    `${baseQuery} ORDER BY invoices.issue_date DESC;`,
  );
  return toInvoices(connect.rows);
}

export async function findInvoiceById(
  id: number,
): Promise<Invoice | undefined> {
  const connect = await pool.query<InvoiceRow>(
    `${baseQuery} WHERE invoices.id = $1;`,
    [id],
  );

  if (!connect.rows.length) return undefined;

  return toInvoice(connect.rows[0]);
}

export async function findRecentInvoice(): Promise<Invoice[]> {
  const connect = await pool.query(
    `${baseQuery} ORDER BY invoices.created_at DESC LIMIT 5`,
  );
  return toInvoices(connect.rows);
}

export async function findOverdueInvoices(): Promise<Invoice[]> {
  const connect = await pool.query(
    `${baseQuery} WHERE invoices.status_ = 'pending' AND invoices.due_date < CURRENT_DATE ORDER BY invoices.due_date LIMIT 5`,
  );
  return toInvoices(connect.rows);
}

export async function insertInvoice(datas: Invoiceinput): Promise<Invoice | undefined> {
  const connect = await pool.query<{ id: number }>(
    `
    INSERT INTO invoices (customer_id, amount, status_, issue_date, due_date)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id;
    `,
    [datas.customerId, datas.amount, datas.status, datas.issueDate, datas.dueDate]
  );

  return await findInvoiceById(connect.rows[0].id);
}

export async function modifyInvoice(id: number, datas: Invoiceinput): Promise<Invoice | undefined> {
  const connect = await pool.query<{ id: number }>(
    `
    UPDATE invoices
    SET
      customer_id = $1,
      amount = $2,
      status_ = $3,
      issue_date = $4,
      due_date = $5
    WHERE id = $6
    RETURNING id;
    `,
    [datas.customerId, datas.amount, datas.status, datas.issueDate, datas.dueDate, id]
  );

  return await findInvoiceById(connect.rows[0].id);
}

export async function removeInvoice(id: number): Promise<boolean> {
  const connect = await pool.query<{ id: number }>(
    `
    DELETE FROM invoices
    WHERE id = $1
    RETURNING id;
    `,
    [id]
  );

  return connect.rows.length > 0;
}