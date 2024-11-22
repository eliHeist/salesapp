import { PDFDocument, rgb } from 'pdf-lib';
import { PrismaClient } from '@prisma/client';
import { error } from '@sveltejs/kit';

const prisma = new PrismaClient();

export const GET = async ({ params }) => {
    const { id } = params;

    // Fetch the sale batch data
    const saleBatch = await prisma.saleBatch.findUnique({
        where: { id: Number(id) },
        include: { sales: { include: { product: true } } }
    });

    if (!saleBatch) {
        throw error(404, 'Sale batch not found');
    }

    // Create a new PDF document
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 800]);
    const { sales, description, date } = saleBatch;

    page.setFontSize(12);

    // Set up the PDF content
    page.drawText(`Receipt #${id}`, { x: 50, y: 750, size: 20, color: rgb(0, 0, 0) });
    page.drawText(`Date: ${new Date(date).toLocaleDateString()}`, { x: 50, y: 720 });
    page.drawText(`Description: ${description || 'N/A'}`, { x: 50, y: 700 });

    // Add table headers
    let y = 670;
    page.drawText('Product', { x: 50, y });
    page.drawText('Quantity', { x: 250, y });
    page.drawText('Total Price', { x: 400, y });

    // Add each sale item
    y -= 20;
    sales.forEach((sale: any) => {
        page.drawText(sale.product.name, { x: 50, y });
        page.drawText(sale.quantity.toString(), { x: 250, y });
        page.drawText(sale.total.toLocaleString('en-US', { style: 'currency', currency: 'UGX' }), { x: 400, y });
        y -= 20;
    });

    // Total price
    const total = sales.reduce((sum: any, sale: any) => sum + sale.total, 0);
    page.drawText(`${total.toLocaleString('en-US', { style: 'currency', currency: 'UGX' })}`, { x: 400, y: y - 20, size: 16 });

    // Save and return the PDF
    const pdfBytes = await pdfDoc.save();
    return new Response(pdfBytes, {
        headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="receipt_${id}.pdf"`
        }
    });
};
