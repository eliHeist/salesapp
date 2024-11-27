import { PDFDocument, rgb } from 'pdf-lib';
import { PrismaClient } from '@prisma/client';
import { error } from '@sveltejs/kit';

const prisma = new PrismaClient();

interface Sale {
    quantity: number;
    total: number;
    product: {
        name: string;
        price: number;
    };
}

const drawTable = (page: any, sales: Sale[]) => {
    // Set up constants for table layout
    const tableStartX = 50;
    const tableStartY = 670;
    const cellHeight = 20;
    const columns = [
        { name: 'Qty', x: 50, width: 100 },
        { name: 'Particulars', x: 150, width: 200 },
        { name: 'Rate', x: 350, width: 100 },
        { name: 'Amount', x: 450, width: 100 }
    ];

    // Draw table headers
    let y = tableStartY;
    columns.forEach(col => {
        page.drawText(col.name, { x: col.x, y });
    });

    // Move to the next row
    y -= cellHeight;

    // Draw each sale item
    sales.forEach(sale => {
        page.drawText(sale.quantity.toString(), { x: columns[0].x, y });
        page.drawText(sale.product.name, { x: columns[1].x, y });
        page.drawText(sale.product.price.toLocaleString('en-US'), { x: columns[2].x, y });
        page.drawText(sale.total.toLocaleString('en-US'), { x: columns[3].x, y });

        y -= cellHeight;
    });

    // Draw the total price
    const total = sales.reduce((sum, sale) => sum + sale.total, 0);
    page.drawText(`${total.toLocaleString('en-US', { style: 'currency', currency: 'UGX' })}`,
        {
            x: columns[3].x - 30,
            y: y - cellHeight,
            size: 13
        });
};


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
    page.drawText(`e-Receipt #${id}`, { x: 50, y: 750, size: 20, color: rgb(0, 0, 0) });
    page.drawText(`Date: ${new Date(date).toLocaleDateString()}`, { x: 50, y: 720 });
    page.drawText(`Description: ${description || 'N/A'}`, { x: 50, y: 700 });

    // Draw the table with sales data 
    drawTable(page, sales);

    // Save and return the PDF
    const pdfBytes = await pdfDoc.save();
    return new Response(pdfBytes, {
        headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="receipt_${id}.pdf"`
        }
    });
};
