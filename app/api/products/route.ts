import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { products, users, labReports } from '@/db/schema';
import { requireAuth } from '@/lib/session';
import { eq, and, gte, lte, ilike, asc, desc, SQL } from 'drizzle-orm';

const VALID_CATEGORIES = ['Flores', 'Parafernalia', 'Geneticas'] as const;
type Category = (typeof VALID_CATEGORIES)[number];

const VALID_SORTS = ['price_asc', 'price_desc', 'newest'] as const;

function buildOrderBy(sort: string | null) {
  switch (sort) {
    case 'price_asc':
      return asc(products.price);
    case 'price_desc':
      return desc(products.price);
    case 'newest':
    default:
      return desc(products.createdAt);
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const sort = searchParams.get('sort');
    // NOTE: THC/CBD filtering not available — products table has no thcPercent/cbdPercent columns.
    // Cannabinoid data lives in labReports.results (JSON text) via products.labReportId.
    // TODO: parse labReports.results JSON and filter by cannabinoid ranges when performance allows.

    const conditions: SQL[] = [eq(products.status, 'Active')];

    if (category && VALID_CATEGORIES.includes(category as Category)) {
      conditions.push(eq(products.category, category as Category));
    }

    if (search && search.trim().length > 0) {
      conditions.push(ilike(products.name, `%${search.trim()}%`));
    }

    const rows = await db
      .select({
        id: products.id,
        name: products.name,
        description: products.description,
        category: products.category,
        price: products.price,
        basePrice: products.basePrice,
        stock: products.stock,
        imageUrl: products.imageUrl,
        sellerId: products.sellerId,
        labReportId: products.labReportId,
        status: products.status,
        createdAt: products.createdAt,
        sellerUsername: users.username,
      })
      .from(products)
      .leftJoin(users, eq(products.sellerId, users.id))
      .where(and(...conditions))
      .orderBy(buildOrderBy(sort));

    return NextResponse.json({ products: rows });
  } catch (error) {
    console.error('GET /api/products error:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth();
    const body = await request.json();
    const { name, description, category, price, basePrice, stock, imageUrl, labReportId } = body;

    const errors: string[] = [];
    if (!name || name.trim().length === 0) errors.push('Nombre requerido');
    if (name && name.length > 200) errors.push('Nombre demasiado largo');
    if (price === undefined || price < 0) errors.push('Precio debe ser >= 0');
    if (price !== undefined && !Number.isInteger(price)) errors.push('Precio debe ser entero (tokens)');
    if (category && !VALID_CATEGORIES.includes(category)) errors.push('Categoría inválida');
    if (stock !== undefined && (stock < 0 || !Number.isInteger(stock))) errors.push('Stock debe ser entero >= 0');

    if (errors.length > 0) {
      return NextResponse.json({ errors }, { status: 400 });
    }

    const [created] = await db
      .insert(products)
      .values({
        name: name.trim(),
        description: description ?? null,
        category: category ?? 'Flores',
        price: price ?? 0,
        basePrice: basePrice ?? price ?? 0,
        stock: stock ?? 1,
        imageUrl: imageUrl ?? null,
        sellerId: session.userId,
        labReportId: labReportId ?? null,
        status: 'Active',
      })
      .returning();

    return NextResponse.json({ product: created }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === 'No autenticado') {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }
    console.error('POST /api/products error:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
