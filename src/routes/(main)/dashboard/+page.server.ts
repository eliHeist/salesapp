import { redirect } from '@sveltejs/kit'
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const load = async ({ locals }) => {
    // redirect user if not logged in
    if (!locals.user) {
        redirect(302, '/auth/login')
    }

    const [
        totalRevenue, numberOfSales, topSellingProducts, topRevenueProducts,
        saleBatches
    ] = await Promise.all([
        prisma.sale.aggregate({
            _sum: { total: true }
        }),
        prisma.sale.count(),
        prisma.sale.groupBy({
            by: ['productId'],
            _sum: { quantity: true },
            orderBy: {
                _sum: { quantity: 'desc' }
            },
            take: 10,
        }).then(async (result) => {
            const topSellingProducts = result.map(async (topSellingProduct) => {
                const product = await prisma.product.findUnique({
                    where: { id: topSellingProduct.productId }
                });
                return { ...topSellingProduct, name: product.name };
            });
            return Promise.all(topSellingProducts);
        }),
        prisma.sale.groupBy({
            by: ['productId'],
            _sum: { total: true },
            orderBy: {
                _sum: { total: 'desc' }
            },
            take: 10,
        }).then(async (result) => {
            const topRevenueProducts = result.map(async (topRevenueProduct) => {
                const product = await prisma.product.findUnique({
                    where: { id: topRevenueProduct.productId }
                });
                return { ...topRevenueProduct, name: product.name };
            });
            return Promise.all(topRevenueProducts);
        }),
        // Sale batches with total revenue per batch
        prisma.saleBatch.findMany({
            orderBy: {
                date: 'asc'
            },
            include: {
                sales: true // Include related sales for manual aggregation
            }
        }).then((saleBatches) => {
            // Group batches by date
            const grouped = saleBatches.reduce((acc, batch) => {
                const dateKey = batch.date.toISOString().split('T')[0]; // Group by date (YYYY-MM-DD)
    
                if (!acc[dateKey]) {
                    acc[dateKey] = {
                        date: dateKey,
                        totalBatches: 0,
                        totalSales: 0,
                        totalRevenue: 0
                    };
                }
    
                // Aggregate batch data
                const totalRevenue = batch.sales.reduce((sum, sale) => sum + sale.total, 0);
                acc[dateKey].totalBatches += 1;
                acc[dateKey].totalRevenue += totalRevenue;
                acc[dateKey].totalSales += batch.sales.length;
                batch.sales.forEach((sale) => {
                    acc[dateKey].totalSales += sale.quantity;
                })
    
                return acc;
            }, {});
    
            // Convert the grouped object into an array
            return Object.values(grouped);
        })
    ])

    return { totalRevenue, numberOfSales, topSellingProducts, topRevenueProducts, saleBatches };
}

